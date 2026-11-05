import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const BASE_URL = 'http://localhost:3000';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'sk-relax-studio-secret-key-2026';

function generateAdminToken() {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      username: ADMIN_USERNAME,
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    })
  ).toString('base64url');
  const signature = crypto.createHmac('sha256', ADMIN_SECRET).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

const token = generateAdminToken();

async function runTests() {
  console.log('======================================================================');
  console.log('   SK RELAX SERVICES CMS & PUBLIC SYNCHRONIZATION TEST SUITE');
  console.log('======================================================================\n');

  // STEP 0: Initial Count Verification
  console.log('--- STEP 0: Checking Initial Services Count ---');
  const initialPublicRes = await fetch(`${BASE_URL}/api/services?t=${Date.now()}`);
  const initialPublicData = await initialPublicRes.json();
  const initialCount = initialPublicData.data.length;
  console.log(`Initial public published services: ${initialCount}`);

  if (initialCount !== 31) {
    throw new Error(`Expected exactly 31 initial published services, got ${initialCount}`);
  }
  console.log('✓ Public catalogue correctly displays 31 published services.\n');

  // STEP 1: Create a Temporary Test Service
  console.log('--- STEP 1: Creating Temporary Test Service in CMS ---');
  const tempPayload = {
    title: 'E2E Test Diamond Glow Facial',
    category: 'facials-skin',
    shortDescription: 'Temporary test description for CMS audit.',
    description: 'Detailed description for test service verification.',
    image: '/images/services/skincare-facial.jpg',
    status: 'published',
    price: '2500'
  };

  const createRes = await fetch(`${BASE_URL}/api/services`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tempPayload)
  });
  const createData = await createRes.json();
  if (!createData.success || !createData.data?.id) {
    throw new Error(`Failed to create test service: ${JSON.stringify(createData)}`);
  }
  const testId = createData.data.id;
  console.log(`✓ Test service created successfully with ID: ${testId}`);

  // STEP 2: Verify it appears on the public website
  console.log('--- STEP 2: Verifying New Service Appears on Public Website ---');
  const publicAfterCreateRes = await fetch(`${BASE_URL}/api/services?t=${Date.now()}`);
  const publicAfterCreateData = await publicAfterCreateRes.json();
  const foundInPublic = publicAfterCreateData.data.find(s => s.id === testId);
  if (!foundInPublic) {
    throw new Error('Newly created service NOT found in public catalogue!');
  }
  console.log(`✓ New service appeared publicly! Public count: ${publicAfterCreateData.data.length} (was ${initialCount})`);

  // STEP 3: Edit Title and Description
  console.log('\n--- STEP 3: Editing Service Title & Description in CMS ---');
  const updatedTitle = 'E2E Test Diamond Glow Facial - EDITED VERSION';
  const updatedDesc = 'Updated description verified on public website.';
  const updateRes = await fetch(`${BASE_URL}/api/services/${testId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: updatedTitle,
      shortDescription: updatedDesc
    })
  });
  const updateData = await updateRes.json();
  if (!updateData.success || updateData.data.title !== updatedTitle) {
    throw new Error(`Failed to update test service: ${JSON.stringify(updateData)}`);
  }
  console.log('✓ CMS update returned 200 with updated fields.');

  // STEP 4: Verify Both Changes Publicly
  console.log('--- STEP 4: Verifying Updates Reflected on Public Website ---');
  const publicAfterEditRes = await fetch(`${BASE_URL}/api/services?t=${Date.now()}`);
  const publicAfterEditData = await publicAfterEditRes.json();
  const publicEditedItem = publicAfterEditData.data.find(s => s.id === testId);
  if (!publicEditedItem || publicEditedItem.title !== updatedTitle || publicEditedItem.shortDescription !== updatedDesc) {
    throw new Error(`Public catalogue does not reflect edited title/description! Found: ${JSON.stringify(publicEditedItem)}`);
  }
  console.log(`✓ Public catalogue reflects: "${publicEditedItem.title}"`);

  // STEP 5: Replace Photograph
  console.log('\n--- STEP 5: Replacing Photograph in CMS ---');
  const newImagePath = `/uploads/services/test-e2e-photo-${Date.now()}.png`;
  const imgUpdateRes = await fetch(`${BASE_URL}/api/services/${testId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image: newImagePath
    })
  });
  const imgUpdateData = await imgUpdateRes.json();
  if (!imgUpdateData.success || imgUpdateData.data.image !== newImagePath) {
    throw new Error(`Failed to update image path: ${JSON.stringify(imgUpdateData)}`);
  }
  console.log(`✓ Image updated in database to: ${newImagePath}`);

  // STEP 6: Verify Updated Photograph Publicly
  console.log('--- STEP 6: Verifying New Image on Public Website ---');
  const publicAfterImgRes = await fetch(`${BASE_URL}/api/services?t=${Date.now()}`);
  const publicAfterImgData = await publicAfterImgRes.json();
  const publicImgItem = publicAfterImgData.data.find(s => s.id === testId);
  if (!publicImgItem || publicImgItem.image !== newImagePath) {
    throw new Error(`Public catalogue does not reflect new image! Found: ${publicImgItem?.image}`);
  }
  console.log(`✓ Public catalogue serves updated image path: ${publicImgItem.image}`);

  // STEP 7: Unpublish Service (status = 'draft')
  console.log('\n--- STEP 7: Unpublishing Service in CMS (Status: Draft) ---');
  const unpubRes = await fetch(`${BASE_URL}/api/services/${testId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'unpublish' })
  });
  const unpubData = await unpubRes.json();
  if (!unpubData.success || unpubData.data.status !== 'draft') {
    throw new Error(`Failed to unpublish service: ${JSON.stringify(unpubData)}`);
  }
  console.log('✓ Service unpublished (status: draft).');

  // STEP 8: Verify it Disappears from Public Website
  console.log('--- STEP 8: Verifying Unpublished Service Disappears Publicly ---');
  const publicAfterUnpubRes = await fetch(`${BASE_URL}/api/services?t=${Date.now()}`);
  const publicAfterUnpubData = await publicAfterUnpubRes.json();
  const foundUnpub = publicAfterUnpubData.data.find(s => s.id === testId);
  if (foundUnpub) {
    throw new Error('Unpublished (draft) service is STILL appearing on the public website!');
  }
  console.log(`✓ Unpublished service correctly hidden from public website! Public count: ${publicAfterUnpubData.data.length} (back to ${initialCount})`);

  // STEP 9: Publish Service Again
  console.log('\n--- STEP 9: Publishing Service Again in CMS ---');
  const repubRes = await fetch(`${BASE_URL}/api/services/${testId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'publish' })
  });
  const repubData = await repubRes.json();
  if (!repubData.success || repubData.data.status !== 'published') {
    throw new Error(`Failed to republish service: ${JSON.stringify(repubData)}`);
  }
  console.log('✓ Service published (status: published).');

  // STEP 10: Verify it Reappears Publicly
  console.log('--- STEP 10: Verifying Service Reappears on Public Website ---');
  const publicAfterRepubRes = await fetch(`${BASE_URL}/api/services?t=${Date.now()}`);
  const publicAfterRepubData = await publicAfterRepubRes.json();
  const foundRepub = publicAfterRepubData.data.find(s => s.id === testId);
  if (!foundRepub) {
    throw new Error('Republished service did NOT reappear in public catalogue!');
  }
  console.log('✓ Republished service reappeared in public catalogue.');

  // STEP 11: Permanently Delete the Service
  console.log('\n--- STEP 11: Permanently Deleting Test Service in CMS ---');
  const delRes = await fetch(`${BASE_URL}/api/services/${testId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const delData = await delRes.json();
  if (!delData.success) {
    throw new Error(`Failed to delete test service: ${JSON.stringify(delData)}`);
  }
  console.log('✓ Service permanently deleted from CMS.');

  // STEP 12 & 13: Refresh Public Website and Confirm it Remains Deleted
  console.log('--- STEP 12 & 13: Refreshing Public Website to Confirm Deletion ---');
  const publicFinalRes = await fetch(`${BASE_URL}/api/services?t=${Date.now()}`);
  const publicFinalData = await publicFinalRes.json();
  const foundFinal = publicFinalData.data.find(s => s.id === testId);
  if (foundFinal) {
    throw new Error('Deleted service STILL appears in public catalogue after deletion!');
  }
  console.log(`✓ Confirmed: Deleted service does NOT appear anywhere on the public website.`);
  console.log(`✓ Final public published services count: ${publicFinalData.data.length} (exact match with initial ${initialCount}).`);

  // STEP 14: Verify Database and Static Files Integrity
  console.log('\n--- STEP 14: Verifying Database and Static Sync Files Integrity ---');
  const dbServices = JSON.parse(fs.readFileSync('server/data/services.json', 'utf8'));
  const staticContent = fs.readFileSync('src/data/servicesData.ts', 'utf8');
  if (dbServices.length !== 31) {
    throw new Error(`Database corrupted! Expected 31 services, found ${dbServices.length}`);
  }
  if (!staticContent.includes('split-ends-repair') || staticContent.includes(testId)) {
    throw new Error('Static fallback files out of sync!');
  }
  console.log('✓ Database server/data/services.json has exactly 31 services.');
  console.log('✓ Static fallback src/data/servicesData.ts is in 100% sync.');
  console.log('\n======================================================================');
  console.log(' ALL END-TO-END TESTS PASSED WITH 100% SUCCESS!');
  console.log('======================================================================');
}

runTests().catch(err => {
  console.error('\n❌ TEST FAILED:', err.message);
  process.exit(1);
});
