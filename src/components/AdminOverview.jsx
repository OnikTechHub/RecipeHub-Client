"use client";
import React from "react";
import { FaUtensils, FaCrown, FaUsers, FaFlag, FaUserShield, FaSackDollar, FaBuildingColumns, FaChartLine, FaWandSparkles, FaGaugeHigh, FaKey } from "react-icons/fa6";
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

            {/* Admin API Pool Usage & Quota Analytics Widget */}
            <div className="bg-base-100 border border-base-300 p-6 rounded-3xl shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-base-300/60 pb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="badge badge-primary badge-sm font-black uppercase text-[9px] tracking-wider">
                                System Module
                            </span>
                            <h2 className="text-lg font-black text-base-content flex items-center gap-2">
                                <FaWandSparkles className="text-amber-500" /> API Usage & Quota Analytics
                            </h2>
                        </div>
                        <p className="text-xs text-base-content/60 font-medium mt-1">
                            Real-time tracking of active Gemini API key pool capacity, requests used, and aggregated system percentage.
                        </p>
                    </div>
                    <div className="px-3.5 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary font-black text-xs">
                        Aggregated Usage: {stats?.apiAnalytics?.aggregatedUsagePercent || 0}%
                    </div>
                </div>

                {/* Overall Aggregated Percentage Progress Bar */}
                <div className="bg-base-200/60 p-5 rounded-2xl border border-base-300/40 space-y-3">
                    <div className="flex justify-between items-center text-xs font-black">
                        <span className="text-base-content flex items-center gap-1.5">
                            <FaGaugeHigh className="text-accent" /> Total System API Capacity Used:
                        </span>
                        <span className="text-primary font-black text-sm">
                            {stats?.apiAnalytics?.totalRequestsUsed || 0} / {stats?.apiAnalytics?.totalSystemCapacity || 1500} Requests ({stats?.apiAnalytics?.aggregatedUsagePercent || 0}%)
                        </span>
                    </div>

                    <div className="w-full bg-base-300 dark:bg-base-800 h-4 rounded-full overflow-hidden p-0.5 shadow-inner border border-base-300">
                        <div
                            className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full transition-all duration-700 shadow-sm"
                            style={{ width: `${Math.min(100, Math.max(2, stats?.apiAnalytics?.aggregatedUsagePercent || 0))}%` }}
                        ></div>
                    </div>

                    <div className="flex flex-wrap justify-between items-center text-[11px] text-base-content/70 font-semibold pt-1">
                        <span>Key Pool: <strong>{stats?.apiAnalytics?.activeKeysCount || 1} Active Keys</strong></span>
                        <span>Remaining Quota: <strong className="text-emerald-500">{stats?.apiAnalytics?.remainingQuota || 1500} Requests</strong></span>
                        <span>Daily Limit per Key: <strong>1,500 Req/Day</strong></span>
                    </div>
                </div>

                {/* Detailed Key-by-Key Breakdown Cards */}
                <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                        <FaKey className="text-amber-500" /> Active API Keys Breakdown
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {(stats?.apiAnalytics?.keyDetails || []).map((keyItem) => (
                            <div key={keyItem.id} className="bg-base-200/40 border border-base-300/60 p-4 rounded-2xl space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-xs text-base-content">{keyItem.name}</span>
                                    <span className={`badge badge-xs font-black uppercase text-[9px] ${keyItem.status === 'Active' ? 'badge-success text-white' : 'badge-error text-white'}`}>
                                        {keyItem.status}
                                    </span>
                                </div>
                                <p className="text-[11px] font-mono text-base-content/60">{keyItem.maskedKey}</p>
                                <div className="w-full bg-base-300 dark:bg-base-700 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(100, keyItem.usagePercent || 0)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-base-content/70 font-bold pt-0.5">
                                    <span>{keyItem.callsToday} / {keyItem.capacity} Req</span>
                                    <span>{keyItem.usagePercent}% Used</span>
                                </div>
                            </div>
                        ))}
                    </div>
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