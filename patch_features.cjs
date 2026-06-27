const fs = require('fs');
let c = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

// 1. Mock Data injection
const ecomApiSync = `apiSync: { googleAds: true, metaAds: true, lastSync: "Bugün 09:14" }`;
const ecomExtra = `,
    teamManagers: [
      { name: "Yiğit K.", role: "Google Ads & SEO", avatar: "https://i.pravatar.cc/150?u=yigit", online: true },
      { name: "Melis S.", role: "Meta Ads & Kreatif", avatar: "https://i.pravatar.cc/150?u=melis", online: false },
      { name: "Selin Y.", role: "Müşteri Başarı Yöneticisi", avatar: "https://i.pravatar.cc/150?u=selin", online: true }
    ],
    nextMonthPlan: [
      { id: 1, task: "Yaz Kampanyası Kreatiflerinin Çıkılması", status: "İşlemde", date: "15 Temmuz", category: "Kreatif" },
      { id: 2, task: "Google PMax Kampanya Optimizasyonu", status: "Bekliyor", date: "22 Temmuz", category: "Ads" },
      { id: 3, task: "Rakip Analizi & SEO Kelime Stratejisi", status: "Planlandı", date: "28 Temmuz", category: "SEO" }
    ],
    tickets: [
      { id: "T-1024", subject: "Meta kampanya bütçe artırımı", status: "Açık", date: "Bugün 10:15", department: "Finans & Bütçe" },
      { id: "T-1018", subject: "Yeni ürün görselleri revizyonu", status: "Çözüldü", date: "Dün 14:30", department: "Kreatif" }
    ]`;
c = c.replace(ecomApiSync, ecomApiSync + ecomExtra);

const b2bApiSync = `apiSync: { googleAds: true, metaAds: false, lastSync: "Dün 18:30" }`;
const b2bExtra = `,
    teamManagers: [
      { name: "Yiğit K.", role: "Google Ads & B2B SEO", avatar: "https://i.pravatar.cc/150?u=yigit", online: true },
      { name: "Selin Y.", role: "Kurumsal Hesap Yöneticisi", avatar: "https://i.pravatar.cc/150?u=selin", online: true }
    ],
    nextMonthPlan: [
      { id: 1, task: "LinkedIn Lead Form Genişletmesi", status: "İşlemde", date: "10 Temmuz", category: "Ads" },
      { id: 2, task: "Kurumsal Lojistik Makalesi Yayını", status: "Bekliyor", date: "18 Temmuz", category: "SEO" }
    ],
    tickets: [
      { id: "T-2041", subject: "Aylık Rapor Sunum Toplantısı", status: "Açık", date: "Bugün 09:00", department: "Hesap Yönetimi" }
    ]`;
c = c.replace(b2bApiSync, b2bApiSync + b2bExtra);

// Add to currentData object
const cdApiSync = `apiSync: rawCurrentBrandData.apiSync || defaultDataForActive.apiSync`;
const cdExtra = `,\n    teamManagers: rawCurrentBrandData.teamManagers || defaultDataForActive.teamManagers,
    nextMonthPlan: rawCurrentBrandData.nextMonthPlan || defaultDataForActive.nextMonthPlan,
    tickets: rawCurrentBrandData.tickets || defaultDataForActive.tickets`;
c = c.replace(cdApiSync, cdApiSync + cdExtra);


// 2. Add Sidebar Tabs
const apiSidebarTab = `<div className={\`client-os-nav-item \${activeTab === 'api' ? 'active' : ''}\`} onClick={() => setActiveTab('api')}>
             <i className="fa-solid fa-plug"></i> API Entegrasyonu
          </div>`;
const extraSidebarTabs = `
          <div className={\`client-os-nav-item \${activeTab === 'strategy' ? 'active' : ''}\`} onClick={() => setActiveTab('strategy')}>
             <i className="fa-solid fa-map"></i> Strateji & Yol Haritası
          </div>
          <div className={\`client-os-nav-item \${activeTab === 'support' ? 'active' : ''}\`} onClick={() => setActiveTab('support')}>
             <i className="fa-solid fa-ticket"></i> Destek Talepleri
          </div>`;
c = c.replace(apiSidebarTab, apiSidebarTab + extraSidebarTabs);


// 3. Render Team Managers inside Overview
const kpiGridStart = `{/* KPI Grid */}`;
const teamManagersUI = `
            {/* Ekibim (Team Managers) */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-users" style={{ fontSize: '1rem' }}></i>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>Hesap Yöneticileriniz</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {currentData.teamManagers.map((member, idx) => (
                  <div key={idx} style={{ 
                    background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem', 
                    display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' 
                  }}>
                    <div style={{ position: 'relative' }}>
                      <img src={member.avatar} alt={member.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ 
                        position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderRadius: '50%', 
                        background: member.online ? '#10b981' : '#64748b', border: '2px solid #1e293b' 
                      }}></div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.1rem' }}>{member.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
`;
c = c.replace(kpiGridStart, teamManagersUI + "\n            " + kpiGridStart);


// 4. Render Strategy and Support tabs at the end before final closing div
const closingDivs = `
      </div>
    </div>
    </div>
  );
}`;
const extraTabsUI = `
        {/* --- TAB: STRATEGY (Yol Haritası) --- */}
        {activeTab === 'strategy' && (
          <div className="tab-content-strategy fade-in">
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-map" style={{ fontSize: '1rem' }}></i>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>Gelecek Ay Planı & Yol Haritası</h3>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '2rem' }}>Önümüzdeki 30 gün içerisinde ekibimizin sizin için planladığı aksiyonlar.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {currentData.nextMonthPlan.map((plan) => (
                  <div key={plan.id} style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', 
                    background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: plan.status === 'İşlemde' ? 'rgba(14, 165, 233, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                        color: plan.status === 'İşlemde' ? '#0ea5e9' : '#94a3b8'
                      }}>
                        <i className={plan.status === 'İşlemde' ? "fa-solid fa-spinner fa-spin" : "fa-regular fa-circle"}></i>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>{plan.task}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{plan.category} - Hedef Tarih: {plan.date}</span>
                      </div>
                    </div>
                    <div style={{ 
                      padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, 
                      background: plan.status === 'İşlemde' ? 'rgba(14, 165, 233, 0.1)' : 'rgba(255,255,255,0.05)', 
                      color: plan.status === 'İşlemde' ? '#0ea5e9' : '#94a3b8' 
                    }}>
                      {plan.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: SUPPORT (Destek Talepleri) --- */}
        {activeTab === 'support' && (
          <div className="tab-content-support fade-in">
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-ticket" style={{ fontSize: '1rem' }}></i>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>Destek Talepleri (Tickets)</h3>
                </div>
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }} onClick={() => alert('Yeni talep açma modülü eklenecek.')}>
                  <i className="fa-solid fa-plus"></i> Yeni Talep
                </button>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Bilet ID</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Konu</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Departman</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Tarih</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textAlign: 'right' }}>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.tickets.map((ticket, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#0ea5e9' }}>{ticket.id}</td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{ticket.subject}</td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>{ticket.department}</td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>{ticket.date}</td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', textAlign: 'right' }}>
                          <span style={{ 
                            padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700,
                            background: ticket.status === 'Açık' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            color: ticket.status === 'Açık' ? '#f59e0b' : '#10b981'
                          }}>
                            {ticket.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
`;
c = c.replace(closingDivs, extraTabsUI + "\n" + closingDivs);

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', c);
