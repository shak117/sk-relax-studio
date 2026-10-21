/**
 * SITEMAP GENERATOR SCRIPT FOR SK RELAX BEAUTY ACADEMY & SALON
 * Reads VITE_SITE_URL (or defaults to https://skrelaxbeauty.com)
 * and generates a clean, valid XML sitemap.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = (process.env.VITE_SITE_URL || 'https://skrelaxbeauty.com').replace(/\/+$/, '');

const pages = [
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

const now = new Date().toISOString().split('T')[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.path === '/' ? '' : page.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, xml, 'utf8');
console.log(`[SEO] Sitemap successfully generated at: ${outputPath} with base URL: ${baseUrl}`);
