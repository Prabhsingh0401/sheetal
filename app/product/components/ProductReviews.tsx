import React from "react";
import StarRating from "./StarRating";

interface Review {
  user: string;
  rating: number;
  comment: string;
}

interface ProductReviewsProps {
  reviews: Review[];
  overallRating: number;
  totalReviews: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  reviews,
  overallRating,
  totalReviews,
}) => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      {/* Heading */}
      <h3 className="text-center text-4xl text-[#653f1b] mb-6 font-[family-name:var(--font-optima)]">
        Customer Reviews
      </h3>
      <div className="border-t border-gray-300 mb-10" />

      {/* Summary Row */}
      <div className="flex flex-col md:flex-row items-center justify-center md:space-x-30 gap-6 mb-12">
        {/* Rating Summary */}
        <div className="flex flex-col items-center md:border-r md:px-20 border-gray-300">
          <StarRating rating={Math.round(overallRating)} />
          <p className="text-lg mt-2">
            Based on {totalReviews} Reviews
          </p>
        </div>

        {/* Write Review Button */}
        <button className="bg-black text-white px-10 py-3 text-sm tracking-widest hover:bg-gray-900 transition cursor-pointer">
          WRITE A REVIEW
        </button>
      </div>

      <div className="border-t border-gray-300 mb-12" />

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {reviews.map((review, i) => (
          <div key={i}>
            {/* User + Rating */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center text-sm font-semibold">
                {review.user.charAt(0)}
              </div>
              <span className="text-sm font-medium">{review.user}</span>
            </div>

            <StarRating rating={review.rating} />

            {/* Comment */}
            <p className="text-md mt-3 leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductReviews;