'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutSBS = () => {
  return (
    <div className="container mx-auto pt-12 pb-12 relative home-page-why px-4 overflow-x-clip">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-0">
        <div className="lg:col-span-1">
          <div className="h-full flex flex-col justify-center items-center lg:items-start">
            <div className="flex items-center gap-4 mb-2 w-full">
              <h2 className="text-[1.5rem] md:text-[2rem] lg:text-[40px] font-light text-[#68400f] font-[family-name:var(--font-outfit)] whitespace-nowrap">About SBS</h2>
            </div>
            <h3 className="text-[1.25rem] md:text-[1.75rem] lg:text-[28px] font-medium text-[#916e44] font-[family-name:var(--font-outfit)] text-center lg:text-left">Innovate the Outfit</h3>
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0">
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative inline-block">
                <Image 
                  src="/assets/990320548.png" 
                  alt="About SBS" 
                  width={500} 
                  height={500} 
                  className="max-w-full h-auto"
                />
                <Image 
                  src="/assets/roud-img.png" 
                  className="absolute bottom-4 -right-0 md:bottom-9 md:-right-[60px] animate-[circle_6s_linear_infinite] w-[100px] h-[100px] md:w-[150px] md:h-[150px]" 
                  alt="Decoration"
                  width={150}
                  height={150}
                />
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="w-full lg:w-[92%] mx-auto mt-1 text-center lg:text-right flex flex-col justify-center h-full">
                <div className="mb-8 lg:mb-[50px]">
                  <p className="text-[16px] md:text-[20px] font-normal leading-relaxed md:leading-8 font-[family-name:var(--font-montserrat)] px-2 lg:px-0">
                    Studio By Sheetal: a designer studio passionate about timeless elegance. Sheetal crafts exquisite sarees, suits, and Indo-Western outfits with meticulous attention to detail, luxurious fabrics, and contemporary flair. Each piece blends traditional charm with modern silhouettes, tailored to celebrate individuality.
                  </p>
                </div>
                <div className="flex justify-center lg:justify-end">
                  <Link href="/about-us" className="inline-block border-y border-black text-black font-normal py-2 px-8 uppercase transition-all duration-500 hover:text-black hover:tracking-[2px]">
                    Explore More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes circle {
          0%{
            transform: rotate(0deg);
          } 100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AboutSBS;
