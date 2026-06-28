import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function SettingsTab({
  settingsData, setSettingsData, handleSaveAll, isSaving, authToken,
  waPhone, setWaPhone, waApiKey, setWaApiKey,
  securityOldPassword, setSecurityOldPassword, securityUsername, setSecurityUsername,
  securityNewPassword, setSecurityNewPassword, handleChangePassword, securityIsLoading,
  renderImageUploaderCard
}) {
const [aboutSettingsSubTab, setAboutSettingsSubTab] = useState('hero');

  const loadLegalTemplate = tabId => {
    const confirmLoad = window.confirm("Bu işlem mevcut içeriğinizi şablon ile sıfırlayacaktır. Devam etmek istiyor musunuz?");
    if (!confirmLoad) return;
    let content = "";
    if (tabId === 'privacy') {
      content = `<h3>1. Veri Sorumlusu ve Genel Prensipler</h3>\n<p><strong>Ajans Rota</strong> olarak, web sitemizi ziyaret eden kullanıcılarımızın gizliliğini korumak en temel önceliklerimizden biridir. Bu Gizlilik Politikası, web sitemiz (http://localhost:5173/ veya canlı alan adımız) üzerinden hangi verilerin toplandığını, nasıl kullanıldığını ve güvenliğinin nasıl sağlandığını açıklamaktadır.</p>\n\n<h3>2. Toplanan Kişisel Veriler</h3>\n<p>Web sitemizde yer alan ücretsiz SEO Analizi, KOBİ Dijitalleşme Endeksi, Rakip Karşılaştırma Analizi, Rota Akademi ve İletişim Formları gibi araçları kullandığınızda aşağıdaki verileriniz işlenmektedir:</p>\n<ul>\n  <li>Adınız, soyadınız ve şirket bilgileriniz</li>\n  <li>E-posta adresiniz ve telefon numaranız</li>\n  <li>Web sitenizin adresi (analiz amaçlı)</li>\n  <li>WhatsApp müşteri asistanı üzerinden paylaştığınız proje detayları ve bütçe tercihleri</li>\n</ul>\n\n<h3>3. Çerezler (Cookies) ve Üçüncü Taraf Kodlar</h3>\n<p>Ziyaretçi deneyimini iyileştirmek, site performansını analiz etmek ve ilgi alanlarınıza özel reklamlar sunabilmek adına sitemizde çerezler kullanılmaktadır. Ayrıca sitemiz genelinde <strong>Google Analytics, Google Tag Manager ve Meta Pixel</strong> kodları entegre edilmiştir. Bu kodlar tarayıcı davranışı ve demografik verileri anonim olarak analiz etmemizi sağlar.</p>\n\n<h3>4. Veri Güvenliği</h3>\n<p>Toplanan tüm verileriniz sunucumuzda güvenli bir veri tabanında (data.json) saklanmakta olup, yetkisiz erişimlere ve veri sızıntılarına karşı gerekli tüm teknik önlemler alınmıştır. Verileriniz, yasal zorunluluklar hariç olmak üzere üçüncü şahıslarla asla paylaşılmaz.</p>`;
    } else if (tabId === 'terms') {
      content = `<h3>1. Kabul Koşulları</h3>\n<p>Bu web sitesini ziyaret ederek veya sitede yer alan Büyüme Simülatörü, SEO Analiz Raporlayıcı gibi büyüme araçlarını kullanarak, bu Kullanım Koşulları'nı tamamen kabul etmiş sayılırsınız. Koşulları kabul etmiyorsanız lütfen siteyi kullanmayınız.</p>\n\n<h3>2. Hizmetlerin Sınırları ve Garanti Muafiyeti</h3>\n<p>Sitemizde sunulan ücretsiz analiz araçları, sektörel bütçe simülatörleri ve Rota Akademi eğitim içerikleri tamamen tavsiye ve bilgilendirme niteliğindedir. Bu araçların ürettiği simülasyon sonuçları, kesin ciro veya ROAS garantisi vermez. Dijital pazarlama kampanyalarının başarısı sektörel değişimlere, reklam kreatiflerine ve ürün kalitesine bağlı olarak değişkenlik gerektirir.</p>\n\n<h3>3. Fikri Mülkiyet Hakları</h3>\n<p>Bu web sitesinin tasarımı, kod yapısı, Ege-Akdeniz temalı glassmorphism görselleri, vaka çalışması simülatörleri ve Rota Akademi bünyesindeki tüm eğitim metinleri Ajans Rota'ya aittir ve telif hakkı yasalarıyla korunmaktadır. Yazılı izin alınmaksızın kopyalanamaz veya ticari amaçlarla kullanılamaz.</p>\n\n<h3>4. Değişiklik Hakları</h3>\n<p>Ajans Rota, sitemizdeki hizmetleri, araçları veya bu Kullanım Koşulları'nı önceden bildirimde bulunmaksızın dilediği zaman güncelleme, değiştirme veya askıya alma hakkını saklı tutar.</p>`;
    } else if (tabId === 'kvkk') {
      content = `<h3>1. Veri Sorumlusu ve Kanun Kapsamı</h3>\n<p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla <strong>Ajans Rota</strong> tarafından aşağıda açıklanan kapsamda işlenebilecektir. Ajans Rota, Ege samimiyetiyle kişisel verilerinizin güvenliğine ve gizliliğine en yüksek düzeyde hassasiyet göstermektedir.</p>\n\n<h3>2. Kişisel Verilerin İşlenme Amaçları</h3>\n<p>Toplanan kişisel verileriniz, kanunun 5. ve 6. maddelerinde belirtilen şartlara uygun olarak:</p>\n<ul>\n  <li>İletişim taleplerinizin yanıtlanması ve teklif süreçlerinin yürütülmesi,</li>\n  <li>Talep ettiğiniz ücretsiz SEO analizi, KOBİ endeksi ve rakip analiz raporlarının tarafınıza sunulması,</li>\n  <li>Rota Akademi üzerinden e-kitap ve rehber indirme taleplerinizin karşılanması,</li>\n  <li>Yapay zeka müşteri asistanı üzerinden talep ettiğiniz hizmetlerin bütçe ve lokasyon bazlı planlanması amaçlarıyla işlenmektedir.</li>\n</ul>\n\n<h3>3. Kişisel Verilerin Aktarılması</h3>\n<p>Kişisel verileriniz, KVKK'nın 8. ve 9. maddelerine uygun olarak, yalnızca yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda ve iş ortaklarımıza veya yasal olarak yetkili kamu kurumlarına ilgili mevzuat çerçevesinde aktarılabilecektir.</p>\n\n<h3>4. İlgili Kişi Olarak Haklarınız</h3>\n<p>KVKK'nın 11. maddesi uyarınca Ajans Rota'ya başvurarak; verilerinizin işlenip işlenmediğini öğrenme, işlenme amacına uygun kullanılıp kullanılmadığını sorma, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme ve verilerinizin silinmesini talep etme haklarına sahipsiniz. Taleplerinizi <strong>hello@ajansrota.com</strong> adresine iletebilirsiniz.</p>`;
    } else if (tabId === 'cookies') {
      content = `<h3>1. Çerezlerin Kullanımı ve Amacı</h3>\n<p>Ajans Rota olarak, kullanıcılarımızın web sitemizi en verimli şekilde kullanabilmesi için çerezler (cookie) kullanmaktayız. Çerezler, web sitemizi ziyaret ettiğinizde cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezlerin kullanım amacı, web sitemizin performansını artırmak, kullanıcı tercihlerini hatırlamak ve ilgi alanlarınıza uygun kişiselleştirilmiş içerikler/reklamlar sunmaktır.</p>\n\n<h3>2. Çerez Türleri</h3>\n<ul>\n  <li><strong>Zorunlu Çerezler:</strong> Web sitesinin düzgün çalışması ve temel işlevleri (örneğin güvenli alanlara erişim) için gereklidir.</li>\n  <li><strong>Performans ve Analiz Çerezleri:</strong> Sitemizi ziyaret eden kişi sayısını, hangi sayfaların daha çok tıklandığını analiz ederek site performansını iyileştirmemizi sağlar. Bu veriler tamamen anonimdir.</li>\n  <li><strong>Hedefleme ve Reklam Çerezleri:</strong> İlgi alanlarınıza uygun reklamlar sunmak ve pazarlama kampanyalarının etkinliğini ölçmek için kullanılır.</li>\n</ul>\n\n<h3>3. Çerezlerin Kontrolü ve Silinmesi</h3>\n<p>Tarayıcınızın ayarlarını değiştirerek çerezleri tamamen engelleyebilir veya daha önce kaydedilmiş çerezleri silebilirsiniz. Çerezleri engellemeniz durumunda, web sitemizin bazı fonksiyonlarının tam olarak çalışmayabileceğini hatırlatmak isteriz.</p>`;
    }
    const fieldMap = {
      privacy: 'privacy_policy_content',
      terms: 'terms_of_use_content',
      kvkk: 'kvkk_text_content',
      cookies: 'cookies_policy_content'
    };
    setSettingsData(prev => ({
      ...prev,
      [fieldMap[tabId]]: content
    }));
  };
  const [activeGeneralSettingsTab, setActiveGeneralSettingsTab] = useState('company');

  const [companySettingsSubTab, setCompanySettingsSubTab] = useState('identity');

  const [contactSettingsSubTab, setContactSettingsSubTab] = useState('address');

  const [legalSettingsSubTab, setLegalSettingsSubTab] = useState('kvkk');

  const [settingsAccordion, setSettingsAccordion] = useState({});

  const [legalEditorPreview, setLegalEditorPreview] = useState({});

  const [activeSeoTab, setActiveSeoTab] = useState('general');

  const [sitemapLoading, setSitemapLoading] = useState(false);

  const [sitemapStatus, setSitemapStatus] = useState(null);

  const [sitemapError, setSitemapError] = useState(null);

  const toggleSettingsSection = (key) => setSettingsAccordion(prev => ({ ...prev, [key]: !prev[key] }));

  const insertHtmlTag = (elementId, fieldName, tagOpen, tagClose = '') => {
    const textarea = document.getElementById(elementId);
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    // Default selectedText
    const selectedText = text.substring(start, end);
    let replacement = '';
    if (tagOpen === 'a') {
      const url = prompt('Lütfen yönlendirilecek URL adresini girin:', 'https://');
      if (url === null) return; // Kullanıcı iptal etti
      replacement = `<a href="${url}" target="_blank" style="color: var(--primary); text-decoration: underline;">${selectedText || 'Bağlantı Metni'}</a>`;
    } else if (tagOpen === 'ul') {
      replacement = `<ul>\n  <li>${selectedText || 'Liste ögesi'}</li>\n</ul>`;
    } else if (tagOpen === 'li') {
      replacement = `<li>${selectedText || 'Liste ögesi'}</li>`;
    } else {
      replacement = `<${tagOpen}>${selectedText}</${tagOpen}>`;
    }
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setSettingsData(prev => ({
      ...prev,
      [fieldName]: newValue
    }));

    // Seçimi geri odakla ve düzelt
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  const handleGenerateSitemap = async () => {
    setSitemapLoading(true);
    setSitemapError('');
    setSitemapStatus(null);
    try {
      const response = await fetch('/api.php?action=generate_sitemap', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSitemapStatus({
          message: data.message,
          url: data.url,
          lastUpdated: data.last_updated
        });
      } else {
        setSitemapError(data.error || 'Site haritası oluşturulamadı.');
      }
    } catch (err) {
      setSitemapError('Sunucu bağlantı hatası.');
    } finally {
      setSitemapLoading(false);
    }
  };
  return (
              <div>
              <div className="admin-section-title">
                Genel Sistem ve Arayüz Ayarları (Settings)
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
                  Web sitenizin genel ayarlarını, görsel varlıklarını, SEO meta etiketlerini ve site haritasını buradan yapılandırabilirsiniz.
                </p>

                {/* ── ACCORDION: Webhook ve Bildirimler ── */}
                <div style={{ marginBottom: '0.75rem', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.2)', transition: 'box-shadow 0.2s' }}>
                  <button type="button" onClick={() => toggleSettingsSection('webhook')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: settingsAccordion.webhook ? 'rgba(37, 211, 102, 0.05)' : 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-dark)' }}>
                      <i className="fa-brands fa-whatsapp" style={{ color: '#25D366', fontSize: '1.05rem' }}></i>
                      SaaS Bildirim Ayarları (WhatsApp)
                    </span>
                    <i className={`fa-solid ${settingsAccordion.webhook ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ color: '#25D366', fontSize: '0.85rem' }}></i>
                  </button>
                  {settingsAccordion.webhook && (
                    <div style={{ padding: '1.5rem', background: '#fff' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.25rem', lineHeight: '1.5', padding: '1rem', background: 'rgba(37, 211, 102, 0.05)', borderRadius: '8px', border: '1px solid rgba(37, 211, 102, 0.2)' }}>
                          <strong>Kurulum Adımları (Sadece 10 saniye sürer):</strong><br/>
                          1. Telefonunuzun WhatsApp uygulamasına girin ve <b>+34 624 54 22 28</b> numarasını rehberinize "CallMeBot" olarak kaydedin.<br/>
                          2. Bu numaraya WhatsApp'tan <b>I allow callmebot to send me messages</b> yazıp gönderin.<br/>
                          3. Bot size otomatik olarak "API Key" değerinizi yanıt olarak gönderecektir.<br/>
                          4. Numaranızı ve botun verdiği API Key'i aşağıdaki alanlara girin.
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div className="admin-form-group">
                            <label>WhatsApp Numaranız</label>
                            <input 
                              type="text" 
                              value={waPhone} 
                              onChange={e => {
                                 setWaPhone(e.target.value);
                                 localStorage.setItem('rota_wa_phone', e.target.value);
                              }} 
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} 
                              placeholder="+905321234567 (Uluslararası formatta boşluksuz)" 
                            />
                          </div>
                          <div className="admin-form-group">
                            <label>API Key (CallMeBot)</label>
                            <input 
                              type="text" 
                              value={waApiKey} 
                              onChange={e => {
                                 setWaApiKey(e.target.value);
                                 localStorage.setItem('rota_wa_apikey', e.target.value);
                              }} 
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} 
                              placeholder="Örn: 123456" 
                            />
                          </div>
                        </div>
                    </div>
                  )}
                </div>
                
                {/* ── ACCORDION: Güvenlik ve Hesap Bilgileri ── */}
                <div style={{ marginBottom: '0.75rem', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(239,68,68,0.2)', boxShadow: settingsAccordion.security ? '0 4px 16px rgba(239,68,68,0.08)' : 'none', transition: 'box-shadow 0.2s' }}>
                  <button type="button" onClick={() => toggleSettingsSection('security')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: settingsAccordion.security ? 'linear-gradient(135deg, rgba(239,68,68,0.10) 0%, rgba(220,38,38,0.06) 100%)' : 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer', borderBottom: settingsAccordion.security ? '1px solid rgba(239,68,68,0.15)' : 'none', transition: 'background 0.2s' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: '#dc2626' }}>
                      <i className="fa-solid fa-shield-halved" style={{ color: '#ef4444', fontSize: '1.05rem' }}></i>
                      Güvenlik ve Giriş Bilgileri (Şifre Değiştir)
                    </span>
                    <i className={`fa-solid ${settingsAccordion.security ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ color: '#ef4444', fontSize: '0.85rem' }}></i>
                  </button>
                  {settingsAccordion.security && (
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(220,38,38,0.04) 100%)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '16px', padding: '1.5rem' }}>
                        <p style={{ fontSize: '0.85rem', color: '#7f1d1d', marginBottom: '1.25rem', lineHeight: '1.5', fontWeight: 500 }}>
                          <i className="fa-solid fa-lock" style={{ marginRight: '0.5rem' }}></i>
                          Buradan Neon PostgreSQL veritabanındaki yönetici bilgilerinizi güncelleyebilirsiniz.
                        </p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                          <div className="admin-input-group">
                            <label>Mevcut Şifreniz (Zorunlu)</label>
                            <input 
                              type="password" 
                              value={securityOldPassword} 
                              onChange={e => setSecurityOldPassword(e.target.value)} 
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff' }} 
                              placeholder="Kullandığınız şifre" 
                            />
                          </div>
                          
                          <div className="admin-input-group">
                            <label>Yeni Kullanıcı Adı (Opsiyonel)</label>
                            <input 
                              type="text" 
                              value={securityUsername} 
                              onChange={e => setSecurityUsername(e.target.value)} 
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff' }} 
                              placeholder="Değiştirmeyecekseniz boş bırakın" 
                            />
                          </div>

                          <div className="admin-input-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Yeni Şifreniz (Opsiyonel)</label>
                            <input 
                              type="password" 
                              value={securityNewPassword} 
                              onChange={e => setSecurityNewPassword(e.target.value)} 
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff' }} 
                              placeholder="Yeni şifrenizi girin (Değiştirmeyecekseniz boş bırakın)" 
                            />
                          </div>
                        </div>

                        <div className="admin-form-actions" style={{ marginTop: '1.5rem', justifyContent: 'flex-start' }}>
                          <button 
                            type="button" 
                            onClick={handleChangePassword} 
                            disabled={securityIsLoading} 
                            style={{ padding: '0.75rem 2rem', borderRadius: '8px', background: '#ef4444', color: '#fff', border: 'none', cursor: securityIsLoading ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                          >
                            {securityIsLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-save"></i>}
                            Bilgilerimi Güncelle
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── ACCORDION: Temel İletişim Bilgileri ── */}
                <div style={{ marginBottom: '0.75rem', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(2,132,199,0.2)', boxShadow: settingsAccordion.contact ? '0 4px 16px rgba(2,132,199,0.08)' : 'none', transition: 'box-shadow 0.2s' }}>
                  <button type="button" onClick={() => toggleSettingsSection('contact')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: settingsAccordion.contact ? 'linear-gradient(135deg, rgba(2,132,199,0.10) 0%, rgba(14,165,233,0.06) 100%)' : 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer', borderBottom: settingsAccordion.contact ? '1px solid rgba(2,132,199,0.15)' : 'none', transition: 'background 0.2s' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-light)' }}>
                      <i className="fa-solid fa-address-card" style={{ color: 'var(--primary)', fontSize: '1.05rem' }}></i>
                      Temel İletişim Bilgileri
                    </span>
                    <i className={`fa-solid ${settingsAccordion.contact ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ color: 'var(--primary)', fontSize: '0.85rem' }}></i>
                  </button>
                  {settingsAccordion.contact && (
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ background: 'linear-gradient(135deg, rgba(2,132,199,0.06) 0%, rgba(14,165,233,0.04) 100%)', border: '1px solid rgba(2,132,199,0.2)', borderRadius: '16px', padding: '1.5rem' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                          <i className="fa-solid fa-circle-info" style={{ color: 'var(--primary)', marginRight: '0.4rem' }}></i>
                          Bu bilgiler; sitenin footer'ında, iletişim sayfasında ve Google'a gönderilen <strong>LocalBusiness Schema</strong>'sında kullanılır.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-light)', marginBottom: '0.4rem', display: 'block' }}>
                              <i className="fa-solid fa-phone" style={{ color: 'var(--primary)', marginRight: '0.3rem' }}></i>Telefon Numarası
                            </label>
                            <input type="text" value={settingsData.phone || ''} onChange={e => setSettingsData({ ...settingsData, phone: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.9rem' }} placeholder="+90 232 000 00 00" />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-light)', marginBottom: '0.4rem', display: 'block' }}>
                              <i className="fa-solid fa-envelope" style={{ color: 'var(--primary)', marginRight: '0.3rem' }}></i>E-Posta Adresi
                            </label>
                            <input type="email" value={settingsData.email || ''} onChange={e => setSettingsData({ ...settingsData, email: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.9rem' }} placeholder="info@ajansrota.com" />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-light)', marginBottom: '0.4rem', display: 'block' }}>
                              <i className="fa-solid fa-globe" style={{ color: 'var(--primary)', marginRight: '0.3rem' }}></i>Site URL (Domain)
                            </label>
                            <input type="url" value={settingsData.site_url || ''} onChange={e => setSettingsData({ ...settingsData, site_url: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.9rem' }} placeholder="https://ajansrota.com" />
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>Google Schema için kullanılır — www olmadan yazın</span>
                          </div>
                          <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-light)', marginBottom: '0.4rem', display: 'block' }}>
                              <i className="fa-solid fa-envelope-circle-check" style={{ color: 'var(--primary)', marginRight: '0.3rem' }}></i>SEO / Schema E-postası
                            </label>
                            <input type="email" value={settingsData.contact_email || ''} onChange={e => setSettingsData({ ...settingsData, contact_email: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.9rem' }} placeholder="info@ajansrota.com" />
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>Schema.org kaydında görünür</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── ACCORDION: Görsel ve Logo Varlık Ayarları ── */}
                <div style={{ marginBottom: '0.75rem', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(2,132,199,0.2)', boxShadow: settingsAccordion.visuals ? '0 4px 16px rgba(2,132,199,0.08)' : 'none', transition: 'box-shadow 0.2s' }}>
                  <button type="button" onClick={() => toggleSettingsSection('visuals')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: settingsAccordion.visuals ? 'linear-gradient(135deg, rgba(2,132,199,0.10) 0%, rgba(14,165,233,0.06) 100%)' : 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer', borderBottom: settingsAccordion.visuals ? '1px solid rgba(2,132,199,0.15)' : 'none', transition: 'background 0.2s' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-light)' }}>
                      <i className="fa-solid fa-image" style={{ color: 'var(--primary)', fontSize: '1.05rem' }}></i>
                      Görsel ve Logo Varlık Ayarları
                    </span>
                    <i className={`fa-solid ${settingsAccordion.visuals ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ color: 'var(--primary)', fontSize: '0.85rem' }}></i>
                  </button>
                  {settingsAccordion.visuals && (<div style={{ padding: '1.5rem' }}>
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1.5rem',
              marginTop: '1rem'
            }}>
                  
                  {/* LOGOS GROUP */}
                  <div style={{
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                padding: '1.5rem',
                background: 'rgba(255,255,255,0.4)'
              }}>
                    <h4 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--text-light)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                      <i className="fa-solid fa-compass" style={{
                    color: 'var(--primary)'
                  }}></i> Logo Varlıkları
                    </h4>
                    <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1.25rem'
                }}>
                      <div>
                        {renderImageUploaderCard('logo_dark', 'Açık Tema Logosu (Masaüstü)', '240x60px', 'Örn: /images/logo_dark.png')}
                      </div>
                      <div>
                        {renderImageUploaderCard('logo_dark_mobile', 'Açık Tema Logosu (Mobil)', '120x45px veya 60x60px', 'Boş bırakılırsa masaüstü logosu kullanılır')}
                      </div>
                    </div>
                    <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1.25rem',
                  marginTop: '1.25rem'
                }}>
                      <div>
                        {renderImageUploaderCard('logo_light', 'Koyu/Şeffaf Tema Logosu (Masaüstü)', '240x60px', 'Örn: /images/logo_light.png')}
                      </div>
                      <div>
                        {renderImageUploaderCard('logo_light_mobile', 'Koyu/Şeffaf Tema Logosu (Mobil)', '120x45px veya 60x60px', 'Boş bırakılırsa masaüstü logosu kullanılır')}
                      </div>
                    </div>
                  </div>

                  {/* PAGES VISUALS GROUP */}
                  <div style={{
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                padding: '1.5rem',
                background: 'rgba(255,255,255,0.4)'
              }}>
                    <h4 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--text-light)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                      <i className="fa-solid fa-images" style={{
                    color: 'var(--primary)'
                  }}></i> Sayfa Görsel Varlıkları
                    </h4>
                    
                    {/* Hakkımızda */}
                    <div style={{
                  marginBottom: '1.5rem',
                  borderBottom: '1px dashed var(--glass-border)',
                  paddingBottom: '1.5rem'
                }}>
                      <span style={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)',
                    display: 'block',
                    marginBottom: '1rem'
                  }}>Hakkımızda Hikaye Görseli</span>
                      <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.25rem'
                  }}>
                        <div>
                          {renderImageUploaderCard('about_story_image', 'Hikaye Görseli (Masaüstü)', '1200x800px', 'Örn: /images/remote_freedom.png')}
                        </div>
                        <div>
                          {renderImageUploaderCard('about_story_image_mobile', 'Hikaye Görseli (Mobil)', '600x600px (Kare)', 'Boş bırakılırsa masaüstü görseli kullanılır')}
                        </div>
                      </div>
                    </div>

                    {/* İletişim Haritası */}
                    <div style={{
                  marginBottom: '1.5rem',
                  borderBottom: '1px dashed var(--glass-border)',
                  paddingBottom: '1.5rem'
                }}>
                      <span style={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)',
                    display: 'block',
                    marginBottom: '1rem'
                  }}>İletişim Hizmet Haritası</span>
                      <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.25rem'
                  }}>
                        <div>
                          {renderImageUploaderCard('contact_map_image', 'Harita Görseli (Masaüstü)', '1200x600px', 'Örn: /images/aegean_map_light.png')}
                        </div>
                        <div>
                          {renderImageUploaderCard('contact_map_image_mobile', 'Harita Görseli (Mobil)', '600x500px', 'Boş bırakılırsa masaüstü görseli kullanılır')}
                        </div>
                      </div>
                    </div>

                    {/* Referanslar Hero */}
                    <div style={{
                  marginBottom: '1.5rem'
                }}>
                      <span style={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)',
                    display: 'block',
                    marginBottom: '1rem'
                  }}>Müşteri Yorumları Kahraman (Hero) Görseli</span>
                      <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.25rem'
                  }}>
                        <div>
                          {renderImageUploaderCard('testimonials_hero_image', 'Hero Görseli (Masaüstü)', '1600x500px', 'Örn: /images/izmir_references_hero.png')}
                        </div>
                        <div>
                          {renderImageUploaderCard('testimonials_hero_image_mobile', 'Hero Görseli (Mobil)', '600x400px', 'Boş bırakılırsa masaüstü görseli kullanılır')}
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
                
<div className="admin-form-group">
                  <label>Google Gemini API Anahtarı (Yapay Zeka Blog Asistanı için Opsiyonel)</label>
                  <input type="password" value={settingsData.gemini_api_key || ''} onChange={e => setSettingsData({
                ...settingsData,
                gemini_api_key: e.target.value
              })} style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: '#fff'
              }} placeholder="AI Blog Asistanını çalıştırmak için Gemini API key girin (Boş bırakılırsa yerel şablon motoru kullanılır)" />
                </div>

                  </div>
                  )}
                </div>

                {/* ── ACCORDION: WhatsApp Yapı Zeka Asistan Ayarları ── */}
                <div style={{ marginBottom: '0.75rem', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(2,132,199,0.2)', boxShadow: settingsAccordion.whatsapp ? '0 4px 16px rgba(2,132,199,0.08)' : 'none', transition: 'box-shadow 0.2s' }}>
                  <button type="button" onClick={() => toggleSettingsSection('whatsapp')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: settingsAccordion.whatsapp ? 'linear-gradient(135deg, rgba(37,211,102,0.10) 0%, rgba(37,211,102,0.05) 100%)' : 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer', borderBottom: settingsAccordion.whatsapp ? '1px solid rgba(37,211,102,0.2)' : 'none', transition: 'background 0.2s' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-light)' }}>
                      <i className="fa-brands fa-whatsapp" style={{ color: '#25d366', fontSize: '1.1rem' }}></i>
                      WhatsApp Yapay Zeka Müşteri Asistanı Ayarları
                    </span>
                    <i className={`fa-solid ${settingsAccordion.whatsapp ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ color: '#25d366', fontSize: '0.85rem' }}></i>
                  </button>
                  {settingsAccordion.whatsapp && (
                  <div style={{ padding: '1.5rem' }}>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>WhatsApp Asistan Numarası (Örn: 905445844543)</label>
                    <input type="text" value={settingsData.whatsapp_assistant_phone || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  whatsapp_assistant_phone: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} placeholder="Sadece rakamlardan oluşan telefon numarasını girin" />
                  </div>
                  <div className="admin-form-group">
                    <label>Sohbet Robotu Soru/Konu Seçenekleri (Virgülle Ayırarak Yazın)</label>
                    <input type="text" value={settingsData.whatsapp_assistant_topics || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  whatsapp_assistant_topics: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} placeholder="Örn: Google / Meta Reklamı, SEO Çalışması, Sosyal Medya" />
                  </div>
                </div>
                  </div>
                  )}
                </div>

                

                {/* ── ACCORDION: Sosyal Medya Yönetimi Paket Fiyatları ── */}
                <div style={{ marginBottom: '0.75rem', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(2,132,199,0.2)', boxShadow: settingsAccordion.social_pricing ? '0 4px 16px rgba(2,132,199,0.08)' : 'none', transition: 'box-shadow 0.2s' }}>
                  <button type="button" onClick={() => toggleSettingsSection('social_pricing')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: settingsAccordion.social_pricing ? 'linear-gradient(135deg, rgba(2,132,199,0.10) 0%, rgba(14,165,233,0.06) 100%)' : 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer', borderBottom: settingsAccordion.social_pricing ? '1px solid rgba(2,132,199,0.15)' : 'none', transition: 'background 0.2s' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-light)' }}>
                      <i className="fa-solid fa-share-nodes" style={{ color: 'var(--primary)', fontSize: '1.05rem' }}></i>
                      Sosyal Medya Yönetimi Paket Fiyatları
                    </span>
                    <i className={`fa-solid ${settingsAccordion.social_pricing ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ color: 'var(--primary)', fontSize: '0.85rem' }}></i>
                  </button>
                  {settingsAccordion.social_pricing && (
                  <div style={{ padding: '1.5rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                  Hizmet bedeli hesaplayıcısında "Sosyal Medya Yönetimi" seçildiğinde gösterilecek 3 paketin adı, içerik miktarı, fiyatı ve dahil olan hizmetlerini buradan yönetin.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {/* Başlangıç Paketi */}
                  <div style={{ border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '1.25rem', background: 'linear-gradient(135deg, rgba(224,242,254,0.5) 0%, rgba(240,253,244,0.5) 100%)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <i className="fa-solid fa-seedling"></i> Başlangıç Paketi
                    </h4>
                    <div className="admin-form-group" style={{ marginBottom: '0.75rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Paket Adı</label>
                      <input type="text" value={settingsData.sm_pkg_baslangic_name || ''} onChange={e => setSettingsData({ ...settingsData, sm_pkg_baslangic_name: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.85rem' }} placeholder="Başlangıç Paketi" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <div className="admin-form-group">
                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Post/Ay</label>
                        <input type="number" value={settingsData.sm_pkg_baslangic_posts || ''} onChange={e => setSettingsData({ ...settingsData, sm_pkg_baslangic_posts: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.85rem' }} placeholder="12" />
                      </div>
                      <div className="admin-form-group">
                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Reels/Ay</label>
                        <input type="number" value={settingsData.sm_pkg_baslangic_reels || ''} onChange={e => setSettingsData({ ...settingsData, sm_pkg_baslangic_reels: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.85rem' }} placeholder="3" />
                      </div>
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: '0.75rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Aylık Fiyat (₺)</label>
                      <input type="number" value={settingsData.sm_pkg_baslangic_price || ''} onChange={e => setSettingsData({ ...settingsData, sm_pkg_baslangic_price: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.85rem' }} placeholder="8000" />
                    </div>
                    <div className="admin-form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Dahil Hizmetler (virgülle)</label>
                      <input type="text" value={settingsData.sm_pkg_baslangic_extras || ''} onChange={e => setSettingsData({ ...settingsData, sm_pkg_baslangic_extras: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.85rem' }} placeholder="Strateji,Grafik Tasarım" />
                    </div>
                  </div>

                  {/* Orta Paket */}
                  <div style={{ border: '2px solid rgba(2,132,199,0.3)', borderRadius: '16px', padding: '1.25rem', background: 'linear-gradient(135deg, rgba(224,242,254,0.6) 0%, rgba(219,234,254,0.6) 100%)', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: '-10px', right: '12px', background: 'var(--primary)', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.05em' }}>EN POPÜLER</span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <i className="fa-solid fa-rocket"></i> Orta Paket
                    </h4>
                    <div className="admin-form-group" style={{ marginBottom: '0.75rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Paket Adı</label>
                      <input type="text" value={settingsData.sm_pkg_orta_name || ''} onChange={e => setSettingsData({ ...settingsData, sm_pkg_orta_name: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.85rem' }} placeholder="Orta Paket" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <div className="admin-form-group">
                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Post/Ay</label>
                        <input type="number" value={settingsData.sm_pkg_orta_posts || ''} onChange={e => setSettingsData({ ...settingsData, sm_pkg_orta_posts: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.85rem' }} placeholder="16" />
                      </div>
                      <div className="admin-form-group">
                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Reels/Ay</label>
                        <input type="number" value={settingsData.sm_pkg_orta_reels || ''} onChange={e => setSettingsData({ ...settingsData, sm_pkg_orta_reels: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.85rem' }} placeholder="6" />
                      </div>
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: '0.75rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Aylık Fiyat (₺)</label>
                      <input type="number" value={settingsData.sm_pkg_orta_price || ''} onChange={e => setSettingsData({ ...settingsData, sm_pkg_orta_price: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.85rem' }} placeholder="12000" />
                    </div>
                    <div className="admin-form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Dahil Hizmetler (virgülle)</label>
                      <input type="text" value={settingsData.sm_pkg_orta_extras || ''} onChange={e => setSettingsData({ ...settingsData, sm_pkg_orta_extras: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.85rem' }} placeholder="Strateji,Grafik Tasarım,Story" />
                    </div>
                  </div>

                  {/* Zirve Paketi */}
                  <div style={{ border: '1px solid rgba(180,83,9,0.3)', borderRadius: '16px', padding: '1.25rem', background: 'linear-gradient(135deg, rgba(254,243,199,0.5) 0%, rgba(253,230,138,0.3) 100%)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#b45309', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <i className="fa-solid fa-crown"></i> Zirve Paketi
                    </h4>
                    <div className="admin-form-group" style={{ marginBottom: '0.75rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Paket Adı</label>
                      <input type="text" value={settingsData.sm_pkg_zirve_name || ''} onChange={e => setSettingsData({ ...settingsData, sm_pkg_zirve_name: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.85rem' }} placeholder="Zirve Paketi" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <div className="admin-form-group">
                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Post/Ay</label>
                        <input type="number" value={settingsData.sm_pkg_zirve_posts || ''} onChange={e => setSettingsData({ ...settingsData, sm_pkg_zirve_posts: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.85rem' }} placeholder="20" />
                      </div>
                      <div className="admin-form-group">
                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Reels/Ay</label>
                        <input type="number" value={settingsData.sm_pkg_zirve_reels || ''} onChange={e => setSettingsData({ ...settingsData, sm_pkg_zirve_reels: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.85rem' }} placeholder="9" />
                      </div>
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: '0.75rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Aylık Fiyat (₺)</label>
                      <input type="number" value={settingsData.sm_pkg_zirve_price || ''} onChange={e => setSettingsData({ ...settingsData, sm_pkg_zirve_price: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.85rem' }} placeholder="18000" />
                    </div>
                    <div className="admin-form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Dahil Hizmetler (virgülle)</label>
                      <input type="text" value={settingsData.sm_pkg_zirve_extras || ''} onChange={e => setSettingsData({ ...settingsData, sm_pkg_zirve_extras: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontSize: '0.85rem' }} placeholder="Strateji,Grafik Tasarım,Story,Hashtag Araştırması,Rakip Analizi" />
                    </div>
                  </div>
                  </div>
                  </div>
                  )}
                </div>

                {/* ── ACCORDION: Kurumsal (Hakkımızda) Sayfa İçerik Yönetimi ── */}
                <div style={{ marginBottom: '0.75rem', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(2,132,199,0.2)', boxShadow: settingsAccordion.about_content ? '0 4px 16px rgba(2,132,199,0.08)' : 'none', transition: 'box-shadow 0.2s' }}>
                  <button type="button" onClick={() => toggleSettingsSection('about_content')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: settingsAccordion.about_content ? 'linear-gradient(135deg, rgba(2,132,199,0.10) 0%, rgba(14,165,233,0.06) 100%)' : 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer', borderBottom: settingsAccordion.about_content ? '1px solid rgba(2,132,199,0.15)' : 'none', transition: 'background 0.2s' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-light)' }}>
                      <i className="fa-solid fa-address-card" style={{ color: 'var(--primary)', fontSize: '1.05rem' }}></i>
                      Kurumsal (Hakkımızda) Sayfa İçerik Yönetimi
                    </span>
                    <i className={`fa-solid ${settingsAccordion.about_content ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ color: 'var(--primary)', fontSize: '0.85rem' }}></i>
                  </button>
                  {settingsAccordion.about_content && (
                  <div style={{ padding: '1.5rem' }}>
                <div style={{
              border: '1px solid var(--glass-border)',
              borderRadius: '20px',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.45) 100%)',
              boxShadow: 'var(--shadow-md)',
              marginBottom: '2.5rem'
            }}>
                  
                  {/* Premium Nested Tab Navigation */}
                  <div style={{
                display: 'flex',
                gap: '0.5rem',
                borderBottom: '1px solid var(--glass-border)',
                paddingBottom: '1rem',
                marginBottom: '1.5rem',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
              }} className="admin-subtabs">
                    {[{
                  id: 'hero',
                  label: 'Giriş & Kahraman',
                  icon: 'fa-solid fa-crown'
                }, {
                  id: 'story',
                  label: 'Hikaye & Anlayış',
                  icon: 'fa-solid fa-book-open'
                }, {
                  id: 'culture',
                  label: 'Kültür & Kurallar',
                  icon: 'fa-solid fa-gavel'
                }, {
                  id: 'coffee',
                  label: 'Kahve Daveti',
                  icon: 'fa-solid fa-mug-hot'
                }].map(tab => <button key={tab.id} type="button" onClick={() => setAboutSettingsSubTab(tab.id)} className={`btn ${aboutSettingsSubTab === tab.id ? 'btn-primary' : 'btn-secondary'}`} style={{
                  padding: '0.6rem 1.2rem',
                  fontSize: '0.8rem',
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '600',
                  border: aboutSettingsSubTab === tab.id ? 'none' : '1px solid var(--glass-border)',
                  background: aboutSettingsSubTab === tab.id ? 'var(--primary)' : 'rgba(255, 255, 255, 0.4)',
                  color: aboutSettingsSubTab === tab.id ? '#fff' : 'var(--text-light)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}>
                        <i className={tab.icon} style={{
                    fontSize: '0.9rem'
                  }}></i>
                        <span>{tab.label}</span>
                      </button>)}
                  </div>

                  {/* SUBTAB 1: HERO */}
                  {aboutSettingsSubTab === 'hero' && <div style={{
                animation: 'fadeIn 0.3s ease'
              }}>
                      <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.25rem'
                }}>
                        Hakkımızda sayfasının en üstünde yer alan karşılama başlıklarını ve kısa tanıtım spotunu buradan düzenleyin.
                      </p>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-light)',
                      marginBottom: '0.4rem',
                      display: 'block'
                    }}>Hakkımızda Sayfa Başlığı (Giriş)</label>
                          <input type="text" value={settingsData.about_title_top || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      about_title_top: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }} placeholder="Varsayılan: Biz Kimiz?" />
                        </div>
                        <div className="admin-form-group">
                          <label style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-light)',
                      marginBottom: '0.4rem',
                      display: 'block'
                    }}>Hakkımızda Sayfa Başlığı (Alt Vurgu/Span)</label>
                          <input type="text" value={settingsData.about_title_span || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      about_title_span: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }} placeholder="Varsayılan: Ege Sıcaklığı ve Dijital Performans" />
                        </div>
                      </div>
                      <div className="admin-form-group" style={{
                  marginTop: '1rem'
                }}>
                        <label style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--text-light)',
                    marginBottom: '0.4rem',
                    display: 'block'
                  }}>Hakkımızda Giriş Açıklaması (Spot Tanıtım)</label>
                        <textarea value={settingsData.about_desc || ''} onChange={e => setSettingsData({
                    ...settingsData,
                    about_desc: e.target.value
                  })} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff',
                    minHeight: '80px',
                    lineHeight: '1.5'
                  }} placeholder="Başlığın hemen altındaki açıklayıcı spot metin..." />
                      </div>
                    </div>}

                  {/* SUBTAB 2: STORY */}
                  {aboutSettingsSubTab === 'story' && <div style={{
                animation: 'fadeIn 0.3s ease'
              }}>
                      <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.25rem'
                }}>
                        Sayfadaki geniş "Samimi Hikayemiz" kartının başlığını, paragraflarını ve vurgulanan tırnak içindeki alıntı metnini düzenleyin.
                      </p>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-light)',
                      marginBottom: '0.4rem',
                      display: 'block'
                    }}>Hikaye Kartı Etiketi (Küçük Tag)</label>
                          <input type="text" value={settingsData.about_story_tag || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      about_story_tag: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }} placeholder="Varsayılan: BİZİM ANLAYIŞIMIZ" />
                        </div>
                        <div className="admin-form-group">
                          <label style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-light)',
                      marginBottom: '0.4rem',
                      display: 'block'
                    }}>Hikaye Kartı Başlığı (H2)</label>
                          <input type="text" value={settingsData.about_story_title || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      about_story_title: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }} placeholder="Varsayılan: E-postalara ve Ofislere Hapsolmayan Özgürlük" />
                        </div>
                      </div>
                      <div className="admin-form-group" style={{
                  marginTop: '1rem'
                }}>
                        <label style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--text-light)',
                    marginBottom: '0.4rem',
                    display: 'block'
                  }}>Hikaye Paragrafı 1</label>
                        <textarea value={settingsData.about_story_p1 || ''} onChange={e => setSettingsData({
                    ...settingsData,
                    about_story_p1: e.target.value
                  })} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff',
                    minHeight: '120px',
                    lineHeight: '1.5'
                  }} />
                      </div>
                      <div className="admin-form-group" style={{
                  marginTop: '1rem'
                }}>
                        <label style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--text-light)',
                    marginBottom: '0.4rem',
                    display: 'block'
                  }}>Hikaye Paragrafı 2</label>
                        <textarea value={settingsData.about_story_p2 || ''} onChange={e => setSettingsData({
                    ...settingsData,
                    about_story_p2: e.target.value
                  })} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff',
                    minHeight: '120px',
                    lineHeight: '1.5'
                  }} />
                      </div>
                      <div className="admin-form-group" style={{
                  marginTop: '1rem'
                }}>
                        <label style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--text-light)',
                    marginBottom: '0.4rem',
                    display: 'block'
                  }}>Vurgulanan Alıntı Sözü (Quote)</label>
                        <textarea value={settingsData.about_story_quote || ''} onChange={e => setSettingsData({
                    ...settingsData,
                    about_story_quote: e.target.value
                  })} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff',
                    minHeight: '60px',
                    lineHeight: '1.5'
                  }} placeholder="Çift tırnak içinde gösterilecek vurucu ifade..." />
                      </div>
                    </div>}

                  {/* SUBTAB 3: CULTURE */}
                  {aboutSettingsSubTab === 'culture' && <div style={{
                animation: 'fadeIn 0.3s ease'
              }}>
                      <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.25rem'
                }}>
                        Çalışma kültürü bölümündeki 3 altın kuralın başlığını, açıklamalarını ve FontAwesome ikon sınıflarını özelleştirin.
                      </p>
                      <div className="admin-form-group">
                        <label style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--text-light)',
                    marginBottom: '0.4rem',
                    display: 'block'
                  }}>Kültür Bölüm Ana Başlığı</label>
                        <input type="text" value={settingsData.about_culture_title || ''} onChange={e => setSettingsData({
                    ...settingsData,
                    about_culture_title: e.target.value
                  })} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff'
                  }} placeholder="Varsayılan: Çalışma Kültürümüzün 3 Altın Kuralı" />
                      </div>

                      <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem',
                  marginTop: '1.5rem'
                }}>
                        
                        {/* Rule 1 Card */}
                        <div style={{
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    background: 'rgba(14,165,233,0.02)',
                    position: 'relative'
                  }}>
                          <span style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.75rem',
                      fontSize: '1.5rem',
                      fontWeight: '800',
                      opacity: '0.08',
                      pointerEvents: 'none'
                    }}>01</span>
                          <h6 style={{
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: 'var(--primary)',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                            <i className={settingsData.about_rule1_icon || "fa-solid fa-eye"}></i> Altın Kural 1
                          </h6>
                          <div className="admin-form-group" style={{
                      marginBottom: '0.75rem'
                    }}>
                            <label style={{
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>Kural Başlığı</label>
                            <input type="text" value={settingsData.about_rule1_title || ''} onChange={e => setSettingsData({
                        ...settingsData,
                        about_rule1_title: e.target.value
                      })} style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.85rem'
                      }} />
                          </div>
                          <div className="admin-form-group" style={{
                      marginBottom: '0.75rem'
                    }}>
                            <label style={{
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>İkon Sınıfı (FontAwesome)</label>
                            <input type="text" value={settingsData.about_rule1_icon || ''} onChange={e => setSettingsData({
                        ...settingsData,
                        about_rule1_icon: e.target.value
                      })} style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.85rem'
                      }} placeholder="fa-solid fa-eye" />
                          </div>
                          <div className="admin-form-group" style={{
                      marginBottom: '0'
                    }}>
                            <label style={{
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>Kural Açıklaması</label>
                            <textarea value={settingsData.about_rule1_desc || ''} onChange={e => setSettingsData({
                        ...settingsData,
                        about_rule1_desc: e.target.value
                      })} style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.8rem',
                        minHeight: '80px',
                        lineHeight: '1.4'
                      }} />
                          </div>
                        </div>

                        {/* Rule 2 Card */}
                        <div style={{
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    background: 'rgba(244,63,94,0.02)',
                    position: 'relative'
                  }}>
                          <span style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.75rem',
                      fontSize: '1.5rem',
                      fontWeight: '800',
                      opacity: '0.08',
                      pointerEvents: 'none'
                    }}>02</span>
                          <h6 style={{
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: 'var(--secondary)',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                            <i className={settingsData.about_rule2_icon || "fa-solid fa-bolt"}></i> Altın Kural 2
                          </h6>
                          <div className="admin-form-group" style={{
                      marginBottom: '0.75rem'
                    }}>
                            <label style={{
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>Kural Başlığı</label>
                            <input type="text" value={settingsData.about_rule2_title || ''} onChange={e => setSettingsData({
                        ...settingsData,
                        about_rule2_title: e.target.value
                      })} style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.85rem'
                      }} />
                          </div>
                          <div className="admin-form-group" style={{
                      marginBottom: '0.75rem'
                    }}>
                            <label style={{
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>İkon Sınıfı (FontAwesome)</label>
                            <input type="text" value={settingsData.about_rule2_icon || ''} onChange={e => setSettingsData({
                        ...settingsData,
                        about_rule2_icon: e.target.value
                      })} style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.85rem'
                      }} placeholder="fa-solid fa-bolt" />
                          </div>
                          <div className="admin-form-group" style={{
                      marginBottom: '0'
                    }}>
                            <label style={{
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>Kural Açıklaması</label>
                            <textarea value={settingsData.about_rule2_desc || ''} onChange={e => setSettingsData({
                        ...settingsData,
                        about_rule2_desc: e.target.value
                      })} style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.8rem',
                        minHeight: '80px',
                        lineHeight: '1.4'
                      }} />
                          </div>
                        </div>

                        {/* Rule 3 Card */}
                        <div style={{
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    background: 'rgba(16,185,129,0.02)',
                    position: 'relative'
                  }}>
                          <span style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.75rem',
                      fontSize: '1.5rem',
                      fontWeight: '800',
                      opacity: '0.08',
                      pointerEvents: 'none'
                    }}>03</span>
                          <h6 style={{
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: '#10b981',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                            <i className={settingsData.about_rule3_icon || "fa-solid fa-spa"}></i> Altın Kural 3
                          </h6>
                          <div className="admin-form-group" style={{
                      marginBottom: '0.75rem'
                    }}>
                            <label style={{
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>Kural Başlığı</label>
                            <input type="text" value={settingsData.about_rule3_title || ''} onChange={e => setSettingsData({
                        ...settingsData,
                        about_rule3_title: e.target.value
                      })} style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.85rem'
                      }} />
                          </div>
                          <div className="admin-form-group" style={{
                      marginBottom: '0.75rem'
                    }}>
                            <label style={{
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>İkon Sınıfı (FontAwesome)</label>
                            <input type="text" value={settingsData.about_rule3_icon || ''} onChange={e => setSettingsData({
                        ...settingsData,
                        about_rule3_icon: e.target.value
                      })} style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.85rem'
                      }} placeholder="fa-solid fa-spa" />
                          </div>
                          <div className="admin-form-group" style={{
                      marginBottom: '0'
                    }}>
                            <label style={{
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>Kural Açıklaması</label>
                            <textarea value={settingsData.about_rule3_desc || ''} onChange={e => setSettingsData({
                        ...settingsData,
                        about_rule3_desc: e.target.value
                      })} style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.8rem',
                        minHeight: '80px',
                        lineHeight: '1.4'
                      }} />
                          </div>
                        </div>

                      </div>
                    </div>}

                  {/* SUBTAB 4: COFFEE */}
                  {aboutSettingsSubTab === 'coffee' && <div style={{
                animation: 'fadeIn 0.3s ease'
              }}>
                      <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.25rem'
                }}>
                        Hakkımızda sayfasının en altında yer alan görüntülü görüşme / kahve daveti kartının içeriğini ve buton yönlendirmesini düzenleyin.
                      </p>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-light)',
                      marginBottom: '0.4rem',
                      display: 'block'
                    }}>Kahve Daveti Başlığı</label>
                          <input type="text" value={settingsData.about_coffee_title || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      about_coffee_title: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }} placeholder="Varsayılan: Çevrimiçi ya da Yüz Yüze Bir Kahveye?" />
                        </div>
                        <div className="admin-form-group">
                          <label style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-light)',
                      marginBottom: '0.4rem',
                      display: 'block'
                    }}>Buton Çağrı Metni</label>
                          <input type="text" value={settingsData.about_coffee_btn || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      about_coffee_btn: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }} placeholder="Varsayılan: Bizimle Tanışın" />
                        </div>
                      </div>
                      <div className="admin-form-group" style={{
                  marginTop: '1rem'
                }}>
                        <label style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--text-light)',
                    marginBottom: '0.4rem',
                    display: 'block'
                  }}>Davet Açıklama Paragrafı</label>
                        <textarea value={settingsData.about_coffee_desc || ''} onChange={e => setSettingsData({
                    ...settingsData,
                    about_coffee_desc: e.target.value
                  })} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff',
                    minHeight: '80px',
                    lineHeight: '1.5'
                  }} />
                      </div>
                    </div>}

                  </div>
                  </div>
                  )}
                </div>

                {/* ── ACCORDION: İletişim Sayfası İçerik & Bilgi Yönetimi ── */}
                <div style={{ marginBottom: '0.75rem', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(2,132,199,0.2)', boxShadow: settingsAccordion.contact_page ? '0 4px 16px rgba(2,132,199,0.08)' : 'none', transition: 'box-shadow 0.2s' }}>
                  <button type="button" onClick={() => toggleSettingsSection('contact_page')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: settingsAccordion.contact_page ? 'linear-gradient(135deg, rgba(2,132,199,0.10) 0%, rgba(14,165,233,0.06) 100%)' : 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer', borderBottom: settingsAccordion.contact_page ? '1px solid rgba(2,132,199,0.15)' : 'none', transition: 'background 0.2s' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-light)' }}>
                      <i className="fa-solid fa-envelope" style={{ color: 'var(--primary)', fontSize: '1.05rem' }}></i>
                      İletişim Sayfası İçerik & Bilgi Yönetimi
                    </span>
                    <i className={`fa-solid ${settingsAccordion.contact_page ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ color: 'var(--primary)', fontSize: '0.85rem' }}></i>
                  </button>
                  {settingsAccordion.contact_page && (
                  <div style={{ padding: '1.5rem' }}>


                {/* Premium Nested Tab Navigation for Contact */}
                <div style={{
              display: 'flex',
              gap: '0.5rem',
              borderBottom: '1px solid var(--glass-border)',
              paddingBottom: '1rem',
              marginBottom: '1.5rem',
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }} className="admin-subtabs">
                  {[{
                id: 'info',
                label: 'Genel & Sayfa Girişi',
                icon: 'fa-solid fa-circle-info'
              }, {
                id: 'contact_fields',
                label: 'İletişim Bilgileri',
                icon: 'fa-solid fa-address-book'
              }, {
                id: 'office_hours',
                label: 'Mesai Saatleri & Tatiller',
                icon: 'fa-solid fa-clock'
              }].map(tab => <button key={tab.id} type="button" onClick={() => setContactSettingsSubTab(tab.id)} className={`btn ${contactSettingsSubTab === tab.id ? 'btn-primary' : 'btn-secondary'}`} style={{
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: contactSettingsSubTab === tab.id ? 'none' : '1px solid var(--glass-border)',
                background: contactSettingsSubTab === tab.id ? 'var(--primary)' : 'rgba(255, 255, 255, 0.4)',
                color: contactSettingsSubTab === tab.id ? '#fff' : 'var(--text-light)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600'
              }}>
                      <i className={tab.icon}></i>
                      {tab.label}
                    </button>)}
                </div>

                {/* Subtab Contents */}
                <div style={{
              border: '1px solid var(--glass-border)',
              borderRadius: '16px',
              padding: '1.5rem',
              background: 'rgba(255,255,255,0.4)',
              marginBottom: '2rem'
            }}>
                  
                  {contactSettingsSubTab === 'info' && <div className="fade-in">
                      <h4 style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: 'var(--text-light)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                        <i className="fa-solid fa-circle-info" style={{
                    color: 'var(--primary)'
                  }}></i> Genel & Sayfa Giriş Ayarları
                      </h4>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-light)',
                      marginBottom: '0.4rem',
                      display: 'block'
                    }}>İletişim Sayfası Başlığı (Giriş)</label>
                          <input type="text" value={settingsData.contact_title_top || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      contact_title_top: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }} placeholder="Varsayılan: Bizimle" />
                        </div>
                        <div className="admin-form-group">
                          <label style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-light)',
                      marginBottom: '0.4rem',
                      display: 'block'
                    }}>İletişim Sayfası Başlığı (Alt/Span)</label>
                          <input type="text" value={settingsData.contact_title_span || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      contact_title_span: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }} placeholder="Varsayılan: İletişime Geçin" />
                        </div>
                      </div>
                      <div className="admin-form-group" style={{
                  marginTop: '1rem'
                }}>
                        <label style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--text-light)',
                    marginBottom: '0.4rem',
                    display: 'block'
                  }}>İletişim Sayfası Açıklaması (Giriş Spotu)</label>
                        <textarea value={settingsData.contact_desc || ''} onChange={e => setSettingsData({
                    ...settingsData,
                    contact_desc: e.target.value
                  })} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff',
                    minHeight: '100px',
                    lineHeight: '1.5'
                  }} placeholder="Harita ve formun üstündeki açıklama metni..." />
                      </div>
                    </div>}

                  {contactSettingsSubTab === 'contact_fields' && <div className="fade-in">
                      <h4 style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: 'var(--text-light)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                        <i className="fa-solid fa-address-book" style={{
                    color: 'var(--primary)'
                  }}></i> Global İletişim Bilgileri
                      </h4>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-light)',
                      marginBottom: '0.4rem',
                      display: 'block'
                    }}>Telefon Numarası</label>
                          <input type="text" value={settingsData.phone || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      phone: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }} placeholder="Örn: +90 544 584 45 43" />
                        </div>
                        <div className="admin-form-group">
                          <label style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-light)',
                      marginBottom: '0.4rem',
                      display: 'block'
                    }}>E-Posta Adresi</label>
                          <input type="email" value={settingsData.email || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      email: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }} placeholder="Örn: hello@ajansrota.com" />
                        </div>
                      </div>
                      <div className="admin-form-row" style={{
                  marginTop: '1rem'
                }}>
                        <div className="admin-form-group" style={{
                    flex: '2'
                  }}>
                          <label style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-light)',
                      marginBottom: '0.4rem',
                      display: 'block'
                    }}>Adres / Çalışma Modelimiz</label>
                          <input type="text" value={settingsData.address || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      address: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }} placeholder="Örn: Uzaktan Çalışma (Remote) / İzmir, Ege" />
                        </div>
                        <div className="admin-form-group" style={{
                    flex: '1'
                  }}>
                          <label style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-light)',
                      marginBottom: '0.4rem',
                      display: 'block'
                    }}>Google Maps Arama/URL Adresi</label>
                          <input type="text" value={settingsData.google_maps_url || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      google_maps_url: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }} placeholder="Haritada Göster bağlantısı için arama URL'si" />
                        </div>
                      </div>
                    </div>}

                  {contactSettingsSubTab === 'office_hours' && <div className="fade-in">
                      <h4 style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: 'var(--text-light)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                        <i className="fa-solid fa-clock" style={{
                    color: 'var(--primary)'
                  }}></i> Çalışma Saatleri &amp; Otomatik Mesai Durumu
                      </h4>
                      <div className="admin-form-group">
                        <label style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--text-light)',
                    marginBottom: '0.4rem',
                    display: 'block'
                  }}>Çalışma Saatleri Açıklama Metni (Footer'da listelenir)</label>
                        <input type="text" value={settingsData.working_hours_text || ''} onChange={e => setSettingsData({
                    ...settingsData,
                    working_hours_text: e.target.value
                  })} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff'
                  }} placeholder="Örn: Pazartesi – Cuma: 09:00 – 18:30" />
                      </div>
                      <div className="admin-form-row" style={{
                  marginTop: '1rem'
                }}>
                        <div className="admin-form-group">
                          <label style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-light)',
                      marginBottom: '0.4rem',
                      display: 'block'
                    }}>Mesai Başlangıç Saati (SS:DD formatında)</label>
                          <input type="text" value={settingsData.working_hours_start || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      working_hours_start: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }} placeholder="Örn: 09:00" />
                        </div>
                        <div className="admin-form-group">
                          <label style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-light)',
                      marginBottom: '0.4rem',
                      display: 'block'
                    }}>Mesai Bitiş Saati (SS:DD formatında)</label>
                          <input type="text" value={settingsData.working_hours_end || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      working_hours_end: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }} placeholder="Örn: 18:30" />
                        </div>
                      </div>
                      <div className="admin-form-group" style={{
                  marginTop: '1rem'
                }}>
                        <label style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--text-light)',
                    marginBottom: '0.4rem',
                    display: 'block'
                  }}>Özel Tatil Günleri (YYYY-MM-DD formatında, virgülle ayırarak yazın)</label>
                        <input type="text" value={settingsData.custom_holidays || ''} onChange={e => setSettingsData({
                    ...settingsData,
                    custom_holidays: e.target.value
                  })} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff'
                  }} placeholder="Örn: 2026-06-25, 2026-06-26, 2026-07-01" />
                        <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    display: 'block',
                    marginTop: '0.4rem',
                    lineHeight: '1.4'
                  }}>
                          <i className="fa-solid fa-circle-info" style={{
                      color: 'var(--primary)',
                      marginRight: '0.25rem'
                    }}></i>
                          Ulusal resmi tatiller (1 Ocak, 23 Nisan, 1 Mayıs, 19 Mayıs, 15 Temmuz, 30 Ağustos, 29 Ekim) otomatik olarak kapalı olarak hesaplanır.
                        </span>
                      </div>
                    </div>}

                  </div>
                  </div>
                  )}
                </div>

                {/* ── ACCORDION: Yasal Metin ve Politika Yönetimi ── */}
                <div style={{ marginBottom: '0.75rem', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(2,132,199,0.2)', boxShadow: settingsAccordion.legal_content ? '0 4px 16px rgba(2,132,199,0.08)' : 'none', transition: 'box-shadow 0.2s' }}>
                  <button type="button" onClick={() => toggleSettingsSection('legal_content')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: settingsAccordion.legal_content ? 'linear-gradient(135deg, rgba(2,132,199,0.10) 0%, rgba(14,165,233,0.06) 100%)' : 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer', borderBottom: settingsAccordion.legal_content ? '1px solid rgba(2,132,199,0.15)' : 'none', transition: 'background 0.2s' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-light)' }}>
                      <i className="fa-solid fa-file-shield" style={{ color: 'var(--primary)', fontSize: '1.05rem' }}></i>
                      Yasal Metin ve Politika Yönetimi
                    </span>
                    <i className={`fa-solid ${settingsAccordion.legal_content ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ color: 'var(--primary)', fontSize: '0.85rem' }}></i>
                  </button>
                  {settingsAccordion.legal_content && (
                  <div style={{ padding: '1.5rem' }}>
                <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginBottom: '1.5rem',
              lineHeight: '1.4'
            }}>
                  Sitenizin alt kısmında (Footer) yer alan yasal metinleri, kullanım şartlarını ve veri politikalarını buradan düzenleyebilirsiniz. HTML etiketleri (Örn: &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;) kullanabilirsiniz.
                </p>
                <div style={{
              border: '1px solid var(--glass-border)',
              borderRadius: '20px',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.45) 100%)',
              boxShadow: 'var(--shadow-md)',
              marginBottom: '2.5rem'
            }}>
                  
                  {/* Legal Nested Tab Navigation */}
                  <div style={{
                display: 'flex',
                gap: '0.5rem',
                borderBottom: '1px solid var(--glass-border)',
                paddingBottom: '1rem',
                marginBottom: '1.5rem',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
              }} className="admin-subtabs">
                    {[{
                  id: 'privacy',
                  label: 'Gizlilik Politikası',
                  icon: 'fa-solid fa-user-lock'
                }, {
                  id: 'terms',
                  label: 'Kullanım Koşulları',
                  icon: 'fa-solid fa-scale-balanced'
                }, {
                  id: 'kvkk',
                  label: 'KVKK Aydınlatma Metni',
                  icon: 'fa-solid fa-shield-halved'
                }, {
                  id: 'cookies',
                  label: 'Çerez Politikası',
                  icon: 'fa-solid fa-cookie-bite'
                }].map(tab => <button key={tab.id} type="button" onClick={() => setLegalSettingsSubTab(tab.id)} className={`btn ${legalSettingsSubTab === tab.id ? 'btn-primary' : 'btn-secondary'}`} style={{
                  padding: '0.6rem 1.2rem',
                  fontSize: '0.8rem',
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '600',
                  border: legalSettingsSubTab === tab.id ? 'none' : '1px solid var(--glass-border)',
                  background: legalSettingsSubTab === tab.id ? 'var(--primary)' : 'rgba(255, 255, 255, 0.4)',
                  color: legalSettingsSubTab === tab.id ? '#fff' : 'var(--text-light)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}>
                        <i className={tab.icon} style={{
                    fontSize: '0.9rem'
                  }}></i>
                        <span>{tab.label}</span>
                      </button>)}
                  </div>

                  {/* RENDER HELPER FOR LEGAL PAGES */}
                  {(() => {
                const getTabInfo = () => {
                  switch (legalSettingsSubTab) {
                    case 'privacy':
                      return {
                        titleLabel: 'Gizlilik Politikası Sayfa Başlığı',
                        contentLabel: 'Gizlilik Politikası İçeriği',
                        titleKey: 'privacy_policy_title',
                        contentKey: 'privacy_policy_content',
                        elementId: 'privacy_policy_textarea',
                        placeholder: 'Gizlilik Politikası'
                      };
                    case 'terms':
                      return {
                        titleLabel: 'Kullanım Koşulları Sayfa Başlığı',
                        contentLabel: 'Kullanım Koşulları İçeriği',
                        titleKey: 'terms_of_use_title',
                        contentKey: 'terms_of_use_content',
                        elementId: 'terms_of_use_textarea',
                        placeholder: 'Kullanım Koşulları'
                      };
                    case 'kvkk':
                      return {
                        titleLabel: 'KVKK Aydınlatma Metni Sayfa Başlığı',
                        contentLabel: 'KVKK Aydınlatma Metni İçeriği',
                        titleKey: 'kvkk_text_title',
                        contentKey: 'kvkk_text_content',
                        elementId: 'kvkk_text_textarea',
                        placeholder: 'KVKK Aydınlatma Metni'
                      };
                    case 'cookies':
                      return {
                        titleLabel: 'Çerez Politikası Sayfa Başlığı',
                        contentLabel: 'Çerez Politikası İçeriği',
                        titleKey: 'cookies_policy_title',
                        contentKey: 'cookies_policy_content',
                        elementId: 'cookies_policy_textarea',
                        placeholder: 'Çerez Politikası'
                      };
                    default:
                      return null;
                  }
                };
                const tabInfo = getTabInfo();
                if (!tabInfo) return null;
                return <div style={{
                  animation: 'fadeIn 0.3s ease'
                }}>
                        <div className="admin-form-group">
                          <label style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-light)',
                      marginBottom: '0.4rem',
                      display: 'block'
                    }}>{tabInfo.titleLabel}</label>
                          <input type="text" value={settingsData[tabInfo.titleKey] || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      [tabInfo.titleKey]: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }} placeholder={tabInfo.placeholder} />
                        </div>
                        
                        <div className="admin-form-group" style={{
                    marginTop: '1.25rem'
                  }}>
                          <label style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-light)',
                      marginBottom: '0.4rem',
                      display: 'block'
                    }}>
                            {tabInfo.contentLabel} (HTML Destekli Zengin Editör)
                          </label>

                          {/* TOOLBAR */}
                          <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.4rem',
                      padding: '0.6rem 0.8rem',
                      border: '1px solid var(--glass-border)',
                      borderBottom: 'none',
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px',
                      background: 'rgba(248, 250, 252, 0.8)',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                            <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.35rem',
                        alignItems: 'center'
                      }}>
                              <button type="button" onClick={() => setLegalEditorPreview(false)} style={{
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.75rem',
                          borderRadius: '6px',
                          background: !legalEditorPreview ? 'var(--primary)' : 'transparent',
                          color: !legalEditorPreview ? '#fff' : 'var(--text-light)',
                          fontWeight: '600',
                          border: !legalEditorPreview ? 'none' : '1px solid transparent',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                                <i className="fa-solid fa-pen-to-square"></i> Düzenle
                              </button>
                              <button type="button" onClick={() => setLegalEditorPreview(true)} style={{
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.75rem',
                          borderRadius: '6px',
                          background: legalEditorPreview ? 'var(--primary)' : 'transparent',
                          color: legalEditorPreview ? '#fff' : 'var(--text-light)',
                          fontWeight: '600',
                          border: legalEditorPreview ? 'none' : '1px solid transparent',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                                <i className="fa-solid fa-eye"></i> Canlı Önizleme
                              </button>

                              {!legalEditorPreview && <>
                                  <span style={{
                            height: '1.2rem',
                            width: '1px',
                            background: 'var(--glass-border)',
                            margin: '0 0.4rem'
                          }}></span>
                                  {[{
                            icon: 'fa-bold',
                            label: 'Kalın Yap (<strong>)',
                            action: () => insertHtmlTag(tabInfo.elementId, tabInfo.contentKey, 'strong')
                          }, {
                            icon: 'fa-italic',
                            label: 'Eğik Yap (<em>)',
                            action: () => insertHtmlTag(tabInfo.elementId, tabInfo.contentKey, 'em')
                          }, {
                            icon: 'fa-underline',
                            label: 'Altı Çizili (<u>)',
                            action: () => insertHtmlTag(tabInfo.elementId, tabInfo.contentKey, 'u')
                          }, {
                            icon: 'fa-heading',
                            label: 'Alt Başlık (<h3>)',
                            action: () => insertHtmlTag(tabInfo.elementId, tabInfo.contentKey, 'h3')
                          }, {
                            icon: 'fa-paragraph',
                            label: 'Paragraf Ekle (<p>)',
                            action: () => insertHtmlTag(tabInfo.elementId, tabInfo.contentKey, 'p')
                          }, {
                            icon: 'fa-list-ul',
                            label: 'Liste Ekle (<ul>)',
                            action: () => insertHtmlTag(tabInfo.elementId, tabInfo.contentKey, 'ul')
                          }, {
                            icon: 'fa-list',
                            label: 'Liste Ögesi (<li>)',
                            action: () => insertHtmlTag(tabInfo.elementId, tabInfo.contentKey, 'li')
                          }, {
                            icon: 'fa-link',
                            label: 'Link Ekle (<a>)',
                            action: () => insertHtmlTag(tabInfo.elementId, tabInfo.contentKey, 'a')
                          }].map((btn, i) => <button key={i} type="button" onClick={btn.action} title={btn.label} style={{
                            padding: '0.3rem 0.5rem',
                            fontSize: '0.75rem',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.8)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--text-light)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '28px',
                            height: '28px',
                            transition: 'all 0.2s'
                          }} onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(14,165,233,0.08)';
                            e.currentTarget.style.borderColor = 'var(--primary)';
                          }} onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                            e.currentTarget.style.borderColor = 'var(--glass-border)';
                          }}>
                                      <i className={`fa-solid ${btn.icon}`}></i>
                                    </button>)}
                                </>}
                            </div>

                            <button type="button" onClick={() => loadLegalTemplate(legalSettingsSubTab)} style={{
                        padding: '0.3rem 0.6rem',
                        fontSize: '0.72rem',
                        borderRadius: '6px',
                        background: 'rgba(245, 158, 11, 0.1)',
                        color: 'rgba(217, 119, 6, 1)',
                        fontWeight: '600',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        transition: 'all 0.2s'
                      }} onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
                      }} onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                      }}>
                              <i className="fa-solid fa-file-signature"></i> Hazır Şablon Doldur
                            </button>
                          </div>

                          {/* EDITOR OR PREVIEW */}
                          {legalEditorPreview ? <div className="legal-page-content" style={{
                      padding: '1.5rem',
                      border: '1px solid var(--glass-border)',
                      borderBottomLeftRadius: '8px',
                      borderBottomRightRadius: '8px',
                      background: '#fff',
                      minHeight: '300px',
                      overflowY: 'auto',
                      maxHeight: '500px',
                      lineHeight: '1.7',
                      color: 'var(--text-light)',
                      fontSize: '0.9rem'
                    }} dangerouslySetInnerHTML={{
                      __html: settingsData[tabInfo.contentKey] || '<p style="color: var(--text-muted); font-style: italic;">İçerik boş...</p>'
                    }} /> : <textarea id={tabInfo.elementId} value={settingsData[tabInfo.contentKey] || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      [tabInfo.contentKey]: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderBottomLeftRadius: '8px',
                      borderBottomRightRadius: '8px',
                      borderTopLeftRadius: '0px',
                      borderTopRightRadius: '0px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff',
                      minHeight: '300px',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      lineHeight: '1.6'
                    }} placeholder="HTML formatında yasal metin içeriği yazın veya yukarıdaki hazır araçları/şablonları kullanın..." />}
                        </div>
                      </div>
              })()}

                  </div>
                  </div>
                  )}
                </div>

                {/* ── ACCORDION: Sayfa Gösterim ve Menü Yönetimi ── */}
                <div style={{ marginBottom: '0.75rem', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(2,132,199,0.2)', boxShadow: settingsAccordion.menu ? '0 4px 16px rgba(2,132,199,0.08)' : 'none', transition: 'box-shadow 0.2s' }}>
                  <button type="button" onClick={() => toggleSettingsSection('menu')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: settingsAccordion.menu ? 'linear-gradient(135deg, rgba(2,132,199,0.10) 0%, rgba(14,165,233,0.06) 100%)' : 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer', borderBottom: settingsAccordion.menu ? '1px solid rgba(2,132,199,0.15)' : 'none', transition: 'background 0.2s' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-light)' }}>
                      <i className="fa-solid fa-eye-slash" style={{ color: 'var(--primary)', fontSize: '1.05rem' }}></i>
                      Sayfa Gösterim ve Menü Yönetimi
                    </span>
                    <i className={`fa-solid ${settingsAccordion.menu ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ color: 'var(--primary)', fontSize: '0.85rem' }}></i>
                  </button>
                  {settingsAccordion.menu && (
                  <div style={{ padding: '1.5rem' }}>
                <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginBottom: '1.5rem',
              lineHeight: '1.4'
            }}>
                  Aşağıdaki listeden dilediğiniz sayfaları ziyaretçilere gizleyebilir veya yeniden görünür kılabilirsiniz. Gizlenen sayfalar menülerden (Header/Footer) kaldırılır ve doğrudan erişime kapatılır (anasayfaya yönlendirilir).
                </p>
                <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
              marginBottom: '2.5rem'
            }}>
                  {[{
                key: 'hide_page_hakkimizda',
                label: 'Hakkımızda Sayfası'
              }, {
                key: 'hide_page_ekiplerimiz',
                label: 'Ekiplerimiz Sayfası'
              }, {
                key: 'hide_page_blog',
                label: 'Blog Sayfası'
              }, {
                key: 'hide_page_izmir',
                label: 'Neden İzmir? Sayfası'
              }, {
                key: 'hide_page_iletisim',
                label: 'İletişim Sayfası'
              }, {
                key: 'hide_page_seo',
                label: 'Ücretsiz SEO Analiz Aracı'
              }, {
                key: 'hide_page_kobi',
                label: 'KOBİ Dijitalleşme Endeksi'
              }, {
                key: 'hide_page_rakip',
                label: 'Siz vs. Rakibiniz (Kıyaslama)'
              }, {
                key: 'hide_page_kreatif',
                label: 'Kreatif Reklam Vitrini'
              }, {
                key: 'hide_page_akademi',
                label: 'Rota Akademi Sayfası'
              }, {
                key: 'hide_page_referanslar',
                label: 'Referanslarımız Sayfası'
              }].map(item => <label key={item.key} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '1rem',
                background: 'rgba(15, 23, 42, 0.02)',
                border: '1px solid var(--glass-border)',
                borderRadius: '10px',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.2s ease'
              }} className="page-hide-label">
                      <input type="checkbox" checked={!!settingsData[item.key]} onChange={e => setSettingsData({
                  ...settingsData,
                  [item.key]: e.target.checked
                })} style={{
                  width: '1.1rem',
                  height: '1.1rem',
                  cursor: 'pointer'
                }} />
                      <div>
                        <span style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--text-light)',
                    display: 'block'
                  }}>{item.label}</span>
                        <span style={{
                    fontSize: '0.75rem',
                    color: settingsData[item.key] ? '#ef4444' : '#10b981',
                    fontWeight: 600
                  }}>
                          {settingsData[item.key] ? '🚫 Gizli (Menüden kaldırıldı)' : '✅ Aktif (Menüde görünür)'}
                        </span>
                      </div>
                    </label>)}
                 </div>
                 </div>
                  )}
                </div>

                {/* ── ACCORDION: Sayfa Bazlı SEO ve Meta Etiket Ayarları ── */}
                <div style={{ marginBottom: '0.75rem', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(2,132,199,0.2)', boxShadow: settingsAccordion.seo ? '0 4px 16px rgba(2,132,199,0.08)' : 'none', transition: 'box-shadow 0.2s' }}>
                  <button type="button" onClick={() => toggleSettingsSection('seo')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: settingsAccordion.seo ? 'linear-gradient(135deg, rgba(2,132,199,0.10) 0%, rgba(14,165,233,0.06) 100%)' : 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer', borderBottom: settingsAccordion.seo ? '1px solid rgba(2,132,199,0.15)' : 'none', transition: 'background 0.2s' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-light)' }}>
                      <i className="fa-solid fa-magnifying-glass-chart" style={{ color: 'var(--primary)', fontSize: '1.05rem' }}></i>
                      Sayfa Bazlı SEO ve Meta Etiket Ayarları
                    </span>
                    <i className={`fa-solid ${settingsAccordion.seo ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ color: 'var(--primary)', fontSize: '0.85rem' }}></i>
                  </button>
                  {settingsAccordion.seo && (
                  <div style={{ padding: '1.5rem' }}>
                {/* Secondary navigation for different page SEOs */}
                <div style={{
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
              marginBottom: '1.5rem',
              background: 'rgba(15,23,42,0.03)',
              padding: '6px',
              borderRadius: '10px'
            }}>
                  {[{
                id: 'home',
                label: 'Ana Sayfa / Genel'
              }, {
                id: 'izmir',
                label: 'Neden İzmir'
              }, {
                id: 'referanslar',
                label: 'Referanslar'
              }, {
                id: 'iletisim',
                label: 'İletişim'
              }, {
                id: 'hakkimizda',
                label: 'Hakkımızda'
              }, {
                id: 'ekiplerimiz',
                label: 'Ekiplerimiz'
              }, {
                id: 'blog',
                label: 'Blog'
              }, {
                id: 'seo',
                label: 'SEO Analiz Aracı'
              }].map(tab => <button key={tab.id} type="button" className={`btn ${activeSeoTab === tab.id ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveSeoTab(tab.id)} style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem',
                borderRadius: '6px'
              }}>
                      {tab.label}
                    </button>)}
                </div>

                {activeSeoTab === 'home' && <div>
                    <div className="admin-form-group">
                      <label>Meta Başlığı (Title) - Ana Sayfa / Genel</label>
                      <input type="text" value={settingsData.meta_title || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  meta_title: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} placeholder="Örn: Ajans Rota | İzmir Google & Meta Reklam ve SEO Ajansı" />
                    </div>
                    <div className="admin-form-group">
                      <label>Meta Açıklaması (Description) - Ana Sayfa / Genel</label>
                      <textarea rows="3" value={settingsData.meta_description || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  meta_description: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff',
                  fontFamily: 'sans-serif'
                }} placeholder="Örn: İzmir'de Google Ads, Meta reklamları, SEO ve sosyal medya yönetimi..." />
                    </div>
                    <div className="admin-form-group" style={{
                marginBottom: '1.5rem'
              }}>
                      <label>Meta Anahtar Kelimeler (Keywords) - Ana Sayfa / Genel</label>
                      <input type="text" value={settingsData.meta_keywords || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  meta_keywords: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} placeholder="Örn: izmir dijital ajans, google ads ajansı izmir, seo ajansı..." />
                    </div>
                  </div>}

                {activeSeoTab === 'izmir' && <div>
                    <div className="admin-form-group">
                      <label>Meta Başlığı (Title) - Neden İzmir Sayfası</label>
                      <input type="text" value={settingsData.seo_izmir_title || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_izmir_title: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} />
                    </div>
                    <div className="admin-form-group">
                      <label>Meta Açıklaması (Description) - Neden İzmir Sayfası</label>
                      <textarea rows="3" value={settingsData.seo_izmir_description || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_izmir_description: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff',
                  fontFamily: 'sans-serif'
                }} />
                    </div>
                    <div className="admin-form-group" style={{
                marginBottom: '1.5rem'
              }}>
                      <label>Meta Anahtar Kelimeler (Keywords) - Neden İzmir Sayfası</label>
                      <input type="text" value={settingsData.seo_izmir_keywords || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_izmir_keywords: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} />
                    </div>
                  </div>}

                {activeSeoTab === 'referanslar' && <div>
                    <div className="admin-form-group">
                      <label>Meta Başlığı (Title) - Referanslar Sayfası</label>
                      <input type="text" value={settingsData.seo_referanslar_title || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_referanslar_title: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} />
                    </div>
                    <div className="admin-form-group">
                      <label>Meta Açıklaması (Description) - Referanslar Sayfası</label>
                      <textarea rows="3" value={settingsData.seo_referanslar_description || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_referanslar_description: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff',
                  fontFamily: 'sans-serif'
                }} />
                    </div>
                    <div className="admin-form-group" style={{
                marginBottom: '1.5rem'
              }}>
                      <label>Meta Anahtar Kelimeler (Keywords) - Referanslar Sayfası</label>
                      <input type="text" value={settingsData.seo_referanslar_keywords || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_referanslar_keywords: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} />
                    </div>
                  </div>}

                {activeSeoTab === 'iletisim' && <div>
                    <div className="admin-form-group">
                      <label>Meta Başlığı (Title) - İletişim Sayfası</label>
                      <input type="text" value={settingsData.seo_iletisim_title || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_iletisim_title: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} />
                    </div>
                    <div className="admin-form-group">
                      <label>Meta Açıklaması (Description) - İletişim Sayfası</label>
                      <textarea rows="3" value={settingsData.seo_iletisim_description || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_iletisim_description: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff',
                  fontFamily: 'sans-serif'
                }} />
                    </div>
                    <div className="admin-form-group" style={{
                marginBottom: '1.5rem'
              }}>
                      <label>Meta Anahtar Kelimeler (Keywords) - İletişim Sayfası</label>
                      <input type="text" value={settingsData.seo_iletisim_keywords || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_iletisim_keywords: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} />
                    </div>
                  </div>}

                {activeSeoTab === 'hakkimizda' && <div>
                    <div className="admin-form-group">
                      <label>Meta Başlığı (Title) - Hakkımızda Sayfası</label>
                      <input type="text" value={settingsData.seo_hakkimizda_title || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_hakkimizda_title: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} />
                    </div>
                    <div className="admin-form-group">
                      <label>Meta Açıklaması (Description) - Hakkımızda Sayfası</label>
                      <textarea rows="3" value={settingsData.seo_hakkimizda_description || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_hakkimizda_description: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff',
                  fontFamily: 'sans-serif'
                }} />
                    </div>
                    <div className="admin-form-group" style={{
                marginBottom: '1.5rem'
              }}>
                      <label>Meta Anahtar Kelimeler (Keywords) - Hakkımızda Sayfası</label>
                      <input type="text" value={settingsData.seo_hakkimizda_keywords || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_hakkimizda_keywords: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} />
                    </div>
                  </div>}

                {activeSeoTab === 'ekiplerimiz' && <div>
                    <div className="admin-form-group">
                      <label>Meta Başlığı (Title) - Ekiplerimiz Sayfası</label>
                      <input type="text" value={settingsData.seo_ekiplerimiz_title || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_ekiplerimiz_title: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} />
                    </div>
                    <div className="admin-form-group">
                      <label>Meta Açıklaması (Description) - Ekiplerimiz Sayfası</label>
                      <textarea rows="3" value={settingsData.seo_ekiplerimiz_description || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_ekiplerimiz_description: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff',
                  fontFamily: 'sans-serif'
                }} />
                    </div>
                    <div className="admin-form-group" style={{
                marginBottom: '1.5rem'
              }}>
                      <label>Meta Anahtar Kelimeler (Keywords) - Ekiplerimiz Sayfası</label>
                      <input type="text" value={settingsData.seo_ekiplerimiz_keywords || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_ekiplerimiz_keywords: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} />
                    </div>
                  </div>}

                {activeSeoTab === 'blog' && <div>
                    <div className="admin-form-group">
                      <label>Meta Başlığı (Title) - Blog Sayfası</label>
                      <input type="text" value={settingsData.seo_blog_title || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_blog_title: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} />
                    </div>
                    <div className="admin-form-group">
                      <label>Meta Açıklaması (Description) - Blog Sayfası</label>
                      <textarea rows="3" value={settingsData.seo_blog_description || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_blog_description: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff',
                  fontFamily: 'sans-serif'
                }} />
                    </div>
                    <div className="admin-form-group" style={{
                marginBottom: '1.5rem'
              }}>
                      <label>Meta Anahtar Kelimeler (Keywords) - Blog Sayfası</label>
                      <input type="text" value={settingsData.seo_blog_keywords || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_blog_keywords: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} />
                    </div>
                  </div>}

                {activeSeoTab === 'seo' && <div>
                    <div className="admin-form-group">
                      <label>Meta Başlığı (Title) - SEO Analiz Aracı</label>
                      <input type="text" value={settingsData.seo_seo_title || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_seo_title: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} />
                    </div>
                    <div className="admin-form-group">
                      <label>Meta Açıklaması (Description) - SEO Analiz Aracı</label>
                      <textarea rows="3" value={settingsData.seo_seo_description || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_seo_description: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff',
                  fontFamily: 'sans-serif'
                }} />
                    </div>
                    <div className="admin-form-group" style={{
                marginBottom: '1.5rem'
              }}>
                      <label>Meta Anahtar Kelimeler (Keywords) - SEO Analiz Aracı</label>
                      <input type="text" value={settingsData.seo_seo_keywords || ''} onChange={e => setSettingsData({
                  ...settingsData,
                  seo_seo_keywords: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff'
                }} />
                    </div>
                  </div>}
                <h3 style={{
              marginTop: '2.5rem',
              marginBottom: '1.25rem',
              fontSize: '1.1rem',
              color: 'var(--text-light)',
              borderBottom: '1px solid var(--glass-border)',
              paddingBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
                  <i className="fa-solid fa-sitemap" style={{
                color: 'var(--primary)',
                fontSize: '1.1rem'
              }}></i> XML Site Haritası (Sitemap) Yönetimi
                </h3>
                <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginBottom: '1.25rem',
              lineHeight: '1.5'
            }}>
                  Google ve diğer arama motoru botlarının sitenizi tarayabilmesi için XML formatında bir site haritası oluşturun. Site haritası, blog yazısı veya sayfa gizleme/gösterme ayarları her kaydedildiğinde <strong>otomatik olarak güncellenir</strong>. İsterseniz aşağıdaki butondan manuel olarak da tetikleyebilirsiniz.
                </p>

                <div style={{
              background: 'rgba(14, 165, 233, 0.03)',
              border: '1px dashed var(--glass-border-hover)',
              borderRadius: '10px',
              padding: '1.25rem',
              marginBottom: '2rem'
            }}>
                  <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                    <div>
                      <span style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    color: 'var(--text-light)'
                  }}>
                        Site Haritası Adresi (GSC için):
                      </span>
                      <span style={{
                    fontSize: '0.8rem',
                    color: 'var(--primary)',
                    fontFamily: 'monospace',
                    display: 'block',
                    marginTop: '4px',
                    wordBreak: 'break-all'
                  }}>
                        {window.location.origin}/sitemap.xml
                      </span>
                    </div>
                    <button type="button" disabled={sitemapLoading} onClick={handleGenerateSitemap} className="btn btn-secondary" style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.8rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                      {sitemapLoading ? <>
                          <div className="seo-spinner" style={{
                      width: '12px',
                      height: '12px',
                      borderWidth: '1.5px'
                    }}></div>
                          Oluşturuluyor...
                        </> : <>
                          <i className="fa-solid fa-arrows-rotate"></i>
                          Şimdi Güncelle
                        </>}
                    </button>
                  </div>

                  {sitemapStatus && <div style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                background: 'rgba(22, 163, 74, 0.05)',
                border: '1px solid rgba(22, 163, 74, 0.15)',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                      <i className="fa-solid fa-circle-check" style={{
                  fontSize: '1rem'
                }}></i>
                      <div>
                        <strong>{sitemapStatus.message}</strong>
                        <span style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    marginTop: '2px'
                  }}>
                          Son Güncellenme: {sitemapStatus.lastUpdated} | <a href={sitemapStatus.url} target="_blank" rel="noopener noreferrer" style={{
                      color: 'var(--primary)',
                      textDecoration: 'underline'
                    }}>Site haritasını gör</a>
                        </span>
                      </div>
                    </div>}

                  {sitemapError && <div style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                      <i className="fa-solid fa-circle-xmark" style={{
                  fontSize: '1rem'
                }}></i>
                      <span>{sitemapError}</span>
                    </div>}
                </div>
                  </div>
                  )}
                </div>

                <div className="admin-form-actions" style={{ marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary">Kaydet</button>
                </div>
              </form>
            </div>
  );
}
