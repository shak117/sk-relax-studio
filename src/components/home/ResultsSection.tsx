import React, { useState } from 'react';
import { 
  Award, 
  GraduationCap, 
  Scissors, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  MessageCircle,
  Clock
} from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Button } from '../ui/Button';
import { buildWhatsAppUrl, WhatsAppMessages } from '../../data/brandData';
import { trackWhatsAppClick } from '../../services/analytics';
import { 
  LuxuryCurvedLines, 
  LuxuryBotanicalShadow 
} from '../ui/LuxuryBackgroundDecorations';

interface ServiceCategoryMetric {
  id: string;
  name: string;
  percentage: number;
  highlight: string;
  servicesCount: string;
  description: string;
  keyServices: string[];
}

const CATEGORY_METRICS: ServiceCategoryMetric[] = [
  {
    id: 'hair',
    name: 'Hair Artistry & Science',
    percentage: 35,
    highlight: 'Cuticle Repair & Precision Cutting',
    servicesCount: '11 Core Services',
    description: 'Precision layered haircuts including the signature butterfly cut, paired with advanced protein restoration and smoothing therapies.',
    keyServices: ['Butterfly & Layer Cuts', 'Nanoplastia & Botox', 'Keratin Smoothing', 'Hair Spa & Scalp Therapy']
  },
  {
    id: 'skin',
    name: 'Facials & Skin Aesthetics',
    percentage: 25,
    highlight: 'Clinical Hydra Machine Consoles',
    servicesCount: '8 Specialized Therapies',
    description: 'Advanced non-invasive facial treatments utilizing multifunction hydra consoles, ultrasound infusion, and organic fruit peels.',
    keyServices: ['7-in-1 Hydra Facial', 'Korean Glass Skin Glow', 'Diamond Skin Polishing', 'Barrier Soothing Facials']
  },
  {
    id: 'bridal',
    name: 'Bridal Couture & Makeup',
    percentage: 20,
    highlight: 'Maharashtrian Nauvari & Silk Draping',
    servicesCount: '5 Signature Packages',
    description: 'Complete bridal transformations honoring Maharashtrian wedding traditions with long-lasting waterproof bridal makeup and luxury draping.',
    keyServices: ['Traditional Nauvari Draping', 'HD Waterproof Makeup', 'Silk Saree Styling', 'Bridal Trial Planning']
  },
  {
    id: 'pmu',
    name: 'Permanent Makeup (PMU)',
    percentage: 10,
    highlight: 'Medical-Grade Sterile Pigments',
    servicesCount: '4 Certified Procedures',
    description: 'Semi-permanent cosmetic artistry providing realistic eyebrow hair-strokes, ombre shading, and lip blush color enhancement.',
    keyServices: ['Microblading Eyebrows', 'Ombré Powder Brows', 'Lip Blush Tinting', 'Lash Lift & Tint']
  },
  {
    id: 'academy',
    name: 'Academy Masterclasses',
    percentage: 10,
    highlight: '100% Practical Dummy Practice',
    servicesCount: '3-Day Intensive Curriculum',
    description: 'Hands-on beauty education in Satara with individual mannequin dummy heads, tool ergonomics, and official course completion certificates.',
    keyServices: ['Elevation Degree Angles', 'Sectioning & Tool Mastery', '5 Modern Layered Cuts', 'Certification Awarded']
  }
];

export const ResultsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('hair');

  const activeCategory = CATEGORY_METRICS.find((c) => c.id === selectedCategory) || CATEGORY_METRICS[0];

  return (
    <section 
      id="results" 
      className="relative py-14 sm:py-20 lg:py-24 bg-luxury-ivory text-forest-900 border-b border-forest-900/10 overflow-hidden"
    >
      {/* Luxury Background Accents */}
      <LuxuryBotanicalShadow position="bottom-left" opacity={0.20} />
      <LuxuryCurvedLines position="top-right" variant="waves" className="opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-900/5 border border-forest-900/15 text-rose-600 text-xs font-sans font-semibold uppercase tracking-[0.25em] mb-3">
              <Award size={13} className="text-gold-500" />
              <span>Documented Standards</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forest-900 font-light leading-tight">
              See the Difference.{' '}
              <span className="font-serif italic text-rose-600 font-normal">
                Experience the Results.
              </span>
            </h2>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-forest-700 font-sans leading-relaxed">
              Explore the verified service breakdown, training curriculum scope, and quality milestones that define SK Relax Beauty Academy & Salon in Satara.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Verified Studio Milestones Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          
          <ScrollReveal delay={0}>
            <div className="bg-white p-5 sm:p-6 rounded-sm border border-forest-900/10 shadow-soft h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-900 mb-3">
                  <Clock size={18} />
                </div>
                <div className="font-serif text-3xl sm:text-4xl text-forest-900 font-medium tracking-tight">
                  14+ Years
                </div>
                <p className="mt-1 text-xs sm:text-sm font-sans font-semibold text-rose-600 uppercase tracking-wider">
                  Established 2010
                </p>
              </div>
              <p className="mt-3 text-xs text-forest-600 leading-relaxed font-sans pt-3 border-t border-forest-900/5">
                Over a decade of trusted salon excellence and continuous technique refinement in Satara.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="bg-white p-5 sm:p-6 rounded-sm border border-forest-900/10 shadow-soft h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-700 mb-3">
                  <Scissors size={18} />
                </div>
                <div className="font-serif text-3xl sm:text-4xl text-forest-900 font-medium tracking-tight">
                  31+ Curated
                </div>
                <p className="mt-1 text-xs sm:text-sm font-sans font-semibold text-gold-600 uppercase tracking-wider">
                  Studio Services
                </p>
              </div>
              <p className="mt-3 text-xs text-forest-600 leading-relaxed font-sans pt-3 border-t border-forest-900/5">
                Comprehensive catalogue spanning precision cuts, clinical facials, bridal art & PMU.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="bg-white p-5 sm:p-6 rounded-sm border border-forest-900/10 shadow-soft h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700 mb-3">
                  <GraduationCap size={18} />
                </div>
                <div className="font-serif text-3xl sm:text-4xl text-forest-900 font-medium tracking-tight">
                  100% Practical
                </div>
                <p className="mt-1 text-xs sm:text-sm font-sans font-semibold text-rose-600 uppercase tracking-wider">
                  Dummy Practice
                </p>
              </div>
              <p className="mt-3 text-xs text-forest-600 leading-relaxed font-sans pt-3 border-t border-forest-900/5">
                Every academy participant trains on provided mannequin dummy heads for real dexterity.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="bg-white p-5 sm:p-6 rounded-sm border border-forest-900/10 shadow-soft h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-3">
                  <ShieldCheck size={18} />
                </div>
                <div className="font-serif text-3xl sm:text-4xl text-forest-900 font-medium tracking-tight">
                  5 Specialities
                </div>
                <p className="mt-1 text-xs sm:text-sm font-sans font-semibold text-emerald-700 uppercase tracking-wider">
                  Certified Scope
                </p>
              </div>
              <p className="mt-3 text-xs text-forest-600 leading-relaxed font-sans pt-3 border-t border-forest-900/5">
                Hair science, skin machines, bridal styling, PMU micropigmentation, and beauty education.
              </p>
            </div>
          </ScrollReveal>

        </div>

        {/* Interactive Service Distribution Breakdown */}
        <div className="bg-white rounded-sm border border-forest-900/10 shadow-luxury overflow-hidden mb-12">
          <div className="p-6 sm:p-8 border-b border-forest-900/10 bg-cream-50/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-sans font-semibold uppercase tracking-widest text-rose-600 block mb-1">
                  Service Distribution Architecture
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-forest-900 font-normal">
                  Curriculum & Salon Capability Breakdown
                </h3>
              </div>
              <span className="text-xs text-forest-600 font-sans italic">
                * Select a category below to explore its verified service inclusions
              </span>
            </div>

            {/* Visual Distribution Bar */}
            <div className="mt-6 h-3 rounded-full overflow-hidden flex shadow-inner bg-cream-200">
              <div style={{ width: '35%' }} className="bg-forest-900 transition-all duration-500" title="Hair Artistry 35%" />
              <div style={{ width: '25%' }} className="bg-rose-600 transition-all duration-500" title="Skin Aesthetics 25%" />
              <div style={{ width: '20%' }} className="bg-gold-500 transition-all duration-500" title="Bridal Couture 20%" />
              <div style={{ width: '10%' }} className="bg-emerald-700 transition-all duration-500" title="PMU 10%" />
              <div style={{ width: '10%' }} className="bg-forest-700 transition-all duration-500" title="Academy 10%" />
            </div>

            {/* Horizontal Percentage Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] font-sans text-forest-700">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-forest-900"></span> Hair Artistry (35%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Skin Aesthetics (25%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gold-500"></span> Bridal Couture (20%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span> PMU Microblading (10%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-forest-700"></span> Academy (10%)</span>
            </div>
          </div>

          {/* Interactive Category Selector and Detail Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Category Tab List */}
            <div className="lg:col-span-5 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-forest-900/10 bg-cream-50/30 space-y-2">
              {CATEGORY_METRICS.map((cat) => {
                const isSelected = cat.id === selectedCategory;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-sm transition-all duration-200 border flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-white border-forest-900 shadow-soft translate-x-1'
                        : 'bg-transparent border-transparent hover:bg-white/70 hover:border-forest-900/10'
                    }`}
                  >
                    <div>
                      <div className="font-serif text-base sm:text-lg text-forest-900 font-medium">
                        {cat.name}
                      </div>
                      <div className="text-xs text-forest-600 font-sans mt-0.5">
                        {cat.highlight}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <span className={`font-serif text-lg font-semibold ${isSelected ? 'text-rose-600' : 'text-forest-700'}`}>
                        {cat.percentage}%
                      </span>
                      <div className="text-[10px] uppercase tracking-wider text-forest-500 font-sans">
                        {cat.servicesCount}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Category Deep Dive */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-[10px] uppercase tracking-widest font-sans font-semibold text-rose-600">
                    Category Details
                  </span>
                  <span className="text-xs bg-forest-900 text-ivory px-2.5 py-0.5 rounded-full font-sans font-medium">
                    {activeCategory.percentage}% of Studio Focus
                  </span>
                </div>

                <h4 className="font-serif text-2xl sm:text-3xl text-forest-900 font-normal">
                  {activeCategory.name}
                </h4>

                <p className="mt-1 text-xs text-forest-600 font-sans font-medium italic">
                  {activeCategory.highlight}
                </p>

                <p className="mt-4 text-xs sm:text-sm text-forest-700 leading-relaxed font-sans">
                  {activeCategory.description}
                </p>

                {/* Key Inclusions */}
                <div className="mt-6 pt-5 border-t border-forest-900/10">
                  <h5 className="text-xs uppercase tracking-wider font-sans font-semibold text-forest-900 mb-3">
                    Featured Treatments & Capabilities:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeCategory.keyServices.map((service, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-forest-800 font-sans bg-cream-50/60 p-2.5 rounded-sm border border-forest-900/5">
                        <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                        <span className="font-medium">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-8 pt-6 border-t border-forest-900/10 flex flex-wrap items-center gap-3">
                <Button to="/services" variant="primary" size="md">
                  View Full Services Menu
                </Button>
                <Button
                  href={buildWhatsAppUrl(WhatsAppMessages.serviceEnquiry(activeCategory.name))}
                  external
                  variant="outline"
                  size="md"
                  onClick={() => trackWhatsAppClick('results_section', activeCategory.name)}
                  icon={<MessageCircle size={14} className="text-emerald-600" />}
                >
                  Enquire on WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Documented Quality Assurance Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-sm border border-forest-900/10 shadow-soft">
            <div className="w-10 h-10 rounded-full bg-forest-50 flex items-center justify-center text-forest-900 mb-4">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-serif text-lg font-medium text-forest-900 mb-2">
              Sterile Clinical Hygiene
            </h4>
            <p className="text-xs text-forest-700 leading-relaxed font-sans">
              Autoclaved scissor blades, sanitized aesthetic machine wands, and single-use disposable tips for every client in Satara.
            </p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-forest-900/10 shadow-soft">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-700 mb-4">
              <Users size={20} />
            </div>
            <h4 className="font-serif text-lg font-medium text-forest-900 mb-2">
              Bespoke Hair & Skin Consultations
            </h4>
            <p className="text-xs text-forest-700 leading-relaxed font-sans">
              Every haircut and facial starts with facial bone assessment and hair strand porosity testing to ensure tailored, long-lasting results.
            </p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-forest-900/10 shadow-soft">
            <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-700 mb-4">
              <GraduationCap size={20} />
            </div>
            <h4 className="font-serif text-lg font-medium text-forest-900 mb-2">
              Practical Academy Empowerment
            </h4>
            <p className="text-xs text-forest-700 leading-relaxed font-sans">
              Personalized guidance by founder Salma Attar. Training mannequins and curriculum materials provided for genuine hands-on mastery.
            </p>
          </div>
        </div>

        {/* Transparency Statement */}
        <div className="text-center">
          <p className="text-xs text-forest-600 font-sans italic max-w-2xl mx-auto">
            * Data Transparency: All metrics reflect documented SK Relax studio curriculum and service offerings in Satara. We present only verified studio milestones and honest capability data without fabricated statistics.
          </p>
        </div>

      </div>
    </section>
  );
};