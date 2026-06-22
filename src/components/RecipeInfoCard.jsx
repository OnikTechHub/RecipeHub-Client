"use client";
import React from "react";
import { FaClock, FaStar, FaHeart, FaThumbsUp, FaFlag, FaCreditCard, FaLayerGroup, FaGlobe } from "react-icons/fa6";

const RecipeInfoCard = ({ recipe, onPurchase, onLike, onFavorite, onOpenReport }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-base-200/40 p-6 md:p-8 rounded-3xl border border-base-300/30">
            
            {/* Image */}
            <div className="md:col-span-5 h-64 md:h-80 rounded-2xl overflow-hidden shadow-md">
                <img 
                    src={recipe.recipeImage || recipe.image} 
                    alt={recipe.recipeName} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                />
            </div>

            {/* Details */}
            <div className="md:col-span-7 space-y-5">
                <div className="flex gap-2">
                    <span className="text-xs font-black uppercase tracking-wider bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                        {recipe.category}
                    </span>
                    {recipe.cuisineType && (
                        <span className="text-xs font-black uppercase tracking-wider bg-secondary/10 text-secondary px-3 py-1.5 rounded-full flex items-center gap-1">
                            <FaGlobe /> {recipe.cuisineType}
                        </span>
                    )}
                </div>

                <h1 className="text-2xl md:text-4xl font-black tracking-tight">{recipe.recipeName}</h1>

                {/* Badges */}
                <div className="flex flex-wrap gap-3 pt-1">
                    <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-xl border border-base-300/40 text-xs font-bold">
                        <FaClock className="text-primary" />
                        <span>Prep: {recipe.preparationTime || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-xl border border-base-300/40 text-xs font-bold text-secondary">
                        <FaLayerGroup />
                        <span>Difficulty: {recipe.difficultyLevel || "Easy"}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-xl border border-base-300/40 text-xs font-bold text-amber-500">
                        <FaStar />
                        <span>Rating: {recipe.ratings || 5.0}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-xl border border-base-300/40 text-xs font-bold text-primary">
                        <FaThumbsUp />
                        <span>Likes: {recipe.likesCount || recipe.likeCount || 0}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-3">
                    <button onClick={onPurchase} className="btn btn-primary rounded-xl font-bold text-white normal-case flex items-center gap-2 shadow-lg shadow-primary/20">
                        <FaCreditCard />
                        <span>Purchase Recipe (${recipe.price || 5})</span>
                    </button>

                    <button onClick={onLike} className="btn btn-outline btn-primary rounded-xl font-bold normal-case flex items-center gap-2">
                        <FaThumbsUp />
                        <span>Like</span>
                    </button>

                    <button onClick={onFavorite} className="btn btn-outline btn-secondary rounded-xl font-bold normal-case flex items-center gap-2">
                        <FaHeart />
                        <span>Favorite</span>
                    </button>

                    <button onClick={onOpenReport} className="btn btn-outline btn-error rounded-xl font-bold normal-case flex items-center gap-2">
                        <FaFlag />
                        <span>Report</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeInfoCard;