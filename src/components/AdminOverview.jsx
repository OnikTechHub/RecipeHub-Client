"use client";
import React from "react";
import { FaUtensils, FaCrown, FaUsers, FaFlag, FaUserShield, FaSackDollar, FaBuildingColumns, FaChartLine } from "react-icons/fa6";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const AdminOverview = ({ stats, currentUser }) => {
    const chartData = stats?.monthlyChartData || [
        { month: "Current", gross: stats?.grossVolume || 0, net: stats?.adminEarnings || 0 }
    ];

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-300 pb-5">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-base-content">
                        Welcome, {currentUser?.name || "Admin"}!
                    </h1>
                    <p className="text-sm text-base-content/60 font-medium mt-1">
                        RecipeHub System Overview & Revenue Analytics Control
                    </p>
                </div>
                <div className="badge badge-error gap-2 p-5 rounded-xl font-black text-white shadow-md">
                    <FaUserShield /> ADMIN PORTAL
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
                <div className="bg-base-100 border border-base-300 p-5 rounded-2xl flex items-center justify-between shadow-xs">
                    <div>
                        <p className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">Total Users</p>
                        <h3 className="text-2xl font-black text-base-content mt-1">{stats?.totalUsers || 0}</h3>
                    </div>
                    <div className="p-3 bg-primary/10 text-primary rounded-xl text-xl"><FaUsers /></div>
                </div>

                <div className="bg-base-100 border border-base-300 p-5 rounded-2xl flex items-center justify-between shadow-xs">
                    <div>
                        <p className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">Total Recipes</p>
                        <h3 className="text-2xl font-black text-base-content mt-1">{stats?.totalRecipes || 0}</h3>
                    </div>
                    <div className="p-3 bg-secondary/10 text-secondary rounded-xl text-xl"><FaUtensils /></div>
                </div>

                <div className="bg-base-100 border border-base-300 p-5 rounded-2xl flex items-center justify-between shadow-xs">
                    <div>
                        <p className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">Pro Members</p>
                        <h3 className="text-2xl font-black text-base-content mt-1">{stats?.totalPremiumMembers || 0}</h3>
                    </div>
                    <div className="p-3 bg-warning/10 text-warning rounded-xl text-xl"><FaCrown /></div>
                </div>

                <div className="bg-base-100 border border-base-300 p-5 rounded-2xl flex items-center justify-between shadow-xs">
                    <div>
                        <p className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">Total Reports</p>
                        <h3 className="text-2xl font-black text-base-content mt-1">{stats?.totalReports || 0}</h3>
                    </div>
                    <div className="p-3 bg-error/10 text-error rounded-xl text-xl"><FaFlag /></div>
                </div>

                {/* Gross Volume */}
                <div className="bg-base-100 border border-emerald-500/30 p-5 rounded-2xl flex items-center justify-between shadow-xs">
                    <div>
                        <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Gross Volume</p>
                        <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">${Number(stats?.grossVolume || 0).toFixed(2)}</h3>
                    </div>
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl text-xl"><FaSackDollar /></div>
                </div>

                {/* Admin Platform Commission (20%) */}
                <div className="bg-base-100 border border-amber-500/30 p-5 rounded-2xl flex items-center justify-between shadow-xs">
                    <div>
                        <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Net Profit (20%)</p>
                        <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">${Number(stats?.adminEarnings || 0).toFixed(2)}</h3>
                    </div>
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl text-xl"><FaBuildingColumns /></div>
                </div>
            </div>

            {/* Revenue Growth Chart */}
            <div className="bg-base-100 border border-base-300 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-base-300/60 pb-4">
                    <div>
                        <h2 className="text-lg font-black text-base-content flex items-center gap-2">
                            <FaChartLine className="text-primary" /> Revenue Growth & Commission Analytics
                        </h2>
                        <p className="text-xs text-base-content/60 font-medium">
                            Monthly track of total transaction volume ($) vs 20% platform revenue.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-emerald-600">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Gross Volume
                        </span>
                        <span className="flex items-center gap-1.5 text-amber-500">
                            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Net Commission (20%)
                        </span>
                    </div>
                </div>

                <div className="h-72 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                            <XAxis dataKey="month" stroke="currentColor" className="text-[11px] opacity-60" />
                            <YAxis stroke="currentColor" className="text-[11px] opacity-60" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                                    borderRadius: "12px",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    fontSize: "12px"
                                }}
                                formatter={(value) => [`$${Number(value).toFixed(2)}`, ""]}
                            />
                            <Area type="monotone" dataKey="gross" name="Gross Volume" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorGross)" />
                            <Area type="monotone" dataKey="net" name="Net Commission (20%)" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorNet)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;