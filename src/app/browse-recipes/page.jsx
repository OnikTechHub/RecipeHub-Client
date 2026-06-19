"use client";
import React, { useState, useEffect } from "react";
import { FaMagnifyingGlass, FaSliders, FaClock, FaStar, FaLayerGroup } from "react-icons/fa6";
import Link from "next/link";

const BrowseRecipesPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Breakfast", "Lunch", "Dinner", "Desserts"];

    useEffect(() => {
        const fetchLiveRecipes = async () => {
            try {
                setLoading(true);
                
                const categoryParam = selectedCategory === "All" ? "" : selectedCategory;

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/recipes?search=${searchQuery}&category=${categoryParam}`
                );
                const json = await response.json();
                if (json.success) {
                    setRecipes(json.data);
                }
            } catch (error) {
                console.error("Express API connection failed:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLiveRecipes();
    }, [searchQuery, selectedCategory]);

    return (
        <div className="min-h-screen bg-base-100 py-8 px-4 md:px-8 text-base-content transition-colors duration-300">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 bg-base-200/40 p-6 rounded-3xl border border-base-300/30">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight">Discover Recipes</h1>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-80 group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/40">
                            <FaMagnifyingGlass className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search Recipes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-11 pr-4 bg-base-100 rounded-xl border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                        />
                    </div>
                </div>

                {/* Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Categories Sidebar */}
                    <div className="lg:col-span-3">
                        <div className="p-5 bg-base-200/50 rounded-2xl border border-base-300/40 sticky top-24">
                            <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider mb-4 pb-2 border-b border-base-300/60">
                                <FaSliders className="text-primary text-xs" />
                                <span>Categories</span>
                            </div>
                            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2.5 rounded-xl font-bold text-xs text-left transition-all whitespace-nowrap lg:whitespace-normal ${selectedCategory === category
                                            ? "bg-primary text-white shadow-md shadow-primary/20"
                                            : "bg-base-100 hover:bg-base-300/70 border border-base-300/30"
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recipe Live Feed */}
                    <div className="lg:col-span-9">
                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : recipes.length === 0 ? (
                            <div className="text-center py-12 bg-base-200/20 rounded-2xl border border-dashed border-base-300">
                                <p className="text-sm font-medium opacity-60">No Recipes found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recipes.map((recipe) => (
                                    <div key={recipe._id} className="bg-base-100 rounded-2xl border border-base-300/40 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col">

                                        {/* Image Section */}
                                        <div className="relative h-48 overflow-hidden bg-base-200">
                                            <img
                                                src={recipe.image}
                                                alt={recipe.recipeName} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* Category Tag */}
                                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-base-100/80 backdrop-blur-md text-primary">
                                                {recipe.category}
                                            </span>

                                            {/* Difficulty Level Tag */}
                                            {recipe.difficultyLevel && (
                                                <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider text-white ${recipe.difficultyLevel === "Easy" ? "bg-success/90" :
                                                    recipe.difficultyLevel === "Medium" ? "bg-warning/90 text-base-content" : "bg-error/90"
                                                    }`}>
                                                    {recipe.difficultyLevel}
                                                </span>
                                            )}
                                        </div>

                                        {/* Card Body Info */}
                                        <div className="p-5 flex flex-col flex-grow justify-between">
                                            <div>
                                                {/* Meta Info: Time and Ratings */}
                                                <div className="flex items-center gap-3 text-xs opacity-60 mb-2 font-medium">
                                                    <span className="flex items-center gap-1">
                                                        <FaClock className="text-[10px]" />
                                                        {recipe.preparationTime || "N/A"} {/* preparationTime */}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-amber-500">
                                                        <FaStar className="text-[10px]" />
                                                        {recipe.ratings || 5.0}
                                                    </span>
                                                </div>

                                                {/* Recipe Name Heading */}
                                                <h3 className="font-bold text-base text-base-content tracking-tight line-clamp-2 mb-4 group-hover:text-primary transition-colors">
                                                    {recipe.recipeName} {/* recipeName */}
                                                </h3>
                                            </div>

                                            {/* Action Button */}
                                            <Link
                                                href={`/browse-recipes/${recipe._id}`}
                                                className="btn btn-primary btn-md w-full rounded-2xl font-bold text-white normal-case"
                                            >
                                                View Details
                                            </Link>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BrowseRecipesPage;