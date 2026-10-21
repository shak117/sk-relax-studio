import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Instagram, Facebook, MapPin, Clock, ArrowRight } from 'lucide-react';
import { BRAND, buildWhatsAppUrl, WhatsAppMessages } from '../../data/brandData';
import { BrandLogo } from '../ui/BrandLogo';
import { trackContactAction, trackWhatsAppClick } from '../../services/analytics';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-950 text-ivory-200 border-t border-forest-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1 — Brand */}
          <div className="space-y-4">
            <BrandLogo variant="dark" size="md" />
            <p className="text-xs sm:text-sm text-ivory-300/80 leading-relaxed font-sans pr-4">
              Your Beauty, Your Signature. Experience bespoke hair artistry, advanced skin treatments, and professional beauty education in Satara.
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
                href={BRAND.facebookUrl || "https://www.facebook.com/search/top?q=SK%20Relax%20Beauty%20Academy%20Salon%20Satara"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContactAction({ method: 'facebook', touchpoint: 'footer_facebook' })}
                className="w-9 h-9 rounded-full bg-forest-900 border border-forest-800 flex items-center justify-center text-ivory-200 hover:text-gold-300 hover:border-gold-500/50 transition-all"
                aria-label="Follow SK Relax on Facebook"
              >
                <Facebook size={16} />
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
                aria-label="Call salon telephone"
              >
                <Phone size={15} />
              </a>
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="font-serif text-lg text-ivory tracking-wide mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              Quick Links
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
                <Link to="/batches" className="text-ivory-300 hover:text-gold-300 transition-colors inline-flex items-center gap-1.5">
                  <ArrowRight size={12} className="text-forest-600" />
                  Upcoming Batches
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-ivory-300 hover:text-gold-300 transition-colors inline-flex items-center gap-1.5">
                  <ArrowRight size={12} className="text-forest-600" />
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-ivory-300 hover:text-gold-300 transition-colors inline-flex items-center gap-1.5">
                  <ArrowRight size={12} className="text-forest-600" />
                  Events & Workshops
                </Link>
              </li>
              <li>
                <Link to="/student-feedback" className="text-ivory-300 hover:text-gold-300 transition-colors inline-flex items-center gap-1.5">
                  <ArrowRight size={12} className="text-forest-600" />
                  Student Feedback
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-ivory-300 hover:text-gold-300 transition-colors inline-flex items-center gap-1.5">
                  <ArrowRight size={12} className="text-forest-600" />
                  Gallery
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

          {/* Column 3 — Signature Services */}
          <div>
            <h3 className="font-serif text-lg text-ivory tracking-wide mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
              Signature Services
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-sans text-ivory-300">
              <li>
                <Link to="/services?cat=hair-treatments" className="hover:text-gold-300 transition-colors block">
                  Hair Botox & Nanoplastia
                </Link>
              </li>
              <li>
                <Link to="/services?cat=facials-skin" className="hover:text-gold-300 transition-colors block">
                  Hydra Facial & Derma Glow Peels
                </Link>
              </li>
              <li>
                <Link to="/services?cat=makeup-bridal" className="hover:text-gold-300 transition-colors block">
                  Bridal Makeup & Draping
                </Link>
              </li>
              <li>
                <Link to="/services?cat=permanent-makeup" className="hover:text-gold-300 transition-colors block">
                  Permanent Makeup (PMU) & Microblading
                </Link>
              </li>
              <li>
                <Link to="/services?cat=equipment-machines" className="hover:text-gold-300 transition-colors block">
                  Aesthetic Machines & Technology
                </Link>
              </li>
              <li>
                <Link to="/batches" className="hover:text-gold-300 transition-colors text-rose-300 font-medium block">
                  Upcoming Courses & Masterclasses
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 — Studio & Contact */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-ivory tracking-wide mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Studio & Contact
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-ivory-300">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-rose-400 mt-0.5 flex-shrink-0" />
                <div>
                  <a
                    href={BRAND.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackContactAction({ method: 'map', touchpoint: 'footer_address' })}
                    className="leading-relaxed block text-ivory-300 hover:text-gold-300 transition-colors"
                    title="Open in Google Maps"
                  >
                    6, Rajwada Cir, near IDBI Bank, Pratapganj Peth, Shaniwar Peth, Malhar Peth, Satara, Maharashtra 415002, India
                  </a>
                  <a
                    href={BRAND.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackContactAction({ method: 'map', touchpoint: 'footer_map' })}
                    className="inline-flex items-center gap-1 text-[11px] text-gold-400 hover:text-gold-300 transition-colors mt-1.5 font-medium underline underline-offset-2"
                  >
                    Get Directions on Google Maps ↗
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-gold-400 flex-shrink-0" />
                <a
                  href={`tel:${BRAND.whatsappNumber}`}
                  onClick={() => trackContactAction({ method: 'phone', touchpoint: 'footer_phone_text' })}
                  className="hover:text-gold-300 transition-colors"
                >
                  +91 8459890270
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle size={15} className="text-emerald-400 flex-shrink-0" />
                <a
                  href={buildWhatsAppUrl(WhatsAppMessages.general())}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick('footer_whatsapp_booking', 'Footer Booking')}
                  className="hover:text-emerald-300 transition-colors"
                >
                  WhatsApp Booking: +91 8459890270
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-forest-900/80">
              <div className="flex items-center gap-2 text-xs text-gold-300 font-medium mb-1">
                <Clock size={13} />
                <span>Studio Hours</span>
              </div>
              <div className="text-[12px] text-ivory-400 space-y-0.5">
                <p>
                  <strong className="text-ivory-300 font-normal">Monday – Sunday:</strong> 11:00 AM – 6:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Clean Two-Sided Layout with Compact Lower Row */}
        <div className="pt-8 border-t border-forest-900/90 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            {/* Left side: Developer Credit */}
            <div className="text-center sm:text-left font-sans font-medium text-ivory-300">
              Designed & Developed by Cloud Technologies
            </div>

            {/* Right side: Salon Identity */}
            <div className="text-center sm:text-right font-serif tracking-wide text-ivory-200">
              SK Relax Beauty Academy & Salon
            </div>
          </div>

          {/* Lower compact row: Copyright Notice */}
          <div className="pt-1 text-center text-[11px] sm:text-xs text-ivory-400 font-sans tracking-wide">
            © 2026 SK RELAX BEAUTY ACADEMY & SALON. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
