import React from 'react';
import toast from 'react-hot-toast';
import { upload } from '@vercel/blob/client';

export default function ClientReportsTab({
  clientReports, setClientReports,
  editingReportBrand, setEditingReportBrand,
  setIsAddClientModalOpen, handleSaveAll, isSaving,
  activeTab, setNewClientFormData, authToken, teamMembersData
}) {
  const [isGeneratingAi, setIsGeneratingAi] = React.useState(false);
  const [activeInnerTab, setActiveInnerTab] = React.useState('genel');

  const handleGenerateAiSummary = async () => {
    if (!editingReportBrand) return;
    const currentData = clientReports[editingReportBrand];
    if (!currentData || !currentData.kpis) { toast.error('KPI verisi bulunamadı.'); return; }
    setIsGeneratingAi(true);
    const toastId = toast.loading('Yapay zeka verileri analiz ediyor...');
    try {
      const kpiString = currentData.kpis.map(k => `${k.label}: ${k.value} (${k.change})`).join(', ');
      const topic = `Müşteri Adı/Unvanı: ${currentData.name || currentData.brandName || editingReportBrand}. Güncel Performans Verileri: ${kpiString}. Lütfen Rota AI olarak direkt olarak gidişatı yorumlayan, sayısal ve profesyonel (en fazla 2-3 cümlelik) bir yönetici özeti ve stratejik tavsiye yaz. Başlangıçta müşteriye 'Sayın [Müşteri Adı] Yönetimi' veya 'Sayın Yetkili' şeklinde profesyonel kurumsal bir hitap kullan.`;
      const response = await fetch('/api/ai-strategy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic }) });
      const data = await response.json();
      if (data.success) { const updated = { ...clientReports }; updated[editingReportBrand].aiSummary = data.content; setClientReports(updated); toast.success('Yapay zeka özeti başarıyla oluşturuldu!', { id: toastId }); }
      else { toast.error('Hata: ' + data.message, { id: toastId }); }
    } catch (err) { toast.error('API Bağlantı Hatası.', { id: toastId }); }
    finally { setIsGeneratingAi(false); }
  };

  // Helpers
  const inputCls = "w-full py-2.5 px-3 rounded-lg border border-glass bg-white/5 text-textLight focus:border-primary outline-none transition-colors text-sm font-body";
  const inputSmCls = "w-full py-1.5 px-2.5 rounded-md border border-glass bg-white/5 text-textLight text-xs focus:border-primary outline-none transition-colors font-body";
  const cardCls = "border border-glass p-5 rounded-xl bg-white/2";
  const sectionHeaderCls = "flex justify-between items-center mb-5";
  const sectionTitleCls = "font-bold text-[15px] text-textLight flex items-center gap-2";
  const addBtnCls = "flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors py-1.5 px-3 text-xs font-semibold rounded-md cursor-pointer";
  const microLabel = "text-[11px] text-textMuted block mb-1 font-semibold";
  const deleteBtnCls = "border-none bg-red-500/10 hover:bg-red-500/20 rounded-md w-7 h-7 flex items-center justify-center cursor-pointer text-red-500 text-xs transition-colors";
  const labelCls = "block text-[13px] font-semibold text-textMuted mb-1.5";

  const updBrand = (field, val) => { const u = { ...clientReports }; if (!u[editingReportBrand]) u[editingReportBrand] = {}; u[editingReportBrand][field] = val; setClientReports(u); };

  const updTimelineField = (idx, field, val) => {
    setClientReports(prev => { const u = { ...prev }; const b = { ...u[editingReportBrand] }; const t = [...(b.timeline || [])]; t[idx] = { ...t[idx], [field]: val }; b.timeline = t; u[editingReportBrand] = b; return u; });
  };

  const updPlanField = (idx, field, val) => {
    setClientReports(prev => { const u = { ...prev }; const b = { ...u[editingReportBrand] }; const p = [...(b.nextMonthPlan || [])]; p[idx] = { ...p[idx], [field]: val }; b.nextMonthPlan = p; u[editingReportBrand] = b; return u; });
  };

  // Campaign field updater
  const updCampField = (platform, idx, field, val) => { const u = { ...clientReports }; u[editingReportBrand][platform][idx][field] = val; setClientReports(u); };

  // Campaign card component (shared for Google & Meta)
  const CampaignCard = ({ platform, camp, idx }) => {
    const fields = [
      { key: 'spend', label: 'Harcama' },
      { key: 'clicks', label: 'Tıklama' },
      { key: 'ctr', label: 'CTR' },
      { key: 'conversions', label: 'Dönüşüm' },
      { key: 'roas', label: editingReportBrand === 'ecommerce' ? 'ROAS' : 'CPL' }
    ];
    return (
      <div className="bg-white/2 border border-glass rounded-xl p-4 flex flex-col gap-3 relative hover:border-glass-border transition-colors">
        <button type="button" onClick={() => { const u = { ...clientReports }; u[editingReportBrand][platform].splice(idx, 1); setClientReports(u); }} className="absolute top-3 right-3 border-none bg-transparent hover:bg-red-500/10 p-1.5 rounded-md cursor-pointer text-red-500 text-xs transition-colors"><i className="fa-solid fa-trash"></i></button>
        <div className="flex gap-3 w-[90%] items-center">
          <input type="text" value={camp.name} onChange={e => updCampField(platform, idx, 'name', e.target.value)} placeholder="Kampanya Adı" className="flex-[2] py-2 px-3 rounded-lg border border-glass text-xs font-semibold bg-white/5 text-textLight outline-none focus:border-primary transition-colors" />
          {platform === 'metaAds' && <select value={camp.status || 'Aktif'} onChange={e => updCampField(platform, idx, 'status', e.target.value)} className="flex-1 py-2 px-3 rounded-lg border border-glass text-xs bg-white/5 text-textLight outline-none focus:border-primary transition-colors">
            <option value="Aktif">Aktif</option><option value="Duraklatıldı">Duraklatıldı</option>
          </select>}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {fields.map(f => <div key={f.key}>
            <span className={microLabel}>{f.label}</span>
            <input type="text" value={camp[f.key]} onChange={e => updCampField(platform, idx, f.key, e.target.value)} className="w-full py-1.5 px-2 rounded-md border border-glass text-xs bg-white/5 text-textLight outline-none focus:border-primary transition-colors" />
          </div>)}
        </div>
      </div>
    );
  };

  // Date helpers for timeline
  const parseDateToISO = (dateStr) => {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const ddmm = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (ddmm) return `${ddmm[3]}-${ddmm[2].padStart(2,'0')}-${ddmm[1].padStart(2,'0')}`;
    const trMonths = { ocak:'01',subat:'02',şubat:'02',mart:'03',nisan:'04',mayis:'05',mayıs:'05',haziran:'06',temmuz:'07',agustos:'08',ağustos:'08',eylul:'09',eylül:'09',ekim:'10',kasim:'11',kasım:'11',aralik:'12',aralık:'12' };
    const parts = dateStr.toLowerCase().split(/\s+/);
    if (parts.length >= 3) { const d = parts[0].replace(/\D/g,'').padStart(2,'0'); const y = parts[2].replace(/\D/g,''); const m = trMonths[parts[1]] || '01'; if (d && y?.length === 4) return `${y}-${m}-${d}`; }
    return new Date().toISOString().split('T')[0];
  };
  const formatToTurkishDate = val => { if (!val) return ''; const [y,m,d] = val.split('-'); const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']; return `${parseInt(d)} ${months[parseInt(m)-1]} ${y}`; };

  const brand = clientReports[editingReportBrand];

  return (
    <div>
      <div className="text-xl font-bold text-textLight mb-2">Müşteri Raporlama Paneli Yönetimi</div>
      <p className="text-sm text-textMuted mb-6">Müşteri Raporlama & Şeffaflık sayfasındaki marka simülasyonlarının canlı verilerini, KPI kartlarını ve çalışma geçmişi zaman çizelgesini buradan güncelleyebilirsiniz.</p>

      {/* Brand Selector */}
      <div className="flex items-center gap-3 mb-10 flex-wrap bg-white/2 border border-glass p-3 rounded-xl">
        <div className="flex gap-2 flex-wrap">
          {Object.keys(clientReports || {}).map(brandKey => {
            const isSelected = editingReportBrand === brandKey;
            const b = clientReports[brandKey];
            const isEcom = brandKey === 'ecommerce' || brandKey.toLowerCase().includes('ecom');
            return <button key={brandKey} type="button" onClick={() => setEditingReportBrand(brandKey)} className={`py-2 px-4 rounded-lg border-none text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${isSelected ? 'bg-primary text-white shadow-[0_0_15px_rgba(14,165,233,0.2)]' : 'bg-white/5 text-textMuted hover:bg-white/10 hover:text-textLight'}`}>
              <i className={`${isEcom ? 'fa-solid fa-cart-shopping' : 'fa-solid fa-briefcase'}`}></i>
              {b?.brandName || brandKey}
            </button>;
          })}
        </div>

        <button type="button" onClick={() => { setNewClientFormData({ code: '', name: '', username: '', password: '' }); setIsAddClientModalOpen(true); }} className="py-2 px-4 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all ml-4">
          <i className="fa-solid fa-plus"></i> Yeni Müşteri Ekle
        </button>

        {editingReportBrand !== 'ecommerce' && editingReportBrand !== 'b2b' && <button type="button" onClick={async () => {
          if (!confirm(`${clientReports[editingReportBrand]?.brandName || editingReportBrand} müşterisini silmek istediğinize emin misiniz?`)) return;
          const clientId = clientReports[editingReportBrand]?.client_id;
          if (clientId) { const tId = toast.loading("Siliniyor..."); try { const res = await fetch('/api/admin/clients/' + clientId, { method: 'DELETE' }); if (res.ok) toast.success("Silindi!", { id: tId }); else { toast.error("Başarısız.", { id: tId }); return; } } catch { toast.error("Bağlantı hatası.", { id: tId }); return; } }
          const u = { ...clientReports }; delete u[editingReportBrand]; setClientReports(u); setEditingReportBrand('ecommerce');
        }} className="py-2 px-4 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 text-xs font-bold cursor-pointer flex items-center gap-1.5 ml-auto transition-all">
          <i className="fa-solid fa-trash"></i> Müşteriyi Sil
        </button>}
      </div>

      {/* Inner Tabs */}
      <div className="flex gap-2 mb-6 p-1.5 bg-white/2 rounded-xl border border-glass w-full overflow-x-auto">
        {[{ id: 'genel', label: '⚙️ Genel Ayarlar' }, { id: 'kpi', label: '📈 Performans & SEO' }, { id: 'timeline', label: '🗓️ Zaman Çizelgesi' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveInnerTab(tab.id)} type="button" className={`flex-1 py-3 px-4 rounded-lg border-none text-sm font-semibold cursor-pointer transition-all whitespace-nowrap ${activeInnerTab === tab.id ? 'bg-primary text-white shadow-[0_4px_12px_rgba(14,165,233,0.2)]' : 'bg-transparent text-textMuted hover:bg-white/5 hover:text-textLight'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-8 mb-8">

        {/* Genel */}
        {activeInnerTab === 'genel' && <div className="flex flex-col gap-5">
          <div><label className={labelCls}>Marka / Müşteri Adı</label><input type="text" value={brand?.brandName || ''} onChange={e => updBrand('brandName', e.target.value)} className={inputCls} /></div>
          <div><label className={labelCls}>Sektör / Kategori Açıklaması</label><input type="text" value={brand?.industry || ''} onChange={e => updBrand('industry', e.target.value)} className={inputCls} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Giriş Kullanıcı Adı</label><input type="text" value={brand?.username || ''} onChange={e => updBrand('username', e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Giriş Şifresi</label><input type="text" value={brand?.password || ''} onChange={e => updBrand('password', e.target.value)} className={inputCls} /></div>
          </div>

          {/* API Integration Box */}
          <div className="border border-indigo-500/20 p-5 rounded-xl bg-indigo-500/5 mb-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full pointer-events-none"></div>
            <span className="font-bold text-[15px] text-indigo-400 flex items-center gap-2 mb-4"><i className="fa-solid fa-cloud-bolt"></i> Make.com / API Entegrasyon Ayarları</span>
            <div className="flex flex-col gap-4">
              <div>
                <span className={microLabel}>Webhook Hedef URL</span>
                <div className="flex gap-2">
                  <input type="text" readOnly value={`${window.location.origin}/api.php?action=update_live_metrics`} className="flex-1 py-2 px-3 rounded-lg border border-glass bg-white/5 text-textMuted text-[13px] font-mono outline-none" />
                  <button type="button" onClick={e => { navigator.clipboard.writeText(`${window.location.origin}/api.php?action=update_live_metrics`); e.currentTarget.innerText = "Kopyalandı!"; setTimeout(() => e.currentTarget.innerText = "Kopyala", 1500); }} className="py-2 px-4 rounded-lg border-none bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-xs font-bold cursor-pointer transition-colors">Kopyala</button>
                </div>
              </div>
              <div>
                <span className={microLabel}>Authorization Bearer Token</span>
                <div className="flex gap-2">
                  <input type="text" readOnly value={authToken} className="flex-1 py-2 px-3 rounded-lg border border-glass bg-white/5 text-textMuted text-[13px] font-mono outline-none" />
                  <button type="button" onClick={e => { navigator.clipboard.writeText(authToken); e.currentTarget.innerText = "Kopyalandı!"; setTimeout(() => e.currentTarget.innerText = "Kopyala", 1500); }} className="py-2 px-4 rounded-lg border-none bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-xs font-bold cursor-pointer transition-colors">Kopyala</button>
                </div>
              </div>
              <div className="flex justify-between items-center text-[13px] bg-white/5 border border-glass py-2.5 px-4 rounded-lg mt-2">
                <span className="text-textMuted font-medium">Firma Kodu: <strong className="text-indigo-400 ml-1">{editingReportBrand}</strong></span>
                <span className="text-textMuted font-medium text-right">
                  {brand?.api_last_sync ? <>Senk: <strong className="text-green-500 ml-1">{brand.api_last_sync}</strong></> : <span className="text-textMuted italic opacity-70">Henüz Senkronize Edilmedi</span>}
                </span>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="border border-glass p-5 rounded-xl bg-violet-500/5 mb-4 border-l-4 border-l-violet-500">
            <div className="flex justify-between items-center mb-4">
              <span className="font-extrabold text-[15px] text-textLight flex items-center gap-2"><i className="fa-solid fa-robot text-violet-500"></i> Yapay Zeka Yönetici Özeti</span>
              <button className="flex items-center gap-1.5 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors py-1.5 px-3 text-xs font-bold rounded-lg cursor-pointer border border-violet-500/20" style={{ opacity: isGeneratingAi ? 0.7 : 1 }} onClick={handleGenerateAiSummary} disabled={isGeneratingAi}>
                {isGeneratingAi ? <><i className="fa-solid fa-spinner fa-spin"></i> Analiz Ediliyor...</> : <><i className="fa-solid fa-wand-magic-sparkles"></i> Otomatik Yazdır</>}
              </button>
            </div>
            <textarea rows="3" placeholder="Müşteriye gösterilecek haftalık stratejik AI yorumu..." value={brand?.aiSummary || ''} onChange={e => updBrand('aiSummary', e.target.value)} className={`${inputCls} resize-y`}></textarea>
          </div>

          {/* AI Insight */}
          <div className="border border-glass p-5 rounded-xl bg-emerald-500/5 mb-4 border-l-4 border-l-emerald-500">
            <div className="mb-5">
              <span className="font-extrabold text-[15px] text-textLight flex items-center gap-2"><i className="fa-solid fa-lightbulb text-emerald-500"></i> Yapay Zeka Aksiyon Önerisi</span>
              <p className="text-xs text-textMuted mt-1">Müşterinin "Talep Et" diyerek onaylayabileceği bir yapay zeka önerisi.</p>
            </div>
            <div className="grid gap-4">
              <div><label className={labelCls}>Öneri Metni</label><input type="text" placeholder="Örn: CPL maliyetiniz düştü, yeni bir Reels kreatifi çekmenizi öneriyoruz." value={brand?.aiInsight || ''} onChange={e => updBrand('aiInsight', e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Buton / Aksiyon Başlığı</label><input type="text" placeholder="Örn: Yeni Reels Kreatif Çekimi" value={brand?.aiInsightAction || ''} onChange={e => updBrand('aiInsightAction', e.target.value)} className={inputCls} /></div>
            </div>
          </div>
        </div>}

        {/* KPI & SEO */}
        {activeInnerTab === 'kpi' && <div className="flex flex-col gap-6">
          <div className={cardCls}>
            <div className={sectionHeaderCls}><span className={sectionTitleCls}><i className="fa-solid fa-chart-pie text-primary"></i>KPI Kart Değerleri</span></div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              {brand?.kpis?.map((kpi, idx) => (
                <div key={idx} className="bg-white/2 border border-glass rounded-xl p-4 flex flex-col gap-3 transition-colors hover:border-glass-border">
                  <span className="text-[11px] text-textMuted font-bold uppercase tracking-wider">{kpi.label}</span>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-hashtag text-primary opacity-50 w-4 text-center"></i>
                    <input type="text" placeholder="Değer" value={kpi.value} onChange={e => { const u = { ...clientReports }; u[editingReportBrand].kpis[idx].value = e.target.value; setClientReports(u); }} className="flex-1 py-2 px-3 rounded-lg border border-glass bg-white/5 text-textLight text-sm font-semibold outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-arrow-trend-up text-emerald-500 opacity-70 w-4 text-center"></i>
                    <input type="text" placeholder="Değişim" value={kpi.change} onChange={e => { const u = { ...clientReports }; u[editingReportBrand].kpis[idx].change = e.target.value; setClientReports(u); }} className="flex-1 py-1.5 px-3 rounded-lg border border-glass bg-emerald-500/5 text-emerald-400 text-xs font-semibold outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Keywords */}
          <div className={cardCls}>
            <div className={sectionHeaderCls}><span className={sectionTitleCls}><i className="fa-brands fa-google text-rose-500"></i>SEO Kelime Yönetimi</span><button type="button" onClick={() => { setClientReports(prev => { const u = { ...prev }; const b = { ...u[editingReportBrand] }; b.seo = [...(b.seo || []), { keyword: "Yeni Anahtar Kelime", rank: "0", volume: "0", trend: "right", trendText: "" }]; u[editingReportBrand] = b; return u; }); }} className={addBtnCls}><i className="fa-solid fa-plus"></i> Kelime Ekle</button></div>
            <div className="flex flex-col gap-4">
              {brand?.seo?.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-3 bg-white/2 border border-glass p-4 rounded-xl">
                  <div className="flex justify-between items-center gap-3">
                    <input type="text" placeholder="Kelime" value={item.keyword} onChange={e => { const u = { ...clientReports }; u[editingReportBrand].seo[idx].keyword = e.target.value; setClientReports(u); }} className="flex-1 py-2 px-3 rounded-lg border border-glass text-sm font-semibold bg-white/5 text-textLight outline-none focus:border-primary transition-colors" />
                    <button type="button" onClick={() => { if (window.confirm('Silmek istiyor musunuz?')) setClientReports(prev => { const u = { ...prev }; u[editingReportBrand].seo.splice(idx, 1); return u; }); }} className="border-none bg-transparent text-red-500/70 hover:text-red-500 cursor-pointer p-2 rounded-md hover:bg-red-500/10 transition-colors"><i className="fa-solid fa-trash"></i></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div><span className={microLabel}>Hacim</span><input type="text" value={item.volume} onChange={e => { const u = { ...clientReports }; u[editingReportBrand].seo[idx].volume = e.target.value; setClientReports(u); }} className={inputSmCls} /></div>
                    <div><span className={microLabel}>Sıra</span><input type="text" value={item.rank} onChange={e => {
                      const newRankStr = e.target.value; const newRank = parseInt(newRankStr) || 0; const oldRank = parseInt(item.rank) || 0;
                      const u = { ...clientReports }; u[editingReportBrand].seo[idx].rank = newRankStr;
                      if (oldRank > 0 && newRank > 0 && newRank !== oldRank) { if (newRank < oldRank) { u[editingReportBrand].seo[idx].trend = 'up'; u[editingReportBrand].seo[idx].trendText = (oldRank - newRank) + ' Sıra Yükseldi'; } else { u[editingReportBrand].seo[idx].trend = 'down'; u[editingReportBrand].seo[idx].trendText = (newRank - oldRank) + ' Sıra Düştü'; } }
                      setClientReports(u);
                    }} className={inputSmCls} /></div>
                    <div><span className={microLabel}>Trend (Oto)</span><div className={`text-xs py-1.5 px-3 rounded-md font-semibold flex items-center gap-1.5 ${item.trend === 'up' ? 'bg-green-500/10 text-green-500' : item.trend === 'down' ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-textMuted'}`}><i className={`fa-solid fa-arrow-${item.trend === 'up' ? 'trend-up' : item.trend === 'down' ? 'trend-down' : 'right'}`}></i>{item.trendText || 'Belirtilmedi'}</div></div>
                  </div>
                </div>
              ))}
              {(!brand?.seo || brand.seo.length === 0) && <p className="text-xs text-textMuted text-center my-4 italic">Henüz kelime eklenmemiş.</p>}
            </div>
          </div>
        </div>}

        {/* Timeline */}
        {activeInnerTab === 'timeline' && <div className="flex flex-col gap-6">
          <div className={cardCls}>
            <div className={sectionHeaderCls}><span className={sectionTitleCls}><i className="fa-solid fa-clock-rotate-left text-primary"></i>Zaman Çizelgesi (Yapılan Çalışmalar)</span><button type="button" onClick={() => { setClientReports(prev => { const u = { ...prev }; const b = { ...u[editingReportBrand] }; b.timeline = [{ date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }), title: "Yeni Çalışma Maddesi", desc: "Yapılan çalışmanın detaylı açıklaması.", author: "Yiğit K. (SEO & Google Ads)" }, ...(b.timeline || [])]; u[editingReportBrand] = b; return u; }); }} className={addBtnCls}><i className="fa-solid fa-plus"></i> Ekle</button></div>
            <div className="overflow-y-auto max-h-[800px] flex flex-col gap-5 pr-2 relative mt-4">
              <div className="absolute left-[19px] top-2 bottom-2 w-0.5 z-[1]" style={{ background: 'linear-gradient(180deg, var(--primary) 0%, rgba(14,165,233,0.1) 100%)' }}></div>
              {brand?.timeline?.map((event, idx) => {
                const isBot = event.author?.toLowerCase().includes('bot') || event.author?.toLowerCase().includes('make.com');
                const isSEO = event.title?.toLowerCase().includes('seo') || event.desc?.toLowerCase().includes('seo');
                const isAds = event.title?.toLowerCase().includes('ads') || event.title?.toLowerCase().includes('reklam');
                let accentColor = '#94a3b8', iconClass = 'fa-solid fa-pen-to-square';
                if (isBot) { accentColor = '#8b5cf6'; iconClass = 'fa-solid fa-robot'; }
                else if (isSEO) { accentColor = '#ec4899'; iconClass = 'fa-solid fa-magnifying-glass-chart'; }
                else if (isAds) { accentColor = '#0ea5e9'; iconClass = 'fa-solid fa-bullhorn'; }
                return <div key={idx} className="bg-white/5 border border-glass rounded-xl p-5 flex flex-col gap-3 relative ml-11 z-[2] transition-colors hover:bg-white/10">
                  <div className="absolute -left-11 top-4 w-[28px] h-[28px] rounded-full bg-slate-900 flex items-center justify-center text-xs shadow-[0_0_10px_rgba(0,0,0,0.5)] z-[3]" style={{ border: `2px solid ${accentColor}`, color: accentColor }}><i className={iconClass}></i></div>
                  <div className="flex justify-between items-center gap-3">
                    <input type="text" placeholder="Başlık" value={event.title} onChange={e => updTimelineField(idx, 'title', e.target.value)} className="flex-1 py-2 px-3 rounded-lg border border-glass text-[13px] font-bold bg-white/5 text-textLight outline-none focus:border-primary transition-colors" />
                    <button type="button" onClick={() => { if (confirm('Bu maddeyi silmek istediğinize emin misiniz?')) setClientReports(prev => { const u = { ...prev }; const b = { ...u[editingReportBrand] }; b.timeline = [...(b.timeline || [])]; b.timeline.splice(idx, 1); u[editingReportBrand] = b; return u; }); }} className={deleteBtnCls} title="Sil"><i className="fa-solid fa-trash"></i></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><span className={microLabel}>Tarih</span><input type="date" value={parseDateToISO(event.date)} onChange={e => updTimelineField(idx, 'date', formatToTurkishDate(e.target.value))} className="w-full py-1.5 px-3 rounded-md border border-glass text-xs bg-white/5 text-textLight cursor-pointer outline-none focus:border-primary transition-colors" /></div>
                    <div><span className={microLabel}>Sorumlu</span>
                      <select value={event.author} onChange={e => updTimelineField(idx, 'author', e.target.value)} className="w-full py-1.5 px-3 rounded-md border border-glass text-xs bg-white/5 text-textLight cursor-pointer outline-none focus:border-primary transition-colors appearance-none">
                        {!teamMembersData.some(m => `${m.name} (${m.role})` === event.author) && event.author && <option value={event.author}>{event.author}</option>}
                        <option value="Yiğit K. (SEO & Google Ads)">Yiğit K. (SEO & Google Ads)</option>
                        <option value="Melis S. (Kreatif Direktör)">Melis S. (Kreatif Direktör)</option>
                        <option value="Emre T. (Web Developer)">Emre T. (Web Developer)</option>
                        <option value="Selin Y. (Müşteri İlişkileri)">Selin Y. (Müşteri İlişkileri)</option>
                        <option value="Make.com (Otomasyon)">Make.com (Otomasyon)</option>
                        {teamMembersData.map((member, mIdx) => { const v = `${member.name} (${member.role})`; if (["Yiğit K. (SEO & Google Ads)","Melis S. (Kreatif Direktör)","Emre T. (Web Developer)","Selin Y. (Müşteri İlişkileri)"].includes(v)) return null; return <option key={mIdx} value={v}>{v}</option>; })}
                      </select>
                    </div>
                  </div>
                  <div><span className={microLabel}>Çalışma Detayları</span><textarea placeholder="Açıklama" rows="2" value={event.desc} onChange={e => updTimelineField(idx, 'desc', e.target.value)} className="w-full py-2 px-3 rounded-lg border border-glass text-[13px] resize-y bg-white/5 text-textLight leading-relaxed outline-none focus:border-primary transition-colors"></textarea></div>
                </div>;
              })}
              {(!brand?.timeline || brand.timeline.length === 0) && <p className="text-xs text-textMuted text-center my-4 italic">Zaman çizelgesine henüz bir çalışma eklenmemiş.</p>}
            </div>
          </div>
        </div>}
      </div>

      {/* Files Vault */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className={cardCls}>
          <div className={sectionHeaderCls}>
            <span className={sectionTitleCls}><i className="fa-solid fa-folder-open text-sky-500"></i>Dosya Kasası (Faturalar & Raporlar)</span>
            <label className={`${addBtnCls} cursor-pointer`}>
              <i className="fa-solid fa-upload"></i> Dosya Yükle
              <input type="file" className="hidden" accept="image/*,application/pdf" onChange={async (e) => {
                const file = e.target.files[0]; if (!file) return;
                try {
                  const newBlob = await upload(Date.now() + '-' + file.name, file, { access: 'public', handleUploadUrl: '/api/upload' });
                  const u = { ...clientReports }; if (!u[editingReportBrand].files) u[editingReportBrand].files = [];
                  u[editingReportBrand].files.push({ id: Date.now(), title: file.name, type: file.name.toLowerCase().includes('fatura') ? 'invoice' : 'pdf', url: newBlob.url, date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }) });
                  setClientReports(u);
                  const localDbStr = localStorage.getItem('ajans_rota_db');
                  if (localDbStr) { try { const dbPayload = JSON.parse(localDbStr); dbPayload.clientReports = u; localStorage.setItem('ajans_rota_db', JSON.stringify(dbPayload)); } catch {} }
                  if (u[editingReportBrand].client_id) { fetch('/api/clients/update', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }, body: JSON.stringify({ client_id: u[editingReportBrand].client_id, report_data: u[editingReportBrand] }) }).catch(console.error); }
                  toast.success('Dosya yüklendi!');
                } catch (err) { toast.error('Dosya yükleme hatası: ' + err.message); }
              }} />
            </label>
          </div>
          <div className="flex flex-col gap-3">
            {(brand?.files || []).map((f, idx) => (
              <div key={idx} className="p-3 bg-white/5 rounded-xl border border-glass flex justify-between items-center transition-colors hover:bg-white/10">
                <div className="flex flex-col gap-1"><span className="text-[13px] font-semibold text-textLight flex items-center gap-2"><i className={`fa-solid ${f.type === 'invoice' ? 'fa-file-invoice-dollar text-emerald-500' : 'fa-file-pdf text-rose-500'}`}></i>{f.title}</span><a href={f.url} target="_blank" rel="noreferrer" className="text-[11px] text-primary hover:text-primary/80 transition-colors font-medium">Görüntüle / İndir</a></div>
                <button type="button" onClick={() => { if (confirm('Silmek istediğinize emin misiniz?')) { const u = { ...clientReports }; u[editingReportBrand].files.splice(idx, 1); setClientReports(u); } }} className={deleteBtnCls}><i className="fa-solid fa-trash"></i></button>
              </div>
            ))}
            {(!brand?.files || brand.files.length === 0) && <p className="text-xs text-textMuted text-center my-4 italic">Kasa boş.</p>}
          </div>
        </div>
      </div>

      {/* Google & Meta Ads Campaign Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {['googleAds', 'metaAds'].map(platform => (
          <div key={platform} className={cardCls}>
            <div className={sectionHeaderCls}>
              <span className={sectionTitleCls}><i className={`fa-brands ${platform === 'googleAds' ? 'fa-google text-rose-500' : 'fa-meta text-sky-500'}`}></i>{platform === 'googleAds' ? 'Google Ads' : 'Meta Ads'} Kampanya Tablosu</span>
              <button type="button" onClick={() => { const u = { ...clientReports }; u[editingReportBrand][platform].push({ name: platform === 'googleAds' ? "Yeni Arama Ağı Kampanyası" : "Yeni Reels Video Reklam Seti", spend: "0 TL", clicks: "0", ctr: "0.00%", conversions: "0", roas: editingReportBrand === 'ecommerce' ? "1.0x" : "0 TL CPL", ...(platform === 'metaAds' ? { status: 'Aktif' } : {}) }); setClientReports(u); }} className={addBtnCls}><i className="fa-solid fa-plus"></i> Ekle</button>
            </div>
            <div className="flex flex-col gap-3">
              {brand?.[platform]?.map((camp, idx) => <CampaignCard key={idx} platform={platform} camp={camp} idx={idx} />)}
              {(!brand?.[platform] || brand[platform].length === 0) && <p className="text-xs text-textMuted text-center my-4 italic">Kampanya eklenmemiş.</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Team Managers */}
      <div className="mt-10 mb-8">
        <div className={sectionHeaderCls}>
          <h4 className={sectionTitleCls}><i className="fa-solid fa-users text-sky-500"></i>Hesap Yöneticileri (Ekip)</h4>
          <button type="button" className={addBtnCls} onClick={() => { const u = { ...clientReports }; if (!u[editingReportBrand].teamManagers) u[editingReportBrand].teamManagers = []; u[editingReportBrand].teamManagers.push({ name: "Aykut K.", role: "Ajans Başkanı", avatar: "https://i.pravatar.cc/150?u=aykut", online: true }); setClientReports(u); }}><i className="fa-solid fa-plus"></i> Üye Ekle</button>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {(brand?.teamManagers || []).map((member, idx) => (
            <div key={idx} className="bg-white/5 border border-glass rounded-xl p-4 relative flex flex-col gap-3 transition-colors hover:border-glass-border">
              <button type="button" onClick={() => { setClientReports(prev => { const u = { ...prev }; const b = { ...u[editingReportBrand] }; const m = [...(b.teamManagers || [])]; m.splice(idx, 1); b.teamManagers = m; u[editingReportBrand] = b; return u; }); }} className="absolute top-2 right-2 border-none bg-transparent hover:bg-red-500/10 p-1.5 rounded-md cursor-pointer text-red-500/70 hover:text-red-500 transition-colors"><i className="fa-solid fa-trash text-xs"></i></button>
              <div>
                <span className={microLabel}>Takım Üyesi</span>
                <select value={member.name || ''} onChange={e => {
                  const val = e.target.value;
                  const agencyTeam = [{ name: "Aykut Qul", role: "Ajans Başkanı", avatar: "https://i.pravatar.cc/150?u=aykut" },{ name: "Ahmet Yılmaz", role: "Google Ads & SEO", avatar: "https://i.pravatar.cc/150?u=ahmet" },{ name: "Ayşe Demir", role: "Meta Ads & Kreatif", avatar: "https://i.pravatar.cc/150?u=ayse" },{ name: "Melis S.", role: "Müşteri Başarı Yöneticisi", avatar: "https://i.pravatar.cc/150?u=melis" },{ name: "Selin Y.", role: "Sosyal Medya", avatar: "https://i.pravatar.cc/150?u=selin" },{ name: "Büşra T.", role: "Proje Yöneticisi", avatar: "https://i.pravatar.cc/150?u=busra" },{ name: "Kemal D.", role: "Yazılım Uzmanı", avatar: "https://i.pravatar.cc/150?u=kemal" }];
                  const found = agencyTeam.find(t => t.name === val) || { role: "", avatar: "https://i.pravatar.cc/150" };
                  setClientReports(prev => { const u = { ...prev }; const b = { ...u[editingReportBrand] }; const m = [...(b.teamManagers || [])]; m[idx] = { ...m[idx], name: val, role: found.role, avatar: found.avatar }; b.teamManagers = m; u[editingReportBrand] = b; return u; });
                }} className="w-full py-1.5 px-2 rounded-lg border border-glass bg-white/5 text-xs text-textLight outline-none focus:border-primary transition-colors appearance-none">
                  <option value="">İsim Seçin...</option><option value="Aykut Qul">Aykut Qul</option><option value="Ahmet Yılmaz">Ahmet Yılmaz</option><option value="Ayşe Demir">Ayşe Demir</option><option value="Melis S.">Melis S.</option><option value="Selin Y.">Selin Y.</option><option value="Büşra T.">Büşra T.</option><option value="Kemal D.">Kemal D.</option>
                </select>
              </div>
              <div>
                <span className={microLabel}>Rol / Unvan</span>
                <input type="text" value={member.role || ''} onChange={e => { setClientReports(prev => { const u = { ...prev }; const b = { ...u[editingReportBrand] }; const m = [...(b.teamManagers || [])]; m[idx] = { ...m[idx], role: e.target.value }; b.teamManagers = m; u[editingReportBrand] = b; return u; }); }} placeholder="Örn: SEO Uzmanı" className="w-full py-1.5 px-2 rounded-lg border border-glass bg-white/5 text-xs text-textLight outline-none focus:border-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="mt-10 mb-10">
        <div className={sectionHeaderCls}>
          <h4 className={sectionTitleCls}><i className="fa-solid fa-map text-emerald-500"></i>Gelecek Ay Planı (Roadmap)</h4>
          <button type="button" className={addBtnCls} onClick={() => { setClientReports(prev => { const u = { ...prev }; const b = { ...u[editingReportBrand] }; b.nextMonthPlan = [...(b.nextMonthPlan || []), { id: Math.floor(Math.random()*10000), task: "", status: "Bekliyor", date: "", category: "Ads" }]; u[editingReportBrand] = b; return u; }); }}><i className="fa-solid fa-plus"></i> Görev Ekle</button>
        </div>
        <div className="flex flex-col gap-5 relative mt-4 pl-3">
          <div className="absolute left-[29px] top-[15px] bottom-[15px] w-0.5 z-[1]" style={{ background: 'linear-gradient(180deg, #10b981 0%, rgba(16,185,129,0.1) 100%)' }}></div>
          {(brand?.nextMonthPlan || []).map((plan, idx) => {
            let accentColor = '#94a3b8', iconClass = 'fa-regular fa-circle';
            if (plan.status === 'İşlemde') { accentColor = '#0ea5e9'; iconClass = 'fa-solid fa-spinner fa-spin'; }
            else if (plan.status === 'Planlandı' || plan.status === 'Tamamlandı') { accentColor = '#10b981'; iconClass = 'fa-solid fa-check'; }
            return <div key={plan.id || idx} className="bg-white/5 border border-glass rounded-xl p-5 flex flex-col gap-4 relative ml-11 shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-[2] transition-colors hover:bg-white/10 hover:border-glass-border">
              <div className="absolute -left-12 top-4 w-[30px] h-[30px] rounded-full bg-slate-900 flex items-center justify-center text-sm shadow-[0_0_10px_rgba(0,0,0,0.5)] z-[3]" style={{ border: `2px solid ${accentColor}`, color: accentColor }}><i className={iconClass}></i></div>
              <div className="flex justify-between items-center gap-3">
                <input type="text" placeholder="Görev Adı" value={plan.task || ''} onChange={e => updPlanField(idx, 'task', e.target.value)} className="flex-1 py-2 px-3 rounded-lg border border-glass text-sm font-bold bg-white/5 text-textLight outline-none focus:border-primary transition-colors" />
                <button type="button" onClick={() => { if (confirm('Silmek istediğinize emin misiniz?')) setClientReports(prev => { const u = { ...prev }; const b = { ...u[editingReportBrand] }; b.nextMonthPlan = [...(b.nextMonthPlan || [])]; b.nextMonthPlan.splice(idx, 1); u[editingReportBrand] = b; return u; }); }} className={deleteBtnCls} title="Sil"><i className="fa-solid fa-trash"></i></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div><span className={microLabel}>Kategori</span><select value={plan.category || ''} onChange={e => updPlanField(idx, 'category', e.target.value)} className="w-full py-2 px-3 rounded-lg border border-glass text-xs bg-white/5 text-textLight cursor-pointer outline-none focus:border-primary transition-colors appearance-none"><option value="">Seçiniz...</option><option value="Ads">Google/Meta Ads</option><option value="SEO">SEO</option><option value="Sosyal Medya">Sosyal Medya</option><option value="Yazılım">Yazılım</option><option value="Tasarım">Tasarım & Kreatif</option><option value="Genel">Genel Strateji</option></select></div>
                <div><span className={microLabel}>Hedef Tarih</span><input type="date" value={plan.date || ''} onChange={e => updPlanField(idx, 'date', e.target.value)} className="w-full py-2 px-3 rounded-lg border border-glass text-xs bg-white/5 text-textLight cursor-pointer outline-none focus:border-primary transition-colors" /></div>
                <div><span className={microLabel}>Durum</span><select value={plan.status || 'Bekliyor'} onChange={e => updPlanField(idx, 'status', e.target.value)} className="w-full py-2 px-3 rounded-lg border border-glass text-xs bg-white/5 text-textLight cursor-pointer outline-none focus:border-primary transition-colors appearance-none"><option value="Bekliyor">Bekliyor</option><option value="İşlemde">İşlemde</option><option value="Planlandı">Planlandı</option><option value="Tamamlandı">Tamamlandı</option></select></div>
              </div>
            </div>;
          })}
          {(!brand?.nextMonthPlan || brand.nextMonthPlan.length === 0) && <p className="text-xs text-textMuted text-center my-4 italic">Gelecek ay planına henüz görev eklenmemiş.</p>}
        </div>
      </div>

      {/* Save */}
      <div className="border-t border-glass pt-6 pb-12 flex justify-end">
        <button type="button" onClick={handleSaveAll} disabled={isSaving} className="flex items-center justify-center gap-2 py-3 px-8 text-sm font-bold bg-primary text-white border-none rounded-lg cursor-pointer hover:bg-primary/90 transition-colors w-full sm:w-auto">
          <i className="fa-solid fa-floppy-disk"></i>
          {isSaving ? 'Kaydediliyor...' : 'Tüm Değişiklikleri Canlıya Kaydet'}
        </button>
      </div>
    </div>
  );
}
