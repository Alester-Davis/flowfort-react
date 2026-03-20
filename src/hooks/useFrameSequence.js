import { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 91;
const EARLY_READY = 8;

export default function useFrameSequence(canvasRef, spacerRef, notifyProgress) {
  const [ready, setReady] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const bitmaps = useRef(new Array(TOTAL_FRAMES));
  const currentFrame = useRef(-1);
  const smoothP = useRef(0);
  const canvasSize = useRef({ w: 0, h: 0 });
  const cachedMaxScroll = useRef(0);
  const cachedSpacerEnd = useRef(0);
  const ctxRef = useRef(null);

  const drawFrame = useCallback((idx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!ctxRef.current) ctxRef.current = canvas.getContext('2d');
    const ctx = ctxRef.current;
    const bmp = bitmaps.current[idx];
    if (!bmp) return;
    const { w: cw, h: ch } = canvasSize.current;
    // Bitmaps are pre-scaled to cover the display — just center them
    const xOff = Math.round((cw - bmp.width) / 2);
    const yOff = Math.round((ch - bmp.height) / 2);
    ctx.drawImage(bmp, xOff, yOff);
  }, [canvasRef]);

  const updateCachedMaxScroll = useCallback(() => {
    const spacer = spacerRef.current;
    if (spacer) {
      cachedMaxScroll.current = spacer.offsetHeight - window.innerHeight;
      cachedSpacerEnd.current = spacer.offsetTop + spacer.offsetHeight;
    }
  }, [spacerRef]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    ctxRef.current = null; // Reset — setting canvas.width invalidates context
    canvasSize.current = { w, h };
    updateCachedMaxScroll();
    if (currentFrame.current >= 0) drawFrame(currentFrame.current);
  }, [canvasRef, drawFrame, updateCachedMaxScroll]);

  // Preload frames — downscale to display resolution at load time so drawImage is cheap
  useEffect(() => {
    let loaded = 0;
    let isReady = false;

    // Pre-scale to canvas pixel size (innerWidth/Height, no DPR — canvas uses CSS pixels)
    const sw = window.innerWidth;
    const sh = window.innerHeight;
    // Cover-fit: same ratio used in drawFrame centering
    const srcW = 1920, srcH = 1080;
    const s = Math.max(sw / srcW, sh / srcH);
    const targetW = Math.round(srcW * s);
    const targetH = Math.round(srcH * s);

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const idx = i - 1;
      const num = String(i).padStart(4, '0');
      fetch(`${import.meta.env.BASE_URL}frames/frame_${num}.jpg`)
        .then(r => r.blob())
        .then(blob => createImageBitmap(blob, {
          resizeWidth: targetW,
          resizeHeight: targetH,
          resizeQuality: 'medium',
        }))
        .then(bmp => {
          bitmaps.current[idx] = bmp;
          loaded++;
          setLoadPct(Math.round((loaded / TOTAL_FRAMES) * 100));
          if (loaded >= EARLY_READY && !isReady) {
            isReady = true;
            setReady(true);
          }
        })
        .catch(() => { loaded++; });
    }
  }, []);

  // Resize handler
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // Continuous RAF loop — reads scrollY directly every frame for maximum smoothness.
  // Layout-triggering reads (offsetHeight) are cached and only updated on resize.
  useEffect(() => {
    if (!ready) return;

    updateCachedMaxScroll();
    resizeCanvas();
    drawFrame(0);
    currentFrame.current = 0;

    let animId;
    // Lerp factor: higher = more responsive but more draws per fast scroll
    // 0.3 means ~3 frames to catch up — smooths out burst draws on fast scroll
    const LERP = 0.3;

    function tick() {
      animId = requestAnimationFrame(tick);

      const maxScroll = cachedMaxScroll.current;
      if (maxScroll <= 0) return;

      const scrollY = window.scrollY;
      const targetP = Math.min(1, Math.max(0, scrollY / maxScroll));

      // Lerp only the frame index to avoid burst draws on fast scroll
      const prev = smoothP.current;
      const diff = targetP - prev;
      const lerpedP = Math.abs(diff) < 0.002 || Math.abs(diff) > 0.15 ? targetP : prev + diff * LERP;
      smoothP.current = lerpedP;

      const idx = Math.min(TOTAL_FRAMES - 1, Math.round(lerpedP * (TOTAL_FRAMES - 1)));
      if (idx !== currentFrame.current) {
        drawFrame(idx);
        currentFrame.current = idx;
      }

      // Subscribers (hero content, navbar) use real scroll position — no lerp lag
      if (notifyProgress) {
        const pastHero = cachedSpacerEnd.current > 0 && scrollY >= cachedSpacerEnd.current;
        notifyProgress(targetP, pastHero);
      }
    }

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [ready, drawFrame, resizeCanvas, updateCachedMaxScroll, notifyProgress]);

  return { ready, loadPct, smoothP, TOTAL_FRAMES };
}
