"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft, FaCircleCheck, FaUtensils } from "react-icons/fa6";
import { HashLoader } from "react-spinners";

const DEFAULT_FALLBACK_TESTIMONIALS = [
  {
    userName: "Samantha Reed",
    role: "Home Chef & Food Blogger",
    userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "RecipeHub changed how I cook at home! The step-by-step instructions and instant ingredient unit converter save me so much time in the kitchen every single day.",
    recipeName: "Gourmet Home Cooking",
    verified: true,
  },
  {
    userName: "Marcus Vance",
    role: "Culinary Enthusiast",
    userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "Unlocking Pro Foodie recipes was the best decision! Gordon Ramsay's Wellington guide came out perfection on my first try. My guests were completely blown away.",
    recipeName: "Classic Beef Wellington",
    verified: true,
  },
  {
    userName: "Chef David Chen",
    role: "Executive Pastry Chef",
    userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "As a professional creator, RecipeHub gives me the platform to publish my dessert guides and connect directly with food lovers globally. The UI is world-class.",
    recipeName: "Lava Chocolate Cake",
    verified: true,
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(DEFAULT_FALLBACK_TESTIMONIALS);
  const [loading, setLoading] = useState(true);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchFeaturedTestimonials = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${SERVER_URL}/api/testimonials/featured`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setTestimonials(json.data);
        }
      } catch (err) {
        console.error("Failed to load featured testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTestimonials();
  }, [SERVER_URL]);

  if (loading) {
    return (
      <section className="py-20 bg-base-200/40 relative overflow-hidden transition-colors duration-300 min-h-[350px] flex flex-col items-center justify-center gap-3">
        <HashLoader color="#10b981" size={40} />
        <span className="text-xs font-semibold text-base-content/60">Loading Community Testimonials...</span>
      </section>
    );
  }

  // Dynamic grid column class based on count
  const gridColsClass =
    testimonials.length === 1
      ? "grid-cols-1 max-w-lg mx-auto"
      : testimonials.length === 2
      ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="py-20 bg-base-200/40 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-3.5 py-1.5 rounded-full border border-accent/20">
            Admin Curated & Verified Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-base-content tracking-tight">
            Loved by Thousands of <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Food Lovers</span>
          </h2>
          <p className="text-sm font-medium text-base-content/60">
            Here's what our passionate home cooks, professional chefs, and foodie subscribers have to say about RecipeHub creations.
          </p>
        </div>

        {/* Dynamic Grid Cards */}
        <div className={`grid ${gridColsClass} gap-8`}>
          {testimonials.map((item, index) => {
            const name = item.userName || item.name || "Valued Foodie";
            const avatar =
              item.userImage ||
              item.avatar ||
              "https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(name);
            const quoteText = item.comment || item.quote || "";
            const ratingNum = Number(item.rating) || 5;
            const recipeTag = item.recipeName || "Recipehub Creation";

            return (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                whileHover={{ y: -6 }}
                className="bg-base-100 p-8 rounded-3xl border border-base-300/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FaQuoteLeft className="text-primary/20 w-8 h-8" />
                    {recipeTag && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/20 truncate max-w-[180px]">
                        <FaUtensils className="text-[9px] shrink-0" />
                        <span className="truncate">{recipeTag}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1 text-amber-400">
                    {[...Array(ratingNum)].map((_, i) => (
                      <FaStar key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-sm opacity-85 leading-relaxed font-medium italic">
                    "{quoteText}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-base-200">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
                  />
                  <div className="truncate">
                    <div className="flex items-center gap-1.5 truncate">
                      <h4 className="font-bold text-sm text-base-content truncate">{name}</h4>
                      <FaCircleCheck className="text-primary w-3.5 h-3.5 shrink-0" title="Verified Community Reviewer" />
                    </div>
                    <p className="text-xs opacity-60 font-medium truncate">
                      {item.role || "Verified RecipeHub Member"}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
