const fs = require('fs');

let c = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

const oldHandleLogin = `  const handleLogin = (e) => {
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
        setLoginError('Kullanıcı adı veya şifre hatalı.');
      }
    }
  };`;

const newHandleLogin = `  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const u = username.trim();
    const p = password.trim();

    try {
      const res = await fetch('/api/clients/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
      });
      const result = await res.json();
      
      if (res.ok && result.success) {
         localStorage.setItem('client_token', result.token);
         
         // Setup the data locally since App.jsx no longer fetches all data for clients
         const key = result.data.report_data?._key || 'ecommerce';
         
         const newReport = {
           ...result.data.report_data,
           client_id: result.data.id,
           username: result.data.username,
           brandName: result.data.brand_name
         };
         
         setClientReports(prev => ({
           ...prev,
           [key]: newReport
         }));
         
         setActiveBrand(key);
         setIsLoggedIn(true);
      } else {
         setLoginError(result.message || 'Kullanıcı adı veya şifre hatalı.');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Sunucu bağlantı hatası.');
    }
  };`;

c = c.replace(oldHandleLogin, newHandleLogin);

// We must also update fetch headers in ClientTransparencyPageView.jsx
c = c.replace(
  `fetch('/api/clients/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },`,
  `fetch('/api/clients/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${localStorage.getItem('client_token')}\` },`
);

c = c.replace(
  `fetch('/api/clients/update', {
                                 method: 'PUT',
                                 headers: { 'Content-Type': 'application/json' },`,
  `fetch('/api/clients/update', {
                                 method: 'PUT',
                                 headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${localStorage.getItem('client_token')}\` },`
);
c = c.replace(
  `fetch('/api/clients/update', {
                                 method: 'PUT',
                                 headers: { 'Content-Type': 'application/json' },`,
  `fetch('/api/clients/update', {
                                 method: 'PUT',
                                 headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${localStorage.getItem('client_token')}\` },`
);
c = c.replace(
  `fetch('/api/clients/update', {
                                 method: 'PUT',
                                 headers: { 'Content-Type': 'application/json' },`,
  `fetch('/api/clients/update', {
                                 method: 'PUT',
                                 headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${localStorage.getItem('client_token')}\` },`
);

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', c);
