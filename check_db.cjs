const fs = require('fs');
let db = {};
try {
  const data = fs.readFileSync('data/database.json', 'utf8');
  db = JSON.parse(data);
} catch (e) {
  console.log("DB read error:", e);
}

console.log("Global settings custom_head_code:", db.global_settings?.custom_head_code);
