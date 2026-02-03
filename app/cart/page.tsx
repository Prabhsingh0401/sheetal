"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCart, CartItem } from "../hooks/useCart";
import CartItemsList from "./components/CartItemsList";
import PriceDetails from "./components/PriceDetails";

const CartPage = () => {
  const {
    cart: cartItems,
    loading,
    removeFromCart,
    moveFromCartToWishlist,
    couponCode,
    couponDiscount,
    couponError,
    totalMrp,
    totalDiscount,
    finalAmount,
    applyCoupon,
    couponOfferType,
    bogoMessage,
    applicableCategory,
    itemWiseDiscount,
    updateCartItemQuantity,
    removeCoupon, // Add this
  } = useCart();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);
  const [couponInput, setCouponInput] = useState("");

  const handleRemoveItem = (item: CartItem) => {
    setItemToRemove(item);
    setIsModalOpen(true);
  };

  const confirmRemoveItem = async () => {
    if (itemToRemove) {
      await removeFromCart(itemToRemove._id);
      setIsModalOpen(false);
      setItemToRemove(null);
    }
  };

  const handleMoveToWishlist = async () => {
    if (itemToRemove) {
      await moveFromCartToWishlist(itemToRemove._id, itemToRemove.product._id);
      setIsModalOpen(false);
      setItemToRemove(null);
    }
  };

  const cancelRemoveItem = () => {
    setIsModalOpen(false);
    setItemToRemove(null);
  };

  const handleApplyCoupon = (userId: string | undefined) => {
    if (!userId) {
      toast.error("Please login to apply coupons.");
      return;
    }

    if (!couponInput.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }

    console.log("Applying coupon:", couponInput, "for user:", userId);
    applyCoupon(couponInput.trim().toUpperCase(), userId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#bd9951] rounded-full animate-spin"></div>
      </div>
    );
  }

  const shippingCharges = 150;
  const platformFee = 23;
  const totalAmount = finalAmount + shippingCharges - platformFee;

  const cheapestItem =
    couponOfferType === "BOGO" && cartItems.length > 0
      ? cartItems
          .filter(
            (item) =>
              !applicableCategory ||
              item.product.category._id === applicableCategory,
          )
          .reduce(
            (cheapest, item) =>
              Number(item.discountPrice ?? item.price ?? 0) <
              Number(cheapest.discountPrice ?? cheapest.price ?? 0)
                ? item
                : cheapest,
            cartItems[0],
          )
      : null;

  const categoryName = applicableCategory
    ? cartItems.find((item) => item.product.category._id === applicableCategory)
        ?.product.category.name
    : null;

  return (
    <div className="font-montserrat">
      {/* Header */}
      <div className="">
        <div className="container mx-auto">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/assets/335014072.png"
                  alt="Studio By Sheetal"
                  width={40}
                  height={40}
                />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <div className="text-[#bd9951]">BAG</div>
              <div className="text-gray-400">ADDRESS</div>
              <div className="text-gray-400">PAYMENT</div>
            </div>
            <div className="flex items-center space-x-2 text-sm font-semibold">
              <Image
                src="/assets/icons/shield.svg"
                alt="Secure"
                width={20}
                height={20}
              />
              <span>100% SECURE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="container mx-auto py-8">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-xl font-semibold text-gray-700 mb-4">
              Your cart is empty!
            </p>
            <p className="text-gray-500 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-[#6a3f07] text-white rounded-md font-bold hover:bg-[#5a2f00] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-8">
              <CartItemsList
                cartItems={cartItems}
                cheapestItem={cheapestItem}
                applicableCategory={applicableCategory}
                itemWiseDiscount={itemWiseDiscount}
                couponOfferType={couponOfferType}
                removeFromCart={removeFromCart}
                moveFromCartToWishlist={moveFromCartToWishlist}
                updateCartItemQuantity={updateCartItemQuantity}
                handleRemoveItem={handleRemoveItem}
                isModalOpen={isModalOpen}
                confirmRemoveItem={confirmRemoveItem}
                cancelRemoveItem={cancelRemoveItem}
                handleMoveToWishlist={handleMoveToWishlist}
                cartLength={cartItems.length}
              />

              <PriceDetails
                couponInput={couponInput}
                setCouponInput={setCouponInput}
                handleApplyCoupon={handleApplyCoupon}
                couponError={couponError}
                bogoMessage={bogoMessage}
                applicableCategory={applicableCategory}
                categoryName={categoryName}
                couponCode={couponCode} // Pass the applied coupon code
                onRemoveCoupon={removeCoupon} // Pass the remove function
                cartLength={cartItems.length}
                totalMrp={totalMrp}
                totalDiscount={totalDiscount}
                couponDiscount={couponDiscount}
                shippingCharges={shippingCharges}
                platformFee={platformFee}
                totalAmount={totalAmount}
              />
            </div>

            <div className="flex justify-around items-center mt-12 py-4">
              <div className="flex items-center text-sm">
                <Image
                  src="/assets/icons/secure-payment.svg"
                  alt="Secure Payments"
                  width={30}
                  height={30}
                />
                <span className="ml-2 text-xl text-[#706a42] font-semibold">
                  Secure Payments
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Image
                  src="/assets/icons/transaction.svg"
                  alt="Cash on delivery"
                  width={30}
                  height={30}
                />
                <span className="ml-2 text-xl text-[#706a42] font-semibold">
                  Cash on delivery
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Image
                  src="/assets/icons/quality-assurance.svg"
                  alt="Assured Quality"
                  width={30}
                  height={30}
                />
                <span className="ml-2 text-xl text-[#706a42] font-semibold">
                  Assured Quality
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Image
                  src="/assets/icons/product-return1.svg"
                  alt="Easy returns"
                  width={30}
                  height={30}
                />
                <span className="ml-2 text-xl text-[#706a42] font-semibold">
                  Easy returns
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
