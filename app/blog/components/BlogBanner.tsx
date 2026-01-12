'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogBannerProps {
  title: string;
  image: string;
}

const BlogBanner: React.FC<BlogBannerProps> = ({ title, image }) => {
  return (
  <>
    <div className="relative w-full h-[400px] md:h-[500px] mt-[40px] md:mt-[75px] overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      </div>
      <div>
      <div className="flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-medium text-[#69460c] mb-4 mt-10 font-[family-name:var(--font-optima)] max-w-4xl leading-tight">
          {title}
        </h1>
        <nav className="text-sm md:text-base text-gray-600 font-light tracking-wide">
          <ul className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-[#f3bf43] transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/blogs" className="hover:text-[#f3bf43] transition-colors">Blogs</Link></li>
            <li>/</li>
            <li className="line-clamp-1 max-w-[200px] md:max-w-none">{title}</li>
          </ul>
        </nav>
      </div>
    </div>
  </>
  );
};

export default BlogBanner;
