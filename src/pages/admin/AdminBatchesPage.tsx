import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  LogOut,
  Upload,
  Calendar,
  X,
  AlertCircle,
  Save,
  ShieldCheck,
  Search,
  Image as ImageIcon,
  Scissors,
  GraduationCap
} from 'lucide-react';
import { BatchItem, BatchCategory, BatchStatus } from '../../types';
import { batchService } from '../../services/batchService';
import { usePageSEO } from '../../hooks/usePageSEO';
import { formatEventDateRange, toInputDateFormat } from '../../utils/dateUtils';

interface BatchFormState {
  id?: string;
  slug: string;
  title: string;
  category: BatchCategory;
  status: BatchStatus;
  badge: string;
  startDate: string;
  endDate: string;
  timing: string;
  duration: string;
  fee: number;
  totalSeats: number;
  seatsRemaining: number;
  image: string;
  leadTrainer: string;
  venue: string;
  prerequisites: string;
  includedText: string;
  curriculumText: string;
  description: string;
  whatsappPreset: string;
}

const DEFAULT_FORM: BatchFormState = {
  slug: '',
  title: '',
  category: 'workshop',
  status: 'enrolling',
  badge: '',
  startDate: '',
  endDate: '',
  timing: '',
  duration: '',
  fee: 0,
  totalSeats: 0,
  seatsRemaining: 0,
  image: '',
  leadTrainer: 'Salma Attar (Founder & Master Beauty Educator)',
  venue: 'SK Relax Beauty Academy & Salon, Satara, Maharashtra',
  prerequisites: '',
  includedText: '',
  curriculumText: '',
  description: '',
  whatsappPreset: ''
};

export const AdminBatchesPage: React.FC = () => {
  usePageSEO({
    title: 'Admin Batch Management | SK Relax Studio',
    description: 'Dashboard to create, edit, and publish academy course batches.',
    path: '/admin/batches'
  });

  const navigate = useNavigate();
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BatchFormState>(DEFAULT_FORM);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  // 1. Auth Guard
  useEffect(() => {
    const token = batchService.getAuthToken();
    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }
    batchService.checkAuth().then(isAuthed => {
      if (!isAuthed) {
        navigate('/admin/login', { replace: true });
      }
    });
  }, [navigate]);

  // 2. Fetch Batches
  const loadBatches = async () => {
    setLoading(true);
    const data = await batchService.getBatches();
    setBatches(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const handleLogout = () => {
    batchService.logout();
    navigate('/admin/login', { replace: true });
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData(DEFAULT_FORM);
    setSaveStatus(null);
    setIsModalOpen(true);
  };

  const openEditModal = (batch: BatchItem) => {
    setIsEditing(true);
    setFormData({
      id: batch.id,
      slug: batch.slug,
      title: batch.title,
      category: batch.category,
      status: batch.status,
      badge: batch.badge || '',
      startDate: batch.startDate,
      endDate: batch.endDate,
      timing: batch.timing,
      duration: batch.duration,
      fee: batch.fee || 0,
      totalSeats: batch.totalSeats ?? 0,
      seatsRemaining: batch.seatsRemaining ?? 0,
      image: batch.image,
      leadTrainer: batch.leadTrainer,
      venue: batch.venue,
      prerequisites: batch.prerequisites || '',
      includedText: (batch.included || []).join('\n'),
      curriculumText: (batch.curriculum || []).join('\n'),
      description: batch.description,
      whatsappPreset: batch.whatsappPreset || ''
    });
    setSaveStatus(null);
    setIsModalOpen(true);
  };

  const handleQuickStatusChange = async (id: string, newStatus: BatchStatus) => {
    const res = await batchService.updateBatch(id, { status: newStatus });
    if (res.success) {
      await loadBatches();
    } else {
      alert(`Could not update status: ${res.error || 'Error'}`);
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setSaveStatus(null);
    const result = await batchService.uploadImage(file);
    setUploadingImage(false);

    if (result.success && result.url) {
      setFormData(prev => ({ ...prev, image: result.url! }));
    } else {
      alert(`Upload error: ${result.error || 'Failed to upload image'}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving batch...');

    const payload: Partial<BatchItem> = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: formData.category,
      status: formData.status,
      badge: formData.badge,
      startDate: formData.startDate,
      endDate: formData.endDate || formData.startDate,
      timing: formData.timing,
      duration:
        formData.duration ||
        (!formData.endDate || formData.startDate === formData.endDate
          ? '1 Day Workshop'
          : ''),
      fee: Number(formData.fee) || 0,
      feeDisplay:
        Number(formData.fee) > 0
          ? `₹${Number(formData.fee).toLocaleString('en-IN')}`
          : 'Fee on Request',
      totalSeats: Number(formData.totalSeats) || 0,
      seatsRemaining: Number(formData.seatsRemaining) || 0,
      image: formData.image,
      leadTrainer: formData.leadTrainer,
      venue: formData.venue,
      prerequisites: formData.prerequisites,
      included: formData.includedText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean),
      curriculum: formData.curriculumText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean),
      description: formData.description,
      whatsappPreset:
        formData.whatsappPreset ||
        `Hello Salma Ma'am, I am interested in enrolling for the ${formData.title} at SK Relax Academy Satara.`
    };

    let result;
    if (isEditing && formData.id) {
      result = await batchService.updateBatch(formData.id, payload);
    } else {
      result = await batchService.createBatch(payload);
    }

    if (result.success) {
      setSaveStatus('Batch saved successfully to server!');
      await loadBatches();
      setTimeout(() => {
        setIsModalOpen(false);
        setSaveStatus(null);
      }, 500);
    } else {
      setSaveStatus(`Error: ${result.error || 'Failed to save batch'}`);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await batchService.deleteBatch(id);
    if (result.success) {
      setDeleteId(null);
      await loadBatches();
    } else {
      alert(`Failed to delete: ${result.error || 'Error'}`);
    }
  };

  const filteredBatches = batches.filter(b => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-cream-100 min-h-screen text-forest-900 pb-16">
      {/* Top Admin Navbar */}
      <header className="bg-forest-950 text-ivory border-b border-forest-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-forest-900 border border-gold-500/40 flex items-center justify-center text-gold-300">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h1 className="font-serif text-lg text-white font-medium">SK Relax CMS</h1>
              <p className="text-[10px] text-gold-300 font-sans uppercase tracking-widest">
                Academy Batches Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <nav className="flex items-center gap-2">
              <Link
                to="/admin/services"
                className="px-3 py-1.5 rounded-sm text-xs text-ivory-300 hover:text-white font-sans hover:bg-forest-900/60 transition-colors flex items-center gap-1.5"
              >
                <Scissors size={13} />
                <span>Salon Services</span>
              </Link>
              <span className="px-3 py-1.5 rounded-sm bg-forest-900 border border-gold-500/40 text-xs text-gold-300 font-sans font-medium flex items-center gap-1.5 shadow-xs">
                <GraduationCap size={13} />
                <span>Academy Batches</span>
              </span>
            </nav>

            <div className="h-5 w-px bg-forest-800" />

            <Link
              to="/batches"
              target="_blank"
              className="text-xs text-ivory-300 hover:text-gold-300 font-sans inline-flex items-center gap-1.5 transition-colors"
            >
              <span className="hidden sm:inline">View Public Batches</span>
              <ExternalLink size={13} />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-forest-900 hover:bg-forest-800 text-xs text-rose-300 font-sans transition-colors border border-forest-800"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-forest-900">
              Academy Course Batches ({batches.length})
            </h2>
            <p className="text-xs text-forest-600 font-sans mt-1">
              Create, update status, and manage masterclasses saved directly to server disk.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-400" />
              <input
                type="text"
                placeholder="Search batches..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs bg-white border border-forest-900/15 rounded-sm font-sans text-forest-900 focus:outline-none focus:border-forest-900 w-48 sm:w-64"
              />
            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-forest-900 hover:bg-forest-850 text-gold-300 text-xs font-sans font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              <Plus size={15} />
              <span>Add Batch</span>
            </button>
          </div>
        </div>

        {/* Batch Cards Grid */}
        {loading ? (
          <div className="py-20 text-center text-sm font-sans text-forest-600">
            Loading batches from disk...
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-sm border border-forest-900/10">
            <p className="font-serif text-lg text-forest-900">No batches currently found.</p>
            <button
              onClick={openCreateModal}
              className="mt-3 text-xs text-rose-600 underline font-sans font-semibold"
            >
              Create your first batch now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBatches.map(batch => (
              <div
                key={batch.id}
                className="bg-white rounded-sm border border-forest-900/10 shadow-soft overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Poster Thumbnail */}
                  <div className="relative h-64 sm:h-72 bg-forest-950 overflow-hidden flex items-center justify-center p-2">
                    {/* Ambient Background */}
                    <img
                      src={batch.image}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-forest-950/40 pointer-events-none" />

                    {/* Full Original Poster */}
                    <img
                      src={batch.image}
                      alt={batch.title}
                      className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain mx-auto drop-shadow-md"
                    />
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-20">
                      <span
                        className={`px-2 py-0.5 rounded-sm text-[10px] font-sans font-bold uppercase tracking-wider shadow-sm ${
                          batch.status === 'enrolling'
                            ? 'bg-rose-600 text-white'
                            : batch.status === 'upcoming'
                            ? 'bg-forest-900 text-gold-300 border border-gold-500/30'
                            : batch.status === 'draft'
                            ? 'bg-amber-500 text-forest-950'
                            : batch.status === 'archived'
                            ? 'bg-neutral-800 text-neutral-300'
                            : 'bg-neutral-600 text-white'
                        }`}
                      >
                        {batch.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-sans font-semibold uppercase tracking-wider bg-forest-950/90 border border-white/10 text-white shadow-sm">
                        {batch.category}
                      </span>
                    </div>

                    <div className="absolute bottom-2 right-2 z-20">
                      <span className="px-2 py-0.5 rounded-sm text-xs font-serif font-bold bg-white text-forest-900 shadow-sm">
                        {batch.feeDisplay || `₹${batch.fee}`}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-[11px] text-forest-600 font-sans mb-1">
                      <Calendar size={12} className="text-rose-600" />
                      <span>
                        {formatEventDateRange(batch.startDate, batch.endDate)}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg text-forest-900 font-medium leading-snug">
                      {batch.title}
                    </h3>

                    <p className="mt-2 text-xs text-forest-700 font-sans line-clamp-2 leading-relaxed">
                      {batch.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-forest-900/5 flex items-center justify-between text-xs font-sans text-forest-600">
                      <span>
                        Seats:{' '}
                        <strong>
                          {batch.totalSeats && batch.totalSeats > 0
                            ? `${batch.seatsRemaining} / ${batch.totalSeats}`
                            : 'Open (Unrestricted)'}
                        </strong>
                      </span>
                      <span className="text-[11px] text-forest-500 font-mono">/{batch.slug}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 bg-cream-50 border-t border-forest-900/10 space-y-3">
                  {/* Status quick switch bar */}
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-[11px] text-forest-600 font-medium">Status:</span>
                    <select
                      value={batch.status}
                      onChange={e => handleQuickStatusChange(batch.id, e.target.value as BatchStatus)}
                      className="text-xs bg-white border border-forest-900/20 rounded-sm px-2 py-1 font-sans text-forest-900 focus:outline-none focus:border-forest-900"
                    >
                      <option value="enrolling">Enrolling Now</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="draft">Draft (Hidden)</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-forest-900/5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(batch)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm bg-white border border-forest-900/15 text-forest-900 hover:bg-forest-900 hover:text-white text-xs font-sans font-semibold transition-colors"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>

                      <Link
                        to={`/batches/${batch.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm bg-white border border-forest-900/15 text-forest-600 hover:text-forest-900 text-xs font-sans transition-colors"
                        title="View public page"
                      >
                        <ExternalLink size={12} />
                      </Link>
                    </div>

                    <button
                      onClick={() => setDeleteId(batch.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-rose-600 hover:bg-rose-50 text-xs font-sans transition-colors"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CREATE / EDIT BATCH MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-sm border border-forest-900/20 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-forest-400 hover:text-forest-900 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="text-[11px] uppercase tracking-widest text-gold-600 font-sans font-bold">
                {isEditing ? 'Update Existing Batch' : 'Create New Batch'}
              </span>
              <h3 className="font-serif text-2xl text-forest-900">
                {isEditing ? formData.title : 'New Academy Batch / Masterclass'}
              </h3>
            </div>

            {saveStatus && (
              <div className="mb-4 p-3 rounded-sm bg-forest-50 border border-forest-200 text-xs font-sans text-forest-900">
                {saveStatus}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Batch Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. 3-Day Advanced Hair Cutting Masterclass"
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-forest-900 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. hair-cutting-masterclass"
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-forest-900 font-sans"
                  />
                </div>
              </div>

              {/* Row 2: Category, Status, Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as BatchCategory })}
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-forest-900 font-sans"
                  >
                    <option value="masterclass">Masterclass</option>
                    <option value="diploma">Diploma</option>
                    <option value="workshop">Workshop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as BatchStatus })}
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-forest-900 font-sans"
                  >
                    <option value="enrolling">Enrolling Now</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Badge Callout
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Look & Learn Seminar"
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-forest-900 font-sans"
                  />
                </div>
              </div>

              {/* Row 3: Dates & Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={toInputDateFormat(formData.startDate)}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-forest-900 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    End Date (Same if 1-Day)
                  </label>
                  <input
                    type="date"
                    value={toInputDateFormat(formData.endDate)}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-forest-900 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Timing
                  </label>
                  <input
                    type="text"
                    value={formData.timing}
                    onChange={e => setFormData({ ...formData, timing: e.target.value })}
                    placeholder="e.g. 10:30 AM – 5:30 PM (Daily)"
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-forest-900 font-sans"
                  />
                </div>
              </div>

              {/* Row 4: Fee & Seats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.fee}
                    onChange={e => setFormData({ ...formData, fee: Number(e.target.value) })}
                    placeholder="4000"
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-forest-900 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Total Seats
                  </label>
                  <input
                    type="number"
                    value={formData.totalSeats}
                    onChange={e => setFormData({ ...formData, totalSeats: Number(e.target.value) })}
                    placeholder="15"
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-forest-900 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Seats Remaining
                  </label>
                  <input
                    type="number"
                    value={formData.seatsRemaining}
                    onChange={e => setFormData({ ...formData, seatsRemaining: Number(e.target.value) })}
                    placeholder="4"
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-forest-900 font-sans"
                  />
                </div>
              </div>

              {/* Row 5: Real Image Upload & URL */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                  Poster Image (File Upload or URL)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-20 h-20 rounded-sm bg-forest-950 overflow-hidden shrink-0 border border-forest-900/20">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-ivory-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-forest-900 text-gold-300 text-xs font-sans font-semibold hover:bg-forest-800 transition-colors">
                        <Upload size={13} />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                      <span className="text-[11px] text-forest-500 font-sans">
                        JPG, PNG, WebP (max 10MB)
                      </span>
                    </div>

                    <input
                      type="text"
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/images/academy/hair-cutting-masterclass-poster.jpg"
                      className="w-full px-3 py-1.5 text-xs bg-cream-50 border border-forest-900/20 rounded-sm font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Row 6: Lead Trainer & Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Lead Trainer
                  </label>
                  <input
                    type="text"
                    value={formData.leadTrainer}
                    onChange={e => setFormData({ ...formData, leadTrainer: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-forest-900 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={e => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-forest-900 font-sans"
                  />
                </div>
              </div>

              {/* Row 7: Description */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                  Description / Overview
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive description of the masterclass and learning outcomes..."
                  className="w-full px-3 py-2 text-xs bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-forest-900 font-sans"
                />
              </div>

              {/* Row 8: What's Included & Curriculum */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    What's Included (1 item per line)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.includedText}
                    onChange={e => setFormData({ ...formData, includedText: e.target.value })}
                    placeholder="Free Mannequin Dummy Head\nOfficial Certificate\nStyling Tools"
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-forest-900 font-sans font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Curriculum / Syllabus (1 topic per line)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.curriculumText}
                    onChange={e => setFormData({ ...formData, curriculumText: e.target.value })}
                    placeholder="Day 1: Elevation Degree Geometry\nDay 2: Butterfly Layer Cut\nDay 3: Client Consultation"
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-forest-900 font-sans font-mono"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-forest-900/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-sm border border-forest-900/20 text-forest-800 text-xs font-sans font-semibold hover:bg-cream-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2 rounded-sm bg-forest-900 hover:bg-forest-800 text-gold-300 text-xs font-sans font-semibold uppercase tracking-wider transition-colors shadow-md"
                >
                  <Save size={14} />
                  <span>{isEditing ? 'Save Changes' : 'Create Batch'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-6 max-w-sm w-full border border-forest-900/20 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={24} />
            </div>
            <h4 className="font-serif text-xl text-forest-900 mb-2">Delete Batch?</h4>
            <p className="text-xs text-forest-600 font-sans mb-6">
              Are you sure you want to delete this batch? This action will permanently remove it from the server database.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-sm border border-forest-900/20 text-xs font-sans font-semibold text-forest-800 hover:bg-cream-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 rounded-sm bg-rose-600 hover:bg-rose-700 text-white text-xs font-sans font-semibold shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
