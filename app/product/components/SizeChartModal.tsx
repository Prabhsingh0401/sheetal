import React, { useState } from "react";
import Image from "next/image";

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  sizeChart?: {
    name: string;
    table: any[];
    howToMeasure?: {
      guideImage: string;
    };
    unit: string;
  };
}

const SizeChartModal: React.FC<SizeChartModalProps> = ({ isOpen, onClose, sizeChart }) => {
  const [activeTab, setActiveTab] = useState<"sizechart" | "measure">("sizechart");
  
  if (!sizeChart) return null;

  const { table, howToMeasure, unit } = sizeChart;

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
        className={`absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
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
            {sizeChart.name || "Size Chart"}
          </h3>
          <p className="text-center mb-6 text-lg">
            All measurements are in {unit === 'CM' ? 'Centimeters' : 'Inches'}.
          </p>

          {/* Tabs */}
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

          {activeTab === "sizechart" && (
            <div className="animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-white text-gray-800 font-bold border-b border-gray-200">
                      <th className="p-3">Size</th>
                      <th className="p-3">Bust</th>
                      <th className="p-3">Waist</th>
                      <th className="p-3">Hip</th>
                      <th className="p-3">Shoulder</th>
                      <th className="p-3">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((row: any, idx: number) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 border-b border-gray-100 last:border-0"
                        >
                          <td className="p-3 font-bold text-gray-700">
                            {row.label}
                          </td>
                          <td className="p-3 text-gray-600">{row.bust || "-"}</td>
                          <td className="p-3 text-gray-600">{row.waist || "-"}</td>
                          <td className="p-3 text-gray-600">{row.hip || "-"}</td>
                          <td className="p-3 text-gray-600">{row.shoulder || "-"}</td>
                          <td className="p-3 text-gray-600">{row.length || "-"}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "measure" && (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <div className="relative w-full h-96">
                {howToMeasure?.guideImage ? (
                   <Image
                     src={howToMeasure.guideImage}
                     alt="How to Measure"
                     fill
                     className="object-contain"
                   />
                ) : (
                    <p>No guide image available</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SizeChartModal;
