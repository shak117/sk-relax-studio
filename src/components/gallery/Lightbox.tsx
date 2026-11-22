import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, MessageCircle, Tag } from 'lucide-react';
import { GalleryItem } from '../../types';
import { buildWhatsAppUrl, WhatsAppMessages } from '../../data/brandData';
import { resolveMediaUrl } from '../../utils/mediaUrl';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Stable navigation helpers
  const currentIndex = item ? items.findIndex((i) => i.id === item.id) : -1;
  const prevIndex = items.length > 0 ? (currentIndex - 1 + items.length) % items.length : 0;
  const nextIndex = items.length > 0 ? (currentIndex + 1) % items.length : 0;

  const handlePrev = useCallback(() => {
    if (items.length > 0) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      onNavigate(prevIndex);
    }
  }, [items.length, prevIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (items.length > 0) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      onNavigate(nextIndex);
    }
  }, [items.length, nextIndex, onNavigate]);

  const handleClose = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onClose();
  }, [onClose]);

  // Lock body scroll once while Lightbox is open; unlock on unmount
  useEffect(() => {
    if (!item) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [!item]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, handleClose, handlePrev, handleNext]);

  // Clean up and safely control video on item switch
  useEffect(() => {
    if (!item?.videoUrl) return;

    const vid = videoRef.current;
    if (vid) {
      vid.currentTime = 0;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Autoplay policy restriction - graceful degradation to manual play
          console.debug('[Lightbox] Autoplay prevented by browser policy:', err.message);
        });
      }
    }

    return () => {
      if (vid) {
        vid.pause();
      }
    };
  }, [item?.id, item?.videoUrl]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    // Minimum swipe threshold 50px
    if (deltaX > 50) {
      handlePrev();
    } else if (deltaX < -50) {
      handleNext();
    }
    setTouchStartX(null);
  };

  if (!item || typeof document === 'undefined') return null;

  const whatsappUrl = buildWhatsAppUrl(
    WhatsAppMessages.serviceEnquiry(`the look shown in your portfolio: "${item.title}"`)
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#07130B]/98 backdrop-blur-xl overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`Expanded portfolio view: ${item.title}`}
      onClick={(e) => {
        // Close if backdrop clicked directly
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      {/* Top Close Button (Always visible & accessible) */}
      <button
        onClick={handleClose}
        className="fixed top-3 right-3 sm:top-5 sm:right-5 z-30 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-ivory-300 hover:text-white bg-forest-900/90 hover:bg-forest-800 rounded-full border border-forest-700/70 transition-all shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 cursor-pointer"
        aria-label="Close image lightbox"
      >
        <X size={22} />
      </button>

      {/* Navigation Arrows (Desktop / Tablet view) */}
      <button
        onClick={handlePrev}
        className="fixed left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gold-300 hover:text-forest-950 bg-forest-900/90 hover:bg-gold-400 rounded-full border border-gold-500/30 transition-all shadow-luxury focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 cursor-pointer"
        aria-label="Previous portfolio photograph"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        className="fixed right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gold-300 hover:text-forest-950 bg-forest-900/90 hover:bg-gold-400 rounded-full border border-gold-500/30 transition-all shadow-luxury focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 cursor-pointer"
        aria-label="Next portfolio photograph"
      >
        <ChevronRight size={24} />
      </button>

      {/* Modal Container */}
      <div
        className="relative w-full max-w-5xl bg-forest-900 rounded-sm border border-forest-700/80 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] md:h-[580px] lg:h-[620px] my-auto"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Media Panel (Left on Desktop, Top on Mobile) */}
        <div className="relative flex-1 bg-black/95 flex items-center justify-center h-[340px] sm:h-[420px] md:h-full overflow-hidden select-none">
          {item.videoUrl ? (
            <video
              ref={videoRef}
              key={item.videoUrl}
              src={resolveMediaUrl(item.videoUrl)}
              poster={resolveMediaUrl(item.image)}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain max-h-full"
            />
          ) : (
            <img
              src={resolveMediaUrl(item.image)}
              alt={item.alt}
              className="w-full h-full object-contain p-2 sm:p-4 select-none max-h-full"
            />
          )}
        </div>

        {/* Details & Information Panel (Right on Desktop, Bottom on Mobile) */}
        <div className="w-full md:w-84 lg:w-96 p-5 sm:p-6 lg:p-7 flex flex-col justify-between bg-forest-900 text-ivory border-t md:border-t-0 md:border-l border-forest-800 overflow-y-auto">
          <div>
            {/* Header: Category & Slide Counter */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold-400 font-semibold">
                {item.categoryLabel || 'Hair Artistry'}
              </span>
              <span className="text-xs font-sans text-ivory-300 bg-forest-950/70 px-2.5 py-1 rounded-full border border-forest-800">
                {currentIndex + 1} of {items.length}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-xl sm:text-2xl font-normal leading-tight text-white mt-2 mb-2">
              {item.title}
            </h3>

            {/* Tag Badge */}
            {item.tag && (
              <div className="inline-flex items-center gap-1 text-[10px] font-sans uppercase tracking-widest text-emerald-300 mb-3 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                <Tag size={10} className="text-emerald-400" />
                <span>{item.tag}</span>
              </div>
            )}

            {/* Description */}
            <p className="text-xs sm:text-sm text-ivory-300/90 leading-relaxed font-sans mb-4">
              {item.description}
            </p>
          </div>

          {/* Bottom Action: WhatsApp Enquiry */}
          <div className="pt-4 border-t border-forest-800/80 mt-4 sm:mt-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1E3B2C] hover:bg-[#142B1F] text-[#E8F5E9] rounded-sm text-xs font-sans uppercase tracking-widest font-semibold transition-all border border-emerald-500/40 shadow-md hover:shadow-lg group cursor-pointer"
            >
              <MessageCircle size={15} className="text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Enquire This Look</span>
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
