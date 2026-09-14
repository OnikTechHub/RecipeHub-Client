"use client";
import React from "react";
import {
  FaClock,
  FaStar,
  FaHeart,
  FaThumbsUp,
  FaFlag,
  FaCreditCard,
  FaLayerGroup,
  FaGlobe,
  FaCrown,
  FaLockOpen,
  FaLock,
  FaCartPlus,
} from "react-icons/fa6";

const RecipeInfoCard = ({
  recipe,
  hasAccess = false,
  accessReason = "free",
  isLiked = false,
  onPurchase,
  onAddToCart,
  onLike,
  onFavorite,
  onOpenReport,
}) => {
  const isPaid = recipe.isPaid && Number(recipe.price || 0) > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-base-200/40 p-6 md:p-8 rounded-3xl border border-base-300/40 shadow-sm">
      {/* Image */}
      <div className="md:col-span-5 h-64 md:h-84 rounded-2xl overflow-hidden shadow-lg relative group">
        <img
          src={recipe.recipeImage || recipe.image}
          alt={recipe.recipeName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Pricing Badge */}
        {isPaid ? (
          <span className="absolute top-4 right-4 px-3 py-1.5 rounded-xl text-xs font-black uppercase bg-amber-500 text-white shadow-lg flex items-center gap-1.5 tracking-wider backdrop-blur-md">
            <FaCrown className="text-xs" /> Premium • ${Number(recipe.price).toFixed(2)}
          </span>
        ) : (
          <span className="absolute top-4 right-4 px-3 py-1.5 rounded-xl text-xs font-black uppercase bg-emerald-500 text-white shadow-lg tracking-wider">
            Free Recipe
          </span>
        )}
      </div>

      {/* Details */}
      <div className="md:col-span-7 space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
            {Array.isArray(recipe.category) ? recipe.category.join(", ") : recipe.category || "General"}
          </span>
          {recipe.cuisineType && (
            <span className="text-xs font-black uppercase tracking-wider bg-secondary/10 text-secondary px-3 py-1.5 rounded-full border border-secondary/20 flex items-center gap-1.5">
              <FaGlobe className="text-[11px]" /> {recipe.cuisineType}
            </span>
          )}
          {isPaid && (
            <span
              className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                hasAccess
                  ? "bg-success/10 text-success border border-success/20"
                  : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
              }`}
            >
              {hasAccess ? (
                <>
                  <FaLockOpen className="text-[10px]" />{" "}
                  {accessReason === "author"
                    ? "Author Access"
                    : accessReason === "purchased"
                    ? "Lifetime Unlocked"
                    : "Full Access"}
                </>
              ) : (
                <>
                  <FaLock className="text-[10px]" /> Protected Recipe
                </>
              )}
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-base-content">
          {recipe.recipeName}
        </h1>

        {/* Creator Info */}
        <div className="flex items-center gap-2 text-xs text-base-content/70 font-semibold">
          <span>Created by</span>
          <span className="font-black text-base-content">
            {recipe.authorName || recipe.authorEmail || "RecipeHub Chef"}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          <div className="flex items-center gap-2 bg-base-100 px-3.5 py-2 rounded-xl border border-base-300/50 text-xs font-bold shadow-xs">
            <FaClock className="text-primary" />
            <span>Prep: {recipe.preparationTime || recipe.prepTime || "25 mins"}</span>
          </div>
          <div className="flex items-center gap-2 bg-base-100 px-3.5 py-2 rounded-xl border border-base-300/50 text-xs font-bold text-secondary shadow-xs">
            <FaLayerGroup />
            <span>{recipe.difficultyLevel || "Medium"}</span>
          </div>
          <div className="flex items-center gap-2 bg-base-100 px-3.5 py-2 rounded-xl border border-base-300/50 text-xs font-bold text-amber-500 shadow-xs">
            <FaStar />
            <span>{recipe.ratings || 5.0}</span>
          </div>
          <div className="flex items-center gap-2 bg-base-100 px-3.5 py-2 rounded-xl border border-base-300/50 text-xs font-bold text-primary shadow-xs">
            <FaThumbsUp />
            <span>{recipe.likesCount || 0} Likes</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-3">
          {isPaid && !hasAccess ? (
            <>
              <button
                onClick={onPurchase}
                className="btn btn-primary rounded-xl font-bold text-white normal-case flex items-center gap-2 shadow-lg shadow-primary/25 hover:scale-102 transition-transform"
              >
                <FaCreditCard className="text-sm" />
                <span>Unlock Secret Recipe (${Number(recipe.price || 5).toFixed(2)})</span>
              </button>

              {onAddToCart && (
                <button
                  onClick={onAddToCart}
                  className="btn btn-outline btn-primary rounded-xl font-bold normal-case flex items-center gap-2 hover:scale-102 transition-transform"
                >
                  <FaCartPlus className="text-sm" />
                  <span>Add to Cart</span>
                </button>
              )}
            </>
          ) : (
            <a
              href="#recipe-content"
              className="btn btn-primary btn-outline rounded-xl font-bold normal-case flex items-center gap-2"
            >
              <FaLockOpen className="text-sm" />
              <span>View Recipe Steps</span>
            </a>
          )}

          <button
            onClick={onLike}
            className={`btn rounded-xl font-bold normal-case flex items-center gap-2 transition-all ${
              isLiked
                ? "btn-primary text-white shadow-md shadow-primary/20"
                : "btn-outline btn-primary"
            }`}
          >
            <FaThumbsUp className={isLiked ? "scale-110" : ""} />
            <span>{isLiked ? "Liked" : "Like"}</span>
          </button>

          <button
            onClick={onFavorite}
            className="btn btn-outline btn-secondary rounded-xl font-bold normal-case flex items-center gap-2 hover:scale-102 transition-transform"
          >
            <FaHeart />
            <span>Favorite</span>
          </button>

          <button
            onClick={onOpenReport}
            className="btn btn-ghost hover:bg-error/10 text-error rounded-xl font-bold normal-case flex items-center gap-2"
          >
            <FaFlag />
            <span>Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeInfoCard;