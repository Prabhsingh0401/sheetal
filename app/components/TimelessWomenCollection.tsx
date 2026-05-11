"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
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
  const [leftImages, setLeftImages] = useState<{ url: string }[]>([]);
  const [rightImages, setRightImages] = useState<{ url: string }[]>([]);
  const [centerContent, setCenterContent] = useState(DEFAULT_CENTER);
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);

  useEffect(() => {
    const fetchLookbook = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/lookbooks/timeless-women`);
        const data = await res.json();
        if (data.success && data.lookbook) {
          setLeftImages(data.lookbook.leftSliderImages || []);
          setRightImages(data.lookbook.rightSliderImages || []);
          if (data.lookbook.centerContent) {
            setCenterContent({
              ...DEFAULT_CENTER,
              ...data.lookbook.centerContent,
            });
          }
        }
      } catch {
        // Keep fallback content.
      }
    };

    fetchLookbook();
  }, []);

  const defaultImages = [
    "/assets/deals1.jpg",
    "/assets/deals2.jpg",
    "/assets/deals3.jpg",
  ];

  const leftSliderData =
    leftImages.length > 0 ? leftImages : defaultImages.map((url) => ({ url }));
  const rightSliderData =
    rightImages.length > 0 ? rightImages : defaultImages.map((url) => ({ url }));

  useEffect(() => {
    if (leftSliderData.length <= 1) return;
    const intervalId = window.setInterval(() => {
      setLeftIndex((current) => (current + 1) % leftSliderData.length);
    }, 3000);
    return () => window.clearInterval(intervalId);
  }, [leftSliderData.length]);

  useEffect(() => {
    if (rightSliderData.length <= 1) return;
    const intervalId = window.setInterval(() => {
      setRightIndex((current) => (current + 1) % rightSliderData.length);
    }, 3500);
    return () => window.clearInterval(intervalId);
  }, [rightSliderData.length]);

  return (
    <div className="flex w-full justify-center bg-[#fbfbfb] px-4 py-6 sm:px-6">
      <div className="container px-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch justify-items-center">
          <div className="w-full max-w-[400px] h-auto">
            <div className="timeless-slider h-full overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translate3d(-${leftIndex * 100}%, 0, 0)` }}
              >
                {leftSliderData.map((img, i) => (
                  <div key={i} className="min-w-full cursor-pointer outline-none">
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
              </div>
            </div>
          </div>

          <div className="w-full max-w-[400px] h-[320px] flex relative">
            <div className="hidden md:block absolute top-20 -left-5 h-0.5 w-15 bg-[#a2690f]" />
            <div className="hidden md:block absolute top-20 -right-5 h-0.5 w-15 bg-[#a2690f]" />
            <Link
              href={centerContent.buttonLink || "#"}
              className="flex w-full h-full border border-[#FFC107] rounded-2xl items-center justify-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="px-5 text-center md:px-8">
                {centerContent.label && (
                  <p className="text-[14px] font-[family-name:var(--font-montserrat)] mb-4 text-black">
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

          <div className="w-full max-w-[400px] h-auto">
            <div className="timeless-slider h-full overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translate3d(-${rightIndex * 100}%, 0, 0)` }}
              >
                {rightSliderData.map((img, i) => (
                  <div key={i} className="min-w-full cursor-pointer outline-none">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelessWomenCollection;
