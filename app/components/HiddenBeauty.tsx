"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { useCategories } from "../hooks/useCategories";
import { getCategoryImageUrl } from "../services/categoryService";

const HiddenBeauty = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: false,
  });

  const { categories, loading, error } = useCategories();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center font-[family-name:var(--font-optima)]">
        <h2 className="text-[1.5rem] lg:text-[40px] font-medium text-[#5d4112] mb-2">
          Bring Out The Hidden Beauty
        </h2>
        <p className="max-w-2xl mx-auto text-[16px] lg:text-[18px] font-semibold mb-8">
          Designer pieces that blend traditional charm with modern silhouettes
          for every occasion.
        </p>
        <div className="flex justify-center items-center h-[400px]">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#5d4112] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Show error or empty state
  if (error || !categories || categories.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 text-center font-[family-name:var(--font-optima)]">
        <h2 className="text-[1.5rem] lg:text-[40px] font-medium text-[#5d4112] mb-2">
          Bring Out The Hidden Beauty
        </h2>
        <p className="max-w-2xl mx-auto text-[16px] lg:text-[18px] font-semibold mb-8">
          Designer pieces that blend traditional charm with modern silhouettes
          for every occasion.
        </p>
        <div className="flex flex-col justify-center items-center h-[400px] text-center">
          <div className="w-20 h-20 bg-[#f9f9f9] rounded-full flex items-center justify-center mb-6 shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#5d4112"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-[#5d4112] mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-500 max-w-md">
            The site might be under construction or check your network access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 text-center font-[family-name:var(--font-optima)]">
      <h2 className="text-[1.5rem] lg:text-[40px] font-medium text-[#5d4112] mb-2">
        Bring Out The Hidden Beauty
      </h2>
      <p className="max-w-2xl mx-auto text-[16px] lg:text-[18px] font-semibold mb-8">
        Designer pieces that blend traditional charm with modern silhouettes for
        every occasion.
      </p>

      {/* Embla Wrapper */}
      <div className="relative group/slider">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="
                  flex-shrink-0
                  w-[85%]
                  sm:w-[45%]
                  lg:w-[20%]
                "
              >
                <div className="relative rounded-[22px] overflow-hidden group">
                  <Link
                    href={`/product-list?category=${cat.slug}`}
                    className="block"
                  >
                    <Image
                      src={getCategoryImageUrl(
                        cat,
                        "/assets/default-image.png",
                      )}
                      alt={cat.name}
                      width={400}
                      height={600}
                      className="w-full h-[420px] object-cover"
                      priority={false}
                    />
                  </Link>

                  <Link
                    href={`/product-list?category=${cat.slug}`}
                    className="
                      absolute bottom-0 left-0 w-full
                      text-center text-white text-[22px]
                      bg-gradient-to-t from-[#251d05] to-transparent
                      pt-[120px] pb-[30px]
                      transition-all duration-300
                      group-hover:text-[#ffc107]
                    "
                  >
                    {cat.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nav Buttons */}
        <button
          onClick={scrollPrev}
          className="absolute left-[-15px] top-[50%] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10 hover:bg-gray-50"
          aria-label="Previous category"
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
          className="absolute right-[-15px] top-[50%] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10 hover:bg-gray-50"
          aria-label="Next category"
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
  );
};

export default HiddenBeauty;
