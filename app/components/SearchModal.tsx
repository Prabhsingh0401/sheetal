"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchService } from "@/app/services/searchService";
import {
  fetchProducts,
  Product,
  getProductImageUrl,
  getProductHoverImageUrl,
} from "../services/productService";
import { getCategoryImageUrl } from "../services/categoryService";
import { useCategories } from "../hooks/useCategories";
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
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previousSearches, setPreviousSearches] = useState<
    PreviousSearchItem[]
  >([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { categories: allCategories } = useCategories();
  const trendingCategories = allCategories
    .filter((c) => !c.parentCategory)
    .slice(0, 8);

  useEffect(() => {
    if (isOpen) {
      setPreviousSearches(getPreviousSearches());
      setTimeout(() => inputRef.current?.focus(), 100);
      if (trendingProducts.length === 0) {
        fetchProducts({ sort: "-viewCount", limit: 4, status: "Active" })
          .then((prodRes) => {
            if (prodRes.success && prodRes.products) {
              setTrendingProducts(prodRes.products);
            }
          })
          .catch((err) =>
            console.error("Failed to load trending products", err),
          );
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
          .then(async (res) => {
            const rawResults: any[] = res.results;
            const categoryResults = rawResults.filter(
              (r) => r.type === "category",
            );
            const productResults = rawResults.filter(
              (r) => r.type === "product",
            );

            if (productResults.length === 0) {
              setResults(categoryResults);
              return;
            }

            const ids = productResults
              .map((r) => r.data._id ?? r.data.id)
              .filter(Boolean)
              .join(",");

            const fullRes = await fetchProducts({
              ids,
              limit: productResults.length,
              status: "Active",
            });

            if (fullRes.success && fullRes.products?.length) {
              const fullProductMap = new Map<string, Product>(
                fullRes.products.map((p: Product) => [p._id, p]),
              );
              const enrichedProductResults = productResults.map((r) => ({
                ...r,
                data: fullProductMap.get(r.data._id ?? r.data.id) ?? r.data,
              }));
              setResults([...categoryResults, ...enrichedProductResults]);
            } else {
              setResults(rawResults);
            }
          })
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
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Enter" && query.trim().length > 1) {
        addSearchQuery(query);
        setPreviousSearches(getPreviousSearches());
        const topResult = results[0];
        if (topResult) {
          const href =
            topResult.type === "category"
              ? `/${topResult.data.slug}`
              : `/product/${topResult.data.slug}`;
          addClickedItem(
            topResult.type === "category"
              ? {
                  type: "category",
                  name: topResult.data.name,
                  categoryName: topResult.data.name,
                }
              : {
                  type: "product",
                  name: topResult.data.name,
                  slug: topResult.data.slug,
                },
          );
          onClose();
          router.push(href);
        }
      }
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, query, results, router]);

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
      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
        <span className="font-semibold text-gray-900 text-xs">₹{minPrice}</span>
        {relatedMrp > minPrice && (
          <>
            <span className="line-through text-[11px] text-gray-400">
              ₹{relatedMrp}
            </span>
            <span className="text-[11px] text-[#B78D65] font-semibold">
              {discount}% OFF
            </span>
          </>
        )}
      </div>
    );
  };

  const renderLeftPanelContent = (compact = false) => {
    const showingQuery = query.length > 2;

    return (
      <>
        {/* ── Inline suggestions ── */}
        {showingQuery && results.length > 0 && (
          <div className="mb-4 pb-3 border-b border-gray-100">
            <h4 className="text-[13px] font-semibold text-gray-800 tracking-wide mb-2">
              Suggestions:
            </h4>
            <div className="flex flex-col gap-0.5">
              {results.slice(0, 6).map((item, index) => (
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
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <span className="text-gray-400 group-hover:text-[#8c7e4e] transition-colors shrink-0">
                    {item.type === "category" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    )}
                  </span>
                  <span className="text-[13px] text-gray-700 group-hover:text-[#4a3f1a] font-medium transition-colors truncate">
                    {item.data.name}
                  </span>
                  <span className="ml-auto text-[11px] text-gray-400 capitalize shrink-0">
                    {item.type}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Popular Searches — plain text links, unchanged ── */}
        {trendingCategories.length > 0 && (
          <div className={compact ? "mb-3" : "mb-5"}>
            <h4 className="text-[13px] font-semibold text-gray-800 tracking-wide mb-0.5">
              Popular Searches:
            </h4>
            {!compact && (
              <p className="text-[11px] text-gray-400 italic mb-2.5">
                10,000+ of the products are in our store
              </p>
            )}
            <div
              className={`flex flex-wrap gap-x-4 ${compact ? "gap-y-2 mt-1.5" : "gap-y-1.5 mt-2.5"}`}
            >
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

        {trendingCategories.length > 0 && previousSearches.length > 0 && (
          <hr className="border-gray-200 mb-3" />
        )}

        {/* ── Search History ── */}
        {previousSearches.length > 0 && (
          <div>
            <h4 className="text-[13px] font-semibold text-gray-800 tracking-wide mb-0.5">
              Search History:
            </h4>
            {!compact && (
              <p className="text-[11px] text-gray-400 italic mb-2.5">
                you searched below keywords in the last session
              </p>
            )}
            <div
              className={`flex flex-wrap gap-x-4 ${compact ? "gap-y-2 mt-1.5" : "gap-y-1.5 mt-2.5"}`}
            >
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
      </>
    );
  };

  const renderLeftPanel = () => (
    <div className="hidden md:block w-[300px] shrink-0 border-r border-gray-100 pr-5 overflow-y-auto max-h-[58vh] custom-scrollbar">
      {renderLeftPanelContent(false)}
    </div>
  );

  const renderMobilePanel = () => {
    const showingQuery = query.length > 2;
    const hasContent =
      (showingQuery && results.length > 0) ||
      trendingCategories.length > 0 ||
      previousSearches.length > 0;
    if (!hasContent) return null;
    return (
      <div className="md:hidden mb-4 pb-4 border-b border-gray-100">
        {renderLeftPanelContent(true)}
      </div>
    );
  };

  const renderProductGrid = (
    products: any[],
    isRaw: boolean,
    title: string,
  ) => (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-4">
        <h4 className="text-[13px] font-semibold text-gray-800 tracking-wide whitespace-nowrap">
          {title}
        </h4>
        <hr className="flex-1 border-gray-200" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {products.map((item) => {
          const product = isRaw ? item : item.data;
          const imageUrl = isRaw
            ? getProductImageUrl(item)
            : getProductImageUrl(item.data);
          return (
            <Link
              key={product._id}
              href={`/product/${product.slug}`}
              className="group block cursor-pointer"
              onClick={() => {
                addClickedItem({
                  type: "product",
                  name: product.name,
                  slug: product.slug,
                });
                onClose();
              }}
            >
              <div className="relative aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover opacity-100"
                />
              </div>
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

      {/* ── View All + Categories (query mode only) ── */}
      {showingQuery && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <Link
            href={
              results[0]?.type === "category"
                ? `/${results[0].data.slug}`
                : `/product/${results[0]?.data?.slug}`
            }
            onClick={() => {
              if (results[0]) {
                addClickedItem(
                  results[0].type === "category"
                    ? {
                        type: "category",
                        name: results[0].data.name,
                        categoryName: results[0].data.name,
                      }
                    : {
                        type: "product",
                        name: results[0].data.name,
                        slug: results[0].data.slug,
                      },
                );
              }
              addSearchQuery(query);
              onClose();
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#8c7e4e] text-[#8c7e4e] hover:bg-[#8c7e4e] hover:text-white text-[13px] font-semibold tracking-wide transition-all duration-200 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            View all results for &ldquo;{query}&rdquo;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          {/* ── Categories as product-style grid ── */}
          {matchedCategories.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-3 mb-3">
                <h4 className="text-[13px] font-semibold text-gray-800 tracking-wide whitespace-nowrap">
                  Categories for &ldquo;{query}&rdquo;:
                </h4>
                <hr className="flex-1 border-gray-200" />
              </div>

              {(() => {
                // Best matched category from search results
                const bestMatch = matchedCategories[0];

                // All other categories from allCategories, excluding any that appear in matchedCategories
                const matchedSlugs = new Set(
                  matchedCategories.map((m: any) => m.data.slug),
                );
                const otherCategories = trendingCategories
                  .filter((c) => !matchedSlugs.has(c.slug))
                  .slice(0, 4); // fill up to 4 more so total is 5

                // Combined: best match first, then others
                const displayCategories = [
                  {
                    slug: bestMatch.data.slug,
                    name: bestMatch.data.name,
                    isBestMatch: true,
                    catObj: allCategories.find(
                      (c) =>
                        c.slug === bestMatch.data.slug ||
                        c.name.toLowerCase() ===
                          bestMatch.data.name.toLowerCase(),
                    ),
                  },
                  ...otherCategories.map((c) => ({
                    slug: c.slug,
                    name: c.name,
                    isBestMatch: false,
                    catObj: c,
                  })),
                ];

                return (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                    {displayCategories.map((entry, i) => {
                      const catImageUrl = entry.catObj
                        ? getCategoryImageUrl(
                            entry.catObj,
                            "/assets/default-image.png",
                          )
                        : "/assets/default-image.png";

                      return (
                        <Link
                          key={i}
                          href={`/${entry.slug}`}
                          onClick={() => {
                            addClickedItem({
                              type: "category",
                              name: entry.name,
                              categoryName: entry.name,
                            });
                            onClose();
                          }}
                          className="group block cursor-pointer"
                        >
                          <div className="relative aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden">
                            <Image
                              src={catImageUrl}
                              alt={entry.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {entry.isBestMatch && (
                              <span className="absolute top-2 left-2 text-[10px] bg-[#8c7e4e] text-white px-1.5 py-0.5 rounded font-semibold z-10">
                                Best Match
                              </span>
                            )}
                          </div>
                          <div className="mt-2 px-0.5">
                            <h5 className="text-[12px] text-gray-800 font-medium line-clamp-2 leading-snug">
                              {entry.name}
                            </h5>
                            <span className="inline-block mt-1.5 border-b border-black text-[11px] text-black uppercase tracking-wide transition-all duration-300 group-hover:tracking-widest group-hover:text-[#b3a660]">
                              Shop Now
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  const showingQuery = query.length > 2;
  const productTitle = showingQuery
    ? `Trending Products for "${query}":`
    : "Trending Products:";

  return (
    <>
      <div
        className="fixed inset-0 z-[9998]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed left-0 right-0 z-[9999] font-[family-name:var(--font-montserrat)] px-0 md:px-[5%] transition-all duration-300"
        style={{ top: `${navbarBottom + 12}px` }}
      >
        <div
          className="relative w-full shadow-2xl md:rounded-b-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #e2f7cf 0%, #f7efbe 100%)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 md:right-4 text-gray-500 hover:text-gray-900 text-xl leading-none transition-colors z-10 cursor-pointer"
            aria-label="Close search"
          >
            ✕
          </button>

          <div className="px-3 md:px-6 pt-4 md:pt-5 pb-3 pr-10 md:pr-12">
            <div className="relative">
              <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
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
                className="w-full py-2.5 pl-10 md:pl-11 pr-10 text-sm rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-[#b3a660] shadow-sm placeholder-gray-400 transition-all"
                placeholder="I'm Looking for..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#b3a660] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          <div className="mx-2 md:mx-4 mb-3 md:mb-4 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-3 md:px-5 py-4 md:py-5 overflow-y-auto max-h-[70vh] md:max-h-[65vh] custom-scrollbar">
              {renderMobilePanel()}
              <div className="flex flex-col md:flex-row gap-6 min-h-0">
                {renderLeftPanel()}
                <div className="flex-1 min-w-0 overflow-y-auto max-h-[58vh] custom-scrollbar">
                  {showingQuery
                    ? matchedProducts.length > 0
                      ? renderProductGrid(matchedProducts, false, productTitle)
                      : !isLoading && (
                          <p className="text-gray-400 text-center py-8 text-sm italic">
                            No results found for &ldquo;{query}&rdquo;.
                          </p>
                        )
                    : trendingProducts.length > 0 &&
                      renderProductGrid(trendingProducts, true, productTitle)}
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
