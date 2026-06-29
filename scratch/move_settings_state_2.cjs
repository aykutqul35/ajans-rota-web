const fs = require('fs');

const adminFile = 'src/pages/AdminDashboardView.jsx';
const settingsFile = 'src/components/admin/tabs/SettingsTab.jsx';

let adminLines = fs.readFileSync(adminFile, 'utf8').split('\n');
let settingsLines = fs.readFileSync(settingsFile, 'utf8').split('\n');

const statesToMove = [];

// 1. Remove aboutSettingsSubTab
let index = adminLines.findIndex(line => line.includes("const [aboutSettingsSubTab, setAboutSettingsSubTab] = useState('hero');"));
if (index !== -1) {
  statesToMove.push(adminLines[index].trim());
  adminLines.splice(index, 1);
}

// 2. Remove loadLegalTemplate
let startIndex = adminLines.findIndex(line => line.includes("const loadLegalTemplate = tabId => {"));
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

// Add states to SettingsTab.jsx just inside the function
let settingsInsertIndex = settingsLines.findIndex(line => line.includes('}) {')) + 1;
settingsLines.splice(settingsInsertIndex, 0, ...statesToMove.join('\n\n').split('\n'));

// Add setSettingsData back to props in SettingsTab
let settingsPropsIndex = settingsLines.findIndex(line => line.includes('settingsData, handleSaveAll, isSaving'));
if (settingsPropsIndex !== -1) {
  settingsLines[settingsPropsIndex] = settingsLines[settingsPropsIndex].replace(
    'settingsData, handleSaveAll, isSaving',
    'settingsData, setSettingsData, handleSaveAll, isSaving'
  );
}

fs.writeFileSync(adminFile, adminLines.join('\n'));
fs.writeFileSync(settingsFile, settingsLines.join('\n'));
