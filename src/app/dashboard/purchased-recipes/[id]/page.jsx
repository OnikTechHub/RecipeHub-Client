
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import {
    FaClock, FaUtensils, FaHeart, FaFlag, FaArrowLeft,
    FaReceipt, FaCircleCheck, FaCalendarDays, FaHashtag, FaDollarSign
} from "react-icons/fa6";

const PurchasedRecipeDetails = () => {
    const { id } = useParams();
    const router = useRouter();
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    const currentUserEmail = session?.user?.email;

    const [recipe, setRecipe] = useState(null);
    const [purchaseInfo, setPurchaseInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reportReason, setReportReason] = useState("Spam");
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    useEffect(() => {
        if (!id || !currentUserEmail) return;

        const fetchPurchasedData = async () => {
            try {
                setLoading(true);

                const paymentRes = await fetch(`${SERVER_URL}/purchased-details/${id}?email=${currentUserEmail}`);
                const paymentData = await paymentRes.json();

                if (paymentData.success) {
                    setPurchaseInfo(paymentData.data);
                } else {
                    toast.error("Purchase history not found!");
                    setLoading(false);
                    return;
                }

                const recipeRes = await fetch(`${SERVER_URL}/recipes/${id}`);
                const recipeData = await recipeRes.json();

                if (recipeData.success) {
                    setRecipe(recipeData.data);
                } else {
                    toast.error("Recipe details not found!");
                }
            } catch (error) {
                console.error("Error details:", error);
                toast.error("Failed to load details.");
            } finally {
                setLoading(false);
            }
        };

        if (!sessionLoading) {
            if (!currentUserEmail) {
                toast.error("Please login first!");
                router.push("/login");
            } else {
                fetchPurchasedData();
            }
        }
    }, [id, currentUserEmail, sessionLoading, SERVER_URL, router]);

    const handleLike = async () => {
        try {
            const res = await fetch(`${SERVER_URL}/recipes/${id}/like`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail: currentUserEmail })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Added to your Favorite Recipes!");
                setPurchaseInfo(prev => ({ ...prev, likesCount: (prev.likesCount || 0) + 1 }));
            } else {
                toast.error(data.message || "Already liked!");
            }
        } catch (error) {
            toast.error("Network error on like.");
        }
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const res = await fetch(`${SERVER_URL}/reports`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipeId: id,
                    reporterEmail: currentUserEmail,
                    reason: reportReason,
                    status: "pending"
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Reported successfully! ");
                setIsReportModalOpen(false);
            } else {
                toast.error(data.message || "Failed to submit report.");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading || sessionLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-transparent gap-3">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-primary/70 animate-pulse">Loading Premium Content...</p>
            </div>
        );
    }

    if (!purchaseInfo || !recipe) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 bg-base-100">
                <h3 className="text-xl font-black text-error mb-2">Access Denied or Not Found</h3>
                <button onClick={() => router.back()} className="btn btn-sm btn-primary rounded-xl">Go Back</button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto text-base-content">
            <Toaster position="top-center" />

            <button
                onClick={() => router.back()}
                className="btn btn-sm btn-ghost gap-2 rounded-xl normal-case mb-6 font-bold"
            >
                <FaArrowLeft className="w-3 h-3" /> Back to Dashboard
            </button>

            <div className="mb-8 bg-success/10 border border-success/30 rounded-3xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-success/20 text-success rounded-2xl text-xl shrink-0 mt-1 md:mt-0">
                        <FaReceipt />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-black text-base-content tracking-tight">Premium Unlocked</h2>
                            <span className="badge badge-success gap-1 text-[10px] font-black text-white px-2 py-2 rounded-lg uppercase">
                                <FaCircleCheck className="w-2.5 h-2.5" /> Purchased
                            </span>
                        </div>
                        <p className="text-xs text-base-content/70 font-mono flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="flex items-center gap-1"><FaHashtag /> {purchaseInfo.transactionId}</span>
                            <span className="opacity-40">|</span>
                            <span className="flex items-center gap-1">
                                <FaCalendarDays /> {new Date(purchaseInfo.paidAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="md:text-right border-t md:border-t-0 border-base-content/10 pt-3 md:pt-0 shrink-0">
                    <span className="text-xs opacity-50 block font-bold uppercase tracking-wider">Amount Paid</span>
                    <span className="text-xl font-black text-success flex items-center md:justify-end">
                        <FaDollarSign className="text-xs" />{parseFloat(purchaseInfo.amount).toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="bg-base-200/40 border border-base-300/60 rounded-3xl overflow-hidden shadow-sm p-5 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
                    <div className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-base-300 relative">
                        <img
                            src={purchaseInfo.recipeImage || recipe.recipeImage || "https://placehold.co/600x400?text=No+Image"}
                            alt={recipe.recipeName}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 badge badge-dark py-3 font-bold bg-black/60 text-white backdrop-blur-sm border-none uppercase text-xs">
                          {recipe.difficultyLevel || "Easy"}
                        </div>
                    </div>

                    <div className="flex flex-col h-full justify-between py-1">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">{recipe.category}</span>
                            <h1 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight mb-4">{recipe.recipeName}</h1>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm font-medium text-base-content/80">
                                    <span className="p-2 rounded-lg bg-base-300/60 text-primary"><FaUtensils /></span>
                                    <span>Cuisine: <strong>{recipe.cuisineType}</strong></span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-base-content/80">
                                    <span className="p-2 rounded-lg bg-base-300/60 text-primary"><FaClock /></span>
                                    <span>Preparation Time: <strong>{recipe.preparationTime}</strong></span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-base-content/70 border-t border-base-300/60 pt-3 mt-3">
                                    <div className="avatar placeholder w-7 h-7 rounded-full bg-neutral text-neutral-content text-xs font-bold flex items-center justify-center">
                                        {recipe.authorName ? recipe.authorName[0].toUpperCase() : "U"}
                                    </div>
                                    <p className="text-xs">Shared by: <span className="font-bold">{recipe.authorName || "Anonymous"}</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-8 pt-4 border-t border-base-300/60">
                            <button
                                onClick={handleLike}
                                className="btn btn-md bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border-none rounded-xl flex-1 font-bold gap-2 normal-case transition-all shadow-none"
                            >
                                <FaHeart /> {purchaseInfo.likesCount !== undefined ? purchaseInfo.likesCount : (recipe.likesCount || 0)} Likes
                            </button>
                            <button
                                onClick={() => setIsReportModalOpen(true)}
                                className="btn btn-md bg-error/10 hover:bg-error text-error hover:text-white border-none rounded-xl font-bold gap-2 normal-case transition-all shadow-none px-4"
                            >
                                <FaFlag /> Report
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="md:col-span-1 bg-base-100 p-5 rounded-2xl border border-base-300/50">
                        <h3 className="font-black text-sm uppercase tracking-wider mb-4 text-base-content/80 border-b border-base-300 pb-2">
                            Ingredients
                        </h3>
                        <ul className="space-y-2.5">
                            {Array.isArray(recipe.ingredients) ? (
                                recipe.ingredients.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs font-medium text-base-content/80">
                                        <span className="text-primary mt-0.5">•</span> {item}
                                    </li>
                                ))
                            ) : (
                                <li className="text-xs font-medium text-base-content/80">{recipe.ingredients}</li>
                            )}
                        </ul>
                    </div>

                    <div className="md:col-span-2 bg-base-100 p-5 rounded-2xl border border-base-300/50">
                        <h3 className="font-black text-sm uppercase tracking-wider mb-4 text-base-content/80 border-b border-base-300 pb-2">
                            Instructions
                        </h3>
                        <p className="text-xs font-medium leading-relaxed text-base-content/80 whitespace-pre-line">
                            {recipe.instructions || "No custom steps provided for this recipe."}
                        </p>
                    </div>
                </div>
            </div>

            {isReportModalOpen && (
                <div className="modal modal-open items-center justify-center backdrop-blur-sm z-50">
                    <div className="modal-box max-w-sm bg-base-100 rounded-2xl p-6 border border-base-300/60 shadow-xl relative">
                        <button
                            type="button"
                            onClick={() => setIsReportModalOpen(false)}
                            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 font-bold"
                        >✕</button>

                        <h3 className="font-black text-lg mb-1">Report Recipe</h3>
                        <p className="text-xs text-base-content/60 mb-5">Please state the valid reason for flag reporting this recipe.</p>

                        <form onSubmit={handleReportSubmit} className="space-y-4 text-left">
                            <div className="form-control w-full">
                                <label className="label py-1 font-bold text-xs uppercase text-base-content/70">Select Reason</label>
                                <select
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    className="select select-bordered w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
                                >
                                    <option value="Spam">Spam</option>
                                    <option value="Offensive Content">Offensive Content</option>
                                    <option value="Copyright Issue">Copyright Issue</option>
                                </select>
                            </div>

                            <div className="modal-action gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsReportModalOpen(false)}
                                    className="btn btn-sm btn-ghost rounded-xl px-4"
                                >Cancel</button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="btn btn-sm btn-error text-white rounded-xl px-5 font-bold"
                                >
                                    {actionLoading ? <span className="loading loading-spinner loading-xs"></span> : "Submit Report"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchasedRecipeDetails;