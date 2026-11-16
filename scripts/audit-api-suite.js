import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3000';

function getAdminToken() {
  let secret = 'sk-relax-studio-secret-key-2026';
  const envPath = path.resolve(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const l of lines) {
      if (l.startsWith('ADMIN_SECRET=')) {
        secret = l.split('=')[1].trim();
      }
    }
  }

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ username: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${sig}`;
}

async function runAudit() {
  console.log('======================================================================');
  console.log('   SK RELAX COMPLETE BACKEND API ENDPOINT AUDIT & VERIFICATION');
  console.log('======================================================================\n');

  const token = getAdminToken();
  const results = [];

  async function test(name, method, endpoint, headers = {}, body = null, expectedStatus = 200) {
    const start = Date.now();
    try {
      const options = {
        method,
        headers: { ...headers }
      };
      if (body) {
        if (typeof body === 'string') {
          options.body = body;
        } else {
          options.headers['Content-Type'] = 'application/json';
          options.body = JSON.stringify(body);
        }
      }

      const res = await fetch(`${BASE_URL}${endpoint}`, options);
      const duration = Date.now() - start;
      const status = res.status;
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      const passed = Array.isArray(expectedStatus)
        ? expectedStatus.includes(status)
        : status === expectedStatus;

      const record = {
        name,
        method,
        endpoint,
        status,
        expectedStatus,
        duration,
        passed,
        cacheControl: res.headers.get('cache-control') || 'none',
        data
      };

      results.push(record);

      const symbol = passed ? '✓' : '✗';
      console.log(`${symbol} [${method}] ${endpoint} -> ${status} (${duration}ms) [Expected: ${expectedStatus}]`);
      if (!passed) {
        console.log(`   FAIL: Response body:`, data);
      }
      return record;
    } catch (err) {
      const duration = Date.now() - start;
      const record = {
        name,
        method,
        endpoint,
        status: 'ERROR',
        expectedStatus,
        duration,
        passed: false,
        error: err.message
      };
      results.push(record);
      console.log(`✗ [${method}] ${endpoint} -> ERROR: ${err.message}`);
      return record;
    }
  }

  // --- 1. AUTHENTICATION ENDPOINTS ---
  console.log('\n--- 1. Authentication Endpoints ---');
  await test('Login with missing body', 'POST', '/api/admin/login', {}, {}, 400);
  await test('Login with invalid credentials', 'POST', '/api/admin/login', {}, { username: 'invalid_user', password: 'wrongpassword' }, 401);
  await test('Get Auth Info without token', 'GET', '/api/admin/me', {}, null, 401);
  await test('Get Auth Info with invalid token', 'GET', '/api/admin/me', { Authorization: 'Bearer bad_token_xyz' }, null, 401);
  await test('Get Auth Info with valid token', 'GET', '/api/admin/me', { Authorization: `Bearer ${token}` }, null, 200);

  // --- 2. BATCHES ENDPOINTS ---
  console.log('\n--- 2. Academy Batches Endpoints ---');
  await test('Get All Batches (Public)', 'GET', '/api/batches', {}, null, 200);
  await test('Get Featured Batch for Homepage (Public)', 'GET', '/api/batches/featured', {}, null, 200);
  await test('Get Single Batch by Valid Slug', 'GET', '/api/batches/advance-hair-cutting-22-oct', {}, null, 200);
  await test('Get Single Batch by Non-Existent Slug', 'GET', '/api/batches/non-existent-batch-slug', {}, null, 404);

  // Create Batch Auth Check
  await test('Create Batch without token (Security Check)', 'POST', '/api/batches', {}, { title: 'Test' }, 401);
  
  // Create Batch Valid
  const testBatchId = `test-audit-batch-${Date.now()}`;
  const createBatchRes = await test('Create Batch with Admin Token', 'POST', '/api/batches', { Authorization: `Bearer ${token}` }, {
    title: 'Audit Test Hair Masterclass',
    category: 'masterclass',
    eventType: 'multi-day',
    startDate: '2026-12-01',
    endDate: '2026-12-03',
    timing: '10:00 AM - 5:00 PM',
    duration: '3 Days',
    fee: 3500,
    feeDisplay: '₹3,500',
    description: 'Temporary batch for automated API audit',
    slug: testBatchId
  }, 201);

  const createdBatchId = createBatchRes.data?.data?.id || testBatchId;

  // Toggle Feature on Homepage
  await test('Feature Batch without token (Security Check)', 'PUT', `/api/batches/${createdBatchId}/feature`, {}, { featured: true }, 401);
  await test('Feature Batch with Admin Token', 'PUT', `/api/batches/${createdBatchId}/feature`, { Authorization: `Bearer ${token}` }, { featured: true }, 200);

  // Update Batch
  await test('Update Batch without token (Security Check)', 'PUT', `/api/batches/${createdBatchId}`, {}, { title: 'Updated' }, 401);
  await test('Update Batch with Admin Token', 'PUT', `/api/batches/${createdBatchId}`, { Authorization: `Bearer ${token}` }, {
    title: 'Audit Test Hair Masterclass - Updated',
    fee: 4000
  }, 200);

  // Delete Batch
  await test('Delete Batch without token (Security Check)', 'DELETE', `/api/batches/${createdBatchId}`, {}, null, 401);
  await test('Delete Batch with Admin Token', 'DELETE', `/api/batches/${createdBatchId}`, { Authorization: `Bearer ${token}` }, null, 200);

  // Re-feature the original seminar
  await test('Restore Seminar Featured Status', 'PUT', `/api/batches/hair-cutting-seminar-22-oct-2026/feature`, { Authorization: `Bearer ${token}` }, { featured: true }, 200);

  // --- 3. SERVICES ENDPOINTS ---
  console.log('\n--- 3. Salon Services Endpoints ---');
  await test('Get Published Services (Public)', 'GET', '/api/services', {}, null, 200);
  await test('Get Services with Category Filter', 'GET', '/api/services?category=hair-treatments', {}, null, 200);
  await test('Get Single Service by Valid ID', 'GET', '/api/services/split-ends-repair', {}, null, 200);
  await test('Get Single Service by Non-Existent ID', 'GET', '/api/services/non-existent-service-id', {}, null, 404);

  // Create Service Auth Check
  await test('Create Service without token (Security Check)', 'POST', '/api/services', {}, { title: 'Test' }, 401);

  // Create Service Valid
  const testServiceId = `audit-test-service-${Date.now()}`;
  const createServiceRes = await test('Create Service with Admin Token', 'POST', '/api/services', { Authorization: `Bearer ${token}` }, {
    title: 'Audit Test Keratin Therapy',
    category: 'hair-treatments',
    shortDescription: 'Audit test service short description',
    description: 'Detailed description for audit test service',
    pricingMode: 'fixed',
    price: 2500,
    status: 'published'
  }, 201);

  const createdServiceId = createServiceRes.data?.data?.id || testServiceId;

  // Update Service
  await test('Update Service without token (Security Check)', 'PUT', `/api/services/${createdServiceId}`, {}, { title: 'Updated' }, 401);
  await test('Update Service with Admin Token', 'PUT', `/api/services/${createdServiceId}`, { Authorization: `Bearer ${token}` }, {
    title: 'Audit Test Keratin Therapy - Updated Title',
    shortDescription: 'Updated short description'
  }, 200);

  // Reorder Services
  await test('Reorder Services without token (Security Check)', 'POST', '/api/services/reorder', {}, { order: [] }, 401);
  await test('Reorder Services with Admin Token', 'POST', '/api/services/reorder', { Authorization: `Bearer ${token}` }, {
    order: [createdServiceId, 'split-ends-repair']
  }, 200);

  // Delete Service
  await test('Delete Service without token (Security Check)', 'DELETE', `/api/services/${createdServiceId}`, {}, null, 401);
  await test('Delete Service with Admin Token', 'DELETE', `/api/services/${createdServiceId}`, { Authorization: `Bearer ${token}` }, null, 200);

  // --- 4. GALLERY & MEDIA ENDPOINTS ---
  console.log('\n--- 4. Gallery & Media Endpoints ---');
  await test('Get Gallery Items (Public)', 'GET', '/api/gallery', {}, null, 200);
  await test('Get Gallery with Category Filter', 'GET', '/api/gallery?category=hair', {}, null, 200);
  await test('Get Single Gallery Item by Valid ID', 'GET', '/api/gallery/gal-hair-1', {}, null, 200);
  await test('Get Single Gallery Item by Non-Existent ID', 'GET', '/api/gallery/non-existent-gallery-id', {}, null, 404);

  // Create Gallery Item Auth Check
  await test('Create Gallery Item without token (Security Check)', 'POST', '/api/gallery', {}, { title: 'Test' }, 401);

  // Create Gallery Item Valid
  const testGalleryId = `audit-test-gal-${Date.now()}`;
  const createGalRes = await test('Create Gallery Item with Admin Token', 'POST', '/api/gallery', { Authorization: `Bearer ${token}` }, {
    title: 'Audit Test Glamour Transformation',
    category: 'bridal',
    categoryLabel: 'Bridal Artistry',
    image: '/images/gallery/test-audit-image.jpg',
    description: 'Audit test transformation description'
  }, 201);

  const createdGalId = createGalRes.data?.data?.id || testGalleryId;

  // Update Gallery Item
  await test('Update Gallery Item without token (Security Check)', 'PUT', `/api/gallery/${createdGalId}`, {}, { title: 'Updated' }, 401);
  await test('Update Gallery Item with Admin Token', 'PUT', `/api/gallery/${createdGalId}`, { Authorization: `Bearer ${token}` }, {
    title: 'Audit Test Glamour Transformation - Updated',
    tag: 'Verified Audit'
  }, 200);

  // Delete Gallery Item
  await test('Delete Gallery Item without token (Security Check)', 'DELETE', `/api/gallery/${createdGalId}`, {}, null, 401);
  await test('Delete Gallery Item with Admin Token', 'DELETE', `/api/gallery/${createdGalId}`, { Authorization: `Bearer ${token}` }, null, 200);

  // --- 5. FILE UPLOAD ENDPOINTS & SECURITY ---
  console.log('\n--- 5. File Upload Endpoints & Security ---');
  await test('Upload without token (Security Check)', 'POST', '/api/upload', {}, { filename: 'test.jpg', data: 'dGVzdA==' }, 401);

  // Disallowed File Extension (.exe or .php or .sh)
  await test('Upload Malicious/Disallowed Extension (.php) (Security Check)', 'POST', '/api/upload', { Authorization: `Bearer ${token}` }, {
    filename: 'shell.php',
    folder: 'services',
    data: 'PD9waHAgc3lzdGVtKCRfR0VUWydjbWQnXSk7ID8+'
  }, 400);

  await test('Upload Malicious/Disallowed Extension (.exe) (Security Check)', 'POST', '/api/upload', { Authorization: `Bearer ${token}` }, {
    filename: 'malware.exe',
    folder: 'services',
    data: 'TVqQAAMAAAAEAAAA//8AALgAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAA4fug4AtAnNIbgBTM0hVGhpcyBwcm9ncmFtIGNhbm5vdCBiZSBydW4gaW4gRE9TIG1vZGUuDQ0KJAAAAAAAAAA='
  }, 400);

  // Valid Base64 Image Upload
  const validBase64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const uploadRes = await test('Upload Valid Image (.png) with Admin Token', 'POST', '/api/upload', { Authorization: `Bearer ${token}` }, {
    filename: 'audit-test-pixel.png',
    folder: 'services',
    data: `data:image/png;base64,${validBase64Png}`
  }, 200);

  // Clean up uploaded test file if created
  if (uploadRes.data?.url) {
    const uploadedPath = path.resolve(__dirname, '..', 'public', uploadRes.data.url.replace(/^\//, ''));
    if (fs.existsSync(uploadedPath)) {
      try {
        fs.unlinkSync(uploadedPath);
        console.log(`✓ Cleaned up temporary test upload file: ${uploadRes.data.url}`);
      } catch {}
    }
  }

  // --- 6. ROUTE NOT FOUND & ERROR HANDLING ---
  console.log('\n--- 6. Routing & Error Handling ---');
  await test('Non-Existent API Endpoint', 'GET', '/api/unknown-endpoint-xyz', {}, null, 404);

  // SUMMARY
  const total = results.length;
  const passedCount = results.filter(r => r.passed).length;
  const failedCount = total - passedCount;

  console.log('\n======================================================================');
  console.log(`   API AUDIT COMPLETE: ${passedCount} / ${total} PASSED (${failedCount} FAILED)`);
  console.log('======================================================================\n');

  // Save audit results to JSON
  const auditDir = path.resolve(__dirname, '..', 'audit-report');
  if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });
  fs.writeFileSync(path.join(auditDir, 'api-audit-results.json'), JSON.stringify(results, null, 2), 'utf8');

  return { total, passedCount, failedCount, results };
}

runAudit();
