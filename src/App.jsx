import { Toaster } from 'react-hot-toast';
import { slugify, getCategoryLabel, getCategoryIcon, detectTrafficSource, getSmartGreeting, getSeoData, getAgencyStatus } from './utils/helpers';
import { useAppState } from './hooks/useAppState';
import { useCalculatorData } from './hooks/useCalculatorData';
import AppRoutes from './routes/AppRoutes';
import ReportForm from './components/forms/ReportForm';
import ContactForm from './components/forms/ContactForm';
import WebDesignForm from './components/forms/WebDesignForm';

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
import ScrollToTop from './components/ScrollToTop';
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




// Detects UTM/Traffic source from URL or referrer


// Admin Dashboard View Component

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const appState = useAppState(currentPath);
const {  isLeadPopupOpen, setIsLeadPopupOpen, isExitIntentPopup, setIsExitIntentPopup, settingsData, setSettingsData, servicesData, setServicesData, teamMembersData, setTeamMembersData, blogsData, setBlogsData, leadsData, setLeadsData, newsletterEmail, setNewsletterEmail, newsletterLoading, setNewsletterLoading, newsletterSubmitted, setNewsletterSubmitted, newsletterError, setNewsletterError, clientReports, setClientReports, authToken, setAuthToken, whyAgencySlide, setWhyAgencySlide, isScrolled, setIsScrolled, isMobileMenuOpen, setIsMobileMenuOpen, calculatorTab, setCalculatorTab, feeAdBudget, setFeeAdBudget, pricingModel, setPricingModel, targetRevenue, setTargetRevenue, selectedServices, setSelectedServices, googleSpend, setGoogleSpend, googleRoas, setGoogleRoas, metaSpend, setMetaSpend, metaRoas, setMetaRoas, ecomTraffic, setEcomTraffic, ecomAov, setEcomAov, ecomSpend, setEcomSpend, ecomRevenue, setEcomRevenue, b2bSpend, setB2bSpend, b2bLeads, setB2bLeads, b2bConversion, setB2bConversion, b2bLtv, setB2bLtv, budgetIndex, setBudgetIndex, reportFullName, setReportFullName, reportEmail, setReportEmail, reportWebsite, setReportWebsite, reportPhone, setReportPhone, proposalFullName, setProposalFullName, proposalEmail, setProposalEmail, proposalWebsite, setProposalWebsite, proposalPhone, setProposalPhone, isReportGenerated, setIsReportGenerated, reportLoading, setReportLoading, reportError, setReportError, isProposalGenerated, setIsProposalGenerated, proposalLoading, setProposalLoading, proposalError, setProposalError, ecomSector, setEcomSector, handleEcomSectorChange, b2bSector, setB2bSector, handleB2bSectorChange, handleNavClick, handleServiceClick, testimonialsData, seoData, setTestimonialsData } = appState;

  const isPageHidden = path => {
    if (!settingsData) return false;
    if (path === '/neden-izmir' && settingsData.hide_page_izmir) return true;
    if (path === '/referanslar' && settingsData.hide_page_referanslar) return true;
    if (path === '/iletisim' && settingsData.hide_page_iletisim) return true;
    if (path === '/hakkimizda' && settingsData.hide_page_hakkimizda) return true;
    if (path === '/hizmetler' && settingsData.hide_page_hizmetler) return true;
    return false;
  };const navigateTo = path => {
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
    
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return;

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
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return;
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
            const reports = { ...data.clientReports };
            // Ensure demo data is present if missing
            if (reports.ecommerce) {
              if (!reports.ecommerce.timeline || reports.ecommerce.timeline.length === 0) {
                reports.ecommerce.timeline = [{
                  date: "21 Haziran 2026", title: "Google Search Negatif Kelime Temizliği", desc: "\"ucuz zeytinyağı\", \"ücretsiz yağ\" gibi marka kalitesine uymayan 112 adet negatif kelime elendi. Bütçe verimliliği %9 artırıldı.", author: "Yiğit K. (SEO & Google Ads)"
                }, {
                  date: "18 Haziran 2026", title: "Meta Ads Urla Hasat Video Kreatif Testi", desc: "Urla bahçelerindeki hasat sürecini anlatan 2 yeni Reels dikey videosu yayına alındı. CTR ortalaması %1,2'den %1,85'e fırladı.", author: "Melis S. (Kreatif Direktör)"
                }];
              }
              if (!reports.ecommerce.nextMonthPlan || reports.ecommerce.nextMonthPlan.length === 0) {
                reports.ecommerce.nextMonthPlan = [
                  { id: 1, task: "Google Ads PMax Kampanyası Optimizasyonu", status: "Bekliyor", date: "2026-07-05", category: "Ads" },
                  { id: 2, task: "Yeni Ürün Lansmanı İçin Kreatif Hazırlığı", status: "İşlemde", date: "2026-07-10", category: "Tasarım" },
                  { id: 3, task: "SEO Blog İçerik Planlaması", status: "Tamamlandı", date: "2026-06-25", category: "SEO" }
                ];
              }
            }
            if (reports.b2b) {
              if (!reports.b2b.timeline || reports.b2b.timeline.length === 0) {
                reports.b2b.timeline = [{
                  date: "22 Haziran 2026", title: "LinkedIn B2B Kampanya Optimizasyonu", desc: "Lojistik sektörüne özel hedef kitle daraltması yapıldı. CPL maliyetleri %14 düşürüldü.", author: "Yiğit K. (SEO & Google Ads)"
                }, {
                  date: "19 Haziran 2026", title: "Yeni Antrepo Görselleri Yayına Alındı", desc: "Tesisin yeni yüksek çözünürlüklü fotoğrafları web sitesi ve Meta reklamlarına entegre edildi.", author: "Melis S. (Kreatif Direktör)"
                }];
              }
              if (!reports.b2b.nextMonthPlan || reports.b2b.nextMonthPlan.length === 0) {
                reports.b2b.nextMonthPlan = [
                  { id: 4, task: "LinkedIn Lead Gen Kampanyası Bütçe Artırımı", status: "Bekliyor", date: "2026-07-08", category: "Ads" },
                  { id: 5, task: "Lojistik Sektörü Rakip Analizi Raporu", status: "İşlemde", date: "2026-07-15", category: "Genel" }
                ];
              }
            }
            setClientReports(reports);
          }
        } catch (e) {
          console.error("Failed to parse localStorage db", e);
        }
      }
    };

    const fetchData = async () => {
      try {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          loadFromLocalStorage();
          return;
        }
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
    
    const loadClientsFromDB = async () => {
      if (!authToken) return; // Only fetch if we have an admin token
      if (window._adminHasUnsavedChanges) return; // DON'T overwrite while admin has unsaved typing!
      if (window._adminLastWrite && Date.now() - window._adminLastWrite < 5000) return;
      
      try {
        const res = await fetch('/api/admin/clients', {
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
            result.data.forEach(client => {
              let data = client.reportData || {};
              if (typeof data === 'string') {
                try { data = JSON.parse(data); } catch(e) { data = {}; }
              }
              const key = data._key || (client.email === 'ege@ajansrota.com' ? 'ecommerce' : (client.email === 'b2b@ajansrota.com' ? 'b2b' : (client.clerkId || client.id)));
              
              setClientReports(prev => {
                const merged = { ...prev };
                merged[key] = {
                  ...(merged[key] || {}), // Keep default UI structure (kpis, timeline etc)
                  ...data, // Overwrite with actual DB data if exists
                  client_id: client.id, 
                  clerkId: client.clerkId,
                  username: client.email,
                  brandName: client.brandName
                };
                return merged;
              });
            });
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
      Object.keys(servicesData || {}).forEach(key => {
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
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const leadPayload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      service: formData.service,
      message: formData.message,
      trafficSource: "Direct"
    };
    try {
      const response = await fetch("https://hook.eu2.make.com/6cffp8njv69q7p8a0x6y7vif99r98m8f", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload)
      });
      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ fullName: "", email: "", phone: "", company: "", service: "", message: "" });
        const storedLeads = JSON.parse(localStorage.getItem("rota_leads") || "[]");
        const newLead = {
          id: Date.now(),
          name: leadPayload.fullName,
          email: leadPayload.email,
          phone: leadPayload.phone,
          company: leadPayload.company || "-",
          service: leadPayload.service || "-",
          message: leadPayload.message || "-",
          date: new Date().toISOString(),
          status: "Yeni",
          source: leadPayload.trafficSource
        };
        localStorage.setItem("rota_leads", JSON.stringify([newLead, ...storedLeads]));
      }
    } catch (err) {
      console.error("Form error:", err);
    }
  };  const handleCalculatorNavClick = () => {
    setCalculatorTab('b2b');
    navigateTo('/');
    setTimeout(() => {
      const el = document.getElementById('calculator');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };  const [currentPage, setCurrentPage] = useState(1);
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
  const combinedStateForCalc = { ...appState, commitment, reportingPackage, smPackage, googleRevenue, metaRevenue };
  const calcData = useCalculatorData(combinedStateForCalc);
  const { activePricingModel, discountPercent, isSocialSelected, smPackagePrice, finalAgencyFee } = calcData;

  // Merge calcData into a unified props object so it can be passed to AppRoutes and forms
  const fullAppState = { ...appState, ...calcData, commitment, setCommitment, reportingPackage, setReportingPackage, smPackage, setSmPackage, webDesignType, setWebDesignType, webDesignFullName, setWebDesignFullName, webDesignEmail, setWebDesignEmail, webDesignPhone, setWebDesignPhone, webDesignMessage, setWebDesignMessage, webDesignLoading, setWebDesignLoading, webDesignSubmitted, setWebDesignSubmitted, formData, setFormData, isSubmitted, setIsSubmitted, handleWebDesignSubmit, handleContactSubmit, activeMobileDropdown, setActiveMobileDropdown };

const renderReportForm = () => <ReportForm {...fullAppState} handleGenerateReport={handleGenerateReport} />;
  const renderContactForm = () => <ContactForm formData={formData} setFormData={setFormData} isSubmitted={isSubmitted} handleContactSubmit={handleContactSubmit} servicesData={servicesData} />;
  const renderWebDesignForm = (isCombined = false) => <WebDesignForm {...fullAppState} isCombined={isCombined} handleWebDesignSubmit={handleWebDesignSubmit} webDesignType={webDesignType} setWebDesignType={setWebDesignType} webDesignSubmitted={webDesignSubmitted} setWebDesignSubmitted={setWebDesignSubmitted} />;

  const isSecurePanel = currentPath.startsWith('/rota-management-vault-x9') || currentPath.startsWith('/portal-girisi-x9') || currentPath.startsWith('/client-portal-secure') || currentPath.startsWith('/musteri');
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
        <AppRoutes {...fullAppState} renderReportForm={renderReportForm} renderContactForm={renderContactForm} renderWebDesignForm={renderWebDesignForm}  handleNavClick={handleNavClick} handleServiceClick={handleServiceClick} simulateLeadLocally={simulateLeadLocally} logHit={logHit} navigate={navigate} />
      </Suspense>

      {!isSecurePanel && (
      <Footer
        settingsData={settingsData}
        servicesData={servicesData}
        handleNavClick={handleNavClick}
        handleServiceClick={handleServiceClick}
        navigateTo={navigateTo}
        getAgencyStatus={() => getAgencyStatus(settingsData)}
        newsletterEmail={newsletterEmail}
        setNewsletterEmail={setNewsletterEmail}
        newsletterLoading={newsletterLoading}
        newsletterSubmitted={newsletterSubmitted}
        newsletterError={newsletterError}
        handleNewsletterSubmit={handleNewsletterSubmit}
      />
      )}
      {currentPath !== '/rota-management-vault-x9' && currentPath !== '/client-portal-secure' && currentPath !== '/musteri' && <Suspense fallback={null}><WhatsAppAssistantWidget settingsData={settingsData} onSaveLead={simulateLeadLocally} logHit={logHit} /></Suspense>}
      {currentPath !== '/rota-management-vault-x9' && currentPath !== '/client-portal-secure' && currentPath !== '/musteri' && <SocialProofToast />}
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
      {!isSecurePanel && <ScrollToTop />}
      {!isSecurePanel && <CookieConsent onNavigateToPolicy={() => navigateTo('/cerez-politikasi')} />}
    </>;
}
export default App;