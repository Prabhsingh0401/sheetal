import React from "react";
import Image from "next/image";
import StarRating from "./StarRating";

interface ProductInfoProps {
  product: any;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  onEnquire: () => void;
  onSizeChartOpen: () => void;
  pincode: string;
  setPincode: (pin: string) => void;
  pincodeMessage: string;
  checkPincode: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  onEnquire,
  onSizeChartOpen,
  pincode,
  setPincode,
  pincodeMessage,
  checkPincode,
}) => {
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-medium text-[#683e14] mb-2 font-[family-name:var(--font-optima)]">
        {product.title}
      </h1>

      <div className="flex items-center gap-4 mb-4">
        <StarRating rating={product.rating} />
        <span className="text-gray-400 text-sm">|</span>
        <span className="text-gray-500 text-sm">
          Product Code: {product.sku}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
        {product.description}
      </p>

      <div className="mb-6">
        <div className="flex items-end gap-3 mb-1">
          <span className="text-3xl font-medium">
            ₹ {product.price.toFixed(2)}
          </span>
          <span className="text-lg text-gray-400 line-through mb-1">
            ₹ {product.originalPrice.toFixed(2)}
          </span>
          <span className="text-sm text-green-600 font-semibold mb-1">
            Save {product.discount}
          </span>
        </div>
        <p className="text-xs text-gray-500">Inclusive of all taxes.</p>
      </div>

      <div className="mb-6">
        <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded border border-green-200">
          In Stock
        </span>
      </div>

      {/* Color Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Select Color:
        </label>
        <div className="flex gap-3">
          {product.colors.map((color: any, i: number) => (
            <div
              key={i}
              className="w-12 h-16 border border-gray-200 cursor-pointer hover:border-[#bd9951] p-0.5 relative"
            >
              <Image
                src={color.image}
                alt={color.name}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-semibold text-gray-800">
            Select Size:
          </label>
          <button
            onClick={onSizeChartOpen}
            className="flex items-center text-md text-red-500 font-semibold hover:underline"
          >
            <Image
              src="/assets/icons/measurement.svg"
              width={16}
              height={16}
              alt="ruler"
              className="mr-1"
            />{" "}
            Size Chart{" > "}
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {product.sizes.map((size: any) => (
            <div key={size.name} className="flex flex-col items-center">
              <button
                disabled={!size.available}
                onClick={() => setSelectedSize(size.name)}
                className={`w-10 h-10 flex items-center justify-center border rounded-full text-sm font-medium transition-colors
          ${
            !size.available
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : ""
          }
          ${
            selectedSize === size.name
              ? "border-[#bd9951]"
              : "border-gray-300 text-gray-700 hover:border-[#bd9951] cursor-pointer"
          }
        `}
              >
                {size.name}
              </button> 

              {/* Availability text BELOW each size */}
              {size.available && size.left <= 2 && (
                <span className="text-[10px] bg-[#f5a623] text-white px-2 py-0.5 rounded-sm font-semibold">
                  {size.left} left
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mb-8">
        <div className="mb-4">
          <button
            onClick={onEnquire}
            className="text-[#bd9951] border p-3 text-sm font-medium hover:bg-gray-100 cursor-pointer flex items-center"
          >
            Notify Me 
          </button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="w-20">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full h-12 border border-gray-300 text-center focus:outline-none focus:border-[#bd9951]"
            />
          </div>
          <button className="flex-1 h-12 bg-white border border-[#fe5722] text-[#fe5722] uppercase font-medium tracking-wider hover:bg-gray-100 cursor-pointer transition-colors">
            Add to Cart
          </button>
          <button className="flex-1 h-12 bg-[#fe5722] text-white border border-[#bd9951] uppercase font-medium tracking-wider cursor-pointer transition-colors shadow-lg">
            Buy Now
          </button>
        </div>
      </div>

      {/* Delivery */}
      <div className="mb-6 border-t border-gray-100 pt-6">
        <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
          Delivery Options{" "}
          <Image
            src="/assets/icons/delivery-truck.svg"
            width={20}
            height={20}
            alt="truck"
            className="ml-2"
          />
        </label>
        <div className="flex relative max-w-sm mb-2">
          <input
            type="text"
            placeholder="Enter pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="w-full h-10 border border-gray-300 px-3 text-sm focus:outline-none focus:border-[#bd9951]"
          />
          <button
            onClick={checkPincode}
            className="absolute right-0 bg-gray-100 border border-gray-300 top-0 h-10 px-4 text-[#fe5722] font-semibold text-sm hover:bg-gray-50"
          >
            Check
          </button>
        </div>
        {pincodeMessage && (
          <p
            className={`text-xs ${
              pincodeMessage.includes("valid")
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {pincodeMessage}
          </p>
        )}

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-xs text-gray-600">
            <div className="w-6">
              <Image
                src="/assets/icons/delivery-truck.svg"
                width={16}
                height={16}
                alt="truck"
              />
            </div>
            <span>Get it by Tue, Jan 06</span>
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <div className="w-6">
              <Image
                src="/assets/icons/cash-on-delivery.svg"
                width={16}
                height={16}
                alt="cod"
              />
            </div>
            <span>Pay on delivery available</span>
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <div className="w-6">
              <Image
                src="/assets/icons/product-return.svg"
                width={16}
                height={16}
                alt="return"
              />
            </div>
            <span>Easy 7 days return & exchange available</span>
          </div>
        </div>
      </div>

      {/* Accordion Info */}
      <div className="border border-gray-200 rounded">
  
  {/* Specifications — OPEN BY DEFAULT */}
  <details open className="group border-b border-gray-200">
    <summary className="flex justify-between items-center text-[#fc5823] p-4 cursor-pointer font-medium hover:bg-gray-50 list-none">
      Specifications

      {/* Plus / Minus Toggle */}
      <span className="text-xl font-semibold">
        <span className="group-open:hidden">+</span>
        <span className="hidden group-open:inline">−</span>
      </span>
    </summary>

    <div className="p-4 bg-gray-50 text-sm text-gray-600">
      <ul className="space-y-2">
        <li className="flex">
          <span className="w-1/2 font-semibold">Neckline:</span> V-Neck
        </li>
        <li className="flex">
          <span className="w-1/2 font-semibold">Pattern:</span> Printed
        </li>
        <li className="flex">
          <span className="w-1/2 font-semibold">Fabric:</span> Viscose Rayon
        </li>
        <li className="flex">
          <span className="w-1/2 font-semibold">Fit:</span> Straight
        </li>
      </ul>
    </div>
  </details>

  {/* Delivery & Returns — CLOSED BY DEFAULT */}
  <details className="group">
    <summary className="flex justify-between items-center p-4 cursor-pointer font-medium text-[#fc5823] hover:bg-gray-50 list-none">
      Delivery & Returns

      {/* Plus / Minus Toggle */}
      <span className="text-xl font-semibold">
        <span className="group-open:hidden">+</span>
        <span className="hidden group-open:inline">−</span>
      </span>
    </summary>

    <div className="p-4 bg-gray-50 text-sm text-gray-600">
      <p className="mb-2">
        Free Shipping on All Orders (Pre-paid & COD).
      </p>
      <p>Easy 7 days return & exchange available.</p>
    </div>
  </details>

</div>

      {/* Contact */}
      <div className="mt-6 p-4 bg-blue-50 rounded text-center">
        <h4 className="font-semibold text-gray-800 mb-2">Have a question?</h4>
        <div className="flex flex-col md:flex-row justify-center gap-4 text-sm">
          <a
            href="mailto:info@studiobysheetal.com"
            className="flex items-center justify-center text-blue-600 hover:underline"
          >
            <Image
              src="/assets/icons/email.svg"
              width={16}
              height={16}
              alt="email"
              className="mr-2"
            />{" "}
            Email Us
          </a>
          <a
            href="https://wa.me/919958813913"
            className="flex items-center justify-center text-green-600 hover:underline"
          >
            <Image
              src="/assets/icons/whatsapp.svg"
              width={16}
              height={16}
              alt="wa"
              className="mr-2"
            />{" "}
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
