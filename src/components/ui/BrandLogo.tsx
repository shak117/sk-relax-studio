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
    sm: 'text-lg tracking-[0.2em]',
    md: 'text-2xl sm:text-3xl tracking-[0.25em]',
    lg: 'text-3xl sm:text-4xl lg:text-5xl tracking-[0.3em]'
  };

  const subtitleSizes = {
    sm: 'text-[9px] tracking-[0.25em]',
    md: 'text-[10px] sm:text-[11px] tracking-[0.3em]',
    lg: 'text-[12px] sm:text-[14px] tracking-[0.35em]'
  };

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12 sm:w-14 sm:h-14'
  };

  return (
    <Link 
      to="/" 
      className={`inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-sm ${className}`}
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
      <div className="flex flex-col text-left">
        <span 
          className={`font-serif font-semibold uppercase leading-none transition-colors duration-300 ${
            isDark ? 'text-ivory-100 group-hover:text-gold-300' : 'text-forest-900 group-hover:text-forest-700'
          } ${headingSizes[size]}`}
        >
          SK RELAX
        </span>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`h-[1px] w-3 ${isDark ? 'bg-gold-500/60' : 'bg-rose-400/80'}`}></span>
            <span 
              className={`font-sans font-medium uppercase leading-tight ${
                isDark ? 'text-gold-300/90' : 'text-forest-600'
              } ${subtitleSizes[size]}`}
            >
              Beauty Academy · Salon
            </span>
            <span className={`h-[1px] w-3 ${isDark ? 'bg-gold-500/60' : 'bg-rose-400/80'}`}></span>
          </div>
        )}
      </div>
    </Link>
  );
};
