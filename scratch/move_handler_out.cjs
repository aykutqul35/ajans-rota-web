const fs = require('fs');
const file = 'src/pages/AdminDashboardView.jsx';

let lines = fs.readFileSync(file, 'utf8').split('\n');

// Find handleAdminReplySubmit
let startIndex = lines.findIndex(line => line.includes("const handleAdminReplySubmit = (e) => {"));

if (startIndex !== -1) {
  let endIndex = startIndex;
  let braceCount = 0;
  let foundBrace = false;
  for (let i = startIndex; i < lines.length; i++) {
    if (lines[i].includes('{')) { braceCount += (lines[i].match(/\{/g) || []).length; foundBrace = true; }
    if (lines[i].includes('}')) { braceCount -= (lines[i].match(/\}/g) || []).length; }
    if (foundBrace && braceCount === 0) {
      endIndex = i;
      break;
    }
  }

  const funcCode = lines.slice(startIndex, endIndex + 1);
  lines.splice(startIndex, endIndex - startIndex + 1);

  // Find a good place to insert it at the top level
  let targetIndex = lines.findIndex(line => line.includes('const handleServiceFieldChange = (key, field, value) => {'));
  if (targetIndex === -1) targetIndex = lines.findIndex(line => line.includes('const openEditModal = '));
  
  lines.splice(targetIndex, 0, ...funcCode);
  fs.writeFileSync(file, lines.join('\n'));
  console.log('Moved handleAdminReplySubmit outside!');
} else {
  console.log('handleAdminReplySubmit not found.');
}
