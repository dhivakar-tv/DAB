import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { getDoctors, updateDoctor, getSpecialties } from '../../services/dbService';
import { Stethoscope, DollarSign, Award, MapPin, Save, User } from 'lucide-react';

export default function DoctorProfileSettings() {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [doctor, setDoctor] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [fullName, setFullName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [experience, setExperience] = useState(10);
  const [consultationFee, setConsultationFee] = useState(150);
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const specs = await getSpecialties();
      setSpecialties(specs);

      const allDocs = await getDoctors();
      const currentDoc =
        allDocs.find((d) => d.uid === user.uid || d.doctorId === user.uid || d.fullName === user.fullName) ||
        allDocs[0];

      if (currentDoc) {
        setDoctor(currentDoc);
        setFullName(currentDoc.fullName || '');
        setSpecialty(currentDoc.specialty || '');
        setQualifications(currentDoc.qualifications || '');
        setExperience(currentDoc.experience || 10);
        setConsultationFee(currentDoc.consultationFee || 150);
        setLocation(currentDoc.location || '');
        setBio(currentDoc.bio || '');
      }
    }
    loadData();
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!doctor) return;

    setSaving(true);
    try {
      await updateDoctor(doctor.doctorId, {
        fullName,
        specialty,
        qualifications,
        experience: Number(experience),
        consultationFee: Number(consultationFee),
        location,
        bio,
      });

      showToast('Doctor profile and consultation fee updated successfully.', 'success');
    } catch (err) {
      showToast('Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Professional Settings
        </span>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
          Profile & Consultation Fees
        </h1>
        <p className="text-xs text-slate-500">
          Update public credentials, clinical specialty, bio, and consultation fee per visit.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Display Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Medical Specialty *
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              >
                {specialties.map((s) => (
                  <option key={s.specialtyId} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Qualifications & Degrees *
              </label>
              <input
                type="text"
                required
                placeholder="MD, FACC - Harvard"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Experience (Years)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                required
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Consultation Fee ($) *
              </label>
              <input
                type="number"
                min={0}
                step={5}
                required
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Clinic / Hospital Location
            </label>
            <input
              type="text"
              placeholder="e.g. Metro Heart Institute, Suite 402, New York"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Clinical Biography & Practice Focus
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your areas of clinical focus, patient philosophy, and specialties..."
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
