import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../services/dbService';
import StatsCard from '../../components/dashboard/StatsCard';
import {
  Users,
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Download,
  DollarSign,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const data = await getDashboardStats();
        setStats(data);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-bold tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
            <span>Healthcare Operations Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            System Administration
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl leading-relaxed">
            Real-time analytics calculated from live Firestore/local database records. Monitor patient
            inflow, practitioner availability, and booking completion rates.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/admin/reports"
            className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Reports</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Patients"
          value={stats?.totalPatients || 0}
          subtitle="Registered patient accounts"
          icon={Users}
          color="sky"
        />
        <StatsCard
          title="Active Doctors"
          value={stats?.totalDoctors || 0}
          subtitle="Practicing medical specialists"
          icon={Stethoscope}
          color="teal"
        />
        <StatsCard
          title="Total Appointments"
          value={stats?.totalAppointments || 0}
          subtitle={`${stats?.pendingCount || 0} pending review`}
          icon={Calendar}
          color="indigo"
        />
        <StatsCard
          title="Cancellation Rate"
          value={`${stats?.cancellationRate || 0}%`}
          subtitle={`${stats?.cancelledCount || 0} total cancellations`}
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Pending Approvals
            </span>
            <p className="text-2xl font-black text-amber-500 mt-1">
              {stats?.pendingCount || 0}
            </p>
          </div>
          <Clock className="w-8 h-8 text-amber-400/30" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Completed Consultations
            </span>
            <p className="text-2xl font-black text-emerald-500 mt-1">
              {stats?.completedCount || 0}
            </p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-400/30" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Estimated Total Revenue
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              ${stats?.totalRevenue || 0}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-sky-400/30" />
        </div>
      </div>

      {/* Recharts Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Booking Trends Area Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Appointment Trends
              </h3>
              <p className="text-xs text-slate-500">
                Volume of total, completed, and pending visits
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-sky-500" />
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="completedColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="total" stroke="#0284c7" fillOpacity={1} fill="url(#totalColor)" name="Total" />
                <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#completedColor)" name="Completed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Specialty Distribution Bar Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Appointments by Specialty
            </h3>
            <p className="text-xs text-slate-500">Distribution across disciplines</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.specialtyData || []} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={75} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" fill="#0d9488" radius={[0, 6, 6, 0]} name="Appointments" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Admin Quick Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/doctors"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500 transition shadow-sm flex items-center justify-between group"
        >
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition">
              Manage Doctors
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Add, edit, or activate doctor profiles</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition" />
        </Link>

        <Link
          to="/admin/appointments"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500 transition shadow-sm flex items-center justify-between group"
        >
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition">
              All Appointments
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Search and oversee hospital-wide queue</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition" />
        </Link>

        <Link
          to="/admin/reports"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500 transition shadow-sm flex items-center justify-between group"
        >
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition">
              Export CSV Reports
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Download full booking audit records</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition" />
        </Link>
      </div>
    </div>
  );
}
