const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8');

const tableStart = `        {activeTab === 'tickets' && (
          <div className="admin-section fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)' }}>Müşteri Destek Talepleri</h2>
            </div>`;

const tableStartNew = `        {activeTab === 'tickets' && (
          <div className="admin-section fade-in">
            {!viewingTicket ? (
            <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)' }}>Müşteri Destek Talepleri</h2>
            </div>`;

if (code.includes(tableStart)) {
  code = code.replace(tableStart, tableStartNew);
} else {
  console.log("Could not find tableStart in Admin");
}

const tableEnd = `                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}`;

const tableEndNew = `                  </tbody>
                </table>
              </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '600px', background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => setViewingTicket(null)} style={{ background: 'var(--bg-light)', border: 'none', color: 'var(--text-dark)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                      <i className="fa-solid fa-arrow-left"></i> Geri Dön
                    </button>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)' }}>{viewingTicket.id} - {viewingTicket.brandName}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{viewingTicket.subject} | {viewingTicket.department}</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: 'var(--bg-light)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                  {(viewingTicket.messages || [{ sender: 'client', text: viewingTicket.message || 'Bu talep için detaylı mesaj girilmemiş.', date: viewingTicket.date }]).map((msg, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'admin' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ 
                        maxWidth: '80%', 
                        padding: '0.8rem 1rem', 
                        borderRadius: msg.sender === 'admin' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                        background: msg.sender === 'admin' ? 'var(--primary)' : '#fff',
                        color: msg.sender === 'admin' ? '#fff' : 'var(--text-dark)',
                        border: msg.sender === 'admin' ? 'none' : '1px solid var(--glass-border)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap'
                      }}>
                        {msg.text}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {msg.sender === 'admin' ? 'Siz (Yönetici)' : 'Müşteri'} • {msg.date}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text"
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter') handleAdminReplySubmit(); }}
                    placeholder="Yanıtınızı yazın..."
                    style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: '#fff', color: 'var(--text-dark)', outline: 'none', fontSize: '0.95rem' }}
                  />
                  <button onClick={handleAdminReplySubmit} className="btn btn-primary" style={{ padding: '0 2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <i className="fa-solid fa-paper-plane"></i> Gönder
                  </button>
                </div>
              </div>
            )}
          </div>
        )}`;

if (code.includes(tableEnd)) {
  code = code.replace(tableEnd, tableEndNew);
} else {
  console.log("Could not find tableEnd in Admin");
}

// Remove the old viewingTicket modal from the bottom
const modalRegex = /\{\/\* Chat \/ Ticket Modal \*\/\}\s*\{viewingTicket && \([\s\S]*?(?=\{\/\* Admin Edit Modal \*\/\})/g;
code = code.replace(modalRegex, '{/* Chat inline rendered above */}\n            ');

fs.writeFileSync('src/pages/AdminDashboardView.jsx', code);
console.log("Admin chat modal integrated inline.");
