"use client";

import React, { useState, useEffect } from "react";
import { FaPercent, FaFloppyDisk, FaRotateLeft, FaCoins, FaUserGear, FaShieldHalved, FaChartLine } from "react-icons/fa6";
import { Toaster, toast } from "react-hot-toast";
import { HashLoader } from "react-spinners";
import { SERVER_URL } from "@/lib/apiConfig";

const AdminSettingsPage = () => {
  const [commissionRate, setCommissionRate] = useState(20);
  const [proFoodiePrice, setProFoodiePrice] = useState(9.99);
  const [masterChefPrice, setMasterChefPrice] = useState(19.99);
  const [proFoodieDesc, setProFoodieDesc] = useState("Perfect for home cooks wanting unlimited recipe access and meal planning tools.");
  const [masterChefDesc, setMasterChefDesc] = useState("Designed for culinary enthusiasts & professional chefs wanting maximum tools.");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [updatedBy, setUpdatedBy] = useState("admin");

  // Fetch current commission rate and plan pricing from server
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${SERVER_URL}/admin/settings`);
      const data = await res.json();
      if (data.success && data.settings) {
        setCommissionRate(data.settings.commissionRate !== undefined ? data.settings.commissionRate : 20);
        setProFoodiePrice(data.settings.proFoodiePrice !== undefined ? data.settings.proFoodiePrice : 9.99);
        setMasterChefPrice(data.settings.masterChefPrice !== undefined ? data.settings.masterChefPrice : 19.99);
        if (data.settings.proFoodieDesc) setProFoodieDesc(data.settings.proFoodieDesc);
        if (data.settings.masterChefDesc) setMasterChefDesc(data.settings.masterChefDesc);
        setLastUpdated(data.settings.updatedAt);
        setUpdatedBy(data.settings.updatedBy || "admin");
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Failed to load platform settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Save updated settings to server
  const handleSaveSettings = async () => {
    const rate = Number(commissionRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      return toast.error("Commission rate must be between 0% and 100%");
    }
    if (isNaN(Number(proFoodiePrice)) || Number(proFoodiePrice) < 0) {
      return toast.error("Pro Foodie price must be a valid positive number");
    }
    if (isNaN(Number(masterChefPrice)) || Number(masterChefPrice) < 0) {
      return toast.error("Master Chef price must be a valid positive number");
    }

    setSaving(true);
    const toastId = toast.loading("Saving platform settings...");

    try {
      const res = await fetch(`${SERVER_URL}/admin/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commissionRate: rate,
          proFoodiePrice: Number(proFoodiePrice),
          masterChefPrice: Number(masterChefPrice),
          proFoodieDesc,
          masterChefDesc,
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.dismiss(toastId);
        toast.success(data.message || "Platform settings updated successfully!");
        if (data.settings) {
          setCommissionRate(data.settings.commissionRate);
          setProFoodiePrice(data.settings.proFoodiePrice);
          setMasterChefPrice(data.settings.masterChefPrice);
          setLastUpdated(data.settings.updatedAt);
          setUpdatedBy(data.settings.updatedBy || "admin");
        }
      } else {
        toast.dismiss(toastId);
        toast.error(data.message || "Failed to update settings.");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.dismiss(toastId);
      toast.error("Error communicating with server.");
    } finally {
      setSaving(false);
    }
  };

  // Preview Calculations based on an example $100 sale
  const sampleSalePrice = 100;
  const adminShare = Number((sampleSalePrice * (commissionRate / 100)).toFixed(2));
  const creatorShare = Number((sampleSalePrice - adminShare).toFixed(2));

  const presets = [5, 10, 15, 20, 25, 30];

  if (loading) {
    return (
      <div className="w-full h-[65vh] flex flex-col items-center justify-center gap-4">
        <HashLoader color="#10b981" size={50} />
        <p className="text-xs font-bold text-base-content/60 tracking-wider uppercase animate-pulse">
          Fetching Platform Settings...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-base-content p-1 md:p-4">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-base-300 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Global Commission & Settings
          </h1>
          <p className="text-xs text-base-content/60 font-medium mt-1">
            Dynamically adjust platform fee percentage and manage real-time revenue splits.
          </p>
        </div>
        <div className="badge badge-primary gap-1.5 font-bold p-3 text-white shadow-sm">
          <FaShieldHalved className="text-xs" /> Admin Control Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Settings Card */}
        <div className="lg:col-span-2 bg-base-100 border border-base-300/60 rounded-3xl p-6 shadow-xs space-y-6">
          
          <div className="flex items-center justify-between border-b border-base-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                <FaPercent className="text-xl" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-base-content">Platform Commission Rate</h3>
                <p className="text-xs opacity-60 font-medium">Percentage deducted from every paid recipe transaction</p>
              </div>
            </div>
            <span className="badge bg-primary text-white font-black text-sm px-3 py-2 rounded-xl">
              {commissionRate}% Active
            </span>
          </div>

          {/* Interactive Range Slider */}
          <div className="space-y-4 bg-base-200/40 p-5 rounded-2xl border border-base-300/40">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/70">
                Adjust Commission Percentage
              </label>
              <div className="flex items-center gap-1.5 bg-base-100 border border-base-300 rounded-xl px-3 py-1 font-mono font-bold text-sm text-primary">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="w-12 text-right bg-transparent focus:outline-none"
                />
                <span>%</span>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="range range-primary range-sm"
            />

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-base-content/50">Quick Preset Selection:</span>
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => setCommissionRate(p)}
                    className={`btn btn-xs rounded-xl font-extrabold transition-all ${
                      commissionRate === p
                        ? "btn-primary text-white shadow-sm"
                        : "btn-ghost border border-base-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Membership Pricing Settings */}
          <div className="border-t border-base-200 pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary/10 text-secondary rounded-2xl">
                <FaCoins className="text-xl" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-base-content">Membership Plan Dynamic Pricing</h3>
                <p className="text-xs opacity-60 font-medium">Control subscription pricing displayed on the Pricing page</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pro Foodie Plan Price */}
              <div className="bg-base-200/40 p-4 rounded-2xl border border-base-300/40 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-base-content/80">
                    Pro Foodie Plan ($/mo)
                  </span>
                  <span className="badge badge-secondary badge-sm font-bold">Monthly</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-bold text-base-content/50">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={proFoodiePrice}
                    onChange={(e) => setProFoodiePrice(e.target.value)}
                    className="input input-bordered input-sm w-full pl-7 font-mono font-bold text-base-content"
                    placeholder="9.99"
                  />
                </div>
              </div>

              {/* Master Chef Plan Price */}
              <div className="bg-base-200/40 p-4 rounded-2xl border border-base-300/40 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-base-content/80">
                    Master Chef Plan ($/mo)
                  </span>
                  <span className="badge badge-accent badge-sm font-bold">Monthly</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-bold text-base-content/50">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={masterChefPrice}
                    onChange={(e) => setMasterChefPrice(e.target.value)}
                    className="input input-bordered input-sm w-full pl-7 font-mono font-bold text-base-content"
                    placeholder="19.99"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-base-200">
            <button
              onClick={fetchSettings}
              className="btn btn-ghost btn-sm rounded-xl font-bold normal-case gap-2 text-base-content/70"
            >
              <FaRotateLeft className="text-xs" /> Reset Changes
            </button>

            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="btn btn-primary rounded-xl font-black text-white normal-case gap-2 shadow-lg shadow-primary/20 hover:scale-102 transition-transform px-6"
            >
              <FaFloppyDisk className="text-sm" />
              <span>{saving ? "Saving..." : "Save Platform Settings"}</span>
            </button>
          </div>
        </div>

        {/* Real-Time Revenue Breakdown Preview Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 border border-base-300/60 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-base-200 pb-3">
              <FaChartLine className="text-emerald-500 text-lg" />
              <h3 className="font-extrabold text-sm text-base-content uppercase tracking-wider">
                Real-Time Revenue Split Preview
              </h3>
            </div>

            <p className="text-xs text-base-content/60 font-medium">
              Based on an example paid recipe sale of <strong className="text-base-content font-bold">$100.00</strong>:
            </p>

            <div className="space-y-3">
              {/* Admin Revenue Box */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <span className="text-[10px] font-black uppercase text-emerald-600 block tracking-wider">
                  Platform / Admin Revenue ({commissionRate}%)
                </span>
                <span className="text-2xl font-black text-emerald-600 block font-mono">
                  ${adminShare.toFixed(2)} USD
                </span>
              </div>

              {/* Creator Revenue Box */}
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                <span className="text-[10px] font-black uppercase text-indigo-500 block tracking-wider">
                  Creator Net Payout ({100 - commissionRate}%)
                </span>
                <span className="text-2xl font-black text-indigo-500 block font-mono">
                  ${creatorShare.toFixed(2)} USD
                </span>
              </div>
            </div>

            {lastUpdated && (
              <div className="pt-2 border-t border-base-200 text-[10px] text-base-content/50 font-medium">
                Last modified: {new Date(lastUpdated).toLocaleString("en-US")} by <span className="font-bold text-base-content/70">{updatedBy}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSettingsPage;
