"use client";
import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const AddRecipePage = () => {
  const [formData, setFormData] = useState({
    recipeName: "",
    category: "Breakfast",
    cuisineType: "",
    difficultyLevel: "Easy",
    preparationTime: "",
    ingredients: "",
    instructions: "",
  });

  
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  
  const uploadImageToImgbb = async (file) => {
   
    
    const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "YOUR_IMGBB_API_KEY_HERE";

    if (!IMGBB_API_KEY || IMGBB_API_KEY === "YOUR_IMGBB_API_KEY_HERE") {
      throw new Error("Imgbb API Key is missing! Please configure it in your environment variables.");
    }

    const formDataBody = new FormData();
    formDataBody.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formDataBody,
      });

      const data = await res.json();

      if (data.success) {
        return data.data.url; /
        
      } else {
        
        console.error("Imgbb Server Response Error:", data.error);
        throw new Error(data.error?.message || "Imgbb image upload failed");
      }
    } catch (error) {
      console.error("Network or implementation error during upload:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!imageFile) {
      toast.error("Please select a recipe image!");
      return;
    }

    const loadingToast = toast.loading("Uploading image and publishing recipe...");
    setUploading(true);

    try {
      
      const imageUrl = await uploadImageToImgbb(imageFile);

      const recipeData = {
        recipeName: formData.recipeName,
        image: imageUrl,
        category: formData.category,
        cuisineType: formData.cuisineType,
        difficultyLevel: formData.difficultyLevel,
        preparationTime: formData.preparationTime,
        ingredients: formData.ingredients.split(",").map((item) => item.trim()),
        instructions: formData.instructions,
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Recipe Published Successfully!", {
          id: loadingToast,
          duration: 4000,
          style: {
            background: "#1F2937",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "12px",
          },
        });

        setFormData({
          recipeName: "",
          category: "Breakfast",
          cuisineType: "",
          difficultyLevel: "Easy",
          preparationTime: "",
          ingredients: "",
          instructions: "",
        });
        setImageFile(null);
        e.target.reset(); 
      } else {
        toast.error(data.message || "Failed to add recipe.", { id: loadingToast });
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      toast.error(error.message || "Something went wrong!", { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 p-6 max-w-2xl mx-auto text-base-content">
     
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="text-2xl font-black mb-6">Add a New Recipe to Collection</h2>

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
    </div>
  );
};

export default AddRecipePage;