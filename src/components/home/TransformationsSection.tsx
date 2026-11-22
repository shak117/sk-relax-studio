import React, { useState } from 'react';
import { Sparkles, Calendar, MessageCircle, ArrowRight, CheckCircle2, Sliders } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Button } from '../ui/Button';
import { buildWhatsAppUrl } from '../../data/brandData';
import { trackWhatsAppClick } from '../../services/analytics';
import { 
  LuxuryBotanicalShadow, 
  LuxuryCurvedLines 
} from '../ui/LuxuryBackgroundDecorations';

interface TransformationItem {
  id: string;
  category: string;
  categoryLabel: string;
  title: string;
  subtitle: string;
  description: string;
  beforeImage: string;
  beforeAlt: string;
  beforeLabel?: string;
  afterImage: string;
  afterAlt: string;
  afterLabel?: string;
  treatmentDetails: string[];
  serviceRoute: string;
  whatsappMessage: string;
  isSingleComposite?: boolean;
}

const TRANSFORMATIONS: TransformationItem[] = [
  {
    id: 'hair-transformation',
    category: 'hair-transformation',
    categoryLabel: 'Hair Transformation',
    title: 'Deep Restorative Keratin & Protein Smoothing',
    subtitle: 'Cuticle realignment and frizz elimination',
    description: 'Transforming dull, unmanageable textures into silky, healthy strands with fluid motion and high-gloss shine. Tailored to your specific hair porosity.',
    beforeImage: '/images/gallery/hair-transformation.jpg',
    beforeAlt: 'Before protein smoothing hair treatment at SK Relax Salon Satara',
    beforeLabel: 'Before Protein Smoothing',
    afterImage: '/images/services/sk-relax-straight-protein-hair.jpg',
    afterAlt: 'Finished smooth straight protein hair result at SK Relax Salon Satara',
    afterLabel: 'Finished Protein Smoothing Result',
    treatmentDetails: [
      'Formaldehyde-free keratin & protein infusion',
      'Intensive thermal seal for moisture retention',
      'Lasting shine & humidity defense for 4–6 months',
      'Unhurried personal hair assessment'
    ],
    serviceRoute: '/services?cat=hair-treatments',
    whatsappMessage: 'Hello SK Relax Satara, I would like to consult regarding the Keratin & Protein Hair Smoothing treatment.'
  },
  {
    id: 'hair-styling',
    category: 'hair-styling',
    categoryLabel: 'Hair Styling',
    title: 'Signature Butterfly & Dynamic Layer Cut',
    subtitle: 'Precision elevation degrees with face-framing bounce',
    description: 'Masterclass-inspired layered geometry that preserves length while releasing heavy bulk, giving instant bounce, effortless styling, and facial contouring.',
    beforeImage: '/images/services/hero-back-layer.jpg',
    beforeAlt: 'Hair length prior to signature precision cut at SK Relax',
    beforeLabel: 'Full Length Base Structure',
    afterImage: '/images/gallery/butterfly-haircut.jpg',
    afterAlt: 'Signature butterfly layered haircut with outward blowout at SK Relax Salon Satara',
    afterLabel: 'Finished Butterfly Layered Silhouette',
    treatmentDetails: [
      'Elevation angle slicing tailored to cheekbones',
      'Feathered curtain bangs integration',
      'Weightless crown graduation',
      'Volumizing blowout tutorial included'
    ],
    serviceRoute: '/services?cat=hair-treatments',
    whatsappMessage: 'Hello SK Relax Satara, I would like to book an appointment for the Signature Butterfly Haircut.'
  },
  {
    id: 'skin-beauty',
    category: 'skin-beauty',
    categoryLabel: 'Skin & Beauty',
    title: 'Korean Glass Skin Glow & Hydra Infusion',
    subtitle: 'Clinical hydro-dermabrasion and deep peptide nourishment',
    description: 'Gentle suction vortex pore clearance combined with multi-step botanical ampoules, cooling therapy, and collagen hydration for luminous glass-like skin.',
    beforeImage: '/images/treatments/facial-treatment-frame.jpg',
    beforeAlt: 'Pore preparation and clinical facial therapy at SK Relax Salon Satara',
    beforeLabel: 'Deep Cleansing & Barrier Prep',
    afterImage: '/images/treatments/korean-glass-skin-glow.jpg',
    afterAlt: 'Radiant dewy Korean glass skin glow finish at SK Relax Satara',
    afterLabel: 'Luminous Glass Skin Glow Finish',
    treatmentDetails: [
      '7-in-1 aesthetic console vortex extraction',
      'Ultrasound skin barrier infusion',
      'Cooling cryo soothing mask',
      'Sterile single-use hygienic applicator tips'
    ],
    serviceRoute: '/services?cat=facials-skin',
    whatsappMessage: 'Hello SK Relax Satara, I would like to enquire about the Korean Glass Skin Hydra Facial.'
  },
  {
    id: 'bridal-makeup',
    category: 'bridal-makeup',
    categoryLabel: 'Bridal Makeup',
    title: 'Traditional Maharashtrian Bridal Couture',
    subtitle: 'Timeless Nauvari elegance with HD waterproof finish',
    description: 'Flawless camera-ready bridal makeup honoring regional heritage. High-definition waterproof base, bespoke eye artistry, and regal silk saree draping.',
    beforeImage: '/images/services/skincare-facial.jpg',
    beforeAlt: 'Pre-bridal skin conditioning and primer preparation',
    beforeLabel: 'Pre-Bridal Canvas Preparation',
    afterImage: '/images/gallery/maharashtrian-bridal-artistry.jpg',
    afterAlt: 'Traditional Maharashtrian Nauvari bridal transformation at SK Relax Satara',
    afterLabel: 'Complete Bridal Couture Reveal',
    treatmentDetails: [
      'HD sweat-proof & waterproof foundation base',
      'Authentic Nauvari / silk saree draping',
      'Customized traditional bridal hair styling',
      'Pre-wedding consultation & trial planning'
    ],
    serviceRoute: '/services?cat=makeup-bridal',
    whatsappMessage: 'Hello Salma ma\'am, I would like to enquire about bridal makeup packages at SK Relax Satara.'
  },
  {
    id: 'permanent-makeup',
    category: 'permanent-makeup',
    categoryLabel: 'Permanent Makeup (PMU)',
    title: 'Permanent Makeup (PMU) & Microblading',
    subtitle: 'Authentic client before and after comparison frame',
    description: 'Semi-permanent brow enhancement providing natural fullness and symmetry. Sterile microblading hair strokes blended seamlessly with ombré powder shading.',
    beforeImage: '/images/gallery/pmu-eyebrow-result.jpg',
    beforeAlt: 'Authentic client PMU eyebrow microblading before and after result at SK Relax Satara',
    beforeLabel: 'Natural Brow Baseline (Top / Initial)',
    afterImage: '/images/gallery/pmu-eyebrow-result.jpg',
    afterAlt: 'Finished microblading hair strokes and brow shape at SK Relax Satara',
    afterLabel: 'Microblade Sculpted Symmetry (Bottom / Result)',
    isSingleComposite: true,
    treatmentDetails: [
      'Medical-grade disposable sterile micro-blades',
      'Hypoallergenic certified brow pigments',
      'Custom color matching to natural hair tone',
      'Comprehensive healing & aftercare guidance'
    ],
    serviceRoute: '/services?cat=permanent-makeup',
    whatsappMessage: 'Hello SK Relax Satara, I would like to book a consultation for PMU Eyebrow Microblading.'
  }
];

export const TransformationsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('hair-transformation');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isInteractiveSliderActive, setIsInteractiveSliderActive] = useState<boolean>(false);

  const currentItem = TRANSFORMATIONS.find((t) => t.id === activeTab) || TRANSFORMATIONS[0];

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <section 
      id="transformations" 
      className="relative py-14 sm:py-20 lg:py-24 bg-luxury-cream text-forest-900 border-b border-forest-900/10 overflow-hidden"
    >
      {/* Luxury Background Accents */}
      <LuxuryBotanicalShadow position="top-left" opacity={0.22} />
      <LuxuryCurvedLines position="bottom-right" variant="ribbon" className="opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-900/5 border border-forest-900/15 text-rose-600 text-xs font-sans font-semibold uppercase tracking-[0.25em] mb-3">
              <Sparkles size={13} className="text-gold-500" />
              <span>Real Transformations</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forest-900 font-light leading-tight">
              Real Transformations.{' '}
              <span className="font-serif italic text-rose-600 font-normal">
                Beautiful Results.
              </span>
            </h2>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-forest-700 font-sans leading-relaxed">
              Explore authentic transformations and client experiences at SK Relax Beauty Academy & Salon in Satara. Genuine studio photographs preserving natural identity and artistic craftsmanship.
            </p>
          </div>
        </ScrollReveal>

        {/* Category Navigation Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-8 sm:mb-12 no-scrollbar">
          {TRANSFORMATIONS.map((item) => {
            const isActive = item.id === activeTab;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setSliderPosition(50);
                }}
                className={`px-4 py-2 sm:py-2.5 rounded-full text-xs font-sans font-semibold tracking-wider whitespace-nowrap transition-all duration-300 border flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-forest-900 text-ivory border-forest-900 shadow-soft scale-102'
                    : 'bg-white/80 text-forest-800 border-forest-900/10 hover:border-forest-900/30 hover:bg-white'
                }`}
              >
                {item.categoryLabel}
              </button>
            );
          })}
        </div>

        {/* Main Transformation Showcase Display */}
        <div className="bg-white rounded-sm border border-forest-900/10 shadow-luxury overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
            
            {/* Visual Column: Before & After Comparison */}
            <div className="lg:col-span-7 p-4 sm:p-6 lg:p-8 bg-cream-50/70 border-b lg:border-b-0 lg:border-r border-forest-900/10 flex flex-col justify-center">
              
              {/* Slider Toggle Bar */}
              {!currentItem.isSingleComposite && (
                <div className="flex items-center justify-between mb-4 text-xs font-sans text-forest-700">
                  <span className="font-medium flex items-center gap-1.5">
                    <Sliders size={13} className="text-gold-600" />
                    <span>Comparison Mode</span>
                  </span>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-sm border border-forest-900/10 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setIsInteractiveSliderActive(false)}
                      className={`px-2.5 py-1 rounded-xs transition-colors font-medium ${
                        !isInteractiveSliderActive
                          ? 'bg-forest-900 text-ivory font-semibold'
                          : 'text-forest-700 hover:text-forest-900'
                      }`}
                    >
                      Side by Side
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsInteractiveSliderActive(true)}
                      className={`px-2.5 py-1 rounded-xs transition-colors font-medium ${
                        isInteractiveSliderActive
                          ? 'bg-forest-900 text-ivory font-semibold'
                          : 'text-forest-700 hover:text-forest-900'
                      }`}
                    >
                      Interactive Slider
                    </button>
                  </div>
                </div>
              )}

              {/* View 1: Interactive Slider (When enabled and not a single composite) */}
              {!currentItem.isSingleComposite && isInteractiveSliderActive ? (
                <div 
                  className="relative aspect-[4/3] sm:aspect-[16/11] w-full max-h-[520px] rounded-sm overflow-hidden select-none cursor-ew-resize border border-forest-900/15 shadow-card"
                  onMouseMove={handleSliderMove}
                  onTouchMove={handleSliderMove}
                >
                  {/* After Image (Full background) */}
                  <img
                    src={currentItem.afterImage}
                    alt={currentItem.afterAlt}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-forest-950/85 backdrop-blur-sm text-ivory text-[10px] sm:text-xs uppercase font-sans font-semibold tracking-wider px-2.5 py-1 rounded-sm border border-gold-400/40 z-10 shadow-soft">
                    AFTER
                  </div>

                  {/* Before Image (Clipped overlay) */}
                  <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <img
                      src={currentItem.beforeImage}
                      alt={currentItem.beforeAlt}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-forest-950/85 backdrop-blur-sm text-ivory text-[10px] sm:text-xs uppercase font-sans font-semibold tracking-wider px-2.5 py-1 rounded-sm border border-forest-700/60 z-10 shadow-soft">
                      BEFORE
                    </div>
                  </div>

                  {/* Divider Handle */}
                  <div 
                    className="absolute inset-y-0 w-0.5 bg-ivory shadow-lg pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-forest-900 text-ivory border-2 border-ivory flex items-center justify-center shadow-luxury text-[10px] font-bold">
                      ↔
                    </div>
                  </div>

                  <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
                    <span className="inline-block bg-forest-950/80 backdrop-blur-xs text-ivory-200 text-[10px] font-sans px-3 py-1 rounded-full shadow-soft border border-white/10">
                      Drag or swipe horizontally to compare
                    </span>
                  </div>
                </div>
              ) : currentItem.isSingleComposite ? (
                /* View 2: High-Resolution Authentic Dual Composite (PMU Frame) */
                <div className="relative rounded-sm overflow-hidden border border-forest-900/15 shadow-card bg-forest-950">
                  <div className="relative aspect-square max-h-[520px] w-full flex items-center justify-center overflow-hidden">
                    <img
                      src={currentItem.afterImage}
                      alt={currentItem.afterAlt}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute top-3 left-3 bg-forest-950/90 backdrop-blur-sm text-gold-300 text-[10px] sm:text-xs uppercase font-sans font-semibold tracking-wider px-3 py-1 rounded-sm border border-gold-400/40 shadow-soft">
                    AUTHENTIC SK RELAX CLIENT RESULT
                  </div>
                </div>
              ) : (
                /* View 3: Two-Column Side by Side on Desktop / Stacked on Mobile */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Before Card */}
                  <div className="relative rounded-sm overflow-hidden bg-forest-950 border border-forest-900/15 shadow-soft aspect-[4/5]">
                    <img
                      src={currentItem.beforeImage}
                      alt={currentItem.beforeAlt}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-forest-950/85 backdrop-blur-sm text-ivory-200 text-[10px] sm:text-xs uppercase font-sans font-semibold tracking-wider px-2.5 py-1 rounded-sm border border-forest-700/60 shadow-soft">
                      BEFORE
                    </div>
                    {currentItem.beforeLabel && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-transparent p-3 pt-6 text-[11px] text-ivory-200 font-sans">
                        {currentItem.beforeLabel}
                      </div>
                    )}
                  </div>

                  {/* After Card */}
                  <div className="relative rounded-sm overflow-hidden bg-forest-950 border border-gold-500/30 shadow-soft aspect-[4/5]">
                    <img
                      src={currentItem.afterImage}
                      alt={currentItem.afterAlt}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-forest-900/90 backdrop-blur-sm text-gold-300 text-[10px] sm:text-xs uppercase font-sans font-semibold tracking-wider px-2.5 py-1 rounded-sm border border-gold-400/50 shadow-soft">
                      AFTER
                    </div>
                    {currentItem.afterLabel && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-transparent p-3 pt-6 text-[11px] text-gold-300 font-sans font-medium">
                        {currentItem.afterLabel}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Content Column: Treatment Details, Transparency & Actions */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-sans font-semibold text-rose-600 block mb-2">
                  {currentItem.categoryLabel}
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl text-forest-900 font-normal leading-tight">
                  {currentItem.title}
                </h3>

                <p className="mt-1 text-xs text-forest-600 font-sans font-medium italic">
                  {currentItem.subtitle}
                </p>

                <p className="mt-4 text-xs sm:text-sm text-forest-700 leading-relaxed font-sans">
                  {currentItem.description}
                </p>

                {/* Treatment Highlights Checklist */}
                <div className="mt-6 pt-5 border-t border-forest-900/10">
                  <h4 className="text-xs uppercase tracking-wider font-sans font-semibold text-forest-900 mb-3">
                    Service Highlights:
                  </h4>
                  <ul className="space-y-2">
                    {currentItem.treatmentDetails.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-forest-800 font-sans">
                        <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Call to Actions & Transparency Disclaimer */}
              <div className="mt-8 pt-6 border-t border-forest-900/10 space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button
                    to="/booking"
                    variant="primary"
                    size="md"
                    className="justify-center"
                    icon={<Calendar size={15} />}
                  >
                    Book This Service
                  </Button>

                  <a
                    href={buildWhatsAppUrl(currentItem.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick('transformations_section', currentItem.title)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-cream-100 hover:bg-cream-200 text-forest-900 text-xs font-sans font-semibold uppercase tracking-wider border border-forest-900/15 transition-colors"
                  >
                    <MessageCircle size={15} className="text-emerald-600" />
                    <span>WhatsApp Enquiry</span>
                  </a>
                </div>

                <p className="text-[11px] text-forest-500 font-sans italic leading-normal">
                  * Authentic photographs taken at SK Relax Beauty Academy & Salon, Satara. Individual results may vary according to natural hair condition and skin profile.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Navigation Hint to Full Portfolio */}
        <div className="mt-8 text-center">
          <Button to="/gallery" variant="outline" size="sm" icon={<ArrowRight size={13} />}>
            View Complete Studio & Academy Gallery
          </Button>
        </div>
      </div>
    </section>
  );
};