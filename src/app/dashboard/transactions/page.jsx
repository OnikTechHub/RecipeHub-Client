"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaMoneyBillWave, FaHandHoldingDollar, FaBuildingColumns, FaReceipt, FaEye, FaXmark, FaCheckCircle, FaUser, FaCrown, FaUtensils } from "react-icons/fa6";
import Pagination from "@/components/Pagination";
import { HashLoader } from "react-spinners";
import { SERVER_URL } from "@/lib/apiConfig";

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [selectedTx, setSelectedTx] = useState(null);
    const limit = 10;

    // Financial totals
    const [stats, setStats] = useState({
        grossVolume: 0,
        creatorPayouts: 0,
        platformCommission: 0,
    });

    const fetchTransactions = () => {
        setLoading(true);
        fetch(`${SERVER_URL}/admin/transactions?page=${currentPage}&limit=${limit}`)
            .then((res) => res.json())
            .then((resData) => {
                const list = resData.data || (Array.isArray(resData) ? resData : []);
                setTransactions(list);
                setTotalPages(resData.totalPages || 1);
                setTotalTransactions(resData.totalTransactions || list.length);

                // Calculate financial totals
                const gross = list.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
                const creators = list.reduce((acc, curr) => acc + (Number(curr.creatorEarnings) || 0), 0);
                const platform = list.reduce((acc, curr) => acc + (Number(curr.adminEarnings) || (Number(curr.amount) - (Number(curr.creatorEarnings) || 0))), 0);

                setStats({
                    grossVolume: gross,
                    creatorPayouts: creators,
                    platformCommission: platform,
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load transactions", err);
                toast.error("Failed to load transactions");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTransactions();
    }, [currentPage]);

    if (loading) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4">
                <HashLoader color="#10b981" size={50} />
                <span className="text-xs text-base-content/60 font-medium tracking-wide">Loading transactions ledger...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black tracking-tight text-base-content">
                    Revenue & Transaction Ledger
                </h1>
                <p className="text-xs text-base-content/60 mt-1">
                    Complete audit trail of all recipe purchases, platform subscriptions, and 80/20 revenue splits.
                </p>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-base-100 p-5 rounded-2xl border border-base-300/60 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
                        <FaMoneyBillWave />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/60 block">
                            Gross Volume
                        </span>
                        <span className="text-2xl font-black text-base-content block">
                            ${stats.grossVolume.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="bg-base-100 p-5 rounded-2xl border border-base-300/60 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                        <FaHandHoldingDollar />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
                            Creator Earnings (80%)
                        </span>
                        <span className="text-2xl font-black text-base-content block">
                            ${stats.creatorPayouts.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="bg-base-100 p-5 rounded-2xl border border-base-300/60 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl shrink-0">
                        <FaBuildingColumns />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
                            Platform Net (20%)
                        </span>
                        <span className="text-2xl font-black text-base-content block">
                            ${stats.platformCommission.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-base-100 rounded-2xl border border-base-300/60 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full text-xs text-base-content">
                        <thead className="bg-base-200/70 text-base-content/70 font-black uppercase text-[10px] tracking-wider border-b border-base-300">
                            <tr>
                                <th className="py-3.5 pl-5">Buyer Email</th>
                                <th className="py-3.5">Item / Recipe</th>
                                <th className="py-3.5">Gross Paid</th>
                                <th className="py-3.5 text-emerald-600">Creator (80%)</th>
                                <th className="py-3.5 text-amber-600">Admin (20%)</th>
                                <th className="py-3.5">Date</th>
                                <th className="py-3.5">Status</th>
                                <th className="py-3.5 text-center pr-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((tx) => {
                                    const amount = Number(tx.amount || 0);
                                    const creator = Number(tx.creatorEarnings || 0);
                                    const admin = Number(tx.adminEarnings || (amount - creator));

                                    return (
                                        <tr key={tx._id} className="hover:bg-base-200/40 border-b border-base-200/50">
                                            <td className="py-3.5 pl-5 font-bold truncate max-w-[180px]">
                                                {tx.userEmail}
                                            </td>
                                            <td className="py-3.5 font-semibold text-base-content/80">
                                                {tx.title || (tx.recipeId === "membership_upgrade" ? "Pro Membership" : "Recipe Access")}
                                            </td>
                                            <td className="py-3.5 font-black text-base-content">
                                                ${amount.toFixed(2)}
                                            </td>
                                            <td className="py-3.5 font-bold text-emerald-600">
                                                {creator > 0 ? `$${creator.toFixed(2)}` : "-"}
                                            </td>
                                            <td className="py-3.5 font-bold text-amber-600">
                                                ${admin.toFixed(2)}
                                            </td>
                                            <td className="py-3.5 opacity-70 whitespace-nowrap">
                                                {tx.paidAt ? new Date(tx.paidAt).toLocaleDateString() : "N/A"}
                                            </td>
                                            <td className="py-3.5">
                                                <span className={`badge badge-xs font-bold uppercase tracking-wider ${
                                                    tx.paymentStatus === 'paid' ? 'badge-success text-white' : 'badge-warning text-white'
                                                }`}>
                                                    {tx.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="py-3.5 pr-5 text-center">
                                                <button
                                                    onClick={() => setSelectedTx(tx)}
                                                    className="btn btn-xs btn-ghost btn-square rounded-lg text-primary hover:bg-primary/10"
                                                    title="View Transaction Details"
                                                >
                                                    <FaEye className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-12 text-base-content/50">
                                        <FaReceipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                        No transactions recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-3 border-t border-base-300/40 bg-base-100/50">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalTransactions}
                        itemsPerPage={limit}
                        onPageChange={(p) => setCurrentPage(p)}
                    />
                </div>
            </div>

            {/* Detailed Transaction Inspection Modal */}
            {selectedTx && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-base-100 border border-base-300 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative text-base-content">
                        <button
                            onClick={() => setSelectedTx(null)}
                            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
                        >
                            <FaXmark />
                        </button>

                        <div className="border-b border-base-300 pb-3 pr-8">
                            <span className="badge badge-success text-white text-[10px] font-bold uppercase tracking-wider mb-1">
                                {selectedTx.paymentStatus || "Paid"}
                            </span>
                            <h3 className="text-xl font-black">Transaction Breakdown</h3>
                            <p className="text-xs text-base-content/60 font-mono mt-0.5">
                                Ref: {selectedTx.transactionId || selectedTx._id}
                            </p>
                        </div>

                        <div className="space-y-3 text-xs font-medium">
                            <div className="p-3 bg-base-200/50 rounded-xl space-y-1">
                                <span className="text-[10px] font-bold uppercase opacity-50 block">Item Purchased</span>
                                <span className="font-bold text-sm block text-primary">
                                    {selectedTx.title || (selectedTx.recipeId === "membership_upgrade" ? "RecipeHub Pro Upgrade" : "Recipe Unlock")}
                                </span>
                                {selectedTx.recipeId && (
                                    <span className="text-[10px] font-mono opacity-60 block">Recipe ID: {selectedTx.recipeId}</span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 bg-base-200/50 rounded-xl">
                                    <span className="text-[10px] font-bold uppercase opacity-50 block">Buyer Email</span>
                                    <span className="font-semibold block truncate">{selectedTx.userEmail}</span>
                                </div>

                                <div className="p-3 bg-base-200/50 rounded-xl">
                                    <span className="text-[10px] font-bold uppercase opacity-50 block">Date & Time</span>
                                    <span className="font-semibold block">
                                        {selectedTx.paidAt ? new Date(selectedTx.paidAt).toLocaleString() : "N/A"}
                                    </span>
                                </div>
                            </div>

                            {/* Revenue Breakdown */}
                            <div className="p-3 bg-base-200/50 rounded-xl space-y-2 border border-base-300/40">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60 block border-b border-base-300 pb-1">
                                    Financial Split (80/20)
                                </span>

                                <div className="flex justify-between items-center text-xs">
                                    <span className="opacity-70">Gross Amount:</span>
                                    <span className="font-black text-sm">${Number(selectedTx.amount || 0).toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between items-center text-xs text-emerald-600">
                                    <span>Creator Share (80%):</span>
                                    <span className="font-bold">${Number(selectedTx.creatorEarnings || 0).toFixed(2)}</span>
                                </div>
                                {selectedTx.creatorEmail && (
                                    <span className="text-[10px] text-emerald-600/80 font-mono block">
                                        Paid to: {selectedTx.creatorEmail}
                                    </span>
                                )}

                                <div className="flex justify-between items-center text-xs text-amber-600 pt-1 border-t border-base-300/30">
                                    <span>Platform Net (20%):</span>
                                    <span className="font-bold">${Number(selectedTx.adminEarnings || (Number(selectedTx.amount || 0) - Number(selectedTx.creatorEarnings || 0))).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => setSelectedTx(null)}
                                className="btn btn-sm btn-primary w-full rounded-xl font-bold text-white"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionsPage;