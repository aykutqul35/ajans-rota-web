import toast from 'react-hot-toast';
import { useState, useEffect, Suspense, lazy } from 'react';

// Lazy-loaded tabs (only loaded when the user switches to that tab)
const LeadsTab = lazy(() => import('../components/admin/tabs/LeadsTab'));
const TicketsTab = lazy(() => import('../components/admin/tabs/TicketsTab'));
const BlogsTab = lazy(() => import('../components/admin/tabs/BlogsTab'));
const TeamTab = lazy(() => import('../components/admin/tabs/TeamTab'));
const TestimonialsTab = lazy(() => import('../components/admin/tabs/TestimonialsTab'));
const ServicesTab = lazy(() => import('../components/admin/tabs/ServicesTab'));
const LandingTab = lazy(() => import('../components/admin/tabs/LandingTab'));
const SettingsTab = lazy(() => import('../components/admin/tabs/SettingsTab'));
const MarketingTab = lazy(() => import('../components/admin/tabs/MarketingTab'));
const AnalyticsTab = lazy(() => import('../components/admin/tabs/AnalyticsTab'));
const AcademyTab = lazy(() => import('../components/admin/tabs/AcademyTab'));
const ClientReportsTab = lazy(() => import('../components/admin/tabs/ClientReportsTab'));

// Lazy-loaded modals (only loaded when opened)
const AddClientModal = lazy(() => import('../components/admin/modals/AddClientModal'));
const LeadDetailModal = lazy(() => import('../components/admin/modals/LeadDetailModal'));
const EditItemModal = lazy(() => import('../components/admin/modals/EditItemModal'));

import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';

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
  academyCoursesData,
  setAcademyCoursesData,
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

  // Fetch real clients from database on mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch('/api/admin/clients');
        const json = await res.json();
        if (json.success && json.data) {
          const dbReports = {};
          json.data.forEach(client => {
            // Create a brand key from the email or brandName for the UI mapping
            // In the admin UI we use keys like 'ecommerce', 'b2b'. If it's a new client, we just use their ID.
            const brandKey = client.clerkId || client.id;
            dbReports[brandKey] = {
              ...client.reportData,
              brandName: client.brandName,
              client_id: client.id,
              clerkId: client.clerkId,
              email: client.email
            };
          });
          
          setClientReports(prev => {
            // Merge database clients with the default mock clients (so the UI doesn't look empty initially)
            const merged = { ...prev };
            // Overwrite mock data if it exists, or add new
            Object.keys(dbReports).forEach(key => {
               // We try to map them back to ecommerce/b2b if they match, else use the raw key
               let targetKey = key;
               if (dbReports[key].email === 'ege@ajansrota.com') targetKey = 'ecommerce';
               if (dbReports[key].email === 'b2b@ajansrota.com') targetKey = 'b2b';
               merged[targetKey] = { ...merged[targetKey], ...dbReports[key] };
            });
            return merged;
          });
        }
      } catch (err) {
        console.error("Failed to fetch clients from Neon DB:", err);
      }
    };
    fetchClients();
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
    window._adminHasUnsavedChanges = false;
    window._adminLastWrite = Date.now();
    const dbPayload = {
      settings: settingsData,
      servicePagesData: servicesData,
      teamMembers: teamMembersData,
      blogPosts: blogsData,
      academyCourses: academyCoursesData,
      testimonials: testimonialsData,
      leads: leadsData,
      clientReports: clientReports
    };
    localStorage.setItem('ajans_rota_db', JSON.stringify(dbPayload));
    
    // Save current client report to Neon DB
    if (clientReports[editingReportBrand] && clientReports[editingReportBrand].client_id) {
      try {
        await fetch('/api/admin/clients/' + clientReports[editingReportBrand].client_id, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ 
            brandName: clientReports[editingReportBrand].brandName,
            email: clientReports[editingReportBrand].email || 'no-email@ajansrota.com',
            reportData: clientReports[editingReportBrand] 
          })
        });
        toast.success("Müşteri verileri Neon veritabanına başarıyla kaydedildi!");
      } catch (err) {
        console.error('Neon DB Client Save Error:', err);
        toast.error("Neon DB'ye kaydedilirken bir hata oluştu.");
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
    if (item === 'new') {
      if (type === 'testimonial') {
        setModalFormData({ name: '', company: '', role: '', category: 'google-ads', rating: 5, quote: '', metric: '', initials: '' });
      } else if (type === 'team') {
        setModalFormData({ name: '', role: '', init: '', gradient: 'linear-gradient(135deg, #00ebd6, #00b4d8)', desc: '', dept: 'performance', stars: 5, exp: '' });
      } else if (type === 'blog') {
        setModalFormData({ title: '', category: 'google', excerpt: '', date: new Date().toLocaleDateString('tr-TR'), readTime: '5 dk okuma', author: '', content: '' });
      }
    } else {
      setModalFormData({ ...item });
    }
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

  const handleClientReportsUpdate = (updater) => {
    window._adminHasUnsavedChanges = true;
    window._adminLastWrite = Date.now();
    setClientReports(updater);
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
          clientReports={clientReports}
        />

        <main className="admin-content-card">
          <Suspense fallback={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '1rem' }}>
              <div style={{ width: '36px', height: '36px', border: '3px solid var(--glass-border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Yükleniyor...</span>
            </div>
          }>
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
              settingsData={settingsData}
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

          {/* TAB: ACADEMY */}
        {activeTab === 'academy' && (
          <Suspense fallback={<div style={{padding:'2rem',textAlign:'center'}}>Yükleniyor...</div>}>
            <AcademyTab 
              academyCoursesData={academyCoursesData} 
              setAcademyCoursesData={setAcademyCoursesData}
              onSave={handleSaveAll} 
            />
          </Suspense>
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
          <TicketsTab />
        )}

        {activeTab === 'reports' && (
          <ClientReportsTab
            clientReports={clientReports}
            setClientReports={handleClientReportsUpdate}
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
          </Suspense>
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
      <EditItemModal
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        editingType={editingType}
        setEditingType={setEditingType}
        modalFormData={modalFormData}
        setModalFormData={setModalFormData}
        testimonialsData={testimonialsData}
        setTestimonialsData={setTestimonialsData}
        teamMembersData={teamMembersData}
        setTeamMembersData={setTeamMembersData}
        blogsData={blogsData}
        setBlogsData={setBlogsData}
        handleSaveAll={handleSaveAll}
        settingsData={settingsData}
      />

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
