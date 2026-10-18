export const BRAND = {
  name: "SK RELAX BEAUTY ACADEMY & SALON",
  shortName: "SK RELAX",
  address: "6, Rajwada Cir, near IDBI Bank, Pratapganj Peth, Shaniwar Peth, Malhar Peth, Satara, Maharashtra 415002, India",
  locationName: "6, Rajwada Cir, near IDBI Bank, Pratapganj Peth, Satara, Maharashtra 415002",
  city: "Satara",
  state: "Maharashtra",
  postalCode: "415002",
  country: "India",
  phone: "+91 8459890270",
  whatsappNumber: "918459890270", // Exactly formatted without plus or spaces
  instagramUrl: "https://www.instagram.com/skrelax_2010/",
  instagramHandle: "@skrelax_2010",
  tagline: "Your Beauty. Your Signature.",
  academyTagline: "Learn ♡ Practice ♡ Grow",
  eyebrow: "SK RELAX BEAUTY ACADEMY & SALON · SATARA",
  introQuote: "Beauty is more than a look. It is how you feel.",
  introBody: "Welcome to SK RELAX Beauty Academy & Salon in Satara — an intimate sanctuary of contemporary style, individualized hair artistry, skin restoration, and professional beauty masterclasses. Every appointment is crafted with bespoke care, precision technique, and an editorial touch designed around you.",
  hours: [
    { days: "Monday – Sunday", time: "11:00 AM – 6:00 PM" }
  ],
  announcement: {
    badge: "Upcoming Masterclass",
    text: "Enquire now for the next 3-Day Hair Cutting Masterclass batch with hands-on dummy practice!",
    linkText: "View Masterclass Details",
    linkUrl: "/academy"
  },
  googleMapsUrl: "https://maps.google.com/?q=6%2C+Rajwada+Cir%2C+near+IDBI+Bank%2C+Pratapganj+Peth%2C+Satara%2C+Maharashtra+415002",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.730335017282!2d73.9870817!3d17.6865239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc239be08d96bbd%3A0x5f4ada5501d688cf!2sRajwada%2C%20Satara%2C%20Maharashtra%20415002!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  developer: {
    credit: "Designed & Developed by Cloud Technologies"
  }
};

/**
 * Generates an official WhatsApp click-to-chat URL with properly encoded message
 */
export function buildWhatsAppUrl(message: string): string {
  const cleanNumber = BRAND.whatsappNumber.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanNumber}?text=${encoded}`;
}

/**
 * Builds standard prefilled messages for different touchpoints
 */
export const WhatsAppMessages = {
  general: () => 
    `Hello SK Relax Beauty Academy & Salon, Satara. I would like to enquire about your salon services and schedule an appointment. Please share available slots.`,
  
  serviceEnquiry: (serviceName: string) =>
    `Hello SK Relax Beauty Academy & Salon, Satara. I would like to enquire about ${serviceName}. Please share details, pricing, and available appointment slots.`,
  
  academyEnquiry: (courseName: string, batch?: string) =>
    `Hello SK Relax Beauty Academy, Satara. I would like to enquire about enrollment for the "${courseName}"${batch ? ` (${batch})` : ''}. Please share syllabus, fees, and upcoming batch details.`,
  
  bookingRequest: (data: {
    fullName: string;
    mobileNumber: string;
    preferredService: string;
    preferredDate?: string;
    preferredTime?: string;
    additionalMessage?: string;
  }) => {
    let msg = `✨ *NEW APPOINTMENT ENQUIRY* ✨\n\n`;
    msg += `👤 *Name:* ${data.fullName}\n`;
    msg += `📱 *Phone:* ${data.mobileNumber}\n`;
    msg += `💇‍♀️ *Service:* ${data.preferredService}\n`;
    if (data.preferredDate) {
      msg += `📅 *Preferred Date:* ${data.preferredDate}\n`;
    }
    if (data.preferredTime) {
      msg += `⏰ *Preferred Time:* ${data.preferredTime}\n`;
    }
    if (data.additionalMessage && data.additionalMessage.trim().length > 0) {
      msg += `📝 *Notes:* ${data.additionalMessage.trim()}\n`;
    }
    msg += `\n📍 *Location:* Satara, Maharashtra\n`;
    msg += `_Sent via SK Relax Beauty Studio Website_`;
    return msg;
  }
};
