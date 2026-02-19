import { apiFetch } from "./api";

/**
 * Creates a COD (Cash on Delivery) order directly via the orders API.
 * For Online orders, use paymentService.createRazorpayPaymentLink instead.
 *
 * @param shippingAddress - The selected delivery address object
 * @param orderItems      - Array of cart items to order
 * @param pricing         - Price breakdown (itemsPrice, shippingPrice, taxPrice, totalPrice)
 */
export const createCODOrder = async (
    shippingAddress: object,
    orderItems: object[],
    pricing: {
        itemsPrice: number;
        shippingPrice: number;
        taxPrice: number;
        totalPrice: number;
    }
) => {
    return apiFetch("/orders/create", {
        method: "POST",
        body: JSON.stringify({
            orderItems,
            shippingAddress,
            paymentInfo: {
                method: "COD",
                status: "Pending",
            },
            ...pricing,
        }),
    });
};
