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
    const interval = setInterval(fetchTickets, 15000);
    return () => clearInterval(interval);
  }, []);

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
      const res = await fetch(`/api/tickets?id=${ticket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await res.json();
      if (!res.ok) console.error('[TicketsTab] Status update failed:', result);
      await fetchTickets();
    } catch(err) {
      console.error('[TicketsTab] Status change error:', err);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Bu talep kalıcı olarak silinecek. Emin misiniz?')) return;
    try {
      await fetch(`/api/tickets?id=${ticketId}`, { method: 'DELETE' });
      if (viewingTicket?.id === ticketId) setViewingTicket(null);
      await fetchTickets();
    } catch(err) {
      console.error('[TicketsTab] Delete error:', err);
    }
  };

  const handleAdminReplySubmit = async () => {
    if (!adminReplyText.trim() || !viewingTicket) return;
    try {
      const res = await fetch(`/api/tickets?id=${viewingTicket.id}&action=message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'admin', text: adminReplyText.trim() })
      });
      const result = await res.json();
      if (!res.ok) {
        console.error('[TicketsTab] Message send failed:', result);
        return;
      }
      if (viewingTicket.status === 'Açık') {
        await handleStatusChange(viewingTicket, 'İşlemde');
      }
      setAdminReplyText('');
      await fetchTickets();
    } catch (err) {
      console.error('[TicketsTab] Reply submit error:', err);
    }
  };

  const openCount = allTickets.filter(t => t.status === 'Açık').length;

  const statusClasses = (status) => {
    if (status === 'Açık') return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (status === 'İşlemde') return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
  };

  if (loading) return <div className="p-8 text-center text-text-muted">Yükleniyor...</div>;

  return (
    <>
      <div className="admin-section fade-in">
        {!viewingTicket ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl text-text-light font-heading font-bold flex items-center gap-3">
                Müşteri Destek Talepleri
                {openCount > 0 && (
                  <span className="bg-gradient-to-br from-red-500 to-orange-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full animate-pulse min-w-[22px] text-center">
                    {openCount}
                  </span>
                )}
              </h2>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-glass-border">
                    <th className="p-4 text-text-muted text-sm">Müşteri (Marka)</th>
                    <th className="p-4 text-text-muted text-sm">Bilet ID</th>
                    <th className="p-4 text-text-muted text-sm">Departman</th>
                    <th className="p-4 text-text-muted text-sm">Konu</th>
                    <th className="p-4 text-text-muted text-sm">Tarih</th>
                    <th className="p-4 text-text-muted text-sm text-right">Durum İşlemi</th>
                  </tr>
                </thead>
                <tbody>
                  {allTickets.map((ticket, globalIdx) => {
                    const brandName = ticket.clientId || "Bilinmiyor";
                    const dateStr = ticket.createdAt ? new Date(ticket.createdAt).toLocaleString('tr-TR') : '-';
                    
                    return (
                    <tr key={ticket.id || globalIdx} className={`border-b border-glass-border ${ticket.status === 'Açık' ? 'bg-red-500/[0.02]' : ''}`}>
                      <td className="p-4 text-sm font-semibold text-text-light">{brandName}</td>
                      <td className="p-4 text-sm text-primary font-bold">{ticket.id}</td>
                      <td className="p-4 text-sm text-text-muted">{ticket.department}</td>
                      <td className="p-4 text-sm text-text-light font-semibold">{ticket.subject}</td>
                      <td className="p-4 text-sm text-text-muted">{dateStr}</td>
                      <td className="p-4 text-sm text-right">
                        <button type="button" onClick={() => setViewingTicket(ticket)} className="mr-2.5 px-3 py-1.5 rounded-lg bg-primary text-white border-none cursor-pointer text-xs font-semibold hover:opacity-90 transition-opacity">
                          <i className="fa-solid fa-eye"></i> İncele
                        </button>
                        <select 
                          value={ticket.status} 
                          onChange={(e) => handleStatusChange(ticket, e.target.value)}
                          className={`px-3 py-1.5 rounded-full border text-xs font-bold outline-none cursor-pointer ${statusClasses(ticket.status)}`}
                        >
                          <option value="Açık">Açık</option>
                          <option value="İşlemde">İşlemde</option>
                          <option value="Çözüldü">Çözüldü</option>
                        </select>
                        <button 
                          type="button" 
                          onClick={() => handleDeleteTicket(ticket.id)} 
                          title="Talebi Sil"
                          className="ml-2 px-2 py-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 cursor-pointer text-xs hover:bg-red-500/20 transition-colors"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  )})}
                  {allTickets.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-text-muted">Henüz hiçbir müşteriden destek talebi gelmedi.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-[600px] bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-glass-border pb-4 mb-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setViewingTicket(null)} className="bg-bg-dark border-none text-text-light px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 font-semibold hover:bg-glass-border transition-colors">
                  <i className="fa-solid fa-arrow-left"></i> Geri Dön
                </button>
                <div>
                  <h3 className="m-0 text-xl text-text-light">{viewingTicket.id} - {viewingTicket.client?.brandName || viewingTicket.brandName}</h3>
                  <span className="text-xs text-text-muted">{viewingTicket.subject} | {viewingTicket.department}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-bg-dark rounded-xl flex flex-col gap-4 mb-4">
              {(Array.isArray(viewingTicket.messages) ? viewingTicket.messages : []).map((msg, i) => {
                const dateStr = msg.timestamp ? new Date(msg.timestamp).toLocaleString('tr-TR') : '-';
                return (
                <div key={i} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] px-4 py-3 shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'admin' 
                      ? 'bg-primary text-white rounded-xl rounded-br-none' 
                      : 'bg-white text-text-light border border-glass-border rounded-xl rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[0.7rem] text-text-muted mt-1">
                    {msg.sender === 'admin' ? 'Siz (Yönetici)' : 'Müşteri'} • {dateStr}
                  </span>
                </div>
              )})}
            </div>

            <div className="flex gap-2">
              <input 
                type="text"
                value={adminReplyText}
                onChange={(e) => setAdminReplyText(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter') handleAdminReplySubmit(); }}
                placeholder="Yanıtınızı yazın..."
                className="flex-1 p-4 rounded-xl border border-glass-border bg-white text-text-light outline-none text-[0.95rem] focus:border-primary transition-colors"
              />
              <button onClick={handleAdminReplySubmit} className="btn btn-primary px-8 rounded-xl flex items-center gap-2 font-semibold">
                <i className="fa-solid fa-paper-plane"></i> Gönder
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
