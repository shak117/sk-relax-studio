import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read src/data/galleryData.ts
const tsPath = path.resolve(__dirname, '..', 'src', 'data', 'galleryData.ts');
const rawTs = fs.readFileSync(tsPath, 'utf8');

// Extract the GALLERY_ITEMS array literal
const startIdx = rawTs.indexOf('export const GALLERY_ITEMS: GalleryItem[] = [');
if (startIdx === -1) {
  console.error('Could not find GALLERY_ITEMS array');
  process.exit(1);
}

const arrayStr = rawTs.slice(startIdx + 'export const GALLERY_ITEMS: GalleryItem[] = '.length).trim();
// Find matching ending bracket
let depth = 0;
let endIdx = -1;
for (let i = 0; i < arrayStr.length; i++) {
  if (arrayStr[i] === '[') depth++;
  else if (arrayStr[i] === ']') {
    depth--;
    if (depth === 0) {
      endIdx = i;
      break;
    }
  }
}

if (endIdx === -1) {
  console.error('Could not match brackets');
  process.exit(1);
}

const cleanedArrayStr = arrayStr.slice(0, endIdx + 1);

// Evaluate safely using Function
const items = new Function(`return ${cleanedArrayStr}`)();

const outPath = path.resolve(__dirname, '..', 'server', 'data', 'gallery.json');
fs.writeFileSync(outPath, JSON.stringify(items, null, 2), 'utf8');
console.log(`Successfully exported ${items.length} gallery items to ${outPath}`);
