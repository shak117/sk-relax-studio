import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  Plus,
  Trash2,
  Edit2,
  Eye,
  LogOut,
  Scissors,
  GraduationCap,
  Image as ImageIcon,
  Video as VideoIcon,
  Film,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  X,
  Upload,
  Play,
  Layers,
  Sparkles
} from 'lucide-react';
import { GalleryItem } from '../../types';
import { GALLERY_CATEGORIES } from '../../data/galleryData';
import { galleryService, DeleteGalleryResponse } from '../../services/galleryService';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { usePageSEO } from '../../hooks/usePageSEO';
import { Lightbox } from '../../components/gallery/Lightbox';

interface MediaUploadState {
  title: string;
  category: GalleryItem['category'];
  categoryLabel?: string;
  image: string;
  videoUrl?: string;
  alt: string;
  description: string;
  tag?: string;
}

const DEFAULT_UPLOAD_STATE: MediaUploadState = {
  title: '',
  category: 'hair',
  categoryLabel: 'Hair Artistry',
  image: '',
  videoUrl: '',
  alt: '',
  description: '',
  tag: ''
};

export const AdminGalleryPage: React.FC = () => {
  usePageSEO({
    title: 'Admin Gallery & Media Management | SK Relax Studio',
    description: 'Manage, upload, and permanently delete gallery photos and videos.',
    path: '/admin/gallery'
  });

  const navigate = useNavigate();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeMediaType, setActiveMediaType] = useState<'all' | 'photo' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);
  const [deleteModalItem, setDeleteModalItem] = useState<GalleryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<'all' | 'video'>('all');
  const [isDeleting, setIsDeleting] = useState(false);

  // Upload/Edit Modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formState, setFormState] = useState<MediaUploadState>(DEFAULT_UPLOAD_STATE);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Notification banners
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
    details?: string;
  } | null>(null);

  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // 1. Authentication check
  useEffect(() => {
    const token = galleryService.getAuthToken();
    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }

    // Verify token validity
    fetch('/api/admin/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      if (!res.ok) {
        navigate('/admin/login', { replace: true });
      }
    }).catch(() => {
      navigate('/admin/login', { replace: true });
    });
  }, [navigate]);

  // 2. Fetch gallery data
  const loadGallery = async () => {
    setLoading(true);
    try {
      const items = await galleryService.getGalleryItems();
      setGalleryItems(items);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: 'Failed to load gallery items',
        details: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('skrelax_admin_jwt');
    sessionStorage.removeItem('skrelax_admin_jwt');
    navigate('/admin/login', { replace: true });
  };

  // Filter items
  const filteredItems = galleryItems.filter((item) => {
    // Category match
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    // Media type match
    if (activeMediaType === 'video' && !item.videoUrl) {
      return false;
    }
    if (activeMediaType === 'photo' && item.videoUrl) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const inTitle = item.title.toLowerCase().includes(q);
      const inDesc = item.description?.toLowerCase().includes(q);
      const inTag = item.tag?.toLowerCase().includes(q);
      const inCat = item.categoryLabel?.toLowerCase().includes(q);
      if (!inTitle && !inDesc && !inTag && !inCat) {
        return false;
      }
    }
    return true;
  });

  // KPI calculations
  const totalItems = galleryItems.length;
  const totalPhotos = galleryItems.filter(i => !i.videoUrl).length;
  const totalVideos = galleryItems.filter(i => Boolean(i.videoUrl)).length;

  // Open Delete Modal
  const openDeleteModal = (item: GalleryItem, target: 'all' | 'video' = 'all') => {
    setDeleteModalItem(item);
    setDeleteTarget(target);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteModalItem(null);
    setDeleteTarget('all');
  };

  // Execute Deletion
  const confirmDeleteMedia = async () => {
    if (!deleteModalItem) return;

    setIsDeleting(true);
    setNotification(null);

    try {
      const res: DeleteGalleryResponse = await galleryService.deleteGalleryItem(
        deleteModalItem.id,
        deleteTarget
      );

      if (res.success) {
        if (deleteTarget === 'video') {
          // Update item in state: strip videoUrl
          setGalleryItems(prev =>
            prev.map(item =>
              item.id === deleteModalItem.id ? { ...item, videoUrl: undefined } : item
            )
          );
          setNotification({
            type: 'success',
            message: `Video permanently deleted for "${deleteModalItem.title}"`,
            details: res.deletedFiles?.length
              ? `Removed physical file: ${res.deletedFiles.join(', ')}`
              : 'Video reference removed successfully.'
          });
        } else {
          // Remove entire item from state immediately without page refresh
          setGalleryItems(prev => prev.filter(item => item.id !== deleteModalItem.id));
          setNotification({
            type: 'success',
            message: `Gallery item "${deleteModalItem.title}" permanently deleted`,
            details: res.deletedFiles?.length
              ? `Removed storage files: ${res.deletedFiles.join(', ')}`
              : 'Item and media records removed.'
          });
        }

        if (res.preservedFiles && res.preservedFiles.length > 0) {
          const preservedInfo = res.preservedFiles.map(p => `${p.path} (${p.reason})`).join('; ');
          setNotification(prev => ({
            type: 'warning',
            message: prev?.message || 'Media updated',
            details: `Some shared files were safely preserved: ${preservedInfo}`
          }));
        }

        setDeleteModalItem(null);
      } else {
        setNotification({
          type: 'error',
          message: 'Deletion failed',
          details: res.error || 'The server could not complete the deletion request.'
        });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: 'Deletion error',
        details: err.message || 'Network error encountered.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Upload Image
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await galleryService.uploadMedia(file, 'gallery');
      if (res.success && res.url) {
        setFormState(prev => ({
          ...prev,
          image: res.url!,
          alt: prev.alt || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        }));
      } else {
        alert(res.error || 'Image upload failed');
      }
    } catch (err: any) {
      alert(err.message || 'Image upload error');
    } finally {
      setUploadingImage(false);
      if (imageFileInputRef.current) imageFileInputRef.current.value = '';
    }
  };

  // Handle Upload Video
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const res = await galleryService.uploadMedia(file, 'gallery');
      if (res.success && res.url) {
        setFormState(prev => ({
          ...prev,
          videoUrl: res.url!
        }));
      } else {
        alert(res.error || 'Video upload failed');
      }
    } catch (err: any) {
      alert(err.message || 'Video upload error');
    } finally {
      setUploadingVideo(false);
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
    }
  };

  // Open Upload / Edit Modal
  const openUploadModal = (itemToEdit?: GalleryItem) => {
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setFormState({
        title: itemToEdit.title,
        category: itemToEdit.category,
        categoryLabel: itemToEdit.categoryLabel,
        image: itemToEdit.image,
        videoUrl: itemToEdit.videoUrl || '',
        alt: itemToEdit.alt,
        description: itemToEdit.description,
        tag: itemToEdit.tag || ''
      });
    } else {
      setEditingItem(null);
      setFormState(DEFAULT_UPLOAD_STATE);
    }
    setIsUploadModalOpen(true);
  };

  // Submit Form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim()) {
      alert('Please enter a title for this gallery item');
      return;
    }
    if (!formState.image.trim() && !formState.videoUrl?.trim()) {
      alert('Please upload an image or provide a video demonstration');
      return;
    }

    setFormSubmitting(true);
    try {
      const categoryObj = GALLERY_CATEGORIES.find(c => c.id === formState.category);
      const categoryLabel = categoryObj ? categoryObj.label : 'Gallery Item';

      const payload: Partial<GalleryItem> = {
        title: formState.title.trim(),
        category: formState.category,
        categoryLabel,
        image: formState.image.trim(),
        videoUrl: formState.videoUrl?.trim() || undefined,
        alt: formState.alt.trim() || formState.title.trim(),
        description: formState.description.trim(),
        tag: formState.tag?.trim() || undefined
      };

      if (editingItem) {
        const res = await galleryService.updateGalleryItem(editingItem.id, payload);
        if (res.success && res.data) {
          setGalleryItems(prev =>
            prev.map(i => (i.id === editingItem.id ? res.data! : i))
          );
          setNotification({
            type: 'success',
            message: `Updated "${res.data.title}" successfully`
          });
          setIsUploadModalOpen(false);
        } else {
          alert(res.error || 'Failed to update item');
        }
      } else {
        const res = await galleryService.createGalleryItem(payload);
        if (res.success && res.data) {
          setGalleryItems(prev => [res.data!, ...prev]);
          setNotification({
            type: 'success',
            message: `Added "${res.data.title}" to gallery`
          });
          setIsUploadModalOpen(false);
        } else {
          alert(res.error || 'Failed to create item');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Submission error');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 selection:bg-gold-200 selection:text-forest-950 pb-20">
      {/* Top Admin Navbar */}
      <header className="bg-forest-950 text-ivory border-b border-forest-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-8 h-8 rounded-sm bg-forest-900 border border-gold-500/40 flex items-center justify-center text-gold-300 shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h1 className="font-serif text-base sm:text-lg text-white font-medium whitespace-nowrap">SK Relax CMS</h1>
              <p className="text-[10px] text-gold-300 font-sans uppercase tracking-widest hidden sm:block">
                Gallery & Media Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6 shrink-0">
            <nav className="flex items-center gap-1 sm:gap-2">
              <Link
                to="/admin/services"
                className="px-3 py-1.5 rounded-sm text-xs text-ivory-300 hover:text-white font-sans hover:bg-forest-900/60 transition-colors flex items-center gap-1.5"
              >
                <Scissors size={13} />
                <span className="hidden sm:inline">Salon Services</span>
              </Link>
              <Link
                to="/admin/batches"
                className="px-3 py-1.5 rounded-sm text-xs text-ivory-300 hover:text-white font-sans hover:bg-forest-900/60 transition-colors flex items-center gap-1.5"
              >
                <GraduationCap size={13} />
                <span className="hidden sm:inline">Academy Batches</span>
              </Link>
              <span className="px-3 py-1.5 rounded-sm bg-forest-900 border border-gold-500/40 text-xs text-gold-300 font-sans font-medium flex items-center gap-1.5 shadow-xs">
                <ImageIcon size={13} />
                <span className="hidden sm:inline">Gallery & Media</span>
              </span>
            </nav>

            <div className="h-5 w-px bg-forest-800" />

            <Link
              to="/gallery"
              target="_blank"
              className="text-xs text-ivory-300 hover:text-gold-300 font-sans inline-flex items-center gap-1.5 transition-colors"
            >
              <span className="hidden md:inline">View Public Gallery</span>
              <ExternalLink size={13} />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-forest-900 hover:bg-forest-800 text-xs text-rose-300 font-sans transition-colors border border-forest-800 cursor-pointer"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Notification Toast */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-sm border flex items-start justify-between gap-3 shadow-soft transition-all duration-300 ${
              notification.type === 'success'
                ? 'bg-forest-900/10 border-forest-800 text-forest-900'
                : notification.type === 'warning'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-900'
                : 'bg-rose-500/10 border-rose-500/40 text-rose-900'
            }`}
          >
            <div className="flex items-start gap-3">
              {notification.type === 'success' && <CheckCircle size={18} className="text-forest-700 mt-0.5" />}
              {notification.type === 'warning' && <AlertTriangle size={18} className="text-amber-600 mt-0.5" />}
              {notification.type === 'error' && <AlertCircle size={18} className="text-rose-600 mt-0.5" />}
              <div>
                <p className="font-sans font-semibold text-sm">{notification.message}</p>
                {notification.details && (
                  <p className="text-xs mt-1 font-mono opacity-85 leading-relaxed">{notification.details}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 text-forest-700 hover:text-forest-950 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-sm border border-forest-900/10 shadow-soft">
            <div className="flex items-center justify-between text-forest-700 mb-1">
              <span className="text-xs uppercase tracking-wider font-sans">Total Media</span>
              <Layers size={14} className="text-gold-600" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-medium text-forest-950">{totalItems}</div>
            <p className="text-[11px] text-forest-600 mt-1">Live portfolio entries</p>
          </div>

          <div className="bg-white p-4 rounded-sm border border-forest-900/10 shadow-soft">
            <div className="flex items-center justify-between text-forest-700 mb-1">
              <span className="text-xs uppercase tracking-wider font-sans">Photographs</span>
              <ImageIcon size={14} className="text-forest-700" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-medium text-forest-950">{totalPhotos}</div>
            <p className="text-[11px] text-forest-600 mt-1">Still image portfolios</p>
          </div>

          <div className="bg-white p-4 rounded-sm border border-forest-900/10 shadow-soft">
            <div className="flex items-center justify-between text-forest-700 mb-1">
              <span className="text-xs uppercase tracking-wider font-sans">Video Clips</span>
              <VideoIcon size={14} className="text-rose-600" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-medium text-forest-950">{totalVideos}</div>
            <p className="text-[11px] text-forest-600 mt-1">Videos with sound & motion</p>
          </div>

          <div className="bg-white p-4 rounded-sm border border-forest-900/10 shadow-soft">
            <div className="flex items-center justify-between text-forest-700 mb-1">
              <span className="text-xs uppercase tracking-wider font-sans">Quick Upload</span>
              <Sparkles size={14} className="text-gold-500" />
            </div>
            <button
              onClick={() => openUploadModal()}
              className="mt-2 w-full py-1.5 px-3 rounded-sm bg-forest-900 hover:bg-forest-800 text-ivory text-xs font-sans tracking-wide font-medium inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus size={14} />
              <span>Add Media</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-sm border border-forest-900/10 shadow-soft mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-500 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search photos & videos by title, description, or tag..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-cream-50 border border-forest-900/15 rounded-sm focus:outline-none focus:border-gold-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-400 hover:text-forest-900"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Media Type Filter */}
            <div className="inline-flex rounded-sm border border-forest-900/15 p-1 bg-cream-50 self-start md:self-auto">
              <button
                onClick={() => setActiveMediaType('all')}
                className={`px-3 py-1.5 text-xs font-sans rounded-xs transition-colors cursor-pointer ${
                  activeMediaType === 'all'
                    ? 'bg-forest-900 text-white font-medium shadow-xs'
                    : 'text-forest-700 hover:text-forest-950'
                }`}
              >
                All Media ({galleryItems.length})
              </button>
              <button
                onClick={() => setActiveMediaType('photo')}
                className={`px-3 py-1.5 text-xs font-sans rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
                  activeMediaType === 'photo'
                    ? 'bg-forest-900 text-white font-medium shadow-xs'
                    : 'text-forest-700 hover:text-forest-950'
                }`}
              >
                <ImageIcon size={12} />
                <span>Photos ({totalPhotos})</span>
              </button>
              <button
                onClick={() => setActiveMediaType('video')}
                className={`px-3 py-1.5 text-xs font-sans rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
                  activeMediaType === 'video'
                    ? 'bg-forest-900 text-white font-medium shadow-xs'
                    : 'text-forest-700 hover:text-forest-950'
                }`}
              >
                <VideoIcon size={12} />
                <span>Videos ({totalVideos})</span>
              </button>
            </div>

            {/* Add Media Button */}
            <button
              onClick={() => openUploadModal()}
              className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-forest-950 rounded-sm font-sans text-xs uppercase tracking-wider font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-soft shrink-0"
            >
              <Plus size={15} />
              <span>Upload New Media</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-forest-900/10 pt-3">
            {GALLERY_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-sans whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-forest-900 text-ivory font-medium shadow-xs'
                    : 'bg-white text-forest-700 hover:bg-cream-200 border border-forest-900/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Items Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-forest-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-forest-600 font-sans">Loading gallery media...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-sm border border-forest-900/10 p-12 text-center">
            <ImageIcon size={36} className="mx-auto text-forest-300 mb-3" />
            <h3 className="font-serif text-lg text-forest-900">No media items found</h3>
            <p className="text-xs text-forest-600 mt-1 max-w-sm mx-auto font-sans">
              No photos or videos match your selected category or search filter.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveMediaType('all');
                setSearchQuery('');
              }}
              className="mt-4 px-3 py-1.5 text-xs text-forest-800 hover:text-forest-950 underline font-sans cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="group bg-white rounded-sm border border-forest-900/10 overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between"
              >
                {/* Media Preview Box */}
                <div className="relative aspect-[4/5] bg-forest-950 overflow-hidden">
                  <img
                    src={resolveMediaUrl(item.image)}
                    alt={item.alt}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top vignette gradient to ground labels and buttons seamlessly inside the image */}
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-forest-950/70 via-forest-950/25 to-transparent pointer-events-none z-[5]" />

                  {/* Media Type Chip */}
                  <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap items-center gap-1.5 max-w-[calc(100%-3rem)]">
                    {item.videoUrl ? (
                      <span className="px-2 py-0.5 rounded-full bg-forest-950/80 backdrop-blur-md border border-gold-500/40 text-gold-300 text-[10px] font-sans font-medium flex items-center gap-1 shadow-xs">
                        <Play size={9} className="fill-gold-300" />
                        <span>Video Clip</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-forest-950/80 backdrop-blur-md border border-white/20 text-ivory-100 text-[10px] font-sans font-medium flex items-center gap-1 shadow-xs">
                        <ImageIcon size={10} />
                        <span>Photograph</span>
                      </span>
                    )}

                    {item.tag && (
                      <span className="px-2 py-0.5 rounded-full bg-forest-900/85 backdrop-blur-md border border-forest-700/50 text-ivory-200 text-[10px] font-sans font-medium shadow-xs">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  {/* Top-Right Quick Delete Button */}
                  <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1">
                    <button
                      onClick={() => openDeleteModal(item, 'all')}
                      title="Permanently Delete Media"
                      className="w-6 h-6 rounded-full bg-forest-950/70 hover:bg-rose-600 text-ivory-200 hover:text-white backdrop-blur-md border border-white/20 hover:border-rose-500/40 flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer"
                      aria-label="Delete this gallery photo/video"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-forest-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-4">
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="px-3 py-1.5 rounded-sm bg-white/90 hover:bg-white text-forest-950 text-xs font-sans font-medium inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => openUploadModal(item)}
                      className="px-3 py-1.5 rounded-sm bg-forest-900 hover:bg-forest-800 text-ivory text-xs font-sans font-medium inline-flex items-center gap-1.5 shadow-sm transition-colors border border-forest-700 cursor-pointer"
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-4 flex-1 flex flex-col justify-between border-t border-forest-900/5">
                  <div>
                    <div className="flex items-center justify-between text-[10px] uppercase font-sans tracking-widest text-gold-600 mb-1">
                      <span>{item.categoryLabel}</span>
                      <span className="font-mono text-forest-400">ID: {item.id}</span>
                    </div>

                    <h4 className="font-serif text-sm font-medium text-forest-950 line-clamp-1 leading-snug">
                      {item.title}
                    </h4>

                    {item.description && (
                      <p className="text-[11px] text-forest-700 font-sans line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Bottom Action Footer with Deletion Controls */}
                  <div className="mt-4 pt-3 border-t border-forest-900/10 flex items-center justify-between gap-2">
                    {item.videoUrl ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openDeleteModal(item, 'video')}
                          title="Delete Video Only (keep photo)"
                          className="px-2 py-1 rounded-xs bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-sans font-medium inline-flex items-center gap-1 border border-rose-200 transition-colors cursor-pointer"
                        >
                          <Film size={11} />
                          <span>Delete Video</span>
                        </button>
                        <button
                          onClick={() => openDeleteModal(item, 'all')}
                          title="Permanently Delete Item & Media"
                          className="px-2 py-1 rounded-xs bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-sans font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 size={11} />
                          <span>Delete All</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => openDeleteModal(item, 'all')}
                        title="Permanently Delete Photo"
                        className="w-full py-1.5 rounded-xs bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 text-xs font-sans font-medium inline-flex items-center justify-center gap-1.5 border border-rose-200 hover:border-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Delete Photo</span>
                      </button>
                    )}

                    <button
                      onClick={() => openUploadModal(item)}
                      title="Edit Item Details"
                      className="p-1.5 text-forest-600 hover:text-forest-950 hover:bg-cream-200 rounded-sm transition-colors cursor-pointer ml-auto"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ===================================================================== */}
      {/* 2. EXPLICIT DELETE CONFIRMATION DIALOG */}
      {/* ===================================================================== */}
      {deleteModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/80 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="bg-white rounded-sm border border-forest-900/20 shadow-luxury max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto my-4 animate-scale-up">
            {/* Modal Header */}
            <div className="bg-rose-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-800 flex items-center justify-center text-rose-200 shrink-0">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 id="delete-dialog-title" className="font-serif text-base sm:text-lg font-medium">
                    {deleteTarget === 'video'
                      ? 'Confirm Video Deletion'
                      : 'Confirm Permanent Media Deletion'}
                  </h3>
                  <p className="text-[11px] text-rose-200 font-sans">
                    Action cannot be undone
                  </p>
                </div>
              </div>

              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="p-1.5 text-rose-200 hover:text-white rounded-full hover:bg-rose-800 transition-colors cursor-pointer"
                aria-label="Cancel and close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* Media Preview Box */}
              <div className="flex items-start gap-4 p-3 bg-cream-50 rounded-sm border border-forest-900/10">
                <div className="w-20 h-24 rounded-sm bg-forest-950 overflow-hidden shrink-0 relative border border-forest-900/20">
                  <img
                    src={resolveMediaUrl(deleteModalItem.image)}
                    alt={deleteModalItem.alt}
                    className="w-full h-full object-cover object-center"
                  />
                  {deleteModalItem.videoUrl && (
                    <div className="absolute inset-0 bg-forest-950/40 flex items-center justify-center">
                      <Play size={14} className="fill-gold-300 text-gold-300" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-rose-700 font-semibold">
                    {deleteModalItem.categoryLabel}
                  </span>
                  <h4 className="font-serif text-sm font-medium text-forest-950 truncate mt-0.5">
                    {deleteModalItem.title}
                  </h4>
                  <p className="text-[11px] text-forest-600 font-sans line-clamp-2 mt-1">
                    {deleteModalItem.description || 'No description provided.'}
                  </p>

                  <div className="mt-2 text-[10px] font-mono text-forest-500 break-all space-y-0.5">
                    {deleteTarget === 'all' && (
                      <p>Image: {deleteModalItem.image}</p>
                    )}
                    {deleteModalItem.videoUrl && (
                      <p>Video: {deleteModalItem.videoUrl}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Explicit Confirmation Question as requested */}
              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-sm">
                <p className="text-sm font-sans font-semibold text-rose-950 leading-snug">
                  {deleteTarget === 'video'
                    ? 'Are you sure you want to permanently delete this video demonstration?'
                    : 'Are you sure you want to permanently delete this photo/video?'}
                </p>
                <p className="text-xs text-rose-800 font-sans mt-2 leading-relaxed">
                  {deleteTarget === 'video'
                    ? 'This will detach the video file from this gallery entry, and remove the physical video from the server storage if not linked to other services.'
                    : 'This will remove the media entry from the public gallery and permanently delete the physical photo and video files from server storage.'}
                </p>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-5 bg-cream-50 border-t border-forest-900/10 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="w-full sm:w-auto px-4 py-2 text-xs font-sans font-medium text-forest-700 hover:text-forest-950 bg-white hover:bg-cream-100 border border-forest-900/20 rounded-sm transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteMedia}
                disabled={isDeleting}
                className="w-full sm:w-auto px-5 py-2 text-xs font-sans uppercase tracking-wider font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-sm shadow-soft inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting from Server...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Permanently Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. UPLOAD / EDIT MEDIA MODAL */}
      {/* ===================================================================== */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/80 backdrop-blur-xs p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-sm border border-forest-900/20 shadow-luxury max-w-2xl w-full overflow-hidden my-8">
            <div className="bg-forest-950 text-ivory p-4 sm:p-5 flex items-center justify-between border-b border-forest-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-sm bg-forest-900 border border-gold-500/40 flex items-center justify-center text-gold-300">
                  <ImageIcon size={15} />
                </div>
                <h3 className="font-serif text-base sm:text-lg text-white">
                  {editingItem ? 'Edit Gallery Media' : 'Upload New Gallery Media'}
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-ivory-300 hover:text-white rounded-full hover:bg-forest-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-xs font-sans font-semibold text-forest-900 mb-1">
                  Title / Look Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Signature Butterfly Haircut or Korean Glass Skin Glow"
                  value={formState.title}
                  onChange={e => setFormState(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Category & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold text-forest-900 mb-1">
                    Category <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formState.category}
                    onChange={e =>
                      setFormState(prev => ({
                        ...prev,
                        category: e.target.value as GalleryItem['category']
                      }))
                    }
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-gold-500"
                  >
                    {GALLERY_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold text-forest-900 mb-1">
                    Tag / Badge (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Signature Cut, Hands-on, Real Result"
                    value={formState.tag}
                    onChange={e => setFormState(prev => ({ ...prev, tag: e.target.value }))}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="p-4 bg-cream-50 rounded-sm border border-forest-900/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-sans font-semibold text-forest-900 flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-forest-700" />
                    <span>Photo / Poster Image</span>
                    <span className="text-rose-600">*</span>
                  </label>
                  <span className="text-[10px] text-forest-500 font-sans">
                    JPG, JPEG, PNG, WEBP (Max 15MB)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <input
                    type="file"
                    ref={imageFileInputRef}
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => imageFileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full sm:w-auto px-3 py-1.5 rounded-sm bg-forest-900 hover:bg-forest-800 text-ivory text-xs font-sans font-medium inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <Upload size={13} />
                    <span>{uploadingImage ? 'Uploading Image...' : 'Upload Image File'}</span>
                  </button>

                  <div className="flex items-center gap-2 flex-1 w-full min-w-0">
                    <span className="text-xs text-forest-500 font-sans shrink-0">or path:</span>
                    <input
                      type="text"
                      placeholder="/uploads/gallery/... or /images/..."
                      value={formState.image}
                      onChange={e => setFormState(prev => ({ ...prev, image: e.target.value }))}
                      className="flex-1 w-full min-w-0 px-3 py-1.5 text-xs bg-white border border-forest-900/20 rounded-sm font-mono"
                    />
                  </div>
                </div>

                {formState.image && (
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-12 h-14 bg-forest-950 rounded-sm overflow-hidden border border-forest-900/20 shrink-0">
                      <img
                        src={resolveMediaUrl(formState.image)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[11px] font-mono text-forest-700 truncate">
                      {formState.image}
                    </p>
                  </div>
                )}
              </div>

              {/* Video Upload Area */}
              <div className="p-4 bg-cream-50 rounded-sm border border-forest-900/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-sans font-semibold text-forest-900 flex items-center gap-1.5">
                    <VideoIcon size={14} className="text-rose-600" />
                    <span>Video Demonstration (Optional)</span>
                  </label>
                  <span className="text-[10px] text-forest-500 font-sans">
                    MP4, WEBM (Max 50MB)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <input
                    type="file"
                    ref={videoFileInputRef}
                    accept="video/mp4,video/webm"
                    onChange={handleVideoFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => videoFileInputRef.current?.click()}
                    disabled={uploadingVideo}
                    className="w-full sm:w-auto px-3 py-1.5 rounded-sm bg-rose-900 hover:bg-rose-800 text-white text-xs font-sans font-medium inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <Upload size={13} />
                    <span>{uploadingVideo ? 'Uploading Video...' : 'Upload Video File'}</span>
                  </button>

                  <div className="flex items-center gap-2 flex-1 w-full min-w-0">
                    <span className="text-xs text-forest-500 font-sans shrink-0">or path:</span>
                    <input
                      type="text"
                      placeholder="/uploads/gallery/... or /videos/..."
                      value={formState.videoUrl}
                      onChange={e => setFormState(prev => ({ ...prev, videoUrl: e.target.value }))}
                      className="flex-1 w-full min-w-0 px-3 py-1.5 text-xs bg-white border border-forest-900/20 rounded-sm font-mono"
                    />
                  </div>
                </div>

                {formState.videoUrl && (
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <Film size={14} className="text-rose-600" />
                      <p className="text-[11px] font-mono text-forest-700 truncate">
                        {formState.videoUrl}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormState(prev => ({ ...prev, videoUrl: '' }))}
                      className="text-xs text-rose-600 hover:text-rose-800 font-sans"
                    >
                      Remove Video
                    </button>
                  </div>
                )}
              </div>

              {/* Alt Text & Description */}
              <div>
                <label className="block text-xs font-sans font-semibold text-forest-900 mb-1">
                  Alt Text (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  placeholder="Descriptive alt text for Google Image search..."
                  value={formState.alt}
                  onChange={e => setFormState(prev => ({ ...prev, alt: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold text-forest-900 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail the haircut technique, facial process, bridal makeup style, or academy dummy practice..."
                  value={formState.description}
                  onChange={e => setFormState(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-cream-50 border border-forest-900/20 rounded-sm focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-forest-900/10 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={formSubmitting}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-sans text-forest-700 hover:text-forest-950 bg-cream-100 rounded-sm text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full sm:w-auto px-5 py-2 text-xs font-sans uppercase tracking-wider font-semibold text-forest-950 bg-gold-500 hover:bg-gold-400 rounded-sm shadow-soft inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-forest-950 border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingItem ? 'Save Changes' : 'Publish to Gallery'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accessible Full Lightbox Modal */}
      {previewItem && (
        <Lightbox
          item={previewItem}
          items={filteredItems}
          onClose={() => setPreviewItem(null)}
          onNavigate={idx => {
            if (filteredItems[idx]) setPreviewItem(filteredItems[idx]);
          }}
        />
      )}
    </div>
  );
};
