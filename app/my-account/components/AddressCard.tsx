"use client";

import React from "react";

interface Address {
    id: string | number;
    name: string;
    addressLine1: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    email: string;
    phone: string;
    isDefault: boolean;
    type: string;
}

interface AddressCardProps {
    address: Address;
    onEdit: (id: string | number) => void;
    onDelete: (id: string | number) => void;
    onSetDefault: (id: string | number) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
    address,
    onEdit,
    onDelete,
    onSetDefault,
}) => {
    return (
        <div className="h-full border border-gray-200 p-6 rounded-sm hover:border-[#ac8037] transition-colors relative">
            <div className="address-book">
                {/* Type Badge (Optional, inferred from HTML context) */}

                <div className="font-bold text-gray-900 mt-2 text-base capitalize">
                    {address.name}
                </div>

                <div className="text-sm text-black mt-2 mb-4 leading-relaxed">
                    {address.addressLine1}
                    <br />
                    {address.city}, {address.state}, {address.country} {address.pincode}
                    <br />
                    {address.email}, {address.phone}
                </div>

                {!address.isDefault && (
                    <button
                        onClick={() => onSetDefault(address.id)}
                        className="text-[#48b02c] text-sm mb-4 hover:underline text-left block"
                    >
                        Make This Default
                    </button>
                )}

                <div className="flex text-sm text-black mt-4 gap-4">
                    <div className="w-1/2">
                        <button
                            onClick={() => onEdit(address.id)}
                            className="hover:text-[#a97f0f] transition-colors border rounded-[2px] px-2 py-1 w-full cursor-pointer"
                        >
                            Edit
                        </button>
                    </div>
                    <div className="w-1/2">
                        <button
                            onClick={() => onDelete(address.id)}
                            className="hover:text-red-600 transition-colors border rounded-[2px] px-2 py-1 w-full cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {address.isDefault && (
                    <div className="absolute top-4 right-4">
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
            </div>
        </div>
    );
};

export default AddressCard;
