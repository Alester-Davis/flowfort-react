import { useEffect, useRef, useCallback, useState } from 'react';
import useFrameSequence from './hooks/useFrameSequence';
import useScrollProgress from './hooks/useScrollProgress';

import ParticleCanvas from './components/ParticleCanvas';
import CursorGlow from './components/CursorGlow';
import Navbar from './components/Navbar';
import FrameLoader from './components/FrameLoader';
import HeroSection from './components/HeroSection';
import Stats from './components/Stats';
import TrustedBy from './components/TrustedBy';
import Problem from './components/Problem';
import Workflow from './components/Workflow';
import Features from './components/Features';
import Scenarios from './components/Scenarios';
import Compliance from './components/Compliance';
import GlobalSites from './components/GlobalSites';
import CTA from './components/CTA';
import Contact from './components/Contact';
import Footer from './components/Footer';

function scrambleText(el, finalText, duration, onDone) {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%$!?';
  let frame = 0;
  const totalFrames = Math.floor(duration / 40);
  const lockAt = (idx) => Math.floor((idx / finalText.length) * totalFrames * 0.75);
  const id = setInterval(() => {
    el.textContent = finalText
      .split('')
      .map((ch, i) => {
        if (ch === '.' || ch === '%') return ch;
        if (frame >= lockAt(i)) return ch;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');
    frame++;
    if (frame > totalFrames) {
      clearInterval(id);
      el.textContent = finalText;
      if (onDone) onDone();
    }
  }, 40);
}


export default function App() {
  const canvasRef = useRef(null);
  const spacerRef = useRef(null);
  const scrambleFired = useRef(false);

  // Navbar state — updated less frequently (only on threshold changes)
  const [navState, setNavState] = useState({ pastHero: false, scrolled: false });

  const { subscribe, notifyProgress } = useScrollProgress(spacerRef);
  const { ready, loadPct } = useFrameSequence(canvasRef, spacerRef, notifyProgress);

  // Update navbar state only when pastHero/scrolled thresholds change
  useEffect(() => {
    if (!subscribe) return;
    let lastPast = false;
    let lastScrolled = false;

    return subscribe((p, past) => {
      const scrolled = past && p >= 1;
      if (past !== lastPast || scrolled !== lastScrolled) {
        lastPast = past;
        lastScrolled = scrolled;
        setNavState({ pastHero: past, scrolled });
      }
    });
  }, [subscribe]);

  // Scramble effect after loader done
  useEffect(() => {
    if (!ready || scrambleFired.current) return;
    scrambleFired.current = true;
    const timer = setTimeout(() => {
      const el = document.getElementById('scrambleTarget');
      if (el) scrambleText(el, '2000%', 1400);
    }, 600);
    return () => clearTimeout(timer);
  }, [ready]);

  // Reveal observer for any remaining .reveal elements (e.g. wipe-reveal)
  useEffect(() => {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('wipe-reveal')) {
              entry.target.classList.add('in');
            }
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

    return () => revealObs.disconnect();
  }, []);

  // 3D card tilt
  const setupCardTilt = useCallback(() => {
    const cards = document.querySelectorAll('.feature-card, .problem-card, .hw');
    const handlers = [];

    cards.forEach((card) => {
      const onEnter = () => {
        card.style.transition =
          'transform 0.15s ease, border-color 0.35s, box-shadow 0.35s';
      };
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rx = ((y - cy) / cy) * -8;
        const ry = ((x - cx) / cx) * 8;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.015)`;
      };
      const onLeave = () => {
        card.style.transition =
          'transform 0.55s cubic-bezier(0.16,1,0.3,1), border-color 0.35s, box-shadow 0.35s';
        card.style.transform =
          'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
      };

      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      handlers.push({ card, onEnter, onMove, onLeave });
    });

    return () => {
      handlers.forEach(({ card, onEnter, onMove, onLeave }) => {
        card.removeEventListener('mouseenter', onEnter);
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  useEffect(() => {
    return setupCardTilt();
  }, [setupCardTilt]);

  return (
    <>
      <ParticleCanvas subscribe={subscribe} />
      <CursorGlow />
      <Navbar pastHero={navState.pastHero} scrolled={navState.scrolled} spacerRef={spacerRef} />
      <FrameLoader ready={ready} loadPct={loadPct} />
      <HeroSection subscribe={subscribe} canvasRef={canvasRef} spacerRef={spacerRef} />

      {/* Spacer creates real scroll height for the frame sequence — hidden until ready to prevent scrollbar flash */}
      <div id="hero-spacer" ref={spacerRef} style={ready ? undefined : { height: 0 }} />

      <div id="page-body">
        <Stats />
        <TrustedBy />
        <div className="glow-line" />
        <Problem />
        <Workflow />
        <div className="glow-line" />
        <Features />
        <div className="glow-line" />
        <Scenarios />
        <div className="glow-line" />
        <Compliance />
        <div className="glow-line" />
        <GlobalSites />
        <CTA />
        <Contact />
        <div className="glow-line" />
        <Footer />
      </div>
    </>
  );
}
