const fs = require('fs');

const adminFile = 'src/pages/AdminDashboardView.jsx';
const tabFile = 'src/components/admin/tabs/TeamTab.jsx';

let adminLines = fs.readFileSync(adminFile, 'utf8').split('\n');
let tabLines = fs.readFileSync(tabFile, 'utf8').split('\n');

const statesToMove = [];

// Remove states
const states = [
  "const [teamSearchQuery, setTeamSearchQuery] = useState('');",
  "const [teamDeptFilter, setTeamDeptFilter] = useState('all');"
];

for (const stateLine of states) {
  let index = adminLines.findIndex(line => line.includes(stateLine.replace('const', '').trim()));
  if (index !== -1) {
    statesToMove.push(adminLines[index].trim());
    adminLines.splice(index, 1);
  }
}

// Remove moveTeamMember
let startIndex = adminLines.findIndex(line => line.includes("const moveTeamMember = (index, direction) => {"));
if (startIndex !== -1) {
  let endIndex = startIndex;
  let braceCount = 0;
  let foundBrace = false;
  for (let i = startIndex; i < adminLines.length; i++) {
    if (adminLines[i].includes('{')) { braceCount += (adminLines[i].match(/\{/g) || []).length; foundBrace = true; }
    if (adminLines[i].includes('}')) { braceCount -= (adminLines[i].match(/\}/g) || []).length; }
    if (foundBrace && braceCount === 0) {
      endIndex = i;
      break;
    }
  }
  
  const funcCode = adminLines.slice(startIndex, endIndex + 1).join('\n');
  statesToMove.push(funcCode);
  adminLines.splice(startIndex, endIndex - startIndex + 1);
}


// Add states to TeamTab.jsx
let insertIndex = tabLines.findIndex(line => line.includes('}) {')) + 1;
tabLines.splice(insertIndex, 0, ...statesToMove.join('\n\n').split('\n'));

if (!tabLines.find(line => line.includes("import { useState }"))) {
  tabLines[0] = "import React, { useState } from 'react';";
}

// Fix TeamTab props
let propsIndex = tabLines.findIndex(line => line.includes('teamMembersData, setTeamMembersData, handleSaveAll, isSaving,'));
if (propsIndex !== -1) {
  tabLines[propsIndex] = tabLines[propsIndex].replace(
    'teamMembersData, setTeamMembersData, handleSaveAll, isSaving,',
    'teamMembersData, setTeamMembersData,'
  );
}
let propsIndex2 = tabLines.findIndex(line => line.includes('settingsData, setSettingsData, openEditModal, handleDeleteItem'));
if (propsIndex2 !== -1) {
  tabLines[propsIndex2] = tabLines[propsIndex2].replace(
    'settingsData, setSettingsData, openEditModal, handleDeleteItem',
    'openEditModal, handleDeleteItem'
  );
}

// Fix AdminDashboardView props for TeamTab
let adminPropsIndex = adminLines.findIndex(line => line.includes('              handleSaveAll={handleSaveAll}'));
if (adminPropsIndex !== -1) {
  // Remove handleSaveAll, isSaving, settingsData, setSettingsData
  adminLines.splice(adminPropsIndex, 4);
}

fs.writeFileSync(adminFile, adminLines.join('\n'));
fs.writeFileSync(tabFile, tabLines.join('\n'));
