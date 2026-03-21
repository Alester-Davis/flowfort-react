import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <div id="cta" style={{ position: 'relative', overflow: 'hidden' }}>


      <motion.div
        className="cta-card"
        initial={{ opacity: 0, y: 50, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.h2
          className="cta-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.5 }}
        >
          Other platforms tell you what&apos;s wrong.<br />
          <span className="grad">FlowFort helps you prove what you did about it.</span>
        </motion.h2>
        <motion.p
          className="cta-body"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12, duration: 0.5 }}
        >
          Industrial organizations across Southeast Asia use FlowFort to close the governance
          gap &mdash; automating patch qualification, risk documentation, and compliance evidence
          without disrupting production.
        </motion.p>
        <motion.div
          className="cta-actions"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <motion.a
            href="#"
            className="btn btn-primary btn-large"
            whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(44,126,104,0.4)' }}
            whileTap={{ scale: 0.97 }}
          >
            <ArrowRight size={15} />
            Request a Demo
          </motion.a>
          <motion.a
            href="#"
            className="btn btn-ghost btn-large"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Talk to Sales
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
}
