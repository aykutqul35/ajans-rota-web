export default function AdminHeader({ handleSaveAll, isSaving, handleLogoutClick }) {
  return (
    <div className="flex justify-between items-center bg-white/2 border-b border-glass py-5 px-6 md:px-10 sticky top-0 z-[100] backdrop-blur-md">
      <h1 className="text-xl font-bold text-textLight">
        Ajans Rota <span className="font-normal text-textMuted ml-1.5 hidden sm:inline-block">Yönetim ve Kontrol Paneli</span>
      </h1>
      <div className="flex items-center gap-3">
        <button onClick={handleSaveAll} className="btn btn-primary flex items-center gap-2 py-2 px-4 shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all" disabled={isSaving}>
          <i className="fa-solid fa-save"></i>
          {isSaving ? 'Kaydediliyor...' : <span className="hidden sm:inline">Değişiklikleri Kaydet</span>}
        </button>

        <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary flex items-center gap-2 py-2 px-4 bg-white/5 border border-glass hover:bg-white/10 text-textLight no-underline transition-colors rounded-lg">
          <i className="fa-solid fa-up-right-from-square text-[13px]"></i>
          <span className="hidden sm:inline">Siteyi Görüntüle</span>
        </a>
        <button onClick={handleLogoutClick} className="btn btn-secondary flex items-center gap-2 py-2 px-4 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 transition-colors rounded-lg">
          <i className="fa-solid fa-right-from-bracket text-[13px]"></i>
          <span className="hidden sm:inline">Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
}
