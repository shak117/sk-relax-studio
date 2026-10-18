import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Instagram, MapPin, Clock, ArrowRight } from 'lucide-react';
import { BRAND, buildWhatsAppUrl, WhatsAppMessages } from '../../data/brandData';
import { BrandLogo } from '../ui/BrandLogo';
import { trackContactAction, trackWhatsAppClick } from '../../services/analytics';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest-950 text-ivory-200 border-t border-forest-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-4">
            <BrandLogo variant="dark" size="md" />
            <p className="text-xs sm:text-sm text-ivory-300/80 leading-relaxed font-sans pr-4">
              {BRAND.tagline} Experience bespoke hair artistry, advanced skin treatments, and certified beauty education in the heart of Satara.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContactAction({ method: 'instagram', touchpoint: 'footer_instagram' })}
                className="w-9 h-9 rounded-full bg-forest-900 border border-forest-800 flex items-center justify-center text-ivory-200 hover:text-gold-300 hover:border-gold-500/50 transition-all"
                aria-label="Follow SK Relax on Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href={buildWhatsAppUrl(WhatsAppMessages.general())}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('footer_whatsapp', 'General Inquiry')}
                className="w-9 h-9 rounded-full bg-forest-900 border border-forest-800 flex items-center justify-center text-ivory-200 hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href={`tel:${BRAND.whatsappNumber}`}
                onClick={() => trackContactAction({ method: 'phone', touchpoint: 'footer_call' })}
                className="w-9 h-9 rounded-full bg-forest-900 border border-forest-800 flex items-center justify-center text-ivory-200 hover:text-rose-300 hover:border-rose-500/50 transition-all"
                aria-label="Call salon"
              >
                <Phone size={15} />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="font-serif text-lg text-ivory tracking-wide mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              Studio Navigation
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-sans">
              <li>
                <Link to="/" className="text-ivory-300 hover:text-gold-300 transition-colors inline-flex items-center gap-1.5">
                  <ArrowRight size={12} className="text-forest-600" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-ivory-300 hover:text-gold-300 transition-colors inline-flex items-center gap-1.5">
                  <ArrowRight size={12} className="text-forest-600" />
                  Services Catalogue
                </Link>
              </li>
              <li>
                <Link to="/academy" className="text-ivory-300 hover:text-gold-300 transition-colors inline-flex items-center gap-1.5">
                  <ArrowRight size={12} className="text-forest-600" />
                  Beauty Academy & Masterclass
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-ivory-300 hover:text-gold-300 transition-colors inline-flex items-center gap-1.5">
                  <ArrowRight size={12} className="text-forest-600" />
                  Photo Portfolio
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-ivory-300 hover:text-gold-300 transition-colors inline-flex items-center gap-1.5">
                  <ArrowRight size={12} className="text-forest-600" />
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-ivory-300 hover:text-gold-300 transition-colors inline-flex items-center gap-1.5">
                  <ArrowRight size={12} className="text-forest-600" />
                  Contact & Studio Hours
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured Haircuts & Services */}
          <div>
            <h3 className="font-serif text-lg text-ivory tracking-wide mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
              Signature Artistry
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-sans text-ivory-300">
              <li>
                <Link to="/services?cat=hair" className="hover:text-gold-300 transition-colors">
                  Butterfly Haircut & Dynamic Layers
                </Link>
              </li>
              <li>
                <Link to="/services?cat=hair" className="hover:text-gold-300 transition-colors">
                  Long Layer Haircut & Flowing Texture
                </Link>
              </li>
              <li>
                <Link to="/services?cat=hair" className="hover:text-gold-300 transition-colors">
                  Curtain Bangs & Face Framing
                </Link>
              </li>
              <li>
                <Link to="/academy" className="hover:text-gold-300 transition-colors text-rose-300 font-medium">
                  3-Day Hair Cutting Masterclass
                </Link>
              </li>
              <li>
                <Link to="/services?cat=bridal" className="hover:text-gold-300 transition-colors">
                  Signature Bridal Makeover & Draping
                </Link>
              </li>
              <li>
                <Link to="/services?cat=skin" className="hover:text-gold-300 transition-colors">
                  Luminous Glow Facials
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Hours & Satara Location */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-ivory tracking-wide mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Studio & Contact
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-ivory-300">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-rose-400 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{BRAND.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-gold-400 flex-shrink-0" />
                <a href={`tel:${BRAND.whatsappNumber}`} className="hover:text-gold-300 transition-colors">
                  {BRAND.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle size={15} className="text-emerald-400 flex-shrink-0" />
                <a
                  href={buildWhatsAppUrl(WhatsAppMessages.general())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors"
                >
                  WhatsApp Booking: {BRAND.whatsappNumber}
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-forest-900/80">
              <div className="flex items-center gap-2 text-xs text-gold-300 font-medium mb-1">
                <Clock size={13} />
                <span>Studio Hours</span>
              </div>
              <div className="text-[12px] text-ivory-400 space-y-0.5">
                {BRAND.hours.map((h, i) => (
                  <p key={i}>
                    <strong className="text-ivory-300 font-normal">{h.days}:</strong> {h.time}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-forest-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ivory-400 text-center md:text-left">
          <p>© {currentYear} {BRAND.name}. All rights reserved.</p>
          <p className="text-xs text-ivory-300/90 font-sans tracking-wide">
            Designed & Developed by Cloud Technologies
          </p>
        </div>
      </div>
    </footer>
  );
};
