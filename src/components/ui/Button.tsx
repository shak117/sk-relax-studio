import React from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost' | 'whatsapp';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  to?: string;
  href?: string;
  external?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  to,
  href,
  external = false,
  icon,
  iconPosition = 'right',
  children,
  className = '',
  disabled,
  ...rest
}) => {
  const baseStyles = "inline-flex items-center justify-center font-sans font-medium transition-all duration-300 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none tracking-wider text-center cursor-pointer";

  const sizeStyles = {
    sm: "text-xs px-4 py-2 gap-1.5 uppercase tracking-widest",
    md: "text-xs sm:text-sm px-6 py-3 gap-2 uppercase tracking-widest",
    lg: "text-sm sm:text-base px-8 py-3.5 sm:py-4 gap-2.5 uppercase tracking-[0.2em]"
  };

  const variantStyles = {
    primary: "bg-forest-900 text-ivory hover:bg-forest-800 shadow-soft hover:shadow-card border border-forest-800 hover:border-gold-500/40",
    secondary: "bg-cream-100 text-forest-900 hover:bg-cream-200 border border-cream-300 hover:border-forest-600/30",
    outline: "bg-transparent text-forest-900 border border-forest-900/30 hover:border-forest-900 hover:bg-forest-900/5",
    gold: "bg-gold-500 text-forest-950 hover:bg-gold-400 font-semibold shadow-soft hover:shadow-card border border-gold-400",
    ghost: "bg-transparent text-forest-800 hover:text-forest-950 hover:bg-forest-900/5",
    whatsapp: "bg-[#1E3B2C] text-[#E8F5E9] hover:bg-[#142B1F] border border-[#2E583F] shadow-soft hover:shadow-card"
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`group ${combinedClasses}`}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={`group ${combinedClasses}`}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={`group ${combinedClasses}`} disabled={disabled} {...rest}>
      {content}
    </button>
  );
};
