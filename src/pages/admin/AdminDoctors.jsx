import React, { useState, useEffect } from 'react';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor, getSpecialties } from '../../services/dbService';
import { useNotification } from '../../context/NotificationContext';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import {
  Stethoscope,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Star,
  Award,
} from 'lucide-react';

export default function AdminDoctors() {
  const { showToast } = useNotification();
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    specialty: '',
    qualifications: '',
    experience: 10,
    consultationFee: 150,
    location: '',
    bio: '',
    profileImage: '',
    active: true,
  });

  // Delete Confirm Dialog state
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    doctorId: null,
    doctorName: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [docs, specs] = await Promise.all([getDoctors(), getSpecialties()]);
      setDoctors(docs);
      setSpecialties(specs);
      if (specs.length > 0 && !formData.specialty) {
        setFormData((prev) => ({ ...prev, specialty: specs[0].name }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingDoctor(null);
    setFormData({
      fullName: '',
      specialty: specialties[0]?.name || 'Cardiology',
      qualifications: 'MD, FACC',
      experience: 10,
      consultationFee: 150,
      location: 'Metro Health Medical Center',
      bio: 'Board-certified specialist committed to high-quality care.',
      profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setEditingDoctor(doc);
    setFormData({
      fullName: doc.fullName || '',
      specialty: doc.specialty || '',
      qualifications: doc.qualifications || '',
      experience: doc.experience || 10,
      consultationFee: doc.consultationFee || 150,
      location: doc.location || '',
      bio: doc.bio || '',
      profileImage: doc.profileImage || '',
      active: doc.active !== undefined ? doc.active : true,
    });
    setModalOpen(true);
  };

  const handleSaveDoctor = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await updateDoctor(editingDoctor.doctorId, formData);
        showToast(`Doctor ${formData.fullName} updated successfully.`, 'success');
      } else {
        await createDoctor(formData);
        showToast(`Doctor ${formData.fullName} added successfully.`, 'success');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Failed to save doctor.', 'error');
    }
  };

  const handleToggleActive = async (doc) => {
    try {
      const newActive = !doc.active;
      await updateDoctor(doc.doctorId, { active: newActive });
      showToast(
        `${doc.fullName} is now ${newActive ? 'Active and listed' : 'Deactivated'}`,
        'info'
      );
      loadData();
    } catch (err) {
      showToast('Failed to change status.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.doctorId) return;
    try {
      await deleteDoctor(deleteConfirm.doctorId);
      showToast(`Doctor profile removed.`, 'success');
      setDeleteConfirm({ isOpen: false, doctorId: null, doctorName: '' });
      loadData();
    } catch (err) {
      showToast('Failed to delete doctor.', 'error');
    }
  };

  const filteredDoctors = doctors.filter((d) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      d.fullName?.toLowerCase().includes(q) ||
      d.specialty?.toLowerCase().includes(q) ||
      d.qualifications?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Staff Directory
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Doctor Management
          </h1>
          <p className="text-xs text-slate-500">
            Add new doctors, update credentials, activate or deactivate doctor profiles.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search doctors by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <span className="text-xs text-slate-500">
          Total Doctors: <strong className="text-slate-900 dark:text-white">{doctors.length}</strong>
        </span>
      </div>

      {/* Doctors Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                <th className="p-4">Doctor</th>
                <th className="p-4">Specialty & Qualifications</th>
                <th className="p-4">Experience & Rating</th>
                <th className="p-4">Fee ($)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDoctors.map((doc) => (
                <tr
                  key={doc.doctorId}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.profileImage}
                        alt={doc.fullName}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{doc.fullName}</p>
                        <p className="text-[11px] text-slate-400">{doc.location || 'Metro Clinic'}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold text-[11px]">
                      {doc.specialty}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">{doc.qualifications}</p>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {doc.experience} Years Exp
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{doc.rating || 5.0}</span>
                      <span className="text-slate-400">({doc.reviewCount || 0})</span>
                    </div>
                  </td>

                  <td className="p-4 whitespace-nowrap font-black text-slate-900 dark:text-white">
                    ${doc.consultationFee}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(doc)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                        doc.active
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                      title="Click to toggle Active status"
                    >
                      {doc.active ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Inactive
                        </>
                      )}
                    </button>
                  </td>

                  <td className="p-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(doc)}
                        className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-lg transition"
                        title="Edit Doctor"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            isOpen: true,
                            doctorId: doc.doctorId,
                            doctorName: doc.fullName,
                          })
                        }
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                        title="Delete Doctor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Doctor Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDoctor ? `Edit ${editingDoctor.fullName}` : 'Add New Doctor'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveDoctor} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Specialty *
              </label>
              <select
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
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
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Qualifications *
              </label>
              <input
                type="text"
                required
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Experience (Years)
              </label>
              <input
                type="number"
                min={1}
                required
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Consultation Fee ($) *
              </label>
              <input
                type="number"
                min={0}
                required
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Profile Image URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.profileImage}
              onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Clinical Bio
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="activeDoctor"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
            />
            <label htmlFor="activeDoctor" className="font-semibold text-slate-700 dark:text-slate-300">
              Active and visible for patient bookings
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-sm"
            >
              Save Doctor
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, doctorId: null, doctorName: '' })}
        onConfirm={handleConfirmDelete}
        title="Remove Doctor Profile"
        message={`Are you sure you want to delete ${deleteConfirm.doctorName}? This action will permanently remove this physician from the system.`}
        isDanger={true}
      />
    </div>
  );
}
