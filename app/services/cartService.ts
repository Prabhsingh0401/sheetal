import { apiFetch } from './api';

export interface CartProduct {
    _id: string;
    name: string;
    price?: number; // Make price optional
    discountPrice?: number; // Make discountPrice optional
    mainImage?: {
        url?: string;
    };
}

export interface CartItem {
    _id: string; // Add _id for the cart item itself
    product: CartProduct;
    quantity: number;
    size: string;
    color: string;
}

export interface CartResponse {
    success: boolean;
    data: {
        _id: string;
        user: string;
        items: CartItem[];
        createdAt: string;
        updatedAt: string;
    };
    message?: string;
}

export const addToCart = async (productId: string, quantity: number, size: string, color: string) => {
    return apiFetch('/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity, size, color }),
    });
};

export const getCart = async (): Promise<CartResponse> => {
    return apiFetch('/cart');
};

export const removeFromCart = async (itemId: string): Promise<CartResponse> => {
    return apiFetch(`/cart/${itemId}`, {
        method: 'DELETE',
    });
};
