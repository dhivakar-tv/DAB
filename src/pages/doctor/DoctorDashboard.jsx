import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  getAppointments,
  updateAppointmentStatus,
  getDoctors,
} from '../../services/dbService';
import StatsCard from '../../components/dashboard/StatsCard';
import AppointmentTable from '../../components/dashboard/AppointmentTable';
import CalendarView from '../../components/dashboard/CalendarView';
import { ROLES, APPOINTMENT_STATUS } from '../../utils/constants';
import { getTodayDateString, formatDate, formatTime } from '../../utils/dateUtils';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Settings,
  ArrowRight,
  Stethoscope,
  TrendingUp,
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const todayStr = getTodayDateString();

  const loadDoctorData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Find doctor profile by matching user.uid or email
      const allDocs = await getDoctors();
      const currentDoc =
        allDocs.find((d) => d.uid === user.uid || d.doctorId === user.uid || d.fullName === user.fullName) ||
        allDocs[0]; // fallback to first doctor if demo match

      setDoctorProfile(currentDoc);

      if (currentDoc) {
        const apts = await getAppointments({ doctorId: currentDoc.doctorId });
        setAppointments(apts);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorData();
  }, [user]);

  const handleStatusChange = async (aptId, newStatus, reason) => {
    try {
      await updateAppointmentStatus(aptId, newStatus, reason);
      showToast(`Appointment status updated to ${newStatus}.`, 'success');
      loadDoctorData();
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  // Metrics
  const todayApts = appointments.filter((a) => a.appointmentDate === todayStr);
  const pendingRequests = appointments.filter((a) => a.status === APPOINTMENT_STATUS.PENDING);
  const upcomingApproved = appointments.filter((a) => a.status === APPOINTMENT_STATUS.APPROVED);
  const completedTotal = appointments.filter((a) => a.status === APPOINTMENT_STATUS.COMPLETED);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-teal-700/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold tracking-wider uppercase">
            Physician Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, {doctorProfile?.fullName || user?.fullName}!
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-lg leading-relaxed">
            {doctorProfile?.specialty || 'Specialist'} &bull; Consultation Fee: ${doctorProfile?.consultationFee || 150} / visit
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/doctor/availability"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xs text-white text-xs font-semibold border border-white/20 transition flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Working Schedule</span>
          </Link>
          <Link
            to="/doctor/profile"
            className="px-4 py-2.5 rounded-xl bg-white text-teal-800 hover:bg-teal-50 text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Profile & Fees</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Patients"
          value={todayApts.length}
          subtitle="Visits scheduled for today"
          icon={Calendar}
          color="sky"
        />
        <StatsCard
          title="Pending Requests"
          value={pendingRequests.length}
          subtitle="Awaiting your approval"
          icon={Clock}
          color="amber"
        />
        <StatsCard
          title="Approved Upcoming"
          value={upcomingApproved.length}
          subtitle="Confirmed bookings"
          icon={CheckCircle2}
          color="teal"
        />
        <StatsCard
          title="Completed Total"
          value={completedTotal.length}
          subtitle="Finished consultations"
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Calendar Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Schedule Overview
          </h2>
          <span className="text-xs text-slate-400">Green dots indicate booked appointments</span>
        </div>
        <CalendarView appointments={appointments} />
      </div>

      {/* Appointments & Action Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Patient Appointments
            </h2>
            <p className="text-xs text-slate-500">
              Review requests, approve or decline bookings, and mark completed visits
            </p>
          </div>
          <Link
            to="/doctor/appointments"
            className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <AppointmentTable
          appointments={appointments}
          role={ROLES.DOCTOR}
          onStatusChange={handleStatusChange}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
