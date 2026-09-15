"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaFileContract, FaScaleBalanced, FaBan, FaCreativeCommons, FaCircleQuestion } from "react-icons/fa6";

export default function TermsPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content py-12 px-4 md:px-8 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-10"
      >

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-base-300 pb-8 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
            <FaFileContract />
            <span>Terms of Service</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Terms & Conditions</h1>
          <p className="text-sm text-base-content/60 font-medium">
            Last Updated: September 15, 2026 • Please read carefully before using RecipeHub.
          </p>
        </motion.div>

        {/* Highlight Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.03, y: -4 }}
            className="p-5 bg-base-200/50 rounded-2xl border border-base-300/50 space-y-1 shadow-sm transition-all"
          >
            <FaScaleBalanced className="text-primary w-5 h-5 mb-1" />
            <h3 className="font-bold text-sm">Fair Usage</h3>
            <p className="text-xs opacity-70 font-medium">Respect chef copyrights and original culinary content.</p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.03, y: -4 }}
            className="p-5 bg-base-200/50 rounded-2xl border border-base-300/50 space-y-1 shadow-sm transition-all"
          >
            <FaCreativeCommons className="text-accent w-5 h-5 mb-1" />
            <h3 className="font-bold text-sm">Creator Rights</h3>
            <p className="text-xs opacity-70 font-medium">Chefs retain ownership of their posted recipes.</p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.03, y: -4 }}
            className="p-5 bg-base-200/50 rounded-2xl border border-base-300/50 space-y-1 shadow-sm transition-all"
          >
            <FaBan className="text-secondary w-5 h-5 mb-1" />
            <h3 className="font-bold text-sm">Zero Abuse</h3>
            <p className="text-xs opacity-70 font-medium">Strict moderation against fake reviews or inappropriate recipes.</p>
          </motion.div>
        </motion.div>

        {/* Main Terms Body */}
        <div className="prose max-w-none space-y-8 text-base-content/90 text-sm md:text-base leading-relaxed">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <h2 className="text-xl font-bold text-base-content">1. Acceptance of Terms</h2>
            <p className="font-medium">
              By accessing or using RecipeHub ("Platform"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must discontinue platform usage immediately.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <h2 className="text-xl font-bold text-base-content">2. User Accounts & Access Roles</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm opacity-90 font-medium">
              <li><strong>Free Users:</strong> Access public free recipes, post community comments, and save recipes.</li>
              <li><strong>Purchasers / Premium Members:</strong> Obtain non-transferable access rights to unlocked premium recipes.</li>
              <li><strong>Admins:</strong> RecipeHub system administrators receive universal free access to all platform content for moderation and maintenance purposes.</li>
            </ul>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <h2 className="text-xl font-bold text-base-content">3. Intellectual Property & Recipe Publishing</h2>
            <p className="font-medium">
              Users who upload recipes certify that they hold the necessary rights or original authorship. Copyright infringement or unauthorized duplication of commercial cookbooks is strictly prohibited and will lead to immediate account termination.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <h2 className="text-xl font-bold text-base-content">4. Purchases, Refunds, and Lifetime Unlocks</h2>
            <p className="font-medium">
              All purchases of individual paid recipes or premium plan subscriptions grant immediate digital access. Refunds are governed by our customer support policy upon verifying duplicate charges or technical access failures.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <h2 className="text-xl font-bold text-base-content">5. Content Moderation & Reporting</h2>
            <p className="font-medium">
              RecipeHub reserves the right to remove inappropriate content, aggregate reports by recipe ID for admin review, and penalize spam accounts.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <h2 className="text-xl font-bold text-base-content">6. Questions Regarding Terms</h2>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-base-200 rounded-2xl border border-base-300 flex items-center gap-3 w-fit text-sm font-semibold shadow-sm"
            >
              <FaCircleQuestion className="text-accent" />
              <span>Contact legal@recipehub.com for inquiries.</span>
            </motion.div>
          </motion.section>
        </div>

        {/* Footer Link back */}
        <div className="pt-6 border-t border-base-300 text-center">
          <Link href="/" className="text-primary font-bold hover:underline text-sm inline-block hover:scale-105 transition-transform">
            ← Return to Home Page
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
