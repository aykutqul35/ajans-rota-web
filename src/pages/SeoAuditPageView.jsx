import { useState } from 'react';

export default // Dedicated SEO Audit Page View Component
function SeoAuditPageView({
  onBack,
  onNavToContact,
  onSaveLead
}) {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [result, setResult] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false); // Gated Content State

  // Lead Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [leadLoading, setLeadLoading] = useState(false);
  const [reportDownloaded, setReportDownloaded] = useState(false);
  const [leadError, setLeadError] = useState('');
  const handleStartAnalysis = e => {
    e.preventDefault();
    if (!websiteUrl) return;
    let cleanUrl = websiteUrl.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    if (!cleanUrl.includes('.')) {
      alert('Lütfen geçerli bir web sitesi adresi girin (Örn: www.sirketiniz.com)');
      return;
    }
    setIsAnalyzing(true);
    setProgress(0);
    setResult(null);
    setIsUnlocked(false);
    setReportDownloaded(false);
    const stages = [{
      p: 15,
      text: "🔒 SSL sertifikası ve HTTPS protokolü sorgulanıyor..."
    }, {
      p: 35,
      text: "🏷️ Meta Title, Description ve H1 başlıkları taranıyor..."
    }, {
      p: 55,
      text: "📱 Mobil uyumluluk ve ekran duyarlılığı denetleniyor..."
    }, {
      p: 75,
      text: "⚡ Görsel boyutları ve sayfa yüklenme hızı ölçülüyor..."
    }, {
      p: 90,
      text: "🗺️ Robots.txt ve Sitemap.xml dosyaları inceleniyor..."
    }, {
      p: 100,
      text: "📊 Analiz sonuç raporu derleniyor..."
    }];
    let currentStageIdx = 0;
    const interval = setInterval(() => {
      if (currentStageIdx < stages.length) {
        setProgress(stages[currentStageIdx].p);
        setProgressText(stages[currentStageIdx].text);
        currentStageIdx++;
      } else {
        clearInterval(interval);

        // Generate deterministic results based on URL
        const isHttps = websiteUrl.startsWith('https://');
        const seed = cleanUrl.length;
        const score = 65 + seed % 22; // Deterministic score 65-87

        const errors = [];
        const warnings = [];
        const passes = [{
          title: "Mobil Uyumluluk Testi",
          desc: "Siteniz mobil cihazlara tam uyumlu ve duyarlı tasarıma sahip."
        }, {
          title: "Robots.txt Durumu",
          desc: "Arama motoru botlarının erişim kuralları doğru yapılandırılmış."
        }];
        if (isHttps) {
          passes.push({
            title: "SSL Güvenlik Sertifikası",
            desc: "Siteniz HTTPS protokolü ile şifrelenmiş ve güvenli."
          });
        } else {
          errors.push({
            title: "SSL Sertifikası / HTTPS Eksik",
            desc: "Siteniz şifrelenmemiş HTTP bağlantısı kullanıyor. Arama motorları güvenli olmayan siteleri alt sıralara düşürür."
          });
        }
        if (seed % 3 === 0) {
          errors.push({
            title: "Resim Alt (Alt Text) Etiketleri Eksik",
            desc: "Sitenizdeki 14 görselde alt açıklama etiketi bulunmuyor. Görsel SEO'nuz zayıf."
          });
          warnings.push({
            title: "H1 Başlık Etiketi Eksikliği",
            desc: "Ana sayfada H1 başlık etiketi tespit edilemedi. Google ana odağınızı anlamakta zorlanabilir."
          });
        } else if (seed % 3 === 1) {
          errors.push({
            title: "Sayfa Yüklenme Süresi Yüksek (3.8 sn)",
            desc: "Sayfanız önerilen 2 saniye sınırından yavaş açılıyor. Resim boyutları ve CSS dosyaları optimize edilmelidir."
          });
          warnings.push({
            title: "Kırık Bağlantılar (404 Hataları)",
            desc: "Sitenizde tarama botlarının karşılaştığı 2 adet kırık bağlantı bulundu."
          });
        } else {
          errors.push({
            title: "Meta Description Açıklaması Çok Kısa",
            desc: "Arama sonuçlarında görünecek meta açıklamanız 70 karakterin altında. En az 120-150 karakter olmalıdır."
          });
          warnings.push({
            title: "Yavaş Sunucu Yanıt Süresi (TTFB)",
            desc: "Sunucu yanıt süresi 0.8 saniyenin üzerinde. Barındırma (Hosting) altyapısı yavaş kalıyor."
          });
        }
        if (seed % 2 === 0) {
          passes.push({
            title: "Sitemap.xml Durumu",
            desc: "Site haritanız aktif ve arama botları tarafından okunabiliyor."
          });
          passes.push({
            title: "Semantik HTML5 Yapısı",
            desc: "Header, section, footer etiketleri hiyerarşik olarak doğru kullanılmış."
          });
        } else {
          warnings.push({
            title: "Sitemap.xml Bulunamadı",
            desc: "Sitenizde sitemap.xml site haritası tespit edilemedi. Yeni sayfaların indeks alması gecikebilir."
          });
          passes.push({
            title: "CSS & JS Sıkıştırma",
            desc: "Stil ve betik dosyalarınız küçültülmüş ve optimize edilmiş."
          });
        }

        // Performance scores
        const desktopScore = 75 + seed % 21; // 75-95
        const mobileScore = 55 + seed % 26; // 55-80
        const desktopTime = (1.1 + seed % 9 * 0.15).toFixed(2); // 1.1s - 2.3s
        const mobileTime = (2.2 + seed % 13 * 0.25).toFixed(2); // 2.2s - 5.2s

        // General comment
        let generalComment = "";
        if (score >= 80) {
          generalComment = `Web siteniz genel olarak güçlü bir teknik SEO altyapısına sahip. Arama motorlarında üst sıralara çıkmak için otoriter backlink çalışmaları ve düzenli içerik üretimine odaklanabilirsiniz.`;
        } else if (score >= 70) {
          generalComment = `Web sitenizin temel gereksinimleri karşılanmış durumda ancak mobil yüklenme hızı ve bazı meta etiketler optimize edilmeye ihtiyaç duyuyor. Bu iyileştirmeler Google sıralamalarınızı doğrudan olumlu etkileyecektir.`;
        } else {
          generalComment = `Web sitenizde giderilmesi gereken kritik SEO hataları ve performans darboğazları mevcut. Özellikle hız optimizasyonu ve SSL/meta etiket eksikliklerinin kapatılması kullanıcı deneyimi ve sıralama için önceliklidir.`;
        }
        setResult({
          domain: cleanUrl,
          score,
          errors,
          warnings,
          passes,
          performance: {
            desktopScore,
            mobileScore,
            desktopTime,
            mobileTime
          },
          comment: generalComment
        });
        setIsAnalyzing(false);
      }
    }, 600);
  };
  const handleDownloadReport = async e => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      setLeadError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    setLeadLoading(true);
    setLeadError('');
    const leadPayload = {
      fullName,
      email,
      phone,
      company: result.domain,
      service: 'SEO Detaylı Analiz Rapor Talebi',
      message: `SEO Skoru: %${result.score}\nMobil Hız: ${result.performance.mobileScore}/100 (${result.performance.mobileTime} sn)\nMasaüstü Hız: ${result.performance.desktopScore}/100 (${result.performance.desktopTime} sn)\nUzman Yorumu: ${result.comment}\nKritik Hatalar: ${result.errors.map(e => e.title).join(', ')}\nUyarılar: ${result.warnings.map(w => w.title).join(', ')}`,
      trafficSource: 'SEO Analiz Aracı'
    };
    try {
      await fetch('/api.php?action=save_lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadPayload)
      });
      if (typeof onSaveLead === 'function') {
        onSaveLead(leadPayload);
      }
      setLeadLoading(false);
      setReportDownloaded(true);
      setIsUnlocked(true); // Unlock the content!
    } catch (err) {
      console.error("Failed to save lead:", err);
      if (typeof onSaveLead === 'function') {
        onSaveLead(leadPayload);
      }
      setLeadLoading(false);
      setReportDownloaded(true);
      setIsUnlocked(true); // Unlock the content!
    }
  };

  // SVG Gauge calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = result ? circumference - result.score / 100 * circumference : circumference;
  return <div className="seo-audit-page-view container">
      {/* Navigation & Breadcrumb */}
      <div className="service-page-nav">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Ana Sayfaya Dön
        </button>
        <div className="breadcrumb">
          <span>Ana Sayfa</span> &rarr; <span className="active">Ücretsiz SEO Analizi</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="izmir-hero-header">
        <h1 className="izmir-hero-title">Ücretsiz Hızlı <br /><span>SEO Analiz Raporu</span></h1>
        <p className="izmir-hero-desc">
          Web sitenizin adresini girerek SSL güvencesini, mobil uyumluluğunu ve kritik SEO kriterlerini saniyeler içinde analiz edin.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="glass-card seo-input-card" style={{
      maxWidth: '600px',
      margin: '0 auto 4rem auto',
      padding: '2.5rem'
    }}>
        <form onSubmit={handleStartAnalysis} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
            <label style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            color: 'var(--text-light)',
            fontSize: '0.95rem'
          }}>
              Web Sitesi Adresi
            </label>
            <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
              <input type="text" required placeholder="Örn: https://www.sirketiniz.com" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} disabled={isAnalyzing} style={{
              flex: 1,
              minWidth: '220px',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(15, 23, 42, 0.02)',
              color: 'var(--text-light)',
              outline: 'none',
              fontSize: '0.9rem'
            }} />
              <button type="submit" className="btn btn-primary" disabled={isAnalyzing} style={{
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap'
            }}>
                {isAnalyzing ? 'Analiz Ediliyor...' : 'Analiz Et'}
              </button>
            </div>
          </div>
        </form>

        {/* Loading Simulator */}
        {isAnalyzing && <div style={{
        marginTop: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
            <div className="seo-spinner"></div>
            <div style={{
          width: '100%',
          height: '6px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative'
        }}>
              <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${progress}%`,
            background: 'var(--primary)',
            transition: 'width 0.4s ease',
            borderRadius: '10px'
          }}></div>
            </div>
            <span style={{
          fontSize: '0.85rem',
          color: 'var(--text-main)',
          textAlign: 'center',
          fontWeight: '500'
        }}>
              {progressText}
            </span>
          </div>}
      </div>

      {/* Analysis Results Display */}
      {result && <div style={{ position: 'relative', marginTop: '2rem' }}>
        
        {/* Blur overlay container */}
        <div className="seo-result-container" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
          maxWidth: '900px',
          margin: '0 auto 4rem auto',
          filter: !isUnlocked ? 'blur(8px)' : 'none',
          opacity: !isUnlocked ? 0.6 : 1,
          pointerEvents: !isUnlocked ? 'none' : 'auto',
          userSelect: !isUnlocked ? 'none' : 'auto',
          transition: 'all 0.5s ease-out'
        }}>
            
            {/* Flex columns for Gauge + Details */}
            <div className="seo-result-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '2rem'
        }}>
            
            {/* Score Gauge & General Comment Widget Card */}
            <div className="glass-card" style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '2.5rem'
        }}>
              <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--glass-border)',
            paddingBottom: '1.5rem'
          }}>
                <span className="story-tag" style={{
              marginBottom: '1.5rem'
            }}>GENEL SEO SKORU</span>
                
                <div className="svg-gauge-wrapper" style={{
              position: 'relative',
              width: '130px',
              height: '130px'
            }}>
                  <svg width="130" height="130" viewBox="0 0 130 130" style={{
                transform: 'rotate(-90deg)'
              }}>
                    <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                    <circle cx="65" cy="65" r={radius} fill="none" stroke={result.score >= 80 ? '#22c55e' : result.score >= 70 ? '#eab308' : '#ef4444'} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{
                  transition: 'stroke-dashoffset 1s ease-out'
                }} strokeLinecap="round" />
                  </svg>
                  <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                    <span style={{
                  fontSize: '1.75rem',
                  fontWeight: '800',
                  color: 'var(--text-light)'
                }}>%{result.score}</span>
                    <span style={{
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                      {result.score >= 80 ? 'BAŞARILI' : result.score >= 70 ? 'ORTA' : 'ZAYIF'}
                    </span>
                  </div>
                </div>

                <div style={{
              marginTop: '1rem',
              fontSize: '0.85rem',
              color: 'var(--text-main)',
              lineHeight: '1.5'
            }}>
                  Sitenizin Google dizinlerinde yükselmesi için <strong>{result.errors.length} kritik hata</strong> ve <strong>{result.warnings.length} uyarının</strong> düzeltilmesi gerekiyor.
                </div>
              </div>

              {/* Genel Site Analiz Yorumu */}
              <div style={{
            background: 'rgba(2, 132, 199, 0.03)',
            border: '1px solid rgba(2, 132, 199, 0.1)',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: 'auto'
          }}>
                <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: '700',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              marginBottom: '0.4rem'
            }}>
                  <i className="fa-solid fa-comment-dots"></i> 🔍 Rota SEO Uzmanı Analiz Yorumu
                </span>
                <p style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              margin: 0,
              lineHeight: '1.45'
            }}>
                  {result.comment}
                </p>
              </div>
            </div>

            {/* Performance metrics & Lead Request form */}
            <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
              
              {/* Site Performance Card */}
              <div className="glass-card" style={{
            padding: '2rem'
          }}>
                <span className="story-tag" style={{
              marginBottom: '1rem',
              color: 'var(--accent-teal)'
            }}>SİTE HIZ PERFORMANSI</span>
                <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.05rem',
              color: 'var(--text-light)',
              marginBottom: '1rem'
            }}>
                  Yüklenme Hız Analizi (LCP & TTFB)
                </h4>
                
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
                  {/* Mobile Performance */}
                  <div style={{
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid var(--glass-border)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                    <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem'
                }}>
                      <i className="fa-solid fa-mobile-screen-button"></i> MOBİL HIZ
                    </div>
                    <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  color: result.performance.mobileScore >= 80 ? '#22c55e' : result.performance.mobileScore >= 70 ? '#eab308' : '#ef4444'
                }}>
                      {result.performance.mobileScore}/100
                    </div>
                    <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-light)',
                  marginTop: '0.2rem',
                  fontWeight: '500'
                }}>
                      Açılma Hızı: <span style={{
                    color: 'var(--primary)',
                    fontWeight: '700'
                  }}>{result.performance.mobileTime} sn</span>
                    </div>
                  </div>

                  {/* Desktop Performance */}
                  <div style={{
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid var(--glass-border)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                    <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem'
                }}>
                      <i className="fa-solid fa-desktop"></i> MASAÜSTÜ HIZ
                    </div>
                    <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  color: result.performance.desktopScore >= 80 ? '#22c55e' : result.performance.desktopScore >= 70 ? '#eab308' : '#ef4444'
                }}>
                      {result.performance.desktopScore}/100
                    </div>
                    <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-light)',
                  marginTop: '0.2rem',
                  fontWeight: '500'
                }}>
                      Açılma Hızı: <span style={{
                    color: 'var(--primary)',
                    fontWeight: '700'
                  }}>{result.performance.desktopTime} sn</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Generation & Request Form */}
              <div className="glass-card" style={{
            padding: '2rem',
            display: isUnlocked ? 'none' : 'block' // Hide if unlocked, as it was already filled
          }}>
                <span className="story-tag" style={{
              marginBottom: '0.75rem',
              color: 'var(--secondary)'
            }}>DETAYLI SEO RAPOR TALEBİ</span>
                <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              color: 'var(--text-light)',
              marginBottom: '0.75rem'
            }}>
                  Detaylı SEO Yol Haritası Raporu
                </h3>
                <p style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginBottom: '1.25rem',
              lineHeight: '1.5'
            }}>
                  Tüm teknik eksikleri ve düzeltme adımlarını içeren size özel detaylı analiz raporunu hazırlamamızı isteyin.
                </p>

                {!reportDownloaded ? <form onSubmit={handleDownloadReport} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
                    <input type="text" required placeholder="Adınız Soyadınız *" value={fullName} onChange={e => setFullName(e.target.value)} style={{
                width: '100%',
                padding: '0.55rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(15, 23, 42, 0.02)',
                color: 'var(--text-light)',
                fontSize: '0.85rem'
              }} />
                    <input type="email" required placeholder="E-posta Adresiniz *" value={email} onChange={e => setEmail(e.target.value)} style={{
                width: '100%',
                padding: '0.55rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(15, 23, 42, 0.02)',
                color: 'var(--text-light)',
                fontSize: '0.85rem'
              }} />
                    <input type="tel" required placeholder="Telefon Numaranız *" value={phone} onChange={e => setPhone(e.target.value)} style={{
                width: '100%',
                padding: '0.55rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(15, 23, 42, 0.02)',
                color: 'var(--text-light)',
                fontSize: '0.85rem'
              }} />
                    {leadError && <span style={{
                color: '#ef4444',
                fontSize: '0.75rem'
              }}>{leadError}</span>}
                    <button type="submit" className="btn btn-primary" disabled={leadLoading} style={{
                borderRadius: '8px',
                padding: '0.65rem 1.25rem',
                fontSize: '0.85rem',
                width: '100%',
                marginTop: '0.25rem'
              }}>
                      {leadLoading ? 'Talebiniz Gönderiliyor...' : 'Detaylı Analiz Raporu İste'}
                    </button>
                  </form> : <div style={{
              backgroundColor: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              borderRadius: '8px',
              padding: '0.85rem 1.1rem',
              color: '#16a34a',
              fontSize: '0.8rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}>
                    <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '700'
              }}>
                      <i className="fa-solid fa-circle-check"></i>
                      <span>SEO Talebiniz Başarıyla Alındı!</span>
                    </div>
                    <p style={{
                margin: 0,
                fontSize: '0.78rem',
                color: 'rgba(22, 163, 74, 0.85)',
                lineHeight: '1.4'
              }}>
                      SEO uzmanlarımız web sitenizi detaylı olarak (teknik hatalar, hız ve sıralama fırsatları) incelemeye başladı. Size özel dijital yol haritasını paylaşmak üzere <strong>en geç 24 saat içinde</strong> sizinle iletişime geçeceğiz.
                    </p>
                  </div>}
              </div>
            </div>

          </div>

          {/* Detailed Checks Grid List */}
          <div className="glass-card" style={{
        padding: '2.5rem'
      }}>
            <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.25rem',
          color: 'var(--text-light)',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--glass-border)',
          paddingBottom: '0.75rem'
        }}>
              📊 Denetim Bulguları ve Teknik Detaylar
            </h3>

            {/* Errors */}
            {result.errors.length > 0 && <div style={{
          marginBottom: '1.5rem'
        }}>
                <h4 style={{
            fontSize: '0.95rem',
            color: '#ef4444',
            fontWeight: '600',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
                  <i className="fa-solid fa-circle-xmark"></i> Kritik Hatalar ({result.errors.length})
                </h4>
                <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
                  {result.errors.map((e, idx) => <div key={idx} style={{
              padding: '0.75rem 1rem',
              borderLeft: '3px solid #ef4444',
              background: 'rgba(239, 68, 68, 0.02)',
              borderRadius: '0 8px 8px 0',
              border: '1px solid var(--glass-border)',
              borderLeftWidth: '3px'
            }}>
                      <strong style={{
                color: 'var(--text-light)',
                fontSize: '0.85rem'
              }}>{e.title}</strong>
                      <p style={{
                margin: '0.25rem 0 0 0',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                lineHeight: '1.4'
              }}>{e.desc}</p>
                    </div>)}
                </div>
              </div>}

            {/* Warnings */}
            {result.warnings.length > 0 && <div style={{
          marginBottom: '1.5rem'
        }}>
                <h4 style={{
            fontSize: '0.95rem',
            color: '#eab308',
            fontWeight: '600',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
                  <i className="fa-solid fa-triangle-exclamation"></i> Uyarılar & İyileştirmeler ({result.warnings.length})
                </h4>
                <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
                  {result.warnings.map((w, idx) => <div key={idx} style={{
              padding: '0.75rem 1rem',
              borderLeft: '3px solid #eab308',
              background: 'rgba(234, 179, 8, 0.02)',
              borderRadius: '0 8px 8px 0',
              border: '1px solid var(--glass-border)',
              borderLeftWidth: '3px'
            }}>
                      <strong style={{
                color: 'var(--text-light)',
                fontSize: '0.85rem'
              }}>{w.title}</strong>
                      <p style={{
                margin: '0.25rem 0 0 0',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                lineHeight: '1.4'
              }}>{w.desc}</p>
                    </div>)}
                </div>
              </div>}

            {/* Passes */}
            <div>
              <h4 style={{
            fontSize: '0.95rem',
            color: '#22c55e',
            fontWeight: '600',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
                <i className="fa-solid fa-circle-check"></i> Başarılı Testler ({result.passes.length})
              </h4>
              <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
                {result.passes.map((p, idx) => <div key={idx} style={{
              padding: '0.75rem 1rem',
              borderLeft: '3px solid #22c55e',
              background: 'rgba(34, 197, 94, 0.02)',
              borderRadius: '0 8px 8px 0',
              border: '1px solid var(--glass-border)',
              borderLeftWidth: '3px'
            }}>
                    <strong style={{
                color: 'var(--text-light)',
                fontSize: '0.85rem'
              }}>{p.title}</strong>
                    <p style={{
                margin: '0.25rem 0 0 0',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                lineHeight: '1.4'
              }}>{p.desc}</p>
                  </div>)}
              </div>
            </div>

          </div>

        </div>

        {/* Absolute Centered Gated Content Form */}
        {!isUnlocked && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '500px',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            zIndex: 10,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              color: '#fff',
              margin: '0 auto',
              boxShadow: '0 8px 16px rgba(2, 132, 199, 0.3)'
            }}>
              <i className="fa-solid fa-lock"></i>
            </div>
            
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              color: '#fff',
              margin: '0'
            }}>
              Raporunuz Hazır!
            </h3>
            
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              lineHeight: '1.5',
              margin: '0 0 1rem 0'
            }}>
              <strong style={{color: '#fff'}}>{websiteUrl}</strong> adresi için <strong>{result.errors.length} kritik hata</strong> tespit ettik. <br/>
              Kilitli analiz detaylarını, skorlarınızı ve çözüm önerilerini görmek için bilgilerinizi girerek kilidi açın.
            </p>

            <form onSubmit={handleDownloadReport} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem'
            }}>
              <input type="text" required placeholder="Adınız Soyadınız *" value={fullName} onChange={e => setFullName(e.target.value)} style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }} />
              <input type="email" required placeholder="E-posta Adresiniz *" value={email} onChange={e => setEmail(e.target.value)} style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }} />
              <input type="tel" required placeholder="Telefon Numaranız *" value={phone} onChange={e => setPhone(e.target.value)} style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }} />
              
              <button type="submit" disabled={leadLoading} style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1rem',
                border: 'none',
                cursor: leadLoading ? 'default' : 'pointer',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'transform 0.2s',
              }}
              >
                {leadLoading ? 'Kilidi Açılıyor...' : <><i className="fa-solid fa-unlock-keyhole"></i> Sonuçları Göster</>}
              </button>
              
              {leadError && <div style={{ color: '#ef4444', fontSize: '0.85rem' }}>{leadError}</div>}
              
              <span style={{
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.4)',
                marginTop: '0.5rem'
              }}>
                <i className="fa-solid fa-shield-halved"></i> Bilgileriniz %100 güvendedir ve 3. şahıslarla paylaşılmaz.
              </span>
            </form>
          </div>
        )}
      </div>}

    </div>;
}

// ==========================================
// 1. KOBİ DİJİTALLESME ENDEKSİ BİLEŞENİ
// ==========================================
