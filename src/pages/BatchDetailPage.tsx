import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  MessageCircle,
  Phone,
  GraduationCap,
  Scissors,
  ShieldCheck,
  Check
} from 'lucide-react';
import { BatchItem } from '../types';
import { batchService } from '../services/batchService';
import { BRAND, buildWhatsAppUrl } from '../data/brandData';
import { Button } from '../components/ui/Button';
import { usePageSEO } from '../hooks/usePageSEO';
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';
import { formatEventDateRange } from '../utils/dateUtils';

export const BatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [batch, setBatch] = useState<BatchItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Default slug if on /batches/hair-cutting-masterclass
  const currentSlug = id || 'hair-cutting-masterclass';

  useEffect(() => {
    let mounted = true;
    batchService.getBatchBySlugOrId(currentSlug).then(data => {
      if (mounted) {
        setBatch(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [currentSlug]);

  usePageSEO({
    title: batch
      ? `${batch.title} | SK Relax Beauty Academy Satara`
      : 'Course Batch Details | SK Relax Beauty Academy Satara',
    description: batch
      ? `${batch.description.slice(0, 150)}... Enrol now at SK Relax in Satara.`
      : 'Explore comprehensive beauty academy masterclasses and professional salon training batches in Satara.',
    path: `/batches/${currentSlug}`,
    image: batch?.image || '/images/academy/hair-cutting-masterclass-poster.jpg',
    schema: [
      generateLocalBusinessSchema(),
      generateBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Batches', path: '/batches' },
        { name: batch?.title || 'Batch Details', path: `/batches/${currentSlug}` }
      ])
    ]
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center text-forest-700 font-sans text-sm">
        Loading batch details...
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-serif text-3xl text-forest-900 mb-3">Batch Not Found</h1>
        <p className="text-forest-600 text-sm max-w-md mb-6 font-sans">
          The requested academy batch or masterclass could not be located. Please check our upcoming schedule.
        </p>
        <Button to="/batches" variant="primary" size="md" icon={<ArrowLeft size={14} />}>
          View All Batches
        </Button>
      </div>
    );
  }

  const isCompleted = batch.status === 'completed';
  const isOneDay =
    !batch.endDate ||
    batch.startDate === batch.endDate ||
    (batch.duration && batch.duration.toLowerCase().includes('1 day')) ||
    (batch.duration && batch.duration.toLowerCase().includes('one day'));
  const hasDummyHead =
    batch.included &&
    batch.included.some(item =>
      item.toLowerCase().includes('dummy') || item.toLowerCase().includes('mannequin')
    );
  const dateDisplay = formatEventDateRange(batch.startDate, batch.endDate, true);

  const whatsappUrl = buildWhatsAppUrl(
    batch.whatsappPreset ||
      `Hello Salma Ma'am, I would like to reserve my seat for the ${batch.title} (${dateDisplay}) at SK Relax Beauty Academy in Satara.`
  );

  return (
    <div className="bg-ivory text-forest-900 min-h-screen">
      {/* Editorial Header */}
      <section className="bg-forest-950 text-ivory py-10 sm:py-14 border-b border-forest-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-sans text-ivory-400 mb-6">
            <Link to="/" className="hover:text-gold-300 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/batches" className="hover:text-gold-300 transition-colors">
              Batches
            </Link>
            <span>/</span>
            <span className="text-gold-300 truncate max-w-xs">{batch.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-forest-900 border border-gold-500/30 text-gold-300 text-xs font-sans tracking-widest uppercase inline-flex items-center gap-1.5">
              <GraduationCap size={13} className="text-gold-400" />
              <span>{batch.category.toUpperCase()}</span>
            </span>

            {batch.badge && (
              <span className="px-3 py-1 rounded-full bg-gold-400 text-forest-950 text-xs font-sans font-bold tracking-wider uppercase">
                {batch.badge}
              </span>
            )}

            {batch.status === 'enrolling' && (
              <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-sans font-bold tracking-wider uppercase">
                Admissions Open
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight max-w-4xl">
            {batch.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-ivory-200/90 font-sans">
            <div className="inline-flex items-center gap-2">
              <Calendar size={15} className="text-rose-400" />
              <span>{dateDisplay}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Clock size={15} className="text-gold-400" />
              <span>{batch.timing}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <MapPin size={15} className="text-emerald-400" />
              <span>{batch.venue || 'SK Relax Studio, Satara'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-12 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Column — Curriculum, Inclusions & Details */}
            <div className="lg:col-span-7 space-y-10">
              {/* Overview */}
              <div>
                <h2 className="font-serif text-2xl text-forest-900 font-light mb-4">
                  About This Masterclass
                </h2>
                <p className="text-forest-700 leading-relaxed font-sans text-sm sm:text-base">
                  {batch.description}
                </p>
              </div>

              {/* What Is Included */}
              <div className="bg-cream-100 p-6 sm:p-8 rounded-sm border border-forest-900/10 shadow-soft">
                <div className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.2em] text-rose-600 mb-4">
                  <Sparkles size={14} />
                  <span>Everything Included In Your Fee</span>
                </div>
                <h3 className="font-serif text-2xl text-forest-900 font-light mb-6">
                  What You Receive
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {batch.included.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-forest-800 font-sans">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} />
                      </div>
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day-by-Day Curriculum or One-Day Schedule */}
              <div>
                <div className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.2em] text-rose-600 mb-2">
                  <Scissors size={14} />
                  <span>
                    {isOneDay
                      ? 'Hands-on Demonstrations & Technique Breakdown'
                      : 'Structured Hands-on Training'}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-forest-900 font-light mb-6">
                  {isOneDay ? 'One-Day Workshop Schedule' : 'Syllabus & Daily Breakdown'}
                </h3>

                {batch.curriculum && batch.curriculum.length > 0 ? (
                  <div className="space-y-3">
                    {batch.curriculum.map((topic, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 rounded-sm border border-forest-900/10 shadow-xs flex items-start gap-3.5"
                      >
                        <span className="w-6 h-6 rounded-full bg-forest-900 text-gold-300 font-serif text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="text-xs sm:text-sm text-forest-850 font-sans leading-relaxed">
                          {topic}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-sm border border-forest-900/10 text-center">
                    <p className="text-sm font-sans text-forest-600 italic">
                      Workshop schedule will be announced soon.
                    </p>
                  </div>
                )}
              </div>

              {/* Prerequisites & Eligibility */}
              {batch.prerequisites && (
                <div className="bg-white p-6 rounded-sm border border-forest-900/10">
                  <h4 className="font-serif text-lg text-forest-900 font-medium mb-2 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-forest-900" />
                    <span>Eligibility & Prerequisites</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-forest-700 leading-relaxed font-sans">
                    {batch.prerequisites}
                  </p>
                </div>
              )}

              {/* Trainer Spotlight */}
              <div className="bg-cream-50 p-6 sm:p-8 rounded-sm border border-forest-900/10 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-gold-500/40 shrink-0 shadow-soft">
                  <img
                    src="/images/team/salma-attar-founder.jpg"
                    alt="Salma Attar - Founder & Lead Educator"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-rose-600 font-sans font-semibold block mb-1">
                    Lead Educator & Mentor
                  </span>
                  <h4 className="font-serif text-2xl text-forest-900">{batch.leadTrainer}</h4>
                  <p className="mt-2 text-xs text-forest-700 leading-relaxed font-sans">
                    Founder of SK Relax Beauty Academy & Salon in Satara. Personally guides every student on finger grips, elevation degrees, blade angles, and client communication.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column — Sticky Booking Box & Poster */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 space-y-6">
                {/* Poster Card */}
                <div className="bg-white rounded-sm border border-forest-900/10 shadow-card overflow-hidden">
                  <div className="relative aspect-[4/5] bg-forest-950 overflow-hidden flex items-center justify-center p-2.5">
                    {/* Ambient Background */}
                    <img
                      src={batch.image}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-forest-950/40 pointer-events-none" />

                    {/* Complete Uncropped Poster */}
                    <img
                      src={batch.image}
                      alt={batch.title}
                      className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain mx-auto drop-shadow-md"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-forest-950/90 via-forest-950/40 to-transparent pointer-events-none z-15" />
                    <div className="absolute bottom-4 left-4 right-4 text-white z-20">
                      <span className="text-[10px] uppercase font-sans font-bold tracking-widest bg-forest-900/95 border border-gold-500/30 text-gold-300 px-2.5 py-1 rounded-sm inline-block mb-1 shadow-sm">
                        Satara Workshop
                      </span>
                      <h4 className="font-serif text-lg leading-tight text-ivory drop-shadow-sm">{batch.title}</h4>
                    </div>
                  </div>

                  {/* Pricing & Booking Action */}
                  <div className="p-6">
                    <div className="flex items-baseline justify-between border-b border-forest-900/10 pb-4 mb-4">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-forest-500 block font-sans">
                          All-Inclusive Fee
                        </span>
                        <div className="text-3xl font-serif text-forest-900 font-bold">
                          {batch.feeDisplay || `₹${batch.fee.toLocaleString('en-IN')}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-forest-500 block font-sans">
                          Seat Availability
                        </span>
                        {isCompleted ? (
                          <span className="text-xs font-sans text-neutral-500 font-medium">Archived</span>
                        ) : batch.totalSeats && batch.totalSeats > 0 && batch.seatsRemaining !== undefined ? (
                          <span className="text-sm font-sans font-bold text-emerald-700">
                            {batch.seatsRemaining} of {batch.totalSeats} seats left
                          </span>
                        ) : (
                          <span className="text-sm font-sans font-bold text-emerald-700">
                            Admissions Open
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {!isCompleted ? (
                        <>
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-sm font-semibold tracking-wider transition-colors shadow-md"
                          >
                            <MessageCircle size={18} />
                            <span>Book Seat via WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${BRAND.whatsappNumber}`}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm border border-forest-900/20 text-forest-900 hover:bg-forest-900 hover:text-white font-sans text-xs font-semibold tracking-wider transition-colors"
                          >
                            <Phone size={14} />
                            <span>Call Studio ({BRAND.phone})</span>
                          </a>
                        </>
                      ) : (
                        <div className="p-4 bg-neutral-100 rounded-sm text-center">
                          <p className="text-xs text-neutral-600 font-sans mb-3">
                            This batch has concluded. You can request admission into our next scheduled session.
                          </p>
                          <a
                            href={buildWhatsAppUrl(`Hello Salma Ma'am, please notify me when the next ${batch.title} batch is announced in Satara.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-forest-900 text-ivory text-xs font-sans font-semibold"
                          >
                            <MessageCircle size={14} />
                            <span>Join Next Batch Waitlist</span>
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-forest-900/5 text-[11px] text-forest-600 font-sans space-y-1.5">
                      {hasDummyHead && (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-gold-600 shrink-0" />
                          <span>Includes mannequin dummy head to take home</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-gold-600 shrink-0" />
                        <span>Instant WhatsApp confirmation & receipt</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-gold-600 shrink-0" />
                        <span>Official SK Relax Certificate upon completion</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-gold-600 shrink-0" />
                        <span>Venue: {batch.venue || 'SK Relax Studio, Satara'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
