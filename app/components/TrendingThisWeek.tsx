"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import {
  fetchTrendingProducts,
  getProductImageUrl,
  Product
} from "../services/productService";
import { getApiImageUrl } from "../services/api";
const TrendingThisWeek = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
  });

  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  React.useEffect(() => {
    const loadTrending = async () => {
      try {
        const res = await fetchTrendingProducts();
        if (res.success && res.data) {
          const formattedProducts = res.data.map((p: Product) => {
            let minPrice = Infinity;
            let relatedMrp = 0;
            let discountStr = "";

            if (p.variants && p.variants.length > 0) {
              p.variants.forEach((v: any) => {
                v.sizes?.forEach((s: any) => {
                  // Logic to find lowest effective price
                  const effective = s.discountPrice && s.discountPrice > 0 ? s.discountPrice : s.price;
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

            const validVariants = p.variants?.filter((v: any) => v.sizes?.some((s: any) => s.stock > 0));
            const isSoldOut = !validVariants || validVariants.length === 0 || p.stock <= 0;

            return {
              id: p.slug,
              name: p.name,
              image: getProductImageUrl(p),
              hoverImage: p.hoverImage?.url
                ? getApiImageUrl(p.hoverImage.url)
                : getProductImageUrl(p),
              price: `₹ ${minPrice.toFixed(2)}`,
              mrp: `₹ ${relatedMrp.toFixed(2)}`,
              discount: discountStr,
              size: p.variants?.[0]?.sizes?.[0]?.name || "N/A", // Just a placeholder
              soldOut: isSoldOut,
            };
          });
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Failed to load trending products", error);
      } finally {
        setLoading(false);
      }
    };
    loadTrending();
  }, []);

  if (loading) return null; // Or a loader
  if (products.length === 0) return null;

  return (
    <div
      className="container-fluid py-12 home-page-product font-[family-name:var(--font-montserrat)]"
      style={{
        backgroundImage: "url('/assets/650465765.png')",
        backgroundSize: "cover",
      }}
    >
      <div className="container mx-auto px-4 py-10">
        {/* Heading */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-10 w-full">
            <div className="h-[1px] bg-[#68400f] flex-1" />
            <h2 className="text-[2rem] lg:text-[40px] font-medium text-[#5d4112] whitespace-nowrap font-[family-name:var(--font-optima)]">
              Trending This Week
            </h2>
            <div className="h-[1px] bg-[#68400f] flex-1" />
          </div>
          <p className="text-center max-w-2xl text-lg mt-2">
            Best-Selling Gems: Signature sarees, ensembles, and Indo-Western
            pieces that define Studio By Sheetal.
          </p>
        </div>

        {/* Embla Wrapper */}
        <div className="relative group/slider">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="
                    flex-shrink-0
                    w-[85%]
                    sm:w-[45%]
                    lg:w-[25%]
                  "
                >
                  <div className="rounded-xl overflow-hidden group">
                    {/* IMAGE BLOCK */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      {/* SOLD OUT */}
                      {product.soldOut && (
                        <div className="absolute -top-1 left-0 z-20">
                          <span className="bg-red-600 text-white text-[10px] px-2 py-1 uppercase font-bold tracking-wider rounded-br-lg">
                            SOLD OUT
                          </span>
                        </div>
                      )}

                      {/* PRODUCT IMAGE */}
                      <Link
                        href={`/product/${product.id}`}
                        className="block h-full w-full relative"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={400}
                          height={533}
                          className="w-full h-full object-cover rounded-xl transition-opacity duration-700 group-hover:opacity-0"
                        />
                        <Image
                          src={product.hoverImage}
                          alt={product.name}
                          width={400}
                          height={533}
                          className="absolute inset-0 w-full h-full rounded-xl object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                        />
                      </Link>
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 text-center">
                      <h6 className="mb-2 h-[40px] overflow-hidden flex items-center justify-center">
                        <Link
                          href={`/product/${product.id}`}
                          className="text-[17px] text-black hover:text-[#B78D65] font-medium line-clamp-2 leading-tight"
                        >
                          {product.name}
                        </Link>
                      </h6>

                      <div className="mb-3">
                        <div className="flex justify-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Image
                              key={i}
                              src="/assets/gray-star.png"
                              alt="star"
                              width={18}
                              height={18}
                            />
                          ))}
                        </div>
                      </div>

                      <div
                        className="w-full flex flex-nowrap items-center justify-center gap-1 mb-4 px-1"
                        style={{ containerType: "inline-size" } as React.CSSProperties}
                      >
                        {product.discount ? (
                          <>
                            <span className="text-[clamp(11px,5cqw,18px)] text-[#281b00] font-bold whitespace-nowrap">
                              {product.price}
                            </span>
                            <span className="text-[clamp(9px,4cqw,14px)] text-gray-400 line-through whitespace-nowrap">
                              {product.mrp}
                            </span>
                            <span className="text-[clamp(9px,4cqw,14px)] text-[#B78D65] font-bold whitespace-nowrap">
                              {product.discount}
                            </span>
                          </>
                        ) : (
                          <span className="text-[clamp(11px,5cqw,18px)] text-[#281b00] font-bold whitespace-nowrap">
                            {product.mrp}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/product/${product.id}`}
                        className="inline-block border-y border-black text-black py-2 px-8 uppercase transition-all duration-500 hover:tracking-[1px]"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nav Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-[-15px] top-[35%] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10 hover:bg-gray-50"
            aria-label="Previous product"
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
            className="absolute right-[-15px] top-[35%] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10 hover:bg-gray-50"
            aria-label="Next product"
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
  );
};

export default TrendingThisWeek;
