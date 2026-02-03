"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { searchService } from "@/app/services/searchService";

const PREVIOUS_SEARCHES_KEY = "previous_searches";
const MAX_PREVIOUS_SEARCHES = 5;

interface PreviousSearchItem {
  type: "product" | "category";
  name: string;
  slug?: string;
  categoryName?: string;
}

// Helper functions for local storage
const getPreviousSearches = (): PreviousSearchItem[] => {
  if (typeof window === "undefined") return [];
  const searches = localStorage.getItem(PREVIOUS_SEARCHES_KEY);
  return searches ? JSON.parse(searches) : [];
};

const addClickedItem = (item: PreviousSearchItem) => {
  if (typeof window === "undefined") return;
  const items = getPreviousSearches();

  let identifier: string;
  if (item.type === "product") {
    identifier = `product-${item.slug}`;
  } else {
    identifier = `category-${item.categoryName}`;
  }

  const updatedItems = [
    item,
    ...items.filter((existingItem) => {
      let existingIdentifier: string;
      if (existingItem.type === "product") {
        existingIdentifier = `product-${existingItem.slug}`;
      } else {
        existingIdentifier = `category-${existingItem.categoryName}`;
      }
      return existingIdentifier !== identifier;
    }),
  ].slice(0, MAX_PREVIOUS_SEARCHES);
  localStorage.setItem(PREVIOUS_SEARCHES_KEY, JSON.stringify(updatedItems));
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previousSearches, setPreviousSearches] = useState<
    PreviousSearchItem[]
  >([]);

  useEffect(() => {
    if (isOpen) {
      setPreviousSearches(getPreviousSearches());
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

  const handlePreviousSearchClick = (item: PreviousSearchItem) => {
    // Optionally, you might want to populate the search bar with the item's name
    // setQuery(item.name);
    // Or just close the modal and let the Link handle navigation
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/90 flex justify-center pt-20 font-[family-name:var(--font-montserrat)]">
      <div className="w-full max-w-2xl px-4 relative">
        <button
          onClick={onClose}
          className="absolute -top-10 right-4 text-white text-2xl"
        >
          ✕
        </button>
        <input
          type="text"
          className="w-full p-4 text-lg border-b-2 border-white bg-transparent text-white focus:outline-none placeholder-gray-400"
          placeholder="I'm Looking for..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="mt-8 text-white">
          {isLoading && <p>Loading...</p>}
          {!isLoading && results.length > 0 && (
            <>
              <h4 className="text-xl mb-4 font-semibold">Search Results</h4>
              <ul className="space-y-2">
                {results.map((item, i) => {
                  const clickedItem: PreviousSearchItem =
                    item.type === "product"
                      ? {
                          type: "product",
                          name: item.data.name,
                          slug: item.data.slug,
                        }
                      : {
                          type: "category",
                          name: item.data.name,
                          categoryName: item.data.name,
                        };

                  return (
                    <li key={i}>
                      <Link
                        href={
                          item.type === "product"
                            ? `/product/${item.data.slug}`
                            : `/product-list?category=${encodeURIComponent(item.data.name)}`
                        }
                        className="hover:text-yellow-400 transition-colors"
                        onClick={() => {
                          addClickedItem(clickedItem);
                          onClose();
                        }}
                      >
                        {item.data.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          {!isLoading && results.length === 0 && query.length > 2 && (
            <p>No results found.</p>
          )}

          {/* Previous Searches and Suggestions */}
          {!isLoading && query.length <= 2 && (
            <>
              {previousSearches.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl mb-4 font-semibold">
                    Previous Searches
                  </h4>
                  <ul className="flex flex-wrap gap-2">
                    {previousSearches.map((item, i) => (
                      <li key={i}>
                        <Link
                          href={
                            item.type === "product"
                              ? `/product/${item.slug}`
                              : `/product-list?category=${encodeURIComponent(item.categoryName || "")}`
                          }
                          onClick={() => {
                            handlePreviousSearchClick(item);
                            // Ensure the modal closes when navigating
                            onClose();
                          }}
                          className="bg-gray-700/50 hover:bg-gray-600/50 text-white text-sm py-1 px-3 rounded-full transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <h4 className="text-xl mb-4 font-semibold">Product Suggestion</h4>
              <ul className="space-y-2">
                {["Sarees", "Lehengas", "Suits", "Gowns"].map((item, i) => (
                  <li key={i}>
                    <Link
                      href={`/product-list?category=${encodeURIComponent(item)}`}
                      className="hover:text-yellow-400 transition-colors"
                      onClick={onClose}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
