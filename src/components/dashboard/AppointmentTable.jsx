import React, { useState } from 'react';
import Badge from '../common/Badge';
import ConfirmDialog from '../common/ConfirmDialog';
import Modal from '../common/Modal';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { APPOINTMENT_STATUS, ROLES } from '../../utils/constants';
import {
  Check,
  X,
  CheckCheck,
  Calendar,
  Clock,
  Eye,
  AlertCircle,
  Search,
  RotateCcw,
} from 'lucide-react';

export default function AppointmentTable({
  appointments = [],
  role = ROLES.PATIENT,
  onStatusChange,
  onReschedule,
  isLoading = false,
}) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApt, setSelectedApt] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Dialog State for Cancellation / Rejection
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    aptId: null,
    action: null, // 'cancel' | 'reject' | 'approve' | 'complete'
    title: '',
    message: '',
    reasonText: '',
  });

  const statuses = ['All', 'Pending', 'Approved', 'Completed', 'Cancelled', 'Rejected'];

  const filtered = appointments.filter((apt) => {
    if (filterStatus !== 'All' && apt.status !== filterStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchDoc = (apt.doctorName || '').toLowerCase().includes(q);
      const matchPatient = (apt.patientName || '').toLowerCase().includes(q);
      const matchSpecialty = (apt.specialty || '').toLowerCase().includes(q);
      const matchReason = (apt.reason || '').toLowerCase().includes(q);
      return matchDoc || matchPatient || matchSpecialty || matchReason;
    }
    return true;
  });

  const handleActionClick = (apt, action) => {
    if (action === 'approve') {
      setConfirmDialog({
        isOpen: true,
        aptId: apt.appointmentId,
        action: 'approve',
        title: 'Approve Appointment',
        message: `Approve consultation for ${apt.patientName} on ${formatDate(apt.appointmentDate)} at ${formatTime(apt.startTime)}?`,
        isDanger: false,
      });
    } else if (action === 'complete') {
      setConfirmDialog({
        isOpen: true,
        aptId: apt.appointmentId,
        action: 'complete',
        title: 'Mark as Completed',
        message: `Mark appointment with ${apt.patientName} as completed?`,
        isDanger: false,
      });
    } else if (action === 'reject') {
      setConfirmDialog({
        isOpen: true,
        aptId: apt.appointmentId,
        action: 'reject',
        title: 'Reject Appointment Request',
        message: `Are you sure you want to decline this appointment request? Please provide a reason for the patient.`,
        isDanger: true,
        withReason: true,
      });
    } else if (action === 'cancel') {
      setConfirmDialog({
        isOpen: true,
        aptId: apt.appointmentId,
        action: 'cancel',
        title: 'Cancel Appointment',
        message: 'Are you sure you want to cancel this scheduled appointment?',
        isDanger: true,
        withReason: true,
      });
    }
  };

  const handleConfirmAction = async () => {
    const { aptId, action, reasonText } = confirmDialog;
    if (!aptId || !action) return;

    let targetStatus = APPOINTMENT_STATUS.PENDING;
    if (action === 'approve') targetStatus = APPOINTMENT_STATUS.APPROVED;
    if (action === 'complete') targetStatus = APPOINTMENT_STATUS.COMPLETED;
    if (action === 'reject') targetStatus = APPOINTMENT_STATUS.REJECTED;
    if (action === 'cancel') targetStatus = APPOINTMENT_STATUS.CANCELLED;

    await onStatusChange(aptId, targetStatus, reasonText);
    setConfirmDialog({ isOpen: false, aptId: null, action: null });
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                filterStatus === st
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-56">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                <th className="p-4">
                  {role === ROLES.DOCTOR ? 'Patient' : role === ROLES.PATIENT ? 'Doctor' : 'Doctor & Patient'}
                </th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Specialty & Fee</th>
                <th className="p-4">Status</th>
                <th className="p-4">Reason</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    No appointments match the criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((apt) => {
                  const isPending = apt.status === APPOINTMENT_STATUS.PENDING;
                  const isApproved = apt.status === APPOINTMENT_STATUS.APPROVED;

                  return (
                    <tr
                      key={apt.appointmentId}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                    >
                      {/* Name / Parties */}
                      <td className="p-4">
                        {role === ROLES.DOCTOR && (
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {apt.patientName}
                            </p>
                            <p className="text-[11px] text-slate-400">{apt.patientPhone || apt.patientEmail}</p>
                          </div>
                        )}
                        {role === ROLES.PATIENT && (
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {apt.doctorName}
                            </p>
                            <p className="text-[11px] text-teal-600 dark:text-teal-400">{apt.specialty}</p>
                          </div>
                        )}
                        {role === ROLES.ADMIN && (
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {apt.doctorName}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Patient: <span className="font-medium text-slate-700 dark:text-slate-300">{apt.patientName}</span>
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Date & Time */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                          <Calendar className="w-3.5 h-3.5 text-sky-500" />
                          <span>{formatDate(apt.appointmentDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatTime(apt.startTime)}</span>
                        </div>
                      </td>

                      {/* Specialty & Fee */}
                      <td className="p-4 whitespace-nowrap">
                        <p className="font-medium text-slate-700 dark:text-slate-300">
                          {apt.specialty}
                        </p>
                        <p className="text-[11px] font-bold text-slate-900 dark:text-white mt-0.5">
                          ${apt.fee || apt.consultationFee || 0}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="p-4 whitespace-nowrap">
                        <Badge status={apt.status} />
                      </td>

                      {/* Reason */}
                      <td className="p-4 max-w-xs truncate text-slate-600 dark:text-slate-400">
                        {apt.reason || 'General Consultation'}
                      </td>

                      {/* Action buttons */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Full Details Button */}
                          <button
                            onClick={() => {
                              setSelectedApt(apt);
                              setDetailsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-lg transition"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* DOCTOR ACTIONS */}
                          {role === ROLES.DOCTOR && isPending && (
                            <>
                              <button
                                onClick={() => handleActionClick(apt, 'approve')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1 shadow-xs transition"
                                title="Approve Request"
                              >
                                <Check className="w-3 h-3" /> Approve
                              </button>
                              <button
                                onClick={() => handleActionClick(apt, 'reject')}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 rounded-lg font-semibold transition"
                                title="Reject Request"
                              >
                                <X className="w-3 h-3" /> Reject
                              </button>
                            </>
                          )}

                          {role === ROLES.DOCTOR && isApproved && (
                            <button
                              onClick={() => handleActionClick(apt, 'complete')}
                              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold flex items-center gap-1 transition"
                              title="Mark Completed"
                            >
                              <CheckCheck className="w-3 h-3" /> Complete
                            </button>
                          )}

                          {/* PATIENT ACTIONS */}
                          {role === ROLES.PATIENT && (isPending || isApproved) && (
                            <>
                              {onReschedule && (
                                <button
                                  onClick={() => onReschedule(apt)}
                                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold flex items-center gap-1 transition"
                                  title="Reschedule"
                                >
                                  <RotateCcw className="w-3 h-3" /> Reschedule
                                </button>
                              )}
                              <button
                                onClick={() => handleActionClick(apt, 'cancel')}
                                className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg font-semibold transition"
                                title="Cancel Appointment"
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {/* ADMIN ACTIONS */}
                          {role === ROLES.ADMIN && (isPending || isApproved) && (
                            <button
                              onClick={() => handleActionClick(apt, 'cancel')}
                              className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg font-semibold transition"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Full Details Modal */}
      {selectedApt && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title="Appointment Details"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div>
                <p className="text-[11px] text-slate-400">Appointment ID</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {selectedApt.appointmentId}
                </p>
              </div>
              <Badge status={selectedApt.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400">Doctor</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedApt.doctorName}
                </p>
                <p className="text-[11px] text-teal-600">{selectedApt.specialty}</p>
              </div>
              <div>
                <p className="text-slate-400">Patient</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedApt.patientName}
                </p>
                <p className="text-[11px] text-slate-500">{selectedApt.patientEmail}</p>
                <p className="text-[11px] text-slate-500">{selectedApt.patientPhone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-3">
              <div>
                <p className="text-slate-400">Date & Time</p>
                <p className="font-bold text-sky-600 mt-0.5">
                  {formatDate(selectedApt.appointmentDate)} at {formatTime(selectedApt.startTime)} -{' '}
                  {formatTime(selectedApt.endTime)}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Consultation Fee</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                  ${selectedApt.fee || selectedApt.consultationFee || 0}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
              <p className="text-slate-400 font-bold mb-1">Reason for Consultation</p>
              <p className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
                {selectedApt.reason || 'No specific reason entered.'}
              </p>
            </div>

            {selectedApt.notes && (
              <div>
                <p className="text-slate-400 font-bold mb-1">Patient Notes / Medical Background</p>
                <p className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
                  {selectedApt.notes}
                </p>
              </div>
            )}

            {selectedApt.cancellationReason && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl">
                <p className="text-rose-700 dark:text-rose-300 font-bold mb-0.5">
                  Cancellation / Rejection Note
                </p>
                <p className="text-rose-600 dark:text-rose-400">{selectedApt.cancellationReason}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDanger={confirmDialog.isDanger}
      />
    </div>
  );
}
