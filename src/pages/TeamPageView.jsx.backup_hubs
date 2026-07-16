import { useState, useEffect } from 'react';
import { initialTeamMembers } from '../data/mockData';

export default // Dedicated Team Page View Component

function TeamPageView({
  onBack,
  onNavToContact,
  teamMembers = initialTeamMembers,
  onSaveLead,
  testimonialsData = []
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    note: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const closeModal = () => {
    setIsModalOpen(false);
    setAppointmentForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      note: ''
    });
    setIsSubmitted(false);
    setError('');
  };
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);
  const handleAppointmentSubmit = async e => {
    e.preventDefault();
    if (!appointmentForm.name || !appointmentForm.email || !appointmentForm.phone) {
      setError('Lütfen zorunlu alanları doldurun.');
      return;
    }
    setLoading(true);
    setError('');
    const leadPayload = {
      fullName: appointmentForm.name,
      email: appointmentForm.email,
      phone: appointmentForm.phone,
      company: appointmentForm.company || 'Ekiplerimiz Sayfası Ziyaretçisi',
      service: 'Randevu Talebi',
      message: appointmentForm.note || 'Bu ekiple çalışmak istiyor.',
      trafficSource: 'Ekiplerimiz Sayfası Randevu'
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
      setLoading(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      if (typeof onSaveLead === 'function') {
        onSaveLead(leadPayload);
      }
      setLoading(false);
      setIsSubmitted(true);
    }
  };
  const departments = {
    management: {
      title: "Performans Optimizasyonu",
      desc: "Reklam yatırımlarınızı yönlendiren otonom algoritmalar.",
      members: teamMembers.filter(m => m.dept === "management")
    },
    performance: {
      title: "Semantik Analiz",
      desc: "Görünürlüğünüzü tırmandıran yapay zeka ajanları.",
      members: teamMembers.filter(m => m.dept === "performance")
    },
    creative: {
      title: "Otonom Kreatif Tasarım",
      desc: "Verilere dayalı görsel üreten jeneratif algoritmalar.",
      members: teamMembers.filter(m => m.dept === "creative")
    }
  };
  return <div className="team-page-view container">
      {/* Navigation & Breadcrumb */}
      <div className="service-page-nav">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Ana Sayfaya Dön
        </button>
        <div className="breadcrumb">
          <span>Ana Sayfa</span> &rarr; <span className="active">Otonom Ajanlarımız</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="izmir-hero-header" style={{ position: 'relative', overflow: 'hidden', paddingBottom: '3rem' }}>
        <div className="hero-glow" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '150%', height: '150%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 60%)', zIndex: 0, pointerEvents: 'none' }}></div>
        <h1 className="izmir-hero-title" style={{ position: 'relative', zIndex: 1 }}>
          Sınırları Kaldıran <br /><span style={{ color: 'var(--primary)' }}>Hibrid Büyüme Ekosistemi</span>
        </h1>
        <p className="izmir-hero-desc" style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          Elit insan stratejistleri ile binlerce otonom yapay zeka ajanının entegre çalıştığı, 7/24 kesintisiz operasyon yürüten devasa mekanizmamızla tanışın. Klasik ajans hantallığına yer yok.
        </p>
      </div>

      {/* Capacity Stats */}
      <div className="team-stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', margin: '2rem 0 4rem 0', position: 'relative', zIndex: 1 }}>
        {[
          { icon: "fa-bolt", value: "Milisaniye", label: "Reaksiyon Hızı" },
          { icon: "fa-infinity", value: "7/24", label: "Kesintisiz Operasyon" },
          { icon: "fa-network-wired", value: "10+", label: "Entegre Dijital Disiplin" },
          { icon: "fa-microchip", value: "Otonom", label: "Hibrid İş Gücü" }
        ].map((stat, idx) => (
          <div key={idx} className="glass-card stat-card hover-glow" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <i className={`fa-solid ${stat.icon}`} style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-light)', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>{stat.value}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Department Hubs */}
      <div className="team-hubs-section" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Operasyon Merkezlerimiz</span>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-light)', marginTop: '0.5rem' }}>Dijitalin Her Alanında Kurumsal Yetkinlik</h2>
        </div>
        
        <div className="hubs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {[
            { 
              icon: "fa-chart-line", 
              title: "Veri Bilimi & Performans Masası", 
              desc: "Milyonlarca veriyi anlık analiz ederek en karlı hedef kitleyi bulan, bütçenizi yöneten operasyon üssü.",
              tags: ["Google Ads", "Meta Ads", "Programatik", "Analytics"]
            },
            { 
              icon: "fa-pen-nib", 
              title: "Kreatif Stüdyo & Prodüksiyon", 
              desc: "Görsel hafızalara kazınan marka hikayeleri yaratan, saniyeler içinde binlerce varyasyon üreten tasarım laboratuvarı.",
              tags: ["Video Kurgu", "Hareketli Grafik", "Copywriting", "UI/UX"]
            },
            { 
              icon: "fa-chess-knight", 
              title: "Strateji & Büyüme Ekibi", 
              desc: "Sektörel rakipleri inceleyip markanızı pazarda paha biçilmez bir konuma oturtan elit büyüme stratejistleri.",
              tags: ["Pazar Araştırması", "Konumlandırma", "CRM", "CRO"]
            },
            { 
              icon: "fa-robot", 
              title: "Yapay Zeka & Otomasyon Lab.", 
              desc: "İnsan gücünün sınırlarını aşan, uyumadan sistemleri denetleyen ve iyileştiren yapay zeka ajanlarımız.",
              tags: ["AI Agent", "Entegrasyon", "Makine Öğrenimi", "Veri"]
            },
            { 
              icon: "fa-globe", 
              title: "Global SEO & İçerik Ağı", 
              desc: "Arama motorlarında üst sıralara çıkmanızı sağlayan algoritmik analiz ve programatik içerik üretim merkezi.",
              tags: ["Teknik SEO", "Yerel SEO", "Backlink", "İçerik Stratejisi"]
            },
            { 
              icon: "fa-code", 
              title: "Web & Otonom Mimari", 
              desc: "Dönüşüm odaklı hibrid e-ticaret siteleri ve yüksek performanslı otonom yazılım ekosistemleri inşa eden takım.",
              tags: ["E-Ticaret", "PWA", "Mobil Uygulama", "Özel Yazılım"]
            }
          ].map((hub, idx) => (
            <div key={idx} className="glass-card hub-card" style={{ padding: '2.5rem 2rem', borderTop: '2px solid rgba(16, 185, 129, 0.3)', transition: 'transform 0.4s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.borderTopColor = 'var(--primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderTopColor = 'rgba(16, 185, 129, 0.3)'; }}>
              <div style={{ width: '65px', height: '65px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <i className={`fa-solid ${hub.icon}`} style={{ fontSize: '1.75rem', color: 'var(--primary)' }}></i>
              </div>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--text-light)', marginBottom: '1rem', fontFamily: 'var(--font-heading)', fontWeight: '600', lineHeight: '1.3' }}>{hub.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>{hub.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {hub.tags.map((tag, i) => (
                  <span key={i} style={{ padding: '0.4rem 0.8rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '20px', fontSize: '0.75rem', color: 'var(--primary)', border: '1px solid rgba(16, 185, 129, 0.15)', fontWeight: '600' }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Ekiplerimiz Sayfası Alt CTA Banner */}
      <div className="service-bottom-cta glass-card" style={{
      marginTop: '4rem'
    }}>
        <div className="cta-content">
          <h2 style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--text-light)',
          fontWeight: '700'
        }}>Bu Ekiple Çalışmak İster misiniz?</h2>
          <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.95rem',
          marginTop: '0.5rem'
        }}>
            Ege'nin samimi ruhunu taşıyan uzman kadromuzla markanızın dijital yolculuğuna yön verin. Hemen ücretsiz ön randevunuzu planlayın.
          </p>
        </div>
        <div className="cta-action">
          <button className="btn btn-primary cta-btn" onClick={() => setIsModalOpen(true)} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: '600'
        }}>
            <i className="fa-regular fa-calendar-check"></i> Bizimle Çalışın
          </button>
        </div>
      </div>

      {/* Glassmorphic Modal Overlay */}
      {isModalOpen && <div className="appointment-modal-overlay" onClick={closeModal}>
          <div className="appointment-modal-card" onClick={e => e.stopPropagation()}>
            {/* Close button */}
            <button onClick={closeModal} aria-label="Kapat" className="appointment-modal-close">
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            {!isSubmitted ? <>
                <div style={{
            marginBottom: '1.75rem'
          }}>
                  <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              color: 'var(--primary)',
              letterSpacing: '0.1em',
              display: 'inline-block',
              marginBottom: '0.5rem'
            }}>
                    Ön Randevu Planlama
                  </span>
                  <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              color: '#ffffff',
              fontWeight: '700',
              lineHeight: '1.2'
            }}>
                    Ekibimizle Tanışın
                  </h3>
                  <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginTop: '0.5rem',
              lineHeight: '1.4'
            }}>
                    Aşağıdaki formu doldurarak dijital hedeflerinizi belirleyeceğimiz ücretsiz 15 dakikalık tanışma toplantısını rezerve edin.
                  </p>
                </div>

                <form onSubmit={handleAppointmentSubmit} className="appointment-form">
                  <div className="appointment-form-group">
                    <label>Adınız Soyadınız *</label>
                    <input type="text" required placeholder="Örn. Can Yılmaz" value={appointmentForm.name} onChange={e => setAppointmentForm({
                ...appointmentForm,
                name: e.target.value
              })} className="appointment-form-input" />
                  </div>

                  <div className="appointment-form-row">
                    <div className="appointment-form-group">
                      <label>E-posta *</label>
                      <input type="email" required placeholder="isim@sirket.com" value={appointmentForm.email} onChange={e => setAppointmentForm({
                  ...appointmentForm,
                  email: e.target.value
                })} className="appointment-form-input" />
                    </div>
                    <div className="appointment-form-group">
                      <label>Telefon *</label>
                      <input type="tel" required placeholder="0555 555 5555" value={appointmentForm.phone} onChange={e => setAppointmentForm({
                  ...appointmentForm,
                  phone: e.target.value
                })} className="appointment-form-input" />
                    </div>
                  </div>

                  <div className="appointment-form-group">
                    <label>Şirket Adı</label>
                    <input type="text" placeholder="Şirketiniz veya Web Siteniz" value={appointmentForm.company} onChange={e => setAppointmentForm({
                ...appointmentForm,
                company: e.target.value
              })} className="appointment-form-input" />
                  </div>

                  <div className="appointment-form-group">
                    <label>Mesaj / Not</label>
                    <textarea placeholder="Projelerinizden ve ekibimizden beklentilerinizden kısaca bahsedin..." value={appointmentForm.note} onChange={e => setAppointmentForm({
                ...appointmentForm,
                note: e.target.value
              })} className="appointment-form-textarea" />
                  </div>

                  {error && <div style={{
              color: '#ef4444',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
                      <i className="fa-solid fa-circle-exclamation"></i> {error}
                    </div>}

                  <button type="submit" className="btn btn-primary" disabled={loading} style={{
              borderRadius: '10px',
              padding: '0.85rem',
              fontSize: '0.95rem',
              width: '100%',
              fontWeight: '600',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
                    {loading ? <>
                        <i className="fa-solid fa-spinner fa-spin"></i> Gönderiliyor...
                      </> : <>
                        Randevu Talebini Gönder <i className="fa-solid fa-arrow-right"></i>
                      </>}
                  </button>
                </form>
              </> : <div className="appointment-success-container">
                <div className="appointment-success-icon">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h4 style={{
            color: '#ffffff',
            fontSize: '1.35rem',
            marginBottom: '0.5rem',
            fontWeight: '700',
            fontFamily: 'var(--font-heading)'
          }}>Randevu Talebiniz Alındı!</h4>
                <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            marginBottom: '2rem',
            lineHeight: '1.5'
          }}>
                  Harika! Ege esintili dijital uzman ekibimizle tanışma talebiniz başarıyla kaydedilmiştir. Belirttiğiniz e-posta ve telefon üzerinden en kısa sürede randevu saati netleştirilecektir.
                </p>
                <button onClick={closeModal} className="btn btn-primary" style={{
            padding: '0.8rem 2rem',
            borderRadius: '10px',
            fontSize: '0.9rem',
            width: '100%',
            fontWeight: '600'
          }}>
                  Harika, Kapat
                </button>
              </div>}
          </div>
        </div>}
    </div>;
}
