const fs = require('fs');
const file = 'src/pages/AdminDashboardView.jsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

const componentCall = `          {activeTab === 'leads' && (
            <LeadsTab
              leadsData={leadsData}
              leadSearchText={leadSearchText}
              setLeadSearchText={setLeadSearchText}
              leadSourceFilter={leadSourceFilter}
              setLeadSourceFilter={setLeadSourceFilter}
              leadServiceFilter={leadServiceFilter}
              setLeadServiceFilter={setLeadServiceFilter}
              leadStatusFilter={leadStatusFilter}
              setLeadStatusFilter={setLeadStatusFilter}
              exportLeadsToCSV={exportLeadsToCSV}
              handleViewLead={handleViewLead}
              handleDeleteLead={handleDeleteLead}
              activeFollowUps={activeFollowUps}
              updateLeadStatus={updateLeadStatus}
            />
          )}`;

// Remove lines 3627 to 4566 (which is index 3626 to 4565)
// and insert the component call.
lines.splice(3626, 4566 - 3627 + 1, componentCall);

// We also need to add the import statement at the top.
// Line 2 has: import AdminSidebar from '../components/admin/AdminSidebar';
lines.splice(2, 0, "import LeadsTab from '../components/admin/tabs/LeadsTab';");

fs.writeFileSync(file, lines.join('\n'));
console.log('Replaced Leads Tab and added import!');
