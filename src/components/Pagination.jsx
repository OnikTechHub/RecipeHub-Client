"use client";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 6,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1 && totalItems <= itemsPerPage) {
    return null;
  }

  // Calculate start and end item indexes
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 4;
      }
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 w-full ${className}`}
    >
      {/* Item Counter */}
      <div className="text-xs font-semibold text-base-content/60">
        Showing{" "}
        <span className="font-black text-base-content">
          {startItem}-{endItem}
        </span>{" "}
        of <span className="font-black text-base-content">{totalItems}</span> items
      </div>

      {/* Page Navigation Controls */}
      <div className="flex items-center gap-1.5 bg-base-200/50 p-1.5 rounded-2xl border border-base-300/50">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="btn btn-ghost btn-sm btn-square rounded-xl hover:bg-base-300/60 disabled:opacity-30 disabled:bg-transparent text-xs"
          title="Previous Page"
          aria-label="Previous Page"
        >
          <FaChevronLeft className="w-3 h-3" />
        </button>

        {/* Page Number Buttons */}
        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-xs font-bold text-base-content/40 select-none"
              >
                ...
              </span>
            );
          }

          const isCurrent = p === currentPage;

          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-xl font-black text-xs transition-all flex items-center justify-center ${
                isCurrent
                  ? "bg-primary text-primary-content shadow-md shadow-primary/30 scale-105"
                  : "hover:bg-base-300/70 text-base-content/80"
              }`}
              aria-current={isCurrent ? "page" : undefined}
            >
              {p}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="btn btn-ghost btn-sm btn-square rounded-xl hover:bg-base-300/60 disabled:opacity-30 disabled:bg-transparent text-xs"
          title="Next Page"
          aria-label="Next Page"
        >
          <FaChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
