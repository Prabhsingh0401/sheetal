"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import { API_BASE_URL } from "../services/api";

const TimelessWomenCollection = () => {
  const [leftImages, setLeftImages] = useState([]);
  const [rightImages, setRightImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLookbook = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/lookbooks/timeless-women`);
        const data = await res.json();
        if (data.success && data.lookbook) {
          setLeftImages(data.lookbook.leftSliderImages);
          setRightImages(data.lookbook.rightSliderImages);

          console.log(data.lookbook.leftSliderImages, data.lookbook.rightSliderImages)
        }
      } catch (error) {
        console.error("Error fetching lookbook images", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLookbook();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
  };

  const defaultImages = [
    "/assets/deals1.jpg",
    "/assets/deals2.jpg",
    "/assets/deals3.jpg",
  ];

  const leftSliderData = leftImages.length > 0 ? leftImages : defaultImages.map(url => ({ url }));
  const rightSliderData = rightImages.length > 0 ? rightImages : defaultImages.map(url => ({ url }));

  return (
    <div className="relative w-full py-24 md:py-20 bg-[#fbfbfb]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          {/* LEFT SLIDER */}
          <div className="w-full max-w-xl mx-auto">
            <Slider {...sliderSettings} autoplaySpeed={3000}>
              {leftSliderData.map((img, i) => (
                <div key={i} className="px-2">
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={img.url}
                      alt={`Deal ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* CENTER CONTENT – SAME HEIGHT, MORE VERTICAL PADDING */}
          <div className="w-full max-w-xl mx-auto px-2">
            <div className="relative aspect-[16/9] border border-[#cc8a00] rounded-lg shadow-lg flex items-center justify-center">
              <div className="text-center px-6 py-10 md:py-5">
                <p className="text-[11px] uppercase tracking-[0.18em] mb-2 text-gray-600">
                  Exclusive Deal • Few Days Left
                </p>

                <h2 className="text-2xl lg:text-3xl font-serif mb-2 text-[#cc8a00] leading-snug">
                  Timeless Women’s Collection
                </h2>

                <p className="text-sm text-gray-600 mb-2 leading-relaxed max-w-sm mx-auto">
                  Beautifully crafted pieces blending comfort, elegance, and
                  effortless everyday style.
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
              {rightSliderData.map((img, i) => (
                <div key={i} className="px-2">
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={img.url}
                      alt={`Deal ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelessWomenCollection;
