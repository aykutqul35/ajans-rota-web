const fs = require('fs');
let c = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

// 1. Add states for Ticket modal
const stateHooksEnd = `const [activeTab, setActiveTab] = useState('overview');`;
const ticketStates = `\n  const [showTicketModal, setShowTicketModal] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketDepartment, setNewTicketDepartment] = useState('Genel Destek');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);`;
c = c.replace(stateHooksEnd, stateHooksEnd + ticketStates);

// 2. Add handleCreateTicket function
const handleLoginFunc = `const handleLogin = async (e) => {`;
const createTicketFunc = `
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setIsSubmittingTicket(true);
    
    const newTicket = {
      id: "T-" + Math.floor(1000 + Math.random() * 9000),
      subject: newTicketSubject,
      department: newTicketDepartment,
      status: "Açık",
      date: new Date().toLocaleDateString('tr-TR') + " " + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    try {
      // API call to update client reports
      const currentReports = JSON.parse(localStorage.getItem('clientReports')) || { ecommerce: defaultEcommerceData, b2b: defaultB2bData };
      const brandData = currentReports[activeBrand];
      
      if (!brandData.tickets) brandData.tickets = [];
      brandData.tickets.unshift(newTicket);
      
      currentReports[activeBrand] = brandData;
      localStorage.setItem('clientReports', JSON.stringify(currentReports));
      
      // Update local state to reflect immediately
      currentData.tickets = brandData.tickets;
      
      setShowTicketModal(false);
      setNewTicketSubject('');
      setNewTicketMessage('');
      alert('Talebiniz başarıyla oluşturuldu. Ekibimiz en kısa sürede dönüş yapacaktır.');
    } catch (err) {
      console.error(err);
      alert('Talep oluşturulurken bir hata oluştu.');
    } finally {
      setIsSubmittingTicket(false);
    }
  };
`;
c = c.replace(handleLoginFunc, createTicketFunc + "\n  " + handleLoginFunc);

// 3. Update the "Yeni Talep" button to open modal
c = c.replace(
  "onClick={() => alert('Yeni talep açma modülü eklenecek.')}",
  "onClick={() => setShowTicketModal(true)}"
);

// 4. Add Ticket Modal UI right before the closing wrapper div
const modalUI = `
        {/* Ticket Creation Modal */}
        {showTicketModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2rem',
              width: '100%',
              maxWidth: '500px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>Yeni Talep Oluştur</h3>
                <button onClick={() => setShowTicketModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#f8fafc', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Departman</label>
                  <select 
                    value={newTicketDepartment}
                    onChange={(e) => setNewTicketDepartment(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#f8fafc', outline: 'none' }}
                  >
                    <option value="Genel Destek">Genel Destek</option>
                    <option value="Reklam & Bütçe">Reklam & Bütçe</option>
                    <option value="Tasarım & Kreatif">Tasarım & Kreatif</option>
                    <option value="Yazılım">Yazılım</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#f8fafc', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Konu</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Talebinizin kısa özeti..."
                    value={newTicketSubject}
                    onChange={(e) => setNewTicketSubject(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#f8fafc', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#f8fafc', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Mesajınız</label>
                  <textarea 
                    required 
                    rows="4" 
                    placeholder="Detaylı bilgi..."
                    value={newTicketMessage}
                    onChange={(e) => setNewTicketMessage(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#f8fafc', outline: 'none', resize: 'vertical' }}
                  ></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowTicketModal(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#f8fafc', cursor: 'pointer', fontWeight: 600 }}>
                    İptal
                  </button>
                  <button type="submit" disabled={isSubmittingTicket} style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)' }}>
                    {isSubmittingTicket ? 'Gönderiliyor...' : 'Gönder'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
`;

const closingDivs = `
      </div>
    </div>
    </div>
  );
}`;

c = c.replace(closingDivs, modalUI + "\n" + closingDivs);

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', c);
