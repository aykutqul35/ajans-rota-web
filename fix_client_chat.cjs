const fs = require('fs');
let code = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

// The original table block is:
// <div style={{ overflowX: 'auto' }}>
//   <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
// ...
//   </table>
// </div>

// The original chat modal block is:
// {viewingTicket && (
//   <div style={{ position: 'fixed', ...

// Let's replace the whole support tab content inside the card with a conditional render:
const supportStart = `        {activeTab === 'support' && (
          <div className="tab-content-support fade-in">
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-ticket" style={{ fontSize: '1rem' }}></i>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>Destek Talepleri (Tickets)</h3>
                </div>
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }} onClick={() => setShowTicketModal(true)}>
                  <i className="fa-solid fa-plus"></i> Yeni Talep
                </button>
              </div>`;

const supportNew = `        {activeTab === 'support' && (
          <div className="tab-content-support fade-in">
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              {!viewingTicket ? (
                <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-ticket" style={{ fontSize: '1rem' }}></i>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>Destek Talepleri (Tickets)</h3>
                </div>
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }} onClick={() => setShowTicketModal(true)}>
                  <i className="fa-solid fa-plus"></i> Yeni Talep
                </button>
              </div>`;

if (code.includes(supportStart)) {
  code = code.replace(supportStart, supportNew);
} else {
  console.log("Could not find supportStart");
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
                <div style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button onClick={() => setViewingTicket(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-arrow-left"></i> Geri Dön
                      </button>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>{viewingTicket.id}</h3>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{viewingTicket.subject} | {viewingTicket.department}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: '#0f172a', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                    {(viewingTicket.messages || [{ sender: 'client', text: viewingTicket.message || 'Bu talep için detaylı mesaj girilmemiş.', date: viewingTicket.date }]).map((msg, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'client' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ 
                          maxWidth: '80%', 
                          padding: '0.8rem 1rem', 
                          borderRadius: msg.sender === 'client' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                          background: msg.sender === 'client' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                          color: msg.sender === 'client' ? '#fff' : '#f8fafc',
                          border: msg.sender === 'client' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                          fontSize: '0.9rem',
                          lineHeight: 1.5,
                          whiteSpace: 'pre-wrap'
                        }}>
                          {msg.text}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                          {msg.sender === 'client' ? 'Siz' : 'Yönetici'} • {msg.date}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text"
                      value={clientReplyText}
                      onChange={(e) => setClientReplyText(e.target.value)}
                      onKeyDown={(e) => { if(e.key === 'Enter') handleClientReplySubmit(e); }}
                      placeholder="Mesajınızı yazın..."
                      style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#f8fafc', outline: 'none', fontSize: '0.95rem' }}
                    />
                    <button onClick={handleClientReplySubmit} className="btn btn-primary" style={{ padding: '0 2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                      <i className="fa-solid fa-paper-plane"></i> Gönder
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}`;

if (code.includes(tableEnd)) {
  code = code.replace(tableEnd, tableEndNew);
} else {
  console.log("Could not find tableEnd");
}

// Remove the old viewingTicket modal from the bottom
const modalRegex = /\{\/\* Chat \/ Viewing Ticket Modal \*\/\}\s*\{viewingTicket && \([\s\S]*?(?=\{\/\* Ticket Creation Modal \*\/\})/g;
code = code.replace(modalRegex, '');
// Wait, the old ticket modal is actually named "Ticket Creation Modal" first? Let's check the order in the file.
// The order was:
// {/* Ticket Creation Modal */}
// {/* Chat / Viewing Ticket Modal */}
// {viewingTicket && (
// Let's remove viewingTicket && (... up to the next {showTicketModal
const modalRegex2 = /\{\/\* Chat \/ Viewing Ticket Modal \*\/\}\s*\{viewingTicket && \([\s\S]*?(?=\{\s*showTicketModal && \()/;
code = code.replace(modalRegex2, '');

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', code);
console.log("Client chat modal integrated inline.");
