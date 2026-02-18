"use client";
import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../hooks/useCart";

const SuccessContent = () => {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get("razorpay_payment_id");
    const paymentStatus = searchParams.get("razorpay_payment_link_status");
    const { clearCart } = useCart();

    useEffect(() => {
        const userStr = localStorage.getItem("user_details");
        if (paymentStatus === "paid" && userStr) {
            const user = JSON.parse(userStr);
            if (user && user.id) {
                clearCart(user.id);
            }
        }
    }, [paymentStatus, clearCart]);

    return (
        <div className="bg-white p-8 rounded shadow-md text-center max-w-md w-full">
            <h1 className="text-2xl font-bold text-[#bd9951] mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been placed successfully.
            </p>

            {paymentId && (
                <div className="bg-gray-100 p-3 rounded mb-6 text-sm">
                    <p>Payment ID: <span className="font-mono">{paymentId}</span></p>
                </div>
            )}

            <Link href="/" className="block w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 transition">
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
