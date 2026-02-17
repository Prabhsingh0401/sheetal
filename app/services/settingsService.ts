import { apiFetch } from "./api";

interface Settings {
  platformFee: number;
  shippingFee: number;
  freeShippingThreshold: number;
  taxPercentage: number;
  navbarLayout?: any[]; // Recursive layout structure
  footerLayout?: any[]; // Footer sections with links
}

export const getSettings = async (): Promise<Settings> => {
  const result = await apiFetch("/settings");
  if (result.success && result.data) {
    return result.data;
  }
  return {
    platformFee: 0,
    shippingFee: 0,
    freeShippingThreshold: 0,
    taxPercentage: 0,
    navbarLayout: [],
    footerLayout: [],
  };
};
