const fs = require('fs');
const file = 'src/pages/AdminDashboardView.jsx';
const targetFile = 'src/components/admin/tabs/ServicesTab.jsx';

let lines = fs.readFileSync(file, 'utf8').split('\n');

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("{activeTab === 'services' && <div>")) {
    startIndex = i;
  }
  if (startIndex !== -1 && i > startIndex && lines[i].includes("{activeTab === 'testimonials' && <div>")) {
    endIndex = i - 1;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  let extractedLines = lines.slice(startIndex, endIndex);
  
  let codeContent = extractedLines.join('\n');
  codeContent = codeContent.replace("{activeTab === 'services' && <div>", "<div>");
  
  let componentCode = `import React, { useState } from 'react';

export default function ServicesTab({
  servicesData, setServicesData, handleSaveAll, isSaving, settingsData, setSettingsData, renderImageUploaderCard
}) {
  return (
    ${codeContent}
  );
}
`;
  
  fs.writeFileSync(targetFile, componentCode);
  
  const replacement = `        {activeTab === 'services' && (
          <ServicesTab
            servicesData={servicesData}
            setServicesData={setServicesData}
            handleSaveAll={handleSaveAll}
            isSaving={isSaving}
            settingsData={settingsData}
            setSettingsData={setSettingsData}
            renderImageUploaderCard={renderImageUploaderCard}
          />
        )}`;
        
  lines.splice(startIndex, endIndex - startIndex, replacement);
  lines.splice(3, 0, "import ServicesTab from '../components/admin/tabs/ServicesTab';");
  
  fs.writeFileSync(file, lines.join('\n'));
  console.log('Extracted ServicesTab!');
} else {
  console.log('Boundaries not found.');
}
