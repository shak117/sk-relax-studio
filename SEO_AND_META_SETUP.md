# SK RELAX BEAUTY ACADEMY & SALON — SEO & META TRACKING SETUP

This document provides complete instructions for technical SEO, Google Search Console indexing, Google Business Profile local optimization, and Meta Ads conversion tracking for **SK RELAX BEAUTY ACADEMY & SALON, Satara, Maharashtra, India**.

---

## 1. Files Changed & New Files

| File | Purpose |
|---|---|
| [`index.html`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/index.html) | Upgraded with canonical link, Open Graph metadata, Twitter Cards, resource preconnects, and DNS prefetch. |
| [`.env.example`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/.env.example) | Environment template documenting `VITE_SITE_URL`, `VITE_META_PIXEL_ID`, and `VITE_GSC_VERIFICATION_TOKEN`. |
| [`.env`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/.env) | Local development environment configuration. |
| [`scripts/generate-sitemap.js`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/scripts/generate-sitemap.js) | Dynamic sitemap generator script reading `VITE_SITE_URL` and writing valid XML. |
| [`src/services/analytics.ts`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/services/analytics.ts) | Privacy-first Meta Pixel service with deduplication, consent checks, and PII-free event dispatching. |
| [`src/utils/schemaGenerator.ts`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/utils/schemaGenerator.ts) | Schema.org JSON-LD structured data generators for `BeautySalon`, `EducationalOrganization`, `Course`, and `OfferCatalog`. |
| [`src/hooks/usePageSEO.ts`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/hooks/usePageSEO.ts) | Dynamic hook synchronizing document title, meta description, canonical link, social tags, schema, and pageview tracking. |
| [`src/components/ui/TrackingConsent.tsx`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/components/ui/TrackingConsent.tsx) | Discreete privacy and cookie consent banner adhering to privacy standards. |
| [`src/pages/HomePage.tsx`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/pages/HomePage.tsx) | Integrated `usePageSEO`, `LocalBusiness` schema, and natural local keyword context. |
| [`src/pages/ServicesPage.tsx`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/pages/ServicesPage.tsx) | Integrated `usePageSEO`, `OfferCatalog` schema, and `ViewContent` analytics tracking. |
| [`src/pages/AcademyPage.tsx`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/pages/AcademyPage.tsx) | Integrated `usePageSEO`, `Course` schema, and `ViewContent` masterclass tracking. |
| [`src/pages/GalleryPage.tsx`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/pages/GalleryPage.tsx) | Integrated `usePageSEO` and `BreadcrumbList` schema. |
| [`src/pages/BookingPage.tsx`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/pages/BookingPage.tsx) | Integrated `usePageSEO` and `Lead` / `WhatsApp_Handoff` conversion tracking. |
| [`src/pages/ContactPage.tsx`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/pages/ContactPage.tsx) | Integrated `usePageSEO`, click-to-call tracking, and contact form dispatching. |
| [`src/components/forms/BookingForm.tsx`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/components/forms/BookingForm.tsx) | Integrated PII-free `trackLeadSubmission` on valid form submission. |
| [`src/components/forms/ContactForm.tsx`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/components/forms/ContactForm.tsx) | Integrated `trackContactAction` on valid inquiry submission. |
| [`src/components/services/ServiceCard.tsx`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/components/services/ServiceCard.tsx) | Integrated `trackWhatsAppClick` on individual service card inquiries. |
| [`src/components/academy/CourseCard.tsx`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/components/academy/CourseCard.tsx) | Integrated `trackWhatsAppClick` on academy masterclass inquiries. |
| [`src/components/ui/WhatsAppFloating.tsx`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/components/ui/WhatsAppFloating.tsx) | Integrated `trackWhatsAppClick` on floating button interaction. |
| [`src/App.tsx`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/App.tsx) | App-level initialization of Meta Pixel and rendering of `TrackingConsent`. |
| [`package.json`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/package.json) | Updated `build` script to generate dynamic XML sitemap prior to bundle compilation. |

---

## 2. SEO Implementation Summary

1. **Unique Titles & Meta Descriptions:** Every route possesses unique, human-crafted meta descriptions and titles tailored to Satara search queries without robotic stuffing.
2. **Canonical URLs:** Dynamically managed via `usePageSEO` to eliminate duplicate content issues across protocols or query strings.
3. **Structured Data (JSON-LD):**
   - Verified `@type: ["BeautySalon", "EducationalOrganization"]` on all pages.
   - Verified `@type: "Course"` on `/academy` for the 3-Day Hair Cutting Masterclass.
   - Verified `@type: "OfferCatalog"` on `/services`.
   - Verified `@type: "BreadcrumbList"` on subpages.
   - **Zero fabricated information:** No fake star ratings, zero fake aggregate reviews, no unverified GPS coordinates.
4. **Technical Files:**
   - Valid `/robots.txt` granting access to web crawlers and linking directly to `/sitemap.xml`.
   - Dynamic `/sitemap.xml` listing all 6 public routes with priority and change frequencies.

---

## 3. Target Keyword Map by Page

| Route | Page Title | Primary Keyword Intent | Supporting Local Keywords |
|---|---|---|---|
| `/` | `SK Relax Beauty Academy & Salon \| Satara` | `SK Relax Satara`, `SK Relax Salon Satara` | `hair salon in Satara`, `beauty parlour in Satara`, `haircut in Satara`, `SK Relax official website` |
| `/services` | `Salon Services in Satara \| SK Relax` | `Salon Services in Satara`, `haircut in Satara` | `hair styling in Satara`, `facial and skincare in Satara`, `butterfly haircut Satara` |
| `/academy` | `Beauty Academy in Satara \| SK Relax` | `Beauty Academy in Satara`, `hair cutting course in Satara` | `professional beautician course in Satara`, `SK Relax Beauty Academy Satara` |
| `/gallery` | `Salon Gallery \| SK Relax Beauty Academy, Satara` | `SK Relax photos Satara`, `salon portfolio Satara` | `bridal makeup in Satara`, `haircut styles Satara` |
| `/booking` | `Book a Salon Appointment in Satara \| SK Relax` | `salon appointment Satara`, `book salon Satara` | `WhatsApp salon booking Satara` |
| `/contact` | `Contact SK Relax Beauty Academy & Salon \| Satara` | `SK Relax contact number`, `SK Relax Satara address` | `beauty parlour phone number Satara`, `salon near me Satara` |

---

## 4. Required Deployment Configuration

When deploying to production (Vercel, Netlify, Cloudflare Pages, or a VPS):

1. **Set Environment Variables:**
   ```bash
   # Set the actual verified domain (e.g., https://skrelaxbeauty.com)
   VITE_SITE_URL=https://skrelaxbeauty.com

   # Set the client's existing Meta Pixel ID (from Meta Events Manager)
   VITE_META_PIXEL_ID=YOUR_META_PIXEL_ID_HERE

   # Optional Google Search Console HTML verification token
   VITE_GSC_VERIFICATION_TOKEN=YOUR_GSC_TOKEN_HERE

   # Whether user consent is required before firing marketing tracking (true/false)
   VITE_REQUIRE_CONSENT=true
   ```
2. **Build and Deploy:**
   Running `npm run build` will:
   - Run `scripts/generate-sitemap.js` using `VITE_SITE_URL`.
   - Compile TypeScript without errors.
   - Build optimized production static bundles into `dist/`.

---

## 5. Meta Pixel Installation & Verification Steps

The client already has an existing Meta Ads account. Follow these steps to activate tracking:

### Step 1: Obtain the Existing Pixel / Dataset ID
1. Log in to [Meta Business Suite](https://business.facebook.com/) or [Meta Ads Manager](https://adsmanager.facebook.com/).
2. Navigate to **Events Manager** > **Data Sources**.
3. Select the existing SK Relax Pixel / Dataset.
4. In the **Settings** tab, locate the **Dataset ID** (a 15–16 digit number, e.g., `123456789012345`).
5. Copy this ID.

### Step 2: Configure Environment Variable
In your hosting provider dashboard (e.g. Vercel / Netlify environment variables), add:
```text
VITE_META_PIXEL_ID = 123456789012345
```
Re-deploy the project.

### Step 3: Test Events in Meta Events Manager
1. In Meta Events Manager, go to **Test Events**.
2. Under "Test Browser Events", enter the website URL and click **Open Website**.
3. Perform the following test actions:
   - **Visit Home, Services, Academy:** Observe `PageView` and `ViewContent` events.
   - **Click WhatsApp on a Service Card:** Observe `Contact` and `WhatsApp_Click` events.
   - **Submit the Booking Form:** Fill test data, click Send Enquiry, and observe the `Lead` and `WhatsApp_Handoff` events.
4. Verify in the Test Events log that events appear once without duplicates and **contain NO personal data** (names or phone numbers).

---

## 6. Event Names & Exact Trigger Conditions

| Event Name | Standard / Custom | Trigger Condition | Parameters Included (PII-Free) |
|---|---|---|---|
| `PageView` | Standard | Fired once on each route change (`/`, `/services`, `/academy`, etc.). Deduplicated against re-renders. | None |
| `ViewContent` | Standard | Viewing the Services Catalogue or Academy Masterclass page. | `{ content_name, content_category, value?, currency: 'INR' }` |
| `Lead` | Standard | **ONLY** fired when the user completes and successfully validates the booking form and proceeds to WhatsApp handoff. (Does NOT fire on form focus or typing). | `{ content_name: serviceName, content_category: 'Appointment Inquiry', currency: 'INR', value: 0 }` |
| `Contact` | Standard | Clicking the phone call link (`tel:`), clicking Instagram, or submitting the general contact form. | `{ content_name, content_category: touchpoint }` |
| `WhatsApp_Handoff` | Custom | Fired upon successful appointment form submission redirecting to WhatsApp. | `{ service_name, has_date: bool, has_time: bool, destination: '918459890270' }` |
| `WhatsApp_Click` | Custom | Clicking any direct WhatsApp CTA button (service card, floating button, drawer, footer). | `{ touchpoint, service_name }` |

> [!IMPORTANT]
> **Understanding WhatsApp Conversion Attribution:**
> A `Lead` or `WhatsApp_Handoff` event indicates that a visitor clicked through to WhatsApp with pre-filled enquiry parameters. A website pixel cannot track whether the user actually pressed "Send" inside the third-party WhatsApp application or whether they completed their appointment in the salon.

---

## 7. Google Search Console Setup Instructions

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property**:
   - **Recommended:** Domain property (`skrelaxbeauty.com`) via DNS TXT record at your domain registrar.
   - **Alternative:** URL prefix property (`https://skrelaxbeauty.com`) via HTML tag or file upload.
3. Once verified, navigate to **Sitemaps** in the left menu.
4. Enter `sitemap.xml` in the "Add a new sitemap" box and click **Submit**.
5. Go to **URL Inspection**, enter `https://skrelaxbeauty.com/`, and click **Request Indexing**.
6. Check back in 3–5 days to monitor:
   - **Performance:** Impressions, clicks, and average CTR for branded keywords like *"SK Relax Satara"*.
   - **Pages:** Confirmation that all 6 public URLs are indexed without errors.

---

## 8. Google Business Profile (GBP) Checklist

Local Google Maps rankings depend heavily on an authentic Google Business Profile matching website details:

- [ ] **Claim/Access Listing:** Log into [Google Business Profile](https://business.google.com/) using the client's official business Google account.
- [ ] **Business Name:** Use the exact official business name: `SK Relax Beauty Academy & Salon`. (Do not keyword-stuff with terms like "Best Salon in Satara" which violates Google guidelines).
- [ ] **Primary Category:** `Beauty Salon`
- [ ] **Secondary Categories:** `Hair Salon`, `Beauty School`, `Make-up Artist`.
- [ ] **Phone Number:** `+91 8459890270` (must match website exactly).
- [ ] **Website Link:** Add the verified URL `https://skrelaxbeauty.com`.
- [ ] **Opening Hours:**
  - Monday – Saturday: 10:00 AM – 8:00 PM
  - Sunday: 10:00 AM – 6:00 PM
- [ ] **Photos:** Upload high-resolution photos of the salon exterior, salon signage, interior styling stations, haircut models, and dummy training setups.
- [ ] **Customer Reviews:** Share the direct Google review link with genuine clients after their studio visits. (Never offer discounts or gifts in exchange for reviews).

---

## 9. Remaining Tasks Requiring Client Confirmation

1. **Domain Registration & DNS:** Client to provide final domain name so `VITE_SITE_URL` can be updated.
2. **Meta Pixel Dataset ID:** Client/marketing manager to provide the 15–16 digit ID from Meta Events Manager.
3. **Exact Studio Address:** Client to supply the physical street address/building name in Satara to update schema `streetAddress` and `postalCode`.
4. **Google Search Console Ownership:** Client to verify domain property in GSC.
