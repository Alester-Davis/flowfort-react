import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import NotFound from './components/NotFound.jsx'

// Always start from the top on page load / refresh
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// Handle GitHub Pages SPA redirect from 404.html
const redirectParam = new URLSearchParams(window.location.search).get('p');
if (redirectParam) {
  const url = new URL(window.location.href);
  url.search = '';
  url.pathname = '/flowfort-react' + (redirectParam || '/');
  history.replaceState(null, '', url.toString());
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/flowfort-react">
      <Routes>
        <Route path="/" element={<App />} />
        {/* /demo scrolls to the CTA section on the landing page */}
        <Route path="/demo" element={<Navigate to="/#cta" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
