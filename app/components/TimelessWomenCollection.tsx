"use client";

import React from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

const TimelessWomenCollection = () => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
  };

  return (
    <div className="relative w-full py-24 md:py-32 bg-[#fbfbfb]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">

          {/* LEFT SLIDER */}
          <div className="w-full max-w-xl mx-auto">
            <Slider {...sliderSettings} autoplaySpeed={3000}>
              {["/assets/deals1.jpg", "/assets/deals2.jpg", "/assets/deals3.jpg"].map(
                (img, i) => (
                  <div key={i} className="px-2">
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={img}
                        alt={`Deal ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>
                )
              )}
            </Slider>
          </div>

          {/* CENTER CONTENT – SAME HEIGHT, MORE VERTICAL PADDING */}
          <div className="w-full max-w-xl mx-auto px-2">
            <div className="relative aspect-[16/9] border border-[#cc8a00] rounded-lg shadow-lg flex items-center justify-center">
              <div className="text-center px-6 py-10 md:py-10">
                <p className="text-[11px] uppercase tracking-[0.18em] mb-3 text-gray-600">
                  Exclusive Deal • Few Days Left
                </p>

                <h2 className="text-2xl lg:text-3xl font-serif mb-4 text-[#cc8a00] leading-snug">
                  Timeless Women’s Collection
                </h2>

                <p className="text-sm text-gray-600 mb-6 leading-relaxed max-w-sm mx-auto">
                  Beautifully crafted pieces blending comfort, elegance,
                  and effortless everyday style.
                </p>

                <Link
                  href="#"
                  className="inline-block border-y border-black text-black py-2 px-6 uppercase text-xs transition-all duration-500 hover:tracking-[2px]"
                >
                  View More
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT SLIDER */}
          <div className="w-full max-w-xl mx-auto">
            <Slider {...sliderSettings} autoplaySpeed={3500}>
              {["/assets/deals2.jpg", "/assets/deals1.jpg", "/assets/deals3.jpg"].map(
                (img, i) => (
                  <div key={i} className="px-2">
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={img}
                        alt={`Deal ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>
                )
              )}
            </Slider>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TimelessWomenCollection;