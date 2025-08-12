"use client";
import React, { useState, useEffect } from "react";
import { Search, Filter, Grid3X3, SortAsc, X, Check } from "lucide-react";

const TemplateFilter = ({
  searchTerm,
  category,
  contentType,
  sortBy,
  onSearch,
  onSearchChange,
  onApplyFilters,
  onClearFilters,
}) => {
  // Local state for non-search filters (only applied when button is clicked)
  const [localCategory, setLocalCategory] = useState(category);
  const [localContentType, setLocalContentType] = useState(contentType);
  const [localSortBy, setLocalSortBy] = useState(sortBy);

  // Update local state when props change
  useEffect(() => {
    setLocalCategory(category);
    setLocalContentType(contentType);
    setLocalSortBy(sortBy);
  }, [category, contentType, sortBy]);
  const categories = [
    { value: "", label: "All Categories" },
    { value: "marketing", label: "Marketing" },
    { value: "social", label: "Social Media" },
    { value: "business", label: "Business" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "health", label: "Health & Fitness" },
    { value: "technology", label: "Technology" },
    { value: "travel", label: "Travel" },
    { value: "food", label: "Food & Dining" },
  ];

  const contentTypes = [
    { value: "", label: "All Types" },
    { value: "Post", label: "Post" },
    { value: "Carousel", label: "Carousel" },
    { value: "Reel", label: "Reel" },
    { value: "Story", label: "Story" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "title", label: "Title A-Z" },
    { value: "title_desc", label: "Title Z-A" },
    { value: "pages", label: "Most Pages" },
    { value: "pages_asc", label: "Least Pages" },
  ];

  const hasActiveFilters =
    searchTerm || category || contentType || sortBy !== "newest";

  return (
    <div className="bg-brand-beige p-6 rounded-xl shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <form onSubmit={onSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-warm-brown w-4 h-4" />
            <input
              type="text"
              placeholder="Search templates by title..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-brand-light-beige rounded-lg bg-brand-light-beige focus:outline-none focus:ring-2 focus:ring-brand-warm-brown"
            />
          </form>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="text-brand-warm-brown w-4 h-4" />
          <select
            value={localCategory}
            onChange={(e) => setLocalCategory(e.target.value)}
            className="px-3 py-2 border border-brand-light-beige rounded-lg bg-brand-light-beige focus:outline-none focus:ring-2 focus:ring-brand-warm-brown text-sm"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Content Type Filter */}
        <div className="flex items-center gap-2">
          <Grid3X3 className="text-brand-warm-brown w-4 h-4" />
          <select
            value={localContentType}
            onChange={(e) => setLocalContentType(e.target.value)}
            className="px-3 py-2 border border-brand-light-beige rounded-lg bg-brand-light-beige focus:outline-none focus:ring-2 focus:ring-brand-warm-brown text-sm"
          >
            {contentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2">
          <SortAsc className="text-brand-warm-brown w-4 h-4" />
          <select
            value={localSortBy}
            onChange={(e) => setLocalSortBy(e.target.value)}
            className="px-3 py-2 border border-brand-light-beige rounded-lg bg-brand-light-beige focus:outline-none focus:ring-2 focus:ring-brand-warm-brown text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Apply Filters Button */}
        <button
          onClick={() =>
            onApplyFilters({
              category: localCategory,
              contentType: localContentType,
              sortBy: localSortBy,
            })
          }
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-warm-brown hover:bg-brand-charcoal transition-colors"
        >
          <Check className="w-4 h-4 mr-1" />
          Apply Filters
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-brand-light-beige">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: &quot;{searchTerm}&quot;
                <button
                  onClick={() => onSearchChange("")}
                  className="ml-1 hover:text-blue-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Category: {categories.find((c) => c.value === category)?.label}
                <button
                  onClick={() =>
                    onApplyFilters({
                      category: "",
                      contentType: localContentType,
                      sortBy: localSortBy,
                    })
                  }
                  className="ml-1 hover:text-green-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {contentType && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Type: {contentTypes.find((t) => t.value === contentType)?.label}
                <button
                  onClick={() =>
                    onApplyFilters({
                      category: localCategory,
                      contentType: "",
                      sortBy: localSortBy,
                    })
                  }
                  className="ml-1 hover:text-purple-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {sortBy !== "newest" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Sort: {sortOptions.find((s) => s.value === sortBy)?.label}
                <button
                  onClick={() =>
                    onApplyFilters({
                      category: localCategory,
                      contentType: localContentType,
                      sortBy: "newest",
                    })
                  }
                  className="ml-1 hover:text-orange-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateFilter;
