const fs = require('fs');
const file = 'src/pages/AdminDashboardView.jsx';
const targetFile = 'src/components/admin/modals/LeadDetailModal.jsx';

let content = fs.readFileSync(file, 'utf8');
let lines = content.split('\n');

// Lead Detail Modal JSX: lines 3384 to 3832
let startLine = lines.findIndex(l => l.includes('{/* LEAD DETAIL MODAL */}'));
let endLine = -1;

// Find the closing of this modal - it's before the ADD/EDIT modal
for (let i = startLine + 1; i < lines.length; i++) {
  if (lines[i].includes('{/* ADD / EDIT EDITING MODAL */}')) {
    endLine = i - 1;
    // Go back to find last non-empty line
    while (endLine > startLine && lines[endLine].trim() === '') endLine--;
    break;
  }
}

console.log(`Lead Detail Modal: lines ${startLine+1} to ${endLine+1}`);

// Extract JSX
let modalJSX = lines.slice(startLine, endLine + 1).join('\n');

// Now find all the functions used ONLY in the lead detail modal
// These include: generatePDF, handleDownloadPDF, renderSimulatorData, getSectorLabel,
// renderLeadMessage, exportLeadsToCSV, handleGenerateGuidePDFWithAI, generateGuidePDF, 
// handleDownloadGuidePDF, getLocalGuideFallback, handleSendGuideEmail,
// generateDynamicRoadmap, parseProposalDetails, handleDownloadProposalPDF, 
// generateProposalPDF, handleSendProposalEmail, getStatusLabel, handleSaveCRM,
// getIconForLabel

// We'll collect the function names and their line ranges
const functionsToMove = [
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

// Also collect states used only in lead detail modal
const statesToMove = [
  'const [selectedLead, setSelectedLead] = useState(null);',
  'const [crmStatus, setCrmStatus] = useState(\'yeni\');',
  'const [crmNotes, setCrmNotes] = useState(\'\');',
  'const [crmReminderDate, setCrmReminderDate] = useState(\'\');',
  'const [leadSearchText, setLeadSearchText] = useState(\'\');',
  'const [leadSourceFilter, setLeadSourceFilter] = useState(\'all\');',
  'const [leadServiceFilter, setLeadServiceFilter] = useState(\'all\');',
  'const [leadStatusFilter, setLeadStatusFilter] = useState(\'all\');',
  'const [aiGuideLoading, setAiGuideLoading] = useState(false);',
  'const [aiGuideContents, setAiGuideContents] = useState({});',
  'const [isSendingGuide, setIsSendingGuide] = useState(false);',
  'const [isSendingProposal, setIsSendingProposal] = useState(false);',
];

console.log(`Found modal JSX from line ${startLine+1} to ${endLine+1} (${endLine - startLine + 1} lines)`);

// Just write the analysis for now
fs.writeFileSync('scratch/lead_modal_analysis.txt', JSON.stringify({
  jsxStart: startLine + 1,
  jsxEnd: endLine + 1,
  functionsToMove,
  statesToMove
}, null, 2));

console.log('Analysis saved.');
