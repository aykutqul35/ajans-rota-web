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
  const inputCls = "w-full py-2.5 px-2.5 rounded-md border border-slate-900/10 bg-white text-text-light focus:border-primary outline-none transition-colors";
  const inputSmCls = "w-full py-1.5 px-2 rounded border border-slate-900/10 bg-white text-text-light text-xs focus:border-primary outline-none transition-colors";
  const cardCls = "border border-slate-900/10 p-5 rounded-lg bg-slate-900/[0.01]";
  const sectionHeaderCls = "flex justify-between items-center mb-4";
  const sectionTitleCls = "font-bold text-sm text-text-light";
  const addBtnCls = "btn btn-primary py-1 px-2.5 text-xs rounded";
  const microLabel = "text-[0.65rem] text-text-muted block mb-0.5 font-semibold";
  const deleteBtnCls = "border-none bg-red-500/[0.08] rounded-md w-[26px] h-[26px] flex items-center justify-center cursor-pointer text-red-500 text-xs transition-all";

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
      <div className="bg-white border border-slate-900/10 rounded-lg p-3 flex flex-col gap-2 relative">
        <button type="button" onClick={() => { const u = { ...clientReports }; u[editingReportBrand][platform].splice(idx, 1); setClientReports(u); }} className="absolute top-2 right-2 border-none bg-none cursor-pointer text-red-500 text-xs"><i className="fa-solid fa-trash"></i></button>
        <div className="flex gap-2 w-[90%] items-center">
          <input type="text" value={camp.name} onChange={e => updCampField(platform, idx, 'name', e.target.value)} placeholder="Kampanya Adı" className="flex-[2] py-1.5 px-2 rounded border border-slate-900/10 text-xs font-semibold bg-white text-text-light outline-none" />
          {platform === 'metaAds' && <select value={camp.status || 'Aktif'} onChange={e => updCampField(platform, idx, 'status', e.target.value)} className="flex-1 py-1 px-2 rounded border border-slate-900/10 text-xs bg-white text-text-light outline-none">
            <option value="Aktif">Aktif</option><option value="Duraklatıldı">Duraklatıldı</option>
          </select>}
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {fields.map(f => <div key={f.key}>
            <span className={microLabel}>{f.label}</span>
            <input type="text" value={camp[f.key]} onChange={e => updCampField(platform, idx, f.key, e.target.value)} className="w-full py-1 px-1.5 rounded border border-slate-900/10 text-[0.7rem] bg-white text-text-light outline-none" />
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
      <div className="admin-section-title">Müşteri Raporlama Paneli Yönetimi</div>
      <p className="text-sm text-text-muted mb-6">Müşteri Raporlama & Şeffaflık sayfasındaki marka simülasyonlarının canlı verilerini, KPI kartlarını ve çalışma geçmişi zaman çizelgesini buradan güncelleyebilirsiniz.</p>

      {/* Brand Selector */}
      <div className="flex items-center gap-3 mb-10 flex-wrap">
        <div className="flex gap-2 bg-slate-900/[0.03] p-1.5 rounded-lg w-fit flex-wrap">
          {Object.keys(clientReports || {}).map(brandKey => {
            const isSelected = editingReportBrand === brandKey;
            const b = clientReports[brandKey];
            const isEcom = brandKey === 'ecommerce' || brandKey.toLowerCase().includes('ecom');
            return <button key={brandKey} type="button" onClick={() => setEditingReportBrand(brandKey)} className={`py-2 px-4 rounded-lg border-none text-xs font-semibold cursor-pointer transition-all ${isSelected ? 'bg-white text-primary shadow-md' : 'bg-transparent text-text-light'}`}>
              <i className={`${isEcom ? 'fa-solid fa-cart-shopping' : 'fa-solid fa-briefcase'} mr-1.5`}></i>
              {b?.brandName || brandKey}
            </button>;
          })}
        </div>

        <button type="button" onClick={() => { setNewClientFormData({ code: '', name: '', username: '', password: '' }); setIsAddClientModalOpen(true); }} className="py-2 px-4 rounded-lg border border-dashed border-primary bg-primary-glow text-primary text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-all">
          <i className="fa-solid fa-plus"></i> Yeni Müşteri Ekle
        </button>

        {editingReportBrand !== 'ecommerce' && editingReportBrand !== 'b2b' && <button type="button" onClick={async () => {
          if (!confirm(`${clientReports[editingReportBrand]?.brandName || editingReportBrand} müşterisini silmek istediğinize emin misiniz?`)) return;
          const clientId = clientReports[editingReportBrand]?.client_id;
          if (clientId) { const tId = toast.loading("Siliniyor..."); try { const res = await fetch('/api/admin/clients/' + clientId, { method: 'DELETE' }); if (res.ok) toast.success("Silindi!", { id: tId }); else { toast.error("Başarısız.", { id: tId }); return; } } catch { toast.error("Bağlantı hatası.", { id: tId }); return; } }
          const u = { ...clientReports }; delete u[editingReportBrand]; setClientReports(u); setEditingReportBrand('ecommerce');
        }} className="py-2 px-4 rounded-lg border border-red-500/20 bg-red-500/5 text-red-500 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 ml-auto">
          <i className="fa-solid fa-trash"></i> Müşteriyi Sil
        </button>}
      </div>

      {/* Inner Tabs */}
      <div className="flex gap-2 mb-6 p-2 bg-slate-900/5 rounded-xl border border-slate-900/10 w-full overflow-x-auto">
        {[{ id: 'genel', label: '⚙️ Genel Ayarlar' }, { id: 'kpi', label: '📈 Performans & SEO' }, { id: 'timeline', label: '🗓️ Zaman Çizelgesi' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveInnerTab(tab.id)} type="button" className={`flex-1 py-3 px-4 rounded-lg border-none text-sm font-semibold cursor-pointer transition-all whitespace-nowrap ${activeInnerTab === tab.id ? 'bg-primary text-white shadow-[0_4px_12px_rgba(14,165,233,0.2)]' : 'bg-transparent text-text-muted'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-8 mb-8">

        {/* Genel */}
        {activeInnerTab === 'genel' && <div className="flex flex-col gap-5">
          <div className="admin-form-group"><label>Marka / Müşteri Adı</label><input type="text" value={brand?.brandName || ''} onChange={e => updBrand('brandName', e.target.value)} className={inputCls} /></div>
          <div className="admin-form-group"><label>Sektör / Kategori Açıklaması</label><input type="text" value={brand?.industry || ''} onChange={e => updBrand('industry', e.target.value)} className={inputCls} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="admin-form-group"><label>Giriş Kullanıcı Adı</label><input type="text" value={brand?.username || ''} onChange={e => updBrand('username', e.target.value)} className={inputCls} /></div>
            <div className="admin-form-group"><label>Giriş Şifresi</label><input type="text" value={brand?.password || ''} onChange={e => updBrand('password', e.target.value)} className={inputCls} /></div>
          </div>

          {/* API Integration Box */}
          <div className="border border-indigo-500/[0.18] p-5 rounded-xl bg-indigo-500/[0.02] mb-2">
            <span className="font-bold text-sm text-primary flex items-center gap-1.5 mb-3"><i className="fa-solid fa-cloud-bolt"></i> Make.com / API Entegrasyon Ayarları</span>
            <div className="flex flex-col gap-3">
              <div>
                <span className={microLabel}>Webhook Hedef URL</span>
                <div className="flex gap-2">
                  <input type="text" readOnly value={`${window.location.origin}/api.php?action=update_live_metrics`} className="flex-1 py-1.5 px-2 rounded-md border border-slate-900/10 bg-slate-50 text-text-muted text-xs" />
                  <button type="button" onClick={e => { navigator.clipboard.writeText(`${window.location.origin}/api.php?action=update_live_metrics`); e.currentTarget.innerText = "Kopyalandı!"; setTimeout(() => e.currentTarget.innerText = "Kopyala", 1500); }} className="py-1.5 px-3 rounded-md border-none bg-primary text-white text-[0.7rem] font-bold cursor-pointer">Kopyala</button>
                </div>
              </div>
              <div>
                <span className={microLabel}>Authorization Bearer Token</span>
                <div className="flex gap-2">
                  <input type="text" readOnly value={authToken} className="flex-1 py-1.5 px-2 rounded-md border border-slate-900/10 bg-slate-50 text-text-muted text-xs" />
                  <button type="button" onClick={e => { navigator.clipboard.writeText(authToken); e.currentTarget.innerText = "Kopyalandı!"; setTimeout(() => e.currentTarget.innerText = "Kopyala", 1500); }} className="py-1.5 px-3 rounded-md border-none bg-primary text-white text-[0.7rem] font-bold cursor-pointer">Kopyala</button>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs bg-slate-900/[0.03] py-1.5 px-2.5 rounded-md mt-1">
                <span className="text-text-light">Firma Kodu: <strong className="text-primary">{editingReportBrand}</strong></span>
                <span className="text-text-light text-right">
                  {brand?.api_last_sync ? <>Senk: <strong className="text-green-600">{brand.api_last_sync}</strong></> : <span className="text-text-muted italic">Henüz Senkronize Edilmedi</span>}
                </span>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="border border-slate-900/10 p-5 rounded-lg bg-indigo-500/5 mb-4 border-l-4 border-l-primary">
            <div className="flex justify-between items-center mb-4">
              <span className="font-extrabold text-sm text-text-dark flex items-center gap-2"><i className="fa-solid fa-robot text-primary"></i> Yapay Zeka Yönetici Özeti</span>
              <button className="btn btn-primary py-1.5 px-3 text-xs" style={{ opacity: isGeneratingAi ? 0.7 : 1 }} onClick={handleGenerateAiSummary} disabled={isGeneratingAi}>
                {isGeneratingAi ? <><i className="fa-solid fa-spinner fa-spin"></i> Analiz Ediliyor...</> : <><i className="fa-solid fa-wand-magic-sparkles"></i> Otomatik Yazdır</>}
              </button>
            </div>
            <textarea rows="3" placeholder="Müşteriye gösterilecek haftalık stratejik AI yorumu..." value={brand?.aiSummary || ''} onChange={e => updBrand('aiSummary', e.target.value)} className="w-full p-3 rounded-lg border border-slate-900/10 text-sm font-[inherit] resize-y bg-white outline-none"></textarea>
          </div>

          {/* AI Insight */}
          <div className="border border-slate-900/10 p-5 rounded-lg bg-emerald-500/5 mb-4 border-l-4 border-l-emerald-500">
            <div className="mb-4">
              <span className="font-extrabold text-sm text-text-dark flex items-center gap-2"><i className="fa-solid fa-lightbulb text-emerald-500"></i> Yapay Zeka Aksiyon Önerisi</span>
              <p className="text-xs text-text-muted mt-1">Müşterinin "Talep Et" diyerek onaylayabileceği bir yapay zeka önerisi.</p>
            </div>
            <div className="grid gap-4">
              <div className="admin-form-group !mb-0"><label>Öneri Metni</label><input type="text" placeholder="Örn: CPL maliyetiniz düştü, yeni bir Reels kreatifi çekmenizi öneriyoruz." value={brand?.aiInsight || ''} onChange={e => updBrand('aiInsight', e.target.value)} className={inputCls} /></div>
              <div className="admin-form-group !mb-0"><label>Buton / Aksiyon Başlığı</label><input type="text" placeholder="Örn: Yeni Reels Kreatif Çekimi" value={brand?.aiInsightAction || ''} onChange={e => updBrand('aiInsightAction', e.target.value)} className={inputCls} /></div>
            </div>
          </div>
        </div>}

        {/* KPI & SEO */}
        {activeInnerTab === 'kpi' && <div className="flex flex-col gap-5">
          <div className={cardCls}>
            <div className={sectionHeaderCls}><span className={sectionTitleCls}><i className="fa-solid fa-chart-pie mr-2 text-primary"></i>KPI Kart Değerleri</span></div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              {brand?.kpis?.map((kpi, idx) => (
                <div key={idx} className="bg-white border border-slate-900/10 rounded-lg p-4 flex flex-col gap-2 transition-all">
                  <span className="text-[0.7rem] text-text-muted font-semibold uppercase tracking-wider">{kpi.label}</span>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-hashtag text-primary opacity-50"></i>
                    <input type="text" placeholder="Değer" value={kpi.value} onChange={e => { const u = { ...clientReports }; u[editingReportBrand].kpis[idx].value = e.target.value; setClientReports(u); }} className="flex-1 py-1.5 px-2 rounded-md border border-slate-900/10 bg-white text-text-main text-sm font-semibold outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-arrow-trend-up text-emerald-500 opacity-70"></i>
                    <input type="text" placeholder="Değişim" value={kpi.change} onChange={e => { const u = { ...clientReports }; u[editingReportBrand].kpis[idx].change = e.target.value; setClientReports(u); }} className="flex-1 py-1.5 px-2 rounded-md border border-slate-900/10 bg-white text-emerald-500 text-xs outline-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Keywords */}
          <div className={cardCls}>
            <div className={sectionHeaderCls}><span className={sectionTitleCls}>SEO Kelime Yönetimi</span><button type="button" onClick={() => { setClientReports(prev => { const u = { ...prev }; const b = { ...u[editingReportBrand] }; b.seo = [...(b.seo || []), { keyword: "Yeni Anahtar Kelime", rank: "0", volume: "0", trend: "right", trendText: "" }]; u[editingReportBrand] = b; return u; }); }} className={addBtnCls}><i className="fa-solid fa-plus"></i> Kelime Ekle</button></div>
            <div className="flex flex-col gap-4">
              {brand?.seo?.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2 bg-white border border-slate-900/10 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <input type="text" placeholder="Kelime" value={item.keyword} onChange={e => { const u = { ...clientReports }; u[editingReportBrand].seo[idx].keyword = e.target.value; setClientReports(u); }} className="flex-1 py-1.5 px-2.5 rounded-md border border-slate-900/10 text-xs font-semibold bg-slate-900/[0.01] outline-none" />
                    <button type="button" onClick={() => { if (window.confirm('Silmek istiyor musunuz?')) setClientReports(prev => { const u = { ...prev }; u[editingReportBrand].seo.splice(idx, 1); return u; }); }} className="border-none bg-transparent text-red-500 cursor-pointer px-2"><i className="fa-solid fa-trash"></i></button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div><span className={microLabel}>Hacim</span><input type="text" value={item.volume} onChange={e => { const u = { ...clientReports }; u[editingReportBrand].seo[idx].volume = e.target.value; setClientReports(u); }} className={inputSmCls} /></div>
                    <div><span className={microLabel}>Sıra</span><input type="text" value={item.rank} onChange={e => {
                      const newRankStr = e.target.value; const newRank = parseInt(newRankStr) || 0; const oldRank = parseInt(item.rank) || 0;
                      const u = { ...clientReports }; u[editingReportBrand].seo[idx].rank = newRankStr;
                      if (oldRank > 0 && newRank > 0 && newRank !== oldRank) { if (newRank < oldRank) { u[editingReportBrand].seo[idx].trend = 'up'; u[editingReportBrand].seo[idx].trendText = (oldRank - newRank) + ' Sıra Yükseldi'; } else { u[editingReportBrand].seo[idx].trend = 'down'; u[editingReportBrand].seo[idx].trendText = (newRank - oldRank) + ' Sıra Düştü'; } }
                      setClientReports(u);
                    }} className={inputSmCls} /></div>
                    <div><span className={microLabel}>Trend (Oto)</span><div className={`text-xs py-1.5 flex items-center gap-1 ${item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-500' : 'text-slate-500'}`}><i className={`fa-solid fa-arrow-${item.trend === 'up' ? 'trend-up' : item.trend === 'down' ? 'trend-down' : 'right'}`}></i>{item.trendText || 'Belirtilmedi'}</div></div>
                  </div>
                </div>
              ))}
              {(!brand?.seo || brand.seo.length === 0) && <p className="text-xs text-text-muted text-center my-4">Henüz kelime eklenmemiş.</p>}
            </div>
          </div>
        </div>}

        {/* Timeline */}
        {activeInnerTab === 'timeline' && <div className="flex flex-col gap-5">
          <div className={`${cardCls} h-full flex flex-col`}>
            <div className={sectionHeaderCls}><span className={sectionTitleCls}>Zaman Çizelgesi (Yapılan Çalışmalar)</span><button type="button" onClick={() => { setClientReports(prev => { const u = { ...prev }; const b = { ...u[editingReportBrand] }; b.timeline = [{ date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }), title: "Yeni Çalışma Maddesi", desc: "Yapılan çalışmanın detaylı açıklaması.", author: "Yiğit K. (SEO & Google Ads)" }, ...(b.timeline || [])]; u[editingReportBrand] = b; return u; }); }} className={addBtnCls}><i className="fa-solid fa-plus"></i> Ekle</button></div>
            <div className="overflow-y-auto flex-1 max-h-[800px] flex flex-col gap-4 pr-1.5 relative">
              <div className="absolute left-[19px] top-[15px] bottom-[15px] w-0.5 z-[1]" style={{ background: 'linear-gradient(180deg, var(--primary) 0%, rgba(99,102,241,0.15) 100%)' }}></div>
              {brand?.timeline?.map((event, idx) => {
                const isBot = event.author?.toLowerCase().includes('bot') || event.author?.toLowerCase().includes('make.com');
                const isSEO = event.title?.toLowerCase().includes('seo') || event.desc?.toLowerCase().includes('seo');
                const isAds = event.title?.toLowerCase().includes('ads') || event.title?.toLowerCase().includes('reklam');
                let accentColor = 'var(--text-muted)', iconClass = 'fa-solid fa-pen-to-square';
                if (isBot) { accentColor = '#6366f1'; iconClass = 'fa-solid fa-robot'; }
                else if (isSEO) { accentColor = 'var(--secondary)'; iconClass = 'fa-solid fa-magnifying-glass-chart'; }
                else if (isAds) { accentColor = 'var(--primary)'; iconClass = 'fa-solid fa-bullhorn'; }
                return <div key={idx} className="bg-white border border-slate-900/10 rounded-lg p-4 flex flex-col gap-2.5 relative ml-10 shadow-[0_2px_4px_rgba(0,0,0,0.02)] z-[2]">
                  <div className="absolute -left-10 top-3 w-[26px] h-[26px] rounded-full bg-white flex items-center justify-center text-xs shadow-md z-[3]" style={{ border: `2px solid ${accentColor}`, color: accentColor }}><i className={iconClass}></i></div>
                  <div className="flex justify-between items-center gap-3">
                    <input type="text" placeholder="Başlık" value={event.title} onChange={e => updTimelineField(idx, 'title', e.target.value)} className="flex-1 py-1.5 px-2 rounded-md border border-slate-900/10 text-xs font-bold bg-slate-900/[0.01] text-text-light outline-none" />
                    <button type="button" onClick={() => { if (confirm('Bu maddeyi silmek istediğinize emin misiniz?')) setClientReports(prev => { const u = { ...prev }; const b = { ...u[editingReportBrand] }; b.timeline = [...(b.timeline || [])]; b.timeline.splice(idx, 1); u[editingReportBrand] = b; return u; }); }} className={deleteBtnCls} title="Sil"><i className="fa-solid fa-trash"></i></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><span className={microLabel}>Tarih</span><input type="date" value={parseDateToISO(event.date)} onChange={e => updTimelineField(idx, 'date', formatToTurkishDate(e.target.value))} className="w-full py-1 px-1.5 rounded border border-slate-900/10 text-xs bg-white text-text-light cursor-pointer outline-none" /></div>
                    <div><span className={microLabel}>Sorumlu</span>
                      <select value={event.author} onChange={e => updTimelineField(idx, 'author', e.target.value)} className="w-full py-1 px-1.5 rounded border border-slate-900/10 text-xs bg-white text-text-light cursor-pointer outline-none">
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
                  <div><span className={microLabel}>Çalışma Detayları</span><textarea placeholder="Açıklama" rows="2" value={event.desc} onChange={e => updTimelineField(idx, 'desc', e.target.value)} className="w-full py-1.5 px-2 rounded-md border border-slate-900/10 text-xs font-[inherit] resize-y bg-white text-text-light leading-relaxed outline-none"></textarea></div>
                </div>;
              })}
            </div>
          </div>
        </div>}
      </div>

      {/* Files Vault */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        <div className={cardCls}>
          <div className={sectionHeaderCls}>
            <span className={sectionTitleCls}>Dosya Kasası (Faturalar & Raporlar)</span>
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
              <div key={idx} className="p-3 bg-white rounded-md border border-slate-900/10 flex justify-between items-center">
                <div className="flex flex-col"><span className="text-xs font-semibold">{f.title}</span><a href={f.url} target="_blank" rel="noreferrer" className="text-[0.7rem] text-primary no-underline">Görüntüle</a></div>
                <button type="button" onClick={() => { if (confirm('Silmek istediğinize emin misiniz?')) { const u = { ...clientReports }; u[editingReportBrand].files.splice(idx, 1); setClientReports(u); } }} className={deleteBtnCls}><i className="fa-solid fa-trash"></i></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Google & Meta Ads Campaign Tables */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {['googleAds', 'metaAds'].map(platform => (
          <div key={platform} className={cardCls}>
            <div className={sectionHeaderCls}>
              <span className={sectionTitleCls}>{platform === 'googleAds' ? 'Google Ads' : 'Meta Ads'} Kampanya Tablosu</span>
              <button type="button" onClick={() => { const u = { ...clientReports }; u[editingReportBrand][platform].push({ name: platform === 'googleAds' ? "Yeni Arama Ağı Kampanyası" : "Yeni Reels Video Reklam Seti", spend: "0 TL", clicks: "0", ctr: "0.00%", conversions: "0", roas: editingReportBrand === 'ecommerce' ? "1.0x" : "0 TL CPL", ...(platform === 'metaAds' ? { status: 'Aktif' } : {}) }); setClientReports(u); }} className={addBtnCls}><i className="fa-solid fa-plus"></i> Ekle</button>
            </div>
            <div className="flex flex-col gap-3">
              {brand?.[platform]?.map((camp, idx) => <CampaignCard key={idx} platform={platform} camp={camp} idx={idx} />)}
            </div>
          </div>
        ))}
      </div>

      {/* Team Managers */}
      <div className="mt-10">
        <div className={sectionHeaderCls}>
          <h4 className="text-base text-text-dark"><i className="fa-solid fa-users mr-2 text-sky-500"></i>Hesap Yöneticileri (Ekip)</h4>
          <button type="button" className="btn btn-secondary text-xs py-1.5 px-3" onClick={() => { const u = { ...clientReports }; if (!u[editingReportBrand].teamManagers) u[editingReportBrand].teamManagers = []; u[editingReportBrand].teamManagers.push({ name: "Aykut K.", role: "Ajans Başkanı", avatar: "https://i.pravatar.cc/150?u=aykut", online: true }); setClientReports(u); }}><i className="fa-solid fa-plus"></i> Üye Ekle</button>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
          {(brand?.teamManagers || []).map((member, idx) => (
            <div key={idx} className="bg-white border border-slate-900/10 rounded-lg p-3 relative flex gap-2 flex-wrap">
              <button type="button" onClick={() => { setClientReports(prev => { const u = { ...prev }; const b = { ...u[editingReportBrand] }; const m = [...(b.teamManagers || [])]; m.splice(idx, 1); b.teamManagers = m; u[editingReportBrand] = b; return u; }); }} className="absolute top-2 right-2 border-none bg-none cursor-pointer text-red-500"><i className="fa-solid fa-trash"></i></button>
              <select value={member.name || ''} onChange={e => {
                const val = e.target.value;
                const agencyTeam = [{ name: "Aykut Qul", role: "Ajans Başkanı", avatar: "https://i.pravatar.cc/150?u=aykut" },{ name: "Ahmet Yılmaz", role: "Google Ads & SEO", avatar: "https://i.pravatar.cc/150?u=ahmet" },{ name: "Ayşe Demir", role: "Meta Ads & Kreatif", avatar: "https://i.pravatar.cc/150?u=ayse" },{ name: "Melis S.", role: "Müşteri Başarı Yöneticisi", avatar: "https://i.pravatar.cc/150?u=melis" },{ name: "Selin Y.", role: "Sosyal Medya", avatar: "https://i.pravatar.cc/150?u=selin" },{ name: "Büşra T.", role: "Proje Yöneticisi", avatar: "https://i.pravatar.cc/150?u=busra" },{ name: "Kemal D.", role: "Yazılım Uzmanı", avatar: "https://i.pravatar.cc/150?u=kemal" }];
                const found = agencyTeam.find(t => t.name === val) || { role: "", avatar: "https://i.pravatar.cc/150" };
                setClientReports(prev => { const u = { ...prev }; const b = { ...u[editingReportBrand] }; const m = [...(b.teamManagers || [])]; m[idx] = { ...m[idx], name: val, role: found.role, avatar: found.avatar }; b.teamManagers = m; u[editingReportBrand] = b; return u; });
              }} className="flex-1 py-1.5 rounded border border-slate-900/10 text-xs outline-none">
                <option value="">İsim Seçin...</option><option value="Aykut Qul">Aykut Qul</option><option value="Ahmet Yılmaz">Ahmet Yılmaz</option><option value="Ayşe Demir">Ayşe Demir</option><option value="Melis S.">Melis S.</option><option value="Selin Y.">Selin Y.</option><option value="Büşra T.">Büşra T.</option><option value="Kemal D.">Kemal D.</option>
              </select>
              <input type="text" value={member.role || ''} onChange={e => { setClientReports(prev => { const u = { ...prev }; const b = { ...u[editingReportBrand] }; const m = [...(b.teamManagers || [])]; m[idx] = { ...m[idx], role: e.target.value }; b.teamManagers = m; u[editingReportBrand] = b; return u; }); }} placeholder="Rol" className="w-full py-1.5 rounded border border-slate-900/10 text-xs outline-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="mt-10 mb-8">
        <div className={sectionHeaderCls}>
          <h4 className="text-base text-text-dark"><i className="fa-solid fa-map mr-2 text-emerald-500"></i>Gelecek Ay Planı (Roadmap)</h4>
          <button type="button" className="btn btn-secondary text-xs py-1.5 px-3" onClick={() => { setClientReports(prev => { const u = { ...prev }; const b = { ...u[editingReportBrand] }; b.nextMonthPlan = [...(b.nextMonthPlan || []), { id: Math.floor(Math.random()*10000), task: "", status: "Bekliyor", date: "", category: "Ads" }]; u[editingReportBrand] = b; return u; }); }}><i className="fa-solid fa-plus"></i> Görev Ekle</button>
        </div>
        <div className="flex flex-col gap-4 relative mt-2 pl-2">
          <div className="absolute left-[27px] top-[15px] bottom-[15px] w-0.5 z-[1]" style={{ background: 'linear-gradient(180deg, #10b981 0%, rgba(16,185,129,0.15) 100%)' }}></div>
          {(brand?.nextMonthPlan || []).map((plan, idx) => {
            let accentColor = '#94a3b8', iconClass = 'fa-regular fa-circle';
            if (plan.status === 'İşlemde') { accentColor = '#0ea5e9'; iconClass = 'fa-solid fa-spinner fa-spin'; }
            else if (plan.status === 'Planlandı' || plan.status === 'Tamamlandı') { accentColor = '#10b981'; iconClass = 'fa-solid fa-check'; }
            return <div key={plan.id || idx} className="bg-white border border-slate-900/10 rounded-lg p-4 flex flex-col gap-2.5 relative ml-10 shadow-[0_2px_4px_rgba(0,0,0,0.02)] z-[2]">
              <div className="absolute -left-10 top-3 w-[26px] h-[26px] rounded-full bg-white flex items-center justify-center text-xs shadow-md z-[3]" style={{ border: `2px solid ${accentColor}`, color: accentColor }}><i className={iconClass}></i></div>
              <div className="flex justify-between items-center gap-3">
                <input type="text" placeholder="Görev Adı" value={plan.task || ''} onChange={e => updPlanField(idx, 'task', e.target.value)} className="flex-1 py-1.5 px-2 rounded-md border border-slate-900/10 text-sm font-bold bg-slate-900/[0.01] text-text-light outline-none" />
                <button type="button" onClick={() => { if (confirm('Silmek istediğinize emin misiniz?')) setClientReports(prev => { const u = { ...prev }; const b = { ...u[editingReportBrand] }; b.nextMonthPlan = [...(b.nextMonthPlan || [])]; b.nextMonthPlan.splice(idx, 1); u[editingReportBrand] = b; return u; }); }} className={deleteBtnCls} title="Sil"><i className="fa-solid fa-trash"></i></button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div><span className={microLabel}>Kategori</span><select value={plan.category || ''} onChange={e => updPlanField(idx, 'category', e.target.value)} className="w-full py-1 px-1.5 rounded border border-slate-900/10 text-xs bg-white text-text-light cursor-pointer outline-none"><option value="">Seçiniz...</option><option value="Ads">Google/Meta Ads</option><option value="SEO">SEO</option><option value="Sosyal Medya">Sosyal Medya</option><option value="Yazılım">Yazılım</option><option value="Tasarım">Tasarım & Kreatif</option><option value="Genel">Genel Strateji</option></select></div>
                <div><span className={microLabel}>Hedef Tarih</span><input type="date" value={plan.date || ''} onChange={e => updPlanField(idx, 'date', e.target.value)} className="w-full py-1 px-1.5 rounded border border-slate-900/10 text-xs bg-white text-text-light cursor-pointer outline-none" /></div>
                <div><span className={microLabel}>Durum</span><select value={plan.status || 'Bekliyor'} onChange={e => updPlanField(idx, 'status', e.target.value)} className="w-full py-1 px-1.5 rounded border border-slate-900/10 text-xs bg-white text-text-light cursor-pointer outline-none"><option value="Bekliyor">Bekliyor</option><option value="İşlemde">İşlemde</option><option value="Planlandı">Planlandı</option><option value="Tamamlandı">Tamamlandı</option></select></div>
              </div>
            </div>;
          })}
        </div>
      </div>

      {/* Save */}
      <div className="border-t border-glass-border pt-6 flex justify-end">
        <button type="button" onClick={handleSaveAll} disabled={isSaving} className="btn btn-primary flex items-center gap-2 py-3 px-8">
          <i className="fa-solid fa-floppy-disk"></i>
          {isSaving ? 'Kaydediliyor...' : 'Tüm Değişiklikleri Canlıya Kaydet'}
        </button>
      </div>
    </div>
  );
}
