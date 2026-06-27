const fs = require('fs');

let code = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

// 1. Add state
const stateAnchor = "const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);";
if (!code.includes("ticketSuccess")) {
  code = code.replace(stateAnchor, stateAnchor + "\n  const [ticketSuccess, setTicketSuccess] = useState(false);");
}

// 2. Modify handleCreateTicket to show success instead of closing modal and toasting
code = code.replace(
  /setShowTicketModal\(false\);\s*setNewTicketSubject\(''\);\s*setNewTicketMessage\(''\);\s*toast\.success\('Talebiniz başarıyla oluşturuldu\. Ekibimiz en kısa sürede dönüş yapacaktır\.'\);/,
  "setNewTicketSubject('');\n      setNewTicketMessage('');\n      setTicketSuccess(true);"
);

// 3. Inject the success UI inside the modal
const modalTitleAnchor = `<h3 style={{ fontSize: '1.2rem', color: '#f8fafc', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>`;
const modalBodyReplacement = `{ticketSuccess ? (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                  <i className="fa-solid fa-check" style={{ fontSize: '2.5rem', color: '#10b981' }}></i>
                </div>
                <h3 style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '1rem' }}>Talebiniz Alındı</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                  Talebiniz başarıyla ekibimize iletilmiştir. İlgili departman yöneticiniz konuyla ilgili en kısa sürede sizinle iletişime geçecektir.
                </p>
                <button 
                  onClick={() => { setShowTicketModal(false); setTicketSuccess(false); }}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', fontWeight: 600, background: '#0ea5e9', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  Tamam, Anladım
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>`;

code = code.replace(modalTitleAnchor, modalBodyReplacement);

// Close the React Fragment at the very end of the modal
const formEndAnchor = `</form>\n              </>\n            )}`;
code = code.replace(/<\/form>\s*<\/div>\s*<\/div>\s*\)/g, "</form>\n              </>\n            )}\n            </div>\n          </div>\n        )");

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', code);
console.log("Success modal added to Client Portal");
