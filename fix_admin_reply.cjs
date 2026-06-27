const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8');

const replyFunc = `  const handleAdminReplySubmit = (e) => {
    e.preventDefault();
    if (!adminReplyText.trim()) return;

    const updatedClientReports = { ...clientReports };
    const brandData = updatedClientReports[viewingTicket.brandKey];
    const ticketIdx = brandData.tickets.findIndex(t => t.id === viewingTicket.id);
    
    if (ticketIdx > -1) {
      const ticket = brandData.tickets[ticketIdx];
      // Ensure messages array exists
      if (!ticket.messages) {
        ticket.messages = [{ sender: 'client', text: ticket.message || 'Detaylı mesaj girilmemiş.', date: ticket.date }];
      }
      
      // Add admin reply
      const now = new Date();
      ticket.messages.push({
        sender: 'admin',
        text: adminReplyText.trim(),
        date: now.toLocaleDateString('tr-TR') + " " + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      });
      
      // Update status
      ticket.status = 'Müşteri Yanıtı Bekleniyor';
      
      // Update state & save
      setClientReports(updatedClientReports);
      handleSaveAll(); // Persists to Neon DB
      
      // Update local viewing state
      setViewingTicket({ ...ticket, brandKey: viewingTicket.brandKey });
      setAdminReplyText('');
    }
  };`;

// Delete old handleAdminReplySubmit
const startIndex = code.indexOf("  const handleAdminReplySubmit = (e) => {");
const endIndex = code.indexOf("  const handleSaveAll = async () => {");
if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + code.substring(endIndex);
}

// Insert after handleSaveAll block... wait, handleSaveAll is a very long block!
// Better to just insert it after the end of handleSaveAll
const handleSaveAllStr = "    setIsSaving(false);\n  };";
const saveAllEndIdx = code.indexOf(handleSaveAllStr) + handleSaveAllStr.length;
if (saveAllEndIdx !== -1 + handleSaveAllStr.length) {
  code = code.substring(0, saveAllEndIdx) + "\n\n" + replyFunc + code.substring(saveAllEndIdx);
} else {
  // If not found, just put it anywhere after handleSaveAll
}

// 3. Replace the Modal UI
const oldModal = `{viewingTicket && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)' }}>Talep Detayı: {viewingTicket.id}</h3>
                    <button onClick={() => setViewingTicket(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Müşteri (Marka)</span>
                      <strong style={{ color: 'var(--text-dark)', fontSize: '0.9rem' }}>{viewingTicket.brandName}</strong>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Departman</span>
                        <strong style={{ color: 'var(--text-dark)', fontSize: '0.9rem' }}>{viewingTicket.department}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Tarih</span>
                        <strong style={{ color: 'var(--text-dark)', fontSize: '0.9rem' }}>{viewingTicket.date}</strong>
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Konu</span>
                      <strong style={{ color: 'var(--text-dark)', fontSize: '0.9rem' }}>{viewingTicket.subject}</strong>
                    </div>
                    <div style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Müşterinin Mesajı:</span>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dark)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {viewingTicket.message || 'Bu talep için detaylı mesaj girilmemiş.'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                      <button onClick={() => setViewingTicket(null)} className="btn btn-primary">Kapat</button>
                    </div>
                  </div>
                </div>
              </div>
            )}`;

const newModal = `{viewingTicket && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)' }}>{viewingTicket.id} - {viewingTicket.brandName}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{viewingTicket.subject} | {viewingTicket.department}</span>
                    </div>
                    <button onClick={() => setViewingTicket(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
                  </div>
                  
                  <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {(viewingTicket.messages || [{ sender: 'client', text: viewingTicket.message || 'Bu talep için detaylı mesaj girilmemiş.', date: viewingTicket.date }]).map((msg, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'admin' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ 
                          maxWidth: '80%', 
                          padding: '0.8rem 1rem', 
                          borderRadius: msg.sender === 'admin' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                          background: msg.sender === 'admin' ? 'var(--primary)' : 'var(--bg-light)',
                          color: msg.sender === 'admin' ? '#fff' : 'var(--text-dark)',
                          border: msg.sender === 'admin' ? 'none' : '1px solid var(--glass-border)',
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

                  <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: '1rem' }}>
                    <form onSubmit={handleAdminReplySubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                      <textarea 
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        placeholder="Müşteriye yanıtınızı yazın..."
                        rows="2"
                        required
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', outline: 'none', fontSize: '0.9rem', resize: 'none', fontFamily: 'inherit' }}
                      />
                      <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fa-solid fa-paper-plane"></i> Gönder
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}`;

if (code.includes(oldModal)) {
  code = code.replace(oldModal, newModal);
}

fs.writeFileSync('src/pages/AdminDashboardView.jsx', code);
console.log("Admin Dashboard properly fixed");
