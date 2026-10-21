import React, { useState } from 'react';
import { Play, Sparkles } from 'lucide-react';
import { ACADEMY_EVENTS } from '../data/eventsData';
import { VideoPlayerModal } from '../components/ui/VideoPlayerModal';
import { Button } from '../components/ui/Button';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';

export const EventsPage: React.FC = () => {
  usePageSEO({
    title: 'Academy Events & Batch Get-Togethers | SK Relax Satara',
    description: 'Explore student batch get-togethers, celebration functions, and hands-on masterclass workshops at SK Relax Beauty Academy, Satara.',
    path: '/events',
    image: '/images/team/team-celebration-1.jpg',
    schema: [
      generateLocalBusinessSchema(),
      generateBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Get-togethers & Events', path: '/events' }
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
            <Sparkles size={13} />
            <span>Community & Celebrations · Satara</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight">
            Batch Get-Togethers & <span className="font-serif italic text-gold-300">Academy Events</span>
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-ivory-200/85 max-w-2xl mx-auto font-sans leading-relaxed">
            Witness our student batches in action: hands-on dummy workshops, certificate ceremonies, and memorable graduate celebrations at SK Relax Satara.
          </p>
        </div>
      </section>

      {/* Main Events Grid */}
      <section className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ACADEMY_EVENTS.map((event) => (
            <ScrollReveal key={event.id}>
              <article className="group bg-white rounded-sm border border-forest-900/10 shadow-soft overflow-hidden flex flex-col justify-between h-full hover:border-gold-500/40 transition-all duration-300">
                {/* Media Container */}
                <div className="relative aspect-[16/10] bg-cream-200 overflow-hidden">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-forest-900 text-ivory-300 text-xs">
                      SK Relax Academy Event
                    </div>
                  )}

                  {/* Play Button Overlay if video exists */}
                  {event.videoUrl && (
                    <button
                      onClick={() => setActiveVideo({
                        url: event.videoUrl!,
                        title: event.title,
                        description: event.description
                      })}
                      className="absolute inset-0 bg-forest-950/35 group-hover:bg-forest-950/50 flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                      aria-label={`Watch video of ${event.title}`}
                    >
                      <div className="w-14 h-14 rounded-full bg-forest-950/85 border border-gold-400/70 text-gold-300 flex items-center justify-center shadow-luxury transform transition-transform duration-300 group-hover:scale-110">
                        <Play size={20} className="fill-gold-400 text-gold-400 ml-0.5" />
                      </div>
                    </button>
                  )}

                  {/* Batch Tag */}
                  {event.batchName && (
                    <div className="absolute top-3 left-3 bg-forest-950/90 backdrop-blur-sm text-gold-300 text-[10px] sm:text-xs font-sans font-medium px-2.5 py-1 rounded-sm border border-gold-400/30">
                      {event.batchName}
                    </div>
                  )}
                </div>

                {/* Event Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-forest-900 font-normal mb-2 group-hover:text-forest-700 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-forest-700 leading-relaxed font-sans mb-4">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-forest-900/10 flex items-center justify-between gap-3">
                    {event.videoUrl ? (
                      <button
                        type="button"
                        onClick={() => setActiveVideo({
                          url: event.videoUrl!,
                          title: event.title,
                          description: event.description
                        })}
                        className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 hover:text-gold-600 transition-colors"
                      >
                        <Play size={13} className="text-gold-500 fill-gold-500" />
                        <span>Watch Highlights</span>
                      </button>
                    ) : (
                      <span className="text-xs text-forest-500 font-sans">
                        Event Photo
                      </span>
                    )}

                    <Button to="/batches" variant="outline" size="sm">
                      Join Next Batch
                    </Button>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        {/* Join the Community Callout */}
        <div className="mt-14 p-8 sm:p-10 bg-cream-100 rounded-sm border border-forest-900/10 text-center">
          <span className="text-xs uppercase tracking-widest text-rose-600 font-sans font-semibold block mb-2">
            Be Part of Our Next Graduate Batch
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-forest-900 font-normal mb-3">
            Begin Your Professional Beauty Journey with SK Relax
          </h3>
          <p className="text-xs sm:text-sm text-forest-700 font-sans max-w-xl mx-auto mb-6">
            Small batches, hands-on dummy practice, ISO certified curriculum, and personalized mentorship by Salma Attar in Satara.
          </p>
          <Button to="/batches" variant="gold" size="md">
            Explore Course Batches
          </Button>
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
          categoryLabel="Academy Event"
        />
      )}
    </div>
  );
};
