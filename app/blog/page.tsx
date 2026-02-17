"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import TopInfo from "../components/TopInfo";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getBlogs, Blog } from "@/app/services/blogService";
import { getApiImageUrl } from "@/app/services/api";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await getBlogs({ page, limit: 9 });
        if (response.success) {
          setBlogs(response.blogs);
          setTotalPages(response.pages);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page]);

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
        <h1 className="text-4xl md:text-5xl font-medium text-[#69460c] mb-2 mt-10 font-[family-name:var(--font-optima)]">
          Blogs
        </h1>
        <nav className="text-gray-600 text-sm md:text-base">
          <Link href="/" className="hover:text-[#f3bf43] transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>Blogs</span>
        </nav>
      </div>

      {/* Blogs Listing */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="bg-gray-200 h-52 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 w-1/4 rounded"></div>
                  <div className="bg-gray-200 h-6 w-full rounded"></div>
                  <div className="bg-gray-200 h-12 w-full rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="group flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <Link
                  href={`/blog/${blog.slug}`}
                  className="relative w-full aspect-video overflow-hidden"
                >
                  <Image
                    src={getApiImageUrl(
                      blog.contentImage || blog.bannerImage,
                      "/assets/default-image.png",
                    )}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-sm text-gray-500 mb-3 font-medium">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  <h3 className="text-lg font-semibold text-[#2c2c2c] mb-3 leading-snug font-[family-name:var(--font-optima)] line-clamp-2 group-hover:text-[#bd9951] transition-colors">
                    <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                  </h3>

                  <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-grow">
                    {blog.excerpt}
                  </p>

                  <div>
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="inline-block text-sm font-medium text-black border-b border-black pb-0.5 hover:text-[#bd9951] hover:border-[#bd9951] transition-all"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-12 flex justify-center items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-100 rounded-md text-sm font-semibold disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-100 rounded-md text-sm font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogsPage;
