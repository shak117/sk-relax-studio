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
    preloadWindow = 12,
    maxConcurrent = 6,
  } = options;

  const [manifest, setManifest] = useState<FrameManifest | null>(null);
  const [initialReady, setInitialReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Cache: index -> HTMLImageElement
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  // Set of currently active network fetches
  const inFlightRef = useRef<Set<number>>(new Set());
  // High-priority priority queue of indices to load
  const priorityQueueRef = useRef<number[]>([]);
  const isMountedRef = useRef(true);

  // Most recent valid loaded image to prevent blank flashes
  const lastValidImageRef = useRef<HTMLImageElement | null>(null);

  // 1. Fetch manifest
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

  // 2. Load single frame with off-thread decode
  const loadSingleFrame = useCallback(async (index: number, frames: string[]): Promise<HTMLImageElement | null> => {
    if (imageCacheRef.current.has(index)) {
      return imageCacheRef.current.get(index)!;
    }
    if (index < 0 || index >= frames.length) {
      return null;
    }

    inFlightRef.current.add(index);

    try {
      const img = new Image();
      img.src = frames[index];

      // Decode off main thread
      try {
        await img.decode();
      } catch {
        // Fallback for decode error or unloaded image
      }

      if (isMountedRef.current && img.naturalWidth > 0) {
        imageCacheRef.current.set(index, img);
        if (!lastValidImageRef.current) {
          lastValidImageRef.current = img;
        }
        return img;
      }
      return null;
    } catch {
      return null;
    } finally {
      inFlightRef.current.delete(index);
    }
  }, []);

  // 3. Process priority queue
  const pumpQueue = useCallback((frames: string[]) => {
    while (inFlightRef.current.size < maxConcurrent && priorityQueueRef.current.length > 0) {
      const target = priorityQueueRef.current.shift();
      if (target === undefined || imageCacheRef.current.has(target) || inFlightRef.current.has(target)) {
        continue;
      }

      loadSingleFrame(target, frames).then(() => {
        if (isMountedRef.current) {
          pumpQueue(frames);
        }
      });
    }
  }, [loadSingleFrame, maxConcurrent]);

  // 4. Initial load: immediately preload first batch
  useEffect(() => {
    if (!manifest || manifest.frames.length === 0) return;
    const frames = manifest.frames;

    // Load frame 0 immediately
    loadSingleFrame(0, frames).then((firstImg) => {
      if (isMountedRef.current) {
        if (firstImg) {
          lastValidImageRef.current = firstImg;
        }
        setInitialReady(true);
      }
    });

    // Queue first 20 frames for initial smooth scrub
    const initialBatch = Array.from({ length: Math.min(20, frames.length) }, (_, i) => i);
    priorityQueueRef.current = initialBatch;
    pumpQueue(frames);
  }, [manifest, loadSingleFrame, pumpQueue]);

  // 5. Intelligent priority preloading based on current scroll target
  const prefetchAroundTarget = useCallback((centerIdx: number) => {
    if (!manifest) return;
    const frames = manifest.frames;
    const total = frames.length;

    // Build urgent priority list: centerIdx first, then forward window, then backward window
    const urgent: number[] = [];
    if (!imageCacheRef.current.has(centerIdx) && !inFlightRef.current.has(centerIdx)) {
      urgent.push(centerIdx);
    }

    // Look forward
    for (let f = 1; f <= preloadWindow; f++) {
      const idx = centerIdx + f;
      if (idx < total && !imageCacheRef.current.has(idx) && !inFlightRef.current.has(idx)) {
        urgent.push(idx);
      }
    }

    // Look backward
    for (let b = 1; b <= 4; b++) {
      const idx = centerIdx - b;
      if (idx >= 0 && !imageCacheRef.current.has(idx) && !inFlightRef.current.has(idx)) {
        urgent.push(idx);
      }
    }

    // Prepend urgent indices to front of queue
    priorityQueueRef.current = Array.from(new Set([...urgent, ...priorityQueueRef.current.slice(0, 30)]));
    pumpQueue(frames);
  }, [manifest, preloadWindow, pumpQueue]);

  // 6. Fast non-blocking frame retrieval
  const getFrameAtProgress = useCallback((progress: number): HTMLImageElement | null => {
    if (!manifest || manifest.frames.length === 0) {
      return lastValidImageRef.current;
    }

    const total = manifest.frames.length;
    const clamped = Math.max(0, Math.min(1, progress));
    const targetIdx = Math.min(Math.floor(clamped * (total - 1)), total - 1);

    // Prioritize loading near targetIdx
    prefetchAroundTarget(targetIdx);

    // Exact hit
    if (imageCacheRef.current.has(targetIdx)) {
      const hit = imageCacheRef.current.get(targetIdx)!;
      lastValidImageRef.current = hit;
      return hit;
    }

    // Find nearest cached frame within search distance
    for (let dist = 1; dist <= 60; dist++) {
      const prev = targetIdx - dist;
      if (prev >= 0 && imageCacheRef.current.has(prev)) {
        const img = imageCacheRef.current.get(prev)!;
        lastValidImageRef.current = img;
        return img;
      }
      const next = targetIdx + dist;
      if (next < total && imageCacheRef.current.has(next)) {
        const img = imageCacheRef.current.get(next)!;
        lastValidImageRef.current = img;
        return img;
      }
    }

    return lastValidImageRef.current;
  }, [manifest, prefetchAroundTarget]);

  return {
    manifest,
    initialReady,
    loadError,
    getFrameAtProgress,
    totalFrames: manifest?.totalFrames ?? 720,
    poster: manifest?.poster ?? '/hero-frames/hero-scroll-poster.jpg'
  };
}
