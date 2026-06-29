const fs = require('fs');
const lines = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8').split('\n');

let maxLines = 0;
let currentFn = '';
let fnStart = 0;

for(let i = 0; i < lines.length; i++) {
  let line = lines[i];
  if(line.includes('const ') && line.includes(' = ') && (line.includes('=> {') || line.includes('function'))) {
     console.log(`Func at ${i}: ${line.trim()}`);
  }
}
