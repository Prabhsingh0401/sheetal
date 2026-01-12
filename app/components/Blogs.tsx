"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Blogs = () => {
  return (
    <div className="w-full py-16 md:py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-[40px] font-medium text-[#d18702] font-[family-name:var(--font-optima)] relative inline-block">
            Latest Articles & Blogs
            {/* Decorative lines similar to CSS h2:after/before if needed, but keeping simple for now as per specific CSS observation */}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column: Featured Blog */}
          <div className="flex flex-col">
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg mb-6 group">
              {/* Using Image component instead of background for better performance */}
              <Link href="/blog/banarasi-saree-guide">
                <Image
                  src="/assets/484942625.jpg"
                  alt="Banarasi Saree"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-500 mb-2 font-medium">December 31, 2024</div>
              <h3 className="text-xl lg:text-2xl font-medium text-[#333] mb-4 font-[family-name:var(--font-optima)] leading-tight">
                <Link href="/blog/banarasi-saree-guide" className="hover:text-[#d18702] transition-colors">
                  What to Look for When Buying a Banarasi Saree Online
                </Link>
              </h3>
              <Link
                href="/blog/banarasi-saree-guide"
                className="inline-block border-y border-black text-black font-normal py-2 px-8 uppercase transition-all duration-500 hover:text-black hover:tracking-[2px] text-sm"
              >
                Explore More
              </Link>
            </div>
          </div>

          {/* Right Column: Blog List */}
          <div className="flex flex-col gap-8 lg:gap-10">
            
            {/* Blog Item 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7">
                 <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg group">
                    <Link href="/blog/wedding-wardrobe-magic">
                      <Image
                        src="/assets/823107476.jpg"
                        alt="Wedding Wardrobe"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>
                 </div>
              </div>
              <div className="md:col-span-5">
                <div className="text-sm text-gray-500 mb-2 font-medium">December 31, 2024</div>
                <h4 className="text-lg font-medium text-[#333] mb-4 font-[family-name:var(--font-optima)] leading-tight">
                  <Link href="/blog/wedding-wardrobe-magic" className="hover:text-[#d18702] transition-colors">
                    How SBS Brings Banarasi Magic to Your Wedding Wardrobe
                  </Link>
                </h4>
                <Link
                  href="/blog/wedding-wardrobe-magic"
                  className="inline-block border-y border-black text-black font-normal py-1 px-4 uppercase transition-all duration-500 hover:text-black hover:tracking-[2px] text-xs"
                >
                  Explore more
                </Link>
              </div>
            </div>

            {/* Blog Item 2 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7">
                 <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg group">
                    <Link href="/blog/colour-trends-2025">
                      <Image
                        src="/assets/410718746.jpg"
                        alt="Colour Trends"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>
                 </div>
              </div>
              <div className="md:col-span-5">
                <div className="text-sm text-gray-500 mb-2 font-medium">December 31, 2024</div>
                <h4 className="text-lg font-medium text-[#333] mb-4 font-[family-name:var(--font-optima)] leading-tight">
                  <Link href="/blog/colour-trends-2025" className="hover:text-[#d18702] transition-colors">
                    Colour Trends in Sarees for 2025: Jewel Tones from Studio by Sheetal’s Festive Collection
                  </Link>
                </h4>
                <Link
                  href="/blog/colour-trends-2025"
                  className="inline-block border-y border-black text-black font-normal py-1 px-4 uppercase transition-all duration-500 hover:text-black hover:tracking-[2px] text-xs"
                >
                  Explore more
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Blogs;

