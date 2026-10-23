import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDoctorById, getReviews, addReview } from '../../services/dbService';
import BookingModal from '../../components/booking/BookingModal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { formatDate } from '../../utils/dateUtils';
import {
  Star,
  Award,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export default function DoctorDetailPage() {
  const { doctorId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useNotification();

  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadDoctor() {
      setLoading(true);
      try {
        const doc = await getDoctorById(doctorId);
        setDoctor(doc);
        if (doc) {
          const revs = await getReviews(doc.doctorId);
          setReviews(revs);
        }
      } finally {
        setLoading(false);
      }
    }
    loadDoctor();
  }, [doctorId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please log in as a patient to submit a review.', 'warning');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('Please enter review comments.', 'warning');
      return;
    }

    setSubmittingReview(true);
    try {
      const newRev = await addReview({
        doctorId: doctor.doctorId,
        patientId: user.uid,
        patientName: user.fullName || 'Anonymous Patient',
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviews([newRev, ...reviews]);
      setReviewComment('');
      showToast('Thank you! Your review has been submitted.', 'success');
      // Refresh doctor details to reflect new rating
      const updatedDoc = await getDoctorById(doctorId);
      setDoctor(updatedDoc);
    } catch (err) {
      showToast('Failed to submit review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mx-auto mb-4" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mx-auto" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Doctor not found</h2>
        <Link
          to="/doctors"
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Doctor Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/doctors"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Doctors</span>
      </Link>

      {/* Main Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start gap-8">
        <img
          src={doctor.profileImage}
          alt={doctor.fullName}
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover ring-4 ring-sky-500/10 shrink-0"
        />

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 text-xs font-bold">
              {doctor.specialty}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{doctor.rating || 5.0}</span>
              <span className="text-slate-400">({doctor.reviewCount || 0} reviews)</span>
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" /> Board Verified
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {doctor.fullName}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {doctor.qualifications}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 pt-1">
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4 text-teal-600" />
              <strong>{doctor.experience} Years</strong> Clinical Practice
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-rose-500" />
              {doctor.location || 'Metro Health Medical Center'}
            </span>
          </div>
        </div>

        {/* Booking CTA Box */}
        <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shrink-0">
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
              Consultation Fee
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              ${doctor.consultationFee}
            </span>
            <span className="text-xs text-slate-500 block">Per 30-min visit</span>
          </div>

          <button
            onClick={() => setBookingModalOpen(true)}
            className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/25 transition active:scale-95"
          >
            Book Appointment
          </button>
        </div>
      </div>

      {/* Grid: Biography & Working Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Biography & Background */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>About Dr. {doctor.fullName.split(' ')[1] || doctor.fullName}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {doctor.bio}
            </p>
          </div>

          {/* Patient Reviews Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                <span>Patient Reviews & Experiences ({reviews.length})</span>
              </h3>
            </div>

            {/* Leave a Review Form */}
            <form
              onSubmit={handleReviewSubmit}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Write a Review
              </h4>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= reviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={2}
                placeholder="Share your consultation experience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
              />

              <button
                type="submit"
                disabled={submittingReview}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition"
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>

            {/* Review List */}
            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No patient reviews yet. Be the first to share your experience!
                </p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.reviewId} className="pt-3 first:pt-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {rev.patientName}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {formatDate(rev.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Working Schedule Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Consultation Schedule</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Working Days</span>
                <span className="font-bold text-slate-900 dark:text-white text-right">
                  {doctor.availability?.days?.join(', ') || 'Mon - Fri'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Hours</span>
                <span className="font-semibold text-sky-600 dark:text-sky-400">
                  {doctor.availability?.startTime || '09:00'} - {doctor.availability?.endTime || '17:00'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Break Period</span>
                <span className="font-medium text-slate-500">
                  {doctor.availability?.breakStartTime || '13:00'} - {doctor.availability?.breakEndTime || '14:00'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Slot Duration</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {doctor.availability?.slotDuration || 30} Minutes
                </span>
              </div>
            </div>

            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Select Date & Slot
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        doctor={doctor}
      />
    </div>
  );
}
