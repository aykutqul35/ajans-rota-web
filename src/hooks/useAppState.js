import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSeoData } from '../utils/helpers';
import { initialSettingsData } from '../data/initialSettings';
import { initialServicePagesData, initialTeamMembers, initialBlogPosts, testimonials, initialAcademyCourses } from '../data/mockData';

export const useAppState = (currentPath) => {
const navigate = useNavigate();
const [isLeadPopupOpen, setIsLeadPopupOpen] = useState(false);
  const [isExitIntentPopup, setIsExitIntentPopup] = useState(false);

  // Smart Greeting Logic
  

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
  
  const seoData = getSeoData(currentPath);

  // Active mobile dropdown state (services / corporate)
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);

  // Helper to dynamically calculate working hours and agency status
  

  // Settings state
  const [settingsData, setSettingsData] = useState(initialSettingsData);
  // Service Pages state
  const [servicesData, setServicesData] = useState(initialServicePagesData);
  // Team Members state
  const [teamMembersData, setTeamMembersData] = useState(initialTeamMembers);
  const [testimonialsData, setTestimonialsData] = useState(testimonials);
  // Blog Posts state
  const [blogsData, setBlogsData] = useState(initialBlogPosts);
  // Academy Courses state
  const [academyCoursesData, setAcademyCoursesData] = useState(initialAcademyCourses);
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
  
  
  return {
    isLeadPopupOpen, setIsLeadPopupOpen,
    isExitIntentPopup, setIsExitIntentPopup,
    settingsData, setSettingsData,
    servicesData, setServicesData,
    teamMembersData, setTeamMembersData,
    testimonialsData, setTestimonialsData,
    blogsData, setBlogsData,
    academyCoursesData, setAcademyCoursesData,
    leadsData, setLeadsData,
    newsletterEmail, setNewsletterEmail,
    newsletterLoading, setNewsletterLoading,
    newsletterSubmitted, setNewsletterSubmitted,
    newsletterError, setNewsletterError,
    clientReports, setClientReports,
    authToken, setAuthToken,
    whyAgencySlide, setWhyAgencySlide,
    isScrolled, setIsScrolled,
    isMobileMenuOpen, setIsMobileMenuOpen,
    calculatorTab, setCalculatorTab,
    feeAdBudget, setFeeAdBudget,
    pricingModel, setPricingModel,
    targetRevenue, setTargetRevenue,
    selectedServices, setSelectedServices,
    googleSpend, setGoogleSpend,
    googleRoas, setGoogleRoas,
    metaSpend, setMetaSpend,
    metaRoas, setMetaRoas,
    ecomTraffic, setEcomTraffic,
    ecomAov, setEcomAov,
    ecomSpend, setEcomSpend,
    ecomRevenue, setEcomRevenue,
    b2bSpend, setB2bSpend,
    b2bLeads, setB2bLeads,
    b2bConversion, setB2bConversion,
    b2bLtv, setB2bLtv,
    budgetIndex, setBudgetIndex,
    reportFullName, setReportFullName,
    reportEmail, setReportEmail,
    reportWebsite, setReportWebsite,
    reportPhone, setReportPhone,
    proposalFullName, setProposalFullName,
    proposalEmail, setProposalEmail,
    proposalWebsite, setProposalWebsite,
    proposalPhone, setProposalPhone,
    isReportGenerated, setIsReportGenerated,
    reportLoading, setReportLoading,
    reportError, setReportError,
    isProposalGenerated, setIsProposalGenerated,
    proposalLoading, setProposalLoading,
    proposalError, setProposalError,
    ecomSector, setEcomSector, handleEcomSectorChange,
    b2bSector, setB2bSector, handleB2bSectorChange,
    seoData,
    handleNavClick, handleServiceClick, navigate
  };
};
