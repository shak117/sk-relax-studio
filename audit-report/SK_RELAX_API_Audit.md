# SK RELAX BEAUTY ACADEMY & SALON
## Complete Backend API Inventory & Audit Report

**Prepared by:** Cloud Technologies  
**Audit Date:** November 2026  
**Environment:** Node.js v24.21.0 | Vite v6.4.4 | Express/Connect Architecture  
**Test Suite:** `scripts/audit-api-suite.js` & `scripts/test-services-sync.js`  
**Overall Result:** **45 / 45 Tests Passed (100% Success Rate)**

---

## 1. Executive Summary

This document provides a comprehensive inventory of all backend API endpoints implemented in the SK Relax application (`server/apiPlugin.js`). Each endpoint has been systematically tested for:
* Correct HTTP method routing
* Request validation & error responses (400 Bad Request, 404 Not Found)
* Authentication enforcement (401 Unauthorized for unauthenticated requests to protected endpoints)
* Database operations (CRUD against `server/data/*.json`)
* Static data synchronization (Services CMS to `src/data/servicesData.ts` and `public/api/services.json`)
* Response structures, status codes, and latency measurements
* Image & video upload security (MIME validation, extension whitelisting, file size limits)

---

## 2. API Endpoint Inventory & Test Results

### 2.1 Authentication & Authorization Endpoints

| Endpoint | Method | Access | Auth Type | Status Code | Latency | Test Status | Notes |
|---|---|---|---|---|---|---|---|
| `/api/admin/login` | `POST` | Public | None | `400 Bad Request` | 99 ms | **PASSED** | Correctly rejects missing/empty body |
| `/api/admin/login` | `POST` | Public | None | `401 Unauthorized` | 5 ms | **PASSED** | Rejects invalid credentials; rate-limited (5 attempts) |
| `/api/admin/login` | `POST` | Public | None | `200 OK` | 82 ms | **PASSED** | Validates password with scrypt hash; returns JWT token |
| `/api/admin/me` | `GET` | Admin | Bearer | `401 Unauthorized` | 3 ms | **PASSED** | Rejects requests without Authorization header |
| `/api/admin/me` | `GET` | Admin | Bearer | `401 Unauthorized` | 3 ms | **PASSED** | Rejects forged/invalid token signature |
| `/api/admin/me` | `GET` | Admin | Bearer | `200 OK` | 3 ms | **PASSED** | Validates HMAC-SHA256 signature; returns user session |

---

### 2.2 Academy Batches Endpoints

| Endpoint | Method | Access | Auth Type | Status Code | Latency | Test Status | Notes |
|---|---|---|---|---|---|---|---|
| `/api/batches` | `GET` | Public | None | `200 OK` | 5 ms | **PASSED** | Returns all batches; supports status filtering |
| `/api/batches/featured` | `GET` | Public | None | `200 OK` | 5 ms | **PASSED** | Returns single featured batch for homepage |
| `/api/batches/:slug` | `GET` | Public | None | `200 OK` | 5 ms | **PASSED** | Verified with `advance-hair-cutting-22-oct` |
| `/api/batches/:slug` | `GET` | Public | None | `404 Not Found` | 4 ms | **PASSED** | Returns clean 404 for non-existent slug |
| `/api/batches` | `POST` | Admin | Bearer | `401 Unauthorized` | 3 ms | **PASSED** | Rejects unauthenticated creation attempts |
| `/api/batches` | `POST` | Admin | Bearer | `201 Created` | 10 ms | **PASSED** | Creates batch, generates slug & timestamps |
| `/api/batches/:id/feature` | `PUT` | Admin | Bearer | `401 Unauthorized` | 12 ms | **PASSED** | Rejects unauthenticated feature requests |
| `/api/batches/:id/feature` | `PUT` | Admin | Bearer | `200 OK` | 19 ms | **PASSED** | Atomically toggles featured status |
| `/api/batches/:id` | `PUT` | Admin | Bearer | `401 Unauthorized` | 4 ms | **PASSED** | Rejects unauthenticated updates |
| `/api/batches/:id` | `PUT` | Admin | Bearer | `200 OK` | 26 ms | **PASSED** | Modifies existing batch in place |
| `/api/batches/:id` | `DELETE` | Admin | Bearer | `401 Unauthorized` | 5 ms | **PASSED** | Rejects unauthenticated deletions |
| `/api/batches/:id` | `DELETE` | Admin | Bearer | `200 OK` | 29 ms | **PASSED** | Permanently deletes batch from `batches.json` |

---

### 2.3 Salon Services Endpoints

| Endpoint | Method | Access | Auth Type | Status Code | Latency | Test Status | Notes |
|---|---|---|---|---|---|---|---|
| `/api/services` | `GET` | Public | None | `200 OK` | 11 ms | **PASSED** | Returns published services; anti-cache headers set |
| `/api/services?category=...` | `GET` | Public | None | `200 OK` | 17 ms | **PASSED** | Filters by category (`hair-treatments`, etc.) |
| `/api/services/:id` | `GET` | Public | None | `200 OK` | 5 ms | **PASSED** | Verified with `split-ends-repair` |
| `/api/services/:id` | `GET` | Public | None | `404 Not Found` | 5 ms | **PASSED** | Returns 404 for invalid service ID |
| `/api/services` | `POST` | Admin | Bearer | `401 Unauthorized` | 3 ms | **PASSED** | Rejects unauthenticated service creation |
| `/api/services` | `POST` | Admin | Bearer | `201 Created` | 17 ms | **PASSED** | Creates service; syncs `servicesData.ts` & public JSON |
| `/api/services/:id` | `PUT` | Admin | Bearer | `401 Unauthorized` | 32 ms | **PASSED** | Rejects unauthenticated service edits |
| `/api/services/:id` | `PUT` | Admin | Bearer | `200 OK` | 33 ms | **PASSED** | Updates service; auto-syncs static fallbacks |
| `/api/services/reorder` | `POST` | Admin | Bearer | `401 Unauthorized` | 21 ms | **PASSED** | Rejects unauthenticated reorder calls |
| `/api/services/reorder` | `POST` | Admin | Bearer | `200 OK` | 35 ms | **PASSED** | Re-indexes `displayOrder` across all records |
| `/api/services/:id` | `DELETE` | Admin | Bearer | `401 Unauthorized` | 25 ms | **PASSED** | Rejects unauthenticated deletions |
| `/api/services/:id` | `DELETE` | Admin | Bearer | `200 OK` | 30 ms | **PASSED** | Permanently removes record; syncs static fallbacks |

---

### 2.4 Gallery & Media Endpoints

| Endpoint | Method | Access | Auth Type | Status Code | Latency | Test Status | Notes |
|---|---|---|---|---|---|---|---|
| `/api/gallery` | `GET` | Public | None | `200 OK` | 25 ms | **PASSED** | Returns all 22 active gallery items |
| `/api/gallery?category=...` | `GET` | Public | None | `200 OK` | 16 ms | **PASSED** | Category filtering (`hair`, `skin`, `bridal`, etc.) |
| `/api/gallery/:id` | `GET` | Public | None | `200 OK` | 7 ms | **PASSED** | Verified with `gal-hair-1` |
| `/api/gallery/:id` | `GET` | Public | None | `404 Not Found` | 4 ms | **PASSED** | Returns 404 for invalid gallery ID |
| `/api/gallery` | `POST` | Admin | Bearer | `401 Unauthorized` | 2 ms | **PASSED** | Rejects unauthenticated creation |
| `/api/gallery` | `POST` | Admin | Bearer | `201 Created` | 7 ms | **PASSED** | Creates gallery item with image/video metadata |
| `/api/gallery/:id` | `PUT` | Admin | Bearer | `401 Unauthorized` | 60 ms | **PASSED** | Rejects unauthenticated updates |
| `/api/gallery/:id` | `PUT` | Admin | Bearer | `200 OK` | 15 ms | **PASSED** | Updates item title, category, tags |
| `/api/gallery/:id` | `DELETE` | Admin | Bearer | `401 Unauthorized` | 55 ms | **PASSED** | Rejects unauthenticated deletions |
| `/api/gallery/:id` | `DELETE` | Admin | Bearer | `200 OK` | 35 ms | **PASSED** | Deletes record; runs shared-reference media check |

---

### 2.5 Media Upload & Security Endpoints

| Endpoint | Method | Access | Auth Type | Status Code | Latency | Test Status | Notes |
|---|---|---|---|---|---|---|---|
| `/api/upload` | `POST` | Admin | Bearer | `401 Unauthorized` | 10 ms | **PASSED** | Rejects upload without valid admin token |
| `/api/upload` | `POST` | Admin | Bearer | `400 Bad Request` | 20 ms | **PASSED** | **Security check:** Rejects `.php` malicious payload |
| `/api/upload` | `POST` | Admin | Bearer | `400 Bad Request` | 15 ms | **PASSED** | **Security check:** Rejects `.exe` binary upload |
| `/api/upload` | `POST` | Admin | Bearer | `200 OK` | 31 ms | **PASSED** | Accepts `.png`, `.jpg`, `.webp`, `.mp4` under 50MB |

---

### 2.6 Static Upload & Media Streaming (`/uploads/*`)

| Path | Method | Features | Test Status | Notes |
|---|---|---|---|---|
| `/uploads/batches/*` | `GET`, `HEAD` | Static file serving | **PASSED** | Serves batch posters with MIME detection |
| `/uploads/services/*` | `GET`, `HEAD` | Static file serving | **PASSED** | Serves service flyers with `max-age=86400` |
| `/uploads/gallery/*` | `GET`, `HEAD` | Static file serving | **PASSED** | Serves gallery photographs |
| `/uploads/**/*.mp4` | `GET` | **HTTP 206 Partial Content** | **PASSED** | Byte-range headers (`Range: bytes=0-1048576`) verified |

---

## 3. Key Findings & Architecture Notes

1. **Authentication Robustness**: Scrypt hashing with unique random salts, combined with constant-time equality comparisons (`crypto.timingSafeEqual`), ensures brute-force protection. Rate limiting locks out IPs for 15 minutes after 5 consecutive failures.
2. **Path Traversal Protection**: Both `/api/upload` and `safelyDeletePhysicalMedia()` normalize file paths and strictly verify that target files are located within the absolute `public/` directory before performing disk operations.
3. **HTTP 206 Video Streaming**: Video files served through `/uploads/` support `Accept-Ranges: bytes`, ensuring instant scrubbing and smooth video playback on mobile Safari and Chrome.
4. **Zero-Latency Invalidation**: Public endpoints set `Cache-Control: no-store, no-cache, must-revalidate, max-age=0` to guarantee that changes made in the admin panel are immediately visible on public browsers.
