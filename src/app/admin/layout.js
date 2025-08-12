"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Loader2 } from "lucide-react";

const AdminDashboard = ({ children }) => {
  const { isLoggedIn, authChecked } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (authChecked && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, authChecked, router]);

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-warm-brown mx-auto mb-4" />
          <p className="text-brand-warm-brown">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login redirect
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-warm-brown mx-auto mb-4" />
          <p className="text-brand-warm-brown">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Show admin dashboard
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(true)} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="lg:ml-80 transition-all duration-300 ease-in-out flex-1">
        <div className="h-full bg-brand-light-beige">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;