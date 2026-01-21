"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../hooks/useCart"; // Import useCart hook
import { getApiImageUrl } from "../services/api";
import DeleteConfirmationModal from "../components/modal/DeleteConfirmationModal"; // Import the modal component

const CartPage = () => {
  const { cart: cartItems, loading, removeFromCart } = useCart(); // Use the useCart hook
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const handleRemoveItem = (itemId: string) => {
    setItemToRemove(itemId);
    setIsModalOpen(true);
  };

  const confirmRemoveItem = async () => {
    if (itemToRemove) {
      await removeFromCart(itemToRemove);
      setIsModalOpen(false);
      setItemToRemove(null);
    }
  };

  const cancelRemoveItem = () => {
    setIsModalOpen(false);
    setItemToRemove(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#bd9951] rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalMrp = cartItems.reduce(
    (acc, item) => acc + (item.product.price ?? 0) * item.quantity,
    0,
  );
  const totalDiscount = cartItems.reduce(
    (acc, item) =>
      acc +
      ((item.product.price ?? 0) - (item.product.discountPrice ?? 0)) *
        item.quantity,
    0,
  );
  const couponDiscount = 201;
  const shippingCharges = 150;
  const platformFee = 23;
  const totalAmount =
    totalMrp - totalDiscount - couponDiscount + shippingCharges - platformFee;

  return (
    <div className="font-montserrat">
      {isModalOpen && (
        <DeleteConfirmationModal
          onConfirm={confirmRemoveItem}
          onCancel={cancelRemoveItem}
        />
      )}
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
              {/* Left Column - Cart Items */}
              <div className="w-full lg:w-8/12">
                {/* Header */}
                <div className="flex justify-start items-center space-x-5 mb-4">
                  <h2 className="text-3xl text-[#6a3f07]">
                    My Cart{" "}
                    <span className="text-sm font-light">
                      ({cartItems.length} items)
                    </span>
                  </h2>
                  <div className="flex justfiy-center items-center">
                    <div>
                      <Image
                        src="/assets/icons/share.svg"
                        alt="Info"
                        width={16}
                        height={16}
                        className="inline-block mr-2"
                      />
                    </div>
                    <div>
                      <Image
                        src="/assets/icons/delete.svg"
                        alt="Info"
                        width={16}
                        height={16}
                        className="inline-block mr-2"
                      />
                    </div>
                    <div>
                      <Image
                        src="/assets/icons/heart-b.svg"
                        alt="Info"
                        width={16}
                        height={16}
                        className="inline-block mr-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Cart List */}
                <div className="">
                  {cartItems.map((item, index) => (
                    <div
                      key={item._id}
                      className={`flex items-start px-4 py-5 gap-4 ${
                        index < cartItems.length - 1 ? "" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <div className="pt-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-green-600"
                        />
                      </div>

                      {/* Image */}
                      <div className="w-[90px] shrink-0">
                        <Image
                          src={getApiImageUrl(item.product.mainImage?.url)}
                          alt={item.product.name}
                          width={90}
                          height={120}
                          className="rounded"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="text-[15px] font-semibold leading-snug">
                          {item.product.name}
                        </h3>

                        <p className="text-sm text-gray-600 mt-1">
                          Color: {item.color} | Size: {item.size}
                        </p>

                        <div className="flex items-center gap-2 text-sm text-[#bd9951] mt-2">
                          <button className="hover:underline">Edit</button>
                          <span className="text-gray-300">|</span>
                          <button className="hover:underline">
                            Move to Wishlist
                          </button>
                        </div>
                      </div>

                      {/* Price + Qty */}
                      <div className="w-[180px] text-right">
                        <div className="flex justify-end items-center gap-2">
                          <span className="font-semibold text-[15px]">
                            ₹ {(item.product.discountPrice ?? 0).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ₹ {(item.product.price ?? 0).toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-600">
                            [
                            {Math.round(
                              (((item.product.price ?? 0) -
                                (item.product.discountPrice ?? 0)) /
                                (item.product.price ?? 1)) *
                                100,
                            )}
                            %]
                          </span>
                        </div>

                        {/* Quantity */}
                        <div className="flex justify-end items-center gap-3 mt-3 text-sm">
                          <button className="px-2">-</button>
                          <span>{item.quantity}</span>
                          <button className="px-2">+</button>
                        </div>
                      </div>

                      {/* Remove */}
                      <div className="pt-1">
                        <button
                          className="text-gray-500 hover:text-red-600"
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          <Image
                            src="/assets/icons/delete.svg"
                            alt="Remove"
                            width={16}
                            height={16}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="w-full lg:w-4/12 mt-5 font-[family-name:var(--font-monterrat)]">
                <div className="p-4">
                  <h3 className="text-md font-bold mb-4 uppercase">Coupons</h3>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Image
                        src="/assets/icons/tag.svg"
                        alt="Coupon"
                        width={20}
                        height={20}
                      />
                      <span className="ml-2 font-semibold">Apply Coupons</span>
                    </div>
                    <button className="text-[#6a3f07] font-semibold border border-[#6a3f07] rounded-md px-4 py-1 text-sm">
                      APPLY
                    </button>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">
                      <Link
                        href="/login"
                        className="text-[#6a3f07] font-semibold"
                      >
                        Login
                      </Link>{" "}
                      to get up to ₹300 OFF on first order
                    </p>
                  </div>
                  <h3 className="text-md font-bold mb-4 uppercase mt-5">
                    Price Details ({cartItems.length} Items)
                  </h3>
                  <div className="space-y-5 text-sm">
                    <div className="flex justify-between">
                      <span>Total MRP</span>
                      <span>₹{totalMrp.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount on MRP</span>
                      <span className="text-green-600">
                        -₹{totalDiscount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coupon Discount</span>
                      <span className="text-green-600">
                        -₹{couponDiscount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Charges</span>
                      <span>₹{shippingCharges.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        Platform Fee{" "}
                        <Link
                          href="#"
                          className="text-[#73561e] text-sm underline ml-3"
                        >
                          Know More
                        </Link>
                      </span>
                      <span className="text-green-600">
                        -₹{platformFee.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="my-4"></div>
                  <div className="flex justify-between font-bold text-lg mt-3 border-t border-gray-200 pt-3">
                    <span>Total Amount</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 text-right mt-1">
                    Tax included. Shipping Calculated at checkout.
                  </p>
                  <button className="w-full bg-[#6a3f07] text-white py-3 rounded-md mt-6 font-bold uppercase">
                    Proceed to Buy
                  </button>
                </div>
              </div>
            </div>
            {/* This div should be outside the conditional and not wrapped in a fragment */}
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