import { useNavigate, useLocation } from 'react-router-dom';

export default function Footer({
  settingsData,
  servicesData,
  handleNavClick,
  handleServiceClick,
  navigateTo,
  getAgencyStatus,
  newsletterEmail,
  setNewsletterEmail,
  newsletterLoading,
  newsletterSubmitted,
  newsletterError,
  handleNewsletterSubmit,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <footer className="footer">
      {/* Top CTA Banner */}
      {currentPath !== '/referanslar' && currentPath !== '/ekiplerimiz' && currentPath !== '/neden-izmir' && !currentPath.startsWith('/hizmetlerimiz/') && <div className="container">
          <div className="footer-cta-card">
            <div className="footer-cta-glow"></div>
            <div className="footer-cta-content">
              <div className="footer-cta-text">
                <h3>Ege'nin Dijital Büyüme Ortağıyla Tanışın</h3>
                <p>Markanızın dijital dünyada yeni zirvelere ulaşması ve rotanızı veriye dayalı stratejilerle çizmek için hazır mısınız?</p>
              </div>
              <div className="footer-cta-action">
                <a href="#contact" className="btn btn-primary btn-glow" onClick={e => {
              e.preventDefault();
              handleNavClick('contact');
            }}>
                  <span>Hemen Başlayalım</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>}

      {/* Footer Middle Columns */}
      <div className="container">
        <div className="footer-main-row">
          {/* Brand Block */}
          <div className="footer-brand-section">
            <a href="#" className="logo" onClick={e => {
            e.preventDefault();
            handleNavClick('home');
          }}>
              {settingsData.logo_light || settingsData.logo_dark ? <picture>
                  {settingsData.logo_light_mobile && <source media="(max-width: 768px)" srcSet={settingsData.logo_light_mobile} />}
                  <img src={settingsData.logo_light || settingsData.logo_dark} alt="AJANS ROTA Logo" style={{
                height: '32px',
                objectFit: 'contain'
              }} />
                </picture> : <>
                  <i className="fa-solid fa-compass logo-icon"></i>
                  <span>AJANS ROTA</span>
                </>}
            </a>
            <p>İzmir merkezli performans pazarlama, sosyal medya reklamları ve SEO ajansı. Markanızın büyüme rotasını veriye dayalı stratejilerle çiziyoruz.</p>
            
            <div className="footer-badge" style={{
            width: 'fit-content'
          }}>
              <span className="badge-pulse"></span>
              <span>Ege'nin Lider Büyüme Partneri</span>
            </div>

            {/* Newsletter subscription form */}
            <div className="footer-newsletter">
              <h5>Büyüme Bülteni</h5>
              <p>E-ticaret ve dijital pazarlama rehberlerimiz posta kutunuza gelsin.</p>
              <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                <input type="email" placeholder="E-posta adresiniz" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} disabled={newsletterLoading} required />
                <button type="submit" disabled={newsletterLoading} aria-label="Abone Ol">
                  {newsletterLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
                </button>
              </form>
              {newsletterSubmitted && <span className="newsletter-success">Kayıt Başarılı! Takipte kalın.</span>}
              {newsletterError && <span className="newsletter-error">{newsletterError}</span>}
            </div>
          </div>

          {/* Links Block */}
          <div className="footer-links-section">
            <div className="footer-col">
              <h4>Hizmetlerimiz</h4>
              <ul className="footer-links">
                {Object.keys(servicesData).map(key => <li key={key}>
                    <a href="#" onClick={e => {
                  e.preventDefault();
                  handleServiceClick(key);
                }}>
                      <span className="link-bullet"></span>
                      <span>{servicesData[key].title}</span>
                    </a>
                  </li>)}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Kurumsal</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={e => {
                  e.preventDefault();
                  handleNavClick('home');
                }}><span className="link-bullet"></span><span>Ana Sayfa</span></a></li>
                {!settingsData.hide_page_hakkimizda && <li><a href="/hakkimizda" onClick={e => {
                  e.preventDefault();
                  navigateTo('/hakkimizda');
                }}><span className="link-bullet"></span><span>Hakkımızda</span></a></li>}
                {!settingsData.hide_page_ekiplerimiz && <li><a href="/ekiplerimiz" onClick={e => {
                  e.preventDefault();
                  navigateTo('/ekiplerimiz');
                }}><span className="link-bullet"></span><span>Ekiplerimiz</span></a></li>}
                {!settingsData.hide_page_referanslar && <li><a href="#" onClick={e => {
                  e.preventDefault();
                  handleNavClick('testimonials');
                }}><span className="link-bullet"></span><span>Referanslarımız</span></a></li>}
                {!settingsData.hide_page_izmir && <li><a href="#" onClick={e => {
                  e.preventDefault();
                  handleNavClick('izmir');
                }}><span className="link-bullet"></span><span>Neden İzmir?</span></a></li>}
                {!settingsData.hide_page_blog && <li><a href="/blog" onClick={e => {
                  e.preventDefault();
                  navigateTo('/blog');
                }}><span className="link-bullet"></span><span>Rehber & Blog</span></a></li>}
                {!settingsData.hide_page_iletisim && <li><a href="#" onClick={e => {
                  e.preventDefault();
                  handleNavClick('contact');
                }}><span className="link-bullet"></span><span>İletişime Geçin</span></a></li>}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Büyüme Araçları</h4>
              <ul className="footer-links">
                {!settingsData.hide_page_seo && <li><a href="/seo-analizi" onClick={e => {
                  e.preventDefault();
                  navigateTo('/seo-analizi');
                }}><span className="link-bullet"></span><span>Ücretsiz SEO Analizi</span></a></li>}
                {!settingsData.hide_page_kobi && <li><a href="/kobi-endeksi" onClick={e => {
                  e.preventDefault();
                  navigateTo('/kobi-endeksi');
                }}><span className="link-bullet"></span><span>KOBİ Dijital Endeksi</span></a></li>}
                {!settingsData.hide_page_rakip && <li><a href="/rakip-analizi" onClick={e => {
                  e.preventDefault();
                  navigateTo('/rakip-analizi');
                }}><span className="link-bullet"></span><span>Rakip Analiz Motoru</span></a></li>}
                {!settingsData.hide_page_kreatif && <li><a href="/kreatif-vitrin" onClick={e => {
                  e.preventDefault();
                  navigateTo('/kreatif-vitrin');
                }}><span className="link-bullet"></span><span>Reklam Vitrini</span></a></li>}
                {!settingsData.hide_page_seffaf && <li><a href="/client-portal-secure" onClick={e => {
                  e.preventDefault();
                  navigateTo('/client-portal-secure');
                }}><span className="link-bullet"></span><span>Müşteri Raporlama</span></a></li>}
                {!settingsData.hide_page_akademi && <li><a href="/akademi" onClick={e => {
                  e.preventDefault();
                  navigateTo('/akademi');
                }}><span className="link-bullet"></span><span>Rota Akademi</span></a></li>}
                <li><a href="#" onClick={e => {
                  e.preventDefault();
                  handleNavClick('calculator');
                }}><span className="link-bullet"></span><span>Büyüme Simülatörü</span></a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Hizmet Verdiğimiz Bölgeler ── */}
        <div style={{
          marginTop: '2.5rem',
          padding: '2rem',
          borderRadius: '24px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Dekoratif arka plan */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
            borderRadius: '24px',
          }}>
            <div style={{
              position: 'absolute', top: '-60px', right: '-60px',
              width: '200px', height: '200px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(2,132,199,0.06) 0%, transparent 70%)',
            }} />
            <div style={{
              position: 'absolute', bottom: '-40px', left: '30%',
              width: '150px', height: '150px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)',
            }} />
          </div>

          {/* Başlık */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.75rem',
            position: 'relative', zIndex: 1,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(2,132,199,0.25)',
              }}>
                <i className="fa-solid fa-map-pin" style={{ color: '#fff', fontSize: '0.85rem' }}></i>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                  Hizmet Verdiğimiz Bölgeler
                </h4>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                  Müşterimizin ayağına gidiyoruz
                </p>
              </div>
              <div style={{
                padding: '0.2rem 0.7rem', borderRadius: '999px', fontSize: '0.7rem',
                fontWeight: 700, background: '#e0f2fe',
                color: '#0284c7', border: '1px solid #bae6fd',
              }}>
                47 Lokasyon
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { name: 'İzmir', color: '#0284c7' },
                { name: 'Manisa', color: '#16a34a' },
                { name: 'Aydın', color: '#b45309' },
                { name: 'Muğla', color: '#0369a1' },
                { name: 'Denizli', color: '#7c3aed' },
              ].map((il, i) => (
                <span key={i} style={{
                  fontSize: '0.7rem', fontWeight: 600,
                  color: il.color, opacity: 0.9,
                }}>{il.name}{i < 4 ? ' •' : ''}</span>
              ))}
            </div>
          </div>

          {/* 5 Kolon Grid — Nüfusa Göre Sıralı */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
            gap: '1rem',
            position: 'relative', zIndex: 1,
          }}>

            {[
              {
                il: 'İzmir', emoji: '🏙️', nufus: '4.5M', color: '#0284c7', slug: 'izmir',
                cls: 'iz',
                ilceler: [
                  { label: 'Bornova', slug: 'izmir-bornova' },
                  { label: 'Buca', slug: 'izmir-buca' },
                  { label: 'Karabağlar', slug: 'izmir-karabaglar' },
                  { label: 'Karşıyaka', slug: 'izmir-karsiyaka' },
                  { label: 'Konak', slug: 'izmir-konak' },
                  { label: 'Bayraklı', slug: 'izmir-bayraki' },
                  { label: 'Çiğli', slug: 'izmir-cigli' },
                  { label: 'Çeşme', slug: 'izmir-cesme' },
                  { label: 'Alaçatı', slug: 'izmir-alacati' },
                ],
              },
              {
                il: 'Manisa', emoji: '🏭', nufus: '1.5M', color: '#16a34a', slug: 'manisa',
                cls: 'mn',
                ilceler: [
                  { label: 'Akhisar', slug: 'manisa-akhisar' },
                  { label: 'Turgutlu', slug: 'manisa-turgutlu' },
                  { label: 'Salihli', slug: 'manisa-salihli' },
                  { label: 'Alaşehir', slug: 'manisa-alasehir' },
                  { label: 'Soma', slug: 'manisa-soma' },
                ],
              },
              {
                il: 'Aydın', emoji: '🌾', nufus: '1.2M', color: '#b45309', slug: 'aydin',
                cls: 'ay',
                ilceler: [
                  { label: 'Efeler', slug: 'aydin-efeler' },
                  { label: 'Nazilli', slug: 'aydin-nazilli' },
                  { label: 'Söke', slug: 'aydin-soke' },
                  { label: 'Kuşadası', slug: 'aydin-kusadasi' },
                  { label: 'Didim', slug: 'aydin-didim' },
                ],
              },
              {
                il: 'Muğla', emoji: '🌊', nufus: '1.0M', color: '#0369a1', slug: 'mugla',
                cls: 'mg',
                ilceler: [
                  { label: 'Bodrum', slug: 'mugla-bodrum' },
                  { label: 'Fethiye', slug: 'mugla-fethiye' },
                  { label: 'Marmaris', slug: 'mugla-marmaris' },
                  { label: 'Milas', slug: 'mugla-milas' },
                  { label: 'Datça', slug: 'mugla-datca' },
                ],
              },
              {
                il: 'Denizli', emoji: '🏔️', nufus: '1.0M', color: '#7c3aed', slug: 'denizli',
                cls: 'dn',
                ilceler: [
                  { label: 'Merkezefendi', slug: 'denizli-merkezefendi' },
                  { label: 'Pamukkale', slug: 'denizli-pamukkale' },
                  { label: 'Buldan', slug: 'denizli-buldan' },
                  { label: 'Çivril', slug: 'denizli-civril' },
                  { label: 'Acıpayam', slug: 'denizli-acipayam' },
                ],
              },
            ].map((city, ci) => (
              <div key={ci} style={{
                background: '#f8fafc',
                border: `1px solid #e2e8f0`,
                borderTop: `3px solid ${city.color}`,
                borderRadius: '16px',
                padding: '1.1rem',
                transition: 'all 0.25s ease',
                cursor: 'default',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 12px 24px -8px ${city.color}40`;
                  e.currentTarget.style.borderColor = `${city.color}40`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                {/* Şehir başlığı */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '0.85rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{city.emoji}</span>
                    <a
                      href={`/dijital-ajans/${city.slug}`}
                      onClick={e => { e.preventDefault(); navigate(`/dijital-ajans/${city.slug}`); }}
                      style={{
                        fontSize: '0.85rem', fontWeight: 800, color: city.color,
                        textDecoration: 'none', textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {city.il}
                    </a>
                  </div>
                  <span style={{
                    fontSize: '0.62rem', fontWeight: 700,
                    color: '#475569',
                    background: '#e2e8f0',
                    padding: '0.1rem 0.4rem', borderRadius: '6px',
                  }}>{city.nufus}</span>
                </div>

                {/* İlçe linkleri */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.85rem' }}>
                  {city.ilceler.map((ilce, ii) => (
                    <a
                      key={ii}
                      href={`/dijital-ajans/${ilce.slug}`}
                      onClick={e => { e.preventDefault(); navigate(`/dijital-ajans/${ilce.slug}`); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.3rem 0.5rem',
                        borderRadius: '8px',
                        fontSize: '0.78rem', fontWeight: 500,
                        color: '#475569',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                        border: '1px solid transparent',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = `${city.color}15`;
                        e.currentTarget.style.color = city.color;
                        e.currentTarget.style.borderColor = `${city.color}30`;
                        e.currentTarget.style.paddingLeft = '0.75rem';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#475569';
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.paddingLeft = '0.5rem';
                      }}
                    >
                      <span style={{
                        width: '4px', height: '4px', borderRadius: '50%',
                        background: city.color, flexShrink: 0, opacity: 0.7,
                      }} />
                      {ilce.label}
                    </a>
                  ))}
                </div>

                {/* Tümünü Gör */}
                <a
                  href={`/dijital-ajans/${city.slug}`}
                  onClick={e => { e.preventDefault(); navigate(`/dijital-ajans/${city.slug}`); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '0.3rem',
                    padding: '0.4rem',
                    borderRadius: '8px',
                    fontSize: '0.72rem', fontWeight: 700,
                    color: city.color,
                    textDecoration: 'none',
                    background: `${city.color}10`,
                    border: `1px solid ${city.color}30`,
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = city.color;
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = `${city.color}10`;
                    e.currentTarget.style.color = city.color;
                  }}
                >
                  Tüm İlçeler <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.6rem' }}></i>
                </a>
              </div>
            ))}

          </div>
        </div>


        {/* Contact Details Row (Grid of Modern Glass Cards) */}
        <div className="footer-contact-row">
          {/* Card 1: Office Address */}
          <div className="contact-card-item">
            <div className="contact-card-header">
              <i className="fa-solid fa-map-location-dot"></i>
              <h5>Ofis Adresi</h5>
            </div>
            <div className="contact-card-content">
              <p>{settingsData.address}</p>
            </div>
            <div className="contact-card-action">
              <a href={settingsData.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(settingsData.address)}`} target="_blank" rel="noopener noreferrer" className="contact-card-link">
                <span>Haritada Göster</span>
                <i className="fa-solid fa-angle-right"></i>
              </a>
            </div>
          </div>

          {/* Card 2: Contact Info */}
          <div className="contact-card-item">
            <div className="contact-card-header">
              <i className="fa-solid fa-headset"></i>
              <h5>Hızlı İletişim</h5>
            </div>
            <div className="contact-card-content">
              <p><strong>Telefon:</strong> <a href={`tel:${settingsData.phone}`} style={{
                color: 'inherit',
                textDecoration: 'none'
              }}>{settingsData.phone}</a></p>
              <p><strong>E-Posta:</strong> <a href={`mailto:${settingsData.email}`} style={{
                color: 'inherit',
                textDecoration: 'none'
              }}>{settingsData.email}</a></p>
            </div>
            <div className="contact-card-action">
              <a href={`mailto:${settingsData.email}?subject=Hizmet%20Talebi`} className="contact-card-link">
                <span>E-posta Gönder</span>
                <i className="fa-solid fa-angle-right"></i>
              </a>
            </div>
          </div>

          {/* Card 3: Working Hours */}
          <div className="contact-card-item">
            <div className="contact-card-header">
              <i className="fa-solid fa-business-time"></i>
              <h5>Çalışma Saatleri</h5>
            </div>
            <div className="contact-card-content">
              <p>{settingsData.working_hours_text || "Pazartesi – Cuma: 09:00 – 18:30"}</p>
              {(() => {
              const currentStatus = getAgencyStatus();
              return <div className={currentStatus.status === "open" ? "status-badge-active" : "status-badge-closed"}>
                    <span className={currentStatus.status === "open" ? "status-dot-pulse" : "status-dot-closed"}></span>
                    <span>{currentStatus.text}</span>
                  </div>;
            })()}
            </div>
            <div className="contact-card-action">
              <a href="#contact" onClick={e => {
              e.preventDefault();
              handleNavClick('contact');
            }} className="contact-card-link">
                <span>Toplantı Talep Et</span>
                <i className="fa-solid fa-angle-right"></i>
              </a>
            </div>
          </div>
        </div>
        {/* Note: The container remains open and is closed at the very end of footer-bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright-info">
            <p>&copy; 2019 – 2025 Ajans Rota. Tüm hakları saklıdır.</p>
            <p className="footer-tagline">Dijital Pazarlama, SEO, E-Ticaret, Google, Meta, TikTok Ads Çözüm Ortağınız ; Ajans Rota.</p>
            <div className="partner-badges">
              <span className="partner-badge"><i className="fa-brands fa-google"></i> Partner</span>
              <span className="partner-badge"><i className="fa-brands fa-meta"></i> Business Partner</span>
              <span className="partner-badge"><i className="fa-brands fa-tiktok"></i> Agency Partner</span>
            </div>
          </div>
          <div className="footer-bottom-right">
            <div className="footer-meta-links">
              <a href="/gizlilik-politikasi" onClick={e => {
                  e.preventDefault();
                  navigateTo('/gizlilik-politikasi');
            }}>Gizlilik Politikası</a>
              <a href="/kullanim-kosullari" onClick={e => {
                  e.preventDefault();
                  navigateTo('/kullanim-kosullari');
            }}>Kullanım Koşulları</a>
              <a href="/kvkk-aydinlatma-metni" onClick={e => {
                  e.preventDefault();
                  navigateTo('/kvkk-aydinlatma-metni');
            }}>KVKK Aydınlatma Metni</a>
              <a href="/cerez-politikasi" onClick={e => {
                  e.preventDefault();
                  navigateTo('/cerez-politikasi');
            }}>Çerez Politikası</a>
            </div>
            <div className="social-links">
              <a href={settingsData.linkedin_url || "#"} className="social-icon" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin-in"></i></a>
              <a href={settingsData.instagram_url || "#"} className="social-icon" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram"></i></a>
              <a href={settingsData.whatsapp_assistant_phone ? `https://wa.me/${settingsData.whatsapp_assistant_phone}?text=${encodeURIComponent('Merhaba, web siteniz üzerinden ulaşıyorum. Bulunduğum sayfa: ' + window.location.href)}` : (settingsData.whatsapp_url || "#")} className="social-icon" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
