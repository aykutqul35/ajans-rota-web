const fs = require('fs');
const lines = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8').split('\n');

console.log(`Total lines: ${lines.length}\n`);

// Find all top-level functions, useState, useEffect
const sections = [];
for(let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.startsWith('const ') && (line.includes('=> {') || line.includes('= async'))) {
    sections.push({ line: i+1, code: line.substring(0, 120) });
  }
  if (line.startsWith('useEffect(')) {
    sections.push({ line: i+1, code: 'useEffect(...)' });
  }
  if (line.includes('useState(')) {
    sections.push({ line: i+1, code: line.substring(0, 120) });
  }
  // Look for modal JSX
  if (line.includes('Modal') || line.includes('modal')) {
    sections.push({ line: i+1, code: `[JSX/Modal] ${line.substring(0, 100)}` });
  }
}

sections.forEach(s => console.log(`L${s.line}: ${s.code}`));
