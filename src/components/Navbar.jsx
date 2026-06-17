"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaUtensils, FaBars, FaMoon, FaSun, FaUser } from "react-icons/fa6";
import { MdDashboard, MdLogout } from "react-icons/md";

export default function Navbar() {
    // থিম স্টেট (ডিফল্ট লাইট থিম)
    const [theme, setTheme] = useState("light");

    // ইউজার লগইন স্টেট (আপাতত টেস্ট করার জন্য ডাটা সেট করা আছে)
    const [user, setUser] = useState({
        name: "Onik Das",
        email: "onik@example.com",
        image: "", // খালি থাকলে নামের প্রথম অক্ষর দেখাবে
        isPremium: true, // প্রিমিয়াম মেম্বার হলে ব্যাজ দেখাবে
    });

    // থিম চেঞ্জ হ্যান্ডলার
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

    return (
        <div className="navbar bg-base-100/80 backdrop-blur-md shadow-lg px-4 md:px-8 sticky top-0 z-50 border-b border-base-200 transition-all duration-300">
            {/* Navbar Start: Logo & Mobile Menu */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden hover:bg-base-200 rounded-xl">
                        <FaBars className="h-5 w-5 text-base-content" />
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100/95 backdrop-blur-lg rounded-2xl z-[1] mt-3 w-56 p-3 shadow-xl gap-2 border border-base-200"
                    >
                        <li><Link href="/" className="py-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">Home</Link></li>
                        <li><Link href="/browse-recipes" className="py-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">Browse Recipes</Link></li>
                    </ul>
                </div>

                {/* প্রিমিয়াম গ্রেডিয়েন্ট লোগো */}
                <Link href="/" className="flex items-center gap-2 text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:opacity-90 transition-opacity">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                        <FaUtensils className="w-5 h-5" />
                    </div>
                    <span className="tracking-tight hidden sm:block">RecipeHub</span>
                </Link>
            </div>

            {/* Navbar Center: Desktop Menu */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2 font-semibold text-base-content/80">
                    <li>
                        <Link href="/" className="px-4 py-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/browse-recipes" className="px-4 py-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                            Browse Recipes
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Navbar End: Theme & User Profile/Auth Buttons */}
            <div className="navbar-end gap-3">
                {/* প্রিমিয়াম থিম টগলার বাটন */}
                <button
                    onClick={toggleTheme}
                    className="btn btn-ghost btn-circle hover:bg-base-200 text-base-content transition-all duration-300"
                    title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                >
                    {theme === "light" ? (
                        <FaMoon className="w-5 h-5 text-neutral-500" />
                    ) : (
                        <FaSun className="w-5 h-5 text-amber-400" />
                    )}
                </button>

                {/* ডাইনামিক অথেনটিকেশন পার্ট */}
                {user ? (
                    /* ইউজার লগইন থাকলে এই প্রিমিয়াম ড্রপডাউনটি দেখাবে */
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar online placeholder hover:scale-105 transition-transform">
                            <div className="bg-neutral text-neutral-content rounded-full w-10 ring ring-primary ring-offset-base-100 ring-offset-2">
                                {user.image ? (
                                    <img src={user.image} alt={user.name} />
                                ) : (
                                    <span className="text-sm font-bold">{user.name.charAt(0)}</span>
                                )}
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu p-3 shadow-2xl bg-base-100/95 backdrop-blur-lg rounded-2xl w-64 mt-4 gap-1 border border-base-200 text-base-content"
                        >
                            {/* ইউজার ইনফো সেকশন */}
                            <div className="px-3 py-2 border-b border-base-200 mb-2">
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-sm truncate max-w-[140px]">{user.name}</p>
                                    {user.isPremium && (
                                        <span className="badge badge-warning badge-xs font-black p-1.5 shadow-sm text-[10px] text-amber-900">
                                            PRO
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                            </div>
                            <li>
                                <Link href="/dashboard" className="py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2">
                                    <MdDashboard className="w-4 h-4" /> {/* এখানে MdDashboard বসিয়ে দাও */}
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/profile" className="py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2">
                                    <FaUser className="w-4 h-4" />
                                    <span>My Profile</span>
                                </Link>
                            </li>
                            <div className="border-t border-base-200 my-1"></div>
                            <li>
                                <button
                                    onClick={() => setUser(null)} // টেস্ট করার জন্য লগআউট ক্লিক করলে স্টেট নাল হবে
                                    className="py-2.5 rounded-xl hover:bg-error/10 hover:text-error text-error font-medium transition-all flex items-center gap-2"
                                >
                                    <MdLogout className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    /* ইউজার লগইন না থাকলে এই বাটনগুলো দেখাবে */
                    <div className="flex items-center gap-2">
                        <Link href="/login" className="btn btn-ghost btn-sm md:btn-md font-bold text-primary rounded-xl hover:bg-primary/10">
                            Login
                        </Link>
                        <Link href="/register" className="btn btn-primary btn-sm md:btn-md shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 rounded-xl text-white font-bold transition-all">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}