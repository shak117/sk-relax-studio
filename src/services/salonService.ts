import { ServiceItem } from '../types';
import { SERVICES } from '../data/servicesData';

const TOKEN_KEY = 'skrelax_admin_jwt';

export interface ServiceFilterParams {
  category?: string;
  status?: string;
  search?: string;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const salonService = {
  getAuthToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Fetch published services for the public website.
   * Gracefully falls back to local data if network fails.
   */
  async getPublishedServices(params?: ServiceFilterParams): Promise<ServiceItem[]> {
    try {
      const url = new URL('/api/services', window.location.origin);
      if (params?.category && params.category !== 'all') {
        url.searchParams.set('category', params.category);
      }
      if (params?.search) {
        url.searchParams.set('search', params.search);
      }

      const res = await fetch(url.toString(), {
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data: ServiceResponse<ServiceItem[]> = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return SERVICES;
    } catch (err) {
      console.warn('[salonService] Falling back to default static catalogue:', err);
      let list = [...SERVICES];
      if (params?.category && params.category !== 'all') {
        list = list.filter(s => s.category === params.category);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(s => s.title.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q));
      }
      return list;
    }
  },

  /**
   * Fetch all services for admin (published, draft, archived).
   */
  async getAllServicesAdmin(params?: ServiceFilterParams): Promise<ServiceItem[]> {
    const token = this.getAuthToken();
    if (!token) return [];

    try {
      const url = new URL('/api/services', window.location.origin);
      url.searchParams.set('status', params?.status || 'all');
      if (params?.category && params.category !== 'all') {
        url.searchParams.set('category', params.category);
      }
      if (params?.search) {
        url.searchParams.set('search', params.search);
      }

      const res = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const data: ServiceResponse<ServiceItem[]> = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } catch (err) {
      console.error('[salonService] Failed to load admin services:', err);
      return [];
    }
  },

  /**
   * Fetch a single service by ID or slug.
   */
  async getServiceById(id: string): Promise<ServiceItem | null> {
    const token = this.getAuthToken();
    try {
      const headers: Record<string, string> = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/services/${id}`, { headers });
      if (!res.ok) return null;
      const data: ServiceResponse<ServiceItem> = await res.json();
      return data.data || null;
    } catch (err) {
      console.error(`[salonService] Failed to load service ${id}:`, err);
      return null;
    }
  },

  /**
   * Create a new salon service (Admin only).
   */
  async createService(payload: Partial<ServiceItem>): Promise<ServiceResponse<ServiceItem>> {
    const token = this.getAuthToken();
    if (!token) return { success: false, error: 'Unauthorized' };

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  },

  /**
   * Update an existing service (Admin only).
   */
  async updateService(id: string, payload: Partial<ServiceItem> & { action?: string }): Promise<ServiceResponse<ServiceItem>> {
    const token = this.getAuthToken();
    if (!token) return { success: false, error: 'Unauthorized' };

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  },

  /**
   * Delete or archive a service (Admin only).
   */
  async deleteService(id: string, archive = false): Promise<ServiceResponse<void>> {
    const token = this.getAuthToken();
    if (!token) return { success: false, error: 'Unauthorized' };

    try {
      const res = await fetch(`/api/services/${id}?archive=${archive}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  },

  /**
   * Reorder services (Admin only).
   */
  async reorderServices(order: string[]): Promise<ServiceResponse<ServiceItem[]>> {
    const token = this.getAuthToken();
    if (!token) return { success: false, error: 'Unauthorized' };

    try {
      const res = await fetch('/api/services/reorder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order })
      });

      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  },

  /**
   * Upload image or video asset (Admin only). Supports File object (FormData) or base64 string.
   */
  async uploadMedia(
    fileOrBase64: File | string,
    filename?: string,
    folder: 'services' | 'batches' = 'services'
  ): Promise<ServiceResponse<{ url: string; filename: string }>> {
    const token = this.getAuthToken();
    if (!token) return { success: false, error: 'Unauthorized: Please log in as admin' };

    try {
      let res: Response;

      if (typeof window !== 'undefined' && fileOrBase64 instanceof File) {
        // multipart/form-data upload via browser FormData
        const formData = new FormData();
        formData.append('file', fileOrBase64);
        formData.append('folder', folder);

        res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            // Note: DO NOT set Content-Type header when using FormData.
            // The browser will automatically set 'multipart/form-data; boundary=...'
            Authorization: `Bearer ${token}`
          },
          body: formData
        });
      } else {
        // application/json base64 payload
        res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: fileOrBase64,
            filename: filename || 'upload.jpg',
            folder
          })
        });
      }

      const json = await res.json();
      if (json.success) {
        const url = json.url || json.data?.url;
        const filenameRes = json.filename || json.data?.filename || '';
        return {
          success: true,
          data: { url, filename: filenameRes }
        };
      }
      return { success: false, error: json.error || 'Server error' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to upload media' };
    }
  }
};
