"use client";
import React, { useState, useEffect } from "react";
import {
  FaMagnifyingGlass,
  FaSliders,
  FaClock,
  FaStar,
  FaCrown,
  FaLockOpen,
  FaCartPlus,
  FaUtensils,
  FaRotateLeft,
  FaFilter,
  FaTag
} from "react-icons/fa6";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import { HashLoader } from "react-spinners";
import { useCart } from "@/context/CartContext";
import { authClient } from "@/lib/auth-client";

const BrowseRecipesContent = () => {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const { isPurchased, addToCart, isAdmin } = useCart();
  const { data: session } = authClient.useSession();
  const currentUserEmail = session?.user?.email;

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAccessFilter, setSelectedAccessFilter] = useState("All"); // "All", "Free", "Paid", "Purchased"

  // Sync category from URL query parameter on initial render or when query changes
  useEffect(() => {
    if (categoryFromUrl && ["Breakfast", "Lunch", "Dinner", "Desserts"].includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const limit = 6;

  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Desserts"];

  const accessFilters = [
    { label: "All Recipes", value: "All", icon: FaUtensils, color: "text-primary" },
    { label: "Free Recipes", value: "Free", icon: FaTag, color: "text-emerald-500" },
    { label: "Premium / Paid", value: "Paid", icon: FaCrown, color: "text-amber-500" },
    { label: "Purchased / Unlocked", value: "Purchased", icon: FaLockOpen, color: "text-teal-500" },
  ];

  // Reset to page 1 whenever search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedAccessFilter]);

  useEffect(() => {
    const fetchLiveRecipes = async () => {
      try {
        setLoading(true);
        const categoryParam = selectedCategory === "All" ? "" : selectedCategory;
        const filterParam = selectedAccessFilter.toLowerCase();
        const emailParam = currentUserEmail || "";

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/recipes?search=${encodeURIComponent(
            searchQuery
          )}&category=${encodeURIComponent(
            categoryParam
          )}&filter=${filterParam}&email=${encodeURIComponent(
            emailParam
          )}&page=${currentPage}&limit=${limit}`
        );
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          // Client-side deduplication by _id to guarantee no duplicate cards
          const uniqueMap = new Map();
          json.data.forEach((item) => {
            if (item && item._id) {
              uniqueMap.set(item._id.toString(), item);
            }
          });
          const deduplicatedList = Array.from(uniqueMap.values());

          setRecipes(deduplicatedList);
          setTotalPages(json.totalPages || 1);
          setTotalRecipes(json.totalRecipes || 0);
        } else {
          setRecipes([]);
          setTotalPages(1);
          setTotalRecipes(0);
        }
      } catch (error) {
        console.error("Express API connection failed:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveRecipes();
  }, [searchQuery, selectedCategory, selectedAccessFilter, currentPage, currentUserEmail]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedAccessFilter("All");
    setCurrentPage(1);
  };

  const isFilterActive = searchQuery || selectedCategory !== "All" || selectedAccessFilter !== "All";

  // Helper for rendering meaningful empty states
  const renderEmptyState = () => {
    if (selectedAccessFilter === "Purchased") {
      return (
        <div className="text-center py-14 px-6 bg-gradient-to-b from-amber-500/10 via-base-200/30 to-base-200/10 rounded-3xl border border-amber-500/20 shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center text-3xl shadow-inner">
            <FaLockOpen />
          </div>
          <div className="space-y-1.5 max-w-md">
            <span className="badge badge-warning font-black text-[10px] uppercase tracking-wider">
              Unlocked Recipes Library
            </span>
            <h3 className="text-xl font-black text-base-content tracking-tight">
              No Purchased Recipes Yet
            </h3>
            <p className="text-xs text-base-content/70 font-medium leading-relaxed">
              You haven't unlocked any secret premium recipes in this category yet. Explore our top chef creations and unlock your first lifetime recipe today!
            </p>
          </div>
          <button
            onClick={() => setSelectedAccessFilter("Paid")}
            className="btn btn-primary btn-sm rounded-xl font-bold text-white normal-case shadow-md shadow-primary/20 gap-2 mt-2"
          >
            <FaCrown className="text-xs" />
            <span>Explore Premium Recipes</span>
          </button>
        </div>
      );
    }

    if (selectedAccessFilter === "Free") {
      return (
        <div className="text-center py-14 px-6 bg-base-200/30 rounded-3xl border border-dashed border-base-300 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-3xl">
            <FaUtensils />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h3 className="text-xl font-black text-base-content tracking-tight">
              No Free Recipes Found
            </h3>
            <p className="text-xs text-base-content/70 font-medium leading-relaxed">
              There are currently no free recipes matching your selected category ({selectedCategory}) or search query.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="btn btn-outline btn-sm rounded-xl font-bold normal-case gap-2 mt-2"
          >
            <FaRotateLeft className="text-xs" />
            <span>Show All Recipes</span>
          </button>
        </div>
      );
    }

    if (selectedAccessFilter === "Paid") {
      return (
        <div className="text-center py-14 px-6 bg-base-200/30 rounded-3xl border border-dashed border-base-300 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-3xl">
            <FaCrown />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h3 className="text-xl font-black text-base-content tracking-tight">
              No Premium Recipes Found
            </h3>
            <p className="text-xs text-base-content/70 font-medium leading-relaxed">
              No paid secret recipes matched your selected filters right now. Try clearing filters or searching for another keyword.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="btn btn-outline btn-sm rounded-xl font-bold normal-case gap-2 mt-2"
          >
            <FaRotateLeft className="text-xs" />
            <span>Clear Filters</span>
          </button>
        </div>
      );
    }

    return (
      <div className="text-center py-14 px-6 bg-base-200/30 rounded-3xl border border-dashed border-base-300 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-base-200 text-base-content/40 flex items-center justify-center text-3xl">
          <FaMagnifyingGlass />
        </div>
        <div className="space-y-1.5 max-w-md">
          <h3 className="text-xl font-black text-base-content tracking-tight">
            No Matching Recipes
          </h3>
          <p className="text-xs text-base-content/70 font-medium leading-relaxed">
            We couldn't find any recipes matching "{searchQuery || selectedCategory}". Try adjusting your keywords or clearing active filters.
          </p>
        </div>
        <button
          onClick={handleResetFilters}
          className="btn btn-primary btn-sm rounded-xl font-bold text-white normal-case gap-2 mt-2"
        >
          <FaRotateLeft className="text-xs" />
          <span>Reset Search & Filters</span>
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4 md:px-8 text-base-content transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 bg-base-200/40 p-6 rounded-3xl border border-base-300/30">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Discover Recipes</h1>
            <p className="text-xs opacity-60 font-semibold mt-1">
              Explore culinary delights, free community guides, and secret premium recipes.
            </p>
          </div>
          <div className="relative w-full md:w-80 group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/40">
              <FaMagnifyingGlass className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search Recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 bg-base-100 rounded-xl border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-3 space-y-6">
            <div className="p-5 bg-base-200/50 rounded-2xl border border-base-300/40 sticky top-24 space-y-6">
              
              {/* Filter 1: Access & Pricing */}
              <div>
                <div className="flex items-center justify-between font-black text-xs uppercase tracking-wider mb-3 pb-2 border-b border-base-300/60">
                  <span className="flex items-center gap-2">
                    <FaFilter className="text-primary text-xs" />
                    <span>Access & Pricing</span>
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {accessFilters.map((filterItem) => {
                    const IconComp = filterItem.icon;
                    const isSelected = selectedAccessFilter === filterItem.value;
                    return (
                      <button
                        key={filterItem.value}
                        onClick={() => setSelectedAccessFilter(filterItem.value)}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all text-left ${
                          isSelected
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "bg-base-100 hover:bg-base-300/70 border border-base-300/30 opacity-80"
                        }`}
                      >
                        <IconComp className={`text-sm ${isSelected ? "text-white" : filterItem.color}`} />
                        <span>{filterItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filter 2: Categories */}
              <div>
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider mb-3 pb-2 border-b border-base-300/60">
                  <FaSliders className="text-primary text-xs" />
                  <span>Categories</span>
                </div>
                <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3.5 py-2 rounded-xl font-bold text-xs text-left transition-all whitespace-nowrap ${
                        selectedCategory === category
                          ? "bg-secondary text-white shadow-md shadow-secondary/20"
                          : "bg-base-100 hover:bg-base-300/70 border border-base-300/30 opacity-80"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset All Filters Button */}
              {isFilterActive && (
                <button
                  onClick={handleResetFilters}
                  className="btn btn-ghost btn-sm w-full rounded-xl text-error font-bold normal-case gap-2 border border-error/20 hover:bg-error/10"
                >
                  <FaRotateLeft />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Recipe Grid */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64 gap-4">
                <HashLoader color="#10b981" size={45} />
                <span className="text-xs text-base-content/60 font-medium tracking-wide">
                  Loading recipes...
                </span>
              </div>
            ) : recipes.length === 0 ? (
              renderEmptyState()
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipes.map((recipe) => {
                    const isPaid =
                      recipe.recipeType === "Paid" ||
                      recipe.isPaid === true ||
                      Number(recipe.price || 0) > 0;
                    const owned = isPurchased(recipe._id, recipe.authorEmail);
                    const price = Number(recipe.price || 5).toFixed(2);
                    const isUnlockedForUser = owned || isAdmin || !isPaid;

                    return (
                      <div
                        key={recipe._id}
                        className="bg-base-100 rounded-2xl border border-base-300/40 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 group flex flex-col"
                      >
                        <div className="relative h-48 overflow-hidden bg-base-200">
                          <img
                            src={recipe.image || recipe.recipeImage}
                            alt={recipe.recipeName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-base-100/90 backdrop-blur-md text-primary shadow-sm">
                            {Array.isArray(recipe.category)
                              ? recipe.category[0]
                              : recipe.category || "General"}
                          </span>

                          {/* Free vs Premium vs Unlocked Badge Placement at Top Right */}
                          {(owned || isAdmin) && isPaid ? (
                            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-teal-600 text-white shadow-md flex items-center gap-1 tracking-wider">
                              <FaLockOpen className="text-[9px]" /> UNLOCKED
                            </span>
                          ) : isPaid ? (
                            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-amber-500 text-white shadow-md flex items-center gap-1 tracking-wider">
                              <FaCrown className="text-[9px]" /> PREMIUM
                            </span>
                          ) : (
                            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-emerald-500 text-white shadow-md flex items-center gap-1 tracking-wider">
                              <FaTag className="text-[9px]" /> FREE
                            </span>
                          )}
                        </div>

                        <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                          <div>
                            <div className="flex items-center justify-between text-xs mb-2 font-semibold">
                              <div className="flex items-center gap-2 opacity-70">
                                <span className="flex items-center gap-1">
                                  <FaClock className="text-[10px] text-primary" />{" "}
                                  {recipe.preparationTime || recipe.prepTime || "N/A"}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-amber-500 font-bold">
                                  <FaStar className="text-[10px]" /> {recipe.ratings || 5.0} ({recipe.reviewCount || (recipe.reviews ? recipe.reviews.length : 0)})
                                </span>
                              </div>

                              {/* Price Tag in Bottom Meta Area */}
                              <span className={`px-2 py-0.5 rounded-md font-black text-[11px] border ${
                                isPaid ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              }`}>
                                {isPaid ? `$${price}` : "Free"}
                              </span>
                            </div>
                            <h3 className="font-bold text-base text-base-content tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
                              {recipe.recipeName}
                            </h3>
                          </div>

                          {/* Action Buttons (For Admins or Owned, show ONLY "View Recipe") */}
                          {isUnlockedForUser ? (
                            <Link
                              href={`/browse-recipes/${recipe._id}`}
                              className="btn btn-primary btn-md w-full rounded-2xl font-bold text-white normal-case shadow-sm hover:shadow-md gap-2"
                            >
                              <span>View Recipe</span>
                            </Link>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/browse-recipes/${recipe._id}`}
                                className="btn btn-primary btn-md flex-1 rounded-2xl font-bold text-white normal-case shadow-sm hover:shadow-md"
                              >
                                Unlock Premium
                              </Link>
                              <button
                                onClick={() => addToCart(recipe)}
                                className="btn btn-outline btn-primary btn-md rounded-2xl font-bold px-3"
                                title="Add to Cart"
                              >
                                <FaCartPlus className="text-base" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Universal Pagination Component */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalRecipes}
                  itemsPerPage={limit}
                  onPageChange={(p) => setCurrentPage(p)}
                  className="mt-10"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BrowseRecipesPage() {
  return (
    <React.Suspense fallback={
      <div className="flex justify-center items-center min-h-[400px]">
        <HashLoader color="#10b981" size={40} />
      </div>
    }>
      <BrowseRecipesContent />
    </React.Suspense>
  );
}