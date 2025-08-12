"use client";
import React, { useEffect, useState } from "react";
import { usePlan } from "@/context/PlanContext";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  Save,
  AlertCircle,
  Loader2,
  DollarSign,
  CheckSquare,
  Pencil
} from "lucide-react";
import { toast } from "react-toastify";

const UpdatePlanModal = ({ isOpen, onClose, onSuccess, plan }) => {
  const { patchPlanData, planLoading } = usePlan();
  const { isLoggedIn, role } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    amount: "",
    features: [""],
    isActive: true
  });
  const [errors, setErrors] = useState({});

  // Initialize form when plan changes/opened
  useEffect(() => {
    if (isOpen && plan) {
      setFormData({
        name: plan.name || "",
        slug: plan.slug || "",
        description: plan.description || "",
        amount: plan.amount ? String(plan.amount / 100) : "",
        features: Array.isArray(plan.features) && plan.features.length > 0 ? plan.features : [""],
        isActive: plan.isActive !== undefined ? plan.isActive : true
      });
      setErrors({});
    }
  }, [isOpen, plan]);

  const generateSlug = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleNameChange = (value) => {
    setFormData((prev) => ({ ...prev, name: value, slug: generateSlug(value) }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, features: updated }));
    if (errors.features) setErrors((prev) => ({ ...prev, features: "" }));
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      setFormData((prev) => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Plan name is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = "Valid amount is required";
    const validFeatures = formData.features.filter((f) => f.trim());
    if (validFeatures.length === 0) newErrors.features = "At least one feature is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!plan?._id) {
      toast.error("Missing plan identifier");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isLoggedIn) {
      toast.error("You must be logged in to update plans");
      return;
    }
    if (role !== "ADMIN") {
      toast.error("Only administrators can update plans");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      amount: Math.round(parseFloat(formData.amount) * 100),
      features: formData.features.filter((f) => f.trim()),
      isActive: formData.isActive
    };

    const result = await patchPlanData(`/plans/${plan._id}`, payload);

    if (result?.status === 200) {
      toast.success("Plan updated successfully");
      onSuccess?.();
      onClose?.();
    } else {
      if (result?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
      } else if (result?.status === 403) {
        toast.error("You don't have permission to update plans");
      } else {
        toast.error(result?.message || "Failed to update plan");
      }
    }
  };

  const handleClose = () => {
    if (!planLoading) onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-cream rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-beige">
          <div className="flex items-center gap-3">
            <div className="bg-brand-beige p-2 rounded-lg">
              <Pencil className="w-5 h-5 text-brand-warm-brown" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-brand-charcoal">Update Plan</h2>
              <p className="text-sm text-brand-warm-brown">Modify the subscription plan details</p>
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
            <label className="block text-sm font-medium text-brand-charcoal mb-2">Plan Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown ${errors.name ? "border-red-300" : "border-brand-beige"}`}
              placeholder="Enter plan name"
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
            <label className="block text-sm font-medium text-brand-charcoal mb-2">Slug *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange("slug", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown ${errors.slug ? "border-red-300" : "border-brand-beige"}`}
              placeholder="Enter slug"
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
            <label className="block text-sm font-medium text-brand-charcoal mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown ${errors.description ? "border-red-300" : "border-brand-beige"}`}
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
            <label className="block text-sm font-medium text-brand-charcoal mb-2">Monthly Price (USD) *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-brand-warm-brown" />
              </div>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                min="0"
                step="0.01"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown ${errors.amount ? "border-red-300" : "border-brand-beige"}`}
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
            <label className="block text-sm font-medium text-brand-charcoal mb-2">Features *</label>
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
                      placeholder="Enter feature"
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

          {/* Active Status */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">Plan Status</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isActive"
                  value="true"
                  checked={formData.isActive === true}
                  onChange={() => handleInputChange('isActive', true)}
                  className="w-4 h-4 text-brand-warm-brown bg-brand-beige border-brand-warm-brown focus:ring-brand-warm-brown"
                />
                <span className="ml-2 text-brand-charcoal">Active</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isActive"
                  value="false"
                  checked={formData.isActive === false}
                  onChange={() => handleInputChange('isActive', false)}
                  className="w-4 h-4 text-brand-warm-brown bg-brand-beige border-brand-warm-brown focus:ring-brand-warm-brown"
                />
                <span className="ml-2 text-brand-charcoal">Inactive</span>
              </label>
            </div>
            <p className="text-xs text-brand-warm-brown mt-1">
              Active plans are visible to customers, inactive plans are hidden
            </p>
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
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePlanModal;
