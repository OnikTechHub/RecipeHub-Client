"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { FaTrash, FaCheck, FaFlag, FaUtensils, FaUser, FaEye, FaXmark, FaClock, FaTriangleExclamation } from "react-icons/fa6";
import Pagination from "@/components/Pagination";
import { HashLoader } from "react-spinners";

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReports, setTotalReports] = useState(0);
    const [selectedReport, setSelectedReport] = useState(null);
    const limit = 8;

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${SERVER_URL}/admin/reports?page=${currentPage}&limit=${limit}`);
            if (res.data?.success && Array.isArray(res.data.data)) {
                // Client-side grouping fallback by recipeId
                const groupedMap = new Map();
                res.data.data.forEach((item) => {
                    const key = item.recipeId || item._id;
                    if (!groupedMap.has(key)) {
                        groupedMap.set(key, item);
                    }
                });
                const uniqueList = Array.from(groupedMap.values());
                setReports(uniqueList);
                setTotalPages(res.data.totalPages || 1);
                setTotalReports(res.data.totalReports !== undefined ? res.data.totalReports : uniqueList.length);
            } else {
                setReports([]);
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

    // Handle Delete Recipe completely (Recipe + all associated Reports)
    const handleDeleteRecipe = async (reportId, recipeId, recipeName) => {
        const confirm = await Swal.fire({
            title: "Delete Recipe & Clear Flags?",
            text: `Permanently delete "${recipeName || 'this recipe'}" from RecipeHub? This will also clear all associated report flags.`,
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
                setReports((prev) => prev.filter((r) => r._id !== reportId && r.recipeId !== recipeId));
                if (selectedReport?._id === reportId || selectedReport?.recipeId === recipeId) {
                    setSelectedReport(null);
                }
                toast.success("Recipe and related reports removed!");
                fetchReports();
            } catch (err) {
                console.error("Delete failed:", err);
                toast.error("Failed to delete recipe!");
            }
        }
    };

    // Handle Dismiss Report Flags for a Recipe
    const handleDismissReport = async (reportId, recipeId, recipeName) => {
        const confirm = await Swal.fire({
            title: "Dismiss All Report Flags?",
            text: `Dismiss all report flags for "${recipeName || 'selected recipe'}"? The recipe will remain active and safe on RecipeHub.`,
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Dismiss All Flags",
            cancelButtonText: "Cancel",
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`${SERVER_URL}/admin/reports/${reportId}?recipeId=${encodeURIComponent(recipeId || '')}`);
                setReports((prev) => prev.filter((r) => r._id !== reportId && r.recipeId !== recipeId));
                if (selectedReport?._id === reportId || selectedReport?.recipeId === recipeId) {
                    setSelectedReport(null);
                }
                toast.success("Report flags dismissed! Recipe remains active.");
                fetchReports();
            } catch (err) {
                console.error("Dismiss failed:", err);
                toast.error("Failed to dismiss report flags!");
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
                        Review reported content grouped by recipe, view detailed report submissions, or dismiss false flags.
                    </p>
                </div>
                <div className="badge badge-error gap-1.5 font-bold p-3 text-white shadow-sm">
                    <FaFlag className="text-xs" /> Reported Recipes: {totalReports}
                </div>
            </div>

            {/* Reports Table Wrapper */}
            <div className="overflow-x-auto bg-base-100 rounded-2xl border border-base-300/60 shadow-xs">
                <table className="table table-zebra w-full text-xs text-base-content">
                    <thead className="bg-base-200/70 text-base-content/70 font-black uppercase text-[10px] tracking-wider border-b border-base-300">
                        <tr>
                            <th className="py-3.5 pl-5">Target Recipe</th>
                            <th className="py-3.5">Reporter Summary</th>
                            <th className="py-3.5">Primary Reason</th>
                            <th className="py-3.5 text-center pr-5">Moderation Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-12 text-base-content/50">
                                    <FaCheck className="w-8 h-8 mx-auto mb-2 text-success opacity-80" />
                                    <p className="font-bold text-sm">No Pending Recipe Flags</p>
                                    <span className="text-xs opacity-60">All community submissions are clear!</span>
                                </td>
                            </tr>
                        ) : (
                            reports.map((report) => {
                                const target = report.recipeInfo || report.recipeDetails;
                                const recipeName = target?.recipeName || report.recipeName || "Recipe Details N/A";
                                const recipeImage = target?.image || target?.recipeImage;
                                const perRecipeCount = report.recipeReportCount || (Array.isArray(report.allRecipeReports) ? report.allRecipeReports.length : 1);

                                return (
                                    <tr key={report._id || report.recipeId} className="hover:bg-base-200/40 border-b border-base-200/50">
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
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] font-mono text-base-content/50">ID: {report.recipeId}</span>
                                                        <span className="badge badge-error font-black text-[10px] px-2 py-0.5 inline-flex items-center gap-1 shadow-xs text-white">
                                                            <FaFlag className="text-[9px]" /> {perRecipeCount} {perRecipeCount === 1 ? "Report" : "Reports"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 font-mono text-xs text-base-content/80">
                                            <div className="flex items-center gap-1.5">
                                                <FaUser className="text-[10px] opacity-40" />
                                                <span>
                                                    {report.reporterEmail || "Anonymous"}
                                                    {perRecipeCount > 1 && (
                                                        <span className="badge badge-sm badge-ghost text-[10px] ml-1.5 font-sans font-bold text-base-content/70">
                                                            +{perRecipeCount - 1} more
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3.5">
                                            <span className="badge badge-warning/20 text-warning-content border border-warning/30 font-bold text-xs p-2">
                                                {report.reason || "Content Flag"}
                                            </span>
                                        </td>
                                        <td className="py-3.5 pr-5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setSelectedReport(report)}
                                                    className="btn btn-neutral btn-xs text-white font-bold gap-1 rounded-lg px-2.5 py-1.5 h-auto min-h-0 shadow-xs"
                                                    title="View all detailed report submissions for this recipe"
                                                >
                                                    <FaEye className="text-[10px]" /> View Details
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteRecipe(report._id, report.recipeId, recipeName)}
                                                    className="btn btn-error btn-xs text-white font-bold gap-1 rounded-lg px-2.5 py-1.5 h-auto min-h-0 shadow-xs"
                                                    title="Permanently remove recipe from database"
                                                >
                                                    <FaTrash className="text-[10px]" /> Delete
                                                </button>

                                                <button
                                                    onClick={() => handleDismissReport(report._id, report.recipeId, recipeName)}
                                                    className="btn btn-success btn-xs text-white font-bold gap-1 rounded-lg px-2.5 py-1.5 h-auto min-h-0 shadow-xs"
                                                    title="Dismiss all flags for this recipe and keep it active"
                                                >
                                                    <FaCheck className="text-[10px]" /> Dismiss
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

            {/* Detailed Report Modal */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
                    <div className="bg-base-100 border border-base-300 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden text-base-content">
                        
                        {/* Modal Header */}
                        <div className="p-5 border-b border-base-300 bg-base-200/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-error/10 text-error rounded-xl border border-error/20">
                                    <FaTriangleExclamation className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black tracking-tight">Recipe Reports Breakdown</h3>
                                    <p className="text-xs text-base-content/60 font-medium">
                                        Recipe ID: <span className="font-mono">{selectedReport.recipeId}</span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="btn btn-ghost btn-circle btn-sm hover:bg-base-300 rounded-xl"
                            >
                                <FaXmark className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6 flex-1">
                            
                            {/* Target Recipe Summary Card */}
                            <div className="flex items-center gap-4 bg-base-200/40 p-4 rounded-2xl border border-base-300/60">
                                <div className="w-14 h-14 rounded-xl bg-base-300 overflow-hidden shrink-0 border border-base-300">
                                    {(selectedReport.recipeInfo?.image || selectedReport.recipeInfo?.recipeImage) ? (
                                        <img
                                            src={selectedReport.recipeInfo?.image || selectedReport.recipeInfo?.recipeImage}
                                            alt="Recipe"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FaUtensils className="text-base-content/30 text-xl" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-base text-base-content truncate">
                                        {selectedReport.recipeInfo?.recipeName || selectedReport.recipeName || "Recipe Title N/A"}
                                    </h4>
                                    <p className="text-xs text-base-content/60 font-medium">
                                        Category: {selectedReport.recipeInfo?.category || "General"} | Price: ${selectedReport.recipeInfo?.price || 0}
                                    </p>
                                </div>
                                <div className="badge badge-error gap-1 font-black text-white text-xs px-3 py-2 shadow-xs">
                                    <FaFlag className="text-[10px]" /> {selectedReport.recipeReportCount || (Array.isArray(selectedReport.allRecipeReports) ? selectedReport.allRecipeReports.length : 1)} Total {((selectedReport.recipeReportCount || 1) === 1) ? "Report" : "Reports"}
                                </div>
                            </div>

                            {/* Reports Submissions Breakdown */}
                            <div className="space-y-3">
                                <h5 className="font-extrabold text-sm text-base-content tracking-tight uppercase text-[11px] opacity-70">
                                    Report Submissions History ({Array.isArray(selectedReport.allRecipeReports) ? selectedReport.allRecipeReports.length : 1})
                                </h5>

                                {Array.isArray(selectedReport.allRecipeReports) && selectedReport.allRecipeReports.length > 0 ? (
                                    selectedReport.allRecipeReports.map((entry, idx) => (
                                        <div key={entry._id || idx} className="bg-base-200/50 p-4 rounded-2xl border border-base-300/60 space-y-2">
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 border-b border-base-300/40 pb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-primary flex items-center gap-1">
                                                        <FaUser className="text-[10px] opacity-60" /> {entry.reporterEmail || "Anonymous"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="badge badge-warning/20 text-warning-content border border-warning/30 font-bold text-[11px] px-2.5 py-1">
                                                        {entry.reason || "Content Flag"}
                                                    </span>
                                                    <span className="text-[10px] opacity-50 flex items-center gap-1">
                                                        <FaClock className="text-[9px]" />
                                                        {entry.reportedAt ? new Date(entry.reportedAt).toLocaleDateString("en-US", {
                                                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                        }) : "N/A"}
                                                    </span>
                                                </div>
                                            </div>

                                            {entry.details && (
                                                <div className="text-xs text-base-content/80 font-medium bg-base-100 p-3 rounded-xl border border-base-300/40">
                                                    <span className="font-bold block text-[10px] uppercase opacity-50 mb-0.5">Reporter Message / Details:</span>
                                                    <p className="whitespace-pre-wrap">{entry.details}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300/60 space-y-2">
                                        <div className="flex justify-between items-center border-b border-base-300/40 pb-2">
                                            <span className="font-mono text-xs font-bold text-primary flex items-center gap-1">
                                                <FaUser className="text-[10px] opacity-60" /> {selectedReport.reporterEmail || "Anonymous"}
                                            </span>
                                            <span className="badge badge-warning/20 text-warning-content border border-warning/30 font-bold text-[11px] px-2.5 py-1">
                                                {selectedReport.reason || "Content Flag"}
                                            </span>
                                        </div>
                                        {selectedReport.details && (
                                            <div className="text-xs text-base-content/80 font-medium bg-base-100 p-3 rounded-xl border border-base-300/40">
                                                <span className="font-bold block text-[10px] uppercase opacity-50 mb-0.5">Reporter Message / Details:</span>
                                                <p className="whitespace-pre-wrap">{selectedReport.details}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="p-4 border-t border-base-300 bg-base-200/60 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="btn btn-ghost btn-sm rounded-xl font-bold normal-case"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => handleDeleteRecipe(selectedReport._id, selectedReport.recipeId, selectedReport.recipeInfo?.recipeName || selectedReport.recipeName)}
                                className="btn btn-error btn-sm text-white font-bold rounded-xl normal-case gap-1.5 shadow-sm"
                            >
                                <FaTrash className="text-xs" /> Delete Recipe Completely
                            </button>
                            <button
                                onClick={() => handleDismissReport(selectedReport._id, selectedReport.recipeId, selectedReport.recipeInfo?.recipeName || selectedReport.recipeName)}
                                className="btn btn-success btn-sm text-white font-bold rounded-xl normal-case gap-1.5 shadow-sm"
                            >
                                <FaCheck className="text-xs" /> Dismiss All Flags
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReports;