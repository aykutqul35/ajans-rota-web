import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ServicesTab({
  servicesData, setServicesData, handleSaveAll, isSaving
}) {
  const [activeServiceEditSection, setActiveServiceEditSection] = useState('basic');
  const [editingServiceKey, setEditingServiceKey] = useState('google');

  const handleServiceFieldChange = (field, value) => {
    setServicesData(prev => ({ ...prev, [editingServiceKey]: { ...prev[editingServiceKey], [field]: value } }));
  };

  const handleServiceNestedChange = (parentField, childField, value) => {
    setServicesData(prev => ({ ...prev, [editingServiceKey]: { ...prev[editingServiceKey], [parentField]: { ...prev[editingServiceKey][parentField], [childField]: value } } }));
  };

  const handleFeatureChange = (index, value) => {
    setServicesData(prev => { const f = [...(prev[editingServiceKey].features || [])]; f[index] = value; return { ...prev, [editingServiceKey]: { ...prev[editingServiceKey], features: f } }; });
  };
  const handleAddFeature = () => {
    setServicesData(prev => ({ ...prev, [editingServiceKey]: { ...prev[editingServiceKey], features: [...(prev[editingServiceKey].features || []), "Yeni Hizmet Kapsam Maddesi"] } }));
  };
  const handleDeleteFeature = index => {
    setServicesData(prev => ({ ...prev, [editingServiceKey]: { ...prev[editingServiceKey], features: (prev[editingServiceKey].features || []).filter((_, i) => i !== index) } }));
  };

  const handleMetricChange = (index, field, value) => {
    setServicesData(prev => { const m = [...(prev[editingServiceKey].caseStudy.metrics || [])]; m[index] = { ...m[index], [field]: value }; return { ...prev, [editingServiceKey]: { ...prev[editingServiceKey], caseStudy: { ...prev[editingServiceKey].caseStudy, metrics: m } } }; });
  };
  const handleAddMetric = () => {
    setServicesData(prev => ({ ...prev, [editingServiceKey]: { ...prev[editingServiceKey], caseStudy: { ...prev[editingServiceKey].caseStudy, metrics: [...(prev[editingServiceKey].caseStudy.metrics || []), { label: "Yeni Metrik", val: "0", icon: "fa-solid fa-chart-line" }] } } }));
  };
  const handleDeleteMetric = index => {
    setServicesData(prev => ({ ...prev, [editingServiceKey]: { ...prev[editingServiceKey], caseStudy: { ...prev[editingServiceKey].caseStudy, metrics: (prev[editingServiceKey].caseStudy.metrics || []).filter((_, i) => i !== index) } } }));
  };

  const handleFaqChange = (index, field, value) => {
    setServicesData(prev => { const f = [...(prev[editingServiceKey].faqs || [])]; f[index] = { ...f[index], [field]: value }; return { ...prev, [editingServiceKey]: { ...prev[editingServiceKey], faqs: f } }; });
  };
  const handleAddFaq = () => {
    setServicesData(prev => ({ ...prev, [editingServiceKey]: { ...prev[editingServiceKey], faqs: [...(prev[editingServiceKey].faqs || []), { q: "Yeni Soru?", a: "Cevap açıklaması..." }] } }));
  };
  const handleDeleteFaq = index => {
    setServicesData(prev => ({ ...prev, [editingServiceKey]: { ...prev[editingServiceKey], faqs: (prev[editingServiceKey].faqs || []).filter((_, i) => i !== index) } }));
  };

  const handleProcessChange = (index, field, value) => {
    setServicesData(prev => { const p = [...(prev[editingServiceKey].process || [])]; p[index] = { ...p[index], [field]: value }; return { ...prev, [editingServiceKey]: { ...prev[editingServiceKey], process: p } }; });
  };
  const handleAddProcessStep = () => {
    setServicesData(prev => { const p = [...(prev[editingServiceKey].process || [])]; p.push({ step: String(p.length + 1).padStart(2, '0'), title: "Yeni Adım", desc: "Süreç açıklaması..." }); return { ...prev, [editingServiceKey]: { ...prev[editingServiceKey], process: p } }; });
  };
  const handleDeleteProcessStep = index => {
    setServicesData(prev => ({ ...prev, [editingServiceKey]: { ...prev[editingServiceKey], process: (prev[editingServiceKey].process || []).filter((_, i) => i !== index).map((p, i) => ({ ...p, step: String(i + 1).padStart(2, '0') })) } }));
  };

  const handleAddNewService = () => {
    const slug = window.prompt("Yeni hizmet için benzersiz bir İngilizce anahtar kelime/slug girin (Örn: video-kreatif):");
    if (!slug) return;
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    if (!cleanSlug) { toast.error("Geçersiz anahtar kelime!"); return; }
    if (servicesData[cleanSlug]) { toast("Bu anahtar kelime zaten kullanımda!"); return; }
    const title = window.prompt("Hizmet başlığını girin (Örn: Video ve Kreatif Üretimi):");
    if (!title) return;
    setServicesData(prev => ({ ...prev, [cleanSlug]: { baseFee: 20000, title, tagline: "Minimum Bütçe ve Yüksek Etki Odaklı Hizmet", iconName: "fa-solid fa-compass", description: "Bu yeni hizmet hakkında detaylı açıklama yazısı...", features: ["Örnek Hizmet Maddesi 1", "Örnek Hizmet Maddesi 2"], caseStudy: { brand: "Örnek Marka", industry: "E-Ticaret", challenge: "Yaşanılan problem detayı...", solution: "Ürettiğimiz yol haritası...", metrics: [{ label: "Dönüşüm Oranı", val: "+120%", icon: "fa-solid fa-chart-line" }, { label: "ROAS Artışı", val: "5.4x", icon: "fa-solid fa-arrow-up-right-dots" }] }, testimonial: { name: "Yönetici Adı", company: "Şirket Adı", role: "Genel Müdür", rating: 5, quote: "Yapılan çalışmalardan son derece memnun kaldık.", initials: "YA" }, process: [{ step: "01", title: "Planlama", desc: "Hizmet kurulumunun yapılması." }, { step: "02", title: "Uygulama", desc: "Optimizasyonların yapılması." }], faqs: [{ q: "Hizmet teslim süresi nedir?", a: "Ortalama 2-4 haftadır." }] } }));
    setEditingServiceKey(cleanSlug);
  };

  const handleDeleteService = keyToDelete => {
    if (keyToDelete === 'google' || keyToDelete === 'meta') { toast("Google Ads ve Meta Ads hizmetleri silinemez."); return; }
    if (window.confirm(`"${servicesData[keyToDelete]?.title || keyToDelete}" hizmetini silmek istediğinize emin misiniz?`)) {
      setServicesData(prev => { const u = { ...prev }; delete u[keyToDelete]; return u; });
      setEditingServiceKey(Object.keys(servicesData).filter(k => k !== keyToDelete)[0] || 'google');
    }
  };

  // Shared Tailwind classes
  const inputCls = "w-full p-3 rounded-lg border border-glass-border bg-white focus:border-primary outline-none transition-colors";
  const inputSmCls = "w-full py-2.5 px-2.5 rounded-md border border-glass-border bg-white focus:border-primary outline-none transition-colors text-xs";
  const sectionTitle = "text-lg font-bold text-text-light mb-5 flex items-center gap-2 border-b border-slate-900/5 pb-2";
  const subHeaderCls = "flex justify-between items-center mb-5 border-b border-slate-900/5 pb-2";
  const addBtnCls = "btn btn-secondary py-1 px-2.5 text-xs inline-flex items-center gap-1.5 cursor-pointer rounded-md";
  const cardCls = "p-5 border border-glass-border rounded-lg bg-slate-900/[0.01] shadow-[0_2px_6px_rgba(15,23,42,0.01)]";
  const emptyCls = "text-center py-8 border border-dashed border-glass-border rounded-lg text-text-muted text-sm";
  const smallLabel = "text-xs";

  const svc = servicesData[editingServiceKey];

  const SaveButton = () => (
    <button type="submit" className="btn btn-primary w-full py-3 text-sm rounded-lg cursor-pointer inline-flex items-center justify-center gap-2">
      <i className="fa-solid fa-floppy-disk"></i> Değişiklikleri Kaydet
    </button>
  );

  return (
    <div>
      {/* Header */}
      <div className="admin-section-title flex justify-between items-center flex-wrap gap-4 mb-6">
        <span>Hizmet Sayfaları İçerik Yönetimi</span>
        <button type="button" onClick={handleAddNewService} className="btn btn-primary py-1.5 px-3 text-xs rounded-lg cursor-pointer inline-flex items-center gap-1.5">
          <i className="fa-solid fa-plus"></i> Yeni Hizmet Ekle
        </button>
      </div>

      {/* Service Selection Cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 mb-10">
        {Object.keys(servicesData).map(key => {
          const s = servicesData[key];
          const isEditing = editingServiceKey === key;
          return <div key={key} onClick={() => { setEditingServiceKey(key); setActiveServiceEditSection('basic'); }} className={`service-select-card ${isEditing ? 'active' : ''}`}>
            <div className="service-select-card-icon">
              <i className={s.iconName || 'fa-solid fa-briefcase'}></i>
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-sm font-bold text-text-light whitespace-nowrap overflow-hidden text-ellipsis">{s.title || key}</span>
              <span className="block text-[0.7rem] text-text-muted mt-0.5">{key === 'google' || key === 'meta' ? 'Varsayılan Hizmet' : 'Özel Hizmet'}</span>
            </div>
          </div>;
        })}
      </div>

      {svc && <form onSubmit={e => { e.preventDefault(); handleSaveAll(); }} className="admin-split-layout">
        {/* Sidebar */}
        <div className="service-editor-sidebar admin-split-sidebar">
          {[
            { id: 'basic', label: 'Temel Bilgiler', icon: 'fa-solid fa-circle-info' },
            { id: 'features', label: 'Kapsam Maddeleri', icon: 'fa-solid fa-list-check' },
            { id: 'process', label: 'Hizmet Süreci', icon: 'fa-solid fa-spinner' },
            { id: 'case', label: 'Başarı Hikayesi (Vaka)', icon: 'fa-solid fa-award' },
            { id: 'testimonial', label: 'Müşteri Yorumu', icon: 'fa-solid fa-comment-dots' },
            { id: 'faqs', label: 'Sıkça Sorulan Sorular', icon: 'fa-solid fa-circle-question' },
            { id: 'seo', label: 'SEO Ayarları', icon: 'fa-solid fa-magnifying-glass' }
          ].map(sec => <button key={sec.id} type="button" onClick={() => setActiveServiceEditSection(sec.id)} className={`service-sec-btn ${activeServiceEditSection === sec.id ? 'active' : ''}`}>
            <i className={`${sec.icon} w-4 text-center text-[0.95rem]`}></i>
            {sec.label}
          </button>)}

          <div className="admin-split-sidebar-save flex flex-col gap-2.5">
            <SaveButton />
            {editingServiceKey !== 'google' && editingServiceKey !== 'meta' && <button type="button" onClick={() => handleDeleteService(editingServiceKey)} className="btn btn-secondary w-full py-3 text-sm text-red-500 border-red-500/20 bg-red-500/[0.03] rounded-lg cursor-pointer inline-flex items-center justify-center gap-2">
              <i className="fa-solid fa-trash-can"></i> Hizmeti Sil
            </button>}
          </div>
        </div>

        {/* Content */}
        <div className="service-editor-fields admin-split-content">
          
          {/* Basic */}
          {activeServiceEditSection === 'basic' && <div>
            <h4 className={sectionTitle}><i className="fa-solid fa-circle-info text-primary"></i> Temel Hizmet Bilgileri</h4>
            <div className="admin-form-group"><label>Hizmet Başlığı</label><input type="text" value={svc.title || ''} onChange={e => handleServiceFieldChange('title', e.target.value)} className={inputCls} /></div>
            <div className="admin-form-row">
              <div className="admin-form-group"><label>Hizmet İkon Sınıfı (FontAwesome)</label><input type="text" value={svc.iconName || ''} onChange={e => handleServiceFieldChange('iconName', e.target.value)} className={inputCls} placeholder="fa-solid fa-briefcase" /></div>
              <div className="admin-form-group"><label>Taban Fiyat (Hesaplayıcı İçin - ₺)</label><input type="number" value={svc.baseFee || 0} onChange={e => handleServiceFieldChange('baseFee', parseInt(e.target.value) || 0)} className={inputCls} /></div>
            </div>
            <div className="admin-form-group"><label>Spot / Slogan (Tagline)</label><input type="text" value={svc.tagline || ''} onChange={e => handleServiceFieldChange('tagline', e.target.value)} className={inputCls} /></div>
            <div className="admin-form-group !m-0"><label>Açıklama Metni</label><textarea rows="6" value={svc.description || ''} onChange={e => handleServiceFieldChange('description', e.target.value)} className={`${inputCls} font-sans leading-relaxed`}></textarea></div>
          </div>}

          {/* Features */}
          {activeServiceEditSection === 'features' && <div>
            <div className={subHeaderCls}>
              <h4 className="text-lg font-bold text-text-light m-0 flex items-center gap-2"><i className="fa-solid fa-list-check text-primary"></i> Hizmet Kapsam Maddeleri</h4>
              <button type="button" onClick={handleAddFeature} className={addBtnCls}><i className="fa-solid fa-plus"></i> Madde Ekle</button>
            </div>
            <p className="text-xs text-text-muted mb-5">Sitenizdeki hizmet kartlarında ve detay sayfalarında sergilenen temel maddeler.</p>
            <div className="flex flex-col gap-3">
              {(svc.features || []).map((feature, idx) => <div key={idx} className="flex gap-2 items-center">
                <span className="text-xs font-bold text-text-muted w-5 text-center">#{idx + 1}</span>
                <input type="text" value={feature || ''} onChange={e => handleFeatureChange(idx, e.target.value)} className={`${inputCls} flex-1`} placeholder="Örn: Google Analytics Kurulumu ve Takibi" />
                <button type="button" onClick={() => handleDeleteFeature(idx)} className="btn-icon btn-delete p-3 rounded-lg cursor-pointer" title="Sil"><i className="fa-solid fa-trash-can"></i></button>
              </div>)}
              {(svc.features || []).length === 0 && <div className={emptyCls}>Henüz kapsam maddesi eklenmemiş.</div>}
            </div>
          </div>}

          {/* Process */}
          {activeServiceEditSection === 'process' && <div>
            <div className={subHeaderCls}>
              <h4 className="text-lg font-bold text-text-light m-0 flex items-center gap-2"><i className="fa-solid fa-spinner text-primary"></i> Hizmet Süreci Adımları</h4>
              <button type="button" onClick={handleAddProcessStep} className={addBtnCls}><i className="fa-solid fa-plus"></i> Adım Ekle</button>
            </div>
            <p className="text-xs text-text-muted mb-5">Hizmeti verirken takip ettiğiniz profesyonel aşamaları listeleyin.</p>
            <div className="flex flex-col gap-5">
              {(svc.process || []).map((step, idx) => <div key={idx} className={cardCls}>
                <div className="flex justify-between items-center mb-4 border-b border-slate-900/5 pb-2">
                  <strong className="text-sm text-primary">Adım #{step.step || String(idx + 1).padStart(2, '0')}</strong>
                  <button type="button" onClick={() => handleDeleteProcessStep(idx)} className="btn-icon btn-delete py-1 px-2 text-xs cursor-pointer inline-flex items-center gap-1" title="Sil"><i className="fa-solid fa-trash-can"></i> Sil</button>
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group"><label className={smallLabel}>Aşama Başlığı</label><input type="text" value={step.title || ''} onChange={e => handleProcessChange(idx, 'title', e.target.value)} className={inputSmCls} /></div>
                  <div className="admin-form-group"><label className={smallLabel}>Aşama No (Örn: 01)</label><input type="text" value={step.step || ''} onChange={e => handleProcessChange(idx, 'step', e.target.value)} className={inputSmCls} /></div>
                </div>
                <div className="admin-form-group !m-0"><label className={smallLabel}>Aşama Detay Açıklaması</label><textarea rows="2" value={step.desc || ''} onChange={e => handleProcessChange(idx, 'desc', e.target.value)} className={`${inputSmCls} font-sans`}></textarea></div>
              </div>)}
              {(svc.process || []).length === 0 && <div className={emptyCls}>Henüz süreç adımı eklenmemiş.</div>}
            </div>
          </div>}

          {/* Case Study */}
          {activeServiceEditSection === 'case' && <div>
            <h4 className={sectionTitle}><i className="fa-solid fa-award text-primary"></i> Başarı Hikayesi (Vaka Analizi)</h4>
            <p className="text-xs text-text-muted mb-5">Bu hizmetle ilgili ulaştığınız somut bir başarıyı vaka analizi olarak ekleyin.</p>
            {svc.caseStudy ? <div>
              <div className="admin-form-row">
                <div className="admin-form-group"><label>Marka / Firma Adı</label><input type="text" value={svc.caseStudy.brand || ''} onChange={e => handleServiceNestedChange('caseStudy', 'brand', e.target.value)} className={inputCls} /></div>
                <div className="admin-form-group"><label>Sektör</label><input type="text" value={svc.caseStudy.industry || ''} onChange={e => handleServiceNestedChange('caseStudy', 'industry', e.target.value)} className={inputCls} /></div>
              </div>
              <div className="admin-form-group"><label>Zorluk (Problem)</label><textarea rows="3" value={svc.caseStudy.challenge || ''} onChange={e => handleServiceNestedChange('caseStudy', 'challenge', e.target.value)} className={`${inputCls} font-sans`}></textarea></div>
              <div className="admin-form-group"><label>Yol Haritamız (Çözüm)</label><textarea rows="3" value={svc.caseStudy.solution || ''} onChange={e => handleServiceNestedChange('caseStudy', 'solution', e.target.value)} className={`${inputCls} font-sans`}></textarea></div>
              
              <div className="flex justify-between items-center mt-8 mb-4 border-t border-glass-border pt-5">
                <span className="text-sm font-bold text-text-light">Başarı Hikayesi Metrikleri</span>
                <button type="button" onClick={handleAddMetric} className={addBtnCls}><i className="fa-solid fa-plus"></i> Metrik Ekle</button>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                {(svc.caseStudy.metrics || []).map((metric, idx) => <div key={idx} className={`${cardCls} relative`}>
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-xs text-text-muted">Metrik #{idx + 1}</strong>
                    <button type="button" onClick={() => handleDeleteMetric(idx)} className="btn-icon btn-delete py-0.5 px-1.5 text-[0.7rem] cursor-pointer" title="Sil"><i className="fa-solid fa-trash-can"></i></button>
                  </div>
                  <div className="admin-form-group mb-2.5"><label className="text-[0.7rem] mb-0.5">Etiket</label><input type="text" value={metric.label || ''} onChange={e => handleMetricChange(idx, 'label', e.target.value)} className={inputSmCls} /></div>
                  <div className="admin-form-group mb-2.5"><label className="text-[0.7rem] mb-0.5">Değer</label><input type="text" value={metric.val || ''} onChange={e => handleMetricChange(idx, 'val', e.target.value)} className={inputSmCls} /></div>
                  <div className="admin-form-group !m-0"><label className="text-[0.7rem] mb-0.5">İkon</label><input type="text" value={metric.icon || ''} onChange={e => handleMetricChange(idx, 'icon', e.target.value)} className={inputSmCls} placeholder="fa-solid fa-chart-line" /></div>
                </div>)}
              </div>
            </div> : <div className={emptyCls}>Bu hizmete ait bir vaka analizi oluşturulmamış.</div>}
          </div>}

          {/* Testimonial */}
          {activeServiceEditSection === 'testimonial' && <div>
            <h4 className={sectionTitle}><i className="fa-solid fa-comment-dots text-primary"></i> Hizmete Özel Müşteri Yorumu</h4>
            <p className="text-xs text-text-muted mb-5">Bu hizmetle ilgili müşterilerinizden aldığınız olumlu geribildirimi detay sayfasında göstermek üzere ayarlayın.</p>
            {svc.testimonial ? <div>
              <div className="admin-form-row">
                <div className="admin-form-group"><label>Müşteri Ad Soyad</label><input type="text" value={svc.testimonial.name || ''} onChange={e => handleServiceNestedChange('testimonial', 'name', e.target.value)} className={inputCls} /></div>
                <div className="admin-form-group"><label>Şirket Adı</label><input type="text" value={svc.testimonial.company || ''} onChange={e => handleServiceNestedChange('testimonial', 'company', e.target.value)} className={inputCls} /></div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group"><label>Görev / Unvan</label><input type="text" value={svc.testimonial.role || ''} onChange={e => handleServiceNestedChange('testimonial', 'role', e.target.value)} className={inputCls} /></div>
                <div className="admin-form-group"><label>Puan (1-5)</label>
                  <select value={svc.testimonial.rating || 5} onChange={e => handleServiceNestedChange('testimonial', 'rating', parseInt(e.target.value))} className={inputCls}>
                    <option value="5">5 Yıldız</option><option value="4">4 Yıldız</option><option value="3">3 Yıldız</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group !m-0"><label>Yorum Metni</label><textarea rows="4" value={svc.testimonial.quote || ''} onChange={e => handleServiceNestedChange('testimonial', 'quote', e.target.value)} className={`${inputCls} font-sans leading-relaxed`}></textarea></div>
            </div> : <div className={emptyCls}>Bu hizmete ait bir yorum oluşturulmamış.</div>}
          </div>}

          {/* FAQs */}
          {activeServiceEditSection === 'faqs' && <div>
            <div className={subHeaderCls}>
              <h4 className="text-lg font-bold text-text-light m-0 flex items-center gap-2"><i className="fa-solid fa-circle-question text-primary"></i> Sıkça Sorulan Sorular (SSS)</h4>
              <button type="button" onClick={handleAddFaq} className={addBtnCls}><i className="fa-solid fa-plus"></i> Soru Ekle</button>
            </div>
            <p className="text-xs text-text-muted mb-5">Potansiyel müşterilerin kafasındaki soru işaretlerini gidermek için SSS ekleyin.</p>
            <div className="flex flex-col gap-6">
              {(svc.faqs || []).map((faq, idx) => <div key={idx} className={cardCls}>
                <div className="flex justify-between items-center mb-4 border-b border-slate-900/5 pb-2">
                  <strong className="text-sm text-text-light">Soru #{idx + 1}</strong>
                  <button type="button" onClick={() => handleDeleteFaq(idx)} className="btn-icon btn-delete py-1 px-2 text-xs cursor-pointer inline-flex items-center gap-1" title="Sil"><i className="fa-solid fa-trash-can"></i> Sil</button>
                </div>
                <div className="admin-form-group"><label className={smallLabel}>Soru Metni</label><input type="text" value={faq.q || ''} onChange={e => handleFaqChange(idx, 'q', e.target.value)} className={inputCls} placeholder="Örn: Raporlama sıklığı nedir?" /></div>
                <div className="admin-form-group !m-0"><label className={smallLabel}>Cevap Metni</label><textarea rows="3" value={faq.a || ''} onChange={e => handleFaqChange(idx, 'a', e.target.value)} className={`${inputCls} font-sans leading-relaxed`} placeholder="Haftalık detaylı raporlar..."></textarea></div>
              </div>)}
              {(svc.faqs || []).length === 0 && <div className={emptyCls}>Henüz soru eklenmemiş.</div>}
            </div>
          </div>}

          {/* SEO */}
          {activeServiceEditSection === 'seo' && <div>
            <h4 className={sectionTitle}><i className="fa-solid fa-magnifying-glass text-primary"></i> Hizmete Özel SEO ve Meta Etiket Ayarları</h4>
            <p className="text-xs text-text-muted mb-5">Arama motorlarında bu hizmet sayfasının bulunabilirliğini artırın.</p>
            <div className="admin-form-group"><label>Meta Başlığı (Title)</label><input type="text" value={svc.seo_title || ''} onChange={e => handleServiceFieldChange('seo_title', e.target.value)} className={inputCls} placeholder={`${svc.title} | Ajans Rota`} /></div>
            <div className="admin-form-group"><label>Meta Açıklaması (Description)</label><textarea rows="4" value={svc.seo_description || ''} onChange={e => handleServiceFieldChange('seo_description', e.target.value)} className={`${inputCls} font-sans leading-relaxed`} placeholder="150-160 karakterlik bir özet yazın."></textarea></div>
            <div className="admin-form-group !m-0"><label>Meta Anahtar Kelimeler</label><input type="text" value={svc.seo_keywords || ''} onChange={e => handleServiceFieldChange('seo_keywords', e.target.value)} className={inputCls} placeholder="google ads ajansı izmir, seo..." /></div>
          </div>}

          {/* Mobile Save */}
          <div className="mobile-only-save mt-8">
            <SaveButton />
          </div>
        </div>
      </form>}
    </div>
  );
}
