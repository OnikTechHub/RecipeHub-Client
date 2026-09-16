"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  FaChartPie, FaUtensils, FaPlusCircle, FaHeart,
  FaShoppingBag, FaUserCircle, FaUsers, FaFlag,
  FaExchangeAlt, FaBars, FaSignOutAlt, FaHome, FaUserShield, FaCog, FaMagic, FaShoppingCart
} from "react-icons/fa";

import { HashLoader } from "react-spinners";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { data: session, isPending } = authClient.useSession();
  const [liveRole, setLiveRole] = useState(null);
  const [liveIsPremium, setLiveIsPremium] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
      return;
    }

    if (session?.user?.email) {
      setCheckingRole(true);
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/check-user-role?email=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            if (data.isBlocked) {
              authClient.signOut().then(() => {
                router.push("/login");
              });
              return;
            }
            if (data.data) {
              setLiveRole(data.data.role);
              setLiveIsPremium(data.data.isPremium || false);
            }
          }
        })
        .catch((err) => console.error("Error fetching live user role:", err))
        .finally(() => setCheckingRole(false));
    } else if (!isPending) {
      setCheckingRole(false);
    }
  }, [session, isPending, router]);

  if (isPending || checkingRole) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 gap-4">
        <HashLoader color="#10b981" size={50} />
        <span className="text-xs text-base-content/60 font-medium tracking-wide">Synchronizing Dashboard Permissions...</span>
      </div>
    );
  }

  if (!session) return null;

  const currentUser = session.user;
  const adminEmailEnv = process.env.NEXT_PUBLIC_ADMIN_EMAIL ? process.env.NEXT_PUBLIC_ADMIN_EMAIL.toLowerCase().trim() : "";
  const userEmailLower = currentUser?.email ? currentUser.email.toLowerCase().trim() : "";
  const isAdmin =
    Boolean(currentUser?.email) &&
    (liveRole === "admin" ||
     currentUser?.role === "admin" ||
     userEmailLower === "admin@recipehub.com" ||
     (Boolean(adminEmailEnv) && userEmailLower === adminEmailEnv));

  const isPremium = liveIsPremium || currentUser?.isPremium === true || isAdmin;

  const isActive = (path) => pathname === path ? "bg-primary text-white font-bold" : "hover:bg-base-300 opacity-80";

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col md:flex-row text-base-content">
      <div className="md:hidden bg-base-200 p-4 flex justify-between items-center border-b border-base-300">
        <span className="font-black tracking-wider text-xl text-primary">RecipeHub</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="btn btn-ghost btn-sm text-lg">
          <FaBars />
        </button>
      </div>

      <aside className={`${isSidebarOpen ? "block" : "hidden"} md:block w-full md:w-64 bg-base-200 border-r border-r-base-300/60 p-5 flex flex-col justify-between transition-all duration-300 shrink-0`}>
        <div className="space-y-6">
          <div className="hidden md:block pb-2 border-b border-base-300/60">
            <Link href="/" className="font-black text-2xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              RecipeHub
            </Link>
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-50 mt-1">Management Portal</p>
          </div>

          {/* User Profile */}
          <div className="bg-base-100 p-3 rounded-2xl border border-base-300/40 flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-xl">
                <img src={currentUser?.image || "/default-avatar.png"} alt={currentUser?.name} />
              </div>
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold truncate flex items-center gap-1">
                {currentUser?.name}
                {isPremium && <span className="badge badge-warning badge-xs text-[9px] font-black">PRO</span>}
              </h4>
              <p className="text-[10px] opacity-60 truncate uppercase font-semibold">
                {isAdmin ? "Admin Account" : "User Account"}
              </p>
            </div>
          </div>

          <nav className="space-y-1.5 text-sm font-medium">
            <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all hover:bg-base-300 opacity-80">
              <FaHome className="text-lg" /> Back to Home
            </Link>

            {!isAdmin && (
              <>
                <p className="text-[11px] font-bold opacity-40 uppercase px-3 pt-2 tracking-wider">User Dashboard</p>
                <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive("/dashboard")}`}>
                  <FaChartPie className="text-lg" /> Overview
                </Link>
                <Link href="/dashboard/ai-recipe-generator" className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${isActive("/dashboard/ai-recipe-generator")}`}>
                  <span className="flex items-center gap-3">
                    <FaMagic className="text-lg text-amber-500" /> AI Generator
                  </span>
                  <span className="badge badge-warning badge-xs font-black text-[9px]">PRO</span>
                </Link>
                <Link href="/dashboard/my-recipes" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive("/dashboard/my-recipes")}`}>
                  <FaUtensils className="text-lg" /> My Recipes
                </Link>
                <Link href="/dashboard/add-recipe" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive("/dashboard/add-recipe")}`}>
                  <FaPlusCircle className="text-lg" /> Add Recipe
                </Link>
                <Link href="/dashboard/my-favorites" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive("/dashboard/my-favorites")}`}>
                  <FaHeart className="text-lg" /> My Favorites
                </Link>
                <Link href="/dashboard/purchased-recipes" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive("/dashboard/purchased-recipes")}`}>
                  <FaShoppingBag className="text-lg" /> My Purchased Recipes
                </Link>
                <Link href="/dashboard/grocery-list" className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${isActive("/dashboard/grocery-list")}`}>
                  <span className="flex items-center gap-3">
                    <FaShoppingCart className="text-lg text-emerald-500" /> Smart Grocery List
                  </span>
                  <span className="badge badge-warning badge-xs font-black text-[9px]">PRO</span>
                </Link>

                <Link href="/dashboard/profile" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive("/dashboard/profile")}`}>
                  <FaUserCircle className="text-lg" /> Profile
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <p className="text-[11px] font-bold opacity-40 uppercase px-3 pt-2 tracking-wider">Admin Dashboard</p>
                <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive("/dashboard")}`}>
                  <FaChartPie className="text-lg" /> Overview
                </Link>
                <Link href="/dashboard/manage-users" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive("/dashboard/manage-users")}`}>
                  <FaUsers className="text-lg" /> Manage Users
                </Link>
                <Link href="/dashboard/manage-admins" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive("/dashboard/manage-admins")}`}>
                  <FaUserShield className="text-lg" /> Manage Admins
                </Link>
                <Link href="/dashboard/manage-recipes" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive("/dashboard/manage-recipes")}`}>
                  <FaUtensils className="text-lg" /> Manage Recipes
                </Link>
                <Link href="/dashboard/reports" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive("/dashboard/reports")}`}>
                  <FaFlag className="text-lg" /> Reports
                </Link>
                <Link href="/dashboard/transactions" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive("/dashboard/transactions")}`}>
                  <FaExchangeAlt className="text-lg" /> Transactions
                </Link>
                <Link href="/dashboard/settings" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive("/dashboard/settings")}`}>
                  <FaCog className="text-lg" /> Commission & Settings
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="pt-4 border-t border-base-300/60">
          <button onClick={handleLogout} className="btn btn-ghost btn-sm w-full rounded-xl text-error normal-case justify-start gap-3 font-semibold">
            <FaSignOutAlt /> Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-base-100 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}