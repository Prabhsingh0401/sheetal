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
