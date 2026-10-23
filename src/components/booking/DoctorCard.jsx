import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Award, Clock, Calendar, CheckCircle } from 'lucide-react';

export default function DoctorCard({ doctor, onBookClick }) {
  const {
    doctorId,
    fullName,
    specialty,
    qualifications,
    experience,
    consultationFee,
    bio,
    profileImage,
    rating = 4.9,
    reviewCount = 50,
    active = true,
    location,
    availability,
  } = doctor;

  const availableDays = availability?.days?.slice(0, 3).join(', ') || 'Mon - Fri';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500/60 shadow-sm hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Top Header & Image */}
        <div className="p-6 flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={profileImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'}
              alt={fullName}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-sky-100 dark:ring-slate-800 group-hover:scale-105 transition-transform duration-300"
            />
            {active && (
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"
                title="Available for Appointments"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                {specialty}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{rating}</span>
                <span className="text-slate-400 text-[11px] font-normal">({reviewCount})</span>
              </div>
            </div>

            <Link
              to={`/doctors/${doctorId}`}
              className="block text-base font-bold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition truncate"
            >
              {fullName}
            </Link>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
              {qualifications}
            </p>

            <div className="flex items-center gap-3 mt-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>{experience} yrs exp</span>
              </span>
              <span>&bull;</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                ${consultationFee} <span className="font-normal text-slate-500 text-[10px]">/ visit</span>
              </span>
            </div>
          </div>
        </div>

        {/* Short Bio */}
        <div className="px-6 pb-4">
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {bio}
          </p>
        </div>

        {/* Schedule & Location Quick Summary */}
        <div className="px-6 py-2.5 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span className="truncate">Available: {availableDays}</span>
          </div>
          {location && (
            <div className="flex items-center gap-1.5 truncate text-[11px] text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
        <Link
          to={`/doctors/${doctorId}`}
          className="text-center py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          View Profile
        </Link>
        <button
          type="button"
          onClick={() => onBookClick(doctor)}
          className="py-2 px-3 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition shadow-sm hover:shadow-md hover:shadow-sky-600/20 active:scale-95"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
