"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaBookOpen, FaBasketShopping, FaUtensils, FaClock } from "react-icons/fa6";

const Features = () => {
    const features = [
        {
            icon: <FaBookOpen />,
            title: "10k+ Premium Recipes",
            desc: "Explore a vast collection of curated recipes from world-class chefs worldwide.",
            color: "from-orange-500 to-amber-500",
        },
        {
            icon: <FaBasketShopping />,
            title: "Smart Grocery List",
            desc: "Automatically convert your selected recipe ingredients into an organized shopping list.",
            color: "from-emerald-500 to-teal-500",
        },
        {
            icon: <FaUtensils />,
            title: "Culinary Techniques",
            desc: "Master secret kitchen methods with our detailed step-by-step cooking guidelines.",
            color: "from-blue-500 to-indigo-500",
        },
        {
            icon: <FaClock />,
            title: "30-Min Quick Meals",
            desc: "No time? Discover delicious, high-quality dishes you can cook in under half an hour.",
            color: "from-rose-500 to-pink-500",
        },
    ];

    return (
        <section className="py-20 bg-base-100 transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                        Why Choose Us
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-base-content tracking-tight mt-4 mb-3">
                        Cook Like a Pro with <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">RecipeHub</span>
                    </h2>
                    <p className="text-sm font-medium text-base-content/60">
                        We provide everything you need to transform your daily cooking into an extraordinary culinary experience.
                    </p>
                </div>

                {/* Grid Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -6 }}
                            className="p-1 bg-base-200/50 rounded-2xl border border-base-300/40 hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="p-6 bg-base-100 rounded-[0.9rem] h-full flex flex-col items-start">
                                <div className={`p-3.5 rounded-xl text-white bg-gradient-to-br ${item.color} shadow-md mb-5 group-hover:scale-110 transition-transform duration-300 text-lg`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-base-content mb-2 tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-xs font-medium text-base-content/60 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;