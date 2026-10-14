import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { GalleryItem } from '../../types';
import { buildWhatsAppUrl, WhatsAppMessages } from '../../data/brandData';

interface LightboxProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  item,
  items,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        const currentIndex = items.findIndex((i) => i.id === item.id);
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        onNavigate(prevIndex);
      }
      if (e.key === 'ArrowRight') {
        const currentIndex = items.findIndex((i) => i.id === item.id);
        const nextIndex = (currentIndex + 1) % items.length;
        onNavigate(nextIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [item, items, onClose, onNavigate]);

  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);
  const prevIndex = (currentIndex - 1 + items.length) % items.length;
  const nextIndex = (currentIndex + 1) % items.length;

  const whatsappUrl = buildWhatsAppUrl(
    WhatsAppMessages.serviceEnquiry(`the look shown in your portfolio: "${item.title}"`)
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/95 backdrop-blur-md p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Expanded view: ${item.title}`}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 p-2 text-ivory-300 hover:text-white bg-forest-900/60 hover:bg-forest-900 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 cursor-pointer"
        aria-label="Close image lightbox"
      >
        <X size={24} />
      </button>

      {/* Prev / Next buttons */}
      <button
        onClick={() => onNavigate(prevIndex)}
        className="absolute left-3 sm:left-6 z-20 p-2.5 sm:p-3 text-ivory-300 hover:text-white bg-forest-900/70 hover:bg-forest-900 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 cursor-pointer"
        aria-label="Previous portfolio photograph"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => onNavigate(nextIndex)}
        className="absolute right-3 sm:right-6 z-20 p-2.5 sm:p-3 text-ivory-300 hover:text-white bg-forest-900/70 hover:bg-forest-900 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 cursor-pointer"
        aria-label="Next portfolio photograph"
      >
        <ChevronRight size={24} />
      </button>

      {/* Main Container */}
      <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row bg-forest-900 rounded-sm overflow-hidden shadow-luxury border border-forest-800">
        {/* Expanded Image */}
        <div className="relative flex-1 bg-black flex items-center justify-center max-h-[60vh] md:max-h-[85vh] overflow-hidden">
          <img
            src={item.image}
            alt={item.alt}
            className="w-full h-full object-contain max-h-[60vh] md:max-h-[85vh]"
          />
        </div>

        {/* Details Sidebar / Bottom Panel */}
        <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-forest-900 text-ivory border-t md:border-t-0 md:border-l border-forest-800">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold-400 font-semibold">
                {item.categoryLabel}
              </span>
              <span className="text-xs text-ivory-400">
                {currentIndex + 1} of {items.length}
              </span>
            </div>

            <h3 className="font-serif text-2xl font-normal leading-tight text-white mb-3">
              {item.title}
            </h3>

            <p className="text-xs sm:text-sm text-ivory-300/80 leading-relaxed font-sans mb-6">
              {item.description}
            </p>
          </div>

          <div className="pt-4 border-t border-forest-800">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1E3B2C] hover:bg-[#142B1F] text-[#E8F5E9] rounded-sm text-xs font-sans uppercase tracking-widest font-semibold transition-all border border-emerald-500/30"
            >
              <MessageCircle size={15} className="text-emerald-400" />
              <span>Enquire This Look</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
