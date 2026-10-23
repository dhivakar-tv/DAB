import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDoctors, getSpecialties } from '../../services/dbService';
import DoctorCard from '../../components/booking/DoctorCard';
import BookingModal from '../../components/booking/BookingModal';
import { SkeletonCard } from '../../components/common/Skeleton';
import { Search, Filter, RotateCcw, AlertCircle, ArrowUpDown } from 'lucide-react';

export default function FindDoctorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSpecialty = searchParams.get('specialty') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'experience' | 'fee-asc' | 'fee-desc'

  // Booking Modal
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    async function init() {
      const specs = await getSpecialties();
      setSpecialties(specs);
    }
    init();
  }, []);

  useEffect(() => {
    async function fetchDocs() {
      setLoading(true);
      try {
        const results = await getDoctors({
          specialty: selectedSpecialty,
          queryText: searchQuery,
          activeOnly: true,
        });

        // Sorting
        let sorted = [...results];
        if (sortBy === 'rating') {
          sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === 'experience') {
          sorted.sort((a, b) => (b.experience || 0) - (a.experience || 0));
        } else if (sortBy === 'fee-asc') {
          sorted.sort((a, b) => (a.consultationFee || 0) - (b.consultationFee || 0));
        } else if (sortBy === 'fee-desc') {
          sorted.sort((a, b) => (b.consultationFee || 0) - (a.consultationFee || 0));
        }

        setDoctors(sorted);
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, [selectedSpecialty, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedSpecialty('All');
    setSearchQuery('');
    setSortBy('rating');
    setSearchParams({});
  };

  const handleBookDoctor = (doc) => {
    setSelectedDoctorForBooking(doc);
    setBookingModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
          Find Specialist
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
          Explore Certified Doctors
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Book appointments with verified healthcare professionals across top medical disciplines.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Text Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by doctor name, qualification, or condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Specialty Filter */}
        <div className="w-full md:w-56">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="All">All Specialties</option>
            {specialties.map((s) => (
              <option key={s.specialtyId} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div className="w-full md:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="rating">Highest Rated</option>
            <option value="experience">Most Experienced</option>
            <option value="fee-asc">Fee: Low to High</option>
            <option value="fee-desc">Fee: High to Low</option>
          </select>
        </div>

        {/* Reset */}
        {(selectedSpecialty !== 'All' || searchQuery !== '') && (
          <button
            onClick={handleResetFilters}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition"
            title="Reset filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Active Count & Feedback */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="text-slate-900 dark:text-white">{doctors.length}</strong> available doctor{doctors.length === 1 ? '' : 's'}
        </span>
        {selectedSpecialty !== 'All' && (
          <span className="bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 px-2.5 py-0.5 rounded-full font-semibold">
            Filtered by: {selectedSpecialty}
          </span>
        )}
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-sky-50 dark:bg-sky-950 text-sky-500 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              No doctors found
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your search criteria or clearing specialty filters.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <DoctorCard key={doc.doctorId} doctor={doc} onBookClick={handleBookDoctor} />
          ))}
        </div>
      )}

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
