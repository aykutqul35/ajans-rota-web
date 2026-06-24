import React, { useState, useEffect } from 'react';

export default function ClientTransparencyPageView({ clientReports, onBack, onContactClick }) {
  const [activeBrand, setActiveBrand] = useState('ecommerce'); // ecommerce, b2b
  const [dateRange, setDateRange] = useState('30days'); // 7days, 30days, thismonth
  const [animTrigger, setAnimTrigger] = useState(false);

  // Login States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showDemoInfo, setShowDemoInfo] = useState(false);

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
    ]
  };

  const rawEcommerce = clientReports?.ecommerce || defaultEcommerceData;
  const rawB2b = clientReports?.b2b || defaultB2bData;

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const u = username.trim();
    const p = password.trim();

    // Check if there is a match in dynamic clientReports
    const matchedBrandKey = Object.keys(clientReports || {}).find(key => {
      const report = clientReports[key];
      return report && report.username === u && report.password === p;
    });

    if (matchedBrandKey) {
      setActiveBrand(matchedBrandKey);
      setIsLoggedIn(true);
    } else {
      // Check fallbacks for default accounts
      const expectedEcomUser = rawEcommerce.username || 'ege';
      const expectedEcomPass = rawEcommerce.password || 'ege123';
      const expectedB2bUser = rawB2b.username || 'liman';
      const expectedB2bPass = rawB2b.password || 'liman123';

      if (u === expectedEcomUser && p === expectedEcomPass) {
        setActiveBrand('ecommerce');
        setIsLoggedIn(true);
      } else if (u === expectedB2bUser && p === expectedB2bPass) {
        setActiveBrand('b2b');
        setIsLoggedIn(true);
      } else {
        setLoginError('Hatalı kullanıcı adı veya şifre! Lütfen bilgilerinizi kontrol edin.');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setLoginError('');
  };

  const rawCurrentBrandData = clientReports?.[activeBrand] || (activeBrand === 'ecommerce' ? defaultEcommerceData : defaultB2bData);

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
    timeline: rawCurrentBrandData.timeline || []
  };

  const isEcommerceBrand = activeBrand === 'ecommerce' || currentData.industry?.toLowerCase().includes('e-ticaret') || currentData.industry?.toLowerCase().includes('gıda') || currentData.industry?.toLowerCase().includes('ecom');

  // Login view if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="client-dashboard-page-wrapper" style={{ 
        minHeight: '100vh', 
        paddingTop: '120px', 
        paddingBottom: '4rem', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
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
                background: '#fff',
                color: 'var(--text-light)',
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
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
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

            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
              Müşteri Panel Girişi
            </h1>
            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '2rem' }}>
              Reklam performansınızı ve şeffaf çalışma timeline'ını izlemek için firmanıza tanımlanan giriş bilgilerini kullanın.
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

            <form onSubmit={handleLogin} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="admin-form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.4rem', display: 'block' }}>Kullanıcı Adı</label>
                <div style={{ position: 'relative' }}>
                  <i className="fa-solid fa-user" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem' }}></i>
                  <input
                    type="text"
                    required
                    placeholder="kullanıcı adı"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.25rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(15, 23, 42, 0.15)',
                      background: '#fff',
                      fontSize: '0.85rem',
                      color: 'var(--text-dark)',
                      outline: 'none',
                      boxShadow: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.4rem', display: 'block' }}>Şifre</label>
                <div style={{ position: 'relative' }}>
                  <i className="fa-solid fa-key" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem' }}></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.5rem 0.75rem 2.25rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(15, 23, 42, 0.15)',
                      background: '#fff',
                      fontSize: '0.85rem',
                      color: 'var(--text-dark)',
                      outline: 'none',
                      boxShadow: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      padding: 0
                    }}
                  >
                    <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  marginTop: '0.5rem',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.2)',
                  transition: 'all 0.2s ease',
                  height: 'auto'
                }}
              >
                Giriş Yap <i className="fa-solid fa-arrow-right-to-bracket" style={{ marginLeft: '6px' }}></i>
              </button>
            </form>

            {/* Help / Demo Accounts Card */}
            {showDemoInfo && (
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                borderRadius: '14px',
                background: 'rgba(15, 23, 42, 0.03)',
                border: '1px solid rgba(15, 23, 42, 0.05)',
                textAlign: 'left'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dark)', display: 'block', marginBottom: '0.5rem' }}>
                  <i className="fa-solid fa-circle-info" style={{ color: 'var(--primary)', marginRight: '4px' }}></i> Test Giriş Bilgileri (Demo Modu)
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-light)' }}>
                    <span>E-Ticaret Müşterisi:</span>
                    <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(15,23,42,0.06)' }}>
                      {rawEcommerce.username || 'ege'} / {rawEcommerce.password || 'ege123'}
                    </code>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-light)' }}>
                    <span>B2B Müşterisi:</span>
                    <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(15,23,42,0.06)' }}>
                      {rawB2b.username || 'liman'} / {rawB2b.password || 'liman123'}
                    </code>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  // Dashboard view if authenticated
  return (
    <div className="client-dashboard-page-wrapper" style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem', background: '#f8fafc' }}>
      <div className="container">
        
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
              background: '#fff',
              color: 'var(--text-light)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              height: 'auto',
              width: 'auto'
            }}
          >
            <i className="fa-solid fa-arrow-left"></i>
            Anasayfaya Dön
          </button>
        </div>

        {/* Intro Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{
            display: 'inline-block',
            background: 'var(--primary-glow)',
            color: 'var(--primary)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.75rem'
          }}>
            <i className="fa-solid fa-eye" style={{ marginRight: '6px' }}></i> Şeffaf Raporlama Paneli
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
            Müşteri Raporlama & Şeffaflık Paneli
          </h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Rota Dijital ile çalışırken her kuruşun nereye gittiğini, reklamların getirisini (ROAS) ve uzmanlarımızın hesabınızda tam olarak ne zaman ne yaptığını anlık olarak takip edersiniz.
          </p>
        </div>

        {/* Dashboard Control Box */}
        <div className="client-dashboard-control-box" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          backgroundColor: '#fff',
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
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                {currentData.brandName || (activeBrand === 'ecommerce' ? 'E-Ticaret Müşterisi' : 'B2B Müşterisi')} Oturumu Aktif
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                background: 'rgba(239, 68, 68, 0.03)',
                color: '#ef4444',
                transition: 'all 0.2s',
                height: 'auto',
                width: 'auto'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ef4444';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.03)';
                e.currentTarget.style.color = '#ef4444';
              }}
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              Güvenli Çıkış
            </button>
          </div>

          {/* Date Picker & Brand Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'right', marginRight: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', display: 'inline-block', animation: 'ping 1.5s infinite' }}></span> Canlı Veri Aktif
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
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
                color: 'var(--text-light)',
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              <option value="30days">Son 30 Gün</option>
              <option value="7days">Son 7 Gün</option>
              <option value="thismonth">Bu Ay</option>
            </select>
          </div>
        </div>

        {/* Selected Brand Title & Details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-dark)' }}>
              {currentData.brandName}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Sektör: <strong>{currentData.industry}</strong>
            </p>
          </div>
        </div>

        {/* KPI Grid */}
        <div className={`client-kpi-grid ${animTrigger ? 'animate-kpis' : ''}`} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          {currentData.kpis.map((kpi, idx) => (
            <div key={idx} className="client-kpi-card" style={{
              backgroundColor: '#fff',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid rgba(15, 23, 42, 0.05)',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.015)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>{kpi.label}</span>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(15, 23, 42, 0.03)',
                  color: kpi.color
                }}>
                  <i className={kpi.icon}></i>
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.25rem' }}>{kpi.value}</h3>
                <span style={{ fontSize: '0.75rem', color: kpi.change.includes('-') ? '#ef4444' : '#16a34a', fontWeight: 600 }}>
                  {kpi.change}
                </span>
              </div>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '3px',
                background: kpi.color,
                opacity: 0.8
              }}></div>
            </div>
          ))}
        </div>

        {/* Dashboard Content Grid */}
        <div className="client-dashboard-layout-grid">
          
          {/* LEFT COLUMN: Campaign Tables */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Google Ads Section */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(15, 23, 42, 0.06)',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.08)', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-brands fa-google" style={{ fontSize: '1rem' }}></i>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)' }}>Google Ads Kampanya Performansı</h3>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.08)' }}>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700 }}>Kampanya Adı</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700 }}>Harcama</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, textAlign: 'center' }}>Tıklama</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, textAlign: 'center' }}>TO (CTR)</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, textAlign: 'center' }}>Dönüşüm</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, textAlign: 'right' }}>{isEcommerceBrand ? 'ROAS' : 'CPL'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.googleAds.map((camp, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.04)' }}>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dark)' }}>{camp.name}</td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)' }}>{camp.spend}</td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center' }}>{camp.clicks}</td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center' }}>{camp.ctr}</td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)', textAlign: 'center' }}>{camp.conversions}</td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#16a34a', textAlign: 'right' }}>{camp.roas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Meta Ads Section */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(15, 23, 42, 0.06)',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.08)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-brands fa-meta" style={{ fontSize: '1rem' }}></i>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)' }}>Meta Ads (Facebook & Instagram) Performansı</h3>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.08)' }}>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700 }}>Reklam Seti / Kreatif</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700 }}>Harcama</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, textAlign: 'center' }}>Tıklama</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, textAlign: 'center' }}>TO (CTR)</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, textAlign: 'center' }}>Dönüşüm</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, textAlign: 'center' }}>Durum</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, textAlign: 'right' }}>{isEcommerceBrand ? 'ROAS' : 'CPL'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.metaAds.map((camp, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.04)' }}>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dark)' }}>{camp.name}</td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)' }}>{camp.spend}</td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center' }}>{camp.clicks}</td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center' }}>{camp.ctr}</td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)', textAlign: 'center' }}>{camp.conversions}</td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.75rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontWeight: '600',
                            backgroundColor: camp.status === 'Aktif' ? 'rgba(22, 163, 74, 0.08)' : 'rgba(100, 116, 139, 0.08)',
                            color: camp.status === 'Aktif' ? '#16a34a' : '#64748b'
                          }}>
                            {camp.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#16a34a', textAlign: 'right' }}>{camp.roas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SEO Organic Performance */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(15, 23, 42, 0.06)',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.08)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-chart-line" style={{ fontSize: '1rem' }}></i>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)' }}>SEO & Organik Sıralamalar</h3>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.08)' }}>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700 }}>Hedef Anahtar Kelime</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, textAlign: 'center' }}>Google Sırası</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, textAlign: 'center' }}>Aylık Hacim</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, textAlign: 'center' }}>Organik Tıklama</th>
                      <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, textAlign: 'right' }}>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.seo.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.04)' }}>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dark)' }}>{item.keyword}</td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textAlign: 'center' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'var(--primary-glow)' }}>{item.rank}</span>
                        </td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center' }}>{item.volume}</td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)', textAlign: 'center' }}>{item.monthlyClicks}</td>
                        <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', textAlign: 'right', color: item.trend === 'up' ? '#16a34a' : '#64748b' }}>
                          {item.trend === 'up' ? <i className="fa-solid fa-circle-chevron-up"></i> : <i className="fa-solid fa-minus"></i>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Agency Activity Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Timeline Wrapper */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(15, 23, 42, 0.06)',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-timeline" style={{ fontSize: '1rem' }}></i>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)' }}>Ajans İş Defteri (Son 30 Gün)</h3>
              </div>

              <div className="transparency-timeline" style={{
                position: 'relative',
                paddingLeft: '1.25rem',
                borderLeft: '2px solid rgba(15, 23, 42, 0.06)'
              }}>
                {currentData.timeline.map((act, idx) => (
                  <div key={idx} className="timeline-item" style={{
                    position: 'relative',
                    marginBottom: idx === currentData.timeline.length - 1 ? 0 : '1.75rem'
                  }}>
                    {/* Circle icon marker */}
                    <div style={{
                      position: 'absolute',
                      left: '-26px',
                      top: '2px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      border: '3px solid #fff',
                      boxShadow: '0 0 0 2px rgba(15, 23, 42, 0.08)'
                    }}></div>

                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.2rem' }}>
                      {act.date}
                    </div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.25rem', lineHeight: '1.3' }}>
                      {act.title}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: '1.4', marginBottom: '0.35rem' }}>
                      {act.desc}
                    </p>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <i className="fa-solid fa-user-tie" style={{ fontSize: '0.65rem' }}></i> Uzman: {act.author}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Pitch Box */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#fff',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', color: '#fff' }}>
                Veriyle Büyümek İster misiniz?
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                Sizin de reklam bütçenizin nereye gittiğini saniye saniye takip edeceğimiz, şeffaf ve ROI odaklı bir dijital pazarlama yönetimi için ilk strateji toplantımızı planlayalım.
              </p>
              <button 
                onClick={onContactClick}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'var(--secondary)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(236, 72, 153, 0.2)'
                }}
              >
                Ücretsiz Büyüme Analizi Al
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
