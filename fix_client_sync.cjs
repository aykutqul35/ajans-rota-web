const fs = require('fs');

let code = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

// 1. Add isLoggingIn state
if (!code.includes("const [isLoggingIn, setIsLoggingIn] = useState(false);")) {
  code = code.replace(
    "const [loginError, setLoginError] = useState('');",
    "const [loginError, setLoginError] = useState('');\n  const [isLoggingIn, setIsLoggingIn] = useState(false);"
  );
}

// 2. Rewrite handleLogin
const handleLoginOld = `  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const u = username.trim();
    const p = password.trim();

    // Check if there is a match in dynamic clientReports
    const matchedBrandKey = Object.keys(clientReports || {}).find(key => {
      const report = clientReports[key];
      return report && report.username === u && report.password === p;
    });

    if (matchedBrandKey) {
      setActiveBrand(matchedBrandKey);
      setIsLoggedIn(true);
    } else {
      // Check fallbacks for default accounts
      const expectedEcomUser = rawEcommerce.username || 'ege';
      const expectedEcomPass = rawEcommerce.password || 'ege123';
      const expectedB2bUser = rawB2b.username || 'liman';
      const expectedB2bPass = rawB2b.password || 'liman123';

      if (u === expectedEcomUser && p === expectedEcomPass) {
        setActiveBrand('ecommerce');
        setIsLoggedIn(true);
      } else if (u === expectedB2bUser && p === expectedB2bPass) {
        setActiveBrand('b2b');
        setIsLoggedIn(true);
      } else {
        setLoginError('Hatalı kullanıcı adı veya şifre! Lütfen bilgilerinizi kontrol edin.');
      }
    }
  };`;

const handleLoginNew = `  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    const u = username.trim();
    const p = password.trim();

    try {
      const res = await fetch('/api/clients/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
      });
      
      const data = await res.json();
      
      if (data.success && data.token) {
        localStorage.setItem('client_token', data.token);
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
        localStorage.setItem('clientReports', JSON.stringify(updatedReports));
        
        setActiveBrand(key);
        setIsLoggedIn(true);
      } else {
        // Fallback to local auth if DB fails or isn't seeded yet
        const matchedBrandKey = Object.keys(clientReports || {}).find(key => {
          const report = clientReports[key];
          return report && report.username === u && report.password === p;
        });

        if (matchedBrandKey) {
          setActiveBrand(matchedBrandKey);
          setIsLoggedIn(true);
        } else {
          const expectedEcomUser = rawEcommerce.username || 'ege';
          const expectedEcomPass = rawEcommerce.password || 'ege123';
          const expectedB2bUser = rawB2b.username || 'liman';
          const expectedB2bPass = rawB2b.password || 'liman123';

          if (u === expectedEcomUser && p === expectedEcomPass) {
            setActiveBrand('ecommerce');
            setIsLoggedIn(true);
          } else if (u === expectedB2bUser && p === expectedB2bPass) {
            setActiveBrand('b2b');
            setIsLoggedIn(true);
          } else {
            setLoginError('Hatalı kullanıcı adı veya şifre! Lütfen bilgilerinizi kontrol edin.');
          }
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      setLoginError('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsLoggingIn(false);
    }
  };`;

code = code.replace(handleLoginOld, handleLoginNew);

// 3. Rewrite handleCreateTicket to sync with DB
const ticketDbSyncOld = `      // Persist to main database so it survives refresh
      try {
        const localDbStr = localStorage.getItem('ajans_rota_db');
        if(localDbStr){
           const dbPayload = JSON.parse(localDbStr);
           dbPayload.clientReports = currentReports;
           localStorage.setItem('ajans_rota_db', JSON.stringify(dbPayload));
        } else {
           localStorage.setItem('ajans_rota_db', JSON.stringify({ clientReports: currentReports }));
        }
      } catch(e) {}`;

const ticketDbSyncNew = `      // Persist to main database so it survives refresh
      try {
        const localDbStr = localStorage.getItem('ajans_rota_db');
        if(localDbStr){
           const dbPayload = JSON.parse(localDbStr);
           dbPayload.clientReports = currentReports;
           localStorage.setItem('ajans_rota_db', JSON.stringify(dbPayload));
        } else {
           localStorage.setItem('ajans_rota_db', JSON.stringify({ clientReports: currentReports }));
        }
      } catch(e) {}
      
      // SYNC TO NEON DB SERVER
      const token = localStorage.getItem('client_token');
      if (token && brandData.client_id) {
         fetch('/api/clients/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ client_id: brandData.client_id, report_data: brandData })
         }).catch(e => console.error("Ticket sync error:", e));
      }`;

if (code.includes(ticketDbSyncOld)) {
  code = code.replace(ticketDbSyncOld, ticketDbSyncNew);
} else {
  console.log("Could not find ticketDbSyncOld to replace");
}

// 4. Update Login Button Text
code = code.replace(
  `Giriş Yap <i className="fa-solid fa-arrow-right-to-bracket" style={{ marginLeft: '6px' }}></i>`,
  `{isLoggingIn ? 'Giriş Yapılıyor...' : 'Giriş Yap'} <i className="fa-solid fa-arrow-right-to-bracket" style={{ marginLeft: '6px' }}></i>`
);

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', code);
console.log("Client sync fixed");
