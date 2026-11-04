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
const GALLERY_FILE = path.resolve(__dirname, 'data', 'gallery.json');
const UPLOADS_DIR = path.resolve(__dirname, '..', 'public', 'uploads', 'batches');
const SERVICES_UPLOADS_DIR = path.resolve(__dirname, '..', 'public', 'uploads', 'services');
const GALLERY_UPLOADS_DIR = path.resolve(__dirname, '..', 'public', 'uploads', 'gallery');

const JWT_SECRET = process.env.ADMIN_SECRET || 'sk-relax-studio-secret-key-2026';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

/**
 * Verify a submitted password against the stored scrypt hash.
 * Reads hash/salt from process.env at call-time so they're always fresh.
 * Returns true only when credentials are configured AND the password matches.
 */
function verifyPassword(submitted) {
  if (!submitted || typeof submitted !== 'string') return false;
  // Read at call-time so Vite HMR env reloads are respected
  const storedHash = (process.env.ADMIN_PASSWORD_HASH || '').trim();
  const storedSalt = (process.env.ADMIN_PASSWORD_SALT || '').trim();
  if (!storedHash || !storedSalt) {
    console.warn('[Auth] ADMIN_PASSWORD_HASH / ADMIN_PASSWORD_SALT not set — denying login');
    return false;
  }
  try {
    const derived = crypto.scryptSync(submitted, storedSalt, 64).toString('hex');
    // Pad to equal length before timingSafeEqual to avoid length-mismatch throws
    const maxLen = Math.max(derived.length, storedHash.length);
    const a = derived.padEnd(maxLen, '0');
    const b = storedHash.padEnd(maxLen, '0');
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b)) && derived.length === storedHash.length;
  } catch (err) {
    console.error('[Auth] verifyPassword error:', err.message);
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
  if (!fs.existsSync(GALLERY_FILE)) {
    fs.writeFileSync(GALLERY_FILE, '[]', 'utf8');
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(SERVICES_UPLOADS_DIR)) {
    fs.mkdirSync(SERVICES_UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(GALLERY_UPLOADS_DIR)) {
    fs.mkdirSync(GALLERY_UPLOADS_DIR, { recursive: true });
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

function readGallery() {
  ensureStorage();
  try {
    const content = fs.readFileSync(GALLERY_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function writeGallery(gallery) {
  ensureStorage();
  fs.writeFileSync(GALLERY_FILE, JSON.stringify(gallery, null, 2), 'utf8');
}

/**
 * Check if a media file URL is referenced in other services, batches, or gallery items.
 * Prevents accidental deletion of shared or cross-linked media files.
 */
function isFileReferencedElsewhere(relativeUrl, excludeGalleryId) {
  if (!relativeUrl || typeof relativeUrl !== 'string') return false;
  const cleanUrl = relativeUrl.trim();

  // 1. Check services.json
  const services = readServices();
  for (const s of services) {
    if (s.image === cleanUrl || s.thumbnail === cleanUrl || s.videoUrl === cleanUrl) {
      return true;
    }
  }

  // 2. Check batches.json
  const batches = readBatches();
  for (const b of batches) {
    if (b.image === cleanUrl || b.thumbnail === cleanUrl || b.videoUrl === cleanUrl) {
      return true;
    }
  }

  // 3. Check remaining items in gallery.json
  const gallery = readGallery();
  for (const g of gallery) {
    if (g.id !== excludeGalleryId) {
      if (g.image === cleanUrl || g.videoUrl === cleanUrl) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Safely delete a physical media file from disk with path-traversal prevention
 * and check against shared references.
 */
function safelyDeletePhysicalMedia(relativeUrl, excludeGalleryId) {
  if (!relativeUrl || typeof relativeUrl !== 'string') {
    return { deleted: false, reason: 'No URL provided' };
  }

  const cleanUrl = relativeUrl.trim();
  // Don't touch external URLs (http/https)
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return { deleted: false, reason: 'External URL' };
  }

  // Check if media file is shared elsewhere
  if (isFileReferencedElsewhere(cleanUrl, excludeGalleryId)) {
    return {
      deleted: false,
      reason: 'Preserved because file is referenced in services, batches, or other gallery items'
    };
  }

  // Security checks against path traversal: must stay within public root
  const publicRoot = path.resolve(__dirname, '..', 'public');
  const normalizedPath = path.normalize(cleanUrl.replace(/^\/+/, ''));
  const absoluteTarget = path.resolve(publicRoot, normalizedPath);

  if (!absoluteTarget.startsWith(publicRoot)) {
    return { deleted: false, reason: 'Security check failed: Path traversal disallowed' };
  }

  if (!fs.existsSync(absoluteTarget)) {
    return { deleted: false, reason: 'File not found on disk (already removed or virtual path)' };
  }

  try {
    const stat = fs.statSync(absoluteTarget);
    if (!stat.isFile()) {
      return { deleted: false, reason: 'Target is not a regular file' };
    }
    fs.unlinkSync(absoluteTarget);
    return { deleted: true, path: cleanUrl };
  } catch (err) {
    console.error(`[Gallery Delete] Error removing ${absoluteTarget}:`, err.message);
    return { deleted: false, reason: `Unlink error: ${err.message}` };
  }
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
    // 0. Publicly serve /uploads/ directly from disk with correct MIME types and full HTTP 206 Range support for video streaming
    if (req.url && req.url.startsWith('/uploads/')) {
      try {
        const decodedUrl = decodeURIComponent(req.url.split('?')[0]);
        const filePath = path.resolve(__dirname, '..', 'public', decodedUrl.replace(/^\//, ''));
        const uploadsRoot = path.resolve(__dirname, '..', 'public', 'uploads');
        if (filePath.startsWith(uploadsRoot) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const stat = fs.statSync(filePath);
          const fileSize = stat.size;
          const ext = path.extname(filePath).toLowerCase();
          const mimes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.mp4': 'video/mp4',
            '.webm': 'video/webm',
            '.mov': 'video/quicktime',
            '.m4v': 'video/mp4'
          };
          const contentType = mimes[ext] || 'application/octet-stream';

          res.setHeader('Content-Type', contentType);
          res.setHeader('Accept-Ranges', 'bytes');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Range, Accept, Content-Type');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            return res.end();
          }

          if (req.method === 'HEAD') {
            res.setHeader('Content-Length', fileSize);
            res.statusCode = 200;
            return res.end();
          }

          const range = req.headers.range;
          if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            if (isNaN(start) || start >= fileSize || (parts[1] && end < start)) {
              res.setHeader('Content-Range', `bytes */${fileSize}`);
              res.statusCode = 416; // Range Not Satisfiable
              return res.end();
            }

            const clampedEnd = Math.min(end, fileSize - 1);
            const chunkSize = clampedEnd - start + 1;

            res.statusCode = 206; // Partial Content
            res.setHeader('Content-Range', `bytes ${start}-${clampedEnd}/${fileSize}`);
            res.setHeader('Content-Length', chunkSize);

            const stream = fs.createReadStream(filePath, { start, end: clampedEnd });
            return stream.pipe(res);
          } else {
            res.statusCode = 200;
            res.setHeader('Content-Length', fileSize);
            const stream = fs.createReadStream(filePath);
            return stream.pipe(res);
          }
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
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // CORS helper for development flexibility
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    // Helper to send JSON with consistent Content-Type and status code
    const sendJson = (statusCode, data) => {
      if (res.writableEnded || res.headersSent) return;
      res.statusCode = statusCode;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
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
      // Normalize pathname to strip trailing slashes (e.g. /api/admin/login/)
      const normalizedPath = pathname.replace(/\/+$/, '') || '/';

      // 1. POST /api/admin/login
      if (normalizedPath === '/api/admin/login' && method === 'POST') {
        const clientIp = (req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown').trim();
        const rateCheck = checkRateLimit(clientIp);
        if (!rateCheck.allowed) {
          return sendJson(429, {
            success: false,
            message: `Too many failed login attempts. Please try again in ${rateCheck.remaining} minute(s).`,
            error: `Too many failed login attempts. Please try again in ${rateCheck.remaining} minute(s).`
          });
        }

        let body;
        try {
          body = await parseJsonBody(req);
        } catch (parseErr) {
          return sendJson(400, {
            success: false,
            message: 'Invalid request payload. Expected JSON credentials.',
            error: 'Invalid request payload. Expected JSON credentials.'
          });
        }

        const { username, password } = body || {};
        if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
          return sendJson(400, {
            success: false,
            message: 'Username and password are required',
            error: 'Username and password are required'
          });
        }

        const cleanUsername = username.trim();
        const cleanPassword = password;

        if (cleanUsername === ADMIN_USERNAME && verifyPassword(cleanPassword)) {
          clearFailedAttempts(clientIp);
          const token = createToken(cleanUsername);
          return sendJson(200, {
            success: true,
            message: 'Login successful',
            token,
            user: { username: cleanUsername, role: 'admin' }
          });
        }

        recordFailedAttempt(clientIp);
        return sendJson(401, {
          success: false,
          message: 'Invalid username or password',
          error: 'Invalid username or password'
        });
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
        if (folder !== 'services' && folder !== 'batches' && folder !== 'gallery') {
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
        const targetDir = folder === 'batches'
          ? UPLOADS_DIR
          : folder === 'gallery'
          ? GALLERY_UPLOADS_DIR
          : SERVICES_UPLOADS_DIR;
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        const safeBase = path.basename(originalFilename, ext)
          .replace(/[^a-zA-Z0-9_-]/g, '-')
          .toLowerCase()
          .slice(0, 50);
        const prefix = folder === 'batches' ? 'batch' : folder === 'gallery' ? 'gallery' : 'service';
        const uniqueId = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
        const uniqueName = `${prefix}-${uniqueId}-${safeBase}${ext}`;
        const targetPath = path.join(targetDir, uniqueName);

        // Security check: ensure path is inside targetDir
        if (!path.resolve(targetPath).startsWith(targetDir)) {
          return sendJson(400, { success: false, error: 'Invalid file path' });
        }

        fs.writeFileSync(targetPath, buffer);
        const publicUrl = `/uploads/${folder}/${uniqueName}`;

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

      // 4b. GET /api/batches/featured (Public - get currently featured batch for homepage)
      if (pathname === '/api/batches/featured' && method === 'GET') {
        const batches = readBatches();

        // 1. Check for batch explicitly marked as featured on homepage (supports featuredHomepage & featured_homepage)
        // If the admin has chosen this batch as featured, honor the admin's explicit selection!
        let featured = batches.find(b => {
          const isMarked = b.featuredHomepage === true || b.featured_homepage === true;
          if (!isMarked) return false;
          // Do not show if explicitly marked as draft or archived
          if (b.status === 'draft' || b.status === 'archived') return false;
          return true;
        });

        // 2. If no featured batch is set, auto fallback to next upcoming active batch
        if (!featured) {
          const eligibleStatuses = ['upcoming', 'enrolling'];
          const eligibleUpcoming = batches
            .filter(b => {
              if (b.status === 'draft' || b.status === 'archived') return false;
              const effStatus = resolveBatchStatus(b);
              return eligibleStatuses.includes(effStatus);
            })
            .sort((a, b) => {
              const dateA = new Date(a.startDate || 0).getTime();
              const dateB = new Date(b.startDate || 0).getTime();
              return dateA - dateB;
            });

          featured = eligibleUpcoming[0] || null;
        }

        if (featured) {
          const poster = featured.image || featured.poster || featured.imageUrl || featured.coverImage || featured.thumbnail || '';
          return sendJson(200, {
            success: true,
            data: {
              ...featured,
              image: poster,
              poster: poster,
              imageUrl: poster,
              featuredHomepage: true,
              featured_homepage: true,
              status: featured.status || 'enrolling'
            }
          });
        }

        return sendJson(200, {
          success: true,
          data: null
        });
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
          featuredHomepage: Boolean(body.featuredHomepage),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (newBatch.featuredHomepage) {
          batches.forEach(b => {
            b.featuredHomepage = false;
          });
        }

        batches.unshift(newBatch);
        writeBatches(batches);

        return sendJson(201, { success: true, data: newBatch });
      }

      // 6b. PUT /api/batches/:id/feature (Feature/Unfeature on Homepage - Admin only)
      const featureBatchMatch = pathname.match(/^\/api\/batches\/([a-zA-Z0-9_-]+)\/feature$/);
      if (featureBatchMatch && method === 'PUT') {
        const user = getAuthUser();
        if (!user) {
          return sendJson(401, { success: false, error: 'Admin authentication required' });
        }

        const id = featureBatchMatch[1];
        let batches = readBatches();
        const index = batches.findIndex(b => b.id === id || b.slug === id);

        if (index === -1) {
          return sendJson(404, { success: false, error: 'Batch not found' });
        }

        const body = await parseJsonBody(req);
        const shouldFeature = body.featured !== undefined 
          ? Boolean(body.featured) 
          : (body.featuredHomepage !== undefined 
            ? Boolean(body.featuredHomepage) 
            : (body.featured_homepage !== undefined ? Boolean(body.featured_homepage) : true));

        if (shouldFeature) {
          batches = batches.map((b, i) => ({
            ...b,
            featuredHomepage: i === index,
            featured_homepage: i === index
          }));
        } else {
          batches[index].featuredHomepage = false;
          batches[index].featured_homepage = false;
        }

        batches[index].updatedAt = new Date().toISOString();
        writeBatches(batches);

        const posterUrl = batches[index].image || batches[index].poster || batches[index].imageUrl || '';
        return sendJson(200, {
          success: true,
          data: {
            ...batches[index],
            image: posterUrl,
            poster: posterUrl,
            imageUrl: posterUrl,
            status: batches[index].status || 'enrolling'
          },
          message: shouldFeature ? 'Batch is now featured on the homepage' : 'Batch unfeatured from homepage'
        });
      }

      // 7. PUT /api/batches/:id (Update - Admin only)
      if (singleBatchMatch && method === 'PUT') {
        const user = getAuthUser();
        if (!user) {
          return sendJson(401, { success: false, error: 'Admin authentication required' });
        }

        const id = singleBatchMatch[1];
        let batches = readBatches();
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

        const isFeatured = body.featuredHomepage !== undefined 
          ? Boolean(body.featuredHomepage) 
          : (body.featured_homepage !== undefined 
            ? Boolean(body.featured_homepage) 
            : Boolean(existing.featuredHomepage || existing.featured_homepage));

        if (isFeatured) {
          batches.forEach((b, i) => {
            if (i !== index) {
              b.featuredHomepage = false;
              b.featured_homepage = false;
            }
          });
        }

        const posterImg = body.image || body.poster || body.imageUrl || body.coverImage || existing.image || existing.poster || '';

        const updatedBatch = {
          ...existing,
          ...body,
          id: existing.id, // Immutable ID
          status: newStatus,
          featuredHomepage: isFeatured,
          featured_homepage: isFeatured,
          image: posterImg,
          poster: posterImg,
          imageUrl: posterImg,
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
          image: body.image ? String(body.image).trim() : '',
          thumbnail: body.thumbnail ? String(body.thumbnail).trim() : (body.image ? String(body.image).trim() : ''),
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

          const newImage = body.image !== undefined ? String(body.image).trim() : existing.image;
          let newThumbnail = body.thumbnail !== undefined ? String(body.thumbnail).trim() : existing.thumbnail;
          // If image was updated or thumbnail is empty/stale, synchronize thumbnail with image
          if (body.image !== undefined && (!newThumbnail || newThumbnail === existing.thumbnail || newThumbnail === existing.image)) {
            newThumbnail = newImage;
          }

          const updatedService = {
            ...existing,
            ...body,
            id: existing.id, // Immutable ID
            image: newImage,
            thumbnail: newThumbnail,
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

      // =======================================================================
      // GALLERY CRUD & MEDIA DELETION ENDPOINTS
      // =======================================================================

      // 13. GET /api/gallery
      if (pathname === '/api/gallery' && method === 'GET') {
        const gallery = readGallery();
        const urlObj = new URL(req.url, 'http://localhost');
        const category = urlObj.searchParams.get('category');
        const mediaType = urlObj.searchParams.get('type') || urlObj.searchParams.get('mediaType');
        const search = urlObj.searchParams.get('search');

        let result = [...gallery];

        if (category && category !== 'all') {
          result = result.filter(item => item.category === category);
        }

        if (mediaType === 'video') {
          result = result.filter(item => Boolean(item.videoUrl));
        } else if (mediaType === 'photo' || mediaType === 'image') {
          result = result.filter(item => !item.videoUrl && Boolean(item.image));
        }

        if (search) {
          const q = search.toLowerCase();
          result = result.filter(item =>
            (item.title && item.title.toLowerCase().includes(q)) ||
            (item.description && item.description.toLowerCase().includes(q)) ||
            (item.tag && item.tag.toLowerCase().includes(q)) ||
            (item.categoryLabel && item.categoryLabel.toLowerCase().includes(q))
          );
        }

        return sendJson(200, { success: true, count: result.length, data: result });
      }

      // 14. POST /api/gallery (Create - Admin only)
      if (pathname === '/api/gallery' && method === 'POST') {
        const user = getAuthUser();
        if (!user) {
          return sendJson(401, { success: false, error: 'Admin authentication required' });
        }

        const body = await parseJsonBody(req);
        if (!body.title || !body.title.trim()) {
          return sendJson(400, { success: false, error: 'Title is required' });
        }
        if (!body.image && !body.videoUrl) {
          return sendJson(400, { success: false, error: 'At least an image or video URL is required' });
        }

        const gallery = readGallery();
        const category = body.category || 'hair';
        const categoryLabels = {
          hair: 'Hair Artistry',
          skin: 'Facials & Skincare',
          bridal: 'Makeup & Bridal',
          academy: 'Academy Training',
          team: 'Our Team',
          events: 'Events & Batches'
        };

        const id = body.id || `gal-${category}-${Date.now()}`;
        const newItem = {
          id,
          title: body.title.trim(),
          category,
          categoryLabel: body.categoryLabel || categoryLabels[category] || 'Portfolio',
          image: body.image ? String(body.image).trim() : '',
          imagePosition: body.imagePosition || 'center center',
          videoUrl: body.videoUrl ? String(body.videoUrl).trim() : undefined,
          alt: body.alt ? body.alt.trim() : body.title.trim(),
          description: body.description ? body.description.trim() : '',
          tag: body.tag ? body.tag.trim() : undefined,
          createdAt: new Date().toISOString()
        };

        gallery.unshift(newItem);
        writeGallery(gallery);

        return sendJson(201, { success: true, message: 'Gallery item added successfully', data: newItem });
      }

      // 15. GET, PUT, DELETE /api/gallery/:id
      const singleGalleryMatch = pathname.match(/^\/api\/gallery\/([a-zA-Z0-9_-]+)$/);
      if (singleGalleryMatch) {
        const id = singleGalleryMatch[1];
        const gallery = readGallery();
        const index = gallery.findIndex(g => g.id === id);

        // GET single gallery item
        if (method === 'GET') {
          if (index === -1) {
            return sendJson(404, { success: false, error: 'Gallery item not found' });
          }
          return sendJson(200, { success: true, data: gallery[index] });
        }

        // PUT update gallery item (Admin only)
        if (method === 'PUT') {
          const user = getAuthUser();
          if (!user) {
            return sendJson(401, { success: false, error: 'Admin authentication required' });
          }

          if (index === -1) {
            return sendJson(404, { success: false, error: 'Gallery item not found' });
          }

          const body = await parseJsonBody(req);
          const existing = gallery[index];

          const updated = {
            ...existing,
            ...body,
            id: existing.id,
            updatedAt: new Date().toISOString()
          };

          // If videoUrl was explicitly set to empty, clean it up
          if (body.videoUrl === '' || body.videoUrl === null) {
            delete updated.videoUrl;
          }

          gallery[index] = updated;
          writeGallery(gallery);

          return sendJson(200, { success: true, message: 'Gallery item updated successfully', data: updated });
        }

        // DELETE gallery item or specific media file (Admin only)
        if (method === 'DELETE') {
          const user = getAuthUser();
          if (!user) {
            return sendJson(401, { success: false, error: 'Admin authentication required' });
          }

          if (index === -1) {
            return sendJson(404, { success: false, error: 'Gallery item not found' });
          }

          const targetItem = gallery[index];
          const urlObj = new URL(req.url, 'http://localhost');
          const target = urlObj.searchParams.get('target') || 'all'; // 'all' | 'video'

          const deletedFiles = [];
          const preservedFiles = [];

          if (target === 'video') {
            // Delete only the video attachment from the item
            if (!targetItem.videoUrl) {
              return sendJson(400, { success: false, error: 'This gallery item has no video attachment' });
            }

            const videoPath = targetItem.videoUrl;
            const resDelete = safelyDeletePhysicalMedia(videoPath, targetItem.id);
            if (resDelete.deleted) {
              deletedFiles.push(videoPath);
            } else {
              preservedFiles.push({ path: videoPath, reason: resDelete.reason });
            }

            delete targetItem.videoUrl;
            targetItem.updatedAt = new Date().toISOString();
            gallery[index] = targetItem;
            writeGallery(gallery);

            return sendJson(200, {
              success: true,
              message: 'Video attachment permanently removed and file processed',
              data: targetItem,
              deletedFiles,
              preservedFiles
            });
          } else {
            // Full gallery item deletion
            const filesToCheck = [];
            if (targetItem.image) filesToCheck.push(targetItem.image);
            if (targetItem.videoUrl) filesToCheck.push(targetItem.videoUrl);

            for (const fileUrl of filesToCheck) {
              const resDelete = safelyDeletePhysicalMedia(fileUrl, targetItem.id);
              if (resDelete.deleted) {
                deletedFiles.push(fileUrl);
              } else {
                preservedFiles.push({ path: fileUrl, reason: resDelete.reason });
              }
            }

            const removed = gallery.splice(index, 1)[0];
            writeGallery(gallery);

            return sendJson(200, {
              success: true,
              message: 'Gallery item and media deleted permanently',
              deletedId: id,
              deletedItem: removed,
              deletedFiles,
              preservedFiles
            });
          }
        }
      }

      // Route not handled
      return sendJson(404, {
        success: false,
        message: 'API endpoint not found',
        error: 'API endpoint not found'
      });
    } catch (err) {
      console.error('[API Error]:', err);
      if (!res.headersSent && !res.writableEnded) {
        return sendJson(500, {
          success: false,
          message: 'Authentication service temporarily unavailable. Please try again.',
          error: 'Authentication service temporarily unavailable. Please try again.'
        });
      }
      try {
        res.end();
      } catch {}
    }
  });
}
