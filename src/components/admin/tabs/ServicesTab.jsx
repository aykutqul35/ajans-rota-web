import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function ServicesTab({
  servicesData, setServicesData, handleSaveAll, isSaving
}) {
const [activeServiceEditSection, setActiveServiceEditSection] = useState('basic');

const [editingServiceKey, setEditingServiceKey] = useState('google');

  const handleServiceFieldChange = (field, value) => {
    setServicesData(prev => ({
      ...prev,
      [editingServiceKey]: {
        ...prev[editingServiceKey],
        [field]: value
      }
    }));
  };

  const handleServiceNestedChange = (parentField, childField, value) => {
    setServicesData(prev => ({
      ...prev,
      [editingServiceKey]: {
        ...prev[editingServiceKey],
        [parentField]: {
          ...prev[editingServiceKey][parentField],
          [childField]: value
        }
      }
    }));
  };

  const handleFeatureChange = (index, value) => {
    setServicesData(prev => {
      const newFeatures = [...(prev[editingServiceKey].features || [])];
      newFeatures[index] = value;
      return {
        ...prev,
        [editingServiceKey]: {
          ...prev[editingServiceKey],
          features: newFeatures
        }
      };
    });
  };

  const handleAddFeature = () => {
    setServicesData(prev => {
      const newFeatures = [...(prev[editingServiceKey].features || []), "Yeni Hizmet Kapsam Maddesi"];
      return {
        ...prev,
        [editingServiceKey]: {
          ...prev[editingServiceKey],
          features: newFeatures
        }
      };
    });
  };

  const handleDeleteFeature = index => {
    setServicesData(prev => {
      const newFeatures = (prev[editingServiceKey].features || []).filter((_, idx) => idx !== index);
      return {
        ...prev,
        [editingServiceKey]: {
          ...prev[editingServiceKey],
          features: newFeatures
        }
      };
    });
  };

  const handleMetricChange = (index, field, value) => {
    setServicesData(prev => {
      const newMetrics = [...(prev[editingServiceKey].caseStudy.metrics || [])];
      newMetrics[index] = {
        ...newMetrics[index],
        [field]: value
      };
      return {
        ...prev,
        [editingServiceKey]: {
          ...prev[editingServiceKey],
          caseStudy: {
            ...prev[editingServiceKey].caseStudy,
            metrics: newMetrics
          }
        }
      };
    });
  };

  const handleAddMetric = () => {
    setServicesData(prev => {
      const newMetrics = [...(prev[editingServiceKey].caseStudy.metrics || []), {
        label: "Yeni Metrik",
        val: "0",
        icon: "fa-solid fa-chart-line"
      }];
      return {
        ...prev,
        [editingServiceKey]: {
          ...prev[editingServiceKey],
          caseStudy: {
            ...prev[editingServiceKey].caseStudy,
            metrics: newMetrics
          }
        }
      };
    });
  };

  const handleDeleteMetric = index => {
    setServicesData(prev => {
      const newMetrics = (prev[editingServiceKey].caseStudy.metrics || []).filter((_, idx) => idx !== index);
      return {
        ...prev,
        [editingServiceKey]: {
          ...prev[editingServiceKey],
          caseStudy: {
            ...prev[editingServiceKey].caseStudy,
            metrics: newMetrics
          }
        }
      };
    });
  };

  const handleFaqChange = (index, field, value) => {
    setServicesData(prev => {
      const newFaqs = [...(prev[editingServiceKey].faqs || [])];
      newFaqs[index] = {
        ...newFaqs[index],
        [field]: value
      };
      return {
        ...prev,
        [editingServiceKey]: {
          ...prev[editingServiceKey],
          faqs: newFaqs
        }
      };
    });
  };

  const handleAddFaq = () => {
    setServicesData(prev => {
      const newFaqs = [...(prev[editingServiceKey].faqs || []), {
        q: "Yeni Soru?",
        a: "Cevap açıklaması..."
      }];
      return {
        ...prev,
        [editingServiceKey]: {
          ...prev[editingServiceKey],
          faqs: newFaqs
        }
      };
    });
  };

  const handleDeleteFaq = index => {
    setServicesData(prev => {
      const newFaqs = (prev[editingServiceKey].faqs || []).filter((_, idx) => idx !== index);
      return {
        ...prev,
        [editingServiceKey]: {
          ...prev[editingServiceKey],
          faqs: newFaqs
        }
      };
    });
  };

  const handleProcessChange = (index, field, value) => {
    setServicesData(prev => {
      const newProcess = [...(prev[editingServiceKey].process || [])];
      newProcess[index] = {
        ...newProcess[index],
        [field]: value
      };
      return {
        ...prev,
        [editingServiceKey]: {
          ...prev[editingServiceKey],
          process: newProcess
        }
      };
    });
  };

  const handleAddProcessStep = () => {
    setServicesData(prev => {
      const newProcess = [...(prev[editingServiceKey].process || [])];
      const nextNum = String(newProcess.length + 1).padStart(2, '0');
      newProcess.push({
        step: nextNum,
        title: "Yeni Adım",
        desc: "Süreç açıklaması..."
      });
      return {
        ...prev,
        [editingServiceKey]: {
          ...prev[editingServiceKey],
          process: newProcess
        }
      };
    });
  };

  const handleDeleteProcessStep = index => {
    setServicesData(prev => {
      const newProcess = (prev[editingServiceKey].process || []).filter((_, idx) => idx !== index).map((p, idx) => ({
        ...p,
        step: String(idx + 1).padStart(2, '0')
      }));
      return {
        ...prev,
        [editingServiceKey]: {
          ...prev[editingServiceKey],
          process: newProcess
        }
      };
    });
  };

  const handleAddNewService = () => {
    const slug = window.prompt("Yeni hizmet için benzersiz bir İngilizce anahtar kelime/slug girin (Örn: video-kreatif):");
    if (!slug) return;
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    if (!cleanSlug) {
      toast.error("Geçersiz anahtar kelime!");
      return;
    }
    if (servicesData[cleanSlug]) {
      toast("Bu anahtar kelime zaten kullanımda!");
      return;
    }
    const title = window.prompt("Hizmet başlığını girin (Örn: Video ve Kreatif Üretimi):");
    if (!title) return;
    const newService = {
      baseFee: 20000,
      title: title,
      tagline: "Minimum Bütçe ve Yüksek Etki Odaklı Hizmet",
      iconName: "fa-solid fa-compass",
      description: "Bu yeni hizmet hakkında detaylı açıklama yazısı...",
      features: ["Örnek Hizmet Maddesi 1", "Örnek Hizmet Maddesi 2"],
      caseStudy: {
        brand: "Örnek Marka",
        industry: "E-Ticaret",
        challenge: "Yaşanılan problem detayı...",
        solution: "Ürettiğimiz yol haritası...",
        metrics: [{
          label: "Dönüşüm Oranı",
          val: "+120%",
          icon: "fa-solid fa-chart-line"
        }, {
          label: "ROAS Artışı",
          val: "5.4x",
          icon: "fa-solid fa-arrow-up-right-dots"
        }]
      },
      testimonial: {
        name: "Yönetici Adı",
        company: "Şirket Adı",
        role: "Genel Müdür",
        rating: 5,
        quote: "Yapılan çalışmalardan son derece memnun kaldık, ciromuz kısa sürede arttı.",
        initials: "YA"
      },
      process: [{
        step: "01",
        title: "Planlama",
        desc: "Hizmet kurulumunun yapılması ve analizi."
      }, {
        step: "02",
        title: "Uygulama",
        desc: "Geliştirmelerin ve optimizasyonların yapılması."
      }],
      faqs: [{
        q: "Hizmet teslim süresi nedir?",
        a: "Sektöre ve taleplere göre değişiklik göstermekle birlikte ortalama 2-4 haftadır."
      }]
    };
    setServicesData(prev => ({
      ...prev,
      [cleanSlug]: newService
    }));
    setEditingServiceKey(cleanSlug);
  };

  const handleDeleteService = keyToDelete => {
    if (keyToDelete === 'google' || keyToDelete === 'meta') {
      toast("Google Ads ve Meta Ads hizmetleri temel yapının bir parçasıdır ve silinemez.");
      return;
    }
    if (window.confirm(`"${servicesData[keyToDelete]?.title || keyToDelete}" hizmetini tamamen silmek istediğinizden emin misiniz?`)) {
      setServicesData(prev => {
        const updated = {
          ...prev
        };
        delete updated[keyToDelete];
        return updated;
      });
      const remainingKeys = Object.keys(servicesData).filter(k => k !== keyToDelete);
      setEditingServiceKey(remainingKeys[0] || 'google');
    }
  };
  return (
              <div>
              <div className="admin-section-title" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
                <span>Hizmet Sayfaları İçerik Yönetimi</span>
                <button type="button" onClick={handleAddNewService} className="btn btn-primary" style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
                  <i className="fa-solid fa-plus"></i> Yeni Hizmet Ekle
                </button>
              </div>

              {/* Service Selection Cards Grid */}
              <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem'
          }}>
                {Object.keys(servicesData).map(key => {
              const s = servicesData[key];
              const isEditing = editingServiceKey === key;
              return <div key={key} onClick={() => {
                setEditingServiceKey(key);
                setActiveServiceEditSection('basic');
              }} className={`service-select-card ${isEditing ? 'active' : ''}`}>
                      <div className="service-select-card-icon">
                        <i className={s.iconName || 'fa-solid fa-briefcase'}></i>
                      </div>
                      <div style={{
                  flex: 1,
                  minWidth: 0
                }}>
                        <span style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--text-light)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                          {s.title || key}
                        </span>
                        <span style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    marginTop: '2px'
                  }}>
                          {key === 'google' || key === 'meta' ? 'Varsayılan Hizmet' : 'Özel Hizmet'}
                        </span>
                      </div>
                    </div>;
            })}
              </div>

              {servicesData[editingServiceKey] && <form onSubmit={e => {
            e.preventDefault();
            handleSaveAll();
          }} className="admin-split-layout">
                  {/* Left Column: Editor Sections Menu */}
                  <div className="service-editor-sidebar admin-split-sidebar">
                    {[{
                id: 'basic',
                label: 'Temel Bilgiler',
                icon: 'fa-solid fa-circle-info'
              }, {
                id: 'features',
                label: 'Kapsam Maddeleri',
                icon: 'fa-solid fa-list-check'
              }, {
                id: 'process',
                label: 'Hizmet Süreci',
                icon: 'fa-solid fa-spinner'
              }, {
                id: 'case',
                label: 'Başarı Hikayesi (Vaka)',
                icon: 'fa-solid fa-award'
              }, {
                id: 'testimonial',
                label: 'Müşteri Yorumu',
                icon: 'fa-solid fa-comment-dots'
              }, {
                id: 'faqs',
                label: 'Sıkça Sorulan Sorular',
                icon: 'fa-solid fa-circle-question'
              }, {
                id: 'seo',
                label: 'SEO Ayarları',
                icon: 'fa-solid fa-magnifying-glass'
              }].map(section => {
                const isActive = activeServiceEditSection === section.id;
                return <button key={section.id} type="button" onClick={() => setActiveServiceEditSection(section.id)} className={`service-sec-btn ${isActive ? 'active' : ''}`}>
                          <i className={section.icon} style={{
                    width: '16px',
                    textAlign: 'center',
                    fontSize: '0.95rem'
                  }}></i>
                          {section.label}
                        </button>;
              })}

                    <div className="admin-split-sidebar-save" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}>
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

                      {editingServiceKey !== 'google' && editingServiceKey !== 'meta' && <button type="button" onClick={() => handleDeleteService(editingServiceKey)} className="btn btn-secondary" style={{
                  width: '100%',
                  padding: '0.8rem',
                  fontSize: '0.85rem',
                  color: '#ef4444',
                  borderColor: 'rgba(239, 68, 68, 0.2)',
                  background: 'rgba(239, 68, 68, 0.03)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                          <i className="fa-solid fa-trash-can"></i> Hizmeti Sil
                        </button>}
                    </div>
                  </div>

                  {/* Right Column: Active Editor Section Fields */}
                  <div className="service-editor-fields admin-split-content">
                    
                    {/* Basic Info */}
                    {activeServiceEditSection === 'basic' && <div>
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
                          <i className="fa-solid fa-circle-info" style={{
                    color: 'var(--primary)'
                  }}></i> Temel Hizmet Bilgileri
                        </h4>
                        <div className="admin-form-group">
                          <label>Hizmet Başlığı</label>
                          <input type="text" value={servicesData[editingServiceKey].title || ''} onChange={e => handleServiceFieldChange('title', e.target.value)} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff'
                  }} />
                        </div>
                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label>Hizmet İkon Sınıfı (FontAwesome)</label>
                            <input type="text" value={servicesData[editingServiceKey].iconName || ''} onChange={e => handleServiceFieldChange('iconName', e.target.value)} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }} placeholder="fa-solid fa-briefcase" />
                          </div>
                          <div className="admin-form-group">
                            <label>Taban Fiyat (Hesaplayıcı İçin - ₺)</label>
                            <input type="number" value={servicesData[editingServiceKey].baseFee || 0} onChange={e => handleServiceFieldChange('baseFee', parseInt(e.target.value) || 0)} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }} />
                          </div>
                        </div>
                        <div className="admin-form-group">
                          <label>Spot / Slogan (Tagline)</label>
                          <input type="text" value={servicesData[editingServiceKey].tagline || ''} onChange={e => handleServiceFieldChange('tagline', e.target.value)} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff'
                  }} />
                        </div>
                        <div className="admin-form-group" style={{
                  margin: 0
                }}>
                          <label>Açıklama Metni</label>
                          <textarea rows="6" value={servicesData[editingServiceKey].description || ''} onChange={e => handleServiceFieldChange('description', e.target.value)} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff',
                    fontFamily: 'sans-serif',
                    lineHeight: '1.4'
                  }}></textarea>
                        </div>
                      </div>}

                    {/* Features List */}
                    {activeServiceEditSection === 'features' && <div>
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
                            <i className="fa-solid fa-list-check" style={{
                      color: 'var(--primary)'
                    }}></i> Hizmet Kapsam Maddeleri
                          </h4>
                          <button type="button" onClick={handleAddFeature} className="btn btn-secondary" style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    borderRadius: '6px'
                  }}>
                            <i className="fa-solid fa-plus"></i> Madde Ekle
                          </button>
                        </div>
                        <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.25rem'
                }}>
                          Sitenizdeki hizmet kartlarında ve detay sayfalarında sergilenen temel maddeler.
                        </p>
                        <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                          {(servicesData[editingServiceKey].features || []).map((feature, idx) => <div key={idx} style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center'
                  }}>
                              <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: 'var(--text-muted)',
                      width: '20px',
                      textAlign: 'center'
                    }}>#{idx + 1}</span>
                              <input type="text" value={feature || ''} onChange={e => handleFeatureChange(idx, e.target.value)} style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }} placeholder="Örn: Google Analytics Kurulumu ve Takibi" />
                              <button type="button" onClick={() => handleDeleteFeature(idx)} className="btn-icon btn-delete" style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }} title="Maddeyi Sil">
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            </div>)}
                          {(servicesData[editingServiceKey].features || []).length === 0 && <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    border: '1px dashed var(--glass-border)',
                    borderRadius: '8px',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem'
                  }}>
                              Henüz kapsam maddesi eklenmemiş. Yukarıdan yeni bir madde ekleyin.
                            </div>}
                        </div>
                      </div>}

                    {/* Process Steps */}
                    {activeServiceEditSection === 'process' && <div>
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
                            <i className="fa-solid fa-spinner" style={{
                      color: 'var(--primary)'
                    }}></i> Hizmet Süreci Adımları
                          </h4>
                          <button type="button" onClick={handleAddProcessStep} className="btn btn-secondary" style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    borderRadius: '6px'
                  }}>
                            <i className="fa-solid fa-plus"></i> Adım Ekle
                          </button>
                        </div>
                        <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.25rem'
                }}>
                          Bu hizmeti verirken takip ettiğiniz profesyonel aşamaları ve metodolojinizi listeleyin.
                        </p>
                        <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}>
                          {(servicesData[editingServiceKey].process || []).map((step, idx) => <div key={idx} style={{
                    padding: '1.25rem',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.01)',
                    boxShadow: '0 2px 6px rgba(15,23,42,0.01)'
                  }}>
                              <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      borderBottom: '1px solid rgba(15,23,42,0.05)',
                      paddingBottom: '0.5rem'
                    }}>
                                <strong style={{
                        fontSize: '0.85rem',
                        color: 'var(--primary)'
                      }}>Adım #{step.step || String(idx + 1).padStart(2, '0')}</strong>
                                <button type="button" onClick={() => handleDeleteProcessStep(idx)} className="btn-icon btn-delete" style={{
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }} title="Adımı Sil">
                                  <i className="fa-solid fa-trash-can"></i> Sil
                                </button>
                              </div>
                              <div className="admin-form-row">
                                <div className="admin-form-group">
                                  <label style={{
                          fontSize: '0.75rem'
                        }}>Aşama Başlığı</label>
                                  <input type="text" value={step.title || ''} onChange={e => handleProcessChange(idx, 'title', e.target.value)} style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: '6px',
                          border: '1px solid var(--glass-border)',
                          background: '#fff'
                        }} />
                                </div>
                                <div className="admin-form-group">
                                  <label style={{
                          fontSize: '0.75rem'
                        }}>Aşama No (Örn: 01, 02)</label>
                                  <input type="text" value={step.step || ''} onChange={e => handleProcessChange(idx, 'step', e.target.value)} style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: '6px',
                          border: '1px solid var(--glass-border)',
                          background: '#fff'
                        }} />
                                </div>
                              </div>
                              <div className="admin-form-group" style={{
                      margin: 0
                    }}>
                                <label style={{
                        fontSize: '0.75rem'
                      }}>Aşama Detay Açıklaması</label>
                                <textarea rows="2" value={step.desc || ''} onChange={e => handleProcessChange(idx, 'desc', e.target.value)} style={{
                        width: '100%',
                        padding: '0.65rem',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)',
                        background: '#fff',
                        fontFamily: 'sans-serif'
                      }}></textarea>
                              </div>
                            </div>)}
                          {(servicesData[editingServiceKey].process || []).length === 0 && <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    border: '1px dashed var(--glass-border)',
                    borderRadius: '8px',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem'
                  }}>
                              Henüz süreç adımı eklenmemiş. Yukarıdan yeni bir adım ekleyin.
                            </div>}
                        </div>
                      </div>}

                    {/* Case Study */}
                    {activeServiceEditSection === 'case' && <div>
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
                          <i className="fa-solid fa-award" style={{
                    color: 'var(--primary)'
                  }}></i> Başarı Hikayesi (Vaka Analizi)
                        </h4>
                        <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.25rem'
                }}>
                          Bu hizmetle ilgili ulaştığınız somut bir başarıyı vaka analizi olarak ekleyin.
                        </p>
                        {servicesData[editingServiceKey].caseStudy ? <div>
                            <div className="admin-form-row">
                              <div className="admin-form-group">
                                <label>Marka / Firma Adı</label>
                                <input type="text" value={servicesData[editingServiceKey].caseStudy.brand || ''} onChange={e => handleServiceNestedChange('caseStudy', 'brand', e.target.value)} style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid var(--glass-border)',
                        background: '#fff'
                      }} />
                              </div>
                              <div className="admin-form-group">
                                <label>Sektör</label>
                                <input type="text" value={servicesData[editingServiceKey].caseStudy.industry || ''} onChange={e => handleServiceNestedChange('caseStudy', 'industry', e.target.value)} style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid var(--glass-border)',
                        background: '#fff'
                      }} />
                              </div>
                            </div>
                            <div className="admin-form-group">
                              <label>Zorluk (Problem)</label>
                              <textarea rows="3" value={servicesData[editingServiceKey].caseStudy.challenge || ''} onChange={e => handleServiceNestedChange('caseStudy', 'challenge', e.target.value)} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff',
                      fontFamily: 'sans-serif'
                    }}></textarea>
                            </div>
                            <div className="admin-form-group">
                              <label>Yol Haritamız (Çözüm)</label>
                              <textarea rows="3" value={servicesData[editingServiceKey].caseStudy.solution || ''} onChange={e => handleServiceNestedChange('caseStudy', 'solution', e.target.value)} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff',
                      fontFamily: 'sans-serif'
                    }}></textarea>
                            </div>
                            
                            <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '2rem',
                    marginBottom: '1rem',
                    borderTop: '1px solid var(--glass-border)',
                    paddingTop: '1.25rem'
                  }}>
                              <span style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--text-light)'
                    }}>Başarı Hikayesi Metrikleri</span>
                              <button type="button" onClick={handleAddMetric} className="btn btn-secondary" style={{
                      padding: '2px 8px',
                      fontSize: '0.75rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      cursor: 'pointer'
                    }}>
                                <i className="fa-solid fa-plus"></i> Metrik Ekle
                              </button>
                            </div>
                            <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '1rem'
                  }}>
                              {(servicesData[editingServiceKey].caseStudy.metrics || []).map((metric, idx) => <div key={idx} style={{
                      padding: '1rem',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '10px',
                      background: 'rgba(15, 23, 42, 0.01)',
                      position: 'relative',
                      boxShadow: '0 2px 6px rgba(15,23,42,0.01)'
                    }}>
                                  <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                                    <strong style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)'
                        }}>Metrik #{idx + 1}</strong>
                                    <button type="button" onClick={() => handleDeleteMetric(idx)} className="btn-icon btn-delete" style={{
                          padding: '2px 6px',
                          fontSize: '0.7rem',
                          cursor: 'pointer'
                        }} title="Metriği Sil">
                                      <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                  </div>
                                  <div className="admin-form-group" style={{
                        marginBottom: '0.6rem'
                      }}>
                                    <label style={{
                          fontSize: '0.7rem',
                          marginBottom: '2px'
                        }}>Etiket (Örn: Ciro Artışı)</label>
                                    <input type="text" value={metric.label || ''} onChange={e => handleMetricChange(idx, 'label', e.target.value)} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          border: '1px solid var(--glass-border)',
                          background: '#fff',
                          fontSize: '0.8rem'
                        }} />
                                  </div>
                                  <div className="admin-form-group" style={{
                        marginBottom: '0.6rem'
                      }}>
                                    <label style={{
                          fontSize: '0.7rem',
                          marginBottom: '2px'
                        }}>Değer (Örn: +320%)</label>
                                    <input type="text" value={metric.val || ''} onChange={e => handleMetricChange(idx, 'val', e.target.value)} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          border: '1px solid var(--glass-border)',
                          background: '#fff',
                          fontSize: '0.8rem'
                        }} />
                                  </div>
                                  <div className="admin-form-group" style={{
                        margin: 0
                      }}>
                                    <label style={{
                          fontSize: '0.7rem',
                          marginBottom: '2px'
                        }}>İkon (FontAwesome)</label>
                                    <input type="text" value={metric.icon || ''} onChange={e => handleMetricChange(idx, 'icon', e.target.value)} style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          border: '1px solid var(--glass-border)',
                          background: '#fff',
                          fontSize: '0.8rem'
                        }} placeholder="fa-solid fa-chart-line" />
                                  </div>
                                </div>)}
                            </div>
                          </div> : <div style={{
                  textAlign: 'center',
                  padding: '3rem',
                  border: '1px dashed var(--glass-border)',
                  borderRadius: '12px',
                  color: 'var(--text-muted)'
                }}>
                            Bu hizmete ait bir vaka analizi oluşturulmamış.
                          </div>}
                      </div>}

                    {/* Testimonial */}
                    {activeServiceEditSection === 'testimonial' && <div>
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
                          <i className="fa-solid fa-comment-dots" style={{
                    color: 'var(--primary)'
                  }}></i> Hizmete Özel Müşteri Yorumu
                        </h4>
                        <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.25rem'
                }}>
                          Bu hizmetle ilgili müşterilerinizden aldığınız olumlu geribildirimi detay sayfasında göstermek üzere ayarlayın.
                        </p>
                        {servicesData[editingServiceKey].testimonial ? <div>
                            <div className="admin-form-row">
                              <div className="admin-form-group">
                                <label>Müşteri Ad Soyad</label>
                                <input type="text" value={servicesData[editingServiceKey].testimonial.name || ''} onChange={e => handleServiceNestedChange('testimonial', 'name', e.target.value)} style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid var(--glass-border)',
                        background: '#fff'
                      }} />
                              </div>
                              <div className="admin-form-group">
                                <label>Şirket Adı</label>
                                <input type="text" value={servicesData[editingServiceKey].testimonial.company || ''} onChange={e => handleServiceNestedChange('testimonial', 'company', e.target.value)} style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid var(--glass-border)',
                        background: '#fff'
                      }} />
                              </div>
                            </div>
                            <div className="admin-form-row">
                              <div className="admin-form-group">
                                <label>Görev / Unvan</label>
                                <input type="text" value={servicesData[editingServiceKey].testimonial.role || ''} onChange={e => handleServiceNestedChange('testimonial', 'role', e.target.value)} style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid var(--glass-border)',
                        background: '#fff'
                      }} />
                              </div>
                              <div className="admin-form-group">
                                <label>Puan (1-5)</label>
                                <select value={servicesData[editingServiceKey].testimonial.rating || 5} onChange={e => handleServiceNestedChange('testimonial', 'rating', parseInt(e.target.value))} style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid var(--glass-border)',
                        background: '#fff'
                      }}>
                                  <option value="5">5 Yıldız</option>
                                  <option value="4">4 Yıldız</option>
                                  <option value="3">3 Yıldız</option>
                                </select>
                              </div>
                            </div>
                            <div className="admin-form-group" style={{
                    margin: 0
                  }}>
                              <label>Yorum Metni</label>
                              <textarea rows="4" value={servicesData[editingServiceKey].testimonial.quote || ''} onChange={e => handleServiceNestedChange('testimonial', 'quote', e.target.value)} style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff',
                      fontFamily: 'sans-serif',
                      lineHeight: '1.4'
                    }}></textarea>
                            </div>
                          </div> : <div style={{
                  textAlign: 'center',
                  padding: '3rem',
                  border: '1px dashed var(--glass-border)',
                  borderRadius: '12px',
                  color: 'var(--text-muted)'
                }}>
                            Bu hizmete ait bir yorum oluşturulmamış.
                          </div>}
                      </div>}

                    {/* FAQs List */}
                    {activeServiceEditSection === 'faqs' && <div>
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
                            <i className="fa-solid fa-circle-question" style={{
                      color: 'var(--primary)'
                    }}></i> Sıkça Sorulan Sorular (SSS)
                          </h4>
                          <button type="button" onClick={handleAddFaq} className="btn btn-secondary" style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    borderRadius: '6px'
                  }}>
                            <i className="fa-solid fa-plus"></i> Soru Ekle
                          </button>
                        </div>
                        <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.25rem'
                }}>
                          Potansiyel müşterilerin kafasındaki soru işaretlerini gidermek için sıkça sorulan soruları ekleyin.
                        </p>
                        <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}>
                          {(servicesData[editingServiceKey].faqs || []).map((faq, idx) => <div key={idx} style={{
                    padding: '1.25rem',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.01)',
                    boxShadow: '0 2px 6px rgba(15,23,42,0.01)'
                  }}>
                              <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      borderBottom: '1px solid rgba(15,23,42,0.05)',
                      paddingBottom: '0.5rem'
                    }}>
                                <strong style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-light)'
                      }}>Soru #{idx + 1}</strong>
                                <button type="button" onClick={() => handleDeleteFaq(idx)} className="btn-icon btn-delete" style={{
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }} title="Soruyu Sil">
                                  <i className="fa-solid fa-trash-can"></i> Sil
                                </button>
                              </div>
                              <div className="admin-form-group">
                                <label style={{
                        fontSize: '0.75rem'
                      }}>Soru Metni</label>
                                <input type="text" value={faq.q || ''} onChange={e => handleFaqChange(idx, 'q', e.target.value)} style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid var(--glass-border)',
                        background: '#fff'
                      }} placeholder="Örn: Raporlama sıklığı nedir?" />
                              </div>
                              <div className="admin-form-group" style={{
                      margin: 0
                    }}>
                                <label style={{
                        fontSize: '0.75rem'
                      }}>Cevap Metni</label>
                                <textarea rows="3" value={faq.a || ''} onChange={e => handleFaqChange(idx, 'a', e.target.value)} style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid var(--glass-border)',
                        background: '#fff',
                        fontFamily: 'sans-serif',
                        lineHeight: '1.4'
                      }} placeholder="Örn: Haftalık detaylı raporlar ve aylık görüntülü analiz toplantısı gerçekleştiriyoruz."></textarea>
                              </div>
                            </div>)}
                          {(servicesData[editingServiceKey].faqs || []).length === 0 && <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    border: '1px dashed var(--glass-border)',
                    borderRadius: '8px',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem'
                  }}>
                              Henüz soru eklenmemiş. Yukarıdan yeni bir soru ekleyin.
                            </div>}
                        </div>
                      </div>}

                    {/* SEO Settings */}
                    {activeServiceEditSection === 'seo' && <div>
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
                          <i className="fa-solid fa-magnifying-glass" style={{
                    color: 'var(--primary)'
                  }}></i> Hizmete Özel SEO ve Meta Etiket Ayarları
                        </h4>
                        <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.25rem'
                }}>
                          Arama motorlarında bu hizmet sayfasının bulunabilirliğini ve tıklama oranlarını yükseltmek üzere özelleştirilmiş meta etiketleri belirleyin.
                        </p>
                        <div className="admin-form-group">
                          <label>Meta Başlığı (Title)</label>
                          <input type="text" value={servicesData[editingServiceKey].seo_title || ''} onChange={e => handleServiceFieldChange('seo_title', e.target.value)} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff'
                  }} placeholder={`${servicesData[editingServiceKey].title} | Ajans Rota`} />
                        </div>
                        <div className="admin-form-group">
                          <label>Meta Açıklaması (Description)</label>
                          <textarea rows="4" value={servicesData[editingServiceKey].seo_description || ''} onChange={e => handleServiceFieldChange('seo_description', e.target.value)} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff',
                    fontFamily: 'sans-serif',
                    lineHeight: '1.4'
                  }} placeholder="Ziyaretçileri arama motoru sonuçlarından çekebilmek için 150-160 karakterlik bir özet yazın."></textarea>
                        </div>
                        <div className="admin-form-group" style={{
                  margin: 0
                }}>
                          <label>Meta Anahtar Kelimeler (Keywords)</label>
                          <input type="text" value={servicesData[editingServiceKey].seo_keywords || ''} onChange={e => handleServiceFieldChange('seo_keywords', e.target.value)} style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff'
                  }} placeholder="Örn: google ads ajansı izmir, profesyonel reklam, izmir seo..." />
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
                </form>}
            </div>
  );
}
