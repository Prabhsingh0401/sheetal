"use client";

import React, { useState, useEffect } from "react";
import AddressCard from "../components/AddressCard";
import AddAddressModal from "../components/AddAddressModal";
import {
    getCurrentUser,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} from "../../services/userService";

const AddressesPage = () => {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingAddress, setEditingAddress] = useState<any>(null); // State for editing
    const [userEmail, setUserEmail] = useState("");

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const response = await getCurrentUser();
            if (response.success && response.data) {
                setUserEmail(response.data.email || "");
                if (response.data.addresses) {
                    // Map API addresses to match internal UI needs if necessary, 
                    // but AddressCard props are largely compatible with schema.
                    // Schema has postalCode, UI has pincode. Schema has _id, UI uses id (number in dummy, string in real).
                    const mappedAddresses = response.data.addresses.map((addr: any) => ({
                        ...addr,
                        id: addr._id, // Map _id to id for the component
                        pincode: addr.postalCode, // Map postalCode to pincode
                        name: `${addr.firstName} ${addr.lastName}`, // Construct full name for display
                        address: addr.addressLine1, // UI might use 'address' but backend has 'addressLine1', modal sends 'address'
                        phone: addr.phoneNumber,
                        email: response.data.email
                    }));
                    setAddresses(mappedAddresses);
                }
            }
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleEdit = (id: string | number) => {
        // Find existing address to populate modal
        const addressToEdit = addresses.find(a => a.id === id);
        if (addressToEdit) {
            // Transform back to form format
            setEditingAddress({
                firstName: addressToEdit.firstName,
                lastName: addressToEdit.lastName,
                phoneNumber: addressToEdit.phoneNumber || addressToEdit.phone,
                address: addressToEdit.addressLine1 || addressToEdit.address,
                pincode: addressToEdit.postalCode || addressToEdit.pincode,
                city: addressToEdit.city,
                state: addressToEdit.state,
                country: addressToEdit.country,
                addressType: addressToEdit.addressType,
                isDefault: addressToEdit.isDefault,
                _id: addressToEdit._id
            });
            setIsModalOpen(true);
        }
    };

    const handleDelete = async (id: string | number) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        try {
            const response = await deleteAddress(String(id));
            if (response.success) {
                // Update local state or refetch
                // The service returns the updated address list, we can use that too
                if (response.data) {
                    const mappedAddresses = response.data.map((addr: any) => ({
                        ...addr,
                        id: addr._id,
                        pincode: addr.postalCode,
                        name: `${addr.firstName} ${addr.lastName}`,
                        address: addr.addressLine1,
                        phone: addr.phoneNumber,
                        email: userEmail
                    }));
                    setAddresses(mappedAddresses);
                } else {
                    fetchAddresses();
                }
            }
        } catch (error) {
            console.error("Failed to delete address:", error);
        }
    };

    const handleSetDefault = async (id: string | number) => {
        try {
            const response = await setDefaultAddress(String(id));
            if (response.success) {
                if (response.data) {
                    const mappedAddresses = response.data.map((addr: any) => ({
                        ...addr,
                        id: addr._id,
                        pincode: addr.postalCode,
                        name: `${addr.firstName} ${addr.lastName}`,
                        address: addr.addressLine1,
                        phone: addr.phoneNumber,
                        email: userEmail
                    }));
                    setAddresses(mappedAddresses);
                } else {
                    fetchAddresses();
                }
            }
        } catch (error) {
            console.error("Failed to set default address:", error);
        }
    };

    const handleSaveAddress = async (data: any) => {
        try {
            const payload = {
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                addressLine1: data.address, // Map 'address' from form to 'addressLine1' for backend
                city: data.city,
                state: data.state,
                country: data.country,
                postalCode: data.pincode, // Map 'pincode' from form to 'postalCode' for backend
                addressType: data.addressType,
                isDefault: data.isDefault
            };

            let response;
            if (editingAddress) {
                response = await updateAddress(editingAddress._id, payload);
            } else {
                response = await addAddress(payload);
            }

            if (response.success) {
                // Determine if we need to close modal and refresh
                if (response.data) {
                    const mappedAddresses = response.data.map((addr: any) => ({
                        ...addr,
                        id: addr._id, // Map _id to id for the component
                        pincode: addr.postalCode, // Map postalCode to pincode
                        name: `${addr.firstName} ${addr.lastName}`,
                        address: addr.addressLine1,
                        phone: addr.phoneNumber,
                        email: userEmail
                    }));
                    setAddresses(mappedAddresses);
                } else {
                    fetchAddresses();
                }
                setIsModalOpen(false);
                setEditingAddress(null);
            } else {
                alert("Failed to save address: " + (response.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Failed to save address:", error);
            alert("An error occurred while saving the address.");
        }
    };

    const openNewAddressModal = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    }

    // Pass editing data to modal if needed. AddAddressModal currently instantiates its own state.
    // We need to modify AddAddressModal to accept initial data or lift the state.
    // For now, let's assume AddAddressModal can take 'initialData' prop.

    return (
        <div className="ml-20 w-160">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-semibold text-gray-900">
                    Select Address
                </h4>
                <button
                    onClick={openNewAddressModal}
                    className="text-[#a97f0f] font-semibold hover:text-[#8b6b2f] transition-colors cursor-pointer"
                >
                    + Add New Address
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading addresses...</div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {addresses.length === 0 && (
                        <div className="text-center text-gray-500 py-4">No addresses saved yet.</div>
                    )}
                    {addresses.map((address) => (
                        <div key={address.id} className="w-full">
                            <AddressCard
                                address={address}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onSetDefault={handleSetDefault}
                            />
                        </div>
                    ))}
                </div>
            )}

            <AddAddressModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingAddress(null); }}
                onSave={handleSaveAddress}
                initialData={editingAddress}
            />
        </div>
    );
};

export default AddressesPage;
