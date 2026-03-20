import { AlertTriangle, ShieldX, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, x: 60, rotateY: -8 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const textVariants = {
  hidden: { opacity: 0, x: -40 },
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

const problems = [
  {
    icon: <ShieldX size={16} />,
    colorClass: 'red',
    title: 'The Patch Governance Gap',
    body: 'OEM qualification is required before any OT patch deploys — a process that can take months. Detection tools flag missing patches but cannot manage the qualification, approval, scheduling, and documentation to deploy them safely.',
  },
  {
    icon: <Users size={16} />,
    colorClass: 'orange',
    title: 'The Risk Ownership Gap',
    body: 'Detection dashboards show risk scores but provide no formal risk register, named owners, or documented treatment decisions. When the board asks "What is our OT risk posture?" — the answer is a spreadsheet.',
  },
  {
    icon: <MapPin size={16} />,
    colorClass: 'muted',
    title: 'The Physical Context Gap',
    body: 'Network topology maps show logical relationships — IP addresses and protocols. They don\'t show which building, floor, rack, or safety zone an asset is in. During an incident, you need a physical address — not a subnet.',
  },
];

export default function Problem() {
  return (
    <section id="problem">
      <div className="section-orb orb-purple" style={{ top: '-100px', right: '-150px' }} />
      <div className="problem-left">
        <motion.div
          className="section-label"
          custom={0}
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <AlertTriangle size={12} /> The Problem
        </motion.div>
        <motion.h2
          className="section-title split-title"
          custom={1}
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          The governance gap<br />is wider than <em>you think.</em>
        </motion.h2>
        <motion.p
          className="section-body"
          custom={2}
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          Detection platforms have solved the visibility problem. The next challenge
          is governance &mdash; translating what you see into documented decisions that
          regulators, boards, and operations teams can trust.
        </motion.p>
      </div>
      <div className="problem-right">
        {problems.map((p, i) => (
          <motion.div
            className="problem-card"
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className={`problem-icon ${p.colorClass}`}>{p.icon}</div>
            <div>
              <div className="problem-card-title">{p.title}</div>
              <div className="problem-card-body">{p.body}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
