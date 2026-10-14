import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  Instagram, 
  MapPin, 
  Clock, 
  Navigation
} from 'lucide-react';
import { BRAND, buildWhatsAppUrl, WhatsAppMessages } from '../data/brandData';
import { ContactForm } from '../components/forms/ContactForm';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const ContactPage: React.FC = () => {
  useDocumentTitle('Contact & Location', 'Contact SK Relax Beauty Academy & Salon in Satara, Maharashtra. Call +91 8459890270 or message us on WhatsApp.');

  return (
    <div className="bg-ivory text-forest-900 min-h-screen">
      {/* Contact Hero */}
      <section className="bg-forest-950 text-ivory py-16 sm:py-20 relative overflow-hidden border-b border-forest-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-gold-500/30 text-gold-300 text-xs font-sans tracking-widest uppercase mb-4">
            <MapPin size={14} />
            <span>Satara, Maharashtra, India</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight">
            Connect with <span className="font-serif italic text-gold-300">SK Relax</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-ivory-200/85 max-w-xl mx-auto font-sans leading-relaxed">
            We welcome appointments, bridal consultations, and academy student inquiries. Get in touch with our team in Satara.
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details & Cards (Left Column) */}
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal direction="left">
              {/* Studio Info Card */}
              <div className="bg-white p-6 sm:p-8 rounded-sm border border-forest-900/10 shadow-soft">
                <span className="text-xs uppercase tracking-widest text-rose-600 font-sans font-semibold mb-2 block">
                  Studio Headquarters
                </span>
                <h3 className="font-serif text-2xl text-forest-900 font-medium mb-6">
                  {BRAND.name}
                </h3>

                <div className="space-y-4 text-xs sm:text-sm text-forest-800 font-sans">
                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0 mt-0.5">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-forest-900">Studio Location</p>
                      <p className="text-forest-600 mt-0.5">{BRAND.locationName}</p>
                      <p className="text-[11px] text-forest-400 mt-0.5 italic">
                        * Exact landmark & directions provided upon appointment confirmation.
                      </p>
                    </div>
                  </div>

                  {/* Phone / Call */}
                  <div className="flex items-start gap-3 pt-3 border-t border-forest-900/10">
                    <div className="w-8 h-8 rounded-full bg-forest-50 flex items-center justify-center text-forest-800 flex-shrink-0 mt-0.5">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-forest-900">Phone & Inquiries</p>
                      <a
                        href={`tel:${BRAND.whatsappNumber}`}
                        className="text-forest-700 hover:text-forest-950 font-semibold underline underline-offset-2 block mt-0.5"
                      >
                        {BRAND.phone}
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-3 pt-3 border-t border-forest-900/10">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 flex-shrink-0 mt-0.5">
                      <MessageCircle size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-forest-900">Direct WhatsApp</p>
                      <a
                        href={buildWhatsAppUrl(WhatsAppMessages.general())}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-900 font-semibold underline underline-offset-2 block mt-0.5"
                      >
                        Chat: {BRAND.whatsappNumber}
                      </a>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="flex items-start gap-3 pt-3 border-t border-forest-900/10">
                    <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0 mt-0.5">
                      <Instagram size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-forest-900">Instagram Official</p>
                      <a
                        href={BRAND.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-700 hover:text-rose-900 font-semibold underline underline-offset-2 block mt-0.5"
                      >
                        {BRAND.instagramHandle}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="bg-cream-100 p-6 sm:p-8 rounded-sm border border-forest-900/10">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={18} className="text-gold-600" />
                  <h4 className="font-serif text-xl text-forest-900 font-medium">Studio Working Hours</h4>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-forest-800 font-sans">
                  {BRAND.hours.map((h, i) => (
                    <div key={i} className="flex justify-between items-center py-1.5 border-b last:border-0 border-forest-900/10">
                      <span className="font-medium text-forest-900">{h.days}</span>
                      <span className="text-forest-700">{h.time}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-xs text-forest-600 italic">
                  * Prior booking via WhatsApp is recommended to avoid waiting times.
                </p>
              </div>

              {/* Map / Directions Placeholder */}
              <div className="p-6 bg-white rounded-sm border border-forest-900/10 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif text-lg text-forest-900 font-medium flex items-center gap-2">
                    <Navigation size={16} className="text-forest-700" />
                    Find Us in Satara
                  </span>
                  <span className="text-[10px] bg-forest-100 text-forest-800 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
                    Satara, Maharashtra
                  </span>
                </div>
                <p className="text-xs text-forest-700 leading-relaxed font-sans mb-4">
                  Conveniently situated in Satara city. Pin-point Google Maps location, landmark guidance, and parking instructions are provided directly to your WhatsApp when you schedule your appointment.
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent('Satara, Maharashtra, India')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-forest-900 hover:text-forest-700 font-semibold underline underline-offset-4"
                >
                  <span>Open Satara Map in Google Maps</span>
                  <Navigation size={12} />
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* Quick WhatsApp Inquiry Form (Right Column) */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="right">
              <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-sm border border-forest-900/10 shadow-card">
                <span className="text-xs uppercase tracking-widest text-rose-600 font-sans font-semibold mb-1 block">
                  Send A Message
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-forest-900 font-normal mb-2">
                  General Inquiry & Feedback
                </h3>
                <p className="text-xs sm:text-sm text-forest-700/80 leading-relaxed font-sans mb-6">
                  Have questions about our bridal packages, hair masterclass, or salon timings? Send an inquiry and our team will respond on WhatsApp.
                </p>

                <ContactForm />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};
