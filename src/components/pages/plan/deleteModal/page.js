"use client";
import React from "react";
import { usePlan } from "@/context/PlanContext";
import { useAuth } from "@/context/AuthContext";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const DeletePlanModal = ({ isOpen, onClose, onSuccess, plan }) => {
  const { deletePlanData, planLoading } = usePlan();
  const { isLoggedIn, role } = useAuth();

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!plan?._id) {
      toast.error("Missing plan identifier");
      return;
    }

    if (!isLoggedIn) {
      toast.error("You must be logged in to delete plans");
      return;
    }
    if (role !== "ADMIN") {
      toast.error("Only administrators can delete plans");
      return;
    }

    const result = await deletePlanData(`/delete-plan/${plan._id}`);

    if (result?.status === 200) {
      toast.success("Plan deleted successfully");
      onSuccess?.();
      onClose?.();
    } else {
      if (result?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
      } else if (result?.status === 403) {
        toast.error("You don't have permission to delete plans");
      } else {
        toast.error(result?.message || "Failed to delete plan");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-cream rounded-2xl shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-beige">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-2 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-brand-charcoal">Delete Plan</h2>
              <p className="text-sm text-brand-warm-brown">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={planLoading}
            className="p-2 hover:bg-brand-beige rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-brand-warm-brown" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-brand-charcoal mb-2">
                Are you sure you want to delete the plan
                {" "}
                <span className="font-semibold">{plan?.name}</span>?
              </p>
              <p className="text-sm text-brand-warm-brown">
                This will permanently remove the plan and its pricing. Customers subscribed to this plan may be affected.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={planLoading}
            className="px-4 py-2 text-brand-warm-brown border border-brand-beige rounded-lg hover:bg-brand-beige transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={planLoading}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {planLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePlanModal;
