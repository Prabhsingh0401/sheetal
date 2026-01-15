import React, { useState } from "react";
import StarRating from "./StarRating";

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    profileImage?: string;
  } | string;
  rating: number;
  comment: string;
  createdAt?: string;
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
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);

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

        {/* Write Review Area */}
        <div className=" md:w-auto overflow-hidden">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="bg-black text-white px-10 py-3 text-sm tracking-widest hover:bg-gray-900 transition cursor-pointer"
            >
              WRITE A REVIEW
            </button>
          ) : (
            <div
              className="
                transition-all duration-500 ease-out
                max-h-[500px] opacity-100 translate-y-0
              "
            >
              {/* Review Form */}
              <div className="border border-gray-300 p-4 relative flex flex-col justify-between w-100 items-center">
                <div className="mb-4 flex justify-between items-center border-b pb-4 w-full">
                <h4 className="text-lg">Write a review</h4>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-3xl text-gray-500 hover:text-black"
                >
                  ×
                </button>
                </div>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full border border-dashed border-gray-300 rounded-full px-4 py-2 mb-4 focus:outline-none"
                />
 
                <div className="mb-4 flex justify-between w-full">
                  <p className="text-sm mb-1">Rating(s):</p>
                  <StarRating rating={rating} /> 
                  {/* Note: StarRating component needs to support onChange if we want to setRating interactively, 
                      or we use a different input for rating in form. 
                      For now restoring UI as it was. */}
                </div>

                <textarea
                  placeholder="Write your comment"
                  className="w-full border border-dashed border-gray-300 rounded-xl px-4 py-3 mb-6 focus:outline-none resize-none"
                  rows={4}
                />

                <button className="border border-black px-10 py-2 text-sm hover:bg-black hover:text-white transition">
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-300 mb-12" />

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {reviews.length > 0 ? (
           reviews.map((review, i) => {
             const userName = typeof review.user === 'object' ? review.user.name : 'Anonymous';
             const userInitial = userName.charAt(0);
             
             return (
              <div key={i}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center text-sm font-semibold uppercase">
                    {userInitial}
                  </div>
                  <span className="text-sm font-medium">{userName}</span>
                </div>

                <StarRating rating={review.rating} />

                <p className="text-md mt-3 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            );
          })
        ) : (
            <p className="text-gray-500 text-center col-span-2">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </section>
  );
};

export default ProductReviews;
