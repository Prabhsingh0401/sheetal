"use client";
import React, { useEffect, useState } from 'react';
import { Product, fetchProductBySlug, getProductImageUrl } from '../../services/productService';
import ProductImageGallery from '../../product/components/ProductImageGallery';
import { getApiImageUrl } from '../../services/api';
import Image from 'next/image';
import { useWishlist } from '../../hooks/useWishlist';

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
    

    useEffect(() => {
        if (productSlug) {
            const getProduct = async () => {
                setLoading(true);
                try {
                    const response = await fetchProductBySlug(productSlug);
                    if (response.success) {
                        setProduct(response.data);
                        const mainImg = getProductImageUrl(response.data);
                        setSelectedImage(mainImg);

                        // Default size logic: find first available size
                        const firstAvailableSize = response.data.variants?.find((v: any) => v.stock > 0);
                        if (firstAvailableSize) setSelectedSize(firstAvailableSize.size || "");

                        // Default color logic: find first available color
                        const firstAvailableColor = response.data.variants?.find((v: any) => v.color?.name);
                        if (firstAvailableColor && firstAvailableColor.color) setSelectedColor(firstAvailableColor.color.name);
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

    // Unique colors from variants
    const colorsMap = new Map();
    product?.variants?.forEach(v => {
        if (v.color && v.color.name) {
            if (!colorsMap.has(v.color.name)) {
                colorsMap.set(v.color.name, {
                    name: v.color.name,
                    image: v.v_image ? getApiImageUrl(v.v_image) : getProductImageUrl(product) 
                });
            }
        }
    });
    const displayColors = Array.from(colorsMap.values());

    // Unique sizes from variants
    const sizesMap = new Map();
    product?.variants?.forEach(v => {
      if (v.color && v.color.name === selectedColor) {
        v.sizes.forEach(s => {
            if (s.name) {
                const existing = sizesMap.get(s.name) || { name: s.name, stock: 0 };
                existing.stock += (s.stock || 0);
                sizesMap.set(s.name, existing);
            }
        });
      }
  });
    
    const displaySizes = Array.from(sizesMap.values()).map((s: any) => ({
        name: s.name,
        available: s.stock > 0,
        left: s.stock
    }));


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
                                    {Array.isArray(displayColors) &&
                                        displayColors.map((color: any, i: number) => (
                                        <div
                                            key={i}
                                            className={`w-12 h-16 border cursor-pointer hover:border-[#bd9951] p-0.5 relative ${selectedColor === color.name ? 'border-[#bd9951]' : 'border-gray-200'}`}
                                            onClick={() => {
                                                setSelectedColor(color.name);
                                                setSelectedImage(color.image);
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
                                        {Array.isArray(displaySizes) &&
                                            displaySizes.map((size: any) => (
                                            <div key={size.name} className="flex flex-col items-center">
                                                <button
                                                    disabled={!size.available}
                                                    onClick={() => setSelectedSize(size.name)}
                                                    className={`w-10 h-10 flex items-center justify-center border rounded-full text-sm font-medium transition-colors
                                                ${
                                                    !size.available
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : ""
                                                }
                                                ${
                                                    selectedSize === size.name
                                                    ? "border-[#bd9951]"
                                                    : "border-gray-300 text-gray-700 hover:border-[#bd9951] cursor-pointer"
                                                }
                                                `}
                                                >
                                                    {size.name}
                                                </button> 

                                                {/* Availability text BELOW each size */}
                                                {size.available && size.left <= 2 && (
                                                    <span className="text-[10px] bg-[#f5a623] text-white px-2 py-0.5 rounded-sm font-semibold">
                                                        {size.left} left
                                                    </span>
                                                )}
                                            </div>
                                        ))}
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
                                        <button className="flex-1 h-12 bg-white border border-[#fe5722] text-[#fe5722] uppercase font-medium tracking-wider hover:bg-gray-100 cursor-pointer transition-colors">
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