import { ServiceItem } from '../types';

export const SERVICE_CATEGORIES = [
  { id: 'all', label: 'All Services' },
  { id: 'hair', label: 'Haircuts & Styling' },
  { id: 'hair-care', label: 'Colour & Treatments' },
  { id: 'skin', label: 'Skin & Facials' },
  { id: 'makeup', label: 'Makeup & Occasions' },
  { id: 'bridal', label: 'Bridal Artistry' },
  { id: 'grooming', label: 'Grooming & Spa' },
] as const;

export const SERVICES: ServiceItem[] = [
  // --- HAIRCUTS & STYLING (Inspired by Masterclass & Salon Poster) ---
  {
    id: 'butterfly-haircut',
    title: 'Butterfly Haircut & Dynamic Layers',
    category: 'hair',
    categoryLabel: 'Haircuts & Styling',
    shortDescription: 'Voluminous cascading butterfly layers designed to add dramatic body and movement.',
    description: 'A signature dimensional cut featuring short feather-soft layers around the crown and face paired with sweeping longer lengths. Creates the illusion of shorter hair while preserving overall length.',
    image: '/images/services/butterfly-haircut.jpg',
    features: ['Face-flattering crown layers', 'Dynamic volume & bounce', 'Professional blow-dry finish', 'Personalized sectioning'],
    isSignature: true,
    badge: 'Masterclass Special',
    confirmed: true
  },
  {
    id: 'long-layer-haircut',
    title: 'Long Layer Haircut & Flowing Texture',
    category: 'hair',
    categoryLabel: 'Haircuts & Styling',
    shortDescription: 'Seamless long graduation tailored to enhance hair weight, softness, and natural wave.',
    description: 'Fluid, multi-tiered layers cut at precise degrees to remove unwanted bulk, distribute texture gracefully, and frame your silhouette effortlessly.',
    image: '/images/services/long-layer-haircut.jpg',
    features: ['Seamless internal graduation', 'Retains maximum length', 'Effortless everyday styling', 'Heat-styling guidance'],
    isSignature: true,
    badge: 'Client Favourite',
    confirmed: true
  },
  {
    id: 'feather-haircut',
    title: 'Classic Feather Haircut',
    category: 'hair',
    categoryLabel: 'Haircuts & Styling',
    shortDescription: 'Lightweight feathered edges and tapered tips that frame the face with subtle grace.',
    description: 'A timeless layered haircut characterized by finely tapered tips resembling soft feathers. Perfect for fine to medium hair seeking airy lightness and motion.',
    image: '/images/services/feather-haircut.jpg',
    features: ['Feathered ends & texture', 'Airy lightweight feel', 'Natural face framing', 'Styling consultation'],
    isSignature: false,
    confirmed: true
  },
  {
    id: 'curtain-bangs-face-framing',
    title: 'Curtain Bangs & Face Framing',
    category: 'hair',
    categoryLabel: 'Haircuts & Styling',
    shortDescription: 'Custom parted curtain fringe and contouring layers tailored to your facial structure.',
    description: 'Precision cut bangs parted in the center to highlight cheekbones and jawlines. Can be customized for soft romantic sweeps or crisp editorial framing.',
    image: '/images/services/curtain-bangs.jpg',
    features: ['Cheekbone & jaw contouring', 'Versatile center or side parting', 'Low maintenance grow-out', 'Quick styling guide'],
    isSignature: true,
    badge: 'Signature',
    confirmed: true
  },
  {
    id: 'face-framing-custom-cut',
    title: 'Customised Face Framing Cut',
    category: 'hair',
    categoryLabel: 'Haircuts & Styling',
    shortDescription: 'Bespoke angled cutting designed around your unique features and lifestyle.',
    description: 'An individualized cutting service that analyzes hair texture, density, cowlicks, and bone structure to create a bespoke haircut uniquely yours.',
    image: '/images/services/face-framing.jpg',
    features: ['In-depth style consultation', 'Precision slide cutting', 'Styling & care tutorial', 'Custom blow dry'],
    isSignature: false,
    confirmed: true
  },

  // --- HAIR TREATMENTS & COLOUR ---
  {
    id: 'hair-spa-keratin-treatment',
    title: 'Keratin Smoothing & Deep Nourishing Spa',
    category: 'hair-care',
    categoryLabel: 'Colour & Treatments',
    shortDescription: 'Restorative smoothing treatments infused with protein and moisture for silky frizz-free hair.',
    description: 'Intense reparative conditioning that revitalizes damaged hair fibers, seals porous cuticles, and imparts long-lasting mirror-like shine and softness.',
    image: '/images/services/hair-color-treatment.jpg',
    features: ['Intense frizz reduction', 'Restores cuticle integrity', 'Long-lasting silky feel', 'Deep scalp massage'],
    confirmed: false
  },
  {
    id: 'hair-color-balayage',
    title: 'Global Hair Colour & Dimensional Highlights',
    category: 'hair-care',
    categoryLabel: 'Colour & Treatments',
    shortDescription: 'Custom shade formulations, sun-kissed balayage, and rich root-to-tip tones.',
    description: 'From rich espresso and warm chocolate browns to golden honey balayage and ash tones, blended seamlessly to complement your complexion.',
    image: '/images/services/hair-styling-curls.jpg',
    features: ['Skin-tone matched shades', 'Ammonia-free options available', 'High-gloss glossing wash', 'Post-colour care advice'],
    confirmed: false
  },

  // --- SKIN CARE & FACIALS ---
  {
    id: 'skin-brightening-facial',
    title: 'Luminous Glow & Skin Brightening Facial',
    category: 'skin',
    categoryLabel: 'Skin & Facials',
    shortDescription: 'Deep pore cleansing, exfoliation, gentle extraction, and antioxidant hydration.',
    description: 'Targeted skin treatment designed to awaken dull skin, promote cellular renewal, and restore a dewy, youthful radiance through curated botanical formulas.',
    image: '/images/services/skincare-facial.jpg',
    features: ['Gentle ultrasonic cleansing', 'Nutrient-rich face mask', 'Relaxing pressure point massage', 'Immediate visible glow'],
    confirmed: false
  },
  {
    id: 'hydra-infusion-facial',
    title: 'Deep Hydration & Anti-Stress Skin Therapy',
    category: 'skin',
    categoryLabel: 'Skin & Facials',
    shortDescription: 'Intensive moisture replenishment specifically suited for stressed, tired skin.',
    description: 'A multi-step restorative ritual that quenches dehydrated skin layers, calms redness, and locks in sustained hydration for a plump, silky skin texture.',
    image: '/images/gallery/facial-glow.jpg',
    features: ['Hyaluronic hydration surge', 'Cooling stone drainage', 'Pore refining serum', 'Custom skin analysis'],
    confirmed: false
  },

  // --- MAKEUP & OCCASIONS ---
  {
    id: 'occasion-glam-makeup',
    title: 'Party & Celebration Occasion Makeup',
    category: 'makeup',
    categoryLabel: 'Makeup & Occasions',
    shortDescription: 'Flawless complexion matching, defined eye artistry, and lasting event wear.',
    description: 'Sophisticated event styling tailored for sangeets, receptions, graduations, and intimate celebrations with high-definition, flash-photography friendly finish.',
    image: '/images/services/makeup-styling.jpg',
    features: ['Custom skin prep & primer', 'High-definition coverage', 'Precision eye contouring', 'Long-wear setting mist'],
    confirmed: false
  },

  // --- BRIDAL ARTISTRY ---
  {
    id: 'bridal-complete-package',
    title: 'Signature Bridal Makeover & Hair Styling',
    category: 'bridal',
    categoryLabel: 'Bridal Artistry',
    shortDescription: 'Comprehensive bridal beauty with bespoke saree/dupatta draping and bridal hair couture.',
    description: 'A royal bridal experience tailored to the modern bride. Includes personalized pre-wedding skin consultation, flawless long-stay makeup, exquisite hair artistry, and professional draping.',
    image: '/images/services/bridal-beauty.jpg',
    features: ['Pre-wedding bridal trial consultation', 'Waterproof & sweat-resistant base', 'Intricate bridal hair design', 'Dupatta & jewelry setting'],
    isSignature: true,
    badge: 'Bridal Signature',
    confirmed: false
  },

  // --- GROOMING & SPA ---
  {
    id: 'deluxe-grooming-care',
    title: 'Essential Beauty Grooming & Waxing Care',
    category: 'grooming',
    categoryLabel: 'Grooming & Spa',
    shortDescription: 'Hygienic threading, gentle skin-friendly waxing, and brow architecture.',
    description: 'Precision brow sculpting, gentle lip threading, and soothing full-body waxing rituals carried out with medical-grade hygiene and calming aftercare oils.',
    image: '/images/services/grooming-care.jpg',
    features: ['Strict single-use hygiene', 'Skin-calming post lotions', 'Expert brow shaping', 'Quick & painless technique'],
    confirmed: false
  }
];
