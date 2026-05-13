'use client';

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
  const { user, logout } = useUser();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!user) {
    return null; // Don't show navbar on login page
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">OpenRiskOS</span>
            </a>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <p className="font-medium">{user.email}</p>
              <p className="text-xs text-gray-500">{user.tenantId}</p>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold hover:bg-blue-700 transition"
              >
                {user.email.charAt(0).toUpperCase()}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
