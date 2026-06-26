const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');

const oldLoadClients = `    const loadClientsFromDB = async () => {
      try {
        const res = await fetch('/api/clients');
        if (res.ok) {`;
        
const newLoadClients = `    const loadClientsFromDB = async () => {
      if (!authToken) return; // Only fetch if we have an admin token
      try {
        const res = await fetch('/api/clients', {
          headers: { 'Authorization': \`Bearer \${authToken}\` }
        });
        if (res.ok) {`;

c = c.replace(oldLoadClients, newLoadClients);

// Now let's change the secret URLs!
c = c.replace(/path="\/admin"/g, 'path="/rota-management-vault-x9"');
c = c.replace(/path="\/admin\/login"/g, 'path="/portal-girisi-x9"');
c = c.replace(/navigate\('\/admin\/login'\)/g, "navigate('/portal-girisi-x9')");
c = c.replace(/path="\/seffaf-panel"/g, 'path="/client-portal-secure"');

fs.writeFileSync('src/App.jsx', c);
console.log("App.jsx auth and routes updated");
