"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { API_BASE_URL } from "../services/api";

const MIN_FOR_CAROUSEL_DESKTOP = 5;
const MIN_FOR_CAROUSEL_MOBILE  = 2;

const fallbackImages = [
  "/assets/i1.webp",
  "/assets/i2.webp",
  "/assets/i3.webp",
  "/assets/i4.webp",
  "/assets/i5.webp",
];

interface InstaCard {
  url: string;
  link: string | null;
  alt: string | null;
}

const InstagramDiaries = () => {
  const [cards, setCards] = useState<InstaCard[]>(
    fallbackImages.map((url) => ({ url, link: null, alt: null })),
  );
  const [isCarousel, setIsCarousel] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [emblaApi, cards]);

  // Recompute isCarousel on cards change and window resize
  useEffect(() => {
    const update = () => {
      const isMobile = window.innerWidth < 768;
      const min = isMobile ? MIN_FOR_CAROUSEL_MOBILE : MIN_FOR_CAROUSEL_DESKTOP;
      setIsCarousel(cards.length >= min);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [cards]);

  useEffect(() => {
    const fetchInstaCards = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/instacards`);
        const data = await response.json();
        if (data.success && data.cards?.length > 0) {
          setCards(data.cards);
        }
      } catch (error) {
        console.error("Error fetching insta cards:", error);
      }
    };
    fetchInstaCards();
  }, []);

  const CardItem = ({ card, index }: { card: InstaCard; index: number }) => (
    <Link
      href={card.link || "#"}
      target={card.link ? "_blank" : undefined}
      rel={card.link ? "noopener noreferrer" : undefined}
    >
      <div className="relative overflow-hidden rounded-xl shadow-md group cursor-pointer aspect-[3/4]">
        <Image
          src={card.url}
          alt={card.alt || `Instagram Post ${index + 1}`}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/60 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <i className="fab fa-instagram text-white text-3xl drop-shadow-lg" />
        </div>
      </div>
    </Link>
  );

  return (
    <div className="relative w-full py-16 md:py-20 bg-[#f9f9f9] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/845146398.jpg"
          alt="Background"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-white/60" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-[26px] md:text-4xl lg:text-5xl font-normal text-[#6a3f07] mb-1 font-[family-name:var(--font-optima)]">
            Visit Our Instagram Diaries
          </h2>
          <p className="text-[#666] text-[15px] md:text-lg tracking-wide">
            Follow To Know More @sbsinstagram
          </p>
        </div>

        {/* CAROUSEL */}
        {isCarousel ? (
          <div className="relative group/slider">
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex gap-4 px-4 md:gap-8">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className="shrink-0 w-[75%] sm:w-[45%] lg:w-[20%]"
                  >
                    <CardItem card={card} index={index} />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={scrollPrev}
              aria-label="Previous"
              className="absolute left-[-15px] cursor-pointer top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10 hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next"
              className="absolute right-[-15px] cursor-pointer top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10 hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        ) : (
          /* STATIC GRID */
          <div className="flex flex-wrap gap-4 md:gap-8 justify-center">
            {cards.map((card, index) => (
              <div
                key={index}
                className="w-[85%] sm:w-[45%] md:w-[30%] lg:w-[18%]"
              >
                <CardItem card={card} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstagramDiaries;