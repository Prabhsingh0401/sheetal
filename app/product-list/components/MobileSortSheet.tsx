"use client";
import React from "react";

interface MobileSortSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: string) => void;
}

const MobileSortSheet: React.FC<MobileSortSheetProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const options = [
    "Price: Low to High",
    "Price: High to Low",
    "New Arrivals",
    "Popularity",
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-white z-[1001] rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transform transition-transform duration-300 lg:hidden ${isOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold uppercase tracking-wide">
              Sort By
            </h3>
            <button onClick={onClose} className="text-2xl text-gray-400">
              ×
            </button>
          </div>

          <ul className="space-y-4">
            {options.map((option, idx) => (
              <li key={idx}>
                <button
                  className="w-full text-left text-sm font-medium py-2 border-b border-gray-100 last:border-0 hover:text-[#bd9951]"
                  onClick={() => {
                    onSelect(option);
                    onClose();
                  }}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default MobileSortSheet;
