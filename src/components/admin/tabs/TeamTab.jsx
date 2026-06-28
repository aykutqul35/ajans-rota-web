import React, { useState } from 'react';

export default function TeamTab({
  teamMembersData, setTeamMembersData, 
  openEditModal, handleDeleteItem
}) {
const [teamSearchQuery, setTeamSearchQuery] = useState('');

const [teamDeptFilter, setTeamDeptFilter] = useState('all');

  const moveTeamMember = (index, direction) => {
    const newMembers = [...teamMembersData];
    if (direction === 'up' && index > 0) {
      const temp = newMembers[index];
      newMembers[index] = newMembers[index - 1];
      newMembers[index - 1] = temp;
    } else if (direction === 'down' && index < newMembers.length - 1) {
      const temp = newMembers[index];
      newMembers[index] = newMembers[index + 1];
      newMembers[index + 1] = temp;
    }
    setTeamMembersData(newMembers);
  };
  return (
              <div>
              <div className="admin-section-title">
                Ajans Ekip Üyeleri
                <button onClick={() => openEditModal('team', 'new')} className="btn btn-primary" style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem'
            }}>
                  <i className="fa-solid fa-plus" style={{
                marginRight: '6px'
              }}></i> Yeni Üye Ekle
                </button>
              </div>

              {/* Filter controls */}
              <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap'
          }}>
                <div style={{
              flex: 1,
              minWidth: '200px',
              position: 'relative'
            }}>
                  <i className="fa-solid fa-magnifying-glass" style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}></i>
                  <input type="text" placeholder="İsim, unvan veya biyografi ara..." value={teamSearchQuery} onChange={e => setTeamSearchQuery(e.target.value)} style={{
                width: '100%',
                padding: '0.6rem 0.6rem 0.6rem 2.2rem',
                borderRadius: '6px',
                border: '1px solid var(--glass-border)',
                fontSize: '0.85rem'
              }} />
                </div>
                <div style={{
              width: '200px'
            }}>
                  <select value={teamDeptFilter} onChange={e => setTeamDeptFilter(e.target.value)} style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: '6px',
                border: '1px solid var(--glass-border)',
                fontSize: '0.85rem',
                background: '#fff'
              }}>
                    <option value="all">Tüm Departmanlar</option>
                    <option value="management">Yönetim</option>
                    <option value="performance">Performans & SEO</option>
                    <option value="creative">Kreatif & Tasarım</option>
                  </select>
                </div>
                {(teamSearchQuery !== '' || teamDeptFilter !== 'all') && <button onClick={() => {
              setTeamSearchQuery('');
              setTeamDeptFilter('all');
            }} className="btn btn-secondary" style={{
              padding: '0.6rem 1.2rem',
              fontSize: '0.85rem',
              borderRadius: '6px'
            }}>
                    Temizle
                  </button>}
              </div>

              {teamSearchQuery === '' && teamDeptFilter === 'all' ? <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '1.25rem'
          }}>
                  <i className="fa-solid fa-circle-info"></i> Üyelerin Hakkımızda/Ekiplerimiz sayfasındaki sırasını değiştirmek için ok işaretlerini kullanabilirsiniz.
                </div> : <div style={{
            fontSize: '0.75rem',
            color: 'var(--primary)',
            marginBottom: '1.25rem',
            fontWeight: '500'
          }}>
                  <i className="fa-solid fa-circle-info"></i> Sıralama yapmak için önce aktif filtreleri temizleyin.
                </div>}

              <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem'
          }}>
                {teamMembersData.filter(item => {
              const matchesSearch = (item.name || "").toLowerCase().includes(teamSearchQuery.toLowerCase()) || (item.role || "").toLowerCase().includes(teamSearchQuery.toLowerCase()) || (item.desc || "").toLowerCase().includes(teamSearchQuery.toLowerCase());
              const matchesDept = teamDeptFilter === 'all' || item.dept === teamDeptFilter;
              return matchesSearch && matchesDept;
            }).map(item => {
              const originalIndex = teamMembersData.findIndex(member => member.name === item.name);
              return <div key={item.name} className="glass-card" style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                position: 'relative',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.4)'
              }}>
                      
                      <div style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center'
                }}>
                        <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: item.gradient || 'linear-gradient(135deg, #00ebd6, #00b4d8)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                          {item.init}
                        </div>
                        <div style={{
                    flex: 1
                  }}>
                          <h4 style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      color: 'var(--text-light)',
                      fontWeight: '700'
                    }}>{item.name}</h4>
                          <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--primary)',
                      fontWeight: '600'
                    }}>{item.role}</span>
                        </div>
                      </div>

                      <div style={{
                  display: 'flex',
                  gap: '6px',
                  flexWrap: 'wrap'
                }}>
                        <span style={{
                    fontSize: '0.7rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '100px',
                    fontWeight: '600',
                    background: item.dept === 'management' ? 'rgba(255, 117, 140, 0.15)' : item.dept === 'performance' ? 'rgba(0, 235, 214, 0.15)' : 'rgba(123, 44, 191, 0.15)',
                    color: item.dept === 'management' ? '#ff758c' : item.dept === 'performance' ? '#00b4d8' : '#7b2cbf'
                  }}>
                          {item.dept === 'management' ? 'Yönetim' : item.dept === 'performance' ? 'Performans & SEO' : 'Kreatif & Tasarım'}
                        </span>
                        <span style={{
                    fontSize: '0.7rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '100px',
                    background: 'rgba(15, 23, 42, 0.05)',
                    color: 'var(--text-muted)',
                    fontWeight: '600'
                  }}>
                          {item.exp}
                        </span>
                      </div>

                      <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  margin: 0,
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  height: '2.8em'
                }}>
                        {item.desc}
                      </p>

                      <div style={{
                  display: 'flex',
                  gap: '3px',
                  color: '#ffb703',
                  fontSize: '0.8rem'
                }}>
                        {Array.from({
                    length: item.stars || 5
                  }).map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                      </div>

                      <div style={{
                  borderTop: '1px solid rgba(15, 23, 42, 0.05)',
                  margin: '0.25rem 0'
                }}></div>

                      <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                        <div style={{
                    display: 'flex',
                    gap: '4px'
                  }}>
                          {teamSearchQuery === '' && teamDeptFilter === 'all' ? <>
                              <button type="button" onClick={() => moveTeamMember(originalIndex, 'up')} disabled={originalIndex === 0} className="btn-icon" style={{
                        width: '28px',
                        height: '28px',
                        opacity: originalIndex === 0 ? 0.3 : 1,
                        cursor: originalIndex === 0 ? 'not-allowed' : 'pointer',
                        border: '1px solid var(--glass-border)',
                        background: '#fff',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }} title="Yukarı Taşı">
                                <i className="fa-solid fa-chevron-up" style={{
                          fontSize: '0.75rem'
                        }}></i>
                              </button>
                              <button type="button" onClick={() => moveTeamMember(originalIndex, 'down')} disabled={originalIndex === teamMembersData.length - 1} className="btn-icon" style={{
                        width: '28px',
                        height: '28px',
                        opacity: originalIndex === teamMembersData.length - 1 ? 0.3 : 1,
                        cursor: originalIndex === teamMembersData.length - 1 ? 'not-allowed' : 'pointer',
                        border: '1px solid var(--glass-border)',
                        background: '#fff',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }} title="Aşağı Taşı">
                                <i className="fa-solid fa-chevron-down" style={{
                          fontSize: '0.75rem'
                        }}></i>
                              </button>
                            </> : null}
                        </div>

                        <div style={{
                    display: 'flex',
                    gap: '6px'
                  }}>
                          <button type="button" onClick={() => openEditModal('team', item)} className="btn btn-secondary" style={{
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.75rem',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: '#fff'
                    }} title="Düzenle">
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button type="button" onClick={() => handleDeleteItem('team', item)} className="btn btn-secondary" style={{
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.75rem',
                      borderRadius: '4px',
                      color: '#ef233c',
                      borderColor: 'rgba(239,35,60,0.15)',
                      background: 'rgba(239,35,60,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }} title="Sil">
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </div>

                    </div>;
            })}
              </div>

              {teamMembersData.filter(item => {
            const matchesSearch = (item.name || "").toLowerCase().includes(teamSearchQuery.toLowerCase()) || (item.role || "").toLowerCase().includes(teamSearchQuery.toLowerCase()) || (item.desc || "").toLowerCase().includes(teamSearchQuery.toLowerCase());
            const matchesDept = teamDeptFilter === 'all' || item.dept === teamDeptFilter;
            return matchesSearch && matchesDept;
          }).length === 0 && <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            background: 'rgba(15, 23, 42, 0.02)',
            borderRadius: '8px',
            border: '1px dashed var(--glass-border)'
          }}>
                  <i className="fa-solid fa-user-slash" style={{
              fontSize: '2.5rem',
              color: 'var(--text-muted)',
              marginBottom: '1rem'
            }}></i>
                  <h4 style={{
              margin: '0 0 0.5rem 0',
              color: 'var(--text-light)'
            }}>Kriterlere uygun ekip üyesi bulunamadı</h4>
                  <p style={{
              margin: 0,
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}>Filtreleri sıfırlayarak tekrar aramayı deneyebilirsiniz.</p>
                </div>}
            </div>
  );
}
