import { useState } from 'react';
export default function EditItemModal({
  editingItem, setEditingItem, editingType, setEditingType,
  modalFormData, setModalFormData,
  testimonialsData, setTestimonialsData,
  teamMembersData, setTeamMembersData,
  blogsData, setBlogsData, handleSaveAll, settingsData
}) {
  const [aiKeywords, setAiKeywords] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [blogEditTab, setBlogEditTab] = useState('edit');

  const openEditModal = (type, item) => {
    setEditingType(type); setEditingItem(item);
    if (type === 'blog') setBlogEditTab('edit');
    if (item === 'new') {
      if (type === 'testimonial') setModalFormData({ name: '', company: '', role: '', category: 'google-ads', rating: 5, quote: '', metric: '', initials: '' });
      else if (type === 'team') setModalFormData({ name: '', role: '', init: '', gradient: 'linear-gradient(135deg, #00ebd6, #00b4d8)', desc: '', dept: 'performance', stars: 5, exp: '' });
      else if (type === 'blog') setModalFormData({ title: '', category: 'google', excerpt: '', date: new Date().toLocaleDateString('tr-TR'), readTime: '5 dk okuma', author: '', content: '' });
    } else setModalFormData({ ...item });
  };

  const handleModalSave = e => {
    e.preventDefault();
    if (editingType === 'testimonial') {
      if (editingItem === 'new') { const initials = modalFormData.initials || (modalFormData.name ? modalFormData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'YK'); setTestimonialsData([{ ...modalFormData, initials, id: Date.now() }, ...testimonialsData]); }
      else setTestimonialsData(testimonialsData.map(item => item.id === editingItem.id ? modalFormData : item));
    } else if (editingType === 'team') {
      if (editingItem === 'new') { const init = modalFormData.init || (modalFormData.name ? modalFormData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'UZ'); setTeamMembersData([...teamMembersData, { ...modalFormData, init, id: Date.now() }]); }
      else setTeamMembersData(teamMembersData.map(item => item.name === editingItem.name ? modalFormData : item));
    } else if (editingType === 'blog') {
      if (editingItem === 'new') setBlogsData([{ ...modalFormData, id: Date.now() }, ...blogsData]);
      else setBlogsData(blogsData.map(item => item.id === editingItem.id ? modalFormData : item));
    }
    setEditingItem(null); setEditingType('');
  };

  const handleDeleteItem = (type, item) => {
    if (!window.confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) return;
    if (type === 'testimonial') setTestimonialsData(testimonialsData.filter(i => i.id !== item.id));
    else if (type === 'team') setTeamMembersData(teamMembersData.filter(i => i.name !== item.name));
    else if (type === 'blog') setBlogsData(blogsData.filter(i => i.id !== item.id));
  };

  const upd = (key, val) => setModalFormData(prev => ({ ...prev, [key]: val }));

  const insertHTMLTag = tagType => {
    const textarea = document.getElementById('blog-content-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart, end = textarea.selectionEnd, text = textarea.value, sel = text.substring(start, end);
    let r = '';
    switch (tagType) {
      case 'bold': r = `<strong>${sel || 'kalın metin'}</strong>`; break;
      case 'italic': r = `<em>${sel || 'eğik metin'}</em>`; break;
      case 'h2': r = `<h2>${sel || 'Alt Başlık 2'}</h2>\n`; break;
      case 'h3': r = `<h3>${sel || 'Alt Başlık 3'}</h3>\n`; break;
      case 'p': r = `<p>${sel || 'Yeni paragraf...'}</p>\n`; break;
      case 'link': { const url = prompt('URL:', 'https://'); if (url === null) return; r = `<a href="${url}" target="_blank" rel="noopener noreferrer">${sel || 'Bağlantı Metni'}</a>`; break; }
      case 'quote': r = `<blockquote>\n  ${sel || 'Alıntı metni...'}\n</blockquote>\n`; break;
      case 'ul': r = `<ul>\n  <li>${sel || 'Liste elemanı 1'}</li>\n  <li>Liste elemanı 2</li>\n</ul>\n`; break;
      case 'li': r = `<li>${sel || 'Liste elemanı'}</li>`; break;
      case 'img': { const src = prompt('Resim URL:', '/images/logo.png'); if (src === null) return; const alt = prompt('Alt:', 'Görsel'); if (alt === null) return; r = `<img src="${src}" alt="${alt}" style="max-width:100%; height:auto; border-radius:8px; margin: 1rem 0;" />\n`; break; }
      case 'table': r = `<table style="width:100%; border-collapse:collapse; margin:1rem 0;">\n  <thead>\n    <tr style="background:#f1f5f9;">\n      <th style="border:1px solid #cbd5e1; padding:8px;">Başlık 1</th>\n      <th style="border:1px solid #cbd5e1; padding:8px;">Başlık 2</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td style="border:1px solid #cbd5e1; padding:8px;">Veri 1</td>\n      <td style="border:1px solid #cbd5e1; padding:8px;">Veri 2</td>\n    </tr>\n  </tbody>\n</table>\n`; break;
      default: return;
    }
    upd('content', text.substring(0, start) + r + text.substring(end));
    setTimeout(() => { textarea.focus(); textarea.setSelectionRange(start + r.length, start + r.length); }, 50);
  };

  const handleSuggestKeywords = async (e) => {
    e.preventDefault(); setAiLoading(true); setAiError('');
    const cat = modalFormData.category || 'google';
    const catMap = { google: 'Google Ads / Reklam', meta: 'Meta Ads', seo: 'SEO & İçerik', social: 'Sosyal Medya', ecommerce: 'E-Ticaret', design: 'Web Tasarım / UX' };
    const categoryName = catMap[cat] || 'Dijital Pazarlama';
    if (settingsData.gemini_api_key) {
      try {
        const p = `Dijital pazarlama ajansı blogu için "${categoryName}" kategorisinde en çok aranan, SEO değeri yüksek 5 adet anahtar kelime öner. Virgülle ayrılmış liste ver.`;
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${settingsData.gemini_api_key}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: p }] }] }) });
        const d = await res.json();
        if (d.candidates?.[0]?.content?.parts[0]?.text) setAiKeywords(d.candidates[0].content.parts[0].text.trim().replace(/\n/g, '').replace(/,\s*$/, ''));
        else throw new Error('API yanıtı anlaşılamadı.');
      } catch (err) { setAiError('Hata: ' + err.message); }
    } else {
      const fallbacks = { google: 'google ads dönüşüm izleme, tıklama başı maliyet düşürme, roas artırma', meta: 'facebook piksel, instagram reklam algoritması, advantage+ kampanyaları', seo: 'semantik seo, teknik seo, long-tail anahtar kelime', social: 'instagram etkileşim artırma, reels izlenme, sosyal medya stratejisi', ecommerce: 'e-ticaret sepet terk etme, CRO artırma, shopify seo', design: 'kullanıcı deneyimi optimizasyonu, hızlı web tasarım, mobil uyumlu site' };
      setAiKeywords(fallbacks[cat] || 'dijital pazarlama taktikleri, marka bilinirliği');
    }
    setAiLoading(false);
  };

  const handleGenerateAIBlog = async e => {
    e.preventDefault();
    if (!aiKeywords.trim()) { setAiError('Lütfen anahtar kelime girin.'); return; }
    setAiLoading(true); setAiError('');
    const kw = aiKeywords.toLowerCase();
    if (settingsData.gemini_api_key) {
      try {
        const p = `Aşağıdaki anahtar kelimelere göre Türkçe, SEO uyumlu blog yazısı taslağı oluştur.\nAnahtar kelimeler: ${aiKeywords}\nÇıktıyı düz JSON string olarak ver:\n{"title":"makale başlığı","excerpt":"kısa özet","content":"h3, p, ul, li etiketleriyle 800-1500 kelime detaylı HTML gövde"}`;
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${settingsData.gemini_api_key}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: p }] }] }) });
        if (!res.ok) throw new Error('API isteği başarısız.');
        const d = await res.json();
        let txt = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
        txt = txt.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(txt);
        if (parsed.title && parsed.excerpt && parsed.content) { setModalFormData(prev => ({ ...prev, title: parsed.title, excerpt: parsed.excerpt, content: parsed.content })); setAiKeywords(''); setAiLoading(false); return; }
        else throw new Error('JSON formatı hatalı.');
      } catch (err) { console.warn("Gemini fallback:", err); }
    }
    // LOCAL TEMPLATE FALLBACK
    setAiError('Gemini API anahtarı yok veya geçersiz. Çevrimdışı (Kısa) taslak kullanılıyor.');
    setTimeout(() => {
      let title = '', excerpt = '', content = '';
      if (kw.includes('seo') || kw.includes('arama') || kw.includes('optimizasyon')) {
        title = "Lokal SEO ile İzmir'de Google Aramalarında En Üste Çıkma Rehberi";
        excerpt = "İzmir'deki yerel işletmelerin Google Haritalar ve arama sonuçlarında görünürlüğünü artıracak 5 pratik lokal SEO taktiği.";
        content = `<h3>1. Google Haritalar Optimizasyonu</h3>\n<p>İzmir'deki müşterilerinize ulaşmanın en hızlı yolu yerel harita kaydınızı optimize etmektir.</p>\n<h3>2. Ege Bölgesi Odaklı Anahtar Kelimeler</h3>\n<p><strong>"İzmir dijital pazarlama ajansı"</strong> gibi lokasyon bazlı uzun kuyruklu anahtar kelimelere yer verin.</p>\n<h3>3. Mobil Uyumluluk ve Sayfa Hızı</h3>\n<p>Google mobil uyumlu ve 2 saniyenin altında açılan siteleri daha yukarılara taşır.</p>\n<h3>4. Yerel İçerik Üretimi</h3>\n<p>İzmir ve Ege bölgesindeki sektörel gelişmeleri konu alan blog yazıları yazarak otorite oluşturun.</p>`;
      } else if (kw.includes('google') || kw.includes('ads') || kw.includes('reklam') || kw.includes('roas')) {
        title = "Google Ads Reklam Bütçesini Doğru Yöneterek ROAS Artırma Yolları";
        excerpt = "Reklam bütçenizi en verimli şekilde kullanarak satışlarınızı katlamanın yolları.";
        content = `<h3>1. Negatif Anahtar Kelime Yönetimi</h3>\n<p>Gereksiz aramalarla bütçenizi boşa harcamamak için negatif anahtar kelimeleri haftalık güncelleyin.</p>\n<h3>2. Dönüşüm Kurulumlarının Doğruluğu</h3>\n<p>Gelişmiş Dönüşümler (Enhanced Conversions) kurulumunu mutlaka yapın.</p>\n<h3>3. Kalite Puanı Optimizasyonu</h3>\n<p>Reklam metniniz ve açılış sayfası arasındaki uyum kalite puanınızı artırır.</p>\n<h3>4. Akıllı Teklif Stratejileri</h3>\n<p>PMax ve Arama Ağı kampanyalarını doğru bütçe dağılımıyla besleyin.</p>`;
      } else if (kw.includes('meta') || kw.includes('facebook') || kw.includes('instagram')) {
        title = "Instagram ve Meta Reklamlarında Dönüşüm Hunisi Tasarımı";
        excerpt = "Meta reklamlarında potansiyel müşteriyi keşiften satın almaya götüren dönüşüm hunisi kurgusu.";
        content = `<h3>1. Kreatif Odaklı Reklamcılık</h3>\n<p>Farklı görsel, video ve UGC formatlarını sürekli test edin.</p>\n<h3>2. Özel ve Benzer Hedef Kitleler</h3>\n<p>Sitenizi ziyaret eden kişilerden özel kitleler kurun.</p>\n<h3>3. Retargeting</h3>\n<p>Dinamik ürün kataloğu reklamlarıyla yeniden hedeflemeye bütçe ayırın.</p>\n<h3>4. Advantage+ Kampanyaları</h3>\n<p>Meta'nın yapay zeka destekli kampanyalarını kullanın.</p>`;
      } else if (kw.includes('eticaret') || kw.includes('e-ticaret') || kw.includes('sepet')) {
        title = "E-Ticaret Sitelerinde Dönüşüm Oranını Artırmanın Yolları";
        excerpt = "Ziyaretçilerinizi müşteriye dönüştürmek için 4 UX adımı.";
        content = `<h3>1. Kolay Ödeme</h3>\n<p>Üyeliksiz alışveriş imkanı sunun ve ödeme adımlarını sadeleştirin.</p>\n<h3>2. Güven Unsurları</h3>\n<p>Müşteri yorumları ve SSL sertifikası gibi güven unsurlarını sergileyin.</p>\n<h3>3. Sepeti Terk Edenleri Geri Kazanma</h3>\n<p>Otomatik hatırlatmalar ve kuponlar gönderin.</p>\n<h3>4. Mobil Optimizasyon</h3>\n<p>Trafiğin %90'ı mobilden gelir, mobil hızı artırın.</p>`;
      } else {
        const firstKw = aiKeywords.split(',')[0].trim();
        const fmt = firstKw.toLocaleLowerCase('tr-TR').split(' ').map(w => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1)).join(' ');
        title = `${fmt} Odaklı Dijital Pazarlama Rehberi`;
        excerpt = `${aiKeywords} odaklı veriye dayalı reklam, SEO ve sosyal medya stratejileriyle dijitalde öne çıkma rehberi.`;
        content = `<h3>1. Hedef Kitle Analizi</h3>\n<p>İdeal müşteri profilinizi belirleyin ve doğru mecra tercihi yapın.</p>\n<h3>2. Çok Kanallı Pazarlama</h3>\n<p>Hem Google aramalarında hem sosyal medyada varlık gösterin.</p>\n<h3>3. Veri Odaklı Ölçüm</h3>\n<p>Tüm yatırımların ROI/ROAS'ını takip edin.</p>\n<h3>4. Sürekli A/B Testleri</h3>\n<p>Kreatiflerinizde ve açılış sayfalarında sürekli test yapın.</p>`;
      }
      setModalFormData(prev => ({ ...prev, title, excerpt, content }));
      setAiKeywords(''); setAiLoading(false);
    }, 1500);
  };

  if (!editingItem) return null;

  const inputCls = "w-full py-2.5 px-3 rounded-md border border-glass-border bg-white outline-none focus:border-primary transition-colors text-sm";
  const selectCls = "w-full py-2.5 px-3 rounded-md border border-glass-border bg-white outline-none focus:border-primary transition-colors text-sm";
  const textareaCls = "w-full py-2.5 px-3 rounded-md border border-glass-border font-sans outline-none focus:border-primary transition-colors text-sm leading-relaxed";

  return (
    <div className="lead-modal-overlay" onClick={() => { setEditingItem(null); setEditingType(''); }}>
      <div className="lead-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: editingType === 'blog' ? '800px' : '550px' }}>
        <div className="lead-modal-header">
          <h3>{editingItem === 'new' ? 'Yeni Ekle' : 'Düzenle'} - {editingType === 'testimonial' ? 'Yorum' : editingType === 'team' ? 'Ekip Üyesi' : 'Blog'}</h3>
          <button className="btn-icon" onClick={() => { setEditingItem(null); setEditingType(''); }}><i className="fa-solid fa-xmark"></i></button>
        </div>
        <form onSubmit={handleModalSave}>
          <div className="lead-modal-body">
            {/* TESTIMONIAL */}
            {editingType === 'testimonial' && <>
              <div className="admin-form-group"><label>Ad Soyad</label><input type="text" required value={modalFormData.name || ''} onChange={e => upd('name', e.target.value)} className={inputCls} /></div>
              <div className="admin-form-row">
                <div className="admin-form-group"><label>Şirket</label><input type="text" required value={modalFormData.company || ''} onChange={e => upd('company', e.target.value)} className={inputCls} /></div>
                <div className="admin-form-group"><label>Unvan / Rol</label><input type="text" required value={modalFormData.role || ''} onChange={e => upd('role', e.target.value)} className={inputCls} /></div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group"><label>Kategori</label><select value={modalFormData.category || 'google-ads'} onChange={e => upd('category', e.target.value)} className={selectCls}><option value="google-ads">Google Ads</option><option value="meta-ads">Meta Ads</option><option value="seo">SEO & İçerik</option><option value="social-media">Sosyal Medya</option><option value="ecommerce">E-Ticaret</option><option value="web-design">Web Tasarım</option></select></div>
                <div className="admin-form-group"><label>Puan (1-5)</label><select value={modalFormData.rating || 5} onChange={e => upd('rating', parseInt(e.target.value))} className={selectCls}><option value="5">5 Yıldız</option><option value="4">4 Yıldız</option><option value="3">3 Yıldız</option></select></div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group"><label>Metrik Başarısı</label><input type="text" value={modalFormData.metric || ''} onChange={e => upd('metric', e.target.value)} className={inputCls} /></div>
                <div className="admin-form-group"><label>İsim Kısaltması</label><input type="text" value={modalFormData.initials || ''} onChange={e => upd('initials', e.target.value)} className={inputCls} placeholder="Örn: MÇ" /></div>
              </div>
              <div className="admin-form-group"><label>Yorum Metni</label><textarea required rows="4" value={modalFormData.quote || ''} onChange={e => upd('quote', e.target.value)} className={textareaCls}></textarea></div>
            </>}

            {/* TEAM */}
            {editingType === 'team' && <>
              <div className="admin-form-group"><label>Ad Soyad</label><input type="text" required value={modalFormData.name || ''} onChange={e => upd('name', e.target.value)} className={inputCls} /></div>
              <div className="admin-form-row">
                <div className="admin-form-group"><label>Görev / Unvan</label><input type="text" required value={modalFormData.role || ''} onChange={e => upd('role', e.target.value)} className={inputCls} /></div>
                <div className="admin-form-group"><label>Deneyim Süresi</label><input type="text" required value={modalFormData.exp || ''} onChange={e => upd('exp', e.target.value)} className={inputCls} /></div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group"><label>Departman</label><select value={modalFormData.dept || 'performance'} onChange={e => upd('dept', e.target.value)} className={selectCls}><option value="management">Yönetim</option><option value="performance">Performans Pazarlama</option><option value="creative">Kreatif / Tasarım</option></select></div>
                <div className="admin-form-group"><label>Derece (Yıldız)</label><select value={modalFormData.stars || 5} onChange={e => upd('stars', parseInt(e.target.value))} className={selectCls}><option value="5">5 Yıldız</option><option value="4">4 Yıldız</option><option value="3">3 Yıldız</option></select></div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group"><label>Kısaltma (Baş harfler)</label><input type="text" value={modalFormData.init || ''} onChange={e => upd('init', e.target.value)} className={inputCls} /></div>
                <div className="admin-form-group">
                  <label>Renk Gradyanı (CSS)</label>
                  <input type="text" value={modalFormData.gradient || ''} onChange={e => upd('gradient', e.target.value)} className={`${inputCls} mb-2`} placeholder="linear-gradient(135deg, #00ebd6, #00b4d8)" />
                  <div className="flex gap-2 flex-wrap items-center">
                    <span className="text-xs text-text-muted">Hazır:</span>
                    {[{ n: 'Turkuaz', v: 'linear-gradient(135deg, #00ebd6, #00b4d8)' }, { n: 'Gün Batımı', v: 'linear-gradient(135deg, #ff2a85, #ff758c)' }, { n: 'Kozmik Mor', v: 'linear-gradient(135deg, #7b2cbf, #ff2a85)' }, { n: 'Sörf Mavisi', v: 'linear-gradient(135deg, #7b2cbf, #00ebd6)' }, { n: 'Mavi & Mor', v: 'linear-gradient(135deg, #00b4d8, #7b2cbf)' }, { n: 'Pembe & Mavi', v: 'linear-gradient(135deg, #ff758c, #00b4d8)' }].map((p, i) => <button key={i} type="button" onClick={() => upd('gradient', p.v)} className="w-5 h-5 rounded-full border cursor-pointer p-0 transition-all" style={{ background: p.v, border: modalFormData.gradient === p.v ? '2px solid var(--primary)' : '1px solid var(--glass-border)', transform: modalFormData.gradient === p.v ? 'scale(1.15)' : 'none', boxShadow: modalFormData.gradient === p.v ? '0 0 6px rgba(0,235,214,0.4)' : 'none' }} title={p.n} />)}
                  </div>
                </div>
              </div>
              <div className="admin-form-group"><label>Kısa Biyografi</label><textarea required rows="4" value={modalFormData.desc || ''} onChange={e => upd('desc', e.target.value)} className={textareaCls}></textarea></div>
            </>}

            {/* BLOG */}
            {editingType === 'blog' && <>
              <div className="flex border-b border-glass-border mb-5 gap-1">
                {[{ id: 'edit', icon: 'fa-pen', label: 'Düzenle' }, { id: 'preview', icon: 'fa-eye', label: 'Önizleme' }].map(t => <button key={t.id} type="button" onClick={() => setBlogEditTab(t.id)} className={`py-2 px-4 border-none bg-transparent font-semibold text-sm cursor-pointer ${blogEditTab === t.id ? 'text-primary border-b-2 border-primary' : 'text-text-muted border-b-2 border-transparent'}`}><i className={`fa-solid ${t.icon} mr-1.5`}></i> {t.label}</button>)}
              </div>

              {blogEditTab === 'edit' ? <>
                {/* AI Writer */}
                <div className="bg-primary/[0.03] border border-dashed border-glass-border-hover rounded-lg p-4 mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-primary flex items-center gap-1.5 text-sm"><i className="fa-solid fa-robot"></i> Yapay Zeka Blog Yazarı</span>
                    {settingsData.gemini_api_key
                      ? <span className="text-[0.7rem] text-green-600 bg-green-600/[0.08] py-0.5 px-1.5 rounded border border-green-600/15">Gemini API Aktif</span>
                      : <span className="text-[0.7rem] text-text-muted bg-slate-900/[0.03] py-0.5 px-1.5 rounded border border-glass-border">Yerel Motor Aktif</span>}
                  </div>
                  <div className="flex gap-2 flex-wrap mb-2">
                    <input type="text" placeholder="Anahtar kelimeler (örn: seo, google ads)..." value={aiKeywords} onChange={e => setAiKeywords(e.target.value)} disabled={aiLoading} className="flex-1 min-w-[200px] py-2 px-3 rounded-md border border-glass-border text-xs bg-white text-text-light outline-none" />
                    <button type="button" onClick={handleSuggestKeywords} disabled={aiLoading} className="btn py-2 px-4 text-xs rounded-md bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5 cursor-pointer"><i className="fa-solid fa-lightbulb"></i> Öneri Al</button>
                    <button type="button" onClick={handleGenerateAIBlog} disabled={aiLoading} className="btn btn-primary py-2 px-4 text-xs rounded-md">{aiLoading ? 'İşlem Sürüyor...' : 'Yazı Üret'}</button>
                  </div>
                  {aiError && <div className="text-xs text-red-500 mt-1">{aiError}</div>}
                  {aiLoading && <div className="flex items-center gap-2 mt-2 text-xs text-text-muted"><div className="seo-spinner w-4 h-4" style={{ borderWidth: '2px' }}></div><span>AI makale hazırlıyor...</span></div>}
                </div>
                <div className="admin-form-group"><label>Blog Başlığı</label><input type="text" required value={modalFormData.title || ''} onChange={e => upd('title', e.target.value)} className={inputCls} /></div>
                <div className="admin-form-row">
                  <div className="admin-form-group"><label>Kategori</label><select value={modalFormData.category || 'google'} onChange={e => upd('category', e.target.value)} className={selectCls}><option value="google">Google Ads</option><option value="meta">Meta Ads</option><option value="seo">SEO & İçerik</option><option value="social">Sosyal Medya</option><option value="ecommerce">E-Ticaret</option><option value="design">Web Tasarım</option></select></div>
                  <div className="admin-form-group"><label>Yazar</label><select required value={modalFormData.author || ''} onChange={e => upd('author', e.target.value)} className={selectCls}>
                    <option value="">Yazar Seçin</option>
                    {teamMembersData.filter(m => m.dept !== 'management').map(m => <option key={m.name} value={m.name}>{m.name} - {m.role}</option>)}
                    {modalFormData.author && !teamMembersData.filter(m => m.dept !== 'management').some(m => m.name === modalFormData.author) && <option value={modalFormData.author}>{modalFormData.author} (Mevcut)</option>}
                  </select></div>
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group"><label>Tarih</label><input type="text" required value={modalFormData.date || ''} onChange={e => upd('date', e.target.value)} className={inputCls} /></div>
                  <div className="admin-form-group"><label>Okuma Süresi</label><input type="text" required value={modalFormData.readTime || ''} onChange={e => upd('readTime', e.target.value)} className={inputCls} /></div>
                </div>
                <div className="admin-form-group"><label>Kısa Özet (Excerpt)</label><input type="text" required value={modalFormData.excerpt || ''} onChange={e => upd('excerpt', e.target.value)} className={inputCls} /></div>
                <div className="admin-form-group">
                  <label className="flex justify-between items-center"><span>Yazı İçeriği</span><span className="text-xs text-text-muted font-normal">HTML etiketleri desteklenir</span></label>
                  <div className="flex gap-1 py-2 px-2 bg-slate-900/[0.03] border border-glass-border border-b-0 rounded-t-md flex-wrap">
                    {['H2','H3','P'].map(t => <button key={t} type="button" onClick={() => insertHTMLTag(t.toLowerCase())} className="btn-icon py-1 px-2 text-xs font-bold">{t}</button>)}
                    {[{ icon: 'fa-bold', tag: 'bold' }, { icon: 'fa-italic', tag: 'italic' }, { icon: 'fa-list-ul', tag: 'ul' }, { icon: 'fa-link', tag: 'link' }, { icon: 'fa-regular fa-image', tag: 'img' }, { icon: 'fa-quote-right', tag: 'quote' }, { icon: 'fa-table', tag: 'table' }].map((b, i) => <button key={i} type="button" onClick={() => insertHTMLTag(b.tag)} className="btn-icon py-1 px-2" title={b.tag}><i className={`fa-solid ${b.icon}`}></i></button>)}
                    <button type="button" onClick={() => insertHTMLTag('li')} className="btn-icon py-1 px-2 text-xs font-bold">LI</button>
                  </div>
                  <textarea id="blog-content-textarea" required rows="14" value={modalFormData.content || ''} onChange={e => upd('content', e.target.value)} className="w-full py-2.5 px-3 rounded-b-md rounded-t-none border border-glass-border font-mono text-sm leading-relaxed resize-y outline-none" />
                </div>
              </> : (
                <div className="p-5 border border-glass-border rounded-lg bg-white max-h-[480px] overflow-y-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                  <h1 className="text-2xl font-extrabold mb-2 text-text-light">{modalFormData.title || 'Başlıksız Yazı'}</h1>
                  <div className="flex gap-3 flex-wrap text-xs text-text-muted mb-4 border-b border-glass-border pb-2">
                    <span><i className="fa-regular fa-user mr-1"></i> {modalFormData.author || 'Ajans Rota'}</span>
                    <span><i className="fa-regular fa-calendar mr-1"></i> {modalFormData.date || new Date().toLocaleDateString('tr-TR')}</span>
                    <span><i className="fa-regular fa-clock mr-1"></i> {modalFormData.readTime || '5 dk'}</span>
                    <span className="uppercase font-bold text-primary">Kategori: {modalFormData.category || 'Genel'}</span>
                  </div>
                  {modalFormData.excerpt && <p className="italic text-text-muted text-sm border-l-[3px] border-primary pl-3 mb-5 leading-relaxed">{modalFormData.excerpt}</p>}
                  <div className="blog-content-preview text-sm leading-relaxed text-text-light" dangerouslySetInnerHTML={{ __html: modalFormData.content || '<p style="color:var(--text-muted);font-style:italic;">Yazı içeriği boş...</p>' }} />
                </div>
              )}
            </>}
          </div>
          <div className="lead-modal-footer">
            <button type="button" className="btn btn-secondary mr-2" onClick={() => { setEditingItem(null); setEditingType(''); }}>İptal</button>
            <button type="submit" className="btn btn-primary">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
}
