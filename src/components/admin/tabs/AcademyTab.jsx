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

  const inputClasses = "w-full p-3 rounded-lg border border-glass-border bg-bg-deep text-text-light focus:border-primary outline-none transition-colors";

  return (
    <div className="tab-pane active" id="academy-tab">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-text-light flex items-center gap-3">
          <i className="fa-solid fa-graduation-cap"></i> Akademi Eğitimleri (Masterclass)
        </h2>
      </div>
      
      <p className="text-text-muted mb-8">
        Buradan Akademi sayfasındaki Başlangıç, Orta ve İleri seviye Masterclass eğitimlerinizin fiyatlarını, başlıklarını ve temel detaylarını güncelleyebilirsiniz.
      </p>

      <div className="grid gap-6">
        {(academyCoursesData || []).map(course => (
          <div key={course.id} className="bg-white border border-glass-border rounded-xl p-6">
            {editingId === course.id ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-muted mb-1">Eğitim Başlığı</label>
                    <input type="text" value={editFormData.title} onChange={(e) => handleChange(e, 'title')} className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-sm text-text-muted mb-1">Fiyat (₺)</label>
                    <input type="text" value={editFormData.price} onChange={(e) => handleChange(e, 'price')} className={inputClasses} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-muted mb-1">Süre / Saat</label>
                    <input type="text" value={editFormData.duration} onChange={(e) => handleChange(e, 'duration')} className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-sm text-text-muted mb-1">Seviye Metni</label>
                    <input type="text" value={editFormData.level} onChange={(e) => handleChange(e, 'level')} className={inputClasses} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-1">Hedef Kitle / Açıklama</label>
                  <textarea value={editFormData.targetAudience} onChange={(e) => handleChange(e, 'targetAudience')} rows="8" className={`${inputClasses} resize-y`}></textarea>
                </div>
                
                <div className="flex gap-4 mt-4">
                  <button className="btn btn-primary rounded-lg" onClick={handleSave}>
                    <i className="fa-solid fa-save"></i> Kaydet
                  </button>
                  <button className="btn btn-secondary rounded-lg" onClick={() => setEditingId(null)}>
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: `${course.color}20`, color: course.color }}>
                      <i className={course.icon}></i>
                    </div>
                    <div>
                      <h3 className="m-0 text-xl text-text-light">{course.title}</h3>
                      <span className="text-xs font-bold" style={{ color: course.color }}>{course.level}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-8 mt-6 text-text-main text-sm">
                    <div>
                      <strong className="block mb-1 text-xs text-text-muted uppercase">Fiyat</strong>
                      {course.price}
                    </div>
                    <div>
                      <strong className="block mb-1 text-xs text-text-muted uppercase">Süre</strong>
                      {course.duration}
                    </div>
                    <div>
                      <strong className="block mb-1 text-xs text-text-muted uppercase">Popüler Mi?</strong>
                      {course.popular ? <span className="text-green-500"><i className="fa-solid fa-check"></i> Evet</span> : <span className="text-text-muted">-</span>}
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-text-main">
                    <strong className="block mb-1 text-xs text-text-muted uppercase">Açıklama</strong>
                    {course.targetAudience}
                  </div>
                </div>
                <button className="btn btn-secondary px-4 py-2 rounded-lg" onClick={() => handleEdit(course)}>
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
