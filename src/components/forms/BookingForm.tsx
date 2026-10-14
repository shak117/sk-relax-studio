import React, { useState } from 'react';
import { MessageCircle, CheckCircle, AlertCircle, Calendar, Clock, User, Phone, Sparkles, ExternalLink } from 'lucide-react';
import { buildWhatsAppUrl, WhatsAppMessages } from '../../data/brandData';
import { COURSES } from '../../data/academyData';
import { BookingFormData } from '../../types';
import { trackLeadSubmission } from '../../services/analytics';

interface BookingFormProps {
  initialService?: string;
  isAcademyMode?: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({ 
  initialService = '',
  isAcademyMode = false 
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    mobileNumber: '',
    preferredService: initialService || (isAcademyMode ? '3 Days Hair Cutting Masterclass (₹4000)' : ''),
    preferredDate: '',
    preferredTime: '',
    additionalMessage: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);

  // Combine salon services and academy courses for selection
  const serviceOptions = [
    { group: 'Signature Haircuts (From Masterclass)', items: [
      'Butterfly Haircut & Dynamic Layers',
      'Long Layer Haircut & Flowing Texture',
      'Classic Feather Haircut',
      'Curtain Bangs & Face Framing',
      'Customised Signature Haircut & Blow Dry'
    ]},
    { group: 'Academy Courses & Masterclasses', items: COURSES.map(c => `${c.title} (${c.fee || 'Enquiry'})`) },
    { group: 'Hair Treatments & Colour', items: [
      'Keratin Smoothing & Deep Nourishing Spa',
      'Global Hair Colour & Dimensional Balayage',
      'Custom Colour Gloss & Toning'
    ]},
    { group: 'Skin & Bridal Artistry', items: [
      'Signature Bridal Makeover & Hair Couture',
      'Luminous Glow & Skin Brightening Facial',
      'Deep Hydration & Anti-Stress Skin Therapy',
      'Occasion & Party Glam Makeup'
    ]},
    { group: 'General Consultation', items: ['Custom In-Studio Beauty Consultation'] }
  ];

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters.';
    }

    const cleanMobile = formData.mobileNumber.replace(/[^0-9]/g, '');
    if (!cleanMobile) {
      newErrors.mobileNumber = 'Please enter your mobile number.';
    } else if (cleanMobile.length < 10) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.preferredService) {
      newErrors.preferredService = 'Please select a preferred service or academy course.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const message = WhatsAppMessages.bookingRequest(formData);
    const targetUrl = buildWhatsAppUrl(message);

    setSubmittedUrl(targetUrl);

    // Track Lead & WhatsApp handoff without PII
    trackLeadSubmission({
      service_name: formData.preferredService,
      preferred_date: formData.preferredDate,
      preferred_time: formData.preferredTime,
      category: isAcademyMode ? 'Beauty Academy Masterclass' : 'Salon Appointment'
    });

    // Attempt to open in a new window/tab safely
    const win = window.open(targetUrl, '_blank', 'noopener,noreferrer');
    if (!win) {
      // If popup blocker intervened, the user can click the rendered fallback button
      console.log('Popup was blocked, fallback button available');
    }
  };

  // Get today's date formatted as YYYY-MM-DD for min date
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-sm border border-forest-900/10 shadow-card p-6 sm:p-8 lg:p-10">
      <div className="mb-8 pb-6 border-b border-forest-900/10">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-rose-600 font-semibold mb-1">
          <Sparkles size={13} />
          <span>WhatsApp Appointment Flow</span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl text-forest-900 font-normal">
          {isAcademyMode ? 'Enquire for Academy Masterclass' : 'Request Your Salon Appointment'}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-forest-700/80 leading-relaxed font-sans">
          Fill in your preferences below. Submitting will open official WhatsApp with a prefilled request addressed to our Satara studio team.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-xs uppercase tracking-wider font-sans font-semibold text-forest-900 mb-2">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-400">
              <User size={16} />
            </div>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Ananya Kulkarni"
              className={`w-full pl-10 pr-4 py-3 bg-ivory text-forest-900 text-sm rounded-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/50 ${
                errors.fullName ? 'border-rose-400 focus:border-rose-500' : 'border-forest-900/15 focus:border-forest-800'
              }`}
              required
            />
          </div>
          {errors.fullName && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle size={13} />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label htmlFor="mobileNumber" className="block text-xs uppercase tracking-wider font-sans font-semibold text-forest-900 mb-2">
            Mobile Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-400">
              <Phone size={16} />
            </div>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              placeholder="e.g. 9822012345 (10-digit number)"
              className={`w-full pl-10 pr-4 py-3 bg-ivory text-forest-900 text-sm rounded-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/50 ${
                errors.mobileNumber ? 'border-rose-400 focus:border-rose-500' : 'border-forest-900/15 focus:border-forest-800'
              }`}
              required
            />
          </div>
          {errors.mobileNumber && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle size={13} />
              <span>{errors.mobileNumber}</span>
            </p>
          )}
        </div>

        {/* Preferred Service Dropdown */}
        <div>
          <label htmlFor="preferredService" className="block text-xs uppercase tracking-wider font-sans font-semibold text-forest-900 mb-2">
            Preferred Service or Course <span className="text-rose-500">*</span>
          </label>
          <select
            id="preferredService"
            name="preferredService"
            value={formData.preferredService}
            onChange={(e) => setFormData({ ...formData, preferredService: e.target.value })}
            className={`w-full px-4 py-3 bg-ivory text-forest-900 text-sm rounded-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/50 ${
              errors.preferredService ? 'border-rose-400 focus:border-rose-500' : 'border-forest-900/15 focus:border-forest-800'
            }`}
            required
          >
            <option value="">-- Select a service or course --</option>
            {serviceOptions.map((group, gi) => (
              <optgroup key={gi} label={group.group}>
                {group.items.map((item, ii) => (
                  <option key={ii} value={item}>
                    {item}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.preferredService && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle size={13} />
              <span>{errors.preferredService}</span>
            </p>
          )}
        </div>

        {/* Date & Time Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Preferred Date */}
          <div>
            <label htmlFor="preferredDate" className="block text-xs uppercase tracking-wider font-sans font-semibold text-forest-900 mb-2">
              Preferred Date <span className="text-forest-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-400">
                <Calendar size={16} />
              </div>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                min={todayStr}
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-ivory text-forest-900 text-sm rounded-sm border border-forest-900/15 focus:border-forest-800 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              />
            </div>
          </div>

          {/* Preferred Time Slot */}
          <div>
            <label htmlFor="preferredTime" className="block text-xs uppercase tracking-wider font-sans font-semibold text-forest-900 mb-2">
              Preferred Time Slot <span className="text-forest-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-400">
                <Clock size={16} />
              </div>
              <select
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-ivory text-forest-900 text-sm rounded-sm border border-forest-900/15 focus:border-forest-800 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              >
                <option value="">Any time slot</option>
                <option value="Morning (10:00 AM – 1:00 PM)">Morning (10:00 AM – 1:00 PM)</option>
                <option value="Afternoon (1:00 PM – 4:00 PM)">Afternoon (1:00 PM – 4:00 PM)</option>
                <option value="Evening (4:00 PM – 8:00 PM)">Evening (4:00 PM – 8:00 PM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Message */}
        <div>
          <label htmlFor="additionalMessage" className="block text-xs uppercase tracking-wider font-sans font-semibold text-forest-900 mb-2">
            Special Requests or Hair Details <span className="text-forest-400 font-normal">(Optional)</span>
          </label>
          <textarea
            id="additionalMessage"
            name="additionalMessage"
            rows={3}
            value={formData.additionalMessage}
            onChange={(e) => setFormData({ ...formData, additionalMessage: e.target.value })}
            placeholder="Tell us about your hair length, inspiration style, skin type, or masterclass questions..."
            className="w-full px-4 py-3 bg-ivory text-forest-900 text-sm rounded-sm border border-forest-900/15 focus:border-forest-800 focus:outline-none focus:ring-2 focus:ring-gold-500/50 resize-y"
          />
        </div>

        {/* Disclaimer / Privacy Notice */}
        <div className="p-4 bg-cream-50 rounded-sm border border-forest-900/5 text-xs text-forest-700/90 leading-relaxed">
          <p className="font-semibold text-forest-900 mb-0.5">Please note:</p>
          Submitting this form does not automatically finalize your slot. Our Satara team will reply on WhatsApp to confirm timing, pricing, and availability. We do not store your details in any external database.
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-4 px-6 bg-[#1A3828] hover:bg-[#122A1E] text-ivory text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.2em] rounded-sm transition-all duration-300 shadow-soft hover:shadow-card flex items-center justify-center gap-2.5 border border-emerald-600/30 cursor-pointer"
          >
            <MessageCircle size={18} className="text-emerald-400" />
            <span>Send Enquiry via WhatsApp (+91 8459890270)</span>
          </button>
        </div>

        {/* Fallback button if popup blocked or user prefers direct link */}
        {submittedUrl && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-sm text-xs text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
              <span>Enquiry formatted! If WhatsApp did not open automatically, click here:</span>
            </div>
            <a
              href={submittedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-700 text-white px-4 py-2 rounded-sm font-semibold tracking-wider uppercase text-[11px] hover:bg-emerald-800 transition-colors whitespace-nowrap"
            >
              <span>Open WhatsApp</span>
              <ExternalLink size={12} />
            </a>
          </div>
        )}
      </form>
    </div>
  );
};
