"use client";
import React from "react";
import Link from "next/link";
import { 
  AlertTriangle, 
  Home, 
  ArrowLeft, 
  Search,
  RefreshCw 
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

        {/* Additional Help */}
        <div className="bg-brand-beige p-6 rounded-xl max-w-md mx-auto">
          <div className="flex items-center justify-center mb-3">
            <Search className="w-5 h-5 text-brand-warm-brown mr-2" />
            <h3 className="text-brand-charcoal font-semibold">Need Help?</h3>
          </div>
          <p className="text-brand-warm-brown text-sm mb-4">
            If you believe this is an error, please contact our support team or try refreshing the page.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-3 py-2 text-sm bg-brand-light-beige text-brand-warm-brown rounded-md hover:bg-brand-warm-brown hover:text-white transition-colors"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </button>
            <Link
              href="/admin"
              className="inline-flex items-center px-3 py-2 text-sm bg-brand-light-beige text-brand-warm-brown rounded-md hover:bg-brand-warm-brown hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-brand-warm-brown text-sm">
            Still having trouble?{" "}
            <Link 
              href="/contact" 
              className="text-brand-warm-brown hover:text-brand-charcoal underline font-medium"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 