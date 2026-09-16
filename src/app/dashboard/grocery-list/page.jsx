"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";
import { downloadGroceryListPDF } from "@/lib/pdfGenerator";
import toast from "react-hot-toast";
import {
  FaCartShopping,
  FaCrown,
  FaLock,
  FaArrowRight,
  FaCheck,
  FaCopy,
  FaPrint,
  FaUtensils,
  FaCalculator,
  FaBasketShopping,
  FaFilePdf,
  FaListCheck,
} from "react-icons/fa6";
import { HashLoader } from "react-spinners";

export default function SmartGroceryListPage() {
  const { data: session, isPending } = authClient.useSession();
  const currentUser = session?.user;
  const { isAdmin, isPremiumUser, isPurchased } = useCart();

  const [liveRole, setLiveRole] = useState(null);
  const [liveIsPremium, setLiveIsPremium] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  // Available recipes & selections
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  // Grocery List State
  const [generating, setGenerating] = useState(false);
  const [groceryData, setGroceryData] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [copied, setCopied] = useState(false);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  // Check live user status
  useEffect(() => {
    if (currentUser?.email) {
      setCheckingRole(true);
      fetch(`${SERVER_URL}/check-user-role?email=${encodeURIComponent(currentUser.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setLiveRole(data.data.role);
            setLiveIsPremium(Boolean(data.data.isPremium || data.data.role === "admin" || data.data.role === "premium"));
          }
        })
        .catch((err) => console.error("Error checking live role in Grocery List:", err))
        .finally(() => setCheckingRole(false));
    } else if (!isPending) {
      setCheckingRole(false);
    }
  }, [currentUser?.email, SERVER_URL, isPending]);

  const isPremium = liveIsPremium || isPremiumUser || isAdmin;

  // Fetch user's saved/favorite/purchased recipes with Access Control Verification
  useEffect(() => {
    if (!currentUser?.email || !isPremium) return;

    const loadUserRecipes = async () => {
      try {
        setLoadingRecipes(true);
        const email = encodeURIComponent(currentUser.email);

        const [favRes, purchasedRes] = await Promise.all([
          fetch(`${SERVER_URL}/favorites?email=${email}`).then((r) => r.json()).catch(() => ({ data: [] })),
          fetch(`${SERVER_URL}/recipes?filter=purchased&email=${email}&limit=50`).then((r) => r.json()).catch(() => ({ data: [] })),
        ]);

        const recipesMap = new Map();

        // 1. Process Favorites with Access Control Calculation
        if (favRes.success && Array.isArray(favRes.data)) {
          favRes.data.forEach((fav) => {
            const r = fav.recipeInfo || fav.recipeDetails || {};
            const rId = fav.recipeId || r._id;
            if (rId && r.ingredients) {
              const isPaid = r.recipeType === "Paid" || r.isPaid === true || Number(r.price || 0) > 0;
              const authorEmail = r.authorEmail || r.userEmail || fav.authorEmail;
              const owned = isPurchased(rId.toString(), authorEmail);
              const isAuthor = Boolean(authorEmail && currentUser?.email && authorEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim());
              const isAccessible = owned || isAdmin || isAuthor || (!isPaid && isPremium);

              recipesMap.set(rId.toString(), {
                id: rId.toString(),
                title: r.recipeName || fav.recipeName || "Favorite Recipe",
                ingredients: Array.isArray(r.ingredients) ? r.ingredients : [r.ingredients],
                image: r.recipeImage || r.image || fav.image,
                isPaid,
                price: Number(r.price || 5).toFixed(2),
                isAccessible,
                authorEmail,
              });
            }
          });
        }

        // 2. Process Purchased Recipes (Always Accessible)
        if (purchasedRes.success && Array.isArray(purchasedRes.data)) {
          purchasedRes.data.forEach((r) => {
            if (r._id && r.ingredients) {
              recipesMap.set(r._id.toString(), {
                id: r._id.toString(),
                title: r.recipeName || r.title || "Unlocked Recipe",
                ingredients: Array.isArray(r.ingredients) ? r.ingredients : [r.ingredients],
                image: r.recipeImage || r.image,
                isPaid: true,
                price: Number(r.price || 5).toFixed(2),
                isAccessible: true,
                authorEmail: r.authorEmail || "",
              });
            }
          });
        }

        const list = Array.from(recipesMap.values());
        setAvailableRecipes(list);

        // Pre-select first 3 accessible recipes by default
        const accessibleList = list.filter((item) => item.isAccessible);
        if (accessibleList.length > 0) {
          setSelectedRecipeIds(accessibleList.slice(0, 3).map((item) => item.id));
        } else {
          setSelectedRecipeIds([]);
        }
      } catch (err) {
        console.error("Error loading user recipes for grocery list:", err);
      } finally {
        setLoadingRecipes(false);
      }
    };

    loadUserRecipes();
  }, [currentUser?.email, isPremium, SERVER_URL]);

  const handleToggleSelectRecipe = (id) => {
    const recipe = availableRecipes.find((r) => r.id === id);
    if (recipe && !recipe.isAccessible) {
      toast.error(`"${recipe.title}" is a locked recipe! Unlock it first to add to your grocery list.`, { icon: "🔒" });
      return;
    }

    setSelectedRecipeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const accessibleIds = availableRecipes.filter((r) => r.isAccessible).map((r) => r.id);
    if (selectedRecipeIds.length === accessibleIds.length) {
      setSelectedRecipeIds([]);
    } else {
      setSelectedRecipeIds(accessibleIds);
    }
  };

  // Smart Backend-Validated AI Ingredient Categorization & Cost Estimation Engine
  const generateGroceryList = async () => {
    if (selectedRecipeIds.length === 0) {
      toast.error("Please select at least one accessible recipe to generate your grocery list!");
      return;
    }

    setGenerating(true);

    try {
      const res = await fetch(`${SERVER_URL}/api/ai/generate-grocery-list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeIds: selectedRecipeIds,
          userEmail: currentUser?.email,
        }),
      });

      const result = await res.json();

      if (result.success && result.data) {
        setGroceryData(result.data);
        setCheckedItems({});
        toast.success("✨ Smart Grocery List generated & backend verified!");
      } else {
        toast.error(result.message || "Failed to generate grocery list.");
      }
    } catch (err) {
      console.error("Grocery list generation error:", err);
      toast.error("Connection error generating grocery list.");
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleCheckItem = (itemName) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const handleCopyList = () => {
    if (!groceryData) return;
    let text = `🛒 RECIPEHUB SMART GROCERY LIST (${groceryData.selectedRecipesCount} Recipes)\nEstimated Cost: ${groceryData.estimatedCost}\n\n`;

    if (Array.isArray(groceryData.recipeBreakdown)) {
      text += "📋 RECIPE BREAKDOWN:\n";
      groceryData.recipeBreakdown.forEach((r, idx) => {
        text += `${idx + 1}. ${r.recipeName}: ${r.ingredients.join(", ")}\n`;
      });
      text += "\n";
    }

    text += "🛒 SUPERMARKET CHECKLIST:\n";
    groceryData.categories.forEach((cat) => {
      text += `${cat.icon} ${cat.title.toUpperCase()}:\n`;
      cat.items.forEach((item) => {
        const isDone = checkedItems[item.name] ? "[x]" : "[ ]";
        text += `  ${isDone} ${item.name}${item.count > 1 ? ` (x${item.count})` : ""}\n`;
      });
      text += "\n";
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Grocery list copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPDF = () => {
    if (!groceryData) return;
    downloadGroceryListPDF(groceryData, currentUser?.email);
    toast.success("Grocery List PDF downloaded successfully!");
  };

  if (isPending || checkingRole) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <HashLoader color="#10b981" size={45} />
        <p className="text-xs font-semibold text-base-content/60">Verifying Membership Status...</p>
      </div>
    );
  }

  // Paywall Gate for Free Users
  if (!isPremium) {
    return (
      <div className="bg-base-100 dark:bg-base-900 border-2 border-amber-500/40 rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden max-w-2xl mx-auto my-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto text-3xl shadow-xl border border-amber-300/40 animate-bounce">
          <FaCrown />
        </div>

        <div className="space-y-3 max-w-md mx-auto">
          <span className="badge badge-warning font-black text-[10px] uppercase tracking-wider px-3 py-1">
            Exclusive Premium Feature
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center justify-center gap-2 text-base-content">
            <span>Smart Grocery List</span>
            <FaLock className="text-amber-500 text-lg" />
          </h2>
          <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed font-medium">
            The <strong>AI Smart Grocery List</strong> automatically combines ingredients from your saved & favorite recipes, categorizes items by supermarket aisles, and estimates your total shopping cost!
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/#pricing"
            className="btn btn-warning btn-md rounded-2xl font-extrabold px-8 gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer text-slate-950"
          >
            <FaCrown className="text-sm" /> Upgrade to RecipeHub Premium
          </Link>
          <Link
            href="/dashboard/my-favorites"
            className="btn btn-ghost btn-md rounded-2xl font-bold text-xs hover:bg-base-200"
          >
            Back to Favorites <FaArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  const accessibleRecipesCount = availableRecipes.filter((r) => r.isAccessible).length;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-emerald-200 shadow-xs border border-white/20">
              <FaCartShopping /> Premium AI Shopping Assistant
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
            <span>Smart Grocery List</span>
            <FaBasketShopping className="text-amber-300 text-3xl" />
          </h1>
          <p className="text-xs sm:text-sm font-medium opacity-90 leading-relaxed">
            Select your unlocked favorite recipes below to generate an aisle-categorized grocery checklist, per-recipe ingredient breakdown, and instant PDF download!
          </p>
        </div>

        <div className="absolute top-4 right-6 text-white/10 text-9xl pointer-events-none hidden md:block">
          <FaCartShopping />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recipe Selection */}
        <div className="lg:col-span-5 bg-base-100 dark:bg-base-900 p-6 rounded-3xl border border-base-300 dark:border-base-700 shadow-xl space-y-6">
          <div className="pb-3 border-b border-base-300 dark:border-base-700 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base tracking-tight flex items-center gap-2">
                <FaUtensils className="text-primary" /> Select Saved Recipes
              </h3>
              <p className="text-[10px] text-base-content/60 font-medium">
                {accessibleRecipesCount} accessible recipes available
              </p>
            </div>
            {accessibleRecipesCount > 0 && (
              <button
                onClick={handleSelectAll}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                {selectedRecipeIds.length === accessibleRecipesCount ? "Deselect All" : "Select Accessible"}
              </button>
            )}
          </div>

          {loadingRecipes ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <HashLoader color="#10b981" size={35} />
              <p className="text-xs font-semibold opacity-60">Loading saved recipes...</p>
            </div>
          ) : availableRecipes.length === 0 ? (
            <div className="p-8 text-center bg-base-200/50 rounded-2xl border border-dashed border-base-300 space-y-3">
              <p className="text-xs font-bold text-base-content/70">No saved or favorite recipes found!</p>
              <p className="text-[11px] text-base-content/60">
                Save recipes to your favorites or collection first to generate a combined grocery list.
              </p>
              <Link
                href="/browse-recipes"
                className="btn btn-primary btn-xs rounded-xl font-bold gap-1 mt-1"
              >
                Browse Recipes <FaArrowRight />
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
              {availableRecipes.map((r) => {
                const isSelected = selectedRecipeIds.includes(r.id);
                const isLocked = !r.isAccessible;

                return (
                  <div
                    key={r.id}
                    onClick={() => handleToggleSelectRecipe(r.id)}
                    className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                      isLocked
                        ? "border-base-300/50 bg-base-200/30 opacity-60 cursor-not-allowed"
                        : isSelected
                        ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 font-bold cursor-pointer"
                        : "border-base-300/60 hover:bg-base-200/60 opacity-90 cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isLocked}
                      onChange={() => {}}
                      className="checkbox checkbox-emerald checkbox-sm"
                    />
                    {r.image && (
                      <img
                        src={r.image}
                        alt={r.title}
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                    )}
                    <div className="truncate flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold truncate text-base-content">
                          {r.title}
                        </span>
                        {isLocked && (
                          <span className="badge badge-warning badge-xs font-bold shrink-0 flex items-center gap-1">
                            <FaLock className="text-[9px]" /> Locked (${r.price})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] opacity-60 font-medium mt-0.5">
                        <span>{r.ingredients.length} ingredients</span>
                        {isLocked && (
                          <Link
                            href={`/browse-recipes/${r.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-primary hover:underline font-bold"
                          >
                            Unlock Recipe
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={generateGroceryList}
            disabled={generating || selectedRecipeIds.length === 0}
            className="btn btn-primary btn-md w-full rounded-2xl font-black text-xs gap-2 shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 border-none text-white disabled:opacity-40"
          >
            {generating ? (
              <>
                <HashLoader color="#ffffff" size={18} />
                <span>Backend Verifying & Aggregating...</span>
              </>
            ) : (
              <>
                <FaCartShopping />
                <span>Generate Smart Grocery List ({selectedRecipeIds.length})</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Grocery List Display */}
        <div className="lg:col-span-7 space-y-6">
          {!groceryData && !generating && (
            <div className="bg-base-100 dark:bg-base-900 rounded-3xl border border-dashed border-base-300 dark:border-base-700 p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[440px]">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-3xl border border-emerald-500/20">
                <FaBasketShopping />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="font-black text-xl text-base-content">Ready to Shop Smarter?</h3>
                <p className="text-xs text-base-content/70 leading-relaxed font-medium">
                  Select your unlocked recipes on the left panel and click <strong>Generate Smart Grocery List</strong>. Your aggregated shopping list and PDF report will appear here!
                </p>
              </div>
            </div>
          )}

          {generating && (
            <div className="bg-base-100 dark:bg-base-900 rounded-3xl border border-base-300 dark:border-base-700 p-12 text-center flex flex-col items-center justify-center gap-5 min-h-[440px]">
              <HashLoader color="#10b981" size={55} />
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-emerald-600 animate-pulse">
                  Backend Verifying Ownership & Categorizing Ingredients...
                </h3>
                <p className="text-xs text-base-content/60 font-medium">
                  Grouping items by supermarket aisle, generating recipe breakdown & cost estimation...
                </p>
              </div>
            </div>
          )}

          {groceryData && !generating && (
            <div className="bg-base-100 dark:bg-base-900 rounded-3xl border border-base-300 dark:border-base-700 p-6 md:p-8 space-y-6 shadow-2xl">
              {/* Header Stats & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-base-300 dark:border-base-700">
                <div>
                  <span className="badge badge-emerald badge-sm font-extrabold text-[10px] uppercase mb-1">
                    Verified from {groceryData.selectedRecipesCount} Recipes
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-base-content tracking-tight flex items-center gap-2">
                    <span>Shopping Checklist</span>
                    <span className="text-xs font-bold text-base-content/60">
                      ({groceryData.totalItemsCount} total items)
                    </span>
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleDownloadPDF}
                    className="btn btn-warning btn-sm rounded-xl font-bold gap-1.5 cursor-pointer text-slate-950 shadow-md shadow-warning/20 hover:scale-105 transition-transform"
                  >
                    <FaFilePdf className="text-red-700" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={handleCopyList}
                    className="btn btn-outline btn-sm rounded-xl font-bold gap-1.5 cursor-pointer"
                  >
                    {copied ? <FaCheck className="text-emerald-500" /> : <FaCopy />}
                    <span>{copied ? "Copied!" : "Copy List"}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="btn btn-ghost btn-sm rounded-xl font-bold gap-1.5 cursor-pointer"
                  >
                    <FaPrint /> Print
                  </button>
                </div>
              </div>

              {/* Price Estimate Card */}
              <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/15 p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg shadow-md shrink-0">
                    <FaCalculator />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-base-content/70 block">
                      Estimated Shopping Total
                    </span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {groceryData.estimatedCost} USD
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-base-content/60 hidden sm:block">
                  Verified & Aisle-Categorized ✨
                </span>
              </div>

              {/* Section 1: Organized Per-Recipe Ingredient Breakdown */}
              {Array.isArray(groceryData.recipeBreakdown) && groceryData.recipeBreakdown.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h3 className="font-black text-sm uppercase tracking-wider text-base-content/80 flex items-center gap-2 border-b border-base-300/60 pb-2">
                    <FaListCheck className="text-primary text-base" />
                    <span>Section 1: Per-Recipe Ingredient Breakdown ({groceryData.recipeBreakdown.length})</span>
                  </h3>

                  <div className="space-y-3">
                    {groceryData.recipeBreakdown.map((r, rIdx) => (
                      <div
                        key={rIdx}
                        className="p-4 rounded-2xl bg-base-200/50 dark:bg-base-800/40 border border-base-300/50 space-y-2"
                      >
                        <div className="flex items-center gap-3">
                          {r.image && (
                            <img
                              src={r.image}
                              alt={r.recipeName}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-bold text-xs text-base-content flex items-center justify-between">
                              <span>{r.recipeName}</span>
                              <span className="badge badge-neutral badge-xs font-bold">
                                {r.ingredients.length} items
                              </span>
                            </h4>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {r.ingredients.map((ing, iIdx) => (
                            <span
                              key={iIdx}
                              className="px-2 py-0.5 rounded-md bg-base-100 dark:bg-base-900 border border-base-300/40 text-[10px] font-medium text-base-content/80"
                            >
                              • {ing}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 2: Supermarket Aisle Checklist */}
              <div className="space-y-6 pt-2">
                <h3 className="font-black text-sm uppercase tracking-wider text-base-content/80 flex items-center gap-2 border-b border-base-300/60 pb-2">
                  <FaCartShopping className="text-emerald-500 text-base" />
                  <span>Section 2: Supermarket Aisle Checklist</span>
                </h3>

                {groceryData.categories.map((cat, cIdx) => (
                  <div key={cIdx} className="space-y-3">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-primary flex items-center gap-2 border-b border-base-300/50 pb-1.5">
                      <span>{cat.icon}</span>
                      <span>{cat.title} ({cat.items.length})</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {cat.items.map((item, iIdx) => {
                        const isChecked = checkedItems[item.name];
                        return (
                          <div
                            key={iIdx}
                            onClick={() => handleToggleCheckItem(item.name)}
                            className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                              isChecked
                                ? "bg-base-200/40 border-base-300/40 opacity-50 line-through"
                                : "bg-base-200/70 dark:bg-base-800/70 border-base-300/60 font-semibold"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <input
                                type="checkbox"
                                checked={Boolean(isChecked)}
                                onChange={() => {}}
                                className="checkbox checkbox-emerald checkbox-xs"
                              />
                              <span className="text-xs truncate">{item.name}</span>
                            </div>

                            {item.count > 1 && (
                              <span className="badge badge-neutral badge-xs font-bold shrink-0">
                                x{item.count}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
