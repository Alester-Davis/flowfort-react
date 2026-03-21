import { useCallback, useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import LogoFull from './LogoFull';

const NAV_SECTIONS = ['problem-section', 'workflow', 'features', 'scenarios', 'compliance', 'global-sites', 'cta', 'contact'];

export default function Navbar({ pastHero, scrolled, spacerRef }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navClass = [
    pastHero && scrolled ? 'scrolled' : '',
    pastHero ? 'page-active' : '',
  ].filter(Boolean).join(' ');

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers = [];
    const sectionMap = new Map(); // section id → is intersecting

    NAV_SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          sectionMap.set(id, entry.isIntersecting);
          // Set active to the first intersecting section in order
          const active = NAV_SECTIONS.find(s => sectionMap.get(s)) || '';
          setActiveSection(active);
        },
        { threshold: 0, rootMargin: '-64px 0px -50% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const handleLinkClick = useCallback((e) => {
    const href = e.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    setMenuOpen(false);

    const targetEl = document.querySelector(href);
    if (!targetEl) return;

    const spacer = spacerRef?.current;
    const spacerEnd = spacer ? spacer.offsetTop + spacer.offsetHeight : 0;

    if (window.scrollY < spacerEnd) {
      // Currently in frame section — jump past spacer first, then smooth scroll
      window.scrollTo(0, spacerEnd);
      setTimeout(() => targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    } else {
      // Already in page body — smooth scroll directly
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [spacerRef]);

  const linkClass = (section) =>
    `nav-link${activeSection === section ? ' active' : ''}`;

  return (
    <>
      <nav id="nav" className={navClass || undefined}>
        <a href="#" className="nav-logo">
          <LogoFull height={30} />
        </a>
        <ul className="nav-links">
          <li><a href="#problem-section" className={linkClass('problem-section')} onClick={handleLinkClick}>The Problem</a></li>
          <li><a href="#features"        className={linkClass('features')}        onClick={handleLinkClick}>Platform</a></li>
          <li><a href="#workflow"        className={linkClass('workflow')}        onClick={handleLinkClick}>How It Works</a></li>
          <li><a href="#scenarios"       className={linkClass('scenarios')}       onClick={handleLinkClick}>Use Cases</a></li>
          <li><a href="#compliance"      className={linkClass('compliance')}      onClick={handleLinkClick}>Compliance</a></li>
          <li><a href="#contact"         className={linkClass('contact')}         onClick={handleLinkClick}>Contact</a></li>
        </ul>
        <div className="nav-cta">
          <a href="#cta" className="btn btn-primary" onClick={handleLinkClick}>Request a Demo</a>
        </div>
        <button
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu-overlay${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <ul>
          <li><a href="#problem-section" className={linkClass('problem-section')} onClick={handleLinkClick}>The Problem</a></li>
          <li><a href="#features"        className={linkClass('features')}        onClick={handleLinkClick}>Platform</a></li>
          <li><a href="#workflow"        className={linkClass('workflow')}        onClick={handleLinkClick}>How It Works</a></li>
          <li><a href="#scenarios"       className={linkClass('scenarios')}       onClick={handleLinkClick}>Use Cases</a></li>
          <li><a href="#compliance"      className={linkClass('compliance')}      onClick={handleLinkClick}>Compliance</a></li>
          <li><a href="#contact"         className={linkClass('contact')}         onClick={handleLinkClick}>Contact</a></li>
        </ul>
        <div className="mobile-menu-cta">
          <a href="#cta" className="btn btn-primary" onClick={handleLinkClick}>Request a Demo</a>
        </div>
      </div>
    </>
  );
}
