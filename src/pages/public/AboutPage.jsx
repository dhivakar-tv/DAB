import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ShieldCheck, Award, Users, Stethoscope, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
          About MediCare
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Pioneering Patient-Centered Healthcare Scheduling
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          MediCare was built to streamline access to clinical specialists. We eliminate waiting
          friction, double bookings, and communication gaps through transparent scheduling and
          automated notifications.
        </p>
      </div>

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 rounded-2xl w-fit">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            100% Verified Specialists
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Every physician profile on MediCare goes through rigorous administrative verification of
            medical licenses, board certifications, and clinical experience.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 rounded-2xl w-fit">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Zero Double-Booking Guarantee
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Our cloud database utilizes transactional atomic reservations, guaranteeing that time
            slots can never be simultaneously claimed by multiple patients.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl w-fit">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Integrated Role Dashboards
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Dedicated consoles for Patients, Doctors, and Hospital Administrators provide complete
            visibility into booking queues, working schedules, and analytics.
          </p>
        </div>
      </div>

      {/* Leadership & Clinical Advisors */}
      <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Medical Leadership
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Clinical Direction & Governance
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Sarah Jenkins, MD',
              role: 'Chief Medical Officer',
              spec: 'Cardiology Specialist',
              img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=350',
            },
            {
              name: 'Dr. Marcus Chen, MD',
              role: 'Head of Neurology',
              spec: 'Neuroscience Research Lead',
              img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=350',
            },
            {
              name: 'Dr. Amara Patel, MD',
              role: 'Director of Outpatient Care',
              spec: 'Dermatological Therapeutics',
              img: 'https://images.unsplash.com/photo-1594824813590-789a5e128399?auto=format&fit=crop&q=80&w=350',
            },
          ].map((person, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
              <img
                src={person.img}
                alt={person.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sky-500/20"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{person.name}</h4>
                <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">{person.role}</p>
                <p className="text-[11px] text-slate-400">{person.spec}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-gradient-to-r from-sky-600 to-teal-600 text-white p-8 sm:p-12 rounded-3xl text-center space-y-4">
        <h3 className="text-2xl font-black">Ready to schedule your consultation?</h3>
        <p className="text-xs sm:text-sm text-sky-100 max-w-md mx-auto">
          Explore our board-certified medical specialists and book your appointment in seconds.
        </p>
        <Link
          to="/doctors"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-sky-700 font-bold text-xs rounded-xl shadow-lg hover:bg-sky-50 transition"
        >
          <span>Find a Doctor Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
