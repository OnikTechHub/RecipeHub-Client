"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaUtensils, FaHeart, FaShieldHalved, FaGlobe, FaBullseye, FaLightbulb, FaAward, FaUsers } from "react-icons/fa6";

export default function AboutPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content py-12 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-3xl bg-gradient-to-r from-base-200 via-base-100 to-base-200 border border-base-300/60 p-8 md:p-16 overflow-hidden text-center max-w-4xl mx-auto space-y-6 shadow-xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-extrabold uppercase tracking-widest border border-primary/20"
          >
            <FaUtensils className="w-3.5 h-3.5" />
            <span>Our Story & Mission</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Connecting World Flavors with{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Every Home Kitchen
            </span>
          </h1>

          <p className="text-base-content/80 text-base md:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
            RecipeHub was built with a simple goal: empowering food enthusiasts and professional chefs to discover, share, and monetize exceptional culinary creations.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -6, scale: 1.02 }}
            className="bg-base-200/50 rounded-3xl p-6 text-center border border-base-300/50 space-y-2 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="p-3 bg-primary/10 rounded-2xl w-fit mx-auto text-primary">
              <FaGlobe className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black">50+</div>
            <div className="text-xs md:text-sm font-semibold opacity-70">Cuisines Represented</div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -6, scale: 1.02 }}
            className="bg-base-200/50 rounded-3xl p-6 text-center border border-base-300/50 space-y-2 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="p-3 bg-accent/10 rounded-2xl w-fit mx-auto text-accent">
              <FaUtensils className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black">10,000+</div>
            <div className="text-xs md:text-sm font-semibold opacity-70">Recipes Cooked Daily</div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -6, scale: 1.02 }}
            className="bg-base-200/50 rounded-3xl p-6 text-center border border-base-300/50 space-y-2 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="p-3 bg-secondary/10 rounded-2xl w-fit mx-auto text-secondary">
              <FaUsers className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black">250,000+</div>
            <div className="text-xs md:text-sm font-semibold opacity-70">Active Food Lovers</div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -6, scale: 1.02 }}
            className="bg-base-200/50 rounded-3xl p-6 text-center border border-base-300/50 space-y-2 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="p-3 bg-success/10 rounded-2xl w-fit mx-auto text-success">
              <FaAward className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black">99.8%</div>
            <div className="text-xs md:text-sm font-semibold opacity-70">Recipe Success Rate</div>
          </motion.div>
        </motion.div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.01 }}
            className="bg-base-200/40 rounded-3xl p-8 md:p-10 border border-base-300/60 space-y-4 shadow-sm"
          >
            <div className="p-3 bg-primary/10 rounded-2xl w-fit text-primary">
              <FaBullseye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Our Core Mission</h2>
            <p className="text-base-content/80 text-sm md:text-base leading-relaxed font-medium">
              We believe great food brings people together. Our mission is to democratize culinary knowledge by providing step-by-step guidance, ingredient scaling, and interactive chef masterclasses to cooks of all skill levels.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.01 }}
            className="bg-base-200/40 rounded-3xl p-8 md:p-10 border border-base-300/60 space-y-4 shadow-sm"
          >
            <div className="p-3 bg-accent/10 rounded-2xl w-fit text-accent">
              <FaLightbulb className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Our Vision for the Future</h2>
            <p className="text-base-content/80 text-sm md:text-base leading-relaxed font-medium">
              To build the world’s most trusted full-stack culinary platform where home cooks gain confidence, master chefs monetize their expertise, and recipe quality is celebrated through community verification.
            </p>
          </motion.div>
        </div>

        {/* Our Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8 text-center"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-black">What Drives RecipeHub</h2>
            <p className="text-base-content/70">The core values embedded in everything we build</p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-base-100 p-8 rounded-3xl border border-base-300/60 shadow-sm hover:shadow-xl transition-all space-y-3"
            >
              <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl w-fit mx-auto">
                <FaHeart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Culinary Authenticity</h3>
              <p className="text-sm opacity-80 leading-relaxed font-medium">
                Every recipe shared on RecipeHub is crafted, tested, and reviewed to ensure exact measurements and mouth-watering results.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-base-100 p-8 rounded-3xl border border-base-300/60 shadow-sm hover:shadow-xl transition-all space-y-3"
            >
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl w-fit mx-auto">
                <FaShieldHalved className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Chef Empowerment</h3>
              <p className="text-sm opacity-80 leading-relaxed font-medium">
                We empower culinary creators to earn fair income from premium recipe content and build direct relationships with fans.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-base-100 p-8 rounded-3xl border border-base-300/60 shadow-sm hover:shadow-xl transition-all space-y-3"
            >
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit mx-auto">
                <FaGlobe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Global Community</h3>
              <p className="text-sm opacity-80 leading-relaxed font-medium">
                From Asian street food to Italian pasta tradition, our global network fosters cultural exchange through gastronomy.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center bg-base-200/60 rounded-3xl p-10 border border-base-300/60 space-y-6 shadow-xl"
        >
          <h2 className="text-3xl font-black">Ready to Start Cooking?</h2>
          <p className="text-base-content/70 max-w-xl mx-auto font-medium">
            Browse our extensive library of free and premium recipes or share your own signature dish today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/browse-recipes" className="btn btn-primary font-bold px-8 rounded-xl shadow-lg hover:scale-105 transition-transform">
              Explore All Recipes
            </Link>
            <Link href="/contact" className="btn btn-ghost font-bold px-8 rounded-xl border border-base-300 hover:scale-105 transition-transform">
              Get in Touch
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
