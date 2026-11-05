import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICES_JSON_PATH = path.resolve(__dirname, '..', 'server', 'data', 'services.json');
const SERVICES_TS_PATH = path.resolve(__dirname, '..', 'src', 'data', 'servicesData.ts');

export function syncServicesTsFromDb(servicesData) {
  const services = servicesData || JSON.parse(fs.readFileSync(SERVICES_JSON_PATH, 'utf8'));

  // Only published services in public SERVICES fallback
  const publishedServices = services.filter(s => s.status === 'published');

  const fileContent = `import { ServiceItem } from '../types';

export const SERVICE_CATEGORIES = [
  { 
    id: 'all', 
    label: 'All Services',
    description: 'Explore our complete salon and academy treatment catalogue in Satara' 
  },
  { 
    id: 'hair-treatments', 
    label: 'Hair Treatments & Science',
    description: 'Advanced hair smoothing, split-end care, keratin botox, and precision haircuts' 
  },
  { 
    id: 'facials-skin', 
    label: 'Facials & Skin Treatments',
    description: 'Clinical Hydra facials, Korean glass skin, BB Glow, and crystal diamond polishing' 
  },
  { 
    id: 'makeup-bridal', 
    label: 'Makeup & Bridal Artistry',
    description: 'Bespoke bridal packages, HD 3D makeup, sweat-resistant looks, and saree draping' 
  },
  { 
    id: 'permanent-makeup', 
    label: 'Permanent Makeup (PMU)',
    description: 'Microblading, powder brows, lip blush, neutralization, and precision mapping' 
  },
  { 
    id: 'equipment-machines', 
    label: 'Aesthetic Machines & Tech',
    description: '7-in-1 Hydra machine, OxyGeneo, LED phototherapy, and microdermabrasion' 
  },
] as const;

/**
 * Salon Services Catalogue — Synchronized with Database (server/data/services.json).
 * Single Source of Truth maintained by SK Relax CMS.
 */
export const SERVICES: ServiceItem[] = ${JSON.stringify(publishedServices, null, 2)};
`;

  fs.writeFileSync(SERVICES_TS_PATH, fileContent, 'utf8');
  console.log(`[SyncServices] Successfully synchronized src/data/servicesData.ts with ${publishedServices.length} published services.`);
}

// Run directly if called as a script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncServicesTsFromDb();
}
