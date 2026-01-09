'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';

const NewArrivals = () => {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: 'start',
    skipSnaps: false,
  });

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
    <div className="container-fluid py-16 font-[family-name:var(--font-montserrat)]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-4 text-left">
            <h2 className="text-[2.5rem] lg:text-[45px] font-medium text-[#68400f] mb-4 font-[family-name:var(--font-optima)] leading-tight">
              New Arrivals
            </h2>

            <p className="text-[#555] text-lg lg:text-xl leading-relaxed mb-8">
              Pick your beauty products today. 50% OFF on the new brands. Order all classy products today!
            </p>

            <Link
              href="/about-us"
              className="inline-block border-y border-black text-black py-3 px-10 uppercase transition-all duration-500 hover:tracking-[2px]"
            >
              Explore More
            </Link>
          </div>

          {/* RIGHT – EMBLA CAROUSEL */}
          <div className="lg:col-span-8">
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex gap-4">

                {products.map((product) => (
                  <div
                    key={product.id}
                    className="
                      flex-shrink-0
                      w-[85%]
                      sm:w-[48%]
                      lg:w-[33.333%]
                    "
                  >
                    <div className="rounded-xl overflow-hidden group">

                      {/* IMAGE */}
                      <div className="relative aspect-[3/4] overflow-hidden">

                        {/* SOLD OUT */}
                        {product.soldOut && (
                          <div className="absolute -top-1 left-0 z-20">
                            <span className="bg-red-600 text-white text-[10px] px-2 py-1 uppercase font-bold rounded-br-lg">
                              SOLD OUT
                            </span>
                          </div>
                        )}

                        {/* HEART */}
                        <div className="absolute top-3 right-3 z-20 cursor-pointer rounded-full p-1.5">
                          <Image
                            src="/assets/icons/heart.svg"
                            width={18}
                            height={18}
                            alt="wishlist"
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
                            className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                          />
                        </Link>
                      </div>

                      {/* INFO */}
                      <div className="p-4 text-center">
                        <h6 className="mb-2 h-[40px] overflow-hidden flex items-center justify-center">
                          <Link
                            href={product.link}
                            className="text-[14px] text-black hover:text-[#B78D65] font-medium line-clamp-2"
                          >
                            {product.name}
                          </Link>
                        </h6>

                        <div className="flex flex-col items-center gap-1 mb-3">
                          <div className="text-xs text-gray-600">
                            <span className="font-bold text-black">Size:</span> {product.size}
                          </div>
                          <div className="flex gap-0.5">
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

                        <div className="flex justify-center items-center gap-2 mb-4">
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
          </div>

        </div>
      </div>
    </div>
  );
};

export default NewArrivals;