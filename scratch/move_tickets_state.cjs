const fs = require('fs');

const adminFile = 'src/pages/AdminDashboardView.jsx';
const tabFile = 'src/components/admin/tabs/TicketsTab.jsx';

let adminLines = fs.readFileSync(adminFile, 'utf8').split('\n');
let tabLines = fs.readFileSync(tabFile, 'utf8').split('\n');

const statesToMove = [];

// Remove states
const states = [
  "const [viewingTicket, setViewingTicket] = useState(null);",
  "const [adminReplyText, setAdminReplyText] = useState('');"
];

for (const stateLine of states) {
  let index = adminLines.findIndex(line => line.includes(stateLine.replace('const', '').replace('; // leads, settings, services, testimonials, team, blogs, analytics', '').trim()));
  if (index !== -1) {
    statesToMove.push(adminLines[index].replace('; // leads, settings, services, testimonials, team, blogs, analytics', ';').trim());
    adminLines.splice(index, 1);
  }
}

// Remove handleAdminReplySubmit
let startIndex = adminLines.findIndex(line => line.includes("const handleAdminReplySubmit = (e) => {"));
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

// Add states to TicketsTab.jsx
let insertIndex = tabLines.findIndex(line => line.includes('}) {')) + 1;
tabLines.splice(insertIndex, 0, ...statesToMove.join('\n\n').split('\n'));

if (!tabLines.find(line => line.includes("import { useState }"))) {
  tabLines[0] = "import React, { useState } from 'react';";
}

// Fix TicketsTab props
let propsIndex = tabLines.findIndex(line => line.includes('tickets, handleDeleteTicket, updateTicketStatus, openTicketDetail'));
if (propsIndex !== -1) {
  tabLines[propsIndex] = tabLines[propsIndex].replace(
    'tickets, handleDeleteTicket, updateTicketStatus, openTicketDetail',
    'clientReports, setClientReports'
  );
}

// Fix AdminDashboardView props for TicketsTab
let adminPropsIndex = adminLines.findIndex(line => line.includes('            tickets={tickets}'));
if (adminPropsIndex !== -1) {
  // Remove tickets, handleDeleteTicket, updateTicketStatus, openTicketDetail
  adminLines.splice(adminPropsIndex, 4);
  // Add clientReports
  adminLines.splice(adminPropsIndex, 0, '            clientReports={clientReports}', '            setClientReports={setClientReports}');
}

fs.writeFileSync(adminFile, adminLines.join('\n'));
fs.writeFileSync(tabFile, tabLines.join('\n'));
