import React from 'react';
import Link from 'next/link';

interface BreadcrumbProps {
  title: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ title }) => {
  return (
    <div className="container mx-auto px-4 py-4 pt-[120px] md:pt-[140px]">
      <ul className="flex items-center text-xs md:text-sm text-gray-500">
        <li><Link href="/" className="hover:text-[#bd9951]">Home</Link> <span className="mx-2">/</span></li>
        <li><Link href="/product-list" className="hover:text-[#bd9951]">Sarees</Link> <span className="mx-2">/</span></li>
        <li className="text-gray-800 truncate max-w-[200px] md:max-w-none">{title}</li>
      </ul>
    </div>
  );
};

export default Breadcrumb;
