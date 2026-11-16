/**
 * SK RELAX — PRODUCTION ENVIRONMENT LOADER
 * Automatically loads .env into process.env for standalone Node server.
 * Uses native Node process.loadEnvFile with zero-dependency fallback.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..', '..');

export function loadEnv(targetPath) {
  const envPath = targetPath || path.resolve(ROOT_DIR, '.env');

  // Default NODE_ENV to production if not explicitly set
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
  }

  if (typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile(envPath);
      return;
    } catch {
      // Fallback if file doesn't exist or syntax error
    }
  }

  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
          if (process.env[key] === undefined) {
            process.env[key] = val;
          }
        }
      }
    } catch (err) {
      console.warn('[loadEnv] Could not parse .env file:', err.message);
    }
  }
}

// Auto-run on import
loadEnv();
