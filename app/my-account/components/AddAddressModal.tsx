"use client";

import React, { useState } from "react";

interface AddAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData
}) => {
    const defaultState = {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        pincode: "",
        city: "",
        state: "",
        country: "",
        addressType: "Home",
        isDefault: false,
    };

    const [formData, setFormData] = useState(defaultState);

    // Reset or Populate form when modal opens or initialData changes
    React.useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    firstName: initialData.firstName || "",
                    lastName: initialData.lastName || "",
                    phoneNumber: initialData.phoneNumber || "",
                    address: initialData.address || "",
                    pincode: initialData.pincode || "",
                    city: initialData.city || "",
                    state: initialData.state || "",
                    country: initialData.country || "",
                    addressType: initialData.addressType || "Home",
                    isDefault: initialData.isDefault || false,
                });
            } else {
                setFormData(defaultState);
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleTypeChange = (type: string) => {
        setFormData((prev) => ({ ...prev, addressType: type }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
            <div className="bg-white w-full max-w-lg mx-4 shadow-lg overflow-hidden relative animate-fadeIn">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h4 className="text-lg font-bold text-gray-900">
                        {initialData ? "Edit Address" : "Add New Address"}
                    </h4>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4 text-sm">

                        {/* Name Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="mb-1 text-gray-700 font-medium">First Name *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#a97f0f]"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 text-gray-700 font-medium">Last Name *</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#a97f0f]"
                                />
                            </div>
                        </div>

                        {/* Mobile */}
                        <div className="flex flex-col">
                            <label className="mb-1 text-gray-700 font-medium">Enter Mobile Number *</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                required
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#a97f0f]"
                            />
                            <small className="text-gray-500 mt-1 text-xs">
                                This phone number will be used to send you offers & updates
                            </small>
                        </div>

                        {/* Address */}
                        <div className="flex flex-col">
                            <label className="mb-1 text-gray-700 font-medium">Address *</label>
                            <input
                                type="text"
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#a97f0f]"
                            />
                        </div>

                        {/* Pincode & City */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="mb-1 text-gray-700 font-medium">Pincode *</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    required
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#a97f0f]"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 text-gray-700 font-medium">City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#a97f0f]"
                                />
                            </div>
                        </div>

                        {/* State & Country */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="mb-1 text-gray-700 font-medium">State *</label>
                                <input
                                    type="text"
                                    name="state"
                                    required
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#a97f0f]"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 text-gray-700 font-medium">Country *</label>
                                <input
                                    type="text"
                                    name="country"
                                    required
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#a97f0f]"
                                />
                            </div>
                        </div>

                        {/* Address Type */}
                        <div className="flex flex-col">
                            <label className="mb-2 text-gray-700 font-medium">Save this address as (optional)</label>
                            <div className="flex gap-3">
                                {["Home", "Office", "Other"].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => handleTypeChange(type)}
                                        className={`px-4 py-1 rounded-full text-xs font-medium border transition-colors     cursor-pointer ${formData.addressType === type
                                            ? "bg-[#73561e] text-white border-[#73561e]"
                                            : "bg-white text-gray-800 border-gray-800 hover:border-[#73561e] hover:text-[#73561e]"
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Default Checkbox */}
                        <div className="flex items-center space-x-2 mt-2">
                            <input
                                type="checkbox"
                                id="default"
                                name="isDefault"
                                checked={formData.isDefault}
                                onChange={handleChange}
                                className="w-4 h-4 text-[#a97f0f] border-gray-300 rounded focus:ring-[#a97f0f] cursor-pointer"
                            />
                            <label htmlFor="default" className="text-gray-700 cursor-pointer">
                                Make this as my default address
                            </label>
                        </div>

                        {/* Submit */}
                        <div className="pt-4 text-center">
                            <button
                                type="submit"
                                className="bg-[#73561e] hover:bg-[#73561e] text-white font-semibold py-3 px-8 rounded transition-colors uppercase tracking-wider text-sm cursor-pointer"
                            >
                                Save & Continue
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAddressModal;
