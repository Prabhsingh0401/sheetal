'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';

const HiddenBeauty = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    dragFree: false,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const categories = [
    { id: 1, name: 'Sarees', image: '/assets/962929746.jpg', link: '/category/sarees' },
    { id: 2, name: 'Salwar Suits', image: '/assets/719585197.jpg', link: '/category/salwar-suits' },
    { id: 3, name: 'Lehengas', image: '/assets/949994952.jpg', link: '/category/lehengas' },
    { id: 4, name: 'Sarees', image: '/assets/962929746.jpg', link: '/category/sarees' },
    { id: 5, name: 'Salwar Suits', image: '/assets/719585197.jpg', link: '/category/salwar-suits' },
  ];

  return (
    <div className="container mx-auto py-12 px-4 text-center font-[family-name:var(--font-optima)]">
      <h2 className="text-[1.5rem] lg:text-[40px] font-medium text-[#5d4112] mb-2">
        Bring Out The Hidden Beauty
      </h2>
      <p className="max-w-2xl mx-auto text-[16px] lg:text-[18px] font-semibold mb-8">
        Designer pieces that blend traditional charm with modern silhouettes for every occasion.
      </p>

      {/* Embla Wrapper */}
      <div className="relative group/slider">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="
                  flex-shrink-0
                  w-[85%]
                  sm:w-[45%]
                  lg:w-[20%]
                "
              >
                <div className="relative rounded-[22px] overflow-hidden group">
                  <Link href={cat.link} className="block">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      width={400}
                      height={600}
                      className="w-full h-[420px] object-cover"
                    />
                  </Link>

                  <Link
                    href={cat.link}
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
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-[-15px] top-[50%] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10 hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HiddenBeauty;