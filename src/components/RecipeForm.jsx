
"use client";
import React from "react";
import { HashLoader } from "react-spinners";
import { SERVER_URL } from "@/lib/apiConfig";

const RecipeForm = ({
  formData,
  setFormData,
  setImageFile,
  handleSubmit,
  uploading,
  disabled = false,
}) => {
  const [commissionRate, setCommissionRate] = React.useState(20);

  React.useEffect(() => {
    fetch(`${SERVER_URL}/pricing-plans`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.commissionRate !== undefined) {
          setCommissionRate(data.commissionRate);
        }
      })
      .catch((err) => console.error("Error fetching commission rate:", err));
  }, [SERVER_URL]);

  const priceVal = Number(formData.price) || 0;
  const creatorPercentage = Math.max(0, 100 - commissionRate);
  const creatorAmount = (priceVal * (creatorPercentage / 100)).toFixed(2);
  const platformAmount = (priceVal * (commissionRate / 100)).toFixed(2);
  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-base-200/40 p-6 rounded-2xl border border-base-300/40">
      {/* Recipe Name */}
      <div>
        <label className="label font-bold text-xs">Recipe Name</label>
        <input
          type="text"
          required
          disabled={disabled}
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
          disabled={disabled}
          className="file-input file-input-bordered file-input-primary w-full"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      </div>

      {/* Category & Cuisine Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label font-bold text-xs">Category</label>
          <select
            disabled={disabled}
            className="select select-bordered w-full"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snack</option>
            <option>Desserts</option>
          </select>
        </div>
        <div>
          <label className="label font-bold text-xs">Cuisine Type</label>
          <input
            type="text"
            required
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
            placeholder="e.g., 25 mins"
            className="input input-bordered w-full"
            value={formData.preparationTime}
            onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
          />
        </div>
      </div>

      {/* Recipe Pricing: Free vs Paid (Premium) */}
      <div className="bg-base-100 p-4 rounded-xl border border-base-300/60 space-y-3">
        <label className="label py-0 font-black text-xs uppercase tracking-wider text-base-content/80">
          Recipe Access & Monetization
        </label>
        
        <div className="grid grid-cols-2 gap-3">
          <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
            !formData.isPaid
              ? "border-primary bg-primary/10 text-primary font-black shadow-sm"
              : "border-base-300 hover:bg-base-200/50"
          }`}>
            <input
              type="radio"
              name="recipePricing"
              disabled={disabled}
              checked={!formData.isPaid}
              onChange={() => setFormData({ ...formData, isPaid: false, price: 0 })}
              className="radio radio-primary radio-sm"
            />
            <div>
              <span className="text-xs font-bold block">Free Recipe</span>
              <span className="text-[10px] opacity-70 block">Open to all foodies</span>
            </div>
          </label>

          <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
            formData.isPaid
              ? "border-amber-500 bg-amber-500/10 text-amber-600 font-black shadow-sm"
              : "border-base-300 hover:bg-base-200/50"
          }`}>
            <input
              type="radio"
              name="recipePricing"
              disabled={disabled}
              checked={formData.isPaid}
              onChange={() => setFormData({ ...formData, isPaid: true, price: formData.price > 0 ? formData.price : 4.99 })}
              className="radio radio-warning radio-sm"
            />
            <div>
              <span className="text-xs font-bold block">Paid (Premium)</span>
              <span className="text-[10px] opacity-70 block">Lock secret ingredients</span>
            </div>
          </label>
        </div>

        {formData.isPaid && (
          <div className="pt-2 space-y-2 border-t border-base-300/40 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="label font-bold text-xs py-0">Price in USD ($)</label>
              <span className="text-[11px] font-semibold text-emerald-600">
                You receive {creatorPercentage}% (${creatorAmount}) per purchase
              </span>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-base-content/50">$</span>
              <input
                type="number"
                step="0.01"
                min="0.99"
                max="99.99"
                disabled={disabled}
                required={formData.isPaid}
                placeholder="4.99"
                className="input input-bordered w-full pl-8 font-bold text-sm"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <p className="text-[10px] text-base-content/60">
              Platform fee: {commissionRate}% (${platformAmount}). Buyers get lifetime access.
            </p>
          </div>
        )}
      </div>

      {/* Ingredients */}
      <div>
        <label className="label font-bold text-xs">Ingredients (Separate with commas)</label>
        <input
          type="text"
          required
          disabled={disabled}
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
          disabled={disabled}
          placeholder="Step 1. Marinate the chicken... Step 2. Grill for 15 mins..."
          className="textarea textarea-bordered w-full h-28"
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={uploading || disabled}
        className={`btn w-full rounded-xl font-bold normal-case ${
          disabled ? "btn-disabled opacity-60" : "btn-primary text-white"
        }`}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <HashLoader color="#ffffff" size={16} />
            <span>Publishing Recipe...</span>
          </div>
        ) : disabled ? (
          "Upload Limit Reached (Max 2 Free Recipes)"
        ) : (
          "Publish Recipe Live"
        )}
      </button>
    </form>
  );
};

export default RecipeForm;