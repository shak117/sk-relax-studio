export type ServiceCategory = 
  | 'all' 
  | 'hair' 
  | 'hair-care' 
  | 'skin' 
  | 'makeup' 
  | 'bridal' 
  | 'grooming';

export interface ServiceItem {
  id: string;
  title: string;
  category: ServiceCategory;
  categoryLabel: string;
  shortDescription: string;
  description: string;
  image: string;
  price?: string;
  duration?: string;
  features: string[];
  isSignature?: boolean;
  badge?: string;
  confirmed: boolean; // Indicates client-verified vs proposed catalogue item
}

export interface AcademyCourse {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  duration: string;
  fee?: string;
  nextBatch: string;
  isEnrollmentOpen: boolean;
  image: string;
  posterImage?: string;
  highlights: string[];
  syllabus: {
    title: string;
    topics: string[];
  }[];
  includes: string[];
  targetAudience: string;
  certification: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'hair' | 'makeup' | 'skin' | 'bridal' | 'academy' | 'salon';
  categoryLabel: string;
  image: string;
  alt: string;
  description: string;
  tag?: string;
}

export interface BookingFormData {
  fullName: string;
  mobileNumber: string;
  preferredService: string;
  preferredDate?: string;
  preferredTime?: string;
  additionalMessage?: string;
}
