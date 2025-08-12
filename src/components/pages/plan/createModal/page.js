"use client";
import React, { useState } from "react";
import { usePlan } from "@/context/PlanContext";
import { useAuth } from "@/context/AuthContext";
import { 
  X, 
  Save, 
  Plus,
  AlertCircle,
  Loader2,
  DollarSign,
  Tag,
  FileText,
  CheckSquare
} from "lucide-react";
import { toast } from "react-toastify";

const CreatePlanModal = ({ isOpen, onClose, onSuccess }) => {
  const { postPlanData, planLoading } = usePlan();
  const { isLoggedIn, role } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    amount: "",
    features: [""] // Start with one empty feature
  });

  const [errors, setErrors] = useState({});

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Handle name change and auto-generate slug
  const handleNameChange = (value) => {
    setFormData(prev => ({ 
      ...prev, 
      name: value,
      slug: generateSlug(value)
    }));
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: "" }));
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Handle feature changes
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
    
    if (errors.features) {
      setErrors(prev => ({ ...prev, features: "" }));
    }
  };

  // Add new feature field
  const addFeature = () => {
    setFormData(prev => ({ 
      ...prev, 
      features: [...prev.features, ""] 
    }));
  };

  // Remove feature field
  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, features: newFeatures }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Plan name is required";
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Valid amount is required";
    }
    
    const validFeatures = formData.features.filter(f => f.trim());
    if (validFeatures.length === 0) {
      newErrors.features = "At least one feature is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check authentication
    if (!isLoggedIn) {
      toast.error("You must be logged in to create plans");
      return;
    }

    if (role !== "ADMIN") {
      toast.error("Only administrators can create plans");
      return;
    }

    // Prepare payload
    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      amount: parseInt(formData.amount) * 100, // Convert to cents
      features: formData.features.filter(f => f.trim()) // Remove empty features
    };

    const result = await postPlanData("/plans", payload);

    if (result?.status === 201) {
      toast.success("Plan created successfully");
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        name: "",
        slug: "",
        description: "",
        amount: "",
        features: [""]
      });
      setErrors({});
    } else {
      // Handle different error scenarios
      if (result?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
      } else if (result?.status === 403) {
        toast.error("You don't have permission to create plans");
      } else {
        toast.error(result?.message || "Failed to create plan");
      }
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!planLoading) {
      onClose();
      // Reset form
      setFormData({
        name: "",
        slug: "",
        description: "",
        amount: "",
        features: [""]
      });
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-cream rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-beige">
          <div className="flex items-center gap-3">
            <div className="bg-brand-beige p-2 rounded-lg">
              <Plus className="w-5 h-5 text-brand-warm-brown" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-brand-charcoal">Create New Plan</h2>
              <p className="text-sm text-brand-warm-brown">Add a new subscription plan</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={planLoading}
            className="p-2 hover:bg-brand-beige rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-brand-warm-brown" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Plan Name */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Plan Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown ${
                errors.name ? 'border-red-300' : 'border-brand-beige'
              }`}
              placeholder="Enter plan name (e.g., Pro Plan)"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown ${
                errors.slug ? 'border-red-300' : 'border-brand-beige'
              }`}
              placeholder="Enter slug (e.g., pro-plan)"
            />
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.slug}
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
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown ${
                errors.description ? 'border-red-300' : 'border-brand-beige'
              }`}
              placeholder="Describe what this plan includes"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Monthly Price (USD) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-brand-warm-brown" />
              </div>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                min="0"
                step="0.01"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown ${
                  errors.amount ? 'border-red-300' : 'border-brand-beige'
                }`}
                placeholder="49.99"
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.amount}
              </p>
            )}
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Features *
            </label>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CheckSquare className="h-5 w-5 text-brand-warm-brown" />
                    </div>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-brand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown"
                      placeholder="Enter feature (e.g., Unlimited projects)"
                    />
                  </div>
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center px-3 py-2 border border-brand-warm-brown text-brand-warm-brown rounded-lg hover:bg-brand-warm-brown hover:text-white transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Feature
              </button>
            </div>
            {errors.features && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.features}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-beige">
            <button
              type="button"
              onClick={handleClose}
              disabled={planLoading}
              className="px-4 py-2 text-brand-warm-brown border border-brand-beige rounded-lg hover:bg-brand-beige transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={planLoading}
              className="inline-flex items-center px-4 py-2 bg-brand-warm-brown text-white rounded-lg hover:bg-brand-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {planLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlanModal;
