'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FilterSortMobile from './components/FilterSortMobile';
import MobileSortSheet from './components/MobileSortSheet';
import TopInfo from '../components/TopInfo';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductListBanner from './components/ProductListBanner';
import ProductFilterBar from './components/ProductFilterBar';
import ProductGrid from './components/ProductGrid';
import { getProductImageUrl } from '../services/productService';
import { fetchCategoryBySlug } from '../services/categoryService';
import { getApiImageUrl } from '../services/api';
import { useProducts } from '../hooks/useProducts';

const ProductList = () => {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');
  
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [isResolvingCategory, setIsResolvingCategory] = useState(!!categorySlug);

  // UI State
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortByOpen, setSortByOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilters, setActiveFilters] = useState<{ label: string; type: string }[]>([]);

  // Resolve Category Slug to ID
  useEffect(() => {
    const resolveCategory = async () => {
      if (!categorySlug) {
        setCategoryId(undefined);
        setIsResolvingCategory(false);
        return;
      }
      
      setIsResolvingCategory(true);
      try {
        const category = await fetchCategoryBySlug(categorySlug);
        if (category) {
          setCategoryId(category._id);
        } else {
          console.warn('Category not found:', categorySlug);
        }
      } catch (error) {
        console.error('Error resolving category:', error);
      } finally {
        setIsResolvingCategory(false);
      }
    };

    resolveCategory();
  }, [categorySlug]);

  
  const { products, loading: productsLoading, error } = useProducts({ 
    category: categoryId,
    limit: 50
  });

  const loading = isResolvingCategory || productsLoading;

  const handleMobileSort = (option: string) => {
    console.log("Sorting by:", option);
    setMobileSortOpen(false);
  };
  
  // Transform data for Grid Component
  const gridProducts = products.map(p => {
      const mrp = p.price;
      const price = p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price;
      const discountPercent = p.discountPrice && p.discountPrice < p.price
        ? Math.round(((p.price - p.discountPrice) / p.price) * 100)
        : 0;
      
      return {
          id: p._id,
          name: p.name,
          image: getProductImageUrl(p),
          hoverImage: p.hoverImage?.url ? getApiImageUrl(p.hoverImage.url) : getProductImageUrl(p),
          price: price,
          mrp: mrp,
          discount: discountPercent > 0 ? `${discountPercent}% OFF` : '',
          size: p.variants?.[0]?.size || 'One Size',
          rating: p.averageRating || 0,
          soldOut: p.stock <= 0
      };
  });

  return (
    <>
      <TopInfo />
      <Navbar />
      
      <ProductListBanner categorySlug={categorySlug || undefined} />

      <div className="container mx-auto px-4 pb-20 mt-8">
        
        <ProductFilterBar 
            filtersOpen={filtersOpen}
            toggleFilters={() => setFiltersOpen(!filtersOpen)}
            sortByOpen={sortByOpen}
            toggleSortBy={() => setSortByOpen(!sortByOpen)}
            activeFilters={activeFilters}
            removeFilter={(label) => setActiveFilters(activeFilters.filter(f => f.label !== label))}
            clearFilters={() => setActiveFilters([])}
            viewMode={viewMode}
            setViewMode={setViewMode}
        />

        {loading ? (
            <div className="flex justify-center py-20">
                <p className="text-gray-500">Loading products...</p>
            </div>
         ) : error ? (
            <div className="flex justify-center py-20">
                <p className="text-red-500">{error}</p>
            </div>
         ) : products.length === 0 ? (
            <div className="flex justify-center py-20">
                <p className="text-gray-500">No products found.</p>
            </div>
         ) : (
            <ProductGrid products={gridProducts} viewMode={viewMode} />
         )}
      </div>

      <Footer />
      
      <FilterSortMobile 
        onFilterClick={() => setFiltersOpen(true)}
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
