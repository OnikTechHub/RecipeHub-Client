
"use client";
import React from "react";

const RecipeForm = ({
  formData,
  setFormData,
  setImageFile,
  handleSubmit,
  uploading,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-base-200/40 p-6 rounded-2xl border border-base-300/40">
      {/* Recipe Name */}
      <div>
        <label className="label font-bold text-xs">Recipe Name</label>
        <input
          type="text"
          required
          placeholder="e.g., Grilled Chicken"
          className="input input-bordered w-full"
          value={formData.recipeName}
          onChange={(e) => setFormData({ ...formData, recipeName: e.target.value })}
        />
      </div>

      {/* Recipe Image Upload */}
      <div>
        <label className="label font-bold text-xs">Recipe Image Upload</label>
        <input
          type="file"
          accept="image/*"
          required
          className="file-input file-input-bordered file-input-primary w-full"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      </div>

      {/* Category & Cuisine Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label font-bold text-xs">Category</label>
          <select
            className="select select-bordered w-full"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Desserts</option>
          </select>
        </div>
        <div>
          <label className="label font-bold text-xs">Cuisine Type</label>
          <input
            type="text"
            required
            placeholder="e.g., Italian, Mexican"
            className="input input-bordered w-full"
            value={formData.cuisineType}
            onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
          />
        </div>
      </div>

      {/* Difficulty Level & Preparation Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label font-bold text-xs">Difficulty Level</label>
          <select
            className="select select-bordered w-full"
            value={formData.difficultyLevel}
            onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value })}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div>
          <label className="label font-bold text-xs">Preparation Time</label>
          <input
            type="text"
            required
            placeholder="e.g., 25 mins"
            className="input input-bordered w-full"
            value={formData.preparationTime}
            onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
          />
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <label className="label font-bold text-xs">Ingredients (Separate with commas)</label>
        <input
          type="text"
          required
          placeholder="Chicken, Garlic, Olive Oil, Pepper"
          className="input input-bordered w-full"
          value={formData.ingredients}
          onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
        />
      </div>

      {/* Instructions */}
      <div>
        <label className="label font-bold text-xs">Instructions</label>
        <textarea
          required
          placeholder="Step 1. Marinate the chicken... Step 2. Grill for 15 mins..."
          className="textarea textarea-bordered w-full h-28"
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={uploading}
        className="btn btn-primary w-full rounded-xl text-white font-bold normal-case"
      >
        {uploading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          "Publish Recipe Live"
        )}
      </button>
    </form>
  );
};

export default RecipeForm;