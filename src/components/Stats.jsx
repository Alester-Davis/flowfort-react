import { useEffect, useRef } from 'react';
import { TrendingUp, Wrench, Clock, UserCog } from 'lucide-react';
import { motion } from 'framer-motion';

function easeOutExpo(t) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.07,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Stats() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const counters = container.querySelectorAll('.stat-number[data-target]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.querySelector('span')?.textContent || '';
        const delay = i * 200;
        const dur = 2200;
        setTimeout(() => {
          el.classList.add('counting');
          const start = performance.now();
          (function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            const v = Math.round(easeOutExpo(p) * target);
            el.innerHTML = v.toLocaleString() + '<span>' + suffix + '</span>';
            if (p < 1) {
              requestAnimationFrame(tick);
            } else {
              setTimeout(() => { el.classList.remove('counting'); }, 1800);
            }
          })(performance.now());
        }, delay);
        observer.unobserve(el);
      });
    }, { threshold: 0.4 });

    counters.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: <TrendingUp size={16} />, target: '2000', suffix: '%', label: 'Increase in OT cyber attacks over the last 5 years' },
    { icon: <Wrench size={16} />, target: '85', suffix: '%', label: 'Of organizations don\'t conduct regular OT patching', source: 'TXOne / Frost & Sullivan 2024' },
    { icon: <Clock size={16} />, target: '69', suffix: ' days', label: 'Average time to apply an OT patch after discovery', source: 'Fortinet 2024' },
    { icon: <UserCog size={16} />, target: '52', suffix: '%', label: 'Of organizations now assign OT security to the CISO', source: 'Fortinet 2025' },
  ];

  return (
    <div id="stats" ref={containerRef}>
      <div className="stats-inner">
        {stats.map((s, i) => (
          <motion.div
            className="stat-item"
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="stat-icon">{s.icon}</div>
            {s.target ? (
              <div className="stat-number" data-target={s.target}>0<span>{s.suffix}</span></div>
            ) : (
              <div className="stat-number"><span>{s.prefix}</span>{s.value}<span>{s.suffix}</span></div>
            )}
            <div className="stat-label">{s.label}</div>
            {s.source && <div className="stat-source">{s.source}</div>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
