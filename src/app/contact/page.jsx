"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaLocationDot, FaPaperPlane, FaClock, FaCommentDots, FaUtensils } from "react-icons/fa6";
import { SERVER_URL } from "@/lib/apiConfig";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${SERVER_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const json = await response.json();

      if (json.success) {
        toast.success(json.message || "Message sent successfully!", {
          duration: 5000,
          style: { borderRadius: "12px", background: "#262626", color: "#fff" }
        });
        setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
      } else {
        toast.error(json.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast.error("Connection error. Please check your internet or try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content py-12 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-extrabold uppercase tracking-widest border border-primary/20">
            <FaCommentDots className="w-3.5 h-3.5" />
            <span>We'd Love to Hear From You</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Get in Touch with the <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">RecipeHub Team</span>
          </h1>
          <p className="text-base-content/70 text-base md:text-lg leading-relaxed font-medium">
            Have questions about recipes, membership plans, chef applications, or technical support? Drop us a message below and we’ll get back to you promptly.
          </p>
        </motion.div>

        {/* Grid Section: Info Cards & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left Side: Contact Information Cards (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-base-200/50 rounded-3xl p-8 border border-base-300/60 space-y-6 shadow-lg">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <FaUtensils className="text-primary" />
                <span>Contact Details</span>
              </h2>
              <p className="text-sm opacity-80 leading-relaxed font-medium">
                Reach out directly via email, phone, or visit our headquarters. We are available Sunday to Thursday, 9:00 AM – 6:00 PM (BST).
              </p>

              <div className="space-y-4 text-sm font-medium">
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-start gap-4 p-4 bg-base-100 rounded-2xl border border-base-300/50 shadow-sm transition-all"
                >
                  <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                    <FaLocationDot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base">Office Address</h4>
                    <p className="opacity-70 text-xs mt-0.5">Agrabad Commercial Area, Chattogram City, Bangladesh</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-start gap-4 p-4 bg-base-100 rounded-2xl border border-base-300/50 shadow-sm transition-all"
                >
                  <div className="p-3 bg-accent/10 rounded-xl text-accent shrink-0">
                    <FaEnvelope className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base">Email Us</h4>
                    <p className="opacity-70 text-xs mt-0.5">support@recipehub.com</p>
                    <p className="opacity-70 text-xs">chefs@recipehub.com</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-start gap-4 p-4 bg-base-100 rounded-2xl border border-base-300/50 shadow-sm transition-all"
                >
                  <div className="p-3 bg-secondary/10 rounded-xl text-secondary shrink-0">
                    <FaPhone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base">Call Support</h4>
                    <p className="opacity-70 text-xs mt-0.5">+880 1234-567890</p>
                    <p className="opacity-70 text-xs">+880 1987-654321</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-start gap-4 p-4 bg-base-100 rounded-2xl border border-base-300/50 shadow-sm transition-all"
                >
                  <div className="p-3 bg-success/10 rounded-xl text-success shrink-0">
                    <FaClock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base">Response Time</h4>
                    <p className="opacity-70 text-xs mt-0.5">Average reply time is under 2 hours during business hours.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Interactive Form (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-7 bg-base-100 rounded-3xl p-8 md:p-10 border border-base-300 shadow-xl space-y-6"
          >
            <div>
              <h2 className="text-2xl font-black">Send Us a Direct Message</h2>
              <p className="text-sm opacity-70 mt-1 font-medium">Fill out the form below and our support team will respond quickly.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-80">
                    Your Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="input input-bordered w-full rounded-2xl focus:input-primary text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-80">
                    Your Email <span className="text-error">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="input input-bordered w-full rounded-2xl focus:input-primary text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider opacity-80">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="select select-bordered w-full rounded-2xl focus:select-primary text-sm font-medium"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Recipe Access / Cart Help">Recipe Access / Cart Help</option>
                  <option value="Chef Application">Chef Application</option>
                  <option value="Report an Issue">Report an Issue</option>
                  <option value="Partnership / Sponsorship">Partnership / Sponsorship</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Your Message <span className="text-error">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="How can we help you today? Please include any relevant details..."
                  required
                  className="textarea textarea-bordered w-full rounded-2xl focus:textarea-primary text-sm font-medium leading-relaxed"
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-primary text-white font-black text-base shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Send Message Now</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
