"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import FilterSortMobile from "./components/FilterSortMobile";
import MobileSortSheet from "./components/MobileSortSheet";
import TopInfo from "../components/TopInfo";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductListBanner from "./components/ProductListBanner";
import ProductFilterBar from "./components/ProductFilterBar";
import ProductGrid from "./components/ProductGrid";
import QuickView from "./components/QuickView";

import { getProductImageUrl } from "../services/productService";
import { fetchCategoryBySlug } from "../services/categoryService";
import { getApiImageUrl } from "../services/api";

import { useProducts } from "../hooks/useProducts";
import { useWishlist } from "../hooks/useWishlist";
import { useProductFilters } from "../hooks/useProductFilters";

const ProductListContent = () => {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const subCategory = searchParams.get("subCategory");

  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [isResolvingCategory, setIsResolvingCategory] =
    useState(!!categorySlug);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(
    null,
  );

  /* =======================
     UI State
  ======================= */
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortByOpen, setSortByOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState<
    { label: string; type: string; value: string }[]
  >([]);
  const [sortOption, setSortOption] = useState<string>("newest");

  /* =======================
     Wishlist
  ======================= */
  const { isProductInWishlist, toggleProductInWishlist } = useWishlist();

  /* =======================
     Resolve Category Slug → ID
  ======================= */
  useEffect(() => {
    const resolveCategory = async () => {
      if (!categorySlug) {
        setCategoryId(undefined);
        setIsResolvingCategory(false);
        return;
      }

      setIsResolvingCategory(true);
      try {
        const category = await fetchCategoryBySlug(categorySlug);
        if (category?._id) {
          setCategoryId(category._id);
        } else {
          console.warn("Category not found:", categorySlug);
        }
      } catch (error) {
        console.error("Error resolving category:", error);
      } finally {
        setIsResolvingCategory(false);
      }
    };

    resolveCategory();
  }, [categorySlug]);

  /* =======================
     Fetch Products
  ======================= */
  const {
    products,
    loading: productsLoading,
    error,
  } = useProducts({
    category: categoryId,
    subCategory: subCategory || undefined,
    limit: 50,
  });

  /* =======================
     Extract Filter Options
  ======================= */
  const filterOptions = useProductFilters(products);

  const loading = isResolvingCategory || productsLoading;

  /* =======================
     Handlers
  ======================= */
  const handleMobileSort = (option: string) => {
    setSortOption(option);
    setMobileSortOpen(false);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const handleFilterChange = (type: string, value: string) => {
    const filterLabel = `${type}: ${value}`;
    const existing = activeFilters.find((f) => f.label === filterLabel);

    if (existing) {
      setActiveFilters(activeFilters.filter((f) => f.label !== filterLabel));
    } else {
      setActiveFilters([...activeFilters, { label: filterLabel, type, value }]);
    }
  };

  const removeFilter = (label: string) => {
    setActiveFilters(activeFilters.filter((f) => f.label !== label));
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  const handleQuickView = (slug: string) => {
    setSelectedProductSlug(slug);
  };

  /* =======================
     Transform Products for Grid
  ======================= */
  const gridProducts = products.map((p) => {
    let lowestPrice = Infinity;
    let lowestMrp = Infinity;

    p.variants?.forEach((variant) => {
      variant.sizes?.forEach((size) => {
        const currentPrice =
          size.discountPrice && size.discountPrice > 0
            ? size.discountPrice
            : size.price;
        if (currentPrice < lowestPrice) {
          lowestPrice = currentPrice;
          lowestMrp = size.price; // The MRP corresponding to this lowest price
        }
      });
    });

    const discountPercent =
      lowestMrp > 0 && lowestPrice < lowestMrp
        ? Math.round(((lowestMrp - lowestPrice) / lowestMrp) * 100)
        : 0;

    /* ---- Derive Sizes from variants[].sizes[] ---- */
    const allSizes = Array.from(
      new Set(p.variants?.flatMap((v) => v.sizes?.map((s) => s.name)) || []),
    );

    const sizeLabel =
      allSizes.length === 0
        ? "One Size"
        : allSizes.length === 1
          ? allSizes[0]
          : `${allSizes[0]}–${allSizes[allSizes.length - 1]}`;

    return {
      _id: p._id,
      slug: p.slug,
      name: p.name,
      image: getProductImageUrl(p),
      hoverImage: p.hoverImage?.url
        ? getApiImageUrl(p.hoverImage.url)
        : getProductImageUrl(p),
      price: lowestPrice,
      mrp: lowestMrp,
      discount: discountPercent > 0 ? `${discountPercent}% OFF` : "",
      size: sizeLabel,
      rating: p.averageRating || 0,
      soldOut: p.stock <= 0,
      isWishlisted: isProductInWishlist(p._id),
    };
  });

  /* =======================
     Apply Filters and Sorting
  ======================= */
  let filteredProducts = [...gridProducts];

  // Apply filters
  activeFilters.forEach((filter) => {
    if (filter.type === "size") {
      filteredProducts = filteredProducts.filter((p) =>
        products
          .find((prod) => prod._id === p._id)
          ?.variants?.some((v) => v.sizes?.some((s) => s.name === filter.value)),
      );
    } else if (filter.type === "color") {
      filteredProducts = filteredProducts.filter((p) =>
        products
          .find((prod) => prod._id === p._id)
          ?.variants?.some((v) => v.color?.name === filter.value),
      );
    } else if (filter.type === "price") {
      const [min, max] = filter.value.split("-").map(Number);
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= min && (max === Infinity || p.price < max),
      );
    } else if (filter.type === "availability") {
      if (filter.value === "In Stock") {
        filteredProducts = filteredProducts.filter((p) => {
          const product = products.find((prod) => prod._id === p._id);
          return product && product.stock > 10;
        });
      } else if (filter.value === "Low Stock (≤10)") {
        filteredProducts = filteredProducts.filter((p) => {
          const product = products.find((prod) => prod._id === p._id);
          return product && product.stock > 0 && product.stock <= 10;
        });
      }
    } else if (filter.type === "wearType") {
      filteredProducts = filteredProducts.filter((p) => {
        const product = products.find((prod) => prod._id === p._id);
        return product?.wearType?.includes(filter.value);
      });
    } else if (filter.type === "occasion") {
      filteredProducts = filteredProducts.filter((p) => {
        const product = products.find((prod) => prod._id === p._id);
        return product?.occasion?.includes(filter.value);
      });
    } else if (filter.type === "tags") {
      filteredProducts = filteredProducts.filter((p) => {
        const product = products.find((prod) => prod._id === p._id);
        return product?.tags?.includes(filter.value);
      });
    }
  });

  // Apply sorting
  if (sortOption === "price_asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price_desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === "popularity") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }
  // newest is default (already sorted by createdAt from backend)

  /* =======================
     Render
  ======================= */
  return (
    <>
      <TopInfo />
      <Navbar />

      <ProductListBanner categorySlug={categorySlug || undefined} />

      <div className="container mx-auto px-4 pb-20 mt-8">
        <ProductFilterBar
          filtersOpen={filtersOpen}
          toggleFilters={() => setFiltersOpen(!filtersOpen)}
          sortByOpen={sortByOpen}
          toggleSortBy={() => setSortByOpen(!sortByOpen)}
          activeFilters={activeFilters}
          removeFilter={removeFilter}
          clearFilters={clearFilters}
          viewMode={viewMode}
          setViewMode={(mode) => setViewMode(mode)}
          filterOptions={filterOptions}
          totalProducts={filteredProducts.length}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          currentSort={sortOption}
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#bd9951] rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex justify-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex justify-center py-20">
            <p className="text-gray-500">
              {activeFilters.length > 0
                ? "No products match your filters. Try adjusting your selection."
                : "No products found."}
            </p>
          </div>
        ) : (
          <ProductGrid
            products={filteredProducts}
            viewMode={viewMode}
            onToggleWishlist={toggleProductInWishlist}
            onQuickView={handleQuickView}
          />
        )}
      </div>

      <Footer />

      <FilterSortMobile
        onFilterClick={() => setFiltersOpen(true)}
        onSortClick={() => setMobileSortOpen(true)}
        activeFilterCount={activeFilters.length}
      />

      <MobileSortSheet
        isOpen={mobileSortOpen}
        onClose={() => setMobileSortOpen(false)}
        onSelect={handleMobileSort}
        currentSort={sortOption}
      />

      {selectedProductSlug && (
        <QuickView
          productSlug={selectedProductSlug}
          onClose={() => setSelectedProductSlug(null)}
        />
      )}
    </>
  );
};

/* =======================
   Suspense Wrapper
======================= */
const ProductList = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#bd9951] rounded-full animate-spin" />
        </div>
      }
    >
      <ProductListContent />
    </Suspense>
  );
};

export default ProductList;
