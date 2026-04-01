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
  endDate?: string;
  scope?: "All" | "Category" | "Specific_Product";
  applicableIds?: Array<{ name?: string; slug?: string } | string>;
}

const TopInfo = () => {
  const [coupon, setCoupon] = useState<HomepageCoupon | null>(null);
  const defaultText = "Check back soon for fresh offers.";

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

  const getOfferText = (homepageCoupon: HomepageCoupon) => {
    if (homepageCoupon.offerType === "Percentage") return `Up to ${homepageCoupon.offerValue}% Off`;
    if (homepageCoupon.offerType === "FixedAmount") return `Flat ₹${homepageCoupon.offerValue} Off`;
    if (homepageCoupon.offerType === "BOGO") return "Buy One Get One Free";
    return "";
  };

  const isExpired = coupon?.endDate ? new Date(coupon.endDate) < new Date() : false;

  const displayText =
    coupon && !isExpired ? coupon.description || getOfferText(coupon) : defaultText;

  const displayCode =
    coupon && !isExpired && coupon.couponType === "CouponCode" ? coupon.code : null;

  const applicableItem =
    coupon?.applicableIds && coupon.applicableIds.length > 0
      ? coupon.applicableIds[coupon.applicableIds.length - 1]
      : null;
  const applicableSlug =
    applicableItem && typeof applicableItem === "object"
      ? applicableItem.slug || null
      : null;
  const ctaHref =
    coupon && !isExpired && coupon.scope === "Specific_Product" && applicableSlug
      ? `/product/${applicableSlug}`
      : coupon && !isExpired && coupon.scope === "Category" && applicableSlug
        ? `/${applicableSlug}`
        : "/product-list";

  return (
    <div className="text-center bg-[#f3bf43] h-[27px] font-[family-name:var(--font-montserrat)]">
      <p className="m-0 text-[15px] py-[2px] max-[552px]:text-[12px] max-[552px]:pt-[5px] max-[552px]:pb-0 text-black">
        {displayText}
        {displayCode && (
          <>
            {" "}â€” Use code{" "}
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
