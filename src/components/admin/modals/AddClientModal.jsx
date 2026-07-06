import toast from 'react-hot-toast';

export default function AddClientModal({
  isAddClientModalOpen, setIsAddClientModalOpen,
  newClientFormData, setNewClientFormData,
  clientReports, setClientReports, setEditingReportBrand
}) {
  if (!isAddClientModalOpen) return null;

  const inputCls = "w-full py-3 px-3 rounded-lg border border-black/10 bg-white text-slate-900 outline-none focus:border-primary transition-colors";
  const labelCls = "block mb-2 text-sm text-slate-900 font-semibold";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[9999]">
      <div className="bg-gradient-to-br from-white to-slate-50 border border-black/5 rounded-3xl w-[95%] max-w-[600px] shadow-2xl overflow-hidden animate-[modalSlideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="py-7 px-7 border-b border-black/5 flex justify-between items-center bg-white/80">
          <div>
            <h3 className="m-0 text-xl text-slate-900 flex items-center gap-2 font-bold"><i className="fa-solid fa-building-user text-primary bg-primary-glow p-2 rounded-lg"></i> Yeni Müşteri & Proje Ekle</h3>
            <p className="mt-1 mb-0 text-sm text-text-muted">Müşteri portalı ve raporlama ekranı için hesap oluşturun.</p>
          </div>
          <button type="button" onClick={() => setIsAddClientModalOpen(false)} className="bg-black/5 border-none w-9 h-9 rounded-full text-slate-500 cursor-pointer flex items-center justify-center transition-colors hover:bg-black/10" title="Kapat"><i className="fa-solid fa-times"></i></button>
        </div>

        <form onSubmit={async (e) => {
          e.preventDefault();
          const { code, name, username, password, industry, logoUrl } = newClientFormData;
          if (!code || !name || !username || !password) { toast.error("Lütfen zorunlu alanları doldurun."); return; }
          const cleanCode = code.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
          if (!cleanCode) { toast.error("Geçersiz firma kodu!"); return; }
          if (clientReports[cleanCode]) { toast.error("Bu firma kodu sistemde zaten mevcut!"); return; }
          const newReportData = {
            username, password, brandName: name, industry: industry || "E-Ticaret & Dijital Pazarlama", logoUrl: logoUrl || "",
            kpis: [{ label: "Harcanan Bütçe", value: "0 TL", change: "%0 geçen ay", icon: "fa-solid fa-wallet", color: "var(--primary)" }, { label: "Toplam Dönüşüm", value: "0", change: "%0 geçen ay", icon: "fa-solid fa-cart-shopping", color: "var(--secondary)" }, { label: "Performans Oranı (ROAS)", value: "0x", change: "Hedef: 1.0x", icon: "fa-solid fa-arrow-trend-up", color: "#16a34a" }, { label: "Toplam Ciro / Getiri", value: "0 TL", change: "%0 geçen ay", icon: "fa-solid fa-turkish-lira-sign", color: "var(--primary)" }],
            googleAds: [{ name: "PMax - Arama Ağı", spend: "0 TL", clicks: "0", ctr: "0.0%", conversions: "0", roas: "1.0x" }],
            metaAds: [{ name: "Feed - Dönüşüm Reklamları", spend: "0 TL", clicks: "0", ctr: "0.0%", conversions: "0", roas: "1.0x", status: "Aktif" }],
            seo: [{ keyword: "anahtar kelime", rank: "1. Sıra", volume: "100", monthlyClicks: "0", trend: "stable" }],
            timeline: [{ date: new Date().toLocaleDateString('tr-TR'), title: "Müşteri Hesabı Oluşturuldu", desc: "Ajans şeffaf performans raporlama hesabı başarıyla aktif edildi.", author: "Sistem" }]
          };
          const loadingToast = toast.loading("Veritabanına ekleniyor...");
          try {
            const response = await fetch('/api/admin/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clerkId: cleanCode, brandName: name, email: username, reportData: newReportData }) });
            const data = await response.json();
            if (data.success) {
              const updated = { ...clientReports }; newReportData.client_id = data.data.id; newReportData.clerkId = data.data.clerkId; updated[cleanCode] = newReportData;
              setClientReports(updated); setEditingReportBrand(cleanCode); setIsAddClientModalOpen(false);
              setNewClientFormData({ code: '', name: '', username: '', password: '', industry: '', logoUrl: '' });
              toast.success("Müşteri başarıyla eklendi!", { id: loadingToast });
            } else toast.error("Ekleme başarısız: " + data.error, { id: loadingToast });
          } catch { toast.error("Sunucu bağlantı hatası!", { id: loadingToast }); }
        }}>
          <div className="py-7 px-7 flex flex-col gap-5 max-h-[60vh] overflow-y-auto">
            <div className="bg-slate-50 p-4 rounded-xl border border-black/[0.03]">
              <h4 className="m-0 mb-4 text-sm text-slate-500 font-semibold flex items-center gap-2"><i className="fa-solid fa-briefcase"></i> Firma Detayları</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className={labelCls}>Firma / Marka Adı *</label><input type="text" className={inputCls} placeholder="Örn: Ege Naturel A.Ş." value={newClientFormData.name || ''} onChange={e => setNewClientFormData({...newClientFormData, name: e.target.value})} required /></div>
                <div><label className={labelCls}>Sistem Kodu (URL) *</label><input type="text" className={inputCls} placeholder="Örn: ege-naturel" value={newClientFormData.code || ''} onChange={e => setNewClientFormData({...newClientFormData, code: e.target.value})} required /><small className="text-text-muted text-[0.7rem] mt-1 block">Boşluksuz ve Türkçe karaktersiz giriniz.</small></div>
                <div><label className={labelCls}>Endüstri / Sektör</label><input type="text" className={inputCls} placeholder="Örn: E-Ticaret" value={newClientFormData.industry || ''} onChange={e => setNewClientFormData({...newClientFormData, industry: e.target.value})} /></div>
                <div className="col-span-2"><label className={labelCls}>Logo URL (Opsiyonel)</label><input type="url" className={inputCls} placeholder="https://ornek.com/logo.png" value={newClientFormData.logoUrl || ''} onChange={e => setNewClientFormData({...newClientFormData, logoUrl: e.target.value})} /></div>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-black/[0.03]">
              <h4 className="m-0 mb-4 text-sm text-slate-500 font-semibold flex items-center gap-2"><i className="fa-solid fa-lock"></i> Müşteri Portalı Erişimi</h4>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Kullanıcı Adı *</label><input type="text" className={inputCls} placeholder="Kullanıcı adı girin" value={newClientFormData.username || ''} onChange={e => setNewClientFormData({...newClientFormData, username: e.target.value})} required /></div>
                <div><label className={labelCls}>Geçici Şifre *</label><input type="text" className={inputCls} placeholder="Güçlü bir şifre girin" value={newClientFormData.password || ''} onChange={e => setNewClientFormData({...newClientFormData, password: e.target.value})} required /></div>
              </div>
            </div>
          </div>
          <div className="py-5 px-7 border-t border-black/5 flex justify-end gap-4 bg-slate-50">
            <button type="button" onClick={() => setIsAddClientModalOpen(false)} className="py-3 px-6 rounded-lg border border-black/10 bg-white text-slate-500 cursor-pointer font-semibold text-sm transition-all hover:bg-slate-100">Vazgeç</button>
            <button type="submit" className="py-3 px-6 rounded-lg border-none bg-gradient-to-br from-primary to-secondary text-white cursor-pointer font-semibold shadow-[0_4px_15px_rgba(2,132,199,0.4)] transition-all text-sm hover:shadow-lg">Projeyi Oluştur</button>
          </div>
        </form>
      </div>
    </div>
  );
}
