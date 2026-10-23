import { BatchItem } from '../types';

const TOKEN_KEY = 'skrelax_admin_jwt';

export const FALLBACK_BATCHES: BatchItem[] = [
  {
    id: 'hair-cutting-seminar-22-oct-2026',
    slug: 'advance-hair-cutting-22-oct',
    title: 'One-Day Hair Cutting Seminar',
    category: 'workshop',
    eventType: 'one-day',
    status: 'enrolling',
    badge: 'Look & Learn Seminar',
    startDate: '2026-10-22',
    endDate: '2026-10-22',
    timing: '10:30 AM – 5:30 PM',
    duration: 'One Day Seminar',
    fee: 500,
    feeDisplay: '₹500',
    image: '/uploads/batches/batch-1792403187768-whatsapp-image-2026-10-17-at-11-31-01-am.jpeg',
    leadTrainer: 'Salma Attar (Founder & Master Beauty Educator)',
    venue: 'SK Relax Beauty Academy & Salon, Satara, Maharashtra',
    prerequisites: 'Open to salon stylists, beauty students, and passionate beginners.',
    included: [
      'Look & Learn 4 Trending Haircuts',
      'Live Model Demonstration by Salma Attar',
      'Official Academy Certificate of Seminar Attendance'
    ],
    curriculum: [
      'Trending Butterfly Haircut Demonstration',
      'Classic Long Layer Haircut Technique',
      'Face Framing & Elevation Angles',
      'Curtain Bangs Styling & Finishing'
    ],
    description: 'One-day practical look & learn hair cutting seminar at SK Relax Beauty Academy, Satara. Learn 4 trending haircut techniques — Butterfly Cut, Long Layer, Face Framing, and Curtain Bangs with personal attention and expert guidance from Salma Attar.',
    whatsappPreset: "Hello Salma Ma'am, I would like to book my seat for the One-Day Hair Cutting Seminar (22 Oct 2026) at SK Relax Academy Satara.",
    createdAt: '2026-10-19T09:47:21.331Z',
    updatedAt: '2026-10-19T18:30:00.000Z'
  },
  {
    id: 'hair-cutting-masterclass-oct-2026',
    slug: 'hair-cutting-masterclass',
    title: '3-Day Advanced Hair Cutting & Layering Masterclass',
    category: 'masterclass',
    eventType: 'multi-day',
    status: 'enrolling',
    badge: 'Hands-on Dummy Head Included',
    startDate: '2026-10-23',
    endDate: '2026-10-25',
    timing: '10:30 AM – 5:30 PM (Daily)',
    duration: '3 Days Intensive Hands-on Workshop',
    fee: 4000,
    feeDisplay: '₹4,000',
    image: '/images/academy/hair-cutting-masterclass-poster.jpg',
    leadTrainer: 'Salma Attar (Founder & Master Beauty Educator)',
    venue: 'SK Relax Beauty Academy & Salon, Satara, Maharashtra',
    prerequisites: 'Open to salon stylists, beauty academy students, and beginners passionate about modern haircutting techniques.',
    included: [
      'Individual Practice Mannequin Dummy Head (Yours to keep)',
      'Official Academy Certificate of Haircut Artistry',
      'Live Step-by-Step Model Demonstrations by Salma Attar',
      'Hands-on Sectioning, Degree Geometry & Elevation Guidance',
      'All Required Styling Tools & Products during the Workshop',
      'Lunch, Tea & Refreshments during Training Days'
    ],
    curriculum: [
      'Day 1: Elevation Degree Geometry (0°, 45°, 90°, 180°) & Finger Grip Angles',
      'Day 1: Classic Long Layers & Seamless Graduation Techniques',
      'Day 2: Trending Butterfly Cut & Volume Weight Removal',
      'Day 2: Face-Framing Fringe, Curtain Bangs & Texturizing Feathers',
      'Day 3: Client Head Shape Consultation & Hair Density Analysis',
      'Day 3: Professional Salon Blow-Dry Finish, Curls & Portfolio Photos'
    ],
    description: 'Join Salma Attar for an intensive 3-day practical haircutting masterclass in Satara. Every enrolled student receives an individual mannequin dummy head for direct hands-on practice. Master modern layer cuts, the viral butterfly technique, and graduation geometry to boost your salon revenue.',
    whatsappPreset: "Hello Salma Ma'am, I would like to book my seat for the 3-Day Hair Cutting Masterclass (Oct 23–25, 2026) at SK Relax Academy in Satara.",
    createdAt: '2026-10-18T10:00:00.000Z',
    updatedAt: '2026-10-18T10:00:00.000Z'
  },
  {
    id: 'beauty-hair-diploma-nov-2026',
    slug: 'beauty-hair-diploma',
    title: 'Professional 20-in-1 Beauty, Hair & Aesthetic Diploma',
    category: 'diploma',
    status: 'draft',
    badge: 'Complete Professional Kit Included',
    startDate: '2026-11-10',
    endDate: '2026-12-15',
    timing: '11:00 AM – 4:00 PM (Monday to Friday)',
    duration: '5 Weeks Career Building Program',
    fee: 25000,
    feeDisplay: '₹25,000',
    totalSeats: 12,
    seatsRemaining: 6,
    image: '/images/brochures/academy-classes-poster.jpg',
    leadTrainer: 'Salma Attar & Senior Studio Faculty',
    venue: 'SK Relax Beauty Academy & Salon, Satara, Maharashtra',
    prerequisites: 'Suitable for anyone aspiring to start a profitable beauty parlour, salon studio, or freelance bridal makeup career.',
    included: [
      'Comprehensive Professional Starter Beauty & Styling Kit',
      'Government-Aligned Academy Diploma Certificate',
      'Complete Hands-on Machine Aesthetic Training (Hydra 7-in-1, PMU, LED)',
      'Direct Supervised Live Client & Dummy Practice',
      'Salon Business Setup, Pricing & Social Media Guidance'
    ],
    curriculum: [
      'Module 1: Advanced Hair Cutting, Chemical Straightening & Keratin Botox',
      'Module 2: Clinical Aesthetic Facials (7-in-1 Hydra, Korean Glass Skin, BB Glow)',
      'Module 3: Permanent Makeup (PMU) — Microblading, Lip Blush & Eyebrow Mapping',
      'Module 4: Bridal Makeup Artistry, HD 3D Waterproof Base & Saree Draping',
      'Module 5: Machine Sterilization, Salon Hygiene & Client Consultation'
    ],
    description: 'A complete career-building diploma designed for aspiring salon entrepreneurs and beauty professionals in Satara. Covers 20 practical modules including hair science, clinical aesthetic equipment, bridal glam, and permanent makeup.',
    whatsappPreset: "Hello Salma Ma'am, I am interested in enrolling for the 20-in-1 Professional Beauty & Hair Diploma starting November 10 at SK Relax Academy.",
    createdAt: '2026-10-18T10:00:00.000Z',
    updatedAt: '2026-10-18T10:00:00.000Z'
  },
  {
    id: 'hydra-facial-workshop-nov-2026',
    slug: 'hydra-facial-workshop',
    title: 'Clinical 7-in-1 Hydra Aesthetic & Machine Training',
    category: 'workshop',
    status: 'draft',
    badge: 'Hands-on Machine Handling',
    startDate: '2026-11-28',
    endDate: '2026-11-29',
    timing: '11:00 AM – 5:00 PM (Saturday & Sunday)',
    duration: '2 Days Practical Machine Workshop',
    fee: 6500,
    feeDisplay: '₹6,500',
    totalSeats: 10,
    seatsRemaining: 5,
    image: '/images/machines/hydra-facial-machine.jpg',
    leadTrainer: 'Salma Attar (Founder & Clinical Aesthetics Specialist)',
    venue: 'SK Relax Beauty Academy, Satara, Maharashtra',
    prerequisites: 'Open to practicing beauticians and salon owners seeking to introduce aesthetic machine treatments.',
    included: [
      'Direct Hands-on Practice with 7-in-1 Multifunction Console',
      'Clinical Aesthetics Workshop Certificate',
      'Serum Protocol Guide & Distributor Contact Directory',
      'Client Skin Consultation & Contraindication Checklists'
    ],
    curriculum: [
      'Day 1: Hydro-Dermabrasion Vacuum Vortex Extraction & Tip Selection',
      'Day 1: Ultrasonic Skin Scrubber & Deep Pore Clarification',
      'Day 2: Bipolar RF Skin Tightening & Cryo Cold Hammer Soothing',
      'Day 2: Korean Glass Skin Multi-Ampoule Layering & LED Phototherapy'
    ],
    description: 'Specialized machine training for beauticians wanting to introduce high-ticket hydra facials and skin aesthetics in their salons.',
    whatsappPreset: "Hello Salma Ma'am, please share details for the 2-Day Clinical Hydra Aesthetic Machine Training in Satara.",
    createdAt: '2026-10-18T10:00:00.000Z',
    updatedAt: '2026-10-18T10:00:00.000Z'
  },
  {
    id: 'monsoon-hair-styling-aug-2026',
    slug: 'monsoon-hair-styling',
    title: 'Monsoon Hair Styling & Layer Graduation Batch',
    category: 'masterclass',
    status: 'completed',
    badge: 'Batch Completed · Certified',
    startDate: '2026-08-15',
    endDate: '2026-08-17',
    timing: '10:30 AM – 5:30 PM',
    duration: '3 Days Masterclass',
    fee: 4000,
    feeDisplay: '₹4,000',
    totalSeats: 15,
    seatsRemaining: 0,
    image: '/images/events/certificate-celebration-hero.jpg',
    leadTrainer: 'Salma Attar',
    venue: 'SK Relax Beauty Academy, Satara, Maharashtra',
    prerequisites: 'Completed successfully.',
    included: [
      'Individual Mannequin Dummy Head',
      'Academy Certificate of Completion',
      'Batch Photo Celebration'
    ],
    curriculum: [
      'Elevation Degree Geometry & Sectioning',
      'Butterfly Layer Cut & Face-Framing',
      'Salon Blowout & Graduation Styling'
    ],
    description: 'Our successfully graduated August batch. All 15 students received certificates and completed hands-on dummy haircuts under Salma Attar.',
    whatsappPreset: "Hello Salma Ma'am, when is the next batch after the August graduation?",
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-18T10:00:00.000Z'
  }
];

export const batchService = {
  getAuthToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setAuthToken(token: string | null) {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
  },

  async login(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    const cleanUser = username?.trim();
    if (!cleanUser || !password) {
      return { success: false, error: 'Please enter both username and password.' };
    }

    try {
      let res: Response;
      try {
        res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ username: cleanUser, password })
        });
      } catch (networkErr) {
        // Network connection error / server offline
        return {
          success: false,
          error: 'Unable to contact the authentication server. Please try again.'
        };
      }

      // Read response text safely before parsing to avoid Unexpected end of JSON input
      let text = '';
      try {
        text = await res.text();
      } catch {
        text = '';
      }

      let data: any = null;
      if (text && text.trim()) {
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }
      }

      // Successful login
      if (res.status === 200 && data?.success && data?.token) {
        this.setAuthToken(data.token);
        return { success: true, token: data.token };
      }

      // Invalid credentials
      if (res.status === 401) {
        const errorMsg = data?.message || data?.error || 'Invalid username or password';
        return { success: false, error: errorMsg };
      }

      // Rate limited
      if (res.status === 429) {
        const errorMsg = data?.message || data?.error || 'Too many failed login attempts. Please try again in 15 minutes.';
        return { success: false, error: errorMsg };
      }

      // Bad request
      if (res.status === 400) {
        const errorMsg = data?.message || data?.error || 'Please enter valid login credentials.';
        return { success: false, error: errorMsg };
      }

      // If backend returned a specific error message
      if (data && (data.message || data.error)) {
        return { success: false, error: data.message || data.error };
      }

      // Default safe error for any unexpected response
      return {
        success: false,
        error: 'Unable to contact the authentication server. Please try again.'
      };
    } catch (err: any) {
      return {
        success: false,
        error: 'Unable to contact the authentication server. Please try again.'
      };
    }
  },

  async checkAuth(): Promise<boolean> {
    const token = this.getAuthToken();
    if (!token) return false;
    try {
      const res = await fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  logout() {
    this.setAuthToken(null);
  },

  async getBatches(): Promise<BatchItem[]> {
    const token = this.getAuthToken();
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/batches', { headers });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('API fetch failed, using fallback batches:', err);
    }
    // Fallback: hide drafts unless authenticated
    if (!token) {
      return FALLBACK_BATCHES.filter(b => b.status !== 'draft');
    }
    return FALLBACK_BATCHES;
  },

  async getBatchBySlugOrId(slugOrId: string): Promise<BatchItem | null> {
    const token = this.getAuthToken();
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`/api/batches/${slugOrId}`, { headers });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('API fetch failed for single batch, checking fallback:', err);
    }
    const found = FALLBACK_BATCHES.find(b => b.id === slugOrId || b.slug === slugOrId);
    return found || null;
  },

  async createBatch(batchData: Partial<BatchItem>): Promise<{ success: boolean; data?: BatchItem; error?: string }> {
    const token = this.getAuthToken();
    if (!token) return { success: false, error: 'Unauthorized: Please login' };

    try {
      const res = await fetch('/api/batches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(batchData)
      });
      const json = await res.json();
      if (json.success && json.data) {
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error || 'Failed to create batch' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  },

  async updateBatch(id: string, batchData: Partial<BatchItem>): Promise<{ success: boolean; data?: BatchItem; error?: string }> {
    const token = this.getAuthToken();
    if (!token) return { success: false, error: 'Unauthorized: Please login' };

    try {
      const res = await fetch(`/api/batches/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(batchData)
      });
      const json = await res.json();
      if (json.success && json.data) {
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error || 'Failed to update batch' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  },

  async publishBatch(id: string): Promise<{ success: boolean; data?: BatchItem; error?: string }> {
    return this.updateBatch(id, { status: 'enrolling' });
  },

  async unpublishBatch(id: string): Promise<{ success: boolean; data?: BatchItem; error?: string }> {
    return this.updateBatch(id, { status: 'draft' });
  },

  async archiveBatch(id: string): Promise<{ success: boolean; error?: string }> {
    const token = this.getAuthToken();
    if (!token) return { success: false, error: 'Unauthorized: Please login' };

    try {
      const res = await fetch(`/api/batches/${id}?archive=true`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        return { success: true };
      }
      return { success: false, error: json.error || 'Failed to archive batch' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  },

  async deleteBatch(id: string, permanent: boolean = true): Promise<{ success: boolean; error?: string }> {
    const token = this.getAuthToken();
    if (!token) return { success: false, error: 'Unauthorized: Please login' };

    try {
      const url = permanent ? `/api/batches/${id}?permanent=true` : `/api/batches/${id}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        return { success: true };
      }
      return { success: false, error: json.error || 'Failed to delete batch' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  },

  async uploadImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    const token = this.getAuthToken();
    if (!token) return { success: false, error: 'Unauthorized: Please login' };

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'batches');

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
          // Let the browser set multipart/form-data with boundary
        },
        body: formData
      });

      const json = await res.json();
      if (json.success) {
        const url = json.url || json.data?.url;
        return { success: true, url };
      }
      return { success: false, error: json.error || 'Upload failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during upload' };
    }
  }
};
