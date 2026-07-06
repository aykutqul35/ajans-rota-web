import { useState } from 'react';

export default function AcademyTab({ academyCoursesData, setAcademyCoursesData, onSave }) {
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleEdit = (course) => {
    setEditingId(course.id);
    setEditFormData(course);
  };

  const handleSave = () => {
    const newData = academyCoursesData.map(c => 
      c.id === editingId ? { ...c, ...editFormData } : c
    );
    setAcademyCoursesData(newData);
    setEditingId(null);
    onSave(newData);
  };

  const handleChange = (e, field) => {
    setEditFormData({ ...editFormData, [field]: e.target.value });
  };

  return (
    <div className="tab-pane active" id="academy-tab">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2><i className="fa-solid fa-graduation-cap"></i> Akademi Eğitimleri (Masterclass)</h2>
      </div>
      
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Buradan Akademi sayfasındaki Başlangıç, Orta ve İleri seviye Masterclass eğitimlerinizin fiyatlarını, başlıklarını ve temel detaylarını güncelleyebilirsiniz.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {(academyCoursesData || []).map(course => (
          <div key={course.id} style={{
            background: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            {editingId === course.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px' }}>Eğitim Başlığı</label>
                    <input type="text" value={editFormData.title} onChange={(e) => handleChange(e, 'title')} style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#f8fafc', color: '#1e293b'
                    }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px' }}>Fiyat (₺)</label>
                    <input type="text" value={editFormData.price} onChange={(e) => handleChange(e, 'price')} style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#f8fafc', color: '#1e293b'
                    }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px' }}>Süre / Saat</label>
                    <input type="text" value={editFormData.duration} onChange={(e) => handleChange(e, 'duration')} style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#f8fafc', color: '#1e293b'
                    }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px' }}>Seviye Metni</label>
                    <input type="text" value={editFormData.level} onChange={(e) => handleChange(e, 'level')} style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#f8fafc', color: '#1e293b'
                    }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px' }}>Hedef Kitle / Açıklama</label>
                  <textarea value={editFormData.targetAudience} onChange={(e) => handleChange(e, 'targetAudience')} rows="8" style={{
                    width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#f8fafc', color: '#1e293b', resize: 'vertical'
                  }}></textarea>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn btn-primary" onClick={handleSave} style={{ borderRadius: '8px' }}>
                    <i className="fa-solid fa-save"></i> Kaydet
                  </button>
                  <button className="btn btn-secondary" onClick={() => setEditingId(null)} style={{ borderRadius: '8px' }}>
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: `${course.color}20`, color: course.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                      <i className={course.icon}></i>
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>{course.title}</h3>
                      <span style={{ fontSize: '0.8rem', color: course.color, fontWeight: '700' }}>{course.level}</span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '1.5rem', color: '#334155', fontSize: '0.9rem' }}>
                    <div>
                      <strong style={{ color: '#64748b', display: 'block', marginBottom: '4px', fontSize: '0.75rem', textTransform: 'uppercase' }}>Fiyat</strong>
                      {course.price}
                    </div>
                    <div>
                      <strong style={{ color: '#64748b', display: 'block', marginBottom: '4px', fontSize: '0.75rem', textTransform: 'uppercase' }}>Süre</strong>
                      {course.duration}
                    </div>
                    <div>
                      <strong style={{ color: '#64748b', display: 'block', marginBottom: '4px', fontSize: '0.75rem', textTransform: 'uppercase' }}>Popüler Mi?</strong>
                      {course.popular ? <span style={{color:'#22c55e'}}><i className="fa-solid fa-check"></i> Evet</span> : <span style={{color:'#64748b'}}>-</span>}
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem', color: '#475569', fontSize: '0.9rem' }}>
                    <strong style={{ color: '#64748b', display: 'block', marginBottom: '4px', fontSize: '0.75rem', textTransform: 'uppercase' }}>Açıklama</strong>
                    {course.targetAudience}
                  </div>
                </div>
                <button className="btn btn-secondary" onClick={() => handleEdit(course)} style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}>
                  <i className="fa-solid fa-pen"></i> Düzenle
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
