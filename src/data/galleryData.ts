import { GalleryItem } from '../types';

export const GALLERY_CATEGORIES = [
  { id: 'all', label: 'All Work' },
  { id: 'hair', label: 'Hair Artistry' },
  { id: 'skin', label: 'Facials & Skincare' },
  { id: 'bridal', label: 'Makeup & Bridal' },
  { id: 'academy', label: 'Academy Training' },
  { id: 'team', label: 'Our Team' },
  { id: 'events', label: 'Events & Batches' }
] as const;

export const GALLERY_ITEMS: GalleryItem[] = [
  // --- HAIR ARTISTRY ---
  {
    id: 'gal-hair-1',
    title: 'The Signature Butterfly Haircut',
    category: 'hair',
    categoryLabel: 'Hair Artistry',
    image: '/images/gallery/butterfly-haircut.jpg',
    alt: 'Butterfly Haircut with voluminous layered bounce at SK Relax Salon Satara',
    description: 'Cascading butterfly layers styled with professional outward blowout for maximum volume and texture.',
    tag: 'Signature Cut'
  },
  {
    id: 'gal-hair-2',
    title: 'Seamless Long Layer Haircut',
    category: 'hair',
    categoryLabel: 'Hair Artistry',
    image: '/images/gallery/long-layer-haircut.jpg',
    alt: 'Long layer haircut with natural flow and soft edges',
    description: 'Precision long layered cut retaining full length while offering fluid motion and weight relief.',
    tag: 'Long Layers'
  },
  {
    id: 'gal-hair-3',
    title: 'Face Framing Layers & Curtain Bangs',
    category: 'hair',
    categoryLabel: 'Hair Artistry',
    image: '/images/gallery/face-framing.jpg',
    alt: 'Face framing layered styling accentuating jawline and cheekbones',
    description: 'Angled perimeter slicing creating tailored movement around facial features.',
    tag: 'Face Framing'
  },
  {
    id: 'gal-hair-4',
    title: 'Curtain Bangs Precision Cut',
    category: 'hair',
    categoryLabel: 'Hair Artistry',
    image: '/images/gallery/curtain-bangs.jpg',
    alt: 'Curtain bangs styled with soft center part and blow-dry bevel',
    description: 'Center-parted featherweight bangs tailored for seamless blending with side hair lengths.',
    tag: 'Curtain Bangs'
  },
  {
    id: 'gal-hair-5',
    title: 'Classic Feather Haircut',
    category: 'hair',
    categoryLabel: 'Hair Artistry',
    image: '/images/gallery/feather-haircut.jpg',
    alt: 'Classic feather cut with lightweight tapered ends',
    description: 'Delicate feathered graduation designed for airy styling and everyday effortless wear.',
    tag: 'Feather Cut'
  },
  {
    id: 'gal-hair-6',
    title: 'Hair Transformation & Restorative Care',
    category: 'hair',
    categoryLabel: 'Hair Artistry',
    image: '/images/gallery/hair-transformation.jpg',
    videoUrl: '/videos/treatments/client-hair-service.mp4',
    alt: 'SK Relax beautician performing clinical aesthetic machine facial treatment on client in Satara',
    description: 'Deep restorative keratin smoothing and cuticle repair imparting silky frizz-free softness.',
    tag: 'Video Available'
  },

  // --- FACIALS & SKINCARE ---
  {
    id: 'gal-skin-1',
    title: '7-in-1 Clinical Hydra Facial Technology',
    category: 'skin',
    categoryLabel: 'Facials & Skincare',
    image: '/images/machines/hydra-facial-machine.jpg',
    videoUrl: '/videos/treatments/hydra-facial.mp4',
    alt: 'Multifunction Hydra facial aesthetic console at SK Relax Salon Satara',
    description: 'Clinical hydra microdermabrasion, vortex pore extraction, and ultrasound peptide infusion.',
    tag: 'Hydra Machine'
  },
  {
    id: 'gal-skin-2',
    title: 'Crystal & Diamond Skin Polishing Glow',
    category: 'skin',
    categoryLabel: 'Facials & Skincare',
    image: '/images/treatments/treatment-client-1.jpg',
    alt: 'Radiant dewy skin polishing treatment result at SK Relax Salon Satara',
    description: 'Immediate porcelain glass skin texture achieved via gentle microdermabrasion and nutrient serums.',
    tag: 'Skin Polishing'
  },
  {
    id: 'gal-skin-3',
    title: 'Korean Glass Skin Glow & Hydro-Facial',
    category: 'skin',
    categoryLabel: 'Facials & Skincare',
    image: '/images/treatments/korean-glass-skin-glow.jpg',
    videoUrl: '/videos/treatments/client-treatment-transformation.mp4',
    alt: 'Client Korean Glass Skin Glow facial treatment with soft fan brush application at SK Relax',
    description: 'Dewy glass skin hydration with dual fan brush lymphatic drainage and peptide ampoule infusion.',
    tag: 'Glass Skin Glow'
  },
  {
    id: 'gal-skin-4',
    title: 'Clinical Facial Skin Barrier Therapy',
    category: 'skin',
    categoryLabel: 'Facials & Skincare',
    image: '/images/treatments/facial-treatment-frame.jpg',
    videoUrl: '/videos/treatments/facial-treatment.mp4',
    alt: 'Client facial skin therapy and cooling mask application at SK Relax Salon Satara',
    description: 'Targeted skin treatment calming inflammation, balancing sebum, and enhancing cellular radiance.',
    tag: 'Video Available'
  },

  // --- MAKEUP & BRIDAL ---
  {
    id: 'gal-bridal-1',
    title: 'Royal Paithani Maharashtrian Bridal Artistry',
    category: 'bridal',
    categoryLabel: 'Makeup & Bridal',
    image: '/images/gallery/maharashtrian-bridal-artistry.jpg',
    alt: 'Authentic Maharashtrian Paithani bride styled by SK Relax Beauty Academy & Salon Satara',
    description: 'Signature Maharashtrian bridal glam with traditional jewelry, radiant HD base, and authentic Paithani styling.',
    tag: 'Paithani Bride'
  },
  {
    id: 'gal-bridal-2',
    title: 'Traditional South Indian Silk Bridal Couture',
    category: 'bridal',
    categoryLabel: 'Makeup & Bridal',
    image: '/images/gallery/traditional-silk-bridal-couture.jpg',
    alt: 'Traditional South Indian silk saree bridal makeover at SK Relax Satara',
    description: 'Opulent silk saree draping, temple jewelry coordination, and flawless waterproof bridal makeover.',
    tag: 'Silk Bridal Couture'
  },
  {
    id: 'gal-bridal-3',
    title: 'Bespoke Bridal Makeover & Draping',
    category: 'bridal',
    categoryLabel: 'Makeup & Bridal',
    image: '/images/services/bridal-beauty.jpg',
    alt: 'Bridal makeup and jewelry setting in Satara',
    description: 'Complete pre-wedding consultation, waterproof eye artistry, and royal saree draping.',
    tag: 'Bridal Makeover'
  },

  // --- ACADEMY TRAINING ---
  {
    id: 'gal-acad-1',
    title: 'Hands-on Mannequin Dummy Haircut Training',
    category: 'academy',
    categoryLabel: 'Academy Training',
    image: '/images/gallery/hands-on-practice.jpg',
    videoUrl: '/videos/events/hands-on-experience.mp4',
    alt: 'Hands-on hair cutting scissor technique with student guidance at SK Relax Academy Satara',
    description: 'Step-by-step sectioning, angle elevation, and scissor control on academy-provided dummies.',
    tag: 'Hands-on Practice'
  },
  {
    id: 'gal-acad-2',
    title: 'Permanent Makeup (PMU) & Microblading Results',
    category: 'academy',
    categoryLabel: 'Academy Training',
    image: '/images/gallery/pmu-eyebrow-result.jpg',
    alt: 'Real client PMU eyebrow microblading before and after result at SK Relax Satara',
    description: 'Crisp microblading and ombré powder brow results achieved with medical-grade sterile pigments.',
    tag: 'Real PMU Result'
  },
  {
    id: 'gal-acad-3',
    title: 'Aesthetic Machines & Console Training',
    category: 'academy',
    categoryLabel: 'Academy Training',
    image: '/images/machines/hydra-facial-machine.jpg',
    alt: 'Aesthetic machine console and practical setup at SK Relax Beauty Academy Satara',
    description: 'Comprehensive student training on 7-in-1 Hydra consoles, ultrasonic probes, and RF wands.',
    tag: 'Machine Tech'
  },

  // --- OUR TEAM ---
  {
    id: 'gal-team-1',
    title: 'Salma Attar — Founder & Master Educator',
    category: 'team',
    categoryLabel: 'Our Team',
    image: '/images/team/salma-attar-founder.jpg',
    alt: 'Salma Attar, Founder & Master Educator at SK Relax Beauty Academy & Salon Satara',
    description: 'Leading our academy curriculum, clinical aesthetic mentoring, and signature bridal styling in Satara.',
    tag: 'Founder & Director'
  },
  {
    id: 'gal-team-2',
    title: 'SK Relax Faculty & Styling Specialists',
    category: 'team',
    categoryLabel: 'Our Team',
    image: '/images/team/team-celebration-1.jpg',
    alt: 'SK Relax salon team celebrating together in Satara',
    description: 'Our passionate stylists, estheticians, and student mentors dedicated to bespoke beauty care.',
    tag: 'Salon Team'
  },
  {
    id: 'gal-team-3',
    title: 'Academy Team & Student Mentors',
    category: 'team',
    categoryLabel: 'Our Team',
    image: '/images/team/team-group-2.jpg',
    alt: 'SK Relax academy educators and coordinators in Satara',
    description: 'Guiding students through practical dummy training, machine operation, and career growth.',
    tag: 'Faculty'
  },

  // --- EVENTS & BATCHES ---
  {
    id: 'gal-event-1',
    title: 'Academy Certificate Ceremony & Bridal Showcase',
    category: 'events',
    categoryLabel: 'Events & Batches',
    image: '/images/events/bridal-styling-certificate-frame.jpg',
    videoUrl: '/videos/events/bridal-styling-celebration.mp4',
    alt: 'Official SK Relax Beauty Academy certificate presentation by Salma Attar and bridal styling in Satara',
    description: 'Salma Attar presenting official certificates to student graduates alongside traditional bridal artistry styling.',
    tag: 'Certificate Ceremony'
  },
  {
    id: 'gal-event-2',
    title: 'Academy Student Batch Celebration Function',
    category: 'events',
    categoryLabel: 'Events & Batches',
    image: '/images/team/team-celebration-1.jpg',
    videoUrl: '/videos/events/batch-celebration.mp4',
    alt: 'SK Relax Academy student batch completion celebration in Satara',
    description: 'Certificate distribution, student achievements, and joyful batch get-together ceremony.',
    tag: 'Video Highlight'
  },
  {
    id: 'gal-event-3',
    title: 'Live Hair Cutting Seminar Demo',
    category: 'events',
    categoryLabel: 'Events & Batches',
    image: '/images/academy/hair-cutting-masterclass-poster.jpg',
    videoUrl: '/videos/treatments/hair-cutting-seminar.mp4',
    alt: 'Live haircutting seminar and masterclass demo at SK Relax Academy Satara',
    description: 'Promotional seminar demonstration breaking down elevation degrees and modern layered haircuts.',
    tag: 'Seminar Demo'
  }
];
