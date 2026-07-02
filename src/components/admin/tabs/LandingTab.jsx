import { useState } from 'react';

export default function LandingTab({
  handleSaveAll, settingsData, setSettingsData
}) {
const [activeLandingSection, setActiveLandingSection] = useState('hero');
  return (
              <div>
              <div className="admin-section-title" style={{
            marginBottom: '1.5rem'
          }}>
                Ana Sayfa İçerik & Tasarım Yönetimi
              </div>

              <form onSubmit={e => {
            e.preventDefault();
            handleSaveAll();
          }} className="admin-split-layout">
                {/* Left Column: Sections Sidebar */}
                <div className="service-editor-sidebar admin-split-sidebar">
                  {[{
                id: 'hero',
                label: 'Hero (Giriş) Alanı',
                icon: 'fa-solid fa-rocket'
              }, {
                id: 'stats',
                label: 'İstatistik Sayaçları',
                icon: 'fa-solid fa-chart-line'
              }, {
                id: 'services_intro',
                label: 'Hizmetler Giriş Spotu',
                icon: 'fa-solid fa-compass'
              }, {
                id: 'izmir_edge',
                label: 'Neden Biz? (Bölgesel Güç)',
                icon: 'fa-solid fa-anchor'
              }].map(sec => {
                const isActive = activeLandingSection === sec.id;
                return <button key={sec.id} type="button" onClick={() => setActiveLandingSection(sec.id)} className={`service-sec-btn ${isActive ? 'active' : ''}`}>
                        <i className={sec.icon} style={{
                    width: '16px',
                    textAlign: 'center',
                    fontSize: '0.95rem'
                  }}></i>
                        {sec.label}
                      </button>;
              })}

                  <div className="admin-split-sidebar-save">
                    <button type="submit" className="btn btn-primary" style={{
                  width: '100%',
                  padding: '0.8rem',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                      <i className="fa-solid fa-floppy-disk"></i> Değişiklikleri Kaydet
                    </button>
                  </div>
                </div>

                {/* Right Column: Section Fields */}
                <div className="service-editor-fields admin-split-content">
                  
                  {/* Hero Settings */}
                  {activeLandingSection === 'hero' && <div>
                      <h4 style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--text-light)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderBottom: '1px solid rgba(15,23,42,0.05)',
                  paddingBottom: '0.5rem'
                }}>
                        <i className="fa-solid fa-rocket" style={{
                    color: 'var(--primary)'
                  }}></i> Hero (Giriş) Alanı Ayarları
                      </h4>
                      
                      <div className="admin-form-group">
                        <label>Küçük Etiket / Tagline</label>
                        <input type="text" value={settingsData.hero_tag || ''} onChange={e => setSettingsData({
                    ...settingsData,
                    hero_tag: e.target.value
                  })} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)'
                  }} />
                      </div>
                      
                      <div className="admin-form-group">
                        <label>Ana Başlık (Title - Satır atlamaları için \\n kullanabilirsiniz)</label>
                        <textarea rows="2" value={settingsData.hero_title || ''} onChange={e => setSettingsData({
                    ...settingsData,
                    hero_title: e.target.value
                  })} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    fontFamily: 'sans-serif'
                  }} />
                      </div>
                      
                      <div className="admin-form-group" style={{
                  margin: 0
                }}>
                        <label>Açıklama Metni (Description)</label>
                        <textarea rows="4" value={settingsData.hero_desc || ''} onChange={e => setSettingsData({
                    ...settingsData,
                    hero_desc: e.target.value
                  })} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    fontFamily: 'sans-serif',
                    lineHeight: '1.4'
                  }} />
                      </div>
                    </div>}

                  {/* Stats Settings */}
                  {activeLandingSection === 'stats' && <div>
                      <h4 style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--text-light)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderBottom: '1px solid rgba(15,23,42,0.05)',
                  paddingBottom: '0.5rem'
                }}>
                        <i className="fa-solid fa-chart-line" style={{
                    color: 'var(--primary)'
                  }}></i> İstatistik Sayaçları (Hero Altı)
                      </h4>
                      
                      <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}>
                        <div style={{
                    padding: '1rem',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    background: 'rgba(15,23,42,0.01)'
                  }}>
                          <strong style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      color: 'var(--primary)',
                      marginBottom: '0.75rem'
                    }}>Sayaç #1</strong>
                          <div className="admin-form-row" style={{
                      margin: 0
                    }}>
                            <div className="admin-form-group" style={{
                        margin: 0
                      }}>
                              <label style={{
                          fontSize: '0.75rem'
                        }}>Değer (Örn: %320+)</label>
                              <input type="text" value={settingsData.hero_stat1_num || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          hero_stat1_num: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: '6px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group" style={{
                        margin: 0
                      }}>
                              <label style={{
                          fontSize: '0.75rem'
                        }}>Etiket (Örn: Ortalama ROAS Artışı)</label>
                              <input type="text" value={settingsData.hero_stat1_lbl || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          hero_stat1_lbl: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: '6px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                          </div>
                        </div>

                        <div style={{
                    padding: '1rem',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    background: 'rgba(15,23,42,0.01)'
                  }}>
                          <strong style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      color: 'var(--primary)',
                      marginBottom: '0.75rem'
                    }}>Sayaç #2</strong>
                          <div className="admin-form-row" style={{
                      margin: 0
                    }}>
                            <div className="admin-form-group" style={{
                        margin: 0
                      }}>
                              <label style={{
                          fontSize: '0.75rem'
                        }}>Değer (Örn: 12M₺+)</label>
                              <input type="text" value={settingsData.hero_stat2_num || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          hero_stat2_num: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: '6px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group" style={{
                        margin: 0
                      }}>
                              <label style={{
                          fontSize: '0.75rem'
                        }}>Etiket (Örn: Yönetilen Bütçe)</label>
                              <input type="text" value={settingsData.hero_stat2_lbl || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          hero_stat2_lbl: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: '6px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                          </div>
                        </div>

                        <div style={{
                    padding: '1rem',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    background: 'rgba(15,23,42,0.01)'
                  }}>
                          <strong style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      color: 'var(--primary)',
                      marginBottom: '0.75rem'
                    }}>Sayaç #3</strong>
                          <div className="admin-form-row" style={{
                      margin: 0
                    }}>
                            <div className="admin-form-group" style={{
                        margin: 0
                      }}>
                              <label style={{
                          fontSize: '0.75rem'
                        }}>Değer (Örn: %98.4)</label>
                              <input type="text" value={settingsData.hero_stat3_num || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          hero_stat3_num: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: '6px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group" style={{
                        margin: 0
                      }}>
                              <label style={{
                          fontSize: '0.75rem'
                        }}>Etiket (Örn: Müşteri Memnuniyeti)</label>
                              <input type="text" value={settingsData.hero_stat3_lbl || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          hero_stat3_lbl: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: '6px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>}

                  {/* Services Intro Settings */}
                  {activeLandingSection === 'services_intro' && <div>
                      <h4 style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--text-light)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderBottom: '1px solid rgba(15,23,42,0.05)',
                  paddingBottom: '0.5rem'
                }}>
                        <i className="fa-solid fa-compass" style={{
                    color: 'var(--primary)'
                  }}></i> Hizmetlerimiz Bölümü Giriş Spotu
                      </h4>
                      
                      <div className="admin-form-group">
                        <label>Küçük Başlık / Etiket (Tag)</label>
                        <input type="text" value={settingsData.services_section_tag || ''} onChange={e => setSettingsData({
                    ...settingsData,
                    services_section_tag: e.target.value
                  })} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)'
                  }} />
                      </div>
                      
                      <div className="admin-form-group">
                        <label>Bölüm Başlığı (H2)</label>
                        <input type="text" value={settingsData.services_section_title || ''} onChange={e => setSettingsData({
                    ...settingsData,
                    services_section_title: e.target.value
                  })} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)'
                  }} />
                      </div>
                      
                      <div className="admin-form-group" style={{
                  margin: 0
                }}>
                        <label>Giriş / Açıklama Paragrafı</label>
                        <textarea rows="4" value={settingsData.services_section_desc || ''} onChange={e => setSettingsData({
                    ...settingsData,
                    services_section_desc: e.target.value
                  })} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    fontFamily: 'sans-serif',
                    lineHeight: '1.4'
                  }} />
                      </div>
                    </div>}

                  {/* Izmir Edge (Neden Biz?) Settings */}
                  {activeLandingSection === 'izmir_edge' && <div>
                      <h4 style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--text-light)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderBottom: '1px solid rgba(15,23,42,0.05)',
                  paddingBottom: '0.5rem'
                }}>
                        <i className="fa-solid fa-anchor" style={{
                    color: 'var(--primary)'
                  }}></i> Neden Biz? (Bölgesel Güç) Ayarları
                      </h4>
                      
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>Bölüm Etiketi (Tag)</label>
                          <input type="text" value={settingsData.izmir_edge_tag || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      izmir_edge_tag: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)'
                    }} />
                        </div>
                        <div className="admin-form-group">
                          <label>Bölüm Başlığı (Title)</label>
                          <input type="text" value={settingsData.izmir_edge_title || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      izmir_edge_title: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)'
                    }} />
                        </div>
                      </div>
                      
                      <div className="admin-form-group">
                        <label>Genel Açıklama Metni</label>
                        <textarea rows="3" value={settingsData.izmir_edge_desc || ''} onChange={e => setSettingsData({
                    ...settingsData,
                    izmir_edge_desc: e.target.value
                  })} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    fontFamily: 'sans-serif'
                  }} />
                      </div>

                      <div style={{
                  marginTop: '1.5rem',
                  borderTop: '1px dashed var(--glass-border)',
                  paddingTop: '1.25rem'
                }}>
                        <h5 style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--text-light)',
                    marginBottom: '1rem'
                  }}>Sol Liste Maddeleri</h5>
                        
                        <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem'
                  }}>
                          {/* Item 1 */}
                          <div style={{
                      padding: '1rem',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      background: 'rgba(15,23,42,0.01)'
                    }}>
                            <strong style={{
                        fontSize: '0.8rem',
                        color: 'var(--primary)'
                      }}>Madde #1</strong>
                            <div className="admin-form-row" style={{
                        marginTop: '0.5rem'
                      }}>
                              <div className="admin-form-group">
                                <label style={{
                            fontSize: '0.75rem'
                          }}>Başlık</label>
                                <input type="text" value={settingsData.izmir_edge_item1_title || ''} onChange={e => setSettingsData({
                            ...settingsData,
                            izmir_edge_item1_title: e.target.value
                          })} style={{
                            width: '100%',
                            padding: '0.65rem',
                            borderRadius: '6px',
                            border: '1px solid var(--glass-border)'
                          }} />
                              </div>
                              <div className="admin-form-group">
                                <label style={{
                            fontSize: '0.75rem'
                          }}>İkon (FontAwesome)</label>
                                <input type="text" value={settingsData.izmir_edge_item1_icon || ''} onChange={e => setSettingsData({
                            ...settingsData,
                            izmir_edge_item1_icon: e.target.value
                          })} style={{
                            width: '100%',
                            padding: '0.65rem',
                            borderRadius: '6px',
                            border: '1px solid var(--glass-border)'
                          }} />
                              </div>
                            </div>
                            <div className="admin-form-group" style={{
                        margin: 0
                      }}>
                              <label style={{
                          fontSize: '0.75rem'
                        }}>Açıklama</label>
                              <textarea rows="2" value={settingsData.izmir_edge_item1_desc || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          izmir_edge_item1_desc: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: '6px',
                          border: '1px solid var(--glass-border)',
                          fontFamily: 'sans-serif'
                        }} />
                            </div>
                          </div>

                          {/* Item 2 */}
                          <div style={{
                      padding: '1rem',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      background: 'rgba(15,23,42,0.01)'
                    }}>
                            <strong style={{
                        fontSize: '0.8rem',
                        color: 'var(--primary)'
                      }}>Madde #2</strong>
                            <div className="admin-form-row" style={{
                        marginTop: '0.5rem'
                      }}>
                              <div className="admin-form-group">
                                <label style={{
                            fontSize: '0.75rem'
                          }}>Başlık</label>
                                <input type="text" value={settingsData.izmir_edge_item2_title || ''} onChange={e => setSettingsData({
                            ...settingsData,
                            izmir_edge_item2_title: e.target.value
                          })} style={{
                            width: '100%',
                            padding: '0.65rem',
                            borderRadius: '6px',
                            border: '1px solid var(--glass-border)'
                          }} />
                              </div>
                              <div className="admin-form-group">
                                <label style={{
                            fontSize: '0.75rem'
                          }}>İkon (FontAwesome)</label>
                                <input type="text" value={settingsData.izmir_edge_item2_icon || ''} onChange={e => setSettingsData({
                            ...settingsData,
                            izmir_edge_item2_icon: e.target.value
                          })} style={{
                            width: '100%',
                            padding: '0.65rem',
                            borderRadius: '6px',
                            border: '1px solid var(--glass-border)'
                          }} />
                              </div>
                            </div>
                            <div className="admin-form-group" style={{
                        margin: 0
                      }}>
                              <label style={{
                          fontSize: '0.75rem'
                        }}>Açıklama</label>
                              <textarea rows="2" value={settingsData.izmir_edge_item2_desc || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          izmir_edge_item2_desc: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: '6px',
                          border: '1px solid var(--glass-border)',
                          fontFamily: 'sans-serif'
                        }} />
                            </div>
                          </div>

                          {/* Item 3 */}
                          <div style={{
                      padding: '1rem',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      background: 'rgba(15,23,42,0.01)'
                    }}>
                            <strong style={{
                        fontSize: '0.8rem',
                        color: 'var(--primary)'
                      }}>Madde #3</strong>
                            <div className="admin-form-row" style={{
                        marginTop: '0.5rem'
                      }}>
                              <div className="admin-form-group">
                                <label style={{
                            fontSize: '0.75rem'
                          }}>Başlık</label>
                                <input type="text" value={settingsData.izmir_edge_item3_title || ''} onChange={e => setSettingsData({
                            ...settingsData,
                            izmir_edge_item3_title: e.target.value
                          })} style={{
                            width: '100%',
                            padding: '0.65rem',
                            borderRadius: '6px',
                            border: '1px solid var(--glass-border)'
                          }} />
                              </div>
                              <div className="admin-form-group">
                                <label style={{
                            fontSize: '0.75rem'
                          }}>İkon (FontAwesome)</label>
                                <input type="text" value={settingsData.izmir_edge_item3_icon || ''} onChange={e => setSettingsData({
                            ...settingsData,
                            izmir_edge_item3_icon: e.target.value
                          })} style={{
                            width: '100%',
                            padding: '0.65rem',
                            borderRadius: '6px',
                            border: '1px solid var(--glass-border)'
                          }} />
                              </div>
                            </div>
                            <div className="admin-form-group" style={{
                        margin: 0
                      }}>
                              <label style={{
                          fontSize: '0.75rem'
                        }}>Açıklama</label>
                              <textarea rows="2" value={settingsData.izmir_edge_item3_desc || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          izmir_edge_item3_desc: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: '6px',
                          border: '1px solid var(--glass-border)',
                          fontFamily: 'sans-serif'
                        }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Visual Card Settings */}
                      <div style={{
                  marginTop: '2rem',
                  borderTop: '1px dashed var(--glass-border)',
                  paddingTop: '1.25rem'
                }}>
                        <h5 style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--text-light)',
                    marginBottom: '1rem'
                  }}>Sağ Görsel/Vektör Kartı Ayarları</h5>
                        
                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label style={{
                        fontSize: '0.75rem'
                      }}>Başlık</label>
                            <input type="text" value={settingsData.izmir_edge_box_title || ''} onChange={e => setSettingsData({
                        ...settingsData,
                        izmir_edge_box_title: e.target.value
                      })} style={{
                        width: '100%',
                        padding: '0.65rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)'
                      }} />
                          </div>
                          <div className="admin-form-group">
                            <label style={{
                        fontSize: '0.75rem'
                      }}>Orta İkon (FontAwesome)</label>
                            <input type="text" value={settingsData.izmir_edge_box_icon || ''} onChange={e => setSettingsData({
                        ...settingsData,
                        izmir_edge_box_icon: e.target.value
                      })} style={{
                        width: '100%',
                        padding: '0.65rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)'
                      }} />
                          </div>
                        </div>
                        
                        <div className="admin-form-group">
                          <label style={{
                      fontSize: '0.75rem'
                    }}>Alt Açıklama</label>
                          <textarea rows="2" value={settingsData.izmir_edge_box_desc || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      izmir_edge_box_desc: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--glass-border)',
                      fontFamily: 'sans-serif'
                    }} />
                        </div>
                        
                        <div className="admin-form-group">
                          <label style={{
                      fontSize: '0.75rem'
                    }}>Görsel Arka Plan URL (Boşsa mavi gradyan kullanılır)</label>
                          <input type="text" value={settingsData.izmir_edge_box_image || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      izmir_edge_box_image: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--glass-border)'
                    }} placeholder="Örn: /images/aegean_map.png" />
                        </div>

                        <div className="admin-form-row" style={{
                    margin: 0
                  }}>
                          <div className="admin-form-group" style={{
                      margin: 0
                    }}>
                            <label style={{
                        fontSize: '0.75rem'
                      }}>Küçük Rozet Üst (Örn: İzmir)</label>
                            <input type="text" value={settingsData.izmir_edge_box_badge_title || ''} onChange={e => setSettingsData({
                        ...settingsData,
                        izmir_edge_box_badge_title: e.target.value
                      })} style={{
                        width: '100%',
                        padding: '0.65rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)'
                      }} />
                          </div>
                          <div className="admin-form-group" style={{
                      margin: 0
                    }}>
                            <label style={{
                        fontSize: '0.75rem'
                      }}>Küçük Rozet Alt (Örn: Ege'nin Dijital Merkezi)</label>
                            <input type="text" value={settingsData.izmir_edge_box_badge_desc || ''} onChange={e => setSettingsData({
                        ...settingsData,
                        izmir_edge_box_badge_desc: e.target.value
                      })} style={{
                        width: '100%',
                        padding: '0.65rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)'
                      }} />
                          </div>
                        </div>
                      </div>
                    </div>}
                  <div className="mobile-only-save" style={{
                marginTop: '2rem'
              }}>
                    <button type="submit" className="btn btn-primary" style={{
                  width: '100%',
                  padding: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                      <i className="fa-solid fa-floppy-disk"></i> Değişiklikleri Kaydet
                    </button>
                  </div>
                </div>
              </form>
            </div>
  );
}
