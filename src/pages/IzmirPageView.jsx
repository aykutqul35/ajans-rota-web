import { useState, useEffect } from 'react';

export default // Dedicated Izmir Brand Story Page View Component
function IzmirPageView({
  onBack,
  onNavToContact,
  onSaveLead
}) {
  const [activeNode, setActiveNode] = useState('korfez');
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
      company: appointmentForm.company || 'Neden İzmir Sayfası Ziyaretçisi',
      service: 'Randevu Talebi',
      message: appointmentForm.note || 'İzmir ruhuyla yelken açmak istiyor.',
      trafficSource: 'Neden İzmir Sayfası Randevu'
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
  const mapNodes = {
    korfez: {
      title: "İzmir Körfezi: Geniş Vizyon ve Derinlik",
      icon: "fa-solid fa-water",
      story: "Ofisimizin pencerelerinden baktığımızda gördüğümüz o masmavi körfez, bizim için sadece bir manzara değil; dünyaya açılan vizyonumuzun sınırlarını temsil ediyor. Tıpkı körfezin dalgaları gibi dijital pazarlamada da dinamik, yerinde duramayan ve sürekli yenilenen bir akışla hareket ediyoruz. Bu derinlik, reklam kampanyalarınızın sadece yüzeyine değil, en dipteki dönüşüm verilerine kadar inmemizi sağlıyor.",
      color: "var(--primary)"
    },
    zeytin: {
      title: "Zeytin Ağaçları: Sabır, Sadakat ve Derin Kökler",
      icon: "fa-solid fa-seedling",
      story: "Ege'nin asırlık zeytin ağaçlarından ilham aldık. Dijital dünyada 'bir gecede zengin olma' vaatlerine inanmıyoruz. Bizim amacımız, markanızın tıpkı bir zeytin ağacı gibi uzun ömürlü, her türlü piyasa koşuluna dayanıklı ve köklü olmasını sağlamak. Sabırla, sadakatle ve doğru optimizasyonlarla inşa ettiğimiz reklam yapıları, markanızın geleceğini nesiller boyu güvence altına alıyor.",
      color: "var(--secondary)"
    },
    begonvil: {
      title: "Begonviller: Yaratıcılık, Tutku ve Renk",
      icon: "fa-solid fa-leaf",
      story: "Ege sokaklarını süsleyen begonvillerin o canlı pembesi, bizim yaratıcı ruhumuzdur. Tekdüze tasarımlara, sıkıcı reklamlara ve sıradan metinlere karşıyız. Begonvillerin güneşi sevdiği gibi, biz de markanızın spot ışıkları altında parlamasını istiyoruz. Kampanyalarımıza, tasarımlarımıza ve marka hikayelerinize kattığımız begonvil pembesi dokunuşlar, hedef kitlenizin zihninde kalıcı izler bırakıyor.",
      color: "#d946ef"
    },
    liman: {
      title: "Kadim Liman: Küresel Ticaretin Dijital Kapısı",
      icon: "fa-solid fa-ship",
      story: "Binlerce yıldır dünyanın dört bir yanından gelen gemilere ev sahipliği yapmış İzmir Limanı, bugün e-ihracatın ve küresel ticaretin merkezidir. Biz, Ege'nin yerel üreticilerinin ve markalarının o muazzam üretim gücünü alıyor; Google Ads, Meta Ads ve SEO uzmanlığımızla küresel pazarlara ihraç ediyoruz. Sınırları kaldırıyor, yerel değerlerinizi dünyaya açıyoruz.",
      color: "var(--accent-teal)"
    }
  };
  return <div className="izmir-page-view container">
      {/* Navigation & Breadcrumb */}
      <div className="service-page-nav">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Ana Sayfaya Dön
        </button>
        <div className="breadcrumb">
          <span>Ana Sayfa</span> &rarr; <span className="active">Neden İzmir?</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="izmir-hero-header">
        <h1 className="izmir-hero-title">Körfezin Rüzgarıyla Büyüyen <br /><span>Bir Dijital Hikaye</span></h1>
        <p className="izmir-hero-desc">
          Biz sadece verilerle konuşan bir ajans değiliz; Ege'nin samimiyetini, zeytinin sadakatini ve körfezin imbatını kodlarımıza ve stratejilerimize işleyen bir ekibiz.
        </p>
      </div>

      {/* Main Emotional Story Section */}
      <div className="glass-card izmir-story-card">
        <div className="story-content">
          <span className="story-tag">BİZİM HİKAYEMİZ</span>
          <h2>Toprağımıza ve Maviye Duyduğumuz Aşkla</h2>
          <p>
            Ajans Rota olarak, yola İzmir'de çıktık. Çünkü Ege'nin insanı gibi samimi, üreticisi gibi çalışkan ve doğası gibi canlı olmayı seviyoruz. Ege'nin zeytin ağaçlarından sabırla ve köklü yapılarla büyümeyi; Kemeraltı'nın kadim esnafından dürüstlüğü ve yüz yüze güvene dayalı ticareti öğrendik.
          </p>
          <p>
            Herkesin tek bir ofise hapsolduğu geleneksel yapıları geride bırakıyoruz. Biz, Ege'nin farklı köşelerinden uzaktan çalışan, ancak kalbi İzmir körfezinin rüzgarıyla ortak atan özgür ve proaktif bir ekibiz. Markalarımıza sadece soğuk 'bütçe panelleri' olarak bakmak yerine, düzenli çevrimiçi buluşmalar ve yüz yüze kahve sohbetleriyle büyüme hedeflerimizi omuz omuza planlayan bir aileyiz.
          </p>
          <div className="story-quote">
            <i className="fa-solid fa-quote-left"></i>
            <span>"Ege'nin köklü zeytinliklerinden İzmir limanının küresel gücüne kadar uzanan bu toprakların potansiyelini dijital dünyaya ihraç etmek bizim en büyük tutkumuz."</span>
          </div>
        </div>
        
        {/* Dynamic Visual Map */}
        <div className="story-visual">
          <div className="visual-gulf-map">
            <div className="map-center-orb">
              <i className="fa-solid fa-compass logo-icon"></i>
              <span>ROTA</span>
            </div>
            
            {/* Connection Lines */}
            <div className={`map-line line-korfez ${activeNode === 'korfez' ? 'active' : ''}`}></div>
            <div className={`map-line line-zeytin ${activeNode === 'zeytin' ? 'active' : ''}`}></div>
            <div className={`map-line line-begonvil ${activeNode === 'begonvil' ? 'active' : ''}`}></div>
            <div className={`map-line line-liman ${activeNode === 'liman' ? 'active' : ''}`}></div>
            
            {/* Interactive Nodes */}
            <button className={`map-node node-korfez ${activeNode === 'korfez' ? 'active' : ''}`} onClick={() => setActiveNode('korfez')} title="İzmir Körfezi">
              <i className="fa-solid fa-water"></i>
            </button>
            <button className={`map-node node-zeytin ${activeNode === 'zeytin' ? 'active' : ''}`} onClick={() => setActiveNode('zeytin')} title="Zeytin Ağaçları">
              <i className="fa-solid fa-seedling"></i>
            </button>
            <button className={`map-node node-begonvil ${activeNode === 'begonvil' ? 'active' : ''}`} onClick={() => setActiveNode('begonvil')} title="Begonviller">
              <i className="fa-solid fa-leaf"></i>
            </button>
            <button className={`map-node node-liman ${activeNode === 'liman' ? 'active' : ''}`} onClick={() => setActiveNode('liman')} title="İzmir Limanı">
              <i className="fa-solid fa-ship"></i>
            </button>
          </div>
          
          <div className="active-node-details">
            <div className="node-detail-header" style={{
            color: mapNodes[activeNode].color
          }}>
              <i className={mapNodes[activeNode].icon}></i>
              <h3>{mapNodes[activeNode].title}</h3>
            </div>
            <p>{mapNodes[activeNode].story}</p>
          </div>
        </div>
      </div>

      {/* Aegean Core Values Grid */}
      <div className="izmir-values-section">
        <div className="section-header">
          <span className="section-tag">Değerlerimiz</span>
          <h2>Bizi Ege Ajansı Yapan 3 İlke</h2>
          <p className="section-desc">Ege'nin kültürel ve ticari mirasını modern performans pazarlama disipliniyle birleştiriyoruz.</p>
        </div>

        <div className="izmir-values-grid">
          <div className="glass-card value-card">
            <div className="value-icon-wrapper text-primary">
              <i className="fa-solid fa-mug-hot"></i>
            </div>
            <h3>İzmir Samimiyeti & Şeffaflık</h3>
            <p>E-postalara hapsolmuş iletişimleri sevmiyoruz. Ekibimiz uzaktan (remote) çalışsa da, haftalık çevrimiçi toplantılarımızda ve İzmir'in güzel duraklarında yüz yüze bir araya gelerek stratejilerimizi planlıyoruz. Raporlarımızı PDF olarak atıp kaçmak yerine, her detayı şeffaflıkla paylaşıyoruz.</p>
          </div>
          
          <div className="glass-card value-card">
            <div className="value-icon-wrapper text-secondary">
              <i className="fa-solid fa-wind"></i>
            </div>
            <h3>Ege Çevikliği (Agility)</h3>
            <p>Tıpkı Ege denizinin dinamik rüzgarları gibi, biz de markanızın reklam kampanyalarına hız ve esneklik kazandırıyoruz. Kampanya süreçlerindeki anlık veri değişimlerine ve küresel algoritma güncellemelerine en hızlı şekilde adapte oluyoruz.</p>
          </div>

          <div className="glass-card value-card">
            <div className="value-icon-wrapper text-accent">
              <i className="fa-solid fa-coins"></i>
            </div>
            <h3>Kemeraltı Esnaf Dürüstlüğü</h3>
            <p>Kemeraltı, dünyanın en köklü ticaret merkezlerinden biridir ve oradaki ticaretin özü 'güven'dir. Bu kadim mirası yaşatıyor, markanıza sadece harcayabileceğiniz reklam bütçesini değil, size gerçekten kazandıracak en dürüst ve karlı dijital rotayı çiziyoruz.</p>
          </div>
        </div>
      </div>

      {/* Boyoz & Coffee - Emotional Connection Card */}
      <div className="glass-card izmir-coffee-card">
        <div className="coffee-image">
          <div className="coffee-cup-visual">
            <i className="fa-solid fa-mug-saucer cup-icon"></i>
            <div className="steam-line steam-1"></div>
            <div className="steam-line steam-2"></div>
            <div className="steam-line steam-3"></div>
            <div className="olive-decor">
              <i className="fa-solid fa-seedling"></i>
              <i className="fa-solid fa-anchor"></i>
            </div>
          </div>
        </div>
        <div className="coffee-text">
          <h2>"Bir Kahve İçmeye Bekleriz"</h2>
          <p>
            Bizim için her iş ortaklığı bir fincan kahveyle başlar. Bizi sadece reklam bütçenizi yöneten bir tedarikçi olarak değil, markanızı birlikte büyüteceğimiz bir Ege dostu olarak görün istiyoruz.
          </p>
          <p>
            Ege'nin samimi ruhunu dijital dünyada hissetmek ve markasını küresel pazarlara taşımak isteyen tüm üretici ve e-ticaret markalarımıza kapımız her zaman açıktır. Dilediğiniz an çevrimiçi bir kahve toplantısı planlayalım ya da İzmir'in güzel bir köşesinde, sıcak bir boyoz ve taze demlenmiş çay eşliğinde dijital rotanızı birlikte çizelim.
          </p>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="glass-card service-bottom-cta">
        <div className="cta-content">
          <h2>Ege’nin Ruhuyla Küresel Dijital Sularda Yelken Açın</h2>
          <p>İzmir'in ticari gücünü veriye dayalı stratejilerle küresel pazarlara taşımak için formu doldurun, rotanızı çizmeye başlayalım.</p>
        </div>
        <div className="cta-action">
          <button className="btn btn-primary cta-btn" onClick={() => setIsModalOpen(true)}>
            Bizimle İletişime Geçin <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

      {/* Glassmorphic Modal Overlay */}
      {isModalOpen && <div className="modal-overlay" onClick={closeModal} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '1.5rem',
      animation: 'fadeIn 0.2s ease-out'
    }}>
          <div className="glass-card" onClick={e => e.stopPropagation()} style={{
        maxWidth: '500px',
        width: '100%',
        padding: '2.5rem 2rem',
        position: 'relative',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        background: 'rgba(15, 23, 42, 0.85)',
        color: 'var(--text-light)',
        animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
            {/* Close button */}
            <button onClick={closeModal} aria-label="Kapat" style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          color: 'var(--text-muted)',
          fontSize: '1rem',
          cursor: 'pointer',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }} onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.color = '#ffffff';
        }} onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.color = 'var(--text-muted)';
        }}>
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
              color: 'var(--text-dark)',
              fontWeight: '700',
              lineHeight: '1.2'
            }}>
                    Küresel Sularda Yelken Açın
                  </h3>
                  <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginTop: '0.5rem',
              lineHeight: '1.4'
            }}>
                    Aşağıdaki formu doldurarak Ege'nin ruhuyla büyüme rotanızı belirleyeceğimiz ücretsiz 15 dakikalık tanışma toplantısını rezerve edin.
                  </p>
                </div>

                <form onSubmit={handleAppointmentSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
                  <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}>
                    <label style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'var(--text-muted)'
              }}>Adınız Soyadınız *</label>
                    <input type="text" required placeholder="Örn. Can Yılmaz" value={appointmentForm.name} onChange={e => setAppointmentForm({
                ...appointmentForm,
                name: e.target.value
              })} style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.03)',
                color: 'var(--text-dark)',
                fontSize: '0.9rem',
                transition: 'border-color 0.2s'
              }} className="form-input" />
                  </div>

                  <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
                    <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}>
                      <label style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--text-muted)'
                }}>E-posta *</label>
                      <input type="email" required placeholder="isim@sirket.com" value={appointmentForm.email} onChange={e => setAppointmentForm({
                  ...appointmentForm,
                  email: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: 'var(--text-dark)',
                  fontSize: '0.9rem'
                }} className="form-input" />
                    </div>
                    <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}>
                      <label style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--text-muted)'
                }}>Telefon *</label>
                      <input type="tel" required placeholder="0555 555 5555" value={appointmentForm.phone} onChange={e => setAppointmentForm({
                  ...appointmentForm,
                  phone: e.target.value
                })} style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: 'var(--text-dark)',
                  fontSize: '0.9rem'
                }} className="form-input" />
                    </div>
                  </div>

                  <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}>
                    <label style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'var(--text-muted)'
              }}>Şirket Adı</label>
                    <input type="text" placeholder="Şirketiniz veya Web Siteniz" value={appointmentForm.company} onChange={e => setAppointmentForm({
                ...appointmentForm,
                company: e.target.value
              })} style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.03)',
                color: 'var(--text-dark)',
                fontSize: '0.9rem'
              }} className="form-input" />
                  </div>

                  <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}>
                    <label style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'var(--text-muted)'
              }}>Mesaj / Not</label>
                    <textarea placeholder="Projelerinizden ve ekibimizden beklentilerinizden kısaca bahsedin..." rows="3" value={appointmentForm.note} onChange={e => setAppointmentForm({
                ...appointmentForm,
                note: e.target.value
              })} style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.03)',
                color: 'var(--text-dark)',
                fontSize: '0.9rem',
                resize: 'none'
              }} className="form-input" />
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
              </> : <div style={{
          textAlign: 'center',
          padding: '1rem 0'
        }}>
                <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: '#22c55e',
            fontSize: '2rem'
          }}>
                  <i className="fa-solid fa-check"></i>
                </div>
                <h4 style={{
            color: 'var(--text-dark)',
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

// Featured Stories for Slider

// Helper to transform a testimonial item to case study format
