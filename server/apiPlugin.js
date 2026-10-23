import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Load .env into process.env early (Vite only auto-exposes VITE_ vars to
// the frontend; non-VITE_ server-only vars need manual loading here)
// ---------------------------------------------------------------------------
(function loadEnvFile() {
  const envPath = path.resolve(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    // Only set if not already defined (respect existing process.env)
    if (!(key in process.env)) {
      process.env[key] = val;
    }
  }
})();

const DATA_FILE = path.resolve(__dirname, 'data', 'batches.json');
const SERVICES_FILE = path.resolve(__dirname, 'data', 'services.json');
const UPLOADS_DIR = path.resolve(__dirname, '..', 'public', 'uploads', 'batches');
const SERVICES_UPLOADS_DIR = path.resolve(__dirname, '..', 'public', 'uploads', 'services');

const JWT_SECRET = process.env.ADMIN_SECRET || 'sk-relax-studio-secret-key-2026';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
// Password verified via scrypt hash — never stored in plaintext
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || null;
const ADMIN_PASSWORD_SALT = process.env.ADMIN_PASSWORD_SALT || null;

/**
 * Verify a submitted password against the stored scrypt hash.
 * Returns true only if the hash and salt are configured and the password matches.
 */
function verifyPassword(submitted) {
  if (!ADMIN_PASSWORD_HASH || !ADMIN_PASSWORD_SALT) {
    // No hash configured — deny all logins for safety
    return false;
  }
  try {
    const derivedHash = crypto.scryptSync(submitted, ADMIN_PASSWORD_SALT, 64).toString('hex');
    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(derivedHash, 'hex'),
      Buffer.from(ADMIN_PASSWORD_HASH, 'hex')
    );
  } catch {
    return false;
  }
}

// Simple in-memory rate limiter: track failed attempts per IP
const loginAttempts = new Map(); // key: ip, value: { count, lockedUntil }
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true };
  if (record.lockedUntil && now < record.lockedUntil) {
    const remaining = Math.ceil((record.lockedUntil - now) / 60000);
    return { allowed: false, remaining };
  }
  // Lock expired — reset
  if (record.lockedUntil && now >= record.lockedUntil) {
    loginAttempts.delete(ip);
  }
  return { allowed: true };
}

function recordFailedAttempt(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lockedUntil: null };
  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCK_DURATION_MS;
  }
  loginAttempts.set(ip, record);
}

function clearFailedAttempts(ip) {
  loginAttempts.delete(ip);
}

// Helper to ensure files and directories exist
function ensureStorage() {
  if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf8');
  }
  if (!fs.existsSync(SERVICES_FILE)) {
    fs.writeFileSync(SERVICES_FILE, '[]', 'utf8');
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(SERVICES_UPLOADS_DIR)) {
    fs.mkdirSync(SERVICES_UPLOADS_DIR, { recursive: true });
  }
}

function readServices() {
  ensureStorage();
  try {
    const content = fs.readFileSync(SERVICES_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function writeServices(services) {
  ensureStorage();
  fs.writeFileSync(SERVICES_FILE, JSON.stringify(services, null, 2), 'utf8');
}

// Token creation and verification
function createToken(username) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 hours
    })
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');
  return `${header}.${payload}.${signature}`;
}

function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');
  if (expectedSignature !== signature) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 50 * 1024 * 1024) {
        // 50MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function parseMultipartBody(req, maxBytes = 55 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;\s]+))/i);
    if (!boundaryMatch) {
      return reject(new Error('Missing boundary in multipart/form-data'));
    }
    const boundary = (boundaryMatch[1] || boundaryMatch[2]).trim();
    const boundaryBuf = Buffer.from('--' + boundary);

    const chunks = [];
    let totalBytes = 0;

    req.on('data', chunk => {
      totalBytes += chunk.length;
      if (totalBytes > maxBytes) {
        reject(new Error('File exceeds maximum upload size (50MB)'));
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const buffer = Buffer.concat(chunks);
        const fields = {};
        const files = [];

        let cur = 0;
        while (cur < buffer.length) {
          const bIdx = buffer.indexOf(boundaryBuf, cur);
          if (bIdx === -1) break;

          let partStart = bIdx + boundaryBuf.length;
          if (buffer.slice(partStart, partStart + 2).toString() === '--') break;
          if (buffer.slice(partStart, partStart + 2).toString() === '\r\n') partStart += 2;
          else if (buffer[partStart] === 0x0A) partStart += 1;

          const nextBIdx = buffer.indexOf(boundaryBuf, partStart);
          if (nextBIdx === -1) break;

          let partEnd = nextBIdx;
          if (buffer.slice(partEnd - 2, partEnd).toString() === '\r\n') partEnd -= 2;
          else if (buffer[partEnd - 1] === 0x0A) partEnd -= 1;

          const partBuffer = buffer.slice(partStart, partEnd);
          let headerEnd = partBuffer.indexOf('\r\n\r\n');
          let sepLen = 4;
          if (headerEnd === -1) {
            headerEnd = partBuffer.indexOf('\n\n');
            sepLen = 2;
          }

          if (headerEnd !== -1) {
            const headerStr = partBuffer.slice(0, headerEnd).toString('utf8');
            const bodyBuffer = partBuffer.slice(headerEnd + sepLen);

            const nameMatch = headerStr.match(/\bname="([^"]+)"/i) ||
                              headerStr.match(/\bname=([^;\s\r\n]+)/i);
            const filenameMatch = headerStr.match(/\bfilename="([^"]+)"/i) ||
                                  headerStr.match(/\bfilename=([^;\s\r\n]+)/i);
            const typeMatch = headerStr.match(/content-type:\s*([^\r\n;]+)/i);

            const fieldName = nameMatch ? nameMatch[1].trim() : '';
            const filename = filenameMatch ? filenameMatch[1].trim() : null;
            const mimeType = typeMatch ? typeMatch[1].trim() : '';

            if (filename !== null) {
              files.push({ fieldName, filename, mimeType, buffer: bodyBuffer });
            } else if (fieldName) {
              fields[fieldName] = bodyBuffer.toString('utf8').trim();
            }
          }
          cur = nextBIdx;
        }
        resolve({ fields, files });
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function parseDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const clean = dateStr.trim();
  const dmy = clean.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmy) {
    return new Date(parseInt(dmy[3], 10), parseInt(dmy[2], 10) - 1, parseInt(dmy[1], 10));
  }
  const ymd = clean.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (ymd) {
    return new Date(parseInt(ymd[1], 10), parseInt(ymd[2], 10) - 1, parseInt(ymd[3], 10));
  }
  const d = new Date(clean);
  return isNaN(d.getTime()) ? null : d;
}

function isBatchPast(endDateStr) {
  const d = parseDate(endDateStr);
  if (!d) return false;
  const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  return endOfDay.getTime() < Date.now();
}

function resolveBatchStatus(batch) {
  if (batch.status === 'draft') return 'draft';
  if (batch.status === 'archived') return 'archived';
  if (batch.status === 'completed') return 'completed';
  if (isBatchPast(batch.endDate)) {
    return 'completed';
  }
  return batch.status || 'upcoming';
}

function readBatches() {
  ensureStorage();
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function writeBatches(batches) {
  ensureStorage();
  fs.writeFileSync(DATA_FILE, JSON.stringify(batches, null, 2), 'utf8');
}

export function batchApiPlugin() {
  return {
    name: 'sk-relax-batch-api',
    configureServer(server) {
      handleMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      handleMiddleware(server.middlewares);
    }
  };
}

function handleMiddleware(middlewares) {
  middlewares.use(async (req, res, next) => {
    // 0. Publicly serve /uploads/ directly from disk with correct MIME types
    if (req.url && req.url.startsWith('/uploads/')) {
      try {
        const decodedUrl = decodeURIComponent(req.url.split('?')[0]);
        const filePath = path.resolve(__dirname, '..', 'public', decodedUrl.replace(/^\//, ''));
        const uploadsRoot = path.resolve(__dirname, '..', 'public', 'uploads');
        if (filePath.startsWith(uploadsRoot) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          const mimes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.mp4': 'video/mp4',
            '.webm': 'video/webm'
          };
          res.setHeader('Content-Type', mimes[ext] || 'application/octet-stream');
          res.setHeader('Cache-Control', 'public, max-age=3600');
          res.setHeader('Access-Control-Allow-Origin', '*');
          const stream = fs.createReadStream(filePath);
          return stream.pipe(res);
        }
      } catch (err) {
        console.error('Error serving upload static file:', err);
      }
    }

    // Only handle /api routes
    if (!req.url.startsWith('/api')) {
      return next();
    }

    const url = new URL(req.url, 'http://localhost');
    const pathname = url.pathname;
    const method = req.method;

    res.setHeader('Content-Type', 'application/json');

    // CORS helper for development flexibility
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    // Helper to send JSON
    const sendJson = (statusCode, data) => {
      res.statusCode = statusCode;
      res.end(JSON.stringify(data));
    };

    // Helper to check authentication
    const getAuthUser = () => {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
      const token = authHeader.slice(7).trim();
      return verifyToken(token);
    };

    try {
      // 1. POST /api/admin/login
      if (pathname === '/api/admin/login' && method === 'POST') {
        const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
        const rateCheck = checkRateLimit(clientIp);
        if (!rateCheck.allowed) {
          return sendJson(429, {
            success: false,
            error: `Too many failed attempts. Please try again in ${rateCheck.remaining} minute(s).`
          });
        }
        const { username, password } = await parseJsonBody(req);
        if (username === ADMIN_USERNAME && verifyPassword(password)) {
          clearFailedAttempts(clientIp);
          const token = createToken(username);
          return sendJson(200, {
            success: true,
            token,
            user: { username, role: 'admin' }
          });
        }
        recordFailedAttempt(clientIp);
        return sendJson(401, { success: false, error: 'Invalid username or password' });
      }

      // 2. GET /api/admin/me
      if (pathname === '/api/admin/me' && method === 'GET') {
        const user = getAuthUser();
        if (!user) {
          return sendJson(401, { authenticated: false, error: 'Unauthorized' });
        }
        return sendJson(200, { authenticated: true, user: { username: user.username, role: 'admin' } });
      }

      // 3. POST /api/upload (Admin only - supports multipart/form-data & application/json)
      if (pathname === '/api/upload' && method === 'POST') {
        const user = getAuthUser();
        if (!user) {
          return sendJson(401, { success: false, error: 'Admin authentication required' });
        }

        let buffer;
        let originalFilename = '';
        let folder = 'services';
        const contentType = (req.headers['content-type'] || '').toLowerCase();

        if (contentType.includes('multipart/form-data')) {
          try {
            const multipart = await parseMultipartBody(req);
            folder = multipart.fields.folder || 'services';

            // Find file by common field names: file, image, media, or take the first file
            const file = multipart.files.find(f => ['file', 'image', 'media'].includes(f.fieldName)) || multipart.files[0];
            if (!file || !file.buffer || file.buffer.length === 0) {
              return sendJson(400, { success: false, error: 'No file uploaded or file is empty' });
            }

            buffer = file.buffer;
            originalFilename = file.filename;
          } catch (err) {
            return sendJson(400, { success: false, error: err.message || 'Failed to parse multipart upload' });
          }
        } else {
          // JSON base64 fallback
          try {
            const body = await parseJsonBody(req);
            const { filename, data } = body;
            folder = body.folder || 'services';

            if (!data || !filename) {
              return sendJson(400, { success: false, error: 'Missing file data or filename' });
            }

            originalFilename = filename;
            const matches = data.match(/^data:([A-Za-z0-9\-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
              buffer = Buffer.from(matches[2], 'base64');
            } else {
              buffer = Buffer.from(data, 'base64');
            }
          } catch (err) {
            return sendJson(400, { success: false, error: err.message || 'Failed to parse JSON upload' });
          }
        }

        // Validate folder to prevent arbitrary directory writes
        if (folder !== 'services' && folder !== 'batches') {
          folder = 'services';
        }

        // Validate extension
        let ext = path.extname(originalFilename).toLowerCase();
        if (!ext) {
          ext = '.jpg';
        }

        const allowedImageExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
        const allowedVideoExts = ['.mp4', '.webm'];
        const allowedExts = [...allowedImageExts, ...allowedVideoExts];

        if (!allowedExts.includes(ext)) {
          return sendJson(400, {
            success: false,
            error: `Unsupported file format (${ext}). Supported formats: JPG, JPEG, PNG, WEBP, MP4, WEBM`
          });
        }

        // File size validation: 15MB for images, 50MB for video
        const isVideo = allowedVideoExts.includes(ext);
        const maxSizeBytes = isVideo ? 50 * 1024 * 1024 : 15 * 1024 * 1024;
        if (buffer.length > maxSizeBytes) {
          const limitMb = isVideo ? 50 : 15;
          return sendJson(400, {
            success: false,
            error: `File exceeds maximum allowed size of ${limitMb}MB`
          });
        }

        ensureStorage();
        const targetDir = folder === 'batches' ? UPLOADS_DIR : SERVICES_UPLOADS_DIR;
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        const safeBase = path.basename(originalFilename, ext)
          .replace(/[^a-zA-Z0-9_-]/g, '-')
          .toLowerCase()
          .slice(0, 50);
        const prefix = folder === 'batches' ? 'batch' : 'service';
        const uniqueId = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
        const uniqueName = `${prefix}-${uniqueId}-${safeBase}${ext}`;
        const targetPath = path.join(targetDir, uniqueName);

        // Security check: ensure path is inside targetDir
        if (!path.resolve(targetPath).startsWith(targetDir)) {
          return sendJson(400, { success: false, error: 'Invalid file path' });
        }

        fs.writeFileSync(targetPath, buffer);
        const publicUrl = `/uploads/${folder === 'batches' ? 'batches' : 'services'}/${uniqueName}`;

        return sendJson(200, {
          success: true,
          url: publicUrl,
          filename: uniqueName,
          data: {
            url: publicUrl,
            filename: uniqueName
          }
        });
      }

      // 4. GET /api/batches
      if (pathname === '/api/batches' && method === 'GET') {
        const batches = readBatches();
        const user = getAuthUser();
        // If not admin, hide drafts and archived events
        if (!user) {
          const publicBatches = batches
            .filter(b => b.status !== 'draft' && b.status !== 'archived')
            .map(b => ({
              ...b,
              status: resolveBatchStatus(b)
            }));
          return sendJson(200, { success: true, data: publicBatches });
        }
        // Admin gets all batches with effective status
        const adminBatches = batches.map(b => ({
          ...b,
          effectiveStatus: resolveBatchStatus(b)
        }));
        return sendJson(200, { success: true, data: adminBatches });
      }

      // 5. GET /api/batches/:slugOrId
      const singleBatchMatch = pathname.match(/^\/api\/batches\/([a-zA-Z0-9_-]+)$/);
      if (singleBatchMatch && method === 'GET') {
        const slugOrId = singleBatchMatch[1];
        const batches = readBatches();
        const batch = batches.find(
          b =>
            b.id === slugOrId ||
            b.slug === slugOrId ||
            (slugOrId === 'advance-hair-cutting-22-oct' && b.id.includes('22-oct')) ||
            (slugOrId === 'hair-sutting-masterclass' && b.id.includes('22-oct'))
        );

        if (!batch) {
          return sendJson(404, { success: false, error: 'Batch not found' });
        }

        const user = getAuthUser();
        if ((batch.status === 'draft' || batch.status === 'archived') && !user) {
          return sendJson(404, { success: false, error: 'Batch not found' });
        }

        return sendJson(200, {
          success: true,
          data: {
            ...batch,
            status: resolveBatchStatus(batch)
          }
        });
      }

      // 6. POST /api/batches (Create - Admin only)
      if (pathname === '/api/batches' && method === 'POST') {
        const user = getAuthUser();
        if (!user) {
          return sendJson(401, { success: false, error: 'Admin authentication required' });
        }

        const body = await parseJsonBody(req);
        if (!body.title || !body.title.trim()) {
          return sendJson(400, { success: false, error: 'Title is required' });
        }

        const batches = readBatches();

        const slug = (body.slug || body.title)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        const id = body.id || `${slug}-${Date.now()}`;

        // Auto determine eventType if not provided
        let eventType = body.eventType;
        if (!eventType) {
          const durationStr = (body.duration || '').toLowerCase();
          if (durationStr.includes('1 day') || durationStr.includes('one day') || body.startDate === body.endDate) {
            eventType = 'one-day';
          } else if (durationStr.includes('week') || durationStr.includes('month') || body.category === 'diploma') {
            eventType = 'course';
          } else {
            eventType = 'multi-day';
          }
        }

        const feeNum = Number(body.fee) || 0;
        const totalSeats = body.totalSeats !== undefined && body.totalSeats !== '' ? Number(body.totalSeats) : undefined;
        const seatsRemaining = body.seatsRemaining !== undefined && body.seatsRemaining !== '' ? Number(body.seatsRemaining) : undefined;

        const newBatch = {
          id,
          slug,
          title: body.title.trim(),
          category: body.category || 'masterclass',
          eventType,
          status: body.status || 'upcoming',
          badge: body.badge || '',
          startDate: body.startDate || '',
          endDate: body.endDate || body.startDate || '',
          timing: body.timing || '',
          duration: body.duration || (eventType === 'one-day' ? 'One Day' : ''),
          fee: feeNum,
          discount: body.discount !== undefined && body.discount !== '' ? Number(body.discount) : undefined,
          feeDisplay: body.feeDisplay || (feeNum > 0 ? `₹${feeNum.toLocaleString('en-IN')}` : '₹0'),
          totalSeats: totalSeats && totalSeats > 0 ? totalSeats : undefined,
          seatsRemaining: seatsRemaining !== undefined && seatsRemaining >= 0 ? seatsRemaining : undefined,
          image: body.image || '/images/academy/hair-cutting-masterclass-poster.jpg',
          thumbnail: body.thumbnail || body.image || '',
          videoUrl: body.videoUrl || '',
          leadTrainer: body.leadTrainer || 'Salma Attar (Founder & Master Beauty Educator)',
          venue: body.venue || 'SK Relax Beauty Academy & Salon, Satara, Maharashtra',
          prerequisites: body.prerequisites || '',
          included: Array.isArray(body.included) ? body.included.filter(Boolean) : [],
          curriculum: Array.isArray(body.curriculum) ? body.curriculum.filter(Boolean) : [],
          description: body.description || '',
          whatsappPreset: body.whatsappPreset || `Hello Salma Ma'am, I would like to enquire about ${body.title} at SK Relax Academy Satara.`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        batches.unshift(newBatch);
        writeBatches(batches);

        return sendJson(201, { success: true, data: newBatch });
      }

      // 7. PUT /api/batches/:id (Update - Admin only)
      if (singleBatchMatch && method === 'PUT') {
        const user = getAuthUser();
        if (!user) {
          return sendJson(401, { success: false, error: 'Admin authentication required' });
        }

        const id = singleBatchMatch[1];
        const batches = readBatches();
        const index = batches.findIndex(b => b.id === id || b.slug === id);

        if (index === -1) {
          return sendJson(404, { success: false, error: 'Batch not found' });
        }

        const body = await parseJsonBody(req);
        const existing = batches[index];

        // Status actions
        let newStatus = body.status || existing.status;
        if (body.action === 'publish') newStatus = 'enrolling';
        if (body.action === 'unpublish') newStatus = 'draft';
        if (body.action === 'archive') newStatus = 'archived';

        const feeNum = body.fee !== undefined ? Number(body.fee) : existing.fee;
        const totalSeats = body.totalSeats !== undefined && body.totalSeats !== ''
          ? Number(body.totalSeats)
          : existing.totalSeats;
        const seatsRemaining = body.seatsRemaining !== undefined && body.seatsRemaining !== ''
          ? Number(body.seatsRemaining)
          : existing.seatsRemaining;

        const updatedBatch = {
          ...existing,
          ...body,
          id: existing.id, // Immutable ID
          status: newStatus,
          fee: feeNum,
          discount: body.discount !== undefined ? (body.discount !== '' ? Number(body.discount) : undefined) : existing.discount,
          feeDisplay: body.feeDisplay || (feeNum > 0 ? `₹${feeNum.toLocaleString('en-IN')}` : existing.feeDisplay),
          totalSeats: totalSeats && totalSeats > 0 ? totalSeats : undefined,
          seatsRemaining: seatsRemaining !== undefined && seatsRemaining >= 0 ? seatsRemaining : undefined,
          included: Array.isArray(body.included) ? body.included.filter(Boolean) : existing.included,
          curriculum: Array.isArray(body.curriculum) ? body.curriculum.filter(Boolean) : existing.curriculum,
          updatedAt: new Date().toISOString()
        };

        batches[index] = updatedBatch;
        writeBatches(batches);

        return sendJson(200, { success: true, data: updatedBatch });
      }

      // 8. DELETE /api/batches/:id (Delete or Archive - Admin only)
      if (singleBatchMatch && method === 'DELETE') {
        const user = getAuthUser();
        if (!user) {
          return sendJson(401, { success: false, error: 'Admin authentication required' });
        }

        const id = singleBatchMatch[1];
        const urlObj = new URL(req.url, 'http://localhost');
        const isArchive = urlObj.searchParams.get('archive') === 'true';
        const batches = readBatches();
        const index = batches.findIndex(b => b.id === id || b.slug === id);

        if (index === -1) {
          return sendJson(404, { success: false, error: 'Batch not found' });
        }

        if (isArchive) {
          // Soft delete: set to archived
          batches[index].status = 'archived';
          batches[index].updatedAt = new Date().toISOString();
          writeBatches(batches);
          return sendJson(200, { success: true, message: 'Batch archived successfully', data: batches[index] });
        } else {
          // Hard delete
          batches.splice(index, 1);
          writeBatches(batches);
          return sendJson(200, { success: true, message: 'Batch deleted permanently' });
        }
      }

      // =======================================================================
      // SERVICES CRUD ENDPOINTS
      // =======================================================================

      const getCategoryLabel = (cat) => {
        const labels = {
          'hair-treatments': 'Hair Treatments & Science',
          'facials-skin': 'Facials & Skin Treatments',
          'makeup-bridal': 'Makeup & Bridal Artistry',
          'permanent-makeup': 'Permanent Makeup (PMU)',
          'equipment-machines': 'Aesthetic Machines & Tech',
          'other': 'Other Salon Services'
        };
        return labels[cat] || 'Salon Service';
      };

      // 9. GET /api/services
      if (pathname === '/api/services' && method === 'GET') {
        const services = readServices();
        const user = getAuthUser();
        const urlObj = new URL(req.url, 'http://localhost');
        const category = urlObj.searchParams.get('category');
        const status = urlObj.searchParams.get('status');
        const search = urlObj.searchParams.get('search');

        let result = [...services];

        if (!user) {
          // Public: ONLY published services
          result = result.filter(s => s.status === 'published');
          if (category && category !== 'all') {
            result = result.filter(s => s.category === category);
          }
          if (search) {
            const q = search.toLowerCase();
            result = result.filter(s =>
              s.title.toLowerCase().includes(q) ||
              (s.shortDescription && s.shortDescription.toLowerCase().includes(q))
            );
          }
        } else {
          // Admin
          if (status && status !== 'all') {
            result = result.filter(s => s.status === status);
          }
          if (category && category !== 'all') {
            result = result.filter(s => s.category === category);
          }
          if (search) {
            const q = search.toLowerCase();
            result = result.filter(s =>
              s.title.toLowerCase().includes(q) ||
              (s.shortDescription && s.shortDescription.toLowerCase().includes(q)) ||
              (s.description && s.description.toLowerCase().includes(q))
            );
          }
        }

        result.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        return sendJson(200, { success: true, data: result });
      }

      // 10. POST /api/services/reorder (Admin only)
      if (pathname === '/api/services/reorder' && method === 'POST') {
        const user = getAuthUser();
        if (!user) {
          return sendJson(401, { success: false, error: 'Admin authentication required' });
        }

        const body = await parseJsonBody(req);
        const { order } = body;
        if (!Array.isArray(order)) {
          return sendJson(400, { success: false, error: 'Order must be an array of service IDs' });
        }

        const services = readServices();
        const updated = services.map(s => {
          const idx = order.indexOf(s.id);
          if (idx !== -1) {
            return { ...s, displayOrder: idx + 1, updatedAt: new Date().toISOString() };
          }
          return s;
        });

        updated.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        writeServices(updated);

        return sendJson(200, { success: true, data: updated });
      }

      // 11. POST /api/services (Create - Admin only)
      if (pathname === '/api/services' && method === 'POST') {
        const user = getAuthUser();
        if (!user) {
          return sendJson(401, { success: false, error: 'Admin authentication required' });
        }

        const body = await parseJsonBody(req);
        if (!body.title || !body.title.trim()) {
          return sendJson(400, { success: false, error: 'Service title is required' });
        }
        if (!body.category) {
          return sendJson(400, { success: false, error: 'Service category is required' });
        }

        const services = readServices();
        const slug = (body.slug || body.title)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        const id = body.id || `service-${slug}-${Date.now()}`;

        const maxOrder = services.reduce((max, s) => Math.max(max, s.displayOrder || 0), 0);

        const newService = {
          id,
          slug,
          title: body.title.trim(),
          category: body.category,
          categoryLabel: body.categoryLabel || getCategoryLabel(body.category),
          shortDescription: body.shortDescription ? body.shortDescription.trim() : '',
          description: body.description ? body.description.trim() : '',
          image: body.image || '',
          thumbnail: body.thumbnail || body.image || '',
          imagePosition: body.imagePosition || '',
          videoUrl: body.videoUrl || '',
          videoPoster: body.videoPoster || '',
          pricingMode: body.pricingMode || 'enquiry', // 'fixed' | 'starting' | 'enquiry'
          price: body.price !== undefined ? body.price : '',
          promotionalPrice: body.promotionalPrice !== undefined ? body.promotionalPrice : '',
          currency: body.currency || '₹',
          duration: body.duration || '',
          features: Array.isArray(body.features)
            ? body.features.map(f => String(f).trim()).filter(Boolean)
            : typeof body.features === 'string'
            ? body.features.split('\n').map(s => s.trim()).filter(Boolean)
            : [],
          isSignature: Boolean(body.isSignature),
          isEducational: Boolean(body.isEducational),
          badge: body.badge || '',
          status: body.status || 'published', // 'published' | 'draft' | 'archived'
          displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : maxOrder + 1,
          whatsappMessage:
            body.whatsappMessage ||
            `Hello SK Relax Beauty Academy & Salon, Satara. I would like to enquire about your "${body.title.trim()}" service. Please share details and available slots.`,
          whatsappNumber: body.whatsappNumber || '918459890270',
          confirmed: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        services.push(newService);
        writeServices(services);

        return sendJson(201, { success: true, data: newService });
      }

      // 12. GET, PUT, DELETE /api/services/:id
      const singleServiceMatch = pathname.match(/^\/api\/services\/([a-zA-Z0-9_-]+)$/);
      if (singleServiceMatch && singleServiceMatch[1] !== 'reorder') {
        const id = singleServiceMatch[1];
        const services = readServices();
        const index = services.findIndex(s => s.id === id || s.slug === id);

        // GET single service
        if (method === 'GET') {
          if (index === -1) {
            return sendJson(404, { success: false, error: 'Service not found' });
          }
          const user = getAuthUser();
          const service = services[index];
          if (!user && service.status !== 'published') {
            return sendJson(404, { success: false, error: 'Service not found' });
          }
          return sendJson(200, { success: true, data: service });
        }

        // PUT update service (Admin only)
        if (method === 'PUT') {
          const user = getAuthUser();
          if (!user) {
            return sendJson(401, { success: false, error: 'Admin authentication required' });
          }

          if (index === -1) {
            return sendJson(404, { success: false, error: 'Service not found' });
          }

          const body = await parseJsonBody(req);
          const existing = services[index];

          let newStatus = body.status || existing.status;
          if (body.action === 'publish') newStatus = 'published';
          if (body.action === 'unpublish') newStatus = 'draft';
          if (body.action === 'archive') newStatus = 'archived';
          if (body.action === 'restore') newStatus = 'published';

          let features = existing.features;
          if (Array.isArray(body.features)) {
            features = body.features.map(f => String(f).trim()).filter(Boolean);
          } else if (typeof body.features === 'string') {
            features = body.features.split('\n').map(s => s.trim()).filter(Boolean);
          }

          const updatedService = {
            ...existing,
            ...body,
            id: existing.id, // Immutable ID
            status: newStatus,
            features,
            categoryLabel: body.category ? getCategoryLabel(body.category) : existing.categoryLabel,
            displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : existing.displayOrder,
            updatedAt: new Date().toISOString()
          };

          services[index] = updatedService;
          writeServices(services);

          return sendJson(200, { success: true, data: updatedService });
        }

        // DELETE remove or archive service (Admin only)
        if (method === 'DELETE') {
          const user = getAuthUser();
          if (!user) {
            return sendJson(401, { success: false, error: 'Admin authentication required' });
          }

          if (index === -1) {
            return sendJson(404, { success: false, error: 'Service not found' });
          }

          const urlObj = new URL(req.url, 'http://localhost');
          const isArchive = urlObj.searchParams.get('archive') === 'true';

          if (isArchive) {
            services[index].status = 'archived';
            services[index].updatedAt = new Date().toISOString();
            writeServices(services);
            return sendJson(200, {
              success: true,
              message: 'Service archived successfully',
              data: services[index]
            });
          } else {
            const removed = services.splice(index, 1)[0];
            writeServices(services);
            return sendJson(200, {
              success: true,
              message: 'Service permanently deleted',
              data: removed
            });
          }
        }
      }

      // Route not handled
      return sendJson(404, { success: false, error: 'API endpoint not found' });
    } catch (err) {
      console.error('API Error:', err);
      return sendJson(500, { success: false, error: err.message || 'Internal server error' });
    }
  });
}
