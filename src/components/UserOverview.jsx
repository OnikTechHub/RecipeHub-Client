"use client";
import React, { useState } from "react";
import { FaUtensils, FaHeart, FaThumbsUp, FaCrown, FaUser } from "react-icons/fa6";

const UserOverview = ({ stats, currentUser, isPremium }) => {
    const [loading, setLoading] = useState(false);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ;

    const handleUpgradeMembership = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${SERVER_URL}/create-checkout-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipeId: "membership_upgrade",
                    title: "RecipeHub Pro Premium Membership",
                    price: 19.99, 
                    userEmail: currentUser?.email,
                    userId: currentUser?.id || currentUser?._id || "N/A",
                }),
            });

            const data = await response.json();

            if (data.success && data.url) {
                window.location.href = data.url;
            } else {
                console.error("Payment session creation failed:", data.message);
                alert(data.message || "Could not initiate payment. Please try again.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Stripe integration error:", error);
            alert("Connection error with server while processing payment.");
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-300 pb-5">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-base-content">
                        Welcome back, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{currentUser?.name || "Chef"}</span>!
                    </h1>
                    <p className="text-sm opacity-60 font-medium mt-1">
                        Your Real-time Cooking & Recipe Analytics
                    </p>
                </div>
                <div>
                    {isPremium ? (
                        <div className="badge badge-warning gap-2 p-5 rounded-xl font-black text-neutral shadow-md">
                            <FaCrown className="text-base animate-bounce" /> PREMIUM MEMBER
                        </div>
                    ) : (
                        <div className="badge badge-neutral gap-2 p-5 rounded-xl font-bold opacity-70">
                            <FaUser /> FREE ACCOUNT
                        </div>
                    )}
                </div>
            </div>

            {/* User Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* My Recipes */}
                <div className="bg-base-200/50 border border-base-300 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-xs font-bold opacity-50 uppercase tracking-wider">My Recipes</p>
                        <h3 className="text-3xl font-black mt-1">
                            {stats?.totalRecipes || 0}
                            <span className="text-xs font-bold opacity-40 ml-1.5">
                                {isPremium ? "/ Unlimited" : "/ 2 Max Limit"}
                            </span>
                        </h3>
                    </div>
                    <div className="p-4 bg-primary/10 text-primary rounded-xl text-2xl"><FaUtensils /></div>
                </div>

                {/* Total Favorites */}
                <div className="bg-base-200/50 border border-base-300 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-xs font-bold opacity-50 uppercase tracking-wider">Total Favorites</p>
                        <h3 className="text-3xl font-black mt-1">{stats?.totalFavorites || 0}</h3>
                    </div>
                    <div className="p-4 bg-secondary/10 text-secondary rounded-xl text-2xl"><FaHeart /></div>
                </div>

                {/* Total Likes */}
                <div className="bg-base-200/50 border border-base-300 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-xs font-bold opacity-50 uppercase tracking-wider">Total Likes Received</p>
                        <h3 className="text-3xl font-black mt-1">{stats?.totalLikesReceived || 0}</h3>
                    </div>
                    <div className="p-4 bg-success/10 text-success rounded-xl text-2xl"><FaThumbsUp /></div>
                </div>
            </div>

            {/* Upgrade Premium Banner */}
            {!isPremium && (
                <div className="bg-gradient-to-br from-base-200 to-base-300 border border-base-300 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-md">
                    <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
                        <div className="p-4 bg-neutral text-neutral-content rounded-xl text-2xl shadow-inner">
                            <FaCrown className="text-warning animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-base-content">Upgrade to RecipeHub Premium</h3>
                            <p className="text-xs opacity-70 font-medium mt-1 max-w-md">
                                Standard accounts have a 2-recipe limit. Unlock unlimited creations and exclusive premium items instantly using Stripe Checkout!
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleUpgradeMembership}
                        disabled={loading}
                        className={`btn btn-warning rounded-xl font-black shadow px-6 normal-case hover:scale-105 transition-transform ${loading ? "loading" : ""}`}
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                            "Become a Premium Member"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserOverview;