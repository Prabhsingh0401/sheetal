"use client";

import React, { useState, useEffect } from "react";
import StarRating from "./StarRating";
import { checkCanReview, addReview, fetchProductReviews } from "../../services/productService";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export interface Review {
  _id: string;
  user:
  | {
    _id: string;
    name: string;
    profileImage?: string;
  }
  | string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

interface ProductReviewsProps {
  productId: string;
  initialReviews: Review[];
  overallRating: number;
  totalReviews: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  initialReviews,
  overallRating,
  totalReviews: initialTotal,
}) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [totalReviews, setTotalReviews] = useState(initialTotal);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewReason, setReviewReason] = useState<string | null>(null);
  const [loadingCanReview, setLoadingCanReview] = useState(true);

  // Check eligibility on mount if logged in
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setLoadingCanReview(false);
      return;
    }

    const checkEligibility = async () => {
      try {
        const res = await checkCanReview(productId);
        console.log("Review eligibility check result:", res);
        if (res.success) {
          setCanReview(res.data.canReview);
          setReviewReason(res.data.reason);
        }
      } catch (err) {
        console.error("Eligibility check failed", err);
      } finally {
        setLoadingCanReview(false);
      }
    };

    checkEligibility();
  }, [productId]);

  // Sync initial reviews if they change (e.g. parent fetch)
  useEffect(() => {
    setReviews(initialReviews);
    setTotalReviews(initialTotal);
  }, [initialReviews, initialTotal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setSubmitting(true);
    try {
      const res = await addReview(productId, rating, comment);
      if (res.success) {
        toast.success("Review submitted! It will appear after admin approval.");
        setShowForm(false);
        setRating(0);
        setComment("");
        setCanReview(false); // Can't review twice

        // Refresh reviews list
        const refreshed = await fetchProductReviews(productId);
        if (refreshed.success) {
          setReviews(refreshed.data);
          setTotalReviews(refreshed.data.length);
        }
      } else {
        toast.error(res.message || "Failed to submit review");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      {/* Heading */}
      <h3 className="text-center text-4xl text-[#653f1b] mb-6 font-[family-name:var(--font-optima)]">
        Customer Reviews
      </h3>
      <div className="border-t border-gray-300 mb-10" />

      {/* Summary Row */}
      <div className="flex flex-col md:flex-row items-center justify-center md:space-x-32 gap-6 mb-12">
        {/* Rating Summary */}
        <div className="flex flex-col items-center md:border-r md:px-20 border-gray-300">
          <StarRating rating={Math.round(overallRating)} />
          <p className="text-lg mt-2">Based on {totalReviews} Reviews</p>
        </div>

        {/* Write Review Area */}
        <div className="md:w-auto overflow-hidden">
          {!showForm ? (
            <div className="text-center">
              {loadingCanReview ? (
                <div className="h-12 w-40 bg-gray-100 animate-pulse" />
              ) : canReview ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-black text-white px-10 py-3 text-sm tracking-widest hover:bg-gray-900 transition cursor-pointer"
                >
                  WRITE A REVIEW
                </button>
              ) : (
                <div className="text-sm text-gray-500 italic max-w-xs">
                  {!Cookies.get("token") ? (
                    <p>Please log in to write a review.</p>
                  ) : reviewReason === "Already reviewed" ? (
                    <p>You have already reviewed this product.</p>
                  ) : (
                    <p>Only customers who have received this product (Delivered) can write a review.</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="transition-all duration-500 ease-out max-h-[600px] opacity-100">
              {/* Review Form */}
              <form
                onSubmit={handleSubmit}
                className="border border-gray-200 p-6 relative flex flex-col items-center bg-white shadow-sm rounded-lg w-full md:w-96"
              >
                <div className="mb-4 flex justify-between items-center border-b pb-4 w-full">
                  <h4 className="text-lg font-medium">Write a review</h4>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-2xl text-gray-400 hover:text-black transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-6 flex flex-col items-center gap-2 w-full">
                  <p className="text-sm text-gray-600 font-medium">Your Rating</p>
                  <StarRating rating={rating} onRatingChange={setRating} />
                </div>

                <textarea
                  placeholder="Share your thoughts about the product..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-6 focus:ring-1 focus:ring-black focus:border-black outline-none resize-none transition-all text-sm"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full border border-black px-10 py-2.5 text-sm font-semibold transition-all ${submitting
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "hover:bg-black hover:text-white cursor-pointer"
                    }`}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-300 mb-12" />

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {reviews.length > 0 ? (
          reviews.map((review) => {
            const userName = review.userName || (typeof review.user === "object" ? review.user.name : "Customer");
            const userInitial = userName.charAt(0);

            return (
              <div key={review._id} className="pb-8 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 uppercase">
                    {userInitial}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">{userName}</span>
                    {review.createdAt && (
                      <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                        {new Date(review.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>

                <StarRating rating={review.rating} />

                <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center col-span-2 py-10">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </div>
    </section>
  );
};

export default ProductReviews;
