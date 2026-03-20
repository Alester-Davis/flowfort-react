import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';
import { Globe, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const headerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const sites = [
  { name: 'PETRONAS Refinery, Kerteh',   country: 'Malaysia',     lat:  4.51, lng: 103.43, status: 'compliant' },
  { name: 'Malakoff Power Station, Lumut',country: 'Malaysia',     lat:  4.23, lng: 100.63, status: 'compliant' },
  { name: 'Palm Oil Mill, Johor',         country: 'Malaysia',     lat:  1.87, lng: 103.36, status: 'in-review' },
  { name: 'LNG Terminal, Singapore',      country: 'Singapore',    lat:  1.26, lng: 103.82, status: 'compliant' },
  { name: 'Mining Site, Kalimantan',      country: 'Indonesia',    lat: -1.68, lng: 113.38, status: 'at-risk'   },
  { name: 'Refinery, Dumai',              country: 'Indonesia',    lat:  1.67, lng: 101.44, status: 'in-review' },
  { name: 'Power Grid, Bangkok',          country: 'Thailand',     lat: 13.75, lng: 100.49, status: 'compliant' },
  { name: 'Water Treatment, Manila',      country: 'Philippines',  lat: 14.59, lng: 120.98, status: 'at-risk'   },
];

const statusConfig = {
  compliant:  { color: '#17EAD9', label: 'Compliant', icon: CheckCircle2 },
  'in-review':{ color: '#f5a623', label: 'In Review', icon: Clock        },
  'at-risk':  { color: '#ff5f5f', label: 'At Risk',   icon: AlertTriangle},
};

const KL = { lat: 3.14, lng: 101.69 };

// cobe markers (plain color arrays, no functions)
const globeMarkers = sites.map((s) => {
  const c = statusConfig[s.status].color;
  return {
    location: [s.lat, s.lng],
    size: 0.04,
    color: [
      parseInt(c.slice(1,3),16)/255,
      parseInt(c.slice(3,5),16)/255,
      parseInt(c.slice(5,7),16)/255,
      1,
    ],
  };
});
globeMarkers.push({ location: [KL.lat, KL.lng], size: 0.06, color: [1,1,1,1] });

const allPins = [
  ...sites.map(s => ({ ...s, isHQ: false })),
  { name: 'HQ — Kuala Lumpur', country: 'Malaysia', lat: KL.lat, lng: KL.lng, status: 'compliant', isHQ: true },
];

// The fixed phi that centres SE Asia (longitude ~102°E → theta offset)
// cobe's phi is the Y-axis rotation applied at render time.
// We want lng=102 to face front. cobe's internal mapping: front = phi where
// the point's theta (= (lng+180)*PI/180) minus phi = 0  →  phi = (102+180)*PI/180
const FIXED_PHI = (102 + 180) * (Math.PI / 180);
const FIXED_THETA = 0.25; // slight tilt

/**
 * Project lat/lng → SVG coords given globe's current phi rotation.
 * Matches cobe's coordinate system exactly.
 */
function project(lat, lng, phi, theta, size) {
  // Spherical → Cartesian (cobe convention)
  const lam = lng * (Math.PI / 180);
  const phi0 = lat * (Math.PI / 180);

  const cosLat = Math.cos(phi0);
  // cobe uses: x = cos(lat)*sin(lng-phi), y = sin(lat), z = cos(lat)*cos(lng-phi)
  const dLng = lam - phi;
  const x = cosLat * Math.sin(dLng);
  const y = Math.sin(phi0);
  const z = cosLat * Math.cos(dLng);

  // Apply theta tilt (rotation around X axis)
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  const y2 =  y * cosT - z * sinT;
  const z2 =  y * sinT + z * cosT;

  // z2 < 0 means behind the globe
  if (z2 < 0) return null;

  const cx = size / 2 + x  * (size / 2) * 0.94;
  const cy = size / 2 - y2 * (size / 2) * 0.94;
  return { x: cx, y: cy, fade: z2 < 0.12 };
}

const compliantCount = sites.filter(s => s.status === 'compliant').length;
const inReviewCount  = sites.filter(s => s.status === 'in-review').length;
const atRiskCount    = sites.filter(s => s.status === 'at-risk').length;

export default function GlobalSites() {
  const canvasRef = useRef(null);
  const svgRef    = useRef(null);
  const globeRef  = useRef(null);
  const sizeRef   = useRef(500);
  const [svgSize, setSvgSize] = useState(500);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = canvas.offsetWidth || 500;
    sizeRef.current = size;
    setSvgSize(size);
    canvas.width  = size * window.devicePixelRatio;
    canvas.height = size * window.devicePixelRatio;

    function updatePins(phi) {
      const svg = svgRef.current;
      if (!svg) return;
      const sz = sizeRef.current;
      allPins.forEach((pin, i) => {
        const g = svg.querySelector(`[data-pin="${i}"]`);
        if (!g) return;
        const p = project(pin.lat, pin.lng, phi, FIXED_THETA, sz);
        if (!p) { g.style.opacity = '0'; return; }
        g.style.opacity = p.fade ? '0.3' : '1';
        g.setAttribute('transform', `translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`);
      });
    }

    globeRef.current = createGlobe(canvas, {
      devicePixelRatio: window.devicePixelRatio,
      width:  size * window.devicePixelRatio,
      height: size * window.devicePixelRatio,
      phi:    FIXED_PHI,
      theta:  FIXED_THETA,
      dark: 1,
      diffuse: 1.8,
      mapSamples: 16000,
      mapBrightness: 5,
      baseColor:   [0.08, 0.12, 0.16],
      markerColor: [0.09, 0.92, 0.85],
      glowColor:   [0.09, 0.55, 0.5],
      markers: globeMarkers,
      onRender(state) {
        // No rotation — keep phi fixed
        state.phi = FIXED_PHI;
        updatePins(FIXED_PHI);
      },
    });

    return () => { if (globeRef.current) globeRef.current.destroy(); };
  }, []);

  return (
    <section id="global-sites">
      <div className="section-orb orb-teal" style={{ top: '-80px', right: '-160px' }} />

      <div className="global-sites-inner">
        {/* Left: Globe */}
        <motion.div
          className="globe-wrap"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <canvas ref={canvasRef} className="globe-canvas" />

          {/* SVG pin overlay */}
          <svg
            ref={svgRef}
            className="globe-pins-svg"
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            aria-hidden="true"
          >
            <defs>
              <style>{`
                @keyframes pin-pulse {
                  0%   { r: 5;  opacity: 0.85; }
                  100% { r: 14; opacity: 0;    }
                }
                @keyframes hq-pulse {
                  0%   { r: 7;  opacity: 0.9; }
                  100% { r: 20; opacity: 0;   }
                }
              `}</style>
            </defs>

            {allPins.map((pin, i) => {
              const color = pin.isHQ ? '#ffffff' : statusConfig[pin.status].color;
              const coreR  = pin.isHQ ? 4.5 : 3;
              const ringR  = pin.isHQ ? 7   : 5;
              const anim   = pin.isHQ ? 'hq-pulse' : 'pin-pulse';
              const dur    = pin.isHQ ? '2.4s' : '2s';
              const delay  = `${(i * 0.28) % 2}s`;
              const delay2 = `${((i * 0.28) + 0.9) % 2}s`;

              return (
                <g key={i} data-pin={i} style={{ transition: 'opacity 0.2s' }}>
                  {/* Pulse ring 1 */}
                  <circle
                    cx={0} cy={0} r={ringR}
                    fill="none" stroke={color} strokeWidth={1.5}
                    style={{ animation: `${anim} ${dur} ease-out infinite`, animationDelay: delay }}
                  />
                  {/* Pulse ring 2 (offset) */}
                  <circle
                    cx={0} cy={0} r={ringR}
                    fill="none" stroke={color} strokeWidth={1}
                    style={{ animation: `${anim} ${dur} ease-out infinite`, animationDelay: delay2, opacity: 0.5 }}
                  />
                  {/* Core dot */}
                  <circle cx={0} cy={0} r={coreR} fill={color} opacity={0.95} />
                  {/* Bright centre */}
                  <circle cx={0} cy={0} r={coreR * 0.35} fill="#fff" opacity={0.9} />
                </g>
              );
            })}
          </svg>

          <div className="globe-hq-badge">
            <span className="globe-hq-dot" />
            HQ — Kuala Lumpur
          </div>
        </motion.div>

        {/* Right: Text + Site List */}
        <div className="global-sites-right">
          <motion.div
            className="section-label"
            custom={0} variants={headerVariants}
            initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Globe size={12} /> Global Deployment
          </motion.div>
          <motion.h2
            className="section-title split-title"
            custom={1} variants={headerVariants}
            initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            Monitor compliance across<br />every site, <em>every jurisdiction.</em>
          </motion.h2>
          <motion.p
            className="section-body"
            custom={2} variants={headerVariants}
            initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            FlowFort&apos;s multi-tenant architecture manages distributed industrial operations
            across ASEAN and beyond — with site-scoped roles, configurable workflows, and
            region-specific compliance mapping.
          </motion.p>

          {/* Summary row */}
          <motion.div
            className="globe-summary"
            custom={3} variants={headerVariants}
            initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="globe-stat">
              <span className="globe-stat-num">{sites.length}</span>
              <span className="globe-stat-label">Sites</span>
            </div>
            <div className="globe-stat-divider" />
            <div className="globe-stat">
              <span className="globe-stat-num compliant">{compliantCount}</span>
              <span className="globe-stat-label">Compliant</span>
            </div>
            <div className="globe-stat-divider" />
            <div className="globe-stat">
              <span className="globe-stat-num inreview">{inReviewCount}</span>
              <span className="globe-stat-label">In Review</span>
            </div>
            <div className="globe-stat-divider" />
            <div className="globe-stat">
              <span className="globe-stat-num atrisk">{atRiskCount}</span>
              <span className="globe-stat-label">At Risk</span>
            </div>
          </motion.div>

          {/* Site list */}
          <div className="globe-site-list">
            {sites.map((s, i) => {
              const cfg  = statusConfig[s.status];
              const Icon = cfg.icon;
              return (
                <motion.div
                  className="globe-site-row"
                  key={i} custom={i}
                  variants={itemVariants}
                  initial="hidden" whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  <Icon size={13} style={{ color: cfg.color, flexShrink: 0 }} />
                  <div className="globe-site-info">
                    <span className="globe-site-name">{s.name}</span>
                    <span className="globe-site-country">{s.country}</span>
                  </div>
                  <span className="globe-site-badge" style={{ color: cfg.color, borderColor: cfg.color + '40' }}>
                    {cfg.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
