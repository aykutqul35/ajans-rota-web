import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeadPopup({ isOpen, onClose, isExitIntent = false }) {
  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Sayfa kaydırmayı engelleme
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="popup-overlay" onClick={onClose} style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '1.5rem'
        }}>
          <motion.div 
            className="popup-container"
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '900px', 
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '24px',
              boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              overflow: 'hidden',
              position: 'relative',
              maxHeight: '90vh'
            }}
          >
            {/* Close Button */}
            <button onClick={onClose} style={{
              position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10,
              background: 'var(--bg-deep)', border: '1px solid var(--glass-border)', 
              color: 'var(--text-light)', width: '36px', height: '36px',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'var(--glass-border-hover)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'rotate(90deg)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-deep)'; e.currentTarget.style.color = 'var(--text-light)'; e.currentTarget.style.transform = 'rotate(0deg)'; }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* Left Column: Value Prop */}
            <div className="popup-left" style={{
              flex: '1',
              background: 'linear-gradient(135deg, var(--primary-glow) 0%, transparent 100%)',
              padding: '3rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRight: '1px solid var(--glass-border)'
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '60px', height: '60px', borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                color: '#fff', fontSize: '1.75rem', marginBottom: '2rem',
                boxShadow: '0 10px 20px -5px var(--primary-glow)'
              }}>
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <h2 style={{ 
                fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-light)', 
                marginBottom: '1rem', fontFamily: 'var(--font-heading)', lineHeight: '1.2' 
              }}>
                {isExitIntent ? (
                  <>Durun! İşletmenizin dijital röntgenini ücretsiz çekelim,<br/><span style={{ color: 'var(--primary)', fontSize: '1.8rem' }}>Potansiyelinizi Görün!</span></>
                ) : (
                  <>Ajans Rota ile<br/><span style={{ color: 'var(--primary)' }}>Büyüme Sırası Sizde</span></>
                )}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
                {isExitIntent 
                  ? "Ayrılmadan önce formu doldurun, markanızın büyüme potansiyelini ücretsiz analiz edip size özel bir strateji çıkaralım." 
                  : "Formu doldurun, markanızın potansiyelini analiz edelim ve size özel, veriye dayalı bir dijital büyüme stratejisi çıkaralım."}
              </p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { icon: 'fa-magnifying-glass-chart', text: 'Ücretsiz Rekabet Analizi' },
                  { icon: 'fa-bullseye', text: 'Hedef Kitle & Dönüşüm Planı' },
                  { icon: 'fa-hand-holding-dollar', text: 'Bütçe / ROAS Optimizasyonu' }
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-main)', fontSize: '1.05rem', fontWeight: '600' }}>
                    <div style={{ 
                      width: '32px', height: '32px', borderRadius: '50%', 
                      background: 'var(--primary-glow)', color: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem'
                    }}>
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Form */}
            <div className="popup-right" style={{
              flex: '1.2',
              padding: '3rem',
              background: 'var(--bg-dark)',
              overflowY: 'auto'
            }}>
              <form onSubmit={(e) => { e.preventDefault(); toast.success('Talebiniz başarıyla alındı! Ekibimiz en kısa sürede iletişime geçecektir.'); onClose(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Modern Input Group 1 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="modern-input-wrapper" style={{ position: 'relative' }}>
                    <i className="fa-regular fa-user" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
                    <input type="text" placeholder="Adınız Soyadınız" required style={{
                      width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--bg-deep)',
                      border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-main)',
                      fontSize: '0.95rem', transition: 'all 0.3s ease', outline: 'none'
                    }} 
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                    />
                  </div>
                  <div className="modern-input-wrapper" style={{ position: 'relative' }}>
                    <i className="fa-regular fa-building" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
                    <input type="text" placeholder="Marka / Şirket Adı" required style={{
                      width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--bg-deep)',
                      border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-main)',
                      fontSize: '0.95rem', transition: 'all 0.3s ease', outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                    />
                  </div>
                </div>

                {/* Modern Input Group 2 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="modern-input-wrapper" style={{ position: 'relative' }}>
                    <i className="fa-regular fa-envelope" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
                    <input type="email" placeholder="Kurumsal E-Posta" required style={{
                      width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--bg-deep)',
                      border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-main)',
                      fontSize: '0.95rem', transition: 'all 0.3s ease', outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                    />
                  </div>
                  <div className="modern-input-wrapper" style={{ position: 'relative' }}>
                    <i className="fa-solid fa-phone" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
                    <input type="tel" placeholder="Telefon Numarası" required style={{
                      width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--bg-deep)',
                      border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-main)',
                      fontSize: '0.95rem', transition: 'all 0.3s ease', outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                    />
                  </div>
                </div>

                {/* Service Select */}
                <div className="modern-input-wrapper" style={{ position: 'relative' }}>
                  <i className="fa-solid fa-layer-group" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
                  <select required defaultValue="" style={{
                    width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--bg-deep)',
                    border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-main)',
                    fontSize: '0.95rem', transition: 'all 0.3s ease', outline: 'none', appearance: 'none', cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                  >
                    <option value="" disabled>İlgilendiğiniz Ana Hizmet Alanı</option>
                    <option value="google">Google Ads Dönüşüm Optimizasyonu</option>
                    <option value="meta">Meta (Instagram/FB) Reklam Yönetimi</option>
                    <option value="seo">SEO (Arama Motoru Liderliği)</option>
                    <option value="web">Premium Web & E-Ticaret Altyapısı</option>
                    <option value="all">Kapsamlı 360° Büyüme Danışmanlığı</option>
                  </select>
                  <i className="fa-solid fa-chevron-down" style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}></i>
                </div>

                {/* Textarea */}
                <div className="modern-input-wrapper" style={{ position: 'relative' }}>
                  <i className="fa-solid fa-pen-clip" style={{ position: 'absolute', left: '1rem', top: '1.25rem', color: 'var(--text-muted)' }}></i>
                  <textarea placeholder="Mevcut durumunuz, temel hedefleriniz ve aylık pazarlama bütçeniz hakkında kısaca bilgi verebilir misiniz?" rows="4" required style={{
                    width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--bg-deep)',
                    border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-main)',
                    fontSize: '0.95rem', transition: 'all 0.3s ease', outline: 'none', resize: 'none', fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button type="submit" style={{
                  width: '100%', padding: '1.25rem', marginTop: '0.5rem',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                  border: 'none', borderRadius: '12px', color: '#fff',
                  fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                  boxShadow: '0 10px 20px -5px var(--primary-glow)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 25px -5px rgba(2, 132, 199, 0.4)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px -5px var(--primary-glow)'; }}
                >
                  <span>Büyüme Planımı Hazırlayın</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-0.5rem' }}>
                  <i className="fa-solid fa-lock" style={{ marginRight: '5px' }}></i> Bilgileriniz KVKK kapsamında korunmaktadır.
                </p>
              </form>
            </div>
            
            {/* Responsive Fixes using inline styles for a quick modern layout */}
            <style dangerouslySetInnerHTML={{__html: `
              @media (max-width: 768px) {
                .popup-container {
                  flex-direction: column !important;
                  max-height: 95vh !important;
                  overflow-y: auto !important;
                }
                .popup-left {
                  padding: 2rem !important;
                  border-right: none !important;
                  border-bottom: 1px solid var(--glass-border);
                }
                .popup-right {
                  padding: 2rem !important;
                  overflow-y: visible !important;
                }
              }
            `}} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
