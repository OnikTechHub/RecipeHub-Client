"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { FaTrash, FaCheck, FaFlag, FaUtensils, FaUser } from "react-icons/fa6";
import Pagination from "@/components/Pagination";
import { HashLoader } from "react-spinners";

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReports, setTotalReports] = useState(0);
    const limit = 8;

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${SERVER_URL}/admin/reports?page=${currentPage}&limit=${limit}`);
            if (res.data?.success) {
                setReports(res.data.data || []);
                setTotalPages(res.data.totalPages || 1);
                setTotalReports(res.data.totalReports !== undefined ? res.data.totalReports : (res.data.data?.length || 0));
            } else {
                setReports(Array.isArray(res.data) ? res.data : []);
            }
        } catch (err) {
            console.error("Failed to load reports:", err);
            toast.error("Failed to load community reports!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [currentPage, SERVER_URL]);

    // Handle Delete Recipe completely (Recipe + Reports)
    const handleDeleteRecipe = async (reportId, recipeId, recipeName) => {
        const confirm = await Swal.fire({
            title: "Delete Recipe & Clear Flags?",
            text: `Permanently delete "${recipeName || 'this recipe'}" from RecipeHub? This will also clear all report flags.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Delete Recipe Completely",
            cancelButtonText: "Cancel",
        });

        if (confirm.isConfirmed) {
            try {
                if (recipeId) {
                    await fetch(`${SERVER_URL}/admin/recipes/${recipeId}`, { method: "DELETE" });
                } else {
                    await axios.delete(`${SERVER_URL}/reports/${reportId}?action=delete`);
                }
                setReports(reports.filter((r) => r._id !== reportId && r.recipeId !== recipeId));
                toast.success("Recipe and related reports removed!");
                fetchReports();
            } catch (err) {
                console.error("Delete failed:", err);
                toast.error("Failed to delete recipe!");
            }
        }
    };

    // Handle Dismiss Report (Recipe stays safe)
    const handleDismissReport = async (reportId, recipeName) => {
        const confirm = await Swal.fire({
            title: "Dismiss Report Flag?",
            text: `Dismiss this flag? The recipe "${recipeName || 'selected recipe'}" will remain published and safe.`,
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Dismiss Flag",
            cancelButtonText: "Cancel",
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`${SERVER_URL}/admin/reports/${reportId}`);
                setReports(reports.filter((r) => r._id !== reportId));
                toast.success("Report flag dismissed! Recipe remains active.");
                fetchReports();
            } catch (err) {
                console.error("Dismiss failed:", err);
                toast.error("Failed to dismiss report!");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col justify-center items-center gap-4">
                <HashLoader color="#10b981" size={50} />
                <p className="text-xs font-bold text-base-content/60 tracking-wider uppercase animate-pulse">
                    Loading Reported Recipes...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Toaster position="top-center" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-base-300 pb-4">
                <div>
                    <h1 className="text-2xl font-black text-base-content tracking-tight">Community Recipe Reports</h1>
                    <p className="text-xs text-base-content/60 font-medium mt-1">
                        Review reported content, take moderation actions, or dismiss false flags.
                    </p>
                </div>
                <div className="badge badge-error gap-1.5 font-bold p-3 text-white">
                    <FaFlag className="text-xs" /> Total Reports: {totalReports}
                </div>
            </div>

            {/* Reports Table Wrapper */}
            <div className="overflow-x-auto bg-base-100 rounded-2xl border border-base-300/60 shadow-xs">
                <table className="table table-zebra w-full text-xs text-base-content">
                    <thead className="bg-base-200/70 text-base-content/70 font-black uppercase text-[10px] tracking-wider border-b border-base-300">
                        <tr>
                            <th className="py-3.5 pl-5">Target Recipe</th>
                            <th className="py-3.5">Reporter Email</th>
                            <th className="py-3.5">Report Reason</th>
                            <th className="py-3.5 text-center pr-5">Moderation Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-12 text-base-content/50">
                                    <FaCheck className="w-8 h-8 mx-auto mb-2 text-success opacity-80" />
                                    <p className="font-bold text-sm">No Pending Reports</p>
                                    <span className="text-xs opacity-60">All community submissions are clear!</span>
                                </td>
                            </tr>
                        ) : (
                            reports.map((report) => {
                                const target = report.recipeInfo || report.recipeDetails;
                                const recipeName = target?.recipeName || report.recipeName || "Recipe Details N/A";
                                const recipeImage = target?.image || target?.recipeImage;

                                return (
                                    <tr key={report._id} className="hover:bg-base-200/40 border-b border-base-200/50">
                                        <td className="py-3.5 pl-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center overflow-hidden shrink-0 border border-base-300/60">
                                                    {recipeImage ? (
                                                        <img src={recipeImage} alt={recipeName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FaUtensils className="text-base-content/30" />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-sm block text-base-content">{recipeName}</span>
                                                    <span className="text-[10px] font-mono text-base-content/50 block">ID: {report.recipeId}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 font-mono text-xs text-base-content/80">
                                            <div className="flex items-center gap-1.5">
                                                <FaUser className="text-[10px] opacity-40" />
                                                <span>{report.reporterEmail}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5">
                                            <span className="badge badge-warning/20 text-warning-content border-warning/30 font-bold text-xs p-2">
                                                {report.reason || "Content Flag"}
                                            </span>
                                        </td>
                                        <td className="py-3.5 pr-5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleDeleteRecipe(report._id, report.recipeId, recipeName)}
                                                    className="btn btn-error btn-xs text-white font-bold gap-1 rounded-lg px-3 py-1.5 h-auto min-h-0 shadow-xs"
                                                    title="Permanently remove recipe from database"
                                                >
                                                    <FaTrash className="text-[10px]" /> Delete Recipe
                                                </button>

                                                <button
                                                    onClick={() => handleDismissReport(report._id, recipeName)}
                                                    className="btn btn-success btn-xs text-white font-bold gap-1 rounded-lg px-3 py-1.5 h-auto min-h-0 shadow-xs"
                                                    title="Dismiss flag and keep recipe active"
                                                >
                                                    <FaCheck className="text-[10px]" /> Dismiss Report
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>

                {/* Universal Pagination */}
                {totalPages > 1 && (
                    <div className="p-3 border-t border-base-300/40 bg-base-100/50">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalReports}
                            itemsPerPage={limit}
                            onPageChange={(p) => setCurrentPage(p)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReports;