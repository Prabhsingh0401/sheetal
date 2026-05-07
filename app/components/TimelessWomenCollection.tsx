"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import Link from "next/link";
import { API_BASE_URL } from "../services/api";

const DEFAULT_CENTER = {
  label: "Exclusive Deal • Few Days Left",
  heading: "Timeless Women's Collection",
  description:
    "<p>Beautifully crafted pieces blending comfort, elegance, and effortless everyday style.</p>",
  buttonText: "View More",
  buttonLink: "#",
};

const TimelessWomenCollection = () => {
  const [leftImages, setLeftImages] = useState([]);
  const [rightImages, setRightImages] = useState([]);
  const [centerContent, setCenterContent] = useState(DEFAULT_CENTER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLookbook = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/lookbooks/timeless-women`);
        const data = await res.json();
        if (data.success && data.lookbook) {
          setLeftImages(data.lookbook.leftSliderImages);
          setRightImages(data.lookbook.rightSliderImages);
          if (data.lookbook.centerContent) {
            setCenterContent({
              ...DEFAULT_CENTER,
              ...data.lookbook.centerContent,
            });
          }
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

  const leftSliderData =
    leftImages.length > 0 ? leftImages : defaultImages.map((url) => ({ url }));
  const rightSliderData =
    rightImages.length > 0
      ? rightImages
      : defaultImages.map((url) => ({ url }));

  return (
    <div className="flex w-full justify-center bg-[#fbfbfb] px-4 py-6 sm:px-6">
      <div className="container px-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch justify-items-center">
          {/* LEFT SLIDER */}
          <div className="w-full max-w-[400px] h-auto">
            <Slider
              {...sliderSettings}
              autoplaySpeed={3000}
              className="timeless-slider h-full"
            >
              {leftSliderData.map((img, i) => (
                <div key={i} className="cursor-pointer outline-none">
                  <div className="relative w-full h-[310px]">
                    <Image
                      src={img.url}
                      alt={`Deal ${i + 1}`}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* CENTER CONTENT */}
          <div className="w-full max-w-[400px] h-[320px] flex relative">
            <div className="hidden md:block absolute top-20 -left-5 h-0.5 w-15 bg-[#a2690f]"></div>
            <div className="hidden md:block absolute top-20 -right-5  h-0.5 w-15 bg-[#a2690f]"></div>
            <Link
              href={centerContent.buttonLink || "#"}
              className="flex w-full h-full border border-[#FFC107] rounded-2xl items-center justify-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="px-5 text-center md:px-8">
                {centerContent.label && (
                  <p className="text-[14px] font-[family-name:var(--font-montserrat)]  mb-4 text-black">
                    {centerContent.label}
                  </p>
                )}
                {centerContent.heading && (
                  <h2 className="text-[26px] lg:text-[30px] font-optima mb-4 text-[#6a3f07] leading-snug">
                    {centerContent.heading}
                  </h2>
                )}

                {centerContent.description && (
                  <div
                    className="text-[15px] text-black font-[family-name:var(--font-montserrat)] mb-4 max-w-xs mx-auto"
                    dangerouslySetInnerHTML={{
                      __html: centerContent.description,
                    }}
                  />
                )}
                {centerContent.buttonText && (
                  <span className="inline-block text-[16px] uppercase tracking-[0.2em] text-gray-800 border-y py-2 px-6 rounded border-gray-800 hover:text-[#cc8a00] hover:border-[#cc8a00] transition-colors">
                    View more
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* RIGHT SLIDER */}
          <div className="w-full max-w-[400px] h-auto">
            <Slider
              {...sliderSettings}
              autoplaySpeed={3500}
              className="timeless-slider h-full"
            >
              {rightSliderData.map((img, i) => (
                <div key={i} className="cursor-pointer outline-none">
                  <div className="relative w-full h-[310px]">
                    <Image
                      src={img.url}
                      alt={`Deal ${i + 1}`}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover rounded-lg"
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
