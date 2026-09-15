"use client";
import React, { useState, useEffect } from "react";
import { FaUserSlash, FaUserCheck, FaCrown, FaUserShield, FaUser, FaUserMinus } from "react-icons/fa";
import Swal from "sweetalert2";
import { HashLoader } from "react-spinners";
import Pagination from "@/components/Pagination";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const limit = 8;

    // Load users with pagination
    const loadUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/users?page=${currentPage}&limit=${limit}`);
            const data = await res.json();
            if (data.success) {
                setUsers(data.data || []);
                setTotalPages(data.totalPages || 1);
                setTotalUsers(data.totalUsers || (data.data ? data.data.length : 0));
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [currentPage]);

    // Dynamic Role Update (Promote to Admin / Demote to User)
    const handleUpdateRole = async (id, targetRole, name) => {
        const isPromote = targetRole === "admin";
        const confirm = await Swal.fire({
            title: isPromote ? "Promote to Admin?" : "Demote to User?",
            text: isPromote
                ? `Are you sure you want to give ${name} full Administrator permissions?`
                : `Are you sure you want to revoke admin permissions from ${name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: isPromote ? "#10b981" : "#f59e0b",
            cancelButtonColor: "#6b7280",
            confirmButtonText: isPromote ? "Yes, Promote User" : "Yes, Demote Admin",
        });

        if (confirm.isConfirmed) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/users/role/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ role: targetRole }),
                });
                const data = await res.json();
                if (data.success) {
                    setUsers(users.map((u) => (u._id === id ? { ...u, role: targetRole } : u)));
                    Swal.fire({
                        title: "Success!",
                        text: `${name}'s role has been updated to ${targetRole}.`,
                        icon: "success",
                        confirmButtonColor: "#10b981",
                    });
                } else {
                    Swal.fire("Error", data.message || "Failed to update user role.", "error");
                }
            } catch (error) {
                console.error("Error updating user role:", error);
                Swal.fire("Error", "Failed to update user role.", "error");
            }
        }
    };

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

    // Users unblock function
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

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col justify-center items-center gap-4">
                <HashLoader color="#10b981" size={50} />
                <p className="text-xs font-bold text-base-content/60 tracking-wider uppercase animate-pulse">Loading RecipeHub Users List...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-base-300 pb-4">
                <div>
                    <h1 className="text-2xl font-black text-base-content tracking-tight">Manage Users</h1>
                    <p className="text-xs text-base-content/60 font-medium mt-1">View, promote system roles, and control active user permissions.</p>
                </div>
                <div className="badge badge-primary font-bold p-3">
                    Total Users: {totalUsers}
                </div>
            </div>

            <div className="overflow-x-auto bg-base-100 border border-base-300 rounded-2xl shadow-sm">
                <table className="table table-zebra w-full text-base-content">
                    {/* Table Head */}
                    <thead>
                        <tr className="border-b border-base-300 text-xs font-bold uppercase tracking-wider text-base-content/70 bg-base-200/50">
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
                                <td colSpan="5" className="text-center py-10 font-bold opacity-60 text-sm">
                                    No users found in the system.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id} className="border-b border-base-300/60 font-medium text-sm hover:bg-base-200/30 transition-colors">
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
                                                <span className="text-[10px] text-base-content/50 font-mono block">{user._id}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="text-base-content/90 font-mono text-xs">{user.email}</td>

                                    {/* Role */}
                                    <td>
                                        {user.role === "admin" ? (
                                            <span className="badge badge-error badge-sm gap-1 text-white font-bold p-2.5 rounded-lg shadow-sm">
                                                <FaUserShield className="text-[10px]" /> Admin
                                            </span>
                                        ) : user.isPremium ? (
                                            <span className="badge badge-warning badge-sm gap-1 text-neutral font-black p-2.5 rounded-lg shadow-sm">
                                                <FaCrown className="text-[10px]" /> Premium
                                            </span>
                                        ) : (
                                            <span className="badge bg-base-200 border border-base-300 text-base-content font-bold text-xs gap-1.5 p-2.5 rounded-lg shadow-2xs">
                                                <FaUser className="text-[10px] text-primary" /> Free Tier
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
                                        <div className="flex items-center justify-center gap-2">
                                            {user.email === "admin@recipehub.com" ? (
                                                <span className="text-xs text-amber-500 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 select-none">
                                                    System Protected
                                                </span>
                                            ) : (
                                                <>
                                                    {user.role === "admin" ? (
                                                        <button
                                                            onClick={() => handleUpdateRole(user._id, "user", user.name)}
                                                            className="btn btn-xs btn-warning gap-1 font-bold rounded-lg px-2.5 py-1 h-auto min-h-0 text-white shadow-sm"
                                                            title="Demote to Regular User"
                                                        >
                                                            <FaUserMinus className="text-xs" /> Demote to User
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUpdateRole(user._id, "admin", user.name)}
                                                            className="btn btn-xs btn-outline btn-primary gap-1 font-bold rounded-lg px-2.5 py-1 h-auto min-h-0 shadow-sm"
                                                            title="Promote to Administrator"
                                                        >
                                                            <FaUserShield className="text-xs" /> Make Admin
                                                        </button>
                                                    )}

                                                    {user.isBlocked ? (
                                                        <button
                                                            onClick={() => handleUnblockUser(user._id, user.name)}
                                                            className="btn btn-success btn-xs gap-1 text-white font-bold rounded-lg px-2.5 py-1 h-auto min-h-0"
                                                        >
                                                            <FaUserCheck className="text-xs" /> Unblock
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleBlockUser(user._id, user.name)}
                                                            className="btn btn-error btn-xs gap-1 text-white font-bold rounded-lg px-2.5 py-1 h-auto min-h-0"
                                                        >
                                                            <FaUserSlash className="text-xs" /> Block
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Component */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                        totalItems={totalUsers}
                        limit={limit}
                    />
                </div>
            )}
        </div>
    );
}