import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X, Phone, MessageCircle, Instagram, MapPin, Calendar } from 'lucide-react';
import { BRAND, buildWhatsAppUrl, WhatsAppMessages } from '../../data/brandData';
import { BrandLogo } from '../ui/BrandLogo';
import { Button } from '../ui/Button';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services Catalogue' },
    { to: '/academy', label: 'Beauty Academy' },
    { to: '/gallery', label: 'Studio Portfolio' },
    { to: '/contact', label: 'Contact & Location' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-forest-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-ivory shadow-luxury flex flex-col justify-between overflow-y-auto border-l border-forest-900/10">
        {/* Drawer Header */}
        <div className="p-6 border-b border-forest-900/10 flex items-center justify-between">
          <BrandLogo size="sm" showSubtitle={false} />
          <button
            onClick={onClose}
            className="p-2 text-forest-800 hover:text-forest-950 hover:bg-forest-900/5 rounded-full transition-colors"
            aria-label="Close navigation menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="px-6 py-6 space-y-1 flex-1">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-widest text-rose-500 mb-2 block">
            Navigation
          </span>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-3 rounded text-base font-serif tracking-wide transition-colors ${
                  isActive
                    ? 'text-forest-900 font-semibold bg-cream-200/70 border-l-2 border-forest-900'
                    : 'text-forest-700 hover:text-forest-950 hover:bg-cream-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="pt-6">
            <Button
              to="/booking"
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={onClose}
              icon={<Calendar size={16} />}
            >
              Book Appointment
            </Button>
          </div>
        </div>

        {/* Quick Contact & Location in Drawer */}
        <div className="p-6 bg-cream-100 border-t border-forest-900/10 space-y-4 text-xs text-forest-700">
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-rose-500 flex-shrink-0" />
            <span>{BRAND.locationName}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-forest-900/10">
            <a
              href={`tel:${BRAND.whatsappNumber}`}
              className="flex items-center gap-1.5 font-medium text-forest-900 hover:text-forest-700"
            >
              <Phone size={14} className="text-forest-600" />
              <span>Call Us</span>
            </a>

            <a
              href={buildWhatsAppUrl(WhatsAppMessages.general())}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-medium text-forest-900 hover:text-forest-700"
            >
              <MessageCircle size={14} className="text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-medium text-forest-900 hover:text-forest-700"
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
