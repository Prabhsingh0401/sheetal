import React, { useState } from "react";
import Image from "next/image";

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeChartModal: React.FC<SizeChartModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [activeTab, setActiveTab] = useState<"sizechart" | "measure">(
    "sizechart"
  );
  const [selectedSize, setSelectedSize] = useState<string>("");

  const convert = (val: number) => {
    return unit === "in" ? val : Math.round(val * 2.54);
  };

  const getSizeData = (i: number) => {
    const bustStart = 32 + i * 2;
    const bustEnd = 33 + i * 2;
    const waistStart = 28 + i * 2;
    const waistEnd = 29 + i * 2;
    const hipStart = 36 + i * 2;
    const hipEnd = 37 + i * 2;
    const shoulder = 14 + i * 0.5; // S=14, M=14.25, etc.

    return {
      bust: `${convert(bustStart)}-${convert(bustEnd)}`,
      waist: `${convert(waistStart)}-${convert(waistEnd)}`,
      hip: `${convert(hipStart)}-${convert(hipEnd)}`,
      shoulder: convert(shoulder),
    };
  };

  const sizes = ["S", "M", "L", "XL", "3XL", "5XL"];

  const sizeDataIn = {
    S: { bust: "32-33", waist: "28-29", hip: "36-37", shoulder: "14" },
    M: { bust: "34-35", waist: "30-31", hip: "38-39", shoulder: "14.25" },
    L: { bust: "36-37", waist: "32-33", hip: "40-41", shoulder: "14.75" },
    XL: { bust: "38-39", waist: "34-35", hip: "42-43", shoulder: "15.25" },
    "3XL": { bust: "42-43", waist: "40-41", hip: "47-48", shoulder: "16.25" },
    "5XL": { bust: "46-47", waist: "44-45", hip: "51-52", shoulder: "16.75" },
  };

  const sizeDataCm = {
    S: { bust: "81-84", waist: "71-74", hip: "91-94", shoulder: "36" },
    M: { bust: "86-89", waist: "76-79", hip: "97-99", shoulder: "36" },
    L: { bust: "91-94", waist: "81-84", hip: "102-104", shoulder: "37" },
    XL: { bust: "97-99", waist: "86-89", hip: "107-109", shoulder: "39" },
    "3XL": {
      bust: "107-109",
      waist: "102-104",
      hip: "119-122",
      shoulder: "41",
    },
    "5XL": {
      bust: "117-119",
      waist: "112-114",
      hip: "130-132",
      shoulder: "43",
    },
  };

  const currentData = unit === "in" ? sizeDataIn : sizeDataCm;

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-all duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>

      {/* Drawer/Modal Content */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-6xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:text-gray-800 text-2xl z-10 border px-2 cursor-pointer"
        >
          ×
        </button>
        <div className="p-8">
          <h3 className="text-4xl text-[#bd9951] font-medium mb-2 font-[family-name:var(--font-optima)] text-center">
            Size Chart
          </h3>
          <p className="text-center mb-6 text-lg">
            Our Sizes fit the best for mentioned body measurements (not garment
            measurements)*
            <br />
            Tip: SBS sizes are to fit Indian Body.
          </p>

          {/* Tabs */}
          <div className="flex justify-center mb-6 border-b border-t border-gray-200">
            <button
              className={`px-6 py-3 font-semibold text-sm text-[#fe5722] transition-all border-b-2 ${
                activeTab === "sizechart"
                  ? "border-[#fe5722] text-[#fe5722]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("sizechart")}
            >
              Size Chart
            </button>
            <button
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === "measure"
                  ? "border-[#fe5722] text-[#fe5722]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("measure")}
            >
              How to Measure
            </button>
          </div>

          {activeTab === "sizechart" && (
            <div className="animate-fade-in">
              <div className="flex justify-end mb-4">
                <div className="p-1 rounded flex">
                  <button
                    className={`px-2 py-1 rounded text-md font-bold transition-all cursor-pointer ${
                      unit === "in"
                        ? "bg-orange-500 shadow text-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setUnit("in")}
                  >
                    IN
                  </button>
                  <button
                    className={`px-2 py-1 rounded text-md font-bold transition-all cursor-pointer ${
                      unit === "cm"
                        ? "bg-orange-500 shadow text-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setUnit("cm")}
                  >
                    CM
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-white text-gray-800 font-bold border-b border-gray-200">
                      <th className="p-3"></th>
                      <th className="p-3">Size</th>
                      <th className="p-3">To Fit Bust</th>
                      <th className="p-3">To Fit Waist</th>
                      <th className="p-3">To Fit Hip</th>
                      <th className="p-3">To Fit Across Shoulder</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      Object.keys(currentData) as Array<
                        keyof typeof currentData
                      >
                    ).map((size) => {
                      const rowData = currentData[size];
                      return (
                        <tr
                          key={size}
                          className="hover:bg-gray-50 border-b border-gray-100 last:border-0"
                        >
                          <td className="p-3">
                           <label className="flex items-center justify-center cursor-pointer">
  <input
    type="radio"
    name="size"
    value={size}
    checked={selectedSize === size}
    onChange={() => setSelectedSize(size)}
    className="hidden"
  />

  {/* Outer square */}
  <span
    className={`w-4 h-4 border flex items-center justify-center rounded-full
      ${
        selectedSize === size
          ? "border-[#bd9951]"
          : "border-gray-400"
      }
    `}
  >
    {/* Inner circle */}
    {selectedSize === size && (
      <span className="w-2 h-2 rounded-full bg-[#bd9951]"></span>
    )}
  </span>
</label>

                          </td>
                          <td className="p-3 font-bold text-gray-700">
                            {size}
                          </td>
                          <td className="p-3 text-gray-600">{rowData.bust}</td>
                          <td className="p-3 text-gray-600">{rowData.waist}</td>
                          <td className="p-3 text-gray-600">{rowData.hip}</td>
                          <td className="p-3 text-gray-600">
                            {rowData.shoulder}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "measure" && (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <div className="relative w-full h-96">
                <Image
                  src="/assets/Apparel-Illustration.svg"
                  alt="How to Measure"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-lg mb-4 flex flex-col items-center justify-center">
              *These measurements are indicative. Actual Size may differ.
            </p>
            <div className="flex flex-row gap-3 w-full justify-center">
              <button className="w-40 text-sm px-2 py-3 bg-[#fe5722] text-white rounded hover:bg-[#a68545] uppercase tracking-wide">
                Add to Cart
              </button>
              <button className="w-40 text-sm px-2 py-3 bg-white border border-[#fe5722] text-[#fe5722] rounded hover:bg-gray-50 uppercase tracking-wide">
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeChartModal;
