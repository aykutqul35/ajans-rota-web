import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function WhatsAppAssistantWidget({
  settingsData,
  onSaveLead,
  logHit
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCapturedLead, setHasCapturedLead] = useState(false);
  const chatBodyRef = useRef(null);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      const currentHour = new Date().getHours();
      const isNight = currentHour >= 19 || currentHour < 8;
      const greeting = isNight
        ? "Merhaba! 👋 Ben Ajans Rota'nın Yapay Zeka Asistanıyım. Ekibimiz şu an dinleniyor ancak ben buradayım. İşletmenizi büyütmek için nasıl yardımcı olabilirim?"
        : "Merhaba! 👋 Ben Ajans Rota'nın Yapay Zeka Asistanıyım. Markanızı dijitalde büyütmek için uzman ekibimize ulaşmadan önce size nasıl yardımcı olabilirim?";
      
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const detectAndSaveLead = async (text) => {
    // Basit bir regex ile telefon numarası veya e-posta arama
    const phoneRegex = /(?:0|90|\+90)?\s?5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}/g;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    
    const foundPhones = text.match(phoneRegex);
    const foundEmails = text.match(emailRegex);

    if ((foundPhones || foundEmails) && !hasCapturedLead) {
      setHasCapturedLead(true);
      const leadPayload = {
        fullName: 'AI Sohbet Ziyaretçisi',
        email: foundEmails ? foundEmails[0] : 'ai-chat@ajansrota.com',
        phone: foundPhones ? foundPhones[0] : '',
        company: 'Belirtilmedi',
        service: 'Yapay Zeka Asistanı Üzerinden İletişim',
        message: `Sohbet Geçmişi:\n${messages.map(m => `${m.role === 'user' ? 'Müşteri' : 'AI'}: ${m.content}`).join('\n')}\n\nSon Mesaj: ${text}`,
        trafficSource: 'AI WhatsApp Botu'
      };

      if (typeof onSaveLead === 'function') {
        onSaveLead(leadPayload);
      }
      
      try {
        await fetch('/api.php?action=save_lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadPayload)
        });
      } catch(e) {
        console.error("Lead kaydedilemedi", e);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessages = [...messages, { role: 'user', content: inputValue }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    // Müşterinin yazdığı mesajda iletişim bilgisi var mı kontrol et
    detectAndSaveLead(inputValue);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();
      if (data.success) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: 'Üzgünüm, şu an bağlantımda bir sorun var. Bize direkt WhatsApp butonundan yazabilirsiniz. Hata Detayı: ' + (data.error || data.message || 'Bilinmiyor') }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: 'Sistem hatası oluştu, lütfen daha sonra tekrar deneyin. CATCH: ' + error.message }]);
    }
    
    setIsLoading(false);
  };

  const getWhatsAppLink = () => {
    const defaultPhone = settingsData?.whatsapp_assistant_phone 
      ? settingsData.whatsapp_assistant_phone.replace(/[^0-9]/g, '') 
      : settingsData?.phone ? settingsData.phone.replace(/[^0-9]/g, '') : '905445844543';
    return `https://wa.me/${defaultPhone}`;
  };

  return (
    <>
      {/* Bubble button */}
      <div className="wa-bubble-btn" onClick={() => {
        const nextState = !isOpen;
        setIsOpen(nextState);
        if (nextState && typeof logHit === 'function') {
          logHit('whatsapp', 'click_ai_whatsapp_bubble');
        }
      }} style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.8rem',
        boxShadow: '0 8px 32px rgba(56, 189, 248, 0.4)',
        cursor: 'pointer',
        zIndex: 9999,
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(129, 140, 248, 0.6)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(56, 189, 248, 0.4)'; }}>
        {isOpen ? <i className="fa-solid fa-xmark"></i> : (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <i className="fa-solid fa-robot" style={{ zIndex: 2 }}></i>
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)', zIndex: 1 }}
            />
          </div>
        )}
        {!isOpen && <span style={{
          position: 'absolute',
          top: '-2px',
          right: '-2px',
          width: '14px',
          height: '14px',
          background: '#ef4444',
          borderRadius: '50%',
          border: '2px solid #fff',
          boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
        }}></span>}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="glass-card wa-chat-window" style={{
          position: 'fixed',
          bottom: '6rem',
          right: '1.5rem',
          width: 'min(360px, calc(100vw - 3rem))',
          borderRadius: '16px',
          overflow: 'hidden',
          zIndex: 9998,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.3s ease-out',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
            padding: '1rem',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>
                <i className="fa-solid fa-bolt"></i>
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', margin: 0 }}>Rota AI Asistan</h4>
                <span style={{ fontSize: '0.65rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 5px #4ade80' }}></motion.span> 
                  Yapay Zeka Destekli (Online)
                </span>
              </div>
            </div>
            <a href={getWhatsAppLink()} target="_blank" rel="noreferrer" style={{
              color: '#fff', fontSize: '1.2rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.9
            }} title="Gerçek WhatsApp'a Geç" onClick={() => {
              if (typeof window !== 'undefined') {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                  event: 'whatsapp_click',
                  agent_name: 'AI Bot'
                });
              }
            }}>
              <i className="fa-brands fa-whatsapp"></i>
            </a>
          </div>

          {/* Body chat area */}
          <div ref={chatBodyRef} style={{
            padding: '1.25rem',
            height: '350px',
            overflowY: 'auto',
            background: '#f0f2f5',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx} 
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)' : '#fff',
                  color: msg.role === 'user' ? '#fff' : '#0f172a',
                  padding: '0.6rem 0.8rem',
                  borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  fontSize: '0.8rem',
                  lineHeight: '1.4',
                  boxShadow: msg.role === 'user' ? '0 4px 10px rgba(56, 189, 248, 0.2)' : '0 4px 10px rgba(0,0,0,0.05)',
                  border: msg.role === 'assistant' ? '1px solid #e2e8f0' : 'none'
                }}
              >
                {msg.content}
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{
                  alignSelf: 'flex-start',
                  background: '#fff',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '0 12px 12px 12px',
                  fontSize: '0.8rem',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  gap: '4px'
                }}
              >
                <span className="dot-typing"></span>Yazıyor...
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} style={{
            display: 'flex',
            padding: '0.75rem',
            background: '#fff',
            borderTop: '1px solid #e2e8f0',
            gap: '0.5rem'
          }}>
            <input 
              type="text" 
              placeholder="Mesajınızı yazın..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.6rem 0.8rem',
                borderRadius: '20px',
                border: '1px solid #cbd5e1',
                fontSize: '0.8rem',
                outline: 'none',
                background: '#f8fafc'
              }} 
            />
            <button 
              type="submit" 
              disabled={isLoading || !inputValue.trim()}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: inputValue.trim() ? 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)' : '#cbd5e1',
                color: '#fff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputValue.trim() ? 'pointer' : 'default',
                transition: 'all 0.2s',
                boxShadow: inputValue.trim() ? '0 2px 8px rgba(56, 189, 248, 0.3)' : 'none'
              }}
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
