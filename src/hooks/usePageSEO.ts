import { useEffect } from 'react';
import { getBaseSiteUrl } from '../utils/schemaGenerator';
import { trackPageView } from '../services/analytics';

interface PageSEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'business.business' | 'article';
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Manages document title, meta tags, canonical links, Open Graph, Twitter cards,
 * structured JSON-LD data, and deduplicated SPA analytics pageviews.
 */
export function usePageSEO({
  title,
  description,
  path,
  image = '/images/og-preview.jpg',
  type = 'website',
  schema,
}: PageSEOProps) {
  useEffect(() => {
    const siteUrl = getBaseSiteUrl();
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const canonicalUrl = `${siteUrl}${cleanPath === '/' ? '' : cleanPath}`;
    const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

    // 1. Title
    document.title = title;

    // Helper to set or create meta tag
    const setMetaTag = (attribute: 'name' | 'property', key: string, value: string) => {
      let tag = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', value);
    };

    // 2. Standard Meta
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', 'index, follow');

    // 3. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', fullImageUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', 'SK Relax Beauty Academy & Salon');
    setMetaTag('property', 'og:locale', 'en_IN');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', fullImageUrl);

    // 6. JSON-LD Structured Data
    if (schema) {
      let scriptTag = document.getElementById('page-jsonld') as HTMLScriptElement | null;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'page-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(schema);
    }

    // 7. Track SPA PageView (Deduplicated)
    trackPageView(cleanPath);

    return () => {
      // Clean up page-specific JSON-LD when unmounting
      const scriptTag = document.getElementById('page-jsonld');
      if (scriptTag) {
        scriptTag.remove();
      }
    };
  }, [title, description, path, image, type, schema]);
}
