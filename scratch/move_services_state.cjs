const fs = require('fs');

const adminFile = 'src/pages/AdminDashboardView.jsx';
const servicesFile = 'src/components/admin/tabs/ServicesTab.jsx';

let adminLines = fs.readFileSync(adminFile, 'utf8').split('\n');
let servicesLines = fs.readFileSync(servicesFile, 'utf8').split('\n');

const statesToMove = [];

// 1. Remove states
const states = [
  "const [activeServiceEditSection, setActiveServiceEditSection] = useState('basic');",
  "const [editingServiceKey, setEditingServiceKey] = useState('google');"
];

for (const stateLine of states) {
  let index = adminLines.findIndex(line => line.includes(stateLine.replace('const', '').trim()));
  if (index !== -1) {
    statesToMove.push(adminLines[index].trim());
    adminLines.splice(index, 1);
  }
}

// 2. Remove handlers
const handlers = [
  "const handleServiceFieldChange = (",
  "const handleServiceNestedChange = (",
  "const handleFeatureChange = (",
  "const handleAddFeature = ()",
  "const handleDeleteFeature = ",
  "const handleMetricChange = (",
  "const handleAddMetric = ()",
  "const handleDeleteMetric = ",
  "const handleFaqChange = (",
  "const handleAddFaq = ()",
  "const handleDeleteFaq = ",
  "const handleProcessChange = (",
  "const handleAddProcessStep = ()",
  "const handleDeleteProcessStep = ",
  "const handleAddNewService = ()",
  "const handleDeleteService = "
];

for (const startStr of handlers) {
  let startIndex = adminLines.findIndex(line => line.includes(startStr));
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
}

// Add states to ServicesTab.jsx
let servicesInsertIndex = servicesLines.findIndex(line => line.includes('}) {')) + 1;
servicesLines.splice(servicesInsertIndex, 0, ...statesToMove.join('\n\n').split('\n'));

fs.writeFileSync(adminFile, adminLines.join('\n'));
fs.writeFileSync(servicesFile, servicesLines.join('\n'));
console.log("Moved services states and handlers!");
