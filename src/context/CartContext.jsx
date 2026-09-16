"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { SERVER_URL } from "@/lib/apiConfig";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [purchasedIds, setPurchasedIds] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [liveRole, setLiveRole] = useState(null);
  const [isLivePremium, setIsLivePremium] = useState(false);

  // Real-time synchronization of user session with backend MongoDB user document
  useEffect(() => {
    if (!currentUser?.email) {
      setLiveRole(null);
      setIsLivePremium(false);
      return;
    }
    fetch(`${SERVER_URL}/users/${encodeURIComponent(currentUser.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setLiveRole(data.data.role || "user");
          setIsLivePremium(Boolean(data.data.isPremium || data.data.role === "admin" || data.data.role === "premium"));
        }
      })
      .catch((err) => console.error("Error syncing user session in CartContext:", err));
  }, [currentUser?.email, SERVER_URL]);

  const adminEmailEnv = process.env.NEXT_PUBLIC_ADMIN_EMAIL ? process.env.NEXT_PUBLIC_ADMIN_EMAIL.toLowerCase().trim() : "";
  const userEmailLower = currentUser?.email ? currentUser.email.toLowerCase().trim() : "";
  
  const isAdmin =
    Boolean(currentUser?.email) &&
    (liveRole === "admin" ||
     currentUser?.role === "admin" ||
     userEmailLower === "admin@recipehub.com" ||
     (Boolean(adminEmailEnv) && userEmailLower === adminEmailEnv));

  const isPremiumUser =
    Boolean(currentUser?.email) &&
    (isLivePremium ||
     currentUser?.isPremium === true ||
     currentUser?.role === "premium" ||
     isAdmin);

  // Load local storage cart on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("recipehub_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error("Failed to parse local cart:", err);
    }
  }, []);

  // Save cart to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem("recipehub_cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Failed to save cart:", err);
    }
  }, [cart]);

  // Fetch purchased recipe IDs for current user
  const fetchPurchasedIds = async () => {
    if (!currentUser?.email) {
      setPurchasedIds([]);
      return;
    }
    try {
      const res = await fetch(`${SERVER_URL}/user-purchased-ids?email=${encodeURIComponent(currentUser.email)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.purchasedRecipeIds)) {
        setPurchasedIds(data.purchasedRecipeIds);
      }
    } catch (err) {
      console.error("Error fetching purchased recipe IDs:", err);
    }
  };

  useEffect(() => {
    fetchPurchasedIds();
  }, [currentUser?.email]);

  // Check URL parameters for cart clearing after successful checkout
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("cart_cleared") === "true") {
        setCart([]);
        localStorage.removeItem("recipehub_cart");
        fetchPurchasedIds();
      }
    }
  }, []);

  // Helper: check if a recipe is purchased or owned
  const isPurchased = (recipeId, authorEmail) => {
    if (!recipeId) return false;

    // Universal Admin Access: All Admins get full free access to all recipes
    if (isAdmin) {
      return true;
    }

    if (
      userEmailLower &&
      authorEmail &&
      authorEmail.toLowerCase() === userEmailLower
    ) {
      return true;
    }
    return purchasedIds.includes(recipeId);
  };

  // Add recipe to cart
  const addToCart = (recipe) => {
    if (!recipe) return;

    if (isAdmin) {
      toast("As an Admin, you have full free access to all recipes!", { icon: "👑" });
      return;
    }

    const isPaid = recipe.recipeType === "Paid" || recipe.isPaid === true || Number(recipe.price || 0) > 0;
    if (!isPaid) {
      toast.error("Free recipes don't need to be added to cart!");
      return;
    }

    if (isPurchased(recipe._id, recipe.authorEmail)) {
      toast("You already have full access to this recipe!", { icon: "🔓" });
      return;
    }

    const exists = cart.some((item) => item._id === recipe._id);
    if (exists) {
      toast("Recipe is already in your cart!", { icon: "🛒" });
      setIsCartOpen(true);
      return;
    }

    const cartItem = {
      _id: recipe._id,
      recipeName: recipe.recipeName,
      title: recipe.recipeName,
      price: Number(recipe.price || 5),
      image: recipe.recipeImage || recipe.image,
      category: Array.isArray(recipe.category) ? recipe.category[0] : (recipe.category || "General"),
      authorEmail: recipe.authorEmail || "",
    };

    setCart((prev) => [...prev, cartItem]);
    toast.success(`"${recipe.recipeName}" added to cart!`);
    setIsCartOpen(true);
  };

  // Remove recipe from cart
  const removeFromCart = (recipeId) => {
    setCart((prev) => prev.filter((item) => item._id !== recipeId));
    toast("Item removed from cart.", { icon: "🗑️" });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("recipehub_cart");
  };

  // Total amount
  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);

  // Cart Checkout
  const handleCartCheckout = async () => {
    if (isAdmin) {
      toast.error("As an Admin, you have full free access to all recipes. Checkout is disabled.");
      return;
    }
    if (!currentUser?.email) {
      toast.error("Please login first to proceed with checkout!");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setLoadingCheckout(true);
    const toastId = toast.loading("Creating Stripe Checkout session...");

    try {
      const res = await fetch(`${SERVER_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          userEmail: currentUser.email,
          userId: currentUser.id || currentUser._id || "N/A",
        }),
      });

      const data = await res.json();
      if (data.success && data.url) {
        toast.dismiss(toastId);
        window.location.href = data.url;
      } else {
        toast.dismiss(toastId);
        toast.error(data.message || "Failed to initiate Stripe Checkout.");
      }
    } catch (err) {
      console.error("Cart checkout error:", err);
      toast.dismiss(toastId);
      toast.error("Payment integration error!");
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        purchasedIds,
        isPurchased,
        isCartOpen,
        setIsCartOpen,
        handleCartCheckout,
        loadingCheckout,
        fetchPurchasedIds,
        isAdmin,
        isPremiumUser,
        liveRole,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
