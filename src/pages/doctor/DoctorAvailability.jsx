import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { getDoctors, updateDoctor } from '../../services/dbService';
import { DAYS_OF_WEEK } from '../../utils/constants';
import { Clock, Calendar, Coffee, Save, CheckCircle2 } from 'lucide-react';

export default function DoctorAvailability() {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [doctor, setDoctor] = useState(null);
  const [selectedDays, setSelectedDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState(30);
  const [breakStartTime, setBreakStartTime] = useState('13:00');
  const [breakEndTime, setBreakEndTime] = useState('14:00');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadAvailability() {
      if (!user) return;
      const allDocs = await getDoctors();
      const currentDoc =
        allDocs.find((d) => d.uid === user.uid || d.doctorId === user.uid || d.fullName === user.fullName) ||
        allDocs[0];

      if (currentDoc) {
        setDoctor(currentDoc);
        if (currentDoc.availability) {
          const av = currentDoc.availability;
          setSelectedDays(av.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
          setStartTime(av.startTime || '09:00');
          setEndTime(av.endTime || '17:00');
          setSlotDuration(av.slotDuration || 30);
          setBreakStartTime(av.breakStartTime || '13:00');
          setBreakEndTime(av.breakEndTime || '14:00');
        }
      }
    }
    loadAvailability();
  }, [user]);

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length === 1) {
        showToast('You must keep at least one available working day.', 'warning');
        return;
      }
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSaveAvailability = async (e) => {
    e.preventDefault();
    if (!doctor) return;

    setSaving(true);
    try {
      const updatedAvailability = {
        days: selectedDays,
        startTime,
        endTime,
        slotDuration: Number(slotDuration),
        breakStartTime,
        breakEndTime,
      };

      await updateDoctor(doctor.doctorId, {
        availability: updatedAvailability,
      });

      showToast('Working schedule and availability updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update schedule.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Schedule Settings
        </span>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
          Working Hours & Availability
        </h1>
        <p className="text-xs text-slate-500">
          Configure active clinic consultation days, daily operating hours, slot intervals, and lunch breaks.
        </p>
      </div>

      <form onSubmit={handleSaveAvailability} className="space-y-6">
        {/* Working Days Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>1. Consultation Days</span>
          </div>
          <p className="text-xs text-slate-500">
            Select the days of the week you are available for patient consultations.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {DAYS_OF_WEEK.map((day) => {
              const active = selectedDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-between ${
                    active
                      ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-500 text-sky-700 dark:text-sky-300 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <span>{day}</span>
                  {active && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Operating Hours and Slot Duration */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>2. Daily Hours & Slot Interval</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Shift Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Shift End Time
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Slot Duration (Minutes)
              </label>
              <select
                value={slotDuration}
                onChange={(e) => setSlotDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="15">15 Minutes</option>
                <option value="20">20 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Break Times */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Coffee className="w-4 h-4 text-amber-500" />
            <span>3. Break / Lunch Time (Blocked from Bookings)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Break Start Time
              </label>
              <input
                type="time"
                value={breakStartTime}
                onChange={(e) => setBreakStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Break End Time
              </label>
              <input
                type="time"
                value={breakEndTime}
                onChange={(e) => setBreakEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Updating Schedule...' : 'Save Schedule & Slots'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
