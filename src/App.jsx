import { Toaster } from 'react-hot-toast';
import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import SEO from './components/SEO';
import SkeletonLoader from './components/SkeletonLoader';
import FadeIn from './components/FadeIn';
import StaggerContainer, { StaggerItem } from './components/StaggerContainer';
const ClientTransparencyPageView = lazy(() => import('./components/ClientTransparencyPageView'));
const ServicePageView = lazy(() => import('./pages/ServicePageView'));
const IzmirPageView = lazy(() => import('./pages/IzmirPageView'));

const TestimonialsPageView = lazy(() => import('./pages/TestimonialsPageView'));
const ContactPageView = lazy(() => import('./pages/ContactPageView'));
const SeoAuditPageView = lazy(() => import('./pages/SeoAuditPageView'));
const KobiIndexPageView = lazy(() => import('./pages/KobiIndexPageView'));
const CreativeShowcasePageView = lazy(() => import('./pages/CreativeShowcasePageView'));
const CompetitorAnalysisPageView = lazy(() => import('./pages/CompetitorAnalysisPageView'));
const AkademiPageView = lazy(() => import('./pages/AkademiPageView'));
const WhatsAppAssistantWidget = lazy(() => import('./pages/WhatsAppAssistantWidget'));
const AboutPageView = lazy(() => import('./pages/AboutPageView'));
const LegalPageView = lazy(() => import('./pages/LegalPageView'));
const TeamPageView = lazy(() => import('./pages/TeamPageView'));
const BlogPageView = lazy(() => import('./pages/BlogPageView'));
const AdminDashboardView = lazy(() => import('./pages/AdminDashboardView'));
const Login = lazy(() => import('./pages/admin/Login'));
const LocationPageView = lazy(() => import('./pages/LocationPageView'));
import ProtectedRoute from './components/ProtectedRoute';
import LeadPopup from './components/LeadPopup';
import SocialProofToast from './components/SocialProofToast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CookieConsent from './components/CookieConsent';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';


import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { budgetSteps, initialServicePagesData, featuredStories, initialTeamMembers, initialBlogPosts, categories, whyAgencyData, testimonials } from './data/mockData';

// Detailed service pages data

// Service Page Detail View Component

// Dedicated Izmir Brand Story Page View Component

// Featured Stories for Slider



// Dedicated Testimonials Page View Component

// Dedicated Contact Page View Component

// Dedicated SEO Audit Page View Component

// ==========================================
// 1. KOBİ DİJİTALLESME ENDEKSİ BİLEŞENİ
// ==========================================

// ==========================================
// 2. KREATİF & REKLAM VİTRİNİ BİLEŞENİ
// ==========================================

// ==========================================
// 3. SİZ VS RAKİBİNİZ RAKİP ANALİZ BİLEŞENİ
// ==========================================

// ==========================================
// 4. ROTA AKADEMİ (REHBERLER & PDF PORTALI)
// ==========================================

// ==========================================
// 5. GLOBAL WHATSAPP CHAT WIDGET
// ==========================================

// Dedicated About Page View Component

// Dynamic Legal Pages View Component (Privacy, Terms, KVKK, Cookies)

// Dedicated Team Page View Component

const slugify = text => {
  if (!text) return '';
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u').replace(/[şŞ]/g, 's').replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[çÇ]/g, 'c').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};
const getCategoryLabel = key => {
  const cat = categories.find(c => c.key === key);
  return cat ? cat.label : key;
};
const getCategoryIcon = key => {
  const cat = categories.find(c => c.key === key);
  return cat ? cat.icon : 'fa-solid fa-file-lines';
};
// Detects UTM/Traffic source from URL or referrer
const detectTrafficSource = () => {
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

// Admin Dashboard View Component

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isLeadPopupOpen, setIsLeadPopupOpen] = useState(false);
  const [isExitIntentPopup, setIsExitIntentPopup] = useState(false);

  // Smart Greeting Logic
  const getSmartGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) return { top: "Siz Dinlenirken Bile Büyüyen", highlight: "Otomatize Satış Kanalları" };
    if (hour >= 6 && hour < 12) return { top: "Güne Momentumla Başlayın", highlight: "Ölçeklenebilir Büyüme Mimarisi" };
    if (hour >= 12 && hour < 18) return { top: "Sektöre Liderlik Edin", highlight: "Dönüşüm Odaklı Ajans" };
    return { top: "Günü Hedefin Üzerinde Kapatın", highlight: "Yapay Zeka Destekli Büyüme" };
  };

  // Exit Intent Logic
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        if (!sessionStorage.getItem('exitIntentShown') && !isLeadPopupOpen) {
          sessionStorage.setItem('exitIntentShown', 'true');
          setIsExitIntentPopup(true);
          setIsLeadPopupOpen(true);
        }
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [isLeadPopupOpen, currentPath]);

  // Handle scrolling to hash when location changes
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1); // remove '#'
      // Use a longer timeout or multiple attempts to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -80; // Offset for navbar
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
    } else if (!location.pathname.startsWith('/rota-management-vault-x9')) {
      // Don't auto-scroll to top for admin routes to preserve state
      window.scrollTo(0, 0);
    }
  }, [location]);

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    
    if (sectionId === 'calculator') {
      if (currentPath === '/') {
        // If already on home page, scroll directly
        const element = document.getElementById('calculator');
        if (element) {
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          window.history.pushState(null, '', '/#calculator');
        }
      } else {
        // Navigate to home page with hash
        navigate('/#calculator');
      }
    } else if (sectionId === 'home') {
      if (currentPath === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Clear the hash from the URL
        window.history.pushState(null, '', '/');
      } else {
        navigate('/');
      }
    }
    else if (sectionId === 'services') navigate('/hizmetlerimiz/google-ads-danismanligi');
    else if (sectionId === 'testimonials') navigate('/referanslar');
    else if (sectionId === 'contact') navigate('/iletisim');
    else if (sectionId === 'izmir') navigate('/neden-izmir');
    else navigate(`/${sectionId}`);
  };

  const handleCalculatorNavClick = (tab) => {
    setIsMobileMenuOpen(false);
    // Switch the calculator tab
    setCalculatorTab(tab);
    
    // Scroll to calculator
    if (currentPath === '/') {
      const element = document.getElementById('calculator');
      if (element) {
        // slight delay to let tab render fully if needed
        setTimeout(() => {
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          window.history.pushState(null, '', '/#calculator');
        }, 50);
      }
    } else {
      navigate('/#calculator');
    }
  };

  const handleServiceClick = (serviceKey) => {
    setIsMobileMenuOpen(false);
    
    // Map internal short keys to SEO-friendly slugs
    const seoSlugs = {
      'google': 'google-ads-danismanligi',
      'meta': 'meta-reklam-yonetimi',
      'seo': 'arama-motoru-optimizasyonu-seo',
      'social': 'sosyal-medya-yonetimi',
      'ecommerce': 'e-ticaret-ve-pazaryeri-yonetimi',
      'design': 'donusum-odakli-web-tasarim'
    };
    
    const targetSlug = seoSlugs[serviceKey] || serviceKey;
    navigate(`/hizmetlerimiz/${targetSlug}`);
  };

  // SEO Data Helper
  const getSeoData = path => {
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
  const seoData = getSeoData(currentPath);

  // Active mobile dropdown state (services / corporate)
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);

  // Helper to dynamically calculate working hours and agency status
  const getAgencyStatus = () => {
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

  // Settings state
  const [settingsData, setSettingsData] = useState({
    logo_dark: "",
    logo_light: "",
    logo_dark_mobile: "",
    logo_light_mobile: "",
    about_title_top: "Biz Kimiz?",
    about_title_span: "Ege Sıcaklığı ve Dijital Performans",
    about_desc: "Markalarımızı birer bütçe paneli olarak görmüyor; Ege toprağının bereketi ve samimiyetiyle, omuz omuza çalışarak büyütüyoruz.",
    about_story_tag: "BİZİM ANLAYIŞIMIZ",
    about_story_title: "E-postalara ve Ofislere Hapsolmayan Özgürlük",
    about_story_p1: "Ajans Rota, tek bir plazanın gri duvarlarına ve tekdüze e-posta zincirlerine hapsolmuş geleneksel ajans modelini kırmak amacıyla kuruldu. Kurulma amacımız; Ege'nin özgür ruhunu, 360 derece dijital uzmanlık (Sosyal Medya, SEO, Web Tasarım ve Google/Meta Reklamcılığı) ile birleştirerek markalara tamamen şeffaf, samimi ve sonuç odaklı bir büyüme ortaklığı sunmaktır. Çeşme'den Bodrum'a, Urla'dan Karşıyaka'ya Ege'nin ilham veren noktalarından uzaktan (remote) çalışan kreatif ve teknik ekibimizle, fiziki ofislerin hantal maliyetlerini ortadan kaldırıyor; tüm enerjimizi ve tecrübemizi markanızın dijital varlığını güçlendirmeye odaklıyoruz.",
    about_story_p2: "Yıllara dayanan sektör tecrübemizle biliyoruz ki dijital büyüme tek yönlü olamaz. Sadece reklam panellerini yönetmiyor; markanızın kimliğini yansıtan Ege samimiyetinde Sosyal Medya Yönetimi yapıyor, Google'da en üst sıralara kalıcı olarak yerleşmenizi sağlayan semantik SEO Çalışmaları yürütüyor ve kullanıcıları müşteriye dönüştüren hızlı, modern ve özel Web Tasarım (CRO) projeleri geliştiriyoruz. Raporları anlaşılmaz PDF'lerle geçiştirmek yerine, Kemeraltı esnafının kadim dürüstlüğüyle her aşamayı şeffaflıkla ve yüz yüze güvenle paylaşıyoruz.",
    about_story_quote: "Ege'nin bereketiyle dijitalin gücünü birleştiriyor, markanızı yerelden küresele taşıyacak dijital rotayı birlikte çiziyoruz.",
    contact_title_top: "Bizimle",
    contact_title_span: "İletişime Geçin",
    contact_desc: "Ege'nin samimiyetiyle dijital dünyada yanınızdayız. Ekibimizle hemen bir görüntülü toplantı planlayın veya dilediğiniz zaman İzmir'de yüz yüze kahve eşliğinde büyüme hedeflerinizi konuşalım.",
    about_culture_title: "Çalışma Kültürümüzün 3 Altın Kuralı",
    about_rule1_title: "İncir Çekirdeği Detaycılığı",
    about_rule1_icon: "fa-solid fa-eye",
    about_rule1_desc: "Bizim için reklamlarda boşa giden tek bir kuruş bile kabul edilemez. Ege'nin ünlü deyiminden ilhamla; kampanyalarınızı en ince ayrıntısına kadar planlıyor, gereksiz arama terimlerini ve hatalı hedeflemeleri ayıklayarak sıfır bütçe israfı hedefliyoruz.",
    about_rule2_title: "Sakin Planlama & Fırtınalı Aksiyon",
    about_rule2_icon: "fa-solid fa-bolt",
    about_rule2_desc: "Stratejilerimizi ve veri analizlerimizi Seferihisar sakinliğiyle, derinlemesine düşünüp planlıyoruz. Ancak optimizasyon ve aksiyon vakti geldiğinde, en hızlı, çevik ve kararlı adımlarla rakiplerinizin önüne geçiyoruz.",
    about_rule3_title: "Bağ Sinerjisi & Ortak Büyüme",
    about_rule3_icon: "fa-solid fa-spa",
    about_rule3_desc: "İşbirliğimizi sıradan bir müşteri-hizmet ilişkisi olarak görmüyoruz. Markanızı Ege'nin bereketli üzüm bağları gibi ele alıyor; sabırla, özenle ve doğru budamalarla işleyerek her sezon daha yüksek dijital rekolte ve ortak verim sağlıyoruz.",
    working_hours_text: "Pazartesi – Cuma: 09:00 – 18:30",
    working_hours_start: "09:00",
    working_hours_end: "18:30",
    custom_holidays: "",
    about_coffee_title: "Çevrimiçi ya da Yüz Yüze Bir Kahveye?",
    about_coffee_desc: "Her ne kadar uzaktan çalışsak da, İzmir ve çevresindeki markalarımızla yüz yüze buluşmayı çok seviyoruz. Dilediğiniz an görüntülü bir toplantı planlayalım ya da İzmir'in güzel bir kahve durağında, sıcak bir boyoz ve taze demlenmiş çay eşliğinde hedeflerinizi konuşalım.",
    about_coffee_btn: "Bizimle Tanışın",
    about_story_image: "/images/remote_freedom.png",
    about_story_image_mobile: "",
    contact_map_image: "/images/aegean_map_light.png",
    contact_map_image_mobile: "",
    testimonials_hero_image: "/images/izmir_references_hero.png",
    testimonials_hero_image_mobile: "",
    izmir_edge_box_image: "",
    ref_kpi1_title: "Ortalama ROAS Büyümesi",
    ref_kpi1_val: "6.8x",
    ref_kpi2_title: "Organik Trafik Artışı",
    ref_kpi2_val: "+180K/ay",
    ref_kpi3_title: "Yönetilen Reklam Bütçesi",
    ref_kpi3_val: "12.5M₺+",
    ref_kpi4_title: "Müşteri Memnuniyeti",
    ref_kpi4_val: "%98.7",
    cs1_company: "Alaçatı Ev Kurabiyecisi",
    cs1_logo: "🍪",
    cs1_sector: "E-Ticaret & Yöresel Gıda",
    cs1_before_roas: "1.8x ROAS",
    cs1_before_traffic: "4.500 / ay",
    cs1_before_cost: "Yüksek Müşteri Kazanım Maliyeti",
    cs1_after_roas: "6.4x ROAS",
    cs1_after_traffic: "32.000 / ay",
    cs1_after_cost: "%65 Düşük Sipariş Edinme Maliyeti (CPA)",
    cs1_strat1: "Sepet terk oranlarını azaltmak için ödeme adımları optimize edildi.",
    cs1_strat2: "Meta Ads tarafında piksel verileri beslenerek Lookalike (Benzer) hedef kitleler kuruldu.",
    cs1_strat3: "Yöresel kurabiye aramalarında Google SEO ile ilk sayfada 3 farklı anahtar kelimede liderlik sağlandı.",
    cs2_company: "Ege Zeytinyağları A.Ş.",
    cs2_logo: "🫒",
    cs2_sector: "Tarım İhracatı & B2B",
    cs2_before_roas: "Çevrimdışı Fuarlar",
    cs2_before_traffic: "1.200 / ay",
    cs2_before_cost: "Sadece Dönemsel Talep ve Sipariş",
    cs2_after_roas: "4.8x ROAS (Google Ads)",
    cs2_after_traffic: "18.500 / ay",
    cs2_after_cost: "Yıl Boyu Kesintisiz B2B İthalatçı Talebi",
    cs2_strat1: "Almanca, İngilizce ve Fransızca dillerinde B2B hedefli mikro siteler kuruldu.",
    cs2_strat2: "Avrupa genelinde ithalatçı ve toptancı arama sorgularına özel Google Arama Ağı reklamları kurgulandı.",
    cs2_strat3: "LinkedIn Campaign Manager kullanılarak gıda distribütörü karar vericileri hedeflendi.",
    cs3_company: "Kordon Tıp Merkezi",
    cs3_logo: "🏥",
    cs3_sector: "Sağlık & Yerel Hizmet",
    cs3_before_roas: "2.1% Dönüşüm Oranı",
    cs3_before_traffic: "8.000 / ay",
    cs3_before_cost: "Düşük Yerel Google Arama Görünürlüğü",
    cs3_after_roas: "5.6% Dönüşüm Oranı",
    cs3_after_traffic: "24.500 / ay",
    cs3_after_cost: "İzmir Genelinde Branş Aramalarında Liderlik",
    cs3_strat1: "Kullanıcı deneyimi yüksek, hızlı ve KVKK uyumlu randevu sayfaları tasarlandı.",
    cs3_strat2: "Yerel SEO optimizasyonu ile Google Haritalar'da üst sıralara çıkıldı.",
    cs3_strat3: "Branş bazlı arama sorguları için bilgilendirici içerik siloları inşa edilerek trafik artırıldı.",
    audio_title: "Hakan Demir - İzmir Endüstriyel Parça",
    audio_quote: "İhracat bütçelerimizi yönetirken karşılaştığımız verim kayıplarını Ajans Rota sıfıra indirdi. Reklamların Ege bölgesindeki başarısından sonra Almanya operasyonlarımızı da teslim ettik...",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    video_title: "Cemil Öztürk - Başarı Hikayesi Röportajı",
    video_desc: "Ege Lift Asansör / Pazarlama Müdürü & Konu: Google Ads & B2B Performans Pazarlaması",
    video_quote: "Ajans Rota'nın şeffaf raporlama sistemi ve bütçe optimizasyon paneli sayesinde ciro artışımızın her kuruşunu anlık izleyebiliyoruz.",
    video_url: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c022273e6cd07af2134b9cfc2e024b08&profile_id=165&oauth2_token_id=57447761",
    logo1_company: "Ege Zeytin Evi",
    logo1_services: "Google Ads + B2B İhracat",
    logo1_metric: "8.4x ROAS",
    logo1_logo: "🫒",
    logo2_company: "Urla Şarapçılık",
    logo2_services: "Sosyal Medya + SEO",
    logo2_metric: "+140% Yerel Ziyaret",
    logo2_logo: "🍷",
    logo3_company: "Alsancak Dental",
    logo3_services: "Web Tasarım + Meta Ads",
    logo3_metric: "2x Randevu Talebi",
    logo3_logo: "🦷",
    logo4_company: "Karşıyaka Yapı",
    logo4_services: "SEO + Performans Pazarlama",
    logo4_metric: "+160% Nitelikli Form",
    logo4_logo: "🏗️",
    logo5_company: "Çeşme Marina",
    logo5_services: "Sosyal Medya Yönetimi",
    logo5_metric: "%45 Verimlilik",
    logo5_logo: "⚓",
    logo6_company: "Kordon Optik",
    logo6_services: "Google Shopping + Meta Ads",
    logo6_metric: "+210% Mağaza Trafiği",
    logo6_logo: "👓",
    phone: "+90 544 584 45 43",
    email: "hello@ajansrota.com",
    address: "Uzaktan Çalışma (Remote) / İzmir, Ege",
    google_maps_url: "https://maps.google.com",
    instagram_url: "https://instagram.com/ajansrota",
    linkedin_url: "https://linkedin.com/company/ajansrota",
    whatsapp_url: "https://wa.me/905445844543",
    whatsapp_assistant_phone: "905445844543",
    whatsapp_assistant_topics: "Google / Meta Reklamı, SEO Çalışması, Sosyal Medya Yönetimi, Web Tasarım / CRO",
    fb_pixel_id: "",
    fb_pixel_custom_script: "",
    google_ads_conversion_id: "",
    google_ads_event_script: "",
    google_analytics_id: "",
    gtm_id: "",
    google_site_verification: "",
    tiktok_pixel_id: "",
    tiktok_pixel_custom_script: "",
    meta_title: "Ajans Rota | İzmir Google & Meta Reklam ve SEO Ajansı",
    meta_description: "İzmir'de Google Ads, Meta reklamları, SEO ve sosyal medya yönetimi ile markanızı Ege'den dünyaya açın. Veri odaklı dijital büyüme ajansı.",
    meta_keywords: "izmir dijital ajans, google ads ajansı izmir, meta ads ajansı, seo ajansı izmir, sosyal medya yönetimi, web tasarım",
    seo_izmir_title: "Neden İzmir? | Ajans Rota Ege Odaklı Dijital Ajans",
    seo_izmir_description: "Körfezin rüzgarıyla veri odaklı stratejileri harmanlayan Ajans Rota'nın İzmir ve Ege aşkını, yerel üreticilerle kurduğu güçlü bağı okuyun.",
    seo_izmir_keywords: "izmir dijital ajans, neden izmir, ege dijital ajans",
    seo_referanslar_title: "Başarı Hikayelerimiz ve Referanslar | Ajans Rota",
    seo_referanslar_description: "İzmir ve Ege bölgesindeki e-ticaret, sanayi, gıda ve turizm markalarımızın dijital başarı hikayelerini ve müşteri yorumlarını okuyun.",
    seo_referanslar_keywords: "ajans rota referanslar, başarı hikayeleri, müşteri yorumları",
    seo_iletisim_title: "İletişime Geçin | Ajans Rota",
    seo_iletisim_description: "Ajans Rota ile iletişime geçin. Ücretsiz dijital büyüme analizi ve teklif almak için formu doldurun.",
    seo_iletisim_keywords: "ajans rota iletişim, teklif al, dijital büyüme analizi",
    seo_hakkimizda_title: "Hakkımızda | Ajans Rota Ege'nin Samimi Dijital Ajansı",
    seo_hakkimizda_description: "Ege'nin farklı yerlerinden uzaktan çalışan, markaları birer bütçe paneli olarak görmeyip onlarla omuz omuza büyüyen samimi dijital performans ekibimiz.",
    seo_hakkimizda_keywords: "ajans rota hakkında, uzaktan çalışan ajans, samimi ajans",
    seo_ekiplerimiz_title: "Ajans Rota Kurucusundan Uzmanına Ege'den Uzaktan Çalışan 360° Dijital Kadrosu",
    seo_ekiplerimiz_description: "Ajans Rota'nın kurucusundan genel koordinatörüne, performans uzmanlarından kreatiflerine kadar uzaktan çalışan 12 kişilik Ege kadrosuyla tanışın.",
    seo_ekiplerimiz_keywords: "ajans rota ekibi, dijital reklam uzmanları, ege kadrosu",
    seo_blog_title: "Blog | Ajans Rota İzmir Dijital Pusula",
    seo_blog_description: "Dijital pazarlama, Google Ads, Meta Ads, SEO, sosyal medya yönetimi ve web tasarım konularında güncel rehberler, taktikler ve analizler.",
    seo_blog_keywords: "dijital pazarlama blogu, google ads taktikleri, meta ads rehberi, seo blog",
    hero_tag: "İzmir Performans & SEO Ajansı",
    hero_title: "Ege'den Dünyaya:\nVeri ve Sonuç Odaklı Dijital Rota",
    hero_desc: "Google Ads, Meta (Facebook/Instagram) ve SEO stratejilerimizle İzmir ve çevresindeki e-ticaret markaları, yerel üreticiler ve ihracatçıların dijital satış hacmini büyütüyoruz.",
    hero_stat1_num: "%320+",
    hero_stat1_lbl: "Ortalama ROAS Artışı",
    hero_stat2_num: "12M₺+",
    hero_stat2_lbl: "Yönetilen Yıllık Bütçe",
    hero_stat3_num: "%98.4",
    hero_stat3_lbl: "Müşteri Memnuniyeti",
    izmir_edge_tag: "Bölgesel Güç",
    izmir_edge_title: "Ege'nin Üretim Gücünü Dijitalle Katlıyoruz",
    izmir_edge_desc: "İzmir, Türkiye'nin e-ticaret, lojistik ve üretim üslerinden biri. Uzaktan çalışan ajansların aksine, yerel dinamikleri ve Ege üreticilerinin ihtiyaçlarını çok iyi biliyor, yüz yüze şeffaf iletişim kuruyoruz.",
    izmir_edge_item1_icon: "fa-solid fa-chart-pie",
    izmir_edge_item1_title: "E-İhracat ve Küresel Hedefler",
    izmir_edge_item1_desc: "İzmir limanının sunduğu lojistik gücü, küresel Google ve Meta reklamları ile birleştirip markanızı Avrupa ve Amerika pazarlarına taşıyoruz.",
    izmir_edge_item2_icon: "fa-solid fa-users-viewfinder",
    izmir_edge_item2_title: "Yüz Yüze İletişim ve Güven",
    izmir_edge_item2_desc: "Haftalık değerlendirme toplantıları, strateji sunumları ve raporlamaları doğrudan ofisinizde ya da İzmir'deki çalışma alanımızda birlikte yapıyoruz.",
    izmir_edge_item3_icon: "fa-solid fa-bezier-curve",
    izmir_edge_item3_title: "Hızlı ve Çevik Entegrasyon",
    izmir_edge_item3_desc: "Ege bölgesindeki tekstil, gıda, tarım ve endüstriyel üreticilerin dijitalleşme ve e-ticaret altyapı süreçlerini sıfırdan kurup hızlandırıyoruz.",
    izmir_edge_box_icon: "fa-solid fa-ship",
    izmir_edge_box_title: "Ege Denizi'nden Dijital Dünyaya",
    izmir_edge_box_desc: "Körfezin esintisiyle veri odaklı stratejileri harmanlayan yeni nesil ajans deneyimi.",
    izmir_edge_box_badge_title: "İzmir",
    izmir_edge_box_badge_desc: "Ege'nin Dijital Merkezi",
    services_section_tag: "Uzmanlık Alanlarımız",
    services_section_title: "Büyümenizi Hızlandıracak Çözümler",
    services_section_desc: "E-ticaret ve dijital satış hunilerinde en yüksek verimi alabilmeniz için veriye dayalı stratejiler geliştiriyoruz.",
    privacy_policy_title: "Gizlilik Politikası",
    privacy_policy_content: "<h3>1. Veri Sorumlusu ve Genel Prensipler</h3><p>Ajans Rota olarak, web sitemizi ziyaret eden kullanıcılarımızın gizliliğini korumak en temel önceliklerimizden biridir. Bu Gizlilik Politikası, web sitemiz (http://localhost:5173/ veya canlı alan adımız) üzerinden hangi verilerin toplandığını, nasıl kullanıldığını ve güvenliğinin nasıl sağlandığını açıklamaktadır.</p><h3>2. Toplanan Kişisel Veriler</h3><p>Web sitemizde yer alan ücretsiz SEO Analizi, KOBİ Dijitalleşme Endeksi, Rakip Karşılaştırma Analizi, Rota Akademi ve İletişim Formları gibi araçları kullandığınızda aşağıdaki verileriniz işlenmektedir:</p><ul><li>Adınız, soyadınız ve şirket bilgileriniz</li><li>E-posta adresiniz ve telefon numaranız</li><li>Web sitenizin adresi (analiz amaçlı)</li><li>WhatsApp müşteri asistanı üzerinden paylaştığınız proje detayları ve bütçe tercihleri</li></ul><h3>3. Çerezler (Cookies) ve Üçüncü Taraf Kodlar</h3><p>Ziyaretçi deneyimini iyileştirmek, site performansını analiz etmek ve ilgi alanlarınıza özel reklamlar sunabilmek adına sitemizde çerezler kullanılmaktadır. Ayrıca sitemiz genelinde <strong>Google Analytics, Google Tag Manager ve Meta Pixel</strong> kodları entegre edilmiştir. Bu kodlar tarayıcı davranışı ve demografik verileri anonim olarak analiz etmemizi sağlar.</p><h3>4. Veri Güvenliği</h3><p>Toplanan tüm verileriniz sunucumuzda güvenli bir veri tabanında (data.json) saklanmakta olup, yetkisiz erişimlere ve veri sızıntılarına karşı gerekli tüm teknik önlemler alınmıştır. Verileriniz, yasal zorunluluklar hariç olmak üzere üçüncü şahıslarla asla paylaşılmaz.</p>",
    terms_of_use_title: "Kullanım Koşulları",
    terms_of_use_content: "<h3>1. Kabul Koşulları</h3><p>Bu web sitesini ziyaret ederek veya sitede yer alan Büyüme Simülatörü, SEO Analiz Raporlayıcı gibi büyüme araçlarını kullanarak, bu Kullanım Koşulları'nı tamamen kabul etmiş sayılırsınız. Koşulları kabul etmiyorsanız lütfen siteyi kullanmayınız.</p><h3>2. Hizmetlerin Sınırları ve Garanti Muafiyeti</h3><p>Sitemizde sunulan ücretsiz analiz araçları, sektörel bütçe simülatörleri ve Rota Akademi eğitim içerikleri tamamen tavsiye ve bilgilendirme niteliğindedir. Bu araçların ürettiği simülasyon sonuçları, kesin ciro veya ROAS garantisi vermez. Dijital pazarlama kampanyalarının başarısı sektörel değişimlere, reklam kreatiflerine ve ürün kalitesine bağlı olarak değişkenlik gerektirir.</p><h3>3. Fikri Mülkiyet Hakları</h3><p>Bu web sitesinin tasarımı, kod yapısı, Ege-Akdeniz temalı glassmorphism görselleri, vaka çalışması simülatörleri ve Rota Akademi bünyesindeki tüm eğitim metinleri Ajans Rota'ya aittir ve telif hakkı yasalarıyla korunmaktadır. Yazılı izin alınmaksızın kopyalanamaz veya ticari amaçlarla kullanılamaz.</p><h3>4. Değişiklik Hakları</h3><p>Ajans Rota, sitemizdeki hizmetleri, araçları veya bu Kullanım Koşulları'nı önceden bildirimde bulunmaksızın dilediği zaman güncelleme, değiştirme veya askıya alma hakkını saklı tutar.</p>",
    kvkk_text_title: "KVKK Aydınlatma Metni",
    kvkk_text_content: "<h3>1. Veri Sorumlusu ve Kanun Kapsamı</h3><p>6698 sayılı Kişisel Verilerin Korunması Kanunu (\"KVKK\") uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla <strong>Ajans Rota</strong> tarafından aşağıda açıklanan kapsamda işlenebilecektir. Ajans Rota, Ege samimiyetiyle kişisel verilerinizin güvenliğine ve gizliliğine en yüksek düzeyde hassasiyet göstermektedir.</p><h3>2. Kişisel Verilerin İşlenme Amaçları</h3><p>Toplanan kişisel verileriniz, kanunun 5. ve 6. maddelerinde belirtilen şartlara uygun olarak:</p><ul><li>İletişim taleplerinizin yanıtlanması ve teklif süreçlerinin yürütülmesi,</li><li>Talep ettiğiniz ücretsiz SEO analizi, KOBİ endeksi ve rakip analiz raporlarının tarafınıza sunulması,</li><li>Rota Akademi üzerinden e-kitap ve rehber indirme taleplerinizin karşılanması,</li><li>Yapay zeka müşteri asistanı üzerinden talep ettiğiniz hizmetlerin bütçe ve lokasyon bazlı planlanması amaçlarıyla işlenmektedir.</li></ul><h3>3. Kişisel Verilerin Aktarılması</h3><p>Kişisel verileriniz, KVKK'nın 8. ve 9. maddelerine uygun olarak, yalnızca yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda ve iş ortaklarımıza veya yasal olarak yetkili kamu kurumlarına ilgili mevzuat çerçevesinde aktarılabilecektir.</p><h3>4. İlgili Kişi Olarak Haklarınız</h3><p>KVKK'nın 11. maddesi uyarınca Ajans Rota'ya başvurarak; verilerinizin işlenip işlenmediğini öğrenme, işlenme amacına uygun kullanılıp kullanılmadığını sorma, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme ve verilerinizin silinmesini talep etme haklarına sahipsiniz. Taleplerinizi <strong>hello@ajansrota.com</strong> adresine iletebilirsiniz.</p>",
    hide_page_privacy: false,
    hide_page_terms: false,
    hide_page_kvkk: false,
    cookies_policy_title: "Çerez Politikası",
    cookies_policy_content: "<h3>1. Çerezlerin Kullanımı ve Amacı</h3><p>Ajans Rota olarak, kullanıcılarımızın web sitemizi en verimli şekilde kullanabilmesi için çerezler (cookie) kullanmaktayız. Çerezler, web sitemizi ziyaret ettiğinizde cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezlerin kullanım amacı, web sitemizin performansını artırmak, kullanıcı tercihlerini hatırlamak ve ilgi alanlarınıza uygun kişiselleştirilmiş içerikler/reklamlar sunmaktır.</p><h3>2. Çerez Türleri</h3><ul><li><strong>Zorunlu Çerezler:</strong> Web sitesinin düzgün çalışması ve temel işlevleri (örneğin güvenli alanlara erişim) için gereklidir.</li><li><strong>Performans ve Analiz Çerezleri:</strong> Sitemizi ziyaret eden kişi sayısını, hangi sayfaların daha çok tıklandığını analiz ederek site performansını iyileştirmemizi sağlar. Bu veriler tamamen anonimdir.</li><li><strong>Hedefleme ve Reklam Çerezleri:</strong> İlgi alanlarınıza uygun reklamlar sunmak ve pazarlama kampanyalarının etkinliğini ölçmek için kullanılır.</li></ul><h3>3. Çerezlerin Kontrolü ve Silinmesi</h3><p>Tarayıcınızın ayarlarını değiştirerek çerezleri tamamen engelleyebilir veya daha önce kaydedilmiş çerezleri silebilirsiniz. Çerezleri engellemeniz durumunda, web sitemizin bazı fonksiyonlarının tam olarak çalışmayabileceğini hatırlatmak isteriz.</p>",
    hide_page_cookies: false,
    // Sosyal Medya Yönetimi Paket Ayarları
    sm_pkg_baslangic_name: 'Başlangıç Paketi',
    sm_pkg_baslangic_posts: '12',
    sm_pkg_baslangic_reels: '3',
    sm_pkg_baslangic_price: '8000',
    sm_pkg_baslangic_extras: 'Strateji,Grafik Tasarım',
    sm_pkg_orta_name: 'Orta Paket',
    sm_pkg_orta_posts: '16',
    sm_pkg_orta_reels: '6',
    sm_pkg_orta_price: '12000',
    sm_pkg_orta_extras: 'Strateji,Grafik Tasarım,Story',
    sm_pkg_zirve_name: 'Zirve Paketi',
    sm_pkg_zirve_posts: '20',
    sm_pkg_zirve_reels: '9',
    sm_pkg_zirve_price: '18000',
    sm_pkg_zirve_extras: 'Strateji,Grafik Tasarım,Story,Hashtag Araştırması,Rakip Analizi',
  });
  // Service Pages state
  const [servicesData, setServicesData] = useState(initialServicePagesData);
  // Team Members state
  const [teamMembersData, setTeamMembersData] = useState(initialTeamMembers);
  // Blog Posts state
  const [blogsData, setBlogsData] = useState(initialBlogPosts);
  // Leads state
  const [leadsData, setLeadsData] = useState([]);
  // Newsletter subscription states
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');
  // Client Transparency Reports state
  const [clientReports, setClientReports] = useState({
    ecommerce: {
      username: "ege",
      password: "ege123",
      brandName: "Ege Naturel Zeytinyağları A.Ş.",
      industry: "E-Ticaret / Gıda",
      kpis: [{
        label: "Harcanan Bütçe",
        value: "48.240 TL",
        change: "+12% geçen ay",
        icon: "fa-solid fa-wallet",
        color: "var(--primary)"
      }, {
        label: "Toplam Satış (Adet)",
        value: "984 Adet",
        change: "+18% geçen ay",
        icon: "fa-solid fa-cart-shopping",
        color: "var(--secondary)"
      }, {
        label: "ROAS (Ciro / Reklam)",
        value: "6,92x",
        change: "Hedef: 6,00x",
        icon: "fa-solid fa-arrow-trend-up",
        color: "#16a34a"
      }, {
        label: "Toplam Elde Edilen Ciro",
        value: "333.820 TL",
        change: "+24% geçen ay",
        icon: "fa-solid fa-turkish-lira-sign",
        color: "var(--primary)"
      }],
      googleAds: [{
        name: "PMax - Soğuk Sıkım Dönüşüm",
        spend: "14.250 TL",
        clicks: "4.820",
        ctr: "3,15%",
        conversions: "312",
        roas: "7,8x"
      }, {
        name: "Search - Marka Kelimeleri",
        spend: "3.100 TL",
        clicks: "1.240",
        ctr: "15,40%",
        conversions: "145",
        roas: "12,4x"
      }, {
        name: "Search - Sızma Zeytinyağı",
        spend: "8.650 TL",
        clicks: "2.150",
        ctr: "4,80%",
        conversions: "114",
        roas: "4,6x"
      }],
      metaAds: [{
        name: "Katalog Satış - DPA",
        spend: "12.800 TL",
        clicks: "5.120",
        ctr: "2,10%",
        conversions: "264",
        roas: "7,2x",
        status: "Aktif"
      }, {
        name: "Video - Urla Hasat Kreatif",
        spend: "6.400 TL",
        clicks: "2.880",
        ctr: "1,85%",
        conversions: "102",
        roas: "5,8x",
        status: "Aktif"
      }, {
        name: "Görsel - Sağlık & Gurme Setleri",
        spend: "3.040 TL",
        clicks: "1.120",
        ctr: "1,45%",
        conversions: "47",
        roas: "4,1x",
        status: "Duraklatıldı"
      }],
      seo: [{
        keyword: "soğuk sıkım zeytinyağı",
        rank: "1. Sıra",
        volume: "8.100",
        monthlyClicks: "2.450",
        trend: "up"
      }, {
        keyword: "organik sızma zeytinyağı",
        rank: "2. Sıra",
        volume: "4.400",
        monthlyClicks: "980",
        trend: "stable"
      }, {
        keyword: "ege naturel zeytinyağı",
        rank: "1. Sıra",
        volume: "1.200",
        monthlyClicks: "740",
        trend: "stable"
      }, {
        keyword: "taş baskı zeytinyağı satın al",
        rank: "3. Sıra",
        volume: "2.900",
        monthlyClicks: "410",
        trend: "up"
      }],
      timeline: [{
        date: "21 Haziran 2026",
        title: "Google Search Negatif Kelime Temizliği",
        desc: "\"ucuz zeytinyağı\", \"ücretsiz yağ\" gibi marka kalitesine uymayan 112 adet negatif kelime elendi. Bütçe verimliliği %9 artırıldı.",
        author: "Yiğit K. (SEO & Google Ads)"
      }, {
        date: "18 Haziran 2026",
        title: "Meta Ads Urla Hasat Video Kreatif Testi",
        desc: "Urla bahçelerindeki hasat sürecini anlatan 2 yeni Reels dikey videosu yayına alındı. CTR ortalaması %1,2'den %1,85'e fırladı.",
        author: "Melis S. (Kreatif Direktör)"
      }, {
        date: "15 Haziran 2026",
        title: "Checkout Funnel Hız Optimizasyonu",
        desc: "E-ticaret sitesinde ödeme adımındaki görseller sıkıştırıldı, gereksiz JS kütüphaneleri ertelendi. Sepetten dönme oranı %4 düşürüldü.",
        author: "Emre T. (Web Developer)"
      }, {
        date: "12 Haziran 2026",
        title: "Haftalık Durum & ROAS Optimizasyon Toplantısı",
        desc: "Müşteri yönetim ekibiyle ROAS hedeflerinin 6,9x düzeyine ulaşması değerlendirildi. Gelecek haftanın bütçe dağılımı onaylandı.",
        author: "Selin Y. (Müşteri İlişkileri)"
      }, {
        date: "08 Haziran 2026",
        title: "Google PMax Kampanyasında Bütçe Ölçekleme",
        desc: "Performansı yüksek seyreden Soğuk Sıkım PMax kampanyasının bütçesi ROI korunarak %15 oranında kontrollü şekilde artırıldı.",
        author: "Yiğit K. (SEO & Google Ads)"
      }]
    },
    b2b: {
      username: "liman",
      password: "liman123",
      brandName: "İzmir Global Liman Hizmetleri A.Ş.",
      industry: "B2B / Lojistik & Gümrükleme",
      kpis: [{
        label: "Harcanan Bütçe",
        value: "31.500 TL",
        change: "+5% geçen ay",
        icon: "fa-solid fa-wallet",
        color: "var(--primary)"
      }, {
        label: "Nitelikli Form (Lead)",
        value: "192 Form",
        change: "+22% geçen ay",
        icon: "fa-solid fa-id-card",
        color: "var(--secondary)"
      }, {
        label: "Form Başı Maliyet (CPL)",
        value: "164,06 TL",
        change: "-14% geçen ay",
        icon: "fa-solid fa-tags",
        color: "#16a34a"
      }, {
        label: "Tahmini Fırsat Değeri",
        value: "850.000 TL",
        change: "Dönüşüm Oranı: %12",
        icon: "fa-solid fa-turkish-lira-sign",
        color: "var(--primary)"
      }],
      googleAds: [{
        name: "Search - Liman Depolama",
        spend: "12.800 TL",
        clicks: "1.150",
        ctr: "8,90%",
        conversions: "78",
        roas: "164 TL CPL"
      }, {
        name: "Search - Gümrükleme Hizmetleri",
        spend: "11.200 TL",
        clicks: "940",
        ctr: "7,45%",
        conversions: "65",
        roas: "172 TL CPL"
      }, {
        name: "Display - Yeniden Pazarlama",
        spend: "2.100 TL",
        clicks: "410",
        ctr: "1,15%",
        conversions: "14",
        roas: "150 TL CPL"
      }],
      metaAds: [{
        name: "Lead Form - İthalatçılara Özel",
        spend: "3.400 TL",
        clicks: "480",
        ctr: "1,55%",
        conversions: "21",
        roas: "161 TL CPL",
        status: "Aktif"
      }, {
        name: "Görsel - Antrepo & Depolama",
        spend: "2.000 TL",
        clicks: "290",
        ctr: "1,20%",
        conversions: "14",
        roas: "142 TL CPL",
        status: "Duraklatıldı"
      }],
      seo: [{
        keyword: "izmir antrepo depolama",
        rank: "2. Sıra",
        volume: "1.800",
        monthlyClicks: "380",
        trend: "up"
      }, {
        keyword: "izmir liman gümrükleme firmaları",
        rank: "1. Sıra",
        volume: "850",
        monthlyClicks: "290",
        trend: "stable"
      }, {
        keyword: "uluslararası konteyner nakliye",
        rank: "4. Sıra",
        volume: "3.200",
        monthlyClicks: "170",
        trend: "up"
      }, {
        keyword: "liman lojistik çözümleri",
        rank: "3. Sıra",
        volume: "600",
        monthlyClicks: "110",
        trend: "stable"
      }],
      timeline: [{
        date: "20 Haziran 2026",
        title: "B2B Google Ads Arama Terimleri Filtrelemesi",
        desc: "Bireysel nakliye arayan \"evden eve nakliyat\" gibi 89 adet ilgisiz arama terimi elendi. Kurumsal leads kalitesi %30 artırıldı.",
        author: "Yiğit K. (SEO & Google Ads)"
      }, {
        date: "16 Haziran 2026",
        title: "LinkedIn & Meta Lead Form Optimizasyonu",
        desc: "Form alanlarına \"Şirket Unvanı\" ve \"Yıllık Konteyner Hacmi\" soruları zorunlu olarak eklendi. Çöp form girdileri sıfırlandı.",
        author: "Melis S. (Kreatif Direktör)"
      }, {
        date: "11 Haziran 2026",
        title: "Liman Depolama Görsel Testleri",
        desc: "Depoların güvenliğini ve büyüklüğünü gösteren yüksek kaliteli drone fotoğrafları reklam görselleriyle değiştirildi. CPL %15 düştü.",
        author: "Melis S. (Kreatif Direktör)"
      }, {
        date: "06 Haziran 2026",
        title: "SEO: İçerik Optimizasyon Çalışması",
        desc: "\"İzmir Liman Lojistik Süreçleri\" rehber makalesi blogda yayınlandı ve hedeflenen 3 anahtar kelimede anında sıralama kazanıldı.",
        author: "Yiğit K. (SEO & Google Ads)"
      }]
    }
  });
  // Auth state
  const [authToken, setAuthToken] = useState(localStorage.getItem('admin_token') || '');



  // Why Agency Auto Slider State
  const [whyAgencySlide, setWhyAgencySlide] = useState(0);
  useEffect(() => {
    if (currentPath === '/') {
      const timer = setInterval(() => {
        setWhyAgencySlide(prev => (prev + 1) % 4);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [currentPath]);

  // Navbar sticky & mobile drawer states
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  // Calculator States
  const [calculatorTab, setCalculatorTab] = useState('fee'); // fee, roas_ecommerce, roas_b2b
  const [feeAdBudget, setFeeAdBudget] = useState(50000);
  const [pricingModel, setPricingModel] = useState('hybrid'); // hybrid, performance
  const [targetRevenue, setTargetRevenue] = useState(500000); // For performance model
  const [selectedServices, setSelectedServices] = useState({
    google_ads: true,
    meta_ads: true,
    seo: false,
    design: false,
    consultancy: false
  });

  // ROI Calculator States (General)
  const [googleSpend, setGoogleSpend] = useState(15000);
  const [googleRoas, setGoogleRoas] = useState(3.5);
  const [metaSpend, setMetaSpend] = useState(10000);
  const [metaRoas, setMetaRoas] = useState(4.0);

  // E-commerce Calculator States
  const [ecomTraffic, setEcomTraffic] = useState(15000);
  const [ecomAov, setEcomAov] = useState(650);
  const [ecomSpend, setEcomSpend] = useState(25000);
  const [ecomRevenue, setEcomRevenue] = useState(85000);

  // B2B Calculator States
  const [b2bSpend, setB2bSpend] = useState(15000);
  const [b2bLeads, setB2bLeads] = useState(120);
  const [b2bConversion, setB2bConversion] = useState(8);
  const [b2bLtv, setB2bLtv] = useState(12000);

  // Additional Missing States
  const [budgetIndex, setBudgetIndex] = useState(2);
  const [reportFullName, setReportFullName] = useState('');
  const [reportEmail, setReportEmail] = useState('');
  const [reportWebsite, setReportWebsite] = useState('');
  const [reportPhone, setReportPhone] = useState('');
  const [proposalFullName, setProposalFullName] = useState('');
  const [proposalEmail, setProposalEmail] = useState('');
  const [proposalWebsite, setProposalWebsite] = useState('');
  const [proposalPhone, setProposalPhone] = useState('');
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const [isProposalGenerated, setIsProposalGenerated] = useState(false);
  const [proposalLoading, setProposalLoading] = useState(false);
  const [proposalError, setProposalError] = useState('');
  
  const [ecomSector, setEcomSector] = useState('');
  const handleEcomSectorChange = val => {
    setEcomSector(val);
    if (val === 'giyim') { setEcomAov(500); setEcomTraffic(20000); setEcomSpend(25000); }
    else if (val === 'elektronik') { setEcomAov(2500); setEcomTraffic(10000); setEcomSpend(30000); }
    else if (val === 'kozmetik') { setEcomAov(350); setEcomTraffic(30000); setEcomSpend(20000); }
  };

  const [b2bSector, setB2bSector] = useState('');
  const handleB2bSectorChange = val => {
    setB2bSector(val);
    if (val === 'yazilim') { setB2bLeads(50); setB2bSpend(15000); setB2bConversion(5); setB2bLtv(50000); }
    else if (val === 'makine') { setB2bLeads(30); setB2bSpend(20000); setB2bConversion(10); setB2bLtv(150000); }
    else if (val === 'hizmet') { setB2bLeads(100); setB2bSpend(10000); setB2bConversion(15); setB2bLtv(10000); }
  };


  const isPageHidden = path => {
    if (!settingsData) return false;
    if (path === '/neden-izmir' && settingsData.hide_page_izmir) return true;
    if (path === '/referanslar' && settingsData.hide_page_referanslar) return true;
    if (path === '/iletisim' && settingsData.hide_page_iletisim) return true;
    if (path === '/hakkimizda' && settingsData.hide_page_hakkimizda) return true;
    if (path === '/ekiplerimiz' && settingsData.hide_page_ekiplerimiz) return true;
    if (path === '/blog' && settingsData.hide_page_blog) return true;
    if (path === '/seo-analizi' && settingsData.hide_page_seo) return true;
    if (path === '/kobi-endeksi' && settingsData.hide_page_kobi) return true;
    if (path === '/rakip-analizi' && settingsData.hide_page_rakip) return true;
    if (path === '/kreatif-vitrin' && settingsData.hide_page_kreatif) return true;
    if (path === '/client-portal-secure' && settingsData.hide_page_seffaf) return true;
    if (path === '/akademi' && settingsData.hide_page_akademi) return true;
    return false;
  };
  const navigateTo = path => {
    if (isPageHidden(path)) {
      path = '/';
    }
    navigate(path);
    setIsMobileMenuOpen(false);
    setActiveMobileDropdown(null);
  };

  // Inject marketing and tracking tags dynamically based on settingsData
  useEffect(() => {
    // 1. Google Site Verification
    let metaVerification = document.querySelector('meta[name="google-site-verification"]');
    if (settingsData?.google_site_verification) {
      if (!metaVerification) {
        metaVerification = document.createElement('meta');
        metaVerification.name = 'google-site-verification';
        document.head.appendChild(metaVerification);
      }
      metaVerification.content = settingsData.google_site_verification;
    } else if (metaVerification) {
      metaVerification.remove();
    }

    }, [settingsData?.google_site_verification]);

  // Automatically redirect if navigating to a hidden page
  useEffect(() => {
    if (isPageHidden(currentPath)) {
      navigateTo('/');
    }
  }, [currentPath, settingsData]);
  const logHit = (path, action = 'view', value = 0) => {
    // Don't track if we are in admin panel
    if (path && path.startsWith('/rota-management-vault-x9')) {
      return;
    }

    // Always log to local storage as fallback/testing helper
    try {
      const today = new Date().toISOString().substring(0, 10);
      const localStatsRaw = localStorage.getItem('ajans_rota_stats');
      let stats = {};
      if (localStatsRaw && localStatsRaw !== 'undefined' && localStatsRaw !== 'null') {
        try {
          stats = JSON.parse(localStatsRaw);
        } catch (e) {
          stats = {};
        }
      }
      if (!stats[today]) {
        stats[today] = {
          views: {},
          actions: {},
          durations: {}
        };
      }
      if (!stats[today].views) stats[today].views = {};
      if (!stats[today].actions) stats[today].actions = {};
      if (!stats[today].durations) stats[today].durations = {};
      if (action === 'view') {
        stats[today].views[path] = (stats[today].views[path] || 0) + 1;
      } else if (action === 'duration') {
        const val = parseInt(value) || 0;
        if (val > 0) {
          if (!stats[today].durations[path]) {
            stats[today].durations[path] = {
              total: 0,
              count: 0
            };
          }
          stats[today].durations[path].total += val;
          stats[today].durations[path].count += 1;
        }
      } else {
        stats[today].actions[action] = (stats[today].actions[action] || 0) + 1;
      }
      localStorage.setItem('ajans_rota_stats', JSON.stringify(stats));
    } catch (e) {
      console.error("Local storage stats logging failed:", e);
    }
    fetch('/api.php?action=log_hit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path,
        action,
        value
      })
    }).catch(err => console.warn("API analytics log ignored (running locally):", err));
  };

  // Automatically track page view
  useEffect(() => {
    if (currentPath) {
      logHit(currentPath, 'view');
    }
  }, [currentPath]);

  // Automatically track page duration
  useEffect(() => {
    if (!currentPath || currentPath.startsWith('/rota-management-vault-x9')) return;
    let startTime = Date.now();
    const activePath = currentPath;
    const sendDuration = () => {
      const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
      if (elapsedSeconds > 1 && elapsedSeconds < 3600) {
        const payload = JSON.stringify({
          path: activePath,
          action: 'duration',
          value: elapsedSeconds
        });
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api.php?action=log_hit', new Blob([payload], {
            type: 'application/json'
          }));
        } else {
          fetch('/api.php?action=log_hit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: payload,
            keepalive: true
          }).catch(err => console.error("Error logging duration:", err));
        }
      }
    };
    window.addEventListener('pagehide', sendDuration);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendDuration();
      } else {
        startTime = Date.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      sendDuration();
      window.removeEventListener('pagehide', sendDuration);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentPath]);

  // Automatically track session traffic referrer source
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sessionLogged = sessionStorage.getItem('session_referrer_logged');
    if (!sessionLogged) {
      sessionStorage.setItem('session_referrer_logged', 'true');
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const gclid = urlParams.get('gclid');
      const fbclid = urlParams.get('fbclid');
      const ref = document.referrer ? document.referrer.toLowerCase() : '';
      let platform = 'referrer_direct';
      if (utmSource) {
        const src = utmSource.toLowerCase();
        if (src.includes('google') || src.includes('gads') || src.includes('adwords') || src.includes('cpc')) {
          platform = 'referrer_google_ads';
        } else if (src.includes('meta') || src.includes('facebook') || src.includes('instagram') || src.includes('fb') || src.includes('ig') || src.includes('social')) {
          platform = 'referrer_meta_ads';
        } else {
          platform = 'referrer_utm_' + utmSource.substring(0, 15);
        }
      } else if (gclid) {
        platform = 'referrer_google_ads';
      } else if (fbclid) {
        platform = 'referrer_meta_ads';
      } else if (ref) {
        if (ref.includes('google.')) {
          platform = 'referrer_google_organic';
        } else if (ref.includes('yandex.') || ref.includes('bing.') || ref.includes('search.')) {
          platform = 'referrer_other_search';
        } else if (ref.includes('facebook.com') || ref.includes('instagram.com') || ref.includes('t.co') || ref.includes('twitter.com') || ref.includes('linkedin.com')) {
          platform = 'referrer_social';
        } else {
          try {
            const domain = new URL(document.referrer).hostname;
            platform = 'referrer_ref_' + domain.replace(/\./g, '_');
          } catch (e) {
            platform = 'referrer_referral';
          }
        }
      }
      logHit(currentPath || '/', platform);
    }
  }, [currentPath]);

  // Fetch dynamic data on mount & auth token changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {};
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }
        const response = await fetch('/api.php?action=get', {
          headers
        });
        if (response.ok) {
          const text = await response.text();
          let data;
          try {
            data = JSON.parse(text);
          } catch (e) {
            loadFromLocalStorage();
            return;
          }
          if (data.settings) setSettingsData(prev => ({
            ...prev,
            ...data.settings
          }));
          if (data.servicePagesData) setServicesData(data.servicePagesData);
          if (data.teamMembers) setTeamMembersData(data.teamMembers);
          if (data.blogPosts) setBlogsData(data.blogPosts);
          if (data.testimonials) setTestimonialsData(data.testimonials);
          if (data.clientReports) setClientReports(data.clientReports);
        } else {
          loadFromLocalStorage();
        }

        // --- NEW: Fetch leads exclusively from Neon DB ---
        try {
          const leadsRes = await fetch('/api/php-handler?action=get_leads', { headers });
          if (leadsRes.ok) {
            const leadsDataApi = await leadsRes.json();
            if (leadsDataApi.success && leadsDataApi.leads) {
              setLeadsData(leadsDataApi.leads);
            }
          }
        } catch (dbErr) {
          console.error("Failed to fetch leads from Neon DB:", dbErr);
        }
        // -------------------------------------------------
      } catch (error) {
        console.error("Failed to fetch dynamic data from API, using defaults:", error);
        loadFromLocalStorage();
      }
    };
    const loadFromLocalStorage = () => {
      const localDb = localStorage.getItem('ajans_rota_db');
      if (localDb) {
        try {
          const data = JSON.parse(localDb);
          if (data.settings) setSettingsData(prev => ({
            ...prev,
            ...data.settings
          }));
          if (data.servicePagesData) setServicesData(data.servicePagesData);
          if (data.teamMembers) setTeamMembersData(data.teamMembers);
          if (data.blogPosts) setBlogsData(data.blogPosts);
          if (data.testimonials) setTestimonialsData(data.testimonials);
          if (data.leads) setLeadsData(data.leads);
          if (data.clientReports) {
            // we will overwrite this with DB data right after
            setClientReports(data.clientReports);
          }
        } catch (e) {
          console.error("Failed to parse localStorage db", e);
        }
      }
    };
    
    const loadClientsFromDB = async () => {
      if (!authToken) return; // Only fetch if we have an admin token
      if (window._adminLastWrite && Date.now() - window._adminLastWrite < 5000) return;
      
      try {
        const res = await fetch('/api/clients', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (res.status === 401) {
          clearInterval(window._adminPollInterval);
          localStorage.removeItem('admin_token');
          return;
        }
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            const dbReports = {};
            result.data.forEach(client => {
              const data = client.report_data || {};
              const key = data._key || (client.brand_name.toLowerCase().includes('e-ticaret') ? 'ecommerce' : 'b2b');
              dbReports[key] = {
                ...data,
                client_id: client.id, // Store DB ID for updates
                username: client.username,
                brandName: client.brand_name
              };
            });
            setClientReports(prev => ({...prev, ...dbReports}));
          }
        }
      } catch (err) {
        console.error("Failed to fetch clients from Neon DB:", err);
      }
    };

    fetchData().then(() => {
      loadClientsFromDB();
      if (authToken) {
        // Poll for real-time ticket updates (Admin side)
        const intervalId = setInterval(loadClientsFromDB, 5000);
        window._adminPollInterval = intervalId;
      }
    });
    
    return () => {
      if (window._adminPollInterval) clearInterval(window._adminPollInterval);
    };
  }, [authToken]);

  // Dynamic Marketing and Analytics Code Injector
  useEffect(() => {
    if (!settingsData) return;
    const cleanupScripts = [];

    const safeAppend = (parent, child) => {
      try {
        if (child.tagName && child.tagName.toLowerCase() === 'script') {
          let content = child.innerHTML;
          // EGER HTML KODU ICERIYORSA (kullanici script yerine direk kopyala yapistir yaptiysa)
          if (/<script|<noscript|<iframe|<!--/i.test(content)) {
            console.warn('Admin panelinden gelen kod HTML iceriyor. Güvenli şekilde parse ediliyor...');
            setTimeout(() => {
                try {
                    const temp = document.createElement('div');
                    temp.innerHTML = content;
                    Array.from(temp.childNodes).forEach(node => {
                        if (node.tagName && node.tagName.toLowerCase() === 'script') {
                            const newScript = document.createElement('script');
                            Array.from(node.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                            newScript.innerHTML = node.innerHTML;
                            parent.appendChild(newScript);
                        } else if (node.nodeType === 1) { // Element node (noscript, iframe vb)
                            parent.appendChild(node);
                        }
                    });
                } catch(e) { console.error("HTML script parse error", e); }
            }, 0);
            return;
          }
          
          setTimeout(() => {
            try { parent.appendChild(child); } catch (err) {}
          }, 0);
        } else {
          parent.appendChild(child);
        }
      } catch (e) {
        console.error('Dynamic tracker append error', e);
      }
    };

    // 1. Google Tag Manager (GTM)
    if (settingsData.gtm_id) {
      const gtmId = settingsData.gtm_id.trim();

      // GTM script injection
      const gtmScript = document.createElement('script');
      gtmScript.id = 'gtm-script-dynamic';
      gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');`;
      safeAppend(document.head,gtmScript);
      cleanupScripts.push(gtmScript);

      // GTM noscript injection
      const gtmNoScript = document.createElement('noscript');
      gtmNoScript.id = 'gtm-noscript-dynamic';
      gtmNoScript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      safeAppend(document.body,gtmNoScript);
      cleanupScripts.push(gtmNoScript);
    }

    // 2. Google Analytics 4 (GA4) & Google Ads (gtag.js)
    const needsGtag = settingsData.google_analytics_id || settingsData.google_ads_conversion_id;
    if (needsGtag) {
      const gaId = settingsData.google_analytics_id ? settingsData.google_analytics_id.trim() : null;
      const adsId = settingsData.google_ads_conversion_id ? settingsData.google_ads_conversion_id.trim() : null;
      const primaryTrackId = gaId || adsId;

      // Global site tag (gtag.js) script library
      const gtagLib = document.createElement('script');
      gtagLib.id = 'gtag-lib-dynamic';
      gtagLib.async = true;
      gtagLib.src = `https://www.googletagmanager.com/gtag/js?id=${primaryTrackId}`;
      safeAppend(document.head,gtagLib);
      cleanupScripts.push(gtagLib);

      // Initialization script
      const gtagInit = document.createElement('script');
      gtagInit.id = 'gtag-init-dynamic';
      let initCode = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
      `;
      if (gaId) {
        initCode += `\n        gtag('config', '${gaId}');`;
      }
      if (adsId) {
        initCode += `\n        gtag('config', '${adsId}');`;
      }
      gtagInit.innerHTML = initCode;
      safeAppend(document.head,gtagInit);
      cleanupScripts.push(gtagInit);

      // Google Ads Conversion Event Custom Script if present
      if (adsId && settingsData.google_ads_event_script) {
        const adsEventScript = document.createElement('script');
        adsEventScript.id = 'google-ads-event-dynamic';
        adsEventScript.innerHTML = settingsData.google_ads_event_script;
        safeAppend(document.head,adsEventScript);
        cleanupScripts.push(adsEventScript);
      }
    }

    // 3. Facebook Pixel
    if (settingsData.fb_pixel_id) {
      const fbId = settingsData.fb_pixel_id.trim();
      const fbScript = document.createElement('script');
      fbScript.id = 'fb-pixel-dynamic';
      fbScript.innerHTML = `!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${fbId}');
      fbq('track', 'PageView');`;
      safeAppend(document.head,fbScript);
      cleanupScripts.push(fbScript);
      const fbNoScript = document.createElement('noscript');
      fbNoScript.id = 'fb-pixel-noscript-dynamic';
      fbNoScript.innerHTML = `<img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=${fbId}&ev=PageView&noscript=1" />`;
      safeAppend(document.body,fbNoScript);
      cleanupScripts.push(fbNoScript);

      // Facebook Custom Event Script
      if (settingsData.fb_pixel_custom_script) {
        const fbCustomScript = document.createElement('script');
        fbCustomScript.id = 'fb-pixel-custom-dynamic';
        fbCustomScript.innerHTML = settingsData.fb_pixel_custom_script;
        safeAppend(document.head,fbCustomScript);
        cleanupScripts.push(fbCustomScript);
      }
    }

    // 4. TikTok Pixel
    if (settingsData.tiktok_pixel_id) {
      const tiktokId = settingsData.tiktok_pixel_id.trim();
      const ttScript = document.createElement('script');
      ttScript.id = 'tiktok-pixel-dynamic';
      ttScript.innerHTML = `!function (w, d, t) {
        w.TiktokSdkObject = t;
        var ttq = w[t] = w[t] || [];
        ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "cleanCookie"];
        ttq.setAndDefer = function (e, t) {
          e[t] = function () {
            e.push([t].concat(Array.prototype.slice.call(arguments, 0)))
          }
        };
        for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
        ttq.instance = function (t) {
          for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
          return e
        };
        ttq._i = ttq._i || {};
        ttq._f = function (e) {
          var t = "https://analytics.tiktok.com/i18n/pixel/events.js";
          e.async = !0;
          e.src = t;
          var n = d.getElementsByTagName("script")[0];
          n.parentNode.insertBefore(e, n)
        };
        ttq.load = function (e, o) {
          var t = d.createElement("script");
          t.type = "text/javascript";
          t.async = !0;
          t.src = "https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=" + e;
          var n = d.getElementsByTagName("script")[0];
          n.parentNode.insertBefore(t, n)
        };
        ttq.load('${tiktokId}');
        ttq.page();
      }(window, document, 'ttq');`;
      safeAppend(document.head,ttScript);
      cleanupScripts.push(ttScript);

      // TikTok Custom Event Script
      if (settingsData.tiktok_pixel_custom_script) {
        const ttCustomScript = document.createElement('script');
        ttCustomScript.id = 'tiktok-pixel-custom-dynamic';
        ttCustomScript.innerHTML = settingsData.tiktok_pixel_custom_script;
        safeAppend(document.head,ttCustomScript);
        cleanupScripts.push(ttCustomScript);
      }
    }

    // Cleanup logic on change/unmount
    return () => {
      cleanupScripts.forEach(el => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, [settingsData?.gtm_id, settingsData?.google_analytics_id, settingsData?.google_ads_conversion_id, settingsData?.google_ads_event_script, settingsData?.fb_pixel_id, settingsData?.fb_pixel_custom_script, settingsData?.tiktok_pixel_id, settingsData?.tiktok_pixel_custom_script]);

  // Dynamic SEO meta tags updater
  useEffect(() => {
    let title = settingsData.meta_title || "Ajans Rota | İzmir Google & Meta Reklam ve SEO Ajansı";
    let noIndex = false;
    let description = settingsData.meta_description || "İzmir'de Google Ads, Meta reklamları, SEO ve sosyal medya yönetimi ile markanızı Ege'den dünyaya açın. Veri odaklı dijital büyüme ajansı.";
    let keywords = settingsData.meta_keywords || "izmir dijital ajans, google ads, meta ads, seo, sosyal medya, web tasarim";
    if (currentPath === '/neden-izmir') {
      title = settingsData.seo_izmir_title || "Neden İzmir? | Ajans Rota Ege Odaklı Dijital Ajans";
      description = settingsData.seo_izmir_description || "Körfezin rüzgarıyla veri odaklı stratejileri harmanlayan Ajans Rota'nın İzmir ve Ege aşkını, yerel üreticilerle kurduğu güçlü bağı okuyun.";
      keywords = settingsData.seo_izmir_keywords || "izmir dijital ajans, neden izmir, ege dijital ajans";
    } else if (currentPath === '/referanslar') {
      title = settingsData.seo_referanslar_title || "Başarı Hikayelerimiz ve Referanslar | Ajans Rota";
      description = settingsData.seo_referanslar_description || "İzmir ve Ege bölgesindeki e-ticaret, sanayi, gıda ve turizm markalarımızın dijital başarı hikayelerini ve müşteri yorumlarını okuyun.";
      keywords = settingsData.seo_referanslar_keywords || "ajans rota referanslar, başarı hikayeleri, müşteri yorumları";
    } else if (currentPath === '/iletisim') {
      title = settingsData.seo_iletisim_title || "İletişime Geçin | Ajans Rota";
      description = settingsData.seo_iletisim_description || "Ajans Rota ile iletişime geçin. Ücretsiz dijital büyüme analizi ve teklif almak için formu doldurun.";
      keywords = settingsData.seo_iletisim_keywords || "ajans rota iletişim, teklif al, dijital büyüme analizi";
    } else if (currentPath === '/hakkimizda') {
      title = settingsData.seo_hakkimizda_title || "Hakkımızda | Ajans Rota Ege'nin Samimi Dijital Ajansı";
      description = settingsData.seo_hakkimizda_description || "Ege'nin farklı yerlerinden uzaktan çalışan, markaları birer bütçe paneli olarak görmeyip onlarla omuz omuza büyüyen samimi dijital performans ekibimiz.";
      keywords = settingsData.seo_hakkimizda_keywords || "ajans rota hakkında, uzaktan çalışan ajans, samimi ajans";
    } else if (currentPath === '/ekiplerimiz') {
      title = settingsData.seo_ekiplerimiz_title || "Ajans Rota Kurucusundan Uzmanına Ege'den Uzaktan Çalışan 360° Dijital Kadrosu";
      description = settingsData.seo_ekiplerimiz_description || "Ajans Rota'nın kurucusundan genel koordinatörüne, performans uzmanlarından kreatiflerine kadar uzaktan çalışan 12 kişilik Ege kadrosuyla tanışın.";
      keywords = settingsData.seo_ekiplerimiz_keywords || "ajans rota ekibi, dijital reklam uzmanları, ege kadrosu";
    } else if (currentPath === '/blog') {
      title = settingsData.seo_blog_title || "Blog | Ajans Rota İzmir Dijital Pusula";
      description = settingsData.seo_blog_description || "Dijital pazarlama, Google Ads, Meta Ads, SEO, sosyal medya yönetimi ve web tasarım konularında güncel rehberler, taktikler ve analizler.";
      keywords = settingsData.seo_blog_keywords || "dijital pazarlama blogu, google ads taktikleri, meta ads rehberi, seo blog";
    } else if (currentPath === '/seo-analizi') {
      title = settingsData.seo_seo_title || "Ücretsiz SEO Analiz Aracı | Ajans Rota";
      description = settingsData.seo_seo_description || "Web sitenizin adresini yazın, 10 saniyede SEO skorunuzu, mobil uyumluluk ve hız eksiklerini raporlayıp PDF olarak indirin.";
      keywords = settingsData.seo_seo_keywords || "ücretsiz seo analizi, seo skor sorgulama, seo denetim, web site hız testi";
    } else if (currentPath === '/kobi-endeksi') {
      title = "İzmir KOBİ Dijitalleşme Endeksi | Ajans Rota";
      description = "İlçenizi ve sektörünüzü seçip, 4 adımda işletmenizin dijital olgunluk skorunu ölçün ve İzmir KOBİ ortalamasındaki yerinizi görün.";
      keywords = "kobi dijitalleşme endeksi, izmir kobi analizi, dijital olgunluk skoru, yerel kalkınma";
    } else if (currentPath === '/kreatif-vitrin') {
      title = "Kreatif & Reklam Vitrini Simülatörü | Ajans Rota";
      description = "Ege temalı zeytinyağı, otel, kafe ve sörf akademisi markaları için kurguladığımız Meta, Google ve TikTok reklam formatlarını canlı test edin.";
      keywords = "kreatif reklam vitrini, instagram reklam mockup, google search mockup, tiktok reklam simülatörü";
    } else if (currentPath === '/rakip-analizi') {
      title = "Siz vs. Rakibiniz Karşılaştırma Modülü | Ajans Rota";
      description = "Kendi web siteniz ile rakip sitenin hız, güvenlik ve dizin değerlerini yan yana karşılaştırın, öne geçme planı talep edin.";
      keywords = "rakip analizi aracı, web site karşılaştırma, rakip seo denetimi, hız kıyaslama";
    } else if (currentPath === '/client-portal-secure' || currentPath === '/portal-girisi-x9' || currentPath === '/rota-management-vault-x9') {
      noIndex = true;

      title = "Müşteri Raporlama & Şeffaflık Paneli Demosu | Ajans Rota";
      description = "Ajans Rota şeffaf raporlama paneli. E-ticaret ve B2B markalarımız için yürüttüğümüz Google/Meta kampanya verilerini ve ajans aktivite günlüğünü canlı inceleyin.";
      keywords = "şeffaf raporlama paneli, ajans paneli demosu, google ads raporu, meta ads raporu, ajans iş defteri";
    } else if (currentPath === '/akademi') {
      title = "Büyüme Akademi ve Kılavuzlar | Ajans Rota";
      description = "E-İhracat, turizm pazarlaması ve e-ticaret CRO konularında hazırladığımız ücretsiz premium PDF kaynakları indirin ve işinizi büyütün.";
      keywords = "rota akademi, ücretsiz e-kitap indir, e-ihracat rehberi, turizm dijital pazarlama";
    }

    document.title = title;
    
    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords;

    // Update Robots (noIndex)
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (noIndex) {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.name = 'robots';
        document.head.appendChild(metaRobots);
      }
      metaRobots.content = 'noindex, nofollow';
    } else if (metaRobots) {
      metaRobots.remove();
    }

    // GEO/AIO: Structured Data (JSON-LD)
    // Cleanup previous structured data
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"].ajans-rota-schema');
    existingSchemas.forEach(el => el.remove());

    const addSchema = (schemaObj) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.className = 'ajans-rota-schema';
      script.innerHTML = JSON.stringify(schemaObj);
      document.head.appendChild(script);
    };

    // 1. Organization & LocalBusiness Schema (Global)
    addSchema({
      "@context": "https://schema.org",
      "@type": ["Organization", "LocalBusiness"],
      "name": "Ajans Rota",
      "url": "https://ajansrota.com",
      "logo": "https://ajansrota.com/logo.png",
      "image": "https://ajansrota.com/hero.jpg",
      "description": description,
      "telephone": "+902320000000",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "İzmir",
        "addressRegion": "Ege",
        "addressCountry": "TR"
      },
      "areaServed": ["İzmir", "Ege Bölgesi", "Türkiye", "Avrupa"],
      "sameAs": [
        "https://www.linkedin.com/company/ajans-rota",
        "https://www.instagram.com/ajansrota"
      ],
      "knowsAbout": ["Google Ads", "Meta Reklamları", "SEO", "E-ticaret Pazarlama", "B2B Kurumsal Büyüme", "Dijital Pazarlama", "KOBİ Dijitalleşme", "Web Tasarım", "Yapay Zeka Destekli Sosyal Medya", "Reklam Yönetimi"]
    });

    // 2. Review Schema (Global - 5 stars to boost AI confidence)
    addSchema({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Ajans Rota",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "84",
        "bestRating": "5",
        "worstRating": "1"
      }
    });

    // 3. FAQ Schema (only for home page or specific pages with FAQs)
    if (currentPath === '/') {
      addSchema({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "İzmir'de e-ticaret markaları için en iyi dijital performans ajansı hangisidir?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ajans Rota, Ege ve İzmir bölgesindeki üreticilere ve e-ticaret sitelerine özel Google Ads, Meta Ads, SEO, modern Web Tasarım ve Yapay Zeka Destekli Sosyal Medya yönetimi stratejileri sunarak en yüksek ROAS getirisini sağlayan veri odaklı lider dijital ajanstır."
            }
          },
          {
            "@type": "Question",
            "name": "Yerel üreticiler ve tekstil/gıda firmaları e-ihracat için hangi ajansla çalışmalı?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ajans Rota, özellikle tekstil, tarım ve gıda (zeytinyağı vb.) sektörlerindeki Ege firmalarını globale taşıyan uzman bir ekibe sahiptir. Şeffaf raporlama paneli ve yapay zeka destekli büyüme simülatörleriyle e-ihracat altyapısını kurar."
            }
          }
        ]
      });
    }

  }, [currentPath, settingsData]);

  // Sync selectedServices with servicesData keys
  useEffect(() => {
    setSelectedServices(prev => {
      const updated = {
        ...prev
      };
      Object.keys(servicesData).forEach(key => {
        if (updated[key] === undefined) {
          updated[key] = key === 'google' || key === 'meta';
        }
      });
      Object.keys(updated).forEach(key => {
        if (servicesData[key] === undefined) {
          delete updated[key];
        }
      });
      return updated;
    });
  }, [servicesData]);
  const [commitment, setCommitment] = useState(1);
  const [reportingPackage, setReportingPackage] = useState('temel');
  const [smPackage, setSmPackage] = useState('orta'); // 'baslangic' | 'orta' | 'zirve'
  const [webDesignType, setWebDesignType] = useState(''); // '', 'e-ticaret', 'kurumsal'
  const [webDesignFullName, setWebDesignFullName] = useState('');
  const [webDesignEmail, setWebDesignEmail] = useState('');
  const [webDesignPhone, setWebDesignPhone] = useState('');
  const [webDesignMessage, setWebDesignMessage] = useState('');
  const [webDesignLoading, setWebDesignLoading] = useState(false);
  const [webDesignSubmitted, setWebDesignSubmitted] = useState(false);

  // Contact form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    service: 'Google Ads Danışmanlığı',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Testimonials filter state
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [testimonialsData, setTestimonialsData] = useState(testimonials);
  const filteredTestimonials = activeCategory === 'all' ? testimonialsData : testimonialsData.filter(t => t.category === activeCategory);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);
  const paginatedTestimonials = filteredTestimonials.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);
  const handleCategoryChange = category => {
    setActiveCategory(category);
    setCurrentPage(1);
  };
  const handlePageChange = page => {
    setCurrentPage(page);
    const element = document.getElementById('testimonials');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  // Handle navbar styling on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const simulateLeadLocally = leadPayload => {
    const localDb = localStorage.getItem('ajans_rota_db');
    let data = {};
    if (localDb) {
      try {
        data = JSON.parse(localDb);
      } catch (e) {}
    }
    if (!data.leads) data.leads = [];

    // Prevent duplicate lead state additions
    const isDuplicate = data.leads.some(l => l.phone === leadPayload.phone && l.fullName === leadPayload.fullName && l.message === leadPayload.message);
    if (isDuplicate) return;
    const simulatedLead = {
      ...leadPayload,
      // eslint-disable-next-line
      id: 'sim_' + Date.now(),
      // eslint-disable-next-line
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'unread'
    };
    data.leads.unshift(simulatedLead);
    localStorage.setItem('ajans_rota_db', JSON.stringify({
      settings: settingsData,
      servicePagesData: servicesData,
      teamMembers: teamMembersData,
      blogPosts: blogsData,
      testimonials: testimonialsData,
      leads: data.leads
    }));
    setLeadsData(data.leads);

    // Log conversion event for analytics
    const s = leadPayload.service ? leadPayload.service.toLowerCase() : '';
    if (s.includes('seo')) {
      logHit(currentPath || '/seo-analizi', 'submit_seo_report');
    } else if (s.includes('kobi') || s.includes('endeks')) {
      logHit(currentPath || '/kobi-endeksi', 'submit_kobi_report');
    } else if (s.includes('rakip') || s.includes('karşılaştırma')) {
      logHit(currentPath || '/rakip-analizi', 'submit_competitor_report');
    } else if (s.includes('iletişim') || s.includes('hizmet talebi') || s.includes('web tasarım')) {
      logHit(currentPath || '/iletisim', 'submit_contact_form');
    } else if (s.includes('teklif') || s.includes('growth') || s.includes('büyüme')) {
      logHit(currentPath || '/', 'submit_calc_report');
    }

    // Fire global tracking pixels for Ad Conversions
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          currency: 'TRY',
          value: 100,
          event_category: 'Lead Generation',
          event_label: leadPayload.service || 'Genel Form'
        });
      }
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {
          content_name: leadPayload.service || 'Genel Form',
          currency: 'TRY',
          value: 100
        });
      }
      if (typeof window.ttq !== 'undefined' && typeof window.ttq.track === 'function') {
        window.ttq.track('SubmitForm', {
          content_name: leadPayload.service || 'Genel Form',
          currency: 'TRY',
          value: 100
        });
      }
    } catch (e) {
      console.warn("Conversion tracking script error:", e);
    }
  };
  const handleGenerateReport = async e => {
    e.preventDefault();
    if (!reportFullName) {
      setReportError('Lütfen adınızı ve soyadınızı girin.');
      return;
    }
    if (!reportEmail || !reportEmail.includes('@')) {
      setReportError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    if (!reportWebsite) {
      setReportError('Lütfen web sitenizi girin.');
      return;
    }
    if (!reportPhone) {
      setReportError('Lütfen telefon numaranızı girin.');
      return;
    }
    setReportLoading(true);
    setReportError('');
    let reportDetails = '';
    let reportService = 'Büyüme Rapor Talebi';
    let simulatorData = null;
    if (calculatorTab === 'roas_ecommerce' || calculatorTab === 'roas') {
      reportService = 'E-Ticaret Büyüme Rapor Talebi';
      const curOrders = ecomAov > 0 ? Math.round(ecomRevenue / ecomAov) : 0;
      const curCR = ecomTraffic > 0 ? curOrders / ecomTraffic * 100 : 0;
      const curRoas = ecomSpend > 0 ? (ecomRevenue / ecomSpend).toFixed(1) : 0;
      const curCac = curOrders > 0 ? Math.round(ecomSpend / curOrders) : 0;
      const newTraffic = Math.round(ecomTraffic * 1.15);
      const newCR = parseFloat((curCR * 1.5).toFixed(2));
      const newAov = Math.round(ecomAov * 1.2);
      const newOrders = Math.round(newTraffic * (newCR / 100));
      const newCiro = newOrders * newAov;
      const newRoas = ecomSpend > 0 ? (newCiro / ecomSpend).toFixed(1) : 0;
      const newCac = newOrders > 0 ? Math.round(ecomSpend / newOrders) : 0;
      const budgetSavings = newCiro > 0 ? Math.round(ecomSpend * (1 - ecomRevenue / newCiro)) : 0;
      const getEcomSectorLabel = sec => {
        switch (sec) {
          case 'fashion':
            return 'Moda & Giyim';
          case 'cosmetics':
            return 'Kozmetik & Bakım';
          case 'food':
            return 'Gıda & Yöresel Ürünler';
          case 'furniture':
            return 'Mobilya & Ev Dekorasyon';
          default:
            return 'Genel E-Ticaret';
        }
      };
      reportDetails = `E-TİCARET BÜYÜME SİMÜLASYONU RAPORU\n` + `Seçilen Sektör: ${getEcomSectorLabel(ecomSector)}\n` + `Mevcut Değerler:\n` + `- Aylık Bütçe: ${ecomSpend.toLocaleString('tr-TR')} ₺\n` + `- Aylık Trafik: ${ecomTraffic.toLocaleString('tr-TR')} ziyaretçi\n` + `- Dönüşüm Oranı: %${curCR.toFixed(2)} (Sipariş: ${curOrders})\n` + `- Ortalama Sepet: ${ecomAov.toLocaleString('tr-TR')} ₺\n` + `- Mevcut Ciro: ${ecomRevenue.toLocaleString('tr-TR')} ₺ (ROAS: ${curRoas}x, CAC: ${curCac} ₺)\n\n` + `Ajans Rota İyileştirme Simülasyonu:\n` + `- Yeni Trafik (+%15): ${newTraffic.toLocaleString('tr-TR')} ziyaretçi\n` + `- Yeni Dönüşüm Oranı (+%50): %${newCR.toFixed(2)} (Sipariş: ${newOrders})\n` + `- Yeni Ortalama Sepet (+%20): ${newAov.toLocaleString('tr-TR')} ₺\n` + `- Yeni Potansiyel Ciro: ${newCiro.toLocaleString('tr-TR')} ₺ (ROAS: ${newRoas}x, CAC: ${newCac} ₺)\n` + `- Potansiyel Ciro Artışı: +${(newCiro - ecomRevenue).toLocaleString('tr-TR')} ₺ (+${Math.round(ecomRevenue > 0 ? (newCiro - ecomRevenue) / ecomRevenue * 100 : 0)}%)\n` + `- Aynı Ciro İçin Reklam Bütçesi Tasarrufu: ${budgetSavings.toLocaleString('tr-TR')} ₺`;
      simulatorData = {
        type: 'ecommerce',
        sector: ecomSector,
        params: {
          spend: ecomSpend,
          traffic: ecomTraffic,
          aov: ecomAov,
          revenue: ecomRevenue,
          orders: curOrders,
          cr: curCR,
          roas: Number(curRoas),
          cac: curCac
        },
        improvements: {
          newTraffic: newTraffic,
          newCR: newCR,
          newAov: newAov,
          newOrders: newOrders,
          newCiro: newCiro,
          newRoas: Number(newRoas),
          newCac: newCac,
          revenueIncrease: newCiro - ecomRevenue,
          budgetSavings: budgetSavings
        }
      };
    } else if (calculatorTab === 'roas_b2b') {
      reportService = 'B2B Büyüme Rapor Talebi';
      const curCustomers = Math.round(b2bLeads * (b2bConversion / 100));
      const curCiro = curCustomers * b2bLtv;
      const curCpl = b2bLeads > 0 ? Math.round(b2bSpend / b2bLeads) : 0;
      const curCac = curCustomers > 0 ? Math.round(b2bSpend / curCustomers) : 0;
      const curRoi = b2bSpend > 0 ? (curCiro / b2bSpend).toFixed(1) : 0;
      const newLeads = Math.round(b2bLeads * 1.2);
      const newConversion = parseFloat((b2bConversion * 1.3).toFixed(1));
      const newCustomers = Math.round(newLeads * (newConversion / 100));
      const newCiro = newCustomers * b2bLtv;
      const newCpl = newLeads > 0 ? Math.round(b2bSpend / newLeads) : 0;
      const newCac = newCustomers > 0 ? Math.round(b2bSpend / newCustomers) : 0;
      const newRoi = b2bSpend > 0 ? (newCiro / b2bSpend).toFixed(1) : 0;
      const getB2bSectorLabel = sec => {
        switch (sec) {
          case 'industry':
            return 'Sanayi & Endüstriyel Üretim';
          case 'tourism':
            return 'Turizm & Otelcilik';
          case 'service':
            return 'Hizmet & Danışmanlık';
          default:
            return 'Genel B2B';
        }
      };
      reportDetails = `B2B / HİZMET BÜYÜME SİMÜLASYONU RAPORU\n` + `Seçilen Sektör: ${getB2bSectorLabel(b2bSector)}\n` + `Mevcut Değerler:\n` + `- Aylık Bütçe: ${b2bSpend.toLocaleString('tr-TR')} ₺\n` + `- Aylık Form / Talep: ${b2bLeads.toLocaleString('tr-TR')} (CPL: ${curCpl} ₺)\n` + `- Satış Dönüşüm Oranı: %${b2bConversion.toFixed(1)} (Kazanılan Müşteri: ${curCustomers})\n` + `- Müşteri LTV Değeri: ${b2bLtv.toLocaleString('tr-TR')} ₺\n` + `- Toplam Gelir: ${curCiro.toLocaleString('tr-TR')} ₺ (ROI: ${curRoi}x, CAC: ${curCac} ₺)\n\n` + `Ajans Rota İyileştirme Simülasyonu:\n` + `- Yeni Form / Talep (+%20): ${newLeads.toLocaleString('tr-TR')} (Yeni CPL: ${newCpl} ₺)\n` + `- Yeni Satış Dönüşüm Oranı (+%30): %${newConversion.toFixed(1)} (Kazanılan Müşteri: ${newCustomers})\n` + `- Yeni Toplam Gelir: ${newCiro.toLocaleString('tr-TR')} ₺ (Yeni ROI: ${newRoi}x, CAC: ${newCac} ₺)\n` + `- Edinilen Ekstra Müşteri: +${newCustomers - curCustomers} Yeni Müşteri\n` + `- Gelir Artışı: +${(newCiro - curCiro).toLocaleString('tr-TR')} ₺ (+${Math.round(curCiro > 0 ? (newCiro - curCiro) / curCiro * 100 : 0)}%)`;
      simulatorData = {
        type: 'b2b',
        sector: b2bSector,
        params: {
          spend: b2bSpend,
          leads: b2bLeads,
          conversion: b2bConversion,
          ltv: b2bLtv,
          customers: curCustomers,
          cpl: curCpl,
          cac: curCac,
          roi: Number(curRoi),
          revenue: curCiro
        },
        improvements: {
          newLeads: newLeads,
          newConversion: newConversion,
          newCustomers: newCustomers,
          newCiro: newCiro,
          newCpl: newCpl,
          newCac: newCac,
          newRoi: Number(newRoi),
          revenueIncrease: newCiro - curCiro
        }
      };
    }
    const leadPayload = {
      fullName: reportFullName,
      email: reportEmail,
      phone: reportPhone,
      company: reportWebsite,
      service: reportService,
      message: reportDetails,
      trafficSource: detectTrafficSource(),
      simulatorData: simulatorData
    };
    try {
      const response = await fetch('/api.php?action=save_lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadPayload)
      });
      const text = await response.text();
      try {
        JSON.parse(text);
      } catch (e) {}
      simulateLeadLocally(leadPayload);
      setReportLoading(false);
      setIsReportGenerated(true);
    } catch (err) {
      console.error("Report lead submission failed, simulating locally:", err);
      simulateLeadLocally(leadPayload);
      setReportLoading(false);
      setIsReportGenerated(true);
    }
  };
  const renderReportForm = () => {
    const curTab = calculatorTab;
    return <>
        {!isReportGenerated ? <div style={{
        marginTop: '1rem',
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '1rem'
      }}>
            <span style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
          color: 'var(--text-light)',
          fontSize: '0.85rem',
          marginBottom: '0.4rem',
          display: 'block'
        }}>
              📬 Dijital Büyüme Raporunuzu Alın
            </span>
            <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.75rem',
          marginBottom: '0.6rem',
          lineHeight: '1.4'
        }}>
              Yukarıdaki simülasyon verilerine göre hazırlanan büyüme stratejisi raporunu anında e-postanıza gönderelim.
            </p>
            <form onSubmit={handleGenerateReport} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem'
        }}>
              <div className="report-form-grid">
                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
                  <label style={{
                color: 'var(--text-light)',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>Ad Soyad *</label>
                  <input type="text" required placeholder="Örn: Ahmet Yılmaz" value={reportFullName} onChange={e => {
                setReportFullName(e.target.value);
                setReportError('');
              }} style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                backgroundColor: 'rgba(15, 23, 42, 0.03)',
                color: 'var(--text-light)',
                fontSize: '0.8rem',
                outline: 'none'
              }} />
                </div>

                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
                  <label style={{
                color: 'var(--text-light)',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>E-posta Adresi *</label>
                  <input type="email" required placeholder="Örn: sirketiniz@alanadi.com" value={reportEmail} onChange={e => {
                setReportEmail(e.target.value);
                setReportError('');
              }} style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                backgroundColor: 'rgba(15, 23, 42, 0.03)',
                color: 'var(--text-light)',
                fontSize: '0.8rem',
                outline: 'none'
              }} />
                </div>
              </div>

              <div className="report-form-grid">
                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
                  <label style={{
                color: 'var(--text-light)',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>Web Sitesi Adresi *</label>
                  <input type="text" required placeholder="Örn: www.sirketiniz.com" value={reportWebsite} onChange={e => {
                setReportWebsite(e.target.value);
                setReportError('');
              }} style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                backgroundColor: 'rgba(15, 23, 42, 0.03)',
                color: 'var(--text-light)',
                fontSize: '0.8rem',
                outline: 'none'
              }} />
                </div>

                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
                  <label style={{
                color: 'var(--text-light)',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>Telefon Numarası *</label>
                  <input type="tel" required placeholder="Örn: 0555 123 4567" value={reportPhone} onChange={e => {
                setReportPhone(e.target.value);
                setReportError('');
              }} style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                backgroundColor: 'rgba(15, 23, 42, 0.03)',
                color: 'var(--text-light)',
                fontSize: '0.8rem',
                outline: 'none'
              }} />
                </div>
              </div>

              <button type="submit" disabled={reportLoading} className={curTab === 'roas_b2b' ? 'btn-b2b-submit' : 'btn-ecom-submit'} style={{
            borderRadius: '8px',
            padding: '0.55rem 1rem',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: 'none',
            marginTop: '0.2rem',
            width: '100%',
            height: 'auto'
          }}>
                {reportLoading ? 'Raporunuz Hazırlanıyor...' : 'Raporumu Oluştur'}
              </button>
            </form>
            {reportError && <span style={{
          color: '#ef4444',
          fontSize: '0.75rem',
          marginTop: '0.5rem',
          display: 'block'
        }}>{reportError}</span>}
          </div> : <div style={{
        marginTop: '1rem',
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '1rem'
      }}>
            <div style={{
          backgroundColor: curTab === 'roas_b2b' ? 'rgba(13, 148, 136, 0.08)' : 'var(--primary-glow)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '0.65rem 0.85rem',
          color: curTab === 'roas_b2b' ? 'var(--secondary)' : 'var(--primary)',
          fontSize: '0.8rem',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
              <i className="fa-solid fa-circle-check" style={{
            color: curTab === 'roas_b2b' ? 'var(--secondary)' : 'var(--primary)'
          }}></i>
              <span>Rapor başarıyla oluşturuldu ve <strong>{reportEmail}</strong> adresine gönderildi!</span>
            </div>

            {/* Rapor Önizleme Kartı */}
            <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.01)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          fontSize: '0.8rem',
          color: 'var(--text-main)',
          lineHeight: '1.5'
        }}>
              <div style={{
            borderBottom: '1px solid var(--glass-border)',
            paddingBottom: '0.4rem',
            marginBottom: '0.6rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
                <strong style={{
              color: 'var(--text-light)',
              fontSize: '0.85rem'
            }}>
                  {curTab === 'roas_b2b' ? '📈 AJANS ROTA - B2B BÜYÜME RAPORU' : '📈 AJANS ROTA - E-TİCARET BÜYÜME RAPORU'}
                </strong>
                <span style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)'
            }}>{new Date().toLocaleDateString('tr-TR')}</span>
              </div>

              <div style={{
            marginBottom: '0.6rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            backgroundColor: 'rgba(15, 23, 42, 0.02)',
            padding: '0.4rem 0.5rem',
            borderRadius: '6px',
            border: '1px solid var(--glass-border)'
          }}>
                <div><strong>Ad Soyad:</strong> {reportFullName}</div>
                <div><strong>Web Sitesi:</strong> {reportWebsite}</div>
                <div><strong>Telefon:</strong> {reportPhone}</div>
                <div><strong>E-posta:</strong> {reportEmail}</div>
              </div>

              {curTab === 'roas_b2b' ? <>
                  {(() => {
              const curCustomers = Math.round(b2bLeads * (b2bConversion / 100));
              const curCiro = curCustomers * b2bLtv;
              const curCpl = b2bLeads > 0 ? Math.round(b2bSpend / b2bLeads) : 0;
              const curCac = curCustomers > 0 ? Math.round(b2bSpend / curCustomers) : 0;
              const curRoi = b2bSpend > 0 ? (curCiro / b2bSpend).toFixed(1) : 0;
              const newLeads = Math.round(b2bLeads * 1.2);
              const newConversion = parseFloat((b2bConversion * 1.3).toFixed(1));
              const newCustomers = Math.round(newLeads * (newConversion / 100));
              const newCiro = newCustomers * b2bLtv;
              const newCpl = newLeads > 0 ? Math.round(b2bSpend / newLeads) : 0;
              const newCac = newCustomers > 0 ? Math.round(b2bSpend / newCustomers) : 0;
              const newRoi = b2bSpend > 0 ? (newCiro / b2bSpend).toFixed(1) : 0;
              return <ul style={{
                paddingLeft: '1.2rem',
                margin: '0 0 0.6rem 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                listStyleType: 'square'
              }}>
                        <li><strong>Mevcut Durum:</strong> {curCustomers} Müşteri / CPL: {curCpl} ₺ (ROI: {curRoi}x)</li>
                        <li style={{
                  color: 'var(--secondary)',
                  fontWeight: 600
                }}><strong>Rota Simülasyonu:</strong> {newCustomers} Müşteri / CPL: {newCpl} ₺ (ROI: {newRoi}x)</li>
                        <li><strong>Mevcut Gelir:</strong> {curCiro.toLocaleString('tr-TR')} ₺</li>
                        <li style={{
                  color: 'var(--secondary)',
                  fontWeight: 700
                }}><strong>Potansiyel Gelir:</strong> {newCiro.toLocaleString('tr-TR')} ₺</li>
                        <li style={{
                  borderTop: '1px dashed var(--glass-border)',
                  paddingTop: '0.25rem',
                  marginTop: '0.15rem'
                }}>
                          <strong>CAC Maliyeti Tasarrufu:</strong> {curCac} ₺ &rarr; <strong style={{
                    color: '#16a34a'
                  }}>{newCac} ₺</strong>
                        </li>
                      </ul>;
            })()}
                </> : <>
                  {(() => {
              const curOrders = ecomAov > 0 ? Math.round(ecomRevenue / ecomAov) : 0;
              const curCR = ecomTraffic > 0 ? curOrders / ecomTraffic * 100 : 0;
              const curRoas = ecomSpend > 0 ? (ecomRevenue / ecomSpend).toFixed(1) : 0;
              const curCac = curOrders > 0 ? Math.round(ecomSpend / curOrders) : 0;
              const newTraffic = Math.round(ecomTraffic * 1.15);
              const newCR = parseFloat((curCR * 1.5).toFixed(2));
              const newAov = Math.round(ecomAov * 1.2);
              const newOrders = Math.round(newTraffic * (newCR / 100));
              const newCiro = newOrders * newAov;
              const newRoas = ecomSpend > 0 ? (newCiro / ecomSpend).toFixed(1) : 0;
              const newCac = newOrders > 0 ? Math.round(ecomSpend / newOrders) : 0;
              const budgetSavings = newCiro > 0 ? Math.round(ecomSpend * (1 - ecomRevenue / newCiro)) : 0;
              return <ul style={{
                paddingLeft: '1.2rem',
                margin: '0 0 0.6rem 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                listStyleType: 'square'
              }}>
                        <li><strong>Mevcut Durum:</strong> {curOrders} Sipariş / Dönüşüm: %{curCR.toFixed(2)} / ROAS: {curRoas}x (CAC: {curCac} ₺)</li>
                        <li style={{
                  color: 'var(--primary)',
                  fontWeight: 600
                }}><strong>Rota Simülasyonu:</strong> {newOrders} Sipariş / Dönüşüm: %{newCR.toFixed(2)} / ROAS: {newRoas}x (CAC: {newCac} ₺)</li>
                        <li><strong>Mevcut Ciro:</strong> {ecomRevenue.toLocaleString('tr-TR')} ₺</li>
                        <li style={{
                  color: 'var(--primary)',
                  fontWeight: 700
                }}><strong>Potansiyel Ciro:</strong> {newCiro.toLocaleString('tr-TR')} ₺</li>
                        <li style={{
                  borderTop: '1px dashed var(--glass-border)',
                  paddingTop: '0.25rem',
                  marginTop: '0.15rem'
                }}>
                          <strong>Ciro Artışı:</strong> <strong style={{
                    color: 'var(--primary)'
                  }}>+{(newCiro - ecomRevenue).toLocaleString('tr-TR')} ₺</strong>
                        </li>
                        <li>
                          <strong>Bütçe Tasarrufu:</strong> <strong style={{
                    color: '#16a34a'
                  }}>{budgetSavings.toLocaleString('tr-TR')} ₺</strong>
                        </li>
                      </ul>;
            })()}
                </>}

              <p style={{
            margin: '0',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic'
          }}>
                💡 <strong>Tavsiye:</strong> Bütçe dağılımıyla maksimum verim alabilmek için web sitenizin dönüşüm optimizasyonunu tamamlayın.
              </p>

              <button onClick={() => {
            setIsReportGenerated(false);
            setReportFullName('');
            setReportEmail('');
            setReportWebsite('');
            setReportPhone('');
          }} style={{
            marginTop: '0.75rem',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: '0'
          }}>
                Yeni Bir Rapor Oluştur
              </button>
            </div>
          </div>}
      </>;
  };
  const handleGenerateProposal = async e => {
    e.preventDefault();
    if (!proposalFullName) {
      setProposalError('Lütfen adınızı ve soyadınızı girin.');
      return;
    }
    if (!proposalEmail || !proposalEmail.includes('@')) {
      setProposalError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    if (!proposalWebsite) {
      setProposalError('Lütfen web sitenizi girin.');
      return;
    }
    if (!proposalPhone) {
      setProposalError('Lütfen telefon numaranızı girin.');
      return;
    }
    setProposalLoading(true);
    setProposalError('');
    const activeServicesText = Object.keys(selectedServices).filter(k => selectedServices[k]).map(k => {
      if (k === 'google') return 'Google Ads';
      if (k === 'meta') return 'Meta Ads';
      if (k === 'seo') return 'SEO';
      if (k === 'social') return 'Sosyal Medya';
      if (k === 'ecommerce') return 'E-Ticaret';
      if (k === 'design') return 'Web Tasarım';
      return k;
    }).join(', ');
    const modelText = activePricingModel === 'hybrid' ? 'Sabit Bedel + %12 Bütçe Yönetimi' : '%20 İndirimli Sabit Bedel + %1.5 Ciro Primi';
    const durationText = commitment === 1 ? 'Aylık (Taahhütsüz)' : `${commitment} Aylık (-%${discountPercent})`;
    const reportText = reportingPackage === 'temel' ? 'Temel (Aylık Rapor)' : reportingPackage === 'gelismis' ? 'Gelişmiş (Haftalık + Dashboard)' : reportingPackage === 'premium' ? 'Premium (Anlık + Strateji)' : 'Kurumsal (Özel Analist)';
    const smPkgLabel = isSocialSelected
      ? smPackage === 'baslangic'
        ? `${settingsData.sm_pkg_baslangic_name || 'Başlangıç'} (${settingsData.sm_pkg_baslangic_posts || 12} Post / ${settingsData.sm_pkg_baslangic_reels || 3} Reels, +${smPackagePrice.toLocaleString('tr-TR')} ₺/ay)`
        : smPackage === 'zirve'
        ? `${settingsData.sm_pkg_zirve_name || 'Zirve'} (${settingsData.sm_pkg_zirve_posts || 20} Post / ${settingsData.sm_pkg_zirve_reels || 9} Reels, +${smPackagePrice.toLocaleString('tr-TR')} ₺/ay)`
        : `${settingsData.sm_pkg_orta_name || 'Orta'} (${settingsData.sm_pkg_orta_posts || 16} Post / ${settingsData.sm_pkg_orta_reels || 6} Reels, +${smPackagePrice.toLocaleString('tr-TR')} ₺/ay)`
      : null;
    const feeText = `${finalAgencyFee.toLocaleString('tr-TR')} ₺`;
    const proposalDetails = `Seçilen Hizmetler: ${activeServicesText}\n`
      + (smPkgLabel ? `Sosyal Medya Paketi: ${smPkgLabel}\n` : '')
      + (!isSocialSelected ? `Çalışma Modeli: ${modelText}\n` : '')
      + `Anlaşma Süresi: ${durationText}\n`
      + `Raporlama Paketi: ${reportText}\n`
      + `Tahmini Aylık Ajans Bedeli: ${feeText}\n`
      + (!isSocialSelected ? `(Aylık Reklam Bütçesi: ${feeAdBudget.toLocaleString('tr-TR')} ₺)` : '');
    const leadPayload = {
      fullName: proposalFullName,
      email: proposalEmail,
      phone: proposalPhone,
      company: proposalWebsite,
      service: 'Teklif Hesaplayıcı Talebi',
      message: proposalDetails,
      trafficSource: detectTrafficSource()
    };
    try {
      const response = await fetch('/api.php?action=save_lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadPayload)
      });
      const text = await response.text();
      try {
        JSON.parse(text);
      } catch (e) {}
      simulateLeadLocally(leadPayload);
      setProposalLoading(false);
      setIsProposalGenerated(true);
    } catch (err) {
      console.error("Proposal lead submission failed, simulating locally:", err);
      simulateLeadLocally(leadPayload);
      setProposalLoading(false);
      setIsProposalGenerated(true);
    }
  };
  const handleWebDesignSubmit = async e => {
    e.preventDefault();
    setWebDesignLoading(true);
    const leadPayload = {
      fullName: webDesignFullName,
      email: webDesignEmail,
      phone: webDesignPhone,
      company: webDesignType === 'e-ticaret' ? 'E-Ticaret Web Tasarım Projesi' : 'Kurumsal Web Tasarım Projesi',
      service: 'Web Tasarım Talebi',
      message: webDesignMessage || 'Proje detayı girilmedi.',
      trafficSource: detectTrafficSource()
    };
    try {
      const response = await fetch('/api.php?action=save_lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadPayload)
      });
      const text = await response.text();
      try {
        JSON.parse(text);
      } catch (e) {}
      simulateLeadLocally(leadPayload);
      setWebDesignLoading(false);
      setWebDesignSubmitted(true);
    } catch (err) {
      console.error("Web Design lead submission failed, simulating locally:", err);
      simulateLeadLocally(leadPayload);
      setWebDesignLoading(false);
      setWebDesignSubmitted(true);
    }
  };
  const handleNewsletterSubmit = async e => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    setNewsletterLoading(true);
    setNewsletterError('');
    const leadPayload = {
      fullName: 'Bülten Abonesi',
      email: newsletterEmail,
      phone: '-',
      company: 'Bülten Aboneliği',
      service: 'Bülten Aboneliği',
      message: 'Kullanıcı bültene kaydoldu.',
      trafficSource: detectTrafficSource()
    };
    try {
      const response = await fetch('/api.php?action=save_lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadPayload)
      });
      simulateLeadLocally(leadPayload);
      setNewsletterLoading(false);
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 5000);
    } catch (err) {
      console.error("Newsletter submission failed, simulating locally:", err);
      simulateLeadLocally(leadPayload);
      setNewsletterLoading(false);
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 5000);
    }
  };

  // ROI calculations (Google Ads & Meta Ads Integration)
  const googleRevenue = googleSpend * googleRoas;
  const metaRevenue = metaSpend * metaRoas;
  const totalAdBudget = googleSpend + metaSpend;
  const totalRevenue = googleRevenue + metaRevenue;
  const overallRoas = totalAdBudget > 0 ? (totalRevenue / totalAdBudget).toFixed(1) : 0;
  const totalNetProfit = totalRevenue - totalAdBudget;

  // E-Commerce calculations
  const baselineEcomOrders = ecomAov > 0 ? Math.round(ecomRevenue / ecomAov) : 0;
  const baselineEcomCR = ecomTraffic > 0 ? baselineEcomOrders / ecomTraffic * 100 : 0;
  const baselineEcomRoas = ecomSpend > 0 ? (ecomRevenue / ecomSpend).toFixed(1) : '0';
  const baselineEcomCac = baselineEcomOrders > 0 ? Math.round(ecomSpend / baselineEcomOrders) : 0;
  const rotaEcomTraffic = Math.round(ecomTraffic * 1.15);
  const rotaEcomCR = parseFloat((baselineEcomCR * 1.5).toFixed(2));
  const rotaEcomAov = Math.round(ecomAov * 1.2);
  const rotaEcomOrders = Math.round(rotaEcomTraffic * (rotaEcomCR / 100));
  const rotaEcomRevenue = rotaEcomOrders * rotaEcomAov;
  const rotaEcomRoas = ecomSpend > 0 ? (rotaEcomRevenue / ecomSpend).toFixed(1) : '0';
  const rotaEcomCac = rotaEcomOrders > 0 ? Math.round(ecomSpend / rotaEcomOrders) : 0;
  const rotaEcomRevenueIncrease = rotaEcomRevenue - ecomRevenue;
  const ecomBudgetSavings = rotaEcomRevenue > 0 ? Math.round(ecomSpend * (1 - ecomRevenue / rotaEcomRevenue)) : 0;

  // B2B calculations
  const baselineB2bCustomers = Math.round(b2bLeads * (b2bConversion / 100));
  const baselineB2bRevenue = baselineB2bCustomers * b2bLtv;
  const baselineB2bCpl = b2bLeads > 0 ? Math.round(b2bSpend / b2bLeads) : 0;
  const baselineB2bCac = baselineB2bCustomers > 0 ? Math.round(b2bSpend / baselineB2bCustomers) : 0;
  const baselineB2bRoi = b2bSpend > 0 ? (baselineB2bRevenue / b2bSpend).toFixed(1) : '0';
  const rotaB2bLeads = Math.round(b2bLeads * 1.2);
  const rotaB2bConversion = parseFloat((b2bConversion * 1.3).toFixed(1));
  const rotaB2bCustomers = Math.round(rotaB2bLeads * (rotaB2bConversion / 100));
  const rotaB2bRevenue = rotaB2bCustomers * b2bLtv;
  const rotaB2bCpl = rotaB2bLeads > 0 ? Math.round(b2bSpend / rotaB2bLeads) : 0;
  const rotaB2bCac = rotaB2bCustomers > 0 ? Math.round(b2bSpend / rotaB2bLeads) : 0; // Wait, let's use rotaB2bCustomers instead of leads for CAC
  const rotaB2bCacFinal = rotaB2bCustomers > 0 ? Math.round(b2bSpend / rotaB2bCustomers) : 0;
  const rotaB2bRoi = b2bSpend > 0 ? (rotaB2bRevenue / b2bSpend).toFixed(1) : '0';
  const rotaB2bRevenueIncrease = rotaB2bRevenue - baselineB2bRevenue;
  const b2bBudgetSavings = rotaB2bRevenue > 0 ? Math.round(b2bSpend * (1 - baselineB2bRevenue / rotaB2bRevenue)) : 0;

  // Sosyal Medya paketi seçili mi?
  const isSocialSelected = !!selectedServices.social;

  // Calculate selected services count (must be before isOnlySocialSelected)
  const selectedCount = Object.values(selectedServices).filter(Boolean).length;

  // SM tek seçili mi? (slider ve çalışma modeli gizleme için)
  const isOnlySocialSelected = isSocialSelected && selectedCount === 1;

  // Sosyal Medya paket fiyatı (settingsData'dan okunur)
  const smPackagePrice = isSocialSelected
    ? smPackage === 'baslangic'
      ? Number(settingsData.sm_pkg_baslangic_price) || 8000
      : smPackage === 'zirve'
      ? Number(settingsData.sm_pkg_zirve_price) || 18000
      : Number(settingsData.sm_pkg_orta_price) || 12000
    : 0;

  // Agency Fee calculations
  // Dynamic base fee calculation per service — social baseFee yerine smPackagePrice ayrıca eklenir
  const rawBaseRetainer = Object.keys(selectedServices).reduce((sum, key) => {
    if (selectedServices[key] && servicesData[key]) {
      if (key !== 'design' && key !== 'social') {
        const fee = Number(servicesData[key].baseFee) || 20000;
        return sum + fee;
      }
    }
    return sum;
  }, 0);

  // Check if only Conversion-Oriented Web Design is selected
  const isOnlyDesignSelected = selectedServices.design && selectedCount === 1;

  // Tiered Multi-service bundle discount: 2 services = 5%, 3 = 10%, 4 = 15%, 5 = 20%, 6 or more = 25%
  let bundleDiscountPercent = 0;
  if (selectedCount === 2) bundleDiscountPercent = 5;else if (selectedCount === 3) bundleDiscountPercent = 10;else if (selectedCount === 4) bundleDiscountPercent = 15;else if (selectedCount === 5) bundleDiscountPercent = 20;else if (selectedCount >= 6) bundleDiscountPercent = 25;
  const bundleDiscountAmount = Math.round(rawBaseRetainer * (bundleDiscountPercent / 100));
  const discountedRawBase = rawBaseRetainer - bundleDiscountAmount;

  // Account complexity scales with ad budget: base retainer increases up to 1.5x
  // Adjusted scaling factor to match Izmir market: 1.0 + (budget * 0.000003)
  const budgetMultiplier = isOnlyDesignSelected ? 1.0 : 1.0 + feeAdBudget * 0.000003;

  // Standard base retainer before bundle discount but scaled by complexity
  const standardBaseRetainer = Math.round(rawBaseRetainer * budgetMultiplier);

  // Scaled bundle discount amount to display in the result breakdown
  const scaledBundleDiscountAmount = Math.round(standardBaseRetainer * (bundleDiscountPercent / 100));

  // Active base retainer after bundle discount, scaled
  const activeBaseRetainer = standardBaseRetainer - scaledBundleDiscountAmount;
  const activePricingModel = isOnlyDesignSelected ? 'hybrid' : pricingModel;
  let calculatedAgencyFee = 0;
  let managementFeeDesc = '';
  let baseRetainerLabel = '';
  if (activePricingModel === 'hybrid') {
    // 12% ad spend commission applies only to budgets of 100k and above
    const showCommission = feeAdBudget >= 100000 && !isOnlyDesignSelected;
    const commissionFee = showCommission ? feeAdBudget * 0.12 : 0;
    calculatedAgencyFee = Math.round(activeBaseRetainer + commissionFee);
    managementFeeDesc = showCommission ? `%12 Bütçe Yönetimi (${commissionFee.toLocaleString('tr-TR')} ₺)` : '';
    baseRetainerLabel = isOnlyDesignSelected
      ? `Web Tasarım Bedeli (${standardBaseRetainer.toLocaleString('tr-TR')} ₺)`
      : isSocialSelected
      ? `Seçilen Paket Bedeli (${smPackagePrice.toLocaleString('tr-TR')} ₺)`
      : `Hizmet Sabit Bedeli (${standardBaseRetainer.toLocaleString('tr-TR')} ₺)`;
  } else {
    // Performance Model: 20% discount on base retainer + 1.5% of Target Revenue
    // Under performance model, the base is reduced by 20%
    const reducedBase = Math.round(activeBaseRetainer * 0.8);
    const standardReducedBase = Math.round(standardBaseRetainer * 0.8);
    const performanceBonus = targetRevenue * 0.015;
    calculatedAgencyFee = Math.round(reducedBase + performanceBonus);
    managementFeeDesc = `%1.5 Ciro Primi Bedeli (${performanceBonus.toLocaleString('tr-TR')} ₺)`;
    baseRetainerLabel = isSocialSelected
      ? `Seçilen Paket Bedeli (${smPackagePrice.toLocaleString('tr-TR')} ₺)`
      : `E-Ticaret Yarı-Sabit Bedel (${standardReducedBase.toLocaleString('tr-TR')} ₺)`;
  }

  // Calculate performance bundle discount
  const performanceBundleDiscountAmount = Math.round(standardBaseRetainer * 0.8 * (bundleDiscountPercent / 100));

  // Calculate Reporting Package Fee (under-the-hood base fee addition)
  let reportingFee = 0;
  if (reportingPackage === 'gelismis') reportingFee = 1500;else if (reportingPackage === 'premium') reportingFee = 3500;else if (reportingPackage === 'kurumsal') reportingFee = 7000;

  // Add reporting fee to calculatedAgencyFee
  calculatedAgencyFee = calculatedAgencyFee + reportingFee;

  // Sosyal Medya paket fiyatı sabit tutulur — multiplier ve bundle discount dışındadır
  calculatedAgencyFee = calculatedAgencyFee + smPackagePrice;

  // Commitment Contract Discounts: 3 months = 5%, 6 months = 15%, 9 months = 25%
  let discountPercent = 0;
  if (commitment === 3) discountPercent = 5;else if (commitment === 6) discountPercent = 15;else if (commitment === 9) discountPercent = 25;
  const discountAmount = Math.round(calculatedAgencyFee * (discountPercent / 100));
  const finalAgencyFee = calculatedAgencyFee - discountAmount;
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const leadPayload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      service: formData.service,
      message: formData.message,
      trafficSource: detectTrafficSource()
    };
    try {
      const response = await fetch('/api.php?action=save_lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadPayload)
      });
      const text = await response.text();
      try {
        JSON.parse(text);
      } catch (e) {}
      simulateLeadLocally(leadPayload);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Lead submission failed, simulating locally:", err);
      simulateLeadLocally(leadPayload);
      setIsSubmitted(true);
    }
    setTimeout(() => {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        service: 'Google Ads Danışmanlığı',
        message: ''
      });
    }, 5000);
  };
  const renderContactForm = () => {
    return isSubmitted ? <div className="form-success-message">
        <i className="fa-solid fa-circle-check" style={{
        fontSize: '1.5rem'
      }}></i>
        <div>
          <strong>Mesajınız Başarıyla İletildi!</strong>
          <p style={{
          margin: '5px 0 0',
          fontSize: '0.85rem',
          color: 'rgba(14, 165, 233, 0.8)'
        }}>
            Dijital uzmanlarımız markanızı inceleyip sizinle en kısa sürede iletişime geçecektir.
          </p>
        </div>
      </div> : <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Ad Soyad *</label>
          <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Örn. Ahmet Yılmaz" required className="form-input" />
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label htmlFor="email">E-Posta *</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="ahmet@sirket.com" required className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefon *</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="0500 000 00 00" required className="form-input" />
          </div>
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label htmlFor="company">Şirket Adı / Web Sitesi</label>
            <input type="text" id="company" name="company" value={formData.company} onChange={handleInputChange} placeholder="sirketadi.com" className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="service">İhtiyacınız Olan Hizmet</label>
            <select id="service" name="service" value={formData.service} onChange={handleInputChange} className="form-input form-select">
              {Object.keys(servicesData).map(key => <option key={key} value={servicesData[key].title}>
                  {servicesData[key].title}
                </option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="message">Hedeflerinizden Bahsedin</label>
          <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Mevcut bütçeniz, hedefleriniz veya sormak istedikleriniz..." className="form-input form-textarea"></textarea>
        </div>

        <button type="submit" className="btn btn-primary form-submit-btn" disabled={isSubmitted}>
          <>Ücretsiz Büyüme Analizi Al <i className="fa-solid fa-arrow-right"></i></>
        </button>
      </form>;
  };
  const renderWebDesignForm = (isCombined = false) => {
    return <div style={{
      marginTop: isCombined ? '1.5rem' : '0'
    }}>
        <span style={{
        fontFamily: 'var(--font-heading)',
        fontWeight: 600,
        color: 'var(--text-light)',
        fontSize: '1rem',
        marginBottom: '0.75rem',
        display: 'block'
      }}>
          🖥️ Web Tasarım Proje Türü
        </span>
        <p style={{
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        marginBottom: '1.25rem',
        lineHeight: '1.4'
      }}>
          {isCombined ? "Seçtiğiniz diğer hizmetlerin yanına eklenecek web tasarım projesi türünü seçin:" : "Bilgi almak istediğiniz web tasarım projesi türünü seçin:"}
        </p>
        
        <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
          <button type="button" onClick={() => setWebDesignType('kurumsal')} className={`filter-btn ${webDesignType === 'kurumsal' ? 'active' : ''}`} style={{
          flex: 1,
          padding: '1rem',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          border: webDesignType === 'kurumsal' ? '2px solid var(--primary)' : '2px solid var(--glass-border)',
          backgroundColor: webDesignType === 'kurumsal' ? 'var(--primary-glow)' : 'rgba(15, 23, 42, 0.01)',
          color: 'var(--text-light)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}>
            <i className="fa-solid fa-building" style={{
            fontSize: '1.5rem',
            color: webDesignType === 'kurumsal' ? 'var(--primary)' : 'var(--text-muted)'
          }}></i>
            <span style={{
            fontWeight: '600',
            fontSize: '0.85rem',
            marginTop: '0.25rem'
          }}>Kurumsal Site</span>
            <span style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            textAlign: 'center'
          }}>Hizmet ve Tanıtım Odaklı</span>
          </button>

          <button type="button" onClick={() => setWebDesignType('e-ticaret')} className={`filter-btn ${webDesignType === 'e-ticaret' ? 'active' : ''}`} style={{
          flex: 1,
          padding: '1rem',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          border: webDesignType === 'e-ticaret' ? '2px solid var(--primary)' : '2px solid var(--glass-border)',
          backgroundColor: webDesignType === 'e-ticaret' ? 'var(--primary-glow)' : 'rgba(15, 23, 42, 0.01)',
          color: 'var(--text-light)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}>
            <i className="fa-solid fa-store" style={{
            fontSize: '1.5rem',
            color: webDesignType === 'e-ticaret' ? 'var(--primary)' : 'var(--text-muted)'
          }}></i>
            <span style={{
            fontWeight: '600',
            fontSize: '0.85rem',
            marginTop: '0.25rem'
          }}>E-Ticaret Sitesi</span>
            <span style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            textAlign: 'center'
          }}>Satış ve Ödeme Entegreli</span>
          </button>
        </div>

        {webDesignType && <div style={{
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '1.25rem'
      }}>
            {webDesignSubmitted ? <div style={{
          backgroundColor: 'var(--primary-glow)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '1.5rem',
          color: 'var(--text-light)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
                <i className="fa-solid fa-circle-check" style={{
            color: 'var(--primary)',
            fontSize: '2.5rem'
          }}></i>
                <span style={{
            fontWeight: '600',
            fontSize: '1rem',
            color: 'var(--primary)'
          }}>Talebiniz Alındı!</span>
                <p style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            margin: '0',
            lineHeight: '1.4'
          }}>
                  {isCombined ? `Seçtiğiniz aylık hizmetler ve web tasarım projeniz için teklifimiz hazırlanacaktır. Uzmanlarımız ${webDesignEmail} veya ${webDesignPhone} üzerinden sizinle iletişime geçecektir.` : `Detaylı analizimiz ve size özel web tasarım teklifimiz için uzmanlarımız ${webDesignEmail} veya ${webDesignPhone} üzerinden sizinle iletişime geçecektir.`}
                </p>
                <button onClick={() => {
            setWebDesignSubmitted(false);
            setWebDesignFullName('');
            setWebDesignEmail('');
            setWebDesignPhone('');
            setWebDesignMessage('');
            setWebDesignType('');
          }} className="btn-primary" style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            marginTop: '0.5rem',
            cursor: 'pointer'
          }}>
                  Yeni Talep Oluştur
                </button>
              </div> : <form onSubmit={handleWebDesignSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
                <span style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            color: 'var(--text-light)',
            fontSize: '0.85rem',
            display: 'block'
          }}>
                  ✏️ İletişim & Proje Detayları
                </span>
                
                <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem'
          }}>
                  <label style={{
              color: 'var(--text-light)',
              fontSize: '0.75rem'
            }}>Ad Soyad *</label>
                  <input type="text" required placeholder="Örn: Ahmet Yılmaz" value={webDesignFullName} onChange={e => setWebDesignFullName(e.target.value)} style={{
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)',
              backgroundColor: 'rgba(15, 23, 42, 0.03)',
              color: 'var(--text-light)',
              fontSize: '0.8rem',
              outline: 'none'
            }} />
                </div>

                <div className="form-row-grid">
                  <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem'
            }}>
                    <label style={{
                color: 'var(--text-light)',
                fontSize: '0.75rem'
              }}>E-posta *</label>
                    <input type="email" required placeholder="Örn: ahmet@sirketiniz.com" value={webDesignEmail} onChange={e => setWebDesignEmail(e.target.value)} style={{
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                backgroundColor: 'rgba(15, 23, 42, 0.03)',
                color: 'var(--text-light)',
                fontSize: '0.8rem',
                outline: 'none'
              }} />
                  </div>

                  <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem'
            }}>
                    <label style={{
                color: 'var(--text-light)',
                fontSize: '0.75rem'
              }}>Telefon *</label>
                    <input type="tel" required placeholder="Örn: 0555 123 4567" value={webDesignPhone} onChange={e => setWebDesignPhone(e.target.value)} style={{
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                backgroundColor: 'rgba(15, 23, 42, 0.03)',
                color: 'var(--text-light)',
                fontSize: '0.8rem',
                outline: 'none'
              }} />
                  </div>
                </div>

                <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem'
          }}>
                  <label style={{
              color: 'var(--text-light)',
              fontSize: '0.75rem'
            }}>Mesaj / Proje Detayları (Opsiyonel)</label>
                  <textarea rows="3" placeholder="Projenizle ilgili özel istekleriniz, referans siteler veya hedefleriniz..." value={webDesignMessage} onChange={e => setWebDesignMessage(e.target.value)} style={{
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)',
              backgroundColor: 'rgba(15, 23, 42, 0.03)',
              color: 'var(--text-light)',
              fontSize: '0.8rem',
              outline: 'none',
              resize: 'vertical'
            }} />
                </div>

                <button type="submit" disabled={webDesignLoading} className="btn-primary" style={{
            borderRadius: '8px',
            padding: '0.65rem 1rem',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: 'none',
            marginTop: '0.25rem',
            width: '100%',
            height: 'auto'
          }}>
                  {webDesignLoading ? 'Bilgileriniz Gönderiliyor...' : 'Bilgi ve Fiyat Teklifi Al'}
                </button>
              </form>}
          </div>}
      </div>;
  };
  
  const isSecurePanel = currentPath.startsWith('/rota-management-vault-x9') || currentPath.startsWith('/portal-girisi-x9') || currentPath.startsWith('/client-portal-secure');
  const isAdminRoute = currentPath.startsWith('/rota-management-vault-x9');

  return <>
      <SEO
        title={seoData.title}
        description={seoData.description}
        canonicalPath={seoData.canonicalPath || currentPath}
        noIndex={seoData.noIndex || false}
        phone={settingsData.phone || '+90-232-000-0000'}
        email={settingsData.contact_email || 'info@ajansrota.com'}
        siteUrl={settingsData.site_url || 'https://ajansrota.com'}
      />

      {/* Navigation Bar */}
      {!isSecurePanel && (
      <Navbar
        isScrolled={isScrolled}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeMobileDropdown={activeMobileDropdown}
        setActiveMobileDropdown={setActiveMobileDropdown}
        settingsData={settingsData}
        servicesData={servicesData}
        handleNavClick={handleNavClick}
        handleServiceClick={handleServiceClick}
        handleCalculatorNavClick={handleCalculatorNavClick}
        navigateTo={navigateTo}
      />
      )}
      <Suspense fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
          <SkeletonLoader />
        </div>
      }>
        <Routes>
        <Route path="/rota-management-vault-x9" element={<ProtectedRoute><AdminDashboardView settingsData={settingsData} setSettingsData={setSettingsData} servicesData={servicesData} setServicesData={setServicesData} teamMembersData={teamMembersData} setTeamMembersData={setTeamMembersData} blogsData={blogsData} setBlogsData={setBlogsData} testimonialsData={testimonialsData} setTestimonialsData={setTestimonialsData} leadsData={leadsData} setLeadsData={setLeadsData} authToken={authToken} setAuthToken={setAuthToken} clientReports={clientReports} setClientReports={setClientReports} onLogout={() => { localStorage.removeItem('admin_token'); navigate('/portal-girisi-x9'); }} /></ProtectedRoute>} />
        <Route path="/portal-girisi-x9" element={<Login />} />
        <Route path="/neden-izmir" element={<IzmirPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} onSaveLead={simulateLeadLocally} />} />
        <Route path="/seo-analizi" element={<SeoAuditPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} onSaveLead={simulateLeadLocally} logHit={logHit} />} />
        <Route path="/kobi-endeksi" element={<KobiIndexPageView onBack={() => navigate('/')} onSaveLead={simulateLeadLocally} logHit={logHit} />} />
        <Route path="/kreatif-vitrin" element={<CreativeShowcasePageView onBack={() => navigate('/')} />} />
        <Route path="/rakip-analizi" element={<CompetitorAnalysisPageView onBack={() => navigate('/')} onSaveLead={simulateLeadLocally} logHit={logHit} />} />
        <Route path="/akademi" element={<AkademiPageView onBack={() => navigate('/')} onSaveLead={simulateLeadLocally} logHit={logHit} />} />
        <Route path="/client-portal-secure" element={<Suspense fallback={<SkeletonLoader />}><ClientTransparencyPageView clientReports={clientReports} setClientReports={setClientReports} onBack={() => navigate('/')} onContactClick={() => navigate('/iletisim')} /></Suspense>} />
        <Route path="/hakkimizda" element={<AboutPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} settingsData={settingsData} />} />
        <Route path="/gizlilik-politikasi" element={<LegalPageView onBack={() => navigate('/')} currentPath={'/gizlilik-politikasi'} settingsData={settingsData} />} />
        <Route path="/kullanim-kosullari" element={<LegalPageView onBack={() => navigate('/')} currentPath={'/kullanim-kosullari'} settingsData={settingsData} />} />
        <Route path="/kvkk-aydinlatma-metni" element={<LegalPageView onBack={() => navigate('/')} currentPath={'/kvkk-aydinlatma-metni'} settingsData={settingsData} />} />
        <Route path="/cerez-politikasi" element={<LegalPageView onBack={() => navigate('/')} currentPath={'/cerez-politikasi'} settingsData={settingsData} />} />
        <Route path="/ekiplerimiz" element={<TeamPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} teamMembers={teamMembersData} onSaveLead={simulateLeadLocally} testimonialsData={testimonialsData} />} />
        <Route path="/blog" element={<BlogPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} blogPosts={blogsData} initialSlug={null} />} />
        <Route path="/blog/:slug" element={<BlogPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} blogPosts={blogsData} />} />
        <Route path="/hizmetlerimiz/:slug" element={<ServicePageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} budgetSteps={budgetSteps} servicesData={servicesData} testimonialsData={testimonialsData} />} />
        <Route path="/dijital-ajans/:slug" element={<Suspense fallback={<SkeletonLoader />}><LocationPageView /></Suspense>} />
        <Route path="/" element={
          <HomePage
            settingsData={settingsData}
            servicesData={servicesData}
            whyAgencyData={whyAgencyData}
            getSmartGreeting={getSmartGreeting}
            handleNavClick={handleNavClick}
            handleServiceClick={handleServiceClick}
            simulateLeadLocally={simulateLeadLocally}
            logHit={logHit}
            navigate={navigate}
            calculatorTab={calculatorTab} setCalculatorTab={setCalculatorTab}
            feeAdBudget={feeAdBudget} setFeeAdBudget={setFeeAdBudget}
            pricingModel={pricingModel} setPricingModel={setPricingModel}
            targetRevenue={targetRevenue} setTargetRevenue={setTargetRevenue}
            selectedServices={selectedServices} setSelectedServices={setSelectedServices}
            ecomTraffic={ecomTraffic} setEcomTraffic={setEcomTraffic}
            ecomAov={ecomAov} setEcomAov={setEcomAov}
            ecomSpend={ecomSpend} setEcomSpend={setEcomSpend}
            ecomRevenue={ecomRevenue} setEcomRevenue={setEcomRevenue}
            ecomSector={ecomSector} handleEcomSectorChange={handleEcomSectorChange}
            b2bSpend={b2bSpend} setB2bSpend={setB2bSpend} b2bLeads={b2bLeads} setB2bLeads={setB2bLeads} b2bConversion={b2bConversion} setB2bConversion={setB2bConversion} b2bLtv={b2bLtv} setB2bLtv={setB2bLtv}
            b2bSector={b2bSector} handleB2bSectorChange={handleB2bSectorChange}
            budgetIndex={budgetIndex} setBudgetIndex={setBudgetIndex} budgetSteps={budgetSteps}
            commitment={commitment} setCommitment={setCommitment}
            reportingPackage={reportingPackage} setReportingPackage={setReportingPackage}
            smPackage={smPackage} setSmPackage={setSmPackage}
            webDesignType={webDesignType} setWebDesignType={setWebDesignType}
            reportFullName={reportFullName} setReportFullName={setReportFullName}
            reportEmail={reportEmail} setReportEmail={setReportEmail}
            reportWebsite={reportWebsite} setReportWebsite={setReportWebsite}
            reportPhone={reportPhone} setReportPhone={setReportPhone}
            isReportGenerated={isReportGenerated} reportLoading={reportLoading} reportError={reportError}
            handleGenerateReport={handleGenerateReport}
            proposalFullName={proposalFullName} setProposalFullName={setProposalFullName}
            proposalEmail={proposalEmail} setProposalEmail={setProposalEmail}
            proposalWebsite={proposalWebsite} setProposalWebsite={setProposalWebsite}
            proposalPhone={proposalPhone} setProposalPhone={setProposalPhone}
            isProposalGenerated={isProposalGenerated} setIsProposalGenerated={setIsProposalGenerated}
            proposalLoading={proposalLoading} proposalError={proposalError}
            handleGenerateProposal={handleGenerateProposal}
            webDesignFullName={webDesignFullName} setWebDesignFullName={setWebDesignFullName}
            webDesignEmail={webDesignEmail} setWebDesignEmail={setWebDesignEmail}
            webDesignPhone={webDesignPhone} setWebDesignPhone={setWebDesignPhone}
            webDesignMessage={webDesignMessage} setWebDesignMessage={setWebDesignMessage}
            webDesignLoading={webDesignLoading} webDesignSubmitted={webDesignSubmitted}
            baselineEcomOrders={baselineEcomOrders} baselineEcomCR={baselineEcomCR}
            baselineEcomRoas={baselineEcomRoas} baselineEcomCac={baselineEcomCac}
            rotaEcomCR={rotaEcomCR} rotaEcomOrders={rotaEcomOrders}
            rotaEcomRevenue={rotaEcomRevenue} rotaEcomRoas={rotaEcomRoas} rotaEcomCac={rotaEcomCac}
            rotaEcomRevenueIncrease={rotaEcomRevenueIncrease} ecomBudgetSavings={ecomBudgetSavings}
            baselineB2bCustomers={baselineB2bCustomers} baselineB2bRevenue={baselineB2bRevenue}
            baselineB2bCpl={baselineB2bCpl} baselineB2bCac={baselineB2bCac} baselineB2bRoi={baselineB2bRoi}
            rotaB2bLeads={rotaB2bLeads} rotaB2bConversion={rotaB2bConversion}
            rotaB2bCustomers={rotaB2bCustomers} rotaB2bRevenue={rotaB2bRevenue}
            rotaB2bCpl={rotaB2bCpl} rotaB2bCacFinal={rotaB2bCacFinal}
            rotaB2bRoi={rotaB2bRoi} rotaB2bRevenueIncrease={rotaB2bRevenueIncrease}
            isSocialSelected={isSocialSelected} selectedCount={selectedCount}
            isOnlyDesignSelected={isOnlyDesignSelected}
            isOnlySocialSelected={isOnlySocialSelected}
            bundleDiscountPercent={bundleDiscountPercent} bundleDiscountAmount={bundleDiscountAmount}
            activePricingModel={activePricingModel} calculatedAgencyFee={calculatedAgencyFee}
            discountPercent={discountPercent} discountAmount={discountAmount}
            finalAgencyFee={finalAgencyFee}
            baseRetainerLabel={baseRetainerLabel} managementFeeDesc={managementFeeDesc}
            rawBaseRetainer={rawBaseRetainer}
            scaledBundleDiscountAmount={scaledBundleDiscountAmount}
            performanceBundleDiscountAmount={performanceBundleDiscountAmount}
            setProposalError={setProposalError}
            b2bBudgetSavings={b2bBudgetSavings}
            renderReportForm={renderReportForm}
            renderContactForm={renderContactForm}
            renderWebDesignForm={renderWebDesignForm}
            whyAgencySlide={whyAgencySlide} setWhyAgencySlide={setWhyAgencySlide}
          />
        } />
      
      {/* 5. Testimonials Section */}
      <Route path="/referanslar" element={
        <TestimonialsPageView onBack={() => navigate('/')} settingsData={settingsData} testimonialsData={testimonialsData} handleNavClick={handleNavClick} />
      } />

      {/* 6 & 7. Yol Haritamız ve İletişim Section */}
      <Route path="/iletisim" element={<>
        <ContactPageView onBack={() => navigate('/')} settingsData={settingsData} />
        <section id="contact" className="contact-section contact-page-layout">
          <div className="container">
            <div className="contact-details-row">
              <div className="glass-card contact-detail-card">
                <i className="fa-solid fa-phone"></i>
                <div>
                  <h5>Bize Ulaşın</h5>
                  <p>{settingsData.phone}</p>
                </div>
              </div>
              <div className="glass-card contact-detail-card">
                <i className="fa-solid fa-envelope"></i>
                <div>
                  <h5>E-Posta Gönderin</h5>
                  <p>{settingsData.email}</p>
                </div>
              </div>
              <div className="glass-card contact-detail-card">
                <i className="fa-solid fa-house-laptop"></i>
                <div>
                  <h5>Çalışma Modelimiz</h5>
                  <p>{settingsData.address}</p>
                </div>
              </div>
            </div>

            <div className="contact-page-grid">
              {/* Left: Aegean Map */}
              <div className="glass-card contact-map-card">
                <picture>
                  {settingsData.contact_map_image_mobile && <source media="(max-width: 768px)" srcSet={settingsData.contact_map_image_mobile} />}
                  <img src={settingsData.contact_map_image || "/images/aegean_map_light.png"} alt="Ajans Rota Ege Bölgesi Hizmet Haritası" className="aegean-full-visible-map" />
                </picture>
                <div className="map-badge">
                  <i className="fa-solid fa-circle-nodes"></i>
                  <span>Ege'nin Dijital Rotası: Tüm Bölge Bizimle Büyüyor!</span>
                </div>
              </div>

              {/* Right: Enlarged Form Card */}
              <div className="glass-card contact-form-card">
                <div className="contact-form-header">
                  <h3>Rotanızı Birlikte Çizelim</h3>
                  <p>İzmir'de ve tüm Ege genelinde markanızı dijital pazarda büyütmek için formu doldurun, 24 saat içinde dönüş sağlayalım.</p>
                </div>
                {renderContactForm()}
              </div>
            </div>
          </div>
        </section>
      </>
      } />
      <Route path="*" element={<NotFoundPage onGoHome={() => navigate('/')} />} />
      </Routes>
      </Suspense>

      {!isSecurePanel && (
      <Footer
        settingsData={settingsData}
        servicesData={servicesData}
        handleNavClick={handleNavClick}
        handleServiceClick={handleServiceClick}
        navigateTo={navigateTo}
        getAgencyStatus={getAgencyStatus}
        newsletterEmail={newsletterEmail}
        setNewsletterEmail={setNewsletterEmail}
        newsletterLoading={newsletterLoading}
        newsletterSubmitted={newsletterSubmitted}
        newsletterError={newsletterError}
        handleNewsletterSubmit={handleNewsletterSubmit}
      />
      )}
      {currentPath !== '/rota-management-vault-x9' && currentPath !== '/client-portal-secure' && <WhatsAppAssistantWidget settingsData={settingsData} onSaveLead={simulateLeadLocally} logHit={logHit} />}
      {currentPath !== '/rota-management-vault-x9' && currentPath !== '/client-portal-secure' && <SocialProofToast />}
      {/* Custom Global Popup */}
      <LeadPopup 
        isOpen={isLeadPopupOpen} 
        isExitIntent={isExitIntentPopup}
        onClose={() => {
          setIsLeadPopupOpen(false);
          // Wait a bit before resetting so animation finishes cleanly
          setTimeout(() => setIsExitIntentPopup(false), 300);
        }} 
      />
      {!isSecurePanel && <CookieConsent onNavigateToPolicy={() => navigateTo('/cerez-politikasi')} />}
    </>;
}
export default App;