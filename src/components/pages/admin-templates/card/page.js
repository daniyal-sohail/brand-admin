"use client";
import React, { useState } from "react";
import {
  Calendar,
  Eye,
  Edit3,
  Bookmark,
  TrendingUp,
  Tag,
  ExternalLink,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import EditTemplateModal from "../editModal/page";
import DeleteTemplateModal from "../deleteModal/page";

const AdminTemplateCard = ({ template, onTemplateUpdated, onPublishToggle }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleOpenLink = () => {
    window.open(template.canvaEditUrl, '_blank');
  };

  const handlePublishToggle = async () => {
    setIsPublishing(true);
    try {
      await onPublishToggle(template);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleEditTemplate = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    if (onTemplateUpdated) {
      onTemplateUpdated();
    }
  };

  const handleDeleteSuccess = () => {
    if (onTemplateUpdated) {
      onTemplateUpdated();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-brand-light-beige overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Thumbnail Section */}
      <div className="relative aspect-video bg-brand-light-beige overflow-hidden">
        {template.thumbnailUrl ? (
          <>
            <Image
              src={template.thumbnailUrl}
              alt={template.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => {
                // Handle error by showing fallback
                const fallback = document.querySelector(".image-fallback");
                if (fallback) {
                  fallback.classList.remove("hidden");
                  fallback.classList.add("flex");
                }
              }}
            />
            <div className="w-full h-full items-center justify-center bg-gradient-to-br from-brand-beige to-brand-light-beige hidden image-fallback">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-warm-brown rounded-full flex items-center justify-center mx-auto mb-2">
                  <Tag className="w-8 h-8 text-white" />
                </div>
                <p className="text-brand-warm-brown text-sm font-medium">
                  Image Failed to Load
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-beige to-brand-light-beige">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-warm-brown rounded-full flex items-center justify-center mx-auto mb-2">
                <Tag className="w-8 h-8 text-white" />
              </div>
              <p className="text-brand-warm-brown text-sm font-medium">
                No Preview
              </p>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
              template.isPublished
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            } ${isPublishing ? 'opacity-50' : ''}`}
          >
            {isPublishing ? (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                {template.isPublished ? "Unpublishing..." : "Publishing..."}
              </div>
            ) : (
              template.isPublished ? "Published" : "Draft"
            )}
          </span>
        </div>

        {/* Trending Badge */}
        {template.isTrending && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Trending
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={handlePublishToggle}
              disabled={isPublishing}
              className="p-2 bg-white rounded-lg shadow-md hover:bg-brand-light-beige transition-colors disabled:opacity-50"
              title={template.isPublished ? "Unpublish Template" : "Publish Template"}
            >
              {isPublishing ? (
                <div className="w-4 h-4 border-2 border-brand-warm-brown border-t-transparent rounded-full animate-spin" />
              ) : template.isPublished ? (
                <div className="w-4 h-4 text-red-600">●</div>
              ) : (
                <div className="w-4 h-4 text-green-600">○</div>
              )}
            </button>
            <button
              onClick={handleEditTemplate}
              className="p-2 bg-white rounded-lg shadow-md hover:bg-brand-light-beige transition-colors"
              title="Edit Template"
            >
              <Edit3 className="w-4 h-4 text-brand-warm-brown" />
            </button>
            <button
              onClick={handleOpenLink}
              className="p-2 bg-white rounded-lg shadow-md hover:bg-brand-light-beige transition-colors"
              title="Open in New Tab"
            >
              <ExternalLink className="w-4 h-4 text-brand-warm-brown" />
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 transition-colors"
              title="Delete Template"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-brand-charcoal text-lg mb-2 line-clamp-2 group-hover:text-brand-warm-brown transition-colors">
          {template.title}
        </h3>

        {/* Description */}
        <p className="text-brand-warm-brown text-sm mb-3 line-clamp-1">
          {template.description}
        </p>

        {/* Content Type */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-brand-beige text-brand-warm-brown text-xs font-medium rounded-full">
            {template.contentType}
          </span>
        </div>

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {template.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-brand-light-beige text-brand-warm-brown text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="px-2 py-1 bg-brand-light-beige text-brand-warm-brown text-xs rounded-full">
                +{template.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-brand-warm-brown mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{template.viewCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Edit3 className="w-3 h-3" />
              <span>{template.editCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bookmark className="w-3 h-3" />
              <span>{template.bookmarkCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(template.createdAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handlePublishToggle}
            disabled={isPublishing}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-brand-warm-brown text-white rounded-lg hover:bg-brand-charcoal transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : template.isPublished ? (
              <div className="w-4 h-4 text-white">●</div>
            ) : (
              <div className="w-4 h-4 text-white">○</div>
            )}
            {isPublishing 
              ? (template.isPublished ? "Unpublishing..." : "Publishing...")
              : (template.isPublished ? "Unpublish" : "Publish")
            }
          </button>
          <button
            onClick={handleEditTemplate}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-brand-warm-brown text-brand-warm-brown rounded-lg hover:bg-brand-warm-brown hover:text-white transition-colors text-sm font-medium"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Edit Template Modal */}
      <EditTemplateModal
        template={template}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Template Modal */}
      <DeleteTemplateModal
        template={template}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
};

export default AdminTemplateCard;
