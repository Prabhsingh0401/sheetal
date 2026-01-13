import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FilterSortMobileProps {
  onFilterClick: () => void;
  onSortClick: () => void;
}

const FilterSortMobile: React.FC<FilterSortMobileProps> = ({ onFilterClick, onSortClick }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white z-[999] border-t border-gray-200 lg:hidden flex shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="w-1/2 border-r border-gray-200">
        <button 
          className="w-full py-4 flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-wider"
          onClick={onSortClick}
        >
          <Image src="/assets/icons/sort.svg" width={16} height={16} alt="Sort" />
          Sort By
        </button>
      </div>
      <div className="w-1/2">
        <button 
          className="w-full py-4 flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-wider"
          onClick={onFilterClick}
        >
          <Image src="/assets/icons/filter.svg" width={16} height={16} alt="Filter" />
          Filter
        </button>
      </div>
    </div>
  );
};

export default FilterSortMobile;
