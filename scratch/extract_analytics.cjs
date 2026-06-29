const fs = require('fs');
const file = 'src/pages/AdminDashboardView.jsx';
const targetFile = 'src/components/admin/tabs/AnalyticsTab.jsx';

let lines = fs.readFileSync(file, 'utf8').split('\n');

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("{activeTab === 'analytics' && (() => {")) {
    startIndex = i;
  }
  if (startIndex !== -1 && i > startIndex && lines[i].includes("})()}")) {
    endIndex = i;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  let extractedLines = lines.slice(startIndex + 1, endIndex);
  
  // Create component code
  let componentCode = `import React from 'react';
import { motion } from 'framer-motion';
import FadeIn from '../../FadeIn';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AnalyticsTab({
  analyticsData, isLoadingAnalytics, leadsData
}) {
  ${extractedLines.join('\n')}
}
`;
  
  fs.writeFileSync(targetFile, componentCode);
  
  // Replace in original file
  const replacement = `        {activeTab === 'analytics' && (
          <AnalyticsTab
            analyticsData={analyticsData}
            isLoadingAnalytics={isLoadingAnalytics}
            leadsData={leadsData}
          />
        )}`;
        
  lines.splice(startIndex, endIndex - startIndex + 1, replacement);
  lines.splice(3, 0, "import AnalyticsTab from '../components/admin/tabs/AnalyticsTab';");
  
  fs.writeFileSync(file, lines.join('\n'));
  console.log('Extracted AnalyticsTab!');
} else {
  console.log('Boundaries not found.');
}
