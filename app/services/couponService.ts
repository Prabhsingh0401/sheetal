import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/v1/coupons";

export const getAllCouponsClient = async (token: string) => {
  try {
    const response = await axios.get(API_URL + "/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
