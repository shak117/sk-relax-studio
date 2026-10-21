import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servicesDataPath = path.resolve(__dirname, '..', 'src', 'data', 'servicesData.ts');
const targetFile = path.resolve(__dirname, '..', 'server', 'data', 'services.json');

let content = fs.readFileSync(servicesDataPath, 'utf8');
content = content.replace(/import\s+[^;]+;/g, '');
content = content.replace(/as const;/g, ';');
content = content.replace(/export const/g, 'const');
content = content.replace(/: ServiceItem\[\]/g, '');
content = content.replace(/: readonly/g, '');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(content + '\nthis.SERVICES = SERVICES;\nthis.SERVICE_CATEGORIES = SERVICE_CATEGORIES;', sandbox);

const archivedIds = ['bb-glow-cc-glow', 'medi-facial', 'collagen-thread-treatment'];

const services = sandbox.SERVICES.map((s, idx) => {
  const isArchived = archivedIds.includes(s.id);
  let image = s.image;
  if (s.id === 'aqua-treatment' && image && image.includes('treatment-client-1')) {
    image = '/images/services/hair-styling-curls.jpg';
  }

  return {
    id: s.id,
    slug: s.id,
    title: s.title,
    category: s.category,
    categoryLabel: s.categoryLabel || '',
    shortDescription: s.shortDescription || '',
    description: s.description || '',
    image: image || '',
    thumbnail: s.thumbnail || image || '',
    imagePosition: s.imagePosition || '',
    videoUrl: s.videoUrl || '',
    videoPoster: s.videoPoster || '',
    pricingMode: (s.isSignature || s.category === 'makeup-bridal') ? 'enquiry' : 'starting',
    price: s.price || '',
    promotionalPrice: s.promotionalPrice || '',
    currency: '₹',
    duration: s.duration || '',
    features: Array.isArray(s.features) ? s.features : [],
    isSignature: Boolean(s.isSignature),
    isEducational: Boolean(s.isEducational),
    badge: s.badge || '',
    status: isArchived ? 'archived' : 'published',
    displayOrder: idx + 1,
    whatsappMessage: s.category === 'makeup-bridal' 
      ? `Hello SK Relax Beauty Academy & Salon, Satara. I would like to request details and package pricing for your "${s.title}". Please share availability.`
      : `Hello SK Relax Beauty Academy & Salon, Satara. I would like to enquire about your "${s.title}" service. Please share details and available slots.`,
    whatsappNumber: '918459890270',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
});

if (!fs.existsSync(path.dirname(targetFile))) {
  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
}

fs.writeFileSync(targetFile, JSON.stringify(services, null, 2), 'utf8');
console.log('Successfully created server/data/services.json with', services.length, 'records.');
const publishedCount = services.filter(s => s.status === 'published').length;
const archivedCount = services.filter(s => s.status === 'archived').length;
console.log(`Published: ${publishedCount} | Archived: ${archivedCount}`);
