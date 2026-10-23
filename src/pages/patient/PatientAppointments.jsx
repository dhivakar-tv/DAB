import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { getAppointments, updateAppointmentStatus, rescheduleAppointment } from '../../services/dbService';
import AppointmentTable from '../../components/dashboard/AppointmentTable';
import Modal from '../../components/common/Modal';
import { ROLES } from '../../utils/constants';
import { getTodayDateString } from '../../utils/dateUtils';
import { Calendar, PlusCircle, ArrowLeft } from 'lucide-react';

export default function PatientAppointments() {
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
      showToast(`Appointment marked as ${newStatus}.`, 'success');
      loadData();
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
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
      showToast('Appointment rescheduled successfully! Awaiting doctor re-approval.', 'success');
      setRescheduleModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message || 'Rescheduling conflict.', 'error');
    } finally {
      setRescheduling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Booking Records
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            My Appointments
          </h1>
          <p className="text-xs text-slate-500">
            Track status, reschedule upcoming dates, or review past consultation details.
          </p>
        </div>

        <Link
          to="/doctors"
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Book Appointment</span>
        </Link>
      </div>

      <AppointmentTable
        appointments={appointments}
        role={ROLES.PATIENT}
        onStatusChange={handleStatusChange}
        onReschedule={handleOpenReschedule}
        isLoading={loading}
      />

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
                New Time *
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
                {rescheduling ? 'Checking Slot...' : 'Confirm Reschedule'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
