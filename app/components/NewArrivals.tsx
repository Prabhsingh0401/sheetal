"use client";

import React, { useCallback, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import {
  getNewArrivals,
  Product,
  fetchWishlist,
  toggleWishlist,
} from "@/app/services/productService";
import toast from "react-hot-toast";

const NewArrivals = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [newArrivalsRes, wishlistRes] = await Promise.all([
          getNewArrivals(),
          fetchWishlist(),
        ]);

        if (newArrivalsRes.success) {
          setProducts(newArrivalsRes.products);
        }

        if (wishlistRes.success && wishlistRes.data) {
          setWishlist(wishlistRes.data.map((p: any) => p._id));
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleWishlistToggle = async (productId: string) => {
    try {
      const isInWishlist = wishlist.includes(productId);

      // Optimistic update
      if (isInWishlist) {
        setWishlist((prev) => prev.filter((id) => id !== productId));
        toast.success("Removed from wishlist");
      } else {
        setWishlist((prev) => [...prev, productId]);
        toast.success("Added to wishlist");
      }

      await toggleWishlist(productId);
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
      toast.error("Failed to update wishlist");
      // Revert on error could be added here
    }
  };

  const getDisplayPrice = (product: Product) => {
    let minPrice = Infinity;
    let relatedMrp = 0;
    let discountStr = "";

    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((v: any) => {
        v.sizes?.forEach((s: any) => {
          // Logic to find lowest effective price
          const effective =
            s.discountPrice && s.discountPrice > 0 ? s.discountPrice : s.price;
          if (effective < minPrice) {
            minPrice = effective;
            relatedMrp = s.price;
          }
        });
      });
    }

    if (minPrice === Infinity) {
      minPrice = 0;
      relatedMrp = 0;
    }

    if (minPrice > 0 && relatedMrp > minPrice) {
      discountStr = `${Math.round(((relatedMrp - minPrice) / relatedMrp) * 100)}% OFF`;
    }

    return {
      price: `₹ ${minPrice.toFixed(2)}`,
      mrp: `₹ ${relatedMrp.toFixed(2)}`,
      discount: discountStr,
    };
  };

  return (
    <div className="container-fluid py-16 font-[family-name:var(--font-montserrat)]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-4 text-left">
            <h2 className="text-[2.5rem] lg:text-[45px] font-medium text-[#68400f] mb-4 font-[family-name:var(--font-optima)] leading-tight">
              New Arrivals
            </h2>

            <p className="text-[#555] text-lg lg:text-xl leading-relaxed mb-8">
              Pick your beauty products today. 50% OFF on the new brands. Order
              all classy products today!
            </p>

            <Link
              href="/product-list?sort=newest"
              className="inline-block border-y border-black text-black py-3 px-10 uppercase transition-all duration-500 hover:tracking-[2px]"
            >
              Explore More
            </Link>
          </div>

          {/* RIGHT – EMBLA CAROUSEL */}
          <div className="lg:col-span-8 relative group/slider">
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex gap-4">
                {loading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-[85%] sm:w-[48%] lg:w-[33.333%] animate-pulse"
                      >
                        <div className="rounded-xl overflow-hidden group ml-2">
                          <div className="relative aspect-[3/4] bg-gray-200 rounded-xl"></div>
                          <div className="p-4 text-center">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  : products.map((product) => {
                      const displayPrice = getDisplayPrice(product);
                      const isWishlisted = wishlist.includes(product._id);

                      return (
                        <div
                          key={product._id}
                          className="flex-shrink-0 w-[85%] sm:w-[48%] lg:w-[33.333%]"
                        >
                          <div className="rounded-xl overflow-hidden group ml-2">
                            <div className="relative aspect-[3/4] overflow-hidden">
                              {product.stock === 0 && (
                                <div className="absolute -top-1 left-0 z-20">
                                  <span className="bg-red-600 text-white text-[10px] px-2 py-1 uppercase font-bold rounded-br-lg">
                                    SOLD OUT
                                  </span>
                                </div>
                              )}

                              {/* Wishlist Button - Matched with ProductGrid */}
                              <div className="absolute top-2 right-2 flex flex-col gap-3 transform translate-x-12 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 z-20">
                                <button
                                  className="w-10 h-10 rounded-full flex items-center justify-center group/icon"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleWishlistToggle(product._id);
                                  }}
                                >
                                  <Image
                                    src={
                                      isWishlisted
                                        ? "/assets/icons/heart-solid.svg"
                                        : "/assets/icons/heart.svg"
                                    }
                                    alt="Wishlist"
                                    width={18}
                                    height={18}
                                    className={
                                      isWishlisted
                                        ? ""
                                        : "group-hover/icon:brightness-0 group-hover/icon:invert"
                                    }
                                  />
                                </button>
                              </div>

                              <Link
                                href={`/product/${product.slug}`}
                                className="block h-full w-full relative"
                              >
                                <Image
                                  src={
                                    product.mainImage?.url ||
                                    "/assets/placeholder-product.jpg"
                                  }
                                  alt={product.name}
                                  width={400}
                                  height={533}
                                  className="w-full h-full object-cover rounded-xl transition-opacity duration-700 group-hover:opacity-0"
                                />
                                <Image
                                  src={
                                    product.hoverImage?.url ||
                                    product.mainImage?.url ||
                                    "/assets/placeholder-product.jpg"
                                  }
                                  alt={product.name}
                                  width={400}
                                  height={533}
                                  className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                                />
                              </Link>
                            </div>
                            <div className="p-4 text-center">
                              <h6 className="mb-2 h-[40px] overflow-hidden flex items-center justify-center">
                                <Link
                                  href={`/product/${product.slug}`}
                                  className="text-[14px] text-black hover:text-[#B78D65] font-medium line-clamp-2"
                                >
                                  {product.name}
                                </Link>
                              </h6>
                              <div className="flex flex-col items-center gap-1 mb-3">
                                {/* Size removed */}
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                    <Image
                                      key={i}
                                      src="/assets/gray-star.png"
                                      alt="star"
                                      width={20}
                                      height={20}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div
                                className="w-full flex flex-nowrap items-center justify-center gap-1 mb-4 px-1"
                                style={
                                  {
                                    containerType: "inline-size",
                                  } as React.CSSProperties
                                }
                              >
                                {displayPrice.discount ? (
                                  <>
                                    <span className="text-[clamp(11px,5cqw,18px)] text-[#281b00] font-bold whitespace-nowrap">
                                      {displayPrice.price}
                                    </span>
                                    <span className="text-[clamp(9px,4cqw,14px)] text-gray-400 line-through whitespace-nowrap">
                                      {displayPrice.mrp}
                                    </span>
                                    <span className="text-[clamp(9px,4cqw,14px)] text-[#B78D65] font-bold whitespace-nowrap">
                                      {displayPrice.discount}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-[clamp(11px,5cqw,18px)] text-[#281b00] font-bold whitespace-nowrap">
                                    {displayPrice.mrp}
                                  </span>
                                )}
                              </div>
                              <Link
                                href={`/product/${product.slug}`}
                                className="inline-block border-y border-black text-black py-2 px-8 uppercase transition-all duration-500 hover:tracking-[1px]"
                              >
                                View Product
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>

            {/* Nav Buttons */}
            <button
              onClick={scrollPrev}
              className="absolute left-[-15px] top-[30%] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10 hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-[-15px] top-[30%] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10 hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;
