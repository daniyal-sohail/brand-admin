"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FAQPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage,
  loading = false 
}) => {
  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const startItem = currentPage * itemsPerPage + 1;
  const endItem = Math.min((currentPage + 1) * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 0; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        pages.push(0);
        pages.push('...');
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(0);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  return (
    <div className="bg-brand-beige p-4 rounded-xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Items Info */}
        <div className="text-sm text-brand-warm-brown">
          {loading ? (
            <span>Loading...</span>
          ) : (
            <span>
              Showing {startItem} to {endItem} of {totalItems} FAQs
            </span>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center space-x-1">
            {/* Previous Button */}
            <button
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-2 text-sm font-medium text-brand-warm-brown hover:bg-brand-light-beige rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="ml-1">Previous</span>
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? handlePageClick(page) : null}
                disabled={page === '...'}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  page === currentPage
                    ? 'bg-brand-warm-brown text-white hover:bg-brand-charcoal'
                    : page === '...'
                    ? 'text-brand-warm-brown cursor-default'
                    : 'text-brand-warm-brown hover:bg-brand-light-beige'
                }`}
              >
                {typeof page === 'number' ? page + 1 : page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-2 text-sm font-medium text-brand-warm-brown hover:bg-brand-light-beige rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <span className="mr-1">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQPagination; 