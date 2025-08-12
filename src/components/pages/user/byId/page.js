"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Shield, 
  CheckCircle, 
  XCircle,
  Calendar,
  Bookmark,
  Download,
  Palette,
  Settings,
  Activity,
  Clock,
  Star
} from "lucide-react";
import Link from "next/link";

const UserDetailPage = () => {
  const { currentUser, userLoading, userError, fetchUserById } = useUser();
  const params = useParams();
  const router = useRouter();
  const userId = params.id;

  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    }
  }, [userId, fetchUserById]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role) => {
    if (role === "ADMIN") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
          <Shield className="w-4 h-4 mr-1" />
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
        <User className="w-4 h-4 mr-1" />
        User
      </span>
    );
  };

  const getVerificationBadge = (isVerified) => {
    if (isVerified) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
        <XCircle className="w-4 h-4 mr-1" />
        Unverified
      </span>
    );
  };

  if (userLoading) {
    return (
      <div className="container-width fade-in p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-warm-brown"></div>
        </div>
      </div>
    );
  }

  if (userError || !currentUser) {
    return (
      <div className="container-width fade-in p-6">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{userError || "User not found"}</p>
          <button 
            onClick={() => router.back()}
            className="bg-brand-warm-brown text-white px-4 py-2 rounded hover:opacity-90 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-width fade-in p-6">
      {/* Header with Back Button */}
      <div className="flex items-center mb-6">
        <Link
          href="/admin/user"
          className="flex items-center text-brand-warm-brown hover:text-brand-charcoal transition-colors mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Users
        </Link>
        <div className="bg-brand-beige p-3 rounded-xl">
          <User className="text-brand-warm-brown" />
        </div>
        <h1 className="text-3xl font-semibold ml-3 heading-primary">User Details</h1>
      </div>

      {/* User Profile Card */}
      <div className="bg-brand-beige p-6 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-brand-warm-brown flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-charcoal mb-2">
                {currentUser.name}
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-brand-warm-brown" />
                <span className="text-brand-warm-brown">{currentUser.email}</span>
              </div>
              <div className="flex gap-2">
                {getRoleBadge(currentUser.role)}
                {getVerificationBadge(currentUser.isVerified)}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-brand-charcoal">
                {currentUser.bookmarks?.length || 0}
              </div>
              <div className="text-sm text-brand-warm-brown">Bookmarks</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-brand-charcoal">
                {currentUser.downloads?.length || 0}
              </div>
              <div className="text-sm text-brand-warm-brown">Downloads</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-brand-charcoal">
                {currentUser.templateHistory?.length || 0}
              </div>
              <div className="text-sm text-brand-warm-brown">Templates</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-brand-charcoal">
                {currentUser.canvaTemplateBookmarks?.length || 0}
              </div>
              <div className="text-sm text-brand-warm-brown">Canva Bookmarks</div>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Information */}
        <div className="bg-brand-beige p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-4">
            <Settings className="w-5 h-5 text-brand-warm-brown mr-2" />
            <h3 className="text-lg font-semibold text-brand-charcoal">Account Information</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-brand-light-beige">
              <span className="text-brand-warm-brown">User ID:</span>
              <span className="text-brand-charcoal font-mono text-sm">{currentUser._id}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-brand-light-beige">
              <span className="text-brand-warm-brown">Role:</span>
              <span className="text-brand-charcoal">{currentUser.role}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-brand-light-beige">
              <span className="text-brand-warm-brown">Verification Status:</span>
              <span className="text-brand-charcoal">
                {currentUser.isVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-brand-light-beige">
              <span className="text-brand-warm-brown">Canva Connected:</span>
              <span className="text-brand-charcoal">
                {currentUser.canvaConnected ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-brand-warm-brown">Interests:</span>
              <span className="text-brand-charcoal">
                {currentUser.interests?.length > 0 ? currentUser.interests.join(", ") : "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Activity Information */}
        <div className="bg-brand-beige p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-4">
            <Activity className="w-5 h-5 text-brand-warm-brown mr-2" />
            <h3 className="text-lg font-semibold text-brand-charcoal">Activity Information</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-brand-light-beige">
              <span className="text-brand-warm-brown">Member Since:</span>
              <span className="text-brand-charcoal text-sm">
                {formatDate(currentUser.createdAt)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-brand-light-beige">
              <span className="text-brand-warm-brown">Last Updated:</span>
              <span className="text-brand-charcoal text-sm">
                {formatDate(currentUser.updatedAt)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-brand-light-beige">
              <span className="text-brand-warm-brown">Total Bookmarks:</span>
              <span className="text-brand-charcoal">{currentUser.bookmarks?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-brand-light-beige">
              <span className="text-brand-warm-brown">Total Downloads:</span>
              <span className="text-brand-charcoal">{currentUser.downloads?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-brand-warm-brown">Template History:</span>
              <span className="text-brand-charcoal">{currentUser.templateHistory?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-brand-beige p-6 rounded-xl shadow-sm mt-6">
        <div className="flex items-center mb-4">
          <Clock className="w-5 h-5 text-brand-warm-brown mr-2" />
          <h3 className="text-lg font-semibold text-brand-charcoal">Recent Activity</h3>
        </div>
        
        {currentUser.templateHistory?.length > 0 ? (
          <div className="space-y-3">
            {currentUser.templateHistory.slice(0, 5).map((template, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center">
                  <Palette className="w-4 h-4 text-brand-warm-brown mr-2" />
                  <span className="text-brand-charcoal">Template used</span>
                </div>
                <span className="text-sm text-brand-warm-brown">
                  {formatDate(template.createdAt || currentUser.createdAt)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-brand-warm-brown mx-auto mb-2 opacity-50" />
            <p className="text-brand-warm-brown">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailPage; 