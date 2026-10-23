import React, { useState } from 'react';
import { formatDate, formatTime, getTodayDateString } from '../../utils/dateUtils';
import Badge from '../common/Badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User } from 'lucide-react';

export default function CalendarView({ appointments = [], onSelectAppointment }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(getTodayDateString());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of month and total days
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Group appointments by date
  const appointmentsByDate = {};
  appointments.forEach((apt) => {
    if (apt.appointmentDate) {
      if (!appointmentsByDate[apt.appointmentDate]) {
        appointmentsByDate[apt.appointmentDate] = [];
      }
      appointmentsByDate[apt.appointmentDate].push(apt);
    }
  });

  const selectedDayAppointments = appointmentsByDate[selectedDay] || [];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Calendar Grid Side */}
        <div className="flex-1">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span>
                {monthNames[month]} {year}
              </span>
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank leading days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`blank-${i}`} className="h-10 rounded-xl" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayApts = appointmentsByDate[dateStr] || [];
              const isSelected = selectedDay === dateStr;
              const isToday = getTodayDateString() === dateStr;

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDay(dateStr)}
                  className={`relative h-11 rounded-xl text-xs font-medium flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/30'
                      : isToday
                      ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{dayNum}</span>
                  {dayApts.length > 0 && (
                    <span className="flex gap-0.5 mt-0.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-white' : 'bg-teal-500'
                        }`}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Appointments Sidebar */}
        <div className="md:w-80 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-6 flex flex-col">
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Schedule for
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {formatDate(selectedDay)}
            </h4>
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto max-h-72">
            {selectedDayAppointments.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400">
                No appointments scheduled on this day.
              </div>
            ) : (
              selectedDayAppointments.map((apt) => (
                <div
                  key={apt.appointmentId}
                  onClick={() => onSelectAppointment && onSelectAppointment(apt)}
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-sky-400 transition cursor-pointer text-xs"
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="font-bold text-slate-900 dark:text-white truncate">
                      {apt.doctorName || apt.patientName}
                    </span>
                    <Badge status={apt.status} />
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-sky-500" />
                    <span>{formatTime(apt.startTime)}</span>
                    <span>&bull;</span>
                    <span className="truncate">{apt.specialty}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
