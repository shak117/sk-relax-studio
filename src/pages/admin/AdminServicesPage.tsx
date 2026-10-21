import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  Plus,
  Edit2,
  Trash2,
  Archive,
  RotateCcw,
  Eye,
  CheckCircle,
  AlertCircle,
  Upload,
  ExternalLink,
  LogOut,
  Scissors,
  Play,
  ArrowUp,
  ArrowDown,
  Layers,
  GraduationCap,
  X
} from 'lucide-react';
import { ServiceItem, ServiceCategory, ServicePricingMode, ServicePublicationStatus } from '../../types';
import { salonService } from '../../services/salonService';
import { batchService } from '../../services/batchService';
import { ServiceCard } from '../../components/services/ServiceCard';
import { usePageSEO } from '../../hooks/usePageSEO';

const CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: 'hair-treatments', label: 'Hair Treatments & Science' },
  { id: 'facials-skin', label: 'Facials & Skin Treatments' },
  { id: 'makeup-bridal', label: 'Makeup & Bridal Artistry' },
  { id: 'permanent-makeup', label: 'Permanent Makeup (PMU)' },
  { id: 'equipment-machines', label: 'Aesthetic Machines & Tech' },
  { id: 'other', label: 'Other Salon Services' }
];

interface ServiceFormState {
  id?: string;
  title: string;
  category: ServiceCategory;
  categoryLabel?: string;
  shortDescription: string;
  description: string;
  image: string;
  thumbnail: string;
  imagePosition: string;
  videoUrl: string;
  videoPoster: string;
  pricingMode: ServicePricingMode;
  price: string;
  promotionalPrice: string;
  currency: string;
  duration: string;
  featuresText: string;
  isSignature: boolean;
  isEducational: boolean;
  badge: string;
  status: ServicePublicationStatus;
  displayOrder: number;
  whatsappMessage: string;
  whatsappNumber: string;
}

const DEFAULT_FORM: ServiceFormState = {
  title: '',
  category: 'hair-treatments',
  shortDescription: '',
  description: '',
  image: '',
  thumbnail: '',
  imagePosition: 'center center',
  videoUrl: '',
  videoPoster: '',
  pricingMode: 'enquiry',
  price: '',
  promotionalPrice: '',
  currency: '₹',
  duration: '',
  featuresText: '',
  isSignature: false,
  isEducational: false,
  badge: '',
  status: 'published',
  displayOrder: 1,
  whatsappMessage: '',
  whatsappNumber: '918459890270'
};

export const AdminServicesPage: React.FC = () => {
  usePageSEO({
    title: 'Admin Services Management | SK Relax Studio',
    description: 'Dashboard to create, edit, reorder, and publish salon services.',
    path: '/admin/services'
  });

  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ServiceFormState>(DEFAULT_FORM);
  const [previewService, setPreviewService] = useState<ServiceItem | null>(null);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // 1. Auth Guard
  useEffect(() => {
    const token = batchService.getAuthToken();
    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }
    batchService.checkAuth().then((isAuthed) => {
      if (!isAuthed) {
        navigate('/admin/login', { replace: true });
      }
    });
  }, [navigate]);

  // 2. Fetch Services
  const loadServices = async () => {
    setLoading(true);
    const data = await salonService.getAllServicesAdmin({ status: 'all' });
    setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleLogout = () => {
    batchService.logout();
    navigate('/admin/login', { replace: true });
  };

  const openCreateModal = () => {
    setIsEditing(false);
    const maxOrder = services.reduce((max, s) => Math.max(max, s.displayOrder || 0), 0);
    setFormData({
      ...DEFAULT_FORM,
      displayOrder: maxOrder + 1
    });
    setSaveStatus(null);
    setSaveError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setIsEditing(true);
    setFormData({
      id: service.id,
      title: service.title,
      category: service.category,
      categoryLabel: service.categoryLabel,
      shortDescription: service.shortDescription || '',
      description: service.description || '',
      image: service.image || '',
      thumbnail: service.thumbnail || service.image || '',
      imagePosition: service.imagePosition || 'center center',
      videoUrl: service.videoUrl || '',
      videoPoster: service.videoPoster || '',
      pricingMode: service.pricingMode || (service.price ? 'fixed' : 'enquiry'),
      price: service.price ? String(service.price).replace(/[^0-9.]/g, '') : '',
      promotionalPrice: service.promotionalPrice ? String(service.promotionalPrice).replace(/[^0-9.]/g, '') : '',
      currency: service.currency || '₹',
      duration: service.duration || '',
      featuresText: Array.isArray(service.features) ? service.features.join('\n') : '',
      isSignature: Boolean(service.isSignature),
      isEducational: Boolean(service.isEducational),
      badge: service.badge || '',
      status: service.status || 'published',
      displayOrder: service.displayOrder || 1,
      whatsappMessage: service.whatsappMessage || '',
      whatsappNumber: service.whatsappNumber || '918459890270'
    });
    setSaveStatus(null);
    setSaveError(null);
    setIsModalOpen(true);
  };

  const openPreview = (service: ServiceItem) => {
    setPreviewService(service);
    setIsPreviewOpen(true);
  };

  const openFormPreview = () => {
    const features = formData.featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const tempService: ServiceItem = {
      id: formData.id || 'preview-temp',
      title: formData.title || 'Service Title Preview',
      category: formData.category,
      categoryLabel: CATEGORIES.find((c) => c.id === formData.category)?.label || 'Salon Service',
      shortDescription: formData.shortDescription || 'Short description preview...',
      description: formData.description || '',
      image: formData.image,
      thumbnail: formData.thumbnail || formData.image,
      imagePosition: formData.imagePosition,
      videoUrl: formData.videoUrl,
      videoPoster: formData.videoPoster,
      pricingMode: formData.pricingMode,
      price: formData.price,
      promotionalPrice: formData.promotionalPrice,
      currency: formData.currency,
      duration: formData.duration,
      features,
      isSignature: formData.isSignature,
      isEducational: formData.isEducational,
      badge: formData.badge,
      status: formData.status,
      whatsappMessage: formData.whatsappMessage,
      whatsappNumber: formData.whatsappNumber
    };
    setPreviewService(tempService);
    setIsPreviewOpen(true);
  };

  // 3. Media Upload Handlers
  const handleFileUpload = async (file: File, type: 'image' | 'video') => {
    if (type === 'image') setUploadingImage(true);
    if (type === 'video') setUploadingVideo(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const res = await salonService.uploadMedia(base64, file.name, 'services');
        if (res.success && res.data?.url) {
          const uploadedUrl = res.data.url;
          if (type === 'image') {
            setFormData((prev) => ({ ...prev, image: uploadedUrl, thumbnail: prev.thumbnail || uploadedUrl }));
          } else {
            setFormData((prev) => ({ ...prev, videoUrl: uploadedUrl }));
          }
        } else {
          alert(`Upload failed: ${res.error || 'Server error'}`);
        }
        if (type === 'image') setUploadingImage(false);
        if (type === 'video') setUploadingVideo(false);
      };
      reader.onerror = () => {
        alert('Failed to read file from disk');
        if (type === 'image') setUploadingImage(false);
        if (type === 'video') setUploadingVideo(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert(`Error during upload: ${err.message}`);
      if (type === 'image') setUploadingImage(false);
      if (type === 'video') setUploadingVideo(false);
    }
  };

  // 4. Save Service
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveStatus('Saving changes to database...');

    const features = formData.featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<ServiceItem> = {
      title: formData.title.trim(),
      category: formData.category,
      categoryLabel: CATEGORIES.find((c) => c.id === formData.category)?.label || 'Salon Service',
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
      thumbnail: formData.thumbnail.trim() || formData.image.trim(),
      imagePosition: formData.imagePosition.trim(),
      videoUrl: formData.videoUrl.trim(),
      videoPoster: formData.videoPoster.trim(),
      pricingMode: formData.pricingMode,
      price: formData.price.trim(),
      promotionalPrice: formData.promotionalPrice.trim(),
      currency: formData.currency || '₹',
      duration: formData.duration.trim(),
      features,
      isSignature: formData.isSignature,
      isEducational: formData.isEducational,
      badge: formData.badge.trim(),
      status: formData.status,
      displayOrder: Number(formData.displayOrder) || 1,
      whatsappMessage: formData.whatsappMessage.trim(),
      whatsappNumber: formData.whatsappNumber.trim() || '918459890270'
    };

    let result;
    if (isEditing && formData.id) {
      result = await salonService.updateService(formData.id, payload);
    } else {
      result = await salonService.createService(payload);
    }

    if (result.success) {
      setSaveStatus('Service saved successfully!');
      await loadServices();
      setTimeout(() => {
        setIsModalOpen(false);
        setSaveStatus(null);
      }, 500);
    } else {
      setSaveError(result.error || 'Failed to save service');
      setSaveStatus(null);
    }
  };

  // 5. Quick Status Change Actions
  const handleStatusChange = async (service: ServiceItem, newStatus: ServicePublicationStatus) => {
    const res = await salonService.updateService(service.id, { status: newStatus });
    if (res.success) {
      await loadServices();
    } else {
      alert(`Error updating status: ${res.error}`);
    }
  };

  // 6. Delete or Archive
  const confirmDelete = async (archive = false) => {
    if (!deleteTarget) return;
    const res = await salonService.deleteService(deleteTarget.id, archive);
    if (res.success) {
      setDeleteTarget(null);
      await loadServices();
    } else {
      alert(`Failed: ${res.error}`);
    }
  };

  // 7. Move Order Up / Down
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredServices.length) return;

    const newOrderList = [...filteredServices];
    const temp = newOrderList[index];
    newOrderList[index] = newOrderList[targetIndex];
    newOrderList[targetIndex] = temp;

    const ids = newOrderList.map((s) => s.id);
    const res = await salonService.reorderServices(ids);
    if (res.success) {
      await loadServices();
    }
  };

  // Filtered Services list
  const filteredServices = services.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchDesc = s.shortDescription?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q);
      const matchCat = s.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  const totalPublished = services.filter((s) => s.status === 'published').length;
  const totalDrafts = services.filter((s) => s.status === 'draft').length;
  const totalArchived = services.filter((s) => s.status === 'archived').length;

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
                Services & Salon Catalogue Manager
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-3 sm:gap-6">
            <nav className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-sm bg-forest-900 border border-gold-500/40 text-xs text-gold-300 font-sans font-medium flex items-center gap-1.5 shadow-xs">
                <Scissors size={13} />
                <span>Salon Services</span>
              </span>
              <Link
                to="/admin/batches"
                className="px-3 py-1.5 rounded-sm text-xs text-ivory-300 hover:text-white font-sans hover:bg-forest-900/60 transition-colors flex items-center gap-1.5"
              >
                <GraduationCap size={13} />
                <span>Academy Batches</span>
              </Link>
            </nav>

            <div className="h-5 w-px bg-forest-800" />

            <Link
              to="/services"
              target="_blank"
              className="text-xs text-ivory-300 hover:text-gold-300 font-sans inline-flex items-center gap-1.5 transition-colors"
            >
              <span className="hidden sm:inline">View Public Website</span>
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
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-sm border border-forest-900/10 shadow-soft">
            <div className="flex items-center justify-between text-xs font-sans text-forest-600 mb-1">
              <span>Total Services</span>
              <Layers size={14} className="text-forest-400" />
            </div>
            <div className="text-2xl font-serif text-forest-950 font-normal">{services.length}</div>
          </div>

          <div className="bg-white p-4 rounded-sm border border-emerald-900/15 shadow-soft">
            <div className="flex items-center justify-between text-xs font-sans text-emerald-700 mb-1">
              <span>Published (Live)</span>
              <CheckCircle size={14} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-serif text-emerald-900 font-normal">{totalPublished}</div>
          </div>

          <div className="bg-white p-4 rounded-sm border border-amber-900/15 shadow-soft">
            <div className="flex items-center justify-between text-xs font-sans text-amber-700 mb-1">
              <span>Drafts</span>
              <Edit2 size={14} className="text-amber-600" />
            </div>
            <div className="text-2xl font-serif text-amber-900 font-normal">{totalDrafts}</div>
          </div>

          <div className="bg-white p-4 rounded-sm border border-rose-900/15 shadow-soft">
            <div className="flex items-center justify-between text-xs font-sans text-rose-700 mb-1">
              <span>Archived</span>
              <Archive size={14} className="text-rose-600" />
            </div>
            <div className="text-2xl font-serif text-rose-900 font-normal">{totalArchived}</div>
          </div>
        </div>

        {/* Section Heading & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-forest-900">
              Salon Services Catalogue ({filteredServices.length})
            </h2>
            <p className="text-xs text-forest-600 font-sans mt-1">
              Every service created here updates persistently on the server and synchronizes directly with the public website.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-forest-950 hover:bg-forest-900 text-gold-300 text-xs font-sans font-semibold tracking-wider uppercase border border-gold-500/40 shadow-soft hover:shadow-card transition-all cursor-pointer shrink-0"
          >
            <Plus size={15} />
            <span>Add New Service</span>
          </button>
        </div>

        {/* Search, Status Tabs & Category Filters */}
        <div className="bg-white p-4 rounded-sm border border-forest-900/10 shadow-soft mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['all', 'published', 'draft', 'archived'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-sans rounded-sm transition-colors whitespace-nowrap capitalize ${
                    statusFilter === st
                      ? 'bg-forest-950 text-gold-300 font-semibold shadow-xs'
                      : 'bg-cream-100 text-forest-700 hover:bg-cream-200'
                  }`}
                >
                  {st === 'all' ? 'All Services' : st}
                </button>
              ))}
            </div>

            {/* Category Dropdown & Search */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 text-xs font-sans bg-cream-50 border border-forest-900/15 rounded-sm focus:outline-none focus:border-forest-900 text-forest-900"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>

              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-400" />
                <input
                  type="text"
                  placeholder="Search title, category..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs font-sans bg-cream-50 border border-forest-900/15 rounded-sm focus:outline-none focus:border-forest-900 text-forest-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-sm border border-forest-900/10 shadow-soft overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-forest-500 font-sans text-xs">
              <div className="inline-block animate-spin w-6 h-6 border-2 border-forest-900 border-t-transparent rounded-full mb-2" />
              <p>Loading salon services from database...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="py-20 text-center text-forest-600 font-sans px-4">
              <Scissors size={32} className="mx-auto text-forest-300 mb-3" />
              <p className="text-sm font-medium">No services match your filters</p>
              <p className="text-xs text-forest-500 mt-1">Try resetting the status filter or search query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-forest-950 text-ivory text-[11px] font-semibold uppercase tracking-wider border-b border-forest-800">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4 w-20">Media</th>
                    <th className="py-3 px-4">Title & Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Pricing</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-900/10">
                  {filteredServices.map((service, idx) => (
                    <tr
                      key={service.id}
                      className="hover:bg-cream-50/70 transition-colors group"
                    >
                      {/* Order and reorder buttons */}
                      <td className="py-3 px-2 text-center text-forest-400">
                        <div className="flex flex-col items-center gap-0.5">
                          <button
                            onClick={() => handleMoveOrder(idx, 'up')}
                            disabled={idx === 0}
                            className="p-0.5 text-forest-400 hover:text-forest-900 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Move Up"
                          >
                            <ArrowUp size={11} />
                          </button>
                          <span className="text-[10px] font-mono font-semibold text-forest-700">
                            {service.displayOrder || idx + 1}
                          </span>
                          <button
                            onClick={() => handleMoveOrder(idx, 'down')}
                            disabled={idx === filteredServices.length - 1}
                            className="p-0.5 text-forest-400 hover:text-forest-900 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Move Down"
                          >
                            <ArrowDown size={11} />
                          </button>
                        </div>
                      </td>

                      {/* Thumbnail Preview */}
                      <td className="py-3 px-4">
                        <div className="w-16 h-12 rounded-sm bg-cream-200 border border-forest-900/10 overflow-hidden relative flex items-center justify-center">
                          {service.image ? (
                            <img
                              src={service.thumbnail || service.image}
                              alt={service.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[9px] text-forest-400 font-sans uppercase">No Image</span>
                          )}
                          {service.videoUrl && (
                            <div className="absolute inset-0 bg-forest-950/40 flex items-center justify-center">
                              <Play size={10} className="fill-gold-300 text-gold-300" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Title & Short Description */}
                      <td className="py-3 px-4">
                        <div className="font-serif text-sm text-forest-950 font-normal leading-snug">
                          {service.title}
                        </div>
                        <div className="text-[11px] text-forest-600 line-clamp-1 mt-0.5 font-sans">
                          {service.shortDescription}
                        </div>
                        {service.badge && (
                          <span className="inline-block mt-1 text-[9px] uppercase tracking-wider bg-gold-100 text-gold-900 px-1.5 py-0.5 rounded-xs border border-gold-300">
                            {service.badge}
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-forest-700">
                        <span className="inline-block px-2 py-0.5 rounded-sm bg-cream-100 text-forest-800 text-[10px] uppercase tracking-wider font-semibold border border-forest-900/10">
                          {service.categoryLabel || service.category}
                        </span>
                      </td>

                      {/* Pricing Mode */}
                      <td className="py-3 px-4 text-forest-800 whitespace-nowrap">
                        {service.pricingMode === 'fixed' && service.price ? (
                          <div className="font-semibold text-forest-900">
                            {service.currency || '₹'}{Number(service.price).toLocaleString('en-IN')}
                          </div>
                        ) : service.pricingMode === 'starting' && service.price ? (
                          <div className="text-forest-700 text-[11px]">
                            From <span className="font-semibold">{service.currency || '₹'}{Number(service.price).toLocaleString('en-IN')}</span>
                          </div>
                        ) : (
                          <span className="text-forest-500 text-[11px] uppercase tracking-wider">
                            Enquiry Based
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {service.status === 'published' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] uppercase tracking-wider font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            Live
                          </span>
                        ) : service.status === 'draft' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-[10px] uppercase tracking-wider font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            Draft
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-300 text-[10px] uppercase tracking-wider font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                            Archived
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Preview Action */}
                          <button
                            onClick={() => openPreview(service)}
                            className="p-1.5 rounded-sm hover:bg-cream-200 text-forest-700 transition-colors"
                            title="Preview Public Card"
                          >
                            <Eye size={13} />
                          </button>

                          {/* Quick Publish / Unpublish / Restore */}
                          {service.status === 'published' ? (
                            <button
                              onClick={() => handleStatusChange(service, 'draft')}
                              className="px-2 py-1 rounded-sm text-[10px] uppercase tracking-wider bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors"
                              title="Unpublish (Save as Draft)"
                            >
                              Unpublish
                            </button>
                          ) : service.status === 'draft' ? (
                            <button
                              onClick={() => handleStatusChange(service, 'published')}
                              className="px-2 py-1 rounded-sm text-[10px] uppercase tracking-wider bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 transition-colors"
                              title="Publish to Live Website"
                            >
                              Publish
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(service, 'published')}
                              className="px-2 py-1 rounded-sm text-[10px] uppercase tracking-wider bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 transition-colors inline-flex items-center gap-1"
                              title="Restore from Archive"
                            >
                              <RotateCcw size={10} />
                              <span>Restore</span>
                            </button>
                          )}

                          {/* Edit Button */}
                          <button
                            onClick={() => openEditModal(service)}
                            className="p-1.5 rounded-sm hover:bg-gold-100 text-forest-900 border border-forest-900/10 transition-colors"
                            title="Edit Service"
                          >
                            <Edit2 size={13} />
                          </button>

                          {/* Archive or Delete */}
                          {service.status !== 'archived' ? (
                            <button
                              onClick={() => setDeleteTarget(service)}
                              className="p-1.5 rounded-sm hover:bg-rose-100 text-rose-700 transition-colors"
                              title="Archive or Delete"
                            >
                              <Archive size={13} />
                            </button>
                          ) : (
                            <button
                              onClick={() => setDeleteTarget(service)}
                              className="p-1.5 rounded-sm hover:bg-rose-100 text-rose-700 transition-colors"
                              title="Delete Permanently"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-gold-500/30 shadow-luxury max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-forest-950 text-ivory p-5 border-b border-forest-800 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl text-white font-normal">
                  {isEditing ? 'Edit Salon Service' : 'Add New Salon Service'}
                </h3>
                <p className="text-xs text-gold-300 font-sans mt-0.5">
                  Changes save directly into server database and sync live to the public catalogue.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ivory-300 hover:text-white p-1 rounded-sm"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-6 flex-1">
              {saveStatus && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans rounded-sm flex items-center gap-2">
                  <CheckCircle size={15} />
                  <span>{saveStatus}</span>
                </div>
              )}
              {saveError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans rounded-sm flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{saveError}</span>
                </div>
              )}

              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Signature Bridal Makeover & Couture Package"
                    className="w-full px-3 py-2 text-sm bg-cream-50 border border-forest-900/15 rounded-sm focus:outline-none focus:border-forest-900 text-forest-900 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ServiceCategory })}
                    className="w-full px-3 py-2 text-sm bg-cream-50 border border-forest-900/15 rounded-sm focus:outline-none focus:border-forest-900 text-forest-900 font-sans"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                  Short Summary (Shown on public card) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One sentence describing the core service result."
                  className="w-full px-3 py-2 text-sm bg-cream-50 border border-forest-900/15 rounded-sm focus:outline-none focus:border-forest-900 text-forest-900 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                  Full Clinical / Procedure Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed procedure steps, skin science, and consultation guidelines..."
                  className="w-full px-3 py-2 text-sm bg-cream-50 border border-forest-900/15 rounded-sm focus:outline-none focus:border-forest-900 text-forest-900 font-sans"
                />
              </div>

              {/* Media Upload & Thumbnail Area */}
              <div className="p-4 bg-cream-50 rounded-sm border border-forest-900/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-semibold uppercase tracking-wider text-forest-900">
                    Service Media & Thumbnail
                  </span>
                  <span className="text-[11px] text-forest-500 font-sans">
                    Supports JPG, PNG, WEBP, MP4, WEBM
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-xs font-sans text-forest-700 mb-1">
                      Main Photograph / Cover Image
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="/images/services/... or upload"
                        className="flex-1 px-3 py-2 text-xs bg-white border border-forest-900/15 rounded-sm text-forest-900 font-sans"
                      />
                      <input
                        type="file"
                        ref={imageInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'image')}
                      />
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="px-3 py-2 rounded-sm bg-forest-900 text-gold-300 text-xs font-sans hover:bg-forest-800 transition-colors inline-flex items-center gap-1"
                      >
                        <Upload size={13} />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                      </button>
                    </div>

                    {/* Image Preview */}
                    {formData.image && (
                      <div className="mt-2 w-32 h-24 rounded-sm border border-forest-900/20 overflow-hidden bg-cream-200 relative">
                        <img
                          src={formData.image}
                          alt="Preview"
                          style={{ objectPosition: formData.imagePosition }}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '', thumbnail: '' })}
                          className="absolute top-1 right-1 bg-forest-950/80 text-white rounded-full p-0.5"
                          title="Remove Image"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Video Upload or Video URL */}
                  <div>
                    <label className="block text-xs font-sans text-forest-700 mb-1">
                      Video Demonstration URL (Optional)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="/videos/treatments/... or upload mp4"
                        className="flex-1 px-3 py-2 text-xs bg-white border border-forest-900/15 rounded-sm text-forest-900 font-sans"
                      />
                      <input
                        type="file"
                        ref={videoInputRef}
                        accept="video/mp4,video/webm"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'video')}
                      />
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        disabled={uploadingVideo}
                        className="px-3 py-2 rounded-sm bg-forest-900 text-gold-300 text-xs font-sans hover:bg-forest-800 transition-colors inline-flex items-center gap-1"
                      >
                        <Upload size={13} />
                        <span>{uploadingVideo ? 'Uploading...' : 'Upload MP4'}</span>
                      </button>
                    </div>

                    {formData.videoUrl && (
                      <div className="mt-2 text-[11px] text-emerald-700 flex items-center gap-1 font-sans">
                        <CheckCircle size={13} />
                        <span>Video active: {formData.videoUrl}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Object Position Alignment */}
                <div>
                  <label className="block text-xs font-sans text-forest-700 mb-1">
                    Image Alignment / Cropping Position
                  </label>
                  <select
                    value={formData.imagePosition}
                    onChange={(e) => setFormData({ ...formData, imagePosition: e.target.value })}
                    className="w-full sm:w-64 px-3 py-1.5 text-xs bg-white border border-forest-900/15 rounded-sm text-forest-900 font-sans"
                  >
                    <option value="center top">Top Focus (Great for Hair & Faces)</option>
                    <option value="center 15%">Upper-Chest / Bridal Focus (15%)</option>
                    <option value="center center">Center Aligned</option>
                    <option value="center 65%">Machine Console Focus (65%)</option>
                    <option value="center bottom">Bottom Aligned</option>
                  </select>
                </div>
              </div>

              {/* Pricing Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Pricing Mode
                  </label>
                  <select
                    value={formData.pricingMode}
                    onChange={(e) => setFormData({ ...formData, pricingMode: e.target.value as ServicePricingMode })}
                    className="w-full px-3 py-2 text-sm bg-cream-50 border border-forest-900/15 rounded-sm text-forest-900 font-sans"
                  >
                    <option value="enquiry">Enquiry / Consultation Based</option>
                    <option value="fixed">Fixed Price</option>
                    <option value="starting">Starting From Price</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Price (INR)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 1500 (or blank)"
                    disabled={formData.pricingMode === 'enquiry'}
                    className="w-full px-3 py-2 text-sm bg-cream-50 border border-forest-900/15 rounded-sm text-forest-900 font-sans disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Promotional Strikethrough Price
                  </label>
                  <input
                    type="number"
                    value={formData.promotionalPrice}
                    onChange={(e) => setFormData({ ...formData, promotionalPrice: e.target.value })}
                    placeholder="e.g. 2000"
                    disabled={formData.pricingMode === 'enquiry'}
                    className="w-full px-3 py-2 text-sm bg-cream-50 border border-forest-900/15 rounded-sm text-forest-900 font-sans disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Features and Benefits List */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                  Key Features & Inclusions (One per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  placeholder={`In-depth client consultation\nWaterproof 12-hour formula\nIntricate hair couture styling`}
                  className="w-full px-3 py-2 text-sm bg-cream-50 border border-forest-900/15 rounded-sm focus:outline-none focus:border-forest-900 text-forest-900 font-sans"
                />
              </div>

              {/* Meta & Publication Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Card Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Signature, Trending, Video Available"
                    className="w-full px-3 py-2 text-sm bg-cream-50 border border-forest-900/15 rounded-sm text-forest-900 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Publication Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ServicePublicationStatus })}
                    className="w-full px-3 py-2 text-sm bg-cream-50 border border-forest-900/15 rounded-sm text-forest-900 font-sans"
                  >
                    <option value="published">Published (Live on Website)</option>
                    <option value="draft">Draft (Hidden from Public)</option>
                    <option value="archived">Archived (Deactivated)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                    Display Order Index
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-sm bg-cream-50 border border-forest-900/15 rounded-sm text-forest-900 font-sans"
                  />
                </div>
              </div>

              {/* WhatsApp Preset Message */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 mb-1">
                  Custom WhatsApp Enquiry Message
                </label>
                <input
                  type="text"
                  value={formData.whatsappMessage}
                  onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                  placeholder={`Hello SK Relax Beauty Academy & Salon, Satara. I would like to enquire about...`}
                  className="w-full px-3 py-2 text-sm bg-cream-50 border border-forest-900/15 rounded-sm text-forest-900 font-sans"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-forest-900/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={openFormPreview}
                  className="px-4 py-2 rounded-sm bg-cream-200 text-forest-900 hover:bg-cream-300 text-xs font-sans font-medium transition-colors inline-flex items-center gap-1.5"
                >
                  <Eye size={14} />
                  <span>Preview Card</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-sm bg-cream-100 text-forest-700 hover:bg-cream-200 text-xs font-sans transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-sm bg-forest-950 text-gold-300 text-xs font-sans font-semibold uppercase tracking-wider border border-gold-500/40 hover:bg-forest-900 shadow-soft transition-colors"
                  >
                    {isEditing ? 'Update Service' : 'Create Service'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW MODAL */}
      {isPreviewOpen && previewService && (
        <div className="fixed inset-0 z-50 bg-forest-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-ivory rounded-sm border border-gold-500/30 shadow-luxury max-w-md w-full overflow-hidden p-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-forest-900/10">
              <span className="text-xs uppercase tracking-wider font-sans font-semibold text-forest-900">
                Public Card Live Preview
              </span>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-forest-500 hover:text-forest-950 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-2">
              <ServiceCard service={previewService} />
            </div>

            <div className="mt-4 pt-3 border-t border-forest-900/10 text-center">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-1.5 rounded-sm bg-forest-950 text-gold-300 text-xs font-sans uppercase tracking-wider"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE / ARCHIVE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-rose-500/30 shadow-luxury max-w-md w-full p-6 animate-fadeIn">
            <h3 className="font-serif text-xl text-forest-950 mb-2">
              {deleteTarget.status === 'archived' ? 'Delete Service Permanently?' : 'Archive or Delete Service?'}
            </h3>
            <p className="text-xs text-forest-700 font-sans leading-relaxed mb-6">
              You are modifying <strong>"{deleteTarget.title}"</strong>.
              {deleteTarget.status !== 'archived' ? (
                <>
                  <br />
                  <br />
                  <strong>Archive:</strong> Removes the service from public view, while preserving all its records in the database for later restoration.
                  <br />
                  <strong>Permanent Delete:</strong> Removes the record permanently.
                </>
              ) : (
                ' This will permanently erase the service record from the database.'
              )}
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-1.5 rounded-sm bg-cream-100 text-forest-700 text-xs font-sans hover:bg-cream-200"
              >
                Cancel
              </button>

              {deleteTarget.status !== 'archived' && (
                <button
                  onClick={() => confirmDelete(true)}
                  className="px-3 py-1.5 rounded-sm bg-amber-600 text-white text-xs font-sans hover:bg-amber-700 font-semibold uppercase tracking-wider"
                >
                  Archive Service
                </button>
              )}

              <button
                onClick={() => confirmDelete(false)}
                className="px-3 py-1.5 rounded-sm bg-rose-700 text-white text-xs font-sans hover:bg-rose-800 font-semibold uppercase tracking-wider"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
