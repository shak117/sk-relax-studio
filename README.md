# SK RELAX BEAUTY ACADEMY & SALON — SATARA

A premium, production-ready, multi-page catalogue and appointment-inquiry website for **SK RELAX BEAUTY ACADEMY & SALON, Satara, Maharashtra, India**.

Designed with a luxury contemporary aesthetic: deep forest green, warm ivory, muted dusty rose, and restrained champagne gold.

---

## 💎 Features

- **Cinematic Video Hero:** Full-viewport background video (`/videos/sk-relax-hero.mp4`) with automatic fallback poster image, reduced-motion support, and graceful error recovery.
- **Masterclass Showcase:** Complete 3-Day Hair Cutting Masterclass module inspired by the official SK Relax academy poster (Butterfly Haircut, Long Layer Cut, Feather Cut, Curtain Bangs, Face Framing, dummy heads provided).
- **Direct WhatsApp Booking Engine:** Generates neatly formatted, URL-encoded appointment and course enquiries sent directly to WhatsApp (`+91 8459890270`). No backend or database required.
- **Interactive Portfolio Gallery:** Responsive masonry grid with category filters (Hair Artistry, Academy, Bridal, Skin, Studio) and an accessible lightbox with keyboard navigation.
- **Responsive Navigation:** Fixed luxury desktop header with transparent-to-frosted transitions and a full-featured mobile drawer.
- **SEO & Performance:** Full semantic HTML5, Open Graph tags, sitemap.xml, robots.txt, and optimized local imagery.

---

## 📁 Project Structure

```text
sk-relax-studio/
├── public/
│   ├── images/
│   │   ├── academy/          # Masterclass poster, mannequin practice photos
│   │   ├── gallery/          # Portfolio photographs
│   │   ├── services/         # Haircut and service imagery
│   │   ├── hero-poster.jpg   # Video fallback poster
│   │   └── og-preview.jpg    # Social share card
│   ├── videos/
│   │   └── sk-relax-hero.mp4 # Cinematic salon video
│   ├── logo-icon.svg         # Brand silhouette mark
│   ├── robots.txt            # SEO crawler configuration
│   ├── sitemap.xml           # Sitemap index
│   └── _redirects            # SPA redirect rule for Netlify/Cloudflare
├── src/
│   ├── components/
│   │   ├── academy/          # CourseCard, syllabus components
│   │   ├── forms/            # BookingForm, ContactForm (WhatsApp flows)
│   │   ├── gallery/          # GalleryGrid, Lightbox
│   │   ├── hero/             # HeroVideo component with fallback
│   │   ├── layout/           # AnnouncementBar, Header, Footer, MobileDrawer
│   │   ├── services/         # ServiceCard, CategoryFilter
│   │   └── ui/               # BrandLogo, Button, Badge, ScrollReveal, WhatsAppFloating
│   ├── data/
│   │   ├── brandData.ts      # Contact info, WhatsApp link generator, studio hours
│   │   ├── servicesData.ts   # Haircuts, treatments, facials, bridal packages
│   │   ├── academyData.ts    # 3-Day masterclass curriculum, inclusions, fees
│   │   └── galleryData.ts    # Filterable portfolio items
│   ├── hooks/
│   │   ├── useDocumentTitle.ts
│   │   └── useReducedMotion.ts
│   ├── pages/
│   │   ├── HomePage.tsx      # Cinematic home experience
│   │   ├── ServicesPage.tsx  # Full categorized services catalogue
│   │   ├── AcademyPage.tsx   # Beauty academy & masterclass details
│   │   ├── GalleryPage.tsx   # Portfolio with lightbox
│   │   ├── BookingPage.tsx   # WhatsApp booking flow
│   │   ├── ContactPage.tsx   # Satara location & contact
│   │   └── NotFoundPage.tsx  # 404 page
│   ├── types/
│   │   └── index.ts          # Shared TypeScript models
│   ├── App.tsx               # Route definitions & scroll restoration
│   ├── main.tsx              # Entry point
│   └── index.css             # Tailwind and luxury design tokens
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally in Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) or [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized static build will be generated in the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🎨 Central Content Updates

All salon information is centralized in clean TypeScript data files:

1. **Brand & Contact Details:** Edit `src/data/brandData.ts` to update the WhatsApp number, Instagram handle, opening hours, or announcement strip.
2. **Services & Pricing:** Edit `src/data/servicesData.ts` to add/edit haircut styles, treatments, facials, or add verified prices.
3. **Academy Masterclasses:** Edit `src/data/academyData.ts` to update course fees, batch dates, inclusions, or syllabus topics.
4. **Gallery Images:** Edit `src/data/galleryData.ts` to update captions or add client photographs.
5. **Hero Video:** Replace `/public/videos/sk-relax-hero.mp4` with any new high-definition video. The player adjusts automatically.

---

## 📱 WhatsApp Integration

All booking and enquiry CTAs address:
- **WhatsApp Number:** `918459890270`
- **Format:** `https://wa.me/918459890270?text=ENCODED_MESSAGE`
- **Confirmation Policy:** Explicitly informs clients that appointments and batch enrollments are subject to direct confirmation via WhatsApp.
