import React from "react";
import Image from "next/image";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
}

const StarRating = ({ rating, onRatingChange }: StarRatingProps) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Image
          key={i}
          src={i < rating ? "/assets/y-star.png" : "/assets/gray-star.png"}
          alt="star"
          width={14}
          height={14}
          className={`w-[14px] h-[14px] ${onRatingChange ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
          onClick={() => onRatingChange && onRatingChange(i + 1)}
        />
      ))}
    </div>
  );
};

export default StarRating;
