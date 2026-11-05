import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Set anti-caching headers
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    let servicesPath = path.resolve(process.cwd(), 'server', 'data', 'services.json');
    if (!fs.existsSync(servicesPath)) {
      servicesPath = path.resolve(process.cwd(), 'public', 'api', 'services.json');
    }

    if (!fs.existsSync(servicesPath)) {
      return res.status(200).json({ success: true, data: [] });
    }

    const raw = fs.readFileSync(servicesPath, 'utf8');
    const parsed = JSON.parse(raw);
    const services = Array.isArray(parsed) ? parsed : (parsed.data || []);

    const url = new URL(req.url, 'http://localhost');
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');

    // Return only published services
    let result = services.filter(s => s.status === 'published');

    if (category && category !== 'all') {
      result = result.filter(s => s.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        (s.title && s.title.toLowerCase().includes(q)) ||
        (s.shortDescription && s.shortDescription.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    return res.status(200).json({ success: true, count: result.length, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
