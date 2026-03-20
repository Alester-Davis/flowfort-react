import { ClipboardCheck, Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const items = [
  { text: 'IEC 62443-2-1:2024', sub: 'Industrial cybersecurity standard — updated 2024' },
  { text: 'Malaysia Cyber Security Act 2024', sub: 'Act 854 — 11 NCII sectors, 6-hour reporting' },
  { text: 'Singapore OT Masterplan 2024', sub: 'Regional CII mandate — ASEAN model' },
  { text: 'NIS2 Directive', sub: 'EU — up to €10M or 2% of global revenue' },
  { text: 'NIST CSF 2.0', sub: 'New "Govern" function — de facto baseline' },
  { text: 'NIST SP 800-82r3', sub: 'OT-specific control baselines, 300+ controls' },
  { text: 'NERC CIP', sub: 'Critical infrastructure protection' },
  { text: 'CISA CPG 2.0', sub: 'Unified IT/OT cybersecurity performance goals' },
];

const itemVariants = {
  hidden: { opacity: 0, x: -40, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const textVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Compliance() {
  return (
    <section id="compliance">
      <div className="section-orb orb-teal" style={{ bottom: '-100px', right: '-100px' }} />
      <div className="compliance-left">
        {items.map((item, i) => (
          <motion.div
            className="compliance-item"
            key={i}
            custom={i}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="compliance-check">
              <Check size={13} />
            </div>
            <div>
              <div className="compliance-item-text">{item.text}</div>
              <div className="compliance-item-sub">{item.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="compliance-right">
        <motion.div
          className="section-label"
          custom={0}
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <ClipboardCheck size={12} /> Compliance
        </motion.div>
        <motion.h2
          className="section-title split-title"
          custom={1}
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          Audit-ready,<br /><em>always.</em>
        </motion.h2>
        <motion.p
          className="section-body"
          custom={2}
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          A global wave of regulation now mandates risk governance, vulnerability handling,
          and compliance documentation. FlowFort maps every decision to the frameworks that
          matter &mdash; including Malaysia&apos;s Act 854, NIS2, and IEC 62443 &mdash;
          generating evidence as a byproduct of normal operations.
        </motion.p>
        <motion.div
          style={{ marginTop: '2rem' }}
          custom={3}
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.03 }}
        >
          <a href="#cta" className="btn btn-primary">
            See Compliance Demo
            <ArrowRight size={15} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
