import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import ThemeToggle from './ThemeToggle';
import NotificationDropdown from './NotificationDropdown';
import { ROLES } from '../../utils/constants';
import {
  HeartPulse,
  Menu,
  X,
  User,
  Calendar,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Stethoscope,
  ShieldAlert,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    showToast('You have been logged out successfully.', 'info');
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Find Doctors', path: '/doctors' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
  ];

  const getDashboardPath = () => {
    if (user?.role === ROLES.DOCTOR) return '/doctor';
    if (user?.role === ROLES.ADMIN) return '/admin';
    return '/patient';
  };

  const getDashboardLabel = () => {
    if (user?.role === ROLES.DOCTOR) return 'Doctor Portal';
    if (user?.role === ROLES.ADMIN) return 'Admin Console';
    return 'Patient Dashboard';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Medi<span className="text-sky-600 dark:text-sky-400">Care</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-teal-600 dark:text-teal-400 -mt-1">
                Healthcare Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                <NotificationDropdown />

                {/* Dashboard Quick Access */}
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{getDashboardLabel()}</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <img
                      src={
                        user?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user?.fullName || 'User'
                        )}&background=0284c7&color=fff`
                      }
                      alt={user?.fullName || 'User profile'}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-sky-500/30"
                    />
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {user?.fullName}
                      </p>
                      <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold capitalize">
                        {user?.role}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fade-in"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          {user?.fullName}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Dashboard
                      </Link>

                      {user?.role === ROLES.PATIENT && (
                        <Link
                          to="/patient/appointments"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                          <Calendar className="w-4 h-4 text-slate-400" />
                          My Appointments
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md shadow-sky-600/20 transition hover:shadow-lg hover:shadow-sky-600/30 active:scale-95"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            {isAuthenticated && <NotificationDropdown />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl mb-3">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.fullName}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role} Portal</p>
                </div>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-sky-600 dark:text-sky-400"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {getDashboardLabel()}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 px-4 text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 px-4 text-sm font-semibold rounded-xl bg-sky-600 text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
