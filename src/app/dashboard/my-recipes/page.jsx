
"use client";
import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import RecipeRow from "@/components/RecipeRow";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaEye } from "react-icons/fa6";

const MyRecipesPage = () => {
    const { data: session, isPending } = authClient.useSession();
    const currentUserEmail = session?.user?.email;
    const router = useRouter();

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal & Image Upload States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
    const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    // Fetch Data by Email
    useEffect(() => {
        const fetchMyRecipes = async () => {
            if (!currentUserEmail) return;
            try {
                setLoading(true);
                const res = await fetch(`${SERVER_URL}/my-recipes?email=${currentUserEmail}`);
                const data = await res.json();
                if (data.success) {
                    setRecipes(data.data || []);
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
    }, [currentUserEmail, SERVER_URL]);

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
            <div className="min-h-[60vh] flex items-center justify-center bg-base-100">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
                <div className="flex justify-center items-center h-48">
                    <span className="loading loading-spinner loading-md text-primary"></span>
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
                                    index={index}
                                    onDelete={handleDeleteRecipe}
                                    onEditClick={openEditModal}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Full Feature Edit Modal with Live Image File Uploader */}
            {isModalOpen && selectedRecipe && (
                <div className="modal modal-open items-center justify-center backdrop-blur-sm transition-all z-50">
                    <div className="modal-box max-w-xl bg-base-100 rounded-2xl p-6 border border-base-300/60 shadow-2xl relative max-h-[90vh] overflow-y-auto">

                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 font-bold"
                        >✕</button>

                        <h3 className="font-black text-xl mb-1 text-base-content">Update Recipe Details</h3>
                        <p className="text-xs text-base-content/60 mb-6">Modify the recipe fields below and save changes.</p>

                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
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

                            <div className="grid grid-cols-2 gap-4">
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

                            <div className="grid grid-cols-2 gap-4 items-end">
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
                            <div className="modal-action pt-2 gap-2">

                                <button
                                    onClick={() => router.push(`/recipe/${recipe._id}`)}
                                    className="btn btn-sm btn-ghost"
                                    title="View Recipe"
                                >
                                    <FaEye className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-sm btn-ghost rounded-xl px-4"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateLoading || uploadingImage}
                                    className="btn btn-sm btn-primary rounded-xl px-5 text-white font-bold"
                                >
                                    {updateLoading ? <span className="loading loading-spinner loading-xs"></span> : "Save Changes"}
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