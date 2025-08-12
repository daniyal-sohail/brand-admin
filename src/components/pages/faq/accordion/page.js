"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useFAQ } from "@/context/FAQContext";
import {
  HelpCircle,
  Plus,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
  Loader2,
  Calendar,
  FileText,
  Edit3,
  Trash2,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";
import CreateFAQModal from "../createModal/page";
import ViewFAQModal from "../viewModal/page";
import EditFAQModal from "../editModal/page";
import FAQPagination from "../pagination/page";

const FAQAccordionView = () => {
  const { 
    faqLoading, 
    faqError, 
    fetchFAQData, 
    deleteFAQData,
    setFaqError
  } = useFAQ();
  
  // Local state for FAQs and pagination
  const [faqs, setFaqs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [openIndexes, setOpenIndexes] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);

  // Function to fetch FAQs with pagination
  const fetchFAQs = useCallback(async (page = 0, limit = 10) => {
    const response = await fetchFAQData(`/faqs?page=${page + 1}&limit=${limit}`);
    if (response?.status === 200) {
      setFaqs(response.data.data || []);
      setPagination({
        page: (response.data.page || 1) - 1, // Convert to 0-based index
        limit: response.data.limit || limit,
        total: response.data.total || 0,
        pages: response.data.pages || 1,
      });
    } else {
      setFaqs([]);
      setPagination({
        page: 0,
        limit: limit,
        total: 0,
        pages: 0,
      });
    }
  }, [fetchFAQData]);

  useEffect(() => {
    fetchFAQs(0, 10);
  }, [fetchFAQs]); // Include fetchFAQs in dependencies

  const toggleFAQ = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCreateSuccess = () => {
    toast.success("FAQ created successfully!");
    fetchFAQs(pagination.page, pagination.limit);
  };

  const handleViewFAQ = (faq) => {
    setSelectedFAQ(faq);
    setIsViewModalOpen(true);
  };

  const handleEditFAQ = (faq) => {
    setSelectedFAQ(faq);
    setIsEditModalOpen(true);
  };

  const handleDeleteFAQ = async (faqId) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      const result = await deleteFAQData(`/faqs/admin/${faqId}`);
      if (result?.status === 200) {
        toast.success("FAQ deleted successfully!");
        fetchFAQs(pagination.page, pagination.limit);
      } else {
        toast.error(result?.message || "Failed to delete FAQ");
      }
    }
  };

  const handleEditSuccess = () => {
    toast.success("FAQ updated successfully!");
    fetchFAQs(pagination.page, pagination.limit);
  };

  const handlePageChange = (newPage) => {
    setOpenIndexes([]); // Reset open accordions when changing page
    fetchFAQs(newPage, pagination.limit);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (faqLoading && faqs.length === 0) {
    return (
      <div className="container-width fade-in p-6">
        {/* Header Section */}
        <div className="flex items-center align-middle mb-6">
          <div className="bg-brand-beige p-3 rounded-xl">
            <HelpCircle className="text-brand-warm-brown" />
          </div>
          <h1 className="text-3xl font-semibold ml-3 heading-primary">
            FAQ Accordion View
          </h1>
        </div>

        {/* Loading State */}
        <div className="bg-brand-beige rounded-xl shadow-sm overflow-hidden">
          <div className="p-8 flex justify-center items-center">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-brand-warm-brown" />
              <span className="text-brand-warm-brown">Loading FAQs...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-width fade-in p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center">
          <div className="bg-brand-beige p-2 sm:p-3 rounded-xl">
            <HelpCircle className="text-brand-warm-brown w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold ml-2 sm:ml-3 heading-primary">
            FAQ Accordion View
          </h1>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-3 sm:px-4 py-2 bg-brand-warm-brown text-white rounded-lg hover:bg-brand-charcoal transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </button>
      </div>

      {/* Welcome Card */}
      <div className="bg-brand-beige p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="bg-white p-2 sm:p-3 rounded-xl flex-shrink-0">
          <HelpCircle className="text-brand-warm-brown w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold heading-primary mb-1">
            Frequently Asked Questions
          </h2>
          <p className="body-text text-brand-warm-brown text-sm sm:text-base">
            Manage and organize your frequently asked questions. Add new FAQs to
            help your users.
          </p>
        </div>
        <div className="text-center sm:text-right flex-shrink-0">
          <div className="text-xl sm:text-2xl font-bold text-brand-charcoal">
            {pagination.total}
          </div>
          <div className="text-xs sm:text-sm text-brand-warm-brown">Total FAQs</div>
        </div>
      </div>

      {/* Error Display */}
      {faqError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-1">
                Error Loading FAQs
              </h3>
              <p className="text-sm text-red-700 mb-3">{faqError}</p>
              <button
                onClick={() => fetchFAQs(pagination.page, pagination.limit)}
                className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Content */}
      <div className="bg-brand-beige rounded-xl shadow-sm overflow-hidden mb-6">
        {faqs.length === 0 ? (
          <div className="p-8 text-center">
            <div className="bg-white p-4 rounded-xl inline-block mb-4">
              <HelpCircle className="w-8 h-8 text-brand-warm-brown mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-brand-charcoal mb-2">
              No FAQs Found
            </h3>
            <p className="text-brand-warm-brown mb-4">
              You haven&apos;t created any FAQs yet. Start by adding your first FAQ.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-brand-warm-brown text-white rounded-lg hover:bg-brand-charcoal transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First FAQ
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-brand-charcoal">
                All FAQs ({pagination.total})
              </h3>
              {faqLoading && (
                <div className="flex items-center space-x-2 text-brand-warm-brown">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Updating...</span>
                </div>
              )}
            </div>

            {/* Accordion View */}
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={faq._id || index}
                  className="bg-white rounded-lg border border-brand-light-beige overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex items-center justify-between w-full p-4 text-left hover:bg-brand-light-beige transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-brand-charcoal pr-4 line-clamp-2">
                        {faq.question}
                      </h4>
                      <div className="flex items-center gap-4 mt-2 text-xs text-brand-warm-brown">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(faq.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {faq.answer.length > 100
                            ? `${faq.answer.substring(0, 100)}...`
                            : faq.answer}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <div className="text-xs text-brand-warm-brown bg-brand-light-beige px-2 py-1 rounded">
                        ID: {faq._id?.substring(-6)}
                      </div>
                      {openIndexes.includes(index) ? (
                        <ChevronUp className="w-5 h-5 text-brand-warm-brown" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-brand-warm-brown" />
                      )}
                    </div>
                  </button>

                  {openIndexes.includes(index) && (
                    <div className="px-4 pb-4">
                      <div className="pt-2 border-t border-brand-light-beige">
                        <p className="text-brand-warm-brown leading-relaxed whitespace-pre-wrap line-clamp-3">
                          {faq.answer}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-xs text-brand-warm-brown">
                            Created: {formatDate(faq.createdAt)}
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleViewFAQ(faq)}
                              className="inline-flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </button>
                            <button 
                              onClick={() => handleEditFAQ(faq)}
                              className="inline-flex items-center px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                            >
                              <Edit3 className="w-3 h-3 mr-1" />
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteFAQ(faq._id)}
                              className="inline-flex items-center px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.total > 0 && (
        <FAQPagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          loading={faqLoading}
        />
      )}

      {/* Modals */}
      <CreateFAQModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
      
      <ViewFAQModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        faq={selectedFAQ}
      />
      
      <EditFAQModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        faq={selectedFAQ}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default FAQAccordionView; 