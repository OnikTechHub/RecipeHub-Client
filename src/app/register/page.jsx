"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaLock, FaImage, FaEye, FaEyeSlash, FaArrowRight, FaUtensils, FaSun, FaMoon } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client"; 

const RegisterPage = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
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

    const handleRegister = async (e) => {
        e.preventDefault();
        setPasswordError("");

        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const isLongEnough = password.length >= 8;

        if (!isLongEnough || !hasUppercase || !hasNumber) {
            setPasswordError("Password must meet all the security requirements below.");
            toast.error("Registration Failed! Check password requirements.", {
                style: { borderRadius: "12px", background: "#262626", color: "#fff" },
            });
            return;
        }

        try {
            setLoading(true);

            const { data, error } = await authClient.signUp.email({
                email: email,
                password: password,
                name: name,
                image: photoUrl,
            });

            if (error) {
                toast.error(error.message || "Registration failed! Try again.", {
                    style: { borderRadius: "12px", background: "#262626", color: "#fff" },
                });
            } else {
                toast.success("Account Created Successfully! Please login. ", {
                    duration: 3000,
                    style: { borderRadius: "12px", background: "#F97316", color: "#fff", fontWeight: "600" },
                });

                setName("");
                setEmail("");
                setPhotoUrl("");
                setPassword("");

                setTimeout(() => {
                    router.push("/login");
                }, 1500);
            }
        } catch (err) {
            console.error("Sign up error:", err);
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

            {/* Decorative Background Glows (Adaptive to theme) */}
            <div className="absolute top-10 left-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>



            {/* Main card with premium border gradient */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[480px] p-2 bg-base-200/50 backdrop-blur-md rounded-3xl border border-base-300/60 shadow-2xl"
            >
                <div className="w-full h-full p-6 sm:p-9 bg-base-100 rounded-[1.3rem]">

                    {/*  Header and RecipeHub Content */}
                    <div className="text-center mb-7 flex flex-col items-center gap-3">
                        <Link href="/" className="inline-flex items-center gap-2 p-2 bg-primary/10 rounded-xl text-primary mb-1">
                            <FaUtensils className="w-4 h-4" />
                        </Link>
                        <h2 className="text-3xl font-black text-base-content tracking-tight mb-1">
                            Create <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Account</span>
                        </h2>
                        <p className="text-sm font-medium text-base-content/60 max-w-[300px]">
                            Join RecipeHub to explore secret culinary methods
                        </p>
                    </div>

                    {/* Register Form */}
                    <form onSubmit={handleRegister} className="space-y-4">

                        {/* Name Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-base-content/60 pl-1">Full Name</label>
                            <div className={inputGroupClass}>
                                <FaUser className="text-base-content/30 group-focus-within:text-primary transition-colors text-lg" />
                                <input
                                    type="text"
                                    required
                                    disabled={loading}
                                    placeholder="Enter Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Photo URL */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-base-content/60 pl-1">Photo URL</label>
                            <div className={inputGroupClass}>
                                <FaImage className="text-base-content/30 group-focus-within:text-primary transition-colors text-lg" />
                                <input
                                    type="url"
                                    required
                                    disabled={loading}
                                    placeholder="Enter Your Photo Url "
                                    value={photoUrl}
                                    onChange={(e) => setPhotoUrl(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-base-content/60 pl-1">Email Address</label>
                            <div className={inputGroupClass}>
                                <FaEnvelope className="text-base-content/30 group-focus-within:text-primary transition-colors text-lg" />
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

                        {/* Password */}
                        <div className="space-y-1.5 relative">
                            <label className="text-xs font-bold uppercase tracking-wider text-base-content/60 pl-1">Password</label>
                            <div className={inputGroupClass}>
                                <FaLock className="text-base-content/30 group-focus-within:text-primary transition-colors text-lg" />
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

                        <p className="text-[11px] text-base-content/50 font-medium pl-1 pt-0.5">
                            Must be at least 8 characters with 1 uppercase and 1 number
                        </p>

                        {passwordError && (
                            <p className="text-xs text-error font-semibold pl-1 pt-1">
                                {passwordError}
                            </p>
                        )}

                        {/* Submit Button */}
                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-primary via-accent to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] hover:opacity-95 active:scale-[0.99] transition-all duration-300 text-sm disabled:opacity-50 disabled:pointer-events-none normal-case"
                            >
                                {loading ? "Creating Account..." : "Register Now"}
                                {!loading && <FaArrowRight className="text-base" />}
                            </button>
                        </div>
                    </form>

                    {/* Bottom Link */}
                    <p className="text-center text-sm text-base-content/60 font-medium mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="font-bold text-primary hover:underline">
                            Log In
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
                        Continue with Google
                    </button>

                </div>
            </motion.div>
        </section>
    );
};

export default RegisterPage;