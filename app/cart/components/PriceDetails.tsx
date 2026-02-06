"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { getToken, getUserDetails } from "@/app/services/authService";
import { getAllCouponsClient } from "@/app/services/couponService";

interface PriceDetailsProps {
  couponInput: string;
  setCouponInput: (value: string) => void;
  handleApplyCoupon: (userId: string | undefined) => void;
  couponError: string | null;
  bogoMessage: string | null;
  applicableCategories: string[];
  categoryName: string | null | undefined;
  cartLength: number;
  totalMrp: number;
  totalDiscount: number;
  couponDiscount: number;
  shippingCharges: number;
  platformFee: number;
  totalAmount: number;
  couponCode?: string;
  onRemoveCoupon?: () => void;
  hideProceedButton?: boolean;
}

const PriceDetails: React.FC<PriceDetailsProps> = ({
  couponInput,
  setCouponInput,
  handleApplyCoupon,
  couponError,
  bogoMessage,
  applicableCategories,
  categoryName,
  cartLength,
  totalMrp,
  totalDiscount,
  couponDiscount,
  shippingCharges,
  platformFee,
  totalAmount,
  couponCode,
  onRemoveCoupon,
  hideProceedButton = false,
}) => {
  const [openCouponModal, setOpenCouponModal] = useState(false);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [selectedCouponCode, setSelectedCouponCode] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (openCouponModal) {
      const token = getToken();
      if (token) {
        const fetchCoupons = async () => {
          try {
            const response = await getAllCouponsClient(token);
            const list = response?.data?.data || response?.data || [];
            setCoupons(Array.isArray(list) ? list : []);
          } catch (error) {
            console.error("Error fetching coupons:", error);
          }
        };
        fetchCoupons();
      } else {
        toast.error("Please login to view coupons.");
      }
      // Reset selection when modal opens
      setSelectedCouponCode(couponCode || null);
      setCouponInput(couponCode || "");
    }
  }, [openCouponModal, couponCode]);

  const applyCouponAndClose = () => {
    const user = getUserDetails();
    if (!couponInput.trim()) {
      toast.error("Please select a coupon to apply.");
      return;
    }
    handleApplyCoupon(user?.id);
    setOpenCouponModal(false);
  };

  const handleRemoveCoupon = () => {
    if (onRemoveCoupon) {
      onRemoveCoupon();
    }
    setCouponInput("");
    setSelectedCouponCode(null);
  };

  return (
    <>
      <div className="mt-5 font-[family-name:var(--font-monterrat)]">
        <div className="p-4">
          <h3 className="text-md font-bold mb-4 uppercase">Coupons</h3>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 flex-1">
              <Image
                src="/assets/icons/tag.svg"
                alt="Coupon"
                width={20}
                height={20}
              />
              <h1 className="text-sm font-semibold uppercase">
                {couponCode ? (
                  <span className="text-green-600">{couponCode}</span>
                ) : (
                  "Apply Coupons"
                )}
              </h1>
            </div>

            {couponCode && onRemoveCoupon ? (
              <button onClick={handleRemoveCoupon} className="mr-2">
                <Image
                  src="/assets/icons/delete.svg"
                  alt="Info"
                  width={16}
                  height={16}
                  className="inline-block mr-2 cursor-pointer"
                />
              </button>
            ) : null}

            <button
              onClick={() => setOpenCouponModal(true)}
              className="text-[#6a3f07] font-semibold border border-[#6a3f07] rounded-[2px] px-4 py-1 text-sm cursor-pointer"
            >
              {couponCode ? "CHANGE" : "APPLY"}
            </button>
          </div>

          {couponError && (
            <p className="text-red-500 text-xs mt-2">{couponError}</p>
          )}

          {bogoMessage && (
            <p className="text-green-600 text-sm mt-2 font-medium">
              {bogoMessage}
            </p>
          )}

          {applicableCategories.length > 0 && (
            <p className="text-blue-600 text-sm mt-2">
              Coupon applied to applicable items.
            </p>
          )}

          <h3 className="text-md font-bold mb-4 uppercase mt-5">
            Price Details ({cartLength} {cartLength === 1 ? "Item" : "Items"})
          </h3>

          <div className="space-y-5 text-sm">
            <div className="flex justify-between">
              <span>Total MRP</span>
              <span>₹{totalMrp.toFixed(2)}</span>
            </div>

            {totalDiscount > 0 && (
              <div className="flex justify-between">
                <span>Discount on MRP</span>
                <span className="text-green-600">
                  -₹{totalDiscount.toFixed(2)}
                </span>
              </div>
            )}

            {couponDiscount > 0 && (
              <div className="flex justify-between">
                <span>Coupon Discount</span>
                <span className="text-green-600 font-semibold">
                  -₹{couponDiscount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping Charges</span>
              <span className={shippingCharges === 0 ? "text-green-600" : ""}>
                {shippingCharges === 0
                  ? "FREE"
                  : `₹${shippingCharges.toFixed(2)}`}
              </span>
            </div>

            {platformFee > 0 && (
              <div className="flex justify-between">
                <span>
                  Platform Fee
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
            )}
          </div>

          <div className="flex justify-between font-bold text-lg mt-3 border-t border-gray-200 pt-3">
            <span>Total Amount</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>

          <p className="text-xs text-gray-500 text-right mt-1">
            Tax included. Shipping Calculated at checkout.
          </p>

          {!hideProceedButton && (
            <Link
              href="/checkout/address"
              className="w-full block text-center bg-[#be9952] text-white py-3 rounded-[5px] mt-6 font-bold uppercase hover:bg-[#5a3506] transition-colors"
            >
              Proceed to Buy
            </Link>
          )}
        </div>
      </div>

      {openCouponModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="font-semibold text-lg">Apply Coupon</h2>
              <button
                className="cursor-pointer text-2xl hover:text-gray-600"
                onClick={() => setOpenCouponModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <div
                    key={coupon._id || coupon.id}
                    className={`border border-dashed p-4 rounded-md cursor-pointer ${selectedCouponCode === coupon.code
                      ? "border-[#6a3f07] border-2"
                      : "border-gray-500"
                      }`}
                    onClick={() => {
                      setSelectedCouponCode(coupon.code);
                      setCouponInput(coupon.code);
                    }}
                  >
                    <div className="font-bold border border-dashed border-gray-500 text-[#6b5639] mb-2 uppercase text-lg p-2 w-full">
                      {coupon.code}
                    </div>
                    <div className="flex flex-wrap justify-start gap-1 mt-2">
                      {" "}
                      {/* Changed justify-end to justify-start for better alignment */}
                      {coupon.offerType === "BOGO" && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5">
                          Buy 1 Get 1
                        </span>
                      )}
                      {coupon.scope === "Category" &&
                        coupon.applicableIds &&
                        coupon.applicableIds.length > 0 && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5">
                            {typeof coupon.applicableIds[0] === 'object' && coupon.applicableIds[0].name ? coupon.applicableIds[0].name : "Category Offer"}
                          </span>
                        )}
                      {coupon.scope === "Specific_Product" && (
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5">
                          Product Offer
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-semibold text-gray-800 mt-2">
                      {coupon.offerType === "Percentage"
                        ? `Get ${coupon.offerValue}% OFF`
                        : coupon.offerType === "FixedAmount"
                          ? `Save ₹${coupon.offerValue}`
                          : coupon.offerType === "BOGO"
                            ? coupon.description
                            : `${coupon.offerType} Offer`}
                    </div>

                    {coupon.description && coupon.offerType !== "BOGO" && (
                      <div className="text-xs text-gray-600">
                        {coupon.description}
                      </div>
                    )}

                    {coupon.minPurchase && (
                      <div className="text-xs text-gray-500">
                        Min. purchase: ₹{coupon.minPurchase}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-center text-gray-500 mb-2">
                    No coupons available at the moment.
                  </p>
                  <p className="text-sm text-gray-400">
                    Check back later for exclusive offers!
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200">
              <button
                onClick={applyCouponAndClose}
                disabled={!selectedCouponCode}
                className="w-full bg-[#ff9900] text-white py-3 font-bold uppercase transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-[#e68a00]"
              >
                Apply Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PriceDetails;
