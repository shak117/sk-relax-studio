import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { BRAND } from '../../data/brandData';

export const AnnouncementBar: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !BRAND.announcement) return null;

  return (
    <div className="bg-forest-950 text-ivory text-xs font-sans tracking-wide py-2 relative z-50 border-b border-forest-800">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center justify-center text-center gap-2 overflow-hidden text-ellipsis">
          <span className="hidden sm:inline-flex items-center gap-1 text-gold-400 font-medium uppercase tracking-wider text-[11px] bg-forest-900 px-2 py-0.5 rounded-sm border border-gold-500/20">
            <Sparkles size={11} className="text-gold-400" />
            {BRAND.announcement.badge}
          </span>
          <span className="text-ivory-200 text-xs sm:text-[13px] truncate">
            {BRAND.announcement.text}
          </span>
          {BRAND.announcement.linkUrl && (
            <Link
              to={BRAND.announcement.linkUrl}
              className="inline-flex items-center gap-1 text-gold-300 hover:text-gold-200 underline underline-offset-2 ml-1 text-xs font-medium flex-shrink-0"
            >
              {BRAND.announcement.linkText}
              <ArrowRight size={12} />
            </Link>
          )}
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-ivory-400 hover:text-ivory-100 p-1 rounded transition-colors focus:outline-none"
          aria-label="Dismiss announcement"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
