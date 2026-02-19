import { apiFetch } from "./api";

export const createRazorpayPaymentLink = async (addressId: string, shippingAddress: any) => {
    const callbackUrl = `${window.location.origin}/checkout/success`;

    return await apiFetch("/payment/create-link", {
        method: "POST",
        body: JSON.stringify({
            addressId,
            shippingAddress,
            callbackUrl
        }),
    });
};

/**
 * Verifies an online payment after Razorpay redirects to /checkout/success.
 * Sends all URL query params Razorpay appended to the backend for signature verification.
 * Backend marks the order as Paid, clears cart, and pushes to Shiprocket.
 */
export const verifyRazorpayPayment = async (params: {
    razorpay_payment_link_id: string;
    razorpay_payment_link_reference_id: string;
    razorpay_payment_link_status: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}) => {
    return await apiFetch("/payment/verify", {
        method: "POST",
        body: JSON.stringify(params),
    });
};
