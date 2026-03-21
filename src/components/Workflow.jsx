import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const phases = [
  {
    num: '01',
    title: 'Asset Discovery',
    body: 'Passive network scanning maps every PLC, HMI, SCADA server, and field device across your industrial environment — continuously updated, never disruptive.',
    label: 'OT ASSET INVENTORY',
    color: '#0fd4c4',
  },
  {
    num: '02',
    title: 'Risk Assessment',
    body: 'Real-time vulnerability scoring cross-references your asset inventory against OT-specific threat feeds, CVE databases, and exploitability metrics to surface what actually matters.',
    label: 'VULNERABILITY ANALYSIS',
    color: '#f0a030',
  },
  {
    num: '03',
    title: 'Patch Orchestration',
    body: 'OEM-qualified patches deploy through intelligent workflows that respect operational windows, production schedules, and safety constraints — zero unplanned downtime.',
    label: 'AUTOMATED DEPLOYMENT',
    color: '#5a6fe8',
  },
  {
    num: '04',
    title: 'Continuous Compliance',
    body: 'Every patch, approval, and exception is automatically logged. Demonstrate IEC 62443, NERC CIP, and NIS2 compliance with audit-ready reports generated in minutes.',
    label: 'AUDIT & REPORTING',
    color: '#3ec9a7',
  },
];

/* ─── Helpers ─────────────────────────────────────────────── */
function band(p, s, e) { return Math.min(1, Math.max(0, (p - s) / (e - s))); }
function lerp(a, b, t) { return a + (b - a) * t; }
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ══════════════════════════════════════════════════════════
   PHASE 0  —  Asset Discovery
   ══════════════════════════════════════════════════════════ */
// Layered ring topology — Y values capped so labels fit above badge area (H-58)
// Badge area: y=362..420. Bottom device nodes max y=295 → label ends at ~315, clear.
const DISC_CORE   = { x: 240, y: 175, label: 'CORE-SW' };
const DISC_ZONES  = [
  { x: 120, y: 95,  label: 'ZONE-A' },
  { x: 360, y: 95,  label: 'ZONE-B' },
  { x: 85,  y: 260, label: 'ZONE-C' },
  { x: 385, y: 260, label: 'ZONE-D' },
];
const DISC_DEVICES = [
  { x: 52,  y: 44,  label: 'PLC-01',  type: 'plc',    zone: 0, spawnP: 0.30 },
  { x: 145, y: 30,  label: 'HMI-01',  type: 'hmi',    zone: 0, spawnP: 0.35 },
  { x: 76,  y: 148, label: 'RTU-01',  type: 'rtu',    zone: 0, spawnP: 0.38 },
  { x: 340, y: 30,  label: 'PLC-02',  type: 'plc',    zone: 1, spawnP: 0.43 },
  { x: 432, y: 44,  label: 'HMI-02',  type: 'hmi',    zone: 1, spawnP: 0.47 },
  { x: 400, y: 148, label: 'SCADA',   type: 'scada',  zone: 1, spawnP: 0.51 },
  { x: 38,  y: 295, label: 'RTU-02',  type: 'rtu',    zone: 2, spawnP: 0.56 },
  { x: 140, y: 310, label: 'SENSOR',  type: 'sensor', zone: 2, spawnP: 0.60 },
  { x: 395, y: 295, label: 'RTU-03',  type: 'rtu',    zone: 3, spawnP: 0.65 },
  { x: 440, y: 210, label: 'ENG-WS',  type: 'hmi',    zone: 3, spawnP: 0.70 },
];
const TYPE_COLOR = { plc: '#0fd4c4', hmi: '#5a6fe8', rtu: '#f0a030', scada: '#e05c5c', sensor: '#b06dd0' };

function drawDiscovery(ctx, W, H, p, t) {
  ctx.clearRect(0, 0, W, H);

  // Scanning beam — sweeps left to right
  const beamX = lerp(-60, W + 60, p);
  const beamG = ctx.createLinearGradient(beamX - 55, 0, beamX + 55, 0);
  beamG.addColorStop(0,   'transparent');
  beamG.addColorStop(0.45,'rgba(15,212,196,0.04)');
  beamG.addColorStop(0.5, 'rgba(15,212,196,0.13)');
  beamG.addColorStop(0.55,'rgba(15,212,196,0.04)');
  beamG.addColorStop(1,   'transparent');
  ctx.fillStyle = beamG;
  ctx.fillRect(0, 0, W, H);

  // Connections: core ↔ zones
  const coreSpawn = band(p, 0.04, 0.14);
  DISC_ZONES.forEach((z, zi) => {
    const lp = band(p, 0.04 + zi * 0.03, 0.22 + zi * 0.03);
    if (lp <= 0) return;
    ctx.beginPath();
    ctx.moveTo(DISC_CORE.x, DISC_CORE.y);
    ctx.lineTo(lerp(DISC_CORE.x, z.x, lp), lerp(DISC_CORE.y, z.y, lp));
    ctx.strokeStyle = `rgba(15,212,196,${lp * 0.55})`;
    ctx.lineWidth = 1.5; ctx.stroke();
  });

  // Connections: zones ↔ devices
  DISC_DEVICES.forEach(d => {
    const zone = DISC_ZONES[d.zone];
    const lp = band(p, d.spawnP - 0.06, d.spawnP);
    if (lp <= 0) return;
    ctx.beginPath();
    ctx.moveTo(zone.x, zone.y);
    ctx.lineTo(lerp(zone.x, d.x, lp), lerp(zone.y, d.y, lp));
    ctx.strokeStyle = `rgba(${TYPE_COLOR[d.type].slice(1).match(/../g).map(h => parseInt(h, 16)).join(',')},${lp * 0.5})`;
    ctx.lineWidth = 1; ctx.stroke();
  });

  // Core switch node (radius 18)
  if (coreSpawn > 0) {
    ctx.shadowColor = '#0fd4c4'; ctx.shadowBlur = 20 * coreSpawn;
    ctx.beginPath(); ctx.arc(DISC_CORE.x, DISC_CORE.y, 18, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(15,212,196,${coreSpawn * 0.18})`; ctx.fill();
    ctx.strokeStyle = '#0fd4c4'; ctx.lineWidth = 2; ctx.stroke();
    ctx.shadowBlur = 0;
    // Label centered inside node
    ctx.fillStyle = '#0fd4c4'; ctx.font = 'bold 8px JetBrains Mono, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('CORE', DISC_CORE.x, DISC_CORE.y);
    ctx.textBaseline = 'alphabetic';
    // Name below node — 18 radius + 12 gap
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '8px JetBrains Mono, monospace';
    ctx.fillText('CORE-SW', DISC_CORE.x, DISC_CORE.y + 30);
    // Ping ring
    const ping = (t * 0.0018) % 1;
    ctx.beginPath(); ctx.arc(DISC_CORE.x, DISC_CORE.y, 18 + ping * 26, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(15,212,196,${(1 - ping) * 0.35 * coreSpawn})`; ctx.lineWidth = 1; ctx.stroke();
  }

  // Zone switch nodes (radius 13)
  DISC_ZONES.forEach((z, zi) => {
    const zp = band(p, 0.06 + zi * 0.03, 0.20 + zi * 0.03);
    if (zp <= 0) return;
    ctx.shadowColor = '#0fd4c4'; ctx.shadowBlur = 10 * zp;
    ctx.beginPath(); ctx.arc(z.x, z.y, 13, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(15,212,196,${zp * 0.14})`; ctx.fill();
    ctx.strokeStyle = `rgba(15,212,196,${zp * 0.9})`; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = `rgba(255,255,255,${zp * 0.88})`;
    ctx.font = 'bold 7px JetBrains Mono, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(z.label, z.x, z.y);
    ctx.textBaseline = 'alphabetic';
  });

  // Device nodes (radius 11) — label 13px below edge
  const NODE_R = 11;
  DISC_DEVICES.forEach(d => {
    const np = band(p, d.spawnP, d.spawnP + 0.05);
    if (np <= 0) return;
    const color = TYPE_COLOR[d.type];
    const pulse = 0.75 + Math.sin(t * 0.002 + d.spawnP * 8) * 0.25;
    ctx.globalAlpha = np;
    ctx.shadowColor = color; ctx.shadowBlur = 14 * np * pulse;
    ctx.beginPath(); ctx.arc(d.x, d.y, NODE_R, 0, Math.PI * 2);
    ctx.fillStyle = color + '28'; ctx.fill();
    ctx.strokeStyle = color; ctx.lineWidth = 1.8; ctx.stroke();
    ctx.shadowBlur = 0;
    // Type abbreviation inside node
    ctx.fillStyle = color; ctx.font = 'bold 7px JetBrains Mono, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(d.type.slice(0, 3).toUpperCase(), d.x, d.y);
    ctx.textBaseline = 'alphabetic';
    // Device label — 13px below node edge, 9px font
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillText(d.label, d.x, d.y + NODE_R + 13);
    ctx.globalAlpha = 1;
  });

  // Counter badge — fixed at bottom, vertically spaced
  const discovered = DISC_DEVICES.filter(d => p >= d.spawnP).length
    + DISC_ZONES.filter((_, zi) => band(p, 0.06 + zi * 0.03, 0.20 + zi * 0.03) > 0).length
    + (coreSpawn > 0 ? 1 : 0);
  const badgeW = 160, badgeH = 44;
  const bx = (W - badgeW) / 2, by = H - badgeH - 8;
  ctx.fillStyle = 'rgba(8,9,16,0.92)';
  rr(ctx, bx, by, badgeW, badgeH, 8); ctx.fill();
  ctx.strokeStyle = 'rgba(15,212,196,0.4)'; ctx.lineWidth = 1; ctx.stroke();
  // Number
  ctx.shadowColor = '#0fd4c4'; ctx.shadowBlur = 12;
  ctx.fillStyle = '#0fd4c4'; ctx.font = 'bold 22px Space Grotesk, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(discovered, W / 2, by + 18);
  ctx.shadowBlur = 0; ctx.textBaseline = 'alphabetic';
  // Sub-label
  ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = '7px JetBrains Mono, monospace';
  ctx.fillText('ASSETS DISCOVERED', W / 2, by + 37);
}

/* ══════════════════════════════════════════════════════════
   PHASE 1  —  Risk Assessment
   ══════════════════════════════════════════════════════════ */
// Node Y layout: badge area starts at H-58=362. Bottom nodes need y + NODE_R + label(13) + CVE(16) < 362
// So bottom nodes max y = 362 - 14 - 13 - 16 = 319. Use y=295 for bottom row, y=200 for mid row.
const RISK_NODES = [
  { x: 240, y: 46,  risk: 0.95, label: 'PLC-MAIN',  cve: 'CVE-2024-1337' },
  { x: 100, y: 128, risk: 0.72, label: 'HMI-01',    cve: 'CVE-2024-8821' },
  { x: 380, y: 128, risk: 0.88, label: 'SCADA-SRV', cve: 'CVE-2023-4991' },
  { x: 52,  y: 222, risk: 0.35, label: 'SENSOR-12', cve: null },
  { x: 178, y: 232, risk: 0.61, label: 'RTU-03',    cve: 'CVE-2024-5512' },
  { x: 305, y: 232, risk: 0.44, label: 'RTU-07',    cve: null },
  { x: 428, y: 215, risk: 0.79, label: 'HIST-SRV',  cve: 'CVE-2023-9902' },
  { x: 145, y: 295, risk: 0.22, label: 'ENG-WS',    cve: null },
  { x: 338, y: 295, risk: 0.55, label: 'DMZ-FW',    cve: 'CVE-2024-3301' },
];
const RISK_EDGES = [[0,1],[0,2],[1,3],[1,4],[2,6],[2,5],[3,7],[4,7],[5,8],[6,8]];

function riskColor(r) {
  return r > 0.75 ? '#e05c5c' : r > 0.5 ? '#f0a030' : '#3ec9a7';
}

function drawRisk(ctx, W, H, p, t) {
  ctx.clearRect(0, 0, W, H);
  const NODE_R = 14;

  // Edges
  RISK_EDGES.forEach(([i, j]) => {
    const np = Math.min(
      band(p, i / RISK_NODES.length, (i + 1) / RISK_NODES.length + 0.1),
      band(p, j / RISK_NODES.length, (j + 1) / RISK_NODES.length + 0.1),
    );
    if (np <= 0) return;
    const a = RISK_NODES[i], b = RISK_NODES[j];
    const rMax = Math.max(a.risk, b.risk);
    const col = rMax > 0.75 ? `224,92,92` : rMax > 0.5 ? `240,160,48` : `62,201,167`;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = `rgba(${col},${np * 0.45})`;
    ctx.lineWidth = rMax > 0.75 ? 1.8 : 1.2; ctx.stroke();
  });

  // Nodes
  RISK_NODES.forEach((n, i) => {
    const np = band(p, i / RISK_NODES.length, i / RISK_NODES.length + 0.1);
    if (np <= 0) return;
    const color = riskColor(n.risk);

    // Pulse ring for high-risk
    if (n.risk > 0.75) {
      const ring = ((t * 0.0022 + i * 0.4) % 1);
      ctx.beginPath();
      ctx.arc(n.x, n.y, NODE_R + 4 + ring * 18, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(224,92,92,${(1 - ring) * 0.6 * np})`;
      ctx.lineWidth = 1.5; ctx.stroke();
    }

    // Node fill + stroke
    ctx.globalAlpha = np;
    ctx.shadowColor = color; ctx.shadowBlur = 18 * np;
    ctx.beginPath(); ctx.arc(n.x, n.y, NODE_R, 0, Math.PI * 2);
    ctx.fillStyle = color + '2a'; ctx.fill();
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
    ctx.shadowBlur = 0;

    // Risk score — centered inside node
    ctx.fillStyle = color;
    ctx.font = 'bold 10px Space Grotesk, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(Math.round(n.risk * 100), n.x, n.y);
    ctx.textBaseline = 'alphabetic';

    // Device label — 13px below node edge, 9px font
    ctx.globalAlpha = np * 0.9;
    ctx.fillStyle = '#f0f0f2';
    ctx.font = '9px JetBrains Mono, monospace'; ctx.textAlign = 'center';
    ctx.fillText(n.label, n.x, n.y + NODE_R + 13);

    // CVE badge — 16px below label baseline (label at +13, badge top at +16 → no overlap)
    if (n.cve && np > 0.6) {
      const fa = Math.min(1, (np - 0.6) / 0.4);
      const badgeW = 70, badgeH = 13;
      const bx = n.x - badgeW / 2;
      const by = n.y + NODE_R + 16;   // starts just below the label's 9px ascenders
      ctx.globalAlpha = np * fa * 0.95;
      ctx.fillStyle = 'rgba(224,92,92,0.2)';
      rr(ctx, bx, by, badgeW, badgeH, 3); ctx.fill();
      ctx.strokeStyle = 'rgba(224,92,92,0.6)'; ctx.lineWidth = 0.8; ctx.stroke();
      ctx.fillStyle = '#ff7070';
      ctx.font = 'bold 7px JetBrains Mono, monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(n.cve, n.x, by + badgeH / 2);
      ctx.textBaseline = 'alphabetic';
    }
    ctx.globalAlpha = 1;
  });

  // Summary badge — 3 equal columns, fixed height
  const badgeW = 252, badgeH = 46;
  const px = (W - badgeW) / 2, py = H - badgeH - 8;
  ctx.fillStyle = 'rgba(8,9,16,0.92)';
  rr(ctx, px, py, badgeW, badgeH, 8); ctx.fill();
  ctx.strokeStyle = 'rgba(240,160,48,0.35)'; ctx.lineWidth = 1; ctx.stroke();

  // Vertical dividers
  [px + 84, px + 168].forEach(lx => {
    ctx.beginPath(); ctx.moveTo(lx, py + 8); ctx.lineTo(lx, py + badgeH - 8);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.stroke();
  });

  const vis  = RISK_NODES.filter((_, i) => band(p, i / RISK_NODES.length, i / RISK_NODES.length + 0.1) > 0.5);
  const high = vis.filter(n => n.risk > 0.75).length;
  const med  = vis.filter(n => n.risk > 0.5 && n.risk <= 0.75).length;
  const low  = vis.filter(n => n.risk <= 0.5).length;
  [[high, '#e05c5c', 'CRITICAL', px + 42],
   [med,  '#f0a030', 'MEDIUM',   px + 126],
   [low,  '#3ec9a7', 'LOW',      px + 210]].forEach(([v, c, l, x]) => {
    ctx.shadowColor = c; ctx.shadowBlur = 8;
    ctx.fillStyle = c; ctx.font = 'bold 20px Space Grotesk, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(v, x, py + 18);
    ctx.shadowBlur = 0; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = '8px JetBrains Mono, monospace';
    ctx.fillText(l, x, py + 39);
  });
}

/* ══════════════════════════════════════════════════════════
   PHASE 2  —  Patch Orchestration
   ══════════════════════════════════════════════════════════ */
// Badge area H-56=364. Bottom nodes need y + 13(radius) + 13(label) < 364 → max y ≈ 338
const PATCH_TARGETS = [
  { x: 72,  y: 140, label: 'PLC-MAIN',  delay: 0.04 },
  { x: 200, y: 158, label: 'HMI-01',    delay: 0.17 },
  { x: 360, y: 140, label: 'SCADA-SRV', delay: 0.30 },
  { x: 44,  y: 258, label: 'RTU-03',    delay: 0.43 },
  { x: 175, y: 268, label: 'SENSOR-12', delay: 0.54 },
  { x: 318, y: 265, label: 'HIST-SRV',  delay: 0.65 },
  { x: 420, y: 248, label: 'ENG-WS',    delay: 0.76 },
];
const PATCH_SERVER = { x: 240, y: 46 };

function drawPatch(ctx, W, H, p) {
  ctx.clearRect(0, 0, W, H);
  const total = PATCH_TARGETS.length;

  PATCH_TARGETS.forEach(node => {
    const lineP = band(p, 0, node.delay + 0.06);
    const pktP  = band(p, node.delay, node.delay + 0.13);
    const done  = p >= node.delay + 0.13;
    const nodeP = Math.min(1, lineP * 2.5);

    // Deployment line
    const lineColor = done ? 'rgba(62,201,167,0.45)' : pktP > 0 ? 'rgba(90,111,232,0.4)' : 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.moveTo(PATCH_SERVER.x, PATCH_SERVER.y);
    ctx.lineTo(lerp(PATCH_SERVER.x, node.x, lineP), lerp(PATCH_SERVER.y, node.y, lineP));
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = done ? 1.2 : 1;
    ctx.setLineDash(done ? [] : [5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Packet in-flight with trail
    if (pktP > 0 && !done) {
      for (let trail = 5; trail >= 0; trail--) {
        const tp  = Math.max(0, pktP - trail * 0.022);
        const tx  = lerp(PATCH_SERVER.x, node.x, tp);
        const ty  = lerp(PATCH_SERVER.y, node.y, tp);
        const rad = Math.max(0.5, 4 - trail * 0.6);
        ctx.shadowColor = '#5a6fe8'; ctx.shadowBlur = trail === 0 ? 16 : 0;
        ctx.beginPath(); ctx.arc(tx, ty, rad, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(122,143,248,${(0.95 - trail * 0.15)})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    // Done flash ring
    if (done) {
      ctx.shadowColor = '#3ec9a7'; ctx.shadowBlur = 20;
      ctx.beginPath(); ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(62,201,167,0.25)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Node circle
    const color = done ? '#3ec9a7' : pktP > 0 ? '#7a8ff8' : 'rgba(255,255,255,0.2)';
    ctx.shadowColor = done ? '#3ec9a7' : '#5a6fe8'; ctx.shadowBlur = done ? 16 : pktP > 0 ? 12 : 0;
    ctx.globalAlpha = nodeP;
    ctx.beginPath(); ctx.arc(node.x, node.y, 13, 0, Math.PI * 2);
    ctx.fillStyle = done ? 'rgba(62,201,167,0.2)' : pktP > 0 ? 'rgba(90,111,232,0.2)' : 'rgba(255,255,255,0.06)';
    ctx.fill();
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
    ctx.shadowBlur = 0;

    // Checkmark when done
    if (done) {
      ctx.strokeStyle = '#3ec9a7'; ctx.lineWidth = 2.2;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(node.x - 5, node.y + 0.5);
      ctx.lineTo(node.x - 1.5, node.y + 4.5);
      ctx.lineTo(node.x + 6, node.y - 5);
      ctx.stroke();
      ctx.lineCap = 'butt';
    }

    ctx.globalAlpha = nodeP * 0.88;
    ctx.fillStyle = done ? '#3ec9a7' : '#f0f0f2';
    ctx.font = '9px JetBrains Mono, monospace'; ctx.textAlign = 'center';
    ctx.fillText(node.label, node.x, node.y + 13 + 13);  // radius 13 + 13px gap
    ctx.globalAlpha = 1;
  });

  // Patch server node — draw last so it renders on top
  const SRV_R = 20;
  ctx.shadowColor = '#5a6fe8'; ctx.shadowBlur = 22;
  ctx.beginPath(); ctx.arc(PATCH_SERVER.x, PATCH_SERVER.y, SRV_R, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(90,111,232,0.2)'; ctx.fill();
  ctx.strokeStyle = '#5a6fe8'; ctx.lineWidth = 2; ctx.stroke();
  ctx.shadowBlur = 0;
  // Server icon — 3 stacked bars perfectly centered inside circle
  ctx.fillStyle = '#7a8ff8';
  const barsH = 12;
  const barsY = PATCH_SERVER.y - barsH / 2;
  [0, 5, 10].forEach(dy => {
    rr(ctx, PATCH_SERVER.x - 8, barsY + dy, 16, 3, 1); ctx.fill();
  });
  // Label below node with clear gap
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '9px JetBrains Mono, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('PATCH SERVER', PATCH_SERVER.x, PATCH_SERVER.y + SRV_R + 13);

  // Progress badge — centered, fixed height with proper line spacing
  const doneCount = PATCH_TARGETS.filter(n => p >= n.delay + 0.13).length;
  const pct = Math.round((doneCount / total) * 100);
  const badgeW = 256, badgeH = 48;
  const bx = (W - badgeW) / 2, by = H - badgeH - 8;
  ctx.fillStyle = 'rgba(8,9,16,0.92)';
  rr(ctx, bx, by, badgeW, badgeH, 8); ctx.fill();
  ctx.strokeStyle = 'rgba(90,111,232,0.4)'; ctx.lineWidth = 1; ctx.stroke();

  // Label row
  ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Space Grotesk, sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(`${doneCount}/${total} patched`, bx + 16, by + 16);
  ctx.fillStyle = doneCount === total ? '#3ec9a7' : '#7a8ff8';
  ctx.font = 'bold 14px Space Grotesk, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`${pct}%`, bx + badgeW - 16, by + 16);
  ctx.textBaseline = 'alphabetic';

  // Progress bar track
  const trackX = bx + 16, trackY = by + 30, trackW = badgeW - 32, trackH = 7;
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  rr(ctx, trackX, trackY, trackW, trackH, 3); ctx.fill();
  const barW = trackW * (doneCount / total);
  if (barW > 0) {
    const bGrd = ctx.createLinearGradient(trackX, 0, trackX + trackW, 0);
    bGrd.addColorStop(0, '#5a6fe8'); bGrd.addColorStop(1, '#3ec9a7');
    ctx.shadowColor = '#5a6fe8'; ctx.shadowBlur = 8;
    ctx.fillStyle = bGrd;
    rr(ctx, trackX, trackY, barW, trackH, 3); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowColor = '#7a8ff8'; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(trackX + barW, trackY + trackH / 2, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowBlur = 0;
  }
}

/* ══════════════════════════════════════════════════════════
   PHASE 3  —  Continuous Compliance
   Live compliance score ring + framework cards + audit stream
   ══════════════════════════════════════════════════════════ */
const COMP_FRAMEWORKS = [
  { label: 'IEC 62443',   short: '62443', score: 0.97, color: '#3ec9a7', delay: 0.10 },
  { label: 'NERC CIP',    short: 'NERC',  score: 0.91, color: '#5a6fe8', delay: 0.22 },
  { label: 'NIS2',        short: 'NIS2',  score: 0.88, color: '#0fd4c4', delay: 0.34 },
  { label: 'NIST 800-82', short: 'NIST',  score: 0.94, color: '#b06dd0', delay: 0.46 },
];

const AUDIT_EVENTS = [
  { at: 0.08,  icon: '✦', text: 'CVE-2024-1337 patch applied',      color: '#3ec9a7' },
  { at: 0.20,  icon: '◈', text: 'Approval: ops-lead@flowfort.io',   color: '#5a6fe8' },
  { at: 0.33,  icon: '✦', text: 'IEC 62443-2-3 §6.2 satisfied',     color: '#3ec9a7' },
  { at: 0.47,  icon: '◈', text: 'Evidence package generated',        color: '#0fd4c4' },
  { at: 0.60,  icon: '✦', text: 'NERC CIP-007-6 R2 compliant',      color: '#3ec9a7' },
  { at: 0.73,  icon: '⬡', text: 'Audit trail sealed · SHA-256',      color: '#b06dd0' },
  { at: 0.86,  icon: '◈', text: 'Report exported → ISO PDF',         color: '#5a6fe8' },
];

function drawCompliance(ctx, W, H, p, t) {
  ctx.clearRect(0, 0, W, H);

  /* ── 1. Central score ring ──────────────────────────────── */
  const cx = W / 2, cy = 106;   // ring center — leaves room below for cards
  const R = 54, rInner = 40;
  const overallScore = 0.925;
  const ringP = Math.min(1, p * 1.6);
  const filled = overallScore * ringP;

  // Ambient glow behind ring
  if (ringP > 0.2) {
    const halo = ctx.createRadialGradient(cx, cy, rInner * 0.5, cx, cy, R + 28);
    halo.addColorStop(0, `rgba(62,201,167,${(ringP - 0.2) * 0.18})`);
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo; ctx.fillRect(cx - R - 32, cy - R - 32, (R + 32) * 2, (R + 32) * 2);
  }

  // Tick marks (draw before ring so ring overlays)
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2 - Math.PI / 2;
    const isMajor = i % 9 === 0;
    const ro = R + 6, ri = R + (isMajor ? 12 : 8);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * ro, cy + Math.sin(angle) * ro);
    ctx.lineTo(cx + Math.cos(angle) * ri, cy + Math.sin(angle) * ri);
    ctx.strokeStyle = isMajor ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)';
    ctx.lineWidth = isMajor ? 1.5 : 0.8; ctx.stroke();
  }

  // Track ring
  ctx.beginPath();
  ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 10; ctx.stroke();

  // Filled arc
  if (filled > 0.005) {
    const arcEnd = -Math.PI / 2 + Math.PI * 2 * filled;
    ctx.shadowColor = '#3ec9a7'; ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, arcEnd);
    ctx.strokeStyle = '#3ec9a7'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.stroke();
    ctx.shadowBlur = 0; ctx.lineCap = 'butt';
    // Leading dot
    const dx = cx + Math.cos(arcEnd) * R, dy = cy + Math.sin(arcEnd) * R;
    ctx.shadowColor = '#3ec9a7'; ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.arc(dx, dy, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowBlur = 0;
  }

  // Inner fill
  ctx.beginPath(); ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(10,14,22,0.9)'; ctx.fill();

  // Score % — vertically centered in inner circle
  const scoreDisplay = Math.round(overallScore * ringP * 100);
  ctx.shadowColor = '#3ec9a7'; ctx.shadowBlur = ringP > 0.5 ? 16 : 0;
  ctx.fillStyle = ringP > 0.1 ? '#3ec9a7' : 'rgba(62,201,167,0.3)';
  ctx.font = 'bold 22px Space Grotesk, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`${scoreDisplay}%`, cx, cy - 7);
  ctx.shadowBlur = 0;
  // Sub-label below score, inside inner circle — 8px for legibility
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillText('COMPLIANCE', cx, cy + 11);
  ctx.textBaseline = 'alphabetic';

  /* ── 2. Framework cards — 2×2 grid, centered, gap 8px ───── */
  const cardW = 110, cardH = 52, cardGap = 8;
  const gridTotalW = cardW * 2 + cardGap;
  const gridLeft = (W - gridTotalW) / 2;           // perfectly centered
  const gridTop  = cy + R + 18;                     // below ring with breathing room
  const gridX = [gridLeft, gridLeft + cardW + cardGap];
  const gridY = [gridTop, gridTop + cardH + cardGap];
  const positions = [[0,0],[1,0],[0,1],[1,1]];

  COMP_FRAMEWORKS.forEach((fw, i) => {
    const fp = band(p, fw.delay, fw.delay + 0.22);
    if (fp <= 0) return;
    const [col, row] = positions[i];
    const x = gridX[col], y = gridY[row];
    const rgb = fw.color.slice(1).match(/../g).map(h => parseInt(h, 16)).join(',');

    // Card bg + border
    ctx.globalAlpha = fp;
    ctx.fillStyle = `rgba(${rgb},0.08)`;
    rr(ctx, x, y, cardW, cardH, 7); ctx.fill();
    ctx.strokeStyle = `rgba(${rgb},${fp * 0.5})`;
    ctx.lineWidth = 1; ctx.stroke();

    // Mini arc — left side, centered vertically in card
    const miniR = 17, miniCx = x + 28, miniCy = y + cardH / 2;
    // Track
    ctx.beginPath(); ctx.arc(miniCx, miniCy, miniR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 4; ctx.stroke();
    // Fill
    const miniArc = -Math.PI / 2 + Math.PI * 2 * fw.score * fp;
    ctx.shadowColor = fw.color; ctx.shadowBlur = 10 * fp;
    ctx.beginPath(); ctx.arc(miniCx, miniCy, miniR, -Math.PI / 2, miniArc);
    ctx.strokeStyle = fw.color; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke();
    ctx.shadowBlur = 0; ctx.lineCap = 'butt';
    // Score centered inside mini arc
    ctx.fillStyle = fw.color;
    ctx.font = 'bold 10px Space Grotesk, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(fw.score * fp * 100)}`, miniCx, miniCy);
    ctx.textBaseline = 'alphabetic';

    // Text block — right of mini arc, vertically centered
    const textX = x + 53;   // arc center(28) + radius(17) + gap(8)
    // Framework name — 10px bold
    ctx.fillStyle = 'rgba(245,245,247,0.95)';
    ctx.font = 'bold 10px Space Grotesk, sans-serif';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(fw.label, textX, y + cardH / 2 - 9);
    // Status pill — 8px for legibility
    const isCompliant = fw.score * fp >= 0.85;
    ctx.fillStyle = isCompliant ? '#3ec9a7' : '#f0a030';
    ctx.font = '8px JetBrains Mono, monospace';
    ctx.fillText(isCompliant ? '● COMPLIANT' : '● IN REVIEW', textX, y + cardH / 2 + 9);
    ctx.textBaseline = 'alphabetic';
    ctx.globalAlpha = 1;
  });

  /* ── 3. Audit event stream — bottom panel ────────────────── */
  // 3 rows × 16px + header 24px + padding = 82px total
  const streamH = 82;
  const streamY = H - streamH - 8;
  const streamX = 14, streamW = W - 28;

  ctx.fillStyle = 'rgba(6,8,14,0.92)';
  rr(ctx, streamX, streamY, streamW, streamH, 8); ctx.fill();
  ctx.strokeStyle = 'rgba(62,201,167,0.2)'; ctx.lineWidth = 1; ctx.stroke();

  // Title bar row
  const titleY = streamY + 15;
  ctx.fillStyle = 'rgba(255,255,255,0.32)';
  ctx.font = '8px JetBrains Mono, monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('AUDIT STREAM', streamX + 12, titleY);
  // Live dot + label
  const livePulse = Math.sin(t * 0.005) * 0.3 + 0.7;
  ctx.beginPath(); ctx.arc(streamX + streamW - 30, titleY, 4, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(62,201,167,${livePulse})`; ctx.fill();
  ctx.fillStyle = 'rgba(62,201,167,0.85)';
  ctx.font = '8px JetBrains Mono, monospace'; ctx.textAlign = 'right';
  ctx.fillText('LIVE', streamX + streamW - 12, titleY);
  ctx.textBaseline = 'alphabetic';

  // Divider
  ctx.beginPath(); ctx.moveTo(streamX + 8, streamY + 24); ctx.lineTo(streamX + streamW - 8, streamY + 24);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1; ctx.stroke();

  // Events — 3 rows, 16px row height, starting at streamY + 38
  const ROW_H = 16;
  const visible = AUDIT_EVENTS.filter(e => p >= e.at);
  const last3 = visible.slice(-3);
  last3.forEach((ev, i) => {
    const isLast = i === last3.length - 1;
    const rowMid = streamY + 38 + i * ROW_H;
    ctx.globalAlpha = isLast ? 1 : 0.3 + i * 0.2;

    // Color dot
    ctx.shadowColor = isLast ? ev.color : 'transparent';
    ctx.shadowBlur = isLast ? 6 : 0;
    ctx.beginPath(); ctx.arc(streamX + 20, rowMid, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = ev.color; ctx.fill();
    ctx.shadowBlur = 0;

    // Event text — 8px for legibility
    ctx.fillStyle = isLast ? '#f0f0f2' : 'rgba(255,255,255,0.45)';
    ctx.font = `${isLast ? 'bold ' : ''}8px JetBrains Mono, monospace`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    const blink = isLast && Math.floor(t / 500) % 2 === 0 ? ' ▌' : '';
    ctx.fillText(`${ev.text}${blink}`, streamX + 32, rowMid);

    // Timestamp — right aligned, 7px
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '7px JetBrains Mono, monospace'; ctx.textAlign = 'right';
    ctx.fillText(`T+${Math.round(ev.at * 60)}s`, streamX + streamW - 12, rowMid);
    ctx.textBaseline = 'alphabetic';
    ctx.globalAlpha = 1;
  });
}

/* ══════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════ */
const CW = 480, CH = 420; // fixed logical canvas dimensions

export default function Workflow() {
  const stickyRef  = useRef(null);
  const canvasRef  = useRef(null);
  const labelsRef  = useRef(null);
  const leftRef    = useRef(null);
  const rafRef     = useRef(null);
  const scrollPRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas to fixed logical size — no clientWidth issues
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = CW * dpr;
    canvas.height = CH * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Update progress on scroll — cheap, no layout reads in RAF
    function onScroll() {
      const sticky = stickyRef.current;
      if (!sticky) return;
      const rect  = sticky.getBoundingClientRect();
      const total = sticky.offsetHeight - window.innerHeight;
      if (total <= 0) { scrollPRef.current = 0; return; }
      scrollPRef.current = Math.min(1, Math.max(0, -rect.top / total));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function tick(ts) {
      rafRef.current = requestAnimationFrame(tick);

      const globalP  = scrollPRef.current;
      const phaseIdx = Math.min(3, Math.floor(globalP * 4));
      // phaseP: 0→1 within each phase's 25% window
      const phaseP = phaseIdx === 3
        ? Math.min(1, (globalP - 0.75) / 0.25)
        : (globalP * 4) % 1;

      if      (phaseIdx === 0) drawDiscovery(ctx, CW, CH, phaseP, ts);
      else if (phaseIdx === 1) drawRisk(ctx, CW, CH, phaseP, ts);
      else if (phaseIdx === 2) drawPatch(ctx, CW, CH, phaseP);
      else                     drawCompliance(ctx, CW, CH, phaseP, ts);

      // Left panel — direct DOM updates
      const left = leftRef.current;
      if (left) {
        left.querySelectorAll('.wf-phase').forEach((panel, i) => {
          panel.classList.toggle('active', i === phaseIdx);
          panel.classList.toggle('done',   i < phaseIdx);
        });
        const fill = left.querySelector('.wf-track-fill');
        const ind  = left.querySelector('.wf-indicator');
        if (fill) fill.style.height = `${globalP * 100}%`;
        if (ind)  ind.style.top     = `${globalP * 100}%`;
      }

      // Canvas header label
      const labels = labelsRef.current;
      if (labels) {
        const phase = phases[phaseIdx];
        const dot = labels.querySelector('.wf-canvas-dot');
        const lbl = labels.querySelector('.wf-canvas-label');
        if (dot) dot.style.background = phase.color;
        if (lbl) { lbl.textContent = phase.label; lbl.style.color = phase.color; }
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div id="workflow" className="workflow-parallax-section">

      {/* Section header — scrolls normally above sticky window */}
      <div className="workflow-header">
        <motion.div
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          How It Works
        </motion.div>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          From discovery to compliance —<br /><span className="grad">fully automated.</span>
        </motion.h2>
      </div>

      {/* 400vh scroll container — sticky panel pins inside here */}
      <div className="workflow-sticky-wrap" ref={stickyRef}>
        <div className="workflow-sticky-inner">

          {/* Left: phase text, one visible at a time */}
          <div className="workflow-timeline" ref={leftRef}>
            <div className="wf-track">
              <div className="wf-track-fill" />
              <div className="wf-indicator" />
            </div>
            <div className="wf-phases">
              {phases.map((phase, i) => (
                <div
                  key={i}
                  className={`wf-phase${i === 0 ? ' active' : ''}`}
                  data-phase={i}
                >
                  <div className="wf-phase-num" style={{ '--phase-color': phase.color }}>
                    PHASE {phase.num}
                  </div>
                  <h3 className="wf-phase-title">{phase.title}</h3>
                  <p className="wf-phase-body">{phase.body}</p>
                  <div className="wf-phase-tag" style={{ borderColor: phase.color + '40', color: phase.color }}>
                    {phase.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: live canvas */}
          <div className="workflow-canvas-col">
            <div className="wf-canvas-wrap">
              <div className="wf-canvas-inner">
                <div className="wf-canvas-header" ref={labelsRef}>
                  <span className="wf-canvas-dot" style={{ background: phases[0].color }} />
                  <span className="wf-canvas-label" style={{ color: phases[0].color }}>
                    {phases[0].label}
                  </span>
                  <span className="wf-canvas-live">● LIVE</span>
                </div>
                <canvas ref={canvasRef} className="wf-phase-canvas" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
