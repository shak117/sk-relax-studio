import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, Calendar, Phone } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';
import { Button } from '../ui/Button';
import { MobileDrawer } from './MobileDrawer';
import { BRAND } from '../../data/brandData';
import { trackContactAction } from '../../services/analytics';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/academy', label: 'Academy' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
  ];

  // Visual style determined by scroll and whether we are on homepage
  const isHeaderTransparent = isHome && !isScrolled;

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isHeaderTransparent
            ? 'bg-gradient-to-b from-forest-950/80 via-forest-950/40 to-transparent py-4 sm:py-5 text-ivory'
            : 'bg-ivory/95 backdrop-blur-md py-3 sm:py-4 shadow-soft border-b border-forest-900/10 text-forest-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <BrandLogo 
              variant={isHeaderTransparent ? 'dark' : 'light'} 
              size="md" 
            />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `text-xs uppercase tracking-[0.2em] font-sans font-medium transition-all duration-200 relative py-1 hover:text-rose-500 ${
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
                      <span>{item.label}</span>
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
              ))}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href={`tel:${BRAND.whatsappNumber}`}
                onClick={() => trackContactAction({ method: 'phone', touchpoint: 'header_call_link' })}
                className={`text-xs uppercase tracking-widest font-sans font-medium flex items-center gap-1.5 transition-colors ${
                  isHeaderTransparent ? 'text-ivory-300 hover:text-ivory-100' : 'text-forest-700 hover:text-forest-950'
                }`}
                aria-label={`Call ${BRAND.name}`}
              >
                <Phone size={13} className="text-rose-500" />
                <span>Call Us</span>
              </a>

              <Button
                to="/booking"
                variant={isHeaderTransparent ? 'gold' : 'primary'}
                size="sm"
                icon={<Calendar size={13} />}
              >
                Book Appointment
              </Button>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <Button
                to="/booking"
                variant={isHeaderTransparent ? 'gold' : 'primary'}
                size="sm"
                className="text-[10px] px-3 py-1.5"
              >
                Book
              </Button>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`p-2 rounded-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${
                  isHeaderTransparent
                    ? 'text-ivory hover:bg-white/10'
                    : 'text-forest-900 hover:bg-forest-900/5'
                }`}
                aria-label="Open mobile navigation menu"
              >
                <Menu size={24} />
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
