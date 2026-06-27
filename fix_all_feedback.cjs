const fs = require('fs');

// --- 1. Client Transparency Page Fixes ---
let clientCode = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

// Fix the React state update when ticket is created
const ticketSubmitEndRegex = /localStorage\.setItem\('clientReports', JSON\.stringify\(currentReports\)\);/;
clientCode = clientCode.replace(
  ticketSubmitEndRegex,
  "localStorage.setItem('clientReports', JSON.stringify(currentReports));\n      setClientReports(currentReports);"
);

// Add fallback text if teamManagers is empty
const teamManagersRegex = /\{currentData\.teamManagers\.map\(\(member, idx\) => \(/;
clientCode = clientCode.replace(
  teamManagersRegex,
  `{(!currentData.teamManagers || currentData.teamManagers.length === 0) && (
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>Atanmış hesap yöneticisi bulunamadı.</div>
                )}
                {(currentData.teamManagers || []).map((member, idx) => (`
);

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', clientCode);
console.log("Fixed Client Portal");


// --- 2. Admin Dashboard View Fixes ---
let adminCode = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8');

// The agency team list
const teamManagersBlockRegex = /\{\/\* --- TEAM MANAGERS --- \*\/\}([\s\S]*?)\{\/\* --- ROADMAP \/ NEXT MONTH PLAN --- \*\/\}/;

if(teamManagersBlockRegex.test(adminCode)) {
  const newTeamManagersBlock = `{/* --- TEAM MANAGERS --- */}
                <div style={{ marginTop: '2.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--text-dark)' }}><i className="fa-solid fa-users" style={{ marginRight: '8px', color: '#0ea5e9' }}></i> Hesap Yöneticileri (Ekip)</h4>
                    <button type="button" className="btn btn-secondary" onClick={() => {
                      const updated = { ...clientReports };
                      if (!updated[editingReportBrand].teamManagers) updated[editingReportBrand].teamManagers = [];
                      updated[editingReportBrand].teamManagers.push({
                        name: "Aykut K.", role: "Ajans Başkanı", avatar: "https://i.pravatar.cc/150?u=aykut", online: true
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
                        
                        <select 
                          value={member.name}
                          onChange={(e) => {
                            const agencyTeam = [
                              { name: "Aykut K.", role: "Ajans Başkanı", avatar: "https://i.pravatar.cc/150?u=aykut" },
                              { name: "Yiğit K.", role: "Google Ads & SEO", avatar: "https://i.pravatar.cc/150?u=yigit" },
                              { name: "Melis S.", role: "Meta Ads & Kreatif", avatar: "https://i.pravatar.cc/150?u=melis" },
                              { name: "Selin Y.", role: "Müşteri Başarı Yöneticisi", avatar: "https://i.pravatar.cc/150?u=selin" },
                              { name: "Büşra T.", role: "Sosyal Medya", avatar: "https://i.pravatar.cc/150?u=busra" },
                              { name: "Kemal D.", role: "Yazılım Uzmanı", avatar: "https://i.pravatar.cc/150?u=kemal" }
                            ];
                            const selectedName = e.target.value;
                            const found = agencyTeam.find(t => t.name === selectedName) || { role: "", avatar: "https://i.pravatar.cc/150" };
                            
                            const updated = { ...clientReports };
                            updated[editingReportBrand].teamManagers[idx].name = selectedName;
                            updated[editingReportBrand].teamManagers[idx].role = found.role;
                            updated[editingReportBrand].teamManagers[idx].avatar = found.avatar;
                            setClientReports(updated);
                          }}
                          style={{ width: '100%', marginBottom: '0.5rem', padding: '0.35rem', borderRadius: '4px', border: '1px solid var(--glass-border)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)' }}
                        >
                          <option value="Aykut K.">Aykut K.</option>
                          <option value="Yiğit K.">Yiğit K.</option>
                          <option value="Melis S.">Melis S.</option>
                          <option value="Selin Y.">Selin Y.</option>
                          <option value="Büşra T.">Büşra T.</option>
                          <option value="Kemal D.">Kemal D.</option>
                        </select>
                        
                        <input type="text" value={member.role} onChange={e => {
                          const updated = { ...clientReports };
                          updated[editingReportBrand].teamManagers[idx].role = e.target.value;
                          setClientReports(updated);
                        }} placeholder="Rol" style={{ width: '100%', padding: '0.35rem', borderRadius: '4px', border: '1px solid var(--glass-border)', fontSize: '0.75rem' }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- ROADMAP / NEXT MONTH PLAN --- */}`;
  
  adminCode = adminCode.replace(teamManagersBlockRegex, newTeamManagersBlock);
  fs.writeFileSync('src/pages/AdminDashboardView.jsx', adminCode);
  console.log("Fixed Admin Dashboard Team Managers");
} else {
  console.log("FAILED to find team managers block in admin code");
}

