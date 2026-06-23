"use client";
import React, { useState, useEffect } from "react";
import { FaBookmark, FaClock, FaArrowRight, FaCrown, FaUtensils, FaBan } from "react-icons/fa6";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const MyPurchasedRecipesPage = () => {
    const [purchasedItems, setPurchasedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("session_id");

    const { data: session, isPending } = authClient.useSession();
    const currentUserEmail = session?.user?.email;
    const currentUserId = session?.user?.id || session?.user?._id;

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    const verifyStripePayment = async () => {
        if (!sessionId || !currentUserId) return;

        setVerifying(true);
        try {
            const res = await fetch(`${SERVER_URL}/verify-payment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sessionId: sessionId,
                    userId: currentUserId
                }),
            });
            const data = await res.json();

            if (data.success) {
                toast.dismiss();

                toast.success("Payment Successful!", {
                    duration: 1000,
                    position: "top-center",
                    style: {
                        background: "#1e1b4b", 
                        color: "#ffffff",
                        fontWeight: "800",
                        fontSize: "14px",
                        padding: "12px 24px",
                        borderRadius: "12px",
                        border: "1px solid rgba(16, 185, 129, 0.3)", 
                    },
                    iconTheme: {
                        primary: "#10b981",
                        secondary: "#ffffff",
                    },
                });

                router.replace("/dashboard/purchased-recipes");
                fetchPurchasedRecipes();
            } else {
                toast.error(data.message || "Payment verification failed.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Verification error:", error);
            toast.error("Error confirming your payment with server.");
            setLoading(false);
        } finally {
            setVerifying(false);
        }
    };

    const fetchPurchasedRecipes = async () => {
        if (!currentUserEmail) return;

        try {
            const res = await fetch(`${SERVER_URL}/transactions?email=${currentUserEmail}`);
            const data = await res.json();

            if (data.success) {
                setPurchasedItems(data.data);
            } else {
                toast.error(data.message || "Failed to load purchased items.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Something went wrong while fetching purchased history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUserEmail) {
            if (sessionId) {
                verifyStripePayment();
            } else {
                fetchPurchasedRecipes();
            }
        } else if (!isPending && !currentUserEmail) {
            setLoading(false);
        }
    }, [currentUserEmail, isPending, sessionId]);

    if (isPending || loading || verifying) {
        return (
            <div className="w-full h-[70vh] flex flex-col items-center justify-center bg-transparent gap-3">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                {verifying && <p className="text-xs font-bold text-primary animate-pulse">Securing your transaction with Stripe...</p>}
            </div>
        );
    }

    if (!currentUserEmail) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center text-base-content p-4">
                <div className="bg-error/10 p-4 rounded-full text-error mb-4 text-2xl">
                    <FaBan />
                </div>
                <h3 className="text-lg font-black">Authentication Required</h3>
                <p className="text-xs opacity-70 mt-1 mb-4">Please log in to check your purchased items.</p>
                <Link href="/login" className="btn btn-primary rounded-xl btn-sm font-bold normal-case">
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full text-base-content space-y-6 p-1 md:p-4">
            
            <Toaster position="top-center" toastOptions={{ duration: 1000 }} limit={1} />

            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    My Purchased Items
                </h1>
                <p className="text-xs text-base-content/60">
                    Access all your unlocked premium recipes and active subscription receipts.
                </p>
            </div>

            {purchasedItems.length === 0 ? (
                <div className="bg-base-200/20 border border-dashed border-base-300 rounded-2xl p-10 text-center">
                    <div className="text-3xl opacity-30 flex justify-center mb-2">
                        <FaBookmark />
                    </div>
                    <h3 className="text-base font-bold opacity-80">No Purchases Found</h3>
                    <p className="text-xs opacity-60 mt-1 mb-4">You haven't bought any premium features or recipes yet.</p>
                    <Link href="/browse-recipes" className="btn btn-primary rounded-xl font-bold normal-case btn-sm">
                        Explore Premium Recipes
                    </Link>
                </div>
            ) : (
                <div className="bg-base-100 border border-base-300/40 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full text-left">
                            <thead className="bg-base-200/80 text-base-content/80 text-[11px] font-black uppercase tracking-wider border-b border-base-300">
                                <tr>
                                    <th className="py-4 pl-6">Item Details</th>
                                    <th className="py-4">Amount</th>
                                    <th className="py-4">Date</th>
                                    <th className="py-4">Transaction ID</th>
                                    <th className="py-4 pr-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs font-semibold">
                                {purchasedItems.map((item) => (
                                    <tr key={item._id} className="hover:bg-base-200/20 transition-colors border-b border-base-200/50">
                                        <td className="py-4 pl-6">
                                            {item.recipeId === "membership_upgrade" ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                                                        <FaCrown className="text-base" />
                                                    </div>
                                                    <div>
                                                        <span className="font-black text-amber-600 block">Premium Membership</span>
                                                        <span className="text-[10px] opacity-50 block">Unlimited Recipe Uploads Activated</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    {item.recipeInfo?.recipeImage ? (
                                                        <img
                                                            src={item.recipeInfo.recipeImage}
                                                            alt={item.recipeInfo.recipeName}
                                                            className="w-9 h-9 rounded-xl object-cover border border-base-300 shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                                                            <FaUtensils className="text-sm" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="font-black block truncate max-w-[200px]">
                                                            {item.recipeInfo?.recipeName || "Premium Recipe"}
                                                        </span>
                                                        <span className="text-[10px] opacity-50 block">Category: {item.recipeInfo?.category || "Shared"}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </td>

                                        <td className="py-4 font-black text-primary text-sm">
                                            ${item.amount ? Number(item.amount).toFixed(2) : "0.00"}
                                        </td>

                                        <td className="py-4 opacity-80">
                                            <div className="flex items-center gap-1.5">
                                                <FaClock className="text-[11px] opacity-40" />
                                                <span>
                                                    {item.paidAt ? new Date(item.paidAt).toLocaleDateString("en-US", {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    }) : "N/A"}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="py-4 font-mono text-[11px] opacity-70 select-all">
                                            {item.transactionId || "N/A"}
                                        </td>

                                        <td className="py-4 pr-6 text-right">
                                            {item.recipeId !== "membership_upgrade" ? (
                                                <Link
                                                    href={`/dashboard/purchased-recipes/${item.recipeId}`}
                                                    className="btn btn-primary btn-xs font-bold rounded-xl normal-case gap-1 hover:scale-105 transition-transform"
                                                >
                                                    <span>View Details</span>
                                                    <FaArrowRight className="text-[9px]" />
                                                </Link>
                                            ) : (
                                                <span className="badge badge-sm bg-success/10 text-success border-success/20 font-black text-[10px] tracking-wide uppercase px-2.5 py-2">
                                                    Active Premium
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPurchasedRecipesPage;