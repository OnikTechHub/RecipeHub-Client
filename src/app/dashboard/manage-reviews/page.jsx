"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";
import {
  FaStar,
  FaUtensils,
  FaUser,
  FaCircleCheck,
  FaMagnifyingGlass,
  FaFilter,
  FaCrown,
  FaQuoteLeft,
} from "react-icons/fa6";
import { HashLoader } from "react-spinners";
import { SERVER_URL } from "@/lib/apiConfig";

export default function ManageReviewsPage() {
  const { data: session, isPending } = authClient.useSession();
  const currentUser = session?.user;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [togglingId, setTogglingId] = useState(null);

  const fetchAdminReviews = async () => {
    if (!currentUser?.email) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${SERVER_URL}/api/admin/reviews?email=${encodeURIComponent(currentUser.email)}`
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setReviews(data.data);
      } else {
        toast.error(data.message || "Failed to load customer reviews.");
      }
    } catch (err) {
      console.error("Error loading admin reviews:", err);
      toast.error("Network error fetching reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.email) {
      fetchAdminReviews();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [currentUser?.email, isPending]);

  const handleToggleFeature = async (recipeId, reviewId, userEmail, currentFeaturedStatus) => {
    if (!currentUser?.email) return;

    const newStatus = !currentFeaturedStatus;
    const targetKey = reviewId || userEmail;
    setTogglingId(targetKey);

    try {
      const res = await fetch(`${SERVER_URL}/api/admin/reviews/toggle-feature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId,
          reviewId,
          userEmail,
          isFeatured: newStatus,
          adminEmail: currentUser.email,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Update local state optimistically
        setReviews((prev) =>
          prev.map((r) => {
            const match =
              (reviewId && r.reviewId === reviewId) ||
              (r.recipeId === recipeId && r.userEmail === userEmail);
            if (match) {
              return { ...r, isFeatured: newStatus };
            }
            return r;
          })
        );

        if (newStatus) {
          toast.success("Review featured on Homepage!", { icon: "🌟" });
        } else {
          toast("Review removed from Homepage featured list.", { icon: "ℹ️" });
        }
      } else {
        toast.error(data.message || "Could not update review status.");
      }
    } catch (err) {
      console.error("Toggle feature error:", err);
      toast.error("Failed to connect to server.");
    } finally {
      setTogglingId(null);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      (r.userName && r.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.comment && r.comment.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.recipeName && r.recipeName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRating =
      filterRating === "all" ? true : Number(r.rating) === Number(filterRating);

    return matchesSearch && matchesRating;
  });

  const totalFeatured = reviews.filter((r) => r.isFeatured).length;
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
      : "5.0";

  if (isPending || loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <HashLoader color="#10b981" size={45} />
        <p className="text-xs font-semibold text-base-content/60">Loading Customer Testimonials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-center" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-300 pb-4">
        <div>
          <h1 className="text-2xl font-black text-base-content tracking-tight flex items-center gap-2">
            <FaStar className="text-amber-500" /> Manage Testimonials & Reviews
          </h1>
          <p className="text-xs text-base-content/60 font-medium mt-1">
            Moderate community recipe reviews and select top featured customer testimonials for the Homepage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge badge-warning gap-1 font-bold p-3 text-neutral">
            <FaCrown className="text-xs" /> Featured on Homepage: {totalFeatured}
          </span>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl font-black">
            <FaQuoteLeft />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60 block">
              Total Reviews
            </span>
            <span className="text-2xl font-black text-base-content">{reviews.length}</span>
          </div>
        </div>

        <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl font-black">
            <FaStar />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60 block">
              Average Platform Rating
            </span>
            <span className="text-2xl font-black text-base-content">{avgRating} / 5.0</span>
          </div>
        </div>

        <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl font-black">
            <FaCircleCheck />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60 block">
              Homepage Featured Cards
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {totalFeatured} Active
            </span>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-base-100 p-4 rounded-2xl border border-base-300/60 shadow-xs">
        <div className="relative w-full sm:w-72">
          <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-xs" />
          <input
            type="text"
            placeholder="Search by reviewer or comment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm input-bordered pl-9 w-full rounded-xl text-xs font-medium focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FaFilter className="text-xs text-base-content/50" />
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="select select-sm select-bordered rounded-xl text-xs font-bold"
          >
            <option value="all">All Rating Stars</option>
            <option value="5">5 Stars Only</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews Table / List */}
      {filteredReviews.length === 0 ? (
        <div className="p-12 text-center bg-base-200/40 rounded-3xl border border-dashed border-base-300 space-y-3">
          <FaQuoteLeft className="mx-auto text-3xl opacity-30 text-primary" />
          <h3 className="font-extrabold text-base text-base-content">No Reviews Found</h3>
          <p className="text-xs text-base-content/60 font-medium">
            {reviews.length === 0
              ? "No customer recipe reviews have been submitted on the platform yet."
              : "No reviews match your search filter."}
          </p>
        </div>
      ) : (
        <div className="bg-base-100 rounded-3xl border border-base-300/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead>
                <tr className="bg-base-200/80 border-b border-base-300 text-base-content/70">
                  <th className="py-3.5 px-4 font-bold">Reviewer & User Info</th>
                  <th className="py-3.5 px-4 font-bold">Recipe</th>
                  <th className="py-3.5 px-4 font-bold">Rating</th>
                  <th className="py-3.5 px-4 font-bold">Comment / Testimonial</th>
                  <th className="py-3.5 px-4 font-bold text-center">Homepage Featured</th>
                  <th className="py-3.5 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {filteredReviews.map((r, idx) => {
                  const isToggling = togglingId === (r.reviewId || r.userEmail);
                  return (
                    <tr key={idx} className="hover:bg-base-200/40 transition-colors">
                      {/* Reviewer Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={r.userImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(r.userName || "Foodie")}
                            alt={r.userName}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
                          />
                          <div className="truncate">
                            <span className="font-bold block truncate text-base-content">
                              {r.userName}
                            </span>
                            <span className="text-[10px] opacity-60 font-medium block truncate">
                              {r.userEmail}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Recipe Name */}
                      <td className="py-4 px-4 font-semibold text-base-content/90 max-w-[150px] truncate">
                        <div className="flex items-center gap-1.5 truncate">
                          <FaUtensils className="text-primary shrink-0 text-[10px]" />
                          <span className="truncate">{r.recipeName}</span>
                        </div>
                      </td>

                      {/* Rating Stars */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          {[...Array(Number(r.rating) || 5)].map((_, i) => (
                            <FaStar key={i} className="text-xs" />
                          ))}
                          <span className="text-[11px] text-base-content/70 ml-1">
                            ({r.rating})
                          </span>
                        </div>
                      </td>

                      {/* Comment */}
                      <td className="py-4 px-4 max-w-xs">
                        <p className="line-clamp-2 text-xs opacity-90 leading-relaxed font-medium italic">
                          "{r.comment}"
                        </p>
                      </td>

                      {/* Homepage Featured Badge */}
                      <td className="py-4 px-4 text-center">
                        {r.isFeatured ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                            <FaCircleCheck className="text-[10px]" /> Featured
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-base-300/50 text-base-content/50 text-[10px] font-bold uppercase tracking-wider">
                            Standard
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleToggleFeature(r.recipeId, r.reviewId, r.userEmail, r.isFeatured)}
                          disabled={isToggling}
                          className={`btn btn-xs rounded-xl font-bold normal-case gap-1 shadow-xs ${
                            r.isFeatured
                              ? "btn-outline btn-error hover:bg-error hover:text-white"
                              : "btn-primary text-white shadow-primary/20"
                          }`}
                        >
                          {isToggling ? (
                            <HashLoader color="#ffffff" size={12} />
                          ) : r.isFeatured ? (
                            "Unfeature"
                          ) : (
                            <>
                              <FaStar className="text-[10px] text-amber-300" />
                              <span>Feature on Homepage</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
