"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast, Toaster } from "react-hot-toast";
import { FaHeartBroken, FaTrash, FaEye } from "react-icons/fa";

const MyFavorites = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    useEffect(() => {
        if (user?.email) {
            axios.get(`${SERVER_URL}/favorites?email=${user.email}`)
                .then(res => {
                    setFavorites(res.data.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error:", err);
                    setLoading(false);
                });
        }
    }, [user?.email, SERVER_URL]);

    const handleDelete = (id) => {
        axios.delete(`${SERVER_URL}/favorites/${id}`)
            .then(() => {
                setFavorites(favorites.filter(fav => fav._id !== id));
                toast.success("Removed from favorites!", {
                    position: "top-center",
                });
            })
            .catch(err => {
                console.error("Error:", err);
                toast.error("Failed to remove!");
            });
    };

    return (
        <div className="p-6">
            <Toaster />

            <h2 className="text-2xl font-bold mb-6">My Favorites</h2>

            {loading ? (
                <div className="flex justify-center py-20">
                    <p className="text-gray-500">Loading your favorites...</p>
                </div>
            ) : favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                    <FaHeartBroken className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">No Favorites Found</h3>
                    <p className="text-gray-500 mt-2 mb-6">You haven't added any recipes to your favorites yet.</p>
                    <Link href="/browse-recipes" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                        Explore Recipes
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((fav) => (
                        <div key={fav._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                            <img
                                src={fav.recipeInfo?.image || "/placeholder.jpg"}
                                className="h-40 w-full object-cover mb-4 rounded"
                                alt={fav.recipeInfo?.recipeName}
                            />
                            <h3 className="font-bold text-lg">{fav.recipeInfo?.recipeName}</h3>
                            <div className="flex gap-2 mt-4">
                                <Link
                                    href={`/browse-recipes/${fav.recipeId}`}
                                    className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                                >
                                    <FaEye /> View Details
                                </Link>
                                <button
                                    onClick={() => handleDelete(fav._id)}
                                    className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                                >
                                    <FaTrash /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyFavorites;