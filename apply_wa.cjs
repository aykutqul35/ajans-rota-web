const fs = require('fs');

// 1. UPDATE AdminDashboardView.jsx
let adminCode = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8');

// Replace state
adminCode = adminCode.replace(
  "const [webhookUrl, setWebhookUrl] = useState(localStorage.getItem('rota_webhook_url') || '');",
  "const [waPhone, setWaPhone] = useState(localStorage.getItem('rota_wa_phone') || '');\n  const [waApiKey, setWaApiKey] = useState(localStorage.getItem('rota_wa_apikey') || '');"
);

// Replace UI
const oldAccordion = `<button type="button" onClick={() => toggleSettingsSection('webhook')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: settingsAccordion.webhook ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-dark)' }}>
                      <i className="fa-brands fa-discord" style={{ color: '#5865F2', fontSize: '1.05rem' }}></i>
                      SaaS Bildirim Ayarları (Webhook)
                    </span>
                    <i className={\`fa-solid \${settingsAccordion.webhook ? 'fa-chevron-up' : 'fa-chevron-down'}\`} style={{ color: 'var(--primary)', fontSize: '0.85rem' }}></i>
                  </button>
                  {settingsAccordion.webhook && (
                    <div style={{ padding: '1.5rem', background: '#fff' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                          Müşterileriniz kreatifleri onayladığında veya faturalarını ödediğinde anında bildirim almak için Discord veya Slack Webhook URL'nizi buraya girin.
                        </p>
                        
                        <div className="admin-form-group">
                          <label>Webhook URL (Discord / Slack)</label>
                          <input 
                            type="text" 
                            value={webhookUrl} 
                            onChange={e => {
                               setWebhookUrl(e.target.value);
                               localStorage.setItem('rota_webhook_url', e.target.value);
                            }} 
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} 
                            placeholder="https://discord.com/api/webhooks/..." 
                          />
                        </div>
                    </div>
                  )}`;

const newAccordion = `<button type="button" onClick={() => toggleSettingsSection('webhook')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: settingsAccordion.webhook ? 'rgba(37, 211, 102, 0.05)' : 'rgba(255,255,255,0.7)', border: 'none', cursor: 'pointer' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-dark)' }}>
                      <i className="fa-brands fa-whatsapp" style={{ color: '#25D366', fontSize: '1.05rem' }}></i>
                      SaaS Bildirim Ayarları (WhatsApp)
                    </span>
                    <i className={\`fa-solid \${settingsAccordion.webhook ? 'fa-chevron-up' : 'fa-chevron-down'}\`} style={{ color: '#25D366', fontSize: '0.85rem' }}></i>
                  </button>
                  {settingsAccordion.webhook && (
                    <div style={{ padding: '1.5rem', background: '#fff' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.25rem', lineHeight: '1.5', padding: '1rem', background: 'rgba(37, 211, 102, 0.05)', borderRadius: '8px', border: '1px solid rgba(37, 211, 102, 0.2)' }}>
                          <strong>Kurulum Adımları (Sadece 10 saniye sürer):</strong><br/>
                          1. Telefonunuzun WhatsApp uygulamasına girin ve <b>+34 624 54 22 28</b> numarasını rehberinize "CallMeBot" olarak kaydedin.<br/>
                          2. Bu numaraya WhatsApp'tan <b>I allow callmebot to send me messages</b> yazıp gönderin.<br/>
                          3. Bot size otomatik olarak "API Key" değerinizi yanıt olarak gönderecektir.<br/>
                          4. Numaranızı ve botun verdiği API Key'i aşağıdaki alanlara girin.
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div className="admin-form-group">
                            <label>WhatsApp Numaranız</label>
                            <input 
                              type="text" 
                              value={waPhone} 
                              onChange={e => {
                                 setWaPhone(e.target.value);
                                 localStorage.setItem('rota_wa_phone', e.target.value);
                              }} 
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} 
                              placeholder="+905321234567 (Uluslararası formatta boşluksuz)" 
                            />
                          </div>
                          <div className="admin-form-group">
                            <label>API Key (CallMeBot)</label>
                            <input 
                              type="text" 
                              value={waApiKey} 
                              onChange={e => {
                                 setWaApiKey(e.target.value);
                                 localStorage.setItem('rota_wa_apikey', e.target.value);
                              }} 
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} 
                              placeholder="Örn: 123456" 
                            />
                          </div>
                        </div>
                    </div>
                  )}`;

adminCode = adminCode.replace(oldAccordion, newAccordion);
fs.writeFileSync('src/pages/AdminDashboardView.jsx', adminCode);

// 2. UPDATE ClientTransparencyPageView.jsx
let clientCode = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

// Replace Invoice webhook
const oldInvoiceWebhook = `const webhookUrl = localStorage.getItem('rota_webhook_url');
                               if (webhookUrl) {
                                  fetch(webhookUrl, {
                                    method: 'POST',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({ content: \`💳 **\${currentData.brandName}**, \${invoice.amount} tutarındaki "\${invoice.title}" faturasını Stripe üzerinden ödedi.\` })
                                  }).catch(() => {});
                               }`;

const newInvoiceWebhook = `const waPhone = localStorage.getItem('rota_wa_phone');
                               const waApiKey = localStorage.getItem('rota_wa_apikey');
                               if (waPhone && waApiKey) {
                                  const text = encodeURIComponent(\`💳 *Rota Bildirim:* \\n\${currentData.brandName}, \${invoice.amount} tutarındaki "\${invoice.title}" faturasını ödedi.\`);
                                  fetch(\`https://api.callmebot.com/whatsapp.php?phone=\${waPhone}&text=\${text}&apikey=\${waApiKey}\`, { mode: 'no-cors' }).catch(() => {});
                               }`;
clientCode = clientCode.replace(oldInvoiceWebhook, newInvoiceWebhook);

// Replace Creatives webhook (Approved)
const oldApproveWebhook = `const webhookUrl = localStorage.getItem('rota_webhook_url');
                             if (webhookUrl) {
                               fetch(webhookUrl, {
                                 method: 'POST',
                                 headers: {'Content-Type': 'application/json'},
                                 body: JSON.stringify({ content: \`✅ **\${currentData.brandName}**, "\${creative.title}" adlı kreatifi ONAYLADI.\` })
                               }).catch(() => {});
                             }`;
                             
const newApproveWebhook = `const waPhone = localStorage.getItem('rota_wa_phone');
                             const waApiKey = localStorage.getItem('rota_wa_apikey');
                             if (waPhone && waApiKey) {
                               const text = encodeURIComponent(\`✅ *Rota Kreatif Onayı:* \\n\${currentData.brandName}, "\${creative.title}" adlı kreatifi ONAYLADI.\`);
                               fetch(\`https://api.callmebot.com/whatsapp.php?phone=\${waPhone}&text=\${text}&apikey=\${waApiKey}\`, { mode: 'no-cors' }).catch(() => {});
                             }`;
clientCode = clientCode.replace(oldApproveWebhook, newApproveWebhook);

// Replace Creatives webhook (Rejected)
const oldRejectWebhook = `const webhookUrl = localStorage.getItem('rota_webhook_url');
                             if (webhookUrl) {
                               fetch(webhookUrl, {
                                 method: 'POST',
                                 headers: {'Content-Type': 'application/json'},
                                 body: JSON.stringify({ content: \`❌ **\${currentData.brandName}**, "\${creative.title}" adlı kreatifi REDDETTİ.\` })
                               }).catch(() => {});
                             }`;
                             
const newRejectWebhook = `const waPhone = localStorage.getItem('rota_wa_phone');
                             const waApiKey = localStorage.getItem('rota_wa_apikey');
                             if (waPhone && waApiKey) {
                               const text = encodeURIComponent(\`❌ *Rota Kreatif Reddi:* \\n\${currentData.brandName}, "\${creative.title}" adlı kreatifi REDDETTİ!\`);
                               fetch(\`https://api.callmebot.com/whatsapp.php?phone=\${waPhone}&text=\${text}&apikey=\${waApiKey}\`, { mode: 'no-cors' }).catch(() => {});
                             }`;
clientCode = clientCode.replace(oldRejectWebhook, newRejectWebhook);

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', clientCode);

console.log("WhatsApp notifications successfully integrated!");
