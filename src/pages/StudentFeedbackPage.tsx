import React, { useState } from 'react';
import { MessageSquare, Play, GraduationCap } from 'lucide-react';
import { STUDENT_FEEDBACK } from '../data/studentFeedbackData';
import { VideoPlayerModal } from '../components/ui/VideoPlayerModal';
import { Button } from '../components/ui/Button';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';

export const StudentFeedbackPage: React.FC = () => {
  usePageSEO({
    title: 'Student Feedback & Experiences | SK Relax Beauty Academy, Satara',
    description: 'Watch genuine student review videos and honest learning experiences from graduates at SK Relax Beauty Academy in Satara.',
    path: '/student-feedback',
    image: '/images/students/student-graduate-certificate.jpg',
    schema: [
      generateLocalBusinessSchema(),
      generateBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Student Feedback', path: '/student-feedback' }
      ])
    ]
  });

  const [activeVideo, setActiveVideo] = useState<{
    url: string;
    title: string;
    description?: string;
  } | null>(null);

  return (
    <div className="bg-ivory text-forest-900 min-h-screen">
      {/* Header */}
      <section className="bg-forest-950 text-ivory py-10 sm:py-14 relative overflow-hidden border-b border-forest-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-gold-500/30 text-gold-300 text-xs font-sans tracking-widest uppercase mb-3">
            <MessageSquare size={13} />
            <span>Real Student Journeys · Satara</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight">
            Genuine Student <span className="font-serif italic text-gold-300">Feedback</span>
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-ivory-200/85 max-w-2xl mx-auto font-sans leading-relaxed">
            Unfiltered video reflections and learning experiences shared directly by students training at SK Relax Beauty Academy in Satara.
          </p>
        </div>
      </section>

      {/* Video Feedback Grid */}
      <section className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {STUDENT_FEEDBACK.map((feedback) => (
            <ScrollReveal key={feedback.id}>
              <div className="bg-white rounded-sm border border-forest-900/10 shadow-soft overflow-hidden flex flex-col justify-between h-full">
                {/* Video Card Header / Preview */}
                <div className="relative aspect-[16/9] bg-forest-950 overflow-hidden group">
                  {feedback.posterImage ? (
                    <img
                      src={feedback.posterImage}
                      alt={feedback.studentName}
                      className="w-full h-full object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ivory-400 text-xs">
                      Student Video Review
                    </div>
                  )}

                  {feedback.videoUrl && (
                    <button
                      onClick={() => setActiveVideo({
                        url: feedback.videoUrl!,
                        title: feedback.studentName,
                        description: feedback.quote
                      })}
                      className="absolute inset-0 bg-forest-950/30 group-hover:bg-forest-950/50 flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 z-10"
                      aria-label={`Play student review video from ${feedback.studentName}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-forest-900/90 border border-gold-400 text-gold-300 flex items-center justify-center shadow-luxury transform transition-transform duration-300 group-hover:scale-110">
                        <Play size={18} className="fill-gold-400 text-gold-400 ml-0.5" />
                      </div>
                    </button>
                  )}

                  {feedback.batch && (
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-ivory-200 bg-forest-950/85 backdrop-blur-xs px-2.5 py-1 rounded-sm border border-gold-500/20 z-10">
                      <span className="font-sans font-medium flex items-center gap-1">
                        <Play size={10} className="fill-current text-gold-400" /> Watch Video Feedback
                      </span>
                      <span className="text-gold-300 font-sans">{feedback.batch}</span>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-rose-600 text-xs font-sans font-semibold uppercase tracking-wider mb-2">
                      <GraduationCap size={15} />
                      <span>{feedback.courseName}</span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-forest-900 font-normal mb-3">
                      {feedback.studentName}
                    </h3>

                    {feedback.quote && (
                      <blockquote className="text-xs sm:text-sm text-forest-700 italic leading-relaxed font-serif pl-3 border-l-2 border-gold-400 mb-4">
                        “{feedback.quote}”
                      </blockquote>
                    )}
                  </div>

                  <div className="pt-4 border-t border-forest-900/10 flex items-center justify-between gap-3">
                    {feedback.videoUrl && (
                      <button
                        type="button"
                        onClick={() => setActiveVideo({
                          url: feedback.videoUrl!,
                          title: feedback.studentName,
                          description: feedback.quote
                        })}
                        className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 hover:text-gold-600 transition-colors"
                      >
                        <Play size={13} className="text-gold-500 fill-gold-500" />
                        <span>Watch Review</span>
                      </button>
                    )}

                    <Button to="/batches" variant="outline" size="sm">
                      View Course Batches
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Commitment to Genuine Mentorship */}
        <div className="mt-14 p-8 sm:p-10 bg-cream-50 rounded-sm border border-forest-900/10 text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-forest-500 font-sans font-semibold block mb-2">
            SK Relax Academy Ethics
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-forest-900 font-normal mb-3">
            Real Hands-On Mentorship in Satara
          </h3>
          <p className="text-xs sm:text-sm text-forest-700 leading-relaxed font-sans mb-6">
            We value genuine technique over empty marketing claims. Our students practice on dedicated mannequin dummy heads, learn angle degree geometry step-by-step, and receive direct 1-on-1 guidance from Salma Attar.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button to="/batches" variant="gold" size="sm">
              Explore Available Batches
            </Button>
            <Button to="/contact" variant="outline" size="sm">
              Visit Our Satara Studio
            </Button>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <VideoPlayerModal
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
          videoUrl={activeVideo.url}
          title={activeVideo.title}
          description={activeVideo.description}
          categoryLabel="Student Video Feedback"
        />
      )}
    </div>
  );
};
