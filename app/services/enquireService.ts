import { API_BASE_URL } from "./api";

export interface EnquiryPayload {
    productName: string;
    size: string;
    name: string;
    email: string;
    phone: string;
    message: string;
}

export const submitEnquiry = async (payload: EnquiryPayload) => {
    const res = await fetch(`${API_BASE_URL}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit enquiry");
    }

    return data;
};