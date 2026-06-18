"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { MdDashboard as DashboardIcon, MdLogout as LogoutIcon } from "react-icons/md";
import { useSession, signOut } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FaUtensils, FaBars, FaMoon, FaSun, FaUser, FaChevronDown } from "react-icons/fa6";

const Navbar = () => {
    const [theme, setTheme] = useState("light");
    const pathname = usePathname();
    const router = useRouter();

    const { data: session, isPending } = useSession();
    const user = session?.user;

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

    const handleLogout = async () => {
        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged out successfully! See you again. ", {
                            style: { borderRadius: "12px", background: "#262626", color: "#fff" },
                        });
                        router.push("/login");
                        router.refresh();
                    }
                }
            });
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to log out. Try again.");
        }
    };

    const isActive = (path) => pathname === path;

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Browse Recipes", path: "/browse-recipes" },
    ];

    return (
        <div className="navbar bg-base-100/70 backdrop-blur-md shadow-sm px-4 md:px-8 sticky top-0 z-50 border-b border-base-300/30 transition-all duration-300 text-base-content">

            {/* Navbar Start: Logo & Mobile Menu */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden hover:bg-base-200 rounded-xl px-2.5">
                        <FaBars className="h-5 w-5" />
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-2xl z-[1] mt-3 w-56 p-3 shadow-xl gap-1 border border-base-300/40 text-base-content"
                    >
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <Link
                                    href={link.path}
                                    className={`py-2.5 px-4 rounded-xl font-semibold transition-all ${isActive(link.path)
                                            ? "bg-primary/10 text-primary active:bg-primary/20"
                                            : "hover:bg-base-200"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-xl font-black bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent hover:opacity-90 transition-all ml-1 lg:ml-0">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary shadow-sm border border-primary/10">
                        <FaUtensils className="w-4 h-4" />
                    </div>
                    <span className="tracking-tight hidden sm:block font-black">RecipeHub</span>
                </Link>
            </div>

            {/* Navbar Center */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-1">
                    {navLinks.map((link) => (
                        <li key={link.path} className="relative group">
                            <Link
                                href={link.path}
                                className={`px-5 py-2 rounded-xl font-bold transition-all relative ${isActive(link.path)
                                        ? "text-primary bg-primary/5"
                                        : "text-base-content/80 hover:text-primary hover:bg-base-200/50"
                                    }`}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <span className="absolute bottom-1 left-5 right-5 h-[2.5px] bg-primary rounded-full" />
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Navbar End*/}
            <div className="navbar-end gap-2.5">

                {/* Theme Controller Button */}
                <button
                    onClick={toggleTheme}
                    className="btn btn-ghost btn-circle hover:bg-base-200/80 transition-all duration-300 bg-base-200/30 border border-base-300/10"
                    title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                >
                    {theme === "light" ? (
                        <FaMoon className="w-4 h-4 text-neutral-500" />
                    ) : (
                        <FaSun className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                    )}
                </button>

                {/* Live Dynamic Authentication Component */}
                {isPending ? (
                    <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : user ? (
                    <div className="dropdown dropdown-end bg-base-300 rounded-2xl ">


                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost flex items-center gap-1.5 px-2.5 py-1 hover:bg-base-200/80 rounded-xl transition-all duration-300 group"
                        >
                            <div className="avatar online placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-9 ring ring-primary ring-offset-base-100 ring-offset-2">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name} />
                                    ) : (
                                        <span className="text-sm font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                            </div>

                            <FaChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-80 transition-opacity ml-0.5 text-base-content" />
                        </div>

                        <ul
                            tabIndex={0}
                            className="dropdown-content menu p-3 shadow-2xl bg-base-100 rounded-2xl w-64 mt-4 gap-1 border border-base-300/30 text-base-content"
                        >
                            <div className="px-3 py-2 border-b border-base-200 mb-2">
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-sm truncate max-w-[140px]">{user.name}</p>
                                    {user.role === "admin" && (
                                        <span className="badge badge-warning badge-xs font-black p-1.5 shadow-sm text-[10px] text-amber-900">
                                            PRO
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs opacity-60 truncate">{user.email}</p>
                            </div>

                            <li>
                                <Link href="/dashboard" className="py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2">
                                    <DashboardIcon className="w-4 h-4" />
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
                                    onClick={handleLogout}
                                    className="py-2.5 rounded-xl hover:bg-error/10 hover:text-error text-error font-medium transition-all flex items-center gap-2 w-full text-left"
                                >
                                    <LogoutIcon className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link href="/login" className="btn btn-ghost btn-sm font-bold text-primary rounded-xl hover:bg-primary/10 transition-all normal-case px-4">
                            Login
                        </Link>
                        <Link href="/register" className="btn btn-primary btn-sm shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 rounded-xl text-white font-bold transition-all normal-case px-4">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;