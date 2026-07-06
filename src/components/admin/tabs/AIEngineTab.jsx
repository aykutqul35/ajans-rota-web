import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AIEngineTab({ authToken, clientReports }) {
  const [logs, setLogs] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    client_id: '',
    platform: 'google',
    action_type: 'daily_optimization',
    description: '',
    campaign_name: '',
    metric_focus: '',
    old_value: '',
    new_value: '',
    status: 'ONAY BEKLİYOR'
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
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}><i className="fa-solid fa-spinner fa-spin"></i> Yükleniyor...</div>;
  }

  // Birleştirilmiş müşteri listesi (API + clientReports Mock datası)
  // Kullanıcı "müşteri listesini çek" dediğinde hem veritabanındaki hem de rapordaki müşterileri görmek istiyor olabilir.
  const combinedClients = [];
  const addedIds = new Set();
  
  clients.forEach(c => {
    combinedClients.push({ id: c.id, name: c.brandName || c.email });
    addedIds.add(c.id);
  });

  if (clientReports) {
    Object.keys(clientReports).forEach(key => {
      const cr = clientReports[key];
      if (cr.client_id && !addedIds.has(cr.client_id)) {
        combinedClients.push({ id: cr.client_id, name: cr.brandName || cr.name || key });
        addedIds.add(cr.client_id);
      } else if (!cr.client_id && !addedIds.has(key)) {
        // Mock veri için ID olarak key kullanalım (Eğer veritabanı c_ ile başlamayanları kabul ediyorsa, gerçi logs tablosu string bekliyor)
        combinedClients.push({ id: key, name: cr.brandName || cr.name || key });
        addedIds.add(key);
      }
    });
  }

  return (
    <div>
      <div className="admin-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>ROTA AI Motoru Yönetimi</span>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
        Müşterilere manuel veya otonom AI aksiyonları gönderin, mevcut logları izleyin ve yönetin. <br/>
        <strong style={{ color: 'var(--primary)' }}><i className="fa-solid fa-circle-info"></i> Not:</strong> Buradan gönderdiğiniz aksiyonlar müşterinizin şeffaflık sayfasında ("ROTA AI Motoru" alanında) görünür. Ancak bu işlemler Google/Meta sistemlerinde <strong>otomatik değişiklik yapmaz</strong>; müşteriyle güven bağı kurmak ve manuel yapılan işlemleri "yapay zeka tespit etti" formatında sunmak içindir.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Form Alanı */}
        <div style={{ 
          backgroundColor: 'rgba(15, 23, 42, 0.02)', 
          border: '1px solid var(--glass-border)', 
          borderRadius: '12px', 
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-light)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-paper-plane" style={{ color: 'var(--primary)' }}></i> Yeni Aksiyon Gönder
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Hedef Müşteri *</label>
              <select name="client_id" value={formData.client_id} onChange={handleInputChange} style={inputStyle} required>
                <option value="">-- Müşteri Seçin --</option>
                {combinedClients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
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
                style={{ ...inputStyle, minHeight: '250px', resize: 'vertical' }} 
                placeholder="Müşteriye gösterilecek AI tespit açıklaması..."
                required
              />
            </div>

            <div style={{ 
              background: 'rgba(15, 23, 42, 0.03)', 
              padding: '1rem', 
              borderRadius: '8px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem',
              border: '1px solid var(--glass-border)'
            }}>
              <h4 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Detay Metrikleri (Opsiyonel)</h4>
              
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
                <select name="status" value={formData.status} onChange={handleInputChange} style={inputStyle}>
                  <option value="ONAY BEKLİYOR">ONAY BEKLİYOR (Müşteri onayı gerekir)</option>
                  <option value="OTONOM UYGULANDI">OTONOM UYGULANDI (Sistem kendi uyguladı)</option>
                  <option value="ONAYLANDI">ONAYLANDI (Manuel olarak onaylandı)</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              {isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-robot"></i>}
              {isSubmitting ? 'Gönderiliyor...' : 'Yapay Zeka Aksiyonunu Gönder'}
            </button>
          </form>
        </div>

        {/* Liste Alanı */}
        <div style={{ 
          backgroundColor: 'rgba(15, 23, 42, 0.02)', 
          border: '1px solid var(--glass-border)', 
          borderRadius: '12px', 
          padding: '1.5rem', 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-light)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-list-check" style={{ color: 'var(--secondary)' }}></i> Gönderilmiş Loglar
          </h3>
          
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '600px', paddingRight: '0.5rem' }} className="admin-custom-scrollbar">
            {logs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-box-open" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                <p>Henüz AI logu bulunmuyor.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {logs.map(log => {
                  let detailsObj = {};
                  try {
                    detailsObj = typeof log.details === 'string' ? JSON.parse(log.details) : (log.details || {});
                  } catch(e) {}

                  // İstemci adını bulmaya çalışalım
                  let clientNameDisplay = log.brand_name;
                  if (!clientNameDisplay && combinedClients.length > 0) {
                    const matchedClient = combinedClients.find(c => c.id === log.client_id);
                    if (matchedClient) clientNameDisplay = matchedClient.name;
                  }

                  return (
                    <div key={log.id} style={{
                      backgroundColor: '#fff',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      padding: '1rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                          <i className="fa-solid fa-building" style={{ marginRight: '4px' }}></i>
                          {clientNameDisplay || log.client_id || 'Bilinmeyen Müşteri'}
                        </span>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <i className="fa-regular fa-clock" style={{ marginRight: '4px' }}></i>
                            {new Date(log.action_time).toLocaleString('tr-TR')}
                          </span>
                          <button 
                            onClick={() => handleDelete(log.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}
                            title="Sil"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </div>
                      
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: '0.5rem 0' }}>{log.description}</p>
                      
                      {detailsObj.status && (
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          marginTop: '0.75rem', 
                          paddingTop: '0.75rem', 
                          borderTop: '1px solid var(--glass-border)' 
                        }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                            <i className={`fa-brands fa-${log.platform === 'google' ? 'google' : log.platform === 'meta' ? 'meta' : 'searchengin'}`} style={{ marginRight: '4px' }}></i>
                            {log.platform.toUpperCase()} - {log.action_type.replace('_', ' ')}
                          </span>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            fontWeight: 700, 
                            padding: '0.3rem 0.6rem', 
                            borderRadius: '4px', 
                            background: (detailsObj.status === 'OTONOM UYGULANDI' || detailsObj.status === 'ONAYLANDI') ? 'rgba(16,185,129,0.1)' : 'rgba(234,179,8,0.1)',
                            color: (detailsObj.status === 'OTONOM UYGULANDI' || detailsObj.status === 'ONAYLANDI') ? '#10b981' : '#eab308',
                          }}>
                            {detailsObj.status === 'ONAY BEKLİYOR' && <i className="fa-solid fa-hourglass-half" style={{ marginRight: '4px' }}></i>}
                            {detailsObj.status === 'OTONOM UYGULANDI' && <i className="fa-solid fa-bolt" style={{ marginRight: '4px' }}></i>}
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
  color: 'var(--text-muted)',
  marginBottom: '0.4rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  background: '#fff',
  border: '1px solid var(--glass-border)',
  borderRadius: '8px',
  color: 'var(--text-dark)',
  fontSize: '0.85rem',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box'
};
