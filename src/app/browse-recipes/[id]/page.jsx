"use client";
import React, { useState, useEffect, use } from "react";
import { FaClock, FaStar, FaUtensils, FaBookmark } from "react-icons/fa6";

const RecipeDetailsPage = ({ params }) => {
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/recipes/${id}`);
                const json = await response.json();
                if (json.success) {
                    setRecipe(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch recipe details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchRecipeDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100 text-base-content">
                <p className="font-bold opacity-60">Recipe not found or server error.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 text-base-content py-12 px-4 md:px-8 transition-colors duration-300">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Top Hero Layout: Image & Quick Meta */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-base-200/40 p-6 md:p-8 rounded-3xl border border-base-300/30">
                    {/* Image */}
                    <div className="md:col-span-5 h-64 md:h-80 rounded-2xl overflow-hidden shadow-md bg-base-200">
                        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Quick Info */}
                    <div className="md:col-span-7 space-y-4">
                        <span className="text-xs font-black uppercase tracking-wider bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                            {recipe.category}
                        </span>
                        <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
                            {recipe.title}
                        </h1>

                        {/* Meta badges */}
                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-xl border border-base-300/40 text-xs font-bold">
                                <FaClock className="text-primary" />
                                <span>Cooking Time: {recipe.cookingTime}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-xl border border-base-300/40 text-xs font-bold text-amber-500">
                                <FaStar />
                                <span>Rating: {recipe.ratings}</span>
                            </div>
                        </div>

                        {/* Save Action Button */}
                        <button className="btn btn-primary rounded-xl font-bold text-white normal-case flex items-center gap-2 shadow-md shadow-primary/10 pt-1">
                            <FaBookmark />
                            <span>Book / Save Recipe</span>
                        </button>
                    </div>
                </div>

                {/* Bottom Detailed Info Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Ingredients Left Column */}
                    <div className="md:col-span-5 bg-base-200/30 p-6 rounded-2xl border border-base-300/40 h-fit">
                        <h3 className="text-lg font-black tracking-tight flex items-center gap-2 mb-4">
                            <FaUtensils className="text-primary text-sm" />
                            <span>Required Ingredients</span>
                        </h3>
                        <ul className="space-y-2.5">
                            {recipe.ingredients && recipe.ingredients.map((ingredient, i) => (
                                <li key={i} className="text-sm font-semibold opacity-80 flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                                    <span>{ingredient}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Description / Instructions Right Column */}
                    <div className="md:col-span-7 space-y-4">
                        <h3 className="text-lg font-black tracking-tight">Cooking Guidelines & Description</h3>
                        <p className="text-sm font-medium opacity-70 leading-relaxed text-justify">
                            {recipe.description || "No detailed instructions provided for this recipe yet. Follow general health standards and presentation tips to cook this beautiful meal."}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RecipeDetailsPage;