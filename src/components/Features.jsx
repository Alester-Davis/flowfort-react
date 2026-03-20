import { LayoutGrid, Cpu, ShieldCheck, Activity, BookOpenCheck, ScanSearch, Radar, MapPinned } from 'lucide-react';
import { motion } from 'framer-motion';

const headerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const features = [
  { icon: <Cpu size={20} />, title: 'OT Patch Intelligence', body: 'OEM qualification tracking, configurable priority scoring (Threat Intel × Business Impact × Process Impact × Patch Level × Exposure), multi-step approval workflows, and installation tracking — not just patch distribution.', tag: 'Patch Management', wide: true },
  { icon: <ShieldCheck size={20} />, title: 'OEM-Qualified Patches', body: 'Every patch validated by the original equipment manufacturer before deployment. Knowledge Base Verification captures vendor, product, version, OS compatibility, and evidence for every qualified patch.', tag: 'Patch Intelligence' },
  { icon: <Activity size={20} />, title: 'Risk Governance', body: 'Editable 5×5 risk matrix, formal treatment strategies (Avoid / Accept / Transfer / Mitigate), named ownership, multi-step approval routing, and kanban-style action tracking — calibrated to your organization\'s risk appetite.', tag: 'Risk Management' },
  { icon: <BookOpenCheck size={20} />, title: 'Full Audit Trail', body: 'Every patch, every approval, every exception — automatically logged. Compliance evidence generated as a byproduct of normal operations. Demonstrate IEC 62443, NIS2, and Act 854 compliance in minutes, not weeks.', tag: 'Compliance Reporting' },
  { icon: <MapPinned size={20} />, title: 'Location-Aware Asset Modeling', body: 'CAD-style floor plan editor with IEC 62443 zone and conduit designations, rack diagrams, and dependency maps. Know the building, floor, rack, and safety zone — not just the IP address.', tag: 'Physical Context' },
  { icon: <Radar size={20} />, title: 'Threat Intelligence', body: 'Real-time OT-specific threat feeds mapped to your asset inventory. Know which CVEs are actively exploited in industrial environments — and which of your assets are exposed.', tag: 'Threat Detection' },
];

export default function Features() {
  return (
    <section id="features">
      <div className="section-orb orb-teal" style={{ top: '-80px', left: '-180px' }} />
      <div className="features-header">
        <motion.div
          className="section-label"
          custom={0}
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <LayoutGrid size={12} /> The Platform
        </motion.div>
        <motion.h2
          className="section-title split-title"
          custom={1}
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          Every layer of OT security,<br /><span className="grad">unified.</span>
        </motion.h2>
        <motion.p
          className="section-body"
          custom={2}
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          style={{ margin: '0 auto' }}
        >
          FlowFort sits above your detection tools — absorbing their outputs and adding the
          governance layer that turns alerts into defensible decisions.
        </motion.p>
      </div>
      <div className="features-grid">
        {features.map((f, i) => (
          <motion.div
            className={`feature-card${f.wide ? ' wide' : ''}`}
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <div className="feature-card-icon">{f.icon}</div>
            <div className="feature-card-title">{f.title}</div>
            <div className="feature-card-body">{f.body}</div>
            <div className="feature-card-tag">{f.tag}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
