"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem } from "../../hooks/useCart";
import { getApiImageUrl } from "../../services/api";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { Trash2, TrashIcon } from "lucide-react";

interface CartItemsListProps {
  cartItems: CartItem[];
  applicableCategories: string[];
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
  selectedItemIds: string[];
  onSelectionChange: (itemId: string) => void;
  onBulkRemove: () => void;
  onBulkHeart: () => void;
  isBulkAction: boolean;
}

const CartItemsList: React.FC<CartItemsListProps> = ({
  cartItems,
  applicableCategories,
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
  selectedItemIds,
  onSelectionChange,
  onBulkRemove,
  onBulkHeart,
  isBulkAction,
}) => {
  return (
    <>
      {isModalOpen && (
        <DeleteConfirmationModal
          onConfirm={confirmRemoveItem}
          onCancel={cancelRemoveItem}
          onMoveToWishlist={handleMoveToWishlist}
          isBulkAction={isBulkAction}
          itemCount={selectedItemIds.length}
        />
      )}

      <div className="w-full lg:w-8/12">
        {/* Header */}
        <div className="flex flex-wrap justify-start items-center gap-3 mb-4">
          <h2 className="text-2xl flex items-end gap-3 md:text-3xl text-[#6a3f07]">
            My Cart
            <span className="text-sm font-light mb-1">
              ({cartLength} items)
            </span>
          </h2>
          <div className="flex gap-4 items-center">
            <div className="cursor-pointer">
              <Image
                src="/assets/icons/share.svg"
                alt="Share"
                width={17}
                height={17}
              />
            </div>
            <button
              className="cursor-pointer hover:opacity-80"
              onClick={onBulkRemove}
            >
              <Image
                src="/assets/icons/delete.svg"
                alt="Delete Selected"
                width={20}
                height={20}
              />
            </button>
            <button
              className="cursor-pointer hover:opacity-80"
              onClick={onBulkHeart}
            >
              <Image
                src="/assets/icons/heart-b.svg"
                alt="Wishlist Selected"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>

        {/* Cart List */}
        <div className="divide-y divide-gray-100">
          {cartItems.map((item) => {
            const displayOriginalPrice = item.price ?? 0;
            const displayDiscountPrice =
              item.discountPrice ?? displayOriginalPrice;
            const discountPercentage =
              displayOriginalPrice > 0
                ? Math.round(
                    ((displayOriginalPrice - displayDiscountPrice) /
                      displayOriginalPrice) *
                      100,
                  )
                : 0;

            return (
              <div
                key={item._id}
                className="flex items-start px-2 md:px-4 py-5 gap-3"
              >
                {/* Checkbox */}
                <div className="pt-1 shrink-0">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-green-600 cursor-pointer"
                    checked={selectedItemIds.includes(item._id)}
                    onChange={() => onSelectionChange(item._id)}
                  />
                </div>

                {/* Image */}
                <div className="w-[70px] md:w-[90px] shrink-0">
                  <Image
                    src={getApiImageUrl(
                      item.variantImage || item.product.mainImage?.url,
                    )}
                    alt={item.product.name}
                    width={90}
                    height={120}
                    className="rounded w-full h-auto"
                  />
                </div>

                {/* Product Info + Price (stacked on mobile, side-by-side on md+) */}
                <div className="flex flex-1 flex-col md:flex-row md:items-start md:justify-between gap-2 min-w-0">
                  {/* Left: name, color/size, coupon, wishlist */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] md:text-[15px] font-semibold leading-snug line-clamp-2">
                      {item.product.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                      Color: {item.color} | Size: {item.size}
                    </p>

                    {applicableCategories.length > 0 &&
                      ((item.product.category &&
                        applicableCategories.includes(
                          typeof item.product.category === "object"
                            ? item.product.category._id
                            : item.product.category,
                        )) ||
                        applicableCategories.includes(item.product._id)) && (
                        <span className="text-xs text-blue-600 font-medium">
                          {applicableCategories.includes(item.product._id)
                            ? "Product Coupon Applied"
                            : "Category Coupon Applied"}
                        </span>
                      )}

                    <button
                      className="text-xs md:text-sm text-[#bd9951] hover:underline mt-2 block"
                      onClick={() =>
                        moveFromCartToWishlist(item._id, item.product._id)
                      }
                    >
                      Move to Wishlist
                    </button>
                  </div>

                  {/* Right: price + qty */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0">
                    {/* Price row */}
                    <div className="flex flex-wrap items-center gap-1 md:gap-2 md:justify-end">
                      <span className="font-semibold text-[13px] md:text-[15px]">
                        ₹ {displayDiscountPrice.toFixed(2)}
                      </span>
                      {displayOriginalPrice > displayDiscountPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          ₹ {displayOriginalPrice.toFixed(2)}
                        </span>
                      )}
                      {discountPercentage > 0 && (
                        <span className="text-xs text-green-600">
                          {discountPercentage}% OFF
                        </span>
                      )}
                      {itemWiseDiscount && itemWiseDiscount[item._id] > 0 && (
                        <span className="text-xs text-green-600 px-2 py-0.5 rounded-full bg-green-50 border border-green-200">
                          -₹{itemWiseDiscount[item._id].toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 text-sm">
                      <button
                        className="border border-gray-200 rounded-full cursor-pointer w-6 h-6 flex items-center justify-center"
                        onClick={() =>
                          updateCartItemQuantity(item._id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="w-4 text-center">{item.quantity}</span>
                      <button
                        className="border border-gray-200 rounded-full cursor-pointer w-6 h-6 flex items-center justify-center"
                        onClick={() =>
                          updateCartItemQuantity(item._id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <div className="pt-1 shrink-0">
                  <button
                    className="text-gray-500 hover:text-red-600 cursor-pointer"
                    onClick={() => handleRemoveItem(item)}
                  >
                    <Image
                      src="/assets/icons/delete.svg"
                      alt="Delete Selected"
                      width={20}
                      height={20}
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
