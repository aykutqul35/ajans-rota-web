import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { budgetSteps, initialServicePagesData, featuredStories, initialTeamMembers, initialBlogPosts, categories, whyAgencyData, testimonials } from '../data/mockData';
import FadeIn from '../components/FadeIn';
import StaggerContainer, { StaggerItem } from '../components/StaggerContainer';
import ClientTransparencyPageView from '../components/ClientTransparencyPageView';

export default // ==========================================
// 5. GLOBAL WHATSAPP CHAT WIDGET
// ==========================================
function WhatsAppAssistantWidget({
  settingsData,
  onSaveLead,
  logHit
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState('');
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState('');
  const [workedWithAgency, setWorkedWithAgency] = useState('');
  const [agencyMonths, setAgencyMonths] = useState('');
  const [briefInfo, setBriefInfo] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const chatBodyRef = useRef(null);
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [step, hasCompleted, isOpen]);
  const handleNextStep = e => {
    e.preventDefault();
    if (step === 1 && name) setStep(2);
    if (step === 2 && company) setStep(3);
    if (step === 3 && service) setStep(4);
    if (step === 4 && city) setStep(5);
    if (step === 5 && budget) setStep(6);
    if (step === 6 && workedWithAgency) {
      if (workedWithAgency === 'Evet') {
        setStep(7);
      } else {
        setStep(8);
      }
    }
    if (step === 7 && agencyMonths) setStep(8);
    if (step === 8 && phone) {
      handleFinalSubmit(e);
    }
  };
  const handleTextareaKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (briefInfo) setStep(9);
    }
  };
  const selectService = serviceName => {
    setService(serviceName);
    setStep(4);
  };
  const submitCity = e => {
    e.preventDefault();
    if (city) setStep(5);
  };
  const selectBudget = budgetRange => {
    setBudget(budgetRange);
    setStep(6);
  };
  const selectAgencyChoice = choice => {
    setWorkedWithAgency(choice);
    if (choice === 'Evet') {
      setStep(7);
    } else {
      setStep(8);
    }
  };
  const submitAgencyMonths = e => {
    e.preventDefault();
    if (agencyMonths) setStep(8);
  };
  const submitBriefInfo = e => {
    e.preventDefault();
    if (briefInfo) setStep(9);
  };
  const handleFinalSubmit = async e => {
    e.preventDefault();
    if (!phone) return;
    setSubmitting(true);
    const leadPayload = {
      fullName: name,
      email: 'chat@whatsapp.asistan',
      phone,
      company: company,
      service: 'WhatsApp Asistan Teklif Analizi',
      message: `Hizmet: ${service}
Şehir/Bölge: ${city}
Bütçe: ${budget}
Ajans Geçmişi: ${workedWithAgency === 'Evet' ? `Evet (${agencyMonths} ay)` : 'Hayır'}
Ön Bilgi: ${briefInfo}
Telefon: ${phone}`,
      trafficSource: 'WhatsApp Chat Botu'
    };
    try {
      await fetch('/api.php?action=save_lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadPayload)
      });
      if (typeof onSaveLead === 'function') {
        onSaveLead(leadPayload);
      }
      if (typeof logHit === 'function') {
        logHit('whatsapp', 'submit_whatsapp_chat');
      }
    } catch (err) {
      console.error(err);
      if (typeof onSaveLead === 'function') {
        onSaveLead(leadPayload);
      }
    }
    setSubmitting(false);
    setHasCompleted(true);
  };
  const getTopics = () => {
    if (settingsData && settingsData.whatsapp_assistant_topics) {
      return settingsData.whatsapp_assistant_topics.split(',').map(t => t.trim()).filter(Boolean);
    }
    return ['Google / Meta Reklamı', 'SEO Çalışması', 'Sosyal Medya Yönetimi', 'Web Tasarım / CRO'];
  };
  const getWhatsAppLink = () => {
    const defaultPhone = settingsData && settingsData.whatsapp_assistant_phone ? settingsData.whatsapp_assistant_phone.replace(/[^0-9]/g, '') : settingsData && settingsData.phone ? settingsData.phone.replace(/[^0-9]/g, '') : '905445844543';
    const text = encodeURIComponent(`Merhaba, ben ${name}.
Şirketimiz: ${company}
Hizmet: ${service}
Şehir: ${city}
Bütçe Aralığı: ${budget}
Ajans Geçmişi: ${workedWithAgency === 'Evet' ? `Evet (${agencyMonths} ay çalışıldı)` : 'Hayır'}
Ön Bilgi: ${briefInfo}
Telefon: ${phone}
Gelinen Sayfa: ${window.location.href}
WhatsApp üzerinden hızlı dijital teklif görüşmesi yapmak istiyorum.`);
    return `https://wa.me/${defaultPhone}?text=${text}`;
  };
  return <>
      {/* Bubble button */}
      <div className="wa-bubble-btn" onClick={() => {
      const nextState = !isOpen;
      setIsOpen(nextState);
      if (nextState && typeof logHit === 'function') {
        logHit('whatsapp', 'click_whatsapp_bubble');
      }
    }} style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.6rem',
      boxShadow: '0 8px 32px rgba(37, 211, 102, 0.3)',
      cursor: 'pointer',
      zIndex: 9999,
      transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
        {isOpen ? <i className="fa-solid fa-xmark"></i> : <i className="fa-brands fa-whatsapp"></i>}
        {!isOpen && <span style={{
        position: 'absolute',
        top: '-2px',
        right: '-2px',
        width: '12px',
        height: '12px',
        background: '#ef4444',
        borderRadius: '50%',
        border: '2px solid #fff'
      }}></span>}
      </div>

      {/* Chat Window */}
      {isOpen && <div className="glass-card wa-chat-window" style={{
      position: 'fixed',
      bottom: '6rem',
      right: '1.5rem',
      width: 'min(340px, calc(100vw - 3rem))',
      borderRadius: '16px',
      overflow: 'hidden',
      zIndex: 9998,
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      animation: 'fadeIn 0.3s ease-out'
    }}>
          {/* Header */}
          <div style={{
        background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
        padding: '1rem',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
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
        }}>R</div>
            <div>
              <h4 style={{
            fontSize: '0.85rem',
            fontWeight: '700',
            margin: 0
          }}>Rota Büyüme Asistanı</h4>
              <span style={{
            fontSize: '0.6rem',
            opacity: 0.9,
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem'
          }}>
                <span style={{
              width: '6px',
              height: '6px',
              background: '#4ade80',
              borderRadius: '50%',
              display: 'inline-block'
            }}></span> Çevrimiçi · Genelde 1dk içinde yanıtlar
              </span>
            </div>
          </div>

          {/* Body chat area */}
          <div ref={chatBodyRef} style={{
        padding: '1.25rem',
        maxHeight: '300px',
        overflowY: 'auto',
        background: 'rgba(15, 23, 42, 0.01)',
        boxSizing: 'border-box'
      }}>
            
            {/* Step 1: Greeting & Name input */}
            {step >= 1 && <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
                <div style={{
            background: 'rgba(255,255,255,0.85)',
            color: '#0f172a',
            padding: '0.5rem 0.75rem',
            borderRadius: '0 12px 12px 12px',
            fontSize: '0.75rem',
            alignSelf: 'flex-start',
            maxWidth: '85%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid var(--glass-border)'
          }}>
                  Merhaba! 👋 Ben Rota Büyüme Asistanıyım. Size özel dijital büyüme teklifi hazırlamamı ister misiniz? Başlamak için adınızı yazar mısınız?
                </div>
                {step === 1 && <form onSubmit={handleNextStep} style={{
            display: 'flex',
            gap: '0.4rem',
            marginTop: '0.25rem'
          }}>
                    <input type="text" required placeholder="Adınız Soyadınız" value={name} onChange={e => setName(e.target.value)} style={{
              flex: 1,
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid var(--glass-border)',
              fontSize: '0.75rem',
              outline: 'none'
            }} />
                    <button type="submit" style={{
              padding: '0.4rem 0.75rem',
              background: '#25d366',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.75rem'
            }}><i className="fa-solid fa-paper-plane"></i></button>
                  </form>}
              </div>}

            {/* Step 2: Company Name input */}
            {step >= 2 && <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
                <div style={{
            background: 'var(--primary)',
            color: '#fff',
            padding: '0.5rem 0.75rem',
            borderRadius: '12px 0 12px 12px',
            fontSize: '0.75rem',
            alignSelf: 'flex-end',
            maxWidth: '85%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
                  Ben {name}
                </div>
                <div style={{
            background: 'rgba(255,255,255,0.85)',
            color: '#0f172a',
            padding: '0.5rem 0.75rem',
            borderRadius: '0 12px 12px 12px',
            fontSize: '0.75rem',
            alignSelf: 'flex-start',
            maxWidth: '85%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid var(--glass-border)'
          }}>
                  Memnun oldum {name}! Peki firmanızın/projenizin adı nedir?
                </div>
                {step === 2 && <form onSubmit={handleNextStep} style={{
            display: 'flex',
            gap: '0.4rem',
            marginTop: '0.25rem'
          }}>
                    <input type="text" required placeholder="Şirket / Marka Adı" value={company} onChange={e => setCompany(e.target.value)} style={{
              flex: 1,
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid var(--glass-border)',
              fontSize: '0.75rem',
              outline: 'none'
            }} />
                    <button type="submit" style={{
              padding: '0.4rem 0.75rem',
              background: '#25d366',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.75rem'
            }}><i className="fa-solid fa-paper-plane"></i></button>
                  </form>}
              </div>}

            {/* Step 3: Service dropdown options */}
            {step >= 3 && <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
                <div style={{
            background: 'var(--primary)',
            color: '#fff',
            padding: '0.5rem 0.75rem',
            borderRadius: '12px 0 12px 12px',
            fontSize: '0.75rem',
            alignSelf: 'flex-end',
            maxWidth: '85%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
                  Firmamız: {company}
                </div>
                <div style={{
            background: 'rgba(255,255,255,0.85)',
            color: '#0f172a',
            padding: '0.5rem 0.75rem',
            borderRadius: '0 12px 12px 12px',
            fontSize: '0.75rem',
            alignSelf: 'flex-start',
            maxWidth: '85%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid var(--glass-border)'
          }}>
                  Harika! Hangi dijital alanda büyüme teklifi almak istersiniz?
                </div>
                {step === 3 && <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
            marginTop: '0.25rem'
          }}>
                    {getTopics().map(s => <button key={s} onClick={() => selectService(s)} style={{
              background: '#fff',
              border: '1px solid var(--glass-border)',
              padding: '0.35rem 0.6rem',
              borderRadius: '15px',
              fontSize: '0.7rem',
              cursor: 'pointer',
              color: 'var(--text-light)',
              transition: '0.2s'
            }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
                        {s}
                      </button>)}
                  </div>}
              </div>}

            {/* Step 4: City/Region Input */}
            {step >= 4 && <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
                <div style={{
            background: 'var(--primary)',
            color: '#fff',
            padding: '0.5rem 0.75rem',
            borderRadius: '12px 0 12px 12px',
            fontSize: '0.75rem',
            alignSelf: 'flex-end',
            maxWidth: '85%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
                  Seçtiğim hizmet: {service}
                </div>
                <div style={{
            background: 'rgba(255,255,255,0.85)',
            color: '#0f172a',
            padding: '0.5rem 0.75rem',
            borderRadius: '0 12px 12px 12px',
            fontSize: '0.75rem',
            alignSelf: 'flex-start',
            maxWidth: '85%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid var(--glass-border)'
          }}>
                  Hangi şehirde veya bölgede yer alıyorsunuz?
                </div>
                {step === 4 && <form onSubmit={submitCity} style={{
            display: 'flex',
            gap: '0.4rem',
            marginTop: '0.25rem'
          }}>
                    <input type="text" required placeholder="Şehir / Bölge (Örn: İzmir, Urla)" value={city} onChange={e => setCity(e.target.value)} style={{
              flex: 1,
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid var(--glass-border)',
              fontSize: '0.75rem',
              outline: 'none'
            }} />
                    <button type="submit" style={{
              padding: '0.4rem 0.75rem',
              background: '#25d366',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.75rem'
            }}><i className="fa-solid fa-paper-plane"></i></button>
                  </form>}
              </div>}

            {/* Step 5: Budget Range Selection */}
            {step >= 5 && <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
                <div style={{
            background: 'var(--primary)',
            color: '#fff',
            padding: '0.5rem 0.75rem',
            borderRadius: '12px 0 12px 12px',
            fontSize: '0.75rem',
            alignSelf: 'flex-end',
            maxWidth: '85%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
                  Bölgemiz: {city}
                </div>
                <div style={{
            background: 'rgba(255,255,255,0.85)',
            color: '#0f172a',
            padding: '0.5rem 0.75rem',
            borderRadius: '0 12px 12px 12px',
            fontSize: '0.75rem',
            alignSelf: 'flex-start',
            maxWidth: '85%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid var(--glass-border)'
          }}>
                  Aylık harcamak istediğiniz bütçe aralığı nedir?
                </div>
                {step === 5 && <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
            marginTop: '0.25rem'
          }}>
                    {['10K - 30K TL', '30K - 70K TL', '70K - 150K TL', '150K TL+'].map(b => <button key={b} onClick={() => selectBudget(b)} style={{
              background: '#fff',
              border: '1px solid var(--glass-border)',
              padding: '0.35rem 0.6rem',
              borderRadius: '15px',
              fontSize: '0.7rem',
              cursor: 'pointer',
              color: 'var(--text-light)',
              transition: '0.2s'
            }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
                        {b}
                      </button>)}
                  </div>}
              </div>}

            {/* Step 6: Worked with Agency */}
            {step >= 6 && <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
                <div style={{
            background: 'var(--primary)',
            color: '#fff',
            padding: '0.5rem 0.75rem',
            borderRadius: '12px 0 12px 12px',
            fontSize: '0.75rem',
            alignSelf: 'flex-end',
            maxWidth: '85%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
                  Bütçemiz: {budget}
                </div>
                <div style={{
            background: 'rgba(255,255,255,0.85)',
            color: '#0f172a',
            padding: '0.5rem 0.75rem',
            borderRadius: '0 12px 12px 12px',
            fontSize: '0.75rem',
            alignSelf: 'flex-start',
            maxWidth: '85%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid var(--glass-border)'
          }}>
                  Daha önce bir dijital ajans ile çalıştınız mı?
                </div>
                {step === 6 && <div style={{
            display: 'flex',
            gap: '0.4rem',
            marginTop: '0.25rem'
          }}>
                    <button onClick={() => selectAgencyChoice('Evet')} style={{
              flex: 1,
              background: '#fff',
              border: '1px solid var(--glass-border)',
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              color: 'var(--text-light)',
              transition: '0.2s'
            }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}>Evet</button>
                    <button onClick={() => selectAgencyChoice('Hayır')} style={{
              flex: 1,
              background: '#fff',
              border: '1px solid var(--glass-border)',
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              color: 'var(--text-light)',
              transition: '0.2s'
            }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}>Hayır</button>
                  </div>}
              </div>}

            {/* Step 7: Agency Working Duration (Months) */}
            {step >= 7 && workedWithAgency === 'Evet' && <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
                <div style={{
            background: 'rgba(255,255,255,0.85)',
            color: '#0f172a',
            padding: '0.5rem 0.75rem',
            borderRadius: '0 12px 12px 12px',
            fontSize: '0.75rem',
            alignSelf: 'flex-start',
            maxWidth: '85%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid var(--glass-border)'
          }}>
                  Peki, eski ajansınızla kaç ay çalıştınız?
                </div>
                {step === 7 && <form onSubmit={submitAgencyMonths} style={{
            display: 'flex',
            gap: '0.4rem',
            marginTop: '0.25rem'
          }}>
                    <input type="number" required placeholder="Çalışma süresi (Ay olarak)" value={agencyMonths} onChange={e => setAgencyMonths(e.target.value)} style={{
              flex: 1,
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid var(--glass-border)',
              fontSize: '0.75rem',
              outline: 'none'
            }} />
                    <button type="submit" style={{
              padding: '0.4rem 0.75rem',
              background: '#25d366',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.75rem'
            }}><i className="fa-solid fa-paper-plane"></i></button>
                  </form>}
              </div>}

            {/* Step 8: Brief info input */}
            {step >= 8 && <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
                <div style={{
            background: 'var(--primary)',
            color: '#fff',
            padding: '0.5rem 0.75rem',
            borderRadius: '12px 0 12px 12px',
            fontSize: '0.75rem',
            alignSelf: 'flex-end',
            maxWidth: '85%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
                  {workedWithAgency === 'Evet' ? `Evet, ${agencyMonths} ay çalıştık.` : 'Hayır, daha önce çalışmadık.'}
                </div>
                <div style={{
            background: 'rgba(255,255,255,0.85)',
            color: '#0f172a',
            padding: '0.5rem 0.75rem',
            borderRadius: '0 12px 12px 12px',
            fontSize: '0.75rem',
            alignSelf: 'flex-start',
            maxWidth: '85%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid var(--glass-border)'
          }}>
                  Projeniz, hedefleriniz veya sektörünüz hakkında kısa bir ön bilgi yazar mısınız?
                </div>
                {step === 8 && <form onSubmit={submitBriefInfo} style={{
            display: 'flex',
            gap: '0.4rem',
            marginTop: '0.25rem'
          }}>
                    <input type="text" required placeholder="Hedefimiz, talebimiz veya ön bilgi..." value={briefInfo} onChange={e => setBriefInfo(e.target.value)} style={{
              flex: 1,
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid var(--glass-border)',
              fontSize: '0.75rem',
              outline: 'none'
            }} />
                    <button type="submit" style={{
              padding: '0.4rem 0.75rem',
              background: '#25d366',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.75rem'
            }}><i className="fa-solid fa-paper-plane"></i></button>
                  </form>}
              </div>}

            {/* Step 9: Final Phone Input */}
            {step >= 9 && <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
                <div style={{
            background: 'var(--primary)',
            color: '#fff',
            padding: '0.5rem 0.75rem',
            borderRadius: '12px 0 12px 12px',
            fontSize: '0.75rem',
            alignSelf: 'flex-end',
            maxWidth: '85%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
                  Ön bilgi: {briefInfo}
                </div>
                <div style={{
            background: 'rgba(255,255,255,0.85)',
            color: '#0f172a',
            padding: '0.5rem 0.75rem',
            borderRadius: '0 12px 12px 12px',
            fontSize: '0.75rem',
            alignSelf: 'flex-start',
            maxWidth: '85%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid var(--glass-border)'
          }}>
                  Harika! Son olarak, size ulaşabileceğimiz telefon numaranızı yazar mısınız?
                </div>
                {step === 9 && <form onSubmit={handleFinalSubmit} style={{
            display: 'flex',
            gap: '0.4rem',
            marginTop: '0.25rem'
          }}>
                    <input type="tel" required placeholder="05XX XXX XX XX" value={phone} onChange={e => setPhone(e.target.value)} style={{
              flex: 1,
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid var(--glass-border)',
              fontSize: '0.75rem',
              outline: 'none'
            }} />
                    <button type="submit" disabled={submitting} style={{
              padding: '0.4rem 0.75rem',
              background: '#25d366',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.75rem'
            }}>
                      <i className="fa-solid fa-paper-plane"></i>
                    </button>
                  </form>}
              </div>}

            {/* Completion Slide */}
            {hasCompleted && <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
                <div style={{
            background: 'rgba(255,255,255,0.85)',
            color: '#0f172a',
            padding: '0.5rem 0.75rem',
            borderRadius: '0 12px 12px 12px',
            fontSize: '0.75rem',
            alignSelf: 'flex-start',
            maxWidth: '85%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid var(--glass-border)'
          }}>
                  Tebrikler! Bilgilerinizi güvenle kaydettim. Teklif hazırlığımızı başlatmak ve WhatsApp üzerinden direkt görüşmeye geçmek için aşağıdaki butona basabilirsiniz.
                </div>
                <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} style={{
            background: '#25d366',
            color: '#fff',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: '700',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            marginTop: '0.25rem',
            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)'
          }}>
                  <i className="fa-brands fa-whatsapp" style={{
              fontSize: '1rem'
            }}></i> WhatsApp ile Görüşmeyi Başlat
                </a>
              </div>}

          </div>
        </div>}
    </>;
}

// Dedicated About Page View Component
