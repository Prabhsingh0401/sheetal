import { apiFetch } from "./api";

export interface HomepageSections {
  topInfo?: boolean;
  homeBanner?: boolean;
  aboutSBS?: boolean;
  hiddenBeauty?: boolean;
  trendingThisWeek?: boolean;
  newArrivals?: boolean;
  collections?: boolean;
  timelessWomenCollection?: boolean;
  instagramDiaries?: boolean;
  testimonials?: boolean;
  blogs?: boolean;
  bookAppointmentWidget?: boolean;
}

export interface TopInfoConfig {
  mode: "coupon" | "custom" | "hidden";
  customText: string;
  customCtaLabel: string;
  customCtaHref: string;
}

export interface HomepageSettings {
  sections: HomepageSections;
  topInfoConfig: TopInfoConfig;
}

export const defaultTopInfoConfig: TopInfoConfig = {
  mode: "coupon",
  customText: "",
  customCtaLabel: "Shop Now",
  customCtaHref: "/product-list",
};

const defaultSections: HomepageSections = {
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
};

export const getHomepageSettings = async (): Promise<HomepageSettings> => {
  const result = await apiFetch("/homepage/sections");

  return {
    sections: {
      ...defaultSections,
      ...(result?.sections || {}),
    },
    topInfoConfig: {
      ...defaultTopInfoConfig,
      ...(result?.topInfoConfig || {}),
    },
  };
};

export const isTopInfoVisible = (
  sections?: HomepageSections | null,
  topInfoConfig?: Partial<TopInfoConfig> | null,
) => {
  if (sections?.topInfo === false) return false;
  return (topInfoConfig?.mode || defaultTopInfoConfig.mode) !== "hidden";
};

export const isExternalHref = (href?: string | null) =>
  Boolean(href && /^(https?:\/\/|mailto:|tel:)/i.test(href));
