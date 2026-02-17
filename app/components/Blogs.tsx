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

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Show loading state or fallback to static content if no blogs
  if (loading) {
    return (
      <div className="w-full py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-[40px] font-medium text-[#d18702] font-[family-name:var(--font-optima)] relative inline-block">
              Latest Articles & Blogs
            </h2>
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

  // If no blogs from API, show static content as fallback
  if (blogs.length === 0) {
    return (
      <div className="w-full py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-[40px] font-medium text-[#d18702] font-[family-name:var(--font-optima)] relative inline-block">
              Latest Articles & Blogs
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column: Featured Blog */}
            <div className="flex flex-col">
              <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg mb-6 group">
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
                <div className="text-sm text-gray-500 mb-2 font-medium">
                  December 31, 2024
                </div>
                <h3 className="text-xl lg:text-2xl font-medium text-[#333] mb-4 font-[family-name:var(--font-optima)] leading-tight">
                  <Link
                    href="/blog/banarasi-saree-guide"
                    className="hover:text-[#d18702] transition-colors"
                  >
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
                  <div className="text-sm text-gray-500 mb-2 font-medium">
                    December 31, 2024
                  </div>
                  <h4 className="text-lg font-medium text-[#333] mb-4 font-[family-name:var(--font-optima)] leading-tight">
                    <Link
                      href="/blog/wedding-wardrobe-magic"
                      className="hover:text-[#d18702] transition-colors"
                    >
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
                  <div className="text-sm text-gray-500 mb-2 font-medium">
                    December 31, 2024
                  </div>
                  <h4 className="text-lg font-medium text-[#333] mb-4 font-[family-name:var(--font-optima)] leading-tight">
                    <Link
                      href="/blog/colour-trends-2025"
                      className="hover:text-[#d18702] transition-colors"
                    >
                      Colour Trends in Sarees for 2025: Jewel Tones from Studio
                      by Sheetal's Festive Collection
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
  }

  // Render blogs from API
  const [featuredBlog, ...otherBlogs] = blogs;

  return (
    <div className="w-full py-16 md:py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-[40px] font-medium text-[#d18702] font-[family-name:var(--font-optima)] relative inline-block">
            Latest Articles & Blogs
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Featured Blog */}
          {featuredBlog && (
            <div className="flex flex-col">
              <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg mb-6 group">
                <Link href={`/blog/${featuredBlog.slug}`}>
                  <Image
                    src={getBlogImageUrl(featuredBlog)}
                    alt={featuredBlog.imageAlt || featuredBlog.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
              </div>
              <div className="text-left">
                <div className="text-sm text-gray-500 mb-2 font-medium">
                  {formatDate(featuredBlog.createdAt)}
                </div>
                <h3 className="text-xl lg:text-2xl font-medium text-[#333] mb-4 font-[family-name:var(--font-optima)] leading-tight">
                  <Link
                    href={`/blog/${featuredBlog.slug}`}
                    className="hover:text-[#d18702] transition-colors"
                  >
                    {featuredBlog.title}
                  </Link>
                </h3>
                <Link
                  href={`/blog/${featuredBlog.slug}`}
                  className="inline-block border-y border-black text-black font-normal py-2 px-8 uppercase transition-all duration-500 hover:text-black hover:tracking-[2px] text-sm"
                >
                  Explore More
                </Link>
              </div>
            </div>
          )}

          {/* Right Column: Blog List */}
          <div className="flex flex-col gap-8 lg:gap-10">
            {otherBlogs.map((blog) => (
              <div
                key={blog._id}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
              >
                <div className="md:col-span-7">
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg group">
                    <Link href={`/blog/${blog.slug}`}>
                      <Image
                        src={getBlogImageUrl(blog)}
                        alt={blog.imageAlt || blog.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>
                  </div>
                </div>
                <div className="md:col-span-5">
                  <div className="text-sm text-gray-500 mb-2 font-medium">
                    {formatDate(blog.createdAt)}
                  </div>
                  <h4 className="text-lg font-medium text-[#333] mb-4 font-[family-name:var(--font-optima)] leading-tight">
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="hover:text-[#d18702] transition-colors"
                    >
                      {blog.title}
                    </Link>
                  </h4>
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="inline-block border-y border-black text-black font-normal py-1 px-4 uppercase transition-all duration-500 hover:text-black hover:tracking-[2px] text-xs"
                  >
                    Explore more
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
