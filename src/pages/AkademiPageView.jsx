import { useState } from 'react';

export default // ==========================================
// 4. ROTA AKADEMİ (REHBERLER & PDF PORTALI)
// ==========================================
function AkademiPageView({
  onBack,
  onSaveLead,
  logHit
}) {
  const [selectedGuide, setSelectedGuide] = useState(null); // Card selected for download modal
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState('');
  const guides = [{
    id: 'export',
    title: "Ege'den Dünyaya E-İhracat Rehberi",
    desc: "İzmir ve Ege'deki yerel üreticiler ve işletmeler için Amazon, Etsy ve Shopify üzerinden yurt dışı pazarlara açılma kılavuzu.",
    icon: "fa-solid fa-globe",
    color: "var(--primary)",
    pages: "42 sayfa PDF",
    outline: ["Ege ürünleri için pazar seçimi", "Etsy & Amazon mağaza kurulum sırları", "Lojistik & Gümrükleme süreçleri", "Global Meta reklam bütçesi yönetimi"]
  }, {
    id: 'tourism',
    title: "Konaklama ve Turizm Dijital Büyüme Kılavuzu",
    desc: "Butik oteller, acenteler ve turizm işletmeleri için dijital reklamlar ve SEO ile doğrudan turist kazanma yöntemleri.",
    icon: "fa-solid fa-hotel",
    color: "var(--secondary)",
    pages: "35 sayfa PDF",
    outline: ["Google Otel Reklamları entegrasyonu", "İngilizce & Almanca SEO kurguları", "Sosyal medyada görsel deneyim tasarımı", "Mevsim dışı dönemde rezervasyon artırma"]
  }, {
    id: 'cro',
    title: "E-Ticarette Dönüşüm Oranı Artırma (CRO) Kontrol Listesi",
    desc: "Web sitenize gelen trafiği satışa dönüştürme oranını %50'ye kadar artırabilecek 28 maddelik teknik ve tasarımsal kontrol listesi.",
    icon: "fa-solid fa-cart-flatbed-suitcases",
    color: "var(--accent-teal)",
    pages: "18 sayfa PDF",
    outline: ["Sepet terk etme oranlarını düşürme", "Tek tıkla ödeme ve UX kuralları", "Hız optimizasyonunun dönüşüme etkisi", "Kullanıcı güven ve kanıt etiketleri"]
  }];
  const handleOpenDownloadModal = guide => {
    setSelectedGuide(guide);
    setFullName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setLeadSubmitted(false);
    setLeadError('');
  };
  const handleDownloadSubmit = async e => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      setLeadError('Lütfen zorunlu alanları doldurun.');
      return;
    }
    setLeadLoading(true);
    setLeadError('');
    const leadPayload = {
      fullName,
      email,
      phone,
      company: company || 'Akademi Ziyaretçisi',
      service: `Rehber İndirme - ${selectedGuide.title}`,
      message: `${selectedGuide.title} isimli PDF dokümanını indirdi.`,
      trafficSource: 'Rota Akademi Portalı'
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
        logHit('akademi', `download_pdf_${selectedGuide.id}`);
      }
      setLeadLoading(false);
      setLeadSubmitted(true);
    } catch (err) {
      console.error(err);
      if (typeof onSaveLead === 'function') {
        onSaveLead(leadPayload);
      }
      if (typeof logHit === 'function') {
        logHit('akademi', `download_pdf_${selectedGuide.id}`);
      }
      setLeadLoading(false);
      setLeadSubmitted(true); // Fallback to show success screen and let user get PDF
    }
  };
  return <div className="akademi-page container" style={{
    paddingTop: '6rem',
    paddingBottom: '4rem',
    minHeight: '100vh'
  }}>
      <div className="service-page-nav">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Ana Sayfaya Dön
        </button>
        <div className="breadcrumb">
          <span>Ana Sayfa</span> &rarr; <span className="active">Rota Akademi</span>
        </div>
      </div>

      <div className="izmir-hero-header">
        <h1 className="izmir-hero-title">Rota Büyüme <br /><span>Akademi ve Kılavuzlar</span></h1>
        <p className="izmir-hero-desc">
          E-İhracat, dijital pazarlama, turizm reklamcılığı ve dönüşüm optimizasyonu konularında hazırladığımız ücretsiz premium PDF kaynakları indirin, işinizi büyütün.
        </p>
      </div>

      {/* Guides Grid */}
      <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
        {guides.map(g => <div className="glass-card" key={g.id} style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
            <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem'
        }}>
              <i className={g.icon} style={{
            fontSize: '1.5rem',
            color: g.color
          }}></i>
            </div>
            <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.15rem',
          color: 'var(--text-light)',
          marginBottom: '0.5rem',
          fontWeight: '700',
          lineHeight: '1.3'
        }}>{g.title}</h3>
            <span style={{
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          display: 'block',
          marginBottom: '0.75rem',
          fontWeight: '600'
        }}><i className="fa-regular fa-file-pdf"></i> {g.pages}</span>
            <p style={{
          fontSize: '0.8rem',
          color: 'var(--text-main)',
          lineHeight: '1.5',
          marginBottom: '1.25rem',
          flexGrow: 1
        }}>{g.desc}</p>
            
            <div style={{
          background: 'rgba(255,255,255,0.01)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '0.75rem',
          marginBottom: '1.5rem'
        }}>
              <span style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: 'var(--text-light)',
            display: 'block',
            marginBottom: '0.25rem'
          }}>Rehber İçeriği:</span>
              <ul style={{
            paddingLeft: '1rem',
            margin: 0,
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem'
          }}>
                {g.outline.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>

            <button onClick={() => handleOpenDownloadModal(g)} className="btn btn-secondary" style={{
          width: '100%',
          fontSize: '0.85rem',
          padding: '0.6rem',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem'
        }}>
              <i className="fa-solid fa-download"></i> Ücretsiz İndir
            </button>
          </div>)}
      </div>

      {/* Lead Modal to Download */}
      {selectedGuide && <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999
    }}>
          <div className="glass-card" style={{
        maxWidth: '450px',
        width: '90%',
        padding: '2rem',
        position: 'relative'
      }}>
            <button onClick={() => setSelectedGuide(null)} style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: '1.25rem',
          cursor: 'pointer'
        }}><i className="fa-solid fa-xmark"></i></button>
            
            <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.15rem',
          color: 'var(--text-light)',
          marginBottom: '0.5rem',
          fontWeight: '700'
        }}>Rehber Talebi</h3>
            <p style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: '1.25rem',
          lineHeight: '1.4'
        }}>
              <strong>{selectedGuide.title}</strong> rehberini e-posta adresinize talep etmek için aşağıdaki formu doldurun.
            </p>

            {!leadSubmitted ? <form onSubmit={handleDownloadSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
                <input type="text" required placeholder="Adınız Soyadınız *" value={fullName} onChange={e => setFullName(e.target.value)} style={{
            width: '100%',
            padding: '0.55rem 0.8rem',
            borderRadius: '6px',
            border: '1px solid var(--glass-border)',
            background: 'rgba(15, 23, 42, 0.02)',
            color: 'var(--text-light)',
            fontSize: '0.8rem'
          }} />
                <input type="email" required placeholder="E-posta Adresiniz *" value={email} onChange={e => setEmail(e.target.value)} style={{
            width: '100%',
            padding: '0.55rem 0.8rem',
            borderRadius: '6px',
            border: '1px solid var(--glass-border)',
            background: 'rgba(15, 23, 42, 0.02)',
            color: 'var(--text-light)',
            fontSize: '0.8rem'
          }} />
                <input type="tel" required placeholder="Telefon Numaranız *" value={phone} onChange={e => setPhone(e.target.value)} style={{
            width: '100%',
            padding: '0.55rem 0.8rem',
            borderRadius: '6px',
            border: '1px solid var(--glass-border)',
            background: 'rgba(15, 23, 42, 0.02)',
            color: 'var(--text-light)',
            fontSize: '0.8rem'
          }} />
                <input type="text" placeholder="Firma Adınız" value={company} onChange={e => setCompany(e.target.value)} style={{
            width: '100%',
            padding: '0.55rem 0.8rem',
            borderRadius: '6px',
            border: '1px solid var(--glass-border)',
            background: 'rgba(15, 23, 42, 0.02)',
            color: 'var(--text-light)',
            fontSize: '0.8rem'
          }} />
                {leadError && <span style={{
            color: '#ef4444',
            fontSize: '0.75rem'
          }}>{leadError}</span>}
                <button type="submit" className="btn btn-primary" disabled={leadLoading} style={{
            borderRadius: '6px',
            padding: '0.65rem',
            fontSize: '0.85rem',
            width: '100%',
            fontWeight: '600'
          }}>
                  {leadLoading ? 'Talebiniz Alınıyor...' : 'Rehber Talebi Gönder'}
                </button>
              </form> : <div style={{
          textAlign: 'center',
          padding: '1rem 0'
        }}>
                <i className="fa-solid fa-circle-check" style={{
            fontSize: '2.5rem',
            color: '#22c55e',
            marginBottom: '1rem'
          }}></i>
                <h4 style={{
            color: 'var(--text-light)',
            fontSize: '1.1rem',
            marginBottom: '0.5rem',
            fontWeight: '700'
          }}>Rehber İsteği Gönderildi!</h4>
                <p style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            marginBottom: '1.5rem',
            lineHeight: '1.5'
          }}>
                  Tebrikler! Rehberiniz en kısa sürede hazırlanarak belirttiğiniz <strong>{email}</strong> e-posta adresine iletilecektir.
                </p>
                <button onClick={() => setSelectedGuide(null)} className="btn btn-primary" style={{
            padding: '0.65rem 1.5rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            width: '100%',
            fontWeight: '600'
          }}>
                  Kapat
                </button>
              </div>}
          </div>
        </div>}

    </div>;
}
// ==========================================
// 5. GLOBAL WHATSAPP CHAT WIDGET
// ==========================================
