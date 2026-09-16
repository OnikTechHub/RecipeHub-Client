"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";
import { Toaster, toast } from "react-hot-toast";
import { FaTrash, FaEye, FaClock, FaStar, FaCrown, FaHeart, FaArrowRight, FaLockOpen, FaLock } from "react-icons/fa6";
import { FaHeartBroken } from "react-icons/fa";
import { HashLoader } from "react-spinners";
import Swal from "sweetalert2";

const MyFavorites = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const { isPurchased, isAdmin, isPremiumUser } = useCart();

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;


    useEffect(() => {
        if (user?.email) {
            axios.get(`${SERVER_URL}/favorites?email=${encodeURIComponent(user.email)}`)
                .then(res => {
                    setFavorites(res.data.data || []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching favorites:", err);
                    setLoading(false);
                });
        }
    }, [user?.email, SERVER_URL]);

    const handleDelete = async (id, recipeName) => {
        const confirm = await Swal.fire({
            title: "Remove Favorite?",
            text: `Remove "${recipeName || 'this recipe'}" from your favorite recipes collection?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Remove",
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`${SERVER_URL}/favorites/${id}`);
                setFavorites(favorites.filter(fav => fav._id !== id));
                toast.success("Removed from favorites!");
            } catch (err) {
                console.error("Remove favorite error:", err);
                toast.error("Failed to remove from favorites!");
            }
        }
    };

    return (
        <div className="space-y-6">
            <Toaster position="top-center" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-base-300 pb-4">
                <div>
                    <h1 className="text-2xl font-black text-base-content tracking-tight flex items-center gap-2">
                        <FaHeart className="text-secondary" /> My Favorite Recipes
                    </h1>
                    <p className="text-xs text-base-content/60 font-medium mt-1">
                        Your saved culinary inspirations, quick access, and saved secret recipes.
                    </p>
                </div>
                <div className="badge badge-secondary gap-1.5 font-bold p-3 text-white">
                    <FaHeart className="text-xs" /> Total Saved: {favorites.length}
                </div>
            </div>

            {loading ? (
                <div className="min-h-[50vh] flex flex-col justify-center items-center gap-4">
                    <HashLoader color="#10b981" size={50} />
                    <p className="text-xs font-bold text-base-content/60 tracking-wider uppercase animate-pulse">
                        Loading your favorite recipes...
                    </p>
                </div>
            ) : favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-base-200/40 rounded-3xl border border-dashed border-base-300 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center text-2xl shadow-inner">
                        <FaHeartBroken />
                    </div>
                    <div className="space-y-1 max-w-sm">
                        <h3 className="text-lg font-black text-base-content">No Favorites Saved Yet</h3>
                        <p className="text-xs text-base-content/60 font-medium">
                            Explore our community culinary creations and bookmark your top favorite dishes!
                        </p>
                    </div>
                    <Link
                        href="/browse-recipes"
                        className="btn btn-primary rounded-xl font-bold text-white text-xs gap-2 normal-case shadow-md shadow-primary/20 hover:scale-105 transition-transform"
                    >
                        <span>Explore Recipes</span>
                        <FaArrowRight />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((fav) => {
                        const recipe = fav.recipeInfo || fav.recipeDetails || {};
                        const recipeName = recipe.recipeName || fav.recipeName || "Recipe Details";
                        const image = recipe.recipeImage || recipe.image || fav.image || "https://api.dicebear.com/7.x/bottts/svg?seed=fallback";
                        const category = Array.isArray(recipe.category) ? recipe.category[0] : (recipe.category || "General");
                        const isPaid = recipe.recipeType === "Paid" || recipe.isPaid === true || Number(recipe.price || 0) > 0;
                        const price = Number(recipe.price || 5).toFixed(2);
                        const prepTime = recipe.preparationTime || recipe.prepTime || "20 mins";
                        const ratings = recipe.ratings || 5.0;
                        const targetRecipeId = fav.recipeId || recipe._id;
                        const authorEmail = recipe.authorEmail || fav.authorEmail;

                        const owned = isPurchased(targetRecipeId, authorEmail);
                        const isAuthor = Boolean(authorEmail && user?.email && authorEmail.toLowerCase().trim() === user.email.toLowerCase().trim());
                        const isUnlockedForUser = owned || isAdmin || isAuthor || (!isPaid && isPremiumUser);

                        return (
                            <div
                                key={fav._id}
                                className="bg-base-100 rounded-2xl border border-base-300/40 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 group flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="relative h-48 overflow-hidden bg-base-200">
                                    <img
                                        src={image}
                                        alt={recipeName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Category Badge */}
                                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-base-100/90 backdrop-blur-md text-primary shadow-sm">
                                        {category}
                                    </span>

                                    {/* Access / Paywall Status Badge */}
                                    {isUnlockedForUser ? (
                                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-teal-600 text-white shadow-md flex items-center gap-1 tracking-wider">
                                            <FaLockOpen className="text-[9px]" /> UNLOCKED
                                        </span>
                                    ) : isPaid ? (
                                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-amber-500 text-white shadow-md flex items-center gap-1 tracking-wider">
                                            <FaLock className="text-[9px]" /> LOCKED • ${price}
                                        </span>
                                    ) : (
                                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-amber-600 text-white shadow-md flex items-center gap-1 tracking-wider">
                                            <FaLock className="text-[9px]" /> PRO REQUIRED
                                        </span>
                                    )}
                                </div>

                                {/* Body */}
                                <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                                    <div>
                                        <div className="flex items-center gap-3 text-xs text-base-content/60 mb-2 font-medium">
                                            <span className="flex items-center gap-1">
                                                <FaClock className="text-[10px] text-primary" /> {prepTime}
                                            </span>
                                            <span className="flex items-center gap-1 text-amber-500 font-bold">
                                                <FaStar className="text-[10px]" /> {ratings}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-base text-base-content tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
                                            {recipeName}
                                        </h3>
                                    </div>

                                    {/* Footer Action Buttons */}
                                    <div className="flex items-center gap-2 pt-2 border-t border-base-300/40">
                                        {isUnlockedForUser ? (
                                            <Link
                                                href={`/browse-recipes/${targetRecipeId}`}
                                                className="btn btn-primary btn-sm flex-1 rounded-xl font-bold text-white normal-case gap-1.5 shadow-sm"
                                            >
                                                <FaEye className="text-xs" /> View Recipe
                                            </Link>
                                        ) : isPaid ? (
                                            <Link
                                                href={`/browse-recipes/${targetRecipeId}`}
                                                className="btn btn-warning btn-sm flex-1 rounded-xl font-bold text-slate-950 normal-case gap-1.5 shadow-sm"
                                            >
                                                <FaLock className="text-xs" /> Unlock Recipe (${price})
                                            </Link>
                                        ) : (
                                            <Link
                                                href={`/browse-recipes/${targetRecipeId}`}
                                                className="btn btn-warning btn-sm flex-1 rounded-xl font-bold text-slate-950 normal-case gap-1.5 shadow-sm"
                                            >
                                                <FaCrown className="text-xs text-amber-900" /> Upgrade to Unlock
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => handleDelete(fav._id, recipeName)}
                                            className="btn btn-ghost btn-sm hover:bg-error/10 text-error rounded-xl font-bold p-2.5"
                                            title="Remove from favorites"
                                        >
                                            <FaTrash className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </div>
            )}
        </div>
    );
};

export default MyFavorites;