#!/usr/bin/env node
/**
 * SK RELAX BEAUTY ACADEMY & SALON — PRODUCTION HTTP SERVER
 * Prepared by: Cloud Technologies
 * 
 * Standalone production server for Hostinger VPS & PM2 process manager.
 * Handles /api/* routes, /uploads/* media with HTTP 206 streaming,
 * and serves the production SPA from dist/ with SPA fallback.
 */

import './utils/loadEnv.js';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiMiddlewareHandler } from './apiPlugin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '127.0.0.1';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function serveStaticFile(req, res, filePath) {
  try {
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return false;
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Caching strategy: immutable for hashed assets, revalidate for html
    let cacheControl = 'public, max-age=86400';
    if (ext === '.html') {
      cacheControl = 'no-cache, must-revalidate';
    } else if (filePath.includes(path.sep + 'assets' + path.sep)) {
      cacheControl = 'public, max-age=31536000, immutable';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', cacheControl);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    // Video byte-range support
    const range = req.headers.range;
    if (range && (ext === '.mp4' || ext === '.webm')) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (isNaN(start) || start >= fileSize || (parts[1] && end < start)) {
        res.setHeader('Content-Range', `bytes */${fileSize}`);
        res.statusCode = 416;
        res.end();
        return true;
      }

      const clampedEnd = Math.min(end, fileSize - 1);
      const chunkSize = clampedEnd - start + 1;

      res.statusCode = 206;
      res.setHeader('Content-Range', `bytes ${start}-${clampedEnd}/${fileSize}`);
      res.setHeader('Content-Length', chunkSize);
      res.setHeader('Accept-Ranges', 'bytes');

      const stream = fs.createReadStream(filePath, { start, end: clampedEnd });
      stream.pipe(res);
      return true;
    }

    res.statusCode = 200;
    res.setHeader('Content-Length', fileSize);
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    return true;
  } catch (err) {
    console.error(`[Static Server Error] ${filePath}:`, err.message);
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // 1. Delegate /api/* and /uploads/* to the unified API middleware handler
  if (pathname.startsWith('/api') || pathname.startsWith('/uploads')) {
    return apiMiddlewareHandler(req, res, () => {
      if (!res.headersSent) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: 'Endpoint not found' }));
      }
    });
  }

  // 2. Serve static files from dist/ if built, or fallback to public/
  const safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
  const cleanRelative = safePath.replace(/^[\/\\]+/, '');
  let targetFile = path.resolve(DIST_DIR, cleanRelative);

  // If path is a directory or root, serve index.html
  if (pathname === '/' || (!path.extname(pathname) && !fs.existsSync(targetFile))) {
    const indexPath = path.resolve(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      return serveStaticFile(req, res, indexPath);
    }
  }

  // Attempt to serve static asset from dist/
  if (fs.existsSync(targetFile) && fs.statSync(targetFile).isFile()) {
    return serveStaticFile(req, res, targetFile);
  }

  // Check public/ directory for un-bundled static assets
  const publicTarget = path.resolve(PUBLIC_DIR, cleanRelative);
  if (fs.existsSync(publicTarget) && fs.statSync(publicTarget).isFile()) {
    return serveStaticFile(req, res, publicTarget);
  }

  // SPA Fallback: for client-side routing (e.g. /services, /batches, /admin/login)
  const spaIndex = path.resolve(DIST_DIR, 'index.html');
  if (fs.existsSync(spaIndex)) {
    return serveStaticFile(req, res, spaIndex);
  }

  // If dist/ has not been built yet
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(`
    <!DOCTYPE html>
    <html>
      <head><title>SK Relax Production Server</title></head>
      <body style="font-family:system-ui;text-align:center;padding:50px;background:#FAF7F2;color:#173222;">
        <h2>SK RELAX BEAUTY ACADEMY & SALON</h2>
        <p>API Server is running on port ${PORT}. Run <code>npm run build</code> to compile frontend static assets.</p>
        <p><a href="/api/health">Check API Health</a> | <a href="/api/services">Services API</a></p>
      </body>
    </html>
  `);
});

server.listen(PORT, HOST, () => {
  console.log(`======================================================================`);
  console.log(`   SK RELAX PRODUCTION SERVER RUNNING`);
  console.log(`   URL: http://${HOST}:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`   Static Root: ${DIST_DIR}`);
  console.log(`======================================================================`);
});

// Graceful shutdown handling
function handleShutdown(signal) {
  console.log(`\n[Server] Received ${signal}. Closing HTTP connections gracefully...`);
  server.close(() => {
    console.log('[Server] HTTP server closed cleanly. Exiting process.');
    process.exit(0);
  });
  // Force exit after 10 seconds if connections refuse to close
  setTimeout(() => {
    console.error('[Server] Forcing exit after timeout.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
