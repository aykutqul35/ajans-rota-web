const fs = require('fs');
const file = 'src/pages/AdminDashboardView.jsx';
const targetFile = 'src/components/admin/tabs/TeamTab.jsx';

let lines = fs.readFileSync(file, 'utf8').split('\n');

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("{activeTab === 'team' && <div>")) {
    startIndex = i;
  }
  if (startIndex !== -1 && i > startIndex && lines[i].includes("{activeTab === 'blogs' && <div>")) {
    endIndex = i - 1;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  let extractedLines = lines.slice(startIndex, endIndex);
  
  let codeContent = extractedLines.join('\n');
  codeContent = codeContent.replace("{activeTab === 'team' && <div>", "<div>");
  
  let componentCode = `import React from 'react';

export default function TeamTab({
  teamMembersData, setTeamMembersData, handleSaveAll, isSaving, 
  settingsData, setSettingsData, openEditModal, handleDeleteItem
}) {
  return (
    ${codeContent}
  );
}
`;
  
  fs.writeFileSync(targetFile, componentCode);
  
  const replacement = `          {activeTab === 'team' && (
            <TeamTab
              teamMembersData={teamMembersData}
              setTeamMembersData={setTeamMembersData}
              handleSaveAll={handleSaveAll}
              isSaving={isSaving}
              settingsData={settingsData}
              setSettingsData={setSettingsData}
              openEditModal={openEditModal}
              handleDeleteItem={handleDeleteItem}
            />
          )}`;
        
  lines.splice(startIndex, endIndex - startIndex, replacement);
  lines.splice(3, 0, "import TeamTab from '../components/admin/tabs/TeamTab';");
  
  fs.writeFileSync(file, lines.join('\n'));
  console.log('Extracted TeamTab!');
} else {
  console.log('Boundaries not found.');
}
