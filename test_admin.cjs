const fs = require('fs');
const c = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8');

console.log('1:', c.indexOf('const [securityNewPassword, setSecurityNewPassword] = useState(\'\');'));
console.log('2:', c.indexOf('Genel Sistem ve Arayüz Ayarları (Settings)'));
console.log('3:', c.indexOf('Müşteri Onayına Sunulacak Kreatifler'));
