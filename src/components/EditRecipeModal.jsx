"use client";
import React, { useEffect, useState } from "react";

const EditRecipeModal = ({ recipe, onClose, onUpdate }) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [prepTime, setPrepTime] = useState("");

    useEffect(() => {
        if (recipe) {
            setName(recipe.recipeName || "");
            setCategory(Array.isArray(recipe.category) ? recipe.category.join(", ") : recipe.category || "");
            setCuisine(recipe.cuisine || "");
            setPrepTime(recipe.prepTime || "");
        }
    }, [recipe]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const categoryArray = category
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        onUpdate({
            recipeName: name,
            category: categoryArray,
            cuisine: cuisine,
            prepTime: prepTime,
        });
    };

    if (!recipe) return null;

    return (
        <dialog id="edit_recipe_modal" className="modal modal-open modal-bottom sm:modal-middle">
            <div className="modal-box bg-gray-950 border border-gray-800 rounded-2xl text-white shadow-2xl">
                <h3 className="font-black text-xl border-b border-gray-800 pb-3 text-emerald-400 tracking-tight">
                    Update Recipe Parameters
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Recipe Name */}
                    <div className="form-control">
                        <label className="label text-xs font-bold text-gray-400 uppercase tracking-wider">Recipe Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input input-bordered bg-gray-900 border-gray-800 rounded-xl w-full text-sm focus:outline-none focus:border-emerald-500 text-white"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="form-control">
                        <label className="label text-xs font-bold text-gray-400 uppercase tracking-wider">Category (Comma separated)</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="input input-bordered bg-gray-900 border-gray-800 rounded-xl w-full text-sm focus:outline-none focus:border-emerald-500 text-white"
                            required
                        />
                    </div>

                    {/* Cuisine */}
                    <div className="form-control">
                        <label className="label text-xs font-bold text-gray-400 uppercase tracking-wider">Cuisine (e.g., Italian, Mexican)</label>
                        <input
                            type="text"
                            value={cuisine}
                            placeholder="Enter cuisine type"
                            onChange={(e) => setCuisine(e.target.value)}
                            className="input input-bordered bg-gray-900 border-gray-800 rounded-xl w-full text-sm focus:outline-none focus:border-emerald-500 text-white"
                            required
                        />
                    </div>

                    {/* Preparation Time */}
                    <div className="form-control">
                        <label className="label text-xs font-bold text-gray-400 uppercase tracking-wider">Preparation Time (e.g., 25 mins)</label>
                        <input
                            type="text"
                            value={prepTime}
                            placeholder="e.g., 30 mins"
                            onChange={(e) => setPrepTime(e.target.value)}
                            className="input input-bordered bg-gray-900 border-gray-800 rounded-xl w-full text-sm focus:outline-none focus:border-emerald-500 text-white"
                            required
                        />
                    </div>

                    {/* Actions */}
                    <div className="modal-action border-t border-gray-900 pt-4 flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-sm btn-ghost rounded-xl border-none hover:bg-gray-900 text-gray-400 font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-sm btn-emerald bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold text-gray-950 px-6 border-none"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
}
export default EditRecipeModal;