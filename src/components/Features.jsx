import { LayoutGrid, Cpu, ShieldCheck, Activity, BookOpenCheck, MapPinned, Radar } from 'lucide-react';
import { motion } from 'framer-motion';

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

const features = [
  {
    icon: <Cpu size={16} />,
    bgIcon: <Cpu size={72} />,
    title: 'OT Patch Intelligence',
    body: 'OEM qualification tracking, priority scoring, multi-step approval workflows and installation tracking.',
    tag: 'Patch Management',
    accent: '#17EAD9', accentRgb: '23,234,217',
  },
  {
    icon: <ShieldCheck size={16} />,
    bgIcon: <ShieldCheck size={72} />,
    title: 'OEM-Qualified Patches',
    body: 'Every patch validated by the original equipment manufacturer with full evidence capture before deployment.',
    tag: 'Patch Intelligence',
    accent: '#6078EA', accentRgb: '96,120,234',
  },
  {
    icon: <Activity size={16} />,
    bgIcon: <Activity size={72} />,
    title: 'Risk Governance',
    body: 'Editable 5×5 risk matrix, formal treatment strategies, named ownership and multi-step approval routing.',
    tag: 'Risk Management',
    accent: '#fab285', accentRgb: '250,178,133',
  },
  {
    icon: <BookOpenCheck size={16} />,
    bgIcon: <BookOpenCheck size={72} />,
    title: 'Full Audit Trail',
    body: 'Every patch, approval and exception automatically logged. IEC 62443, NIS2, Act 854 evidence in minutes.',
    tag: 'Compliance',
    accent: '#5ecfa9', accentRgb: '94,207,169',
  },
  {
    icon: <MapPinned size={16} />,
    bgIcon: <MapPinned size={72} />,
    title: 'Location-Aware Assets',
    body: 'Floor plan editor with IEC 62443 zones, rack diagrams and dependency maps — building to zone hierarchy.',
    tag: 'Physical Context',
    accent: '#C86DD7', accentRgb: '200,109,215',
  },
  {
    icon: <Radar size={16} />,
    bgIcon: <Radar size={72} />,
    title: 'Threat Intelligence',
    body: 'Real-time OT threat feeds mapped to your asset inventory — know which CVEs expose your systems.',
    tag: 'Threat Detection',
    accent: '#ff7a7a', accentRgb: '255,122,122',
  },
];

export default function Features() {
  return (
    <section id="features">



      <div className="features-header">
        <motion.div className="section-label" custom={0} variants={headerVariants}
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <LayoutGrid size={12} /> The Platform
        </motion.div>
        <motion.h2 className="section-title split-title" custom={1} variants={headerVariants}
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          Every layer of OT security,<br /><span className="grad">unified.</span>
        </motion.h2>
        <motion.p className="section-body" custom={2} variants={headerVariants}
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          style={{ margin: '0 auto' }}>
          FlowFort sits above your detection tools — absorbing their outputs and adding the
          governance layer that turns alerts into defensible decisions.
        </motion.p>
      </div>

      <div className="feat-compact-grid">
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="feat-compact-card"
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            style={{ '--accent': f.accent, '--accent-rgb': f.accentRgb }}
          >
            <div className="feat-compact-left" />
            <div className="feat-compact-inner">
              <div className="feat-compact-bg-icon">{f.bgIcon}</div>
              <div className="feat-compact-shimmer" />
              <div className="feat-compact-head">
                <span className="feat-compact-icon">{f.icon}</span>
                <span className="feat-compact-title">{f.title}</span>
              </div>
              <p className="feat-compact-body">{f.body}</p>
              <span className="feat-compact-tag">{f.tag}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
