"use client";
import React, { useEffect, useState } from "react";
import { FaUtensils, FaClock, FaGlobe, FaTags } from "react-icons/fa";
import toast from "react-hot-toast";
import Link from "next/link";
const FeaturedRecipes = () => {
    const [featuredRecipes, setFeaturedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/featured-recipes`);
                const data = await res.json();

                if (data.success) {
                    const featured = data.data.filter(recipe => recipe.isFeatured === true);
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
            <div className="flex justify-center items-center min-h-[300px]">
                <span className="loading loading-spinner loading-lg text-emerald-500"></span>
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
                                    {/* Featured Badge Overlay */}
                                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                                        Featured
                                    </div>
                                </div>

                                {/* Card Content Body */}
                                <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                                    <div>
                                        {/* 1. Recipe Name */}
                                        <h3 className="font-extrabold text-base text-base-content/90 group-hover:text-emerald-500 transition-colors duration-200 line-clamp-1">
                                            {recipe.recipeName}
                                        </h3>

                                        {/* 2. Category Details */}
                                        <div className="mt-3 flex items-center gap-2 text-xs opacity-70 font-semibold">
                                            <FaTags className="text-emerald-500 text-[11px]" />
                                            <span className="truncate">
                                                {Array.isArray(recipe.category) ? recipe.category.join(", ") : recipe.category || "General"}
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
                                            <span className="truncate text-base-content/90">{recipe.prepTime || "N/A"}</span>
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