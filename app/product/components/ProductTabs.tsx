import React from 'react';

interface ProductTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-t border-gray-200">
       <div className="container mx-auto px-4">
           <div className="flex justify-center mb-8 border-b border-gray-200">
               <button 
                 onClick={() => setActiveTab('description')}
                 className={`px-8 py-4 font-semibold text-lg border-b-2 transition-colors cursor-pointer ${activeTab === 'description' ? 'border-[#fe5722] text-[#fe5722] bg-[#fe5722] text-white' : 'border-transparent'}`}
               >
                  Description
               </button>
               <button 
                 onClick={() => setActiveTab('material')}
                 className={`px-8 py-4 font-semibold text-lg border-b-2 transition-colors cursor-pointer ${activeTab === 'material' ? 'border-[#fe5722] text-[#fe5722] bg-[#fe5722] text-white' : 'border-transparent'}`}
               >
                  Material & Care
               </button>
           </div>
           
           <div className="max-w-full mx-auto leading-relaxed">
               {activeTab === 'description' && (
                   <div className="animate-fade-in font-semibold">
                       <p className="mb-4">Embrace the calming charm of this soft blue suit set – a beautiful blend of comfort and everyday elegance. Ideal for casual outings and relaxed daytime gatherings, this three-piece ensemble features a delicately printed straight kurta, matching palazzos, and a coordinated dupatta.</p>
                       <h4 className="font-bold text-gray-800 mt-6 mb-2">Kurta Details:</h4>
                       <ul className="list-disc list-inside mb-4">
                           <li>Adorned with intricate ethnic prints that showcase fine craftsmanship</li>
                           <li>Classic V-neckline adds a subtle, timeless elegance</li>
                       </ul>
                       <p className="font-bold text-[#bd9951] mt-6">SBS Recommends:</p>
                       <p>Style it with oxidised earrings and simple one-toe flats for a chic yet relaxed vibe.</p>
                   </div>
               )}
               {activeTab === 'material' && (
                   <div className="animate-fade-in font-semibold">
                       <p className="mb-4"><strong>Material:</strong> Premium Viscose Rayon</p>
                       <p className="mb-4"><strong>Care:</strong> Machine wash cold with like colors. Do not bleach. Tumble dry low. Warm iron if needed.</p>
                   </div>
               )}
           </div>
       </div>
    </div>
  );
};

export default ProductTabs;
