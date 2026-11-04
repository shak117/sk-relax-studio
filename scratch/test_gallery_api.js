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

async function runTests() {
  console.log('--- Starting Gallery API & Storage Deletion Tests ---');
  const token = createTestToken();
  const baseUrl = 'http://localhost:3000';

  // 1. Test GET /api/gallery
  console.log('1. Testing GET /api/gallery...');
  const getRes = await fetch(`${baseUrl}/api/gallery`);
  const getJson = await getRes.json();
  console.log(`GET /api/gallery status: ${getRes.status}, count: ${getJson.data?.length}`);
  if (!getJson.success || !Array.isArray(getJson.data)) {
    throw new Error('GET /api/gallery failed');
  }

  // 2. Create physical test files in public/uploads/gallery
  const testUploadsDir = path.resolve(__dirname, '..', 'public', 'uploads', 'gallery');
  if (!fs.existsSync(testUploadsDir)) {
    fs.mkdirSync(testUploadsDir, { recursive: true });
  }

  const testImageName = `gallery-test-del-${Date.now()}.jpg`;
  const testImagePath = path.join(testUploadsDir, testImageName);
  fs.writeFileSync(testImagePath, 'FAKE_IMAGE_DATA_FOR_DELETION_TEST');

  const testVideoName = `gallery-test-del-${Date.now()}.mp4`;
  const testVideoPath = path.join(testUploadsDir, testVideoName);
  fs.writeFileSync(testVideoPath, 'FAKE_VIDEO_DATA_FOR_DELETION_TEST');

  const testImageUrl = `/uploads/gallery/${testImageName}`;
  const testVideoUrl = `/uploads/gallery/${testVideoName}`;

  console.log('Created temporary test media files:', { testImageUrl, testVideoUrl });
  if (!fs.existsSync(testImagePath) || !fs.existsSync(testVideoPath)) {
    throw new Error('Failed to create test media files on disk');
  }

  // 3. Test POST /api/gallery (Create Item with both image and video)
  console.log('2. Testing POST /api/gallery...');
  const postRes = await fetch(`${baseUrl}/api/gallery`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'QA Automated Deletion Test Item',
      category: 'hair',
      categoryLabel: 'Hair Artistry',
      image: testImageUrl,
      videoUrl: testVideoUrl,
      alt: 'QA Test Alt',
      description: 'Testing photo and video deletion on server',
      tag: 'QA Test'
    })
  });
  const postJson = await postRes.json();
  console.log('POST status:', postRes.status, 'Item ID:', postJson.data?.id);
  if (!postJson.success || !postJson.data?.id) {
    throw new Error('POST /api/gallery failed: ' + JSON.stringify(postJson));
  }
  const testId = postJson.data.id;

  // 4. Test DELETE /api/gallery/:id?target=video (Delete video only)
  console.log('3. Testing DELETE video demonstration only...');
  const delVideoRes = await fetch(`${baseUrl}/api/gallery/${testId}?target=video`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const delVideoJson = await delVideoRes.json();
  console.log('DELETE video status:', delVideoRes.status, delVideoJson.message);
  if (!delVideoJson.success) {
    throw new Error('DELETE video failed: ' + JSON.stringify(delVideoJson));
  }

  // Verify video file is deleted from disk
  const videoExistsAfterDel = fs.existsSync(testVideoPath);
  console.log('Physical video file exists on disk after delete:', videoExistsAfterDel);
  if (videoExistsAfterDel) {
    throw new Error('Expected physical video file to be unlinked from disk');
  }

  // Verify image still exists on disk
  const imageExistsAfterVideoDel = fs.existsSync(testImagePath);
  console.log('Physical image file still exists on disk:', imageExistsAfterVideoDel);
  if (!imageExistsAfterVideoDel) {
    throw new Error('Image should still exist after only deleting video');
  }

  // 5. Test DELETE /api/gallery/:id (Full item deletion)
  console.log('4. Testing DELETE entire gallery item and image...');
  const delItemRes = await fetch(`${baseUrl}/api/gallery/${testId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const delItemJson = await delItemRes.json();
  console.log('DELETE item status:', delItemRes.status, delItemJson.message);
  if (!delItemJson.success) {
    throw new Error('DELETE item failed: ' + JSON.stringify(delItemJson));
  }

  // Verify image file is deleted from disk
  const imageExistsAfterFullDel = fs.existsSync(testImagePath);
  console.log('Physical image file exists on disk after item delete:', imageExistsAfterFullDel);
  if (imageExistsAfterFullDel) {
    throw new Error('Expected physical image file to be unlinked from disk');
  }

  // Verify item is removed from GET /api/gallery
  const getVerifyRes = await fetch(`${baseUrl}/api/gallery`);
  const getVerifyJson = await getVerifyRes.json();
  const stillFound = getVerifyJson.data?.some(i => i.id === testId);
  console.log('Item still found in public GET /api/gallery:', stillFound);
  if (stillFound) {
    throw new Error('Deleted item is still present in gallery list');
  }

  console.log('--- ALL GALLERY API & MEDIA DELETION TESTS PASSED! ---');
}

runTests().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
