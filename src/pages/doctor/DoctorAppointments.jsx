import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { getAppointments, updateAppointmentStatus, getDoctors } from '../../services/dbService';
import AppointmentTable from '../../components/dashboard/AppointmentTable';
import { ROLES } from '../../utils/constants';

export default function DoctorAppointments() {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const allDocs = await getDoctors();
      const currentDoc =
        allDocs.find((d) => d.uid === user.uid || d.doctorId === user.uid || d.fullName === user.fullName) ||
        allDocs[0];

      if (currentDoc) {
        const list = await getAppointments({ doctorId: currentDoc.doctorId });
        setAppointments(list);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [user]);

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
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Patient Queue
        </span>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
          Appointment Management
        </h1>
        <p className="text-xs text-slate-500">
          Filter by Pending requests, Approved visits, or view completed consultation records.
        </p>
      </div>

      <AppointmentTable
        appointments={appointments}
        role={ROLES.DOCTOR}
        onStatusChange={handleStatusChange}
        isLoading={loading}
      />
    </div>
  );
}
