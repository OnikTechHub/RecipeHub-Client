"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaShieldHalved, FaLock, FaUserCheck, FaEye, FaEnvelope } from "react-icons/fa6";

export default function PrivacyPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <FaShieldHalved />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-base-content/60 font-medium">
            Last Updated: September 15, 2026 • Effective Date: January 1, 2026
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
            <FaLock className="text-primary w-5 h-5 mb-1" />
            <h3 className="font-bold text-sm">Data Security</h3>
            <p className="text-xs opacity-70 font-medium">256-bit SSL encryption & secure cloud authentication.</p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.03, y: -4 }}
            className="p-5 bg-base-200/50 rounded-2xl border border-base-300/50 space-y-1 shadow-sm transition-all"
          >
            <FaUserCheck className="text-accent w-5 h-5 mb-1" />
            <h3 className="font-bold text-sm">No Third-Party Sales</h3>
            <p className="text-xs opacity-70 font-medium">We never sell or rent your personal information.</p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.03, y: -4 }}
            className="p-5 bg-base-200/50 rounded-2xl border border-base-300/50 space-y-1 shadow-sm transition-all"
          >
            <FaEye className="text-secondary w-5 h-5 mb-1" />
            <h3 className="font-bold text-sm">Full Control</h3>
            <p className="text-xs opacity-70 font-medium">Export or delete your account & saved recipes anytime.</p>
          </motion.div>
        </motion.div>

        {/* Main Content Body */}
        <div className="prose max-w-none space-y-8 text-base-content/90 text-sm md:text-base leading-relaxed">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <h2 className="text-xl font-bold text-base-content">1. Information We Collect</h2>
            <p className="font-medium">
              RecipeHub collects information to provide better services to all our users. We collect information in the following ways:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm opacity-90 font-medium">
              <li><strong>Account Information:</strong> When you register, we collect your name, email address, profile photo, and password credentials.</li>
              <li><strong>Recipe & Activity Data:</strong> Recipes you create, save, purchase, review, or add to your shopping cart.</li>
              <li><strong>Payment Information:</strong> Transaction identifiers when purchasing premium recipes or memberships (processed securely via PCI-compliant payment gateways).</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, and session logs.</li>
            </ul>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <h2 className="text-xl font-bold text-base-content">2. How We Use Your Information</h2>
            <p className="font-medium">We use the data collected for essential platform functionality, including:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm opacity-90 font-medium">
              <li>Delivering free and purchased recipe content to your personal dashboard.</li>
              <li>Verifying user roles (Admin free lifetime access, Chef Creator privileges, Member access).</li>
              <li>Sending transactional notifications, password reset OTPs, and subscription updates.</li>
              <li>Improving platform search accuracy, category filtering, and UI responsiveness.</li>
            </ul>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <h2 className="text-xl font-bold text-base-content">3. Cookies & Tracking Technologies</h2>
            <p className="font-medium">
              RecipeHub uses local storage and HTTP cookies to maintain active login sessions, save your preferred color theme (Light/Dark mode), and remember your shopping cart items across navigation.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <h2 className="text-xl font-bold text-base-content">4. User Rights & Data Protection</h2>
            <p className="font-medium">
              Under global data privacy laws (GDPR, CCPA), you reserve the right to access, rectify, or request permanent deletion of your personal data stored on our servers. You may request data deletion by contacting our privacy compliance team.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <h2 className="text-xl font-bold text-base-content">5. Contact Our Privacy Officer</h2>
            <p className="font-medium">
              If you have any questions or concerns regarding this Privacy Policy, please reach out to us at:
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-base-200 rounded-2xl border border-base-300 flex items-center gap-3 w-fit text-sm font-semibold shadow-sm"
            >
              <FaEnvelope className="text-primary" />
              <span>privacy@recipehub.com</span>
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
