const fs = require('fs');

const adminFile = 'src/pages/AdminDashboardView.jsx';
const landingFile = 'src/components/admin/tabs/LandingTab.jsx';

let adminLines = fs.readFileSync(adminFile, 'utf8').split('\n');
let landingLines = fs.readFileSync(landingFile, 'utf8').split('\n');

const statesToMove = [];

// 1. Remove activeLandingSection
let index = adminLines.findIndex(line => line.includes("const [activeLandingSection, setActiveLandingSection] = useState('hero');"));
if (index !== -1) {
  statesToMove.push(adminLines[index].trim());
  adminLines.splice(index, 1);
}

// Add states to LandingTab.jsx
let landingInsertIndex = landingLines.findIndex(line => line.includes('}) {')) + 1;
landingLines.splice(landingInsertIndex, 0, ...statesToMove);

if (!landingLines.find(line => line.includes("import { useState }"))) {
  landingLines[0] = "import React, { useState } from 'react';";
}

// Add settingsData to LandingTab props
let landingPropsIndex = landingLines.findIndex(line => line.includes('landingData, setLandingData, handleSaveAll, isSaving,'));
if (landingPropsIndex !== -1) {
  landingLines[landingPropsIndex] = landingLines[landingPropsIndex].replace(
    'landingData, setLandingData, handleSaveAll, isSaving,',
    'landingData, setLandingData, handleSaveAll, isSaving, settingsData, setSettingsData,'
  );
}

fs.writeFileSync(adminFile, adminLines.join('\n'));
fs.writeFileSync(landingFile, landingLines.join('\n'));
