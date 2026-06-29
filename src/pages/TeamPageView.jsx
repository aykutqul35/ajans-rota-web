import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { budgetSteps, initialServicePagesData, featuredStories, initialTeamMembers, initialBlogPosts, categories, whyAgencyData, testimonials } from '../data/mockData';
import FadeIn from '../components/FadeIn';
import StaggerContainer, { StaggerItem } from '../components/StaggerContainer';
import ClientTransparencyPageView from '../components/ClientTransparencyPageView';

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
      title: "Yönetim & Koordinasyon",
      desc: "Ajansımızın stratejik rotasını çizen ve operasyon süreçlerini yöneten lider kadromuz.",
      members: teamMembers.filter(m => m.dept === "management")
    },
    performance: {
      title: "Performans Pazarlama & SEO",
      desc: "Google & Meta reklam bütçelerinizi optimize eden, arama motoru görünürlüğünüzü tırmandıran veri uzmanlarımız.",
      members: teamMembers.filter(m => m.dept === "performance")
    },
    creative: {
      title: "Sosyal Medya & Kreatif Tasarım",
      desc: "Markanızın görsel dünyasını, Reels video kurgularını ve sosyal medya sesini tasarlayan yaratıcı ekibimiz.",
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
          <span>Ana Sayfa</span> &rarr; <span className="active">Ekiplerimiz</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="izmir-hero-header">
        <h1 className="izmir-hero-title">Ajans Rota'nın Kurucusundan Uzmanına <br /><span>Ege'den Uzaktan Çalışan 360° Dijital Kadrosu</span></h1>
        <p className="izmir-hero-desc">
          Ege'nin samimi ruhunu, yenilikçi uzaktan çalışma kültürüyle birleştiren ve markanıza özel dijital rotayı çizen proaktif kadromuzla tanışın.
        </p>
      </div>

      {/* Team Grid Groups */}
      {Object.entries(departments).map(([key, dept]) => <div key={key} className="team-department-section">
          <div className="dept-header">
            <h2 className="dept-title">{dept.title}</h2>
            <p className="dept-desc">{dept.desc}</p>
          </div>
          
          <div className="team-grid">
            {dept.members.map((member, idx) => <div key={idx} className="glass-card team-member-card">
                {/* Avatar Circle with Initials & Custom Gradient */}
                <div className="team-avatar-circle" style={{
            background: member.gradient
          }}>
                  {member.init}
                </div>
                
                {/* Experience Stars */}
                <div className="team-experience-stars">
                  {Array.from({
              length: member.stars
            }).map((_, i) => <i key={i} className="fa-solid fa-star star-icon"></i>)}
                  <span className="exp-years">{member.exp} Deneyim</span>
                </div>
                
                <span className="team-member-role" style={{
            color: member.gradient.includes('ff2a85') ? 'var(--secondary)' : 'var(--primary)'
          }}>
                  {member.role}
                </span>
                
                <h3 className="team-member-name">
                  {member.name}
                </h3>
                
                <p className="team-member-desc">
                  {member.desc}
                </p>
                
                {/* Social Links placeholder */}
                <div className="team-social-links">
                  <a href="javascript:void(0)" className="team-social-icon">
                    <i className="fa-brands fa-linkedin"></i>
                  </a>
                  <a href="javascript:void(0)" className="team-social-icon">
                    <i className="fa-solid fa-envelope"></i>
                  </a>
                </div>
              </div>)}
          </div>
        </div>)}


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
