import React, { useState } from 'react';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { buildWhatsAppUrl } from '../../data/brandData';

export const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Enquiry');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; message?: string }>({});
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; phone?: string; message?: string } = {};

    if (!name.trim()) newErrors.name = 'Please provide your name.';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) newErrors.phone = 'Please provide a 10-digit mobile number.';
    if (!message.trim()) newErrors.message = 'Please provide your message.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    let text = `💌 *GENERAL INQUIRY / CONTACT* 💌\n\n`;
    text += `👤 *Name:* ${name.trim()}\n`;
    text += `📱 *Phone:* ${cleanPhone}\n`;
    text += `📌 *Subject:* ${subject}\n`;
    text += `💬 *Message:* ${message.trim()}\n\n`;
    text += `_Sent from SK Relax Website Contact Form_`;

    const url = buildWhatsAppUrl(text);
    setSubmittedUrl(url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider font-semibold text-forest-900 mb-1">
          Your Name <span className="text-rose-500">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Radhika Deshmukh"
          className="w-full px-4 py-2.5 bg-ivory text-forest-900 text-sm rounded-sm border border-forest-900/15 focus:border-forest-800 focus:outline-none focus:ring-1 focus:ring-forest-800"
          required
        />
        {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="contact-phone" className="block text-xs uppercase tracking-wider font-semibold text-forest-900 mb-1">
          Mobile Number <span className="text-rose-500">*</span>
        </label>
        <input
          id="contact-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="10-digit contact number"
          className="w-full px-4 py-2.5 bg-ivory text-forest-900 text-sm rounded-sm border border-forest-900/15 focus:border-forest-800 focus:outline-none focus:ring-1 focus:ring-forest-800"
          required
        />
        {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="contact-subject" className="block text-xs uppercase tracking-wider font-semibold text-forest-900 mb-1">
          Inquiry Subject
        </label>
        <select
          id="contact-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-2.5 bg-ivory text-forest-900 text-sm rounded-sm border border-forest-900/15 focus:border-forest-800 focus:outline-none"
        >
          <option value="General Enquiry">General Salon Inquiry</option>
          <option value="Haircut Masterclass Admission">Haircut Masterclass Admission</option>
          <option value="Bridal Beauty Consultation">Bridal Beauty Consultation</option>
          <option value="Skin Facial Recommendation">Skin Facial Recommendation</option>
          <option value="Studio Location & Timings">Studio Location & Timings</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs uppercase tracking-wider font-semibold text-forest-900 mb-1">
          Message <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can our team in Satara help you today?"
          className="w-full px-4 py-2.5 bg-ivory text-forest-900 text-sm rounded-sm border border-forest-900/15 focus:border-forest-800 focus:outline-none resize-y"
          required
        />
        {errors.message && <p className="text-xs text-rose-600 mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full py-3.5 px-6 bg-[#1A3828] hover:bg-[#122A1E] text-ivory text-xs font-sans font-semibold uppercase tracking-widest rounded-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-soft"
      >
        <MessageCircle size={16} className="text-emerald-400" />
        <span>Send Inquiry via WhatsApp</span>
      </button>

      {submittedUrl && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm text-xs text-emerald-900 flex items-center justify-between">
          <span>Inquiry ready! Click to send via WhatsApp:</span>
          <a
            href={submittedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 underline font-semibold flex items-center gap-1"
          >
            Open WhatsApp <ExternalLink size={12} />
          </a>
        </div>
      )}
    </form>
  );
};
