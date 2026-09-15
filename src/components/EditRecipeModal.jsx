"use client";
import React, { useEffect, useState } from "react";
import { FaCrown, FaDollarSign, FaXmark } from "react-icons/fa6";

const EditRecipeModal = ({ recipe, onClose, onUpdate }) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [prepTime, setPrepTime] = useState("");
    const [isPaid, setIsPaid] = useState(false);
    const [price, setPrice] = useState(0);
    const [commissionRate, setCommissionRate] = useState(20);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

    useEffect(() => {
        fetch(`${SERVER_URL}/pricing-plans`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.commissionRate !== undefined) {
                    setCommissionRate(data.commissionRate);
                }
            })
            .catch((err) => console.error("Error fetching commission rate:", err));
    }, [SERVER_URL]);

    useEffect(() => {
        if (recipe) {
            setName(recipe.recipeName || "");
            setCategory(Array.isArray(recipe.category) ? recipe.category.join(", ") : recipe.category || "");
            setCuisine(recipe.cuisine || recipe.cuisineType || "");
            setPrepTime(recipe.prepTime || recipe.preparationTime || "");
            setIsPaid(!!recipe.isPaid);
            setPrice(recipe.price || (recipe.isPaid ? 4.99 : 0));
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
            isPaid: isPaid,
            price: isPaid ? Math.max(0, Number(price) || 0) : 0,
        });
    };

    if (!recipe) return null;

    const numPrice = Number(price) || 0;
    const creatorPercentage = Math.max(0, 100 - commissionRate);
    const creatorShare = (numPrice * (creatorPercentage / 100)).toFixed(2);
    const platformShare = (numPrice * (commissionRate / 100)).toFixed(2);

    return (
        <dialog id="edit_recipe_modal" className="modal modal-open items-center justify-center p-3 sm:p-4 z-50 backdrop-blur-xs">
            <div className="modal-box w-full max-w-xl max-h-[92vh] overflow-y-auto bg-base-100 border border-base-300/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl text-base-content relative">
                
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-3.5 top-3.5 hover:bg-base-200"
                    aria-label="Close modal"
                >
                    <FaXmark className="w-4 h-4" />
                </button>

                {/* Modal Title */}
                <div className="border-b border-base-300 pb-3 pr-8">
                    <h3 className="font-black text-xl sm:text-2xl tracking-tight text-base-content">
                        Update Recipe Parameters
                    </h3>
                    <p className="text-xs text-base-content/60 mt-0.5">
                        Edit details, culinary category, and pricing configuration.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Recipe Name */}
                    <div className="form-control w-full">
                        <label className="label py-1 font-bold text-xs uppercase tracking-wider text-base-content/70">
                            Recipe Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input input-bordered w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
                            placeholder="e.g., Authentic Chicken Biryani"
                            required
                        />
                    </div>

                    {/* Category & Cuisine Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        <div className="form-control w-full">
                            <label className="label py-1 font-bold text-xs uppercase tracking-wider text-base-content/70">
                                Category <span className="text-[10px] lowercase text-base-content/50">(comma separated)</span>
                            </label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="input input-bordered w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
                                placeholder="e.g., Dinner, Main Course"
                                required
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label py-1 font-bold text-xs uppercase tracking-wider text-base-content/70">
                                Cuisine Type
                            </label>
                            <input
                                type="text"
                                value={cuisine}
                                placeholder="e.g., Italian, Indian"
                                onChange={(e) => setCuisine(e.target.value)}
                                className="input input-bordered w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
                                required
                            />
                        </div>
                    </div>

                    {/* Preparation Time */}
                    <div className="form-control w-full">
                        <label className="label py-1 font-bold text-xs uppercase tracking-wider text-base-content/70">
                            Preparation Time
                        </label>
                        <input
                            type="text"
                            value={prepTime}
                            placeholder="e.g., 30 mins"
                            onChange={(e) => setPrepTime(e.target.value)}
                            className="input input-bordered w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
                            required
                        />
                    </div>

                    {/* Pricing: Free vs Paid (Premium) */}
                    <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300/80 space-y-3">
                        <label className="label py-0 font-black text-xs uppercase tracking-wider text-base-content/80">
                            Recipe Access & Monetization
                        </label>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                !isPaid
                                    ? "border-primary bg-primary/10 text-primary font-black shadow-xs"
                                    : "border-base-300 bg-base-100 hover:bg-base-200/60 text-base-content"
                            }`}>
                                <input
                                    type="radio"
                                    name="modalPricing"
                                    checked={!isPaid}
                                    onChange={() => {
                                        setIsPaid(false);
                                        setPrice(0);
                                    }}
                                    className="radio radio-primary radio-sm"
                                />
                                <div>
                                    <span className="text-xs font-bold block">Free Recipe</span>
                                    <span className="text-[10px] opacity-70 block">Open to everyone</span>
                                </div>
                            </label>

                            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                isPaid
                                    ? "border-amber-500 bg-amber-500/10 text-amber-600 font-black shadow-xs"
                                    : "border-base-300 bg-base-100 hover:bg-base-200/60 text-base-content"
                            }`}>
                                <input
                                    type="radio"
                                    name="modalPricing"
                                    checked={isPaid}
                                    onChange={() => {
                                        setIsPaid(true);
                                        setPrice(price > 0 ? price : 4.99);
                                    }}
                                    className="radio radio-warning radio-sm"
                                />
                                <div>
                                    <span className="text-xs font-bold flex items-center gap-1">
                                        <FaCrown className="text-[10px]" /> Paid (Premium)
                                    </span>
                                    <span className="text-[10px] opacity-70 block">Lock secret ingredients</span>
                                </div>
                            </label>
                        </div>

                        {/* Price Input & 80/20 Revenue Breakdown */}
                        {isPaid && (
                            <div className="pt-2 space-y-2.5 border-t border-base-300/60 animate-fadeIn">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                    <label className="label py-0 font-bold text-xs text-base-content/80">
                                        Price in USD ($)
                                    </label>
                                    <span className="text-[11px] font-semibold text-emerald-600">
                                        Creator receives {creatorPercentage}% (${creatorShare}) per sale
                                    </span>
                                </div>

                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center font-bold text-base-content/50 text-sm">
                                        <FaDollarSign />
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.99"
                                        max="99.99"
                                        required={isPaid}
                                        placeholder="4.99"
                                        value={price || ""}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="input input-bordered w-full pl-9 rounded-xl font-bold text-sm focus:outline-none focus:border-amber-500"
                                    />
                                </div>

                                <div className="p-2.5 bg-base-100 rounded-xl border border-base-300/50 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] gap-1">
                                    <span className="opacity-70">
                                        Platform Service Fee: 20% (${platformShare})
                                    </span>
                                    <span className="font-bold text-primary">
                                        Lifetime Unlocked for buyers
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="modal-action border-t border-base-300 pt-4 flex flex-col sm:flex-row gap-2.5 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-sm btn-ghost rounded-xl font-bold order-2 sm:order-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-sm btn-primary rounded-xl font-bold text-white px-6 order-1 sm:order-2 shadow-md shadow-primary/20"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default EditRecipeModal;