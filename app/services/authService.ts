import Cookies from "js-cookie";
import { apiFetch } from "./api";

const TOKEN_KEY = "token";
const USER_KEY = "user_details";

interface User {
  id: string;
  name?: string;
  phoneNumber?: string;
  email?: string;
  role: string;
  alternativeMobileNumber?: string; // Added
  gender?: "Male" | "Female"; // Added
  dateOfBirth?: string; // Added (assuming ISO string format from backend)
  profilePicture?: string; // Added
}

interface VerifyTokenResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export const verifyIdToken = async (
  idToken: string,
): Promise<VerifyTokenResponse> => {
  return apiFetch("/client/auth/verify-id-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
};

export const login = (token: string, user: User) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const logout = () => {
  Cookies.remove(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const getUserDetails = (): User | null => {
  if (typeof window === "undefined") {
    // Check if running on client side
    return null;
  }
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken() && !!getUserDetails();
};

export const updateUserDetailsInLocalStorage = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};
