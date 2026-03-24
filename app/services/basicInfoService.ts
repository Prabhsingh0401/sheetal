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

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

const normalizeAddress = (
  value: Partial<BasicInfoAddress> | Record<string, unknown> | string | null | undefined,
) => {
  if (!value) return emptyAddress;
  if (typeof value === "string") {
    return { ...emptyAddress, addressLine: value };
  }

  return {
    addressLine: pickString(
      value.addressLine,
      value.addressLine1,
      value.address,
      value.line1,
      value.street,
    ),
    pincode: pickString(value.pincode, value.postalCode, value.zip, value.zipcode),
    city: pickString(value.city),
    state: pickString(value.state),
    country: pickString(value.country),
  };
};

export const getBasicInfo = async () => {
  const res = await apiFetch("/basic-info/public", { method: "GET" });

  if (!res?.success || !res?.data) {
    return {
      success: false,
      message: res?.message || "Unable to load basic info.",
    };
  }

  return {
    success: true,
    data: {
      gstNumber: pickString(
        res.data.gstNumber,
        res.data.gstinNumber,
        res.data.gstin,
        res.data.gstNo,
      ),
      shippingAddress: normalizeAddress(res.data.shippingAddress),
      billingAddress: normalizeAddress(res.data.billingAddress),
    } as BasicInfo,
  };
};
