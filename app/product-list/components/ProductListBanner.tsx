'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductListBannerProps {
  title?: string;
}

const ProductListBanner: React.FC<ProductListBannerProps> = ({ title = "Collection" }) => {
  return (
    <>
      {/* Breadcrumb / Banner Section */}
      <div className="relative w-full h-[60vh] md:h-[95vh] overflow-hidden mt-[40px] md:mt-[75px]">
        <Image
          src="/assets/254852228.jpg"
          alt="Product List Banner"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      <div className="flex flex-col items-center justify-center text-[#694708] mt-10">
          <h1 className="text-4xl md:text-6xl font-light mb-4 font-[family-name:var(--font-optima)] uppercase tracking-wider">{title}</h1>
          <nav className="text-sm font-light uppercase tracking-widest flex items-center gap-2">
            <Link href="/" className="hover:text-[#f3bf43] transition-colors">Home</Link>
            <span className="text-[#f3bf43]">/</span>
            <span className="">{title}</span>
          </nav>
      </div>

      {/* Category Description */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light mb-6 text-[#1a1a1a] font-[family-name:var(--font-outfit)] uppercase tracking-[0.2em]">The Best of Luxury</h2>
          <div className="w-20 h-px bg-[#bd9951] mx-auto mb-6"></div>
          <p className="text-gray-500 font-light leading-relaxed text-lg">
            Explore our exclusive {title.toLowerCase()} collection. Get styled with the high-fashion products and transform yourself.
          </p>
        </div>
      </div>
    </>
  );
};

export default ProductListBanner;
