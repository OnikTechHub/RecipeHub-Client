"use client";
import React, { useState, useEffect, use } from "react";
import {
  FaUtensils,
  FaLock,
  FaCreditCard,
  FaCircleCheck,
  FaLockOpen,
  FaShieldHalved,
  FaPrint,
  FaShareNodes,
} from "react-icons/fa6";
import { Toaster, toast } from "react-hot-toast";
import RecipeInfoCard from "@/components/RecipeInfoCard";
import ReportModal from "@/components/ReportModal";
import { authClient } from "@/lib/auth-client";
import { HashLoader } from "react-spinners";
import { useCart } from "@/context/CartContext";

const RecipeDetailsPage = ({ params }) => {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const { addToCart } = useCart();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessReason, setAccessReason] = useState("checking");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const currentUserEmail = session?.user?.email;
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  // Fetch recipe details from DB
  const fetchRecipeDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${SERVER_URL}/recipes/${id}`);
      const json = await response.json();
      if (json.success) {
        setRecipe(json.data);
        await checkAccess(json.data);
      } else {
        toast.error("Recipe not found!");
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
      toast.error("Failed to load recipe details!");
    } finally {
      setLoading(false);
    }
  };

  // Check access permissions
  const checkAccess = async (recipeObj) => {
    if (!recipeObj) return;

    const isPaidRecipe =
      recipeObj.recipeType === "Paid" ||
      recipeObj.isPaid === true ||
      Number(recipeObj.price || 0) > 0;

    // Free recipe
    if (!isPaidRecipe) {
      setHasAccess(true);
      setAccessReason("free");
      return;
    }

    // Author access
    if (
      currentUserEmail &&
      recipeObj.authorEmail &&
      recipeObj.authorEmail.toLowerCase() === currentUserEmail.toLowerCase()
    ) {
      setHasAccess(true);
      setAccessReason("author");
      return;
    }

    // Unauthenticated user
    if (!currentUserEmail) {
      setHasAccess(false);
      setAccessReason("unauthenticated");
      return;
    }

    // Query backend access endpoint
    try {
      const res = await fetch(
        `${SERVER_URL}/recipes/${id}/access?email=${encodeURIComponent(currentUserEmail)}`
      );
      const data = await res.json();
      if (data.success) {
        setHasAccess(data.hasAccess);
        setAccessReason(data.reason || (data.hasAccess ? "purchased" : "locked"));
      } else {
        setHasAccess(false);
        setAccessReason("locked");
      }
    } catch (err) {
      console.error("Access verification error:", err);
      setHasAccess(false);
      setAccessReason("locked");
    }
  };

  useEffect(() => {
    if (id) {
      fetchRecipeDetails();
    }
  }, [id, currentUserEmail]);

  // Stripe Payment Integration
  const handlePurchase = async () => {
    if (!currentUserEmail) {
      return toast.error("Please login first to unlock this premium recipe!");
    }
    if (!recipe) return toast.error("Recipe data not loaded yet!");

    const toastId = toast.loading("Redirecting to Stripe Checkout...");

    try {
      const res = await fetch(`${SERVER_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId: recipe._id,
          title: recipe.recipeName,
          image: recipe.recipeImage || recipe.image,
          price: recipe.price ? Number(recipe.price) : 5,
          userEmail: currentUserEmail,
          userId: session?.user?.id || session?.user?._id || "N/A",
        }),
      });

      const sessionData = await res.json();
      if (sessionData.success && sessionData.url) {
        toast.dismiss(toastId);
        window.location.href = sessionData.url;
      } else {
        toast.dismiss(toastId);
        toast.error(sessionData.message || "Stripe session creation failed!");
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Purchase error:", error);
      toast.error("Payment integration error!");
    }
  };

  // Like Button Integration (optimistic)
  const handleLike = async () => {
    if (!currentUserEmail) {
      return toast.error("Please login first to like this recipe!");
    }

    try {
      const res = await fetch(`${SERVER_URL}/recipes/${id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: currentUserEmail }),
      });
      const data = await res.json();

      if (data.success) {
        setRecipe((prev) => ({
          ...prev,
          likesCount: data.likesCount !== undefined ? data.likesCount : (prev.likesCount || 0) + (data.isLiked ? 1 : -1),
          likedUsers: data.isLiked
            ? [...(prev.likedUsers || []), currentUserEmail]
            : (prev.likedUsers || []).filter((e) => e !== currentUserEmail),
        }));

        if (data.isLiked) {
          toast.success("Recipe Liked!");
        } else {
          toast("Recipe Unliked");
        }
      } else {
        toast.error(data.message || "Could not toggle like.");
      }
    } catch (error) {
      console.error("Like error:", error);
      toast.error("Could not complete the action.");
    }
  };

  // Favorite Button Integration
  const handleAddToFavorite = async () => {
    if (!currentUserEmail) {
      return toast.error("Please login first to add to favorites!");
    }

    try {
      const res = await fetch(`${SERVER_URL}/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId: recipe._id,
          userEmail: currentUserEmail,
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Added to your Favorite Recipes!");
      } else {
        toast.error(data.message || "Already in favorites!");
      }
    } catch (error) {
      console.error("Favorite error:", error);
      toast.error("Failed to add to favorites.");
    }
  };

  const handleOpenReportModal = () => {
    if (!currentUserEmail) {
      return toast.error("Please login first to report this recipe!");
    }
    setIsReportModalOpen(true);
  };

  if (loading || isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 gap-4">
        <HashLoader color="#10b981" size={50} />
        <span className="text-sm text-base-content/60 font-medium tracking-wide">Loading recipe details...</span>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 text-base-content">
        <p className="font-bold opacity-60">Recipe not found.</p>
      </div>
    );
  }

  const isLiked = recipe.likedUsers?.includes(currentUserEmail);
  const isPaid = recipe.isPaid && Number(recipe.price || 0) > 0;
  const ingredientsList = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : typeof recipe.ingredients === "string"
    ? recipe.ingredients.split(",").map((i) => i.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-base-100 text-base-content py-12 px-4 md:px-8">
      <Toaster position="top-center" />

      <div className="max-w-5xl mx-auto space-y-10">
        <RecipeInfoCard
          recipe={recipe}
          hasAccess={hasAccess}
          accessReason={accessReason}
          isLiked={isLiked}
          onPurchase={handlePurchase}
          onAddToCart={() => addToCart(recipe)}
          onLike={handleLike}
          onFavorite={handleAddToFavorite}
          onOpenReport={handleOpenReportModal}
        />

        {/* Content Section: Ingredients & Instructions */}
        <div id="recipe-content" className="grid grid-cols-1 md:grid-cols-12 gap-8 scroll-mt-24">
          
          {/* Ingredients Column */}
          <div className="md:col-span-5 bg-base-200/40 p-6 rounded-3xl border border-base-300/40 h-fit space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-base-300/60 pb-3">
              <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                <FaUtensils className="text-primary text-sm" />
                <span>Ingredients</span>
              </h3>
              <span className="badge badge-sm badge-neutral font-bold">
                {ingredientsList.length} items
              </span>
            </div>

            {hasAccess ? (
              // Unlocked Full Ingredients
              <ul className="space-y-3 pt-1">
                {ingredientsList.map((ingredient, i) => (
                  <li key={i} className="text-sm font-semibold opacity-90 flex items-start gap-3">
                    <span className="text-primary mt-0.5">
                      <FaCircleCheck className="w-3.5 h-3.5" />
                    </span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            ) : (
              // Protected/Teaser Ingredients
              <div className="space-y-3 pt-1">
                {/* 2 Teaser items */}
                {ingredientsList.slice(0, 2).map((ingredient, i) => (
                  <li key={i} className="text-sm font-semibold opacity-90 flex items-start gap-3 list-none">
                    <span className="text-primary mt-0.5">
                      <FaCircleCheck className="w-3.5 h-3.5" />
                    </span>
                    <span>{ingredient}</span>
                  </li>
                ))}

                {/* Blurred locked items */}
                <div className="relative pt-2">
                  <div className="filter blur-xs opacity-40 select-none space-y-2.5 pointer-events-none">
                    <li className="text-sm font-semibold flex items-center gap-3 list-none">
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                      <span>Secret aromatic spice blend & proportions</span>
                    </li>
                    <li className="text-sm font-semibold flex items-center gap-3 list-none">
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                      <span>Signature marinade & cooking glaze</span>
                    </li>
                    <li className="text-sm font-semibold flex items-center gap-3 list-none">
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                      <span>Chef's finishing touch & seasoning ratio</span>
                    </li>
                  </div>

                  <div className="mt-4 p-3 bg-amber-500/10 rounded-2xl border border-amber-500/25 text-center">
                    <p className="text-xs font-bold text-amber-600 flex items-center justify-center gap-1.5">
                      <FaLock className="text-[10px]" />
                      <span>{Math.max(0, ingredientsList.length - 2)} more secret ingredients locked</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instructions Column */}
          <div className="md:col-span-7">
            {hasAccess ? (
              // Unlocked Full Instructions
              <div className="bg-base-200/30 p-8 rounded-3xl border border-base-300/40 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-base-300/60 pb-4">
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-base-content">
                      Cooking Instructions
                    </h3>
                    <p className="text-xs text-base-content/60 mt-0.5">
                      Follow these step-by-step culinary directions carefully.
                    </p>
                  </div>

                  {accessReason === "purchased" && (
                    <span className="badge badge-success gap-1.5 font-bold text-xs py-3 px-3.5 shadow-xs">
                      <FaLockOpen className="text-[10px]" /> Lifetime Unlocked
                    </span>
                  )}
                  {accessReason === "author" && (
                    <span className="badge badge-primary gap-1.5 font-bold text-xs py-3 px-3.5 shadow-xs">
                      <FaShieldHalved className="text-[10px]" /> Your Creation
                    </span>
                  )}
                </div>

                <div className="text-sm font-medium opacity-85 leading-relaxed whitespace-pre-line space-y-4">
                  {recipe.instructions || "No instructions provided."}
                </div>

                {/* Helpful Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-base-300/40">
                  <button
                    onClick={() => window.print()}
                    className="btn btn-sm btn-ghost rounded-xl font-bold text-xs gap-2"
                  >
                    <FaPrint /> Print Recipe
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      toast.success("Recipe link copied!");
                    }}
                    className="btn btn-sm btn-ghost rounded-xl font-bold text-xs gap-2"
                  >
                    <FaShareNodes /> Share Recipe
                  </button>
                </div>
              </div>
            ) : (
              // Locked Premium Card
              <div className="bg-gradient-to-br from-base-200/90 via-base-200/50 to-base-300/30 p-8 md:p-10 rounded-3xl border border-amber-500/30 shadow-xl backdrop-blur-md text-center flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center text-2xl shadow-inner">
                  <FaLock />
                </div>

                <div className="space-y-2 max-w-md">
                  <span className="badge badge-warning font-black text-[11px] uppercase tracking-wider px-3 py-2">
                    Premium Secret Recipe
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight text-base-content">
                    Unlock Full Cooking Instructions
                  </h3>
                  <p className="text-xs text-base-content/70 leading-relaxed font-medium">
                    This recipe is a protected premium creation. Unlock complete secret ingredients, exact cooking times, temperatures, and step-by-step master techniques.
                  </p>
                </div>

                {/* Revenue Sharing & Benefits Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full max-w-lg text-left">
                  <div className="bg-base-100/80 p-3 rounded-2xl border border-base-300/60 shadow-xs">
                    <span className="text-[10px] font-black uppercase text-emerald-600 block">80% to Creator</span>
                    <span className="text-xs font-bold text-base-content block">Support the Chef</span>
                  </div>
                  <div className="bg-base-100/80 p-3 rounded-2xl border border-base-300/60 shadow-xs">
                    <span className="text-[10px] font-black uppercase text-primary block">Lifetime Access</span>
                    <span className="text-xs font-bold text-base-content block">Always in Library</span>
                  </div>
                  <div className="bg-base-100/80 p-3 rounded-2xl border border-base-300/60 shadow-xs">
                    <span className="text-[10px] font-black uppercase text-amber-500 block">Instant Unlock</span>
                    <span className="text-xs font-bold text-base-content block">Stripe Secure Pay</span>
                  </div>
                </div>

                <button
                  onClick={handlePurchase}
                  className="btn btn-primary btn-lg rounded-2xl font-black text-white px-8 normal-case shadow-xl shadow-primary/30 hover:scale-105 transition-transform gap-3"
                >
                  <FaCreditCard className="text-base" />
                  <span>Unlock Recipe Now for ${Number(recipe.price || 5).toFixed(2)}</span>
                </button>

                <p className="text-[11px] text-base-content/50">
                  Secured by Stripe with 256-bit encryption. Unlocked recipes are permanently accessible.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        recipeId={recipe._id}
        currentUserEmail={currentUserEmail}
        serverUrl={SERVER_URL}
      />
    </div>
  );
};

export default RecipeDetailsPage;