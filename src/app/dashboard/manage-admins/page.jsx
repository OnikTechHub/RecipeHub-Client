"use client";
import React, { useState, useEffect } from "react";
import { FaUserShield, FaUserMinus, FaShieldHalved } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import { HashLoader } from "react-spinners";
import Pagination from "@/components/Pagination";

export default function ManageAdmins() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalAdmins, setTotalAdmins] = useState(0);
    const limit = 8;

    // Load admins with pagination & search
    const loadAdmins = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/admins?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`
            );
            const data = await res.json();
            if (data.success) {
                setAdmins(data.data || []);
                setTotalPages(data.totalPages || 1);
                setTotalAdmins(data.totalAdmins || (data.data ? data.data.length : 0));
            }
        } catch (error) {
            console.error("Failed to fetch admins:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdmins();
    }, [currentPage, searchQuery]);

    // Handle Search Submission / Instant change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    // Demote Admin to User function
    const handleDemoteAdmin = async (id, name) => {
        const confirm = await Swal.fire({
            title: "Demote Admin?",
            text: `Are you sure you want to revoke Administrator status from ${name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f59e0b",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Demote to User",
        });

        if (confirm.isConfirmed) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/users/role/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ role: "user" }),
                });
                const data = await res.json();
                if (data.success) {
                    Swal.fire({
                        title: "Demoted!",
                        text: `${name} has been demoted to a standard user.`,
                        icon: "success",
                        confirmButtonColor: "#10b981",
                    });
                    loadAdmins();
                } else {
                    Swal.fire("Error", data.message || "Failed to demote administrator.", "error");
                }
            } catch (error) {
                console.error("Error demoting admin:", error);
                Swal.fire("Error", "Failed to demote administrator.", "error");
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-base-300 pb-4">
                <div>
                    <h1 className="text-2xl font-black text-base-content tracking-tight flex items-center gap-2">
                        <FaShieldHalved className="text-primary" /> Manage Administrators
                    </h1>
                    <p className="text-xs text-base-content/60 font-medium mt-1">
                        View system administrators, monitor administrative privileges, and adjust access rights.
                    </p>
                </div>
                <div className="badge badge-primary font-bold p-3 gap-1">
                    <FaUserShield /> Total Admins: {totalAdmins}
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-base-100 p-4 border border-base-300 rounded-2xl shadow-sm">
                <div className="relative w-full sm:w-80">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-sm" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search admins by name or email..."
                        className="input input-sm input-bordered w-full pl-10 text-xs font-medium rounded-xl focus:outline-none focus:border-primary"
                    />
                </div>
                <span className="text-xs text-base-content/50 font-medium hidden sm:block">
                    Showing page {currentPage} of {totalPages}
                </span>
            </div>

            {/* Admins Table */}
            {loading ? (
                <div className="min-h-[40vh] flex flex-col justify-center items-center gap-4">
                    <HashLoader color="#10b981" size={50} />
                    <p className="text-xs font-bold text-base-content/60 tracking-wider uppercase animate-pulse">
                        Loading Administrators...
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-base-100 border border-base-300 rounded-2xl shadow-sm">
                    <table className="table table-zebra w-full text-base-content">
                        {/* Table Head */}
                        <thead>
                            <tr className="border-b border-base-300 text-xs font-bold uppercase tracking-wider text-base-content/70 bg-base-200/50">
                                <th>Admin Details</th>
                                <th>Email</th>
                                <th>Role Tier</th>
                                <th>Status</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {admins.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 font-bold opacity-60 text-sm">
                                        No administrators found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                admins.map((admin) => (
                                    <tr key={admin._id} className="border-b border-base-300/60 font-medium text-sm hover:bg-base-200/30 transition-colors">
                                        {/* Admin Details */}
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-10 h-10 bg-base-300">
                                                        <img
                                                            src={admin.image || "https://api.dicebear.com/7.x/bottts/svg?seed=fallback"}
                                                            alt={admin.name}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-base-content flex items-center gap-1.5">
                                                        {admin.name}
                                                        {admin.email === "admin@recipehub.com" && (
                                                            <span className="badge badge-warning badge-xs text-[9px] font-black uppercase tracking-wider">
                                                                Root
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] text-base-content/50 font-mono block">{admin._id}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="text-base-content/90 font-mono text-xs">{admin.email}</td>

                                        {/* Role Tier */}
                                        <td>
                                            <span className="badge badge-error badge-sm gap-1 text-white font-bold p-2.5 rounded-lg shadow-sm">
                                                <FaUserShield className="text-[10px]" /> Administrator
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td>
                                            {admin.isBlocked ? (
                                                <span className="badge badge-ghost text-error bg-error/10 border-error/20 font-bold text-xs p-2">
                                                    Blocked
                                                </span>
                                            ) : (
                                                <span className="badge badge-ghost text-success bg-success/10 border-success/20 font-bold text-xs p-2">
                                                    Active
                                                </span>
                                            )}
                                        </td>

                                        {/* Action */}
                                        <td className="text-center">
                                            {admin.email === "admin@recipehub.com" ? (
                                                <span className="text-xs text-amber-500 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 select-none">
                                                    System Root Protected
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleDemoteAdmin(admin._id, admin.name)}
                                                    className="btn btn-xs btn-warning gap-1 font-bold rounded-lg px-2.5 py-1 h-auto min-h-0 text-white shadow-sm"
                                                    title="Demote to Regular User"
                                                >
                                                    <FaUserMinus className="text-xs" /> Demote to User
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Component */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                        totalItems={totalAdmins}
                        limit={limit}
                    />
                </div>
            )}
        </div>
    );
}
