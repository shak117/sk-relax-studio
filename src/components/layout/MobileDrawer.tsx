import React, { useEffect, useState, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { X, Phone, MessageCircle, Instagram, MapPin, Calendar, ChevronDown, Sparkles } from 'lucide-react';
import { BRAND, buildWhatsAppUrl, WhatsAppMessages } from '../../data/brandData';
import { BrandLogo } from '../ui/BrandLogo';
import { Button } from '../ui/Button';
import { trackContactAction, trackWhatsAppClick } from '../../services/analytics';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Robust Mobile Scroll Locking for iOS Safari & Android
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      document.body.classList.add('mobile-drawer-open');
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      // Keyboard support: Escape key closes menu
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.classList.remove('mobile-drawer-open');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, onClose]);

  // Hash navigation helper for on-page sections (Before & After, Our Results)
  const handleHashNavigate = useCallback((hash: string) => {
    onClose();
    if (location.pathname === '/') {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      navigate(`/#${hash}`);
    }
  }, [location.pathname, navigate, onClose]);

  if (!isOpen) return null;

  const serviceCategories = [
    { id: 'hair-treatments', title: 'Hair Treatments & Science' },
    { id: 'facials-skin', title: 'Facials & Skin Aesthetics' },
    { id: 'makeup-bridal', title: 'Makeup & Bridal Artistry' },
    { id: 'permanent-makeup', title: 'Permanent Makeup (PMU)' },
    { id: 'equipment-machines', title: 'Aesthetic Machines & Tech' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 lg:hidden overflow-hidden" 
      role="dialog" 
      aria-modal="true" 
      aria-label="SK Relax Mobile Navigation"
    >
      {/* Dimmed Backdrop with Blur — Clicking outside closes drawer */}
      <div 
        className="fixed inset-0 bg-forest-950/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Full-Height Navigation Panel */}
      <div 
        className="fixed inset-y-0 right-0 max-w-sm w-full bg-ivory shadow-luxury flex flex-col justify-between overflow-y-auto overscroll-contain border-l border-forest-900/15 animate-fade-in"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Drawer Header with Close Button */}
        <div className="p-5 sm:p-6 border-b border-forest-900/10 flex items-center justify-between bg-cream-50/80 sticky top-0 z-10 backdrop-blur-md">
          <BrandLogo size="sm" showSubtitle={false} />
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 text-forest-800 hover:text-forest-950 hover:bg-forest-900/10 rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
            aria-label="Close navigation menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation Links — Strictly Matching Requested 7 Items + Prominent Booking CTA */}
        <div className="px-5 py-5 sm:py-6 space-y-1.5 flex-1">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-rose-600 mb-3 block">
            Navigation Menu
          </span>

          {/* 1. Home */}
          <NavLink
            to="/"
            onClick={onClose}
            className={({ isActive }) =>
              `block px-3.5 py-3 rounded-sm text-base font-serif tracking-wide transition-colors ${
                isActive && location.hash === ''
                  ? 'text-forest-900 font-semibold bg-cream-200/80 border-l-3 border-forest-900'
                  : 'text-forest-800 hover:text-forest-950 hover:bg-cream-100'
              }`
            }
          >
            Home
          </NavLink>

          {/* 2. About SK Relax */}
          <NavLink
            to="/team"
            onClick={onClose}
            className={({ isActive }) =>
              `block px-3.5 py-3 rounded-sm text-base font-serif tracking-wide transition-colors ${
                isActive
                  ? 'text-forest-900 font-semibold bg-cream-200/80 border-l-3 border-forest-900'
                  : 'text-forest-800 hover:text-forest-950 hover:bg-cream-100'
              }`
            }
          >
            About SK Relax
          </NavLink>

          {/* 3. Services with Submenu Accordion */}
          <div>
            <div className="flex items-center justify-between px-3.5 py-3 rounded-sm hover:bg-cream-100 transition-colors">
              <NavLink
                to="/services"
                onClick={onClose}
                className={`text-base font-serif tracking-wide flex-1 ${
                  location.pathname === '/services' ? 'text-forest-900 font-semibold' : 'text-forest-800'
                }`}
              >
                Services
              </NavLink>
              <button
                type="button"
                onClick={() => setServicesExpanded(!servicesExpanded)}
                className="p-1.5 text-forest-600 hover:text-forest-900 focus:outline-none"
                aria-label="Toggle services submenu"
              >
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${servicesExpanded ? 'rotate-180 text-rose-600' : ''}`}
                />
              </button>
            </div>

            {servicesExpanded && (
              <div className="ml-4 pl-3 border-l-2 border-forest-900/15 my-1.5 space-y-1">
                <NavLink
                  to="/services"
                  onClick={onClose}
                  className="block py-2 px-2.5 text-xs font-sans font-semibold text-rose-600 hover:text-rose-700 uppercase tracking-wider"
                >
                  All Services Catalogue →
                </NavLink>
                {serviceCategories.map((cat) => (
                  <NavLink
                    key={cat.id}
                    to={`/services?cat=${cat.id}`}
                    onClick={onClose}
                    className="block py-1.5 px-2.5 text-xs font-sans text-forest-700 hover:text-forest-950 hover:bg-cream-100 rounded-sm"
                  >
                    {cat.title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* 4. Gallery */}
          <NavLink
            to="/gallery"
            onClick={onClose}
            className={({ isActive }) =>
              `block px-3.5 py-3 rounded-sm text-base font-serif tracking-wide transition-colors ${
                isActive
                  ? 'text-forest-900 font-semibold bg-cream-200/80 border-l-3 border-forest-900'
                  : 'text-forest-800 hover:text-forest-950 hover:bg-cream-100'
              }`
            }
          >
            Gallery
          </NavLink>

          {/* 5. Before & After */}
          <button
            type="button"
            onClick={() => handleHashNavigate('transformations')}
            className={`w-full text-left px-3.5 py-3 rounded-sm text-base font-serif tracking-wide transition-colors flex items-center justify-between ${
              location.hash === '#transformations'
                ? 'text-forest-900 font-semibold bg-cream-200/80 border-l-3 border-forest-900'
                : 'text-forest-800 hover:text-forest-950 hover:bg-cream-100'
            }`}
          >
            <span>Before & After</span>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-sm border border-rose-200">
              Transformations
            </span>
          </button>

          {/* 6. Our Results */}
          <button
            type="button"
            onClick={() => handleHashNavigate('results')}
            className={`w-full text-left px-3.5 py-3 rounded-sm text-base font-serif tracking-wide transition-colors flex items-center justify-between ${
              location.hash === '#results'
                ? 'text-forest-900 font-semibold bg-cream-200/80 border-l-3 border-forest-900'
                : 'text-forest-800 hover:text-forest-950 hover:bg-cream-100'
            }`}
          >
            <span>Our Results</span>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-gold-700 bg-gold-50 px-2 py-0.5 rounded-sm border border-gold-200">
              Verified
            </span>
          </button>

          {/* 7. Contact */}
          <NavLink
            to="/contact"
            onClick={onClose}
            className={({ isActive }) =>
              `block px-3.5 py-3 rounded-sm text-base font-serif tracking-wide transition-colors ${
                isActive
                  ? 'text-forest-900 font-semibold bg-cream-200/80 border-l-3 border-forest-900'
                  : 'text-forest-800 hover:text-forest-950 hover:bg-cream-100'
              }`
            }
          >
            Contact
          </NavLink>

          {/* Academy & Masterclasses Quick Link */}
          <div className="pt-2">
            <NavLink
              to="/batches"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-sm bg-forest-950 text-gold-300 hover:text-gold-200 text-xs font-sans font-semibold uppercase tracking-wider transition-colors border border-gold-500/30"
            >
              <span>Academy Masterclasses</span>
              <Sparkles size={13} className="text-gold-400" />
            </NavLink>
          </div>

          {/* Prominently Visible Book Appointment CTA Button */}
          <div className="pt-4">
            <Button
              to="/booking"
              variant="primary"
              size="lg"
              className="w-full justify-center shadow-luxury py-3.5 text-xs uppercase tracking-widest font-semibold"
              onClick={onClose}
              icon={<Calendar size={16} />}
            >
              Book Appointment
            </Button>
          </div>
        </div>

        {/* Quick Contact & Location in Drawer Footer */}
        <div className="p-5 sm:p-6 bg-cream-100/90 border-t border-forest-900/10 space-y-3.5 text-xs text-forest-800">
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-rose-500 flex-shrink-0" />
            <span className="text-[11px] leading-tight text-forest-700">{BRAND.locationName}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-forest-900/10">
            <a
              href={`tel:${BRAND.whatsappNumber}`}
              onClick={() => trackContactAction({ method: 'phone', touchpoint: 'mobile_drawer_call' })}
              className="flex items-center gap-1.5 font-medium text-forest-900 hover:text-forest-700 py-1"
            >
              <Phone size={14} className="text-forest-600" />
              <span>Call Us</span>
            </a>

            <a
              href={buildWhatsAppUrl(WhatsAppMessages.general())}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('mobile_drawer', 'General Chat')}
              className="flex items-center gap-1.5 font-medium text-forest-900 hover:text-forest-700 py-1"
            >
              <MessageCircle size={14} className="text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactAction({ method: 'instagram', touchpoint: 'mobile_drawer_instagram' })}
              className="flex items-center gap-1.5 font-medium text-forest-900 hover:text-forest-700 py-1"
            >
              <Instagram size={14} className="text-rose-600" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};