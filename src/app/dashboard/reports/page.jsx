"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    useEffect(() => {
        axios.get(`${SERVER_URL}/reports`).then(res => setReports(res.data));
    }, [SERVER_URL]);

    const handleAction = async (reportId, recipeId, action) => {
        try {
            await axios.delete(`${SERVER_URL}/reports/${reportId}?action=${action}&recipeId=${recipeId}`);
            setReports(reports.filter(r => r._id !== reportId));
            toast.success(action === 'delete' ? "Recipe removed!" : "Report dismissed!");
        } catch (err) {
            toast.error("Failed to perform action!");
        }
    };

    return (
        <div className="p-6">
            <Toaster position="top-center" />
            <h2 className="text-2xl font-bold mb-6">Recipe Reports</h2>
            <div className="overflow-x-auto shadow-md rounded-lg bg-white">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-4">Recipe Name</th>
                            <th className="p-4">Reporter</th>
                            <th className="p-4">Reason</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report._id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-800">
                                    {report.recipeDetails?.recipeName || "Recipe Deleted"}
                                </td>
                                <td className="p-4 text-sm">{report.reporterEmail}</td>
                                <td className="p-4 text-sm">{report.reason}</td>
                                <td className="p-4 flex gap-2">
                                    <button
                                        onClick={() => handleAction(report._id, report.recipeId, 'delete')}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold transition"
                                    >
                                        Remove Recipe
                                    </button>
                                    <button
                                        onClick={() => handleAction(report._id, null, 'dismiss')}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold transition"
                                    >
                                        Dismiss Report
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