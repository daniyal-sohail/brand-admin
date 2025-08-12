"use client";
import React from "react";
import Image from "next/image";
import { useAdminTemplate } from "@/context/AdminTemplateContext";
import { 
  X, 
  Trash2, 
  AlertTriangle,
  Loader2
} from "lucide-react";
import { toast } from "react-toastify";

const DeleteTemplateModal = ({ template, isOpen, onClose, onSuccess }) => {
  const { deleteTemplateData, templateLoading } = useAdminTemplate();

  const handleDelete = async () => {
    if (!template?._id) {
      toast.error("Template ID not found");
      return;
    }

    const result = await deleteTemplateData(`/admin/templates/${template._id}`);

    if (result?.status === 200) {
      toast.success("Template deleted successfully");
      onSuccess();
      onClose();
    } else {
      toast.error(result?.message || "Failed to delete template");
    }
  };

  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-brand-charcoal">Delete Template</h2>
              <p className="text-sm text-brand-warm-brown">Remove template permanently</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-brand-warm-brown" />
          </button>
        </div>

        {/* Template Preview */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border relative">
                {template.thumbnailUrl ? (
                  <Image
                    src={template.thumbnailUrl}
                    alt={template.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-brand-charcoal truncate">{template.title}</h3>
              <p className="text-sm text-brand-warm-brown mt-1">
                ID: {template._id}
              </p>
              <p className="text-sm text-brand-warm-brown">
                Status: {template.isPublished ? "Published" : "Draft"}
              </p>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="p-6 border-b border-gray-200">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800 mb-1">
                  Warning: This action cannot be undone
                </h4>
                <p className="text-sm text-red-700">
                  This will permanently delete the template &quot;{template.title}&quot; and all associated data. 
                  This action cannot be reversed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-brand-warm-brown border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={templateLoading}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {templateLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Template
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTemplateModal; 