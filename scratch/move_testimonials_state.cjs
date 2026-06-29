const fs = require('fs');

const adminFile = 'src/pages/AdminDashboardView.jsx';
const tabFile = 'src/components/admin/tabs/TestimonialsTab.jsx';

let adminLines = fs.readFileSync(adminFile, 'utf8').split('\n');
let tabLines = fs.readFileSync(tabFile, 'utf8').split('\n');

const statesToMove = [];

// 1. Remove activeTestimonialsSection
let index = adminLines.findIndex(line => line.includes("const [activeTestimonialsSection, setActiveTestimonialsSection] = useState('reviews');"));
if (index !== -1) {
  statesToMove.push(adminLines[index].trim());
  adminLines.splice(index, 1);
}

// Add states to TestimonialsTab.jsx
let insertIndex = tabLines.findIndex(line => line.includes('}) {')) + 1;
tabLines.splice(insertIndex, 0, ...statesToMove);

if (!tabLines.find(line => line.includes("import { useState }"))) {
  tabLines[0] = "import React, { useState } from 'react';";
}

// Fix TestimonialsTab props
let propsIndex = tabLines.findIndex(line => line.includes('testimonialsData, setTestimonialsData, handleSaveAll, isSaving, handleAddArrayItem, handleRemoveArrayItem, handleArrayItemChange'));
if (propsIndex !== -1) {
  tabLines[propsIndex] = tabLines[propsIndex].replace(
    'testimonialsData, setTestimonialsData, handleSaveAll, isSaving, handleAddArrayItem, handleRemoveArrayItem, handleArrayItemChange',
    'testimonialsData, setTestimonialsData, handleSaveAll, isSaving, settingsData, setSettingsData'
  );
}

// Fix AdminDashboardView props for TestimonialsTab
let adminPropsIndex = adminLines.findIndex(line => line.includes('handleAddArrayItem={handleAddArrayItem}'));
if (adminPropsIndex !== -1) {
  // Remove the 3 array handlers
  adminLines.splice(adminPropsIndex, 3);
  // Add settingsData
  adminLines.splice(adminPropsIndex, 0, '              settingsData={settingsData}', '              setSettingsData={setSettingsData}');
}

fs.writeFileSync(adminFile, adminLines.join('\n'));
fs.writeFileSync(tabFile, tabLines.join('\n'));
