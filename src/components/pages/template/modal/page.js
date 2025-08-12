"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useCanva } from "@/context/CanvaContext";
import {
  X,
  Save,
  Image as ImageIcon,
  FileText,
  Tag,
  Edit3,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

const TemplateImportModal = ({ template, isOpen, onClose, onSuccess }) => {
  const { postCanvaData, canvaLoading } = useCanva();

  const [formData, setFormData] = useState({
    title: template?.title || "",
    description: "",
    contentType: "",
    instruction: "",
    caption: "",
    tags: "",
    thumbnailUrl: template?.thumbnail?.url || "",
    canvaTemplateUrl: template?.urls?.view_url || "",
  });

  const [errors, setErrors] = useState({});

  // Reset form when template changes
  React.useEffect(() => {
    if (template) {
      setFormData({
        title: template.title || "",
        description: "",
        contentType: "",
        instruction: "",
        caption: "",
        tags: "",
        thumbnailUrl: template.thumbnail?.url || "",
        canvaTemplateUrl: template.urls?.view_url || "",
      });
      setErrors({});
    }
  }, [template]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.contentType.trim()) {
      newErrors.contentType = "Content type is required";
    }
    if (!formData.instruction.trim()) {
      newErrors.instruction = "Instruction is required";
    }
    if (!formData.caption.trim()) {
      newErrors.caption = "Caption is required";
    }
    if (!formData.tags.trim()) {
      newErrors.tags = "Tags are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      canvaTemplateId: template.id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      contentType: formData.contentType.trim(),
      instruction: formData.instruction.trim(),
      caption: formData.caption.trim(),
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      thumbnailUrl: formData.thumbnailUrl.trim(),
      canvaTemplateUrl: formData.canvaTemplateUrl.trim(),
    };

    const result = await postCanvaData("/admin/templates/import", payload);

    if (result?.status === 201) {
      onSuccess();
      onClose();
    } else {
      toast.error(result?.message || "Failed to import template");
    }
  };

  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-brand-beige p-2 rounded-lg">
              <FileText className="w-5 h-5 text-brand-warm-brown" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-brand-charcoal">
                Import Template
              </h2>
              <p className="text-sm text-brand-warm-brown">
                Add this template to your collection
              </p>
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
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border relative">
                <Image
                  src={template.thumbnail?.url}
                  alt={template.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-brand-charcoal truncate">
                {template.title}
              </h3>
              <p className="text-sm text-brand-warm-brown mt-1">
                ID: {template.id}
              </p>
              <p className="text-sm text-brand-warm-brown">
                Pages: {template.page_count}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Template Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown ${
                errors.title ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter template title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown ${
                errors.description ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Describe the template and its purpose"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Content Type *
            </label>
            <select
              value={formData.contentType}
              onChange={(e) => handleInputChange("contentType", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown ${
                errors.contentType ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Select content type</option>
              <option value="Post">Post</option>
              <option value="Carousel">Carousel</option>
              <option value="Reel">Reel</option>
              <option value="Story">Story</option>
            </select>
            {errors.contentType && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.contentType}
              </p>
            )}
          </div>

          {/* Instruction */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Instructions *
            </label>
            <textarea
              value={formData.instruction}
              onChange={(e) => handleInputChange("instruction", e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown ${
                errors.instruction ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Provide instructions for using this template"
            />
            {errors.instruction && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.instruction}
              </p>
            )}
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Caption *
            </label>
            <input
              type="text"
              value={formData.caption}
              onChange={(e) => handleInputChange("caption", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown ${
                errors.caption ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter a short caption for the template"
            />
            {errors.caption && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.caption}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Tags *
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown ${
                errors.tags ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter tags separated by commas (e.g., instagram, story, social media)"
            />
            {errors.tags && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.tags}
              </p>
            )}
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Thumbnail URL
            </label>
            <input
              type="url"
              value={formData.thumbnailUrl}
              onChange={(e) =>
                handleInputChange("thumbnailUrl", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown"
              placeholder="Enter thumbnail URL"
            />
          </div>

          {/* Canva Template URL */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Canva Template URL
            </label>
            <input
              type="url"
              value={formData.canvaTemplateUrl}
              onChange={(e) =>
                handleInputChange("canvaTemplateUrl", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown"
              placeholder="Enter Canva template URL"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-brand-warm-brown border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={canvaLoading}
              className="inline-flex items-center px-4 py-2 bg-brand-warm-brown text-white rounded-lg hover:bg-brand-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {canvaLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Import Template
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateImportModal;
