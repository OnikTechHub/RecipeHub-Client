"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaUtensils,
  FaCircleExclamation,
} from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { SERVER_URL } from "@/lib/apiConfig";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import { HashLoader } from "react-spinners";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const { data: session } = authClient.useSession();

  const checkAndExecutePendingCheckout = async () => {
    const pendingCheckout = typeof window !== "undefined" ? localStorage.getItem("pending_membership_checkout") : null;
    if (pendingCheckout) {
      localStorage.removeItem("pending_membership_checkout");
      const toastId = toast.loading("Redirecting to Stripe Checkout...", {
        style: { borderRadius: "12px", background: "#262626", color: "#fff" },
      });
      try {
        const res = await fetch(`${SERVER_URL}/create-checkout-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ recipeId: "membership_upgrade" }),
        });
        const data = await res.json();
        toast.dismiss(toastId);
        if (data?.url) {
          window.location.href = data.url;
          return true;
        } else {
          toast.error(data?.message || "Failed to initiate payment session.");
        }
      } catch (err) {
        toast.dismiss(toastId);
        console.error("Pending checkout error:", err);
      }
    }
    return false;
  };

  useEffect(() => {
    if (session?.user) {
      checkAndExecutePendingCheckout().then((redirected) => {
        if (!redirected) {
          router.push("/dashboard");
        }
      });
    }
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    const targetEmail = email.trim().toLowerCase();

    // 1. Client-Side Input Validations
    if (!targetEmail || !password) {
      const msg = "Please enter both your email address and password.";
      setLoginError(msg);
      toast.error(msg, {
        duration: 4000,
        style: { borderRadius: "12px", background: "#262626", color: "#F87171", fontWeight: "600" },
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(targetEmail)) {
      const msg = "Please enter a valid email address.";
      setLoginError(msg);
      toast.error(msg, {
        duration: 4000,
        style: { borderRadius: "12px", background: "#262626", color: "#F87171", fontWeight: "600" },
      });
      return;
    }

    try {
      setLoading(true);

      // 2. Perform Authentication via Better-Auth
      const { data, error } = await authClient.signIn.email({
        email: targetEmail,
        password: password,
      });

      if (error) {
        let errorMsg = "Invalid email or password. Please check your credentials.";
        if (error.message) {
          const lower = error.message.toLowerCase();
          if (lower.includes("not found") || lower.includes("no user") || lower.includes("cannot find")) {
            errorMsg = "No account found with this email. Please register first.";
          } else if (lower.includes("password") || lower.includes("credential") || lower.includes("invalid")) {
            errorMsg = "Invalid email or password. Please check your credentials.";
          } else if (lower.includes("rate") || lower.includes("too many")) {
            errorMsg = "Too many login attempts. Please wait a few minutes before trying again.";
          } else if (lower.includes("blocked")) {
            errorMsg = "This account has been blocked by the Administrator.";
          } else {
            errorMsg = error.message;
          }
        }

        setLoginError(errorMsg);
        toast.error(errorMsg, {
          duration: 4500,
          style: { borderRadius: "12px", background: "#262626", color: "#F87171", fontWeight: "600" },
        });
        return;
      }

      // 3. Check if user account is blocked on platform
      try {
        const roleRes = await fetch(`${SERVER_URL}/check-user-role?email=${encodeURIComponent(targetEmail)}`);
        const roleData = await roleRes.json();
        if (roleData?.isBlocked) {
          await authClient.signOut();
          const blockedMsg = "This account has been blocked by the Administrator.";
          setLoginError(blockedMsg);
          toast.error(blockedMsg, {
            duration: 5000,
            style: { borderRadius: "12px", background: "#262626", color: "#F87171", fontWeight: "600" },
          });
          return;
        }
      } catch (roleErr) {
        console.warn("Role check notification warning:", roleErr.message);
      }

      // 4. Login Successful
      setLoginError("");
      toast.success("Welcome Back! Login Successful.", {
        duration: 3000,
        style: { borderRadius: "12px", background: "#F97316", color: "#fff", fontWeight: "600" },
      });

      // Trigger Login Success Email Notification in background (non-blocking)
      fetch(`${SERVER_URL}/api/auth/login-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      }).catch((notifyErr) => {
        console.warn("Login notification trigger failed:", notifyErr.message);
      });

      setEmail("");
      setPassword("");

      const redirected = await checkAndExecutePendingCheckout();
      if (!redirected) {
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      }
    } catch (err) {
      console.error("Login error:", err);
      const catchMsg = err.message || "An unexpected error occurred. Please try again.";
      setLoginError(catchMsg);
      toast.error(catchMsg, {
        duration: 4500,
        style: { borderRadius: "12px", background: "#262626", color: "#F87171", fontWeight: "600" },
      });
    } finally {
      setLoading(false);
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

  const inputGroupClass = `flex items-center gap-3 px-4 h-12 bg-base-100 rounded-xl border border-base-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-sm`;
  const inputClass = `w-full bg-transparent text-sm text-base-content placeholder:text-base-content/40 outline-none`;

  return (
    <section className="relative min-h-[95vh] w-full flex items-center justify-center bg-base-100 px-4 transition-colors duration-300 py-16 overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[460px] p-2 bg-base-200/50 backdrop-blur-md rounded-3xl border border-base-300/60 shadow-2xl"
      >
        <div className="w-full h-full p-6 sm:p-9 bg-base-100 rounded-[1.3rem]">
          {/* Header */}
          <div className="text-center mb-7 flex flex-col items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 p-2 bg-primary/10 rounded-xl text-primary mb-1"
            >
              <FaUtensils className="w-4 h-4" />
            </Link>
            <h2 className="text-3xl font-black text-base-content tracking-tight mb-1">
              Welcome{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Back
              </span>
            </h2>
            <p className="text-sm font-medium text-base-content/60 max-w-[280px]">
              Log in to your RecipeHub account to continue cooking
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Visual Error Alert Banner */}
            {loginError && (
              <div className="p-3.5 bg-error/10 border border-error/30 rounded-xl text-error text-xs font-semibold flex items-center gap-2.5">
                <FaCircleExclamation className="shrink-0 text-base" />
                <span className="leading-snug">{loginError}</span>
              </div>
            )}

            {/* Email Input */}
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (loginError) setLoginError("");
                  }}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5 relative">
              <div className="flex justify-between items-center pl-1">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/60">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <div className={inputGroupClass}>
                <FaLock className="text-base-content/30 transition-colors text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginError) setLoginError("");
                  }}
                  className={`${inputClass} pr-10`}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 bottom-3.5 text-base-content/30 hover:text-primary transition-colors p-1 rounded-md cursor-pointer"
              >
                {showPassword ? <FaEyeSlash className="text-base" /> : <FaEye className="text-base" />}
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-primary via-accent to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] hover:opacity-95 active:scale-[0.99] transition-all duration-300 text-sm disabled:opacity-50 disabled:pointer-events-none normal-case cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <HashLoader color="#ffffff" size={16} />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <>
                    <span>Log In</span>
                    <FaArrowRight className="text-base" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Link */}
          <p className="text-center text-sm text-base-content/60 font-medium mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              Register Now
            </Link>
          </p>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-base-300"></div>
            <span className="px-3 text-xs text-base-content/30 uppercase tracking-widest font-bold">
              Or
            </span>
            <div className="flex-1 border-t border-base-300"></div>
          </div>

          {/* Google Social Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full h-12 flex items-center justify-center gap-3 border border-base-300 hover:border-base-content/10 rounded-xl text-sm font-semibold text-base-content hover:bg-base-200 transition-all duration-300 shadow-sm active:scale-[0.99] normal-case bg-base-100 cursor-pointer"
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </button>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </section>
  );
};

export default LoginPage;