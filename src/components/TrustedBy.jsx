import { motion } from 'framer-motion';

const companies = [
  'PETRONAS',
  'MALAKOFF',
  'PETRONAS CARIGALI',
  'MALAKOFF POWER',
  'PETRONAS GAS',
  'MALAKOFF CORPORATION',
];

export default function TrustedBy() {
  const items = [...companies, ...companies];

  return (
    <motion.div
      id="trusted-by"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="trusted-label">Trusted by industry leaders</div>
      <div className="marquee-outer">
        <div className="marquee-track">
          {items.map((name, i) => (
            <span className="marquee-item" key={i}>
              {name} <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
