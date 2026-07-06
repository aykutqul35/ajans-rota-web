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
  const inputCls = "w-full p-3 rounded-lg border border-glass bg-white/5 focus:border-primary outline-none transition-colors text-sm text-textLight font-body";
  const inputSmCls = "w-full py-2 px-3 rounded-md border border-glass bg-white/5 focus:border-primary outline-none transition-colors text-xs text-textLight font-body";
  const sectionTitle = "text-lg font-bold text-textLight mb-5 flex items-center gap-2 border-b border-glass pb-2";
  const subHeaderCls = "flex justify-between items-center mb-5 border-b border-glass pb-2";
  const addBtnCls = "flex items-center gap-1.5 bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 transition-colors py-1.5 px-3 text-xs font-semibold rounded-md cursor-pointer";
  const cardCls = "p-5 border border-glass rounded-lg bg-white/2 relative";
  const emptyCls = "text-center py-8 border border-dashed border-glass rounded-lg text-textMuted text-sm";
  const smallLabel = "block text-xs font-semibold text-textMuted mb-1";
  const labelCls = "block text-[13px] font-semibold text-textMuted mb-1.5";

  const svc = servicesData[editingServiceKey];

  const SaveButton = () => (
    <button type="submit" className="w-full py-3 text-sm rounded-lg cursor-pointer flex items-center justify-center gap-2 bg-primary text-white font-semibold hover:bg-primary/90 transition-colors border-none">
      <i className="fa-solid fa-floppy-disk"></i> Değişiklikleri Kaydet
    </button>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6 bg-white/2 border border-glass p-4 rounded-xl">
        <span className="text-xl font-bold text-textLight">Hizmet Sayfaları İçerik Yönetimi</span>
        <button type="button" onClick={handleAddNewService} className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 py-2 px-4 text-sm font-semibold rounded-lg cursor-pointer transition-colors">
          <i className="fa-solid fa-plus"></i> Yeni Hizmet Ekle
        </button>
      </div>

      {/* Service Selection Cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 mb-8">
        {Object.keys(servicesData).map(key => {
          const s = servicesData[key];
          const isEditing = editingServiceKey === key;
          return <div key={key} onClick={() => { setEditingServiceKey(key); setActiveServiceEditSection('basic'); }} className={`p-4 rounded-xl cursor-pointer transition-all border flex items-center gap-3 ${isEditing ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(14,165,233,0.15)]' : 'bg-white/2 border-glass hover:bg-white/5 hover:border-white/10'}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${isEditing ? 'bg-primary text-white' : 'bg-white/5 text-textMuted'}`}>
              <i className={s.iconName || 'fa-solid fa-briefcase'}></i>
            </div>
            <div className="flex-1 min-w-0">
              <span className={`block text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis ${isEditing ? 'text-primary' : 'text-textLight'}`}>{s.title || key}</span>
              <span className={`block text-[11px] mt-0.5 ${isEditing ? 'text-primary/70' : 'text-textMuted'}`}>{key === 'google' || key === 'meta' ? 'Varsayılan Hizmet' : 'Özel Hizmet'}</span>
            </div>
          </div>;
        })}
      </div>

      {svc && <form onSubmit={e => { e.preventDefault(); handleSaveAll(); }} className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar */}
        <div className="w-full lg:w-[260px] lg:sticky lg:top-6 flex flex-col gap-2 shrink-0">
          <div className="bg-white/2 border border-glass rounded-xl p-2 flex flex-col gap-1">
            {[
              { id: 'basic', label: 'Temel Bilgiler', icon: 'fa-solid fa-circle-info' },
              { id: 'features', label: 'Kapsam Maddeleri', icon: 'fa-solid fa-list-check' },
              { id: 'process', label: 'Hizmet Süreci', icon: 'fa-solid fa-spinner' },
              { id: 'case', label: 'Başarı Hikayesi (Vaka)', icon: 'fa-solid fa-award' },
              { id: 'testimonial', label: 'Müşteri Yorumu', icon: 'fa-solid fa-comment-dots' },
              { id: 'faqs', label: 'Sıkça Sorulan Sorular', icon: 'fa-solid fa-circle-question' },
              { id: 'seo', label: 'SEO Ayarları', icon: 'fa-solid fa-magnifying-glass' }
            ].map(sec => <button key={sec.id} type="button" onClick={() => setActiveServiceEditSection(sec.id)} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors border-none cursor-pointer text-left w-full ${activeServiceEditSection === sec.id ? 'bg-white/10 text-white' : 'bg-transparent text-textMuted hover:bg-white/5 hover:text-textLight'}`}>
              <i className={`${sec.icon} w-5 text-center text-base ${activeServiceEditSection === sec.id ? 'text-primary' : ''}`}></i>
              {sec.label}
            </button>)}
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <SaveButton />
            {editingServiceKey !== 'google' && editingServiceKey !== 'meta' && <button type="button" onClick={() => handleDeleteService(editingServiceKey)} className="w-full py-3 text-sm text-red-500 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-colors font-semibold">
              <i className="fa-solid fa-trash-can"></i> Hizmeti Sil
            </button>}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 w-full bg-white/2 border border-glass rounded-xl p-6 lg:p-8 min-w-0">
          
          {/* Basic */}
          {activeServiceEditSection === 'basic' && <div className="flex flex-col gap-5">
            <h4 className={sectionTitle}><i className="fa-solid fa-circle-info text-primary"></i> Temel Hizmet Bilgileri</h4>
            <div><label className={labelCls}>Hizmet Başlığı</label><input type="text" value={svc.title || ''} onChange={e => handleServiceFieldChange('title', e.target.value)} className={inputCls} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label className={labelCls}>Hizmet İkon Sınıfı (FontAwesome)</label><input type="text" value={svc.iconName || ''} onChange={e => handleServiceFieldChange('iconName', e.target.value)} className={inputCls} placeholder="fa-solid fa-briefcase" /></div>
              <div><label className={labelCls}>Taban Fiyat (Hesaplayıcı İçin - ₺)</label><input type="number" value={svc.baseFee || 0} onChange={e => handleServiceFieldChange('baseFee', parseInt(e.target.value) || 0)} className={inputCls} /></div>
            </div>
            <div><label className={labelCls}>Spot / Slogan (Tagline)</label><input type="text" value={svc.tagline || ''} onChange={e => handleServiceFieldChange('tagline', e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Açıklama Metni</label><textarea rows="6" value={svc.description || ''} onChange={e => handleServiceFieldChange('description', e.target.value)} className={`${inputCls} resize-y`}></textarea></div>
          </div>}

          {/* Features */}
          {activeServiceEditSection === 'features' && <div>
            <div className={subHeaderCls}>
              <h4 className="text-lg font-bold text-textLight m-0 flex items-center gap-2"><i className="fa-solid fa-list-check text-primary"></i> Hizmet Kapsam Maddeleri</h4>
              <button type="button" onClick={handleAddFeature} className={addBtnCls}><i className="fa-solid fa-plus"></i> Madde Ekle</button>
            </div>
            <p className="text-xs text-textMuted mb-5">Sitenizdeki hizmet kartlarında ve detay sayfalarında sergilenen temel maddeler.</p>
            <div className="flex flex-col gap-3">
              {(svc.features || []).map((feature, idx) => <div key={idx} className="flex gap-3 items-center">
                <span className="text-xs font-bold text-textMuted w-6 text-center">#{idx + 1}</span>
                <input type="text" value={feature || ''} onChange={e => handleFeatureChange(idx, e.target.value)} className={`${inputCls} flex-1 !py-2`} placeholder="Örn: Google Analytics Kurulumu ve Takibi" />
                <button type="button" onClick={() => handleDeleteFeature(idx)} className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer" title="Sil"><i className="fa-solid fa-trash-can"></i></button>
              </div>)}
              {(svc.features || []).length === 0 && <div className={emptyCls}>Henüz kapsam maddesi eklenmemiş.</div>}
            </div>
          </div>}

          {/* Process */}
          {activeServiceEditSection === 'process' && <div>
            <div className={subHeaderCls}>
              <h4 className="text-lg font-bold text-textLight m-0 flex items-center gap-2"><i className="fa-solid fa-spinner text-primary"></i> Hizmet Süreci Adımları</h4>
              <button type="button" onClick={handleAddProcessStep} className={addBtnCls}><i className="fa-solid fa-plus"></i> Adım Ekle</button>
            </div>
            <p className="text-xs text-textMuted mb-5">Hizmeti verirken takip ettiğiniz profesyonel aşamaları listeleyin.</p>
            <div className="flex flex-col gap-5">
              {(svc.process || []).map((step, idx) => <div key={idx} className={cardCls}>
                <div className="flex justify-between items-center mb-4 border-b border-glass pb-2">
                  <strong className="text-[13px] font-bold text-primary">Adım #{step.step || String(idx + 1).padStart(2, '0')}</strong>
                  <button type="button" onClick={() => handleDeleteProcessStep(idx)} className="text-xs font-semibold text-red-500 hover:text-red-400 bg-transparent border-none cursor-pointer flex items-center gap-1.5" title="Sil"><i className="fa-solid fa-trash-can"></i> Sil</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div><label className={smallLabel}>Aşama Başlığı</label><input type="text" value={step.title || ''} onChange={e => handleProcessChange(idx, 'title', e.target.value)} className={inputSmCls} /></div>
                  <div><label className={smallLabel}>Aşama No (Örn: 01)</label><input type="text" value={step.step || ''} onChange={e => handleProcessChange(idx, 'step', e.target.value)} className={inputSmCls} /></div>
                </div>
                <div><label className={smallLabel}>Aşama Detay Açıklaması</label><textarea rows="2" value={step.desc || ''} onChange={e => handleProcessChange(idx, 'desc', e.target.value)} className={`${inputSmCls} resize-y`}></textarea></div>
              </div>)}
              {(svc.process || []).length === 0 && <div className={emptyCls}>Henüz süreç adımı eklenmemiş.</div>}
            </div>
          </div>}

          {/* Case Study */}
          {activeServiceEditSection === 'case' && <div>
            <h4 className={sectionTitle}><i className="fa-solid fa-award text-primary"></i> Başarı Hikayesi (Vaka Analizi)</h4>
            <p className="text-xs text-textMuted mb-5">Bu hizmetle ilgili ulaştığınız somut bir başarıyı vaka analizi olarak ekleyin.</p>
            {svc.caseStudy ? <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelCls}>Marka / Firma Adı</label><input type="text" value={svc.caseStudy.brand || ''} onChange={e => handleServiceNestedChange('caseStudy', 'brand', e.target.value)} className={inputCls} /></div>
                <div><label className={labelCls}>Sektör</label><input type="text" value={svc.caseStudy.industry || ''} onChange={e => handleServiceNestedChange('caseStudy', 'industry', e.target.value)} className={inputCls} /></div>
              </div>
              <div><label className={labelCls}>Zorluk (Problem)</label><textarea rows="3" value={svc.caseStudy.challenge || ''} onChange={e => handleServiceNestedChange('caseStudy', 'challenge', e.target.value)} className={`${inputCls} resize-y`}></textarea></div>
              <div><label className={labelCls}>Yol Haritamız (Çözüm)</label><textarea rows="3" value={svc.caseStudy.solution || ''} onChange={e => handleServiceNestedChange('caseStudy', 'solution', e.target.value)} className={`${inputCls} resize-y`}></textarea></div>
              
              <div className="flex justify-between items-center mt-6 mb-2 border-t border-glass pt-5">
                <span className="text-sm font-bold text-textLight">Başarı Hikayesi Metrikleri</span>
                <button type="button" onClick={handleAddMetric} className={addBtnCls}><i className="fa-solid fa-plus"></i> Metrik Ekle</button>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                {(svc.caseStudy.metrics || []).map((metric, idx) => <div key={idx} className={cardCls}>
                  <div className="flex justify-between items-center mb-3">
                    <strong className="text-xs font-semibold text-textMuted">Metrik #{idx + 1}</strong>
                    <button type="button" onClick={() => handleDeleteMetric(idx)} className="w-6 h-6 flex items-center justify-center rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer border-none text-[10px]" title="Sil"><i className="fa-solid fa-trash-can"></i></button>
                  </div>
                  <div className="mb-3"><label className="block text-[11px] font-semibold text-textMuted mb-1">Etiket</label><input type="text" value={metric.label || ''} onChange={e => handleMetricChange(idx, 'label', e.target.value)} className={inputSmCls} /></div>
                  <div className="mb-3"><label className="block text-[11px] font-semibold text-textMuted mb-1">Değer</label><input type="text" value={metric.val || ''} onChange={e => handleMetricChange(idx, 'val', e.target.value)} className={inputSmCls} /></div>
                  <div><label className="block text-[11px] font-semibold text-textMuted mb-1">İkon (FA Sınıfı)</label><input type="text" value={metric.icon || ''} onChange={e => handleMetricChange(idx, 'icon', e.target.value)} className={inputSmCls} placeholder="fa-solid fa-chart-line" /></div>
                </div>)}
              </div>
            </div> : <div className={emptyCls}>Bu hizmete ait bir vaka analizi oluşturulmamış.</div>}
          </div>}

          {/* Testimonial */}
          {activeServiceEditSection === 'testimonial' && <div>
            <h4 className={sectionTitle}><i className="fa-solid fa-comment-dots text-primary"></i> Hizmete Özel Müşteri Yorumu</h4>
            <p className="text-xs text-textMuted mb-5">Bu hizmetle ilgili müşterilerinizden aldığınız olumlu geribildirimi detay sayfasında göstermek üzere ayarlayın.</p>
            {svc.testimonial ? <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelCls}>Müşteri Ad Soyad</label><input type="text" value={svc.testimonial.name || ''} onChange={e => handleServiceNestedChange('testimonial', 'name', e.target.value)} className={inputCls} /></div>
                <div><label className={labelCls}>Şirket Adı</label><input type="text" value={svc.testimonial.company || ''} onChange={e => handleServiceNestedChange('testimonial', 'company', e.target.value)} className={inputCls} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelCls}>Görev / Unvan</label><input type="text" value={svc.testimonial.role || ''} onChange={e => handleServiceNestedChange('testimonial', 'role', e.target.value)} className={inputCls} /></div>
                <div>
                  <label className={labelCls}>Puan (1-5)</label>
                  <select value={svc.testimonial.rating || 5} onChange={e => handleServiceNestedChange('testimonial', 'rating', parseInt(e.target.value))} className={`${inputCls} appearance-none bg-no-repeat bg-right pr-10`} style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundSize: '0.65rem auto', backgroundPosition: 'calc(100% - 1rem) center' }}>
                    <option value="5">5 Yıldız</option><option value="4">4 Yıldız</option><option value="3">3 Yıldız</option>
                  </select>
                </div>
              </div>
              <div><label className={labelCls}>Yorum Metni</label><textarea rows="4" value={svc.testimonial.quote || ''} onChange={e => handleServiceNestedChange('testimonial', 'quote', e.target.value)} className={`${inputCls} resize-y`}></textarea></div>
            </div> : <div className={emptyCls}>Bu hizmete ait bir yorum oluşturulmamış.</div>}
          </div>}

          {/* FAQs */}
          {activeServiceEditSection === 'faqs' && <div>
            <div className={subHeaderCls}>
              <h4 className="text-lg font-bold text-textLight m-0 flex items-center gap-2"><i className="fa-solid fa-circle-question text-primary"></i> Sıkça Sorulan Sorular (SSS)</h4>
              <button type="button" onClick={handleAddFaq} className={addBtnCls}><i className="fa-solid fa-plus"></i> Soru Ekle</button>
            </div>
            <p className="text-xs text-textMuted mb-5">Potansiyel müşterilerin kafasındaki soru işaretlerini gidermek için SSS ekleyin.</p>
            <div className="flex flex-col gap-5">
              {(svc.faqs || []).map((faq, idx) => <div key={idx} className={cardCls}>
                <div className="flex justify-between items-center mb-4 border-b border-glass pb-2">
                  <strong className="text-[13px] font-bold text-textLight">Soru #{idx + 1}</strong>
                  <button type="button" onClick={() => handleDeleteFaq(idx)} className="text-xs font-semibold text-red-500 hover:text-red-400 bg-transparent border-none cursor-pointer flex items-center gap-1.5" title="Sil"><i className="fa-solid fa-trash-can"></i> Sil</button>
                </div>
                <div className="mb-4"><label className={smallLabel}>Soru Metni</label><input type="text" value={faq.q || ''} onChange={e => handleFaqChange(idx, 'q', e.target.value)} className={inputCls} placeholder="Örn: Raporlama sıklığı nedir?" /></div>
                <div><label className={smallLabel}>Cevap Metni</label><textarea rows="3" value={faq.a || ''} onChange={e => handleFaqChange(idx, 'a', e.target.value)} className={`${inputCls} resize-y`} placeholder="Haftalık detaylı raporlar..."></textarea></div>
              </div>)}
              {(svc.faqs || []).length === 0 && <div className={emptyCls}>Henüz soru eklenmemiş.</div>}
            </div>
          </div>}

          {/* SEO */}
          {activeServiceEditSection === 'seo' && <div className="flex flex-col gap-4">
            <h4 className={sectionTitle}><i className="fa-solid fa-magnifying-glass text-primary"></i> Hizmete Özel SEO ve Meta Etiket Ayarları</h4>
            <p className="text-xs text-textMuted mb-1">Arama motorlarında bu hizmet sayfasının bulunabilirliğini artırın.</p>
            <div><label className={labelCls}>Meta Başlığı (Title)</label><input type="text" value={svc.seo_title || ''} onChange={e => handleServiceFieldChange('seo_title', e.target.value)} className={inputCls} placeholder={`${svc.title} | Ajans Rota`} /></div>
            <div><label className={labelCls}>Meta Açıklaması (Description)</label><textarea rows="4" value={svc.seo_description || ''} onChange={e => handleServiceFieldChange('seo_description', e.target.value)} className={`${inputCls} resize-y`} placeholder="150-160 karakterlik bir özet yazın."></textarea></div>
            <div><label className={labelCls}>Meta Anahtar Kelimeler</label><input type="text" value={svc.seo_keywords || ''} onChange={e => handleServiceFieldChange('seo_keywords', e.target.value)} className={inputCls} placeholder="google ads ajansı izmir, seo..." /></div>
          </div>}

          {/* Mobile Save */}
          <div className="lg:hidden mt-8">
            <SaveButton />
          </div>
        </div>
      </form>}
    </div>
  );
}
