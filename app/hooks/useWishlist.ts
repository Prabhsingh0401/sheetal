"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  fetchWishlist,
  toggleWishlist as toggleWishlistApi,
  Product,
} from "../services/productService";
import {
  dispatchWishlistUpdated,
  WISHLIST_UPDATED_EVENT,
} from "./shopEvents";
import {
  consumeRedirectModalState,
  redirectToLogin,
} from "../utils/authRedirect";

export interface UseWishlistReturn {
  wishlist: Product[];
  loading: boolean;
  error: string | null;
  toggleProductInWishlist: (productId: string) => Promise<void>;
  isProductInWishlist: (productId: string) => boolean;
  isLoginModalOpen: boolean;
  closeLoginModal: () => void;
  handleLoginRedirect: () => void;
}

type ErrorLike = {
  response?: { status?: number };
  status?: number;
  message?: string;
};

/** Detects 401-style errors from axios, fetch, or plain Error messages */
const isUnauthorized = (err: ErrorLike): boolean =>
  err?.response?.status === 401 ||
  err?.status === 401 ||
  err?.message?.toLowerCase().includes("unauthorized") ||
  err?.message?.toLowerCase().includes("not logged in") ||
  err?.message?.toLowerCase().includes("token");

export const useWishlist = (): UseWishlistReturn => {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const loadWishlist = useCallback(async (showLoader: boolean = true) => {
    if (showLoader) {
      setLoading(true);
    }
    setError(null);
    try {
      const response = await fetchWishlist();
      if (response.success && Array.isArray(response.data)) {
        setWishlist(response.data);
      } else {
        setWishlist([]);
      }
    } catch (err: unknown) {
      const error = err as ErrorLike;
      // Unauthenticated users get a 401 fetching wishlist. That is expected.
      if (isUnauthorized(error)) {
        setWishlist([]);
      } else {
        console.error("Error loading wishlist:", err);
        setError(error.message || "An error occurred while fetching wishlist");
      }
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  useEffect(() => {
    if (consumeRedirectModalState("wishlistLoginModalOpen")) {
      setIsLoginModalOpen(true);
    }
  }, []);

  useEffect(() => {
    const handleWishlistUpdated = () => {
      loadWishlist(false);
    };

    window.addEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdated);

    return () => {
      window.removeEventListener(
        WISHLIST_UPDATED_EVENT,
        handleWishlistUpdated,
      );
    };
  }, [loadWishlist]);

  const toggleProductInWishlist = useCallback(
    async (productId: string) => {
      try {
        const response = await toggleWishlistApi(productId);
        if (response.success) {
          toast.success(response.message || "Wishlist updated!");
          dispatchWishlistUpdated();
          await loadWishlist(false);
        } else {
          // Some backends return HTTP 200 with success: false when not logged in
          const msg = response.message?.toLowerCase() || "";
          if (
            msg.includes("login") ||
            msg.includes("unauthorized") ||
            msg.includes("not logged")
          ) {
            setIsLoginModalOpen(true);
            return;
          }
          toast.error(response.message || "Failed to update wishlist.");
        }
      } catch (err: unknown) {
        const error = err as ErrorLike;
        // HTTP 401 thrown by axios / fetch wrapper
        if (isUnauthorized(error)) {
          setIsLoginModalOpen(true);
          return;
        }
        toast.error("Could not update wishlist. Please try again.");
      }
    },
    [loadWishlist],
  );

  const isProductInWishlist = useCallback(
    (productId: string) => wishlist.some((p) => p._id === productId),
    [wishlist],
  );

  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  const handleLoginRedirect = useCallback(() => {
    setIsLoginModalOpen(false);
    if (typeof window !== "undefined") {
      redirectToLogin(router, undefined, {
        modals: {
          wishlistLoginModalOpen: true,
        },
      });
    }
  }, [router]);

  return {
    wishlist,
    loading,
    error,
    toggleProductInWishlist,
    isProductInWishlist,
    isLoginModalOpen,
    closeLoginModal,
    handleLoginRedirect,
  };
};
