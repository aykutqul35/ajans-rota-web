import { useState } from 'react';

/**
 * Custom hook for newsletter subscription state and handler.
 */
export default function useNewsletter(simulateLeadLocally, detectTrafficSource) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const handleNewsletterSubmit = async e => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    setNewsletterLoading(true);
    setNewsletterError('');
    const leadPayload = {
      fullName: 'Bülten Abonesi',
      email: newsletterEmail,
      phone: '-',
      company: 'Bülten Aboneliği',
      service: 'Bülten Aboneliği',
      message: 'Kullanıcı bültene kaydoldu.',
      trafficSource: detectTrafficSource()
    };
    try {
      await fetch('/api.php?action=save_lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      });
      simulateLeadLocally(leadPayload);
      setNewsletterLoading(false);
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 5000);
    } catch (err) {
      console.error("Newsletter submission failed, simulating locally:", err);
      simulateLeadLocally(leadPayload);
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
  };
}
