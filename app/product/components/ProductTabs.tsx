import React from 'react';

interface ProductTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  description: string;
  materialCare: string;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ activeTab, setActiveTab, description, materialCare }) => {
  return (
    <div className="border-t border-gray-200">
       <div className="container mx-auto px-4">
           <div className="flex justify-center mb-8 border-b border-gray-200">
               <button 
                 onClick={() => setActiveTab('description')}
                 className={`px-8 py-4 font-semibold text-lg border-b-2 transition-colors cursor-pointer ${activeTab === 'description' ? 'border-[#fe5722] text-white bg-[#fe5722]' : 'border-transparent text-gray-600 hover:text-black'}`}
               >
                  Description
               </button>
               <button 
                 onClick={() => setActiveTab('material')}
                 className={`px-8 py-4 font-semibold text-lg border-b-2 transition-colors cursor-pointer ${activeTab === 'material' ? 'border-[#fe5722] text-white bg-[#fe5722]' : 'border-transparent text-gray-600 hover:text-black'}`}
               >
                  Material & Care
               </button>
           </div>
           
           <div className="max-w-full mx-auto leading-relaxed min-h-[200px] py-8">
               {activeTab === 'description' && (
                   <div className="animate-fade-in text-gray-700" dangerouslySetInnerHTML={{ __html: description }} />
               )}
               {activeTab === 'material' && (
                   <div className="animate-fade-in text-gray-700" dangerouslySetInnerHTML={{ __html: materialCare }} />
               )}
           </div>
       </div>
    </div>
  );
};

export default ProductTabs;
