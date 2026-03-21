import { motion } from 'framer-motion';
import LogoFull from './LogoFull';

const LINKS = [
  {
    heading: 'Platform',
    items: [
      { label: 'Features',      href: '#features' },
      { label: 'Use Cases',     href: '#scenarios' },
      { label: 'Compliance',    href: '#compliance' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'The Problem',   href: '#problem-section' },
      { label: 'How It Works',  href: '#workflow' },
      { label: 'Contact Us',    href: '#contact' },
      { label: 'Request Demo',  href: '#cta' },
    ],

  },
];

const ease = [0.22, 1, 0.36, 1];

export default function Footer() {
  return (
    <footer className="ft-root">
      <div className="ft-inner">

        {/* ── Top row ── */}
        <motion.div
          className="ft-top"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease }}
        >
          {/* Brand */}
          <div className="ft-brand">
            <a href="#" className="ft-logo-link">
              <LogoFull height={22} />
            </a>
            <p className="ft-tagline">
              The OT Cyber Operations Control Plane —<br />
              patch, govern, and prove compliance without disrupting production.
            </p>
          </div>

          {/* Link columns */}
          <div className="ft-cols">
            {LINKS.map((col) => (
              <div className="ft-col" key={col.heading}>
                <span className="ft-col-heading">{col.heading}</span>
                <ul className="ft-col-list">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} className="ft-link">{item.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Divider ── */}
        <div className="ft-divider" />

        {/* ── Bottom bar ── */}
        <div className="ft-bottom">
          <span className="ft-copy">&copy; 2026 Secure Plex Sdn. Bhd. All rights reserved.</span>
          <span className="ft-mono">Securing OT. Intelligently.</span>
        </div>

      </div>
    </footer>
  );
}
