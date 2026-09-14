"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera,
  FaPen,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaUtensils,
  FaLink,
  FaCheck,
  FaCircleInfo,
} from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import OtpModal from "@/components/OtpModal";
import { HashLoader } from "react-spinners";

const RegisterPage = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [loading, setLoading] = useState(false);

  // Profile photo upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  // OTP Modal state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  // Handle direct file upload via ImageBB API
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB) and type
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image file size should be less than 5MB.");
    }
    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload a valid image file.");
    }

    setSelectedFileName(file.name);
    setUploadingImage(true);
    const toastId = toast.loading("Uploading image to ImageBB...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) {
        throw new Error("ImageBB API key is missing from environment variables.");
      }

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.data?.url) {
        setPhotoUrl(data.data.url);
        setPhotoError("");
        toast.dismiss(toastId);
        toast.success("Profile photo uploaded successfully!");
      } else {
        throw new Error(data.error?.message || "Image upload failed.");
      }
    } catch (err) {
      console.error("ImageBB upload error:", err);
      toast.dismiss(toastId);
      toast.error(err.message || "Failed to upload image.");
      setSelectedFileName("");
    } finally {
      setUploadingImage(false);
    }
  };

  // Step 1: Validate inputs and trigger Registration OTP
  const handleInitiateRegister = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setEmailError("");
    setPhotoError("");

    // 1. Mandatory Profile Image Check
    if (!photoUrl || !photoUrl.trim()) {
      setPhotoError("Profile photo is required. Please upload or link a photo.");
      toast.error("Profile photo is required.", {
        style: { borderRadius: "12px", background: "#262626", color: "#fff" },
      });
      return;
    }

    // 2. Password Requirements
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLongEnough = password.length >= 8;

    if (!isLongEnough || !hasUppercase || !hasNumber) {
      setPasswordError("Password must meet all security requirements below.");
      toast.error("Please check password requirements.", {
        style: { borderRadius: "12px", background: "#262626", color: "#fff" },
      });
      return;
    }

    // 3. Confirm Password Match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match. Please ensure both passwords are identical.");
      toast.error("Passwords do not match.", {
        style: { borderRadius: "12px", background: "#262626", color: "#fff" },
      });
      return;
    }

    if (uploadingImage) {
      return toast.error("Please wait while image finishes uploading.");
    }

    try {
      setLoading(true);

      // Request OTP from backend (Backend validates unique email before sending OTP)
      const res = await fetch(`${SERVER_URL}/api/auth/send-registration-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setEmailError("");
        toast.success("Verification code sent! Please check your email.");
        setIsOtpModalOpen(true);
      } else {
        if (data.isDuplicate || data.message?.includes("already registered")) {
          setEmailError(data.message || "This email is already registered. Please login or use another email.");
        }
        toast.error(data.message || "Could not send verification code.", {
          duration: 4500,
          style: { borderRadius: "12px", background: "#262626", color: "#fff" },
        });
      }
    } catch (err) {
      console.error("Initiate register error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and permanently create user account in Better-Auth
  const handleVerifyOtpSuccess = async (otpCode) => {
    // 1. Verify OTP with backend
    const verifyRes = await fetch(`${SERVER_URL}/api/auth/verify-registration-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        otp: otpCode,
      }),
    });

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      toast.error(verifyData.message || "Invalid verification code.");
      throw new Error(verifyData.message || "Invalid OTP");
    }

    // 2. Permanently register user with Better-Auth
    const { data, error } = await authClient.signUp.email({
      email: email.trim().toLowerCase(),
      password: password,
      name: name.trim(),
      image: photoUrl || "",
    });

    if (error) {
      toast.error(error.message || "Registration failed! Try again.");
      throw new Error(error.message);
    }

    setIsOtpModalOpen(false);
    toast.success("Account Created Successfully! Please login.", {
      duration: 3500,
      style: { borderRadius: "12px", background: "#F97316", color: "#fff", fontWeight: "600" },
    });

    // 3. Trigger Registration Success Welcome Email to user's real email
    fetch(`${SERVER_URL}/api/auth/registration-success`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        name: name.trim(),
      }),
    }).catch((welcomeErr) => {
      console.warn("Welcome email trigger failed:", welcomeErr.message);
    });

    setName("");
    setEmail("");
    setPhotoUrl("");
    setPassword("");
    setConfirmPassword("");

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  // Resend OTP handler for modal
  const handleResendOtp = async () => {
    const res = await fetch(`${SERVER_URL}/api/auth/send-registration-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        name: name.trim(),
      }),
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to resend code");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error("Google sign in error:", err);
      toast.error("Google Sign-In failed.");
    }
  };

  // Custom rounded input styling with focus glow
  const inputContainerClass =
    "flex items-center gap-3 px-4 h-13 bg-base-100/70 dark:bg-base-100/50 backdrop-blur-md rounded-2xl border border-base-300/80 dark:border-white/10 hover:border-base-content/20 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15 transition-all duration-200 shadow-sm";
  const inputClass =
    "w-full bg-transparent text-sm text-base-content placeholder:text-base-content/40 outline-none font-medium";

  return (
    <section className="relative min-h-[95vh] w-full flex items-center justify-center bg-gradient-to-b from-base-100 via-base-200/40 to-base-100 px-4 py-12 sm:py-16 overflow-hidden">
      {/* Ambient Aesthetic Glows (Blue & Pink) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-[75%] -translate-y-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-[110px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/2 translate-x-[75%] translate-y-1/2 w-96 h-96 bg-pink-500/15 rounded-full blur-[110px] pointer-events-none"></div>

      {/* Floating Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[480px] p-7 sm:p-9 bg-base-200/60 dark:bg-base-200/40 backdrop-blur-2xl rounded-[2rem] border border-white/20 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
      >
        {/* Header Section */}
        <div className="text-center mb-6 flex flex-col items-center">
          <Link
            href="/"
            className="w-11 h-11 bg-primary/10 hover:bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-3 transition-colors shadow-sm"
          >
            <FaUtensils className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
            Create{" "}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
              Account
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-base-content/50 font-normal mt-1.5 max-w-[320px]">
            Join RecipeHub to explore and share secret recipes
          </p>
        </div>

        {/* Circular Profile Photo Upload Box */}
        <div className="flex flex-col items-center justify-center mb-6">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploadingImage || loading}
            className="hidden"
          />

          <div className="relative group">
            {/* Circular Avatar Container */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 ${
                photoUrl
                  ? "border-primary/60 shadow-lg shadow-primary/20"
                  : photoError
                  ? "border-error ring-4 ring-error/15 bg-error/5"
                  : "border-dashed border-base-content/25 hover:border-primary hover:bg-primary/5"
              } bg-base-100/50 backdrop-blur-md flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden relative group/avatar`}
            >
              {uploadingImage ? (
                <div className="flex flex-col items-center gap-2 p-2 text-center">
                  <HashLoader color="#10b981" size={26} />
                  <span className="text-[10px] font-semibold text-primary">Uploading...</span>
                </div>
              ) : photoUrl ? (
                <>
                  <img
                    src={photoUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/avatar:scale-105"
                    onError={(e) => {
                      e.target.style.display = "none";
                      setPhotoUrl("");
                    }}
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white">
                    <FaCamera className="text-xl mb-1 drop-shadow" />
                    <span className="text-[10px] font-bold tracking-wide uppercase">Change</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover/avatar:scale-110 group-hover/avatar:bg-primary group-hover/avatar:text-white transition-all duration-200 mb-1.5 shadow-sm">
                    <FaCamera className="text-base" />
                  </div>
                  <span className="text-xs font-bold text-base-content/75 group-hover/avatar:text-primary transition-colors flex items-center justify-center gap-1">
                    Upload Photo <span className="text-error font-extrabold text-sm">*</span>
                  </span>
                  <span className="text-[9px] text-base-content/40 mt-0.5">PNG, JPG up to 5MB</span>
                </div>
              )}
            </div>

            {/* Floating Camera / Edit Badge */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white flex items-center justify-center shadow-md shadow-pink-500/25 border-2 border-base-200 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              title="Upload or Change Photo"
            >
              {photoUrl ? <FaPen className="w-3 h-3" /> : <FaCamera className="w-3 h-3" />}
            </button>
          </div>

          {/* Mandatory Photo Error */}
          {photoError && !photoUrl && (
            <p className="text-xs text-error font-semibold text-center mt-2 flex items-center justify-center gap-1 animate-pulse">
              <FaCircleInfo className="w-3.5 h-3.5 shrink-0" />
              <span>{photoError}</span>
            </p>
          )}

          {/* Photo Actions / Clear & Optional URL Option */}
          {photoUrl ? (
            <div className="flex items-center gap-3 mt-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Change Photo
              </button>
              <span className="text-base-content/20">•</span>
              <button
                type="button"
                onClick={() => {
                  setPhotoUrl("");
                  setSelectedFileName("");
                }}
                className="text-xs font-semibold text-error/80 hover:text-error hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[11px] font-medium text-base-content/50 hover:text-primary transition-colors flex items-center gap-1.5 mt-2 cursor-pointer"
            >
              <FaLink className="w-2.5 h-2.5" />
              <span>{showUrlInput ? "Hide image URL" : "Or paste image URL"}</span>
            </button>
          )}

          {/* Discreet URL Input Drawer */}
          <AnimatePresence>
            {showUrlInput && !photoUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full mt-2.5 overflow-hidden"
              >
                <div className="flex items-center gap-2 px-3 h-10 bg-base-100/60 rounded-xl border border-base-300/80 focus-within:border-primary">
                  <FaLink className="text-base-content/40 text-xs shrink-0" />
                  <input
                    type="url"
                    placeholder="Paste direct image link (https://...)"
                    value={photoUrl}
                    onChange={(e) => {
                      setPhotoUrl(e.target.value);
                      if (photoError) setPhotoError("");
                    }}
                    className="w-full bg-transparent text-xs text-base-content placeholder:text-base-content/40 outline-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Register Form */}
        <form onSubmit={handleInitiateRegister} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-base-content/60 pl-1">
              Full Name
            </label>
            <div className={inputContainerClass}>
              <FaUser className="text-base-content/35 text-base shrink-0 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                required
                disabled={loading}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-base-content/60 pl-1">
              Email Address
            </label>
            <div className={`${inputContainerClass} ${emailError ? "border-error focus-within:border-error focus-within:ring-error/20" : ""}`}>
              <FaEnvelope className={`text-base shrink-0 group-focus-within:text-primary transition-colors ${emailError ? "text-error" : "text-base-content/35"}`} />
              <input
                type="email"
                required
                disabled={loading}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                className={inputClass}
              />
            </div>
            {emailError && (
              <p className="text-xs text-error font-semibold pl-1 pt-0.5 flex items-center gap-1 animate-pulse">
                <FaCircleInfo className="w-3.5 h-3.5 shrink-0" />
                <span>{emailError}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5 relative">
            <label className="text-[11px] font-bold uppercase tracking-wider text-base-content/60 pl-1">
              Password
            </label>
            <div className={inputContainerClass}>
              <FaLock className="text-base-content/35 text-base shrink-0 group-focus-within:text-primary transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={loading}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-9`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-base-content/40 hover:text-primary transition-colors p-1.5 rounded-lg shrink-0 cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Requirement Instruction */}
            <div className="flex items-center gap-1.5 text-[11px] text-base-content/50 pl-1 pt-0.5">
              <FaCircleInfo className="w-3 h-3 text-base-content/40 shrink-0" />
              <span>Must be at least 8 characters with 1 uppercase and 1 number</span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5 relative">
            <label className="text-[11px] font-bold uppercase tracking-wider text-base-content/60 pl-1">
              Confirm Password
            </label>
            <div className={inputContainerClass}>
              <FaLock className="text-base-content/35 text-base shrink-0 group-focus-within:text-primary transition-colors" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                disabled={loading}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                className={`${inputClass} pr-9`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-base-content/40 hover:text-primary transition-colors p-1.5 rounded-lg shrink-0 cursor-pointer"
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>

            {passwordError && (
              <p className="text-xs text-error font-semibold pl-1 pt-0.5">
                {passwordError}
              </p>
            )}
          </div>

          {/* Register Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full h-13 sm:h-14 flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:from-blue-500 hover:via-indigo-500 hover:to-pink-500 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer tracking-wide"
            >
              {loading ? (
                <>
                  <HashLoader color="#ffffff" size={16} />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <FaArrowRight className="w-4 h-4 text-white/80" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-base-300/60 dark:border-white/10"></div>
          <span className="px-3 text-[11px] text-base-content/40 uppercase tracking-widest font-semibold">
            Or
          </span>
          <div className="flex-1 border-t border-base-300/60 dark:border-white/10"></div>
        </div>

        {/* Google Social Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full h-12 sm:h-13 flex items-center justify-center gap-3 bg-base-100/70 dark:bg-base-100/40 hover:bg-base-100 border border-base-300/80 dark:border-white/10 rounded-2xl text-sm font-semibold text-base-content shadow-sm hover:shadow transition-all duration-200 cursor-pointer active:scale-[0.99]"
        >
          <FcGoogle className="text-xl" />
          <span>Continue with Google</span>
        </button>

        {/* Footer Link */}
        <p className="text-center text-xs sm:text-sm text-base-content/60 font-medium mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline transition-colors ml-0.5">
            Log In
          </Link>
        </p>
      </motion.div>

      {/* OTP Verification Modal */}
      <OtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        email={email}
        onVerifySuccess={handleVerifyOtpSuccess}
        onResendOtp={handleResendOtp}
      />
    </section>
  );
};

export default RegisterPage;