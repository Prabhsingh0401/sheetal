import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/v1/coupons";

interface GetAllCouponsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const getAllCouponsClient = async (
  token?: string,
  params?: GetAllCouponsParams,
) => {
  try {
    const headers = token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined;
    const response = await axios.get(API_URL, { headers, params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const applyCouponClient = async (
  code: string,
  cartTotal: number,
  userId: string,
  cartItems: any[],
  token: string,
) => {
  try {
    const response = await axios.post(
      API_URL + "/apply",
      { code, cartTotal, userId, cartItems },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
