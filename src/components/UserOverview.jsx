"use client";
import React, { useState, useEffect } from "react";
import { FaUtensils, FaHeart, FaThumbsUp, FaCrown, FaUser, FaHandHoldingDollar, FaReceipt, FaChartLine } from "react-icons/fa6";
import { HashLoader } from "react-spinners";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const UserOverview = ({ stats, currentUser, isPremium }) => {
    const [loading, setLoading] = useState(false);
    const [creatorStats, setCreatorStats] = useState({
        totalEarnings: 0,
        totalSales: 0,
        grossSalesVolume: 0,
    });
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

    useEffect(() => {
        if (currentUser?.email) {
            fetch(`${SERVER_URL}/creator-earnings?email=${encodeURIComponent(currentUser.email)}`)
                .then((res) => res.json())
                .then((resData) => {
                    if (resData.success && resData.data) {
                        setCreatorStats(resData.data);
                    }
                })
                .catch((err) => console.error("Error fetching creator earnings:", err));
        }
    }, [currentUser?.email, SERVER_URL]);

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

                {/* Creator Net Earnings (80%) */}
                <div className="bg-base-200/50 border border-emerald-500/20 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Creator Earnings (80%)</p>
                        <h3 className="text-3xl font-black mt-1 text-emerald-600">
                            ${Number(creatorStats?.totalEarnings || 0).toFixed(2)}
                        </h3>
                    </div>
                    <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-xl text-2xl"><FaHandHoldingDollar /></div>
                </div>

                {/* Total Recipes Sold */}
                <div className="bg-base-200/50 border border-base-300 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-xs font-bold opacity-50 uppercase tracking-wider">Paid Recipes Sold</p>
                        <h3 className="text-3xl font-black mt-1">{creatorStats?.totalSales || 0}</h3>
                    </div>
                    <div className="p-4 bg-amber-500/10 text-amber-500 rounded-xl text-2xl"><FaReceipt /></div>
                </div>
            </div>

            {/* Analytics Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Activity & Engagement Bar Chart */}
                <div className="lg:col-span-7 bg-base-100 border border-base-300 p-6 rounded-3xl shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-base-300/60 pb-3">
                        <div>
                            <h2 className="text-lg font-black text-base-content flex items-center gap-2">
                                <FaChartLine className="text-primary" /> Recipe Activity & Engagement Analytics
                            </h2>
                            <p className="text-xs text-base-content/60 font-medium">
                                Real-time distribution of your recipe creations, favorites, likes, and sales.
                            </p>
                        </div>
                    </div>

                    <div className="h-64 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={[
                                    { name: "My Recipes", count: stats?.totalRecipes || 0 },
                                    { name: "Favorites", count: stats?.totalFavorites || 0 },
                                    { name: "Likes", count: stats?.totalLikesReceived || 0 },
                                    { name: "Recipes Sold", count: creatorStats?.totalSales || 0 },
                                ]}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                <XAxis dataKey="name" stroke="currentColor" className="text-[11px] opacity-60" />
                                <YAxis stroke="currentColor" className="text-[11px] opacity-60" allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                                        borderRadius: "12px",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        fontSize: "12px",
                                    }}
                                />
                                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Creator Revenue Growth Area Chart */}
                <div className="lg:col-span-5 bg-base-100 border border-base-300 p-6 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-base-300/60 pb-3">
                        <div>
                            <h2 className="text-lg font-black text-base-content flex items-center gap-2">
                                <FaHandHoldingDollar className="text-emerald-500" /> Revenue & Earnings Overview
                            </h2>
                            <p className="text-xs text-base-content/60 font-medium">
                                Comparison of gross sales volume vs creator 80% net payouts ($).
                            </p>
                        </div>
                    </div>

                    <div className="h-64 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={[
                                    { name: "Gross Sales", amount: Number(creatorStats?.grossSalesVolume || 0) },
                                    { name: "Net Payout (80%)", amount: Number(creatorStats?.totalEarnings || 0) },
                                ]}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="userEarnings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                <XAxis dataKey="name" stroke="currentColor" className="text-[11px] opacity-60" />
                                <YAxis stroke="currentColor" className="text-[11px] opacity-60" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                                        borderRadius: "12px",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        fontSize: "12px",
                                    }}
                                    formatter={(val) => [`$${Number(val).toFixed(2)}`, "Amount"]}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#userEarnings)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
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
                            <HashLoader color="#000000" size={16} />
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