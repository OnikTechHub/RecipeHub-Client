"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft, FaCircleCheck } from "react-icons/fa6";

const testimonials = [
  {
    name: "Samantha Reed",
    role: "Home Chef & Food Blogger",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    quote: "RecipeHub changed how I cook at home! The step-by-step instructions and instant ingredient unit converter save me so much time in the kitchen every single day.",
    verified: true
  },
  {
    name: "Marcus Vance",
    role: "Culinary Enthusiast",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    quote: "Unlocking Pro Foodie recipes was the best decision! Gordon Ramsay's Wellington guide came out perfection on my first try. My guests were completely blown away.",
    verified: true
  },
  {
    name: "Chef David Chen",
    role: "Executive Pastry Chef",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    quote: "As a professional creator, RecipeHub gives me the platform to publish my dessert guides and connect directly with food lovers globally. The UI is world-class.",
    verified: true
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-base-200/40 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1.5 rounded-full">
            Community Feedback
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-base-content tracking-tight mt-4 mb-3">
            Loved by Thousands of <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Food Lovers</span>
          </h2>
          <p className="text-sm font-medium text-base-content/60">
            Here's what our passionate home cooks, professional chefs, and foodie subscribers have to say.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="bg-base-100 p-8 rounded-3xl border border-base-300/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative"
            >
              <div className="space-y-4">
                <FaQuoteLeft className="text-primary/20 w-8 h-8" />

                <div className="flex gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm opacity-80 leading-relaxed font-medium italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-base-200">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-base-content">{item.name}</h4>
                    {item.verified && (
                      <FaCircleCheck className="text-primary w-3.5 h-3.5" title="Verified Member" />
                    )}
                  </div>
                  <p className="text-xs opacity-60 font-medium">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
