const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(
  "const isAdminRoute = currentPath.startsWith('/rota-management-vault-x9');",
  "const isSecurePanel = currentPath.startsWith('/rota-management-vault-x9') || currentPath.startsWith('/portal-girisi-x9') || currentPath.startsWith('/client-portal-secure');\n  const isAdminRoute = currentPath.startsWith('/rota-management-vault-x9');"
);

c = c.replace(
  "{/* Navigation Bar */}\n      {!isAdminRoute && (",
  "{/* Navigation Bar */}\n      {!isSecurePanel && ("
);

c = c.replace(
  "{/* Footer Section */}\n      {!isAdminRoute && (",
  "{/* Footer Section */}\n      {!isSecurePanel && ("
);

fs.writeFileSync('src/App.jsx', c);
