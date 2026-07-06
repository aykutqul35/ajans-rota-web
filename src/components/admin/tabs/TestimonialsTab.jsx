import { useState } from 'react';

export default function TestimonialsTab({
  testimonialsData, setTestimonialsData, handleSaveAll, isSaving, settingsData, setSettingsData, openEditModal, handleDeleteItem
}) {
  const [testSearch, setTestSearch] = useState('');
  const [testCatFilter, setTestCatFilter] = useState('all');
  const [activeTestimonialsSection, setActiveTestimonialsSection] = useState('reviews');

  const inputCls = "w-full p-2 rounded border border-glass-border focus:border-primary outline-none transition-colors";
  const sectionTitle = "text-lg font-bold text-text-light mb-5 flex items-center gap-2 border-b border-slate-900/5 pb-2";
  const cardCls = "border border-glass-border p-5 rounded-lg bg-slate-50";

  const upd = (key, val) => setSettingsData({ ...settingsData, [key]: val });

  // Reusable Case Study form
  const CaseStudyForm = ({ n }) => (
    <div className={cardCls}>
      <h5 className="m-0 mb-4 text-primary font-bold">Vaka Çalışması {n}</h5>
      
      {/* Company Info */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {[
          { label: 'Şirket Adı', key: `cs${n}_company` },
          { label: 'Logo / İkon / Emoji', key: `cs${n}_logo` },
          { label: 'Sektör', key: `cs${n}_sector` },
        ].map(f => <div key={f.key} className="admin-form-group">
          <label>{f.label}</label>
          <input type="text" value={settingsData[f.key] || ''} onChange={e => upd(f.key, e.target.value)} className={inputCls} />
        </div>)}
      </div>

      {/* Before Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {[
          { label: 'Önceki ROAS / Metrik', key: `cs${n}_before_roas` },
          { label: 'Önceki Trafik / Durum', key: `cs${n}_before_traffic` },
          { label: 'Önceki Maliyet / Sorun', key: `cs${n}_before_cost` },
        ].map(f => <div key={f.key} className="admin-form-group">
          <label>{f.label}</label>
          <input type="text" value={settingsData[f.key] || ''} onChange={e => upd(f.key, e.target.value)} className={inputCls} />
        </div>)}
      </div>

      {/* After Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {[
          { label: 'Sonraki ROAS / Metrik', key: `cs${n}_after_roas` },
          { label: 'Sonraki Trafik / Durum', key: `cs${n}_after_traffic` },
          { label: 'Sonraki Maliyet / İyileşme', key: `cs${n}_after_cost` },
        ].map(f => <div key={f.key} className="admin-form-group">
          <label>{f.label}</label>
          <input type="text" value={settingsData[f.key] || ''} onChange={e => upd(f.key, e.target.value)} className={inputCls} />
        </div>)}
      </div>

      {/* Strategies */}
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map(s => <div key={s} className="admin-form-group">
          <label>Strateji {s}</label>
          <input type="text" value={settingsData[`cs${n}_strat${s}`] || ''} onChange={e => upd(`cs${n}_strat${s}`, e.target.value)} className={inputCls} />
        </div>)}
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
        Referanslar & Yorumlar Sayfası Yönetimi
      </div>

      <form onSubmit={e => { e.preventDefault(); handleSaveAll(); }} className="admin-split-layout">
        {/* Sidebar */}
        <div className="service-editor-sidebar admin-split-sidebar">
          {[
            { id: 'reviews', label: 'Müşteri Yorumları', icon: 'fa-solid fa-comments' },
            { id: 'kpis', label: 'Performans Göstergeleri', icon: 'fa-solid fa-chart-line' },
            { id: 'case_studies', label: 'Vaka Çalışmaları (CS)', icon: 'fa-solid fa-file-invoice-dollar' },
            { id: 'logos', label: 'Marka Logoları Duvarı', icon: 'fa-solid fa-cubes' }
          ].map(sec => {
            const isActive = activeTestimonialsSection === sec.id;
            return <button key={sec.id} type="button" onClick={() => setActiveTestimonialsSection(sec.id)} className={`service-sec-btn ${isActive ? 'active' : ''}`}>
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
          
          {/* Reviews */}
          {activeTestimonialsSection === 'reviews' && <div>
            <div className="flex justify-between items-center mb-5 border-b border-slate-900/5 pb-2">
              <h4 className="text-lg font-bold text-text-light m-0 flex items-center gap-2">
                <i className="fa-solid fa-comments text-primary"></i> Müşteri Yorumları & Kartları
              </h4>
              <button type="button" onClick={() => openEditModal('testimonial', 'new')} className="btn btn-secondary py-1.5 px-3 text-xs">
                <i className="fa-solid fa-plus mr-1.5"></i> Yeni Yorum Ekle
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6 flex-wrap">
              <input type="text" placeholder="Müşteri veya şirket adı ara..." value={testSearch} onChange={e => setTestSearch(e.target.value)} className="flex-1 min-w-[200px] py-2.5 px-4 rounded-lg border border-glass-border bg-white text-sm outline-none focus:border-primary transition-colors" />
              <select value={testCatFilter} onChange={e => setTestCatFilter(e.target.value)} className="py-2.5 px-4 rounded-lg border border-glass-border bg-white text-sm min-w-[150px] outline-none cursor-pointer focus:border-primary transition-colors">
                <option value="all">Tüm Kategoriler</option>
                <option value="google-ads">Google Ads</option>
                <option value="meta-ads">Meta Ads</option>
                <option value="seo">SEO &amp; İçerik</option>
                <option value="social-media">Sosyal Medya</option>
                <option value="ecommerce">E-Ticaret</option>
                <option value="web-design">Web Tasarım</option>
              </select>
            </div>

            <div className="admin-item-list max-h-[450px] overflow-y-auto pr-1">
              {testimonialsData.filter(item => {
                const matchQuery = (item.name || '').toLowerCase().includes(testSearch.toLowerCase()) || (item.company || '').toLowerCase().includes(testSearch.toLowerCase());
                const matchCat = testCatFilter === 'all' || item.category === testCatFilter;
                return matchQuery && matchCat;
              }).map(item => <div key={item.id} className="admin-item-row">
                <div className="admin-item-info">
                  <h4>{item.name} <span className="text-xs font-normal text-text-muted">({item.company} - {item.role})</span></h4>
                  <span>Kategori: {item.category} | Metrik: {item.metric || 'Yok'}</span>
                  <p className="text-sm text-text-main mt-1.5 italic line-clamp-2">
                    "{item.quote}"
                  </p>
                </div>
                <div className="admin-action-btns">
                  <button type="button" onClick={() => openEditModal('testimonial', item)} className="btn-icon" title="Düzenle">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button type="button" onClick={() => handleDeleteItem('testimonial', item)} className="btn-icon btn-delete" title="Sil">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>)}
            </div>
          </div>}

          {/* KPIs */}
          {activeTestimonialsSection === 'kpis' && <div>
            <h4 className={sectionTitle}>
              <i className="fa-solid fa-chart-line text-primary"></i> Performans Gösterge Paneli (KPI'lar)
            </h4>

            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(n => <>
                <div key={`title-${n}`} className="admin-form-group">
                  <label>Gösterge {n} Başlık</label>
                  <input type="text" value={settingsData[`ref_kpi${n}_title`] || ''} onChange={e => upd(`ref_kpi${n}_title`, e.target.value)} className={inputCls} />
                </div>
                <div key={`val-${n}`} className="admin-form-group">
                  <label>Gösterge {n} Değer</label>
                  <input type="text" value={settingsData[`ref_kpi${n}_val`] || ''} onChange={e => upd(`ref_kpi${n}_val`, e.target.value)} className={inputCls} />
                </div>
              </>)}
            </div>
          </div>}

          {/* Case Studies */}
          {activeTestimonialsSection === 'case_studies' && <div>
            <h4 className={sectionTitle}>
              <i className="fa-solid fa-file-invoice-dollar text-primary"></i> Öncesi / Sonrası Büyüme Analizleri (3 adet)
            </h4>

            <div className="flex flex-col gap-8">
              <CaseStudyForm n={1} />
              <CaseStudyForm n={2} />
              <CaseStudyForm n={3} />
            </div>
          </div>}

          {/* Brand Logos */}
          {activeTestimonialsSection === 'logos' && <div>
            <h4 className={sectionTitle}>
              <i className="fa-solid fa-cubes text-primary"></i> Marka Logoları Duvarı (6 adet)
            </h4>

            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map(num => <div key={num} className={cardCls}>
                <h5 className="m-0 mb-3 text-primary font-bold">Marka Kartı {num}</h5>
                
                <div className="grid grid-cols-[1fr_3fr] gap-2 mb-2">
                  <div className="admin-form-group">
                    <label>Logo (Emoji)</label>
                    <input type="text" value={settingsData[`logo${num}_logo`] || ''} onChange={e => upd(`logo${num}_logo`, e.target.value)} className={`${inputCls} text-center`} />
                  </div>
                  <div className="admin-form-group">
                    <label>Şirket Adı</label>
                    <input type="text" value={settingsData[`logo${num}_company`] || ''} onChange={e => upd(`logo${num}_company`, e.target.value)} className={inputCls} />
                  </div>
                </div>

                <div className="admin-form-group mb-2">
                  <label>Verilen Hizmetler</label>
                  <input type="text" value={settingsData[`logo${num}_services`] || ''} onChange={e => upd(`logo${num}_services`, e.target.value)} className={inputCls} />
                </div>

                <div className="admin-form-group !mb-0">
                  <label>Elde Edilen Başarı (Metrik)</label>
                  <input type="text" value={settingsData[`logo${num}_metric`] || ''} onChange={e => upd(`logo${num}_metric`, e.target.value)} className={inputCls} />
                </div>
              </div>)}
            </div>
          </div>}

          {/* Mobile Save */}
          <div className="mobile-only-save mt-8">
            <SaveButton />
          </div>
        </div>
      </form>
    </div>
  );
}
