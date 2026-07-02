import { useState, useEffect } from 'react';

export default function AegeanSuccessMap({
  settingsData,
  handleNavClick,
  onOpenLeadPopup
}) {
  const hotspots = [{
    id: 'alsancak',
    name: 'İzmir Merkez (Alsancak)',
    x: 43,
    y: 34,
    brand: 'Kordon Tıp Merkezi',
    logo: '🏥',
    service: 'Sağlık Turizmi & SEO',
    metric: '5.6% Randevu Oranı',
    category: 'local',
    tags: ['Sağlık SEO', 'Local Search', 'Google Ads'],
    desc: 'İzmir genelinde branş aramalarında birinci sıraya yükselerek klinik randevu oranlarında büyük artış sağladık.'
  }, {
    id: 'urla',
    name: 'Urla',
    x: 32,
    y: 37,
    brand: 'Urla Şarapçılık',
    logo: '🍷',
    service: 'Sosyal Medya + Yerel SEO',
    metric: '+140% Yerel Ziyaret',
    category: 'local',
    tags: ['Kreatif Çekim', 'Instagram Reels', 'Local SEO'],
    desc: 'Urla şarap rotası üzerindeki prestijli üreticimize özel yerel SEO ve sosyal medya kurgusuyla turistlerin uğrak noktası haline geldik.'
  }, {
    id: 'cesme',
    name: 'Çeşme / Alaçatı',
    x: 18,
    y: 39,
    brand: 'Alaçatı Ev Kurabiyecisi',
    logo: '🍪',
    service: 'E-Ticaret & Google PMax',
    metric: '6.4x ROAS',
    category: 'ecommerce',
    tags: ['Google Shopping', 'Meta Catalog', 'CRO'],
    desc: 'Alaçatı kurabiyelerini tüm Türkiye\'ye açtık. Reklam maliyetlerini düşürerek online satış hacmini 6 katına çıkardık.'
  }, {
    id: 'karsiyaka',
    name: 'Karşıyaka',
    x: 41,
    y: 27,
    brand: 'Karşıyaka Yapı Grubu',
    logo: '🏗️',
    service: 'Google Arama Ağı & CRM',
    metric: '+160% Nitelikli Form',
    category: 'b2b',
    tags: ['B2C Lead', 'CRM Entegrasyon', 'A/B Test'],
    desc: 'Bornova ve Karşıyaka projeleri için hedeflenen konut satış reklamlarında rekor başvuru oranı elde ettik.'
  }, {
    id: 'bodrum',
    name: 'Bodrum / Muğla',
    x: 36,
    y: 78,
    brand: 'Ege Butik Otel',
    logo: '🏨',
    service: 'Meta Rezervasyon Reklamları',
    metric: '%95 Doluluk Oranı',
    category: 'local',
    tags: ['Turizm Reklamları', 'Instagram Ads', 'Direct Booking'],
    desc: 'Sezon öncesi hedefleme ile doğrudan otel web sitesi üzerinden komisyonsuz oda satışlarını doldurduk.'
  }, {
    id: 'soke',
    name: 'Aydın / Söke',
    x: 34,
    y: 56,
    brand: 'Ege Tarım Market',
    logo: '🫒',
    service: 'Google Shopping & SEO',
    metric: '5.2x ROAS',
    category: 'ecommerce',
    tags: ['E-Ticaret', 'Merchant Center', 'Tarım Sektörü'],
    desc: 'Aydın ve Söke üreticilerinden toplanan gurme zeytinyağı ve yöresel ürünlerin Türkiye geneline e-ticaret satış hacmini artırdık.'
  }, {
    id: 'manisa',
    name: 'Manisa',
    x: 58,
    y: 20,
    brand: 'Endüstriyel Ambalaj A.Ş.',
    logo: '📦',
    service: 'B2B İhracat Reklamları',
    metric: '+180% İhracat Formu',
    category: 'b2b',
    tags: ['İhracat Pazarlaması', 'LinkedIn Ads', 'Google Search B2B'],
    desc: 'Manisa Organize Sanayi merkezli markamızı Avrupa genelinde distribütör arayan dev firmaların karşısına çıkardık.'
  }, {
    id: 'bornova',
    name: 'Bornova',
    x: 48,
    y: 29,
    brand: 'Bornova E-Ticaret Deposu',
    logo: '💄',
    service: 'E-Ticaret & Meta Katalog',
    metric: '5.5x ROAS',
    category: 'ecommerce',
    tags: ['Meta Ads', 'Kozmetik E-Ticaret', 'Retargeting'],
    desc: 'Bornova lojistik merkezli kozmetik markamızın tüm Türkiye\'ye e-ticaret altyapısını kurduk ve Meta Catalog reklamlarını optimize ettik.'
  }, {
    id: 'bayrakli',
    name: 'Bayraklı',
    x: 44,
    y: 30,
    brand: 'Rota Hukuk Bürosu',
    logo: '⚖️',
    service: 'Kurumsal Web Tasarım & SEO',
    metric: '+120% Müvekkil Talebi',
    category: 'local',
    tags: ['Professional Web', 'Google Maps SEO', 'Lead Generation'],
    desc: 'İzmir gökdelenler bölgesinde bulunan prestijli hukuk bürosu için modern web sitesi tasarladık ve niş kelimelerde Google SEO liderliği sağladık.'
  }, {
    id: 'buca',
    name: 'Buca',
    x: 46,
    y: 38,
    brand: 'Buca Teknoloji Geliştirme',
    logo: '💻',
    service: 'Yazılım Pazarlaması B2B',
    metric: '+150% Lead Artışı',
    category: 'b2b',
    tags: ['Inbound Marketing', 'LinkedIn Lead Gen', 'SaaS Growth'],
    desc: 'Buca DEÜ Teknopark bünyesindeki SaaS yazılım girişimi için inbound pazarlama kanallarını oluşturduk ve nitelikli lead topladık.'
  }, {
    id: 'torbali',
    name: 'Torbalı',
    x: 49,
    y: 44,
    brand: 'Torbalı Mobilya Fabrikası',
    logo: '🛋️',
    service: 'Mobilya E-Ticaret & Lead',
    metric: '4.8x ROAS',
    category: 'ecommerce',
    tags: ['Google Ads', 'B2B Bayi Formu', 'Pinterest Ads'],
    desc: 'Torbalı sanayi bölgesindeki mobilya fabrikamızın B2C e-ticaret satışlarını ve B2B bayilik taleplerini yönettik.'
  }, {
    id: 'kusadasi',
    name: 'Aydın / Kuşadası',
    x: 26,
    y: 52,
    brand: 'Kuşadası Yat Kiralama',
    logo: '⛵',
    service: 'Turizm Pazarlaması',
    metric: '%90 Rezervasyon Artışı',
    category: 'local',
    tags: ['Google Search', 'Multi-Lingual Ads', 'Summer Travel'],
    desc: 'Kuşadası ve Didim çıkışlı özel yat turları için çok dilli yabancı turiste yönelik reklam kampanyaları yürüttük.'
  }, {
    id: 'denizli',
    name: 'Denizli',
    x: 74,
    y: 62,
    brand: 'Pamukkale Tekstil',
    logo: '🧶',
    service: 'Tekstil İhracatı B2B',
    metric: '+200% Yabancı Alıcı Formu',
    category: 'b2b',
    tags: ['Global B2B SEO', 'LinkedIn Outreach', 'Alibaba Optimization'],
    desc: 'Denizli organize sanayi merkezli ev tekstili üreticimizi B2B dijital pazarlama ile global pazarlara taşıdık.'
  }, {
    id: 'marmaris',
    name: 'Muğla / Marmaris',
    x: 50,
    y: 84,
    brand: 'Marmaris Yelken Kulübü',
    logo: '🧭',
    service: 'Aktivite Turizmi & Meta Ads',
    metric: '%80 Doluluk',
    category: 'local',
    tags: ['Social Media Production', 'Lead Generation', 'Reels Ads'],
    desc: 'Marmaris ve Göcek koylarında faaliyet gösteren mavi tur ve yelken akademisi için kreatif sosyal medya içerikleri ve kayıt formları kurguladık.'
  }, {
    id: 'ayvalik',
    name: 'Balıkesir / Ayvalık',
    x: 32,
    y: 12,
    brand: 'Cunda Gurme Evi',
    logo: '🍯',
    service: 'Zeytinyağı E-Ticaret',
    metric: '7.2x ROAS',
    category: 'ecommerce',
    tags: ['Google Ads Shopping', 'Performance SEO', 'E-Mail Marketing'],
    desc: 'Ayvalık sızma zeytinyağı ve yöresel Cunda lezzetlerinin e-ticaret satış hacmini Google Ads Alışveriş reklamları ile büyüttük.'
  }, {
    id: 'fethiye',
    name: 'Muğla / Fethiye',
    x: 68,
    y: 88,
    brand: 'Fethiye Yamaç Paraşütü',
    logo: '🪂',
    service: 'Macera Turizmi & Local SEO',
    metric: '3.5x Dönüşüm',
    category: 'local',
    tags: ['Google Haritalar Yerel', 'Dynamic Search Ads', 'Tourist Ads'],
    desc: 'Ölüdeniz yamaç paraşütü firmasının yabancı turistlere yönelik uçuş rezervasyonlarını Google Search & Google Haritalar yerel reklamları ile doldurduk.'
  }];
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeHotspot, setActiveHotspot] = useState(hotspots[0]);
  const filteredHotspots = hotspots.filter(spot => {
    if (activeFilter === 'all') return true;
    return spot.category === activeFilter;
  });

  // Switch to the first visible hotspot if the active one is filtered out
  useEffect(() => {
    if (filteredHotspots.length > 0 && !filteredHotspots.some(h => h.id === activeHotspot.id)) {
      setActiveHotspot(filteredHotspots[0]);
    }
  }, [activeFilter, filteredHotspots, activeHotspot]);
  return <div className="aegean-success-map-section container">
      <div className="section-header" style={{
      marginBottom: '2rem',
      textAlign: 'center'
    }}>
        <span className="section-tag">Ege Bölgesi Başarı Haritamız</span>
        <h2 className="section-title">Ege'nin Dijital Büyüme Rotası</h2>
        <p className="section-desc">Yerel gücümüzü ve Ege genelindeki bölgesel başarılarımızı harita üzerinden inceleyin.</p>
      </div>

      {/* Modern Map Filter Bar */}
      <div className="map-filter-bar" style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '0.75rem',
      marginBottom: '2.5rem',
      flexWrap: 'wrap'
    }}>
        <button className={`map-filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>
          Tümü ({hotspots.length})
        </button>
        <button className={`map-filter-btn ${activeFilter === 'ecommerce' ? 'active' : ''}`} onClick={() => setActiveFilter('ecommerce')}>
          <span className="filter-dot spot-ecommerce"></span> E-Ticaret ({hotspots.filter(h => h.category === 'ecommerce').length})
        </button>
        <button className={`map-filter-btn ${activeFilter === 'b2b' ? 'active' : ''}`} onClick={() => setActiveFilter('b2b')}>
          <span className="filter-dot spot-b2b"></span> B2B & Endüstriyel ({hotspots.filter(h => h.category === 'b2b').length})
        </button>
        <button className={`map-filter-btn ${activeFilter === 'local' ? 'active' : ''}`} onClick={() => setActiveFilter('local')}>
          <span className="filter-dot spot-local"></span> Turizm & Yerel Hizmet ({hotspots.filter(h => h.category === 'local').length})
        </button>
      </div>

      <div className="aegean-map-grid">
        {/* Left Column: Interactive Map Canvas */}
        <div className="aegean-map-canvas-container">
          <img src={settingsData?.contact_map_image || "/images/aegean_map_light.png"} alt="Ege Bölgesi Dijital Başarı Haritası" className="aegean-map-bg-image" />
          
          {/* SVG Overlay for dynamic connecting line */}
          <svg className="aegean-map-svg-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5
        }}>
            {activeHotspot && activeHotspot.id !== 'alsancak' && <>
                {/* Glowing connection line from İzmir (43%, 34%) to activeHotspot */}
                <line x1="43%" y1="34%" x2={`${activeHotspot.x}%`} y2={`${activeHotspot.y}%`} className="aegean-map-connection-line-glow" />
                <line x1="43%" y1="34%" x2={`${activeHotspot.x}%`} y2={`${activeHotspot.y}%`} className="aegean-map-connection-line" />
              </>}
          </svg>

          {/* Map stats overlay (badge in top-left) */}
          <div className="map-stats-overlay">
            <div className="map-stat-badge">
              <i className="fa-solid fa-map-location-dot"></i> <span>16 Aktif Bölge</span>
            </div>
            <div className="map-stat-badge">
              <i className="fa-solid fa-chart-pie"></i> <span>85+ Çözüm Ortağı</span>
            </div>
          </div>
          
          {filteredHotspots.map(spot => <button key={spot.id} className={`aegean-hotspot spot-${spot.category} ${activeHotspot.id === spot.id ? 'active' : ''}`} style={{
          left: `${spot.x}%`,
          top: `${spot.y}%`
        }} onClick={() => setActiveHotspot(spot)} title={spot.name}>
              <div className="hotspot-pulse"></div>
              <div className="hotspot-dot"></div>
              <span className="hotspot-label">{spot.name}</span>
            </button>)}
        </div>

        {/* Right Column: Dynamic Case Study Detail Card */}
        <div className="aegean-map-detail-container">
          <div className="glass-card" style={{
          padding: '2rem',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '1px solid var(--glass-border)'
        }}>
            <div>
              <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem'
            }}>
                <span style={{
                fontSize: '0.8rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                color: 'var(--primary)',
                letterSpacing: '1px'
              }}>
                  <i className="fa-solid fa-location-dot" style={{
                  marginRight: '6px'
                }}></i> {activeHotspot.name}
                </span>
                <span style={{
                fontSize: '1.5rem'
              }}>{activeHotspot.logo}</span>
              </div>

              <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.6rem',
              color: '#ffffff',
              fontWeight: '700',
              marginBottom: '0.5rem'
            }}>
                {activeHotspot.brand}
              </h3>
              
              <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#10b981',
              padding: '4px 12px',
              borderRadius: '50px',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
                <i className="fa-solid fa-arrow-trend-up"></i> {activeHotspot.metric}
              </div>

              <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              lineHeight: '1.5',
              marginBottom: '1.5rem'
            }}>
                {activeHotspot.desc}
              </p>

              <div style={{
              marginBottom: '1.5rem'
            }}>
                <h5 style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                color: 'var(--text-light)',
                letterSpacing: '0.5px',
                marginBottom: '0.5rem'
              }}>Verilen Hizmetler:</h5>
                <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                  {activeHotspot.tags.map((tag, i) => <span key={i} style={{
                  fontSize: '0.7rem',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-muted)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}>
                      {tag}
                    </span>)}
                </div>
              </div>
            </div>

            <button className="btn btn-primary" onClick={() => onOpenLeadPopup ? onOpenLeadPopup() : handleNavClick('contact')} style={{
            width: '100%',
            justifyContent: 'center',
            fontWeight: '600',
            gap: '8px'
          }}>
              <span>Benzer Bir Başarı Yakalayın</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>;
}

// Dedicated Testimonials Page View Component
