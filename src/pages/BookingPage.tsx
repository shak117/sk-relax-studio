import React from 'react';
import { Calendar, MessageCircle, Phone, Clock, MapPin } from 'lucide-react';
import { BRAND, buildWhatsAppUrl, WhatsAppMessages } from '../data/brandData';
import { BookingForm } from '../components/forms/BookingForm';
import { Button } from '../components/ui/Button';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { usePageSEO } from '../hooks/usePageSEO';
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';

export const BookingPage: React.FC = () => {
  usePageSEO({
    title: 'Book a Salon Appointment in Satara | SK Relax',
    description: 'Enquire about salon appointments and available services at SK Relax through WhatsApp.',
    path: '/booking',
    schema: [
      generateLocalBusinessSchema(),
      generateBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Book Appointment', path: '/booking' }
      ])
    ]
  });

  return (
    <div className="bg-ivory text-forest-900 min-h-screen">
      {/* Booking Hero */}
      <section className="bg-forest-950 text-ivory py-16 sm:py-20 relative overflow-hidden border-b border-forest-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-gold-500/30 text-gold-300 text-xs font-sans tracking-widest uppercase mb-4">
            <Calendar size={14} />
            <span>Direct WhatsApp Scheduling</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight">
            Reserve Your <span className="font-serif italic text-gold-300">Appointment</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-ivory-200/85 max-w-xl mx-auto font-sans leading-relaxed">
            Personalized salon visits and academy enrollments in Satara. Complete your details below to instantly connect with our studio via WhatsApp.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Booking Form (Left / Main) */}
          <div className="lg:col-span-8">
            <ScrollReveal direction="left">
              <BookingForm />
            </ScrollReveal>
          </div>

          {/* Booking Context & Studio Info (Right Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            <ScrollReveal direction="right">
              {/* How it Works Card */}
              <div className="bg-white p-6 rounded-sm border border-forest-900/10 shadow-soft">
                <h3 className="font-serif text-xl text-forest-900 font-normal mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  How Booking Works
                </h3>
                <ol className="space-y-3 text-xs sm:text-sm text-forest-700 font-sans">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-forest-100 text-forest-900 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">1</span>
                    <span>Submit your service preference and dates using the form.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-forest-100 text-forest-900 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">2</span>
                    <span>WhatsApp will open with your pre-formatted enquiry addressed to <strong className="font-medium text-forest-900">+91 8459890270</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-forest-100 text-forest-900 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">3</span>
                    <span>Our Satara team checks availability and confirms your exact time slot and pricing on WhatsApp.</span>
                  </li>
                </ol>
              </div>

              {/* Studio Hours & Contact Card */}
              <div className="bg-cream-100 p-6 rounded-sm border border-forest-900/10">
                <h4 className="font-serif text-lg text-forest-900 font-medium mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-gold-600" />
                  Studio Working Hours
                </h4>
                <div className="text-xs text-forest-800 space-y-1 font-sans">
                  {BRAND.hours.map((h, i) => (
                    <div key={i} className="flex flex-col py-1 border-b last:border-0 border-forest-900/10">
                      <span className="font-medium text-forest-900">{h.days}</span>
                      <span className="text-forest-600">{h.time}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-forest-900/10 space-y-2 text-xs text-forest-800">
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-rose-500" />
                    <span>{BRAND.locationName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={15} className="text-forest-700" />
                    <a href={`tel:${BRAND.whatsappNumber}`} className="hover:text-forest-950 font-medium">
                      {BRAND.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Immediate Quick WhatsApp Chat */}
              <div className="p-6 bg-[#173222] text-ivory rounded-sm shadow-soft">
                <p className="font-serif text-lg text-white mb-2">Prefer to text directly?</p>
                <p className="text-xs text-ivory-300 leading-relaxed font-sans mb-4">
                  Skip the form and message our styling team immediately on WhatsApp with your questions.
                </p>
                <Button
                  href={buildWhatsAppUrl(WhatsAppMessages.general())}
                  external
                  variant="gold"
                  size="sm"
                  className="w-full justify-center"
                  icon={<MessageCircle size={15} />}
                >
                  Direct WhatsApp Chat
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};
