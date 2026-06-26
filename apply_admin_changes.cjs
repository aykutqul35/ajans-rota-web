const fs = require('fs');
let c = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8');

// 1. State
c = c.replace(
  "const [securityNewPassword, setSecurityNewPassword] = useState('');",
  "const [securityNewPassword, setSecurityNewPassword] = useState('');\n  const [webhookUrl, setWebhookUrl] = useState(localStorage.getItem('rota_webhook_url') || '');"
);

// 2. Settings Accordion
const settingsHeader = `                {/* ── ACCORDION: Güvenlik ve Hesap Bilgileri ── */}`;
const webhookAccordion = `                {/* ── ACCORDION: Webhook ve Bildirimler ── */}
                <div style={{ marginBottom: '0.75rem', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.2)', transition: 'box-shadow 0.2s' }}>
                  <button type="button" onClick={() => toggleSettingsSection('webhook')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: settingsAccordion.webhook ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-dark)' }}>
                      <i className="fa-brands fa-discord" style={{ color: '#5865F2', fontSize: '1.05rem' }}></i>
                      SaaS Bildirim Ayarları (Webhook)
                    </span>
                    <i className={\`fa-solid \${settingsAccordion.webhook ? 'fa-chevron-up' : 'fa-chevron-down'}\`} style={{ color: 'var(--primary)', fontSize: '0.85rem' }}></i>
                  </button>
                  {settingsAccordion.webhook && (
                    <div style={{ padding: '1.5rem', background: '#fff' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                          Müşterileriniz kreatifleri onayladığında veya faturalarını ödediğinde anında bildirim almak için Discord veya Slack Webhook URL'nizi buraya girin.
                        </p>
                        
                        <div className="admin-form-group">
                          <label>Webhook URL (Discord / Slack)</label>
                          <input 
                            type="text" 
                            value={webhookUrl} 
                            onChange={e => {
                               setWebhookUrl(e.target.value);
                               localStorage.setItem('rota_webhook_url', e.target.value);
                            }} 
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} 
                            placeholder="https://discord.com/api/webhooks/..." 
                          />
                        </div>
                    </div>
                  )}
                </div>
                
`;
c = c.replace(settingsHeader, webhookAccordion + settingsHeader);

// 3. AI Requests and Invoices in Clients Tab
const targetCreativeDiv = `                <div style={{
                  border: '1px solid rgba(15, 23, 42, 0.05)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.01)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                      Müşteri Onayına Sunulacak Kreatifler`;

const injectedCode = `                {/* --- SaaS: AI TALEPLERİ --- */}
                <div style={{ border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.25rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.02)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                      <i className="fa-solid fa-robot" style={{color: '#10b981', marginRight: '6px'}}></i> Müşteri AI Aksiyon Talepleri
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {clientReports[editingReportBrand]?.ai_requests?.filter(r => r.status === 'pending').map((req, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.1)' }}>
                        <div>
                          <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{req.date}</div>
                          <div style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)'}}>{req.insight}</div>
                        </div>
                        <button className="btn btn-primary" style={{padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: '#10b981', borderColor: '#10b981'}} onClick={async () => {
                          const updated = {...clientReports};
                          const requestIndex = updated[editingReportBrand].ai_requests.findIndex(r => r.id === req.id);
                          if(requestIndex > -1) {
                            updated[editingReportBrand].ai_requests[requestIndex].status = 'completed';
                            setClientReports(updated);
                            if(updated[editingReportBrand].client_id) {
                              await fetch('/api/clients/update', { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ client_id: updated[editingReportBrand].client_id, report_data: updated[editingReportBrand] }) });
                            }
                            alert('Talep tamamlandı olarak işaretlendi!');
                          }
                        }}><i className="fa-solid fa-check"></i> Tamamla</button>
                      </div>
                    )) || <div style={{fontSize: '0.8rem', color: 'var(--text-light)'}}>Bekleyen talep yok.</div>}
                  </div>
                </div>

                {/* --- SaaS: FATURALAR --- */}
                <div style={{ border: '1px solid rgba(99, 102, 241, 0.2)', padding: '1.25rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.02)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                      <i className="fa-solid fa-file-invoice-dollar" style={{color: 'var(--primary)', marginRight: '6px'}}></i> Müşteri Faturaları (Stripe)
                    </span>
                    <button type="button" className="btn btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }} onClick={async () => {
                      const amount = window.prompt("Fatura Tutarı (Örn: 25.000 TL):");
                      const title = window.prompt("Fatura Açıklaması (Örn: Temmuz Reklam Bütçesi):");
                      if(amount && title) {
                         const updated = {...clientReports};
                         if(!updated[editingReportBrand].invoices) updated[editingReportBrand].invoices = [];
                         updated[editingReportBrand].invoices.push({
                           id: Date.now(),
                           title: title,
                           amount: amount,
                           status: 'pending',
                           date: new Date().toLocaleDateString('tr-TR')
                         });
                         setClientReports(updated);
                         if(updated[editingReportBrand].client_id) {
                            await fetch('/api/clients/update', { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ client_id: updated[editingReportBrand].client_id, report_data: updated[editingReportBrand] }) });
                         }
                      }
                    }}>
                      <i className="fa-solid fa-plus"></i> Fatura Kes
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {clientReports[editingReportBrand]?.invoices?.map((inv, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.05)' }}>
                        <div>
                          <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{inv.date}</div>
                          <div style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)'}}>{inv.title} <span style={{color:'var(--primary)'}}>({inv.amount})</span></div>
                        </div>
                        <span style={{fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', background: inv.status === 'paid' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: inv.status === 'paid' ? '#10b981' : '#ef4444'}}>
                           {inv.status === 'paid' ? 'Ödendi' : 'Bekliyor'}
                        </span>
                      </div>
                    )) || <div style={{fontSize: '0.8rem', color: 'var(--text-light)'}}>Fatura bulunamadı.</div>}
                  </div>
                </div>

`;

c = c.replace(targetCreativeDiv, injectedCode + targetCreativeDiv);

fs.writeFileSync('src/pages/AdminDashboardView.jsx', c);
console.log('Successfully updated AdminDashboardView.jsx!');
