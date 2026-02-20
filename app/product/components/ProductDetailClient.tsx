// app/product/[id]/ProductDetailClient.tsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import TopInfo from "../../components/TopInfo";
import Footer from "../../components/Footer";
import NavbarInner from "../../components/NavbarInner";
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
  ProductVariant,
  incrementProductView,
  fetchProductReviews,
} from "../../services/productService";
import { fetchSizeChart, SizeChartData } from "../../services/sizeChartService";
import { getApiImageUrl } from "../../services/api";
import { useWishlist } from "../../hooks/useWishlist";
import Cookies from "js-cookie";
import { useCart } from "../../hooks/useCart";
import toast from "react-hot-toast"; // Added toast import

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
  mainDescription: string;
  price?: number; // Made optional
  originalPrice?: number; // Made optional
  discount?: string; // Made optional
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
  const [selectedSizeObject, setSelectedSizeObject] = useState<any | null>(
    null,
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [enquireModalOpen, setEnquireModalOpen] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [sizeChartData, setSizeChartData] = useState<SizeChartData | null>(
    null,
  ); // New state for size chart
  const [pincode, setPincode] = useState("");
  const [pincodeMessage, setPincodeCheckMessage] = useState("");
  const { isProductInWishlist, toggleProductInWishlist } = useWishlist();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await fetchProductBySlug(slug);
        if (res.success && res.data) {
          setProduct(res.data);

          // Set initial image
          const mainImg = getProductImageUrl(res.data);
          setSelectedImage(mainImg);

          // Default size logic: find first available size
          const firstAvailableVariant = res.data.variants?.find(
            (v: ProductVariant) =>
              Array.isArray(v.sizes) &&
              v.sizes.length > 0 &&
              v.sizes.some((s) => s.stock > 0),
          );

          if (firstAvailableVariant) {
            setSelectedVariantData(firstAvailableVariant); // Set selected variant data
            if (firstAvailableVariant.color?.name) {
              setSelectedColor(firstAvailableVariant.color.name);
            }
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
              setSelectedSizeObject(firstAvailableSize); // Set selected size object
            }
          }

          // Fetch Similar Products
          if (res.data.category && res.data.category._id) {
            fetchProducts({ category: res.data.category._id, limit: 6 })
              .then((simRes) => {
                if (simRes.success) {
                  const filtered = simRes.products.filter(
                    (p: Product) => p._id !== res.data._id,
                  );
                  setSimilarProducts(filtered);
                }
              })
              .catch(console.error);
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
  }, []); // Empty dependency array means it runs once on mount

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

  const checkLoginStatus = () => {
    const token = Cookies.get("token");
    return !!token;
  };

  const handleAddToCart = async () => {
    if (!checkLoginStatus()) {
      sessionStorage.setItem("redirect", `/product/${slug}`);
      router.push(`/login`);
      return;
    }

    if (product && selectedVariantData && selectedSizeObject) {
      const selectedVariant = product.variants.find(
        (variant: ProductVariant) => variant.color?.name === selectedColor,
      );
      if (selectedVariant) {
        const price = selectedSizeObject.price || 0;
        const discountPrice = selectedSizeObject.discountPrice || 0;
        const variantImageUrl = getApiImageUrl(
          selectedVariant.v_image,
          product.mainImage?.url || "/assets/placeholder-product.jpg",
        );
        await addToCart(
          product._id,
          selectedVariant._id,
          quantity,
          selectedSize,
          price,
          discountPrice,
          selectedColor,
          variantImageUrl,
        );
      } else {
        console.error("Selected variant not found");
      }
    } else {
      toast.error("Please select a size to add to cart.");
    }
  };

  const scrollToSimilarProducts = useCallback(() => {
    document
      .getElementById("similar-products-section")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-[#bd9951] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex justify-center items-center text-xl text-red-500">
        {error || "Product not found"}
      </div>
    );

  // Transform Data for View
  const galleryImages = [
    getProductImageUrl(product),
    ...(product.images?.map((img) => getApiImageUrl(img.url)) || []),
  ].filter(Boolean);

  // Derive all unique colors, all unique sizes, and a map of color to available sizes
  const allUniqueColors: ColorOption[] = [];
  const allUniqueSizeNames = new Set<string>();
  const colorToAvailableSizesMap = new Map<string, Set<string>>();

  // To store overall stock for each size for `allUniqueSizes`
  const sizeOverallStockMap = new Map<
    string,
    { totalStock: number; minLeft: number }
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
            minLeft: Infinity,
          };
          currentStock.totalStock += s.stock || 0;
          currentStock.minLeft = Math.min(currentStock.minLeft, s.stock || 0);
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
        left: stockInfo ? stockInfo.minLeft : 0,
      };
    },
  );

  const handleColorChange = (color: ColorOption) => {
    setSelectedColor(color.name);
    setSelectedImage(color.image);

    // Find the newly selected variant
    const newlySelectedVariant =
      product?.variants.find((v) => v.color?.name === color.name) || null;
    setSelectedVariantData(newlySelectedVariant);

    // Check if previously selected size is available for the new color
    const availableSizesForNewColor = colorToAvailableSizesMap.get(color.name);
    if (
      selectedSize &&
      availableSizesForNewColor &&
      !availableSizesForNewColor.has(selectedSize)
    ) {
      setSelectedSize("");
      setSelectedSizeObject(null); // Reset selected size object if not available
    }
    // Optionally, auto-select the first available size for the new color if no size is selected
    if (
      !selectedSize &&
      availableSizesForNewColor &&
      availableSizesForNewColor.size > 0
    ) {
      const autoSelectedSizeName = Array.from(availableSizesForNewColor)[0];
      setSelectedSize(autoSelectedSizeName);
      // Find the full size object for the auto-selected size
      if (newlySelectedVariant) {
        const autoSelectedSizeObject = newlySelectedVariant.sizes.find(
          (s) => s.name === autoSelectedSizeName,
        );
        setSelectedSizeObject(autoSelectedSizeObject || null);
      }
    } else if (selectedSize && newlySelectedVariant) {
      // If selectedSize is still valid, ensure selectedSizeObject is updated for the new variant
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
  const currentSelectedPrice =
    selectedSizeObject?.discountPrice > 0
      ? selectedSizeObject.discountPrice
      : selectedSizeObject?.price || 0;
  const currentSelectedOriginalPrice = selectedSizeObject?.price || 0;
  const currentSelectedDiscount =
    currentSelectedOriginalPrice > 0 &&
      currentSelectedPrice < currentSelectedOriginalPrice
      ? `${Math.round(((currentSelectedOriginalPrice - currentSelectedPrice) / currentSelectedOriginalPrice) * 100)}`
      : "0";

  const productInfoData: ProductInfoData = {
    title: product.name,
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

  const relatedProductsData: RelatedProduct[] = similarProducts.map(
    (p: Product) => {
      let minPrice: number = Infinity;
      let minMRP: number = Infinity;

      p.variants.forEach((variant) => {
        variant.sizes.forEach((size) => {
          if (size.price < minMRP) {
            minMRP = size.price;
          }
          if (size.discountPrice > 0 && size.discountPrice < minPrice) {
            minPrice = size.discountPrice;
          } else if (size.discountPrice === 0 && size.price < minPrice) {
            minPrice = size.price;
          }
        });
      });

      // Handle case where no prices are found (e.g., product has no variants/sizes or all are 0)
      if (minPrice === Infinity) minPrice = 0;
      if (minMRP === Infinity) minMRP = 0;

      const currentDiscount =
        minMRP > 0 && minPrice < minMRP
          ? `${Math.round(((minMRP - minPrice) / minMRP) * 100)}%`
          : "0%"; // Default to 0% if no discount

      return {
        id: p.slug,
        name: p.name,
        image: getProductImageUrl(p),
        hoverImage: p.hoverImage?.url
          ? getApiImageUrl(p.hoverImage.url)
          : getProductImageUrl(p),
        price: minPrice,
        mrp: minMRP,
        discount: currentDiscount,
        soldOut: p.stock <= 0,
      };
    },
  );

  return (
    <div className="font-[family-name:var(--font-montserrat)] bg-[#f9f9f9]">
      <TopInfo />
      <NavbarInner />

      <Breadcrumb
        title={product.name}
        categoryName={product.category?.name}
        categorySlug={product.category?.slug}
      />

      <div className="container mx-auto px-4 pb-12">
        {/* Mobile Title */}
        <div className="lg:hidden mb-4 mt-2">
          <h1 className="text-2xl font-medium text-[#683e14] mb-2 font-[family-name:var(--font-optima)]">
            {product.name}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row md:gap-8">
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
                product.video?.url
                  ? getApiImageUrl(product.video.url)
                  : undefined
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
      <RelatedProducts similarProducts={relatedProductsData} />

      <Footer />

      <EnquireModal
        isOpen={enquireModalOpen}
        onClose={() => setEnquireModalOpen(false)}
        productTitle={product.name}
      />

      <SizeChartModal
        isOpen={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        selectedColor={selectedColor}
        colorToAvailableSizesMap={productInfoData.colorToAvailableSizesMap}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        sizeChartData={sizeChartData} // Pass the fetched data
      />
    </div>
  );
};

export default ProductDetailClient;
