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
    md: 'text-xl sm:text-2xl lg:text-3xl tracking-[0.16em] sm:tracking-[0.22em]',
    lg: 'text-2xl sm:text-4xl lg:text-5xl tracking-[0.2em] sm:tracking-[0.3em]'
  };

  const subtitleSizes = {
    sm: 'text-[8px] sm:text-[9px] tracking-[0.18em]',
    md: 'text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.15em] sm:tracking-[0.25em]',
    lg: 'text-[11px] sm:text-[13px] tracking-[0.22em] sm:tracking-[0.35em]'
  };

  const iconSizes = {
    sm: 'w-6 h-6 sm:w-7 sm:h-7',
    md: 'w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10',
    lg: 'w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14'
  };

  return (
    <Link 
      to="/" 
      className={`inline-flex items-center gap-2 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-sm min-w-0 ${className}`}
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

      {/* Typography */}
      <div className="flex flex-col text-left min-w-0">
        <span 
          className={`font-serif font-semibold uppercase leading-none truncate transition-colors duration-300 ${
            isDark ? 'text-ivory-100 group-hover:text-gold-300' : 'text-forest-900 group-hover:text-forest-700'
          } ${headingSizes[size]}`}
        >
          SK RELAX
        </span>

        {showSubtitle && (
          <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1">
            <span className={`hidden sm:inline-block h-[1px] w-2 sm:w-3 ${isDark ? 'bg-gold-500/60' : 'bg-rose-400/80'}`}></span>
            <span 
              className={`font-sans font-medium uppercase leading-tight whitespace-nowrap truncate ${
                isDark ? 'text-gold-300/90' : 'text-forest-600'
              } ${subtitleSizes[size]}`}
            >
              Beauty Academy · Salon
            </span>
            <span className={`hidden sm:inline-block h-[1px] w-2 sm:w-3 ${isDark ? 'bg-gold-500/60' : 'bg-rose-400/80'}`}></span>
          </div>
        )}
      </div>
    </Link>
  );
};
