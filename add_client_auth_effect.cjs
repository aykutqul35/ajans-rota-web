const fs = require('fs');
let code = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

const effectCode = `  // Auto-login client if token exists
  useEffect(() => {
    const token = localStorage.getItem('client_token');
    if (token && !isLoggedIn) {
      const verifyToken = async () => {
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
              
              const updatedReports = { ...clientReports };
              updatedReports[key] = {
                ...serverData,
                client_id: data.data.id,
                username: data.data.username,
                brandName: data.data.brand_name
              };
              
              if (setClientReports) setClientReports(updatedReports);
              setActiveBrand(key);
              setIsLoggedIn(true);
            }
          }
        } catch (e) {
          console.error("Auto login failed", e);
        }
      };
      // We need a server endpoint that supports token_login.
      // Wait, api/clients/auth.js doesn't support token_login.
      // I will update auth.js to support it.
    }
  }, []);

  useEffect(() => {`;

code = code.replace("  useEffect(() => {", effectCode);

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', code);
console.log("Auto-login effect added");
