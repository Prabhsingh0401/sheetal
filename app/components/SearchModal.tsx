"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { searchService } from "@/app/services/searchService";
import {
  fetchProducts,
  Product,
  getProductImageUrl,
} from "../services/productService";
import { fetchAllCategories, Category } from "../services/categoryService";
import Image from "next/image";

const PREVIOUS_SEARCHES_KEY = "previous_searches";
const MAX_PREVIOUS_SEARCHES = 5;

interface PreviousSearchItem {
  type: "product" | "category" | "query";
  name: string;
  slug?: string;
  categoryName?: string;
}

/** Reads previous searches from localStorage */
const getPreviousSearches = (): PreviousSearchItem[] => {
  if (typeof window === "undefined") return [];
  const searches = localStorage.getItem(PREVIOUS_SEARCHES_KEY);
  return searches ? JSON.parse(searches) : [];
};

/** Persists a clicked item into the previous-searches list */
const addClickedItem = (item: PreviousSearchItem) => {
  if (typeof window === "undefined") return;
  const items = getPreviousSearches();

  const identifier =
    item.type === "product"
      ? `product-${item.slug}`
      : item.type === "category"
        ? `category-${item.categoryName}`
        : `query-${item.name.toLowerCase().trim()}`;

  const updatedItems = [
    item,
    ...items.filter((existingItem) => {
      const existingIdentifier =
        existingItem.type === "product"
          ? `product-${existingItem.slug}`
          : existingItem.type === "category"
            ? `category-${existingItem.categoryName}`
            : `query-${existingItem.name.toLowerCase().trim()}`;
      return existingIdentifier !== identifier;
    }),
  ].slice(0, MAX_PREVIOUS_SEARCHES);

  localStorage.setItem(PREVIOUS_SEARCHES_KEY, JSON.stringify(updatedItems));
};

/** Saves a raw search query term into the previous-searches list */
const addSearchQuery = (queryText: string) => {
  const trimmed = queryText.trim();
  if (!trimmed || trimmed.length < 2) return;
  addClickedItem({ type: "query", name: trimmed });
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Bottom edge of the navbar in pixels from the top of the viewport */
  navbarBottom?: number;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, navbarBottom = 63 }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previousSearches, setPreviousSearches] = useState<PreviousSearchItem[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [trendingCategories, setTrendingCategories] = useState<Category[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      setPreviousSearches(getPreviousSearches());
      setTimeout(() => inputRef.current?.focus(), 100);

      if (trendingProducts.length === 0) {
        Promise.all([
          fetchProducts({ sort: "-viewCount", limit: 4, status: "Active" }),
          fetchAllCategories(),
        ])
          .then(([prodRes, cats]) => {
            if (prodRes.success && prodRes.products) {
              setTrendingProducts(prodRes.products);
            }
            if (cats) {
              const topCats = cats.filter((c) => !c.parentCategory).slice(0, 8);
              setTrendingCategories(topCats);
            }
          })
          .catch((err) => console.error("Failed to load trending suggestions", err));
      }
    } else {
      // Reset query when closed
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (query.length > 2) {
      const debounce = setTimeout(() => {
        setIsLoading(true);
        searchService(query)
          .then((res) => setResults(res.results))
          .catch((err) => console.error(err))
          .finally(() => setIsLoading(false));
      }, 500);
      return () => clearTimeout(debounce);
    } else {
      setResults([]);
    }
  }, [query]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Save typed query on Enter
      if (e.key === "Enter" && query.trim().length > 1) {
        addSearchQuery(query);
        setPreviousSearches(getPreviousSearches());
      }
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, query]);

  /** Returns a safe image URL for search result items */
  const getImageUrl = (item: any): string => {
    if (item.mainImage) return item.mainImage.url || "/assets/default-image.png";
    if (item.image) return item.image.url || "/assets/default-image.png";
    if (item.data?.mainImage?.url) return item.data.mainImage.url;
    if (item.data?.image?.url) return item.data.image.url;
    return "/assets/default-image.png";
  };

  const matchedCategories = results.filter((r) => r.type === "category");
  const matchedProducts = results.filter((r) => r.type === "product");

  /** Computes and renders the price badge for a product */
  const getPriceDisplay = (product: any) => {
    let minPrice = Infinity;
    let relatedMrp = 0;
    let discount = 0;

    if (product.minPrice !== undefined) {
      minPrice = product.minPrice;
      relatedMrp = product.mrp || 0;
      discount = product.discount || 0;
    } else if (product.variants && product.variants.length > 0) {
      product.variants.forEach((v: any) => {
        v.sizes?.forEach((s: any) => {
          const effective =
            s.discountPrice && s.discountPrice > 0 ? s.discountPrice : s.price;
          if (effective < minPrice) {
            minPrice = effective;
            relatedMrp = s.price;
          }
        });
      });
      if (minPrice !== Infinity && relatedMrp > minPrice) {
        discount = Math.round(((relatedMrp - minPrice) / relatedMrp) * 100);
      }
    }

    if (minPrice === Infinity || minPrice === 0) return null;

    return (
      <div className="flex items-center gap-2 mt-1 flex-wrap">
        <span className="font-bold text-gray-900 text-sm">₹{minPrice}</span>
        {relatedMrp > minPrice && (
          <>
            <span className="line-through text-xs text-gray-400">₹{relatedMrp}</span>
            <span className="text-xs text-[#B78D65] font-semibold">{discount}% OFF</span>
          </>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop to close on outside click — no overlay color */}
      <div
        className="fixed inset-0 z-[9998]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search panel — positioned just below the navbar, inset 10% each side */}
      <div
        className="fixed left-0 right-0 z-[9999] font-[family-name:var(--font-montserrat)] transition-all duration-500 px-[10%]"
        style={{ top: `${navbarBottom + 12}px` }}
      >
        <div
          className="relative w-full shadow-2xl rounded-b-xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #e2f7cf 0%, #f7efbe 100%)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Close button — top right of panel ── */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-500 hover:text-gray-900 text-xl leading-none transition-colors z-10 cursor-pointer"
            aria-label="Close search"
          >
            ✕
          </button>

          {/* ── Search Input Row ── */}
          <div className="px-6 pt-5 pb-3 pr-12 relative">
            <div className="relative">
              {/* Magnifier icon */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>

              <input
                ref={inputRef}
                type="text"
                className="w-full py-2.5 pl-11 pr-10 text-sm rounded-full border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-[#b3a660] shadow-sm placeholder-gray-400 transition-all"
                placeholder="I'm Looking for..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              {/* Spinner while loading */}
              {isLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#b3a660] border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Inline autocomplete dropdown */}
              {query.length > 2 && results.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-xl border border-t-0 border-gray-200 z-50 overflow-hidden">
                  {results.slice(0, 5).map((item, index) => (
                    <Link
                      key={index}
                      href={
                        item.type === "category"
                          ? `/${item.data.slug}`
                          : `/product/${item.data.slug}`
                      }
                      onClick={() => {
                        addClickedItem(
                          item.type === "category"
                            ? {
                              type: "category",
                              name: item.data.name,
                              categoryName: item.data.name,
                            }
                            : {
                              type: "product",
                              name: item.data.name,
                              slug: item.data.slug,
                            },
                        );
                        onClose();
                      }}
                      className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#082722] transition-colors border-b last:border-0 border-gray-100"
                    >
                      <span className="font-medium">{item.data.name}</span>
                      <span className="text-xs text-gray-400 ml-2 capitalize">
                        in {item.type}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Scrollable Content inside white card ── */}
          <div className="mx-4 mb-4 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 pb-5 pt-3 overflow-y-auto max-h-[60vh] custom-scrollbar">

              {/* Popular Searches — always visible when no query */}
              {query.length <= 2 && trendingCategories.length > 0 && (
                <div className="mb-5 border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-[13px] font-semibold text-gray-800 tracking-wide">
                      Popular Searches:
                    </h4>
                    <span className="text-[11px] text-gray-400 italic hidden sm:inline">
                      10,000+ of the products are in our store
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                    {trendingCategories.map((cat, i) => (
                      <Link
                        key={i}
                        href={`/${cat.slug}`}
                        onClick={onClose}
                        className="text-[#8c7e4e] hover:text-[#4a3f1a] underline underline-offset-2 text-[13px] transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Search History */}
              {!isLoading && previousSearches.length > 0 && (
                <div className="mb-5 border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-[13px] font-semibold text-gray-800 tracking-wide">
                      Search History:
                    </h4>
                    <span className="text-[11px] text-gray-400 italic hidden sm:inline">
                      you searched below keywords in the last session
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                    {previousSearches.map((item, i) => {
                      // Query-type items re-populate the search input
                      if (item.type === "query") {
                        return (
                          <button
                            key={i}
                            onClick={() => setQuery(item.name)}
                            className="flex items-center gap-1 text-[#8c7e4e] hover:text-[#4a3f1a] underline underline-offset-2 text-[13px] transition-colors"
                          >
                            {/* Search icon for query items */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 shrink-0">
                              <circle cx="11" cy="11" r="8" />
                              <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            {item.name}
                          </button>
                        );
                      }
                      // Product / category items navigate away
                      return (
                        <Link
                          key={i}
                          href={
                            item.type === "product"
                              ? `/product/${item.slug}`
                              : `/product-list?category=${encodeURIComponent(item.categoryName || "")}`
                          }
                          onClick={() => {
                            addClickedItem(item);
                            onClose();
                          }}
                          className="text-[#8c7e4e] hover:text-[#4a3f1a] underline underline-offset-2 text-[13px] transition-colors"
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Default state: Suggestions + Trending Products */}
              {query.length <= 2 ? (
                <>
                  {/* Suggestions */}
                  {trendingCategories.length > 0 && (
                    <div className="mb-5 border-b border-gray-200 pb-4">
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="text-[13px] font-semibold text-gray-800 tracking-wide">
                          Suggestions:
                        </h4>
                        <span className="text-[11px] text-gray-400 italic hidden sm:inline">
                          10,000+ of the products are in our store
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                        {trendingCategories.map((cat, i) => (
                          <Link
                            key={i}
                            href={`/${cat.slug}`}
                            onClick={onClose}
                            className="text-[#8c7e4e] hover:text-[#4a3f1a] underline underline-offset-2 text-[13px] transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending Products */}
                  {trendingProducts.length > 0 && (
                    <div>
                      <h4 className="text-[13px] font-semibold text-gray-800 tracking-wide mb-3">
                        Trending Products:
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {trendingProducts.map((product) => (
                          <Link
                            key={product._id}
                            href={`/product/${product.slug}`}
                            className="group block rounded-lg transition-shadow overflow-hidden cursor-pointer"
                            onClick={() => {
                              addClickedItem({
                                type: "product",
                                name: product.name,
                                slug: product.slug,
                              });
                              onClose();
                            }}
                          >
                            <div className="relative aspect-[3/4] bg-gray-100">
                              <Image
                                src={getProductImageUrl(product)}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="p-2.5">
                              <h5 className="text-xs text-gray-800 font-medium group-hover:text-[#b3a660] transition-colors line-clamp-2">
                                {product.name}
                              </h5>
                              {getPriceDisplay(product)}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Matched Categories */}
                  {matchedCategories.length > 0 && (
                    <div className="mb-5 border-b border-gray-200 pb-4">
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="text-[13px] font-semibold text-gray-800 tracking-wide">
                          Suggestions:
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                        {matchedCategories.map((item, i) => (
                          <Link
                            key={i}
                            href={`/${item.data.slug}`}
                            onClick={() => {
                              addClickedItem({
                                type: "category",
                                name: item.data.name,
                                categoryName: item.data.name,
                              });
                              onClose();
                            }}
                            className="text-[#8c7e4e] hover:text-[#4a3f1a] underline underline-offset-2 text-[13px] transition-colors"
                          >
                            {item.data.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending/Matched Products for query */}
                  {matchedProducts.length > 0 ? (
                    <div>
                      <h4 className="text-[13px] font-semibold text-gray-800 tracking-wide mb-3">
                        Trending Products for &ldquo;{query}&rdquo;:
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {matchedProducts.map((item) => (
                          <Link
                            key={item.data._id}
                            href={`/product/${item.data.slug}`}
                            className="group block hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                            onClick={() => {
                              addClickedItem({
                                type: "product",
                                name: item.data.name,
                                slug: item.data.slug,
                              });
                              onClose();
                            }}
                          >
                            <div className="relative aspect-[3/4] bg-gray-100">
                              <Image
                                src={getImageUrl(item)}
                                alt={item.data.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="p-2.5">
                              <h5 className="text-xs text-gray-800 font-medium group-hover:text-[#b3a660] transition-colors line-clamp-2">
                                {item.data.name}
                              </h5>
                              {getPriceDisplay(item.data)}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    !isLoading && matchedCategories.length === 0 && (
                      <p className="text-gray-400 text-center py-8 text-sm italic">
                        No results found for &ldquo;{query}&rdquo;.
                      </p>
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchModal;
