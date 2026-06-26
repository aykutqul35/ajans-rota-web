const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(
  `} else if (currentPath === '/client-portal-secure') {`,
  `} else if (currentPath === '/client-portal-secure' || currentPath === '/portal-girisi-x9' || currentPath === '/rota-management-vault-x9') {
      noIndex = true;
`
);

fs.writeFileSync('src/App.jsx', c);
