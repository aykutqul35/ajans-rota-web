const fs = require('fs');
const file = 'src/pages/AdminDashboardView.jsx';
const targetFile = 'src/components/admin/tabs/SettingsTab.jsx';

let lines = fs.readFileSync(file, 'utf8').split('\n');

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("{activeTab === 'settings' && <div>")) {
    startIndex = i;
  }
  if (startIndex !== -1 && i > startIndex && lines[i].includes("{activeTab === 'landing' && <div>")) {
    endIndex = i - 1;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  let extractedLines = lines.slice(startIndex, endIndex);
  
  let codeContent = extractedLines.join('\n');
  codeContent = codeContent.replace("{activeTab === 'settings' && <div>", "<div>");
  
  let componentCode = `import React from 'react';

export default function SettingsTab({
  settingsData, handleSettingChange, handleSaveAll, isSaving, handleAddArrayItem, handleRemoveArrayItem, handleArrayItemChange
}) {
  return (
    ${codeContent}
  );
}
`;
  
  fs.writeFileSync(targetFile, componentCode);
  
  const replacement = `        {activeTab === 'settings' && (
          <SettingsTab
            settingsData={settingsData}
            handleSettingChange={handleSettingChange}
            handleSaveAll={handleSaveAll}
            isSaving={isSaving}
            handleAddArrayItem={handleAddArrayItem}
            handleRemoveArrayItem={handleRemoveArrayItem}
            handleArrayItemChange={handleArrayItemChange}
          />
        )}`;
        
  lines.splice(startIndex, endIndex - startIndex, replacement);
  lines.splice(3, 0, "import SettingsTab from '../components/admin/tabs/SettingsTab';");
  
  fs.writeFileSync(file, lines.join('\n'));
  console.log('Extracted SettingsTab!');
} else {
  console.log('Boundaries not found.');
}
