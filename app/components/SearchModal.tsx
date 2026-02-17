"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { searchService } from "@/app/services/searchService";
import {
  fetchProducts,
  Product,
  getProductImageUrl,
} from "../services/productService";
import { fetchAllCategories, Category } from "../services/categoryService";
import Image from "next/image";

const PREVIOUS_SEARCHES_KEY = "previous_searches";
const MAX_PREVIOUS_SEARCHES = 5;

interface PreviousSearchItem {
  type: "product" | "category";
  name: string;
  slug?: string;
  categoryName?: string;
}

// Helper functions for local storage
const getPreviousSearches = (): PreviousSearchItem[] => {
  if (typeof window === "undefined") return [];
  const searches = localStorage.getItem(PREVIOUS_SEARCHES_KEY);
  return searches ? JSON.parse(searches) : [];
};

const addClickedItem = (item: PreviousSearchItem) => {
  if (typeof window === "undefined") return;
  const items = getPreviousSearches();

  let identifier: string;
  if (item.type === "product") {
    identifier = `product-${item.slug}`;
  } else {
    identifier = `category-${item.categoryName}`;
  }

  const updatedItems = [
    item,
    ...items.filter((existingItem) => {
      let existingIdentifier: string;
      if (existingItem.type === "product") {
        existingIdentifier = `product-${existingItem.slug}`;
      } else {
        existingIdentifier = `category-${existingItem.categoryName}`;
      }
      return existingIdentifier !== identifier;
    }),
  ].slice(0, MAX_PREVIOUS_SEARCHES);
  localStorage.setItem(PREVIOUS_SEARCHES_KEY, JSON.stringify(updatedItems));
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previousSearches, setPreviousSearches] = useState<
    PreviousSearchItem[]
  >([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [trendingCategories, setTrendingCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (isOpen) {
      setPreviousSearches(getPreviousSearches());

      // Fetch Trending Data
      if (trendingProducts.length === 0) {
        Promise.all([
          fetchProducts({ sort: "-viewCount", limit: 4, status: "Active" }),
          fetchAllCategories(),
        ])
          .then(([prodRes, cats]) => {
            if (prodRes.success && prodRes.products) {
              setTrendingProducts(prodRes.products);
            }
            if (cats) {
              // Filter out subcategories or hidden
              const topCats = cats.filter((c) => !c.parentCategory).slice(0, 8);
              setTrendingCategories(topCats);
            }
          })
          .catch((err) =>
            console.error("Failed to load trending suggestions", err),
          );
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 2) {
      const debounce = setTimeout(() => {
        setIsLoading(true);
        searchService(query)
          .then((res) => setResults(res.results))
          .catch((err) => console.error(err))
          .finally(() => setIsLoading(false));
      }, 500);
      return () => clearTimeout(debounce);
    } else {
      setResults([]);
    }
  }, [query]);

  // Handler
  const handlePreviousSearchClick = (item: PreviousSearchItem) => {
    onClose();
  };

  // Helper
  const getImageUrl = (item: any) => {
    // For Product
    if (item.mainImage) {
      return item.mainImage.url || "/assets/default-image.png";
    }
    // For Category
    if (item.image) return item.image.url || "/assets/default-image.png";
    // Fallback if data structure varies
    if (item.data?.mainImage?.url) return item.data.mainImage.url;
    if (item.data?.image?.url) return item.data.image.url;

    return "/assets/default-image.png";
  };

  const matchedCategories = results.filter((r) => r.type === "category");
  const matchedProducts = results.filter((r) => r.type === "product");

  // Helper to compute/display price
  const getPriceDisplay = (product: any) => {
    let minPrice = Infinity;
    let relatedMrp = 0;
    let discount = 0;

    // SCENARIO 1: Data from Algolia (already computed)
    if (product.minPrice !== undefined) {
      minPrice = product.minPrice;
      relatedMrp = product.mrp || 0;
      discount = product.discount || 0;
    }
    // SCENARIO 2: Data from MongoDB Fallback (compute manually)
    else if (product.variants && product.variants.length > 0) {
      product.variants.forEach((v: any) => {
        v.sizes?.forEach((s: any) => {
          const effective = (s.discountPrice && s.discountPrice > 0) ? s.discountPrice : s.price;
          if (effective < minPrice) {
            minPrice = effective;
            relatedMrp = s.price;
          }
        });
      });
      if (minPrice !== Infinity && relatedMrp > minPrice) {
        discount = Math.round(((relatedMrp - minPrice) / relatedMrp) * 100);
      }
    }

    if (minPrice === Infinity || minPrice === 0) return null;

    return (
      <div className="flex items-center gap-2 mt-1 flex-wrap">
        <span className="font-bold text-gray-900 text-sm">₹{minPrice}</span>
        {relatedMrp > minPrice && (
          <>
            <span className="line-through text-xs text-gray-400">₹{relatedMrp}</span>
            <span className="text-xs text-[#B78D65] font-semibold">{discount}% OFF</span>
          </>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-md flex justify-center items-start pt-10 font-[family-name:var(--font-montserrat)] transition-all duration-300">
      <div
        className="w-full max-w-4xl mx-4 bg-[#f4fcf4] rounded-xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col relative border border-[#e0e8e0]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl z-10 transition-colors"
        >
          ✕
        </button>

        {/* Header / Search Bar */}
        <div className="p-8 pb-2 shrink-0">
          <div className="relative">
            <input
              type="text"
              className="w-full py-3 px-12 text-lg rounded-full border border-gray-400 bg-white text-gray-800 focus:outline-none focus:border-[#082722] shadow-inner placeholder-gray-500 transition-all"
              placeholder="I'm Looking for..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            {isLoading && (
              <div className="absolute right-5 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-[#082722] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Autofill Suggestions Dropdown */}
            {query.length > 2 && results.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-xl border border-t-0 border-gray-200 z-50 overflow-hidden">
                {results.slice(0, 5).map((item, index) => (
                  <Link
                    key={index}
                    href={
                      item.type === "category"
                        ? `/${item.data.slug}`
                        : `/product/${item.data.slug}`
                    }
                    onClick={() => {
                      addClickedItem(
                        item.type === "category"
                          ? {
                            type: "category",
                            name: item.data.name,
                            categoryName: item.data.name,
                          }
                          : {
                            type: "product",
                            name: item.data.name,
                            slug: item.data.slug,
                          },
                      );
                      onClose();
                    }}
                    className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#082722] transition-colors border-b last:border-0 border-gray-100"
                  >
                    <span className="font-medium">{item.data.name}</span>
                    <span className="text-xs text-gray-400 ml-2 capitalize">
                      in {item.type}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          {/* Search History */}
          {!isLoading && previousSearches.length > 0 && (
            <div className="mb-6 border-b border-gray-200 pb-4 mt-4">
              <div className="flex justify-between items-baseline mb-3">
                <h4 className="text-base font-semibold text-gray-800">
                  Search History:
                </h4>
                <span className="text-xs text-gray-500 italic hidden sm:inline">
                  you searched below keywords in the last session
                </span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {previousSearches.map((item, i) => (
                  <Link
                    key={i}
                    href={
                      item.type === "product"
                        ? `/product/${item.slug}`
                        : `/product-list?category=${encodeURIComponent(item.categoryName || "")}`
                    }
                    onClick={() => {
                      handlePreviousSearchClick(item);
                      onClose(); // Ensure close
                    }}
                    className="text-[#8c7e4e] hover:text-[#082722] underline decoration-transparent hover:decoration-[#082722] transition-all text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Logic for Empty Query vs Results */}
          {query.length <= 2 ? (
            <>
              {/* Suggestions / Popular Categories */}
              <div className="mb-6 border-b border-gray-200 pb-4">
                <div className="flex justify-between items-baseline mb-3">
                  <h4 className="text-base font-semibold text-gray-800">
                    Suggestions:
                  </h4>
                  <span className="text-xs text-gray-500 italic hidden sm:inline">
                    10,000+ of the products are in our store
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {trendingCategories.map((cat, i) => (
                    <Link
                      key={i}
                      href={`/${cat.slug}`}
                      onClick={onClose}
                      className="text-[#8c7e4e] hover:text-[#082722] underline decoration-transparent hover:decoration-[#082722] transition-all text-sm font-medium"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trending Products */}
              <div>
                <h4 className="text-base font-semibold text-gray-800 mb-4">
                  Trending Products:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {trendingProducts.map((product) => (
                    <Link
                      key={product._id}
                      href={`/product/${product.slug}`}
                      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
                      onClick={() => {
                        addClickedItem({
                          type: "product",
                          name: product.name,
                          slug: product.slug,
                        });
                        onClose();
                      }}
                    >
                      <div className="relative aspect-[3/4] bg-gray-100">
                        <Image
                          src={getProductImageUrl(product)}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-3">
                        <h5 className="text-sm text-gray-800 font-medium group-hover:text-[#b3a660] transition-colors line-clamp-2">
                          {product.name}
                        </h5>
                        {/* Use Helper to Display Computed Price */}
                        {getPriceDisplay(product)}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Matched Categories (Suggestions) */}
              {matchedCategories.length > 0 && (
                <div className="mb-6 border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-baseline mb-3">
                    <h4 className="text-base font-semibold text-gray-800">
                      Suggestions:
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {matchedCategories.map((item, i) => (
                      <Link
                        key={i}
                        href={`/${item.data.slug}`}
                        onClick={() => {
                          addClickedItem({
                            type: "category",
                            name: item.data.name,
                            categoryName: item.data.name,
                          });
                          onClose();
                        }}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                      >
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-200 shrink-0">
                          <Image
                            src={getImageUrl(item)}
                            alt={item.data.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-[#8c7e4e] hover:text-[#082722] text-sm font-medium capitalize">
                          {item.data.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Products */}
              {matchedProducts.length > 0 ? (
                <div>
                  <h4 className="text-base font-semibold text-gray-800 mb-4">
                    Products for "{query}":
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {matchedProducts.map((item) => (
                      <Link
                        key={item.data._id}
                        href={`/product/${item.data.slug}`}
                        className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
                        onClick={() => {
                          addClickedItem({
                            type: "product",
                            name: item.data.name,
                            slug: item.data.slug,
                          });
                          onClose();
                        }}
                      >
                        <div className="relative aspect-[3/4] bg-gray-100">
                          <Image
                            src={getImageUrl(item)} // Uses helper
                            alt={item.data.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-3">
                          <h5 className="text-sm text-gray-800 font-medium group-hover:text-[#b3a660] transition-colors line-clamp-2">
                            {item.data.name}
                          </h5>
                          {/* Use Helper to Display Computed Price */}
                          {getPriceDisplay(item.data)}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                !isLoading &&
                matchedCategories.length === 0 && (
                  <p className="text-gray-500 text-center py-10 italic">
                    No products found for "{query}".
                  </p>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
