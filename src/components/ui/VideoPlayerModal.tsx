import React, { useEffect, useRef } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, WhatsAppMessages } from '../../data/brandData';
import { trackWhatsAppClick } from '../../services/analytics';
import { Button } from './Button';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  description?: string;
  posterImage?: string;
  categoryLabel?: string;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  title,
  description,
  posterImage,
  categoryLabel
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Close on Escape & stop scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Pause video on close
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const whatsappUrl = buildWhatsAppUrl(
    WhatsAppMessages.serviceEnquiry(title)
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-forest-950/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-forest-900 border border-forest-700/80 rounded-sm shadow-luxury overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-forest-800 bg-forest-950">
          <div className="flex items-center gap-2.5 min-w-0 pr-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            {categoryLabel && (
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-gold-400 font-sans font-medium">
                {categoryLabel}
              </span>
            )}
            <h3 className="font-serif text-sm sm:text-lg text-ivory truncate font-normal">
              {title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-ivory-300 hover:text-white rounded-full hover:bg-forest-800 transition-colors flex-shrink-0"
            aria-label="Close video player"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="relative aspect-[16/9] bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterImage}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
          >
            <p className="text-ivory-300 text-xs p-4 text-center">
              Your browser does not support the video tag. Please update your browser or enquire on WhatsApp.
            </p>
          </video>
        </div>

        {/* Footer Details & Action */}
        <div className="p-4 sm:p-6 bg-forest-900/95 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-forest-800">
          <div className="space-y-1">
            <h4 className="font-serif text-base sm:text-lg text-white font-normal">
              {title}
            </h4>
            {description && (
              <p className="text-xs sm:text-sm text-ivory-300/90 font-sans max-w-xl leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <div className="flex-shrink-0 w-full sm:w-auto">
            <Button
              href={whatsappUrl}
              external
              variant="gold"
              size="sm"
              className="w-full sm:w-auto justify-center"
              icon={<MessageCircle size={15} />}
              onClick={() => trackWhatsAppClick('video_modal', title)}
            >
              Enquire on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
