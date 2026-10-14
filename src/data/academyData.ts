import { AcademyCourse } from '../types';

export const ACADEMY_HIGHLIGHTS = [
  {
    title: "Hands-on Practical Focus",
    description: "Every student trains with real tools and mannequin dummy heads provided directly by the academy.",
    icon: "Sparkles"
  },
  {
    title: "Step-by-Step Degree & Angles",
    description: "Master the exact geometric degrees (0°, 45°, 90°, 180°) that create modern viral hairstyles.",
    icon: "GraduationCap"
  },
  {
    title: "Small Intensive Batches",
    description: "Limited seats per batch ensure dedicated 1-on-1 attention, technique correction, and personalized mentoring.",
    icon: "Users"
  },
  {
    title: "Commercial Salon Confidence",
    description: "Learn client consultation, face shape assessment, sectioning speed, and modern blowout finishing.",
    icon: "Award"
  }
];

export const COURSES: AcademyCourse[] = [
  {
    id: 'hair-cutting-masterclass',
    title: '3 Days Hair Cutting Masterclass',
    slug: 'hair-cutting-masterclass',
    subtitle: 'Learn · Practice · Master',
    duration: '3 Intensive Days',
    fee: '₹4,000',
    nextBatch: 'Upcoming Batch Open (Reference: 23, 24, 25 October)',
    isEnrollmentOpen: true,
    image: '/images/academy/hands-on-practice.jpg',
    posterImage: '/images/academy/hair-cutting-masterclass-poster.jpg',
    targetAudience: 'Aspiring hairstylists, salon owners, beauty academy students, and experienced stylists seeking to update their skills with modern trending cuts.',
    certification: 'Certified Certificate of Completion by SK Relax Beauty Academy, Satara',
    highlights: [
      'Hands-on learning with expert step-by-step guidance',
      'Training dummy head provided for all attendees',
      'Complete tool handling, ergonomics & scissor control',
      'Modern blowout and finishing techniques included',
      'Limited seats to guarantee individual technique correction'
    ],
    includes: [
      'Hair Degree Theory & Angle Geometry',
      'Precision Hair Sectioning',
      'Professional Hair Tools & Shears Handling',
      'Butterfly Haircut Step-by-Step',
      'Long Layer Haircut Construction',
      'Feather Haircut & Soft Tapering',
      'Customised Individual Haircuts',
      'Signature Salon Haircuts',
      'Curtain Bangs Cutting & Blending',
      'Face Framing Layers',
      'Blow Dry With New Techniques',
      'Dummy Will Be Provided'
    ],
    syllabus: [
      {
        title: 'Day 1: Fundamentals, Angles & Sectioning',
        topics: [
          'Hair structure analysis and elevation degree theory (0°, 45°, 90°, 180°)',
          'Ergonomic scissor holding, texturizing shears, and sectioning clips',
          'Clean sectioning patterns: radial, horizontal, diagonal back, and horseshoe',
          'First guided haircut execution on academy mannequin dummy'
        ]
      },
      {
        title: 'Day 2: Trending Signature Haircuts',
        topics: [
          'The Viral Butterfly Cut: Crown short layers + sweeping length balance',
          'Classic Long Layers with fluid weight distribution',
          'Soft Feathered haircut technique and edge softening',
          'Live feedback and 1-on-1 hand position corrections'
        ]
      },
      {
        title: 'Day 3: Face Framing, Bangs & Commercial Blow-Dry',
        topics: [
          'Curtain bangs tailored to forehead proportions and eye lines',
          'Dynamic face framing layers to accentuate jawlines and cheekbones',
          'Advanced round brush blow-drying, inward bevels, and bouncy outward waves',
          'Client consultation protocol, photo styling, and certificate presentation'
        ]
      }
    ]
  },
  {
    id: 'bridal-makeup-hair-artistry',
    title: 'Professional Bridal Artistry & Hair Couture',
    slug: 'bridal-makeup-artistry',
    subtitle: 'Artistry · Tradition · Modern Glamour',
    duration: '15 Days Diploma',
    fee: 'Available on Enquiry',
    nextBatch: 'Enquire for Upcoming Schedule',
    isEnrollmentOpen: true,
    image: '/images/services/bridal-beauty.jpg',
    targetAudience: 'Artists looking to launch a high-earning bridal beauty career across Maharashtra and beyond.',
    certification: 'Master Bridal Artist Diploma by SK Relax Academy',
    highlights: [
      'HD base matching for varied Indian skin tones & undertones',
      'Waterproof sweat-resistant bridal complexion techniques',
      'Traditional & contemporary Maharashtrian bridal styling',
      'Advanced dupatta draping and jewelry placement',
      'Portfolio photography guidance for Instagram marketing'
    ],
    includes: [
      'Skin Prep & Color Correction',
      'HD Foundation Application',
      'Airbrush Base Demo',
      'Smokey & Cut Crease Eye Techniques',
      'Bridal Bun & Floral Hair Couture',
      'Dupatta Draping Perfection'
    ],
    syllabus: [
      {
        title: 'Module 1: Complexion Masterclass',
        topics: ['Skin undertone color theory', 'Flawless corrective concealing', 'Long-stay foundation baking']
      },
      {
        title: 'Module 2: Eye Artistry & Lashes',
        topics: ['Cut crease bridal glam', 'Soft shimmer reception eyes', 'False lash application & brow architecture']
      },
      {
        title: 'Module 3: Hair Couture & Draping',
        topics: ['High volume traditional buns', 'Textured modern bridal braids', 'Nauvari and lehenga draping']
      }
    ]
  },
  {
    id: 'advanced-skin-aesthetics',
    title: 'Clinical Skincare & Facial Aesthetics Certification',
    slug: 'skincare-aesthetics',
    subtitle: 'Diagnosis · Treatment · Glow',
    duration: '7 Days Masterclass',
    fee: 'Available on Enquiry',
    nextBatch: 'Enquire for Upcoming Schedule',
    isEnrollmentOpen: true,
    image: '/images/gallery/facial-glow.jpg',
    targetAudience: 'Beauticians and skin therapists wishing to elevate facial results with modern clinical protocols.',
    certification: 'Aesthetic Skin Specialist Certificate by SK Relax Academy',
    highlights: [
      'In-depth dermal skin typing & consultation checklist',
      'Hydra-cleansing protocol and machine operation hygiene',
      'Botanical peeling and antioxidant treatment recipes',
      'Acupressure facial massage and lymphatic stimulation'
    ],
    includes: [
      'Skin Anatomy & Typing',
      'Hygiene & Sterilization Standards',
      'Hydra Facial Step Protocols',
      'Blackhead & Impurity Extraction',
      'Post-Treatment Soothing Care'
    ],
    syllabus: [
      {
        title: 'Theory & Diagnosis',
        topics: ['Dermis analysis', 'Acne & pigmentation triggers', 'Sanitization protocols']
      },
      {
        title: 'Practical Treatment Protocols',
        topics: ['Step-by-step facial sequence', 'Steam & extraction safety', 'Glow mask formulations']
      }
    ]
  }
];
