const fs = require('fs');
const file = 'src/pages/AdminDashboardView.jsx';
const targetFile = 'src/components/admin/tabs/LandingTab.jsx';

let lines = fs.readFileSync(file, 'utf8').split('\n');

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("{activeTab === 'landing' && <div>")) {
    startIndex = i;
  }
  if (startIndex !== -1 && i > startIndex && lines[i].includes("{activeTab === 'services' && <div>")) {
    endIndex = i - 1;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  let extractedLines = lines.slice(startIndex, endIndex);
  
  let codeContent = extractedLines.join('\n');
  codeContent = codeContent.replace("{activeTab === 'landing' && <div>", "<div>");
  
  let componentCode = `import React from 'react';

export default function LandingTab({
  landingData, setLandingData, handleSaveAll, isSaving, 
  handleLandingArrayItemAdd, handleLandingArrayItemRemove, handleLandingArrayItemChange
}) {
  return (
    ${codeContent}
  );
}
`;
  
  fs.writeFileSync(targetFile, componentCode);
  
  const replacement = `        {activeTab === 'landing' && (
          <LandingTab
            landingData={landingData}
            setLandingData={setLandingData}
            handleSaveAll={handleSaveAll}
            isSaving={isSaving}
            handleLandingArrayItemAdd={handleLandingArrayItemAdd}
            handleLandingArrayItemRemove={handleLandingArrayItemRemove}
            handleLandingArrayItemChange={handleLandingArrayItemChange}
          />
        )}`;
        
  lines.splice(startIndex, endIndex - startIndex, replacement);
  lines.splice(3, 0, "import LandingTab from '../components/admin/tabs/LandingTab';");
  
  fs.writeFileSync(file, lines.join('\n'));
  console.log('Extracted LandingTab!');
} else {
  console.log('Boundaries not found.');
}
