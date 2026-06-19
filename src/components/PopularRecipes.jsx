"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaClock, FaStar, FaArrowRight } from "react-icons/fa6";

const PopularRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopularRecipes = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/recipes`);
                const json = await response.json();
                if (json.success) {

                    setRecipes(json.data.slice(0, 3));
                }
            } catch (error) {
                console.error("Failed to fetch popular recipes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularRecipes();
    }, []);

    return (
        <section className="py-20 bg-base-100 text-base-content transition-colors duration-300 relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute top-1/4 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Section Title Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                            Trending Now
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-3">
                            Our Most <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Popular Recipes</span>
                        </h2>
                        <p className="text-sm font-medium opacity-60 mt-1">
                            Handpicked delicious dishes highly rated by our global community.
                        </p>
                    </div>

                    <Link
                        href="/browse-recipes"
                        className="btn btn-ghost text-primary font-bold hover:bg-primary/10 rounded-xl flex items-center gap-2 group normal-case self-start sm:self-auto text-sm"
                    >
                        <span>See All Recipes</span>
                        <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : recipes.length === 0 ? (
                    <div className="text-center py-16 bg-base-200/30 rounded-3xl border border-dashed border-base-300/60">
                        <p className="text-sm font-medium opacity-60">No recipes available in the database right now.</p>
                    </div>
                ) : (
                    /* Recipes Grid Layout */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recipes.map((recipe, index) => (
                            <motion.div
                                key={recipe._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -6 }}
                                className="bg-base-100 rounded-3xl border border-base-300/40 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
                            >
                                {/* Recipe Image Wrapper */}
                                <div className="relative h-56 overflow-hidden bg-base-200">
                                    <img
                                        src={recipe.image}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase bg-base-100/90 backdrop-blur-md shadow-sm text-primary tracking-wider">
                                        {recipe.category}
                                    </span>
                                </div>

                                {/* Card Main Body */}
                                <div className="p-6 flex flex-col flex-grow justify-between">
                                    <div>
                                        {/* Meta Info */}
                                        <div className="flex items-center gap-4 text-xs opacity-70 mb-3 font-semibold">
                                            <span className="flex items-center gap-1.5">
                                                <FaClock className="text-primary text-[11px]" /> {recipe.cookingTime}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-amber-500">
                                                <FaStar className="text-[11px]" /> {recipe.ratings}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-black text-lg tracking-tight text-base-content line-clamp-2 mb-4 group-hover:text-primary transition-colors duration-300">
                                            {recipe.title}
                                        </h3>
                                    </div>

                                    {/* Action Button */}
                                    <Link
                                        href={`/browse-recipes/${recipe._id}`}
                                        className="btn btn-primary btn-md w-full rounded-2xl font-bold text-white normal-case shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all text-sm"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
};

export default PopularRecipes;