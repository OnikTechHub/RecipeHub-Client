import React from "react";
import { FaUtensils, FaCrown, FaUsers, FaFlag, FaUserShield } from "react-icons/fa";

const AdminOverview = ({ stats, currentUser }) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-300 pb-5">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-base-content">
                        Welcome, {currentUser?.name || "Admin"}!
                    </h1>
                    <p className="text-sm opacity-60 font-medium mt-1">
                        RecipeHub Management Portal & System Control
                    </p>
                </div>
                <div className="badge badge-error gap-2 p-5 rounded-xl font-black text-white shadow-md">
                    <FaUserShield /> ADMIN PORTAL
                </div>
            </div>

            {/* 4 Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-base-200/50 border border-base-300 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold opacity-50 uppercase tracking-wider">Total Users</p>
                        <h3 className="text-3xl font-black mt-1">{stats?.totalUsers || 0}</h3>
                    </div>
                    <div className="p-4 bg-primary/10 text-primary rounded-xl text-2xl"><FaUsers /></div>
                </div>

                <div className="bg-base-200/50 border border-base-300 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold opacity-50 uppercase tracking-wider">Total Recipes</p>
                        <h3 className="text-3xl font-black mt-1">{stats?.totalRecipes || 0}</h3>
                    </div>
                    <div className="p-4 bg-secondary/10 text-secondary rounded-xl text-2xl"><FaUtensils /></div>
                </div>

                <div className="bg-base-200/50 border border-base-300 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold opacity-50 uppercase tracking-wider">Premium Members</p>
                        <h3 className="text-3xl font-black mt-1">{stats?.totalPremiumMembers || 0}</h3>
                    </div>
                    <div className="p-4 bg-warning/10 text-warning rounded-xl text-2xl"><FaCrown /></div>
                </div>

                <div className="bg-base-200/50 border border-base-300 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold opacity-50 uppercase tracking-wider">Total Reports</p>
                        <h3 className="text-3xl font-black mt-1">{stats?.totalReports || 0}</h3>
                    </div>
                    <div className="p-4 bg-error/10 text-error rounded-xl text-2xl"><FaFlag /></div>
                </div>
            </div>
        </div>
    );
}

export default AdminOverview;