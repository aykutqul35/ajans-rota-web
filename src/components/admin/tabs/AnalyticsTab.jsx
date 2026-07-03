import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function AnalyticsTab({
  getAggregatedStats, handleGenerateDemoStats, statsLoading,
  loadStats, handleResetStats, setDateFilter, dateFilter,
  customStartDate, setCustomStartDate, customEndDate, setCustomEndDate,
  statsError
}) {
            const data = getAggregatedStats();
          const formatTime = secs => {
            if (secs < 60) return `${secs} sn`;
            const mins = Math.floor(secs / 60);
            const remainingSecs = secs % 60;
            return `${mins} dk ${remainingSecs} sn`;
          };
          const getActionLabel = actName => {
            if (actName.startsWith('download_pdf_')) {
              const guideId = actName.replace('download_pdf_', '');
              return `Akademi: Kılavuz PDF İndirme (Rehber: ${guideId})`;
            }
            switch (actName) {
              case 'submit_whatsapp_chat':
                return 'WhatsApp Asistanı: Sohbet Başlatıldı';
              case 'click_whatsapp_bubble':
                return 'WhatsApp Asistanı: Widget Tıklandı';
              case 'submit_contact_form':
                return 'İletişim Formu: Gönderildi';
              case 'submit_seo_report':
                return 'SEO Analiz Aracı: Rapor PDF İndirildi';
              case 'submit_kobi_report':
                return 'KOBİ Endeksi: Rapor PDF İndirildi';
              case 'submit_competitor_report':
                return 'Rakip Analizi: Rapor PDF İndirildi';
              case 'generate_ai_guide':
                return 'Admin Panel: Yapay Zeka Özel Kılavuz Üretimi';
              default:
                return actName;
            }
          };
          return <div>
                <div className="admin-section-title" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
                  <span>Web Sitesi Ziyaretçi &amp; Davranış Analizi</span>
                  <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                    <button onClick={handleGenerateDemoStats} className="btn btn-secondary" style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  height: 'auto',
                  width: 'auto',
                  border: '1px solid rgba(2, 132, 199, 0.3)',
                  background: 'rgba(2, 132, 199, 0.05)',
                  color: 'var(--primary)'
                }} disabled={statsLoading}>
                      <i className="fa-solid fa-chart-line"></i> Simülasyon Verisi Yükle
                    </button>
                    <button onClick={loadStats} className="btn btn-secondary" style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  height: 'auto',
                  width: 'auto',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(15, 23, 42, 0.02)'
                }} disabled={statsLoading}>
                      <i className={`fa-solid fa-arrows-rotate ${statsLoading ? 'fa-spin' : ''}`}></i> Verileri Yenile
                    </button>
                    <button onClick={handleResetStats} className="btn btn-secondary" style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  height: 'auto',
                  width: 'auto',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  background: 'rgba(239, 68, 68, 0.05)',
                  color: '#ef4444'
                }} disabled={statsLoading}>
                      <i className="fa-solid fa-trash-can"></i> Sıfırla
                    </button>
                  </div>
                </div>

                {/* Date Filter Selection Panel */}
                <div className="glass-card analytics-filter-card" style={{
              padding: '1.25rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
                  <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.8rem'
              }}>
                    <div style={{
                  display: 'flex',
                  gap: '0.4rem',
                  flexWrap: 'wrap'
                }} className="analytics-presets">
                      {[{
                    id: 'today',
                    label: 'Bugün'
                  }, {
                    id: 'yesterday',
                    label: 'Dün'
                  }, {
                    id: '7days',
                    label: 'Son 7 Gün'
                  }, {
                    id: '30days',
                    label: 'Son 30 Gün'
                  }, {
                    id: 'all',
                    label: 'Tüm Zamanlar'
                  }, {
                    id: 'custom',
                    label: 'Özel Aralık'
                  }].map(preset => <button key={preset.id} onClick={() => setDateFilter(preset.id)} className={`btn ${dateFilter === preset.id ? 'btn-primary' : 'btn-secondary'}`} style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    height: 'auto',
                    width: 'auto',
                    boxShadow: 'none',
                    border: dateFilter === preset.id ? 'none' : '1px solid var(--glass-border)'
                  }}>
                          {preset.label}
                        </button>)}
                    </div>
                  </div>

                  {dateFilter === 'custom' && <div className="custom-date-inputs" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                flexWrap: 'wrap',
                background: 'rgba(15, 23, 42, 0.02)',
                padding: '0.8rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)'
              }}>
                      <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                        <label style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)'
                  }}>Başlangıç:</label>
                        <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} style={{
                    padding: '0.4rem 0.6rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)',
                    outline: 'none',
                    fontSize: '0.8rem'
                  }} />
                      </div>
                      <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                        <label style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)'
                  }}>Bitiş:</label>
                        <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} style={{
                    padding: '0.4rem 0.6rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)',
                    outline: 'none',
                    fontSize: '0.8rem'
                  }} />
                      </div>
                    </div>}
                </div>

                {statsLoading ? <div style={{
              textAlign: 'center',
              padding: '5rem 1rem',
              color: 'var(--text-muted)'
            }}>
                    <i className="fa-solid fa-circle-notch fa-spin" style={{
                fontSize: '2.5rem',
                marginBottom: '1rem',
                color: 'var(--primary)'
              }}></i>
                    <p style={{
                fontWeight: 500
              }}>İstatistik verileri analiz ediliyor, lütfen bekleyin...</p>
                  </div> : statsError ? <div style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.02)',
              border: '1px solid rgba(239, 68, 68, 0.1)',
              borderRadius: '12px'
            }}>
                    <i className="fa-solid fa-triangle-exclamation" style={{
                fontSize: '2.5rem',
                marginBottom: '1rem'
              }}></i>
                    <p style={{
                fontWeight: 600
              }}>{statsError}</p>
                    <button onClick={() => setDateFilter(dateFilter)} className="btn btn-primary" style={{
                marginTop: '1rem',
                padding: '0.5rem 1.25rem',
                fontSize: '0.8rem'
              }}>Tekrar Dene</button>
                  </div> : <>
                    {/* KPI SCORECARDS GRID */}
                    <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
              }} className="analytics-kpi-grid">
                      
                      <div className="glass-card kpi-card" style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                        <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '12px',
                    background: 'rgba(2, 132, 199, 0.08)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    border: '1px solid rgba(2, 132, 199, 0.15)'
                  }}>
                          <i className="fa-solid fa-eye"></i>
                        </div>
                        <div>
                          <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      fontWeight: 600
                    }}>Sayfa Gösterimi</div>
                          <div style={{
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: 'var(--text-light)',
                      marginTop: '0.15rem'
                    }}>{data.totalViews.toLocaleString('tr-TR')}</div>
                        </div>
                      </div>

                      <div className="glass-card kpi-card" style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                        <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '12px',
                    background: 'rgba(13, 148, 136, 0.08)',
                    color: 'var(--secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    border: '1px solid rgba(13, 148, 136, 0.15)'
                  }}>
                          <i className="fa-solid fa-user-group"></i>
                        </div>
                        <div>
                          <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      fontWeight: 600
                    }}>Ziyaretçiler (Oturum)</div>
                          <div style={{
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: 'var(--text-light)',
                      marginTop: '0.15rem'
                    }}>{data.totalSessions.toLocaleString('tr-TR')}</div>
                        </div>
                      </div>

                      <div className="glass-card kpi-card" style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                        <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '12px',
                    background: 'rgba(235, 209, 151, 0.08)',
                    color: 'var(--accent-teal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    border: '1px solid rgba(235, 209, 151, 0.15)'
                  }}>
                          <i className="fa-solid fa-signature"></i>
                        </div>
                        <div>
                          <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      fontWeight: 600
                    }}>Gönderilen Formlar</div>
                          <div style={{
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: 'var(--text-light)',
                      marginTop: '0.15rem'
                    }}>{data.totalActions.toLocaleString('tr-TR')}</div>
                        </div>
                      </div>

                      <div className="glass-card kpi-card" style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                        <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '12px',
                    background: 'rgba(217, 70, 239, 0.08)',
                    color: '#d946ef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    border: '1px solid rgba(217, 70, 239, 0.15)'
                  }}>
                          <i className="fa-solid fa-clock"></i>
                        </div>
                        <div>
                          <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      fontWeight: 600
                    }}>Ort. Sitede Kalma</div>
                          <div style={{
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: 'var(--text-light)',
                      marginTop: '0.15rem'
                    }}>{formatTime(data.avgDuration)}</div>
                        </div>
                      </div>

                    </div>

                    {/* MAIN CHARTS SPLIT LAYOUT */}
                    <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
                marginBottom: '1.5rem'
              }} className="analytics-charts-split">

                      {/* Left: Top Visited Pages */}
                      <div className="glass-card" style={{
                  padding: '1.5rem'
                }}>
                        <h3 style={{
                    margin: '0 0 1.25rem 0',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: 'var(--text-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    borderBottom: '1px solid var(--glass-border)',
                    paddingBottom: '0.5rem'
                  }}>
                          <i className="fa-solid fa-file-invoice" style={{
                      color: 'var(--primary)'
                    }}></i> En Çok Ziyaret Edilen Sayfalar
                        </h3>
                        {data.pages.length === 0 ? <div style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem'
                  }}>Veri bulunmuyor.</div> : <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={data.pages.slice(0, 10)} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--glass-border)" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="path" type="category" width={120} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(tick) => tick === '/' ? '/' : tick} />
                                <RechartsTooltip cursor={{ fill: 'rgba(15, 23, 42, 0.03)' }} formatter={(value) => [value, 'Gösterim']} contentStyle={{ borderRadius: '8px', border: '1px solid var(--glass-border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <defs>
                                  <linearGradient id="colorView" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={1}/>
                                    <stop offset="100%" stopColor="var(--secondary)" stopOpacity={1}/>
                                  </linearGradient>
                                </defs>
                                <Bar dataKey="views" fill="url(#colorView)" radius={[0, 4, 4, 0]} barSize={16} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>}
                      </div>

                      {/* Right: Traffic Channels referral */}
                      <div className="glass-card" style={{
                  padding: '1.5rem'
                }}>
                        <h3 style={{
                    margin: '0 0 1.25rem 0',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: 'var(--text-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    borderBottom: '1px solid var(--glass-border)',
                    paddingBottom: '0.5rem'
                  }}>
                          <i className="fa-solid fa-chart-simple" style={{
                      color: 'var(--secondary)'
                    }}></i> Ziyaretçi Trafik Kanalları
                        </h3>
                        {data.referrers.length === 0 || data.totalSessions === 0 ? <div style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem'
                  }}>Veri bulunmuyor.</div> : <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={data.referrers}
                                  cx="50%"
                                  cy="45%"
                                  innerRadius={70}
                                  outerRadius={100}
                                  paddingAngle={5}
                                  dataKey="count"
                                  nameKey="name"
                                  stroke="none"
                                >
                                  {data.referrers.map((entry, index) => {
                                    const COLORS = ['#00ebd6', '#00b4d8', '#16a34a', '#64748b', '#d946ef', '#f59e0b'];
                                    return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                                  })}
                                </Pie>
                                <RechartsTooltip formatter={(value) => [value, 'Ziyaretçi']} contentStyle={{ borderRadius: '8px', border: '1px solid var(--glass-border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }}/>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>}
                      </div>

                    </div>

                    {/* EVENT TRACKING GOAL CONVERSIONS */}
                    <div className="glass-card" style={{
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                      <h3 style={{
                  margin: '0 0 1rem 0',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--text-light)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderBottom: '1px solid var(--glass-border)',
                  paddingBottom: '0.5rem'
                }}>
                        <i className="fa-solid fa-flag" style={{
                    color: 'var(--accent-teal)'
                  }}></i> Etkinlik Tıklamaları &amp; Dönüşüm Performansı (Hedefler)
                      </h3>
                      {data.actions.length === 0 ? <div style={{
                  textAlign: 'center',
                  padding: '3.5rem 1rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem'
                }}>
                          <i className="fa-solid fa-circle-info" style={{
                    fontSize: '1.5rem',
                    marginBottom: '0.5rem',
                    display: 'block',
                    opacity: 0.5
                  }}></i>
                          Seçilen tarih aralığında kaydedilmiş buton tıklaması veya form gönderimi bulunmamaktadır.
                        </div> : <div className="admin-table-container">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>Hedef / Yapılan Eylem</th>
                                <th style={{
                          textAlign: 'center',
                          width: '150px'
                        }}>Toplam Tetiklenme</th>
                                <th style={{
                          textAlign: 'center',
                          width: '180px'
                        }}>Ziyaretçi Katılım Oranı</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.actions.map(act => {
                        const conversionRate = data.totalSessions > 0 ? (act.count / data.totalSessions * 100).toFixed(1) : '0.0';
                        return <tr key={act.name}>
                                    <td style={{
                            fontWeight: 600,
                            color: 'var(--text-light)'
                          }}>
                                      {getActionLabel(act.name)}
                                    </td>
                                    <td style={{
                            textAlign: 'center',
                            fontWeight: 700,
                            color: 'var(--primary)'
                          }}>
                                      {act.count}
                                    </td>
                                    <td style={{
                            textAlign: 'center'
                          }}>
                                      <span style={{
                              fontSize: '0.8rem',
                              background: 'rgba(2, 132, 199, 0.06)',
                              color: 'var(--primary)',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontWeight: '600',
                              border: '1px solid rgba(2, 132, 199, 0.15)'
                            }}>
                                        %{conversionRate} CR
                                      </span>
                                    </td>
                                  </tr>;
                      })}
                            </tbody>
                          </table>
                        </div>}
                    </div>

                  </>}
              </div>;
}
