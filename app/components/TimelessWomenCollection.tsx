"use client";

import React from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

const TimelessWomenCollection = () => {
  const settingsLeft = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const settingsRight = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
  };

  return (
    <div className="relative w-full py-16 md:py-20 bg-[#f9f9f9]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/845146398.jpg"
          alt="Background"
          fill
          className="object-cover opacity-30" // Lowered opacity to ensure text readability if the image is busy, or I can remove it if the original image is light enough.
          // The original HTML used the image as a background. I will try to respect that.
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/60"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Left Slider */}
          <div className="w-full max-w-sm mx-auto lg:max-w-none">
            <Slider {...settingsLeft}>
              <div className="px-2 outline-none">
                 <div className="relative aspect-[3/4] w-full overflow-hidden shadow-lg rounded-lg">
                    <Image src="/assets/deals1.jpg" alt="Deal 1" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                 </div>
              </div>
              <div className="px-2 outline-none">
                 <div className="relative aspect-[3/4] w-full overflow-hidden shadow-lg rounded-lg">
                    <Image src="/assets/deals2.jpg" alt="Deal 2" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                 </div>
              </div>
              <div className="px-2 outline-none">
                 <div className="relative aspect-[3/4] w-full overflow-hidden shadow-lg rounded-lg">
                    <Image src="/assets/deals3.jpg" alt="Deal 3" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                 </div>
              </div>
            </Slider>
          </div>

          {/* Center Content */}
          <div className="text-center p-4 border border-[#cc8a00] py-10 rounded-xl">
             <p className="text-sm uppercase tracking-[0.2em] mb-3 font-medium text-gray-600">Exclusive Deal • Few Days Left</p>
             <h2 className="text-3xl lg:text-5xl font-serif mb-6 text-[#cc8a00] leading-tight">Timeless Women’s Collection</h2>
             <p className="mb-8 text-gray-600 max-w-md mx-auto leading-relaxed">
               Upgrade your everyday style with beautifully crafted pieces that blend comfort, elegance, and effortless charm.
             </p>
             <a href="#" className="inline-block border-y border-black text-black font-normal py-2 px-8 uppercase transition-all duration-500 hover:text-black hover:tracking-[2px] text-sm">
               View More
             </a>
          </div>

          {/* Right Slider */}
          <div className="w-full max-w-sm mx-auto lg:max-w-none">
             <Slider {...settingsRight}>
              <div className="px-2 outline-none">
                 <div className="relative aspect-[3/4] w-full overflow-hidden shadow-lg rounded-lg">
                    <Image src="/assets/deals2.jpg" alt="Deal 2" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                 </div>
              </div>
              <div className="px-2 outline-none">
                 <div className="relative aspect-[3/4] w-full overflow-hidden shadow-lg rounded-lg">
                    <Image src="/assets/deals1.jpg" alt="Deal 1" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                 </div>
              </div>
              <div className="px-2 outline-none">
                 <div className="relative aspect-[3/4] w-full overflow-hidden shadow-lg rounded-lg">
                    <Image src="/assets/deals3.jpg" alt="Deal 3" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                 </div>
              </div>
            </Slider>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TimelessWomenCollection;
