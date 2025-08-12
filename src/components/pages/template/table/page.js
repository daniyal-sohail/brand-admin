"use client";
import React from "react";
import { useCanva } from "@/context/CanvaContext";
import { 
  ExternalLink, 
  Eye, 
  Calendar,
  FileText,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import Image from "next/image";

const TemplateTable = ({ templates, canvaLoading, onTemplateClick }) => {
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewTemplate = (template) => {
    if (template.urls && template.urls.view_url) {
      window.open(template.urls.view_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleEditTemplate = (template) => {
    if (template.urls && template.urls.edit_url) {
      window.open(template.urls.edit_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (canvaLoading) {
    return (
      <div className="bg-brand-beige rounded-xl shadow-sm overflow-hidden">
        <div className="p-8 flex justify-center items-center">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-brand-warm-brown" />
            <span className="text-brand-warm-brown">Loading templates...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="bg-brand-beige rounded-xl shadow-sm overflow-hidden">
        <div className="p-8 text-center">
          <div className="bg-white p-4 rounded-xl inline-block mb-4">
            <FileText className="w-8 h-8 text-brand-warm-brown mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-brand-charcoal mb-2">No Templates Found</h3>
          <p className="text-brand-warm-brown">
            No templates match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-beige rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-brand-light-beige">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-warm-brown uppercase tracking-wider">
                Template
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-warm-brown uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-warm-brown uppercase tracking-wider">
                Pages
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-warm-brown uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-warm-brown uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
                           <tbody className="divide-y divide-brand-light-beige">
                   {templates.map((template) => (
                     <tr 
                       key={template.id} 
                       className="hover:bg-brand-light-beige transition-colors cursor-pointer"
                       onClick={() => onTemplateClick(template)}
                     >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16">
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-white border border-brand-light-beige">
                        {template.thumbnail && template.thumbnail.url ? (
                          <Image
                            src={template.thumbnail.url}
                            alt={template.title}
                            width={template.thumbnail.width || 64}
                            height={template.thumbnail.height || 64}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-brand-light-beige">
                            <ImageIcon className="w-6 h-6 text-brand-warm-brown" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <div className="text-sm font-medium text-brand-charcoal truncate">
                      {template.title}
                    </div>
                    <div className="text-xs text-brand-warm-brown">
                      ID: {template.id}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-brand-warm-brown mr-2" />
                    <span className="text-sm text-brand-charcoal">
                      {template.page_count} {template.page_count === 1 ? 'page' : 'pages'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-warm-brown">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(template.created_at)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                                               <button
                             onClick={(e) => {
                               e.stopPropagation();
                               handleViewTemplate(template);
                             }}
                             className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-brand-warm-brown bg-white hover:bg-brand-light-beige transition-colors"
                             title="View Template"
                           >
                             <Eye className="w-3 h-3 mr-1" />
                             View
                           </button>
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               handleEditTemplate(template);
                             }}
                             className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                             title="Edit Template"
                           >
                             <ExternalLink className="w-3 h-3 mr-1" />
                             Edit
                           </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TemplateTable; 