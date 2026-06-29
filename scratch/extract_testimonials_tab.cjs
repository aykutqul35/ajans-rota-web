const fs = require('fs');
const file = 'src/pages/AdminDashboardView.jsx';
const targetFile = 'src/components/admin/tabs/TestimonialsTab.jsx';

let lines = fs.readFileSync(file, 'utf8').split('\n');

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("{activeTab === 'testimonials' && <div>")) {
    startIndex = i;
  }
  if (startIndex !== -1 && i > startIndex && lines[i].includes("{activeTab === 'team' && <div>")) {
    endIndex = i - 1;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  let extractedLines = lines.slice(startIndex, endIndex);
  
  let codeContent = extractedLines.join('\n');
  codeContent = codeContent.replace("{activeTab === 'testimonials' && <div>", "<div>");
  
  let componentCode = `import React from 'react';

export default function TestimonialsTab({
  testimonialsData, setTestimonialsData, handleSaveAll, isSaving, handleAddArrayItem, handleRemoveArrayItem, handleArrayItemChange
}) {
  return (
    ${codeContent}
  );
}
`;
  
  fs.writeFileSync(targetFile, componentCode);
  
  const replacement = `          {activeTab === 'testimonials' && (
            <TestimonialsTab
              testimonialsData={testimonialsData}
              setTestimonialsData={setTestimonialsData}
              handleSaveAll={handleSaveAll}
              isSaving={isSaving}
              handleAddArrayItem={handleAddArrayItem}
              handleRemoveArrayItem={handleRemoveArrayItem}
              handleArrayItemChange={handleArrayItemChange}
            />
          )}`;
        
  lines.splice(startIndex, endIndex - startIndex, replacement);
  lines.splice(3, 0, "import TestimonialsTab from '../components/admin/tabs/TestimonialsTab';");
  
  fs.writeFileSync(file, lines.join('\n'));
  console.log('Extracted TestimonialsTab!');
} else {
  console.log('Boundaries not found.');
}
