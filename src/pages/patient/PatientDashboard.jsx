import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { getAppointments, updateAppointmentStatus, rescheduleAppointment } from '../../services/dbService';
import StatsCard from '../../components/dashboard/StatsCard';
import AppointmentTable from '../../components/dashboard/AppointmentTable';
import CalendarView from '../../components/dashboard/CalendarView';
import Modal from '../../components/common/Modal';
import { ROLES, APPOINTMENT_STATUS } from '../../utils/constants';
import { formatDate, formatTime, getTodayDateString } from '../../utils/dateUtils';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  User,
  HeartPulse,
} from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reschedule state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [targetAptToReschedule, setTargetAptToReschedule] = useState(null);
  const [newDate, setNewDate] = useState(getTodayDateString());
  const [newTime, setNewTime] = useState('10:00');
  const [rescheduling, setRescheduling] = useState(false);

  const loadData = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const data = await getAppointments({ patientId: user.uid });
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleStatusChange = async (aptId, newStatus, reason) => {
    try {
      await updateAppointmentStatus(aptId, newStatus, reason);
      showToast(`Appointment status changed to ${newStatus}.`, 'success');
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleOpenReschedule = (apt) => {
    setTargetAptToReschedule(apt);
    setNewDate(apt.appointmentDate);
    setNewTime(apt.startTime);
    setRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = async (e) => {
    e.preventDefault();
    if (!targetAptToReschedule) return;

    setRescheduling(true);
    try {
      // Slot end time is 30 mins later
      const [h, m] = newTime.split(':').map(Number);
      const endMins = h * 60 + m + 30;
      const endH = Math.floor(endMins / 60);
      const endM = endMins % 60;
      const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

      await rescheduleAppointment(
        targetAptToReschedule.appointmentId,
        newDate,
        newTime,
        endTime
      );
      showToast('Appointment rescheduled! Awaiting doctor re-approval.', 'success');
      setRescheduleModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message || 'Rescheduling conflict.', 'error');
    } finally {
      setRescheduling(false);
    }
  };

  // Metrics
  const upcomingCount = appointments.filter((a) => a.status === APPOINTMENT_STATUS.APPROVED).length;
  const pendingCount = appointments.filter((a) => a.status === APPOINTMENT_STATUS.PENDING).length;
  const completedCount = appointments.filter((a) => a.status === APPOINTMENT_STATUS.COMPLETED).length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-sky-600/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold tracking-wider uppercase">
            Patient Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {user?.fullName || 'Patient'}!
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 max-w-lg leading-relaxed">
            Manage your medical appointments, track doctor approval requests, and view your consultation history.
          </p>
        </div>

        <Link
          to="/doctors"
          className="px-5 py-3 rounded-2xl bg-white text-sky-700 hover:bg-sky-50 font-bold text-xs shadow-md transition flex items-center gap-2 shrink-0 active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-sky-600" />
          <span>Book New Appointment</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Upcoming Visits"
          value={upcomingCount}
          subtitle="Approved appointments"
          icon={Calendar}
          color="sky"
        />
        <StatsCard
          title="Pending Requests"
          value={pendingCount}
          subtitle="Awaiting doctor review"
          icon={Clock}
          color="amber"
        />
        <StatsCard
          title="Completed"
          value={completedCount}
          subtitle="Past consultations"
          icon={CheckCircle}
          color="emerald"
        />
        <StatsCard
          title="Total Bookings"
          value={appointments.length}
          subtitle="All recorded bookings"
          icon={HeartPulse}
          color="indigo"
        />
      </div>

      {/* Calendar View Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Appointment Calendar
          </h2>
          <span className="text-xs text-slate-400">Green dots indicate scheduled visits</span>
        </div>
        <CalendarView appointments={appointments} />
      </div>

      {/* Recent Appointments Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              My Appointments
            </h2>
            <p className="text-xs text-slate-500">
              Review appointment statuses, reschedule, or cancel if needed
            </p>
          </div>
          <Link
            to="/patient/appointments"
            className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <AppointmentTable
          appointments={appointments}
          role={ROLES.PATIENT}
          onStatusChange={handleStatusChange}
          onReschedule={handleOpenReschedule}
          isLoading={loading}
        />
      </div>

      {/* Reschedule Modal */}
      {targetAptToReschedule && (
        <Modal
          isOpen={rescheduleModalOpen}
          onClose={() => setRescheduleModalOpen(false)}
          title={`Reschedule with ${targetAptToReschedule.doctorName}`}
        >
          <form onSubmit={handleConfirmReschedule} className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-400">
              Select a new date and time for your consultation. If the slot is available, your appointment will be updated and placed in Pending state for doctor re-confirmation.
            </p>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                New Date *
              </label>
              <input
                type="date"
                min={getTodayDateString()}
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                New Time (e.g. 10:00, 11:30, 14:00) *
              </label>
              <input
                type="time"
                required
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setRescheduleModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={rescheduling}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-sm"
              >
                {rescheduling ? 'Verifying Slot...' : 'Confirm Reschedule'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
