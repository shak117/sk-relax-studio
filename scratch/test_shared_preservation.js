import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env
const envPath = path.resolve(__dirname, '..', '.env');
let jwtSecret = 'sk-relax-studio-secret-key-2026';
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('ADMIN_SECRET=')) {
      jwtSecret = trimmed.split('=')[1].trim();
    }
  }
}

function createTestToken() {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      username: 'admin',
      exp: Math.floor(Date.now() / 1000) + 3600
    })
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', jwtSecret)
    .update(`${header}.${payload}`)
    .digest('base64url');
  return `${header}.${payload}.${signature}`;
}

async function testSharedPreservation() {
  console.log('--- Testing Shared Media Safety Preservation ---');
  const token = createTestToken();
  const baseUrl = 'http://localhost:3000';

  // 1. Pick a file that is known to be shared with services.json or batches.json
  // For example, /images/machines/hydra-facial-machine.jpg or /images/academy/hair-cutting-masterclass-poster.jpg
  // Let's create a shared upload file:
  const uploadsDir = path.resolve(__dirname, '..', 'public', 'uploads', 'gallery');
  const sharedFileName = `shared-test-${Date.now()}.jpg`;
  const sharedFilePath = path.join(uploadsDir, sharedFileName);
  fs.writeFileSync(sharedFilePath, 'SHARED_FILE_CONTENT');
  const sharedUrl = `/uploads/gallery/${sharedFileName}`;

  // Temporarily add a reference to services.json
  const servicesJsonPath = path.resolve(__dirname, '..', 'server', 'data', 'services.json');
  const originalServices = JSON.parse(fs.readFileSync(servicesJsonPath, 'utf8'));
  const testService = {
    id: `service-test-shared-${Date.now()}`,
    slug: 'shared-test-slug',
    title: 'Shared Test Service',
    category: 'other',
    image: sharedUrl,
    status: 'draft'
  };
  fs.writeFileSync(servicesJsonPath, JSON.stringify([...originalServices, testService], null, 2));

  try {
    // 2. Create a gallery item referencing the same shared file
    const postRes = await fetch(`${baseUrl}/api/gallery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Shared Test Gallery Item',
        category: 'skin',
        image: sharedUrl,
        alt: 'Shared test alt',
        description: 'Testing shared file preservation'
      })
    });
    const postJson = await postRes.json();
    const testGalleryId = postJson.data?.id;
    console.log('Created test gallery item with shared media:', testGalleryId);

    // 3. Delete the gallery item
    const delRes = await fetch(`${baseUrl}/api/gallery/${testGalleryId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const delJson = await delRes.json();
    console.log('DELETE response preservedFiles:', delJson.preservedFiles);

    // 4. Verify physical file is STILL ON DISK!
    const stillExists = fs.existsSync(sharedFilePath);
    console.log('Physical file preserved on disk (expected true):', stillExists);
    if (!stillExists) {
      throw new Error('FAIL: Shared file was deleted when it should have been preserved!');
    }
    console.log('PASS: Shared media file was safely preserved!');
  } finally {
    // Clean up temporary service and file
    fs.writeFileSync(servicesJsonPath, JSON.stringify(originalServices, null, 2));
    if (fs.existsSync(sharedFilePath)) {
      fs.unlinkSync(sharedFilePath);
    }
  }
}

testSharedPreservation().catch(err => {
  console.error(err);
  process.exit(1);
});
