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

  const navBtnCls = (tabId) => `flex items-center gap-3 w-full py-3 px-4 rounded-xl text-[13px] font-bold border-none transition-all cursor-pointer ${activeTab === tabId ? 'bg-primary text-white shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 'bg-transparent text-textMuted hover:bg-white/5 hover:text-textLight'}`;

  return (
    <aside className="w-full lg:w-[280px] bg-white/2 border-r border-glass p-5 flex flex-col gap-2 overflow-y-auto h-[calc(100vh-80px)] sticky top-[80px]">
      <button className={navBtnCls('leads')} onClick={() => setActiveTab('leads')}>
        <i className="fa-solid fa-inbox text-lg w-5 text-center"></i> Gelen Talepler
        {unreadLeadsCount > 0 && <span className="bg-rose-500 text-white rounded-full px-2 py-0.5 text-[10px] ml-auto font-bold min-w-[20px] text-center shadow-[0_0_10px_rgba(244,63,94,0.5)]">{unreadLeadsCount}</span>}
      </button>
      <button className={navBtnCls('analytics')} onClick={() => setActiveTab('analytics')}>
        <i className="fa-solid fa-chart-pie text-lg w-5 text-center"></i> Analiz & İstatistik
      </button>
      <button className={navBtnCls('settings')} onClick={() => setActiveTab('settings')}>
        <i className="fa-solid fa-gears text-lg w-5 text-center"></i> Genel Ayarlar
      </button>
      <button className={navBtnCls('landing')} onClick={() => setActiveTab('landing')}>
        <i className="fa-solid fa-house-chimney-window text-lg w-5 text-center"></i> Ana Sayfa İçerikleri
      </button>
      <button className={navBtnCls('marketing')} onClick={() => setActiveTab('marketing')}>
        <i className="fa-solid fa-bullhorn text-lg w-5 text-center"></i> Dijital Pazarlama (Pixel/Ads)
      </button>
      <button className={navBtnCls('services')} onClick={() => setActiveTab('services')}>
        <i className="fa-solid fa-laptop-code text-lg w-5 text-center"></i> Hizmetlerimiz
      </button>
      <button className={navBtnCls('testimonials')} onClick={() => setActiveTab('testimonials')}>
        <i className="fa-solid fa-quote-left text-lg w-5 text-center"></i> Yorumlar (Referanslar)
      </button>
      <button className={navBtnCls('academy')} onClick={() => setActiveTab('academy')}>
        <i className="fa-solid fa-graduation-cap text-lg w-5 text-center"></i> Akademi Eğitimleri
      </button>
      <button className={navBtnCls('team')} onClick={() => setActiveTab('team')}>
        <i className="fa-solid fa-users text-lg w-5 text-center"></i> Blog Yazarları
      </button>
      <button className={navBtnCls('blogs')} onClick={() => setActiveTab('blogs')}>
        <i className="fa-solid fa-file-lines text-lg w-5 text-center"></i> Blog Yazıları
      </button>
      <button className={navBtnCls('reports')} onClick={() => setActiveTab('reports')}>
        <i className="fa-solid fa-chart-line text-lg w-5 text-center"></i> Müşteri Raporları
      </button>
      <button className={navBtnCls('aiengine')} onClick={() => setActiveTab('aiengine')}>
        <i className="fa-solid fa-microchip text-lg w-5 text-center"></i> ROTA AI Motoru
      </button>
      <button className={navBtnCls('tickets')} onClick={() => setActiveTab('tickets')}>
        <i className="fa-solid fa-ticket text-lg w-5 text-center"></i> Müşteri Talepleri
        {openTicketCount > 0 && <span className="bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-full px-2 py-0.5 text-[10px] ml-auto font-bold animate-pulse min-w-[22px] text-center">{openTicketCount}</span>}
      </button>
    </aside>
  );
}
