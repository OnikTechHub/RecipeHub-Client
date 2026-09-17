"use client";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { HashLoader } from "react-spinners";
import toast from "react-hot-toast";
import {
  FaKey,
  FaGaugeHigh,
  FaWandSparkles,
  FaChevronDown,
  FaChevronUp,
  FaFolderClosed,
  FaFolderOpen,
  FaCircleCheck,
  FaTriangleExclamation,
  FaServer,
  FaRotate,
  FaMagnifyingGlass,
  FaFilter,
  FaLayerGroup,
  FaShieldHalved
} from "react-icons/fa6";
import { SERVER_URL } from "@/lib/apiConfig";

export default function ApiLimitsPage() {
  const { data: session, isPending: authPending } = authClient.useSession();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFolded, setIsFolded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchApiAnalytics = async () => {
    if (!session?.user?.email) return;
    try {
      const email = session.user.email;
      const res = await fetch(`${SERVER_URL}/admin-stats?email=${encodeURIComponent(email)}`, {
        headers: {
          "x-admin-email": email,
          "x-user-email": email,
        },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.data?.apiAnalytics) {
        setAnalytics(data.data.apiAnalytics);
      }
    } catch (error) {
      console.error("Error fetching API Analytics:", error);
      toast.error("Failed to load API analytics data.", {
        style: { borderRadius: "12px", background: "#262626", color: "#fff" },
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (authPending) return;
    fetchApiAnalytics();
  }, [session, authPending]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchApiAnalytics();
  };

  if (authPending || loading) {
    return (
      <div className="min-h-[50vh] flex flex-col justify-center items-center gap-4">
        <HashLoader color="#10b981" size={50} />
        <p className="text-xs font-bold opacity-60 tracking-wider uppercase animate-pulse">
          Loading AI Key Quotas & Limits...
        </p>
      </div>
    );
  }

  const keyList = analytics?.keyDetails || [];

  // Filter keys by search term and status
  const filteredKeys = keyList.filter((keyItem) => {
    const matchesSearch =
      (keyItem.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (keyItem.tag || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (keyItem.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (keyItem.maskedKey || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && keyItem.status === "Active") ||
      (statusFilter === "EXHAUSTED" && keyItem.status === "Exhausted");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-300 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-base-content/60 font-medium mb-1">
            <span>Admin Dashboard</span>
            <span>/</span>
            <span className="text-primary font-bold">API Limits & Quota Analytics</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-base-content flex items-center gap-3">
            <FaKey className="text-amber-500" />
            <span>AI Key Management & Quota Analytics</span>
          </h1>
          <p className="text-sm text-base-content/60 font-medium mt-1">
            Monitor real-time Gemini API key pool capacity, daily limits, rotation status, and performance metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn btn-outline btn-sm rounded-xl font-bold gap-2 hover:bg-base-200"
          >
            <FaRotate className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            <span>Refresh Stats</span>
          </button>
          <div className="badge badge-warning gap-2 p-4 rounded-xl font-black text-slate-900 shadow-xs">
            <FaServer /> {analytics?.activeKeysCount || 1} ACTIVE KEYS POOL
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-base-100 border border-base-300 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">Key Pool Count</p>
            <h3 className="text-2xl font-black text-base-content mt-1">{analytics?.activeKeysCount || 0} Keys</h3>
            <p className="text-[11px] text-emerald-500 font-bold mt-0.5">Round-Robin Rotation Active</p>
          </div>
          <div className="p-3.5 bg-amber-500/10 text-amber-500 rounded-2xl text-2xl">
            <FaKey />
          </div>
        </div>

        <div className="bg-base-100 border border-base-300 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">Aggregated Usage</p>
            <h3 className="text-2xl font-black text-base-content mt-1">
              {analytics?.aggregatedUsagePercent || 0}%
            </h3>
            <p className="text-[11px] text-base-content/60 font-semibold mt-0.5">
              {analytics?.totalRequestsUsed || 0} / {analytics?.totalSystemCapacity || 15000} Req
            </p>
          </div>
          <div className="p-3.5 bg-primary/10 text-primary rounded-2xl text-2xl">
            <FaGaugeHigh />
          </div>
        </div>

        <div className="bg-base-100 border border-emerald-500/30 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Remaining Quota</p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {(analytics?.remainingQuota || 0).toLocaleString()} Req
            </h3>
            <p className="text-[11px] text-emerald-500 font-bold mt-0.5">Available for AI Engine</p>
          </div>
          <div className="p-3.5 bg-emerald-500/10 text-emerald-500 rounded-2xl text-2xl">
            <FaCircleCheck />
          </div>
        </div>

        <div className="bg-base-100 border border-base-300 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">Daily Limit per Key</p>
            <h3 className="text-2xl font-black text-base-content mt-1">1,500 Req</h3>
            <p className="text-[11px] text-base-content/60 font-semibold mt-0.5">Google Gemini Free Tier</p>
          </div>
          <div className="p-3.5 bg-secondary/10 text-secondary rounded-2xl text-2xl">
            <FaWandSparkles />
          </div>
        </div>
      </div>

      {/* System Capacity Usage Widget */}
      <div className="bg-base-100 border border-base-300 p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-base-300/60 pb-4">
          <div>
            <h2 className="text-lg font-black text-base-content flex items-center gap-2">
              <FaGaugeHigh className="text-accent" /> Aggregated System Capacity
            </h2>
            <p className="text-xs text-base-content/60 font-medium mt-1">
              Combined real-time consumption across all configured Gemini API keys in the system environment pool.
            </p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-black text-sm">
            {analytics?.aggregatedUsagePercent || 0}% Capacity Used
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-base-content">System Load Status:</span>
            <span className="text-primary font-black">
              {analytics?.totalRequestsUsed || 0} / {analytics?.totalSystemCapacity || 15000} Requests Used Today
            </span>
          </div>

          <div className="w-full bg-base-300 dark:bg-base-800 h-4 rounded-full overflow-hidden p-0.5 border border-base-300 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${Math.min(100, Math.max(2, analytics?.aggregatedUsagePercent || 0))}%` }}
            ></div>
          </div>

          <div className="flex flex-wrap justify-between items-center text-[11px] text-base-content/70 font-semibold pt-1">
            <span>Active Keys: <strong>{analytics?.activeKeysCount || 1} Operational Keys</strong></span>
            <span>Reset Cycle: <strong>24-Hour Rolling Window</strong></span>
            <span>Fallback Engine: <strong className="text-emerald-500">Smart Culinary Fallback Enabled</strong></span>
          </div>
        </div>
      </div>

      {/* API Keys Details Section with Fold / Unfold Feature */}
      <div className="bg-base-100 border border-base-300 p-6 rounded-3xl shadow-sm space-y-6">
        {/* Controls Header: Search, Filter, and Fold/Unfold Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-base-300/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
              <FaLayerGroup className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-base-content flex items-center gap-2">
                Active API Keys Breakdown
                <span className="badge badge-accent badge-sm font-black text-[10px]">
                  {filteredKeys.length} of {keyList.length}
                </span>
              </h2>
              <p className="text-xs text-base-content/60 font-medium">
                Professional assigned key roles, usage metrics, and live status indicator.
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-xs" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search key name or role..."
                className="input input-sm input-bordered pl-9 pr-3 rounded-xl text-xs font-medium w-48 sm:w-56 focus:input-primary"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select select-sm select-bordered rounded-xl text-xs font-semibold focus:select-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="EXHAUSTED">Exhausted Only</option>
            </select>

            {/* Fold / Unfold Toggle Button */}
            <button
              onClick={() => setIsFolded(!isFolded)}
              className={`btn btn-sm rounded-xl font-bold gap-2 transition-all duration-200 ${
                isFolded
                  ? "bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-500/20"
                  : "bg-base-200 hover:bg-base-300 text-base-content border border-base-300"
              }`}
            >
              {isFolded ? (
                <>
                  <FaFolderOpen className="w-4 h-4" />
                  <span>Unfold Keys List</span>
                  <FaChevronDown className="w-3 h-3 opacity-70" />
                </>
              ) : (
                <>
                  <FaFolderClosed className="w-4 h-4" />
                  <span>Fold Keys List</span>
                  <FaChevronUp className="w-3 h-3 opacity-70" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Content Area */}
        {isFolded ? (
          /* Folded State View */
          <div className="bg-base-200/50 border border-base-300/80 rounded-2xl p-6 text-center space-y-3 transition-all duration-300">
            <div className="inline-flex p-3 bg-amber-500/10 text-amber-500 rounded-full text-2xl">
              <FaFolderClosed />
            </div>
            <h3 className="text-base font-black text-base-content">
              Key Pool Details Folded ({keyList.length} Keys Hidden)
            </h3>
            <p className="text-xs text-base-content/60 max-w-md mx-auto font-medium">
              The API keys breakdown grid is currently collapsed to keep your workspace view concise. Click the <strong>Unfold Keys List</strong> button to expand and view detailed key metrics.
            </p>
            <button
              onClick={() => setIsFolded(false)}
              className="btn btn-sm bg-primary text-white rounded-xl font-bold gap-2 hover:bg-primary/90 mt-2"
            >
              <FaFolderOpen /> Unfold Details Grid
            </button>
          </div>
        ) : (
          /* Unfolded Grid View */
          <div className="space-y-4 transition-all duration-300">
            {filteredKeys.length === 0 ? (
              <div className="text-center py-10 bg-base-200/30 rounded-2xl border border-dashed border-base-300 text-xs text-base-content/60 font-medium">
                No API keys matched your search criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredKeys.map((keyItem) => (
                  <div
                    key={keyItem.id}
                    className="bg-base-200/40 border border-base-300/70 hover:border-primary/40 p-5 rounded-2xl space-y-3 transition-all duration-200 shadow-xs hover:shadow-md group"
                  >
                    {/* Card Header: Meaningful Name & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="badge badge-primary badge-xs font-extrabold uppercase text-[8px] tracking-wider">
                            Key #{keyItem.keyIndex}
                          </span>
                          <span className="badge badge-ghost badge-xs font-bold text-[9px]">
                            {keyItem.category || "AI Module"}
                          </span>
                        </div>
                        <h4 className="font-black text-sm text-base-content group-hover:text-primary transition-colors leading-snug">
                          {keyItem.name}
                        </h4>
                      </div>
                      <span
                        className={`badge badge-sm font-black uppercase text-[9px] px-2.5 py-1 ${
                          keyItem.status === "Active"
                            ? "badge-success text-white"
                            : "badge-error text-white animate-pulse"
                        }`}
                      >
                        {keyItem.status === "Active" ? "Operational" : "Exhausted"}
                      </span>
                    </div>

                    {/* Tag & Masked Key */}
                    <div className="flex items-center justify-between bg-base-100/70 p-2.5 rounded-xl border border-base-300/40 text-xs">
                      <span className="font-bold text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <FaShieldHalved className="w-3 h-3" /> {keyItem.tag || "Production"}
                      </span>
                      <span className="font-mono text-[11px] text-base-content/60 bg-base-200 px-2 py-0.5 rounded-md">
                        {keyItem.maskedKey}
                      </span>
                    </div>

                    {/* Usage Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-base-content/70">Daily Capacity Used:</span>
                        <span className="text-primary font-black">
                          {keyItem.callsToday} / {keyItem.capacity} Req ({keyItem.usagePercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-base-300 dark:bg-base-700 h-2.5 rounded-full overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            keyItem.usagePercent > 80
                              ? "bg-error"
                              : keyItem.usagePercent > 40
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(100, Math.max(2, keyItem.usagePercent || 0))}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Card Footer: Metadata */}
                    <div className="flex justify-between items-center text-[10px] text-base-content/50 font-semibold pt-1 border-t border-base-300/40">
                      <span>Provider: <strong>{keyItem.provider || "Gemini 1.5 Flash"}</strong></span>
                      <span>Reset: <strong>Midnight UTC</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
