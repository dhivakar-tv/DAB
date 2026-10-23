import React, { useState, useEffect } from 'react';
import { getPatients, getAppointments } from '../../services/dbService';
import { formatDate } from '../../utils/dateUtils';
import { Users, Search, Mail, Phone, Calendar } from 'lucide-react';

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [pts, apts] = await Promise.all([getPatients(), getAppointments()]);
        setPatients(pts);
        setAppointments(apts);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getPatientBookingCount = (patientId) => {
    return appointments.filter((a) => a.patientId === patientId).length;
  };

  const filteredPatients = patients.filter((p) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.fullName?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
          Patient Directory
        </span>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
          Patient Accounts
        </h1>
        <p className="text-xs text-slate-500">
          View registered patients, contact details, and their active booking counts.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search patients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <span className="text-xs text-slate-500">
          Registered Patients: <strong className="text-slate-900 dark:text-white">{patients.length}</strong>
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                <th className="p-4">Patient</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4 text-right">Total Bookings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPatients.map((p) => {
                const bookingCount = getPatientBookingCount(p.uid);
                return (
                  <tr
                    key={p.uid}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            p.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              p.fullName
                            )}&background=0284c7&color=fff`
                          }
                          alt={p.fullName}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 shrink-0"
                        />
                        <p className="font-bold text-slate-900 dark:text-white">{p.fullName}</p>
                      </div>
                    </td>

                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {p.email}
                    </td>

                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {p.phone || 'Not provided'}
                    </td>

                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {p.createdAt ? formatDate(p.createdAt) : 'Recently'}
                    </td>

                    <td className="p-4 text-right font-black text-slate-900 dark:text-white">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                        {bookingCount}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
