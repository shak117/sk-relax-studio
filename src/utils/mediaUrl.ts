/**
 * Media URL resolution and MIME handling utilities for SK RELAX
 */

/**
 * Resolves a media asset URL (image, video, etc.) into an accessible absolute or relative path.
 * Handles:
 * 1. Absolute URLs (http://, https://, data:, blob:) -> returned unmodified.
 * 2. Cross-domain backend API configurations via VITE_API_BASE_URL.
 * 3. Relative root paths starting with '/' -> sanitized and formatted cleanly.
 */
export function resolveMediaUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Already an absolute, protocol-relative, or data/blob URL
  if (/^(?:https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Check if an external backend API domain is specified (e.g. in cross-domain deployments)
  const apiBase = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || '';
  if (apiBase) {
    const cleanBase = apiBase.replace(/\/+$/, '');
    const cleanPath = trimmed.replace(/^\/+/, '');
    return `${cleanBase}/${cleanPath}`;
  }

  // Default: ensure leading forward slash for root-relative paths
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

/**
 * Returns the appropriate video MIME type based on file extension
 */
export function getVideoMimeType(url?: string | null): string {
  if (!url || typeof url !== 'string') return 'video/mp4';
  const clean = url.split('?')[0].toLowerCase();
  if (clean.endsWith('.webm')) return 'video/webm';
  if (clean.endsWith('.mov')) return 'video/quicktime';
  if (clean.endsWith('.ogg') || clean.endsWith('.ogv')) return 'video/ogg';
  return 'video/mp4';
}
