import { apiFetch } from './api';
import { CartItem } from '../hooks/useCart';

export const fetchCart = async (): Promise<{ success: boolean; data: { items: CartItem[] } }> => {
    return apiFetch('/cart');
};

export const addToCart = async (productId: string, variantId: string, quantity: number, size: string, price: number, discountPrice: number) => {
    return apiFetch('/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, variantId, quantity, size, price, discountPrice }),
    });
};

export const removeFromCart = async (itemId: string) => {
    return apiFetch(`/cart/remove/${itemId}`, {
        method: 'DELETE',
    });
};

export const applyCoupon = async (code: string, cartTotal: number, cartItems: CartItem[]) => {
    return apiFetch('/coupons/apply', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, cartTotal, cartItems }),
    });
};

export const updateCartItemQuantity = async (itemId: string, quantity: number) => {
    return apiFetch(`/cart/update/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
    });
};
