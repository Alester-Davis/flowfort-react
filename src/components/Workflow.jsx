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
const DISC_NODES = (() => {
  const nodes = [];
  const cols = 7, rows = 5;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      nodes.push({
        x: 55 + c * 60, y: 52 + r * 64,
        spawnP: (r * cols + c) / (cols * rows - 1),
        pulse: (r * cols + c) * 0.4,
        type: (r * cols + c) % 3 === 0 ? 'hmi' : 'plc',
      });
  return nodes;
})();

const DISC_LINES = (() => {
  const lines = [];
  for (let i = 0; i < DISC_NODES.length; i++)
    for (let j = i + 1; j < DISC_NODES.length; j++) {
      const dx = DISC_NODES[i].x - DISC_NODES[j].x;
      const dy = DISC_NODES[i].y - DISC_NODES[j].y;
      if (Math.sqrt(dx * dx + dy * dy) < 88)
        lines.push({ i, j, spawnP: Math.max(DISC_NODES[i].spawnP, DISC_NODES[j].spawnP) + 0.02 });
    }
  return lines;
})();

function drawDiscovery(ctx, W, H, p, t) {
  ctx.clearRect(0, 0, W, H);
  const beamX = (p * (W + 80) - 40);
  const g = ctx.createLinearGradient(beamX - 40, 0, beamX + 40, 0);
  g.addColorStop(0, 'transparent');
  g.addColorStop(0.5, 'rgba(15,212,196,0.07)');
  g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  DISC_LINES.forEach(l => {
    const lp = band(p, l.spawnP, l.spawnP + 0.06);
    if (lp <= 0) return;
    const n1 = DISC_NODES[l.i], n2 = DISC_NODES[l.j];
    ctx.beginPath();
    ctx.moveTo(n1.x, n1.y);
    ctx.lineTo(lerp(n1.x, n2.x, lp), lerp(n1.y, n2.y, lp));
    ctx.strokeStyle = `rgba(15,212,196,${lp * 0.18})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  DISC_NODES.forEach(n => {
    const np = band(p, n.spawnP, n.spawnP + 0.04);
    if (np <= 0) return;
    const pulse = (Math.sin(t * 0.0015 + n.pulse) * 0.25 + 0.75) * np;
    ctx.globalAlpha = pulse;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
    ctx.strokeStyle = '#0fd4c4';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.fillStyle = 'rgba(15,212,196,0.1)';
    rr(ctx, n.x - 4.5, n.y - 4.5, 9, 9, 2);
    ctx.fill();
    ctx.strokeStyle = n.type === 'plc' ? '#0fd4c4' : '#5a6fe8';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = np * 0.45;
    ctx.fillStyle = '#0fd4c4';
    ctx.font = '5.5px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(n.type.toUpperCase(), n.x, n.y + 18);
  });
  ctx.globalAlpha = 1;

  const discovered = DISC_NODES.filter(n => p >= n.spawnP).length;
  ctx.fillStyle = 'rgba(8,9,16,0.88)';
  rr(ctx, W / 2 - 62, H - 52, 124, 36, 8);
  ctx.fill();
  ctx.strokeStyle = 'rgba(15,212,196,0.22)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#0fd4c4';
  ctx.font = 'bold 17px Space Grotesk, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(discovered, W / 2, H - 32);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '7.5px JetBrains Mono, monospace';
  ctx.fillText('ASSETS DISCOVERED', W / 2, H - 20);
}

/* ══════════════════════════════════════════════════════════
   PHASE 1  —  Risk Assessment
   ══════════════════════════════════════════════════════════ */
const RISK_NODES = [
  { x: 240, y: 55,  risk: 0.95, label: 'PLC-MAIN',  cve: 'CVE-2024-1337' },
  { x: 95,  y: 145, risk: 0.72, label: 'HMI-01',    cve: 'CVE-2024-8821' },
  { x: 385, y: 145, risk: 0.88, label: 'SCADA-SRV', cve: 'CVE-2023-4991' },
  { x: 55,  y: 260, risk: 0.35, label: 'SENSOR-12', cve: null },
  { x: 175, y: 270, risk: 0.61, label: 'RTU-03',    cve: 'CVE-2024-5512' },
  { x: 305, y: 270, risk: 0.44, label: 'RTU-07',    cve: null },
  { x: 425, y: 255, risk: 0.79, label: 'HIST-SRV',  cve: 'CVE-2023-9902' },
  { x: 145, y: 358, risk: 0.22, label: 'ENG-WS',    cve: null },
  { x: 340, y: 358, risk: 0.55, label: 'DMZ-FW',    cve: 'CVE-2024-3301' },
];
const RISK_EDGES = [[0,1],[0,2],[1,3],[1,4],[2,6],[2,5],[3,7],[4,7],[5,8],[6,8]];

function riskColor(r) {
  return r > 0.75 ? '#e05c5c' : r > 0.5 ? '#f0a030' : '#3ec9a7';
}

function drawRisk(ctx, W, H, p, t) {
  ctx.clearRect(0, 0, W, H);
  RISK_EDGES.forEach(([i, j]) => {
    const np = Math.min(band(p, i / RISK_NODES.length, (i + 1) / RISK_NODES.length + 0.1),
                        band(p, j / RISK_NODES.length, (j + 1) / RISK_NODES.length + 0.1));
    if (np <= 0) return;
    const a = RISK_NODES[i], b = RISK_NODES[j];
    const rMax = Math.max(a.risk, b.risk);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = rMax > 0.75 ? `rgba(224,92,92,${np * 0.25})`
                    : rMax > 0.5  ? `rgba(240,160,48,${np * 0.25})`
                    :                `rgba(62,201,167,${np * 0.2})`;
    ctx.lineWidth = rMax > 0.75 ? 1.5 : 1;
    ctx.stroke();
  });

  RISK_NODES.forEach((n, i) => {
    const np = band(p, i / RISK_NODES.length, i / RISK_NODES.length + 0.12);
    if (np <= 0) return;
    const color = riskColor(n.risk);
    if (n.risk > 0.75) {
      const pR = lerp(12, 16, (Math.sin(t * 0.003 + i) + 1) / 2);
      ctx.beginPath();
      ctx.arc(n.x, n.y, pR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(224,92,92,${np * 0.2})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.globalAlpha = np;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = color + '22'; ctx.fill();
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = 'bold 7.5px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(n.risk * 100), n.x, n.y + 3);
    ctx.globalAlpha = np * 0.65;
    ctx.fillStyle = '#f5f5f7';
    ctx.font = '7px JetBrains Mono, monospace';
    ctx.fillText(n.label, n.x, n.y + 22);
    if (n.cve && np > 0.6) {
      const bx = n.x - 28, by = n.y + 26;
      ctx.globalAlpha = np * (np - 0.6) / 0.4;
      ctx.fillStyle = 'rgba(224,92,92,0.12)';
      rr(ctx, bx, by, 56, 11, 2);
      ctx.fill();
      ctx.fillStyle = '#e05c5c';
      ctx.font = '5.5px JetBrains Mono, monospace';
      ctx.fillText(n.cve, n.x, by + 8);
    }
    ctx.globalAlpha = 1;
  });

  const px = W / 2 - 112, py = H - 58;
  ctx.fillStyle = 'rgba(8,9,16,0.9)';
  rr(ctx, px, py, 224, 46, 8);
  ctx.fill();
  ctx.strokeStyle = 'rgba(240,160,48,0.25)';
  ctx.lineWidth = 1; ctx.stroke();
  const vis = RISK_NODES.filter((_, i) => band(p, i / RISK_NODES.length, i / RISK_NODES.length + 0.12) > 0.5);
  const high = vis.filter(n => n.risk > 0.75).length;
  const med  = vis.filter(n => n.risk > 0.5 && n.risk <= 0.75).length;
  const low  = vis.filter(n => n.risk <= 0.5).length;
  [[high,'#e05c5c','HIGH', px+26],[med,'#f0a030','MED', px+98],[low,'#3ec9a7','LOW', px+170]].forEach(([v,c,l,x]) => {
    ctx.fillStyle = c;
    ctx.font = 'bold 15px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(v, x, py + 24);
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.font = '7px JetBrains Mono, monospace';
    ctx.fillText(l, x, py + 38);
  });
}

/* ══════════════════════════════════════════════════════════
   PHASE 2  —  Patch Orchestration
   ══════════════════════════════════════════════════════════ */
const PATCH_TARGETS = [
  { x: 80,  y: 160, label: 'PLC-MAIN',  delay: 0.05 },
  { x: 200, y: 180, label: 'HMI-01',    delay: 0.18 },
  { x: 355, y: 155, label: 'SCADA-SRV', delay: 0.31 },
  { x: 55,  y: 290, label: 'RTU-03',    delay: 0.44 },
  { x: 175, y: 300, label: 'SENSOR-12', delay: 0.55 },
  { x: 310, y: 295, label: 'HIST-SRV',  delay: 0.66 },
  { x: 405, y: 278, label: 'ENG-WS',    delay: 0.77 },
];
const PATCH_SERVER = { x: 240, y: 52 };

function drawPatch(ctx, W, H, p) {
  ctx.clearRect(0, 0, W, H);
  const total = PATCH_TARGETS.length;
  PATCH_TARGETS.forEach((node) => {
    const lineP = band(p, 0, node.delay + 0.05);
    const pktP  = band(p, node.delay, node.delay + 0.14);
    const done  = p >= node.delay + 0.14;
    const color = done ? '#3ec9a7' : pktP > 0 ? '#5a6fe8' : 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.moveTo(PATCH_SERVER.x, PATCH_SERVER.y);
    ctx.lineTo(lerp(PATCH_SERVER.x, node.x, lineP), lerp(PATCH_SERVER.y, node.y, lineP));
    ctx.strokeStyle = done ? 'rgba(62,201,167,0.2)' : pktP > 0 ? 'rgba(90,111,232,0.2)' : 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    if (pktP > 0 && !done) {
      for (let trail = 4; trail >= 0; trail--) {
        const tp = Math.max(0, pktP - trail * 0.025);
        const tx = lerp(PATCH_SERVER.x, node.x, tp);
        const ty = lerp(PATCH_SERVER.y, node.y, tp);
        ctx.beginPath();
        ctx.arc(tx, ty, 3.5 - trail * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(90,111,232,${0.9 - trail * 0.17})`;
        ctx.fill();
      }
      ctx.shadowColor = '#5a6fe8'; ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(lerp(PATCH_SERVER.x, node.x, pktP), lerp(PATCH_SERVER.y, node.y, pktP), 4, 0, Math.PI * 2);
      ctx.fillStyle = '#7a8ff8'; ctx.fill();
      ctx.shadowBlur = 0;
    }
    const nodeP = Math.min(1, lineP * 3);
    ctx.globalAlpha = nodeP;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = color + '22'; ctx.fill();
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
    if (done) {
      ctx.beginPath();
      ctx.moveTo(node.x - 4, node.y); ctx.lineTo(node.x - 1, node.y + 3.5); ctx.lineTo(node.x + 5, node.y - 4);
      ctx.strokeStyle = '#3ec9a7'; ctx.lineWidth = 1.8; ctx.stroke();
    }
    ctx.globalAlpha = nodeP * 0.55;
    ctx.fillStyle = '#f5f5f7';
    ctx.font = '6.5px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(node.label, node.x, node.y + 22);
    ctx.globalAlpha = 1;
  });

  const sR = 15 + Math.sin(p * 30) * 2;
  ctx.beginPath(); ctx.arc(PATCH_SERVER.x, PATCH_SERVER.y, sR + 6, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(90,111,232,0.15)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.beginPath(); ctx.arc(PATCH_SERVER.x, PATCH_SERVER.y, 16, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(90,111,232,0.15)'; ctx.fill();
  ctx.strokeStyle = '#5a6fe8'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = '#5a6fe8';
  ctx.font = 'bold 8px Space Grotesk, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PKG', PATCH_SERVER.x, PATCH_SERVER.y + 3);
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '6.5px JetBrains Mono, monospace';
  ctx.fillText('PATCH SERVER', PATCH_SERVER.x, PATCH_SERVER.y + 27);

  const done = PATCH_TARGETS.filter(n => p >= n.delay + 0.14).length;
  const pct = Math.round((done / total) * 100);
  const bx = W / 2 - 118, by = H - 56;
  ctx.fillStyle = 'rgba(8,9,16,0.9)';
  rr(ctx, bx, by, 236, 44, 8); ctx.fill();
  ctx.strokeStyle = 'rgba(90,111,232,0.25)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  rr(ctx, bx + 12, by + 28, 212, 6, 3); ctx.fill();
  const barW = 212 * (done / total);
  if (barW > 0) {
    const bGrd = ctx.createLinearGradient(bx + 12, 0, bx + 12 + 212, 0);
    bGrd.addColorStop(0, '#5a6fe8'); bGrd.addColorStop(1, '#3ec9a7');
    ctx.fillStyle = bGrd;
    rr(ctx, bx + 12, by + 28, barW, 6, 3); ctx.fill();
    ctx.shadowColor = '#5a6fe8'; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(bx + 12 + barW, by + 31, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#7a8ff8'; ctx.fill(); ctx.shadowBlur = 0;
  }
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 13px Space Grotesk, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`${done}/${total} patched`, bx + 12, by + 20);
  ctx.fillStyle = done === total ? '#3ec9a7' : '#5a6fe8';
  ctx.textAlign = 'right';
  ctx.fillText(`${pct}%`, bx + 224, by + 20);
}

/* ══════════════════════════════════════════════════════════
   PHASE 3  —  Continuous Compliance
   ══════════════════════════════════════════════════════════ */
const FRAMEWORKS = [
  { label: 'IEC 62443',   target: 0.97, color: '#3ec9a7', delay: 0.1 },
  { label: 'NERC CIP',    target: 0.91, color: '#5a6fe8', delay: 0.25 },
  { label: 'NIS2',        target: 0.88, color: '#0fd4c4', delay: 0.4  },
  { label: 'NIST 800-82', target: 0.94, color: '#b06dd0', delay: 0.55 },
];
const LOG_LINES = [
  { threshold: 0.08,  text: 'PATCH CVE-2024-1337 → APPLIED',     color: '#3ec9a7' },
  { threshold: 0.22,  text: 'APPROVAL: ops-lead@flowfort.io',     color: '#5a6fe8' },
  { threshold: 0.38,  text: 'IEC 62443-2-3 §6.2 → SATISFIED',    color: '#3ec9a7' },
  { threshold: 0.52,  text: 'EVIDENCE PACKAGE GENERATED',         color: '#0fd4c4' },
  { threshold: 0.65,  text: 'NERC CIP-007-6 R2 → COMPLIANT',     color: '#3ec9a7' },
  { threshold: 0.78,  text: 'AUDIT TRAIL SEALED (SHA-256)',        color: '#b06dd0' },
  { threshold: 0.9,   text: 'REPORT EXPORTED → ISO PDF',          color: '#5a6fe8' },
];

function drawCompliance(ctx, W, H, p, t) {
  ctx.clearRect(0, 0, W, H);
  const shP = Math.min(1, p * 2.2);
  const cx = W / 2, cy = 100;
  if (shP > 0.4) {
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 65);
    glow.addColorStop(0, `rgba(62,201,167,${(shP - 0.4) * 0.1})`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(cx - 75, cy - 75, 150, 150);
  }
  ctx.save();
  ctx.translate(cx, cy - 18);
  const s = shP;
  ctx.beginPath();
  ctx.moveTo(0, -44 * s);
  ctx.lineTo(-34 * s, -24 * s); ctx.lineTo(-34 * s, 12 * s);
  ctx.quadraticCurveTo(-34 * s, 36 * s, 0, 50 * s);
  ctx.quadraticCurveTo(34 * s, 36 * s, 34 * s, 12 * s);
  ctx.lineTo(34 * s, -24 * s);
  ctx.closePath();
  ctx.fillStyle = `rgba(62,201,167,${s * 0.09})`; ctx.fill();
  ctx.strokeStyle = `rgba(62,201,167,${s * 0.85})`; ctx.lineWidth = 1.5; ctx.stroke();
  if (shP > 0.75) {
    const ck = (shP - 0.75) / 0.25;
    ctx.beginPath();
    ctx.moveTo(-14 * ck, 5); ctx.lineTo(-3 * ck, 17 * ck); ctx.lineTo(19 * ck, -11 * ck);
    ctx.strokeStyle = `rgba(62,201,167,${ck})`; ctx.lineWidth = 3;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
  }
  ctx.restore();

  const barStartY = 202;
  FRAMEWORKS.forEach((fw, i) => {
    const barP = band(p, fw.delay, fw.delay + 0.3);
    const barW = 256 * barP * fw.target;
    const by = barStartY + i * 44;
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    rr(ctx, W / 2 - 128, by + 16, 256, 5, 2); ctx.fill();
    if (barW > 2) {
      const bGrd = ctx.createLinearGradient(W / 2 - 128, 0, W / 2 + 128, 0);
      bGrd.addColorStop(0, fw.color); bGrd.addColorStop(1, fw.color + '88');
      ctx.fillStyle = bGrd;
      rr(ctx, W / 2 - 128, by + 16, barW, 5, 2); ctx.fill();
      ctx.shadowColor = fw.color; ctx.shadowBlur = 5;
      ctx.beginPath(); ctx.arc(W / 2 - 128 + barW, by + 18.5, 3, 0, Math.PI * 2);
      ctx.fillStyle = fw.color; ctx.fill(); ctx.shadowBlur = 0;
    }
    ctx.fillStyle = 'rgba(245,245,247,0.82)';
    ctx.font = '600 10px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(fw.label, W / 2 - 128, by + 12);
    if (barP > 0.05) {
      ctx.fillStyle = fw.color;
      ctx.font = 'bold 10px Space Grotesk, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${Math.round(fw.target * barP * 100)}%`, W / 2 + 128, by + 12);
    }
  });

  const lx = 20, ly = H - 62;
  ctx.fillStyle = 'rgba(8,9,16,0.88)';
  rr(ctx, lx, ly, W - 40, 46, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  rr(ctx, lx, ly, W - 40, 14, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = '6px JetBrains Mono, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('AUDIT LOG', lx + 10, ly + 9);
  const visible = LOG_LINES.filter(l => p >= l.threshold);
  const last2 = visible.slice(-2);
  last2.forEach((l, i) => {
    ctx.fillStyle = i === last2.length - 1 ? l.color : 'rgba(255,255,255,0.3)';
    ctx.font = '7.5px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    const blink = i === last2.length - 1 && Math.floor(t / 500) % 2 === 0 ? '█' : '';
    ctx.fillText(`> ${l.text}${blink}`, lx + 10, ly + 26 + i * 13);
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
