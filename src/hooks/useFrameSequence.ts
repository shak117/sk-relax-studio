import { useState, useEffect, useRef, useCallback } from 'react';
import { FrameManifest } from '../types/scrollAnimation';

interface UseFrameSequenceOptions {
  manifestUrl?: string;
  preloadWindow?: number;
  maxConcurrent?: number;
}

export function useFrameSequence(options: UseFrameSequenceOptions = {}) {
  const {
    manifestUrl = '/hero-frames/manifest.json',
    preloadWindow = 20,
    maxConcurrent = 6,
  } = options;

  const [manifest, setManifest] = useState<FrameManifest | null>(null);
  const [initialReady, setInitialReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Cached HTMLImageElement instances
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const activeLoadsRef = useRef<number>(0);
  const queueRef = useRef<number[]>([]);
  const isMountedRef = useRef(true);

  // Track the most recent successfully rendered or ready image
  const lastValidImageRef = useRef<HTMLImageElement | null>(null);

  // Load manifest once on mount
  useEffect(() => {
    isMountedRef.current = true;
    let ignore = false;

    fetch(manifestUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} loading manifest`);
        return res.json() as Promise<FrameManifest>;
      })
      .then((data) => {
        if (!ignore && isMountedRef.current) {
          setManifest(data);
        }
      })
      .catch((err) => {
        if (!ignore && isMountedRef.current) {
          setLoadError(err.message || 'Failed to load frame manifest');
        }
      });

    return () => {
      ignore = true;
      isMountedRef.current = false;
    };
  }, [manifestUrl]);

  // Load a single frame by index
  const loadFrame = useCallback((index: number, frames: string[]): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (imageCacheRef.current.has(index)) {
        resolve(imageCacheRef.current.get(index)!);
        return;
      }

      if (index < 0 || index >= frames.length) {
        reject(new Error(`Index ${index} out of bounds`));
        return;
      }

      const img = new Image();
      img.src = frames[index];

      img.onload = () => {
        if (isMountedRef.current) {
          imageCacheRef.current.set(index, img);
          if (!lastValidImageRef.current) {
            lastValidImageRef.current = img;
          }
        }
        resolve(img);
      };

      img.onerror = () => {
        reject(new Error(`Failed to load frame ${index}`));
      };
    });
  }, []);

  // Process image queue
  const processQueue = useCallback((frames: string[]) => {
    while (activeLoadsRef.current < maxConcurrent && queueRef.current.length > 0) {
      const nextIdx = queueRef.current.shift();
      if (nextIdx === undefined || imageCacheRef.current.has(nextIdx)) continue;

      activeLoadsRef.current++;
      loadFrame(nextIdx, frames)
        .catch(() => {})
        .finally(() => {
          activeLoadsRef.current--;
          if (isMountedRef.current) {
            processQueue(frames);
          }
        });
    }
  }, [loadFrame, maxConcurrent]);

  // Preload priority frames when manifest arrives
  useEffect(() => {
    if (!manifest || manifest.frames.length === 0) return;

    const frames = manifest.frames;
    
    // Load frame 0 immediately
    loadFrame(0, frames)
      .then((img) => {
        if (isMountedRef.current) {
          lastValidImageRef.current = img;
          setInitialReady(true);
        }
      })
      .catch(() => {
        if (isMountedRef.current) {
          // Fallback to poster if frame 0 fails
          setInitialReady(true);
        }
      });

    // Queue first 25 frames
    const initialBatch = Array.from({ length: Math.min(25, frames.length) }, (_, i) => i);
    queueRef.current.push(...initialBatch);
    processQueue(frames);
  }, [manifest, loadFrame, processQueue]);

  // Prefetch around current index as user scrolls
  const prefetchAround = useCallback((centerIndex: number) => {
    if (!manifest) return;
    const frames = manifest.frames;
    const start = Math.max(0, centerIndex - 5);
    const end = Math.min(frames.length - 1, centerIndex + preloadWindow);

    for (let i = start; i <= end; i++) {
      if (!imageCacheRef.current.has(i) && !queueRef.current.includes(i)) {
        queueRef.current.push(i);
      }
    }
    processQueue(frames);
  }, [manifest, preloadWindow, processQueue]);

  // Retrieve best available image for a given progress (0 to 1)
  const getFrameAtProgress = useCallback((progress: number): HTMLImageElement | null => {
    if (!manifest || manifest.frames.length === 0) {
      return lastValidImageRef.current;
    }

    const total = manifest.frames.length;
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const targetIdx = Math.min(Math.floor(clampedProgress * (total - 1)), total - 1);

    // Prefetch around this index
    prefetchAround(targetIdx);

    // Exact match
    if (imageCacheRef.current.has(targetIdx)) {
      const img = imageCacheRef.current.get(targetIdx)!;
      lastValidImageRef.current = img;
      return img;
    }

    // Search closest available loaded frame (look backward first, then forward)
    for (let delta = 1; delta <= 30; delta++) {
      const prev = targetIdx - delta;
      if (prev >= 0 && imageCacheRef.current.has(prev)) {
        const img = imageCacheRef.current.get(prev)!;
        lastValidImageRef.current = img;
        return img;
      }
      const next = targetIdx + delta;
      if (next < total && imageCacheRef.current.has(next)) {
        const img = imageCacheRef.current.get(next)!;
        lastValidImageRef.current = img;
        return img;
      }
    }

    // Return last valid loaded image
    return lastValidImageRef.current;
  }, [manifest, prefetchAround]);

  return {
    manifest,
    initialReady,
    loadError,
    getFrameAtProgress,
    totalFrames: manifest?.totalFrames ?? 720,
    poster: manifest?.poster ?? '/hero-frames/hero-scroll-poster.jpg'
  };
}
