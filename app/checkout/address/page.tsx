"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AddressList, { Address } from "../components/AddressList";
import AddressForm from "../components/AddressForm";
import MiniCartSummary from "../components/MiniCartSummary";
import PriceDetails from "../../cart/components/PriceDetails"; // Import existing component
import { useCart } from "../../hooks/useCart";
import { getCurrentUser } from "../../services/userService";
import { getSettings } from "../../services/settingsService";
import toast from "react-hot-toast";
import { createRazorpayPaymentLink } from "../../services/paymentService";
import { createCODOrder } from "../../services/orderService";

const AddressPage = () => {
  const router = useRouter();
  const {
    cart,
    totalMrp,
    totalDiscount,
    couponDiscount,
    finalAmount,
    couponCode,
    applyCoupon,
    removeCoupon,
    couponError,
    bogoMessage,
    applicableCategories,
  } = useCart();

  // Local state for addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isEmailFromProfile, setIsEmailFromProfile] = useState(false);

  // For Coupon Input in Price Details (if needed to pass down)
  const [couponInput, setCouponInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Settings State - Same as Cart Page */
  const [platformFee, setPlatformFee] = useState(0);
  const [shippingCharges, setShippingCharges] = useState(0);
  const [baseShippingFee, setBaseShippingFee] = useState(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await getCurrentUser();
      if (response.success && response.data) {
        const userAddresses = response.data.addresses || [];
        setAddresses(userAddresses);

        // Check if user has email
        if (response.data.email) {
          setUserEmail(response.data.email);
          setIsEmailFromProfile(true);
        }

        // Select default if any
        const defaultAddr = userAddresses.find((a: Address) => a.isDefault);
        if (defaultAddr && !selectedAddressId) {
          setSelectedAddressId(defaultAddr._id);
        } else if (userAddresses.length > 0 && !selectedAddressId) {
          // Or first one
          setSelectedAddressId(userAddresses[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  /* Fetch Settings Once - Same as Cart Page */
  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        const settings = await getSettings();
        setPlatformFee(Number(settings.platformFee) || 0);
        setBaseShippingFee(Number(settings.shippingFee) || 0);
        setFreeShippingThreshold(Number(settings.freeShippingThreshold) || 0);

        // Initial calculation
        const threshold = Number(settings.freeShippingThreshold) || 0;
        if (finalAmount > threshold && threshold > 0) {
          setShippingCharges(0);
        } else {
          setShippingCharges(Number(settings.shippingFee) || 0);
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };
    fetchSettingsData();
  }, [finalAmount]);

  /* Recalculate Shipping on Amount Change - Same as Cart Page */
  useEffect(() => {
    if (finalAmount > freeShippingThreshold && freeShippingThreshold > 0) {
      setShippingCharges(0);
    } else {
      setShippingCharges(baseShippingFee);
    }
  }, [finalAmount, freeShippingThreshold, baseShippingFee]);

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handlePayOnline = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address.");
      return;
    }
    const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
    if (!selectedAddress) {
      toast.error("Invalid address selected.");
      return;
    }

    // Normalise: order schema needs fullName, user address stores firstName + lastName
    const shippingAddress = {
      fullName: `${selectedAddress.firstName} ${selectedAddress.lastName}`.trim(),
      phoneNumber: selectedAddress.phoneNumber,
      addressLine1: selectedAddress.addressLine1,
      city: selectedAddress.city,
      state: selectedAddress.state,
      postalCode: selectedAddress.postalCode,
      country: selectedAddress.country || "India",
    };

    try {
      setIsSubmitting(true);
      toast.loading("Initiating payment...");
      const response = await createRazorpayPaymentLink(selectedAddressId, shippingAddress);
      toast.dismiss();
      if (response && response.success && response.data && response.data.short_url) {
        window.location.href = response.data.short_url;
      } else {
        toast.error(response.message || "Failed to create payment link");
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Something went wrong while initiating payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCOD = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address.");
      return;
    }
    const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
    if (!selectedAddress) {
      toast.error("Invalid address selected.");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    // Normalise: order schema needs fullName, user address stores firstName + lastName
    const shippingAddress = {
      fullName: `${selectedAddress.firstName} ${selectedAddress.lastName}`.trim(),
      phoneNumber: selectedAddress.phoneNumber,
      addressLine1: selectedAddress.addressLine1,
      city: selectedAddress.city,
      state: selectedAddress.state,
      postalCode: selectedAddress.postalCode,
      country: selectedAddress.country || "India",
    };

    // Map cart items to the backend order schema
    const orderItems = cart.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.mainImage?.url || item.variantImage || "",
      price: item.discountPrice || item.price,
      quantity: item.quantity,
      variant: {
        size: item.size,
        color: item.color,
        v_sku: item.product?.sku || "",
      },
    }));

    const totalAmount = finalAmount + shippingCharges + platformFee;

    try {
      setIsSubmitting(true);
      toast.loading("Placing your order...");
      const response = await createCODOrder(
        shippingAddress,
        orderItems,
        {
          itemsPrice: finalAmount,
          shippingPrice: shippingCharges,
          taxPrice: platformFee,
          totalPrice: totalAmount,
        }
      );
      toast.dismiss();
      if (response && response.success) {
        toast.success("Order placed successfully!");
        router.push("/checkout/success?payment_method=cod");
      } else {
        toast.error(response.message || "Failed to place order");
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Something went wrong while placing your order");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Logic for display name (Copied from CartPage logic for consistency) */
  const categoryNames =
    applicableCategories.length > 0
      ? cart
        .filter(
          (item) =>
            item.product.category &&
            applicableCategories.includes(item.product.category._id),
        )
        .map((item) => item.product.category.name)
      : [];
  const uniqueCategoryNames = Array.from(new Set(categoryNames));
  const displayCategoryName =
    uniqueCategoryNames.length > 0 ? uniqueCategoryNames.join(", ") : null;

  return (
    <div className="font-montserrat">
      {/* Header */}
      <div className="">
        <div className="container mx-10">
          <div className="flex justify-between items-center py-3 px-4 md:px-0">
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/assets/335014072.png"
                  alt="Studio By Sheetal"
                  width={40}
                  height={40}
                />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium mx-20">
              <Link href="/cart" className="text-black hover:text-[#bd9951]">
                BAG
              </Link>
              <div className="text-[#bd9951]">ADDRESS</div>
              <div className="text-gray-400">PAYMENT</div>
            </div>
            <div className="flex items-center space-x-2 text-sm font-semibold">
              <Image
                src="/assets/icons/shield.svg"
                alt="Secure"
                width={20}
                height={20}
              />
              <span>100% SECURE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 md:px-0">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN: ADDRESS */}
          <div className="w-full lg:w-8/12">
            {/* Customer Information - Email */}
            <div className="mb-6">
              <h4 className="text-xl text-[#785e32] mb-4 font-montserrat">
                Customer Information
              </h4>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Email Address *
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) =>
                    !isEmailFromProfile && setUserEmail(e.target.value)
                  }
                  readOnly={isEmailFromProfile}
                  placeholder="Email Id"
                  className={`w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#bd9951] ${isEmailFromProfile ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This email will be used to send you offers & updates
                </p>
              </div>
            </div>

            {/* If no addresses and not adding new (initial empty state handling could be here) */}

            {showAddForm ? (
              <AddressForm
                onSuccess={() => {
                  setShowAddForm(false);
                  setEditingAddress(null);
                  fetchAddresses();
                }}
                onCancel={() => {
                  setShowAddForm(false);
                  setEditingAddress(null);
                }}
                initialData={editingAddress || undefined}
                addressId={editingAddress?._id}
              />
            ) : (
              <>
                {addresses.length === 0 && !loadingAddresses ? (
                  <div className="border border-gray-200 p-8 text-center rounded shadow-sm">
                    <p className="text-gray-600 mb-4">
                      No addresses found. Please add a new address.
                    </p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="bg-[#bd9951] text-white px-6 py-2 rounded font-semibold hover:bg-[#a38038]"
                    >
                      Add New Address
                    </button>
                  </div>
                ) : (
                  <AddressList
                    addresses={addresses}
                    selectedAddressId={selectedAddressId}
                    onSelectAddress={setSelectedAddressId}
                    onRefresh={fetchAddresses}
                    onAddNew={() => {
                      setEditingAddress(null);
                      setShowAddForm(true);
                    }}
                    onEdit={handleEditAddress}
                  />
                )}
              </>
            )}
          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="w-full lg:w-4/12">
            {/* Product List Summary */}
            <MiniCartSummary cartItems={cart} />

            {/* Price Details */}
            <PriceDetails
              couponInput={couponInput}
              setCouponInput={setCouponInput}
              handleApplyCoupon={(userId) => {
                if (couponInput && userId) applyCoupon(couponInput, userId);
              }}
              couponError={couponError}
              bogoMessage={bogoMessage}
              applicableCategories={applicableCategories}
              categoryName={displayCategoryName}
              couponCode={couponCode}
              onRemoveCoupon={removeCoupon}
              cartLength={cart.length}
              totalMrp={totalMrp}
              totalDiscount={totalDiscount}
              couponDiscount={couponDiscount}
              shippingCharges={shippingCharges}
              platformFee={platformFee}
              totalAmount={finalAmount + shippingCharges + platformFee}
              hideProceedButton={true}
            />

            {/* Payment Method Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handlePayOnline}
                disabled={!selectedAddressId || isSubmitting}
                className="w-full cursor-pointer bg-[#bd9951] text-white py-3 rounded font-bold uppercase tracking-wider disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-[#a38038] transition-colors"
              >
                {isSubmitting ? "Processing..." : "Pay Online"}
              </button>
              <button
                onClick={handleCOD}
                disabled={!selectedAddressId || isSubmitting}
                className="w-full cursor-pointer bg-white text-[#bd9951] py-3 rounded font-bold uppercase tracking-wider border-2 border-[#bd9951] disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-[#fdf8f0] transition-colors"
              >
                {isSubmitting ? "Processing..." : "Cash on Delivery"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Icons */}
        <div className="flex justify-around items-center mt-12 py-4 border-t border-gray-100">
          <div className="flex items-center text-sm">
            <Image
              src="/assets/icons/secure-payment.svg"
              alt="Secure Payments"
              width={30}
              height={30}
            />
            <span className="ml-2 text-xl text-[#706a42] font-semibold">
              Secure Payments
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Image
              src="/assets/icons/transaction.svg"
              alt="Cash on delivery"
              width={30}
              height={30}
            />
            <span className="ml-2 text-xl text-[#706a42] font-semibold">
              Cash on delivery
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Image
              src="/assets/icons/quality-assurance.svg"
              alt="Assured Quality"
              width={30}
              height={30}
            />
            <span className="ml-2 text-xl text-[#706a42] font-semibold">
              Assured Quality
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Image
              src="/assets/icons/product-return1.svg"
              alt="Easy returns"
              width={30}
              height={30}
            />
            <span className="ml-2 text-xl text-[#706a42] font-semibold">
              Easy returns
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;
