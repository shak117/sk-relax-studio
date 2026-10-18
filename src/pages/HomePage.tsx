import React from 'react';
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
  Navigation
} from 'lucide-react';
import { BRAND, buildWhatsAppUrl, WhatsAppMessages } from '../data/brandData';
import { SERVICES } from '../data/servicesData';
import { COURSES } from '../data/academyData';
import { CinematicScrollHero } from '../components/hero/CinematicScrollHero';
import { ServiceCard } from '../components/services/ServiceCard';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { generateLocalBusinessSchema } from '../utils/schemaGenerator';

export const HomePage: React.FC = () => {
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

  // Select 6 featured catalogue services for homepage
  const featuredServices = SERVICES.slice(0, 6);

  // Masterclass course reference
  const masterclass = COURSES[0];

  return (
    <div className="space-y-0 relative">
      {/* 4B. Cinematic Frame-by-Frame Scroll Animation (720 Combined Frames) */}
      <CinematicScrollHero />

      {/* 4C. Brand Introduction — Editorial Split Layout */}
      <section id="brand-intro" className="py-20 sm:py-28 bg-ivory text-forest-900 border-b border-forest-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <ScrollReveal direction="left">
                <div className="relative">
                  <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-cream-200 shadow-card">
                    <img
                      src="/images/services/hero-back-layer.jpg"
                      alt="SK Relax Hair Artistry Back Layer Silhouette"
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 to-transparent pointer-events-none" />
                  </div>

                  {/* Editorial Floating Card */}
                  <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-6 bg-white p-5 sm:p-6 rounded-sm shadow-elevated border border-forest-900/10 max-w-xs">
                    <span className="text-rose-500 font-serif italic text-lg sm:text-xl block leading-snug">
                      “Learn ♡ Practice ♡ Grow”
                    </span>
                    <p className="mt-2 text-xs text-forest-700 font-sans uppercase tracking-wider">
                      Academy & Salon · Satara
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
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
      <section className="py-20 sm:py-28 bg-cream-50 text-forest-900 border-b border-forest-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Signature Hair Artistry"
              title="Modern Cutting Techniques"
              highlightText="& Layering"
              description="Inspired by our official Hair Cutting Masterclass curriculum. These featured haircuts showcase our signature precision cutting, seamless graduation, and contemporary styling."
            />
          </ScrollReveal>

          {/* 5 Haircuts Showcase */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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

          <p className="mt-8 text-center text-xs text-forest-600 font-sans italic">
            * Technique examples inspired by our masterclass syllabus. Service availability and customization are tailored upon in-studio consultation.
          </p>
        </div>
      </section>

      {/* 4D. Featured Services Catalogue Grid */}
      <section id="services-section" className="py-20 sm:py-28 bg-ivory text-forest-900 border-b border-forest-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.25em] text-rose-600 mb-2">
                <span className="w-6 h-[1px] bg-rose-400"></span>
                <span>Salon Offerings</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forest-900 font-light">
                Curated Studio <span className="font-serif italic text-rose-600">Services</span>
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
                <ServiceCard service={service} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4F. Beauty Academy Feature Banner */}
      <section className="py-20 sm:py-28 bg-forest-950 text-ivory relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-forest-900/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <ScrollReveal direction="left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-gold-500/30 text-gold-300 text-xs font-sans tracking-widest uppercase">
                  <GraduationCap size={14} className="text-gold-400" />
                  <span>SK Relax Beauty Academy · Satara</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-light leading-tight">
                  Transform Your Skills
                  <span className="block font-serif italic text-gold-300">
                    Into Success ♡
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-ivory-200/90 leading-relaxed font-sans max-w-xl">
                  {masterclass.subtitle} — Our hands-on masterclasses are crafted for aspiring hairstylists, salon artists, and cosmetology students who want practical mastery of trending haircuts.
                </p>

                {/* Masterclass Highlight Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-forest-900/80 p-4 rounded-sm border border-forest-800">
                    <p className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-1">Reference Batch</p>
                    <p className="font-serif text-xl text-white">{masterclass.nextBatch}</p>
                    <p className="text-xs text-ivory-300/80 mt-1">Enquire now for the upcoming batch dates</p>
                  </div>

                  <div className="bg-forest-900/80 p-4 rounded-sm border border-forest-800">
                    <p className="text-xs uppercase tracking-wider text-rose-400 font-semibold mb-1">Masterclass Fee</p>
                    <p className="font-serif text-xl text-white">{masterclass.fee}</p>
                    <p className="text-xs text-ivory-300/80 mt-1">Mannequin dummy head provided for practice</p>
                  </div>
                </div>

                {/* Bullet Inclusions */}
                <div className="pt-2">
                  <h4 className="text-xs uppercase tracking-wider text-ivory-300 font-sans font-semibold mb-3">
                    Curriculum Inclusions:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-ivory-200">
                    <span className="flex items-center gap-1.5"><Check size={13} className="text-emerald-400" /> Hair Degree</span>
                    <span className="flex items-center gap-1.5"><Check size={13} className="text-emerald-400" /> Hair Sectioning</span>
                    <span className="flex items-center gap-1.5"><Check size={13} className="text-emerald-400" /> Hair Tools</span>
                    <span className="flex items-center gap-1.5"><Check size={13} className="text-emerald-400" /> Butterfly Cut</span>
                    <span className="flex items-center gap-1.5"><Check size={13} className="text-emerald-400" /> Curtain Bangs</span>
                    <span className="flex items-center gap-1.5"><Check size={13} className="text-emerald-400" /> Dummy Provided</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Button
                    href={buildWhatsAppUrl(WhatsAppMessages.academyEnquiry(masterclass.title, masterclass.nextBatch))}
                    external
                    variant="gold"
                    size="md"
                    icon={<MessageCircle size={15} />}
                  >
                    Enquire Batch on WhatsApp
                  </Button>

                  <Button to="/academy" variant="outline" size="md" className="border-ivory/30 text-ivory hover:text-forest-950 hover:bg-ivory">
                    View Full Academy Syllabus
                  </Button>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Poster / Media Column */}
            <div className="lg:col-span-5">
              <ScrollReveal direction="right">
                <div className="relative max-w-sm mx-auto">
                  <div className="relative rounded-sm overflow-hidden shadow-luxury border-2 border-gold-500/40">
                    <img
                      src="/images/academy/hair-cutting-masterclass-poster.jpg"
                      alt="SK Relax Beauty Academy 3-Day Hair Cutting Masterclass Poster Satara"
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-[11px] text-ivory-400 tracking-wider uppercase font-sans">
                      Official SK Relax Masterclass Reference Poster
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4G. Gallery Preview */}
      <section className="py-20 sm:py-28 bg-ivory text-forest-900 border-b border-forest-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.25em] text-rose-600 mb-2">
                <span className="w-6 h-[1px] bg-rose-400"></span>
                <span>Visual Portfolio</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forest-900 font-light">
                Studio & Masterclass <span className="font-serif italic text-rose-600">Gallery</span>
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
      <section className="py-20 sm:py-28 bg-cream-100 text-forest-900 border-b border-forest-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="The SK Relax Standard"
              title="Dedicated to Thoughtful Care"
              highlightText="& True Craft"
              description="We believe great beauty services are built upon patient listening, clean hygiene standards, and precision technique tailored to each individual."
            />
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
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
      <section className="py-20 sm:py-28 bg-forest-900 text-ivory text-center relative overflow-hidden">
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
      <section className="py-16 sm:py-24 bg-cream-100 text-forest-900 border-t border-forest-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
    </div>
  );
};
