import React from 'react';
import { Users, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { buildWhatsAppUrl, WhatsAppMessages } from '../data/brandData';
import { TEAM_MEMBERS } from '../data/teamData';
import { Button } from '../components/ui/Button';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';

export const OurTeamPage: React.FC = () => {
  usePageSEO({
    title: 'Our Team & Faculty | SK Relax Beauty Academy & Salon, Satara',
    description: 'Meet founder Salma Attar and the expert beauty, hair styling, and aesthetic faculty at SK Relax in Satara.',
    path: '/team',
    image: '/images/team/salma-attar-founder.jpg',
    schema: [
      generateLocalBusinessSchema(),
      generateBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Our Team', path: '/team' }
      ])
    ]
  });

  const founder = TEAM_MEMBERS.find(m => m.isFounder);
  const otherMembers = TEAM_MEMBERS.filter(m => !m.isFounder && m.published);

  return (
    <div className="bg-ivory text-forest-900 min-h-screen">
      {/* Editorial Header */}
      <section className="bg-forest-950 text-ivory py-10 sm:py-14 relative overflow-hidden border-b border-forest-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-gold-500/30 text-gold-300 text-xs font-sans tracking-widest uppercase mb-3">
            <Users size={13} />
            <span>Master Artistry · Satara</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight">
            The Artisans Behind <span className="font-serif italic text-gold-300">SK Relax</span>
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-ivory-200/85 max-w-2xl mx-auto font-sans leading-relaxed">
            Meet our master educators, senior hair artists, and clinical aesthetic specialists dedicated to bespoke craftsmanship in Satara.
          </p>
        </div>
      </section>

      {/* Founder Spotlight: Salma Attar */}
      {founder && (
        <section className="py-12 sm:py-16 bg-cream-50 border-b border-forest-900/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              {/* Founder Image */}
              <div className="lg:col-span-5">
                <ScrollReveal direction="left">
                  <div className="relative rounded-sm overflow-hidden shadow-elevated border-2 border-gold-400/40 bg-forest-950 max-w-md mx-auto">
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="w-full h-auto object-cover object-center"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-transparent p-5 text-ivory">
                      <p className="font-serif text-xl sm:text-2xl text-gold-300 font-normal">
                        {founder.name}
                      </p>
                      <p className="text-xs text-ivory-300 font-sans uppercase tracking-wider">
                        {founder.role}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Founder Editorial Bio */}
              <div className="lg:col-span-7 space-y-6">
                <ScrollReveal direction="right">
                  <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.25em] text-rose-600">
                    <Sparkles size={13} />
                    <span>Founder & Lead Mentor</span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl text-forest-950 font-normal">
                    Mentorship Led by <span className="font-serif italic text-rose-700">{founder.name}</span>
                  </h2>

                  <p className="text-sm sm:text-base text-forest-700 font-sans leading-relaxed">
                    {founder.bio}
                  </p>

                  <div className="pt-2">
                    <h3 className="text-xs uppercase tracking-wider text-forest-900 font-sans font-semibold mb-3">
                      Core Areas of Mastery
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {founder.expertise.map((exp, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-forest-800">
                          <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                          <span>{exp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <Button
                      href={buildWhatsAppUrl(WhatsAppMessages.general())}
                      external
                      variant="gold"
                      size="sm"
                      icon={<MessageCircle size={14} />}
                    >
                      Connect with Salma Attar
                    </Button>
                    <Button to="/batches" variant="outline" size="sm">
                      Explore Course Batches
                    </Button>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Additional Faculty & Team Highlights */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest text-rose-600 font-sans font-semibold mb-1.5">
            Collaborative Excellence
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-forest-900 font-normal">
            Studio Specialists & Mentors
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-forest-700 font-sans">
            Our team brings together professional salon stylists, estheticians, and coordinators trained in modern beauty sciences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {otherMembers.map((member) => (
            <ScrollReveal key={member.id}>
              <div className="bg-white rounded-sm border border-forest-900/10 shadow-soft overflow-hidden flex flex-col h-full">
                <div className="aspect-[16/10] bg-cream-200 overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-forest-900 font-normal">
                      {member.name}
                    </h3>
                    <p className="text-xs uppercase tracking-wider text-rose-600 font-sans font-semibold mt-0.5 mb-3">
                      {member.role}
                    </p>
                    <p className="text-xs sm:text-sm text-forest-700 leading-relaxed font-sans mb-4">
                      {member.bio}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-forest-900/5">
                    <p className="text-[11px] uppercase tracking-wider text-forest-500 font-sans font-semibold mb-2">
                      Focus Areas:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {member.expertise.map((exp, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-cream-100 text-forest-800 border border-forest-900/10">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
};
