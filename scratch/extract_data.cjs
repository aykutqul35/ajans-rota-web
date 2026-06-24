const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const appJsxPath = path.join(__dirname, '../src/App.jsx');
const appJsxContent = fs.readFileSync(appJsxPath, 'utf8');
const lines = appJsxContent.split('\n');

// Extract slices
// servicePagesData: line 6 to 275 (0-indexed: 5 to 275)
const servicePagesDataSlice = lines.slice(5, 275).join('\n');

// teamMembers: line 871 to 992 (0-indexed: 870 to 992)
const teamMembersSlice = lines.slice(870, 992).join('\n');

// blogPosts: line 1101 to 1253 (0-indexed: 1100 to 1253)
const blogPostsSlice = lines.slice(1100, 1253).join('\n');

// testimonials: line 1606 to 2212 (0-indexed: 1605 to 2212)
const testimonialsSlice = lines.slice(1605, 2212).join('\n');

// Create a temp JS file to execute and output JSON
const tempJsPath = path.join(__dirname, 'temp_eval.js');
const tempJsContent = `
${servicePagesDataSlice}
const teamMembers = ${teamMembersSlice.replace(/^\s*const\s+teamMembers\s*=\s*/, '')}
const blogPosts = ${blogPostsSlice.replace(/^\s*const\s+blogPosts\s*=\s*/, '')}
const testimonials = ${testimonialsSlice.replace(/^\s*const\s+testimonials\s*=\s*/, '')}

const settings = {
  phone: "+90 554 128 60 56",
  email: "hello@ajansrota.com",
  address: "Uzaktan Çalışma (Remote) / İzmir, Ege",
  google_maps_url: "https://maps.google.com",
  instagram_url: "https://instagram.com/ajansrota",
  linkedin_url: "https://linkedin.com/company/ajansrota",
  whatsapp_url: "https://wa.me/905541286056"
};

console.log(JSON.stringify({
  settings,
  servicePagesData,
  teamMembers,
  blogPosts,
  testimonials,
  leads: []
}, null, 2));
`;

fs.writeFileSync(tempJsPath, tempJsContent, 'utf8');

// Execute the temp file and write to public/data.json
try {
  const output = execSync(`node "${tempJsPath}"`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const data = JSON.parse(output);
  const dataJsonPath = path.join(__dirname, '../public/data.json');
  fs.writeFileSync(dataJsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log("SUCCESS: public/data.json created successfully!");
} catch (err) {
  console.error("ERROR during extraction evaluation:", err);
} finally {
  // Clean up
  if (fs.existsSync(tempJsPath)) {
    fs.unlinkSync(tempJsPath);
  }
}
