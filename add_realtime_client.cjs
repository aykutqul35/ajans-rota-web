const fs = require('fs');
let code = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

const syncEffect = `  // Sync viewing ticket for realtime updates
  useEffect(() => {
    if (viewingTicket && clientReports && activeBrand) {
      const brandData = clientReports[activeBrand];
      if (brandData && brandData.tickets) {
        const updated = brandData.tickets.find(t => t.id === viewingTicket.id);
        if (updated && JSON.stringify(updated.messages) !== JSON.stringify(viewingTicket.messages)) {
          setViewingTicket({ ...updated });
        }
      }
    }
  }, [clientReports]);

  // Client Polling for Real-Time updates
  useEffect(() => {
    let intervalId = null;
    
    if (isLoggedIn) {
      intervalId = setInterval(async () => {
        const token = localStorage.getItem('client_token');
        if (token) {
          try {
            const res = await fetch('/api/clients/auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token_login: true, token })
            });
            if (res.ok) {
              const data = await res.json();
              if (data.success && data.data) {
                const serverData = data.data.report_data || {};
                const key = serverData._key || (data.data.brand_name.toLowerCase().includes('e-ticaret') ? 'ecommerce' : 'b2b');
                
                // Only update if data actually changed to prevent re-renders
                if (setClientReports && typeof setClientReports === 'function') {
                  setClientReports(prev => {
                    const prevBrand = prev?.[key];
                    if (JSON.stringify(prevBrand) !== JSON.stringify(serverData)) {
                       return {
                         ...prev,
                         [key]: {
                           ...serverData,
                           client_id: data.data.id,
                           username: data.data.username,
                           brandName: data.data.brand_name
                         }
                       };
                    }
                    return prev;
                  });
                }
              }
            }
          } catch(e) {}
        }
      }, 5000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLoggedIn]);`;

if (!code.includes("Client Polling for Real-Time updates")) {
  code = code.replace(
    "  // Auto-login client if token exists",
    syncEffect + "\n\n  // Auto-login client if token exists"
  );
  fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', code);
  console.log("ClientDashboardView realtime added");
}
