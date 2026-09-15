"use client";
import React, { useState } from "react";
import { FaStar, FaPaperPlane, FaUser, FaQuoteLeft, FaCircleCheck } from "react-icons/fa6";
import toast from "react-hot-toast";

export default function RecipeReviewSection({ recipeId, reviews = [], ratings = 5.0, reviewCount = 0, currentUser, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || !currentUser.email) {
      return toast.error("Please login first to submit a review!");
    }

    if (!comment || !comment.trim()) {
      return toast.error("Please enter a review comment.");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${SERVER_URL}/recipes/${recipeId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
          userName: currentUser.name || currentUser.email.split("@")[0],
          userEmail: currentUser.email,
          userImage: currentUser.image || "",
        }),
      });

      const json = await response.json();

      if (json.success) {
        toast.success(json.message || "Review submitted successfully!");
        setComment("");
        if (onReviewAdded && json.data) {
          onReviewAdded(json.data);
        }
      } else {
        toast.error(json.message || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error("Connection error while submitting review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-base-200/40 p-8 rounded-3xl border border-base-300/40 space-y-8 shadow-sm">
      
      {/* Header & Overall Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-300/60 pb-6">
        <div>
          <h3 className="text-2xl font-black text-base-content tracking-tight">
            Community Reviews & Ratings
          </h3>
          <p className="text-xs text-base-content/60 mt-1">
            Real feedback from home cooks and food enthusiasts.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-base-100 px-5 py-3 rounded-2xl border border-base-300/50 w-fit">
          <div className="text-3xl font-black text-amber-500 flex items-center gap-1">
            <span>{ratings ? Number(ratings).toFixed(1) : "5.0"}</span>
            <FaStar className="w-5 h-5 fill-current" />
          </div>
          <div className="border-l border-base-300 pl-3">
            <span className="text-xs font-bold block">{reviewCount || reviews.length || 0} Reviews</span>
            <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider block">Global Verified</span>
          </div>
        </div>
      </div>

      {/* Submit Review Form */}
      <div className="bg-base-100 p-6 rounded-2xl border border-base-300/60 space-y-4">
        <h4 className="font-bold text-base text-base-content flex items-center gap-2">
          <FaQuoteLeft className="text-primary text-xs" />
          <span>Write a Review</span>
        </h4>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Interactive Star Rating Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70 mr-2">Your Rating:</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                >
                  <FaStar
                    className={`${
                      (hoverRating || rating) >= star
                        ? "text-amber-400 fill-current drop-shadow-xs"
                        : "text-base-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-500 ml-2">
              {hoverRating || rating} / 5 Stars
            </span>
          </div>

          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              currentUser
                ? "Share your cooking experience, taste profile, adjustments, or tips..."
                : "Please login to write a review..."
            }
            disabled={!currentUser}
            required
            className="textarea textarea-bordered w-full rounded-2xl focus:textarea-primary text-sm font-medium leading-relaxed"
          ></textarea>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !currentUser}
              className="btn btn-primary rounded-xl font-bold text-white px-6 normal-case shadow-md gap-2"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <>
                  <FaPaperPlane className="text-xs" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="font-bold text-sm uppercase tracking-wider text-base-content/70">
          User Feedback ({reviews.length})
        </h4>

        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-base-100 rounded-2xl border border-dashed border-base-300 space-y-1">
            <p className="text-sm font-bold text-base-content/70">No reviews yet for this recipe.</p>
            <p className="text-xs text-base-content/50">Be the first to try it out and leave your rating!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="p-5 bg-base-100 rounded-2xl border border-base-300/50 space-y-2.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {rev.userImage ? (
                          <img src={rev.userImage} alt={rev.userName} />
                        ) : (
                          <FaUser className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-bold text-sm">{rev.userName}</h5>
                        <FaCircleCheck className="text-emerald-500 text-xs" title="Verified Cook" />
                      </div>
                      <span className="text-[10px] text-base-content/50 font-medium">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1 text-amber-400">
                    {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                      <FaStar key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-base-content/90 font-medium leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
