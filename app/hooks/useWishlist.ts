import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { fetchWishlist, toggleWishlist as toggleWishlistApi, Product } from '../services/productService'; // Assuming Product is exported from productService

interface UseWishlistReturn {
    wishlist: Product[]; // Changed from wishlistIds
    loading: boolean;
    error: string | null;
    toggleProductInWishlist: (productId: string) => Promise<void>;
    isProductInWishlist: (productId: string) => boolean;
}

export const useWishlist = (): UseWishlistReturn => {
    const [wishlist, setWishlist] = useState<Product[]>([]); // Changed from wishlistIds
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadWishlist = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchWishlist();
            if (response.success && Array.isArray(response.data)) {
                setWishlist(response.data); // Store full product objects
            } else {
                setError('Failed to fetch wishlist');
            }
        } catch (err: any) {
            console.error("Error loading wishlist:", err);
            setError(err.message || 'An error occurred while fetching wishlist');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadWishlist();
    }, [loadWishlist]);

    const toggleProductInWishlist = useCallback(async (productId: string) => {
        try {
            const response = await toggleWishlistApi(productId);
            if (response.success) {
                toast.success(response.message || 'Wishlist updated!');
                await loadWishlist(); // Reload the wishlist to get fresh data
            } else {
                toast.error(response.message || 'Failed to update wishlist.');
            }
        } catch (err: any) {
            console.error("Error toggling wishlist item:", err);
            toast.error('Could not update wishlist. Please try again.');
        }
    }, [loadWishlist]);

    const isProductInWishlist = useCallback((productId: string) => {
        return wishlist.some(p => p._id === productId);
    }, [wishlist]);

    return {
        wishlist,
        loading,
        error,
        toggleProductInWishlist,
        isProductInWishlist
    };
};
