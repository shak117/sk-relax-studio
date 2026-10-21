import React, { useState } from 'react';
import { MessageCircle, Check, ArrowRight, Play, GraduationCap, Sparkles } from 'lucide-react';
import { ServiceItem } from '../../types';
import { WhatsAppMessages } from '../../data/brandData';
import { Badge } from '../ui/Badge';
import { trackWhatsAppClick } from '../../services/analytics';

interface ServiceCardProps {
  service: ServiceItem;
  featured?: boolean;
  onWatchVideo?: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  featured = false,
  onWatchVideo
}) => {
  const [imageError, setImageError] = useState(false);
  const isBridal = service.category === 'makeup-bridal' || service.id.includes('bridal');
  
  // Custom or prefilled WhatsApp message
  const defaultBridalMessage = `Hello SK Relax Beauty Academy & Salon, Satara. I would like to request details and package pricing for your "${service.title}". Please share availability.`;
  const defaultGeneralMessage = WhatsAppMessages.serviceEnquiry(service.title);
  const rawMessage = service.whatsappMessage || (isBridal ? defaultBridalMessage : defaultGeneralMessage);
  const targetNumber = service.whatsappNumber || '918459890270';
  const whatsappUrl = `https://wa.me/${targetNumber.replace(/\D/g, '')}?text=${encodeURIComponent(rawMessage)}`;

  const hasImage = Boolean(service.image && service.image.trim() !== '' && !imageError);

  const renderPricing = () => {
    if (service.pricingMode === 'fixed' && service.price) {
      return (
        <div className="flex items-baseline gap-1.5">
          <span className="font-serif text-lg text-forest-900 font-semibold">
            {service.currency || '₹'}{Number(service.price).toLocaleString('en-IN')}
          </span>
          {service.promotionalPrice && (
            <span className="text-xs text-forest-500 line-through">
              {service.currency || '₹'}{Number(service.promotionalPrice).toLocaleString('en-IN')}
            </span>
          )}
        </div>
      );
    }
    if (service.pricingMode === 'starting' && service.price) {
      return (
        <span className="font-serif text-base text-forest-900 font-semibold">
          From {service.currency || '₹'}{Number(service.price).toLocaleString('en-IN')}
        </span>
      );
    }
    if (service.price) {
      return <span className="font-serif text-lg text-forest-900 font-semibold">{service.price}</span>;
    }
    return (
      <span className="text-[11px] text-forest-600 uppercase tracking-wider font-sans">
        {isBridal ? 'Enquiry Based' : 'Consultation'}
      </span>
    );
  };

  return (
    <article 
      className={`group relative bg-white rounded-sm border border-forest-900/10 hover:border-gold-500/40 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-soft hover:shadow-card h-full ${
        featured ? 'ring-1 ring-gold-400/30' : ''
      }`}
    >
      {hasImage ? (
        /* Image Container with Restrained Zoom */
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-200">
          <img
            src={service.thumbnail || service.image}
            alt={service.title}
            loading="lazy"
            onError={() => setImageError(true)}
            style={service.imagePosition ? { objectPosition: service.imagePosition } : undefined}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <Badge variant={service.badge === 'Masterclass Special' ? 'rose' : service.badge === 'Signature' ? 'gold' : 'ivory'}>
              {service.categoryLabel}
            </Badge>

            {service.isEducational ? (
              <span className="bg-forest-950/85 backdrop-blur-sm text-gold-300 text-[10px] font-sans font-medium px-2 py-0.5 rounded-sm border border-gold-400/30 tracking-wider uppercase flex items-center gap-1">
                <GraduationCap size={11} />
                <span>Theory & Science</span>
              </span>
            ) : service.badge ? (
              <span className="bg-forest-950/85 backdrop-blur-sm text-gold-300 text-[10px] font-sans font-medium px-2 py-0.5 rounded-sm border border-gold-400/30 tracking-wider uppercase">
                {service.badge}
              </span>
            ) : null}
          </div>

          {/* Video Trigger Overlay if video exists */}
          {service.videoUrl && onWatchVideo && (
            <button
              onClick={() => onWatchVideo(service)}
              className="absolute inset-0 bg-forest-950/30 group-hover:bg-forest-950/50 flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
              aria-label={`Watch video demonstration for ${service.title}`}
            >
              <div className="w-12 h-12 rounded-full bg-forest-950/80 border border-gold-400/60 text-gold-300 flex items-center justify-center shadow-luxury transform transition-transform duration-300 group-hover:scale-110">
                <Play size={18} className="fill-gold-400 text-gold-400 ml-0.5" />
              </div>
            </button>
          )}

          {/* Subtle Gradient Shadow at Image Bottom */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      ) : (
        /* Clean text-only top banner if no suitable image exists */
        <div className="p-5 pb-3 bg-cream-50 border-b border-forest-900/10 flex items-center justify-between">
          <Badge variant={service.badge === 'Signature' ? 'gold' : 'ivory'}>
            {service.categoryLabel}
          </Badge>
          <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-sans text-forest-700 bg-white px-2 py-0.5 rounded-sm border border-forest-900/10">
            <Sparkles size={11} className="text-gold-500" />
            <span>Salon Treatment</span>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl text-forest-900 font-normal leading-snug group-hover:text-forest-700 transition-colors">
            {service.title}
          </h3>

          <p className="mt-2.5 text-xs sm:text-sm text-forest-700/80 leading-relaxed font-sans">
            {service.shortDescription || service.description}
          </p>

          {/* Key Inclusions / Features */}
          {service.features && service.features.length > 0 && (
            <ul className="mt-4 space-y-1.5 pt-3 border-t border-forest-900/5">
              {service.features.slice(0, 4).map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-[11px] sm:text-xs text-forest-800">
                  <Check size={12} className="text-rose-500 flex-shrink-0" />
                  <span className="truncate">{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Card Footer: Video & Enquiry Actions */}
        <div className="mt-6 pt-4 border-t border-forest-900/10 flex items-center justify-between gap-3">
          <div>
            {service.videoUrl && onWatchVideo ? (
              <button
                type="button"
                onClick={() => onWatchVideo(service)}
                className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider text-forest-900 hover:text-gold-600 transition-colors py-1"
              >
                <Play size={12} className="text-gold-500 fill-gold-500" />
                <span>Watch Video</span>
              </button>
            ) : (
              renderPricing()
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
            <span>{isBridal ? 'Request Package' : 'Enquire'}</span>
            <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5 text-forest-500" />
          </a>
        </div>
      </div>
    </article>
  );
};
