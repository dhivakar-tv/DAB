import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { isFirebaseConfigured } from '../../services/firebase';
import { initLocalStorage } from '../../services/dbService';
import { ROLES } from '../../utils/constants';
import { UserCheck, Stethoscope, ShieldCheck, RefreshCw, ChevronDown, ChevronUp, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DemoBar() {
  const { user, switchDemoRole } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleRoleSwitch = (role, path) => {
    switchDemoRole(role);
    showToast(`Switched active session to Demo ${role.toUpperCase()}`, 'info');
    navigate(path);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo appointments, doctors, and notifications back to initial seed data?')) {
      initLocalStorage(true);
      showToast('Database reset to fresh demo state.', 'success');
      window.location.reload();
    }
  };

  return (
    <div className="bg-slate-900 text-white text-xs border-b border-slate-800 transition-all sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
        {/* Left: Indicator & Status */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isFirebaseConfigured ? 'bg-emerald-400' : 'bg-sky-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isFirebaseConfigured ? 'bg-emerald-500' : 'bg-sky-500'
              }`}
            />
          </span>
          <span className="font-semibold text-slate-200">
            {isFirebaseConfigured ? 'Firebase Live Connected' : 'Demo & College Showcase Mode'}
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">
            Active: <span className="text-white font-medium capitalize">{user?.role || 'Guest'}</span>
            {user?.fullName ? ` (${user.fullName})` : ''}
          </span>
        </div>

        {/* Right: Quick Role Switchers */}
        {!collapsed && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-medium mr-1 hidden md:inline">1-Click Quick Login:</span>

            <button
              onClick={() => handleRoleSwitch(ROLES.PATIENT, '/patient')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                user?.role === ROLES.PATIENT
                  ? 'bg-sky-500 text-white font-semibold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Alex Rivera (Patient)"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Patient</span>
            </button>

            <button
              onClick={() => handleRoleSwitch(ROLES.DOCTOR, '/doctor')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                user?.role === ROLES.DOCTOR
                  ? 'bg-teal-500 text-white font-semibold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Dr. Sarah Jenkins (Cardiologist)"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor</span>
            </button>

            <button
              onClick={() => handleRoleSwitch(ROLES.ADMIN, '/admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                user?.role === ROLES.ADMIN
                  ? 'bg-indigo-500 text-white font-semibold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="System Administrator"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            <button
              onClick={handleResetData}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-rose-950/50 hover:text-rose-300 text-slate-400 transition"
              title="Reset sample appointments, doctors, and notifications"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Seed</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-slate-200 p-1"
          aria-label="Toggle demo bar"
        >
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
