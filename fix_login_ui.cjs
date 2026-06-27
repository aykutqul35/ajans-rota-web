const fs = require('fs');
let c = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

// Fix the main wrapper background
c = c.replace(
  "background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'",
  "background: '#0f172a'"
);

// Fix the glassmorphism login box background
c = c.replace(
  "background: 'rgba(255, 255, 255, 0.75)',",
  "background: 'rgba(30, 41, 59, 0.75)',"
);

c = c.replace(
  "border: '1px solid rgba(255, 255, 255, 0.8)',",
  "border: '1px solid rgba(255, 255, 255, 0.1)',"
);

c = c.replace(
  "boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',",
  "boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',"
);

// Fix the "Demo mode" card
c = c.replace(
  "background: 'rgba(15, 23, 42, 0.03)',",
  "background: 'rgba(255, 255, 255, 0.03)',"
);

c = c.replace(
  "border: '1px solid rgba(15, 23, 42, 0.05)',",
  "border: '1px solid rgba(255, 255, 255, 0.05)',"
);

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', c);
