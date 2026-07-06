
export default function MarketingTab({
  handleSaveAll, settingsData, setSettingsData
}) {
  const inputClasses = "w-full p-3 rounded-lg border border-glass-border bg-white focus:border-primary outline-none transition-colors";
  const codeInputClasses = `${inputClasses} font-mono text-xs`;
  const sectionHeadingClasses = "mt-8 mb-5 text-lg text-text-light border-b border-glass-border pb-2 flex items-center gap-2";

  return (
              <div>
              <div className="admin-section-title">
                Dijital Pazarlama &amp; İzleme Kodları (Marketing)
              </div>
              <form onSubmit={e => {
            e.preventDefault();
            handleSaveAll();
          }}>
                <p className="text-text-muted text-sm mb-6 leading-relaxed">
                  Web sitenize entegre etmek istediğiniz dijital pazarlama, piksel ve dönüşüm izleme kodlarını buradan yönetebilirsiniz. 
                  Girdiğiniz izleme kimlikleri (IDs) veya script kodları web sitesi yüklendiğinde otomatik olarak arka planda çalıştırılacaktır.
                </p>

                <h3 className={sectionHeadingClasses}>
                  <i className="fa-brands fa-facebook text-[#1877f2] text-lg"></i> Facebook Pixel Ayarları
                </h3>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Facebook Pixel ID</label>
                    <input type="text" value={settingsData.fb_pixel_id || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  fb_pixel_id: e.target.value
                })} className={inputClasses} placeholder="Örn: 123456789012345" />
                  </div>
                  <div className="admin-form-group">
                    <label>Facebook Custom Script (Opsiyonel Gelişmiş Kod)</label>
                    <textarea rows="2" value={settingsData.fb_pixel_custom_script || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  fb_pixel_custom_script: e.target.value
                })} className={codeInputClasses} placeholder="Facebook Pixel standart scripti dışındaki özel dönüşüm olay kodu (fbq('track', ...))" />
                  </div>
                </div>

                <h3 className={sectionHeadingClasses}>
                  <i className="fa-solid fa-rectangle-ad text-[#4285f4] text-lg"></i> Google Ads Dönüşüm Kodları
                </h3>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Google Ads Conversion ID (AW-XXXXX)</label>
                    <input type="text" value={settingsData.google_ads_conversion_id || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  google_ads_conversion_id: e.target.value
                })} className={inputClasses} placeholder="Örn: AW-123456789" />
                  </div>
                  <div className="admin-form-group">
                    <label>Google Ads Custom Event Script (Dönüşüm Olay Scripti)</label>
                    <textarea rows="2" value={settingsData.google_ads_event_script || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  google_ads_event_script: e.target.value
                })} className={codeInputClasses} placeholder="gtag('event', 'conversion', {...})" />
                  </div>
                </div>

                <h3 className={sectionHeadingClasses}>
                  <i className="fa-brands fa-google text-[#4285f4] text-lg"></i> Google Search Console Ayarları
                </h3>
                <div className="admin-form-group">
                  <label>Google Search Console Doğrulama Kodu (google-site-verification)</label>
                  <input type="text" value={settingsData.google_site_verification || ''} onChange={e => setSettingsData({
                ...settingsData,
                google_site_verification: e.target.value
              })} className={inputClasses} placeholder="Örn: d1A2b3C4d5E6f7G8h9I0..." />
                  <span className="text-xs text-text-muted block mt-1">
                    Google Search Console mülk doğrulaması için head içerisine meta etiketini enjekte eder.
                  </span>
                </div>

                <h3 className={sectionHeadingClasses}>
                  <i className="fa-solid fa-chart-line text-[#f57c00] text-lg"></i> Google Analytics 4 (GA4) Ayarları
                </h3>
                <div className="admin-form-group">
                  <label>GA4 Ölçüm Kimliği (Measurement ID - G-XXXXXXX)</label>
                  <input type="text" value={settingsData.google_analytics_id || ''} onChange={e => setSettingsData({
                ...settingsData,
                google_analytics_id: e.target.value
              })} className={inputClasses} placeholder="Örn: G-P123456789" />
                </div>

                <h3 className={sectionHeadingClasses}>
                  <i className="fa-solid fa-tags text-[#00cba9] text-lg"></i> Google Tag Manager (GTM) Ayarları
                </h3>
                <div className="admin-form-group mb-8">
                  <label>Google Tag Manager ID (GTM-XXXXXXX)</label>
                  <input type="text" value={settingsData.gtm_id || ''} onChange={e => setSettingsData({
                ...settingsData,
                gtm_id: e.target.value
              })} className={inputClasses} placeholder="Örn: GTM-ABC1234" />
                </div>
                <div className="admin-form-actions">
                  <button type="submit" className="btn btn-primary">Kaydet</button>
                </div>
              </form>
            </div>
  );
}
