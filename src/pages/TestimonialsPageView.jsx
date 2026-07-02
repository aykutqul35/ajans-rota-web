import { useState, useEffect } from 'react';
import { featuredStories } from '../data/mockData';
import AegeanSuccessMap from './AegeanSuccessMap';

const mapTestimonialToCaseStudy = item => {
  if (!item) return null;
  const nameLower = (item.company || "").toLowerCase();

  const isHotel = nameLower.includes("otel") || nameLower.includes("hotel") || nameLower.includes("pansiyon") || nameLower.includes("konaklama") || nameLower.includes("tatil") || nameLower.includes("turizm") || nameLower.includes("seyahat") || nameLower.includes("villa") || nameLower.includes("transfer") || nameLower.includes("yat") || nameLower.includes("çarter") || nameLower.includes("marin") || nameLower.includes("tekne");
  const isHealth = nameLower.includes("dental") || nameLower.includes("diş") || nameLower.includes("klinik") || nameLower.includes("tıp") || nameLower.includes("sağlık") || nameLower.includes("hastane") || nameLower.includes("eczane") || nameLower.includes("dr") || nameLower.includes("hekim");
  const isB2B = nameLower.includes("asansör") || nameLower.includes("yapı") || nameLower.includes("inşaat") || nameLower.includes("mermer") || nameLower.includes("demir") || nameLower.includes("metal") || nameLower.includes("çelik") || nameLower.includes("boya") || nameLower.includes("endüstri") || nameLower.includes("makine") || nameLower.includes("yedek") || nameLower.includes("döküm") || nameLower.includes("prefabrik") || nameLower.includes("lojistik") || nameLower.includes("kargo") || nameLower.includes("nakli") || nameLower.includes("taşım");
  const isFood = nameLower.includes("kurabiye") || nameLower.includes("gıda") || nameLower.includes("baharat") || nameLower.includes("mutfak") || nameLower.includes("unlu") || nameLower.includes("tatlı") || nameLower.includes("fırın") || nameLower.includes("un") || nameLower.includes("zeytin") || nameLower.includes("yağ") || nameLower.includes("şarap") || nameLower.includes("bağ") || nameLower.includes("restoran") || nameLower.includes("cafe") || nameLower.includes("kahve") || nameLower.includes("lezzet") || nameLower.includes("kebap") || nameLower.includes("lokanta") || nameLower.includes("gurme") || nameLower.includes("peynir");
  const isEcom = nameLower.includes("giyim") || nameLower.includes("butik") || nameLower.includes("tekstil") || nameLower.includes("moda") || nameLower.includes("tasarım") || nameLower.includes("ayakkabı") || nameLower.includes("deri") || nameLower.includes("kozmetik") || item.category === "ecommerce";
  const isSocial = item.category === "social-media" || nameLower.includes("sosyal") || nameLower.includes("instagram") || nameLower.includes("reels") || nameLower.includes("takipçi");
  const isDesign = item.category === "web-design" || nameLower.includes("web") || nameLower.includes("site") || nameLower.includes("tasarım") || nameLower.includes("yazılım") || nameLower.includes("kod");

  let logo = "📈";
  if (isHotel) logo = "🏨";else if (isHealth) logo = "🏥";else if (isB2B) logo = "🏗️";else if (isFood) logo = nameLower.includes("zeytin") || nameLower.includes("yağ") ? "🫒" : nameLower.includes("şarap") || nameLower.includes("bağ") ? "🍷" : "🍪";else if (nameLower.includes("okul") || nameLower.includes("akademi") || nameLower.includes("kolej") || nameLower.includes("eğitim") || nameLower.includes("kurs") || nameLower.includes("yurt")) logo = "🎓";else if (nameLower.includes("hukuk") || nameLower.includes("danışmanlık") || nameLower.includes("müşavir") || nameLower.includes("ofis")) logo = "⚖️";else if (isEcom) logo = "👕";else if (isSocial) logo = "📱";else if (isDesign) logo = "💻";

  let sector = "Dijital Pazarlama & Büyüme";
  if (isHotel) sector = "Turizm & Otelcilik Pazarlaması";else if (isHealth) sector = "Sağlık & Yerel Klinik Hizmetleri";else if (isB2B) sector = "B2B İhracat & Endüstriyel Pazarlama";else if (isFood) sector = "Gastronomi & Yöresel Ürün Pazarlaması";else if (isEcom) sector = "E-Ticaret & Pazaryeri Büyüme Yönetimi";else if (isSocial) sector = "Sosyal Medya Yönetimi & Etkileşim";else if (isDesign) sector = "Dönüşüm Odaklı Web Tasarım & UX";

  let beforeRoas = "Düşük Verimlilik";
  let beforeTraffic = "Sınırlı Görünürlük";
  let beforeCost = "Yüksek Edinme Maliyeti (CPA)";
  let afterRoas = item.metric || "Yüksek Dönüşüm";
  let afterTraffic = "Sürdürülebilir Büyüme Akışı";
  let afterCost = "%45+ Edinme Maliyeti (CPA) Avantajı";
  let strategy = ["Sektör trendleri analiz edilerek hedef kitle davranışlarına yönelik optimizasyonlar yapıldı.", "Kreatif testleri ve dönüşüm yolları A/B testleriyle iyileştirildi.", "Raporlama ve veri takibi altyapısı baştan aşağı yenilenerek şeffaflık sağlandı."];

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

export default // Dedicated Testimonials Page View Component
function TestimonialsPageView({
  onBack,
  settingsData,
  testimonialsData = [],
  handleNavClick
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(0);

  // State to hold randomized case studies
  const [caseStudies, setCaseStudies] = useState(() => {
    const cs1 = {
      company: settingsData?.cs1_company || "Alaçatı Ev Kurabiyecisi",
      logo: settingsData?.cs1_logo || "🍪",
      sector: settingsData?.cs1_sector || "E-Ticaret & Yöresel Gıda",
      before: {
        roas: settingsData?.cs1_before_roas || "1.8x ROAS",
        traffic: settingsData?.cs1_before_traffic || "4.500 / ay",
        cost: settingsData?.cs1_before_cost || "Yüksek Müşteri Kazanım Maliyeti"
      },
      after: {
        roas: settingsData?.cs1_after_roas || "6.4x ROAS",
        traffic: settingsData?.cs1_after_traffic || "32.000 / ay",
        cost: settingsData?.cs1_after_cost || "%65 Düşük Sipariş Edinme Maliyeti (CPA)"
      },
      strategy: [settingsData?.cs1_strat1 || "Sepet terk oranlarını azaltmak için ödeme adımları optimize edildi.", settingsData?.cs1_strat2 || "Meta Ads tarafında piksel verileri beslenerek Lookalike (Benzer) hedef kitleler kuruldu.", settingsData?.cs1_strat3 || "Yöresel kurabiye aramalarında Google SEO ile ilk sayfada 3 farklı anahtar kelimede liderlik sağlandı."]
    };
    const cs2 = {
      company: settingsData?.cs2_company || "Ege Zeytinyağları A.Ş.",
      logo: settingsData?.cs2_logo || "🫒",
      sector: settingsData?.cs2_sector || "Tarım İhracatı & B2B",
      before: {
        roas: settingsData?.cs2_before_roas || "Çevrimdışı Fuarlar",
        traffic: settingsData?.cs2_before_traffic || "1.200 / ay",
        cost: settingsData?.cs2_before_cost || "Sadece Dönemsel Talep ve Sipariş"
      },
      after: {
        roas: settingsData?.cs2_after_roas || "4.8x ROAS (Google Ads)",
        traffic: settingsData?.cs2_after_traffic || "18.500 / ay",
        cost: settingsData?.cs2_after_cost || "Yıl Boyu Kesintisiz B2B İthalatçı Talebi"
      },
      strategy: [settingsData?.cs2_strat1 || "Almanca, İngilizce ve Fransızca dillerinde B2B hedefli mikro siteler kuruldu.", settingsData?.cs2_strat2 || "Avrupa genelinde ithalatçı ve toptancı arama sorgularına özel Google Arama Ağı reklamları kurgulandı.", settingsData?.cs2_strat3 || "LinkedIn Campaign Manager kullanılarak gıda distribütörü karar vericileri hedeflendi."]
    };
    const cs3 = {
      company: settingsData?.cs3_company || "Kordon Tıp Merkezi",
      logo: settingsData?.cs3_logo || "🏥",
      sector: settingsData?.cs3_sector || "Sağlık & Yerel Hizmet",
      before: {
        roas: settingsData?.cs3_before_roas || "2.1% Dönüşüm Oranı",
        traffic: settingsData?.cs3_before_traffic || "8.000 / ay",
        cost: settingsData?.cs3_before_cost || "Düşük Yerel Google Arama Görünürlüğü"
      },
      after: {
        roas: settingsData?.cs3_after_roas || "5.6% Dönüşüm Oranı",
        traffic: settingsData?.cs3_after_traffic || "24.500 / ay",
        cost: settingsData?.cs3_after_cost || "İzmir Genelinde Branş Aramalarında Liderlik"
      },
      strategy: [settingsData?.cs3_strat1 || "Kullanıcı deneyimi yüksek, hızlı ve KVKK uyumlu randevu sayfaları tasarlandı.", settingsData?.cs3_strat2 || "Yerel SEO optimizasyonu ile Google Haritalar'da üst sıralara çıkıldı.", settingsData?.cs3_strat3 || "Branş bazlı arama sorguları için bilgilendirici içerik siloları inşa edilerek trafik artırıldı."]
    };
    if (testimonialsData && testimonialsData.length >= 3) {
      const shuffled = [...testimonialsData].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      return selected.map(mapTestimonialToCaseStudy);
    }
    return [cs1, cs2, cs3];
  });
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredStories.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Sync / Shuffle logic when testimonialsData loads or changes
  useEffect(() => {
    if (testimonialsData && testimonialsData.length >= 3) {
      const shuffled = [...testimonialsData].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      setCaseStudies(selected.map(mapTestimonialToCaseStudy));
      setSelectedCaseStudy(0);
    }
  }, [testimonialsData]);
  const handleShuffleCases = () => {
    if (testimonialsData && testimonialsData.length >= 3) {
      const shuffled = [...testimonialsData].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      setCaseStudies(selected.map(mapTestimonialToCaseStudy));
      setSelectedCaseStudy(0);
    }
  };
  const formatTime = secs => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };
  const getVideoSubtitle = time => {
    const name = settingsData?.video_title?.split(' - ')[0] || "Cemil Öztürk";
    if (time < 5) return `Merhaba, ben ${name}. Röportaj kesitimize hoş geldiniz.`;
    if (time < 15) return "Ajans Rota ile çalışmaya başlamadan önce dijital reklam bütçemizin çoğu boşa gidiyordu.";
    if (time < 28) return "Ekip, hedef kitlemizi tamamen bizim sektörel alıcılarımıza daralttı.";
    if (time < 42) return "Sonuçlar inanılmaz oldu. Boşa giden reklam bütçemiz çok ciddi oranda azaldı!";
    if (time < 56) return "Aynı bütçeyle katlarca daha fazla nitelikli kurumsal form almaya başladık.";
    if (time < 70) return "Performans pazarlama alanında profesyonel dijital destek arayan herkese şiddetle tavsiye ederim.";
    return "Ajans Rota'ya tüm emekleri için teşekkür ederiz. Birlikte daha çok büyüyeceğiz!";
  };
  const logoWall = [{
    company: settingsData?.logo1_company || "Ege Zeytin Evi",
    logo: settingsData?.logo1_logo || "🫒",
    services: settingsData?.logo1_services || "Google Ads + B2B İhracat",
    metric: settingsData?.logo1_metric || "8.4x ROAS"
  }, {
    company: settingsData?.logo2_company || "Urla Şarapçılık",
    logo: settingsData?.logo2_logo || "🍷",
    services: settingsData?.logo2_services || "Sosyal Medya + SEO",
    metric: settingsData?.logo2_metric || "+140% Yerel Ziyaret"
  }, {
    company: settingsData?.logo3_company || "Alsancak Dental",
    logo: settingsData?.logo3_logo || "🦷",
    services: settingsData?.logo3_services || "Web Tasarım + Meta Ads",
    metric: settingsData?.logo3_metric || "2x Randevu Talebi"
  }, {
    company: settingsData?.logo4_company || "Karşıyaka Yapı",
    logo: settingsData?.logo4_logo || "🏗️",
    services: settingsData?.logo4_services || "SEO + Performans Pazarlama",
    metric: settingsData?.logo4_metric || "+160% Nitelikli Form"
  }, {
    company: settingsData?.logo5_company || "Çeşme Marina",
    logo: settingsData?.logo5_logo || "⚓",
    services: settingsData?.logo5_services || "Sosyal Medya Yönetimi",
    metric: settingsData?.logo5_metric || "%45 Verimlilik"
  }, {
    company: settingsData?.logo6_company || "Kordon Optik",
    logo: settingsData?.logo6_logo || "👓",
    services: settingsData?.logo6_services || "Google Shopping + Meta Ads",
    metric: settingsData?.logo6_metric || "+210% Mağaza Trafiği"
  }];

  // Filtering & Sorting logic
  const filteredTestimonials = testimonialsData.filter(item => {
    const query = searchQuery.toLowerCase();
    const matchQuery = (item.name || '').toLowerCase().includes(query) || (item.company || '').toLowerCase().includes(query) || (item.quote || '').toLowerCase().includes(query);
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    return matchQuery && matchCat;
  });
  const sortedTestimonials = [...filteredTestimonials].sort((a, b) => {
    if (sortBy === 'alphabetical') {
      return (a.company || '').localeCompare(b.company || '', 'tr');
    }
    if (sortBy === 'high-metric') {
      if (b.rating !== a.rating) return b.rating - a.rating;
      const bHasMetric = b.metric ? 1 : 0;
      const aHasMetric = a.metric ? 1 : 0;
      return bHasMetric - aHasMetric;
    }
    return 0; // default
  });
  const itemsPerPage = 6;
  const totalPages = Math.ceil(sortedTestimonials.length / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);
  const paginatedTestimonials = sortedTestimonials.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);
  const handleCategoryChange = category => {
    setActiveCategory(category);
    setCurrentPage(1);
  };
  const handlePageChange = page => {
    setCurrentPage(page);
    const element = document.getElementById('testimonials-list-section');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  if (!caseStudies || caseStudies.length === 0 || !caseStudies[selectedCaseStudy]) {
    return <div className="testimonials-page-view container" style={{
      padding: '6rem 2rem',
      textAlign: 'center',
      color: 'var(--text-light)'
    }}>
        <div className="spinner-border text-primary" role="status" style={{
        margin: 'auto',
        marginBottom: '1.5rem',
        width: '3rem',
        height: '3rem'
      }}>
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
        <p style={{
        fontSize: '1.1rem',
        fontWeight: '500'
      }}>Referans Hikayeleri Yükleniyor...</p>
      </div>;
  }
  return <div className="testimonials-page-view container">
      {/* Navigation & Breadcrumb */}
      <div className="service-page-nav">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Ana Sayfaya Dön
        </button>
        <div className="breadcrumb">
          <span>Ana Sayfa</span> &rarr; <span className="active">Referanslarımız</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="izmir-hero-header">
        <h1 className="izmir-hero-title">Başarı Hikayeleri & <span>Müşteri Yorumları</span></h1>
        <p className="izmir-hero-desc">
          Ege'nin ve İzmir'in yükselen markalarının dijitalde Ajans Rota ile yakaladığı büyüme başarıları.
        </p>
      </div>

      {/* Highlights Slider & Izmir Hero Image */}
      <div className="testimonials-hero-container">
        <div className="testimonials-hero-content">
          <div className="testimonials-slider-wrapper">
            <span className="slider-tag">ÖNE ÇIKAN BAŞARI HİKAYESİ</span>
            <div className="testimonials-slider-content">
              <div className="slide-card">
                <span className="slide-category">{featuredStories[currentSlide].category}</span>
                <h3>{featuredStories[currentSlide].title}</h3>
                <p className="slide-quote">"{featuredStories[currentSlide].quote}"</p>
                <div className="slide-footer">
                  <div className="slide-client">
                    <strong>{featuredStories[currentSlide].manager}</strong>
                    <span>{featuredStories[currentSlide].role}</span>
                  </div>
                  <div className="slide-metric">
                    <i className="fa-solid fa-circle-up"></i>
                    <span>{featuredStories[currentSlide].metric}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="slider-controls">
              <button className="slider-arrow" aria-label="Önceki Slayt" onClick={() => setCurrentSlide(prev => (prev - 1 + featuredStories.length) % featuredStories.length)}>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <div className="slider-dots">
                {featuredStories.map((_, index) => <span key={index} className={`slider-dot ${currentSlide === index ? 'active' : ''}`} onClick={() => setCurrentSlide(index)}></span>)}
              </div>
              <button className="slider-arrow" aria-label="Sonraki Slayt" onClick={() => setCurrentSlide(prev => (prev + 1) % featuredStories.length)}>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="testimonials-hero-image">
          <picture>
            {settingsData?.testimonials_hero_image_mobile && <source media="(max-width: 768px)" srcSet={settingsData.testimonials_hero_image_mobile} />}
            <img src={settingsData?.testimonials_hero_image || "/images/izmir_references_hero.png"} alt="Ajans Rota İzmir Referansları ve Başarı Grafiği" />
          </picture>
          <div className="image-overlay-badge">
            <i className="fa-solid fa-trophy"></i>
            <span>İzmir'den Küresel Pazara</span>
          </div>
        </div>
      </div>

      {/* 1. Metrics Dashboard */}
      <div className="testimonials-metrics-grid">
        <div className="metric-dashboard-card">
          <div className="metric-card-icon">
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <div className="metric-card-info">
            <h4>{settingsData?.ref_kpi1_val || "6.8x"}</h4>
            <p>{settingsData?.ref_kpi1_title || "Ortalama ROAS Büyümesi"}</p>
          </div>
        </div>
        <div className="metric-dashboard-card">
          <div className="metric-card-icon">
            <i className="fa-solid fa-users"></i>
          </div>
          <div className="metric-card-info">
            <h4>{settingsData?.ref_kpi2_val || "+180K/ay"}</h4>
            <p>{settingsData?.ref_kpi2_title || "Organik Trafik Artışı"}</p>
          </div>
        </div>
        <div className="metric-dashboard-card">
          <div className="metric-card-icon">
            <i className="fa-solid fa-wallet"></i>
          </div>
          <div className="metric-card-info">
            <h4>{settingsData?.ref_kpi3_val || "12.5M₺+"}</h4>
            <p>{settingsData?.ref_kpi3_title || "Yönetilen Reklam Bütçesi"}</p>
          </div>
        </div>
        <div className="metric-dashboard-card">
          <div className="metric-card-icon">
            <i className="fa-solid fa-smile"></i>
          </div>
          <div className="metric-card-info">
            <h4>{settingsData?.ref_kpi4_val || "%98.7"}</h4>
            <p>{settingsData?.ref_kpi4_title || "Müşteri Memnuniyeti"}</p>
          </div>
        </div>
      </div>

      {/* 2. Before / After Case Studies */}
      <div className="testimonials-case-studies-section">
        <div className="section-header" style={{
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
          <span className="section-tag">Detaylı İncelemeler</span>
          <h2 className="section-title">Öncesi / Sonrası Büyüme Analizleri</h2>
          <p className="section-desc" style={{
          marginBottom: '1.25rem'
        }}>Ajans Rota dokunuşuyla gerçekleşen dönüşümü rakamlarla inceleyin.</p>
          {testimonialsData && testimonialsData.length > 3 && <button onClick={handleShuffleCases} className="btn btn-secondary shuffle-cases-btn" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(var(--primary-rgb), 0.08)',
          color: 'var(--primary)',
          border: '1px solid rgba(var(--primary-rgb), 0.25)',
          cursor: 'pointer',
          borderRadius: '50px',
          padding: '0.5rem 1.25rem',
          fontSize: '0.8rem',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          margin: '0.5rem auto 0 auto'
        }} title="Yeni Rastgele Başarı Hikayeleri Yükle">
              <i className="fa-solid fa-shuffle"></i> <span>Başarı Hikayelerini Karıştır</span>
            </button>}
        </div>

        <div className="case-study-tabs">
          {caseStudies.map((study, idx) => <button key={idx} className={`case-study-tab-btn ${selectedCaseStudy === idx ? 'active' : ''}`} onClick={() => setSelectedCaseStudy(idx)}>
              <span>{study.logo}</span> {study.company}
            </button>)}
        </div>

        <div className="glass-card case-study-card" style={{
        padding: 0,
        overflow: 'hidden'
      }}>
          <div className="case-study-visuals">
            <div className="comparison-row">
              <div className="compare-box before">
                <span className="compare-badge before">Ajans Rota Öncesi</span>
                <div className="compare-content">
                  <span className="compare-val" style={{
                  color: '#ef4444'
                }}>{caseStudies[selectedCaseStudy].before.roas}</span>
                  <span className="compare-lbl">{caseStudies[selectedCaseStudy].before.traffic}</span>
                </div>
                <div style={{
                fontSize: '0.75rem',
                color: '#b91c1c',
                marginTop: '6px',
                fontWeight: '500'
              }}>
                  <i className="fa-solid fa-circle-xmark"></i> {caseStudies[selectedCaseStudy].before.cost}
                </div>
              </div>

              <div className="compare-box after">
                <span className="compare-badge after">Ajans Rota Sonrası</span>
                <div className="compare-content">
                  <span className="compare-val" style={{
                  color: '#10b981'
                }}>{caseStudies[selectedCaseStudy].after.roas}</span>
                  <span className="compare-lbl">{caseStudies[selectedCaseStudy].after.traffic}</span>
                </div>
                <div style={{
                fontSize: '0.75rem',
                color: '#047857',
                marginTop: '6px',
                fontWeight: '600'
              }}>
                  <i className="fa-solid fa-circle-check"></i> {caseStudies[selectedCaseStudy].after.cost}
                </div>
              </div>
            </div>
          </div>
          <div className="case-study-details">
            <h3>{caseStudies[selectedCaseStudy].company}</h3>
            <span className="sector-tag">{caseStudies[selectedCaseStudy].sector}</span>
            
            <div className="strategy-list">
              <h4 style={{
              fontSize: '0.9rem',
              fontWeight: '700',
              color: 'var(--text-light)',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Uygulanan Büyüme Stratejisi:</h4>
              {caseStudies[selectedCaseStudy].strategy.map((item, index) => <div key={index} className="strategy-item">
                  <div className="strategy-bullet">{index + 1}</div>
                  <div className="strategy-text">{item}</div>
                </div>)}
            </div>
          </div>
        </div>
      </div>

      {/* 3. İnteraktif Ege Başarı Haritası */}
      <AegeanSuccessMap settingsData={settingsData} handleNavClick={handleNavClick} />

      {/* 4. Client Logo Wall */}
      <div className="testimonials-logo-wall">
        <div className="section-header" style={{
        marginBottom: '2rem'
      }}>
          <span className="section-tag">Markalarımız</span>
          <h2 className="section-title">Ege'nin Güven Duyduğu Markalar</h2>
          <p className="section-desc">Farklı sektörlerden onlarca firma dijital büyüme rotasını Ajans Rota ile çizdi.</p>
        </div>

        <div className="logo-wall-grid">
          {logoWall.map((logo, idx) => <div key={idx} className="logo-wall-card">
              <div className="logo-icon-placeholder">{logo.logo}</div>
              <h4>{logo.company}</h4>
              <div className="logo-tooltip-card">
                <span className="tooltip-title">{logo.company}</span>
                <span className="tooltip-services">{logo.services}</span>
                <span className="tooltip-metric">
                  <i className="fa-solid fa-arrow-trend-up"></i> {logo.metric}
                </span>
              </div>
            </div>)}
        </div>
      </div>

      {/* 5. Main Testimonials Filter & List Area */}
      <div id="testimonials-list-section" className="testimonials-section" style={{
      border: 'none',
      padding: '2rem 0',
      background: 'transparent',
      boxShadow: 'none'
    }}>
        <div className="section-header">
          <span className="section-tag" style={{
          color: 'var(--secondary)',
          borderColor: 'rgba(20,184,166,0.2)',
          backgroundColor: 'rgba(20,184,166,0.05)'
        }}>
            Müşteri Deneyimleri
          </span>
          <h2 className="section-title">Markalarımızın Dilinden Ajans Rota</h2>
          <p className="section-desc">Bizimle çalışan ve başarısını paylaşan mutlu iş ortaklarımızın gerçek yorumları.</p>
        </div>

        {/* Category Filter, Search and Sort Row */}
        <div className="references-controls-row">
          <div className="search-input-wrapper">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Şirket, isim veya yorum içeriği ara..." value={searchQuery} onChange={e => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }} />
          </div>

          <div className="sort-select-wrapper">
            <select value={sortBy} onChange={e => {
            setSortBy(e.target.value);
            setCurrentPage(1);
          }}>
              <option value="default">Sırala: Varsayılan</option>
              <option value="high-metric">En Yüksek Skora Göre</option>
              <option value="alphabetical">Alfabetik (Şirket A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filtering Buttons */}
        <div className="testimonials-filter-container" style={{
        marginBottom: '2.5rem'
      }}>
          <button className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => handleCategoryChange('all')}>Tüm Çalışmalar</button>
          <button className={`filter-btn ${activeCategory === 'google-ads' ? 'active' : ''}`} onClick={() => handleCategoryChange('google-ads')}>Google Ads</button>
          <button className={`filter-btn ${activeCategory === 'meta-ads' ? 'active' : ''}`} onClick={() => handleCategoryChange('meta-ads')}>Meta Ads (FB/IG)</button>
          <button className={`filter-btn ${activeCategory === 'seo' ? 'active' : ''}`} onClick={() => handleCategoryChange('seo')}>SEO & Organik Büyüme</button>
          <button className={`filter-btn ${activeCategory === 'social-media' ? 'active' : ''}`} onClick={() => handleCategoryChange('social-media')}>Sosyal Medya</button>
          <button className={`filter-btn ${activeCategory === 'ecommerce' ? 'active' : ''}`} onClick={() => handleCategoryChange('ecommerce')}>E-Ticaret & Pazaryeri</button>
          <button className={`filter-btn ${activeCategory === 'web-design' ? 'active' : ''}`} onClick={() => handleCategoryChange('web-design')}>Web Tasarım</button>
        </div>

        {/* Grid Render */}
        <div className="testimonials-grid">
          {paginatedTestimonials.map(testimonial => <div key={testimonial.id} className="glass-card testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar" style={{
              overflow: 'hidden',
              padding: 0
            }}>
                  {testimonial.logo || testimonial.image ? <img src={testimonial.logo || testimonial.image} alt={testimonial.company} style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }} /> : testimonial.initials}
                </div>
                <div className="testimonial-meta">
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.company} &bull; {testimonial.role}</span>
                </div>
              </div>
              <div className="rating">
                {[...Array(testimonial.rating)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
              </div>
              <p className="testimonial-quote">
                "{testimonial.quote}"
              </p>
              {testimonial.metric && <div className="testimonial-metric-badge">
                  <i className="fa-solid fa-circle-up" style={{
              marginRight: '6px'
            }}></i>
                  <span>{testimonial.metric}</span>
                </div>}
            </div>)}
          {paginatedTestimonials.length === 0 && <div className="glass-card" style={{
          gridColumn: '1 / -1',
          padding: '3rem',
          textAlign: 'center',
          color: 'var(--text-muted)'
        }}>
              <i className="fa-solid fa-folder-open" style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            display: 'block',
            color: 'var(--primary)'
          }}></i>
              Kriterlere uygun referans kaydı bulunamadı.
            </div>}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && <div className="pagination-container" style={{
        marginTop: '2.5rem'
      }}>
            <button className="pagination-btn arrow-btn" onClick={() => handlePageChange(safeCurrentPage - 1)} disabled={safeCurrentPage === 1} aria-label="Önceki Sayfa">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          return <button key={pageNumber} className={`pagination-btn ${safeCurrentPage === pageNumber ? 'active' : ''}`} onClick={() => handlePageChange(pageNumber)}>
                  {pageNumber}
                </button>;
        })}

            <button className="pagination-btn arrow-btn" onClick={() => handlePageChange(safeCurrentPage + 1)} disabled={safeCurrentPage === totalPages} aria-label="Sonraki Sayfa">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>}

        {/* References Call to Action */}
        <div className="references-cta-banner glass-card" style={{
        marginTop: '4rem'
      }}>
          <div className="references-cta-content">
            <h3>Siz de Bu Başarı Hikayeleri Arasında Yer Alabilirsiniz!</h3>
            <p>
              Ege'nin rekabetçi pazarında markanızı büyüterek rakiplerinizin önüne geçmek ve Ajans Rota ile dijital cironuzu katlamak için ilk adımı atın.
            </p>
          </div>
          <div className="references-cta-action">
            <button className="btn btn-primary cta-btn" onClick={() => handleNavClick('contact')}>
              <span>Ücretsiz Büyüme Analizi Al</span>
              <i className="fa-solid fa-rocket"></i>
            </button>
          </div>
        </div>
      </div>


    </div>;
}

// Dedicated Contact Page View Component
