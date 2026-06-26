const fs = require('fs');

let c = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

// 1. Replace the wrapper of the authenticated view
const oldWrapperStart = `  // Dashboard view if authenticated
  return (
    <div className="client-dashboard-page-wrapper" style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '4rem', background: '#f8fafc' }}>
      <div className="container">
        
        {/* Back Button */}`;
        
const newWrapperStart = `  // Dashboard view if authenticated
  return (
    <div className="client-os-wrapper">
       <style>{\`
          .client-os-wrapper {
             display: flex;
             height: 100vh;
             background: #0f172a;
             color: #e2e8f0;
             font-family: 'Inter', sans-serif;
             overflow: hidden;
          }
          .client-os-sidebar {
             width: 260px;
             background: #1e293b;
             border-right: 1px solid rgba(255,255,255,0.05);
             display: flex;
             flex-direction: column;
             padding: 1.5rem;
          }
          .client-os-logo {
             font-size: 1.25rem;
             font-weight: 800;
             color: #fff;
             margin-bottom: 2.5rem;
             display: flex;
             align-items: center;
             gap: 10px;
          }
          .client-os-logo span {
             background: linear-gradient(135deg, #0ea5e9, #3b82f6);
             -webkit-background-clip: text;
             -webkit-text-fill-color: transparent;
          }
          .client-os-nav-item {
             padding: 0.8rem 1rem;
             border-radius: 8px;
             color: #94a3b8;
             cursor: pointer;
             display: flex;
             align-items: center;
             gap: 12px;
             margin-bottom: 0.5rem;
             font-size: 0.95rem;
             font-weight: 600;
             transition: all 0.2s;
          }
          .client-os-nav-item:hover {
             background: rgba(255,255,255,0.05);
             color: #fff;
          }
          .client-os-nav-item.active {
             background: rgba(14, 165, 233, 0.1);
             color: #0ea5e9;
          }
          .client-os-main {
             flex: 1;
             display: flex;
             flex-direction: column;
             overflow-y: auto;
          }
          .client-os-topbar {
             height: 70px;
             border-bottom: 1px solid rgba(255,255,255,0.05);
             display: flex;
             justify-content: space-between;
             align-items: center;
             padding: 0 2rem;
             background: rgba(15, 23, 42, 0.8);
             backdrop-filter: blur(10px);
             position: sticky;
             top: 0;
             z-index: 10;
          }
          .client-os-content {
             padding: 2rem;
             max-width: 1200px;
             margin: 0 auto;
             width: 100%;
          }
          
          /* Override hardcoded light mode styles */
          .client-os-content *[style*="background-color: #fff"],
          .client-os-content *[style*="backgroundColor: '#fff'"],
          .client-os-content *[style*="background: '#fff'"] {
             background-color: #1e293b !important;
             background: #1e293b !important;
             border-color: rgba(255,255,255,0.1) !important;
             box-shadow: 0 4px 20px rgba(0,0,0,0.2) !important;
          }
          .client-os-content *[style*="color: 'var(--text-dark)'"] {
             color: #f1f5f9 !important;
          }
          .client-os-content *[style*="color: 'var(--text-light)'"],
          .client-os-content *[style*="color: 'var(--text-muted)'"] {
             color: #94a3b8 !important;
          }
       \`}</style>

       {/* SIDEBAR */}
       <div className="client-os-sidebar">
          <div className="client-os-logo">
             <i className="fa-solid fa-bolt" style={{color: '#0ea5e9'}}></i> <span>Rota Growth OS</span>
          </div>
          <div className={\`client-os-nav-item \${activeTab === 'overview' ? 'active' : ''}\`} onClick={() => setActiveTab('overview')}>
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
          <div style={{marginTop: 'auto'}}></div>
          <div className="client-os-nav-item" onClick={() => {
              localStorage.removeItem('client_token');
              window.location.href = '/';
          }}>
             <i className="fa-solid fa-arrow-right-from-bracket"></i> Çıkış Yap
          </div>
       </div>

       {/* MAIN AREA */}
       <div className="client-os-main">
          {/* TOPBAR */}
          <div className="client-os-topbar">
             <div>
                <h2 style={{fontSize: '1.1rem', fontWeight: 700, margin: 0}}>{currentData.brandName}</h2>
                <span style={{fontSize: '0.8rem', color: '#94a3b8'}}>{currentData.industry}</span>
             </div>
             <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                <div style={{width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff'}}>
                   {currentData.brandName.substring(0, 2).toUpperCase()}
                </div>
             </div>
          </div>
          
          <div className="client-os-content">
        {/* Back Button (Gizlendi) */}`;

c = c.replace(oldWrapperStart, newWrapperStart);

// Remove the Intro Header that breaks the OS illusion
const introHeaderStart = `{/* Intro Header */}`;
const introHeaderEnd = `</p>\n        </div>`;
const idxStart = c.indexOf(introHeaderStart);
const idxEnd = c.indexOf(introHeaderEnd) + introHeaderEnd.length;
if(idxStart > -1 && idxEnd > -1 && idxStart < idxEnd) {
   c = c.substring(0, idxStart) + `{/* Intro Header Removed for OS Layout */}` + c.substring(idxEnd);
}

// Replace `#fff` occurrences with `var(--card-bg)` wait no, my global CSS override will fix it.
// Let's replace the ugly Tab Navigation since we have it in the sidebar now!
const tabNavStart = `{/* V2 Tab Navigation */}`;
const tabNavEnd = `</div>\n        </div>`;
const tabIdxStart = c.indexOf(tabNavStart);
let searchIndex = tabIdxStart;
for(let i=0; i<2; i++) {
   searchIndex = c.indexOf(`</div>`, searchIndex + 1);
}
// This is fragile. Let's just find the exact block.
const tabsBlockRegex = /\{\/\* V2 Tab Navigation \*\/\}[\s\S]*?(?=\{\/\* --- TAB: OVERVIEW)/;
c = c.replace(tabsBlockRegex, '');

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', c);
