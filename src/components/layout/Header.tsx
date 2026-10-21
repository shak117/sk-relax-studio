import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, Calendar, Phone, ChevronDown } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';
import { Button } from '../ui/Button';
import { MobileDrawer } from './MobileDrawer';
import { BRAND } from '../../data/brandData';
import { trackContactAction } from '../../services/analytics';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const serviceCategories = [
    { id: 'hair-treatments', title: 'Hair Treatments & Science', description: 'Advanced Botox, Nanoplastia & Hair Spa' },
    { id: 'facials-skin', title: 'Facials & Skin Aesthetics', description: 'Hydra facials, derma peels & glow therapy' },
    { id: 'makeup-bridal', title: 'Makeup & Bridal Artistry', description: 'HD bridal transformations & event styling' },
    { id: 'permanent-makeup', title: 'Permanent Makeup (PMU)', description: 'Microblading, lip blush & lash lift' },
    { id: 'equipment-machines', title: 'Aesthetic Machines & Tech', description: 'Certified beauty & aesthetic apparatus' },
  ];

  // Visual style determined by scroll and whether we are on homepage
  const isHeaderTransparent = isHome && !isScrolled;

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isHeaderTransparent
            ? 'bg-forest-950/95 backdrop-blur-md py-3.5 sm:py-4 border-b border-forest-900/60 text-ivory'
            : 'bg-ivory/95 backdrop-blur-md py-3 sm:py-4 shadow-soft border-b border-forest-900/10 text-forest-900'
        }`}
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="flex items-center justify-between gap-3 sm:gap-4 lg:gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <BrandLogo 
                variant={isHeaderTransparent ? 'dark' : 'light'} 
                size="md" 
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-3 xl:gap-4 2xl:gap-6" aria-label="Main Navigation">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-[11px] xl:text-[11.5px] 2xl:text-xs uppercase tracking-[0.14em] xl:tracking-[0.16em] font-sans font-medium transition-all duration-200 relative py-1 whitespace-nowrap hover:text-rose-500 ${
                    isActive
                      ? isHeaderTransparent
                        ? 'text-gold-300 font-semibold'
                        : 'text-forest-900 font-semibold'
                      : isHeaderTransparent
                        ? 'text-ivory-200'
                        : 'text-forest-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Home</span>
                    {isActive && (
                      <span 
                        className={`absolute bottom-0 left-0 w-full h-[1.5px] ${
                          isHeaderTransparent ? 'bg-gold-400' : 'bg-forest-800'
                        }`}
                      />
                    )}
                  </>
                )}
              </NavLink>

              {/* Services Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <NavLink
                  to="/services"
                  className={({ isActive }) =>
                    `text-[11px] xl:text-[11.5px] 2xl:text-xs uppercase tracking-[0.14em] xl:tracking-[0.16em] font-sans font-medium transition-all duration-200 relative py-1 flex items-center gap-1 whitespace-nowrap hover:text-rose-500 ${
                      isActive || location.pathname.startsWith('/services')
                        ? isHeaderTransparent
                          ? 'text-gold-300 font-semibold'
                          : 'text-forest-900 font-semibold'
                        : isHeaderTransparent
                          ? 'text-ivory-200'
                          : 'text-forest-700'
                    }`
                  }
                  aria-expanded={servicesOpen}
                  aria-haspopup="true"
                >
                  <span>Services</span>
                  <ChevronDown size={12} className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
                  {(location.pathname === '/services') && (
                    <span 
                      className={`absolute bottom-0 left-0 w-full h-[1.5px] ${
                        isHeaderTransparent ? 'bg-gold-400' : 'bg-forest-800'
                      }`}
                    />
                  )}
                </NavLink>

                {/* Dropdown Menu Panel */}
                <div
                  className={`absolute top-full left-0 w-72 pt-3 transition-all duration-200 z-50 ${
                    servicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1 pointer-events-none'
                  }`}
                >
                  <div className="bg-ivory border border-forest-900/10 rounded-sm shadow-luxury py-2 text-forest-900 overflow-hidden">
                    <div className="px-4 py-2 border-b border-forest-900/5 bg-cream-100/60">
                      <span className="text-[10px] font-sans font-semibold uppercase tracking-widest text-rose-600 block">
                        Service Specialties
                      </span>
                    </div>
                    {serviceCategories.map((cat) => (
                      <NavLink
                        key={cat.id}
                        to={`/services?cat=${cat.id}`}
                        onClick={() => setServicesOpen(false)}
                        className="block px-4 py-2.5 text-xs font-sans text-forest-800 hover:text-forest-950 hover:bg-cream-100 transition-colors"
                      >
                        <div className="font-medium text-forest-900">{cat.title}</div>
                        <div className="text-[10px] text-forest-600/70 truncate">{cat.description}</div>
                      </NavLink>
                    ))}
                    <div className="pt-1 mt-1 border-t border-forest-900/5 px-4 pb-1">
                      <NavLink
                        to="/services"
                        onClick={() => setServicesOpen(false)}
                        className="text-[11px] font-sans font-semibold text-rose-600 hover:text-rose-700 tracking-wider uppercase inline-block py-1"
                      >
                        Explore Complete Catalogue →
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>

              {/* Batches (Dedicated Course Batches & CMS) */}
              <NavLink
                to="/batches"
                className={({ isActive }) =>
                  `text-[11px] xl:text-[11.5px] 2xl:text-xs uppercase tracking-[0.14em] xl:tracking-[0.16em] font-sans font-medium transition-all duration-200 relative py-1 whitespace-nowrap hover:text-rose-500 ${
                    isActive
                      ? isHeaderTransparent
                        ? 'text-gold-300 font-semibold'
                        : 'text-forest-900 font-semibold'
                      : isHeaderTransparent
                        ? 'text-ivory-200'
                        : 'text-forest-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Batches</span>
                    {isActive && (
                      <span 
                        className={`absolute bottom-0 left-0 w-full h-[1.5px] ${
                          isHeaderTransparent ? 'bg-gold-400' : 'bg-forest-800'
                        }`}
                      />
                    )}
                  </>
                )}
              </NavLink>

              {/* Team */}
              <NavLink
                to="/team"
                className={({ isActive }) =>
                  `text-[11px] xl:text-[11.5px] 2xl:text-xs uppercase tracking-[0.14em] xl:tracking-[0.16em] font-sans font-medium transition-all duration-200 relative py-1 whitespace-nowrap hover:text-rose-500 ${
                    isActive
                      ? isHeaderTransparent
                        ? 'text-gold-300 font-semibold'
                        : 'text-forest-900 font-semibold'
                      : isHeaderTransparent
                        ? 'text-ivory-200'
                        : 'text-forest-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Team</span>
                    {isActive && (
                      <span 
                        className={`absolute bottom-0 left-0 w-full h-[1.5px] ${
                          isHeaderTransparent ? 'bg-gold-400' : 'bg-forest-800'
                        }`}
                      />
                    )}
                  </>
                )}
              </NavLink>

              {/* Events */}
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `text-[11px] xl:text-[11.5px] 2xl:text-xs uppercase tracking-[0.14em] xl:tracking-[0.16em] font-sans font-medium transition-all duration-200 relative py-1 whitespace-nowrap hover:text-rose-500 ${
                    isActive
                      ? isHeaderTransparent
                        ? 'text-gold-300 font-semibold'
                        : 'text-forest-900 font-semibold'
                      : isHeaderTransparent
                        ? 'text-ivory-200'
                        : 'text-forest-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Events</span>
                    {isActive && (
                      <span 
                        className={`absolute bottom-0 left-0 w-full h-[1.5px] ${
                          isHeaderTransparent ? 'bg-gold-400' : 'bg-forest-800'
                        }`}
                      />
                    )}
                  </>
                )}
              </NavLink>

              {/* Student Feedback */}
              <NavLink
                to="/student-feedback"
                className={({ isActive }) =>
                  `text-[11px] xl:text-[11.5px] 2xl:text-xs uppercase tracking-[0.14em] xl:tracking-[0.16em] font-sans font-medium transition-all duration-200 relative py-1 whitespace-nowrap hover:text-rose-500 ${
                    isActive
                      ? isHeaderTransparent
                        ? 'text-gold-300 font-semibold'
                        : 'text-forest-900 font-semibold'
                      : isHeaderTransparent
                        ? 'text-ivory-200'
                        : 'text-forest-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Feedback</span>
                    {isActive && (
                      <span 
                        className={`absolute bottom-0 left-0 w-full h-[1.5px] ${
                          isHeaderTransparent ? 'bg-gold-400' : 'bg-forest-800'
                        }`}
                      />
                    )}
                  </>
                )}
              </NavLink>

              {/* Gallery */}
              <NavLink
                to="/gallery"
                className={({ isActive }) =>
                  `text-[11px] xl:text-[11.5px] 2xl:text-xs uppercase tracking-[0.14em] xl:tracking-[0.16em] font-sans font-medium transition-all duration-200 relative py-1 whitespace-nowrap hover:text-rose-500 ${
                    isActive
                      ? isHeaderTransparent
                        ? 'text-gold-300 font-semibold'
                        : 'text-forest-900 font-semibold'
                      : isHeaderTransparent
                        ? 'text-ivory-200'
                        : 'text-forest-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Gallery</span>
                    {isActive && (
                      <span 
                        className={`absolute bottom-0 left-0 w-full h-[1.5px] ${
                          isHeaderTransparent ? 'bg-gold-400' : 'bg-forest-800'
                        }`}
                      />
                    )}
                  </>
                )}
              </NavLink>

              {/* Contact */}
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `text-[11px] xl:text-[11.5px] 2xl:text-xs uppercase tracking-[0.14em] xl:tracking-[0.16em] font-sans font-medium transition-all duration-200 relative py-1 whitespace-nowrap hover:text-rose-500 ${
                    isActive
                      ? isHeaderTransparent
                        ? 'text-gold-300 font-semibold'
                        : 'text-forest-900 font-semibold'
                      : isHeaderTransparent
                        ? 'text-ivory-200'
                        : 'text-forest-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Contact</span>
                    {isActive && (
                      <span 
                        className={`absolute bottom-0 left-0 w-full h-[1.5px] ${
                          isHeaderTransparent ? 'bg-gold-400' : 'bg-forest-800'
                        }`}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4 2xl:gap-5 flex-shrink-0">
              <a
                href={`tel:${BRAND.whatsappNumber}`}
                onClick={() => trackContactAction({ method: 'phone', touchpoint: 'header_call_link' })}
                className={`text-[11px] xl:text-xs uppercase tracking-widest font-sans font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  isHeaderTransparent ? 'text-ivory-300 hover:text-ivory-100' : 'text-forest-700 hover:text-forest-950'
                }`}
                aria-label={`Call ${BRAND.name}`}
              >
                <Phone size={13} className="text-rose-500 flex-shrink-0" />
                <span>Call Us</span>
              </a>

              <Button
                to="/booking"
                variant={isHeaderTransparent ? 'gold' : 'primary'}
                size="sm"
                className="text-[11px] xl:text-xs py-2 px-3.5 xl:px-4 tracking-wider whitespace-nowrap"
                icon={<Calendar size={13} />}
              >
                Book Appointment
              </Button>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden flex-shrink-0">
              <Button
                to="/booking"
                variant={isHeaderTransparent ? 'gold' : 'primary'}
                size="sm"
                className="text-[11px] px-2.5 py-1 tracking-wider whitespace-nowrap"
              >
                Book
              </Button>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`p-1.5 sm:p-2 rounded-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 flex-shrink-0 ${
                  isHeaderTransparent
                    ? 'text-ivory hover:bg-white/10'
                    : 'text-forest-900 hover:bg-forest-900/5'
                }`}
                aria-label="Open mobile navigation menu"
              >
                <Menu size={22} className="sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};
