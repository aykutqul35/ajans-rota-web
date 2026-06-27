const fs = require('fs');
let code = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

// 1. Fix Sidebar
const sidebarStart = `          <div className={\`client-os-nav-item \${activeTab === 'overview' ? 'active' : ''}\`} onClick={() => setActiveTab('overview')}>
             <i className="fa-solid fa-chart-pie"></i> Genel Bakış
          </div>
          <div className={\`client-os-nav-item \${activeTab === 'creatives' ? 'active' : ''}\`} onClick={() => setActiveTab('creatives')}>
             <i className="fa-solid fa-wand-magic-sparkles"></i> Kreatif Onayları
          </div>
          <div className={\`client-os-nav-item \${activeTab === 'vault' ? 'active' : ''}\`} onClick={() => setActiveTab('vault')}>
             <i className="fa-solid fa-vault"></i> Dosya Kasası
          </div>
          <div className={\`client-os-nav-item \${activeTab === 'api' ? 'active' : ''}\`} onClick={() => setActiveTab('api')}>
             <i className="fa-solid fa-plug"></i> API Entegrasyonu
          </div>
          <div className={\`client-os-nav-item \${activeTab === 'strategy' ? 'active' : ''}\`} onClick={() => setActiveTab('strategy')}>
             <i className="fa-solid fa-map"></i> Strateji & Yol Haritası
          </div>
          <div className={\`client-os-nav-item \${activeTab === 'support' ? 'active' : ''}\`} onClick={() => setActiveTab('support')}>
             <i className="fa-solid fa-ticket"></i> Destek Talepleri
          </div>`;

const sidebarNew = `          <div className={\`client-os-nav-item \${activeTab === 'overview' ? 'active' : ''}\`} onClick={() => setActiveTab('overview')}>
             <i className="fa-solid fa-chart-pie"></i> Genel Bakış & Grafikler
          </div>
          <div className={\`client-os-nav-item \${activeTab === 'creatives' ? 'active' : ''}\`} onClick={() => setActiveTab('creatives')}>
             <i className="fa-solid fa-paint-roller"></i> Kreatif Onayları
          </div>
          <div className={\`client-os-nav-item \${activeTab === 'vault' ? 'active' : ''}\`} onClick={() => setActiveTab('vault')}>
             <i className="fa-solid fa-vault"></i> Dosya Kasam
          </div>
          <div className={\`client-os-nav-item \${activeTab === 'billing' ? 'active' : ''}\`} onClick={() => setActiveTab('billing')}>
             <i className="fa-solid fa-file-invoice-dollar"></i> Faturalar & Bütçe
          </div>
          <div className={\`client-os-nav-item \${activeTab === 'api' ? 'active' : ''}\`} onClick={() => setActiveTab('api')}>
             <i className="fa-solid fa-plug"></i> API Entegrasyonları
          </div>
          <div className={\`client-os-nav-item \${activeTab === 'strategy' ? 'active' : ''}\`} onClick={() => setActiveTab('strategy')}>
             <i className="fa-solid fa-map"></i> Strateji & Yol Haritası
          </div>
          <div className={\`client-os-nav-item \${activeTab === 'support' ? 'active' : ''}\`} onClick={() => setActiveTab('support')}>
             <i className="fa-solid fa-headset"></i> Destek Talepleri
          </div>`;

if (code.includes(sidebarStart)) {
  code = code.replace(sidebarStart, sidebarNew);
  console.log("Replaced Sidebar");
} else {
  console.log("Could not find sidebarStart");
}

// 2. Fix Top Nav (V2 Dashboard Tabs Navigation)
const navStart = `          {[
            { id: 'overview', label: 'Genel Bakış & Grafikler', icon: 'fa-solid fa-chart-pie' },
            { id: 'creatives', label: 'Kreatif Onayları', icon: 'fa-solid fa-paint-roller' },
            { id: 'vault', label: 'Dosya Kasam', icon: 'fa-solid fa-vault' },
            { id: 'billing', label: 'Faturalar & Bütçe', icon: 'fa-solid fa-file-invoice-dollar' },
            { id: 'api', label: 'API Entegrasyonları', icon: 'fa-solid fa-plug' },
            { id: 'support', label: 'Destek Talepleri', icon: 'fa-solid fa-headset' }
          ].map(tab => (`;

const navNew = `          {[
            { id: 'overview', label: 'Genel Bakış & Grafikler', icon: 'fa-solid fa-chart-pie' },
            { id: 'creatives', label: 'Kreatif Onayları', icon: 'fa-solid fa-paint-roller' },
            { id: 'vault', label: 'Dosya Kasam', icon: 'fa-solid fa-vault' },
            { id: 'billing', label: 'Faturalar & Bütçe', icon: 'fa-solid fa-file-invoice-dollar' },
            { id: 'api', label: 'API Entegrasyonları', icon: 'fa-solid fa-plug' },
            { id: 'strategy', label: 'Strateji & Yol Haritası', icon: 'fa-solid fa-map' },
            { id: 'support', label: 'Destek Talepleri', icon: 'fa-solid fa-headset' }
          ].map(tab => (`;

if (code.includes(navStart)) {
  code = code.replace(navStart, navNew);
  console.log("Replaced Top Nav");
} else {
  console.log("Could not find navStart");
}

// 3. Add Billing Content if it doesn't exist
if (!code.includes("activeTab === 'billing'")) {
  const vaultEnd = `          </div>
        )}`;
        
  // Let's just find the end of vault and append billing
  const apiStart = `{activeTab === 'api' && (`;
  const apiNew = `{activeTab === 'billing' && (
          <div className="tab-content-billing fade-in">
            <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-file-invoice-dollar" style={{ fontSize: '1rem' }}></i>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>Faturalar & Bütçe</h3>
              </div>
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                <i className="fa-solid fa-receipt" style={{ fontSize: '3rem', opacity: 0.5, marginBottom: '1rem' }}></i>
                <p>Faturalarınız ve bütçe raporlamalarınız çok yakında bu alanda görüntülenebilecektir.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (`;
  
  if (code.includes(apiStart)) {
    code = code.replace(apiStart, apiNew);
    console.log("Added Billing Content");
  } else {
    console.log("Could not find apiStart");
  }
}

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', code);
