const fs = require('fs');
let appCode = fs.readFileSync('src/App.jsx', 'utf8');

const loadClientsStart = `        if (res.ok) {
          const result = await res.json();`;
const loadClientsNew = `        if (res.status === 401) {
          clearInterval(window._adminPollInterval);
          console.error("Admin token invalid or expired. Stopping polling.");
          // Optional: localStorage.removeItem('admin_token'); window.location.reload();
          return;
        }
        if (res.ok) {
          const result = await res.json();`;

if (appCode.includes(loadClientsStart)) {
  appCode = appCode.replace(loadClientsStart, loadClientsNew);
  fs.writeFileSync('src/App.jsx', appCode);
  console.log("App polling 401 fix applied.");
}
