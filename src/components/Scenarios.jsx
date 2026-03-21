import { useState } from 'react';
import { FlaskConical, XCircle, CheckCircle2, AlertTriangle, MapPin, Shield, GitBranch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const scenarios = [
  {
    number: '01',
    icon: <AlertTriangle size={15} />,
    tag: 'Incident Response',
    title: 'The False Positive That Wastes 48 Hours',
    context: 'Detection platform flags repeated failed logins on a DCS controller at 2:00 AM. SOC classifies it as a brute-force attack and mobilises the IR team.',
    without: '48 hours of IR mobilization — before discovering a maintenance engineer was performing a scheduled firmware upgrade during an approved window.',
    with: 'The analyst cross-references the asset and immediately sees the approved maintenance window (1:00–5:00 AM), the linked firmware upgrade, and the assigned engineer. Closed in minutes.',
    color: '#ff7a7a', rgb: '255,122,122',
  },
  {
    number: '02',
    icon: <MapPin size={15} />,
    tag: 'Physical Context',
    title: "The Incident Where You Can't Find the Asset",
    context: 'Anomalous Modbus traffic from a controller — possible command injection. The security team has an IP address and nothing else.',
    without: "Response delayed hours. The OT lead is on leave. The site manager thinks it's in Building 3 — or Building 5. Team manually traces connections and walks the plant floor.",
    with: 'Analyst instantly sees: Central Control Building, Server Room, Zone 1, Rack 3. Asset owner listed. Dependency map shows two upstream sensors and one downstream HMI. Informed isolation decision in minutes.',
    color: '#6078EA', rgb: '96,120,234',
  },
  {
    number: '03',
    icon: <Shield size={15} />,
    tag: 'Patch Management',
    title: "The Vulnerability That's Already Mitigated",
    context: 'A critical CVE affects three PLCs. Security team treats all three as equally urgent, potentially disrupting operations for emergency patching.',
    without: 'Emergency patching disrupts operations — but two PLCs are already behind segmentation blocking the exploit vector, and the third has a patch queued for next week\'s window.',
    with: 'Vulnerability dashboard shows zone designations, current patch status, and linked maintenance plans. Two have documented compensating controls; one has an approved patch request with OEM qualification complete.',
    color: '#17EAD9', rgb: '23,234,217',
  },
  {
    number: '04',
    icon: <GitBranch size={15} />,
    tag: 'Dependency Mapping',
    title: 'The Cascading Failure Nobody Predicted',
    context: 'Ransomware encrypts a historian server. Response focuses on that server — but nobody documented its downstream dependencies.',
    without: 'Isolating the historian kills three HMI displays. Operators lose visibility into tank levels and pressure readings, triggering an emergency shutdown worth hundreds of thousands in downtime.',
    with: 'Dependency map surfaces all downstream assets before isolation. IR team coordinates with operations to switch to manual monitoring for specific process variables, preventing the cascade entirely.',
    color: '#C86DD7', rgb: '200,109,215',
  },
];

export default function Scenarios() {
  const [active, setActive] = useState(0);
  const s = scenarios[active];

  return (
    <section id="scenarios">
      {/* Header */}
      <div className="scenarios-header">
        <motion.div className="section-label" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}>
          <FlaskConical size={12} /> In Practice
        </motion.div>
        <motion.h2 className="section-title split-title" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.08, duration: 0.35, ease: [0.22,1,0.36,1] }}>
          Four scenarios that change<br /><span className="grad">how you respond.</span>
        </motion.h2>
        <motion.p className="section-body" style={{ margin: '0 auto' }} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.06, duration: 0.5, ease: [0.22,1,0.36,1] }}>
          Detection tools generate alerts. Without operational context, every alert looks the same.
          FlowFort transforms alerts into informed decisions.
        </motion.p>
      </div>

      {/* Interactive layout */}
      <motion.div className="sc-layout" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }} transition={{ delay: 0.08, duration: 0.4, ease: [0.22,1,0.36,1] }}>

        {/* Left: tab list */}
        <div className="sc-tabs">
          {scenarios.map((sc, i) => (
            <button key={i} className={`sc-tab${active === i ? ' active' : ''}`}
              onClick={() => setActive(i)}
              style={{ '--sc-color': sc.color, '--sc-rgb': sc.rgb }}>
              <div className="sc-tab-top">
                <span className="sc-tab-icon">{sc.icon}</span>
                <span className="sc-tab-num">{sc.number}</span>
              </div>
              <div className="sc-tab-tag">{sc.tag}</div>
              <div className="sc-tab-title">{sc.title}</div>
              {active === i && <div className="sc-tab-bar" />}
            </button>
          ))}
        </div>

        {/* Right: detail panel */}
        <div className="sc-panel" style={{ '--sc-color': s.color, '--sc-rgb': s.rgb }}>
          <AnimatePresence mode="wait">
            <motion.div key={active} className="sc-panel-inner"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}>

              {/* Panel header */}
              <div className="sc-panel-head">
                <span className="sc-panel-tag">{s.tag}</span>
                <span className="sc-panel-num">{s.number}</span>
              </div>
              <h3 className="sc-panel-title">{s.title}</h3>

              {/* Context */}
              <div className="sc-context-box">
                <span className="sc-context-label">Scenario</span>
                <p className="sc-context-text">{s.context}</p>
              </div>

              {/* Before / After split */}
              <div className="sc-split">
                <div className="sc-split-col bad">
                  <div className="sc-split-label">
                    <XCircle size={12} /> Without FlowFort
                  </div>
                  <p className="sc-split-body">{s.without}</p>
                </div>
                <div className="sc-split-divider" />
                <div className="sc-split-col good">
                  <div className="sc-split-label">
                    <CheckCircle2 size={12} /> With FlowFort
                  </div>
                  <p className="sc-split-body">{s.with}</p>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Accent glow */}
          <div className="sc-panel-glow" />
        </div>
      </motion.div>
    </section>
  );
}
