import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const MARKERS = [
  // Asia Pacific
  { location: [3.14,   101.69], baseSize: 0.03},  // KL / HQ
  { location: [13.75,  100.49], baseSize: 0.022 }, // Bangkok
  { location: [35.68,  139.69], baseSize: 0.022 }, // Tokyo
  { location: [25.20,   55.27], baseSize: 0.022 }, // Dubai
  { location: [19.08,   72.88], baseSize: 0.022 }, // Mumbai
  { location: [1.35,   103.82], baseSize: 0.022 }, // Singapore
  { location: [22.30,  114.18], baseSize: 0.022 }, // Hong Kong
  { location: [39.90,  116.41], baseSize: 0.022 }, // Beijing
  // Europe
  { location: [51.51,   -0.13], baseSize: 0.022 }, // London
  { location: [48.85,    2.35], baseSize: 0.022 }, // Paris
  { location: [52.52,   13.40], baseSize: 0.022 }, // Berlin
  // Americas
  { location: [40.71,  -74.01], baseSize: 0.022 }, // New York
  { location: [37.77, -122.42], baseSize: 0.022 }, // San Francisco
  { location: [-23.55, -46.63], baseSize: 0.022 }, // São Paulo
  { location: [19.43,  -99.13], baseSize: 0.022 }, // Mexico City
  { location: [4.71,   -74.07], baseSize: 0.022 }, // Bogotá
  // Africa / Oceania
  { location: [-33.87, 151.21], baseSize: 0.022 }, // Sydney
  { location: [-26.20,  28.04], baseSize: 0.022 }, // Johannesburg
  { location: [30.06,   31.25], baseSize: 0.022 }, // Cairo
  { location: [-1.29,   36.82], baseSize: 0.022 }, // Nairobi
  { location: [6.37,    2.39],  baseSize: 0.022 }, // Lagos
];

const markers = MARKERS.map(m => ({ location: m.location, size: m.baseSize }));

const START_PHI   = 105 * (Math.PI / 180);
const START_THETA = 0.2;
const THETA_MIN   = -0.8;
const THETA_MAX   =  0.8;

export default function GlobalSites() {
  const canvasRef  = useRef(null);
  const globeRef   = useRef(null);
  const phiRef     = useRef(START_PHI);
  const thetaRef   = useRef(START_THETA);
  const isDragging = useRef(false);
  const prevX      = useRef(0);
  const prevY      = useRef(0);
  const frameRef   = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = canvas.offsetWidth || 520;

    globeRef.current = createGlobe(canvas, {
      devicePixelRatio: window.devicePixelRatio,
      width:  size * window.devicePixelRatio,
      height: size * window.devicePixelRatio,
      phi:    phiRef.current,
      theta:  thetaRef.current,
      dark:   1,
      diffuse: 1.8,
      mapSamples: 20000,
      mapBrightness: 8,
      baseColor:   [0.02, 0.08, 0.14],
      markerColor: [0.09, 0.92, 0.85],
      glowColor:   [0.38, 0.47, 0.92],
      markers,
      onRender(state) {
        if (!isDragging.current) phiRef.current += 0.003;
        state.phi   = phiRef.current;
        state.theta = thetaRef.current;

        frameRef.current += 0.04;
        markers.forEach((m, i) => {
          const base  = MARKERS[i].baseSize;
          const pulse = Math.sin(frameRef.current + i * 0.9) * 0.5 + 0.5;
          m.size = base + pulse * base * 0.5;
        });
        state.markers = markers;
      },
    });

    const onDown = (e) => {
      isDragging.current = true;
      prevX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      prevY.current = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    };
    const onUp = () => { isDragging.current = false; };
    const onMove = (e) => {
      if (!isDragging.current) return;
      const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
      phiRef.current += (x - prevX.current) * 0.008;
      // drag down → positive dy → increase theta → globe tilts down
      thetaRef.current = Math.max(
        THETA_MIN,
        Math.min(THETA_MAX, thetaRef.current + (y - prevY.current) * 0.008)
      );
      prevX.current = x;
      prevY.current = y;
    };

    canvas.addEventListener('mousedown',  onDown);
    canvas.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('mouseup',    onUp);
    window.addEventListener('touchend',   onUp);
    window.addEventListener('mousemove',  onMove);
    window.addEventListener('touchmove',  onMove, { passive: true });

    return () => {
      globeRef.current?.destroy();
      canvas.removeEventListener('mousedown',  onDown);
      canvas.removeEventListener('touchstart', onDown);
      window.removeEventListener('mouseup',    onUp);
      window.removeEventListener('touchend',   onUp);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('touchmove',  onMove);
    };
  }, []);

  return (
    <section id="global-sites">
      <div className="gs-layout">

        <motion.div
          className="gs-globe-wrap"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
        >
          <div className="gs-glow-ring" />
          <canvas ref={canvasRef} className="gs-globe-canvas" />
        </motion.div>

        <div className="gs-right">
          <motion.div
            className="section-label"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}
          >
            <Globe size={12} /> Global Deployment
          </motion.div>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: 0.06, duration: 0.35, ease: [0.22,1,0.36,1] }}
          >
            Monitor compliance across<br />every site, <em>every jurisdiction.</em>
          </motion.h2>
          <motion.p
            className="section-body"
            style={{ marginBottom: '2rem' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: 0.1, duration: 0.35, ease: [0.22,1,0.36,1] }}
          >
            FlowFort manages distributed industrial operations across ASEAN and beyond —
            with site-scoped roles, configurable workflows, and region-specific compliance mapping.
          </motion.p>
        </div>

      </div>
    </section>
  );
}
