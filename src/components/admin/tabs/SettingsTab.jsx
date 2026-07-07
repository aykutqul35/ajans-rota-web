import { useState } from 'react';

export default function SettingsTab({
  settingsData, setSettingsData, handleSaveAll, isSaving, authToken,
  waPhone, setWaPhone, waApiKey, setWaApiKey,
  securityOldPassword, setSecurityOldPassword, securityUsername, setSecurityUsername,
  securityNewPassword, setSecurityNewPassword, handleChangePassword, securityIsLoading,
  renderImageUploaderCard
}) {
  const [aboutSettingsSubTab, setAboutSettingsSubTab] = useState('hero');
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

  const toggleSettingsSection = key => setSettingsAccordion(prev => ({ ...prev, [key]: !prev[key] }));
  const upd = (key, val) => setSettingsData({ ...settingsData, [key]: val });

  // ── Legal template loader ──
  const loadLegalTemplate = tabId => {
    if (!window.confirm("Bu işlem mevcut içeriğinizi şablon ile sıfırlayacaktır. Devam etmek istiyor musunuz?")) return;
    const templates = {
      privacy: `<h3>1. Veri Sorumlusu ve Genel Prensipler</h3>\n<p><strong>Ajans Rota</strong> olarak, web sitemizi ziyaret eden kullanıcılarımızın gizliliğini korumak en temel önceliklerimizden biridir.</p>\n\n<h3>2. Toplanan Kişisel Veriler</h3>\n<p>Web sitemizde yer alan araçları kullandığınızda aşağıdaki verileriniz işlenmektedir:</p>\n<ul>\n  <li>Adınız, soyadınız ve şirket bilgileriniz</li>\n  <li>E-posta adresiniz ve telefon numaranız</li>\n  <li>Web sitenizin adresi (analiz amaçlı)</li>\n</ul>\n\n<h3>3. Çerezler ve Üçüncü Taraf Kodlar</h3>\n<p>Ziyaretçi deneyimini iyileştirmek amacıyla çerezler ve <strong>Google Analytics, Google Tag Manager ve Meta Pixel</strong> kodları entegre edilmiştir.</p>\n\n<h3>4. Veri Güvenliği</h3>\n<p>Tüm verileriniz güvenli bir veri tabanında saklanmakta olup, yetkisiz erişimlere karşı gerekli tüm teknik önlemler alınmıştır.</p>`,
      terms: `<h3>1. Kabul Koşulları</h3>\n<p>Bu web sitesini ziyaret ederek bu Kullanım Koşulları'nı tamamen kabul etmiş sayılırsınız.</p>\n\n<h3>2. Hizmetlerin Sınırları</h3>\n<p>Sitemizde sunulan ücretsiz analiz araçları tamamen tavsiye ve bilgilendirme niteliğindedir.</p>\n\n<h3>3. Fikri Mülkiyet Hakları</h3>\n<p>Bu web sitesinin tasarımı ve tüm içerikleri Ajans Rota'ya aittir ve telif hakkı yasalarıyla korunmaktadır.</p>\n\n<h3>4. Değişiklik Hakları</h3>\n<p>Ajans Rota, bu Kullanım Koşulları'nı önceden bildirimde bulunmaksızın güncelleme hakkını saklı tutar.</p>`,
      kvkk: `<h3>1. Veri Sorumlusu ve Kanun Kapsamı</h3>\n<p>6698 sayılı KVKK uyarınca, kişisel verileriniz <strong>Ajans Rota</strong> tarafından işlenebilecektir.</p>\n\n<h3>2. Kişisel Verilerin İşlenme Amaçları</h3>\n<ul>\n  <li>İletişim taleplerinizin yanıtlanması</li>\n  <li>Analiz raporlarının tarafınıza sunulması</li>\n  <li>Hizmetlerin bütçe ve lokasyon bazlı planlanması</li>\n</ul>\n\n<h3>3. Kişisel Verilerin Aktarılması</h3>\n<p>Verileriniz yalnızca yasal olarak yetkili kurumlara aktarılabilecektir.</p>\n\n<h3>4. İlgili Kişi Olarak Haklarınız</h3>\n<p>Taleplerinizi <strong>hello@ajansrota.com</strong> adresine iletebilirsiniz.</p>`,
      cookies: `<h3>1. Çerezlerin Kullanımı</h3>\n<p>Web sitemizi en verimli şekilde kullanabilmeniz için çerezler kullanmaktayız.</p>\n\n<h3>2. Çerez Türleri</h3>\n<ul>\n  <li><strong>Zorunlu Çerezler:</strong> Web sitesinin düzgün çalışması için gereklidir.</li>\n  <li><strong>Performans Çerezleri:</strong> Site performansını iyileştirmemizi sağlar.</li>\n  <li><strong>Hedefleme Çerezleri:</strong> İlgi alanlarınıza uygun reklamlar sunmak için kullanılır.</li>\n</ul>\n\n<h3>3. Çerezlerin Kontrolü</h3>\n<p>Tarayıcınızın ayarlarından çerezleri engelleyebilir veya silebilirsiniz.</p>`
    };
    const fieldMap = { privacy: 'privacy_policy_content', terms: 'terms_of_use_content', kvkk: 'kvkk_text_content', cookies: 'cookies_policy_content' };
    upd(fieldMap[tabId], templates[tabId] || '');
  };

  // ── HTML tag inserter ──
  const insertHtmlTag = (elementId, fieldName, tagOpen) => {
    const textarea = document.getElementById(elementId);
    if (!textarea) return;
    const start = textarea.selectionStart, end = textarea.selectionEnd;
    const text = textarea.value, selectedText = text.substring(start, end);
    let replacement = '';
    if (tagOpen === 'a') { const url = prompt('URL:', 'https://'); if (url === null) return; replacement = `<a href="${url}" target="_blank" style="color: var(--primary); text-decoration: underline;">${selectedText || 'Bağlantı Metni'}</a>`; }
    else if (tagOpen === 'ul') replacement = `<ul>\n  <li>${selectedText || 'Liste ögesi'}</li>\n</ul>`;
    else if (tagOpen === 'li') replacement = `<li>${selectedText || 'Liste ögesi'}</li>`;
    else replacement = `<${tagOpen}>${selectedText}</${tagOpen}>`;
    upd(fieldName, text.substring(0, start) + replacement + text.substring(end));
    setTimeout(() => { textarea.focus(); textarea.setSelectionRange(start + replacement.length, start + replacement.length); }, 50);
  };

  // ── Sitemap generator ──
  const handleGenerateSitemap = async () => {
    setSitemapLoading(true); setSitemapError(''); setSitemapStatus(null);
    try {
      const res = await fetch('/api.php?action=generate_sitemap', { headers: { 'Authorization': `Bearer ${authToken}` } });
      const data = await res.json();
      if (res.ok && data.success) setSitemapStatus({ message: data.message, url: data.url, lastUpdated: data.last_updated });
      else setSitemapError(data.error || 'Site haritası oluşturulamadı.');
    } catch { setSitemapError('Sunucu bağlantı hatası.'); }
    finally { setSitemapLoading(false); }
  };

  // ── Shared CSS helpers ──
  const inputCls = "w-full py-3 px-3 rounded-lg border border-glass-border bg-white text-sm outline-none focus:border-primary transition-colors";
  const textareaCls = "w-full py-3 px-3 rounded-lg border border-glass-border bg-white text-sm leading-relaxed outline-none focus:border-primary transition-colors font-[inherit]";

  // ── Accordion wrapper ──
  const Accordion = ({ id, icon, iconColor, title, borderColor = 'rgba(2,132,199,0.2)', children }) => {
    const isOpen = settingsAccordion[id];
    return (
      <div className="mb-2 rounded-[14px] overflow-hidden transition-shadow" style={{ border: `1px solid ${borderColor}`, boxShadow: isOpen ? `0 4px 16px ${borderColor.replace('0.2', '0.08')}` : 'none' }}>
        <button type="button" onClick={() => toggleSettingsSection(id)} className={`w-full flex items-center justify-between py-4 px-5 border-none cursor-pointer transition-colors ${isOpen ? 'bg-sky-500/5' : 'bg-white/70'}`} style={isOpen ? { borderBottom: `1px solid ${borderColor}` } : {}}>
          <span className="flex items-center gap-2.5 font-heading font-bold text-base text-text-light"><i className={icon} style={{ color: iconColor || 'var(--primary)', fontSize: '1.05rem' }}></i>{title}</span>
          <i className={`fa-solid ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-sm`} style={{ color: iconColor || 'var(--primary)' }}></i>
        </button>
        {isOpen && <div className="p-6">{children}</div>}
      </div>
    );
  };

  // ── Sub-tab nav helper ──
  const SubTabNav = ({ tabs, active, setActive }) => (
    <div className="flex gap-2 border-b border-glass-border pb-4 mb-6 overflow-x-auto whitespace-nowrap admin-subtabs">
      {tabs.map(tab => <button key={tab.id} type="button" onClick={() => setActive(tab.id)} className={`py-2.5 px-5 rounded-lg inline-flex items-center gap-2 text-xs font-semibold cursor-pointer transition-all ${active === tab.id ? 'bg-primary text-white border-none' : 'bg-white/40 text-text-light border border-glass-border'}`}>
        <i className={`${tab.icon} text-sm`}></i><span>{tab.label}</span>
      </button>)}
    </div>
  );

  // ── Field helpers ──
  const Field = ({ label, field, type = 'text', placeholder = '', hint, ...rest }) => (
    <div className="admin-form-group">
      <label className="text-sm font-semibold text-text-light mb-1.5 block">{label}</label>
      {type === 'textarea'
        ? <textarea value={settingsData[field] || ''} onChange={e => upd(field, e.target.value)} className={`${textareaCls} min-h-[100px]`} placeholder={placeholder} {...rest} />
        : <input type={type} value={settingsData[field] || ''} onChange={e => upd(field, e.target.value)} className={inputCls} placeholder={placeholder} {...rest} />}
      {hint && <span className="text-xs text-text-muted mt-1 block">{hint}</span>}
    </div>
  );

  // ── SEO form for a page ──
  const SeoForm = ({ prefix, pageName }) => (
    <div>
      <Field label={`Meta Başlığı (Title) - ${pageName}`} field={`${prefix}_title`} />
      <Field label={`Meta Açıklaması (Description) - ${pageName}`} field={`${prefix}_description`} type="textarea" />
      <Field label={`Meta Anahtar Kelimeler (Keywords) - ${pageName}`} field={`${prefix}_keywords`} />
    </div>
  );

  // ── SM Package Card ──
  const SmPkgCard = ({ prefix, title, icon, colorCls, badge }) => (
    <div className={`border border-glass-border rounded-2xl p-5 relative ${colorCls}`}>
      {badge && <span className="absolute -top-2.5 right-3 bg-primary text-white text-[0.6rem] font-bold py-0.5 px-2 rounded-full tracking-wider">{badge}</span>}
      <h4 className="text-sm font-bold mb-4 flex items-center gap-1.5"><i className={icon}></i> {title}</h4>
      <Field label="Paket Adı" field={`${prefix}_name`} placeholder={title} />
      <div className="grid grid-cols-2 gap-2 my-3">
        <div className="admin-form-group"><label className="text-xs font-semibold">Post/Ay</label><input type="number" value={settingsData[`${prefix}_posts`] || ''} onChange={e => upd(`${prefix}_posts`, e.target.value)} className={inputCls} /></div>
        <div className="admin-form-group"><label className="text-xs font-semibold">Reels/Ay</label><input type="number" value={settingsData[`${prefix}_reels`] || ''} onChange={e => upd(`${prefix}_reels`, e.target.value)} className={inputCls} /></div>
      </div>
      <Field label="Aylık Fiyat (₺)" field={`${prefix}_price`} type="number" />
      <Field label="Dahil Hizmetler (virgülle)" field={`${prefix}_extras`} />
    </div>
  );

  // ── Rule Card ──
  const RuleCard = ({ num, prefix, color, bgColor }) => (
    <div className="border border-glass-border rounded-xl p-5 relative" style={{ background: bgColor }}>
      <span className="absolute top-2 right-3 text-2xl font-extrabold opacity-[0.08] pointer-events-none">{num}</span>
      <h6 className="text-sm font-bold mb-4 flex items-center gap-1.5" style={{ color }}><i className={settingsData[`${prefix}_icon`] || 'fa-solid fa-star'}></i> Altın Kural {num.replace('0','')}</h6>
      <Field label="Kural Başlığı" field={`${prefix}_title`} />
      <Field label="İkon Sınıfı (FontAwesome)" field={`${prefix}_icon`} />
      <Field label="Kural Açıklaması" field={`${prefix}_desc`} type="textarea" />
    </div>
  );

  return (
    <div>
      <div className="admin-section-title">Genel Sistem ve Arayüz Ayarları (Settings)</div>
      <form onSubmit={e => { e.preventDefault(); handleSaveAll(); }}>
        <p className="text-sm text-text-muted mb-6 leading-relaxed">Web sitenizin genel ayarlarını, görsel varlıklarını, SEO meta etiketlerini ve site haritasını buradan yapılandırabilirsiniz.</p>

        {/* ── WhatsApp Bildirimler ── */}
        <Accordion id="webhook" icon="fa-brands fa-whatsapp" iconColor="#25D366" title="SaaS Bildirim Ayarları (WhatsApp)" borderColor="rgba(99,102,241,0.2)">
          <div className="text-sm text-text-light mb-5 leading-relaxed p-4 bg-green-500/5 rounded-lg border border-green-500/20">
            <strong>Kurulum Adımları:</strong><br/>1. +34 624 54 22 28 numarasını rehberinize "CallMeBot" olarak kaydedin.<br/>2. "I allow callmebot to send me messages" yazıp gönderin.<br/>3. Gelen API Key'i aşağıya girin.
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="admin-form-group"><label>WhatsApp Numaranız</label><input type="text" value={waPhone} onChange={e => { setWaPhone(e.target.value); localStorage.setItem('rota_wa_phone', e.target.value); }} className={inputCls} placeholder="+905321234567" /></div>
            <div className="admin-form-group"><label>API Key (CallMeBot)</label><input type="text" value={waApiKey} onChange={e => { setWaApiKey(e.target.value); localStorage.setItem('rota_wa_apikey', e.target.value); }} className={inputCls} placeholder="Örn: 123456" /></div>
          </div>
        </Accordion>

        {/* ── Güvenlik ── */}
        <Accordion id="security" icon="fa-solid fa-shield-halved" iconColor="#ef4444" title="Güvenlik ve Giriş Bilgileri (Şifre Değiştir)" borderColor="rgba(239,68,68,0.2)">
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
            <p className="text-sm text-red-900 mb-5 leading-relaxed font-medium"><i className="fa-solid fa-lock mr-2"></i>Neon PostgreSQL yönetici bilgilerinizi güncelleyin.</p>
            <div className="grid grid-cols-2 gap-6">
              <div className="admin-input-group"><label>Mevcut Şifreniz (Zorunlu)</label><input type="password" value={securityOldPassword} onChange={e => setSecurityOldPassword(e.target.value)} className={inputCls} placeholder="Kullandığınız şifre" /></div>
              <div className="admin-input-group"><label>Yeni Kullanıcı Adı (Opsiyonel)</label><input type="text" value={securityUsername} onChange={e => setSecurityUsername(e.target.value)} className={inputCls} placeholder="Değiştirmeyecekseniz boş bırakın" /></div>
              <div className="admin-input-group col-span-2"><label>Yeni Şifreniz (Opsiyonel)</label><input type="password" value={securityNewPassword} onChange={e => setSecurityNewPassword(e.target.value)} className={inputCls} placeholder="Yeni şifrenizi girin" /></div>
            </div>
            <div className="admin-form-actions mt-6 justify-start">
              <button type="button" onClick={handleChangePassword} disabled={securityIsLoading} className="py-3 px-8 rounded-lg bg-red-500 text-white border-none cursor-pointer font-semibold flex items-center gap-2 disabled:opacity-50">
                {securityIsLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-save"></i>} Bilgilerimi Güncelle
              </button>
            </div>
          </div>
        </Accordion>

        {/* ── Temel İletişim ── */}
        <Accordion id="contact" icon="fa-solid fa-address-card" title="Temel İletişim Bilgileri">
          <div className="bg-sky-500/5 border border-sky-600/20 rounded-2xl p-6">
            <p className="text-xs text-text-muted mb-5 leading-relaxed"><i className="fa-solid fa-circle-info text-primary mr-1.5"></i>Bu bilgiler footer'da, iletişim sayfasında ve Google <strong>LocalBusiness Schema</strong>'sında kullanılır.</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Telefon Numarası" field="phone" placeholder="+90 232 000 00 00" />
              <Field label="E-Posta Adresi" field="email" type="email" placeholder="info@ajansrota.com" />
              <Field label="Site URL (Domain)" field="site_url" type="url" placeholder="https://ajansrota.com" hint="Google Schema için kullanılır — www olmadan yazın" />
              <Field label="SEO / Schema E-postası" field="contact_email" type="email" placeholder="info@ajansrota.com" hint="Schema.org kaydında görünür" />
            </div>
            <div className="mt-6 pt-6 border-t border-sky-600/10">
              <h4 className="text-sm font-semibold text-text-light mb-4 flex items-center gap-2"><i className="fa-solid fa-share-nodes text-primary"></i> Sosyal Medya Linkleri</h4>
              <div className="grid grid-cols-3 gap-4">
                <Field label="LinkedIn URL" field="linkedin_url" type="url" placeholder="https://linkedin.com/company/ajansrota" />
                <Field label="Instagram URL" field="instagram_url" type="url" placeholder="https://instagram.com/ajansrota" />
                <Field label="WhatsApp URL" field="whatsapp_url" type="url" placeholder="https://wa.me/90500..." hint="SaaS WhatsApp Bot alanı boşsa bu kullanılır" />
              </div>
            </div>
          </div>
        </Accordion>

        {/* ── Görsel ve Logo ── */}
        <Accordion id="visuals" icon="fa-solid fa-image" title="Görsel ve Logo Varlık Ayarları">
          <div className="grid grid-cols-1 gap-6 mt-4">
            <div className="border border-glass-border rounded-2xl p-6 bg-white/40">
              <h4 className="text-base font-semibold text-text-light mb-5 flex items-center gap-2"><i className="fa-solid fa-compass text-primary"></i> Logo Varlıkları</h4>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
                <div>{renderImageUploaderCard('logo_dark', 'Açık Tema Logosu (Masaüstü)', '240x60px', 'Örn: /images/logo_dark.png')}</div>
                <div>{renderImageUploaderCard('logo_dark_mobile', 'Açık Tema Logosu (Mobil)', '120x45px veya 60x60px', 'Boş bırakılırsa masaüstü logosu kullanılır')}</div>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 mt-5">
                <div>{renderImageUploaderCard('logo_light', 'Koyu/Şeffaf Tema Logosu (Masaüstü)', '240x60px', 'Örn: /images/logo_light.png')}</div>
                <div>{renderImageUploaderCard('logo_light_mobile', 'Koyu/Şeffaf Tema Logosu (Mobil)', '120x45px veya 60x60px', 'Boş bırakılırsa masaüstü logosu kullanılır')}</div>
              </div>
            </div>
            <div className="border border-glass-border rounded-2xl p-6 bg-white/40">
              <h4 className="text-base font-semibold text-text-light mb-5 flex items-center gap-2"><i className="fa-solid fa-images text-primary"></i> Sayfa Görsel Varlıkları</h4>
              {[
                { label: 'Hakkımızda Hikaye Görseli', keys: ['about_story_image', 'about_story_image_mobile'], sizes: ['1200x800px', '600x600px (Kare)'] },
                { label: 'İletişim Hizmet Haritası', keys: ['contact_map_image', 'contact_map_image_mobile'], sizes: ['1200x600px', '600x500px'] },
                { label: 'Müşteri Yorumları Hero Görseli', keys: ['testimonials_hero_image', 'testimonials_hero_image_mobile'], sizes: ['1600x500px', '600x400px'], noBorder: true },
              ].map((g, i) => (
                <div key={i} className={`${!g.noBorder ? 'mb-6 border-b border-dashed border-glass-border pb-6' : ''}`}>
                  <span className="font-semibold text-sm text-text-muted block mb-4">{g.label}</span>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
                    <div>{renderImageUploaderCard(g.keys[0], `${g.label} (Masaüstü)`, g.sizes[0])}</div>
                    <div>{renderImageUploaderCard(g.keys[1], `${g.label} (Mobil)`, g.sizes[1], 'Boş bırakılırsa masaüstü görseli kullanılır')}</div>
                  </div>
                </div>
              ))}
            </div>
        </Accordion>

        {/* ── Yapay Zeka (AI) Ayarları ── */}
        <Accordion id="ai_settings" icon="fa-solid fa-robot" title="Genel Yapay Zeka (AI) Ayarları">
          <div className="admin-form-row mt-4">
            <Field label="Google Gemini API Anahtarı (Blog Asistanı için)" field="gemini_api_key" type="password" placeholder="AI Blog Asistanı için Gemini API key girin" />
          </div>
        </Accordion>

        {/* ── WhatsApp AI Asistan ── */}
        <Accordion id="whatsapp" icon="fa-brands fa-whatsapp" iconColor="#25d366" title="WhatsApp Yapay Zeka Müşteri Asistanı Ayarları">
          <div className="admin-form-row">
            <Field label="WhatsApp Asistan Numarası" field="whatsapp_assistant_phone" placeholder="Sadece rakamlardan oluşan telefon numarası" />
            <Field label="Sohbet Robotu Konuları (Virgülle)" field="whatsapp_assistant_topics" placeholder="Örn: Google / Meta Reklamı, SEO Çalışması" />
          </div>
        </Accordion>

        {/* ── SM Paket Fiyatları ── */}
        <Accordion id="social_pricing" icon="fa-solid fa-share-nodes" title="Sosyal Medya Yönetimi Paket Fiyatları">
          <p className="text-xs text-text-muted mb-5 leading-relaxed">Hizmet bedeli hesaplayıcısında gösterilecek 3 paketin detaylarını buradan yönetin.</p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 mb-8">
            <SmPkgCard prefix="sm_pkg_baslangic" title="Başlangıç Paketi" icon="fa-solid fa-seedling" colorCls="bg-gradient-to-br from-sky-100/50 to-green-50/50" />
            <SmPkgCard prefix="sm_pkg_orta" title="Orta Paket" icon="fa-solid fa-rocket" colorCls="bg-gradient-to-br from-sky-100/60 to-blue-50/60 !border-2 !border-sky-600/30" badge="EN POPÜLER" />
            <SmPkgCard prefix="sm_pkg_zirve" title="Zirve Paketi" icon="fa-solid fa-crown" colorCls="bg-gradient-to-br from-yellow-100/50 to-amber-50/30 !border-amber-700/30" />
          </div>
        </Accordion>

        {/* ── Hakkımızda İçerik ── */}
        <Accordion id="about_content" icon="fa-solid fa-address-card" title="Kurumsal (Hakkımızda) Sayfa İçerik Yönetimi">
          <div className="border border-glass-border rounded-[20px] p-6 bg-gradient-to-br from-white/70 to-white/45 shadow-md mb-10">
            <SubTabNav tabs={[{ id: 'hero', label: 'Giriş & Kahraman', icon: 'fa-solid fa-crown' }, { id: 'story', label: 'Hikaye & Anlayış', icon: 'fa-solid fa-book-open' }, { id: 'culture', label: 'Kültür & Kurallar', icon: 'fa-solid fa-gavel' }, { id: 'coffee', label: 'Kahve Daveti', icon: 'fa-solid fa-mug-hot' }]} active={aboutSettingsSubTab} setActive={setAboutSettingsSubTab} />

            {aboutSettingsSubTab === 'hero' && <div className="animate-fadeIn">
              <p className="text-xs text-text-muted mb-5">Hakkımızda sayfasının en üstünde yer alan karşılama başlıklarını düzenleyin.</p>
              <div className="admin-form-row"><Field label="Sayfa Başlığı (Giriş)" field="about_title_top" placeholder="Biz Kimiz?" /><Field label="Sayfa Başlığı (Alt Vurgu/Span)" field="about_title_span" placeholder="Ege Sıcaklığı ve Dijital Performans" /></div>
              <Field label="Giriş Açıklaması (Spot)" field="about_desc" type="textarea" placeholder="Başlığın altındaki spot metin..." />
            </div>}

            {aboutSettingsSubTab === 'story' && <div className="animate-fadeIn">
              <p className="text-xs text-text-muted mb-5">Samimi Hikayemiz kartının başlığını ve paragraflarını düzenleyin.</p>
              <div className="admin-form-row"><Field label="Hikaye Etiketi (Tag)" field="about_story_tag" placeholder="BİZİM ANLAYIŞIMIZ" /><Field label="Hikaye Başlığı (H2)" field="about_story_title" placeholder="E-postalara Hapsolmayan Özgürlük" /></div>
              <Field label="Hikaye Paragrafı 1" field="about_story_p1" type="textarea" />
              <Field label="Hikaye Paragrafı 2" field="about_story_p2" type="textarea" />
              <Field label="Vurgulanan Alıntı Sözü (Quote)" field="about_story_quote" type="textarea" placeholder="Çift tırnak içinde gösterilecek vurucu ifade..." />
            </div>}

            {aboutSettingsSubTab === 'culture' && <div className="animate-fadeIn">
              <p className="text-xs text-text-muted mb-5">3 altın kuralın başlığını, açıklamalarını ve ikonlarını özelleştirin.</p>
              <Field label="Kültür Bölüm Ana Başlığı" field="about_culture_title" placeholder="Çalışma Kültürümüzün 3 Altın Kuralı" />
              <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 mt-6">
                <RuleCard num="01" prefix="about_rule1" color="var(--primary)" bgColor="rgba(14,165,233,0.02)" />
                <RuleCard num="02" prefix="about_rule2" color="var(--secondary)" bgColor="rgba(244,63,94,0.02)" />
                <RuleCard num="03" prefix="about_rule3" color="#10b981" bgColor="rgba(16,185,129,0.02)" />
              </div>
            </div>}

            {aboutSettingsSubTab === 'coffee' && <div className="animate-fadeIn">
              <p className="text-xs text-text-muted mb-5">Kahve daveti kartının içeriğini ve butonunu düzenleyin.</p>
              <div className="admin-form-row"><Field label="Kahve Daveti Başlığı" field="about_coffee_title" placeholder="Çevrimiçi ya da Yüz Yüze Bir Kahveye?" /><Field label="Buton Çağrı Metni" field="about_coffee_btn" placeholder="Bizimle Tanışın" /></div>
              <Field label="Davet Açıklama Paragrafı" field="about_coffee_desc" type="textarea" />
            </div>}
          </div>
        </Accordion>

        {/* ── İletişim Sayfası ── */}
        <Accordion id="contact_page" icon="fa-solid fa-envelope" title="İletişim Sayfası İçerik & Bilgi Yönetimi">
          <SubTabNav tabs={[{ id: 'info', label: 'Genel & Sayfa Girişi', icon: 'fa-solid fa-circle-info' }, { id: 'contact_fields', label: 'İletişim Bilgileri', icon: 'fa-solid fa-address-book' }, { id: 'office_hours', label: 'Mesai Saatleri & Tatiller', icon: 'fa-solid fa-clock' }]} active={contactSettingsSubTab} setActive={setContactSettingsSubTab} />
          <div className="border border-glass-border rounded-2xl p-6 bg-white/40 mb-8">
            {contactSettingsSubTab === 'info' && <div className="fade-in">
              <h4 className="text-sm font-semibold text-text-light mb-5 flex items-center gap-1.5"><i className="fa-solid fa-circle-info text-primary"></i> Genel & Sayfa Giriş Ayarları</h4>
              <div className="admin-form-row"><Field label="Sayfa Başlığı (Giriş)" field="contact_title_top" placeholder="Bizimle" /><Field label="Sayfa Başlığı (Alt/Span)" field="contact_title_span" placeholder="İletişime Geçin" /></div>
              <Field label="Sayfa Açıklaması (Giriş Spotu)" field="contact_desc" type="textarea" placeholder="Harita ve formun üstündeki açıklama metni..." />
            </div>}
            {contactSettingsSubTab === 'contact_fields' && <div className="fade-in">
              <h4 className="text-sm font-semibold text-text-light mb-5 flex items-center gap-1.5"><i className="fa-solid fa-address-book text-primary"></i> Global İletişim Bilgileri</h4>
              <div className="admin-form-row"><Field label="Telefon" field="phone" placeholder="+90 544 584 45 43" /><Field label="E-Posta" field="email" type="email" placeholder="hello@ajansrota.com" /></div>
              <div className="admin-form-row mt-4">
                <div className="admin-form-group flex-[2]"><Field label="Adres / Çalışma Modelimiz" field="address" placeholder="Uzaktan Çalışma (Remote) / İzmir, Ege" /></div>
                <div className="admin-form-group flex-1"><Field label="Google Maps URL" field="google_maps_url" placeholder="Haritada Göster bağlantısı" /></div>
              </div>
            </div>}
            {contactSettingsSubTab === 'office_hours' && <div className="fade-in">
              <h4 className="text-sm font-semibold text-text-light mb-5 flex items-center gap-1.5"><i className="fa-solid fa-clock text-primary"></i> Çalışma Saatleri & Otomatik Mesai Durumu</h4>
              <Field label="Çalışma Saatleri Açıklama Metni" field="working_hours_text" placeholder="Pazartesi – Cuma: 09:00 – 18:30" />
              <div className="admin-form-row mt-4"><Field label="Mesai Başlangıç Saati" field="working_hours_start" placeholder="09:00" /><Field label="Mesai Bitiş Saati" field="working_hours_end" placeholder="18:30" /></div>
              <Field label="Özel Tatil Günleri (YYYY-MM-DD, virgülle)" field="custom_holidays" placeholder="2026-06-25, 2026-06-26" hint="Ulusal resmi tatiller (1 Ocak, 23 Nisan, 1 Mayıs vb.) otomatik olarak kapalı hesaplanır." />
            </div>}
          </div>
        </Accordion>

        {/* ── Yasal Metinler ── */}
        <Accordion id="legal_content" icon="fa-solid fa-file-shield" title="Yasal Metin ve Politika Yönetimi">
          <p className="text-sm text-text-muted mb-6 leading-snug">Footer'daki yasal metinleri buradan düzenleyebilirsiniz. HTML etiketleri desteklenir.</p>
          <div className="border border-glass-border rounded-[20px] p-6 bg-gradient-to-br from-white/70 to-white/45 shadow-md mb-10">
            <SubTabNav tabs={[{ id: 'privacy', label: 'Gizlilik Politikası', icon: 'fa-solid fa-user-lock' }, { id: 'terms', label: 'Kullanım Koşulları', icon: 'fa-solid fa-scale-balanced' }, { id: 'kvkk', label: 'KVKK Aydınlatma', icon: 'fa-solid fa-shield-halved' }, { id: 'cookies', label: 'Çerez Politikası', icon: 'fa-solid fa-cookie-bite' }]} active={legalSettingsSubTab} setActive={setLegalSettingsSubTab} />
            {(() => {
              const map = {
                privacy: { titleLabel: 'Gizlilik Politikası Sayfa Başlığı', contentLabel: 'Gizlilik Politikası İçeriği', titleKey: 'privacy_policy_title', contentKey: 'privacy_policy_content', elementId: 'privacy_policy_textarea', placeholder: 'Gizlilik Politikası' },
                terms: { titleLabel: 'Kullanım Koşulları Sayfa Başlığı', contentLabel: 'Kullanım Koşulları İçeriği', titleKey: 'terms_of_use_title', contentKey: 'terms_of_use_content', elementId: 'terms_of_use_textarea', placeholder: 'Kullanım Koşulları' },
                kvkk: { titleLabel: 'KVKK Aydınlatma Metni Başlığı', contentLabel: 'KVKK Aydınlatma İçeriği', titleKey: 'kvkk_text_title', contentKey: 'kvkk_text_content', elementId: 'kvkk_text_textarea', placeholder: 'KVKK Aydınlatma Metni' },
                cookies: { titleLabel: 'Çerez Politikası Başlığı', contentLabel: 'Çerez Politikası İçeriği', titleKey: 'cookies_policy_title', contentKey: 'cookies_policy_content', elementId: 'cookies_policy_textarea', placeholder: 'Çerez Politikası' }
              };
              const t = map[legalSettingsSubTab]; if (!t) return null;
              return <div className="animate-fadeIn">
                <Field label={t.titleLabel} field={t.titleKey} placeholder={t.placeholder} />
                <div className="admin-form-group mt-5">
                  <label className="text-sm font-semibold text-text-light mb-1.5 block">{t.contentLabel} (HTML Destekli Zengin Editör)</label>
                  {/* Toolbar */}
                  <div className="flex flex-wrap gap-1.5 py-2.5 px-3 border border-glass-border border-b-0 rounded-t-lg bg-slate-50/80 items-center justify-between">
                    <div className="flex flex-wrap gap-1 items-center">
                      <button type="button" onClick={() => setLegalEditorPreview(false)} className={`py-1 px-2.5 text-xs rounded-md font-semibold cursor-pointer inline-flex items-center gap-1.5 ${!legalEditorPreview ? 'bg-primary text-white border-none' : 'bg-transparent text-text-light border border-transparent'}`}><i className="fa-solid fa-pen-to-square"></i> Düzenle</button>
                      <button type="button" onClick={() => setLegalEditorPreview(true)} className={`py-1 px-2.5 text-xs rounded-md font-semibold cursor-pointer inline-flex items-center gap-1.5 ${legalEditorPreview ? 'bg-primary text-white border-none' : 'bg-transparent text-text-light border border-transparent'}`}><i className="fa-solid fa-eye"></i> Önizleme</button>
                      {!legalEditorPreview && <>
                        <span className="h-5 w-px bg-glass-border mx-1.5"></span>
                        {[{ icon: 'fa-bold', tag: 'strong' }, { icon: 'fa-italic', tag: 'em' }, { icon: 'fa-underline', tag: 'u' }, { icon: 'fa-heading', tag: 'h3' }, { icon: 'fa-paragraph', tag: 'p' }, { icon: 'fa-list-ul', tag: 'ul' }, { icon: 'fa-list', tag: 'li' }, { icon: 'fa-link', tag: 'a' }].map((b, i) => <button key={i} type="button" onClick={() => insertHtmlTag(t.elementId, t.contentKey, b.tag)} className="py-1 px-2 text-xs rounded bg-white/80 border border-glass-border text-text-light cursor-pointer inline-flex items-center justify-center min-w-[28px] h-7 hover:bg-primary/[0.08] hover:border-primary transition-all"><i className={`fa-solid ${b.icon}`}></i></button>)}
                      </>}
                    </div>
                    <button type="button" onClick={() => loadLegalTemplate(legalSettingsSubTab)} className="py-1 px-2.5 text-[0.72rem] rounded-md bg-amber-500/10 text-amber-600 font-semibold border border-amber-500/30 cursor-pointer inline-flex items-center gap-1.5 hover:bg-amber-500/20 transition-all"><i className="fa-solid fa-file-signature"></i> Hazır Şablon Doldur</button>
                  </div>
                  {legalEditorPreview
                    ? <div className="legal-page-content p-6 border border-glass-border rounded-b-lg bg-white min-h-[300px] overflow-y-auto max-h-[500px] leading-loose text-text-light text-sm" dangerouslySetInnerHTML={{ __html: settingsData[t.contentKey] || '<p style="color: var(--text-muted); font-style: italic;">İçerik boş...</p>' }} />
                    : <textarea id={t.elementId} value={settingsData[t.contentKey] || ''} onChange={e => upd(t.contentKey, e.target.value)} className="w-full py-3 px-3 rounded-b-lg rounded-t-none border border-glass-border bg-white min-h-[300px] font-mono text-sm leading-relaxed outline-none" placeholder="HTML formatında yasal metin yazın veya şablon kullanın..." />}
                </div>
              </div>;
            })()}
          </div>
        </Accordion>

        {/* ── Sayfa Gösterim ── */}
        <Accordion id="menu" icon="fa-solid fa-eye-slash" title="Sayfa Gösterim ve Menü Yönetimi">
          <p className="text-sm text-text-muted mb-6 leading-snug">Sayfaları ziyaretçilere gizleyebilir veya yeniden görünür kılabilirsiniz.</p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 mb-10">
            {[{ key: 'hide_page_hakkimizda', label: 'Hakkımızda' }, { key: 'hide_page_ekiplerimiz', label: 'Ekiplerimiz' }, { key: 'hide_page_blog', label: 'Blog' }, { key: 'hide_page_izmir', label: 'Neden İzmir?' }, { key: 'hide_page_iletisim', label: 'İletişim' }, { key: 'hide_page_seo', label: 'Ücretsiz SEO Analiz Aracı' }, { key: 'hide_page_kobi', label: 'KOBİ Dijitalleşme Endeksi' }, { key: 'hide_page_rakip', label: 'Siz vs. Rakibiniz' }, { key: 'hide_page_kreatif', label: 'Kreatif Reklam Vitrini' }, { key: 'hide_page_akademi', label: 'Rota Akademi' }, { key: 'hide_page_referanslar', label: 'Referanslarımız' }].map(item => (
              <label key={item.key} className="flex items-center gap-3 p-4 bg-slate-900/[0.02] border border-glass-border rounded-lg cursor-pointer select-none transition-all page-hide-label">
                <input type="checkbox" checked={!!settingsData[item.key]} onChange={e => upd(item.key, e.target.checked)} className="w-4 h-4 cursor-pointer" />
                <div>
                  <span className="text-sm font-semibold text-text-light block">{item.label}</span>
                  <span className={`text-xs font-semibold ${settingsData[item.key] ? 'text-red-500' : 'text-green-500'}`}>{settingsData[item.key] ? '🚫 Gizli (Menüden kaldırıldı)' : '✅ Aktif (Menüde görünür)'}</span>
                </div>
              </label>
            ))}
          </div>
        </Accordion>

        {/* ── SEO & Meta ── */}
        <Accordion id="seo" icon="fa-solid fa-magnifying-glass-chart" title="Sayfa Bazlı SEO ve Meta Etiket Ayarları">
          <div className="flex gap-1.5 flex-wrap mb-6 bg-slate-900/[0.03] p-1.5 rounded-lg">
            {[{ id: 'home', label: 'Ana Sayfa / Genel' }, { id: 'izmir', label: 'Neden İzmir' }, { id: 'referanslar', label: 'Referanslar' }, { id: 'iletisim', label: 'İletişim' }, { id: 'hakkimizda', label: 'Hakkımızda' }, { id: 'ekiplerimiz', label: 'Ekiplerimiz' }, { id: 'blog', label: 'Blog' }, { id: 'seo', label: 'SEO Analiz Aracı' }].map(tab => <button key={tab.id} type="button" className={`btn ${activeSeoTab === tab.id ? 'btn-primary' : 'btn-secondary'} py-1.5 px-3 text-xs rounded-md`} onClick={() => setActiveSeoTab(tab.id)}>{tab.label}</button>)}
          </div>

          {activeSeoTab === 'home' && <SeoForm prefix="meta" pageName="Ana Sayfa / Genel" />}
          {activeSeoTab === 'izmir' && <SeoForm prefix="seo_izmir" pageName="Neden İzmir" />}
          {activeSeoTab === 'referanslar' && <SeoForm prefix="seo_referanslar" pageName="Referanslar" />}
          {activeSeoTab === 'iletisim' && <SeoForm prefix="seo_iletisim" pageName="İletişim" />}
          {activeSeoTab === 'hakkimizda' && <SeoForm prefix="seo_hakkimizda" pageName="Hakkımızda" />}
          {activeSeoTab === 'ekiplerimiz' && <SeoForm prefix="seo_ekiplerimiz" pageName="Ekiplerimiz" />}
          {activeSeoTab === 'blog' && <SeoForm prefix="seo_blog" pageName="Blog" />}
          {activeSeoTab === 'seo' && <SeoForm prefix="seo_seo" pageName="SEO Analiz Aracı" />}

          {/* Sitemap */}
          <h3 className="mt-10 mb-5 text-lg text-text-light border-b border-glass-border pb-2 flex items-center gap-2"><i className="fa-solid fa-sitemap text-primary text-lg"></i> XML Site Haritası (Sitemap) Yönetimi</h3>
          <p className="text-sm text-text-muted mb-5 leading-relaxed">Google ve arama motoru botları için XML site haritası oluşturun. Blog/sayfa ayarları kaydedildiğinde <strong>otomatik güncellenir</strong>.</p>
          <div className="bg-primary/[0.03] border border-dashed border-glass-border-hover rounded-lg p-5 mb-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <span className="block text-sm font-bold text-text-light">Site Haritası Adresi (GSC için):</span>
                <span className="text-xs text-primary font-mono block mt-1 break-all">{window.location.origin}/sitemap.xml</span>
              </div>
              <button type="button" disabled={sitemapLoading} onClick={handleGenerateSitemap} className="btn btn-secondary py-2 px-5 text-xs rounded-md flex items-center gap-1.5">
                {sitemapLoading ? <><div className="seo-spinner w-3 h-3" style={{ borderWidth: '1.5px' }}></div> Oluşturuluyor...</> : <><i className="fa-solid fa-arrows-rotate"></i> Şimdi Güncelle</>}
              </button>
            </div>
            {sitemapStatus && <div className="mt-4 py-3 px-4 bg-green-600/5 border border-green-600/15 rounded-md text-xs text-green-600 flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-base"></i><div><strong>{sitemapStatus.message}</strong><span className="block text-[0.7rem] text-text-muted mt-0.5">Son: {sitemapStatus.lastUpdated} | <a href={sitemapStatus.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">Gör</a></span></div>
            </div>}
            {sitemapError && <div className="mt-4 py-3 px-4 bg-red-500/5 border border-red-500/15 rounded-md text-xs text-red-500 flex items-center gap-2"><i className="fa-solid fa-circle-xmark text-base"></i><span>{sitemapError}</span></div>}
          </div>
        </Accordion>

        <div className="admin-form-actions mt-6"><button type="submit" className="btn btn-primary">Kaydet</button></div>
      </form>
    </div>
  );
}
