"use client";
import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { 
  AlertTriangle, 
  X, 
  Trash2, 
  User, 
  Mail,
  Shield,
  Users,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "react-toastify";

const DeleteUserModal = ({ user, isOpen, onClose, onSuccess }) => {
  const { deleteUserData, userLoading } = useUser();
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (confirmText !== user.name) {
      toast.error("Please type the user's name exactly to confirm deletion");
      return;
    }

    const result = await deleteUserData(user._id);
    if (result?.status === 200) {
      toast.success("User deleted successfully");
      onSuccess();
      onClose();
    } else {
      toast.error(result?.message || "Failed to delete user");
    }
  };

  const getRoleBadge = (role) => {
    if (role === "ADMIN") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <Users className="w-3 h-3 mr-1" />
        User
      </span>
    );
  };

  const getVerificationBadge = (isVerified) => {
    if (isVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />
        Unverified
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-cream rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-beige">
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-xl mr-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-brand-charcoal">Delete User</h2>
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
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  This action cannot be undone
                </h3>
                <p className="text-sm text-red-700">
                  This will permanently delete the user account and all associated data.
                </p>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="bg-brand-beige rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <div className="h-12 w-12 rounded-full bg-brand-warm-brown flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brand-charcoal">{user.name}</h3>
                <div className="flex items-center text-sm text-brand-warm-brown">
                  <Mail className="w-3 h-3 mr-1" />
                  {user.email}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {getRoleBadge(user.role)}
              {getVerificationBadge(user.isVerified)}
            </div>
          </div>

          {/* Confirmation */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Type <span className="font-bold text-red-600">{user.name}</span> to confirm deletion:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Type "${user.name}" to confirm`}
              className="w-full px-3 py-2 border border-brand-beige rounded-lg bg-brand-light-beige focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={userLoading}
              className="flex-1 px-4 py-2 border border-brand-beige text-brand-warm-brown rounded-lg hover:bg-brand-light-beige transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={userLoading || confirmText !== user.name}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {userLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete User
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal; 