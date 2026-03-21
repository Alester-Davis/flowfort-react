import { ClipboardCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const frameworks = [
  {
    id: 'IEC 62443',
    region: 'Global',
    sub: 'Industrial cybersecurity — updated 2024',
    color: '#17EAD9', rgb: '23,234,217',
  },
  {
    id: 'Act 854',
    region: 'Malaysia',
    sub: '11 NCII sectors · 6-hour reporting',
    color: '#6078EA', rgb: '96,120,234',
  },
  {
    id: 'NIS2',
    region: 'EU',
    sub: 'Up to €10M or 2% global revenue',
    color: '#fab285', rgb: '250,178,133',
  },
  {
    id: 'NIST CSF 2.0',
    region: 'US',
    sub: 'New "Govern" function — de facto baseline',
    color: '#5ecfa9', rgb: '94,207,169',
  },
  {
    id: 'SG OT Masterplan',
    region: 'Singapore',
    sub: 'Regional CII mandate — ASEAN model',
    color: '#C86DD7', rgb: '200,109,215',
  },
  {
    id: 'NERC CIP',
    region: 'US',
    sub: 'Critical infrastructure protection',
    color: '#ff7a7a', rgb: '255,122,122',
  },
  {
    id: 'NIST SP 800-82',
    region: 'Global',
    sub: 'OT-specific control baselines · 300+ controls',
    color: '#17EAD9', rgb: '23,234,217',
  },
  {
    id: 'CISA CPG 2.0',
    region: 'US',
    sub: 'Unified IT/OT cybersecurity performance goals',
    color: '#6078EA', rgb: '96,120,234',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

const textVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Compliance() {
  return (
    <section id="compliance">



      {/* ── Left: bento grid panel ── */}
      <div className="compliance-panel">
        {/* Panel header bar */}
        <div className="compliance-panel-bar">
          <div className="compliance-panel-dots">
            <span /><span /><span />
          </div>
          <span className="compliance-panel-title">
            <ShieldCheck size={11} /> Frameworks · Active Coverage
          </span>
          <span className="compliance-panel-badge">8 / 8</span>
        </div>

        {/* Bento grid */}
        <div className="compliance-bento">
          {frameworks.map((f, i) => (
            <motion.div
              key={i}
              className="compliance-fw-card"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              style={{ '--fw-color': f.color, '--fw-rgb': f.rgb }}
            >
              <div className="compliance-fw-top">
                <span className="compliance-fw-region">{f.region}</span>
                <span className="compliance-fw-pulse" />
              </div>
              <div className="compliance-fw-name">{f.id}</div>
              <div className="compliance-fw-sub">{f.sub}</div>
              <div className="compliance-fw-bar" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Right: text ── */}
      <div className="compliance-right">
        <motion.div className="section-label" custom={0} variants={textVariants}
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <ClipboardCheck size={12} /> Compliance
        </motion.div>
        <motion.h2 className="section-title split-title" custom={1} variants={textVariants}
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          Audit-ready,<br /><em>always.</em>
        </motion.h2>
        <motion.p className="section-body" custom={2} variants={textVariants}
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          A global wave of regulation now mandates risk governance, vulnerability handling,
          and compliance documentation. FlowFort maps every decision to the frameworks that
          matter — including Malaysia&apos;s Act 854, NIS2, and IEC 62443 —
          generating evidence as a byproduct of normal operations.
        </motion.p>

        {/* Stat pills */}
        <motion.div className="compliance-stats-row" custom={3} variants={textVariants}
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          {[
            { val: '8',    label: 'Frameworks mapped' },
            { val: '100%', label: 'Auto-generated evidence' },
            { val: '<1hr', label: 'Audit prep time' },
          ].map((s, i) => (
            <div key={i} className="compliance-stat-pill">
              <span className="compliance-stat-val">{s.val}</span>
              <span className="compliance-stat-label">{s.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div style={{ marginTop: '2rem' }} custom={4} variants={textVariants}
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.03 }}>
          <a href="#cta" className="btn btn-primary">
            See Compliance Demo <ArrowRight size={15} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
