import { useState } from 'react';

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

  const getDeptBadge = (dept) => {
    if (dept === 'management') return 'bg-pink-400/15 text-pink-400';
    if (dept === 'performance') return 'bg-cyan-400/15 text-cyan-500';
    return 'bg-purple-500/15 text-purple-600';
  };
  const getDeptLabel = (dept) => {
    if (dept === 'management') return 'Yönetim';
    if (dept === 'performance') return 'Performans & SEO';
    return 'Kreatif & Tasarım';
  };

  return (
              <div>
              <div className="admin-section-title">
                Blog Yazarları
                <button onClick={() => openEditModal('team', 'new')} className="btn btn-primary px-3.5 py-1.5 text-xs">
                  <i className="fa-solid fa-plus mr-1.5"></i> Yeni Üye Ekle
                </button>
              </div>

              {/* Filter controls */}
              <div className="flex gap-4 mb-6 flex-wrap">
                <div className="flex-1 min-w-[200px] relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"></i>
                  <input type="text" placeholder="İsim, unvan veya biyografi ara..." value={teamSearchQuery} onChange={e => setTeamSearchQuery(e.target.value)} className="w-full py-2.5 pl-9 pr-2.5 rounded-md border border-glass-border text-sm focus:border-primary outline-none transition-colors" />
                </div>
                <div className="w-[200px]">
                  <select value={teamDeptFilter} onChange={e => setTeamDeptFilter(e.target.value)} className="w-full py-2.5 px-2.5 rounded-md border border-glass-border text-sm bg-white focus:border-primary outline-none transition-colors">
                    <option value="all">Tüm Departmanlar</option>
                    <option value="management">Yönetim</option>
                    <option value="performance">Performans & SEO</option>
                    <option value="creative">Kreatif & Tasarım</option>
                  </select>
                </div>
                {(teamSearchQuery !== '' || teamDeptFilter !== 'all') && <button onClick={() => {
              setTeamSearchQuery('');
              setTeamDeptFilter('all');
            }} className="btn btn-secondary py-2.5 px-5 text-sm rounded-md">
                    Temizle
                  </button>}
              </div>

              {teamSearchQuery === '' && teamDeptFilter === 'all' ? <div className="text-xs text-text-muted mb-5">
                  <i className="fa-solid fa-circle-info"></i> Üyelerin Hakkımızda/Ekiplerimiz sayfasındaki sırasını değiştirmek için ok işaretlerini kullanabilirsiniz.
                </div> : <div className="text-xs text-primary mb-5 font-medium">
                  <i className="fa-solid fa-circle-info"></i> Sıralama yapmak için önce aktif filtreleri temizleyin.
                </div>}

              <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-5 mb-10">
                {teamMembersData.filter(item => {
              const matchesSearch = (item.name || "").toLowerCase().includes(teamSearchQuery.toLowerCase()) || (item.role || "").toLowerCase().includes(teamSearchQuery.toLowerCase()) || (item.desc || "").toLowerCase().includes(teamSearchQuery.toLowerCase());
              const matchesDept = teamDeptFilter === 'all' || item.dept === teamDeptFilter;
              return matchesSearch && matchesDept;
            }).map(item => {
              const originalIndex = teamMembersData.findIndex(member => member.name === item.name);
              return <div key={item.name} className="glass-card p-5 flex flex-col gap-3.5 relative border border-glass-border rounded-xl bg-white/40">
                      
                      <div className="flex gap-4 items-center">
                        <div className="w-[46px] h-[46px] rounded-full text-white flex items-center justify-center font-bold text-base shadow-sm" style={{ background: item.gradient || 'linear-gradient(135deg, #00ebd6, #00b4d8)' }}>
                          {item.init}
                        </div>
                        <div className="flex-1">
                          <h4 className="m-0 text-sm text-text-light font-bold">{item.name}</h4>
                          <span className="text-xs text-primary font-semibold">{item.role}</span>
                        </div>
                      </div>

                      <div className="flex gap-1.5 flex-wrap">
                        <span className={`text-[0.7rem] px-2 py-0.5 rounded-full font-semibold ${getDeptBadge(item.dept)}`}>
                          {getDeptLabel(item.dept)}
                        </span>
                        <span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-slate-900/5 text-text-muted font-semibold">
                          {item.exp}
                        </span>
                      </div>

                      <p className="text-xs text-text-muted m-0 leading-snug line-clamp-2 h-[2.8em] overflow-hidden">
                        {item.desc}
                      </p>

                      <div className="flex gap-0.5 text-amber-400 text-xs">
                        {Array.from({
                    length: item.stars || 5
                  }).map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                      </div>

                      <div className="border-t border-slate-900/5 my-1"></div>

                      <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                          {teamSearchQuery === '' && teamDeptFilter === 'all' ? <>
                              <button type="button" onClick={() => moveTeamMember(originalIndex, 'up')} disabled={originalIndex === 0} className={`w-7 h-7 border border-glass-border bg-white rounded flex items-center justify-center ${originalIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:border-primary'} transition-colors`} title="Yukarı Taşı">
                                <i className="fa-solid fa-chevron-up text-xs"></i>
                              </button>
                              <button type="button" onClick={() => moveTeamMember(originalIndex, 'down')} disabled={originalIndex === teamMembersData.length - 1} className={`w-7 h-7 border border-glass-border bg-white rounded flex items-center justify-center ${originalIndex === teamMembersData.length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:border-primary'} transition-colors`} title="Aşağı Taşı">
                                <i className="fa-solid fa-chevron-down text-xs"></i>
                              </button>
                            </> : null}
                        </div>

                        <div className="flex gap-1.5">
                          <button type="button" onClick={() => openEditModal('team', item)} className="btn btn-secondary px-2.5 py-1 text-xs rounded bg-white flex items-center gap-1 hover:border-primary transition-colors" title="Düzenle">
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button type="button" onClick={() => handleDeleteItem('team', item)} className="btn btn-secondary px-2.5 py-1 text-xs rounded text-red-500 border-red-500/15 bg-red-500/[0.04] flex items-center gap-1 hover:bg-red-500/10 transition-colors" title="Sil">
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
          }).length === 0 && <div className="text-center py-12 px-4 bg-slate-900/[0.02] rounded-lg border border-dashed border-glass-border">
                  <i className="fa-solid fa-user-slash text-4xl text-text-muted mb-4 block"></i>
                  <h4 className="m-0 mb-2 text-text-light">Kriterlere uygun ekip üyesi bulunamadı</h4>
                  <p className="m-0 text-sm text-text-muted">Filtreleri sıfırlayarak tekrar aramayı deneyebilirsiniz.</p>
                </div>}
            </div>
  );
}
