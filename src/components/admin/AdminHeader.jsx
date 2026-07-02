
export default function AdminHeader({ handleSaveAll, isSaving, handleLogoutClick }) {
  return (
    <div className="admin-dashboard-header">
      <h1>
        Ajans Rota <span>Yönetim ve Kontrol Paneli</span>
      </h1>
      <div className="admin-header-actions">
        <button onClick={handleSaveAll} className="btn btn-primary" disabled={isSaving}>
          <i className="fa-solid fa-save" style={{ marginRight: '8px' }}></i>
          {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>

        <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none'
        }}>
          <i className="fa-solid fa-up-right-from-square"></i>
          Siteyi Görüntüle
        </a>
        <button onClick={handleLogoutClick} className="btn btn-secondary">
          <i className="fa-solid fa-right-from-bracket" style={{ marginRight: '8px' }}></i>
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}
