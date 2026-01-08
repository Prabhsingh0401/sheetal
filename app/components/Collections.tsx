'use client';

import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import Link from 'next/link';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Collections = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 900,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, arrows: false, dots: true } }
    ]
  };

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
      link: '/product-detail'
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
      link: '/product-detail'
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
      link: '/product-detail'
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
      link: '/product-detail'
    }
  ];

  return (
    <div
      className="container-fluid py-12 home-page-product font-[family-name:var(--font-montserrat)]"
    >
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-10">
              <div className="h-[1px] bg-[#68400f] flex-1"></div>
                <h2 className="text-[2rem] lg:text-[40px] font-medium text-[#5d4112] mb-2 whitespace-nowrap">
                  Collections
                </h2>
                <div className="h-[1px] bg-[#68400f] flex-1"></div>
          </div>
            <p className="text-center max-w-2xl text-lg">
              Best-Selling Gems: Signature sarees, ensembles, and Indo-Western pieces that define Studio By Sheetal.
            </p>
        </div>

        <Slider {...settings} className="-mx-2">
          {products.map(product => (
            <div key={product.id} className="px-2 pb-4">
              <div className="rounded-xl overflow-hidden group">

                {/* IMAGE BLOCK - Forced Aspect Ratio */}
                <div className="relative aspect-[3/4] overflow-hidden">

                  {/* SOLD OUT Badge - Positioned relative to IMAGE container */}
                  {product.soldOut && (
                    <div className="absolute -top-1 left-0 z-20">
                      <span className="bg-red-600 text-white text-[10px] px-2 py-1 uppercase font-bold tracking-wider rounded-br-lg">
                        SOLD OUT
                      </span>
                    </div>
                  )}

                  {/* HEART ICON - Positioned relative to IMAGE container */}
                  <div className="absolute top-3 right-3 z-30 rounded-full p-1.5 cursor-pointer transition-all">
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
                      className="w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0 rounded-xl"
                    />
                    <Image
                      src={product.hoverImage}
                      alt={product.name}
                      width={400}
                      height={533}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    />
                  </Link>
                </div>

                {/* CONTENT SECTION */}
                <div className="p-4 text-center">
                  <h6 className="mb-2 h-[40px] overflow-hidden flex items-center justify-center">
                    <Link href={product.link} className="text-[14px] text-black hover:text-[#B78D65] font-medium line-clamp-2 leading-tight">
                      {product.name}
                    </Link>
                  </h6>

                  {/* SIZE + RATING */}
                  <div className="mb-3 flex flex-col items-center">
                    <div className="text-xs text-gray-600 font-medium mb-1">
                      <span className="font-bold text-black">Size:</span> {product.size}
                    </div>
                    <div className="flex justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Image
                          key={i}
                          src="/assets/gray-star.png"
                          alt="star"
                          width={24}
                          height={24}
                        />
                      ))}
                    </div>
                  </div>

                  {/* PRICE SECTION */}
                  <div className="mb-4 flex justify-center items-center gap-2">
                    <span className="text-lg text-[#281b00] font-bold">{product.price}</span>
                    <span className="text-xs text-gray-400 line-through font-normal">{product.mrp}</span>
                    <span className="text-xs text-[#B78D65] font-bold">{product.discount}</span>
                  </div>

                  {/* ACTION BUTTON */}
                  <Link
                    href={product.link}
                    className="inline-block border-y border-black text-black font-normal py-2 px-8 uppercase transition-all duration-500 hover:text-black hover:tracking-[1px]"
                  >
                    View Product
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Collections;
