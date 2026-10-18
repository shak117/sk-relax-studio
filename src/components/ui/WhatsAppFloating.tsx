import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { BRAND, buildWhatsAppUrl, WhatsAppMessages } from '../../data/brandData';
import { trackWhatsAppClick } from '../../services/analytics';

export const WhatsAppFloating: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const defaultUrl = buildWhatsAppUrl(WhatsAppMessages.general());

  return (
    <aside aria-label="WhatsApp quick contact" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-end gap-3 select-none">
      {/* Friendly Chat Tooltip Pill */}
      {showTooltip && (
        <div className="hidden md:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-card border border-forest-900/10 text-xs font-sans text-forest-900 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Chat with {BRAND.shortName} Satara</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-forest-400 hover:text-forest-700 ml-1 p-0.5 rounded-full transition-colors"
            aria-label="Dismiss message preview"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={defaultUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick('floating_button', 'General WhatsApp Chat')}
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#1E3B2C] hover:bg-[#142B1F] text-ivory rounded-full shadow-luxury hover:shadow-elevated transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30 border border-emerald-600/40"
        aria-label="Chat on WhatsApp with SK Relax Beauty Academy & Salon, Satara"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-emerald-500"></span>
        </span>
        <MessageCircle size={22} className="sm:w-6 sm:h-6 text-emerald-300 transition-transform duration-300 group-hover:scale-110" />
      </a>
    </aside>
  );
};
