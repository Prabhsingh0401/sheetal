import React from "react";
import Image from "next/image";
import StarRating from "./StarRating";

interface ProductInfoProps {
  product: {
    title: string;
    rating: number;
    mainDescription: string;
    price: number;
    originalPrice: number;
    discount: string;
    description: string;
    colors: { name: string; image: string; }[];
    allSizes: { name: string; available: boolean; left: number; }[]; 
    colorToAvailableSizesMap: { [colorName: string]: string[] };
    specifications: any[]; 
  };
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: string;
  onColorChange: (color: { name: string; image: string }) => void; 
  quantity: number;
  setQuantity: (qty: number) => void;
  onEnquire: () => void;
  onSizeChartOpen: () => void;
  onAddToCart: () => void;
  pincode: string;
  setPincode: (pin: string) => void;
  pincodeMessage: string;
  checkPincode: () => void;
  hasSizeChart?: boolean;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  selectedSize,
  setSelectedSize,
  selectedColor,
  onColorChange,
  quantity,
  setQuantity,
  onEnquire,
  onSizeChartOpen,
  onAddToCart,
  pincode,
  setPincode,
  pincodeMessage,
  checkPincode,
  hasSizeChart = false,
}) => {
  const price = Number(product?.price ?? 0);
  const originalPrice = Number(product?.originalPrice ?? price);
  const discountPercentage = originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  
  return (
    <div className="p-6 md:p-8">
      <div className="hidden lg:block">
        <h1 className="text-2xl md:text-3xl font-medium text-[#683e14] mb-2 font-[family-name:var(--font-optima)]">
          {product.title}
        </h1>

        <div className="flex items-center gap-4 mb-4">
          <StarRating rating={product.rating} />
        </div>
      </div>

      <p className="text-sm mb-6 leading-relaxed">
        {product.mainDescription}
      </p>

      <div className="mb-6">
        <div className="flex items-end gap-3">
          <span className="text-3xl font-medium">
            ₹ {price.toFixed(2)}
          </span>
          <span className="text-lg text-gray-400 line-through">
            ₹ {originalPrice.toFixed(2)}
          </span>
          {discountPercentage > 0 && (
            <span className="text-lg text-green-600 font-semibold">
              Save {discountPercentage}%
            </span>
          )}
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
          {Array.isArray(product?.colors) &&
            product.colors.map((color, i: number) => (
            <div
              key={i}
              className={`w-12 h-16 border cursor-pointer hover:border-[#bd9951] p-0.5 relative ${selectedColor === color.name ? 'border-[#bd9951]' : 'border-gray-200'}`}
              onClick={() => onColorChange(color)}
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
          {hasSizeChart && (
            <button
              onClick={onSizeChartOpen}
              className="flex items-center text-md text-red-500 font-semibold hover:underline cursor-pointer"
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
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {Array.isArray(product?.allSizes) &&
            product.allSizes.map((size: { name: string; available: boolean; left: number }) => {
                const isAvailableForSelectedColor = product.colorToAvailableSizesMap[selectedColor]?.includes(size.name);
                const isDisabled = !isAvailableForSelectedColor; // Disable if not available for selected color

                return (
                    <div key={size.name} className="flex flex-col items-center">
                        <button
                            disabled={isDisabled}
                            onClick={() => setSelectedSize(size.name)}
                            className={`w-10 h-10 flex items-center justify-center border rounded-full text-sm font-medium transition-colors relative
                                ${isDisabled
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : ""
                                }
                                ${selectedSize === size.name && !isDisabled
                                    ? "border-[#bd9951]"
                                    : "border-gray-300 text-gray-700 hover:border-[#bd9951] cursor-pointer"
                                }
                            `}
                        >
                            {size.name}
                            {/* Show strike-through if disabled (not available for selected color) */}
                            {isDisabled && <div className="absolute w-full h-px bg-gray-400 transform rotate-45"></div>}
                        </button>
                        {/* Only show 'X left' if available for selected color and stock is low */}
                        {isAvailableForSelectedColor && size.left <= 2 && (
                            <span className="text-[10px] bg-[#f5a623] text-white px-2 py-0.5 rounded-sm font-semibold">
                                {size.left} left
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
      </div>

      {/* Mobile-Only Quantity & Notify (After Size) */}
      <div className="flex flex-col lg:hidden mb-6 border-b border-gray-100 pb-6 space-y-3">
          <button 
            onClick={onEnquire}
            className="text-[#bd9951] border border-[#bd9951] px-4 py-2 text-sm font-medium rounded-sm hover:bg-[#bd9951] hover:text-white transition-colors w-30"
          >
            Notify Me
          </button>
        <div className="">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full h-10 border border-gray-300 px-3 text-sm focus:outline-none focus:border-[#bd9951]"
            />
          </div>
      </div>

      {/* Actions */}
      <div className="mb-8 hidden lg:block">
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
          <button onClick={onAddToCart} className="flex-1 h-12 bg-white border border-[#fe5722] text-[#fe5722] uppercase font-medium tracking-wider hover:bg-gray-100 cursor-pointer transition-colors">
            Add to Cart
          </button>
          <button className="flex-1 h-12 bg-[#fe5722] text-white border border-[#bd9951] uppercase font-medium tracking-wider cursor-pointer transition-colors shadow-lg">
            Buy Now
          </button>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white z-[100] border-t border-gray-200 p-3 lg:hidden flex gap-3 items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex space-x-2">
           <span className="text-xl font-bold">₹ {price.toFixed(2)}</span>
           <span className="text-lg text-gray-400 line-through">₹ {originalPrice.toFixed(2)}</span>
        </div>
        <div className="flex gap-2 flex-1 justify-end ml-20">
           <button onClick={onAddToCart} className="flex-1 bg-white border border-[#fe5722] text-[#fe5722] uppercase font-bold text-xs py-3 rounded-sm">
             Add to Cart
           </button>
           {/* <button className="flex-1 bg-[#fe5722] text-white border border-[#fe5722] uppercase font-bold text-xs py-3 rounded-sm">
             Buy Now
           </button> */}
        </div>
      </div>
      {/* Delivery */}
      <div className="mb-6 border-t border-gray-100 pt-6">
        <label className="flex items-center text-sm font-semibold mb-3">
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
            className="absolute right-0 bg-gray-100 border border-gray-300 top-0 h-10 px-4 text-[#fe5722] font-semibold text-sm hover:bg-gray-50 cursor-pointer"
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
          <div className="flex items-center text-md">
            <div className="w-10">
              <Image
                src="/assets/icons/delivery-truck.svg"
                width={30}
                height={30}
                alt="truck"
              />
            </div>
            <span>Get it by Tue, Jan 06</span>
          </div>
          <div className="flex items-center text-md">
            <div className="w-10">
              <Image
                src="/assets/icons/cash-on-delivery.svg"
                width={30}
                height={30}
                alt="cod"
              />
            </div>
            <span>Pay on delivery available</span>
          </div>
          <div className="flex items-center text-md">
            <div className="w-10">
              <Image
                src="/assets/icons/product-return.svg"
                width={30}
                height={30}
                alt="return"
              />
            </div>
            <span>Easy 7 days return & exchange available</span>
          </div>
        </div>
      </div>

      {/* Accordion Info */}
      <div className="rounded">
  
  {/* Specifications — OPEN BY DEFAULT */}
  <details open className="group border-b border-gray-200">
    <summary className="flex justify-between items-center text-[#fc5823] px-1 cursor-pointer font-bold hover:bg-gray-300 list-none bg-gray-200 transition-colors uppercase">
      Specifications

      {/* Plus / Minus Toggle */}
      <span className="text-xl font-semibold">
        <span className="group-open:hidden">+</span>
        <span className="hidden group-open:inline">−</span>
      </span>
    </summary>

    <div className="p-4 bg-gray-50 text-sm">
      {Array.isArray(product?.specifications) && product.specifications.length > 0 ? (
        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
           {product.specifications.map((spec: any, idx: number) => (
               <div key={idx} className="flex flex-col border-b border-gray-200 pb-2">
                   <span className="font-semibold text-gray-700">{spec.key}</span>
                   <span className="text-gray-900">{spec.value}</span>
               </div>
           ))}
        </div>
      ) : (
          <p className="text-gray-500 italic">No specifications available.</p>
      )}
    </div>
  </details>

  {/* Delivery & Returns — CLOSED BY DEFAULT */}
  <details className="group">
    <summary className="flex justify-between items-center px-1 cursor-pointer font-bold text-[#fc5823] hover:bg-gray-300 list-none bg-gray-200 transition-colors uppercase">
      Delivery & Returns

      {/* Plus / Minus Toggle */}
      <span className="text-xl font-semibold">
        <span className="group-open:hidden">+</span>
        <span className="hidden group-open:inline">−</span>
      </span>
    </summary>

    <div className="p-4 bg-gray-50 text-sm">
  {/* Heading */}
  <h3 className="font-semibold text-gray-900 mb-5">
    Available Shipping Methods
  </h3>

  {/* Table Header */}
  <div className="grid grid-cols-3 font-bold border-b pb-1 mb-2">
    <span>Shipping Method</span>
    <span>Shipping To</span>
    <span>Shipping Charge</span>
  </div>

  {/* Row 1 */}
  <div className="grid grid-cols-3 py-2 border-b">
    <span>Pre-Paid</span>
    <span>All over India</span>
    <span>Free Shipping on All Orders</span>
  </div>

  {/* Row 2 */}
  <div className="grid grid-cols-3 py-2 border-b">
    <span>COD Charges</span>
    <span>All over India</span>
    <span>Free Shipping on All Orders</span>
  </div>

  {/* Shipping Policy Link */}
  <p className="mt-3 font-semibold">
    For more details please read{" "}
    <a
      href="/shipping-policy"
      className="underline text-gray-900 hover:text-black"
    >
      Shipping Policy
    </a>.
  </p>

  {/* Return Policy */}
  <h3 className="font-semibold text-gray-900 mt-4 mb-1">
    Return Policy
  </h3>

  <p className="leading-relaxed">
    Your satisfaction is our top priority. If you're not completely
    satisfied with the product, we offer a hassle-free, no questions
    asked 7 days return and refund. We believe in making your shopping
    experience risk-free and enjoyable.
  </p>

  {/* Return Policy Link */}
  <p className="mt-2">
    For more details please read{" "}
    <a
      href="/return-and-cancellation-policy"
      className="underline text-gray-900 hover:text-black"
    >
      Return and Cancellation Policy
    </a>.
  </p>
</div>

  </details>

</div>

      {/* Contact */}
      <div className="mt-6 p-8 border">
        <h4 className="font-semibold text-gray-800 mb-2">Have a question? We are here to help!</h4>
        <div className="flex flex-col justify-center gap-4 text-sm">
          <a
            href="mailto:info@studiobysheetal.com"
            className="flex hover:text-[#5f3c20]"
          >
            <Image
              src="/assets/icons/email.svg"
              width={16}
              height={16}
              alt="email"
              className="mr-2"
            />{" "}
             Email us at info@studiobysheetal.com
          </a>
          <a
            href="https://wa.me/919958813913"
            className="flex hover:text-[#5f3c20] border w-35 p-2 font-semibold text-sm"
          >
            <Image
              src="/assets/icons/whatsapp.svg"
              width={16}
              height={16}
              alt="wa"
              className="mr-2"
            />{" "} 
            Click to chat
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
