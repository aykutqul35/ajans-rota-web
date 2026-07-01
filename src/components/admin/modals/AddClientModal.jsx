import React from 'react';
import toast from 'react-hot-toast';

export default function AddClientModal({
  isAddClientModalOpen,
  setIsAddClientModalOpen,
  newClientFormData,
  setNewClientFormData,
  clientReports,
  setClientReports,
  setEditingReportBrand
}) {
  if (!isAddClientModalOpen) return null;

  return (
    <div className="lead-modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div className="lead-modal" style={{
        background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
        border: '1px solid rgba(0,0,0,0.05)',
        borderRadius: '24px', width: '95%', maxWidth: '600px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden',
        animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div className="lead-modal-header" style={{
          padding: '1.75rem', borderBottom: '1px solid rgba(0,0,0,0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(255,255,255,0.8)'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <i className="fa-solid fa-building-user" style={{ color: 'var(--primary)', background: 'var(--primary-glow)', padding: '0.5rem', borderRadius: '8px' }}></i> Yeni Müşteri & Proje Ekle
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Müşteri portalı ve raporlama ekranı için hesap oluşturun.</p>
          </div>
          <button type="button" onClick={() => setIsAddClientModalOpen(false)} style={{
            background: 'rgba(0,0,0,0.05)', border: 'none', width: '36px', height: '36px',
            borderRadius: '50%', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s'
          }} title="Kapat">
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={async (e) => {
          e.preventDefault();
          const { code, name, username, password, industry, logoUrl } = newClientFormData;
          if (!code || !name || !username || !password) {
            toast.error("Lütfen zorunlu alanları doldurun.");
            return;
          }
          const cleanCode = code.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
          if (!cleanCode) {
            toast.error("Geçersiz firma kodu! Sadece küçük harf ve rakam kullanın.");
            return;
          }
          if (clientReports[cleanCode]) {
            toast.error("Bu firma kodu sistemde zaten mevcut!");
            return;
          }
          
          const newReportData = {
            username: username,
            password: password,
            brandName: name,
            industry: industry || "E-Ticaret & Dijital Pazarlama",
            logoUrl: logoUrl || "",
            kpis: [{
              label: "Harcanan Bütçe", value: "0 TL", change: "%0 geçen ay", icon: "fa-solid fa-wallet", color: "var(--primary)"
            }, {
              label: "Toplam Dönüşüm", value: "0", change: "%0 geçen ay", icon: "fa-solid fa-cart-shopping", color: "var(--secondary)"
            }, {
              label: "Performans Oranı (ROAS)", value: "0x", change: "Hedef: 1.0x", icon: "fa-solid fa-arrow-trend-up", color: "#16a34a"
            }, {
              label: "Toplam Ciro / Getiri", value: "0 TL", change: "%0 geçen ay", icon: "fa-solid fa-turkish-lira-sign", color: "var(--primary)"
            }],
            googleAds: [{ name: "PMax - Arama Ağı", spend: "0 TL", clicks: "0", ctr: "0.0%", conversions: "0", roas: "1.0x" }],
            metaAds: [{ name: "Feed - Dönüşüm Reklamları", spend: "0 TL", clicks: "0", ctr: "0.0%", conversions: "0", roas: "1.0x", status: "Aktif" }],
            seo: [{ keyword: "anahtar kelime", rank: "1. Sıra", volume: "100", monthlyClicks: "0", trend: "stable" }],
            timeline: [{ date: new Date().toLocaleDateString('tr-TR'), title: "Müşteri Hesabı Oluşturuldu", desc: "Ajans şeffaf performans raporlama hesabı başarıyla aktif edildi.", author: "Sistem" }]
          };

          const loadingToast = toast.loading("Veritabanına ekleniyor...");
          try {
            const response = await fetch('/api/admin/clients', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                clerkId: cleanCode, // We use the code as clerkId for local auth
                brandName: name,
                email: username,
                reportData: newReportData
              })
            });
            const data = await response.json();
            
            if (data.success) {
              const updated = { ...clientReports };
              newReportData.client_id = data.data.id;
              newReportData.clerkId = data.data.clerkId;
              updated[cleanCode] = newReportData;
              setClientReports(updated);
              setEditingReportBrand(cleanCode);
              setIsAddClientModalOpen(false);
              setNewClientFormData({ code: '', name: '', username: '', password: '', industry: '', logoUrl: '' });
              toast.success("Müşteri veritabanına başarıyla eklendi!", { id: loadingToast });
            } else {
              toast.error("Ekleme başarısız: " + data.error, { id: loadingToast });
            }
          } catch (err) {
            toast.error("Sunucu bağlantı hatası!", { id: loadingToast });
          }
        }}>
          <div className="lead-modal-body" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '60vh', overflowY: 'auto' }}>
            
            {/* Firma Bilgileri */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.03)' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fa-solid fa-briefcase"></i> Firma Detayları
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>Firma / Marka Adı *</label>
                  <input type="text" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: '#0f172a', outline: 'none' }} placeholder="Örn: Ege Naturel A.Ş." value={newClientFormData.name || ''} onChange={(e) => setNewClientFormData({...newClientFormData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>Sistem Kodu (URL) *</label>
                  <input type="text" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: '#0f172a', outline: 'none' }} placeholder="Örn: ege-naturel" value={newClientFormData.code || ''} onChange={(e) => setNewClientFormData({...newClientFormData, code: e.target.value})} required />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '0.25rem', display: 'block' }}>Boşluksuz ve Türkçe karaktersiz giriniz.</small>
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>Endüstri / Sektör</label>
                  <input type="text" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: '#0f172a', outline: 'none' }} placeholder="Örn: E-Ticaret" value={newClientFormData.industry || ''} onChange={(e) => setNewClientFormData({...newClientFormData, industry: e.target.value})} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>Logo URL (Opsiyonel)</label>
                  <input type="url" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: '#0f172a', outline: 'none' }} placeholder="https://ornek.com/logo.png" value={newClientFormData.logoUrl || ''} onChange={(e) => setNewClientFormData({...newClientFormData, logoUrl: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Müşteri Portalı Giriş */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.03)' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fa-solid fa-lock"></i> Müşteri Portalı Erişimi
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>Kullanıcı Adı *</label>
                  <input type="text" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: '#0f172a', outline: 'none' }} placeholder="Kullanıcı adı girin" value={newClientFormData.username || ''} onChange={(e) => setNewClientFormData({...newClientFormData, username: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>Geçici Şifre *</label>
                  <input type="text" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: '#0f172a', outline: 'none' }} placeholder="Güçlü bir şifre girin" value={newClientFormData.password || ''} onChange={(e) => setNewClientFormData({...newClientFormData, password: e.target.value})} required />
                </div>
              </div>
            </div>

          </div>
          <div className="lead-modal-footer" style={{
            padding: '1.25rem 1.75rem', borderTop: '1px solid rgba(0,0,0,0.05)',
            display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: '#f8fafc'
          }}>
            <button type="button" onClick={() => setIsAddClientModalOpen(false)} style={{
              padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)',
              background: '#ffffff', color: '#475569', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s',
              fontSize: '0.9rem'
            }}>Vazgeç</button>
            <button type="submit" style={{
              padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff', cursor: 'pointer', fontWeight: 600,
              boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)', transition: 'all 0.2s', fontSize: '0.9rem'
            }}>Projeyi Oluştur</button>
          </div>
        </form>
      </div>
    </div>
  );
}
