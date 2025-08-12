
import React, { useState } from 'react';
import { X, LogOut, LayoutDashboard, Settings, Users, Grid3X3, HelpCircle, LayoutTemplate, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
// Sidebar Component
const Sidebar = ({ isOpen, onClose }) => {
  const { isLoggedIn, logOut } = useAuth();

  const navLinks = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/admin/user',
      label: 'Users',
      icon: Users,
    },
    {
      href: '/admin/template',
      label: 'Templates',
      icon: Grid3X3,
    },
    {
      href: '/admin/template/updated',
      label: 'Admin Templates',
      icon: LayoutTemplate,
    },
    {
      href: '/admin/plan',
      label: 'Plans',
      icon: CreditCard,
    },
    {
      href: '/admin/faq',
      label: 'FAQ',
      icon: HelpCircle,
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-brand-charcoal bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-brand-cream border-r border-brand-beige z-40 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 w-full bg-brand-cream border-b border-brand-beige flex items-center justify-center">
            <Image src="/images/brand-appeal-logo-wide-bw.svg" alt="Brand Appeal Logo" width={180} height={48} className="object-contain" />
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-brand-charcoal hover:text-brand-warm-brown transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-3 py-3 px-4 text-brand-charcoal font-poppins hover:text-brand-warm-brown hover:bg-brand-soft-beige rounded-lg transition-colors duration-200"
                  onClick={onClose}
                >
                  <link.icon className="h-5 w-5 text-brand-warm-brown" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-brand-beige">
            <div className="p-4 bg-brand-light-beige rounded-lg">
              <h3 className="font-semibold text-brand-charcoal mb-2 text-sm font-poppins">
                Need Help?
              </h3>
              <p className="text-xs text-brand-warm-brown mb-3 font-poppins">
                Contact support or check our knowledge base.
              </p>
              <button className="w-full btn-primary text-sm font-poppins">
                Get Support
              </button>
            </div>
          </div>

          {isLoggedIn && (
            <div className="p-4 border-t border-brand-beige">
              <button
                onClick={logOut}
                className="w-full flex items-center justify-center space-x-2 text-brand-warm-brown hover:text-brand-cream hover:bg-brand-warm-brown font-poppins font-semibold py-2 rounded-md transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;