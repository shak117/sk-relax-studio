import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Play, ArrowRight, Sparkles } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface FullScreenVideoIntroProps {
  onDismiss: () => void;
  videoSrc?: string;
  posterSrc?: string;
}

const STORAGE_KEY = 'sk_relax_intro_seen_v1';

export const FullScreenVideoIntro: React.FC<FullScreenVideoIntroProps> = ({
  onDismiss,
  videoSrc = '/videos/sk-relax-hero.mp4',
  posterSrc = '/images/hero-poster.jpg',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const reducedMotion = useReducedMotion();

  // Safely stop video and audio playback and clean up resources
  const stopPlayback = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      try {
        video.pause();
        video.muted = true;
        video.currentTime = 0;
      } catch {
        // Ignore abort or pause exceptions on unmounted elements
      }
    }
  }, []);

  // Dismiss intro and reveal website homepage
  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    stopPlayback();

    // Mark as seen for this browsing session
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Storage access may be blocked in strict private browsing modes
    }

    // Allow graceful fade-out before unmounting
    setTimeout(() => {
      onDismiss();
    }, 400);
  }, [onDismiss, stopPlayback]);

  // Lock body scroll while full-screen intro is visible
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Respect reduced motion preference
  useEffect(() => {
    if (reducedMotion) {
      handleDismiss();
    }
  }, [reducedMotion, handleDismiss]);

  // Attempt initial video autoplay (muted)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    let isMounted = true;

    const attemptPlay = () => {
      if (!isMounted || !video) return;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (isMounted) {
              setAutoplayBlocked(false);
            }
          })
          .catch(() => {
            if (isMounted) {
              setAutoplayBlocked(true);
            }
          });
      }
    };

    if (video.readyState >= 2) {
      attemptPlay();
    } else {
      video.addEventListener('canplay', attemptPlay, { once: true });
    }

    return () => {
      isMounted = false;
      stopPlayback();
    };
  }, [reducedMotion, stopPlayback]);

  // Handle explicit play request when autoplay was blocked
  const handleManualPlay = () => {
    const video = videoRef.current;
    if (!video) return;

    video.play()
      .then(() => {
        setAutoplayBlocked(false);
      })
      .catch(() => {
        // If still blocked, user can skip to website
        setAutoplayBlocked(true);
      });
  };

  // Toggle Mute / Unmute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  // Track playback time and progress percentage
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const cur = video.currentTime || 0;
    const dur = video.duration || 0;
    setCurrentTime(cur);
    if (dur > 0) {
      setDuration(dur);
      setProgress((cur / dur) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      setDuration(video.duration);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="SK Relax Full-Screen Video Introduction"
      className={`fixed inset-0 z-[100] w-full h-[100dvh] bg-forest-950 text-ivory flex flex-col justify-between overflow-hidden select-none transition-opacity duration-400 ease-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Video Element */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-forest-950">
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted={isMuted}
          playsInline
          webkit-playsinline="true"
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleDismiss}
          onError={() => {
            setHasError(true);
          }}
          className="w-full h-full object-cover object-center"
          aria-label="SK Relax Beauty Salon & Academy Cinematography"
        />

        {/* Subtle Dark Gradient Overlay for Readability */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-transparent to-forest-950/80 pointer-events-none"
          aria-hidden="true"
        />

        {/* Subtle Dark Tint */}
        <div 
          className="absolute inset-0 bg-forest-950/20 mix-blend-multiply pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Top Header Bar: Minimal Luxury Brand Watermark & Sound Toggle */}
      <header className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-4 sm:pt-6 flex items-center justify-between gap-4">
        {/* Subtle SK Relax Branding */}
        <div className="flex items-center gap-2.5 sm:gap-3 bg-forest-950/40 backdrop-blur-md px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-ivory/15 shadow-soft">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src="/logo-icon.svg" 
              alt="SK Relax Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif font-semibold tracking-[0.16em] text-xs sm:text-sm text-ivory uppercase leading-none">
              SK RELAX
            </span>
            <span className="text-[7.5px] sm:text-[8.5px] font-sans font-medium uppercase tracking-[0.2em] text-gold-300/90 leading-tight mt-0.5">
              Beauty Academy · Salon
            </span>
          </div>
        </div>

        {/* Top-Right Controls: Mute/Unmute & Video Progress Timer */}
        <div className="flex items-center gap-2 sm:gap-3">
          {duration > 0 && (
            <div className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full bg-forest-950/40 backdrop-blur-md border border-ivory/15 text-[11px] font-mono text-ivory-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          )}

          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest-950/50 hover:bg-forest-900/80 backdrop-blur-md border border-ivory/20 hover:border-gold-400/50 text-ivory-200 hover:text-gold-300 transition-all duration-200 text-xs font-sans tracking-wide cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
          >
            {isMuted ? (
              <>
                <VolumeX size={15} className="text-gold-400" />
                <span className="hidden xs:inline text-[11px] uppercase tracking-wider font-medium">Unmute</span>
              </>
            ) : (
              <>
                <Volume2 size={15} className="text-emerald-400" />
                <span className="hidden xs:inline text-[11px] uppercase tracking-wider font-medium">Sound On</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Center Interactive Overlay (Play if blocked or Error state) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
        {autoplayBlocked && !hasError && (
          <div className="pointer-events-auto bg-forest-950/80 backdrop-blur-md border border-gold-500/40 p-6 sm:p-8 rounded-sm max-w-sm mx-auto shadow-luxury animate-fade-in flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={handleManualPlay}
              className="w-16 h-16 rounded-full bg-gold-400 hover:bg-gold-300 text-forest-950 flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-luxury cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400/40"
              aria-label="Play Intro Video"
            >
              <Play size={28} className="translate-x-0.5 text-forest-950 fill-forest-950" />
            </button>
            <div className="text-center">
              <h2 className="font-serif text-lg text-ivory font-medium">Experience SK Relax</h2>
              <p className="text-xs text-ivory-300 mt-1 font-sans">Tap to play our cinematic salon introduction</p>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-xs text-gold-300 hover:text-gold-200 underline underline-offset-4 tracking-wider uppercase font-sans mt-1"
            >
              Skip Directly to Website →
            </button>
          </div>
        )}

        {hasError && (
          <div className="pointer-events-auto bg-forest-950/85 backdrop-blur-md border border-rose-500/40 p-6 rounded-sm max-w-sm mx-auto shadow-luxury flex flex-col items-center gap-3">
            <Sparkles size={24} className="text-gold-400" />
            <h2 className="font-serif text-base text-ivory">Welcome to SK Relax</h2>
            <p className="text-xs text-ivory-300 font-sans">Your Beauty, Your Signature. Experience our salon services & academy in Satara.</p>
            <button
              type="button"
              onClick={handleDismiss}
              className="mt-2 px-5 py-2.5 rounded-full bg-gold-400 hover:bg-gold-300 text-forest-950 font-sans font-semibold text-xs tracking-wider uppercase transition-all shadow-md"
            >
              Continue to Website →
            </button>
          </div>
        )}
      </main>

      {/* Bottom Footer Bar: Skip Button & Timeline Progress Bar */}
      <footer className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pb-6 sm:pb-8 flex flex-col gap-3">
        {/* Main Action: Skip Intro Button */}
        <div className="flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs text-ivory-300/80 font-sans tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"></span>
            <span>SK Relax Cinematic Intro</span>
          </div>

          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-3 rounded-full bg-gold-400 hover:bg-gold-300 text-forest-950 font-sans font-bold text-xs sm:text-sm tracking-[0.14em] uppercase transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-luxury border border-gold-200/60 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400/50"
              aria-label="Skip Intro — Continue to Website"
            >
              <span>Skip Intro — Continue to Website</span>
              <ArrowRight size={15} className="text-forest-950 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Minimal Timeline Progress Line */}
        <div 
          className="w-full h-1 bg-ivory/15 rounded-full overflow-hidden mt-1"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Video playback progress"
        >
          <div 
            className="h-full bg-gradient-to-r from-gold-500 via-gold-400 to-rose-400 rounded-full transition-all duration-200 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </footer>
    </div>
  );
};
