"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem } from "../../hooks/useCart"; // Adjust path as needed
import { getApiImageUrl } from "../../services/api"; // Adjust path as needed
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface CartItemsListProps {
  cartItems: CartItem[];
  cheapestItem: CartItem | null;
  applicableCategory: string | null;
  itemWiseDiscount: { [cartItemId: string]: number } | null;
  couponOfferType: string | null;
  removeFromCart: (itemId: string) => Promise<void>;
  moveFromCartToWishlist: (itemId: string, productId: string) => Promise<void>;
  updateCartItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  handleRemoveItem: (item: CartItem) => void;
  isModalOpen: boolean;
  confirmRemoveItem: () => Promise<void>;
  cancelRemoveItem: () => void;
  handleMoveToWishlist: () => Promise<void>;
  cartLength: number;
}

const CartItemsList: React.FC<CartItemsListProps> = ({
  cartItems,
  cheapestItem,
  applicableCategory,
  itemWiseDiscount,
  couponOfferType,
  removeFromCart,
  moveFromCartToWishlist,
  updateCartItemQuantity,
  handleRemoveItem,
  isModalOpen,
  confirmRemoveItem,
  cancelRemoveItem,
  handleMoveToWishlist,
  cartLength,
}) => {
  return (
    <>
      {isModalOpen && (
        <DeleteConfirmationModal
          onConfirm={confirmRemoveItem}
          onCancel={cancelRemoveItem}
          onMoveToWishlist={handleMoveToWishlist}
        />
      )}
      <div className="w-full lg:w-8/12">
        {/* Header */}
        <div className="flex justify-start items-center space-x-5 mb-4">
          <h2 className="text-3xl text-[#6a3f07]">
            My Cart{" "}
            <span className="text-sm font-light">({cartLength} items)</span>
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
                className="inline-block mr-2 cursor-pointer"
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
          {cartItems.map((item, index) => {
            const displayOriginalPrice = item.price ?? 0;
            const displayDiscountPrice = item.discountPrice ?? displayOriginalPrice;

            const discountPercentage =
              displayOriginalPrice > 0
                ? Math.round(
                    ((displayOriginalPrice - displayDiscountPrice) / displayOriginalPrice) * 100
                  )
                : 0;

            return (
              <div
                key={item._id}
                className={`flex items-start px-4 py-5 gap-4 ${
                  index < cartItems.length - 1 ? "" : ""
                }`}
              >
                {/* Checkbox */}
                <div className="pt-2">
                  <input type="checkbox" className="w-4 h-4 accent-green-600" />
                </div>

                {/* Image */}
                <div className="w-[90px] shrink-0">
                  <Image
                    src={getApiImageUrl(item.variantImage || item.product.mainImage?.url)}
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

                  {applicableCategory &&
                    item.product.category._id === applicableCategory && (
                      <span className="text-xs text-blue-600 font-medium">
                        Category Coupon Applied
                      </span>
                    )}

                  <div className="flex items-center gap-2 text-sm text-[#bd9951] mt-2">
                    <button className="hover:underline">Edit</button>
                    <span className="text-gray-300">|</span>
                    <button
                      className="hover:underline"
                      onClick={() =>
                        moveFromCartToWishlist(item._id, item.product._id)
                      }
                    >
                      Move to Wishlist
                    </button>
                  </div>
                </div>

                {/* Price + Qty */}
                <div className="flex flex-col items-end justify-between flex-shrink-0">
                  <div className="flex flex-col md:flex-row md:items-end gap-2 text-right">
                    <span className="font-semibold text-[15px]">
                      ₹ {displayDiscountPrice.toFixed(2)}
                    </span>
                    {displayOriginalPrice > displayDiscountPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹ {displayOriginalPrice.toFixed(2)}
                      </span>
                    )}
                    {discountPercentage > 0 && (
                      <span className="text-xs text-green-600">
                        {discountPercentage}% OFF
                      </span>
                    )}
                    {cheapestItem && cheapestItem._id === item._id && (
                      <span className="text-xs text-white bg-green-600 px-2 py-1 rounded-full">
                        Free
                      </span>
                    )}
                    {itemWiseDiscount &&
                      itemWiseDiscount[item._id] > 0 &&
                      couponOfferType !== "BOGO" && (
                        <span className="text-xs text-green-600 px-2 py-1 rounded-full">
                          -₹{itemWiseDiscount[item._id].toFixed(2)}
                        </span>
                      )}
                  </div>

                  {/* Quantity */}
                  <div className="flex justify-end items-center gap-3 mt-3 text-sm">
                    <button
                      className="border border-gray-200 rounded-full cursor-pointer px-2 py-0.5"
                      onClick={() =>
                        updateCartItemQuantity(item._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="border border-gray-200 rounded-full cursor-pointer px-2 py-0.5"
                      onClick={() =>
                        updateCartItemQuantity(item._id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <div className="pt-1">
                  <button
                    className="text-gray-500 hover:text-red-600"
                    onClick={() => handleRemoveItem(item)}
                  >
                    <Image
                      src="/assets/icons/delete.svg"
                      alt="Remove"
                      width={16}
                      height={16}
                      className="cursor-pointer"
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CartItemsList;
