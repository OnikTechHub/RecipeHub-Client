"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  FaWandSparkles,
  FaUtensils,
  FaCrown,
  FaLock,
  FaClock,
  FaFire,
  FaUsers,
  FaCopy,
  FaCheck,
  FaPlus,
  FaTrash,
  FaLightbulb,
  FaLeaf,
  FaArrowRight,
  FaBowlRice,
  FaBookmark,
  FaDollarSign,
  FaTag,
  FaXmark,
} from "react-icons/fa6";
import { HashLoader } from "react-spinners";

const QUICK_INGREDIENTS = [
  "Chicken breast", "Sweet potato", "Spinach", "Avocado",
  "Garlic", "Salmon", "Eggs", "Quinoa", "Mushrooms",
  "Heavy cream", "Parmesan", "Tofu", "Bell pepper", "Olive oil"
];

const MEAL_TYPES = [
  { id: "Breakfast", label: "Breakfast 🍳" },
  { id: "Lunch", label: "Lunch 🥗" },
  { id: "Dinner", label: "Dinner 🍝" },
  { id: "Snack", label: "Snack 🥪" },
  { id: "Desserts", label: "Desserts 🍰" },
];

const DIETARY_OPTIONS = [
  { id: "None", label: "All Diets ✨" },
  { id: "High-Protein", label: "High-Protein ⚡" },
  { id: "Keto / Low-Carb", label: "Keto / Low-Carb 🥩" },
  { id: "Vegan / Vegetarian", label: "Vegan / Veggie 🌿" },
  { id: "Gluten-Free", label: "Gluten-Free 🌾" },
];

export default function AIRecipeGenerator() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const router = useRouter();

  // Role & Premium State from Live DB Sync
  const [liveUserRole, setLiveUserRole] = useState(null);
  const [liveIsPremium, setLiveIsPremium] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  // Form Input States
  const [ingredients, setIngredients] = useState(["Chicken breast", "Spinach"]);
  const [customIng, setCustomIng] = useState("");
  const [mealType, setMealType] = useState("Dinner");
  const [dietaryPreference, setDietaryPreference] = useState("None");
  const [servings, setServings] = useState(2);

  // Monetization & Saving States
  const [isPaidSave, setIsPaidSave] = useState(false);
  const [recipePriceSave, setRecipePriceSave] = useState(4.99);
  const [dynamicPrice, setDynamicPrice] = useState("$14.99");
  const [dynamicPeriod, setDynamicPeriod] = useState("Lifetime Access");

  // Weekly Usage Limit & Modal States
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [usageInfo, setUsageInfo] = useState({
    count: 0,
    limit: 2,
    remaining: 2,
    resetAt: null,
    isAdmin: false,
  });
  const [timeLeftStr, setTimeLeftStr] = useState("");

  // Output States
  const [generating, setGenerating] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  // Fetch Dynamic Pricing Plan from Server
  useEffect(() => {
    fetch(`${SERVER_URL}/pricing-plans`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.plans) {
          const fetchedPrice = data.plans.proFoodie?.price || data.plans.masterChef?.price || "$14.99";
          const fetchedPeriod = data.plans.proFoodie?.period || "Lifetime Access";
          setDynamicPrice(fetchedPrice);
          setDynamicPeriod(fetchedPeriod);
        }
      })
      .catch((err) => console.error("Error fetching dynamic pricing in AI generator:", err));
  }, [SERVER_URL]);

  useEffect(() => {
    if (session?.user?.email) {
      setCheckingRole(true);
      fetch(`${SERVER_URL}/check-user-role?email=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setLiveUserRole(data.data.role);
            setLiveIsPremium(data.data.isPremium || false);
          }
        })
        .catch((err) => console.error("Error fetching live user status:", err))
        .finally(() => setCheckingRole(false));
    } else if (!sessionPending) {
      setCheckingRole(false);
    }
  }, [session, sessionPending, SERVER_URL]);

  const currentUser = session?.user;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ? process.env.NEXT_PUBLIC_ADMIN_EMAIL.toLowerCase().trim()
    : "admin@recipehub.com";
  const userEmailLower = currentUser?.email ? currentUser.email.toLowerCase().trim() : "";

  const isAdmin =
    Boolean(currentUser?.email) &&
    (liveUserRole === "admin" ||
      currentUser?.role === "admin" ||
      userEmailLower === "admin@recipehub.com" ||
      userEmailLower === adminEmail);

  const isPremium = liveIsPremium || currentUser?.isPremium === true || isAdmin;

  // Fetch AI Weekly Usage Status on load
  useEffect(() => {
    if (currentUser?.email && isPremium) {
      fetch(`${SERVER_URL}/api/ai/usage?email=${encodeURIComponent(currentUser.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUsageInfo({
              count: data.usageCount || 0,
              limit: data.weeklyLimit || 2,
              remaining: data.remaining !== undefined ? data.remaining : 2,
              resetAt: data.resetAt ? new Date(data.resetAt) : null,
              isAdmin: data.isAdmin || false,
            });
            setShowQuotaModal(true);
          }
        })
        .catch((err) => console.error("Error fetching AI usage info:", err));
    }
  }, [currentUser, isPremium, SERVER_URL]);

  // Live Ticking Real-Time Countdown Timer until Quota Reset
  useEffect(() => {
    if (!usageInfo.resetAt || usageInfo.isAdmin) {
      setTimeLeftStr("");
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const resetTime = new Date(usageInfo.resetAt).getTime();
      const diff = resetTime - now;

      if (diff <= 0) {
        setTimeLeftStr("Quota Ready to Reset!");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeftStr(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeftStr(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [usageInfo.resetAt, usageInfo.isAdmin]);

  const handleAddIngredient = (ingToAdd) => {
    const val = (ingToAdd || customIng).trim();
    if (!val) return;
    if (ingredients.some((i) => i.toLowerCase() === val.toLowerCase())) {
      toast.error(`"${val}" is already in your ingredient list!`);
      return;
    }
    setIngredients([...ingredients, val]);
    setCustomIng("");
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, idx) => idx !== index));
  };

  const handleGenerateRecipe = async () => {
    if (!ingredients || ingredients.length === 0) {
      toast.error("Please add at least one ingredient to generate a recipe!");
      return;
    }

    if (!isAdmin && usageInfo.remaining <= 0) {
      toast.error("Weekly AI generation limit reached (2/2). Quota will reset next week!");
      setShowQuotaModal(true);
      return;
    }

    setGenerating(true);
    setRecipe(null);
    setSaved(false);

    try {
      const res = await fetch(`${SERVER_URL}/api/ai/generate-recipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: currentUser?.email,
          ingredients,
          dietaryPreference,
          mealType,
          servings: Number(servings) || 2,
        }),
      });

      const data = await res.json();

      if (res.status === 403 || data.isPremiumRequired) {
        toast.error("Exclusive Premium feature. Please upgrade to RecipeHub Premium!");
        return;
      }

      if (data.limitReached) {
        toast.error(data.message || "Weekly limit reached (2/2)!");
        setUsageInfo((prev) => ({ ...prev, count: 2, remaining: 0 }));
        setShowQuotaModal(true);
        return;
      }

      if (data.success && data.recipe) {
        setRecipe(data.recipe);
        if (data.usageCount !== undefined) {
          setUsageInfo((prev) => ({
            ...prev,
            count: data.usageCount,
            remaining: data.remaining !== undefined ? data.remaining : Math.max(0, 2 - data.usageCount),
          }));
        }
        toast.success("✨ Gourmet AI Recipe generated successfully!", {
          style: { borderRadius: "14px", background: "#10b981", color: "#fff" },
        });
      } else {
        toast.error(data.message || "Failed to generate AI recipe. Please try again!");
      }
    } catch (err) {
      console.error("AI Recipe Gen Client Error:", err);
      toast.error("Network error while connecting to Chef AI engine.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyRecipe = () => {
    if (!recipe) return;
    const text = `🍳 ${recipe.title}\n\n${recipe.description}\n\nPrep Time: ${recipe.prepTime} | Cook Time: ${recipe.cookTime} | Servings: ${recipe.servings}\n\n🛒 INGREDIENTS:\n${recipe.ingredients.map((i) => `• ${i}`).join("\n")}\n\n👩‍🍳 INSTRUCTIONS:\n${recipe.instructions.map((ins, i) => `${i + 1}. ${ins}`).join("\n")}\n\n💡 CHEF TIP: ${recipe.chefTips}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Recipe copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveToMyRecipes = async () => {
    if (!recipe || !currentUser?.email) {
      toast.error("Please log in to save recipes to your collection!");
      return;
    }

    setSaving(true);
    try {
      const stdCategory = mealType === "Dessert" || mealType === "Desserts" ? "Desserts" : mealType;
      const priceVal = isPaidSave ? Math.max(0.99, Number(recipePriceSave) || 4.99) : 0;

      const payload = {
        recipeName: recipe.title,
        title: recipe.title,
        description: recipe.description,
        authorEmail: currentUser.email,
        userEmail: currentUser.email,
        category: [stdCategory],
        cuisine: mealType,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        recipeImage: recipe.image || recipe.recipeImage,
        image: recipe.image || recipe.recipeImage,
        price: priceVal,
        isPaid: isPaidSave,
        recipeType: isPaidSave ? "Paid" : "Free",
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        chefTips: recipe.chefTips,
        nutritionInfo: recipe.nutritionInfo,
        isAiGenerated: true,
      };

      const res = await fetch(`${SERVER_URL}/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && (data.success || data.insertedId)) {
        setSaved(true);
        toast.success(
          `🎉 Recipe saved as ${isPaidSave ? `$${priceVal} Premium` : "Free"}! Redirecting to My Recipes...`,
          { style: { borderRadius: "14px", background: "#10b981", color: "#fff" } }
        );
        setTimeout(() => {
          router.push("/dashboard/my-recipes");
        }, 1200);
      } else {
        toast.error(
          data.message || "A recipe with this title already exists or failed to save!",
          { style: { borderRadius: "14px", background: "#ef4444", color: "#fff" } }
        );
      }
    } catch (err) {
      console.error("Save Recipe Error:", err);
      toast.error("Failed to save recipe to database.");
    } finally {
      setSaving(false);
    }
  };

  if (sessionPending || checkingRole) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <HashLoader color="#10b981" size={45} />
        <p className="text-xs font-semibold text-base-content/60">Loading AI Smart Recipe Generator...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-accent to-secondary p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-amber-200 shadow-xs border border-white/20">
              <FaWandSparkles className="text-amber-300" /> Powered by Gemini AI
            </span>
            {isPremium && (
              <button
                onClick={() => setShowQuotaModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 hover:bg-black/40 backdrop-blur-md text-xs font-bold text-white shadow-xs border border-white/20 transition-all cursor-pointer"
              >
                <span>Weekly Quota:</span>
                <span className="font-black text-amber-300">
                  {usageInfo.isAdmin ? "Unlimited" : `${usageInfo.count}/2`}
                </span>
              </button>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
            AI Smart Recipe Generator
          </h1>
          <p className="text-xs sm:text-sm font-medium opacity-90 leading-relaxed">
            Turn your available pantry ingredients into chef-crafted gourmet meals in seconds with real-time AI precision!
          </p>
        </div>

        {/* Decorative Floating Sparkles */}
        <div className="absolute top-4 right-6 text-white/10 text-9xl pointer-events-none hidden md:block">
          <FaWandSparkles />
        </div>
      </div>

      {/* Paywall Gate for Free Users */}
      {!isPremium ? (
        <div className="bg-base-100 dark:bg-base-900 border-2 border-amber-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto text-2xl shadow-lg border border-amber-300/40">
            <FaCrown />
          </div>

          <div className="max-w-lg mx-auto space-y-2">
            <h2 className="text-2xl font-black tracking-tight flex items-center justify-center gap-2 text-base-content">
              <span>Premium Membership Required</span>
              <FaLock className="text-amber-500 text-lg" />
            </h2>
            <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed font-medium">
              The <strong>AI Smart Recipe Generator</strong> is an exclusive feature for RecipeHub Premium members. Upgrade today to unlock 2 custom AI recipes per week, secret chef dishes, and ad-free cooking!
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="btn btn-warning btn-md rounded-2xl font-extrabold px-8 gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer text-slate-950"
            >
              <FaCrown className="text-sm" /> Upgrade to Premium ({dynamicPrice} - {dynamicPeriod})
            </Link>
            <Link
              href="/browse-recipes"
              className="btn btn-ghost btn-md rounded-2xl font-bold text-xs hover:bg-base-200"
            >
              Browse Free Community Recipes <FaArrowRight />
            </Link>
          </div>
        </div>
      ) : (
        /* Main Generator Tool Interface for Premium Users */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form Controls */}
          <div className="lg:col-span-5 bg-base-100 dark:bg-base-900 p-6 rounded-3xl border border-base-300 dark:border-base-700 shadow-xl space-y-6">
            <div className="pb-3 border-b border-base-300 dark:border-base-700 flex items-center justify-between">
              <h3 className="font-extrabold text-base tracking-tight flex items-center gap-2">
                <FaUtensils className="text-primary" /> Recipe Parameters
              </h3>
              <div className="flex items-center gap-2">
                <span className="badge badge-warning badge-sm font-black text-[10px]">PRO</span>
                <span className="text-[10px] font-bold opacity-60">
                  {usageInfo.isAdmin ? "Unlimited" : `${usageInfo.remaining}/2 Left`}
                </span>
              </div>
            </div>

            {/* Ingredients Selection */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-base-content/70 block">
                1. Available Ingredients ({ingredients.length})
              </label>

              {/* Added Badges */}
              <div className="flex flex-wrap gap-2 min-h-[42px] p-2.5 bg-base-200/60 dark:bg-base-800/60 rounded-2xl border border-base-300/50 dark:border-base-700/50">
                {ingredients.length === 0 ? (
                  <span className="text-xs text-base-content/50 italic py-1">No ingredients added yet...</span>
                ) : (
                  ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/15 text-primary dark:bg-primary/25 font-bold text-xs shadow-xs border border-primary/20"
                    >
                      <span>{ing}</span>
                      <button
                        onClick={() => handleRemoveIngredient(idx)}
                        className="hover:text-error transition-colors text-[10px] cursor-pointer"
                        title="Remove ingredient"
                      >
                        <FaTrash />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Add Custom Ingredient Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddIngredient();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={customIng}
                  onChange={(e) => setCustomIng(e.target.value)}
                  placeholder="Type an ingredient (e.g., Avocado)..."
                  className="flex-1 bg-base-200 dark:bg-base-800 px-3.5 py-2 rounded-xl text-xs font-medium border border-base-300 dark:border-base-700 outline-none focus:border-primary transition-all"
                />
                <button
                  type="submit"
                  disabled={!customIng.trim()}
                  className="btn btn-primary btn-sm rounded-xl text-xs gap-1 font-bold cursor-pointer disabled:opacity-40"
                >
                  <FaPlus /> Add
                </button>
              </form>

              {/* Quick Add Chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold opacity-60 flex items-center gap-1">
                  <FaLightbulb className="text-amber-500" /> Quick Add Suggestions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_INGREDIENTS.map((qIng, qIdx) => (
                    <button
                      key={qIdx}
                      type="button"
                      onClick={() => handleAddIngredient(qIng)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-base-200 hover:bg-primary hover:text-white transition-all font-medium cursor-pointer"
                    >
                      + {qIng}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Meal Category Selection */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-base-content/70 block">
                2. Meal Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MEAL_TYPES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMealType(m.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer ${
                      mealType === m.id
                        ? "bg-primary text-white border-primary shadow-md scale-[1.02]"
                        : "bg-base-200/80 dark:bg-base-800/80 border-base-300 dark:border-base-700 hover:bg-base-300"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Preference Selection */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-base-content/70 block">
                3. Dietary Preference
              </label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDietaryPreference(d.id)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      dietaryPreference === d.id
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-sm"
                        : "bg-base-200/80 dark:bg-base-800/80 border-base-300 dark:border-base-700 hover:bg-base-300"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Servings Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-extrabold uppercase tracking-wider text-base-content/70">
                <label>4. Target Servings</label>
                <span className="text-primary font-black text-sm">{servings} Servings</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="range range-primary range-xs"
              />
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerateRecipe}
              disabled={generating || ingredients.length === 0 || (!isAdmin && usageInfo.remaining <= 0)}
              className="btn btn-primary btn-md w-full rounded-2xl font-black text-sm gap-2 shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer bg-gradient-to-r from-primary via-accent to-secondary border-none text-white disabled:opacity-40"
            >
              {generating ? (
                <>
                  <HashLoader color="#ffffff" size={20} />
                  <span>Chef AI is Crafting Your Recipe...</span>
                </>
              ) : !isAdmin && usageInfo.remaining <= 0 ? (
                <>
                  <FaLock className="text-amber-300" />
                  <span>Weekly Limit Reached (2/2)</span>
                </>
              ) : (
                <>
                  <FaWandSparkles className="text-amber-300" />
                  <span>Generate Gourmet AI Recipe</span>
                </>
              )}
            </button>
          </div>

          {/* Right Recipe Output Display */}
          <div className="lg:col-span-7 space-y-6">
            {!recipe && !generating && (
              <div className="bg-base-100 dark:bg-base-900 rounded-3xl border border-dashed border-base-300 dark:border-base-700 p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[480px]">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center text-3xl shadow-inner border border-primary/20 animate-bounce">
                  <FaWandSparkles />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="font-black text-xl text-base-content">Ready for AI Culinary Magic?</h3>
                  <p className="text-xs text-base-content/70 leading-relaxed font-medium">
                    Add your ingredients on the left panel and click <strong>Generate Gourmet AI Recipe</strong>. Chef RecipeHub AI will create step-by-step instructions, ratios & nutrition facts instantly!
                  </p>
                </div>
              </div>
            )}

            {generating && (
              <div className="bg-base-100 dark:bg-base-900 rounded-3xl border border-base-300 dark:border-base-700 p-12 text-center flex flex-col items-center justify-center gap-5 min-h-[480px]">
                <HashLoader color="#10b981" size={60} />
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-primary animate-pulse">
                    Chef AI is Harmonizing Flavors...
                  </h3>
                  <p className="text-xs text-base-content/60 font-medium">
                    Analyzing ingredients, calculating ratios, and optimizing cook times...
                  </p>
                </div>
              </div>
            )}

            {recipe && !generating && (
              <div className="bg-base-100 dark:bg-base-900 rounded-3xl border border-base-300 dark:border-base-700 overflow-hidden shadow-2xl relative animate-fade-in space-y-6">
                {/* Hero Food Image Banner */}
                {recipe.image && (
                  <div className="relative w-full h-56 sm:h-64 overflow-hidden group">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                      <div className="flex flex-wrap gap-2 mb-1.5">
                        {recipe.dietaryTags?.map((tag, tIdx) => (
                          <span key={tIdx} className="badge badge-warning badge-sm font-black text-[10px] shadow-sm">
                            {tag}
                          </span>
                        ))}
                        <span className="badge badge-neutral badge-sm font-bold text-[10px] text-white border-white/30">
                          {recipe.difficulty} Difficulty
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
                        {recipe.title}
                      </h2>
                    </div>
                  </div>
                )}

                <div className="p-6 md:p-8 space-y-6 pt-0">
                  {/* Action Bar & Description */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-base-300 dark:border-base-700">
                    <p className="text-xs sm:text-sm text-base-content/80 font-medium leading-relaxed max-w-xl">
                      {recipe.description}
                    </p>

                    <button
                      onClick={handleCopyRecipe}
                      className="btn btn-outline btn-sm rounded-xl font-bold gap-2 shrink-0 cursor-pointer hover:bg-primary hover:border-primary"
                    >
                      {copied ? <FaCheck className="text-emerald-500" /> : <FaCopy />}
                      <span>{copied ? "Copied!" : "Copy Recipe"}</span>
                    </button>
                  </div>

                  {/* Monetization Options Sync (Free vs Paid Price) */}
                  <div className="bg-base-200/60 dark:bg-base-800/60 p-4 rounded-2xl border border-base-300/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                        <FaTag className="text-primary" /> Publish Monetization Options
                      </span>
                      <span className="text-[10px] font-bold opacity-60">Sync to Browse Recipes</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPaidSave(false)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer ${
                          !isPaidSave
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black shadow-xs"
                            : "border-base-300 hover:bg-base-300/50 opacity-80"
                        }`}
                      >
                        <input type="radio" checked={!isPaidSave} readOnly className="radio radio-emerald radio-xs" />
                        <div>
                          <span className="block font-bold">Free Recipe</span>
                          <span className="block text-[10px] opacity-70">Public & free to view</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsPaidSave(true)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer ${
                          isPaidSave
                            ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black shadow-xs"
                            : "border-base-300 hover:bg-base-300/50 opacity-80"
                        }`}
                      >
                        <input type="radio" checked={isPaidSave} readOnly className="radio radio-warning radio-xs" />
                        <div>
                          <span className="block font-bold">Paid (Premium)</span>
                          <span className="block text-[10px] opacity-70">Monetize & sell access</span>
                        </div>
                      </button>
                    </div>

                    {isPaidSave && (
                      <div className="pt-2 flex items-center gap-3 animate-fade-in">
                        <label className="text-xs font-bold shrink-0 flex items-center gap-1">
                          <FaDollarSign className="text-amber-500" /> Set Price (USD $):
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.99"
                          max="99.99"
                          value={recipePriceSave}
                          onChange={(e) => setRecipePriceSave(e.target.value)}
                          className="input input-bordered input-sm w-32 font-bold text-xs"
                          placeholder="4.99"
                        />
                      </div>
                    )}

                    <button
                      onClick={handleSaveToMyRecipes}
                      disabled={saving || saved}
                      className="btn btn-primary btn-md w-full rounded-2xl font-black text-xs gap-2 cursor-pointer shadow-lg bg-gradient-to-r from-primary via-accent to-secondary text-white border-none disabled:opacity-80 mt-2"
                    >
                      {saving ? (
                        <>
                          <HashLoader color="#ffffff" size={16} />
                          <span>Saving Recipe to Database...</span>
                        </>
                      ) : saved ? (
                        <>
                          <FaCheck className="text-emerald-300 text-sm" />
                          <span>Saved to My Recipes!</span>
                        </>
                      ) : (
                        <>
                          <FaBookmark className="text-amber-200 text-sm" />
                          <span>Save & Publish to My Recipes ({isPaidSave ? `$${recipePriceSave} Paid` : "Free"})</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Key Recipe Metadata */}
                  <div className="grid grid-cols-3 gap-3 p-4 bg-base-200/70 dark:bg-base-800/70 rounded-2xl text-center border border-base-300/40">
                    <div>
                      <span className="text-[10px] font-bold uppercase opacity-60 block flex items-center justify-center gap-1">
                        <FaClock className="text-primary" /> Prep Time
                      </span>
                      <span className="text-sm font-black text-base-content">{recipe.prepTime}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase opacity-60 block flex items-center justify-center gap-1">
                        <FaFire className="text-amber-500" /> Cook Time
                      </span>
                      <span className="text-sm font-black text-base-content">{recipe.cookTime}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase opacity-60 block flex items-center justify-center gap-1">
                        <FaUsers className="text-accent" /> Servings
                      </span>
                      <span className="text-sm font-black text-base-content">{recipe.servings} People</span>
                    </div>
                  </div>

                  {/* Ingredients Checklist */}
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider text-primary flex items-center gap-2">
                      <FaBowlRice /> Ingredients List
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {recipe.ingredients?.map((ing, iIdx) => (
                        <div
                          key={iIdx}
                          className="p-3 bg-base-200/50 dark:bg-base-800/50 rounded-xl border border-base-300/40 text-xs font-semibold text-base-content flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                          <span>{ing}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step by Step Instructions */}
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider text-primary flex items-center gap-2">
                      <FaUtensils /> Step-by-Step Instructions
                    </h3>
                    <div className="space-y-3">
                      {recipe.instructions?.map((ins, stepIdx) => (
                        <div
                          key={stepIdx}
                          className="p-4 bg-base-200/40 dark:bg-base-800/40 rounded-2xl border border-base-300/50 dark:border-base-700/50 flex gap-3 text-xs sm:text-sm font-medium leading-relaxed"
                        >
                          <span className="w-7 h-7 rounded-xl bg-primary text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs">
                            {stepIdx + 1}
                          </span>
                          <div className="space-y-1">
                            <p>{ins}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chef Pro Tip */}
                  {recipe.chefTips && (
                    <div className="p-4 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-base-content">
                      <FaLightbulb className="text-amber-500 text-lg shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-extrabold text-amber-600 dark:text-amber-400">Chef RecipeHub Secret Tip</h4>
                        <p className="font-medium opacity-90">{recipe.chefTips}</p>
                      </div>
                    </div>
                  )}

                  {/* Estimated Nutrition Info */}
                  {recipe.nutritionInfo && (
                    <div className="pt-2 border-t border-base-300 dark:border-base-700">
                      <h4 className="text-[11px] font-bold uppercase opacity-60 tracking-wider mb-2">
                        Estimated Nutrition (Per Serving)
                      </h4>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                        <div className="p-2 bg-base-200 dark:bg-base-800 rounded-xl">
                          <span className="block text-[10px] opacity-60">Calories</span>
                          <span className="text-primary">{recipe.nutritionInfo.calories}</span>
                        </div>
                        <div className="p-2 bg-base-200 dark:bg-base-800 rounded-xl">
                          <span className="block text-[10px] opacity-60">Protein</span>
                          <span className="text-accent">{recipe.nutritionInfo.protein}</span>
                        </div>
                        <div className="p-2 bg-base-200 dark:bg-base-800 rounded-xl">
                          <span className="block text-[10px] opacity-60">Carbs</span>
                          <span className="text-secondary">{recipe.nutritionInfo.carbs}</span>
                        </div>
                        <div className="p-2 bg-base-200 dark:bg-base-800 rounded-xl">
                          <span className="block text-[10px] opacity-60">Fats</span>
                          <span className="text-amber-500">{recipe.nutritionInfo.fats}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Premium Weekly Usage Limit Modal */}
      {showQuotaModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-base-100 dark:bg-base-900 border border-base-300 dark:border-base-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center relative overflow-hidden">
            {/* Modal Close / Back Icon Button */}
            <button
              type="button"
              onClick={() => {
                setShowQuotaModal(false);
                router.push("/dashboard");
              }}
              className="absolute top-4 right-4 text-base-content/50 hover:text-base-content hover:bg-base-200 dark:hover:bg-base-800 p-2 rounded-full transition-all cursor-pointer z-10"
              title="Close & Return to Dashboard"
              aria-label="Close modal and return to dashboard"
            >
              <FaXmark className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-2xl mx-auto shadow-md border border-amber-300/40">
              <FaWandSparkles />
            </div>

            <div className="space-y-2">
              <span className="badge badge-warning badge-sm font-black uppercase text-[9px] tracking-wider">
                Weekly Usage Policy
              </span>
              <h3 className="text-xl font-black text-base-content tracking-tight">
                Premium AI Generator Quota
              </h3>
              <p className="text-xs text-base-content/70 leading-relaxed font-medium">
                As a Premium member, your account includes <strong>2 custom AI recipe generations per week</strong> (7 days).
              </p>
            </div>

            {/* Quota Progress Bar */}
            <div className="bg-base-200/80 dark:bg-base-800/80 p-4 rounded-2xl border border-base-300/50 space-y-2 text-left">
              <div className="flex justify-between items-center text-xs font-extrabold text-base-content">
                <span>Generations Used:</span>
                <span className={usageInfo.remaining > 0 || usageInfo.isAdmin ? "text-emerald-500 font-black" : "text-error font-black"}>
                  {usageInfo.isAdmin ? "Unlimited (Admin)" : `${usageInfo.count} / ${usageInfo.limit}`}
                </span>
              </div>

              {!usageInfo.isAdmin && (
                <div className="w-full bg-base-300 dark:bg-base-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      usageInfo.count >= 2 ? "bg-error" : "bg-gradient-to-r from-primary to-accent"
                    }`}
                    style={{ width: `${Math.min(100, (usageInfo.count / 2) * 100)}%` }}
                  ></div>
                </div>
              )}

              {usageInfo.resetAt && !usageInfo.isAdmin && (
                <div className="pt-1.5 space-y-1">
                  <p className="text-[10px] text-base-content/60 font-semibold">
                    ⏱️ Quota resets on: <strong>{new Date(usageInfo.resetAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</strong>
                  </p>
                  {timeLeftStr && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-[11px] border border-amber-500/20">
                      <FaClock className="w-3 h-3 animate-pulse" />
                      <span>Live Reset Countdown: {timeLeftStr}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Let's Cook Button: Locked when Quota Exhausted */}
            <button
              disabled={usageInfo.remaining <= 0 && !usageInfo.isAdmin}
              onClick={() => setShowQuotaModal(false)}
              className={`btn btn-md w-full rounded-2xl font-black text-xs shadow-lg transition-all border-none ${
                usageInfo.remaining <= 0 && !usageInfo.isAdmin
                  ? "bg-base-300 dark:bg-base-800 text-base-content/40 cursor-not-allowed opacity-60 shadow-none pointer-events-none"
                  : "bg-gradient-to-r from-primary via-accent to-secondary text-white cursor-pointer hover:opacity-95"
              }`}
            >
              {usageInfo.remaining > 0 || usageInfo.isAdmin
                ? "Got It, Let's Cook! 🍳"
                : "Quota Exhausted (Locked) 🔒"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
