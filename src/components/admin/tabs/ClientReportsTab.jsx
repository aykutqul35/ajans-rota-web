import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { upload } from '@vercel/blob/client';

export default function ClientReportsTab({
  clientReports, setClientReports,
  editingReportBrand, setEditingReportBrand,
  setIsAddClientModalOpen, handleSaveAll, isSaving,
  activeTab, setNewClientFormData, authToken, teamMembersData
}) {
  const [isGeneratingAi, setIsGeneratingAi] = React.useState(false);

  const handleGenerateAiSummary = async () => {
    if (!editingReportBrand) return;
    const currentData = clientReports[editingReportBrand];
    if (!currentData || !currentData.kpis) {
      toast.error('KPI verisi bulunamadı.');
      return;
    }
    
    setIsGeneratingAi(true);
    const toastId = toast.loading('Yapay zeka verileri analiz ediyor...');
    
    try {
      const kpiString = currentData.kpis.map(k => `${k.label}: ${k.value} (${k.change})`).join(', ');
      const topic = `Müşteri Adı/Unvanı: ${currentData.name || currentData.brandName || editingReportBrand}. Güncel Performans Verileri: ${kpiString}. Lütfen Rota AI olarak (kendini tanıtma) direkt olarak gidişatı yorumlayan, sayısal ve profesyonel (en fazla 2-3 cümlelik) bir yönetici özeti ve stratejik tavsiye yaz. Başlangıçta müşteriye 'Sayın [Müşteri Adı] Yönetimi' veya 'Sayın Yetkili' şeklinde profesyonel kurumsal bir hitap kullan (kesinlikle Ayşe Hanım, Ali Bey gibi cinsiyet veya kişi tahmini yapma).`;
      
      const response = await fetch('/api/ai-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      
      const data = await response.json();
      if (data.success) {
        const updated = { ...clientReports };
        updated[editingReportBrand].aiSummary = data.content;
        setClientReports(updated);
        toast.success('Yapay zeka özeti başarıyla oluşturuldu!', { id: toastId });
      } else {
        toast.error('Hata: ' + data.message, { id: toastId });
      }
    } catch (err) {
      toast.error('API Bağlantı Hatası: Yapay Zeka servisine ulaşılamıyor.', { id: toastId });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
            <div>
              <div className="admin-section-title">
                Müşteri Raporlama Paneli Yönetimi
              </div>
              <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '1.5rem'
          }}>
                Müşteri Raporlama & Şeffaflık sayfasındaki E-Ticaret ve B2B marka simülasyonlarının canlı verilerini, KPI kartlarını ve çalışma geçmişi zaman çizelgesini buradan güncelleyebilirsiniz.
              </p>

              {/* Sub-selector for Brand reports */}
              <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '2.5rem',
            flexWrap: 'wrap'
          }}>
                <div style={{
              display: 'flex',
              gap: '0.5rem',
              background: 'rgba(15, 23, 42, 0.03)',
              padding: '6px',
              borderRadius: '10px',
              width: 'fit-content',
              flexWrap: 'wrap'
            }}>
                  {Object.keys(clientReports || {}).map(brandKey => {
                const isSelected = editingReportBrand === brandKey;
                const brand = clientReports[brandKey];
                const isEcom = brandKey === 'ecommerce' || brandKey.toLowerCase().includes('ecom');
                return <button key={brandKey} type="button" onClick={() => setEditingReportBrand(brandKey)} style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: isSelected ? '#fff' : 'transparent',
                  color: isSelected ? 'var(--primary)' : 'var(--text-light)',
                  boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s ease'
                }}>
                        <i className={isEcom ? "fa-solid fa-cart-shopping" : "fa-solid fa-briefcase"} style={{
                    marginRight: '6px'
                  }}></i>
                        {brand?.brandName || brandKey}
                      </button>;
              })}
                </div>

                {/* Add New Client Button */}
                <button type="button" onClick={() => {
              setNewClientFormData({ code: '', name: '', username: '', password: '' });
              setIsAddClientModalOpen(true);
            }} style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px dashed var(--primary)',
              background: 'var(--primary-glow)',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              height: 'auto',
              width: 'auto'
            }}>
                  <i className="fa-solid fa-plus"></i> Yeni Müşteri Ekle
                </button>

                {/* Delete Client Button */}
                {editingReportBrand !== 'ecommerce' && editingReportBrand !== 'b2b' && <button type="button" onClick={() => {
              if (!confirm(`${clientReports[editingReportBrand]?.brandName || editingReportBrand} müşterisini tamamen silmek istediğinize emin misiniz?`)) return;
              const updated = {
                ...clientReports
              };
              delete updated[editingReportBrand];
              setClientReports(updated);
              setEditingReportBrand('ecommerce');
            }} style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              background: 'rgba(239, 68, 68, 0.05)',
              color: '#ef4444',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginLeft: 'auto',
              height: 'auto',
              width: 'auto'
            }}>
                    <i className="fa-solid fa-trash"></i> Müşteriyi Sil
                  </button>}
              </div>

              {/* Edit Form */}
              <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
                {/* Left Column: General & KPIs */}
                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
                  <div className="admin-form-group">
                    <label>Marka / Müşteri Adı</label>
                    <input type="text" value={clientReports[editingReportBrand]?.brandName || ''} onChange={e => {
                  const updated = {
                    ...clientReports
                  };
                  updated[editingReportBrand].brandName = e.target.value;
                  setClientReports(updated);
                }} style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff',
                  color: 'var(--text-light)'
                }} />
                  </div>

                  <div className="admin-form-group">
                    <label>Sektör / Kategori Açıklaması</label>
                    <input type="text" value={clientReports[editingReportBrand]?.industry || ''} onChange={e => {
                  const updated = {
                    ...clientReports
                  };
                  updated[editingReportBrand].industry = e.target.value;
                  setClientReports(updated);
                }} style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff',
                  color: 'var(--text-light)'
                }} />
                  </div>

                  <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem'
              }}>
                    <div className="admin-form-group">
                      <label>Giriş Kullanıcı Adı (İşletmeci)</label>
                      <input type="text" value={clientReports[editingReportBrand]?.username || ''} onChange={e => {
                    const updated = {
                      ...clientReports
                    };
                    if (!updated[editingReportBrand]) updated[editingReportBrand] = {};
                    updated[editingReportBrand].username = e.target.value;
                    setClientReports(updated);
                  }} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff',
                    color: 'var(--text-light)'
                  }} />
                    </div>
                    <div className="admin-form-group">
                      <label>Giriş Şifresi (İşletmeci)</label>
                      <input type="text" value={clientReports[editingReportBrand]?.password || ''} onChange={e => {
                    const updated = {
                      ...clientReports
                    };
                    if (!updated[editingReportBrand]) updated[editingReportBrand] = {};
                    updated[editingReportBrand].password = e.target.value;
                    setClientReports(updated);
                  }} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff',
                    color: 'var(--text-light)'
                  }} />
                    </div>
                  </div>

                  {/* API & Webhook Integration Box */}
                  <div style={{
                border: '1px solid rgba(99, 102, 241, 0.18)',
                padding: '1.25rem',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.02)',
                marginBottom: '0.5rem'
              }}>
                    <span style={{
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '0.75rem'
                }}>
                      <i className="fa-solid fa-cloud-bolt"></i> Make.com / API Entegrasyon Ayarları
                    </span>
                    
                    <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                      {/* Webhook URL */}
                      <div>
                        <span style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-light)',
                      display: 'block',
                      marginBottom: '0.25rem',
                      fontWeight: 600
                    }}>Webhook Hedef URL</span>
                        <div style={{
                      display: 'flex',
                      gap: '0.5rem'
                    }}>
                          <input type="text" readOnly value={`${window.location.origin}/api.php?action=update_live_metrics`} style={{
                        flex: 1,
                        padding: '0.45rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)',
                        background: '#f8fafc',
                        color: 'var(--text-muted)',
                        fontSize: '0.72rem'
                      }} />
                          <button type="button" onClick={e => {
                        navigator.clipboard.writeText(`${window.location.origin}/api.php?action=update_live_metrics`);
                        const prevText = e.currentTarget.innerText;
                        e.currentTarget.innerText = "Kopyalandı!";
                        setTimeout(() => e.currentTarget.innerText = prevText, 1500);
                      }} style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'var(--primary)',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}>
                            Kopyala
                          </button>
                        </div>
                      </div>

                      {/* Bearer Token */}
                      <div>
                        <span style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-light)',
                      display: 'block',
                      marginBottom: '0.25rem',
                      fontWeight: 600
                    }}>Authorization Bearer Token</span>
                        <div style={{
                      display: 'flex',
                      gap: '0.5rem'
                    }}>
                          <input type="text" readOnly value={authToken} style={{
                        flex: 1,
                        padding: '0.45rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)',
                        background: '#f8fafc',
                        color: 'var(--text-muted)',
                        fontSize: '0.72rem'
                      }} />
                          <button type="button" onClick={e => {
                        navigator.clipboard.writeText(authToken);
                        const prevText = e.currentTarget.innerText;
                        e.currentTarget.innerText = "Kopyalandı!";
                        setTimeout(() => e.currentTarget.innerText = prevText, 1500);
                      }} style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'var(--primary)',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}>
                            Kopyala
                          </button>
                        </div>
                      </div>

                      {/* Last Sync Time & Client Code */}
                      <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.72rem',
                    background: 'rgba(15, 23, 42, 0.03)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    marginTop: '0.25rem'
                  }}>
                        <span style={{
                      color: 'var(--text-light)'
                    }}>Firma Kodu: <strong style={{
                        color: 'var(--primary)'
                      }}>{editingReportBrand}</strong></span>
                        <span style={{
                      color: 'var(--text-light)',
                      textAlign: 'right'
                    }}>
                          {clientReports[editingReportBrand]?.api_last_sync ? <>Senk: <strong style={{
                          color: '#16a34a'
                        }}>{clientReports[editingReportBrand].api_last_sync}</strong></> : <span style={{
                        color: 'var(--text-muted)',
                        fontStyle: 'italic'
                      }}>Henüz Senkronize Edilmedi</span>}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Summary Input */}
                  <div style={{
                    border: '1px solid var(--glass-border)',
                    padding: '1.25rem',
                    borderRadius: '10px',
                    background: 'rgba(99, 102, 241, 0.05)',
                    marginBottom: '1rem',
                    borderLeft: '4px solid var(--primary)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fa-solid fa-robot" style={{ color: 'var(--primary)' }}></i> Yapay Zeka Yönetici Özeti
                      </span>
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', opacity: isGeneratingAi ? 0.7 : 1 }} 
                        onClick={handleGenerateAiSummary}
                        disabled={isGeneratingAi}
                      >
                        {isGeneratingAi ? (
                          <><i className="fa-solid fa-spinner fa-spin"></i> Analiz Ediliyor...</>
                        ) : (
                          <><i className="fa-solid fa-wand-magic-sparkles"></i> Otomatik Yazdır</>
                        )}
                      </button>
                    </div>
                    <textarea 
                      rows="3" 
                      placeholder="Müşteriye gösterilecek haftalık stratejik AI yorumu..."
                      value={clientReports[editingReportBrand]?.aiSummary || ''}
                      onChange={e => {
                        const updated = { ...clientReports };
                        if (!updated[editingReportBrand]) updated[editingReportBrand] = {};
                        updated[editingReportBrand].aiSummary = e.target.value;
                        setClientReports(updated);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(15, 23, 42, 0.1)',
                        fontSize: '0.85rem',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        background: '#fff'
                      }}
                    ></textarea>
                  </div>

                  <div style={{
                border: '1px solid var(--glass-border)',
                padding: '1.25rem',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.01)'
              }}>
                    <span style={{
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  color: 'var(--text-light)',
                  display: 'block',
                  marginBottom: '1rem'
                }}>
                      KPI Kart Değerleri
                    </span>
                    <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                      {clientReports[editingReportBrand]?.kpis.map((kpi, idx) => <div key={idx} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    alignItems: 'center'
                  }}>
                          <span style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-light)',
                      fontWeight: 600
                    }}>{kpi.label}</span>
                          <div style={{
                      display: 'flex',
                      gap: '0.5rem'
                    }}>
                            <input type="text" placeholder="Değer (örn: 984 Adet)" value={kpi.value} onChange={e => {
                        const updated = {
                          ...clientReports
                        };
                        updated[editingReportBrand].kpis[idx].value = e.target.value;
                        setClientReports(updated);
                      }} style={{
                        width: '100%',
                        padding: '0.4rem 0.6rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.8rem',
                        background: '#fff',
                        color: 'var(--text-light)'
                      }} />
                            <input type="text" placeholder="Değişim (örn: +18%)" value={kpi.change} onChange={e => {
                        const updated = {
                          ...clientReports
                        };
                        updated[editingReportBrand].kpis[idx].change = e.target.value;
                        setClientReports(updated);
                      }} style={{
                        width: '100%',
                        padding: '0.4rem 0.6rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.8rem',
                        background: '#fff',
                        color: 'var(--text-light)'
                      }} />
                          </div>
                        </div>)}
                    </div>
                  </div>
                </div>

                {/* Right Column: Timeline Events */}
                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
                  <div style={{
                border: '1px solid var(--glass-border)',
                padding: '1.25rem',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.01)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                    <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                      <span style={{
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    color: 'var(--text-light)'
                  }}>
                        Zaman Çizelgesi (Yapılan Çalışmalar)
                      </span>
                      <button type="button" onClick={() => {
                    setClientReports(prev => {
                      const updated = { ...prev };
                      const brandData = { ...updated[editingReportBrand] };
                      const newTimeline = [...(brandData.timeline || [])];
                      newTimeline.unshift({
                        date: new Date().toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }),
                        title: "Yeni Çalışma Maddesi",
                        desc: "Yapılan çalışmanın detaylı açıklaması buraya yazılır.",
                        author: "Yiğit K. (SEO & Google Ads)"
                      });
                      brandData.timeline = newTimeline;
                      updated[editingReportBrand] = brandData;
                      return updated;
                    });
                  }} className="btn btn-primary" style={{
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.75rem',
                    borderRadius: '4px'
                  }}>
                        <i className="fa-solid fa-plus"></i> Ekle
                      </button>
                    </div>

                    <div style={{
                  overflowY: 'auto',
                  flex: 1,
                  maxHeight: '420px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  paddingRight: '6px',
                  position: 'relative'
                }}>
                      {/* Vertical Connecting Line */}
                      <div style={{
                    position: 'absolute',
                    left: '19px',
                    top: '15px',
                    bottom: '15px',
                    width: '2px',
                    background: 'linear-gradient(180deg, var(--primary) 0%, rgba(99, 102, 241, 0.15) 100%)',
                    zIndex: 1
                  }}></div>

                      {clientReports[editingReportBrand]?.timeline.map((event, idx) => {
                    const isBot = event.author?.toLowerCase().includes('bot') || event.author?.toLowerCase().includes('make.com');
                    const isSEO = event.title?.toLowerCase().includes('seo') || event.desc?.toLowerCase().includes('seo');
                    const isAds = event.title?.toLowerCase().includes('ads') || event.title?.toLowerCase().includes('reklam');
                    let accentColor = 'var(--text-muted)';
                    let iconClass = 'fa-solid fa-pen-to-square';
                    if (isBot) {
                      accentColor = '#6366f1';
                      iconClass = 'fa-solid fa-robot';
                    } else if (isSEO) {
                      accentColor = 'var(--secondary)';
                      iconClass = 'fa-solid fa-magnifying-glass-chart';
                    } else if (isAds) {
                      accentColor = 'var(--primary)';
                      iconClass = 'fa-solid fa-bullhorn';
                    }

                    // Helper to convert arbitrary Date string to YYYY-MM-DD for <input type="date">
                    const dateInputValue = (() => {
                      const dateStr = event.date;
                      if (!dateStr) return '';

                      // 1. If it's already YYYY-MM-DD
                      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

                      // 2. If it's DD.MM.YYYY
                      const ddmmyyyyMatch = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
                      if (ddmmyyyyMatch) {
                        const [_, d, m, y] = ddmmyyyyMatch;
                        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
                      }

                      // 3. If it has Turkish month names like "21 Haziran 2026"
                      const trMonths = {
                        ocak: '01',
                        subat: '02',
                        şubat: '02',
                        mart: '03',
                        nisan: '04',
                        mayis: '05',
                        mayıs: '05',
                        haziran: '06',
                        temmuz: '07',
                        agustos: '08',
                        ağustos: '08',
                        eylul: '09',
                        eylül: '09',
                        ekim: '10',
                        kasim: '11',
                        kasım: '11',
                        aralik: '12',
                        aralık: '12'
                      };
                      const parts = dateStr.toLowerCase().split(/\s+/);
                      if (parts.length >= 3) {
                        const day = parts[0].replace(/\D/g, '').padStart(2, '0');
                        const year = parts[2].replace(/\D/g, '');
                        const monthStr = parts[1];
                        const month = trMonths[monthStr] || '01';
                        if (day && year && year.length === 4) {
                          return `${year}-${month}-${day}`;
                        }
                      }
                      return new Date().toISOString().split('T')[0];
                    })();

                    // Format picked YYYY-MM-DD date to Turkish long format "21 Haziran 2026"
                    const formatToTurkishDate = val => {
                      if (!val) return '';
                      const [y, m, d] = val.split('-');
                      const trMonthsArray = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
                      const monthIndex = parseInt(m, 10) - 1;
                      const monthName = trMonthsArray[monthIndex] || '';
                      return `${parseInt(d, 10)} ${monthName} ${y}`;
                    };
                    return <div key={idx} style={{
                      background: '#fff',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '10px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                      position: 'relative',
                      marginLeft: '2.5rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                      zIndex: 2
                    }}>
                            {/* Timeline Node Bullet */}
                            <div style={{
                        position: 'absolute',
                        left: '-2.5rem',
                        top: '12px',
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: '#fff',
                        border: `2px solid ${accentColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: accentColor,
                        fontSize: '0.75rem',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        zIndex: 3
                      }}>
                              <i className={iconClass}></i>
                            </div>

                            {/* Header with Title & Delete Button */}
                            <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}>
                              <input type="text" placeholder="Başlık (örn: SEO Çalışmaları)" value={event.title} onChange={e => {
                          const val = e.target.value;
                          setClientReports(prev => {
                            const updated = { ...prev };
                            const brandData = { ...updated[editingReportBrand] };
                            const newTimeline = [...(brandData.timeline || [])];
                            newTimeline[idx] = { ...newTimeline[idx], title: val };
                            brandData.timeline = newTimeline;
                            updated[editingReportBrand] = brandData;
                            return updated;
                          });
                        }} style={{
                          flex: 1,
                          padding: '0.35rem 0.5rem',
                          borderRadius: '6px',
                          border: '1px solid var(--glass-border)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          background: 'rgba(15, 23, 42, 0.01)',
                          color: 'var(--text-light)',
                          outline: 'none'
                        }} />
                              <button type="button" onClick={() => {
                          if (window.confirm('Bu zaman çizelgesi maddesini silmek istediğinizden emin misiniz?')) {
                            setClientReports(prev => {
                              const updated = { ...prev };
                              const brandData = { ...updated[editingReportBrand] };
                              const newTimeline = [...(brandData.timeline || [])];
                              newTimeline.splice(idx, 1);
                              brandData.timeline = newTimeline;
                              updated[editingReportBrand] = brandData;
                              return updated;
                            });
                          }
                        }} style={{
                          border: 'none',
                          background: 'rgba(239, 68, 68, 0.08)',
                          borderRadius: '6px',
                          width: '26px',
                          height: '26px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#ef4444',
                          fontSize: '0.75rem',
                          transition: 'all 0.2s'
                        }} title="Maddeyi Sil">
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>

                            {/* Meta row: Date and Author */}
                            <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.5rem'
                      }}>
                              <div>
                                <span style={{
                            fontSize: '0.65rem',
                            color: 'var(--text-muted)',
                            display: 'block',
                            marginBottom: '2px',
                            fontWeight: 600
                          }}>Tarih</span>
                                <input type="date" value={dateInputValue} onChange={e => {
                            const formattedDate = formatToTurkishDate(e.target.value);
                            setClientReports(prev => {
                              const updated = { ...prev };
                              const brandData = { ...updated[editingReportBrand] };
                              const newTimeline = [...(brandData.timeline || [])];
                              newTimeline[idx] = { ...newTimeline[idx], date: formattedDate };
                              brandData.timeline = newTimeline;
                              updated[editingReportBrand] = brandData;
                              return updated;
                            });
                          }} style={{
                            width: '100%',
                            padding: '0.3rem 0.45rem',
                            borderRadius: '5px',
                            border: '1px solid var(--glass-border)',
                            fontSize: '0.72rem',
                            background: '#fff',
                            color: 'var(--text-light)',
                            cursor: 'pointer'
                          }} />
                              </div>
                              <div>
                                <span style={{
                            fontSize: '0.65rem',
                            color: 'var(--text-muted)',
                            display: 'block',
                            marginBottom: '2px',
                            fontWeight: 600
                          }}>Sorumlu</span>
                                <select value={event.author} onChange={e => {
                            const val = e.target.value;
                            setClientReports(prev => {
                              const updated = { ...prev };
                              const brandData = { ...updated[editingReportBrand] };
                              const newTimeline = [...(brandData.timeline || [])];
                              newTimeline[idx] = { ...newTimeline[idx], author: val };
                              brandData.timeline = newTimeline;
                              updated[editingReportBrand] = brandData;
                              return updated;
                            });
                          }} style={{
                            width: '100%',
                            padding: '0.3rem 0.45rem',
                            borderRadius: '5px',
                            border: '1px solid var(--glass-border)',
                            fontSize: '0.72rem',
                            background: '#fff',
                            color: 'var(--text-light)',
                            outline: 'none',
                            cursor: 'pointer'
                          }}>
                                  {!teamMembersData.some(m => `${m.name} (${m.role})` === event.author) && event.author && <option value={event.author}>{event.author}</option>}
                                  
                                  <option value="Yiğit K. (SEO & Google Ads)">Yiğit K. (SEO & Google Ads)</option>
                                  <option value="Melis S. (Kreatif Direktör)">Melis S. (Kreatif Direktör)</option>
                                  <option value="Emre T. (Web Developer)">Emre T. (Web Developer)</option>
                                  <option value="Selin Y. (Müşteri İlişkileri)">Selin Y. (Müşteri İlişkileri)</option>
                                  <option value="Make.com (Otomasyon)">Make.com (Otomasyon)</option>
                                  
                                  {teamMembersData.map((member, mIdx) => {
                              const val = `${member.name} (${member.role})`;
                              if (["Yiğit K. (SEO & Google Ads)", "Melis S. (Kreatif Direktör)", "Emre T. (Web Developer)", "Selin Y. (Müşteri İlişkileri)"].includes(val)) {
                                return null;
                              }
                              return <option key={mIdx} value={val}>
                                        {member.name} ({member.role})
                                      </option>;
                            })}
                                </select>
                              </div>
                            </div>

                            {/* Description text area */}
                            <div>
                              <span style={{
                          fontSize: '0.65rem',
                          color: 'var(--text-muted)',
                          display: 'block',
                          marginBottom: '2px',
                          fontWeight: 600
                        }}>Çalışma Detayları (Mesaj Alanı)</span>
                              <textarea placeholder="Açıklama" rows="2" value={event.desc} onChange={e => {
                          const val = e.target.value;
                          setClientReports(prev => {
                            const updated = { ...prev };
                            const brandData = { ...updated[editingReportBrand] };
                            const newTimeline = [...(brandData.timeline || [])];
                            newTimeline[idx] = { ...newTimeline[idx], desc: val };
                            brandData.timeline = newTimeline;
                            updated[editingReportBrand] = brandData;
                            return updated;
                          });
                        }} style={{
                          width: '100%',
                          padding: '0.35rem 0.5rem',
                          borderRadius: '6px',
                          border: '1px solid var(--glass-border)',
                          fontSize: '0.72rem',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                          background: '#fff',
                          color: 'var(--text-light)',
                          lineHeight: '1.4'
                        }} />
                            </div>
                          </div>;
                  })}
                    </div>
                  </div>
                </div>
              </div>
              {/* Creatives & Files Upload Section */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '2rem',
                marginBottom: '2rem'
              }}>
                {/* Vault / Files */}
                <div style={{
                  border: '1px solid var(--glass-border)',
                  padding: '1.25rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.01)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                      Dosya Kasası (Faturalar & Raporlar)
                    </span>
                    <label className="btn btn-primary" style={{
                      padding: '0.25rem 0.6rem',
                      fontSize: '0.75rem',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>
                      <i className="fa-solid fa-upload"></i> Dosya Yükle
                      <input type="file" style={{ display: 'none' }} accept="image/*,application/pdf" onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        
                        try {
                          const newBlob = await upload(Date.now() + '-' + file.name, file, { access: 'public', handleUploadUrl: '/api/upload' });
                          
                          const updated = { ...clientReports };
                          if (!updated[editingReportBrand].files) updated[editingReportBrand].files = [];
                          updated[editingReportBrand].files.push({
                            id: Date.now(),
                            title: file.name,
                            type: file.name.toLowerCase().includes('fatura') ? 'invoice' : 'pdf',
                            url: newBlob.url,
                            date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })
                          });
                          setClientReports(updated);
                          const localDbStr = localStorage.getItem('ajans_rota_db');
                          if (localDbStr) {
                            try {
                              const dbPayload = JSON.parse(localDbStr);
                              dbPayload.clientReports = updated;
                              localStorage.setItem('ajans_rota_db', JSON.stringify(dbPayload));
                            } catch(e) {}
                          }
                          // Save to Neon
                          if (updated[editingReportBrand].client_id) {
                            fetch('/api/clients/update', {
                              method: 'PUT',
                              headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                              },
                              body: JSON.stringify({ 
                                client_id: updated[editingReportBrand].client_id, 
                                report_data: updated[editingReportBrand] 
                              })
                            }).catch(console.error);
                          }
                          toast.success('Dosya başarıyla Vercel Blob\'a yüklendi!');
                        } catch (err) {
                          console.error('Vercel Blob Upload Error:', err);
                          toast.error('Dosya yüklenirken Vercel kaynaklı bir hata oluştu:\n\n' + err.message + '\n\nLütfen Vercel ayarlarınızı kontrol edin.');
                        }
                      }} />
                    </label>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {(clientReports[editingReportBrand]?.files || []).map((f, idx) => (
                      <div key={idx} style={{
                        padding: '0.75rem',
                        background: '#fff',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{f.title}</span>
                          <a href={f.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', color: 'var(--primary)', textDecoration: 'none' }}>Görüntüle</a>
                        </div>
                        <button type="button" onClick={() => {
                          if (window.confirm('Bu dosyayı silmek istediğinize emin misiniz?')) {
                            const updated = { ...clientReports };
                            updated[editingReportBrand].files.splice(idx, 1);
                            setClientReports(updated);
                          }
                        }} style={{
                          border: 'none', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '6px',
                          width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: '#ef4444', fontSize: '0.75rem'
                        }}>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Google & Meta Ads Campaigns Tables */}
              <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
                {/* Google Ads */}
                <div style={{
              border: '1px solid var(--glass-border)',
              padding: '1.25rem',
              borderRadius: '10px',
              background: 'rgba(15, 23, 42, 0.01)'
            }}>
                  <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                    <span style={{
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  color: 'var(--text-light)'
                }}>
                      Google Ads Kampanya Performans Tablosu
                    </span>
                    <button type="button" onClick={() => {
                  const updated = {
                    ...clientReports
                  };
                  updated[editingReportBrand].googleAds.push({
                    name: "Yeni Arama Ağı Kampanyası",
                    spend: "0 TL",
                    clicks: "0",
                    ctr: "0.00%",
                    conversions: "0",
                    roas: editingReportBrand === 'ecommerce' ? "1.0x" : "0 TL CPL"
                  });
                  setClientReports(updated);
                }} className="btn btn-primary" style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.75rem',
                  borderRadius: '4px'
                }}>
                      <i className="fa-solid fa-plus"></i> Ekle
                    </button>
                  </div>
                  <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                    {clientReports[editingReportBrand]?.googleAds.map((camp, idx) => <div key={idx} style={{
                  background: '#fff',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  position: 'relative'
                }}>
                        <button type="button" onClick={() => {
                    const updated = {
                      ...clientReports
                    };
                    updated[editingReportBrand].googleAds.splice(idx, 1);
                    setClientReports(updated);
                  }} style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#ef4444',
                    fontSize: '0.8rem'
                  }}>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                        <input type="text" value={camp.name} onChange={e => {
                    const updated = {
                      ...clientReports
                    };
                    updated[editingReportBrand].googleAds[idx].name = e.target.value;
                    setClientReports(updated);
                  }} placeholder="Kampanya Adı" style={{
                    width: '90%',
                    padding: '0.35rem 0.5rem',
                    borderRadius: '4px',
                    border: '1px solid var(--glass-border)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: '#fff',
                    color: 'var(--text-light)'
                  }} />
                        <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '0.35rem'
                  }}>
                          <div>
                            <span style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        display: 'block'
                      }}>Harcama</span>
                            <input type="text" value={camp.spend} onChange={e => {
                        const updated = {
                          ...clientReports
                        };
                        updated[editingReportBrand].googleAds[idx].spend = e.target.value;
                        setClientReports(updated);
                      }} style={{
                        width: '100%',
                        padding: '0.25rem 0.4rem',
                        borderRadius: '4px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.7rem',
                        background: '#fff',
                        color: 'var(--text-light)'
                      }} />
                          </div>
                          <div>
                            <span style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        display: 'block'
                      }}>Tıklama</span>
                            <input type="text" value={camp.clicks} onChange={e => {
                        const updated = {
                          ...clientReports
                        };
                        updated[editingReportBrand].googleAds[idx].clicks = e.target.value;
                        setClientReports(updated);
                      }} style={{
                        width: '100%',
                        padding: '0.25rem 0.4rem',
                        borderRadius: '4px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.7rem',
                        background: '#fff',
                        color: 'var(--text-light)'
                      }} />
                          </div>
                          <div>
                            <span style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        display: 'block'
                      }}>CTR</span>
                            <input type="text" value={camp.ctr} onChange={e => {
                        const updated = {
                          ...clientReports
                        };
                        updated[editingReportBrand].googleAds[idx].ctr = e.target.value;
                        setClientReports(updated);
                      }} style={{
                        width: '100%',
                        padding: '0.25rem 0.4rem',
                        borderRadius: '4px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.7rem',
                        background: '#fff',
                        color: 'var(--text-light)'
                      }} />
                          </div>
                          <div>
                            <span style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        display: 'block'
                      }}>Dönüşüm</span>
                            <input type="text" value={camp.conversions} onChange={e => {
                        const updated = {
                          ...clientReports
                        };
                        updated[editingReportBrand].googleAds[idx].conversions = e.target.value;
                        setClientReports(updated);
                      }} style={{
                        width: '100%',
                        padding: '0.25rem 0.4rem',
                        borderRadius: '4px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.7rem',
                        background: '#fff',
                        color: 'var(--text-light)'
                      }} />
                          </div>
                          <div>
                            <span style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        display: 'block'
                      }}>{editingReportBrand === 'ecommerce' ? 'ROAS' : 'CPL'}</span>
                            <input type="text" value={camp.roas} onChange={e => {
                        const updated = {
                          ...clientReports
                        };
                        updated[editingReportBrand].googleAds[idx].roas = e.target.value;
                        setClientReports(updated);
                      }} style={{
                        width: '100%',
                        padding: '0.25rem 0.4rem',
                        borderRadius: '4px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.7rem',
                        background: '#fff',
                        color: 'var(--text-light)'
                      }} />
                          </div>
                        </div>
                      </div>)}
                  </div>
                </div>

                {/* Meta Ads */}
                <div style={{
              border: '1px solid var(--glass-border)',
              padding: '1.25rem',
              borderRadius: '10px',
              background: 'rgba(15, 23, 42, 0.01)'
            }}>
                  <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                    <span style={{
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  color: 'var(--text-light)'
                }}>
                      Meta Ads Kampanya Performans Tablosu
                    </span>
                    <button type="button" onClick={() => {
                  const updated = {
                    ...clientReports
                  };
                  updated[editingReportBrand].metaAds.push({
                    name: "Yeni Reels Video Reklam Seti",
                    spend: "0 TL",
                    clicks: "0",
                    ctr: "0.00%",
                    conversions: "0",
                    roas: editingReportBrand === 'ecommerce' ? "1.0x" : "0 TL CPL",
                    status: "Aktif"
                  });
                  setClientReports(updated);
                }} className="btn btn-primary" style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.75rem',
                  borderRadius: '4px'
                }}>
                      <i className="fa-solid fa-plus"></i> Ekle
                    </button>
                  </div>
                  <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                    {clientReports[editingReportBrand]?.metaAds.map((camp, idx) => <div key={idx} style={{
                  background: '#fff',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  position: 'relative'
                }}>
                        <button type="button" onClick={() => {
                    const updated = {
                      ...clientReports
                    };
                    updated[editingReportBrand].metaAds.splice(idx, 1);
                    setClientReports(updated);
                  }} style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#ef4444',
                    fontSize: '0.8rem'
                  }}>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                        <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    width: '90%',
                    alignItems: 'center'
                  }}>
                          <input type="text" value={camp.name} onChange={e => {
                      const updated = {
                        ...clientReports
                      };
                      updated[editingReportBrand].metaAds[idx].name = e.target.value;
                      setClientReports(updated);
                    }} placeholder="Kampanya Adı" style={{
                      flex: 2,
                      padding: '0.35rem 0.5rem',
                      borderRadius: '4px',
                      border: '1px solid var(--glass-border)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: '#fff',
                      color: 'var(--text-light)'
                    }} />
                          <select value={camp.status || 'Aktif'} onChange={e => {
                      const updated = {
                        ...clientReports
                      };
                      updated[editingReportBrand].metaAds[idx].status = e.target.value;
                      setClientReports(updated);
                    }} style={{
                      flex: 1,
                      padding: '0.3rem 0.5rem',
                      borderRadius: '4px',
                      border: '1px solid var(--glass-border)',
                      fontSize: '0.75rem',
                      background: '#fff',
                      color: 'var(--text-light)'
                    }}>
                            <option value="Aktif">Aktif</option>
                            <option value="Duraklatıldı">Duraklatıldı</option>
                          </select>
                        </div>
                        <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '0.35rem'
                  }}>
                          <div>
                            <span style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        display: 'block'
                      }}>Harcama</span>
                            <input type="text" value={camp.spend} onChange={e => {
                        const updated = {
                          ...clientReports
                        };
                        updated[editingReportBrand].metaAds[idx].spend = e.target.value;
                        setClientReports(updated);
                      }} style={{
                        width: '100%',
                        padding: '0.25rem 0.4rem',
                        borderRadius: '4px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.7rem',
                        background: '#fff',
                        color: 'var(--text-light)'
                      }} />
                          </div>
                          <div>
                            <span style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        display: 'block'
                      }}>Tıklama</span>
                            <input type="text" value={camp.clicks} onChange={e => {
                        const updated = {
                          ...clientReports
                        };
                        updated[editingReportBrand].metaAds[idx].clicks = e.target.value;
                        setClientReports(updated);
                      }} style={{
                        width: '100%',
                        padding: '0.25rem 0.4rem',
                        borderRadius: '4px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.7rem',
                        background: '#fff',
                        color: 'var(--text-light)'
                      }} />
                          </div>
                          <div>
                            <span style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        display: 'block'
                      }}>CTR</span>
                            <input type="text" value={camp.ctr} onChange={e => {
                        const updated = {
                          ...clientReports
                        };
                        updated[editingReportBrand].metaAds[idx].ctr = e.target.value;
                        setClientReports(updated);
                      }} style={{
                        width: '100%',
                        padding: '0.25rem 0.4rem',
                        borderRadius: '4px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.7rem',
                        background: '#fff',
                        color: 'var(--text-light)'
                      }} />
                          </div>
                          <div>
                            <span style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        display: 'block'
                      }}>Dönüşüm</span>
                            <input type="text" value={camp.conversions} onChange={e => {
                        const updated = {
                          ...clientReports
                        };
                        updated[editingReportBrand].metaAds[idx].conversions = e.target.value;
                        setClientReports(updated);
                      }} style={{
                        width: '100%',
                        padding: '0.25rem 0.4rem',
                        borderRadius: '4px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.7rem',
                        background: '#fff',
                        color: 'var(--text-light)'
                      }} />
                          </div>
                          <div>
                            <span style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        display: 'block'
                      }}>{editingReportBrand === 'ecommerce' ? 'ROAS' : 'CPL'}</span>
                            <input type="text" value={camp.roas} onChange={e => {
                        const updated = {
                          ...clientReports
                        };
                        updated[editingReportBrand].metaAds[idx].roas = e.target.value;
                        setClientReports(updated);
                      }} style={{
                        width: '100%',
                        padding: '0.25rem 0.4rem',
                        borderRadius: '4px',
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.7rem',
                        background: '#fff',
                        color: 'var(--text-light)'
                      }} />
                          </div>
                        </div>
                      </div>)}
                  </div>
                </div>

                {/* --- TEAM MANAGERS --- */}
                <div style={{ marginTop: '2.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--text-dark)' }}><i className="fa-solid fa-users" style={{ marginRight: '8px', color: '#0ea5e9' }}></i> Hesap Yöneticileri (Ekip)</h4>
                    <button type="button" className="btn btn-secondary" onClick={() => {
                      const updated = { ...clientReports };
                      if (!updated[editingReportBrand].teamManagers) updated[editingReportBrand].teamManagers = [];
                      updated[editingReportBrand].teamManagers.push({
                        name: "Aykut K.", role: "Ajans Başkanı", avatar: "https://i.pravatar.cc/150?u=aykut", online: true
                      });
                      setClientReports(updated);
                    }} style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>
                      <i className="fa-solid fa-plus"></i> Üye Ekle
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {(clientReports[editingReportBrand]?.teamManagers || []).map((member, idx) => (
                      <div key={idx} style={{ background: '#fff', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.75rem', position: 'relative', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => {
                          setClientReports(prev => {
                            const updated = { ...prev };
                            const brandData = { ...updated[editingReportBrand] };
                            const newManagers = [...(brandData.teamManagers || [])];
                            newManagers.splice(idx, 1);
                            brandData.teamManagers = newManagers;
                            updated[editingReportBrand] = brandData;
                            return updated;
                          });
                        }} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}><i className="fa-solid fa-trash"></i></button>
                        
                        <select value={member.name || ''} onChange={e => {
                          const val = e.target.value;
                          const agencyTeam = [
                            { name: "Aykut Qul", role: "Ajans Başkanı", avatar: "https://i.pravatar.cc/150?u=aykut" },
                            { name: "Ahmet Yılmaz", role: "Google Ads & SEO", avatar: "https://i.pravatar.cc/150?u=ahmet" },
                            { name: "Ayşe Demir", role: "Meta Ads & Kreatif", avatar: "https://i.pravatar.cc/150?u=ayse" },
                            { name: "Melis S.", role: "Müşteri Başarı Yöneticisi", avatar: "https://i.pravatar.cc/150?u=melis" },
                            { name: "Selin Y.", role: "Sosyal Medya", avatar: "https://i.pravatar.cc/150?u=selin" },
                            { name: "Büşra T.", role: "Proje Yöneticisi", avatar: "https://i.pravatar.cc/150?u=busra" },
                            { name: "Kemal D.", role: "Yazılım Uzmanı", avatar: "https://i.pravatar.cc/150?u=kemal" }
                          ];
                          const found = agencyTeam.find(t => t.name === val) || { role: "", avatar: "https://i.pravatar.cc/150" };
                          
                          setClientReports(prev => {
                            const updated = { ...prev };
                            const brandData = { ...updated[editingReportBrand] };
                            const newManagers = [...(brandData.teamManagers || [])];
                            newManagers[idx] = { ...newManagers[idx], name: val, role: found.role, avatar: found.avatar };
                            brandData.teamManagers = newManagers;
                            updated[editingReportBrand] = brandData;
                            return updated;
                          });
                        }} style={{ flex: 1, padding: '0.35rem', borderRadius: '4px', border: '1px solid var(--glass-border)', fontSize: '0.75rem' }}>
                          <option value="">İsim Seçin...</option>
                          <option value="Aykut Qul">Aykut Qul</option>
                          <option value="Ahmet Yılmaz">Ahmet Yılmaz</option>
                          <option value="Ayşe Demir">Ayşe Demir</option>
                          <option value="Melis S.">Melis S.</option>
                          <option value="Selin Y.">Selin Y.</option>
                          <option value="Büşra T.">Büşra T.</option>
                          <option value="Kemal D.">Kemal D.</option>
                        </select>
                        
                        <input type="text" value={member.role || ''} onChange={e => {
                          const val = e.target.value;
                          setClientReports(prev => {
                            const updated = { ...prev };
                            const brandData = { ...updated[editingReportBrand] };
                            const newManagers = [...(brandData.teamManagers || [])];
                            newManagers[idx] = { ...newManagers[idx], role: val };
                            brandData.teamManagers = newManagers;
                            updated[editingReportBrand] = brandData;
                            return updated;
                          });
                        }} placeholder="Rol" style={{ width: '100%', padding: '0.35rem', borderRadius: '4px', border: '1px solid var(--glass-border)', fontSize: '0.75rem' }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- ROADMAP / NEXT MONTH PLAN --- */}
                <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--text-dark)' }}><i className="fa-solid fa-map" style={{ marginRight: '8px', color: '#10b981' }}></i> Gelecek Ay Planı (Roadmap)</h4>
                    <button type="button" className="btn btn-secondary" onClick={() => {
                      setClientReports(prev => {
                        const updated = { ...prev };
                        const brandData = { ...updated[editingReportBrand] };
                        const newPlan = [...(brandData.nextMonthPlan || [])];
                        newPlan.push({
                          id: Math.floor(Math.random() * 10000), task: "", status: "Bekliyor", date: "", category: "Ads"
                        });
                        brandData.nextMonthPlan = newPlan;
                        updated[editingReportBrand] = brandData;
                        return updated;
                      });
                    }} style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>
                      <i className="fa-solid fa-plus"></i> Görev Ekle
                    </button>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    position: 'relative',
                    marginTop: '0.5rem',
                    paddingLeft: '0.5rem'
                  }}>
                    {/* Vertical Connecting Line */}
                    <div style={{
                      position: 'absolute',
                      left: '27px',
                      top: '15px',
                      bottom: '15px',
                      width: '2px',
                      background: 'linear-gradient(180deg, #10b981 0%, rgba(16, 185, 129, 0.15) 100%)',
                      zIndex: 1
                    }}></div>

                    {(clientReports[editingReportBrand]?.nextMonthPlan || []).map((plan, idx) => {
                      let accentColor = '#94a3b8'; // Default Gray (Bekliyor)
                      let iconClass = 'fa-regular fa-circle';

                      if (plan.status === 'İşlemde') {
                        accentColor = '#0ea5e9'; // Blue
                        iconClass = 'fa-solid fa-spinner fa-spin';
                      } else if (plan.status === 'Planlandı' || plan.status === 'Tamamlandı') {
                        accentColor = '#10b981'; // Green
                        iconClass = 'fa-solid fa-check';
                      }

                      return (
                        <div key={plan.id || idx} style={{
                          background: '#fff',
                          border: '1px solid var(--glass-border)',
                          borderRadius: '10px',
                          padding: '1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.6rem',
                          position: 'relative',
                          marginLeft: '2.5rem',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                          zIndex: 2
                        }}>
                          {/* Node Bullet */}
                          <div style={{
                            position: 'absolute',
                            left: '-2.5rem',
                            top: '12px',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: '#fff',
                            border: `2px solid ${accentColor}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: accentColor,
                            fontSize: '0.75rem',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            zIndex: 3
                          }}>
                            <i className={iconClass}></i>
                          </div>

                          {/* Header (Title & Trash) */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                            <input type="text" placeholder="Görev Adı (örn: Yeni Kampanya Kurgusu)" value={plan.task || ''} onChange={e => {
                              const val = e.target.value;
                              setClientReports(prev => {
                                const updated = { ...prev };
                                const brandData = { ...updated[editingReportBrand] };
                                const newPlan = [...(brandData.nextMonthPlan || [])];
                                newPlan[idx] = { ...newPlan[idx], task: val };
                                brandData.nextMonthPlan = newPlan;
                                updated[editingReportBrand] = brandData;
                                return updated;
                              });
                            }} style={{
                              flex: 1,
                              padding: '0.35rem 0.5rem',
                              borderRadius: '6px',
                              border: '1px solid var(--glass-border)',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              background: 'rgba(15, 23, 42, 0.01)',
                              color: 'var(--text-light)',
                              outline: 'none'
                            }} />
                            <button type="button" onClick={() => {
                              if (window.confirm('Bu planı silmek istediğinizden emin misiniz?')) {
                                setClientReports(prev => {
                                  const updated = { ...prev };
                                  const brandData = { ...updated[editingReportBrand] };
                                  const newPlan = [...(brandData.nextMonthPlan || [])];
                                  newPlan.splice(idx, 1);
                                  brandData.nextMonthPlan = newPlan;
                                  updated[editingReportBrand] = brandData;
                                  return updated;
                                });
                              }
                            }} style={{
                              border: 'none',
                              background: 'rgba(239, 68, 68, 0.08)',
                              borderRadius: '6px',
                              width: '26px',
                              height: '26px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: '#ef4444',
                              fontSize: '0.75rem',
                              transition: 'all 0.2s'
                            }} title="Görevi Sil">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>

                          {/* Meta row: Category, Date, Status */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                            <div>
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>Kategori</span>
                              <select value={plan.category || ''} onChange={e => {
                                const val = e.target.value;
                                setClientReports(prev => {
                                  const updated = { ...prev };
                                  const brandData = { ...updated[editingReportBrand] };
                                  const newPlan = [...(brandData.nextMonthPlan || [])];
                                  newPlan[idx] = { ...newPlan[idx], category: val };
                                  brandData.nextMonthPlan = newPlan;
                                  updated[editingReportBrand] = brandData;
                                  return updated;
                                });
                              }} style={{ width: '100%', padding: '0.3rem 0.45rem', borderRadius: '5px', border: '1px solid var(--glass-border)', fontSize: '0.72rem', background: '#fff', color: 'var(--text-light)', outline: 'none', cursor: 'pointer' }}>
                                <option value="">Seçiniz...</option>
                                <option value="Ads">Google/Meta Ads</option>
                                <option value="SEO">SEO</option>
                                <option value="Sosyal Medya">Sosyal Medya</option>
                                <option value="Yazılım">Yazılım</option>
                                <option value="Tasarım">Tasarım & Kreatif</option>
                                <option value="Genel">Genel Strateji</option>
                              </select>
                            </div>

                            <div>
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>Hedef Tarih</span>
                              <input type="date" value={plan.date || ''} onChange={e => {
                                const val = e.target.value;
                                setClientReports(prev => {
                                  const updated = { ...prev };
                                  const brandData = { ...updated[editingReportBrand] };
                                  const newPlan = [...(brandData.nextMonthPlan || [])];
                                  newPlan[idx] = { ...newPlan[idx], date: val };
                                  brandData.nextMonthPlan = newPlan;
                                  updated[editingReportBrand] = brandData;
                                  return updated;
                                });
                              }} style={{ width: '100%', padding: '0.3rem 0.45rem', borderRadius: '5px', border: '1px solid var(--glass-border)', fontSize: '0.72rem', background: '#fff', color: 'var(--text-light)', outline: 'none', cursor: 'pointer' }} />
                            </div>

                            <div>
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>Durum</span>
                              <select value={plan.status || 'Bekliyor'} onChange={e => {
                                const val = e.target.value;
                                setClientReports(prev => {
                                  const updated = { ...prev };
                                  const brandData = { ...updated[editingReportBrand] };
                                  const newPlan = [...(brandData.nextMonthPlan || [])];
                                  newPlan[idx] = { ...newPlan[idx], status: val };
                                  brandData.nextMonthPlan = newPlan;
                                  updated[editingReportBrand] = brandData;
                                  return updated;
                                });
                              }} style={{ width: '100%', padding: '0.3rem 0.45rem', borderRadius: '5px', border: '1px solid var(--glass-border)', fontSize: '0.72rem', background: '#fff', color: 'var(--text-light)', outline: 'none', cursor: 'pointer' }}>
                                <option value="Bekliyor">Bekliyor</option>
                                <option value="İşlemde">İşlemde</option>
                                <option value="Planlandı">Planlandı</option>
                                <option value="Tamamlandı">Tamamlandı</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Save Button for reports */}
              <div style={{
            borderTop: '1px solid var(--glass-border)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
                <button type="button" onClick={handleSaveAll} disabled={isSaving} className="btn btn-primary" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 2rem'
            }}>
                  <i className="fa-solid fa-floppy-disk"></i>
                  {isSaving ? 'Raporlar Kaydediliyor...' : 'Tüm Değişiklikleri Canlıya Kaydet'}
                </button>
              </div>
            </div>
  );
}
