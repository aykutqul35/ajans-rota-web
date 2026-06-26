const fs = require('fs');

let indexJs = fs.readFileSync('api/clients/index.js', 'utf8');
if (!indexJs.includes("import bcrypt from 'bcryptjs';")) {
  indexJs = indexJs.replace("import { neon } from '@neondatabase/serverless';", "import { neon } from '@neondatabase/serverless';\nimport bcrypt from 'bcryptjs';");
}
indexJs = indexJs.replace(
  "const password_hash = password; // Warning: Plain text for simplicity in this demo!",
  "const password_hash = await bcrypt.hash(password, 10);"
);
fs.writeFileSync('api/clients/index.js', indexJs);

console.log("Patched api/clients/index.js");
