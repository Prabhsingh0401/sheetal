'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../services/productService';
import { getApiImageUrl } from '../../services/api';

interface WishlistItemCardProps {
    product: Product;
    onRemove: (productId: string) => void;
}

const WishlistItemCard: React.FC<WishlistItemCardProps> = ({ product, onRemove }) => {
    const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
    const mrp = product.price;
    const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    return (
        <div className="group p-2 flex flex-col">
            <div className="relative overflow-hidden bg-[#f7f7f7] rounded-lg">
                <button 
                    onClick={() => onRemove(product._id)}
                    className="absolute top-2 right-2 z-20 w-8 h-8 border border-[#f5eaac] rounded-full flex items-center justify-center text-[#f5eaac] hover:bg-gray-100 hover:text-[#bd9951] transition-all"
                    aria-label="Remove from wishlist"
                >
                    &times;
                </button>

                <Link href={`/product/${product.slug}`} className="block aspect-[3/4] relative">
                    <Image
                        src={getApiImageUrl(product.mainImage?.url)}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                    />
                    {product.hoverImage?.url && (
                        <Image
                            src={getApiImageUrl(product.hoverImage.url)}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                    )}
                </Link>
            </div>
            <div className="flex flex-col flex-grow pt-4 text-left font-[family-name:var(--font-montserrat)]">
                <h6 className="text-lg leading-snug line-clamp-2 pb-1">
                    <Link href={`/product/${product.slug}`} className="hover:text-[#bd9951] transition-colors">
                        {product.name}
                    </Link>
                </h6>
                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-md text-gray-900">&#8377; {price.toLocaleString()}</span>
                    {discountPercent > 0 && (
                        <>
                            <span className="text-md text-gray-500 line-through">&#8377; {mrp.toLocaleString()}</span>
                            <span className="text-md text-[#70480c]">{discountPercent}% OFF</span>
                        </>
                    )}
                </div>
                <div className="mt-auto">
                    {product.stock > 0 ? (
                        <button className="text-left text-sm border-b border-black text-black font-normal py-2 pr-6 uppercase transition-all duration-500 hover:text-black hover:tracking-[2px]">
                            Add to Cart
                        </button>
                    ) : (
                        <button className="text-left text-sm border-b border-black text-black font-normal py-2 pr-6 uppercase transition-all duration-500 hover:text-black hover:tracking-[2px]" disabled>
                            Sold Out
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WishlistItemCard;
