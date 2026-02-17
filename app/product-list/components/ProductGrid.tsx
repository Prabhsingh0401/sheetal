"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductGridProps {
  products: Product[];
  viewMode: "grid" | "list";
  onToggleWishlist: (productId: string) => void;
  onQuickView: (productSlug: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  viewMode,
  onToggleWishlist,
  onQuickView,
}) => {
  return (
    <div
      className={`grid gap-4 xl:gap-10 grid-cols-2 ${viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-4" : "lg:grid-cols-2"}`}
    >
      {products.map((product) => (
        <div
          key={product._id}
          className={`group flex transition-all rounded-xl p-2 
            ${viewMode === "grid" ? "flex-col h-full" : "flex-row h-full items-center gap-4"}
          `}
        >
          {/* Image Container */}
          <div
            className={`relative overflow-hidden bg-[#f7f7f7] rounded-lg shadow-sm shrink-0 
              ${viewMode === "grid" ? "mb-5 aspect-[3/4] w-full" : "w-[40%] aspect-[3/4]"}
          `}
          >
            {product.soldOut && (
              <div className="absolute top-0 left-0 z-10 bg-red-600 text-white text-[9px] px-4 py-1.5 tracking-[0.2em] font-bold uppercase rounded-r-sm">
                Sold Out
              </div>
            )}

            <Link
              href={`/product/${product.slug}`}
              className="block w-full h-full relative overflow-hidden rounded-lg"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-lg">
                <Image
                  src={product.hoverImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </Link>

            {/* Action Icons (Grid Mode Only usually, but let's keep for both or hide in list if preferred. Keeping for now) */}
            <div className="absolute top-2 right-2 flex flex-col gap-3 transform translate-x-12 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
              <button
                className="w-10 h-10 rounded-full flex items-center justify-cente group/icon"
                onClick={() => onToggleWishlist(product._id)} // Add onClick handler
              >
                <Image
                  src={
                    product.isWishlisted
                      ? "/assets/icons/heart-solid.svg"
                      : "/assets/icons/heart.svg"
                  } // Conditional heart icon
                  alt="Wishlist"
                  width={18}
                  height={18}
                  className={
                    product.isWishlisted
                      ? ""
                      : "group-hover/icon:brightness-0 group-hover/icon:invert"
                  } // No invert for filled heart
                />
              </button>
            </div>

            {/* Quick View Button (Grid Mode Only usually) */}
            <button
              onClick={() => onQuickView(product.slug)}
              className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm py-4 text-[11px] font-bold uppercase tracking-[0.2em] transform translate-y-full transition-transform duration-500 group-hover:translate-y-0 hover:bg-[#bd9951] hover:text-white cursor-pointer"
            >
              Quick View
            </button>
          </div>

          {/* Info Container */}
          <div
            className={`flex flex-col flex-grow px-1 font-[family-name:var(--font-montserrat)] mb-3${viewMode === "grid" ? "text-left" : "text-left items-start pl-4"}`}
          >
            <h3
              className={`text-lg leading-snug line-clamp-2 pb-1 ${viewMode === "grid" ? "text-lg" : "text-[18px]"}`}
            >
              <Link
                href={`/product/${product.slug}`}
                className="hover:text-[#bd9951] transition-colors uppercase tracking-tight"
              >
                {product.name}
              </Link>
            </h3>

            {/* Size and Rating */}
            <div
              className={`flex flex-col gap-1 mb-3 mt-3 ${viewMode === "grid" ? "items-start" : "items-start"}`}
            >
              {/* <span className="text-md font-light">
                 <span className="font-medium">Size:</span> {product.size}
               </span> */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Image
                    key={i}
                    src={
                      i < product.rating
                        ? "/assets/y-star.png"
                        : "/assets/gray-star.png"
                    }
                    alt="star"
                    width={16}
                    height={16}
                  />
                ))}
              </div>
            </div>

            <div
              className={`flex flex-nowrap items-center gap-1.5 sm:gap-3 mb-3 ${viewMode === "grid" ? "justify-start" : "justify-start"}`}
            >
              <span className="text-[13px] sm:text-base font-bold text-gray-900 whitespace-nowrap">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-[11px] sm:text-sm text-gray-400 line-through whitespace-nowrap">
                ₹{product.mrp.toLocaleString()}
              </span>
              <span className="text-[11px] sm:text-sm text-[#B78D65] font-semibold whitespace-nowrap uppercase tracking-tight">
                {product.discount}
              </span>
            </div>

            <div
              className={`mt-auto flex ${viewMode === "grid" ? "justify-start" : "justify-start"}`}
            >
              <Link
                href={`/product/${product.slug}`}
                className="inline-block border-b border-black text-black py-2 pr-8 uppercase text-[14px] transition-all duration-500 hover:tracking-[1px]"
              >
                View Detail
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
interface Product {
  _id: string;
  slug: string;
  name: string;
  image: string;
  hoverImage: string;
  price: number;
  mrp: number;
  discount: string;
  size: string;
  rating: number;
  soldOut: boolean;
  isWishlisted: boolean;
}
export default ProductGrid;
