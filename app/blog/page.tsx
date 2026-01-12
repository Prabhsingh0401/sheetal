'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TopInfo from '../components/TopInfo';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Mock Data for Blogs List
const BLOGS = [
  {
    id: 'colour-trends-2025',
    title: 'Colour Trends in Sarees for 2025: Jewel Tones from Studio by Sheetal’s Festive Collection',
    date: 'December 31, 2024',
    image: '/assets/410718746.jpg',
    description: 'Colour Trends in Sarees for 2025: Jewel Tones from Studio by Sheetal’s Festive Collection',
    link: '/blog/colour-trends-2025'
  },
  {
    id: 'banarasi-saree-guide',
    title: 'What to Look for When Buying a Banarasi Saree Online',
    date: 'December 31, 2024',
    image: '/assets/484942625.jpg',
    description: 'What to Look for When Buying a Banarasi Saree Online',
    link: '/blog/banarasi-saree-guide'
  },
  {
    id: 'wedding-wardrobe-magic',
    title: 'How SBS Brings Banarasi Magic to Your Wedding Wardrobe',
    date: 'December 31, 2024',
    image: '/assets/823107476.jpg',
    description: 'How SBS Brings Banarasi Magic to Your Wedding Wardrobe',
    link: '/blog/wedding-wardrobe-magic'
  }
];

const BlogsPage = () => {
  return (
    <div className="font-[family-name:var(--font-montserrat)] bg-white">
      <TopInfo />
      <Navbar />

      {/* Banner */}
      <div className="relative w-full h-[300px] md:h-[400px] mt-[40px] md:mt-[75px] overflow-hidden">
        <Image
          src="/assets/690995222.jpg"
          alt="Blogs Banner"
          fill
          className="object-cover"
          priority
        />
      </div>
        <div className="flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-medium text-[#69460c] mb-2 mt-10 font-[family-name:var(--font-optima)]">Blogs</h1>
          <nav className="text-gray-600 text-sm md:text-base">
            <Link href="/" className="hover:text-[#f3bf43] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span>Blogs</span>
          </nav>
        </div>

      {/* Blogs Listing */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOGS.map((blog) => (
            <div key={blog.id} className="group flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <Link href={blog.link} className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-sm text-gray-500 mb-3 font-medium">
                  {blog.date}
                </div>
                
                <h3 className="text-lg font-semibold text-[#2c2c2c] mb-3 leading-snug font-[family-name:var(--font-optima)] line-clamp-2 group-hover:text-[#bd9951] transition-colors">
                  <Link href={blog.link}>{blog.title}</Link>
                </h3>
                
                <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-grow">
                  {blog.description}
                </p>
                
                <div>
                  <Link 
                    href={blog.link} 
                    className="inline-block text-sm font-medium text-black border-b border-black pb-0.5 hover:text-[#bd9951] hover:border-[#bd9951] transition-all"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination (Static for now) */}
        <div className="mt-12 flex justify-center">
           {/* Pagination logic can be added here later */}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogsPage;
