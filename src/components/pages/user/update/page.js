"use client";
import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { 
  Edit3, 
  X, 
  Save, 
  User, 
  Mail,
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Settings
} from "lucide-react";
import { toast } from "react-toastify";

const UpdateUserModal = ({ user, isOpen, onClose, onSuccess }) => {
  const { putUserData, userLoading } = useUser();
  const [selectedRole, setSelectedRole] = useState(user?.role || "USER");

  const handleUpdate = async () => {
    if (selectedRole === user.role) {
      toast.info("No changes made");
      onClose();
      return;
    }

    const result = await putUserData(user._id, { role: selectedRole });
    if (result?.status === 200) {
      toast.success("User role updated successfully");
      onSuccess();
      onClose();
    } else {
      toast.error(result?.message || "Failed to update user");
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
            <div className="bg-blue-100 p-2 rounded-xl mr-3">
              <Edit3 className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-brand-charcoal">Update User</h2>
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

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-brand-charcoal mb-3">
              <div className="flex items-center">
                <Settings className="w-4 h-4 mr-2 text-brand-warm-brown" />
                Select User Role
              </div>
            </label>
            
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-brand-beige rounded-lg cursor-pointer hover:bg-brand-light-beige transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="USER"
                  checked={selectedRole === "USER"}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mr-3 text-brand-warm-brown focus:ring-brand-warm-brown"
                />
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-brand-charcoal">User</div>
                    <div className="text-sm text-brand-warm-brown">Standard user access</div>
                  </div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-brand-beige rounded-lg cursor-pointer hover:bg-brand-light-beige transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  checked={selectedRole === "ADMIN"}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mr-3 text-brand-warm-brown focus:ring-brand-warm-brown"
                />
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-brand-charcoal">Admin</div>
                    <div className="text-sm text-brand-warm-brown">Full administrative access</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Current vs New Role */}
          {selectedRole !== user.role && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 mb-1">
                    Role Change
                  </h3>
                  <p className="text-sm text-yellow-700">
                    Changing from <span className="font-semibold">{user.role}</span> to <span className="font-semibold">{selectedRole}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

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
              onClick={handleUpdate}
              disabled={userLoading || selectedRole === user.role}
              className="flex-1 px-4 py-2 bg-brand-warm-brown text-white rounded-lg hover:bg-brand-warm-brown/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {userLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update User
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserModal; 