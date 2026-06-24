import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { budgetSteps, initialServicePagesData, featuredStories, initialTeamMembers, initialBlogPosts, categories, whyAgencyData, testimonials } from '../data/mockData';
import FadeIn from '../components/FadeIn';
import StaggerContainer, { StaggerItem } from '../components/StaggerContainer';
import ClientTransparencyPageView from '../components/ClientTransparencyPageView';

export default // ==========================================
// 1. KOBİ DİJİTALLESME ENDEKSİ BİLEŞENİ
// ==========================================
function KobiIndexPageView({
  onBack,
  onSaveLead
}) {
  const [district, setDistrict] = useState('Bornova');
  const [sector, setSector] = useState('ecommerce');
  const [q1, setQ1] = useState(null); // Website
  const [q2, setQ2] = useState(null); // Google Maps
  const [q3, setQ3] = useState(null); // Paid Ads
  const [q4, setQ4] = useState(null); // CRM/Email
  const [showScore, setShowScore] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState('');
  const calculateScore = () => {
    let score = 10;
    if (q1 === 'yes') score += 25;
    if (q2 === 'yes') score += 25;
    if (q3 === 'yes') score += 25;
    if (q4 === 'yes') score += 15;
    return score;
  };
  const handleStartCalculation = e => {
    e.preventDefault();
    if (q1 === null || q2 === null || q3 === null || q4 === null) {
      alert("Lütfen tüm analiz sorularını yanıtlayın.");
      return;
    }
    setShowScore(true);
    setLeadSubmitted(false);
  };
  const handleSubmitLead = async e => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      setLeadError('Lütfen zorunlu alanları doldurun.');
      return;
    }
    setLeadLoading(true);
    setLeadError('');
    const score = calculateScore();
    const leadPayload = {
      fullName,
      email,
      phone,
      company: `${district} - KOBİ Analizi`,
      service: 'KOBİ Dijitalleşme Endeksi Analizi',
      message: `İlçe: ${district}\nSektör: ${sector}\nDijital Skor: %${score}\nWeb Sitesi: ${q1}\nGoogle Harita: ${q2}\nReklamlar: ${q3}\nCRM/Pazarlama: ${q4}`,
      trafficSource: 'KOBİ Endeksi Sayfası'
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
      setLeadLoading(false);
      setLeadSubmitted(true);
    } catch (err) {
      console.error(err);
      if (typeof onSaveLead === 'function') {
        onSaveLead(leadPayload);
      }
      setLeadLoading(false);
      setLeadSubmitted(true);
    }
  };
  const score = calculateScore();
  return <div className="kobi-index-page container" style={{
    paddingTop: '6rem',
    paddingBottom: '4rem',
    minHeight: '100vh'
  }}>
      <div className="service-page-nav">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Ana Sayfaya Dön
        </button>
        <div className="breadcrumb">
          <span>Ana Sayfa</span> &rarr; <span className="active">KOBİ Dijitalleşme Endeksi</span>
        </div>
      </div>

      <div className="izmir-hero-header">
        <h1 className="izmir-hero-title">İzmir KOBİ <br /><span>Dijitalleşme Endeksi</span></h1>
        <p className="izmir-hero-desc">
          İlçenizi ve sektörünüzü seçin, web sitenizin ve dijital pazarlama süreçlerinizin durumunu görerek İzmir ortalamasındaki yerinizi saniyeler içinde öğrenin.
        </p>
      </div>

      {!showScore ? <div className="glass-card" style={{
      maxWidth: '750px',
      margin: '0 auto',
      padding: '2.5rem'
    }}>
          <form onSubmit={handleStartCalculation} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
            <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem'
        }}>
              <div>
                <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '0.4rem',
              color: 'var(--text-light)'
            }}>Bulunduğunuz İlçe</label>
                <select value={district} onChange={e => setDistrict(e.target.value)} style={{
              width: '100%',
              padding: '0.65rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)',
              background: '#fff',
              color: 'var(--text-light)',
              fontSize: '0.85rem'
            }}>
                  <option value="Alsancak / Konak">Alsancak / Konak</option>
                  <option value="Karşıyaka / Bostanlı">Karşıyaka / Bostanlı</option>
                  <option value="Bornova">Bornova</option>
                  <option value="Bayraklı">Bayraklı</option>
                  <option value="Çeşme / Alaçatı">Çeşme / Alaçatı</option>
                  <option value="Urla">Urla</option>
                  <option value="Buca">Buca</option>
                  <option value="Gaziemir">Gaziemir</option>
                </select>
              </div>
              <div>
                <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '0.4rem',
              color: 'var(--text-light)'
            }}>Sektörünüz</label>
                <select value={sector} onChange={e => setSector(e.target.value)} style={{
              width: '100%',
              padding: '0.65rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)',
              background: '#fff',
              color: 'var(--text-light)',
              fontSize: '0.85rem'
            }}>
                  <option value="ecommerce">E-Ticaret / Online Satış</option>
                  <option value="tourism">Turizm / Butik Otel / Acente</option>
                  <option value="retail">Perakende / Fiziki Mağaza</option>
                  <option value="food">Restoran / Gıda Üreticisi</option>
                  <option value="service">Hizmet / Danışmanlık / Sağlık</option>
                </select>
              </div>
            </div>

            <hr style={{
          border: 'none',
          borderBottom: '1px solid var(--glass-border)',
          margin: '0.5rem 0'
        }} />

            {/* Questions */}
            <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
              <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
                <span style={{
              fontSize: '0.9rem',
              color: 'var(--text-light)',
              fontWeight: '500'
            }}>1. Aktif, mobil uyumlu ve hızlı açılan bir web siteniz var mı?</span>
                <div style={{
              display: 'flex',
              gap: '0.5rem'
            }}>
                  <button type="button" onClick={() => setQ1('yes')} style={{
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                border: '1px solid var(--glass-border)',
                background: q1 === 'yes' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: q1 === 'yes' ? '#fff' : 'var(--text-light)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: '0.2s'
              }}>Evet</button>
                  <button type="button" onClick={() => setQ1('no')} style={{
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                border: '1px solid var(--glass-border)',
                background: q1 === 'no' ? '#ef4444' : 'rgba(255,255,255,0.05)',
                color: q1 === 'no' ? '#fff' : 'var(--text-light)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: '0.2s'
              }}>Hayır</button>
                </div>
              </div>

              <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
                <span style={{
              fontSize: '0.9rem',
              color: 'var(--text-light)',
              fontWeight: '500'
            }}>2. Google Haritalar (My Business) kaydınız güncel ve yorumlarınız yanıtlanıyor mu?</span>
                <div style={{
              display: 'flex',
              gap: '0.5rem'
            }}>
                  <button type="button" onClick={() => setQ2('yes')} style={{
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                border: '1px solid var(--glass-border)',
                background: q2 === 'yes' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: q2 === 'yes' ? '#fff' : 'var(--text-light)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: '0.2s'
              }}>Evet</button>
                  <button type="button" onClick={() => setQ2('no')} style={{
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                border: '1px solid var(--glass-border)',
                background: q2 === 'no' ? '#ef4444' : 'rgba(255,255,255,0.05)',
                color: q2 === 'no' ? '#fff' : 'var(--text-light)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: '0.2s'
              }}>Hayır</button>
                </div>
              </div>

              <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
                <span style={{
              fontSize: '0.9rem',
              color: 'var(--text-light)',
              fontWeight: '500'
            }}>3. Google Ads, Instagram veya Facebook üzerinde aktif ücretli reklam veriyor musunuz?</span>
                <div style={{
              display: 'flex',
              gap: '0.5rem'
            }}>
                  <button type="button" onClick={() => setQ3('yes')} style={{
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                border: '1px solid var(--glass-border)',
                background: q3 === 'yes' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: q3 === 'yes' ? '#fff' : 'var(--text-light)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: '0.2s'
              }}>Evet</button>
                  <button type="button" onClick={() => setQ3('no')} style={{
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                border: '1px solid var(--glass-border)',
                background: q3 === 'no' ? '#ef4444' : 'rgba(255,255,255,0.05)',
                color: q3 === 'no' ? '#fff' : 'var(--text-light)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: '0.2s'
              }}>Hayır</button>
                </div>
              </div>

              <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
                <span style={{
              fontSize: '0.9rem',
              color: 'var(--text-light)',
              fontWeight: '500'
            }}>4. Müşteri veritabanınızı tutup düzenli olarak e-posta/SMS pazarlaması yapıyor musunuz?</span>
                <div style={{
              display: 'flex',
              gap: '0.5rem'
            }}>
                  <button type="button" onClick={() => setQ4('yes')} style={{
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                border: '1px solid var(--glass-border)',
                background: q4 === 'yes' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: q4 === 'yes' ? '#fff' : 'var(--text-light)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: '0.2s'
              }}>Evet</button>
                  <button type="button" onClick={() => setQ4('no')} style={{
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                border: '1px solid var(--glass-border)',
                background: q4 === 'no' ? '#ef4444' : 'rgba(255,255,255,0.05)',
                color: q4 === 'no' ? '#fff' : 'var(--text-light)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: '0.2s'
              }}>Hayır</button>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{
          padding: '0.8rem',
          borderRadius: '8px',
          fontSize: '0.95rem',
          fontWeight: '600',
          marginTop: '1rem'
        }}>
              Endeksi Hesapla & Analiz Et
            </button>
          </form>
        </div> : <div style={{
      maxWidth: '850px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      gap: '2rem'
    }} className="seo-result-grid">
          {/* Score Card */}
          <div className="glass-card" style={{
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
            <span className="story-tag" style={{
          marginBottom: '1.5rem'
        }}>DİJİTAL OLGUNLUK SKORUNUZ</span>
            <div className="svg-gauge-wrapper" style={{
          position: 'relative',
          width: '130px',
          height: '130px'
        }}>
              <svg width="130" height="130" viewBox="0 0 130 130" style={{
            transform: 'rotate(-90deg)'
          }}>
                <circle cx="65" cy="65" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="65" cy="65" r="50" fill="none" stroke={score >= 75 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444'} strokeWidth="8" strokeDasharray={2 * Math.PI * 50} strokeDashoffset={2 * Math.PI * 50 - score / 100 * (2 * Math.PI * 50)} strokeLinecap="round" />
              </svg>
              <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
                <span style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              color: 'var(--text-light)'
            }}>%{score}</span>
              </div>
            </div>

            <div style={{
          marginTop: '1.5rem',
          fontSize: '0.85rem',
          color: 'var(--text-main)',
          lineHeight: '1.5'
        }}>
              <strong>{district}</strong> bölgesindeki <strong>{sector === 'ecommerce' ? 'E-Ticaret' : sector === 'tourism' ? 'Turizm' : 'Hizmet/Perakende'}</strong> sektör ortalaması <strong>%62</strong> düzeyindedir. Siteniz bölgenizdeki rakiplerinize kıyasla {score >= 62 ? <span style={{
            color: '#22c55e',
            fontWeight: '700'
          }}>daha iyi konumda!</span> : <span style={{
            color: '#ef4444',
            fontWeight: '700'
          }}>geride kalmış durumda.</span>}
            </div>

            <div style={{
          borderTop: '1px solid var(--glass-border)',
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          width: '100%',
          textAlign: 'left'
        }}>
              <h4 style={{
            fontSize: '0.85rem',
            color: 'var(--text-light)',
            marginBottom: '0.5rem',
            fontWeight: '700'
          }}>💡 Bölgesel Çözüm Tavsiyesi:</h4>
              <p style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            lineHeight: '1.4',
            margin: 0
          }}>
                {score < 50 && "Temel kurulumlarınız eksik. Hızlıca yerel SEO (Google Harita) ve hızlı bir web sitesi çalışması planlamalısınız."}
                {score >= 50 && score < 75 && "Altyapınız var fakat ücretli reklamlar veya müşteri veritabanı pazarlama (remarketing) bacağınız eksik. Meta & Google reklam bütçenizi optimize ederek işe başlayabilirsiniz."}
                {score >= 75 && "Dijitalleşme düzeyiniz harika! Şimdi rakiplerinize fark atmak ve yurt dışı pazarlarına (e-ihracat / yabancı turist) açılmak için stratejik planlama yapma zamanı."}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="glass-card" style={{
        padding: '2.5rem'
      }}>
            <span className="story-tag" style={{
          marginBottom: '0.75rem',
          color: 'var(--secondary)'
        }}>DANIŞMANLIK TALEBİ</span>
            <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.2rem',
          color: 'var(--text-light)',
          marginBottom: '0.5rem'
        }}>Yerel Büyüme Analizi Alın</h3>
            <p style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: '1.25rem',
          lineHeight: '1.45'
        }}>
              {district} bölgesindeki KOBİ'ler için hazırladığımız özel dijital büyüme ve bütçe planı için bilgilerinizi bırakın, uzman ekibimiz sizi ziyaret etsin veya arasın.
            </p>

            {!leadSubmitted ? <form onSubmit={handleSubmitLead} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
                <input type="text" required placeholder="Adınız Soyadınız *" value={fullName} onChange={e => setFullName(e.target.value)} style={{
            width: '100%',
            padding: '0.55rem 0.8rem',
            borderRadius: '8px',
            border: '1px solid var(--glass-border)',
            background: 'rgba(15, 23, 42, 0.02)',
            color: 'var(--text-light)',
            fontSize: '0.85rem'
          }} />
                <input type="email" required placeholder="E-posta Adresiniz *" value={email} onChange={e => setEmail(e.target.value)} style={{
            width: '100%',
            padding: '0.55rem 0.8rem',
            borderRadius: '8px',
            border: '1px solid var(--glass-border)',
            background: 'rgba(15, 23, 42, 0.02)',
            color: 'var(--text-light)',
            fontSize: '0.85rem'
          }} />
                <input type="tel" required placeholder="Telefon Numaranız *" value={phone} onChange={e => setPhone(e.target.value)} style={{
            width: '100%',
            padding: '0.55rem 0.8rem',
            borderRadius: '8px',
            border: '1px solid var(--glass-border)',
            background: 'rgba(15, 23, 42, 0.02)',
            color: 'var(--text-light)',
            fontSize: '0.85rem'
          }} />
                {leadError && <span style={{
            color: '#ef4444',
            fontSize: '0.75rem'
          }}>{leadError}</span>}
                <button type="submit" className="btn btn-primary" disabled={leadLoading} style={{
            borderRadius: '8px',
            padding: '0.65rem 1.25rem',
            fontSize: '0.85rem',
            width: '100%',
            marginTop: '0.25rem'
          }}>
                  {leadLoading ? 'Gönderiliyor...' : 'Ücretsiz Yol Haritası İste'}
                </button>
              </form> : <div style={{
          backgroundColor: 'rgba(34, 197, 94, 0.08)',
          border: '1px solid rgba(34, 197, 94, 0.25)',
          borderRadius: '8px',
          padding: '0.85rem 1.1rem',
          color: '#16a34a',
          fontSize: '0.8rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
                <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '700'
          }}>
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Talebiniz Başarıyla Alındı!</span>
                </div>
                <p style={{
            margin: 0,
            fontSize: '0.78rem',
            color: 'rgba(22, 163, 74, 0.85)',
            lineHeight: '1.4'
          }}>
                  Bornova/Alsancak ofisimizde yer alan bölgesel büyüme uzmanlarımız, {district} bölgesindeki sektörel rekabeti ve dijitalleşme endeksinizi incelemeye başladı. Size özel büyüme planını sunmak üzere <strong>en kısa sürede (genellikle aynı iş günü içinde)</strong> sizinle iletişime geçeceğiz!
                </p>
              </div>}
          </div>
        </div>}
    </div>;
}

// ==========================================
// 2. KREATİF & REKLAM VİTRİNİ BİLEŞENİ
// ==========================================
