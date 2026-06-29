const fs = require('fs');
const file = 'src/pages/AdminDashboardView.jsx';
const targetFile = 'src/components/admin/modals/LeadDetailModal.jsx';

let lines = fs.readFileSync(file, 'utf8').split('\n');

// Helper: find a function by its declaration and extract it (with brace matching)
function extractFunction(lines, searchStr) {
  let startIndex = lines.findIndex(l => l.includes(searchStr));
  if (startIndex === -1) return { code: null, start: -1, end: -1 };
  
  let endIndex = startIndex;
  let braceCount = 0;
  let foundBrace = false;
  for (let i = startIndex; i < lines.length; i++) {
    const opens = (lines[i].match(/\{/g) || []).length;
    const closes = (lines[i].match(/\}/g) || []).length;
    braceCount += opens - closes;
    if (opens > 0) foundBrace = true;
    if (foundBrace && braceCount <= 0) {
      endIndex = i;
      break;
    }
  }
  return { code: lines.slice(startIndex, endIndex + 1).join('\n'), start: startIndex, end: endIndex };
}

// 1. Extract the JSX for Lead Detail Modal (lines 3384-3832)
let jsxStart = lines.findIndex(l => l.includes('{/* LEAD DETAIL MODAL */}'));
let jsxEnd = -1;
for (let i = jsxStart + 1; i < lines.length; i++) {
  if (lines[i].includes('{/* ADD / EDIT EDITING MODAL */}')) {
    jsxEnd = i - 1;
    while (jsxEnd > jsxStart && lines[jsxEnd].trim() === '') jsxEnd--;
    break;
  }
}
let modalJSX = lines.slice(jsxStart, jsxEnd + 1).join('\n');

// 2. Collect all functions to move (with ranges)
const funcSignatures = [
  'const getIconForLabel = label =>',
  'const generateDynamicRoadmap = (type, params, improvements) =>',
  'const parseProposalDetails = messageText =>',
  'const handleDownloadProposalPDF = lead =>',
  'const generateProposalPDF = lead =>',
  'const handleSendProposalEmail = async lead =>',
  'const getStatusLabel = status =>',
  'const handleSaveCRM = (leadId, newStatus, newNotes, newReminderDate) =>',
  'const handleDownloadPDF = lead =>',
  'const generatePDF = lead =>',
  'const renderSimulatorData = lead =>',
  'const getSectorLabel = (t, s) =>',
  'const renderLeadMessage = lead =>',
  'const exportLeadsToCSV = dataToExport =>',
  'const getLocalGuideFallback = (guideTitle, lead) =>',
  'const handleGenerateGuidePDFWithAI = async lead =>',
  'const handleDownloadGuidePDF = (lead, aiContent) =>',
  'const generateGuidePDF = (lead, aiContent) =>',
  'const handleSendGuideEmail = async lead =>',
];

const extractedFuncs = [];
funcSignatures.forEach(sig => {
  const result = extractFunction(lines, sig);
  if (result.code) {
    extractedFuncs.push(result);
  } else {
    console.log(`WARNING: Could not find function: ${sig}`);
  }
});

// 3. Collect states to move
const stateSignatures = [
  "const [selectedLead, setSelectedLead] = useState(null);",
  "const [crmStatus, setCrmStatus] = useState('yeni');",
  "const [crmNotes, setCrmNotes] = useState('');",
  "const [crmReminderDate, setCrmReminderDate] = useState('');",
  "const [leadSearchText, setLeadSearchText] = useState('');",
  "const [leadSourceFilter, setLeadSourceFilter] = useState('all');",
  "const [leadServiceFilter, setLeadServiceFilter] = useState('all');",
  "const [leadStatusFilter, setLeadStatusFilter] = useState('all');",
  "const [aiGuideLoading, setAiGuideLoading] = useState(false);",
  "const [aiGuideContents, setAiGuideContents] = useState({});",
  "const [isSendingGuide, setIsSendingGuide] = useState(false);",
  "const [isSendingProposal, setIsSendingProposal] = useState(false);",
];

const extractedStates = [];
stateSignatures.forEach(sig => {
  const idx = lines.findIndex(l => l.includes(sig));
  if (idx !== -1) {
    extractedStates.push({ line: idx, code: lines[idx].trim() });
  } else {
    console.log(`WARNING: Could not find state: ${sig}`);
  }
});

// Also find the useEffect that depends on selectedLead
let ueIdx = lines.findIndex(l => l.includes('}, [selectedLead]);'));
let ueStart = -1;
if (ueIdx !== -1) {
  // Walk back to find useEffect(
  for (let i = ueIdx; i >= 0; i--) {
    if (lines[i].includes('useEffect(')) {
      ueStart = i;
      break;
    }
  }
}

console.log(`\nSummary:`);
console.log(`  Modal JSX: ${jsxEnd - jsxStart + 1} lines (${jsxStart+1}-${jsxEnd+1})`);
console.log(`  Functions to move: ${extractedFuncs.length}`);
console.log(`  States to move: ${extractedStates.length}`);
console.log(`  useEffect for selectedLead: lines ${ueStart+1}-${ueIdx+1}`);

// 4. Build the component file
let funcCode = extractedFuncs.map(f => f.code).join('\n\n');
let stateCode = extractedStates.map(s => s.code).join('\n  ');
let useEffectCode = '';
if (ueStart !== -1) {
  useEffectCode = lines.slice(ueStart, ueIdx + 1).join('\n');
}

let componentCode = `import React, { useState, useEffect } from 'react';

export default function LeadDetailModal({
  selectedLead, setSelectedLead,
  leadsData, setLeadsData, saveLeadsOnly, handleViewLead, handleDeleteLead,
  settingsData, authToken, isSaving, handleSaveAll
}) {
  ${stateCode}
  
  ${useEffectCode}

  ${funcCode}

  if (!selectedLead) return null;

  return (
    ${modalJSX}
  );
}
`;

fs.writeFileSync(targetFile, componentCode);
console.log(`\nWrote ${targetFile}`);

// 5. Remove extracted code from AdminDashboardView.jsx
// Sort ranges in reverse order to splice from bottom to top
let rangesToRemove = [];

// Add JSX range
rangesToRemove.push({ start: jsxStart, end: jsxEnd });

// Add function ranges
extractedFuncs.forEach(f => {
  rangesToRemove.push({ start: f.start, end: f.end });
});

// Add state ranges
extractedStates.forEach(s => {
  rangesToRemove.push({ start: s.line, end: s.line });
});

// Add useEffect range
if (ueStart !== -1) {
  rangesToRemove.push({ start: ueStart, end: ueIdx });
}

// Sort in reverse order by start
rangesToRemove.sort((a, b) => b.start - a.start);

// Remove ranges
rangesToRemove.forEach(range => {
  lines.splice(range.start, range.end - range.start + 1);
});

// Add import
let lastImportIdx = lines.findIndex(l => l.includes("import AddClientModal"));
lines.splice(lastImportIdx + 1, 0, "import LeadDetailModal from '../components/admin/modals/LeadDetailModal';");

// Add LeadDetailModal JSX where the old modal was
let mainCloseIdx = lines.findIndex(l => l.includes('</main>'));
let insertPoint = mainCloseIdx + 2; // after </div> that follows </main>
// Find the right spot (after the closing div of the layout)
for (let i = mainCloseIdx; i < lines.length; i++) {
  if (lines[i].includes('{/* ADD / EDIT EDITING MODAL */}')) {
    insertPoint = i;
    break;
  }
}

const leadModalReplacement = `      {/* LEAD DETAIL MODAL */}
      <LeadDetailModal
        selectedLead={selectedLead}
        setSelectedLead={setSelectedLead}
        leadsData={leadsData}
        setLeadsData={setLeadsData}
        saveLeadsOnly={saveLeadsOnly}
        handleViewLead={handleViewLead}
        handleDeleteLead={handleDeleteLead}
        settingsData={settingsData}
        authToken={authToken}
        isSaving={isSaving}
        handleSaveAll={handleSaveAll}
      />
`;

lines.splice(insertPoint, 0, leadModalReplacement);

fs.writeFileSync(file, lines.join('\n'));
console.log('Updated AdminDashboardView.jsx');
