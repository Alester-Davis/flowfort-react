import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6078EA' },
    background: { paper: 'rgba(255,255,255,0.04)' },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  },
  components: {
    MuiTextField: {
      defaultProps: { variant: 'outlined', fullWidth: true, size: 'medium' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(8px)',
            color: '#efeeee',
            fontSize: '0.95rem',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.07)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
            '&.Mui-focused fieldset': {
              borderColor: '#6078EA',
              boxShadow: '0 0 0 3px rgba(96,120,234,0.15)',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#7c7d94',
            fontSize: '0.9rem',
            '&.Mui-focused': { color: '#6078EA' },
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          '&:hover': { background: 'rgba(96,120,234,0.12)' },
          '&.Mui-selected': { background: 'rgba(96,120,234,0.2)' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          padding: '12px 28px',
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
        },
      },
    },
  },
});

const topics = [
  'OT Patch Management',
  'Risk & Compliance',
  'Product Demo',
  'Partnership',
  'Other',
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Contact() {
  const [topic, setTopic] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div id="contact" className="contact-section">
        <div className="contact-grid">
          <motion.div
            className="contact-info"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <motion.h2 variants={itemVariants}>Get in Touch</motion.h2>
            <motion.p variants={itemVariants}>
              Ready to secure your OT environment? Reach out to our team and we&apos;ll help you get started with FlowFort.
            </motion.p>
            {[
              { icon: <Mail size={18} />, text: 'hello@secure-plex.com' },
              { icon: <Phone size={18} />, text: '+603-2242 4363' },
              { icon: <MapPin size={18} />, text: 'Level 6, Menara TH, Tower 2A, Avenue 5, The Horizon, Bangsar South, 59200, Kuala Lumpur' },
            ].map((d, i) => (
              <motion.div className="contact-detail" key={i} variants={itemVariants}>
                {d.icon}
                <span>{d.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="contact-form-card"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <TextField label="First Name" required />
                <TextField label="Last Name" required />
              </div>
              <TextField label="Work Email" type="email" required />
              <TextField label="Company" />
              <TextField
                select
                label="Interest"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                SelectProps={{
                  MenuProps: {
                    disableScrollLock: true,
                    PaperProps: {
                      sx: {
                        background: '#141526',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(24px)',
                      },
                    },
                  },
                }}
              >
                {topics.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Message"
                multiline
                minRows={3}
                placeholder="Tell us about your OT security needs..."
              />
              <motion.div
                style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                  disabled={submitted}
                  sx={{
                    background: 'linear-gradient(135deg, #3023AE 0%, #6078EA 100%)',
                    boxShadow: '0 4px 20px rgba(96,120,234,0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #6078EA 0%, #3023AE 100%)',
                      boxShadow: '0 6px 28px rgba(96,120,234,0.45)',
                    },
                    minWidth: 180,
                  }}
                >
                  {submitted ? 'Sent!' : 'Send Message'}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </ThemeProvider>
  );
}
