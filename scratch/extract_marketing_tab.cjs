const fs = require('fs');
const file = 'src/pages/AdminDashboardView.jsx';
const targetFile = 'src/components/admin/tabs/MarketingTab.jsx';

let lines = fs.readFileSync(file, 'utf8').split('\n');

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("{activeTab === 'marketing' && <div>")) {
    startIndex = i;
  }
  if (startIndex !== -1 && i > startIndex && lines[i].includes("{activeTab === 'settings' && <div>")) {
    endIndex = i - 1;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  let extractedLines = lines.slice(startIndex, endIndex);
  
  // Clean the top line and add closing braces properly
  let codeContent = extractedLines.join('\n');
  codeContent = codeContent.replace("{activeTab === 'marketing' && <div>", "<div>");
  
  // Create component code
  let componentCode = `import React from 'react';

export default function MarketingTab({
  scriptsData, handleScriptChange, handleSaveScripts, isSaving
}) {
  return (
    ${codeContent}
  );
}
`;
  
  fs.writeFileSync(targetFile, componentCode);
  
  // Replace in original file
  const replacement = `        {activeTab === 'marketing' && (
          <MarketingTab
            scriptsData={scriptsData}
            handleScriptChange={handleScriptChange}
            handleSaveScripts={handleSaveScripts}
            isSaving={isSaving}
          />
        )}`;
        
  lines.splice(startIndex, endIndex - startIndex, replacement);
  lines.splice(3, 0, "import MarketingTab from '../components/admin/tabs/MarketingTab';");
  
  fs.writeFileSync(file, lines.join('\n'));
  console.log('Extracted MarketingTab!');
} else {
  console.log('Boundaries not found.');
}
