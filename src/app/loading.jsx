"use client";
import React from "react";
import { HashLoader } from "react-spinners";

export default function Loading() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
            <HashLoader color="#10b981" size={55} />
            <span className="text-xs font-semibold text-base-content/60 tracking-wider uppercase animate-pulse">
                RecipeHub Loading...
            </span>
        </div>
    );
}
