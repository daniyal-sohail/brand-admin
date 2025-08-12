"use client";
import React, { useState } from "react";
import { useFAQ } from "@/context/FAQContext";
import { 
  X, 
  Plus, 
  FileText, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { toast } from "react-toastify";

const CreateFAQModal = ({ isOpen, onClose, onSuccess }) => {
  const { postFAQData, faqLoading } = useFAQ();
  
  const [formData, setFormData] = useState({
    question: "",
    answer: ""
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.question.trim()) {
      newErrors.question = "Question is required";
    }
    if (!formData.answer.trim()) {
      newErrors.answer = "Answer is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      question: formData.question.trim(),
      answer: formData.answer.trim()
    };

    const result = await postFAQData("/faqs/admin/create-faq", payload);

    if (result?.status === 201) {
      setFormData({ question: "", answer: "" });
      setErrors({});
      onSuccess();
      onClose();
    } else {
      toast.error(result?.message || "Failed to create FAQ");
    }
  };

  const handleClose = () => {
    setFormData({ question: "", answer: "" });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-brand-beige p-2 rounded-lg">
              <Plus className="w-5 h-5 text-brand-warm-brown" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-brand-charcoal">Create New FAQ</h2>
              <p className="text-sm text-brand-warm-brown">Add a new frequently asked question</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-brand-warm-brown" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Question *
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => handleInputChange('question', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown ${
                errors.question ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter the question..."
            />
            {errors.question && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.question}
              </p>
            )}
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Answer *
            </label>
            <textarea
              value={formData.answer}
              onChange={(e) => handleInputChange('answer', e.target.value)}
              rows={5}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown ${
                errors.answer ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter the answer..."
            />
            {errors.answer && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.answer}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-brand-warm-brown border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={faqLoading}
              className="inline-flex items-center px-4 py-2 bg-brand-warm-brown text-white rounded-lg hover:bg-brand-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {faqLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create FAQ
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFAQModal; 