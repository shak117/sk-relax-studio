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

const SWIPE_THRESHOLD = 50; // 50px threshold (in the 40-60px range)

export const Lightbox: React.FC<LightboxProps> = ({
  item,
  items,
  onClose,
  onNavigate,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Touch gesture tracking refs
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isSwipingRef = useRef(false);
  const isVerticalScrollRef = useRef(false);
  const isNavigatingRef = useRef(false);

  // Interactive drag offset (tactile response while swiping)
  const [dragOffset, setDragOffset] = useState<number>(0);
  // Slide animation state: 'idle' | 'out-left' | 'out-right' | 'in-left' | 'in-right'
  const [animState, setAnimState] = useState<'idle' | 'out-left' | 'out-right' | 'in-left' | 'in-right'>('idle');

  // Stable navigation indices
  const currentIndex = item ? items.findIndex((i) => i.id === item.id) : -1;
  const prevIndex = items.length > 0 ? (currentIndex - 1 + items.length) % items.length : 0;
  const nextIndex = items.length > 0 ? (currentIndex + 1) % items.length : 0;

  // Preload next and previous images for instant, flicker-free display
  useEffect(() => {
    if (!items || items.length <= 1 || currentIndex === -1) return;

    const nextItem = items[nextIndex];
    const prevItem = items[prevIndex];

    if (nextItem?.image) {
      const nextImg = new Image();
      nextImg.src = resolveMediaUrl(nextItem.image);
    }
    if (prevItem?.image) {
      const prevImg = new Image();
      prevImg.src = resolveMediaUrl(prevItem.image);
    }
  }, [currentIndex, items, nextIndex, prevIndex]);

  // Master navigation handler with smooth slide transition and anti-skipping guard
  const triggerNavigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (isNavigatingRef.current || items.length <= 1) return;

      isNavigatingRef.current = true;
      if (videoRef.current) {
        videoRef.current.pause();
      }

      const targetIndex = direction === 'next' ? nextIndex : prevIndex;
      const outAnimation = direction === 'next' ? 'out-left' : 'out-right';
      const inAnimation = direction === 'next' ? 'in-right' : 'in-left';

      // 1. Animate current slide out
      setAnimState(outAnimation);
      setDragOffset(0);

      // 2. Change slide at midpoint
      setTimeout(() => {
        onNavigate(targetIndex);
        setAnimState(inAnimation);

        // 3. Settle to idle state
        setTimeout(() => {
          setAnimState('idle');
          // Brief debounce prevents accidental double-skips
          setTimeout(() => {
            isNavigatingRef.current = false;
          }, 100);
        }, 150);
      }, 140);
    },
    [items.length, nextIndex, prevIndex, onNavigate]
  );

  const handlePrev = useCallback(() => {
    triggerNavigate('prev');
  }, [triggerNavigate]);

  const handleNext = useCallback(() => {
    triggerNavigate('next');
  }, [triggerNavigate]);

  const handleClose = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onClose();
  }, [onClose]);

  // Lock body scroll while Lightbox is open; unlock on unmount
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

  // Touch gesture handlers for mobile swipe navigation on the media area
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isNavigatingRef.current) return;

    // Ignore if touch started on an interactive control (e.g., buttons, video scrubber)
    const target = e.target as HTMLElement;
    if (target.closest('button, a, video, [role="button"]')) {
      return;
    }

    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    isSwipingRef.current = false;
    isVerticalScrollRef.current = false;
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || isNavigatingRef.current || isVerticalScrollRef.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Determine gesture direction once movement exceeds 8px
    if (!isSwipingRef.current && !isVerticalScrollRef.current) {
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
        // User is scrolling vertically - allow natural page/modal scrolling
        isVerticalScrollRef.current = true;
        return;
      }
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
        // User is swiping horizontally - capture gesture
        isSwipingRef.current = true;
      }
    }

    if (isSwipingRef.current) {
      // Damped tactile drag offset so the image moves slightly with the finger
      const damping = 0.35;
      setDragOffset(deltaX * damping);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || isNavigatingRef.current) {
      setDragOffset(0);
      touchStartRef.current = null;
      return;
    }

    if (isSwipingRef.current) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Verify strictly horizontal intent (horizontal > 1.2x vertical)
      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 1.2;
      // Fast flick (<250ms with >35px) OR standard swipe (>=50px)
      const isFlick = deltaTime < 250 && Math.abs(deltaX) > 35;
      const isStandardSwipe = Math.abs(deltaX) >= SWIPE_THRESHOLD;

      if (isHorizontal && (isStandardSwipe || isFlick)) {
        if (deltaX < 0) {
          // Swipe Left -> Next haircut
          triggerNavigate('next');
        } else {
          // Swipe Right -> Previous haircut
          triggerNavigate('prev');
        }
      }
    }

    // Reset touch state
    setDragOffset(0);
    touchStartRef.current = null;
    isSwipingRef.current = false;
    isVerticalScrollRef.current = false;
  };

  const handleTouchCancel = () => {
    setDragOffset(0);
    touchStartRef.current = null;
    isSwipingRef.current = false;
    isVerticalScrollRef.current = false;
  };

  if (!item || typeof document === 'undefined') return null;

  const whatsappUrl = buildWhatsAppUrl(
    WhatsAppMessages.serviceEnquiry(`the look shown in your portfolio: "${item.title}"`)
  );

  // Compute transition styles for smooth 60fps sliding
  let transformStyle = `translateX(${dragOffset}px)`;
  let opacityStyle = 1;
  let transitionStyle = 'none';

  if (animState === 'out-left') {
    transformStyle = 'translateX(-32px) scale(0.97)';
    opacityStyle = 0.6;
    transitionStyle = 'transform 140ms ease-in, opacity 140ms ease-in';
  } else if (animState === 'out-right') {
    transformStyle = 'translateX(32px) scale(0.97)';
    opacityStyle = 0.6;
    transitionStyle = 'transform 140ms ease-in, opacity 140ms ease-in';
  } else if (animState === 'in-right') {
    transformStyle = 'translateX(24px) scale(0.98)';
    opacityStyle = 0.7;
    transitionStyle = 'none';
  } else if (animState === 'in-left') {
    transformStyle = 'translateX(-24px) scale(0.98)';
    opacityStyle = 0.7;
    transitionStyle = 'none';
  } else if (animState === 'idle' && dragOffset === 0) {
    transformStyle = 'translateX(0) scale(1)';
    opacityStyle = 1;
    transitionStyle = 'transform 200ms ease-out, opacity 200ms ease-out';
  }

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
        className="fixed top-3 right-3 sm:top-5 sm:right-5 z-30 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-ivory-300 hover:text-white bg-forest-900/90 hover:bg-forest-800 active:scale-95 rounded-full border border-forest-700/70 transition-all shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 cursor-pointer"
        aria-label="Close image lightbox"
      >
        <X size={22} />
      </button>

      {/* Navigation Arrows (Visible on mobile, tablet, and desktop) */}
      <button
        onClick={handlePrev}
        className="fixed left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gold-300 hover:text-forest-950 bg-forest-900/90 hover:bg-gold-400 active:scale-95 rounded-full border border-gold-500/30 transition-all shadow-luxury focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 cursor-pointer"
        aria-label="Previous portfolio photograph"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        className="fixed right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gold-300 hover:text-forest-950 bg-forest-900/90 hover:bg-gold-400 active:scale-95 rounded-full border border-gold-500/30 transition-all shadow-luxury focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 cursor-pointer"
        aria-label="Next portfolio photograph"
      >
        <ChevronRight size={24} />
      </button>

      {/* Modal Container */}
      <div
        className="relative w-full max-w-5xl bg-forest-900 rounded-sm border border-forest-700/80 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] md:h-[580px] lg:h-[620px] my-auto select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media Panel with Native Touch Swipe Support */}
        <div
          className="relative flex-1 bg-black/95 flex items-center justify-center h-[340px] sm:h-[420px] md:h-full overflow-hidden select-none cursor-grab active:cursor-grabbing touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        >
          {/* Animated Media Wrapper */}
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              transform: transformStyle,
              opacity: opacityStyle,
              transition: transitionStyle,
            }}
          >
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
                draggable={false}
                className="w-full h-full object-contain p-2 sm:p-4 select-none max-h-full pointer-events-none"
              />
            )}
          </div>

          {/* Mobile Swipe Dot Indicators */}
          {items.length > 1 && (
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 px-2.5 py-1 rounded-full bg-forest-950/70 backdrop-blur-xs border border-forest-800/80 pointer-events-none sm:hidden">
              {items.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-4 bg-gold-400' : 'w-1.5 bg-ivory-400/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details & Information Panel (Right on Desktop, Bottom on Mobile) */}
        <div className="w-full md:w-84 lg:w-96 p-5 sm:p-6 lg:p-7 flex flex-col justify-between bg-forest-900 text-ivory border-t md:border-t-0 md:border-l border-forest-800 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#2a4d38_transparent]">
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
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1E3B2C] hover:bg-[#142B1F] text-[#E8F5E9] rounded-sm text-xs font-sans uppercase tracking-widest font-semibold transition-all border border-emerald-500/40 shadow-md hover:shadow-lg active:scale-98 group cursor-pointer"
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
