import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { fetchCart, addToCart as addToCartApi, removeFromCart as removeFromCartApi } from '../services/cartService';
import { toggleWishlist as toggleWishlistApi, Product } from '../services/productService'; // Assuming Product is exported from productService

export interface CartItem {
    _id: string;
    product: Product;
    quantity: number;
    color: string;
    size: string;
}

interface CartApiResponse {
    success: boolean;
    data: CartItem[] | { items: CartItem[] };
}

interface UseCartReturn {
    cart: CartItem[];
    loading: boolean;
    error: string | null;
    addToCart: (productId: string, variantId: string, quantity: number, size: string) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    moveFromCartToWishlist: (itemId: string, productId: string) => Promise<void>;
}

export const useCart = (): UseCartReturn => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response: CartApiResponse = await fetchCart();
            if (response.success && response.data) {
                if (Array.isArray(response.data)) {
                    setCart(response.data);
                } else if ('items' in response.data && Array.isArray(response.data.items)) {
                    setCart(response.data.items);
                } else {
                    setError('Invalid cart data structure');
                }
            } else {
                setError('Failed to fetch cart');
            }
        } catch (err: any) {
            console.error("Error loading cart:", err);
            setError(err.message || 'An error occurred while fetching cart');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const addToCart = useCallback(async (productId: string, variantId: string, quantity: number, size: string) => {
        try {
            const response = await addToCartApi(productId, variantId, quantity, size);
            if (response.success) {
                toast.success(response.message || 'Product added to cart!');
                await loadCart();
            } else {
                toast.error(response.message || 'Failed to add to cart.');
            }
        } catch (err: any) {
            console.error("Error adding to cart:", err);
            toast.error('Could not add to cart. Please try again.');
        }
    }, [loadCart]);

    const removeFromCart = useCallback(async (itemId: string) => {
        try {
            const response = await removeFromCartApi(itemId);
            if (response.success) {
                toast.success(response.message || 'Item removed from cart!');
                await loadCart();
            } else {
                toast.error(response.message || 'Failed to remove item from cart.');
            }
        } catch (err: any) {
            console.error("Error removing from cart:", err);
            toast.error('Could not remove item from cart. Please try again.');
        }
    }, [loadCart]);

    const moveFromCartToWishlist = useCallback(async (itemId: string, productId: string) => {
        try {
            const removeResponse = await removeFromCartApi(itemId);
            if (removeResponse.success) {
                toast.success('Item removed from cart!');
                await loadCart();
                const wishlistResponse = await toggleWishlistApi(productId);
                if(wishlistResponse.success) {
                    toast.success('Item added to wishlist!');
                } else {
                    toast.error(wishlistResponse.message || 'Failed to add to wishlist.');
                }
            } else {
                toast.error(removeResponse.message || 'Failed to remove item from cart.');
            }
        } catch (err: any) {
            console.error("Error moving to wishlist:", err);
            toast.error('Could not move item to wishlist. Please try again.');
        }
    }, [loadCart]);

    return {
        cart,
        loading,
        error,
        addToCart,
        removeFromCart,
        moveFromCartToWishlist,
    };
};
