const fs = require('fs');

// 1. Fix the Client Portal to save the message
let clientCode = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');
clientCode = clientCode.replace(
  "department: newTicketDepartment,",
  "department: newTicketDepartment,\n      message: newTicketMessage,"
);
fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', clientCode);

// 2. Fix Admin Dashboard to view the message
let adminCode = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8');

// We need a state for the ticket details modal
const adminStateHooksRegex = /(const \[activeTab, setActiveTab\] = useState\('leads'\);)/;
adminCode = adminCode.replace(
  adminStateHooksRegex,
  "$1\n  const [viewingTicket, setViewingTicket] = useState(null);"
);

// Add the View button in the table row
const actionTdRegex = /(<td style={{ padding: '1rem', fontSize: '0\.85rem', textAlign: 'right' }}>\s*<select)/;
adminCode = adminCode.replace(
  actionTdRegex,
  `<td style={{ padding: '1rem', fontSize: '0.85rem', textAlign: 'right' }}>
                        <button type="button" onClick={() => setViewingTicket(ticket)} style={{ marginRight: '10px', padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                          <i className="fa-solid fa-eye"></i> İncele
                        </button>
                        <select`
);

// Add the Ticket Details Modal at the end of the admin-section
const adminSectionEndRegex = /(<\/table>\s*<\/div>\s*<\/div>\s*\)\})/;
adminCode = adminCode.replace(
  adminSectionEndRegex,
  `</table>
            </div>

            {/* Ticket View Modal */}
            {viewingTicket && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)' }}>Talep Detayı: {viewingTicket.id}</h3>
                    <button onClick={() => setViewingTicket(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Müşteri (Marka)</span>
                      <strong style={{ color: 'var(--text-dark)', fontSize: '0.9rem' }}>{viewingTicket.brandName}</strong>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Departman</span>
                        <strong style={{ color: 'var(--text-dark)', fontSize: '0.9rem' }}>{viewingTicket.department}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Tarih</span>
                        <strong style={{ color: 'var(--text-dark)', fontSize: '0.9rem' }}>{viewingTicket.date}</strong>
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Konu</span>
                      <strong style={{ color: 'var(--text-dark)', fontSize: '0.9rem' }}>{viewingTicket.subject}</strong>
                    </div>
                    <div style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Müşterinin Mesajı:</span>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dark)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {viewingTicket.message || 'Bu talep için detaylı mesaj girilmemiş.'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                      <button onClick={() => setViewingTicket(null)} className="btn btn-primary">Kapat</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}`
);

fs.writeFileSync('src/pages/AdminDashboardView.jsx', adminCode);
