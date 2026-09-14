"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaShieldHalved, FaArrowRight, FaRotateRight, FaXmark, FaEye, FaEyeSlash } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const OtpModal = ({ isOpen, onClose, email, onVerifySuccess, onResendOtp }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(300);
    setOtp(["", "", "", "", "", ""]);
    setShowOtp(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Focus first input on open
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    }
  }, [isOpen]);

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = ["", "", "", "", "", ""];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleChange = (index, value) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned && value !== "") return;

    const newOtp = [...otp];
    // Handle pasting or multiple chars typed
    if (cleaned.length > 1) {
      cleaned.slice(0, 6).split("").forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(cleaned.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = cleaned.slice(-1);
    setOtp(newOtp);

    // Auto-advance
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      return toast.error("Please enter the complete 6-digit code.");
    }

    try {
      setLoading(true);
      await onVerifySuccess(fullOtp);
    } catch (err) {
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    try {
      setResending(true);
      await onResendOtp();
      setTimeLeft(300);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      toast.success("A new code has been sent to your email!");
    } catch (err) {
      toast.error(err.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!isOpen) return null;

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
            onClick={onClose}
            disabled={loading}
            className="absolute top-5 right-5 p-2 text-base-content/40 hover:text-base-content rounded-full hover:bg-base-200 transition-colors"
          >
            <FaXmark className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-6 flex flex-col items-center">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-3">
              <FaShieldHalved className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-base-content tracking-tight">
              Verify Your Email
            </h3>
            <p className="text-xs text-base-content/60 mt-1 max-w-[280px]">
              We sent a 6-digit verification code to{" "}
              <span className="font-bold text-base-content">{email}</span>
            </p>
          </div>

          {/* 6 Digit Inputs */}
          <form onSubmit={handleVerify} autoComplete="off" className="space-y-5">
            <div
              className="flex justify-center gap-2 sm:gap-3"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type={showOtp ? "text" : "password"}
                  inputMode="numeric"
                  maxLength={1}
                  autoComplete="off"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading}
                  className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold bg-base-200/60 text-base-content border border-base-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              ))}
            </div>

            {/* Mask Toggle & Resend Header */}
            <div className="flex items-center justify-between text-xs px-1">
              <button
                type="button"
                onClick={() => setShowOtp(!showOtp)}
                className="inline-flex items-center gap-1.5 text-base-content/50 hover:text-primary font-medium transition-colors cursor-pointer"
              >
                {showOtp ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5 text-primary" />}
                <span>{showOtp ? "Mask code" : "Show code"}</span>
              </button>

              <span className="text-base-content/50 font-medium">
                Expires in:{" "}
                <span className="font-bold text-primary font-mono">
                  {formatTime(timeLeft)}
                </span>
              </span>
            </div>

            <div className="flex items-center justify-end text-xs px-1">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || timeLeft > 240}
                className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer"
              >
                <FaRotateRight className={`w-3 h-3 ${resending ? "animate-spin" : ""}`} />
                Resend Code
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6 || timeLeft === 0}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Verifying Account...
                </>
              ) : (
                <>
                  Verify & Create Account
                  <FaArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OtpModal;
