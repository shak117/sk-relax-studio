import { AcademyCourse } from '../types';

export const ACADEMY_PROMO = {
  headline: "ANY CLASS OR ANY WORKSHOP",
  discountBadge: "20% DISCOUNT",
  subtext: "Enroll now in any professional beauty course or practical workshop to avail our limited seasonal 20% tuition discount.",
  isoNote: "ISO certified academy training with hands-on live demo and dummy practice.",
  director: "Salma Attar",
  directorTitle: "Founder & Master Beauty Educator",
  phone: "+91 8459890270",
  whatsappNumber: "918459890270"
};

export const ACADEMY_HIGHLIGHTS = [
  {
    title: "Hands-on Practical Training",
    description: "Every student trains with live demos and personal mannequin dummy heads provided directly by the academy in Satara.",
    icon: "Sparkles"
  },
  {
    title: "ISO Certified Academy Curriculum",
    description: "Structured industry-level syllabus covering science, safety, hygiene, modern aesthetics, and real salon client protocols.",
    icon: "Award"
  },
  {
    title: "Small Intensive Batches",
    description: "Limited student intake ensures dedicated 1-on-1 hand positioning corrections, technique coaching, and personal mentoring.",
    icon: "Users"
  },
  {
    title: "Commercial Salon & Business Skills",
    description: "Includes salon marketing guidance, client consultation etiquette, pricing structure, and portfolio creation.",
    icon: "GraduationCap"
  }
];

export const COURSES: AcademyCourse[] = [
  // --- FLAGSHIP 1: ADVANCED HAIR CUTTING (From Poster) ---
  {
    id: 'advance-hair-cutting',
    title: 'Advanced Hair Cutting Masterclass',
    slug: 'advance-hair-cutting',
    subtitle: 'Learn · Practice · Master',
    duration: '3 to 5 Intensive Days',
    fee: '₹4,000 (Subject to 20% Promotional Discount)',
    nextBatch: 'Upcoming Batch Open — Enquire via WhatsApp',
    isEnrollmentOpen: true,
    image: '/images/academy/hands-on-practice.jpg',
    posterImage: '/images/academy/hair-cutting-masterclass-poster.jpg',
    videoUrl: '/videos/treatments/hair-cutting-seminar.mp4',
    brochureImage: '/images/brochures/academy-classes-poster.jpg',
    targetAudience: 'Aspiring hairstylists, salon owners, beauty academy students, and experienced stylists updating their skills with modern trending cuts.',
    certification: 'Certified Certificate of Completion by SK Relax Beauty Academy, Satara (ISO Standards)',
    highlights: [
      'Personal training dummy head provided for all attendees',
      'Step-by-step angle & degree geometry (0°, 45°, 90°, 180°)',
      'Viral Butterfly haircut, Long Layer, and Feather cuts',
      'Curtain bangs, Face Framing, and commercial blowout techniques',
      'Live cutting demo with hands-on practice'
    ],
    includes: [
      'Hair Degree Theory & Angle Geometry',
      'Precision Hair Sectioning Patterns',
      'Professional Shear & Tool Handling',
      'Butterfly Haircut Step-by-Step',
      'Long Layer Haircut Construction',
      'Feather Haircut & Soft Tapering',
      'Curtain Bangs Cutting & Blending',
      'Face Framing Layers',
      'Commercial Blow Dry Techniques',
      'Mannequin Dummy Head Provided'
    ],
    syllabus: [
      {
        title: 'Day 1: Elevation Degrees, Geometry & Sectioning',
        topics: [
          'Hair structure analysis and elevation degree theory (0°, 45°, 90°, 180°)',
          'Ergonomic scissor holding, texturizing shears, and sectioning clips',
          'Clean sectioning patterns: radial, horizontal, diagonal back, and horseshoe',
          'First guided haircut execution on academy mannequin dummy'
        ]
      },
      {
        title: 'Day 2: Viral Layered Haircuts (Butterfly, Long Layer, Feather)',
        topics: [
          'The Viral Butterfly Cut: Crown short layers + sweeping length balance',
          'Classic Long Layers with fluid weight distribution and motion',
          'Soft Feathered haircut technique and edge tapering',
          '1-on-1 hand position and blade angle corrections'
        ]
      },
      {
        title: 'Day 3: Face Framing, Bangs & Commercial Blow-Dry',
        topics: [
          'Curtain bangs tailored to forehead proportions and eye lines',
          'Dynamic face framing layers to accentuate jawlines and cheekbones',
          'Advanced round brush blow-drying, inward bevels, and outward bounce',
          'Client consultation protocol, photo styling, and certificate presentation'
        ]
      }
    ]
  },

  // --- FLAGSHIP 2: PROFESSIONAL MAKEUP CLASS (From Brochure Photo 2) ---
  {
    id: 'makeup-class',
    title: 'Professional Makeup & Bridal Artistry Class',
    slug: 'makeup-class',
    subtitle: 'Bridal · HD 3D · Saree Draping · Styling',
    duration: '15 to 30 Days Master Diploma',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'New Batch Every Month — Seats Limited',
    isEnrollmentOpen: true,
    image: '/images/services/bridal-beauty.jpg',
    brochureImage: '/images/brochures/makeup-syllabus.jpg',
    targetAudience: 'Beginners to intermediate makeup artists, bridal stylists, and beauty entrepreneurs aiming to establish high-earning wedding businesses.',
    certification: 'Professional Bridal & HD Makeup Diploma by SK Relax Beauty Academy, Satara',
    highlights: [
      'Comprehensive product knowledge & vanity curation',
      'Royal bridal makeup & pre-wedding consultations',
      '5 distinct styles of traditional and modern saree draping',
      '3 core commercial bridal hairstyles',
      'HD 3D camera-ready & flash-proof techniques',
      'Waterproof & sweat-proof formulation secrets',
      'Mature skin & problematic acne skin corrective makeup',
      'Dedicated marketing & client booking business session'
    ],
    includes: [
      'Product & Vanity Knowledge',
      'Bridal Makeup Artistry',
      '5 Different Types of Saree Draping',
      '3 Different Types of Hairstyles',
      'HD 3D Makeup Formulation',
      'Waterproof Makeup Secrets',
      'Sweat-Proof Makeup Techniques',
      'Mature Skin Makeup',
      'Problematic Skin Makeup Correction',
      'Marketing & Client Acquisition Session'
    ],
    syllabus: [
      {
        title: 'Module 1: Skin Science, Color Wheel & Base Perfection',
        topics: [
          'Skin undertone analysis: Cool, Warm, Neutral, and Olive',
          'Color wheel theory: Green, orange, and peach color correction',
          'Primer chemistry, pore filling, and oil-control barriers',
          'HD 3D foundation application with seamless blending'
        ]
      },
      {
        title: 'Module 2: Bridal Couture & Specialized Formulations',
        topics: [
          'Traditional and contemporary bridal makeover looks',
          'Waterproof & sweat-resistant formulations for humid weather',
          'Soft-focus mature skin makeup avoiding crease lines',
          'Problematic skin coverage: concealing acne, scars, and dark circles'
        ]
      },
      {
        title: 'Module 3: Saree Draping, Hairstyling & Business Marketing',
        topics: [
          '5 Saree Draping techniques: Nauvari, Bengali, Gujarati, Mermaid, Nivi',
          '3 Classic bridal hairstyles: Romantic textured bun, waves, floral braid',
          'Dupatta setting, jewelry placement, and bindi symmetry',
          'Business session: Social media marketing, pricing, and client contracts'
        ]
      }
    ]
  },

  // --- FLAGSHIP 3: PERMANENT MAKEUP (PMU) & MICROBLADING (From Brochure Photo 3) ---
  {
    id: 'permanent-makeup-pmu',
    title: 'Permanent Makeup (PMU) & Microblading Class',
    slug: 'permanent-makeup-pmu',
    subtitle: 'Microblading · Powder Brows · Lip Blush · SMP',
    duration: '7 to 10 Days Intensive Certification',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'Limited to 4 Students per Batch — Enquire Now',
    isEnrollmentOpen: true,
    image: '/images/gallery/pmu-eyebrow-result.jpg',
    brochureImage: '/images/gallery/pmu-eyebrow-result.jpg',
    targetAudience: 'Cosmetologists, PMU aspirants, salon owners, and tattoo artists looking to offer lucrative semi-permanent aesthetic services.',
    certification: 'Certified Permanent Makeup (PMU) Specialist Certificate by SK Relax Beauty Academy',
    highlights: [
      'In-depth PMU machine and blade product knowledge',
      'Natural hair-stroke eyebrow microblading',
      'Ombré powder brows & combination 3D brows',
      'Lip blush pigment implantation & dark lip neutralization',
      'Golden ratio caliper mapping and skin numbing protocols',
      'Scalp micropigmentation (SMP) hair follicle replication',
      'Sanitation, bloodborne pathogen awareness & aftercare'
    ],
    includes: [
      'PMU Product & Needle Knowledge',
      'Microblading Hand-Tool Technique',
      'Powder Brows Digital Technique',
      'Combination Brows Hybrid Artistry',
      'Lip Blush Procedure',
      'Lip Neutralization for Dark Lips',
      'Mapping & Topical Numbing Techniques',
      'Scalp Micropigmentation (SMP)'
    ],
    syllabus: [
      {
        title: 'Module 1: Brow Architecture, Needles & Safety',
        topics: [
          'Sterilization, disposable cartridges, and cross-contamination protocols',
          'Golden-ratio facial calipers and string mapping symmetry',
          'Microblading stroke patterns, depth control in the upper dermis',
          'Latex skin practice: spine 3, spine 5, and natural brow transitions'
        ]
      },
      {
        title: 'Module 2: Machine Brows & Lip Artistry',
        topics: [
          'Digital machine shading for pixelated Ombré Powder Brows',
          'Combination brows: Blending manual blading with digital shading',
          'Lip blush contouring, vermilion border preservation, and needle angles',
          'Lip neutralization color theory: Warm modifiers for dark lips'
        ]
      },
      {
        title: 'Module 3: SMP, Topical Comfort & Client Care',
        topics: [
          'Scalp micropigmentation (SMP) dot impression for hair thinning',
          'Primary and secondary topical numbing procedures',
          'Healing stages, touch-up sessions, and aftercare ointments',
          'Client consent forms, contraindications, and live demo practice'
        ]
      }
    ]
  },

  // --- FLAGSHIP 4: ALL MACHINE KNOWLEDGE & AESTHETICS (From Brochure Photo 4) ---
  {
    id: 'machine-and-product-knowledge',
    title: 'All Machine Knowledge & Aesthetic Equipment Class',
    slug: 'machine-and-product-knowledge',
    subtitle: '7/10/11-in-1 Station · Derma Pen · OxyGeneo · LED',
    duration: '5 to 7 Days Hands-On Machine Training',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'Weekend & Weekday Batches Open',
    isEnrollmentOpen: true,
    image: '/images/machines/hydra-facial-machine.jpg',
    brochureImage: '/images/brochures/machine-knowledge-syllabus.jpg',
    videoUrl: '/videos/treatments/hydra-facial.mp4',
    targetAudience: 'Skin therapists, cosmetologists, beauty parlour owners, and students wanting mastery over modern clinical aesthetic machinery.',
    certification: 'Aesthetic Equipment & Clinical Machine Specialist Certificate',
    highlights: [
      'Full training on 7/10/11-in-one multifunction clinical machine',
      'Hands-on operation of Derma Roller & Derma Pen microneedling',
      'Crystal ball & Gua Sha cooling drainage techniques',
      'OxyGeneo 3-in-1 super facial technology and the Bohr effect',
      'Crystal & diamond microdermabrasion maintenance & vacuum control',
      'Omega 7-color LED phototherapy and wavelength selection',
      'High-frequency ozone wand sterilization & mole removal pen safety'
    ],
    includes: [
      '7/10/11-in-One Machine Operation',
      'Derma Roller Manual Technique',
      'Derma Pen Motorized Technique',
      'Crystal Ball Cryotherapy',
      'Gua Sha Facial Contouring',
      'OxyGeneo Super Facial Tech',
      'Crystal Microdermabrasion',
      'Diamond Microdermabrasion',
      'Omega LED Light Phototherapy',
      'High-Frequency Electotherapy',
      'Mole Remover Plasma Pen Tech'
    ],
    syllabus: [
      {
        title: 'Module 1: Multifunction Machine, Vacuum & Microdermabrasion',
        topics: [
          'Anatomy of 7/10/11-in-one console: vacuum pressure, waste bottles, filters',
          'Hydra vortex tip selection, acid solutions, and ultrasonic infusion handle',
          'Crystal and diamond abrasion grit levels, speed, and safety zones',
          'Equipment sanitization, ultrasonic cleaner maintenance, and safety circuits'
        ]
      },
      {
        title: 'Module 2: Microneedling & Skin Stimulation Technology',
        topics: [
          'Derma roller titanium needles vs electric automated Derma Pen cartridges',
          'Depth calibration: 0.25mm for absorption up to 1.5mm for scar revision',
          'OxyGeneo Bohr effect internal oxygenation and specialized pod formulations',
          'Crystal ball cryo massage and Gua Sha lymphatic drainage flow'
        ]
      },
      {
        title: 'Module 3: Light, Current & Electro-Plasma Devices',
        topics: [
          'Omega LED dome: Red 630nm, Blue 415nm, Green 525nm treatment timers',
          'High-frequency glass electrodes: Neon (orange) vs Argon (violet) ozone',
          'Mole and skin tag plasma pen: Surface carbonization, hygiene, and healing',
          'Client skin typing, treatment contraindications, and hands-on practice'
        ]
      }
    ]
  },

  // --- FLAGSHIP 5: SKIN TREATMENT & FACIALS (From Brochure Photo 5) ---
  {
    id: 'skin-treatment-class',
    title: 'Skin Treatment & Advanced Facial Class',
    slug: 'skin-treatment-class',
    subtitle: 'Hydra · Korean Glass · BB Glow · Polishing',
    duration: '10 to 15 Days Clinical Skin Course',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'Monthly Enrollment Available',
    isEnrollmentOpen: true,
    image: '/images/treatments/facial-treatment-frame.jpg',
    brochureImage: '/images/brochures/facial-treatments-syllabus.jpg',
    videoUrl: '/videos/treatments/facial-treatment.mp4',
    targetAudience: 'Estheticians and beauty therapists seeking deep expertise in clinical facials, skin barrier restoration, and modern Korean skin therapies.',
    certification: 'Advanced Skin Esthetician Certificate by SK Relax Beauty Academy',
    highlights: [
      'Hydra facial multi-step vortex extraction & infusion',
      'Korean glass skin multi-ampoule layering technique',
      'BB Glow / CC Glow nano-pigment semi-permanent radiant finish',
      'Bollywood luxury glow facial with lymphatic drainage',
      'Medi-facial formulation with AHA/BHA chemical peels',
      'Crystal & diamond polishing resurfacing techniques',
      'Comprehensive face mask science: Hydrojelly, alginate, collagen sheet',
      'Collagen thread firming technology breakdown'
    ],
    includes: [
      'Hydra Facial Step-by-Step',
      'Korean Glass Facial Method',
      'BB Glow / CC Glow Nano Infusion',
      'Bollywood Radiance Facial',
      'Medi-Facial for Acne & Congestion',
      'Crystal & Diamond Polishing',
      'All Types of Mask Knowledge',
      'Collagen Thread Technique'
    ],
    syllabus: [
      {
        title: 'Module 1: Facial Anatomy & Deep Pore Cleansing',
        topics: [
          'Skin layer histology, sebum regulation, and cellular turnover cycles',
          'Hydra vortex vacuum extraction: AHA, BHA, and peptide solution balance',
          'Pore extraction tools, ultrasonic skin spatula, and sterile hygiene',
          'Medi-facial protocols for active acne, blackheads, and milia'
        ]
      },
      {
        title: 'Module 2: Advanced Korean & Glow Treatments',
        topics: [
          'Korean glass skin 7-skin method, essence damping, and ampoule layering',
          'BB Glow / CC Glow nano-needle pigment infusion for luminous even tone',
          'Bollywood red carpet facial: Lymphatic contouring and gold collagen wrap',
          'Crystal and diamond polishing for sun damage and dull complexions'
        ]
      },
      {
        title: 'Module 3: Masks, Collagen Threads & Skin Homecare',
        topics: [
          'Mastering hydrojelly, alginate rubber, enzyme clay, and thermal masks',
          'Collagen thread technique: Dissolvable silk proteins and peptide absorption',
          'Post-treatment sunscreen protocols and client homecare roadmaps',
          'Hands-on live client practice and assessment'
        ]
      }
    ]
  },

  // --- COMPREHENSIVE CURRICULUM: ALL 20 BROCHURE CLASSES ---
  {
    id: 'basic-to-super-advanced-beauty-academy',
    title: 'Basic to Super Advanced Beauty Academy Diploma',
    slug: 'basic-to-super-advanced-beauty-academy',
    subtitle: 'Complete All-in-One Professional Salon Career Track',
    duration: '3 to 6 Months Comprehensive Track',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'Admissions Open for New Term',
    isEnrollmentOpen: true,
    image: '/images/academy/academy-director.jpg',
    brochureImage: '/images/brochures/academy-classes-poster.jpg',
    targetAudience: 'Aspiring salon owners and professionals seeking complete mastery from foundational beauty to advanced aesthetics.',
    certification: 'Master Beauty Academy Diploma by SK Relax Beauty Academy, Satara (ISO Standards)',
    highlights: [
      'Covers hair, skin, makeup, machines, chemical treatments & salon management',
      'Full hands-on dummy practice and live client sessions',
      'Mentored directly by founder Salma Attar',
      'Salon setup guidance and vendor equipment contacts'
    ],
    includes: [
      'All Hair Cuts & Chemical Services',
      'All Skin Treatments & Aesthetic Machines',
      'Bridal Makeup & Saree Draping',
      'Permanent Makeup Basics',
      'Salon Business & Hygiene Standards'
    ],
    syllabus: [
      {
        title: 'Foundational Phase: Hair, Skin & Hygiene',
        topics: ['Sterilization, skin typing, hair biology, basic threading, waxing, facials, and basic haircutting']
      },
      {
        title: 'Advanced Phase: Chemical & Aesthetic Treatments',
        topics: ['Keratin, botox, rebonding, hydra facials, peels, machine operation, and color wheel theory']
      },
      {
        title: 'Mastery Phase: Bridal, PMU & Salon Management',
        topics: ['HD bridal makeup, saree draping, microblading basics, marketing, client management, and final evaluation']
      }
    ]
  },
  {
    id: 'skin-aesthetic-class',
    title: 'Skin Aesthetic Class',
    slug: 'skin-aesthetic-class',
    subtitle: 'Clinical Aesthetics & Skin Therapy',
    duration: '10 Days Intensive',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'Enquire for Dates',
    isEnrollmentOpen: true,
    image: '/images/treatments/korean-glass-skin-glow.jpg',
    brochureImage: '/images/brochures/academy-classes-poster.jpg',
    targetAudience: 'Beauty therapists looking to elevate services into modern clinical aesthetics.',
    certification: 'Skin Aesthetic Specialist Certificate',
    highlights: ['Clinical skin analysis', 'Cosmeceutical product knowledge', 'Targeted facial therapies'],
    includes: ['Skin Histology', 'Aesthetic Procedures', 'Safety & Contraindications'],
    syllabus: [{ title: 'Curriculum', topics: ['Skin histology, acne classification, pigmentation protocols, and aesthetic care'] }]
  },
  {
    id: 'chemical-peel-class',
    title: 'Chemical Peel Class',
    slug: 'chemical-peel-class',
    subtitle: 'AHA, BHA & Fruit Acid Peels',
    duration: '3 to 5 Days',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'Enquire for Dates',
    isEnrollmentOpen: true,
    image: '/images/treatments/skin-polishing-glow.jpg',
    brochureImage: '/images/brochures/academy-classes-poster.jpg',
    targetAudience: 'Skin practitioners wanting safe, certified chemical peel protocols.',
    certification: 'Chemical Peel Certification by SK Relax',
    highlights: ['Glycolic, Salicylic, Lactic & Mandelic peels', 'Neutralization protocols', 'Post-peel soothing'],
    includes: ['Peel Chemistry', 'Application Timing', 'Neutralization Protocols', 'Healing Care'],
    syllabus: [{ title: 'Curriculum', topics: ['Acid percentages, pH thresholds, frost reactions, post-peel barriers, and safety'] }]
  },
  {
    id: 'hairdresser-class',
    title: 'Hair Dresser Class',
    slug: 'hairdresser-class',
    subtitle: 'Foundations of Professional Hair Dressing',
    duration: '15 to 30 Days',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'Enquire for Dates',
    isEnrollmentOpen: true,
    image: '/images/services/long-layer-haircut.jpg',
    brochureImage: '/images/brochures/academy-classes-poster.jpg',
    targetAudience: 'Beginners aiming to master commercial haircutting, blowouts, and client consultation.',
    certification: 'Certified Hair Dresser Diploma',
    highlights: ['Classic cuts & sections', 'Blowout engineering', 'Shampoo & conditioning science'],
    includes: ['Tool Ergonomics', 'Hair Sectioning', 'Classic Cuts', 'Blowout Techniques'],
    syllabus: [{ title: 'Curriculum', topics: ['Straight cut, U-cut, V-cut, blunt cuts, round brush blowouts, and hygiene'] }]
  },
  {
    id: 'hair-chemical-class',
    title: 'Hair Chemical Class',
    slug: 'hair-chemical-class',
    subtitle: 'Rebonding, Straightening & Perming Science',
    duration: '7 to 10 Days',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'Enquire for Dates',
    isEnrollmentOpen: true,
    image: '/images/services/hair-color-treatment.jpg',
    brochureImage: '/images/brochures/academy-classes-poster.jpg',
    targetAudience: 'Stylists wanting in-depth mastery of chemical straightening, rebonding, and perming.',
    certification: 'Hair Chemical Specialist Certificate',
    highlights: ['Disulfide bond mechanics', 'Neutralizer timing', 'Thermal iron flat pass techniques'],
    includes: ['Chemical Bond Theory', 'Rebonding Step-by-Step', 'Smoothing Formulations', 'Damage Prevention'],
    syllabus: [{ title: 'Curriculum', topics: ['Bond breaking and resetting, cream application, processing checks, and heat pressing'] }]
  },
  {
    id: 'hair-colour-colour-wheel',
    title: 'Hair Colour with Colour Wheel Class',
    slug: 'hair-colour-colour-wheel',
    subtitle: 'Color Theory, Balayage & Highlights',
    duration: '7 to 10 Days',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'Enquire for Dates',
    isEnrollmentOpen: true,
    image: '/images/services/hair-styling-curls.jpg',
    brochureImage: '/images/brochures/academy-classes-poster.jpg',
    targetAudience: 'Colorists and stylists seeking precision shade formulation without brassy tones.',
    certification: 'Hair Colourist Specialist Certificate',
    highlights: ['Universal color wheel & neutralizing brass', 'Developer volumes (10, 20, 30, 40)', 'Balayage & foil highlights'],
    includes: ['Color Wheel Physics', 'Bleaching Levels (1-10)', 'Toning Formulations', 'Balayage Foiling'],
    syllabus: [{ title: 'Curriculum', topics: ['Primary/secondary/tertiary colors, underlying pigments, gray coverage, and tone correction'] }]
  },
  {
    id: 'hair-treatment-class',
    title: 'Hair Treatment Class',
    slug: 'hair-treatment-class',
    subtitle: 'Keratin, Botox, Nanoplasty & Spa',
    duration: '5 to 7 Days',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'Enquire for Dates',
    isEnrollmentOpen: true,
    image: '/images/services/hair-styling-curls.jpg',
    brochureImage: '/images/brochures/academy-classes-poster.jpg',
    videoUrl: '/videos/treatments/client-hair-service.mp4',
    targetAudience: 'Stylists seeking mastery in high-ticket restorative salon treatments.',
    certification: 'Hair Treatment Master Certificate',
    highlights: ['Keratin protein smoothing', 'Hair botox fiber filling', 'Nanoplasty organic alignment'],
    includes: ['Product Formulations', 'Application Techniques', 'Iron Temperatures', 'Aftercare Guidance'],
    syllabus: [{ title: 'Curriculum', topics: ['Keratin application, heat sealing temperatures, formaldehyde safety, and post-wash checks'] }]
  },
  {
    id: 'hairstyling-class',
    title: 'Hair Styling & Updo Class',
    slug: 'hairstyling-class',
    subtitle: 'Bridal Buns, Braids & Hollywood Waves',
    duration: '7 Days',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'Enquire for Dates',
    isEnrollmentOpen: true,
    image: '/images/services/curtain-bangs.jpg',
    brochureImage: '/images/brochures/makeup-syllabus.jpg',
    targetAudience: 'Bridal stylists, salon staff, and makeup artists expanding their styling portfolio.',
    certification: 'Hairstyling Couture Certificate',
    highlights: ['Crimping & backcombing volume', 'Textured mess-free bridal buns', 'Floral braid styling'],
    includes: ['Tool Control (Tongs, Crimpers)', 'Padding & Pinning', 'Traditional & Modern Styles'],
    syllabus: [{ title: 'Curriculum', topics: ['Iron curling, wave setting, hair padding placement, bobby pin engineering, and hair spray'] }]
  },
  {
    id: 'saree-draping-class',
    title: 'Saree Draping Class',
    slug: 'saree-draping-class',
    subtitle: 'Mastering Regional & Contemporary Drapes',
    duration: '3 to 5 Days',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'Enquire for Dates',
    isEnrollmentOpen: true,
    image: '/images/gallery/traditional-silk-bridal-couture.jpg',
    brochureImage: '/images/gallery/traditional-silk-bridal-couture.jpg',
    targetAudience: 'Bridal assistants, makeup artists, and individuals seeking professional draping speed.',
    certification: 'Saree Draping Artistry Certificate',
    highlights: ['5 classic draping styles', 'Pleating speed & safety pins', 'Body shape adjustments'],
    includes: ['Nauvari Draping', 'Bengali & Gujarati Styles', 'Mermaid & Indo-Western', 'Pinning Safety'],
    syllabus: [{ title: 'Curriculum', topics: ['Nauvari (Brahmani & Kashta), Nivi pleats, pallu pinning, height proportions, and fabric care'] }]
  },
  {
    id: 'saree-pre-pleating-class',
    title: 'Saree Pre-Pleating & Box Folding Class',
    slug: 'saree-pre-pleating-class',
    subtitle: 'Commercial Pre-Draping in 5 Minutes',
    duration: '2 to 3 Days',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'Enquire for Dates',
    isEnrollmentOpen: true,
    image: '/images/gallery/traditional-silk-bridal-couture.jpg',
    brochureImage: '/images/gallery/traditional-silk-bridal-couture.jpg',
    targetAudience: 'Entrepreneurs offering commercial saree pre-pleating delivery and bridal services.',
    certification: 'Saree Pre-Pleating Professional Certificate',
    highlights: ['Pre-pleating techniques', 'Ironing & steam setting', 'Compact box folding for clients'],
    includes: ['Pleat Measuring', 'Heat Setting', 'Box Folding', '5-Minute Client Wear'],
    syllabus: [{ title: 'Curriculum', topics: ['Pleat measurement calculations, safety folding, travel packaging, and 5-minute wearing method'] }]
  },
  {
    id: 'nath-making-class',
    title: 'Traditional Nath Making Class',
    slug: 'nath-making-class',
    subtitle: 'Bespoke Maharashtrian Jewelry Crafting',
    duration: '2 Days Workshop',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'Enquire for Dates',
    isEnrollmentOpen: true,
    image: '/images/gallery/maharashtrian-bridal-artistry.jpg',
    brochureImage: '/images/gallery/maharashtrian-bridal-artistry.jpg',
    targetAudience: 'Craft enthusiasts, bridal jewelry designers, and creative artists.',
    certification: 'Bespoke Jewelry Craft Certificate',
    highlights: ['Handmade traditional pearls and wirework', 'Bespoke customized bridal naths', 'Tool and wire selection'],
    includes: ['Wire Artistry', 'Pearl & Stone Setting', 'Comfort Nose Clip Fitting'],
    syllabus: [{ title: 'Curriculum', topics: ['Wire gauge selection, pearl looping, traditional motifs, clip crafting, and finishing'] }]
  },
  {
    id: 'mehendi-classes',
    title: 'Professional Mehendi Classes',
    slug: 'mehendi-classes',
    subtitle: 'Arabic, Bridal & Traditional Henna Art',
    duration: '7 to 15 Days',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'Enquire for Dates',
    isEnrollmentOpen: true,
    image: '/images/gallery/traditional-silk-bridal-couture.jpg',
    brochureImage: '/images/gallery/traditional-silk-bridal-couture.jpg',
    targetAudience: 'Aspiring henna artists and bridal beauty professionals.',
    certification: 'Henna Artistry Certificate by SK Relax',
    highlights: ['Natural chemical-free cone making', 'Arabic, Indo-Arabic, and Bridal figures', 'Color darkening tricks'],
    includes: ['Henna Paste Formulation', 'Cone Rolling', 'Motif Construction', 'Bridal Figurines'],
    syllabus: [{ title: 'Curriculum', topics: ['Henna powder straining, essential oils, cone pressure control, lines, leaves, and bridal designs'] }]
  },
  {
    id: 'mole-remover-class',
    title: 'Mole & Skin Tag Remover Class',
    slug: 'mole-remover-class',
    subtitle: 'Cosmetic Spot & Tag Plasma Protocols',
    duration: '2 Days Intensive',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'Enquire for Dates',
    isEnrollmentOpen: true,
    image: '/images/machines/hydra-facial-machine.jpg',
    brochureImage: '/images/machines/hydra-facial-machine.jpg',
    targetAudience: 'Aesthetic professionals training in non-medical cosmetic tag removal.',
    certification: 'Aesthetic Plasma Spot Removal Certificate',
    highlights: ['Sterile hygiene protocols', 'Low-temperature plasma arc device use', 'Post-procedure healing care'],
    includes: ['Skin Tag Identification', 'Plasma Device Settings', 'Topical Numbing', 'Aftercare Ointments'],
    syllabus: [{ title: 'Curriculum', topics: ['Skin tag vs mole safety assessment, local numbing, sterile arc vaporization, and sun barrier'] }]
  },
  {
    id: 'ear-lobing-class',
    title: 'Ear Lobing (Lobe Repair) Class',
    slug: 'ear-lobing-class',
    subtitle: 'Cosmetic Split Ear Lobe Repair Without Surgery',
    duration: '2 Days Workshop',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'Enquire for Dates',
    isEnrollmentOpen: true,
    image: '/images/gallery/salon-interior.jpg',
    brochureImage: '/images/gallery/salon-interior.jpg',
    targetAudience: 'Cosmetologists and beauty specialists learning non-surgical ear lobe repairing methods.',
    certification: 'Ear Lobe Cosmetic Repair Certificate',
    highlights: ['Non-surgical stitching/bonding method', 'Sterile hygiene & antiseptic care', 'Healing timeline and re-piercing rules'],
    includes: ['Tissue Assessment', 'Sterilization', 'Repair Method', 'Aftercare Protocols'],
    syllabus: [{ title: 'Curriculum', topics: ['Elongated and torn ear lobe assessment, antiseptic preparation, sutureless bonding, and follow-up'] }]
  },
  {
    id: 'ear-pressing-class',
    title: 'Ear Pressing & Piercing Class',
    slug: 'ear-pressing-class',
    subtitle: 'Painless Machine Piercing & Acupressure Points',
    duration: '1 to 2 Days Workshop',
    fee: 'Enquire for Fee (20% Discount Applicable)',
    nextBatch: 'Enquire for Dates',
    isEnrollmentOpen: true,
    image: '/images/gallery/salon-interior.jpg',
    brochureImage: '/images/gallery/salon-interior.jpg',
    targetAudience: 'Salon assistants and stylists offering quick, sterile ear piercing.',
    certification: 'Sterile Ear Piercing Specialist Certificate',
    highlights: ['Painless ear piercing gun operation', 'Sterile disposable stud cartridges', 'Piercing placement anatomy'],
    includes: ['Lobe Marking Anatomy', 'Instrument Sterilization', 'Painless Cartridge Pressing', 'Healing Care'],
    syllabus: [{ title: 'Curriculum', topics: ['Lobe symmetry marking, disinfectant prep, painless gun press, hypoallergenic studs, and aftercare'] }]
  }
];
