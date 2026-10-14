import { GalleryItem } from '../types';

export const GALLERY_CATEGORIES = [
  { id: 'all', label: 'All Portfolio' },
  { id: 'hair', label: 'Hair Artistry' },
  { id: 'academy', label: 'Academy & Masterclasses' },
  { id: 'bridal', label: 'Bridal & Makeup' },
  { id: 'skin', label: 'Skin & Facials' },
  { id: 'salon', label: 'Studio Ambience' }
] as const;

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'The Signature Butterfly Haircut',
    category: 'hair',
    categoryLabel: 'Hair Artistry',
    image: '/images/gallery/butterfly-haircut.jpg',
    alt: 'Butterfly Haircut with voluminous layered bounce at SK Relax Salon Satara',
    description: 'Cascading butterfly layers styled with professional outward blowout for maximum volume and texture.',
    tag: 'Signature Cut'
  },
  {
    id: 'gal-2',
    title: 'Hands-on Haircut Training Session',
    category: 'academy',
    categoryLabel: 'Academy & Masterclasses',
    image: '/images/gallery/hands-on-practice.jpg',
    alt: 'Hands-on hair cutting scissor technique with student guidance at SK Relax Academy',
    description: 'Close-up precision sectioning and elevation angle practice during our hair cutting masterclass.',
    tag: 'Hands-on Practice'
  },
  {
    id: 'gal-3',
    title: 'Seamless Long Layer Haircut',
    category: 'hair',
    categoryLabel: 'Hair Artistry',
    image: '/images/gallery/long-layer-haircut.jpg',
    alt: 'Long layer haircut with natural flow and soft edges',
    description: 'Precision long layered cut retaining full length while offering fluid motion and weight relief.',
    tag: 'Trending'
  },
  {
    id: 'gal-4',
    title: 'Official 3-Day Hair Cutting Masterclass',
    category: 'academy',
    categoryLabel: 'Academy & Masterclasses',
    image: '/images/academy/hair-cutting-masterclass-poster.jpg',
    alt: 'SK Relax Beauty Academy 3-Day Hair Cutting Masterclass promotional poster Satara',
    description: 'Comprehensive curriculum poster featuring 12 practical inclusions, dummy head practice, and certification.',
    tag: 'Masterclass Poster'
  },
  {
    id: 'gal-5',
    title: 'Face Framing Layers & Curtain Bangs',
    category: 'hair',
    categoryLabel: 'Hair Artistry',
    image: '/images/gallery/face-framing.jpg',
    alt: 'Face framing layered styling accentuating jawline and cheekbones',
    description: 'Angled perimeter slicing creating tailored movement around the client’s facial features.',
    tag: 'Face Framing'
  },
  {
    id: 'gal-6',
    title: 'Curtain Bangs Precision Cut',
    category: 'hair',
    categoryLabel: 'Hair Artistry',
    image: '/images/gallery/curtain-bangs.jpg',
    alt: 'Curtain bangs styled with soft center part and blow-dry bevel',
    description: 'Center-parted featherweight bangs tailored for seamless blending with side hair lengths.',
    tag: 'Curtain Bangs'
  },
  {
    id: 'gal-7',
    title: 'Feather Cut Texture',
    category: 'hair',
    categoryLabel: 'Hair Artistry',
    image: '/images/gallery/feather-haircut.jpg',
    alt: 'Classic feather cut with lightweight tapered ends',
    description: 'Delicate feathered graduation designed for airy styling and everyday effortless wear.',
    tag: 'Feather Cut'
  },
  {
    id: 'gal-8',
    title: 'Bridal Makeover & Couture Hair Artistry',
    category: 'bridal',
    categoryLabel: 'Bridal & Makeup',
    image: '/images/gallery/bridal-glam.jpg',
    alt: 'Radiant bride with elegant hair styling and traditional jewelry',
    description: 'Exquisite bridal look curated for longevity, camera clarity, and timeless matrimonial grace.',
    tag: 'Bridal Couture'
  },
  {
    id: 'gal-9',
    title: 'Dimensional Hair Transformation & Gloss',
    category: 'hair',
    categoryLabel: 'Hair Artistry',
    image: '/images/gallery/hair-transformation.jpg',
    alt: 'Multi-dimensional hair colour and blow-dry styling',
    description: 'Rich gloss application paired with signature layered graduation and bouncy curls.',
    tag: 'Hair Transformation'
  },
  {
    id: 'gal-10',
    title: 'Hydra Glow & Skin Rejuvenation',
    category: 'skin',
    categoryLabel: 'Skin & Facials',
    image: '/images/gallery/facial-glow.jpg',
    alt: 'Client enjoying relaxing facial treatment and skin hydration ritual',
    description: 'Botanical hydration and gentle pore-cleansing session designed to impart natural radiance.',
    tag: 'Skin Glow'
  },
  {
    id: 'gal-11',
    title: 'Mannequin Dummy Practice Lab',
    category: 'academy',
    categoryLabel: 'Academy & Masterclasses',
    image: '/images/academy/dummy-practice.jpg',
    alt: 'Student practicing hair cuts on training mannequin dummy provided by SK Relax Academy',
    description: 'Dedicated dummy workstation where students practice elevation angles repeatedly before client models.',
    tag: 'Dummy Provided'
  },
  {
    id: 'gal-12',
    title: 'Studio Interior & Client Lounge',
    category: 'salon',
    categoryLabel: 'Studio Ambience',
    image: '/images/gallery/salon-interior.jpg',
    alt: 'Modern, serene salon studio interior in Satara',
    description: 'Calm, private aesthetic environment created to provide an unhurried, luxury styling experience.',
    tag: 'Satara Studio'
  }
];
