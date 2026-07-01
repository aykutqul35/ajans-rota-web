import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { SignedIn, SignedOut, SignIn, UserButton, useUser } from '@clerk/clerk-react';

export default function ClientTransparencyPageView({
  clientReports,
  setClientReports,
  onBack,
  onContactClick
}) {
  const { isSignedIn, user } = useUser();
  const [activeBrand, setActiveBrand] = useState(() => localStorage.getItem('local_client_brand') || 'ecommerce'); // ecommerce, b2b
  const [dateRange, setDateRange] = useState('30days'); // 7days, 30days, thismonth
  const [animTrigger, setAnimTrigger] = useState(false);

  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketDepartment, setNewTicketDepartment] = useState('Genel Destek');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);

  // Login States
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('local_client_logged_in') === 'true');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);

  // SaaS Features States
  const [aiRequestLoading, setAiRequestLoading] = useState(false);
  const [aiRequestSuccess, setAiRequestSuccess] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  
  // V2 Dashboard States
  const [activeTab, setActiveTab] = useState('overview');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [viewingTicket, setViewingTicket] = useState(null);
  const [clientReplyText, setClientReplyText] = useState('');

  // AI Simulator States
  const [simGoogleSpendSlider, setSimGoogleSpendSlider] = useState(null);
  const [simMetaSpendSlider, setSimMetaSpendSlider] = useState(null);
  const [aiInsightResult, setAiInsightResult] = useState('');
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);


  // Sync viewing ticket for realtime updates
  useEffect(() => {
    if (viewingTicket && clientReports && activeBrand) {
      const brandData = clientReports[activeBrand];
      if (brandData && brandData.tickets) {
        const updated = brandData.tickets.find(t => t.id === viewingTicket.id);
        if (updated && JSON.stringify(updated.messages) !== JSON.stringify(viewingTicket.messages)) {
          setViewingTicket({ ...updated });
        }
      }
    }
  }, [clientReports]);

  // Fetch Real Client Data from API
  useEffect(() => {
    if (isSignedIn && user?.id) {
      const fetchClientData = async () => {
        try {
          const res = await fetch('/api/client/me', {
            headers: {
              'x-clerk-id': user.id
            }
          });
          const data = await res.json();
          if (data.success && data.data) {
            // Map the API response back to the format the frontend expects, merging with defaults
            const mappedData = {
              ...(activeBrand === 'ecommerce' ? defaultEcommerceData : defaultB2bData),
              brandName: data.data.brandName,
              username: data.data.brandName,
              client_id: data.data.id,
              industry: "E-Ticaret", // Demo placeholder
              status: "Aktif Yönetim",
              budget: "Aylık 25,000₺ - 50,000₺",
              kpis: [
                { label: 'Toplam Harcama', value: (data.data.reports[0]?.spend || 0) + ' ₺', change: '+15%', icon: "fa-solid fa-wallet", color: "var(--primary)" },
                { label: 'Toplam Ciro', value: (data.data.reports[0]?.revenue || 0) + ' ₺', change: '+25%', icon: "fa-solid fa-turkish-lira-sign", color: "var(--secondary)" },
                { label: 'ROAS', value: ((data.data.reports[0]?.revenue / data.data.reports[0]?.spend) || 0).toFixed(2) + 'x', change: '+5%', icon: "fa-solid fa-arrow-trend-up", color: "#16a34a" }
              ],
              rawReports: data.data.reports
            };
            
            if (setClientReports) {
               setClientReports(prev => ({
                 ...prev,
                 [activeBrand]: { ...prev?.[activeBrand], ...mappedData }
               }));
            }
          }
        } catch (e) {
          console.error("Failed to fetch client data", e);
        }
      };
      
      fetchClientData();
      
      // Optional: Set up an interval to poll if needed, or rely on webhooks
      const interval = setInterval(fetchClientData, 10000);
      return () => clearInterval(interval);
    }
  }, [isSignedIn, user?.id, activeBrand, setClientReports]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'ajans_rota_db') {
        try {
          if (e.newValue) {
            const parsed = JSON.parse(e.newValue);
            if (parsed && parsed.clientReports) {
              setClientReports(parsed.clientReports);
            }
          }
        } catch(err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleGenerateAiInsight = async (actualSpend, simSpend, expectedRevenue, actualRevenue) => {
    setIsGeneratingInsight(true);
    setAiInsightResult('');
    
    try {
      const response = await fetch('/api/ai-strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          actualSpend,
          simSpend,
          expectedRevenue,
          actualRevenue
        })
      });

      if (!response.ok) {
        throw new Error('API Hatası');
      }
      
      const data = await response.json();
      if (data.success && data.content) {
        setAiInsightResult(data.content);
      } else {
        setAiInsightResult('AI sunucusundan yanıt alınamadı. Lütfen daha sonra tekrar deneyin.');
      }
    } catch (err) {
      console.error(err);
      setAiInsightResult('Bağlantı hatası oluştu. Yapay zeka modülü şu an meşgul olabilir.');
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  
  const handleAiActionRequest = async (insightText) => {
    setAiRequestLoading(true);
    try {
      const updated = { ...clientReports };
      if (!updated[activeBrand]) return;
      const now = new Date();
      const dateStr = now.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
      const requestId = Date.now();
      
      // Add to ai_requests (client panel display)
      if (!updated[activeBrand].ai_requests) updated[activeBrand].ai_requests = [];
      updated[activeBrand].ai_requests.push({
        id: requestId,
        date: dateStr,
        insight: insightText,
        status: 'pending'
      });
      
      // Add to tickets (admin panel TicketsTab)
      if (!updated[activeBrand].tickets) updated[activeBrand].tickets = [];
      updated[activeBrand].tickets.push({
        id: requestId,
        date: dateStr,
        subject: `AI Öneri Talebi: ${insightText}`,
        message: `Müşteri, yapay zeka önerisi doğrultusunda "${insightText}" talebinde bulundu.`,
        department: 'Yapay Zeka Önerileri',
        status: 'Açık',
        priority: 'medium',
        source: 'ai-recommendation'
      });
      
      setClientReports(updated);
      
      // Persist to localStorage (create entry if it doesn't exist)
      try {
        const localDbStr = localStorage.getItem('ajans_rota_db');
        const dbPayload = localDbStr ? JSON.parse(localDbStr) : {};
        dbPayload.clientReports = updated;
        localStorage.setItem('ajans_rota_db', JSON.stringify(dbPayload));
      } catch(e) {
        console.error('Failed to save to localStorage', e);
      }
      
      // Also save to dedicated ticket queue (guaranteed to work for admin panel)
      try {
        const existingQueue = JSON.parse(localStorage.getItem('client_ticket_queue') || '[]');
        existingQueue.push({
          id: requestId,
          date: dateStr,
          brandKey: activeBrand,
          brandName: updated[activeBrand]?.brandName || activeBrand,
          subject: `AI Öneri Talebi: ${insightText}`,
          message: `Müşteri, yapay zeka önerisi doğrultusunda "${insightText}" talebinde bulundu.`,
          department: 'Yapay Zeka Önerileri',
          status: 'Açık',
          priority: 'medium',
          source: 'ai-recommendation'
        });
        localStorage.setItem('client_ticket_queue', JSON.stringify(existingQueue));
      } catch(e) {}
      
      if (updated[activeBrand].client_id) {
        await fetch('/api/clients/update', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('client_token')}`
          },
          body: JSON.stringify({ 
            client_id: updated[activeBrand].client_id, 
            report_data: updated[activeBrand]
          })
        });
      }
      setAiRequestSuccess(true);
      setTimeout(() => setAiRequestSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setAiRequestLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true' || params.get('demo') === '1') {
      setShowDemoInfo(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setAnimTrigger(false);
      const timer = setTimeout(() => setAnimTrigger(true), 50);
      return () => clearTimeout(timer);
    }
  }, [activeBrand, dateRange, isLoggedIn]);

  const getKpiIcon = (brand, index) => {
    if (brand === 'ecommerce') {
      const icons = ["fa-solid fa-wallet", "fa-solid fa-cart-shopping", "fa-solid fa-arrow-trend-up", "fa-solid fa-turkish-lira-sign"];
      return icons[index] || "fa-solid fa-chart-line";
    } else {
      const icons = ["fa-solid fa-wallet", "fa-solid fa-id-card", "fa-solid fa-tags", "fa-solid fa-turkish-lira-sign"];
      return icons[index] || "fa-solid fa-chart-line";
    }
  };

  const getKpiColor = (index) => {
    const colors = ["var(--primary)", "var(--secondary)", "#16a34a", "var(--primary)"];
    return colors[index] || "var(--primary)";
  };

  // Mock data for E-Commerce (Ege Naturel Zeytinyağları)
  const defaultEcommerceData = {
    username: "ege",
    password: "ege123",
    brandName: "Ege Naturel Zeytinyağları A.Ş.",
    industry: "E-Ticaret / Gıda",
    kpis: [
      { label: "Harcanan Bütçe", value: "48.240 TL", change: "+12% geçen ay", icon: "fa-solid fa-wallet", color: "var(--primary)" },
      { label: "Toplam Satış (Adet)", value: "984 Adet", change: "+18% geçen ay", icon: "fa-solid fa-cart-shopping", color: "var(--secondary)" },
      { label: "ROAS (Ciro / Reklam)", value: "6,92x", change: "Hedef: 6,00x", icon: "fa-solid fa-arrow-trend-up", color: "#16a34a" },
      { label: "Toplam Elde Edilen Ciro", value: "333.820 TL", change: "+24% geçen ay", icon: "fa-solid fa-turkish-lira-sign", color: "var(--primary)" }
    ],
    googleAds: [
      { name: "PMax - Soğuk Sıkım Dönüşüm", spend: "14.250 TL", clicks: "4.820", ctr: "3,15%", conversions: "312", roas: "7,8x" },
      { name: "Search - Marka Kelimeleri", spend: "3.100 TL", clicks: "1.240", ctr: "15,40%", conversions: "145", roas: "12,4x" },
      { name: "Search - Sızma Zeytinyağı", spend: "8.650 TL", clicks: "2.150", ctr: "4,80%", conversions: "114", roas: "4,6x" }
    ],
    metaAds: [
      { name: "Katalog Satış - DPA", spend: "12.800 TL", clicks: "5.120", ctr: "2,10%", conversions: "264", roas: "7,2x", status: "Aktif" },
      { name: "Video - Urla Hasat Kreatif", spend: "6.400 TL", clicks: "2.880", ctr: "1,85%", conversions: "102", roas: "5,8x", status: "Aktif" },
      { name: "Görsel - Sağlık & Gurme Setleri", spend: "3.040 TL", clicks: "1.120", ctr: "1,45%", conversions: "47", roas: "4,1x", status: "Duraklatıldı" }
    ],
    seo: [
      { keyword: "soğuk sıkım zeytinyağı", rank: "1. Sıra", volume: "8.100", monthlyClicks: "2.450", trend: "up" },
      { keyword: "organik sızma zeytinyağı", rank: "2. Sıra", volume: "4.400", monthlyClicks: "980", trend: "stable" },
      { keyword: "ege naturel zeytinyağı", rank: "1. Sıra", volume: "1.200", monthlyClicks: "740", trend: "stable" },
      { keyword: "taş baskı zeytinyağı satın al", rank: "3. Sıra", volume: "2.900", monthlyClicks: "410", trend: "up" }
    ],
    timeline: [
      { date: "21 Haziran 2026", title: "Google Search Negatif Kelime Temizliği", desc: "\"ucuz zeytinyağı\", \"ücretsiz yağ\" gibi marka kalitesine uymayan 112 adet negatif kelime elendi. Bütçe verimliliği %9 artırıldı.", author: "Yiğit K. (SEO & Google Ads)" },
      { date: "18 Haziran 2026", title: "Meta Ads Urla Hasat Video Kreatif Testi", desc: "Urla bahçelerindeki hasat sürecini anlatan 2 yeni Reels dikey videosu yayına alındı. CTR ortalaması %1,2'den %1,85'e fırladı.", author: "Melis S. (Kreatif Direktör)" },
      { date: "15 Haziran 2026", title: "Checkout Funnel Hız Optimizasyonu", desc: "E-ticaret sitesinde ödeme adımındaki görseller sıkıştırıldı, gereksiz JS kütüphaneleri ertelendi. Sepetten dönme oranı %4 düşürüldü.", author: "Emre T. (Web Developer)" },
      { date: "12 Haziran 2026", title: "Haftalık Durum & ROAS Optimizasyon Toplantısı", desc: "Müşteri yönetim ekibiyle ROAS hedeflerinin 6,9x düzeyine ulaşması değerlendirildi. Gelecek haftanın bütçe dağılımı onaylandı.", author: "Selin Y. (Müşteri İlişkileri)" },
      { date: "08 Haziran 2026", title: "Google PMax Kampanyasında Bütçe Ölçekleme", desc: "Performansı yüksek seyreden Soğuk Sıkım PMax kampanyasının bütçesi ROI korunarak %15 oranında kontrollü şekilde artırıldı.", author: "Yiğit K. (SEO & Google Ads)" }
    ],
    creatives: [
      { id: 1, title: "Urla Hasat Instagram Reels", type: "video", url: "https://vimeo.com/76979871", status: "pending", date: "22 Haziran 2026", feedback: "" },
      { id: 2, title: "1 Alana 1 Bedava Post", type: "image", url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400", status: "approved", date: "15 Haziran 2026", feedback: "Logoyu biraz daha büyütelim." }
    ],
    files: [
      { id: 1, title: "Mayıs 2026 Performans Raporu", type: "pdf", url: "#", date: "01 Haziran 2026" },
      { id: 2, title: "Ajans Rota E-Fatura (Mayıs)", type: "invoice", url: "#", date: "03 Haziran 2026" }
    ],
    chartData: [
      { month: 'Oca', roas: 4.2, spend: 20000, revenue: 84000 },
      { month: 'Şub', roas: 4.5, spend: 25000, revenue: 112500 },
      { month: 'Mar', roas: 5.1, spend: 30000, revenue: 153000 },
      { month: 'Nis', roas: 5.8, spend: 35000, revenue: 203000 },
      { month: 'May', roas: 6.2, spend: 42000, revenue: 260400 },
      { month: 'Haz', roas: 6.9, spend: 48240, revenue: 333820 }
    ],
    aiSummary: "Sayın Ege Soğuk Sıkım Yönetimi, bu ayki reklam performansınızı inceledim. Meta reklamlarında başlattığımız yeni 'Katalog Satış' kampanyası ROAS oranını 7,2x seviyesine taşıyarak büyük başarı elde etti. Bütçenin bir kısmını bu kampanyaya kaydırmanızı öneririm.",
    apiSync: { googleAds: true, metaAds: true, lastSync: "Bugün 09:14" },
    teamManagers: [
      { name: "Yiğit K.", role: "Google Ads & SEO", avatar: "https://i.pravatar.cc/150?u=yigit", online: true },
      { name: "Melis S.", role: "Meta Ads & Kreatif", avatar: "https://i.pravatar.cc/150?u=melis", online: false },
      { name: "Selin Y.", role: "Müşteri Başarı Yöneticisi", avatar: "https://i.pravatar.cc/150?u=selin", online: true }
    ],
    nextMonthPlan: [
      { id: 1, task: "Yaz Kampanyası Kreatiflerinin Çıkılması", status: "İşlemde", date: "15 Temmuz", category: "Kreatif" },
      { id: 2, task: "Google PMax Kampanya Optimizasyonu", status: "Bekliyor", date: "22 Temmuz", category: "Ads" },
      { id: 3, task: "Rakip Analizi & SEO Kelime Stratejisi", status: "Planlandı", date: "28 Temmuz", category: "SEO" }
    ],
    tickets: [
      { id: "T-1024", subject: "Meta kampanya bütçe artırımı", status: "Açık", date: "Bugün 10:15", department: "Finans & Bütçe" },
      { id: "T-1018", subject: "Yeni ürün görselleri revizyonu", status: "Çözüldü", date: "Dün 14:30", department: "Kreatif" }
    ]
  };

  // Mock data for B2B (İzmir Liman Lojistik)
  const defaultB2bData = {
    username: "liman",
    password: "liman123",
    brandName: "İzmir Global Liman Hizmetleri A.Ş.",
    industry: "B2B / Lojistik & Gümrükleme",
    kpis: [
      { label: "Harcanan Bütçe", value: "31.500 TL", change: "+5% geçen ay", icon: "fa-solid fa-wallet", color: "var(--primary)" },
      { label: "Nitelikli Form (Lead)", value: "192 Form", change: "+22% geçen ay", icon: "fa-solid fa-id-card", color: "var(--secondary)" },
      { label: "Form Başı Maliyet (CPL)", value: "164,06 TL", change: "-14% geçen ay", icon: "fa-solid fa-tags", color: "#16a34a" },
      { label: "Tahmini Fırsat Değeri", value: "850.000 TL", change: "Dönüşüm Oranı: %12", icon: "fa-solid fa-turkish-lira-sign", color: "var(--primary)" }
    ],
    googleAds: [
      { name: "Search - Liman Depolama", spend: "12.800 TL", clicks: "1.150", ctr: "8,90%", conversions: "78", roas: "164 TL CPL" },
      { name: "Search - Gümrükleme Hizmetleri", spend: "11.200 TL", clicks: "940", ctr: "7,45%", conversions: "65", roas: "172 TL CPL" },
      { name: "Display - Yeniden Pazarlama", spend: "2.100 TL", clicks: "410", ctr: "1,15%", conversions: "14", roas: "150 TL CPL" }
    ],
    metaAds: [
      { name: "Lead Form - İthalatçılara Özel", spend: "3.400 TL", clicks: "480", ctr: "1,55%", conversions: "21", roas: "161 TL CPL", status: "Aktif" },
      { name: "Görsel - Antrepo & Depolama", spend: "2.000 TL", clicks: "290", ctr: "1,20%", conversions: "14", roas: "142 TL CPL", status: "Duraklatıldı" }
    ],
    seo: [
      { keyword: "izmir antrepo depolama", rank: "2. Sıra", volume: "1.800", monthlyClicks: "380", trend: "up" },
      { keyword: "izmir liman gümrükleme firmaları", rank: "1. Sıra", volume: "850", monthlyClicks: "290", trend: "stable" },
      { keyword: "uluslararası konteyner nakliye", rank: "4. Sıra", volume: "3.200", monthlyClicks: "170", trend: "up" },
      { keyword: "liman lojistik çözümleri", rank: "3. Sıra", volume: "600", monthlyClicks: "110", trend: "stable" }
    ],
    timeline: [
      { date: "20 Haziran 2026", title: "B2B Google Ads Arama Terimleri Filtrelemesi", desc: "Bireysel nakliye arayan \"evden eve nakliyat\" gibi 89 adet ilgisiz arama terimi elendi. Kurumsal leads kalitesi %30 artırıldı.", author: "Yiğit K. (SEO & Google Ads)" },
      { date: "16 Haziran 2026", title: "LinkedIn & Meta Lead Form Optimizasyonu", desc: "Form alanlarına \"Şirket Unvanı\" ve \"Yıllık Konteyner Hacmi\" soruları zorunlu olarak eklendi. Çöp form girdileri sıfırlandı.", author: "Melis S. (Kreatif Direktör)" },
      { date: "11 Haziran 2026", title: "Liman Depolama Görsel Testleri", desc: "Depoların güvenliğini ve büyüklüğünü gösteren yüksek kaliteli drone fotoğrafları reklam görselleriyle değiştirildi. CPL %15 düştü.", author: "Melis S. (Kreatif Direktör)" },
      { date: "06 Haziran 2026", title: "SEO: İçerik Optimizasyon Çalışması", desc: "\"İzmir Liman Lojistik Süreçleri\" rehber makalesi blogda yayınlandı ve hedeflenen 3 anahtar kelimede anında sıralama kazanıldı.", author: "Yiğit K. (SEO & Google Ads)" }
    ],
    creatives: [
      { id: 3, title: "Liman Tanıtım LinkedIn PDF", type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", status: "pending", date: "21 Haziran 2026", feedback: "" },
      { id: 4, title: "Gümrük Hizmetleri Carousel", type: "image", url: "https://images.unsplash.com/photo-1586528116311-ad8c7bd75a04?auto=format&fit=crop&q=80&w=400", status: "rejected", date: "10 Haziran 2026", feedback: "Renkler çok koyu olmuş." }
    ],
    files: [
      { id: 3, title: "Mayıs 2026 B2B Lead Raporu", type: "pdf", url: "#", date: "01 Haziran 2026" },
      { id: 4, title: "Ajans Rota E-Fatura (Mayıs)", type: "invoice", url: "#", date: "03 Haziran 2026" }
    ],
    chartData: [
      { month: 'Oca', cpl: 210, leads: 85, spend: 17850 },
      { month: 'Şub', cpl: 195, leads: 110, spend: 21450 },
      { month: 'Mar', cpl: 188, leads: 145, spend: 27260 },
      { month: 'Nis', cpl: 175, leads: 160, spend: 28000 },
      { month: 'May', cpl: 168, leads: 185, spend: 31080 },
      { month: 'Haz', cpl: 164, leads: 192, spend: 31500 }
    ],
    aiSummary: "Liman Lojistik Yönetimi, bu ay form başı maliyetlerimiz (CPL) 164 TL'ye düşerek yılın en verimli dönemine ulaştı. LinkedIn Lead Generation formlarındaki optimizasyonlar meyvesini verdi. Gelecek ay Google Arama Ağı bütçesini %15 artırmayı planlıyoruz.",
    apiSync: { googleAds: true, metaAds: false, lastSync: "Dün 18:30" },
    teamManagers: [
      { name: "Yiğit K.", role: "Google Ads & B2B SEO", avatar: "https://i.pravatar.cc/150?u=yigit", online: true },
      { name: "Selin Y.", role: "Kurumsal Hesap Yöneticisi", avatar: "https://i.pravatar.cc/150?u=selin", online: true }
    ],
    nextMonthPlan: [
      { id: 1, task: "LinkedIn Lead Form Genişletmesi", status: "İşlemde", date: "10 Temmuz", category: "Ads" },
      { id: 2, task: "Kurumsal Lojistik Makalesi Yayını", status: "Bekliyor", date: "18 Temmuz", category: "SEO" }
    ],
    tickets: [
      { id: "T-2041", subject: "Aylık Rapor Sunum Toplantısı", status: "Açık", date: "Bugün 09:00", department: "Hesap Yönetimi" }
    ]
  };

  const rawEcommerce = clientReports?.ecommerce || defaultEcommerceData;
  const rawB2b = clientReports?.b2b || defaultB2bData;

    const handleClientReplySubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!clientReplyText.trim() || !viewingTicket) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('tr-TR') + " " + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const replyMsg = {
      sender: 'client',
      text: clientReplyText.trim(),
      date: dateStr
    };

    // Update in clientReports state
    const updatedClientReports = { ...clientReports };
    const brandData = updatedClientReports[activeBrand];
    if (brandData?.tickets) {
      const ticketIdx = brandData.tickets.findIndex(t => t.id === viewingTicket.id);
      if (ticketIdx > -1) {
        const ticket = brandData.tickets[ticketIdx];
        if (!ticket.messages) {
          ticket.messages = [{ sender: 'client', text: ticket.message || 'Detaylı mesaj girilmemiş.', date: ticket.date }];
        }
        ticket.messages.push(replyMsg);
        ticket.status = 'Yanıt Bekliyor';
        if (setClientReports) setClientReports(updatedClientReports);
        
        // Save to ajans_rota_db
        try {
          const localDbStr = localStorage.getItem('ajans_rota_db');
          const dbPayload = localDbStr ? JSON.parse(localDbStr) : {};
          dbPayload.clientReports = updatedClientReports;
          localStorage.setItem('ajans_rota_db', JSON.stringify(dbPayload));
        } catch(e) {}

        // Push to Neon DB
        const token = localStorage.getItem('client_token');
        if (token && brandData.client_id) {
          fetch('/api/clients/update', {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ client_id: brandData.client_id, report_data: brandData })
          }).catch(e => console.error("Ticket reply sync error:", e));
        }

        setViewingTicket({ ...ticket });
      }
    }

    // CRITICAL: Also sync to client_ticket_queue (shared channel with admin)
    try {
      const raw = localStorage.getItem('client_ticket_queue');
      if (raw) {
        const queue = JSON.parse(raw);
        const found = queue.find(t => t.id === viewingTicket.id);
        if (found) {
          if (!found.messages) {
            found.messages = [{ sender: 'client', text: found.message || 'Detaylı mesaj girilmemiş.', date: found.date }];
          }
          found.messages.push(replyMsg);
          found.status = 'Yanıt Bekliyor';
          localStorage.setItem('client_ticket_queue', JSON.stringify(queue));
        }
      }
    } catch(err) {}

    setClientReplyText('');
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setIsSubmittingTicket(true);
    
    const newTicket = {
      id: "T-" + Math.floor(1000 + Math.random() * 9000),
      subject: newTicketSubject,
      department: newTicketDepartment,
      message: newTicketMessage,
      status: "Açık",
      date: new Date().toLocaleDateString('tr-TR') + " " + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    try {
      const currentReports = { ...clientReports };
      const brandData = { ...currentReports[activeBrand] };
      
      if (!brandData.tickets) brandData.tickets = [];
      brandData.tickets = [newTicket, ...brandData.tickets];
      
      currentReports[activeBrand] = brandData;
      
      window._clientLastWrite = Date.now();
      // Update global React state
      if (setClientReports) setClientReports(currentReports);
      
      // Trigger cross-tab sync
      localStorage.setItem('clientReports', JSON.stringify(currentReports));
      
      // Persist to main database so it survives refresh
      try {
        const localDbStr = localStorage.getItem('ajans_rota_db');
        if(localDbStr){
           const dbPayload = JSON.parse(localDbStr);
           dbPayload.clientReports = currentReports;
           localStorage.setItem('ajans_rota_db', JSON.stringify(dbPayload));
        } else {
           localStorage.setItem('ajans_rota_db', JSON.stringify({ clientReports: currentReports }));
        }
      } catch(e) {}
      
      // SYNC TO NEON DB SERVER
      const token = localStorage.getItem('client_token');
      if (token && brandData.client_id) {
         fetch('/api/clients/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ client_id: brandData.client_id, report_data: brandData })
         }).catch(e => console.error("Ticket sync error:", e));
      }
      
      // CRITICAL: Also write to shared ticket queue for admin panel
      try {
        const existingQueue = JSON.parse(localStorage.getItem('client_ticket_queue') || '[]');
        existingQueue.push({
          ...newTicket,
          brandKey: activeBrand,
          brandName: brandData.brandName || activeBrand,
          messages: [{ sender: 'client', text: newTicket.message, date: newTicket.date }],
          source: 'client-ticket'
        });
        localStorage.setItem('client_ticket_queue', JSON.stringify(existingQueue));
      } catch(e) {}
      
      setNewTicketSubject('');
      setNewTicketMessage('');
      setTicketSuccess(true);
    } catch (err) {
      console.error(err);
      toast.error('Talep oluşturulurken bir hata oluştu.');
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    const u = username.trim();
    const p = password.trim();

    try {
      const res = await fetch('/api/clients/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
      });
      
      const data = await res.json();
      
      if (data.success && data.token) {
        localStorage.setItem('client_token', data.token);
        const serverData = data.data.report_data || {};
        const key = serverData._key || (data.data.brand_name.toLowerCase().includes('e-ticaret') ? 'ecommerce' : 'b2b');
        
        const updatedReports = { ...clientReports };
        updatedReports[key] = {
          ...serverData,
          client_id: data.data.id,
          username: data.data.username,
          brandName: data.data.brand_name
        };
        
        if (setClientReports) setClientReports(updatedReports);
        localStorage.setItem('clientReports', JSON.stringify(updatedReports));
        
        setActiveBrand(key);
        setIsLoggedIn(true);
        localStorage.setItem('local_client_brand', key);
        localStorage.setItem('local_client_logged_in', 'true');
      } else {
        // Fallback to local auth if DB fails or isn't seeded yet
        const matchedBrandKey = Object.keys(clientReports || {}).find(key => {
          const report = clientReports[key];
          return report && report.username === u && report.password === p;
        });

        if (matchedBrandKey) {
          setActiveBrand(matchedBrandKey);
          setIsLoggedIn(true);
          localStorage.setItem('local_client_brand', matchedBrandKey);
          localStorage.setItem('local_client_logged_in', 'true');
        } else {
          const expectedEcomUser = rawEcommerce.username || 'ege';
          const expectedEcomPass = rawEcommerce.password || 'ege123';
          const expectedB2bUser = rawB2b.username || 'liman';
          const expectedB2bPass = rawB2b.password || 'liman123';

          if (u === expectedEcomUser && p === expectedEcomPass) {
            setActiveBrand('ecommerce');
            setIsLoggedIn(true);
            localStorage.setItem('local_client_brand', 'ecommerce');
            localStorage.setItem('local_client_logged_in', 'true');
          } else if (u === expectedB2bUser && p === expectedB2bPass) {
            setActiveBrand('b2b');
            setIsLoggedIn(true);
            localStorage.setItem('local_client_brand', 'b2b');
            localStorage.setItem('local_client_logged_in', 'true');
          } else {
            setLoginError('Hatalı kullanıcı adı veya şifre! Lütfen bilgilerinizi kontrol edin.');
          }
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      setLoginError('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('client_token');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setLoginError('');
  };

  const defaultDataForActive = activeBrand === 'ecommerce' ? defaultEcommerceData : defaultB2bData;
  const rawCurrentBrandData = clientReports?.[activeBrand] || defaultDataForActive;

  const currentData = {
    ...rawCurrentBrandData,
    kpis: (rawCurrentBrandData.kpis || []).map((k, i) => ({
      ...k,
      icon: k.icon || getKpiIcon(activeBrand, i),
      color: k.color || getKpiColor(i)
    })),
    googleAds: rawCurrentBrandData.googleAds || [],
    metaAds: rawCurrentBrandData.metaAds || [],
    seo: rawCurrentBrandData.seo || [],
    timeline: rawCurrentBrandData.timeline || [],
    creatives: rawCurrentBrandData.creatives || defaultDataForActive.creatives,
    files: rawCurrentBrandData.files || defaultDataForActive.files,
    chartData: rawCurrentBrandData.chartData || defaultDataForActive.chartData,
    aiSummary: rawCurrentBrandData.aiSummary || defaultDataForActive.aiSummary,
    apiSync: rawCurrentBrandData.apiSync || defaultDataForActive.apiSync,
    teamManagers: rawCurrentBrandData.teamManagers || defaultDataForActive.teamManagers,
    nextMonthPlan: rawCurrentBrandData.nextMonthPlan || defaultDataForActive.nextMonthPlan,
    tickets: rawCurrentBrandData.tickets || defaultDataForActive.tickets
  };

  const isEcommerceBrand = activeBrand === 'ecommerce' || currentData.industry?.toLowerCase().includes('e-ticaret') || currentData.industry?.toLowerCase().includes('gıda') || currentData.industry?.toLowerCase().includes('ecom');

  // Render Views
  return (
    <>
      <SignedOut>
      <div className="client-dashboard-page-wrapper" style={{ 
        minHeight: '100vh', 
        paddingTop: '120px', 
        paddingBottom: '4rem', 
        background: '#0f172a',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Background blobs for premium glassmorphism effect */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
          top: '20%',
          left: '15%',
          filter: 'blur(50px)',
          zIndex: 1,
          pointerEvents: 'none'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
          bottom: '15%',
          right: '15%',
          filter: 'blur(60px)',
          zIndex: 1,
          pointerEvents: 'none'
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '460px', margin: '0 auto', padding: '0 1rem' }}>
          {/* Back Button */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-start' }}>
            <button 
              onClick={onBack}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.6rem 1.2rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                border: '1px solid var(--glass-border)',
                background: '#1e293b',
                color: '#94a3b8',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                height: 'auto',
                width: 'auto'
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
              Anasayfaya Dön
            </button>
          </div>

          <div style={{
            background: 'rgba(30, 41, 59, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              marginBottom: '1.25rem',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.25)'
            }}>
              <i className="fa-solid fa-lock"></i>
            </div>

            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Rota Growth OS
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '2rem' }}>
              Reklam performansınızı ve operasyon süreçlerini canlı izlemek için firmanıza tanımlanan giriş bilgilerini kullanın.
            </p>

            {loginError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                padding: '0.75rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>{loginError}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <SignIn routing="hash" fallbackRedirectUrl="/musteri" />
            </div>

          </div>
        </div>
      </div>
      </SignedOut>

      {/* Dashboard view if authenticated */}
      <SignedIn>
    <div className="client-os-wrapper">
       <style>{`
          .client-os-wrapper {
             display: flex;
             height: 100vh;
             background: #0f172a;
             color: #e2e8f0;
             font-family: 'Inter', sans-serif;
             overflow: hidden;
          }
          .client-os-sidebar {
             width: 260px;
             background: #1e293b;
             border-right: 1px solid rgba(255,255,255,0.05);
             display: flex;
             flex-direction: column;
             padding: 1.5rem;
          }
          .client-os-logo {
             font-size: 1.25rem;
             font-weight: 800;
             color: #fff;
             margin-bottom: 2.5rem;
             display: flex;
             align-items: center;
             gap: 10px;
          }
          .client-os-logo span {
             background: linear-gradient(135deg, #0ea5e9, #3b82f6);
             -webkit-background-clip: text;
             -webkit-text-fill-color: transparent;
          }
          .client-os-nav-item {
             padding: 0.8rem 1rem;
             border-radius: 8px;
             color: #94a3b8;
             cursor: pointer;
             display: flex;
             align-items: center;
             gap: 12px;
             margin-bottom: 0.5rem;
             font-size: 0.95rem;
             font-weight: 600;
             transition: all 0.2s;
          }
          .client-os-nav-item:hover {
             background: rgba(255,255,255,0.05);
             color: #fff;
          }
          .client-os-nav-item.active {
             background: rgba(14, 165, 233, 0.1);
             color: #0ea5e9;
          }
          .client-os-main {
             flex: 1;
             display: flex;
             flex-direction: column;
             overflow-y: auto;
          }
          .client-os-topbar {
             height: 70px;
             border-bottom: 1px solid rgba(255,255,255,0.05);
             display: flex;
             justify-content: space-between;
             align-items: center;
             padding: 0 2rem;
             background: rgba(15, 23, 42, 0.8);
             backdrop-filter: blur(10px);
             position: sticky;
             top: 0;
             z-index: 10;
          }
          .client-os-content {
             padding: 2rem;
             max-width: 1200px;
             margin: 0 auto;
             width: 100%;
          }
          
          /* Override hardcoded light mode styles */
          .client-os-content *[style*="background-color: #fff"],
          .client-os-content *[style*="backgroundColor: '#1e293b'"],
          .client-os-content *[style*="background: '#1e293b'"] {
             background-color: #1e293b !important;
             background: #1e293b !important;
             border-color: rgba(255,255,255,0.1) !important;
             box-shadow: 0 4px 20px rgba(0,0,0,0.2) !important;
          }
          .client-os-content *[style*="color: '#f8fafc'"] {
             color: #f1f5f9 !important;
          }
          .client-os-content *[style*="color: '#94a3b8'"],
          .client-os-content *[style*="color: '#64748b'"] {
             color: #94a3b8 !important;
          }
       `}</style>

       {/* SIDEBAR */}
       <div className="client-os-sidebar">
          <div className="client-os-logo">
             <i className="fa-solid fa-bolt" style={{color: '#0ea5e9'}}></i> <span>Rota Growth OS</span>
          </div>
          <div className={`client-os-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
             <i className="fa-solid fa-chart-pie"></i> Genel Bakış & Grafikler
          </div>
          <div className={`client-os-nav-item ${activeTab === 'ai_simulator' ? 'active' : ''}`} onClick={() => setActiveTab('ai_simulator')}>
             <i className="fa-solid fa-brain" style={{ color: activeTab === 'ai_simulator' ? '#fff' : '#c084fc' }}></i> AI Büyüme Simülasyonu
          </div>
          <div className={`client-os-nav-item ${activeTab === 'vault' ? 'active' : ''}`} onClick={() => setActiveTab('vault')}>
             <i className="fa-solid fa-vault"></i> Dosya Kasam
          </div>
          <div className={`client-os-nav-item ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveTab('billing')}>
             <i className="fa-solid fa-file-invoice-dollar"></i> Faturalar & Bütçe
          </div>
          <div className={`client-os-nav-item ${activeTab === 'api' ? 'active' : ''}`} onClick={() => setActiveTab('api')}>
             <i className="fa-solid fa-plug"></i> API Entegrasyonları
          </div>
          <div className={`client-os-nav-item ${activeTab === 'strategy' ? 'active' : ''}`} onClick={() => setActiveTab('strategy')}>
             <i className="fa-solid fa-map"></i> Strateji & Yol Haritası
          </div>
          <div className={`client-os-nav-item ${activeTab === 'support' ? 'active' : ''}`} onClick={() => setActiveTab('support')}>
             <i className="fa-solid fa-headset"></i> Destek Talepleri
          </div>
          <div style={{marginTop: 'auto'}}></div>
          <div className="client-os-nav-item" onClick={() => {
              localStorage.removeItem('client_token');
              window.location.href = '/';
          }}>
             <i className="fa-solid fa-arrow-right-from-bracket"></i> Çıkış Yap
          </div>
       </div>

       {/* MAIN AREA */}
       <div className="client-os-main">
          {/* TOPBAR */}
          <div className="client-os-topbar">
             <div>
                <h2 style={{fontSize: '1.1rem', fontWeight: 700, margin: 0}}>{currentData.brandName}</h2>
                <span style={{fontSize: '0.8rem', color: '#94a3b8'}}>{currentData.industry}</span>
             </div>
             <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                <div style={{width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff'}}>
                   {currentData.brandName.substring(0, 2).toUpperCase()}
                </div>
             </div>
          </div>
          
          <div className="client-os-content">
        {/* Back Button (Gizlendi) */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-start' }}>
          <button 
            onClick={onBack}
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.6rem 1.2rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              border: '1px solid var(--glass-border)',
              background: '#1e293b',
              color: '#94a3b8',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              height: 'auto',
              width: 'auto'
            }}
          >
            <i className="fa-solid fa-arrow-left"></i>
            Anasayfaya Dön
          </button>
        </div>

        {/* Intro Header Removed for OS Layout */}

        {/* Dashboard Control Box */}
        <div className="client-dashboard-control-box" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          backgroundColor: '#1e293b',
          padding: '1.25rem',
          borderRadius: '16px',
          border: '1px solid rgba(15, 23, 42, 0.06)',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)',
          marginBottom: '2rem'
        }}>
          {/* Active Session Info & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-glow)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
              <i className="fa-solid fa-circle-check" style={{ color: 'var(--primary)', fontSize: '0.8rem' }}></i>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
                Oturum Aktif
              </span>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>

          {/* Date Picker & Brand Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'right', marginRight: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', display: 'inline-block', animation: 'ping 1.5s infinite' }}></span> Canlı Veri Aktif
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Son Güncelleme: Bugün 17:45
              </span>
            </div>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(15, 23, 42, 0.12)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#94a3b8',
                background: '#1e293b',
                cursor: 'pointer'
              }}
            >
              <option value="30days">Son 30 Gün</option>
              <option value="7days">Son 7 Gün</option>
              <option value="thismonth">Bu Ay</option>
            </select>
          </div>
        </div>

        {/* V2 Dashboard Tabs Navigation */}
        <div className="v2-dashboard-tabs" style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          borderBottom: '2px solid rgba(15, 23, 42, 0.05)',
          marginBottom: '2rem',
          paddingBottom: '0.5rem'
        }}>
          {[
            { id: 'overview', label: 'Genel Bakış & Grafikler', icon: 'fa-solid fa-chart-pie' },
            { id: 'ai_simulator', label: 'AI Büyüme Simülasyonu', icon: 'fa-solid fa-brain' },
            { id: 'vault', label: 'Dosya Kasam', icon: 'fa-solid fa-vault' },
            { id: 'billing', label: 'Faturalar & Bütçe', icon: 'fa-solid fa-file-invoice-dollar' },
            { id: 'api', label: 'API Entegrasyonları', icon: 'fa-solid fa-plug' },
            { id: 'strategy', label: 'Strateji & Yol Haritası', icon: 'fa-solid fa-map' },
            { id: 'support', label: 'Destek Talepleri', icon: 'fa-solid fa-headset' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: activeTab === tab.id ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === tab.id ? '#fff' : '#94a3b8',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(15, 23, 42, 0.1)' : 'none'
              }}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- TAB: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="tab-content-overview fade-in">
            {/* AI Summary Box */}
            {currentData.aiSummary && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', flexShrink: 0, boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
                }}>
                  <i className="fa-solid fa-robot"></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
                    Yapay Zeka Yönetici Özeti & Öneriler
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
                    {currentData.aiSummary}
                  </p>
                  
                  {/* AI Actionable Insight */}
                  <div style={{
                    background: '#1e293b',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.1)' }}></div>
                      <span style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>
                        {activeBrand === 'ecommerce' 
                          ? "CPL maliyetiniz düştü, yeni bir Reels kreatifi çekmenizi öneriyoruz." 
                          : "LinkedIn form optimizasyonu için bütçe artırımı tavsiye ediliyor."}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleAiActionRequest(activeBrand === 'ecommerce' ? "Yeni Reels Kreatif Çekimi" : "LinkedIn Bütçe Artırımı")}
                      disabled={aiRequestLoading || aiRequestSuccess}
                      style={{
                        padding: '0.5rem 1.25rem',
                        background: aiRequestSuccess ? '#10b981' : 'var(--text-dark)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: (aiRequestLoading || aiRequestSuccess) ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {aiRequestLoading ? (
                        <><i className="fa-solid fa-spinner fa-spin"></i> İletiliyor...</>
                      ) : aiRequestSuccess ? (
                        <><i className="fa-solid fa-check"></i> Talep Edildi</>
                      ) : (
                        <>Talep Et <i className="fa-solid fa-arrow-right"></i></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Show status of previous AI requests from queue */}
            {(() => {
              let queueItems = [];
              try {
                const raw = localStorage.getItem('client_ticket_queue');
                if (raw) {
                  queueItems = JSON.parse(raw).filter(t => t.brandKey === activeBrand && t.source === 'ai-recommendation');
                }
              } catch(e) {}
              if (queueItems.length === 0) return null;
              return (
                <div style={{ 
                  marginTop: '1rem', 
                  background: '#1e293b', 
                  borderRadius: '12px', 
                  padding: '1rem', 
                  border: '1px solid rgba(255,255,255,0.05)' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <i className="fa-solid fa-bell" style={{ color: '#f59e0b', fontSize: '0.85rem' }}></i>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Talep Durumlarınız</span>
                  </div>
                  {queueItems.map((item, idx) => {
                    const isResolved = item.status === 'Çözüldü';
                    const isInProgress = item.status === 'İşlemde';
                    return (
                      <div key={item.id || idx} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.75rem', 
                        borderRadius: '8px', 
                        background: isResolved ? 'rgba(16, 185, 129, 0.08)' : isInProgress ? 'rgba(245, 158, 11, 0.08)' : 'rgba(239, 68, 68, 0.05)',
                        border: `1px solid ${isResolved ? 'rgba(16, 185, 129, 0.2)' : isInProgress ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.1)'}`,
                        marginBottom: idx < queueItems.length - 1 ? '0.5rem' : 0 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1 }}>
                          <i className={isResolved ? 'fa-solid fa-circle-check' : isInProgress ? 'fa-solid fa-gear fa-spin' : 'fa-solid fa-clock'} 
                             style={{ color: isResolved ? '#10b981' : isInProgress ? '#f59e0b' : '#ef4444', fontSize: '0.9rem' }}></i>
                          <span style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 600 }}>{item.subject?.replace('AI Öneri Talebi: ', '')}</span>
                        </div>
                        <span style={{ 
                          padding: '3px 10px', 
                          borderRadius: '20px', 
                          fontSize: '0.7rem', 
                          fontWeight: 700,
                          background: isResolved ? 'rgba(16, 185, 129, 0.2)' : isInProgress ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.15)',
                          color: isResolved ? '#10b981' : isInProgress ? '#f59e0b' : '#ef4444',
                          whiteSpace: 'nowrap'
                        }}>
                          {isResolved ? '✓ Tamamlandı' : isInProgress ? '⏳ Ekibimiz İnceliyor' : '🕐 Yanıt Bekliyor'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            
            {/* Ekibim (Team Managers) */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-users" style={{ fontSize: '1rem' }}></i>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>Hesap Yöneticileriniz</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {(!currentData.teamManagers || currentData.teamManagers.length === 0) && (
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>Atanmış hesap yöneticisi bulunamadı.</div>
                )}
                {(currentData.teamManagers || []).map((member, idx) => (
                  <div key={idx} style={{ 
                    background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem', 
                    display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' 
                  }}>
                    <div style={{ position: 'relative' }}>
                      <img src={member.avatar} alt={member.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ 
                        position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderRadius: '50%', 
                        background: member.online ? '#10b981' : '#64748b', border: '2px solid #1e293b' 
                      }}></div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.1rem' }}>{member.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KPI Grid */}
            <div className={`client-kpi-grid ${animTrigger ? 'animate-kpis' : ''}`} style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem'
            }}>
              {currentData.kpis.map((kpi, idx) => (
                <div key={idx} className="client-kpi-card" style={{
                  backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '16px',
                  border: '1px solid rgba(15, 23, 42, 0.05)', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.015)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>{kpi.label}</span>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(15, 23, 42, 0.03)', color: kpi.color
                    }}>
                      <i className={kpi.icon}></i>
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.25rem' }}>{kpi.value}</h3>
                    <span style={{ fontSize: '0.75rem', color: kpi.change.includes('-') ? '#ef4444' : '#16a34a', fontWeight: 600 }}>
                      {kpi.change}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '3px', background: kpi.color, opacity: 0.8 }}></div>
                </div>
              ))}
            </div>

            {/* Interactive Charts (Recharts) */}
            {currentData.chartData && (
              <div style={{
                backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem',
                border: '1px solid rgba(15, 23, 42, 0.06)', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-chart-line" style={{ fontSize: '1rem' }}></i>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>6 Aylık Performans Trendi</h3>
                </div>
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentData.chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis yAxisId="right" orientation="right" stroke="#ec4899" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Line yAxisId="left" type="monotone" dataKey="spend" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Harcama (TL)" />
                      {activeBrand === 'ecommerce' ? (
                        <>
                          <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Ciro (TL)" />
                          <Line yAxisId="right" type="monotone" dataKey="roas" stroke="var(--secondary)" strokeWidth={3} dot={{ r: 4 }} name="ROAS (x)" />
                        </>
                      ) : (
                        <>
                          <Line yAxisId="left" type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Lead Sayısı" />
                          <Line yAxisId="right" type="monotone" dataKey="cpl" stroke="var(--secondary)" strokeWidth={3} dot={{ r: 4 }} name="CPL (TL)" />
                        </>
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Content Grid (Campaigns + Timeline) */}
            <div className="client-dashboard-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Google Ads Section */}
                <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(15, 23, 42, 0.06)', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.08)', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fa-brands fa-google" style={{ fontSize: '1rem' }}></i>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>Google Ads Performansı</h3>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.08)' }}>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Kampanya Adı</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Harcama</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textAlign: 'center' }}>Tıklama</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textAlign: 'right' }}>{activeBrand === 'ecommerce' ? 'ROAS' : 'CPL'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.googleAds.map((camp, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.04)' }}>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{camp.name}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>{camp.spend}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>{camp.clicks}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#16a34a', textAlign: 'right' }}>{camp.roas}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Meta Ads Section */}
                <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(15, 23, 42, 0.06)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fa-brands fa-meta" style={{ fontSize: '1rem' }}></i>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>Meta Ads Performansı</h3>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Kampanya Adı</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Harcama</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textAlign: 'center' }}>Tıklama</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textAlign: 'right' }}>{activeBrand === 'ecommerce' ? 'ROAS' : 'CPL'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.metaAds.map((camp, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{camp.name}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>{camp.spend}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>{camp.clicks}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#16a34a', textAlign: 'right' }}>{camp.roas}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SEO Section */}
                <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(15, 23, 42, 0.06)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '1rem' }}></i>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>SEO Kelime Sıralamaları</h3>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Anahtar Kelime</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Sıra</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textAlign: 'center' }}>Aylık Hacim</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textAlign: 'right' }}>Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.seo.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{item.keyword}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#0ea5e9' }}>{item.rank}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>{item.volume}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', textAlign: 'right', color: item.trend === 'up' ? '#16a34a' : '#94a3b8' }}>
                              <i className={`fa-solid fa-arrow-${item.trend === 'up' ? 'trend-up' : 'right'}`}></i>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>


                {/* Timeline Wrapper */}
                <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(15, 23, 42, 0.06)', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fa-solid fa-timeline" style={{ fontSize: '1rem' }}></i>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>Ajans İş Defteri (Timeline)</h3>
                  </div>
                  <div className="transparency-timeline" style={{ position: 'relative', paddingLeft: '1.25rem', borderLeft: '2px solid rgba(15, 23, 42, 0.06)' }}>
                    {currentData.timeline.map((act, idx) => (
                      <div key={idx} className="timeline-item" style={{ position: 'relative', marginBottom: idx === currentData.timeline.length - 1 ? 0 : '1.75rem' }}>
                        <div style={{ position: 'absolute', left: '-26px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', border: '3px solid #fff', boxShadow: '0 0 0 2px rgba(15, 23, 42, 0.08)' }}></div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.2rem' }}>{act.date}</div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.25rem', lineHeight: '1.3' }}>{act.title}</h4>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.4', marginBottom: '0.35rem' }}>{act.desc}</p>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <i className="fa-solid fa-user-tie" style={{ fontSize: '0.65rem' }}></i> Uzman: {act.author}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: AI SIMULATOR (Yapay Zeka Büyüme Simülatörü) --- */}
        {activeTab === 'ai_simulator' && (
          <div className="tab-content-ai fade-in">
            {(() => {
              const parseMoney = (str) => {
                if (!str) return 0;
                return parseInt(str.toString().replace(/[^\d]/g, ''), 10) || 0;
              };
              const parseConv = (str) => {
                if (!str) return 0;
                return parseInt(str.toString().replace(/[^\d]/g, ''), 10) || 0;
              };
              const parseRoas = (str) => {
                if (!str) return 0;
                return parseFloat(str.toString().replace(',', '.').replace(/[^\d.]/g, '')) || 0;
              };

              let actualGoogleSpend = 0, actualGoogleConv = 0, googleRevenue = 0;
              if (currentData.googleAds) {
                 currentData.googleAds.forEach(ad => {
                   const s = parseMoney(ad.spend);
                   const c = parseConv(ad.conversions);
                   const r = parseRoas(ad.roas);
                   actualGoogleSpend += s;
                   actualGoogleConv += c;
                   googleRevenue += (s * r);
                 });
              }
              if (actualGoogleSpend === 0) { actualGoogleSpend = 10000; actualGoogleConv = 150; googleRevenue = 50000; }

              let actualMetaSpend = 0, actualMetaConv = 0, metaRevenue = 0;
              if (currentData.metaAds) {
                 currentData.metaAds.forEach(ad => {
                   const s = parseMoney(ad.spend);
                   const c = parseConv(ad.conversions);
                   const r = parseRoas(ad.roas);
                   actualMetaSpend += s;
                   actualMetaConv += c;
                   metaRevenue += (s * r);
                 });
              }
              if (actualMetaSpend === 0) { actualMetaSpend = 10000; actualMetaConv = 150; metaRevenue = 50000; }

              const currentGoogleAOV = actualGoogleConv > 0 ? googleRevenue / actualGoogleConv : 0;
              const currentMetaAOV = actualMetaConv > 0 ? metaRevenue / actualMetaConv : 0;
              
              const currentGoogleCAC = actualGoogleConv > 0 ? actualGoogleSpend / actualGoogleConv : 0;
              const currentMetaCAC = actualMetaConv > 0 ? actualMetaSpend / actualMetaConv : 0;

              const currentGoogleROI = actualGoogleSpend > 0 ? (((googleRevenue - actualGoogleSpend) / actualGoogleSpend) * 100) : 0;
              const currentMetaROI = actualMetaSpend > 0 ? (((metaRevenue - actualMetaSpend) / actualMetaSpend) * 100) : 0;

              const simGoogleSpend = simGoogleSpendSlider !== null ? simGoogleSpendSlider : actualGoogleSpend;
              const simMetaSpend = simMetaSpendSlider !== null ? simMetaSpendSlider : actualMetaSpend;

              const ratioGoogle = actualGoogleSpend > 0 ? (simGoogleSpend / actualGoogleSpend) : 1;
              const projectedGoogleConv = Math.round(actualGoogleConv * Math.pow(ratioGoogle, 0.85));
              const projectedGoogleRev = projectedGoogleConv * currentGoogleAOV;
              const projectedGoogleCAC = projectedGoogleConv > 0 ? simGoogleSpend / projectedGoogleConv : 0;

              const ratioMeta = actualMetaSpend > 0 ? (simMetaSpend / actualMetaSpend) : 1;
              const projectedMetaConv = Math.round(actualMetaConv * Math.pow(ratioMeta, 0.85));
              const projectedMetaRev = projectedMetaConv * currentMetaAOV;
              const projectedMetaCAC = projectedMetaConv > 0 ? simMetaSpend / projectedMetaConv : 0;

              const projectedGoogleROAS = simGoogleSpend > 0 ? (projectedGoogleRev / simGoogleSpend) : 0;
              const projectedGoogleROI = simGoogleSpend > 0 ? (((projectedGoogleRev - simGoogleSpend) / simGoogleSpend) * 100) : 0;
              const projectedMetaROAS = simMetaSpend > 0 ? (projectedMetaRev / simMetaSpend) : 0;
              const projectedMetaROI = simMetaSpend > 0 ? (((projectedMetaRev - simMetaSpend) / simMetaSpend) * 100) : 0;

              return (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                  
                  {/* Başlık ve Vizyon */}
                  <div style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(139, 92, 246, 0.1))', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <i className="fa-solid fa-brain" style={{ color: '#c084fc' }}></i> Çoklu Platform AI Simülatörü
                    </h2>
                    <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                      Google Ads ve Meta Ads bütçelerini <strong>ayrı ayrı simüle ederek</strong> hangi platformun marjinal getirisinin daha yüksek olduğunu keşfedin. Azalan verim kanunlarına (Diminishing Returns) göre kârlılık optimizasyonu yapın. 
                      <br/><br/>
                      <strong style={{color: '#f8fafc'}}>Terimler:</strong><br/>
                      <strong>CAC (Müşteri Edinme Maliyeti):</strong> Yeni bir müşteri kazanmak için harcanan tutar. Düşük olması iyidir.<br/>
                      <strong>ROAS (Reklam Harcaması Getirisi):</strong> Reklama harcanan her 1 ₺ için elde edilen ciro. Yüksek olması iyidir.<br/>
                      <strong>ROI (Yatırım Getirisi):</strong> Harcamalar çıktıktan sonra kalan net kâr oranı.
                    </p>
                  </div>
                  
                  {/* Grid: Google vs Meta Simülasyon */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    
                    {/* Google Ads */}
                    <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(14, 165, 233, 0.3)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                      <h3 style={{ color: '#0ea5e9', fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fa-brands fa-google"></i> Google Ads Projeksiyonu
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                           <span style={{ color: '#cbd5e1' }}>Mevcut Bütçe:</span>
                           <strong style={{ color: '#94a3b8' }}>{actualGoogleSpend.toLocaleString('tr-TR')} ₺</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                           <span style={{ color: '#cbd5e1' }}>Mevcut CAC / ROAS / ROI:</span>
                           <strong style={{ color: '#94a3b8' }}>{Math.round(currentGoogleCAC).toLocaleString('tr-TR')} ₺ / {((googleRevenue / actualGoogleSpend) || 0).toFixed(2)}x / %{currentGoogleROI.toFixed(0)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginTop: '0.5rem' }}>
                           <span style={{ color: '#cbd5e1' }}>Yeni Bütçe:</span>
                           <strong style={{ color: '#0ea5e9' }}>{simGoogleSpend.toLocaleString('tr-TR')} ₺</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                           <span style={{ color: '#cbd5e1' }}>Beklenen Ciro:</span>
                           <strong style={{ color: '#22c55e' }}>{Math.round(projectedGoogleRev).toLocaleString('tr-TR')} ₺</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                           <span style={{ color: '#cbd5e1' }}>Yeni CAC:</span>
                           <strong style={{ color: projectedGoogleCAC > currentGoogleCAC ? '#eab308' : '#22c55e' }}>
                             {Math.round(projectedGoogleCAC).toLocaleString('tr-TR')} ₺
                           </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                           <span style={{ color: '#cbd5e1' }}>Yeni ROAS:</span>
                           <strong style={{ color: projectedGoogleROAS < ((googleRevenue / actualGoogleSpend) || 0) ? '#eab308' : '#22c55e' }}>
                             {projectedGoogleROAS.toFixed(2)}x
                           </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                           <span style={{ color: '#cbd5e1' }}>Yeni ROI:</span>
                           <strong style={{ color: projectedGoogleROI > 0 ? '#22c55e' : '#ef4444' }}>
                             %{projectedGoogleROI.toFixed(0)}
                           </strong>
                        </div>
                      </div>
                      <input 
                        type="range" 
                        min={Math.round(actualGoogleSpend * 0.5)} 
                        max={Math.round(actualGoogleSpend * 3)} 
                        step={500} 
                        value={simGoogleSpend}
                        onChange={(e) => setSimGoogleSpendSlider(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#0ea5e9', height: '6px', background: '#334155', borderRadius: '4px', outline: 'none', cursor: 'pointer' }}
                      />
                    </div>

                    {/* Meta Ads */}
                    <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.3)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                      <h3 style={{ color: '#c084fc', fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fa-brands fa-meta"></i> Meta Ads Projeksiyonu
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                           <span style={{ color: '#cbd5e1' }}>Mevcut Bütçe:</span>
                           <strong style={{ color: '#94a3b8' }}>{actualMetaSpend.toLocaleString('tr-TR')} ₺</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                           <span style={{ color: '#cbd5e1' }}>Mevcut CAC / ROAS / ROI:</span>
                           <strong style={{ color: '#94a3b8' }}>{Math.round(currentMetaCAC).toLocaleString('tr-TR')} ₺ / {((metaRevenue / actualMetaSpend) || 0).toFixed(2)}x / %{currentMetaROI.toFixed(0)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginTop: '0.5rem' }}>
                           <span style={{ color: '#cbd5e1' }}>Yeni Bütçe:</span>
                           <strong style={{ color: '#c084fc' }}>{simMetaSpend.toLocaleString('tr-TR')} ₺</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                           <span style={{ color: '#cbd5e1' }}>Beklenen Ciro:</span>
                           <strong style={{ color: '#22c55e' }}>{Math.round(projectedMetaRev).toLocaleString('tr-TR')} ₺</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                           <span style={{ color: '#cbd5e1' }}>Yeni CAC:</span>
                           <strong style={{ color: projectedMetaCAC > currentMetaCAC ? '#eab308' : '#22c55e' }}>
                             {Math.round(projectedMetaCAC).toLocaleString('tr-TR')} ₺
                           </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                           <span style={{ color: '#cbd5e1' }}>Yeni ROAS:</span>
                           <strong style={{ color: projectedMetaROAS < ((metaRevenue / actualMetaSpend) || 0) ? '#eab308' : '#22c55e' }}>
                             {projectedMetaROAS.toFixed(2)}x
                           </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                           <span style={{ color: '#cbd5e1' }}>Yeni ROI:</span>
                           <strong style={{ color: projectedMetaROI > 0 ? '#22c55e' : '#ef4444' }}>
                             %{projectedMetaROI.toFixed(0)}
                           </strong>
                        </div>
                      </div>
                      <input 
                        type="range" 
                        min={Math.round(actualMetaSpend * 0.5)} 
                        max={Math.round(actualMetaSpend * 3)} 
                        step={500} 
                        value={simMetaSpend}
                        onChange={(e) => setSimMetaSpendSlider(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#c084fc', height: '6px', background: '#334155', borderRadius: '4px', outline: 'none', cursor: 'pointer' }}
                      />
                    </div>

                  </div>

                  {/* Grok AI İçgörü Kutusu */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {aiInsightResult ? (
                      <div style={{ width: '100%', maxWidth: '800px', padding: '1.5rem', background: 'rgba(139, 92, 246, 0.1)', borderLeft: '4px solid #c084fc', borderRadius: '8px' }}>
                        <h4 style={{ color: '#c084fc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <i className="fa-solid fa-robot"></i> Rota AI Çoklu Platform Stratejisi
                        </h4>
                        <p style={{ color: '#e2e8f0', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 }}>
                          {aiInsightResult.replace(/<[^>]+>/g, '')}
                        </p>
                      </div>
                    ) : (
                      <>
                        <i className="fa-solid fa-microchip" style={{ fontSize: '2.5rem', color: '#475569', marginBottom: '1rem' }}></i>
                        <p style={{ color: '#94a3b8', marginBottom: '1.5rem', textAlign: 'center', maxWidth: '500px' }}>
                          Yaptığınız bütçe değişikliklerini (Google ve Meta) karşılaştırmalı olarak analiz etmek ve en kârlı stratejiyi belirlemek için tıklayın.
                        </p>
                      </>
                    )}
                    
                    <button 
                      onClick={() => handleGenerateAiInsight(
                        { google: actualGoogleSpend, meta: actualMetaSpend }, 
                        { google: simGoogleSpend, meta: simMetaSpend },
                        { google: projectedGoogleRev, meta: projectedMetaRev },
                        { google: googleRevenue, meta: metaRevenue }
                      )}
                      disabled={isGeneratingInsight}
                      style={{ 
                        padding: '0.85rem 2rem', 
                        borderRadius: '12px', 
                        border: 'none', 
                        background: 'linear-gradient(135deg, #c084fc, #9333ea)', 
                        color: '#fff', 
                        fontWeight: 700, 
                        fontSize: '1rem', 
                        cursor: isGeneratingInsight ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.2s',
                        marginTop: aiInsightResult ? '1.5rem' : '0'
                      }}
                    >
                      {isGeneratingInsight ? (
                        <><i className="fa-solid fa-spinner fa-spin"></i> AI Karşılaştırmalı Analiz Ediyor...</>
                      ) : (
                        <><i className="fa-solid fa-wand-magic-sparkles"></i> Rota AI Stratejisi İste</>
                      )}
                    </button>
                  </div>

                </div>
              );
            })()}
          </div>
        )}

        {/* --- TAB: CREATIVES (Kreatif Onayları) --- */}

        {/* --- TAB: VAULT (Dosya Kasam) --- */}
        {activeTab === 'vault' && (
          <div className="tab-content-vault fade-in">
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(15, 23, 42, 0.06)', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-vault" style={{ fontSize: '1rem' }}></i>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>Güvenli Dosya Kasası</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {currentData.files?.map(file => (
                  <div key={file.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '12px', transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: file.type === 'pdf' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(14, 165, 233, 0.1)', color: file.type === 'pdf' ? '#ef4444' : '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        <i className={file.type === 'pdf' ? "fa-solid fa-file-pdf" : "fa-solid fa-file-invoice"}></i>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>{file.title}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{file.date}</span>
                      </div>
                    </div>
                    <a href={file.url} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px', textDecoration: 'none' }}>
                      <i className="fa-solid fa-download"></i> İndir
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: API (API Entegrasyonları) --- */}
        {activeTab === 'billing' && (
          <div className="tab-content-billing fade-in">
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-file-invoice-dollar" style={{ fontSize: '1rem' }}></i>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>Faturalar & Bütçe</h3>
              </div>
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                <i className="fa-solid fa-receipt" style={{ fontSize: '3rem', opacity: 0.5, marginBottom: '1rem' }}></i>
                <p>Faturalarınız ve bütçe raporlamalarınız yakında bu alanda görüntülenebilecektir.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="tab-content-api fade-in">
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(15, 23, 42, 0.06)', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)', maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', textAlign: 'center', marginBottom: '0.5rem' }}>Gerçek Zamanlı Veri Eşitleme</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', marginBottom: '2rem' }}>Mevcut API entegrasyon durumunuzu aşağıdan inceleyebilirsiniz.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {/* Google Ads API */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <i className="fa-brands fa-google" style={{ fontSize: '1.5rem', color: '#0ea5e9' }}></i>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>Google Ads API</h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Son senkronize: {currentData.apiSync?.lastSync}</span>
                    </div>
                  </div>
                  <div style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: currentData.apiSync?.googleAds ? '#dcfce7' : '#fef08a', color: currentData.apiSync?.googleAds ? '#16a34a' : '#b45309' }}>
                    {currentData.apiSync?.googleAds ? 'Bağlı' : 'Bağlantı Bekliyor'}
                  </div>
                </div>

                {/* Meta Ads API */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <i className="fa-brands fa-meta" style={{ fontSize: '1.5rem', color: '#ec4899' }}></i>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>Meta Marketing API</h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Son senkronize: {currentData.apiSync?.lastSync}</span>
                    </div>
                  </div>
                  <div style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: currentData.apiSync?.metaAds ? '#dcfce7' : '#fee2e2', color: currentData.apiSync?.metaAds ? '#16a34a' : '#ef4444' }}>
                    {currentData.apiSync?.metaAds ? 'Bağlı' : 'Kopuk'}
                  </div>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontWeight: 700 }} onClick={() => toast('Veriler API üzerinden eşitleniyor... (Demo)')}>
                <i className="fa-solid fa-rotate"></i> Şimdi Eşitle
              </button>
            </div>
          </div>
        )}

        {/* --- TAB: STRATEGY (Yol Haritası) --- */}
        {activeTab === 'strategy' && (
          <div className="tab-content-strategy fade-in">
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-map" style={{ fontSize: '1rem' }}></i>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>Gelecek Ay Planı & Yol Haritası</h3>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '2rem' }}>Önümüzdeki 30 gün içerisinde ekibimizin sizin için planladığı aksiyonlar.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {currentData.nextMonthPlan.map((plan) => (
                  <div key={plan.id} style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', 
                    background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: plan.status === 'İşlemde' ? 'rgba(14, 165, 233, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                        color: plan.status === 'İşlemde' ? '#0ea5e9' : '#94a3b8'
                      }}>
                        <i className={plan.status === 'İşlemde' ? "fa-solid fa-spinner fa-spin" : "fa-regular fa-circle"}></i>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>{plan.task}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{plan.category} - Hedef Tarih: {plan.date}</span>
                      </div>
                    </div>
                    <div style={{ 
                      padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, 
                      background: plan.status === 'İşlemde' ? 'rgba(14, 165, 233, 0.1)' : 'rgba(255,255,255,0.05)', 
                      color: plan.status === 'İşlemde' ? '#0ea5e9' : '#94a3b8' 
                    }}>
                      {plan.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: SUPPORT (Destek Talepleri) --- */}
        {activeTab === 'support' && (
          <div className="tab-content-support fade-in">
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              {!viewingTicket ? (
                <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-ticket" style={{ fontSize: '1rem' }}></i>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>Destek Talepleri (Tickets)</h3>
                </div>
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }} onClick={() => setShowTicketModal(true)}>
                  <i className="fa-solid fa-plus"></i> Yeni Talep
                </button>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Bilet ID</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Konu</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Departman</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Tarih</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textAlign: 'right' }}>Durum</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textAlign: 'right' }}>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // Merge tickets from currentData + localStorage queue for full picture
                      const reportTickets = (currentData.tickets || []).map(t => ({ ...t }));
                      let queueTickets = [];
                      try {
                        const raw = localStorage.getItem('client_ticket_queue');
                        if (raw) queueTickets = JSON.parse(raw);
                      } catch(e) {}
                      
                      // Use queue status as source of truth (admin updates this)
                      const queueMap = {};
                      queueTickets.forEach(qt => { queueMap[qt.id] = qt; });
                      
                      // Merge: update report ticket statuses from queue, add queue-only tickets
                      const mergedIds = new Set();
                      const merged = reportTickets.map(t => {
                        mergedIds.add(t.id);
                        if (queueMap[t.id]) {
                          return { ...t, status: queueMap[t.id].status }; // Admin status wins
                        }
                        return t;
                      });
                      // Add queue-only tickets
                      queueTickets.forEach(qt => {
                        if (!mergedIds.has(qt.id) && qt.brandKey === activeBrand) {
                          merged.push(qt);
                        }
                      });
                      
                      if (merged.length === 0) {
                        return (
                          <tr>
                            <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                              Henüz destek talebiniz bulunmuyor.
                            </td>
                          </tr>
                        );
                      }
                      
                      const getStatusStyle = (status) => {
                        if (status === 'Çözüldü') return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', icon: 'fa-solid fa-check-circle', label: 'Çözüldü ✓' };
                        if (status === 'İşlemde') return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', icon: 'fa-solid fa-spinner', label: 'İşlemde...' };
                        if (status === 'Açık') return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', icon: 'fa-solid fa-clock', label: 'Yanıt Bekliyor' };
                        // Legacy statuses
                        if (status === 'Müşteri Yanıtı Bekleniyor') return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', icon: 'fa-solid fa-exclamation', label: status };
                        if (status === 'Yanıt Bekliyor') return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', icon: 'fa-solid fa-clock', label: status };
                        return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', icon: 'fa-solid fa-check', label: status };
                      };
                      
                      return merged.map((ticket, idx) => {
                        const ss = getStatusStyle(ticket.status);
                        return (
                          <tr key={ticket.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', background: ticket.status === 'Çözüldü' ? 'rgba(16, 185, 129, 0.03)' : ticket.status === 'İşlemde' ? 'rgba(245, 158, 11, 0.03)' : 'transparent' }}>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#0ea5e9' }}>{ticket.id}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{ticket.subject}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>{ticket.department}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>{ticket.date}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', textAlign: 'right' }}>
                              <span style={{ 
                                padding: '4px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
                                background: ss.bg, color: ss.color, display: 'inline-flex', alignItems: 'center', gap: '4px'
                              }}>
                                <i className={ss.icon} style={{ fontSize: '0.65rem' }}></i> {ss.label}
                              </span>
                            </td>
                            <td style={{ padding: '0.9rem 0.5rem', textAlign: 'right' }}>
                              <button type="button" onClick={() => setViewingTicket(ticket)} style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                                <i className="fa-solid fa-eye"></i> İncele
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
              </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button onClick={() => setViewingTicket(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-arrow-left"></i> Geri Dön
                      </button>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>{viewingTicket.id}</h3>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{viewingTicket.subject} | {viewingTicket.department}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: '#0f172a', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                    {(() => {
                      // Read messages from localStorage queue (shared channel) as source of truth
                      let msgs = viewingTicket.messages;
                      try {
                        const raw = localStorage.getItem('client_ticket_queue');
                        if (raw) {
                          const queueItem = JSON.parse(raw).find(t => t.id === viewingTicket.id);
                          if (queueItem?.messages?.length) {
                            msgs = queueItem.messages;
                          }
                        }
                      } catch(e) {}
                      if (!msgs || msgs.length === 0) {
                        msgs = [{ sender: 'client', text: viewingTicket.message || 'Bu talep için detaylı mesaj girilmemiş.', date: viewingTicket.date }];
                      }
                      return msgs;
                    })().map((msg, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'client' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ 
                          maxWidth: '80%', 
                          padding: '0.8rem 1rem', 
                          borderRadius: msg.sender === 'client' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                          background: msg.sender === 'client' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                          color: msg.sender === 'client' ? '#fff' : '#f8fafc',
                          border: msg.sender === 'client' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                          fontSize: '0.9rem',
                          lineHeight: 1.5,
                          whiteSpace: 'pre-wrap'
                        }}>
                          {msg.text}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                          {msg.sender === 'client' ? 'Siz' : 'Yönetici'} • {msg.date}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text"
                      value={clientReplyText}
                      onChange={(e) => setClientReplyText(e.target.value)}
                      onKeyDown={(e) => { if(e.key === 'Enter') handleClientReplySubmit(e); }}
                      placeholder="Mesajınızı yazın..."
                      style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#f8fafc', outline: 'none', fontSize: '0.95rem' }}
                    />
                    <button onClick={handleClientReplySubmit} className="btn btn-primary" style={{ padding: '0 2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                      <i className="fa-solid fa-paper-plane"></i> Gönder
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}


        {/* Ticket Creation Modal */}
        {showTicketModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2rem',
              width: '100%',
              maxWidth: '500px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}>
              {ticketSuccess ? (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                    <i className="fa-solid fa-check" style={{ fontSize: '2.5rem', color: '#10b981' }}></i>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '1rem' }}>Talebiniz Alındı</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                    Talebiniz başarıyla ekibimize iletilmiştir. İlgili departman yöneticiniz konuyla ilgili en kısa sürede sizinle iletişime geçecektir.
                  </p>
                  <button 
                    onClick={() => { setShowTicketModal(false); setTicketSuccess(false); }}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', fontWeight: 600, background: '#0ea5e9', color: '#fff', border: 'none', cursor: 'pointer' }}
                  >
                    Tamam, Anladım
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>Yeni Talep Oluştur</h3>
                    <button type="button" onClick={() => setShowTicketModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}>
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                  <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#f8fafc', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.6rem' }}>Departman</label>
                  <div style={{ position: 'relative' }}>
                    <div 
                      onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                      style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#f8fafc', outline: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}
                    >
                      {newTicketDepartment}
                      <i className={`fa-solid fa-chevron-${isDeptDropdownOpen ? 'up' : 'down'}`} style={{ fontSize: '0.8rem', color: '#94a3b8' }}></i>
                    </div>
                    {isDeptDropdownOpen && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: '#c0c0c0', borderRadius: '8px', overflow: 'hidden', zIndex: 50, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                        {['Genel Destek', 'Reklam & Bütçe', 'Tasarım & Kreatif', 'Yazılım'].map((dept) => (
                          <div 
                            key={dept}
                            onClick={() => { setNewTicketDepartment(dept); setIsDeptDropdownOpen(false); }}
                            style={{ padding: '0.6rem 1rem', cursor: 'pointer', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', transition: 'background 0.2s' }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.1)'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                          >
                            <span style={{ width: '16px', display: 'inline-block' }}>
                              {newTicketDepartment === dept && <i className="fa-solid fa-check"></i>}
                            </span>
                            {dept}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#f8fafc', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.6rem' }}>Konu</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Talebinizin kısa özeti..."
                    value={newTicketSubject}
                    onChange={(e) => setNewTicketSubject(e.target.value)}
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#f8fafc', outline: 'none', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#f8fafc', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.6rem' }}>Mesajınız</label>
                  <textarea 
                    required 
                    rows="4" 
                    placeholder="Detaylı bilgi..."
                    value={newTicketMessage}
                    onChange={(e) => setNewTicketMessage(e.target.value)}
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#f8fafc', outline: 'none', resize: 'vertical', fontSize: '0.9rem' }}
                  ></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowTicketModal(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: '#f8fafc', cursor: 'pointer', fontWeight: 600 }}>
                    İptal
                  </button>
                  <button type="submit" disabled={isSubmittingTicket} style={{ padding: '0.75rem 2rem', borderRadius: '10px', border: 'none', background: '#0ea5e9', color: '#fff', cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 15px rgba(14, 165, 233, 0.2)' }}>
                    {isSubmittingTicket ? 'Gönderiliyor...' : 'Gönder'}
                  </button>
                </div>
              </form>
              </>
            )}
            </div>
          </div>
        )}


      </div>
    </div>
    </div>
    </SignedIn>
    </>
  );
}
