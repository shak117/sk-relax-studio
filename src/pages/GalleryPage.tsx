import React from 'react';
import { Camera, Calendar, MessageCircle } from 'lucide-react';
import { BRAND, buildWhatsAppUrl, WhatsAppMessages } from '../data/brandData';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { Button } from '../components/ui/Button';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const GalleryPage: React.FC = () => {
  useDocumentTitle('Studio Portfolio & Gallery', 'Visual portfolio of haircuts, masterclass sessions, bridal styling, and salon ambience at SK Relax Beauty Studio Satara.');

  return (
    <div className="bg-ivory text-forest-900 min-h-screen">
      {/* Gallery Hero */}
      <section className="bg-forest-950 text-ivory py-20 sm:py-24 relative overflow-hidden border-b border-forest-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-gold-500/30 text-gold-300 text-xs font-sans tracking-widest uppercase mb-4">
            <Camera size={14} />
            <span>Visual Portfolio · Satara</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight">
            Artistry in <span className="font-serif italic text-gold-300">Focus</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-ivory-200/85 max-w-2xl mx-auto font-sans leading-relaxed">
            Explore our signature haircuts, hands-on masterclass sessions, bridal looks, and peaceful studio environment in Satara.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
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
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
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
