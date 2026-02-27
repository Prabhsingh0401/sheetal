"use client";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  fetchCart,
  addToCart as addToCartApi,
  removeFromCart as removeFromCartApi,
  applyCoupon as applyCouponApi,
  updateCartItemQuantity as updateCartItemQuantityApi,
  clearCart as clearCartApi,
  mergeGuestCart as mergeGuestCartApi,
} from "../services/cartService";
import {
  toggleWishlist as toggleWishlistApi,
  Product,
} from "../services/productService";
import { isAuthenticated } from "../services/authService";

// ─── Guest cart localStorage key ────────────────────────────────────────────
const GUEST_CART_KEY = "guest_cart";

/** Shape of a guest cart item stored in localStorage */
export interface GuestCartItem {
  /** Temporary client-side ID */
  _id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
  discountPrice: number;
  variantImage: string;
  /** Minimal product info for display purposes */
  product: {
    _id: string;
    name: string;
    slug: string;
    mainImage?: { url: string };
  };
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  color: string;
  size: string;
  variantImage?: string;
  price?: number;
  discountPrice?: number;
}

interface CartApiResponse {
  success: boolean;
  data: { items: CartItem[] };
}

interface UseCartReturn {
  cart: CartItem[];
  loading: boolean;
  error: string | null;
  couponCode: string;
  couponDiscount: number;
  couponError: string | null;
  couponOfferType: string | null;
  bogoMessage: string | null;
  applicableCategories: string[];
  itemWiseDiscount: { [cartItemId: string]: number } | null;
  totalMrp: number;
  totalDiscount: number;
  finalAmount: number;
  addToCart: (
    productId: string,
    variantId: string,
    quantity: number,
    size: string,
    price: number,
    discountPrice: number,
    variantImage: string,
    color: string,
    productMeta?: { _id: string; name: string; slug: string; mainImage?: { url: string } },
  ) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  moveFromCartToWishlist: (itemId: string, productId: string) => Promise<void>;
  applyCoupon: (code: string, userId: string) => Promise<void>;
  updateCartItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeCoupon: () => void;
  clearCart: (userId: string) => Promise<void>;
}

// ─── Guest cart helpers ──────────────────────────────────────────────────────

const readGuestCart = (): GuestCartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeGuestCart = (items: GuestCartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

/** Converts guest cart items to CartItem shape for uniform UI rendering */
const guestToCartItems = (guestItems: GuestCartItem[]): CartItem[] =>
  guestItems.map((g) => ({
    _id: g._id,
    product: g.product as unknown as Product,
    quantity: g.quantity,
    color: g.color,
    size: g.size,
    variantImage: g.variantImage,
    price: g.price,
    discountPrice: g.discountPrice,
  }));

/** Clears guest cart from localStorage */
export const clearGuestCart = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(GUEST_CART_KEY);
  }
};

/**
 * Merges the guest localStorage cart into the authenticated user's server cart.
 * Should be called immediately after a successful login.
 */
export const mergeGuestCartOnLogin = async (): Promise<void> => {
  const guestItems = readGuestCart();
  if (guestItems.length === 0) return;

  const payload = guestItems.map((g) => ({
    productId: g.productId,
    quantity: g.quantity,
    size: g.size,
    color: g.color,
    price: g.price,
    discountPrice: g.discountPrice,
    variantImage: g.variantImage,
  }));

  try {
    await mergeGuestCartApi(payload);
    clearGuestCart();
  } catch (err) {
    console.error("Failed to merge guest cart:", err);
  }
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponOfferType, setCouponOfferType] = useState<string | null>(null);
  const [bogoMessage, setBogoMessage] = useState<string | null>(null);
  const [applicableCategories, setApplicableCategories] = useState<string[]>([]);
  const [itemWiseDiscount, setItemWiseDiscount] = useState<{ [cartItemId: string]: number } | null>(null);
  const [totalMrp, setTotalMrp] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  /**
   * Loads the cart — from the server if authenticated, from localStorage if guest.
   */
  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (isAuthenticated()) {
        // ── Authenticated: fetch from server ──
        const response: CartApiResponse = await fetchCart();
        if (response.success && response.data && Array.isArray(response.data.items)) {
          setCart(response.data.items);
        } else {
          setError("Failed to fetch cart");
        }
      } else {
        // ── Guest: read from localStorage ──
        const guestItems = readGuestCart();
        setCart(guestToCartItems(guestItems));
      }
    } catch (err: any) {
      console.error("Error loading cart:", err);
      setError(err.message || "An error occurred while fetching cart");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  /**
   * Adds a product to the cart.
   * For guests, persists to localStorage with productMeta for display.
   * For authenticated users, calls the API.
   */
  const addToCart = useCallback(
    async (
      productId: string,
      variantId: string,
      quantity: number,
      size: string,
      price: number,
      discountPrice: number,
      variantImage: string,
      color: string,
      productMeta?: { _id: string; name: string; slug: string; mainImage?: { url: string } },
    ) => {
      try {
        if (isAuthenticated()) {
          // ── Authenticated: call API ──
          const response = await addToCartApi(
            productId, variantId, quantity, size, price, discountPrice, color, variantImage,
          );
          if (response.success) {
            toast.success(response.message || "Product added to cart!");
            await loadCart();
          } else {
            toast.error(response.message || "Failed to add to cart.");
          }
        } else {
          // ── Guest: persist in localStorage ──
          const guestItems = readGuestCart();
          const existingIndex = guestItems.findIndex(
            (g) => g.productId === productId && g.size === size && g.color === color,
          );

          if (existingIndex > -1) {
            guestItems[existingIndex].quantity += quantity;
            guestItems[existingIndex].price = price;
            guestItems[existingIndex].discountPrice = discountPrice;
          } else {
            const newItem: GuestCartItem = {
              _id: `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              productId,
              variantId,
              quantity,
              size,
              color,
              price,
              discountPrice,
              variantImage,
              product: productMeta ?? {
                _id: productId,
                name: "Product",
                slug: "",
                mainImage: variantImage ? { url: variantImage } : undefined,
              },
            };
            guestItems.push(newItem);
          }

          writeGuestCart(guestItems);
          setCart(guestToCartItems(guestItems));
          toast.success("Added to cart!");
        }
      } catch (err: any) {
        console.error("Error adding to cart:", err);
        toast.error("Could not add to cart. Please try again.");
      }
    },
    [loadCart],
  );

  /**
   * Removes an item from the cart (server or guest localStorage).
   */
  const removeFromCart = useCallback(
    async (itemId: string) => {
      try {
        if (isAuthenticated()) {
          const response = await removeFromCartApi(itemId);
          if (response.success) {
            toast.success(response.message || "Item removed from cart!");
            await loadCart();
            resetCoupon();
          } else {
            toast.error(response.message || "Failed to remove item from cart.");
          }
        } else {
          // Guest: remove from localStorage
          const guestItems = readGuestCart().filter((g) => g._id !== itemId);
          writeGuestCart(guestItems);
          setCart(guestToCartItems(guestItems));
          toast.success("Item removed from cart!");
          resetCoupon();
        }
      } catch (err: any) {
        console.error("Error removing from cart:", err);
        toast.error("Could not remove item from cart. Please try again.");
      }
    },
    [loadCart],
  );

  const moveFromCartToWishlist = useCallback(
    async (itemId: string, productId: string) => {
      try {
        const removeResponse = await removeFromCartApi(itemId);
        if (removeResponse.success) {
          toast.success("Item removed from cart!");
          await loadCart();
          resetCoupon();

          const wishlistResponse = await toggleWishlistApi(productId);
          if (wishlistResponse.success) {
            toast.success("Item added to wishlist!");
          } else {
            toast.error(wishlistResponse.message || "Failed to add to wishlist.");
          }
        } else {
          toast.error(removeResponse.message || "Failed to remove item from cart.");
        }
      } catch (err: any) {
        console.error("Error moving to wishlist:", err);
        toast.error("Could not move item to wishlist. Please try again.");
      }
    },
    [loadCart],
  );

  /** Resets all coupon-related state */
  const resetCoupon = useCallback(() => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponOfferType(null);
    setBogoMessage(null);
    setApplicableCategories([]);
    setItemWiseDiscount(null);
  }, []);

  // Calculate totals whenever cart or coupon changes
  useEffect(() => {
    let newTotalMrp = 0;
    let newTotalDiscount = 0;

    cart.forEach((item) => {
      const itemPrice = item.price ?? 0;
      const itemDiscountPrice = item.discountPrice ?? itemPrice;
      newTotalMrp += itemPrice * item.quantity;
      newTotalDiscount += (itemPrice - itemDiscountPrice) * item.quantity;
    });

    setTotalMrp(newTotalMrp);
    setTotalDiscount(newTotalDiscount);
    setFinalAmount(newTotalMrp - newTotalDiscount - couponDiscount);
  }, [cart, couponDiscount]);

  const applyCoupon = useCallback(
    async (code: string, userId: string) => {
      setCouponError(null);
      setBogoMessage(null);
      setCouponOfferType(null);
      setApplicableCategories([]);
      setItemWiseDiscount(null);

      try {
        let currentMrp = 0;
        let currentDiscount = 0;

        cart.forEach((item) => {
          const itemPrice = item.price ?? 0;
          const itemDiscountPrice = item.discountPrice ?? itemPrice;
          currentMrp += itemPrice * item.quantity;
          currentDiscount += (itemPrice - itemDiscountPrice) * item.quantity;
        });

        const currentFinalAmount = currentMrp - currentDiscount;

        const response = await applyCouponApi(code, currentFinalAmount, userId, cart);

        if (response.success) {
          setCouponCode(response.data.couponCode || code);
          setCouponOfferType(response.data.offerType);

          if (response.data.applicableIds && response.data.applicableIds.length > 0) {
            setApplicableCategories(response.data.applicableIds);
          }

          setItemWiseDiscount(response.data.itemWiseDiscount || {});
          const discountAmount = response.data.discount ?? 0;
          setCouponDiscount(discountAmount);

          if (response.data.offerType === "BOGO") {
            setBogoMessage(`Congrats! Your BOGO offer has been applied. You saved ₹${discountAmount.toFixed(2)}!`);
          } else if (response.data.offerType === "Fixed") {
            setBogoMessage(`₹${discountAmount.toFixed(2)} discount applied!`);
          }

          toast.success("Coupon applied successfully!");
        } else {
          setCouponError(response.message || "Invalid coupon code.");
          toast.error(response.message || "Invalid coupon code.");
        }
      } catch (err: any) {
        console.error("Error applying coupon:", err);
        setCouponError("Could not apply coupon. Please try again.");
        toast.error("Could not apply coupon. Please try again.");
      }
    },
    [cart],
  );

  /**
   * Updates the quantity of a cart item.
   */
  const updateCartItemQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        if (isAuthenticated()) {
          const response = await updateCartItemQuantityApi(itemId, quantity);
          if (response.success) {
            toast.success(response.message || "Cart updated!");
            setCart((prevCart) => {
              if (quantity <= 0) return prevCart.filter((item) => item._id !== itemId);
              return prevCart.map((item) => item._id === itemId ? { ...item, quantity } : item);
            });
            resetCoupon();
          } else {
            toast.error(response.message || "Failed to update quantity.");
          }
        } else {
          // Guest: update in localStorage
          const guestItems = readGuestCart().map((g) => {
            if (g._id !== itemId) return g;
            return { ...g, quantity };
          }).filter((g) => g.quantity > 0);
          writeGuestCart(guestItems);
          setCart(guestToCartItems(guestItems));
          resetCoupon();
        }
      } catch (err: any) {
        console.error("Error updating cart quantity:", err);
        toast.error("Could not update quantity. Please try again.");
      }
    },
    [resetCoupon],
  );

  const removeCoupon = useCallback(() => {
    resetCoupon();
    toast.success("Coupon removed");
  }, [resetCoupon]);

  const clearCart = useCallback(async (userId: string) => {
    try {
      if (isAuthenticated()) {
        if (!userId) {
          toast.error("User ID is required to clear cart");
          return;
        }
        const response = await clearCartApi(userId);
        if (response && response.success) {
          setCart([]);
          setTotalMrp(0);
          setTotalDiscount(0);
          setFinalAmount(0);
          removeCoupon();
          toast.success("Cart cleared successfully");
        } else {
          toast.error(response?.message || "Failed to clear cart");
        }
      } else {
        clearGuestCart();
        setCart([]);
        setTotalMrp(0);
        setTotalDiscount(0);
        setFinalAmount(0);
        removeCoupon();
        toast.success("Cart cleared");
      }
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      toast.error(error.message || "Failed to clear cart");
    }
  }, [removeCoupon]);

  return {
    cart,
    loading,
    error,
    couponCode,
    couponDiscount,
    couponError,
    couponOfferType,
    bogoMessage,
    applicableCategories,
    itemWiseDiscount,
    totalMrp,
    totalDiscount,
    finalAmount,
    addToCart,
    removeFromCart,
    moveFromCartToWishlist,
    applyCoupon,
    updateCartItemQuantity,
    removeCoupon,
    clearCart,
  };
};
