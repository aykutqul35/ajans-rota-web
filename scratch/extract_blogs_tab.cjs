const fs = require('fs');
const file = 'src/pages/AdminDashboardView.jsx';
const targetFile = 'src/components/admin/tabs/BlogsTab.jsx';

let lines = fs.readFileSync(file, 'utf8').split('\n');

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("{activeTab === 'blogs' && <div>")) {
    startIndex = i;
  }
  if (startIndex !== -1 && i > startIndex && lines[i].includes("{activeTab === 'tickets' && (")) {
    endIndex = i - 1;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  let extractedLines = lines.slice(startIndex, endIndex);
  
  let codeContent = extractedLines.join('\n');
  codeContent = codeContent.replace("{activeTab === 'blogs' && <div>", "<div>");
  
  let componentCode = `import React from 'react';

export default function BlogsTab({
  blogsData, setBlogsData, openEditModal, handleDeleteItem
}) {
  return (
    ${codeContent}
  );
}
`;
  
  fs.writeFileSync(targetFile, componentCode);
  
  const replacement = `          {activeTab === 'blogs' && (
            <BlogsTab
              blogsData={blogsData}
              setBlogsData={setBlogsData}
              openEditModal={openEditModal}
              handleDeleteItem={handleDeleteItem}
            />
          )}`;
        
  lines.splice(startIndex, endIndex - startIndex, replacement);
  lines.splice(3, 0, "import BlogsTab from '../components/admin/tabs/BlogsTab';");
  
  fs.writeFileSync(file, lines.join('\n'));
  console.log('Extracted BlogsTab!');
} else {
  console.log('Boundaries not found.');
}
