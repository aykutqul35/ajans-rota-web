
export default function LeadsTab({
  leadsData, leadSearchText, setLeadSearchText, leadSourceFilter, setLeadSourceFilter,
  leadServiceFilter, setLeadServiceFilter, leadStatusFilter, setLeadStatusFilter,
  exportLeadsToCSV, handleViewLead, handleDeleteLead, servicesData
}) {
  const totalLeads = leadsData.length;
  const googleCount = leadsData.filter(l => l.trafficSource === 'Google Ads').length;
  const metaCount = leadsData.filter(l => l.trafficSource === 'Meta Ads').length;
  const organicCount = totalLeads - googleCount - metaCount;
  const googlePct = totalLeads > 0 ? parseFloat((googleCount / totalLeads * 100).toFixed(1)) : 0;
  const metaPct = totalLeads > 0 ? parseFloat((metaCount / totalLeads * 100).toFixed(1)) : 0;
  const organicPct = totalLeads > 0 ? parseFloat((organicCount / totalLeads * 100).toFixed(1)) : 0;
  const filteredLeads = leadsData.filter(lead => {
    const searchLower = leadSearchText.toLowerCase();
    const matchesSearch = !leadSearchText || lead.fullName && lead.fullName.toLowerCase().includes(searchLower) || lead.email && lead.email.toLowerCase().includes(searchLower) || lead.phone && lead.phone.toLowerCase().includes(searchLower) || lead.company && lead.company.toLowerCase().includes(searchLower) || lead.message && lead.message.toLowerCase().includes(searchLower) || lead.service && lead.service.toLowerCase().includes(searchLower);
    const matchesSource = leadSourceFilter === 'all' || lead.trafficSource === leadSourceFilter;
    const matchesService = leadServiceFilter === 'all' || lead.service && lead.service.toLowerCase().includes(leadServiceFilter.toLowerCase());
    const matchesStatus = leadStatusFilter === 'all' || lead.status === leadStatusFilter;
    return matchesSearch && matchesSource && matchesService && matchesStatus;
  });

  const selectCls = "w-full py-2.5 px-3 rounded-lg border border-glass-border bg-white text-sm outline-none cursor-pointer focus:border-primary transition-colors";
  const kpiCardCls = "kpi-card bg-slate-900/[0.01] border border-glass-border rounded-xl p-5 flex items-center gap-4 transition-all duration-200";
  const kpiLabelCls = "text-xs text-text-muted font-semibold uppercase tracking-wide";
  const kpiValueCls = "text-2xl font-bold text-text-light mt-0.5";

  const getSourceBadge = (source) => {
    if (source === 'Google Ads') return { bg: 'bg-sky-500/[0.08]', text: 'text-primary', icon: 'fa-brands fa-google' };
    if (source === 'Meta Ads') return { bg: 'bg-pink-500/[0.08]', text: 'text-secondary', icon: 'fa-brands fa-meta' };
    return { bg: 'bg-green-500/[0.08]', text: 'text-green-600', icon: 'fa-solid fa-seedling' };
  };

  return (<div>
    {/* Header */}
    <div className="admin-section-title flex justify-between items-center flex-wrap gap-4">
      <span>Gelen İletişim ve Teklif Talepleri</span>
      {totalLeads > 0 && <div className="flex gap-2 flex-wrap">
        <button onClick={() => exportLeadsToCSV(leadsData)} className="btn btn-secondary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer shadow-none border border-glass-border bg-slate-900/[0.02]">
          <i className="fa-solid fa-download"></i> Tümünü Aktar (CSV)
        </button>
        {filteredLeads.length !== totalLeads && filteredLeads.length > 0 && <button onClick={() => exportLeadsToCSV(filteredLeads)} className="btn btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer shadow-none">
          <i className="fa-solid fa-file-csv"></i> Filtrelenmişi Aktar ({filteredLeads.length})
        </button>}
      </div>}
    </div>

    {totalLeads > 0 && <>
      {/* KPI Cards */}
      <div className="admin-dashboard-stats grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6 mt-4">
        <div className={kpiCardCls}>
          <div className="w-12 h-12 rounded-full bg-slate-900/[0.03] flex items-center justify-center text-text-light text-xl border border-glass-border">
            <i className="fa-solid fa-envelope-open-text"></i>
          </div>
          <div>
            <div className={kpiLabelCls}>Toplam Talep</div>
            <div className={kpiValueCls}>{totalLeads}</div>
          </div>
        </div>

        <div className={kpiCardCls}>
          <div className="w-12 h-12 rounded-full bg-sky-500/[0.06] flex items-center justify-center text-primary text-xl border border-sky-500/15">
            <i className="fa-brands fa-google"></i>
          </div>
          <div>
            <div className={kpiLabelCls}>Google Ads</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-text-light">{googleCount}</span>
              <span className="text-xs text-primary font-semibold">(%{googlePct})</span>
            </div>
          </div>
        </div>

        <div className={kpiCardCls}>
          <div className="w-12 h-12 rounded-full bg-pink-500/[0.06] flex items-center justify-center text-secondary text-xl border border-pink-500/15">
            <i className="fa-brands fa-meta"></i>
          </div>
          <div>
            <div className={kpiLabelCls}>Meta Ads</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-text-light">{metaCount}</span>
              <span className="text-xs text-secondary font-semibold">(%{metaPct})</span>
            </div>
          </div>
        </div>

        <div className={kpiCardCls}>
          <div className="w-12 h-12 rounded-full bg-green-500/[0.06] flex items-center justify-center text-green-600 text-xl border border-green-500/15">
            <i className="fa-solid fa-seedling"></i>
          </div>
          <div>
            <div className={kpiLabelCls}>Organik (SEO)</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-text-light">{organicCount}</span>
              <span className="text-xs text-green-600 font-semibold">(%{organicPct})</span>
            </div>
          </div>
        </div>
      </div>

      {/* CRM Reminder Banner */}
      {(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const activeFollowUps = leadsData.filter(lead => {
          return lead.reminderDate && lead.status !== 'kazanildi' && lead.status !== 'kaybedildi' && lead.reminderDate <= todayStr;
        });
        if (activeFollowUps.length === 0) return null;
        return <div className="crm-reminder-banner rounded-xl p-5 mb-6 flex flex-col gap-3 relative overflow-hidden border border-amber-500/25" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(239, 68, 68, 0.04) 100%)' }}>
          {/* Background Glow */}
          <div className="absolute -right-5 -top-5 text-[6rem] text-amber-500/5 pointer-events-none -rotate-[15deg]">
            <i className="fa-solid fa-clock"></i>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/15 text-amber-600 text-sm">
              <i className="fa-solid fa-bell-exclamation"></i>
            </span>
            <div>
              <h4 className="m-0 text-sm font-bold text-text-light">
                Bugün Takip Edilecek Müşteri Hatırlatmaları ({activeFollowUps.length})
              </h4>
              <p className="mt-0.5 mb-0 text-xs text-text-muted">
                Belirlediğiniz takip tarihi gelmiş veya geçmiş olan müşterilerle iletişime geçin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 mt-1">
            {activeFollowUps.map(lead => <div key={lead.id} onClick={() => handleViewLead(lead)} className="crm-reminder-item-card bg-white border border-amber-500/15 rounded-lg p-3 cursor-pointer transition-all duration-200 flex justify-between items-center hover:shadow-md">
              <div className="min-w-0 flex-1 pr-2">
                <div className="flex items-center gap-1.5">
                  <strong className="text-xs text-text-light whitespace-nowrap overflow-hidden text-ellipsis block max-w-[140px]">
                    {lead.fullName}
                  </strong>
                  <span className="text-[0.65rem] bg-amber-500/10 text-amber-600 px-1.5 py-px rounded font-semibold">
                    {lead.reminderDate === todayStr ? 'Bugün' : 'Gecikmiş'}
                  </span>
                </div>
                <span className="text-[0.7rem] text-text-muted block mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                  {lead.service}
                </span>
              </div>
              <span className="text-xs text-primary font-semibold inline-flex items-center gap-1 shrink-0">
                Kartı Aç <i className="fa-solid fa-arrow-right-long"></i>
              </span>
            </div>)}
          </div>
        </div>;
      })()}

      {/* Analytics Dashboard Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6 mb-8">
        {/* Traffic Source Card */}
        <div className="bg-slate-900/[0.01] border border-glass-border rounded-xl py-5 px-6 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h4 className="m-0 text-sm font-semibold text-text-light flex items-center gap-1.5">
                <i className="fa-solid fa-chart-pie text-primary"></i> Trafik Kaynağı Analizi
              </h4>
              <p className="mt-0.5 mb-0 text-xs text-text-muted">
                Taleplerin geldikleri reklam ve arama kanallarına göre dağılımı
              </p>
            </div>

            {/* Progress Bar */}
            <div className="h-6 rounded-xl bg-slate-900/[0.03] overflow-hidden flex mb-4 border border-glass-border">
              {googleCount > 0 && <div className="bg-primary flex items-center justify-center text-white text-xs font-bold transition-[width] duration-300" style={{ width: `${googlePct}%`, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }} title={`Google Ads: ${googleCount} Talep (%${googlePct})`}>
                {googlePct >= 10 ? `%${googlePct}` : ''}
              </div>}
              {metaCount > 0 && <div className="bg-secondary flex items-center justify-center text-white text-xs font-bold transition-[width] duration-300" style={{ width: `${metaPct}%`, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }} title={`Meta Ads: ${metaCount} Talep (%${metaPct})`}>
                {metaPct >= 10 ? `%${metaPct}` : ''}
              </div>}
              {organicCount > 0 && <div className="bg-green-600 flex items-center justify-center text-white text-xs font-bold transition-[width] duration-300" style={{ width: `${organicPct}%`, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }} title={`Organik (SEO): ${organicCount} Talep (%${organicPct})`}>
                {organicPct >= 10 ? `%${organicPct}` : ''}
              </div>}
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-start gap-5 flex-wrap text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
              <strong className="text-text-light">Google Ads:</strong>
              <span className="text-text-muted">{googleCount} (%{googlePct})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
              <strong className="text-text-light">Meta Ads:</strong>
              <span className="text-text-muted">{metaCount} (%{metaPct})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span>
              <strong className="text-text-light">Organik:</strong>
              <span className="text-text-muted">{organicCount} (%{organicPct})</span>
            </div>
          </div>
        </div>

        {/* Most Demanded Services Card */}
        <div className="bg-slate-900/[0.01] border border-glass-border rounded-xl py-5 px-6 flex flex-col justify-between">
          <div>
            <h4 className="m-0 text-sm font-semibold text-text-light flex items-center gap-1.5 mb-1">
              <i className="fa-solid fa-cubes text-secondary"></i> En Çok Talep Edilen Hizmetler
            </h4>
            <p className="m-0 text-xs text-text-muted mb-3">
              Müşteri taleplerinde en çok tercih edilen dijital hizmetler
            </p>

            <div className="flex flex-col gap-2">
              {(() => {
                const serviceCounts = {};
                leadsData.forEach(lead => {
                  const s = lead.service || 'Diğer';
                  let servicesToCount = [];
                  if (s.includes('Hesaplayıcı') || s.includes('Teklif')) {
                    const match = (lead.message || '').match(/Seçilen Hizmetler:\s*([^\n\r]+)/);
                    if (match && match[1]) { servicesToCount = match[1].split(',').map(item => item.trim()); }
                    else { servicesToCount = ['Genel Teklif']; }
                  } else if (s.includes('ROAS') || s.includes('Rapor')) {
                    servicesToCount = ['Rapor / Analiz'];
                  } else {
                    let normalized = s;
                    if (s.toLowerCase().includes('google')) normalized = 'Google Ads';
                    else if (s.toLowerCase().includes('meta') || s.toLowerCase().includes('facebook') || s.toLowerCase().includes('instagram')) normalized = 'Meta Ads';
                    else if (s.toLowerCase().includes('seo') || s.toLowerCase().includes('arama')) normalized = 'SEO';
                    else if (s.toLowerCase().includes('sosyal') || s.toLowerCase().includes('medya')) normalized = 'Sosyal Medya';
                    else if (s.toLowerCase().includes('tasarım') || s.toLowerCase().includes('web')) normalized = 'Web Tasarım';
                    else if (s.toLowerCase().includes('eticaret') || s.toLowerCase().includes('e-ticaret')) normalized = 'E-Ticaret';
                    servicesToCount = [normalized];
                  }
                  servicesToCount.forEach(svc => { if (!svc) return; serviceCounts[svc] = (serviceCounts[svc] || 0) + 1; });
                });
                const sortedServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);
                const maxVal = sortedServices.length > 0 ? Math.max(...sortedServices.map(x => x[1])) : 1;
                return sortedServices.map(([name, count]) => {
                  const barPct = Math.round(count / maxVal * 100);
                  return <div key={name} className="flex flex-col gap-0.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-text-light">{name}</span>
                      <span className="text-text-muted"><strong>{count}</strong> talep</span>
                    </div>
                    <div className="h-1.5 rounded-sm bg-slate-900/[0.03] overflow-hidden border border-glass-border">
                      <div className="h-full rounded-sm transition-[width] duration-300" style={{ width: `${barPct}%`, background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }}></div>
                    </div>
                  </div>;
                });
              })()}
            </div>
          </div>
        </div>
      </div>
    </>}

    {/* Filter Controls */}
    <div className="flex gap-3 flex-wrap items-center bg-slate-900/[0.02] border border-glass-border rounded-xl p-4 mb-5">
      {/* Search */}
      <div className="flex-[2_1_250px] relative">
        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm"></i>
        <input type="text" placeholder="Müşteri adı, e-posta, şirket veya mesaj içeriği ara..." value={leadSearchText} onChange={e => setLeadSearchText(e.target.value)} className="w-full py-2.5 pl-9 pr-3 rounded-lg border border-glass-border bg-white text-sm outline-none transition-colors focus:border-primary" />
      </div>

      {/* Source Filter */}
      <div className="flex-[1_1_150px]">
        <select value={leadSourceFilter} onChange={e => setLeadSourceFilter(e.target.value)} className={selectCls}>
          <option value="all">Tüm Kaynaklar</option>
          <option value="Google Ads">Google Ads</option>
          <option value="Meta Ads">Meta Ads</option>
          <option value="Organik (SEO)">Organik (SEO)</option>
          <option value="SEO Analiz Aracı">SEO Analiz Aracı</option>
          <option value="KOBİ Endeksi Sayfası">KOBİ Endeksi</option>
          <option value="Rakip Karşılaştırma Sayfası">Rakip Karşılaştırma</option>
          <option value="Rota Akademi Portalı">Rota Akademi</option>
          <option value="WhatsApp Chat Botu">WhatsApp Chat Botu</option>
        </select>
      </div>

      {/* Service Filter */}
      <div className="flex-[1_1_150px]">
        <select value={leadServiceFilter} onChange={e => setLeadServiceFilter(e.target.value)} className={selectCls}>
          <option value="all">Tüm Hizmetler</option>
          {Object.keys(servicesData).map(key => <option key={key} value={servicesData[key].title}>{servicesData[key].title}</option>)}
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex-[1_1_120px]">
        <select value={leadStatusFilter} onChange={e => setLeadStatusFilter(e.target.value)} className={selectCls}>
          <option value="all">Tüm Durumlar</option>
          <option value="unread">Yeni (Okunmadı)</option>
          <option value="yeni">Yeni Başvuru</option>
          <option value="iletisimde">İletişimde / Ön Görüşme</option>
          <option value="toplanti_planlandi">Toplantı Planlandı</option>
          <option value="analiz_fazinda">Analiz Fazında</option>
          <option value="teklif_hazirlaniyor">Teklif Hazırlanıyor</option>
          <option value="teklif_iletildi">Teklif İletildi</option>
          <option value="revize_istendi">Revize İstendi</option>
          <option value="sozlesme_asamasinda">Sözleşme Aşamasında</option>
          <option value="kazanildi">Kazanıldı</option>
          <option value="kaybedildi">Kaybedildi</option>
          <option value="ertelendi">Ertelendi / Beklemede</option>
          <option value="read">Okundu</option>
        </select>
      </div>

      {/* Clear */}
      {(leadSearchText || leadSourceFilter !== 'all' || leadServiceFilter !== 'all' || leadStatusFilter !== 'all') && <button onClick={() => {
        setLeadSearchText('');
        setLeadSourceFilter('all');
        setLeadServiceFilter('all');
        setLeadStatusFilter('all');
      }} className="btn btn-secondary py-2.5 px-4 text-sm rounded-lg border border-red-500/20 bg-red-500/5 text-red-500 cursor-pointer inline-flex items-center gap-1.5">
        <i className="fa-solid fa-filter-circle-xmark"></i> Temizle
      </button>}
    </div>

    {/* Counter */}
    {totalLeads > 0 && <div className="text-xs text-text-muted mb-3 font-medium flex justify-between items-center">
      <span>
        Toplam <strong>{totalLeads}</strong> talepten <strong>{filteredLeads.length}</strong> tanesi listeleniyor.
      </span>
      {filteredLeads.length === 0 && <span className="text-red-500">Arama kriterlerinize uygun kayıt bulunamadı.</span>}
    </div>}

    {/* Table or Empty */}
    {filteredLeads.length === 0 ? <div className="text-center py-16 px-4 text-text-muted bg-slate-900/[0.01] border border-glass-border rounded-xl">
      <i className="fa-solid fa-folder-open text-5xl mb-4 text-primary opacity-60 block"></i>
      <p className="font-medium">Filtrelere uygun talep bulunamadı.</p>
    </div> : <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th className="hide-on-mobile">Tarih</th>
            <th>Müşteri Bilgileri</th>
            <th>Hizmet / Konu</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeads.map(lead => {
            const badge = getSourceBadge(lead.trafficSource);
            return <tr key={lead.id} className={lead.status === 'unread' ? 'unread' : ''}>
              <td className="hide-on-mobile">{(lead.date || lead.created_at) ? (lead.date || lead.created_at).substring(0, 16).replace('T', ' ') : 'Bilinmiyor'}</td>
              <td>
                <div><strong>{lead.fullName}</strong></div>
                <div className="text-xs text-text-muted">{lead.email} | {lead.phone}</div>
                {lead.trafficSource && <div className="text-xs mt-1">
                  <span className={`inline-flex items-center gap-1 font-semibold text-[0.7rem] ${badge.bg} ${badge.text} px-1.5 py-px rounded-xl border border-current`}>
                    <i className={`${badge.icon} text-[0.65rem]`}></i>
                    {lead.trafficSource}
                  </span>
                </div>}
              </td>
              <td>
                <span className="text-sm bg-primary-glow text-primary px-2 py-0.5 rounded font-semibold">
                  {lead.service}
                </span>
              </td>
              <td>
                <span className={`lead-status-badge ${lead.status || 'unread'}`}>
                  {lead.status === 'unread' ? 'Yeni' : lead.status === 'yeni' ? 'Yeni Başvuru' : lead.status === 'iletisimde' ? 'İletişimde' : lead.status === 'toplanti_planlandi' ? 'Toplantı Planlandı' : lead.status === 'analiz_fazinda' ? 'Analiz Fazında' : lead.status === 'teklif_hazirlaniyor' ? 'Teklif Hazırlanıyor' : lead.status === 'teklif_iletildi' ? 'Teklif İletildi' : lead.status === 'revize_istendi' ? 'Revize İstendi' : lead.status === 'sozlesme_asamasinda' ? 'Sözleşme Aşamasında' : lead.status === 'kazanildi' ? 'Kazanıldı' : lead.status === 'kaybedildi' ? 'Kaybedildi' : lead.status === 'ertelendi' ? 'Ertelendi' : lead.status === 'sent' ? 'Teklif İletildi' : 'Okundu'}
                </span>
              </td>
              <td>
                <div className="admin-action-btns">
                  <button onClick={() => handleViewLead(lead)} className="btn-icon" title="Detayları Gör">
                    <i className="fa-solid fa-eye"></i>
                  </button>
                  <button onClick={() => handleDeleteLead(lead.id)} className="btn-icon btn-delete" title="Sil">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>}
  </div>
  );
}
