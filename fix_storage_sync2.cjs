const fs = require('fs');

let adminCode = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8');

const adminStateAnchor = "const [editingReportBrand, setEditingReportBrand] = useState('ecommerce');";
const syncEffect = `
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'clientReports') {
        try {
          if (e.newValue) setClientReports(JSON.parse(e.newValue));
        } catch(err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
`;

if (adminCode.includes(adminStateAnchor) && !adminCode.includes("handleStorageChange")) {
  adminCode = adminCode.replace(adminStateAnchor, adminStateAnchor + "\n" + syncEffect);
  fs.writeFileSync('src/pages/AdminDashboardView.jsx', adminCode);
  console.log("Added sync to Admin");
}

let clientCode = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');
const clientStateAnchor = "const [showTicketModal, setShowTicketModal] = useState(false);";

if (clientCode.includes(clientStateAnchor) && !clientCode.includes("handleStorageChange")) {
  clientCode = clientCode.replace(clientStateAnchor, clientStateAnchor + "\n" + syncEffect);
  fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', clientCode);
  console.log("Added sync to Client");
}

