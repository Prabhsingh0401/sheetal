"use client";
import React, { useEffect, useState } from 'react';
import { Product, fetchProductBySlug, getProductImageUrl } from '../../services/productService';
import ProductImageGallery from '../../product/components/ProductImageGallery';
import { getApiImageUrl } from '../../services/api';
import Image from 'next/image';
import { useWishlist } from '../../hooks/useWishlist';

import { useCart } from '../../hooks/useCart';

interface QuickViewProps {
    productSlug: string | null;
    onClose: () => void;
}

const QuickView: React.FC<QuickViewProps> = ({ productSlug, onClose }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const { isProductInWishlist, toggleProductInWishlist } = useWishlist();
    const { addToCart } = useCart();
    
    useEffect(() => {
        if (productSlug) {
            const getProduct = async () => {
                setLoading(true);
                try {
                    const response = await fetchProductBySlug(productSlug);
                    if (response.success && response.data) {
                        setProduct(response.data);
                        const mainImg = getProductImageUrl(response.data);
                        setSelectedImage(mainImg);

                        // Default size and color logic: find first available variant, its color, and its size
                        const firstAvailableVariant = response.data.variants?.find((v: any) => Array.isArray(v.sizes) && v.sizes.length > 0 && v.sizes.some((s: any) => s.stock > 0));
                        if (firstAvailableVariant) {
                            if (firstAvailableVariant.color?.name) {
                                setSelectedColor(firstAvailableVariant.color.name);
                            }
                            const firstAvailableSize = firstAvailableVariant.sizes.find((s: any) => s.stock > 0);
                            if (firstAvailableSize) {
                                setSelectedSize(firstAvailableSize.name);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch product", error);
                } finally {
                    setLoading(false);
                }
            };
            getProduct();
        }
    }, [productSlug]);

    const handleAddToCart = async () => {
        if (product) {
            const selectedVariant = product.variants.find(variant => variant.color?.name === selectedColor);
            if (selectedVariant) {
                await addToCart(product._id, selectedVariant._id, quantity, selectedSize);
                onClose();
            } else {
                console.error("Selected variant not found");
            }
        }
    };

    if (!productSlug) {
        return null;
    }

    const price = Number(product?.discountPrice && product.discountPrice > 0 ? product.discountPrice : product?.price ?? 0);
    const originalPrice = Number(product?.price ?? 0);
    const discount = originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const galleryImages = [
        getProductImageUrl(product || undefined),
        ...(product?.images?.map(img => getApiImageUrl(img.url)) || [])
    ].filter(Boolean) as string[];

    // Derive all unique colors, all unique sizes, and a map of color to available sizes
    const allUniqueColors: { name: string; image: string; }[] = [];
    const allUniqueSizeNames = new Set<string>();
    const colorToAvailableSizesMap = new Map<string, Set<string>>(); // Map: colorName -> Set<sizeName>

    // To store overall stock for each size for `allUniqueSizes`
    const sizeOverallStockMap = new Map<string, { totalStock: number, minLeft: number }>();

    product?.variants?.forEach(v => {
        // Collect unique colors
        if (v.color && typeof v.color === 'object' && v.color.name && !allUniqueColors.some(c => c.name === v.color!.name)) {
            allUniqueColors.push({
                name: v.color!.name,
                image: v.v_image ? getApiImageUrl(v.v_image) : getProductImageUrl(product)
            });
        }

        if (Array.isArray(v.sizes)) {
            v.sizes.forEach(s => {
                if (s?.name) {
                    allUniqueSizeNames.add(s.name); // Collect all unique size names across all variants

                    const currentStock = sizeOverallStockMap.get(s.name) || { totalStock: 0, minLeft: Infinity };
                    currentStock.totalStock += s.stock || 0;
                    currentStock.minLeft = Math.min(currentStock.minLeft, s.stock || 0);
                    sizeOverallStockMap.set(s.name, currentStock);

                    // Populate colorToAvailableSizesMap
                    if (v.color && typeof v.color === 'object' && v.color.name && s.stock > 0) {
                        if (!colorToAvailableSizesMap.has(v.color!.name)) {
                            colorToAvailableSizesMap.set(v.color!.name, new Set<string>());
                        }
                        colorToAvailableSizesMap.get(v.color!.name)?.add(s.name);
                    }
                }
            });
        }
    });

    const allSizesForDisplay = Array.from(allUniqueSizeNames).map(sizeName => {
        const stockInfo = sizeOverallStockMap.get(sizeName);
        return {
            name: sizeName,
            available: stockInfo ? stockInfo.totalStock > 0 : false,
            left: stockInfo ? stockInfo.minLeft : 0
        };
    });

    const handleColorChange = (color: { name: string; image: string }) => {
        setSelectedColor(color.name);
        setSelectedImage(color.image);

        // Check if previously selected size is available for the new color
        const availableSizesForNewColor = colorToAvailableSizesMap.get(color.name);
        if (selectedSize && availableSizesForNewColor && !availableSizesForNewColor.has(selectedSize)) {
            setSelectedSize(""); // Reset if not available
        }
        // Optionally, auto-select the first available size for the new color if no size is selected
        if (!selectedSize && availableSizesForNewColor && availableSizesForNewColor.size > 0) {
            setSelectedSize(Array.from(availableSizesForNewColor)[0]);
        }
    };


    return (
        <div className="fixed inset-0 z-[1005] flex items-center justify-center bg-black/60" onClick={onClose}>
            <div className="relative w-full max-w-4xl p-4 mx-auto bg-white rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-4 right-4 text-gray-500 border px-2 hover:text-gray-700 text-2xl font-bold z-10" onClick={onClose}>&times;</button>
                <div className="container mx-auto mt-8">
                    {loading ? (
                        <div className="flex justify-center items-center h-96">
                            <div className="w-16 h-16 border-4 border-[#bd9951] border-dashed rounded-full animate-spin"></div>
                        </div>
                    ) : product ? (
                        <div className="flex flex-wrap -mx-2">
                            <div className="w-full sm:w-1/2 px-2">
                                <ProductImageGallery
                                    images={galleryImages}
                                    selectedImage={selectedImage || galleryImages[0]}
                                    onImageChange={setSelectedImage}
                                    title={product.name}
                                    isWishlisted={isProductInWishlist(product._id)}
                                    onToggleWishlist={() => toggleProductInWishlist(product._id)}
                                    onScrollToSimilar={() => {}}
                                />
                            </div>
                            <div className="w-full sm:w-1/2 px-2 text-left relative">
                                <div className="mb-4">
                                    <h2 className="text-2xl md:text-3xl font-medium text-[#683e14] mb-2 font-[family-name:var(--font-optima)]">{product.name}</h2>
                                    <div className="text-gray-700 text-sm mb-4">
                                        <p>{product.shortDescription}</p>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <div className="flex items-end gap-3">
                                        <span className="text-3xl font-medium">
                                            ₹ {price.toFixed(2)}
                                        </span>
                                        {/* Removed originalPrice > price condition */}
                                            <span className="text-lg text-gray-400 line-through">
                                                ₹ {originalPrice.toFixed(2)}
                                            </span>
                                        {discount > 0 &&
                                            <span className="text-lg text-green-600 font-semibold">
                                                Save {discount}%
                                            </span>
                                        }
                                    </div>
                                    <p className="text-xs text-gray-500">Inclusive of all taxes.</p>
                                </div>
                                {/* Color Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    Select Color:
                                    </label>
                                    <div className="flex gap-3">
                                    {Array.isArray(allUniqueColors) &&
                                        allUniqueColors.map((color: any, i: number) => (
                                        <div
                                            key={i}
                                            className={`w-12 h-16 border cursor-pointer hover:border-[#bd9951] p-0.5 relative ${selectedColor === color.name ? 'border-[#bd9951]' : 'border-gray-200'}`}
                                            onClick={() => {
                                                handleColorChange(color);
                                            }}
                                        >
                                            <Image
                                                src={color.image}
                                                alt={color.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                    </div>
                                </div>
                                {/* Size Selection */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Select Size:
                                        </label>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {Array.isArray(allSizesForDisplay) &&
                                            allSizesForDisplay.map((size: { name: string; available: boolean; left: number }) => {
                                                const isAvailableForSelectedColor = colorToAvailableSizesMap.get(selectedColor)?.has(size.name);
                                                const isDisabled = !isAvailableForSelectedColor; 
                                                
                                                return (
                                                    <div key={size.name} className="flex flex-col items-center">
                                                        <button
                                                            disabled={isDisabled}
                                                            onClick={() => setSelectedSize(size.name)}
                                                            className={`
                                                                ${size.name === 'One Size' ? 'px-3 py-2 rounded-md' : 'w-10 h-10 rounded-full'}
                                                                flex items-center justify-center border text-sm font-medium transition-colors relative overflow-hidden
                                                                ${
                                                                    isDisabled
                                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                                    : ""
                                                                }
                                                                ${
                                                                    selectedSize === size.name && !isDisabled
                                                                    ? "border-[#bd9951]"
                                                                    : "border-gray-300 text-gray-700 hover:border-[#bd9951] cursor-pointer"
                                                                }
                                                            `}
                                                        >
                                                            {size.name}
                                                            {isDisabled && <div className="absolute w-full h-px bg-gray-400 transform rotate-45"></div>}
                                                        </button> 

                                                        {isAvailableForSelectedColor && size.left <= 2 && (
                                                            <span className="text-[10px] bg-[#f5a623] text-white px-2 py-0.5 rounded-sm font-semibold">
                                                                {size.left} left
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                                <div className="mb-8 hidden lg:block">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-20">
                                            <input
                                                type="number"
                                                min="1"
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                                className="w-full h-12 border border-gray-300 text-center focus:outline-none focus:border-[#bd9951]"
                                            />
                                        </div>
                                        <button onClick={handleAddToCart} className="flex-1 h-12 bg-white border border-[#fe5722] text-[#fe5722] uppercase font-medium tracking-wider hover:bg-gray-100 cursor-pointer transition-colors">
                                            Add to Cart
                                        </button>
                                        <button className="flex-1 h-12 bg-[#fe5722] text-white border border-[#bd9951] uppercase font-medium tracking-wider cursor-pointer transition-colors shadow-lg">
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">Product not found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuickView;