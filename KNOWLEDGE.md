# FlowFort Landing Page — Knowledge Document

## What is FlowFort?

FlowFort is an **OT (Operational Technology) Cybersecurity Platform** built by Secure Plex. It is the first platform purpose-built for **OT patch management, risk management, and compliance** — eliminating manual workflows and reducing attack surface across industrial environments.

**Target audience:** Industrial organizations running PLCs, HMIs, SCADA systems, and other OT/ICS infrastructure.

---

## Business Problem it Solves

- OT cyber attacks are up **2000%** over the last 5 years
- **80%** of OT patching is still done manually today
- Average cost of a successful OT breach: **$3.4M**
- Legacy industrial systems cannot use standard IT patching tools — they require OEM-qualified patches, operational windows, and safety constraints

---

## Core Product Features

| Feature | Description |
|---|---|
| **Intelligent Patch Workflows** | Automated orchestration respecting OT operational windows, production schedules, and safety constraints |
| **OEM-Qualified Patches** | Every patch validated by the original equipment manufacturer |
| **Integrated Risk Management** | Continuous vulnerability assessment with real-time risk scoring |
| **Full Audit Trail** | Every patch, approval, and exception auto-logged for compliance |
| **OT Asset Inventory** | Passive network discovery — maps every PLC, HMI, SCADA, and field device |
| **Threat Intelligence** | Real-time OT-specific threat feeds mapped to your asset inventory |

---

## Compliance Standards Supported

- **IEC 62443** — Industrial cybersecurity standard
- **NERC CIP** — Critical infrastructure protection
- **NIS2 Directive** — EU network and information security
- **NIST SP 800-82** — Guide to ICS security
- **ISA/IEC 62443-2-3** — Patch management in the IACS environment

---

## Contact Details

- **Email:** hello@secure-plex.com
- **Phone:** +603-2242 4363
- **Address:** Level 6, Menara TH, Tower 2A, Avenue 5, The Horizon, Bangsar South, 59200, Kuala Lumpur

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| UI Components | MUI (Material UI) v5 — used for Contact form |
| Animations | Framer Motion (section reveals) + custom RAF loop (hero) |
| Icons | Lucide React |
| Styling | Plain CSS (index.css) with CSS custom properties |
| Fonts | Plus Jakarta Sans (Google Fonts) |
| Deployment | GitHub Pages — `https://alester-davis.github.io/flowfort/` |

---

## Architecture Overview

### Hero Section — Frame Sequence Animation

The hero is an **Apple-style scroll-driven video** made of **91 JPEG frames** played back as the user scrolls.

- Frames are stored in `public/frames/frame_0001.jpg` → `frame_0091.jpg`
- Loaded via `fetch` + `createImageBitmap()` with pre-scaling to display resolution (GPU-ready, cheap to draw)
- Drawn to a `<canvas>` element using a **single RAF loop** in `useFrameSequence.js`
- The canvas is `position: fixed`, full viewport. A `350vh` spacer (`#hero-spacer`) creates the scroll height
- Frame index = `scrollY / maxScroll * 90`, lerped at factor 0.3 to smooth burst draws on fast scroll
- Large jumps (>15%) snap immediately — no lag when re-entering the frames section

### Scroll Progress — Subscriber Pattern

`useScrollProgress.js` is a **passive hook** — no RAF loop of its own.

- Exposes `subscribe(fn)` — components register callbacks
- Exposes `notifyProgress(p, past)` — called by `useFrameSequence`'s RAF loop every tick
- Hero content (badge, headline, subtitle, buttons) updates via **direct DOM manipulation** (`element.style.opacity`) — zero React re-renders during scroll
- Navbar state (transparent vs solid) updates only when threshold changes — minimizes React renders

### `band(p, start, end)` Helper

Maps scroll progress `p` (0→1) into a 0→1 range between `start` and `end`. Used to stagger content appearance at specific scroll positions:

```js
band(p, 0.04, 0.13)  // badge fades in from 4% to 13% scroll
band(p, 0.10, 0.21)  // headline fades in from 10% to 21%
// ... etc
```

---

## Page Sections (in order)

1. **Hero** — Fixed canvas frame animation + badge, headline, subtitle, CTA buttons
2. **Stats** — 3 animated counters (2000%, 80%, $3.4M) with easeOutExpo counting animation
3. **TrustedBy** — Partner/client logo strip
4. **Problem** — Problem statement cards with 3D tilt hover effect
5. **Features** — 6-card grid of platform features
6. **Compliance** — Standards list (IEC 62443, NERC CIP, etc.) with animated checklist
7. **CTA** — Call to action block
8. **Contact** — MUI form (name, email, phone, interest dropdown, message) + contact details
9. **Footer** — Links and copyright

---

## File Structure

```
flowfort-react/
├── public/
│   └── frames/          # 91 JPEG frames (frame_0001.jpg → frame_0091.jpg)
├── src/
│   ├── App.jsx           # Root: wires hooks, navbar state, scramble text, card tilt
│   ├── index.css         # All global styles, CSS variables, gen-z effects
│   ├── hooks/
│   │   ├── useFrameSequence.js    # Frame loading, RAF loop, canvas drawing
│   │   └── useScrollProgress.js   # Subscriber pattern for scroll-driven animations
│   └── components/
│       ├── Navbar.jsx        # Top nav — transparent during frames, solid when in page body, active section highlight, hamburger mobile menu
│       ├── HeroSection.jsx   # Fixed hero overlay — badge, headline, subtitle, buttons animated by scroll
│       ├── FrameLoader.jsx   # Loading screen with progress bar
│       ├── ParticleCanvas.jsx # Background particle effect (paused during hero)
│       ├── CursorGlow.jsx    # Mouse-follow glow effect
│       ├── Stats.jsx         # Animated stat counters
│       ├── TrustedBy.jsx     # Logo strip
│       ├── Problem.jsx       # Problem cards
│       ├── Features.jsx      # Feature grid
│       ├── Compliance.jsx    # Compliance checklist
│       ├── CTA.jsx           # Call to action
│       ├── Contact.jsx       # MUI contact form
│       └── Footer.jsx        # Footer
├── vite.config.js        # base: '/flowfort/' for GitHub Pages
└── package.json
```

---

## Design System

**Color Palette (CSS variables):**

| Variable | Value | Usage |
|---|---|---|
| `--primary` | `#4DA18A` | Green — main brand accent |
| `--primary-lt` | `#67C4A7` | Light green |
| `--purple` | `#6078EA` | Purple — secondary accent, form, icons |
| `--purple-deep` | `#3023AE` | Deep purple |
| `--bg` | `#070B12` | Near-black background |
| `--text` | `#EDEEF0` | Off-white body text |
| `--card-bg` | `rgba(255,255,255,0.04)` | Glass-effect card background |

**Font:** Plus Jakarta Sans (400, 500, 600, 700, 800)

**Effects:**
- Animated gradient borders on cards
- Shimmer sweep on hero badge
- Glow lines between sections
- 3D card tilt on hover (perspective + rotateX/Y)
- Cursor glow following mouse
- Scramble text animation on the "2000%" stat

---

## Deployment

- **Repo:** `https://github.com/Alester-Davis/flowfort`
- **Live URL:** `https://alester-davis.github.io/flowfort/`
- **Branch:** `master`
- **Deploy process:**
  1. `npm run build` in `flowfort-react/`
  2. Copy `dist/` contents to `c:/Users/skquo/Desktop/3D Website/flowfort/`
  3. `git add -A && git commit && git push origin master`

---

## Performance Decisions

- **Pre-scaled bitmaps:** Frames downscaled to display resolution at load time — `drawImage` is a cheap blit, not a scale operation
- **Single RAF loop:** Only `useFrameSequence` runs `requestAnimationFrame` — `useScrollProgress` is passive (no competing RAF)
- **No React state during scroll:** Hero content uses direct DOM writes via `element.style.*` — zero re-renders at 60fps
- **Cached layout reads:** `spacer.offsetHeight` and `offsetTop` are cached at startup and on resize only — never read inside the RAF loop
- **Snap on large jumps:** If scroll jumps >15%, lerp snaps immediately — prevents hang when re-entering the frames section
- **Lerp factor 0.3:** ~3 frames to catch up on fast scroll — smooths burst draws without adding noticeable lag
