import React, { useState } from "react";
import Image from "next/image";
import {
  SizeChartData,
  getHowToMeasureImageUrl,
} from "../../services/sizeChartService";

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColor: string;
  colorToAvailableSizesMap: { [colorName: string]: string[] };
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  sizeChartData: SizeChartData | null;
}

const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  selectedColor,
  colorToAvailableSizesMap,
  selectedSize,
  setSelectedSize,
  sizeChartData,
}) => {
  const [activeTab, setActiveTab] = useState<"sizechart" | "measure">(
    "sizechart",
  );
  const [unit, setUnit] = useState<"in" | "cm">("in");

  if (!isOpen) return null;
  if (!sizeChartData) return null; // Render nothing if size chart data is not yet available

  const convertToCm = (inches: string | number) => {
    if (typeof inches === "string") {
      const parts = inches.split("-").map((s) => parseFloat(s.trim()));
      // If any part is NaN after parsing, return "-"
      if (parts.some(isNaN)) return "-";
      const convertedParts = parts.map((val) => (val * 2.54).toFixed(1));
      return convertedParts.join(" - ");
    } else if (typeof inches === "number") {
      // If it's a number, convert directly
      return (inches * 2.54).toFixed(1);
    }
    // If it's neither string nor number, return "-"
    return "-";
  };

  const availableSizesForSelectedColor =
    colorToAvailableSizesMap[selectedColor] || [];

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-all duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-4xl bg-white transform transition-transform duration-300 ease-in-out overflow-y-auto ${
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
            measurements)* Tip: SBS sizes are to fit Indian Body.
          </p>
          <div className="flex justify-center mb-6 border-b border-t border-gray-200">
            <button
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
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
          <div className="flex justify-end mb-4">
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setUnit("in")}
                className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                  unit === "in"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700"
                } border border-gray-300 focus:z-10 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500`}
              >
                IN
              </button>
              <button
                onClick={() => setUnit("cm")}
                className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                  unit === "cm"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700"
                } border border-gray-300 focus:z-10 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500`}
              >
                CM
              </button>
            </div>
          </div>

          {activeTab === "sizechart" && (
            <div className="animate-fade-in">
              {!selectedColor ? (
                <p className="text-center text-red-500">
                  Please select a color first to see available sizes.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-center border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-white text-gray-800 font-bold border-b border-gray-200">
                        <th className="p-3"></th>
                        <th className="p-3">Size</th>
                        <th className="p-3">Bust ({unit})</th>
                        <th className="p-3">Waist ({unit})</th>
                        <th className="p-3">Hip ({unit})</th>
                        <th className="p-3">Shoulder ({unit})</th>
                        <th className="p-3">Length ({unit})</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeChartData.table.map((row: any, idx: number) => {
                        const isAvailable =
                          availableSizesForSelectedColor.includes(row.label);
                        return (
                          <tr
                            key={idx}
                            className={`hover:bg-gray-50 border-b border-gray-100 last:border-0 ${
                              !isAvailable ? "opacity-50" : ""
                            }`}
                          >
                            <td className="p-3">
                              <input
                                type="radio"
                                name="size"
                                value={row.label}
                                checked={selectedSize === row.label}
                                onChange={() => setSelectedSize(row.label)}
                                className="form-radio h-4 w-4 text-orange-600"
                                disabled={!isAvailable}
                              />
                            </td>
                            <td className="p-3 font-bold text-gray-700">
                              {row.label}
                            </td>
                            <td className="p-3 text-gray-600">
                              {unit === "in" ? row.bust : convertToCm(row.bust)}
                            </td>
                            <td className="p-3 text-gray-600">
                              {unit === "in"
                                ? row.waist
                                : convertToCm(row.waist)}
                            </td>
                            <td className="p-3 text-gray-600">
                              {unit === "in" ? row.hip : convertToCm(row.hip)}
                            </td>
                            <td className="p-3 text-gray-600">
                              {unit === "in"
                                ? row.shoulder
                                : convertToCm(row.shoulder)}
                            </td>
                            <td className="p-3 text-gray-600">
                              {unit === "in"
                                ? row.length
                                : convertToCm(row.length)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {activeTab === "measure" && (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <div className="relative w-full h-76">
                <Image
                  src={getHowToMeasureImageUrl(sizeChartData.howToMeasureImage)}
                  alt="How to Measure"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </div>
        <div className="bg-white p-4 flex flex-col items-center">
          <p className="mb-3 text-gray-700 text-center">
            *Select your perfect size from the chart above*
          </p>
          <div className="flex space-x-4 w-full justify-center max-w-md">
            <button
              onClick={() => {
                // Add to Cart logic here
              }}
              className="flex-1 bg-orange-500 text-white font-semibold py-3 px-4 hover:bg-orange-600 transition-colors cursor-pointer"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                // Add to Wishlist logic here
              }}
              className="flex-1 border border-orange-500 text-orange-500 font-semibold py-3 px-4 hover:bg-orange-50 transition-colors cursor-pointer"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeChartModal;
