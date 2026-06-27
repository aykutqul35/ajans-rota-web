const fs = require('fs');
let code = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

const navStart = `          {[
            { id: 'overview', label: 'Genel Bakış & Grafikler', icon: 'fa-solid fa-chart-pie' },
            { id: 'creatives', label: 'Kreatif Onayları', icon: 'fa-solid fa-paint-roller' },
            { id: 'vault', label: 'Dosya Kasam', icon: 'fa-solid fa-vault' },
            { id: 'billing', label: 'Faturalar & Bütçe', icon: 'fa-solid fa-file-invoice-dollar' },
            { id: 'api', label: 'API Entegrasyonları', icon: 'fa-solid fa-plug' }
          ].map(tab => (`;

const navNew = `          {[
            { id: 'overview', label: 'Genel Bakış & Grafikler', icon: 'fa-solid fa-chart-pie' },
            { id: 'creatives', label: 'Kreatif Onayları', icon: 'fa-solid fa-paint-roller' },
            { id: 'vault', label: 'Dosya Kasam', icon: 'fa-solid fa-vault' },
            { id: 'billing', label: 'Faturalar & Bütçe', icon: 'fa-solid fa-file-invoice-dollar' },
            { id: 'api', label: 'API Entegrasyonları', icon: 'fa-solid fa-plug' },
            { id: 'support', label: 'Destek Talepleri', icon: 'fa-solid fa-headset' }
          ].map(tab => (`;

if (code.includes(navStart)) {
  code = code.replace(navStart, navNew);
  fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', code);
  console.log("Added support to V2 top nav");
} else {
  console.log("Could not find navStart");
}
