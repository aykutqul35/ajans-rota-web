import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIAuditForm() {
  const [step, setStep] = useState('initial'); // initial, scanning, result
  const [domain, setDomain] = useState('');
  const [scanLogs, setScanLogs] = useState([]);

  const handleScan = (e) => {
    e.preventDefault();
    if (!domain.includes('.')) return alert('Lütfen geçerli bir domain girin (Örn: markaniz.com)');
    
    setStep('scanning');
    setScanLogs(["Hedef sunucuya bağlanılıyor..."]);
    
    setTimeout(() => {
      setScanLogs(prev => [...prev, "Meta & Google Ads piksel altyapısı kontrol ediliyor..."]);
    }, 1500);

    setTimeout(() => {
      setScanLogs(prev => [...prev, "Rakip SEO açıkları taranıyor..."]);
    }, 3000);

    setTimeout(() => {
      setScanLogs(prev => [...prev, "Sektörel ROAS (Getiri) potansiyeliniz hesaplanıyor..."]);
    }, 4500);

    setTimeout(() => {
      setStep('result');
    }, 6000);
  };

  return (
    <div className="ai-terminal" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        {step === 'initial' && (
          <motion.form 
            key="initial"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onSubmit={handleScan}
            style={{ textAlign: 'center' }}
          >
            <i className="fa-solid fa-radar pulse-glow" style={{ fontSize: '3rem', color: 'var(--cyber-blue)', marginBottom: '1.5rem', display: 'block' }}></i>
            <h3 style={{ color: 'var(--text-light)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Otonom Marka Analizi</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Web sitenizi girin, Rota AI saniyeler içinde büyüme potansiyelinizi ve rakip boşluklarını analiz etsin.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '400px', margin: '0 auto' }}>
              <input 
                type="text" 
                placeholder="ornekmarka.com" 
                value={domain}
                onChange={e => setDomain(e.target.value)}
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border-hover)', background: 'rgba(2, 6, 23, 0.5)', color: 'var(--cyber-green)', outline: 'none' }}
              />
              <button type="submit" className="btn btn-primary" style={{ background: 'var(--cyber-purple)', borderColor: 'var(--cyber-purple)' }}>
                <i className="fa-solid fa-bolt"></i> Tara
              </button>
            </div>
          </motion.form>
        )}

        {step === 'scanning' && (
          <motion.div 
            key="scanning"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <h4 style={{ color: 'var(--cyber-blue)', marginBottom: '1rem' }}><i className="fa-solid fa-circle-notch fa-spin"></i> Otonom Analiz Sürdürülüyor...</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {scanLogs.map((log, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="typewriter-text"
                >
                  <span style={{ color: 'var(--text-muted)' }}>[{new Date().toLocaleTimeString()}]</span> {log}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center' }}
          >
            <i className="fa-solid fa-check-circle" style={{ fontSize: '3rem', color: 'var(--cyber-green)', marginBottom: '1rem' }}></i>
            <h3 style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>Analiz Tamamlandı</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <strong style={{ color: 'var(--cyber-blue)' }}>{domain}</strong> için 3 Aylık Otonom Büyüme Stratejisi hazırlandı. Sonuçları detaylı incelemek ve onaylamak için bize ulaşın.
            </p>
            <a href="https://wa.me/905054199926" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ background: 'var(--cyber-green)', borderColor: 'var(--cyber-green)', color: '#000' }}>
              <i className="fa-brands fa-whatsapp"></i> Raporu Talep Et
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
