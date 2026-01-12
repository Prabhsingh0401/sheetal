import React from 'react';
import StarRating from './StarRating';

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

const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews, overallRating, totalReviews }) => {
  return (
    <div className="container mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-center mb-10 font-[family-name:var(--font-optima)]">Customer Reviews</h3>
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
            <div className="md:w-1/3 text-center border-r border-gray-200 pr-8">
                <div className="text-5xl font-bold text-[#bd9951] mb-2">{overallRating}</div>
                <div className="flex justify-center mb-2"><StarRating rating={Math.round(overallRating)} /></div>
                <p className="text-gray-500">Based on {totalReviews} Reviews</p>
                <button className="mt-6 px-6 py-2 border border-gray-300 text-gray-700 hover:border-[#bd9951] hover:text-[#bd9951] transition-colors rounded">
                    Write a Review
                </button>
            </div>
            <div className="md:w-2/3">
                {reviews.map((review, i) => (
                    <div key={i} className="mb-6 pb-6 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                              {review.user.charAt(0)}
                           </div>
                           <div>
                               <h5 className="font-bold text-sm">{review.user}</h5>
                               <StarRating rating={review.rating} />
                           </div>
                        </div>
                        <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default ProductReviews;
