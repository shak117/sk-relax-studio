import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, MessageCircle, Calendar, Scissors } from 'lucide-react';
import { buildWhatsAppUrl, WhatsAppMessages } from '../data/brandData';
import { SERVICES, SERVICE_CATEGORIES } from '../data/servicesData';
import { salonService } from '../services/salonService';
import { ServiceCard } from '../components/services/ServiceCard';
import { CategoryFilter } from '../components/services/CategoryFilter';
import { VideoPlayerModal } from '../components/ui/VideoPlayerModal';
import { Button } from '../components/ui/Button';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { generateLocalBusinessSchema, generateServicesCatalogSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';
import { trackViewContent, trackWhatsAppClick } from '../services/analytics';
import { ServiceCategory, ServiceItem } from '../types';

export const ServicesPage: React.FC = () => {
  usePageSEO({
    title: 'Salon Services Catalogue | SK Relax Beauty Academy & Salon, Satara',
    description: 'Explore our complete salon catalogue in Satara: Hair treatments, 7-in-1 Hydra facials, bridal couture, PMU microblading, and machine aesthetics.',
    path: '/services',
    schema: [
      generateLocalBusinessSchema(),
      generateServicesCatalogSchema(),
      generateBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' }
      ])
    ]
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('cat') as ServiceCategory) || 'all';
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>(initialCategory);

  const [activeVideo, setActiveVideo] = useState<{
    url: string;
    title: string;
    description?: string;
    categoryLabel?: string;
  } | null>(null);

  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const cat = searchParams.get('cat') as ServiceCategory;
    if (cat && (cat === 'all' || SERVICE_CATEGORIES.some(c => c.id === cat))) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    trackViewContent({
      content_name: activeCategory === 'all' ? 'All Salon Services' : `Services Category: ${activeCategory}`,
      content_category: 'Salon Services Catalogue'
    });
  }, [activeCategory]);

  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES);

  useEffect(() => {
    let isMounted = true;
    salonService
      .getPublishedServices()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setServicesList(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategorySelect = (category: ServiceCategory) => {
    setActiveCategory(category);
    if (category === 'all') {
      searchParams.delete('cat');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ cat: category }, { replace: true });
    }
  };

  const filteredServices = servicesList.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  const videoServices = [
    ...servicesList.filter(s => s.id === 'hydra-facial-machine-7-in-1'),
    ...servicesList.filter(s => !!s.videoUrl && s.id !== 'hydra-facial-machine-7-in-1')
  ];

  interface PortfolioGuideItem {
    title: string;
    image?: string;
    imagePosition?: string;
    alt?: string;
    category: ServiceCategory;
    desc: string;
  }

  const brochures: PortfolioGuideItem[] = [
    {
      title: 'Facial & Skin Treatments',
      image: '/images/treatments/facial-machine-treatment.jpg',
      imagePosition: 'center top',
      alt: 'SK Relax aesthetician in uniform and blue gloves performing advanced facial treatment with machine in studio',
      category: 'facials-skin',
      desc: 'Hydra facial, Korean glass skin, BB Glow, Medi-facial, and crystal polishing'
    },
    {
      title: 'Aesthetic Machine Tech',
      image: '/images/machines/hydra-facial-machine.jpg',
      imagePosition: 'center 65%',
      alt: 'Professional 7-in-1 Hydra facial and clinical aesthetic machine station at SK Relax Studio',
      category: 'equipment-machines',
      desc: '7-in-1 Hydra station, Derma Pen, OxyGeneo, microdermabrasion, and LED phototherapy'
    },
    {
      title: 'Makeup & Bridal Artistry',
      image: '/images/gallery/traditional-silk-bridal-couture.jpg',
      imagePosition: 'center top',
      alt: 'Traditional silk bridal saree draping and bridal makeup artistry by SK Relax Satara',
      category: 'makeup-bridal',
      desc: 'HD 3D makeup, waterproof bases, 5 saree drapes, and 3 bridal hairstyles'
    },
    {
      title: 'Permanent Makeup (PMU)',
      image: '/images/gallery/pmu-eyebrow-result.jpg',
      imagePosition: 'center center',
      alt: 'Permanent eyebrow microblading and shaping result at SK Relax Studio',
      category: 'permanent-makeup',
      desc: 'Microblading, powder brows, lip blush, neutralization, and scalp micropigmentation'
    }
  ];

  return (
    <div className="bg-ivory text-forest-900 min-h-screen">
      {/* Refined Page Hero */}
      <section className="bg-forest-950 text-ivory py-10 sm:py-14 relative overflow-hidden border-b border-forest-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-gold-500/30 text-gold-300 text-xs font-sans tracking-widest uppercase mb-3">
            <Sparkles size={13} />
            <span>Catalogue of Studio Care · Satara</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight">
            Our Salon <span className="font-serif italic text-gold-300">Services</span>
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-ivory-200/85 max-w-2xl mx-auto font-sans leading-relaxed">
            From precision butterfly layers to 7-in-1 clinical hydra facials, bridal couture, PMU microblading, and aesthetic equipment training in Satara.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Button to="/booking" variant="gold" size="sm" icon={<Calendar size={14} />}>
              Book An Appointment
            </Button>
            <Button
              href={buildWhatsAppUrl(WhatsAppMessages.general())}
              external
              variant="outline"
              size="sm"
              className="border-ivory/30 text-ivory hover:text-forest-950 hover:bg-ivory"
              icon={<MessageCircle size={14} />}
            >
              Consultation on WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Services Catalogue Body */}
      <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filters */}
        <div className="mb-8">
          <CategoryFilter
            categories={SERVICE_CATEGORIES}
            activeCategory={activeCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {/* Note on Catalogue */}
        <div className="mb-8 p-4 bg-cream-100 rounded-sm border border-forest-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-forest-700">
          <div className="flex items-center gap-2">
            <Scissors size={15} className="text-rose-600 flex-shrink-0" />
            <span>
              Showing <strong>{filteredServices.length}</strong> {filteredServices.length === 1 ? 'service' : 'services'}. Specific slots and pricing confirmed via direct WhatsApp consultation.
            </span>
          </div>
          <a
            href={buildWhatsAppUrl(WhatsAppMessages.general())}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-800 font-semibold underline underline-offset-2 flex items-center gap-1 hover:text-emerald-950 whitespace-nowrap"
          >
            <MessageCircle size={13} />
            Ask about customized packages
          </a>
        </div>

        {/* Services Showcase: Responsive Layout (Centered Spotlight for Single Service, Grid for Multiple) */}
        {filteredServices.length === 1 ? (
          <div className="max-w-xl mx-auto w-full">
            <ScrollReveal>
              <ServiceCard 
                service={filteredServices[0]} 
                featured={true}
                onWatchVideo={(s) => {
                  if (s.videoUrl) {
                    setActiveVideo({
                      url: s.videoUrl,
                      title: s.title,
                      description: s.description,
                      categoryLabel: s.categoryLabel
                    });
                  }
                }}
              />
            </ScrollReveal>
          </div>
        ) : filteredServices.length === 2 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {filteredServices.map((service, idx) => (
              <ScrollReveal key={service.id} delay={idx * 40}>
                <ServiceCard 
                  service={service} 
                  onWatchVideo={(s) => {
                    if (s.videoUrl) {
                      setActiveVideo({
                        url: s.videoUrl,
                        title: s.title,
                        description: s.description,
                        categoryLabel: s.categoryLabel
                      });
                    }
                  }}
                />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, idx) => (
              <ScrollReveal key={service.id} delay={idx * 40}>
                <ServiceCard 
                  service={service} 
                  onWatchVideo={(s) => {
                    if (s.videoUrl) {
                      setActiveVideo({
                        url: s.videoUrl,
                        title: s.title,
                        description: s.description,
                        categoryLabel: s.categoryLabel
                      });
                    }
                  }}
                />
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Featured Video Treatment Strip */}
        <div className="mt-16 pt-12 border-t border-forest-900/10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-rose-600 font-sans font-semibold mb-1.5 block">
              Watch Real Salon Artistry
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-forest-900 font-normal">
              Treatment & Technique Video Highlights
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-forest-700 font-sans">
              Click any video to watch our stylists and aesthetic equipment in action at SK Relax Satara.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videoServices.slice(0, 3).map((item) => (
              <ServiceCard
                key={item.id}
                service={item}
                featured={item.id === 'hydra-facial-machine-7-in-1'}
                onWatchVideo={(s) => {
                  if (s.videoUrl) {
                    setActiveVideo({
                      url: s.videoUrl,
                      title: s.title,
                      description: s.description,
                      categoryLabel: s.categoryLabel
                    });
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Brochure & Course Syllabus Strip */}
        <div className="mt-16 pt-12 border-t border-forest-900/10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-rose-600 font-sans font-semibold mb-1.5 block">
              Official Reference Guides
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-forest-900 font-normal">
              Treatment & Syllabus Portfolio
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-forest-700 font-sans">
              Explore our core treatment specialisations and academy curriculum portfolios at SK Relax Satara.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-stretch">
            {brochures.map((b, idx) => {
              const hasImage = Boolean(b.image && b.image.trim() !== '' && !failedImages[idx]);

              return (
                <div 
                  key={idx}
                  onClick={() => handleCategorySelect(b.category)}
                  className="bg-white rounded-sm border border-forest-900/10 shadow-soft overflow-hidden group cursor-pointer hover:border-gold-500/50 hover:shadow-card transition-all duration-300 flex flex-col justify-between h-full"
                >
                  {hasImage ? (
                    <>
                      {/* Image Thumbnail with Category Badge */}
                      <div className="aspect-[3/4] bg-cream-100 overflow-hidden relative">
                        <img
                          src={b.image}
                          alt={b.alt || b.title}
                          style={b.imagePosition ? { objectPosition: b.imagePosition } : undefined}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={() => setFailedImages(prev => ({ ...prev, [idx]: true }))}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="absolute top-2 left-2 text-[10px] font-sans uppercase tracking-wider bg-forest-950/90 text-gold-300 px-2.5 py-1 rounded-sm backdrop-blur-xs shadow-xs border border-gold-500/20 font-medium">
                          {b.title}
                        </span>
                      </div>
                      
                      {/* Description & Action Footer */}
                      <div className="p-3.5 bg-cream-50/80 border-t border-forest-900/5 flex flex-col justify-between flex-1">
                        <p className="text-[11px] sm:text-xs text-forest-700 leading-relaxed font-sans line-clamp-3">
                          {b.desc}
                        </p>
                        <div className="mt-2.5 pt-2 border-t border-forest-900/5 flex items-center justify-between text-[10px] font-sans text-gold-600 font-medium group-hover:text-forest-900 transition-colors">
                          <span>View Services</span>
                          <span className="transition-transform group-hover:translate-x-0.5">→</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Clean intentional text-only card if no suitable image exists */
                    <div className="p-5 sm:p-6 flex flex-col justify-between h-full bg-cream-50/50 relative">
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-forest-950/90 text-gold-300 text-[10px] font-sans uppercase tracking-wider border border-gold-500/20 font-medium">
                          <Sparkles size={11} className="text-gold-400" />
                          <span>Curriculum Portfolio</span>
                        </div>
                        <h3 className="font-serif text-lg sm:text-xl text-forest-900 font-normal leading-snug group-hover:text-gold-600 transition-colors">
                          {b.title}
                        </h3>
                        <div className="w-8 h-0.5 bg-gold-400/60" />
                        <p className="text-xs sm:text-sm text-forest-700 leading-relaxed font-sans">
                          {b.desc}
                        </p>
                      </div>

                      <div className="mt-6 pt-3 border-t border-forest-900/10 flex items-center justify-between text-xs font-sans text-gold-600 font-medium group-hover:text-forest-900 transition-colors">
                        <span>Browse Catalogue</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bridal Package Consultation Callout */}
        <div className="mt-16 p-8 sm:p-12 bg-white rounded-sm border border-forest-900/10 shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-2">
            <span className="text-xs uppercase tracking-widest text-rose-600 font-sans font-semibold">
              Bespoke Matrimonial Artistry
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-forest-900 font-normal">
              Planning Your Wedding in Satara?
            </h3>
            <p className="text-xs sm:text-sm text-forest-700 leading-relaxed font-sans">
              Request a customized bridal makeup, saree draping, and pre-wedding facial consultation with Salma Attar. We tailor every package around your wedding events and preferences.
            </p>
          </div>

          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button
              href={buildWhatsAppUrl("Hello SK Relax Beauty Academy & Salon, Satara. I would like to request a customized Bridal Package consultation and pricing. Please share available dates.")}
              external
              variant="gold"
              size="md"
              icon={<MessageCircle size={15} />}
              onClick={() => trackWhatsAppClick('bridal_package_cta', 'Bridal Package Request')}
            >
              Request a Bridal Package
            </Button>
            <Button to="/booking" variant="outline" size="md">
              Book Appointment
            </Button>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <VideoPlayerModal
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
          videoUrl={activeVideo.url}
          title={activeVideo.title}
          description={activeVideo.description}
          categoryLabel={activeVideo.categoryLabel}
        />
      )}
    </div>
  );
};
