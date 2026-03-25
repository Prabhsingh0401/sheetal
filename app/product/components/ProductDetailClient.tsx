// app/product/[id]/ProductDetailClient.tsx
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TopInfo from "../../components/TopInfo";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import WishlistLoginModal from "../../components/WishlistLoginModal";
import StorefrontLoadingShell from "../../components/StorefrontLoadingShell";
import Breadcrumb from "../components/Breadcrumb";
import ProductImageGallery from "./ProductImageGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import ProductReviews, { Review } from "./ProductReviews";
import RelatedProducts from "./RelatedProducts";
import EnquireModal from "./EnquireModal";
import SizeChartModal from "./SizeChartModal";
import {
  fetchProductBySlug,
  fetchProducts,
  Product,
  getProductImageUrl,
  getVariantGalleryUrls,
  ProductVariant,
  incrementProductView,
  fetchProductReviews,
} from "../../services/productService";
import { fetchSizeChart, SizeChartData } from "../../services/sizeChartService";
import { getApiImageUrl } from "../../services/api";
import { isAuthenticated } from "../../services/authService";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";
import { redirectToLogin } from "../../utils/authRedirect";
import toast from "react-hot-toast";

interface ColorOption {
  name: string;
  image: string;
}

interface SizeOption {
  name: string;
  available: boolean;
  left: number;
}

interface ProductInfoData {
  title: string;
  rating: number;
  productCode: string;
  mainDescription: string;
  price?: number;
  originalPrice?: number;
  discount?: string;
  selectedPrice: number;
  selectedOriginalPrice: number;
  selectedDiscount: string;
  description: string;
  colors: ColorOption[];
  allSizes: SizeOption[];
  colorToAvailableSizesMap: { [key: string]: string[] };
  specifications: { key: string; value: string }[];
}

interface RelatedProduct {
  id: string;
  name: string;
  image: string;
  hoverImage: string;
  price: number;
  mrp: number;
  discount: string;
  soldOut: boolean;
}

const ProductDetailClient = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedVariantData, setSelectedVariantData] =
    useState<ProductVariant | null>(null);
  const [selectedSizeObject, setSelectedSizeObject] = useState<
    ProductVariant["sizes"][number] | null
  >(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [enquireModalOpen, setEnquireModalOpen] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [sizeChartData, setSizeChartData] = useState<SizeChartData | null>(
    null,
  );
  const [pincode, setPincode] = useState("");
  const [pincodeMessage, setPincodeCheckMessage] = useState("");
  const {
    isProductInWishlist,
    toggleProductInWishlist,
    isLoginModalOpen,
    closeLoginModal,
    handleLoginRedirect,
  } = useWishlist();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await fetchProductBySlug(slug);
        if (res.success && res.data) {
          setProduct(res.data);

          // Default size logic: find first available size
          const firstAvailableVariant = res.data.variants?.find(
            (v: ProductVariant) =>
              Array.isArray(v.sizes) &&
              v.sizes.length > 0 &&
              v.sizes.some((s) => s.stock > 0),
          );

          if (firstAvailableVariant) {
            setSelectedVariantData(firstAvailableVariant);
            if (firstAvailableVariant.color?.name) {
              setSelectedColor(firstAvailableVariant.color.name);
            }
            const initialGallery = getVariantGalleryUrls(
              res.data,
              firstAvailableVariant,
            );
            setSelectedImage(initialGallery[0] || getProductImageUrl(res.data));
            const firstAvailableSize = firstAvailableVariant.sizes.find(
              (s: {
                name: string;
                stock: number;
                price: number;
                discountPrice: number;
              }) => s.stock > 0,
            );
            if (firstAvailableSize) {
              setSelectedSize(firstAvailableSize.name);
              setSelectedSizeObject(firstAvailableSize);
            }
          } else {
            const mainImg = getProductImageUrl(res.data);
            setSelectedImage(mainImg);
          }

          // ── Similar Products: always scoped to same category ──────────
          const productFabrics: string[] = (res.data.fabric ?? [])
            .map((f: string) => f?.trim().toLowerCase())
            .filter(Boolean);

          // Derive min effective price across all variants/sizes
          let currentMinPrice = 0;
          res.data.variants?.forEach((v: ProductVariant) => {
            v.sizes?.forEach((s) => {
              const effective = s.discountPrice > 0 ? s.discountPrice : s.price;
              if (
                effective > 0 &&
                (currentMinPrice === 0 || effective < currentMinPrice)
              ) {
                currentMinPrice = effective;
              }
            });
          });

          const selfId = res.data._id;
          const categoryId = res.data.category?._id;

          const [tier1Res, tier2Res, tier3Res] = await Promise.allSettled([
            // Tier 1: same category + same fabric + price ±₹2000
            categoryId && productFabrics.length > 0 && currentMinPrice > 0
              ? fetchProducts({
                  category: categoryId,
                  fabric: productFabrics[0],
                  minPrice: Math.max(0, currentMinPrice - 2000),
                  maxPrice: currentMinPrice + 2000,
                  limit: 10,
                  status: "Active",
                })
              : Promise.resolve(null),

            // Tier 2: same category + price ±₹2000 (no fabric restriction)
            categoryId && currentMinPrice > 0
              ? fetchProducts({
                  category: categoryId,
                  minPrice: Math.max(0, currentMinPrice - 2000),
                  maxPrice: currentMinPrice + 2000,
                  limit: 10,
                  status: "Active",
                })
              : Promise.resolve(null),

            // Tier 3: same category + price ±₹2000 (broadest — no fabric)
            categoryId && currentMinPrice > 0
              ? fetchProducts({
                  category: categoryId,
                  minPrice: Math.max(0, currentMinPrice - 2000),
                  maxPrice: currentMinPrice + 2000,
                  limit: 15,
                  status: "Active",
                })
              : Promise.resolve(null),
          ]);

          const seen = new Set<string>();
          const allFetched: Product[] = [];

          for (const result of [tier1Res, tier2Res]) {
            if (result.status === "fulfilled" && result.value?.success) {
              for (const p of result.value.products ?? []) {
                if (p._id !== selfId && !seen.has(p._id)) {
                  seen.add(p._id);
                  allFetched.push(p);
                }
              }
            }
          }

          setSimilarProducts(allFetched);

          // ─────────────────────────────────────────────────────────────

          // ── Persist to recently-viewed ────────────────────────────────
          try {
            const RV_KEY = "__rv__";
            const minPrice = (() => {
              let p = 0;
              res.data.variants?.forEach((v: ProductVariant) => {
                v.sizes?.forEach(
                  (s: { price: number; discountPrice: number }) => {
                    const eff = s.discountPrice > 0 ? s.discountPrice : s.price;
                    if (eff > 0 && (p === 0 || eff < p)) p = eff;
                  },
                );
              });
              return p;
            })();
            const entry = {
              id: res.data.slug,
              name: res.data.name,
              image: getProductImageUrl(res.data),
              hoverImage: res.data.hoverImage?.url
                ? getApiImageUrl(res.data.hoverImage.url)
                : getProductImageUrl(res.data),
              price: minPrice,
              mrp: minPrice,
              discount: "0%",
              soldOut: res.data.stock <= 0,
            };
            const prev = JSON.parse(
              localStorage.getItem(RV_KEY) || "[]",
            ) as (typeof entry)[];
            const deduped = [
              entry,
              ...prev.filter((p) => p.id !== entry.id),
            ].slice(0, 12);
            localStorage.setItem(RV_KEY, JSON.stringify(deduped));
          } catch {
            // localStorage unavailable — safe to ignore
          }

          // Increment View Count
          incrementProductView(slug).catch(console.error);

          // Fetch Reviews
          fetchProductReviews(res.data._id)
            .then((revRes) => {
              if (revRes.success) setReviews(revRes.data);
            })
            .catch(console.error);
        } else {
          setError("Product not found");
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  // Fetch Size Chart data
  useEffect(() => {
    const loadSizeChart = async () => {
      try {
        const res = await fetchSizeChart();
        if (res.success && res.data && Object.keys(res.data).length > 0) {
          setSizeChartData(res.data);
        } else {
          console.error("Failed to load size chart:", res);
        }
      } catch (e) {
        console.error("Error fetching size chart:", e);
      }
    };
    loadSizeChart();
  }, []);

  const handleImageChange = (img: string) => {
    setSelectedImage(img);
  };

  const checkPincode = () => {
    if (pincode.length === 6) {
      setPincodeCheckMessage("Delivery by Tue, Jan 06");
    } else {
      setPincodeCheckMessage("Please enter a valid 6-digit pincode");
    }
  };

  const handleAddToCart = async () => {
    if (!product || !selectedSize || !selectedColor) {
      toast.error("Please select a size to add to cart.");
      return;
    }

    const selectedVariant = product.variants.find(
      (variant: ProductVariant) => variant.color?.name === selectedColor,
    );
    const selectedSizeInfo = selectedVariant?.sizes.find(
      (size) => size.name === selectedSize,
    );

    if (!selectedVariant || !selectedSizeInfo) {
      toast.error("Selected variant not available.");
      return;
    }

    const variantImageUrl = getApiImageUrl(
      selectedVariant.v_image,
      product.mainImage?.url || "/assets/placeholder-product.jpg",
    );

    await addToCart(
      product._id,
      selectedVariant._id,
      quantity,
      selectedSize,
      selectedSizeInfo.price || 0,
      selectedSizeInfo.discountPrice || 0,
      variantImageUrl,
      selectedColor,
      {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        mainImage: product.mainImage,
      },
    );
  };

  const handleBuyNow = () => {
    if (!product) {
      toast.error("Product not available");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    const selectedVariant = product.variants.find(
      (v: ProductVariant) => v.color?.name === selectedColor,
    );
    const selectedSizeInfo = selectedVariant?.sizes.find(
      (size) => size.name === selectedSize,
    );

    if (!selectedVariant || !selectedSizeInfo) {
      toast.error("Selected variant not available");
      return;
    }

    const resolvedQuantity = Math.max(1, Number(quantity) || 1);
    const variantImageUrl = getApiImageUrl(
      selectedVariant.v_image,
      product.mainImage?.url || "/assets/placeholder-product.jpg",
    );

    const buyNowItem = {
      product: {
        _id: product._id,
        name: product.name,
        mainImage: product.mainImage,
        sku: product.sku,
        category: product.category,
      },
      size: selectedSize,
      color: selectedColor,
      quantity: resolvedQuantity,
      price: selectedSizeInfo.price || 0,
      discountPrice:
        selectedSizeInfo.discountPrice || selectedSizeInfo.price || 0,
      variantImage: variantImageUrl,
    };

    const encoded = encodeURIComponent(JSON.stringify(buyNowItem));
    const checkoutUrl = `/checkout/address?buynow=${encoded}`;

    if (!isAuthenticated()) {
      redirectToLogin(router, checkoutUrl);
      return;
    }

    router.push(checkoutUrl);
  };

  const scrollToSimilarProducts = useCallback(() => {
    document
      .getElementById("similar-products-section")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (loading || searchParams.get("scroll") !== "similar") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      scrollToSimilarProducts();
    }, 100);

    return () => window.clearTimeout(timeoutId);
  }, [loading, searchParams, scrollToSimilarProducts]);

  const galleryImages = useMemo(
    () => getVariantGalleryUrls(product, selectedVariantData),
    [product, selectedVariantData],
  );

  useEffect(() => {
    if (!galleryImages.length) return;
    if (!selectedImage || !galleryImages.includes(selectedImage)) {
      setSelectedImage(galleryImages[0]);
    }
  }, [galleryImages, selectedImage]);

  if (loading)
    return <StorefrontLoadingShell message="Loading product..." />;
  if (!product)
    return <StorefrontLoadingShell message={error || "Product not found"} />;

  // Derive all unique colors, all unique sizes, and a map of color to available sizes
  const allUniqueColors: ColorOption[] = [];
  const allUniqueSizeNames = new Set<string>();
  const colorToAvailableSizesMap = new Map<string, Set<string>>();

  // To store overall stock for each size for `allUniqueSizes`
  const sizeOverallStockMap = new Map<
    string,
    { totalStock: number }
  >();

  product.variants?.forEach((v: ProductVariant) => {
    // Collect unique colors
    if (
      v.color &&
      typeof v.color === "object" &&
      v.color.name &&
      !allUniqueColors.some((c) => c.name === v.color!.name)
    ) {
      allUniqueColors.push({
        name: v.color.name,
        image: getApiImageUrl(
          v.v_image,
          product.mainImage?.url || "/assets/placeholder-product.jpg",
        ),
      });
    }

    if (Array.isArray(v.sizes)) {
      v.sizes?.forEach((s: { name: string; stock: number }) => {
        if (s?.name) {
          allUniqueSizeNames.add(s.name);

          const currentStock = sizeOverallStockMap.get(s.name) || {
            totalStock: 0,
          };
          currentStock.totalStock += s.stock || 0;
          sizeOverallStockMap.set(s.name, currentStock);

          // Populate colorToAvailableSizesMap
          if (
            v.color &&
            typeof v.color === "object" &&
            v.color.name &&
            s.stock > 0
          ) {
            if (!colorToAvailableSizesMap.has(v.color.name)) {
              colorToAvailableSizesMap.set(v.color.name, new Set<string>());
            }
            colorToAvailableSizesMap.get(v.color.name)?.add(s.name);
          }
        }
      });
    }
  });

  const allSizesForDisplay: SizeOption[] = Array.from(allUniqueSizeNames).map(
    (sizeName) => {
      const stockInfo = sizeOverallStockMap.get(sizeName);
      return {
        name: sizeName,
        available: stockInfo ? stockInfo.totalStock > 0 : false,
        left: stockInfo ? stockInfo.totalStock : 0,
      };
    },
  );

  const handleColorChange = (color: ColorOption) => {
    setSelectedColor(color.name);

    const newlySelectedVariant =
      product?.variants.find((v) => v.color?.name === color.name) || null;
    setSelectedVariantData(newlySelectedVariant);
    const nextGallery = getVariantGalleryUrls(product, newlySelectedVariant);
    setSelectedImage(nextGallery[0] || color.image);

    const availableSizesForNewColor = colorToAvailableSizesMap.get(color.name);
    if (
      selectedSize &&
      availableSizesForNewColor &&
      !availableSizesForNewColor.has(selectedSize)
    ) {
      setSelectedSize("");
      setSelectedSizeObject(null);
    }
    if (
      !selectedSize &&
      availableSizesForNewColor &&
      availableSizesForNewColor.size > 0
    ) {
      const autoSelectedSizeName = Array.from(availableSizesForNewColor)[0];
      setSelectedSize(autoSelectedSizeName);
      if (newlySelectedVariant) {
        const autoSelectedSizeObject = newlySelectedVariant.sizes.find(
          (s) => s.name === autoSelectedSizeName,
        );
        setSelectedSizeObject(autoSelectedSizeObject || null);
      }
    } else if (selectedSize && newlySelectedVariant) {
      const currentSelectedSizeObject = newlySelectedVariant.sizes.find(
        (s) => s.name === selectedSize,
      );
      setSelectedSizeObject(currentSelectedSizeObject || null);
    }
  };

  const handleSizeChange = (sizeName: string) => {
    setSelectedSize(sizeName);
    if (selectedVariantData) {
      const foundSize = selectedVariantData.sizes.find(
        (s) => s.name === sizeName,
      );
      setSelectedSizeObject(foundSize || null);
    }
  };

  // Transformed Product Object for ProductInfo
  const fallbackSize = product.variants?.[0]?.sizes?.[0];
  const resolvedSize = selectedSizeObject ?? fallbackSize;

  const currentSelectedPrice =
    resolvedSize?.discountPrice > 0
      ? resolvedSize.discountPrice
      : resolvedSize?.price || 0;
  const currentSelectedOriginalPrice = resolvedSize?.price || 0;
  const currentSelectedDiscount =
    currentSelectedOriginalPrice > 0 &&
    currentSelectedPrice < currentSelectedOriginalPrice
      ? `${Math.round(((currentSelectedOriginalPrice - currentSelectedPrice) / currentSelectedOriginalPrice) * 100)}`
      : "0";

  const productInfoData: ProductInfoData = {
    title: product.name,
    productCode: product.sku,
    rating: product.averageRating || 0,
    mainDescription: product.shortDescription || "",
    selectedPrice: currentSelectedPrice,
    selectedOriginalPrice: currentSelectedOriginalPrice,
    selectedDiscount: currentSelectedDiscount,
    description: product.description,
    colors: allUniqueColors,
    allSizes: allSizesForDisplay,
    colorToAvailableSizesMap: Object.fromEntries(
      Array.from(colorToAvailableSizesMap.entries()).map(
        ([color, sizesSet]) => [color, Array.from(sizesSet)],
      ),
    ),
    specifications: product.specifications || [],
  };

  // ── Related Products: map + score-sort ───────────────────────────────
  const getMinPrice = (p: Product): number => {
    let min = Infinity;
    p.variants.forEach((v) => {
      v.sizes.forEach((s) => {
        const eff = s.discountPrice > 0 ? s.discountPrice : s.price;
        if (eff > 0 && eff < min) min = eff;
      });
    });
    return min === Infinity ? 0 : min;
  };

  const currentMinPrice = getMinPrice(product);
  const productFabricSet = new Set(
    (product.fabric ?? []).map((f: string) => f.trim().toLowerCase()),
  );

  const relatedProductsData: RelatedProduct[] = similarProducts
    .map((p: Product) => {
      let minPrice: number = Infinity;
      let minMRP: number = Infinity;

      p.variants.forEach((variant) => {
        variant.sizes.forEach((size) => {
          if (size.price < minMRP) minMRP = size.price;
          if (size.discountPrice > 0 && size.discountPrice < minPrice) {
            minPrice = size.discountPrice;
          } else if (size.discountPrice === 0 && size.price < minPrice) {
            minPrice = size.price;
          }
        });
      });

      if (minPrice === Infinity) minPrice = 0;
      if (minMRP === Infinity) minMRP = 0;

      const currentDiscount =
        minMRP > 0 && minPrice < minMRP
          ? `${Math.round(((minMRP - minPrice) / minMRP) * 100)}%`
          : "0%";

      return {
        id: p.slug,
        productId: p._id,
        name: p.name,
        image: getProductImageUrl(p),
        hoverImage: p.hoverImage?.url
          ? getApiImageUrl(p.hoverImage.url)
          : getProductImageUrl(p),
        price: minPrice,
        mrp: minMRP,
        discount: currentDiscount,
        soldOut: p.stock <= 0,
        _sameCategory: p.category?._id === product.category?._id,
        _sameFabric: (p.fabric ?? []).some((f: string) =>
          productFabricSet.has(f.trim().toLowerCase()),
        ),
      };
    })
    .sort((a, b) => {
      const score = (x: typeof a) =>
        (x._sameCategory ? 4 : 0) + (x._sameFabric ? 2 : 0);
      return score(b) - score(a);
    })
    .map(({ _sameCategory, _sameFabric, ...rest }) => rest);
  // ─────────────────────────────────────────────────────────────────────

  return (
    <div className="font-[family-name:var(--font-montserrat)] bg-[#f9f9f9]">
      <TopInfo />
      <Navbar />

      <Breadcrumb
        title={product.name}
        categoryName={product.category?.name}
        categorySlug={product.category?.slug}
      />

      <div className="container mx-auto md:px-8 px-4">
        {/* Mobile Title */}
        <div className="lg:hidden mb-4 mt-2">
          <h1 className="text-2xl font-medium text-[#683e14] mb-2 font-[family-name:var(--font-optima)]">
            {product.name}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row md:gap-13">
          <div className="lg:w-7/12">
            <ProductImageGallery
              images={galleryImages}
              selectedImage={selectedImage || galleryImages[0]}
              onImageChange={handleImageChange}
              title={product.name}
              isWishlisted={isProductInWishlist(product._id)}
              onToggleWishlist={() => toggleProductInWishlist(product._id)}
              onScrollToSimilar={scrollToSimilarProducts}
              videoUrl={
                selectedVariantData?.v_video?.url
                  ? getApiImageUrl(selectedVariantData.v_video.url)
                  : product.video?.url
                    ? getApiImageUrl(product.video.url)
                    : undefined
              }
              videoMimeType={
                selectedVariantData?.v_video?.mimeType || product.video?.mimeType
              }
            />
          </div>

          <div className="lg:w-5/12">
            <ProductInfo
              product={productInfoData}
              selectedSize={selectedSize}
              setSelectedSize={handleSizeChange}
              selectedColor={selectedColor}
              onColorChange={handleColorChange}
              quantity={quantity}
              setQuantity={setQuantity}
              onEnquire={() => setEnquireModalOpen(true)}
              onSizeChartOpen={() => setSizeChartOpen(true)}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              pincode={pincode}
              setPincode={setPincode}
              pincodeMessage={pincodeMessage}
              checkPincode={checkPincode}
              isOutOfStock={product.stock <= 0}
              selectedVariantData={selectedVariantData}
            />
          </div>
        </div>
      </div>

      <ProductTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        description={product.description}
        materialCare={product.materialCare || "N/A"}
      />

      <ProductReviews
        productId={product._id}
        initialReviews={reviews}
        overallRating={product.averageRating || 0}
        totalReviews={product.totalReviews || 0}
      />
      <RelatedProducts
        similarProducts={relatedProductsData}
        isProductInWishlist={isProductInWishlist}
        onToggleWishlist={toggleProductInWishlist}
        currentSlug={slug}
      />

      <Footer />

      <EnquireModal
        isOpen={enquireModalOpen}
        onClose={() => setEnquireModalOpen(false)}
        productTitle={product.name}
        sizes={productInfoData.allSizes}
      />

      <SizeChartModal
        isOpen={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        selectedColor={selectedColor}
        colorToAvailableSizesMap={productInfoData.colorToAvailableSizesMap}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        sizeChartData={sizeChartData}
        onAddToCart={handleAddToCart}
        onAddToWishlist={() => toggleProductInWishlist(product._id)}
        isWishlisted={isProductInWishlist(product._id)}
      />

      <WishlistLoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onLogin={handleLoginRedirect}
      />
    </div>
  );
};

export default ProductDetailClient;
