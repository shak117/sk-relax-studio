import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, MessageCircle, Calendar, Scissors } from 'lucide-react';
import { buildWhatsAppUrl, WhatsAppMessages } from '../data/brandData';
import { SERVICES, SERVICE_CATEGORIES } from '../data/servicesData';
import { ServiceCard } from '../components/services/ServiceCard';
import { CategoryFilter } from '../components/services/CategoryFilter';
import { Button } from '../components/ui/Button';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { generateLocalBusinessSchema, generateServicesCatalogSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';
import { trackViewContent } from '../services/analytics';
import { ServiceCategory } from '../types';

export const ServicesPage: React.FC = () => {
  usePageSEO({
    title: 'Salon Services in Satara | SK Relax',
    description: 'Explore available beauty and salon services at SK Relax in Satara and enquire directly through WhatsApp.',
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

  useEffect(() => {
    const cat = searchParams.get('cat') as ServiceCategory;
    if (cat && SERVICE_CATEGORIES.some(c => c.id === cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    trackViewContent({
      content_name: activeCategory === 'all' ? 'All Salon Services' : `Services Category: ${activeCategory}`,
      content_category: 'Salon Services Catalogue'
    });
  }, [activeCategory]);

  const handleCategorySelect = (category: ServiceCategory) => {
    setActiveCategory(category);
    if (category === 'all') {
      searchParams.delete('cat');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ cat: category }, { replace: true });
    }
  };

  const filteredServices = SERVICES.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  return (
    <div className="bg-ivory text-forest-900 min-h-screen">
      {/* Refined Page Hero */}
      <section className="bg-forest-950 text-ivory py-20 sm:py-24 relative overflow-hidden border-b border-forest-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-gold-500/30 text-gold-300 text-xs font-sans tracking-widest uppercase mb-4">
            <Sparkles size={13} />
            <span>Catalogue of Studio Care · Satara</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight">
            Our Salon <span className="font-serif italic text-gold-300">Services</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-ivory-200/85 max-w-2xl mx-auto font-sans leading-relaxed">
            From precision butterfly layers to restorative facial treatments and signature bridal styling, explore our proposed catalogue below.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
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
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filters */}
        <div className="mb-12">
          <CategoryFilter
            categories={SERVICE_CATEGORIES}
            activeCategory={activeCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {/* Note on Proposed Catalogue */}
        <div className="mb-8 p-4 bg-cream-100 rounded-sm border border-forest-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-forest-700">
          <div className="flex items-center gap-2">
            <Scissors size={15} className="text-rose-600 flex-shrink-0" />
            <span>
              Showing <strong>{filteredServices.length}</strong> services. Specific prices and appointment slots are confirmed upon WhatsApp enquiry.
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, idx) => (
            <ScrollReveal key={service.id} delay={idx * 60}>
              <ServiceCard service={service} />
            </ScrollReveal>
          ))}
        </div>

        {/* Consultation Callout Banner */}
        <div className="mt-20 p-8 sm:p-12 bg-white rounded-sm border border-forest-900/10 shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-sans uppercase tracking-widest text-rose-600 font-semibold mb-2 block">
              Personalized Consultation
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-forest-900 font-normal">
              Not sure which treatment or haircut suits you best?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-forest-700/80 leading-relaxed font-sans">
              Send us a photo of your current hair or desired inspiration on WhatsApp. Our styling team in Satara will gladly guide you before your appointment.
            </p>
          </div>

          <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Button
              href={buildWhatsAppUrl("Hello SK Relax Salon, I would like a personalized hair/skin consultation. Can I share my hair photo and get your recommendation?")}
              external
              variant="whatsapp"
              size="md"
              className="w-full sm:w-auto justify-center"
              icon={<MessageCircle size={15} />}
            >
              Get Style Consultation
            </Button>
            <Button
              to="/booking"
              variant="outline"
              size="md"
              className="w-full sm:w-auto justify-center"
            >
              Book Studio Slot
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
