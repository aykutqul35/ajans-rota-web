const fs = require('fs');
const file = 'src/pages/AdminDashboardView.jsx';
const targetFile = 'src/components/admin/tabs/ClientReportsTab.jsx';

let lines = fs.readFileSync(file, 'utf8').split('\n');

// The reports tab starts at `{activeTab === 'reports' && <div>` and ends just before `        </main>`
let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("{activeTab === 'reports' && <div>")) {
    startIndex = i;
  }
  if (startIndex !== -1 && lines[i].includes("        </main>")) {
    endIndex = i - 1;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  let extracted = lines.slice(startIndex, endIndex + 1).join('\n');
  
  // Create ClientReportsTab.jsx
  let componentCode = `import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientReportsTab({
  clientReports, setClientReports,
  editingReportBrand, setEditingReportBrand,
  setIsAddClientModalOpen, handleReportFieldChange,
  handleReportNestedFieldChange, handleDeleteClient,
  addReportArrayItem, removeReportArrayItem,
  handleReportArrayFieldChange, handleSaveAll, isSaving,
  activeTab
}) {
  return (
    ${extracted.replace("{activeTab === 'reports' && <div>", "<div>")}
  );
}
`;
  fs.writeFileSync(targetFile, componentCode);

  // Replace in AdminDashboardView.jsx
  const replacement = `        {activeTab === 'reports' && (
          <ClientReportsTab
            clientReports={clientReports}
            setClientReports={setClientReports}
            editingReportBrand={editingReportBrand}
            setEditingReportBrand={setEditingReportBrand}
            setIsAddClientModalOpen={setIsAddClientModalOpen}
            handleReportFieldChange={handleReportFieldChange}
            handleReportNestedFieldChange={handleReportNestedFieldChange}
            handleDeleteClient={handleDeleteClient}
            addReportArrayItem={addReportArrayItem}
            removeReportArrayItem={removeReportArrayItem}
            handleReportArrayFieldChange={handleReportArrayFieldChange}
            handleSaveAll={handleSaveAll}
            isSaving={isSaving}
            activeTab={activeTab}
          />
        )}`;
  
  lines.splice(startIndex, endIndex - startIndex + 1, replacement);
  
  // Add import
  lines.splice(3, 0, "import ClientReportsTab from '../components/admin/tabs/ClientReportsTab';");
  
  fs.writeFileSync(file, lines.join('\n'));
  console.log('Successfully extracted ClientReportsTab!');
} else {
  console.log('Could not find boundaries for ClientReportsTab.');
}
