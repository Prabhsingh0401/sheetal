"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Category,
  fetchCategoryBySlug,
  getCategoryBannerUrl,
} from "../../services/categoryService";

interface ProductListBannerProps {
  categorySlug?: string;
}

const ProductListBanner: React.FC<ProductListBannerProps> = ({
  categorySlug,
}) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(!!categorySlug);
  const [error, setError] = useState<string | null>(null);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    console.log("Scroll triggered");
    element?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (!categorySlug) {
      setLoading(false);
      return;
    }

    const loadCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCategoryBySlug(categorySlug);
        if (!data) {
          setError("Category not found");
        } else {
          setCategory(data);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load category";
        setError(errorMessage);
        console.error("Error loading category:", err);
      } finally {
        setLoading(false);
        setTimeout(() => handleScroll("category-scroll"), 100);
      }
    };

    loadCategory();
  }, [categorySlug]);

  // Use category data if available, otherwise fallback to defaults
  const bannertext = category?.categoryBanner || "";
  const title = category?.name || "Collection";
  const description =
    category?.description ||
    `Explore our exclusive ${title.toLowerCase()} collection. Get styled with the high-fashion products and transform yourself.`;
  const bannerImage = getCategoryBannerUrl(category || undefined);

  if (loading) {
    return (
      <div>
        <div className="relative w-full h-[60vh] md:h-[95vh] overflow-hidden mt-[40px] md:mt-[75px] bg-gray-200 animate-pulse" />
        <div className="flex flex-col items-center justify-center text-[#694708] mt-10 h-20" />
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb / Banner Section */}
      <div className="relative w-full h-[60vh] md:h-[95vh] overflow-hidden mt-[40px] md:mt-[75px]">
        <Image
          src={bannerImage}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Logo Overlay */}
        <div className="absolute inset-0 z-10 flex items-start py-10 justify-center pointer-events-none">
          <Link href="/" className="pointer-events-auto">
            <Image
              src="/assets/625030871.png"
              alt="Studio By Sheetal"
              width={300}
              height={100}
              className="w-auto h-[160px] md:h-[260px]"
            />
          </Link>
        </div>
      </div>

      <div
        id="category-scroll"
        className="scroll-mt-30 flex flex-col items-center justify-center text-[#694708] mt-10 pb-6 border-b border-[#ffcf8c]"
      >
        <h1 className="text-4xl md:text-[29px] font-medium text-[#6a3f07] font-light mb-2 font-[family-name:var(--font-optima)] tracking-normal">
          {title}
        </h1>
        <nav className="text-md font-light tracking-widest flex items-center gap-3">
          <Link href="/">Home</Link>
          <span className="text-[#f3bf43]">/</span>
          <span className="">{title}</span>
        </nav>
      </div>
      

      {/* Category Description */}
      <div className="container mx-auto px-4 pt-16">
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <div className="flex items-center gap-8 justify-center">
            <div className="w-20 h-px bg-[#bd9951]"></div>
            <h2 className="text-2xl md:text-3xl font-light text-[#6a3f07] font-[family-name:var(--font-optima)]">
              {bannertext}
            </h2>
            <div className="w-20 h-px bg-[#bd9951]"></div>
          </div>
          <p className="text-black font-light text-md">
            {description}
          </p>
        </div>
      </div>
    </>
  );
};

export default ProductListBanner;
