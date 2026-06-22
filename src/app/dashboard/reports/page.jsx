"use client";
import React, { useEffect, useState } from "react";
import { FaFlag, FaTrash, FaCheck, FaUtensils } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ReportsPage() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/reports`);
            const data = await res.json();
            if (data.success) {
                setReports(data.data);
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleRemoveRecipe = async (recipeId, reportId) => {
        if (!confirm("Are you sure you want to remove this recipe from the platform?")) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/recipes/${recipeId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Recipe removed successfully!");
                setReports(reports.filter(report => report._id !== reportId));
            }
        } catch (error) {
            toast.error("Failed to remove recipe.");
        }
    };

    const handleDismissReport = async (reportId) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/reports/${reportId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Report dismissed.");
                setReports(reports.filter(report => report._id !== reportId));
            }
        } catch (error) {
            toast.error("Failed to dismiss report.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg text-error"></span>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto transition-colors duration-300">
            <div className="flex items-center gap-3 mb-8 border-b border-base-300 pb-4">
                <FaFlag className="text-error text-2xl" />
                <div>
                    <h1 className="text-3xl font-black">Recipe Reports</h1>
                    <p className="text-sm opacity-60 mt-1">Review and manage reported items from users.</p>
                </div>
            </div>

            {reports.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-base-300 rounded-2xl bg-base-200/30">
                    <FaUtensils className="mx-auto text-4xl opacity-30 mb-3" />
                    <p className="opacity-50 font-bold text-base">No pending reports found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-base-200/40 border border-base-300 rounded-2xl shadow-sm backdrop-blur-sm">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr className="text-base-content/70 border-b border-base-300">
                                <th className="py-4">Recipe Info</th>
                                <th className="py-4">Reported By</th>
                                <th className="py-4">Reason</th>
                                <th className="py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report._id} className="hover border-b border-base-200">
                                    <td className="py-4">
                                        <div className="font-extrabold text-base-content/90">{report.recipeName || report.recipeId?.recipeName}</div>
                                        <div className="text-xs opacity-50 font-mono mt-0.5">ID: {report.recipeId?._id || report.recipeId}</div>
                                    </td>
                                    <td className="font-semibold text-sm opacity-80">{report.reportedBy || "Anonymous"}</td>
                                    <td className="py-4">
                                        <span className={`badge badge-sm font-bold px-2.5 py-2 ${report.reason === "Spam" ? "badge-warning text-amber-900" :
                                                report.reason === "Offensive Content" ? "badge-error text-white" : "badge-neutral"
                                            }`}>
                                            {report.reason}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleRemoveRecipe(report.recipeId?._id || report.recipeId, report._id)}
                                            className="btn btn-sm btn-error text-white gap-1 px-3 shadow-sm"
                                        >
                                            <FaTrash className="text-[10px]" /> Remove
                                        </button>
                                        <button
                                            onClick={() => handleDismissReport(report._id)}
                                            className="btn btn-sm btn-ghost border border-base-300 gap-1 px-3"
                                        >
                                            <FaCheck className="text-[10px] text-success" /> Dismiss
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}