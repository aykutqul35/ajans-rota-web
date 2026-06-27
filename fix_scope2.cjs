const fs = require('fs');
let code = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

const statesToMove = `  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketDepartment, setNewTicketDepartment] = useState('Genel Destek');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Login States
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('local_client_logged_in') === 'true');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);

  // SaaS Features States
  const [aiRequestLoading, setAiRequestLoading] = useState(false);
  const [aiRequestSuccess, setAiRequestSuccess] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);`;

code = code.replace(statesToMove, ''); // Remove from original position

const insertTarget = `  const [animTrigger, setAnimTrigger] = useState(false);`;
code = code.replace(insertTarget, insertTarget + "\n\n" + statesToMove);

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', code);
console.log("Scope fixed!");
