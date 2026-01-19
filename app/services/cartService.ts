import { apiFetch } from './api';

export const addToCart = async (productId: string, quantity: number, size: string, color: string) => {
    return apiFetch('/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity, size, color }),
    });
};

export const getCart = async () => {
    return apiFetch('/cart');
};
