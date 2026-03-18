import StarRating from "./StarRating";
import { ProductVariant } from "../../services/productService";
import Image from "next/image";
import { getApiImageUrl } from "../../services/api";

interface ProductInfoProps {
  product: {
    title: string;
    rating: number;
    productCode: string;
    mainDescription: string;
    selectedPrice: number;
    selectedOriginalPrice: number;
    selectedDiscount: string;
    description: string;
    colors: { name: string; image: string }[];
    allSizes: { name: string; available: boolean; left: number }[];
    colorToAvailableSizesMap: { [colorName: string]: string[] };
    specifications: any[];
  };
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: string;
  onBuyNow: () => void;
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
  isOutOfStock: boolean;
  selectedVariantData?: ProductVariant | null;
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
  onBuyNow,
  pincode,
  setPincode,
  pincodeMessage,
  checkPincode,
  hasSizeChart = false,
  isOutOfStock,
  selectedVariantData,
}) => {
  const priceToDisplay          = product.selectedPrice || product.selectedOriginalPrice;
  const originalPriceToDisplay  = product.selectedOriginalPrice;
  const discountPercentageToDisplay = product.selectedDiscount
    ? Number(product.selectedDiscount)
    : 0;

  return (
    <div className="p-4 md:p-6 lg:p-8">

      {/* Desktop Title / Rating / Code */}
      <div className="hidden lg:block mb-4">
        <h1 className="text-[26px] md:text-[30px] font-normal text-[#683e14] mb-2 font-[family-name:var(--font-optima)]">
          {product.title}
        </h1>
        <div className="flex items-center gap-4 mb-2">
          <StarRating rating={product.rating} />
        </div>
        <div className="text-emerald-900 text-sm hidden md:block">
          <span className="font-semibold">Product Code:</span> {product.productCode}
        </div>
      </div>

      {/* Short description */}
      <p className="text-[15px] mb-5 leading-relaxed text-gray-800 hidden md:block">
        {product.mainDescription}
      </p>

      {/* Price */}
      <div className="mb-5">
        <div className="flex flex-wrap items-end gap-2 md:gap-3">
          <span className="text-xl md:text-2xl font-normal">
            ₹ {priceToDisplay.toFixed(2)}
          </span>
          <span className="text-base md:text-lg text-gray-400 line-through">
            ₹ {originalPriceToDisplay.toFixed(2)}
          </span>
          {discountPercentageToDisplay > 0 && (
            <span className="text-sm md:text-md text-green-600 font-semibold">
              Save {discountPercentageToDisplay}%
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes.</p>
      </div>

      {/* Stock badge */}
      <div className="mb-5">
        <span
          className={`inline-block text-xs px-2 py-1 rounded border ${
            isOutOfStock
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-green-50 text-green-700 border-green-200"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : "In Stock"}
        </span>
      </div>

      {/* Color Selection */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Select Color:
        </label>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {Array.isArray(product?.colors) &&
            product.colors.map((color, i) => (
              <div
                key={i}
                className={`w-10 h-14 md:w-12 md:h-16 border cursor-pointer hover:border-[#bd9951] p-0.5 relative flex-shrink-0 ${
                  selectedColor === color.name ? "border-[#bd9951]" : "border-gray-200"
                }`}
                onClick={() => onColorChange(color)}
              >
                <Image
                  src={getApiImageUrl(color.image, "/assets/default-image.png")}
                  alt={color.name}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-semibold text-gray-800">
            Select Size:
          </label>
          <button
            onClick={onSizeChartOpen}
            className="flex items-center text-sm text-red-500 font-semibold hover:underline cursor-pointer"
          >
            <Image
              src="/assets/icons/measurement.svg"
              width={14}
              height={14}
              alt="ruler"
              className="mr-1"
            />
            Size Chart {">"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {Array.isArray(product?.allSizes) &&
            product.allSizes.map((size) => {
              const isAvailableForSelectedColor =
                product.colorToAvailableSizesMap[selectedColor]?.includes(size.name);
              const isDisabled = !isAvailableForSelectedColor || isOutOfStock;

              return (
                <div key={size.name} className="flex flex-col items-center gap-1">
                  <button
                    disabled={isDisabled}
                    onClick={() => setSelectedSize(size.name)}
                    className={`
                      ${size.name === "One Size" ? "px-3 py-2 rounded-md" : "w-9 h-9 md:w-10 md:h-10 rounded-full"}
                      flex items-center justify-center border text-xs md:text-sm font-medium transition-colors relative overflow-hidden
                      ${isDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
                      ${
                        selectedSize === size.name && !isDisabled
                          ? "border-[#bd9951]"
                          : "border-gray-300 text-gray-700 hover:border-[#bd9951] cursor-pointer"
                      }
                    `}
                  >
                    {size.name}
                    {isDisabled && (
                      <div className="absolute w-full h-px bg-gray-400 transform rotate-45" />
                    )}
                  </button>
                  {isAvailableForSelectedColor &&
                    selectedVariantData &&
                    (() => {
                      const actualStock = selectedVariantData.sizes?.find(
                        (s) => s.name === size.name,
                      )?.stock;
                      return (
                        actualStock !== undefined &&
                        actualStock <= 5 && (
                          <span className="text-[9px] md:text-[10px] bg-[#f5a623] text-white px-1.5 py-0.5 rounded-sm font-semibold whitespace-nowrap">
                            {actualStock} left
                          </span>
                        )
                      );
                    })()}
                </div>
              );
            })}
        </div>
      </div>

      {/* Mobile quantity / notify (above sticky footer) */}
      <div className="flex flex-col lg:hidden mb-5 border-b border-gray-100 pb-5 space-y-3">
        {isOutOfStock ? (
          <button
            onClick={onEnquire}
            className="text-[#bd9951] border border-[#bd9951] px-4 py-2 text-sm font-medium rounded-sm hover:bg-[#bd9951] hover:text-white transition-colors w-full"
          >
            Notify Me
          </button>
        ) : (
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full h-10 border border-gray-300 px-3 text-sm focus:outline-none focus:border-[#bd9951]"
          />
        )}
      </div>

      {/* Desktop actions */}
      <div className="mb-6 hidden lg:block">
        {isOutOfStock ? (
          <button
            onClick={onEnquire}
            className="text-[#bd9951] border p-3 text-sm font-medium hover:bg-gray-100 cursor-pointer flex items-center w-full justify-center"
          >
            Notify Me
          </button>
        ) : (
          <div className="flex gap-3 items-center">
            <div className="w-16 md:w-20">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full h-12 border border-gray-300 text-center focus:outline-none focus:border-[#bd9951]"
              />
            </div>
            <button
              onClick={onAddToCart}
              className="flex-1 h-12 bg-white border border-[#fe5722] text-[#fe5722] uppercase font-medium tracking-wider hover:bg-gray-100 cursor-pointer transition-colors text-sm"
            >
              Add to Cart
            </button>
            <button
              onClick={onBuyNow}
              disabled={!selectedSize}
              className="flex-1 h-12 bg-[#fe5722] text-white border border-[#bd9951] uppercase font-medium tracking-wider cursor-pointer transition-colors shadow-lg text-sm disabled:opacity-60"
            >
              Buy Now
            </button>
          </div>
        )}
      </div>

      {/* Mobile Sticky Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white z-[100] border-t border-gray-200 px-3 py-2 lg:hidden flex gap-2 items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col shrink-0">
          <span className="text-base font-bold leading-tight">
            ₹ {priceToDisplay.toFixed(2)}
          </span>
          <span className="text-xs text-gray-400 line-through">
            ₹ {originalPriceToDisplay.toFixed(2)}
          </span>
        </div>
        <div className="flex gap-2 flex-1 justify-end">
          {isOutOfStock ? (
            <button
              onClick={onEnquire}
              className="flex-1 bg-[#bd9951] text-white uppercase font-bold text-xs py-3 rounded-sm hover:bg-[#a38547] transition-colors"
            >
              Notify Me
            </button>
          ) : (
            <>
              <button
                onClick={onAddToCart}
                className="flex-1 bg-white border border-[#fe5722] text-[#fe5722] uppercase font-bold text-xs py-3 rounded-sm"
              >
                Add to Cart
              </button>
              <button
                onClick={onBuyNow}
                disabled={!selectedSize}
                className="flex-1 bg-[#fe5722] text-white uppercase font-bold text-xs py-3 rounded-sm disabled:opacity-60"
              >
                Buy Now
              </button>
            </>
          )}
        </div>
      </div>

      {/* Delivery */}
      <div className="mb-5 border-t border-gray-100 pt-5">
        <label className="flex items-center text-sm font-semibold mb-3">
          Delivery Options
          <Image
            src="/assets/icons/delivery-truck.svg"
            width={18}
            height={18}
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
            className="absolute right-0 bg-gray-100 border border-gray-300 top-0 h-10 px-3 text-[#fe5722] font-semibold text-sm hover:bg-gray-50 cursor-pointer"
          >
            Check
          </button>
        </div>
        {pincodeMessage && (
          <p
            className={`text-xs ${
              pincodeMessage.includes("valid") ? "text-red-500" : "text-green-600"
            }`}
          >
            {pincodeMessage}
          </p>
        )}
        <div className="mt-4 space-y-2">
          {[
            { icon: "delivery-truck.svg",  text: "Get it by Tue, Jan 06" },
            { icon: "cash-on-delivery.svg", text: "Pay on delivery available" },
            { icon: "product-return.svg",   text: "Easy 7 days return & exchange available" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center text-[15px] gap-3">
              <Image src={`/assets/icons/${icon}`} width={38} height={38} alt={icon} className="shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 px-1 text-gray-800">100% Original Products</div>
      </div>

      {/* Trust badges */}
      {/* <div className="flex flex-wrap justify-around items-center py-4 gap-y-4 border-t border-gray-100">
        {[
          { src: "/assets/icons/secure-payment.svg",   label: "Secure Payments" },
          { src: "/assets/icons/transaction.svg",       label: "Cash on delivery" },
          { src: "/assets/icons/quality-assurance.svg", label: "Assured Quality" },
          { src: "/assets/icons/product-return1.svg",   label: "Easy returns" },
        ].map(({ src, label }) => (
          <div key={label} className="flex items-center gap-1.5 w-1/2 md:w-auto justify-center px-1">
            <Image src={src} alt={label} width={24} height={24} className="shrink-0" />
            <span className="text-xs md:text-sm text-[#706a42] font-semibold whitespace-nowrap">
              {label}
            </span>
          </div>
        ))}
      </div> */}

      {/* Accordion */}
      <div className="rounded mt-2">
        <details open className="group border-b border-gray-200">
          <summary className="flex justify-between items-center text-[#fc5823] px-2 py-2 cursor-pointer font-bold hover:bg-gray-300 list-none bg-gray-200 transition-colors uppercase text-[16px]">
            Specifications
            <span className="text-xl font-semibold">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <div className="p-3 md:p-4 bg-gray-50 text-sm">
            {Array.isArray(product?.specifications) && product.specifications.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 md:gap-x-8">
                {product.specifications.map((spec: any, idx: number) => (
                  <div key={idx} className="flex flex-col border-b border-gray-200 pb-2">
                    <span className="font-semibold text-gray-700 text-xs md:text-[15px]">{spec.key}</span>
                    <span className="text-gray-900 text-xs md:text-[16px]">{spec.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">No specifications available.</p>
            )}
          </div>
        </details>

        <details className="group">
          <summary className="flex justify-between items-center px-2 py-2 cursor-pointer font-bold text-[#fc5823] hover:bg-gray-300 list-none bg-gray-200 transition-colors uppercase text-[15px]">
            Delivery & Returns
            <span className="text-xl font-semibold">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <div className="p-3 md:p-4 bg-gray-50 text-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Available Shipping Methods</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b font-bold">
                    <th className="text-left pb-1 pr-4">Shipping Method</th>
                    <th className="text-left pb-1 pr-4">Shipping To</th>
                    <th className="text-left pb-1">Shipping Charge</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 pr-4">Pre-Paid</td>
                    <td className="py-2 pr-4">All over India</td>
                    <td className="py-2">Free Shipping</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4">COD Charges</td>
                    <td className="py-2 pr-4">All over India</td>
                    <td className="py-2">Free Shipping</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 font-semibold text-xs md:text-sm">
              For more details please read{" "}
              <a href="/shipping-policy" className="underline text-gray-900 hover:text-black">
                Shipping Policy
              </a>.
            </p>
            <h3 className="font-semibold text-gray-900 mt-4 mb-1 text-xs md:text-sm">Return Policy</h3>
            <p className="leading-relaxed text-xs md:text-sm">
              Your satisfaction is our top priority. If you're not completely satisfied with the
              product, we offer a hassle-free, no questions asked 7 days return and refund.
            </p>
            <p className="mt-2 text-xs md:text-sm">
              For more details please read{" "}
              <a href="/return-and-cancellation-policy" className="underline text-gray-900 hover:text-black">
                Return and Cancellation Policy
              </a>.
            </p>
          </div>
        </details>
      </div>

      {/* Contact */}
      <div className="mt-5 p-4 md:p-6 border">
        <h4 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">
          Have a question? We are here to help!
        </h4>
        <div className="flex flex-col gap-3 text-sm">
          <a href="mailto:info@studiobysheetal.com" className="flex items-center hover:text-[#5f3c20] gap-2">
            <Image src="/assets/icons/email.svg" width={27} height={27} alt="email" />
            <span className="break-all text-[15px]">Email us at info@studiobysheetal.com</span>
          </a>
          <a
            href="https://wa.me/919958813913"
            className="flex items-center hover:text-[#5f3c20] border w-fit px-3 py-2 font-semibold gap-2"
          >
            <Image src="/assets/icons/whatsapp.svg" width={27} height={27} alt="wa" />
            <span className="text-[15px]">Click to chat</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;