import { motion } from 'framer-motion';
import LogoIcon from './LogoIcon';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="footer-logo">
        <LogoIcon height={16} />
        FlowFort by Secure Plex
      </div>
      <div className="footer-tagline">Securing OT. Intelligently.</div>
      <div className="footer-copy">&copy; 2026 Secure Plex. All rights reserved.</div>
    </motion.footer>
  );
}
