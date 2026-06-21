"use client";
import React, { useState, useEffect, use } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { FaClock, FaStar, FaUtensils, FaHeart, FaThumbsUp, FaFlag, FaCreditCard, FaLayerGroup, FaGlobe } from "react-icons/fa6";
import { Toaster, toast } from "react-hot-toast";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "");

const RecipeDetailsPage = ({ params }) => {
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [submittingReport, setSubmittingReport] = useState(false);

    const currentUserEmail = recipe?.authorEmail || "testuser@gmail.com";

    // Fetch recipe details from DB
    const fetchRecipeDetails = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/recipes/${id}`);
            const json = await response.json();
            if (json.success) {
                setRecipe(json.data);
            }
        } catch (error) {
            console.error("Error fetching recipe:", error);
            toast.error("Failed to load recipe details!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchRecipeDetails();
    }, [id]);

    // Stripe Payment Integration
    const handlePurchase = async () => {
        if (!recipe) return toast.error("Recipe data not loaded yet!");

        const toastId = toast.loading("Redirecting to Stripe Checkout...");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipeId: recipe._id,
                    title: recipe.recipeName,
                    image: recipe.recipeImage || recipe.image,
                    price: recipe.price ? Number(recipe.price) : 5,
                    userEmail: currentUserEmail
                })
            });

            const session = await res.json();

            if (session.success && session.url) {
                toast.dismiss(toastId);
                window.location.href = session.url;
            } else {
                toast.dismiss(toastId);
                toast.error(session.message || "Stripe session creation failed!");
            }
        } catch (error) {
            toast.dismiss(toastId);
            console.error("Purchase error:", error);
            toast.error("Payment integration error!");
        }
    };

    // Like Button Integration
    const handleLike = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/recipes/${id}/like`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();

            if (data.success) {
                setRecipe(prev => ({ ...prev, likesCount: (prev.likesCount || 0) + 1 }));
                toast.success("Recipe Liked! ");
            }
        } catch (error) {
            console.error("Like error:", error);
            toast.error("Could not complete the action.");
        }
    };

    // Favorite Button Integration
    const handleAddToFavorite = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/favorites`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recipeId: recipe._id, userEmail: currentUserEmail })
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Added to your Favorite Recipes! ❤️");
            } else {
                toast.error(data.message || "Already in favorites!");
            }
        } catch (error) {
            console.error("Favorite error:", error);
            toast.error("Failed to add to favorites.");
        }
    };

    // Report Button Integration
    const handleReportSubmit = async (e) => {
        e.preventDefault();
        if (!reportReason.trim()) return toast.error("Please enter a reason!");

        setSubmittingReport(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/reports`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipeId: recipe._id,
                    reporterEmail: currentUserEmail,
                    reason: reportReason
                })
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Recipe reported successfully. Team will review it. ");
                setIsReportModalOpen(false);
                setReportReason("");
            }
        } catch (error) {
            console.error("Report error:", error);
            toast.error("Failed to submit report.");
        } finally {
            setSubmittingReport(false);
        }
    };

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
                <p className="font-bold opacity-60">Recipe not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 text-base-content py-12 px-4 md:px-8">
            <Toaster position="top-center" />

            <div className="max-w-5xl mx-auto space-y-8">

                {/* Main Content Card */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-base-200/40 p-6 md:p-8 rounded-3xl border border-base-300/30">

                    {/* Recipe Image */}
                    <div className="md:col-span-5 h-64 md:h-80 rounded-2xl overflow-hidden shadow-md">
                        <img src={recipe.recipeImage || recipe.image} alt={recipe.recipeName} className="w-full h-full object-cover" />
                    </div>

                    {/* Info Details */}
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

                        {/* Recipe Name */}
                        <h1 className="text-2xl md:text-4xl font-black tracking-tight">{recipe.recipeName}</h1>

                        {/* Meta Info Badges */}
                        <div className="flex flex-wrap gap-4 pt-1">
                            {/* Preparation Time */}
                            <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-xl border border-base-300/40 text-xs font-bold">
                                <FaClock className="text-primary" />
                                <span>Prep Time: {recipe.preparationTime || "N/A"}</span>
                            </div>
                            {/* Difficulty Level */}
                            <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-xl border border-base-300/40 text-xs font-bold text-secondary">
                                <FaLayerGroup />
                                <span>Difficulty: {recipe.difficultyLevel || "Easy"}</span>
                            </div>
                            {/* Rating */}
                            <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-xl border border-base-300/40 text-xs font-bold text-amber-500">
                                <FaStar />
                                <span>Rating: {recipe.ratings || 5.0}</span>
                            </div>
                            {/* Likes Counter */}
                            <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-xl border border-base-300/40 text-xs font-bold text-primary">
                                <FaThumbsUp />
                                <span>Likes: {recipe.likesCount || recipe.likeCount || 0}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 pt-3">
                            <button onClick={handlePurchase} className="btn btn-primary rounded-xl font-bold text-white normal-case flex items-center gap-2">
                                <FaCreditCard />
                                <span>Purchase Recipe (${recipe.price || 5})</span>
                            </button>

                            <button onClick={handleLike} className="btn btn-outline btn-primary rounded-xl font-bold normal-case flex items-center gap-2">
                                <FaThumbsUp />
                                <span>Like</span>
                            </button>

                            <button onClick={handleAddToFavorite} className="btn btn-outline btn-secondary rounded-xl font-bold normal-case flex items-center gap-2">
                                <FaHeart />
                                <span>Favorite</span>
                            </button>

                            <button onClick={() => setIsReportModalOpen(true)} className="btn btn-outline btn-error rounded-xl font-bold normal-case flex items-center gap-2">
                                <FaFlag />
                                <span>Report</span>
                            </button>
                        </div>

                    </div>
                </div>

                {/* Ingredients & Instructions Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Ingredients Column */}
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

                    {/* Instructions Column */}
                    <div className="md:col-span-7 space-y-4">
                        <h3 className="text-lg font-black tracking-tight">Cooking Instructions</h3>
                        <p className="text-sm font-medium opacity-70 leading-relaxed text-justify whitespace-pre-line">
                            {recipe.instructions || "No instructions provided."}
                        </p>
                    </div>
                </div>

            </div>

            {/* Report Form Modal */}
            {isReportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-base-100 border border-base-300 w-full max-w-md p-6 rounded-2xl shadow-2xl relative text-base-content">
                        <h3 className="text-xl font-black mb-2 flex items-center gap-2 text-error">
                            <FaFlag /> Report Recipe
                        </h3>
                        <p className="text-xs text-base-content/70 mb-4">Help us understand what's wrong with this recipe post.</p>

                        <form onSubmit={handleReportSubmit} className="space-y-4">
                            <textarea
                                required
                                className="textarea textarea-bordered w-full h-28 text-sm focus:outline-none"
                                placeholder="Write down the reason for reporting..."
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                            ></textarea>

                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => { setIsReportModalOpen(false); setReportReason(""); }} className="btn btn-ghost rounded-xl normal-case font-bold">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submittingReport} className="btn btn-error rounded-xl normal-case font-bold text-white">
                                    {submittingReport ? "Submitting..." : "Submit Report"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeDetailsPage;