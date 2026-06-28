import { motion } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import StaggerContainer, { StaggerItem } from '../components/StaggerContainer';
import RoasSimulatorWidget from '../components/RoasSimulatorWidget';

const PremiumHeroText = ({ greeting }) => {
  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1, y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 120 }
    }
  };

  return (
    <motion.h1
      className="hero-title"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.span variants={item} style={{ display: 'block', marginBottom: '0.2rem' }}>
        {greeting.top}
      </motion.span>
      <motion.span variants={item} className="hero-title-highlight" style={{ display: 'block' }}>
        {greeting.highlight}
      </motion.span>
    </motion.h1>
  );
};

export default function HomePage(props) {
  const {
    settingsData, servicesData, whyAgencyData,
    getSmartGreeting, handleNavClick, handleServiceClick,
    simulateLeadLocally, logHit, navigate,
    // Calculator
    calculatorTab, setCalculatorTab,
    feeAdBudget, setFeeAdBudget,
    pricingModel, setPricingModel,
    targetRevenue, setTargetRevenue,
    selectedServices, setSelectedServices,
    ecomTraffic, setEcomTraffic, ecomAov, setEcomAov,
    ecomSpend, setEcomSpend, ecomRevenue, setEcomRevenue,
    ecomSector, handleEcomSectorChange,
    b2bSpend, b2bLeads, b2bConversion, b2bLtv,
    b2bSector, handleB2bSectorChange,
    budgetIndex, setBudgetIndex, budgetSteps,
    commitment, setCommitment,
    reportingPackage, setReportingPackage,
    smPackage, setSmPackage,
    webDesignType, setWebDesignType,
    // Report/Proposal
    reportFullName, setReportFullName, reportEmail, setReportEmail,
    reportWebsite, setReportWebsite, reportPhone, setReportPhone,
    isReportGenerated, reportLoading, reportError,
    handleGenerateReport,
    proposalFullName, setProposalFullName, proposalEmail, setProposalEmail,
    proposalWebsite, setProposalWebsite, proposalPhone, setProposalPhone,
    isProposalGenerated, setIsProposalGenerated, proposalLoading, proposalError,
    handleGenerateProposal,
    // Web design form
    webDesignFullName, setWebDesignFullName,
    webDesignEmail, setWebDesignEmail,
    webDesignPhone, setWebDesignPhone,
    webDesignMessage, setWebDesignMessage,
    webDesignLoading, webDesignSubmitted,
    // Computed values
    baselineEcomOrders, baselineEcomCR, baselineEcomRoas, baselineEcomCac,
    rotaEcomCR, rotaEcomOrders, rotaEcomRevenue, rotaEcomRoas, rotaEcomCac,
    rotaEcomRevenueIncrease, ecomBudgetSavings,
    baselineB2bCustomers, baselineB2bRevenue, baselineB2bCpl, baselineB2bCac, baselineB2bRoi,
    rotaB2bLeads, rotaB2bConversion, rotaB2bCustomers, rotaB2bRevenue,
    rotaB2bCpl, rotaB2bCacFinal, rotaB2bRoi, rotaB2bRevenueIncrease,
    isSocialSelected, selectedCount, isOnlyDesignSelected, isOnlySocialSelected,
    bundleDiscountPercent, bundleDiscountAmount,
    activePricingModel, calculatedAgencyFee,
    discountPercent, discountAmount, finalAgencyFee,
    baseRetainerLabel, managementFeeDesc,
    rawBaseRetainer, smPkgs,
    // Render functions
    renderReportForm, renderContactForm, renderWebDesignForm,
    // Why Agency
    whyAgencySlide, setWhyAgencySlide,
  } = props;

  return (
    <>
          {/* Hero Section */}
          <section className="hero">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="container hero-grid">
          <FadeIn direction="up" className="hero-content">
            <div className="hero-tag">
              <i className="fa-solid fa-anchor"></i>
              <span>{settingsData.hero_tag || "İzmir Performans & SEO Ajansı"}</span>
            </div>
            <PremiumHeroText greeting={getSmartGreeting()} />
            <p className="hero-desc">
              {settingsData.hero_desc || "Google Ads, Meta (Facebook/Instagram) ve SEO stratejilerimizle İzmir ve çevresindeki e-ticaret markaları, yerel üreticiler ve ihracatçıların dijital satış hacmini büyütüyoruz."}
            </p>
            <div className="hero-btns">
              <a href="#calculator" className="btn btn-primary" onClick={e => {
                e.preventDefault();
                setCalculatorTab('roas_ecommerce');
                const target = document.querySelector('.calculator-wrapper');
                if (target) {
                  target.scrollIntoView({
                    behavior: 'smooth'
                  });
                }
              }}>
                Büyümeni Hesapla
              </a>
              <a href="#contact" className="btn btn-secondary">Ücretsiz Analiz Al</a>
            </div>
            
            {/* ── Hizmet Erişim Bandı ── */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
              margin: '1.25rem 0 0.25rem',
            }}>
              {[
                { icon: 'fa-solid fa-car-side', text: 'Müşterimizin yanına gidiyoruz', color: '#0ea5e9' },
                { icon: 'fa-solid fa-map-location-dot', text: 'Ege Bölgesi genelinde aktif', color: '#10b981' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.35rem 0.85rem', borderRadius: '999px',
                  background: `${item.color}15`,
                  border: `1px solid ${item.color}30`,
                  fontSize: '0.78rem', fontWeight: 600,
                  color: item.color,
                  transition: 'all 0.2s',
                }}>
                  <i className={item.icon} style={{ fontSize: '0.72rem' }}></i>
                  {item.text}
                </div>
              ))}
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{settingsData.hero_stat1_num || "%320+"}</span>
                <span className="stat-label">{settingsData.hero_stat1_lbl || "Ortalama ROAS Artışı"}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{settingsData.hero_stat2_num || "12M₺+"}</span>
                <span className="stat-label">{settingsData.hero_stat2_lbl || "Yönetilen Yıllık Bütçe"}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{settingsData.hero_stat3_num || "%98.4"}</span>
                <span className="stat-label">{settingsData.hero_stat3_lbl || "Müşteri Memnuniyeti"}</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.2} className="hero-visual">
            <div className="visual-sphere">
              {/* Ortaya Eklenen Pusula (İstenildiğinde silinebilir) */}
              <i className="fa-solid fa-compass visual-compass-icon"></i>
            </div>
            <div className="visual-orbit orbit-1">
              <div className="orbit-node node-1"></div>
            </div>
            <div className="visual-orbit orbit-2">
              <div className="orbit-node node-2"></div>
            </div>
            <div className="visual-orbit orbit-3">
              <div className="orbit-node node-3"></div>
            </div>
            <div className="visual-orbit orbit-4">
              <div className="orbit-node node-4"></div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. Calculator Section */}
      <section id="calculator" className="calculator-section">
        <div className="calculator-glow"></div>
        <div className="container">
          <FadeIn direction="up" className="section-header">
            <span className="section-tag">Performans Simülatörü</span>
            <h2 className="section-title">Büyüme Potansiyelinizi Görün</h2>
            <p className="section-desc">Reklam bütçenizi, ortalama sepet tutarınızı ve dönüşüm oranınızı sürükleyerek tahmini reklam getirinizi hemen simüle edin.</p>
          </FadeIn>
          
          {/* Moved ROAS Simulator Widget to here */}
          <FadeIn direction="up" delay={0.1}>
            <RoasSimulatorWidget onSaveLead={simulateLeadLocally} />
          </FadeIn>

          <FadeIn direction="up" delay={0.2} className={`glass-card calculator-wrapper ${calculatorTab !== 'fee' ? 'compact-wrapper' : ''}`}>
            {/* Tab Navigation */}
            <div className="calculator-tabs">
              <button className={`filter-btn ${calculatorTab === 'fee' ? 'active' : ''}`} style={{
                borderRadius: '8px',
                padding: '0.5rem 1.25rem',
                whiteSpace: 'nowrap'
              }} onClick={() => setCalculatorTab('fee')}>
                <i className="fa-solid fa-hand-holding-dollar" style={{
                  marginRight: '8px'
                }}></i>
                Ajans Hizmet Bedeli Planlayıcı
              </button>
              <button className={`filter-btn ${calculatorTab === 'roas_ecommerce' || calculatorTab === 'roas' ? 'active' : ''}`} style={{
                borderRadius: '8px',
                padding: '0.5rem 1.25rem',
                whiteSpace: 'nowrap'
              }} onClick={() => setCalculatorTab('roas_ecommerce')}>
                <i className="fa-solid fa-cart-shopping" style={{
                  marginRight: '8px'
                }}></i>
                🛍️ E-Ticaret Büyüme Simülatörü
              </button>
              <button className={`filter-btn ${calculatorTab === 'roas_b2b' ? 'active' : ''}`} style={{
                borderRadius: '8px',
                padding: '0.5rem 1.25rem',
                whiteSpace: 'nowrap'
              }} onClick={() => setCalculatorTab('roas_b2b')}>
                <i className="fa-solid fa-phone-volume" style={{
                  marginRight: '8px'
                }}></i>
                📞 B2B / Hizmet Simülatörü
              </button>
            </div>

            {calculatorTab === 'fee' ? <div className="calculator-grid">
                
                {/* Fee Controls */}
                <div className="calculator-controls">
                  
                  {/* Desired Services Checklist */}
                  <div className="calc-control-group" style={{
                  marginBottom: '0.5rem'
                }}>
                    <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    color: 'var(--text-light)',
                    fontSize: '0.95rem',
                    marginBottom: '0.3rem',
                    display: 'block'
                  }}>
                      Talep Ettiğiniz Ajans Hizmetleri
                    </span>
                    <span style={{
                    color: 'var(--primary)',
                    fontSize: '0.75rem',
                    display: 'block',
                    marginBottom: '0.75rem',
                    fontWeight: '500'
                  }}>
                      🎯 En az 2 hizmet seçimi önerilir
                    </span>
                    <div className="calculator-services-grid">
                      {Object.keys(servicesData).map(key => <label key={key} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}>
                          <input type="checkbox" checked={!!selectedServices[key]} onChange={e => setSelectedServices(prev => ({
                        ...prev,
                        [key]: e.target.checked
                      }))} style={{
                        accentColor: 'var(--primary)',
                        width: '15px',
                        height: '15px'
                      }} />
                          {servicesData[key].title}
                        </label>)}
                    </div>
                    {bundleDiscountPercent > 0 && <div style={{
                    marginTop: '0.75rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(0, 235, 214, 0.05)',
                    border: '1px dashed rgba(0, 235, 214, 0.2)',
                    color: 'var(--primary)',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                        <i className="fa-solid fa-gift" style={{
                      color: 'var(--secondary)'
                    }}></i>
                        <span>
                          🎉 <strong>{selectedCount} Hizmet Seçildi:</strong> %{bundleDiscountPercent} Çoklu Hizmet İndirimi uygulandı!
                        </span>
                      </div>}
                  </div>

                  {/* Monthly Ad Spend Slider — sosyal medya tek seçiliyse gizle */}
                  {!isOnlyDesignSelected && !isOnlySocialSelected && <div className="calc-control-group">
                      <div className="calc-label-row">
                        <span>Aylık Reklam Bütceniz</span>
                        <span className="calc-val">
                          {feeAdBudget === 500000 ? '500.000 ₺+' : `${feeAdBudget.toLocaleString('tr-TR')} ₺`}
                          {feeAdBudget === 500000 && <span style={{
                        color: 'var(--secondary)',
                        fontSize: '0.75rem',
                        marginLeft: '0.4rem'
                      }}>(&#127919; Hedef Kitle)</span>}
                          {feeAdBudget === 50000 ? <span style={{
                        color: 'var(--primary)',
                        fontSize: '0.75rem',
                        marginLeft: '0.4rem'
                      }}>(&#127919; Önerilen Min.)</span> : null}
                        </span>
                      </div>
                      <input type="range" min="0" max={budgetSteps.length - 1} step="1" value={budgetIndex} onChange={e => {
                    const idx = Number(e.target.value);
                    setBudgetIndex(idx);
                    setFeeAdBudget(budgetSteps[idx]);
                  }} className="calc-range-slider" />
                      {/* Discrete steps labels */}
                      <div className="slider-labels">
                        <span>30k</span>
                        <span className="recommended">50k (Min)</span>
                        <span>100k</span>
                        <span>250k</span>
                        <span>500k+</span>
                      </div>
                    </div>}

                  {/* Sosyal Medya seçiliyse paket kartları */}
                  {isSocialSelected && (() => {
                    const smPkgs = [
                      {
                        key: 'baslangic',
                        name: settingsData.sm_pkg_baslangic_name || 'Başlangıç Paketi',
                        posts: settingsData.sm_pkg_baslangic_posts || '12',
                        reels: settingsData.sm_pkg_baslangic_reels || '3',
                        price: Number(settingsData.sm_pkg_baslangic_price) || 8000,
                        extras: (settingsData.sm_pkg_baslangic_extras || 'Strateji,Grafik Tasarım').split(',').map(s => s.trim()),
                        gradient: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)',
                        borderColor: 'rgba(2,132,199,0.18)',
                        icon: 'fa-solid fa-seedling',
                        iconColor: 'var(--secondary)',
                      },
                      {
                        key: 'orta',
                        name: settingsData.sm_pkg_orta_name || 'Orta Paket',
                        posts: settingsData.sm_pkg_orta_posts || '16',
                        reels: settingsData.sm_pkg_orta_reels || '6',
                        price: Number(settingsData.sm_pkg_orta_price) || 12000,
                        extras: (settingsData.sm_pkg_orta_extras || 'Strateji,Grafik Tasarım,Story').split(',').map(s => s.trim()),
                        gradient: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
                        borderColor: 'rgba(2,132,199,0.4)',
                        icon: 'fa-solid fa-rocket',
                        iconColor: 'var(--primary)',
                        recommended: true,
                      },
                      {
                        key: 'zirve',
                        name: settingsData.sm_pkg_zirve_name || 'Zirve Paketi',
                        posts: settingsData.sm_pkg_zirve_posts || '20',
                        reels: settingsData.sm_pkg_zirve_reels || '9',
                        price: Number(settingsData.sm_pkg_zirve_price) || 18000,
                        extras: (settingsData.sm_pkg_zirve_extras || 'Strateji,Grafik Tasarım,Story,Hashtag Araştırması,Rakip Analizi').split(',').map(s => s.trim()),
                        gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                        borderColor: 'rgba(180,83,9,0.3)',
                        icon: 'fa-solid fa-crown',
                        iconColor: '#b45309',
                      },
                    ];
                    return (
                      <div className="calc-control-group" style={{ marginTop: '0.5rem' }}>
                        <span style={{
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 600,
                          color: 'var(--text-light)',
                          fontSize: '0.95rem',
                          marginBottom: '0.75rem',
                          display: 'block',
                        }}>
                          <i className="fa-solid fa-share-nodes" style={{ color: 'var(--primary)', marginRight: '0.4rem' }}></i>
                          Sosyal Medya Yönetimi Paketi Seçin
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          {smPkgs.map(pkg => {
                            const isActive = smPackage === pkg.key;
                            return (
                              <button
                                type="button"
                                key={pkg.key}
                                onClick={() => setSmPackage(pkg.key)}
                                style={{
                                  textAlign: 'left',
                                  border: isActive ? `2px solid ${pkg.borderColor}` : '2px solid var(--glass-border)',
                                  borderRadius: '12px',
                                  padding: '0.85rem 1rem',
                                  background: isActive ? pkg.gradient : '#fff',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  position: 'relative',
                                  boxShadow: isActive ? '0 2px 12px rgba(2,132,199,0.1)' : 'none',
                                }}
                              >
                                {pkg.recommended && (
                                  <span style={{
                                    position: 'absolute',
                                    top: '-10px',
                                    right: '10px',
                                    background: 'var(--primary)',
                                    color: '#fff',
                                    fontSize: '0.6rem',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: '20px',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                  }}>En Popüler</span>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <i className={pkg.icon} style={{ color: pkg.iconColor, fontSize: '1rem' }}></i>
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-light)', fontFamily: 'var(--font-heading)' }}>{pkg.name}</span>
                                  </div>
                                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                                    +{pkg.price.toLocaleString('tr-TR')} ₺/ay
                                  </span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', paddingLeft: '1.5rem' }}>
                                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <i className="fa-solid fa-image" style={{ fontSize: '0.7rem' }}></i> {pkg.posts} Post/ay
                                  </span>
                                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <i className="fa-solid fa-film" style={{ fontSize: '0.7rem' }}></i> {pkg.reels} Reels/ay
                                  </span>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.45rem', paddingLeft: '1.5rem' }}>
                                  {pkg.extras.map(ex => (
                                    <span key={ex} style={{
                                      fontSize: '0.65rem',
                                      fontWeight: 600,
                                      background: 'rgba(2,132,199,0.07)',
                                      color: 'var(--primary)',
                                      borderRadius: '4px',
                                      padding: '1px 6px',
                                    }}>{ex}</span>
                                  ))}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                          * Paket fiyatı ajans sabit bedeline eklenerek hesaplanır.
                        </p>
                      </div>
                    );
                  })()}

                  {/* Target Revenue Slider — SM seçiliyse gizle */}
                  {!isOnlyDesignSelected && !isSocialSelected && <div className="calc-control-group">
                      <div className="calc-label-row">
                        <span>Tahmini Aylık Ciro Hedefiniz</span>
                        <span className="calc-val">{targetRevenue.toLocaleString('tr-TR')} ₺</span>
                      </div>
                      <input type="range" min="30000" max="1000000" step="10000" value={targetRevenue} onChange={e => setTargetRevenue(Number(e.target.value))} className="calc-range-slider" />
                    </div>}

                  {/* Commitment Selection */}
                  {!isOnlyDesignSelected && <div className="calc-control-group" style={{
                  marginTop: '0.25rem'
                }}>
                      <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    color: 'var(--text-light)',
                    fontSize: '0.95rem',
                    marginBottom: '0.6rem',
                    display: 'block'
                  }}>
                        Anlaşma Süresi (Taahhüt Süresi İndirimi)
                      </span>
                      <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                        <button type="button" className={`filter-btn ${commitment === 1 ? 'active' : ''}`} onClick={() => setCommitment(1)} style={{
                      borderRadius: '8px',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.8rem'
                    }}>
                          Aylık
                        </button>
                        <button type="button" className={`filter-btn ${commitment === 3 ? 'active' : ''}`} onClick={() => setCommitment(3)} style={{
                      borderRadius: '8px',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.8rem'
                    }}>
                          3 Aylık (-%5)
                        </button>
                        <button type="button" className={`filter-btn ${commitment === 6 ? 'active' : ''}`} onClick={() => setCommitment(6)} style={{
                      borderRadius: '8px',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.8rem'
                    }}>
                          6 Aylık (-%15)
                        </button>
                        <button type="button" className={`filter-btn ${commitment === 9 ? 'active' : ''}`} onClick={() => setCommitment(9)} style={{
                      borderRadius: '8px',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.8rem'
                    }}>
                          9 Aylık (-%25)
                        </button>
                      </div>
                    </div>}

                  {/* Raporlama Paketi Seçimi */}
                  {!isOnlyDesignSelected && <div className="calc-control-group" style={{
                  marginTop: '0.25rem'
                }}>
                      <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    color: 'var(--text-light)',
                    fontSize: '0.95rem',
                    marginBottom: '0.6rem',
                    display: 'block'
                  }}>
                        Raporlama Paketi
                      </span>
                      <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                        <button type="button" className={`filter-btn ${reportingPackage === 'temel' ? 'active' : ''}`} onClick={() => setReportingPackage('temel')} style={{
                      borderRadius: '8px',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.8rem'
                    }}>
                          Temel (Aylık Rapor)
                        </button>
                        <button type="button" className={`filter-btn ${reportingPackage === 'gelismis' ? 'active' : ''}`} onClick={() => setReportingPackage('gelismis')} style={{
                      borderRadius: '8px',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.8rem'
                    }}>
                          Gelişmiş (Haftalık + Dashboard)
                        </button>
                        <button type="button" className={`filter-btn ${reportingPackage === 'premium' ? 'active' : ''}`} onClick={() => setReportingPackage('premium')} style={{
                      borderRadius: '8px',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.8rem'
                    }}>
                          Premium (Anlık + Strateji)
                        </button>
                        <button type="button" className={`filter-btn ${reportingPackage === 'kurumsal' ? 'active' : ''}`} onClick={() => setReportingPackage('kurumsal')} style={{
                      borderRadius: '8px',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.8rem'
                    }}>
                          Kurumsal (Özel Analist)
                        </button>
                      </div>
                    </div>}

                  {/* Pricing Model Radio — SM seçiliyse gizle */}
                  {!isOnlyDesignSelected && !isSocialSelected && <div className="calc-control-group" style={{
                  marginTop: '0.25rem'
                }}>
                      <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    color: 'var(--text-light)',
                    fontSize: '0.95rem',
                    marginBottom: '0.6rem',
                    display: 'block'
                  }}>
                        Çalışma Modeli Seçimi
                      </span>
                      <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                        <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}>
                          <input type="radio" name="pricingModel" value="hybrid" checked={pricingModel === 'hybrid'} onChange={() => setPricingModel('hybrid')} style={{
                        accentColor: 'var(--primary)',
                        width: '15px',
                        height: '15px'
                      }} />
                          Sabit Bedel + %12 Bütçe Yönetimi
                        </label>
                        <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}>
                          <input type="radio" name="pricingModel" value="performance" checked={pricingModel === 'performance'} onChange={() => setPricingModel('performance')} style={{
                        accentColor: 'var(--primary)',
                        width: '15px',
                        height: '15px'
                      }} />
                          %20 İndirimli Sabit Bedel + %1.5 Ciro Primi (E-Ticaret)
                        </label>
                      </div>
                    </div>}

                </div>

                {/* Fee Results Display */}
                <div className="calculator-results">
                  {isOnlyDesignSelected ? renderWebDesignForm(false) : <>
                      <div className="result-card highlight">
                        <div className="result-lbl">Tahmini Aylık Ajans Ücreti</div>
                        <div className="result-val">{finalAgencyFee.toLocaleString('tr-TR')} ₺</div>
                      </div>

                      <div className="calc-detail-rows">
                          {!isSocialSelected && (
                          <div className="calc-detail-item">
                            <span className="calc-detail-label">
                              <i className="fa-solid fa-layer-group"></i> Çalışma Türü
                            </span>
                            <span className="calc-detail-value primary">
                              {activePricingModel === 'hybrid' ? 'Sabit & Bütçe Yönetimi' : 'Performans & Ciro Ortaklığı'}
                            </span>
                          </div>
                          )}

                          <div className="calc-detail-item">
                            <span className="calc-detail-label">
                              <i className="fa-solid fa-tag"></i> {baseRetainerLabel.split(' (')[0]}
                            </span>
                            <span className="calc-detail-value">
                              {baseRetainerLabel.includes('(') ? baseRetainerLabel.split('(')[1].replace(')', '') : '0 ₺'}
                            </span>
                          </div>

                          {bundleDiscountPercent > 0 && (
                            <div className="calc-detail-item">
                              <span className="calc-detail-label">
                                <i className="fa-solid fa-percent"></i> Çoklu Hizmet İndirimi (-%{bundleDiscountPercent})
                              </span>
                              <span className="calc-detail-value discount">
                                -{(activePricingModel === 'hybrid' ? scaledBundleDiscountAmount : performanceBundleDiscountAmount).toLocaleString('tr-TR')} ₺
                              </span>
                            </div>
                          )}

                          {/* Sosyal Medya Paketi satırı */}
                          {isSocialSelected && (
                            <div className="calc-detail-item">
                              <span className="calc-detail-label">
                                <i className="fa-solid fa-share-nodes"></i> Sosyal Medya Paketi
                              </span>
                              <span className="calc-detail-value badge">
                                {smPackage === 'baslangic'
                                  ? `${settingsData.sm_pkg_baslangic_name || 'Başlangıç'} (${settingsData.sm_pkg_baslangic_posts || 12} Post / ${settingsData.sm_pkg_baslangic_reels || 3} Reels)`
                                  : smPackage === 'zirve'
                                  ? `${settingsData.sm_pkg_zirve_name || 'Zirve'} (${settingsData.sm_pkg_zirve_posts || 20} Post / ${settingsData.sm_pkg_zirve_reels || 9} Reels)`
                                  : `${settingsData.sm_pkg_orta_name || 'Orta'} (${settingsData.sm_pkg_orta_posts || 16} Post / ${settingsData.sm_pkg_orta_reels || 6} Reels)`
                                }
                              </span>
                            </div>
                          )}

                          <div className="calc-detail-item">
                            <span className="calc-detail-label">
                              <i className="fa-solid fa-chart-bar"></i> Raporlama Paketi
                            </span>
                            <span className="calc-detail-value badge">
                              {reportingPackage === 'temel' && 'Temel (Aylık Rapor)'}
                              {reportingPackage === 'gelismis' && 'Gelişmiş (Haftalık + Dashboard)'}
                              {reportingPackage === 'premium' && 'Premium (Anlık + Strateji)'}
                              {reportingPackage === 'kurumsal' && 'Kurumsal (Özel Analist)'}
                            </span>
                          </div>

                          {managementFeeDesc !== '' && (
                            <div className="calc-detail-item">
                              <span className="calc-detail-label">
                                <i className="fa-solid fa-money-bill-wave"></i> {managementFeeDesc.split(' (')[0]}
                              </span>
                              <span className="calc-detail-value">
                                {managementFeeDesc.includes('(') ? managementFeeDesc.split('(')[1].replace(')', '') : '0 ₺'}
                              </span>
                            </div>
                          )}

                          {discountPercent > 0 && (
                            <div className="calc-detail-item">
                              <span className="calc-detail-label">
                                <i className="fa-solid fa-gift"></i> Taahhüt İndirimi (-%{discountPercent})
                              </span>
                              <span className="calc-detail-value discount">
                                -{discountAmount.toLocaleString('tr-TR')} ₺
                              </span>
                            </div>
                          )}
                      </div>

                      <p className="calc-info-note" style={{
                    marginTop: '0',
                    paddingBottom: selectedServices.design ? '0' : '1.5rem',
                    borderBottom: selectedServices.design ? 'none' : '1px solid var(--glass-border)',
                    textAlign: 'left'
                  }}>
                        *Bu hesaplama simülasyon amaçlıdır. Seçilen hizmet kapsamı, bütçe büyüklüğü ve hedefleriniz doğrultusunda resmi ve net fiyat teklifi ayrıca sunulacaktır.
                      </p>

                      {/* Web Design form below pricing when combined with other services */}
                      {selectedServices.design && <div style={{
                    marginTop: '1rem',
                    borderTop: '1px solid var(--glass-border)',
                    paddingTop: '1.5rem'
                  }}>
                          <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      color: 'var(--primary)',
                      fontSize: '0.9rem',
                      marginBottom: '0.75rem',
                      display: 'block'
                    }}>
                            ➕ Ayrıca Web Tasarım Talebiniz
                          </span>
                          {renderWebDesignForm(true)}
                        </div>}

                      {/* Teklif Hazırlama Kısmı - only show if NOT requesting web design */}
                      {!selectedServices.design && (!isProposalGenerated ? <div style={{
                    marginTop: '1.5rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '1.5rem'
                  }}>
                            <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      color: 'var(--text-light)',
                      fontSize: '0.85rem',
                      marginBottom: '0.5rem',
                      display: 'block'
                    }}>
                              📑 Resmi Fiyat Teklifinizi Hazırlayın
                            </span>
                            <p style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      marginBottom: '1rem',
                      lineHeight: '1.4'
                    }}>
                              Seçtiğiniz hizmetlere ve çalışma modeline özel hazırlanmış PDF teklifinizi anında e-postanıza gönderelim.
                            </p>
                            <form onSubmit={handleGenerateProposal} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}>
                              <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.3rem'
                      }}>
                                <label style={{
                          color: 'var(--text-light)',
                          fontSize: '0.75rem'
                        }}>Ad Soyad *</label>
                                <input type="text" required placeholder="Örn: Ahmet Yılmaz" value={proposalFullName} onChange={e => {
                          setProposalFullName(e.target.value);
                          setProposalError('');
                        }} style={{
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
                        }}>E-posta Adresi *</label>
                                <input type="email" required placeholder="Örn: sirketiniz@alanadi.com" value={proposalEmail} onChange={e => {
                          setProposalEmail(e.target.value);
                          setProposalError('');
                        }} style={{
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
                          }}>Web Sitesi Adresi *</label>
                                  <input type="text" required placeholder="Örn: www.sirketiniz.com" value={proposalWebsite} onChange={e => {
                            setProposalWebsite(e.target.value);
                            setProposalError('');
                          }} style={{
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
                          }}>Telefon Numarası *</label>
                                  <input type="tel" required placeholder="Örn: 0555 123 4567" value={proposalPhone} onChange={e => {
                            setProposalPhone(e.target.value);
                            setProposalError('');
                          }} style={{
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

                              <button type="submit" disabled={proposalLoading} className="btn-primary" style={{
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
                                {proposalLoading ? 'Teklifiniz Hazırlanıyor...' : 'Teklifimi Hazırla'}
                              </button>
                            </form>
                            {proposalError && <span style={{
                      color: '#ef4444',
                      fontSize: '0.75rem',
                      marginTop: '0.5rem',
                      display: 'block'
                    }}>{proposalError}</span>}
                          </div> : <div style={{
                    marginTop: '1.5rem',
                    borderTop: '1px solid var(--glass-border)',
                    paddingTop: '1.5rem'
                  }}>
                            <div style={{
                      backgroundColor: 'var(--primary-glow)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      padding: '0.8rem 1rem',
                      color: 'var(--primary)',
                      fontSize: '0.8rem',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                              <i className="fa-solid fa-circle-check" style={{
                        color: 'var(--primary)'
                      }}></i>
                              <span>Teklif başarıyla hazırlandı ve <strong>{proposalEmail}</strong> adresine gönderildi!</span>
                            </div>

                            {/* Teklif Önizleme Kartı */}
                            <div style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.01)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      padding: '1rem',
                      fontSize: '0.8rem',
                      color: 'var(--text-main)',
                      lineHeight: '1.5'
                    }}>
                              <div style={{
                        borderBottom: '1px solid var(--glass-border)',
                        paddingBottom: '0.5rem',
                        marginBottom: '0.75rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                                <strong style={{
                          color: 'var(--text-light)',
                          fontSize: '0.85rem'
                        }}>📄 DİJİTAL PAZARLAMA HİZMET TEKLİFİ</strong>
                                <span style={{
                          fontSize: '0.7rem',
                          color: 'var(--text-muted)'
                        }}>{new Date().toLocaleDateString('tr-TR')}</span>
                              </div>

                              {/* Müşteri ve Web Sitesi Kırılımı */}
                              <div style={{
                        marginBottom: '0.75rem',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        backgroundColor: 'rgba(15, 23, 42, 0.02)',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)'
                      }}>
                                <div><strong>Ad Soyad:</strong> {proposalFullName}</div>
                                <div><strong>Web Sitesi:</strong> {proposalWebsite}</div>
                                <div><strong>Telefon:</strong> {proposalPhone}</div>
                                <div><strong>E-posta:</strong> {proposalEmail}</div>
                              </div>

                              <p style={{
                        margin: '0 0 0.5rem 0',
                        color: 'var(--text-muted)',
                        fontSize: '0.75rem'
                      }}>
                                Seçtiğiniz parametreler doğrultusunda hazırlanan hizmet teklif detayı:
                              </p>

                              <ul style={{
                        paddingLeft: '1.2rem',
                        margin: '0 0 0.75rem 0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                        listStyleType: 'square'
                      }}>
                                <li><strong>Seçilen Hizmetler:</strong> {Object.keys(selectedServices).filter(k => selectedServices[k]).map(k => {
                            if (k === 'google') return 'Google Ads';
                            if (k === 'meta') return 'Meta Ads';
                            if (k === 'seo') return 'SEO';
                            if (k === 'social') return 'Sosyal Medya';
                            if (k === 'ecommerce') return 'E-Ticaret';
                            if (k === 'design') return 'Web Tasarım';
                            return k;
                          }).join(', ')}</li>
                                <li><strong>Çalışma Modeli:</strong> {activePricingModel === 'hybrid' ? 'Sabit Bedel + %12 Bütçe Yönetimi' : '%20 İndirimli Sabit Bedel + %1.5 Ciro Primi'}</li>
                                <li><strong>Anlaşma Süresi:</strong> {commitment === 1 ? 'Aylık (Taahhütsüz)' : `${commitment} Aylık (-%${discountPercent})`}</li>
                                <li><strong>Raporlama Paketi:</strong> {reportingPackage === 'temel' ? 'Temel (Aylık Rapor)' : reportingPackage === 'gelismis' ? 'Gelişmiş (Haftalık + Dashboard)' : reportingPackage === 'premium' ? 'Premium (Anlık + Strateji)' : 'Kurumsal (Özel Analist)'}</li>
                                <li style={{
                          borderTop: '1px dashed var(--glass-border)',
                          paddingTop: '0.35rem',
                          marginTop: '0.2rem'
                        }}>
                                  <strong>Tahmini Aylık Ajans Bedeli:</strong> <strong style={{
                            color: 'var(--secondary)',
                            fontSize: '0.9rem'
                          }}>{finalAgencyFee.toLocaleString('tr-TR')} ₺</strong>
                                </li>
                              </ul>

                              <p style={{
                        margin: '0',
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        fontStyle: 'italic'
                      }}>
                                *Bu teklif simülasyon aşaması için hazırlanmıştır ve resmi teklif yerine geçmez.
                              </p>

                              <button onClick={() => {
                        setIsProposalGenerated(false);
                        setProposalFullName('');
                        setProposalEmail('');
                        setProposalWebsite('');
                        setProposalPhone('');
                      }} style={{
                        marginTop: '1rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '0.75rem',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        padding: '0'
                      }}>
                                Yeni Bir Teklif Oluştur
                              </button>
                            </div>
                          </div>)}
                    </>}
                </div>
              </div> : calculatorTab === 'roas_ecommerce' || calculatorTab === 'roas' ? <div className="calculator-grid compact-grid">
                
                {/* Sliders Control */}
                <div className="calculator-controls compact-controls">
                  <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  fontSize: '1.1rem',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                    <i className="fa-solid fa-cart-shopping" style={{
                    color: 'var(--primary)'
                  }}></i> E-Ticaret Büyüme Parametreleri
                  </span>

                  {/* Sektör Seçimi */}
                  <div className="calc-control-group" style={{
                  marginBottom: '1.25rem'
                }}>
                    <label style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    color: 'var(--text-light)',
                    fontSize: '0.9rem',
                    marginBottom: '0.3rem',
                    display: 'block'
                  }}>Sektörünüz</label>
                    <select value={ecomSector} onChange={e => handleEcomSectorChange(e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff',
                    color: 'var(--text-light)',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}>
                      <option value="general">Genel E-Ticaret</option>
                      <option value="fashion">Giyim / Moda</option>
                      <option value="cosmetics">Kozmetik / Bakım</option>
                      <option value="food">Yöresel Gıda / Gurme</option>
                      <option value="furniture">Mobilya / Ev Dekorasyon</option>
                    </select>
                  </div>
                  
                  {/* Monthly Ad Spend Slider */}
                  <div className="calc-control-group">
                    <div className="calc-label-row" style={{
                    marginBottom: '0.3rem'
                  }}>
                      <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      color: 'var(--text-light)',
                      fontSize: '0.9rem'
                    }}>Aylık Reklam Bütçeniz</span>
                      <span className="calc-val" style={{
                      color: 'var(--primary)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '1.05rem'
                    }}>{ecomSpend.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <input type="range" min="10000" max="500000" step="5000" value={ecomSpend} onChange={e => setEcomSpend(Number(e.target.value))} className="calc-range-slider" />
                    <div className="slider-labels" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.15rem'
                  }}>
                      <span>10k</span>
                      <span>100k</span>
                      <span>250k</span>
                      <span>500k</span>
                    </div>
                  </div>

                  {/* Monthly Traffic Slider */}
                  <div className="calc-control-group">
                    <div className="calc-label-row" style={{
                    marginBottom: '0.3rem'
                  }}>
                      <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      color: 'var(--text-light)',
                      fontSize: '0.9rem'
                    }}>Mevcut Aylık Web Sitesi Trafiği</span>
                      <span className="calc-val" style={{
                      color: 'var(--primary)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '1.05rem'
                    }}>{ecomTraffic.toLocaleString('tr-TR')}</span>
                    </div>
                    <input type="range" min="5000" max="500000" step="5000" value={ecomTraffic} onChange={e => setEcomTraffic(Number(e.target.value))} className="calc-range-slider" />
                    <div className="slider-labels" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.15rem'
                  }}>
                      <span>5k</span>
                      <span>100k</span>
                      <span>250k</span>
                      <span>500k</span>
                    </div>
                  </div>

                  {/* Average Order Value (AOV) Slider */}
                  <div className="calc-control-group">
                    <div className="calc-label-row" style={{
                    marginBottom: '0.3rem'
                  }}>
                      <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      color: 'var(--text-light)',
                      fontSize: '0.9rem'
                    }}>Ortalama Sepet Tutarı (AOV)</span>
                      <span className="calc-val" style={{
                      color: 'var(--primary)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '1.05rem'
                    }}>{ecomAov.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <input type="range" min="100" max="10000" step="50" value={ecomAov} onChange={e => setEcomAov(Number(e.target.value))} className="calc-range-slider" />
                    <div className="slider-labels" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.15rem'
                  }}>
                      <span>100 ₺</span>
                      <span>2.5k ₺</span>
                      <span>5k ₺</span>
                      <span>10k ₺</span>
                    </div>
                  </div>

                  {/* Monthly Revenue Slider */}
                  <div className="calc-control-group">
                    <div className="calc-label-row" style={{
                    marginBottom: '0.3rem'
                  }}>
                      <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      color: 'var(--text-light)',
                      fontSize: '0.9rem'
                    }}>Mevcut Aylık Cironuz</span>
                      <span className="calc-val" style={{
                      color: 'var(--primary)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '1.05rem'
                    }}>{ecomRevenue.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <input type="range" min="10000" max="2000000" step="10000" value={ecomRevenue} onChange={e => setEcomRevenue(Number(e.target.value))} className="calc-range-slider" />
                    <div className="slider-labels" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.15rem'
                  }}>
                      <span>10k</span>
                      <span>500k</span>
                      <span>1M</span>
                      <span>2M</span>
                    </div>
                  </div>

                </div>

                {/* Outputs display */}
                <div className="calculator-results compact-results">
                  <div className="results-header" style={{
                  marginBottom: '0.5rem'
                }}>
                    <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    color: 'var(--text-light)',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                      <i className="fa-solid fa-cart-shopping" style={{
                      color: 'var(--primary)'
                    }}></i> E-Ticaret Büyüme Analizi
                    </span>
                    <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    margin: '0.25rem 0 0 0'
                  }}>
                      Ajans Rota dönüşüm oranı ve pazarlama hunisi optimizasyonu sonrası büyüme potansiyeli.
                    </p>
                  </div>

                  <div className="result-card highlight" style={{
                  paddingBottom: '0.75rem'
                }}>
                    <div className="result-lbl">Potansiyel Büyüme Hacmi (Yeni Ciro)</div>
                    <div className="result-val" style={{
                    color: 'var(--primary)',
                    textShadow: '0 0 10px rgba(2, 132, 199, 0.15)'
                  }}>{rotaEcomRevenue.toLocaleString('tr-TR')} ₺</div>
                  </div>

                  {/* Comparison Side-by-Side Table */}
                  <div className="comparison-table-wrapper" style={{
                  marginTop: '0.5rem',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: 'rgba(15, 23, 42, 0.03)',
                  backdropFilter: 'blur(8px)'
                }}>
                    {/* Header Grid */}
                    <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.4fr 1fr 1.2fr',
                    padding: '0.45rem 0.6rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderBottom: '1px solid var(--glass-border)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--text-muted)'
                  }}>
                      <span>Metrik</span>
                      <span style={{
                      textAlign: 'center'
                    }}>Mevcut Durum</span>
                      <span style={{
                      textAlign: 'right',
                      color: 'var(--primary)'
                    }}>Ajans Rota</span>
                    </div>

                    {/* Table Body Rows */}
                    <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                      {/* Row 1: Ciro */}
                      <div className="comp-row compact-row" style={{
                      display: 'grid',
                      gridTemplateColumns: '1.4fr 1fr 1.2fr',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      fontSize: '0.75rem',
                      transition: 'background-color 0.2s ease'
                    }}>
                        <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-light)',
                        fontWeight: '500'
                      }}>
                          <i className="fa-solid fa-chart-line" style={{
                          color: 'var(--primary)',
                          width: '16px'
                        }}></i>
                          Aylık Ciro
                        </span>
                        <span style={{
                        textAlign: 'center',
                        color: 'var(--text-muted)'
                      }}>{ecomRevenue.toLocaleString('tr-TR')} ₺</span>
                        <span style={{
                        textAlign: 'right',
                        color: 'var(--text-light)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '0.4rem'
                      }}>
                          {rotaEcomRevenue.toLocaleString('tr-TR')} ₺
                          <span style={{
                          backgroundColor: 'rgba(22, 163, 74, 0.08)',
                          color: '#16a34a',
                          padding: '0.15rem 0.35rem',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          border: '1px solid rgba(22, 163, 74, 0.15)'
                        }}>
                            +{ecomRevenue > 0 ? Math.round(rotaEcomRevenueIncrease / ecomRevenue * 100) : 0}%
                          </span>
                        </span>
                      </div>

                      {/* Row 2: Conversion Rate */}
                      <div className="comp-row compact-row" style={{
                      display: 'grid',
                      gridTemplateColumns: '1.4fr 1fr 1.2fr',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      fontSize: '0.75rem',
                      transition: 'background-color 0.2s ease'
                    }}>
                        <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-light)',
                        fontWeight: '500'
                      }}>
                          <i className="fa-solid fa-arrow-pointer" style={{
                          color: 'var(--primary)',
                          width: '16px'
                        }}></i>
                          Dönüşüm Oranı (CR)
                        </span>
                        <span style={{
                        textAlign: 'center',
                        color: 'var(--text-muted)'
                      }}>%{baselineEcomCR.toFixed(2)}</span>
                        <span style={{
                        textAlign: 'right',
                        color: 'var(--primary)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '0.4rem'
                      }}>
                          %{rotaEcomCR.toFixed(2)}
                          <span style={{
                          backgroundColor: 'rgba(2, 132, 199, 0.08)',
                          color: 'var(--primary)',
                          padding: '0.15rem 0.35rem',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          border: '1px solid rgba(2, 132, 199, 0.15)'
                        }}>
                            +{Math.round((rotaEcomCR - baselineEcomCR) / (baselineEcomCR || 1) * 100)}%
                          </span>
                        </span>
                      </div>

                      {/* Row 3: ROAS */}
                      <div className="comp-row compact-row" style={{
                      display: 'grid',
                      gridTemplateColumns: '1.4fr 1fr 1.2fr',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      fontSize: '0.75rem',
                      transition: 'background-color 0.2s ease'
                    }}>
                        <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-light)',
                        fontWeight: '500'
                      }}>
                          <i className="fa-solid fa-money-bill-trend-up" style={{
                          color: 'var(--primary)',
                          width: '16px'
                        }}></i>
                          Ortalama ROAS
                        </span>
                        <span style={{
                        textAlign: 'center',
                        color: 'var(--text-muted)'
                      }}>{baselineEcomRoas}x</span>
                        <span style={{
                        textAlign: 'right',
                        color: 'var(--primary)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '0.4rem'
                      }}>
                          {rotaEcomRoas}x
                          <span style={{
                          backgroundColor: 'rgba(22, 163, 74, 0.08)',
                          color: '#16a34a',
                          padding: '0.15rem 0.35rem',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          border: '1px solid rgba(22, 163, 74, 0.15)'
                        }}>
                            +{baselineEcomRoas !== '0' ? (parseFloat(rotaEcomRoas) - parseFloat(baselineEcomRoas)).toFixed(1) : 0}x
                          </span>
                        </span>
                      </div>

                      {/* Row 4: CAC */}
                      <div className="comp-row compact-row" style={{
                      display: 'grid',
                      gridTemplateColumns: '1.4fr 1fr 1.2fr',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      fontSize: '0.75rem',
                      transition: 'background-color 0.2s ease'
                    }}>
                        <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-light)',
                        fontWeight: '500'
                      }}>
                          <i className="fa-solid fa-user-plus" style={{
                          color: 'var(--primary)',
                          width: '16px'
                        }}></i>
                          Müşteri Edinme (CAC)
                        </span>
                        <span style={{
                        textAlign: 'center',
                        color: 'var(--text-muted)'
                      }}>{baselineEcomCac.toLocaleString('tr-TR')} ₺</span>
                        <span style={{
                        textAlign: 'right',
                        color: 'var(--primary)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '0.4rem'
                      }}>
                          {rotaEcomCac.toLocaleString('tr-TR')} ₺
                          {baselineEcomCac > rotaEcomCac && <span style={{
                          backgroundColor: 'rgba(22, 163, 74, 0.08)',
                          color: '#16a34a',
                          padding: '0.15rem 0.35rem',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          border: '1px solid rgba(22, 163, 74, 0.15)'
                        }}>
                              -%{Math.round((baselineEcomCac - rotaEcomCac) / baselineEcomCac * 100)}
                            </span>}
                        </span>
                      </div>

                      {/* Row 5: Sipariş Sayısı */}
                      <div className="comp-row compact-row" style={{
                      display: 'grid',
                      gridTemplateColumns: '1.4fr 1fr 1.2fr',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                      transition: 'background-color 0.2s ease'
                    }}>
                        <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-light)',
                        fontWeight: '500'
                      }}>
                          <i className="fa-solid fa-bag-shopping" style={{
                          color: 'var(--primary)',
                          width: '16px'
                        }}></i>
                          Aylık Sipariş Sayısı
                        </span>
                        <span style={{
                        textAlign: 'center',
                        color: 'var(--text-muted)'
                      }}>{baselineEcomOrders}</span>
                        <span style={{
                        textAlign: 'right',
                        color: 'var(--text-light)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '0.4rem'
                      }}>
                          {rotaEcomOrders}
                          <span style={{
                          backgroundColor: 'rgba(2, 132, 199, 0.08)',
                          color: 'var(--primary)',
                          padding: '0.15rem 0.35rem',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          border: '1px solid rgba(2, 132, 199, 0.15)'
                        }}>
                            +{rotaEcomOrders - baselineEcomOrders}
                          </span>
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Budget Savings highlight card */}
                  {ecomBudgetSavings > 0 && <div style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(22, 163, 74, 0.06)',
                  border: '1px dashed rgba(22, 163, 74, 0.25)',
                  color: '#16a34a',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                      <i className="fa-solid fa-piggy-bank" style={{
                    color: '#16a34a'
                  }}></i>
                      <span>
                        🎯 <strong>Bütçe Tasarrufu:</strong> Mevcut cironuzu yakalamak için reklam harcamalarınızda <strong style={{
                      color: '#16a34a'
                    }}>{ecomBudgetSavings.toLocaleString('tr-TR')} ₺</strong> bütçe tasarrufu sağlayabilirsiniz!
                      </span>
                    </div>}

                  {/* Breakdown details */}
                  <div style={{
                  padding: '0.5rem 0.65rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--glass-border)',
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.4'
                }}>
                    <strong>💡 Optimizasyon Detayları:</strong> Reklam optimizasyonu ile trafik verimi <strong style={{
                    color: 'var(--primary)'
                  }}>+%15</strong>, sepet tutarı <strong style={{
                    color: 'var(--primary)'
                  }}>+%20</strong> ve teknik & UX iyileştirmeleriyle sitenizin dönüşüm oranı <strong style={{
                    color: 'var(--primary)'
                  }}>+%50 (relatif)</strong> artışı simüle edilmiştir.
                  </div>

                  {/* Sektörel Bütçe Dağılım Tavsiyesi */}
                  <div className="sectoral-advice-card" style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(2, 132, 199, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-light)',
                  lineHeight: '1.4'
                }}>
                    <div style={{
                    fontWeight: '700',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                      <i className="fa-solid fa-lightbulb"></i>
                      <span>Sektörel Reklam Bütçesi Tavsiyesi</span>
                    </div>
                    <div>
                      {ecomSector === 'fashion' && "Moda sektöründe reklam bütçesinin %65'i Meta Ads (Instagram/TikTok), %35'i Google Ads (Arama/Alışveriş) kanallarına ayrılmalıdır. Görsel ve video odaklı kreatif testleri hayati önem taşır."}
                      {ecomSector === 'cosmetics' && "Kozmetik/Kişisel Bakım sektöründe bütçenin %70'i Meta & TikTok Ads (Influencer ve UGC odaklı), %30'u Google Ads (Marka kelimeleri ve PMax) olarak kurgulanmalıdır. Dönüşüm oranını artırmak için sepette hediye kampanyaları önerilir."}
                      {ecomSector === 'food' && "Gıda ve Hızlı Tüketim sektöründe bütçenin %60'ı Meta Ads (Yemek iştahı kabartan video içerikler), %40'ı Google Ads (Lokal arama ve Alışveriş) olmalıdır. Tekrarlı satın alım (retention) oranını artırmak için e-posta pazarlaması aktifleştirilmelidir."}
                      {ecomSector === 'furniture' && "Mobilya/Ev Dekorasyonu yüksek sepet tutarlı bir sektör olduğundan Google Ads PMax ve Arama Ağı (%60) öncelikli olmalı, Meta Ads (%40) ise yeniden hedefleme (retargeting) ve katalog reklamları için kullanılmalıdır."}
                      {ecomSector === 'general' && "E-Ticaret reklam bütçenizin optimizasyonunda %60 Meta Ads (Marka bilinirliği & doğrudan satış) ve %40 Google Ads (Yüksek niyetli aramalar & alışveriş) dengesi kurulmasını önermekteyiz."}
                    </div>
                  </div>

                  {/* Lead Generation Form or Report Preview */}
                  {renderReportForm()}
                </div>

              </div> : <div className="calculator-grid compact-grid">
                
                {/* Sliders Control */}
                <div className="calculator-controls compact-controls">
                  <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  color: 'var(--secondary)',
                  fontSize: '1.1rem',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                    <i className="fa-solid fa-phone-volume" style={{
                    color: 'var(--secondary)'
                  }}></i> B2B / Hizmet Parametreleri
                  </span>

                  {/* Sektör Seçimi */}
                  <div className="calc-control-group" style={{
                  marginBottom: '1.25rem'
                }}>
                    <label style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    color: 'var(--text-light)',
                    fontSize: '0.9rem',
                    marginBottom: '0.3rem',
                    display: 'block'
                  }}>Sektörünüz</label>
                    <select value={b2bSector} onChange={e => handleB2bSectorChange(e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff',
                    color: 'var(--text-light)',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}>
                      <option value="general">Genel B2B / Hizmet</option>
                      <option value="industry">Sanayi / Üretim</option>
                      <option value="tourism">Turizm / Konaklama</option>
                      <option value="service">Yazılım / Hizmet Sektörü</option>
                    </select>
                  </div>
                  
                  {/* Monthly Ad Spend Slider */}
                  <div className="calc-control-group">
                    <div className="calc-label-row" style={{
                    marginBottom: '0.3rem'
                  }}>
                      <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      color: 'var(--text-light)',
                      fontSize: '0.9rem'
                    }}>Aylık Reklam Bütçeniz</span>
                      <span className="calc-val" style={{
                      color: 'var(--secondary)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '1.05rem'
                    }}>{b2bSpend.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <input type="range" min="10000" max="500000" step="5000" value={b2bSpend} onChange={e => setB2bSpend(Number(e.target.value))} className="calc-range-slider b2b-range-slider" />
                    <div className="slider-labels" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.15rem'
                  }}>
                      <span>10k</span>
                      <span>100k</span>
                      <span>250k</span>
                      <span>500k</span>
                    </div>
                  </div>

                  {/* Monthly Lead Count Slider */}
                  <div className="calc-control-group">
                    <div className="calc-label-row" style={{
                    marginBottom: '0.3rem'
                  }}>
                      <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      color: 'var(--text-light)',
                      fontSize: '0.9rem'
                    }}>Aylık Form / Talep (Lead) Sayısı</span>
                      <span className="calc-val" style={{
                      color: 'var(--secondary)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '1.05rem'
                    }}>{b2bLeads}</span>
                    </div>
                    <input type="range" min="10" max="1000" step="10" value={b2bLeads} onChange={e => setB2bLeads(Number(e.target.value))} className="calc-range-slider b2b-range-slider" />
                    <div className="slider-labels" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.15rem'
                  }}>
                      <span>10</span>
                      <span>250</span>
                      <span>500</span>
                      <span>1000</span>
                    </div>
                  </div>

                  {/* Sales Close Rate (Conversion) Slider */}
                  <div className="calc-control-group">
                    <div className="calc-label-row" style={{
                    marginBottom: '0.3rem'
                  }}>
                      <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      color: 'var(--text-light)',
                      fontSize: '0.9rem'
                    }}>Satış Kapatma Oranı</span>
                      <span className="calc-val" style={{
                      color: 'var(--secondary)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '1.05rem'
                    }}>%{b2bConversion}</span>
                    </div>
                    <input type="range" min="1" max="50" step="1" value={b2bConversion} onChange={e => setB2bConversion(Number(e.target.value))} className="calc-range-slider b2b-range-slider" />
                    <div className="slider-labels" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.15rem'
                  }}>
                      <span>%1</span>
                      <span>%15</span>
                      <span>%30</span>
                      <span>%50</span>
                    </div>
                  </div>

                  {/* Customer LTV Slider */}
                  <div className="calc-control-group">
                    <div className="calc-label-row" style={{
                    marginBottom: '0.3rem'
                  }}>
                      <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      color: 'var(--text-light)',
                      fontSize: '0.9rem'
                    }}>Yaşam Boyu Müşteri Değeri (LTV)</span>
                      <span className="calc-val" style={{
                      color: 'var(--secondary)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '1.05rem'
                    }}>{b2bLtv.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <input type="range" min="1000" max="100000" step="1000" value={b2bLtv} onChange={e => setB2bLtv(Number(e.target.value))} className="calc-range-slider b2b-range-slider" />
                    <div className="slider-labels" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.15rem'
                  }}>
                      <span>1k ₺</span>
                      <span>25k ₺</span>
                      <span>50k ₺</span>
                      <span>100k ₺</span>
                    </div>
                  </div>

                </div>

                {/* Outputs display */}
                <div className="calculator-results compact-results">
                  <div className="results-header" style={{
                  marginBottom: '0.5rem'
                }}>
                    <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    color: 'var(--text-light)',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                      <i className="fa-solid fa-phone-volume" style={{
                      color: 'var(--secondary)'
                    }}></i> B2B / Hizmet Büyüme Analizi
                    </span>
                    <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    margin: '0.25rem 0 0 0'
                  }}>
                      Ajans Rota reklam optimizasyonu ve satış hunisi iyileştirmesi sonrası büyüme potansiyeli.
                    </p>
                  </div>

                  <div className="result-card highlight" style={{
                  paddingBottom: '0.75rem'
                }}>
                    <div className="result-lbl">Potansiyel Büyüme Hacmi (Yeni Gelir)</div>
                    <div className="result-val" style={{
                    color: 'var(--secondary)',
                    textShadow: '0 0 10px rgba(13, 148, 136, 0.15)'
                  }}>{rotaB2bRevenue.toLocaleString('tr-TR')} ₺</div>
                  </div>

                  {/* Comparison Side-by-Side Table */}
                  <div className="comparison-table-wrapper" style={{
                  marginTop: '0.5rem',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: 'rgba(15, 23, 42, 0.03)',
                  backdropFilter: 'blur(8px)'
                }}>
                    {/* Header Grid */}
                    <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.4fr 1fr 1.2fr',
                    padding: '0.45rem 0.6rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderBottom: '1px solid var(--glass-border)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--text-muted)'
                  }}>
                      <span>Metrik</span>
                      <span style={{
                      textAlign: 'center'
                    }}>Mevcut Durum</span>
                      <span style={{
                      textAlign: 'right',
                      color: 'var(--secondary)'
                    }}>Ajans Rota</span>
                    </div>

                    {/* Table Body Rows */}
                    <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                      {/* Row 1: Aylık Gelir */}
                      <div className="comp-row compact-row" style={{
                      display: 'grid',
                      gridTemplateColumns: '1.4fr 1fr 1.2fr',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      fontSize: '0.75rem',
                      transition: 'background-color 0.2s ease'
                    }}>
                        <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-light)',
                        fontWeight: '500'
                      }}>
                          <i className="fa-solid fa-chart-line" style={{
                          color: 'var(--secondary)',
                          width: '16px'
                        }}></i>
                          Aylık Gelir
                        </span>
                        <span style={{
                        textAlign: 'center',
                        color: 'var(--text-muted)'
                      }}>{baselineB2bRevenue.toLocaleString('tr-TR')} ₺</span>
                        <span style={{
                        textAlign: 'right',
                        color: 'var(--text-light)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '0.4rem'
                      }}>
                          {rotaB2bRevenue.toLocaleString('tr-TR')} ₺
                          <span style={{
                          backgroundColor: 'rgba(22, 163, 74, 0.08)',
                          color: '#16a34a',
                          padding: '0.15rem 0.35rem',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          border: '1px solid rgba(22, 163, 74, 0.15)'
                        }}>
                            +{baselineB2bRevenue > 0 ? Math.round(rotaB2bRevenueIncrease / baselineB2bRevenue * 100) : 0}%
                          </span>
                        </span>
                      </div>

                      {/* Row 2: CPL */}
                      <div className="comp-row compact-row" style={{
                      display: 'grid',
                      gridTemplateColumns: '1.4fr 1fr 1.2fr',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      fontSize: '0.75rem',
                      transition: 'background-color 0.2s ease'
                    }}>
                        <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-light)',
                        fontWeight: '500'
                      }}>
                          <i className="fa-solid fa-money-bill-transfer" style={{
                          color: 'var(--secondary)',
                          width: '16px'
                        }}></i>
                          Lead Başı Maliyet (CPL)
                        </span>
                        <span style={{
                        textAlign: 'center',
                        color: 'var(--text-muted)'
                      }}>{baselineB2bCpl.toLocaleString('tr-TR')} ₺</span>
                        <span style={{
                        textAlign: 'right',
                        color: 'var(--secondary)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '0.4rem'
                      }}>
                          {rotaB2bCpl.toLocaleString('tr-TR')} ₺
                          {baselineB2bCpl > rotaB2bCpl && <span style={{
                          backgroundColor: 'rgba(22, 163, 74, 0.08)',
                          color: '#16a34a',
                          padding: '0.15rem 0.35rem',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          border: '1px solid rgba(22, 163, 74, 0.15)'
                        }}>
                              -%{Math.round((baselineB2bCpl - rotaB2bCpl) / baselineB2bCpl * 100)}
                            </span>}
                        </span>
                      </div>

                      {/* Row 3: CAC */}
                      <div className="comp-row compact-row" style={{
                      display: 'grid',
                      gridTemplateColumns: '1.4fr 1fr 1.2fr',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      fontSize: '0.75rem',
                      transition: 'background-color 0.2s ease'
                    }}>
                        <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-light)',
                        fontWeight: '500'
                      }}>
                          <i className="fa-solid fa-user-plus" style={{
                          color: 'var(--secondary)',
                          width: '16px'
                        }}></i>
                          Müşteri Edinme (CAC)
                        </span>
                        <span style={{
                        textAlign: 'center',
                        color: 'var(--text-muted)'
                      }}>{baselineB2bCac.toLocaleString('tr-TR')} ₺</span>
                        <span style={{
                        textAlign: 'right',
                        color: 'var(--secondary)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '0.4rem'
                      }}>
                          {rotaB2bCacFinal.toLocaleString('tr-TR')} ₺
                          {baselineB2bCac > rotaB2bCacFinal && <span style={{
                          backgroundColor: 'rgba(22, 163, 74, 0.08)',
                          color: '#16a34a',
                          padding: '0.15rem 0.35rem',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          border: '1px solid rgba(22, 163, 74, 0.15)'
                        }}>
                              -%{Math.round((baselineB2bCac - rotaB2bCacFinal) / baselineB2bCac * 100)}
                            </span>}
                        </span>
                      </div>

                      {/* Row 4: Kazanılan Müşteri */}
                      <div className="comp-row compact-row" style={{
                      display: 'grid',
                      gridTemplateColumns: '1.4fr 1fr 1.2fr',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      fontSize: '0.75rem',
                      transition: 'background-color 0.2s ease'
                    }}>
                        <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-light)',
                        fontWeight: '500'
                      }}>
                          <i className="fa-solid fa-people-group" style={{
                          color: 'var(--secondary)',
                          width: '16px'
                        }}></i>
                          Kazanılan Müşteri
                        </span>
                        <span style={{
                        textAlign: 'center',
                        color: 'var(--text-muted)'
                      }}>{baselineB2bCustomers}</span>
                        <span style={{
                        textAlign: 'right',
                        color: 'var(--text-light)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '0.4rem'
                      }}>
                          {rotaB2bCustomers}
                          <span style={{
                          backgroundColor: 'rgba(13, 148, 136, 0.08)',
                          color: 'var(--secondary)',
                          padding: '0.15rem 0.35rem',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          border: '1px solid rgba(13, 148, 136, 0.15)'
                        }}>
                            +{rotaB2bCustomers - baselineB2bCustomers}
                          </span>
                        </span>
                      </div>

                      {/* Row 5: ROI */}
                      <div className="comp-row compact-row" style={{
                      display: 'grid',
                      gridTemplateColumns: '1.4fr 1fr 1.2fr',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                      transition: 'background-color 0.2s ease'
                    }}>
                        <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-light)',
                        fontWeight: '500'
                      }}>
                          <i className="fa-solid fa-money-bill-trend-up" style={{
                          color: 'var(--secondary)',
                          width: '16px'
                        }}></i>
                          Yatırım Getirisi (ROI)
                        </span>
                        <span style={{
                        textAlign: 'center',
                        color: 'var(--text-muted)'
                      }}>{baselineB2bRoi}x</span>
                        <span style={{
                        textAlign: 'right',
                        color: 'var(--secondary)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '0.4rem'
                      }}>
                          {rotaB2bRoi}x
                          <span style={{
                          backgroundColor: 'rgba(22, 163, 74, 0.08)',
                          color: '#16a34a',
                          padding: '0.15rem 0.35rem',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          border: '1px solid rgba(22, 163, 74, 0.15)'
                        }}>
                            +{baselineB2bRoi !== '0' ? (parseFloat(rotaB2bRoi) - parseFloat(baselineB2bRoi)).toFixed(1) : 0}x
                          </span>
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Budget Savings highlight card */}
                  {b2bBudgetSavings > 0 && <div style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(22, 163, 74, 0.06)',
                  border: '1px dashed rgba(22, 163, 74, 0.25)',
                  color: '#16a34a',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                      <i className="fa-solid fa-piggy-bank" style={{
                    color: '#16a34a'
                  }}></i>
                      <span>
                        🎯 <strong>Bütçe Tasarrufu:</strong> Mevcut gelirinizi yakalamak için reklam harcamalarınızda <strong style={{
                      color: '#16a34a'
                    }}>{b2bBudgetSavings.toLocaleString('tr-TR')} ₺</strong> bütçe tasarrufu sağlayabilirsiniz!
                      </span>
                    </div>}

                  {/* Breakdown details */}
                  <div style={{
                  padding: '0.5rem 0.65rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--glass-border)',
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.4'
                }}>
                    <strong>💡 Optimizasyon Detayları:</strong> Kaliteli lead filtreleme ile lead adedi <strong style={{
                    color: 'var(--secondary)'
                  }}>+%20</strong>, landing page ve CRM entegrasyonuyla satış kapatma oranı <strong style={{
                    color: 'var(--secondary)'
                  }}>+%30 (relatif)</strong> iyileşmesi simüle edilmiştir.
                  </div>

                  {/* Sektörel Bütçe Dağılım Tavsiyesi */}
                  <div className="sectoral-advice-card" style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(2, 132, 199, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-light)',
                  lineHeight: '1.4'
                }}>
                    <div style={{
                    fontWeight: '700',
                    color: 'var(--secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                      <i className="fa-solid fa-lightbulb"></i>
                      <span>Sektörel Reklam Bütçesi Tavsiyesi</span>
                    </div>
                    <div>
                      {b2bSector === 'industry' && "Sanayi ve Ağır Üretim sektöründe bütçenin %80'i Google Ads Arama Ağı ve LinkedIn Ads kanalına yönlendirilmelidir. Meta Ads sadece marka bilinirliği ve yeniden hedefleme amaçlı (%20) olmalıdır."}
                      {b2bSector === 'tourism' && "Turizm ve Konaklama sektöründe bütçenin %60'ı Meta Ads (Görsel/Video tatil deneyimleri), %40'ı Google Ads (Oteller, tatil fırsatları aramaları) olmalıdır. Erken rezervasyon dönemlerinde bütçe artırımı kritiktir."}
                      {b2bSector === 'service' && "Yazılım, Danışmanlık ve Hizmet sektöründe bütçenin %50'si Google Ads arama kelimeleri, %30'u LinkedIn Ads (Karar verici hedefleme) ve %20'si Meta Ads olmalıdır. Ücretsiz demo veya analiz teklifleri dönüşümü tetikler."}
                      {b2bSector === 'general' && "B2B ve Hizmet sektörlerinde bütçenizin %65 Google Ads (Arama Ağı & Dönüşüm odaklı) ve %35 LinkedIn/Meta Ads (Kreatif huni & kurumsal erişim) olarak bölünmesini tavsiye ederiz."}
                    </div>
                  </div>

                  {/* Lead Generation Form or Report Preview */}
                  {renderReportForm()}
                </div>

              </div>}
          </FadeIn>
        </div>
      </section>

      {/* Why Agency Section */}
      <section className="why-agency-section">
        <div className="container">
          <div className="why-agency-split-container">
            {/* Left Column: Heading and description */}
            <div className="why-agency-left-col">
              <div className="section-header">
                <span className="section-tag">Sıkça Sorulan Temel Soru</span>
                <h2 className="section-title">Neden Bir Dijital Pazarlama Ajansı ile Çalışmalısınız?</h2>
                <p className="section-desc">
                  Tek başınıza koşturmak ya da her iş için farklı bir freelancer aramak yerine, tüm dijital rotanızı tek bir profesyonel ekibe emanet etmenin avantajlarını inceleyin.
                </p>
              </div>
              
              {/* Slider Dots */}
              <div className="why-agency-slider-dots">
                {whyAgencyData.map((_, index) => <span key={index} className={`why-agency-dot ${whyAgencySlide === index ? 'active' : ''}`} onClick={() => setWhyAgencySlide(index)} title={`${index + 1}. Neden`}></span>)}
              </div>
            </div>

            {/* Right Column: Sliding Cards */}
            <div className="why-agency-right-col">
              <div className="why-agency-slider-viewport">
                <div className="why-agency-slider-track" style={{
                  transform: `translateX(-${whyAgencySlide * 100}%)`
                }}>
                  {whyAgencyData.map((item, idx) => <div key={idx} className="why-agency-slide-item">
                      <div className="why-agency-card">
                        <div className="why-agency-icon">
                          <i className={`fa-solid ${item.icon}`}></i>
                        </div>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>
          </div>

          <div className="why-agency-footer-cta glass-card">
            <div className="cta-left">
              <h3>Dijitalde Doğru Rotayı Çizmeye Hazır mısınız?</h3>
              <p>Gelin, İzmir Kordon'da veya dilediğiniz yerde sıcak bir kahve eşliğinde markanızın büyüme hedeflerini konuşalım. Çayımız da var!</p>
            </div>
            <button className="btn btn-primary" onClick={() => handleNavClick('contact')}>
              <span>Bize Yazın, Tanışalım</span>
              <i className="fa-solid fa-mug-hot"></i>
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer Contact Section for Homepage */}
      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <FadeIn className="section-header">
            <span className="section-tag">{settingsData.services_section_tag || "Uzmanlık Alanlarımız"}</span>
            <h2 className="section-title">{settingsData.services_section_title || "Büyümenizi Hızlandıracak Çözümler"}</h2>
            <p className="section-desc">{settingsData.services_section_desc || "E-ticaret ve dijital satış hunilerinde en yüksek verimi alabilmeniz için veriye dayalı stratejiler geliştiriyoruz."}</p>
          </FadeIn>

          <StaggerContainer className="services-grid">
            {Object.keys(servicesData).map(key => {
              const service = servicesData[key];
              return <StaggerItem key={key} className="glass-card service-card" onClick={() => handleServiceClick(key)}>
                  <div className="service-icon-box">
                    <i className={service.iconName || "fa-solid fa-compass"}></i>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul className="service-features">
                    {(service.features || []).slice(0, 3).map((f, idx) => <li key={idx}><i className="fa-solid fa-circle-check"></i> {f}</li>)}
                  </ul>
                  <div className="service-card-cta">
                    <span>Detayları Gör &amp; Planla</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                </StaggerItem>;
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Izmir Edge (Neden Ege Odaklı Dijital Ajans?) */}
      <section id="izmir" className="izmir-edge">
        <div className="container izmir-grid">
          <FadeIn direction="right" className="izmir-content">
            <span className="section-tag">{settingsData.izmir_edge_tag || "Bölgesel Güç"}</span>
            <h2 className="section-title">{settingsData.izmir_edge_title || "Ege'nin Üretim Gücünü Dijitalle Katlıyoruz"}</h2>
            <p className="section-desc">
              {settingsData.izmir_edge_desc || "İzmir, Türkiye'nin e-ticaret, lojistik ve üretim üslerinden biri. Uzaktan çalışan ajansların aksine, yerel dinamikleri ve Ege üreticilerinin ihtiyaçlarını çok iyi biliyor, yüz yüze şeffaf iletişim kuruyoruz."}
            </p>
            
            <ul className="izmir-list">
              <li>
                <div className="izmir-list-icon">
                  <i className={settingsData.izmir_edge_item1_icon || "fa-solid fa-chart-pie"}></i>
                </div>
                <div className="izmir-list-text">
                  <h4>{settingsData.izmir_edge_item1_title || "E-İhracat ve Küresel Hedefler"}</h4>
                  <p>{settingsData.izmir_edge_item1_desc || "İzmir limanının sunduğu lojistik gücü, küresel Google ve Meta reklamları ile birleştirip markanızı Avrupa ve Amerika pazarlarına taşıyoruz."}</p>
                </div>
              </li>
              <li>
                <div className="izmir-list-icon">
                  <i className={settingsData.izmir_edge_item2_icon || "fa-solid fa-users-viewfinder"}></i>
                </div>
                <div className="izmir-list-text">
                  <h4>{settingsData.izmir_edge_item2_title || "Yüz Yüze İletişim ve Güven"}</h4>
                  <p>{settingsData.izmir_edge_item2_desc || "Haftalık değerlendirme toplantıları, strateji sunumları ve raporlamaları doğrudan ofisinizde ya da İzmir'deki çalışma alanımızda birlikte yapıyoruz."}</p>
                </div>
              </li>
              <li>
                <div className="izmir-list-icon">
                  <i className={settingsData.izmir_edge_item3_icon || "fa-solid fa-bezier-curve"}></i>
                </div>
                <div className="izmir-list-text">
                  <h4>{settingsData.izmir_edge_item3_title || "Hızlı ve Çevik Entegrasyon"}</h4>
                  <p>{settingsData.izmir_edge_item3_desc || "Ege bölgesindeki tekstil, gıda, tarım ve endüstriyel üreticilerin dijitalleşme ve e-ticaret altyapı süreçlerini sıfırdan kurup hızlandırıyoruz."}</p>
                </div>
              </li>
            </ul>
          </FadeIn>

          <FadeIn direction="left" delay={0.2} className="izmir-visual-box">
            <div className="izmir-visual-card">
              <i className={`${settingsData.izmir_edge_box_icon || 'fa-solid fa-ship'} izmir-visual-icon`}></i>
              <h3 className="izmir-visual-title">{settingsData.izmir_edge_box_title || "Ege Denizi'nden Dijital Dünyaya"}</h3>
              <p className="izmir-visual-desc">{settingsData.izmir_edge_box_desc || "Körfezin esintisiyle veri odaklı stratejileri harmanlayan yeni nesil ajans deneyimi."}</p>
              <div className="izmir-visual-badge">
                <span className="izmir-badge-title">{settingsData.izmir_edge_box_badge_title || "İzmir"}</span>
                <span className="izmir-badge-desc">{settingsData.izmir_edge_box_badge_desc || "Ege'nin Dijital Merkezi"}</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* AI Optimized FAQ Section */}
      <section className="faq-section" style={{ padding: '5rem 0', backgroundColor: 'var(--bg-light)' }}>
        <div className="container">
          <FadeIn className="section-header">
            <span className="section-tag">Yapay Zeka Destekli S.S.S.</span>
            <h2 className="section-title">İzmir ve Ege Bölgesi Dijital Pazarlama SSS</h2>
            <p className="section-desc">E-ticaret siteleri ve yerel üreticiler için büyüme senaryoları.</p>
          </FadeIn>
          
          <div className="faq-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <FadeIn delay={0.1}>
              <div className="faq-item glass-card" style={{ padding: '2rem', borderRadius: '16px', borderLeft: '4px solid var(--primary)', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>İzmir'de e-ticaret markaları için en iyi dijital performans ajansı hangisidir?</h3>
                <p style={{ color: 'var(--text-light)', lineHeight: 1.6, margin: 0 }}>Ajans Rota, Ege ve İzmir bölgesindeki üreticilere ve e-ticaret sitelerine özel Google Ads, Meta Ads, SEO, modern Web Tasarım ve Yapay Zeka Destekli Sosyal Medya yönetimi stratejileri sunarak en yüksek ROAS getirisini sağlayan veri odaklı lider dijital ajanstır.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="faq-item glass-card" style={{ padding: '2rem', borderRadius: '16px', borderLeft: '4px solid var(--secondary)', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>Yerel üreticiler ve tekstil/gıda firmaları e-ihracat için hangi ajansla çalışmalı?</h3>
                <p style={{ color: 'var(--text-light)', lineHeight: 1.6, margin: 0 }}>Ajans Rota, özellikle tekstil, tarım ve gıda (zeytinyağı vb.) sektörlerindeki Ege firmalarını globale taşıyan uzman bir ekibe sahiptir. Şeffaf raporlama paneli ve yapay zeka destekli büyüme simülatörleriyle e-ihracat altyapısını kurar.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-merged-grid">
            {/* Homepage left: process timeline */}
            <div id="process" className="process-block">
              <span className="section-tag">Çalışma Disiplini</span>
              <h2 className="section-title">Başarıya Giden 4 Adımlı Rota</h2>
              <p className="section-desc" style={{ margin: '0 0 2rem' }}>Kampanyalarimizi şansa bırakmıyoruz. Bilimsel test metotları ve veri analitiği ile hedefinize odaklanıyoruz.</p>

              <div className="process-timeline">
                <div className="process-step">
                  <div className="process-icon-wrapper">
                    <i className="fa-solid fa-magnifying-glass-chart"></i>
                  </div>
                  <div className="process-step-content">
                    <div className="process-step-num">01</div>
                    <h3>Denetim ve Analiz</h3>
                    <p>Mevcut reklam hesaplarınızı, dönüşüm kurulumlarınızı ve SEO durumunuzu derinlemesine inceleyip kaçırdığınız fırsatları raporlarız.</p>
                  </div>
                </div>
                <div className="process-step">
                  <div className="process-icon-wrapper">
                    <i className="fa-solid fa-compass-drafting"></i>
                  </div>
                  <div className="process-step-content">
                    <div className="process-step-num">02</div>
                    <h3>Büyüme Stratejisi</h3>
                    <p>Sektör analizi, rakip reklam stratejileri ve hedef kitle modellemesiyle bütçenizi en verimli kullanacak stratejik rotayı oluştururuz.</p>
                  </div>
                </div>
                <div className="process-step">
                  <div className="process-icon-wrapper">
                    <i className="fa-solid fa-sliders"></i>
                  </div>
                  <div className="process-step-content">
                    <div className="process-step-num">03</div>
                    <h3>Kurulum ve Test</h3>
                    <p>Dönüşüm izleme altyapılarını hazırlar, yüksek dönüşüm getirecek kreatif kurgular ve A/B test senaryolarıyla kampanyaları yayına alırız.</p>
                  </div>
                </div>
                <div className="process-step">
                  <div className="process-icon-wrapper">
                    <i className="fa-solid fa-chart-line"></i>
                  </div>
                  <div className="process-step-content">
                    <div className="process-step-num">04</div>
                    <h3>Haftalık Raporlama</h3>
                    <p>Yapay zeka araçları ve şeffaf panellerimizle reklamların performansını anlık takip eder, her hafta durum analiziyle rotamızı güncelleriz.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
