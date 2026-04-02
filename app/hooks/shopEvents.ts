"use client";

export const CART_UPDATED_EVENT = "shop:cart-updated";
export const WISHLIST_UPDATED_EVENT = "shop:wishlist-updated";
export const ORDER_CONFIRMED_EVENT = "shop:order-confirmed";

const dispatchShopEvent = (eventName: string) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(eventName));
};

export const dispatchCartUpdated = () => {
  dispatchShopEvent(CART_UPDATED_EVENT);
};

export const dispatchWishlistUpdated = () => {
  dispatchShopEvent(WISHLIST_UPDATED_EVENT);
};

export const dispatchOrderConfirmed = () => {
  dispatchShopEvent(ORDER_CONFIRMED_EVENT);
};
