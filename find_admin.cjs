const fs = require('fs');
const content = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8');

console.log("State Index:", content.indexOf("const [securityIsLoading, setSecurityIsLoading] = useState(false);"));
console.log("Settings Index:", content.indexOf("Genel Sistem ve Arayüz Ayarları (Settings)"));
console.log("Reports Index:", content.indexOf("Onay Bekleyen Kreatifler & Dosyalar"));
