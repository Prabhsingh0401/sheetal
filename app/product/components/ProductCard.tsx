"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import StarRating from "./StarRating";

interface ProductCardProps {
  product: any;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

const ProductCard = ({
  product,
  isWishlisted = false,
  onToggleWishlist,
}: ProductCardProps) => {
  const wishlistProductId = product.productId || product._id || product.id;

  return (
    <div className="p-2 group">
      <div className="relative overflow-hidden mb-3">
        {product.soldOut && (
          <div className="absolute top-0 left-0 z-10 bg-red-600 px-2 py-1 rounded-lg">
            <span className="text-white text-xs font-semibold tracking-wider">
              SOLD OUT
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            className="bg-gray-500 p-2 rounded-full shadow-md cursor-pointer hover:bg-[#bd9951] hover:text-white transition-colors"
            onClick={() => {
              if (wishlistProductId && onToggleWishlist) {
                onToggleWishlist(wishlistProductId);
              }
            }}
          >
            <Image
              src={
                isWishlisted
                  ? "/assets/icons/heart-solid.svg"
                  : "/assets/icons/heart.svg"
              }
              alt="wishlist"
              width={16}
              height={16}
              className="w-4 h-4"
            />
          </button>
        </div>

        <Link href={`/product/${product.id}`}>
          <div className="relative aspect-[3/4]">
            <Image
              src={product.image || "/assets/placeholder-product.jpg"}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-500 group-hover:opacity-0 rounded-lg"
            />
            <Image
              src={product.hoverImage || "/assets/placeholder-product.jpg"}
              alt={product.name}
              fill
              className="object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-lg"
            />
          </div>
        </Link>
      </div>

      <div className="text-left">
        <h6 className="mb-2 text-sm font-medium line-clamp-2 h-[40px] leading-tight">
          <Link
            href={`/product/${product.id}`}
            className="hover:text-[#bd9951] transition-colors"
          >
            {product.name}
          </Link>
        </h6>

        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">Size: XL</span>
          <StarRating rating={4} />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-[#bd9951]">
            ₹ {product.price?.toFixed(2)}
          </span>
          <span className="line-through text-gray-400 text-xs">
            ₹ {product.mrp?.toFixed(2)}
          </span>
          <span className="text-[#bd9951] text-xs">[{product.discount}]</span>
        </div>

        <div className="mt-5 flex">
          <Link
            href={`/product/${product.id}`}
            className="inline-block border-b border-black text-black py-2 px-8 uppercase text-[12px] font-medium transition-all duration-500"
          >
            View Detail
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;