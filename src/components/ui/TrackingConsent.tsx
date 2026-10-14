import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { getConsentStatus, setConsentStatus } from '../../services/analytics';
import { Button } from './Button';

export const TrackingConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if user has not yet decided and consent is required
    const requireConsent = import.meta.env.VITE_REQUIRE_CONSENT !== 'false';
    const status = getConsentStatus();
    if (requireConsent && status === 'pending') {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  const handleAccept = () => {
    setConsentStatus('granted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    setConsentStatus('denied');
    setIsVisible(false);
  };

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 bg-white/95 backdrop-blur-md p-5 rounded-sm shadow-luxury border border-forest-900/15 text-forest-900 animate-fade-in text-xs font-sans"
      role="region"
      aria-label="Privacy & Analytics Preferences"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-forest-900 font-serif text-base font-medium">
          <ShieldCheck size={18} className="text-emerald-700 flex-shrink-0" />
          <span>Privacy & Local Analytics</span>
        </div>
        <button
          onClick={handleDecline}
          className="text-forest-400 hover:text-forest-700 p-1 -mr-1 -mt-1 transition-colors"
          aria-label="Dismiss and decline analytics tracking"
        >
          <X size={15} />
        </button>
      </div>

      <p className="text-forest-700/90 leading-relaxed mb-4 text-[11px] sm:text-xs">
        We use privacy-conscious analytics and Meta advertising pixels to optimize local discovery for guests in Satara. Personal booking details are never shared with advertising platforms.
      </p>

      <div className="flex items-center gap-2 pt-1 border-t border-forest-900/10">
        <Button
          onClick={handleAccept}
          variant="gold"
          size="sm"
          className="flex-1 py-2 text-[10px]"
        >
          Accept Analytics
        </Button>
        <Button
          onClick={handleDecline}
          variant="outline"
          size="sm"
          className="flex-1 py-2 text-[10px]"
        >
          Decline
        </Button>
      </div>
    </div>
  );
};
