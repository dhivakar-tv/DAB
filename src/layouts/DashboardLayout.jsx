import React, { useState } from 'react';
import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import DemoBar from '../components/common/DemoBar';
import ThemeToggle from '../components/common/ThemeToggle';
import NotificationDropdown from '../components/common/NotificationDropdown';
import Toast from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import { Menu, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function DashboardLayout({ requiredRole }) {
  const { user, isAuthenticated, loading, switchDemoRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold">Authenticating Portal Access...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> redirect to login with return path
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Strict role enforcement
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <DemoBar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Access Restricted
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              You are logged in as a <span className="font-bold uppercase text-sky-600">{user?.role}</span>.
              This portal requires <span className="font-bold uppercase text-rose-600">{requiredRole}</span> privileges.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => switchDemoRole(requiredRole)}
                className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition shadow-md"
              >
                Switch to Demo {requiredRole.toUpperCase()} Account
              </button>
              <Link
                to="/"
                className="w-full py-2 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <DemoBar />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-[calc(100vh-37px)]">
        {/* Dashboard Top Header */}
        <header className="sticky top-9 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Public Site
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <NotificationDropdown />
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />
            <div className="flex items-center gap-2">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.fullName || 'User'
                  )}&background=0284c7&color=fff`
                }
                alt={user?.fullName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-500/20"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline">
                {user?.fullName}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Route Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <Toast />
    </div>
  );
}
