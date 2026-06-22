"use client";
import React, { useState, useEffect, use } from "react";
import { FaUtensils } from "react-icons/fa6";
import { Toaster, toast } from "react-hot-toast";
import RecipeInfoCard from "@/components/RecipeInfoCard";
import ReportModal from "@/components/ReportModal";

import { authClient } from "@/lib/auth-client";

const RecipeDetailsPage = ({ params }) => {
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const { data: session, isPending } = authClient.useSession();

    const currentUserEmail = session?.user?.email;
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    // Fetch recipe details from DB
    const fetchRecipeDetails = async () => {
        try {
            
            
            const response = await fetch(`${SERVER_URL}/recipes/${id}`);
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
        if (!currentUserEmail) {
            return toast.error("Please login first to purchase this recipe!");
        }
        if (!recipe) return toast.error("Recipe data not loaded yet!");

        const toastId = toast.loading("Redirecting to Stripe Checkout...");

        try {
            const res = await fetch(`${SERVER_URL}/create-checkout-session`, {
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

            const sessionData = await res.json();
            if (sessionData.success && sessionData.url) {
                toast.dismiss(toastId);
                window.location.href = sessionData.url;
            } else {
                toast.dismiss(toastId);
                toast.error(sessionData.message || "Stripe session creation failed!");
            }
        } catch (error) {
            toast.dismiss(toastId);
            console.error("Purchase error:", error);
            toast.error("Payment integration error!");
        }
    };

    // Like Button Integration
    const handleLike = async () => {
        if (!currentUserEmail) {
            return toast.error("Please login first to like this recipe!");
        }

        try {
            const res = await fetch(`${SERVER_URL}/recipes/${id}/like`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail: currentUserEmail })
            });
            const data = await res.json();

            if (data.success) {
                setRecipe(prev => ({ ...prev, likesCount: (prev.likesCount || 0) + 1 }));
                toast.success("Recipe Liked!");
            } else {
                toast.error(data.message || "You have already liked this recipe!");
            }
        } catch (error) {
            console.error("Like error:", error);
            toast.error("Could not complete the action.");
        }
    };

    // Favorite Button Integration
    const handleAddToFavorite = async () => {
        if (!currentUserEmail) {
            return toast.error("Please login first to add to favorites!");
        }

        try {
            const res = await fetch(`${SERVER_URL}/favorites`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipeId: recipe._id,
                    userEmail: currentUserEmail
                })
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Added to your Favorite Recipes!");
            } else {
                toast.error(data.message || "Already in favorites!");
            }
        } catch (error) {
            console.error("Favorite error:", error);
            toast.error("Failed to add to favorites.");
        }
    };

    const handleOpenReportModal = () => {
        if (!currentUserEmail) {
            return toast.error("Please login first to report this recipe!");
        }
        setIsReportModalOpen(true);
    };

    if (loading || isPending) {
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
                <RecipeInfoCard
                    recipe={recipe}
                    onPurchase={handlePurchase}
                    onLike={handleLike}
                    onFavorite={handleAddToFavorite}
                    onOpenReport={handleOpenReportModal}
                />

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

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                recipeId={recipe._id}
                currentUserEmail={currentUserEmail}
                serverUrl={SERVER_URL}
            />
        </div>
    );
};

export default RecipeDetailsPage;