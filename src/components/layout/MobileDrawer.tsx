import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { X, Phone, MessageCircle, Instagram, MapPin, Calendar, ChevronDown } from 'lucide-react';
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

  const serviceCategories = [
    { id: 'hair-treatments', title: 'Hair Treatments & Science' },
    { id: 'facials-skin', title: 'Facials & Skin Aesthetics' },
    { id: 'makeup-bridal', title: 'Makeup & Bridal Artistry' },
    { id: 'permanent-makeup', title: 'Permanent Makeup (PMU)' },
    { id: 'equipment-machines', title: 'Aesthetic Machines & Tech' },
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
        <div className="px-5 py-6 space-y-1 flex-1">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-widest text-rose-500 mb-2 block">
            Navigation Menu
          </span>

          {/* Home */}
          <NavLink
            to="/"
            onClick={onClose}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded text-base font-serif tracking-wide transition-colors ${
                isActive
                  ? 'text-forest-900 font-semibold bg-cream-200/70 border-l-2 border-forest-900'
                  : 'text-forest-700 hover:text-forest-950 hover:bg-cream-100'
              }`
            }
          >
            Home
          </NavLink>

          {/* Services with Accordion */}
          <div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded hover:bg-cream-100 transition-colors">
              <NavLink
                to="/services"
                onClick={onClose}
                className={`text-base font-serif tracking-wide ${
                  location.pathname === '/services' ? 'text-forest-900 font-semibold' : 'text-forest-700'
                }`}
              >
                Services
              </NavLink>
              <button
                type="button"
                onClick={() => setServicesExpanded(!servicesExpanded)}
                className="p-1 text-forest-600 hover:text-forest-900"
                aria-label="Toggle services submenu"
              >
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${servicesExpanded ? 'rotate-180 text-rose-600' : ''}`}
                />
              </button>
            </div>

            {servicesExpanded && (
              <div className="ml-3 pl-3 border-l border-forest-900/15 my-1 space-y-1">
                <NavLink
                  to="/services"
                  onClick={onClose}
                  className="block py-1.5 px-2 text-xs font-sans font-medium text-rose-600 hover:text-rose-700"
                >
                  All Services Catalogue →
                </NavLink>
                {serviceCategories.map((cat) => (
                  <NavLink
                    key={cat.id}
                    to={`/services?cat=${cat.id}`}
                    onClick={onClose}
                    className="block py-1.5 px-2 text-xs font-sans text-forest-700 hover:text-forest-950 hover:bg-cream-100 rounded"
                  >
                    {cat.title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Batches & Masterclass */}
          <NavLink
            to="/batches"
            onClick={onClose}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded text-base font-serif tracking-wide transition-colors ${
                isActive
                  ? 'text-forest-900 font-semibold bg-cream-200/70 border-l-2 border-forest-900'
                  : 'text-forest-700 hover:text-forest-950 hover:bg-cream-100'
              }`
            }
          >
            Course Batches & Masterclasses
          </NavLink>

          {/* Our Team */}
          <NavLink
            to="/team"
            onClick={onClose}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded text-base font-serif tracking-wide transition-colors ${
                isActive
                  ? 'text-forest-900 font-semibold bg-cream-200/70 border-l-2 border-forest-900'
                  : 'text-forest-700 hover:text-forest-950 hover:bg-cream-100'
              }`
            }
          >
            Our Team
          </NavLink>

          {/* Batch Events & Celebrations */}
          <NavLink
            to="/events"
            onClick={onClose}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded text-base font-serif tracking-wide transition-colors ${
                isActive
                  ? 'text-forest-900 font-semibold bg-cream-200/70 border-l-2 border-forest-900'
                  : 'text-forest-700 hover:text-forest-950 hover:bg-cream-100'
              }`
            }
          >
            Batch Events & Workshops
          </NavLink>

          {/* Student Feedback */}
          <NavLink
            to="/student-feedback"
            onClick={onClose}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded text-base font-serif tracking-wide transition-colors ${
                isActive
                  ? 'text-forest-900 font-semibold bg-cream-200/70 border-l-2 border-forest-900'
                  : 'text-forest-700 hover:text-forest-950 hover:bg-cream-100'
              }`
            }
          >
            Student Feedback
          </NavLink>

          {/* Studio Portfolio */}
          <NavLink
            to="/gallery"
            onClick={onClose}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded text-base font-serif tracking-wide transition-colors ${
                isActive
                  ? 'text-forest-900 font-semibold bg-cream-200/70 border-l-2 border-forest-900'
                  : 'text-forest-700 hover:text-forest-950 hover:bg-cream-100'
              }`
            }
          >
            Studio Portfolio
          </NavLink>

          {/* Contact */}
          <NavLink
            to="/contact"
            onClick={onClose}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded text-base font-serif tracking-wide transition-colors ${
                isActive
                  ? 'text-forest-900 font-semibold bg-cream-200/70 border-l-2 border-forest-900'
                  : 'text-forest-700 hover:text-forest-950 hover:bg-cream-100'
              }`
            }
          >
            Contact & Location
          </NavLink>

          <div className="pt-5">
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
              onClick={() => trackContactAction({ method: 'phone', touchpoint: 'mobile_drawer_call' })}
              className="flex items-center gap-1.5 font-medium text-forest-900 hover:text-forest-700"
            >
              <Phone size={14} className="text-forest-600" />
              <span>Call Us</span>
            </a>

            <a
              href={buildWhatsAppUrl(WhatsAppMessages.general())}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('mobile_drawer', 'General Chat')}
              className="flex items-center gap-1.5 font-medium text-forest-900 hover:text-forest-700"
            >
              <MessageCircle size={14} className="text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactAction({ method: 'instagram', touchpoint: 'mobile_drawer_instagram' })}
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
