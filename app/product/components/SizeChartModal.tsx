import React, { useState } from 'react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeChartModal: React.FC<SizeChartModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  const convert = (val: number) => {
    return unit === 'in' ? val : Math.round(val * 2.54);
  };

  const getSizeData = (i: number) => {
    const bustStart = 32 + (i * 2);
    const bustEnd = 33 + (i * 2);
    const waistStart = 28 + (i * 2);
    const waistEnd = 29 + (i * 2);
    const hipStart = 36 + (i * 2);
    const hipEnd = 37 + (i * 2);
    const shoulder = 14 + (i * 0.5);

    return {
        bust: `${convert(bustStart)}-${convert(bustEnd)}`,
        waist: `${convert(waistStart)}-${convert(waistEnd)}`,
        hip: `${convert(hipStart)}-${convert(hipEnd)}`,
        shoulder: convert(shoulder)
    };
  };

  return (
    <div className={`fixed inset-0 z-[9999] transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
        ></div>

        {/* Drawer */}
        <div className={`absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl z-10">×</button>
            <div className="p-8">
                <h3 className="text-2xl font-bold mb-2 font-[family-name:var(--font-optima)] text-center">Size Chart</h3>
                <p className="text-center text-gray-500 mb-6 text-sm">Our Sizes fit the best for mentioned body measurements (not garment measurements)*</p>
                
                {/* Tabs */}
                <div className="flex justify-center mb-6">
                    <div className="bg-gray-100 p-1 rounded-full flex">
                        <button 
                            className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-all ${unit === 'in' ? 'bg-white shadow text-[#bd9951]' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setUnit('in')}
                        >
                            IN
                        </button>
                        <button 
                            className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-all ${unit === 'cm' ? 'bg-white shadow text-[#bd9951]' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setUnit('cm')}
                        >
                            CM
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-center border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50 text-gray-800 font-bold">
                                <th className="p-3 border">Size</th>
                                <th className="p-3 border">Bust ({unit})</th>
                                <th className="p-3 border">Waist ({unit})</th>
                                <th className="p-3 border">Hip ({unit})</th>
                                <th className="p-3 border">Shoulder ({unit})</th>
                            </tr>
                        </thead>
                        <tbody>
                            {['S', 'M', 'L', 'XL', 'XXL'].map((size, i) => {
                                const data = getSizeData(i);
                                return (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="p-3 border font-bold">{size}</td>
                                        <td className="p-3 border">{data.bust}</td>
                                        <td className="p-3 border">{data.waist}</td>
                                        <td className="p-3 border">{data.hip}</td>
                                        <td className="p-3 border">{data.shoulder}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                <div className="mt-8 text-center bg-yellow-50 p-4 rounded border border-yellow-100">
                    <p className="text-sm text-gray-600 mb-4">*These measurements are indicative. Actual Size may differ.</p>
                    <div className="flex flex-col gap-3">
                       <button className="w-full px-6 py-3 bg-[#bd9951] text-white rounded font-bold hover:bg-[#a68545]">Add to Cart</button>
                       <button className="w-full px-6 py-3 bg-white border border-[#bd9951] text-[#bd9951] rounded font-bold hover:bg-gray-50">Add to Wishlist</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SizeChartModal;