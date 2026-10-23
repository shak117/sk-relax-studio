import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  GraduationCap,
  Scissors,
  ShieldCheck,
  Search,
  BookOpen
} from 'lucide-react';
import { BatchItem, BatchCategory, BatchStatus } from '../types';
import { batchService } from '../services/batchService';
import { buildWhatsAppUrl } from '../data/brandData';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';
import { formatEventDateRange, isDateInPast } from '../utils/dateUtils';

export const BatchesPage: React.FC = () => {
  usePageSEO({
    title: 'Upcoming Course Batches & Masterclasses | SK Relax Beauty Academy Satara',
    description: 'Explore upcoming salon courses and masterclasses in Satara. Featuring the 3-Day Hair Cutting Masterclass (Oct 23–25, 2026, ₹4,000 with dummy mannequin) and professional diplomas.',
    path: '/batches',
    image: '/images/academy/hair-cutting-masterclass-poster.jpg',
    schema: [
      generateLocalBusinessSchema(),
      generateBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Batches', path: '/batches' }
      ])
    ]
  });

  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | BatchStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | BatchCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    batchService.getBatches().then(data => {
      if (mounted) {
        setBatches(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Helper to determine if a batch's end date has passed
  const isBatchExpired = (batch: BatchItem): boolean => {
    return isDateInPast(batch.endDate || batch.startDate);
  };

  // Compute effective status with automatic completion for past dates
  const getEffectiveStatus = (batch: BatchItem): BatchStatus => {
    if (batch.status === 'draft') return 'draft';
    if (batch.status === 'completed') return 'completed';
    if (isBatchExpired(batch)) {
      return 'completed';
    }
    return batch.status;
  };

  const filteredBatches = batches.filter(batch => {
    if (batch.status === 'draft') return false;
    const effectiveStatus = getEffectiveStatus(batch);
    if (statusFilter !== 'all' && effectiveStatus !== statusFilter) return false;
    if (categoryFilter !== 'all' && batch.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = batch.title.toLowerCase().includes(q);
      const matchDesc = batch.description.toLowerCase().includes(q);
      const matchCurriculum = batch.curriculum.some(c => c.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchCurriculum) return false;
    }
    return true;
  });

  // Featured flagship batch (Hair Cutting Masterclass)
  const flagship = batches.find(b => b.slug === 'hair-cutting-masterclass' || b.id.includes('hair-cutting'));
  const isFlagshipExpired = flagship ? isBatchExpired(flagship) : false;

  return (
    <div className="bg-ivory text-forest-900 min-h-screen">
      {/* Editorial Header */}
      <section className="bg-forest-950 text-ivory py-12 sm:py-16 relative overflow-hidden border-b border-forest-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-gold-500/30 text-gold-300 text-xs font-sans tracking-widest uppercase mb-4">
            <GraduationCap size={13} className="text-gold-400" />
            <span>Academy Batches · Satara</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight">
            Upcoming Academy <span className="font-serif italic text-gold-300">Batches & Masterclasses</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-ivory-200/85 max-w-2xl mx-auto font-sans leading-relaxed">
            Reserve your seat for real hands-on training with personal mannequin dummy heads, aesthetic equipment, and step-by-step guidance by founder Salma Attar.
          </p>
        </div>
      </section>

      {/* Flagship Masterclass Hero Spotlight */}
      {flagship && (
        <section className="py-10 bg-cream-100 border-b border-forest-900/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-sm border-2 border-gold-500/40 shadow-card overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Poster / Visual */}
                <div className="lg:col-span-5 relative bg-forest-950 min-h-[360px] lg:min-h-[460px] overflow-hidden flex items-center justify-center p-3">
                  {/* Ambient Backdrop */}
                  <img
                    src={flagship.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-110 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-forest-950/40 pointer-events-none" />

                  {/* Complete Original Poster */}
                  <img
                    src={flagship.image}
                    alt={flagship.title}
                    className="relative z-10 max-h-[480px] w-auto h-auto object-contain mx-auto drop-shadow-xl"
                  />
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-forest-950/80 via-transparent to-transparent pointer-events-none z-15" />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent pointer-events-none z-15" />

                  <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
                    <span className={`px-3 py-1 text-xs font-sans font-bold uppercase tracking-wider rounded-sm shadow-md ${
                      isFlagshipExpired ? 'bg-neutral-700 text-neutral-200' : 'bg-rose-600 text-white'
                    }`}>
                      {isFlagshipExpired ? 'Batch Concluded' : 'Featured Masterclass'}
                    </span>
                    <span className="px-3 py-1 text-xs font-sans font-semibold uppercase tracking-wider bg-gold-500 text-forest-950 rounded-sm shadow-md">
                      Dummy Head Included
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-forest-600 mb-2">
                      <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                        <Calendar size={13} />
                        {formatEventDateRange(flagship.startDate, flagship.endDate)}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={13} />
                        {flagship.timing}
                      </span>
                      <span>·</span>
                      {isFlagshipExpired ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-sm">
                          Completed · Next Batch Dates Coming Soon
                        </span>
                      ) : flagship.totalSeats && flagship.totalSeats > 0 && flagship.seatsRemaining !== undefined ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                          <Users size={12} />
                          {flagship.seatsRemaining} of {flagship.totalSeats} seats left
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                          <Users size={12} />
                          Admissions Open
                        </span>
                      )}
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl text-forest-900 font-normal leading-snug">
                      {flagship.title}
                    </h2>

                    <p className="mt-3 text-xs sm:text-sm text-forest-700 leading-relaxed font-sans">
                      {flagship.description}
                    </p>

                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-forest-800 font-sans">
                      {flagship.included.slice(0, 4).map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-gold-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-forest-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-forest-500 block font-sans">
                        Complete Workshop Fee
                      </span>
                      <div className="text-2xl sm:text-3xl font-serif text-forest-900 font-semibold">
                        {flagship.feeDisplay || `₹${flagship.fee.toLocaleString('en-IN')}`}
                        <span className="text-xs font-sans font-normal text-forest-600 ml-1.5">all-inclusive</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                      <Link
                        to={`/batches/${flagship.slug}`}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-forest-900 text-ivory text-xs font-sans font-semibold tracking-wider hover:bg-forest-800 transition-colors flex-1 sm:flex-initial"
                      >
                        <BookOpen size={14} />
                        <span>View Full Syllabus</span>
                      </Link>

                      <a
                        href={buildWhatsAppUrl(flagship.whatsappPreset || `Hello Salma Ma'am, I want to book my seat for the ${flagship.title}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans font-semibold tracking-wider transition-colors flex-1 sm:flex-initial shadow-md"
                      >
                        <MessageCircle size={14} />
                        <span>Enquire on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filters & Catalogue Section */}
      <section className="py-12 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Batches' },
                { id: 'enrolling', label: 'Enrolling Now' },
                { id: 'upcoming', label: 'Upcoming Batches' },
                { id: 'completed', label: 'Completed' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans transition-colors ${
                    statusFilter === tab.id
                      ? 'bg-forest-900 text-ivory font-semibold shadow-sm'
                      : 'bg-cream-200 text-forest-800 hover:bg-cream-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative max-w-xs w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-400" />
              <input
                type="text"
                placeholder="Search masterclass or topic..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-forest-900/15 rounded-sm focus:outline-none focus:border-forest-900 text-forest-900 font-sans"
              />
            </div>
          </div>

          {/* Batches Grid */}
          {loading ? (
            <div className="py-20 text-center text-forest-600 font-sans text-sm">
              Loading academy batches...
            </div>
          ) : filteredBatches.length === 0 ? (
            <div className="py-16 text-center bg-cream-50 rounded-sm border border-forest-900/10 p-8">
              <p className="font-serif text-lg text-forest-900">No batches found matching your filter.</p>
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs text-rose-600 underline font-sans"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBatches.map((batch, idx) => {
                const effectiveStatus = getEffectiveStatus(batch);
                const isEnrolling = effectiveStatus === 'enrolling';
                const isUpcoming = effectiveStatus === 'upcoming';
                const isCompleted = effectiveStatus === 'completed';

                return (
                  <ScrollReveal key={batch.id} delay={idx * 60}>
                    <div className="bg-white rounded-sm border border-forest-900/10 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col h-full overflow-hidden group">
                      {/* Image Banner Container with Increased Height & Full Original Poster Display */}
                      <div className="relative h-80 sm:h-96 md:h-[400px] lg:h-[440px] w-full overflow-hidden bg-forest-950 flex items-center justify-center p-2.5">
                        {/* Ambient Blurred Background to seamlessly match poster colors without harsh black bars */}
                        <img
                          src={batch.image}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-forest-950/40 pointer-events-none" />

                        {/* Full Original Poster (100% complete, uncropped, preserving original aspect ratio) */}
                        <img
                          src={batch.image}
                          alt={batch.title}
                          loading="lazy"
                          className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain mx-auto rounded-xs group-hover:scale-[1.02] transition-transform duration-500 drop-shadow-md"
                        />

                        {/* Readability Gradients behind corner badges */}
                        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-forest-950/75 via-forest-950/30 to-transparent pointer-events-none z-15" />
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-forest-950/80 via-forest-950/30 to-transparent pointer-events-none z-15" />

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20 pointer-events-none">
                          {isEnrolling && (
                            <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-sans font-bold uppercase tracking-wider bg-rose-600 text-white shadow-md">
                              Enrolling Now
                            </span>
                          )}
                          {isUpcoming && (
                            <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-sans font-bold uppercase tracking-wider bg-forest-800 text-gold-300 border border-gold-500/30 shadow-md">
                              Upcoming
                            </span>
                          )}
                          {isCompleted && (
                            <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-sans font-bold uppercase tracking-wider bg-neutral-800 text-neutral-100 shadow-md">
                              Completed
                            </span>
                          )}
                          {batch.badge && (
                            <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-sans font-semibold uppercase tracking-wider bg-gold-400 text-forest-950 shadow-md">
                              {batch.badge}
                            </span>
                          )}
                        </div>

                        {/* Category */}
                        <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
                          <span className="text-[10px] font-sans uppercase tracking-widest text-white/95 bg-forest-950/90 border border-white/10 px-2.5 py-0.5 rounded-sm backdrop-blur-xs shadow-sm">
                            {batch.category}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 flex flex-col justify-between flex-1">
                        <div>
                          {/* Timing & Dates */}
                          <div className="flex items-center gap-2 text-[11px] text-forest-600 font-sans mb-2">
                            <Calendar size={12} className="text-rose-600 shrink-0" />
                            <span>
                              {formatEventDateRange(batch.startDate, batch.endDate)}
                            </span>
                          </div>

                          <h3 className="font-serif text-xl text-forest-900 font-normal leading-snug group-hover:text-rose-600 transition-colors">
                            {batch.title}
                          </h3>

                          <p className="mt-2 text-xs text-forest-700/90 font-sans line-clamp-2 leading-relaxed">
                            {batch.description}
                          </p>

                          {/* Quick Included Items */}
                          <div className="mt-4 pt-4 border-t border-forest-900/5 space-y-1.5">
                            {batch.included.slice(0, 3).map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-forest-800 font-sans">
                                <CheckCircle2 size={12} className="text-gold-600 shrink-0" />
                                <span className="truncate">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Footer & Actions */}
                        <div className="mt-6 pt-4 border-t border-forest-900/10">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-forest-500 block font-sans">
                                Course Fee
                              </span>
                              <span className="text-xl font-serif text-forest-900 font-semibold">
                                {batch.feeDisplay || `₹${batch.fee.toLocaleString('en-IN')}`}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] uppercase tracking-wider text-forest-500 block font-sans">
                                Availability
                              </span>
                              {isCompleted ? (
                                <span className="text-xs font-sans text-neutral-500 font-medium">Archived</span>
                              ) : batch.totalSeats && batch.totalSeats > 0 && batch.seatsRemaining !== undefined ? (
                                <span className="text-xs font-sans font-semibold text-emerald-700">
                                  {batch.seatsRemaining} seats left
                                </span>
                              ) : (
                                <span className="text-xs font-sans font-semibold text-emerald-700">
                                  Admissions Open
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <Link
                              to={`/batches/${batch.slug}`}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm border border-forest-900/20 text-forest-900 hover:bg-forest-900 hover:text-white text-xs font-sans font-semibold transition-colors"
                            >
                              <span>Details</span>
                              <ArrowRight size={12} />
                            </Link>

                            <a
                              href={buildWhatsAppUrl(
                                batch.whatsappPreset ||
                                  `Hello Salma Ma'am, I am interested in enrolling for the ${batch.title} at SK Relax Academy Satara.`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans font-semibold transition-colors shadow-xs"
                            >
                              <MessageCircle size={13} />
                              <span>Enquire</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Academy Standards & Private Consultation */}
      <section className="py-12 bg-cream-100 border-t border-forest-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-sm border border-forest-900/10 shadow-soft">
              <div className="w-10 h-10 rounded-full bg-forest-50 flex items-center justify-center text-forest-900 mb-4">
                <Scissors size={18} />
              </div>
              <h4 className="font-serif text-lg text-forest-900 font-medium mb-1">
                Personal Dummy Practice
              </h4>
              <p className="text-xs text-forest-700 leading-relaxed font-sans">
                No sharing tools or sitting idle. Every student in our hair cutting masterclasses gets an individual mannequin dummy head for complete hands-on execution.
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm border border-forest-900/10 shadow-soft">
              <div className="w-10 h-10 rounded-full bg-forest-50 flex items-center justify-center text-forest-900 mb-4">
                <ShieldCheck size={18} />
              </div>
              <h4 className="font-serif text-lg text-forest-900 font-medium mb-1">
                Authentic Certification
              </h4>
              <p className="text-xs text-forest-700 leading-relaxed font-sans">
                Official certificates of completion awarded upon demonstrating proper elevation degree control, precision sectioning, and clean salon finishing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm border border-forest-900/10 shadow-soft">
              <div className="w-10 h-10 rounded-full bg-forest-50 flex items-center justify-center text-forest-900 mb-4">
                <Users size={18} />
              </div>
              <h4 className="font-serif text-lg text-forest-900 font-medium mb-1">
                Direct Founder Mentorship
              </h4>
              <p className="text-xs text-forest-700 leading-relaxed font-sans">
                Salma Attar personally leads every demo, checks student grip angles, and provides 1-on-1 feedback so you leave with complete confidence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
