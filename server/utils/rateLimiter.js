import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { atomicWriteJsonSync } from './atomicWrite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCKOUTS_FILE = path.resolve(__dirname, '..', 'data', 'login_lockouts.json');
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function loadLockouts() {
  try {
    if (fs.existsSync(LOCKOUTS_FILE)) {
      const content = fs.readFileSync(LOCKOUTS_FILE, 'utf8');
      const data = JSON.parse(content);
      const now = Date.now();
      const cleaned = {};
      // Prune expired records on load
      for (const [ip, rec] of Object.entries(data)) {
        if (rec.lockedUntil && now < rec.lockedUntil) {
          cleaned[ip] = rec;
        } else if (!rec.lockedUntil && rec.lastAttempt && now - rec.lastAttempt < LOCK_DURATION_MS) {
          cleaned[ip] = rec;
        }
      }
      return cleaned;
    }
  } catch (err) {
    console.warn('[RateLimiter] Error reading lockouts file, starting fresh:', err.message);
  }
  return {};
}

function saveLockouts(lockouts) {
  try {
    atomicWriteJsonSync(LOCKOUTS_FILE, lockouts);
  } catch (err) {
    console.error('[RateLimiter] Error persisting lockouts:', err.message);
  }
}

// In-memory cache synced with persistent storage
let lockouts = loadLockouts();

export function checkRateLimit(ip) {
  if (!ip) return { allowed: true };
  const now = Date.now();
  const record = lockouts[ip];
  if (!record) return { allowed: true };

  if (record.lockedUntil && now < record.lockedUntil) {
    const remaining = Math.max(1, Math.ceil((record.lockedUntil - now) / 60000));
    return { allowed: false, remaining };
  }

  // Lock expired — clean up record
  if (record.lockedUntil && now >= record.lockedUntil) {
    delete lockouts[ip];
    saveLockouts(lockouts);
  }
  return { allowed: true };
}

export function recordFailedAttempt(ip) {
  if (!ip) return;
  const now = Date.now();
  const record = lockouts[ip] || { count: 0, lockedUntil: null, lastAttempt: now };
  record.count = (record.count || 0) + 1;
  record.lastAttempt = now;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCK_DURATION_MS;
    console.warn(`[Security] IP ${ip} locked out for 15 minutes after ${record.count} failed login attempts.`);
  }

  lockouts[ip] = record;
  saveLockouts(lockouts);
}

export function clearFailedAttempts(ip) {
  if (!ip) return;
  if (lockouts[ip]) {
    delete lockouts[ip];
    saveLockouts(lockouts);
  }
}
