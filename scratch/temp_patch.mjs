import fs from 'fs';

let blogCode = fs.readFileSync('src/pages/BlogPageView.jsx', 'utf8');

blogCode = blogCode.replace(/getCategoryLabel\(([^,]+),\s*categories\)/g, 'getCategoryLabel($1)');
blogCode = blogCode.replace(/getCategoryIcon\(([^,]+),\s*categories\)/g, 'getCategoryIcon($1)');

fs.writeFileSync('src/pages/BlogPageView.jsx', blogCode);
console.log('Patched BlogPageView.jsx arguments');
