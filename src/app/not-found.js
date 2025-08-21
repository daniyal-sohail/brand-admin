"use client";
import React from "react";
import Link from "next/link";
import { 
  AlertTriangle, 
  Home, 
  ArrowLeft
} from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center fade-in">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="bg-brand-beige p-6 rounded-full inline-block mb-4">
            <AlertTriangle className="w-16 h-16 text-brand-warm-brown mx-auto" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-brand-warm-brown mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-brand-charcoal mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-brand-warm-brown mb-6 max-w-md mx-auto">
            Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-brand-warm-brown text-white rounded-lg hover:bg-brand-charcoal transition-colors font-medium"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-brand-warm-brown text-brand-warm-brown rounded-lg hover:bg-brand-warm-brown hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage; 