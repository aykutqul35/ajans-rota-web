import { useState } from 'react';

export default function TestimonialsTab({
  testimonialsData, setTestimonialsData, handleSaveAll, isSaving, settingsData, setSettingsData, openEditModal, handleDeleteItem
}) {
const [testSearch, setTestSearch] = useState('');
const [testCatFilter, setTestCatFilter] = useState('all');
const [activeTestimonialsSection, setActiveTestimonialsSection] = useState('reviews');
  return (
              <div>
              <div className="admin-section-title" style={{
            marginBottom: '1.5rem'
          }}>
                Referanslar & Yorumlar Sayfası Yönetimi
              </div>

              <form onSubmit={e => {
            e.preventDefault();
            handleSaveAll();
          }} className="admin-split-layout">
                {/* Left Column: Sections Sidebar */}
                <div className="service-editor-sidebar admin-split-sidebar">
                  {[{
                id: 'reviews',
                label: 'Müşteri Yorumları',
                icon: 'fa-solid fa-comments'
              }, {
                id: 'kpis',
                label: 'Performans Göstergeleri',
                icon: 'fa-solid fa-chart-line'
              }, {
                id: 'case_studies',
                label: 'Vaka Çalışmaları (CS)',
                icon: 'fa-solid fa-file-invoice-dollar'
              }, {
                id: 'logos',
                label: 'Marka Logoları Duvarı',
                icon: 'fa-solid fa-cubes'
              }].map(sec => {
                const isActive = activeTestimonialsSection === sec.id;
                return <button key={sec.id} type="button" onClick={() => setActiveTestimonialsSection(sec.id)} className={`service-sec-btn ${isActive ? 'active' : ''}`}>
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
                  
                  {/* Option 1: Reviews List */}
                  {activeTestimonialsSection === 'reviews' && <div>
                      <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid rgba(15,23,42,0.05)',
                  paddingBottom: '0.5rem'
                }}>
                        <h4 style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--text-light)',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                          <i className="fa-solid fa-comments" style={{
                      color: 'var(--primary)'
                    }}></i> Müşteri Yorumları & Kartları
                        </h4>
                        <button type="button" onClick={() => openEditModal('testimonial', 'new')} className="btn btn-secondary" style={{
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.8rem'
                  }}>
                          <i className="fa-solid fa-plus" style={{
                      marginRight: '6px'
                    }}></i> Yeni Yorum Ekle
                        </button>
                      </div>

                      {/* Filters */}
                      <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap'
                }}>
                        <input type="text" placeholder="Müşteri veya şirket adı ara..." value={testSearch} onChange={e => setTestSearch(e.target.value)} style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '0.65rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff',
                    fontSize: '0.9rem'
                  }} />
                        <select value={testCatFilter} onChange={e => setTestCatFilter(e.target.value)} style={{
                    padding: '0.65rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff',
                    fontSize: '0.9rem',
                    minWidth: '150px'
                  }}>
                          <option value="all">Tüm Kategoriler</option>
                          <option value="google-ads">Google Ads</option>
                          <option value="meta-ads">Meta Ads</option>
                          <option value="seo">SEO &amp; İçerik</option>
                          <option value="social-media">Sosyal Medya</option>
                          <option value="ecommerce">E-Ticaret</option>
                          <option value="web-design">Web Tasarım</option>
                        </select>
                      </div>

                      <div className="admin-item-list" style={{
                  maxHeight: '450px',
                  overflowY: 'auto',
                  paddingRight: '4px'
                }}>
                        {testimonialsData.filter(item => {
                    const matchQuery = (item.name || '').toLowerCase().includes(testSearch.toLowerCase()) || (item.company || '').toLowerCase().includes(testSearch.toLowerCase());
                    const matchCat = testCatFilter === 'all' || item.category === testCatFilter;
                    return matchQuery && matchCat;
                  }).map(item => <div key={item.id} className="admin-item-row">
                              <div className="admin-item-info">
                                <h4>{item.name} <span style={{
                          fontSize: '0.8rem',
                          fontWeight: 'normal',
                          color: 'var(--text-muted)'
                        }}>({item.company} - {item.role})</span></h4>
                                <span>Kategori: {item.category} | Metrik: {item.metric || 'Yok'}</span>
                                <p style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-main)',
                        marginTop: '6px',
                        fontStyle: 'italic',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                                  "{item.quote}"
                                </p>
                              </div>
                              <div className="admin-action-btns">
                                <button type="button" onClick={() => openEditModal('testimonial', item)} className="btn-icon" title="Düzenle">
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button type="button" onClick={() => handleDeleteItem('testimonial', item)} className="btn-icon btn-delete" title="Sil">
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            </div>)}
                      </div>
                    </div>}

                  {/* Option 2: KPIs */}
                  {activeTestimonialsSection === 'kpis' && <div>
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
                  }}></i> Performans Gösterge Paneli (KPI'lar)
                      </h4>

                      <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem'
                }}>
                        <div className="admin-form-group">
                          <label>Gösterge 1 Başlık</label>
                          <input type="text" value={settingsData.ref_kpi1_title || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      ref_kpi1_title: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--glass-border)'
                    }} />
                        </div>
                        <div className="admin-form-group">
                          <label>Gösterge 1 Değer</label>
                          <input type="text" value={settingsData.ref_kpi1_val || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      ref_kpi1_val: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--glass-border)'
                    }} />
                        </div>

                        <div className="admin-form-group">
                          <label>Gösterge 2 Başlık</label>
                          <input type="text" value={settingsData.ref_kpi2_title || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      ref_kpi2_title: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--glass-border)'
                    }} />
                        </div>
                        <div className="admin-form-group">
                          <label>Gösterge 2 Değer</label>
                          <input type="text" value={settingsData.ref_kpi2_val || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      ref_kpi2_val: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--glass-border)'
                    }} />
                        </div>

                        <div className="admin-form-group">
                          <label>Gösterge 3 Başlık</label>
                          <input type="text" value={settingsData.ref_kpi3_title || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      ref_kpi3_title: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--glass-border)'
                    }} />
                        </div>
                        <div className="admin-form-group">
                          <label>Gösterge 3 Değer</label>
                          <input type="text" value={settingsData.ref_kpi3_val || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      ref_kpi3_val: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--glass-border)'
                    }} />
                        </div>

                        <div className="admin-form-group">
                          <label>Gösterge 4 Başlık</label>
                          <input type="text" value={settingsData.ref_kpi4_title || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      ref_kpi4_title: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--glass-border)'
                    }} />
                        </div>
                        <div className="admin-form-group">
                          <label>Gösterge 4 Değer</label>
                          <input type="text" value={settingsData.ref_kpi4_val || ''} onChange={e => setSettingsData({
                      ...settingsData,
                      ref_kpi4_val: e.target.value
                    })} style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--glass-border)'
                    }} />
                        </div>
                      </div>
                    </div>}

                  {/* Option 3: Case Studies */}
                  {activeTestimonialsSection === 'case_studies' && <div>
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
                        <i className="fa-solid fa-file-invoice-dollar" style={{
                    color: 'var(--primary)'
                  }}></i> Öncesi / Sonrası Büyüme Analizleri (3 adet)
                      </h4>

                      <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem'
                }}>
                        {/* Case Study 1 Form */}
                        <div style={{
                    border: '1px solid var(--glass-border)',
                    padding: '1.25rem',
                    borderRadius: '8px',
                    background: '#f8fafc'
                  }}>
                          <h5 style={{
                      margin: '0 0 1rem 0',
                      color: 'var(--primary)',
                      fontWeight: '700'
                    }}>Vaka Çalışması 1</h5>
                          <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '0.75rem',
                      marginBottom: '0.75rem'
                    }}>
                            <div className="admin-form-group">
                              <label>Şirket Adı</label>
                              <input type="text" value={settingsData.cs1_company || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs1_company: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Logo / İkon / Emoji</label>
                              <input type="text" value={settingsData.cs1_logo || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs1_logo: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Sektör</label>
                              <input type="text" value={settingsData.cs1_sector || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs1_sector: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                          </div>

                          <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '0.75rem',
                      marginBottom: '0.75rem'
                    }}>
                            <div className="admin-form-group">
                              <label>Önceki ROAS / Metrik</label>
                              <input type="text" value={settingsData.cs1_before_roas || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs1_before_roas: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Önceki Trafik / Durum</label>
                              <input type="text" value={settingsData.cs1_before_traffic || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs1_before_traffic: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Önceki Maliyet / Sorun</label>
                              <input type="text" value={settingsData.cs1_before_cost || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs1_before_cost: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                          </div>

                          <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '0.75rem',
                      marginBottom: '0.75rem'
                    }}>
                            <div className="admin-form-group">
                              <label>Sonraki ROAS / Metrik</label>
                              <input type="text" value={settingsData.cs1_after_roas || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs1_after_roas: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Sonraki Trafik / Durum</label>
                              <input type="text" value={settingsData.cs1_after_traffic || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs1_after_traffic: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Sonraki Maliyet / İyileşme</label>
                              <input type="text" value={settingsData.cs1_after_cost || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs1_after_cost: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                          </div>

                          <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                            <div className="admin-form-group">
                              <label>Strateji 1</label>
                              <input type="text" value={settingsData.cs1_strat1 || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs1_strat1: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Strateji 2</label>
                              <input type="text" value={settingsData.cs1_strat2 || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs1_strat2: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Strateji 3</label>
                              <input type="text" value={settingsData.cs1_strat3 || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs1_strat3: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                          </div>
                        </div>

                        {/* Case Study 2 Form */}
                        <div style={{
                    border: '1px solid var(--glass-border)',
                    padding: '1.25rem',
                    borderRadius: '8px',
                    background: '#f8fafc'
                  }}>
                          <h5 style={{
                      margin: '0 0 1rem 0',
                      color: 'var(--primary)',
                      fontWeight: '700'
                    }}>Vaka Çalışması 2</h5>
                          <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '0.75rem',
                      marginBottom: '0.75rem'
                    }}>
                            <div className="admin-form-group">
                              <label>Şirket Adı</label>
                              <input type="text" value={settingsData.cs2_company || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs2_company: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Logo / İkon / Emoji</label>
                              <input type="text" value={settingsData.cs2_logo || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs2_logo: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Sektör</label>
                              <input type="text" value={settingsData.cs2_sector || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs2_sector: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                          </div>

                          <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '0.75rem',
                      marginBottom: '0.75rem'
                    }}>
                            <div className="admin-form-group">
                              <label>Önceki ROAS / Metrik</label>
                              <input type="text" value={settingsData.cs2_before_roas || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs2_before_roas: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Önceki Trafik / Durum</label>
                              <input type="text" value={settingsData.cs2_before_traffic || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs2_before_traffic: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Önceki Maliyet / Sorun</label>
                              <input type="text" value={settingsData.cs2_before_cost || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs2_before_cost: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                          </div>
                        </div>

                        {/* Case Study 3 Form */}
                        <div style={{
                    border: '1px solid var(--glass-border)',
                    padding: '1.25rem',
                    borderRadius: '8px',
                    background: '#f8fafc'
                  }}>
                          <h5 style={{
                      margin: '0 0 1rem 0',
                      color: 'var(--primary)',
                      fontWeight: '700'
                    }}>Vaka Çalışması 3</h5>
                          <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '0.75rem',
                      marginBottom: '0.75rem'
                    }}>
                            <div className="admin-form-group">
                              <label>Şirket Adı</label>
                              <input type="text" value={settingsData.cs3_company || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs3_company: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Logo / İkon / Emoji</label>
                              <input type="text" value={settingsData.cs3_logo || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs3_logo: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Sektör</label>
                              <input type="text" value={settingsData.cs3_sector || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs3_sector: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                          </div>

                          <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '0.75rem',
                      marginBottom: '0.75rem'
                    }}>
                            <div className="admin-form-group">
                              <label>Önceki ROAS / Metrik</label>
                              <input type="text" value={settingsData.cs3_before_roas || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs3_before_roas: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Önceki Trafik / Durum</label>
                              <input type="text" value={settingsData.cs3_before_traffic || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs3_before_traffic: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Önceki Maliyet / Sorun</label>
                              <input type="text" value={settingsData.cs3_before_cost || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs3_before_cost: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                          </div>

                          <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '0.75rem',
                      marginBottom: '0.75rem'
                    }}>
                            <div className="admin-form-group">
                              <label>Sonraki ROAS / Metrik</label>
                              <input type="text" value={settingsData.cs3_after_roas || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs3_after_roas: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Sonraki Trafik / Durum</label>
                              <input type="text" value={settingsData.cs3_after_traffic || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs3_after_traffic: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Sonraki Maliyet / İyileşme</label>
                              <input type="text" value={settingsData.cs3_after_cost || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs3_after_cost: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                          </div>

                          <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                            <div className="admin-form-group">
                              <label>Strateji 1</label>
                              <input type="text" value={settingsData.cs3_strat1 || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs3_strat1: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Strateji 2</label>
                              <input type="text" value={settingsData.cs3_strat2 || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs3_strat2: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                            <div className="admin-form-group">
                              <label>Strateji 3</label>
                              <input type="text" value={settingsData.cs3_strat3 || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          cs3_strat3: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>}



                  {/* Option 5: Brand Logo Wall */}
                  {activeTestimonialsSection === 'logos' && <div>
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
                        <i className="fa-solid fa-cubes" style={{
                    color: 'var(--primary)'
                  }}></i> Marka Logoları Duvarı (6 adet)
                      </h4>

                      <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1.5rem'
                }}>
                        {[1, 2, 3, 4, 5, 6].map(num => <div key={num} style={{
                    border: '1px solid var(--glass-border)',
                    padding: '1rem',
                    borderRadius: '8px',
                    background: '#f8fafc'
                  }}>
                            <h5 style={{
                      margin: '0 0 0.75rem 0',
                      color: 'var(--primary)',
                      fontWeight: '700'
                    }}>Marka Kartı {num}</h5>
                            
                            <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 3fr',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                              <div className="admin-form-group">
                                <label>Logo (Emoji)</label>
                                <input type="text" value={settingsData[`logo${num}_logo`] || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          [`logo${num}_logo`]: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)',
                          textAlign: 'center'
                        }} />
                              </div>
                              <div className="admin-form-group">
                                <label>Şirket Adı</label>
                                <input type="text" value={settingsData[`logo${num}_company`] || ''} onChange={e => setSettingsData({
                          ...settingsData,
                          [`logo${num}_company`]: e.target.value
                        })} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--glass-border)'
                        }} />
                              </div>
                            </div>

                            <div className="admin-form-group" style={{
                      marginBottom: '0.5rem'
                    }}>
                              <label>Verilen Hizmetler</label>
                              <input type="text" value={settingsData[`logo${num}_services`] || ''} onChange={e => setSettingsData({
                        ...settingsData,
                        [`logo${num}_services`]: e.target.value
                      })} style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid var(--glass-border)'
                      }} />
                            </div>

                            <div className="admin-form-group" style={{
                      marginBottom: 0
                    }}>
                              <label>Elde Edilen Başarı (Metrik)</label>
                              <input type="text" value={settingsData[`logo${num}_metric`] || ''} onChange={e => setSettingsData({
                        ...settingsData,
                        [`logo${num}_metric`]: e.target.value
                      })} style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid var(--glass-border)'
                      }} />
                            </div>
                          </div>)}
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
