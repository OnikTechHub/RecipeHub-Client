"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaFire, FaBowlFood, FaCirclePlay, FaXmark } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { HashLoader } from "react-spinners";
import { SERVER_URL } from "@/lib/apiConfig";

export default function Hero() {
    const [totalRecipes, setTotalRecipes] = useState(null);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(true);

    useEffect(() => {
        fetch(`${SERVER_URL}/api/public-stats`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.stats?.totalRecipes !== undefined) {
                    setTotalRecipes(data.stats.totalRecipes);
                }
            })
            .catch((err) => console.warn("Hero stats fetch error:", err.message));
    }, []);

    // Reset video loading state whenever modal opens
    const handleOpenVideo = () => {
        setIsVideoLoading(true);
        setIsVideoOpen(true);
    };

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setIsVideoOpen(false);
        };
        if (isVideoOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isVideoOpen]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <div className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-black transition-all duration-300">

            {/* Background Image */}
            <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
                style={{
                    backgroundImage: "url('/hero-bg.png')",
                }}
            />

            {/* Premium Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-base-100 z-10 pointer-events-none"></div>

            {/* Main Content  */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.2 } }
                }}
                className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20 flex flex-col items-center justify-center py-16"
            >

                {/* Top Floating Badge */}
                <motion.div
                    variants={fadeInUp}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-amber-400 border border-white/10 text-xs font-bold mb-6 shadow-lg"
                >
                    <FaFire className="w-3.5 h-3.5 animate-pulse" />
                    <span className="text-white">
                        {totalRecipes !== null ? `${totalRecipes} Real-Time Community Recipes` : "Over 1,000+ Secret Recipes"}
                    </span>
                </motion.div>

                {/* Perfect Centered Heading */}
                <motion.h1
                    variants={fadeInUp}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.2] w-full text-center"
                >
                    Unleash Your Inner Chef <br className="hidden sm:inline" /> With{" "}
                    <span className="inline-block bg-gradient-to-r from-amber-400 via-orange-400 to-primary bg-clip-text text-transparent filter drop-shadow-[0_2px_8px_rgba(242,133,0,0.4)]">
                        RecipeHub
                    </span>
                </motion.h1>

                {/* Dynamic Subtitle */}
                <motion.p
                    variants={fadeInUp}
                    className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-zinc-200/90 font-medium mb-10 leading-relaxed text-center"
                >
                    Explore a world of exquisite flavors, master secret culinary techniques, and organize your daily meals effortlessly with our interactive platform.
                </motion.p>

                {/* Action Buttons */}
                <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-4 w-full">
                    <Link
                        href="/browse-recipes"
                        className="btn btn-primary px-7 h-12 min-h-[3rem] rounded-xl font-bold text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all normal-case flex items-center gap-2"
                    >
                        <FaBowlFood className="w-4 h-4" />
                        <span>Explore Recipes</span>
                    </Link>

                    <button
                        onClick={handleOpenVideo}
                        className="btn bg-white/10 backdrop-blur-md border border-white/20 px-6 h-12 min-h-[3rem] rounded-xl font-bold text-white hover:bg-white/20 hover:border-white/40 hover:scale-105 active:scale-95 transition-all normal-case flex items-center gap-2.5 shadow-lg group"
                    >
                        <FaCirclePlay className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                        <span>Watch Demo</span>
                    </button>

                    <Link
                        href="/register"
                        className="btn btn-outline px-7 h-12 min-h-[3rem] rounded-xl font-bold border-white/20 text-white hover:bg-white hover:text-black hover:border-white hover:scale-105 active:scale-95 transition-all normal-case backdrop-blur-sm"
                    >
                        Join Community
                    </Link>
                </motion.div>

            </motion.div>

            {/* Glassmorphic Video Modal */}
            <AnimatePresence>
                {isVideoOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsVideoOpen(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl bg-zinc-900/90 border border-white/15 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl space-y-3 p-3 sm:p-4"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-3 py-1 border-b border-white/10 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-xs font-bold text-zinc-300 ml-2">
                                        RecipeHub Video Walkthrough Demo
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsVideoOpen(false)}
                                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-all cursor-pointer"
                                >
                                    <FaXmark className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Responsive Aspect-Video Container */}
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
                                {/* React Inbuilt HashLoader Spinner Overlay */}
                                {isVideoLoading && (
                                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 gap-4">
                                        <HashLoader color="#10b981" size={50} />
                                        <span className="text-xs font-bold text-zinc-300 tracking-wider uppercase animate-pulse">
                                            Loading Demo Video...
                                        </span>
                                    </div>
                                )}

                                {/* Transparent Overlay Blocker to prevent clicking Google Drive pop-out/share icon */}
                                <div
                                    className="absolute top-0 right-0 w-28 h-16 z-20 bg-transparent cursor-default"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                />

                                <iframe
                                    src="https://drive.google.com/file/d/1NxNWrWK6BsXF6Io5PBZ8tSOb0oKl445D/preview"
                                    title="RecipeHub Demo Video"
                                    onLoad={() => setIsVideoLoading(false)}
                                    className="w-full h-full border-0"
                                    allow="autoplay; encrypted-media; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}