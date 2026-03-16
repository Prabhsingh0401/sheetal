"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

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
      className={`grid gap-1 md:gap-3 xl:gap-5
        ${viewMode === "grid"
          ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
        }`}
    >
      {products.map((product) => (
        <div
          key={product._id}
          className={`group flex transition-all rounded-xl p-1 md:p-2
            ${viewMode === "grid" ? "flex-col h-full" : "flex-row h-full items-center gap-3 md:gap-6"}
          `}
        >
          {/* Image Container */}
          <div
            className={`relative overflow-hidden bg-[#f7f7f7] rounded-lg shadow-sm shrink-0
              ${viewMode === "grid"
                ? "mb-3 md:mb-5 aspect-[3/4] w-full"
                : "w-[40%] sm:w-[30%] md:w-[220px] aspect-[3/4]"
              }`}
          >
            {product.soldOut && (
              <div className="absolute top-0 left-0 z-10 bg-red-600 text-white text-[8px] md:text-[9px] px-2 md:px-4 py-1 md:py-1.5 tracking-[0.2em] font-bold uppercase rounded-r-sm">
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
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-lg">
                <Image
                  src={product.hoverImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
            </Link>

            {/* Wishlist icon */}
            <div className="absolute top-2 right-2 flex flex-col gap-3 transform translate-x-12 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
              <button
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center group/icon cursor-pointer"
                onClick={() => onToggleWishlist(product._id)}
              >
                <Image
                  src={
                    product.isWishlisted
                      ? "/assets/icons/heart-solid.svg"
                      : "/assets/icons/heart.svg"
                  }
                  alt="Wishlist"
                  width={16}
                  height={16}
                  className={
                    product.isWishlisted
                      ? ""
                      : "group-hover/icon:brightness-0 group-hover/icon:invert"
                  }
                />
              </button>
            </div>

            {/* Quick View — hidden on mobile, visible on hover for md+ */}
            <button
              onClick={() => onQuickView(product.slug)}
              className="hidden md:block absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm py-3 md:py-4 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] transform translate-y-full transition-transform duration-500 group-hover:translate-y-0 hover:bg-[#bd9951] hover:text-white cursor-pointer"
            >
              Quick View
            </button>
          </div>

          {/* Info */}
          <div
            className={`flex flex-col flex-grow px-0.5 md:px-1 font-[family-name:var(--font-montserrat)] mb-2 md:mb-3
              ${viewMode === "list" ? "pl-2 md:pl-4" : ""}`}
          >
            <h3 className="text-sm md:text-base lg:text-lg leading-snug line-clamp-2 pb-1">
              <Link
                href={`/product/${product.slug}`}
                className="hover:text-[#bd9951] transition-colors uppercase tracking-tight"
              >
                {product.name}
              </Link>
            </h3>

            {/* Stars */}
            <div className="flex items-center gap-0.5 my-2">
              {[...Array(5)].map((_, i) => (
                <Image
                  key={i}
                  src={i < product.rating ? "/assets/y-star.png" : "/assets/gray-star.png"}
                  alt="star"
                  width={12}
                  height={12}
                  className="w-3 h-3 md:w-4 md:h-4"
                />
              ))}
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-2 md:mb-3">
              <span className="text-xs sm:text-sm md:text-base font-bold text-gray-900 whitespace-nowrap">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm text-gray-400 line-through whitespace-nowrap">
                ₹{product.mrp.toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm text-[#B78D65] font-semibold whitespace-nowrap uppercase">
                {product.discount}
              </span>
            </div>

            <div className="mt-auto">
              <Link
                href={`/product/${product.slug}`}
                className="inline-block border-b border-black text-black py-1.5 md:py-2 pr-4 md:pr-8 uppercase text-[11px] md:text-[13px] transition-all duration-500 "
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

export default ProductGrid;