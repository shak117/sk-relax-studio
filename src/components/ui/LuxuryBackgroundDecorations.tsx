import React from 'react';

/**
 * Botanical Shadow decoration that simulates natural soft-focus palm/monstera
 * leaf silhouettes cast onto warm ivory studio walls by morning/afternoon sunlight.
 */
export const LuxuryBotanicalShadow: React.FC<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  opacity?: number;
}> = ({ position = 'top-left', className = '', opacity = 0.22 }) => {
  const getPositionClass = () => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0 origin-top-left';
      case 'top-right':
        return 'top-0 right-0 origin-top-right scale-x-[-1]';
      case 'bottom-left':
        return 'bottom-0 left-0 origin-bottom-left scale-y-[-1]';
      case 'bottom-right':
        return 'bottom-0 right-0 origin-bottom-right scale-[-1]';
    }
  };

  return (
    <div
      aria-hidden="true"
      className={`absolute ${getPositionClass()} pointer-events-none select-none overflow-hidden z-0 transition-opacity duration-700 ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 520 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[280px] sm:w-[420px] lg:w-[520px] h-auto drop-shadow-sm"
      >
        <defs>
          <filter id={`botanical-blur-${position}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <linearGradient id={`leaf-grad-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5E584D" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#7A7366" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#9C9588" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <g filter={`url(#botanical-blur-${position})`} fill={`url(#leaf-grad-${position})`}>
          {/* Main stem arching from top corner */}
          <path
            d="M -20 -20 C 60 40, 140 120, 260 210 C 330 260, 420 310, 500 340 C 480 345, 390 300, 240 200 C 130 110, 50 30, -20 -20 Z"
            fillOpacity="0.6"
          />

          {/* Palm Frond Leaflets */}
          {/* Leaf 1 - top cluster */}
          <path d="M 40 10 C 90 20, 160 5, 230 -15 C 190 25, 120 50, 40 10 Z" />
          {/* Leaf 2 */}
          <path d="M 70 35 C 140 40, 220 30, 310 15 C 260 55, 170 70, 70 35 Z" />
          {/* Leaf 3 */}
          <path d="M 100 65 C 180 80, 270 75, 370 55 C 310 100, 210 115, 100 65 Z" />
          {/* Leaf 4 - sweeping center frond */}
          <path d="M 130 105 C 220 130, 320 135, 430 110 C 360 160, 250 170, 130 105 Z" />
          {/* Leaf 5 */}
          <path d="M 160 145 C 250 180, 350 190, 460 170 C 385 220, 275 225, 160 145 Z" />
          {/* Leaf 6 */}
          <path d="M 190 190 C 275 230, 370 250, 480 235 C 400 280, 295 280, 190 190 Z" />
          {/* Leaf 7 */}
          <path d="M 220 235 C 295 280, 385 305, 490 295 C 410 335, 310 330, 220 235 Z" />
          {/* Leaf 8 - lower terminal frond */}
          <path d="M 250 280 C 315 325, 395 355, 490 355 C 415 385, 325 375, 250 280 Z" />

          {/* Secondary softer shadow layer for depth */}
          <path
            d="M 10 90 C 60 140, 130 200, 210 270 C 160 250, 90 190, 10 90 Z"
            fillOpacity="0.4"
          />
          <path
            d="M 50 150 C 110 210, 190 280, 280 340 C 220 320, 140 260, 50 150 Z"
            fillOpacity="0.35"
          />
        </g>
      </svg>
    </div>
  );
};

/**
 * Elegant Champagne-Gold Curved Lines and Satin Silk Wave Ribbons
 * that frame sections gracefully without ever distracting from content.
 */
export const LuxuryCurvedLines: React.FC<{
  position?: 'top-right' | 'bottom-left' | 'bottom-right' | 'top-left';
  className?: string;
  variant?: 'ribbon' | 'waves' | 'arcs';
}> = ({ position = 'top-right', className = '', variant = 'ribbon' }) => {
  const getPositionClass = () => {
    switch (position) {
      case 'top-right':
        return 'top-0 right-0 origin-top-right';
      case 'bottom-left':
        return 'bottom-0 left-0 origin-bottom-left';
      case 'bottom-right':
        return 'bottom-0 right-0 origin-bottom-right';
      case 'top-left':
        return 'top-0 left-0 origin-top-left';
    }
  };

  const idSuffix = `${position}-${variant}`;

  return (
    <div
      aria-hidden="true"
      className={`absolute ${getPositionClass()} pointer-events-none select-none overflow-hidden z-0 ${className}`}
    >
      <svg
        viewBox="0 0 600 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[300px] sm:w-[450px] lg:w-[600px] h-auto"
      >
        <defs>
          <linearGradient id={`gold-stroke-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2C98A" stopOpacity="0.75" />
            <stop offset="35%" stopColor="#CAA454" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#EEDAB0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#B58E3C" stopOpacity="0.25" />
          </linearGradient>

          <linearGradient id={`gold-fill-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F7EED9" stopOpacity="0.45" />
            <stop offset="40%" stopColor="#EEDCBB" stopOpacity="0.25" />
            <stop offset="80%" stopColor="#F8F3E9" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#CAA454" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id={`soft-satin-${idSuffix}`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F9F4EB" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#EAD8BE" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {variant === 'ribbon' && (
          <g>
            {/* Satin body wave */}
            <path
              d="M 600 0 C 480 60, 360 140, 280 240 C 220 320, 180 390, 150 450 L 600 450 Z"
              fill={`url(#soft-satin-${idSuffix})`}
            />

            {/* Shimmer fill accent between golden curves */}
            <path
              d="M 600 20 C 470 90, 350 170, 270 270 C 210 345, 175 410, 160 450 C 190 450, 240 370, 310 290 C 390 190, 500 110, 600 50 Z"
              fill={`url(#gold-fill-${idSuffix})`}
            />

            {/* Primary elegant gold contour curve */}
            <path
              d="M 600 20 C 470 90, 350 170, 270 270 C 210 345, 175 410, 160 450"
              stroke={`url(#gold-stroke-${idSuffix})`}
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Secondary thin gold accent curve */}
            <path
              d="M 600 50 C 500 110, 390 190, 310 290 C 240 370, 190 450, 175 450"
              stroke={`url(#gold-stroke-${idSuffix})`}
              strokeWidth="0.9"
              strokeDasharray="4 2"
              strokeOpacity="0.5"
            />

            {/* Tertiary outer soft stroke */}
            <path
              d="M 600 100 C 520 160, 430 240, 360 330 C 310 400, 270 450, 260 450"
              stroke={`url(#gold-stroke-${idSuffix})`}
              strokeWidth="1.2"
              strokeOpacity="0.6"
            />

            {/* Ultra delicate light arc */}
            <path
              d="M 600 160 C 540 210, 480 275, 430 350 C 390 410, 360 450, 350 450"
              stroke={`url(#gold-stroke-${idSuffix})`}
              strokeWidth="0.75"
              strokeOpacity="0.4"
            />
          </g>
        )}

        {variant === 'waves' && (
          <g>
            {/* Organic silk swoop (ideal for bottom-left) */}
            <path
              d="M 0 450 C 120 370, 240 340, 360 380 C 440 405, 520 420, 600 410 L 600 450 L 0 450 Z"
              fill={`url(#soft-satin-${idSuffix})`}
            />
            <path
              d="M 0 410 C 130 330, 250 310, 380 350 C 470 380, 540 395, 600 390"
              stroke={`url(#gold-stroke-${idSuffix})`}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 0 380 C 140 290, 270 280, 400 320 C 490 350, 560 365, 600 360"
              stroke={`url(#gold-stroke-${idSuffix})`}
              strokeWidth="0.85"
              strokeOpacity="0.5"
            />
          </g>
        )}

        {variant === 'arcs' && (
          <g>
            <circle
              cx="550"
              cy="50"
              r="380"
              stroke={`url(#gold-stroke-${idSuffix})`}
              strokeWidth="1.2"
              strokeOpacity="0.45"
            />
            <circle
              cx="550"
              cy="50"
              r="440"
              stroke={`url(#gold-stroke-${idSuffix})`}
              strokeWidth="0.75"
              strokeOpacity="0.3"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

/**
 * Editorial Feminine Beauty & Salon Line-Art Illustration.
 * Rendered with ultra-delicate fine lines and muted champagne-rose tones
 * to sit peacefully behind typography without interfering with readability.
 */
export const LuxuryLineArt: React.FC<{
  motif?: 'beauty-profile' | 'hair-flow' | 'botanical-sprig';
  className?: string;
  opacity?: number;
}> = ({ motif = 'beauty-profile', className = '', opacity = 0.18 }) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none select-none z-0 transition-opacity duration-700 ${className}`}
      style={{ opacity }}
    >
      {motif === 'beauty-profile' && (
        <svg
          viewBox="0 0 650 750"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[320px] sm:w-[480px] lg:w-[650px] h-auto drop-shadow-sm"
        >
          <defs>
            <linearGradient id="line-art-rose-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C48B8B" />
              <stop offset="45%" stopColor="#CAA454" />
              <stop offset="85%" stopColor="#A86E6E" />
              <stop offset="100%" stopColor="#D4A77D" />
            </linearGradient>
            <linearGradient id="line-art-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FAF1E6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#F5E4D3" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Soft tint fill behind face contour for graceful silhouette */}
          <path
            d="M 330 180 C 370 120, 480 140, 540 210 C 600 280, 620 400, 570 510 C 520 620, 430 680, 350 710 C 300 730, 240 700, 220 630 C 200 560, 210 470, 225 390 C 240 310, 290 240, 330 180 Z"
            fill="url(#line-art-fill)"
          />

          <g stroke="url(#line-art-rose-gold)" strokeLinecap="round" strokeLinejoin="round">
            {/* Forehead, Eyebrow & Nose Profile */}
            <path
              d="M 285 190 C 280 230, 275 270, 260 295 C 255 305, 245 315, 235 320 C 220 330, 205 345, 195 365 C 190 375, 190 382, 195 385 C 205 390, 215 390, 220 395 C 215 402, 205 408, 198 412 C 192 416, 192 422, 198 425 C 208 430, 220 430, 230 435 C 220 445, 205 455, 202 465 C 200 475, 208 485, 225 490 C 245 495, 270 492, 290 480"
              strokeWidth="1.8"
            />

            {/* Jawline & Graceful Long Neck */}
            <path
              d="M 290 480 C 330 460, 375 420, 400 370 C 405 390, 395 440, 375 490 C 355 540, 330 600, 320 660 C 315 690, 310 720, 305 750"
              strokeWidth="1.6"
            />

            {/* Collarbone & Shoulder */}
            <path
              d="M 260 670 C 290 685, 335 695, 385 690 C 430 685, 475 665, 520 645"
              strokeWidth="1.3"
            />
            <path
              d="M 230 730 C 270 735, 320 730, 370 715"
              strokeWidth="1.1"
              strokeOpacity="0.7"
            />

            {/* Serene Closed Eye & Eyelashes */}
            <path
              d="M 235 345 C 245 352, 258 352, 268 346"
              strokeWidth="1.5"
            />
            <path d="M 242 350 L 238 356" strokeWidth="1.2" />
            <path d="M 252 352 L 252 359" strokeWidth="1.2" />
            <path d="M 262 350 L 265 356" strokeWidth="1.2" />

            {/* Delicate Eyebrow */}
            <path
              d="M 225 330 C 240 322, 260 322, 275 328"
              strokeWidth="1.5"
            />

            {/* Soft Lips Contour */}
            <path
              d="M 215 422 C 225 420, 235 423, 245 422"
              strokeWidth="1.3"
            />
            <path
              d="M 220 435 C 228 440, 238 438, 245 432"
              strokeWidth="1.2"
            />

            {/* Ear & Earring */}
            <path
              d="M 370 380 C 385 385, 395 405, 390 425 C 385 440, 370 450, 360 450"
              strokeWidth="1.3"
            />
            <circle cx="375" cy="462" r="3.5" strokeWidth="1.2" fill="#CAA454" fillOpacity="0.4" />
            <path d="M 375 466 L 375 480" strokeWidth="1.2" />
            <circle cx="375" cy="484" r="2" strokeWidth="1.0" fill="#CAA454" fillOpacity="0.4" />

            {/* Sweeping Luxurious Hair Strands and Cascading Curls */}
            {/* Strand 1 - Crown arc */}
            <path
              d="M 285 190 C 310 130, 370 90, 440 95 C 510 100, 570 145, 605 210 C 635 270, 630 350, 600 420 C 565 500, 500 570, 430 620 C 380 655, 320 675, 260 670"
              strokeWidth="1.8"
            />

            {/* Strand 2 - Voluminous middle crest */}
            <path
              d="M 320 180 C 360 115, 430 80, 500 90 C 570 100, 625 155, 645 230 C 660 300, 645 375, 610 440 C 565 520, 495 590, 415 635"
              strokeWidth="1.3"
              strokeOpacity="0.8"
            />

            {/* Strand 3 - Outer flow */}
            <path
              d="M 360 190 C 410 130, 490 105, 560 120 C 630 140, 675 200, 680 275 C 685 350, 650 425, 605 490 C 550 565, 470 625, 380 660"
              strokeWidth="1.0"
              strokeOpacity="0.6"
            />

            {/* Hair curl 1 - nape of neck */}
            <path
              d="M 400 420 C 450 445, 495 490, 510 545 C 520 580, 505 615, 475 635 C 445 655, 400 650, 375 625 C 360 605, 365 580, 385 570 C 405 560, 425 575, 420 595"
              strokeWidth="1.4"
            />

            {/* Hair curl 2 - upper wave */}
            <path
              d="M 460 260 C 510 280, 555 320, 565 375 C 570 415, 550 455, 515 470 C 485 485, 445 470, 435 440 C 425 410, 450 380, 480 385 C 500 390, 510 410, 500 425"
              strokeWidth="1.2"
              strokeOpacity="0.75"
            />

            {/* Face framing bangs / baby hairs */}
            <path
              d="M 275 220 C 265 245, 255 270, 240 285 C 230 295, 215 305, 205 305 C 195 305, 190 295, 195 285 C 205 270, 225 260, 245 255"
              strokeWidth="1.2"
            />
            <path
              d="M 295 240 C 290 270, 280 295, 265 315"
              strokeWidth="1.0"
              strokeOpacity="0.6"
            />
          </g>
        </svg>
      )}

      {motif === 'hair-flow' && (
        <svg
          viewBox="0 0 600 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[300px] sm:w-[450px] lg:w-[600px] h-auto drop-shadow-sm"
        >
          <defs>
            <linearGradient id="hair-flow-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CAA454" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#C48B8B" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#E2C98A" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <g stroke="url(#hair-flow-gold)" strokeLinecap="round">
            <path
              d="M 50 50 C 180 80, 280 20, 420 90 C 500 130, 540 220, 580 320"
              strokeWidth="1.6"
            />
            <path
              d="M 80 80 C 200 115, 310 60, 440 130 C 510 170, 550 250, 590 350"
              strokeWidth="1.1"
              strokeOpacity="0.7"
            />
            <path
              d="M 30 110 C 160 140, 260 90, 390 160 C 470 200, 510 280, 550 380"
              strokeWidth="1.3"
              strokeOpacity="0.85"
            />
            <path
              d="M 120 130 C 230 165, 330 120, 450 190 C 510 230, 540 290, 570 370"
              strokeWidth="0.85"
              strokeOpacity="0.5"
            />
          </g>
        </svg>
      )}

      {motif === 'botanical-sprig' && (
        <svg
          viewBox="0 0 400 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[200px] sm:w-[320px] lg:w-[400px] h-auto drop-shadow-sm"
        >
          <defs>
            <linearGradient id="sprig-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CAA454" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#8FB09A" stopOpacity="0.45" />
            </linearGradient>
          </defs>
          <g stroke="url(#sprig-gold)" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Main stem */}
            <path d="M 50 450 C 120 380, 180 280, 220 150 C 240 80, 250 20, 250 10" strokeWidth="1.5" />
            {/* Pairs of delicate leaves */}
            <path d="M 195 230 C 170 210, 130 210, 110 230 C 130 250, 170 250, 195 230 Z" strokeWidth="1.2" />
            <path d="M 205 210 C 230 190, 270 190, 290 210 C 270 230, 230 230, 205 210 Z" strokeWidth="1.2" />
            <path d="M 215 150 C 190 130, 150 130, 130 150 C 150 170, 190 170, 215 150 Z" strokeWidth="1.2" />
            <path d="M 225 130 C 250 110, 290 110, 310 130 C 290 150, 250 150, 225 130 Z" strokeWidth="1.2" />
            <path d="M 235 80 C 215 65, 185 65, 170 80 C 185 95, 215 95, 235 80 Z" strokeWidth="1.2" />
            <path d="M 242 65 C 262 50, 292 50, 307 65 C 292 80, 262 80, 242 65 Z" strokeWidth="1.2" />
            <path d="M 248 25 C 240 10, 255 -5, 265 10 C 260 25, 250 35, 248 25 Z" strokeWidth="1.2" />
          </g>
        </svg>
      )}
    </div>
  );
};
