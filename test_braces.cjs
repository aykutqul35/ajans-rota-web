const fs = require('fs');
const content = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8');
let openCount = 0;
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '{') openCount++;
    if (line[j] === '}') openCount--;
  }
  if (openCount === 0 && i > 50) { // Should not be zero until the end of AdminDashboardView
    console.log(`Function reached openCount=0 at line ${i + 1}`);
    console.log(lines.slice(i-2, i+2).join('\n'));
    break;
  }
}
