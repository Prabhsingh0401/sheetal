"use client";
import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyRazorpayPayment } from "../../services/paymentService";

const SuccessContent = () => {
    const searchParams = useSearchParams();

    // Razorpay appends these to the callback URL after payment
    const paymentLinkId     = searchParams.get("razorpay_payment_link_id");
    const referenceId       = searchParams.get("razorpay_payment_link_reference_id");
    const paymentLinkStatus = searchParams.get("razorpay_payment_link_status");
    const paymentId         = searchParams.get("razorpay_payment_id");
    const signature         = searchParams.get("razorpay_signature");

    // COD orders redirect here with ?payment_method=cod
    const paymentMethod = searchParams.get("payment_method");
    const isCOD         = paymentMethod === "cod";
    const isOnline      = !!paymentId && !!signature;

    const [verifying, setVerifying]     = useState(isOnline);
    const [verifyError, setVerifyError] = useState("");

    useEffect(() => {
        if (!isOnline) return; // COD — nothing to verify

        const verify = async () => {
            try {
                const res = await verifyRazorpayPayment({
                    razorpay_payment_link_id: paymentLinkId!,
                    razorpay_payment_link_reference_id: referenceId!,
                    razorpay_payment_link_status: paymentLinkStatus!,
                    razorpay_payment_id: paymentId!,
                    razorpay_signature: signature!,
                });

                if (!res?.success) {
                    setVerifyError(res?.message || "Verification failed");
                }
            } catch (err: any) {
                setVerifyError(err.message || "Something went wrong");
            } finally {
                setVerifying(false);
            }
        };

        verify();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Loading — verifying payment signature
    if (verifying) {
        return (
            <div className="bg-white p-8 rounded shadow-md text-center max-w-md w-full">
                <div className="w-12 h-12 border-4 border-[#bd9951] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Confirming your payment...</p>
            </div>
        );
    }

    // Verification failed
    if (verifyError) {
        return (
            <div className="bg-white p-8 rounded shadow-md text-center max-w-md w-full">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold text-red-600 mb-2">Verification Failed</h1>
                <p className="text-gray-600 mb-4 text-sm">{verifyError}</p>
                <Link href="/" className="block w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 transition">
                    Go Home
                </Link>
            </div>
        );
    }

    // Success
    return (
        <div className="bg-white p-8 rounded shadow-md text-center max-w-md w-full">
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
            
            {isCOD && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded mb-6 text-sm text-amber-800">
                    <p>Payment will be collected at your doorstep on delivery.</p>
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
