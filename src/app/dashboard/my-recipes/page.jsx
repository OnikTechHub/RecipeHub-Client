
"use client";
import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import RecipeRow from "@/components/RecipeRow";
import Pagination from "@/components/Pagination";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaEye } from "react-icons/fa6";
import { HashLoader } from "react-spinners";

const MyRecipesPage = () => {
    const { data: session, isPending } = authClient.useSession();
    const currentUserEmail = session?.user?.email;
    const router = useRouter();

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecipes, setTotalRecipes] = useState(0);
    const limit = 8;

    // Modal & Image Upload States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [commissionRate, setCommissionRate] = useState(20);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
    const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    useEffect(() => {
        if (!SERVER_URL) return;
        fetch(`${SERVER_URL}/pricing-plans`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.commissionRate !== undefined) {
                    setCommissionRate(data.commissionRate);
                }
            })
            .catch((err) => console.error("Error fetching commission rate:", err));
    }, [SERVER_URL]);

    // Fetch Data by Email with Pagination and LIFO
    useEffect(() => {
        const fetchMyRecipes = async () => {
            if (!currentUserEmail) return;
            try {
                setLoading(true);
                const res = await fetch(
                    `${SERVER_URL}/my-recipes?email=${encodeURIComponent(currentUserEmail)}&page=${currentPage}&limit=${limit}`
                );
                const data = await res.json();
                if (data.success) {
                    setRecipes(data.data || []);
                    setTotalPages(data.totalPages || 1);
                    setTotalRecipes(data.totalRecipes !== undefined ? data.totalRecipes : (data.data?.length || 0));
                } else {
                    toast.error(data.message || "Failed to load recipes.");
                }
            } catch (error) {
                console.error("Error fetching recipes:", error);
                toast.error("Something went wrong while fetching recipes.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyRecipes();
    }, [currentUserEmail, currentPage, SERVER_URL]);

    // Delete Recipe Handler

    const handleDeleteRecipe = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3 p-1">
                <div className="flex items-start gap-2">
                    <span className="text-xl"><RiDeleteBin6Fill className="w-5 h-5" /></span>
                    <div>
                        <p className="font-bold text-sm text-base-content">Are you sure?</p>
                        <p className="text-xs text-base-content/60 mt-0.5">You want to delete this recipe permanently?</p>
                    </div>
                </div>

                {/* Action Buttons Inside Toast */}
                <div className="flex justify-end gap-2 mt-1">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="btn btn-xs bg-base-200 hover:bg-base-300 border-none rounded-md px-3 font-semibold normal-case text-xs"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);

                            const deletingToast = toast.loading("Deleting recipe...");
                            try {
                                const res = await fetch(`${SERVER_URL}/recipes/${id}`, { method: "DELETE" });
                                const data = await res.json();

                                if (data.success) {
                                    toast.success("Recipe Deleted Successfully!", { id: deletingToast });
                                    setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
                                } else {
                                    toast.error(data.message || "Failed to delete recipe.", { id: deletingToast });
                                }
                            } catch (error) {
                                console.error("Error deleting", error);
                                toast.error("Network error!", { id: deletingToast });
                            }
                        }}
                        className="btn btn-xs btn-error text-white rounded-md px-3 font-bold normal-case text-xs"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        ), {
            duration: 6000,
            position: "top-center",
            style: {
                borderRadius: '16px',
                background: '#fff',
                color: '#333',
                border: '1px solid #e5e7eb',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                padding: '12px'
            }
        });
    };

    // Click Edit Button -> Open Modal
    const openEditModal = (recipe) => {
        setSelectedRecipe({ ...recipe });
        setIsModalOpen(true);
    };

    //  Handle General Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedRecipe((prev) => ({ ...prev, [name]: value }));
    };

    // Handle Live Image Upload via ImgBB
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        const uploadToast = toast.loading("Uploading new image to ImgBB...");

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                const uploadedImageUrl = data.data.display_url;
                setSelectedRecipe((prev) => ({ ...prev, image: uploadedImageUrl }));
                toast.success("Image uploaded successfully!", { id: uploadToast });
            } else {
                toast.error("ImgBB upload failed. Check API Key.", { id: uploadToast });
            }
        } catch (error) {
            console.error("ImgBB Error:", error);
            toast.error("Failed to upload image. Network error.", { id: uploadToast });
        } finally {
            setUploadingImage(false);
        }
    };

    // Submit Updated Recipe Details (PATCH)
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (uploadingImage) {
            toast.error("Please wait until the image finishes uploading!");
            return;
        }

        setUpdateLoading(true);
        const updatingToast = toast.loading("Updating recipe details...");

        try {
            const res = await fetch(`${SERVER_URL}/recipes/${selectedRecipe._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedRecipe),
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Recipe updated successfully!", { id: updatingToast });
                setRecipes((prev) =>
                    prev.map((item) => (item._id === selectedRecipe._id ? selectedRecipe : item))
                );
                setIsModalOpen(false);
            } else {
                toast.error(data.message || "Failed to update recipe.", { id: updatingToast });
            }
        } catch (error) {
            console.error("Error updating recipe:", error);
            toast.error("Network error! Try again.", { id: updatingToast });
        } finally {
            setUpdateLoading(false);
        }
    };

    if (isPending) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-base-100 gap-4">
                <HashLoader color="#10b981" size={50} />
                <span className="text-sm text-base-content/60 font-medium tracking-wide">Authenticating...</span>
            </div>
        );
    }

    if (!currentUserEmail) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-base-100 text-center p-6">
                <h3 className="text-xl font-black text-error mb-2">Access Denied!</h3>
                <p className="text-sm text-base-content/70">Please login to view your dashboard collections.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 p-6 text-base-content max-w-5xl mx-auto relative">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Header Layout */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black tracking-tight">My Published Recipes</h2>
                    <p className="text-xs text-base-content/60 mt-1">Manage, update, or remove your shared culinary secrets.</p>
                </div>
                <div className="badge badge-primary p-3 font-bold gap-1 shadow-sm">
                    Total: {recipes.length} {recipes.length === 1 ? "Recipe" : "Recipes"}
                </div>
            </div>

            {/* Content Table Area */}
            {loading ? (
                <div className="flex flex-col justify-center items-center h-56 gap-4">
                    <HashLoader color="#10b981" size={42} />
                    <span className="text-xs text-base-content/60 font-medium tracking-wide">Loading your recipes...</span>
                </div>
            ) : recipes.length === 0 ? (
                <div className="text-center py-16 bg-base-200/40 border border-dashed border-base-300 rounded-3xl p-6">
                    <div className="text-4xl mb-3"></div>
                    <h3 className="text-lg font-bold">No Recipes Found</h3>
                    <button onClick={() => router.push("/dashboard/add-recipe")} className="btn btn-sm btn-primary font-bold mt-4 rounded-xl normal-case">
                        Create First Recipe
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto w-full bg-base-200/20 rounded-2xl border border-base-300/40 shadow-sm">
                    <table className="table table-zebra w-full">
                        <thead className="bg-base-200/60 font-black text-xs uppercase tracking-wider text-base-content/70">
                            <tr>
                                <th className="w-12">#</th>
                                <th>Recipe Name</th>
                                <th>Category</th>
                                <th>Prep Time</th>
                                <th className="w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipes.map((recipe, index) => (
                                <RecipeRow
                                    key={recipe._id}
                                    recipe={recipe}
                                    index={(currentPage - 1) * limit + index}
                                    onDelete={handleDeleteRecipe}
                                    onEditClick={openEditModal}
                                />
                            ))}
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
            )}

            {/* Full Feature Edit Modal with Live Image File Uploader */}
            {isModalOpen && selectedRecipe && (
                <div className="modal modal-open items-center justify-center p-3 sm:p-4 backdrop-blur-xs transition-all z-50">
                    <div className="modal-box w-full max-w-xl bg-base-100 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-base-300/80 shadow-2xl relative max-h-[92vh] overflow-y-auto">

                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="btn btn-sm btn-circle btn-ghost absolute right-3.5 top-3.5 font-bold hover:bg-base-200"
                        >✕</button>

                        <div className="border-b border-base-300 pb-3 pr-8">
                            <h3 className="font-black text-xl sm:text-2xl mb-0.5 text-base-content">Update Recipe Details</h3>
                            <p className="text-xs text-base-content/60">Modify the recipe fields and pricing below, then save changes.</p>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="space-y-4 mt-4">
                            {/* Recipe Name */}
                            <div className="form-control w-full">
                                <label className="label py-1 font-bold text-xs uppercase text-base-content/70">Recipe Name</label>
                                <input
                                    type="text"
                                    name="recipeName"
                                    value={selectedRecipe.recipeName || ""}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                                {/* Category */}
                                <div className="form-control w-full">
                                    <label className="label py-1 font-bold text-xs uppercase text-base-content/70">Category</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={selectedRecipe.category || ""}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
                                        required
                                    />
                                </div>

                                {/* Cuisine Type */}
                                <div className="form-control w-full">
                                    <label className="label py-1 font-bold text-xs uppercase text-base-content/70">Cuisine Type</label>
                                    <input
                                        type="text"
                                        name="cuisineType"
                                        value={selectedRecipe.cuisineType || ""}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 items-end">
                                {/* Preparation Time */}
                                <div className="form-control w-full">
                                    <label className="label py-1 font-bold text-xs uppercase text-base-content/70">Prep Time</label>
                                    <input
                                        type="text"
                                        name="preparationTime"
                                        value={selectedRecipe.preparationTime || ""}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
                                        required
                                    />
                                </div>

                                {/* Custom Beautiful File Input instead of Image URL Text Input */}
                                <div className="form-control w-full">
                                    <label className="label py-1 font-bold text-xs uppercase text-base-content/70">Update Recipe Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="file-input file-input-bordered file-input-primary w-full rounded-xl text-sm focus:outline-none h-10"
                                    />
                                </div>
                            </div>

                            {/* Mini Image Preview inside Form */}
                            {selectedRecipe.image && (
                                <div className="flex items-center gap-3 bg-base-200/50 p-2 rounded-xl border border-base-300/60">
                                    <img
                                        src={selectedRecipe.image}
                                        alt="Preview"
                                        className="w-14 h-14 object-cover rounded-lg border border-base-300"
                                    />
                                    <div className="text-xs">
                                        <p className="font-bold text-success">Active Recipe Image</p>
                                        <p className="text-base-content/50 truncate max-w-xs">{selectedRecipe.image}</p>
                                    </div>
                                </div>
                            )}

                            {/* Recipe Monetization & Pricing (Free vs Paid) */}
                            <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300/80 space-y-3">
                                <label className="label py-0 font-black text-xs uppercase tracking-wider text-base-content/80">
                                    Recipe Access & Monetization
                                </label>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                        !selectedRecipe.isPaid
                                            ? "border-primary bg-primary/10 text-primary font-black shadow-xs"
                                            : "border-base-300 bg-base-100 hover:bg-base-200/60 text-base-content"
                                    }`}>
                                        <input
                                            type="radio"
                                            name="myRecipePricing"
                                            checked={!selectedRecipe.isPaid}
                                            onChange={() => setSelectedRecipe(prev => ({ ...prev, isPaid: false, price: 0 }))}
                                            className="radio radio-primary radio-sm"
                                        />
                                        <div>
                                            <span className="text-xs font-bold block">Free Recipe</span>
                                            <span className="text-[10px] opacity-70 block">Open to everyone</span>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                        selectedRecipe.isPaid
                                            ? "border-amber-500 bg-amber-500/10 text-amber-600 font-black shadow-xs"
                                            : "border-base-300 bg-base-100 hover:bg-base-200/60 text-base-content"
                                    }`}>
                                        <input
                                            type="radio"
                                            name="myRecipePricing"
                                            checked={!!selectedRecipe.isPaid}
                                            onChange={() => setSelectedRecipe(prev => ({
                                                ...prev,
                                                isPaid: true,
                                                price: prev.price > 0 ? prev.price : 4.99
                                            }))}
                                            className="radio radio-warning radio-sm"
                                        />
                                        <div>
                                            <span className="text-xs font-bold flex items-center gap-1">
                                                Paid (Premium)
                                            </span>
                                            <span className="text-[10px] opacity-70 block">Lock secret ingredients</span>
                                        </div>
                                    </label>
                                </div>

                                {selectedRecipe.isPaid && (
                                    <div className="pt-2 space-y-2.5 border-t border-base-300/60 animate-fadeIn">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                            <label className="label py-0 font-bold text-xs text-base-content/80">
                                                Price in USD ($)
                                            </label>
                                            <span className="text-[11px] font-semibold text-emerald-600">
                                                You receive {Math.max(0, 100 - commissionRate)}% (${((Number(selectedRecipe.price) || 0) * (Math.max(0, 100 - commissionRate) / 100)).toFixed(2)}) per purchase
                                            </span>
                                        </div>

                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center font-bold text-base-content/50 text-sm">$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0.99"
                                                max="99.99"
                                                required={selectedRecipe.isPaid}
                                                placeholder="4.99"
                                                name="price"
                                                value={selectedRecipe.price || ""}
                                                onChange={handleInputChange}
                                                className="input input-bordered w-full pl-9 rounded-xl font-bold text-sm focus:outline-none focus:border-amber-500"
                                            />
                                        </div>

                                        <div className="p-2.5 bg-base-100 rounded-xl border border-base-300/50 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] gap-1">
                                            <span className="opacity-70">
                                                Platform Service Fee: 20% (${((Number(selectedRecipe.price) || 0) * 0.2).toFixed(2)})
                                            </span>
                                            <span className="font-bold text-primary">
                                                Buyers receive Lifetime Access
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Ingredients Field */}
                            <div className="form-control w-full">
                                <label className="label py-1 font-bold text-xs uppercase text-base-content/70">
                                    Ingredients <span className="text-base-content/40 font-normal">(Separate with commas)</span>
                                </label>
                                <input
                                    type="text"
                                    name="ingredients"
                                    value={Array.isArray(selectedRecipe.ingredients) ? selectedRecipe.ingredients.join(", ") : selectedRecipe.ingredients || ""}
                                    onChange={(e) => {
                                        const { value } = e.target;
                                        setSelectedRecipe(prev => ({
                                            ...prev,
                                            ingredients: value.split(",").map(item => item.trim())
                                        }));
                                    }}
                                    placeholder="Chicken, Garlic, Olive Oil, Pepper"
                                    className="input input-bordered w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
                                    required
                                />
                            </div>

                            {/* Instructions Field */}
                            <div className="form-control w-full">
                                <label className="label py-1 font-bold text-xs uppercase text-base-content/70">Instructions</label>
                                <textarea
                                    name="instructions"
                                    rows="4"
                                    value={selectedRecipe.instructions || ""}
                                    onChange={handleInputChange}
                                    placeholder="Step 1. Marinate... Step 2. Cook..."
                                    className="textarea textarea-bordered w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary h-24 resize-none"
                                    required
                                ></textarea>
                            </div>

                            {/* Modal Actions */}
                            <div className="modal-action border-t border-base-300 pt-4 flex flex-col sm:flex-row gap-2.5 justify-end">
                                <button
                                    type="button"
                                    onClick={() => router.push(`/browse-recipes/${selectedRecipe._id}`)}
                                    className="btn btn-sm btn-ghost rounded-xl gap-2 font-semibold order-3 sm:order-1"
                                    title="View Public Recipe"
                                >
                                    <FaEye className="w-4 h-4 text-primary" />
                                    <span>Preview Recipe</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-sm btn-ghost rounded-xl px-4 font-bold order-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateLoading || uploadingImage}
                                    className="btn btn-sm btn-primary rounded-xl px-6 text-white font-bold order-1 sm:order-3 shadow-md shadow-primary/20"
                                >
                                    {updateLoading ? (
                                        <HashLoader color="#ffffff" size={16} />
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyRecipesPage;