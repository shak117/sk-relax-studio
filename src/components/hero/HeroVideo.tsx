import React, { useState, useRef, useEffect } from 'react';
import { ArrowDown, Calendar, Sparkles, Scissors } from 'lucide-react';
import { BRAND } from '../../data/brandData';
import { Button } from '../ui/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface HeroVideoProps {
  videoSrc?: string;
  posterSrc?: string;
  fallbackImageSrc?: string;
  onExploreClick?: () => void;
  onServicesClick?: () => void;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({
  videoSrc = '/videos/sk-relax-hero.mp4',
  posterSrc = '/images/hero-poster.jpg',
  fallbackImageSrc = '/images/hero-fallback.jpg',
  onExploreClick,
  onServicesClick,
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    let isMounted = true;

    const handleVideoReady = () => {
      if (!isMounted) return;
      setVideoLoaded(true);
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (isMounted) {
            setAutoplayBlocked(true);
          }
        });
      }
    };

    const handleError = () => {
      if (isMounted) {
        setVideoFailed(true);
      }
    };

    if (video.readyState >= 2) {
      handleVideoReady();
    }

    video.addEventListener('loadeddata', handleVideoReady);
    video.addEventListener('canplay', handleVideoReady);
    video.addEventListener('error', handleError);

    return () => {
      isMounted = false;
      video.removeEventListener('loadeddata', handleVideoReady);
      video.removeEventListener('canplay', handleVideoReady);
      video.removeEventListener('error', handleError);
    };
  }, [reducedMotion, videoSrc]);

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

  const showVideo = !reducedMotion && !videoFailed && !autoplayBlocked;

  return (
    <section 
      className="relative w-full min-h-[90svh] sm:min-h-[92svh] lg:min-h-[100svh] h-[92svh] sm:h-[95svh] lg:h-[100svh] max-h-[1080px] flex items-center justify-center overflow-hidden bg-forest-950 text-ivory select-none"
      aria-label="SK Relax Beauty Salon Hero"
    >
      {/* Background Media Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Base Fallback Image (Underneath to prevent black screen) */}
        <img
          src={posterSrc || fallbackImageSrc}
          alt="SK Relax Beauty Salon Satara Interior & Hair Artistry"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-opacity duration-1000"
          style={{ opacity: videoLoaded && showVideo ? 0.2 : 0.85 }}
          loading="eager"
        />

        {/* Cinematic Salon Video Element */}
        {!reducedMotion && !videoFailed && (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
              videoLoaded && showVideo ? 'opacity-90' : 'opacity-0'
            }`}
          />
        )}

        {/* Subtle Dark Forest-Green Overlay */}
        <div 
          className="absolute inset-0 bg-forest-950/45 mix-blend-multiply pointer-events-none"
          aria-hidden="true"
        />
        {/* Refined gradient scrim: deeper at top (for navbar) and bottom (for section transition), clear in center */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-forest-950/75 via-forest-950/30 to-forest-950/85 pointer-events-none"
          aria-hidden="true"
        />
        {/* Subtle Luxury Pattern / Grain Touch */}
        <div 
          className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none"
          style={{ backgroundImage: `radial-gradient(#CAA454 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
        />
      </div>

      {/* Hero Foreground Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center pt-8 sm:pt-4">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-forest-900/75 backdrop-blur-md border border-gold-500/30 text-gold-300 text-[11px] sm:text-xs font-sans tracking-[0.25em] uppercase mb-6 sm:mb-8 animate-fade-in shadow-soft">
          <Sparkles size={13} className="text-gold-400" />
          <span>{BRAND.eyebrow}</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-ivory leading-[1.08] sm:leading-[1.05] max-w-4xl text-balance drop-shadow-md">
          Your Beauty.
          <span className="block font-serif italic text-gold-300 font-normal sm:mt-1 drop-shadow-sm">
            Your Signature.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-ivory-200/95 max-w-2xl font-sans font-light leading-relaxed drop-shadow-sm">
          Discover your style, embrace your beauty, and experience professional care designed around you.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Button
            to="/booking"
            variant="gold"
            size="lg"
            className="w-full sm:w-auto shadow-luxury uppercase tracking-wider font-semibold"
            icon={<Calendar size={16} />}
          >
            BOOK YOUR APPOINTMENT
          </Button>

          <Button
            to="/services"
            onClick={onServicesClick}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-ivory/50 text-ivory hover:text-forest-950 hover:bg-ivory hover:border-ivory uppercase tracking-wider font-semibold backdrop-blur-xs transition-all duration-300"
            icon={<Scissors size={15} />}
          >
            EXPLORE OUR SERVICES
          </Button>
        </div>

        {/* Academy Highlight Pill */}
        <div className="mt-6 inline-flex items-center gap-2 text-xs text-ivory-300/80 font-sans tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
          <span>Hair Cutting Masterclass Enrollment Open</span>
          <a href="/batches" className="text-gold-300 hover:text-gold-200 underline underline-offset-4 ml-1">
            View Batches
          </a>
        </div>
      </div>

      {/* Discreet Scroll Indicator */}
      <button
        onClick={handleScrollDown}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-ivory-300 hover:text-gold-300 transition-colors focus:outline-none group cursor-pointer"
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
    </section>
  );
};
