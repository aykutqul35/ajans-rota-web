const fs = require('fs');
const file = 'src/pages/AdminDashboardView.jsx';
const targetFile = 'src/components/admin/tabs/TicketsTab.jsx';

let lines = fs.readFileSync(file, 'utf8').split('\n');

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("{activeTab === 'tickets' && (")) {
    startIndex = i;
  }
  if (startIndex !== -1 && i > startIndex && lines[i].includes("{activeTab === 'reports' && (")) {
    endIndex = i - 1;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  let extractedLines = lines.slice(startIndex, endIndex);
  
  let codeContent = extractedLines.join('\n');
  codeContent = codeContent.replace("{activeTab === 'tickets' && (", "");
  
  // Find the matching parenthesis for `{activeTab === 'tickets' && (` and remove it
  let lastCloseParenIndex = codeContent.lastIndexOf(')}');
  if (lastCloseParenIndex !== -1) {
      codeContent = codeContent.substring(0, lastCloseParenIndex) + codeContent.substring(lastCloseParenIndex + 2);
  }

  let componentCode = `import React from 'react';

export default function TicketsTab({
  tickets, handleDeleteTicket, updateTicketStatus, openTicketDetail
}) {
  return (
    <>
      ${codeContent}
    </>
  );
}
`;
  
  fs.writeFileSync(targetFile, componentCode);
  
  const replacement = `        {activeTab === 'tickets' && (
          <TicketsTab
            tickets={tickets}
            handleDeleteTicket={handleDeleteTicket}
            updateTicketStatus={updateTicketStatus}
            openTicketDetail={openTicketDetail}
          />
        )}`;
        
  lines.splice(startIndex, endIndex - startIndex, replacement);
  lines.splice(3, 0, "import TicketsTab from '../components/admin/tabs/TicketsTab';");
  
  fs.writeFileSync(file, lines.join('\n'));
  console.log('Extracted TicketsTab!');
} else {
  console.log('Boundaries not found.');
}
