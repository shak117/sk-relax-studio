import React from 'react';
import { Camera, Calendar, MessageCircle } from 'lucide-react';
import { BRAND, buildWhatsAppUrl, WhatsAppMessages } from '../data/brandData';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { Button } from '../components/ui/Button';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';

export const GalleryPage: React.FC = () => {
  usePageSEO({
    title: 'Salon Gallery | SK Relax Beauty Academy, Satara',
    description: 'Explore salon interiors, hair styling, beauty work, and academy activities at SK Relax, Satara.',
    path: '/gallery',
    schema: [
      generateLocalBusinessSchema(),
      generateBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Gallery', path: '/gallery' }
      ])
    ]
  });

  return (
    <div className="bg-ivory text-forest-900 min-h-screen">
      {/* Gallery Hero */}
      <section className="bg-forest-950 text-ivory py-10 sm:py-14 relative overflow-hidden border-b border-forest-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-gold-500/30 text-gold-300 text-xs font-sans tracking-widest uppercase mb-3">
            <Camera size={14} />
            <span>Visual Portfolio · Satara</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight">
            Artistry in <span className="font-serif italic text-gold-300">Focus</span>
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-ivory-200/85 max-w-2xl mx-auto font-sans leading-relaxed">
            Explore our signature haircuts, hands-on masterclass sessions, bridal looks, and peaceful studio environment in Satara.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              to="/booking"
              variant="gold"
              size="sm"
              icon={<Calendar size={14} />}
            >
              Book an Appointment
            </Button>
            <Button
              href={BRAND.instagramUrl}
              external
              variant="outline"
              size="sm"
              className="border-ivory/30 text-ivory hover:text-forest-950 hover:bg-ivory"
            >
              Follow on Instagram
            </Button>
          </div>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-xs uppercase tracking-widest text-rose-600 font-sans font-semibold mb-2">
              Browse by Collection
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-forest-900 font-light">
              Crafted with Precision & Passion
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-forest-700 font-sans">
              Click on any photograph to view in high definition and enquire about the specific look on WhatsApp.
            </p>
          </div>
        </ScrollReveal>

        {/* Gallery Grid with All Filters and Lightbox */}
        <GalleryGrid showFilters={true} />

        {/* Instagram Inspiration Banner */}
        <div className="mt-20 p-8 sm:p-12 bg-cream-100 rounded-sm border border-forest-900/10 text-center">
          <span className="text-xs font-sans uppercase tracking-widest text-rose-600 font-semibold mb-2 block">
            More Behind The Scenes
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-forest-900 font-normal">
            Follow Our Creative Journey on Instagram
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-forest-700 max-w-xl mx-auto font-sans leading-relaxed">
            See daily client transformations, masterclass batch moments, hair styling tutorials, and salon reels on our official page.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              href={BRAND.instagramUrl}
              external
              variant="primary"
              size="md"
            >
              Follow {BRAND.instagramHandle}
            </Button>
            <Button
              href={buildWhatsAppUrl(WhatsAppMessages.general())}
              external
              variant="whatsapp"
              size="md"
              icon={<MessageCircle size={15} />}
            >
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
