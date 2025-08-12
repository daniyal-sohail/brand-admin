"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { 
  User, 
  Mail, 
  Shield, 
  Calendar,
  CheckCircle,
  XCircle,
  Bookmark,
  Download,
  History,
  Edit3,
  Save,
  Loader2,
  AlertCircle,
  Upload,
  Camera,
  X
} from "lucide-react";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { user, isLoggedIn, role, putAuthData, refreshUserData, apiAuthLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  const [errors, setErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || ""
      });
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
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

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      
      if (selectedImage) {
        formDataToSend.append('profileImage', selectedImage);
      }

      const result = await putAuthData('/user/me', formDataToSend);

      if (result?.status === 200) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setSelectedImage(null);
        setImagePreview(null);
        
        // Refresh user data to show the latest changes
        await refreshUserData();
      } else {
        toast.error(result?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || ""
    });
    setErrors({});
    setSelectedImage(null);
    setImagePreview(null);
    setIsEditing(false);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="container-width fade-in p-6">
        <div className="text-center py-16">
          <User className="w-20 h-20 text-brand-warm-brown mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-brand-charcoal mb-4">Please Log In</h2>
          <p className="text-brand-warm-brown">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-width fade-in p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center">
          <div className="bg-brand-beige p-2 sm:p-3 rounded-xl">
            <User className="text-brand-warm-brown w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="ml-2 sm:ml-3">
            <h1 className="text-2xl sm:text-3xl font-semibold heading-primary">Profile</h1>
            <p className="text-xs sm:text-sm text-brand-warm-brown">Manage your account information</p>
          </div>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-3 sm:px-4 py-2 bg-brand-warm-brown text-white rounded-lg hover:bg-brand-charcoal transition-colors font-medium text-sm sm:text-base"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Card */}
        <div className="lg:col-span-2">
          <div className="bg-brand-cream rounded-2xl shadow-xl border-2 border-brand-beige overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-brand-beige to-brand-cream p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  {/* Profile Image Section */}
                  <div className="relative mr-4">
                    {isEditing ? (
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-brand-warm-brown overflow-hidden">
                          {imagePreview ? (
                            <Image 
                              src={imagePreview} 
                              alt="Profile preview" 
                              width={80}
                              height={80}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <User className="w-10 h-10 text-brand-warm-brown" />
                          )}
                        </div>
                        <label className="absolute -bottom-1 -right-1 bg-brand-warm-brown text-white p-1 rounded-full cursor-pointer hover:bg-brand-charcoal transition-colors">
                          <Camera className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        {imagePreview && (
                          <button
                            onClick={handleRemoveImage}
                            className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-brand-warm-brown">
                        <User className="w-10 h-10 text-brand-warm-brown" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-brand-charcoal">{user?.name || "User"}</h2>
                    <p className="text-brand-warm-brown">{user?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    role === "ADMIN" 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {role}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">
                    Full Name *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-warm-brown ${
                        errors.name ? 'border-red-300' : 'border-brand-beige'
                      }`}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-brand-charcoal font-medium">{user?.name || "Not provided"}</p>
                  )}
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">
                    Email Address
                  </label>
                  <p className="text-brand-charcoal font-medium">{user?.email || "Not provided"}</p>
                  <p className="text-xs text-brand-warm-brown mt-1">Email cannot be changed</p>
                </div>

                {/* Account Status */}
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">
                    Account Status
                  </label>
                  <div className="flex items-center gap-2">
                    {user?.isVerified ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      user?.isVerified ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {user?.isVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>

                {/* Canva Connection */}
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">
                    Canva Connection
                  </label>
                  <div className="flex items-center gap-2">
                    {user?.canvaConnected ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      user?.canvaConnected ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {user?.canvaConnected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                </div>

                {/* Member Since */}
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-brand-warm-brown" />
                    <span className="text-brand-charcoal">
                      {user?.createdAt ? formatDate(user.createdAt) : "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Form Actions */}
                {isEditing && (
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-beige">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-brand-warm-brown border border-brand-beige rounded-lg hover:bg-brand-beige transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={apiAuthLoading}
                      className="inline-flex items-center px-4 py-2 bg-brand-warm-brown text-white rounded-lg hover:bg-brand-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {apiAuthLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Account Stats */}
          <div className="bg-brand-cream rounded-2xl shadow-xl border-2 border-brand-beige p-6">
            <h3 className="text-lg font-semibold text-brand-charcoal mb-4">Account Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-brand-warm-brown" />
                  <span className="text-brand-charcoal">Template Bookmarks</span>
                </div>
                <span className="font-semibold text-brand-charcoal">
                  {user?.templateBookmarks?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-brand-warm-brown" />
                  <span className="text-brand-charcoal">Downloads</span>
                </div>
                <span className="font-semibold text-brand-charcoal">
                  {user?.downloads?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-brand-warm-brown" />
                  <span className="text-brand-charcoal">Template History</span>
                </div>
                <span className="font-semibold text-brand-charcoal">
                  {user?.templateHistory?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-brand-cream rounded-2xl shadow-xl border-2 border-brand-beige p-6">
            <h3 className="text-lg font-semibold text-brand-charcoal mb-4">Account Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-brand-warm-brown">User ID:</span>
                <p className="font-mono text-brand-charcoal text-xs mt-1">
                  {user?._id || "Not available"}
                </p>
              </div>
              <div>
                <span className="text-brand-warm-brown">Last Updated:</span>
                <p className="text-brand-charcoal">
                  {user?.updatedAt ? formatDate(user.updatedAt) : "Unknown"}
                </p>
              </div>
              <div>
                <span className="text-brand-warm-brown">Interests:</span>
                <p className="text-brand-charcoal">
                  {user?.interests?.length > 0 ? user.interests.join(", ") : "None specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
