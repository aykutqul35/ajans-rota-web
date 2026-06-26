const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(/\/seffaf-panel/g, '/client-portal-secure');
c = c.replace(/\/admin\/login/g, '/portal-girisi-x9');
c = c.replace(/'\/admin'/g, "'/rota-management-vault-x9'");

fs.writeFileSync('src/App.jsx', c);
console.log("Routes fixed in App.jsx");
