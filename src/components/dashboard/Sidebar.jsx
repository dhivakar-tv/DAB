import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ROLES } from '../../utils/constants';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  Clock,
  ShieldCheck,
  FileText,
  Settings,
  LogOut,
  HeartPulse,
  Award,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, role, logout } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully.', 'info');
    navigate('/');
  };

  // Define role-specific navigation menus
  const patientNav = [
    { label: 'Overview', path: '/patient', icon: LayoutDashboard },
    { label: 'My Appointments', path: '/patient/appointments', icon: Calendar },
    { label: 'Book Doctor', path: '/doctors', icon: Stethoscope },
    { label: 'My Profile', path: '/patient/profile', icon: Settings },
  ];

  const doctorNav = [
    { label: 'Doctor Dashboard', path: '/doctor', icon: LayoutDashboard },
    { label: 'Appointments', path: '/doctor/appointments', icon: Calendar },
    { label: 'Working Schedule', path: '/doctor/availability', icon: Clock },
    { label: 'Profile & Fees', path: '/doctor/profile', icon: Settings },
  ];

  const adminNav = [
    { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Doctors', path: '/admin/doctors', icon: Stethoscope },
    { label: 'Manage Patients', path: '/admin/patients', icon: Users },
    { label: 'All Appointments', path: '/admin/appointments', icon: Calendar },
    { label: 'Specialties', path: '/admin/specialties', icon: Award },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: FileText },
  ];

  let currentNav = patientNav;
  if (role === ROLES.DOCTOR) currentNav = doctorNav;
  if (role === ROLES.ADMIN) currentNav = adminNav;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo / Header */}
          <div className="h-18 px-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                Medi<span className="text-sky-600 dark:text-sky-400">Care</span>
              </span>
              <span className="block text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                {role} Portal
              </span>
            </div>
          </div>

          {/* User Quick Info */}
          <div className="p-4 mx-3 my-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.fullName || 'User'
                )}&background=0284c7&color=fff`
              }
              alt={user?.fullName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500/30"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.fullName}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1">
            {currentNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/patient' || item.path === '/doctor' || item.path === '/admin'}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
