"use client";
import React, { useState, useEffect, use } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { FaClock, FaStar, FaUtensils, FaHeart, FaThumbsUp, FaFlag, FaCreditCard } from "react-icons/fa6";
import { Toaster, toast } from "react-hot-toast";

// Stripe ইনিশিয়েট করা (তোমার এনভায়রনমেন্ট ভ্যারিয়েবল থেকে পাবলিক কি নিবে)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "");

const RecipeDetailsPage = ({ params }) => {
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [submittingReport, setSubmittingReport] = useState(false);

    // ১. সম্পূর্ণ রেসিপি ডেটা লোড করা (লাইক কাউন্টসহ)
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

    // ২. Stripe Payment - Purchase Button Click Functionality
    const handlePurchase = async () => {
        try {
            toast.loading("Redirecting to Stripe Checkout...");

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipeId: recipe._id,
                    title: recipe.title,
                    image: recipe.image,
                    price: recipe.price || 500 // যদি প্রাইজ না থাকে ডিফল্ট ৫০০ টাকা বা ৫ ডলার ধবে
                })
            });

            const session = await res.json();
            const stripe = await stripePromise;

            if (stripe && session.id) {
                await stripe.redirectToCheckout({ sessionId: session.id });
            } else {
                toast.dismiss();
                toast.error("Stripe session creation failed!");
            }
        } catch (error) {
            toast.dismiss();
            console.error("Purchase error:", error);
            toast.error("Payment integration error!");
        }
    };

    // ৩. Like Button - Increase Like Count & Update DB Instantly
    const handleLike = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/recipes/${id}/like`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();

            if (data.success) {
                // লাইভ স্টেট আপডেট করা যেন সাথে সাথে পেজে লাইক বেড়ে যায়
                setRecipe(prev => ({ ...prev, likeCount: (prev.likeCount || 0) + 1 }));
                toast.success("Recipe Liked! 👍");
            }
        } catch (error) {
            console.error("Like error:", error);
            toast.error("Could not complete the action.");
        }
    };

    // ৪. Favorite Button - Add to Favorite API
    const handleAddToFavorite = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/favorites`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recipeId: recipe._id })
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

    // ৫. Report Button - Submit Modal Data to Backend
    const handleReportSubmit = async (e) => {
        e.preventDefault();
        if (!reportReason.trim()) return toast.error("Please enter a reason!");

        setSubmittingReport(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/reports`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recipeId: recipe._id, reason: reportReason })
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Recipe reported successfully. Team will review it. ⚠️");
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

                    {/* Image */}
                    <div className="md:col-span-5 h-64 md:h-80 rounded-2xl overflow-hidden shadow-md">
                        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Info Details */}
                    <div className="md:col-span-7 space-y-5">
                        <span className="text-xs font-black uppercase tracking-wider bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                            {recipe.category}
                        </span>
                        <h1 className="text-2xl md:text-4xl font-black tracking-tight">{recipe.title}</h1>

                        {/* Meta & Like Count Badge */}
                        <div className="flex flex-wrap gap-4 pt-1">
                            <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-xl border border-base-300/40 text-xs font-bold">
                                <FaClock className="text-primary" />
                                <span>Cooking Time: {recipe.cookingTime}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-xl border border-base-300/40 text-xs font-bold text-amber-500">
                                <FaStar />
                                <span>Rating: {recipe.ratings}</span>
                            </div>
                            {/* 🌟 Like Count Requirement */}
                            <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-xl border border-base-300/40 text-xs font-bold text-primary">
                                <FaThumbsUp />
                                <span>Likes: {recipe.likeCount || 0}</span>
                            </div>
                        </div>

                        {/* 🌟 All Required Action Buttons */}
                        <div className="flex flex-wrap gap-3 pt-3">
                            {/* ১. Purchase Button (Stripe Payment) */}
                            <button onClick={handlePurchase} className="btn btn-primary rounded-xl font-bold text-white normal-case flex items-center gap-2">
                                <FaCreditCard />
                                <span>Purchase Recipe</span>
                            </button>

                            {/* ২. Like Button */}
                            <button onClick={handleLike} className="btn btn-outline btn-primary rounded-xl font-bold normal-case flex items-center gap-2">
                                <FaThumbsUp />
                                <span>Like</span>
                            </button>

                            {/* ৩. Favorite Button */}
                            <button onClick={handleAddToFavorite} className="btn btn-outline btn-secondary rounded-xl font-bold normal-case flex items-center gap-2">
                                <FaHeart />
                                <span>Favorite</span>
                            </button>

                            {/* ৪. Report Button */}
                            <button onClick={() => setIsReportModalOpen(true)} className="btn btn-outline btn-error rounded-xl font-bold normal-case flex items-center gap-2">
                                <FaFlag />
                                <span>Report</span>
                            </button>
                        </div>

                    </div>
                </div>

                {/* Ingredients & Guidelines Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
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

                    <div className="md:col-span-7 space-y-4">
                        <h3 className="text-lg font-black tracking-tight">Cooking Guidelines & Description</h3>
                        <p className="text-sm font-medium opacity-70 leading-relaxed text-justify">{recipe.description}</p>
                    </div>
                </div>

            </div>

            {/* 🌟 Report Form Modal */}
            {isReportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-base-100 border border-base-300 w-full max-w-md p-6 rounded-2xl shadow-2xl relative text-base-content">
                        <h3 className="text-xl font-black mb-2 flex items-center gap-2 text-error">
                            <FaFlag /> Report Recipe
                        </h3>
                        <p className="text-xs text-base-content/70 mb-4">Help us understand what's wrong with this recipe post.</p>

                        <form onSubmit={handleReportSubmit} className="space-y-4">
                            <textarea
                                required
                                className="textarea textarea-bordered w-full h-28 text-sm focus:outline-none"
                                placeholder="Write down the reason for reporting (e.g., Inappropriate language, wrong image, fake instructions)..."
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