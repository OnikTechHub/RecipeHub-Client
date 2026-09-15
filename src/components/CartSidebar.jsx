"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { FaCartShopping, FaXmark, FaTrash, FaCreditCard, FaLockOpen, FaArrowRight } from "react-icons/fa6";
import Link from "next/link";
import { HashLoader } from "react-spinners";

export default function CartSidebar() {
  const { cart, removeFromCart, clearCart, cartTotal, isCartOpen, setIsCartOpen, handleCartCheckout, loadingCheckout, isAdmin } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-base-content animate-fadeIn">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-base-100 border-l border-base-300 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-base-300 flex items-center justify-between bg-base-200/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                <FaCartShopping className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                  Shopping Cart
                  {!isAdmin && (
                    <span className="badge badge-primary font-bold text-xs">
                      {cart.length} {cart.length === 1 ? "item" : "items"}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-base-content/60 font-medium">
                  {isAdmin ? "Admin Account Notice" : "Review your secret paid recipes before checkout"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="btn btn-ghost btn-circle btn-sm hover:bg-base-300 rounded-xl"
            >
              <FaXmark className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List / Admin Notice */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {isAdmin ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 text-3xl">
                  👑
                </div>
                <div className="space-y-2 max-w-xs">
                  <span className="badge badge-warning font-black text-[10px] uppercase">
                    Admin Lifetime Access
                  </span>
                  <h3 className="text-base font-black text-base-content">
                    All Recipes Unlocked
                  </h3>
                  <p className="text-xs text-base-content/70 font-medium leading-relaxed">
                    As an Administrator, you have lifetime free access to all platform recipes (ingredients and instructions). The purchase and checkout system is disabled for your account.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn btn-primary btn-sm rounded-xl font-bold text-white normal-case gap-2"
                >
                  <span>Explore Unlocked Recipes</span>
                  <FaArrowRight className="text-xs" />
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-20 h-20 rounded-3xl bg-base-200 flex items-center justify-center text-base-content/30 text-3xl">
                  <FaCartShopping />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-base-content">Your cart is empty</h3>
                  <p className="text-xs text-base-content/60 max-w-xs font-medium">
                    Add paid recipes to your cart and unlock lifetime secret cooking techniques!
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn btn-primary btn-sm rounded-xl font-bold text-white normal-case gap-2"
                >
                  <span>Explore Recipes</span>
                  <FaArrowRight className="text-xs" />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3.5 bg-base-200/40 p-3.5 rounded-2xl border border-base-300/60 shadow-xs hover:border-primary/30 transition-all group"
                >
                  {/* Recipe Image */}
                  <div className="w-16 h-16 rounded-xl bg-base-300 overflow-hidden shrink-0 relative">
                    <img
                      src={item.image || "https://api.dicebear.com/7.x/bottts/svg?seed=fallback"}
                      alt={item.recipeName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Recipe Details */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black uppercase text-primary block truncate">
                      {item.category || "Premium"}
                    </span>
                    <h4 className="font-bold text-sm text-base-content truncate">
                      {item.recipeName || item.title}
                    </h4>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      ${Number(item.price || 5).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="btn btn-ghost btn-xs text-error hover:bg-error/10 rounded-lg p-2"
                    title="Remove from cart"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer */}
          {!isAdmin && cart.length > 0 && (
            <div className="p-5 border-t border-base-300 bg-base-200/60 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-base-content/70">
                  <span>Items ({cart.length})</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-base-content/70">
                  <span>Platform Fee</span>
                  <span className="text-success font-bold">Included</span>
                </div>
                <div className="flex justify-between text-base font-black text-base-content pt-2 border-t border-base-300">
                  <span>Total Amount</span>
                  <span className="text-primary text-lg">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCartCheckout}
                disabled={loadingCheckout}
                className="btn btn-primary btn-block rounded-2xl font-black text-white normal-case shadow-lg shadow-primary/25 gap-2"
              >
                {loadingCheckout ? (
                  <HashLoader color="#ffffff" size={20} />
                ) : (
                  <>
                    <FaCreditCard className="text-base" />
                    <span>Checkout with Stripe (${cartTotal.toFixed(2)})</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-error hover:underline"
                >
                  Clear Cart
                </button>
                <span className="text-[10px] text-base-content/50 font-medium flex items-center gap-1">
                  <FaLockOpen className="text-[9px]" /> Lifetime Unlocked Access
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
