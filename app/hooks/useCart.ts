import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  fetchCart,
  addToCart as addToCartApi,
  removeFromCart as removeFromCartApi,
  applyCoupon as applyCouponApi,
  updateCartItemQuantity as updateCartItemQuantityApi,
  clearCart as clearCartApi,
} from "../services/cartService";
import {
  toggleWishlist as toggleWishlistApi,
  Product,
} from "../services/productService";

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
  ) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  moveFromCartToWishlist: (itemId: string, productId: string) => Promise<void>;
  applyCoupon: (code: string, userId: string) => Promise<void>;
  updateCartItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeCoupon: () => void;
  clearCart: (userId: string) => Promise<void>;
}

export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponOfferType, setCouponOfferType] = useState<string | null>(null);
  const [bogoMessage, setBogoMessage] = useState<string | null>(null);
  const [applicableCategories, setApplicableCategories] = useState<string[]>(
    [],
  );
  const [itemWiseDiscount, setItemWiseDiscount] = useState<{
    [cartItemId: string]: number;
  } | null>(null);

  const [totalMrp, setTotalMrp] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: CartApiResponse = await fetchCart();
      if (
        response.success &&
        response.data &&
        Array.isArray(response.data.items)
      ) {
        setCart(response.data.items);
      } else {
        setError("Failed to fetch cart");
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
    ) => {
      try {
        const response = await addToCartApi(
          productId,
          variantId,
          quantity,
          size,
          price,
          discountPrice,
          variantImage,
          color,
        );
        if (response.success) {
          toast.success(response.message || "Product added to cart!");
          await loadCart();
        } else {
          toast.error(response.message || "Failed to add to cart.");
        }
      } catch (err: any) {
        console.error("Error adding to cart:", err);
        toast.error("Could not add to cart. Please try again.");
      }
    },
    [loadCart],
  );

  const removeFromCart = useCallback(
    async (itemId: string) => {
      try {
        const response = await removeFromCartApi(itemId);
        if (response.success) {
          toast.success(response.message || "Item removed from cart!");
          await loadCart();
          // Reset coupon when cart changes
          setCouponCode("");
          setCouponDiscount(0);
          setCouponOfferType(null);
          setBogoMessage(null);
          setApplicableCategories([]);
          setItemWiseDiscount(null);
        } else {
          toast.error(response.message || "Failed to remove item from cart.");
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
          // Reset coupon when cart changes
          setCouponCode("");
          setCouponDiscount(0);
          setCouponOfferType(null);
          setBogoMessage(null);
          setApplicableCategories([]);
          setItemWiseDiscount(null);

          const wishlistResponse = await toggleWishlistApi(productId);
          if (wishlistResponse.success) {
            toast.success("Item added to wishlist!");
          } else {
            toast.error(
              wishlistResponse.message || "Failed to add to wishlist.",
            );
          }
        } else {
          toast.error(
            removeResponse.message || "Failed to remove item from cart.",
          );
        }
      } catch (err: any) {
        console.error("Error moving to wishlist:", err);
        toast.error("Could not move item to wishlist. Please try again.");
      }
    },
    [loadCart],
  );

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
        // Calculate the current totals first
        let currentMrp = 0;
        let currentDiscount = 0;

        cart.forEach((item) => {
          const itemPrice = item.price ?? 0;
          const itemDiscountPrice = item.discountPrice ?? itemPrice;

          currentMrp += itemPrice * item.quantity;
          currentDiscount += (itemPrice - itemDiscountPrice) * item.quantity;
        });

        const currentFinalAmount = currentMrp - currentDiscount;

        const response = await applyCouponApi(
          code,
          currentFinalAmount,
          userId,
          cart,
        );

        if (response.success) {
          setCouponCode(response.data.couponCode || code);
          setCouponOfferType(response.data.offerType);

          if (
            response.data.applicableIds &&
            response.data.applicableIds.length > 0
          ) {
            setApplicableCategories(response.data.applicableIds);
          }

          setItemWiseDiscount(response.data.itemWiseDiscount || {});

          // Set the discount amount
          const discountAmount = response.data.discount ?? 0;
          setCouponDiscount(discountAmount);

          if (response.data.offerType === "BOGO") {
            setBogoMessage(
              `Congrats! Your BOGO offer has been applied. You saved ₹${discountAmount.toFixed(2)}!`,
            );
          } //else if (response.data.offerType === 'Percentage') {
          //     setBogoMessage(`${response.data.offerValue}% discount applied!`)}
          else if (response.data.offerType === "Fixed") {
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

  const updateCartItemQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        const response = await updateCartItemQuantityApi(itemId, quantity);
        if (response.success) {
          toast.success(response.message || "Cart updated!");

          // Update cart locally
          setCart((prevCart) => {
            if (quantity <= 0) {
              return prevCart.filter((item) => item._id !== itemId);
            }
            return prevCart.map((item) =>
              item._id === itemId ? { ...item, quantity } : item,
            );
          });

          // Reset coupon when quantity changes
          setCouponCode("");
          setCouponDiscount(0);
          setCouponOfferType(null);
          setBogoMessage(null);
          setApplicableCategories([]);
          setItemWiseDiscount(null);
        } else {
          toast.error(response.message || "Failed to update quantity.");
        }
      } catch (err: any) {
        console.error("Error updating cart quantity:", err);
        toast.error("Could not update quantity. Please try again.");
      }
    },
    [],
  );

  const removeCoupon = useCallback(() => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponError(null);
    setCouponOfferType(null);
    setBogoMessage(null);
    setApplicableCategories([]);
    setItemWiseDiscount(null);
    toast.success("Coupon removed");
  }, []);

  const clearCart = useCallback(async (userId: string) => {
    try {
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
