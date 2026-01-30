"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface PriceDetailsProps {
  couponInput: string;
  setCouponInput: (value: string) => void;
  handleApplyCoupon: () => void;
  couponError: string | null;
  bogoMessage: string | null;
  applicableCategory: string | null;
  categoryName: string | null | undefined;
  cartLength: number;
  totalMrp: number;
  totalDiscount: number;
  couponDiscount: number;
  shippingCharges: number;
  platformFee: number;
  totalAmount: number;
}

const PriceDetails: React.FC<PriceDetailsProps> = ({
  couponInput,
  setCouponInput,
  handleApplyCoupon,
  couponError,
  bogoMessage,
  applicableCategory,
  categoryName,
  cartLength,
  totalMrp,
  totalDiscount,
  couponDiscount,
  shippingCharges,
  platformFee,
  totalAmount,
}) => {
  return (
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
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Enter Coupon Code"
              className="ml-2 p-2 border rounded-md w-full uppercase"
            />
          </div>
          <button
            onClick={handleApplyCoupon}
            className="text-[#6a3f07] font-semibold border border-[#6a3f07] rounded-md px-4 py-1 text-sm"
          >
            APPLY
          </button>
        </div>
        {couponError && (
          <p className="text-red-500 text-xs mt-2">{couponError}</p>
        )}
        {bogoMessage && (
          <p className="text-green-600 text-sm mt-2">{bogoMessage}</p>
        )}
        {applicableCategory && categoryName && (
          <p className="text-blue-600 text-sm mt-2">
            Coupon applied to <strong>{categoryName}</strong>.
          </p>
        )}
        <div className="mt-4">
        </div>
        <h3 className="text-md font-bold mb-4 uppercase mt-5">
          Price Details ({cartLength} Items)
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
  );
};

export default PriceDetails;
