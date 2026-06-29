const fs = require('fs');

const adminFile = 'src/pages/AdminDashboardView.jsx';
const tabFile = 'src/components/admin/tabs/TestimonialsTab.jsx';

let adminLines = fs.readFileSync(adminFile, 'utf8').split('\n');
let tabLines = fs.readFileSync(tabFile, 'utf8').split('\n');

const statesToMove = [];

// Remove states
const states = [
  "const [testSearch, setTestSearch] = useState('');",
  "const [testCatFilter, setTestCatFilter] = useState('all');"
];

for (const stateLine of states) {
  let index = adminLines.findIndex(line => line.includes(stateLine.replace('const', '').trim()));
  if (index !== -1) {
    statesToMove.push(adminLines[index].trim());
    adminLines.splice(index, 1);
  }
}

// Add states to TestimonialsTab.jsx
let insertIndex = tabLines.findIndex(line => line.includes('}) {')) + 1;
tabLines.splice(insertIndex, 0, ...statesToMove);

// Add openEditModal, handleDeleteItem to props
let propsIndex = tabLines.findIndex(line => line.includes('testimonialsData, setTestimonialsData, handleSaveAll, isSaving, settingsData, setSettingsData'));
if (propsIndex !== -1) {
  tabLines[propsIndex] = tabLines[propsIndex].replace(
    'testimonialsData, setTestimonialsData, handleSaveAll, isSaving, settingsData, setSettingsData',
    'testimonialsData, setTestimonialsData, handleSaveAll, isSaving, settingsData, setSettingsData, openEditModal, handleDeleteItem'
  );
}

// Pass props in AdminDashboardView
let adminPropsIndex = adminLines.findIndex(line => line.includes('              settingsData={settingsData}'));
if (adminPropsIndex !== -1) {
  adminLines.splice(adminPropsIndex, 0, '              openEditModal={openEditModal}', '              handleDeleteItem={handleDeleteItem}');
}

fs.writeFileSync(adminFile, adminLines.join('\n'));
fs.writeFileSync(tabFile, tabLines.join('\n'));
