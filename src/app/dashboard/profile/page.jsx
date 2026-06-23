"use client";
import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLink, FaCircleCheck, FaCrown } from "react-icons/fa6";
import { Toaster, toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";

const ProfilePage = () => {
    const { data: session, isPending } = authClient.useSession();
    const searchParams = useSearchParams();
    const isPaymentSuccessUrl = searchParams.get("success") === "true" || typeof window !== "undefined" && window.location.search.includes("success");

    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [updating, setUpdating] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [dbIsPremium, setDbIsPremium] = useState(false);

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || "");
            setImage(session.user.image || "");

            fetch(`${SERVER_URL}/api/user/status?email=${session.user.email}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.isPremium) {
                        setDbIsPremium(true);
                    }
                })
                .catch(err => console.error("Error fetching user status:", err));
        }
    }, [session, SERVER_URL]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error("Name cannot be empty!");

        setUpdating(true);
        try {
            const response = await fetch(`${SERVER_URL}/api/user/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: session.user.email,
                    name: name,
                    image: image || "",
                }),
            });

            const apiData = await response.json();
            if (!response.ok || !apiData.success) throw new Error(apiData.message);

            toast.dismiss();
            toast.success("Profile updated successfully!");
            setTimeout(() => { window.location.reload(); }, 1000);
        } catch (error) {
            toast.error(error.message || "Failed to update profile.");
        } finally {
            setUpdating(false);
        }
    };

    const handleUpgradeToPremium = async () => {
        if (dbIsPremium || isPaymentSuccessUrl) return;

        setCheckoutLoading(true);
        try {
            const response = await fetch(`${SERVER_URL}/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipeId: "membership_upgrade",
                    title: "RecipeHub Pro Premium Membership",
                    price: 19.99,
                    userEmail: session?.user?.email,
                    userId: session?.user?.id || session?.user?._id || "N/A",
                }),
            });

            const data = await response.json();
            if (data.success && data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.message || "Could not initiate payment.");
                setCheckoutLoading(false);
            }
        } catch (error) {
            console.error("Stripe integration error:", error);
            toast.error("Connection error.");
            setCheckoutLoading(false);
        }
    };

    if (isPending) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-transparent gap-3">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const showPremiumFeatures = dbIsPremium || isPaymentSuccessUrl;

    return (
        <div className="w-full text-base-content space-y-6 p-1 md:p-4">
            <Toaster position="top-center" limit={1} />

            <div className="flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    My Profile
                </h1>
                <p className="text-xs text-base-content/60">View and manage your personal details and subscription state.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Profile Card */}
                <div className="bg-base-100 border border-base-300/50 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center justify-center relative overflow-hidden h-fit">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/10 to-secondary/10 -z-10" />
                    <div className="relative w-24 h-24 mt-4">
                        <img
                            src={image || "https://placeholder.co/150"}
                            alt={name}
                            className="w-24 h-24 rounded-2xl object-cover border-4 border-base-100 shadow-md bg-base-200"
                        />
                    </div>
                    <h2 className="text-lg font-black mt-4">{name || "USER"}</h2>
                    <p className="text-xs opacity-60 font-semibold flex items-center gap-1 mt-1 mb-4">
                        <FaEnvelope className="text-[10px]" /> {session?.user?.email}
                    </p>

                    {showPremiumFeatures ? (
                        <span className="badge badge-warning font-black text-[10px] gap-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none shadow-md">
                            <FaCrown className="text-xs animate-pulse" /> PREMIUM MEMBER
                        </span>
                    ) : (
                        <span className="badge badge-ghost font-bold text-[10px] py-2.5 px-3 rounded-xl opacity-60 bg-base-200">
                            FREE ACCOUNT
                        </span>
                    )}
                </div>

                {/* Content Side */}
                <div className="lg:col-span-2 space-y-6">

                    
                    {!showPremiumFeatures && (
                        <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                            <div className="space-y-1">
                                <h4 className="text-sm font-black text-amber-600 flex items-center gap-1.5">
                                    <FaCrown /> Upgrade to RecipeHub Premium
                                </h4>
                                <p className="text-xs opacity-70 max-w-md">
                                    Unlock **Unlimited Add Recipe uploads** and get an exclusive premium profile crown badge instantly for just **$19.99**!
                                </p>
                            </div>

                            <button
                                onClick={handleUpgradeToPremium}
                                disabled={checkoutLoading}
                                className="btn btn-warning btn-sm font-black text-xs text-white rounded-xl bg-amber-500 hover:bg-amber-600 border-none px-4 normal-case whitespace-nowrap shadow-md"
                            >
                                {checkoutLoading ? "Connecting..." : "Become a Premium Member"}
                            </button>
                        </div>
                    )}

                    {/* Form */}
                    <div className="bg-base-100 border border-base-300/50 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-black uppercase tracking-wider opacity-80 mb-4 pb-2 border-b border-b-base-200">
                            Account Details
                        </h3>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="form-control w-full">
                                <label className="label py-1"><span className="label-text text-xs font-bold opacity-70">Email Address</span></label>
                                <div className="flex items-center gap-2 bg-base-200/50 border border-base-300/40 rounded-xl px-3 py-2.5 text-xs font-semibold opacity-70">
                                    <FaEnvelope className="opacity-40" /> <span>{session?.user?.email}</span>
                                </div>
                            </div>
                            <div className="form-control w-full">
                                <label className="label py-1"><span className="label-text text-xs font-bold opacity-70">Full Name</span></label>
                                <div className="relative flex items-center">
                                    <FaUser className="absolute left-3.5 text-xs opacity-40" />
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered w-full rounded-xl pl-10 text-xs font-semibold focus:outline-primary" required />
                                </div>
                            </div>
                            <div className="form-control w-full">
                                <label className="label py-1"><span className="label-text text-xs font-bold opacity-70">Profile Image URL</span></label>
                                <div className="relative flex items-center">
                                    <FaLink className="absolute left-3.5 text-xs opacity-40" />
                                    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="input input-bordered w-full rounded-xl pl-10 text-xs font-semibold focus:outline-primary" />
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button type="submit" disabled={updating} className="btn btn-primary rounded-xl btn-sm font-bold normal-case px-6 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white border-none">
                                    {updating ? <span className="loading loading-spinner loading-xs"></span> : <><FaCircleCheck className="text-xs" /> <span>Save Changes</span></>}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;