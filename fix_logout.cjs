const fs = require('fs');
let code = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

code = code.replace(
  "  const handleLogout = () => {\n    setIsLoggedIn(false);",
  "  const handleLogout = () => {\n    localStorage.removeItem('client_token');\n    setIsLoggedIn(false);"
);

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', code);
