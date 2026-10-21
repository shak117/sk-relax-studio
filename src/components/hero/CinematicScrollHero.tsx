import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Sparkles, 
  Scissors, 
  Calendar, 
  MessageCircle, 
  GraduationCap, 
  ArrowDown, 
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useFrameSequence } from '../../hooks/useFrameSequence';

gsap.registerPlugin(ScrollTrigger);

interface CinematicScrollHeroProps {
  onServicesClick?: () => void;
}

export const CinematicScrollHero: React.FC<CinematicScrollHeroProps> = ({
  onServicesClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Current progress tracked via ref to prevent 60fps React re-render thrashing
  const progressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Active stage (0, 1, 2, 3) for clean, performant React updates
  const [activeStage, setActiveStage] = useState<number>(0);
  // Current frame counter display (throttled to avoid re-rendering every frame)
  const [displayedFrame, setDisplayedFrame] = useState<number>(1);
  const lastFrameUpdateRef = useRef<number>(1);

  const reducedMotion = useReducedMotion();
  const { initialReady, getFrameAtProgress, poster, totalFrames } = useFrameSequence();

  // Draw frame on canvas with cover crop & high-DPI scaling
  const drawFrame = useCallback((img: HTMLImageElement | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.floor(width * dpr);
    const targetH = Math.floor(height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = width / height;
      let drawW: number;
      let drawH: number;
      let offX: number;
      let offY: number;

      if (canvasRatio > imgRatio) {
        drawW = width;
        drawH = width / imgRatio;
        offX = 0;
        offY = (height - drawH) / 2;
      } else {
        drawW = height * imgRatio;
        drawH = height;
        offX = (width - drawW) / 2;
        offY = 0;
      }

      ctx.drawImage(img, offX, offY, drawW, drawH);
    } else {
      ctx.fillStyle = '#0F2417'; // forest-950
      ctx.fillRect(0, 0, width, height);
    }

    ctx.restore();
  }, []);

  // RAF-throttled canvas rendering
  const scheduleDraw = useCallback((prog: number) => {
    progressRef.current = prog;

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      const img = getFrameAtProgress(progressRef.current);
      drawFrame(img);

      // Throttled frame counter update (update at most every 4 frames)
      const currentIdx = Math.min(totalFrames, Math.floor(progressRef.current * (totalFrames - 1)) + 1);
      if (Math.abs(currentIdx - lastFrameUpdateRef.current) >= 4 || currentIdx === 1 || currentIdx === totalFrames) {
        lastFrameUpdateRef.current = currentIdx;
        setDisplayedFrame(currentIdx);
      }

      // Update active stage only when boundary crossed
      let newStage = 0;
      if (progressRef.current >= 0.74) {
        newStage = 3;
      } else if (progressRef.current >= 0.48) {
        newStage = 2;
      } else if (progressRef.current >= 0.22) {
        newStage = 1;
      }

      setActiveStage((prev) => (prev !== newStage ? newStage : prev));
      rafIdRef.current = null;
    });
  }, [drawFrame, getFrameAtProgress, totalFrames]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      scheduleDraw(progressRef.current);
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [scheduleDraw]);

  // Initial draw once first frame ready
  useEffect(() => {
    if (initialReady) {
      scheduleDraw(0);
    }
  }, [initialReady, scheduleDraw]);

  // GSAP ScrollTrigger with robust PINNING (pin: true)
  useEffect(() => {
    if (reducedMotion) return;

    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    // Use GSAP's native pin mechanism for bulletproof locking across all browsers
    const trigger = ScrollTrigger.create({
      trigger: container,
      pin: stage,
      start: 'top top',
      end: '+=2800', // Configured scroll duration in pixels (~350vh equivalent)
      scrub: 0.25,  // Fast, responsive bi-directional scrub
      anticipatePin: 1,
      onUpdate: (self) => {
        scheduleDraw(self.progress);
      },
    });

    scrollTriggerRef.current = trigger;

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      trigger.kill();
      scrollTriggerRef.current = null;
    };
  }, [reducedMotion, scheduleDraw]);

  // Helper to scroll to specific stage milestone
  const scrollToStage = (stageIndex: number) => {
    const trigger = scrollTriggerRef.current;
    if (!trigger) return;

    const progressMilestones = [0.05, 0.35, 0.62, 0.88];
    const targetProg = progressMilestones[stageIndex] ?? 0;
    const targetScrollY = trigger.start + targetProg * (trigger.end - trigger.start);

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  };

  // Skip animation directly to salon introduction
  const handleSkipToContent = () => {
    const target = document.getElementById('brand-intro');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If user has prefers-reduced-motion, provide static, accessible view
  if (reducedMotion) {
    return (
      <section 
        className="relative w-full min-h-[90svh] lg:min-h-[100svh] flex items-center justify-center bg-forest-950 text-ivory py-20 px-4"
        aria-label="SK Relax Beauty Salon Introduction"
      >
        <img
          src={poster}
          alt="SK Relax Beauty Salon Satara Hair Craft"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-forest-950/80 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900/80 border border-gold-500/30 text-gold-300 text-xs tracking-[0.25em] uppercase">
            <Sparkles size={13} className="text-gold-400" />
            <span>SK RELAX BEAUTY ACADEMY & SALON · SATARA</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-ivory">
            Your Beauty. <span className="italic text-gold-300 font-normal">Your Signature.</span>
          </h1>
          <p className="text-ivory-200 text-base md:text-lg max-w-2xl mx-auto font-sans font-light">
            Discover the art of beauty, professional styling, and personalised care at SK Relax.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button to="/booking" variant="gold" size="lg" icon={<Calendar size={16} />}>
              BOOK YOUR APPOINTMENT
            </Button>
            <Button to="/services" variant="outline" size="lg" icon={<Scissors size={15} />}>
              EXPLORE OUR SERVICES
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-forest-950 select-none"
      aria-label="SK Relax Cinematic Scroll Experience"
    >
      {/* Visual Stage Container (Pinned by GSAP ScrollTrigger) */}
      <div 
        ref={stageRef}
        className="w-full h-[100svh] min-h-[580px] overflow-hidden flex items-center justify-center relative bg-forest-950"
      >
        {/* HTML5 Canvas — 720 Combined Frames (Part 1 -> Part 2 -> Part 3) */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
          style={{ opacity: initialReady ? 1 : 0 }}
        />

        {/* Initial Poster Fallback while frames stream */}
        {!initialReady && (
          <img
            src={poster}
            alt="SK Relax Beauty Salon Masterclass"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-60 pointer-events-none"
          />
        )}

        {/* Subtle Dark Forest Overlay for Crisp High-Contrast Typography */}
        <div 
          className="absolute inset-0 bg-forest-950/45 mix-blend-multiply pointer-events-none"
          aria-hidden="true"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-b from-forest-950/80 via-forest-950/30 to-forest-950/85 pointer-events-none"
          aria-hidden="true"
        />
        {/* Subtle Luxury Pattern / Grain Touch */}
        <div 
          className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none"
          style={{ backgroundImage: `radial-gradient(#CAA454 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
        />

        {/* STAGE 1: Salon Reveal */}
        <div 
          className={`absolute inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8 pointer-events-none transition-all duration-500 ease-out ${
            activeStage === 0 ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible'
          }`}
        >
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center pointer-events-auto">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-forest-900/80 backdrop-blur-md border border-gold-500/30 text-gold-300 text-[11px] sm:text-xs font-sans tracking-[0.25em] uppercase mb-6 sm:mb-8 animate-fade-in shadow-soft">
              <Sparkles size={13} className="text-gold-400" />
              <span>SK RELAX BEAUTY ACADEMY & SALON · SATARA</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-ivory leading-[1.08] sm:leading-[1.05] max-w-4xl text-balance drop-shadow-md">
              Your Beauty.
              <span className="block font-serif italic text-gold-300 font-normal sm:mt-1 drop-shadow-sm">
                Your Signature.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-ivory-200/95 max-w-2xl font-sans font-light leading-relaxed drop-shadow-sm">
              Discover the art of beauty, professional styling, and personalised care.
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

            {/* Scroll hint */}
            <div className="mt-8 inline-flex items-center gap-2 text-xs text-ivory-400/80 font-sans tracking-widest uppercase">
              <ArrowDown size={13} className="animate-bounce text-gold-400" />
              <span>Scroll to experience salon artistry</span>
            </div>
          </div>
        </div>

        {/* STAGE 2: Professional Artistry */}
        <div 
          className={`absolute inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8 pointer-events-none transition-all duration-500 ease-out ${
            activeStage === 1 ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible'
          }`}
        >
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/60 backdrop-blur-md border border-rose-400/30 text-rose-300 text-xs font-sans tracking-[0.2em] uppercase mb-5">
              <Scissors size={12} className="text-rose-300" />
              <span>Signature Hair Artistry</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-ivory leading-tight drop-shadow-md">
              Precision. <span className="font-serif italic text-gold-300 font-normal">Technique.</span> Artistry.
            </h2>

            <p className="mt-5 text-sm sm:text-base md:text-lg text-ivory-200/90 max-w-2xl font-sans font-light leading-relaxed drop-shadow-sm">
              Bespoke scissor work, precision contouring, and modern layering crafted around your unique profile. Every cut is an individualized creation.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {['Butterfly Layers', 'Curtain Bangs', 'Feather Tapering', 'Face Framing'].map((technique, i) => (
                <span 
                  key={i} 
                  className="px-3.5 py-1 rounded-sm bg-forest-900/70 border border-gold-500/20 text-xs font-sans text-gold-200 tracking-wider uppercase"
                >
                  {technique}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* STAGE 3: Beauty Services & Academy */}
        <div 
          className={`absolute inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8 pointer-events-none transition-all duration-500 ease-out ${
            activeStage === 2 ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible'
          }`}
        >
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-900/80 backdrop-blur-md border border-gold-500/30 text-gold-300 text-xs font-sans tracking-[0.2em] uppercase mb-5">
              <GraduationCap size={14} className="text-gold-400" />
              <span>Academy & Studio Menu</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-ivory leading-tight drop-shadow-md">
              Where Beauty <span className="font-serif italic text-rose-300 font-normal">Meets Creativity.</span>
            </h2>

            <p className="mt-5 text-sm sm:text-base md:text-lg text-ivory-200/90 max-w-2xl font-sans font-light leading-relaxed drop-shadow-sm">
              From restorative skincare and bridal glam to hands-on professional beauty education.
            </p>

            <div className="mt-4 text-xs sm:text-sm font-serif italic text-gold-300">
              “Learn ♡ Practice ♡ Grow”
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Button
                to="/batches"
                variant="gold"
                size="md"
                className="w-full sm:w-auto uppercase tracking-wider"
                icon={<GraduationCap size={15} />}
              >
                EXPLORE COURSE BATCHES
              </Button>

              <Button
                to="/services"
                variant="outline"
                size="md"
                className="w-full sm:w-auto border-ivory/50 text-ivory hover:text-forest-950 hover:bg-ivory uppercase tracking-wider"
                icon={<ChevronRight size={14} />}
              >
                EXPLORE SERVICE MENU
              </Button>
            </div>
          </div>
        </div>

        {/* STAGE 4: Final Reveal & Next Look */}
        <div 
          className={`absolute inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8 pointer-events-none transition-all duration-500 ease-out ${
            activeStage === 3 ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible'
          }`}
        >
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/60 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-sans tracking-[0.2em] uppercase mb-5">
              <Sparkle size={13} className="text-emerald-300" />
              <span>Step Into Your Transformation</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-ivory leading-tight drop-shadow-md">
              Ready for Your <span className="font-serif italic text-gold-300 font-normal">Next Look?</span>
            </h2>

            <p className="mt-5 text-sm sm:text-base md:text-lg text-ivory-200/90 max-w-2xl font-sans font-light leading-relaxed drop-shadow-sm">
              Discover your next style at SK Relax Beauty Academy & Salon. Schedule your visit or chat directly with our team in Satara.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Button
                to="/booking"
                variant="gold"
                size="lg"
                className="w-full sm:w-auto uppercase tracking-wider font-semibold shadow-luxury"
                icon={<Calendar size={16} />}
              >
                BOOK AN APPOINTMENT
              </Button>

              <Button
                href="https://wa.me/918459890270?text=Hello%20SK%20Relax%20Satara,%20I%20would%20like%20to%20enquire%20about%20booking%20a%20salon%20appointment."
                external
                variant="whatsapp"
                size="lg"
                className="w-full sm:w-auto uppercase tracking-wider font-semibold shadow-soft"
                icon={<MessageCircle size={16} />}
              >
                CHAT ON WHATSAPP
              </Button>
            </div>
          </div>
        </div>

        {/* Milestone Indicator on Right Edge (Interactive Dots) */}
        <div className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-3 z-30 pointer-events-auto">
          {[
            { label: 'Reveal', stage: 0 },
            { label: 'Artistry', stage: 1 },
            { label: 'Batches', stage: 2 },
            { label: 'Next Look', stage: 3 },
          ].map((item) => (
            <button
              key={item.stage}
              onClick={() => scrollToStage(item.stage)}
              className="group flex items-center justify-end gap-2 focus:outline-none cursor-pointer py-1"
              aria-label={`Jump to ${item.label} stage`}
            >
              <span className={`text-[10px] uppercase font-sans tracking-widest transition-all duration-300 ${
                activeStage === item.stage ? 'text-gold-300 font-semibold opacity-100' : 'text-ivory-400/60 opacity-0 group-hover:opacity-100'
              }`}>
                {item.label}
              </span>
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeStage === item.stage 
                  ? 'bg-gold-400 scale-125 ring-4 ring-gold-400/30' 
                  : 'bg-ivory/30 group-hover:bg-ivory/70'
              }`} />
            </button>
          ))}
        </div>

        {/* Discrete Skip Button to jump past animation to Salon Menu */}
        <button
          onClick={handleSkipToContent}
          className="absolute top-6 right-6 z-30 hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest-900/60 hover:bg-forest-900/90 border border-ivory/20 text-ivory-300 hover:text-gold-300 text-[11px] font-sans uppercase tracking-widest backdrop-blur-md transition-all cursor-pointer"
          aria-label="Skip animation and explore salon catalogue"
        >
          <span>Skip to Menu</span>
          <ArrowDown size={11} />
        </button>

        {/* Cinematic Scrub Timeline Bar at Bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-forest-900/60 z-30 pointer-events-none">
          <div 
            className="h-full bg-gradient-to-r from-gold-500 via-rose-400 to-gold-400 transition-all duration-75"
            style={{ width: `${(displayedFrame / totalFrames) * 100}%` }}
          />
        </div>

        {/* Frame Progress Counter (Subtle Luxury Monospace Pill) */}
        <div className="absolute bottom-4 left-6 z-30 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-forest-950/70 backdrop-blur-md border border-ivory/10 text-[10px] uppercase tracking-widest font-mono text-ivory-300/80 pointer-events-none">
          <span className="text-gold-400 font-bold">FRAME {displayedFrame}</span>
          <span className="opacity-40">/</span>
          <span>{totalFrames}</span>
        </div>
      </div>
    </div>
  );
};
