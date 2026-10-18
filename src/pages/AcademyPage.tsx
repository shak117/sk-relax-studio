import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  MessageCircle, 
  CheckCircle2, 
  Users, 
  Award, 
  Scissors, 
  Layers
} from 'lucide-react';
import { BRAND, buildWhatsAppUrl, WhatsAppMessages } from '../data/brandData';
import { COURSES, ACADEMY_HIGHLIGHTS } from '../data/academyData';
import { CourseCard } from '../components/academy/CourseCard';
import { BookingForm } from '../components/forms/BookingForm';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { generateLocalBusinessSchema, generateAcademyCourseSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';
import { trackViewContent } from '../services/analytics';

export const AcademyPage: React.FC = () => {
  usePageSEO({
    title: 'Beauty Academy in Satara | SK Relax',
    description: 'Discover beauty education and upcoming training opportunities at SK Relax Beauty Academy in Satara.',
    path: '/academy',
    image: '/images/academy/hair-cutting-masterclass-poster.jpg',
    schema: [
      generateLocalBusinessSchema(),
      generateAcademyCourseSchema(),
      generateBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Beauty Academy', path: '/academy' }
      ])
    ]
  });

  const masterclass = COURSES[0];
  const otherCourses = COURSES.slice(1);

  React.useEffect(() => {
    trackViewContent({
      content_name: '3 Days Hair Cutting Masterclass',
      content_category: 'Beauty Academy Training',
      value: 4000,
      currency: 'INR'
    });
  }, []);

  return (
    <div className="bg-ivory text-forest-900 min-h-screen">
      {/* Academy Hero */}
      <section className="bg-forest-950 text-ivory py-10 sm:py-14 relative overflow-hidden border-b border-forest-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-gold-500/30 text-gold-300 text-xs font-sans tracking-widest uppercase mb-3">
            <GraduationCap size={14} />
            <span>Professional Education · Satara</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight">
            SK Relax <span className="font-serif italic text-gold-300">Beauty Academy</span>
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-ivory-200/85 max-w-2xl mx-auto font-sans leading-relaxed">
            {BRAND.academyTagline} — Empowering aspiring hairstylists and beauty artists in Satara through practical hair cutting courses and intensive masterclasses with hands-on mannequin dummy training.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              href={buildWhatsAppUrl(WhatsAppMessages.academyEnquiry(masterclass.title, masterclass.nextBatch))}
              external
              variant="gold"
              size="sm"
              icon={<MessageCircle size={15} />}
            >
              Enquire for Upcoming Batch
            </Button>
            <Button
              href="#enrollment-form"
              variant="outline"
              size="sm"
              className="border-ivory/30 text-ivory hover:text-forest-950 hover:bg-ivory"
            >
              Quick Enrollment Request
            </Button>
          </div>
        </div>
      </section>

      {/* Featured 3-Day Hair Cutting Masterclass (From Poster) */}
      <section className="py-10 sm:py-14 bg-cream-50 border-b border-forest-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
              <span className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-rose-600 block mb-1.5">
                Flagship Masterclass
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-forest-900">
                3 Days Hair Cutting <span className="font-serif italic text-rose-600">Masterclass</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-forest-700 leading-relaxed font-sans">
                A high-intensity, practical training program designed to teach you the geometry, elevation degrees, and sectioning behind today’s most requested haircuts.
              </p>
            </div>
          </ScrollReveal>

          {/* Masterclass Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Poster & Visuals */}
            <div className="lg:col-span-5 space-y-6">
              <ScrollReveal direction="left">
                <div className="relative rounded-sm overflow-hidden shadow-card border-2 border-gold-400/30 bg-forest-950">
                  <img
                    src="/images/academy/hair-cutting-masterclass-poster.jpg"
                    alt="SK Relax 3-Day Hair Cutting Masterclass Poster Satara"
                    className="w-full h-auto object-cover"
                  />
                </div>

                <div className="p-5 bg-white rounded-sm border border-forest-900/10 shadow-soft">
                  <div className="flex items-center gap-3 text-forest-900 font-serif text-lg mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Training Mannequin Provided</span>
                  </div>
                  <p className="text-xs text-forest-700 leading-relaxed font-sans">
                    Every enrolled student receives a dedicated styling dummy head during the masterclass to practice sectioning, angle degrees, and cutting techniques under direct supervision.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* In-depth Syllabus & Inclusions */}
            <div className="lg:col-span-7 space-y-8">
              <ScrollReveal direction="right">
                {/* Meta details bar */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-white rounded-sm border border-forest-900/10 shadow-soft">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-forest-500 font-sans block">Investment Fee</span>
                    <span className="font-serif text-2xl text-rose-700 font-bold">{masterclass.fee}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-forest-500 font-sans block">Duration</span>
                    <span className="font-serif text-lg text-forest-900 font-semibold">{masterclass.duration}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase tracking-wider text-forest-500 font-sans block">Certification</span>
                    <span className="text-xs text-forest-900 font-medium">Academy Certificate</span>
                  </div>
                </div>

                {/* What's Included from Poster */}
                <div className="bg-white p-6 sm:p-8 rounded-sm border border-forest-900/10 shadow-soft">
                  <h3 className="font-serif text-2xl text-forest-900 font-normal mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    12 Practical Masterclass Inclusions
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-forest-800 font-sans">
                    {masterclass.includes.map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-ivory rounded-sm border border-forest-900/5">
                        <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                        <span className="font-medium">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Day-by-Day Syllabus */}
                <div className="bg-white p-6 sm:p-8 rounded-sm border border-forest-900/10 shadow-soft">
                  <h3 className="font-serif text-2xl text-forest-900 font-normal mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                    3-Day Curriculum Breakdown
                  </h3>

                  <div className="space-y-6">
                    {masterclass.syllabus.map((day, idx) => (
                      <div key={idx} className="pb-5 last:pb-0 border-b last:border-0 border-forest-900/10">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-700 font-semibold mb-1">
                          <Layers size={13} />
                          <span>Day 0{idx + 1}</span>
                        </div>
                        <h4 className="font-serif text-lg text-forest-900 font-medium mb-2">{day.title}</h4>
                        <ul className="space-y-1.5 pl-4 list-disc text-xs sm:text-sm text-forest-700 leading-relaxed font-sans">
                          {day.topics.map((t, ti) => (
                            <li key={ti}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="p-6 bg-[#173222] text-ivory rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="font-serif text-xl text-white">Seats are strictly limited per batch</p>
                    <p className="text-xs text-ivory-300 mt-0.5">Contact via WhatsApp to register your seat or request the next batch dates.</p>
                  </div>
                  <Button
                    href={buildWhatsAppUrl(WhatsAppMessages.academyEnquiry(masterclass.title, masterclass.nextBatch))}
                    external
                    variant="gold"
                    size="md"
                    className="whitespace-nowrap"
                    icon={<MessageCircle size={15} />}
                  >
                    Register via WhatsApp
                  </Button>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Academy Training Philosophy Highlights */}
      <section className="py-20 sm:py-24 bg-ivory text-forest-900 border-b border-forest-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Practical Methodology"
              title="Why Learn at"
              highlightText="SK Relax Academy?"
              description="Our academy is designed around practical, career-ready techniques rather than passive demonstrations."
            />
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ACADEMY_HIGHLIGHTS.map((hl, idx) => (
              <ScrollReveal key={idx} delay={idx * 80}>
                <div className="p-6 bg-white rounded-sm border border-forest-900/10 shadow-soft h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-full bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-900 mb-4">
                      {idx === 0 && <Scissors size={18} />}
                      {idx === 1 && <Sparkles size={18} />}
                      {idx === 2 && <Users size={18} />}
                      {idx === 3 && <Award size={18} />}
                    </div>
                    <h3 className="font-serif text-xl text-forest-900 font-medium mb-2">
                      {hl.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-forest-700/85 leading-relaxed font-sans">
                      {hl.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-forest-900/5 text-[11px] text-rose-600 font-semibold uppercase tracking-wider">
                    SK Relax Guarantee
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Upcoming Courses */}
      <section className="py-10 sm:py-14 bg-cream-50 border-b border-forest-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Explore Further Courses"
              title="Upcoming Professional"
              highlightText="Certifications"
              description="Expand your skillset with our upcoming diploma tracks in bridal artistry and clinical skincare."
            />
          </ScrollReveal>

          <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {otherCourses.map((course, idx) => (
              <ScrollReveal key={course.id} delay={idx * 100}>
                <CourseCard course={course} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment Inquiry Form Section */}
      <section id="enrollment-form" className="py-10 sm:py-16 bg-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-widest font-sans font-semibold text-rose-600 block mb-1">
                Student Admission & Enquiry
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-forest-900 font-normal">
                Reserve Your Masterclass Seat
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-forest-700 font-sans max-w-xl mx-auto">
                Select your desired course below and submit to begin WhatsApp correspondence with our academy coordinator in Satara.
              </p>
            </div>

            <BookingForm isAcademyMode={true} />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};
