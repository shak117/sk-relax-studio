import React, { useState } from 'react';
import { MessageCircle, CheckCircle2, Clock, Calendar, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { AcademyCourse } from '../../types';
import { buildWhatsAppUrl, WhatsAppMessages } from '../../data/brandData';
import { Button } from '../ui/Button';

interface CourseCardProps {
  course: AcademyCourse;
  isFeatured?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isFeatured = false }) => {
  const [showFullSyllabus, setShowFullSyllabus] = useState(false);
  const whatsappUrl = buildWhatsAppUrl(WhatsAppMessages.academyEnquiry(course.title, course.nextBatch));

  return (
    <article 
      className={`bg-white rounded-sm border transition-all duration-300 overflow-hidden shadow-soft hover:shadow-card flex flex-col justify-between ${
        isFeatured ? 'border-gold-500/50 ring-1 ring-gold-400/20' : 'border-forest-900/10'
      }`}
    >
      <div>
        {/* Course Header Banner */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-forest-950">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover object-center brightness-95 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/30 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="bg-forest-900/90 backdrop-blur-sm text-gold-300 text-xs font-sans font-medium px-3 py-1 rounded-sm border border-gold-400/30 uppercase tracking-widest">
              {course.duration}
            </span>
            {course.fee && (
              <span className="bg-rose-500/90 backdrop-blur-sm text-white text-xs font-sans font-bold px-3 py-1 rounded-sm uppercase tracking-wider shadow-sm">
                Fees: {course.fee}
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-ivory">
            <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold-300 font-semibold mb-0.5">
              {course.subtitle}
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal leading-tight text-white drop-shadow-sm">
              {course.title}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Target & Batch note */}
          <div className="flex flex-col gap-2 p-3 bg-cream-50 rounded-sm border border-forest-900/5 text-xs text-forest-800 mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-rose-500 flex-shrink-0" />
              <span className="font-medium">Batch Schedule:</span>
              <span className="text-forest-700 font-light">{course.nextBatch}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gold-600 flex-shrink-0" />
              <span className="font-medium">Duration:</span>
              <span className="text-forest-700 font-light">{course.duration} Hands-on Intensive</span>
            </div>
          </div>

          {/* Course Highlights */}
          <h4 className="text-xs uppercase tracking-widest font-sans font-semibold text-forest-900 mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Curriculum Highlights
          </h4>
          <ul className="space-y-2 mb-6">
            {course.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-forest-800 leading-snug">
                <CheckCircle2 size={15} className="text-forest-600 flex-shrink-0 mt-0.5" />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          {/* Comprehensive Includes Grid */}
          <div className="pt-4 border-t border-forest-900/10 mb-6">
            <h4 className="text-xs uppercase tracking-widest font-sans font-semibold text-forest-900 mb-3">
              Included In This Masterclass:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs text-forest-700">
              {course.includes.map((inc, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-ivory-100 p-2 rounded-sm border border-forest-900/5">
                  <span className="text-rose-500 font-bold">✓</span>
                  <span className="truncate">{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expandable Detailed Syllabus */}
          {course.syllabus && course.syllabus.length > 0 && (
            <div className="mb-6 pt-2">
              <button
                onClick={() => setShowFullSyllabus(!showFullSyllabus)}
                className="w-full py-2.5 px-4 bg-forest-50 hover:bg-forest-100/70 border border-forest-200/60 rounded-sm text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <BookOpen size={14} className="text-forest-700" />
                  {showFullSyllabus ? 'Hide Detailed Daily Syllabus' : 'View Detailed Daily Syllabus'}
                </span>
                {showFullSyllabus ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showFullSyllabus && (
                <div className="mt-3 space-y-3 bg-cream-50 p-4 rounded-sm border border-cream-200 animate-fade-in">
                  {course.syllabus.map((syl, idx) => (
                    <div key={idx} className="pb-3 last:pb-0 border-b last:border-0 border-cream-200">
                      <p className="font-serif text-sm font-semibold text-forest-900 mb-1">{syl.title}</p>
                      <ul className="space-y-1 pl-4 list-disc text-xs text-forest-700">
                        {syl.topics.map((t, ti) => (
                          <li key={ti}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer CTA */}
      <div className="p-6 pt-0 border-t border-forest-900/10 mt-auto bg-white">
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <Button
            href={whatsappUrl}
            external
            variant="whatsapp"
            size="md"
            className="w-full justify-center"
            icon={<MessageCircle size={15} />}
          >
            Enquire Batch on WhatsApp
          </Button>
          <Button
            to="/booking"
            variant="outline"
            size="md"
            className="w-full sm:w-auto text-xs px-4"
          >
            Studio Visit
          </Button>
        </div>
      </div>
    </article>
  );
};
