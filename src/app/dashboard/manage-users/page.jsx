"use client";
import React, { useState, useEffect } from "react";
import { FaUserSlash, FaUserCheck, FaCrown, FaUserShield, FaUser } from "react-icons/fa";
import Swal from "sweetalert2";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // User lode Function
    const loadUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/users`);
            const data = await res.json();
            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // Users block function
    const handleBlockUser = async (id, name) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/users/block/${id}`, {
                method: "PATCH",
            });
            const data = await res.json();
            if (data.success) {
                
                setUsers(users.map(u => u._id === id ? { ...u, isBlocked: true } : u));
                Swal.fire({
                    title: "Blocked!",
                    text: `${name} has been restricted from the platform.`,
                    icon: "error",
                    confirmButtonColor: "#ef4444"
                });
            }
        } catch (error) {
            console.error("Error blocking user:", error);
        }
    };

    // Users unblock
    const handleUnblockUser = async (id, name) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/users/unblock/${id}`, {
                method: "PATCH",
            });
            const data = await res.json();
            if (data.success) {
                
                setUsers(users.map(u => u._id === id ? { ...u, isBlocked: false } : u));
                Swal.fire({
                    title: "Unblocked!",
                    text: `${name} is now active again.`,
                    icon: "success",
                    confirmButtonColor: "#10b981"
                });
            }
        } catch (error) {
            console.error("Error unblocking user:", error);
        }
    };

    //  LOADING

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col justify-center items-center gap-2">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-xs font-bold opacity-50 tracking-wider uppercase animate-pulse">Loading RecipeHub Users List...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-base-300 pb-4">
                <h1 className="text-2xl font-black text-base-content tracking-tight">Manage Users</h1>
                <p className="text-xs opacity-60 font-medium mt-1">View, manage system roles, and control active user permissions.</p>
            </div>

            <div className="overflow-x-auto bg-base-200/40 border border-base-300 rounded-2xl shadow-sm">
                <table className="table table-zebra w-full">
                    {/* Table Head */}
                    <thead>
                        <tr className="border-b border-base-300 text-xs font-bold uppercase tracking-wider opacity-70">
                            <th>User Details</th>
                            <th>Email</th>
                            <th>Account Type</th>
                            <th>Status</th>
                            <th className="text-center">Action Permissions</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-10 font-bold opacity-40 text-sm">
                                    No users found in the system.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id} className="border-b border-base-300/60 font-medium text-sm">
                                    {/* User Details */}
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-10 h-10 bg-base-300">
                                                    <img
                                                        src={user.image || "https://api.dicebear.com/7.x/bottts/svg?seed=fallback"}
                                                        alt={user.name}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-base-content">{user.name}</div>
                                                <span className="text-[10px] opacity-40 font-mono block">{user._id}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="text-base-content/80 font-mono text-xs">{user.email}</td>

                                    {/* Role */}
                                    <td>
                                        {user.role === "admin" ? (
                                            <span className="badge badge-error badge-sm gap-1 text-white font-bold p-2.5 rounded-lg">
                                                <FaUserShield className="text-[10px]" /> Admin
                                            </span>
                                        ) : user.isPremium ? (
                                            <span className="badge badge-warning badge-sm gap-1 text-neutral font-black p-2.5 rounded-lg">
                                                <FaCrown className="text-[10px]" /> Premium
                                            </span>
                                        ) : (
                                            <span className="badge badge-neutral badge-sm gap-1 opacity-70 font-bold p-2.5 rounded-lg">
                                                <FaUser className="text-[10px]" /> Free Tier
                                            </span>
                                        )}
                                    </td>

                                    {/* Status */}
                                    <td>
                                        {user.isBlocked ? (
                                            <span className="badge badge-ghost text-error bg-error/10 border-error/20 font-bold text-xs p-2">
                                                Blocked
                                            </span>
                                        ) : (
                                            <span className="badge badge-ghost text-success bg-success/10 border-success/20 font-bold text-xs p-2">
                                                Active
                                            </span>
                                        )}
                                    </td>

                                    <td className="text-center">
                                        {user.role === "admin" ? (
                                            <span className="text-xs opacity-40 italic font-semibold select-none">System Protected</span>
                                        ) : user.isBlocked ? (
                                            <button
                                                onClick={() => handleUnblockUser(user._id, user.name)}
                                                className="btn btn-success btn-xs gap-1 text-white font-bold rounded-lg px-3 py-1.5 h-auto min-h-0"
                                            >
                                                <FaUserCheck /> Unblock
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleBlockUser(user._id, user.name)}
                                                className="btn btn-error btn-xs gap-1 text-white font-bold rounded-lg px-3 py-1.5 h-auto min-h-0"
                                            >
                                                <FaUserSlash /> Block User
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}