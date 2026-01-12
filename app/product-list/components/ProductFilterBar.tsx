'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface ProductFilterBarProps {
  filtersOpen: boolean;
  toggleFilters: () => void;
  sortByOpen: boolean;
  toggleSortBy: () => void;
  activeFilters: { label: string; type: string }[];
  removeFilter: (label: string) => void;
  clearFilters: () => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const filterCategories = [
  {
    id: 'size',
    label: 'Size',
    type: 'checkbox',
    options: ['28', '30', '32', '34', '36', '38']
  },
  {
    id: 'color',
    label: 'Color',
    type: 'color',
    options: [
      { label: 'Black', color: '#000' },
      { label: 'Blue', color: 'rgb(97, 148, 249)' },
      { label: 'Orange', color: 'rgb(255, 165, 0)' },
      { label: 'Teal', color: 'rgb(0, 140, 154)' }
    ]
  },
  {
    id: 'fabric',
    label: 'Fabric',
    type: 'checkbox',
    options: ['Pure Silk', 'Pure Mul Cotton', 'Art Silk', 'Cotton-silk', 'Crepe', 'Georgette']
  },
  {
    id: 'price',
    label: 'Price',
    type: 'checkbox',
    options: ['₹1000 - ₹1,999', '₹2000 - ₹2,999', '₹3000 - ₹3,999', '₹4000 - ₹4,999']
  },
  {
    id: 'work_type',
    label: 'Work Type',
    type: 'checkbox',
    options: ['Office Wear', 'Casual Wear', 'Party Wear']
  },
  {
    id: 'occasion',
    label: 'Occasion',
    type: 'checkbox',
    options: ['Weddings', 'Anniversaries', 'Birthdays', 'Outdoor Parties']
  },
  {
    id: 'availability',
    label: 'Availability',
    type: 'checkbox',
    options: ['Instock', 'Less Than 10']
  },
  {
    id: 'rating',
    label: 'Rating',
    type: 'checkbox',
    options: ['5 Star', '4 Star', '3 Star', '2 Star', '1 Star']
  }
];

const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  filtersOpen,
  toggleFilters,
  sortByOpen,
  toggleSortBy,
  activeFilters,
  removeFilter,
  clearFilters,
  viewMode,
  setViewMode
}) => {
  // State for accordion sections (all open by default or track individually)
  // For simplicity, we'll let them be independently collapsible.
  // We'll use a local state to track open sections.
  const [openSections, setOpenSections] = useState<string[]>(filterCategories.map(c => c.id));

  const toggleSection = (id: string) => {
    if (openSections.includes(id)) {
      setOpenSections(openSections.filter(s => s !== id));
    } else {
      setOpenSections([...openSections, id]);
    }
  };

  return (
    <>
       {/* Top Filter Bar */}
       <div className="border-t border-b border-gray-200 py-4 mb-6 relative">
          <div className="flex flex-wrap justify-between items-center">
             {/* Left: Filters Toggle */}
             <div className="w-full md:w-auto mb-4 md:mb-0">
                <button 
                  onClick={toggleFilters}
                  className="flex items-center gap-2 text-lg font-medium uppercase tracking-wider hover:text-[#bd9951] transition-colors"
                >
                   <Image src="/assets/icons/filter.svg" alt="Filter" width={20} height={20} />
                   Filters
                </button>
             </div>

             {/* Right: Sort By & View Options */}
             <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto justify-between md:justify-end">
                <div className="relative">
                   <button 
                     onClick={toggleSortBy}
                     className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider hover:text-[#bd9951] transition-colors"
                   >
                      <Image src="/assets/icons/sort.svg" alt="Sort" width={16} height={16} />
                      Sort By
                   </button>
                   
                   {/* Sort Dropdown */}
                   <div className={`absolute right-0 top-full mt-2 w-48 bg-white shadow-xl border border-gray-100 z-50 py-2 transition-all duration-300 ${sortByOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                      <ul>
                         <li><button className="block w-full text-left px-4 py-2 text-sm cursor-pointer">Price: Low to High</button></li>
                         <li><button className="block w-full text-left px-4 py-2 text-sm cursor-pointer">Price: High to Low</button></li>
                         <li><button className="block w-full text-left px-4 py-2 text-sm cursor-pointer ">New Arrivals</button></li>
                         <li><button className="block w-full text-left px-4 py-2 text-sm cursor-pointer ">Popularity</button></li>
                      </ul>
                   </div>
                </div>

                <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
                   <button 
                     onClick={() => setViewMode('grid')}
                     className={`transition-opacity ${viewMode === 'grid' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                   >
                     <Image src="/assets/icons/grid.svg" alt="Grid" width={18} height={18} />
                   </button>
                   <button 
                     onClick={() => setViewMode('list')}
                     className={`transition-opacity ${viewMode === 'list' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                   >
                     <Image src="/assets/icons/list.svg" alt="List" width={18} height={18} />
                   </button>
                </div>
             </div>
          </div>
       </div>

       {/* Sidebar Backdrop */}
       <div 
         className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300 ${filtersOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
         onClick={toggleFilters}
       ></div>

       {/* Sidebar Panel */}
       <div className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[9999] shadow-2xl transform transition-transform duration-300 overflow-y-auto ${filtersOpen ? 'translate-x-0' : '-translate-x-full'} 
         [scrollbar-width:thin]
         [scrollbar-color:#bd9951_transparent]
         [&::-webkit-scrollbar]:w-1.5
         [&::-webkit-scrollbar-track]:bg-transparent
         [&::-webkit-scrollbar-thumb]:bg-[#bd9951]/30
         [&::-webkit-scrollbar-thumb]:rounded-full
         hover:[&::-webkit-scrollbar-thumb]:bg-[#bd9951]/60
       `}>
          <div className="p-6">
              {/* Sidebar Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                  <h4 className="text-xl font-medium uppercase tracking-wide">Filters</h4>
                  <button onClick={toggleFilters} className="text-gray-400 hover:text-black transition-colors">
                    <span className="text-2xl">×</span>
                  </button>
              </div>

              {/* Clear Filters (Top) */}
              <div className="mb-6 flex justify-between items-center">
                 <span className="text-sm text-gray-500">100 Products</span>
                 <button onClick={clearFilters} className="text-sm text-[#bd9951] underline uppercase tracking-wider">Clear All</button>
              </div>
              
              {/* Active Filters inside Sidebar */}
               <div className="flex flex-wrap items-center gap-2 mb-6">
                   {activeFilters.map((filter, index) => (
                       <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 text-[10px] uppercase tracking-wide text-gray-600 rounded-sm">
                           {filter.label}
                           <button onClick={() => removeFilter(filter.label)} className="hover:text-red-500 font-bold ml-1">×</button>
                       </div>
                   ))}
               </div>

              {/* Filter Categories Accordion */}
              <div className="space-y-4">
                  {filterCategories.map((category) => (
                      <div key={category.id} className="border-b border-gray-100 pb-4 last:border-0">
                          <button 
                            onClick={() => toggleSection(category.id)}
                            className="w-full flex justify-between items-center font-semibold uppercase tracking-widest text-sm py-2 hover:text-[#bd9951] transition-colors"
                          >
                              {category.label}
                              <span className={`text-xl transition-transform duration-200 ${openSections.includes(category.id) ? 'rotate-180' : ''}`}>
                                  {openSections.includes(category.id) ? '−' : '+'}
                              </span>
                          </button>
                          
                          <div className={`space-y-2 pt-2 transition-all duration-300 overflow-hidden ${openSections.includes(category.id) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                              {category.options.map((option: any, idx: number) => {
                                  const isColor = category.type === 'color';
                                  const label = isColor ? option.label : option;
                                  const colorValue = isColor ? option.color : null;
                                  const count = 5; // Placeholder count

                                  return (
                                      <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                                          <input type="checkbox" id={`f-${category.id}-${idx}`} className="w-4 h-4 accent-[#bd9951] border-gray-300 rounded cursor-pointer" />
                                          <label htmlFor={`f-${category.id}-${idx}`} className="text-sm cursor-pointer flex items-center gap-2 group-hover:text-black transition-colors">
                                              {isColor && (
                                                  <span className="w-4 h-4 rounded-full border border-gray-200 shadow-sm" style={{backgroundColor: colorValue}}></span>
                                              )}
                                              {label} <span className="text-gray-400">({count})</span>
                                          </label>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
       </div>

       {/* Active Filters List (Desktop/External) */}
       <div className="hidden md:flex flex-wrap items-center gap-3 mb-10">
           {activeFilters.map((filter, index) => (
               <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 text-xs uppercase tracking-wide text-gray-600 rounded-sm">
                   {filter.label}
                   <button onClick={() => removeFilter(filter.label)} className="hover:text-red-500 font-bold ml-1">✕</button>
               </div>
           ))}
           {activeFilters.length > 0 && (
               <button onClick={clearFilters} className="text-xs uppercase tracking-wide text-[#bd9951] underline hover:no-underline">Clear Filters</button>
           )}
       </div>
    </>
  );
};

export default ProductFilterBar;
