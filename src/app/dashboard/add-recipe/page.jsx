"use client";
import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import RecipeForm from "@/components/RecipeForm"; 

const AddRecipePage = () => {
    const { data: session, isPending } = authClient.useSession();
    const currentUserEmail = session?.user?.email;
    const router = useRouter();

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

    const [userRecipesCount, setUserRecipesCount] = useState(0);
    const [isPremium, setIsPremium] = useState(false);

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    useEffect(() => {
        const fetchUserStats = async () => {
            if (!currentUserEmail) return;
            try {
                const userRes = await fetch(`${SERVER_URL}/users/${currentUserEmail}`);
                const userData = await userRes.json();
                if (userData.success) {
                    setIsPremium(userData.data?.isPremium || false);
                }

                const recipesRes = await fetch(`${SERVER_URL}/recipes-count?email=${currentUserEmail}`);
                const recipesData = await recipesRes.json();
                if (recipesData.success) {
                    setUserRecipesCount(recipesData.count || 0);
                }
            } catch (error) {
                console.error("Error fetching usage statistics:", error);
            }
        };

        fetchUserStats();
    }, [currentUserEmail, SERVER_URL]);

    // Imgbb image upload logic
    const uploadImageToImgbb = async (file) => {
        const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

        if (!IMGBB_API_KEY) {
            throw new Error("Imgbb API Key is missing! Please configure it in your env variables.");
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
                return data.data.url;
            } else {
                console.error("Imgbb Server Error:", data.error);
                throw new Error(data.error?.message || "Imgbb image upload failed");
            }
        } catch (error) {
            console.error("Network error during upload:", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUserEmail) {
            toast.error("Please login to publish a recipe!");
            return;
        }

        
        if (!isPremium && userRecipesCount >= 2) {
            toast.error("Standard accounts have a 2-recipe limit! Redirecting to buy Premium...", {
                duration: 4000,
                style: {
                    background: "#EF4444",
                    color: "#fff",
                    fontWeight: "700"
                }
            });

            setTimeout(() => {
                router.push("/dashboard"); 
            }, 2000);

            return;
        }

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
                authorName: session?.user?.name || "Anonymous",
                authorEmail: currentUserEmail,
                likesCount: 0,
                isFeatured: false,
            };

            const res = await fetch(`${SERVER_URL}/recipes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(recipeData),
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Recipe Published Successfully!", {
                    id: loadingToast,
                    duration: 3000,
                });

                setUserRecipesCount((prev) => prev + 1);

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

                setTimeout(() => {
                    router.push("/dashboard/my-recipes");
                }, 1500);

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

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 p-6 max-w-2xl mx-auto text-base-content">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black">Add a New Recipe</h2>

                <span className={`badge ${isPremium ? "badge-warning" : "badge-neutral"} p-3 font-bold`}>
                    {isPremium ? "Pro Unlimited" : `Slot Used: ${userRecipesCount}/2`}
                </span>
            </div>

            <RecipeForm 
              formData={formData}
              setFormData={setFormData}
              setImageFile={setImageFile}
              handleSubmit={handleSubmit}
              uploading={uploading}
            />
        </div>
    );
};

export default AddRecipePage;