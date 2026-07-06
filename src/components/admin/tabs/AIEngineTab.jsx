import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AIEngineTab({ authToken, clientReports }) {
  const [logs, setLogs] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (data.success) setLogs(data.data);
    } catch (err) {
      console.error('Fetch logs error', err);
    }
  };

  const fetchClients = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/admin/clients', { headers: { 'Authorization': `Bearer ${authToken}` } });
      const data = await res.json();
      if (data.success) setClients(data.data);
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Yapay Zeka logu başarıyla gönderildi.');
        setFormData(prev => ({ ...prev, description: '', campaign_name: '', metric_focus: '', old_value: '', new_value: '' }));
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
    if (!window.confirm('Bu logu silmek istediğinize emin misiniz? Müşteri panelinden de kaldırılacaktır.')) return;
    try {
      const res = await fetch(`/api/ai/logs?id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${authToken}` } });
      const data = await res.json();
      if (data.success) { toast.success('Log başarıyla silindi.'); fetchLogs(); }
      else { toast.error('Silme hatası: ' + data.error); }
    } catch (err) { toast.error('Sunucu bağlantı hatası.'); }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-text-light"><i className="fa-solid fa-spinner fa-spin"></i> Yükleniyor...</div>;
  }

  const combinedClients = [];
  const addedIds = new Set();
  clients.forEach(c => { combinedClients.push({ id: c.id, name: c.brandName || c.email }); addedIds.add(c.id); });
  if (clientReports) {
    Object.keys(clientReports).forEach(key => {
      const cr = clientReports[key];
      if (cr.client_id && !addedIds.has(cr.client_id)) { combinedClients.push({ id: cr.client_id, name: cr.brandName || cr.name || key }); addedIds.add(cr.client_id); }
      else if (!cr.client_id && !addedIds.has(key)) { combinedClients.push({ id: key, name: cr.brandName || cr.name || key }); addedIds.add(key); }
    });
  }

  const inputCls = "w-full p-3 bg-white border border-glass-border rounded-lg text-text-light text-sm font-inherit outline-none focus:border-primary transition-colors";
  const labelCls = "block text-xs font-semibold text-text-muted mb-1.5";

  const getStatusClasses = (status) => {
    if (status === 'OTONOM UYGULANDI' || status === 'ONAYLANDI') return 'bg-emerald-500/10 text-emerald-500';
    return 'bg-yellow-500/10 text-yellow-500';
  };

  return (
    <div>
      <div className="admin-section-title flex justify-between items-center">
        <span>ROTA AI Motoru Yönetimi</span>
      </div>
      <p className="text-text-muted text-sm mb-6 -mt-2">
        Müşterilere manuel veya otonom AI aksiyonları gönderin, mevcut logları izleyin ve yönetin. <br/>
        <strong className="text-primary"><i className="fa-solid fa-circle-info"></i> Not:</strong> Buradan gönderdiğiniz aksiyonlar müşterinizin şeffaflık sayfasında ("ROTA AI Motoru" alanında) görünür. Ancak bu işlemler Google/Meta sistemlerinde <strong>otomatik değişiklik yapmaz</strong>; müşteriyle güven bağı kurmak ve manuel yapılan işlemleri "yapay zeka tespit etti" formatında sunmak içindir.
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-8">
        
        {/* Form Alanı */}
        <div className="bg-slate-900/[0.02] border border-glass-border rounded-xl p-6 flex flex-col">
          <h3 className="text-base text-text-light mb-6 flex items-center gap-2">
            <i className="fa-solid fa-paper-plane text-primary"></i> Yeni Aksiyon Gönder
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className={labelCls}>Hedef Müşteri *</label>
              <select name="client_id" value={formData.client_id} onChange={handleInputChange} className={inputCls} required>
                <option value="">-- Müşteri Seçin --</option>
                {combinedClients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Platform</label>
                <select name="platform" value={formData.platform} onChange={handleInputChange} className={inputCls}>
                  <option value="google">Google Ads</option>
                  <option value="meta">Meta Ads</option>
                  <option value="seo">SEO</option>
                  <option value="system">Sistem</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Aksiyon Tipi</label>
                <select name="action_type" value={formData.action_type} onChange={handleInputChange} className={inputCls}>
                  <option value="daily_optimization">Günlük Optimizasyon</option>
                  <option value="anomaly_detection">Anomali Tespiti</option>
                  <option value="budget_increase">Bütçe Artırımı</option>
                  <option value="campaign_paused">Kampanya Durdurma</option>
                  <option value="new_campaign_suggestion">Yeni Kampanya Önerisi</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Açıklama *</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                className={`${inputCls} min-h-[250px] resize-y`}
                placeholder="Müşteriye gösterilecek AI tespit açıklaması..."
                required
              />
            </div>

            <div className="bg-slate-900/[0.03] p-4 rounded-lg flex flex-col gap-4 border border-glass-border">
              <h4 className="m-0 text-xs text-text-muted uppercase">Detay Metrikleri (Opsiyonel)</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Kampanya / Alan Adı</label>
                  <input type="text" name="campaign_name" value={formData.campaign_name} onChange={handleInputChange} className={inputCls} placeholder="Örn: PMax - Tüm Ürünler" />
                </div>
                <div>
                  <label className={labelCls}>Metrik Odak</label>
                  <input type="text" name="metric_focus" value={formData.metric_focus} onChange={handleInputChange} className={inputCls} placeholder="Örn: ROAS (Hedef: %350)" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Önceki Değer</label>
                  <input type="text" name="old_value" value={formData.old_value} onChange={handleInputChange} className={inputCls} placeholder="Örn: 5.000 ₺ / gün" />
                </div>
                <div>
                  <label className={labelCls}>Yeni Değer</label>
                  <input type="text" name="new_value" value={formData.new_value} onChange={handleInputChange} className={inputCls} placeholder="Örn: 6.000 ₺ / gün" />
                </div>
              </div>

              <div>
                <label className={labelCls}>Aksiyon Durumu</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className={inputCls}>
                  <option value="ONAY BEKLİYOR">ONAY BEKLİYOR (Müşteri onayı gerekir)</option>
                  <option value="OTONOM UYGULANDI">OTONOM UYGULANDI (Sistem kendi uyguladı)</option>
                  <option value="ONAYLANDI">ONAYLANDI (Manuel olarak onaylandı)</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-2 flex justify-center items-center gap-2">
              {isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-robot"></i>}
              {isSubmitting ? 'Gönderiliyor...' : 'Yapay Zeka Aksiyonunu Gönder'}
            </button>
          </form>
        </div>

        {/* Liste Alanı */}
        <div className="bg-slate-900/[0.02] border border-glass-border rounded-xl p-6 flex flex-col">
          <h3 className="text-base text-text-light mb-6 flex items-center gap-2">
            <i className="fa-solid fa-list-check text-secondary"></i> Gönderilmiş Loglar
          </h3>
          
          <div className="flex-1 overflow-y-auto max-h-[600px] pr-2 admin-custom-scrollbar">
            {logs.length === 0 ? (
              <div className="text-center py-12 px-4 text-text-muted">
                <i className="fa-solid fa-box-open text-3xl mb-4 opacity-50 block"></i>
                <p>Henüz AI logu bulunmuyor.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {logs.map(log => {
                  let detailsObj = {};
                  try { detailsObj = typeof log.details === 'string' ? JSON.parse(log.details) : (log.details || {}); } catch(e) {}

                  let clientNameDisplay = log.brand_name;
                  if (!clientNameDisplay && combinedClients.length > 0) {
                    const matchedClient = combinedClients.find(c => c.id === log.client_id);
                    if (matchedClient) clientNameDisplay = matchedClient.name;
                  }

                  return (
                    <div key={log.id} className="bg-white border border-glass-border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-primary font-semibold">
                          <i className="fa-solid fa-building mr-1"></i>
                          {clientNameDisplay || log.client_id || 'Bilinmeyen Müşteri'}
                        </span>
                        <div className="flex gap-4 items-center">
                          <span className="text-xs text-text-muted">
                            <i className="fa-regular fa-clock mr-1"></i>
                            {new Date(log.action_time).toLocaleString('tr-TR')}
                          </span>
                          <button 
                            onClick={() => handleDelete(log.id)}
                            className="bg-transparent border-none text-red-500 cursor-pointer p-0.5 hover:text-red-700 transition-colors"
                            title="Sil"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-text-light my-2">{log.description}</p>
                      
                      {detailsObj.status && (
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-glass-border">
                          <span className="text-xs text-text-muted font-medium">
                            <i className={`fa-brands fa-${log.platform === 'google' ? 'google' : log.platform === 'meta' ? 'meta' : 'searchengin'} mr-1`}></i>
                            {log.platform.toUpperCase()} - {log.action_type.replace('_', ' ')}
                          </span>
                          <span className={`text-[0.7rem] font-bold px-2.5 py-1 rounded ${getStatusClasses(detailsObj.status)}`}>
                            {detailsObj.status === 'ONAY BEKLİYOR' && <i className="fa-solid fa-hourglass-half mr-1"></i>}
                            {detailsObj.status === 'OTONOM UYGULANDI' && <i className="fa-solid fa-bolt mr-1"></i>}
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
