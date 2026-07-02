import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { initialServicePagesData } from '../data/mockData';

// Detailed service pages data

const mapTestimonialToCaseStudy = item => {
  if (!item) return null;
  const nameLower = (item.company || "").toLowerCase();

  // Find sector categories based on company keywords
  const isHotel = nameLower.includes("otel") || nameLower.includes("hotel") || nameLower.includes("pansiyon") || nameLower.includes("konaklama") || nameLower.includes("tatil") || nameLower.includes("turizm") || nameLower.includes("seyahat") || nameLower.includes("villa") || nameLower.includes("transfer") || nameLower.includes("yat") || nameLower.includes("çarter") || nameLower.includes("marin") || nameLower.includes("tekne");
  const isHealth = nameLower.includes("dental") || nameLower.includes("diş") || nameLower.includes("klinik") || nameLower.includes("tıp") || nameLower.includes("sağlık") || nameLower.includes("hastane") || nameLower.includes("eczane") || nameLower.includes("dr") || nameLower.includes("hekim");
  const isB2B = nameLower.includes("asansör") || nameLower.includes("yapı") || nameLower.includes("inşaat") || nameLower.includes("mermer") || nameLower.includes("demir") || nameLower.includes("metal") || nameLower.includes("çelik") || nameLower.includes("boya") || nameLower.includes("endüstri") || nameLower.includes("makine") || nameLower.includes("yedek") || nameLower.includes("döküm") || nameLower.includes("prefabrik") || nameLower.includes("lojistik") || nameLower.includes("kargo") || nameLower.includes("nakli") || nameLower.includes("taşım");
  const isFood = nameLower.includes("kurabiye") || nameLower.includes("gıda") || nameLower.includes("baharat") || nameLower.includes("mutfak") || nameLower.includes("unlu") || nameLower.includes("tatlı") || nameLower.includes("fırın") || nameLower.includes("un") || nameLower.includes("zeytin") || nameLower.includes("yağ") || nameLower.includes("şarap") || nameLower.includes("bağ") || nameLower.includes("restoran") || nameLower.includes("cafe") || nameLower.includes("kahve") || nameLower.includes("lezzet") || nameLower.includes("kebap") || nameLower.includes("lokanta") || nameLower.includes("gurme") || nameLower.includes("peynir");
  const isEcom = nameLower.includes("giyim") || nameLower.includes("butik") || nameLower.includes("tekstil") || nameLower.includes("moda") || nameLower.includes("tasarım") || nameLower.includes("ayakkabı") || nameLower.includes("deri") || nameLower.includes("kozmetik") || item.category === "ecommerce";
  const isSocial = item.category === "social-media" || nameLower.includes("sosyal") || nameLower.includes("instagram") || nameLower.includes("reels") || nameLower.includes("takipçi");
  const isDesign = item.category === "web-design" || nameLower.includes("web") || nameLower.includes("site") || nameLower.includes("tasarım") || nameLower.includes("yazılım") || nameLower.includes("kod");

  // Determine Logo
  let logo = "📈";
  if (isHotel) logo = "🏨";else if (isHealth) logo = "🏥";else if (isB2B) logo = "🏗️";else if (isFood) logo = nameLower.includes("zeytin") || nameLower.includes("yağ") ? "🫒" : nameLower.includes("şarap") || nameLower.includes("bağ") ? "🍷" : "🍪";else if (nameLower.includes("okul") || nameLower.includes("akademi") || nameLower.includes("kolej") || nameLower.includes("eğitim") || nameLower.includes("kurs") || nameLower.includes("yurt")) logo = "🎓";else if (nameLower.includes("hukuk") || nameLower.includes("danışmanlık") || nameLower.includes("müşavir") || nameLower.includes("ofis")) logo = "⚖️";else if (isEcom) logo = "👕";else if (isSocial) logo = "📱";else if (isDesign) logo = "💻";

  // Determine Sector
  let sector = "Dijital Pazarlama & Büyüme";
  if (isHotel) sector = "Turizm & Otelcilik Pazarlaması";else if (isHealth) sector = "Sağlık & Yerel Klinik Hizmetleri";else if (isB2B) sector = "B2B İhracat & Endüstriyel Pazarlama";else if (isFood) sector = "Gastronomi & Yöresel Ürün Pazarlaması";else if (isEcom) sector = "E-Ticaret & Pazaryeri Büyüme Yönetimi";else if (isSocial) sector = "Sosyal Medya Yönetimi & Etkileşim";else if (isDesign) sector = "Dönüşüm Odaklı Web Tasarım & UX";

  // Formulate Before/After stats
  let beforeRoas = "Düşük Verimlilik";
  let beforeTraffic = "Sınırlı Görünürlük";
  let beforeCost = "Yüksek Edinme Maliyeti (CPA)";
  let afterRoas = item.metric || "Yüksek Dönüşüm";
  let afterTraffic = "Sürdürülebilir Büyüme Akışı";
  let afterCost = "%45+ Edinme Maliyeti (CPA) Avantajı";
  let strategy = ["Sektör trendleri analiz edilerek hedef kitle davranışlarına yönelik optimizasyonlar yapıldı.", "Kreatif testleri ve dönüşüm yolları A/B testleriyle iyileştirildi.", "Raporlama ve veri takibi altyapısı baştan aşağı yenilenerek şeffaflık sağlandı."];

  // Specific Sector overrides
  if (isHotel) {
    beforeRoas = "Düşük Sezon Doluluk Oranı";
    beforeTraffic = "Acente (OTA) Bağımlılığı";
    beforeCost = "%20 Acente Komisyon Kaybı";
    afterRoas = item.metric && !item.metric.toLowerCase().includes("shopify") && !item.metric.toLowerCase().includes("cira") && !item.metric.toLowerCase().includes("ciro") && !item.metric.toLowerCase().includes("sipariş") ? item.metric : "%85+ Ortalama Doluluk";
    afterTraffic = "Doğrudan Rezervasyon Artışı";
    afterCost = "Komisyonsuz Rezervasyon Otomasyonu";
    strategy = ["Aracı acentelere ödenen yüksek komisyonları azaltmak için doğrudan rezervasyon motoru entegre edildi.", "Google Otel Reklamları (Google Hotel Ads) ve harita SEO'su ile bölgesel aramalarda görünürlük sağlandı.", "Sosyal medyada otel ambiyansını yansıtan video kurgularıyla doğrudan rezervasyonlar tetiklendi."];
  } else if (isHealth) {
    beforeRoas = "Düşük Sıcak Randevu Talebi";
    beforeTraffic = "Aylık < 2.000 Ziyaretçi";
    beforeCost = "Yüksek Arama Reklamı Giderleri";
    afterRoas = item.metric && !item.metric.toLowerCase().includes("shopify") && !item.metric.toLowerCase().includes("ciro") ? item.metric : "+120% Yeni Randevu Talebi";
    afterTraffic = "Bornova/Alsancak Lokal Trafik";
    afterCost = "KVKK Uyumlu İletişim Altyapısı";
    strategy = ["Kullanıcı deneyimi yüksek, hızlı ve KVKK uyumlu randevu sayfaları tasarlandı.", "Yerel SEO optimizasyonu ile Google Haritalar'da branş bazlı aramalarda üst sıralara çıkıldı.", "Google Arama Ağı ve Meta Ads reklamlarıyla nitelikli hasta formları toplandı."];
  } else if (isB2B) {
    beforeRoas = "Sadece Fuar Bağımlılığı";
    beforeTraffic = "Aylık < 1.000 Ziyaretçi";
    beforeCost = "Sınırlı İthalatçı Talebi";
    afterRoas = item.metric && !item.metric.toLowerCase().includes("shopify") ? item.metric : "4.5x B2B Lead Dönüşümü";
    afterTraffic = "Küresel Organik İhracat Trafiği";
    afterCost = "Katalog İndirme ve Fiyat Teklifi Artışı";
    strategy = ["Almanca, İngilizce ve Fransızca dillerinde B2B Büyüme hedefli web siteleri kuruldu.", "Avrupa genelinde ithalatçı ve toptancı arama sorgularına özel Google Arama Ağı reklamları kurgulandı.", "LinkedIn Campaign Manager kullanılarak ihracat kararı vericileri doğrudan hedeflendi."];
  } else if (isFood) {
    beforeRoas = "1.5x - 2.0x Sınırlı ROAS";
    beforeTraffic = "Sadece Fiziksel Satış Trafiği";
    beforeCost = "Yetersiz Online Satış Kanalı";
    afterRoas = item.metric;
    afterTraffic = "Yöresel Ürün Talebi Akışı";
    afterCost = "%45 Kargo ve Operasyon Verimliliği";
    strategy = ["Ege zeytinyağı ve yöresel lezzetlerin hikayesini anlatan özel sosyal medya Reels videoları kurgulandı.", "Hızlı kargo ve sipariş otomasyonu entegrasyonu ile müşteri memnuniyeti puanı yükseltildi.", "Dönemsel hediye ve kurumsal sepet campaigns ile sipariş hacmi katlandı."];
  } else if (isEcom) {
    beforeRoas = "1.8x ROAS Barajı";
    beforeTraffic = "Yüksek Sepet Terk Oranı";
    beforeCost = "Yüksek Müşteri Edinme Maliyeti";
    afterRoas = item.metric;
    afterTraffic = "Shopify & Pazaryeri Trafiği";
    afterCost = "Komisyonsuz Kendi Sitesine Çekim";
    strategy = ["Shopify web sitesi sıfırdan kuruldu veya mevcut altyapı Trendyol/Hepsiburada entegrasyonları ile senkronize edildi.", "Meta Piksel verileri optimize edilerek sepet terk eden kullanıcılara özel yeniden pazarlama yapıldı.", "Kampanya kurguları ve sepet barajı stratejileri ile ortalama sepet büyüklüğü artırıldı."];
  } else if (isSocial) {
    beforeRoas = "Düşük Etkileşim Oranı";
    beforeTraffic = "Düzensiz Paylaşımlar";
    beforeCost = "Zayıf Marka İmajı";
    afterRoas = item.metric || "+250% Etkileşim Artışı";
    afterTraffic = "Erişim & Gösterim Patlaması";
    afterCost = "Organik Takipçi Büyümesi";
    strategy = ["Marka kimliğine özel görsel tasarım dili ve Instagram grid düzeni tasarlandı.", "Trend reels kurguları ve kanca odaklı video içerik planı uygulandı.", "Topluluk yönetimi aktif edilerek gelen DM ve yorumlar marka sesiyle proaktif yanıtlandı."];
  } else if (isDesign) {
    beforeRoas = "Yavaş Açılış Süresi (Core Web Vitals)";
    beforeTraffic = "Yüksek Hemen Çıkma Oranı";
    beforeCost = "Mobil Uyumsuz Arayüz";
    afterRoas = item.metric || "95+ Mobil Hız Skoru";
    afterTraffic = "Dönüşüm Oranında (CR) Artış";
    afterCost = "Kusursuz Mobil Deneyim (UX)";
    strategy = ["Modern, cam morfolojili ve ultra hızlı React tabanlı arayüz kodlandı.", "Kullanıcı deneyimi (UX) testleri yapılarak form doldurma ve iletişim yolları optimize edildi.", "Arama motoru dostu (SEO uyumlu) teknik altyapı ve kolay yönetim paneli kuruldu."];
  } else {
    // Customize based on category if not matching name keyword filters
    if (item.category === "google-ads" || item.category === "meta-ads") {
      beforeRoas = "1.5x - 2.0x ROAS";
      beforeTraffic = "Yüksek Tıklama / Düşük Sipariş";
      beforeCost = "Yüksek Reklam Maliyetleri";
      afterRoas = item.metric || "5.0x+ ROAS";
      afterTraffic = "Nitelikli Alıcı Trafiği";
      afterCost = "Maliyet Optimizasyonu Sağlandı";
    } else if (item.category === "seo") {
      beforeRoas = "Görünmez Sayfa Derecesi";
      beforeTraffic = "Aylık < 1.000 Organik Hit";
      beforeCost = "Yüksek Google Reklam Bağımlılığı";
      afterRoas = item.metric || "İlk Sayfa Görünürlüğü";
      afterTraffic = "Aylık 10.000+ Organik Hit";
      afterCost = "Sıfır Reklam Maliyetli Organik Trafik";
    } else if (item.category === "web-design") {
      beforeRoas = "%1.2 Düşük Dönüşüm Oranı";
      beforeTraffic = "Yavaş Açılan Eski Web Sitesi";
      beforeCost = "Mobil Uyumsuzluk & Kayıplar";
      afterRoas = item.metric || "Gelişmiş Dönüşüm Oranları";
      afterTraffic = "Ultra Hızlı Mobil Arayüz";
      afterCost = "%100 Kullanıcı Dostu Deneyim";
    } else if (item.category === "social-media") {
      beforeRoas = "Düşük Etkileşim Oranı";
      beforeTraffic = "Düzensiz Paylaşımlar";
      beforeCost = "Zayıf Marka İmajı";
      afterRoas = item.metric || "+250% Etkileşim Artışı";
      afterTraffic = "Erişim & Gösterim Patlaması";
      afterCost = "Organik Takipçi Büyümesi";
    }
  }
  return {
    company: item.company || "Referans Firma",
    logo,
    sector,
    before: {
      roas: beforeRoas,
      traffic: beforeTraffic,
      cost: beforeCost
    },
    after: {
      roas: afterRoas,
      traffic: afterTraffic,
      cost: afterCost
    },
    strategy
  };
};

// Service Page Detail View Component
export default function ServicePageView({
  onBack,
  onNavToContact,
  servicesData = initialServicePagesData,
  testimonialsData = []
}) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const serviceKey = slug;

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);
  const [allCandidates, setAllCandidates] = useState([]);
  const serviceSlugsInverse = {
    'google-ads-danismanligi': 'google',
    'meta-reklam-yonetimi': 'meta',
    'arama-motoru-optimizasyonu-seo': 'seo',
    'sosyal-medya-yonetimi': 'social',
    'e-ticaret-ve-pazaryeri-yonetimi': 'ecommerce',
    'donusum-odakli-web-tasarim': 'design'
  };
  const resolvedKey = serviceSlugsInverse[serviceKey] || serviceKey;
  const data = servicesData[resolvedKey];
  const toggleFaq = idx => {
    if (openFaqIndex === idx) {
      setOpenFaqIndex(null);
    } else {
      setOpenFaqIndex(idx);
    }
  };

  // Load all candidates and select one randomly on mount or serviceKey change
  useEffect(() => {
    if (!data) return;
    const candidates = [];

    // 1. Add default case study from service page data
    if (data.caseStudy) {
      candidates.push({
        brand: data.caseStudy.brand,
        industry: data.caseStudy.industry,
        challenge: data.caseStudy.challenge,
        solution: data.caseStudy.solution,
        metrics: data.caseStudy.metrics
      });
    }

    // 2. Map matching testimonials
    if (testimonialsData && testimonialsData.length > 0) {
      let testCategory = resolvedKey;
      if (resolvedKey === 'google') testCategory = 'google-ads';else if (resolvedKey === 'meta') testCategory = 'meta-ads';else if (resolvedKey === 'social') testCategory = 'social-media';else if (resolvedKey === 'design') testCategory = 'web-design';
      const categoryFiltered = testimonialsData.filter(t => t.category === testCategory);
      categoryFiltered.forEach(t => {
        const cs = mapTestimonialToCaseStudy(t);
        if (cs) {
          candidates.push({
            brand: cs.company,
            industry: cs.sector,
            challenge: `${cs.before.cost} ve ${cs.before.traffic} sorunu. ${cs.before.roas}`,
            solution: cs.strategy.join(" "),
            metrics: [{
              label: "Durum",
              val: cs.after.roas,
              icon: "fa-solid fa-chart-line"
            }, {
              label: "Elde Edilen",
              val: cs.after.traffic,
              icon: "fa-solid fa-arrow-up-right-dots"
            }, {
              label: "Fayda",
              val: cs.after.cost,
              icon: "fa-solid fa-percent"
            }]
          });
        }
      });
    }
    setAllCandidates(candidates);
    if (candidates.length > 0) {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      setActiveCaseStudy(candidates[randomIndex]);
    } else {
      setActiveCaseStudy(null);
    }
  }, [resolvedKey, testimonialsData, data]);
  const handleShuffle = () => {
    if (allCandidates.length > 1) {
      let nextCandidate = activeCaseStudy;
      let attempts = 0;
      while (attempts < 10) {
        const randomIndex = Math.floor(Math.random() * allCandidates.length);
        const chosen = allCandidates[randomIndex];
        if (chosen.brand !== activeCaseStudy?.brand) {
          nextCandidate = chosen;
          break;
        }
        attempts++;
      }
      setActiveCaseStudy(nextCandidate);
    }
  };
  if (!data) return null;
  const displayCase = activeCaseStudy || (data.caseStudy ? {
    brand: data.caseStudy.brand,
    industry: data.caseStudy.industry,
    challenge: data.caseStudy.challenge,
    solution: data.caseStudy.solution,
    metrics: data.caseStudy.metrics
  } : null);

  // Other services for "Related Services" section
  const allServiceKeys = Object.keys(servicesData).filter(k => k !== resolvedKey);
  const otherServices = allServiceKeys.slice(0, 3).map(key => ({
    key,
    ...servicesData[key]
  }));

  // Service slug mapping for navigation
  const serviceSlugs = {
    google: 'google-ads-danismanligi',
    meta: 'meta-reklam-yonetimi',
    seo: 'arama-motoru-optimizasyonu-seo',
    social: 'sosyal-medya-yonetimi',
    ecommerce: 'e-ticaret-ve-pazaryeri-yonetimi',
    design: 'donusum-odakli-web-tasarim'
  };

  // FAQ Schema for Google Rich Snippets
  const faqSchema = data.faqs ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  } : null;

  return <div className="service-page-view container">
      {/* FAQ Schema JSON-LD */}
      {faqSchema && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        </Helmet>
      )}

      {/* Back to Home & Breadcrumb */}
      <div className="service-page-nav">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Ana Sayfaya Dön
        </button>
        <div className="breadcrumb">
          <span>Ana Sayfa</span> &rarr; <span>Hizmetlerimiz</span> &rarr; <span className="active">{data.title}</span>
        </div>
      </div>

      {/* Header Info — Premium Animated Hero */}
      <motion.div
        className="service-page-hero service-hero-premium"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="service-hero-glow"></div>
        <motion.div
          className="service-hero-icon service-hero-icon-animated"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <i className={data.iconName}></i>
        </motion.div>
        <h1 className="service-title-text">{data.title}</h1>
        <p className="service-tagline-text">{data.tagline}</p>
        <p className="service-desc-text">{data.description}</p>
      </motion.div>

      {/* Grid of Key Features & Case Study */}
      <div className="service-page-grid">
        
        {/* Core Features */}
        <div className="glass-card service-features-card">
          <h3>Hizmet Kapsamımız</h3>
          <ul className="service-spec-list">
            {data.features.map((feature, idx) => <li key={idx}>
                <i className="fa-solid fa-circle-check"></i>
                <span>{feature}</span>
              </li>)}
          </ul>
        </div>

        {/* Case Study */}
        {displayCase && <div className="glass-card service-case-card">
            <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
              <span className="case-tag">VAKA ÇALIŞMASI (BAŞARI HİKAYESİ)</span>
              {allCandidates.length > 1 && <button className="shuffle-cases-btn-mini" onClick={handleShuffle} style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            backgroundColor: 'rgba(15,23,42,0.03)',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}>
                  <i className="fa-solid fa-shuffle"></i> Farklı Bir Hikaye Göster
                </button>}
            </div>
            <h3>{displayCase.brand}</h3>
            <p className="case-subtitle">Sektör: {displayCase.industry}</p>
            
            <div className="case-problem-solution">
              <div className="case-point">
                <strong>Zorluk (Problem):</strong>
                <p>{displayCase.challenge}</p>
              </div>
              <div className="case-point">
                <strong>Yol Haritamız:</strong>
                <p>{displayCase.solution}</p>
              </div>
            </div>

            <div className="case-metrics-grid">
              {displayCase.metrics.map((m, idx) => <div key={idx} className="metric-box">
                  <i className={m.icon || "fa-solid fa-chart-line"}></i>
                  <span className="metric-val">{m.val}</span>
                  <span className="metric-lbl">{m.label}</span>
                </div>)}
            </div>
          </div>}

      </div>

      {/* Service-Specific Process Section */}
      <div className="service-process-section">
        <div className="section-header">
          <span className="section-tag">Nasıl Çalışıyoruz?</span>
          <h2>4 Adımlı Hizmet Süreci</h2>
          <p className="section-desc">Markanıza değer katacak stratejik aşamalarla projenizi adım adım yönetiyoruz.</p>
        </div>
        
        <div className="service-process-grid">
          {data.process.map((step, idx) => (
            <motion.div
              key={idx}
              className="glass-card service-process-step-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
            >
              <span className="step-badge">{step.step}</span>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>


      {/* Service-Specific FAQ Section */}
      <div className="service-faq-section">
        <div className="section-header">
          <span className="section-tag">Sıkça Sorulan Sorular</span>
          <h2>Merak Edilenler</h2>
          <p className="section-desc">İlgili hizmetle alakalı aklınıza gelebilecek tüm soruları şeffafça yanıtlıyoruz.</p>
        </div>

        <div className="faq-list">
          {data.faqs.map((faq, idx) => <div key={idx} className={`glass-card faq-card ${openFaqIndex === idx ? 'open' : ''}`} onClick={() => toggleFaq(idx)}>
              <div className="faq-question-row">
                <h4>{faq.q}</h4>
                <i className={`fa-solid ${openFaqIndex === idx ? 'fa-chevron-up' : 'fa-chevron-down'} faq-arrow-icon`}></i>
              </div>
              <div className="faq-answer-content">
                <p>{faq.a}</p>
              </div>
            </div>)}
        </div>
      </div>

      {/* Service-Specific Bottom CTA Redirect Banner */}
      {/* Related Services */}
      {otherServices.length > 0 && (
        <div className="service-related-section">
          <div className="section-header">
            <span className="section-tag">Keşfet</span>
            <h2>Diğer Hizmetlerimiz</h2>
            <p className="section-desc">360° dijital büyüme için diğer hizmetlerimize de göz atın.</p>
          </div>
          <div className="service-related-grid">
            {otherServices.map((svc, idx) => (
              <motion.div
                key={svc.key}
                className="glass-card service-related-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                onClick={() => navigate(`/hizmetlerimiz/${serviceSlugs[svc.key] || svc.key}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="service-related-icon">
                  <i className={svc.iconName}></i>
                </div>
                <h4>{svc.title}</h4>
                <p>{svc.tagline}</p>
                <span className="service-related-link">
                  Detayları Gör <i className="fa-solid fa-arrow-right"></i>
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="glass-card service-bottom-cta">
        <div className="cta-content">
          <h2>Ege'nin Üretim Gücünü Dijitalle Katlayalım</h2>
          <p>Hizmetlerimiz hakkında daha fazla bilgi edinmek ve markanıza özel ücretsiz büyüme analizi almak için bizimle iletişime geçin.</p>
        </div>
        <div className="cta-action">
          <button className="btn btn-primary cta-btn" onClick={onNavToContact}>
            Ücretsiz Analiz & Teklif Al <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

    </div>;
}

// Dedicated Izmir Brand Story Page View Component
