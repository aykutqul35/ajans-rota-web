import { useState, useEffect, useRef } from 'react';

export default function TicketsTab() {
  const [allTickets, setAllTickets] = useState([]);
  const [viewingTicket, setViewingTicket] = useState(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      if (data.success) {
        setAllTickets(data.data);
      }
    } catch (err) {
      console.error("Error fetching tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 15000); // Poll every 15 seconds
    return () => clearInterval(interval);
  }, []);

  // Keep viewing ticket synced with fresh data
  useEffect(() => {
    if (viewingTicket && allTickets.length > 0) {
      const updated = allTickets.find(t => t.id === viewingTicket.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(viewingTicket)) {
        setViewingTicket(updated);
      }
    }
  }, [allTickets]);

  const handleStatusChange = async (ticket, newStatus) => {
    try {
      const res = await fetch(`/api/tickets/${ticket.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await res.json();
      console.log('[TicketsTab] Status update result:', result);
      if (!res.ok) console.error('[TicketsTab] Status update failed:', result);
      await fetchTickets(); // Refresh immediately after update
    } catch(err) {
      console.error('[TicketsTab] Status change error:', err);
    }
  };

  const handleAdminReplySubmit = async () => {
    if (!adminReplyText.trim() || !viewingTicket) return;
    try {
      const res = await fetch(`/api/tickets/${viewingTicket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'admin', text: adminReplyText.trim() })
      });
      const result = await res.json();
      console.log('[TicketsTab] Message send result:', result);
      if (!res.ok) {
        console.error('[TicketsTab] Message send failed:', result);
        return;
      }
      // also update ticket status to "İşlemde" if still open
      if (viewingTicket.status === 'Açık') {
        await handleStatusChange(viewingTicket, 'İşlemde');
      }
      setAdminReplyText('');
      await fetchTickets(); // Refresh
    } catch (err) {
      console.error('[TicketsTab] Reply submit error:', err);
    }
  };

  const openCount = allTickets.filter(t => t.status === 'Açık').length;

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <>
      <div className="admin-section fade-in">
        {!viewingTicket ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                Müşteri Destek Talepleri
                {openCount > 0 && (
                  <span style={{ 
                    background: 'linear-gradient(135deg, #ef4444, #f97316)', 
                    color: '#fff', 
                    fontSize: '0.75rem', 
                    fontWeight: 800, 
                    padding: '0.25rem 0.6rem', 
                    borderRadius: '20px',
                    animation: 'pulse 2s infinite',
                    minWidth: '22px',
                    textAlign: 'center'
                  }}>
                    {openCount}
                  </span>
                )}
              </h2>
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
                  {allTickets.map((ticket, globalIdx) => {
                    const brandName = ticket.clientId || "Bilinmiyor";
                    const dateStr = ticket.createdAt ? new Date(ticket.createdAt).toLocaleString('tr-TR') : '-';
                    
                    return (
                    <tr key={ticket.id || globalIdx} style={{ borderBottom: '1px solid var(--glass-border)', background: ticket.status === 'Açık' ? 'rgba(239, 68, 68, 0.02)' : 'transparent' }}>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>{brandName}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>{ticket.id}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ticket.department}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-dark)', fontWeight: 600 }}>{ticket.subject}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{dateStr}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', textAlign: 'right' }}>
                        <button type="button" onClick={() => setViewingTicket(ticket)} style={{ marginRight: '10px', padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                          <i className="fa-solid fa-eye"></i> İncele
                        </button>
                        <select 
                          value={ticket.status} 
                          onChange={(e) => handleStatusChange(ticket, e.target.value)}
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
                      </td>
                    </tr>
                  )})}
                  {allTickets.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Henüz hiçbir müşteriden destek talebi gelmedi.</td>
                    </tr>
                  )}
                </tbody>
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
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)' }}>{viewingTicket.id} - {viewingTicket.client?.brandName || viewingTicket.brandName}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{viewingTicket.subject} | {viewingTicket.department}</span>
                </div>
              </div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: 'var(--bg-light)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
              {(Array.isArray(viewingTicket.messages) ? viewingTicket.messages : []).map((msg, i) => {
                const dateStr = msg.timestamp ? new Date(msg.timestamp).toLocaleString('tr-TR') : '-';
                return (
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
                    {msg.sender === 'admin' ? 'Siz (Yönetici)' : 'Müşteri'} • {dateStr}
                  </span>
                </div>
              )})}
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
    </>
  );
}
