
"use client";
import React from "react";
import { FaClock } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

const RecipeRow = ({ recipe, index, onDelete, onEditClick }) => {
  const { _id, recipeName, image, category, cuisineType, preparationTime } = recipe;

  return (
    <tr className="hover:bg-base-200/50 transition-colors border-b border-base-300/40 text-sm">
      {/* Index */}
      <th className="font-bold text-base-content/60">{index + 1}</th>

      {/* Recipe Info with Image */}
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12 bg-base-300 relative">
              {image ? (
                <img
                  src={image}
                  alt={recipeName}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-neutral text-neutral-content flex items-center justify-center font-bold text-xs">
                  No Img
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="font-black text-base text-base-content">{recipeName}</div>
            <span className="badge badge-sm badge-ghost font-medium mt-0.5">{cuisineType}</span>
          </div>
        </div>
      </td>

      {/* Category */}
      <td>
        <span className="badge badge-neutral font-bold">{category}</span>
      </td>

      {/* Prep Time Column */}
      <td className="font-medium text-base-content/80 vertical-middle">
        <div className="flex items-center gap-2">
          <FaClock className="text-base-content/60 w-4 h-4" />
          <span>{preparationTime}</span>
        </div>
      </td>

      {/* Actions (Solid Icons used here) */}
      <td>
        <div className="flex items-center gap-2">
          {/* Edit Button */}
          
          <button
            onClick={() => onEditClick(recipe)}
            className="btn btn-sm btn-square btn-ghost text-info hover:bg-info/10 rounded-lg transition-all"
            title="Edit Recipe"
          >
            <MdEdit className="w-5 h-5" />
          </button>

          {/* Delete Button (Solid Trash Icon) */}
          <button
            onClick={() => onDelete(_id)}
            className="btn btn-sm btn-square btn-ghost text-error hover:bg-error/10 rounded-lg transition-all"
            title="Delete Recipe"
          >
            <RiDeleteBin6Fill className="w-5 h-5" />
              
          </button>
        </div>
      </td>
    </tr>
  );
};

export default RecipeRow;