import { useState, useEffect } from 'react';

export default function TicketsTab({
  clientReports, setClientReports, viewingTicket, setViewingTicket, adminReplyText, setAdminReplyText, handleAdminReplySubmit
}) {
  const [allTickets, setAllTickets] = useState([]);

  // Merge tickets from clientReports + localStorage queue
  useEffect(() => {
    const ticketsFromReports = Object.entries(clientReports).flatMap(([brandKey, brandData]) => {
      return (brandData.tickets || []).map((ticket, idx) => ({ ...ticket, brandKey, brandName: brandData.brandName || brandKey, idx, _source: 'reports' }));
    });

    // Read from dedicated localStorage queue
    let queueTickets = [];
    try {
      const raw = localStorage.getItem('client_ticket_queue');
      if (raw) {
        queueTickets = JSON.parse(raw).map((t, idx) => ({ ...t, _source: 'queue', idx }));
      }
    } catch(e) {}

    // Merge by ID (avoid duplicates)
    const existingIds = new Set(ticketsFromReports.map(t => t.id));
    const uniqueQueueTickets = queueTickets.filter(t => !existingIds.has(t.id));
    
    const merged = [...ticketsFromReports, ...uniqueQueueTickets].sort((a, b) => {
      if (a.status === 'Açık' && b.status !== 'Açık') return -1;
      if (b.status === 'Açık' && a.status !== 'Açık') return 1;
      return (b.id || 0) - (a.id || 0);
    });

    setAllTickets(merged);
  }, [clientReports]);

  // Also poll localStorage every 3 seconds to catch new tickets in real time
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const raw = localStorage.getItem('client_ticket_queue');
        if (raw) {
          const queue = JSON.parse(raw);
          if (queue.length > 0) {
            setAllTickets(prev => {
              const existingIds = new Set(prev.map(t => t.id));
              const newTickets = queue.filter(t => !existingIds.has(t.id)).map(t => ({ ...t, _source: 'queue' }));
              if (newTickets.length > 0) {
                return [...newTickets, ...prev];
              }
              return prev;
            });
          }
        }
      } catch(e) {}
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (ticket, newStatus) => {
    if (ticket._source === 'reports' && ticket.brandKey) {
      const updated = { ...clientReports };
      if (updated[ticket.brandKey]?.tickets?.[ticket.idx]) {
        updated[ticket.brandKey].tickets[ticket.idx].status = newStatus;
        setClientReports(updated);
      }
    }
    // Also update in queue
    try {
      const raw = localStorage.getItem('client_ticket_queue');
      if (raw) {
        const queue = JSON.parse(raw);
        const found = queue.find(t => t.id === ticket.id);
        if (found) {
          found.status = newStatus;
          localStorage.setItem('client_ticket_queue', JSON.stringify(queue));
        }
      }
    } catch(e) {}
    setAllTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, status: newStatus } : t));
  };

  const handleDelete = (ticket) => {
    if (!confirm('Bu talebi tamamen silmek istediğinize emin misiniz?')) return;
    if (ticket._source === 'reports' && ticket.brandKey) {
      const updated = { ...clientReports };
      if (updated[ticket.brandKey]?.tickets) {
        updated[ticket.brandKey].tickets.splice(ticket.idx, 1);
        setClientReports(updated);
      }
    }
    try {
      const raw = localStorage.getItem('client_ticket_queue');
      if (raw) {
        const queue = JSON.parse(raw).filter(t => t.id !== ticket.id);
        localStorage.setItem('client_ticket_queue', JSON.stringify(queue));
      }
    } catch(e) {}
    setAllTickets(prev => prev.filter(t => t.id !== ticket.id));
  };

  const openCount = allTickets.filter(t => t.status === 'Açık').length;

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
                  {allTickets.map((ticket, globalIdx) => (
                    <tr key={ticket.id || globalIdx} style={{ borderBottom: '1px solid var(--glass-border)', background: ticket.status === 'Açık' ? 'rgba(239, 68, 68, 0.02)' : 'transparent' }}>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>{ticket.brandName}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>{ticket.id}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ticket.department}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-dark)', fontWeight: 600 }}>{ticket.subject}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ticket.date}</td>
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
                        <button type="button" onClick={() => handleDelete(ticket)} style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
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
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)' }}>{viewingTicket.id} - {viewingTicket.brandName}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{viewingTicket.subject} | {viewingTicket.department}</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: 'var(--bg-light)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                  {(() => {
                    // Try to get latest messages from queue (may have client replies)
                    let msgs = viewingTicket.messages;
                    try {
                      const raw = localStorage.getItem('client_ticket_queue');
                      if (raw) {
                        const queueItem = JSON.parse(raw).find(t => t.id === viewingTicket.id);
                        if (queueItem?.messages?.length) {
                          msgs = queueItem.messages;
                        }
                      }
                    } catch(e) {}
                    if (!msgs || msgs.length === 0) {
                      msgs = [{ sender: 'client', text: viewingTicket.message || 'Bu talep için detaylı mesaj girilmemiş.', date: viewingTicket.date }];
                    }
                    return msgs;
                  })().map((msg, i) => (
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
        
    </>
  );
}
