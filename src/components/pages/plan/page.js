"use client";
import React, { useState, useEffect, useCallback } from "react";
import { usePlan } from "@/context/PlanContext";
import { useAuth } from "@/context/AuthContext";
import { 
  CreditCard, 
  CheckCircle,
  Plus,
  Edit3,
  Trash2,
  AlertCircle,
  RefreshCw,
  Loader2
} from "lucide-react";
import { toast } from "react-toastify";
import CreatePlanModal from "./createModal/page";
import UpdatePlanModal from "./updateModal/page";
import DeletePlanModal from "./deleteModal/page";

const PlanPage = () => {
  const { fetchPlanData, planLoading, planError } = usePlan();
  const { isLoggedIn, role } = useAuth();
  
  // State for plans
  const [plans, setPlans] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Fetch plans function
  const fetchPlans = useCallback(async () => {
    try {
      const result = await fetchPlanData("/plans/admin-plans");
      
      // API returns { status, data: [ ... ], message }
      if (result?.status === 200) {
        const items = Array.isArray(result.data) ? result.data : [];
        setPlans(items);
      } else {
        console.error("Plan fetch failed:", result);
      }
    } catch (error) {
      console.error("Plan fetch error:", error);
    }
  }, [fetchPlanData]);

  // Fetch plans on component mount
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Handle retry
  const handleRetry = () => {
    fetchPlans();
  };

  // Format price to currency
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 100); // Assuming amount is in cents
  };

  // Handle create plan
  const handleCreatePlan = () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to create plans");
      return;
    }
    
    if (role !== "ADMIN") {
      toast.error("Only administrators can create plans");
      return;
    }
    
    setIsCreateModalOpen(true);
  };

  // Handle create modal close
  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  // Handle create modal success
  const handleCreateModalSuccess = () => {
    fetchPlans(); // Refresh the plans list
  };

  // Handle edit plan
  const handleEditPlan = (plan) => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to update plans");
      return;
    }
    if (role !== "ADMIN") {
      toast.error("Only administrators can update plans");
      return;
    }
    setSelectedPlan(plan);
    setIsUpdateModalOpen(true);
  };

  // Handle delete plan
  const handleDeletePlan = (plan) => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to delete plans");
      return;
    }
    if (role !== "ADMIN") {
      toast.error("Only administrators can delete plans");
      return;
    }
    setSelectedPlan(plan);
    setIsDeleteModalOpen(true);
  };

  // Modal close handlers
  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
    setSelectedPlan(null);
  };
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedPlan(null);
  };

  // Modal success handlers
  const handleUpdateModalSuccess = () => {
    fetchPlans();
  };
  const handleDeleteModalSuccess = () => {
    fetchPlans();
  };

  return (
    <div className="container-width fade-in p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center">
          <div className="bg-brand-beige p-2 sm:p-3 rounded-xl">
            <CreditCard className="text-brand-warm-brown w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="ml-2 sm:ml-3">
            <h1 className="text-2xl sm:text-3xl font-semibold heading-primary">Plans</h1>
            {isLoggedIn && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs sm:text-sm text-brand-warm-brown">Logged in as:</span>
                <span className="text-xs sm:text-sm font-medium text-brand-charcoal">{role}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Create Plan Button */}
        <button
          onClick={handleCreatePlan}
          disabled={!isLoggedIn || role !== "ADMIN"}
          className="inline-flex items-center px-3 sm:px-4 py-2 bg-brand-warm-brown text-white rounded-lg hover:bg-brand-charcoal transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </button>
      </div>

      {/* Welcome Card */}
      <div className="bg-brand-beige p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="bg-white p-2 sm:p-3 rounded-xl flex-shrink-0">
          <CreditCard className="text-brand-warm-brown w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold heading-primary mb-1">Subscription Plans</h2>
          <p className="body-text text-brand-warm-brown text-sm sm:text-base">
            Manage your subscription plans. Create, edit, and organize pricing tiers for your customers.
          </p>
        </div>
      </div>

      {/* Error Display */}
      {planError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 mb-1">
                Error Loading Plans
              </h3>
              <p className="text-sm text-red-700 mb-3">{planError}</p>
              <button
                onClick={handleRetry}
                disabled={planLoading}
                className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {planLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Retry
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {planLoading && !planError && (
        <div className="bg-brand-beige border border-brand-warm-brown rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Loader2 className="w-5 h-5 text-brand-warm-brown mr-3 animate-spin" />
            <div>
              <h3 className="text-sm font-medium text-brand-charcoal mb-1">
                Loading Plans
              </h3>
              <p className="text-sm text-brand-warm-brown">
                Please wait while we fetch your subscription plans...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      {!planLoading && !planError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.length > 0 ? (
            plans.map((plan) => (
              <div
                key={plan._id}
                className="bg-brand-cream rounded-2xl shadow-xl border-2 border-brand-beige overflow-hidden hover:shadow-2xl hover:border-brand-warm-brown transition-all duration-300 transform hover:-translate-y-1 h-full min-h-[560px] flex flex-col"
              >
                {/* Plan Header */}
                <div className="bg-gradient-to-br from-brand-beige to-brand-cream p-8 relative">
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      plan.isActive 
                        ? 'bg-green-500 text-white shadow-lg' 
                        : 'bg-gray-500 text-white shadow-lg'
                    }`}>
                      {plan.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-2 text-brand-charcoal">{plan.name}</h3>
                    <div className="text-4xl font-bold mb-3 text-brand-charcoal">
                      {formatPrice(plan.amount)}
                      <span className="text-lg font-normal text-brand-warm-brown">/month</span>
                    </div>
                    <p className="text-brand-warm-brown text-sm leading-relaxed">
                      {plan.description}
                    </p>
                  </div>
                </div>

                {/* Plan Features */}
                <div className="p-8 flex-1 overflow-y-auto">
                  <h4 className="font-bold text-brand-charcoal mb-6 text-lg">What&apos;s Included</h4>
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-green-100 p-1 rounded-full mr-4 mt-0.5 flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-brand-charcoal font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Actions */}
                <div className="px-8 pb-8">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditPlan(plan)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 border-2 border-brand-warm-brown text-brand-warm-brown rounded-xl hover:bg-brand-warm-brown hover:text-white transition-all duration-200 text-sm font-semibold hover:shadow-lg"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Plan
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-400 transition-all duration-200 text-sm font-semibold"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Plan Footer */}
                <div className="px-8 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-200">
                  <div className="text-xs text-brand-charcoal space-y-1">
                    <div className="flex justify-between">
                      <span className="font-semibold text-brand-charcoal">Plan ID:</span>
                      <span className="font-mono text-brand-warm-brown">{plan._id.slice(-8)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-brand-charcoal">Slug:</span>
                      <span className="font-mono text-brand-warm-brown">{plan.slug}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-brand-charcoal">Stripe ID:</span>
                      <span className="font-mono text-brand-warm-brown">{plan.stripePriceId.slice(-8)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-brand-charcoal">Created:</span>
                      <span className="text-brand-warm-brown">{new Date(plan.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="text-center py-16 bg-brand-cream rounded-2xl shadow-lg border-2 border-dashed border-brand-warm-brown">
                <CreditCard className="w-20 h-20 text-brand-warm-brown mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-brand-charcoal mb-4">No Plans Found</h3>
                <p className="text-brand-warm-brown mb-8 max-w-md mx-auto text-lg">
                  You haven&apos;t created any subscription plans yet. Get started by creating your first plan to offer pricing tiers to your customers.
                </p>
                <button
                  onClick={handleCreatePlan}
                  className="inline-flex items-center px-6 py-3 bg-brand-warm-brown text-white rounded-xl hover:bg-brand-charcoal transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Plan
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Plan Modal */}
      <CreatePlanModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSuccess={handleCreateModalSuccess}
      />

      {/* Update Plan Modal */}
      <UpdatePlanModal
        isOpen={isUpdateModalOpen}
        onClose={handleUpdateModalClose}
        onSuccess={handleUpdateModalSuccess}
        plan={selectedPlan}
      />

      {/* Delete Plan Modal */}
      <DeletePlanModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onSuccess={handleDeleteModalSuccess}
        plan={selectedPlan}
      />
    </div>
  );
};

export default PlanPage;
