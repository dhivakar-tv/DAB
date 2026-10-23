import React, { useState, useEffect } from 'react';
import { getAppointments, getDashboardStats } from '../../services/dbService';
import { getDispatchedEmailLogs, clearEmailLogs } from '../../services/emailService';
import { exportAppointmentsToCsv } from '../../utils/exportCsv';
import { formatDate, formatTime } from '../../utils/dateUtils';
import Modal from '../../components/common/Modal';
import { useNotification } from '../../context/NotificationContext';
import {
  Download,
  FileSpreadsheet,
  Mail,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Server,
  Key,
} from 'lucide-react';

export default function AdminReports() {
  const { showToast } = useNotification();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [emailLogs, setEmailLogs] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const loadData = async () => {
    const [apts, st] = await Promise.all([getAppointments(), getDashboardStats()]);
    setAppointments(apts);
    setStats(st);
    setEmailLogs(getDispatchedEmailLogs());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportCsv = () => {
    exportAppointmentsToCsv(
      appointments,
      `medicare_appointments_report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    showToast('Appointment report CSV exported successfully!', 'success');
  };

  const handleClearLogs = () => {
    clearEmailLogs();
    setEmailLogs([]);
    showToast('Email activity logs cleared.', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Analytics & Auditing
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Reports & Email Dispatch Center
          </h1>
          <p className="text-xs text-slate-500">
            Export comprehensive appointment records to CSV and inspect outgoing automated email notifications.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 active:scale-95"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Appointments (CSV)</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Records</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats?.totalAppointments || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase">Completed</span>
          <p className="text-2xl font-black text-emerald-500 mt-1">
            {stats?.completedCount || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase">Cancelled Rate</span>
          <p className="text-2xl font-black text-rose-500 mt-1">
            {stats?.cancellationRate || 0}%
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase">Estimated Revenue</span>
          <p className="text-2xl font-black text-sky-600 mt-1">
            ${stats?.totalRevenue || 0}
          </p>
        </div>
      </div>

      {/* Email Integration Configuration Status Card */}
      <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 rounded-3xl p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-sky-600" />
          <h3 className="text-sm font-bold text-sky-950 dark:text-sky-200">
            Email Automation Delivery Architecture
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          MediCare supports both <strong>Cloud Functions SMTP delivery</strong> (via Resend, SendGrid, or nodemailer)
          and a transparent <strong>Demo Mode Dispatch Log</strong>. All transactional events (booking confirmations,
          doctor approvals, rejections, cancellations, and reminders) generate responsive HTML emails captured in real-time below.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Key className="w-3.5 h-3.5 text-amber-500" />
            Config: VITE_EMAIL_FUNCTION_URL & RESEND_API_KEY
          </span>
          <span>&bull;</span>
          <span className="text-teal-600 dark:text-teal-400 font-semibold">
            Status: Captured & In-App Alerts Active
          </span>
        </div>
      </div>

      {/* Outgoing Email Activity Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Outgoing Email Dispatch Logs ({emailLogs.length})
            </h3>
          </div>
          {emailLogs.length > 0 && (
            <button
              onClick={handleClearLogs}
              className="px-3 py-1 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg font-medium flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Log</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                <th className="p-3.5">Recipient</th>
                <th className="p-3.5">Subject</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Mode</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5 text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {emailLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    No email notifications dispatched yet. Book or update an appointment to view real-time email logs.
                  </td>
                </tr>
              ) : (
                emailLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900 dark:text-white">{log.recipientName || 'User'}</p>
                      <p className="text-[11px] text-slate-400">{log.to}</p>
                    </td>

                    <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {log.subject}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                        {log.type}
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                          log.status === 'delivered_live'
                            ? 'text-emerald-600'
                            : 'text-sky-600 dark:text-sky-400'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{log.status === 'delivered_live' ? 'Delivered Live' : 'Simulated (Demo)'}</span>
                      </span>
                    </td>

                    <td className="p-3.5 text-slate-400 whitespace-nowrap">
                      {log.timestamp ? formatDate(log.timestamp) : ''}
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedEmail(log);
                          setEmailModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg flex items-center gap-1 ml-auto transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect HTML</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* HTML Email Preview Modal */}
      {selectedEmail && (
        <Modal
          isOpen={emailModalOpen}
          onClose={() => setEmailModalOpen(false)}
          title={`Email Preview: ${selectedEmail.subject}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">To:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedEmail.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Subject:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedEmail.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-teal-600 font-bold">{selectedEmail.status}</span>
              </div>
            </div>

            {/* Embedded Rendered HTML View */}
            <div
              className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden p-2 bg-white"
              dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
