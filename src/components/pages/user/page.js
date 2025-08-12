"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Mail, 
  Shield, 
  CheckCircle, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  UserCheck,
  Edit3,
  Trash2,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import DeleteUserModal from "./delete/page";
import UpdateUserModal from "./update/page";

const UserPage = () => {
  const { 
    userLoading, 
    userError, 
    fetchUserData,
    deleteUserData,
    putUserData,
    setUserError
  } = useUser();
  
  // Local state for users and pagination
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Function to fetch users with pagination
  const fetchUsers = useCallback(async (page = 1, limit = 10, search = "", verified = null) => {
    const params = { page, limit };
    if (search) params.search = search;
    if (verified !== null) params.verified = verified;
    
    const result = await fetchUserData("/user/admin/all", params);
    if (result?.status === 200 && result?.data) {
      setUsers(result.data.users || []);
      setPagination(result.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } else {
      setUsers([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        hasNextPage: false,
        hasPrevPage: false,
      });
    }
    return result;
  }, [fetchUserData]);

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers(currentPage, limit, debouncedSearchTerm, verifiedFilter || null);
  }, [currentPage, limit, debouncedSearchTerm, verifiedFilter, fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleFilterChange = (value) => {
    setVerifiedFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleUpdateUser = (user) => {
    setSelectedUser(user);
    setUpdateModalOpen(true);
  };

  const handleModalSuccess = () => {
    // Refresh the user list after successful operation
    fetchUsers(currentPage, limit, debouncedSearchTerm, verifiedFilter || null);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadge = (role) => {
    if (role === "ADMIN") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </span>
      );
    } else if (role === "MODERATOR") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <UserCheck className="w-3 h-3 mr-1" />
          Moderator
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <Users className="w-3 h-3 mr-1" />
        User
      </span>
    );
    }
  };

  const getVerificationBadge = (isVerified) => {
    if (isVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </span>
      );
    } else {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />
        Unverified
      </span>
      );
    }
  };

  // Custom pagination component
  const UserPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const startItem = (pagination.currentPage - 1) * limit + 1;
    const endItem = Math.min(pagination.currentPage * limit, pagination.totalUsers);

    const handlePageClick = (page) => {
      handlePageChange(page);
    };

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      
      if (pagination.totalPages <= maxVisible) {
        for (let i = 1; i <= pagination.totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (pagination.currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(pagination.totalPages);
        } else if (pagination.currentPage >= pagination.totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = pagination.totalPages - 3; i <= pagination.totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = pagination.currentPage - 1; i <= pagination.currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(pagination.totalPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="bg-brand-beige p-4 rounded-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Items Info */}
          <div className="text-sm text-brand-warm-brown">
            {userLoading ? (
              <span>Loading...</span>
            ) : (
              <span>
                Showing {startItem} to {endItem} of {pagination.totalUsers} users
              </span>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center space-x-1">
              {/* Previous Button */}
              <button
                onClick={() => handlePageClick(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-2 text-sm font-medium text-brand-warm-brown hover:bg-brand-light-beige rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="ml-1">Previous</span>
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' ? handlePageClick(page) : null}
                  disabled={page === '...'}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    page === pagination.currentPage
                      ? 'bg-brand-warm-brown text-white hover:bg-brand-charcoal'
                      : page === '...'
                      ? 'text-brand-warm-brown cursor-default'
                      : 'text-brand-warm-brown hover:bg-brand-light-beige'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePageClick(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-2 text-sm font-medium text-brand-warm-brown hover:bg-brand-light-beige rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <span className="mr-1">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (userLoading && users.length === 0) {
  return (
    <div className="container-width fade-in p-6">
      {/* Header Section */}
      <div className="flex items-center align-middle mb-6">
        <div className="bg-brand-beige p-3 rounded-xl">
          <Users className="text-brand-warm-brown" />
        </div>
          <h1 className="text-3xl font-semibold ml-3 heading-primary">
            User Management
          </h1>
        </div>

        {/* Loading State */}
        <div className="bg-brand-beige rounded-xl shadow-sm overflow-hidden">
          <div className="p-8 flex justify-center items-center">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-warm-brown"></div>
              <span className="text-brand-warm-brown">Loading users...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-width fade-in p-6">
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <div className="bg-brand-beige p-2 sm:p-3 rounded-xl">
          <Users className="text-brand-warm-brown w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold ml-2 sm:ml-3 heading-primary">
          User Management
        </h1>
      </div>

      {/* Welcome Card */}
      <div className="bg-brand-beige p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="bg-white p-2 sm:p-3 rounded-xl flex-shrink-0">
          <Users className="text-brand-warm-brown w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold heading-primary mb-1">
            Manage Users
          </h2>
          <p className="body-text text-brand-warm-brown text-sm sm:text-base">
            View, edit, and manage user accounts. Monitor user activity and manage permissions.
          </p>
        </div>
        <div className="text-center sm:text-right flex-shrink-0">
          <div className="text-xl sm:text-2xl font-bold text-brand-charcoal">
            {pagination.totalUsers}
          </div>
          <div className="text-xs sm:text-sm text-brand-warm-brown">Total Users</div>
        </div>
      </div>

      {/* Error Display */}
      {userError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-1">
                Error Loading Users
              </h3>
              <p className="text-sm text-red-700 mb-3">{userError}</p>
              <button
                onClick={() => fetchUsers(currentPage, limit, debouncedSearchTerm, verifiedFilter || null)}
                className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="bg-brand-beige p-6 rounded-xl mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-warm-brown w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name, email, or username..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-brand-light-beige rounded-lg focus:ring-2 focus:ring-brand-warm-brown focus:border-transparent"
              />
            </form>
          </div>

          {/* Filter */}
          <div className="lg:w-48">
            <select
              value={verifiedFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="w-full px-4 py-2 border border-brand-light-beige rounded-lg focus:ring-2 focus:ring-brand-warm-brown focus:border-transparent"
            >
              <option value="">All Users</option>
              <option value="true">Verified Only</option>
              <option value="false">Unverified Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-brand-beige rounded-xl shadow-sm overflow-hidden mb-6">
        {users.length === 0 ? (
          <div className="p-8 text-center">
            <div className="bg-white p-4 rounded-xl inline-block mb-4">
              <Users className="w-8 h-8 text-brand-warm-brown mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-brand-charcoal mb-2">
              No Users Found
            </h3>
            <p className="text-brand-warm-brown">
              No users match your current search criteria.
            </p>
          </div>
        ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand-light-beige">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-warm-brown uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-warm-brown uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-warm-brown uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-warm-brown uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-warm-brown uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
              <tbody className="bg-white divide-y divide-brand-light-beige">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-brand-light-beige transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-brand-warm-brown flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-brand-charcoal">
                            {user.name || 'No Name'}
                            </div>
                            <div className="text-sm text-brand-warm-brown flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getVerificationBadge(user.isVerified)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-warm-brown">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/user/${user._id}`}
                          className="inline-flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Link>
                          <button
                            onClick={() => handleUpdateUser(user)}
                          className="inline-flex items-center px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                          >
                            <Edit3 className="w-3 h-3 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                          className="inline-flex items-center px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        )}
      </div>

      {/* Pagination */}
      <UserPagination />

      {/* Modals */}
          <DeleteUserModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
            user={selectedUser}
            onSuccess={handleModalSuccess}
          />
      
          <UpdateUserModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
            user={selectedUser}
            onSuccess={handleModalSuccess}
          />
    </div>
  );
};

export default UserPage; 