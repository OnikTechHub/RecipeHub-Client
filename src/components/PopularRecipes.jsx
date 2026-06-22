"use client";
import React, { useEffect, useState } from "react";
import { FaUtensils, FaHeart, FaUser, FaFire } from "react-icons/fa";
import toast from "react-hot-toast";
import Link from "next/link"; 

const PopularRecipes = () => {
    const [popularRecipes, setPopularRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/recipes`);
                const data = await res.json();

                if (data.success) {
                   
                    const sorted = [...data.data].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
                    setPopularRecipes(sorted.slice(0, 4));
                }
            } catch (error) {
                console.error("Error loading popular recipes:", error);
                toast.error("Failed to load trending recipes.");
            } finally {
                setLoading(false);
            }
        };

        fetchPopular();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <span className="loading loading-spinner loading-lg text-rose-500"></span>
            </div>
        );
    }

    return (
        <section className="py-12 bg-base-100 text-base-content transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="mb-10 border-b border-base-300 pb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl flex items-center gap-2">
                            Popular <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">Recipes</span>
                            <FaFire className="text-orange-500 text-2xl animate-pulse" />
                        </h2>
                        <p className="mt-2 text-sm opacity-70 font-medium">
                            The most loved and highly-rated recipes voted by our massive culinary community.
                        </p>
                    </div>
                </div>

                {/* Grid */}
                {popularRecipes.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-base-300 rounded-2xl bg-base-200/40">
                        <FaUtensils className="mx-auto text-3xl opacity-40 mb-3" />
                        <p className="opacity-50 font-bold text-sm">No popular recipes found yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {popularRecipes.map((recipe) => (
                            
                            
                            <Link
                                href={`/browse-recipes/${recipe._id}`}
                                key={recipe._id}
                                className="group bg-base-200/60 border border-base-300 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-rose-500/30 transition-all duration-300 flex flex-col backdrop-blur-sm cursor-pointer"
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
                                    <div className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                                        <FaHeart className="text-[9px]" /> Trending
                                    </div>
                                </div>

                                {/* Card Content Body */}
                                <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                                    <div className="space-y-2">
                                        {/* 1. Recipe Name */}
                                        <h3 className="font-extrabold text-base text-base-content/90 group-hover:text-rose-500 transition-colors duration-200 line-clamp-1">
                                            {recipe.recipeName}
                                        </h3>

                                        {/* 2. Author Name */}
                                        <div className="flex items-center gap-2 text-xs opacity-70 font-semibold pt-1">
                                            <FaUser className="text-rose-500/80 text-[11px]" />
                                            <span className="truncate">By {recipe.authorName || "Anonymous"}</span>
                                        </div>
                                    </div>

                                    {/* Footer Parameter Block */}
                                    <div className="pt-3 border-t border-base-300">
                                        {/* 3. Likes Count */}
                                        <div className="flex items-center justify-between bg-base-300/40 px-3 py-2 rounded-xl border border-base-300/50">
                                            <span className="text-[11px] font-bold opacity-60 uppercase tracking-wider">Community Likes</span>
                                            <div className="flex items-center gap-1.5 text-xs font-black text-rose-500">
                                                <FaHeart className="animate-bounce" />
                                                <span>{recipe.likesCount || 0} Likes</span>
                                            </div>
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

export default PopularRecipes;