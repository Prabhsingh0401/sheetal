"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FilterOptions } from "../../hooks/useProductFilters";

interface ProductFilterBarProps {
  filtersOpen: boolean;
  toggleFilters: () => void;
  sortByOpen: boolean;
  toggleSortBy: () => void;
  activeFilters: { label: string; type: string; value: string }[];
  removeFilter: (label: string) => void;
  clearFilters: () => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  filterOptions: FilterOptions;
  totalProducts: number;
  onFilterChange: (type: string, value: string) => void;
  onSortChange: (sortOption: string) => void;
  currentSort?: string;
}

// Helper function to convert text to sentence case
const toSentenceCase = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  filtersOpen,
  toggleFilters,
  sortByOpen,
  toggleSortBy,
  activeFilters,
  removeFilter,
  clearFilters,
  viewMode,
  setViewMode,
  filterOptions,
  totalProducts,
  onFilterChange,
  onSortChange,
  currentSort = "newest",
}) => {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (id: string) => {
    if (openSections.includes(id)) {
      setOpenSections(openSections.filter((s) => s !== id));
    } else {
      setOpenSections([...openSections, id]);
    }
  };

  const handleSortClick = (option: string) => {
    onSortChange(option);
    toggleSortBy();
  };

  return (
    <>
      {/* Top Filter Bar */}
      <div className="border-t border-b border-gray-200 py-4 mb-6 relative hidden lg:block">
        <div className="flex flex-col items-center gap-4">
          {/* Centered Sort By */}
          <div className="relative">
            <button
              onClick={toggleSortBy}
              className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider hover:text-[#bd9951] transition-colors"
            >
              <Image
                src="/assets/icons/sort.svg"
                alt="Sort"
                width={16}
                height={16}
              />
              Sort By
            </button>

            {/* Sort Dropdown */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white shadow-xl border border-gray-100 z-50 py-2 transition-all duration-300 ${sortByOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
            >
              <ul>
                <li>
                  <button
                    onClick={() => handleSortClick("price_asc")}
                    className={`block w-full text-left px-4 py-2 text-sm cursor-pointer transition-colors ${currentSort === "price_asc"
                      ? "bg-[#bd9951]/10 text-[#bd9951] font-semibold"
                      : "hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Price: Low to High</span>
                      {currentSort === "price_asc" && (
                        <span className="text-[#bd9951]">✓</span>
                      )}
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSortClick("price_desc")}
                    className={`block w-full text-left px-4 py-2 text-sm cursor-pointer transition-colors ${currentSort === "price_desc"
                      ? "bg-[#bd9951]/10 text-[#bd9951] font-semibold"
                      : "hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Price: High to Low</span>
                      {currentSort === "price_desc" && (
                        <span className="text-[#bd9951]">✓</span>
                      )}
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSortClick("newest")}
                    className={`block w-full text-left px-4 py-2 text-sm cursor-pointer transition-colors ${currentSort === "newest"
                      ? "bg-[#bd9951]/10 text-[#bd9951] font-semibold"
                      : "hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>New Arrivals</span>
                      {currentSort === "newest" && (
                        <span className="text-[#bd9951]">✓</span>
                      )}
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSortClick("popularity")}
                    className={`block w-full text-left px-4 py-2 text-sm cursor-pointer transition-colors ${currentSort === "popularity"
                      ? "bg-[#bd9951]/10 text-[#bd9951] font-semibold"
                      : "hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Popularity</span>
                      {currentSort === "popularity" && (
                        <span className="text-[#bd9951]">✓</span>
                      )}
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Filters and View Mode - Positioned Absolutely */}
          <button
            onClick={toggleFilters}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-lg font-medium uppercase tracking-wider hover:text-[#bd9951] transition-colors"
          >
            <Image
              src="/assets/icons/filter.svg"
              alt="Filter"
              width={20}
              height={20}
            />
            Filters
          </button>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3 border-l border-gray-200 pl-6">
            <button
              onClick={() => setViewMode("grid")}
              className={`transition-opacity ${viewMode === "grid" ? "opacity-100" : "opacity-40 hover:opacity-100"}`}
            >
              <Image
                src="/assets/icons/grid.svg"
                alt="Grid"
                width={18}
                height={18}
              />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`transition-opacity ${viewMode === "list" ? "opacity-100" : "opacity-40 hover:opacity-100"}`}
            >
              <Image
                src="/assets/icons/list.svg"
                alt="List"
                width={18}
                height={18}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300 ${filtersOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={toggleFilters}
      ></div>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-full md:w-[300px] bg-white z-[9999] shadow-2xl transform transition-transform duration-300 overflow-y-auto ${filtersOpen ? "translate-x-0" : "-translate-x-full"} 
         [scrollbar-width:thin]
         [scrollbar-color:#bd9951_transparent]
         [&::-webkit-scrollbar]:w-1.5
         [&::-webkit-scrollbar-track]:bg-transparent
         [&::-webkit-scrollbar-thumb]:bg-[#bd9951]/30
         [&::-webkit-scrollbar-thumb]:rounded-full
         hover:[&::-webkit-scrollbar-thumb]:bg-[#bd9951]/60
       `}
      >
        <div className="p-6">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h4 className="text-xl font-medium uppercase tracking-wide">
              Filters
            </h4>
            <button
              onClick={toggleFilters}
              className="text-gray-400 hover:text-black transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          {/* Clear Filters (Top) */}
          <div className="mb-6 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {totalProducts} Product{totalProducts !== 1 ? "s" : ""}
            </span>
            {activeFilters.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-[#bd9951] underline uppercase tracking-wider"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Active Filters inside Sidebar */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {activeFilters.map((filter, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-gray-100 px-2 py-1 text-[10px] uppercase tracking-wide text-gray-600 rounded-sm"
                >
                  {filter.label}
                  <button
                    onClick={() => removeFilter(filter.label)}
                    className="hover:text-red-500 font-bold ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Filter Categories Accordion */}
          <div className="space-y-4">
            {/* Size Filter */}
            {filterOptions.sizes.length > 0 && (
              <div className="border-b border-gray-100 pb-4">
                <button
                  onClick={() => toggleSection("size")}
                  className="w-full flex justify-between items-center font-semibold uppercase tracking-widest text-sm py-2 hover:text-[#bd9951] transition-colors"
                >
                  Size
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${openSections.includes("size") ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`space-y-2 pt-2 transition-all duration-300 overflow-hidden ${openSections.includes("size") ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {filterOptions.sizes.map((size, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id={`f-size-${idx}`}
                        onChange={() => onFilterChange("size", size)}
                        className="w-4 h-4 accent-[#bd9951] border-gray-300 rounded cursor-pointer"
                      />
                      <label
                        htmlFor={`f-size-${idx}`}
                        className="text-sm cursor-pointer flex items-center gap-2 group-hover:text-black transition-colors"
                      >
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Color Filter */}
            {filterOptions.colors.length > 0 && (
              <div className="border-b border-gray-100 pb-4">
                <button
                  onClick={() => toggleSection("color")}
                  className="w-full flex justify-between items-center font-semibold uppercase tracking-widest text-sm py-2 hover:text-[#bd9951] transition-colors"
                >
                  Color
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${openSections.includes("color") ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`space-y-2 pt-2 transition-all duration-300 overflow-hidden ${openSections.includes("color") ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {filterOptions.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id={`f-color-${idx}`}
                        onChange={() => onFilterChange("color", color.name)}
                        className="w-4 h-4 accent-[#bd9951] border-gray-300 rounded cursor-pointer"
                      />
                      <label
                        htmlFor={`f-color-${idx}`}
                        className="text-sm cursor-pointer flex items-center gap-2 group-hover:text-black transition-colors"
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                          style={{ backgroundColor: color.code }}
                        ></span>
                        {color.name}{" "}
                        <span className="text-gray-400">({color.count})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price Filter */}
            {filterOptions.priceRanges.length > 0 && (
              <div className="border-b border-gray-100 pb-4">
                <button
                  onClick={() => toggleSection("price")}
                  className="w-full flex justify-between items-center font-semibold uppercase tracking-widest text-sm py-2 hover:text-[#bd9951] transition-colors"
                >
                  Price
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${openSections.includes("price") ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`space-y-2 pt-2 transition-all duration-300 overflow-hidden ${openSections.includes("price") ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {filterOptions.priceRanges.map((range, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id={`f-price-${idx}`}
                        onChange={() =>
                          onFilterChange("price", `${range.min}-${range.max}`)
                        }
                        className="w-4 h-4 accent-[#bd9951] border-gray-300 rounded cursor-pointer"
                      />
                      <label
                        htmlFor={`f-price-${idx}`}
                        className="text-sm cursor-pointer flex items-center gap-2 group-hover:text-black transition-colors"
                      >
                        {range.label}{" "}
                        <span className="text-gray-400">({range.count})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability Filter */}
            {filterOptions.availability.length > 0 && (
              <div className="border-b border-gray-100 pb-4 last:border-0">
                <button
                  onClick={() => toggleSection("availability")}
                  className="w-full flex justify-between items-center font-semibold uppercase tracking-widest text-sm py-2 hover:text-[#bd9951] transition-colors"
                >
                  Availability
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${openSections.includes("availability") ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`space-y-2 pt-2 transition-all duration-300 overflow-hidden ${openSections.includes("availability") ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {filterOptions.availability.map((avail, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id={`f-availability-${idx}`}
                        onChange={() =>
                          onFilterChange("availability", avail.label)
                        }
                        className="w-4 h-4 accent-[#bd9951] border-gray-300 rounded cursor-pointer"
                      />
                      <label
                        htmlFor={`f-availability-${idx}`}
                        className="text-sm cursor-pointer flex items-center gap-2 group-hover:text-black transition-colors"
                      >
                        {avail.label}{" "}
                        <span className="text-gray-400">({avail.count})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wear Type Filter */}
            {filterOptions.wearTypes.length > 0 && (
              <div className="border-b border-gray-100 pb-4">
                <button
                  onClick={() => toggleSection("wearType")}
                  className="w-full flex justify-between items-center font-semibold uppercase tracking-widest text-sm py-2 hover:text-[#bd9951] transition-colors"
                >
                  Wear Type
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${openSections.includes("wearType") ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`space-y-2 pt-2 transition-all duration-300 overflow-hidden ${openSections.includes("wearType") ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {filterOptions.wearTypes.map((wearType, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id={`f-wearType-${idx}`}
                        onChange={() =>
                          onFilterChange("wearType", wearType.label)
                        }
                        className="w-4 h-4 accent-[#bd9951] border-gray-300 rounded cursor-pointer"
                      />
                      <label
                        htmlFor={`f-wearType-${idx}`}
                        className="text-sm cursor-pointer flex items-center gap-2 group-hover:text-black transition-colors"
                      >
                        {toSentenceCase(wearType.label)}{" "}
                        <span className="text-gray-400">({wearType.count})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Occasion Filter */}
            {filterOptions.occasions.length > 0 && (
              <div className="border-b border-gray-100 pb-4">
                <button
                  onClick={() => toggleSection("occasion")}
                  className="w-full flex justify-between items-center font-semibold uppercase tracking-widest text-sm py-2 hover:text-[#bd9951] transition-colors"
                >
                  Occasion
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${openSections.includes("occasion") ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`space-y-2 pt-2 transition-all duration-300 overflow-hidden ${openSections.includes("occasion") ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {filterOptions.occasions.map((occasion, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id={`f-occasion-${idx}`}
                        onChange={() =>
                          onFilterChange("occasion", occasion.label)
                        }
                        className="w-4 h-4 accent-[#bd9951] border-gray-300 rounded cursor-pointer"
                      />
                      <label
                        htmlFor={`f-occasion-${idx}`}
                        className="text-sm cursor-pointer flex items-center gap-2 group-hover:text-black transition-colors"
                      >
                        {toSentenceCase(occasion.label)}{" "}
                        <span className="text-gray-400">({occasion.count})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Filter */}
            {filterOptions.tags.length > 0 && (
              <div className="border-b border-gray-100 pb-4 last:border-0">
                <button
                  onClick={() => toggleSection("tags")}
                  className="w-full flex justify-between items-center font-semibold uppercase tracking-widest text-sm py-2 hover:text-[#bd9951] transition-colors"
                >
                  Tags
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${openSections.includes("tags") ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`space-y-2 pt-2 transition-all duration-300 overflow-hidden ${openSections.includes("tags") ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {filterOptions.tags.map((tag, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id={`f-tag-${idx}`}
                        onChange={() =>
                          onFilterChange("tags", tag.label)
                        }
                        className="w-4 h-4 accent-[#bd9951] border-gray-300 rounded cursor-pointer"
                      />
                      <label
                        htmlFor={`f-tag-${idx}`}
                        className="text-sm cursor-pointer flex items-center gap-2 group-hover:text-black transition-colors"
                      >
                        {toSentenceCase(tag.label)}{" "}
                        <span className="text-gray-400">({tag.count})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters List (Desktop/External) - Pill Style */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 py-3">
          {activeFilters.map((filter, index) => (
            <button
              key={index}
              onClick={() => removeFilter(filter.label)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50 hover:border-[#bd9951] transition-all group cursor-pointer"
            >
              <span className="font-normal">{filter.label}</span>
              <span className="flex items-center justify-center w-4 h-4 rounded-full border border-[#bd9951] bg-[#bd9951]/10 group-hover:bg-[#bd9951]/20 transition-colors">
                <svg
                  className="w-2.5 h-2.5 text-[#bd9951] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            </button>
          ))}
          <button
            onClick={clearFilters}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium underline ml-2 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </>
  );
};

export default ProductFilterBar;
