import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getLocationBySlug, getDistrictsByProvince } from '../data/locationData';

// ─── LocalBusiness JSON-LD Schema ───────────────────────────────────────────
const LocationSchema = ({ location }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Ajans Rota — ${location.ilce || location.il} Dijital Pazarlama`,
    description: location.seoDesc,
    url: `https://ajansrota.com/dijital-ajans/${location.slug}`,
    telephone: '+905445844543',
    email: 'hello@ajansrota.com',
    areaServed: {
      '@type': 'City',
      name: location.ilce || location.il,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: location.il,
      },
    },
    serviceType: [
      'Google Ads Yönetimi',
      'Meta Reklam Yönetimi',
      'SEO Danışmanlığı',
      'Sosyal Medya Yönetimi',
      'Web Tasarım',
      'E-Ticaret Yönetimi',
    ],
    priceRange: '₺₺₺',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:30',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
};

// ─── Hizmet Kartları ────────────────────────────────────────────────────────
const services = [
  {
    icon: 'fa-brands fa-google',
    title: 'Google Ads',
    desc: 'Arama, Display ve PMax kampanyalarıyla potansiyel müşterilerinize en doğru anda ulaşın.',
    color: '#4285f4',
    bg: 'rgba(66,133,244,0.08)',
    slug: 'google-ads-danismanligi',
  },
  {
    icon: 'fa-brands fa-meta',
    title: 'Meta Reklam',
    desc: 'Facebook ve Instagram reklamlarıyla geniş hedef kitlelere nitelikli müşteriler kazanın.',
    color: '#0866ff',
    bg: 'rgba(8,102,255,0.08)',
    slug: 'meta-reklam-yonetimi',
  },
  {
    icon: 'fa-solid fa-magnifying-glass-chart',
    title: 'SEO & Organik Büyüme',
    desc: 'Yerel ve ulusal arama sıralamalarında kalıcı olarak üst sıralara çıkın.',
    color: '#16a34a',
    bg: 'rgba(22,163,74,0.08)',
    slug: 'arama-motoru-optimizasyonu-seo',
  },
  {
    icon: 'fa-solid fa-share-nodes',
    title: 'Sosyal Medya Yönetimi',
    desc: 'Markanızı Instagram, TikTok ve LinkedIn\'de güçlü bir toplulukla büyütün.',
    color: '#e1306c',
    bg: 'rgba(225,48,108,0.08)',
    slug: 'sosyal-medya-yonetimi',
  },
  {
    icon: 'fa-solid fa-code',
    title: 'Web Tasarım & CRO',
    desc: 'Hızlı, modern ve dönüşüm odaklı web siteleriyle ziyaretçilerinizi müşteriye dönüştürün.',
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.08)',
    slug: 'donusum-odakli-web-tasarim',
  },
  {
    icon: 'fa-solid fa-cart-shopping',
    title: 'E-Ticaret Yönetimi',
    desc: 'Trendyol, Hepsiburada ve kendi sitenizde satışlarınızı artırın.',
    color: '#ea580c',
    bg: 'rgba(234,88,12,0.08)',
    slug: 'e-ticaret-ve-pazaryeri-yonetimi',
  },
];

// ─── Neden Biz Maddeleri ────────────────────────────────────────────────────
const whyUs = [
  {
    icon: 'fa-solid fa-chart-line',
    title: 'Veri Odaklı Strateji',
    desc: 'Her karar veri ve analize dayanır, tahmine değil.',
  },
  {
    icon: 'fa-solid fa-shield-halved',
    title: 'Şeffaf Raporlama',
    desc: 'Anlık dashboard ile bütçenizin her kuruşunu takip edin.',
  },
  {
    icon: 'fa-solid fa-handshake',
    title: 'Yerel Anlayış',
    desc: 'Ege\'nin ticari dinamiklerini yakından bilen ekibimiz.',
  },
  {
    icon: 'fa-solid fa-rocket',
    title: 'Hızlı Sonuç',
    desc: 'İlk 30 günde ölçülebilir iyileşme garanti ediyoruz.',
  },
];

// ─── Ana Component ──────────────────────────────────────────────────────────
export default function LocationPageView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = getLocationBySlug(slug);

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // 404 yönlendirme
  if (!location) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        fontFamily: 'var(--font-body)',
        color: 'var(--text-light)',
      }}>
        <i className="fa-solid fa-map-location-dot" style={{ fontSize: '3rem', color: 'var(--primary)' }}></i>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Sayfa Bulunamadı</h1>
        <p style={{ color: 'var(--text-muted)' }}>Bu lokasyon sayfası mevcut değil.</p>
        <button onClick={() => navigate('/')} style={{
          padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none',
          background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontWeight: 600,
        }}>
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  // İlin ilçelerini al (il sayfasıysa)
  const districts = location.tip === 'il' ? getDistrictsByProvince(location.il) : [];
  // Eğer ilçe ise, üst ile olan diğer ilçeleri al
  const siblingDistricts = location.tip === 'ilce'
    ? getDistrictsByProvince(location.il).filter(d => d.slug !== location.slug).slice(0, 6)
    : [];

  const cityName = location.ilce || location.il;
  const primaryColor = location.color || 'var(--primary)';

  return (
    <>
      {/* ── SEO Head ────────────────────────────────────────────── */}
      <LocationSchema location={location} />
      <title>{location.seoTitle}</title>
      <meta name="description" content={location.seoDesc} />
      <meta name="keywords" content={location.seoKeywords} />
      <link rel="canonical" href={`https://ajansrota.com/dijital-ajans/${location.slug}`} />
      {/* Open Graph */}
      <meta property="og:title" content={location.seoTitle} />
      <meta property="og:description" content={location.seoDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://ajansrota.com/dijital-ajans/${location.slug}`} />

      <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-light)', minHeight: '100vh' }}>

        {/* ── HERO ────────────────────────────────────────────────── */}
        <section style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '7rem 1.5rem 5rem',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          textAlign: 'center',
        }}>
          {/* Glow effects */}
          <div style={{
            position: 'absolute', top: '-10rem', left: '50%', transform: 'translateX(-50%)',
            width: '600px', height: '600px', borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}22 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
            {/* Breadcrumb */}
            <nav style={{ marginBottom: '1.5rem', fontSize: '0.82rem' }}>
              <span
                onClick={() => navigate('/')}
                style={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
              >
                Ana Sayfa
              </span>
              <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 0.4rem' }}>/</span>
              <span
                onClick={() => navigate('/dijital-ajans/' + (location.parentSlug || location.slug))}
                style={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
              >
                {location.il}
              </span>
              {location.ilce && (
                <>
                  <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 0.4rem' }}>/</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{location.ilce}</span>
                </>
              )}
            </nav>

            {/* Emoji + Tag */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 1rem', borderRadius: '999px',
              background: `${primaryColor}22`,
              border: `1px solid ${primaryColor}44`,
              marginBottom: '1.5rem', fontSize: '0.85rem',
              color: '#94e2ff',
            }}>
              <span style={{ fontSize: '1.1rem' }}>{location.emoji}</span>
              <span>{location.il}{location.ilce ? ` / ${location.ilce}` : ''} • Nüfus: {location.nufus}</span>
            </div>

            {/* H1 */}
            <h1 style={{
              fontSize: 'clamp(1.8rem, 5vw, 3rem)',
              fontWeight: 800,
              color: '#f1f5f9',
              fontFamily: 'var(--font-heading)',
              lineHeight: 1.2,
              marginBottom: '1.25rem',
            }}>
              {location.heroHeading}
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.65)',
              maxWidth: '600px',
              margin: '0 auto 2rem',
              lineHeight: 1.7,
            }}>
              {location.heroSub}
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/iletisim')}
                style={{
                  padding: '0.875rem 2rem', borderRadius: '14px', border: 'none',
                  background: `linear-gradient(135deg, ${primaryColor}, #38bdf8)`,
                  color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                  boxShadow: `0 4px 20px ${primaryColor}44`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <i className="fa-solid fa-paper-plane" style={{ marginRight: '0.5rem' }}></i>
                Ücretsiz Analiz Al
              </button>
              <button
                onClick={() => navigate('/seo-analizi')}
                style={{
                  padding: '0.875rem 2rem', borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
                  color: '#fff', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <i className="fa-solid fa-magnifying-glass" style={{ marginRight: '0.5rem' }}></i>
                SEO Analizini Başlat
              </button>
            </div>
          </div>
        </section>

        {/* ── KPI BAR ─────────────────────────────────────────────── */}
        <section style={{
          background: 'linear-gradient(90deg, #0284c7, #7c3aed)',
          padding: '1.25rem 1.5rem',
        }}>
          <div style={{
            maxWidth: '900px', margin: '0 auto',
            display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem',
          }}>
            {[
              { num: '%320+', label: 'Ortalama ROAS Artışı' },
              { num: '12M₺+', label: 'Yönetilen Reklam Bütçesi' },
              { num: '180K+', label: 'Aylık Organik Trafik' },
              { num: '%98.4', label: 'Müşteri Memnuniyeti' },
            ].map((kpi, i) => (
              <div key={i} style={{ textAlign: 'center', color: '#fff' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                  {kpi.num}
                </div>
                <div style={{ fontSize: '0.78rem', opacity: 0.85 }}>{kpi.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HAKKINDA & SEKTÖRLER ────────────────────────────────── */}
        <section style={{ padding: '4rem 1.5rem', background: '#f8fafc' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>

            {/* Description */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.3rem 0.9rem', borderRadius: '999px',
                background: `${primaryColor}14`, border: `1px solid ${primaryColor}30`,
                marginBottom: '1rem', fontSize: '0.78rem', fontWeight: 700,
                color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                <i className="fa-solid fa-location-dot"></i>
                {location.schemaServiceArea}
              </div>
              <h2 style={{
                fontSize: '1.6rem', fontWeight: 800, color: '#0f172a',
                fontFamily: 'var(--font-heading)', marginBottom: '1rem', lineHeight: 1.3,
              }}>
                {cityName}\'da Dijital Pazarlama Neden Önemlidir?
              </h2>
              <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '0.95rem' }}>
                {location.description}
              </p>
              <button
                onClick={() => navigate('/iletisim')}
                style={{
                  marginTop: '1.5rem', padding: '0.75rem 1.5rem', borderRadius: '12px',
                  border: 'none', background: primaryColor,
                  color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                }}
              >
                <i className="fa-solid fa-comments" style={{ marginRight: '0.5rem' }}></i>
                Hemen Görüşelim
              </button>
            </div>

            {/* Sectors */}
            <div style={{
              background: '#fff', borderRadius: '20px', padding: '1.75rem',
              boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid #e2e8f0',
            }}>
              <h3 style={{
                fontSize: '1rem', fontWeight: 700, color: '#0f172a',
                marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <i className="fa-solid fa-building-columns" style={{ color: primaryColor }}></i>
                {cityName}\'ın Öne Çıkan Sektörleri
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {location.sektor.map((s, i) => (
                  <span key={i} style={{
                    padding: '0.4rem 0.9rem', borderRadius: '999px', fontSize: '0.82rem',
                    fontWeight: 600, background: `${primaryColor}12`,
                    color: primaryColor, border: `1px solid ${primaryColor}25`,
                  }}>
                    {s}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#374151', marginBottom: '0.75rem' }}>
                  <i className="fa-solid fa-star" style={{ color: '#f59e0b', marginRight: '0.4rem' }}></i>
                  Bu Bölgeye Sunduğumuz Hizmetler
                </h4>
                {['Google Ads Kampanya Yönetimi', 'Yerel SEO & Google Haritalar', 'Meta Reklam Yönetimi', 'Sosyal Medya İçerik Üretimi'].map((h, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    fontSize: '0.85rem', color: '#475569', marginBottom: '0.4rem',
                  }}>
                    <i className="fa-solid fa-check" style={{ color: '#16a34a', fontSize: '0.75rem' }}></i>
                    {h}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HİZMETLER GRID ──────────────────────────────────────── */}
        <section style={{ padding: '4rem 1.5rem', background: '#fff' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{
                display: 'inline-block', padding: '0.3rem 0.9rem', borderRadius: '999px',
                background: `${primaryColor}12`, border: `1px solid ${primaryColor}30`,
                marginBottom: '0.75rem', fontSize: '0.78rem', fontWeight: 700,
                color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                Uzmanlık Alanlarımız
              </div>
              <h2 style={{
                fontSize: '1.8rem', fontWeight: 800, color: '#0f172a',
                fontFamily: 'var(--font-heading)',
              }}>
                {cityName}\'a Özel Dijital Pazarlama Hizmetleri
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}>
              {services.map((service, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/hizmetlerimiz/${service.slug}`)}
                  style={{
                    padding: '1.5rem', borderRadius: '16px', cursor: 'pointer',
                    border: '1px solid #e2e8f0', background: '#fff',
                    transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = `0 8px 24px ${service.color}22`;
                    e.currentTarget.style.borderColor = service.color + '44';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: service.bg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', marginBottom: '1rem',
                  }}>
                    <i className={service.icon} style={{ color: service.color, fontSize: '1.2rem' }}></i>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                    {service.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
                    {service.desc}
                  </p>
                  <div style={{
                    marginTop: '1rem', fontSize: '0.8rem', fontWeight: 600,
                    color: service.color, display: 'flex', alignItems: 'center', gap: '0.3rem',
                  }}>
                    Detaylı Bilgi <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.7rem' }}></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NEDEN BİZ ───────────────────────────────────────────── */}
        <section style={{
          padding: '4rem 1.5rem',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{
                fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9',
                fontFamily: 'var(--font-heading)',
              }}>
                Neden Ajans Rota?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', marginTop: '0.75rem' }}>
                {cityName} ve çevresindeki işletmeler bizimle neden çalışıyor?
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              {whyUs.map((item, i) => (
                <div key={i} style={{
                  padding: '1.5rem', borderRadius: '16px',
                  background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center',
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: `${primaryColor}22`, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 1rem',
                  }}>
                    <i className={item.icon} style={{ color: '#38bdf8', fontSize: '1.2rem' }}></i>
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.4rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── İLÇE LİNKLERİ (il sayfasıysa) ─────────────────────── */}
        {location.tip === 'il' && districts.length > 0 && (
          <section style={{ padding: '4rem 1.5rem', background: '#f8fafc' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{
                  fontSize: '1.6rem', fontWeight: 800, color: '#0f172a',
                  fontFamily: 'var(--font-heading)',
                }}>
                  {location.il} İlçeleri İçin Dijital Pazarlama
                </h2>
                <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  İlçenizi seçin, size özel SEO ve reklam çözümlerimizi inceleyin.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {districts.map((d, i) => (
                  <div
                    key={i}
                    onClick={() => navigate(`/dijital-ajans/${d.slug}`)}
                    style={{
                      padding: '1rem 1.25rem', borderRadius: '12px', cursor: 'pointer',
                      background: '#fff', border: '1px solid #e2e8f0',
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = primaryColor;
                      e.currentTarget.style.background = `${primaryColor}08`;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <span style={{ fontSize: '1.3rem' }}>{d.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{d.ilce}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{d.sektor[0]}</div>
                    </div>
                    <i className="fa-solid fa-chevron-right" style={{
                      marginLeft: 'auto', fontSize: '0.7rem', color: primaryColor,
                    }}></i>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── İLGİLİ İLÇELER (ilçe sayfasıysa) ──────────────────── */}
        {location.tip === 'ilce' && siblingDistricts.length > 0 && (
          <section style={{ padding: '3rem 1.5rem', background: '#f8fafc' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h3 style={{
                fontSize: '1.1rem', fontWeight: 700, color: '#0f172a',
                marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <i className="fa-solid fa-map-pin" style={{ color: primaryColor }}></i>
                {location.il}\'ın Diğer İlçeleri
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {siblingDistricts.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(`/dijital-ajans/${d.slug}`)}
                    style={{
                      padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.85rem',
                      fontWeight: 600, cursor: 'pointer', border: `1px solid ${primaryColor}30`,
                      background: `${primaryColor}08`, color: primaryColor,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = primaryColor;
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = `${primaryColor}08`;
                      e.currentTarget.style.color = primaryColor;
                    }}
                  >
                    {d.emoji} {d.ilce}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA BANNER ──────────────────────────────────────────── */}
        <section style={{
          padding: '4rem 1.5rem',
          background: `linear-gradient(135deg, ${primaryColor} 0%, #7c3aed 100%)`,
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{location.emoji}</div>
            <h2 style={{
              fontSize: '1.8rem', fontWeight: 800, color: '#fff',
              fontFamily: 'var(--font-heading)', marginBottom: '0.75rem',
            }}>
              {cityName}\'daki İşletmeniz İçin Hazırız
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.7 }}>
              Ücretsiz dijital büyüme analizinizi alın. 24 saat içinde uzman ekibimiz sizinle iletişime geçer.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/iletisim')}
                style={{
                  padding: '0.875rem 2rem', borderRadius: '14px', border: 'none',
                  background: '#fff', color: primaryColor,
                  fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
              >
                <i className="fa-solid fa-paper-plane" style={{ marginRight: '0.5rem' }}></i>
                Ücretsiz Analiz Al
              </button>
              <a
                href={`https://wa.me/905445844543?text=${encodeURIComponent(`Merhaba, ${location.ilce || location.il} sayfasından ulaşıyorum. Bilgi almak istiyorum. \nSayfa: https://ajansrota.com/dijital-ajans/${location.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0.875rem 2rem', borderRadius: '14px',
                  border: '2px solid rgba(255,255,255,0.5)',
                  background: 'transparent', color: '#fff',
                  fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                }}
              >
                <i className="fa-brands fa-whatsapp"></i>
                WhatsApp\'tan Yaz
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
