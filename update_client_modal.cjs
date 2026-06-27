const fs = require('fs');
let code = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

// 1. Add states
if (!code.includes("const [viewingTicket, setViewingTicket]")) {
  code = code.replace(
    "const [showTicketModal, setShowTicketModal] = useState(false);",
    "const [showTicketModal, setShowTicketModal] = useState(false);\n  const [viewingTicket, setViewingTicket] = useState(null);\n  const [clientReplyText, setClientReplyText] = useState('');"
  );
}

// 2. Add handleClientReplySubmit
const handleClientReplySubmit = `  const handleClientReplySubmit = async (e) => {
    e.preventDefault();
    if (!clientReplyText.trim()) return;

    const updatedClientReports = { ...clientReports };
    const brandData = updatedClientReports[activeBrand];
    const ticketIdx = brandData.tickets.findIndex(t => t.id === viewingTicket.id);
    
    if (ticketIdx > -1) {
      const ticket = brandData.tickets[ticketIdx];
      // Ensure messages array exists
      if (!ticket.messages) {
        ticket.messages = [{ sender: 'client', text: ticket.message || 'Detaylı mesaj girilmemiş.', date: ticket.date }];
      }
      
      // Add client reply
      const now = new Date();
      ticket.messages.push({
        sender: 'client',
        text: clientReplyText.trim(),
        date: now.toLocaleDateString('tr-TR') + " " + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      });
      
      // Update status
      ticket.status = 'Yanıt Bekliyor';
      
      // Update state
      if (setClientReports) setClientReports(updatedClientReports);
      
      // Save locally
      try {
        const localDbStr = localStorage.getItem('ajans_rota_db');
        if(localDbStr){
           const dbPayload = JSON.parse(localDbStr);
           dbPayload.clientReports = updatedClientReports;
           localStorage.setItem('ajans_rota_db', JSON.stringify(dbPayload));
        }
      } catch(e) {}

      // Push to Neon DB
      const token = localStorage.getItem('client_token');
      if (token && brandData.client_id) {
         fetch('/api/clients/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ client_id: brandData.client_id, report_data: brandData })
         }).catch(e => console.error("Ticket reply sync error:", e));
      }

      setViewingTicket({ ...ticket });
      setClientReplyText('');
    }
  };`;

if (!code.includes("const handleClientReplySubmit")) {
  code = code.replace(
    "const handleCreateTicket = async (e) => {",
    handleClientReplySubmit + "\n\n  const handleCreateTicket = async (e) => {"
  );
}

// 3. Update table to include İncele button
const oldTableHeader = `<th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textAlign: 'right' }}>Durum</th>
                    </tr>`;
const newTableHeader = `<th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textAlign: 'right' }}>Durum</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textAlign: 'right' }}>İşlem</th>
                    </tr>`;
if (code.includes(oldTableHeader)) {
  code = code.replace(oldTableHeader, newTableHeader);
}

const oldTableRowEnd = `<span style={{ 
                            padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700,
                            background: ticket.status === 'Açık' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            color: ticket.status === 'Açık' ? '#f59e0b' : '#10b981'
                          }}>
                            {ticket.status}
                          </span>
                        </td>
                      </tr>`;
const newTableRowEnd = `<span style={{ 
                            padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700,
                            background: ticket.status === 'Müşteri Yanıtı Bekleniyor' ? 'rgba(239, 68, 68, 0.1)' : ticket.status === 'Yanıt Bekliyor' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            color: ticket.status === 'Müşteri Yanıtı Bekleniyor' ? '#ef4444' : ticket.status === 'Yanıt Bekliyor' ? '#f59e0b' : '#10b981'
                          }}>
                            {ticket.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.9rem 0.5rem', textAlign: 'right' }}>
                          <button type="button" onClick={() => setViewingTicket(ticket)} style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                            <i className="fa-solid fa-eye"></i> İncele
                          </button>
                        </td>
                      </tr>`;

if (code.includes(oldTableRowEnd)) {
  code = code.replace(oldTableRowEnd, newTableRowEnd);
}

// 4. Add the Chat Modal
const chatModalUI = `{/* Chat / Viewing Ticket Modal */}
        {viewingTicket && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '600px',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', paddingBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>{viewingTicket.id}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{viewingTicket.subject} | {viewingTicket.department}</span>
                </div>
                <button onClick={() => setViewingTicket(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', paddingTop: '1rem' }}>
                <form onSubmit={handleClientReplySubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                  <textarea 
                    value={clientReplyText}
                    onChange={(e) => setClientReplyText(e.target.value)}
                    placeholder="Yanıtınızı yazın..."
                    rows="2"
                    required
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#f8fafc', outline: 'none', fontSize: '0.9rem', resize: 'none', fontFamily: 'inherit' }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-paper-plane"></i> Gönder
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}`;

if (!code.includes("Chat / Viewing Ticket Modal")) {
  const insertIndex = code.indexOf("{showTicketModal && (");
  if (insertIndex !== -1) {
    const before = code.substring(0, insertIndex);
    const after = code.substring(insertIndex);
    code = before + chatModalUI + "\n\n        " + after;
  }
}

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', code);
console.log("Client Transparency Page Ticket Chat Modal added");
