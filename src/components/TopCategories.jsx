"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaEgg, FaBowlRice, FaUtensils, FaCookie, FaArrowRight } from "react-icons/fa6";
import { SERVER_URL } from "@/lib/apiConfig";

const baseCategories = [
  {
    name: "Breakfast",
    icon: <FaEgg />,
    desc: "Energizing morning meals, pancakes, omeletes & smoothies",
    color: "from-amber-400 to-yellow-500",
  },
  {
    name: "Lunch",
    icon: <FaBowlRice />,
    desc: "Quick bowls, fresh salads, gourmet sandwiches & wraps",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Dinner",
    icon: <FaUtensils />,
    desc: "Hearty main courses, pasta, steaks & family feasts",
    color: "from-rose-500 to-red-600",
  },
  {
    name: "Desserts",
    icon: <FaCookie />,
    desc: "Decadent cakes, artisanal pastries, pies & ice creams",
    color: "from-purple-500 to-pink-500",
  },
];

export default function TopCategories() {
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch(`${SERVER_URL}/api/public-stats`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.stats?.categories) {
          setCategoryCounts(data.stats.categories);
        }
      })
      .catch((err) => {
        console.warn("Failed to load dynamic category stats:", err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 bg-base-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              Meal Type Categories
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-base-content tracking-tight mt-3">
              Browse Recipes by{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Category
              </span>
            </h2>
          </div>
          <Link
            href="/browse-recipes"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
          >
            <span>View All Recipes</span>
            <FaArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {baseCategories.map((cat, idx) => {
            const countVal = categoryCounts[cat.name];
            const displayCount =
              countVal !== undefined
                ? `${countVal} ${countVal === 1 ? "Recipe" : "Recipes"}`
                : loading
                ? "..."
                : "0 Recipes";

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <Link
                  href={`/browse-recipes?category=${encodeURIComponent(cat.name)}`}
                  className="group flex flex-col justify-between p-6 bg-base-200/50 hover:bg-base-200 rounded-3xl border border-base-300/40 hover:border-primary/40 hover:shadow-xl transition-all duration-300 h-full"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`p-4 rounded-2xl text-white bg-gradient-to-br ${cat.color} shadow-md group-hover:scale-110 transition-transform duration-300 text-2xl`}
                      >
                        {cat.icon}
                      </div>
                      <span className="text-xs font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {displayCount}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-base-content group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs font-medium text-base-content/60 mt-1.5 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-base-300/40 flex items-center justify-between text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                    <span>Explore {cat.name}</span>
                    <FaArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
