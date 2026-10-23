import React, { useState, useEffect } from 'react';
import { getAppointments } from '../../services/dbService';
import { generateTimeSlots, getTodayDateString, getDayName, formatTime } from '../../utils/dateUtils';
import { Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SlotPicker({ doctor, selectedDate, setSelectedDate, selectedSlot, setSelectedSlot }) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Generate next 14 available days
  const today = getTodayDateString();
  const availableWeekdays = doctor?.availability?.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Load booked slots for selected doctor and date
  useEffect(() => {
    async function loadBooked() {
      if (!doctor?.doctorId || !selectedDate) return;
      setLoadingSlots(true);
      try {
        const apts = await getAppointments({
          doctorId: doctor.doctorId,
          date: selectedDate,
        });
        const activeApts = apts.filter((a) => a.status === 'Pending' || a.status === 'Approved');
        setBookedSlots(activeApts.map((a) => a.startTime));
      } catch (err) {
        console.error('Failed to load booked slots', err);
      } finally {
        setLoadingSlots(false);
      }
    }
    loadBooked();
  }, [doctor?.doctorId, selectedDate]);

  const slots = doctor?.availability
    ? generateTimeSlots(doctor.availability, bookedSlots, selectedDate)
    : [];

  const morningSlots = slots.filter((s) => {
    const hour = parseInt(s.startTime.split(':')[0], 10);
    return hour < 12;
  });

  const afternoonSlots = slots.filter((s) => {
    const hour = parseInt(s.startTime.split(':')[0], 10);
    return hour >= 12;
  });

  const selectedDayName = getDayName(selectedDate);
  const isWorkingDay = availableWeekdays.includes(selectedDayName);

  return (
    <div className="space-y-5">
      {/* Date Selector */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          1. Select Consultation Date
        </label>
        <div className="relative">
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlot(null); // reset slot when date changes
            }}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-sm shadow-sm"
          />
        </div>

        {selectedDate && (
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Selected Day: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDayName}</span>
            </span>
            {!isWorkingDay ? (
              <span className="text-rose-500 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Not in doctor's working schedule
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Regular working day
              </span>
            )}
          </div>
        )}
      </div>

      {/* Available Slots Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            2. Choose Available Time Slot
          </label>
          <span className="text-xs text-slate-500">
            Duration: {doctor?.availability?.slotDuration || 30} mins
          </span>
        </div>

        {loadingSlots ? (
          <div className="p-8 text-center text-sm text-slate-500 animate-pulse">
            Checking doctor calendar and reserved slots...
          </div>
        ) : !selectedDate ? (
          <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-400">
            Please pick a consultation date above to view time slots.
          </div>
        ) : !isWorkingDay ? (
          <div className="p-6 text-center bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-xs text-rose-600 dark:text-rose-400">
            {doctor?.fullName} is off on {selectedDayName}s. Available days: {availableWeekdays.join(', ')}.
          </div>
        ) : slots.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500">
            No time slots available for this date. Please select another date.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Morning Slots */}
            {morningSlots.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Morning
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {morningSlots.map((slot) => {
                    const isSelected = selectedSlot?.startTime === slot.startTime;
                    return (
                      <button
                        key={slot.startTime}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                          isSelected
                            ? 'bg-sky-600 border-sky-600 text-white shadow-md shadow-sky-600/20 font-bold scale-102'
                            : slot.available
                            ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-sky-500 hover:text-sky-600'
                            : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed line-through'
                        }`}
                        title={
                          slot.isBooked
                            ? 'Already booked'
                            : slot.isPast
                            ? 'Past time'
                            : 'Available'
                        }
                      >
                        {formatTime(slot.startTime)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Afternoon Slots */}
            {afternoonSlots.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Afternoon & Evening
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {afternoonSlots.map((slot) => {
                    const isSelected = selectedSlot?.startTime === slot.startTime;
                    return (
                      <button
                        key={slot.startTime}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                          isSelected
                            ? 'bg-sky-600 border-sky-600 text-white shadow-md shadow-sky-600/20 font-bold scale-102'
                            : slot.available
                            ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-sky-500 hover:text-sky-600'
                            : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed line-through'
                        }`}
                        title={
                          slot.isBooked
                            ? 'Already booked'
                            : slot.isPast
                            ? 'Past time'
                            : 'Available'
                        }
                      >
                        {formatTime(slot.startTime)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
