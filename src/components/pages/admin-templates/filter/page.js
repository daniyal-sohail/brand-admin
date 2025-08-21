"use client";
import React, { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";

const AdminTemplateFilter = ({
  searchTerm,
  contentType,
  status,
  onSearchChange,
  onContentTypeChange,
  onStatusChange,
  onClearFilters,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearchChange]);

  const handleClearFilters = () => {
    setLocalSearchTerm("");
    onClearFilters();
  };

  const hasActiveFilters = searchTerm || contentType || status;

  return (
    <div className="bg-brand-beige rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl">
              <Filter className="w-5 h-5 text-brand-warm-brown" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-charcoal">Filter Templates</h3>
              <p className="text-sm text-brand-warm-brown">Refine your template search</p>
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 text-brand-warm-brown border border-brand-warm-brown rounded-lg hover:bg-brand-warm-brown hover:text-white transition-colors text-sm font-medium"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search Filter */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-3">
              Search Templates
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-warm-brown" />
              <input
                type="text"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                placeholder="Search by title, description..."
                className="w-full pl-10 pr-4 py-3 border border-brand-light-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown focus:border-brand-warm-brown bg-white transition-colors"
              />
            </div>
          </div>

          {/* Content Type Filter */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-3">
              Content Type
            </label>
            <select
              value={contentType || ""}
              onChange={(e) => onContentTypeChange(e.target.value)}
              className="w-full px-4 py-3 border border-brand-light-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown focus:border-brand-warm-brown bg-white transition-colors"
            >
              <option value="">All Content Types</option>
              <option value="Post">Post</option>
              <option value="Carousel">Carousel</option>
              <option value="Reel">Reel</option>
              <option value="Story">Story</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-3">
              Status
            </label>
            <select
              value={status || ""}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-4 py-3 border border-brand-light-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown focus:border-brand-warm-brown bg-white transition-colors"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-6 pt-6 border-t border-brand-light-beige">
            <div className="flex flex-wrap gap-3">
              {searchTerm && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white text-brand-warm-brown text-sm rounded-full border border-brand-light-beige shadow-sm">
                  <span className="font-medium">Search:</span>
                  <span>{searchTerm}</span>
                  <button
                    onClick={() => {
                      setLocalSearchTerm("");
                      onSearchChange("");
                    }}
                    className="ml-1 p-1 hover:bg-brand-light-beige rounded-full transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {contentType && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white text-brand-warm-brown text-sm rounded-full border border-brand-light-beige shadow-sm">
                  <span className="font-medium">Type:</span>
                  <span>{contentType}</span>
                  <button
                    onClick={() => onContentTypeChange("")}
                    className="ml-1 p-1 hover:bg-brand-light-beige rounded-full transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {status && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white text-brand-warm-brown text-sm rounded-full border border-brand-light-beige shadow-sm">
                  <span className="font-medium">Status:</span>
                  <span className="capitalize">{status}</span>
                  <button
                    onClick={() => onStatusChange("")}
                    className="ml-1 p-1 hover:bg-brand-light-beige rounded-full transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTemplateFilter;
