"use client";
import React, { useEffect, useCallback } from "react";
import { useCanva } from "@/context/CanvaContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { 
  Settings, 
  Palette, 
  Link2, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

const SettingsPage = () => {
  const { 
    canvaLoading, 
    canvaError, 
    isConnected, 
    fetchCanvaData,
    setCanvaError,
    setIsConnected
  } = useCanva();
  
  const { user } = useAuth();

  const checkCanvaConnection = useCallback(async () => {
    const result = await fetchCanvaData("/canva/connection-status");
    if (result?.connected) {
      setIsConnected(result?.connected|| false);
    }
  }, [fetchCanvaData, setIsConnected]);

  useEffect(() => {
    // Check Canva connection status on component mount
    checkCanvaConnection();
  }, [checkCanvaConnection]);

  const handleConnectCanva = async () => {
    const result = await fetchCanvaData("/canva/connect");
    if (result?.authUrl) {
      // Open the auth URL in a new tab
      window.open(result?.authUrl, '_blank', 'noopener,noreferrer');
      toast.success("Redirecting to Canva for authorization...");
    } else {
      toast.error(result?.message || "Failed to connect to Canva");
    }
  };



  return (
    <div className="container-width fade-in p-6">
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <div className="bg-brand-beige p-2 sm:p-3 rounded-xl">
          <Settings className="text-brand-warm-brown w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold ml-2 sm:ml-3 heading-primary">Settings</h1>
      </div>

      {/* Welcome Card */}
      <div className="bg-brand-beige p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="bg-white p-2 sm:p-3 rounded-xl flex-shrink-0">
          <Palette className="text-brand-warm-brown w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold heading-primary mb-1">Manage Your Settings</h2>
          <p className="body-text text-brand-warm-brown text-sm sm:text-base">
            Configure your account settings and integrations.
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6">
        {/* Canva Integration Section */}
        <div className="bg-brand-beige rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-brand-light-beige">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-lg mr-3">
                  <Link2 className="text-brand-warm-brown" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-charcoal">Canva Integration</h3>
                  <p className="text-sm text-brand-warm-brown">
                    Connect your Canva account to access templates and designs
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {isConnected ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle className="w-3 h-3 mr-1" />
                    Not Connected
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {canvaError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800 mb-1">
                      Connection Error
                    </h4>
                    <p className="text-sm text-red-700">{canvaError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-brand-charcoal mb-1">
                  Canva Account Status
                </h4>
                <p className="text-sm text-brand-warm-brown">
                  {isConnected 
                    ? "Your Canva account is connected and ready to use." 
                    : "Connect your Canva account to access templates and designs."
                  }
                </p>
              </div>
              
              <div className="ml-4">
                {!isConnected && (
                  <button
                    onClick={handleConnectCanva}
                    disabled={canvaLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-warm-brown hover:bg-brand-warm-brown/90 focus:outline-none focus:ring-2 focus:ring-brand-warm-brown focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {canvaLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Link2 className="w-4 h-4 mr-2" />
                    )}
                    Connect to Canva
                  </button>
                )}
              </div>
            </div>

            {isConnected && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-green-800 mb-1">
                      Successfully Connected
                    </h4>
                    <p className="text-sm text-green-700">
                      You can now access Canva templates and designs directly from your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Information Section */}
        <div className="bg-brand-beige rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-brand-light-beige">
            <div className="flex items-center">
              <div className="bg-white p-2 rounded-lg mr-3">
                <Settings className="text-brand-warm-brown" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brand-charcoal">Account Information</h3>
                <p className="text-sm text-brand-warm-brown">
                  Your account details and preferences
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between py-3 border-b border-brand-light-beige">
                <div>
                  <h4 className="text-sm font-medium text-brand-charcoal">Name</h4>
                  <p className="text-sm text-brand-warm-brown">{user?.name || 'Not set'}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-brand-light-beige">
                <div>
                  <h4 className="text-sm font-medium text-brand-charcoal">Email</h4>
                  <p className="text-sm text-brand-warm-brown">{user?.email || 'Not set'}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <h4 className="text-sm font-medium text-brand-charcoal">Role</h4>
                  <p className="text-sm text-brand-warm-brown capitalize">{user?.role?.toLowerCase() || 'Not set'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default SettingsPage;
