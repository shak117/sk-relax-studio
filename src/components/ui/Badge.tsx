import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'rose' | 'forest' | 'gold' | 'ivory';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'rose',
  className = ''
}) => {
  const variantStyles = {
    rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
    forest: 'bg-forest-50 text-forest-800 border-forest-200/80',
    gold: 'bg-gold-50 text-gold-700 border-gold-300/80',
    ivory: 'bg-ivory text-forest-900 border-forest-900/10'
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-1 text-[11px] font-sans font-medium uppercase tracking-wider rounded-sm border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
