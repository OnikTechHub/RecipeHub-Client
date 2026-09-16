"use client";
import React, { useEffect, useState } from "react";
import { FaUtensils, FaClock, FaGlobe, FaTags } from "react-icons/fa";
import toast from "react-hot-toast";
import Link from "next/link";
import { HashLoader } from "react-spinners";
import { SERVER_URL } from "@/lib/apiConfig";

const FeaturedRecipes = () => {
    const [featuredRecipes, setFeaturedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${SERVER_URL}/featured-recipes?limit=8`);
                const data = await res.json();

                if (data.success && Array.isArray(data.data)) {
                    const featured = data.data.filter(recipe => recipe.isFeatured === true).slice(0, 8);
                    setFeaturedRecipes(featured);
                }
            } catch (error) {
                console.error("Error loading featured recipes:", error);
                toast.error("Failed to load spotlight recipes.");
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[300px] gap-3">
                <HashLoader color="#10b981" size={45} />
                <span className="text-xs text-base-content/60 font-medium">Loading featured recipes...</span>
            </div>
        );
    }

    return (
        <section className="py-12 bg-base-100 text-base-content transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="mb-10 border-b border-base-300 pb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                            Featured <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Recipes</span>
                        </h2>
                        <p className="mt-2 text-sm opacity-70 font-medium">
                            Handpicked culinary masterpieces, curated directly by our community leaders.
                        </p>
                    </div>
                </div>

                {/* Empty State */}
                {featuredRecipes.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-base-300 rounded-2xl bg-base-200/40">
                        <FaUtensils className="mx-auto text-3xl opacity-40 mb-3" />
                        <p className="opacity-50 font-bold text-sm">No featured recipes available at the moment.</p>
                    </div>
                ) : (
                    /* Recipe Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {featuredRecipes.map((recipe) => (

                            <Link
                                href={`/browse-recipes/${recipe._id}`}
                                key={recipe._id}
                                className="group bg-base-200/60 border border-base-300 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col backdrop-blur-sm cursor-pointer"
                            >
                                {/* Recipe Image Container */}
                                <div className="relative aspect-video w-full bg-base-300 overflow-hidden">
                                    {recipe.image ? (
                                        <img
                                            src={recipe.image}
                                            alt={recipe.recipeName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-base-300">
                                            <FaUtensils className="text-4xl opacity-20" />
                                        </div>
                                    )}
                                    {/* Top Right Badge */}
                                    <div className={`absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm text-white ${
                                      recipe.isPaid && Number(recipe.price || 0) > 0 ? "bg-amber-500" : "bg-emerald-500"
                                    }`}>
                                        {recipe.isPaid && Number(recipe.price || 0) > 0 ? "PREMIUM" : "FREE"}
                                    </div>
                                </div>

                                {/* Card Content Body */}
                                <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                                    <div>
                                        {/* 1. Recipe Name */}
                                        <h3 className="font-extrabold text-base text-base-content/90 group-hover:text-emerald-500 transition-colors duration-200 line-clamp-1">
                                            {recipe.recipeName}
                                        </h3>

                                        {/* 2. Category Details & Price */}
                                        <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                                            <div className="flex items-center gap-1.5 opacity-70">
                                              <FaTags className="text-emerald-500 text-[11px]" />
                                              <span className="truncate">
                                                  {Array.isArray(recipe.category) ? recipe.category[0] : recipe.category || "General"}
                                              </span>
                                            </div>

                                            <span className={`px-2 py-0.5 rounded-md font-black text-[11px] border ${
                                              recipe.isPaid && Number(recipe.price || 0) > 0
                                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                                : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                            }`}>
                                              {recipe.isPaid && Number(recipe.price || 0) > 0 ? `$${Number(recipe.price).toFixed(2)}` : "Free"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Dynamic Core Parameters Footer */}
                                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-base-300 text-[11px] font-bold opacity-80">
                                        {/* 3. Cuisine Parameter */}
                                        <div className="flex items-center gap-1.5 bg-base-300/40 px-2.5 py-1.5 rounded-lg border border-base-300/50">
                                            <FaGlobe className="text-teal-500 text-[12px] shrink-0" />
                                            <span className="truncate text-base-content/90">{recipe.cuisine || "Global"}</span>
                                        </div>

                                        {/* 4. Preparation Time Parameter */}
                                        <div className="flex items-center gap-1.5 bg-base-300/40 px-2.5 py-1.5 rounded-lg border border-base-300/50">
                                            <FaClock className="text-amber-500 text-[12px] shrink-0" />
                                            <span className="truncate text-base-content/90">{recipe.prepTime || recipe.preparationTime || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default FeaturedRecipes;