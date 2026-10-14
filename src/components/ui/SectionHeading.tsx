import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  highlightText?: string;
  description?: string;
  align?: 'left' | 'center';
  variant?: 'light' | 'dark';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  highlightText,
  description,
  align = 'center',
  variant = 'light',
  className = '',
}) => {
  const isDark = variant === 'dark';
  const isCenter = align === 'center';

  return (
    <div className={`max-w-3xl ${isCenter ? 'mx-auto text-center' : 'text-left'} ${className}`}>
      {eyebrow && (
        <div className={`inline-flex items-center gap-2 mb-3 ${isCenter ? 'justify-center' : 'justify-start'}`}>
          <span className={`w-6 h-[1px] ${isDark ? 'bg-gold-400/60' : 'bg-rose-400/80'}`}></span>
          <span 
            className={`text-xs uppercase tracking-[0.25em] font-sans font-semibold ${
              isDark ? 'text-gold-300' : 'text-rose-600'
            }`}
          >
            {eyebrow}
          </span>
          <span className={`w-6 h-[1px] ${isDark ? 'bg-gold-400/60' : 'bg-rose-400/80'}`}></span>
        </div>
      )}

      <h2 
        className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.15] tracking-tight ${
          isDark ? 'text-ivory-100' : 'text-forest-900'
        }`}
      >
        {title}
        {highlightText && (
          <span className={`block sm:inline font-serif italic ${isDark ? 'text-gold-300' : 'text-rose-500'} sm:ml-2`}>
            {highlightText}
          </span>
        )}
      </h2>

      {description && (
        <p 
          className={`mt-4 text-base sm:text-lg leading-relaxed font-sans font-normal ${
            isDark ? 'text-ivory-300/80' : 'text-forest-700/80'
          } ${isCenter ? 'max-w-2xl mx-auto' : ''}`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
