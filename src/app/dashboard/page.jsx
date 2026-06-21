"use client";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast"; 

import AdminOverview from "@/components/AdminOverview";
import UserOverview from "@/components/UserOverview";

export default function DashboardOverview() {
    const { data: session, isPending: authPending } = authClient.useSession();
    const [stats, setStats] = useState(null);
    const [userRole, setUserRole] = useState("user");
    const [isPremiumUser, setIsPremiumUser] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authPending || !session?.user) {
            if (!authPending) setLoading(false);
            return;
        }

        const syncRoleAndFetchData = async () => {
            try {
                const email = session.user.email;
                const roleRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/check-user-role?email=${email}`);
                const roleData = await roleRes.json();

                // Block User
                if (roleData.success && roleData.isBlocked) {
                    await authClient.signOut(); 

                    
                    toast.error("Your account has been blocked by the administrator.", {
                        duration: 4000, 
                        position: "top-center",
                        style: {
                            background: "#333",
                            color: "#fff",
                            fontWeight: "bold"
                        }
                    });

                    
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 2000);

                    return;
                }

                let currentRole = "user";
                if (roleData.success && roleData.data) {
                    currentRole = roleData.data.role || "user";
                    setUserRole(currentRole);
                    setIsPremiumUser(roleData.data.isPremium || false);
                } else {
                    currentRole = session.user.role || "user";
                    setUserRole(currentRole);
                    setIsPremiumUser(session.user.isPremium || false);
                }

                let url = `${process.env.NEXT_PUBLIC_SERVER_URL}/user-stats?email=${email}`;
                if (currentRole === "admin") {
                    url = `${process.env.NEXT_PUBLIC_SERVER_URL}/admin-stats`;
                }

                const statsRes = await fetch(url);
                const statsData = await statsRes.json();
                if (statsData.success) {
                    setStats(statsData.data);
                }
            } catch (error) {
                console.error("Dashboard overview routing error:", error);
            } finally {
                setLoading(false);
            }
        };

        syncRoleAndFetchData();
    }, [session, authPending]);

    if (authPending || loading) {
        return (
            <div className="min-h-[50vh] flex flex-col justify-center items-center gap-2">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-xs font-bold opacity-50 tracking-wider uppercase animate-pulse">
                    Initializing Overview Session...
                </p>
            </div>
        );
    }

    if (userRole === "admin") {
        return <AdminOverview stats={stats} currentUser={session?.user} />;
    }

    return <UserOverview stats={stats} currentUser={session?.user} isPremium={isPremiumUser} />;
}