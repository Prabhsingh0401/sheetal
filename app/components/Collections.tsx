'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';

const Collections = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    skipSnaps: false,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const products = [
    {
      id: 1,
      name: 'Rama Green Zariwork Soft Silk Saree',
      image: '/assets/494291571.webp',
      hoverImage: '/assets/487339289.webp',
      price: '₹ 790.50',
      mrp: '₹ 850.00',
      discount: '7% OFF',
      size: 'L',
      soldOut: true,
      link: '/product-detail',
    },
    {
      id: 2,
      name: 'Mustard Zariwork Organza Fabric Readymade Salwar Suit',
      image: '/assets/590900458.webp',
      hoverImage: '/assets/789323917.webp',
      price: '₹ 790.50',
      mrp: '₹ 850.00',
      discount: '7% OFF',
      size: 'L',
      soldOut: false,
      link: '/product-detail',
    },
    {
      id: 3,
      name: 'Onion Pink Zariwork Tissue Saree',
      image: '/assets/670149944.webp',
      hoverImage: '/assets/882872675.webp',
      price: '₹ 790.50',
      mrp: '₹ 850.00',
      discount: '7% OFF',
      size: 'L',
      soldOut: false,
      link: '/product-detail',
    },
    {
      id: 4,
      name: 'Sky Blue Threadwork Semi Crepe Readymade Salwar Suit',
      image: '/assets/229013918.webp',
      hoverImage: '/assets/493323435.webp',
      price: '₹ 790.50',
      mrp: '₹ 850.00',
      discount: '7% OFF',
      size: 'L',
      soldOut: false,
      link: '/product-detail',
    },
  ];

  return (
    <div className="container-fluid py-12 home-page-product font-[family-name:var(--font-montserrat)]">
      <div className="container mx-auto px-4 py-10">

        {/* HEADING */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-10 w-full">
            <div className="h-[1px] bg-[#68400f] flex-1" />
            <h2 className="text-[2rem] lg:text-[40px] font-[family-name:var(--font-optima)] font-medium text-[#5d4112] whitespace-nowrap">
              Collections
            </h2>
            <div className="h-[1px] bg-[#68400f] flex-1" />
          </div>
          <p className="text-center max-w-2xl text-lg mt-2">
            Best-Selling Gems: Signature sarees, ensembles, and Indo-Western pieces that define Studio By Sheetal.
          </p>
        </div>

        {/* EMBLA CAROUSEL */}
        <div className="relative group/slider">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-4">

              {products.map((product) => (
                <div
                  key={product.id}
                  className="
                    flex-shrink-0
                    w-[85%]
                    sm:w-[48%]
                    md:w-[32%]
                    lg:w-[25%]
                  "
                >
                  <div className="rounded-xl overflow-hidden group">

                    {/* IMAGE */}
                    <div className="relative aspect-[3/4] overflow-hidden">

                      {/* SOLD OUT */}
                      {product.soldOut && (
                        <div className="absolute -top-1 left-0 z-20">
                          <span className="bg-red-600 text-white text-[10px] px-2 py-1 uppercase font-bold tracking-wider rounded-br-lg">
                            SOLD OUT
                          </span>
                        </div>
                      )}

                      {/* HEART ICON */}
                      <div className="absolute top-3 right-3 z-30 rounded-full p-1.5 cursor-pointer">
                        <Image
                          src="/assets/icons/heart.svg"
                          alt="Wishlist"
                          width={18}
                          height={18}
                        />
                      </div>

                      {/* PRODUCT IMAGES */}
                      <Link href={product.link} className="block h-full w-full relative">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={400}
                          height={533}
                          className="w-full h-full object-cover rounded-xl transition-opacity duration-700 group-hover:opacity-0"
                        />
                        <Image
                          src={product.hoverImage}
                          alt={product.name}
                          width={400}
                          height={533}
                          className="absolute inset-0 w-full h-full rounded-xl object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                        />
                      </Link>
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 text-center">
                      <h6 className="mb-2 h-[40px] overflow-hidden flex items-center justify-center">
                        <Link
                          href={product.link}
                          className="text-[14px] text-black hover:text-[#B78D65] font-medium line-clamp-2 leading-tight"
                        >
                          {product.name}
                        </Link>
                      </h6>

                      <div className="mb-3 flex flex-col items-center">
                        <div className="text-xs text-gray-600 font-medium mb-1">
                          <span className="font-bold text-black">Size:</span> {product.size}
                        </div>
                        <div className="flex justify-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Image
                              key={i}
                              src="/assets/gray-star.png"
                              alt="star"
                              width={20}
                              height={20}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mb-4 flex justify-center items-center gap-2">
                        <span className="text-lg text-[#281b00] font-bold">
                          {product.price}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          {product.mrp}
                        </span>
                        <span className="text-xs text-[#B78D65] font-bold">
                          {product.discount}
                        </span>
                      </div>

                      <Link
                        href={product.link}
                        className="inline-block border-y border-black text-black py-2 px-8 uppercase transition-all duration-500 hover:tracking-[1px]"
                      >
                        View Product
                      </Link>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Nav Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-[-15px] top-[30%] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10 hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-[-15px] top-[30%] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10 hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Collections;