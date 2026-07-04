import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function AdminSidebar({ activeTab, setActiveTab, unreadLeadsCount, clientReports }) {
  const [openTicketCount, setOpenTicketCount] = useState(0);

  // Fetch initial ticket count and listen for updates
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch('/api/tickets');
        const data = await res.json();
        if (data.success) {
          const count = data.data.filter(t => t.status === 'Açık').length;
          setOpenTicketCount(count);
        }
      } catch (err) {}
    };
    fetchTickets();

    const socket = io();
    socket.on('new_ticket', (ticket) => {
      if (ticket.status === 'Açık') {
        setOpenTicketCount(prev => prev + 1);
      }
    });
    socket.on('ticket_updated', (ticket) => {
      // Re-fetch to be safe on status change
      fetchTickets();
    });

    return () => socket.disconnect();
  }, []);

  return (
    <aside className="admin-sidebar">
      <button className={`admin-nav-btn ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => setActiveTab('leads')}>
        <i className="fa-solid fa-inbox"></i> Gelen Talepler
        {unreadLeadsCount > 0 && <span className="lead-count-badge" style={{
          background: '#ff2a85', color: '#fff', borderRadius: '50%', padding: '2px 8px',
          fontSize: '0.75rem', marginLeft: 'auto', fontWeight: 'bold'
        }}>{unreadLeadsCount}</span>}
      </button>
      <button className={`admin-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
        <i className="fa-solid fa-chart-pie"></i> Analiz & İstatistik
      </button>
      <button className={`admin-nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
        <i className="fa-solid fa-gears"></i> Genel Ayarlar
      </button>
      <button className={`admin-nav-btn ${activeTab === 'landing' ? 'active' : ''}`} onClick={() => setActiveTab('landing')}>
        <i className="fa-solid fa-house-chimney-window"></i> Ana Sayfa İçerikleri
      </button>
      <button className={`admin-nav-btn ${activeTab === 'marketing' ? 'active' : ''}`} onClick={() => setActiveTab('marketing')}>
        <i className="fa-solid fa-bullhorn"></i> Dijital Pazarlama (Pixel/Ads)
      </button>
      <button className={`admin-nav-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
        <i className="fa-solid fa-laptop-code"></i> Hizmetlerimiz
      </button>
      <button className={`admin-nav-btn ${activeTab === 'testimonials' ? 'active' : ''}`} onClick={() => setActiveTab('testimonials')}>
        <i className="fa-solid fa-quote-left"></i> Yorumlar (Referanslar)
      </button>
      <button className={`admin-nav-btn ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
        <i className="fa-solid fa-users"></i> Ekibimiz
      </button>
      <button className={`admin-nav-btn ${activeTab === 'blogs' ? 'active' : ''}`} onClick={() => setActiveTab('blogs')}>
        <i className="fa-solid fa-file-lines"></i> Blog Yazıları
      </button>
      <button className={`admin-nav-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
        <i className="fa-solid fa-chart-line"></i> Müşteri Raporları
      </button>
      <button className={`admin-nav-btn ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}>
        <i className="fa-solid fa-ticket"></i> Müşteri Talepleri
        {openTicketCount > 0 && <span style={{
          background: 'linear-gradient(135deg, #ef4444, #f97316)', color: '#fff', borderRadius: '50%',
          padding: '2px 8px', fontSize: '0.75rem', marginLeft: 'auto', fontWeight: 'bold',
          animation: 'pulse 2s infinite', minWidth: '22px', textAlign: 'center'
        }}>{openTicketCount}</span>}
      </button>


    </aside>
  );
}
