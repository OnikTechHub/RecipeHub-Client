"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa6";
import toast from "react-hot-toast";
import { SERVER_URL } from "@/lib/apiConfig";

const NewsletterStats = () => {
  const [liveStats, setLiveStats] = useState({
    totalRecipes: null,
    totalUsers: null,
    totalChefs: null,
  });

  useEffect(() => {
    fetch(`${SERVER_URL}/api/public-stats`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setLiveStats({
            totalRecipes: data.stats.totalRecipes,
            totalUsers: data.stats.totalUsers,
            totalChefs: data.stats.totalChefs,
          });
        }
      })
      .catch((err) => console.warn("NewsletterStats fetch error:", err.message));
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("Thank you for subscribing!", {
      style: { borderRadius: "12px", background: "#F97316", color: "#fff" },
    });
    e.target.reset();
  };

  const statsList = [
    {
      number: liveStats.totalUsers !== null ? `${liveStats.totalUsers}+` : "...",
      label: "Active Members",
    },
    {
      number: liveStats.totalRecipes !== null ? `${liveStats.totalRecipes}` : "...",
      label: "Platform Recipes",
    },
    {
      number: liveStats.totalChefs !== null ? `${liveStats.totalChefs}` : "...",
      label: "Recipe Creators",
    },
  ];

  return (
    <section className="py-16 bg-base-100 px-4 md:px-8">
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-base-200/80 via-base-200/30 to-base-100 p-8 md:p-12 rounded-3xl border border-base-300/60 shadow-xl relative overflow-hidden">
        {/* Glows */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Side: Text and Form */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-base-content tracking-tight leading-tight">
              Get Secret Recipes Delivered <br className="hidden sm:block" />
              To Your{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Inbox Weekly!
              </span>
            </h2>
            <p className="text-sm font-medium text-base-content/60 max-w-md leading-relaxed">
              Join our exclusive newsletter group and get chef-recommended tips, meal maps, and early access to pro cooking methods.
            </p>

            {/* Input Group */}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md pt-2">
              <input
                type="email"
                required
                placeholder="Enter your fresh email"
                className="flex-1 px-4 h-12 bg-base-100 rounded-xl border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm placeholder:text-base-content/40"
              />
              <button
                type="submit"
                className="h-12 px-6 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm normal-case"
              >
                <span>Join Now</span>
                <FaPaperPlane className="text-xs" />
              </button>
            </form>
          </div>

          {/* Right Side: Dynamic Stats Badges */}
          <div className="lg:col-span-5 grid grid-cols-3 lg:grid-cols-1 gap-4 sm:gap-6 w-full">
            {statsList.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-4 sm:p-5 bg-base-100 rounded-2xl border border-base-300/40 text-center lg:text-left flex flex-col lg:flex-row lg:items-center lg:justify-between shadow-sm hover:border-primary/20 transition-colors"
              >
                <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.number}
                </span>
                <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider lg:mt-0 mt-1">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterStats;