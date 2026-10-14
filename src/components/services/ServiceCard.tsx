import React from 'react';
import { MessageCircle, Check, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../../types';
import { buildWhatsAppUrl, WhatsAppMessages } from '../../data/brandData';
import { Badge } from '../ui/Badge';
import { trackWhatsAppClick } from '../../services/analytics';

interface ServiceCardProps {
  service: ServiceItem;
  featured?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, featured = false }) => {
  const whatsappUrl = buildWhatsAppUrl(WhatsAppMessages.serviceEnquiry(service.title));

  return (
    <article 
      className={`group relative bg-white rounded-sm border border-forest-900/10 hover:border-gold-500/40 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-soft hover:shadow-card ${
        featured ? 'ring-1 ring-gold-400/30' : ''
      }`}
    >
      {/* Image Container with Restrained Zoom */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-200">
        <img
          src={service.image}
          alt={service.title}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <Badge variant={service.badge === 'Masterclass Special' ? 'rose' : service.badge === 'Signature' ? 'gold' : 'ivory'}>
            {service.categoryLabel}
          </Badge>

          {service.badge && (
            <span className="bg-forest-950/85 backdrop-blur-sm text-gold-300 text-[10px] font-sans font-medium px-2 py-0.5 rounded-sm border border-gold-400/30 tracking-wider uppercase">
              {service.badge}
            </span>
          )}
        </div>

        {/* Subtle Gradient Shadow at Image Bottom */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl text-forest-900 font-normal leading-snug group-hover:text-forest-700 transition-colors">
            {service.title}
          </h3>

          <p className="mt-2.5 text-xs sm:text-sm text-forest-700/80 leading-relaxed font-sans">
            {service.shortDescription}
          </p>

          {/* Key Inclusions / Features */}
          {service.features && service.features.length > 0 && (
            <ul className="mt-4 space-y-1.5 pt-3 border-t border-forest-900/5">
              {service.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-[11px] sm:text-xs text-forest-800">
                  <Check size={12} className="text-rose-500 flex-shrink-0" />
                  <span className="truncate">{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Card Footer: Enquiry Action & Price Indicator */}
        <div className="mt-6 pt-4 border-t border-forest-900/10 flex items-center justify-between gap-3">
          <div>
            {service.price ? (
              <span className="font-serif text-lg text-forest-900 font-semibold">{service.price}</span>
            ) : (
              <span className="text-[11px] text-forest-600 uppercase tracking-wider font-sans">
                Price on Consultation
              </span>
            )}
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('service_card', service.title)}
            className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 hover:text-emerald-700 transition-colors py-1 group/btn"
            aria-label={`Enquire about ${service.title} on WhatsApp`}
          >
            <MessageCircle size={14} className="text-emerald-600 transition-transform group-hover/btn:scale-110" />
            <span>Enquire</span>
            <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5 text-forest-500" />
          </a>
        </div>
      </div>
    </article>
  );
};
