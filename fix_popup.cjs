const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

const oldCode = `  // Handle Exit Intent
  useEffect(() => {
    const handleMouseLeave = (e) => {`;
    
const newCode = `  // Handle Exit Intent
  useEffect(() => {
    if (currentPath === '/rota-management-vault-x9' || currentPath === '/portal-girisi-x9' || currentPath === '/client-portal-secure') return;
    const handleMouseLeave = (e) => {`;

c = c.replace(oldCode, newCode);
fs.writeFileSync('src/App.jsx', c);
