const fs = require('fs');
let content = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

// 1. Add imports
content = content.replace(
  "import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';",
  "import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';\nimport { io } from 'socket.io-client';"
);

// 2. Add state and useEffect for backendTickets
content = content.replace(
  "const [activeTab, setActiveTab] = useState('overview');",
  "const [backendTickets, setBackendTickets] = useState([]);\n  const [socket, setSocket] = useState(null);\n\n  useEffect(() => {\n    if (isLoggedIn) {\n      const fetchTickets = async () => {\n        try {\n          const res = await fetch('/api/client/tickets', {\n            headers: { 'x-clerk-id': user?.id || 'demo' }\n          });\n          const data = await res.json();\n          if (data.success) {\n            setBackendTickets(data.data);\n          }\n        } catch (err) {}\n      };\n      fetchTickets();\n\n      const newSocket = io();\n      setSocket(newSocket);\n\n      newSocket.on('new_ticket', fetchTickets);\n      newSocket.on('new_message', fetchTickets);\n      newSocket.on('ticket_updated', fetchTickets);\n\n      return () => newSocket.disconnect();\n    }\n  }, [isLoggedIn, user?.id]);\n\n  const [activeTab, setActiveTab] = useState('overview');"
);

// 3. Sync viewingTicket
content = content.replace(
  "if (viewingTicket && clientReports && activeBrand) {",
  "if (viewingTicket && backendTickets.length > 0) {\n      const updated = backendTickets.find(t => t.id === viewingTicket.id);\n      if (updated && JSON.stringify(updated.messages) !== JSON.stringify(viewingTicket.messages)) {\n        setViewingTicket({ ...updated });\n      }\n    }\n    if (false) {"
);

// 4. handleClientReplySubmit
content = content.replace(
  /const handleClientReplySubmit = async \(e\) => \{[\s\S]*?setClientReplyText\(''\);\n  \};/,
  `const handleClientReplySubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!clientReplyText.trim() || !viewingTicket) return;

    try {
      await fetch(\`/api/tickets/\${viewingTicket.id}/messages\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'client', text: clientReplyText.trim() })
      });
      setClientReplyText('');
    } catch(e) {}
  };`
);

// 5. handleCreateTicket
content = content.replace(
  /const handleCreateTicket = async \(e\) => \{[\s\S]*?setIsSubmittingTicket\(false\);\n    \}\n  \};/,
  `const handleCreateTicket = async (e) => {
    e.preventDefault();
    setIsSubmittingTicket(true);
    
    try {
      await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          clerkId: user?.id || 'demo',
          subject: newTicketSubject,
          department: newTicketDepartment,
          text: newTicketMessage
        })
      });
      setNewTicketSubject('');
      setNewTicketMessage('');
      setTicketSuccess(true);
    } catch (err) {
      console.error(err);
      toast.error('Talep oluşturulurken bir hata oluştu.');
    } finally {
      setIsSubmittingTicket(false);
    }
  };`
);

// 6. handleAiActionRequest
content = content.replace(
  /const handleAiActionRequest = async \(insightText\) => \{[\s\S]*?setAiRequestLoading\(false\);\n    \}\n  \};/,
  `const handleAiActionRequest = async (insightText) => {
    setAiRequestLoading(true);
    try {
      await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          clerkId: user?.id || 'demo',
          subject: \`AI Öneri Talebi: \${insightText.substring(0, 30)}...\`,
          department: 'Yapay Zeka Önerileri',
          text: \`Müşteri, yapay zeka önerisi doğrultusunda "\\\${insightText}" talebinde bulundu.\`
        })
      });
      setAiRequestSuccess(true);
      setTimeout(() => setAiRequestSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setAiRequestLoading(false);
    }
  };`
);

// 7. Render mapping logic
content = content.replace(
  /\/\/ Merge tickets from currentData \+ localStorage queue for full picture[\s\S]*?Henüz destek talebiniz bulunmuyor\.[\s\S]*?<\/\tr>\n                        \);\n                      \}/,
  `if (backendTickets.length === 0) {
                        return (
                          <tr>
                            <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                              Henüz destek talebiniz bulunmuyor.
                            </td>
                          </tr>
                        );
                      }`
);

content = content.replace(
  "return merged.map((ticket, idx) => {",
  "return backendTickets.map((ticket, idx) => {"
);

content = content.replace(
  "{(viewingTicket.messages || []).map((msg, i) => (",
  "{(viewingTicket.messages || []).map((msg, i) => {\n                  const dateStr = msg.createdAt ? new Date(msg.createdAt).toLocaleString('tr-TR') : msg.date;\n                  return ("
);

content = content.replace(
  "{msg.sender === 'admin' ? 'Yönetici Yanıtı' : 'Siz'} • {msg.date}",
  "{msg.sender === 'admin' ? 'Yönetici Yanıtı' : 'Siz'} • {dateStr}"
);

content = content.replace(
  "ticket.date",
  "ticket.createdAt ? new Date(ticket.createdAt).toLocaleString('tr-TR') : ticket.date"
);

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', content, 'utf8');
console.log('Fixed ClientTransparencyPageView.jsx');
