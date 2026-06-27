import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NOTIFICATIONS = [
  { location: "Urla'dan", firm: "bir turizm acentesi", action: "Ücretsiz SEO Analizi talep etti", time: "Az önce" },
  { location: "Karşıyaka'dan", firm: "bir e-ticaret markası", action: "KOBİ Dijitalleşme Endeksini çözdü", time: "2 dk önce" },
  { location: "Buca'dan", firm: "bir tekstil atölyesi", action: "Büyüme Danışmanlığı randevusu oluşturdu", time: "5 dk önce" },
  { location: "Çeşme'den", firm: "bir butik otel", action: "Meta Ads analizi istedi", time: "Az önce" },
  { location: "Bornova'dan", firm: "bir sanayi üreticisi", action: "Web tasarım portfolyomuzu inceledi", time: "10 dk önce" }
];

export default function SocialProofToast() {
  const [currentNotif, setCurrentNotif] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutIds = [];
    
    const initialDelay = setTimeout(() => {
      showNextNotification(timeoutIds);
    }, 5000);
    timeoutIds.push(initialDelay);

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []);

  const showNextNotification = (timeoutIds) => {
    // Pick a random notification
    const randomNotif = NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)];
    setCurrentNotif(randomNotif);
    setIsVisible(true);

    // Hide it after 5 seconds
    const hideDelay = setTimeout(() => {
      setIsVisible(false);
      
      // Schedule the next one between 15-30 seconds later
      const nextDelay = Math.floor(Math.random() * (30000 - 15000 + 1) + 15000);
      const showDelay = setTimeout(() => {
        showNextNotification(timeoutIds);
      }, nextDelay);
      timeoutIds.push(showDelay);
      
    }, 5000);
    timeoutIds.push(hideDelay);
  };

  return (
    <div className="social-proof-toast-wrapper" style={{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      zIndex: 9999, // very high but slightly below full screen popups
      pointerEvents: 'none' // Don't block clicks
    }}>
      <style>{`
        @media (max-width: 768px) {
          .social-proof-toast-wrapper {
            bottom: 80px !important; /* Above WhatsApp icon usually */
            left: 16px !important;
            right: 16px !important;
          }
          .social-proof-toast-inner {
            max-width: 100% !important;
          }
        }
      `}</style>
      <AnimatePresence>
        {isVisible && currentNotif && (
          <motion.div
            className="social-proof-toast-inner"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              padding: '12px 16px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 2px 10px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              maxWidth: '320px',
              borderLeft: '4px solid var(--primary)',
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              flexShrink: 0
            }}>
              <i className="fa-solid fa-chart-line"></i>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                {currentNotif.time}
              </span>
              <p style={{ fontSize: '13px', color: '#1e293b', margin: 0, lineHeight: 1.4 }}>
                <strong>{currentNotif.location}</strong> {currentNotif.firm} <br/> 
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{currentNotif.action}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
