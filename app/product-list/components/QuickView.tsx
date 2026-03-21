"use client";
import React, { useEffect, useState } from "react";
import {
  Product,
  fetchProductBySlug,
  getProductImageUrl,
} from "../../services/productService";
import { isAuthenticated } from "../../services/authService";
import ProductImageGallery from "../../product/components/ProductImageGallery";
import StarRating from "../../product/components/StarRating";
import { useRouter } from "next/navigation";
import { getApiImageUrl } from "../../services/api";
import Image from "next/image";
import { useWishlist } from "../../hooks/useWishlist";
import toast from "react-hot-toast";
import WishlistLoginModal from "../../components/WishlistLoginModal";

import { useCart } from "../../hooks/useCart";

interface QuickViewProps {
  productSlug: string | null;
  onClose: () => void;
}

const QuickView: React.FC<QuickViewProps> = ({ productSlug, onClose }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  // Removed lowestPrice and lowestMrp states
  const {
    isProductInWishlist,
    toggleProductInWishlist,
    isLoginModalOpen,
    closeLoginModal,
    handleLoginRedirect,
  } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (productSlug) {
      const getProduct = async () => {
        setLoading(true);
        try {
          const response = await fetchProductBySlug(productSlug);
          if (response.success && response.data) {
            setProduct(response.data);
            const mainImg = getProductImageUrl(response.data);
            setSelectedImage(mainImg);

            // Default size and color logic: find first available variant, its color, and its size
            const firstAvailableVariant = response.data.variants?.find(
              (v: any) =>
                Array.isArray(v.sizes) &&
                v.sizes.length > 0 &&
                v.sizes.some((s: any) => s.stock > 0),
            );
            if (firstAvailableVariant) {
              if (firstAvailableVariant.color?.name) {
                setSelectedColor(firstAvailableVariant.color.name);
              }
              const firstAvailableSize = firstAvailableVariant.sizes.find(
                (s: any) => s.stock > 0,
              );
              if (firstAvailableSize) {
                setSelectedSize(firstAvailableSize.name);
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch product", error);
        } finally {
          setLoading(false);
        }
      };
      getProduct();
    }
  }, [productSlug]);

  const { currentPrice, currentOriginalPrice, currentDiscount } =
    React.useMemo(() => {
      let price = 0;
      let originalPrice = 0;
      let discount = 0;

      if (product && selectedColor && selectedSize) {
        const selectedVariant = product.variants.find(
          (v) => v.color?.name === selectedColor,
        );

        if (selectedVariant) {
          const selectedSizeInfo = selectedVariant.sizes.find(
            (s) => s.name === selectedSize,
          );

          if (selectedSizeInfo) {
            price =
              selectedSizeInfo.discountPrice &&
              selectedSizeInfo.discountPrice > 0
                ? selectedSizeInfo.discountPrice
                : selectedSizeInfo.price;
            originalPrice = selectedSizeInfo.price;

            if (originalPrice > 0 && price < originalPrice) {
              discount = Math.round(
                ((originalPrice - price) / originalPrice) * 100,
              );
            }
          }
        }
      } else if (product) {
        // Fallback to lowest overall price if no selection yet, similar to initial rendering
        let minPrice = Infinity;
        let minMrp = Infinity;

        product.variants.forEach((variant) => {
          variant.sizes.forEach((size) => {
            const variantPrice =
              size.discountPrice && size.discountPrice > 0
                ? size.discountPrice
                : size.price;
            if (variantPrice < minPrice) {
              minPrice = variantPrice;
              minMrp = size.price;
            }
          });
        });
        price = minPrice === Infinity ? 0 : minPrice;
        originalPrice = minMrp === Infinity ? 0 : minMrp;
        if (originalPrice > 0 && price < originalPrice) {
          discount = Math.round(
            ((originalPrice - price) / originalPrice) * 100,
          );
        }
      }

      return {
        currentPrice: price,
        currentOriginalPrice: originalPrice,
        currentDiscount: discount,
      };
    }, [product, selectedColor, selectedSize]);

  const handleBuyNow = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    const selectedVariant = product.variants.find(
      (v) => v.color?.name === selectedColor,
    );
    const selectedSizeObject = selectedVariant?.sizes.find(
      (s) => s.name === selectedSize,
    );

    if (!selectedVariant || !selectedSizeObject) {
      toast.error("Selected variant not available");
      return;
    }

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
      quantity,
      price: selectedSizeObject.price || 0,
      discountPrice:
        selectedSizeObject.discountPrice || selectedSizeObject.price || 0,
      variantImage: variantImageUrl,
    };

    const encoded = encodeURIComponent(JSON.stringify(buyNowItem));
    const checkoutUrl = `/checkout/address?buynow=${encoded}`;

    if (!isAuthenticated()) {
      sessionStorage.setItem("redirect", checkoutUrl);
      onClose(); // close the modal before navigating
      router.push("/login");
      return;
    }

    onClose();
    router.push(checkoutUrl);
  };

  const handleAddToCart = async () => {
    if (product) {
      const selectedVariant = product.variants.find(
        (variant) => variant.color?.name === selectedColor,
      );
      if (selectedVariant) {
        // Ensure a size is selected for addToCart
        if (!selectedSize) {
          console.error("Please select a size."); // Or show a toast message
          return;
        }
        const selectedSizeInfo = selectedVariant.sizes.find(
          (s) => s.name === selectedSize,
        );
        if (selectedSizeInfo) {
          const variantImageUrl = getApiImageUrl(
            selectedVariant.v_image,
            product.mainImage?.url || "/assets/default-image.png",
          );
          await addToCart(
            product._id,
            selectedVariant._id,
            quantity,
            selectedSize,
            selectedSizeInfo.price,
            selectedSizeInfo.discountPrice,
            variantImageUrl, // 7th: variantImage
            selectedColor, // 8th: color
            {
              _id: product._id,
              name: product.name,
              slug: product.slug,
              mainImage: product.mainImage,
            },
          );
          onClose();
        } else {
          console.error("Selected size info not found");
        }
      } else {
        console.error("Selected variant not found");
      }
    }
  };

  if (!productSlug) {
    return null;
  }

  const displayPrice = currentPrice;
  const displayOriginalPrice = currentOriginalPrice;
  const discount = currentDiscount;

  const galleryImages = [
    getProductImageUrl(product || undefined),
    ...(product?.images?.map((img) => getApiImageUrl(img.url)) || []),
  ].filter(Boolean) as string[];

  const allUniqueColors: { name: string; image: string }[] = [];
  const allUniqueSizeNames = new Set<string>();
  const colorToAvailableSizesMap = new Map<string, Set<string>>();

  product?.variants?.forEach((v) => {
    if (
      v.color &&
      typeof v.color === "object" &&
      v.color.name &&
      !allUniqueColors.some((c) => c.name === v.color!.name)
    ) {
      allUniqueColors.push({
        name: v.color!.name,
        image: getApiImageUrl(v.v_image, getProductImageUrl(product)),
      });
    }

    if (Array.isArray(v.sizes)) {
      v.sizes.forEach((s) => {
        if (s?.name) {
          allUniqueSizeNames.add(s.name);
          if (
            v.color &&
            typeof v.color === "object" &&
            v.color.name &&
            s.stock > 0
          ) {
            if (!colorToAvailableSizesMap.has(v.color!.name)) {
              colorToAvailableSizesMap.set(v.color!.name, new Set<string>());
            }
            colorToAvailableSizesMap.get(v.color!.name)?.add(s.name);
          }
        }
      });
    }
  });

  const allSizesForDisplay = Array.from(allUniqueSizeNames);

  const handleColorChange = (color: { name: string; image: string }) => {
    setSelectedColor(color.name);
    setSelectedImage(color.image);

    const availableSizesForNewColor = colorToAvailableSizesMap.get(color.name);
    if (
      selectedSize &&
      availableSizesForNewColor &&
      !availableSizesForNewColor.has(selectedSize)
    ) {
      setSelectedSize("");
    }
    if (
      !selectedSize &&
      availableSizesForNewColor &&
      availableSizesForNewColor.size > 0
    ) {
      setSelectedSize(Array.from(availableSizesForNewColor)[0]);
    }
  };

  const handleViewSimilar = () => {
    if (!product) return;
    onClose();
    router.push(`/product/${product.slug}?scroll=similar`);
  };

  return (
    <div
      className="fixed inset-0 z-[1005] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden"
        style={{ maxHeight: "95vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute cursor-pointer top-3 right-3 text-gray-500 border border-gray-300 w-8 h-8 flex items-center justify-center hover:text-gray-700 text-xl font-bold z-10 bg-white"
          onClick={onClose}
        >
          <span className="mb-1">&times;</span>
        </button>

        <div className="overflow-y-auto" style={{ maxHeight: "95vh" }}>
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="w-16 h-16 border-4 border-[#bd9951] border-dashed rounded-full animate-spin" />
            </div>
          ) : product ? (
            <div className="flex flex-col sm:flex-row">
              {/* Left — image gallery, no padding so it bleeds to edge */}
              <div className="w-full sm:w-[52%] shrink-0 p-10">
                <ProductImageGallery
                  images={galleryImages}
                  selectedImage={selectedImage || galleryImages[0]}
                  onImageChange={setSelectedImage}
                  title={product.name}
                  isWishlisted={isProductInWishlist(product._id)}
                  onToggleWishlist={() => toggleProductInWishlist(product._id)}
                  onScrollToSimilar={handleViewSimilar}
                />
              </div>

              {/* Right — product details */}
              <div
                className="w-full sm:w-[48%] flex flex-col text-left p-6 px-10"
              >
                {/* Name */}
                <h2 className="text-[28px] font-normal text-[#683e14] mb-3 font-[family-name:var(--font-optima)] leading-snug">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-2">
                  <StarRating rating={product.averageRating || 0} />
                </div>

                {/* Product code */}
                <div className="text-[#005648] text-[15px] mb-2">
                  <span className="font-bold">Product Code:</span>{" "}
                  {product.sku}
                </div>

                {/* Short desc */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {product.shortDescription}
                </p>

                {/* Price */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-[22px] font-[family-name:var(--font-montserrat)]">
                      ₹ {displayPrice.toFixed(2)}
                    </span>
                    {displayOriginalPrice > displayPrice && (
                      <span className="text-[16px] text-gray-400 line-through font-[family-name:var(--font-montserrat)]">
                        ₹ {displayOriginalPrice.toFixed(2)}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="text-[15px] text-[#6a3f0e] font-semibold font-[family-name:var(--font-montserrat)]">
                        Save {discount}%
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-gray-400 mt-1 font-[family-name:var(--font-montserrat)]">
                    Inclusive of all taxes.
                  </p>
                </div>

                {/* Color */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Select Color:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allUniqueColors.map((color: any, i: number) => (
                      <div
                        key={i}
                        className={`w-10 h-14 md:w-12 md:h-16 border cursor-pointer hover:border-[#bd9951] p-0.5 relative flex-shrink-0 ${
                          selectedColor === color.name
                            ? "border-[#bd9951]"
                            : "border-gray-200"
                        }`}
                        onClick={() => handleColorChange(color)}
                      >
                        <Image
                          src={color.image}
                          alt={color.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Select Size:
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {allSizesForDisplay.map((sizeName) => {
                      const isAvailableForSelectedColor =
                        colorToAvailableSizesMap
                          .get(selectedColor)
                          ?.has(sizeName);
                      const isDisabled = !isAvailableForSelectedColor;
                      const selectedVariant = product.variants.find(
                        (v) => v.color?.name === selectedColor,
                      );
                      const stock =
                        selectedVariant?.sizes.find((s) => s.name === sizeName)
                          ?.stock ?? 0;

                      return (
                        <div
                          key={sizeName}
                          className="flex flex-col items-center gap-1"
                        >
                          <button
                            disabled={isDisabled}
                            onClick={() => setSelectedSize(sizeName)}
                            className={`
                          ${sizeName === "One Size" ? "px-3 py-2 rounded-md" : "w-9 h-9 md:w-10 md:h-10 rounded-full"}
                          flex items-center justify-center border text-xs md:text-sm font-medium transition-colors relative overflow-hidden
                          ${isDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
                          ${selectedSize === sizeName && !isDisabled ? "border-[#bd9951]" : "border-gray-300 text-gray-700 hover:border-[#bd9951] cursor-pointer"}
                        `}
                          >
                            {sizeName}
                            {isDisabled && (
                              <div className="absolute w-full h-px bg-gray-400 transform rotate-45" />
                            )}
                          </button>
                          {isAvailableForSelectedColor &&
                            stock <= 5 &&
                            stock > 0 && (
                              <span className="text-[9px] bg-[#f5a623] text-white px-1.5 py-0.5 rounded-sm font-semibold whitespace-nowrap">
                                {stock} left
                              </span>
                            )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto">
                  <div className="flex gap-3 items-center">
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="w-16 h-11 border border-gray-300 text-center focus:outline-none focus:border-[#bd9951]"
                    />
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 h-11 bg-white border border-[#fe5722] text-[#fe5722] uppercase text-sm font-medium tracking-wider hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 h-11 bg-[#fe5722] text-white uppercase text-sm font-medium tracking-wider cursor-pointer transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">Product not found</div>
          )}
        </div>
      </div>

      <WishlistLoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onLogin={handleLoginRedirect}
      />
    </div>
  );
};

export default QuickView;
