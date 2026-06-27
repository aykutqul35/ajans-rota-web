const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8');

const oldHandleAdminReplySubmit = `      ticket.status = 'Müşteri Yanıtı Bekleniyor';
      
      setClientReports(updatedClientReports);
      handleSaveAll(); 
      
      setViewingTicket({ ...ticket, brandKey: viewingTicket.brandKey });`;

const newHandleAdminReplySubmit = `      ticket.status = 'Müşteri Yanıtı Bekleniyor';
      
      setClientReports(updatedClientReports);
      
      // Save locally
      const dbPayload = {
        settings: settingsData,
        servicePagesData: servicesData,
        teamMembers: teamMembersData,
        blogPosts: blogsData,
        testimonials: testimonialsData,
        leads: leadsData,
        clientReports: updatedClientReports
      };
      localStorage.setItem('ajans_rota_db', JSON.stringify(dbPayload));

      // Specifically push the target brand to Neon DB
      if (brandData.client_id) {
        fetch('/api/clients/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${authToken}\`
          },
          body: JSON.stringify({ 
            client_id: brandData.client_id,
            report_data: brandData
          })
        }).catch(e => console.error("Admin ticket reply sync error", e));
      }
      
      setViewingTicket({ ...ticket, brandKey: viewingTicket.brandKey });`;

if (code.includes("ticket.status = 'Müşteri Yanıtı Bekleniyor';")) {
  code = code.replace(oldHandleAdminReplySubmit, newHandleAdminReplySubmit);
  fs.writeFileSync('src/pages/AdminDashboardView.jsx', code);
  console.log("Admin reply push fixed");
} else {
  console.log("Could not find Admin reply block");
}
