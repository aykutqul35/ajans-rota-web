const fs = require('fs');
let c = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8');

// I will look for a safe insertion point by finding a unique string that is near the end of the modal.
// In the modal, there are two "Değişiklikleri Kaydet" buttons? Actually the whole clientReport edit modal is within `editingReportBrand !== null`.
// Let's find the save button for the modal.
// Wait, the modal is closed with a button somewhere. Let's find the text "Değişiklikleri Kaydet".
// A better way is to do a regex replace that appends to the `metaAds` container.
const anchor = `updated[editingReportBrand].metaAds[idx].roas = e.target.value;
                        setClientReports(updated);
                      }} style={{
                        width: '100%',
                        padding: '0.25rem 0.4rem',
                        borderRadius: '4px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.7rem',
                        background: '#fff',
                        color: 'var(--text-light)'
                      }} />
                          </div>
                        </div>
                      </div>)}
                  </div>
                </div>`;

const newPanels = `
                {/* --- TICKETS --- */}
                <div style={{ marginTop: '2.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--text-dark)' }}><i className="fa-solid fa-ticket" style={{ marginRight: '8px', color: '#ef4444' }}></i> Destek Talepleri (Tickets)</h4>
                    <button type="button" className="btn btn-secondary" onClick={() => {
                      const updated = { ...clientReports };
                      if (!updated[editingReportBrand].tickets) updated[editingReportBrand].tickets = [];
                      updated[editingReportBrand].tickets.unshift({
                        id: "T-" + Math.floor(1000 + Math.random() * 9000),
                        subject: "Yeni Talep",
                        department: "Genel Destek",
                        status: "Açık",
                        date: new Date().toLocaleDateString('tr-TR')
                      });
                      setClientReports(updated);
                    }} style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>
                      <i className="fa-solid fa-plus"></i> Talep Ekle
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {(clientReports[editingReportBrand]?.tickets || []).map((ticket, idx) => (
                      <div key={idx} style={{ background: '#fff', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.75rem', position: 'relative', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => {
                          const updated = { ...clientReports };
                          updated[editingReportBrand].tickets.splice(idx, 1);
                          setClientReports(updated);
                        }} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}><i className="fa-solid fa-trash"></i></button>
                        
                        <input type="text" value={ticket.subject} onChange={e => {
                          const updated = { ...clientReports };
                          updated[editingReportBrand].tickets[idx].subject = e.target.value;
                          setClientReports(updated);
                        }} placeholder="Konu" style={{ flex: 2, padding: '0.35rem', borderRadius: '4px', border: '1px solid var(--glass-border)', fontSize: '0.75rem' }} />
                        
                        <select value={ticket.status} onChange={e => {
                          const updated = { ...clientReports };
                          updated[editingReportBrand].tickets[idx].status = e.target.value;
                          setClientReports(updated);
                        }} style={{ flex: 1, padding: '0.35rem', borderRadius: '4px', border: '1px solid var(--glass-border)', fontSize: '0.75rem' }}>
                          <option value="Açık">Açık</option>
                          <option value="İşlemde">İşlemde</option>
                          <option value="Çözüldü">Çözüldü</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- TEAM MANAGERS --- */}
                <div style={{ marginTop: '2.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--text-dark)' }}><i className="fa-solid fa-users" style={{ marginRight: '8px', color: '#0ea5e9' }}></i> Hesap Yöneticileri (Ekip)</h4>
                    <button type="button" className="btn btn-secondary" onClick={() => {
                      const updated = { ...clientReports };
                      if (!updated[editingReportBrand].teamManagers) updated[editingReportBrand].teamManagers = [];
                      updated[editingReportBrand].teamManagers.push({
                        name: "Yeni Üye", role: "Uzman", avatar: "https://i.pravatar.cc/150", online: true
                      });
                      setClientReports(updated);
                    }} style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>
                      <i className="fa-solid fa-plus"></i> Üye Ekle
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {(clientReports[editingReportBrand]?.teamManagers || []).map((member, idx) => (
                      <div key={idx} style={{ background: '#fff', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.75rem', position: 'relative' }}>
                        <button type="button" onClick={() => {
                          const updated = { ...clientReports };
                          updated[editingReportBrand].teamManagers.splice(idx, 1);
                          setClientReports(updated);
                        }} style={{ position: 'absolute', top: '0.2rem', right: '0.2rem', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}><i className="fa-solid fa-xmark"></i></button>
                        
                        <input type="text" value={member.name} onChange={e => {
                          const updated = { ...clientReports };
                          updated[editingReportBrand].teamManagers[idx].name = e.target.value;
                          setClientReports(updated);
                        }} placeholder="İsim" style={{ width: '100%', marginBottom: '0.5rem', padding: '0.35rem', borderRadius: '4px', border: '1px solid var(--glass-border)', fontSize: '0.75rem' }} />
                        
                        <input type="text" value={member.role} onChange={e => {
                          const updated = { ...clientReports };
                          updated[editingReportBrand].teamManagers[idx].role = e.target.value;
                          setClientReports(updated);
                        }} placeholder="Rol" style={{ width: '100%', padding: '0.35rem', borderRadius: '4px', border: '1px solid var(--glass-border)', fontSize: '0.75rem' }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- ROADMAP / NEXT MONTH PLAN --- */}
                <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--text-dark)' }}><i className="fa-solid fa-map" style={{ marginRight: '8px', color: '#10b981' }}></i> Gelecek Ay Planı (Roadmap)</h4>
                    <button type="button" className="btn btn-secondary" onClick={() => {
                      const updated = { ...clientReports };
                      if (!updated[editingReportBrand].nextMonthPlan) updated[editingReportBrand].nextMonthPlan = [];
                      updated[editingReportBrand].nextMonthPlan.push({
                        id: Math.floor(Math.random() * 10000), task: "Yeni Görev", status: "Bekliyor", date: "15 Ağustos", category: "Ads"
                      });
                      setClientReports(updated);
                    }} style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>
                      <i className="fa-solid fa-plus"></i> Görev Ekle
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {(clientReports[editingReportBrand]?.nextMonthPlan || []).map((plan, idx) => (
                      <div key={idx} style={{ background: '#fff', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.75rem', position: 'relative', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => {
                          const updated = { ...clientReports };
                          updated[editingReportBrand].nextMonthPlan.splice(idx, 1);
                          setClientReports(updated);
                        }} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}><i className="fa-solid fa-trash"></i></button>
                        
                        <input type="text" value={plan.task} onChange={e => {
                          const updated = { ...clientReports };
                          updated[editingReportBrand].nextMonthPlan[idx].task = e.target.value;
                          setClientReports(updated);
                        }} placeholder="Görev Adı" style={{ flex: 2, padding: '0.35rem', borderRadius: '4px', border: '1px solid var(--glass-border)', fontSize: '0.75rem' }} />
                        
                        <select value={plan.status} onChange={e => {
                          const updated = { ...clientReports };
                          updated[editingReportBrand].nextMonthPlan[idx].status = e.target.value;
                          setClientReports(updated);
                        }} style={{ flex: 1, padding: '0.35rem', borderRadius: '4px', border: '1px solid var(--glass-border)', fontSize: '0.75rem' }}>
                          <option value="Bekliyor">Bekliyor</option>
                          <option value="İşlemde">İşlemde</option>
                          <option value="Planlandı">Planlandı</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
`;

if (c.includes(anchor)) {
  c = c.replace(anchor, anchor + "\n" + newPanels);
  fs.writeFileSync('src/pages/AdminDashboardView.jsx', c);
  console.log("Successfully injected new panels into AdminDashboardView.jsx!");
} else {
  console.log("Anchor not found! Falling back to simpler search.");
  // If the exact big anchor fails, search for something simpler
  // "</div>)}\n                  </div>\n                </div>"
}
