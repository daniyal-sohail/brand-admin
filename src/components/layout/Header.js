import React, { useState } from 'react';
import { Menu, Bell, Search, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

// Header Component
const Header = ({ onMenuClick }) => {
  const { user, role, isLoggedIn, logOut } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    logOut();
    setShowProfileMenu(false);
  };

  return (
    <header className="bg-brand-cream border-b border-brand-beige sticky top-0 z-40 lg:ml-80 transition-all duration-300 ease-in-out">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden mr-3 text-brand-charcoal hover:text-brand-warm-brown transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="lg:hidden">
              <div className="h-8 w-32 bg-brand-beige rounded flex items-center justify-center">
                <span className="text-sm font-bold text-brand-charcoal font-poppins">Admin Panel</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <h1 className="font-semibold text-xl text-brand-charcoal font-poppins">
                Admin Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mobile search button removed */}
            <button className="relative text-brand-charcoal hover:text-brand-warm-brown transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                <span className="block h-2 w-2 bg-brand-cream rounded-full"></span>
              </span>
            </button>
            {/* <button className="hidden sm:block text-brand-charcoal hover:text-brand-warm-brown transition-colors">
              <Settings className="h-5 w-5" />
            </button> */}
            
            {/* Profile Section */}
            <div className="relative">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleProfileClick}
                  className="w-8 h-8 rounded-full bg-brand-beige flex items-center justify-center hover:bg-brand-warm-brown hover:text-white transition-colors cursor-pointer"
                >
                  <span className="text-sm font-bold text-brand-charcoal font-poppins">
                    {isLoggedIn && user?.name ? user.name[0].toUpperCase() : 'U'}
                  </span>
                </button>
                <div className="text-brand-charcoal font-medium hidden sm:flex flex-col text-sm font-poppins">
                  {isLoggedIn && user ? (
                    <>
                      <span>{user.name}</span>
                      <span className="text-xs text-brand-warm-brown">{user.email}</span>
                      <span className="text-xs text-brand-warm-brown capitalize">{role}</span>
                    </>
                  ) : (
                    <span>Guest</span>
                  )}
                </div>
              </div>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-brand-cream rounded-lg shadow-xl border-2 border-brand-beige py-2 z-50">
                  <Link
                    href="/admin/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center px-4 py-2 text-brand-charcoal hover:bg-brand-beige transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay to close dropdown when clicking outside */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;
