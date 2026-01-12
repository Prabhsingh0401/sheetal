import React from 'react';
import Image from 'next/image';

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Image
          key={i}
          src={i < rating ? "/assets/y-star.png" : "/assets/gray-star.png"}
          alt="star"
          width={14}
          height={14}
          className="w-[14px] h-[14px]"
        />
      ))}
    </div>
  );
};

export default StarRating;
