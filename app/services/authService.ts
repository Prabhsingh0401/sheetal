import Cookies from 'js-cookie';
import { apiFetch } from './api';

const TOKEN_KEY = 'token';

interface VerifyTokenResponse {
    success: boolean;
    token: string;
    user: any; 
    message?: string;
}

export const verifyIdToken = async (idToken: string): Promise<VerifyTokenResponse> => {
    return apiFetch('/client/auth/verify-id-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    });
};

export const login = (token: string) => {
    Cookies.set(TOKEN_KEY, token, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
};

export const logout = () => {
    Cookies.remove(TOKEN_KEY);
};

export const getToken = (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};
