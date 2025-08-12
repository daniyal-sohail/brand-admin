"use client";
import React from "react";
import { X, HelpCircle, Calendar, FileText } from "lucide-react";

const ViewFAQModal = ({ isOpen, onClose, faq }) => {
  if (!isOpen || !faq) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-light-beige">
          <div className="flex items-center">
            <div className="bg-brand-beige p-2 rounded-lg mr-3">
              <HelpCircle className="w-5 h-5 text-brand-warm-brown" />
            </div>
            <h2 className="text-xl font-semibold text-brand-charcoal">
              View FAQ Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-brand-warm-brown hover:text-brand-charcoal transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Question */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-brand-warm-brown mb-2">
              Question
            </label>
            <div className="bg-brand-light-beige p-4 rounded-lg">
              <p className="text-brand-charcoal font-medium text-lg leading-relaxed">
                {faq.question}
              </p>
            </div>
          </div>

          {/* Answer */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-brand-warm-brown mb-2">
              Answer
            </label>
            <div className="bg-brand-light-beige p-4 rounded-lg">
              <p className="text-brand-charcoal leading-relaxed whitespace-pre-wrap">
                {faq.answer}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-brand-light-beige p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 text-brand-warm-brown mr-2" />
                <span className="text-sm font-medium text-brand-warm-brown">
                  Created Date
                </span>
              </div>
              <p className="text-brand-charcoal">
                {formatDate(faq.createdAt)}
              </p>
            </div>
            <div className="bg-brand-light-beige p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FileText className="w-4 h-4 text-brand-warm-brown mr-2" />
                <span className="text-sm font-medium text-brand-warm-brown">
                  FAQ ID
                </span>
              </div>
              <p className="text-brand-charcoal font-mono text-sm">
                {faq._id}
              </p>
            </div>
          </div>

          {/* Answer Statistics */}
          <div className="bg-brand-light-beige p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-brand-warm-brown mb-2">
              Answer Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-brand-warm-brown">Characters:</span>
                <span className="text-brand-charcoal font-medium ml-2">
                  {faq.answer.length}
                </span>
              </div>
              <div>
                <span className="text-brand-warm-brown">Words:</span>
                <span className="text-brand-charcoal font-medium ml-2">
                  {faq.answer.split(/\s+/).filter(word => word.length > 0).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-brand-light-beige">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-warm-brown text-white rounded-lg hover:bg-brand-charcoal transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewFAQModal; 