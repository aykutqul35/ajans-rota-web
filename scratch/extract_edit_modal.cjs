const fs = require('fs');
const file = 'src/pages/AdminDashboardView.jsx';
const targetFile = 'src/components/admin/modals/EditItemModal.jsx';

let lines = fs.readFileSync(file, 'utf8').split('\n');

// Find EditItemModal JSX
let jsxStart = lines.findIndex(l => l.includes('{/* ADD / EDIT EDITING MODAL */}'));
let jsxEnd = -1;
for (let i = jsxStart + 1; i < lines.length; i++) {
  if (lines[i].includes('{/* --- ADD NEW CLIENT MODAL --- */}')) {
    jsxEnd = i - 1;
    while (jsxEnd > jsxStart && lines[jsxEnd].trim() === '') jsxEnd--;
    break;
  }
}

console.log(`EditItemModal JSX: lines ${jsxStart+1} to ${jsxEnd+1} (${jsxEnd - jsxStart + 1} lines)`);
let modalJSX = lines.slice(jsxStart, jsxEnd + 1).join('\n');

// Find functions used only by the edit modal
// openEditModal, handleModalSave, handleDeleteItem, handleModalFieldChange, insertHTMLTag
const funcSignatures = [
  'const openEditModal = (type, item) =>',
  'const handleModalSave = e =>',
  'const handleDeleteItem = (type, item) =>',
  'const handleModalFieldChange = (key, val) =>',
  'const insertHTMLTag = tagType =>',
];

function extractFunction(lines, searchStr) {
  let startIndex = lines.findIndex(l => l.includes(searchStr));
  if (startIndex === -1) return { code: null, start: -1, end: -1 };
  
  let endIndex = startIndex;
  let braceCount = 0;
  let foundBrace = false;
  for (let i = startIndex; i < lines.length; i++) {
    const opens = (lines[i].match(/\{/g) || []).length;
    const closes = (lines[i].match(/\}/g) || []).length;
    braceCount += opens - closes;
    if (opens > 0) foundBrace = true;
    if (foundBrace && braceCount <= 0) {
      endIndex = i;
      break;
    }
  }
  return { code: lines.slice(startIndex, endIndex + 1).join('\n'), start: startIndex, end: endIndex };
}

const extractedFuncs = [];
funcSignatures.forEach(sig => {
  const result = extractFunction(lines, sig);
  if (result.code) {
    extractedFuncs.push(result);
    console.log(`Found ${sig} at lines ${result.start+1}-${result.end+1}`);
  } else {
    console.log(`WARNING: Could not find function: ${sig}`);
  }
});

// Also get the handleGenerateAIBlog function and its states
const aiFuncs = [
  'const handleGenerateAIBlog = async e =>',
];
aiFuncs.forEach(sig => {
  const result = extractFunction(lines, sig);
  if (result.code) {
    extractedFuncs.push(result);
    console.log(`Found ${sig} at lines ${result.start+1}-${result.end+1}`);
  } else {
    console.log(`WARNING: Could not find function: ${sig}`);
  }
});

// AI blog states
const stateSignatures = [
  "const [aiKeywords, setAiKeywords] = useState('');",
  "const [aiLoading, setAiLoading] = useState(false);",
  "const [aiError, setAiError] = useState('');",
  "const [blogEditTab, setBlogEditTab] = useState('edit');",
];

const extractedStates = [];
stateSignatures.forEach(sig => {
  const idx = lines.findIndex(l => l.includes(sig));
  if (idx !== -1) {
    extractedStates.push({ line: idx, code: lines[idx].trim() });
    console.log(`Found state: ${sig.substring(0, 50)} at line ${idx+1}`);
  } else {
    console.log(`WARNING: Could not find state: ${sig}`);
  }
});

// Build the component
let funcCode = extractedFuncs.map(f => f.code).join('\n\n');
let stateCode = extractedStates.map(s => s.code).join('\n  ');

// Clean up JSX
modalJSX = modalJSX.replace("{/* ADD / EDIT EDITING MODAL */}", "");
modalJSX = modalJSX.replace("{editingItem && <div", "<div");
// Fix closing
let lastBraceIdx = modalJSX.lastIndexOf('</div>}');
if (lastBraceIdx !== -1) {
  modalJSX = modalJSX.substring(0, lastBraceIdx) + '</div>' + modalJSX.substring(lastBraceIdx + 7);
}

let componentCode = `import React, { useState } from 'react';

export default function EditItemModal({
  editingItem, setEditingItem, editingType, setEditingType,
  modalFormData, setModalFormData,
  testimonialsData, setTestimonialsData,
  teamMembersData, setTeamMembersData,
  blogsData, setBlogsData, handleSaveAll
}) {
  ${stateCode}

  ${funcCode}

  if (!editingItem) return null;

  return (
    ${modalJSX}
  );
}
`;

fs.writeFileSync(targetFile, componentCode);
console.log(`\nWrote ${targetFile}`);

// Remove extracted code from AdminDashboardView.jsx
let rangesToRemove = [];
rangesToRemove.push({ start: jsxStart, end: jsxEnd });
extractedFuncs.forEach(f => {
  rangesToRemove.push({ start: f.start, end: f.end });
});
extractedStates.forEach(s => {
  rangesToRemove.push({ start: s.line, end: s.line });
});

// Sort in reverse order
rangesToRemove.sort((a, b) => b.start - a.start);
rangesToRemove.forEach(range => {
  lines.splice(range.start, range.end - range.start + 1);
});

// Add import
let lastImportIdx = lines.findIndex(l => l.includes("import LeadDetailModal"));
lines.splice(lastImportIdx + 1, 0, "import EditItemModal from '../components/admin/modals/EditItemModal';");

// Add EditItemModal JSX where the old modal was
let addClientIdx = lines.findIndex(l => l.includes('{/* --- ADD NEW CLIENT MODAL --- */}'));
const editModalReplacement = `      {/* ADD / EDIT EDITING MODAL */}
      <EditItemModal
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        editingType={editingType}
        setEditingType={setEditingType}
        modalFormData={modalFormData}
        setModalFormData={setModalFormData}
        testimonialsData={testimonialsData}
        setTestimonialsData={setTestimonialsData}
        teamMembersData={teamMembersData}
        setTeamMembersData={setTeamMembersData}
        blogsData={blogsData}
        setBlogsData={setBlogsData}
        handleSaveAll={handleSaveAll}
      />
`;
lines.splice(addClientIdx, 0, editModalReplacement);

fs.writeFileSync(file, lines.join('\n'));
console.log('Updated AdminDashboardView.jsx');
