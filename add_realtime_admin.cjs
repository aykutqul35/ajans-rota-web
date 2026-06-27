const fs = require('fs');

let appCode = fs.readFileSync('src/App.jsx', 'utf8');

const loadClientsCallOld = `    fetchData().then(() => loadClientsFromDB());
  }, [authToken]);`;
const loadClientsCallNew = `    fetchData().then(() => {
      loadClientsFromDB();
      if (authToken) {
        // Poll for real-time ticket updates (Admin side)
        const intervalId = setInterval(loadClientsFromDB, 5000);
        window._adminPollInterval = intervalId;
      }
    });
    
    return () => {
      if (window._adminPollInterval) clearInterval(window._adminPollInterval);
    };
  }, [authToken]);`;

if (appCode.includes(loadClientsCallOld)) {
  appCode = appCode.replace(loadClientsCallOld, loadClientsCallNew);
  fs.writeFileSync('src/App.jsx', appCode);
  console.log("App.jsx admin polling added");
} else {
  console.log("Failed to find loadClientsCallOld in App.jsx");
}

let adminCode = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8');
const syncEffect = `  // Sync viewing ticket with global state for realtime updates
  useEffect(() => {
    if (viewingTicket && clientReports) {
      const brandData = clientReports[viewingTicket.brandKey];
      if (brandData && brandData.tickets) {
        const updated = brandData.tickets.find(t => t.id === viewingTicket.id);
        if (updated && JSON.stringify(updated.messages) !== JSON.stringify(viewingTicket.messages)) {
          setViewingTicket({ ...updated, brandKey: viewingTicket.brandKey });
        }
      }
    }
  }, [clientReports]);`;

if (!adminCode.includes("Sync viewing ticket with global state for realtime updates")) {
  adminCode = adminCode.replace(
    "useEffect(() => {\n    if (typeof window !== 'undefined') {",
    syncEffect + "\n\n  useEffect(() => {\n    if (typeof window !== 'undefined') {"
  );
  fs.writeFileSync('src/pages/AdminDashboardView.jsx', adminCode);
  console.log("AdminDashboardView sync effect added");
}
