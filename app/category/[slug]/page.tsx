'use client';
import React, { useState, use } from 'react';
import TopInfo from '../../components/TopInfo';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductListBanner from '../../product-list/components/ProductListBanner';
import ProductFilterBar from '../../product-list/components/ProductFilterBar';
import ProductGrid from '../../product-list/components/ProductGrid';
import FilterSortMobile from '../../product-list/components/FilterSortMobile';
import MobileSortSheet from '../../product-list/components/MobileSortSheet';

const products = [
  {
    id: 1,
    name: "Rama Green Zariwork Soft Silk Saree",
    image: "/assets/494291571.webp",
    hoverImage: "/assets/487339289.webp",
    price: 2365.50,
    mrp: 2490.00,
    discount: "5% OFF",
    size: "XL",
    rating: 4,
    soldOut: true
  },
  {
    id: 2,
    name: "Mustard Zariwork Organza Fabric Readymade Salwar Suit",
    image: "/assets/590900458.webp",
    hoverImage: "/assets/789323917.webp",
    price: 790.50,
    mrp: 850.00,
    discount: "7% OFF",
    size: "L",
    rating: 0,
    soldOut: false
  },
  {
    id: 3,
    name: "Onion Pink Zariwork Tissue Saree",
    image: "/assets/670149944.webp",
    hoverImage: "/assets/882872675.webp",
    price: 391.02,
    mrp: 399.00,
    discount: "2% OFF",
    size: "L",
    rating: 0,
    soldOut: false
  },
  {
    id: 4,
    name: "Sky Blue Threadwork Semi Crepe Readymade Salwar Suit",
    image: "/assets/229013918.webp",
    hoverImage: "/assets/493323435.webp",
    price: 790.50,
    mrp: 850.00,
    discount: "7% OFF",
    size: "L",
    rating: 0,
    soldOut: false
  },
  {
    id: 5,
    name: "Mustard Zariwork Organza Fabric Readymade Salwar Suit",
    image: "/assets/590900458.webp",
    hoverImage: "/assets/789323917.webp",
    price: 790.50,
    mrp: 850.00,
    discount: "7% OFF",
    size: "L",
    rating: 0,
    soldOut: false
  },
  {
    id: 6,
    name: "Sky Blue Threadwork Semi Crepe Readymade Salwar Suit",
    image: "/assets/229013918.webp",
    hoverImage: "/assets/493323435.webp",
    price: 790.50,
    mrp: 850.00,
    discount: "7% OFF",
    size: "L",
    rating: 0,
    soldOut: false
  },
  {
    id: 7,
    name: "Mustard Zariwork Organza Fabric Readymade Salwar Suit",
    image: "/assets/590900458.webp",
    hoverImage: "/assets/789323917.webp",
    price: 790.50,
    mrp: 850.00,
    discount: "7% OFF",
    size: "L",
    rating: 0,
    soldOut: false
  },
  {
    id: 8,
    name: "Sky Blue Threadwork Semi Crepe Readymade Salwar Suit",
    image: "/assets/229013918.webp",
    hoverImage: "/assets/493323435.webp",
    price: 790.50,
    mrp: 850.00,
    discount: "7% OFF",
    size: "L",
    rating: 0,
    soldOut: false
  },
  {
    id: 9,
    name: "Mustard Zariwork Organza Fabric Readymade Salwar Suit",
    image: "/assets/590900458.webp",
    hoverImage: "/assets/789323917.webp",
    price: 790.50,
    mrp: 850.00,
    discount: "7% OFF",
    size: "L",
    rating: 0,
    soldOut: false
  }
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CategoryPage = ({ params }: PageProps) => {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  // Format slug for display (e.g. "salwar-suits" -> "Salwar Suits")
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortByOpen, setSortByOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilters, setActiveFilters] = useState([
    { label: "Size: 28", type: "Size" },
    { label: "Fabric: Pure Silk", type: "Fabric" }
  ]);

  const toggleFilters = () => setFiltersOpen(!filtersOpen);
  const toggleSortBy = () => setSortByOpen(!sortByOpen);

  const removeFilter = (label: string) => {
    setActiveFilters(activeFilters.filter(f => f.label !== label));
  };
  
  const clearFilters = () => {
    setActiveFilters([]);
  };

  const handleMobileSort = (option: string) => {
    console.log("Sorting by:", option);
    // Add logic here to actually sort products
    setMobileSortOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-montserrat)]">
      <TopInfo />
      <Navbar />

      <ProductListBanner title={title} />

      <div className="container mx-auto px-4 py-8">
        <div className="w-full">
           <ProductFilterBar 
             filtersOpen={filtersOpen}
             toggleFilters={toggleFilters}
             sortByOpen={sortByOpen}
             toggleSortBy={toggleSortBy}
             activeFilters={activeFilters}
             removeFilter={removeFilter}
             clearFilters={clearFilters}
             viewMode={viewMode}
             setViewMode={setViewMode}
           />

          <ProductGrid products={products} viewMode={viewMode} />
        </div>
      </div>

      <Footer />
      
      {/* Mobile Sticky Filter/Sort Footer */}
      <FilterSortMobile 
        onFilterClick={toggleFilters} 
        onSortClick={() => setMobileSortOpen(true)} 
      />

      <MobileSortSheet 
        isOpen={mobileSortOpen} 
        onClose={() => setMobileSortOpen(false)} 
        onSelect={handleMobileSort} 
      />
    </div>
  );
};

export default CategoryPage;