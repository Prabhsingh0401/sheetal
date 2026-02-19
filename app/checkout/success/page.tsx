"use client";
import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../hooks/useCart";

const SuccessContent = () => {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get("razorpay_payment_id");
    const paymentStatus = searchParams.get("razorpay_payment_link_status");
    const paymentMethod = searchParams.get("payment_method"); // "cod" for COD orders
    const { clearCart } = useCart();

    const isCOD = paymentMethod === "cod";

    useEffect(() => {
        // Clear cart for online payments confirmed by Razorpay
        const userStr = localStorage.getItem("user_details");
        if (paymentStatus === "paid" && userStr) {
            const user = JSON.parse(userStr);
            if (user && user.id) {
                clearCart(user.id);
            }
        }
        // For COD, cart is cleared on the server side when the order is created
    }, [paymentStatus, clearCart]);

    return (
        <div className="bg-white p-8 rounded shadow-md text-center max-w-md w-full">
            {/* Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h1 className="text-2xl font-bold text-[#bd9951] mb-2">
                {isCOD ? "Order Confirmed!" : "Payment Successful!"}
            </h1>

            <p className="text-gray-600 mb-6">
                {isCOD
                    ? "Your order has been placed. Pay with cash when your order arrives."
                    : "Thank you for your purchase. Your order has been placed successfully."}
            </p>

            {/* Show payment ID only for online payments */}
            {paymentId && !isCOD && (
                <div className="bg-gray-100 p-3 rounded mb-6 text-sm">
                    <p>Payment ID: <span className="font-mono">{paymentId}</span></p>
                </div>
            )}

            {/* COD note */}
            {isCOD && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded mb-6 text-sm text-amber-800">
                    <p>Payment will be collected at your doorstep on delivery.</p>
                </div>
            )}

            <Link
                href="/"
                className="block w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 transition"
            >
                Continue Shopping
            </Link>
        </div>
    );
};

const SuccessPage = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 font-montserrat">
            <Suspense fallback={<div>Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
};

export default SuccessPage;
