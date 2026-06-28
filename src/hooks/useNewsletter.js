import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for newsletter subscription state and handler.
 * Uses refs for callbacks to avoid TDZ issues with declaration order.
 */
export default function useNewsletter() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  // Store callbacks in refs so they can be set after hook initialization
  const simulateLeadRef = useRef(null);
  const detectTrafficRef = useRef(null);

  // Called by App.jsx after simulateLeadLocally is defined
  const setCallbacks = useCallback((simulateLeadLocally, detectTrafficSource) => {
    simulateLeadRef.current = simulateLeadLocally;
    detectTrafficRef.current = detectTrafficSource;
  }, []);

  const handleNewsletterSubmit = async e => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    setNewsletterLoading(true);
    setNewsletterError('');
    const trafficSource = detectTrafficRef.current ? detectTrafficRef.current() : 'Organik (SEO)';
    const leadPayload = {
      fullName: 'Bülten Abonesi',
      email: newsletterEmail,
      phone: '-',
      company: 'Bülten Aboneliği',
      service: 'Bülten Aboneliği',
      message: 'Kullanıcı bültene kaydoldu.',
      trafficSource,
    };
    try {
      await fetch('/api.php?action=save_lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      });
      if (simulateLeadRef.current) simulateLeadRef.current(leadPayload);
      setNewsletterLoading(false);
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 5000);
    } catch (err) {
      console.error("Newsletter submission failed, simulating locally:", err);
      if (simulateLeadRef.current) simulateLeadRef.current(leadPayload);
      setNewsletterLoading(false);
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 5000);
    }
  };

  return {
    newsletterEmail, setNewsletterEmail,
    newsletterLoading, newsletterSubmitted, newsletterError,
    handleNewsletterSubmit,
    setNewsletterCallbacks: setCallbacks,
  };
}
