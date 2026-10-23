import React, { useState, useEffect } from 'react';
import { getAppointments, updateAppointmentStatus } from '../../services/dbService';
import { useNotification } from '../../context/NotificationContext';
import AppointmentTable from '../../components/dashboard/AppointmentTable';
import { ROLES } from '../../utils/constants';

export default function AdminAppointments() {
  const { showToast } = useNotification();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAppointments();
      setAppointments(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleStatusChange = async (aptId, newStatus, reason) => {
    try {
      await updateAppointmentStatus(aptId, newStatus, reason);
      showToast(`Appointment status updated to ${newStatus}.`, 'success');
      loadAppointments();
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Global Queue
        </span>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
          All Hospital Appointments
        </h1>
        <p className="text-xs text-slate-500">
          Master administrative view of all patient bookings across every department and physician.
        </p>
      </div>

      <AppointmentTable
        appointments={appointments}
        role={ROLES.ADMIN}
        onStatusChange={handleStatusChange}
        isLoading={loading}
      />
    </div>
  );
}
