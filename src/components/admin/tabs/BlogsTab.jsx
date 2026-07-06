import { useState } from 'react';

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
                <button onClick={() => openEditModal('blog', 'new')} className="btn btn-primary px-3.5 py-1.5 text-xs">
                  <i className="fa-solid fa-plus mr-1.5"></i> Yeni Yazı Ekle
                </button>
              </div>

              {/* Filters */}
              <div className="flex gap-4 mb-6 flex-wrap">
                <input type="text" placeholder="Başlık veya yazar ara..." value={blogSearch} onChange={e => setBlogSearch(e.target.value)} className="flex-1 min-w-[200px] py-2.5 px-4 rounded-lg border border-glass-border bg-white text-sm focus:border-primary outline-none transition-colors" />
                <select value={blogCatFilter} onChange={e => setBlogCatFilter(e.target.value)} className="py-2.5 px-4 rounded-lg border border-glass-border bg-white text-sm min-w-[150px] focus:border-primary outline-none transition-colors">
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
                return <div className="text-center py-12 px-4 bg-slate-900/[0.02] rounded-lg border border-dashed border-glass-border">
                        <i className="fa-solid fa-folder-open text-4xl text-text-muted mb-4 block"></i>
                        <h4 className="m-0 mb-2 text-text-light">Aranan kriterlerde blog yazısı bulunamadı</h4>
                        <p className="m-0 text-sm text-text-muted">Filtreleri değiştirmeyi veya yeni bir yazı eklemeyi deneyebilirsiniz.</p>
                      </div>;
              }
              return <>
                      <div className="text-xs text-text-muted mb-2 flex justify-between">
                        <span>Toplam {filteredBlogs.length} yazı listeleniyor</span>
                        <span>Sayfa {blogCurrentPage} / {totalBlogPages || 1}</span>
                      </div>
                      
                      {currentBlogs.map(item => <div key={item.id} className="admin-item-row flex justify-between items-center px-4 py-3 border-b border-glass-border bg-white/40 rounded-md mb-2">
                          <div className="admin-item-info">
                            <h4 className="m-0 mb-1 text-[0.95rem] text-text-light">{item.title} <span className="text-xs font-normal text-text-muted">({item.date} - {item.author})</span></h4>
                            <span className="text-xs text-text-muted">Kategori: {item.category.toUpperCase()} | Okuma Süresi: {item.readTime}</span>
                          </div>
                          <div className="admin-action-btns flex gap-1.5">
                            <button onClick={() => openEditModal('blog', item)} className="w-8 h-8 border border-glass-border rounded-md bg-white cursor-pointer flex items-center justify-center hover:border-primary transition-colors" title="Düzenle">
                              <i className="fa-solid fa-pen-to-square text-primary text-sm"></i>
                            </button>
                            <button onClick={() => handleDeleteItem('blog', item)} className="w-8 h-8 border border-red-200 rounded-md bg-white cursor-pointer flex items-center justify-center hover:bg-red-50 transition-colors" title="Sil">
                              <i className="fa-solid fa-trash text-red-500 text-sm"></i>
                            </button>
                          </div>
                        </div>)}

                      {totalBlogPages > 1 && <div className="flex justify-center items-center gap-3 mt-6 py-2">
                          <button type="button" disabled={blogCurrentPage === 1} onClick={() => setBlogCurrentPage(prev => Math.max(prev - 1, 1))} className={`btn px-3.5 py-1.5 text-xs rounded-md border border-glass-border bg-white flex items-center gap-1 transition-all ${blogCurrentPage === 1 ? 'opacity-50 cursor-not-allowed text-text-muted' : 'cursor-pointer text-text-light hover:border-primary'}`}>
                            <i className="fa-solid fa-chevron-left text-[0.7rem]"></i> Önceki
                          </button>
                          
                          <div className="flex gap-1">
                            {Array.from({
                      length: totalBlogPages
                    }).map((_, i) => {
                      const pageNum = i + 1;
                      const isCurrent = pageNum === blogCurrentPage;
                      return <button key={pageNum} type="button" onClick={() => setBlogCurrentPage(pageNum)} className={`w-8 h-8 rounded-md border font-semibold text-xs cursor-pointer transition-all ${isCurrent ? 'border-primary bg-primary text-white' : 'border-glass-border bg-white text-text-light hover:border-primary'}`}>
                                  {pageNum}
                                </button>;
                    })}
                          </div>

                          <button type="button" disabled={blogCurrentPage === totalBlogPages} onClick={() => setBlogCurrentPage(prev => Math.min(prev + 1, totalBlogPages))} className={`btn px-3.5 py-1.5 text-xs rounded-md border border-glass-border bg-white flex items-center gap-1 transition-all ${blogCurrentPage === totalBlogPages ? 'opacity-50 cursor-not-allowed text-text-muted' : 'cursor-pointer text-text-light hover:border-primary'}`}>
                            Sonraki <i className="fa-solid fa-chevron-right text-[0.7rem]"></i>
                          </button>
                        </div>}
                    </>;
            })()}
              </div>
            </div>
  );
}
