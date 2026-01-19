'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category, fetchCategoryBySlug, getCategoryBannerUrl } from '../../services/categoryService';

interface ProductListBannerProps {
  categorySlug?: string;
}

const ProductListBanner: React.FC<ProductListBannerProps> = ({ categorySlug }) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(!!categorySlug);
  const [error, setError] = useState<string | null>(null);

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
          setError('Category not found');
        } else {
          setCategory(data);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load category';
        setError(errorMessage);
        console.error('Error loading category:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [categorySlug]);

  // Use category data if available, otherwise fallback to defaults
  const bannertext = category?.categoryBanner || '';
  const title = category?.name || 'Collection';
  const description = category?.description || `Explore our exclusive ${title.toLowerCase()} collection. Get styled with the high-fashion products and transform yourself.`;
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
          <h2 className="text-3xl md:text-4xl font-light mb-6 text-[#1a1a1a] font-[family-name:var(--font-outfit)] uppercase tracking-[0.2em]">{bannertext}</h2>
          <div className="w-20 h-px bg-[#bd9951] mx-auto mb-6"></div>
          <p className="text-gray-500 font-light leading-relaxed text-lg">
            {description}
          </p>
        </div>
      </div>
    </>
  );
};

export default ProductListBanner;
