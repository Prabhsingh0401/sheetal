"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "../services/api";
import {
  isExternalHref,
  isTopInfoVisible,
  defaultTopInfoConfig,
  type HomepageSettings,
} from "../services/homepageService";

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

const defaultText = "Check back soon for fresh offers.";

const getOfferText = (homepageCoupon: HomepageCoupon) => {
  if (homepageCoupon.offerType === "Percentage") {
    return `Up to ${homepageCoupon.offerValue}% Off`;
  }
  if (homepageCoupon.offerType === "FixedAmount") {
    return `Flat Rs.${homepageCoupon.offerValue} Off`;
  }
  if (homepageCoupon.offerType === "BOGO") return "Buy One Get One Free";
  return "";
};

const getCouponHref = (coupon: HomepageCoupon | null) => {
  const applicableItem =
    coupon?.applicableIds && coupon.applicableIds.length > 0
      ? coupon.applicableIds[coupon.applicableIds.length - 1]
      : null;
  const applicableSlug =
    applicableItem && typeof applicableItem === "object"
      ? applicableItem.slug || null
      : null;

  if (coupon?.scope === "Specific_Product" && applicableSlug) {
    return `/product/${applicableSlug}`;
  }
  if (coupon?.scope === "Category" && applicableSlug) {
    return `/${applicableSlug}`;
  }
  return "/product-list";
};

const TopInfoLink = ({
  href,
  label,
}: {
  href: string;
  label: string;
}) => {
  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="underline font-normal"
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className="underline font-normal">
      {label}
    </Link>
  );
};

const defaultSettings: HomepageSettings = {
  sections: {
    topInfo: true,
    homeBanner: true,
    aboutSBS: true,
    hiddenBeauty: true,
    trendingThisWeek: true,
    newArrivals: true,
    collections: true,
    timelessWomenCollection: true,
    instagramDiaries: true,
    testimonials: true,
    blogs: true,
    bookAppointmentWidget: true,
  },
  topInfoConfig: defaultTopInfoConfig,
};

async function getTopInfoData() {
  try {
    const settingsResponse = await fetch(`${API_BASE_URL}/homepage/sections`, {
      next: { revalidate: 300 },
    });
    const settingsJson = await settingsResponse.json();
    const homepageSettings: HomepageSettings = {
      sections: {
        ...defaultSettings.sections,
        ...(settingsJson?.sections || {}),
      },
      topInfoConfig: {
        ...defaultSettings.topInfoConfig,
        ...(settingsJson?.topInfoConfig || {}),
      },
    };

    const topInfoVisible = isTopInfoVisible(
      homepageSettings.sections,
      homepageSettings.topInfoConfig,
    );
    const topInfoMode = homepageSettings.topInfoConfig?.mode || "coupon";

    if (!topInfoVisible) {
      return null;
    }

    if (topInfoMode !== "coupon") {
      return { homepageSettings, coupon: null as HomepageCoupon | null };
    }

    try {
      const couponResponse = await fetch(`${API_BASE_URL}/coupons/homepage`, {
        next: { revalidate: 300 },
      });
      const couponJson = await couponResponse.json();
      return {
        homepageSettings,
        coupon: couponJson.data || couponJson.coupon || null,
      };
    } catch {
      return { homepageSettings, coupon: null as HomepageCoupon | null };
    }
  } catch {
    return {
      homepageSettings: defaultSettings,
      coupon: null as HomepageCoupon | null,
    };
  }
}

const buildTopInfoContent = (topInfoData: Awaited<ReturnType<typeof getTopInfoData>>) => {
  if (!topInfoData) {
    return null;
  }

  const { homepageSettings, coupon } = topInfoData;

  const topInfoVisible = isTopInfoVisible(
    homepageSettings?.sections,
    homepageSettings?.topInfoConfig,
  );
  const topInfoMode = homepageSettings?.topInfoConfig?.mode || "coupon";

  if (!topInfoVisible) {
    return null;
  }

  if (topInfoMode === "custom") {
    return {
      text:
        homepageSettings?.topInfoConfig?.customText?.trim() || defaultText,
      code: null,
      href:
        homepageSettings?.topInfoConfig?.customCtaHref?.trim() ||
        "/product-list",
      ctaLabel:
        homepageSettings?.topInfoConfig?.customCtaLabel?.trim() ||
        "Shop Now",
    };
  }

  const isExpired = coupon?.endDate
    ? new Date(coupon.endDate) < new Date()
    : false;
  const hasValidCoupon = Boolean(coupon && !isExpired);
  const validCoupon = hasValidCoupon ? coupon : null;
  const displayText = validCoupon
    ? validCoupon.description || getOfferText(validCoupon)
    : defaultText;

  return {
    text: displayText,
    code: validCoupon?.couponType === "CouponCode" ? validCoupon.code : null,
    href: validCoupon ? getCouponHref(validCoupon) : "/product-list",
    ctaLabel: "Shop Now",
  };
};

const TopInfo = () => {
  const [content, setContent] = useState<{
    text: string;
    code: string | null;
    href: string;
    ctaLabel: string;
  } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadTopInfo = async () => {
      const topInfoData = await getTopInfoData();
      if (!isMounted) return;
      setContent(buildTopInfoContent(topInfoData));
      setIsLoaded(true);
    };

    void loadTopInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isLoaded || !content) {
    return null;
  }

  const hasText = content.text.trim() !== "";

  return (
    <div className="text-center bg-[#f3bf43] h-[27px] font-[family-name:var(--font-montserrat)]">
      <p className="m-0 text-[15px] py-[2px] max-[552px]:text-[12px] max-[552px]:pt-[5px] max-[552px]:pb-0 text-black">
        {content.text}
        {content.code && (
          <>
            {" "}Use code{" "}
            <span className="font-bold tracking-widest">{content.code}</span>
            {": "}
          </>
        )}
        {!content.code && hasText && ": "}
        <TopInfoLink href={content.href} label={content.ctaLabel} />
      </p>
    </div>
  );
};

export default TopInfo;
