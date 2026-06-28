import React from 'react';

export default function LeadsTab({
  leadsData, leadSearchText, setLeadSearchText, leadSourceFilter, setLeadSourceFilter,
  leadServiceFilter, setLeadServiceFilter, leadStatusFilter, setLeadStatusFilter,
  exportLeadsToCSV, handleViewLead, handleDeleteLead, activeFollowUps, updateLeadStatus
}) {
  const totalLeads = leadsData.length;
          const googleCount = leadsData.filter(l => l.trafficSource === 'Google Ads').length;
          const metaCount = leadsData.filter(l => l.trafficSource === 'Meta Ads').length;
          const organicCount = totalLeads - googleCount - metaCount;
          const googlePct = totalLeads > 0 ? parseFloat((googleCount / totalLeads * 100).toFixed(1)) : 0;
          const metaPct = totalLeads > 0 ? parseFloat((metaCount / totalLeads * 100).toFixed(1)) : 0;
          const organicPct = totalLeads > 0 ? parseFloat((organicCount / totalLeads * 100).toFixed(1)) : 0;
          const filteredLeads = leadsData.filter(lead => {
            const searchLower = leadSearchText.toLowerCase();
            const matchesSearch = !leadSearchText || lead.fullName && lead.fullName.toLowerCase().includes(searchLower) || lead.email && lead.email.toLowerCase().includes(searchLower) || lead.phone && lead.phone.toLowerCase().includes(searchLower) || lead.company && lead.company.toLowerCase().includes(searchLower) || lead.message && lead.message.toLowerCase().includes(searchLower) || lead.service && lead.service.toLowerCase().includes(searchLower);
            const matchesSource = leadSourceFilter === 'all' || lead.trafficSource === leadSourceFilter;
            const matchesService = leadServiceFilter === 'all' || lead.service && lead.service.toLowerCase().includes(leadServiceFilter.toLowerCase());
            const matchesStatus = leadStatusFilter === 'all' || lead.status === leadStatusFilter;
            return matchesSearch && matchesSource && matchesService && matchesStatus;
          });
          return (<div>
                <div className="admin-section-title" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
                  <span>Gelen İletişim ve Teklif Talepleri</span>
                  {totalLeads > 0 && <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                      <button onClick={() => exportLeadsToCSV(leadsData)} className="btn btn-secondary" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: 'none',
                  height: 'auto',
                  width: 'auto',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(15, 23, 42, 0.02)'
                }}>
                        <i className="fa-solid fa-download"></i> Tümünü Aktar (CSV)
                      </button>
                      {filteredLeads.length !== totalLeads && filteredLeads.length > 0 && <button onClick={() => exportLeadsToCSV(filteredLeads)} className="btn btn-primary" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: 'none',
                  height: 'auto',
                  width: 'auto'
                }}>
                          <i className="fa-solid fa-file-csv"></i> Filtrelenmişi Aktar ({filteredLeads.length})
                        </button>}
                    </div>}
                </div>

                {totalLeads > 0 && <>
                    {/* KPI Metric Cards */}
                    <div className="admin-dashboard-stats" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
                marginTop: '1rem'
              }}>
                      <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.01)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }} className="kpi-card">
                        <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(15, 23, 42, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-light)',
                    fontSize: '1.25rem',
                    border: '1px solid var(--glass-border)'
                  }}>
                          <i className="fa-solid fa-envelope-open-text"></i>
                        </div>
                        <div>
                          <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Toplam Talep</div>
                          <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: 'var(--text-light)',
                      marginTop: '0.1rem'
                    }}>{totalLeads}</div>
                        </div>
                      </div>

                      <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.01)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }} className="kpi-card">
                        <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(14, 165, 233, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    fontSize: '1.25rem',
                    border: '1px solid rgba(14, 165, 233, 0.15)'
                  }}>
                          <i className="fa-brands fa-google"></i>
                        </div>
                        <div>
                          <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Google Ads</div>
                          <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.4rem',
                      marginTop: '0.1rem'
                    }}>
                            <span style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: 'var(--text-light)'
                      }}>{googleCount}</span>
                            <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--primary)',
                        fontWeight: '600'
                      }}>(%{googlePct})</span>
                          </div>
                        </div>
                      </div>

                      <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.01)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }} className="kpi-card">
                        <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(236, 72, 153, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--secondary)',
                    fontSize: '1.25rem',
                    border: '1px solid rgba(236, 72, 153, 0.15)'
                  }}>
                          <i className="fa-brands fa-meta"></i>
                        </div>
                        <div>
                          <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Meta Ads</div>
                          <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.4rem',
                      marginTop: '0.1rem'
                    }}>
                            <span style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: 'var(--text-light)'
                      }}>{metaCount}</span>
                            <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--secondary)',
                        fontWeight: '600'
                      }}>(%{metaPct})</span>
                          </div>
                        </div>
                      </div>

                      <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.01)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }} className="kpi-card">
                        <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(34, 197, 94, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#16a34a',
                    fontSize: '1.25rem',
                    border: '1px solid rgba(34, 197, 94, 0.15)'
                  }}>
                          <i className="fa-solid fa-seedling"></i>
                        </div>
                        <div>
                          <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Organik (SEO)</div>
                          <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.4rem',
                      marginTop: '0.1rem'
                    }}>
                            <span style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: 'var(--text-light)'
                      }}>{organicCount}</span>
                            <span style={{
                        fontSize: '0.75rem',
                        color: '#16a34a',
                        fontWeight: '600'
                      }}>(%{organicPct})</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CRM Follow-up Alerts / Smart Reminder Banner */}
                    {(() => {
                const todayStr = new Date().toISOString().split('T')[0];
                const activeFollowUps = leadsData.filter(lead => {
                  return lead.reminderDate && lead.status !== 'kazanildi' && lead.status !== 'kaybedildi' && lead.reminderDate <= todayStr;
                });
                if (activeFollowUps.length === 0) return null;
                return <div className="crm-reminder-banner" style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(239, 68, 68, 0.04) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                          {/* Background Glow */}
                          <div style={{
                    position: 'absolute',
                    right: '-20px',
                    top: '-20px',
                    fontSize: '6rem',
                    color: 'rgba(245, 158, 11, 0.05)',
                    pointerEvents: 'none',
                    transform: 'rotate(-15deg)'
                  }}>
                            <i className="fa-solid fa-clock"></i>
                          </div>

                          <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}>
                            <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      color: '#d97706',
                      fontSize: '0.9rem'
                    }}>
                              <i className="fa-solid fa-bell-exclamation"></i>
                            </span>
                            <div>
                              <h4 style={{
                        margin: 0,
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        color: 'var(--text-light)'
                      }}>
                                Bugün Takip Edilecek Müşteri Hatırlatmaları ({activeFollowUps.length})
                              </h4>
                              <p style={{
                        margin: '0.1rem 0 0 0',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)'
                      }}>
                                Belirlediğiniz takip tarihi gelmiş veya geçmiş olan müşterilerle iletişime geçin.
                              </p>
                            </div>
                          </div>

                          <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '0.75rem',
                    marginTop: '0.25rem'
                  }}>
                            {activeFollowUps.map(lead => <div key={lead.id} onClick={() => handleViewLead(lead)} style={{
                      backgroundColor: '#fff',
                      border: '1px solid rgba(245, 158, 11, 0.15)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }} className="crm-reminder-item-card">
                                <div style={{
                        minWidth: 0,
                        flex: 1,
                        paddingRight: '0.5rem'
                      }}>
                                  <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                                    <strong style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-light)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'block',
                            maxWidth: '140px'
                          }}>
                                      {lead.fullName}
                                    </strong>
                                    <span style={{
                            fontSize: '0.65rem',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            color: '#d97706',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            fontWeight: '600'
                          }}>
                                      {lead.reminderDate === todayStr ? 'Bugün' : 'Gecikmiş'}
                                    </span>
                                  </div>
                                  <span style={{
                          fontSize: '0.7rem',
                          color: 'var(--text-muted)',
                          display: 'block',
                          marginTop: '0.1rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                                    {lead.service}
                                  </span>
                                </div>
                                <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--primary)',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        flexShrink: 0
                      }}>
                                  Kartı Aç <i className="fa-solid fa-arrow-right-long"></i>
                                </span>
                              </div>)}
                          </div>
                        </div>;
              })()}

                    {/* Analytics Dashboard Grid */}
                    <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                      {/* Left Card: Traffic Source */}
                      <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.01)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                        <div>
                          <div style={{
                      marginBottom: '1rem'
                    }}>
                            <h4 style={{
                        margin: 0,
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--text-light)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}>
                              <i className="fa-solid fa-chart-pie" style={{
                          color: 'var(--primary)'
                        }}></i> Trafik Kaynağı Analizi
                            </h4>
                            <p style={{
                        margin: '0.15rem 0 0 0',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)'
                      }}>
                              Taleplerin geldikleri reklam ve arama kanallarına göre dağılımı
                            </p>
                          </div>

                          <div style={{
                      height: '24px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.03)',
                      overflow: 'hidden',
                      display: 'flex',
                      marginBottom: '1rem',
                      border: '1px solid var(--glass-border)'
                    }}>
                            {googleCount > 0 && <div style={{
                        width: `${googlePct}%`,
                        backgroundColor: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        transition: 'width 0.3s ease',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                      }} title={`Google Ads: ${googleCount} Talep (%${googlePct})`}>
                                {googlePct >= 10 ? `%${googlePct}` : ''}
                              </div>}
                            {metaCount > 0 && <div style={{
                        width: `${metaPct}%`,
                        backgroundColor: 'var(--secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        transition: 'width 0.3s ease',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                      }} title={`Meta Ads: ${metaCount} Talep (%${metaPct})`}>
                                {metaPct >= 10 ? `%${metaPct}` : ''}
                              </div>}
                            {organicCount > 0 && <div style={{
                        width: `${organicPct}%`,
                        backgroundColor: '#16a34a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        transition: 'width 0.3s ease',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                      }} title={`Organik (SEO): ${organicCount} Talep (%${organicPct})`}>
                                {organicPct >= 10 ? `%${organicPct}` : ''}
                              </div>}
                          </div>
                        </div>

                        <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    gap: '1.25rem',
                    flexWrap: 'wrap',
                    fontSize: '0.75rem'
                  }}>
                          <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                            <span style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)'
                      }}></span>
                            <strong style={{
                        color: 'var(--text-light)'
                      }}>Google Ads:</strong>
                            <span style={{
                        color: 'var(--text-muted)'
                      }}>{googleCount} (%{googlePct})</span>
                          </div>
                          <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                            <span style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--secondary)'
                      }}></span>
                            <strong style={{
                        color: 'var(--text-light)'
                      }}>Meta Ads:</strong>
                            <span style={{
                        color: 'var(--text-muted)'
                      }}>{metaCount} (%{metaPct})</span>
                          </div>
                          <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                            <span style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#16a34a'
                      }}></span>
                            <strong style={{
                        color: 'var(--text-light)'
                      }}>Organik:</strong>
                            <span style={{
                        color: 'var(--text-muted)'
                      }}>{organicCount} (%{organicPct})</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Card: Demanded Services */}
                      <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.01)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                        <div>
                          <h4 style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'var(--text-light)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      marginBottom: '0.2rem'
                    }}>
                            <i className="fa-solid fa-cubes" style={{
                        color: 'var(--secondary)'
                      }}></i> En Çok Talep Edilen Hizmetler
                          </h4>
                          <p style={{
                      margin: 0,
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      marginBottom: '0.8rem'
                    }}>
                            Müşteri taleplerinde en çok tercih edilen dijital hizmetler
                          </p>

                          <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                            {(() => {
                        const serviceCounts = {};
                        leadsData.forEach(lead => {
                          const s = lead.service || 'Diğer';
                          let servicesToCount = [];
                          if (s.includes('Hesaplayıcı') || s.includes('Teklif')) {
                            const match = (lead.message || '').match(/Seçilen Hizmetler:\s*([^\n\r]+)/);
                            if (match && match[1]) {
                              servicesToCount = match[1].split(',').map(item => item.trim());
                            } else {
                              servicesToCount = ['Genel Teklif'];
                            }
                          } else if (s.includes('ROAS') || s.includes('Rapor')) {
                            servicesToCount = ['Rapor / Analiz'];
                          } else {
                            let normalized = s;
                            if (s.toLowerCase().includes('google')) normalized = 'Google Ads';else if (s.toLowerCase().includes('meta') || s.toLowerCase().includes('facebook') || s.toLowerCase().includes('instagram')) normalized = 'Meta Ads';else if (s.toLowerCase().includes('seo') || s.toLowerCase().includes('arama')) normalized = 'SEO';else if (s.toLowerCase().includes('sosyal') || s.toLowerCase().includes('medya')) normalized = 'Sosyal Medya';else if (s.toLowerCase().includes('tasarım') || s.toLowerCase().includes('web')) normalized = 'Web Tasarım';else if (s.toLowerCase().includes('eticaret') || s.toLowerCase().includes('e-ticaret')) normalized = 'E-Ticaret';
                            servicesToCount = [normalized];
                          }
                          servicesToCount.forEach(svc => {
                            if (!svc) return;
                            serviceCounts[svc] = (serviceCounts[svc] || 0) + 1;
                          });
                        });
                        const sortedServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);
                        const maxVal = sortedServices.length > 0 ? Math.max(...sortedServices.map(x => x[1])) : 1;
                        return sortedServices.map(([name, count]) => {
                          const barPct = Math.round(count / maxVal * 100);
                          return <div key={name} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.15rem'
                          }}>
                                    <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '0.75rem',
                              fontWeight: 500
                            }}>
                                      <span style={{
                                color: 'var(--text-light)'
                              }}>{name}</span>
                                      <span style={{
                                color: 'var(--text-muted)'
                              }}><strong>{count}</strong> talep</span>
                                    </div>
                                    <div style={{
                              height: '6px',
                              borderRadius: '3px',
                              backgroundColor: 'rgba(15, 23, 42, 0.03)',
                              overflow: 'hidden',
                              border: '1px solid var(--glass-border)'
                            }}>
                                      <div style={{
                                width: `${barPct}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                                borderRadius: '3px',
                                transition: 'width 0.3s ease'
                              }}></div>
                                    </div>
                                  </div>;
                        });
                      })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>}

                {/* Filter Controls Bar */}
                <div style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              alignItems: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.02)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.25rem'
            }}>
                  {/* Search Input */}
                  <div style={{
                flex: '2 1 250px',
                position: 'relative'
              }}>
                    <i className="fa-solid fa-magnifying-glass" style={{
                  position: 'absolute',
                  left: '0.8rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem'
                }}></i>
                    <input type="text" placeholder="Müşteri adı, e-posta, şirket veya mesaj içeriği ara..." value={leadSearchText} onChange={e => setLeadSearchText(e.target.value)} style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem 0.6rem 2.2rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }} />
                  </div>

                  {/* Traffic Source Filter */}
                  <div style={{
                flex: '1 1 150px'
              }}>
                    <select value={leadSourceFilter} onChange={e => setLeadSourceFilter(e.target.value)} style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}>
                      <option value="all">Tüm Kaynaklar</option>
                      <option value="Google Ads">Google Ads</option>
                      <option value="Meta Ads">Meta Ads</option>
                      <option value="Organik (SEO)">Organik (SEO)</option>
                      <option value="SEO Analiz Aracı">SEO Analiz Aracı</option>
                      <option value="KOBİ Endeksi Sayfası">KOBİ Endeksi</option>
                      <option value="Rakip Karşılaştırma Sayfası">Rakip Karşılaştırma</option>
                      <option value="Rota Akademi Portalı">Rota Akademi</option>
                      <option value="WhatsApp Chat Botu">WhatsApp Chat Botu</option>
                    </select>
                  </div>

                  {/* Service Filter */}
                  <div style={{
                flex: '1 1 150px'
              }}>
                    <select value={leadServiceFilter} onChange={e => setLeadServiceFilter(e.target.value)} style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}>
                      <option value="all">Tüm Hizmetler</option>
                      {Object.keys(servicesData).map(key => <option key={key} value={servicesData[key].title}>{servicesData[key].title}</option>)}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div style={{
                flex: '1 1 120px'
              }}>
                    <select value={leadStatusFilter} onChange={e => setLeadStatusFilter(e.target.value)} style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}>
                      <option value="all">Tüm Durumlar</option>
                      <option value="unread">Yeni (Okunmadı)</option>
                      <option value="yeni">Yeni Başvuru</option>
                      <option value="iletisimde">İletişimde / Ön Görüşme</option>
                      <option value="toplanti_planlandi">Toplantı Planlandı</option>
                      <option value="analiz_fazinda">Analiz Fazında</option>
                      <option value="teklif_hazirlaniyor">Teklif Hazırlanıyor</option>
                      <option value="teklif_iletildi">Teklif İletildi</option>
                      <option value="revize_istendi">Revize İstendi</option>
                      <option value="sozlesme_asamasinda">Sözleşme Aşamasında</option>
                      <option value="kazanildi">Kazanıldı</option>
                      <option value="kaybedildi">Kaybedildi</option>
                      <option value="ertelendi">Ertelendi / Beklemede</option>
                      <option value="read">Okundu</option>
                    </select>
                  </div>

                  {/* Clear Filter Button */}
                  {(leadSearchText || leadSourceFilter !== 'all' || leadServiceFilter !== 'all' || leadStatusFilter !== 'all') && <button onClick={() => {
                setLeadSearchText('');
                setLeadSourceFilter('all');
                setLeadServiceFilter('all');
                setLeadStatusFilter('all');
              }} className="btn btn-secondary" style={{
                padding: '0.6rem 1rem',
                fontSize: '0.85rem',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                background: 'rgba(239, 68, 68, 0.05)',
                color: '#ef4444',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                height: 'auto',
                width: 'auto'
              }}>
                      <i className="fa-solid fa-filter-circle-xmark"></i> Temizle
                    </button>}
                </div>

                {/* Counter Summary */}
                {totalLeads > 0 && <div style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginBottom: '0.75rem',
              fontWeight: 500,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
                    <span>
                      Toplam <strong>{totalLeads}</strong> talepten <strong>{filteredLeads.length}</strong> tanesi listeleniyor.
                    </span>
                    {filteredLeads.length === 0 && <span style={{
                color: '#ef4444'
              }}>Arama kriterlerinize uygun kayıt bulunamadı.</span>}
                  </div>}

                {filteredLeads.length === 0 ? <div style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              color: 'var(--text-muted)',
              backgroundColor: 'rgba(15, 23, 42, 0.01)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px'
            }}>
                    <i className="fa-solid fa-folder-open" style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                color: 'var(--primary)',
                opacity: 0.6
              }}></i>
                    <p style={{
                fontWeight: '500'
              }}>Filtrelere uygun talep bulunamadı.</p>
                  </div> : <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th className="hide-on-mobile">Tarih</th>
                          <th>Müşteri Bilgileri</th>
                          <th>Hizmet / Konu</th>
                          <th>Durum</th>
                          <th>İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map(lead => <tr key={lead.id} className={lead.status === 'unread' ? 'unread' : ''}>
                            <td className="hide-on-mobile">{lead.created_at ? lead.created_at.substring(0, 16) : 'Bilinmiyor'}</td>
                            <td>
                              <div><strong>{lead.fullName}</strong></div>
                              <div style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)'
                      }}>{lead.email} | {lead.phone}</div>
                              {lead.trafficSource && <div style={{
                        fontSize: '0.75rem',
                        marginTop: '0.25rem'
                      }}>
                                  <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontWeight: '600',
                          fontSize: '0.7rem',
                          backgroundColor: lead.trafficSource === 'Google Ads' ? 'rgba(14, 165, 233, 0.08)' : lead.trafficSource === 'Meta Ads' ? 'rgba(236, 72, 153, 0.08)' : 'rgba(34, 197, 94, 0.08)',
                          color: lead.trafficSource === 'Google Ads' ? 'var(--primary)' : lead.trafficSource === 'Meta Ads' ? 'var(--secondary)' : '#16a34a',
                          padding: '1px 6px',
                          borderRadius: '10px',
                          border: '1px solid currentColor'
                        }}>
                                    {lead.trafficSource === 'Google Ads' ? <i className="fa-brands fa-google" style={{
                            fontSize: '0.65rem'
                          }}></i> : lead.trafficSource === 'Meta Ads' ? <i className="fa-brands fa-meta" style={{
                            fontSize: '0.65rem'
                          }}></i> : <i className="fa-solid fa-seedling" style={{
                            fontSize: '0.65rem'
                          }}></i>}
                                    {lead.trafficSource}
                                  </span>
                                </div>}
                            </td>
                            <td>
                              <span style={{
                        fontSize: '0.85rem',
                        background: 'var(--primary-glow)',
                        color: 'var(--primary)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: '600'
                      }}>
                                {lead.service}
                              </span>
                            </td>
                            <td>
                              <span className={`lead-status-badge ${lead.status || 'unread'}`}>
                                {lead.status === 'unread' ? 'Yeni' : lead.status === 'yeni' ? 'Yeni Başvuru' : lead.status === 'iletisimde' ? 'İletişimde' : lead.status === 'toplanti_planlandi' ? 'Toplantı Planlandı' : lead.status === 'analiz_fazinda' ? 'Analiz Fazında' : lead.status === 'teklif_hazirlaniyor' ? 'Teklif Hazırlanıyor' : lead.status === 'teklif_iletildi' ? 'Teklif İletildi' : lead.status === 'revize_istendi' ? 'Revize İstendi' : lead.status === 'sozlesme_asamasinda' ? 'Sözleşme Aşamasında' : lead.status === 'kazanildi' ? 'Kazanıldı' : lead.status === 'kaybedildi' ? 'Kaybedildi' : lead.status === 'ertelendi' ? 'Ertelendi' : lead.status === 'sent' ? 'Teklif İletildi' : 'Okundu'}
                              </span>
                            </td>
                            <td>
                              <div className="admin-action-btns">
                                <button onClick={() => handleViewLead(lead)} className="btn-icon" title="Detayları Gör">
                                  <i className="fa-solid fa-eye"></i>
                                </button>
                                <button onClick={() => handleDeleteLead(lead.id)} className="btn-icon btn-delete" title="Sil">
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>}
              </div>
  );
}
