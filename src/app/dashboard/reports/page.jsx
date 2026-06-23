"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    useEffect(() => {
        axios.get(`${SERVER_URL}/reports`).then((res) => setReports(res.data));
    }, [SERVER_URL]);

    const handleAction = async (reportId, recipeId, action) => {
        try {
            await axios.delete(`${SERVER_URL}/reports/${reportId}?action=${action}&recipeId=${recipeId}`);
            setReports(reports.filter((r) => r._id !== reportId));
            toast.success(action === "delete" ? "Recipe removed!" : "Report dismissed!");
        } catch (err) {
            toast.error("Failed to perform action!");
        }
    };

    return (
        <div className="p-4 md:p-6 min-h-screen transition-colors duration-300  ">
            <Toaster position="top-center" />
            <h2 className="text-2xl font-bold mb-6">Recipe Reports</h2>

            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 ">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                            <th className="p-4 text-sm md:text-base font-semibold">Recipe Name</th>
                            <th className="p-4 text-sm md:text-base font-semibold">Reporter</th>
                            <th className="p-4 text-sm md:text-base font-semibold">Reason</th>
                            <th className="p-4 text-sm md:text-base font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr
                                key={report._id}
                                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-300/50 transition-colors"
                            >
                                <td className="p-4 text-sm md:text-base">
                                    {report.recipeDetails?.recipeName || "Recipe Deleted"}
                                </td>
                                <td className="p-4 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                    {report.reporterEmail}
                                </td>
                                <td className="p-4 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                    {report.reason}
                                </td>
                                <td className="p-4 flex gap-2 justify-center">
                                    <button
                                        onClick={() => handleAction(report._id, report.recipeId, "delete")}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold transition"
                                    >
                                        Remove
                                    </button>
                                    <button
                                        onClick={() => handleAction(report._id, null, "dismiss")}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold transition"
                                    >
                                        Dismiss
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReports;