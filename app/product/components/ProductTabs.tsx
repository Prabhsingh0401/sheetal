import React from "react";

interface ProductTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  description: string;
  materialCare: string;
}

const ProductTabs: React.FC<ProductTabsProps> = ({
  activeTab,
  setActiveTab,
  description,
  materialCare,
}) => {
  return (
    <div className="border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-8 py-4 font-semibold text-lg border-b-2 transition-colors cursor-pointer ${activeTab === "description" ? "border-[#fe5722] text-white bg-[#fe5722]" : "border-transparent text-gray-600 hover:text-black"}`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("material")}
            className={`px-8 py-4 font-semibold text-lg border-b-2 transition-colors cursor-pointer ${activeTab === "material" ? "border-[#fe5722] text-white bg-[#fe5722]" : "border-transparent text-gray-600 hover:text-black"}`}
          >
            Material & Care
          </button>
        </div>

        <div className="max-w-full mx-auto leading-relaxed min-h-[200px] py-8">
          {activeTab === "description" && (
            <div
              className="prose max-w-none animate-fade-in text-gray-700"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
          {activeTab === "material" && (
            <div
              className="prose max-w-none animate-fade-in text-gray-700"
              dangerouslySetInnerHTML={{ __html: materialCare }}
            />
          )}
        </div>
      </div>
      <style jsx global>{`
        /* Custom styles for Tiptap editor output to ensure correct rendering */
        .prose p {
          margin-bottom: 1em; /* Add space between paragraphs */
        }
        .prose ul {
          list-style-type: disc; /* Ensure bullet points are discs */
          padding-left: 1.5em; /* Indent bullet points */
          margin-bottom: 1em;
        }
        .prose ol {
          list-style-type: decimal; /* Ensure ordered list markers are decimals */
          padding-left: 1.5em; /* Indent ordered list items */
          margin-bottom: 1em;
        }
        .prose li {
          margin-bottom: 0.5em; /* Space between list items */
        }
        .prose li p {
          margin-bottom: 0; /* Remove extra margin from paragraphs inside list items */
        }
      `}</style>
    </div>
  );
};

export default ProductTabs;
