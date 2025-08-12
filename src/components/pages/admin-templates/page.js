"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  LayoutTemplate,
  AlertCircle,
  RefreshCw,
  Loader2,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAdminTemplate } from "@/context/AdminTemplateContext";
import AdminTemplateCard from "./card/page";

const AdminTemplatesPage = () => {
  const {
    templateLoading,
    templateError,
    fetchTemplateData,
    patchTemplateData,
    setTemplateError,
  } = useAdminTemplate();
  
  // Local state for templates and pagination
  const [templates, setTemplates] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(12);

  // Function to fetch templates with pagination
  const fetchTemplates = useCallback(async (page = 1, limit = 12) => {
    const url = `/admin/templates/?page=${page}&limit=${limit}`;
    const response = await fetchTemplateData(url);
    if (response?.status === 200) {
      setTemplates(response.data.templates || []);
      setPagination(
        response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }
      );
    } else {
      setTemplates([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNextPage: false,
        hasPrevPage: false,
      });
    }
    return response;
  }, [fetchTemplateData]);

  useEffect(() => {
    fetchTemplates(currentPage, limit);
  }, [currentPage, limit, fetchTemplates]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRefresh = () => {
    fetchTemplates(currentPage, limit);
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handlePublishToggle = async (template) => {
    try {
      const result = await patchTemplateData(`/admin/templates/${template._id}/toggle-publish`);
      
      if (result?.status === 200) {
        const newStatus = !template.isPublished;
        toast.success(
          newStatus 
            ? "Template published successfully!" 
            : "Template unpublished successfully!"
        );
        handleRefresh();
      } else {
        toast.error(result?.message || "Failed to toggle publish status");
      }
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
    }
  };

  // Custom pagination component
  const AdminTemplatePagination = () => {

    const startItem = (pagination.currentPage - 1) * limit + 1;
    const endItem = Math.min(pagination.currentPage * limit, pagination.totalItems);

    const handlePageClick = (page) => {
      handlePageChange(page);
    };

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      
      if (pagination.totalPages <= maxVisible) {
        for (let i = 1; i <= pagination.totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (pagination.currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(pagination.totalPages);
        } else if (pagination.currentPage >= pagination.totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = pagination.totalPages - 3; i <= pagination.totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = pagination.currentPage - 1; i <= pagination.currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(pagination.totalPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="bg-brand-light-beige px-6 py-4 flex items-center justify-between">
        <div className="text-sm text-brand-warm-brown">
          Showing {startItem} to {endItem} of {pagination.totalItems} templates
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Previous Button */}
          <button
            onClick={() => handlePageClick(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
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
                page === pagination.currentPage
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
            onClick={() => handlePageClick(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="px-3 py-2 text-sm border border-brand-beige rounded-md hover:bg-brand-beige transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-brand-warm-brown hover:text-brand-charcoal flex items-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  if (templateLoading && templates.length === 0) {
    return (
      <div className="container-width fade-in p-6">
        {/* Header Section */}
        <div className="flex items-center align-middle mb-6">
          <div className="bg-brand-beige p-3 rounded-xl">
            <LayoutTemplate className="text-brand-warm-brown" />
          </div>
          <h1 className="text-3xl font-semibold ml-3 heading-primary">
            Admin Templates
          </h1>
        </div>

        {/* Loading State */}
        <div className="bg-brand-beige rounded-xl shadow-sm overflow-hidden">
          <div className="p-8 flex justify-center items-center">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-brand-warm-brown" />
              <span className="text-brand-warm-brown">Loading templates...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-width fade-in p-6">
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <div className="bg-brand-beige p-2 sm:p-3 rounded-xl">
          <LayoutTemplate className="text-brand-warm-brown w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold ml-2 sm:ml-3 heading-primary">
          Admin Templates
        </h1>
      </div>

      {/* Welcome Card */}
      <div className="bg-brand-beige p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="bg-white p-2 sm:p-3 rounded-xl flex-shrink-0">
          <LayoutTemplate className="text-brand-warm-brown w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold heading-primary mb-1">
            Template Management
          </h2>
          <p className="body-text text-brand-warm-brown text-sm sm:text-base">
            Manage and organize your Canva templates. View, edit, and track performance of your design templates.
          </p>
        </div>
        <div className="text-center sm:text-right flex-shrink-0">
          <div className="text-xl sm:text-2xl font-bold text-brand-charcoal">
            {pagination.totalItems}
          </div>
          <div className="text-xs sm:text-sm text-brand-warm-brown">Total Templates</div>
        </div>
      </div>

      {/* Error Display */}
      {templateError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-1">
                Error Loading Templates
              </h3>
              <p className="text-sm text-red-700 mb-3">{templateError}</p>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Grid */}
      <div className="bg-brand-beige rounded-xl shadow-sm overflow-hidden mb-6">
        {templates.length === 0 ? (
          <div className="p-8 text-center">
            <div className="bg-white p-4 rounded-xl inline-block mb-4">
              <LayoutTemplate className="w-8 h-8 text-brand-warm-brown mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-brand-charcoal mb-2">
              No Templates Found
            </h3>
            <p className="text-brand-warm-brown">
              No admin templates are available at the moment.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-brand-charcoal">
                All Templates ({pagination.totalItems})
              </h3>
              <div className="flex items-center gap-2">
                {templateLoading && (
                  <div className="flex items-center space-x-2 text-brand-warm-brown">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Updating...</span>
                  </div>
                )}
                <button
                  onClick={handleRefresh}
                  className="p-2 text-brand-warm-brown hover:bg-brand-light-beige rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <AdminTemplateCard
                  key={template._id}
                  template={template}
                  onTemplateUpdated={handleRefresh}
                  onPublishToggle={handlePublishToggle}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalItems > 0 && pagination.totalPages > 1 && (
        <AdminTemplatePagination />
      )}
    </div>
  );
};

export default AdminTemplatesPage; 