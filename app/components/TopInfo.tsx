"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "../services/api";

interface HomepageCoupon {
  code: string;
  description: string;
  offerType: string;
  offerValue: number;
  couponType: string;
  scope?: "All" | "Category" | "Specific_Product";
  applicableIds?: Array<{ name?: string; slug?: string } | string>;
}

const TopInfo = () => {
  const [coupon, setCoupon] = useState<HomepageCoupon | null>(null);

  useEffect(() => {
    const fetchHomepageCoupon = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/coupons/homepage`);
        const data = await res.json();
        const homepageCoupon = data.data || data.coupon || null;
        if (homepageCoupon) setCoupon(homepageCoupon);
      } catch (err) {
        console.error("Failed to fetch homepage coupon:", err);
      }
    };

    fetchHomepageCoupon();
  }, []);

  const getOfferText = (coupon: HomepageCoupon) => {
    if (coupon.offerType === "Percentage") return `Up to ${coupon.offerValue}% Off`;
    if (coupon.offerType === "FixedAmount") return `Flat ₹${coupon.offerValue} Off`;
    if (coupon.offerType === "BOGO") return "Buy One Get One Free";
    return "";
  };

  const displayText = coupon
    ? coupon.description || `${getOfferText(coupon)}`
    : "";

  const displayCode = coupon?.couponType === "CouponCode" ? coupon.code : null;
  const applicableItem =
    coupon?.applicableIds && coupon.applicableIds.length > 0
      ? coupon.applicableIds[coupon.applicableIds.length - 1]
      : null;
  const applicableSlug =
    applicableItem && typeof applicableItem === "object"
      ? applicableItem.slug || null
      : null;
  const ctaHref =
    coupon?.scope === "Specific_Product" && applicableSlug
      ? `/product/${applicableSlug}`
      : coupon?.scope === "Category" && applicableSlug
        ? `/${applicableSlug}`
        : "/product-list";

  return (
    <div className="text-center bg-[#f3bf43] h-[27px] font-[family-name:var(--font-montserrat)]">
      <p className="m-0 text-[15px] py-[2px] max-[552px]:text-[12px] max-[552px]:pt-[5px] max-[552px]:pb-0 text-black">
        {displayText}
        {displayCode && (
          <>
            {" "}— Use code{" "}
            <span className="font-bold tracking-widest">{displayCode}</span>
            {": "}
          </>
        )}
        {!displayCode && displayText !== "" && ": "}
        {displayText !== "" && (
          <Link href={ctaHref} className="underline font-normal">
          Shop Now
        </Link>
        )}
      </p>
    </div>
  );
};

export default TopInfo;
