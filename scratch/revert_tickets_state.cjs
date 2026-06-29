const fs = require('fs');

const adminFile = 'src/pages/AdminDashboardView.jsx';
const tabFile = 'src/components/admin/tabs/TicketsTab.jsx';

let adminLines = fs.readFileSync(adminFile, 'utf8').split('\n');
let tabLines = fs.readFileSync(tabFile, 'utf8').split('\n');

const statesToRevert = [];

// Find viewingTicket state in tabFile
let vtIndex = tabLines.findIndex(line => line.includes("const [viewingTicket, setViewingTicket] = useState(null);"));
if (vtIndex !== -1) {
  statesToRevert.push(tabLines[vtIndex].trim() + " // leads, settings, services, testimonials, team, blogs, analytics");
  tabLines.splice(vtIndex, 1);
}

// Find adminReplyText in tabFile
let artIndex = tabLines.findIndex(line => line.includes("const [adminReplyText, setAdminReplyText] = useState('');"));
if (artIndex !== -1) {
  statesToRevert.push(tabLines[artIndex].trim());
  tabLines.splice(artIndex, 1);
}

// Find handleAdminReplySubmit in tabFile
let hrsIndex = tabLines.findIndex(line => line.includes("const handleAdminReplySubmit = (e) => {"));
if (hrsIndex !== -1) {
  let endIndex = hrsIndex;
  let braceCount = 0;
  let foundBrace = false;
  for (let i = hrsIndex; i < tabLines.length; i++) {
    if (tabLines[i].includes('{')) { braceCount += (tabLines[i].match(/\{/g) || []).length; foundBrace = true; }
    if (tabLines[i].includes('}')) { braceCount -= (tabLines[i].match(/\}/g) || []).length; }
    if (foundBrace && braceCount === 0) {
      endIndex = i;
      break;
    }
  }
  const funcCode = tabLines.slice(hrsIndex, endIndex + 1).join('\n');
  statesToRevert.push(funcCode);
  tabLines.splice(hrsIndex, endIndex - hrsIndex + 1);
}


// Add states back to AdminDashboardView.jsx
let adminInsertIndex = adminLines.findIndex(line => line.includes('const [activeTab, setActiveTab]')) - 1;
adminLines.splice(adminInsertIndex, 0, statesToRevert[0], statesToRevert[1]);

let adminFuncInsertIndex = adminLines.findIndex(line => line.includes('const moveTeamMember = (index, direction)')) - 1;
if(adminFuncInsertIndex < 0) adminFuncInsertIndex = adminLines.findIndex(line => line.includes('const handleServiceFieldChange')) - 1;
if(adminFuncInsertIndex < 0) adminFuncInsertIndex = 3000; // fallback
adminLines.splice(adminFuncInsertIndex, 0, ...statesToRevert[2].split('\n'));


// Fix TicketsTab props
let propsIndex = tabLines.findIndex(line => line.includes('clientReports, setClientReports'));
if (propsIndex !== -1) {
  tabLines[propsIndex] = tabLines[propsIndex].replace(
    'clientReports, setClientReports',
    'clientReports, setClientReports, viewingTicket, setViewingTicket, adminReplyText, setAdminReplyText, handleAdminReplySubmit'
  );
}

// Fix AdminDashboardView props for TicketsTab
let adminPropsIndex = adminLines.findIndex(line => line.includes('            setClientReports={setClientReports}'));
if (adminPropsIndex !== -1) {
  adminLines.splice(adminPropsIndex + 1, 0, 
    '            viewingTicket={viewingTicket}',
    '            setViewingTicket={setViewingTicket}',
    '            adminReplyText={adminReplyText}',
    '            setAdminReplyText={setAdminReplyText}',
    '            handleAdminReplySubmit={handleAdminReplySubmit}'
  );
}

fs.writeFileSync(adminFile, adminLines.join('\n'));
fs.writeFileSync(tabFile, tabLines.join('\n'));
