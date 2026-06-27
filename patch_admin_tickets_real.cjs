const fs = require('fs');
let c = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8');

const navAnchor = "onClick={() => setActiveTab('reports')}>\n            <i className=\"fa-solid fa-chart-line\"></i> Müşteri Raporları\n          </button>";

const newNavButton = `
          <button className={\`admin-nav-btn \${activeTab === 'tickets' ? 'active' : ''}\`} onClick={() => setActiveTab('tickets')}>
            <i className="fa-solid fa-ticket"></i> Müşteri Talepleri
          </button>`;

if (c.includes(navAnchor)) {
  c = c.replace(navAnchor, navAnchor + newNavButton);
  console.log("Added tickets nav button successfully!");
} else {
  console.log("FAILED to find nav anchor");
}

const viewAnchor = "{activeTab === 'reports' && (";
const ticketsView = `
        {activeTab === 'tickets' && (
          <div className="admin-section fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)' }}>Müşteri Destek Talepleri</h2>
            </div>
            
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Müşteri (Marka)</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Bilet ID</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Departman</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Konu</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tarih</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'right' }}>Durum İşlemi</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(clientReports).flatMap(([brandKey, brandData]) => {
                    return (brandData.tickets || []).map((ticket, idx) => ({ ...ticket, brandKey, brandName: brandData.brandName || brandKey, idx }));
                  }).sort((a,b) => {
                     if (a.status === 'Açık' && b.status !== 'Açık') return -1;
                     if (b.status === 'Açık' && a.status !== 'Açık') return 1;
                     return 0;
                  }).map((ticket, globalIdx) => (
                    <tr key={globalIdx} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>{ticket.brandName}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>{ticket.id}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ticket.department}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-dark)', fontWeight: 600 }}>{ticket.subject}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ticket.date}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', textAlign: 'right' }}>
                        <select 
                          value={ticket.status} 
                          onChange={(e) => {
                            const updated = { ...clientReports };
                            updated[ticket.brandKey].tickets[ticket.idx].status = e.target.value;
                            setClientReports(updated);
                          }}
                          style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: '20px',
                            border: '1px solid var(--glass-border)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            outline: 'none',
                            cursor: 'pointer',
                            background: ticket.status === 'Açık' ? 'rgba(239, 68, 68, 0.1)' : 
                                       ticket.status === 'İşlemde' ? 'rgba(245, 158, 11, 0.1)' : 
                                       'rgba(16, 185, 129, 0.1)',
                            color: ticket.status === 'Açık' ? '#ef4444' : 
                                   ticket.status === 'İşlemde' ? '#f59e0b' : 
                                   '#10b981'
                          }}
                        >
                          <option value="Açık">Açık</option>
                          <option value="İşlemde">İşlemde</option>
                          <option value="Çözüldü">Çözüldü</option>
                        </select>
                        <button type="button" onClick={() => {
                          if(!confirm('Bu talebi tamamen silmek istediğinize emin misiniz?')) return;
                          const updated = { ...clientReports };
                          updated[ticket.brandKey].tickets.splice(ticket.idx, 1);
                          setClientReports(updated);
                        }} style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {Object.entries(clientReports).flatMap(([k, v]) => v.tickets || []).length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Henüz hiçbir müşteriden destek talebi gelmedi.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
`;

if (c.includes(viewAnchor)) {
  c = c.replace(viewAnchor, ticketsView + "\n" + viewAnchor);
  console.log("Added tickets view block successfully!");
} else {
  console.log("FAILED to find view anchor");
}

fs.writeFileSync('src/pages/AdminDashboardView.jsx', c);
