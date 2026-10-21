export type ServiceCategory = 
  | 'all' 
  | 'hair-treatments'
  | 'facials-skin'
  | 'makeup-bridal'
  | 'permanent-makeup'
  | 'equipment-machines'
  | 'other'
  // Legacy aliases for backward compatibility
  | 'hair' 
  | 'hair-care' 
  | 'skin' 
  | 'makeup' 
  | 'bridal' 
  | 'grooming';

export type ServicePricingMode = 'fixed' | 'starting' | 'enquiry';
export type ServicePublicationStatus = 'published' | 'draft' | 'archived';

export interface ServiceItem {
  id: string;
  slug?: string;
  title: string;
  category: ServiceCategory;
  categoryLabel: string;
  shortDescription: string;
  description: string;
  image: string;
  thumbnail?: string;
  imagePosition?: string;
  videoUrl?: string;
  videoPoster?: string;
  pricingMode?: ServicePricingMode;
  price?: string | number;
  promotionalPrice?: string | number;
  currency?: string;
  duration?: string;
  features: string[];
  isSignature?: boolean;
  isEducational?: boolean; // Distinguishes educational/science topics from client treatments
  badge?: string;
  status?: ServicePublicationStatus;
  displayOrder?: number;
  whatsappMessage?: string;
  whatsappNumber?: string;
  confirmed?: boolean; // Indicates client-verified vs proposed catalogue item
  createdAt?: string;
  updatedAt?: string;
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
  videoUrl?: string;
  highlights: string[];
  syllabus: {
    title: string;
    topics: string[];
  }[];
  includes: string[];
  targetAudience: string;
  certification: string;
  brochureImage?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  expertise: string[];
  isFounder?: boolean;
  published: boolean;
}

export interface AcademyEvent {
  id: string;
  title: string;
  batchName?: string;
  date?: string;
  description: string;
  image?: string;
  videoUrl?: string;
  category: 'batch' | 'workshop' | 'celebration';
}

export interface StudentFeedback {
  id: string;
  studentName: string;
  courseName: string;
  batch?: string;
  videoUrl?: string;
  posterImage?: string;
  quote?: string;
  avatar?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'hair' | 'makeup' | 'skin' | 'bridal' | 'pmu' | 'machines' | 'academy' | 'team' | 'events';
  categoryLabel: string;
  image: string;
  imagePosition?: string;
  videoUrl?: string;
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

export type BatchCategory = 'masterclass' | 'diploma' | 'workshop';
export type BatchStatus = 'upcoming' | 'enrolling' | 'fully_booked' | 'completed' | 'draft' | 'archived';
export type EventDurationType = 'one-day' | 'multi-day' | 'course';

export interface BatchItem {
  id: string;
  slug: string;
  title: string;
  category: BatchCategory;
  eventType?: EventDurationType;
  status: BatchStatus;
  badge?: string;
  startDate: string;
  endDate: string;
  timing: string;
  duration: string;
  fee: number;
  discount?: number;
  feeDisplay?: string;
  totalSeats?: number;
  seatsRemaining?: number;
  image: string;
  thumbnail?: string;
  videoUrl?: string;
  leadTrainer: string;
  venue: string;
  prerequisites?: string;
  included: string[];
  curriculum: string[];
  description: string;
  whatsappPreset?: string;
  createdAt: string;
  updatedAt: string;
}

