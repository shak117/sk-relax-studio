/**
 * SITEMAP GENERATOR SCRIPT FOR SK RELAX BEAUTY ACADEMY & SALON
 * Reads VITE_SITE_URL (or defaults to https://skrelaxbeauty.com)
 * and generates a clean, valid XML sitemap including public pages
 * and dynamically published Academy Batches from the database.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = (process.env.VITE_SITE_URL || 'https://skrelaxbeauty.com').replace(/\/+$/, '');

// Static Core Pages
const corePages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/services', priority: '0.9', changefreq: 'weekly' },
  { path: '/batches', priority: '0.9', changefreq: 'weekly' },
  { path: '/team', priority: '0.8', changefreq: 'monthly' },
  { path: '/events', priority: '0.8', changefreq: 'weekly' },
  { path: '/student-feedback', priority: '0.8', changefreq: 'weekly' },
  { path: '/gallery', priority: '0.8', changefreq: 'monthly' },
  { path: '/booking', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' }
];

// Dynamic Academy Batch Pages from Database
const batchPages = [];
const batchesJsonPath = path.resolve(__dirname, '..', 'server', 'data', 'batches.json');

if (fs.existsSync(batchesJsonPath)) {
  try {
    const batches = JSON.parse(fs.readFileSync(batchesJsonPath, 'utf8'));
    if (Array.isArray(batches)) {
      batches
        .filter(b => b.status === 'enrolling' || b.status === 'upcoming' || b.status === 'completed')
        .forEach(b => {
          const slug = b.slug || b.id;
          if (slug) {
            batchPages.push({
              path: `/batches/${slug}`,
              priority: '0.8',
              changefreq: 'weekly',
              lastmod: b.updatedAt ? b.updatedAt.split('T')[0] : null
            });
          }
        });
    }
  } catch (err) {
    console.warn('[SEO] Could not load dynamic batches for sitemap:', err.message);
  }
}

const allPages = [...corePages, ...batchPages];
const today = new Date().toISOString().split('T')[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.path === '/' ? '' : page.path}</loc>
    <lastmod>${page.lastmod || today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, xml, 'utf8');
console.log(`[SEO] Sitemap successfully generated with ${allPages.length} URLs at: ${outputPath}`);
