import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AkademiPageView({
  onBack,
  onSaveLead,
  logHit,
  academyCoursesData
}) {
  const [selectedGuide, setSelectedGuide] = useState(null); // For free PDF download
  const [selectedCourse, setSelectedCourse] = useState(null); // For paid course enrollment
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' or 'free_resources'
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // -----------------------------------------------------
  // DATA ARRAYS
  // -----------------------------------------------------


  const freeGuides = [
    {
      id: 'export',
      title: "Ege'den Dünyaya E-İhracat Rehberi",
      desc: "İzmir ve Ege'deki yerel üreticiler ve işletmeler için Amazon, Etsy ve Shopify üzerinden yurt dışı pazarlara açılma kılavuzu.",
      icon: "fa-solid fa-globe",
      color: "var(--primary)",
      pages: "42 sayfa PDF",
      outline: ["Ege ürünleri için pazar seçimi", "Etsy & Amazon mağaza kurulum sırları", "Lojistik & Gümrükleme süreçleri", "Global Meta reklam bütçesi yönetimi"]
    }, 
    {
      id: 'tourism',
      title: "Konaklama ve Turizm Dijital Büyüme",
      desc: "Butik oteller, acenteler ve turizm işletmeleri için dijital reklamlar ve SEO ile doğrudan turist kazanma yöntemleri.",
      icon: "fa-solid fa-hotel",
      color: "var(--secondary)",
      pages: "35 sayfa PDF",
      outline: ["Google Otel Reklamları entegrasyonu", "İngilizce & Almanca SEO kurguları", "Sosyal medyada görsel deneyim tasarımı", "Mevsim dışı dönemde rezervasyon artırma"]
    }, 
    {
      id: 'cro',
      title: "E-Ticarette Dönüşüm Oranı Artırma",
      desc: "Web sitenize gelen trafiği satışa dönüştürme oranını %50'ye kadar artırabilecek 28 maddelik teknik ve tasarımsal kontrol listesi.",
      icon: "fa-solid fa-cart-flatbed-suitcases",
      color: "var(--accent-teal)",
      pages: "18 sayfa PDF",
      outline: ["Sepet terk etme oranlarını düşürme", "Tek tıkla ödeme ve UX kuralları", "Hız optimizasyonunun dönüşüme etkisi", "Kullanıcı güven ve kanıt etiketleri"]
    }
  ];

  // -----------------------------------------------------
  // HANDLERS
  // -----------------------------------------------------
  const handleOpenFormModal = (item, type) => {
    if (type === 'course') {
      setSelectedCourse(item);
      setSelectedGuide(null);
    } else {
      setSelectedGuide(item);
      setSelectedCourse(null);
    }
    setFormData({ fullName: '', email: '', phone: '', company: '' });
    setIsSuccess(false);
    setErrorMsg('');
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setSelectedGuide(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      setErrorMsg('Lütfen zorunlu alanları doldurun.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');

    const isCourse = !!selectedCourse;
    const targetItem = isCourse ? selectedCourse : selectedGuide;
    
    const serviceType = isCourse 
      ? `Akademi Kayıt: ${targetItem.level}` 
      : `Rehber İndirme - ${targetItem.title}`;
      
    const leadMessage = isCourse
      ? `Müşteri "${targetItem.title}" (${targetItem.price}) eğitimine ön kayıt oluşturmak istiyor.`
      : `${targetItem.title} isimli PDF dokümanını indirdi.`;

    const leadPayload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company || 'Bireysel / Belirtilmemiş',
      service: serviceType,
      message: leadMessage,
      trafficSource: 'Rota Akademi'
    };

    try {
      await fetch('/api/php-handler?action=save_lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      });
      
      if (typeof onSaveLead === 'function') onSaveLead(leadPayload);
      if (typeof logHit === 'function') {
        const hitType = isCourse ? `course_enroll_${targetItem.id}` : `download_pdf_${targetItem.id}`;
        logHit('akademi', hitType);
      }
      
      // GTM DataLayer Push for Academy Registration
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: isCourse ? 'academy_registration' : 'download_guide',
          course_name: targetItem.title,
          user_email: formData.email,
          user_phone: formData.phone
        });
      }
      
      setIsSubmitting(false);
      setIsSuccess(true);
      
      if (isCourse) {
        toast.success('Ön kaydınız başarıyla alındı. Sizinle iletişime geçeceğiz.', { duration: 5000 });
      }
    } catch (err) {
      console.error(err);
      if (typeof onSaveLead === 'function') onSaveLead(leadPayload);
      
      setIsSubmitting(false);
      setIsSuccess(true); // Fallback success to not block user on network error
    }
  };

  // -----------------------------------------------------
  // RENDER HELPERS
  // -----------------------------------------------------
  const renderCourseCards = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '2.5rem',
      maxWidth: '1200px',
      margin: '0 auto 4rem auto'
    }}>
      {(academyCoursesData || []).map((course, idx) => (
        <div key={course.id} className="glass-card" style={{
          position: 'relative',
          padding: '2.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          borderTop: `4px solid ${course.color}`,
          transform: course.popular ? 'translateY(-10px)' : 'none',
          boxShadow: course.popular ? `0 20px 40px ${course.color}25` : 'none'
        }}>
          {course.popular && (
            <div style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: '#ffffff',
              padding: '4px 16px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '700',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}>
              <i className="fa-solid fa-fire" style={{marginRight: '6px'}}></i>
              En Çok Tercih Edilen
            </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: `${course.color}15`,
              color: course.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              <i className={course.icon}></i>
            </div>
            <div>
              <span style={{ color: course.color, fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {course.level}
              </span>
              <h3 style={{ fontSize: '1.3rem', color: '#1e293b', margin: '4px 0 0 0', fontWeight: '800' }}>
                {course.title}
              </h3>
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem', flexGrow: 1 }}>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {course.targetAudience}
            </p>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {course.features.map((feature, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.85rem', color: '#475569' }}>
                  <i className="fa-solid fa-check" style={{ color: course.color, marginTop: '4px' }}></i>
                  <span style={{ color: '#334155' }}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div style={{ borderTop: '1px solid var(--glass-border)', margin: '1.5rem -2rem', opacity: 0.5 }}></div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '2px' }}>Program Süresi</span>
              <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '600', lineHeight: 1 }}>
                <i className="fa-regular fa-clock" style={{marginRight: '5px'}}></i> {course.duration}
              </span>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '1.5rem', color: '#1e293b', fontWeight: '800', lineHeight: 1 }}>{course.price}</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>+KDV</span>
            </div>
          </div>
          
          <button onClick={() => handleOpenFormModal(course, 'course')} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', fontWeight: '700' }}>
            Ön Kayıt Ol
          </button>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button 
              onClick={() => {
                toast.success(`${course.title} müfredatı detayları için ön kayıt formumuzu doldurabilirsiniz.`);
              }}
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Detaylı Bilgi
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFreeGuides = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
      maxWidth: '1000px',
      margin: '0 auto 4rem auto'
    }}>
      {freeGuides.map(g => (
        <div className="glass-card" key={g.id} style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <i className={g.icon} style={{ fontSize: '1.2rem', color: g.color }}></i>
            </div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
              <i className="fa-regular fa-file-pdf"></i> {g.pages}
            </span>
          </div>
          
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: '0.75rem', fontWeight: '700', lineHeight: '1.3' }}>
            {g.title}
          </h3>
          
          <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: '1.5', marginBottom: '1.25rem', flexGrow: 1 }}>
            {g.desc}
          </p>
          
          <button onClick={() => handleOpenFormModal(g, 'guide')} className="btn btn-secondary" style={{
            width: '100%', fontSize: '0.85rem', padding: '0.6rem', borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
          }}>
            <i className="fa-solid fa-download"></i> Ücretsiz İndir
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="akademi-page container" style={{ paddingTop: '6rem', paddingBottom: '4rem', minHeight: '100vh' }}>
      
      <div className="service-page-nav">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Ana Sayfaya Dön
        </button>
        <div className="breadcrumb">
          <span>Ana Sayfa</span> &rarr; <span className="active">Rota Akademi</span>
        </div>
      </div>

      <div className="izmir-hero-header" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '20px', color: '#818cf8', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1rem' }}>
          <i className="fa-solid fa-graduation-cap"></i> Yeni Nesil Eğitim Portalı
        </div>
        <h1 className="izmir-hero-title">Rota Büyüme <br /><span>Akademisi (Masterclass)</span></h1>
        <p className="izmir-hero-desc" style={{ maxWidth: '700px', margin: '0 auto' }}>
          Dijital pazarlamayı ve e-ticareti teoride değil, sektörün merkezinde yer alan uzman ajans ekibimizden gerçek bütçeler ve vaka analizleriyle öğrenin.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('courses')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'courses' ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
            border: activeTab === 'courses' ? '1px solid var(--primary)' : '1px solid transparent',
            color: activeTab === 'courses' ? '#ffffff' : '#475569',
            borderRadius: '30px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <i className="fa-solid fa-chalkboard-user" style={{marginRight: '8px'}}></i>
          Masterclass Eğitimler
        </button>
        <button 
          onClick={() => setActiveTab('free_resources')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'free_resources' ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
            border: activeTab === 'free_resources' ? '1px solid var(--primary)' : '1px solid transparent',
            color: activeTab === 'free_resources' ? '#ffffff' : '#475569',
            borderRadius: '30px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <i className="fa-regular fa-folder-open" style={{marginRight: '8px'}}></i>
          Ücretsiz PDF Rehberler
        </button>
      </div>

      {activeTab === 'courses' ? renderCourseCards() : renderFreeGuides()}

      {/* Lead Generation & Enrollment Modal */}
      {(selectedCourse || selectedGuide) && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999
        }}>
          <div className="glass-card" style={{ maxWidth: '450px', width: '90%', padding: '2.5rem 2rem', position: 'relative' }}>
            <button onClick={handleCloseModal} style={{
              position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none',
              color: 'var(--text-muted)', fontSize: '1.25rem', cursor: 'pointer'
            }}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            {!isSuccess ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', margin: '0 auto 1rem auto'
                  }}>
                    <i className={selectedCourse ? "fa-solid fa-graduation-cap" : "fa-solid fa-download"}></i>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.5rem', fontWeight: '800' }}>
                    {selectedCourse ? 'Eğitim Ön Kayıt Formu' : 'Rehber Talebi'}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.5' }}>
                    {selectedCourse 
                      ? <><strong style={{color:'#e2e8f0'}}>{selectedCourse.title}</strong> masterclass sınıfına ön kayıt oluşturmak ve müfredat detaylarını görüşmek için formu doldurun.</>
                      : <><strong style={{color:'#e2e8f0'}}>{selectedGuide.title}</strong> isimli rehberi indirmek için aşağıdaki bilgileri girin.</>
                    }
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{position: 'relative'}}>
                    <i className="fa-regular fa-user" style={{position: 'absolute', top: '15px', left: '16px', color: '#64748b', fontSize: '1rem'}}></i>
                    <input type="text" required placeholder="Adınız Soyadınız *" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{
                      width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.7)', color: '#1e293b', fontSize: '0.95rem', transition: 'border-color 0.3s'
                    }} />
                  </div>
                  
                  <div style={{position: 'relative'}}>
                    <i className="fa-regular fa-envelope" style={{position: 'absolute', top: '15px', left: '16px', color: '#64748b', fontSize: '1rem'}}></i>
                    <input type="email" required placeholder="E-posta Adresiniz *" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{
                      width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.7)', color: '#1e293b', fontSize: '0.95rem', transition: 'border-color 0.3s'
                    }} />
                  </div>
                  
                  <div style={{position: 'relative'}}>
                    <i className="fa-solid fa-mobile-screen-button" style={{position: 'absolute', top: '15px', left: '16px', color: '#64748b', fontSize: '1rem'}}></i>
                    <input type="tel" required placeholder="Telefon Numaranız *" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{
                      width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.7)', color: '#1e293b', fontSize: '0.95rem', transition: 'border-color 0.3s'
                    }} />
                  </div>
                  
                  <div style={{position: 'relative'}}>
                    <i className="fa-regular fa-building" style={{position: 'absolute', top: '15px', left: '16px', color: '#64748b', fontSize: '1rem'}}></i>
                    <input type="text" placeholder="Firma / Marka Adınız (Opsiyonel)" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} style={{
                      width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.7)', color: '#1e293b', fontSize: '0.95rem', transition: 'border-color 0.3s'
                    }} />
                  </div>

                  {errorMsg && <div style={{ color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}><i className="fa-solid fa-circle-exclamation"></i> {errorMsg}</div>}
                  
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{
                    borderRadius: '12px', padding: '1rem', fontSize: '1rem', fontWeight: '700', marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', border: 'none', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)'
                  }}>
                    {isSubmitting ? (
                      <><i className="fa-solid fa-circle-notch fa-spin"></i> İşleniyor...</>
                    ) : selectedCourse ? 'Ön Kayıt Talebini Gönder' : 'Rehberi Gönder'}
                  </button>
                  <p style={{ fontSize: '0.7rem', color: '#64748b', textAlign: 'center', margin: 0, marginTop: '8px' }}>
                    <i className="fa-solid fa-lock" style={{marginRight: '4px'}}></i> Bilgileriniz KVKK kapsamında korunmaktadır.
                  </p>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem auto' }}>
                  <i className="fa-solid fa-check"></i>
                </div>
                <h4 style={{ color: '#1e293b', fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: '800' }}>
                  Talebiniz Başarıyla Alındı!
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '2rem', lineHeight: '1.6' }}>
                  {selectedCourse 
                    ? `Teşekkürler! ${selectedCourse.title} sınıfı kayıt işlemleri ve detaylı müfredat bilgisi için eğitim danışmanlarımız size en kısa sürede dönüş yapacaktır.`
                    : `Tebrikler! ${selectedGuide.title} rehberiniz hazırlanarak e-posta adresinize ve telefonunuza link olarak iletilecektir.`
                  }
                </p>
                <button onClick={handleCloseModal} className="btn btn-secondary" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', fontWeight: '700' }}>
                  Kapat ve Geri Dön
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
