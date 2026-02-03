"use client";

import React, { useCallback, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { getNewArrivals, Product } from "@/app/services/productService"; // Import Product type
import { getApiImageUrl } from "@/app/services/api";

const NewArrivals = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
  });

  const [products, setProducts] = useState<Product[]>([]); // Explicitly type the state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const res = await getNewArrivals();
        if (res.success) {
          setProducts(res.products);
        }
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const getDisplayPrice = (product: Product) => {
    // Add type to product argument
    if (
      !product.variants ||
      product.variants.length === 0 ||
      !product.variants[0].sizes ||
      product.variants[0].sizes.length === 0
    ) {
      return { price: "N/A", mrp: "N/A", discount: "" };
    }
    const firstSize = product.variants[0].sizes[0];
    const price = firstSize.discountPrice || firstSize.price;
    const mrp = firstSize.price;
    const discount =
      mrp > price ? `${Math.round(((mrp - price) / mrp) * 100)}% OFF` : "";
    return {
      price: `₹ ${price.toFixed(2)}`,
      mrp: `₹ ${mrp.toFixed(2)}`,
      discount,
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
                      const firstVariant = product.variants?.[0];
                      const displaySize =
                        firstVariant?.sizes?.[0]?.name || "N/A";

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
                              <div className="absolute top-3 right-3 z-20 cursor-pointer rounded-full p-1.5">
                                <Image
                                  src="/assets/icons/heart.svg"
                                  width={18}
                                  height={18}
                                  alt="wishlist"
                                />
                              </div>
                              <Link
                                href={`/product/${product.slug}`}
                                className="block h-full w-full relative"
                              >
                                <Image
                                  src={getApiImageUrl(product.mainImage?.url)}
                                  alt={product.name}
                                  width={400}
                                  height={533}
                                  className="w-full h-full object-cover rounded-xl transition-opacity duration-700 group-hover:opacity-0"
                                />
                                <Image
                                  src={getApiImageUrl(
                                    product.hoverImage?.url ||
                                      product.mainImage?.url,
                                  )}
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
                                <div className="text-xs text-gray-600">
                                  <span className="font-bold text-black">
                                    Size:
                                  </span>{" "}
                                  {displaySize}
                                </div>
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
                              <div className="flex justify-between items-center gap-2 mb-4">
                                <div className="flex flex-col">
                                  {displayPrice.discount && (
                                    <span className="text-lg text-[#281b00] font-bold">
                                      {displayPrice.price}
                                    </span>
                                  )}
                                  <span
                                    className={`text-xs text-gray-400 ${displayPrice.discount ? "line-through" : "text-lg text-[#281b00] font-bold"}`}
                                  >
                                    {displayPrice.mrp}
                                  </span>
                                </div>
                                {displayPrice.discount && (
                                  <span className="text-xs text-[#B78D65] font-bold">
                                    {displayPrice.discount}
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
