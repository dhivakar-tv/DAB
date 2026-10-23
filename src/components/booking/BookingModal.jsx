import React, { useState } from 'react';
import Modal from '../common/Modal';
import SlotPicker from './SlotPicker';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { bookAppointment } from '../../services/dbService';
import { sendEmailNotification } from '../../services/emailService';
import { formatTime, formatDate, getTodayDateString } from '../../utils/dateUtils';
import { ROLES } from '../../utils/constants';
import {
  Stethoscope,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  DollarSign,
  User,
  ArrowRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function BookingModal({ isOpen, onClose, doctor, onBookingSuccess }) {
  const { user, isAuthenticated, switchDemoRole } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  if (!doctor) return null;

  const handleQuickLoginAsPatient = () => {
    switchDemoRole(ROLES.PATIENT);
    showToast('Logged in as Demo Patient (Alex Rivera)', 'success');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedDate || !selectedSlot) {
      setErrorMessage('Please select both a date and an available time slot.');
      return;
    }

    if (!reason.trim()) {
      setErrorMessage('Please provide a brief reason for your consultation.');
      return;
    }

    if (!user) {
      setErrorMessage('Please log in before booking an appointment.');
      return;
    }

    setSubmitting(true);
    try {
      const bookingPayload = {
        doctorId: doctor.doctorId,
        doctorUid: doctor.uid,
        doctorName: doctor.fullName,
        specialty: doctor.specialty,
        fee: doctor.consultationFee,
        patientId: user.uid,
        patientName: user.fullName || 'Patient',
        patientEmail: user.email,
        patientPhone: patientPhone || user.phone || '',
        appointmentDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        reason: reason.trim(),
        notes: notes.trim(),
      };

      // Book with double-booking lock
      const appointment = await bookAppointment(bookingPayload);

      // Automated email notification attempt
      await sendEmailNotification({
        to: user.email,
        recipientName: user.fullName,
        subject: `Appointment Booking Confirmation - ${doctor.fullName}`,
        type: 'booking_confirmation',
        appointmentDetails: bookingPayload,
      });

      setSuccessBooking(appointment);
      showToast('Appointment booked successfully! Awaiting doctor confirmation.', 'success');
      if (onBookingSuccess) onBookingSuccess(appointment);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSuccessBooking(null);
    setReason('');
    setNotes('');
    setSelectedSlot(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title={successBooking ? 'Booking Confirmed' : `Book Appointment - ${doctor.fullName}`}
      maxWidth="max-w-2xl"
    >
      {successBooking ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h4 className="text-xl font-bold text-slate-900 dark:text-white">
            Appointment Request Submitted!
          </h4>

          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Your appointment has been registered with status{' '}
            <span className="font-bold text-amber-600 dark:text-amber-400">Pending</span>. Dr.{' '}
            {doctor.fullName} will review your request shortly.
          </p>

          {/* Appointment details summary card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Doctor:</span>
              <span className="font-bold text-slate-900 dark:text-white">{doctor.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Specialty:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{doctor.specialty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Scheduled:</span>
              <span className="font-bold text-sky-600 dark:text-sky-400">
                {formatDate(successBooking.appointmentDate)} at {formatTime(successBooking.startTime)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Consultation Fee:</span>
              <span className="font-bold text-slate-900 dark:text-white">${doctor.consultationFee}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={resetAndClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Done
            </button>
            <Link
              to="/patient/appointments"
              onClick={resetAndClose}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
            >
              <span>View in My Appointments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleBookingSubmit} className="space-y-6">
          {/* Doctor Snapshot */}
          <div className="flex items-center gap-3.5 p-3.5 bg-sky-50/60 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 rounded-xl">
            <img
              src={doctor.profileImage}
              alt={doctor.fullName}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-sky-500/20 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {doctor.fullName}
              </h4>
              <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                {doctor.specialty} &bull; {doctor.qualifications}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-slate-400 block">Fee</span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                ${doctor.consultationFee}
              </span>
            </div>
          </div>

          {/* Authentication Check */}
          {!isAuthenticated && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs space-y-2">
              <p className="font-semibold text-amber-800 dark:text-amber-300">
                You must be logged in as a patient to confirm this booking.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleQuickLoginAsPatient}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition"
                >
                  Quick Login as Demo Patient
                </button>
                <Link
                  to="/login"
                  className="text-amber-700 dark:text-amber-400 underline hover:text-amber-900"
                >
                  Or regular log in
                </Link>
              </div>
            </div>
          )}

          {/* Slot Picker Component */}
          <SlotPicker
            doctor={doctor}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
          />

          {/* Reason for Appointment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              3. Reason for Visit *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Annual routine checkup, chest tightness, second opinion"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              4. Additional Notes / Medical History (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="List any ongoing medications, previous surgery dates, or symptoms"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-600 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500">
              {selectedSlot ? (
                <span>
                  Slot: <strong>{formatDate(selectedDate)}</strong> at{' '}
                  <strong>{formatTime(selectedSlot.startTime)}</strong>
                </span>
              ) : (
                'Select an available slot'
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !selectedSlot}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
              >
                {submitting ? 'Verifying & Reserving...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
