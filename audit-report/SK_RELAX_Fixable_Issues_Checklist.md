# SK RELAX BEAUTY ACADEMY & SALON
## Comprehensive Technical Audit — Fixable Issues & Remediation Register

**Prepared by:** Cloud Technologies  
**Audit Scope:** Full Codebase, CMS, APIs, Security, Performance & VPS Readiness  
**Audit Date:** November 2026  

---

## Issue Classification Summary

| Severity | Count | Status | Impact on Deployment |
|---|---|---|---|
| **CRITICAL** | 1 | Open | **Deployment Blocker** — Must be resolved before running on Hostinger VPS |
| **HIGH** | 3 | Open | High operational and deployment efficiency risk |
| **MEDIUM** | 5 | Open | Affects SEO, initial bundle size, and CMS completeness |
| **LOW** | 2 | Open | Minor hardening and optimization improvements |
| **TOTAL** | **11** | — | — |

---

## 1. CRITICAL SEVERITY ISSUES (Deployment Blockers)

### `ISSUE-CRIT-01`: Missing Standalone Production Node Server for VPS PM2 Process Management
* **Module:** DevOps / Server Architecture
* **Severity:** **CRITICAL** (Deployment Blocker)
* **Description:** The entire backend API (`/api/*`) and video streaming logic (`/uploads/*`) are currently implemented as a Vite dev-server plugin (`server/apiPlugin.js` via `configureServer` and `configurePreviewServer`). There is **no standalone production server script** (e.g. `server/server.js`) and no `"start"` script in `package.json`.
* **Evidence:**
  * `package.json` contains only `"scripts": { "dev": "vite", "build": "...", "preview": "vite preview" }`.
  * `vite.config.ts` loads API logic through `plugins: [batchApiPlugin()]`.
  * On a Hostinger VPS with Nginx, Nginx serves static HTML/JS from `dist/` and expects a backend process on `http://127.0.0.1:3000` to handle `/api/` requests. Running `vite preview` in production is officially discouraged by Vite due to memory bloat, lack of clustering, and missing production error handling.
* **File Affected:** [`package.json`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/package.json), [`server/apiPlugin.js`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/server/apiPlugin.js)
* **Recommended Solution:**
  1. Create a dedicated `server/server.js` using Node.js native `http.createServer` or lightweight Express that imports and mounts the existing `handleMiddleware()` function.
  2. Add `"start": "node server/server.js"` to `package.json`.
  3. Create an `ecosystem.config.cjs` for PM2 management on the VPS.
* **Estimated Effort:** 1 hour
* **Verification Procedure:** Run `npm start` in production mode and verify that `GET /api/services` and `POST /api/admin/login` respond without Vite running.

---

## 2. HIGH SEVERITY ISSUES

### `ISSUE-HIGH-01`: 1.87 GB Unused Hero Frame Sequence Archives in `public/hero-frames/`
* **Module:** Build & Asset Management
* **Severity:** **HIGH**
* **Description:** An experimental scroll-bound hero frame animation was replaced with `<HeroVideo>` (`sk-relax-cinematic-hero.mp4`), but three massive zip archives and hundreds of unzipped JPEG frames remain inside `public/hero-frames/`.
* **Evidence:**
  * `public/hero-frames/` occupies **1,868 MB (1.87 GB)** on disk.
  * Includes 3 ZIP archives: `Stylist_adjusting_client_hair...zip` (271 MB), `Stylist_preparing_for_haircut...zip` (435 MB), `Stylist_trimming_brunette_hair...zip` (258 MB).
  * Vite's build automatically copies all files in `public/` into `dist/`. Consequently, `dist/` swells to nearly **2 GB**, causing deployment uploads to Hostinger VPS over SSH/FTP to take hours and wasting VPS disk space.
* **Files Affected:** `public/hero-frames/`
* **Recommended Solution:**
  1. Move the three ZIP files and unneeded raw frame sequences out of `public/` into an archival directory (e.g., `archive/hero-frames-raw/`) or delete them if no longer needed.
  2. Retain only the lightweight poster image (`public/hero-frames/hero-scroll-poster.jpg` - 156 KB) required by `<HeroVideo>`.
* **Estimated Effort:** 15 minutes
* **Verification Procedure:** Run `npm run build` and verify that the `dist/` directory size drops from ~2 GB to under 80 MB.

---

### `ISSUE-HIGH-02`: Lack of Atomic File Writes for JSON Database Files
* **Module:** Database & Data Persistence
* **Severity:** **HIGH**
* **Description:** Database updates in `server/apiPlugin.js` (`writeServices`, `writeBatches`, `writeGallery`) write directly to disk using synchronous `fs.writeFileSync(FILE_PATH, ...)`. If the server experiences a sudden power loss, process crash, or server restart mid-write, the target JSON file can be truncated to 0 bytes or corrupted.
* **Evidence:**
  * Code inspection of lines 139, 483, 209 in `server/apiPlugin.js`.
* **Files Affected:** [`server/apiPlugin.js`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/server/apiPlugin.js)
* **Recommended Solution:**
  * Implement an atomic write helper that writes to a temporary file first (`${filePath}.tmp`), syncs to disk (`fs.fsyncSync`), and performs an atomic rename (`fs.renameSync`).
  * Schedule daily automated backups of `server/data/` on the VPS using a cron job.
* **Estimated Effort:** 30 minutes
* **Verification Procedure:** Write a stress test simulating interrupted file writes and verify zero file corruption.

---

### `ISSUE-HIGH-03`: In-Memory Rate Limiter Resets on Process Restart
* **Module:** Security / Authentication
* **Severity:** **HIGH**
* **Description:** The login rate-limiter in `server/apiPlugin.js` tracks failed attempts in an in-memory `Map` (`loginAttempts = new Map()`).
* **Evidence:**
  * Lines 69-96 of `server/apiPlugin.js`.
  * If a brute-force attacker causes a PM2 process restart or if the server reboots, the lockout state is erased, allowing another 5 attempts immediately.
* **Files Affected:** [`server/apiPlugin.js`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/server/apiPlugin.js)
* **Recommended Solution:**
  * Store lockout records in a lightweight JSON file (`server/data/login_lockouts.json`) or configure fail2ban / Nginx rate limiting on the VPS reverse proxy.
* **Estimated Effort:** 30 minutes
* **Verification Procedure:** Trigger 5 failed logins, verify lockout, restart server process, and confirm lockout persists.

---

## 3. MEDIUM SEVERITY ISSUES

### `ISSUE-MED-01`: Admin CMS Pages Bundled in Public Client Bundle
* **Module:** Frontend Performance & Code Splitting
* **Severity:** **MEDIUM**
* **Description:** `App.tsx` imports all admin pages statically (`AdminServicesPage`, `AdminBatchesPage`, `AdminGalleryPage`). These pages comprise over 3,500 lines of complex modal logic, lucide icons, and table renders.
* **Evidence:**
  * `dist/assets/index-*.js` is **653.29 kB** minified.
  * Rollup warning: `(!) Some chunks are larger than 500 kB after minification.`
  * Regular salon visitors visiting the homepage are forced to download all admin CMS code.
* **Files Affected:** [`src/App.tsx`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/App.tsx)
* **Recommended Solution:**
  * Convert admin routes in `App.tsx` to `React.lazy(() => import('./pages/admin/...'))` with a `<Suspense>` fallback.
* **Estimated Effort:** 20 minutes
* **Verification Procedure:** Run `npm run build` and verify that an independent `admin-*.js` chunk is generated, reducing the main vendor chunk below 450 kB.

---

### `ISSUE-MED-02`: Search Engine Crawlers Allowed to Index Admin Routes
* **Module:** SEO & Security
* **Severity:** **MEDIUM**
* **Description:** `public/robots.txt` currently has `Allow: /` without any disallow directives for administrative paths.
* **Evidence:**
  * Lines 1-4 of `public/robots.txt`:
    ```txt
    User-agent: *
    Allow: /
    Sitemap: https://skrelaxbeauty.com/sitemap.xml
    ```
* **Files Affected:** [`public/robots.txt`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/public/robots.txt)
* **Recommended Solution:**
  * Add `Disallow: /admin/` and `Disallow: /api/` to `public/robots.txt`.
* **Estimated Effort:** 5 minutes
* **Verification Procedure:** Inspect `http://localhost:3000/robots.txt` and verify `Disallow: /admin/` is present.

---

### `ISSUE-MED-03`: Sitemap Generator Missing Dynamic Academy Batch Pages
* **Module:** SEO & Organic Search
* **Severity:** **MEDIUM**
* **Description:** `scripts/generate-sitemap.js` only outputs 9 static pages (`/`, `/services`, `/batches`, `/team`, `/events`, `/student-feedback`, `/gallery`, `/booking`, `/contact`). It omits dynamic Academy batch pages like `/batches/advance-hair-cutting-22-oct` and `/batches/hair-cutting-masterclass`.
* **Evidence:**
  * `scripts/generate-sitemap.js` lines 16-26.
* **Files Affected:** [`scripts/generate-sitemap.js`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/scripts/generate-sitemap.js)
* **Recommended Solution:**
  * Update `generate-sitemap.js` to read `server/data/batches.json` and append all active batch URLs to the sitemap with priority `0.8`.
* **Estimated Effort:** 15 minutes
* **Verification Procedure:** Run `node scripts/generate-sitemap.js` and verify that batch slugs appear in `public/sitemap.xml`.

---

### `ISSUE-MED-04`: Team, Events, and Student Feedback Modules Lack CMS CRUD
* **Module:** Admin CMS Completeness
* **Severity:** **MEDIUM**
* **Description:** While Salon Services, Academy Batches, and Gallery Media are fully CMS-driven with complete CRUD interfaces, the Team (`OurTeamPage.tsx`), Events (`EventsPage.tsx`), and Student Feedback (`StudentFeedbackPage.tsx`) modules are backed by static TypeScript files.
* **Evidence:**
  * Data resides in `src/data/teamData.ts`, `src/data/eventsData.ts`, `src/data/studentFeedbackData.ts`.
  * No admin dashboard tabs exist for these three sections in `AdminServicesPage` navigation.
* **Files Affected:** `src/data/teamData.ts`, `src/data/eventsData.ts`, `src/data/studentFeedbackData.ts`
* **Recommended Solution:**
  * Add CMS modules for Team, Events, and Feedback following the exact architecture established for Gallery and Batches, or document that updates to these sections require code maintenance.
* **Estimated Effort:** 4 hours
* **Verification Procedure:** Add admin routes and JSON storage for Team, Events, and Feedback.

---

### `ISSUE-MED-05`: `FALLBACK_BATCHES` Array Contains Outdated Featured Batch Flag
* **Module:** Academy Batches CMS Synchronization
* **Severity:** **MEDIUM**
* **Description:** In `src/services/batchService.ts`, the hardcoded static `FALLBACK_BATCHES` array has `featuredHomepage: true` set on Batch 2 (`hair-cutting-masterclass-oct-2026`). In the live database (`server/data/batches.json`), Batch 1 (`hair-cutting-seminar-22-oct-2026`) is the active featured batch. If network fetch fails on the homepage, the fallback renders the wrong batch.
* **Evidence:**
  * Line 76 of `src/services/batchService.ts`.
* **Files Affected:** [`src/services/batchService.ts`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/src/services/batchService.ts)
* **Recommended Solution:**
  * Synchronize `FALLBACK_BATCHES` with `server/data/batches.json` or generate a static `public/api/batches.json` on CMS write (identical to the services sync mechanism).
* **Estimated Effort:** 15 minutes
* **Verification Procedure:** Verify fallback behavior when API is offline.

---

## 4. LOW SEVERITY ISSUES (Hardening & Polish)

### `ISSUE-LOW-01`: Wildcard CORS (`Access-Control-Allow-Origin: *`) in API Middleware
* **Module:** API Security
* **Severity:** **LOW**
* **Description:** `server/apiPlugin.js` sets `Access-Control-Allow-Origin: *` on all API responses.
* **Evidence:**
  * Line 589 of `server/apiPlugin.js`.
* **Files Affected:** [`server/apiPlugin.js`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/server/apiPlugin.js)
* **Recommended Solution:**
  * In production mode, restrict CORS origin to `https://skrelaxbeauty.com` or read from `process.env.VITE_SITE_URL`.
* **Estimated Effort:** 10 minutes
* **Verification Procedure:** Check API headers in development vs production.

---

### `ISSUE-LOW-02`: Missing Security Headers in Middleware Responses
* **Module:** Production Security Hardening
* **Severity:** **LOW**
* **Description:** Standard security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`) are not sent by the Node.js middleware.
* **Evidence:**
  * Network response header inspection.
* **Files Affected:** Nginx configuration / [`server/apiPlugin.js`](file:///c:/Users/Admin1/OneDrive/Desktop/sk-relax-studio/server/apiPlugin.js)
* **Recommended Solution:**
  * Configure these security headers at the Nginx reverse-proxy level (recommended) or in the Node production server.
* **Estimated Effort:** 15 minutes
* **Verification Procedure:** Inspect HTTP response headers via `curl -I https://skrelaxbeauty.com`.
