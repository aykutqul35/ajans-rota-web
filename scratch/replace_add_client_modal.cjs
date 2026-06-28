const fs = require('fs');
const file = 'src/pages/AdminDashboardView.jsx';
let content = fs.readFileSync(file, 'utf8');

const importStr = "import AddClientModal from '../components/admin/modals/AddClientModal';\n";
if (!content.includes('AddClientModal')) {
  // insert import at line 3 (index 2)
  let lines = content.split('\n');
  lines.splice(2, 0, importStr);
  content = lines.join('\n');
}

const startMarker = "{/* --- ADD NEW CLIENT MODAL --- */}";
// Find where it ends. It ends at the last div of the file.
// Let's just find the exact block from {isAddClientModalOpen && ( to the matching )}
// Wait, I can just use string replace.

const searchStartStr = `      {/* --- ADD NEW CLIENT MODAL --- */}
      {isAddClientModalOpen && (
        <div className="lead-modal-overlay"`;

const componentCall = `      {/* --- ADD NEW CLIENT MODAL --- */}
      <AddClientModal 
        isAddClientModalOpen={isAddClientModalOpen}
        setIsAddClientModalOpen={setIsAddClientModalOpen}
        newClientFormData={newClientFormData}
        setNewClientFormData={setNewClientFormData}
        clientReports={clientReports}
        setClientReports={setClientReports}
        setEditingReportBrand={setEditingReportBrand}
      />
    </div>;`;

// We will replace from {isAddClientModalOpen && ( down to </div>;
// Since this is exactly at the end of the file, let's use regex or slice.
const startIndex = content.indexOf(startMarker);
if (startIndex !== -1) {
  content = content.slice(0, startIndex) + componentCall + "\n}\n";
  fs.writeFileSync(file, content);
  console.log('Replaced successfully!');
} else {
  console.log('Could not find start marker.');
}

