"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useCanva } from "@/context/CanvaContext";
import { 
  Grid3X3, 
  Palette,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import TemplateTable from "./table/page";
import TemplatePagination from "./pagination/page";
import TemplateImportModal from "./modal/page";

const TemplatePage = () => {
  const { fetchCanvaData, canvaLoading, canvaError } = useCanva();
  
  // State for templates and pagination
  const [templates, setTemplates] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });



  // State for modal
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);



  // Fetch templates function
  const fetchTemplates = useCallback(async (retryCount = 0) => {
    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit
      };

      // Build query string
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value);
        }
      });

      const url = `/admin/templates/canva/available?${queryParams.toString()}`;
      const result = await fetchCanvaData(url);
      if (result?.status === 200 && result?.data) {
        setTemplates(result.data.templates || []);
        setPagination(prev => ({
          ...prev,
          currentPage: result.data.pagination?.currentPage || 1,
          totalPages: result.data.pagination?.totalPages || 1,
          totalItems: result.data.pagination?.totalItems || 0,
          hasNextPage: result.data.pagination?.hasNextPage || false,
          hasPrevPage: result.data.pagination?.hasPrevPage || false,
          limit: result.data.pagination?.limit || 10
        }));
      } else if (result === null) {
        // fetchCanvaData returned null due to error
        console.error("Template fetch failed: API error occurred");
      } else {
        console.error("Template fetch failed:", result);
        
        // Check for specific "Failed to fetch templates" error with 500 status
        if ((result?.data?.error === "Failed to fetch templates" || 
             result?.error === "Failed to fetch templates") && 
            result?.status === 500) {
          // Don't show toast - let the error display handle it
        }
        // Don't show any other error toasts here
      }
    } catch (error) {
      console.error("Template fetch error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      // Retry once for 500 errors
      if (error.response?.status === 500 && retryCount < 1) {
        setTimeout(() => {
          fetchTemplates(retryCount + 1);
        }, 2000); // Wait 2 seconds before retry
        return;
      }
      
      // Don't show toast here - let the context handle the error display
      // The error will be caught by CanvaContext and displayed in the UI
    }
  }, [fetchCanvaData, pagination.currentPage, pagination.limit]);

  // Fetch templates on mount and when dependencies change
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };



  // Handle template click
  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  // Handle modal success
  const handleModalSuccess = () => {
    // Refresh templates after successful import
    fetchTemplates();
  };

  return (
    <div className="container-width fade-in p-6">
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <div className="bg-brand-beige p-2 sm:p-3 rounded-xl">
          <Grid3X3 className="text-brand-warm-brown w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold ml-2 sm:ml-3 heading-primary">Templates</h1>
      </div>

      {/* Welcome Card */}
      <div className="bg-brand-beige p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="bg-white p-2 sm:p-3 rounded-xl flex-shrink-0">
          <Palette className="text-brand-warm-brown w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold heading-primary mb-1">Canva Templates</h2>
          <p className="body-text text-brand-warm-brown text-sm sm:text-base">
            Browse and manage your Canva templates. View, edit, and organize your designs.
          </p>
        </div>
      </div>

      {/* Error Display */}
      {canvaError && canvaError === "Failed to fetch templates" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 mb-1">
                Canva Connection Required
              </h3>
              <p className="text-sm text-red-700 mb-3">
                Please connect first with Canva from settings to access templates.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => window.location.href = '/admin/settings'}
                  className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  Go to Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {canvaLoading && !canvaError && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <RefreshCw className="w-5 h-5 text-blue-600 mr-3 animate-spin" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-1">
                Loading Templates
              </h3>
              <p className="text-sm text-blue-700">
                Please wait while we fetch your templates...
              </p>
            </div>
          </div>
        </div>
      )}



             {/* Template Table */}
       <TemplateTable 
         templates={templates} 
         canvaLoading={canvaLoading}
         onTemplateClick={handleTemplateClick}
       />

      {/* Pagination */}
      <TemplatePagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        limit={pagination.limit}
                 onPageChange={handlePageChange}
       />

       {/* Import Modal */}
       <TemplateImportModal
         template={selectedTemplate}
         isOpen={isModalOpen}
         onClose={handleModalClose}
         onSuccess={handleModalSuccess}
       />
     </div>
   );
 };

export default TemplatePage; 