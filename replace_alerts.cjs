const fs = require('fs');

function replaceAlerts(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  if (!code.includes('react-hot-toast')) {
    code = `import toast from 'react-hot-toast';\n` + code;
  }

  // Replace alert('... başarıyla ...') with toast.success
  // Replace alert('... hata ...') with toast.error
  // Otherwise generic toast
  const alertRegex = /alert\((.*?)\)/g;
  
  code = code.replace(alertRegex, (match, content) => {
    const lower = content.toLowerCase();
    if (lower.includes('başarı') || lower.includes('tebrik')) {
      return `toast.success(${content})`;
    } else if (lower.includes('hata') || lower.includes('geçersiz') || lower.includes('lütfen')) {
      return `toast.error(${content})`;
    } else {
      return `toast(${content})`;
    }
  });

  fs.writeFileSync(filePath, code);
  console.log(`Replaced alerts in ${filePath}`);
}

replaceAlerts('src/pages/AdminDashboardView.jsx');
replaceAlerts('src/components/ClientTransparencyPageView.jsx');
replaceAlerts('src/components/LeadPopup.jsx');

// Update App.jsx to include Toaster
let appCode = fs.readFileSync('src/App.jsx', 'utf8');
if (!appCode.includes('react-hot-toast')) {
  appCode = `import { Toaster } from 'react-hot-toast';\n` + appCode;
  
  // Inject <Toaster /> right after <Router>
  appCode = appCode.replace(/<Router>/, '<Router>\n      <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: "#1e293b", color: "#fff", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", fontWeight: "600" } }} />');
  fs.writeFileSync('src/App.jsx', appCode);
  console.log('Added Toaster to App.jsx');
}

