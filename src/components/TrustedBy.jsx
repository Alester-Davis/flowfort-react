import { motion } from 'framer-motion';

const partners = [
  {
    name: 'Air Selangor',
    icon: 'https://www.airselangor.com/icon.ico?a0b34959406e61eb',
    wordmark: 'AIR SELANGOR',
  },
  {
    name: 'PETRONAS',
    icon: 'https://www.petronas.com/favicon.png',
    wordmark: 'PETRONAS',
  },
  {
    name: 'Malakoff',
    icon: 'https://www.malakoff.com.my/wp-content/uploads/2024/12/cropped-favicon.png',
    wordmark: 'MALAKOFF',
  },
];

function PartnerCard({ partner }) {
  return (
    <div className="trusted-card">
      <img src={partner.icon} alt={partner.name} className="trusted-card-icon" />
      <span className="trusted-card-name">{partner.wordmark}</span>
    </div>
  );
}

export default function TrustedBy() {
  const items = [...partners, ...partners, ...partners, ...partners];

  return (
    <motion.div
      id="trusted-by"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="trusted-label">Trusted by industry leaders</div>
      <div className="marquee-outer">
        <div className="marquee-track">
          {items.map((partner, i) => (
            <PartnerCard key={i} partner={partner} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
