const fs = require('fs');

const adminFile = 'src/pages/AdminDashboardView.jsx';
const settingsFile = 'src/components/admin/tabs/SettingsTab.jsx';

let adminLines = fs.readFileSync(adminFile, 'utf8').split('\n');
let settingsLines = fs.readFileSync(settingsFile, 'utf8').split('\n');

// The states to move
const statesToMove = [
  "  const [activeGeneralSettingsTab, setActiveGeneralSettingsTab] = useState('company');",
  "  const [companySettingsSubTab, setCompanySettingsSubTab] = useState('identity');",
  "  const [contactSettingsSubTab, setContactSettingsSubTab] = useState('address');",
  "  const [legalSettingsSubTab, setLegalSettingsSubTab] = useState('kvkk');",
  "  const [settingsAccordion, setSettingsAccordion] = useState({});",
  "  const [legalEditorPreview, setLegalEditorPreview] = useState({});",
  "  const [activeSeoTab, setActiveSeoTab] = useState('general');",
  "  const [sitemapLoading, setSitemapLoading] = useState(false);",
  "  const [sitemapStatus, setSitemapStatus] = useState(null);",
  "  const [sitemapError, setSitemapError] = useState(null);"
];

// 1. Remove from AdminDashboardView
for (const stateLine of statesToMove) {
  const index = adminLines.findIndex(line => line.includes(stateLine.trim()));
  if (index !== -1) {
    adminLines.splice(index, 1);
  }
}

// 2. Remove functions related to these states from AdminDashboardView
const funcsToRemoveStartStrs = [
  "const toggleSettingsSection = (",
  "const insertHtmlTag = (",
  "const loadLegalTemplate = (",
  "const handleGenerateSitemap = async ("
];

for (const startStr of funcsToRemoveStartStrs) {
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
    
    // Extract function code to move it to SettingsTab
    const funcCode = adminLines.slice(startIndex, endIndex + 1).join('\n');
    statesToMove.push(funcCode);
    
    adminLines.splice(startIndex, endIndex - startIndex + 1);
  }
}

// 3. Add them to SettingsTab
let settingsInsertIndex = settingsLines.findIndex(line => line.includes('}) {')) + 1;
settingsLines.splice(settingsInsertIndex, 0, ...statesToMove.join('\n\n').split('\n'));

// Add useState and toast imports to SettingsTab if not present
if (!settingsLines.find(line => line.includes("import { useState }"))) {
  settingsLines[0] = "import React, { useState } from 'react';";
}
if (!settingsLines.find(line => line.includes("import toast"))) {
  settingsLines.splice(1, 0, "import toast from 'react-hot-toast';");
}

fs.writeFileSync(adminFile, adminLines.join('\n'));
fs.writeFileSync(settingsFile, settingsLines.join('\n'));

console.log('States moved successfully');
