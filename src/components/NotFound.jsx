import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LogoFull from './LogoFull';

export default function NotFound() {
  const navigate = useNavigate();

  // Remove loading class in case we land here directly
  useEffect(() => {
    document.documentElement.classList.remove('loading');
  }, []);

  return (
    <div className="nf-root">
      <div className="nf-bg" />
      <motion.div
        className="nf-card"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <a href="/" className="nf-logo">
          <LogoFull height={28} />
        </a>
        <div className="nf-code">404</div>
        <h1 className="nf-title">Page not found</h1>
        <p className="nf-body">
          This route doesn't exist. You may have followed a broken link
          or typed the address incorrectly.
        </p>
        <button className="btn btn-primary nf-btn" onClick={() => navigate('/')}>
          Back to home
        </button>
      </motion.div>
    </div>
  );
}
