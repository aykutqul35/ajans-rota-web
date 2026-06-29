import { useState, useEffect } from 'react';

const CONSENT_KEY = 'cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

export default function CookieConsent({ onNavigateToPolicy }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,    // Her zaman aktif
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // İlk ziyarette 800ms sonra göster (sayfa yüklenmesini bekliyoruz)
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
    try {
      const parsed = JSON.parse(stored);
      if (parsed.expiry && Date.now() > parsed.expiry) {
        localStorage.removeItem(CONSENT_KEY);
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch { /* consent var, geçerli */ }
  }, []);

  const saveConsent = (prefs) => {
    const data = {
      ...prefs,
      timestamp: new Date().toISOString(),
      expiry: Date.now() + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const handleRejectAll = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!isVisible) return null;

  return (
    <div className={`cookie-banner-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="cookie-banner glass-card">
        {/* Header */}
        <div className="cookie-banner-header">
          <div className="cookie-banner-icon">
            <i className="fa-solid fa-cookie-bite"></i>
          </div>
          <div>
            <h3 className="cookie-banner-title">Çerez Kullanımı</h3>
            <p className="cookie-banner-subtitle">KVKK ve 6698 Sayılı Kanun Uyarınca</p>
          </div>
        </div>

        {/* Description */}
        <p className="cookie-banner-desc">
          Web sitemizde deneyiminizi iyileştirmek, site trafiğini analiz etmek ve kişiselleştirilmiş 
          içerik sunmak amacıyla çerezler kullanıyoruz. Tercihlerinizi yönetebilir veya detaylı bilgi 
          alabilirsiniz.
        </p>

        {/* Detailed Preferences */}
        {showDetails && (
          <div className="cookie-preferences">
            <div className="cookie-pref-item">
              <div className="cookie-pref-info">
                <span className="cookie-pref-name">
                  <i className="fa-solid fa-shield-halved"></i>
                  Zorunlu Çerezler
                </span>
                <span className="cookie-pref-desc">Sitenin temel işlevleri için gereklidir. Kapatılamaz.</span>
              </div>
              <label className="cookie-toggle disabled">
                <input type="checkbox" checked disabled />
                <span className="cookie-toggle-slider"></span>
              </label>
            </div>

            <div className="cookie-pref-item">
              <div className="cookie-pref-info">
                <span className="cookie-pref-name">
                  <i className="fa-solid fa-chart-pie"></i>
                  Analitik Çerezler
                </span>
                <span className="cookie-pref-desc">Ziyaretçi istatistikleri ve site performansı ölçümü.</span>
              </div>
              <label className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences(p => ({ ...p, analytics: e.target.checked }))}
                />
                <span className="cookie-toggle-slider"></span>
              </label>
            </div>

            <div className="cookie-pref-item">
              <div className="cookie-pref-info">
                <span className="cookie-pref-name">
                  <i className="fa-solid fa-bullhorn"></i>
                  Pazarlama Çerezleri
                </span>
                <span className="cookie-pref-desc">Kişiselleştirilmiş reklam ve yeniden hedefleme.</span>
              </div>
              <label className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences(p => ({ ...p, marketing: e.target.checked }))}
                />
                <span className="cookie-toggle-slider"></span>
              </label>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="cookie-banner-actions">
          <div className="cookie-banner-links">
            <button
              className="cookie-link-btn"
              onClick={() => setShowDetails(!showDetails)}
            >
              <i className={`fa-solid ${showDetails ? 'fa-chevron-up' : 'fa-sliders'}`}></i>
              {showDetails ? 'Gizle' : 'Tercihlerimi Yönet'}
            </button>
            {onNavigateToPolicy && (
              <button className="cookie-link-btn" onClick={onNavigateToPolicy}>
                <i className="fa-solid fa-file-lines"></i>
                Çerez Politikası
              </button>
            )}
          </div>
          <div className="cookie-banner-buttons">
            <button className="btn btn-secondary cookie-reject-btn" onClick={handleRejectAll}>
              Reddet
            </button>
            {showDetails ? (
              <button className="btn btn-primary cookie-accept-btn" onClick={handleSavePreferences}>
                Seçimi Kaydet
              </button>
            ) : (
              <button className="btn btn-primary cookie-accept-btn" onClick={handleAcceptAll}>
                <i className="fa-solid fa-check"></i>
                Tümünü Kabul Et
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
