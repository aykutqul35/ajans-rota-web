import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function AnalyticsTab({
  getAggregatedStats, handleGenerateDemoStats, statsLoading,
  loadStats, handleResetStats, setDateFilter, dateFilter,
  customStartDate, setCustomStartDate, customEndDate, setCustomEndDate,
  statsError
}) {
  const data = getAggregatedStats();
  const formatTime = secs => {
    if (secs < 60) return `${secs} sn`;
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins} dk ${remainingSecs} sn`;
  };
  const getActionLabel = actName => {
    if (actName.startsWith('download_pdf_')) {
      const guideId = actName.replace('download_pdf_', '');
      return `Akademi: Kılavuz PDF İndirme (Rehber: ${guideId})`;
    }
    switch (actName) {
      case 'submit_whatsapp_chat': return 'WhatsApp Asistanı: Sohbet Başlatıldı';
      case 'click_whatsapp_bubble': return 'WhatsApp Asistanı: Widget Tıklandı';
      case 'submit_contact_form': return 'İletişim Formu: Gönderildi';
      case 'submit_seo_report': return 'SEO Analiz Aracı: Rapor PDF İndirildi';
      case 'submit_kobi_report': return 'KOBİ Endeksi: Rapor PDF İndirildi';
      case 'submit_competitor_report': return 'Rakip Analizi: Rapor PDF İndirildi';
      case 'generate_ai_guide': return 'Admin Panel: Yapay Zeka Özel Kılavuz Üretimi';
      default: return actName;
    }
  };

  const sectionHeading = "m-0 mb-5 text-[0.95rem] font-bold text-text-light flex items-center gap-2 border-b border-glass-border pb-2";

  const kpiCards = [
    { icon: 'fa-eye', label: 'Sayfa Gösterimi', value: data.totalViews.toLocaleString('tr-TR'), iconBg: 'bg-primary/[0.08] text-primary border border-primary/15' },
    { icon: 'fa-user-group', label: 'Ziyaretçiler (Oturum)', value: data.totalSessions.toLocaleString('tr-TR'), iconBg: 'bg-secondary/[0.08] text-secondary border border-secondary/15' },
    { icon: 'fa-signature', label: 'Gönderilen Formlar', value: data.totalActions.toLocaleString('tr-TR'), iconBg: 'bg-amber-300/[0.08] text-amber-600 border border-amber-300/15' },
    { icon: 'fa-clock', label: 'Ort. Sitede Kalma', value: formatTime(data.avgDuration), iconBg: 'bg-fuchsia-500/[0.08] text-fuchsia-500 border border-fuchsia-500/15' },
  ];

  return <div>
    {/* Header */}
    <div className="admin-section-title flex justify-between items-center flex-wrap gap-4 mb-6">
      <span>Web Sitesi Ziyaretçi &amp; Davranış Analizi</span>
      <div className="flex gap-2">
        <button onClick={handleGenerateDemoStats} className="btn btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5 rounded-lg cursor-pointer border border-primary/30 bg-primary/5 text-primary" disabled={statsLoading}>
          <i className="fa-solid fa-chart-line"></i> Simülasyon Verisi Yükle
        </button>
        <button onClick={loadStats} className="btn btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5 rounded-lg cursor-pointer border border-glass-border bg-slate-900/[0.02]" disabled={statsLoading}>
          <i className={`fa-solid fa-arrows-rotate ${statsLoading ? 'fa-spin' : ''}`}></i> Verileri Yenile
        </button>
        <button onClick={handleResetStats} className="btn btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5 rounded-lg cursor-pointer border border-red-500/30 bg-red-500/5 text-red-500" disabled={statsLoading}>
          <i className="fa-solid fa-trash-can"></i> Sıfırla
        </button>
      </div>
    </div>

    {/* Date Filter */}
    <div className="glass-card analytics-filter-card p-5 rounded-xl mb-6 flex flex-col gap-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex gap-1.5 flex-wrap analytics-presets">
          {[
            { id: 'today', label: 'Bugün' },
            { id: 'yesterday', label: 'Dün' },
            { id: '7days', label: 'Son 7 Gün' },
            { id: '30days', label: 'Son 30 Gün' },
            { id: 'all', label: 'Tüm Zamanlar' },
            { id: 'custom', label: 'Özel Aralık' }
          ].map(preset => <button key={preset.id} onClick={() => setDateFilter(preset.id)} className={`btn px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer shadow-none ${dateFilter === preset.id ? 'btn-primary border-none' : 'btn-secondary border border-glass-border'}`}>
            {preset.label}
          </button>)}
        </div>
      </div>

      {dateFilter === 'custom' && <div className="custom-date-inputs flex items-center gap-3 flex-wrap bg-slate-900/[0.02] py-3 px-5 rounded-lg border border-glass-border">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-text-muted">Başlangıç:</label>
          <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="py-1.5 px-2.5 rounded-md border border-glass-border outline-none text-xs focus:border-primary transition-colors" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-text-muted">Bitiş:</label>
          <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="py-1.5 px-2.5 rounded-md border border-glass-border outline-none text-xs focus:border-primary transition-colors" />
        </div>
      </div>}
    </div>

    {statsLoading ? <div className="text-center py-20 px-4 text-text-muted">
      <i className="fa-solid fa-circle-notch fa-spin text-4xl mb-4 text-primary block"></i>
      <p className="font-medium">İstatistik verileri analiz ediliyor, lütfen bekleyin...</p>
    </div> : statsError ? <div className="text-center py-16 px-4 text-red-500 bg-red-500/[0.02] border border-red-500/10 rounded-xl">
      <i className="fa-solid fa-triangle-exclamation text-4xl mb-4 block"></i>
      <p className="font-semibold">{statsError}</p>
      <button onClick={() => setDateFilter(dateFilter)} className="btn btn-primary mt-4 px-5 py-2 text-xs">Tekrar Dene</button>
    </div> : <>
      {/* KPI SCORECARDS */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-6 analytics-kpi-grid">
        {kpiCards.map((kpi, i) => (
          <div key={i} className="glass-card kpi-card p-5 flex items-center gap-4">
            <div className={`w-[45px] h-[45px] rounded-xl flex items-center justify-center text-xl ${kpi.iconBg}`}>
              <i className={`fa-solid ${kpi.icon}`}></i>
            </div>
            <div>
              <div className="text-xs text-text-muted font-semibold">{kpi.label}</div>
              <div className="text-2xl font-bold text-text-light mt-0.5">{kpi.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6 mb-6 analytics-charts-split">
        
        {/* Top Pages Bar Chart */}
        <div className="glass-card p-6">
          <h3 className={sectionHeading}>
            <i className="fa-solid fa-file-invoice text-primary"></i> En Çok Ziyaret Edilen Sayfalar
          </h3>
          {data.pages.length === 0 ? <div className="text-center py-12 px-4 text-text-muted text-sm">Veri bulunmuyor.</div> : <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.pages.slice(0, 10)} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--glass-border)" />
                <XAxis type="number" hide />
                <YAxis dataKey="path" type="category" width={120} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(tick) => tick === '/' ? '/' : tick} />
                <RechartsTooltip cursor={{ fill: 'rgba(15, 23, 42, 0.03)' }} formatter={(value) => [value, 'Gösterim']} contentStyle={{ borderRadius: '8px', border: '1px solid var(--glass-border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <defs>
                  <linearGradient id="colorView" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={1}/>
                    <stop offset="100%" stopColor="var(--secondary)" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <Bar dataKey="views" fill="url(#colorView)" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>}
        </div>

        {/* Traffic Channels Pie Chart */}
        <div className="glass-card p-6">
          <h3 className={sectionHeading}>
            <i className="fa-solid fa-chart-simple text-secondary"></i> Ziyaretçi Trafik Kanalları
          </h3>
          {data.referrers.length === 0 || data.totalSessions === 0 ? <div className="text-center py-12 px-4 text-text-muted text-sm">Veri bulunmuyor.</div> : <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.referrers}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="name"
                  stroke="none"
                >
                  {data.referrers.map((entry, index) => {
                    const COLORS = ['#00ebd6', '#00b4d8', '#16a34a', '#64748b', '#d946ef', '#f59e0b'];
                    return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                  })}
                </Pie>
                <RechartsTooltip formatter={(value) => [value, 'Ziyaretçi']} contentStyle={{ borderRadius: '8px', border: '1px solid var(--glass-border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>}
        </div>

      </div>

      {/* EVENT TRACKING TABLE */}
      <div className="glass-card p-6 mb-6">
        <h3 className={sectionHeading}>
          <i className="fa-solid fa-flag text-amber-600"></i> Etkinlik Tıklamaları &amp; Dönüşüm Performansı (Hedefler)
        </h3>
        {data.actions.length === 0 ? <div className="text-center py-14 px-4 text-text-muted text-sm">
          <i className="fa-solid fa-circle-info text-2xl mb-2 block opacity-50"></i>
          Seçilen tarih aralığında kaydedilmiş buton tıklaması veya form gönderimi bulunmamaktadır.
        </div> : <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hedef / Yapılan Eylem</th>
                <th className="text-center w-[150px]">Toplam Tetiklenme</th>
                <th className="text-center w-[180px]">Ziyaretçi Katılım Oranı</th>
              </tr>
            </thead>
            <tbody>
              {data.actions.map(act => {
                const conversionRate = data.totalSessions > 0 ? (act.count / data.totalSessions * 100).toFixed(1) : '0.0';
                return <tr key={act.name}>
                  <td className="font-semibold text-text-light">
                    {getActionLabel(act.name)}
                  </td>
                  <td className="text-center font-bold text-primary">
                    {act.count}
                  </td>
                  <td className="text-center">
                    <span className="text-xs bg-primary/[0.06] text-primary px-2 py-0.5 rounded-xl font-semibold border border-primary/15">
                      %{conversionRate} CR
                    </span>
                  </td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>}
      </div>

      {/* ORGANIC SEARCH KEYWORDS TABLE */}
      <div className="glass-card p-6 mb-6 border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
        <h3 className={sectionHeading}>
          <i className="fa-brands fa-google text-emerald-500"></i> Organik Arama Kelimeleri (Simülasyon / GSC)
        </h3>
        
        <div className="text-xs text-text-muted mb-4 bg-emerald-500/[0.05] p-3 rounded-lg border border-emerald-500/10">
          <p className="mb-1"><i className="fa-solid fa-circle-info text-emerald-500"></i> <strong>Önemli Teknik Bilgi:</strong> Google, gizlilik politikaları (Not Provided) gereği organik aramalardan gelen ziyaretçilerin <strong>hangi kelimeyi aratarak siteye girdiğini</strong> standart JS pikseli veya Analytics araçlarıyla paylaşmaz. Bu veriyi %100 doğrulukla görmek için sitenizin <strong>Google Search Console (GSC)</strong> hesabına bağlanması gerekir.</p>
          <p>Aşağıdaki tablo, panelinize Search Console entegre edildiğinde verilerin nasıl görüneceğine dair bir taslaktır.</p>
        </div>

        {data.totalSessions === 0 ? <div className="text-center py-8 px-4 text-text-muted text-sm">
          Seçilen tarih aralığında yeterli organik trafik verisi bulunmuyor.
        </div> : <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Arama Terimi (Sorgu)</th>
                <th className="text-center w-[120px]">Tıklama</th>
                <th className="text-center w-[120px]">Gösterim</th>
                <th className="text-center w-[100px]">TO (CTR)</th>
                <th className="text-center w-[100px]">Ort. Konum</th>
              </tr>
            </thead>
            <tbody>
              {[
                { term: 'izmir dijital ajans', clicks: Math.floor(data.totalSessions * 0.15) || 12, imp: 450, pos: 2.4 },
                { term: 'sosyal medya yönetimi izmir', clicks: Math.floor(data.totalSessions * 0.12) || 9, imp: 380, pos: 3.1 },
                { term: 'ajans rota', clicks: Math.floor(data.totalSessions * 0.08) || 6, imp: 120, pos: 1.2 },
                { term: 'google ads danışmanlığı', clicks: Math.floor(data.totalSessions * 0.05) || 4, imp: 290, pos: 5.6 },
                { term: 'izmir web tasarım firmaları', clicks: Math.floor(data.totalSessions * 0.04) || 3, imp: 310, pos: 4.8 }
              ].sort((a,b) => b.clicks - a.clicks).map((kw, i) => {
                const ctr = ((kw.clicks / kw.imp) * 100).toFixed(1);
                return <tr key={i}>
                  <td className="font-medium text-text-light">{kw.term}</td>
                  <td className="text-center font-bold text-emerald-500">{kw.clicks}</td>
                  <td className="text-center text-text-muted">{kw.imp}</td>
                  <td className="text-center text-text-muted">%{ctr}</td>
                  <td className="text-center text-text-muted">{kw.pos}</td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>}
      </div>

    </>}
  </div>;
}
