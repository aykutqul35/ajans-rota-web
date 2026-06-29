import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'

// Auto-reload on chunk load failure (stale cache after deploy)
window.addEventListener('error', (event) => {
  if (
    event.message?.includes('Failed to fetch dynamically imported module') ||
    event.message?.includes('Failed to load module script') ||
    event.message?.includes('Loading chunk') ||
    event.message?.includes('MIME type')
  ) {
    const reloaded = sessionStorage.getItem('chunk_reload');
    if (!reloaded) {
      sessionStorage.setItem('chunk_reload', '1');
      window.location.reload();
    }
  }
});

window.addEventListener('unhandledrejection', (event) => {
  const msg = event.reason?.message || '';
  if (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Loading chunk')
  ) {
    const reloaded = sessionStorage.getItem('chunk_reload');
    if (!reloaded) {
      sessionStorage.setItem('chunk_reload', '1');
      window.location.reload();
    }
  }
});

// Clear the reload flag on successful load
sessionStorage.removeItem('chunk_reload');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
