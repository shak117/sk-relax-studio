import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowDown, Calendar, Sparkles, Scissors, Volume2, VolumeX, MessageCircle, ArrowRight } from 'lucide-react';
import { BRAND, buildWhatsAppUrl, WhatsAppMessages } from '../../data/brandData';
import { Button } from '../ui/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface HeroVideoProps {
  videoSrc?: string;
  posterSrc?: string;
  fallbackImageSrc?: string;
  onExploreClick?: () => void;
  onServicesClick?: () => void;
}

const STORAGE_KEY = 'sk_relax_hero_video_skipped';

export const HeroVideo: React.FC<HeroVideoProps> = ({
  videoSrc = '/videos/sk-relax-cinematic-hero.mp4',
  posterSrc = '/hero-frames/hero-scroll-poster.jpg',
  fallbackImageSrc = '/images/hero-fallback.jpg',
  onExploreClick,
  onServicesClick,
}) => {
  // Session persistence: remember if visitor has skipped/dismissed the video in this browsing session
  const [videoDismissed, setVideoDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isMuted, setIsMuted] = useState(false); // Default to attempting playback with sound
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  // Start background video automatically: attempt autoplay WITH sound first, fallback to muted if browser blocks
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion || videoDismissed) return;

    let isMounted = true;

    const startPlayback = () => {
      if (!isMounted || !video) return;
      setVideoLoaded(true);

      // Attempt 1: Start playback with sound enabled
      video.muted = false;
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay WITH sound succeeded!
            if (isMounted) {
              setIsMuted(false);
            }
          })
          .catch(() => {
            // Browser blocked autoplay with sound (standard policy without user gesture).
            // Fallback: Mute video so visual footage starts playing, and show the "Enable Sound" control.
            if (!isMounted) return;
            video.muted = true;
            setIsMuted(true);
            video.play().catch(() => {
              if (isMounted) setVideoFailed(true);
            });
          });
      }
    };

    const handleError = () => {
      if (isMounted) {
        setVideoFailed(true);
      }
    };

    if (video.readyState >= 2) {
      startPlayback();
    }

    video.addEventListener('loadeddata', startPlayback);
    video.addEventListener('canplay', startPlayback);
    video.addEventListener('error', handleError);

    return () => {
      isMounted = false;
      video.removeEventListener('loadeddata', startPlayback);
      video.removeEventListener('canplay', startPlayback);
      video.removeEventListener('error', handleError);
    };
  }, [reducedMotion, videoSrc, videoDismissed]);

  // Enable Sound button handler — Unmutes and ensures video plays with full original audio
  const handleEnableSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.play().catch(() => {});
    setIsMuted(false);
  };

  // Toggle Mute / Sound
  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  // "Skip to Menu →" — Immediately pause video, dismiss video hero experience, reveal static hero, and scroll to website content
  const handleSkipToMenu = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    const video = videoRef.current;
    if (video) {
      try {
        video.pause();
        video.muted = true;
      } catch {
        // Ignore abort/pause exceptions
      }
    }
    setVideoDismissed(true);

    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Ignore strict privacy mode errors
    }

    // Smoothly scroll down to salon introduction and services menu
    if (onExploreClick) {
      onExploreClick();
    } else {
      const target = document.getElementById('brand-intro');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [onExploreClick]);

  // Playback completion — Transition naturally to the normal website menu/content without forcing visitor to replay
  const handleVideoEnded = () => {
    const video = videoRef.current;
    if (video) {
      try {
        video.pause();
      } catch {
        // Ignore
      }
    }
    setVideoDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Ignore
    }

    // Smoothly transition visitor to normal website content
    const target = document.getElementById('brand-intro');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollDown = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const target = document.getElementById('brand-intro');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const showVideo = !reducedMotion && !videoFailed && !videoDismissed;

  return (
    <section 
      className="relative w-full min-h-[92svh] lg:min-h-[100svh] py-16 sm:py-20 lg:py-24 flex flex-col items-center justify-center overflow-hidden bg-forest-950 text-ivory select-none"
      aria-label="SK Relax Beauty Salon Hero"
    >
      {/* Background Media Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Base Fallback Image / Static Poster Background */}
        <img
          src={posterSrc || fallbackImageSrc}
          alt="SK Relax Beauty Salon Satara Interior & Hair Artistry"
          className="absolute inset-0 w-full h-full object-cover object-[50%_42%] sm:object-[50%_45%] scale-105 transition-opacity duration-1000"
          style={{ opacity: videoLoaded && showVideo ? 0.2 : 0.88 }}
          loading="eager"
        />

        {/* Original Cinematic Video Element (Plays continuously without scroll scrubbing) */}
        {!reducedMotion && !videoFailed && !videoDismissed && (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            playsInline
            webkit-playsinline="true"
            preload="auto"
            onEnded={handleVideoEnded}
            aria-hidden="true"
            tabIndex={-1}
            className={`absolute inset-0 w-full h-full object-cover object-[50%_42%] sm:object-[50%_45%] transition-opacity duration-1000 ${
              videoLoaded && showVideo ? 'opacity-90' : 'opacity-0'
            }`}
          />
        )}

        {/* Subtle Dark Forest-Green Overlay to ensure contrast while preserving footage colours */}
        <div 
          className="absolute inset-0 bg-forest-950/35 mix-blend-multiply pointer-events-none"
          aria-hidden="true"
        />
        {/* Refined gradient scrim: deeper at top (for navbar) and bottom (for section transition), clear in center */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-transparent to-forest-950/85 pointer-events-none"
          aria-hidden="true"
        />
        {/* Subtle Luxury Pattern / Grain Touch */}
        <div 
          className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none"
          style={{ backgroundImage: `radial-gradient(#CAA454 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
        />
      </div>

      {/* Top-Right Controls: "Enable Sound" (when audio blocked) + "Skip to Menu →" */}
      {!videoDismissed && showVideo && (
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 lg:right-10 z-20 flex items-center gap-2 sm:gap-3">
          {/* Subtle Enable Sound Control (displayed when browser blocks autoplay with sound) */}
          {isMuted && (
            <button
              type="button"
              onClick={handleEnableSound}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-forest-950/80 hover:bg-forest-900/95 backdrop-blur-md border border-gold-400/60 hover:border-gold-300 text-gold-300 hover:text-gold-200 text-xs sm:text-[13px] font-sans font-medium uppercase tracking-wider transition-all duration-300 shadow-luxury cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 group"
              aria-label="Enable Background Video Sound"
            >
              <VolumeX size={15} className="text-gold-400 animate-pulse group-hover:scale-110 transition-transform" />
              <span>Enable Sound</span>
            </button>
          )}

          {!isMuted && (
            <button
              type="button"
              onClick={handleToggleMute}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-full bg-forest-950/60 hover:bg-forest-900/90 backdrop-blur-md border border-ivory/20 hover:border-gold-400/50 text-ivory-200 hover:text-gold-300 text-xs sm:text-[13px] font-sans tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
              aria-label="Mute Video Sound"
            >
              <Volume2 size={15} className="text-emerald-400" />
              <span className="hidden xs:inline">Sound On</span>
            </button>
          )}

          {/* "Skip to Menu →" Button */}
          <button
            type="button"
            onClick={handleSkipToMenu}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-forest-950/75 hover:bg-forest-900/95 backdrop-blur-md border border-ivory/30 hover:border-gold-300 text-ivory-100 hover:text-gold-200 text-xs sm:text-[13px] font-sans font-semibold tracking-wider uppercase transition-all duration-300 shadow-luxury cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            aria-label="Skip to Menu — Continue to Website Content"
          >
            <span>Skip to Menu</span>
            <ArrowRight size={13} className="text-gold-300 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      )}

      {/* Hero Foreground Content — Clean Linear Flex Flow with Guaranteed Zero Overlaps */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* 1. Eyebrow */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-forest-900/75 backdrop-blur-md border border-gold-500/30 text-gold-300 text-[11px] sm:text-xs font-sans tracking-[0.25em] uppercase shadow-soft">
          <Sparkles size={13} className="text-gold-400" />
          <span>{BRAND.eyebrow}</span>
        </div>

        {/* 2. Main Headline */}
        <h1 className="mt-5 sm:mt-6 font-serif text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-ivory leading-[1.1] sm:leading-[1.05] max-w-4xl text-balance drop-shadow-md">
          Your Beauty.
          <span className="block font-serif italic text-gold-300 font-normal sm:mt-1 drop-shadow-sm">
            Your Signature.
          </span>
        </h1>

        {/* 3. Supporting Description */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-ivory-200/95 max-w-2xl font-sans font-light leading-relaxed drop-shadow-sm">
          Bespoke hair artistry, clinical skin aesthetics, and professional beauty academy education in Satara.
        </p>

        {/* 4. Action Buttons — Row on Desktop, Clean Wrapping on Mobile Screens */}
        <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto max-w-md sm:max-w-none">
          <Button
            to="/booking"
            variant="gold"
            size="lg"
            className="w-full sm:w-auto shadow-luxury uppercase tracking-wider font-semibold whitespace-nowrap justify-center min-h-[46px]"
            icon={<Calendar size={16} />}
          >
            BOOK APPOINTMENT
          </Button>

          <Button
            to="/services"
            onClick={onServicesClick}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-ivory/50 text-ivory hover:text-forest-950 hover:bg-ivory hover:border-ivory uppercase tracking-wider font-semibold backdrop-blur-xs transition-all duration-300 whitespace-nowrap justify-center min-h-[46px]"
            icon={<Scissors size={15} />}
          >
            EXPLORE SERVICES
          </Button>

          <a
            href={buildWhatsAppUrl(WhatsAppMessages.general())}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-emerald-700/85 hover:bg-emerald-600 text-white font-sans text-xs sm:text-sm font-semibold tracking-wider uppercase backdrop-blur-xs border border-emerald-500/40 hover:border-emerald-400 transition-all duration-300 shadow-soft whitespace-nowrap min-h-[46px]"
            aria-label="Enquire on WhatsApp with SK Relax salon"
          >
            <MessageCircle size={15} className="text-white flex-shrink-0" />
            <span>Enquire on WhatsApp</span>
          </a>
        </div>

        {/* 5. Promotional Announcement — Distinct Row with a Clear Gap Below Buttons */}
        <div className="mt-6 sm:mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-950/60 backdrop-blur-md border border-ivory/15 text-xs text-ivory-200/90 font-sans tracking-wider shadow-soft">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse flex-shrink-0"></span>
            <span className="truncate">Hair Cutting Masterclass Enrollment Open</span>
            <span className="text-ivory-400 hidden xs:inline">·</span>
            <a 
              href="/batches" 
              className="text-gold-300 hover:text-gold-200 font-medium underline underline-offset-4 ml-0.5 whitespace-nowrap transition-colors"
            >
              View Batches →
            </a>
          </div>
        </div>

        {/* 6. Scroll Indicator — Positioned Naturally Below the Promotional Row in the Flow (NO Overlapping Absolute Bounds) */}
        <div className="mt-8 sm:mt-10">
          <button
            type="button"
            onClick={handleScrollDown}
            className="flex flex-col items-center gap-2 text-ivory-300 hover:text-gold-300 transition-colors focus:outline-none group cursor-pointer"
            aria-label="Scroll down to explore salon introduction"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] font-sans text-ivory-400 group-hover:text-gold-300 transition-colors">
              Explore
            </span>
            <div className="w-5 h-9 rounded-full border border-ivory/30 group-hover:border-gold-400 flex items-start justify-center p-1 transition-colors">
              <div className="w-1 h-2 bg-gold-400 rounded-full animate-bounce"></div>
            </div>
            <ArrowDown size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </section>
  );
};
