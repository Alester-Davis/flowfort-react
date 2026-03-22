import { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { Send, CheckCircle } from '@mui/icons-material';
import {
  ThemeProvider,
  createTheme,
  TextField,
  Button,
  CircularProgress,
  Autocomplete,
} from '@mui/material';

const TOPICS = [
  'OT Patch Management',
  'Risk & Compliance',
  'Product Demo',
  'Partnership',
  'Other',
];

const INFO = [
  { icon: <Mail size={15} />,  label: 'Email',  value: 'hello@secure-plex.com',   href: 'mailto:hello@secure-plex.com' },
  { icon: <Phone size={15} />, label: 'Phone',  value: '+603-2242 4363',            href: 'tel:+60322424363' },
  { icon: <MapPin size={15} />,label: 'Office', value: 'Level 6, Menara TH, Tower 2A\nBangsar South, 59200 Kuala Lumpur', href: null },
];

/* ── MUI dark theme matching the site palette ── */
const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: '#6078EA' },
    background:{ paper: 'transparent', default: 'transparent' },
    text:      { primary: '#e2e4f0', secondary: 'rgba(124,125,148,0.7)' },
  },
  shape: { borderRadius: 10 },
  typography: { fontFamily: 'inherit' },
  components: {
    MuiTextField: {
      defaultProps: { variant: 'outlined', fullWidth: true, size: 'small' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.04)',
          fontSize: '0.9rem',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.1)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.22)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6078EA',
            borderWidth: '1.5px',
            boxShadow: '0 0 0 3px rgba(96,120,234,0.15)',
          },
        },
        input: {
          color: '#e2e4f0',
          '&::placeholder': { color: 'rgba(124,125,148,0.5)', opacity: 1 },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.8rem',
          color: 'rgba(124,125,148,0.7)',
          '&.Mui-focused': { color: '#6078EA' },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: 'rgba(124,125,148,0.6)' },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '&:hover':    { backgroundColor: 'rgba(44,126,104,0.12)' },
          '&.Mui-selected': { backgroundColor: 'rgba(44,126,104,0.18)' },
          '&.Mui-selected:hover': { backgroundColor: 'rgba(44,126,104,0.25)' },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          background: '#141526',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
        },
        option: {
          fontSize: '0.875rem',
          '&:hover':    { backgroundColor: 'rgba(44,126,104,0.12) !important' },
          '&[aria-selected="true"]': { backgroundColor: 'rgba(44,126,104,0.18) !important' },
          '&[aria-selected="true"]:hover': { backgroundColor: 'rgba(44,126,104,0.25) !important' },
        },
        clearIndicator: { color: 'rgba(124,125,148,0.6)' },
        popupIndicator: { color: 'rgba(124,125,148,0.6)' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#141526',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          letterSpacing: '0.01em',
          borderRadius: 10,
          fontSize: '0.875rem',
          padding: '0.7rem 1.6rem',
        },
      },
    },
  },
});

export default function Contact() {
  const [topic, setTopic] = useState('');
  const [sent, setSent]   = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    }, 800);
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <section id="contact" className="co-section">
        <div className="co-inner">

          {/* ── LEFT: heading + info ── */}
          <div className="co-left">
            <div className="section-label">
              <MessageSquare size={12} /> Contact
            </div>

            <h2 className="section-title co-title">
              Let&apos;s talk about<br />
              <span className="grad">your OT security.</span>
            </h2>

            <p className="co-desc">
              Tell us about your infrastructure and we&apos;ll show you exactly how FlowFort fits — no generic demos, no pressure.
            </p>

            {/* Contact info rows */}
            <div className="co-info-list">
              {INFO.map((d, i) => (
                <div className="co-info-row" key={i}>
                  <span className="co-info-icon">{d.icon}</span>
                  <div className="co-info-body">
                    <span className="co-info-label">{d.label}</span>
                    {d.href
                      ? <a href={d.href} className="co-info-val co-info-link">{d.value}</a>
                      : <span className="co-info-val" style={{ whiteSpace: 'pre-line' }}>{d.value}</span>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Live badge */}
            <div className="co-badge">
              <span className="co-badge-dot" />
              Replies within 24 hours
            </div>
          </div>

          {/* ── RIGHT: form card ── */}
          <div className="co-form-card">
            <form className="co-form" onSubmit={handleSubmit} noValidate>

              <div className="co-row">
                <TextField
                  id="co-fn"
                  label="First Name"
                  placeholder="Jane"
                  autoComplete="given-name"
                  required
                />
                <TextField
                  id="co-ln"
                  label="Last Name"
                  placeholder="Smith"
                  autoComplete="family-name"
                  required
                />
              </div>

              <TextField
                id="co-em"
                label="Work Email"
                type="email"
                placeholder="jane@company.com"
                autoComplete="email"
                required
              />

              <TextField
                id="co-co"
                label="Company"
                placeholder="Acme Industries"
                autoComplete="organization"
              />

              <Autocomplete
                id="co-tp"
                options={TOPICS}
                value={topic || null}
                onChange={(_, val) => setTopic(val || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Area of Interest"
                    placeholder="Select a topic…"
                  />
                )}
              />

              <TextField
                id="co-msg"
                label="Message"
                placeholder="Describe your OT security challenges…"
                multiline
                rows={4}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={sent || loading}
                startIcon={
                  loading ? <CircularProgress size={14} color="inherit" /> :
                  sent    ? <CheckCircle sx={{ fontSize: 15 }} /> :
                            <Send sx={{ fontSize: 14 }} />
                }
                sx={{
                  alignSelf: 'flex-start',
                  background: sent
                    ? 'rgba(44,126,104,0.2)'
                    : 'linear-gradient(135deg, #17EAD9 0%, #6078EA 55%, #C86DD7 100%)',
                  boxShadow: sent ? 'none' : '0 4px 18px rgba(96,120,234,0.3)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #17EAD9 0%, #6078EA 55%, #C86DD7 100%)',
                    boxShadow: '0 6px 26px rgba(96,120,234,0.45)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  '&.Mui-disabled': {
                    color: sent ? '#5ecfa9' : 'rgba(255,255,255,0.4)',
                    background: sent ? 'rgba(44,126,104,0.15)' : undefined,
                  },
                }}
              >
                {sent ? "Message sent — we'll be in touch!" : 'Send Message'}
              </Button>

            </form>
          </div>

        </div>
      </section>
    </ThemeProvider>
  );
}
