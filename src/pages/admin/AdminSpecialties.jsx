import React, { useState, useEffect } from 'react';
import { getSpecialties, addSpecialty, deleteSpecialty, getDoctors } from '../../services/dbService';
import { useNotification } from '../../context/NotificationContext';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Award, Plus, Trash2, HeartPulse, Sparkles, Brain, Activity, Baby, Stethoscope } from 'lucide-react';

export default function AdminSpecialties() {
  const { showToast } = useNotification();
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('HeartPulse');
  const [description, setDescription] = useState('');

  // Delete Confirm Dialog state
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    specialtyId: null,
    specialtyName: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [specs, docs] = await Promise.all([getSpecialties(), getDoctors()]);
      setSpecialties(specs);
      setDoctors(docs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getDoctorCount = (specName) => {
    return doctors.filter((d) => d.specialty?.toLowerCase() === specName?.toLowerCase()).length;
  };

  const handleCreateSpecialty = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await addSpecialty({
        name: name.trim(),
        icon,
        description: description.trim(),
      });
      showToast(`Specialty "${name}" added successfully.`, 'success');
      setName('');
      setDescription('');
      setModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Failed to add specialty.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.specialtyId) return;
    try {
      await deleteSpecialty(deleteConfirm.specialtyId);
      showToast(`Specialty deleted.`, 'success');
      setDeleteConfirm({ isOpen: false, specialtyId: null, specialtyName: '' });
      loadData();
    } catch (err) {
      showToast('Failed to delete specialty.', 'error');
    }
  };

  const iconOptions = [
    { label: 'HeartPulse (Cardiology)', value: 'HeartPulse' },
    { label: 'Brain (Neurology)', value: 'Brain' },
    { label: 'Sparkles (Dermatology)', value: 'Sparkles' },
    { label: 'Activity (Orthopedics)', value: 'Activity' },
    { label: 'Baby (Pediatrics)', value: 'Baby' },
    { label: 'Stethoscope (General Medicine)', value: 'Stethoscope' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Departments
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Medical Specialties
          </h1>
          <p className="text-xs text-slate-500">
            Configure clinical disciplines, category tags, and specialty descriptions.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Specialty</span>
        </button>
      </div>

      {/* Specialties Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialties.map((spec) => {
          const docCount = getDoctorCount(spec.name);
          return (
            <div
              key={spec.specialtyId}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {docCount} Doctor{docCount === 1 ? '' : 's'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{spec.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {spec.description || 'Clinical specialty department.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() =>
                    setDeleteConfirm({
                      isOpen: true,
                      specialtyId: spec.specialtyId,
                      specialtyName: spec.name,
                    })
                  }
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                  title="Delete specialty"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Specialty Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Medical Specialty"
      >
        <form onSubmit={handleCreateSpecialty} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Specialty Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ophthalmology, Psychiatry"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Icon Symbol
            </label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            >
              {iconOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Clinical Scope & Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe clinical scope and target conditions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-sm"
            >
              Add Department
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, specialtyId: null, specialtyName: '' })}
        onConfirm={handleConfirmDelete}
        title="Delete Specialty"
        message={`Are you sure you want to delete "${deleteConfirm.specialtyName}"?`}
        isDanger={true}
      />
    </div>
  );
}
