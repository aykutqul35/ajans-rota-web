const fs = require('fs');
const file = 'src/pages/AdminDashboardView.jsx';
const targetFile = 'src/components/admin/tabs/ReportsTab.jsx';

let lines = fs.readFileSync(file, 'utf8').split('\n');

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("{activeTab === 'reports' && (")) {
    startIndex = i;
  }
}

if (startIndex !== -1) {
  // It ends before the closing of the main admin container `</div> </div>` at the end of the file.
  // But let's find the exact `{activeTab === 'reports' && (` closing parenthesis.
  let content = lines.slice(startIndex).join('\n');
  
  let matchStr = "{activeTab === 'reports' && (";
  let searchContent = content.substring(matchStr.length);
  
  let braceCount = 1; // Since we matched `(`
  let endPos = -1;
  for (let i = 0; i < searchContent.length; i++) {
    if (searchContent[i] === '(') braceCount++;
    if (searchContent[i] === ')') braceCount--;
    if (braceCount === 0) {
      endPos = i;
      break;
    }
  }
  
  if(endPos !== -1) {
      let extractedJSX = searchContent.substring(0, endPos);
      let componentCode = `import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

export default function ReportsTab({
  clientReports, setClientReports, editingReportBrand, setEditingReportBrand,
  isAddClientModalOpen, setIsAddClientModalOpen, newClientFormData, setNewClientFormData,
  authToken
}) {
  return (
    <>
      ${extractedJSX}
    </>
  );
}
`;
      fs.writeFileSync(targetFile, componentCode);
      
      let replacement = `        {activeTab === 'reports' && (
          <ReportsTab
            clientReports={clientReports}
            setClientReports={setClientReports}
            editingReportBrand={editingReportBrand}
            setEditingReportBrand={setEditingReportBrand}
            isAddClientModalOpen={isAddClientModalOpen}
            setIsAddClientModalOpen={setIsAddClientModalOpen}
            newClientFormData={newClientFormData}
            setNewClientFormData={setNewClientFormData}
            authToken={authToken}
          />
        )}`;
        
      let before = content.substring(0, matchStr.length + endPos + 2); // ')}'
      let numLinesToRemove = before.split('\n').length;
      
      lines.splice(startIndex, numLinesToRemove, replacement);
      lines.splice(3, 0, "import ReportsTab from '../components/admin/tabs/ReportsTab';");
      
      fs.writeFileSync(file, lines.join('\n'));
      console.log('Extracted ReportsTab!');
  } else {
      console.log('End parenthesis not found for reports.');
  }

} else {
  console.log('Boundaries not found.');
}
