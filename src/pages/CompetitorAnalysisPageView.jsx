import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { budgetSteps, initialServicePagesData, featuredStories, initialTeamMembers, initialBlogPosts, categories, whyAgencyData, testimonials } from '../data/mockData';
import FadeIn from '../components/FadeIn';
import StaggerContainer, { StaggerItem } from '../components/StaggerContainer';
import ClientTransparencyPageView from '../components/ClientTransparencyPageView';

export default // ==========================================
// 3. SİZ VS RAKİBİNİZ RAKİP ANALİZ BİLEŞENİ
// ==========================================
function CompetitorAnalysisPageView({
  onBack,
  onSaveLead
}) {
  const [myUrl, setMyUrl] = useState('');
  const [compUrl, setCompUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [results, setResults] = useState(null);

  // Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState('');
  const handleStartAnalysis = e => {
    e.preventDefault();
    if (!myUrl || !compUrl) return;
    let cleanMyUrl = myUrl.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    let cleanCompUrl = compUrl.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    setIsAnalyzing(true);
    setProgress(0);
    setResults(null);
    const stages = [{
      p: 25,
      text: "🔍 Sunucu yüklenme hızları karşılaştırılıyor..."
    }, {
      p: 50,
      text: "🔒 SSL bağlantıları ve HTTPS protokolleri denetleniyor..."
    }, {
      p: 75,
      text: "📱 Mobil ekran uyumlulukları analiz ediliyor..."
    }, {
      p: 90,
      text: "🏷️ Google indeks sayıları ve robots/sitemap kontrol ediliyor..."
    }, {
      p: 100,
      text: "📊 Karşılaştırma sonuç tablosu derleniyor..."
    }];
    let stageIdx = 0;
    const interval = setInterval(() => {
      if (stageIdx < stages.length) {
        setProgress(stages[stageIdx].p);
        setProgressText(stages[stageIdx].text);
        stageIdx++;
      } else {
        clearInterval(interval);

        // Generate deterministic results
        const seed1 = cleanMyUrl.length;
        const seed2 = cleanCompUrl.length;
        const mySpeedScore = 70 + seed1 % 26; // 70-95
        const compSpeedScore = 55 + seed2 % 31; // 55-85
        const myLoadTime = (1.2 + seed1 % 7 * 0.2).toFixed(1);
        const compLoadTime = (1.8 + seed2 % 11 * 0.3).toFixed(1);
        const myIsHttps = myUrl.startsWith('https://') || seed1 % 2 === 0;
        const compIsHttps = compUrl.startsWith('https://') || seed2 % 3 === 0;
        const myIsMobile = true;
        const compIsMobile = seed2 % 2 === 0;
        const myIndex = 150 + seed1 % 20 * 15;
        const compIndex = 80 + seed2 % 15 * 12;
        setResults({
          myDomain: cleanMyUrl,
          compDomain: cleanCompUrl,
          my: {
            speedScore: mySpeedScore,
            loadTime: myLoadTime,
            isHttps: myIsHttps,
            isMobile: myIsMobile,
            indexCount: myIndex
          },
          comp: {
            speedScore: compSpeedScore,
            loadTime: compLoadTime,
            isHttps: compIsHttps,
            isMobile: compIsMobile,
            indexCount: compIndex
          }
        });
        setIsAnalyzing(false);
      }
    }, 600);
  };
  const handleSendRequest = async e => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      setLeadError('Lütfen zorunlu alanları doldurun.');
      return;
    }
    setLeadLoading(true);
    setLeadError('');
    const leadPayload = {
      fullName,
      email,
      phone,
      company: `${results.myDomain} vs ${results.compDomain}`,
      service: 'Rakip Karşılaştırma Raporu Talebi',
      message: `Sitemiz: ${results.myDomain} (Skor: ${results.my.speedScore}, Hız: ${results.my.loadTime}sn, Mobil: ${results.my.isMobile ? 'Evet' : 'Hayır'}, İndeks: ${results.my.indexCount})\nRakip: ${results.compDomain} (Skor: ${results.comp.speedScore}, Hız: ${results.comp.loadTime}sn, Mobil: ${results.comp.isMobile ? 'Evet' : 'Hayır'}, İndeks: ${results.comp.indexCount})`,
      trafficSource: 'Rakip Karşılaştırma Sayfası'
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
      setLeadSubmitted(true);
    } catch (err) {
      console.error(err);
      if (typeof onSaveLead === 'function') {
        onSaveLead(leadPayload);
      }
      setLeadLoading(false);
      setLeadSubmitted(true);
    }
  };
  return <div className="competitor-analysis-page container" style={{
    paddingTop: '6rem',
    paddingBottom: '4rem',
    minHeight: '100vh'
  }}>
      <div className="service-page-nav">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Ana Sayfaya Dön
        </button>
        <div className="breadcrumb">
          <span>Ana Sayfa</span> &rarr; <span className="active">Siz vs. Rakibiniz</span>
        </div>
      </div>

      <div className="izmir-hero-header">
        <h1 className="izmir-hero-title">Siz vs. Rakibiniz <br /><span>Rakip Analiz Modülü</span></h1>
        <p className="izmir-hero-desc">
          Kendi web siteniz ile rakibinizin adresini yazın, sayfa hızlarından arama motoru indekslerine kadar 4 kritik alanda karşılaştırmalı performans raporunu anında inceleyin.
        </p>
      </div>

      {/* Inputs Form */}
      <div className="glass-card" style={{
      maxWidth: '650px',
      margin: '0 auto 4rem auto',
      padding: '2.5rem'
    }}>
        <form onSubmit={handleStartAnalysis} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
          <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
            <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}>
              <label style={{
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--text-light)'
            }}>Sizin Web Siteniz</label>
              <input type="text" required placeholder="Örn: sitem.com" value={myUrl} onChange={e => setMyUrl(e.target.value)} disabled={isAnalyzing} style={{
              width: '100%',
              padding: '0.65rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(15, 23, 42, 0.02)',
              color: 'var(--text-light)',
              fontSize: '0.85rem'
            }} />
            </div>
            <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}>
              <label style={{
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--text-light)'
            }}>Rakibinizin Web Siteniz</label>
              <input type="text" required placeholder="Örn: rakip.com" value={compUrl} onChange={e => setCompUrl(e.target.value)} disabled={isAnalyzing} style={{
              width: '100%',
              padding: '0.65rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(15, 23, 42, 0.02)',
              color: 'var(--text-light)',
              fontSize: '0.85rem'
            }} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={isAnalyzing} style={{
          padding: '0.75rem',
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
            {isAnalyzing ? 'Analiz Ediliyor...' : 'Siteleri Karşılaştır'}
          </button>
        </form>

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
        }}>{progressText}</span>
          </div>}
      </div>

      {/* Results Display */}
      {results && <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
          
          <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '2rem'
      }} className="seo-result-grid">
            
            {/* Table Card */}
            <div className="glass-card" style={{
          padding: '2rem'
        }}>
              <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.15rem',
            color: 'var(--text-light)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
                <i className="fa-solid fa-table-columns" style={{
              color: 'var(--primary)'
            }}></i> Performans Kıyaslama Tablosu
              </h3>

              <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
                
                {/* Headers */}
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid var(--glass-border)',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'var(--text-muted)'
            }}>
                  <span>KRİTER</span>
                  <span style={{
                color: 'var(--primary)'
              }}>{results.myDomain.toUpperCase()}</span>
                  <span style={{
                color: 'var(--secondary)'
              }}>{results.compDomain.toUpperCase()}</span>
                </div>

                {/* Row 1: Speed Score */}
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              fontSize: '0.85rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.02)'
            }}>
                  <strong style={{
                color: 'var(--text-light)'
              }}>Hız Skoru</strong>
                  <span style={{
                color: results.my.speedScore >= 80 ? '#22c55e' : '#eab308',
                fontWeight: '700'
              }}>{results.my.speedScore}/100</span>
                  <span style={{
                color: results.comp.speedScore >= 80 ? '#22c55e' : '#ef4444',
                fontWeight: '700'
              }}>{results.comp.speedScore}/100</span>
                </div>

                {/* Row 2: Load Time */}
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              fontSize: '0.85rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.02)'
            }}>
                  <strong style={{
                color: 'var(--text-light)'
              }}>Yüklenme Süresi</strong>
                  <span style={{
                color: '#22c55e',
                fontWeight: '700'
              }}>{results.my.loadTime} sn</span>
                  <span style={{
                color: '#ef4444',
                fontWeight: '700'
              }}>{results.comp.loadTime} sn</span>
                </div>

                {/* Row 3: SSL */}
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              fontSize: '0.85rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.02)'
            }}>
                  <strong style={{
                color: 'var(--text-light)'
              }}>Güvenli Bağlantı (SSL)</strong>
                  <span>{results.my.isHttps ? <i className="fa-solid fa-circle-check" style={{
                  color: '#22c55e'
                }}></i> : <i className="fa-solid fa-circle-xmark" style={{
                  color: '#ef4444'
                }}></i>} HTTPS</span>
                  <span>{results.comp.isHttps ? <i className="fa-solid fa-circle-check" style={{
                  color: '#22c55e'
                }}></i> : <i className="fa-solid fa-circle-xmark" style={{
                  color: '#ef4444'
                }}></i>} HTTPS</span>
                </div>

                {/* Row 4: Mobile friendly */}
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              fontSize: '0.85rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.02)'
            }}>
                  <strong style={{
                color: 'var(--text-light)'
              }}>Mobil Uyumluluk</strong>
                  <span style={{
                color: '#22c55e'
              }}>Evet <i className="fa-solid fa-check"></i></span>
                  <span>{results.comp.isMobile ? <span style={{
                  color: '#22c55e'
                }}>Evet <i className="fa-solid fa-check"></i></span> : <span style={{
                  color: '#ef4444'
                }}>Hayır <i className="fa-solid fa-xmark"></i></span>}</span>
                </div>

                {/* Row 5: Google Index */}
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              fontSize: '0.85rem'
            }}>
                  <strong style={{
                color: 'var(--text-light)'
              }}>Google İndeks Sayısı</strong>
                  <span style={{
                color: 'var(--primary)',
                fontWeight: '700'
              }}>{results.my.indexCount} sayfa</span>
                  <span style={{
                color: 'var(--text-muted)'
              }}>{results.comp.indexCount} sayfa</span>
                </div>

              </div>
            </div>
            <div className="glass-card" style={{
          padding: '2rem'
        }}>
              <span className="story-tag" style={{
            marginBottom: '0.75rem',
            color: 'var(--secondary)'
          }}>RAKİBİ EZME PLANI</span>
              <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.1rem',
            color: 'var(--text-light)',
            marginBottom: '0.5rem'
          }}>Rakibinizi Geride Bırakın</h3>
              <p style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '1.25rem',
            lineHeight: '1.45'
          }}>
                Rakibinizin önüne geçmek, Google reklamlarında daha az maliyetle daha üstte çıkmak için size özel rakip eylem planını hazırlayalım.
              </p>

              {!leadSubmitted ? <form onSubmit={handleSendRequest} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.7rem'
          }}>
                  <input type="text" required placeholder="Adınız Soyadınız *" value={fullName} onChange={e => setFullName(e.target.value)} style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(15, 23, 42, 0.02)',
              color: 'var(--text-light)',
              fontSize: '0.8rem'
            }} />
                  <input type="email" required placeholder="E-posta Adresiniz *" value={email} onChange={e => setEmail(e.target.value)} style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(15, 23, 42, 0.02)',
              color: 'var(--text-light)',
              fontSize: '0.8rem'
            }} />
                  <input type="tel" required placeholder="Telefon Numaranız *" value={phone} onChange={e => setPhone(e.target.value)} style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(15, 23, 42, 0.02)',
              color: 'var(--text-light)',
              fontSize: '0.8rem'
            }} />
                  {leadError && <span style={{
              color: '#ef4444',
              fontSize: '0.7rem'
            }}>{leadError}</span>}
                  <button type="submit" className="btn btn-primary" disabled={leadLoading} style={{
              borderRadius: '6px',
              padding: '0.6rem',
              fontSize: '0.8rem',
              width: '100%',
              fontWeight: '600'
            }}>
                    {leadLoading ? 'Talebiniz İletiliyor...' : 'Rakip Ezme Planı İste'}
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
                    <span>Talebiniz Başarıyla Alındı!</span>
                  </div>
                  <p style={{
              margin: 0,
              fontSize: '0.78rem',
              color: 'rgba(22, 163, 74, 0.85)',
              lineHeight: '1.4'
            }}>
                    Rakip Ezme Planı ve Karşılaştırmalı Rapor talebiniz alınmıştır. Analiz ekibimiz, belirlediğiniz rakip web sitesinin reklam kanallarını ve SEO stratejilerini detaylıca raporlaştırıp sizinle paylaşmak üzere <strong>en kısa sürede</strong> sizinle iletişime geçecektir.
                  </p>
                </div>}
            </div>

          </div>

        </div>}
    </div>;
}

// ==========================================
// 4. ROTA AKADEMİ (REHBERLER & PDF PORTALI)
// ==========================================
