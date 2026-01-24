'use client';
import React from 'react';
import { useWishlist } from '../../hooks/useWishlist';
import WishlistItemCard from './WishlistItemCard';
import Link from 'next/link';

const WishlistContent = () => {
    const { wishlist, loading, toggleProductInWishlist } = useWishlist();

    const processedWishlist = wishlist.map(p => {
        let lowestPrice = Infinity;
        let lowestMrp = Infinity;

        p.variants?.forEach(variant => {
            variant.sizes?.forEach(size => {
                const currentPrice = size.discountPrice && size.discountPrice > 0 ? size.discountPrice : size.price;
                if (currentPrice < lowestPrice) {
                    lowestPrice = currentPrice;
                    lowestMrp = size.price;
                }
            });
        });

        if (lowestPrice === Infinity) {
            lowestPrice = 0; 
            lowestMrp = 0;    
        }

        const discountPercent =
          lowestMrp > 0 && lowestPrice < lowestMrp
            ? Math.round(((lowestMrp - lowestPrice) / lowestMrp) * 100)
            : 0;

        return {
            ...p, 
            lowestPrice,
            lowestMrp,
            discountPercent
        };
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#bd9951] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!wishlist || wishlist.length === 0) {
        return (
            <div className="text-center min-h-[50vh] flex flex-col justify-center items-center my-50">
                <h4 className="text-2xl font-medium mb-4">Your Wishlist is Empty</h4>
                <p className="text-gray-600 mb-6">Looks like you haven't added anything to your wishlist yet.</p>
                <Link href="/product-list"
                   className="inline-block bg-[#6b4a1f] text-white py-3 px-8 text-md tracking-wide hover:bg-opacity-90 transition cursor-pointer">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 sm:py-16 mt-15">
            <div className="text-center mb-8">
                <h4 className="text-3xl font-medium font-optima text-[#70480c]">My Wishlist <span className="text-gray-500 font-light text-xl">({wishlist.length} items)</span> </h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {processedWishlist.map(product => (
                    <WishlistItemCard 
                        key={product._id} 
                        product={product}
                        onRemove={toggleProductInWishlist} 
                    />
                ))}
            </div>
        </div>
    );
};

export default WishlistContent;
