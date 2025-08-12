"use client";
import React, { useState, useEffect } from "react";
import { X, HelpCircle, Save, Loader2 } from "lucide-react";
import { useFAQ } from "@/context/FAQContext";
import { toast } from "react-toastify";

const EditFAQModal = ({ isOpen, onClose, faq, onSuccess }) => {
  const { putFAQData } = useFAQ();
  const [form, setForm] = useState({
    question: "",
    answer: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when FAQ changes
  useEffect(() => {
    if (faq) {
      setForm({
        question: faq.question || "",
        answer: faq.answer || "",
      });
    }
  }, [faq]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Please fill in both question and answer fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await putFAQData(`/faqs/admin/update-faq/${faq._id}`, {
        question: form.question.trim(),
        answer: form.answer.trim(),
      });

      // Check for both 200 and 201 status codes (201 is commonly used for updates)
      if (result?.status === 200 || result?.status === 201) {
        onSuccess();
        onClose();
      } else {
        toast.error(result?.message || "Failed to update FAQ");
      }
    } catch (error) {
      console.error("Update FAQ error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (faq) {
      setForm({
        question: faq.question || "",
        answer: faq.answer || "",
      });
    }
    onClose();
  };

  if (!isOpen || !faq) return null;

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
              Edit FAQ
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-brand-warm-brown hover:text-brand-charcoal transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Question */}
          <div className="mb-6">
            <label 
              htmlFor="question" 
              className="block text-sm font-medium text-brand-warm-brown mb-2"
            >
              Question *
            </label>
            <textarea
              id="question"
              name="question"
              value={form.question}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-brand-light-beige rounded-lg bg-brand-light-beige focus:outline-none focus:ring-2 focus:ring-brand-warm-brown resize-none"
              placeholder="Enter the question..."
              required
            />
            <div className="mt-1 text-xs text-brand-warm-brown">
              {form.question.length} characters
            </div>
          </div>

          {/* Answer */}
          <div className="mb-6">
            <label 
              htmlFor="answer" 
              className="block text-sm font-medium text-brand-warm-brown mb-2"
            >
              Answer *
            </label>
            <textarea
              id="answer"
              name="answer"
              value={form.answer}
              onChange={handleChange}
              rows={8}
              className="w-full px-4 py-3 border border-brand-light-beige rounded-lg bg-brand-light-beige focus:outline-none focus:ring-2 focus:ring-brand-warm-brown resize-none"
              placeholder="Enter the detailed answer..."
              required
            />
            <div className="mt-1 text-xs text-brand-warm-brown">
              {form.answer.length} characters, {form.answer.split(/\s+/).filter(word => word.length > 0).length} words
            </div>
          </div>

          {/* FAQ ID Display */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-brand-warm-brown mb-2">
              FAQ ID
            </label>
            <div className="bg-brand-light-beige p-3 rounded-lg">
              <p className="text-brand-charcoal font-mono text-sm">
                {faq._id}
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-brand-warm-brown mb-2">
              Preview
            </h3>
            <div className="bg-brand-light-beige p-4 rounded-lg">
              <div className="mb-3">
                <h4 className="font-medium text-brand-charcoal mb-1">Question:</h4>
                <p className="text-brand-charcoal">{form.question || "No question entered"}</p>
              </div>
              <div>
                <h4 className="font-medium text-brand-charcoal mb-1">Answer:</h4>
                <p className="text-brand-charcoal whitespace-pre-wrap">
                  {form.answer || "No answer entered"}
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-brand-light-beige">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-brand-warm-brown text-brand-warm-brown rounded-lg hover:bg-brand-light-beige transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !form.question.trim() || !form.answer.trim()}
            className="px-4 py-2 bg-brand-warm-brown text-white rounded-lg hover:bg-brand-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update FAQ
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFAQModal; 