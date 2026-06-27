const fs = require('fs');

// 1. AdminDashboardView.jsx
let adminCode = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8');

const adminEffectRegex = /useEffect\(\(\) => \{\n\s*if \(\!isLoggedIn\) return;/;
const adminSyncEffect = `useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'clientReports') {
        try {
          if (e.newValue) setClientReports(JSON.parse(e.newValue));
        } catch(err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  `;

if (adminCode.includes('if (!isLoggedIn) return;') && !adminCode.includes("handleStorageChange")) {
  adminCode = adminCode.replace(adminEffectRegex, adminSyncEffect + "useEffect(() => {\n    if (!isLoggedIn) return;");
  fs.writeFileSync('src/pages/AdminDashboardView.jsx', adminCode);
  console.log("Added storage sync to Admin");
}

// 2. ClientTransparencyPageView.jsx
let clientCode = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

const clientEffectRegex = /useEffect\(\(\) => \{\n\s*if \(\!isLoggedIn\) return;/;
const clientSyncEffect = `useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'clientReports') {
        try {
          if (e.newValue) setClientReports(JSON.parse(e.newValue));
        } catch(err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  `;

if (clientCode.includes('if (!isLoggedIn) return;') && !clientCode.includes("handleStorageChange")) {
  clientCode = clientCode.replace(clientEffectRegex, clientSyncEffect + "useEffect(() => {\n    if (!isLoggedIn) return;");
  fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', clientCode);
  console.log("Added storage sync to Client");
}

