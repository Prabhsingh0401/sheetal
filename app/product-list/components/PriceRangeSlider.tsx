"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ min, max, onChange }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  const debouncedOnChange = (minV: number, maxV: number) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange(minV, maxV), 500);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxVal - 1);
    setMinVal(value);
    debouncedOnChange(value, maxVal);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minVal + 1);
    setMaxVal(value);
    debouncedOnChange(minVal, value);
  };

  const minPercent = getPercent(minVal);
  const maxPercent = getPercent(maxVal);

  return (
    <>
      {/* Inject thumb styles globally once */}
      <style>{`
        .price-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #bd9951;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          cursor: grab;
          pointer-events: all;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .price-slider::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.2);
          box-shadow: 0 2px 8px rgba(189,153,81,0.35);
        }
        .price-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #bd9951;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          cursor: grab;
          pointer-events: all;
        }
        .price-slider::-webkit-slider-runnable-track {
          background: transparent;
        }
        .price-slider::-moz-range-track {
          background: transparent;
        }
      `}</style>

      <div className="px-1 pb-2">
        {/* Price display */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Min</span>
            <span className="text-sm font-semibold text-gray-800">
              ₹{minVal.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="h-px w-6 bg-gray-300 mt-3" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Max</span>
            <span className="text-sm font-semibold text-gray-800">
              ₹{maxVal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Track */}
        <div className="relative h-1.5 w-full mx-auto">
          {/* Base grey track */}
          <div className="absolute inset-0 bg-gray-200 rounded-full" />

          {/* Gold active range */}
          <div
            className="absolute top-0 h-full bg-[#bd9951] rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />

          {/* Min range input */}
          <input
            type="range"
            min={min}
            max={max}
            value={minVal}
            onChange={handleMinChange}
            className="price-slider absolute w-full h-full appearance-none bg-transparent pointer-events-none"
            style={{ zIndex: minVal > max - 100 ? 5 : 3 }}
          />

          {/* Max range input */}
          <input
            type="range"
            min={min}
            max={max}
            value={maxVal}
            onChange={handleMaxChange}
            className="price-slider absolute w-full h-full appearance-none bg-transparent pointer-events-none"
            style={{ zIndex: 4 }}
          />
        </div>

        {/* Min / Max bounds */}
        <div className="flex justify-between mt-3">
          <span className="text-[11px] text-gray-400">₹{min.toLocaleString("en-IN")}</span>
          <span className="text-[11px] text-gray-400">₹{max.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </>
  );
};

export default PriceRangeSlider;