import fs from 'fs';
import path from 'path';

// Mutex / promise queue per file path to prevent concurrent writes from interleaving
const writeQueues = new Map();

/**
 * Asynchronously write JSON data atomically to a file using temporary file + fsync + rename.
 * Guarantees zero partial file truncation and prevents concurrent collisions.
 */
export async function atomicWriteJson(filePath, data, options = { spaces: 2 }) {
  if (!writeQueues.has(filePath)) {
    writeQueues.set(filePath, Promise.resolve());
  }

  const queue = writeQueues.get(filePath);

  const writeOperation = queue.then(async () => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const jsonString = typeof data === 'string' ? data : JSON.stringify(data, null, options.spaces || 2);
    
    // Pre-validate JSON serialization
    JSON.parse(jsonString);

    const tempPath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).slice(2, 8)}`;

    let fd = null;
    try {
      fd = fs.openSync(tempPath, 'w');
      fs.writeFileSync(fd, jsonString, 'utf8');
      fs.fsyncSync(fd);
      fs.closeSync(fd);
      fd = null;

      // Verify the written temporary file is intact and valid JSON
      const verifyContent = fs.readFileSync(tempPath, 'utf8');
      JSON.parse(verifyContent);

      // Atomic rename replaces target atomically
      fs.renameSync(tempPath, filePath);
    } catch (err) {
      if (fd !== null && fd !== undefined) {
        try { fs.closeSync(fd); } catch {}
      }
      if (fs.existsSync(tempPath)) {
        try { fs.unlinkSync(tempPath); } catch {}
      }
      console.error(`[atomicWriteJson] Error writing ${filePath}:`, err.message);
      throw err;
    }
  });

  writeQueues.set(filePath, writeOperation.catch(() => {}));
  return writeOperation;
}

/**
 * Synchronous atomic JSON write using temporary file + fsync + rename.
 */
export function atomicWriteJsonSync(filePath, data, options = { spaces: 2 }) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const jsonString = typeof data === 'string' ? data : JSON.stringify(data, null, options.spaces || 2);
  JSON.parse(jsonString);

  const tempPath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).slice(2, 8)}`;
  let fd = null;
  try {
    fd = fs.openSync(tempPath, 'w');
    fs.writeFileSync(fd, jsonString, 'utf8');
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    fd = null;

    const verifyContent = fs.readFileSync(tempPath, 'utf8');
    JSON.parse(verifyContent);

    fs.renameSync(tempPath, filePath);
  } catch (err) {
    if (fd !== null && fd !== undefined) {
      try { fs.closeSync(fd); } catch {}
    }
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch {}
    }
    console.error(`[atomicWriteJsonSync] Error writing ${filePath}:`, err.message);
    throw err;
  }
}
