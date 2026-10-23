import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How do I book an appointment with a specialist?',
      a: 'Browse the "Find Doctors" catalog, filter by your required medical specialty or doctor name, and click "Book Now". Select an available date, pick an open time slot from the doctor\'s working schedule, enter the reason for your visit, and confirm. Your booking will be submitted immediately.',
    },
    {
      q: 'How does MediCare prevent double booking of time slots?',
      a: 'We implement atomic transaction reservation logic at the database layer (via Cloud Firestore transactions / concurrency check). When two patients attempt to book the identical doctor and time slot simultaneously, the first transaction locks the slot; the second attempt is gracefully rejected with a notification explaining that the slot was just taken.',
    },
    {
      q: 'What do the different appointment statuses mean?',
      a: 'Pending: The booking request has been submitted by the patient and is waiting for doctor review. Approved: The doctor has confirmed the consultation. Rejected: The doctor was unable to accept the request (with a stated reason). Completed: The consultation took place. Cancelled: Either patient, doctor, or administrator cancelled the appointment.',
    },
    {
      q: 'Can I reschedule or cancel my appointment?',
      a: 'Yes. From your Patient Dashboard under "My Appointments", any Pending or Approved appointment can be rescheduled to a new open date and time, or cancelled with a confirmation prompt.',
    },
    {
      q: 'How do doctor availability schedules and break times work?',
      a: 'Each doctor sets their working days (e.g. Monday to Friday), consultation start and end hours (e.g. 09:00 to 17:00), default slot duration (e.g. 30 minutes), and lunch/break hours (e.g. 13:00 to 14:00). Slots during break times or past time periods are automatically withheld from patient booking.',
    },
    {
      q: 'How does Role-Based Access Control (RBAC) work?',
      a: 'MediCare strictly enforces three separate roles: Patient, Doctor, and Admin. Public registrations default strictly to Patient. Doctor accounts require credential onboarding, and Admin accounts require elevated backend authorization. Navigation routes and database operations verify role privileges.',
    },
    {
      q: 'How do email and in-app notifications operate?',
      a: 'Whenever an appointment is booked, approved, rejected, cancelled, or rescheduled, instant in-app alerts appear in the recipient\'s notification bell. In addition, automated transactional email dispatch is triggered through Cloud Functions (or captured in demo email inspection logs).',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
          Support & Help
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Find answers to common questions about booking, scheduling rules, roles, and automated notifications.
        </p>
      </div>

      {/* Accordion */}
      <div className="space-y-3">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs transition"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>{item.q}</span>
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
