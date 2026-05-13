'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tenantId');
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white shadow-lg">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold">OpenRiskOS</h2>
          <p className="text-sm text-gray-400 mt-1">Enterprise GRC Platform</p>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          <Link
            href="/dashboard"
            className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/dashboard/risks"
            className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            ⚠️ Risks
          </Link>
          <Link
            href="/dashboard/compliance"
            className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            ✓ Compliance
          </Link>
          <Link
            href="/dashboard/incidents"
            className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            🚨 Incidents
          </Link>
          <Link
            href="/dashboard/audits"
            className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            📋 Audits
          </Link>
          <Link
            href="/dashboard/vendors"
            className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            🤝 Vendors
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {new Date().toLocaleDateString()}
            </span>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              U
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
