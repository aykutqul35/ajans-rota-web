import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AIEngineTab({ authToken }) {
  const [logs, setLogs] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    client_id: '',
    platform: 'google', // google, meta, seo
    action_type: 'daily_optimization',
    description: '',
    campaign_name: '',
    metric_focus: '',
    old_value: '',
    new_value: '',
    status: 'ONAY BEKLİYOR' // ONAY BEKLİYOR, OTONOM UYGULANDI, ONAYLANDI
  });

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/ai/logs');
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      }
    } catch (err) {
      console.error('Fetch logs error', err);
    }
  };

  const fetchClients = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/admin/clients', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setClients(data.data);
      }
    } catch (err) {
      console.error('Fetch clients error', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchLogs(), fetchClients()]);
      setIsLoading(false);
    };
    loadData();
  }, [authToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client_id || !formData.description) {
      toast.error('Lütfen zorunlu alanları (Müşteri ve Açıklama) doldurun.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        client_id: formData.client_id,
        platform: formData.platform,
        action_type: formData.action_type,
        description: formData.description,
        details: {
          campaign_name: formData.campaign_name,
          metric_focus: formData.metric_focus,
          old_value: formData.old_value,
          new_value: formData.new_value,
          status: formData.status
        }
      };

      const res = await fetch('/api/ai/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Yapay Zeka logu başarıyla gönderildi.');
        setFormData(prev => ({
          ...prev,
          description: '',
          campaign_name: '',
          metric_focus: '',
          old_value: '',
          new_value: ''
        }));
        fetchLogs();
      } else {
        toast.error('Gönderim hatası: ' + data.error);
      }
    } catch (err) {
      toast.error('Sunucu bağlantı hatası.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu logu silmek istediğinize emin misiniz? Müşteri panelinden de kaldırılacaktır.')) {
      return;
    }

    try {
      const res = await fetch(`/api/ai/logs?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Log başarıyla silindi.');
        fetchLogs();
      } else {
        toast.error('Silme hatası: ' + data.error);
      }
    } catch (err) {
      toast.error('Sunucu bağlantı hatası.');
    }
  };

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}><i className="fa-solid fa-spinner fa-spin"></i> Yükleniyor...</div>;
  }

  return (
    <div className="admin-tab-content">
      <div className="admin-tab-header">
        <h2><i className="fa-solid fa-microchip"></i> ROTA AI Motoru Yönetimi</h2>
        <p>Müşterilere manuel veya otonom AI aksiyonları gönderin, mevcut logları izleyin ve yönetin.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Form Alanı */}
        <div style={{ background: '#0f172a', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#f1f5f9', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
            Yeni Aksiyon Gönder
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Hedef Müşteri *</label>
              <select name="client_id" value={formData.client_id} onChange={handleInputChange} style={inputStyle} required>
                <option value="">-- Müşteri Seçin --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.brandName || c.email}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Platform</label>
                <select name="platform" value={formData.platform} onChange={handleInputChange} style={inputStyle}>
                  <option value="google">Google Ads</option>
                  <option value="meta">Meta Ads</option>
                  <option value="seo">SEO</option>
                  <option value="system">Sistem</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Aksiyon Tipi</label>
                <select name="action_type" value={formData.action_type} onChange={handleInputChange} style={inputStyle}>
                  <option value="daily_optimization">Günlük Optimizasyon</option>
                  <option value="anomaly_detection">Anomali Tespiti</option>
                  <option value="budget_increase">Bütçe Artırımı</option>
                  <option value="campaign_paused">Kampanya Durdurma</option>
                  <option value="new_campaign_suggestion">Yeni Kampanya Önerisi</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Açıklama *</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
                placeholder="Müşteriye gösterilecek AI tespit açıklaması..."
                required
              />
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase' }}>Detay Metrikleri (Opsiyonel)</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Kampanya / Alan Adı</label>
                  <input type="text" name="campaign_name" value={formData.campaign_name} onChange={handleInputChange} style={inputStyle} placeholder="Örn: PMax - Tüm Ürünler" />
                </div>
                <div>
                  <label style={labelStyle}>Metrik Odak</label>
                  <input type="text" name="metric_focus" value={formData.metric_focus} onChange={handleInputChange} style={inputStyle} placeholder="Örn: ROAS (Hedef: %350)" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Önceki Değer</label>
                  <input type="text" name="old_value" value={formData.old_value} onChange={handleInputChange} style={inputStyle} placeholder="Örn: 5.000 ₺ / gün" />
                </div>
                <div>
                  <label style={labelStyle}>Yeni Değer</label>
                  <input type="text" name="new_value" value={formData.new_value} onChange={handleInputChange} style={inputStyle} placeholder="Örn: 6.000 ₺ / gün" />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Aksiyon Durumu</label>
                <select name="status" value={formData.status} onChange={handleInputChange} style={{ ...inputStyle, background: 'rgba(15, 23, 42, 0.8)' }}>
                  <option value="ONAY BEKLİYOR">ONAY BEKLİYOR (Müşteri onayı gerekir)</option>
                  <option value="OTONOM UYGULANDI">OTONOM UYGULANDI (Sistem kendi uyguladı)</option>
                  <option value="ONAYLANDI">ONAYLANDI (Manuel olarak onaylandı)</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #2dd4bf 100%)',
              color: '#fff',
              border: 'none',
              padding: '0.8rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              marginTop: '0.5rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
              {isSubmitting ? 'Gönderiliyor...' : 'Yapay Zeka Aksiyonunu Gönder'}
            </button>
          </form>
        </div>

        {/* Liste Alanı */}
        <div style={{ background: '#0f172a', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#f1f5f9', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
            Gönderilmiş Loglar
          </h3>
          
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '600px', paddingRight: '0.5rem' }} className="admin-custom-scrollbar">
            {logs.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>Henüz AI logu bulunmuyor.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {logs.map(log => {
                  let detailsObj = {};
                  try {
                    detailsObj = typeof log.details === 'string' ? JSON.parse(log.details) : (log.details || {});
                  } catch(e) {}

                  return (
                    <div key={log.id} style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      padding: '1rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>
                          {log.brand_name || 'Silinmiş Müşteri'}
                        </span>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {new Date(log.action_time).toLocaleString('tr-TR')}
                          </span>
                          <button 
                            onClick={() => handleDelete(log.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}
                            title="Sil"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: '0 0 0.5rem 0' }}>{log.description}</p>
                      
                      {detailsObj.status && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{log.platform.toUpperCase()} - {log.action_type}</span>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            fontWeight: 800, 
                            padding: '0.3rem 0.6rem', 
                            borderRadius: '4px', 
                            background: (detailsObj.status === 'OTONOM UYGULANDI' || detailsObj.status === 'ONAYLANDI') ? 'rgba(16,185,129,0.1)' : 'rgba(234,179,8,0.1)',
                            color: (detailsObj.status === 'OTONOM UYGULANDI' || detailsObj.status === 'ONAYLANDI') ? '#10b981' : '#eab308',
                          }}>
                            {detailsObj.status}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#94a3b8',
  marginBottom: '0.4rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#f1f5f9',
  fontSize: '0.9rem',
  fontFamily: 'inherit'
};
