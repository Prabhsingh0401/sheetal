"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getBlogs, getBlogImageUrl, Blog } from "../services/blogService";

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await getBlogs({ limit: 3, page: 1 });
        if (response.success && response.blogs) {
          setBlogs(response.blogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="w-full pb-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4">
              <span className="block w-12 h-px bg-[#6a3f07]" />
              <h2 className="text-[26px] lg:text-[40px] font-normal text-[#6a3f07] font-[family-name:var(--font-optima)]">
                Latest Articles & Blogs
              </h2>
              <span className="block w-12 h-px bg-[#6a3f07]" />
            </div>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#d18702] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="w-full py-16 md:py-24 relative border-t border-[#6a3f07]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4">
              <span className="block w-12 h-px bg-[#6a3f07]" />
              <h2 className="text-[26px] lg:text-[40px] font-normal text-[#6a3f07] font-[family-name:var(--font-optima)]">
                Latest Articles & Blogs
              </h2>
              <span className="block w-12 h-px bg-[#6a3f07]" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-4">
            {/* Left: Featured */}
            <div className="relative w-full group pb-24">
              <div className="relative w-full h-[420px] md:h-[540px] overflow-hidden rounded-lg">
                <Link href="/blog/banarasi-saree-guide" className="block w-full h-full">
                  <Image
                    src="/assets/484942625.jpg"
                    alt="Banarasi Saree"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
              </div>
              <div className="absolute bottom-0 left-4 right-4 md:left-8 md:right-8 bg-white shadow-lg rounded-lg p-5 z-10 translate-y-1/3">
                <div className="text-xs text-gray-500 mb-2 font-medium">December 31, 2024</div>
                <h3 className="text-lg lg:text-xl font-medium text-[#333] mb-4 font-[family-name:var(--font-optima)] leading-snug">
                  <Link href="/blog/banarasi-saree-guide" className="hover:text-[#d18702] transition-colors">
                    What to Look for When Buying a Banarasi Saree Online
                  </Link>
                </h3>
                <div className="w-16 h-px bg-gray-300 mb-3" />
                <Link
                  href="/blog/banarasi-saree-guide"
                  className="inline-block text-[11px] uppercase tracking-widest text-gray-700 border-b border-gray-700 pb-0.5 hover:text-[#d18702] hover:border-[#d18702] transition-colors"
                >
                  Explore More
                </Link>
              </div>
            </div>

            {/* Right: Blog list */}
            <div className="flex flex-col gap-10 mt-8 lg:mt-0">
              {[
                {
                  href: "/blog/wedding-wardrobe-magic",
                  src: "/assets/823107476.jpg",
                  alt: "Wedding Wardrobe",
                  date: "December 31, 2024",
                  title: "How SBS Brings Banarasi Magic to Your Wedding Wardrobe",
                },
                {
                  href: "/blog/colour-trends-2025",
                  src: "/assets/410718746.jpg",
                  alt: "Colour Trends",
                  date: "December 31, 2024",
                  title: "Colour Trends in Sarees for 2025: Jewel Tones from Studio by Sheetal's Festive Collection",
                },
              ].map((blog, i) => (
                <div key={i} className="relative flex items-stretch min-h-[200px]">
                  <div className="relative w-[62%] shrink-0 overflow-hidden rounded-lg">
                    <Link href={blog.href} className="block w-full h-full">
                      <Image
                        src={blog.src}
                        alt={blog.alt}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </Link>
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[52%] bg-white shadow-md rounded-lg p-4 z-10">
                    <div className="text-xs text-gray-500 mb-1 font-medium">{blog.date}</div>
                    <h4 className="text-sm lg:text-base font-medium text-[#333] mb-3 font-[family-name:var(--font-optima)] leading-snug">
                      <Link href={blog.href} className="hover:text-[#d18702] transition-colors">
                        {blog.title}
                      </Link>
                    </h4>
                    <div className="w-16 h-px bg-gray-300 mb-3" />
                    <Link
                      href={blog.href}
                      className="inline-block text-[11px] uppercase tracking-widest text-gray-700 border-b border-gray-700 pb-0.5 hover:text-[#d18702] hover:border-[#d18702] transition-colors"
                    >
                      Explore More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [featuredBlog, ...otherBlogs] = blogs;

  return (
    <div className="w-full pb-16 pt-8 md:py-24 relative border-t border-[#6a3f07]">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4">
            <span className="block w-12 h-px bg-[#6a3f07]" />
            <h2 className="text-[26px] lg:text-[40px] font-normal text-[#6a3f07] font-[family-name:var(--font-optima)]">
              Latest Articles & Blogs
            </h2>
            <span className="block w-12 h-px bg-[#6a3f07]" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-4">

          {/* Left: Featured blog — white card overlapping bottom */}
          {featuredBlog && (
            <div className="relative w-full group pb-24">
              <div className="relative w-full h-[420px] md:h-[540px] overflow-hidden rounded-lg">
                <Link href={`/blog/${featuredBlog.slug}`} className="block w-full h-full">
                  <Image
                    src={getBlogImageUrl(featuredBlog)}
                    alt={featuredBlog.imageAlt || featuredBlog.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
              </div>
              {/* White card */}
              <div className="absolute bottom-0 left-4 right-4 md:left-8 md:right-8 bg-white shadow-lg rounded-lg p-5 z-10 translate-y-1/3">
                <div className="text-xs text-gray-500 mb-2 font-medium">
                  {formatDate(featuredBlog.createdAt)}
                </div>
                <h3 className="text-lg lg:text-xl font-medium text-[#333] mb-4 font-[family-name:var(--font-optima)] leading-snug">
                  <Link
                    href={`/blog/${featuredBlog.slug}`}
                    className="hover:text-[#d18702] transition-colors"
                  >
                    {featuredBlog.title}
                  </Link>
                </h3>
                <div className="w-16 h-px bg-gray-300 mb-3" />
                <Link
                  href={`/blog/${featuredBlog.slug}`}
                  className="inline-block text-[11px] uppercase tracking-widest text-gray-700 border-b border-gray-700 pb-0.5 hover:text-[#d18702] hover:border-[#d18702] transition-colors"
                >
                  Explore More
                </Link>
              </div>
            </div>
          )}

          {/* Right: Blog list — image left, white card overlapping right */}
          <div className="flex flex-col gap-10 mt-8 lg:mt-0">
            {otherBlogs.map((blog) => (
              <div key={blog._id} className="relative flex items-stretch min-h-[200px]">

                {/* Image */}
                <div className="relative w-[62%] shrink-0 overflow-hidden rounded-lg">
                  <Link href={`/blog/${blog.slug}`} className="block w-full h-full">
                    <Image
                      src={getBlogImageUrl(blog)}
                      alt={blog.imageAlt || blog.title}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </Link>
                </div>

                {/* White card overlapping from right */}
                <div className="absolute right-0 top-4/5 -translate-y-1/2 w-[52%] bg-white/90 shadow-md rounded-lg p-4 z-10">
                  <div className="text-xs text-gray-500 mb-1 font-medium">
                    {formatDate(blog.createdAt)}
                  </div>
                  <h4 className="text-sm lg:text-base font-medium text-[#333] mb-3 font-[family-name:var(--font-optima)] leading-snug">
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="hover:text-[#d18702] transition-colors"
                    >
                      {blog.title}
                    </Link>
                  </h4>
                  <div className="w-16 h-px bg-gray-300 mb-3" />
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="inline-block text-[11px] uppercase tracking-widest text-gray-700 border-b border-gray-700 pb-0.5 hover:text-[#d18702] hover:border-[#d18702] transition-colors"
                  >
                    Explore More
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Blogs;