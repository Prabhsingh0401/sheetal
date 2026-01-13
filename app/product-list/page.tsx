'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FilterSortMobile from './components/FilterSortMobile';
import MobileSortSheet from './components/MobileSortSheet';
import TopInfo from '../components/TopInfo';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductList = () => {
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false); // Placeholder for now if bar is added later

  const handleMobileSort = (option: string) => {
    console.log("Sorting by:", option);
    setMobileSortOpen(false);
  };

  return (
    <>
      <TopInfo />
      <Navbar />
      
      {/* Banner */}
      <div className="relative mt-[87px] mb-[65px] text-center">
         <div className="relative h-[200px] md:h-[360px] w-full">
            <Image 
               src="/assets/254852228.jpg" 
               alt="Category Banner" 
               fill
               className="object-cover"
            />
         </div>
         <div className="absolute bottom-0 w-full border-b border-[#ffcf8c] pb-2 bg-white/80 md:bg-transparent">
            <h1 className="font-[family-name:var(--font-optima)] text-[35px] text-[#6a3f07] font-normal">Saree</h1>
            <div className="text-[#6a3f07] text-sm">
               <Link href="/" className="hover:text-[#9c6000]">Home</Link> / Saree
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
         <div className="text-center mb-10">
            <h2 className="font-[family-name:var(--font-optima)] text-[30px] md:text-[39px] text-[#6a3f07] mb-4 relative inline-block">
               The Best of Luxury
            </h2>
            <p className="text-gray-600">Get styled with the high-fashion products and transform yourself. Trending Trending Products</p>
         </div>

         {/* Products Grid - Placeholder for now */}
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* ... Products will go here ... */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
               <div key={item} className="border border-gray-100 rounded-lg p-4">
                  <div className="relative aspect-[3/4] bg-gray-100 mb-4">
                     {/* Product Image Placeholder */}
                  </div>
                  <h3 className="font-medium text-sm mb-2">Product Name {item}</h3>
                  <p className="font-bold">₹ 1,299</p>
               </div>
            ))}
         </div>
      </div>

      <Footer />
      
      {/* Mobile Sticky Filter/Sort Footer */}
      <FilterSortMobile 
        onFilterClick={() => setFiltersOpen(true)} // Placeholder action
        onSortClick={() => setMobileSortOpen(true)} 
      />

      <MobileSortSheet 
        isOpen={mobileSortOpen} 
        onClose={() => setMobileSortOpen(false)} 
        onSelect={handleMobileSort} 
      />
    </>
  );
};

export default ProductList;