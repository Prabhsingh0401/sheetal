import { apiFetch } from "./api";

export interface BasicInfoAddress {
  addressLine: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
}

export interface BasicInfo {
  gstNumber: string;
  shippingAddress: BasicInfoAddress;
  billingAddress: BasicInfoAddress;
}

const emptyAddress = {
  addressLine: "",
  pincode: "",
  city: "",
  state: "",
  country: "",
};

const normalizeAddress = (value: Partial<BasicInfoAddress> | string | null | undefined) => {
  if (!value) return emptyAddress;
  if (typeof value === "string") {
    return { ...emptyAddress, addressLine: value };
  }

  return {
    addressLine: value.addressLine || "",
    pincode: value.pincode || "",
    city: value.city || "",
    state: value.state || "",
    country: value.country || "",
  };
};

export const getBasicInfo = async () => {
  const res = await apiFetch("/basic-info", { method: "GET" });

  if (!res?.success || !res?.data) {
    return {
      success: false,
      message: res?.message || "Unable to load basic info.",
    };
  }

  return {
    success: true,
    data: {
      gstNumber: res.data.gstNumber || "",
      shippingAddress: normalizeAddress(res.data.shippingAddress),
      billingAddress: normalizeAddress(res.data.billingAddress),
    } as BasicInfo,
  };
};
