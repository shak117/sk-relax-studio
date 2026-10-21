# SK RELAX BEAUTY ACADEMY & SALON — CONTENT & ASSET MANAGEMENT GUIDE

Welcome to the official content, asset architecture, and dynamic batch management guide for **SK Relax Beauty Academy & Salon, Satara, Maharashtra**.

This document outlines the website's structure, media assets, video mappings, course catalogue, dynamic batch CMS, and instructions for managing and updating the website.

---

## 1. Brand Identity & Global Business Details

All core brand constants are centralized in [`src/data/brandData.ts`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/data/brandData.ts).

* **Salon / Academy Name**: SK RELAX BEAUTY ACADEMY & SALON
* **Founder & Lead Educator**: Salma Attar
* **Location / Address**: 6, Rajwada Cir, near IDBI Bank, Pratapganj Peth, Shaniwar Peth, Malhar Peth, Satara, Maharashtra 415002, India
* **Operating Hours**: Mon – Sun: 11:00 AM – 6:00 PM
* **Phone / WhatsApp**: `+91 8459890270`
* **WhatsApp Link**: `https://wa.me/918459890270`
* **Instagram**: `https://www.instagram.com/skrelax_2010/`
* **Developer Credit**: `Designed & Developed by Cloud Technologies`

---

## 2. Media Asset Directories in `public/`

All public media files are organized into semantic folders for quick updates:

```
public/
├── hero-frames/                      # 720 frames (0001.webp - 0720.webp) for homepage cinematic scroll
├── uploads/
│   └── batches/                      # Live user-uploaded batch posters & photographs from Admin CMS
├── videos/
│   ├── treatments/                   # Real customer treatment videos
│   │   ├── hydra-facial.mp4          # Hydra Facial treatment demo
│   │   ├── facial-treatment.mp4      # Relaxing facial & skin polishing
│   │   ├── client-hair-service.mp4   # Hair Botox / Nanoplastia service
│   │   ├── client-treatment-transformation.mp4 # Korean glass skin facial & hydro-dermabrasion transformation
│   │   ├── hair-cutting-seminar.mp4  # Educational cutting seminar
│   │   └── salon-experience.mp4      # Overall salon experience
│   ├── events/                       # Batch get-togethers & celebrations
│   │   ├── bridal-styling-celebration.mp4 # Official certificate ceremony & bridal styling video
│   │   ├── batch-celebration.mp4     # Student batch celebration function & certificate ceremony
│   │   └── hands-on-experience.mp4   # Student dummy training workshop
│   └── students/                     # Genuine student video reviews
│       ├── student-review-post.mp4   # Student course feedback video
│       └── student-testimonial-reel.mp4 # Student testimonial reel
└── images/
    ├── team/                         # Founder & faculty photography
    │   ├── salma-attar-founder.jpg   # Verified authentic arched portrait of founder Salma Attar
    │   ├── team-celebration-1.jpg    # Team & batch celebration (rotated & verified)
    │   └── team-group-2.jpg          # Studio educators & mentors group photo
    ├── brochures/                    # Official promotional posters & syllabi
    │   ├── academy-classes-poster.jpg # 20 courses promotional flyer
    │   ├── facial-treatments-syllabus.jpg
    │   ├── machine-knowledge-syllabus.jpg
    │   ├── makeup-syllabus.jpg
    │   └── pmu-microblading-syllabus.jpg
    ├── events/
    │   ├── bridal-styling-certificate-frame.jpg # Salma Attar presenting official certificate
    │   ├── certificate-celebration-hero.jpg     # Stage certificate award ceremony frame
    │   └── hands-on-training-frame.jpg          # Training workshop frame
    ├── gallery/
    │   ├── maharashtrian-bridal-artistry.jpg    # Authentic Paithani bride styled by SK Relax
    │   ├── traditional-silk-bridal-couture.jpg  # Traditional South Indian silk bride makeover
    │   └── pmu-eyebrow-result.jpg               # Real client PMU microblading result
    ├── students/
    │   ├── student-graduate-certificate.jpg # Student holding certificate frame
    │   └── student-hydra-feedback.jpg       # Student hydra machine feedback frame
    ├── treatments/
    │   ├── korean-glass-skin-glow.jpg       # Korean Glass Skin Glow treatment frame
    │   ├── facial-treatment-frame.jpg       # Authentic facial treatment frame
    │   ├── hydra-facial-frame.jpg           # Clinical hydra facial frame
    │   ├── hair-cutting-seminar-frame.jpg   # Live cutting seminar frame
    │   └── skin-polishing-glow.jpg
    └── machines/                     # Aesthetic technology equipment
        └── hydra-facial-machine.jpg  # Authentic 7-in-1 Hydra machine console (rotated)
```

---

## 3. Services & Video Associations

Services are defined in [`src/data/servicesData.ts`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/data/servicesData.ts) across **5 Core Specialties**:

1. **Hair Treatments & Science (`hair-treatments`)**
   - *Hair Botox & Thermal Infusion* (Cuticle restoration, collagen & peptide infusion)
   - *Nanoplastia Organic Straightening* (Linked video: `/videos/treatments/client-hair-service.mp4`)
   - *Advanced Hair Cutting Seminar & Live Demo* (Linked video: `/videos/treatments/hair-cutting-seminar.mp4`, thumbnail: `/images/treatments/hair-cutting-seminar-frame.jpg`)
   - *Scalp-Clarifying & Hair-Strengthening Rituals*
2. **Facials & Skin Aesthetics (`facials-skin`)**
   - *7-in-1 Clinical Hydra Facial* (Linked video: `/videos/treatments/hydra-facial.mp4`, thumbnail: `/images/treatments/hydra-facial-frame.jpg`)
   - *Korean Glass Skin Facial* (Linked video: `/videos/treatments/client-treatment-transformation.mp4`, thumbnail: `/images/treatments/korean-glass-skin-glow.jpg`)
   - *Deep Pore Clarifying & Ultrasonic Extraction*
   - *Botanical Derma Peels*
3. **Makeup & Bridal Artistry (`makeup-bridal`)**
   - *Signature HD Bridal Makeover & Draping* (Direct consultation via WhatsApp)
   - *Reception & Engagement Glamour*
   - *Pre-Bridal Skin Conditioning Rituals*
4. **Permanent Makeup — PMU (`permanent-makeup`)**
   - *Microblading & Eyebrow Shading* (Official syllabus brochure available)
   - *Semi-Permanent Lip Blush*
   - *Lash Lift & Keratin Tinting*
5. **Aesthetic Technology & Machines (`equipment-machines`)**
   - *Certified Hydra Facial Hydro-Suction Apparatus*
   - *High-Frequency Scalp & Skin Stimulation*
   - *Ultrasonic Skin Scrubber & Deep Infusion*

---

## 4. Dynamic Batch CMS & Persistent Backend

The website includes a dynamic, persistent Course Batch Content Management System.

### Storage Architecture
- **Persistent Data File**: [`server/data/batches.json`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/server/data/batches.json) (saved directly to disk, persistent across browser refreshes and different devices).
- **Uploaded Images**: `public/uploads/batches/`
- **Server Middleware**: [`server/apiPlugin.js`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/server/apiPlugin.js) integrated natively into Vite dev server and preview server on port 3000.
- **Client Service**: [`src/services/batchService.ts`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/services/batchService.ts) (handles API communication with automated fallback for offline/static environments).

### Admin Credentials & Access
- **Admin Login Route**: `/admin/login`
- **Admin Dashboard**: `/admin/batches`
- **Default Username**: `admin`
- **Default Password**: `skrelax2026`

### Admin Capabilities:
1. **Create Batch**: Add title, category (Masterclass / Diploma / Workshop), dates, timing, duration, fee (₹), total seats, seats remaining, poster image, trainer, venue, what's included, and daily syllabus breakdown.
2. **Real Image Upload**: Pick any image from your computer; it is automatically validated (<10MB) and uploaded to `public/uploads/batches/`.
3. **Status Control**: Toggle batches between `Enrolling Now`, `Upcoming`, `Completed`, and `Draft` (hidden from public).
4. **Edit & Delete**: Instant updates saved to server disk without rebuilding the website.

---

## 5. Website Pages & Routing Architecture

Routes configured in [`src/App.tsx`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/App.tsx):

| Route Path | Page Component | Features & Purpose |
| :--- | :--- | :--- |
| `/` | `HomePage.tsx` | 720-frame scroll hero, Salma Attar verified portrait spotlight, Academy banner, Batch celebrations, Student feedback, Gallery preview |
| `/services` | `ServicesPage.tsx` | 5 category filters, Video Player modal, Brochure syllabi, Bridal consultation CTA |
| `/academy` | `AcademyPage.tsx` | 20% discount offer banner, 5 Flagship courses, 20-course searchable directory, syllabus downloads |
| `/batches` | `BatchesPage.tsx` | Upcoming and enrolling academy batches, search filter, dummy mannequin highlight, WhatsApp enquiry |
| `/batches/:id` | `BatchDetailPage.tsx` | Dedicated masterclass page, day-by-day syllabus, transparent fee, dummy head training details, WhatsApp booking |
| `/team` | `OurTeamPage.tsx` | Founder Salma Attar spotlight, educator bios, expertise credentials, WhatsApp consultation |
| `/events` | `EventsPage.tsx` | Batch celebrations, get-togethers, hands-on workshop videos with modal player |
| `/student-feedback` | `StudentFeedbackPage.tsx` | Authentic video reviews, student quotes, course badges |
| `/gallery` | `GalleryPage.tsx` | Filterable portfolio across Hair, Skin, Bridal, Academy, Team, and Events |
| `/booking` | `BookingPage.tsx` | Dynamic appointment booking form with instant WhatsApp submission |
| `/contact` | `ContactPage.tsx` | Interactive Google Map, studio address, hours (11am-6pm), direct call & WhatsApp |
| `/admin/login` | `AdminLoginPage.tsx` | Secure admin login portal for batch administration |
| `/admin/batches` | `AdminBatchesPage.tsx` | Full CRUD batch management with live image upload and disk persistence |

---

## 6. Seeded Batches in System

The initial system comes pre-seeded with four authentic batches:

1. **3-Day Advanced Hair Cutting & Layering Masterclass**
   - **Slug**: `hair-cutting-masterclass`
   - **Dates**: October 23 – 25, 2026
   - **Fee**: ₹4,000 (all-inclusive)
   - **Special Highlight**: Individual mannequin dummy head provided to each student to take home.
   - **Seats**: 15 Total, 4 Remaining (Enrolling Now)
   - **Lead Trainer**: Salma Attar

2. **Professional 20-in-1 Beauty, Hair & Aesthetic Diploma**
   - **Slug**: `beauty-hair-diploma`
   - **Dates**: November 10 – December 15, 2026
   - **Fee**: ₹25,000
   - **Special Highlight**: Complete professional starter kit & machine aesthetics included.
   - **Seats**: 12 Total, 6 Remaining (Upcoming)

3. **Clinical 7-in-1 Hydra Aesthetic & Machine Training**
   - **Slug**: `hydra-facial-workshop`
   - **Dates**: November 28 – 29, 2026
   - **Fee**: ₹6,500
   - **Special Highlight**: Hands-on machine handling and serum protocols.
   - **Seats**: 10 Total, 5 Remaining (Upcoming)

4. **Monsoon Hair Styling & Layer Graduation Batch**
   - **Slug**: `monsoon-hair-styling`
   - **Dates**: August 15 – 17, 2026
   - **Status**: Completed (15 certified graduates)

---

*Authored for SK Relax Beauty Academy & Salon, Satara · Maintained by Cloud Technologies.*
