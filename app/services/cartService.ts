import { apiFetch } from './api';

export const fetchCart = async (): Promise<{ success: boolean; data: any[] }> => { // Replace `any` with a proper Cart type
    return apiFetch('/cart');
};

export const addToCart = async (productId: string, variantId: string, quantity: number, size: string) => {
    return apiFetch('/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, variantId, quantity, size }),
    });
};

export const removeFromCart = async (itemId: string) => {
    return apiFetch(`/cart/remove/${itemId}`, {
        method: 'DELETE',
    });
};