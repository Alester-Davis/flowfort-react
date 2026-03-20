import { FlaskConical, XCircle, CheckCircle2 } from 'lucide-react';
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
      delay: i * 0.12,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const scenarios = [
  {
    number: '01',
    title: 'The False Positive That Wastes 48 Hours',
    context: 'Detection platform flags repeated failed logins on a DCS controller at 2:00 AM. SOC classifies it as a brute-force attack.',
    without: '48 hours of IR mobilization — before discovering a maintenance engineer was performing a scheduled firmware upgrade during an approved window.',
    with: 'The analyst cross-references the asset and immediately sees the approved maintenance window (1:00–5:00 AM), the linked firmware upgrade, and the assigned engineer. Closed in minutes.',
  },
  {
    number: '02',
    title: 'The Incident Where You Can\'t Find the Asset',
    context: 'Anomalous Modbus traffic from a controller — possible command injection. The security team has an IP address.',
    without: 'Response delayed hours. The OT engineering lead is on leave. The site manager thinks it\'s in Building 3 — or Building 5. Team manually traces connections and walks the plant floor.',
    with: 'Analyst instantly sees: Central Control Building, Server Room, Zone 1, Rack 3. Asset owner listed. Dependency map shows two upstream sensors and one downstream HMI. Informed isolation decision in minutes.',
  },
  {
    number: '03',
    title: 'The Vulnerability That\'s Already Mitigated',
    context: 'A critical CVE affects three PLCs. Security team treats all three as equally urgent, potentially disrupting operations for emergency patching.',
    without: 'Emergency patching disrupts operations — but two PLCs are already behind segmentation blocking the exploit vector, and the third has a patch queued for next week\'s window.',
    with: 'Vulnerability dashboard shows zone designations, current patch status, and linked maintenance plans. Two have documented compensating controls; one has an approved patch request with OEM qualification complete.',
  },
  {
    number: '04',
    title: 'The Cascading Failure Nobody Predicted',
    context: 'Ransomware encrypts a historian server. Response focuses on that server — but nobody documented its downstream dependencies.',
    without: 'Isolating the historian kills three HMI displays. Operators lose visibility into tank levels and pressure readings, triggering an emergency shutdown worth hundreds of thousands in downtime.',
    with: 'Dependency map surfaces all downstream assets before isolation. IR team coordinates with operations to switch to manual monitoring for specific process variables, preventing the cascade entirely.',
  },
];

export default function Scenarios() {
  return (
    <section id="scenarios">
      <div className="section-orb orb-purple" style={{ top: '-60px', left: '-120px' }} />
      <div className="scenarios-header">
        <motion.div
          className="section-label"
          custom={0}
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <FlaskConical size={12} /> In Practice
        </motion.div>
        <motion.h2
          className="section-title split-title"
          custom={1}
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          Four scenarios that change<br /><span className="grad">how you respond.</span>
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
          Detection tools generate alerts. Without operational context, every alert looks the same.
          FlowFort transforms alerts into informed decisions.
        </motion.p>
      </div>

      <div className="scenarios-grid">
        {scenarios.map((s, i) => (
          <motion.div
            className="scenario-card"
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <div className="scenario-number">{s.number}</div>
            <div className="scenario-title">{s.title}</div>
            <div className="scenario-context">{s.context}</div>
            <div className="scenario-row without">
              <XCircle size={13} className="scenario-icon-bad" />
              <span><strong>Without FlowFort:</strong> {s.without}</span>
            </div>
            <div className="scenario-row with">
              <CheckCircle2 size={13} className="scenario-icon-good" />
              <span><strong>With FlowFort:</strong> {s.with}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
