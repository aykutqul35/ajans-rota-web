import React, { useState } from 'react';

export default function BlogsTab({
  blogsData, openEditModal, handleDeleteItem
}) {
const [blogSearch, setBlogSearch] = useState('');
const [blogCatFilter, setBlogCatFilter] = useState('all');
const [blogCurrentPage, setBlogCurrentPage] = useState(1);
  return (
              <div>
              <div className="admin-section-title">
                Blog Yazısı Paylaşımları
                <button onClick={() => openEditModal('blog', 'new')} className="btn btn-primary" style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem'
            }}>
                  <i className="fa-solid fa-plus" style={{
                marginRight: '6px'
              }}></i> Yeni Yazı Ekle
                </button>
              </div>

              {/* Filters */}
              <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap'
          }}>
                <input type="text" placeholder="Başlık veya yazar ara..." value={blogSearch} onChange={e => setBlogSearch(e.target.value)} style={{
              flex: 1,
              minWidth: '200px',
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)',
              background: '#fff',
              fontSize: '0.9rem'
            }} />
                <select value={blogCatFilter} onChange={e => setBlogCatFilter(e.target.value)} style={{
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)',
              background: '#fff',
              fontSize: '0.9rem',
              minWidth: '150px'
            }}>
                  <option value="all">Tüm Kategoriler</option>
                  <option value="google">Google Ads</option>
                  <option value="meta">Meta Ads</option>
                  <option value="seo">SEO &amp; İçerik</option>
                  <option value="social">Sosyal Medya</option>
                  <option value="ecommerce">E-Ticaret</option>
                  <option value="design">Web Tasarım</option>
                </select>
              </div>

              <div className="admin-item-list">
                {(() => {
              const filteredBlogs = blogsData.filter(item => {
                const matchQuery = (item.title || '').toLowerCase().includes(blogSearch.toLowerCase()) || (item.author || '').toLowerCase().includes(blogSearch.toLowerCase());
                const matchCat = blogCatFilter === 'all' || item.category === blogCatFilter;
                return matchQuery && matchCat;
              });
              const blogsPerPage = 8;
              const totalBlogPages = Math.ceil(filteredBlogs.length / blogsPerPage);
              const currentBlogs = filteredBlogs.slice((blogCurrentPage - 1) * blogsPerPage, blogCurrentPage * blogsPerPage);
              if (filteredBlogs.length === 0) {
                return <div style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  background: 'rgba(15, 23, 42, 0.02)',
                  borderRadius: '8px',
                  border: '1px dashed var(--glass-border)'
                }}>
                        <i className="fa-solid fa-folder-open" style={{
                    fontSize: '2.5rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1rem'
                  }}></i>
                        <h4 style={{
                    margin: '0 0 0.5rem 0',
                    color: 'var(--text-light)'
                  }}>Aranan kriterlerde blog yazısı bulunamadı</h4>
                        <p style={{
                    margin: 0,
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)'
                  }}>Filtreleri değiştirmeyi veya yeni bir yazı eklemeyi deneyebilirsiniz.</p>
                      </div>;
              }
              return <>
                      <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                        <span>Toplam {filteredBlogs.length} yazı listeleniyor</span>
                        <span>Sayfa {blogCurrentPage} / {totalBlogPages || 1}</span>
                      </div>
                      
                      {currentBlogs.map(item => <div key={item.id} className="admin-item-row" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.4)',
                  borderRadius: '6px',
                  marginBottom: '0.5rem'
                }}>
                          <div className="admin-item-info">
                            <h4 style={{
                      margin: '0 0 0.25rem 0',
                      fontSize: '0.95rem',
                      color: 'var(--text-light)'
                    }}>{item.title} <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 'normal',
                        color: 'var(--text-muted)'
                      }}>({item.date} - {item.author})</span></h4>
                            <span style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)'
                    }}>Kategori: {item.category.toUpperCase()} | Okuma Süresi: {item.readTime}</span>
                          </div>
                          <div className="admin-action-btns" style={{
                    display: 'flex',
                    gap: '6px'
                  }}>
                            <button onClick={() => openEditModal('blog', item)} className="btn-icon" title="Düzenle" style={{
                      width: '32px',
                      height: '32px',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '6px',
                      background: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                              <i className="fa-solid fa-pen-to-square" style={{
                        color: 'var(--primary)',
                        fontSize: '0.85rem'
                      }}></i>
                            </button>
                            <button onClick={() => handleDeleteItem('blog', item)} className="btn-icon btn-delete" title="Sil" style={{
                      width: '32px',
                      height: '32px',
                      border: '1px solid #fee2e2',
                      borderRadius: '6px',
                      background: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                              <i className="fa-solid fa-trash" style={{
                        color: '#ef4444',
                        fontSize: '0.85rem'
                      }}></i>
                            </button>
                          </div>
                        </div>)}

                      {totalBlogPages > 1 && <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginTop: '1.5rem',
                  padding: '0.5rem 0'
                }}>
                          <button type="button" disabled={blogCurrentPage === 1} onClick={() => setBlogCurrentPage(prev => Math.max(prev - 1, 1))} className="btn" style={{
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff',
                    cursor: blogCurrentPage === 1 ? 'not-allowed' : 'pointer',
                    color: blogCurrentPage === 1 ? 'var(--text-muted)' : 'var(--text-light)',
                    opacity: blogCurrentPage === 1 ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                            <i className="fa-solid fa-chevron-left" style={{
                      fontSize: '0.7rem'
                    }}></i> Önceki
                          </button>
                          
                          <div style={{
                    display: 'flex',
                    gap: '4px'
                  }}>
                            {Array.from({
                      length: totalBlogPages
                    }).map((_, i) => {
                      const pageNum = i + 1;
                      const isCurrent = pageNum === blogCurrentPage;
                      return <button key={pageNum} type="button" onClick={() => setBlogCurrentPage(pageNum)} style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        border: isCurrent ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                        background: isCurrent ? 'var(--primary)' : '#fff',
                        color: isCurrent ? '#fff' : 'var(--text-light)',
                        fontWeight: '600',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}>
                                  {pageNum}
                                </button>;
                    })}
                          </div>

                          <button type="button" disabled={blogCurrentPage === totalBlogPages} onClick={() => setBlogCurrentPage(prev => Math.min(prev + 1, totalBlogPages))} className="btn" style={{
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff',
                    cursor: blogCurrentPage === totalBlogPages ? 'not-allowed' : 'pointer',
                    color: blogCurrentPage === totalBlogPages ? 'var(--text-muted)' : 'var(--text-light)',
                    opacity: blogCurrentPage === totalBlogPages ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                            Sonraki <i className="fa-solid fa-chevron-right" style={{
                      fontSize: '0.7rem'
                    }}></i>
                          </button>
                        </div>}
                    </>;
            })()}
              </div>
            </div>
  );
}
