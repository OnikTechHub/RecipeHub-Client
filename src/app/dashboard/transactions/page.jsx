"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const TransactionsPage = ()  => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/transactions`)
            .then((res) => res.json())
            .then((data) => {
                setTransactions(data);
                setLoading(false);
            })
            .catch((err) => {
                toast.error("Failed to load transactions");
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center p-10">Loading...</div>;

    return (
        <div className="p-6 bg-base-100 rounded-2xl border border-base-300">
            <h2 className="text-2xl font-bold mb-6">Transactions</h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Transaction ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map((tx) => (
                                <tr key={tx._id}>
                                    <td>{tx.userEmail}</td>
                                    <td>${tx.amount}</td>
                                    <td>{new Date(tx.paidAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${tx.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'} text-white`}>
                                            {tx.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="font-mono text-xs">{tx.transactionId}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="text-center">No transactions found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


export default TransactionsPage;