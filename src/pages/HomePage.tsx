import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Scissors, 
  GraduationCap, 
  MessageCircle, 
  Calendar, 
  ArrowRight, 
  Check, 
  ShieldCheck,
  MapPin,
  Navigation,
  Play,
  Users,
  Award,
  Video,
  Star
} from 'lucide-react';
import { BRAND, buildWhatsAppUrl, WhatsAppMessages } from '../data/brandData';
import { SERVICES } from '../data/servicesData';
import { salonService } from '../services/salonService';
import { ServiceItem, BatchItem } from '../types';
import { batchService } from '../services/batchService';
import { ACADEMY_PROMO } from '../data/academyData';
import { formatEventDateRange } from '../utils/dateUtils';
import { resolveMediaUrl } from '../utils/mediaUrl';
import { ACADEMY_EVENTS } from '../data/eventsData';
import { STUDENT_FEEDBACK } from '../data/studentFeedbackData';
import { HeroVideo } from '../components/hero/HeroVideo';
import { ServiceCard } from '../components/services/ServiceCard';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { VideoPlayerModal } from '../components/ui/VideoPlayerModal';
import { 
  LuxuryBotanicalShadow, 
  LuxuryCurvedLines, 
  LuxuryLineArt 
} from '../components/ui/LuxuryBackgroundDecorations';
import { usePageSEO } from '../hooks/usePageSEO';
import { generateLocalBusinessSchema } from '../utils/schemaGenerator';

export const HomePage: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<{
    url: string;
    title: string;
    description?: string;
    posterImage?: string;
    categoryLabel?: string;
  } | null>(null);

  usePageSEO({
    title: 'SK Relax Beauty Academy & Salon | Satara',
    description: 'Explore SK Relax Beauty Academy & Salon in Satara. Discover salon services, professional hair styling, beauty education, and appointment enquiries.',
    path: '/',
    schema: generateLocalBusinessSchema(),
  });

  // Signature hair cuts from masterclass poster
  const signatureHaircuts = [
    {
      name: 'Butterfly Haircut',
      image: '/images/services/butterfly-haircut.jpg',
      description: 'Dynamic cascading crown layers with face-framing bounce and lightweight volume.',
      tag: 'Trending Signature'
    },
    {
      name: 'Long Layer Haircut',
      image: '/images/services/long-layer-haircut.jpg',
      description: 'Seamless graduation preserving maximum hair length with fluid texture and motion.',
      tag: 'Classic Elegance'
    },
    {
      name: 'Feather Haircut',
      image: '/images/services/feather-haircut.jpg',
      description: 'Feathered edge tapering providing an airy, lightweight feel and soft profile framing.',
      tag: 'Lightweight Texture'
    },
    {
      name: 'Curtain Bangs',
      image: '/images/services/curtain-bangs.jpg',
      description: 'Center-parted contoured fringe blending effortlessly into cheekbone lengths.',
      tag: 'Face Contouring'
    },
    {
      name: 'Face Framing',
      image: '/images/services/face-framing.jpg',
      description: 'Custom perimeter slicing designed around your facial proportions and cheekbones.',
      tag: 'Bespoke Framing'
    }
  ];

  // Select 6 featured catalogue services for homepage (dynamically synced with admin edits)
  const [featuredServices, setFeaturedServices] = useState<ServiceItem[]>(() => SERVICES.slice(0, 6));

  useEffect(() => {
    let isMounted = true;
    salonService
      .getPublishedServices()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setFeaturedServices(data.slice(0, 6));
        }
      })
      .catch((err) => {
        console.warn('[HomePage] Live services fetch failed, using fallback:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamic Featured Batch from Academy CMS
  const [featuredBatch, setFeaturedBatch] = useState<BatchItem | null>(null);
  const [batchLoading, setBatchLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    batchService
      .getFeaturedBatch()
      .then((batch) => {
        if (isMounted) {
          setFeaturedBatch(batch);
          setBatchLoading(false);
        }
      })
      .catch((err) => {
        console.warn('[HomePage] Featured batch fetch failed, using fallback:', err);
        if (isMounted) {
          setBatchLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-0 relative">
      {/* Homepage Hero Section with Original Video Background & Skip Option */}
      <HeroVideo 
        onServicesClick={() => {
          const target = document.getElementById('featured-services');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* 4C. Brand Introduction — Editorial Split Layout with Luxury Background */}
      <section id="brand-intro" className="relative py-14 sm:py-20 bg-luxury-ivory text-forest-900 border-b border-forest-900/10 overflow-hidden">
        {/* Soft botanical leaf shadow on top-left corner */}
        <LuxuryBotanicalShadow position="top-left" opacity={0.24} />

        {/* Delicate champagne-gold flowing ribbon curves on top-right */}
        <LuxuryCurvedLines position="top-right" variant="ribbon" className="opacity-80" />

        {/* Soft satin flowing wave on bottom-left */}
        <LuxuryCurvedLines position="bottom-left" variant="waves" className="opacity-60 -mb-4" />

        {/* Editorial feminine beauty profile line-art behind the right column */}
        <LuxuryLineArt 
          motif="beauty-profile" 
          opacity={0.18} 
          className="right-0 sm:right-6 lg:right-10 top-2 sm:top-6 pointer-events-none" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual Column — Real SK RELAX Salon Client Haircut & Styling Photo */}
            <div className="lg:col-span-5 order-1">
              <ScrollReveal direction="left">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Outer Frame with subtle luxury border & soft shadow */}
                  <div className="relative rounded-sm overflow-hidden bg-white/80 backdrop-blur-xs border border-forest-900/10 shadow-card p-2 sm:p-2.5">
                    {/* Image Container preserving full uncropped portrait aspect ratio */}
                    <div className="relative rounded-xs overflow-hidden bg-cream-50 flex items-center justify-center">
                      <img
                        src="/images/services/sk-relax-straight-protein-hair.jpg"
                        alt="Real SK Relax Salon Client Finished Straight Protein Hair Treatment & Smoothing"
                        className="w-full h-auto max-h-[620px] object-contain rounded-xs block mx-auto"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Editorial Floating Card */}
                  <div className="absolute -bottom-5 right-2 sm:-bottom-7 sm:-right-4 bg-white/95 backdrop-blur-sm p-4 sm:p-5 rounded-sm shadow-elevated border border-forest-900/10 max-w-xs z-10">
                    <span className="text-rose-600 font-serif italic text-base sm:text-lg block leading-snug">
                      “Learn ♡ Practice ♡ Grow”
                    </span>
                    <p className="mt-1.5 text-[11px] text-forest-700 font-sans uppercase tracking-wider font-medium">
                      Academy & Salon · Satara
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 order-2 space-y-6">
              <ScrollReveal direction="right">
                <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.25em] text-rose-600">
                  <span className="w-6 h-[1px] bg-rose-400"></span>
                  <span>Our Philosophy</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forest-900 font-light leading-[1.2]">
                  “Beauty is more than a look.
                  <span className="block font-serif italic text-rose-600 font-normal">
                    It is how you feel.”
                  </span>
                </h2>

                <div className="space-y-4 text-forest-700 font-sans text-sm sm:text-base leading-relaxed">
                  <p>
                    Nestled in Satara, Maharashtra, <strong className="font-medium text-forest-900">{BRAND.name}</strong> was created with a quiet devotion to personalized care, precision technique, and modern beauty craftsmanship. As a trusted hair salon and beauty parlour in Satara, our studio brings together creative hair artistry, restorative skincare, and professional beauty education.
                  </p>
                  <p>
                    Whether you are looking for a trending butterfly haircut in Satara, flawless bridal makeup, rejuvenating skin facials, or practical training at our beauty academy, our focus remains on unhurried consultation, sterile hygiene, and an atmosphere designed to let you unwind completely.
                  </p>
                </div>

                {/* Core Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-forest-900/10">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center flex-shrink-0 text-forest-800">
                      <Scissors size={15} />
                    </div>
                    <div>
                      <h4 className="font-serif text-base text-forest-900 font-medium">Personalised Styling</h4>
                      <p className="text-xs text-forest-600 mt-0.5">Bespoke hair design tailored to face shapes and texture.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 text-rose-700">
                      <GraduationCap size={15} />
                    </div>
                    <div>
                      <h4 className="font-serif text-base text-forest-900 font-medium">Beauty Academy</h4>
                      <p className="text-xs text-forest-600 mt-0.5">Hands-on masterclasses with training dummy heads provided.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Button to="/services" variant="primary" size="md">
                    Explore Catalogue
                  </Button>
                  <Button to="/contact" variant="outline" size="md">
                    Studio Location
                  </Button>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4E. Signature Hair Artistry (Masterclass Poster Showcase) */}
      <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 bg-luxury-cream text-forest-900 border-b border-forest-900/10 overflow-hidden">
        <LuxuryLineArt motif="hair-flow" opacity={0.14} className="top-8 left-6 sm:left-12 pointer-events-none" />
        <LuxuryCurvedLines position="bottom-right" variant="waves" className="opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Signature Hair Artistry"
              title="Modern Cutting Techniques"
              highlightText="& Layering"
              description="Inspired by our official Hair Cutting Masterclass curriculum. These featured haircuts showcase our signature precision cutting, seamless graduation, and contemporary styling."
            />
          </ScrollReveal>

          {/* 5 Haircuts Showcase */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {signatureHaircuts.map((cut, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className="group relative bg-white rounded-sm overflow-hidden border border-forest-900/10 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col h-full">
                  <div className="aspect-[3/4] w-full overflow-hidden bg-forest-950">
                    <img
                      src={cut.image}
                      alt={cut.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-sans uppercase tracking-widest text-rose-600 font-semibold block mb-1">
                        {cut.tag}
                      </span>
                      <h3 className="font-serif text-lg text-forest-900 font-medium leading-tight">
                        {cut.name}
                      </h3>
                      <p className="mt-2 text-xs text-forest-700/80 leading-relaxed font-sans">
                        {cut.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-forest-900/10">
                      <a
                        href={buildWhatsAppUrl(WhatsAppMessages.serviceEnquiry(cut.name))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-forest-900 hover:text-emerald-700 font-medium font-sans uppercase tracking-wider"
                      >
                        <MessageCircle size={13} className="text-emerald-600" />
                        <span>Enquire Cut</span>
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <p className="mt-4 sm:mt-6 text-center text-xs text-forest-600 font-sans italic">
            * Technique examples inspired by our masterclass syllabus. Service availability and customization are tailored upon in-studio consultation.
          </p>
        </div>
      </section>

      {/* 4D. Featured Services Catalogue Grid */}
      <section id="services-section" className="relative pt-10 pb-14 sm:pt-14 sm:pb-18 bg-luxury-ivory text-forest-900 border-b border-forest-900/10 overflow-hidden">
        <LuxuryLineArt motif="botanical-sprig" opacity={0.16} className="top-10 right-4 sm:right-10 pointer-events-none" />
        <LuxuryBotanicalShadow position="bottom-left" opacity={0.18} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.25em] text-rose-600 mb-2">
                <span className="w-6 h-[1px] bg-rose-400"></span>
                <span>Salon Offerings</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forest-900 font-medium">
                Curated Studio <span className="font-serif italic font-medium text-rose-600">Services</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-forest-700 max-w-xl font-sans">
                Explore our proposed service menu across hair design, restorative skincare, and occasion beauty.
              </p>
            </div>

            <Button to="/services" variant="outline" size="md" icon={<ArrowRight size={14} />}>
              View All Services
            </Button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service, idx) => (
              <ScrollReveal key={service.id} delay={idx * 80}>
                <ServiceCard 
                  service={service} 
                  onWatchVideo={(s) => {
                    if (s.videoUrl) {
                      setActiveVideo({
                        url: s.videoUrl,
                        title: s.title,
                        description: s.description || s.shortDescription,
                        posterImage: s.videoPoster || s.image || s.thumbnail,
                        categoryLabel: s.categoryLabel
                      });
                    }
                  }}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Spotlight Section */}
      <section id="team-spotlight" className="relative py-12 sm:py-16 lg:py-20 bg-luxury-cream text-forest-900 border-b border-forest-900/10 overflow-hidden">
        <LuxuryCurvedLines position="top-right" variant="ribbon" className="opacity-50" />
        <LuxuryBotanicalShadow position="bottom-left" opacity={0.20} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-5">
              <ScrollReveal direction="left">
                <div className="relative mx-auto max-w-sm lg:max-w-md">
                  <div className="relative rounded-sm overflow-hidden bg-forest-950 shadow-luxury border-2 border-gold-500/30 flex flex-col justify-end min-h-[480px] sm:min-h-[540px] lg:min-h-[580px]">
                    {/* Ambient Blurred Studio Backdrop */}
                    <img
                      src="/images/team/salma-attar-founder-real.jpg"
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-35 pointer-events-none select-none"
                    />

                    {/* Single Real Portrait of Salma Attar — Full Head, Shoulders, and Hands visible */}
                    <img
                      src="/images/team/salma-attar-founder-real.jpg"
                      alt="Salma Attar - Founder & Master Beauty Educator SK Relax Satara"
                      className="relative z-10 w-full h-[480px] sm:h-[540px] lg:h-[580px] object-contain object-top"
                      loading="lazy"
                    />

                    {/* Dark Forest-Green Gradient Scrim for readable text overlay without covering hands */}
                    <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-forest-950 via-forest-950/80 to-transparent pt-16 pb-5 px-5 sm:px-6 text-white pointer-events-none">
                      <span className="text-[10px] uppercase tracking-widest font-sans font-semibold text-gold-300 bg-forest-950/90 border border-gold-500/30 px-2.5 py-1 rounded-sm inline-block mb-1.5 shadow-soft">
                        Founder & Director
                      </span>
                      <h4 className="font-serif text-2xl sm:text-3xl text-ivory">Salma Attar</h4>
                      <p className="text-xs text-ivory-200/90 font-sans">Master Beauty Educator · 15+ Yrs Satara</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7">
              <ScrollReveal direction="right">
                <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.25em] text-rose-600 mb-4">
                  <Users size={14} />
                  <span>The Artisans Behind SK Relax</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forest-900 font-light leading-tight mb-5">
                  Meet Our Lead Educator &
                  <span className="block font-serif italic text-rose-600">
                    Professional Studio Team
                  </span>
                </h2>

                <p className="text-forest-700 font-sans text-sm sm:text-base leading-relaxed mb-6">
                  Led by founder <strong>Salma Attar</strong>, our salon and academy team combines 15+ years of beauty mastery with a genuine passion for personalized client transformation and student success in Satara.
                </p>

                {/* Key Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 sm:p-5 bg-white rounded-sm border border-forest-900/10 shadow-soft flex items-start gap-3">
                    <Award size={18} className="text-gold-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-serif text-sm font-medium text-forest-900 mb-1">Certified PMU & Aesthetics</h5>
                      <p className="text-xs text-forest-600 leading-relaxed">International certifications in microblading, clinical peels & skin machines.</p>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 bg-white rounded-sm border border-forest-900/10 shadow-soft flex items-start gap-3">
                    <GraduationCap size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-serif text-sm font-medium text-forest-900 mb-1">Personalized Mentorship</h5>
                      <p className="text-xs text-forest-600 leading-relaxed">Every student receives hands-on dummy practice and one-on-one guidance.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Button to="/team" variant="primary" size="md" icon={<ArrowRight size={14} />}>
                    Meet Our Full Team
                  </Button>
                  <Button
                    href={buildWhatsAppUrl("Hello Salma ma'am! I would like to consult regarding academy courses and salon services at SK Relax Satara.")}
                    external
                    variant="outline"
                    size="md"
                    icon={<MessageCircle size={15} className="text-emerald-600" />}
                  >
                    Direct Consultation
                  </Button>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4F. Beauty Academy Feature Banner */}
      <section className="py-12 sm:py-16 lg:py-20 bg-forest-950 text-ivory relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-forest-900/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {batchLoading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 mx-auto border-2 border-gold-400 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xs font-sans text-ivory-300 tracking-wider uppercase">Loading Academy Masterclass...</p>
            </div>
          ) : !featuredBatch ? (
            <div className="text-center py-12 px-4 max-w-2xl mx-auto">
              <div className="w-12 h-12 mx-auto rounded-full bg-forest-900 border border-gold-500/30 flex items-center justify-center text-gold-300 mb-4">
                <GraduationCap size={24} />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium mb-3">
                New Masterclass Batches Coming Soon
              </h3>
              <p className="text-ivory-200/90 text-sm sm:text-base leading-relaxed font-sans mb-6">
                Our next practical hands-on masterclass schedule is currently being finalized. Pre-register or enquire today to get early-bird notifications and priority seating.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4">
                <Button
                  href={buildWhatsAppUrl("Hello Salma Ma'am, please notify me when the next Academy Masterclass batch dates are announced at SK Relax Satara.")}
                  external
                  variant="gold"
                  size="md"
                  icon={<MessageCircle size={15} />}
                >
                  Enquire for Next Batch on WhatsApp
                </Button>
                <Button
                  to="/batches"
                  variant="outline"
                  size="md"
                  className="border-ivory/30 text-ivory hover:text-forest-950 hover:bg-ivory"
                >
                  Explore Course Batches
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7">
                <ScrollReveal direction="left">
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-gold-500/30 text-gold-300 text-xs font-sans tracking-widest uppercase">
                      <GraduationCap size={14} className="text-gold-400" />
                      <span>{featuredBatch.badge || 'SK Relax Beauty Academy · Satara'}</span>
                    </div>

                    {/* Discount / Category Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-900/60 border border-rose-500/40 text-rose-200 text-xs font-sans">
                      <Sparkles size={12} className="text-gold-400" />
                      <span>
                        {featuredBatch.discount
                          ? `${featuredBatch.discount}% Discount Available`
                          : `${ACADEMY_PROMO.discountBadge} on Certified Courses`}
                      </span>
                    </div>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-light leading-tight mb-5">
                    Transform Your Skills
                    <span className="block font-serif italic text-gold-300">
                      Into Success ♡
                    </span>
                  </h2>

                  <p className="text-sm sm:text-base text-ivory-200/90 leading-relaxed font-sans max-w-xl mb-6">
                    {featuredBatch.description || 'Our hands-on masterclasses are crafted for aspiring hairstylists, salon artists, and cosmetology students who want practical mastery of trending haircuts.'}
                  </p>

                  {/* Masterclass Highlight Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-forest-900/80 p-4 sm:p-5 rounded-sm border border-forest-800">
                      <p className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-2">Upcoming Batch Dates</p>
                      <p className="font-serif text-xl text-white">
                        {formatEventDateRange(featuredBatch.startDate, featuredBatch.endDate)}
                      </p>
                      <p className="text-xs text-ivory-300/80 mt-2">
                        {featuredBatch.timing || 'Daily Practical Hands-on Sessions'}
                      </p>
                    </div>

                    <div className="bg-forest-900/80 p-4 sm:p-5 rounded-sm border border-forest-800">
                      <p className="text-xs uppercase tracking-wider text-rose-400 font-semibold mb-2">Masterclass Fee</p>
                      <p className="font-serif text-xl text-white">
                        {featuredBatch.feeDisplay || (featuredBatch.fee > 0 ? `₹${featuredBatch.fee.toLocaleString('en-IN')}` : 'Fee on Enquiry')}
                      </p>
                      <p className="text-xs text-ivory-300/80 mt-2">
                        {featuredBatch.seatsRemaining !== undefined && featuredBatch.totalSeats
                          ? `${featuredBatch.seatsRemaining} of ${featuredBatch.totalSeats} seats remaining`
                          : 'Mannequin dummy head provided for practice'}
                      </p>
                    </div>
                  </div>

                  {/* Bullet Inclusions */}
                  <div className="mb-7">
                    <h4 className="text-xs uppercase tracking-wider text-ivory-300 font-sans font-semibold mb-3">
                      Curriculum Inclusions:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 text-xs text-ivory-200">
                      {(featuredBatch.curriculum && featuredBatch.curriculum.length > 0
                        ? featuredBatch.curriculum.slice(0, 6)
                        : [
                            'Hair Degree Geometry',
                            'Hair Sectioning',
                            'Hair Tools Mastery',
                            'Butterfly Layer Cut',
                            'Curtain Bangs Styling',
                            'Dummy Head Provided'
                          ]
                      ).map((item, idx) => (
                        <span key={idx} className="flex items-center gap-1.5 line-clamp-1">
                          <Check size={13} className="text-emerald-400 flex-shrink-0" />
                          <span className="truncate">{item}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <Button
                      href={buildWhatsAppUrl(
                        featuredBatch.whatsappPreset ||
                        `Hello Salma Ma'am, I am interested in enrolling for the ${featuredBatch.title} (${formatEventDateRange(featuredBatch.startDate, featuredBatch.endDate)}) at SK Relax Academy Satara.`
                      )}
                      external
                      variant="gold"
                      size="md"
                      icon={<MessageCircle size={15} />}
                    >
                      Enquire Batch on WhatsApp
                    </Button>

                    <Button
                      to={featuredBatch.slug ? `/batches/${featuredBatch.slug}` : '/batches'}
                      variant="outline"
                      size="md"
                      className="border-ivory/30 text-ivory hover:text-forest-950 hover:bg-ivory"
                    >
                      View Batch Details
                    </Button>
                  </div>
                </ScrollReveal>
              </div>

              {/* Right Poster / Media Column */}
              <div className="lg:col-span-5">
                <ScrollReveal direction="right">
                  <div className="relative max-w-sm mx-auto">
                    <div className="relative rounded-sm overflow-hidden shadow-luxury border-2 border-gold-500/40 bg-forest-900/60 flex items-center justify-center p-2 min-h-[360px]">
                      {/* Ambient background glow */}
                      <img
                        src={(() => {
                          const raw = featuredBatch.image || (featuredBatch as any).poster || (featuredBatch as any).imageUrl || (featuredBatch as any).coverImage || featuredBatch.thumbnail || '';
                          const resolved = resolveMediaUrl(raw || '/images/academy/hair-cutting-masterclass-poster.jpg');
                          const v = featuredBatch.updatedAt ? new Date(featuredBatch.updatedAt).getTime() : '';
                          return v && !resolved.includes('?') ? `${resolved}?v=${v}` : resolved;
                        })()}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-forest-950/30 pointer-events-none" />

                      {/* Full Original Poster with Contain */}
                      <img
                        src={(() => {
                          const raw = featuredBatch.image || (featuredBatch as any).poster || (featuredBatch as any).imageUrl || (featuredBatch as any).coverImage || featuredBatch.thumbnail || '';
                          const resolved = resolveMediaUrl(raw || '/images/academy/hair-cutting-masterclass-poster.jpg');
                          const v = featuredBatch.updatedAt ? new Date(featuredBatch.updatedAt).getTime() : '';
                          return v && !resolved.includes('?') ? `${resolved}?v=${v}` : resolved;
                        })()}
                        alt={featuredBatch.title}
                        className="relative z-10 max-h-[500px] w-auto h-auto object-contain mx-auto drop-shadow-lg"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-[11px] text-ivory-400 tracking-wider uppercase font-sans">
                        {featuredBatch.title}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Batch Celebrations & Events Preview Section */}
      <section className="relative py-14 sm:py-20 bg-luxury-ivory text-forest-900 border-b border-forest-900/10 overflow-hidden">
        <LuxuryCurvedLines position="top-left" variant="arcs" className="opacity-40" />
        <LuxuryLineArt motif="hair-flow" opacity={0.14} className="bottom-8 right-6 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.25em] text-rose-600 mb-2">
                <Video size={14} />
                <span>Life At SK Relax Academy</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forest-900 font-light">
                Batch Get-Togethers <span className="font-serif italic text-rose-600">& Workshops</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-forest-700 max-w-xl font-sans">
                Witness real moments from our academy batch celebrations, certificate distributions, and intensive mannequin dummy training sessions in Satara.
              </p>
            </div>

            <Button to="/events" variant="outline" size="md" icon={<ArrowRight size={14} />}>
              View All Events & Batches
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ACADEMY_EVENTS.slice(0, 2).map((event, idx) => (
              <ScrollReveal key={event.id} delay={idx * 100}>
                <div className="group relative bg-white rounded-sm overflow-hidden border border-forest-900/10 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col h-full">
                  <div className="relative aspect-[16/10] overflow-hidden bg-forest-950">
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-forest-950/30 group-hover:bg-forest-950/40 transition-colors" />

                    {event.videoUrl && (
                      <button
                        onClick={() =>
                          setActiveVideo({
                            url: event.videoUrl!,
                            title: event.title,
                            description: event.description,
                            posterImage: event.image,
                            categoryLabel: 'Academy Batch Event'
                          })
                        }
                        className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-forest-900/85 border border-gold-400 text-gold-300 hover:scale-110 hover:bg-gold-500 hover:text-forest-950 transition-all flex items-center justify-center shadow-luxury"
                        aria-label={`Play video for ${event.title}`}
                      >
                        <Play size={20} className="fill-current ml-0.5" />
                      </button>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-rose-600 font-semibold font-sans block mb-1">
                        {event.batchName}
                      </span>
                      <h3 className="font-serif text-xl text-forest-900 font-medium">
                        {event.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-forest-700 leading-relaxed font-sans">
                        {event.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-forest-900/10 flex items-center justify-between">
                      {event.videoUrl ? (
                        <button
                          onClick={() =>
                            setActiveVideo({
                              url: event.videoUrl!,
                              title: event.title,
                              description: event.description,
                              posterImage: event.image,
                              categoryLabel: 'Academy Batch Event'
                            })
                          }
                          className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold uppercase tracking-wider"
                        >
                          <Play size={13} className="fill-current" />
                          <span>Watch Video Reel</span>
                        </button>
                      ) : (
                        <span className="text-xs text-forest-600">Photo Moment</span>
                      )}

                      <a
                        href={buildWhatsAppUrl(WhatsAppMessages.academyEnquiry(event.title, 'Upcoming Batch'))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-forest-700 hover:text-emerald-700 font-medium"
                      >
                        <MessageCircle size={13} className="text-emerald-600" />
                        <span>Enquire Next Batch</span>
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Student Video Reviews & Feedback Preview */}
      <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 bg-luxury-cream text-forest-900 border-b border-forest-900/10 overflow-hidden">
        <LuxuryBotanicalShadow position="top-right" opacity={0.18} />
        <LuxuryCurvedLines position="bottom-left" variant="waves" className="opacity-45" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.25em] text-rose-600 mb-2">
                <Star size={14} className="fill-current text-gold-500" />
                <span>Genuine Student Testimonials</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forest-900 font-light">
                What Our Students <span className="font-serif italic text-rose-600">Say</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-forest-700 max-w-xl font-sans">
                Watch authentic video reviews and learn how our students built confidence and practical beauty skills under Salma Attar's personal mentorship in Satara.
              </p>
            </div>

            <Button to="/student-feedback" variant="outline" size="md" icon={<ArrowRight size={14} />}>
              View All Student Feedback
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {STUDENT_FEEDBACK.map((feedback, idx) => (
              <ScrollReveal key={feedback.id} delay={idx * 100}>
                <div className="bg-white p-6 sm:p-8 rounded-sm border border-forest-900/10 shadow-soft h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Video Banner */}
                    <div className="relative aspect-[16/9] rounded-sm overflow-hidden bg-forest-950 shadow-inner">
                      <img
                        src={feedback.posterImage}
                        alt={feedback.studentName}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-forest-950/30" />
                      {feedback.videoUrl && (
                        <button
                          onClick={() =>
                            setActiveVideo({
                              url: feedback.videoUrl!,
                              title: `${feedback.studentName} — Video Testimonial`,
                              description: feedback.quote,
                              posterImage: feedback.posterImage,
                              categoryLabel: 'Student Video Review'
                            })
                          }
                          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-forest-900/90 border border-gold-400 text-gold-300 hover:scale-110 hover:bg-gold-500 hover:text-forest-950 transition-all flex items-center justify-center shadow-luxury cursor-pointer z-10"
                          aria-label={`Play testimonial from ${feedback.studentName}`}
                        >
                          <Play size={18} className="fill-current ml-0.5" />
                        </button>
                      )}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-ivory-200 bg-forest-950/85 backdrop-blur-xs px-2.5 py-1 rounded-sm border border-gold-500/20 z-10">
                        <span className="font-sans font-medium flex items-center gap-1">
                          <Play size={10} className="fill-current text-gold-400" /> Watch Video Feedback
                        </span>
                        <span className="text-gold-300 font-sans">{feedback.batch}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-forest-800 leading-relaxed font-sans italic border-l-2 border-rose-400 pl-3">
                      “{feedback.quote}”
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-forest-900/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-base text-forest-900 font-medium">{feedback.studentName}</h4>
                      <p className="text-xs text-rose-600 font-sans">{feedback.courseName}</p>
                    </div>
                    {feedback.videoUrl && (
                      <button
                        onClick={() =>
                          setActiveVideo({
                            url: feedback.videoUrl!,
                            title: `${feedback.studentName} — Video Testimonial`,
                            description: feedback.quote,
                            posterImage: feedback.posterImage,
                            categoryLabel: 'Student Video Review'
                          })
                        }
                        className="text-xs uppercase font-sans font-semibold tracking-wider text-forest-900 hover:text-rose-600 inline-flex items-center gap-1"
                      >
                        <Play size={11} className="fill-current text-rose-500" />
                        <span>Play Reel</span>
                      </button>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4G. Gallery Preview */}
      <section className="relative pt-8 pb-10 sm:pt-12 sm:pb-14 bg-luxury-ivory text-forest-900 border-b border-forest-900/10 overflow-hidden">
        <LuxuryCurvedLines position="bottom-right" variant="ribbon" className="opacity-40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.25em] text-rose-600 mb-2">
                <span className="w-6 h-[1px] bg-rose-400"></span>
                <span>Visual Portfolio</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forest-900 font-medium">
                Studio & Masterclass <span className="font-serif italic font-medium text-rose-600">Gallery</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-forest-700 max-w-xl font-sans">
                A glimpse into our haircuts, practical masterclass moments, and studio ambience in Satara.
              </p>
            </div>

            <Button to="/gallery" variant="outline" size="md" icon={<ArrowRight size={14} />}>
              Explore Complete Gallery
            </Button>
          </div>

          {/* 6 Preview Items */}
          <GalleryGrid limit={6} showFilters={false} />
        </div>
      </section>

      {/* 4H. Experience & Standards Section */}
      <section className="relative pt-10 pb-14 sm:pt-14 sm:pb-18 bg-luxury-cream text-forest-900 border-b border-forest-900/10 overflow-hidden">
        <LuxuryCurvedLines position="top-left" variant="ribbon" className="opacity-45" />
        <LuxuryBotanicalShadow position="bottom-right" opacity={0.18} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <SectionHeading
              eyebrow="The SK Relax Standard"
              title="Dedicated to Thoughtful Care"
              highlightText="& True Craft"
              description="We believe great beauty services are built upon patient listening, clean hygiene standards, and precision technique tailored to each individual."
            />
          </ScrollReveal>

          <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal delay={0}>
              <div className="bg-white p-8 rounded-sm border border-forest-900/10 shadow-soft h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-900 mb-6">
                    <Scissors size={20} />
                  </div>
                  <h3 className="font-serif text-2xl text-forest-900 font-medium mb-3">
                    Personalized Consultation
                  </h3>
                  <p className="text-xs sm:text-sm text-forest-700/85 leading-relaxed font-sans">
                    Every service begins with an open conversation. We evaluate hair condition, lifestyle routine, face structure, and styling goals before making our recommendations.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-forest-900/5 text-xs text-rose-600 uppercase tracking-widest font-semibold">
                  Tailored To You
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="bg-white p-8 rounded-sm border border-forest-900/10 shadow-soft h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700 mb-6">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="font-serif text-2xl text-forest-900 font-medium mb-3">
                    Hygienic & Thoughtful Environment
                  </h3>
                  <p className="text-xs sm:text-sm text-forest-700/85 leading-relaxed font-sans">
                    We maintain strict sanitization for all hair tools, scissors, and facial equipment. Enjoy an unhurried, comfortable experience in our clean Satara studio.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-forest-900/5 text-xs text-rose-600 uppercase tracking-widest font-semibold">
                  Clean & Calm Studio
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="bg-white p-8 rounded-sm border border-forest-900/10 shadow-soft h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-700 mb-6">
                    <GraduationCap size={20} />
                  </div>
                  <h3 className="font-serif text-2xl text-forest-900 font-medium mb-3">
                    Skill-Building & Education
                  </h3>
                  <p className="text-xs sm:text-sm text-forest-700/85 leading-relaxed font-sans">
                    Through SK Relax Beauty Academy, we are proud to train new stylists in Satara with practical, hands-on masterclasses, providing training mannequins for every participant.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-forest-900/5 text-xs text-rose-600 uppercase tracking-widest font-semibold">
                  Practical Empowerment
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4I. Final Call to Action */}
      <section className="py-12 sm:py-16 bg-forest-900 text-ivory text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold mb-4">
              <Sparkles size={14} />
              <span>Connect With Us</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-light leading-tight">
              Ready for Your <span className="font-serif italic text-gold-300">Next Look?</span>
            </h2>

            <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-ivory-200/90 leading-relaxed font-sans max-w-2xl mx-auto">
              Tell us what you have in mind. Our team will help you explore the right service, appointment slot, or upcoming masterclass batch.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                to="/booking"
                variant="gold"
                size="lg"
                icon={<Calendar size={16} />}
              >
                Book an Appointment
              </Button>

              <Button
                href={buildWhatsAppUrl(WhatsAppMessages.general())}
                external
                variant="outline"
                size="lg"
                className="border-ivory/40 text-ivory hover:text-forest-950 hover:bg-ivory"
                icon={<MessageCircle size={16} className="text-emerald-400" />}
              >
                Chat on WhatsApp
              </Button>
            </div>

            <p className="mt-8 text-xs text-ivory-400">
              Satara, Maharashtra · WhatsApp / Calls: <a href={`tel:${BRAND.whatsappNumber}`} className="text-gold-300 underline font-medium">{BRAND.phone}</a>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 4J. Google Maps Studio Location */}
      <section id="studio-location" className="relative py-12 sm:py-16 bg-luxury-cream text-forest-900 border-t border-forest-900/10 overflow-hidden">
        <LuxuryBotanicalShadow position="bottom-left" opacity={0.20} />
        <LuxuryCurvedLines position="top-right" variant="waves" className="opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <ScrollReveal direction="left">
                <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.25em] text-rose-600">
                  <MapPin size={14} />
                  <span>Visit Our Studio</span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl text-forest-900 font-light">
                  Find Us in <span className="font-serif italic text-rose-600">Satara</span>
                </h3>
                <p className="text-sm text-forest-700 leading-relaxed font-sans">
                  Located in the heart of Satara, Maharashtra. Enjoy sterile hygiene, unhurried personal styling consultations, and comfortable salon amenities.
                </p>
                <div className="pt-2 space-y-2 text-xs sm:text-sm text-forest-800 font-sans border-t border-forest-900/10">
                  <div className="flex justify-between py-1 border-b border-forest-900/5">
                    <span className="font-medium text-forest-900 flex-shrink-0">Studio Address</span>
                    <span className="text-forest-700 text-right text-xs max-w-[240px]">{BRAND.locationName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-forest-900/5">
                    <span className="font-medium text-forest-900">Phone / WhatsApp</span>
                    <span className="text-forest-700">{BRAND.phone}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-medium text-forest-900">Studio Hours</span>
                    <span className="text-forest-700">Mon – Sun: 11:00 AM – 6:00 PM</span>
                  </div>
                </div>
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={BRAND.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-forest-900 text-ivory hover:bg-forest-800 text-xs font-sans font-medium uppercase tracking-wider transition-colors shadow-soft"
                  >
                    <span>Open in Google Maps</span>
                    <Navigation size={12} className="text-gold-400" />
                  </a>
                  <Button to="/contact" variant="outline" size="sm">
                    View Contact Details
                  </Button>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-7">
              <ScrollReveal direction="right">
                <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-sm overflow-hidden border border-forest-900/15 shadow-card bg-cream-200">
                  <iframe
                    title="SK Relax Beauty Academy & Salon Google Maps Satara"
                    src={BRAND.googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal Player */}
      {activeVideo && (
        <VideoPlayerModal
          isOpen={true}
          onClose={() => setActiveVideo(null)}
          videoUrl={activeVideo.url}
          title={activeVideo.title}
          description={activeVideo.description}
          posterImage={activeVideo.posterImage}
          categoryLabel={activeVideo.categoryLabel}
        />
      )}
    </div>
  );
};
