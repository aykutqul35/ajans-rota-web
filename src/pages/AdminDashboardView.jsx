import toast from 'react-hot-toast';
import React, { useState, useEffect, useRef } from 'react';
import LeadsTab from '../components/admin/tabs/LeadsTab';
import TicketsTab from '../components/admin/tabs/TicketsTab';
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
import LeadDetailModal from '../components/admin/modals/LeadDetailModal';
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
  const [viewingTicket, setViewingTicket] = useState(null); // leads, settings, services, testimonials, team, blogs, analytics
  const [adminReplyText, setAdminReplyText] = useState('');
  const [activeTab, setActiveTab] = useState('leads');
  const [editingReportBrand, setEditingReportBrand] = useState('ecommerce');
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [newClientFormData, setNewClientFormData] = useState({ code: '', name: '', username: '', password: '' });
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadSearchText, setLeadSearchText] = useState('');
  const [leadSourceFilter, setLeadSourceFilter] = useState('all');
  const [leadServiceFilter, setLeadServiceFilter] = useState('all');
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [editingType, setEditingType] = useState('');
  const [modalFormData, setModalFormData] = useState({});
  const [blogEditTab, setBlogEditTab] = useState('edit');
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
  const exportLeadsToCSV = dataToExport => {
    const data = dataToExport || leadsData;
    if (data.length === 0) { return; }
    const headers = ["ID", "Tarih", "Ad Soyad", "E-Posta", "Telefon", "Şirket/Web Sitesi", "Hizmet Grubu", "Trafik Kaynağı", "Durum", "Mesaj Detayı"];
    const rows = data.map(lead => [lead.id || '', lead.created_at || '', lead.fullName || '', lead.email || '', lead.phone || '', lead.company || '', lead.service || '', lead.trafficSource || 'Organik (SEO)', lead.status === 'unread' ? 'Yeni' : 'Okundu', (lead.message || '').replace(/\"/g, '""').replace(/\r?\n/g, ' ')]);
    const csvContent = [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ajans_rota_talepler_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <TicketsTab
            clientReports={clientReports}
            setClientReports={setClientReports}
            viewingTicket={viewingTicket}
            setViewingTicket={setViewingTicket}
            adminReplyText={adminReplyText}
            setAdminReplyText={setAdminReplyText}
            handleAdminReplySubmit={handleAdminReplySubmit}
          />
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
      <LeadDetailModal
        selectedLead={selectedLead}
        setSelectedLead={setSelectedLead}
        leadsData={leadsData}
        setLeadsData={setLeadsData}
        saveLeadsOnly={saveLeadsOnly}
        handleViewLead={handleViewLead}
        handleDeleteLead={handleDeleteLead}
        settingsData={settingsData}
        authToken={authToken}
        isSaving={isSaving}
        handleSaveAll={handleSaveAll}
      />

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
