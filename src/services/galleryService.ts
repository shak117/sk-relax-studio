import { GalleryItem } from '../types';
import { GALLERY_ITEMS } from '../data/galleryData';

const TOKEN_KEY = 'skrelax_admin_jwt';

export interface DeleteGalleryResponse {
  success: boolean;
  message?: string;
  deletedId?: string;
  deletedFiles?: string[];
  preservedFiles?: { path: string; reason: string }[];
  error?: string;
}

export const galleryService = {
  getAuthToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  async getGalleryItems(params?: {
    category?: string;
    mediaType?: 'all' | 'photo' | 'video';
    search?: string;
  }): Promise<GalleryItem[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'all') {
        query.append('category', params.category);
      }
      if (params?.mediaType && params.mediaType !== 'all') {
        query.append('type', params.mediaType);
      }
      if (params?.search && params.search.trim()) {
        query.append('search', params.search.trim());
      }

      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`/api/gallery${queryString}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('[galleryService] API fetch failed, falling back to local static gallery:', err);
    }

    // Fallback filter
    let items = [...GALLERY_ITEMS];
    if (params?.category && params.category !== 'all') {
      items = items.filter(i => i.category === params.category);
    }
    if (params?.mediaType === 'video') {
      items = items.filter(i => Boolean(i.videoUrl));
    } else if (params?.mediaType === 'photo') {
      items = items.filter(i => !i.videoUrl && Boolean(i.image));
    }
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      items = items.filter(
        i =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          (i.tag && i.tag.toLowerCase().includes(q))
      );
    }
    return items;
  },

  async getGalleryItemById(id: string): Promise<GalleryItem | null> {
    try {
      const res = await fetch(`/api/gallery/${id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('[galleryService] API single item fetch failed:', err);
    }
    return GALLERY_ITEMS.find(i => i.id === id) || null;
  },

  async createGalleryItem(
    itemData: Partial<GalleryItem>
  ): Promise<{ success: boolean; data?: GalleryItem; error?: string }> {
    const token = this.getAuthToken();
    if (!token) return { success: false, error: 'Unauthorized: Please login as administrator' };

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
      });
      const json = await res.json();
      if (json.success && json.data) {
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error || 'Failed to add gallery item' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error while adding gallery item' };
    }
  },

  async updateGalleryItem(
    id: string,
    itemData: Partial<GalleryItem>
  ): Promise<{ success: boolean; data?: GalleryItem; error?: string }> {
    const token = this.getAuthToken();
    if (!token) return { success: false, error: 'Unauthorized: Please login as administrator' };

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
      });
      const json = await res.json();
      if (json.success && json.data) {
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error || 'Failed to update gallery item' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error while updating gallery item' };
    }
  },

  /**
   * Delete a gallery item or specifically its video attachment.
   * Also deletes physical media file from storage unless referenced elsewhere.
   */
  async deleteGalleryItem(
    id: string,
    target: 'all' | 'video' = 'all'
  ): Promise<DeleteGalleryResponse> {
    const token = this.getAuthToken();
    if (!token) return { success: false, error: 'Unauthorized: Please login as administrator' };

    try {
      const url = `/api/gallery/${id}?target=${target}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        return {
          success: true,
          message: json.message,
          deletedId: json.deletedId,
          deletedFiles: json.deletedFiles || [],
          preservedFiles: json.preservedFiles || []
        };
      }
      return {
        success: false,
        error: json.error || 'Failed to delete gallery item from server'
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error while deleting gallery item' };
    }
  },

  /**
   * Upload media file (image or video) with validation.
   * Images: JPG, JPEG, PNG, WEBP, SVG (max 15MB)
   * Videos: MP4, WEBM (max 50MB)
   */
  async uploadMedia(
    file: File,
    folder: 'gallery' | 'services' | 'batches' = 'gallery'
  ): Promise<{ success: boolean; url?: string; filename?: string; error?: string }> {
    const token = this.getAuthToken();
    if (!token) return { success: false, error: 'Unauthorized: Please login as administrator' };

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const json = await res.json();
      if (json.success) {
        const url = json.url || json.data?.url;
        const filename = json.filename || json.data?.filename;
        return { success: true, url, filename };
      }
      return { success: false, error: json.error || 'Upload failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during media upload' };
    }
  }
};
