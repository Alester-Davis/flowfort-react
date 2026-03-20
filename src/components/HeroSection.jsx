import { useEffect, useRef, useCallback } from 'react';
import { CheckCircle2, Clock, ArrowRight } from 'lucide-react';

function band(p, start, end) {
  return Math.min(1, Math.max(0, (p - start) / (end - start)));
}

export default function HeroSection({ subscribe, canvasRef, spacerRef }) {
  const heroRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const widgetsRef = useRef(null);
  const badgeRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const actionsRef = useRef(null);
  const scrollHintRef = useRef(null);
  const isDesktop = useRef(window.innerWidth > 768);

  // Update isDesktop on resize
  useEffect(() => {
    const onResize = () => { isDesktop.current = window.innerWidth > 768; };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Subscribe to scroll progress and update DOM directly — no React re-renders
  useEffect(() => {
    if (!subscribe) return;

    // Track previous values to skip unchanged DOM writes
    let prevBadgeV = -1, prevHlV = -1, prevSubV = -1, prevActV = -1, prevWidV = -1;
    let prevHeroOpacity = -1, prevScrollHint = -1, prevHeroDone = false;

    return subscribe((p) => {
      const hero = heroRef.current;
      if (!hero) return;

      const contentOut = 1 - band(p, 0.72, 0.88);
      const badgeV = band(p, 0.04, 0.13) * contentOut;
      const hlV = band(p, 0.10, 0.21) * contentOut;
      const subV = band(p, 0.19, 0.30) * contentOut;
      const actV = band(p, 0.27, 0.38) * contentOut;
      const widV = band(p, 0.44, 0.56) * contentOut;
      const scrollHintOpacity = Math.max(0, 1 - p * 14);

      const heroDone = p >= 1;
      const heroOpacity = p >= 0.95 ? (1 - band(p, 0.95, 1.0)) : 1;

      // Only write to DOM when values actually change (rounded to avoid sub-pixel churn)
      const rBadge = (badgeV * 100) | 0;
      const rHl = (hlV * 100) | 0;
      const rSub = (subV * 100) | 0;
      const rAct = (actV * 100) | 0;
      const rWid = (widV * 100) | 0;
      const rHero = (heroOpacity * 100) | 0;
      const rScroll = (scrollHintOpacity * 100) | 0;

      if (rHero !== prevHeroOpacity || heroDone !== prevHeroDone) {
        prevHeroOpacity = rHero;
        prevHeroDone = heroDone;
        hero.style.opacity = heroOpacity;
        hero.style.pointerEvents = heroDone ? 'none' : 'auto';
        hero.style.visibility = heroDone ? 'hidden' : 'visible';
      }

      if (rWid !== prevWidV && widgetsRef.current) {
        prevWidV = rWid;
        widgetsRef.current.style.opacity = widV;
      }

      if (rBadge !== prevBadgeV && badgeRef.current) {
        prevBadgeV = rBadge;
        badgeRef.current.style.opacity = badgeV;
        badgeRef.current.style.transform = `translateY(${(1 - badgeV) * 28}px)`;
      }
      if (rHl !== prevHlV && headlineRef.current) {
        prevHlV = rHl;
        headlineRef.current.style.opacity = hlV;
        headlineRef.current.style.transform = `translateY(${(1 - hlV) * 36}px)`;
      }
      if (rSub !== prevSubV && subRef.current) {
        prevSubV = rSub;
        subRef.current.style.opacity = subV;
        subRef.current.style.transform = `translateY(${(1 - subV) * 28}px)`;
      }
      if (rAct !== prevActV && actionsRef.current) {
        prevActV = rAct;
        actionsRef.current.style.opacity = actV;
        actionsRef.current.style.transform = `translateY(${(1 - actV) * 24}px)`;
      }
      if (rScroll !== prevScrollHint && scrollHintRef.current) {
        prevScrollHint = rScroll;
        scrollHintRef.current.style.opacity = scrollHintOpacity;
      }
    });
  }, [subscribe]);

  const handleLinkClick = useCallback((e) => {
    const href = e.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const spacer = spacerRef?.current;
    if (!spacer) return;
    const spacerEnd = spacer.offsetTop + spacer.offsetHeight;
    if (window.scrollY < spacerEnd) {
      e.preventDefault();
      const targetEl = document.querySelector(href);
      if (targetEl) {
        window.scrollTo(0, spacerEnd);
        setTimeout(() => targetEl.scrollIntoView({ behavior: 'smooth' }), 50);
      }
    }
  }, [spacerRef]);

  return (
    <div id="hero-section" ref={heroRef}>
      <canvas id="heroCanvas" ref={(el) => {
        canvasWrapRef.current = el;
        if (canvasRef) canvasRef.current = el;
      }} />
      <div className="hero-noise" />
      <div className="hero-overlay" />
      <div className="hero-grid" />

      {/* Floating 3D dashboard widgets */}
      <div className="hero-widgets" ref={widgetsRef} style={{ opacity: 0 }}>
        <div className="hw hw-threat">
          <div className="hw-label"><span className="hw-label-dot" /> Live Threat Feed</div>
          <div className="hw-number critical">247</div>
          <div className="hw-sub">Active CVEs in your sector</div>
        </div>
        <div className="hw hw-patch">
          <div className="hw-label"><span className="hw-label-dot green" /> Patch Queue</div>
          <div className="hw-row">
            <CheckCircle2 size={11} />
            <span><span className="hw-row-name">Siemens S7-300</span> — deployed</span>
          </div>
          <div className="hw-row pending">
            <Clock size={11} />
            <span><span className="hw-row-name">Allen-Bradley PLC</span> — queued</span>
          </div>
          <div className="hw-row">
            <CheckCircle2 size={11} />
            <span><span className="hw-row-name">Honeywell HMI</span> — deployed</span>
          </div>
        </div>
        <div className="hw hw-risk">
          <div className="hw-label"><span className="hw-label-dot green" /> Risk Score</div>
          <div className="hw-risk-ring">
            <div className="hw-risk-inner">2.1</div>
          </div>
          <div className="hw-sub" style={{ textAlign: 'center' }}>LOW — was 8.4 last month</div>
        </div>
      </div>

      <div className="hero-content">
        <div className="hero-badge" ref={badgeRef} style={{ opacity: 0 }}>
          <span className="hero-badge-dot" />
          <span className="hero-badge-text">OT Cyber Operations Control Plane</span>
        </div>
        <h1 className="hero-headline" ref={headlineRef} style={{ opacity: 0 }}>
          <em>FlowFort</em> is the missing layer<br />
          between detection and<br />
          <span className="dim">defensible decisions.</span>
        </h1>
        <p className="hero-sub" ref={subRef} style={{ opacity: 0 }}>
          <strong className="hero-sub-hl"><span id="scrambleTarget">85%</span></strong> of organizations don't patch OT regularly — and it takes{' '}
          <strong className="hero-sub-hl">69 days</strong> on average.
          FlowFort is the <strong className="hero-sub-hl">governance layer</strong> that turns what you see into what you can prove.
        </p>
        <div className="hero-actions" ref={actionsRef} style={{ opacity: 0 }}>
          <a href="#cta" className="btn btn-primary btn-large" onClick={handleLinkClick}>
            <ArrowRight size={15} />
            Request a Demo
          </a>
          <a href="#features" className="btn btn-ghost btn-large" onClick={handleLinkClick}>See the Platform</a>
        </div>
      </div>

      <div className="hero-scroll-hint" ref={scrollHintRef}>
        <div className="scroll-line" />
        Scroll
      </div>
    </div>
  );
}
