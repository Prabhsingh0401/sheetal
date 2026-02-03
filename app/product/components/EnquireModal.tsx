import React from "react";
import Image from "next/image";

interface EnquireModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
}

const EnquireModal: React.FC<EnquireModalProps> = ({
  isOpen,
  onClose,
  productTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
      {/* Circular Modal */}
      <div className="relative w-[520px] h-[520px] rounded-full bg-[#f7f3ee] border-[3px] border-[#f5a623] flex flex-col items-center justify-center px-20">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center text-xl text-[#fe5722]"
          aria-label="Close"
        >
          ×
        </button>

        {/* Title */}
        <h3 className="text-2xl font-medium mb-2 font-[family-name:var(--font-optima)]">
          Enquire Form
        </h3>
        <div className="w-24 h-px bg-gray-400 mb-4" />

        {/* Form */}
        <form className="w-full space-y-3 text-sm">
          <input
            type="text"
            value={productTitle}
            disabled
            className="w-full rounded-full border border-gray-700 px-4 py-2 bg-transparent text-center text-xs"
          />

          <input
            type="text"
            placeholder="Name"
            className="w-full rounded-full border border-gray-700 px-4 py-2 bg-transparent"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-full border border-gray-700 px-4 py-2 bg-transparent"
          />

          <input
            type="text"
            placeholder="Phone Number"
            maxLength={10}
            className="w-full rounded-full border border-gray-700 px-4 py-2 bg-transparent"
          />

          <textarea
            placeholder="Message"
            rows={2}
            className="w-full rounded-full border border-gray-700 px-4 py-2 bg-transparent resize-none"
          />
          {/* Button */}
          <button
            type="submit"
            className="mx-auto mt-3 block w-40 py-2 text-sm font-medium border-y border-black text-black font-normal uppercase transition-all duration-500 hover:text-black hover:tracking-[2px] text-sm"
          >
            Enquire Now
          </button>
        </form>

        {/* Decorative Saree Image */}
        <div className="absolute -bottom-2 -left-15">
          <Image
            src="/assets/popu-element-img.png"
            alt="Saree"
            width={260}
            height={360}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default EnquireModal;
