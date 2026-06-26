const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(
  `let title, description, keywords;`,
  `let title, description, keywords;\n    let noIndex = false;`
);

fs.writeFileSync('src/App.jsx', c);
console.log("noIndex fixed");
