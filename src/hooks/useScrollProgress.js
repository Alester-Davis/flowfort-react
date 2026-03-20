import { useRef, useCallback } from 'react';

// Lightweight hook — no RAF loop. The single RAF loop lives in useFrameSequence
// and calls notifyProgress() each tick to avoid multiple loops competing.
export default function useScrollProgress(spacerRef) {
  const progressRef = useRef(-1);
  const pastHeroRef = useRef(false);
  const listenersRef = useRef(new Set());

  const subscribe = useCallback((fn) => {
    listenersRef.current.add(fn);
    // Immediately fire with current values
    fn(Math.max(0, progressRef.current), pastHeroRef.current);
    return () => listenersRef.current.delete(fn);
  }, []);

  // Called by useFrameSequence's RAF loop each frame
  const notifyProgress = useCallback((p, past) => {
    if (p !== progressRef.current || past !== pastHeroRef.current) {
      progressRef.current = p;
      pastHeroRef.current = past;
      listenersRef.current.forEach(fn => fn(p, past));
    }
  }, []);

  return { progressRef, pastHeroRef, subscribe, notifyProgress };
}
