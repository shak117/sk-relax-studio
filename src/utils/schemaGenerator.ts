import { BRAND } from '../data/brandData';
import { COURSES } from '../data/academyData';
import { SERVICES } from '../data/servicesData';

/**
 * Returns the configured base site URL
 */
export function getBaseSiteUrl(): string {
  if (typeof window !== 'undefined' && import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL.replace(/\/+$/, '');
  }
  return 'https://skrelaxbeauty.com';
}

/**
 * Core Schema.org LocalBusiness & BeautySalon schema for Satara, Maharashtra
 * Uses only verified information. No fake ratings, reviews, or coordinates.
 */
export function generateLocalBusinessSchema() {
  const siteUrl = getBaseSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': ['BeautySalon', 'EducationalOrganization'],
    '@id': `${siteUrl}/#business`,
    name: BRAND.name,
    alternateName: ['SK Relax Satara', 'SK Relax Salon', 'SK Relax Beauty Academy'],
    description: 'Premier beauty academy and luxury salon in Satara, Maharashtra. Offering signature butterfly haircuts, professional styling, restorative skin facials, bridal beauty, and hands-on hair-cutting masterclasses.',
    url: siteUrl,
    telephone: BRAND.phone,
    logo: `${siteUrl}/logo-icon.svg`,
    image: [
      `${siteUrl}/images/academy/hair-cutting-masterclass-poster.jpg`,
      `${siteUrl}/images/services/butterfly-haircut.jpg`,
      `${siteUrl}/images/hero-poster.jpg`
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Satara',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN'
    },
    sameAs: [
      BRAND.instagramUrl
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '20:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '10:00',
        closes: '18:00'
      }
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BRAND.phone,
      contactType: 'customer service',
      availableLanguage: ['English', 'Marathi', 'Hindi']
    }
  };
}

/**
 * Schema for Course offerings (3-Day Hair Cutting Masterclass)
 */
export function generateAcademyCourseSchema() {
  const siteUrl = getBaseSiteUrl();
  const masterclass = COURSES[0];

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: masterclass.title,
    description: 'Intensive 3-Day Hair Cutting Masterclass covering elevation degrees, sectioning, tools, butterfly haircut, long layers, feather cuts, curtain bangs, face framing, and mannequin dummy practice in Satara.',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'SK Relax Beauty Academy',
      sameAs: siteUrl
    },
    offers: {
      '@type': 'Offer',
      price: '4000',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/academy`
    },
    educationalCredentialAwarded: masterclass.certification,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      location: {
        '@type': 'Place',
        name: 'SK Relax Beauty Academy',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Satara',
          addressRegion: 'Maharashtra',
          addressCountry: 'IN'
        }
      }
    }
  };
}

/**
 * Schema for Services catalogue
 */
export function generateServicesCatalogSchema() {
  const siteUrl = getBaseSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'SK Relax Salon Services Catalogue Satara',
    itemListElement: SERVICES.slice(0, 8).map((s, index) => ({
      '@type': 'Offer',
      position: index + 1,
      itemOffered: {
        '@type': 'Service',
        name: s.title,
        description: s.shortDescription,
        provider: {
          '@id': `${siteUrl}/#business`
        }
      }
    }))
  };
}

/**
 * BreadcrumbList Schema for page hierarchy
 */
export function generateBreadcrumbSchema(items: { name: string; path: string }[]) {
  const siteUrl = getBaseSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`
    }))
  };
}
