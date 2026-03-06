"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "./ProductCard";
import Link from "next/link";

interface RelatedProductsProps {
  similarProducts: any[];
}

/* ── Arrow button ─────────────────────────────────────────── */
const ArrowBtn = ({
  onClick,
  disabled,
  dir,
}: {
  onClick: () => void;
  disabled: boolean;
  dir: "prev" | "next";
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={dir === "prev" ? "Previous" : "Next"}
    className={`
      w-10 h-10 flex items-center justify-center rounded-full border
      transition-all duration-200
      ${disabled
        ? "border-gray-200 text-gray-300 cursor-default"
        : "border-[#bd9951] text-[#bd9951] hover:bg-[#bd9951] hover:text-white"
      }
    `}
  >
    {dir === "prev" ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    )}
  </button>
);

/* ── Slider ───────────────────────────────────────────────── */
const EmblaSlider = ({ products }: { products: any[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);

  const update = useCallback(() => {
    if (!emblaApi) return;
    setPrevDisabled(!emblaApi.canScrollPrev());
    setNextDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
  }, [emblaApi, update]);

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {products.length > 4 && (
        <div className="flex items-center gap-3 mt-6">
          <ArrowBtn dir="prev" onClick={() => emblaApi?.scrollPrev()} disabled={prevDisabled} />
          <ArrowBtn dir="next" onClick={() => emblaApi?.scrollNext()} disabled={nextDisabled} />
        </div>
      )}
    </div>
  );
};

/* ── Main component ───────────────────────────────────────── */
const RelatedProducts: React.FC<RelatedProductsProps> = ({ similarProducts }) => {
  // Track products seen during this session in localStorage
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("__rv__") || "[]");
      // Exclude products already shown in similar list
      const ids = new Set(similarProducts.map((p) => p.id));
      setRecentlyViewed(stored.filter((p: any) => !ids.has(p.id)));
    } catch {
      setRecentlyViewed([]);
    }
  }, [similarProducts]);

  if (!similarProducts || similarProducts.length === 0) return null;

  return (
    <>
      {/* ── Similar Products ── */}
      <section
        id="similar-products-section"
        className="container mx-auto px-4 py-12 border-t border-gray-200"
        aria-label="Similar products"
      >
        <div className="flex items-end justify-between mb-8">
          <h3 className="text-4xl text-[#653f1b] font-[family-name:var(--font-optima)]">
            Similar Products
          </h3>
          <p className="text-xs text-gray-400 hidden sm:block">
            Showing {similarProducts.length} product{similarProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        <EmblaSlider products={similarProducts} />
      </section>

      {/* ── Recently Viewed (only when we have data) ── */}
      {recentlyViewed.length > 0 && (
        <section
          className="container mx-auto px-4 py-12 border-t border-gray-200 mb-12"
          aria-label="Recently viewed products"
        >
          <div className="flex items-end justify-between mb-8">
            <h3 className="text-4xl text-[#653f1b] font-[family-name:var(--font-optima)]">
              Recently Viewed
            </h3>
          </div>
          <EmblaSlider products={recentlyViewed.slice(0, 8)} />
        </section>
      )}
    </>
  );
};

export default RelatedProducts;
