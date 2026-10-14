/**
 * SK RELAX BEAUTY ACADEMY & SALON — PRIVACY-FIRST ANALYTICS & META PIXEL SERVICE
 * 
 * Complies with strict privacy standards:
 * 1. Zero PII: Customer names, phone numbers, and notes are NEVER transmitted.
 * 2. Deduplication: Eliminates duplicate PageView events across React re-renders.
 * 3. Graceful fallback: Site remains 100% operational if Pixel ID is missing or consent is declined.
 * 4. Configurable via VITE_META_PIXEL_ID in environment variables.
 */

// Augment Window interface to recognize fbq
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export type ConsentStatus = 'granted' | 'denied' | 'pending';

const CONSENT_STORAGE_KEY = 'skrelax_tracking_consent';
let lastTrackedPath: string | null = null;
let pixelInitialized = false;

/**
 * Gets the current consent status from localStorage
 */
export function getConsentStatus(): ConsentStatus {
  if (typeof window === 'undefined') return 'pending';
  const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
  if (saved === 'granted' || saved === 'denied') {
    return saved;
  }
  return 'pending';
}

/**
 * Sets the consent status in localStorage and initializes or revokes Pixel
 */
export function setConsentStatus(status: 'granted' | 'denied') {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_STORAGE_KEY, status);

  if (status === 'granted') {
    initMetaPixel();
    if (window.location) {
      trackPageView(window.location.pathname);
    }
  } else {
    // Revoke consent in fbq if active
    if (window.fbq) {
      window.fbq('consent', 'revoke');
    }
  }
}

/**
 * Initializes the Meta Pixel script dynamically (only once)
 */
export function initMetaPixel(): boolean {
  if (typeof window === 'undefined') return false;

  const pixelId = import.meta.env.VITE_META_PIXEL_ID;
  const requireConsent = import.meta.env.VITE_REQUIRE_CONSENT !== 'false';
  const consent = getConsentStatus();

  // If consent is required but not granted, hold initialization
  if (requireConsent && consent !== 'granted') {
    if (import.meta.env.DEV) {
      console.log('[Analytics] Meta Pixel awaiting user consent.');
    }
    return false;
  }

  // If no Pixel ID configured, remain dormant gracefully
  if (!pixelId || pixelId.trim() === '') {
    if (import.meta.env.DEV) {
      console.log('[Analytics] VITE_META_PIXEL_ID not configured. Tracking is dormant.');
    }
    return false;
  }

  if (pixelInitialized && window.fbq) {
    return true;
  }

  try {
    // Official Meta Pixel base code loader
    /* eslint-disable */
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    if (window.fbq) {
      window.fbq('consent', 'grant');
      window.fbq('init', pixelId.trim());
      pixelInitialized = true;
      if (import.meta.env.DEV) {
        console.log(`[Analytics] Meta Pixel initialized with ID: ${pixelId.trim()}`);
      }
      return true;
    }
  } catch (err) {
    console.warn('[Analytics] Failed to initialize Meta Pixel:', err);
  }

  return false;
}

/**
 * Tracks SPA route navigation (deduplicated)
 */
export function trackPageView(path: string) {
  if (typeof window === 'undefined') return;

  // Prevent duplicate pageview triggers on same path
  if (lastTrackedPath === path) return;
  lastTrackedPath = path;

  if (window.fbq && pixelInitialized) {
    window.fbq('track', 'PageView');
    if (import.meta.env.DEV) {
      console.log(`[Analytics Event] PageView -> ${path}`);
    }
  }
}

/**
 * Tracks viewing of service or academy course content (PII-free)
 */
export function trackViewContent(params: {
  content_name: string;
  content_category: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
}) {
  if (typeof window === 'undefined') return;

  if (window.fbq && pixelInitialized) {
    window.fbq('track', 'ViewContent', {
      content_name: params.content_name,
      content_category: params.content_category,
      content_ids: params.content_ids,
      value: params.value ?? 0,
      currency: params.currency ?? 'INR',
    });
    if (import.meta.env.DEV) {
      console.log('[Analytics Event] ViewContent:', params.content_name);
    }
  }
}

/**
 * Tracks contact actions: phone clicks, Instagram clicks, or general WhatsApp
 */
export function trackContactAction(params: {
  method: 'phone' | 'whatsapp' | 'instagram' | 'map';
  touchpoint: string;
  label?: string;
}) {
  if (typeof window === 'undefined') return;

  if (window.fbq && pixelInitialized) {
    window.fbq('track', 'Contact', {
      content_name: `Contact via ${params.method}`,
      content_category: params.touchpoint,
    });
    if (import.meta.env.DEV) {
      console.log(`[Analytics Event] Contact (${params.method}) from ${params.touchpoint}`);
    }
  }
}

/**
 * Tracks a validated appointment or masterclass enquiry handoff (Lead)
 * CRITICAL: Personal details (name, phone, message) are strictly EXCLUDED!
 */
export function trackLeadSubmission(params: {
  service_name: string;
  preferred_date?: string;
  preferred_time?: string;
  category?: string;
}) {
  if (typeof window === 'undefined') return;

  if (window.fbq && pixelInitialized) {
    // Standard Lead event for Ads Manager conversion attribution
    window.fbq('track', 'Lead', {
      content_name: params.service_name,
      content_category: params.category || 'Appointment Inquiry',
      currency: 'INR',
      value: 0,
      status: 'whatsapp_handoff_initiated',
    });

    // Custom event with touchpoint detail
    window.fbq('trackCustom', 'WhatsApp_Handoff', {
      service_name: params.service_name,
      has_date: Boolean(params.preferred_date),
      has_time: Boolean(params.preferred_time),
      destination: '918459890270',
    });

    if (import.meta.env.DEV) {
      console.log('[Analytics Event] Lead & WhatsApp_Handoff fired (PII-free) for:', params.service_name);
    }
  }
}

/**
 * Tracks direct WhatsApp click on service cards, floating button, or header
 */
export function trackWhatsAppClick(touchpoint: string, serviceName?: string) {
  if (typeof window === 'undefined') return;

  if (window.fbq && pixelInitialized) {
    window.fbq('track', 'Contact', {
      content_name: serviceName ? `Enquiry for ${serviceName}` : 'General WhatsApp Chat',
      content_category: touchpoint,
    });

    window.fbq('trackCustom', 'WhatsApp_Click', {
      touchpoint,
      service_name: serviceName || 'General Consultation',
    });

    if (import.meta.env.DEV) {
      console.log(`[Analytics Event] WhatsApp_Click from ${touchpoint}`);
    }
  }
}
