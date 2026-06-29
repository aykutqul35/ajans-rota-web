import React from 'react';

export default function MarketingTab({
  handleSaveAll, settingsData, setSettingsData
}) {
  return (
              <div>
              <div className="admin-section-title">
                Dijital Pazarlama &amp; İzleme Kodları (Marketing)
              </div>
              <form onSubmit={e => {
            e.preventDefault();
            handleSaveAll();
          }}>
                <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              lineHeight: '1.5'
            }}>
                  Web sitenize entegre etmek istediğiniz dijital pazarlama, piksel ve dönüşüm izleme kodlarını buradan yönetebilirsiniz. 
                  Girdiğiniz izleme kimlikleri (IDs) veya script kodları web sitesi yüklendiğinde otomatik olarak arka planda çalıştırılacaktır.
                </p>

                <h3 style={{
              marginTop: '1.5rem',
              marginBottom: '1.25rem',
              fontSize: '1.1rem',
              color: 'var(--text-light)',
              borderBottom: '1px solid var(--glass-border)',
              paddingBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
                  <i className="fa-brands fa-facebook" style={{
                color: '#1877f2',
                fontSize: '1.1rem'
              }}></i> Facebook Pixel Ayarları
                </h3>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Facebook Pixel ID</label>
                    <input type="text" value={settingsData.fb_pixel_id || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  fb_pixel_id: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} placeholder="Örn: 123456789012345" />
                  </div>
                  <div className="admin-form-group">
                    <label>Facebook Custom Script (Opsiyonel Gelişmiş Kod)</label>
                    <textarea rows="2" value={settingsData.fb_pixel_custom_script || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  fb_pixel_custom_script: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem'
                }} placeholder="Facebook Pixel standart scripti dışındaki özel dönüşüm olay kodu (fbq('track', ...))" />
                  </div>
                </div>

                <h3 style={{
              marginTop: '2rem',
              marginBottom: '1.25rem',
              fontSize: '1.1rem',
              color: 'var(--text-light)',
              borderBottom: '1px solid var(--glass-border)',
              paddingBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
                  <i className="fa-solid fa-rectangle-ad" style={{
                color: '#4285f4',
                fontSize: '1.1rem'
              }}></i> Google Ads Dönüşüm Kodları
                </h3>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Google Ads Conversion ID (AW-XXXXX)</label>
                    <input type="text" value={settingsData.google_ads_conversion_id || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  google_ads_conversion_id: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} placeholder="Örn: AW-123456789" />
                  </div>
                  <div className="admin-form-group">
                    <label>Google Ads Custom Event Script (Dönüşüm Olay Scripti)</label>
                    <textarea rows="2" value={settingsData.google_ads_event_script || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  google_ads_event_script: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem'
                }} placeholder="gtag('event', 'conversion', {...})" />
                  </div>
                </div>

                <h3 style={{
              marginTop: '2rem',
              marginBottom: '1.25rem',
              fontSize: '1.1rem',
              color: 'var(--text-light)',
              borderBottom: '1px solid var(--glass-border)',
              paddingBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
                  <i className="fa-brands fa-google" style={{
                color: '#4285f4',
                fontSize: '1.1rem'
              }}></i> Google Search Console Ayarları
                </h3>
                <div className="admin-form-group">
                  <label>Google Search Console Doğrulama Kodu (google-site-verification)</label>
                  <input type="text" value={settingsData.google_site_verification || ''} onChange={e => setSettingsData({
                ...settingsData,
                google_site_verification: e.target.value
              })} style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: '#fff'
              }} placeholder="Örn: d1A2b3C4d5E6f7G8h9I0..." />
                  <span style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                display: 'block',
                marginTop: '0.25rem'
              }}>
                    Google Search Console mülk doğrulaması için head içerisine meta etiketini enjekte eder.
                  </span>
                </div>

                <h3 style={{
              marginTop: '2rem',
              marginBottom: '1.25rem',
              fontSize: '1.1rem',
              color: 'var(--text-light)',
              borderBottom: '1px solid var(--glass-border)',
              paddingBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
                  <i className="fa-solid fa-chart-line" style={{
                color: '#f57c00',
                fontSize: '1.1rem'
              }}></i> Google Analytics 4 (GA4) Ayarları
                </h3>
                <div className="admin-form-group">
                  <label>GA4 Ölçüm Kimliği (Measurement ID - G-XXXXXXX)</label>
                  <input type="text" value={settingsData.google_analytics_id || ''} onChange={e => setSettingsData({
                ...settingsData,
                google_analytics_id: e.target.value
              })} style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: '#fff'
              }} placeholder="Örn: G-P123456789" />
                </div>

                <h3 style={{
              marginTop: '2rem',
              marginBottom: '1.25rem',
              fontSize: '1.1rem',
              color: 'var(--text-light)',
              borderBottom: '1px solid var(--glass-border)',
              paddingBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
                  <i className="fa-solid fa-tags" style={{
                color: '#00cba9',
                fontSize: '1.1rem'
              }}></i> Google Tag Manager (GTM) Ayarları
                </h3>
                <div className="admin-form-group" style={{
              marginBottom: '2rem'
            }}>
                  <label>Google Tag Manager ID (GTM-XXXXXXX)</label>
                  <input type="text" value={settingsData.gtm_id || ''} onChange={e => setSettingsData({
                ...settingsData,
                gtm_id: e.target.value
              })} style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: '#fff'
              }} placeholder="Örn: GTM-ABC1234" />
                </div>
                <div className="admin-form-actions">
                  <button type="submit" className="btn btn-primary">Kaydet</button>
                </div>
              </form>
            </div>
  );
}
