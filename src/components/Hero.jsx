"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaFire, FaBowlFood } from "react-icons/fa6";
import { motion } from "framer-motion";
import { SERVER_URL } from "@/lib/apiConfig";

export default function Hero() {
    const [totalRecipes, setTotalRecipes] = useState(null);

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
                    <Link
                        href="/register"
                        className="btn btn-outline px-7 h-12 min-h-[3rem] rounded-xl font-bold border-white/20 text-white hover:bg-white hover:text-black hover:border-white hover:scale-105 active:scale-95 transition-all normal-case backdrop-blur-sm"
                    >
                        Join Community
                    </Link>
                </motion.div>

            </motion.div>
        </div>
    );
}