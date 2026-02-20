"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getOrderById } from "../../../services/orderService";
import { getApiImageUrl } from "../../../services/api";

// ─── Types (mirrors the Order model) ─────────────────────────────────────────

type OrderStatus =
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | "Returned"
    | "Exchanged";

interface OrderItem {
    _id: string;
    product: string | null;
    name: string;
    image: string;
    price: number;
    quantity: number;
    variant?: { size?: string; color?: string; v_sku?: string };
}

interface RawOrder {
    _id: string;
    orderItems: OrderItem[];
    orderStatus: OrderStatus;
    totalPrice: number;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    paymentInfo: { id?: string; status?: string; method: "COD" | "Online" };
    shippingAddress: {
        fullName: string;
        phoneNumber: string;
        addressLine1: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    trackingId?: string;
    courierPartner?: string;
    awbCode?: string;
    deliveredAt?: string;
    paidAt?: string;
    createdAt: string;
    updatedAt: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_STEPS: Record<OrderStatus, number> = {
    Processing: 0,
    Shipped: 1,
    Delivered: 2,
    Cancelled: -1,
    Returned: -1,
    Exchanged: -1,
};

const STATUS_LABEL: Record<OrderStatus, string> = {
    Processing: "Order Confirmed",
    Shipped: "Shipped",
    Delivered: "Delivered",
    Cancelled: "Cancelled",
    Returned: "Returned",
    Exchanged: "Exchanged",
};

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

const fmtDateTime = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Horizontal 3-step progress bar matching the HTML design */
const OrderProgress = ({
    status,
    placedAt,
    deliveredAt,
}: {
    status: OrderStatus;
    placedAt: string;
    deliveredAt?: string;
}) => {
    const step = STATUS_STEPS[status] ?? 0;
    const isCancelled = status === "Cancelled" || status === "Returned" || status === "Exchanged";

    const steps = [
        { label: "Order Confirmed", date: fmtDate(placedAt) },
        { label: "Shipped", date: step >= 1 ? "Dispatched" : "Pending" },
        {
            label: "Delivery",
            date:
                status === "Delivered" && deliveredAt
                    ? fmtDateTime(deliveredAt)
                    : "Expected soon",
        },
    ];

    if (isCancelled) {
        return (
            <div className="flex items-center gap-3 py-3 px-1">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m15 9-6 6M9 9l6 6" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-semibold text-red-600">
                        Order {STATUS_LABEL[status]}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{fmtDate(placedAt)}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Step dots + connector */}
            <div className="flex items-center">
                {steps.map((s, i) => {
                    const done = i <= step;
                    const isLast = i === steps.length - 1;
                    return (
                        <React.Fragment key={i}>
                            {/* Dot */}
                            <div className="flex flex-col items-center shrink-0">
                                <div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${done
                                            ? "border-[#a97f0f] bg-[#a97f0f]"
                                            : "border-gray-300 bg-white"
                                        }`}
                                >
                                    {done && (
                                        <svg
                                            width="10"
                                            height="10"
                                            viewBox="0 0 10 8"
                                            fill="none"
                                        >
                                            <path
                                                d="M1 4l3 3 5-6"
                                                stroke="white"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </div>
                                {/* Label beneath dot */}
                                <div
                                    className={`text-center mt-1.5 ${i === 0 ? "text-left" : i === steps.length - 1 ? "text-right" : "text-center"} max-w-[80px]`}
                                >
                                    <p
                                        className={`text-[11px] font-semibold leading-tight ${done ? "text-gray-800" : "text-gray-400"}`}
                                    >
                                        {s.label}
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{s.date}</p>
                                </div>
                            </div>
                            {/* Connector line */}
                            {!isLast && (
                                <div
                                    className={`flex-1 h-0.5 mx-1 transition-colors ${i < step ? "bg-[#a97f0f]" : "bg-gray-200"}`}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

/** Tracking timeline (vertical, expandable) */
const TrackingTimeline = ({
    order,
}: {
    order: RawOrder;
}) => {
    const step = STATUS_STEPS[order.orderStatus] ?? 0;

    const timeline = [
        {
            label: "Order Placed",
            detail: "We have received your order.",
            date: fmtDateTime(order.createdAt),
            done: true,
        },
        {
            label: "Packed & Ready",
            detail: "Your order has been packed.",
            date: step >= 1 ? fmtDate(order.updatedAt) : "",
            done: step >= 1,
        },
        {
            label: "Shipped",
            detail: order.courierPartner
                ? `Shipped via ${order.courierPartner}`
                : "Your order is on the way.",
            date: step >= 1 ? "" : "",
            done: step >= 1,
        },
        {
            label: "Out for Delivery",
            detail: "Delivery Executive details will be available once out for delivery.",
            date: "",
            done: step >= 2,
        },
        {
            label: "Delivered",
            detail: "Your order has been delivered.",
            date:
                order.orderStatus === "Delivered" && order.deliveredAt
                    ? fmtDateTime(order.deliveredAt)
                    : "",
            done: order.orderStatus === "Delivered",
        },
    ];

    return (
        <div className="mt-4 space-y-4 pl-1">
            {timeline.map((t, i) => (
                <div key={i} className="flex gap-3">
                    {/* Indicator column */}
                    <div className="flex flex-col items-center">
                        <div
                            className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${t.done
                                    ? "border-[#a97f0f] bg-[#a97f0f]"
                                    : "border-gray-300 bg-white"
                                }`}
                        >
                            {t.done && (
                                <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
                                    <path
                                        d="M1 4l3 3 5-6"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )}
                        </div>
                        {i < timeline.length - 1 && (
                            <div
                                className={`w-px flex-1 mt-1 ${t.done ? "bg-[#a97f0f]" : "bg-gray-200"}`}
                                style={{ minHeight: 24 }}
                            />
                        )}
                    </div>
                    {/* Text */}
                    <div className="pb-3">
                        <p
                            className={`text-sm font-semibold ${t.done ? "text-gray-900" : "text-gray-400"}`}
                        >
                            {t.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{t.detail}</p>
                        {t.date && (
                            <p className="text-xs text-gray-500 font-medium mt-0.5">
                                {t.date}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

// ─── Copy-to-clipboard helper ─────────────────────────────────────────────────

const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);
    const onClick = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <button
            onClick={onClick}
            className="ml-2 text-gray-400 hover:text-[#a97f0f] transition-colors cursor-pointer"
            aria-label="Copy order ID"
        >
            {copied ? (
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#a97f0f"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                >
                    <path d="M20 6 9 17l-5-5" />
                </svg>
            ) : (
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
            )}
        </button>
    );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton = () => (
    <div className="ml-0 lg:ml-20 w-full lg:w-160 animate-pulse space-y-4">
        <div className="h-5 w-48 bg-gray-200 rounded" />
        <div className="border border-gray-200 rounded-xl p-5 space-y-3">
            <div className="flex gap-4">
                <div className="w-20 h-24 bg-gray-100 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 bg-gray-200 rounded" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded" />
                    <div className="h-3 w-1/4 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 space-y-2">
            {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex justify-between">
                    <div className="h-3 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                </div>
            ))}
        </div>
    </div>
);

// ─── Section card wrapper ─────────────────────────────────────────────────────

const Section = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="px-4 py-4">{children}</div>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const OrderDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const orderId = params?.id as string;

    const [order, setOrder] = useState<RawOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showTracking, setShowTracking] = useState(false);

    useEffect(() => {
        if (!orderId) return;
        const fetch = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getOrderById(orderId);
                if (res.success && res.data) {
                    setOrder(res.data as RawOrder);
                } else {
                    setError(res.message || "Order not found.");
                }
            } catch {
                setError("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [orderId]);

    if (loading) return <Skeleton />;

    if (error) {
        return (
            <div className="ml-0 lg:ml-20 w-full lg:w-160">
                <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-6 text-center">
                    <p className="text-red-600 font-medium text-sm">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 text-xs text-gray-500 underline hover:text-gray-700 cursor-pointer"
                    >
                        ← Go back
                    </button>
                </div>
            </div>
        );
    }

    if (!order) return null;

    const isCancelled =
        order.orderStatus === "Cancelled" ||
        order.orderStatus === "Returned" ||
        order.orderStatus === "Exchanged";

    return (
        <div className="ml-0 lg:ml-20 w-full lg:w-160">
            {/* ── Header + back link ─────────────────────────────────────────────── */}
            <div className="flex items-center gap-3 mb-5">
                <button
                    onClick={() => router.back()}
                    className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                    aria-label="Back to orders"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 64 64"
                        fill="currentColor"
                    >
                        <path d="m21.3 34.4c5.5 5.5 11 11 16.5 16.5.8.8 1.6 1.6 2.4 2.4 1.8 1.8-1 4.7-2.8 2.8-5.5-5.5-11-11-16.5-16.5-.3-.3-.6-.6-.9-.9 5-5 10-10 15-15 .8-.8 1.5-1.5 2.3-2.3 1.8-1.8-1-4.7-2.8-2.8l-16.4 16.4-2.3 2.3c-.9.6-.9 1.9-.1 2.7z" />
                    </svg>
                </button>
                <div>
                    <h4 className="text-xl font-semibold text-gray-900 font-[family-name:var(--font-montserrat)]">
                        Order Details
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Placed on {fmtDateTime(order.createdAt)}
                    </p>
                </div>
                {/* Help/WhatsApp button */}
                <a
                    href="https://api.whatsapp.com/send?phone=919958813913"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:text-green-700 transition-colors border border-green-200 rounded-lg px-3 py-1.5 hover:bg-green-50"
                >
                    <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-green-500"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                    </svg>
                    Help
                </a>
            </div>

            {/* ── Order ID row ─────────────────────────────────────────────────────── */}
            <div className="flex items-center mb-4 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                <p className="text-xs text-gray-500">
                    <span className="font-bold text-gray-800">Order ID #</span>{" "}
                    <span className="font-mono">{order._id}</span>
                </p>
                <CopyButton text={order._id} />
                <span className="ml-auto text-xs text-gray-400">
                    {fmtDate(order.createdAt)}
                </span>
            </div>

            {/* ── Product summaries ─────────────────────────────────────────────────── */}
            {order.orderItems.map((item) => (
                <div
                    key={item._id}
                    className="border border-gray-200 rounded-xl bg-white mb-4 overflow-hidden"
                >
                    {/* Product row */}
                    <div className="flex gap-4 px-4 pt-4 pb-3">
                        <div
                            className="relative rounded-lg overflow-hidden bg-gray-100 border border-gray-100 shrink-0"
                            style={{ width: 80, height: 96 }}
                        >
                            <Image
                                src={getApiImageUrl(item.image)}
                                alt={item.name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        "/assets/images/product-placeholder.webp";
                                }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                                {item.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                <span className="font-medium text-gray-700">Color:</span>{" "}
                                {item.variant?.color || "—"} &nbsp;|&nbsp;
                                <span className="font-medium text-gray-700">Size:</span>{" "}
                                {item.variant?.size || "—"}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Qty: {item.quantity} &nbsp;·&nbsp; ₹
                                {item.price.toLocaleString("en-IN")}
                            </p>
                        </div>
                    </div>

                    {/* Order status section */}
                    <div className="px-4 pb-4 border-t border-gray-50 pt-4">
                        {/* Status heading */}
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    {STATUS_LABEL[order.orderStatus]}
                                </p>
                                {!isCancelled && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {order.orderStatus === "Delivered"
                                            ? "Your order has been delivered"
                                            : "We have processed your order."}
                                    </p>
                                )}
                            </div>
                            {!isCancelled && order.orderStatus !== "Processing" && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                                    On Time
                                </span>
                            )}
                            {isCancelled && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                                    {STATUS_LABEL[order.orderStatus]}
                                </span>
                            )}
                        </div>

                        {/* Progress track */}
                        {!isCancelled && (
                            <OrderProgress
                                status={order.orderStatus}
                                placedAt={order.createdAt}
                                deliveredAt={order.deliveredAt}
                            />
                        )}

                        {/* Tracking number */}
                        {(order.trackingId || order.awbCode) && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                Tracking:{" "}
                                <span className="font-semibold text-gray-800 font-mono">
                                    {order.awbCode || order.trackingId}
                                </span>
                                {order.courierPartner && (
                                    <span className="text-gray-400">
                                        via {order.courierPartner}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* See all updates toggle */}
                        {!isCancelled && (
                            <div className="mt-3 text-center">
                                <button
                                    onClick={() => setShowTracking((v) => !v)}
                                    className="text-xs font-semibold text-[#a97f0f] hover:text-[#8b6b2f] transition-colors cursor-pointer underline underline-offset-2"
                                >
                                    {showTracking ? "Hide updates" : "See all updates"}
                                </button>
                            </div>
                        )}

                        {/* Expanded tracking timeline */}
                        {showTracking && !isCancelled && (
                            <TrackingTimeline order={order} />
                        )}
                    </div>
                </div>
            ))}

            {/* ── Delivery details ──────────────────────────────────────────────────── */}
            <Section title="Delivery Details">
                <div className="flex items-start gap-3 mb-3">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#a97f0f"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        className="shrink-0 mt-0.5"
                    >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            {order.shippingAddress.fullName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {order.shippingAddress.phoneNumber}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#a97f0f"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        className="shrink-0 mt-0.5"
                    >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <div>
                        <p className="text-sm text-gray-700">
                            {order.shippingAddress.addressLine1},{" "}
                            {order.shippingAddress.city}, {order.shippingAddress.state} —{" "}
                            {order.shippingAddress.postalCode}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {order.shippingAddress.country}
                        </p>
                    </div>
                </div>

                {/* Delivery executive note */}
                <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-100">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="shrink-0 mt-0.5"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    Delivery executive details will be available once your order is out
                    for delivery.
                </div>
            </Section>

            {/* ── Price details ─────────────────────────────────────────────────────── */}
            <Section title="Price Details">
                <div className="space-y-2.5">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Items Price</span>
                        <span>₹{order.itemsPrice.toLocaleString("en-IN")}</span>
                    </div>
                    {order.shippingPrice > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Shipping Charges</span>
                            <span>₹{order.shippingPrice.toLocaleString("en-IN")}</span>
                        </div>
                    )}
                    {order.shippingPrice === 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Shipping Charges</span>
                            <span className="text-green-600 font-medium">FREE</span>
                        </div>
                    )}
                    {order.taxPrice > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Tax</span>
                            <span>₹{order.taxPrice.toLocaleString("en-IN")}</span>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="my-3 border-t border-gray-100" />

                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900">Total Amount</span>
                    <span className="text-base font-bold text-gray-900">
                        ₹{order.totalPrice.toLocaleString("en-IN")}
                    </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">Payment method</span>
                    <span className="text-xs font-semibold text-gray-700">
                        {order.paymentInfo.method}
                        {order.paymentInfo.status === "Paid" && (
                            <span className="ml-1.5 text-green-600">· Paid</span>
                        )}
                        {order.paymentInfo.status === "Pending" &&
                            order.paymentInfo.method === "COD" && (
                                <span className="ml-1.5 text-amber-600">· Pay on delivery</span>
                            )}
                    </span>
                </div>
            </Section>

            {/* ── Order ID bottom + Shop more ─────────────────────────────────────── */}
            <div className="flex items-center justify-between py-4">
                <p className="text-xs text-gray-500">
                    <span className="font-bold text-gray-800">Order ID #</span>{" "}
                    <span className="font-mono text-gray-600">{order._id}</span>
                    <CopyButton text={order._id} />
                </p>
                <Link
                    href="/shop"
                    className="text-sm font-semibold text-[#a97f0f] hover:text-[#8b6b2f] transition-colors"
                >
                    Shop more from SBS →
                </Link>
            </div>
        </div>
    );
};

export default OrderDetailPage;
