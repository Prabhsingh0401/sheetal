import React from 'react';
import Image from 'next/image';

interface EnquireModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
}

const EnquireModal: React.FC<EnquireModalProps> = ({ isOpen, onClose, productTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-lg overflow-hidden relative animate-scale-in">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl">×</button>
            <div className="p-6">
                <h4 className="text-xl font-bold mb-4 font-[family-name:var(--font-optima)]">Enquire Form</h4>
                <p className="text-sm text-gray-500 mb-4">Product: {productTitle}</p>
                <form className="space-y-4">
                    <input type="text" placeholder="Name" className="w-full border border-gray-300 p-3 rounded text-sm focus:border-[#bd9951] outline-none" />
                    <input type="email" placeholder="Email" className="w-full border border-gray-300 p-3 rounded text-sm focus:border-[#bd9951] outline-none" />
                    <input type="tel" placeholder="Phone Number" className="w-full border border-gray-300 p-3 rounded text-sm focus:border-[#bd9951] outline-none" />
                    <textarea placeholder="Message" rows={3} className="w-full border border-gray-300 p-3 rounded text-sm focus:border-[#bd9951] outline-none"></textarea>
                    <button className="w-full bg-[#bd9951] text-white py-3 rounded font-bold uppercase tracking-wider hover:bg-[#a68545]">Enquire Now</button>
                </form>
            </div>
            <div className="bg-gray-50 p-4 flex justify-center">
               <Image src="/assets/popu-element-img.png" width={150} height={50} alt="decor" className="opacity-50"/>
            </div>
        </div>
    </div>
  );
};

export default EnquireModal;
