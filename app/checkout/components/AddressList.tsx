import React, { useState } from "react";
import toast from "react-hot-toast";
import { deleteAddress, setDefaultAddress } from "../../services/userService";

// Define based on backend schema
export interface Address {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    addressType: "Home" | "Office" | "Other";
}

interface AddressListProps {
    addresses: Address[];
    selectedAddressId: string | null;
    onSelectAddress: (id: string) => void;
    onRefresh: () => void;
    onAddNew: () => void;
    onEdit: (address: Address) => void;
}

const AddressList: React.FC<AddressListProps> = ({
    addresses,
    selectedAddressId,
    onSelectAddress,
    onRefresh,
    onAddNew,
    onEdit,
}) => {

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this address?")) return;

        try {
            const response = await deleteAddress(id);
            if (response.success) {
                toast.success("Address deleted.");
                onRefresh();
            } else {
                toast.error(response.message || "Failed to delete.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred.");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
                <h4 className="text-xl text-[#785e32] font-montserrat">Select Address</h4>
                <button
                    onClick={onAddNew}
                    className="border border-black text-black text-sm font-semibold px-4 py-2 hover:bg-gray-50 transition-colors uppercase tracking-wide"
                >
                    Add New Address
                </button>
            </div>

            <div className="mb-2">
                <p className="font-semibold text-gray-700">Select a delivery address</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
                {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr._id;
                    return (
                        <div
                            key={addr._id}
                            className={`border p-4 rounded relative cursor-pointer transition-colors ${isSelected ? 'border-[#bd9951] bg-[#fffcf5]' : 'border-gray-200 hover:border-gray-300'}`}
                            onClick={() => onSelectAddress(addr._id)}
                        >
                            <div className="mb-2">
                                {addr.isDefault && (
                                    <span className="bg-[#956a2c] text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider inline-block mb-2">
                                        Default
                                    </span>
                                )}
                                <div className="font-bold text-gray-800">{addr.firstName} {addr.lastName}</div>
                                <span className="text-xs text-gray-500 uppercase border border-gray-200 px-1 rounded ml-2 hidden">{addr.addressType}</span>
                            </div>

                            <div className="text-sm text-gray-600 mb-3 leading-relaxed">
                                {addr.addressLine1} <br />
                                {addr.city}, {addr.state}, {addr.country} - {addr.postalCode} <br />
                                Phone: {addr.phoneNumber}
                            </div>

                            {isSelected && (
                                <button className="w-full bg-[#bd9951] text-white text-xs font-bold py-2 rounded mb-3">
                                    DELIVER TO THIS ADDRESS
                                </button>
                            )}
                            {isSelected && (

                                <div className="absolute top-2 right-2">
                                    <svg clipRule="evenodd" height="20" width="20" fillRule="evenodd" imageRendering="optimizeQuality" shapeRendering="geometricPrecision" textRendering="geometricPrecision" viewBox="0 0 254000 254000" xmlns="http://www.w3.org/2000/svg">
                                        <g id="Layer_1">
                                            <path d="m37253 0h179494c20518 0 37253 16735 37253 37253v179494c0 20518-16735 37253-37253 37253h-179494c-20518 0-37253-16735-37253-37253v-179494c0-20518 16735-37253 37253-37253z" fill="none" />
                                            <g id="_228534408" fill="#48b02c">
                                                <path id="_228534648" d="m96229 162644 89510-89509c2637-2638 6967-2611 9578 0l8642 8642c2611 2611 2611 6968 0 9578l-89509 89510c-2611 2611-6941 2638-9579 0l-8642-8642c-2638-2638-2638-6941 0-9579z" />
                                                <path id="_228534744" d="m68270 108089 54525 54525c2637 2638 2606 6973 0 9579l-8642 8642c-2606 2605-6973 2605-9579 0l-54525-54525c-2606-2606-2637-6941 0-9579l8642-8642c2638-2637 6941-2637 9579 0z" />
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                            )}

                            <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100 text-sm">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(addr);
                                    }}
                                    className="flex-1 py-1 px-2 border border-gray-200 rounded text-center hover:bg-gray-50 text-gray-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, addr._id)}
                                    className="flex-1 py-1 px-2 border border-gray-200 rounded text-center hover:text-red-500 hover:border-red-200 text-gray-600"
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Billing Address Section */}
            <div className="mt-6">
                <div className="flex items-center gap-3 mb-4">
                    <p className="font-semibold text-gray-700">Select a billing address</p>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            onChange={(e) => {
                                const billingSection = document.getElementById('billing-address-grid');
                                if (billingSection) {
                                    billingSection.style.display = e.target.checked ? 'none' : 'grid';
                                }
                            }}
                            className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-gray-600">Same as above address</span>
                    </label>
                </div>

                {/* Billing Address Grid (hidden by default) */}
                <div id="billing-address-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6" style={{ display: 'none' }}>
                    {addresses.map((addr) => {
                        const isBillingSelected = selectedAddressId === addr._id;
                        return (
                            <div
                                key={`billing-${addr._id}`}
                                className={`border p-4 rounded relative cursor-pointer transition-colors ${isBillingSelected ? 'border-[#bd9951] bg-[#fffcf5]' : 'border-gray-200 hover:border-gray-300'}`}
                                onClick={() => onSelectAddress(addr._id)}
                            >
                                <div className="mb-2">
                                    {addr.isDefault && (
                                        <span className="bg-[#956a2c] text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider inline-block mb-2">
                                            Default
                                        </span>
                                    )}
                                    <div className="font-bold text-gray-800">{addr.firstName} {addr.lastName}</div>
                                </div>

                                <div className="text-sm text-gray-600 mb-3 leading-relaxed">
                                    {addr.addressLine1} <br />
                                    {addr.city}, {addr.state}, {addr.country} - {addr.postalCode} <br />
                                    Phone: {addr.phoneNumber}
                                </div>

                                {isBillingSelected && (
                                    <button className="w-full bg-[#bd9951] text-white text-xs font-bold py-2 rounded mb-3">
                                        DELIVER TO THIS ADDRESS
                                    </button>
                                )}
                                {isBillingSelected && (

                                    <div className="absolute top-2 right-2">
                                        <svg clipRule="evenodd" height="20" width="20" fillRule="evenodd" imageRendering="optimizeQuality" shapeRendering="geometricPrecision" textRendering="geometricPrecision" viewBox="0 0 254000 254000" xmlns="http://www.w3.org/2000/svg">
                                            <g id="Layer_1">
                                                <path d="m37253 0h179494c20518 0 37253 16735 37253 37253v179494c0 20518-16735 37253-37253 37253h-179494c-20518 0-37253-16735-37253-37253v-179494c0-20518 16735-37253 37253-37253z" fill="none" />
                                                <g id="_228534408" fill="#48b02c">
                                                    <path id="_228534648" d="m96229 162644 89510-89509c2637-2638 6967-2611 9578 0l8642 8642c2611 2611 2611 6968 0 9578l-89509 89510c-2611 2611-6941 2638-9579 0l-8642-8642c-2638-2638-2638-6941 0-9579z" />
                                                    <path id="_228534744" d="m68270 108089 54525 54525c2637 2638 2606 6973 0 9579l-8642 8642c-2606 2605-6973 2605-9579 0l-54525-54525c-2606-2606-2637-6941 0-9579l8642-8642c2638-2637 6941-2637 9579 0z" />
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                )}

                                <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100 text-sm">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(addr);
                                        }}
                                        className="cursor-pointer flex-1 py-1 px-2 border border-gray-200 rounded text-center hover:bg-gray-50 text-gray-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, addr._id)}
                                        className="cursor-pointer flex-1 py-1 px-2 border border-gray-200 rounded text-center hover:text-red-500 hover:border-red-200 text-gray-600"
                                    >
                                        Delete
                                    </button>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AddressList;
