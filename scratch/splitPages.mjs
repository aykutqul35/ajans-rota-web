import fs from 'fs';
import path from 'path';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';

const APP_JSX = path.join(process.cwd(), 'src', 'App.jsx');
const PAGES_DIR = path.join(process.cwd(), 'src', 'pages');

if (!fs.existsSync(PAGES_DIR)) {
  fs.mkdirSync(PAGES_DIR, { recursive: true });
}

const code = fs.readFileSync(APP_JSX, 'utf-8');

const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['jsx']
});

const pagesToExtract = [
  'ServicePageView',
  'IzmirPageView',
  'AegeanSuccessMap',
  'TestimonialsPageView',
  'ContactPageView',
  'SeoAuditPageView',
  'KobiIndexPageView',
  'CreativeShowcasePageView',
  'CompetitorAnalysisPageView',
  'AkademiPageView',
  'WhatsAppAssistantWidget',
  'AboutPageView',
  'LegalPageView',
  'TeamPageView',
  'BlogPageView',
  'AdminDashboardView'
];

let extractedComponents = {};

traverse(ast, {
  FunctionDeclaration(path) {
    if (pagesToExtract.includes(path.node.id.name)) {
      extractedComponents[path.node.id.name] = generate(path.node).code;
      // Remove from AST
      path.remove();
    }
  }
});

const imports = `import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { budgetSteps, initialServicePagesData, featuredStories, initialTeamMembers, initialBlogPosts, categories, whyAgencyData, testimonials } from '../data/mockData';
import FadeIn from '../components/FadeIn';
import StaggerContainer, { StaggerItem } from '../components/StaggerContainer';
import ClientTransparencyPageView from '../components/ClientTransparencyPageView';\n\n`;

for (const [name, componentCode] of Object.entries(extractedComponents)) {
  const fileContent = `${imports}export default ${componentCode}\n`;
  fs.writeFileSync(path.join(PAGES_DIR, `${name}.jsx`), fileContent);
  console.log(`Extracted ${name}.jsx`);
}

// Generate the new App.jsx code
const newAppCode = generate(ast).code;
fs.writeFileSync(APP_JSX, newAppCode);
console.log('App.jsx has been updated.');
