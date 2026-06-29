const fs = require('fs');

const adminFile = 'src/pages/AdminDashboardView.jsx';
const tabFile = 'src/components/admin/tabs/BlogsTab.jsx';

let adminLines = fs.readFileSync(adminFile, 'utf8').split('\n');
let tabLines = fs.readFileSync(tabFile, 'utf8').split('\n');

const statesToMove = [];

// Remove states
const states = [
  "const [blogSearch, setBlogSearch] = useState('');",
  "const [blogCatFilter, setBlogCatFilter] = useState('all');",
  "const [blogCurrentPage, setBlogCurrentPage] = useState(1);"
];

for (const stateLine of states) {
  let index = adminLines.findIndex(line => line.includes(stateLine.replace('const', '').trim()));
  if (index !== -1) {
    statesToMove.push(adminLines[index].trim());
    adminLines.splice(index, 1);
  }
}


// Add states to BlogsTab.jsx
let insertIndex = tabLines.findIndex(line => line.includes('}) {')) + 1;
tabLines.splice(insertIndex, 0, ...statesToMove);

if (!tabLines.find(line => line.includes("import { useState }"))) {
  tabLines[0] = "import React, { useState } from 'react';";
}

fs.writeFileSync(adminFile, adminLines.join('\n'));
fs.writeFileSync(tabFile, tabLines.join('\n'));
