import { categories } from '../data/mockData';

export const slugify = text => {
  if (!text) return '';
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u').replace(/[şŞ]/g, 's').replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[çÇ]/g, 'c').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

export const getCategoryLabel = key => {
  const cat = categories.find(c => c.key === key);
  return cat ? cat.label : key;
};

export const getCategoryIcon = key => {
  const cat = categories.find(c => c.key === key);
  return cat ? cat.icon : 'fa-solid fa-file-lines';
};

export const detectTrafficSource = () => {
  if (typeof window === 'undefined') return 'Organik (SEO)';
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const gclid = urlParams.get('gclid');
  const fbclid = urlParams.get('fbclid');
  if (utmSource) {
    const src = utmSource.toLowerCase();
    if (src.includes('google') || src.includes('gads') || src.includes('adwords') || src.includes('cpc')) {
      return 'Google Ads';
    }
    if (src.includes('meta') || src.includes('facebook') || src.includes('instagram') || src.includes('fb') || src.includes('ig') || src.includes('social')) {
      return 'Meta Ads';
    }
    if (src.includes('seo') || src.includes('organic') || src.includes('organik')) {
      return 'Organik (SEO)';
    }
    return utmSource.substring(0, 30); // Return custom source limit 30 chars
  }
  if (gclid) {
    return 'Google Ads';
  }
  if (fbclid) {
    return 'Meta Ads';
  }
  const referrer = document.referrer ? document.referrer.toLowerCase() : '';
  if (referrer) {
    if (referrer.includes('google.com')) {
      return 'Organik (SEO)';
    }
    if (referrer.includes('facebook.com') || referrer.includes('instagram.com') || referrer.includes('t.co') || referrer.includes('twitter.com')) {
      return 'Meta Ads';
    }
  }
  return 'Organik (SEO)';
};

export const getSmartGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) return { top: "İnsanlar Uyur, Sistem Uyumaz.", highlight: "7/24 Otonom Optimizasyon" };
    if (hour >= 6 && hour < 12) return { top: "Duygusal Kararlar Yok.", highlight: "Sadece Saf Veri." };
    if (hour >= 12 && hour < 18) return { top: "Rakiplerinizi Geride Bırakan", highlight: "Yapay Zeka Destekli Büyüme" };
    return { top: "Durdurulamaz Bir Algoritma", highlight: "Otonom Satış Gücü" };
  };

export const getSeoData = path => {
    if (path === '/') return {
      title: "Ajans Rota | İzmir Dijital Pazarlama Ajansı — Google Ads, SEO, Meta Reklam",
      description: "İzmir, Urla, Alaçatı ve Çeşme'de Google Ads, SEO, Meta Reklam ve sosyal medya yönetimi. Ege bölgesinin büyüme odaklı dijital ajansı. Ücretsiz analiz için hemen iletişime geçin.",
      canonicalPath: '/'
    };
    if (path === '/hakkimizda') return {
      title: "Hakkımızda — Hikayemiz ve Vizyonumuz | Ajans Rota İzmir",
      description: "Ajans Rota'nın kuruluş hikayesi, Ege'nin dijital büyüme ajansı olarak vizyonumuz ve İzmir'den tüm Türkiye'ye uzanan yolculuğumuz.",
      canonicalPath: '/hakkimizda'
    };
    if (path === '/iletisim') return {
      title: "İletişim — Ücretsiz Dijital Analiz Talebi | Ajans Rota İzmir",
      description: "Dijital pazarlama ihtiyaçlarınız için bizimle iletişime geçin. İzmir merkezli ofisimizden tüm Ege bölgesine hizmet veriyoruz.",
      canonicalPath: '/iletisim'
    };
    if (path === '/neden-izmir') return {
      title: "Neden İzmir? — Ege'nin Dijital Avantajları | Ajans Rota",
      description: "İzmir'de bir dijital ajansla çalışmanın avantajları: Ege bölgesi e-ticaret ekosistemi, yerel pazar bilgisi ve maliyet avantajları.",
      canonicalPath: '/neden-izmir'
    };
    if (path === '/referanslar') return {
      title: "Müşteri Yorumları ve Başarı Hikayeleri | Ajans Rota İzmir",
      description: "İzmir ve Ege bölgesinden 50+ müşterimizin gerçek başarı hikayeleri. Google Ads, SEO ve sosyal medya kampanya sonuçları.",
      canonicalPath: '/referanslar'
    };
    if (path === '/ekiplerimiz') return {
      title: "Uzman Ekibimiz — Google & Meta Sertifikalı Profesyoneller | Ajans Rota",
      description: "Google Ads, SEO, Meta Reklam ve Sosyal Medya alanlarında sertifikalı uzmanlardan oluşan İzmir ekibimizle tanışın.",
      canonicalPath: '/ekiplerimiz'
    };
    if (path === '/blog' || path.startsWith('/blog/')) return {
      title: "Dijital Pazarlama Blogu — SEO, Google Ads, Sosyal Medya Rehberleri | Ajans Rota",
      description: "İzmir ve Ege bölgesi işletmeleri için dijital pazarlama trendleri, SEO ipuçları, Google Ads optimizasyonu ve e-ticaret büyüme taktikleri.",
      canonicalPath: path
    };
    if (path.startsWith('/hizmetlerimiz/')) return {
      title: `${path.split('/').pop()?.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())} Hizmeti | Ajans Rota İzmir`,
      description: `İzmir ve Ege bölgesinde profesyonel ${path.split('/').pop()?.replace(/-/g, ' ')} hizmeti. Veri odaklı stratejiler ve ölçülebilir sonuçlar.`,
      canonicalPath: path
    };
    if (path.startsWith('/dijital-ajans/')) return {
      title: `${path.split('/').pop()?.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())} Dijital Ajans | Ajans Rota`,
      description: `${path.split('/').pop()?.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())} bölgesinde Google Ads, SEO ve sosyal medya yönetimi hizmetleri. Yerel pazar bilgisiyle dijital büyüme.`,
      canonicalPath: path
    };
    if (path === '/seo-analizi') return {
      title: "Ücretsiz SEO Analizi — Sitenizi Hemen Test Edin | Ajans Rota İzmir",
      description: "Web sitenizin SEO performansını ücretsiz analiz edin. Teknik SEO hataları, sayfa hızı ve mobil uyumluluk raporunuzu anında alın.",
      canonicalPath: '/seo-analizi'
    };
    if (path === '/kobi-endeksi') return {
      title: "KOBİ Dijitalleşme Endeksi — Dijital Olgunluk Testi | Ajans Rota",
      description: "İşletmenizin dijital olgunluk seviyesini test edin. Kişiselleştirilmiş dijitalleşme yol haritanızı ücretsiz çizin.",
      canonicalPath: '/kobi-endeksi'
    };
    if (path === '/kreatif-vitrin') return {
      title: "Kreatif Vitrin — Web Tasarım ve Video Portföyü | Ajans Rota İzmir",
      description: "Ajans Rota tasarım ekibinin modern web siteleri, landing page tasarımları ve video kreatifleri portföyü.",
      canonicalPath: '/kreatif-vitrin'
    };
    if (path === '/rakip-analizi') return {
      title: "Ücretsiz Rakip Analizi — Dijital Strateji Karşılaştırma | Ajans Rota",
      description: "Rakiplerinizin Google Ads stratejilerini, SEO sıralamalarını ve sosyal medya performansını ücretsiz analiz edin.",
      canonicalPath: '/rakip-analizi'
    };
    if (path === '/akademi') return {
      title: "Dijital Pazarlama Akademisi — Eğitim ve Sertifika | Ajans Rota İzmir",
      description: "Google Ads, SEO ve sosyal medya konularında profesyonel dijital pazarlama eğitimleri ve sertifika programları.",
      canonicalPath: '/akademi'
    };
    if (path === '/seffaf-panel') return {
      title: "Şeffaf Panel — Canlı Raporlama Sistemi | Ajans Rota",
      description: "Müşterilerimize özel şeffaf raporlama paneli. Reklam harcamalarınızı ve kampanya performansınızı gerçek zamanlı takip edin.",
      canonicalPath: '/seffaf-panel'
    };
    // Admin & portal pages (noindex)
    if (path.startsWith('/rota-management-vault-x9') || path.startsWith('/portal-girisi-x9') || path.startsWith('/client-portal-secure')) return {
      title: "Yönetim Paneli | Ajans Rota",
      description: "Ajans Rota yönetim paneli.",
      canonicalPath: path,
      noIndex: true
    };
    // Default fallback
    return {
      title: "Ajans Rota | İzmir Dijital Pazarlama ve Büyüme Ajansı",
      description: "İzmir'in veri odaklı dijital pazarlama ajansı. Google Ads, SEO, Meta Reklam ve e-ticaret danışmanlığı.",
      canonicalPath: path
    };
  };

export const getAgencyStatus = (settingsData) => {
    try {
      const now = new Date();
      // Use Turkey Time (UTC+3) since the agency is based in Izmir
      const turkeyTime = new Date(now.toLocaleString("en-US", {
        timeZone: "Europe/Istanbul"
      }));
      const day = turkeyTime.getDay(); // 0: Sunday, 6: Saturday
      const hours = turkeyTime.getHours();
      const minutes = turkeyTime.getMinutes();
      const timeValue = hours * 60 + minutes;
      const startStr = settingsData.working_hours_start || "09:00";
      const endStr = settingsData.working_hours_end || "18:30";
      const [startH, startM] = startStr.split(":").map(Number);
      const [endH, endM] = endStr.split(":").map(Number);
      const startTimeValue = startH * 60 + startM;
      const endTimeValue = endH * 60 + endM;
      const month = turkeyTime.getMonth() + 1;
      const date = turkeyTime.getDate();
      const formattedDate = `${turkeyTime.getFullYear()}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      const formattedMonthDay = `${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      const nationalHolidays = ["01-01",
      // Yılbaşı
      "04-23",
      // 23 Nisan
      "05-01",
      // 1 Mayıs
      "05-19",
      // 19 Mayıs
      "07-15",
      // 15 Temmuz
      "08-30",
      // 30 Ağustos
      "10-29" // 29 Ekim
      ];
      const customHolidaysStr = settingsData.custom_holidays || "";
      const customHolidays = customHolidaysStr.split(",").map(d => d.trim());
      if (nationalHolidays.includes(formattedMonthDay) || customHolidays.includes(formattedDate)) {
        return {
          status: "closed",
          text: "Kapalı / Resmi Tatil"
        };
      }
      if (day === 0 || day === 6) {
        return {
          status: "closed",
          text: "Kapalı / Hafta Sonu Tatili"
        };
      }
      if (timeValue >= startTimeValue && timeValue < endTimeValue) {
        return {
          status: "open",
          text: "Şimdi Açık / Ajans Aktif"
        };
      } else {
        return {
          status: "closed",
          text: "Kapalı / Mesai Dışı"
        };
      }
    } catch (e) {
      // Fallback
      return {
        status: "open",
        text: "Şimdi Açık / Ajans Aktif"
      };
    }
  };

export const seoSlugs = {
  'google': 'google-ads-danismanligi',
  'meta': 'meta-reklam-yonetimi',
  'seo': 'arama-motoru-optimizasyonu-seo',
  'social': 'sosyal-medya-yonetimi',
  'ecommerce': 'e-ticaret-ve-pazaryeri-yonetimi',
  'design': 'donusum-odakli-web-tasarim'
};
