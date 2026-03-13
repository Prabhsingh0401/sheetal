"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { searchService } from "@/app/services/searchService";
import {
  fetchProducts,
  Product,
  getProductImageUrl,
  getProductHoverImageUrl,
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

const getPreviousSearches = (): PreviousSearchItem[] => {
  if (typeof window === "undefined") return [];
  const searches = localStorage.getItem(PREVIOUS_SEARCHES_KEY);
  return searches ? JSON.parse(searches) : [];
};

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

const addSearchQuery = (queryText: string) => {
  const trimmed = queryText.trim();
  if (!trimmed || trimmed.length < 2) return;
  addClickedItem({ type: "query", name: trimmed });
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  navbarBottom?: number;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  navbarBottom = 63,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previousSearches, setPreviousSearches] = useState<PreviousSearchItem[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [trendingCategories, setTrendingCategories] = useState<Category[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

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
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && query.trim().length > 1) {
        addSearchQuery(query);
        setPreviousSearches(getPreviousSearches());
      }
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, query]);

  const getImageUrl = (item: any): string => {
    if (item.mainImage) return item.mainImage.url || "/assets/default-image.png";
    if (item.image) return item.image.url || "/assets/default-image.png";
    if (item.data?.mainImage?.url) return item.data.mainImage.url;
    if (item.data?.image?.url) return item.data.image.url;
    return "/assets/default-image.png";
  };

  const matchedCategories = results.filter((r) => r.type === "category");
  const matchedProducts = results.filter((r) => r.type === "product");

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
          const effective = s.discountPrice && s.discountPrice > 0 ? s.discountPrice : s.price;
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
      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
        <span className="font-semibold text-gray-900 text-xs">₹{minPrice}</span>
        {relatedMrp > minPrice && (
          <>
            <span className="line-through text-[11px] text-gray-400">₹{relatedMrp}</span>
            <span className="text-[11px] text-[#B78D65] font-semibold">{discount}% OFF</span>
          </>
        )}
      </div>
    );
  };

  /** Left sidebar: Popular Searches + Search History */
  const renderLeftPanel = () => (
    <div className="w-[240px] shrink-0 border-r border-gray-100 pr-5">
      {/* Popular Searches */}
      {trendingCategories.length > 0 && (
        <div className="mb-5">
          <h4 className="text-[13px] font-semibold text-gray-800 tracking-wide mb-0.5">
            Popular Searches:
          </h4>
          <p className="text-[11px] text-gray-400 italic mb-2.5">
            10,000+ of the products are in our store
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
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

      {/* Divider */}
      {trendingCategories.length > 0 && previousSearches.length > 0 && (
        <hr className="border-gray-200 mb-4" />
      )}

      {/* Search History */}
      {previousSearches.length > 0 && (
        <div>
          <h4 className="text-[13px] font-semibold text-gray-800 tracking-wide mb-0.5">
            Search History:
          </h4>
          <p className="text-[11px] text-gray-400 italic mb-2.5">
            you searched below keywords in the last session
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {previousSearches.map((item, i) => {
              if (item.type === "query") {
                return (
                  <button
                    key={i}
                    onClick={() => setQuery(item.name)}
                    className="flex items-center gap-1 text-[#8c7e4e] hover:text-[#4a3f1a] underline underline-offset-2 text-[13px] transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-60 shrink-0"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    {item.name}
                  </button>
                );
              }
              return (
                <Link
                  key={i}
                  href={
                    item.type === "product"
                      ? `/product/${item.slug}`
                      : `/product-list?category=${encodeURIComponent(item.categoryName || "")}`
                  }
                  onClick={() => { addClickedItem(item); onClose(); }}
                  className="text-[#8c7e4e] hover:text-[#4a3f1a] underline underline-offset-2 text-[13px] transition-colors"
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  /** Right panel: product grid */
  const renderProductGrid = (products: any[], isRaw: boolean, title: string) => (
    <div className="flex-1 min-w-0">
      {/* Title + horizontal rule */}
      <div className="flex items-center gap-3 mb-4">
        <h4 className="text-[13px] font-semibold text-gray-800 tracking-wide whitespace-nowrap">
          {title}
        </h4>
        <hr className="flex-1 border-gray-200" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((item) => {
          const product = isRaw ? item : item.data;
          const imageUrl = isRaw ? getProductImageUrl(item) : getImageUrl(item);
          const hoverUrl = isRaw ? getProductHoverImageUrl(item) : getImageUrl(item);
          return (
            <Link
              key={product._id}
              href={`/product/${product.slug}`}
              className="group block cursor-pointer"
              onClick={() => {
                addClickedItem({ type: "product", name: product.name, slug: product.slug });
                onClose();
              }}
            >
              {/* Image */}
              <div className="relative aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-500"
                />
                {isRaw && (
                  <Image
                    src={hoverUrl}
                    alt={product.name}
                    fill
                    className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                )}
              </div>

              {/* Info */}
              <div className="mt-2 px-0.5">
                <h5 className="text-[12px] text-gray-800 font-medium line-clamp-2 leading-snug">
                  {product.name}
                </h5>
                {getPriceDisplay(product)}
                <span className="inline-block mt-1.5 border-b border-black text-[11px] text-black uppercase tracking-wide transition-all duration-300 group-hover:tracking-widest group-hover:text-[#b3a660]">
                  View Detail
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );

  if (!isOpen) return null;

  const showingQuery = query.length > 2;
  const displayProducts = showingQuery ? matchedProducts : trendingProducts.map((p) => ({ data: p, _raw: true }));
  const productTitle = showingQuery
    ? `Trending Products for "${query}":`
    : "Trending Products:";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed left-0 right-0 z-[9999] font-[family-name:var(--font-montserrat)] px-[5%] transition-all duration-300"
        style={{ top: `${navbarBottom + 12}px` }}
      >
        <div
          className="relative w-full shadow-2xl rounded-b-2xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #e2f7cf 0%, #f7efbe 100%)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-500 hover:text-gray-900 text-xl leading-none transition-colors z-10 cursor-pointer"
            aria-label="Close search"
          >
            ✕
          </button>

          {/* Search Input */}
          <div className="px-6 pt-5 pb-3 pr-12">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <input
                ref={inputRef}
                type="text"
                className="w-full py-2.5 pl-11 pr-10 text-sm rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-[#b3a660] shadow-sm placeholder-gray-400 transition-all"
                placeholder="I'm Looking for..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#b3a660] border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Autocomplete dropdown */}
              {query.length > 2 && results.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-xl border border-t-0 border-gray-200 z-50 overflow-hidden">
                  {results.slice(0, 5).map((item, index) => (
                    <Link
                      key={index}
                      href={item.type === "category" ? `/${item.data.slug}` : `/product/${item.data.slug}`}
                      onClick={() => {
                        addClickedItem(
                          item.type === "category"
                            ? { type: "category", name: item.data.name, categoryName: item.data.name }
                            : { type: "product", name: item.data.name, slug: item.data.slug }
                        );
                        onClose();
                      }}
                      className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#082722] transition-colors border-b last:border-0 border-gray-100"
                    >
                      <span className="font-medium">{item.data.name}</span>
                      <span className="text-xs text-gray-400 ml-2 capitalize">in {item.type}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Two-column content */}
          <div className="mx-4 mb-4 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-5 overflow-y-auto max-h-[65vh] custom-scrollbar">

              {/* Matched Categories row (query mode) */}
              {showingQuery && matchedCategories.length > 0 && (
                <div className="mb-4 pb-3 border-b border-gray-100">
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    <span className="text-[12px] font-semibold text-gray-600 mr-1">Suggestions:</span>
                    {matchedCategories.map((item, i) => (
                      <Link
                        key={i}
                        href={`/${item.data.slug}`}
                        onClick={() => { addClickedItem({ type: "category", name: item.data.name, categoryName: item.data.name }); onClose(); }}
                        className="text-[#8c7e4e] hover:text-[#4a3f1a] underline underline-offset-2 text-[13px] transition-colors"
                      >
                        {item.data.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Main two-column layout */}
              <div className="flex gap-6">
                {/* Left: always show popular searches + history */}
                {renderLeftPanel()}

                {/* Right: product grid */}
                <div className="flex-1 min-w-0">
                  {showingQuery ? (
                    matchedProducts.length > 0 ? (
                      renderProductGrid(matchedProducts, false, productTitle)
                    ) : (
                      !isLoading && (
                        <p className="text-gray-400 text-center py-8 text-sm italic">
                          No results found for &ldquo;{query}&rdquo;.
                        </p>
                      )
                    )
                  ) : (
                    trendingProducts.length > 0 && renderProductGrid(
                      trendingProducts,
                      true,
                      productTitle
                    )
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchModal;