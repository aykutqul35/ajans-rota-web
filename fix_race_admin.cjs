const fs = require('fs');
// Fix App.jsx loadClientsFromDB polling overwrite
let appCode = fs.readFileSync('src/App.jsx', 'utf8');

const loadClientsStart = `    const loadClientsFromDB = async () => {
      if (!authToken) return; // Only fetch if we have an admin token
      try {`;
const loadClientsNew = `    const loadClientsFromDB = async () => {
      if (!authToken) return; // Only fetch if we have an admin token
      if (window._adminLastWrite && Date.now() - window._adminLastWrite < 5000) return;
      
      try {`;
if (appCode.includes(loadClientsStart)) appCode = appCode.replace(loadClientsStart, loadClientsNew);
fs.writeFileSync('src/App.jsx', appCode);

// Fix AdminDashboardView.jsx setting the flag
let adminCode = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8');

const handleAdminReplyStart = `      ticket.status = 'Müşteri Yanıtı Bekleniyor';
      
      setClientReports(updatedClientReports);`;
const handleAdminReplyNew = `      ticket.status = 'Müşteri Yanıtı Bekleniyor';
      window._adminLastWrite = Date.now();
      
      setClientReports(updatedClientReports);`;
if (adminCode.includes(handleAdminReplyStart)) adminCode = adminCode.replace(handleAdminReplyStart, handleAdminReplyNew);

const handleSaveAllStart = `  const handleSaveAll = async () => {
    setIsSaving(true);
    const dbPayload = {`;
const handleSaveAllNew = `  const handleSaveAll = async () => {
    setIsSaving(true);
    window._adminLastWrite = Date.now();
    const dbPayload = {`;
if (adminCode.includes(handleSaveAllStart)) adminCode = adminCode.replace(handleSaveAllStart, handleSaveAllNew);

fs.writeFileSync('src/pages/AdminDashboardView.jsx', adminCode);
console.log("Admin race condition fixed");
