import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'cream';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  size = 'md',
  showSubtitle = true,
  className = ''
}) => {
  const isDark = variant === 'dark';

  const headingSizes = {
    sm: 'text-base sm:text-lg tracking-[0.16em]',
    md: 'text-lg sm:text-xl lg:text-2xl tracking-[0.14em] sm:tracking-[0.16em]',
    lg: 'text-2xl sm:text-3xl lg:text-4xl tracking-[0.16em] sm:tracking-[0.2em]'
  };

  const subtitleSizes = {
    sm: 'text-[8px] sm:text-[9px] tracking-[0.16em]',
    md: 'text-[8.5px] sm:text-[9.5px] tracking-[0.16em] sm:tracking-[0.2em]',
    lg: 'text-[10px] sm:text-[12px] tracking-[0.18em] sm:tracking-[0.25em]'
  };

  const iconSizes = {
    sm: 'w-6 h-6 sm:w-7 sm:h-7',
    md: 'w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9',
    lg: 'w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12'
  };

  return (
    <Link 
      to="/" 
      className={`inline-flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-sm min-w-0 ${className}`}
      aria-label="SK Relax Beauty Academy & Salon - Home"
    >
      {/* Brand Icon Silhouette matching poster */}
      <div className={`relative flex-shrink-0 ${iconSizes[size]} transition-transform duration-300 group-hover:scale-105`}>
        <img 
          src="/logo-icon.svg" 
          alt="" 
          className="w-full h-full object-contain"
          aria-hidden="true"
        />
      </div>

      {/* Typography - flush left-aligned, perfectly balanced */}
      <div className="flex flex-col text-left justify-center min-w-0">
        <span 
          className={`font-serif font-semibold uppercase leading-none tracking-[0.14em] sm:tracking-[0.16em] truncate transition-colors duration-300 ${
            isDark ? 'text-ivory-100 group-hover:text-gold-300' : 'text-forest-900 group-hover:text-forest-700'
          } ${headingSizes[size]}`}
        >
          SK RELAX
        </span>

        {showSubtitle && (
          <div className="flex items-center mt-1">
            <span 
              className={`font-sans font-medium uppercase leading-tight whitespace-nowrap truncate ${
                isDark ? 'text-gold-300/90' : 'text-forest-600'
              } ${subtitleSizes[size]}`}
            >
              Beauty Academy · Salon
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};
