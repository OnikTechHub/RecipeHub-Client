"use client";
import React, { useState, useEffect } from "react";
import { FaTrash, FaUtensils, FaUser, FaTags, FaPenToSquare, FaCheckCircle, FaStar, FaMagnifyingGlass } from "react-icons/fa6";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import EditRecipeModal from "@/components/EditRecipeModal"; 
import Pagination from "@/components/Pagination";
import { HashLoader } from "react-spinners";
import { authClient } from "@/lib/auth-client";
import { SERVER_URL } from "@/lib/apiConfig";

export default function ManageRecipes() {
    const { data: session } = authClient.useSession();
    const currentUserEmail = session?.user?.email;

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeEditRecipe, setActiveEditRecipe] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecipes, setTotalRecipes] = useState(0);
    const limit = 10;

    const toastStyle = {
        position: "top-center",
        style: {
            background: "#1F2937",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "12px",
        },
    };

    const loadRecipes = async () => {
        try {
            setLoading(true);
            const emailParam = currentUserEmail ? `&email=${encodeURIComponent(currentUserEmail)}` : "";
            const res = await fetch(
                `${SERVER_URL}/admin/recipes?page=${currentPage}&limit=${limit}${emailParam}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "x-admin-email": currentUserEmail || "",
                        "x-user-email": currentUserEmail || "",
                    },
                    credentials: "include",
                }
            );
            const data = await res.json();
            if (data.success) {
                setRecipes(data.data || []);
                setTotalPages(data.totalPages || 1);
                setTotalRecipes(data.totalRecipes !== undefined ? data.totalRecipes : (data.data?.length || 0));
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load recipes.", toastStyle);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecipes();
    }, [currentPage, currentUserEmail]);

    // Filter recipes by searchQuery
    const filteredRecipes = recipes.filter((r) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        const name = (r.recipeName || "").toLowerCase();
        const cuisine = (r.cuisine || r.cuisineType || "").toLowerCase();
        const category = (Array.isArray(r.category) ? r.category.join(" ") : r.category || "").toLowerCase();
        const author = (r.authorName || r.authorEmail || "").toLowerCase();
        return name.includes(query) || cuisine.includes(query) || category.includes(query) || author.includes(query);
    });

    // Delete Recipe fun
    const handleDeleteRecipe = async (id, title) => {
        const isDark = typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark";
        Swal.fire({
            title: "Are you sure?",
            text: `Delete "${title}" permanently?`,
            icon: "warning",
            showCancelButton: true,
            background: isDark ? "#1e293b" : "#ffffff",
            color: isDark ? "#f8fafc" : "#0f172a",
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`${SERVER_URL}/admin/recipes/${id}`, { method: "DELETE" });
                    const data = await res.json();
                    if (data.success) {
                        setRecipes(recipes.filter(recipe => recipe._id !== id));
                        toast.success(`"${title}" has been deleted.`, toastStyle);
                    }
                } catch (error) {
                    toast.error("Something went wrong!", toastStyle);
                }
            }
        });
    };

    // Featured Status
    const handleToggleFeature = async (id, currentStatus, title) => {
        const newStatus = !currentStatus;
        try {
            const res = await fetch(`${SERVER_URL}/admin/recipes/feature/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isFeatured: newStatus }),
            });
            const data = await res.json();

            if (data.success) {
                setRecipes(recipes.map(recipe => recipe._id === id ? { ...recipe, isFeatured: newStatus } : recipe));
                toast.success(newStatus ? `"${title}" is now Featured!` : `"${title}" removed from Featured.`, toastStyle);
            }
        } catch (error) {
            toast.error("Feature status update failed.", toastStyle);
        }
    };

    const handleUpdateSubmit = async (updatedData) => {
        try {
            const res = await fetch(`${SERVER_URL}/admin/recipes/${activeEditRecipe._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData), 
            });
            const data = await res.json();

            if (data.success) {
                setRecipes(recipes.map(recipe =>
                    recipe._id === activeEditRecipe._id
                        ? { ...recipe, ...updatedData } 
                        : recipe
                ));

                toast.success("Recipe database sync complete!", toastStyle);
                setActiveEditRecipe(null); 
            }
        } catch (error) {
            toast.error("Failed to sync recipe data.", toastStyle);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col justify-center items-center gap-4">
                <HashLoader color="#10b981" size={50} />
                <p className="text-xs font-bold opacity-60 tracking-wider uppercase animate-pulse">Processing Community Ledger...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-base-300 pb-4">
                <div>
                    <h1 className="text-2xl font-black text-base-content tracking-tight">Manage Recipes</h1>
                    <p className="text-xs opacity-60 font-medium mt-1">Review, modularize, and customize featured lists for main page rendering.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                    <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-xs" />
                    <input
                        type="text"
                        placeholder="Search recipe, cuisine, author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs font-medium focus:outline-none focus:border-primary bg-base-100"
                    />
                </div>
            </div>

            <div className="overflow-x-auto bg-base-200/40 border border-base-300 rounded-2xl shadow-sm">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr className="border-b border-base-300 text-xs font-bold uppercase tracking-wider opacity-70">
                            <th>Recipe Details</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th className="text-center">Showcase Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecipes.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-10 font-bold text-base-content/50 text-sm">
                                    {searchQuery ? `No recipes match "${searchQuery}"` : "No community recipes found."}
                                </td>
                            </tr>
                        ) : (
                            filteredRecipes.map((recipe) => (
                                <tr key={recipe._id} className="border-b border-base-300/60 font-medium text-sm">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12 bg-base-300 flex items-center justify-center overflow-hidden">
                                                    {recipe.image ? <img src={recipe.image} alt={recipe.recipeName} className="object-cover w-full h-full" /> : <FaUtensils className="text-xl opacity-30" />}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-base-content">{recipe.recipeName}</div>
                                                <div className="text-[10px] opacity-40 font-mono mt-0.5 flex gap-2">
                                                    <span>ID: {recipe._id}</span>
                                                    {recipe.cuisine && <span className="text-emerald-500 font-bold">({recipe.cuisine})</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-base-content/80 text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <FaUser className="opacity-40 text-[10px]" />
                                            <div>
                                                <span className="block font-semibold">{recipe.authorName || "Anonymous"}</span>
                                                <span className="block text-[10px] opacity-50 font-mono">{recipe.authorEmail}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-neutral bg-base-300 text-base-content border-none badge-sm gap-1 font-bold p-2.5 rounded-lg">
                                            <FaTags className="text-[10px] opacity-60" />
                                            {Array.isArray(recipe.category) ? recipe.category.join(", ") : recipe.category || "Uncategorized"}
                                        </span>
                                    </td>

                                    {/* UPDATED*/}
                                    <td className="text-center">
                                        <button
                                            onClick={() => handleToggleFeature(recipe._id, recipe.isFeatured, recipe.recipeName)}
                                            className={`btn btn-xs rounded-full px-3 font-bold border-none transition-all duration-300 gap-1 h-7 min-h-0 ${recipe.isFeatured
                                                ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 shadow-sm"
                                                : "bg-base-300 text-base-content/50 hover:bg-base-300/80"
                                                }`}
                                        >
                                            <FaStar className={recipe.isFeatured ? "text-amber-500" : "opacity-30"} />
                                            {recipe.isFeatured ? "Featured" : "Make Feature"}
                                        </button>
                                    </td>

                                    <td className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => setActiveEditRecipe(recipe)}
                                                className="btn btn-neutral bg-base-300 text-base-content border-none btn-xs gap-1 font-bold rounded-lg px-2.5 py-1.5 h-auto min-h-0 hover:bg-base-300/70"
                                            >
                                                <FaPenToSquare /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRecipe(recipe._id, recipe.recipeName)}
                                                className="btn btn-error btn-outline btn-xs gap-1 font-bold rounded-lg px-2.5 py-1.5 h-auto min-h-0 hover:text-white"
                                            >
                                                <FaTrash /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="p-3 border-t border-base-300/40 bg-base-100/50">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalRecipes}
                        itemsPerPage={limit}
                        onPageChange={(p) => setCurrentPage(p)}
                    />
                </div>
            </div>

            {/* EditRecipeModal */}
            {activeEditRecipe && (
                <EditRecipeModal
                    recipe={activeEditRecipe}
                    onClose={() => setActiveEditRecipe(null)}
                    onUpdate={handleUpdateSubmit}
                />
            )}
        </div>
    );
}