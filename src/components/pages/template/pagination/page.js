"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TemplatePagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  limit, 
  onPageChange 
}) => {
  const handlePageClick = (page) => {
    onPageChange(page);
  };

  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="bg-brand-light-beige px-6 py-4 flex items-center justify-between">
      <div className="text-sm text-brand-warm-brown">
        Showing {startItem} to {endItem} of {totalItems} templates
      </div>
      
      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm border border-brand-beige rounded-md hover:bg-brand-beige transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-brand-warm-brown hover:text-brand-charcoal flex items-center"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' ? handlePageClick(page) : null}
            disabled={page === '...'}
            className={`px-3 py-2 text-sm border rounded-md transition-colors cursor-pointer ${
              page === currentPage
                ? 'bg-brand-warm-brown text-white border-brand-warm-brown'
                : page === '...'
                ? 'border-transparent text-brand-warm-brown cursor-default'
                : 'border-brand-beige text-brand-warm-brown hover:bg-brand-beige hover:text-brand-charcoal'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm border border-brand-beige rounded-md hover:bg-brand-beige transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-brand-warm-brown hover:text-brand-charcoal flex items-center"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TemplatePagination; 