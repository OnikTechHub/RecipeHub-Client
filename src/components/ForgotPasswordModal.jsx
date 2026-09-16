"use client";
import React, { useState } from "react";
import { FaKey, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaRotateRight, FaXmark, FaCheck } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { HashLoader } from "react-spinners";
import { SERVER_URL } from "@/lib/apiConfig";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP + New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email address.");

    try {
      setLoading(true);
      const res = await fetch(`${SERVER_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Reset code sent! Check your email.");
        setStep(2);
      } else {
        toast.error(data.message || "Failed to send reset code.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || otp.trim().length !== 6) {
      return toast.error("Please enter the 6-digit reset code.");
    }

    if (newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }

    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasUppercase || !hasNumber) {
      return toast.error("Password must contain at least 1 uppercase letter and 1 number.");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);
      const res = await fetch(`${SERVER_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Password updated successfully! You can now log in.", {
          duration: 4000,
          style: { borderRadius: "12px", background: "#F97316", color: "#fff", fontWeight: "600" },
        });
        handleClose();
      } else {
        toast.error(data.message || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setShowOtp(false);
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  if (!isOpen) return null;

  const inputGroupClass = `flex items-center gap-3 px-4 h-12 bg-base-100 rounded-xl border border-base-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-sm`;
  const inputClass = `w-full bg-transparent text-sm text-base-content placeholder:text-base-content/40 outline-none`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-md p-6 sm:p-8 bg-base-100 rounded-3xl border border-base-300 shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={loading}
            className="absolute top-5 right-5 p-2 text-base-content/40 hover:text-base-content rounded-full hover:bg-base-200 transition-colors"
          >
            <FaXmark className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-6 flex flex-col items-center">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-3">
              <FaKey className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-base-content tracking-tight">
              {step === 1 ? "Forgot Password?" : "Reset Password"}
            </h3>
            <p className="text-xs text-base-content/60 mt-1 max-w-[290px]">
              {step === 1
                ? "Enter your registered email address to receive a 6-digit recovery code."
                : `Enter the 6-digit code sent to ${email} and choose a new password.`}
            </p>
          </div>

          {/* Step 1: Email Form */}
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/60 pl-1">
                  Email Address
                </label>
                <div className={inputGroupClass}>
                  <FaEnvelope className="text-base-content/30 transition-colors text-lg" />
                  <input
                    type="email"
                    required
                    disabled={loading}
                    placeholder="Enter Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <HashLoader color="#ffffff" size={16} />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    Send Reset Code
                    <FaArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP + New Password Form */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-3.5">
              {/* 6-Digit Code */}
              <div className="space-y-1">
                <div className="flex items-center justify-between pl-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-base-content/60">
                    6-Digit Reset Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowOtp(!showOtp)}
                    className="text-[11px] text-base-content/50 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer font-medium"
                  >
                    {showOtp ? <FaEyeSlash className="w-3 h-3" /> : <FaEye className="w-3 h-3 text-primary" />}
                    <span>{showOtp ? "Mask code" : "Show code"}</span>
                  </button>
                </div>
                <div className={inputGroupClass}>
                  <input
                    type={showOtp ? "text" : "password"}
                    required
                    maxLength={6}
                    disabled={loading}
                    autoComplete="off"
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className={`${inputClass} tracking-widest font-mono text-base font-bold text-center`}
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1 relative">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/60 pl-1">
                  New Password
                </label>
                <div className={inputGroupClass}>
                  <FaLock className="text-base-content/30 transition-colors text-lg" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={loading}
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`${inputClass} pr-9`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-base-content/30 hover:text-primary transition-colors p-1"
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/60 pl-1">
                  Confirm New Password
                </label>
                <div className={inputGroupClass}>
                  <FaLock className="text-base-content/30 transition-colors text-lg" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={loading}
                    placeholder="Re-type new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs px-1 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-primary hover:underline font-semibold"
                >
                  Change Email
                </button>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={loading}
                  className="text-base-content/50 hover:text-primary transition-colors flex items-center gap-1"
                >
                  <FaRotateRight className="w-3 h-3" /> Resend Code
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !otp || !newPassword || !confirmPassword}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <HashLoader color="#ffffff" size={16} />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    Update Password & Login
                    <FaCheck className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;
