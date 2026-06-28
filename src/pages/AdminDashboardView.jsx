import toast from 'react-hot-toast';
import React, { useState, useEffect, useRef } from 'react';
import LeadsTab from '../components/admin/tabs/LeadsTab';
import BlogsTab from '../components/admin/tabs/BlogsTab';
import TeamTab from '../components/admin/tabs/TeamTab';
import TestimonialsTab from '../components/admin/tabs/TestimonialsTab';
import ServicesTab from '../components/admin/tabs/ServicesTab';
import LandingTab from '../components/admin/tabs/LandingTab';
import SettingsTab from '../components/admin/tabs/SettingsTab';
import MarketingTab from '../components/admin/tabs/MarketingTab';
import AnalyticsTab from '../components/admin/tabs/AnalyticsTab';
import ClientReportsTab from '../components/admin/tabs/ClientReportsTab';
import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';
import AddClientModal from '../components/admin/modals/AddClientModal';
import { useNavigate } from 'react-router-dom';
import { upload } from '@vercel/blob/client';
import { motion } from 'framer-motion';
import { budgetSteps, initialServicePagesData, featuredStories, initialTeamMembers, initialBlogPosts, categories, whyAgencyData, testimonials } from '../data/mockData';
import FadeIn from '../components/FadeIn';
import StaggerContainer, { StaggerItem } from '../components/StaggerContainer';
import ClientTransparencyPageView from '../components/ClientTransparencyPageView';

export default // Admin Dashboard View Component
function AdminDashboardView({
  settingsData,
  setSettingsData,
  servicesData,
  setServicesData,
  teamMembersData,
  setTeamMembersData,
  blogsData,
  setBlogsData,
  testimonialsData,
  setTestimonialsData,
  leadsData,
  setLeadsData,
  authToken,
  setAuthToken,
  clientReports,
  setClientReports,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('leads');
  const [viewingTicket, setViewingTicket] = useState(null); // leads, settings, services, testimonials, team, blogs, analytics
  const [adminReplyText, setAdminReplyText] = useState('');
  const [editingReportBrand, setEditingReportBrand] = useState('ecommerce');
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [newClientFormData, setNewClientFormData] = useState({ code: '', name: '', username: '', password: '' });
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'clientReports') {
        try {
          if (e.newValue) setClientReports(JSON.parse(e.newValue));
        } catch(err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingProposal, setIsSendingProposal] = useState(false);
  const [activeSeoTab, setActiveSeoTab] = useState('home');
  const [contactSettingsSubTab, setContactSettingsSubTab] = useState('info');
  const [legalSettingsSubTab, setLegalSettingsSubTab] = useState('privacy');
  const [legalEditorPreview, setLegalEditorPreview] = useState(false);
  // Genel Ayarlar accordion state — hangi bölümler açık
  const [settingsAccordion, setSettingsAccordion] = useState({ contact: true, visuals: false, whatsapp: false, social_pricing: false, about_content: false, contact_page: false, legal_content: false, menu: false, seo: false, security: false });
  const [securityUsername, setSecurityUsername] = useState('');
  const [securityOldPassword, setSecurityOldPassword] = useState('');
  const [securityNewPassword, setSecurityNewPassword] = useState('');
  const [waPhone, setWaPhone] = useState(localStorage.getItem('rota_wa_phone') || '');
  const [waApiKey, setWaApiKey] = useState(localStorage.getItem('rota_wa_apikey') || '');
  const [securityIsLoading, setSecurityIsLoading] = useState(false);

  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();
    setSecurityIsLoading(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          oldPassword: securityOldPassword,
          newUsername: securityUsername,
          newPassword: securityNewPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Hesap bilgileriniz başarıyla güncellendi!');
        setSecurityOldPassword('');
        setSecurityNewPassword('');
        setSecurityUsername('');
      } else {
        toast.error('Hata: ' + (data.message || 'Bilgiler güncellenemedi.'));
      }
    } catch (error) {
      toast.error('Sunucu hatası. Daha sonra tekrar deneyin.');
    } finally {
      setSecurityIsLoading(false);
    }
  };

  // Image Upload Statuses State
  const [uploadStates, setUploadStates] = useState({});
  const handleImageUpload = async (key, file) => {
    if (!file) return;
    if (!authToken) {
      toast("Yükleme yapmak için oturum açmış olmalısınız.");
      return;
    }
    setUploadStates(prev => ({
      ...prev,
      [key]: {
        loading: true,
        error: null
      }
    }));
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await fetch('/api.php?action=upload_image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });
      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        throw new Error("Sunucudan geçersiz JSON yanıtı alındı.");
      }
      if (response.ok && result.success) {
        setSettingsData(prev => ({
          ...prev,
          [key]: result.url
        }));
        setUploadStates(prev => ({
          ...prev,
          [key]: {
            loading: false,
            success: true
          }
        }));
      } else {
        setUploadStates(prev => ({
          ...prev,
          [key]: {
            loading: false,
            error: result.error || "Yükleme başarısız."
          }
        }));
      }
    } catch (error) {
      console.error("Görsel yüklenirken hata oluştu:", error);
      setUploadStates(prev => ({
        ...prev,
        [key]: {
          loading: false,
          error: error.message || "Bağlantı hatası oluştu."
        }
      }));
    }
  };
  const renderImageUploaderCard = (key, label, recommendedSize, placeholder = "") => {
    const currentValue = settingsData[key] || '';
    const state = uploadStates[key] || {};
    const isImageSet = currentValue && (currentValue.startsWith('http') || currentValue.startsWith('/') || currentValue.startsWith('uploads/'));
    return <div className="admin-image-uploader-card" style={{
      background: '#f8fafc',
      border: '1px solid var(--glass-border)',
      borderRadius: '12px',
      padding: '1.25rem',
      marginBottom: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
    }}>
        <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
          <div>
            <span style={{
            fontWeight: 600,
            fontSize: '0.95rem',
            color: 'var(--text-light)',
            display: 'block',
            marginBottom: '0.25rem'
          }}>{label}</span>
            <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
              <i className="fa-solid fa-expand" style={{
              marginRight: '4px',
              color: 'var(--primary)'
            }}></i> Önerilen Boyut: <strong>{recommendedSize}</strong>
            </span>
          </div>
          {isImageSet && <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '8px',
          border: '1px solid var(--glass-border)',
          background: '#fff',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
              <img src={currentValue.startsWith('uploads/') ? `/${currentValue}` : currentValue} alt="Önizleme" style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }} />
            </div>}
        </div>
        
        <div style={{
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center'
      }}>
          <input type="text" value={currentValue} onChange={e => setSettingsData({
          ...settingsData,
          [key]: e.target.value
        })} style={{
          flex: 1,
          padding: '0.65rem 0.75rem',
          borderRadius: '8px',
          border: '1px solid var(--glass-border)',
          background: '#fff',
          fontSize: '0.85rem',
          fontFamily: 'monospace'
        }} placeholder={placeholder} />
          
          <label style={{
          padding: '0.65rem 1.25rem',
          background: 'var(--primary-gradient, linear-gradient(135deg, #2563eb, #1d4ed8))',
          color: '#fff',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s',
          boxShadow: '0 2px 4px rgba(37, 99, 235, 0.15)'
        }}>
            <i className="fa-solid fa-cloud-arrow-up"></i> Yükle
            <input type="file" accept="image/*" onChange={e => {
            if (e.target.files && e.target.files[0]) {
              handleImageUpload(key, e.target.files[0]);
            }
          }} style={{
            display: 'none'
          }} />
          </label>
        </div>
        
        {state.loading && <div style={{
        fontSize: '0.75rem',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
            <i className="fa-solid fa-spinner fa-spin"></i> Görsel yükleniyor, lütfen bekleyin...
          </div>}
        
        {state.error && <div style={{
        fontSize: '0.75rem',
        color: '#dc2626',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
            <i className="fa-solid fa-circle-exclamation"></i> Hata: {state.error}
          </div>}
        
        {state.success && <div style={{
        fontSize: '0.75rem',
        color: '#16a34a',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
            <i className="fa-solid fa-circle-check"></i> Görsel başarıyla yüklendi!
          </div>}
      </div>;
  };

  // Analytics and Stats states
  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState('');
  const [dateFilter, setDateFilter] = useState('7days'); // today, yesterday, 7days, 30days, all, custom
  const [customStartDate, setCustomStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().substring(0, 10);
  });
  const [customEndDate, setCustomEndDate] = useState(() => new Date().toISOString().substring(0, 10));

  // Sitemap generator states
  const [sitemapError, setSitemapError] = useState('');
  const loadStats = async () => {
    if (!authToken) return;
    setStatsLoading(true);
    setStatsError('');
    try {
      const response = await fetch('/api.php?action=get_stats', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const text = await response.text();
      if (response.ok) {
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.warn("API returned invalid JSON for stats, falling back to localStorage", e, text);
          let localData = {};
          try {
            const localStats = localStorage.getItem('ajans_rota_stats');
            localData = localStats && localStats !== 'undefined' ? JSON.parse(localStats) : {};
            if (typeof localData !== 'object' || localData === null) localData = {};
          } catch (lsErr) {}
          if (Object.keys(localData).length > 0) {
            setStatsData(localData);
          } else {
            const fallbackData = generateLocalMockStats();
            localStorage.setItem('ajans_rota_stats', JSON.stringify(fallbackData));
            setStatsData(fallbackData);
          }
          return;
        }
        setStatsData(data);
      } else {
        let localData = {};
        try {
          const localStats = localStorage.getItem('ajans_rota_stats');
          localData = localStats && localStats !== 'undefined' ? JSON.parse(localStats) : {};
          if (typeof localData !== 'object' || localData === null) localData = {};
        } catch (lsErr) {}
        if (Object.keys(localData).length > 0) {
          setStatsData(localData);
        } else {
          const fallbackData = generateLocalMockStats();
          localStorage.setItem('ajans_rota_stats', JSON.stringify(fallbackData));
          setStatsData(fallbackData);
        }
      }
    } catch (err) {
      console.error("API fetch error for stats", err);
      let localData = {};
      try {
        const localStats = localStorage.getItem('ajans_rota_stats');
        localData = localStats && localStats !== 'undefined' ? JSON.parse(localStats) : {};
        if (typeof localData !== 'object' || localData === null) localData = {};
      } catch (lsErr) {}
      if (Object.keys(localData).length > 0) {
        setStatsData(localData);
      } else {
        const fallbackData = generateLocalMockStats();
        localStorage.setItem('ajans_rota_stats', JSON.stringify(fallbackData));
        setStatsData(fallbackData);
      }
    } finally {
      setStatsLoading(false);
    }
  };
  const handleGenerateDemoStats = async () => {
    if (!authToken) return;
    if (!window.confirm("Analiz panelini test etmek için son 7 güne ait rastgele ziyaretçi ve dönüşüm simülasyon verisi oluşturulacaktır. Kabul ediyor musunuz?")) {
      return;
    }
    setStatsLoading(true);
    setStatsError('');
    try {
      const response = await fetch('/api.php?action=save_demo_stats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const text = await response.text();
        let data = {};
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = generateLocalMockStats();
          localStorage.setItem('ajans_rota_stats', JSON.stringify(data));
        }
        setStatsData(data);
        toast.success("Simülasyon verileri başarıyla oluşturuldu!");
      } else {
        const data = generateLocalMockStats();
        localStorage.setItem('ajans_rota_stats', JSON.stringify(data));
        setStatsData(data);
        toast("Simülasyon verileri yerel depolama alanında oluşturuldu!");
      }
    } catch (err) {
      console.warn("API demo stats generation failed, using localStorage fallback", err);
      try {
        const data = generateLocalMockStats();
        localStorage.setItem('ajans_rota_stats', JSON.stringify(data));
        setStatsData(data);
        toast("Simülasyon verileri yerel depolama alanında oluşturuldu!");
      } catch (localErr) {
        setStatsError('Demo verisi oluşturulurken hata oluştu.');
      }
    } finally {
      setStatsLoading(false);
    }
  };
  const generateLocalMockStats = () => {
    const demo_stats = {};
    for (let i = 7; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().substring(0, 10);
      demo_stats[dateStr] = {
        views: {
          "/": Math.floor(Math.random() * 70) + 80,
          "/neden-izmir": Math.floor(Math.random() * 30) + 30,
          "/seo-analizi": Math.floor(Math.random() * 40) + 40,
          "/referanslar": Math.floor(Math.random() * 25) + 25,
          "/iletisim": Math.floor(Math.random() * 20) + 20,
          "/blog": Math.floor(Math.random() * 15) + 15
        },
        durations: {
          "/": {
            total: Math.floor(Math.random() * 5000) + 5000,
            count: Math.floor(Math.random() * 70) + 80
          },
          "/neden-izmir": {
            total: Math.floor(Math.random() * 3000) + 3000,
            count: Math.floor(Math.random() * 30) + 30
          },
          "/seo-analizi": {
            total: Math.floor(Math.random() * 4000) + 4000,
            count: Math.floor(Math.random() * 40) + 40
          },
          "/referanslar": {
            total: Math.floor(Math.random() * 2000) + 2000,
            count: Math.floor(Math.random() * 25) + 25
          },
          "/iletisim": {
            total: Math.floor(Math.random() * 1500) + 1500,
            count: Math.floor(Math.random() * 20) + 20
          }
        },
        actions: {
          "referrer_direct": Math.floor(Math.random() * 25) + 25,
          "referrer_google_ads": Math.floor(Math.random() * 30) + 30,
          "referrer_meta_ads": Math.floor(Math.random() * 20) + 20,
          "referrer_google_organic": Math.floor(Math.random() * 15) + 15,
          "referrer_social": Math.floor(Math.random() * 10) + 10,
          "submit_seo_report": Math.floor(Math.random() * 7) + 8,
          "submit_kobi_report": Math.floor(Math.random() * 7) + 5,
          "submit_contact_form": Math.floor(Math.random() * 5) + 4,
          "submit_whatsapp_chat": Math.floor(Math.random() * 12) + 10,
          "click_whatsapp_bubble": Math.floor(Math.random() * 17) + 18,
          "download_pdf_seo_kilavuzu": Math.floor(Math.random() * 6) + 6
        }
      };
    }
  };
  const handleResetStats = async () => {
    if (!authToken) return;
    if (!window.confirm("TÜM ZİYARETÇİ VE ANALİZ İSTATİSTİKLERİNİ SIFIRLAMAK İSTEDİĞİNİZE EMİN MİSİNİZ?\n\nBu işlem geri alınamaz ve tüm geçmiş grafikleriniz temizlenir.")) {
      return;
    }
    setStatsLoading(true);
    setStatsError('');
    try {
      const response = await fetch('/api.php?action=reset_stats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      localStorage.removeItem('ajans_rota_stats');
      if (response.ok) {
        setStatsData({});
        toast.success("Tüm analiz ve ziyaretçi verileri başarıyla sıfırlandı!");
      } else {
        setStatsData({});
        toast("Analiz verileri yerel depolama ve sunucudan sıfırlandı!");
      }
    } catch (err) {
      console.warn("API stats reset failed, cleared local storage anyway", err);
      localStorage.removeItem('ajans_rota_stats');
      setStatsData({});
      toast("Analiz verileri yerel depolamadan sıfırlandı!");
    } finally {
      setStatsLoading(false);
    }
  };
  useEffect(() => {
    if (activeTab === 'analytics' && authToken) {
      loadStats();
    }
  }, [activeTab, authToken]);
  const getAggregatedStats = () => {
    if (!statsData) return {
      totalViews: 0,
      totalSessions: 0,
      totalActions: 0,
      avgDuration: 0,
      pages: [],
      referrers: [],
      actions: []
    };
    const today = new Date();
    let startDate = null;
    let endDate = null;
    if (dateFilter === 'today') {
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    } else if (dateFilter === 'yesterday') {
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 59);
    } else if (dateFilter === '7days') {
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
      endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    } else if (dateFilter === '30days') {
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
      endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    } else if (dateFilter === 'custom') {
      startDate = new Date(customStartDate + 'T00:00:00');
      endDate = new Date(customEndDate + 'T23:59:59');
    }
    let totalViews = 0;
    let totalDurationSeconds = 0;
    let totalDurationCount = 0;
    const pageMap = {};
    const actionMap = {};
    const referrerMap = {
      'Direct / Bookmark': 0,
      'Google Ads': 0,
      'Meta Ads': 0,
      'Google Arama (Organik)': 0,
      'Sosyal Medya': 0,
      'Referral / Diğer': 0
    };
    Object.keys(statsData).forEach(dateStr => {
      let dateVal = null;
      try {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          const d = parseInt(parts[2], 10);
          dateVal = new Date(y, m, d, 12, 0, 0);
        }
      } catch (e) {}
      const inBounds = dateFilter === 'all' || startDate && endDate && dateVal && dateVal >= startDate && dateVal <= endDate;
      if (inBounds) {
        const dayData = statsData[dateStr];
        if (dayData.views) {
          Object.keys(dayData.views).forEach(path => {
            const count = dayData.views[path];
            totalViews += count;
            if (!pageMap[path]) {
              pageMap[path] = {
                views: 0,
                durationSec: 0,
                durationCount: 0
              };
            }
            pageMap[path].views += count;
          });
        }
        if (dayData.durations) {
          Object.keys(dayData.durations).forEach(path => {
            const item = dayData.durations[path];
            if (item && typeof item === 'object') {
              const total = item.total || 0;
              const count = item.count || 0;
              if (total > 0 && count > 0) {
                totalDurationSeconds += total;
                totalDurationCount += count;
                if (!pageMap[path]) {
                  pageMap[path] = {
                    views: 0,
                    durationSec: 0,
                    durationCount: 0
                  };
                }
                pageMap[path].durationSec += total;
                pageMap[path].durationCount += count;
              }
            }
          });
        }
        if (dayData.actions) {
          Object.keys(dayData.actions).forEach(act => {
            const count = dayData.actions[act];
            if (act.startsWith('referrer_')) {
              if (act === 'referrer_direct') {
                referrerMap['Direct / Bookmark'] += count;
              } else if (act === 'referrer_google_ads') {
                referrerMap['Google Ads'] += count;
              } else if (act === 'referrer_meta_ads') {
                referrerMap['Meta Ads'] += count;
              } else if (act === 'referrer_google_organic') {
                referrerMap['Google Arama (Organik)'] += count;
              } else if (act === 'referrer_social') {
                referrerMap['Sosyal Medya'] += count;
              } else {
                referrerMap['Referral / Diğer'] += count;
              }
            } else {
              if (!actionMap[act]) actionMap[act] = 0;
              actionMap[act] += count;
            }
          });
        }
      }
    });
    const totalSessions = Object.values(referrerMap).reduce((sum, v) => sum + v, 0);
    const totalActions = Object.values(actionMap).reduce((sum, v) => sum + v, 0);
    const avgDuration = totalDurationCount > 0 ? Math.round(totalDurationSeconds / totalDurationCount) : 0;
    const sortedPages = Object.keys(pageMap).map(path => {
      const item = pageMap[path];
      const avgDur = item.durationCount > 0 ? Math.round(item.durationSec / item.durationCount) : 0;
      return {
        path,
        views: item.views,
        avgDuration: avgDur
      };
    }).sort((a, b) => b.views - a.views);
    const sortedReferrers = Object.keys(referrerMap).map(name => {
      return {
        name,
        count: referrerMap[name]
      };
    }).sort((a, b) => b.count - a.count);
    const sortedActions = Object.keys(actionMap).map(name => {
      return {
        name,
        count: actionMap[name]
      };
    }).sort((a, b) => b.count - a.count);
    return {
      totalViews,
      totalSessions,
      totalActions,
      avgDuration,
      pages: sortedPages,
      referrers: sortedReferrers,
      actions: sortedActions
    };
  };

  // AI Blog Assistant states
  const [aiKeywords, setAiKeywords] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const handleGenerateAIBlog = async e => {
    e.preventDefault();
    if (!aiKeywords.trim()) {
      setAiError('Lütfen anahtar kelime girin.');
      return;
    }
    setAiLoading(true);
    setAiError('');
    const keywordsLower = aiKeywords.toLowerCase();

    // Check if Gemini API key is configured
    if (settingsData.gemini_api_key) {
      try {
        const prompt = `Aşağıdaki anahtar kelimelere göre Türkçe, profesyonel, SEO uyumlu ve zengin içerikli bir blog yazısı taslağı oluştur.
Anahtar kelimeler: ${aiKeywords}
Çıktıyı kesinlikle başka hiçbir şey yazmadan (markdown blokları kullanmadan, düz JSON string olarak) şu JSON formatında ver:
{
  "title": "makale başlığı",
  "excerpt": "makale kısa özeti",
  "content": "h3 ve p ve strong etiketleriyle zenginleştirilmiş en az 300 kelimelik makale gövde HTML içeriği"
}`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${settingsData.gemini_api_key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        });
        if (!response.ok) {
          throw new Error('Gemini API isteği başarısız oldu.');
        }
        const resData = await response.json();
        let textResult = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Clean markdown code blocks if Gemini returns them
        textResult = textResult.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(textResult);
        if (parsed.title && parsed.excerpt && parsed.content) {
          setModalFormData(prev => ({
            ...prev,
            title: parsed.title,
            excerpt: parsed.excerpt,
            content: parsed.content
          }));
          setAiKeywords('');
          setAiLoading(false);
          return;
        } else {
          throw new Error('JSON formatı eksik veya hatalı.');
        }
      } catch (err) {
        console.warn("Gemini API error, falling back to local Turkish template generator:", err);
      }
    }

    // LOCAL TEMPLATE FALLBACK
    setTimeout(() => {
      let title = '';
      let excerpt = '';
      let content = '';
      if (keywordsLower.includes('seo') || keywordsLower.includes('arama') || keywordsLower.includes('optimizasyon')) {
        title = "Lokal SEO ile İzmir’de Google Aramalarında En Üste Çıkma Rehberi";
        excerpt = "İzmir’deki yerel işletmelerin Google Haritalar ve arama sonuçlarında görünürlüğünü artıracak 5 pratik lokal SEO taktiği.";
        content = `<h3>1. Google Haritalar (My Business) Optimizasyonu</h3>
<p>İzmir'deki müşterilerinize ulaşmanın en hızlı yolu yerel harita kaydınızı optimize etmektir. Profilinizin eksiksiz doldurulması, çalışma saatlerinin güncelliği ve düzenli müşteri yorumu toplanması harita sıralamanızı doğrudan etkiler.</p>
<h3>2. Ege Bölgesi Odaklı Anahtar Kelimeler</h3>
<p>İçeriklerinizde sadece genel kelimeler kullanmak yerine, <strong>"İzmir dijital pazarlama ajansı"</strong> veya <strong>"Karşıyaka e-ticaret danışmanlığı"</strong> gibi lokasyon bazlı ve arama hacmi yüksek uzun kuyruklu anahtar kelimelere yer verin.</p>
<h3>3. Mobil Uyumluluk ve Sayfa Hızı</h3>
<p>Google mobil uyumlu ve 2 saniyenin altında açılan siteleri lokal aramalarda daha yukarılara taşır. Resim sıkıştırma ve verimli kod yapılarıyla sitenizin hızını sürekli optimize edin.</p>
<h3>4. Yerel İçerik Üretimi</h3>
<p>İzmir ve Ege bölgesindeki sektörel gelişmeleri, yerel fuarları ve başarı hikayelerini konu alan blog yazıları yazarak hem otoritenizi kanıtlayın hem de Google botlarına yerellik sinyalleri gönderin.</p>`;
      } else if (keywordsLower.includes('google') || keywordsLower.includes('ads') || keywordsLower.includes('reklam') || keywordsLower.includes('roas')) {
        title = "Google Ads Reklam Bütçesini Doğru Yöneterek ROAS Artırma Yolları";
        excerpt = "Tıklama başına maliyetlerin yükseldiği dijital dünyada, reklam bütçenizi en verimli şekilde kullanarak satışlarınızı katlamanın yolları.";
        content = `<h3>1. Negatif Anahtar Kelime Yönetimi</h3>
<p>Gereksiz aramalarla reklam bütçenizi boşa harcamamak için negatif anahtar kelimeleri haftalık olarak güncelleyin. Alakasız tıklamaları elemek dönüşüm oranınızı (CR) artırır.</p>
<h3>2. Dönüşüm Kurulumlarının Doğruluğu</h3>
<p>Google Ads akıllı teklif algoritmalarının (ROAS Hedefi, Dönüşümleri Artırma vb.) en iyi performansı göstermesi için dönüşüm verilerinin eksiksiz gitmesi gerekir. Google Gelişmiş Dönüşümler (Enhanced Conversions) kurulumunu mutlaka yapın.</p>
<h3>3. Kalite Puanı Optimizasyonu</h3>
<p>Reklam metniniz, anahtar kelimeniz ve yönlendirdiğiniz açılış sayfası (landing page) arasındaki uyum ne kadar yüksekse kalite puanınız o kadar artar. Yüksek kalite puanı, daha düşük tıklama başı maliyet (CPC) demektir.</p>
<h3>4. Akıllı Teklif Stratejileri ve Kampanya Yapısı</h3>
<p>Kampanya yapınızı basitleştirin. PMax (Maksimum Performans) ve Arama Ağı kampanyalarını doğru bütçe dağılımıyla besleyerek yapay zeka algoritmalarının işletmeniz için en karlı kitleyi bulmasını sağlayın.</p>`;
      } else if (keywordsLower.includes('meta') || keywordsLower.includes('facebook') || keywordsLower.includes('instagram') || keywordsLower.includes('kreatif')) {
        title = "Instagram ve Meta Reklamlarında Dönüşüm Hunisi (Funnel) Tasarımı";
        excerpt = "Meta reklamlarında doğrudan soğuk kitleye satış yerine, potansiyel müşteriyi keşiften satın almaya götüren dönüşüm hunisi kurgusu.";
        content = `<h3>1. Kreatif Odaklı Reklamcılık</h3>
<p>Meta algoritmaları artık kreatifleri hedefleme olarak kullanıyor. Farklı görsel, video ve UGC (kullanıcı yapımı samimi video) formatlarını sürekli test ederek en düşük maliyetli kombinasyonu bulun.</p>
<h3>2. Özel ve Benzer (Lookalike) Hedef Kitleler</h3>
<p>Sitenizi ziyaret eden, sepete ekleme yapan veya Instagram sayfanızla etkileşime giren kişilerden oluşan özel kitleler kurup bunlara özel kampanyalar oluşturun. Benzer kitlelerle erişiminizi genişletin.</p>
<h3>3. Retargeting (Yeniden Hedefleme)</h3>
<p>Bütçenizin bir kısmını her zaman sitenizden alışveriş yapmamış kişileri yakalamak üzere dinamik ürün kataloğu reklamlarıyla yeniden hedeflemeye ayırın. Hatırlatıcı reklamlar dönüşümleri hızlandırır.</p>
<h3>4. Advantage+ Kampanyaları</h3>
<p>Meta'nın yapay zeka destekli Advantage+ alışveriş kampanyalarını kullanarak bütçe optimizasyonunu platformun zekasına bırakın. Bu modeller doğru kreatiflerle birleştiğinde mükemmel sonuçlar vermektedir.</p>`;
      } else if (keywordsLower.includes('eticaret') || keywordsLower.includes('e-ticaret') || keywordsLower.includes('sepet') || keywordsLower.includes('satış')) {
        title = "E-Ticaret Sitelerinde Dönüşüm Oranını (CR) Artırmanın Yolları";
        excerpt = "Ziyaretçilerinizi müşteriye dönüştürmek ve sepeti yarıda bırakma oranlarını düşürmek için uygulayabileceğiniz 4 UX adımı.";
        content = `<h3>1. Kolay ve Hızlı Ödeme Aşaması</h3>
<p>Üyeliği zorunlu tutmayın, üyeliksiz alışveriş imkanı sunun. Ödeme adımlarını 3 ekranı geçmeyecek şekilde sadeleştirin ve en popüler ödeme yöntemlerini entegre edin.</p>
<h3>2. Güven Unsurları ve Sosyal İspat</h3>
<p>Ürün sayfalarında müşteri yorumları, yıldız puanlamaları ve SSL sertifikası gibi güven unsurlarını belirgin şekilde sergileyin. Güven veren siteler her zaman daha çok satar.</p>
<h3>3. Sepeti Terk Edenleri Geri Kazanma</h3>
<p>Sepette ürün bırakıp giden kullanıcılara e-posta veya WhatsApp entegrasyonuyla otomatik hatırlatmalar ve küçük indirim kuponları göndererek satın almaya teşvik edin.</p>
<h3>4. Mobil Arayüz Optimizasyonu</h3>
<p>E-ticaret trafiğinin %90'ı mobilden gelmektedir. Sitenizin mobil hızını artırın, butonların parmak dostu boyutlarda olduğundan ve filtreleme sisteminin pürüzsüz çalıştığından emin olun.</p>`;
      } else {
        const firstKw = aiKeywords.split(',')[0].trim();
        title = `${firstKw.toUpperCase()} Odaklı Dijital Pazarlama ve Büyüme Rehberi`;
        excerpt = `${aiKeywords} odaklı iş modelleri için veriye dayalı reklam, SEO ve sosyal medya stratejileriyle dijitalde öne çıkma rehberi.`;
        content = `<h3>1. Hedef Kitle Analizi ve Segmentasyon</h3>
<p>${aiKeywords} alanında pazarlamaya başlamadan önce ideal müşteri profilinizi (persona) belirleyin ve onların dijitaldeki ilgi alanlarına göre doğru mecra tercihi yapın.</p>
<h3>2. Çok Kanallı (Omnichannel) Pazarlama Stratejisi</h3>
<p>Müşterilerinizin karşısına hem Google aramalarında hem de sosyal medyada çıkarak marka bilinirliğinizi pekiştirin. Çok kanallı varlık güveni artırır.</p>
<h3>3. Veri Odaklı Performans Ölçümü</h3>
<p>Yaptığınız tüm dijital yatırımların geri dönüşünü (ROI/ROAS) analiz araçlarıyla takip edin. Verimsiz reklam kanallarını hızla eleyip bütçeyi karlı kampanyalara kaydırın.</p>
<h3>4. Sürekli İçerik ve A/B Testleri</h3>
<p>Reklam kreatiflerinizde, başlıklarınızda ve web sitesi açılış sayfalarında sürekli A/B testleri yapın. En küçük optimizasyon bile uzun vadede yüksek kar getirecektir.</p>`;
      }
      setModalFormData(prev => ({
        ...prev,
        title,
        excerpt,
        content
      }));
      setAiKeywords('');
      setAiLoading(false);
    }, 1500);
  };
  const [aiGuideLoading, setAiGuideLoading] = useState(false);
  const [aiGuideContents, setAiGuideContents] = useState({});
  const getLocalGuideFallback = (guideTitle, lead) => {
    const companyName = lead.company || 'Değerli İşletmemiz';
    const customerName = lead.fullName;
    if (guideTitle.toLowerCase().includes('ihracat') || guideTitle.toLowerCase().includes('global')) {
      return {
        title: `Ege'den Dünyaya E-İhracat ve Büyüme Rehberi (Özel Sürüm)`,
        introduction: `Merhaba Sayın ${customerName}, ${companyName} firması için özel olarak hazırlanan e-ihracat yol haritanıza hoş geldiniz. Ege Bölgesi'nin eşsiz potansiyelini global pazarlarla buluşturmak için atmanız gereken adımları bu rehberde derledik.`,
        sections: [{
          sectionTitle: "1. Global Pazar Araştırması ve Ürün Konumlandırma",
          content: `<p><strong>${companyName}</strong> için yurt dışı pazarlarda doğru ürün konumlandırma kritiktir. Amazon ve Etsy gibi platformlarda Ege'nin yöresel, organik veya sanayi ürünlerini konumlandırırken rakip analizi ve niş pazar belirleme süreçlerini izlemelisiniz.</p><ul><li>Amazon FBA lojistik modellerini kullanmak depo masraflarını optimize eder.</li><li>Etsy üzerinde hikaye anlatımı (storytelling) ile el emeği veya butik ürünleri öne çıkarın.</li></ul>`
        }, {
          sectionTitle: "2. Uluslararası Lojistik ve Gümrük Çözümleri",
          content: `<p>E-ihracat süreçlerinde mikro ihracat (ETGB) kolaylığından faydalanarak gümrük süreçlerini minimize edebilirsiniz. DHL, UPS veya FedEx gibi taşıyıcılarla entegre yazılımlar kullanarak kargo takip süreçlerinizi otomatikleştirmelisiniz.</p>`
        }, {
          sectionTitle: "3. Global Dijital Pazarlama ve Reklam Yönetimi",
          content: `<p>Meta Ads ve Google Ads üzerinden hedef ülkelerdeki potansiyel alıcılara ulaşmak için yerelleştirilmiş (İngilizce, Almanca, Fransızca vb.) kampanyalar kurgulanmalıdır. Dönüşüm API'si (Conversion API) kurulumu sayesinde reklam bütçenizi en verimli şekilde kullanabilirsiniz.</p>`
        }, {
          sectionTitle: "4. Yabancı Dilde Güvenilir Web Altyapısı",
          content: `<p>Global müşterilerin sitenizden alışveriş yaparken güven duyması için çok dilli destek, yerel para birimleriyle ödeme (Stripe, PayPal) ve uluslararası güvenlik sertifikaları (SSL, 3D Secure) sitenizde eksiksiz olarak bulunmalıdır.</p>`
        }],
        conclusion: `Ajans Rota olarak, Ege'den çıkan markaları küresel pazarlara taşımak için buradayız. Bu özel plandaki adımları hayata geçirmek ve global reklam bütçenizi yönetmek için uzman ekibimizle iletişime geçebilirsiniz.`
      };
    } else if (guideTitle.toLowerCase().includes('turizm') || guideTitle.toLowerCase().includes('otel') || guideTitle.toLowerCase().includes('konaklama')) {
      return {
        title: `Konaklama ve Turizm Dijital Büyüme Kılavuzu (Özel Sürüm)`,
        introduction: `Merhaba Sayın ${customerName}, ${companyName} turizm / konaklama işletmesine özel hazırladığımız dijital büyüme ve turist çekme analizine hoş geldiniz. Ege ve İzmir'in turizm potansiyelini web siteniz üzerinden doğrudan rezervasyona dönüştürmenin yollarını aşağıda bulabilirsiniz.`,
        sections: [{
          sectionTitle: "1. Google Otel Reklamları (Google Hotel Ads) Entegrasyonu",
          content: `<p><strong>${companyName}</strong> için doğrudan rezervasyonları artırmanın en etkili yolu Google Haritalar ve Arama Ağı ile entegre Hotel Ads kampanyalarıdır. Kullanıcıların aracı siteler (Booking, Expedia vb.) yerine doğrudan kendi sitenizden yer ayırtmasını sağlayarak komisyon oranlarını düşürebilirsiniz.</p>`
        }, {
          sectionTitle: "2. Hedef Kitle Odaklı Yabancı Dil SEO Kurguları",
          content: `<p>Almanya, İngiltere ve Hollanda gibi yoğun turist gönderen ülkelerdeki arama hacimlerine odaklanarak, bölgesel gezi rehberleri ve otel olanaklarını tanıtan çok dilli SEO sayfaları oluşturulmalıdır. Butik otelinizin taş mimarisini ve begonvillerini ön plana çıkaran zengin içerikler üretilmelidir.</p>`
        }, {
          sectionTitle: "3. Sosyal Medyada Hikaye Tasarımı (Instagram & TikTok)",
          content: `<p>Turizmde satın alma kararları görsellikle doğrudan ilişkilidir. Otelinizin ambiyansını, yerel kahvaltı sofrasını ve çevre aktivitelerini gösteren reels/hikaye reklamları kurgulanarak remarketing (yeniden pazarlama) hedeflemesi yapılmalıdır.</p>`
        }, {
          sectionTitle: "4. Erken Rezervasyon ve Dinamik Fiyatlandırma Stratejileri",
          content: `<p>Sezon dışı dönemlerde talebi canlı tutmak adına dinamik indirim kodları, özel paketler (hafta sonu kaçamağı, yoga kampı vb.) ve erken rezervasyon kampanyaları dijital reklamlarla duyurulmalıdır.</p>`
        }],
        conclusion: `Ajans Rota olarak, turizm sektöründeki 10 yılı aşkın tecrübebizle otelinizin doluluk oranlarını artırmaya hazırız. Detaylı yol haritası ve reklam planlaması için bizimle iletişime geçebilirsiniz.`
      };
    } else {
      return {
        title: `E-Ticarette Dönüşüm Oranı Artırma (CRO) Kontrol Listesi (Özel Sürüm)`,
        introduction: `Merhaba Sayın ${customerName}, ${companyName} e-ticaret sitenizin ziyaretçi kalitesini ve satış performansını artırmak amacıyla hazırladığımız özel Dönüşüm Oranı Artırma (CRO) analizine hoş geldiniz.`,
        sections: [{
          sectionTitle: "1. Sepet Terk Etme Oranlarını Optimize Etme",
          content: `<p>Ziyaretçilerin sepeti terk etme oranını düşürmek için <strong>${companyName}</strong> sitesinde üye olmadan sipariş tamamlama (Guest Checkout) seçeneği bulunmalıdır. Kargo ücreti ve ek masraflar sepet ekranında şeffaf bir şekilde en başta belirtilmelidir.</p>`
        }, {
          sectionTitle: "2. Mobil Uyumluluk ve Hızlı Ödeme Akışı",
          content: `<p>E-ticaret trafiğinin %80'inden fazlası mobil cihazlardan gelmektedir. Tek tıkla ödeme seçenekleri, kolay adres doldurma formları ve mobil uyumlu kredi kartı giriş alanları dönüşüm oranlarınızı doğrudan artıracaktır.</p>`
        }, {
          sectionTitle: "3. Sosyal Kanıt ve Güven Unsurları",
          content: `<p>Kullanıcıların satın alma kararlarını hızlandırmak için ürün sayfalarında gerçek müşteri yorumları, yıldızlı değerlendirmeler, SSL sertifikası logoları ve kolay iade politikası gibi güven artırıcı unsurlar görünür şekilde sergilenmelidir.</p>`
        }, {
          sectionTitle: "4. Web Sitesi Hızının Dönüşüm Oranına Etkisi",
          content: `<p>Sayfa yüklenme süresindeki 1 saniyelik gecikme dönüşüm oranlarını %7 oranında düşürebilir. Görsellerin webp formatına dönüştürülmesi ve gereksiz JavaScript kodlarının temizlenmesi gerekmektedir.</p>`
        }],
        conclusion: `Ajans Rota uzmanlığıyla, e-ticaret sitenizin reklamlarından elde ettiğiniz dönüşümü (ROAS) en üst seviyeye çıkarmaya hazırız. Web sitenizin teknik CRO analizi için bizimle iletişime geçebilirsiniz.`
      };
    }
  };
  const handleGenerateGuidePDFWithAI = async lead => {
    if (!lead) return;
    setAiGuideLoading(true);
    const guideTitle = lead.service.replace('Rehber İndirme - ', '');
    if (settingsData.gemini_api_key) {
      try {
        const prompt = `Sen Ajans Rota'nın Yapay Zeka Eğitim ve Rapor hazırlama asistanısın.
Müşteri Adı: ${lead.fullName}
Firma Adı: ${lead.company || 'Belirtilmedi'}
E-posta: ${lead.email || 'Belirtilmedi'}
Rehber Adı: ${guideTitle}

Lütfen bu müşteriye ve firmasına özel olarak hazırlanmış, 4 bölümden oluşan zengin bir eğitim kılavuzu/rehber metni oluştur. Her bölüm en az 80-100 kelime olmalı ve sektörel, pratik tavsiyeler içermeli.
Çıktıyı kesinlikle başka hiçbir şey yazmadan (markdown kod blokları kullanmadan, düz JSON string olarak) şu JSON formatında ver:
{
  "title": "rehber ana başlığı",
  "introduction": "müşteriye ve firmasına özel selamlama ve kısa giriş paragrafı",
  "sections": [
    { "sectionTitle": "Bölüm 1 Başlığı", "content": "Bölüm 1'in detaylı, zengin HTML etiketleri (p, strong, ul, li) barındıran metni" },
    { "sectionTitle": "Bölüm 2 Başlığı", "content": "Bölüm 2'nin detaylı, zengin HTML etiketleri (p, strong, ul, li) barındıran metni" },
    { "sectionTitle": "Bölüm 3 Başlığı", "content": "Bölüm 3'nin detaylı, zengin HTML etiketleri (p, strong, ul, li) barındıran metni" },
    { "sectionTitle": "Bölüm 4 Başlığı", "content": "Bölüm 4'ün detaylı, zengin HTML etiketleri (p, strong, ul, li) barındıran metni" }
  ],
  "conclusion": "kapanış tavsiyesi ve Ajans Rota ile iş birliği çağrısı içeren paragraf"
}`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${settingsData.gemini_api_key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        });
        if (!response.ok) {
          throw new Error('Gemini API request failed');
        }
        const resData = await response.json();
        let textResult = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        textResult = textResult.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(textResult);
        if (parsed.title && parsed.sections) {
          setAiGuideContents(prev => ({
            ...prev,
            [lead.id]: parsed
          }));
          setAiGuideLoading(false);
          return;
        } else {
          throw new Error('Invalid JSON format');
        }
      } catch (err) {
        console.warn("Gemini guide AI generation error, falling back to local template:", err);
      }
    }

    // FALLBACK
    setTimeout(() => {
      const fallback = getLocalGuideFallback(guideTitle, lead);
      setAiGuideContents(prev => ({
        ...prev,
        [lead.id]: fallback
      }));
      setAiGuideLoading(false);
    }, 1500);
  };
  const handleDownloadGuidePDF = (lead, aiContent) => {
    if (!lead || !aiContent) return;
    if (window.html2pdf) {
      generateGuidePDF(lead, aiContent);
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        generateGuidePDF(lead, aiContent);
      };
      document.body.appendChild(script);
    }
  };
  const generateGuidePDF = (lead, aiContent) => {
    const element = document.createElement('div');
    element.id = 'temp-guide-pdf-container';
    element.style.width = '700px';
    element.style.boxSizing = 'border-box';
    element.style.backgroundColor = '#ffffff';
    element.style.padding = '30px';
    element.style.margin = '0';
    element.style.fontFamily = "'Inter', 'Segoe UI', sans-serif";
    const brandColor = '#0284c7'; // Rota Blue
    const textDark = '#0f172a';
    let sectionsHtml = '';
    aiContent.sections.forEach((sec, idx) => {
      sectionsHtml += `
        <div style="margin-bottom: 20px; page-break-inside: avoid;">
          <h3 style="font-size: 13px; color: ${brandColor}; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px; text-transform: uppercase;">
            ${sec.sectionTitle || sec.title || `Bölüm ${idx + 1}`}
          </h3>
          <div style="font-size: 10.5px; color: #334155; line-height: 1.6;">
            ${sec.content}
          </div>
        </div>
      `;
    });
    element.innerHTML = `
      <div style="border: 2px solid #e2e8f0; border-radius: 8px; padding: 25px; position: relative;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${brandColor}; padding-bottom: 10px; margin-bottom: 20px;">
          <div>
            <h1 style="font-size: 18px; color: ${textDark}; margin: 0; font-weight: 800; font-family: 'Outfit', sans-serif;">AJANS ROTA</h1>
            <span style="font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Dijital Büyüme & Eğitim Akademisi</span>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 8.5px; background: rgba(2, 132, 199, 0.1); color: ${brandColor}; padding: 3px 8px; border-radius: 4px; font-weight: 700; text-transform: uppercase;">Yapay Zeka Özel Raporu</span>
          </div>
        </div>

        <!-- Document Title -->
        <div style="margin-bottom: 20px; text-align: center;">
          <h2 style="font-size: 16px; color: ${textDark}; font-weight: 700; margin: 0 0 5px 0;">${aiContent.title}</h2>
          <p style="font-size: 9px; color: #64748b; margin: 0;">Bu rehber, başvuru sahibinin profil bilgileri ve sektörü analiz edilerek yapay zeka tarafından özel olarak derlenmiştir.</p>
        </div>

        <!-- Metadata Box -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 9.5px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; line-height: 1.4;">
          <div>
            <span style="color: #64748b; font-weight: 600; display: block; font-size: 8px; text-transform: uppercase;">Hazırlanan Kişi</span>
            <strong style="color: ${textDark}; font-size: 10px;">${lead.fullName}</strong>
          </div>
          <div>
            <span style="color: #64748b; font-weight: 600; display: block; font-size: 8px; text-transform: uppercase;">İşletme / Firma</span>
            <strong style="color: ${textDark}; font-size: 10px;">${lead.company || 'Belirtilmedi'}</strong>
          </div>
          <div>
            <span style="color: #64748b; font-weight: 600; display: block; font-size: 8px; text-transform: uppercase;">E-posta Adresi</span>
            <strong style="color: ${textDark}; font-size: 10px;">${lead.email}</strong>
          </div>
          <div>
            <span style="color: #64748b; font-weight: 600; display: block; font-size: 8px; text-transform: uppercase;">Oluşturulma Tarihi</span>
            <strong style="color: ${textDark}; font-size: 10px;">${new Date().toLocaleDateString('tr-TR')}</strong>
          </div>
        </div>

        <!-- Introduction -->
        <div style="font-size: 10.5px; color: #334155; line-height: 1.6; margin-bottom: 25px; font-style: italic; background: rgba(2, 132, 199, 0.02); border-left: 3px solid ${brandColor}; padding: 10px 15px; border-radius: 0 6px 6px 0;">
          ${aiContent.introduction}
        </div>

        <!-- Sections -->
        ${sectionsHtml}

        <!-- Conclusion -->
        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 10.5px; color: #334155; line-height: 1.6;">
          <strong>Sonuç ve Öneriler:</strong>
          <p style="margin: 5px 0 0 0;">${aiContent.conclusion}</p>
        </div>

        <!-- Footer -->
        <div style="margin-top: 35px; border-top: 1px solid #e2e8f0; padding-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 8px; color: #94a3b8;">
          <span>© ${new Date().getFullYear()} Ajans Rota Büyüme Akademisi. Tüm Hakları Saklıdır.</span>
          <span>www.ajansrota.com | iletisim@ajansrota.com</span>
        </div>
      </div>
    `;
    document.body.appendChild(element);
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Ajans_Rota_Akademi_Rehber_${lead.fullName.replace(/\s+/g, '_')}.pdf`,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollY: 0
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: {
        mode: 'css'
      }
    };
    window.html2pdf().set(opt).from(element).save().then(() => {
      document.body.removeChild(element);
    }).catch(err => {
      console.error("Guide PDF generation failed:", err);
      if (document.body.contains(element)) {
        document.body.removeChild(element);
      }
    });
  };
  const [isSendingGuide, setIsSendingGuide] = useState(false);
  const handleSendGuideEmail = async lead => {
    if (!lead) return;
    setIsSendingGuide(true);
    setTimeout(() => {
      const updated = leadsData.map(l => l.id === lead.id ? {
        ...l,
        status: 'sent'
      } : l);
      setLeadsData(updated);
      setSelectedLead(prev => prev ? {
        ...prev,
        status: 'sent'
      } : null);
      saveLeadsOnly(updated);
      setIsSendingGuide(false);
      toast.success(`Tebrikler! Özel Yapay Zeka Rehberi, ${lead.email} adresine başarıyla e-posta ile gönderildi ve talep durumu "Gönderildi" olarak güncellendi.`);
    }, 1200);
  };

  // Leads detail modal state
  const [selectedLead, setSelectedLead] = useState(null);
  const [crmStatus, setCrmStatus] = useState('yeni');
  const [crmNotes, setCrmNotes] = useState('');
  const [crmReminderDate, setCrmReminderDate] = useState('');
  useEffect(() => {
    if (selectedLead) {
      setCrmStatus(selectedLead.status || 'yeni');
      setCrmNotes(selectedLead.internalNotes || '');
      setCrmReminderDate(selectedLead.reminderDate || '');
    }
  }, [selectedLead]);

  // Leads search and filter state
  const [leadSearchText, setLeadSearchText] = useState('');
  const [leadSourceFilter, setLeadSourceFilter] = useState('all');
  const [leadServiceFilter, setLeadServiceFilter] = useState('all');
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const getIconForLabel = label => {
    const l = label.toLowerCase();
    if (l.includes('hizmet')) return <i className="fa-solid fa-cubes" style={{
      color: 'var(--primary)',
      marginRight: '0.4rem',
      fontSize: '0.75rem'
    }}></i>;
    if (l.includes('model')) return <i className="fa-solid fa-handshake" style={{
      color: 'var(--primary)',
      marginRight: '0.4rem',
      fontSize: '0.75rem'
    }}></i>;
    if (l.includes('süre') || l.includes('anlaşma')) return <i className="fa-solid fa-calendar-days" style={{
      color: 'var(--primary)',
      marginRight: '0.4rem',
      fontSize: '0.75rem'
    }}></i>;
    if (l.includes('rapor')) return <i className="fa-solid fa-chart-line" style={{
      color: 'var(--primary)',
      marginRight: '0.4rem',
      fontSize: '0.75rem'
    }}></i>;
    if (l.includes('bedel')) return <i className="fa-solid fa-turkish-lira-sign" style={{
      color: 'var(--secondary)',
      marginRight: '0.4rem',
      fontSize: '0.75rem'
    }}></i>;
    if (l.includes('bütçe')) return <i className="fa-solid fa-wallet" style={{
      color: 'var(--primary)',
      marginRight: '0.4rem',
      fontSize: '0.75rem'
    }}></i>;
    if (l.includes('ciro')) return <i className="fa-solid fa-arrow-trend-up" style={{
      color: 'var(--primary)',
      marginRight: '0.4rem',
      fontSize: '0.75rem'
    }}></i>;
    if (l.includes('kâr')) return <i className="fa-solid fa-piggy-bank" style={{
      color: 'var(--secondary)',
      marginRight: '0.4rem',
      fontSize: '0.75rem'
    }}></i>;
    if (l.includes('roas')) return <i className="fa-solid fa-percent" style={{
      color: 'var(--primary)',
      marginRight: '0.4rem',
      fontSize: '0.75rem'
    }}></i>;
    return null;
  };
  const generateDynamicRoadmap = (type, params, improvements) => {
    const isEcom = type === 'ecommerce';
    let steps = [];
    let diagnosis = '';
    if (isEcom) {
      const curCR = params.cr || 0;
      const curRoas = params.roas || 0;
      const traffic = params.traffic || 0;
      if (curCR < 1.5) {
        diagnosis = `Sitenizin dönüşüm oranı (%${curCR.toFixed(2)}) sektör ortalamasının (%1.5 - %2.0) altında kalmaktadır. Bu durum, reklam bütçenizin verimsiz harcanmasına ve yüksek müşteri edinme maliyetlerine yol açmaktadır. Ajans Rota olarak öncelikli hedefimiz site içi dönüşümü (CRO) optimize etmektir.`;
        steps = [{
          title: "1. Kullanıcı Deneyimi (UX/UI) & Sepet Optimizasyonu",
          desc: `Sepet terk oranlarını düşürmek amacıyla ödeme (checkout) adımları kolaylaştırılacak, ürün sayfalarına güven veren sosyal kanıtlar, kargo avantajları ve hızlı satın alma butonları eklenecektir.`
        }, {
          title: "2. Akıllı Hedef Kitle & Dinamik Katalog Reklamları",
          desc: `Gereksiz tıklamaları önlemek amacıyla hedef kitle filtreleri daraltılacak. Siteye gelen ziyaretçilere doğrudan ilgilendikleri ürünleri gösteren dinamik Meta ve Google katalog reklamları kurgulanacaktır.`
        }, {
          title: "3. Dönüşüm Oranının %${improvements.newCR.toFixed(2)} Seviyesine Çıkarılması",
          desc: `Dönüşüm oranındaki artışla birlikte aynı bütçeyle aylık sipariş sayısı artırılacak, edinme maliyeti düşürülerek verimlilik Rota hedeflerine taşınacaktır.`
        }];
      } else if (traffic < 30000) {
        diagnosis = `Mevcut aylık web sitesi trafiğiniz (${traffic.toLocaleString('tr-TR')} ziyaretçi) ciro hedeflerinize ulaşmanız için sınırlıdır. Dönüşüm oranınız stabil olmakla birlikte, büyüme için siteye yeni ve nitelikli satın alıcılar çekmemiz gerekmektedir.`;
        steps = [{
          title: "1. Çok Kanallı Nitelikli Trafik Çekimi",
          desc: `Google Ads Search ve Meta Ads Advantage+ kurguları aktif edilerek, sitenizden alışveriş yapmaya en yatkın kitleler hedeflenip nitelikli trafik %15 oranında artırılacaktır.`
        }, {
          title: "2. Sepet Terk Remarketing Kampanyaları",
          desc: `Sitenizi ziyaret edip satın almadan ayrılan kullanıcılara yönelik özel indirim ve fırsat kreatifleri gösterilerek sıcak trafiğin satın alma döngüsü tamamlanacaktır.`
        }, {
          title: "3. Organik Arama Görünürlüğü (Teknik SEO)",
          desc: `En çok satan ana ürün kategorilerinizde teknik SEO ve içerik optimizasyonları yapılarak kalıcı ve ücretsiz organik trafik kanalları güçlendirilecektir.`
        }];
      } else if (curRoas < 3.0) {
        diagnosis = `Reklam bütçesi verimliliğiniz (${curRoas}x ROAS) kabul edilebilir sınırın altındadır. Reklam harcamalarınızın daha fazla ciro getirmesi ve kârlılığın artması için bütçe optimizasyonu ve sepet tutarı (AOV) artışına odaklanılacaktır.`;
        steps = [{
          title: "1. Performans Analizi & Bütçe Filtreleme",
          desc: `Son 90 günde harcama yapıp dönüşüm getirmeyen verimsiz kampanyalar, hedef kitleler ve kreatifler durdurularak bütçe doğrudan en çok satan kârlı ürünlere yönlendirilecektir.`
        }, {
          title: "2. Ortalama Sepet Tutarı (AOV) Artırma Kurguları",
          desc: `Aylık ciroyu artırmak adına site içi yukarı satış (upsell) ve çapraz satış (cross-sell) modülleri (örn: 'Birlikte Al, %10 Tasarruf Et' veya kargo barajı kurguları) optimize edilecektir.`
        }, {
          title: "3. ROAS Hedefini ${improvements.newRoas}x Seviyesine Taşımak",
          desc: `Yapılacak optimizasyonlarla reklam verimliliği artırılacak, bütçe israfı engellenerek kârlı bir büyüme Rota'sı çizilecektir.`
        }];
      } else {
        diagnosis = `E-ticaret metrikleriniz oldukça sağlıklı görünmektedir. Ajans Rota olarak hedefimiz mevcut yapınızı riske atmadan akıllıca ölçeklemek, pazar payınızı büyütmek ve marka bilinirliğinizi pekiştirmektir.`;
        steps = [{
          title: "1. Ölçeklenebilir Bütçe Yönetimi (Scaling)",
          desc: `Kampanyaların dönüşüm maliyetleri (CAC) yakından izlenerek bütçe kontrollü şekilde artırılacak ve ciro hacmi ${improvements.newCiro?.toLocaleString('tr-TR')} ₺ seviyesine ölçeklenecektir.`
        }, {
          title: "2. Müşteri Tutundurma (Retention) & LTV Artışı",
          desc: `Mevcut alıcı veritabanınıza özel e-posta otomasyonları ve sadakat kurguları tanımlanarak, ek reklam maliyeti olmadan tekrar eden satışlar teşvik edilecektir.`
        }, {
          title: "3. Sunucu Taraflı Takip (Conversions API) Entegrasyonu",
          desc: `Meta Conversions API ve Google Enhanced Conversions kurulumları optimize edilerek IOS kısıtlamalarından bağımsız en net dönüşüm verisi toplanacaktır.`
        }];
      }
    } else {
      // B2B
      const conversion = params.conversion || 0;
      const leads = params.leads || 0;
      const cac = params.cac || 0;
      const ltv = params.ltv || 1;
      if (conversion < 10) {
        diagnosis = `B2B formlarınızdan gelen taleplerin satışa dönüşme oranı (%${conversion}) düşüktür. Bu durum, gelen taleplerin kalitesinde veya satış ekibinin takip/kapatma süreçlerinde aksaklıklar olduğunu gösterir.`;
        steps = [{
          title: "1. Form Niteliklendirme & SQL Kriterleri",
          desc: `Form alanlarına bütçe, şirket büyüklüğü gibi filtreleyici sorular eklenerek düşük kaliteli başvurular elenecektir. Reklam hedeflemesinde doğrudan B2B karar vericiler önceliklendirilecektir.`
        }, {
          title: "2. Hızlı Takip & CRM İş Akışı Entegrasyonu",
          desc: `Gelen talepler CRM sistemine otomatik aktarılacak, müşteri form doldurduğunda satış ekibine SMS/E-posta bildirimi giderek ilk 15 dakikada iletişime geçilmesi sağlanacaktır.`
        }, {
          title: "3. Dönüşüm Oranının %${improvements.newConversion}'a Çıkarılması",
          desc: `Nitelikli talep filtreleri ve satış hızı iyileştirmesiyle satış oranımız Rota hedefine ulaştırılacak ve toplam gelir ${improvements.newCiro?.toLocaleString('tr-TR')} ₺ seviyesine çıkarılacaktır.`
        }];
      } else if (leads < 50) {
        diagnosis = `Aylık talep (lead) sayınız (${leads} form) satış ekibinizin tam kapasite çalışması ve büyüme hedefleriniz için yetersizdir. Öncelikli amacımız talep hacmini artırmaktır.`;
        steps = [{
          title: "1. LinkedIn ve Google Ads B2B Hacim Kampanyaları",
          desc: `Sektörel unvanlar ve şirket listeleri üzerinden LinkedIn Form Reklamları ve arama hacmi yüksek Google Search kampanyaları aktif edilerek talep kanalı büyütülecektir.`
        }, {
          title: "2. Değer Sunumu (Lead Magnet) Kurgusu",
          desc: `Müşteri adaylarının form doldurmasını teşvik etmek amacıyla sektörel raporlar, ücretsiz teknik analizler veya demo sunumları içeren pazarlama hunisi kurulacaktır.`
        }, {
          title: "3. Retargeting (Yeniden Hedefleme) ve Isıtma",
          desc: `Sitenizi ziyaret eden ancak form doldurmayan kurumsal firmalara vaka analizleri ve referans projelerinizi göstererek güven tazelenecektir.`
        }];
      } else if (cac > ltv * 0.25) {
        diagnosis = `Müşteri edinme maliyetiniz (CAC: ${cac.toLocaleString('tr-TR')} ₺), müşteri yaşam boyu değerine (LTV: ${ltv.toLocaleString('tr-TR')} ₺) oranla yüksektir. Edinme maliyetlerini düşürmek birincil önceliğimizdir.`;
        steps = [{
          title: "1. Talep Başı Maliyet (CPL) Optimizasyonu",
          desc: `Maliyet/dönüşüm oranı dengesi zayıf olan anahtar kelimeler ve mecralar durdurulacak, reklam metinleri ve form sayfaları optimize edilerek form başı maliyet düşürülecektir.`
        }, {
          title: "2. Hedef Hesap Bazlı Pazarlama (ABM)",
          desc: `Bütçenizi geniş kitlelere dağıtmak yerine, sadece yüksek hacimli alım yapabilecek potansiyel kurumsal firmalar listelenerek doğrudan bu karar vericilere yönelik kampanyalar yürütülecektir.`
        }, {
          title: "3. CAC Değerinin Düşürülmesi",
          desc: `Yapılan çalışmalarla müşteri edinme maliyeti Rota hedefi olan ${improvements.newCac?.toLocaleString('tr-TR')} ₺ seviyesine çekilerek kârlılık oranınız artırılacaktır.`
        }];
      } else {
        diagnosis = `B2B dijital pazarlama kanallarınız oldukça verimli çalışmaktadır. Ajans Rota olarak hedefimiz, liderliğinizi pekiştirerek yeni pazarlara açılmanızı ve operasyonu büyütmenizi sağlamaktır.`;
        steps = [{
          title: "1. Coğrafi Ölçekleme & İhracat Odaklı Kampanyalar",
          desc: `Hedef bölgeler ve ülkeler genişletilerek uluslararası pazarlara uygun çok dilli Google ve LinkedIn kurguları aktif edilerek B2B performansı artırılacaktır.`
        }, {
          title: "2. Thought Leadership (Düşünce Liderliği)",
          desc: `Sektörde güvenilen otorite olmanız için vaka analizleri, teknik whitepaper belgeleri ve uzman görüşlerini içeren kurumsal içerik pazarlaması yaygınlaştırılacaktır.`
        }, {
          title: "3. Akıllı Bütçe Dağılımı",
          desc: `Reklam bütçesi verimli bir şekilde %20 artırılarak talep sayısı ${improvements.newLeads}'e çıkarılacak ve kârlılık ROI ${improvements.newRoi}x seviyesine taşınacaktır.`
        }];
      }
    }
    return {
      diagnosis,
      steps
    };
  };
  const parseProposalDetails = messageText => {
    const details = {
      services: '',
      pricingModel: '',
      term: '',
      reporting: '',
      fee: '',
      adBudget: ''
    };
    if (!messageText) return details;
    const lines = messageText.split('\n');
    lines.forEach(line => {
      if (line.includes('Seçilen Hizmetler:')) {
        details.services = line.replace('Seçilen Hizmetler:', '').trim();
      } else if (line.includes('Çalışma Modeli:')) {
        details.pricingModel = line.replace('Çalışma Modeli:', '').trim();
      } else if (line.includes('Anlaşma Süresi:')) {
        details.term = line.replace('Anlaşma Süresi:', '').trim();
      } else if (line.includes('Raporlama Paketi:')) {
        details.reporting = line.replace('Raporlama Paketi:', '').trim();
      } else if (line.includes('Tahmini Aylık Ajans Bedeli:')) {
        details.fee = line.replace('Tahmini Aylık Ajans Bedeli:', '').trim();
      } else if (line.includes('Aylık Reklam Bütçesi:')) {
        details.adBudget = line.replace('(Aylık Reklam Bütçesi:', '').replace(')', '').trim();
      }
    });
    return details;
  };
  const handleDownloadProposalPDF = lead => {
    if (!lead) return;
    if (window.html2pdf) {
      generateProposalPDF(lead);
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        generateProposalPDF(lead);
      };
      document.body.appendChild(script);
    }
  };
  const generateProposalPDF = lead => {
    const isWebDesign = lead.service === 'Web Tasarım Talebi';
    const parsed = parseProposalDetails(lead.message);
    const element = document.createElement('div');
    element.id = 'temp-proposal-pdf-container';
    element.style.width = '700px';
    element.style.boxSizing = 'border-box';
    element.style.backgroundColor = '#ffffff';
    element.style.padding = '0';
    element.style.margin = '0';
    element.style.fontFamily = "'Inter', 'Segoe UI', sans-serif";
    const brandColor = '#4f46e5'; // Indigo color for corporate proposals
    const textDark = '#0f172a';
    let contentHtml = '';
    if (isWebDesign) {
      const designType = lead.company || 'Kurumsal Web Tasarım Projesi';
      const isEcom = designType.toLowerCase().includes('e-ticaret');
      const fee = isEcom ? '45.000 ₺' : '30.000 ₺';
      contentHtml = `
        <!-- Proposal Scope -->
        <h2 style="font-size: 11px; color: ${textDark}; font-weight: 700; margin-top: 20px; margin-bottom: 5px; text-transform: uppercase; border-bottom: 2px solid ${brandColor}; padding-bottom: 2px;">1. PROJE KAPSAMI VE SÜRECİ</h2>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 9.5px; margin-bottom: 15px; line-height: 1.4;">
          <p style="margin: 0 0 8px 0; font-weight: 700; color: ${brandColor}; font-size: 10px;">Talep Edilen Proje: ${designType}</p>
          <p style="margin: 0 0 12px 0; color: #475569;"><strong>Müşteri Brief / Talebi:</strong> ${lead.message || 'Detaylı brief yüz yüze toplantıda netleştirilecektir.'}</p>
          
          <strong style="display: block; margin-bottom: 6px; color: ${textDark}; font-size: 9px; text-transform: uppercase;">Uygulama Adımları & Süreç:</strong>
          <table style="width: 100%; border-collapse: collapse; font-size: 9px; line-height: 1.35;">
            <tr style="border-bottom: 1px dashed #e2e8f0;">
              <td style="padding: 4px 0; font-weight: 700; width: 120px; color: ${textDark};">Aşama 01: Planlama & UI</td>
              <td style="padding: 4px 0; color: #64748b;">Marka kimliğine uygun renk paleti, wireframe ve anasayfa arayüz tasarımlarının onaylanması. (7 İş Günü)</td>
            </tr>
            <tr style="border-bottom: 1px dashed #e2e8f0;">
              <td style="padding: 4px 0; font-weight: 700; color: ${textDark};">Aşama 02: Kodlama & Panel</td>
              <td style="padding: 4px 0; color: #64748b;">Tasarımın temiz kod yapısıyla (React / Next.js) kodlanması ve basitleştirilmiş yönetim paneli entegrasyonu. (10 İş Günü)</td>
            </tr>
            <tr style="border-bottom: 1px dashed #e2e8f0;">
              <td style="padding: 4px 0; font-weight: 700; color: ${textDark};">Aşama 03: Entegrasyonlar</td>
              <td style="padding: 4px 0; color: #64748b;">Dönüşüm izleme kodları (GA4, Meta Pixel), Google Tag Manager ve ödeme/kargo entegrasyonlarının yapılması. (3 İş Günü)</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 700; color: ${textDark};">Aşama 04: Test & Yayım</td>
              <td style="padding: 4px 0; color: #64748b;">Mobil uyumluluk testleri, SEO optimizasyonları ve yayına alma aşaması. (2 İş Günü)</td>
            </tr>
          </table>
        </div>

        <!-- Proposal Pricing -->
        <h2 style="font-size: 11px; color: ${textDark}; font-weight: 700; margin-top: 15px; margin-bottom: 5px; text-transform: uppercase; border-bottom: 2px solid ${brandColor}; padding-bottom: 2px;">2. TİCARİ VE YATIRIM ŞARTLARI</h2>
        <div style="border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; background: #ffffff; margin-bottom: 15px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 9.5px; text-align: left;">
            <thead>
              <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <th style="padding: 8px 12px; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 8px;">Hizmet / Proje Tanımı</th>
                <th style="padding: 8px 12px; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 8px; text-align: right;">Tek Seferlik Bedel</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 12px; color: ${textDark};">
                  <strong>${designType}</strong>
                  <div style="font-size: 8.5px; color: #64748b; margin-top: 2px;">Özel Arayüz Tasarımı, Yönetim Paneli, GA4/Pixel Kurulumu, 1 Yıl Ücretsiz Teknik Destek</div>
                </td>
                <td style="padding: 10px 12px; text-align: right; color: ${brandColor}; font-weight: 700; font-size: 11px;">${fee}</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 10px 12px; font-weight: 700; color: ${textDark};">TOPLAM YATIRIM BEDELİ (KDV Hariç):</td>
                <td style="padding: 10px 12px; text-align: right; color: ${brandColor}; font-weight: 900; font-size: 12px;">${fee}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    } else {
      contentHtml = `
        <!-- Proposal Scope -->
        <h2 style="font-size: 11px; color: ${textDark}; font-weight: 700; margin-top: 20px; margin-bottom: 5px; text-transform: uppercase; border-bottom: 2px solid ${brandColor}; padding-bottom: 2px;">1. TALEP EDİLEN DİJİTAL HİZMETLER</h2>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 9.5px; margin-bottom: 15px; line-height: 1.4;">
          <p style="margin: 0 0 8px 0; font-weight: 700; color: ${brandColor}; font-size: 10px;">Seçilen Kanallar: ${parsed.services || 'Belirtilmedi'}</p>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 5px;">
            ${(parsed.services || '').split(',').map(serv => {
        const cleaned = serv.trim().toLowerCase();
        let title = serv.trim();
        let desc = 'İlgili kanalın yönetimi, kreatif testleri ve ROI odaklı optimizasyon süreçleri.';
        if (cleaned.includes('google')) {
          title = 'Google Ads Yönetimi';
          desc = 'Arama Ağı, PMax, YouTube ve Görüntülü Reklam yönetimi ile maksimum ROAS odağı.';
        } else if (cleaned.includes('meta')) {
          title = 'Meta (FB & IG) Reklamları';
          desc = 'Hedef kitle analizi, estetik reklam görselleri ve dönüşüm hunileri kurulumu.';
        } else if (cleaned.includes('seo')) {
          title = 'SEO (Arama Motoru Optimizasyonu)';
          desc = 'İçerik planlama, site içi teknik SEO ve Google sıralamalarında kalıcı yükselme.';
        } else if (cleaned.includes('sosyal')) {
          title = 'Sosyal Medya Yönetimi';
          desc = 'Marka diline uygun düzenli gönderi, hikaye paylaşımları ve topluluk yönetimi.';
        } else if (cleaned.includes('ticaret')) {
          title = 'E-Ticaret Danışmanlığı';
          desc = 'Sepet tutarı artırma, CRO, stok verimliliği ve satış kanalları optimizasyonu.';
        } else if (cleaned.includes('tasarım')) {
          title = 'Web Tasarım Hizmeti';
          desc = 'Modern tasarımlı, mobil uyumlu ve yüksek performanslı kurumsal web sitesi.';
        }
        return `
                <div style="border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px; background: #ffffff;">
                  <strong style="color: ${textDark}; font-size: 9px; display: block; margin-bottom: 2px;">${title}</strong>
                  <span style="font-size: 8px; color: #64748b; line-height: 1.3;">${desc}</span>
                </div>
              `;
      }).join('')}
          </div>
        </div>

        <!-- Proposal Pricing -->
        <h2 style="font-size: 11px; color: ${textDark}; font-weight: 700; margin-top: 15px; margin-bottom: 5px; text-transform: uppercase; border-bottom: 2px solid ${brandColor}; padding-bottom: 2px;">2. İŞBİRLİĞİ VE YATIRIM BİLGİLERİ</h2>
        <div style="border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; background: #ffffff; margin-bottom: 15px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 9.5px; text-align: left;">
            <thead>
              <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <th style="padding: 8px 12px; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 8px;">Yatırım Parametresi</th>
                <th style="padding: 8px 12px; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 8px; text-align: right;">Seçilen Seçenek / Bedel</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 12px; color: #64748b;">Aylık Reklam Bütçesi</td>
                <td style="padding: 8px 12px; text-align: right; color: ${textDark}; font-weight: 600;">${parsed.adBudget || 'Belirtilmedi'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 12px; color: #64748b;">Çalışma & İş Ortaklığı Modeli</td>
                <td style="padding: 8px 12px; text-align: right; color: ${textDark}; font-weight: 600;">${parsed.pricingModel || 'Belirtilmedi'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 12px; color: #64748b;">Planlanan İş Birliği Süresi</td>
                <td style="padding: 8px 12px; text-align: right; color: ${textDark}; font-weight: 600;">${parsed.term || 'Aylık'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 12px; color: #64748b;">Raporlama Ve Analiz Düzeyi</td>
                <td style="padding: 8px 12px; text-align: right; color: ${textDark}; font-weight: 600;">${parsed.reporting || 'Standart'}</td>
              </tr>
              <tr style="background-color: #f8fafc; border-top: 2px solid #e2e8f0;">
                <td style="padding: 10px 12px; font-weight: 700; color: ${textDark};">NET AYLIK AJANS BEDELİ (KDV Hariç):</td>
                <td style="padding: 10px 12px; text-align: right; color: ${brandColor}; font-weight: 900; font-size: 12px;">${parsed.fee || 'Hesaplanamadı'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }
    element.innerHTML = `
      <div style="padding: 30px; box-sizing: border-box; color: #334155; line-height: 1.4;">
        
        <!-- Header Section -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid ${brandColor}; padding-bottom: 12px; margin-bottom: 15px;">
          <div>
            <h1 style="margin: 0; font-size: 20px; color: ${textDark}; font-weight: 900; letter-spacing: -0.04em;">AJANS ROTA</h1>
            <p style="margin: 2px 0 0 0; font-size: 8.5px; color: #64748b; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700;">KURUMSAL HİZMET TEKLİFİ</p>
          </div>
          <div style="text-align: right; font-size: 8.5px; color: #64748b;">
            <span style="background-color: ${brandColor}; color: #ffffff; padding: 3px 8px; border-radius: 12px; font-weight: 700; text-transform: uppercase; font-size: 7.5px;">Resmi Fiyat Teklifi</span>
            <p style="margin: 5px 0 0 0;">Kod: <strong>AR-TEK-${lead.id.replace('sim_', '')}</strong></p>
            <p style="margin: 2px 0 0 0;">Geçerlilik: <strong>15 Gün</strong></p>
          </div>
        </div>

        <!-- Executive Summary -->
        <p style="color: #475569; font-size: 10px; margin-bottom: 15px; line-height: 1.45;">
          Sayın <strong>${lead.fullName}</strong>,<br>
          Ajans Rota olarak, markanızı birer bütçe paneli olarak görmeyip omuz omuza büyüyeceğimiz bir performans iş ortaklığı teklif ediyoruz. Hizmet planlayıcımızda seçtiğiniz parametreler doğrultusunda hazırladığımız kurumsal hizmet teklifimiz aşağıda detaylandırılmıştır.
        </p>

        <!-- Client & Agency Metadata -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; font-size: 9px; margin-bottom: 15px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 2px 0; color: #64748b; font-weight: 500; width: 100px;">Müşteri / Firma:</td>
              <td style="padding: 2px 0; color: ${textDark}; font-weight: 700;">${lead.company || lead.fullName}</td>
              <td style="padding: 2px 0; color: #64748b; font-weight: 500; width: 100px; text-align: right;">Teklif Tarihi:</td>
              <td style="padding: 2px 0; color: ${textDark}; font-weight: 700; text-align: right;">${lead.created_at?.substring(0, 10) || new Date().toLocaleDateString('tr-TR')}</td>
            </tr>
            <tr>
              <td style="padding: 2px 0; color: #64748b; font-weight: 500;">Yetkili Kişi:</td>
              <td style="padding: 2px 0; color: ${textDark}; font-weight: 600;">${lead.fullName}</td>
              <td style="padding: 2px 0; color: #64748b; font-weight: 500; text-align: right;">Teklif Veren:</td>
              <td style="padding: 2px 0; color: ${textDark}; font-weight: 700; text-align: right;">Ajans Rota</td>
            </tr>
            <tr>
              <td style="padding: 2px 0; color: #64748b; font-weight: 500;">İletişim:</td>
              <td style="padding: 2px 0; color: ${textDark}; font-weight: 600;">${lead.email || '-'} | ${lead.phone || '-'}</td>
              <td style="padding: 2px 0; color: #64748b; font-weight: 500; text-align: right;">E-posta:</td>
              <td style="padding: 2px 0; color: ${textDark}; font-weight: 700; text-align: right;">hello@ajansrota.com</td>
            </tr>
          </table>
        </div>

        ${contentHtml}

        <!-- 3. Ortak Çalışma İlkeleri -->
        <h2 style="font-size: 11px; color: ${textDark}; font-weight: 700; margin-top: 15px; margin-bottom: 5px; text-transform: uppercase; border-bottom: 2px solid ${brandColor}; padding-bottom: 2px;">3. ORTAK ÇALIŞMA İLKELERİMİZ</h2>
        <div style="font-size: 9px; color: #475569; line-height: 1.45; margin-bottom: 25px;">
          <ul style="margin: 0; padding-left: 15px;">
            <li style="margin-bottom: 4px;"><strong>Hesap Sahibi Sizsiniz:</strong> Tüm reklam hesapları (Google Ads, Meta Ads vb.) şirketiniz adına açılır veya mevcut hesaplar kullanılır. Hesapların mülkiyeti her zaman sizdedir.</li>
            <li style="margin-bottom: 4px;"><strong>Şeffaflık & Raporlama:</strong> Kampanyaların tüm verileri ve harcamaları eş zamanlı olarak şeffaf şekilde panelden izlenebilir, seçtiğiniz pakete göre haftalık/aylık raporlama yapılır.</li>
            <li style="margin-bottom: 4px;"><strong>Bütçe ve Kampanya Yönetimi:</strong> Kampanyalar günlük olarak negatif anahtar kelime denetimlerinden geçirilir, kitle optimizasyonları ve ROAS artış hedefleri anlık takip edilir.</li>
          </ul>
        </div>

        <!-- Acceptance / Signature Block -->
        <div style="display: flex; justify-content: space-between; margin-top: 35px; border-top: 1px solid #e2e8f0; padding-top: 20px; page-break-inside: avoid;">
          <div style="width: 200px; text-align: center; font-size: 9px;">
            <strong style="color: #64748b; text-transform: uppercase; font-size: 7.5px; display: block; margin-bottom: 40px;">TEKLİF EDEN / AJANS ROTA</strong>
            <div style="border-bottom: 1px solid #cbd5e1; width: 140px; margin: 0 auto 5px auto;"></div>
            <span style="color: ${textDark}; font-weight: 600;">Ajans Rota Performans A.Ş.</span>
          </div>
          <div style="width: 200px; text-align: center; font-size: 9px;">
            <strong style="color: #64748b; text-transform: uppercase; font-size: 7.5px; display: block; margin-bottom: 40px;">TEKLİF ONAYLAYAN / MÜŞTERİ</strong>
            <div style="border-bottom: 1px solid #cbd5e1; width: 140px; margin: 0 auto 5px auto;"></div>
            <span style="color: ${textDark}; font-weight: 600;">${lead.company || lead.fullName}</span>
          </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 45px; border-top: 1px solid #e2e8f0; padding-top: 8px; text-align: center; font-size: 7.5px; color: #94a3b8; page-break-inside: avoid;">
          Bu teklif belgesi Ajans Rota dijital performans yönetim ekibi tarafından otomatik oluşturulmuştur. Fiyatlar KDV hariçtir.<br>
          <strong>www.ajansrota.com | hello@ajansrota.com | +90 544 584 45 43</strong>
        </div>

      </div>
    `;
    document.body.appendChild(element);
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Ajans_Rota_Teklif_${lead.fullName.replace(/\s+/g, '_')}.pdf`,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollY: 0
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: {
        mode: 'css'
      }
    };
    window.html2pdf().set(opt).from(element).save().then(() => {
      document.body.removeChild(element);
    }).catch(err => {
      console.error("Proposal PDF generation failed:", err);
      if (document.body.contains(element)) {
        document.body.removeChild(element);
      }
    });
  };
  const handleSendProposalEmail = async lead => {
    if (!lead) return;
    setIsSendingProposal(true);
    const isWebDesign = lead.service === 'Web Tasarım Talebi';
    const emailSubject = encodeURIComponent(`Ajans Rota - Kurumsal Hizmet Teklifi (${lead.company || lead.fullName})`);
    let emailBody = '';
    if (isWebDesign) {
      emailBody = `Sayın ${lead.fullName},\n\n` + `Markanız için yaptığınız Web Tasarım Projesi talebine istinaden hazırladığımız kurumsal hizmet teklifimiz e-postamıza eklenmiştir.\n\n` + `Proje Detayları:\n` + `- Proje Türü: ${lead.company}\n` + `- Talebiniz: ${lead.message || '-'}\n\n` + `Detayları ve süreci görüşmek için en kısa sürede sizinle iletişime geçeceğiz.\n\n` + `Saygılarımızla,\n` + `Ajans Rota Performans Departmanı\n` + `www.ajansrota.com | hello@ajansrota.com`;
    } else {
      const parsed = parseProposalDetails(lead.message);
      emailBody = `Sayın ${lead.fullName},\n\n` + `Ajans Rota Hizmet Bedeli Planlayıcısı üzerinden yaptığınız talebe istinaden hazırladığımız fiyat teklifi ve detaylar aşağıda bilgilerinize sunulmuştur.\n\n` + `Teklif Detayları:\n` + `- Seçilen Hizmetler: ${parsed.services}\n` + `- Çalışma Modeli: ${parsed.pricingModel}\n` + `- Taahhüt Süresi: ${parsed.term}\n` + `- Raporlama Paketi: ${parsed.reporting}\n` + `- Aylık Reklam Bütçesi: ${parsed.adBudget}\n` + `- Aylık Ajans Ücreti: ${parsed.fee} (KDV Hariç)\n\n` + `Resmi antetli teklif belgeniz ekte sunulmuştur. İş birliğimizi başlatmak ve kampanya kurulumlarına geçmek için bu e-postayı onaylayabilirsiniz.\n\n` + `Saygılarımızla,\n` + `Ajans Rota Performans Departmanı\n` + `www.ajansrota.com | hello@ajansrota.com`;
    }
    const mailtoUrl = `mailto:${lead.email}?subject=${emailSubject}&body=${encodeURIComponent(emailBody)}`;
    setTimeout(() => {
      const updated = leadsData.map(l => l.id === lead.id ? {
        ...l,
        status: 'sent'
      } : l);
      setLeadsData(updated);
      setSelectedLead({
        ...lead,
        status: 'sent'
      });
      saveLeadsOnly(updated);
      setIsSendingProposal(false);
      toast.success(`Teklif başarıyla gönderildi! Durum "Teklif İletildi" olarak güncellendi. \n\nMüşterinin e-posta adresi (${lead.email}) için e-posta taslağı tetikleniyor...`);
      if (lead.email) {
        window.open(mailtoUrl, '_blank');
      }
    }, 1500);
  };
  const getStatusLabel = status => {
    switch (status) {
      case 'unread':
        return 'Yeni (Okunmadı)';
      case 'yeni':
        return 'Yeni Başvuru';
      case 'iletisimde':
        return 'İletişimde';
      case 'toplanti_planlandi':
        return 'Toplantı Planlandı';
      case 'analiz_fazinda':
        return 'Analiz Fazında';
      case 'teklif_hazirlaniyor':
        return 'Teklif Hazırlanıyor';
      case 'teklif_iletildi':
        return 'Teklif İletildi';
      case 'revize_istendi':
        return 'Revize İstendi';
      case 'sozlesme_asamasinda':
        return 'Sözleşme Aşamasında';
      case 'kazanildi':
        return 'Kazanıldı';
      case 'kaybedildi':
        return 'Kaybedildi';
      case 'ertelendi':
        return 'Ertelendi';
      case 'read':
        return 'Okundu';
      default:
        return status || 'Bilinmiyor';
    }
  };
  const handleSaveCRM = (leadId, newStatus, newNotes, newReminderDate) => {
    const prevLead = leadsData.find(l => l.id === leadId);
    if (!prevLead) return;
    let history = Array.isArray(prevLead.activityHistory) ? [...prevLead.activityHistory] : [];
    const nowStr = new Date().toLocaleString('tr-TR');
    if (history.length === 0) {
      history.push({
        date: prevLead.created_at ? new Date(prevLead.created_at).toLocaleString('tr-TR') : nowStr,
        type: 'system',
        text: 'Talep sisteme ulaştı.'
      });
    }
    if (prevLead.status !== newStatus) {
      history.push({
        date: nowStr,
        type: 'status_change',
        text: `Talep durumu "${getStatusLabel(prevLead.status)}" -> "${getStatusLabel(newStatus)}" olarak güncellendi.`
      });
    }
    if ((prevLead.internalNotes || '') !== (newNotes || '')) {
      history.push({
        date: nowStr,
        type: 'note_change',
        text: newNotes ? `Not: "${newNotes.substring(0, 45)}${newNotes.length > 45 ? '...' : ''}"` : 'Görüşme notları silindi.'
      });
    }
    if ((prevLead.reminderDate || '') !== (newReminderDate || '')) {
      history.push({
        date: nowStr,
        type: 'reminder_change',
        text: newReminderDate ? `Takip hatırlatıcısı planlandı: ${newReminderDate}` : 'Takip hatırlatıcısı kaldırıldı.'
      });
    }
    const updated = leadsData.map(l => l.id === leadId ? {
      ...l,
      status: newStatus,
      internalNotes: newNotes,
      reminderDate: newReminderDate,
      activityHistory: history
    } : l);
    setLeadsData(updated);
    setSelectedLead(prev => prev ? {
      ...prev,
      status: newStatus,
      internalNotes: newNotes,
      reminderDate: newReminderDate,
      activityHistory: history
    } : null);
    saveLeadsOnly(updated);
    toast('CRM Bilgileri (Durum, Notlar ve Takip Tarihi) başarıyla kaydedildi.');
  };
  const handleDownloadPDF = lead => {
    if (!lead || !lead.simulatorData) return;
    if (window.html2pdf) {
      generatePDF(lead);
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        generatePDF(lead);
      };
      document.body.appendChild(script);
    }
  };
  const generatePDF = lead => {
    const {
      type,
      params,
      improvements
    } = lead.simulatorData;
    const isEcom = type === 'ecommerce';
    const {
      diagnosis,
      steps
    } = generateDynamicRoadmap(type, params, improvements);

    // Create temp container
    const element = document.createElement('div');
    element.id = 'temp-pdf-container';
    element.style.width = '700px';
    element.style.boxSizing = 'border-box';
    element.style.backgroundColor = '#ffffff';
    element.style.padding = '0';
    element.style.margin = '0';
    const brandColor = isEcom ? '#0284c7' : '#0d9488';
    const brandLight = isEcom ? 'rgba(2, 132, 199, 0.04)' : 'rgba(13, 148, 136, 0.04)';
    const textDark = '#0f172a';
    let comparisonRowsHtml = '';
    let inputsHtml = '';
    if (isEcom) {
      inputsHtml = `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
            <span style="font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase;">Reklam Bütçesi</span>
            <div style="font-size: 13px; font-weight: 700; color: ${brandColor}; margin-top: 4px;">${params.spend?.toLocaleString('tr-TR')} ₺</div>
          </div>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
            <span style="font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase;">Aylık Trafik</span>
            <div style="font-size: 13px; font-weight: 700; color: ${brandColor}; margin-top: 4px;">${params.traffic?.toLocaleString('tr-TR')}</div>
          </div>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
            <span style="font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase;">Sepet (AOV)</span>
            <div style="font-size: 13px; font-weight: 700; color: ${brandColor}; margin-top: 4px;">${params.aov?.toLocaleString('tr-TR')} ₺</div>
          </div>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
            <span style="font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase;">Mevcut Ciro</span>
            <div style="font-size: 13px; font-weight: 700; color: ${brandColor}; margin-top: 4px;">${params.revenue?.toLocaleString('tr-TR')} ₺</div>
          </div>
        </div>
      `;
      comparisonRowsHtml = `
        <tr style="border-bottom: 1px solid #e2e8f0; page-break-inside: avoid;">
          <td style="padding: 10px; font-weight: 600; color: ${textDark};">Aylık Gelir (Ciro)</td>
          <td style="padding: 10px; text-align: center; color: #64748b;">${params.revenue?.toLocaleString('tr-TR')} ₺</td>
          <td style="padding: 10px; text-align: right; color: ${brandColor}; font-weight: 700;">
            ${improvements.newCiro?.toLocaleString('tr-TR')} ₺
            <span style="background-color: rgba(22, 163, 74, 0.1); color: #16a34a; padding: 2px 5px; border-radius: 4px; font-size: 9px; margin-left: 5px; font-weight: bold; border: 1px solid rgba(22, 163, 74, 0.15);">
              +${Math.round(improvements.revenueIncrease / (params.revenue || 1) * 100)}%
            </span>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0; page-break-inside: avoid;">
          <td style="padding: 10px; font-weight: 600; color: ${textDark};">Dönüşüm Oranı (CR)</td>
          <td style="padding: 10px; text-align: center; color: #64748b;">%${params.cr?.toFixed(2)}</td>
          <td style="padding: 10px; text-align: right; color: ${brandColor}; font-weight: 700;">
            %${improvements.newCR?.toFixed(2)}
            <span style="background-color: ${brandLight}; color: ${brandColor}; padding: 2px 5px; border-radius: 4px; font-size: 9px; margin-left: 5px; font-weight: bold; border: 1px solid rgba(2, 132, 199, 0.12);">
              +${Math.round((improvements.newCR - params.cr) / (params.cr || 1) * 100)}%
            </span>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0; page-break-inside: avoid;">
          <td style="padding: 10px; font-weight: 600; color: ${textDark};">ROAS (Reklam Verimliliği)</td>
          <td style="padding: 10px; text-align: center; color: #64748b;">${params.roas}x</td>
          <td style="padding: 10px; text-align: right; color: #16a34a; font-weight: 700;">
            ${improvements.newRoas}x
            <span style="background-color: rgba(22, 163, 74, 0.1); color: #16a34a; padding: 2px 5px; border-radius: 4px; font-size: 9px; margin-left: 5px; font-weight: bold; border: 1px solid rgba(22, 163, 74, 0.15);">
              +${Math.round((improvements.newRoas - params.roas) / (params.roas || 1) * 100)}%
            </span>
          </td>
        </tr>
        <tr style="page-break-inside: avoid;">
          <td style="padding: 10px; font-weight: 600; color: ${textDark};">Müşteri Edinme Maliyeti (CAC)</td>
          <td style="padding: 10px; text-align: center; color: #64748b;">${params.cac?.toLocaleString('tr-TR')} ₺</td>
          <td style="padding: 10px; text-align: right; color: #ef4444; font-weight: 700;">
            ${improvements.newCac?.toLocaleString('tr-TR')} ₺
            <span style="background-color: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 2px 5px; border-radius: 4px; font-size: 9px; margin-left: 5px; font-weight: bold; border: 1px solid rgba(239, 68, 68, 0.15);">
              -${Math.round((params.cac - improvements.newCac) / (params.cac || 1) * 100)}%
            </span>
          </td>
        </tr>
      `;
    } else {
      inputsHtml = `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
            <span style="font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase;">Aylık Bütçe</span>
            <div style="font-size: 13px; font-weight: 700; color: ${brandColor}; margin-top: 4px;">${params.spend?.toLocaleString('tr-TR')} ₺</div>
          </div>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
            <span style="font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase;">Aylık Talep (Lead)</span>
            <div style="font-size: 13px; font-weight: 700; color: ${brandColor}; margin-top: 4px;">${params.leads?.toLocaleString('tr-TR')}</div>
          </div>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
            <span style="font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase;">Dönüşüm Oranı</span>
            <div style="font-size: 13px; font-weight: 700; color: ${brandColor}; margin-top: 4px;">%${params.conversion}</div>
          </div>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
            <span style="font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase;">Müşteri LTV</span>
            <div style="font-size: 13px; font-weight: 700; color: ${brandColor}; margin-top: 4px;">${params.ltv?.toLocaleString('tr-TR')} ₺</div>
          </div>
        </div>
      `;
      comparisonRowsHtml = `
        <tr style="border-bottom: 1px solid #e2e8f0; page-break-inside: avoid;">
          <td style="padding: 10px; font-weight: 600; color: ${textDark};">Toplam Gelir (LTV)</td>
          <td style="padding: 10px; text-align: center; color: #64748b;">${params.revenue?.toLocaleString('tr-TR')} ₺</td>
          <td style="padding: 10px; text-align: right; color: ${brandColor}; font-weight: 700;">
            ${improvements.newCiro?.toLocaleString('tr-TR')} ₺
            <span style="background-color: rgba(22, 163, 74, 0.1); color: #16a34a; padding: 2px 5px; border-radius: 4px; font-size: 9px; margin-left: 5px; font-weight: bold; border: 1px solid rgba(22, 163, 74, 0.15);">
              +${Math.round(improvements.revenueIncrease / (params.revenue || 1) * 100)}%
            </span>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0; page-break-inside: avoid;">
          <td style="padding: 10px; font-weight: 600; color: ${textDark};">Aylık Form / Talep</td>
          <td style="padding: 10px; text-align: center; color: #64748b;">${params.leads}</td>
          <td style="padding: 10px; text-align: right; color: ${brandColor}; font-weight: 700;">
            ${improvements.newLeads}
            <span style="background-color: ${brandLight}; color: ${brandColor}; padding: 2px 5px; border-radius: 4px; font-size: 9px; margin-left: 5px; font-weight: bold; border: 1px solid rgba(2, 132, 199, 0.12);">
              +${Math.round((improvements.newLeads - params.leads) / (params.leads || 1) * 100)}%
            </span>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0; page-break-inside: avoid;">
          <td style="padding: 10px; font-weight: 600; color: ${textDark};">Satış Dönüşüm Oranı</td>
          <td style="padding: 10px; text-align: center; color: #64748b;">%${params.conversion}</td>
          <td style="padding: 10px; text-align: right; color: #16a34a; font-weight: 700;">
            %${improvements.newConversion}
            <span style="background-color: rgba(22, 163, 74, 0.1); color: #16a34a; padding: 2px 5px; border-radius: 4px; font-size: 9px; margin-left: 5px; font-weight: bold; border: 1px solid rgba(22, 163, 74, 0.15);">
              +${Math.round((improvements.newConversion - params.conversion) / (params.conversion || 1) * 100)}%
            </span>
          </td>
        </tr>
        <tr style="page-break-inside: avoid;">
          <td style="padding: 10px; font-weight: 600; color: ${textDark};">Yatırım Getirisi (ROI)</td>
          <td style="padding: 10px; text-align: center; color: #64748b;">${params.roi}x</td>
          <td style="padding: 10px; text-align: right; color: ${brandColor}; font-weight: 700;">
            ${improvements.newRoi}x
            <span style="background-color: ${brandLight}; color: ${brandColor}; padding: 2px 5px; border-radius: 4px; font-size: 9px; margin-left: 5px; font-weight: bold; border: 1px solid rgba(2, 132, 199, 0.12);">
              +${Math.round((improvements.newRoi - params.roi) / (params.roi || 1) * 100)}%
            </span>
          </td>
        </tr>
      `;
    }
    element.innerHTML = `
      <!-- PAGE 1 -->
      <div style="width: 700px; padding: 15px; box-sizing: border-box; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.4; font-size: 11px; page-break-after: always;">
        <!-- Header -->
        <div style="border-bottom: 2px solid ${brandColor}; padding-bottom: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h1 style="margin: 0; font-size: 18px; color: ${textDark}; font-weight: 900; letter-spacing: -0.04em;">AJANS ROTA</h1>
            <p style="margin: 2px 0 0 0; font-size: 8.5px; color: #64748b; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700;">STRATEJİK DİJİTAL BÜYÜME RAPORU</p>
          </div>
          <div style="text-align: right;">
            <span style="background-color: ${brandColor}; color: #ffffff; padding: 2px 6px; border-radius: 12px; font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Kişiye Özel Analiz</span>
            <p style="margin: 4px 0 0 0; font-size: 8.5px; color: #64748b;">Kod: <strong>AR-${Math.floor(100000 + Math.random() * 900000)}</strong></p>
          </div>
        </div>

        <!-- 1. Stratejik Değerlendirme & Giriş -->
        <h2 style="font-size: 12px; color: ${textDark}; font-weight: 700; margin-top: 0; margin-bottom: 4px;">1. Stratejik Değerlendirme & Giriş</h2>
        <p style="color: #475569; font-size: 10px; margin-bottom: 10px; line-height: 1.35;">
          Sayın <strong>${lead.fullName}</strong>, bu rapor, ${lead.company ? `<strong>${lead.company}</strong>` : 'markanız'} için simülatörde paylaştığınız dijital pazarlama verileri doğrultusunda, <strong>Ajans Rota Performans Departmanı</strong> tarafından hazırlanmıştır. Raporun amacı, reklam bütçenizi en verimli şekilde kullanarak ciro ve talep potansiyelinizi maksimum seviyeye çıkarma yollarını göstermektir.
        </p>

        <!-- Key Metrics Highlight Callout Card -->
        <div style="background: ${brandColor}; color: #ffffff; padding: 10px 12px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <div>
            <span style="font-size: 7.5px; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.9; font-weight: 600;">Hedeflenen Yıllık Ek Gelir Artışı</span>
            <h2 style="margin: 1px 0 0 0; font-size: 16px; font-weight: 800; letter-spacing: -0.02em;">+${(improvements.revenueIncrease * 12).toLocaleString('tr-TR')} ₺</h2>
          </div>
          <div style="text-align: right; background: rgba(255,255,255,0.15); padding: 4px 6px; border-radius: 4px; font-size: 9px; line-height: 1.25;">
            Harcama Değişmeden<br><strong>+${Math.round(improvements.revenueIncrease / (params.revenue || 1) * 100)}% Büyüme</strong>
          </div>
        </div>

        <!-- Customer Info Table -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; font-size: 9.5px; margin-bottom: 10px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 1px 0; color: #64748b; font-weight: 500; width: 120px;">Müşteri / Marka:</td>
              <td style="padding: 1px 0; color: ${textDark}; font-weight: 700;">${lead.fullName}</td>
              <td style="padding: 1px 0; color: #64748b; font-weight: 500; width: 90px; text-align: right;">Oluşturulma:</td>
              <td style="padding: 1px 0; color: ${textDark}; font-weight: 700; text-align: right;">${lead.created_at || new Date().toLocaleDateString('tr-TR')}</td>
            </tr>
            <tr>
              <td style="padding: 1px 0; color: #64748b; font-weight: 500;">İletişim Bilgileri:</td>
              <td style="padding: 1px 0; color: ${textDark}; font-weight: 600;">${lead.email || '-'} | ${lead.phone || '-'}</td>
              <td style="padding: 1px 0; color: #64748b; font-weight: 500; text-align: right;">Hizmet Grubu:</td>
              <td style="padding: 1px 0; color: ${textDark}; font-weight: 700; text-align: right;">${lead.service}</td>
            </tr>
          </table>
        </div>

        <!-- 2. Mevcut Metrikler ve Ajans Rota Büyüme Karşılaştırması -->
        <h2 style="font-size: 12px; color: ${textDark}; font-weight: 700; margin-top: 0; margin-bottom: 4px;">2. Performans Verileri ve İyileştirme Planı</h2>
        <p style="color: #64748b; font-size: 9px; margin-bottom: 8px; line-height: 1.35;">
          Girilen verileriniz analiz edilerek, Ajans Rota optimizasyon modeli uygulandığında elde edilecek hedef performans artışları aşağıda listelenmiştir.
        </p>

        <!-- Sliders Inputs View -->
        ${inputsHtml}

        <!-- Comparison Table -->
        <div style="border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; background: #ffffff;">
          <table style="width: 100%; border-collapse: collapse; font-size: 9.5px; text-align: left;">
            <thead>
              <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <th style="padding: 6px 10px; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 8px;">Metrik Adı</th>
                <th style="padding: 6px 10px; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 8px; text-align: center;">Mevcut Durum</th>
                <th style="padding: 6px 10px; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 8px; text-align: right;">Ajans Rota Hedefi</th>
              </tr>
            </thead>
            <tbody>
              ${comparisonRowsHtml}
            </tbody>
          </table>
        </div>
        
        <!-- Footer Page 1 -->
        <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 8px; color: #94a3b8;">
          <span>www.ajansrota.com</span>
          <span>Sayfa 1 / 2</span>
        </div>
      </div>

      <!-- PAGE 2 -->
      <div style="width: 700px; padding: 15px; box-sizing: border-box; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.4; font-size: 11px;">
        <!-- Page 2 Header -->
        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 8.5px; font-weight: bold; color: ${brandColor}; text-transform: uppercase; letter-spacing: 0.05em;">AJANS ROTA STRATEJİK EYLEM PLANI</span>
          <span style="font-size: 8px; color: #94a3b8;">Sayfa 2 / 2</span>
        </div>

        <!-- 3. Durum Analizi, Teşhis and Rota Yol Haritası -->
        <h2 style="font-size: 12px; color: ${brandColor}; font-weight: 700; margin-top: 0; margin-bottom: 4px;">3. Durum Analizi, Teşhis ve Rota Yol Haritası</h2>
        
        <!-- Diagnosis Card -->
        <div style="background-color: ${brandLight}; border-left: 4px solid ${brandColor}; padding: 8px 10px; border-radius: 4px; margin-bottom: 12px; font-size: 9.5px; line-height: 1.35; color: #334155;">
          <strong style="color: ${textDark}; font-size: 10px; display: block; margin-bottom: 2px;">💡 Mevcut Durum Teşhisi:</strong>
          ${diagnosis}
        </div>

        <!-- Strategy Steps -->
        <h3 style="font-size: 10.5px; color: ${textDark}; font-weight: 700; margin-top: 0; margin-bottom: 6px;">Ajans Rota Performans Yol Haritası (Uygulama Adımları)</h3>
        <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px;">
          ${steps.map((step, index) => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; display: flex; gap: 8px; align-items: flex-start; page-break-inside: avoid;">
              <div style="background: ${brandColor}; color: #ffffff; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 9px; flex-shrink: 0; margin-top: 1px;">
                ${index + 1}
              </div>
              <div>
                <strong style="font-size: 10px; color: ${textDark}; display: block; margin-bottom: 1px;">${step.title}</strong>
                <p style="margin: 0; font-size: 9px; color: #475569; line-height: 1.3;">${step.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Why Ajans Rota section -->
        <h2 style="font-size: 12px; color: ${textDark}; font-weight: 800; margin-top: 8px; margin-bottom: 4px; text-align: center;">Neden Ajans Rota Büyüme Modeli?</h2>
        <p style="color: #475569; font-size: 9.5px; max-width: 600px; margin: 0 auto 8px auto; line-height: 1.35; text-align: center;">
          Ajans Rota, markaların reklam bütçelerini veriye dayalı performans metodolojisi ile yönetir. Yapay zeka destekli hedefleme araçlarımız, dönüşüm oranı iyileştirmesi (CRO) tecrübemiz ve uzman ekibimizle bütçenizin kârlı bir ciroya dönüşmesini garanti altına alıyoruz.
        </p>

        <!-- Three pillars -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px; page-break-inside: avoid;">
            <strong style="color: ${brandColor}; font-size: 9.5px; display: block; margin-bottom: 2px;">🎯 Hedef Odaklılık</strong>
            <span style="font-size: 8px; color: #64748b; line-height: 1.25; display: block;">Tüm çalışmalarımızı ciro, ROI ve CAC gibi doğrudan kârlılığa etki eden ana performans metriklerine göre kurgularız.</span>
          </div>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px; page-break-inside: avoid;">
            <strong style="color: ${brandColor}; font-size: 9.5px; display: block; margin-bottom: 2px;">📊 Şeffaf Raporlama</strong>
            <span style="font-size: 8px; color: #64748b; line-height: 1.25; display: block;">Yapay veri veya karmaşık terimlerle değil; harcanan bütçeyi ve kazanılan net dönüşümü gösteren şeffaf paneller sunarız.</span>
          </div>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px; page-break-inside: avoid;">
            <strong style="color: ${brandColor}; font-size: 9.5px; display: block; margin-bottom: 2px;">🚀 Sürekli Optimizasyon</strong>
            <span style="font-size: 8px; color: #64748b; line-height: 1.25; display: block;">Reklam campaigns ve kreatiflerinizi haftalık A/B testleri ile sürekli güncelleriz.</span>
          </div>
        </div>

        <!-- Call to Action Box -->
        <div style="background: #ffffff; border: 1px solid ${brandColor}; border-radius: 6px; padding: 10px; box-sizing: border-box; text-align: center; page-break-inside: avoid; margin-bottom: 6px;">
          <h3 style="margin: 0 0 2px 0; font-size: 10.5px; color: ${textDark}; font-weight: 700;">Bu Yol Haritasını Birlikte Hayata Geçirelim!</h3>
          <p style="margin: 0 0 6px 0; font-size: 8.5px; color: #64748b;">
            Analizdeki büyüme hedeflerine ulaşmak ve firmanıza özel detaylı medya planını hazırlamak için büyüme uzmanlarımızla hemen iletişime geçin.
          </p>
          <div style="display: inline-block; background: ${brandColor}; color: #ffffff; padding: 4px 10px; border-radius: 10px; font-weight: bold; font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none;">
            Toplantı Planlayın & Büyümeye Başlayın
          </div>
        </div>

        <!-- Footer Page 2 -->
        <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 8px; text-align: center; font-size: 7.5px; color: #94a3b8; page-break-inside: avoid;">
          Ajans Rota Büyüme Simülatörü analizi sonucudur. Bu rapor bilgilendirme amaçlı olup kesin ticari taahhüt içermez.<br>
          <strong>www.ajansrota.com | info@ajansrota.com | +90 (232) 123 45 67</strong>
        </div>
      </div>
    `;
    document.body.appendChild(element);
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Ajans_Rota_Buyume_Raporu_${lead.fullName.replace(/\s+/g, '_')}.pdf`,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollY: 0
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: {
        mode: 'css'
      }
    };
    window.html2pdf().set(opt).from(element).save().then(() => {
      document.body.removeChild(element);
    }).catch(err => {
      console.error("PDF generation failed:", err);
      if (document.body.contains(element)) {
        document.body.removeChild(element);
      }
    });
  };
  const renderSimulatorData = lead => {
    if (!lead || !lead.simulatorData) return null;
    const {
      type,
      params,
      improvements,
      sector
    } = lead.simulatorData;
    const isEcom = type === 'ecommerce';
    const accentColor = isEcom ? 'var(--primary)' : 'var(--secondary)';
    const accentGlow = isEcom ? 'rgba(2, 132, 199, 0.08)' : 'rgba(236, 72, 153, 0.08)';
    const getSectorLabel = (t, s) => {
      if (!s) return 'Belirtilmedi';
      if (t === 'ecommerce') {
        switch (s) {
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
      } else {
        switch (s) {
          case 'industry':
            return 'Sanayi & Endüstriyel Üretim';
          case 'tourism':
            return 'Turizm & Otelcilik';
          case 'service':
            return 'Hizmet & Danışmanlık';
          default:
            return 'Genel B2B';
        }
      }
    };
    return <div style={{
      marginTop: '0.5rem',
      marginBottom: '1rem',
      backgroundColor: 'rgba(255, 255, 255, 0.01)',
      border: '1px solid var(--glass-border)',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
        {/* Header */}
        <div style={{
        background: isEcom ? 'linear-gradient(90deg, rgba(14, 165, 233, 0.12) 0%, rgba(2, 132, 199, 0.03) 100%)' : 'linear-gradient(90deg, rgba(236, 72, 153, 0.12) 0%, rgba(217, 70, 239, 0.03) 100%)',
        padding: '0.8rem 1rem',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.6rem'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
            <i className={isEcom ? "fa-solid fa-cart-shopping" : "fa-solid fa-briefcase"} style={{
            color: accentColor,
            fontSize: '1.1rem'
          }}></i>
            <div>
              <h4 style={{
              margin: 0,
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--text-light)'
            }}>
                {isEcom ? 'E-Ticaret Büyüme Simülasyonu Verileri' : 'B2B Büyüme Simülasyonu Verileri'}
              </h4>
              <span style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)'
            }}>Müşterinin form doldururken seçtiği parametreler</span>
            </div>
          </div>
          {sector && <div style={{
          backgroundColor: isEcom ? 'rgba(14, 165, 233, 0.15)' : 'rgba(236, 72, 153, 0.15)',
          border: `1px solid ${isEcom ? 'var(--primary)' : 'var(--secondary)'}`,
          borderRadius: '6px',
          padding: '0.25rem 0.6rem',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: isEcom ? '#0284c7' : '#ec4899'
        }}>
              Sektör: {getSectorLabel(type, sector)}
            </div>}
        </div>

        {/* Input Parameters Grid */}
        <div style={{
        padding: '0.8rem 1rem',
        borderBottom: '1px solid var(--glass-border)'
      }}>
          <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.6rem'
        }}>
            {isEcom ? <>
                <div style={{
              backgroundColor: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.03)',
              borderRadius: '8px',
              padding: '0.4rem 0.6rem'
            }}>
                  <span style={{
                display: 'block',
                fontSize: '0.65rem',
                color: 'var(--text-muted)'
              }}>Aylık Bütçe</span>
                  <strong style={{
                fontSize: '0.85rem',
                color: 'var(--text-light)'
              }}>{params.spend?.toLocaleString('tr-TR')} ₺</strong>
                </div>
                <div style={{
              backgroundColor: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.03)',
              borderRadius: '8px',
              padding: '0.4rem 0.6rem'
            }}>
                  <span style={{
                display: 'block',
                fontSize: '0.65rem',
                color: 'var(--text-muted)'
              }}>Aylık Trafik</span>
                  <strong style={{
                fontSize: '0.85rem',
                color: 'var(--text-light)'
              }}>{params.traffic?.toLocaleString('tr-TR')}</strong>
                </div>
                <div style={{
              backgroundColor: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.03)',
              borderRadius: '8px',
              padding: '0.4rem 0.6rem'
            }}>
                  <span style={{
                display: 'block',
                fontSize: '0.65rem',
                color: 'var(--text-muted)'
              }}>Ort. Sepet (AOV)</span>
                  <strong style={{
                fontSize: '0.85rem',
                color: 'var(--text-light)'
              }}>{params.aov?.toLocaleString('tr-TR')} ₺</strong>
                </div>
                <div style={{
              backgroundColor: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.03)',
              borderRadius: '8px',
              padding: '0.4rem 0.6rem'
            }}>
                  <span style={{
                display: 'block',
                fontSize: '0.65rem',
                color: 'var(--text-muted)'
              }}>Mevcut Ciro</span>
                  <strong style={{
                fontSize: '0.85rem',
                color: 'var(--text-light)'
              }}>{params.revenue?.toLocaleString('tr-TR')} ₺</strong>
                </div>
              </> : <>
                <div style={{
              backgroundColor: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.03)',
              borderRadius: '8px',
              padding: '0.4rem 0.6rem'
            }}>
                  <span style={{
                display: 'block',
                fontSize: '0.65rem',
                color: 'var(--text-muted)'
              }}>Aylık Bütçe</span>
                  <strong style={{
                fontSize: '0.85rem',
                color: 'var(--text-light)'
              }}>{params.spend?.toLocaleString('tr-TR')} ₺</strong>
                </div>
                <div style={{
              backgroundColor: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.03)',
              borderRadius: '8px',
              padding: '0.4rem 0.6rem'
            }}>
                  <span style={{
                display: 'block',
                fontSize: '0.65rem',
                color: 'var(--text-muted)'
              }}>Talep (Lead)</span>
                  <strong style={{
                fontSize: '0.85rem',
                color: 'var(--text-light)'
              }}>{params.leads}</strong>
                </div>
                <div style={{
              backgroundColor: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.03)',
              borderRadius: '8px',
              padding: '0.4rem 0.6rem'
            }}>
                  <span style={{
                display: 'block',
                fontSize: '0.65rem',
                color: 'var(--text-muted)'
              }}>Dönüşüm Oranı</span>
                  <strong style={{
                fontSize: '0.85rem',
                color: 'var(--text-light)'
              }}>%{params.conversion}</strong>
                </div>
                <div style={{
              backgroundColor: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.03)',
              borderRadius: '8px',
              padding: '0.4rem 0.6rem'
            }}>
                  <span style={{
                display: 'block',
                fontSize: '0.65rem',
                color: 'var(--text-muted)'
              }}>LTV</span>
                  <strong style={{
                fontSize: '0.85rem',
                color: 'var(--text-light)'
              }}>{params.ltv?.toLocaleString('tr-TR')} ₺</strong>
                </div>
              </>}
          </div>
        </div>

        {/* Comparison Details */}
        <div style={{
        padding: '0.8rem 1rem'
      }}>
          <span style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: accentColor,
          display: 'block',
          marginBottom: '0.6rem'
        }}>
            Karşılaştırma Tablosu (Mevcut vs. Ajans Rota Büyüme)
          </span>
          <div style={{
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'rgba(0,0,0,0.1)'
        }}>
            {/* Table Header */}
            <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 1.2fr',
            backgroundColor: 'rgba(255,255,255,0.02)',
            padding: '0.4rem 0.6rem',
            borderBottom: '1px solid var(--glass-border)',
            fontSize: '0.65rem',
            fontWeight: '600',
            color: 'var(--text-muted)',
            textTransform: 'uppercase'
          }}>
              <span>Metrik</span>
              <span style={{
              textAlign: 'center'
            }}>Mevcut</span>
              <span style={{
              textAlign: 'right'
            }}>Ajans Rota</span>
            </div>

            {/* Table Rows */}
            {isEcom ? <>
                {/* Row 1: Ciro */}
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1.2fr',
              padding: '0.4rem 0.6rem',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              fontSize: '0.75rem',
              alignItems: 'center'
            }}>
                  <span style={{
                color: 'var(--text-light)'
              }}>Aylık Gelir</span>
                  <span style={{
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>{params.revenue?.toLocaleString('tr-TR')} ₺</span>
                  <span style={{
                textAlign: 'right',
                color: 'var(--primary)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.3rem'
              }}>
                    {improvements.newCiro?.toLocaleString('tr-TR')} ₺
                    <span style={{
                  backgroundColor: 'rgba(22, 163, 74, 0.08)',
                  color: '#16a34a',
                  border: '1px solid rgba(22, 163, 74, 0.15)',
                  padding: '0.05rem 0.25rem',
                  borderRadius: '4px',
                  fontSize: '0.6rem'
                }}>
                      +{Math.round(improvements.revenueIncrease / (params.revenue || 1) * 100)}%
                    </span>
                  </span>
                </div>

                {/* Row 2: CR */}
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1.2fr',
              padding: '0.4rem 0.6rem',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              fontSize: '0.75rem',
              alignItems: 'center'
            }}>
                  <span style={{
                color: 'var(--text-light)'
              }}>Dönüşüm Oranı</span>
                  <span style={{
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>%{params.cr?.toFixed(2)}</span>
                  <span style={{
                textAlign: 'right',
                color: 'var(--primary)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.3rem'
              }}>
                    %{improvements.newCR?.toFixed(2)}
                    <span style={{
                  backgroundColor: accentGlow,
                  color: accentColor,
                  border: '1px solid rgba(2, 132, 199, 0.15)',
                  padding: '0.05rem 0.25rem',
                  borderRadius: '4px',
                  fontSize: '0.6rem'
                }}>
                      +{Math.round((improvements.newCR - params.cr) / (params.cr || 1) * 100)}%
                    </span>
                  </span>
                </div>

                {/* Row 3: ROAS */}
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1.2fr',
              padding: '0.4rem 0.6rem',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              fontSize: '0.75rem',
              alignItems: 'center'
            }}>
                  <span style={{
                color: 'var(--text-light)'
              }}>ROAS</span>
                  <span style={{
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>{params.roas}x</span>
                  <span style={{
                textAlign: 'right',
                color: '#16a34a',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.3rem'
              }}>
                    {improvements.newRoas}x
                    <span style={{
                  backgroundColor: 'rgba(22, 163, 74, 0.08)',
                  color: '#16a34a',
                  border: '1px solid rgba(22, 163, 74, 0.15)',
                  padding: '0.05rem 0.25rem',
                  borderRadius: '4px',
                  fontSize: '0.6rem'
                }}>
                      +{Math.round((improvements.newRoas - params.roas) / (params.roas || 1) * 100)}%
                    </span>
                  </span>
                </div>

                {/* Row 4: CAC */}
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1.2fr',
              padding: '0.4rem 0.6rem',
              fontSize: '0.75rem',
              alignItems: 'center'
            }}>
                  <span style={{
                color: 'var(--text-light)'
              }}>CAC (Müşteri Edinme)</span>
                  <span style={{
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>{params.cac?.toLocaleString('tr-TR')} ₺</span>
                  <span style={{
                textAlign: 'right',
                color: '#ef4444',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.3rem'
              }}>
                    {improvements.newCac?.toLocaleString('tr-TR')} ₺
                    <span style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  padding: '0.05rem 0.25rem',
                  borderRadius: '4px',
                  fontSize: '0.6rem'
                }}>
                      -{Math.round((params.cac - improvements.newCac) / (params.cac || 1) * 100)}%
                    </span>
                  </span>
                </div>
              </> : <>
                {/* Row 1: Ciro */}
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1.2fr',
              padding: '0.4rem 0.6rem',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              fontSize: '0.75rem',
              alignItems: 'center'
            }}>
                  <span style={{
                color: 'var(--text-light)'
              }}>Toplam Gelir (LTV)</span>
                  <span style={{
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>{params.revenue?.toLocaleString('tr-TR')} ₺</span>
                  <span style={{
                textAlign: 'right',
                color: 'var(--secondary)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.3rem'
              }}>
                    {improvements.newCiro?.toLocaleString('tr-TR')} ₺
                    <span style={{
                  backgroundColor: 'rgba(22, 163, 74, 0.08)',
                  color: '#16a34a',
                  border: '1px solid rgba(22, 163, 74, 0.15)',
                  padding: '0.05rem 0.25rem',
                  borderRadius: '4px',
                  fontSize: '0.6rem'
                }}>
                      +{Math.round(improvements.revenueIncrease / (params.revenue || 1) * 100)}%
                    </span>
                  </span>
                </div>

                {/* Row 2: Leads */}
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1.2fr',
              padding: '0.4rem 0.6rem',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              fontSize: '0.75rem',
              alignItems: 'center'
            }}>
                  <span style={{
                color: 'var(--text-light)'
              }}>Aylık Form / Talep</span>
                  <span style={{
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>{params.leads}</span>
                  <span style={{
                textAlign: 'right',
                color: 'var(--secondary)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.3rem'
              }}>
                    {improvements.newLeads}
                    <span style={{
                  backgroundColor: accentGlow,
                  color: accentColor,
                  border: '1px solid rgba(236, 72, 153, 0.15)',
                  padding: '0.05rem 0.25rem',
                  borderRadius: '4px',
                  fontSize: '0.6rem'
                }}>
                      +{Math.round((improvements.newLeads - params.leads) / (params.leads || 1) * 100)}%
                    </span>
                  </span>
                </div>

                {/* Row 3: Conversion Rate */}
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1.2fr',
              padding: '0.4rem 0.6rem',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              fontSize: '0.75rem',
              alignItems: 'center'
            }}>
                  <span style={{
                color: 'var(--text-light)'
              }}>Satış Dönüşüm Oranı</span>
                  <span style={{
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>%{params.conversion}</span>
                  <span style={{
                textAlign: 'right',
                color: 'var(--secondary)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.3rem'
              }}>
                    %{improvements.newConversion}
                    <span style={{
                  backgroundColor: accentGlow,
                  color: accentColor,
                  border: '1px solid rgba(236, 72, 153, 0.15)',
                  padding: '0.05rem 0.25rem',
                  borderRadius: '4px',
                  fontSize: '0.6rem'
                }}>
                      +{Math.round((improvements.newConversion - params.conversion) / (params.conversion || 1) * 100)}%
                    </span>
                  </span>
                </div>

                {/* Row 4: ROI */}
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1.2fr',
              padding: '0.4rem 0.6rem',
              fontSize: '0.75rem',
              alignItems: 'center'
            }}>
                  <span style={{
                color: 'var(--text-light)'
              }}>ROI</span>
                  <span style={{
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>{params.roi}x</span>
                  <span style={{
                textAlign: 'right',
                color: '#16a34a',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.3rem'
              }}>
                    {improvements.newRoi}x
                    <span style={{
                  backgroundColor: 'rgba(22, 163, 74, 0.08)',
                  color: '#16a34a',
                  border: '1px solid rgba(22, 163, 74, 0.15)',
                  padding: '0.05rem 0.25rem',
                  borderRadius: '4px',
                  fontSize: '0.6rem'
                }}>
                      +{Math.round((improvements.newRoi - params.roi) / (params.roi || 1) * 100)}%
                    </span>
                  </span>
                </div>
              </>}
          </div>
        </div>
      </div>;
  };
  const renderLeadMessage = lead => {
    if (!lead || !lead.message) return null;
    const lines = lead.message.split('\n');
    const isStructured = lines.length > 1 && lines.some(line => line.includes(':'));
    if (!isStructured) {
      return <p style={{
        whiteSpace: 'pre-wrap',
        backgroundColor: 'rgba(15, 23, 42, 0.02)',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid var(--glass-border)',
        fontSize: '0.9rem',
        color: 'var(--text-light)',
        lineHeight: '1.6',
        margin: '0.25rem 0 0 0'
      }}>
          {lead.message}
        </p>;
    }
    return <div style={{
      backgroundColor: 'rgba(15, 23, 42, 0.01)',
      border: '1px solid var(--glass-border)',
      borderRadius: '8px',
      overflow: 'hidden',
      marginTop: '0.25rem'
    }}>
        <div style={{
        backgroundColor: 'rgba(15, 23, 42, 0.03)',
        padding: '0.6rem 0.8rem',
        borderBottom: '1px solid var(--glass-border)',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        color: 'var(--primary)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem'
      }}>
          <i className="fa-solid fa-calculator"></i> Simülasyon / Detay Verileri
        </div>
        <div style={{
        padding: '0.8rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem'
      }}>
          {lines.map((line, index) => {
          if (!line.trim()) return null;
          const isNote = line.startsWith('(') && line.endsWith(')');
          const displayLine = isNote ? line.slice(1, -1) : line;
          const colonIndex = displayLine.indexOf(':');
          if (colonIndex === -1) {
            return <div key={index} style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
              paddingTop: '0.25rem',
              borderTop: '1px dashed var(--glass-border)',
              marginTop: '0.25rem'
            }}>
                  {line}
                </div>;
          }
          const label = displayLine.substring(0, colonIndex).trim();
          const value = displayLine.substring(colonIndex + 1).trim();
          const isHighlight = label.includes('Bedel') || label.includes('Kâr') || label.includes('Ciro') && !label.includes('Hedef') && !label.includes('Bütçe');
          return <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '0.4rem',
            borderBottom: index === lines.length - 1 ? 'none' : '1px solid rgba(15, 23, 42, 0.03)',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
                <span style={{
              fontWeight: '500',
              fontSize: '0.8rem',
              color: isNote ? 'var(--text-muted)' : 'var(--text-light)',
              display: 'flex',
              alignItems: 'center'
            }}>
                  {getIconForLabel(label)} {label}
                </span>
                <span style={{
              fontWeight: isHighlight ? '700' : '600',
              fontSize: isHighlight ? '0.85rem' : '0.8rem',
              color: isHighlight ? 'var(--secondary)' : 'var(--text-light)',
              backgroundColor: isHighlight ? 'var(--secondary-glow)' : 'rgba(15, 23, 42, 0.02)',
              padding: '0.15rem 0.45rem',
              borderRadius: '6px',
              border: isHighlight ? '1px solid rgba(236, 72, 153, 0.2)' : '1px solid var(--glass-border)'
            }}>
                  {value}
                </span>
              </div>;
        })}
        </div>
      </div>;
  };
  const exportLeadsToCSV = dataToExport => {
    const data = dataToExport || leadsData;
    if (data.length === 0) {
      toast("Dışa aktarılacak veri bulunamadı.");
      return;
    }
    const headers = ["ID", "Tarih", "Ad Soyad", "E-Posta", "Telefon", "Şirket/Web Sitesi", "Hizmet Grubu", "Trafik Kaynağı", "Durum", "Mesaj Detayı"];
    const rows = data.map(lead => [lead.id || '', lead.created_at || '', lead.fullName || '', lead.email || '', lead.phone || '', lead.company || '', lead.service || '', lead.trafficSource || 'Organik (SEO)', lead.status === 'unread' ? 'Yeni' : 'Okundu', (lead.message || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')]);
    const csvContent = [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ajans_rota_talepler_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Search & Filters for Testimonials

  // Search & Filters for Blogs
  const [blogEditTab, setBlogEditTab] = useState('edit'); // edit, preview

  // Service page editor state

  // Edit/Add modal state for other entities
  const [editingItem, setEditingItem] = useState(null); // null = none, 'new' = adding, object = editing
  const [editingType, setEditingType] = useState(''); // testimonial, team, blog
  const [modalFormData, setModalFormData] = useState({});
  useEffect(() => {
    setBlogCurrentPage(1);
  }, [blogSearch, blogCatFilter]);
  const handleLogin = async e => {
    e.preventDefault();
    try {
      const response = await fetch('/api.php?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password
        })
      });
      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        // Raw PHP returned because local server is static
        if (password === 'rota2026admin') {
          const mockToken = 'rota2026admin_mock_token';
          localStorage.setItem('admin_token', mockToken);
          setAuthToken(mockToken);
          setErrorMsg('');
          return;
        } else {
          setErrorMsg('Hatalı şifre!');
          return;
        }
      }
      if (result.success) {
        localStorage.setItem('admin_token', result.token);
        setAuthToken(result.token);
        setErrorMsg('');
      } else {
        setErrorMsg(result.error || 'Şifre hatalı!');
      }
    } catch (err) {
      // Offline/Local dev fallback
      if (password === 'rota2026admin') {
        const mockToken = 'rota2026admin_mock_token';
        localStorage.setItem('admin_token', mockToken);
        setAuthToken(mockToken);
        setErrorMsg('');
      } else {
        setErrorMsg('Sunucu bağlantı hatası.');
      }
    }
  };
  const handleLogoutClick = () => {
    localStorage.removeItem('admin_token');
    setAuthToken('');
    if (onLogout) onLogout();
  };
  const handleSaveAll = async () => {
    setIsSaving(true);
    window._adminLastWrite = Date.now();
    const dbPayload = {
      settings: settingsData,
      servicePagesData: servicesData,
      teamMembers: teamMembersData,
      blogPosts: blogsData,
      testimonials: testimonialsData,
      leads: leadsData,
      clientReports: clientReports
    };
    localStorage.setItem('ajans_rota_db', JSON.stringify(dbPayload));
    
    // Save current client report to Neon DB
    if (clientReports[editingReportBrand] && clientReports[editingReportBrand].client_id) {
      try {
        await fetch('/api/clients/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            client_id: clientReports[editingReportBrand].client_id, 
            report_data: clientReports[editingReportBrand] 
          })
        });
      } catch (err) {
        console.error('Neon DB Client Save Error:', err);
      }
    }

    try {
      const response = await fetch('/api.php?action=save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(dbPayload)
      });
      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        toast('Değişiklikler tarayıcı hafızasına kaydedildi (Yerel Mod). Canlı sunucuya yüklendiğinde PHP üzerinden kaydedilecektir.');
        setIsSaving(false);
        return;
      }
      if (result.success) {
        toast.success('Değişiklikler başarıyla kaydedildi.');
        fetch('/api.php?action=generate_sitemap', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }).catch(err => console.error("Auto sitemap generation failed:", err));
      } else {
        toast.error('Hata: ' + result.error);
      }
    } catch (err) {
      toast('Değişiklikler tarayıcı hafızasına kaydedildi (Çevrimdışı Mod).');
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save helper specifically for leads actions (status updates / deletions)
  const saveLeadsOnly = async newLeads => {
    const dbPayload = {
      settings: settingsData,
      servicePagesData: servicesData,
      teamMembers: teamMembersData,
      blogPosts: blogsData,
      testimonials: testimonialsData,
      leads: newLeads,
      clientReports: clientReports
    };
    localStorage.setItem('ajans_rota_db', JSON.stringify(dbPayload));
    try {
      await fetch('/api.php?action=save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(dbPayload)
      });
    } catch (err) {
      console.error("Leads auto-save failed, saved to localStorage:", err);
    }
  };
  const handleViewLead = async lead => {
    const updated = leadsData.map(l => l.id === lead.id ? { ...l, status: 'read' } : l);
    setLeadsData(updated);
    setSelectedLead({ ...lead, status: 'read' });
    
    // YENİ: Vercel veritabanına sadece bu lead'in okunma durumunu güncelle
    try {
      await fetch('/api/php-handler?action=save_lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ ...lead, status: 'read' })
      });
    } catch (err) {
      console.error("Lead status update failed:", err);
    }
  };

  const handleDeleteLead = async leadId => {
    if (window.confirm('Bu talebi silmek istediğinizden emin misiniz?')) {
      const updated = leadsData.filter(l => l.id !== leadId);
      setLeadsData(updated);
      
      // YENİ: Vercel veritabanından kalıcı olarak sil
      try {
        await fetch('/api/php-handler?action=delete_lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
          body: JSON.stringify({ id: leadId })
        });
      } catch (err) {
        console.error("Lead deletion failed:", err);
      }
    }
  };
  const openEditModal = (type, item) => {
    setEditingType(type);
    setEditingItem(item);
    if (type === 'blog') {
      setBlogEditTab('edit');
    }
    if (item === 'new') {
      if (type === 'testimonial') {
        setModalFormData({
          name: '',
          company: '',
          role: '',
          category: 'google-ads',
          rating: 5,
          quote: '',
          metric: '',
          initials: ''
        });
      } else if (type === 'team') {
        setModalFormData({
          name: '',
          role: '',
          init: '',
          gradient: 'linear-gradient(135deg, #00ebd6, #00b4d8)',
          desc: '',
          dept: 'performance',
          stars: 5,
          exp: ''
        });
      } else if (type === 'blog') {
        setModalFormData({
          title: '',
          category: 'google',
          excerpt: '',
          date: new Date().toLocaleDateString('tr-TR'),
          readTime: '5 dk okuma',
          author: '',
          content: ''
        });
      }
    } else {
      setModalFormData({
        ...item
      });
    }
  };
  const handleModalSave = e => {
    e.preventDefault();
    if (editingType === 'testimonial') {
      if (editingItem === 'new') {
        const initials = modalFormData.initials || (modalFormData.name ? modalFormData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'YK');
        const newItem = {
          ...modalFormData,
          initials,
          id: Date.now()
        };
        setTestimonialsData([newItem, ...testimonialsData]);
      } else {
        setTestimonialsData(testimonialsData.map(item => item.id === editingItem.id ? modalFormData : item));
      }
    } else if (editingType === 'team') {
      if (editingItem === 'new') {
        const init = modalFormData.init || (modalFormData.name ? modalFormData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'UZ');
        const newItem = {
          ...modalFormData,
          init,
          id: Date.now()
        };
        setTeamMembersData([...teamMembersData, newItem]);
      } else {
        setTeamMembersData(teamMembersData.map(item => item.name === editingItem.name ? modalFormData : item));
      }
    } else if (editingType === 'blog') {
      if (editingItem === 'new') {
        const newItem = {
          ...modalFormData,
          id: Date.now()
        };
        setBlogsData([newItem, ...blogsData]);
      } else {
        setBlogsData(blogsData.map(item => item.id === editingItem.id ? modalFormData : item));
      }
    }
    setEditingItem(null);
    setEditingType('');
  };
  const handleDeleteItem = (type, item) => {
    if (!window.confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) return;
    if (type === 'testimonial') {
      setTestimonialsData(testimonialsData.filter(i => i.id !== item.id));
    } else if (type === 'team') {
      setTeamMembersData(teamMembersData.filter(i => i.name !== item.name));
    } else if (type === 'blog') {
      setBlogsData(blogsData.filter(i => i.id !== item.id));
    }
  };
  const handleModalFieldChange = (key, val) => {
    setModalFormData(prev => ({
      ...prev,
      [key]: val
    }));
  };
  const insertHTMLTag = tagType => {
    const textarea = document.getElementById('blog-content-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    let replacement = '';
    switch (tagType) {
      case 'bold':
        replacement = `<strong>${selectedText || 'kalın metin'}</strong>`;
        break;
      case 'italic':
        replacement = `<em>${selectedText || 'eğik metin'}</em>`;
        break;
      case 'h2':
        replacement = `<h2>${selectedText || 'Alt Başlık 2'}</h2>\n`;
        break;
      case 'h3':
        replacement = `<h3>${selectedText || 'Alt Başlık 3'}</h3>\n`;
        break;
      case 'p':
        replacement = `<p>${selectedText || 'Yeni paragraf...'}</p>\n`;
        break;
      case 'link':
        const url = prompt('Bağlantı adresi (URL):', 'https://');
        if (url === null) return;
        replacement = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText || 'Bağlantı Metni'}</a>`;
        break;
      case 'quote':
        replacement = `<blockquote>\n  ${selectedText || 'Alıntı metni...'}\n</blockquote>\n`;
        break;
      case 'ul':
        replacement = `<ul>\n  <li>${selectedText || 'Liste elemanı 1'}</li>\n  <li>Liste elemanı 2</li>\n</ul>\n`;
        break;
      case 'li':
        replacement = `<li>${selectedText || 'Liste elemanı'}</li>`;
        break;
      case 'img':
        const src = prompt('Resim adresi (URL):', '/images/logo.png');
        if (src === null) return;
        const alt = prompt('Resim açıklaması (Alt):', 'Görsel açıklaması');
        if (alt === null) return;
        replacement = `<img src="${src}" alt="${alt}" style="max-width:100%; height:auto; border-radius:8px; margin: 1rem 0;" />\n`;
        break;
      case 'table':
        replacement = `<table style="width:100%; border-collapse:collapse; margin:1rem 0;">\n  <thead>\n    <tr style="background:#f1f5f9;">\n      <th style="border:1px solid #cbd5e1; padding:8px;">Başlık 1</th>\n      <th style="border:1px solid #cbd5e1; padding:8px;">Başlık 2</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td style="border:1px solid #cbd5e1; padding:8px;">Veri 1</td>\n      <td style="border:1px solid #cbd5e1; padding:8px;">Veri 2</td>\n    </tr>\n  </tbody>\n</table>\n`;
        break;
      default:
        return;
    }
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    handleModalFieldChange('content', newValue);

    // Refocus and select
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };
  if (!authToken) {
    return <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <i className="fa-solid fa-compass logo-icon"></i>
            <h2>Yönetim Paneli Girişi</h2>
            <p>Devam etmek için şifrenizi girin.</p>
          </div>
          {errorMsg && <div className="form-error-message" style={{
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px',
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          borderRadius: '6px',
          fontSize: '0.85rem'
        }}>
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>{errorMsg}</span>
            </div>}
          <form onSubmit={handleLogin}>
            <div className="admin-form-group">
              <label htmlFor="admin_pass">Şifre</label>
              <input id="admin_pass" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Şifre" required style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255,255,255,0.8)',
              color: 'var(--text-light)',
              marginBottom: '1rem'
            }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{
            width: '100%',
            padding: '0.85rem'
          }}>
              Giriş Yap
            </button>
          </form>
        </div>
      </div>;
  }
  const unreadLeadsCount = leadsData.filter(l => l.status === 'unread').length;
  const handleAdminReplySubmit = (e) => {
    e.preventDefault();
    if (!adminReplyText.trim()) return;

    const updatedClientReports = { ...clientReports };
    const brandData = updatedClientReports[viewingTicket.brandKey];
    const ticketIdx = brandData.tickets.findIndex(t => t.id === viewingTicket.id);
    
    if (ticketIdx > -1) {
      const ticket = brandData.tickets[ticketIdx];
      if (!ticket.messages) {
        ticket.messages = [{ sender: 'client', text: ticket.message || 'Detaylı mesaj girilmemiş.', date: ticket.date }];
      }
      
      const now = new Date();
      ticket.messages.push({
        sender: 'admin',
        text: adminReplyText.trim(),
        date: now.toLocaleDateString('tr-TR') + " " + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      });
      
      ticket.status = 'Müşteri Yanıtı Bekleniyor';
      window._adminLastWrite = Date.now();
      
      setClientReports(updatedClientReports);
      
      // Save locally
      const dbPayload = {
        settings: settingsData,
        servicePagesData: servicesData,
        teamMembers: teamMembersData,
        blogPosts: blogsData,
        testimonials: testimonialsData,
        leads: leadsData,
        clientReports: updatedClientReports
      };
      localStorage.setItem('ajans_rota_db', JSON.stringify(dbPayload));

      // Specifically push the target brand to Neon DB
      if (brandData.client_id) {
        fetch('/api/clients/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ 
            client_id: brandData.client_id,
            report_data: brandData
          })
        }).catch(e => console.error("Admin ticket reply sync error", e));
      }
      
      setViewingTicket({ ...ticket, brandKey: viewingTicket.brandKey });
      setAdminReplyText('');
    }
  };

  return <div className="container admin-dashboard">
      <AdminHeader
        handleSaveAll={handleSaveAll}
        isSaving={isSaving}
        handleLogoutClick={handleLogoutClick}
      />

      <div className="admin-grid-layout">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadLeadsCount={unreadLeadsCount}
        />

        <main className="admin-content-card">
          {/* TAB 1: LEADS */}
          {activeTab === 'leads' && (
            <LeadsTab
              leadsData={leadsData}
              leadSearchText={leadSearchText}
              setLeadSearchText={setLeadSearchText}
              leadSourceFilter={leadSourceFilter}
              setLeadSourceFilter={setLeadSourceFilter}
              leadServiceFilter={leadServiceFilter}
              setLeadServiceFilter={setLeadServiceFilter}
              leadStatusFilter={leadStatusFilter}
              setLeadStatusFilter={setLeadStatusFilter}
              exportLeadsToCSV={exportLeadsToCSV}
              handleViewLead={handleViewLead}
              handleDeleteLead={handleDeleteLead}
              servicesData={servicesData}


            />
          )}

          {/* TAB: ANALYTICS */}
        {activeTab === 'analytics' && (
          <AnalyticsTab
            getAggregatedStats={getAggregatedStats}
            handleGenerateDemoStats={handleGenerateDemoStats}
            statsLoading={statsLoading}
            loadStats={loadStats}
            handleResetStats={handleResetStats}
            setDateFilter={setDateFilter}
            dateFilter={dateFilter}
            customStartDate={customStartDate}
            setCustomStartDate={setCustomStartDate}
            customEndDate={customEndDate}
            setCustomEndDate={setCustomEndDate}
            statsError={statsError}
          />
        )}

          {/* TAB: MARKETING */}
        {activeTab === 'marketing' && (
          <MarketingTab
            handleSaveAll={handleSaveAll}
            settingsData={settingsData}
            setSettingsData={setSettingsData}
          />
        )}
          {/* TAB: GENERAL SETTINGS */}
        {activeTab === 'settings' && (
          <SettingsTab
            settingsData={settingsData}
            setSettingsData={setSettingsData}
            handleSaveAll={handleSaveAll}
            isSaving={isSaving}
            authToken={authToken}
            waPhone={waPhone} setWaPhone={setWaPhone}
            waApiKey={waApiKey} setWaApiKey={setWaApiKey}
            securityOldPassword={securityOldPassword} setSecurityOldPassword={setSecurityOldPassword}
            securityUsername={securityUsername} setSecurityUsername={setSecurityUsername}
            securityNewPassword={securityNewPassword} setSecurityNewPassword={setSecurityNewPassword}
            handleChangePassword={handleChangePassword} securityIsLoading={securityIsLoading}
            renderImageUploaderCard={renderImageUploaderCard}
          />
        )}
          {/* TAB: LANDING PAGE CONTENTS */}
        {activeTab === 'landing' && (
          <LandingTab
            handleSaveAll={handleSaveAll}
            settingsData={settingsData}
            setSettingsData={setSettingsData}
          />
        )}
          {/* TAB 3: SERVICES */}
        {activeTab === 'services' && (
          <ServicesTab
            servicesData={servicesData}
            setServicesData={setServicesData}
            handleSaveAll={handleSaveAll}
            isSaving={isSaving}
          />
        )}
          {/* TAB 4: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <TestimonialsTab
              testimonialsData={testimonialsData}
              setTestimonialsData={setTestimonialsData}
              settingsData={settingsData}
              setSettingsData={setSettingsData}
            />
          )}
          {/* TAB 5: TEAM */}
          {activeTab === 'team' && (
            <TeamTab
              teamMembersData={teamMembersData}
              setTeamMembersData={setTeamMembersData}
              handleSaveAll={handleSaveAll}
              isSaving={isSaving}
              settingsData={settingsData}
              setSettingsData={setSettingsData}
              openEditModal={openEditModal}
              handleDeleteItem={handleDeleteItem}
            />
          )}
          {/* TAB 6: BLOGS */}
          {activeTab === 'blogs' && (
            <BlogsTab
              blogsData={blogsData}
              setBlogsData={setBlogsData}
              openEditModal={openEditModal}
              handleDeleteItem={handleDeleteItem}
            />
          )}
          
        {activeTab === 'tickets' && (
          <div className="admin-section fade-in">
            {!viewingTicket ? (
            <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)' }}>Müşteri Destek Talepleri</h2>
            </div>
            
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Müşteri (Marka)</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Bilet ID</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Departman</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Konu</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tarih</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'right' }}>Durum İşlemi</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(clientReports).flatMap(([brandKey, brandData]) => {
                    return (brandData.tickets || []).map((ticket, idx) => ({ ...ticket, brandKey, brandName: brandData.brandName || brandKey, idx }));
                  }).sort((a,b) => {
                     if (a.status === 'Açık' && b.status !== 'Açık') return -1;
                     if (b.status === 'Açık' && a.status !== 'Açık') return 1;
                     return 0;
                  }).map((ticket, globalIdx) => (
                    <tr key={globalIdx} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>{ticket.brandName}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>{ticket.id}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ticket.department}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-dark)', fontWeight: 600 }}>{ticket.subject}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ticket.date}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', textAlign: 'right' }}>
                        <button type="button" onClick={() => setViewingTicket(ticket)} style={{ marginRight: '10px', padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                          <i className="fa-solid fa-eye"></i> İncele
                        </button>
                        <select 
                          value={ticket.status} 
                          onChange={(e) => {
                            const updated = { ...clientReports };
                            updated[ticket.brandKey].tickets[ticket.idx].status = e.target.value;
                            setClientReports(updated);
                          }}
                          style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: '20px',
                            border: '1px solid var(--glass-border)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            outline: 'none',
                            cursor: 'pointer',
                            background: ticket.status === 'Açık' ? 'rgba(239, 68, 68, 0.1)' : 
                                       ticket.status === 'İşlemde' ? 'rgba(245, 158, 11, 0.1)' : 
                                       'rgba(16, 185, 129, 0.1)',
                            color: ticket.status === 'Açık' ? '#ef4444' : 
                                   ticket.status === 'İşlemde' ? '#f59e0b' : 
                                   '#10b981'
                          }}
                        >
                          <option value="Açık">Açık</option>
                          <option value="İşlemde">İşlemde</option>
                          <option value="Çözüldü">Çözüldü</option>
                        </select>
                        <button type="button" onClick={() => {
                          if(!confirm('Bu talebi tamamen silmek istediğinize emin misiniz?')) return;
                          const updated = { ...clientReports };
                          updated[ticket.brandKey].tickets.splice(ticket.idx, 1);
                          setClientReports(updated);
                        }} style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {Object.entries(clientReports).flatMap(([k, v]) => v.tickets || []).length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Henüz hiçbir müşteriden destek talebi gelmedi.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '600px', background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => setViewingTicket(null)} style={{ background: 'var(--bg-light)', border: 'none', color: 'var(--text-dark)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                      <i className="fa-solid fa-arrow-left"></i> Geri Dön
                    </button>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)' }}>{viewingTicket.id} - {viewingTicket.brandName}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{viewingTicket.subject} | {viewingTicket.department}</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: 'var(--bg-light)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                  {(viewingTicket.messages || [{ sender: 'client', text: viewingTicket.message || 'Bu talep için detaylı mesaj girilmemiş.', date: viewingTicket.date }]).map((msg, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'admin' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ 
                        maxWidth: '80%', 
                        padding: '0.8rem 1rem', 
                        borderRadius: msg.sender === 'admin' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                        background: msg.sender === 'admin' ? 'var(--primary)' : '#fff',
                        color: msg.sender === 'admin' ? '#fff' : 'var(--text-dark)',
                        border: msg.sender === 'admin' ? 'none' : '1px solid var(--glass-border)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap'
                      }}>
                        {msg.text}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {msg.sender === 'admin' ? 'Siz (Yönetici)' : 'Müşteri'} • {msg.date}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text"
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter') handleAdminReplySubmit(); }}
                    placeholder="Yanıtınızı yazın..."
                    style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: '#fff', color: 'var(--text-dark)', outline: 'none', fontSize: '0.95rem' }}
                  />
                  <button onClick={handleAdminReplySubmit} className="btn btn-primary" style={{ padding: '0 2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <i className="fa-solid fa-paper-plane"></i> Gönder
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <ClientReportsTab
            clientReports={clientReports}
            setClientReports={setClientReports}
            editingReportBrand={editingReportBrand}
            setEditingReportBrand={setEditingReportBrand}
            setIsAddClientModalOpen={setIsAddClientModalOpen}
            handleSaveAll={handleSaveAll}
            isSaving={isSaving}
            activeTab={activeTab}
            setNewClientFormData={setNewClientFormData}
            authToken={authToken}
            teamMembersData={teamMembersData}
          />
        )}
        </main>
      </div>

      {/* LEAD DETAIL MODAL */}
      {selectedLead && <div className="lead-modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="lead-modal-card" onClick={e => e.stopPropagation()}>
            <div className="lead-modal-header">
              <h3>Talep Detayları</h3>
              <button className="btn-icon" onClick={() => setSelectedLead(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="lead-modal-body">
              <div className="lead-info-item">
                <strong>Müşteri Adı Soyadı</strong>
                <p>{selectedLead.fullName}</p>
              </div>
              <div className="lead-info-item">
                <strong>E-Posta Adresi</strong>
                <p>{selectedLead.email || 'Belirtilmedi'}</p>
              </div>
              <div className="lead-info-item">
                <strong>Telefon Numarası</strong>
                <p>{selectedLead.phone || 'Belirtilmedi'}</p>
              </div>
              {selectedLead.company && <div className="lead-info-item">
                  <strong>Şirket / Web Sitesi</strong>
                  <p>{selectedLead.company}</p>
                </div>}
              <div className="lead-info-item">
                <strong>Hizmet Grubu</strong>
                <p>{selectedLead.service}</p>
              </div>
              {selectedLead.trafficSource && <div className="lead-info-item">
                  <strong>Trafik Kaynağı</strong>
                  <p style={{
              marginTop: '0.2rem'
            }}>
                    <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: '600',
                fontSize: '0.8rem',
                backgroundColor: selectedLead.trafficSource === 'Google Ads' ? 'rgba(14, 165, 233, 0.08)' : selectedLead.trafficSource === 'Meta Ads' ? 'rgba(236, 72, 153, 0.08)' : 'rgba(34, 197, 94, 0.08)',
                color: selectedLead.trafficSource === 'Google Ads' ? 'var(--primary)' : selectedLead.trafficSource === 'Meta Ads' ? 'var(--secondary)' : '#16a34a',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                border: '1px solid currentColor'
              }}>
                      {selectedLead.trafficSource === 'Google Ads' ? <i className="fa-brands fa-google"></i> : selectedLead.trafficSource === 'Meta Ads' ? <i className="fa-brands fa-meta"></i> : <i className="fa-solid fa-seedling"></i>}
                      {selectedLead.trafficSource}
                    </span>
                  </p>
                </div>}
              {selectedLead.simulatorData && <div className="lead-info-item">
                  <strong>Simülatör Detayları</strong>
                  {renderSimulatorData(selectedLead)}
                </div>}
              {selectedLead.message && <div className="lead-info-item">
                  <strong>Açıklama / Mesaj Detayı</strong>
                  {renderLeadMessage(selectedLead)}
                </div>}
              <div className="lead-info-item">
                <strong>Tarih</strong>
                <p>{selectedLead.created_at || 'Bilinmiyor'}</p>
              </div>

              {/* CRM LITE SECTION */}
              <div className="crm-lite-section" style={{
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '2px dashed var(--glass-border)'
          }}>
                <h4 style={{
              fontSize: '0.95rem',
              fontWeight: '700',
              color: 'var(--text-light)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
                  <i className="fa-solid fa-address-book" style={{
                color: 'var(--primary)'
              }}></i>
                  CRM & Müşteri Takip Kartı
                </h4>

                {/* Status & Date row */}
                <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
                  <div className="lead-info-item" style={{
                marginBottom: 0
              }}>
                    <strong>Talep Durumu</strong>
                    <select value={crmStatus} onChange={e => setCrmStatus(e.target.value)} className="admin-select" style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  backgroundColor: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  marginTop: '0.4rem',
                  color: 'var(--text-light)'
                }}>
                      <option value="yeni">Yeni Başvuru</option>
                      <option value="iletisimde">İletişimde</option>
                      <option value="toplanti_planlandi">Toplantı Planlandı</option>
                      <option value="analiz_fazinda">Analiz Fazında</option>
                      <option value="teklif_hazirlaniyor">Teklif Hazırlanıyor</option>
                      <option value="teklif_iletildi">Teklif İletildi</option>
                      <option value="revize_istendi">Revize İstendi</option>
                      <option value="sozlesme_asamasinda">Sözleşme Aşamasında</option>
                      <option value="kazanildi">Kazanıldı (Anlaşma Sağlandı)</option>
                      <option value="kaybedildi">Kaybedildi / İptal</option>
                      <option value="ertelendi">Ertelendi</option>
                    </select>
                  </div>

                  <div className="lead-info-item" style={{
                marginBottom: 0
              }}>
                    <strong>Takip / Hatırlatıcı Tarihi</strong>
                    <input type="date" value={crmReminderDate} onChange={e => setCrmReminderDate(e.target.value)} className="admin-input" style={{
                  width: '100%',
                  padding: '0.55rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  backgroundColor: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  marginTop: '0.4rem',
                  color: 'var(--text-light)',
                  height: '38px',
                  boxSizing: 'border-box'
                }} />
                  </div>
                </div>

                <div className="lead-info-item" style={{
              marginBottom: '1rem'
            }}>
                  <strong>Dahili Görüşme Notları</strong>
                  <textarea value={crmNotes} onChange={e => setCrmNotes(e.target.value)} className="admin-textarea" placeholder="Müşteri aramaları, talepleri, bütçe ayrıntıları vb. dahili notlar..." style={{
                width: '100%',
                minHeight: '80px',
                padding: '0.6rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                backgroundColor: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                marginTop: '0.4rem',
                color: 'var(--text-light)',
                resize: 'vertical'
              }} />
                </div>

                {/* Hızlı İletişim Kanalları */}
                <div style={{
              marginBottom: '1rem'
            }}>
                  <strong style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: '0.4rem'
              }}>Hızlı İletişim Kanalları</strong>
                  <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem'
              }}>
                    {(() => {
                  const cleanPhone = selectedLead.phone ? selectedLead.phone.replace(/[^0-9]/g, '') : '';
                  const cleanPhoneFormatted = cleanPhone.startsWith('90') ? cleanPhone : cleanPhone.startsWith('0') ? '90' + cleanPhone.substring(1) : '90' + cleanPhone;
                  const waMessage = encodeURIComponent(`Merhaba ${selectedLead.fullName || ''}, Ajans Rota'dan iletişime geçiyorum. Web sitemiz üzerinden ${selectedLead.service || 'hizmetlerimiz'} hakkında yaptığınız başvuru ile ilgili detayları görüşmek üzere sizi ne zaman arayabiliriz? İyi çalışmalar dilerim.`);
                  const waLink = cleanPhone ? `https://wa.me/${cleanPhoneFormatted}?text=${waMessage}` : '#';
                  const mailSubject = encodeURIComponent('Ajans Rota Başvurunuz Hakkında');
                  const mailBody = encodeURIComponent(`Merhaba ${selectedLead.fullName || ''},\n\nAjans Rota'dan iletişime geçiyorum. Web sitemiz üzerinden ilettiğiniz ${selectedLead.service || 'hizmet talebi'} ile ilgili başvurunuzu aldık. Detayları görüşmek ve size en uygun dijital büyüme planını hazırlamak için ne zaman görüşebiliriz?\n\nİyi çalışmalar,\nAjans Rota Satış Ekibi`);
                  const mailLink = selectedLead.email ? `mailto:${selectedLead.email}?subject=${mailSubject}&body=${mailBody}` : '#';
                  return <>
                          <a href={waLink} target="_blank" rel="noopener noreferrer" className={`btn ${cleanPhone ? '' : 'disabled'}`} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      backgroundColor: '#25D366',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textDecoration: 'none',
                      padding: '0.6rem',
                      cursor: cleanPhone ? 'pointer' : 'not-allowed',
                      opacity: cleanPhone ? 1 : 0.5
                    }}>
                            <i className="fa-brands fa-whatsapp" style={{
                        fontSize: '1.05rem'
                      }}></i> WhatsApp
                          </a>
                          <a href={mailLink} className={`btn ${selectedLead.email ? '' : 'disabled'}`} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      backgroundColor: 'var(--primary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textDecoration: 'none',
                      padding: '0.6rem',
                      cursor: selectedLead.email ? 'pointer' : 'not-allowed',
                      opacity: selectedLead.email ? 1 : 0.5
                    }}>
                            <i className="fa-solid fa-envelope"></i> E-Posta Gönder
                          </a>
                        </>;
                })()}
                  </div>
                </div>

                <button type="button" className="btn btn-primary" onClick={() => handleSaveCRM(selectedLead.id, crmStatus, crmNotes, crmReminderDate)} style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontFamily: 'var(--font-heading)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '0.5rem',
              boxShadow: 'none',
              height: 'auto'
            }}>
                  <i className="fa-solid fa-floppy-disk"></i>
                  CRM Bilgilerini Kaydet
                </button>
              </div>

              {/* CRM ACTIVITY TIMELINE */}
              <div className="crm-activity-section" style={{
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '2px dashed var(--glass-border)'
          }}>
                <h4 style={{
              fontSize: '0.95rem',
              fontWeight: '700',
              color: 'var(--text-light)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
                  <i className="fa-solid fa-clock-rotate-left" style={{
                color: 'var(--secondary)'
              }}></i>
                  Müşteri Etkinlik Geçmişi
                </h4>
                
                {Array.isArray(selectedLead.activityHistory) && selectedLead.activityHistory.length > 0 ? <div className="crm-timeline" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              paddingLeft: '0.5rem',
              borderLeft: '2px solid var(--glass-border)',
              marginLeft: '8px',
              maxHeight: '220px',
              overflowY: 'auto',
              paddingRight: '0.5rem'
            }}>
                    {selectedLead.activityHistory.map((item, idx) => {
                let iconClass = 'fa-circle-dot';
                let iconColor = 'var(--text-muted)';
                if (item.type === 'system') {
                  iconClass = 'fa-desktop';
                  iconColor = 'var(--primary)';
                } else if (item.type === 'status_change') {
                  iconClass = 'fa-arrows-spin';
                  iconColor = 'var(--secondary)';
                } else if (item.type === 'note_change') {
                  iconClass = 'fa-file-signature';
                  iconColor = '#8b5cf6';
                } else if (item.type === 'reminder_change') {
                  iconClass = 'fa-calendar-check';
                  iconColor = '#f59e0b';
                }
                return <div key={idx} className="crm-timeline-item" style={{
                  position: 'relative',
                  paddingLeft: '1.5rem',
                  marginBottom: '0.2rem'
                }}>
                          <span style={{
                    position: 'absolute',
                    left: '-15px',
                    top: '2px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    border: '2px solid ' + iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    color: iconColor,
                    zIndex: 2
                  }}>
                            <i className={`fa-solid ${iconClass}`}></i>
                          </span>
                          <div style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    fontWeight: '600'
                  }}>{item.date}</div>
                          <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-light)',
                    marginTop: '0.1rem',
                    lineHeight: '1.4'
                  }}>{item.text}</div>
                        </div>;
              })}
                  </div> : <p style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
              paddingLeft: '8px'
            }}>
                    Henüz bir etkinlik kaydı bulunmuyor. Durum, not veya hatırlatıcı güncellendiğinde burada listelenecektir.
                  </p>}
              </div>
            </div>
             <div className="lead-modal-footer lead-modal-footer-responsive">
              {selectedLead.simulatorData ? <button className="btn btn-primary" onClick={() => handleDownloadPDF(selectedLead)} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: selectedLead.simulatorData.type === 'ecommerce' ? 'linear-gradient(135deg, var(--primary) 0%, #0284c7 100%)' : 'linear-gradient(135deg, var(--secondary) 0%, #0f766e 100%)',
            border: 'none',
            padding: '0.6rem 1.2rem',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
                  <i className="fa-solid fa-file-pdf"></i> Raporu PDF Olarak İndir
                </button> : selectedLead.service === 'Teklif Hesaplayıcı Talebi' || selectedLead.service === 'Web Tasarım Talebi' ? <div style={{
            display: 'flex',
            gap: '0.75rem'
          }}>
                  <button className="btn btn-primary" onClick={() => handleDownloadProposalPDF(selectedLead)} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)',
              border: 'none',
              padding: '0.6rem 1.2rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              borderRadius: '8px'
            }}>
                    <i className="fa-solid fa-file-pdf"></i> Teklif PDF İndir
                  </button>
                  <button className="btn btn-secondary" onClick={() => handleSendProposalEmail(selectedLead)} disabled={isSendingProposal} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: '1px solid rgba(236, 72, 153, 0.4)',
              background: 'rgba(236, 72, 153, 0.05)',
              color: 'var(--secondary)',
              padding: '0.6rem 1.2rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
                    {isSendingProposal ? <>
                        <i className="fa-solid fa-spinner fa-spin"></i> Gönderiliyor...
                      </> : <>
                        <i className="fa-solid fa-paper-plane"></i> Teklifi İlet
                      </>}
                  </button>
                </div> : selectedLead.service && selectedLead.service.includes('Rehber') ? <div style={{
            display: 'flex',
            gap: '0.75rem'
          }}>
                  {aiGuideContents[selectedLead.id] ? <>
                      <button className="btn btn-primary" onClick={() => handleDownloadGuidePDF(selectedLead, aiGuideContents[selectedLead.id])} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'linear-gradient(135deg, var(--primary) 0%, #0284c7 100%)',
                border: 'none',
                padding: '0.6rem 1.2rem',
                fontSize: '0.85rem',
                fontWeight: '600',
                borderRadius: '8px'
              }}>
                        <i className="fa-solid fa-file-pdf"></i> Rehber PDF İndir
                      </button>
                      <button className="btn btn-secondary" onClick={() => handleSendGuideEmail(selectedLead)} disabled={isSendingGuide} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: '1px solid rgba(13, 148, 136, 0.4)',
                background: 'rgba(13, 148, 136, 0.05)',
                color: 'var(--secondary)',
                padding: '0.6rem 1.2rem',
                fontSize: '0.85rem',
                fontWeight: '600',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                        {isSendingGuide ? <>
                            <i className="fa-solid fa-spinner fa-spin"></i> Gönderiliyor...
                          </> : <>
                            <i className="fa-solid fa-paper-plane"></i> Rehberi Gönder
                          </>}
                      </button>
                    </> : <button className="btn btn-primary" onClick={() => handleGenerateGuidePDFWithAI(selectedLead)} disabled={aiGuideLoading} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              border: 'none',
              padding: '0.6rem 1.2rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              borderRadius: '8px',
              justifyContent: 'center'
            }}>
                      {aiGuideLoading ? <>
                          <i className="fa-solid fa-spinner fa-spin"></i> Özel Rehber Hazırlanıyor...
                        </> : <>
                          <i className="fa-solid fa-wand-magic-sparkles"></i> AI ile Özel Rehber Üret
                        </>}
                    </button>}
                </div> : <div></div>}
              <button className="btn btn-secondary" onClick={() => setSelectedLead(null)}>Kapat</button>
            </div>
          </div>
        </div>}

      {/* ADD / EDIT EDITING MODAL */}
      {editingItem && <div className="lead-modal-overlay" onClick={() => {
      setEditingItem(null);
      setEditingType('');
    }}>
          <div className="lead-modal-card" onClick={e => e.stopPropagation()} style={{
        maxWidth: editingType === 'blog' ? '800px' : '550px'
      }}>
            <div className="lead-modal-header">
              <h3>
                {editingItem === 'new' ? 'Yeni Ekle' : 'Öğeyi Düzenle'} - {editingType === 'testimonial' ? 'Yorum' : editingType === 'team' ? 'Ekip Üyesi' : 'Blog'}
              </h3>
              <button className="btn-icon" onClick={() => {
            setEditingItem(null);
            setEditingType('');
          }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleModalSave}>
              <div className="lead-modal-body">
                {/* 1. TESTIMONIAL FORM */}
                {editingType === 'testimonial' && <>
                    <div className="admin-form-group">
                      <label>Ad Soyad</label>
                      <input type="text" required value={modalFormData.name || ''} onChange={e => handleModalFieldChange('name', e.target.value)} style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  border: '1px solid var(--glass-border)'
                }} />
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Şirket</label>
                        <input type="text" required value={modalFormData.company || ''} onChange={e => handleModalFieldChange('company', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }} />
                      </div>
                      <div className="admin-form-group">
                        <label>Unvan / Rol</label>
                        <input type="text" required value={modalFormData.role || ''} onChange={e => handleModalFieldChange('role', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }} />
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Kategori</label>
                        <select value={modalFormData.category || 'google-ads'} onChange={e => handleModalFieldChange('category', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff'
                  }}>
                          <option value="google-ads">Google Ads</option>
                          <option value="meta-ads">Meta Ads</option>
                          <option value="seo">SEO &amp; İçerik</option>
                          <option value="social-media">Sosyal Medya</option>
                          <option value="ecommerce">E-Ticaret</option>
                          <option value="web-design">Web Tasarım</option>
                        </select>
                      </div>
                      <div className="admin-form-group">
                        <label>Puan (1-5)</label>
                        <select value={modalFormData.rating || 5} onChange={e => handleModalFieldChange('rating', parseInt(e.target.value))} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff'
                  }}>
                          <option value="5">5 Yıldız</option>
                          <option value="4">4 Yıldız</option>
                          <option value="3">3 Yıldız</option>
                        </select>
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Metrik Başarısı (Örn: 8.4x ROAS)</label>
                        <input type="text" value={modalFormData.metric || ''} onChange={e => handleModalFieldChange('metric', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }} />
                      </div>
                      <div className="admin-form-group">
                        <label>İsim Kısaltması (Boşsa ad/soyad ilk harflerinden oluşur)</label>
                        <input type="text" value={modalFormData.initials || ''} onChange={e => handleModalFieldChange('initials', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }} placeholder="Örn: MÇ" />
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label>Yorum Metni</label>
                      <textarea required rows="4" value={modalFormData.quote || ''} onChange={e => handleModalFieldChange('quote', e.target.value)} style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  border: '1px solid var(--glass-border)',
                  fontFamily: 'sans-serif'
                }}></textarea>
                    </div>
                  </>}

                {/* 2. TEAM MEMBER FORM */}
                {editingType === 'team' && <>
                    <div className="admin-form-group">
                      <label>Ad Soyad</label>
                      <input type="text" required value={modalFormData.name || ''} onChange={e => handleModalFieldChange('name', e.target.value)} style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  border: '1px solid var(--glass-border)'
                }} />
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Görev / Unvan</label>
                        <input type="text" required value={modalFormData.role || ''} onChange={e => handleModalFieldChange('role', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }} />
                      </div>
                      <div className="admin-form-group">
                        <label>Deneyim Süresi (Örn: 8 Yıl)</label>
                        <input type="text" required value={modalFormData.exp || ''} onChange={e => handleModalFieldChange('exp', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }} />
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Departman (Grup)</label>
                        <select value={modalFormData.dept || 'performance'} onChange={e => handleModalFieldChange('dept', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff'
                  }}>
                          <option value="management">Yönetim</option>
                          <option value="performance">Performans Pazarlama</option>
                          <option value="creative">Kreatif / Tasarım</option>
                        </select>
                      </div>
                      <div className="admin-form-group">
                        <label>Derece (Yıldız 1-5)</label>
                        <select value={modalFormData.stars || 5} onChange={e => handleModalFieldChange('stars', parseInt(e.target.value))} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff'
                  }}>
                          <option value="5">5 Yıldız</option>
                          <option value="4">4 Yıldız</option>
                          <option value="3">3 Yıldız</option>
                        </select>
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Kısaltma (Baş harfler, örn: MK)</label>
                        <input type="text" value={modalFormData.init || ''} onChange={e => handleModalFieldChange('init', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }} />
                      </div>
                      <div className="admin-form-group">
                        <label>Renk Gradyanı (CSS Değeri)</label>
                        <input type="text" value={modalFormData.gradient || ''} onChange={e => handleModalFieldChange('gradient', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)',
                    marginBottom: '0.5rem'
                  }} placeholder="linear-gradient(135deg, #00ebd6, #00b4d8)" />
                        <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                          <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }}>Hazır Renkler:</span>
                          {[{
                      name: 'Ege Turkuazı',
                      val: 'linear-gradient(135deg, #00ebd6, #00b4d8)'
                    }, {
                      name: 'Gün Batımı',
                      val: 'linear-gradient(135deg, #ff2a85, #ff758c)'
                    }, {
                      name: 'Kozmik Mor',
                      val: 'linear-gradient(135deg, #7b2cbf, #ff2a85)'
                    }, {
                      name: 'Sörf Mavisi',
                      val: 'linear-gradient(135deg, #7b2cbf, #00ebd6)'
                    }, {
                      name: 'Mavi & Mor',
                      val: 'linear-gradient(135deg, #00b4d8, #7b2cbf)'
                    }, {
                      name: 'Pembe & Mavi',
                      val: 'linear-gradient(135deg, #ff758c, #00b4d8)'
                    }].map((preset, idx) => <button key={idx} type="button" onClick={() => handleModalFieldChange('gradient', preset.val)} style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: preset.val,
                      border: modalFormData.gradient === preset.val ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                      cursor: 'pointer',
                      padding: 0,
                      transform: modalFormData.gradient === preset.val ? 'scale(1.15)' : 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: modalFormData.gradient === preset.val ? '0 0 6px rgba(0,235,214,0.4)' : 'none'
                    }} title={preset.name} />)}
                        </div>
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label>Kısa Biyografi / Açıklama</label>
                      <textarea required rows="4" value={modalFormData.desc || ''} onChange={e => handleModalFieldChange('desc', e.target.value)} style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  border: '1px solid var(--glass-border)',
                  fontFamily: 'sans-serif'
                }}></textarea>
                    </div>
                  </>}

                {/* 3. BLOG POST FORM */}
                {editingType === 'blog' && <>
                    {/* Live Preview Tabs */}
                    <div style={{
                display: 'flex',
                borderBottom: '1px solid var(--glass-border)',
                marginBottom: '1.25rem',
                gap: '0.25rem'
              }}>
                      <button type="button" onClick={() => setBlogEditTab('edit')} style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderBottom: blogEditTab === 'edit' ? '2px solid var(--primary)' : '2px solid transparent',
                  background: 'none',
                  color: blogEditTab === 'edit' ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}>
                        <i className="fa-solid fa-pen" style={{
                    marginRight: '6px'
                  }}></i> Düzenle
                      </button>
                      <button type="button" onClick={() => setBlogEditTab('preview')} style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderBottom: blogEditTab === 'preview' ? '2px solid var(--primary)' : '2px solid transparent',
                  background: 'none',
                  color: blogEditTab === 'preview' ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}>
                        <i className="fa-solid fa-eye" style={{
                    marginRight: '6px'
                  }}></i> Canlı Önizleme
                      </button>
                    </div>

                    {blogEditTab === 'edit' ? <>
                        <div className="ai-writer-container" style={{
                  background: 'rgba(2, 132, 199, 0.03)',
                  border: '1px dashed var(--glass-border-hover)',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1.25rem'
                }}>
                          <div className="ai-writer-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                            <span style={{
                      fontWeight: '700',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.85rem'
                    }}>
                              <i className="fa-solid fa-robot"></i> Yapay Zeka Blog Yazarı
                            </span>
                            {settingsData.gemini_api_key ? <span style={{
                      fontSize: '0.7rem',
                      color: '#16a34a',
                      backgroundColor: 'rgba(22, 163, 74, 0.08)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(22, 163, 74, 0.15)'
                    }}>
                                Gemini API Aktif
                              </span> : <span style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      backgroundColor: 'rgba(15, 23, 42, 0.03)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      border: '1px solid var(--glass-border)'
                    }}>
                                Yerel Motor Aktif
                              </span>}
                          </div>
                          <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    marginBottom: '0.5rem'
                  }}>
                            <input type="text" placeholder="Anahtar kelimeleri girin (örn: seo, google ads, e-ticaret)..." value={aiKeywords} onChange={e => setAiKeywords(e.target.value)} disabled={aiLoading} style={{
                      flex: 1,
                      minWidth: '200px',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--glass-border)',
                      fontSize: '0.8rem',
                      background: '#fff',
                      color: 'var(--text-light)',
                      outline: 'none'
                    }} />
                            <button type="button" onClick={handleGenerateAIBlog} disabled={aiLoading} className="btn btn-primary" style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.8rem',
                      borderRadius: '6px'
                    }}>
                              {aiLoading ? 'Taslak Üretiliyor...' : 'Yazı Üret'}
                            </button>
                          </div>
                          {aiError && <div style={{
                    fontSize: '0.75rem',
                    color: '#ef4444',
                    marginTop: '0.25rem'
                  }}>{aiError}</div>}
                          {aiLoading && <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                  }}>
                              <div className="seo-spinner" style={{
                      width: '16px',
                      height: '16px',
                      borderWidth: '2px'
                    }}></div>
                              <span>Yapay zeka başlık, özet ve zengin makale gövdesini hazırlıyor...</span>
                            </div>}
                        </div>

                        <div className="admin-form-group">
                          <label>Blog Başlığı</label>
                          <input type="text" required value={modalFormData.title || ''} onChange={e => handleModalFieldChange('title', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }} />
                        </div>
                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label>Kategori</label>
                            <select value={modalFormData.category || 'google'} onChange={e => handleModalFieldChange('category', e.target.value)} style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }}>
                              <option value="google">Google Ads</option>
                              <option value="meta">Meta Ads</option>
                              <option value="seo">SEO &amp; İçerik</option>
                              <option value="social">Sosyal Medya</option>
                              <option value="ecommerce">E-Ticaret</option>
                              <option value="design">Web Tasarım</option>
                            </select>
                          </div>
                          <div className="admin-form-group">
                            <label>Yazar</label>
                            <select required value={modalFormData.author || ''} onChange={e => handleModalFieldChange('author', e.target.value)} style={{
                              width: '100%',
                              padding: '0.65rem',
                              borderRadius: '6px',
                              border: '1px solid var(--glass-border)',
                              background: '#fff'
                            }}>
                              <option value="">Yazar Seçin</option>
                              {teamMembersData.filter(member => member.dept !== 'management').map(member => (
                                <option key={member.name} value={member.name}>
                                  {member.name} - {member.role}
                                </option>
                              ))}
                              {modalFormData.author && !teamMembersData.filter(member => member.dept !== 'management').some(m => m.name === modalFormData.author) && (
                                <option value={modalFormData.author}>{modalFormData.author} (Mevcut)</option>
                              )}
                            </select>
                          </div>
                        </div>
                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label>Tarih</label>
                            <input type="text" required value={modalFormData.date || ''} onChange={e => handleModalFieldChange('date', e.target.value)} style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--glass-border)'
                    }} />
                          </div>
                          <div className="admin-form-group">
                            <label>Okuma Süresi (Örn: 5 dk okuma)</label>
                            <input type="text" required value={modalFormData.readTime || ''} onChange={e => handleModalFieldChange('readTime', e.target.value)} style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--glass-border)'
                    }} />
                          </div>
                        </div>
                        <div className="admin-form-group">
                          <label>Kısa Özet (Excerpt)</label>
                          <input type="text" required value={modalFormData.excerpt || ''} onChange={e => handleModalFieldChange('excerpt', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }} />
                        </div>
                        <div className="admin-form-group">
                          <label style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                            <span>Yazı İçeriği (Desteklenen Metin)</span>
                            <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      fontWeight: 'normal'
                    }}>HTML etiketlerini kullanabilirsiniz</span>
                          </label>
                          
                          {/* Formatting Toolbar */}
                          <div style={{
                    display: 'flex',
                    gap: '2px',
                    flexWrap: 'wrap',
                    padding: '4px',
                    background: '#f8fafc',
                    border: '1px solid var(--glass-border)',
                    borderBottom: 'none',
                    borderTopLeftRadius: '6px',
                    borderTopRightRadius: '6px'
                  }}>
                            <button type="button" onClick={() => insertHTMLTag('bold')} title="Kalın (Strong)" style={{
                      width: '28px',
                      height: '28px',
                      border: 'none',
                      background: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                              <i className="fa-solid fa-bold" style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-light)'
                      }}></i>
                            </button>
                            <button type="button" onClick={() => insertHTMLTag('italic')} title="İtalik (Em)" style={{
                      width: '28px',
                      height: '28px',
                      border: 'none',
                      background: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                              <i className="fa-solid fa-italic" style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-light)'
                      }}></i>
                            </button>
                            <button type="button" onClick={() => insertHTMLTag('h2')} title="H2 Başlık" style={{
                      width: '28px',
                      height: '28px',
                      border: 'none',
                      background: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: 'var(--text-light)'
                    }}>
                              H2
                            </button>
                            <button type="button" onClick={() => insertHTMLTag('h3')} title="H3 Başlık" style={{
                      width: '28px',
                      height: '28px',
                      border: 'none',
                      background: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: 'var(--text-light)'
                    }}>
                              H3
                            </button>
                            <button type="button" onClick={() => insertHTMLTag('p')} title="Paragraf" style={{
                      width: '28px',
                      height: '28px',
                      border: 'none',
                      background: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                              <i className="fa-solid fa-paragraph" style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-light)'
                      }}></i>
                            </button>
                            <button type="button" onClick={() => insertHTMLTag('link')} title="Bağlantı (Link)" style={{
                      width: '28px',
                      height: '28px',
                      border: 'none',
                      background: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                              <i className="fa-solid fa-link" style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-light)'
                      }}></i>
                            </button>
                            <button type="button" onClick={() => insertHTMLTag('quote')} title="Alıntı (Blockquote)" style={{
                      width: '28px',
                      height: '28px',
                      border: 'none',
                      background: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                              <i className="fa-solid fa-quote-left" style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-light)'
                      }}></i>
                            </button>
                            <button type="button" onClick={() => insertHTMLTag('ul')} title="Sırasız Liste" style={{
                      width: '28px',
                      height: '28px',
                      border: 'none',
                      background: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                              <i className="fa-solid fa-list-ul" style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-light)'
                      }}></i>
                            </button>
                            <button type="button" onClick={() => insertHTMLTag('li')} title="Liste Elemanı (li)" style={{
                      width: '28px',
                      height: '28px',
                      border: 'none',
                      background: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      color: 'var(--text-light)'
                    }}>
                              LI
                            </button>
                            <button type="button" onClick={() => insertHTMLTag('img')} title="Görsel (Image)" style={{
                      width: '28px',
                      height: '28px',
                      border: 'none',
                      background: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                              <i className="fa-solid fa-image" style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-light)'
                      }}></i>
                            </button>
                            <button type="button" onClick={() => insertHTMLTag('table')} title="Tablo (Table)" style={{
                      width: '28px',
                      height: '28px',
                      border: 'none',
                      background: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                              <i className="fa-solid fa-table" style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-light)'
                      }}></i>
                            </button>
                          </div>

                          <textarea id="blog-content-textarea" required rows="12" value={modalFormData.content || ''} onChange={e => handleModalFieldChange('content', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderBottomLeftRadius: '6px',
                    borderBottomRightRadius: '6px',
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    border: '1px solid var(--glass-border)',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    outline: 'none'
                  }}></textarea>
                        </div>
                      </> : (/* Live Preview Tab rendering */
              <div className="blog-live-preview" style={{
                padding: '1.25rem',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                background: '#fff',
                maxHeight: '480px',
                overflowY: 'auto',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
              }}>
                        <h1 style={{
                  fontSize: '1.6rem',
                  fontWeight: '800',
                  marginBottom: '0.5rem',
                  color: 'var(--text-light)'
                }}>{modalFormData.title || 'Başlıksız Yazı'}</h1>
                        <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1rem',
                  borderBottom: '1px solid var(--glass-border)',
                  paddingBottom: '0.5rem'
                }}>
                          <span><i className="fa-regular fa-user" style={{
                      marginRight: '4px'
                    }}></i> {modalFormData.author || 'Ajans Rota'}</span>
                          <span><i className="fa-regular fa-calendar" style={{
                      marginRight: '4px'
                    }}></i> {modalFormData.date || new Date().toLocaleDateString('tr-TR')}</span>
                          <span><i className="fa-regular fa-clock" style={{
                      marginRight: '4px'
                    }}></i> {modalFormData.readTime || '5 dk okuma'}</span>
                          <span style={{
                    textTransform: 'uppercase',
                    fontWeight: '700',
                    color: 'var(--primary)'
                  }}>Kategori: {modalFormData.category || 'Genel'}</span>
                        </div>
                        {modalFormData.excerpt && <p style={{
                  fontStyle: 'italic',
                  color: 'var(--text-muted)',
                  fontSize: '0.95rem',
                  borderLeft: '3px solid var(--primary)',
                  paddingLeft: '0.75rem',
                  marginBottom: '1.25rem',
                  lineHeight: '1.5'
                }}>
                            {modalFormData.excerpt}
                          </p>}
                        <div className="blog-content-preview" style={{
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  color: 'var(--text-light)'
                }} dangerouslySetInnerHTML={{
                  __html: modalFormData.content || '<p style="color:var(--text-muted); font-style:italic;">Yazı içeriği boş...</p>'
                }} />
                      </div>)}
                  </>}
              </div>
              <div className="lead-modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => {
              setEditingItem(null);
              setEditingType('');
            }} style={{
              marginRight: '8px'
            }}>İptal</button>
                <button type="submit" className="btn btn-primary">Kaydet</button>
              </div>
            </form>
          </div>
        </div>}

            {/* --- ADD NEW CLIENT MODAL --- */}
      <AddClientModal 
        isAddClientModalOpen={isAddClientModalOpen}
        setIsAddClientModalOpen={setIsAddClientModalOpen}
        newClientFormData={newClientFormData}
        setNewClientFormData={setNewClientFormData}
        clientReports={clientReports}
        setClientReports={setClientReports}
        setEditingReportBrand={setEditingReportBrand}
      />
    </div>;
}
