import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ROLES } from '../../utils/constants';
import { HeartPulse, Mail, Lock, LogIn, AlertCircle, UserCheck, Stethoscope, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { login, switchDemoRole } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigateToRoleDashboard = (role) => {
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    if (role === ROLES.DOCTOR) navigate('/doctor');
    else if (role === ROLES.ADMIN) navigate('/admin');
    else navigate('/patient');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.fullName}!`, 'success');
      navigateToRoleDashboard(user.role);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role, demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    const user = switchDemoRole(role);
    showToast(`Logged in as Demo ${role.toUpperCase()} (${user?.fullName})`, 'success');
    navigateToRoleDashboard(role);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-400 flex items-center justify-center text-white mx-auto shadow-md shadow-sky-500/20">
            <HeartPulse className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Sign In to MediCare
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access your patient portal, doctor dashboard, or administrative console
          </p>
        </div>

        {/* 1-Click Demo Logins for Reviewers / Evaluators */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
            College & Portfolio 1-Click Demo Logins
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo(ROLES.PATIENT, 'patient@medicare.demo', 'Patient@123')}
              className="py-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 flex flex-col items-center gap-1 transition"
            >
              <UserCheck className="w-4 h-4 text-sky-500" />
              <span>Patient</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo(ROLES.DOCTOR, 'doctor.sarah@medicare.demo', 'Doctor@123')}
              className="py-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 flex flex-col items-center gap-1 transition"
            >
              <Stethoscope className="w-4 h-4 text-teal-500" />
              <span>Doctor</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo(ROLES.ADMIN, 'admin@medicare.demo', 'Admin@123')}
              className="py-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 flex flex-col items-center gap-1 transition"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center gap-2 text-xs text-rose-600 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Regular Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/25 transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
