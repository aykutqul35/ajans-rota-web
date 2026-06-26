const fs = require('fs');

let content = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

// 1. Add SaaS features states
content = content.replace(
  "const [showDemoInfo, setShowDemoInfo] = useState(false);",
  `const [showDemoInfo, setShowDemoInfo] = useState(false);

  // SaaS Features States
  const [aiRequestLoading, setAiRequestLoading] = useState(false);
  const [aiRequestSuccess, setAiRequestSuccess] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  
  const handleAiActionRequest = async (insightText) => {
    setAiRequestLoading(true);
    try {
      const updated = { ...clientReports };
      if (!updated[activeBrand]) return;
      if (!updated[activeBrand].ai_requests) updated[activeBrand].ai_requests = [];
      updated[activeBrand].ai_requests.push({
        id: Date.now(),
        date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }),
        insight: insightText,
        status: 'pending'
      });
      setClientReports(updated);
      
      const localDbStr = localStorage.getItem('ajans_rota_db');
      if (localDbStr) {
        try {
          const dbPayload = JSON.parse(localDbStr);
          dbPayload.clientReports = updated;
          localStorage.setItem('ajans_rota_db', JSON.stringify(dbPayload));
        } catch(e) {}
      }
      
      if (updated[activeBrand].client_id) {
        await fetch('/api/clients/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            client_id: updated[activeBrand].client_id, 
            report_data: updated[activeBrand]
          })
        });
      }
      setAiRequestSuccess(true);
      setTimeout(() => setAiRequestSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setAiRequestLoading(false);
    }
  };`
);

// 2. Add Tab
content = content.replace(
  "{ id: 'vault', label: 'Dosya Kasam', icon: 'fa-solid fa-vault' },",
  `{ id: 'vault', label: 'Dosya Kasam', icon: 'fa-solid fa-vault' },
            { id: 'billing', label: 'Faturalar & Bütçe', icon: 'fa-solid fa-file-invoice-dollar' },`
);

// 3. Add Billing Content before API Content
content = content.replace(
  "{/* --- TAB: API INTEGRATIONS --- */}",
  `{/* --- TAB: BILLING --- */}
        {activeTab === 'billing' && (
          <div className="tab-content-billing fade-in">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
              Faturalar & Bütçe Yönetimi (Stripe)
            </h2>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'
            }}>
              {(currentData.invoices || [
                { id: 101, title: 'Haziran 2026 - Retainer Danışmanlık Ücreti', amount: '20.000 TL', status: 'pending', date: '25 Haziran 2026' },
                { id: 102, title: 'Mayıs 2026 - Reklam Bütçesi Top-up', amount: '50.000 TL', status: 'paid', date: '01 Mayıs 2026' }
              ]).map(invoice => (
                <div key={invoice.id} style={{
                  background: '#fff', borderRadius: '16px', border: '1px solid rgba(15, 23, 42, 0.08)',
                  padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                      }}>
                        <i className="fa-solid fa-file-invoice"></i>
                      </div>
                      <span style={{
                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                        background: invoice.status === 'paid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: invoice.status === 'paid' ? '#10b981' : '#ef4444'
                      }}>
                        {invoice.status === 'paid' ? 'Ödendi' : 'Bekliyor'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                      {invoice.title}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                      <i className="fa-regular fa-calendar" style={{ marginRight: '6px' }}></i> Son Ödeme: {invoice.date}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(15, 23, 42, 0.06)', paddingTop: '1rem' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                      {invoice.amount}
                    </div>
                    {invoice.status === 'pending' ? (
                      <button className="btn btn-primary" onClick={() => {
                        const proceed = window.confirm("Stripe Test Mode: " + invoice.amount + " tutarındaki ödemeyi gerçekleştirmek istiyor musunuz?\\n\\nBu işlem, kredi kartı simülasyonunu tamamlayacak ve faturanızı Vercel Blob'a PDF olarak otomatik yükleyecektir.");
                        if(proceed) {
                           setBillingLoading(true);
                           setTimeout(async () => {
                             try {
                               const updated = {...clientReports};
                               if(!updated[activeBrand].invoices) updated[activeBrand].invoices = [];
                               const invIdx = updated[activeBrand].invoices.findIndex(i => i.id === invoice.id);
                               if(invIdx > -1) {
                                 updated[activeBrand].invoices[invIdx].status = 'paid';
                               } else {
                                 invoice.status = 'paid';
                                 updated[activeBrand].invoices.push(invoice);
                               }
                               setClientReports(updated);
                               
                               if(updated[activeBrand].client_id) {
                                  await fetch('/api/clients/update', {
                                    method: 'PUT',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({
                                      client_id: updated[activeBrand].client_id,
                                      report_data: updated[activeBrand]
                                    })
                                  });
                               }
                               
                               const webhookUrl = localStorage.getItem('rota_webhook_url');
                               if (webhookUrl) {
                                  fetch(webhookUrl, {
                                    method: 'POST',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({ content: \`💳 **\${currentData.brandName}**, \${invoice.amount} tutarındaki "\${invoice.title}" faturasını Stripe üzerinden ödedi.\` })
                                  }).catch(() => {});
                               }
                               
                               alert("Ödeme başarıyla alındı ve Vercel Blob'a Fatura PDF'i yüklendi!");
                             } catch(err) { console.error(err); } finally {
                               setBillingLoading(false);
                             }
                           }, 2000);
                        }
                      }} disabled={billingLoading} style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
                        {billingLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <><i className="fa-regular fa-credit-card"></i> Kredi Kartı ile Öde</>}
                      </button>
                    ) : (
                      <button className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }} onClick={() => {
                        alert("Vercel Blob: Fatura PDF'i indiriliyor...");
                      }}>
                        <i className="fa-solid fa-download"></i> PDF İndir
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB: API INTEGRATIONS --- */}`
);

// 4. Update AI Box
content = content.replace(
  "Yapay Zeka Yönetici Özeti",
  "Yapay Zeka Yönetici Özeti & Öneriler"
);

const searchAiP = "<p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.6', margin: 0 }}>";
const replaceAiP = "<p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.6', margin: '0 0 1rem 0' }}>";
content = content.replace(searchAiP, replaceAiP);

const insertAfterAiP = "                    {currentData.aiSummary}\n                  </p>";
const aiInsightHtml = `                    {currentData.aiSummary}
                  </p>
                  
                  {/* AI Actionable Insight */}
                  <div style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.1)' }}></div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-dark)', fontWeight: 600 }}>
                        {activeBrand === 'ecommerce' 
                          ? "CPL maliyetiniz düştü, yeni bir Reels kreatifi çekmenizi öneriyoruz." 
                          : "LinkedIn form optimizasyonu için bütçe artırımı tavsiye ediliyor."}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleAiActionRequest(activeBrand === 'ecommerce' ? "Yeni Reels Kreatif Çekimi" : "LinkedIn Bütçe Artırımı")}
                      disabled={aiRequestLoading || aiRequestSuccess}
                      style={{
                        padding: '0.5rem 1.25rem',
                        background: aiRequestSuccess ? '#10b981' : 'var(--text-dark)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: (aiRequestLoading || aiRequestSuccess) ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {aiRequestLoading ? (
                        <><i className="fa-solid fa-spinner fa-spin"></i> İletiliyor...</>
                      ) : aiRequestSuccess ? (
                        <><i className="fa-solid fa-check"></i> Talep Edildi</>
                      ) : (
                        <>Talep Et <i className="fa-solid fa-arrow-right"></i></>
                      )}
                    </button>
                  </div>`;
                  
content = content.replace(insertAfterAiP, aiInsightHtml);

// 5. Add webhook triggers to creatives approval
content = content.replace(
  "alert('Tasarım onaylandı olarak işaretlendi ve ajansa bildirildi!');",
  `const webhookUrl = localStorage.getItem('rota_webhook_url');
                             if (webhookUrl) {
                               fetch(webhookUrl, {
                                 method: 'POST',
                                 headers: {'Content-Type': 'application/json'},
                                 body: JSON.stringify({ content: \`✅ **\${currentData.brandName}**, "\${creative.title}" adlı kreatifi ONAYLADI.\` })
                               }).catch(() => {});
                             }
                             alert('Tasarım onaylandı olarak işaretlendi ve ajansa bildirildi!');`
);

content = content.replace(
  "alert('Tasarım reddedildi olarak işaretlendi ve ajansa bildirildi!');",
  `const webhookUrl = localStorage.getItem('rota_webhook_url');
                             if (webhookUrl) {
                               fetch(webhookUrl, {
                                 method: 'POST',
                                 headers: {'Content-Type': 'application/json'},
                                 body: JSON.stringify({ content: \`❌ **\${currentData.brandName}**, "\${creative.title}" adlı kreatifi REDDETTİ.\` })
                               }).catch(() => {});
                             }
                             alert('Tasarım reddedildi olarak işaretlendi ve ajansa bildirildi!');`
);

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', content);
console.log('Successfully applied all changes to ClientTransparencyPageView.jsx');
