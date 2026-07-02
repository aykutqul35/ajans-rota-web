import { useState } from 'react';

export default // ==========================================
// 2. KREATİF & REKLAM VİTRİNİ BİLEŞENİ
// ==========================================
function CreativeShowcasePageView({
  onBack
}) {
  const [activeBrand, setActiveBrand] = useState('olive'); // 'olive', 'hotel', 'surf', 'coffee'
  const [activeFormat, setActiveFormat] = useState('instagram'); // 'instagram', 'google', 'tiktok'

  const brands = {
    olive: {
      name: "Urla Zeytin Çiftliği",
      category: "E-Ticaret / Organik Gıda",
      instaTitle: "urlazeytincifligi",
      instaText: "Urla'nın kadim topraklarından, tamamen soğuk sıkım erken hasat sızma zeytinyağı sofralarınıza geliyor! Sınırlı üretim sızma zeytinyağlarımızı şimdi inceleyin. 🫒✨",
      instaBg: 'linear-gradient(135deg, #1e3f20 0%, #4a5c36 100%)',
      googleTitle: "Erken Hasat Soğuk Sıkım Sızma Zeytinyağı | Urla Zeytin Çiftliği",
      googleText: "Urla'nın en prestijli bahçelerinden toplanan zeytinlerle asit oranı sıfıra yakın sızma zeytinyağı. Ücretsiz kargo fırsatıyla şimdi sipariş verin.",
      tiktokTitle: "@urlazeytin",
      tiktokText: "Sabah kahvaltılarının sırrı: Urla'dan gelen taze soğuk sıkım yeşil zeytinyağı! 🤤🥗 #urlazeytinyağı #organikgıda #urla #ege",
      cta: "Şimdi Satın Al"
    },
    hotel: {
      name: "Alaçatı Taş Konak",
      category: "Turizm / Butik Otel",
      instaTitle: "alacatitaskonak",
      instaText: "Huzuru Alaçatı'nın kalbinde, begonviller altındaki taş konak odalarımızda yakalayın. Erken rezervasyon dönemine özel %25 indirim fırsatını kaçırmayın. 🌸🔑",
      instaBg: 'linear-gradient(135deg, #0284c7 0%, #1e40af 100%)',
      googleTitle: "Alaçatı Butik Taş Otel Fiyatları | Havuzlu & Bahçeli Konaklama",
      googleText: "Alaçatı merkezde, tarihi taş konak mimarisinde, organik Ege kahvaltısı dahil oda rezervasyonu. Erken rezervasyon indiriminden yararlanın.",
      tiktokTitle: "@alacatitaskonak",
      tiktokText: "Alaçatı'da güne bu organik Ege kahvaltısıyla başladığınızı hayal edin... 🍳🥐 #alacati #butikotel #izmir #tatilkeyfi",
      cta: "Rezervasyon Yap"
    },
    surf: {
      name: "Çeşme Windsurf Akademi",
      category: "Aktivite / Spor Eğitimi",
      instaTitle: "cesmesurfacademy",
      instaText: "Rüzgarı hisset, dalgalara yön ver! Çeşme Alaçatı Koyu'nda milli sporcu antrenörlerimiz eşliğinde windsurf ve kitesurf eğitimleri başladı. 🏄‍♂️💨",
      instaBg: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)',
      googleTitle: "Çeşme Rüzgar Sörfü Eğitimi | Yeni Başlayanlar İçin Surf Kursu",
      googleText: "Çeşme Alaçatı'da her yaşa uygun windsurf ve sörf eğitimleri. Ekipman kiralama ve lisanslı eğitmenlerle güvenli sörf dersleri.",
      tiktokTitle: "@cesmesurfer",
      tiktokText: "Rüzgar sörfüne ilk adım! 🏄‍♂️ 3 saatte sörf tahtasında kalma garantili temel eğitimimiz başladı. #windsurf #cesme #alacati #extremsport",
      cta: "Eğitime Katıl"
    },
    coffee: {
      name: "Tarihi Kemeraltı Kahvecisi",
      category: "Lokal Hizmet / Kafe",
      instaTitle: "kemeraltikahvecisi",
      instaText: "Kemeraltı'nın 80 yıllık kadim hanında, kömür ateşinde pişen bol köpüklü okkalı dibek kahvesi keyfine davetlisiniz. İzmir'in gerçek lezzet durağı. ☕️🪵",
      instaBg: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
      googleTitle: "Tarihi İzmir Dibek Kahvesi | Kemeraltı Lezzet Durakları",
      googleText: "Kemeraltı çarşısında kömürde pişen özel harman dibek kahvesi ve ev yapımı damla sakızlı lokumlar. Klasik İzmir lezzetini keşfedin.",
      tiktokTitle: "@kemeraltikahvecisi",
      tiktokText: "Közde pişen gerçek dibek kahvesinin köpüğü... ☕️ İzmir'de kokusu buraya kadar gelenler? #kemeralti #izmirlezzetleri #dibekkahvesi #kahvekeyfi",
      cta: "Yol Tarifi Al"
    }
  };
  const brand = brands[activeBrand];
  return <div className="creative-showcase-page container" style={{
    paddingTop: '6rem',
    paddingBottom: '4rem',
    minHeight: '100vh'
  }}>
      <div className="service-page-nav">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Ana Sayfaya Dön
        </button>
        <div className="breadcrumb">
          <span>Ana Sayfa</span> &rarr; <span className="active">Kreatif Reklam Vitrini</span>
        </div>
      </div>

      <div className="izmir-hero-header">
        <h1 className="izmir-hero-title">Kreatif & Reklam <br /><span>Vitrini Simülatörü</span></h1>
        <p className="izmir-hero-desc">
          Ege'nin özgün markaları için kurguladığımız dijital reklam modellerini ve formatlarını mobil & masaüstü simülasyon ekranlarında interaktif olarak test edin.
        </p>
      </div>

      {/* Brand & Format Selector Grid */}
      <div style={{
      display: 'grid',
      gridTemplateColumns: '0.8fr 1.2fr',
      gap: '2.5rem',
      maxWidth: '1000px',
      margin: '0 auto'
    }} className="seo-result-grid">
        
        {/* Left Control Panel */}
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
          
          {/* Brand Selection Card */}
          <div className="glass-card" style={{
          padding: '1.5rem'
        }}>
            <h4 style={{
            fontSize: '0.85rem',
            color: 'var(--text-light)',
            fontWeight: '700',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>1. Örnek Ege Markası Seçin</h4>
            <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
              {Object.keys(brands).map(key => <button key={key} onClick={() => setActiveBrand(key)} className={`creative-selector-btn ${activeBrand === key ? 'active' : ''}`}>
                  <strong style={{
                fontSize: '0.85rem'
              }}>{brands[key].name}</strong>
                  <span style={{
                fontSize: '0.7rem',
                opacity: 0.8,
                marginTop: '0.15rem'
              }}>{brands[key].category}</span>
                </button>)}
            </div>
          </div>

          {/* Format Selection Card */}
          <div className="glass-card" style={{
          padding: '1.5rem'
        }}>
            <h4 style={{
            fontSize: '0.85rem',
            color: 'var(--text-light)',
            fontWeight: '700',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>2. Reklam Kanalı / Formatı</h4>
            <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
              <button onClick={() => setActiveFormat('instagram')} className={`format-selector-btn ${activeFormat === 'instagram' ? 'active' : ''}`}>
                <i className="fa-brands fa-instagram" style={{
                fontSize: '1rem'
              }}></i> Instagram Hikaye Reklamı
              </button>
              <button onClick={() => setActiveFormat('google')} className={`format-selector-btn ${activeFormat === 'google' ? 'active' : ''}`}>
                <i className="fa-brands fa-google" style={{
                fontSize: '1rem'
              }}></i> Google Arama Ağı Reklamı
              </button>
              <button onClick={() => setActiveFormat('tiktok')} className={`format-selector-btn ${activeFormat === 'tiktok' ? 'active' : ''}`}>
                <i className="fa-brands fa-tiktok" style={{
                fontSize: '1rem'
              }}></i> TikTok Dikey Video Reklamı
              </button>
            </div>
          </div>

        </div>

        {/* Right Phone/Desktop Mockup Screen */}
        <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
          
          {activeFormat === 'instagram' && <div className="phone-mockup" style={{
          width: '310px',
          height: '560px',
          borderRadius: '36px',
          border: '12px solid #1e293b',
          background: '#000',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }}>
              {/* Speaker & camera notch */}
              <div style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90px',
            height: '18px',
            borderRadius: '10px',
            background: '#1e293b',
            zIndex: '10'
          }}></div>
              {/* Insta Content wrapper */}
              <div style={{
            width: '100%',
            height: '100%',
            background: brand.instaBg,
            padding: '2.5rem 1.25rem 1.25rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            color: '#fff',
            boxSizing: 'border-box',
            position: 'relative'
          }}>
                
                {/* Header bar */}
                <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              zIndex: '2'
            }}>
                  <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>R</div>
                  <div style={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                    <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>{brand.instaTitle}</span>
                    <span style={{
                  fontSize: '0.6rem',
                  opacity: 0.8
                }}>Sponsorlu</span>
                  </div>
                </div>

                {/* Simulated visual art card inside story */}
                <div style={{
              flex: 1,
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(5px)',
              margin: '1.5rem 0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '1.5rem'
            }}>
                  <i className="fa-solid fa-compass" style={{
                fontSize: '2.5rem',
                color: 'var(--secondary)',
                marginBottom: '1rem',
                animation: 'seo-spin 6s linear infinite'
              }}></i>
                  <h3 style={{
                fontSize: '1.25rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: '700',
                color: '#fff',
                margin: '0 0 0.5rem 0',
                lineHeight: '1.3'
              }}>{brand.name}</h3>
                  <span style={{
                fontSize: '0.7rem',
                color: 'var(--accent-teal)',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>{brand.category}</span>
                </div>

                {/* Copy Text */}
                <p style={{
              fontSize: '0.75rem',
              lineHeight: '1.4',
              color: 'rgba(255,255,255,0.95)',
              margin: '0 0 3rem 0',
              zIndex: '2'
            }}>{brand.instaText}</p>

                {/* Swipe up CTA */}
                <div style={{
              position: 'absolute',
              bottom: '1rem',
              left: 0,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem',
              cursor: 'pointer'
            }}>
                  <i className="fa-solid fa-chevron-up" style={{
                fontSize: '0.8rem',
                animation: 'bounce 1.5s infinite',
                color: '#fff'
              }}></i>
                  <span style={{
                background: '#fff',
                color: '#000',
                padding: '0.4rem 1.2rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}>{brand.cta}</span>
                </div>
              </div>
            </div>}

          {activeFormat === 'google' && <div className="desktop-mockup" style={{
          width: '420px',
          height: '280px',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          background: '#fff',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column'
        }}>
              {/* Browser window top bar */}
              <div style={{
            background: '#f1f5f9',
            borderBottom: '1px solid #e2e8f0',
            padding: '0.4rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
                <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ef4444'
            }}></div>
                <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#f59e0b'
            }}></div>
                <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981'
            }}></div>
                <div style={{
              flex: 1,
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              height: '16px',
              marginLeft: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '0.5rem',
              fontSize: '0.6rem',
              color: '#94a3b8'
            }}>google.com/search?q={activeBrand}</div>
              </div>
              {/* Google Result content */}
              <div style={{
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            height: '100%',
            background: '#fff'
          }}>
                <span style={{
              fontSize: '0.65rem',
              color: '#202124',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              marginBottom: '0.2rem'
            }}>
                  <strong style={{
                color: '#202124'
              }}>Sponsorlu</strong> · https://www.{activeBrand}.com
                </span>
                <a href="javascript:void(0)" style={{
              fontSize: '1rem',
              color: '#1a0dab',
              fontWeight: '500',
              textDecoration: 'none',
              lineHeight: '1.3',
              marginBottom: '0.3rem',
              display: 'block'
            }}>
                  {brand.googleTitle}
                </a>
                <p style={{
              fontSize: '0.75rem',
              color: '#4d5156',
              lineHeight: '1.45',
              margin: 0
            }}>
                  {brand.googleText}
                </p>
                <div style={{
              display: 'flex',
              gap: '1.5rem',
              marginTop: '0.75rem',
              borderTop: '1px dashed #e2e8f0',
              paddingTop: '0.5rem'
            }}>
                  <div style={{
                fontSize: '0.7rem',
                color: '#1a0dab'
              }}>➤ %25 Hoş Geldin İndirimi</div>
                  <div style={{
                fontSize: '0.7rem',
                color: '#1a0dab'
              }}>➤ Ücretsiz Hızlı Teslimat</div>
                </div>
              </div>
            </div>}

          {activeFormat === 'tiktok' && <div className="phone-mockup" style={{
          width: '310px',
          height: '560px',
          borderRadius: '36px',
          border: '12px solid #1e293b',
          background: '#000',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }}>
              {/* Speaker notch */}
              <div style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90px',
            height: '18px',
            borderRadius: '10px',
            background: '#1e293b',
            zIndex: '10'
          }}></div>
              
              {/* TikTok Video Wrapper */}
              <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, #111 0%, #000 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '1.25rem',
            boxSizing: 'border-box',
            color: '#fff',
            position: 'relative'
          }}>
                
                {/* Background abstract art simulating video */}
                <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: brand.instaBg,
              opacity: 0.45,
              zIndex: '1'
            }}></div>
                
                {/* Top header navigation */}
                <div style={{
              position: 'absolute',
              top: '2.5rem',
              width: '100%',
              left: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              opacity: 0.8,
              zIndex: '2'
            }}>
                  <span>Takip Ediliyor</span>
                  <span style={{
                borderBottom: '2px solid #fff',
                paddingBottom: '0.2rem'
              }}>Sizin İçin</span>
                </div>

                {/* Right side interaction icons */}
                <div style={{
              position: 'absolute',
              right: '0.75rem',
              bottom: '8rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.25rem',
              zIndex: '2'
            }}>
                  <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                    <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#fe2c55',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}><i className="fa-solid fa-heart"></i></div>
                    <span style={{
                  fontSize: '0.65rem',
                  marginTop: '0.2rem'
                }}>14.2K</span>
                  </div>
                  <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                    <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}><i className="fa-solid fa-comment-dots"></i></div>
                    <span style={{
                  fontSize: '0.65rem',
                  marginTop: '0.2rem'
                }}>452</span>
                  </div>
                  <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                    <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}><i className="fa-solid fa-share"></i></div>
                    <span style={{
                  fontSize: '0.65rem',
                  marginTop: '0.2rem'
                }}>1.1K</span>
                  </div>
                </div>

                {/* Creator name & description overlay */}
                <div style={{
              zIndex: '2',
              marginBottom: '3.5rem',
              maxWidth: '80%'
            }}>
                  <strong style={{
                fontSize: '0.85rem',
                display: 'block',
                marginBottom: '0.3rem'
              }}>{brand.tiktokTitle}</strong>
                  <p style={{
                fontSize: '0.75rem',
                margin: '0 0 0.5rem 0',
                lineHeight: '1.4'
              }}>{brand.tiktokText}</p>
                  <span style={{
                fontSize: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                opacity: 0.8
              }}><i className="fa-solid fa-music"></i> Orijinal Ses - Rota Ajans</span>
                </div>

                {/* TikTok CTA Blue button */}
                <div style={{
              position: 'absolute',
              bottom: '1.25rem',
              left: '1.25rem',
              right: '1.25rem',
              height: '40px',
              background: '#fe2c55',
              color: '#fff',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 1rem',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              zIndex: '2',
              cursor: 'pointer'
            }}>
                  <span>{brand.cta}</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </div>
              </div>
            </div>}

        </div>

      </div>
    </div>;
}

// ==========================================
// 3. SİZ VS RAKİBİNİZ RAKİP ANALİZ BİLEŞENİ
// ==========================================
