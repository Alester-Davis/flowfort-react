import { AlertTriangle, ShieldX, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const problems = [
  {
    icon: <ShieldX size={20} />,
    colorClass: 'red',
    severity: 'Critical Gap',
    title: 'The Patch Governance Gap',
    body: 'OEM qualification is required before any OT patch deploys — a process that can take months. Detection tools flag missing patches but cannot manage the qualification, approval, scheduling, and documentation to deploy them safely.',
    accentColor: '#ff6b6b',
    accentRgb: '255,95,95',
    num: '01',
  },
  {
    icon: <Users size={20} />,
    colorClass: 'orange',
    severity: 'Governance Gap',
    title: 'The Risk Ownership Gap',
    body: 'Detection dashboards show risk scores but provide no formal risk register, named owners, or documented treatment decisions. When the board asks "What is our OT risk posture?" — the answer is a spreadsheet.',
    accentColor: '#fab285',
    accentRgb: '250,178,133',
    num: '02',
  },
  {
    icon: <MapPin size={20} />,
    colorClass: 'muted',
    severity: 'Operational Gap',
    title: 'The Physical Context Gap',
    body: "Network topology maps show logical relationships — IP addresses and protocols. They don't show which building, floor, rack, or safety zone an asset is in. During an incident, you need a physical address — not a subnet.",
    accentColor: '#7b8ff7',
    accentRgb: '96,120,234',
    num: '03',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Problem() {
  return (
    <section id="problem-section" className="problem-section">



      {/* Header */}
      <div className="problem-section-header">
        <motion.div
          className="section-label"
          custom={0}
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          <AlertTriangle size={12} /> The Problem
        </motion.div>
        <motion.h2
          className="section-title"
          custom={1}
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          The governance gap is<br /><em>wider than you think.</em>
        </motion.h2>
        <motion.p
          className="section-body problem-section-body"
          custom={2}
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          Detection platforms solved visibility. The next challenge is governance —
          turning what you see into documented decisions regulators and boards can trust.
        </motion.p>
      </div>

      {/* Cards row */}
      <motion.div
        className="problem-cards-row"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
      >
        {problems.map((p, i) => (
          <motion.div
            key={i}
            className={`prob-card-flat severity-${p.colorClass}`}
            variants={cardVariants}
            style={{ '--accent': p.accentColor, '--accent-rgb': p.accentRgb }}
          >
            {/* Top row: icon + severity chip */}
            <div className="prob-flat-top">
              <div className="prob-flat-icon">{p.icon}</div>
              <div className="prob-flat-num">{p.num}</div>
            </div>

            {/* Severity chip */}
            <div className="prob-flat-severity">{p.severity}</div>

            {/* Title */}
            <h3 className="prob-flat-title">{p.title}</h3>

            {/* Divider */}
            <div className="prob-flat-divider" />

            {/* Body */}
            <p className="prob-flat-body">{p.body}</p>

            {/* Bottom accent bar */}
            <div className="prob-flat-bar" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
