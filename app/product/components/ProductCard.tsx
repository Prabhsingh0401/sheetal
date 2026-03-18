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
  // productId = real MongoDB _id (passed explicitly from RelatedProducts)
  // _id       = real MongoDB _id (passed from other contexts)
  // id        = slug (used for routing only — never for wishlist)
  const wishlistProductId = product.productId || product._id;

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
        <div className="absolute top-2 right-2 z-10">
          <button
            type="button"
            className=" p-2 rounded-full shadow-md cursor-pointer hover:text-white transition-colors"
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
              width={20}
              height={20}
              className="w-5 h-5"
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
        <h6 className="mb-1 text-[16px] font-medium line-clamp-2 h-[40px] leading-tight font-[family-name:var(--font-montserrat)]">
          <Link
            href={`/product/${product.id}`}
            className="hover:text-[#bd9951] transition-colors"
          >
            {product.name}
          </Link>
        </h6>

        <div className="flex justify-between items-center mb-1">
          <span className="text-[16px] text-gray-800">Size: XL</span>
          <StarRating rating={4} />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-normal text-[16px] text-[#281b00]">
            ₹ {product.price?.toFixed(2)}
          </span>
          <span className="line-through text-gray-400 text-[14px]">
            ₹ {product.mrp?.toFixed(2)}
          </span>
          <span className="text-[#6a3f0b] text-[16px]">[{product.discount}]</span>
        </div>

        <div className="mt-5 flex justify-start">
          <Link
            href={`/product/${product.id}`}
            className="inline-block border-b border-black text-left text-black py-2 pr-4 uppercase text-[12px] font-medium transition-all duration-500"
          >
            View Detail
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;