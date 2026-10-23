import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSpecialties, getDoctors } from '../../services/dbService';
import DoctorCard from '../../components/booking/DoctorCard';
import BookingModal from '../../components/booking/BookingModal';
import {
  HeartPulse,
  Search,
  Calendar,
  CheckCircle2,
  Shield,
  Clock,
  Award,
  ArrowRight,
  Star,
  Users,
  Sparkles,
  Brain,
  Activity,
  Baby,
  Stethoscope,
} from 'lucide-react';

export default function HomePage() {
  const [specialties, setSpecialties] = useState([]);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      const specs = await getSpecialties();
      setSpecialties(specs);
      const docs = await getDoctors({ activeOnly: true });
      setFeaturedDoctors(docs.slice(0, 3)); // top 3 featured
    }
    loadData();
  }, []);

  const handleBookDoctor = (doc) => {
    setSelectedDoctorForBooking(doc);
    setBookingModalOpen(true);
  };

  const specialtyIcons = {
    HeartPulse: <HeartPulse className="w-6 h-6 text-rose-500" />,
    Sparkles: <Sparkles className="w-6 h-6 text-amber-500" />,
    Brain: <Brain className="w-6 h-6 text-purple-500" />,
    Activity: <Activity className="w-6 h-6 text-blue-500" />,
    Baby: <Baby className="w-6 h-6 text-emerald-500" />,
    Stethoscope: <Stethoscope className="w-6 h-6 text-sky-500" />,
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-sky-50/70 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 text-xs font-bold border border-sky-200 dark:border-sky-800 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                <span>Next-Gen Healthcare Scheduling</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Find Top Doctors & Book <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500">
                  Appointments Instantly.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Skip the waiting room. Connect with verified medical specialists, check real-time
                slot availability with double-booking protection, and receive automated reminders.
              </p>

              {/* Quick Search Box */}
              <div className="bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-2xl shadow-xl shadow-sky-900/5 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-2 max-w-xl">
                <div className="flex-1 flex items-center gap-3 px-3">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search doctor, condition, or specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                  />
                </div>
                <Link
                  to={`/doctors?q=${encodeURIComponent(searchQuery)}`}
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-sky-600/25 flex items-center justify-center gap-2"
                >
                  <span>Search Doctors</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  <span>Verified Specialists</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-sky-500" />
                  <span>No Double Bookings</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span>24/7 Real-Time Confirmation</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Decorative background glows */}
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl" />

                {/* Main Hero Card */}
                <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Live Scheduling Demo
                    </span>
                  </div>

                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600"
                    alt="Doctor with patient"
                    className="w-full h-52 object-cover rounded-2xl mb-4"
                  />

                  {/* Floating Micro Badge */}
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-teal-500 text-white">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Next Available Slot</p>
                        <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">Today &bull; 02:30 PM</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                      Open
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPECIALTY CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Clinical Departments
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Browse by Medical Specialty
            </h2>
          </div>
          <Link
            to="/doctors"
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>View All Specialties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {specialties.map((spec) => (
            <Link
              key={spec.specialtyId}
              to={`/doctors?specialty=${encodeURIComponent(spec.name)}`}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-lg transition-all group text-center flex flex-col items-center justify-center space-y-3"
            >
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:scale-110 transition-transform">
                {specialtyIcons[spec.icon] || <HeartPulse className="w-6 h-6 text-sky-500" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                  {spec.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {spec.doctorCount || 1}+ Specialists
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED DOCTORS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Verified Practitioners
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Featured Doctors
            </h2>
          </div>
          <Link
            to="/doctors"
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>Explore All Doctors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDoctors.map((doc) => (
            <DoctorCard key={doc.doctorId} doctor={doc} onBookClick={handleBookDoctor} />
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS WORKFLOW */}
      <section className="bg-slate-900 text-white py-16 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            How Appointment Booking Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Book top-rated specialists in under 60 seconds with complete transparency and zero double booking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Find Doctor',
              desc: 'Filter by clinical specialty, doctor rating, location, or consultation fee.',
            },
            {
              step: '02',
              title: 'Pick Time Slot',
              desc: 'Select your preferred consultation date and available real-time slot.',
            },
            {
              step: '03',
              title: 'Confirm Booking',
              desc: 'Provide your visit reason. Our transaction lock prevents concurrent booking.',
            },
            {
              step: '04',
              title: 'Care & Reminders',
              desc: 'Doctor reviews request, and you receive automated confirmations and alerts.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 relative overflow-hidden"
            >
              <span className="text-3xl font-black text-slate-700 block">
                {item.step}
              </span>
              <h4 className="text-sm font-bold text-white">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PATIENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Patient Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Trusted by Thousands of Patients
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Sarah Thompson',
              role: 'Patient',
              text: 'Booking Dr. Sarah Jenkins took literally 30 seconds. I received my approval notification immediately, and the consultation started right on time.',
              rating: 5,
            },
            {
              name: 'Michael Davis',
              role: 'Patient',
              text: 'The ability to view doctor availability, break times, and fee upfront gives complete peace of mind. Excellent interface and experience.',
              rating: 5,
            },
            {
              name: 'Dr. James Wilson',
              role: 'General Physician',
              text: 'As a doctor, the dedicated dashboard simplifies schedule management and patient queues tremendously. No conflicting slots ever occur.',
              rating: 5,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: item.rating }).map((_, r) => (
                  <Star key={r} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "{item.text}"
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</p>
                <p className="text-[10px] text-slate-400">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Modal */}
      {selectedDoctorForBooking && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          doctor={selectedDoctorForBooking}
        />
      )}
    </div>
  );
}
