import { useEffect, useRef } from 'react';

const COUNT = 70;
const CONNECT = 140;
const REPEL = 100;

export default function ParticleCanvas({ subscribe }) {
  const canvasRef = useRef(null);
  const pausedRef = useRef(true); // Start paused — hero covers particles

  // Pause particles while hero is visible (pastHero=false means hero covers everything)
  useEffect(() => {
    if (!subscribe) return;
    return subscribe((_p, pastHero) => {
      pausedRef.current = !pastHero;
    });
  }, [subscribe]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    const mouse = { x: -9999, y: -9999 };
    let particles;
    let animId;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function initParticles() {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.2 + 0.4,
      }));
    }

    function draw() {
      animId = requestAnimationFrame(draw);

      // Skip all work when hero covers the particle canvas
      if (pausedRef.current) return;

      ctx.clearRect(0, 0, W, H);
      // Connections
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(44,126,104,${(1 - d / CONNECT) * 0.3})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      // Dots
      particles.forEach((p) => {
        // Mouse repel
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < REPEL) {
          const force = ((REPEL - md) / REPEL) * 0.8;
          p.vx += (mdx / md) * force;
          p.vy += (mdy / md) * force;
        }
        // Speed limit
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 1.8) {
          p.vx = (p.vx / spd) * 1.8;
          p.vy = (p.vy / spd) * 1.8;
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(77,161,138,0.7)';
        ctx.fill();
      });
    }

    function onMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    resize();
    initParticles();
    draw();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return <canvas id="particleCanvas" ref={canvasRef} />;
}
