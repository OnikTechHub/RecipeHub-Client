import React from "react";
import { FaUtensils, FaHeart, FaThumbsUp, FaCrown, FaUser } from "react-icons/fa";

const UserOverview = ({ stats, currentUser, isPremium }) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-300 pb-5">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-base-content">
                        Welcome back, {currentUser?.name || "Chef"}!
                    </h1>
                    <p className="text-sm opacity-60 font-medium mt-1">
                        Your Real-time Cooking & Recipe Analytics
                    </p>
                </div>
                <div>
                    {isPremium ? (
                        <div className="badge badge-warning gap-2 p-5 rounded-xl font-black text-neutral shadow-md">
                            <FaCrown /> PREMIUM MEMBER
                        </div>
                    ) : (
                        <div className="badge badge-neutral gap-2 p-5 rounded-xl font-bold opacity-70">
                            <FaUser /> FREE ACCOUNT
                        </div>
                    )}
                </div>
            </div>

            {/* User 3 Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-base-200/50 border border-base-300 p-6 rounded-2xl flex items-center justify-between">
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

                <div className="bg-base-200/50 border border-base-300 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold opacity-50 uppercase tracking-wider">Total Favorites</p>
                        <h3 className="text-3xl font-black mt-1">{stats?.totalFavorites || 0}</h3>
                    </div>
                    <div className="p-4 bg-secondary/10 text-secondary rounded-xl text-2xl"><FaHeart /></div>
                </div>

                <div className="bg-base-200/50 border border-base-300 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold opacity-50 uppercase tracking-wider">Total Likes Received</p>
                        <h3 className="text-3xl font-black mt-1">{stats?.totalLikesReceived || 0}</h3>
                    </div>
                    <div className="p-4 bg-success/10 text-success rounded-xl text-2xl"><FaThumbsUp /></div>
                </div>
            </div>

            {/* Upgrade Premium Banner */}
            {!isPremium && (
                <div className="bg-gradient-to-br from-base-200 to-base-300 border border-base-300 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
                        <div className="p-4 bg-neutral text-neutral-content rounded-xl text-2xl"><FaCrown /></div>
                        <div>
                            <h3 className="text-lg font-black text-base-content">Upgrade to RecipeHub Premium</h3>
                            <p className="text-xs opacity-70 font-medium mt-1 max-w-md">
                                Standard accounts have a 2-recipe limit. Unlock unlimited creations using Stripe Checkout!
                            </p>
                        </div>
                    </div>
                    <button className="btn btn-warning rounded-xl font-bold shadow px-6">
                        Become a Premium Member
                    </button>
                </div>
            )}
        </div>
    );
}
export default UserOverview;