"use client";
import React, { useState } from "react";
import { FaFlag } from "react-icons/fa6";
import { toast } from "react-hot-toast";

const ReportModal = ({ isOpen, onClose, recipeId, currentUserEmail, serverUrl }) => {
    const [reportReason, setReportReason] = useState("Spam");
    const [submittingReport, setSubmittingReport] = useState(false);

    if (!isOpen) return null;

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        setSubmittingReport(true);

        try {
            const res = await fetch(`${serverUrl}/reports`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipeId: recipeId,
                    reporterEmail: currentUserEmail,
                    reason: reportReason, // 'Spam', 'Offensive Content', 'Copyright Issue'
                    status: "pending",
                    createdAt: new Date(),
                })
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Recipe reported successfully. Admin will review it!");
                onClose();
            } else {
                toast.error(data.message || "Failed to submit report.");
            }
        } catch (error) {
            console.error("Report error:", error);
            toast.error("Failed to submit report.");
        } finally {
            setSubmittingReport(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-base-100 border border-base-300 w-full max-w-md p-6 rounded-2xl shadow-2xl relative text-base-content animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-xl font-black mb-1 flex items-center gap-2 text-error">
                    <FaFlag /> Report Recipe
                </h3>
                <p className="text-xs text-base-content/70 mb-4">Please select a reason for reporting this recipe.</p>

                <form onSubmit={handleReportSubmit} className="space-y-3">
                    {["Spam", "Offensive Content", "Copyright Issue"].map((reason) => (
                        <label
                            key={reason}
                            className={`label cursor-pointer justify-start gap-3 bg-base-200/50 p-3 rounded-xl border transition-all ${reportReason === reason ? "border-error bg-error/5" : "border-base-300/60"
                                }`}
                        >
                            <input
                                type="radio"
                                name="report_reason"
                                className="radio radio-error radio-sm"
                                checked={reportReason === reason}
                                onChange={() => setReportReason(reason)}
                            />
                            <span className="label-text font-bold text-sm">{reason}</span>
                        </label>
                    ))}

                    <div className="flex justify-end gap-3 pt-3 border-t border-base-300/50 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost rounded-xl normal-case font-bold btn-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submittingReport}
                            className="btn btn-error rounded-xl normal-case font-bold text-white btn-sm"
                        >
                            {submittingReport ? "Submitting..." : "Submit Report"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;