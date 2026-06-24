import fs from 'fs';

const FILE_PATH = './src/App.jsx';
const TARGET_PATH = './src/data/mockData.js';

let content = fs.readFileSync(FILE_PATH, 'utf-8');
const variablesToExtract = [
  'budgetSteps',
  'initialServicePagesData',
  'featuredStories',
  'initialTeamMembers',
  'initialBlogPosts',
  'categories',
  'whyAgencyData',
  'testimonials' // This one is inside App() function, maybe use const or let
];

let mockDataContent = '';
let extractedNames = [];

function extractVariable(varName) {
  // Try to find "const varName = " or "let varName = "
  const regex = new RegExp(`(const|let)\\s+${varName}\\s*=\\s*([{\\[])`);
  const match = content.match(regex);
  if (!match) {
    console.log(`Could not find ${varName}`);
    return false;
  }

  const startIdx = match.index;
  const startChar = match[2];
  const openBracket = startChar;
  const closeBracket = startChar === '{' ? '}' : ']';

  let bracketCount = 0;
  let endIdx = -1;
  let inString = false;
  let stringChar = '';
  let escapeNext = false;

  const contentFromStart = content.substring(startIdx + match[0].length - 1);

  for (let i = 0; i < contentFromStart.length; i++) {
    const char = contentFromStart[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    if (!inString && (char === '"' || char === "'" || char === '`')) {
      inString = true;
      stringChar = char;
      continue;
    }

    if (inString && char === stringChar) {
      inString = false;
      continue;
    }

    if (!inString) {
      if (char === openBracket) bracketCount++;
      if (char === closeBracket) bracketCount--;

      if (bracketCount === 0) {
        endIdx = startIdx + match[0].length - 1 + i;
        break;
      }
    }
  }

  if (endIdx === -1) {
    console.log(`Could not find matching bracket for ${varName}`);
    return false;
  }

  // Include the semicolon if present
  let finalEndIdx = endIdx + 1;
  while (content[finalEndIdx] === ' ' || content[finalEndIdx] === '\t' || content[finalEndIdx] === '\n') {
    finalEndIdx++;
  }
  if (content[finalEndIdx] === ';') {
    finalEndIdx++;
  } else {
    // If no semicolon, back up
    finalEndIdx = endIdx + 1;
  }

  const extractedString = content.substring(startIdx, finalEndIdx);
  
  // Replace the varName declaration with an import (Wait! If it's inside App(), we can't import inside a function in ES modules.
  // Instead of replacing with import right there, we should just delete the declaration from its current spot,
  // and add the import at the top of the file.)
  
  content = content.slice(0, startIdx) + content.slice(finalEndIdx);
  
  // Format the extracted string to use export
  const exportString = `export ${extractedString.trim()}`;
  mockDataContent += exportString + '\n\n';
  extractedNames.push(varName);

  console.log(`Successfully extracted ${varName} (length: ${extractedString.length})`);
  return true;
}

variablesToExtract.forEach(extractVariable);

if (extractedNames.length > 0) {
  // Ensure the target directory exists
  if (!fs.existsSync('./src/data')) {
    fs.mkdirSync('./src/data', { recursive: true });
  }

  fs.writeFileSync(TARGET_PATH, mockDataContent);
  console.log(`Wrote extracted data to ${TARGET_PATH}`);

  // Add import to the top of App.jsx
  const importStatement = `import { ${extractedNames.join(', ')} } from './data/mockData';\n`;
  
  // Find the first non-import line
  let insertIdx = 0;
  const lines = content.split('\n');
  let newLines = [];
  let importAdded = false;
  for (let i = 0; i < lines.length; i++) {
    if (!importAdded && !lines[i].trim().startsWith('import') && lines[i].trim() !== '') {
      newLines.push(importStatement);
      importAdded = true;
    }
    newLines.push(lines[i]);
  }
  
  content = newLines.join('\n');
  
  fs.writeFileSync(FILE_PATH, content);
  console.log('Updated App.jsx with imports and removed extracted definitions.');
} else {
  console.log('No variables extracted.');
}
