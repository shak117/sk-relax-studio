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
}

export const HeroVideo: React.FC<HeroVideoProps> = ({
  videoSrc = '/videos/sk-relax-hero.mp4',
  posterSrc = '/images/hero-poster.jpg',
  fallbackImageSrc = '/images/hero-fallback.jpg',
  onExploreClick,
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    const handleCanPlay = () => {
      setVideoLoaded(true);
      // Ensure autoplay starts quietly
      video.play().catch(() => {
        // Autoplay policy fallback
      });
    };

    const handleError = () => {
      setVideoFailed(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
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

  return (
    <section 
      className="relative w-full h-[92vh] sm:h-[95vh] min-h-[580px] max-h-[960px] flex items-center justify-center overflow-hidden bg-forest-950 text-ivory select-none"
      aria-label="SK Relax Beauty Salon Hero"
    >
      {/* Background Media Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Base Fallback Image (Always present underneath to prevent black screen) */}
        <img
          src={posterSrc || fallbackImageSrc}
          alt="SK Relax Beauty Salon Satara Interior & Hair Artistry"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-opacity duration-1000"
          style={{ opacity: videoLoaded && !videoFailed ? 0.35 : 0.85 }}
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
            preload="auto"
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-55' : 'opacity-0'
            }`}
          />
        )}

        {/* Editorial Multi-layer Gradient Overlay for Pristine Readability */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/60 to-forest-950/70"
          aria-hidden="true"
        />
        <div 
          className="absolute inset-0 bg-radial-gradient from-transparent via-forest-950/30 to-forest-950/80 mix-blend-multiply"
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
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-forest-900/70 backdrop-blur-md border border-gold-500/30 text-gold-300 text-[11px] sm:text-xs font-sans tracking-[0.25em] uppercase mb-6 sm:mb-8 animate-fade-in shadow-soft">
          <Sparkles size={13} className="text-gold-400" />
          <span>{BRAND.eyebrow}</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-ivory leading-[1.08] sm:leading-[1.05] max-w-4xl text-balance">
          Your Beauty.
          <span className="block font-serif italic text-gold-300 font-normal sm:mt-1">
            Your Signature.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-ivory-200/90 max-w-2xl font-sans font-light leading-relaxed">
          Discover your style, embrace your beauty, and experience professional care designed around you.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Button
            to="/booking"
            variant="gold"
            size="lg"
            className="w-full sm:w-auto shadow-luxury"
            icon={<Calendar size={16} />}
          >
            Book Your Appointment
          </Button>

          <Button
            to="/services"
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-ivory/40 text-ivory hover:text-forest-950 hover:bg-ivory hover:border-ivory"
            icon={<Scissors size={15} />}
          >
            Explore Our Services
          </Button>
        </div>

        {/* Academy Highlight Pill */}
        <div className="mt-6 inline-flex items-center gap-2 text-xs text-ivory-300/80 font-sans tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
          <span>Hair Cutting Masterclass Enrollment Open</span>
          <a href="/academy" className="text-gold-300 hover:text-gold-200 underline underline-offset-4 ml-1">
            View Syllabus
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
