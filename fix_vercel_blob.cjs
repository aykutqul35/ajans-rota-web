const fs = require('fs');

let adminCode = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8');

// Replace all occurrences of upload(file.name, file
adminCode = adminCode.replace(
  /upload\(file\.name, file,/g,
  "upload(Date.now() + '-' + file.name, file,"
);

fs.writeFileSync('src/pages/AdminDashboardView.jsx', adminCode);
console.log("Fixed Vercel Blob collision issue");
