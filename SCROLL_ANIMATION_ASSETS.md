# SK Relax Beauty Academy & Salon — Cinematic Scroll Animation Assets & Architecture

This document details the configuration, asset structure, progressive loading pipeline, and maintenance procedures for the frame-by-frame cinematic scroll animation implemented on the SK Relax Beauty Academy & Salon website.

---

## 1. Frame Folders & Source Sequences

The scroll animation originates from a continuous cinematic sequence generated in 3 parts (10-second clips at 24 fps), representing the client's hair styling and salon sanctuary transformation.

### Source Archives & Frame Breakdown

| Part | Source Archive | Extracted Folder | Frame Range | Frame Count | Resolution | Aspect Ratio | Content Depicted |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Part 1** | `Stylist_preparing_for_haircut_1080p_20261017171842_frames.zip` | `public/hero-frames/part1/` | `frame_000001.png` – `frame_000240.png` | 240 frames | 1920 × 1080 | 16:9 | Stylist in dark forest-green uniform preparing shears and comb in luxury studio |
| **Part 2** | `Stylist_trimming_brunette_hair_20261017172201_frames.zip` | `public/hero-frames/part2/` | `frame_000001.png` – `frame_000240.png` | 240 frames | 1280 × 720 | 16:9 | Close-up precision haircutting, sectioning, and layering on brunette client |
| **Part 3** | `Stylist_adjusting_client_hair_in._20261017214615_frames.zip` | `public/hero-frames/part3/` | `frame_000001.png` – `frame_000240.png` | 240 frames | 1280 × 720 | 16:9 | Final styling adjustments, hair movement, and pull-back reveal of full salon mirror sanctuary |

- **Total Combined Frames**: **720 frames**
- **Continuous Timeline Order**: `Part 1 (1–240)` → `Part 2 (241–480)` → `Part 3 (481–720)`

---

## 2. Optimized Delivery Sequence

To prevent mobile memory pressure and ensure 60 fps smooth scrubbing:
- All 720 frames have been unified to **1280 × 720 (16:9)** and compressed into high-performance WebP images (`quality: 82`).
- Total payload for all 720 frames is **~27 MB** (averaging ~38 KB per frame), reduced from over 600 MB of raw PNGs.
- **Location**: `public/hero-frames/sequence/`
- **Naming Pattern**: `frame_0001.webp` through `frame_0720.webp`
- **Fallback Poster**: `public/hero-frames/hero-scroll-poster.jpg` (HD frame 1 capture)
- **Central Manifest**: `public/hero-frames/manifest.json`

---

## 3. Four-Stage Storytelling Synchronisation

The GSAP ScrollTrigger timeline maps the normalized scroll progress `[0.0, 1.0]` across four semantic stages:

| Stage | Progress Range | Frame Range | Section Title | Description & Actions |
| :--- | :--- | :--- | :--- | :--- |
| **Stage 1: Salon Reveal** | `0.00 – 0.25` | Frames 1 – 180 | *“Your Beauty. Your Signature.”* | Opening salon reveal; "Book Your Appointment" and "Explore Our Services" CTA buttons. |
| **Stage 2: Professional Artistry** | `0.25 – 0.52` | Frames 181 – 374 | *“Precision. Technique. Artistry.”* | Close-up haircutting techniques (Butterfly layers, curtain bangs, feather tapering, face framing). |
| **Stage 3: Services & Academy** | `0.52 – 0.78` | Frames 375 – 561 | *“Where Beauty Meets Creativity.”* | Salon treatments & Beauty Academy highlight (*“Learn. Practice. Grow.”*). Direct buttons to Academy Syllabus and Service Menu. |
| **Stage 4: Final Reveal** | `0.78 – 1.00` | Frames 562 – 720 | *“Ready for Your Next Look?”* | Pull-back reveal of the completed transformation. "Book an Appointment" and direct WhatsApp chat trigger (`+91 8459890270`). |

---

## 4. Technical Architecture

- **`src/types/scrollAnimation.ts`**: TypeScript definitions for `FrameManifest`, `FramePart`, and `StoryStage`.
- **`src/hooks/useFrameSequence.ts`**: Progressive priority frame buffering hook.
  - Preloads frame 1 immediately and initial batch of 20 frames.
  - **Priority LIFO Queue**: As the visitor scrolls, immediate upcoming frames are loaded with top priority, pruning stale out-of-viewport requests.
  - Off-main-thread image decoding (`img.decode()`) eliminates render stutter.
  - Concurrency limited to 6 simultaneous requests to protect browser thread and bandwidth.
  - Closest-frame fallback: never flashes white or blanks out; retains nearest valid frame if network is throttled.
- **`src/components/hero/CinematicScrollHero.tsx`**:
  - Native GSAP `pin: true` locks the stage for `+=2800px` without relying on CSS `sticky` (preventing ancestor `overflow: hidden` bugs).
  - HTML5 2D Canvas with `object-fit: cover` scaling and retina display support (`window.devicePixelRatio`).
  - GSAP ScrollTrigger scrubbed animation (`scrub: 0.25`).
  - Eliminates 60fps React re-renders by decoupling high-frequency canvas drawing into `requestAnimationFrame`.
  - Seamlessly overlapping stage transitions (Stage 1 into Stage 2 into Stage 3 into Stage 4) with zero blank gaps.
  - Quick "Skip to Menu" action and interactive milestone jumping dots on desktop.
  - Full `prefers-reduced-motion` compliance (displays static HD poster with natural scrolling).

---

## 5. How to Test the Animation

1. **Start the local development server**:
   ```powershell
   npm run dev
   ```
   Or double-click `start-website.bat`.
2. **Open the browser**:
   Navigate to `http://localhost:3000/`.
3. **Verify Canvas Playback**:
   - Scroll slowly down from top of the page.
   - Observe Part 1 (Preparation) smoothly flowing into Part 2 (Haircutting) and into Part 3 (Final Transformation Reveal).
   - Scroll backward (upward) to verify that animation reverses smoothly without jumps.
   - Click the milestone dots on the right edge to jump directly to any storytelling stage.
   - Verify that upon reaching the end of Stage 4 (100% progress), the page transitions naturally into normal vertical scrolling through the Salon Philosophy (`#brand-intro`), Signature Cuts, Services Catalogue, Academy Masterclass, Gallery, and Footer.

---

## 6. How to Replace or Update the Frames in the Future

1. **Extract new frames** into `public/hero-frames/part1/`, `public/hero-frames/part2/`, and `public/hero-frames/part3/` (or run a conversion script).
2. **Convert to WebP** into `public/hero-frames/sequence/` with sequential naming `frame_0001.webp`, `frame_0002.webp`, etc.
3. **Update `public/hero-frames/manifest.json`** with the new `totalFrames` count and part boundaries.
4. **Build & Verify**:
   ```powershell
   npm run build
   npm run preview
   ```
