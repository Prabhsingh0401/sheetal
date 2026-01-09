"use client";

import React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

const InstagramDiaries = () => {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
  });

  const images = [
    "/assets/i1.webp",
    "/assets/i2.webp",
    "/assets/i3.webp",
    "/assets/i4.webp",
    "/assets/i5.webp",
  ];

  return (
    <div className="relative w-full py-16 md:py-20 bg-[#f9f9f9] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/845146398.jpg"
          alt="Background"
          fill
          className="object-cover opacity-20"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/60"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#cc8a00] mb-3 font-[family-name:var(--font-optima)]">
            Visit Our Instagram Diaries
          </h2>
          <p className="text-[#666] text-base md:text-lg tracking-wide">
            Follow To Know More @sbsinstagram
          </p>
        </div>

        {/* Carousel Section */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-4">
            {images.map((src, index) => (
              <div
                key={index}
                className="
                  flex-shrink-0
                  w-[85%]
                  sm:w-[45%]
                  lg:w-[20%]
                "
              >
                <div className="relative overflow-hidden rounded-xl shadow-md group cursor-pointer aspect-[3/4]">
                  <Image
                    src={src}
                    alt={`Instagram Post ${index + 1}`}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
                  
                  {/* Instagram Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <i className="fab fa-instagram text-white text-3xl drop-shadow-lg"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramDiaries;