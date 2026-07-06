import { useState } from 'react';

export default function LandingTab({
  handleSaveAll, settingsData, setSettingsData
}) {
  const [activeLandingSection, setActiveLandingSection] = useState('hero');

  const inputCls = "w-full p-3 rounded-lg border border-glass-border focus:border-primary outline-none transition-colors";
  const inputSmCls = "w-full py-2.5 px-2.5 rounded-md border border-glass-border focus:border-primary outline-none transition-colors";
  const sectionTitle = "text-lg font-bold text-text-light mb-5 flex items-center gap-2 border-b border-slate-900/5 pb-2";
  const cardCls = "p-4 border border-glass-border rounded-lg bg-slate-900/[0.01]";
  const cardLabel = "block text-sm text-primary mb-3 font-semibold";
  const smallLabel = "text-xs";

  const upd = (key, val) => setSettingsData({ ...settingsData, [key]: val });

  // Helper for stat counter cards
  const StatCard = ({ num, label, numKey, lblKey }) => (
    <div className={cardCls}>
      <strong className={cardLabel}>{label}</strong>
      <div className="admin-form-row !m-0">
        <div className="admin-form-group !m-0">
          <label className={smallLabel}>Değer (Örn: {num})</label>
          <input type="text" value={settingsData[numKey] || ''} onChange={e => upd(numKey, e.target.value)} className={inputSmCls} />
        </div>
        <div className="admin-form-group !m-0">
          <label className={smallLabel}>Etiket (Örn: {label})</label>
          <input type="text" value={settingsData[lblKey] || ''} onChange={e => upd(lblKey, e.target.value)} className={inputSmCls} />
        </div>
      </div>
    </div>
  );

  // Helper for izmir edge items
  const EdgeItem = ({ n }) => (
    <div className={cardCls}>
      <strong className="text-xs text-primary">Madde #{n}</strong>
      <div className="admin-form-row mt-2">
        <div className="admin-form-group">
          <label className={smallLabel}>Başlık</label>
          <input type="text" value={settingsData[`izmir_edge_item${n}_title`] || ''} onChange={e => upd(`izmir_edge_item${n}_title`, e.target.value)} className={inputSmCls} />
        </div>
        <div className="admin-form-group">
          <label className={smallLabel}>İkon (FontAwesome)</label>
          <input type="text" value={settingsData[`izmir_edge_item${n}_icon`] || ''} onChange={e => upd(`izmir_edge_item${n}_icon`, e.target.value)} className={inputSmCls} />
        </div>
      </div>
      <div className="admin-form-group !m-0">
        <label className={smallLabel}>Açıklama</label>
        <textarea rows="2" value={settingsData[`izmir_edge_item${n}_desc`] || ''} onChange={e => upd(`izmir_edge_item${n}_desc`, e.target.value)} className={`${inputSmCls} font-sans`} />
      </div>
    </div>
  );

  const SaveButton = () => (
    <button type="submit" className="btn btn-primary w-full py-3 text-sm rounded-lg cursor-pointer inline-flex items-center justify-center gap-2">
      <i className="fa-solid fa-floppy-disk"></i> Değişiklikleri Kaydet
    </button>
  );

  return (
    <div>
      <div className="admin-section-title mb-6">
        Ana Sayfa İçerik & Tasarım Yönetimi
      </div>

      <form onSubmit={e => { e.preventDefault(); handleSaveAll(); }} className="admin-split-layout">
        {/* Sidebar */}
        <div className="service-editor-sidebar admin-split-sidebar">
          {[
            { id: 'hero', label: 'Hero (Giriş) Alanı', icon: 'fa-solid fa-rocket' },
            { id: 'stats', label: 'İstatistik Sayaçları', icon: 'fa-solid fa-chart-line' },
            { id: 'services_intro', label: 'Hizmetler Giriş Spotu', icon: 'fa-solid fa-compass' },
            { id: 'izmir_edge', label: 'Neden Biz? (Bölgesel Güç)', icon: 'fa-solid fa-anchor' }
          ].map(sec => {
            const isActive = activeLandingSection === sec.id;
            return <button key={sec.id} type="button" onClick={() => setActiveLandingSection(sec.id)} className={`service-sec-btn ${isActive ? 'active' : ''}`}>
              <i className={`${sec.icon} w-4 text-center text-[0.95rem]`}></i>
              {sec.label}
            </button>;
          })}

          <div className="admin-split-sidebar-save">
            <SaveButton />
          </div>
        </div>

        {/* Content */}
        <div className="service-editor-fields admin-split-content">
          
          {/* Hero */}
          {activeLandingSection === 'hero' && <div>
            <h4 className={sectionTitle}>
              <i className="fa-solid fa-rocket text-primary"></i> Hero (Giriş) Alanı Ayarları
            </h4>
            
            <div className="admin-form-group">
              <label>Küçük Etiket / Tagline</label>
              <input type="text" value={settingsData.hero_tag || ''} onChange={e => upd('hero_tag', e.target.value)} className={inputCls} />
            </div>
            
            <div className="admin-form-group">
              <label>Ana Başlık (Title - Satır atlamaları için \\n kullanabilirsiniz)</label>
              <textarea rows="2" value={settingsData.hero_title || ''} onChange={e => upd('hero_title', e.target.value)} className={`${inputCls} font-sans`} />
            </div>
            
            <div className="admin-form-group !m-0">
              <label>Açıklama Metni (Description)</label>
              <textarea rows="4" value={settingsData.hero_desc || ''} onChange={e => upd('hero_desc', e.target.value)} className={`${inputCls} font-sans leading-relaxed`} />
            </div>
          </div>}

          {/* Stats */}
          {activeLandingSection === 'stats' && <div>
            <h4 className={sectionTitle}>
              <i className="fa-solid fa-chart-line text-primary"></i> İstatistik Sayaçları (Hero Altı)
            </h4>
            
            <div className="flex flex-col gap-6">
              <StatCard num="%320+" label="Sayaç #1" numKey="hero_stat1_num" lblKey="hero_stat1_lbl" />
              <StatCard num="12M₺+" label="Sayaç #2" numKey="hero_stat2_num" lblKey="hero_stat2_lbl" />
              <StatCard num="%98.4" label="Sayaç #3" numKey="hero_stat3_num" lblKey="hero_stat3_lbl" />
            </div>
          </div>}

          {/* Services Intro */}
          {activeLandingSection === 'services_intro' && <div>
            <h4 className={sectionTitle}>
              <i className="fa-solid fa-compass text-primary"></i> Hizmetlerimiz Bölümü Giriş Spotu
            </h4>
            
            <div className="admin-form-group">
              <label>Küçük Başlık / Etiket (Tag)</label>
              <input type="text" value={settingsData.services_section_tag || ''} onChange={e => upd('services_section_tag', e.target.value)} className={inputCls} />
            </div>
            
            <div className="admin-form-group">
              <label>Bölüm Başlığı (H2)</label>
              <input type="text" value={settingsData.services_section_title || ''} onChange={e => upd('services_section_title', e.target.value)} className={inputCls} />
            </div>
            
            <div className="admin-form-group !m-0">
              <label>Giriş / Açıklama Paragrafı</label>
              <textarea rows="4" value={settingsData.services_section_desc || ''} onChange={e => upd('services_section_desc', e.target.value)} className={`${inputCls} font-sans leading-relaxed`} />
            </div>
          </div>}

          {/* Izmir Edge */}
          {activeLandingSection === 'izmir_edge' && <div>
            <h4 className={sectionTitle}>
              <i className="fa-solid fa-anchor text-primary"></i> Neden Biz? (Bölgesel Güç) Ayarları
            </h4>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Bölüm Etiketi (Tag)</label>
                <input type="text" value={settingsData.izmir_edge_tag || ''} onChange={e => upd('izmir_edge_tag', e.target.value)} className={inputCls} />
              </div>
              <div className="admin-form-group">
                <label>Bölüm Başlığı (Title)</label>
                <input type="text" value={settingsData.izmir_edge_title || ''} onChange={e => upd('izmir_edge_title', e.target.value)} className={inputCls} />
              </div>
            </div>
            
            <div className="admin-form-group">
              <label>Genel Açıklama Metni</label>
              <textarea rows="3" value={settingsData.izmir_edge_desc || ''} onChange={e => upd('izmir_edge_desc', e.target.value)} className={`${inputCls} font-sans`} />
            </div>

            {/* Sol Liste Maddeleri */}
            <div className="mt-6 border-t border-dashed border-glass-border pt-5">
              <h5 className="text-sm font-bold text-text-light mb-4">Sol Liste Maddeleri</h5>
              <div className="flex flex-col gap-5">
                <EdgeItem n={1} />
                <EdgeItem n={2} />
                <EdgeItem n={3} />
              </div>
            </div>

            {/* Sağ Görsel Kartı */}
            <div className="mt-8 border-t border-dashed border-glass-border pt-5">
              <h5 className="text-sm font-bold text-text-light mb-4">Sağ Görsel/Vektör Kartı Ayarları</h5>
              
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className={smallLabel}>Başlık</label>
                  <input type="text" value={settingsData.izmir_edge_box_title || ''} onChange={e => upd('izmir_edge_box_title', e.target.value)} className={inputSmCls} />
                </div>
                <div className="admin-form-group">
                  <label className={smallLabel}>Orta İkon (FontAwesome)</label>
                  <input type="text" value={settingsData.izmir_edge_box_icon || ''} onChange={e => upd('izmir_edge_box_icon', e.target.value)} className={inputSmCls} />
                </div>
              </div>
              
              <div className="admin-form-group">
                <label className={smallLabel}>Alt Açıklama</label>
                <textarea rows="2" value={settingsData.izmir_edge_box_desc || ''} onChange={e => upd('izmir_edge_box_desc', e.target.value)} className={`${inputSmCls} font-sans`} />
              </div>
              
              <div className="admin-form-group">
                <label className={smallLabel}>Görsel Arka Plan URL (Boşsa mavi gradyan kullanılır)</label>
                <input type="text" value={settingsData.izmir_edge_box_image || ''} onChange={e => upd('izmir_edge_box_image', e.target.value)} className={inputSmCls} placeholder="Örn: /images/aegean_map.png" />
              </div>

              <div className="admin-form-row !m-0">
                <div className="admin-form-group !m-0">
                  <label className={smallLabel}>Küçük Rozet Üst (Örn: İzmir)</label>
                  <input type="text" value={settingsData.izmir_edge_box_badge_title || ''} onChange={e => upd('izmir_edge_box_badge_title', e.target.value)} className={inputSmCls} />
                </div>
                <div className="admin-form-group !m-0">
                  <label className={smallLabel}>Küçük Rozet Alt (Örn: Ege'nin Dijital Merkezi)</label>
                  <input type="text" value={settingsData.izmir_edge_box_badge_desc || ''} onChange={e => upd('izmir_edge_box_badge_desc', e.target.value)} className={inputSmCls} />
                </div>
              </div>
            </div>
          </div>}

          {/* Mobile Save Button */}
          <div className="mobile-only-save mt-8">
            <SaveButton />
          </div>
        </div>
      </form>
    </div>
  );
}
