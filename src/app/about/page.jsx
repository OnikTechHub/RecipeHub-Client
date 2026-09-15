"use client";
import React from "react";
import Link from "next/link";
import { FaUtensils, FaHeart, FaShieldHalved, FaGlobe, FaBullseye, FaLightbulb, FaAward, FaUsers } from "react-icons/fa6";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-base-200 via-base-100 to-base-200 border border-base-300/60 p-8 md:p-16 overflow-hidden text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-extrabold uppercase tracking-widest border border-primary/20">
            <FaUtensils className="w-3.5 h-3.5" />
            <span>Our Story & Mission</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Connecting World Flavors with <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Every Home Kitchen</span>
          </h1>

          <p className="text-base-content/80 text-base md:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
            RecipeHub was built with a simple goal: empowering food enthusiasts and professional chefs to discover, share, and monetize exceptional culinary creations.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-base-200/50 rounded-3xl p-6 text-center border border-base-300/50 space-y-2">
            <div className="p-3 bg-primary/10 rounded-2xl w-fit mx-auto text-primary">
              <FaGlobe className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black">50+</div>
            <div className="text-xs md:text-sm font-semibold opacity-70">Cuisines Represented</div>
          </div>
          <div className="bg-base-200/50 rounded-3xl p-6 text-center border border-base-300/50 space-y-2">
            <div className="p-3 bg-accent/10 rounded-2xl w-fit mx-auto text-accent">
              <FaUtensils className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black">10,000+</div>
            <div className="text-xs md:text-sm font-semibold opacity-70">Recipes Cooked Daily</div>
          </div>
          <div className="bg-base-200/50 rounded-3xl p-6 text-center border border-base-300/50 space-y-2">
            <div className="p-3 bg-secondary/10 rounded-2xl w-fit mx-auto text-secondary">
              <FaUsers className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black">250,000+</div>
            <div className="text-xs md:text-sm font-semibold opacity-70">Active Food Lovers</div>
          </div>
          <div className="bg-base-200/50 rounded-3xl p-6 text-center border border-base-300/50 space-y-2">
            <div className="p-3 bg-success/10 rounded-2xl w-fit mx-auto text-success">
              <FaAward className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black">99.8%</div>
            <div className="text-xs md:text-sm font-semibold opacity-70">Recipe Success Rate</div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-base-200/40 rounded-3xl p-8 md:p-10 border border-base-300/60 space-y-4">
            <div className="p-3 bg-primary/10 rounded-2xl w-fit text-primary">
              <FaBullseye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Our Core Mission</h2>
            <p className="text-base-content/80 text-sm md:text-base leading-relaxed">
              We believe great food brings people together. Our mission is to democratize culinary knowledge by providing step-by-step guidance, ingredient scaling, and interactive chef masterclasses to cooks of all skill levels.
            </p>
          </div>

          <div className="bg-base-200/40 rounded-3xl p-8 md:p-10 border border-base-300/60 space-y-4">
            <div className="p-3 bg-accent/10 rounded-2xl w-fit text-accent">
              <FaLightbulb className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Our Vision for the Future</h2>
            <p className="text-base-content/80 text-sm md:text-base leading-relaxed">
              To build the world’s most trusted full-stack culinary platform where home cooks gain confidence, master chefs monetize their expertise, and recipe quality is celebrated through community verification.
            </p>
          </div>
        </div>

        {/* Our Values Grid */}
        <div className="space-y-8 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-black">What Drives RecipeHub</h2>
            <p className="text-base-content/70">The core values embedded in everything we build</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-base-100 p-8 rounded-3xl border border-base-300/60 shadow-sm hover:shadow-lg transition-all space-y-3">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl w-fit mx-auto">
                <FaHeart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Culinary Authenticity</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                Every recipe shared on RecipeHub is crafted, tested, and reviewed to ensure exact measurements and mouth-watering results.
              </p>
            </div>

            <div className="bg-base-100 p-8 rounded-3xl border border-base-300/60 shadow-sm hover:shadow-lg transition-all space-y-3">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl w-fit mx-auto">
                <FaShieldHalved className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Chef Empowerment</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                We empower culinary creators to earn fair income from premium recipe content and build direct relationships with fans.
              </p>
            </div>

            <div className="bg-base-100 p-8 rounded-3xl border border-base-300/60 shadow-sm hover:shadow-lg transition-all space-y-3">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit mx-auto">
                <FaGlobe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Global Community</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                From Asian street food to Italian pasta tradition, our global network fosters cultural exchange through gastronomy.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="text-center bg-base-200/60 rounded-3xl p-10 border border-base-300/60 space-y-6">
          <h2 className="text-3xl font-black">Ready to Start Cooking?</h2>
          <p className="text-base-content/70 max-w-xl mx-auto">
            Browse our extensive library of free and premium recipes or share your own signature dish today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/browse-recipes" className="btn btn-primary font-bold px-8 rounded-xl shadow-lg">
              Explore All Recipes
            </Link>
            <Link href="/contact" className="btn btn-ghost font-bold px-8 rounded-xl border border-base-300">
              Get in Touch
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
