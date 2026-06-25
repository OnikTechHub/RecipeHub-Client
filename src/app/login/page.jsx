"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaUtensils, FaSun, FaMoon } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const LoginPage = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const { data, error } = await authClient.signIn.email({
                email: email,
                password: password,
            });

            if (error) {
                toast.error(error.message || "Invalid email or password.", {
                    style: { borderRadius: "12px", background: "#262626", color: "#fff" },
                });
            } else {
                toast.success("Welcome Back! Login Successful.", {
                    duration: 3000,
                    style: { borderRadius: "12px", background: "#F97316", color: "#fff", fontWeight: "600" },
                });

                setEmail("");
                setPassword("");


                setTimeout(() => {
                    router.push("/dashboard");
                }, 1200);
            }
        } catch (err) {
            console.error("Login error:", err);
            toast.error("An unexpected error occurred.", {
                style: { borderRadius: "12px", background: "#262626", color: "#fff" },
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
                        <Link href="/" className="inline-flex items-center gap-2 p-2 bg-primary/10 rounded-xl text-primary mb-1">
                            <FaUtensils className="w-4 h-4" />
                        </Link>
                        <h2 className="text-3xl font-black text-base-content tracking-tight mb-1">
                            Welcome <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Back</span>
                        </h2>
                        <p className="text-sm font-medium text-base-content/60 max-w-[280px]">
                            Log in to your RecipeHub account to continue cooking
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-4">

                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-base-content/60 pl-1">Email Address</label>
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

                        {/* Password Input */}
                        <div className="space-y-1.5 relative">
                            <div className="flex justify-between items-center pl-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-base-content/60">Password</label>
                                <Link href="#" className="text-xs font-semibold text-primary hover:underline">
                                    Forgot?
                                </Link>
                            </div>
                            <div className={inputGroupClass}>
                                <FaLock className="text-base-content/30 transition-colors text-lg" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    disabled={loading}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`${inputClass} pr-10`}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 bottom-3.5 text-base-content/30 hover:text-primary transition-colors p-1 rounded-md"
                            >
                                {showPassword ? <FaEyeSlash className="text-base" /> : <FaEye className="text-base" />}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-primary via-accent to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] hover:opacity-95 active:scale-[0.99] transition-all duration-300 text-sm disabled:opacity-50 disabled:pointer-events-none normal-case"
                            >
                                {loading ? "Signing In..." : "Log In"}
                                {!loading && <FaArrowRight className="text-base" />}
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
                        <span className="px-3 text-xs text-base-content/30 uppercase tracking-widest font-bold">Or</span>
                        <div className="flex-1 border-t border-base-300"></div>
                    </div>

                    {/*  Google Social Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full h-12 flex items-center justify-center gap-3 border border-base-300 hover:border-base-content/10 rounded-xl text-sm font-semibold text-base-content hover:bg-base-200 transition-all duration-300 shadow-sm active:scale-[0.99] normal-case bg-base-100"
                    >
                        <FcGoogle className="text-xl" />
                        Sign in with Google
                    </button>

                </div>
            </motion.div>
        </section>
    );
};

export default LoginPage;