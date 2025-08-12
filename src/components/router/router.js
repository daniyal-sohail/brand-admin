"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Shield, AlertTriangle, UserCheck, Lock } from "lucide-react";

const authPages = ["/login", "/register"];
const homePage = "/";

const RouterGuard = ({ children }) => {
  const { isLoggedIn, role, authChecked } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showUnauthorized, setShowUnauthorized] = useState(false);

  // Check if user has admin privileges
  const hasAdminAccess = role === "ADMIN";

  useEffect(() => {
    if (!authChecked) return; // Wait for auth check

    // If not logged in, block all /admin/* and home, redirect to /login
    if (!isLoggedIn && (pathname.startsWith("/admin") || pathname === homePage)) {
      router.replace("/login");
      return;
    }

    // If logged in, block /login and /register, redirect to /admin
    if (isLoggedIn && authPages.includes(pathname)) {
      router.replace("/admin");
      return;
    }

    // After login, if on /login or /, redirect to /admin
    if (isLoggedIn && (pathname === "/login" || pathname === "/")) {
      router.replace("/admin");
      return;
    }

    // Check admin access for admin routes
    if (isLoggedIn && pathname.startsWith("/admin") && !hasAdminAccess) {
      setShowUnauthorized(true);
      return;
    }

    // Clear unauthorized message if user has access
    if (isLoggedIn && pathname.startsWith("/admin") && hasAdminAccess) {
      setShowUnauthorized(false);
    }
  }, [isLoggedIn, role, authChecked, pathname, router, hasAdminAccess]);

  // Show unauthorized message
  if (showUnauthorized) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center fade-in">
          {/* Access Denied Icon */}
          <div className="mb-8">
            <div className="bg-brand-beige p-6 rounded-full inline-block mb-4">
              <Shield className="w-16 h-16 text-brand-warm-brown mx-auto" />
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-brand-charcoal mb-4">
              Access Denied
            </h1>
            <h2 className="text-2xl font-semibold text-brand-warm-brown mb-4">
              403 - Forbidden
            </h2>
            <p className="text-lg text-brand-warm-brown mb-6 max-w-md mx-auto">
              You don&apos;t have permission to access this area. This admin dashboard is restricted to authorized personnel only.
            </p>
          </div>

          {/* Role Information */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="text-red-800 font-semibold">Insufficient Permissions</h3>
            </div>
            <p className="text-red-700 text-sm mb-4">
              Only users with <strong>ADMIN</strong> role can access this dashboard.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center text-green-700">
                <UserCheck className="w-4 h-4 mr-1" />
                <span>ADMIN</span>
              </div>
              <div className="flex items-center text-red-700">
                <Lock className="w-4 h-4 mr-1" />
                <span>USER</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-warm-brown text-white rounded-lg hover:bg-brand-charcoal transition-colors font-medium"
            >
              Go to Home
            </button>
            
            <button
              onClick={() => router.push("/login")}
              className="inline-flex items-center justify-center px-6 py-3 border border-brand-warm-brown text-brand-warm-brown rounded-lg hover:bg-brand-warm-brown hover:text-white transition-colors font-medium"
            >
              Try Different Account
            </button>
          </div>

          {/* Help Section */}
          <div className="bg-brand-beige p-6 rounded-xl max-w-md mx-auto">
            <div className="flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-brand-warm-brown mr-2" />
              <h3 className="text-brand-charcoal font-semibold">Need Admin Access?</h3>
            </div>
            <p className="text-brand-warm-brown text-sm mb-4">
              If you believe you should have access to this dashboard, please contact your system administrator.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center text-brand-warm-brown">
                <span className="w-2 h-2 bg-brand-warm-brown rounded-full mr-2"></span>
                Contact your administrator
              </div>
              <div className="flex items-center justify-center text-brand-warm-brown">
                <span className="w-2 h-2 bg-brand-warm-brown rounded-full mr-2"></span>
                Request role upgrade
              </div>
              <div className="flex items-center justify-center text-brand-warm-brown">
                <span className="w-2 h-2 bg-brand-warm-brown rounded-full mr-2"></span>
                Verify your account status
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-brand-warm-brown text-sm">
              For support, contact{" "}
              <a 
                href="mailto:admin@example.com" 
                className="text-brand-warm-brown hover:text-brand-charcoal underline font-medium"
              >
                admin@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Only render children if allowed
  if (!authChecked) return null; // Or a loading spinner
  if (!isLoggedIn && (pathname.startsWith("/admin") || pathname === homePage)) return null;
  if (isLoggedIn && authPages.includes(pathname)) return null;

  return children;
};

export default RouterGuard;
