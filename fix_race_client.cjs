const fs = require('fs');
let code = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

// 1. Set flag in handleClientReplySubmit
const handleClientReplyStart = `      // Update status
      ticket.status = 'Yanıt Bekliyor';
      
      // Update state`;
const handleClientReplyNew = `      // Update status
      ticket.status = 'Yanıt Bekliyor';
      window._clientLastWrite = Date.now();
      
      // Update state`;
if (code.includes(handleClientReplyStart)) code = code.replace(handleClientReplyStart, handleClientReplyNew);

// 2. Set flag in handleCreateTicket
const handleCreateStart = `      // Update global React state
      if (setClientReports) setClientReports(currentReports);`;
const handleCreateNew = `      window._clientLastWrite = Date.now();
      // Update global React state
      if (setClientReports) setClientReports(currentReports);`;
if (code.includes(handleCreateStart)) code = code.replace(handleCreateStart, handleCreateNew);

// 3. Prevent overwrite in polling
const pollingStart = `                // Only update if data actually changed to prevent re-renders
                if (setClientReports && typeof setClientReports === 'function') {`;
const pollingNew = `                // Only update if data actually changed to prevent re-renders
                if (window._clientLastWrite && Date.now() - window._clientLastWrite < 5000) return;
                
                if (setClientReports && typeof setClientReports === 'function') {`;
if (code.includes(pollingStart)) code = code.replace(pollingStart, pollingNew);

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', code);
console.log("Client race condition fixed");
